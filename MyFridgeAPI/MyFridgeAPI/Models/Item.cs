namespace MyFridgeAPI.Models
{
    public class Item
    {
        public int Item_Id { get; set; }
        public string Item_Name { get; set; }
        public decimal Quantity { get; set; }
        public string Unit { get; set; }
        public DateTime? Expiry_Date { get; set; }
        public int Fridge_Id { get; set; }
        public int Cat_Id { get; set; }
        public string? Cat_Name { get; set; }
        public bool IsFreezer { get; set; }
        public DateTime Created_At { get; set; }
        public int User_Id { get; set; }
        public bool IsDeleted { get; set; } = false;
        public DateTime? FinalExpiry { get; set; }
    }
}
