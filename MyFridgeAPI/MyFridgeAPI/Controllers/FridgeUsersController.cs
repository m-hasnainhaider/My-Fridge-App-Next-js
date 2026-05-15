using Microsoft.AspNetCore.Mvc;
using MyFridgeAPI.Models;
using MyFridgeAPI.Repositories;
using System.Collections.Generic;

namespace MyFridgeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FridgeUsersController : ControllerBase
    {
        private readonly FridgeUsersRepository _repo;
        public FridgeUsersController(FridgeUsersRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public ActionResult<List<FridgeUser>> Get() => _repo.GetAll();

        [HttpPost]
        public IActionResult Post([FromBody] FridgeUser fu)
        {
            _repo.Add(fu);
            return Ok("Fridge user added");
        }

        [HttpPut]
        public IActionResult Put([FromBody] FridgeUser fu)
        {
            _repo.Update(fu);
            return Ok("Fridge user updated");
        }

        [HttpDelete("remove-user")]
        public IActionResult RemoveUser(int fridgeId, int ownerId, int removeUserId)
        {
            var success = _repo.RemoveUser(fridgeId, ownerId, removeUserId);

            if (!success)
                return BadRequest("Cannot remove user (either not owner or trying to remove owner)");

            return Ok("User removed successfully");
        }
        [HttpGet("fridge/{fridgeId}")]
        public ActionResult<List<FridgeUser>> GetByFridge(int fridgeId)
        {
            return _repo.GetByFridgeId(fridgeId);
        }

        [HttpPost("join")]

        public IActionResult Join([FromBody] FridgeUser fu)
        {
            var exists = _repo.CheckUserInFridge(fu.Fridge_Id, fu.U_Id);

            if (exists)
                return BadRequest("Already joined");

            _repo.Add(new FridgeUser
            {
                Fridge_Id = fu.Fridge_Id,
                U_Id = fu.U_Id,
                Role = "Member"
            });

            return Ok("Joined successfully");
        }
        [HttpPut("make-owner")]
        public IActionResult MakeOwner(int fridgeId, int ownerId, int newOwnerId)
        {
            var success = _repo.MakeOwner(fridgeId, ownerId, newOwnerId);

            if (!success)
                return Unauthorized("Only owner can assign ownership");

            return Ok("New owner assigned");
        }
    }
}