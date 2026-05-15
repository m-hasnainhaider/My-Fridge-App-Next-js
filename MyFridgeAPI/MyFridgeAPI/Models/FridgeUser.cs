namespace MyFridgeAPI.Models
{
    public class FridgeUser
    {
        public int FridgeUser_Id { get; set; }
        public int Fridge_Id { get; set; }
        public int U_Id { get; set; }
        public string Role { get; set; } = "Member";
        public string? U_Name { get; set; }
    }
}
