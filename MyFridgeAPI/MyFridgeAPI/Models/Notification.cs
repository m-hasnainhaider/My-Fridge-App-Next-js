public class Notification
{
    public int Notification_Id { get; set; }
    public int U_Id { get; set; }
    public int? Fridge_Id { get; set; }   // ⭐ ADD THIS
    public int? Item_Id { get; set; }
    public int? Recipe_Id { get; set; }
    public string Type { get; set; }
    public string Message { get; set; }
    public bool Is_Read { get; set; }
    public DateTime Created_At { get; set; }
}