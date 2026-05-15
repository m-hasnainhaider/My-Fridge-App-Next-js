using Microsoft.AspNetCore.Mvc;
using MyFridgeAPI.Models;
using MyFridgeAPI.Repositories;
using System.Collections.Generic;

namespace MyFridgeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActivityLogsController : ControllerBase
    {
        private readonly ActivityLogsRepository _repo;

        public ActivityLogsController(ActivityLogsRepository repo)
        {
            _repo = repo;
        }

        // 🔹 GET logs by fridgeId
        [HttpGet("{fridgeId}")]
        public ActionResult<List<ActivityLog>> GetByFridge(int fridgeId)
        {
            try
            {
                var logs = _repo.GetByFridge(fridgeId);
                return Ok(logs);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}