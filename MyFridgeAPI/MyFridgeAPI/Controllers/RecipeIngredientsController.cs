using Microsoft.AspNetCore.Mvc;
using MyFridgeAPI.Models;
using MyFridgeAPI.Repositories;
using System.Collections.Generic;

namespace MyFridgeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipeIngredientsController : ControllerBase
    {
        private readonly RecipeIngredientsRepository _repo;

        public RecipeIngredientsController(RecipeIngredientsRepository repo)
        {
            _repo = repo;
        }

        // GET: api/RecipeIngredients
        [HttpGet]
        public ActionResult<List<RecipeIngredient>> Get()
        {
            var ingredients = _repo.GetAll();
            return Ok(ingredients);
        }

        // POST: api/RecipeIngredients
        
        [HttpPost]
        public IActionResult Post([FromBody] RecipeIngredient ri)
        {
            if (ri == null ||
                ri.Recipe_Id <= 0 ||
                ri.Cat_Id <= 0 ||
                ri.Quantity <= 0 ||
                string.IsNullOrWhiteSpace(ri.Unit) ||
                string.IsNullOrWhiteSpace(ri.Item_Name)) // ✅ FIX
            {
                return BadRequest(new { message = "Invalid ingredient data ❌" });
            }

            try
            {
                _repo.Add(ri);
                return Ok(new { message = "Recipe ingredient added successfully ✅" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        // PUT: api/RecipeIngredients
        [HttpPut]
        public IActionResult Put([FromBody] RecipeIngredient ri)
        {
            if (ri == null || ri.RecipeIngredient_Id <= 0 || ri.Recipe_Id <= 0 || ri.Cat_Id <= 0 || ri.Quantity <= 0 || string.IsNullOrEmpty(ri.Unit))
            {
                return BadRequest("Invalid ingredient data");
            }

            _repo.Update(ri);
            return Ok("Recipe ingredient updated successfully");
        }

        // DELETE: api/RecipeIngredients/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (id <= 0) return BadRequest("Invalid id");

            _repo.Delete(id);
            return Ok("Recipe ingredient deleted successfully");
        }
    }
}