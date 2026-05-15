public class ActivityLog
{
    public int LogId { get; set; }
    public int UserId { get; set; }
    public int FridgeId { get; set; }

    public int? Item_Id { get; set; }     // ✅ nullable
    public int? Recipe_Id { get; set; }   // 🔥 NEW

    public string ItemName { get; set; }
    public string ActionType { get; set; }
    public decimal Quantity { get; set; }
    public string Description { get; set; }
    public DateTime ActionDate { get; set; }
}