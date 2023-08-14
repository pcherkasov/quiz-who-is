import api, { signin as apiSignin, signup as apiSignup, refreshToken as apiRefreshToken } from "./api";
import CookieService from "./CookieService";
import {NewUserRequestBody, SigninRequestBody, TokenRequestBody} from "../types/apiTypes";

class AuthService {
  navigateCallback = (path: string) => {};

  setNavigateCallback = (callback: any) => {
    this.navigateCallback = callback;
  }
  async signup(user: NewUserRequestBody, navigate: Function) {
    const response = await apiSignup(user);
    if(response.status === 201) {
      navigate('/auth/signin');
      return response;
    } else {
      throw new Error('Registration failed');
    }
  }

  async signin(user: SigninRequestBody, navigate: Function, setFullName: (fullName: string) => void) {
    const response = await apiSignin(user);
    if(response.status === 200) {
      this.setSession(response.data.accessToken, response.data.refreshToken);
      setFullName(response.data.fullName);
      navigate('/');
      return true;
    } else {
      navigate('/auth/signup');
      return false;
    }
  }

  logout() {
    this.removeSession();
    this.setNavigateCallback('/auth/signin');
  }

  async refreshAuthToken(refreshToken: string) {
    const response = await apiRefreshToken({refreshToken});
    if (response.status === 200) {
      this.setSession(response.data.accessToken, response.data.refreshToken);
      if(this.navigateCallback) {
        this.navigateCallback('/'); // navigate to main page after refreshing the token
      }
      return response;
    } else {
      this.removeSession();
      throw new Error('Token refresh failed');
    }
  }

  setSession(accessToken: string, refreshToken: string) {
    CookieService.setCookie("accessToken", accessToken, 1);
    CookieService.setCookie("refreshToken", refreshToken, 1);
  }

  removeSession() {
    CookieService.deleteCookie("accessToken");
    CookieService.deleteCookie("refreshToken");
  }
}

export default new AuthService();
