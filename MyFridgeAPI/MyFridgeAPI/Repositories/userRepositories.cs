using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using MyFridgeAPI.Models;

namespace MyFridgeAPI.Repositories
{
    public class UserRepository
    {
        private readonly string _connectionString;

        // Constructor → configuration se connection string le raha hai
        public UserRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("MyFridgeDB");
        }

        // ✅ Get all users
        public List<User> GetAllUsers()
        {
            var users = new List<User>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("SELECT * FROM Users", conn))
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        users.Add(new User
                        {
                            U_Id = Convert.ToInt32(reader["U_Id"]),
                            U_Name = reader["U_Name"].ToString(),
                            Created_At = Convert.ToDateTime(reader["Created_At"])
                        });
                    }
                }
            }

            return users;
        }

        // ✅ Add new user
        public void AddUser(User user)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("INSERT INTO Users (U_Name) VALUES (@name)", conn))
                {
                    cmd.Parameters.AddWithValue("@name", user.U_Name);
                    cmd.ExecuteNonQuery();
                }
            }
        }

        // ✅ Update user
        public void UpdateUser(User user)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("UPDATE Users SET U_Name=@name WHERE U_Id=@id", conn))
                {
                    cmd.Parameters.AddWithValue("@name", user.U_Name);
                    cmd.Parameters.AddWithValue("@id", user.U_Id);
                    cmd.ExecuteNonQuery();
                }
            }
        }

        // ✅ Delete user
        public void DeleteUser(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("DELETE FROM Users WHERE U_Id=@id", conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    cmd.ExecuteNonQuery();
                }
            }
        }
        public void Register(User user)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string query = "INSERT INTO Users (U_Name, Email, Password) VALUES (@Name,@Email,@Password)";

                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@Name", user.U_Name);
                cmd.Parameters.AddWithValue("@Email", user.Email);
                cmd.Parameters.AddWithValue("@Password", user.Password);

                con.Open();
                cmd.ExecuteNonQuery();
            }
        }
        public List<dynamic> Login(string email, string password)
        {
            var list = new List<dynamic>();

            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string query = @"SELECT U.U_Id, U.U_Name, U.Email, 
                                ISNULL(FU.Fridge_Id,0) AS FridgeId,
                                ISNULL(FU.Role,'') AS Role
                         FROM Users U
                         LEFT JOIN FridgeUsers FU ON U.U_Id = FU.U_Id
                         WHERE U.Email=@Email AND U.Password=@Password";

                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@Email", email);
                cmd.Parameters.AddWithValue("@Password", password);

                con.Open();
                SqlDataReader dr = cmd.ExecuteReader();

                while (dr.Read())
                {
                    list.Add(new
                    {
                        U_Id = (int)dr["U_Id"],
                        U_Name = dr["U_Name"].ToString(),
                        Email = dr["Email"].ToString(),
                        FridgeId = Convert.ToInt32(dr["FridgeId"]),
                        Role = dr["Role"].ToString()
                    });
                }
            }

            return list;
        }
        public bool UserHasFridge(int userId)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string query = "SELECT COUNT(*) FROM FridgeUsers WHERE U_Id=@UserId";

                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@UserId", userId);

                con.Open();

                int count = (int)cmd.ExecuteScalar();

                return count > 0;
            }
        }
    }
}