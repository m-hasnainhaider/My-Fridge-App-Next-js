using Microsoft.AspNetCore.Mvc;
using MyFridgeAPI.Models;
using MyFridgeAPI.Repositories;
using System.Collections.Generic;

namespace MyFridgeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemsController : ControllerBase
    {
        private readonly ItemsRepository _repo;

        public ItemsController(ItemsRepository repo)
        {
            _repo = repo;
        }

        // 🔹 Get all items
        [HttpGet]
        public ActionResult<List<Item>> Get() => _repo.GetAllItems();

        // 🔹 Add item
        [HttpPost]
        public IActionResult Post([FromBody] Item item)
        {
            int userId = 1; // 💡 Logged-in user (example, replace with real auth)
            _repo.AddItem(item, userId); // Updated repository to accept userId
            return Ok(new { message = "Item added successfully" });
        }

        // 🔹 Update item
        [HttpPut]
        public IActionResult Put([FromBody] Item item)
        {
            int userId = 1; // 💡 Logged-in user
            _repo.UpdateItem(item, userId);
            return Ok(new { message = "Item updated successfully" });
        }

        // 🔹 Delete item
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            int userId = 1; // 💡 Logged-in user
            _repo.DeleteItem(id, userId);
            return Ok(new { message = "Item deleted successfully" });
        }

        // 🔹 Get items by fridge
        [HttpGet("{fridgeId}")]
        public ActionResult<List<Item>> GetItemsByFridge(int fridgeId)
        {
            var items = _repo.GetItemsByFridge(fridgeId);
            return Ok(items);
        }

        // 🔹 Consume item
        [HttpPatch("consume/{id}")]
        public IActionResult ConsumeItem(int id, [FromBody] ConsumeRequest request)
        {
            int userId = 1; // 💡 Logged-in user
            var item = _repo.GetItemById(id);
            if (item == null) return NotFound(new { message = "Item not found" });

            if (request.Quantity <= 0) return BadRequest(new { message = "Quantity must be > 0" });

            decimal consumedQty = request.Quantity;
            item.Quantity -= consumedQty;
            if (item.Quantity < 0) consumedQty += item.Quantity; // correct negative qty
            if (item.Quantity < 0) item.Quantity = 0;

            _repo.UpdateItem(item, userId);

            return Ok(new
            {
                message = $"Consumed {consumedQty} {item.Unit}",
                newQuantity = item.Quantity
            });
        }

        public class ConsumeRequest
        {
            public decimal Quantity { get; set; }
        }
    }
}