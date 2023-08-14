import Cookies from 'js-cookie';

class CookieService {
  setCookie(name: string, value: string, days: number) {
    Cookies.set(name, value, { expires: days });
  }

  deleteCookie(name: string) {
    Cookies.remove(name);
  }

  getCookie(name: string) {
    return Cookies.get(name);
  }
}

export default new CookieService();
