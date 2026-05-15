using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using MyFridgeAPI.Models;

namespace MyFridgeAPI.Repositories
{
    public class ActivityLogsRepository
    {
        private readonly string _connectionString;

        public ActivityLogsRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("MyFridgeDB");
        }

        // 🔹 Get all logs by fridge
        public List<ActivityLog> GetByFridge(int fridgeId)
        {
            var logs = new List<ActivityLog>();

            using (var conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new SqlCommand(
                    @"SELECT * FROM ActivityLogs WHERE FridgeId=@fridgeId ORDER BY ActionDate DESC", conn))
                {
                    cmd.Parameters.AddWithValue("@fridgeId", fridgeId);

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            logs.Add(new ActivityLog
                            {
                                LogId = Convert.ToInt32(reader["LogId"]),
                                UserId = Convert.ToInt32(reader["UserId"]),
                                FridgeId = Convert.ToInt32(reader["FridgeId"]),
                                ItemName = reader["ItemName"].ToString(),
                                ActionType = reader["ActionType"].ToString(),
                                Quantity = reader["Quantity"] != DBNull.Value ? Convert.ToDecimal(reader["Quantity"]) : 0,

                                Item_Id = reader["Item_Id"] != DBNull.Value ? Convert.ToInt32(reader["Item_Id"]) : (int?)null,

                                Recipe_Id = reader["Recipe_Id"] != DBNull.Value ? Convert.ToInt32(reader["Recipe_Id"]) : (int?)null, // 🔥 NEW

                                Description = reader["Description"].ToString(),
                                ActionDate = Convert.ToDateTime(reader["ActionDate"])
                            });
                        }
                    }
                }
            }

            return logs;
        }
    }
}