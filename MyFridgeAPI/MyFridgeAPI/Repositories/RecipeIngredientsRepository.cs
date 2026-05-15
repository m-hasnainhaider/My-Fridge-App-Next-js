using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using MyFridgeAPI.Models;

namespace MyFridgeAPI.Repositories
{
    public class RecipeIngredientsRepository
    {
        private readonly string _connectionString;
        public RecipeIngredientsRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("MyFridgeDB");
        }

        public List<RecipeIngredient> GetAll()
        {
            var list = new List<RecipeIngredient>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("SELECT * FROM RecipeIngredients", conn))
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new RecipeIngredient
                        {
                            RecipeIngredient_Id = Convert.ToInt32(reader["RecipeIngredient_Id"]),
                            Recipe_Id = Convert.ToInt32(reader["Recipe_Id"]),
                            Cat_Id = Convert.ToInt32(reader["Cat_Id"]),
                            Quantity = Convert.ToDecimal(reader["Quantity"]),
                            Unit = reader["Unit"].ToString(),

                            // ✅ FIX
                            Item_Name = reader["Item_Name"]?.ToString() ?? ""
                        });
                    }
                }
            }

            return list;
        }
        public void Add(RecipeIngredient ri)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                // ❌ STOP NULL DATA
                if (string.IsNullOrWhiteSpace(ri.Item_Name))
                    throw new Exception("Item_Name is required ❌");

                using (SqlCommand cmd = new SqlCommand(
                    @"INSERT INTO RecipeIngredients 
            (Recipe_Id, Cat_Id, Quantity, Unit, Item_Name) 
            VALUES (@rid, @cid, @qty, @unit, @itemName)", conn))
                {
                    cmd.Parameters.Add("@rid", SqlDbType.Int).Value = ri.Recipe_Id;
                    cmd.Parameters.Add("@cid", SqlDbType.Int).Value = ri.Cat_Id;
                    cmd.Parameters.Add("@qty", SqlDbType.Decimal).Value = ri.Quantity;
                    cmd.Parameters.Add("@unit", SqlDbType.NVarChar, 20).Value = ri.Unit;
                    cmd.Parameters.Add("@itemName", SqlDbType.NVarChar, 100).Value = ri.Item_Name.Trim();

                    cmd.ExecuteNonQuery();
                }
            }
        }

        public void Update(RecipeIngredient ri)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(
                    "UPDATE RecipeIngredients SET Recipe_Id=@rid, Cat_Id=@cid, Quantity=@qty, Unit=@unit WHERE RecipeIngredient_Id=@id", conn))
                {
                    cmd.Parameters.Add("@rid", SqlDbType.Int).Value = ri.Recipe_Id;
                    cmd.Parameters.Add("@cid", SqlDbType.Int).Value = ri.Cat_Id;
                    cmd.Parameters.Add("@qty", SqlDbType.Decimal).Value = ri.Quantity;
                    cmd.Parameters.Add("@unit", SqlDbType.NVarChar, 20).Value = ri.Unit;
                    cmd.Parameters.Add("@id", SqlDbType.Int).Value = ri.RecipeIngredient_Id;
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public void Delete(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(
                    "DELETE FROM RecipeIngredients WHERE RecipeIngredient_Id=@id", conn))
                {
                    cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
                    cmd.ExecuteNonQuery();
                }
            }
        }
        public List<RecipeIngredient> GetByRecipeId(int recipeId)
        {
            var list = new List<RecipeIngredient>();

            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string query = "SELECT * FROM RecipeIngredients WHERE Recipe_Id = @RecipeId";

                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@RecipeId", recipeId);

                con.Open();
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    list.Add(new RecipeIngredient
                    {
                        RecipeIngredient_Id = Convert.ToInt32(reader["RecipeIngredient_Id"]),
                        Recipe_Id = Convert.ToInt32(reader["Recipe_Id"]),
                        Cat_Id = Convert.ToInt32(reader["Cat_Id"]),
                        Quantity = Convert.ToDecimal(reader["Quantity"]),

                        // ✅ SAFE
                        Item_Name = reader["Item_Name"]?.ToString()?.Trim() ?? "",

                        Unit = reader["Unit"].ToString()
                    });
                }
            }

            return list;
        }
    }
}