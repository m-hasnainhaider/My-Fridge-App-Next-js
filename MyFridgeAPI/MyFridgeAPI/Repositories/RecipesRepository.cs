using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using MyFridgeAPI.Models;

namespace MyFridgeAPI.Repositories
{
    public class RecipesRepository
    {
        private readonly string _connectionString;

        public RecipesRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("MyFridgeDB");
        }

        // 🔹 Get recipes by fridge
        public List<Recipe> GetByFridge(int fridgeId)
        {
            var list = new List<Recipe>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                using (SqlCommand cmd = new SqlCommand(
                    "SELECT * FROM Recipes WHERE Fridge_Id=@fid", conn))
                {
                    cmd.Parameters.AddWithValue("@fid", fridgeId);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            list.Add(new Recipe
                            {
                                Recipe_Id = Convert.ToInt32(reader["Recipe_Id"]),
                                Recipe_Name = reader["Recipe_Name"].ToString(),
                                Fridge_Id = Convert.ToInt32(reader["Fridge_Id"]),
                                Recipe_Image = reader["Recipe_Image"]?.ToString(),
                                Servings = Convert.ToInt32(reader["Servings"]), // ✅ NEW
                                Created_At = Convert.ToDateTime(reader["Created_At"])
                            });
                        }
                    }
                }
            }

            return list;
        }

        // 🔹 Add recipe
        public int Add(Recipe r, int userId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                using (SqlCommand cmd = new SqlCommand(@"
                    INSERT INTO Recipes (Recipe_Name, Fridge_Id, Recipe_Image, Servings)
                    OUTPUT INSERTED.Recipe_Id
                    VALUES (@name, @fid, @img, @servings)", conn))
                {
                    cmd.Parameters.AddWithValue("@name", r.Recipe_Name);
                    cmd.Parameters.AddWithValue("@fid", r.Fridge_Id);
                    cmd.Parameters.AddWithValue("@img", (object)r.Recipe_Image ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@servings", r.Servings <= 0 ? 1 : r.Servings); // ✅ SAFE

                    int newId = (int)cmd.ExecuteScalar();

                    // 🔹 Log
                    SaveLog(userId, r.Fridge_Id, newId, r.Recipe_Name,
                        "Add Recipe", 0, $"Added recipe {r.Recipe_Name}");

                    return newId;
                }
            }
        }

        // 🔹 Update recipe
        public void Update(Recipe r, int userId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                using (SqlCommand cmd = new SqlCommand(@"
                    UPDATE Recipes 
                    SET Recipe_Name=@name, Recipe_Image=@img, Servings=@servings
                    WHERE Recipe_Id=@id", conn))
                {
                    cmd.Parameters.AddWithValue("@name", r.Recipe_Name);
                    cmd.Parameters.AddWithValue("@img", (object)r.Recipe_Image ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@servings", r.Servings <= 0 ? 1 : r.Servings); // ✅ SAFE
                    cmd.Parameters.AddWithValue("@id", r.Recipe_Id);

                    cmd.ExecuteNonQuery();

                    // 🔹 Log
                    SaveLog(userId, r.Fridge_Id, r.Recipe_Id, r.Recipe_Name,
                        "Update Recipe", 0, $"Updated recipe {r.Recipe_Name}");
                }
            }
        }

        // 🔹 Delete recipe
        public void Delete(int id, int userId)
        {
            Recipe r = GetById(id);
            if (r == null) return;

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                // 🔥 Delete ingredients first
                using (SqlCommand cmd1 = new SqlCommand(
                    "DELETE FROM RecipeIngredients WHERE Recipe_Id=@id", conn))
                {
                    cmd1.Parameters.AddWithValue("@id", id);
                    cmd1.ExecuteNonQuery();
                }

                // 🔥 Delete recipe
                using (SqlCommand cmd2 = new SqlCommand(
                    "DELETE FROM Recipes WHERE Recipe_Id=@id", conn))
                {
                    cmd2.Parameters.AddWithValue("@id", id);
                    cmd2.ExecuteNonQuery();
                }

                // 🔹 Log
                SaveLog(userId, r.Fridge_Id, r.Recipe_Id, r.Recipe_Name,
                    "Delete Recipe", 0, $"Deleted recipe {r.Recipe_Name}");
            }
        }

        // 🔹 Get recipe by id
        public Recipe GetById(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                using (SqlCommand cmd = new SqlCommand(
                    "SELECT * FROM Recipes WHERE Recipe_Id=@id", conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new Recipe
                            {
                                Recipe_Id = Convert.ToInt32(reader["Recipe_Id"]),
                                Recipe_Name = reader["Recipe_Name"].ToString(),
                                Fridge_Id = Convert.ToInt32(reader["Fridge_Id"]),
                                Recipe_Image = reader["Recipe_Image"]?.ToString(),
                                Servings = Convert.ToInt32(reader["Servings"]), // ✅ NEW
                                Created_At = Convert.ToDateTime(reader["Created_At"])
                            };
                        }
                    }
                }
            }

            return null;
        }

        // 🔹 Save log
        public void SaveLog(int userId, int fridgeId, int itemId, string itemName,
            string actionType, int quantity, string description)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                using (SqlCommand cmd = new SqlCommand(@"
                    INSERT INTO ActivityLogs 
                    (UserId, FridgeId, ItemName, ActionType, Quantity, Item_Id, Description)
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
    }
}