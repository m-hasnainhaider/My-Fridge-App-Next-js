namespace MyFridgeAPI.Models
{
    public class Recipe
    {
        public int Recipe_Id { get; set; }
        public string Recipe_Name { get; set; }
        public int Fridge_Id { get; set; }
        public string Recipe_Image { get; set; }

        public int User_Id { get; set; }
        public DateTime Created_At { get; set; }
        public int Servings { get; set; }
    }
}
