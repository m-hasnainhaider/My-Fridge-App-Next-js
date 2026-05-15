namespace MyFridgeAPI.Models
{
    public class RecipeIngredient
    {
        public int RecipeIngredient_Id { get; set; }
        public int Recipe_Id { get; set; }
        public string Item_Name { get; set; }
        public int Cat_Id { get; set; }
        public decimal Quantity { get; set; }   // 1 person quantity
        public string Unit { get; set; }
    }
}
