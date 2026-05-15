using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using MyFridgeAPI.Models;

namespace MyFridgeAPI.Repositories
{
    public class NotificationsRepository
    {
        private readonly string _connectionString;

        public NotificationsRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("MyFridgeDB");
        }

        // ================= GET BY USER + FRIDGE =================
        public List<Notification> GetByUser(int userId, int fridgeId)
        {
            var list = new List<Notification>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                string query = @"
                    SELECT * FROM Notifications
                    WHERE U_Id = @uid AND Fridge_Id = @fridgeId
                    ORDER BY Created_At DESC";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.Add("@uid", SqlDbType.Int).Value = userId;
                    cmd.Parameters.Add("@fridgeId", SqlDbType.Int).Value = fridgeId;

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            list.Add(new Notification
                            {
                                Notification_Id = Convert.ToInt32(reader["Notification_Id"]),
                                U_Id = Convert.ToInt32(reader["U_Id"]),
                                Fridge_Id = reader["Fridge_Id"] == DBNull.Value ? null : Convert.ToInt32(reader["Fridge_Id"]),
                                Item_Id = reader["Item_Id"] == DBNull.Value ? null : Convert.ToInt32(reader["Item_Id"]),
                                Recipe_Id = reader["Recipe_Id"] == DBNull.Value ? null : Convert.ToInt32(reader["Recipe_Id"]),
                                Type = reader["Type"]?.ToString(),
                                Message = reader["Message"].ToString(),
                                Is_Read = Convert.ToBoolean(reader["Is_Read"]),
                                Created_At = Convert.ToDateTime(reader["Created_At"])
                            });
                        }
                    }
                }
            }

            return list;
        }

        // ================= ADD NOTIFICATION =================
        public void Add(Notification n)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                // 🔥 DUPLICATE CHECK (fridge wise)
                string checkQuery = @"
                    SELECT COUNT(*) FROM Notifications 
                    WHERE U_Id=@uid 
                    AND Fridge_Id=@fridgeId 
                    AND Item_Id=@item 
                    AND Type=@type 
                    AND Is_Read=0";

                using (SqlCommand checkCmd = new SqlCommand(checkQuery, conn))
                {
                    checkCmd.Parameters.Add("@uid", SqlDbType.Int).Value = n.U_Id;
                    checkCmd.Parameters.Add("@fridgeId", SqlDbType.Int).Value = (object?)n.Fridge_Id ?? DBNull.Value;
                    checkCmd.Parameters.Add("@item", SqlDbType.Int).Value = (object?)n.Item_Id ?? DBNull.Value;
                    checkCmd.Parameters.Add("@type", SqlDbType.NVarChar).Value = n.Type ?? "";

                    int count = (int)checkCmd.ExecuteScalar();
                    if (count > 0) return;
                }

                // 🔥 INSERT
                string insertQuery = @"
                    INSERT INTO Notifications
                    (U_Id, Fridge_Id, Item_Id, Recipe_Id, Type, Message, Is_Read, Created_At)
                    VALUES
                    (@uid, @fridgeId, @item, @recipe, @type, @msg, @read, @created)";

                using (SqlCommand cmd = new SqlCommand(insertQuery, conn))
                {
                    cmd.Parameters.Add("@uid", SqlDbType.Int).Value = n.U_Id;
                    cmd.Parameters.Add("@fridgeId", SqlDbType.Int).Value = (object?)n.Fridge_Id ?? DBNull.Value;
                    cmd.Parameters.Add("@item", SqlDbType.Int).Value = (object?)n.Item_Id ?? DBNull.Value;
                    cmd.Parameters.Add("@recipe", SqlDbType.Int).Value = (object?)n.Recipe_Id ?? DBNull.Value;
                    cmd.Parameters.Add("@type", SqlDbType.NVarChar).Value = n.Type ?? "";
                    cmd.Parameters.Add("@msg", SqlDbType.NVarChar).Value = n.Message;
                    cmd.Parameters.Add("@read", SqlDbType.Bit).Value = n.Is_Read;
                    cmd.Parameters.Add("@created", SqlDbType.DateTime).Value = n.Created_At;

                    cmd.ExecuteNonQuery();
                }
            }
        }

        // ================= MARK AS READ =================
        public void MarkAsRead(int notificationId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                string query = @"UPDATE Notifications SET Is_Read = 1 WHERE Notification_Id = @id";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.Add("@id", SqlDbType.Int).Value = notificationId;
                    cmd.ExecuteNonQuery();
                }
            }
        }

        // ================= DELETE =================
        public void Delete(int notificationId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                string query = @"DELETE FROM Notifications WHERE Notification_Id = @id";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.Add("@id", SqlDbType.Int).Value = notificationId;
                    cmd.ExecuteNonQuery();
                }
            }
        }

        // ================= EXISTS CHECK =================
        public bool Exists(int userId, int? itemId, string type, int? fridgeId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                string query = @"
                    SELECT COUNT(*) FROM Notifications
                    WHERE U_Id=@uid 
                    AND Fridge_Id=@fridgeId
                    AND Item_Id=@item 
                    AND Type=@type 
                    AND Is_Read=0";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.Add("@uid", SqlDbType.Int).Value = userId;
                    cmd.Parameters.Add("@fridgeId", SqlDbType.Int).Value = (object?)fridgeId ?? DBNull.Value;
                    cmd.Parameters.Add("@item", SqlDbType.Int).Value = (object?)itemId ?? DBNull.Value;
                    cmd.Parameters.Add("@type", SqlDbType.NVarChar).Value = type;

                    int count = (int)cmd.ExecuteScalar();
                    return count > 0;
                }
            }
        }
    }
}