using System.Data.SqlClient;

public class UserRepository
{
    private readonly string _connectionString;

    public UserRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("MyFridgeDB");
    }

    public List<User> GetAllUsers()
    {
        var users = new List<User>();
        using (SqlConnection conn = new SqlConnection(_connectionString))
        {
            conn.Open();
            SqlCommand cmd = new SqlCommand("SELECT * FROM Users", conn);
            SqlDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                users.Add(new User
                {
                    U_Id = (int)reader["U_Id"],
                    U_Name = reader["U_Name"].ToString(),
                    Created_At = (DateTime)reader["Created_At"]
                });
            }
        }
        return users;
    }

    public void AddUser(User user)
    {
        using (SqlConnection conn = new SqlConnection(_connectionString))
        {
            conn.Open();
            SqlCommand cmd = new SqlCommand("INSERT INTO Users (U_Name) VALUES (@name)", conn);
            cmd.Parameters.AddWithValue("@name", user.U_Name);
            cmd.ExecuteNonQuery();
        }
    }

    public void UpdateUser(User user)
    {
        using (SqlConnection conn = new SqlConnection(_connectionString))
        {
            conn.Open();
            SqlCommand cmd = new SqlCommand("UPDATE Users SET U_Name=@name WHERE U_Id=@id", conn);
            cmd.Parameters.AddWithValue("@name", user.U_Name);
            cmd.Parameters.AddWithValue("@id", user.U_Id);
            cmd.ExecuteNonQuery();
        }
    }

    public void DeleteUser(int id)
    {
        using (SqlConnection conn = new SqlConnection(_connectionString))
        {
            conn.Open();
            SqlCommand cmd = new SqlCommand("DELETE FROM Users WHERE U_Id=@id", conn);
            cmd.Parameters.AddWithValue("@id", id);
            cmd.ExecuteNonQuery();
        }
    }
}