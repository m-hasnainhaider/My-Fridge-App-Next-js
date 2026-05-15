using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using MyFridgeAPI.Models;

namespace MyFridgeAPI.Repositories
{
    public class FridgeUsersRepository
    {
        private readonly string _connectionString;

        public FridgeUsersRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("MyFridgeDB");
        }

        // ------------------ GET ALL ------------------
        public List<FridgeUser> GetAll()
        {
            var list = new List<FridgeUser>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("SELECT * FROM FridgeUsers", conn))
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new FridgeUser
                        {
                            FridgeUser_Id = Convert.ToInt32(reader["FridgeUser_Id"]),
                            Fridge_Id = Convert.ToInt32(reader["Fridge_Id"]),
                            U_Id = Convert.ToInt32(reader["U_Id"]),
                            Role = reader["Role"].ToString(),
                            U_Name = "Unknown" // Default, agar join nahi ho to
                        });
                    }
                }
            }
            return list;
        }

        // ------------------ ADD ------------------
        public void Add(FridgeUser fu)
        {
            if (CheckUserInFridge(fu.Fridge_Id, fu.U_Id))
                return;

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(
                    "INSERT INTO FridgeUsers (Fridge_Id, U_Id, Role) VALUES (@fridge, @uid, @role)", conn))
                {
                    cmd.Parameters.Add("@fridge", SqlDbType.Int).Value = fu.Fridge_Id;
                    cmd.Parameters.Add("@uid", SqlDbType.Int).Value = fu.U_Id;
                    cmd.Parameters.Add("@role", SqlDbType.NVarChar, 50).Value = fu.Role;
                    cmd.ExecuteNonQuery();
                }
            }
        }

        // ------------------ UPDATE ------------------
        public void Update(FridgeUser fu)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(
                    "UPDATE FridgeUsers SET Fridge_Id=@fridge, U_Id=@uid, Role=@role WHERE FridgeUser_Id=@id", conn))
                {
                    cmd.Parameters.Add("@fridge", SqlDbType.Int).Value = fu.Fridge_Id;
                    cmd.Parameters.Add("@uid", SqlDbType.Int).Value = fu.U_Id;
                    cmd.Parameters.Add("@role", SqlDbType.NVarChar, 50).Value = fu.Role;
                    cmd.Parameters.Add("@id", SqlDbType.Int).Value = fu.FridgeUser_Id;
                    cmd.ExecuteNonQuery();
                }
            }
        }

        // ------------------ DELETE ------------------
        public bool RemoveUser(int fridgeId, int ownerId, int removeUserId)
        {
            // STEP 1: Check if requester is Owner
            if (!IsOwner(fridgeId, ownerId))
                return false;

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                // STEP 2: Check role of the user being removed
                string checkQuery = @"SELECT Role FROM FridgeUsers 
                              WHERE Fridge_Id=@fridgeId AND U_Id=@removeUserId";

                using (SqlCommand checkCmd = new SqlCommand(checkQuery, conn))
                {
                    checkCmd.Parameters.AddWithValue("@fridgeId", fridgeId);
                    checkCmd.Parameters.AddWithValue("@removeUserId", removeUserId);

                    var role = checkCmd.ExecuteScalar()?.ToString();

                    // ❌ Prevent deleting Owner
                    if (role == "Owner")
                        return false;
                }

                // STEP 3: Delete user
                string deleteQuery = @"DELETE FROM FridgeUsers 
                              WHERE Fridge_Id=@fridgeId AND U_Id=@removeUserId";

                using (SqlCommand cmd = new SqlCommand(deleteQuery, conn))
                {
                    cmd.Parameters.AddWithValue("@fridgeId", fridgeId);
                    cmd.Parameters.AddWithValue("@removeUserId", removeUserId);

                    return cmd.ExecuteNonQuery() > 0;
                }
            }
        }
        // ------------------ GET BY FRIDGE ID (WITH USER NAMES) ------------------
        public List<FridgeUser> GetByFridgeId(int fridgeId)
        {
            var list = new List<FridgeUser>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                var query = @"
                    SELECT fu.FridgeUser_Id, fu.Fridge_Id, fu.U_Id, fu.Role, u.U_Name
                    FROM FridgeUsers fu
                    JOIN Users u ON fu.U_Id = u.U_Id
                    WHERE fu.Fridge_Id = @fridgeId
                ";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@fridgeId", fridgeId);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            list.Add(new FridgeUser
                            {
                                FridgeUser_Id = Convert.ToInt32(reader["FridgeUser_Id"]),
                                Fridge_Id = Convert.ToInt32(reader["Fridge_Id"]),
                                U_Id = Convert.ToInt32(reader["U_Id"]),
                                Role = reader["Role"].ToString(),
                                U_Name = reader["U_Name"].ToString() ?? "Unknown"
                            });
                        }
                    }
                }
            }

            return list;
        }
        public bool CheckUserInFridge(int fridgeId, int userId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                string query = @"SELECT COUNT(*) 
                         FROM FridgeUsers 
                         WHERE Fridge_Id = @fridgeId AND U_Id = @userId";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@fridgeId", fridgeId);
                    cmd.Parameters.AddWithValue("@userId", userId);

                    int count = (int)cmd.ExecuteScalar();

                    return count > 0;
                }
            }
        }
        public bool IsOwner(int fridgeId, int userId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                string query = @"SELECT Role 
                         FROM FridgeUsers 
                         WHERE Fridge_Id = @fridgeId AND U_Id = @userId";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@fridgeId", fridgeId);
                    cmd.Parameters.AddWithValue("@userId", userId);

                    var role = cmd.ExecuteScalar()?.ToString();

                    return role == "Owner";
                }
            }
        }
        public bool MakeOwner(int fridgeId, int currentOwnerId, int newOwnerId)
        {
            if (!IsOwner(fridgeId, currentOwnerId))
                return false;

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                string query = @"UPDATE FridgeUsers 
                         SET Role = 'Owner' 
                         WHERE Fridge_Id=@fridgeId AND U_Id=@newOwnerId";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@fridgeId", fridgeId);
                    cmd.Parameters.AddWithValue("@newOwnerId", newOwnerId);

                    return cmd.ExecuteNonQuery() > 0;
                }
            }
        }
    }
}