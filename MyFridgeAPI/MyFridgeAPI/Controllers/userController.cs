using Microsoft.AspNetCore.Mvc;
using MyFridgeAPI.Models;
using MyFridgeAPI.Repositories;

namespace MyFridgeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserRepository _repo;

        // Constructor → Repository inject kar rahe hain
        public UsersController(UserRepository repo)
        {
            _repo = repo;
        }

        // GET: api/users
        [HttpGet]
        public IActionResult Get()
        {
            var users = _repo.GetAllUsers();
            return Ok(users); // JSON response return karega
        }

        // POST: api/users
        [HttpPost]
        public IActionResult Post([FromBody] User user)
        {
            _repo.AddUser(user);
            return Ok("User added successfully");
        }

        // PUT: api/users
        [HttpPut]
        public IActionResult Put([FromBody] User user)
        {
            _repo.UpdateUser(user);
            return Ok("User updated successfully");
        }

        // DELETE: api/users/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _repo.DeleteUser(id);
            return Ok("User deleted successfully");
        }
       
        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            _repo.Register(user);

            // ✅ JSON response instead of plain string
            return Ok(new { message = "User Registered Successfully" });
        }
        [HttpPost("login")]
        
        public IActionResult Login([FromBody] User loginData)
        {
            var result = _repo.Login(loginData.Email, loginData.Password);

            if (result == null || result.Count == 0)
                return Unauthorized(new { message = "Invalid Email or Password" });

            return Ok(result); // ab multiple fridges milenge 🔥
        }
    }

    }
