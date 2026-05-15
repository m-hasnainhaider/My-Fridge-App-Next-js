namespace MyFridgeAPI.Models
{
    public class FridgeItemPreservation
    {
        public int FridgeItemPreservation_Id { get; set; }
        public int Cat_Id { get; set; }
        public int FridgeCat_Id { get; set; }
        public int Time_Preservation { get; set; } // in days
        public DateTime Created_At { get; set; }
    }
}
