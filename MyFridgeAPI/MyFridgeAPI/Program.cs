using MyFridgeAPI.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// ✅ Add Swagger
builder.Services.AddEndpointsApiExplorer();


// ✅ Add repositories to DI container
builder.Services.AddSingleton<UserRepository>();
builder.Services.AddSingleton<ItemsRepository>();
builder.Services.AddSingleton<FridgeRepository>();
builder.Services.AddSingleton<FridgeCatRepository>();
builder.Services.AddSingleton<CategoryRepository>();
builder.Services.AddSingleton<RecipesRepository>();
builder.Services.AddSingleton<RecipeIngredientsRepository>();
builder.Services.AddSingleton<NotificationsRepository>();
builder.Services.AddSingleton<FridgeUsersRepository>();
builder.Services.AddSingleton<ActivityLogsRepository>();

// ✅ Enable CORS for all origins (for Flutter Desktop)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// ✅ Enable Swagger (always, not just in Development)

// ✅ Use CORS
app.UseCors("AllowAll");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();