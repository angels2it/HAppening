using System.Threading.Tasks;
using HAppening.Mobile.Models;
using HAppening.Mobile.ViewModels;

namespace HAppening.Mobile.Services
{
    public interface IAccountService
    {
        Task<LoginModelResult> Login(LoginModel model);
        UserData GetUserById(string id);
    }
}
