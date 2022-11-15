const MOCK_JWT_TOKEN = 'mockjwttoken'

export default class AuthService {
  username: string;
  password: string;
  authorized: boolean;
  isMock: boolean;
  constructor(username: string, password: string, isMock: boolean) {
    this.username = username
    this.password = password
    this.authorized = false
    this.isMock = isMock
  }
  signin(username?: string, password?: string): Promise<string> {
    this.authorized = true
    if (this.isMock) return new Promise((resolve: any, reject: any) => {
      setTimeout(() => {
        resolve({
          token: MOCK_JWT_TOKEN
        })
        // mock rejection
        // reject(404)
      }, 2000)
    })
    return Promise.resolve(200)
  }
  get isAuthorized() {
    return this.authorized
  }
  signout() {
    this.authorized = false
  }
}