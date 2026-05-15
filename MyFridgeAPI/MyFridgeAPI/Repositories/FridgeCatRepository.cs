using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using MyFridgeAPI.Models;

namespace MyFridgeAPI.Repositories
{
    public class FridgeCatRepository
    {
        private readonly string _connectionString;
        public FridgeCatRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("MyFridgeDB");
        }

        public List<FridgeCat> GetAll()
        {
            var list = new List<FridgeCat>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("SELECT * FROM FridgeCat", conn))
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new FridgeCat
                        {
                            FridgeCat_Id = Convert.ToInt32(reader["FridgeCat_Id"]),
                            Rating = Convert.ToInt32(reader["Rating"])
                        });
                    }
                }
            }
            return list;
        }

        public void Add(FridgeCat fc)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("INSERT INTO FridgeCat (Rating) VALUES (@rating)", conn))
                {
                    cmd.Parameters.Add("@rating", SqlDbType.Int).Value = fc.Rating;
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public void Update(FridgeCat fc)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("UPDATE FridgeCat SET Rating=@rating WHERE FridgeCat_Id=@id", conn))
                {
                    cmd.Parameters.Add("@rating", SqlDbType.Int).Value = fc.Rating;
                    cmd.Parameters.Add("@id", SqlDbType.Int).Value = fc.FridgeCat_Id;
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public void Delete(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("DELETE FROM FridgeCat WHERE FridgeCat_Id=@id", conn))
                {
                    cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
                    cmd.ExecuteNonQuery();
                }
            }
        }
    }
}