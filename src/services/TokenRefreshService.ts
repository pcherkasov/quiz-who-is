import AuthService from "./AuthService";

class TokenRefreshService {
  refreshingInProgress: Promise<any> | null = null;

  async refresh(refreshToken: string) {
    if (!this.refreshingInProgress) {
      this.refreshingInProgress = AuthService.refreshAuthToken(refreshToken)
        .then(res => {
          this.refreshingInProgress = null;
          return res;
        })
        .catch(err => {
          this.refreshingInProgress = null;
          throw err;
        });
    }

    return this.refreshingInProgress;
  }
}

export default new TokenRefreshService();
