using Microsoft.AspNetCore.Mvc;
using MyFridgeAPI.Models;
using MyFridgeAPI.Repositories;
using System.Collections.Generic;

namespace MyFridgeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryRepository _repo;
        public CategoryController(CategoryRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public ActionResult<List<Category>> Get() => _repo.GetAll();

        [HttpPost]
        public IActionResult Post([FromBody] Category cat)
        {
            _repo.Add(cat);
            return Ok("Category added");
        }

        [HttpPut]
        public IActionResult Put([FromBody] Category cat)
        {
            _repo.Update(cat);
            return Ok("Category updated");
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _repo.Delete(id);
            return Ok("Category deleted");
        }
    }
}