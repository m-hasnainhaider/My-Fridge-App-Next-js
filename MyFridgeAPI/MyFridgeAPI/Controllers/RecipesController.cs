using Microsoft.AspNetCore.Mvc;
using MyFridgeAPI.Models;
using MyFridgeAPI.Repositories;
using System.Collections.Generic;
using System.Linq;

namespace MyFridgeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipesController : ControllerBase
    {
        private readonly RecipesRepository _repo;
        private readonly RecipeIngredientsRepository _ingredientRepo;
        private readonly ItemsRepository _itemsRepo;
        private readonly CategoryRepository _catRepo;

        public RecipesController(
            RecipesRepository repo,
            RecipeIngredientsRepository ingredientRepo,
            CategoryRepository catRepo,
            ItemsRepository itemsRepo)
        {
            _repo = repo;
            _ingredientRepo = ingredientRepo;
            _catRepo = catRepo;
            _itemsRepo = itemsRepo;
        }

        // 🔹 Get recipes by fridge
        [HttpGet("{fridgeId}")]
        public ActionResult<List<Recipe>> GetByFridge(int fridgeId)
        {
            return Ok(_repo.GetByFridge(fridgeId));
        }

        // 🔹 Add recipe
        [HttpPost]
        public IActionResult Post([FromBody] Recipe r)
        {
            if (r == null || string.IsNullOrWhiteSpace(r.Recipe_Name))
                return BadRequest("Recipe name is required.");

            int userId = 1;
            int newId = _repo.Add(r, userId);

            return Ok(new { Recipe_Id = newId });
        }

        // 🔹 Update recipe
        [HttpPut]
        public IActionResult Put([FromBody] Recipe r)
        {
            if (r == null || r.Recipe_Id <= 0)
                return BadRequest("Invalid recipe data.");

            int userId = 1;
            _repo.Update(r, userId);

            return Ok(new { message = "Recipe updated successfully" });
        }

        // 🔹 Delete recipe
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            int userId = 1;
            _repo.Delete(id, userId);

            return Ok(new { message = "Recipe deleted successfully" });
        }

        // 🔥 CHECK INGREDIENTS API
        [HttpGet("check-ingredients")]
        public IActionResult CheckIngredients(int fridgeId, int recipeId, int persons)
        {
            if (persons <= 0) persons = 1;

            // 🔥 GET RECIPE (for servings)
            var recipe = _repo.GetById(recipeId);
            if (recipe == null)
                return NotFound("Recipe not found");

            int servings = recipe.Servings <= 0 ? 1 : recipe.Servings;

            var ingredients = _ingredientRepo.GetByRecipeId(recipeId);
            var items = _itemsRepo.GetItemsForCheck(fridgeId);

            string Normalize(string s) => s?.Trim().ToLower() ?? "";

            decimal ConvertToSmallestUnit(decimal qty, string unit)
            {
                if (string.IsNullOrWhiteSpace(unit)) return qty;

                unit = unit.Trim().ToLower();

                if (unit.Contains("kg") || unit.Contains("kilo")) return qty * 1000;
                if (unit.Contains("liter") || unit.Contains("litre") || unit == "l") return qty * 1000;

                return qty;
            }

            var result = ingredients.Select(ing =>
            {
                decimal baseQty = ConvertToSmallestUnit(ing.Quantity, ing.Unit);

                // 🔥 MAIN FIX (SERVINGS FORMULA)
                decimal totalRequired = (baseQty / servings) * persons;

                var item = items.FirstOrDefault(x =>
                    Normalize(x.Item_Name).Contains(Normalize(ing.Item_Name)) ||
                    Normalize(ing.Item_Name).Contains(Normalize(x.Item_Name))
                );

                decimal available = item != null
                    ? ConvertToSmallestUnit(item.Quantity, item.Unit)
                    : 0;

                return new
                {
                    name = ing.Item_Name,
                    required = totalRequired,
                    available = available,
                    unit = ing.Unit, // 🔥 THIS FIX
                    status = available >= totalRequired ? "available" : "missing"
                };
            }).ToList();

            return Ok(result);
        }
    }
}