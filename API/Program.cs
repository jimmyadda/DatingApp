using System.Text;
using API.Data;
using API.Extensions;
using API.Interfaces;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

/****Moved to Extensions-->ApplicationServiceExtensions***/

// builder.Services.AddDbContext<DataContext>(opt => 
// {
//  opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")); 
// });

// builder.Services.AddCors();
// builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddApplicationServices(builder.Configuration);

/****Moved to Extensions-->IdentityServiceExtensions***/

/* builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(option =>
{
    option.TokenValidationParameters = new TokenValidationParameters
    {
      ValidateIssuerSigningKey = true,
      IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["TokenKey"])),
      ValidateIssuer = false,
      ValidateAudience = false
    };
});
 */

builder.Services.AddIdentityServices(builder.Configuration);
var app = builder.Build();

app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200"));
//Authenticate MiddleWare
app.UseAuthentication(); //Valid token
app.UseAuthorization(); //token valid , wht are you allowed


app.MapControllers();

app.Run();
