using Microsoft.AspNetCore.Mvc;
using MyFridgeAPI.Models;
using MyFridgeAPI.Repositories;
using System.Collections.Generic;

namespace MyFridgeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FridgeCatController : ControllerBase
    {
        private readonly FridgeCatRepository _repo;
        public FridgeCatController(FridgeCatRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public ActionResult<List<FridgeCat>> Get() => _repo.GetAll();

        [HttpPost]
        public IActionResult Post([FromBody] FridgeCat fc)
        {
            _repo.Add(fc);
            return Ok("Fridge category added");
        }

        [HttpPut]
        public IActionResult Put([FromBody] FridgeCat fc)
        {
            _repo.Update(fc);
            return Ok("Fridge category updated");
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _repo.Delete(id);
            return Ok("Fridge category deleted");
        }
    }
}