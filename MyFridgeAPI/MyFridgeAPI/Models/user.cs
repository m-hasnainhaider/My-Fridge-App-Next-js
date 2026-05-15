using System;

namespace MyFridgeAPI.Models
{
    public class User
    {
        public int U_Id { get; set; }           // Table ka primary key
        public string U_Name { get; set; } = string.Empty;
        public string Email { get; set; }
        public int FridgeId{ get; set; }
        public string Password { get; set; }// User ka name
        public DateTime Created_At { get; set; } // Record ka creation time
    }
}