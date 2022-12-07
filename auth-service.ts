const MOCK_JWT_TOKEN = 'mockjwttoken'

export default class AuthService {
  email: string;
  password: string;
  authorized: boolean;
  isMock: boolean;
  constructor(email: string, password: string, isMock: boolean = false) {
    this.email = email
    this.password = password
    this.authorized = false
    this.isMock = isMock
  }
  async signupEmail(confirmPassword: string, csrfToken: any) {
    if (this.password !== confirmPassword) {
      return Promise.reject({
        error: true,
        message: 'The confirm password did not match. Please try again.'
      })
    }
    try {
      const response = await fetch('/api/auth/signin/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
          csrfToken,
        })
      })
      return response.json();
    } catch(err) {
      console.log('Auth Service err', err);
      return Promise.reject(err)
    }
  }
  async signin() {
    const response = await fetch(`/api/auth`, {

    })
    this.authorized = response.status === 200
    return response.json()
  }
  get isAuthorized() {
    return this.authorized
  }
  signout() {
    // TODO: end session
    this.authorized = false
  }
}