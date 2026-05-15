using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using MyFridgeAPI.Models;

namespace MyFridgeAPI.Repositories
{
    public class CategoryRepository
    {
        private readonly string _connectionString;

        public CategoryRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("MyFridgeDB");
        }

        // ---------------- GET ALL ----------------
        public List<Category> GetAll()
        {
            var list = new List<Category>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("SELECT * FROM Category", conn))
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new Category
                        {
                            Cat_Id = reader["Cat_Id"] != DBNull.Value ? Convert.ToInt32(reader["Cat_Id"]) : 0,
                            Cat_Name = reader["Cat_Name"] != DBNull.Value ? reader["Cat_Name"].ToString() : "",
                            U_Id = reader["U_Id"] != DBNull.Value ? Convert.ToInt32(reader["U_Id"]) : 0,
                            Created_At = reader["Created_At"] != DBNull.Value ? Convert.ToDateTime(reader["Created_At"]) : DateTime.MinValue
                        });
                    }
                }
            }
            return list;
        }

        // ---------------- ADD ----------------
        public void Add(Category cat)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(
                    "INSERT INTO Category (Cat_Name, U_Id) VALUES (@name,@uid)", conn))
                {
                    cmd.Parameters.Add("@name", SqlDbType.NVarChar, 100).Value = (object)cat.Cat_Name ?? DBNull.Value;
                    cmd.Parameters.Add("@uid", SqlDbType.Int).Value = cat.U_Id != 0 ? cat.U_Id : (object)DBNull.Value;
                    cmd.ExecuteNonQuery();
                }
            }
        }

        // ---------------- UPDATE ----------------
        public void Update(Category cat)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(
                    "UPDATE Category SET Cat_Name=@name, U_Id=@uid WHERE Cat_Id=@id", conn))
                {
                    cmd.Parameters.Add("@name", SqlDbType.NVarChar, 100).Value = (object)cat.Cat_Name ?? DBNull.Value;
                    cmd.Parameters.Add("@uid", SqlDbType.Int).Value = cat.U_Id != 0 ? cat.U_Id : (object)DBNull.Value;
                    cmd.Parameters.Add("@id", SqlDbType.Int).Value = cat.Cat_Id;
                    cmd.ExecuteNonQuery();
                }
            }
        }

        // ---------------- DELETE ----------------
        public void Delete(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("DELETE FROM Category WHERE Cat_Id=@id", conn))
                {
                    cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
                    cmd.ExecuteNonQuery();
                }
            }
        }
    }
}