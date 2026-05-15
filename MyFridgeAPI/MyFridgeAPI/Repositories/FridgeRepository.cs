using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using MyFridgeAPI.Models;

namespace MyFridgeAPI.Repositories
{
    public class FridgeRepository
    {
        private readonly string _connectionString;

        public FridgeRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("MyFridgeDB");
        }

        public List<fridge> GetAllFridges()
        {
            var list = new List<fridge>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("SELECT * FROM Fridge", conn))
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new fridge
                        {
                            Fridge_Id = Convert.ToInt32(reader["Fridge_Id"]),
                            Fridge_Name = reader["Fridge_Name"].ToString(),
                            U_Id = Convert.ToInt32(reader["U_Id"]),
                            Rating = Convert.ToInt32(reader["Rating"]),
                            Created_At = Convert.ToDateTime(reader["Created_At"])
                        });
                    }
                }
            }
            return list;
        }

        public void AddFridge(fridge fridge)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                // 1️⃣ Insert into Fridge table
                using (SqlCommand cmd = new SqlCommand(
                    @"INSERT INTO Fridge (Fridge_Name, U_Id, Rating, Created_At)
              OUTPUT INSERTED.Fridge_Id
              VALUES (@name, @uid, @rating, GETDATE())", conn))
                {
                    cmd.Parameters.AddWithValue("@name", fridge.Fridge_Name);
                    cmd.Parameters.AddWithValue("@uid", fridge.U_Id);
                    cmd.Parameters.AddWithValue("@rating", fridge.Rating);

                    fridge.Fridge_Id = (int)cmd.ExecuteScalar();
                }

                // 2️⃣ Insert owner into FridgeUsers table
                using (SqlCommand cmd2 = new SqlCommand(
                    @"INSERT INTO FridgeUsers (Fridge_Id, U_Id, Role)
              VALUES (@fridgeId, @uid, 'Owner')", conn))
                {
                    cmd2.Parameters.AddWithValue("@fridgeId", fridge.Fridge_Id);
                    cmd2.Parameters.AddWithValue("@uid", fridge.U_Id);
                    cmd2.ExecuteNonQuery();
                }
            }
        }
        public void UpdateFridge(fridge fridge)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(@"UPDATE Fridge SET Fridge_Name=@name, U_Id=@uid, Rating=@rating
                                                          WHERE Fridge_Id=@id", conn))
                {
                    cmd.Parameters.Add("@name", SqlDbType.NVarChar, 100).Value = fridge.Fridge_Name;
                    cmd.Parameters.Add("@uid", SqlDbType.Int).Value = fridge.U_Id;
                    cmd.Parameters.Add("@rating", SqlDbType.Int).Value = fridge.Rating;
                    cmd.Parameters.Add("@id", SqlDbType.Int).Value = fridge.Fridge_Id;
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public void DeleteFridge(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("DELETE FROM Fridge WHERE Fridge_Id=@id", conn))
                {
                    cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
                    cmd.ExecuteNonQuery();
                }
            }
        }
    }
}