import api, { signin as apiSignin, signup as apiSignup, refreshToken as apiRefreshToken } from "./api";
import CookieService from "./CookieService";
import {NewUserRequestBody, SigninRequestBody} from "../types/apiTypes";

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
      this.setSession(response.data.accessToken, response.data.refreshToken, response.data.fullName);
      setFullName(response.data.fullName);
      localStorage.setItem("fullName", response.data.fullName);
      navigate('/organisations');
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
      this.setSession(response.data.accessToken, response.data.refreshToken, response.data.fullName);
      if(this.navigateCallback) {
        this.navigateCallback('/organisations'); // navigate to main page after refreshing the token
      }
      return response;
    } else {
      throw new Error('Token refresh failed');
    }
  }

  setSession(accessToken: string, refreshToken: string, fullName: string) {
    CookieService.setCookie("accessToken", accessToken, 1);
    CookieService.setCookie("refreshToken", refreshToken, 1);
    localStorage.setItem("fullName", fullName);
  }

  removeSession() {
    CookieService.deleteCookie("accessToken");
    CookieService.deleteCookie("refreshToken");
    localStorage.removeItem("fullName");
  }
}

export default new AuthService();
