using Microsoft.AspNetCore.Mvc;
using MyFridgeAPI.Models;
using MyFridgeAPI.Repositories;
using System.Collections.Generic;

namespace MyFridgeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FridgeController : ControllerBase
    {
        private readonly FridgeRepository _repo;
        public FridgeController(FridgeRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public ActionResult<List<fridge>> Get() => _repo.GetAllFridges();

        [HttpPost]
        public IActionResult Post([FromBody] fridge fridge)
        {
            _repo.AddFridge(fridge);

            // Fridge add hone ke baad ID return karo
            return Ok(new
            {
                message = "Fridge created successfully",
                fridgeId = fridge.Fridge_Id  // repo me insert ke baad identity set ho jaye
            });
        }

        [HttpPut]
        public IActionResult Put([FromBody] fridge fridge)
        {
            _repo.UpdateFridge(fridge);
            return Ok(new { message = "Fridge updated successfully" });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _repo.DeleteFridge(id);
            return Ok(new { message = "Fridge deleted successfully" });
        }
        [HttpGet("{id}")]
        public ActionResult<fridge> GetById(int id)
        {
            var fridge = _repo.GetAllFridges().FirstOrDefault(f => f.Fridge_Id == id);
            if (fridge == null) return NotFound();
            return Ok(fridge);
        }
    }
}