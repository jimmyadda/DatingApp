using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        public  AccountController (UserManager<AppUser> userManager, ITokenService tokenService, IMapper mapper)
        {
           _userManager = userManager;
            _mapper = mapper;
            _tokenService = tokenService;
           
        }

        [HttpPost("register")] //POST: api/Account/register
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if(await UserExists(registerDto.UserName)) return BadRequest("User Name is taken");

            var user = _mapper.Map<AppUser>(registerDto);
            user.UserName = registerDto.UserName.ToLower();            
            
            //ASP iDENTITY
            //using var hmac = new HMACSHA512(); 
            //user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
            //user.PasswordSalt = hmac.Key;


            var result = await _userManager.CreateAsync(user,registerDto.Password);
            
            if(!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await _userManager.AddToRoleAsync(user,"Member");

            if(!roleResult.Succeeded) return BadRequest(result.Errors);

            return new UserDto
            {
                username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };            
        }

        [HttpPost("login")] //POST: api/Account/login
        public async Task<ActionResult<UserDto>>Login(LoginDto loginDto)
        {
            var user = await _userManager.Users
            .Include(p => p.Photos)
            .SingleOrDefaultAsync(x=>x.UserName == loginDto.UserName);
            

            if (user == null)  return Unauthorized("Invalid UserName");
        
            var result = await _userManager.CheckPasswordAsync(user,loginDto.Password);

            if (!result) 
            {
                return Unauthorized("invalid password");
            }
            
            return new UserDto
            {
                username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                photoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender
            }; 
        }

        private async Task<bool> UserExists(string username)
        {
            return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }
}