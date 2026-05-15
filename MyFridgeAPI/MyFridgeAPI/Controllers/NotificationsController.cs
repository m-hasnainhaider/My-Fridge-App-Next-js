using Microsoft.AspNetCore.Mvc;
using MyFridgeAPI.Models;
using MyFridgeAPI.Repositories;
using System;
using System.Collections.Generic;

namespace MyFridgeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly NotificationsRepository _repo;
        private readonly ItemsRepository _itemRepo;
        private readonly FridgeUsersRepository _fridgeUsersRepo;

        public NotificationsController(
            NotificationsRepository repo,
            ItemsRepository itemRepo,
            FridgeUsersRepository fridgeUsersRepo)
        {
            _repo = repo;
            _itemRepo = itemRepo;
            _fridgeUsersRepo = fridgeUsersRepo;
        }

        // ================= GET USER NOTIFICATIONS =================
        [HttpGet("user/{userId}/{fridgeId}")]
        public ActionResult<List<Notification>> GetByUser(int userId, int fridgeId)
        {
            return _repo.GetByUser(userId, fridgeId);
        }

        // ================= ADD MANUAL =================
        [HttpPost]
        public IActionResult Add([FromBody] Notification n)
        {
            _repo.Add(n);
            return Ok("Notification added");
        }

        // ================= MARK AS READ =================
        [HttpPut("read/{id}")]
        public IActionResult MarkAsRead(int id)
        {
            _repo.MarkAsRead(id);
            return Ok("Marked as read");
        }

        // ================= DELETE =================
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _repo.Delete(id);
            return Ok("Deleted");
        }

        // ================= EXPIRY CHECK =================
        [HttpPost("check-expiry")]
        public IActionResult CheckExpiry()
        {
            var items = _itemRepo.GetAllItems();

            foreach (var item in items)
            {
                if (item.Expiry_Date == null)
                    continue;

                var today = DateTime.Now.Date;
                var expiry = item.Expiry_Date.Value.Date;

                // ❌ Already expired
                if (expiry < today)
                {
                    var users = _fridgeUsersRepo.GetByFridgeId(item.Fridge_Id);

                    foreach (var u in users)
                    {
                        if (!_repo.Exists(u.U_Id, item.Item_Id, "expired", item.Fridge_Id))
                        {
                            _repo.Add(new Notification
                            {
                                U_Id = u.U_Id,
                                Fridge_Id = item.Fridge_Id,
                                Item_Id = item.Item_Id,
                                Type = "expired",
                                Message = $"{item.Item_Name} has already expired ❌",
                                Is_Read = false,
                                Created_At = DateTime.Now
                            });
                        }
                    }
                }

                // ⚠️ Expiring soon (ONLY future items)
                else if (expiry <= today.AddDays(2))
                {
                    var users = _fridgeUsersRepo.GetByFridgeId(item.Fridge_Id);

                    foreach (var u in users)
                    {
                        if (!_repo.Exists(u.U_Id, item.Item_Id, "expiry", item.Fridge_Id))
                        {
                            _repo.Add(new Notification
                            {
                                U_Id = u.U_Id,
                                Fridge_Id = item.Fridge_Id,
                                Item_Id = item.Item_Id,
                                Type = "expiry",
                                Message = $"{item.Item_Name} expiring soon! ⏳",
                                Is_Read = false,
                                Created_At = DateTime.Now
                            });
                        }
                    }
                }
            }

            return Ok("Expiry checked");
        }

        // ================= LOW STOCK CHECK =================
        [HttpPost("check-low-stock")]
        public IActionResult CheckLowStock()
        {
            var items = _itemRepo.GetAllItems();

            foreach (var item in items)
            {
                if (item.Quantity <= 2)
                {
                    var users = _fridgeUsersRepo.GetByFridgeId(item.Fridge_Id);

                    foreach (var u in users)
                    {
                        if (!_repo.Exists(u.U_Id, item.Item_Id, "low", item.Fridge_Id))
                        {
                            _repo.Add(new Notification
                            {
                                U_Id = u.U_Id,
                                Fridge_Id = item.Fridge_Id,
                                Item_Id = item.Item_Id,
                                Type = "low",
                                Message = $"{item.Item_Name} is low stock",
                                Is_Read = false,
                                Created_At = DateTime.Now
                            });
                        }
                    }
                }
            }

            return Ok("Low stock checked");
        }

        // ================= RECIPE SELECTED =================
        [HttpPost("recipe-selected")]
        public IActionResult RecipeSelected([FromBody] RecipeRequest req)
        {
            var users = _fridgeUsersRepo.GetByFridgeId(req.FridgeId);

            foreach (var u in users)
            {
                if (u.U_Id != req.UserId)
                {
                    _repo.Add(new Notification
                    {
                        U_Id = u.U_Id,
                        Fridge_Id = req.FridgeId,
                        Type = "recipe",
                        Message = $"{req.UserName} is making {req.RecipeName} today 🍛",
                        Is_Read = false,
                        Created_At = DateTime.Now
                    });
                }
            }

            return Ok("Recipe notification sent");
        }

        // ================= MISSING RECIPE ALERT =================
        [HttpPost("missing-recipe-alert")]
        public IActionResult MissingRecipeAlert([FromBody] MissingRecipeRequest req)
        {
            var users = _fridgeUsersRepo.GetByFridgeId(req.FridgeId);

            var ingredients = _itemRepo.GetMissingIngredientsForRecipe(req.RecipeId, req.FridgeId);

            string ingredientText = "";

            foreach (var i in ingredients)
            {
                if (i.MissingQuantity > 0)
                {
                    ingredientText += $"- {i.Item_Name}: missing {i.MissingQuantity} {i.Unit}\n";
                }
            }

            string message =
                $"⚠️ {req.RecipeName} cannot be prepared!\n\nMissing Ingredients:\n{ingredientText}";

            foreach (var u in users)
            {
                _repo.Add(new Notification
                {
                    U_Id = u.U_Id,
                    Fridge_Id = req.FridgeId,
                    Recipe_Id = req.RecipeId,
                    Type = "recipe-missing",
                    Message = message,
                    Is_Read = false,
                    Created_At = DateTime.Now
                });
            }

            return Ok("Missing recipe alert sent to all members");
        }
    }

    // ================= MODELS =================

    public class RecipeRequest
    {
        public int FridgeId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string RecipeName { get; set; }
    }

    public class MissingRecipeRequest
    {
        public int FridgeId { get; set; }
        public int RecipeId { get; set; }
        public string RecipeName { get; set; }
    }
}