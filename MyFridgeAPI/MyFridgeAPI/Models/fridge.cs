using System;
using System.Text.Json.Serialization;

namespace MyFridgeAPI.Models
{
    public class fridge
    {
        public int Fridge_Id { get; set; }

        [JsonPropertyName("U_Id")]
        public int U_Id { get; set; }

        [JsonPropertyName("Fridge_Name")]
        public string Fridge_Name { get; set; }

        [JsonPropertyName("Rating")]
        public int Rating { get; set; }

        public DateTime Created_At { get; set; }
    }
}