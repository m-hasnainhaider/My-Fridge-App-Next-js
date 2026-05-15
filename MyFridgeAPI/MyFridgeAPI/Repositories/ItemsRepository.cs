using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using MyFridgeAPI.Models;

namespace MyFridgeAPI.Repositories
{
    public class ItemsRepository
    {
        private readonly string _connectionString;

        public ItemsRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("MyFridgeDB");
        }

        // 🔹 Get all items (only non-deleted)
        public List<Item> GetAllItems()
        {
            var items = new List<Item>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                using (SqlCommand cmd = new SqlCommand(@"
            SELECT i.Item_Id, i.Item_Name, i.Quantity, i.Unit,
                   i.Expiry_Date, i.Fridge_Id, i.Cat_Id,
                   c.Cat_Name, i.Created_At, i.IsFreezer
            FROM Items i
            LEFT JOIN Category c ON i.Cat_Id = c.Cat_Id
            WHERE i.IsDeleted = 0", conn))
                {
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            items.Add(MapReaderToItem(reader));
                        }
                    }
                }
            }

            return items;
        }

        // 🔹 Add item
        public void AddItem(Item item, int userId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(@"
                    INSERT INTO Items (Item_Name, Quantity, Unit, Expiry_Date, Fridge_Id, Cat_Id, IsFreezer)
                    OUTPUT INSERTED.Item_Id
                    VALUES (@name, @qty, @unit, @expiry, @fridge, @cat, @isFreezer)", conn))
                {
                    cmd.Parameters.Add("@name", SqlDbType.NVarChar, 100).Value = item.Item_Name;
                    cmd.Parameters.Add("@qty", SqlDbType.Decimal).Value = item.Quantity;
                    cmd.Parameters.Add("@unit", SqlDbType.NVarChar, 20).Value = item.Unit;
                    cmd.Parameters.Add("@expiry", SqlDbType.Date).Value = (object)item.Expiry_Date ?? DBNull.Value;
                    cmd.Parameters.Add("@fridge", SqlDbType.Int).Value = item.Fridge_Id;
                    cmd.Parameters.Add("@cat", SqlDbType.Int).Value = item.Cat_Id;
                    cmd.Parameters.Add("@isFreezer", SqlDbType.Bit).Value = item.IsFreezer;

                    int newId = (int)cmd.ExecuteScalar();

                    SaveLog(userId, item.Fridge_Id, newId, item.Item_Name, "Add", Convert.ToInt32(item.Quantity), $"Added {item.Item_Name}");
                }
            }
        }

        // 🔹 Update item
        public void UpdateItem(Item item, int userId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(@"
                    UPDATE Items SET 
                        Item_Name=@name, Quantity=@qty, Unit=@unit, Expiry_Date=@expiry, Fridge_Id=@fridge, Cat_Id=@cat, IsFreezer=@isFreezer
                    WHERE Item_Id=@id AND IsDeleted=0", conn))
                {
                    cmd.Parameters.Add("@name", SqlDbType.NVarChar, 100).Value = item.Item_Name;
                    cmd.Parameters.Add("@qty", SqlDbType.Decimal).Value = item.Quantity;
                    cmd.Parameters.Add("@unit", SqlDbType.NVarChar, 20).Value = item.Unit;
                    cmd.Parameters.Add("@expiry", SqlDbType.Date).Value = (object)item.Expiry_Date ?? DBNull.Value;
                    cmd.Parameters.Add("@fridge", SqlDbType.Int).Value = item.Fridge_Id;
                    cmd.Parameters.Add("@cat", SqlDbType.Int).Value = item.Cat_Id;
                    cmd.Parameters.Add("@isFreezer", SqlDbType.Bit).Value = item.IsFreezer;
                    cmd.Parameters.Add("@id", SqlDbType.Int).Value = item.Item_Id;

                    cmd.ExecuteNonQuery();

                    SaveLog(userId, item.Fridge_Id, item.Item_Id, item.Item_Name, "Update", Convert.ToInt32(item.Quantity), $"Updated {item.Item_Name}");
                }
            }
        }

        // 🔹 Soft Delete item
        public void DeleteItem(int id, int userId)
        {
            Item item = GetItemById(id);
            if (item == null) return;

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(@"
                    UPDATE Items SET IsDeleted=1, DeletedAt=GETDATE()
                    WHERE Item_Id=@id AND IsDeleted=0", conn))
                {
                    cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
                    cmd.ExecuteNonQuery();

                    SaveLog(userId, item.Fridge_Id, id, item.Item_Name, "Delete", Convert.ToInt32(item.Quantity), $"Soft-deleted {item.Item_Name}");
                }
            }
        }

        // 🔹 Get items by fridge (only non-deleted)
        public List<Item> GetItemsByFridge(int fridgeId)
        {
            var items = new List<Item>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(
                    @"SELECT i.Item_Id, i.Item_Name, i.Quantity, i.Unit, i.Expiry_Date, i.Fridge_Id, i.Cat_Id, 
                             c.Cat_Name, i.Created_At, i.IsFreezer
                      FROM Items i
                      JOIN Category c ON i.Cat_Id = c.Cat_Id
                      WHERE i.Fridge_Id=@fridgeId AND i.IsDeleted=0", conn))
                {
                    cmd.Parameters.Add("@fridgeId", SqlDbType.Int).Value = fridgeId;
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            items.Add(MapReaderToItem(reader));
                        }
                    }
                }
            }
            return items;
        }

        // 🔹 Get single item (only non-deleted)
        public Item GetItemById(int id)
        {
            using var conn = new SqlConnection(_connectionString);
            conn.Open();
            using var cmd = new SqlCommand(@"
                SELECT i.Item_Id, i.Item_Name, i.Quantity, i.Unit, i.Expiry_Date, i.Fridge_Id, i.Cat_Id, 
                       c.Cat_Name, i.Created_At, i.IsFreezer
                FROM Items i
                JOIN Category c ON i.Cat_Id = c.Cat_Id
                WHERE i.Item_Id=@id AND i.IsDeleted=0", conn);

            cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
            using var reader = cmd.ExecuteReader();
            if (reader.Read()) return MapReaderToItem(reader);
            return null;
        }

        // 🔹 Map SqlDataReader to Item
        private Item MapReaderToItem(SqlDataReader reader)
        {
            var item = new Item
            {
                Item_Id = Convert.ToInt32(reader["Item_Id"]),
                Item_Name = reader["Item_Name"].ToString(),
                Quantity = Convert.ToDecimal(reader["Quantity"]),
                Unit = reader["Unit"].ToString(),
                Expiry_Date = reader["Expiry_Date"] == DBNull.Value
                    ? (DateTime?)null
                    : Convert.ToDateTime(reader["Expiry_Date"]),
                Fridge_Id = Convert.ToInt32(reader["Fridge_Id"]),
                Cat_Id = Convert.ToInt32(reader["Cat_Id"]),
                Cat_Name = reader["Cat_Name"]?.ToString(),
                Created_At = Convert.ToDateTime(reader["Created_At"]),
                IsFreezer = reader["IsFreezer"] != DBNull.Value
    ? Convert.ToBoolean(reader["IsFreezer"])
    : false,
            };

            // 🔥 FINAL EXPIRY LOGIC
            DateTime? finalExpiry = item.Expiry_Date;

            if (item.IsFreezer)
            {
                int rating = GetFridgeRating(item.Fridge_Id);
                DateTime? freezerExpiry = CalculateFreezerExpiry(item.Created_At, rating);

                if (item.Expiry_Date != null && freezerExpiry != null)
                {
                    finalExpiry = item.Expiry_Date < freezerExpiry
                        ? item.Expiry_Date
                        : freezerExpiry;
                }
                else
                {
                    finalExpiry = item.Expiry_Date ?? freezerExpiry;
                }
            }

            item.FinalExpiry = finalExpiry;

            return item;
        }

        // 🔹 Save activity log
        public void SaveLog(int userId, int fridgeId, int itemId, string itemName, string actionType, int quantity, string description)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(@"
                    INSERT INTO ActivityLogs (UserId, FridgeId, ItemName, ActionType, Quantity, Item_Id, Description)
                    VALUES (@userId, @fridgeId, @itemName, @actionType, @qty, @itemId, @desc)", conn))
                {
                    cmd.Parameters.Add("@userId", SqlDbType.Int).Value = userId;
                    cmd.Parameters.Add("@fridgeId", SqlDbType.Int).Value = fridgeId;
                    cmd.Parameters.Add("@itemName", SqlDbType.NVarChar, 100).Value = itemName;
                    cmd.Parameters.Add("@actionType", SqlDbType.NVarChar, 50).Value = actionType;
                    cmd.Parameters.Add("@qty", SqlDbType.Int).Value = quantity;
                    cmd.Parameters.Add("@itemId", SqlDbType.Int).Value = itemId;
                    cmd.Parameters.Add("@desc", SqlDbType.NVarChar, 255).Value = description;

                    cmd.ExecuteNonQuery();
                }
            }
        }
        public List<Item> GetItemsForCheck(int fridgeId)
        {
            var items = new List<Item>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                // ✅ FIXED: Unit column add kar diya query mein
                using (SqlCommand cmd = new SqlCommand(
                    @"SELECT Item_Id, Item_Name, Quantity, Unit, Cat_Id 
              FROM Items 
              WHERE Fridge_Id=@fridgeId AND IsDeleted=0", conn))
                {
                    cmd.Parameters.Add("@fridgeId", SqlDbType.Int).Value = fridgeId;

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            items.Add(new Item
                            {
                                Item_Id = Convert.ToInt32(reader["Item_Id"]),
                                Item_Name = reader["Item_Name"].ToString(),
                                Quantity = Convert.ToDecimal(reader["Quantity"]),
                                // ✅ FIXED: Unit ko map kar diya
                                Unit = reader["Unit"] != DBNull.Value ? reader["Unit"].ToString() : "",
                                Cat_Id = Convert.ToInt32(reader["Cat_Id"])
                            });
                        }
                    }
                }
            }

            return items;
        }
        private int GetFridgeRating(int fridgeId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(
                    "SELECT Rating FROM Fridge WHERE Fridge_Id=@id", conn))
                {
                    cmd.Parameters.AddWithValue("@id", fridgeId);

                    object result = cmd.ExecuteScalar();

                    return result != null ? Convert.ToInt32(result) : 0;
                }
            }
        }
        private DateTime? CalculateFreezerExpiry(DateTime createdAt, int rating)
        {
            if (rating == 1)
                return createdAt.AddDays(7);

            if (rating == 2)
                return createdAt.AddMonths(1);

            if (rating == 3)
                return createdAt.AddMonths(6); // avg

            return null;
        }
        public List<MissingIngredientDto> GetMissingIngredientsForRecipe(int recipeId, int fridgeId)
        {
            var list = new List<MissingIngredientDto>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                string query = @"
        SELECT 
            r.Item_Name,
            SUM(r.Quantity) AS RequiredQty,
            ISNULL(SUM(i.Quantity), 0) AS AvailableQty,
            r.Unit
        FROM RecipeIngredients r
        LEFT JOIN Items i 
            ON r.Item_Name = i.Item_Name 
            AND i.Fridge_Id = @fridgeId
            AND i.IsDeleted = 0
        WHERE r.Recipe_Id = @recipeId
        GROUP BY r.Item_Name, r.Unit";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@recipeId", recipeId);
                    cmd.Parameters.AddWithValue("@fridgeId", fridgeId);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            decimal required = Convert.ToDecimal(reader["RequiredQty"]);
                            decimal available = Convert.ToDecimal(reader["AvailableQty"]);

                            if (available < required)
                            {
                                list.Add(new MissingIngredientDto
                                {
                                    Item_Name = reader["Item_Name"].ToString(),
                                    MissingQuantity = required - available,
                                    Unit = reader["Unit"].ToString()
                                });
                            }
                        }
                    }
                }
            }

            return list;
        }
    }
    public class MissingIngredientDto
    {
        public string Item_Name { get; set; }
        public decimal RequiredQuantity { get; set; }
        public decimal AvailableQuantity { get; set; }
        public string Unit { get; set; }
        public decimal MissingQuantity { get; set; }
    }
}