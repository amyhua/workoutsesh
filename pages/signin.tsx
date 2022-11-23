import classNames from "classnames";
import Image from "next/image"
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import Layout from "../components/Layout"
import AuthService from "../auth-service";
import AuthContext from "../contexts/auth-context";
import Logo from "../components/Logo";

const AppleIconSvg = () => (
  <svg className="inline-block align-top mr-1 mt-0.25" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5977 10.4629C14.5898 9.13086 15.1934 8.12695 16.4121 7.38672C15.7305 6.41016 14.6992 5.87305 13.3398 5.76953C12.0527 5.66797 10.6445 6.51953 10.1289 6.51953C9.58398 6.51953 8.33789 5.80469 7.35742 5.80469C5.33398 5.83594 3.18359 7.41797 3.18359 10.6367C3.18359 11.5879 3.35742 12.5703 3.70508 13.582C4.16992 14.9141 5.8457 18.1777 7.59375 18.125C8.50781 18.1035 9.1543 17.4766 10.3437 17.4766C11.498 17.4766 12.0957 18.125 13.1152 18.125C14.8789 18.0996 16.3945 15.1328 16.8359 13.7969C14.4707 12.6816 14.5977 10.5313 14.5977 10.4629V10.4629ZM12.5449 4.50586C13.5352 3.33008 13.4453 2.25977 13.416 1.875C12.541 1.92578 11.5293 2.4707 10.9531 3.14063C10.3184 3.85938 9.94531 4.74805 10.0254 5.75C10.9707 5.82227 11.834 5.33594 12.5449 4.50586V4.50586Z" fill="white"/>
  </svg>
)

const LoadingBarbellSvg = ({ size, className, color }: { size?: number; className?: string; color?: string; }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 138 138" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="41" width="57" height="17" fill={color}/>
    <rect width="57" height="17" transform="matrix(1 0 0 -1 41 138)" fill={color}/>
    <rect x="26" y="17" width="86" height="25" fill={color}/>
    <rect width="86" height="25" transform="matrix(1 0 0 -1 26 121)" fill={color}/>
    <rect x="53" y="42" width="32" height="54" fill={color}/>
  </svg>
)

const LoadingPage = ({ active, message }: { active?: boolean; message: string; }) => (
  <div className={classNames(
    "flex justify-center absolute left-0 top-0 right-0 bottom-0 text-center h-full",
    {
      "hidden": !active
    }
  )}>
    <div className="z-10 bg-white absolute top-0 bottom-0 left-0 right-0 opacity-95" />
    <div className="z-20 h-full flex justify-center flex-col">
      <Image className="mx-auto animate-bounce w-[14] h-[14]" alt="Loading Spinner" src={require('../components/barbell-circle.svg')} />
      <div className="mt-5 text-center text-black">
        <span className="uppercase tracking-widest italic font-bold text-blue-700">
          {message || 'Just a second'}
        </span>
      </div>
    </div>
  </div>
)

enum SigninMethod {
  Apple = 'Apple',
  Email = 'Email',
  Create = 'Signup'
}

const ENABLE_APPLE_SIGNIN = false
const IS_MOCK_AUTH = true
const IS_MOCK_FIRST_USER = true
const SigninPage = () => {
  const { setAuthToken, authorized } = useContext(AuthContext)
  const router = useRouter()
  const isFirstTimeUser = IS_MOCK_FIRST_USER
  if (authorized) {
    // TODO: deserialize token, get username, and go to user's homepage
    console.log("TODO: deserialize token, get username, and go to user's homepage")
    // @TODO: fetch username and navigate accordingly
    console.log('@TODO: fetch username and navigate accordingly')
    if (isFirstTimeUser) {
      router.push('/intro')
    } else {
      router.push('/amyhua')
    }
  }

  const [loading, setLoading] = useState(false)
  const [focusedMethod, setFocusedMethod] = useState<SigninMethod>()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isAuthError, setIsAuthError] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const signInWithEmail = () => {
    setFocusedMethod(SigninMethod.Email)
  }
  const startCreateAccount = () => {
    setFocusedMethod(SigninMethod.Create)
  }
  const onSigninOrCreate = (e: any) => {
    e.preventDefault()
    setSubmitting(true)
    if (focusedMethod === SigninMethod.Apple) {
      // TODO: apple sign-in
    } else if (focusedMethod === SigninMethod.Email) {

    } else if (focusedMethod === SigninMethod.Create) {

    }
    console.log('TODO: submit form', {
      email,
      password,
      confirmPassword
    })
    const auth = new AuthService(email, password, IS_MOCK_AUTH) 
    setIsAuthError(false)
    auth.signin()
      .then((token: string) => {
        setAuthToken(token)
        console.log('Navigating to user homepage...')
        // @TODO: fetch username and navigate accordingly
        console.log('@TODO: fetch username and navigate accordingly')
        if (isFirstTimeUser) {
          router.push('/intro')
        } else {
          router.push('/amyhua')
        }
      })
      .catch(() => {
        console.error('Invalid login')
        setIsAuthError(true)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }
  console.log('isAuthError', isAuthError)
  return (
    <Layout title="Sign in | Workout Sesh" background="white">
      <main className="relative max-w-lg mx-auto h-full min-h-[800px] p-5">
        <LoadingPage active={loading} message="Signing you in" />
        <header className="mt-10">
          <Image
            className="mx-auto"
            height={200}
            alt="Workout animation"
            src={require('./workout-woman.gif')} />
          <h1 className="leading-10 text-center mt-6 mb-4 text-3xl font-bold px-3">
            Welcome to<br/>
            <Logo size={320} className="mx-auto mt-3" />
          </h1>
          <div className="mb-3 text-xl text-center">
            Track your workouts with ease.
          </div>
        </header>
        <div className="mx-10 py-10">
          <button
            disabled={submitting}
            className={classNames(
            "text-base p-3 w-full bg-black text-white rounded-lg",
            {
              "hidden": !ENABLE_APPLE_SIGNIN
            }
          )}>
            <AppleIconSvg /> Sign in with Apple
          </button>
          <button
            onClick={signInWithEmail}
            disabled={submitting}
            className={classNames(
              "text-base font-semibold mt-3 p-3 w-full text-black rounded-lg",
              {
                "hidden": focusedMethod === SigninMethod.Email ||
                  focusedMethod === SigninMethod.Create,
                "bg-slate-500": submitting,
                "bg-brightGreen": !submitting
              }
            )}>
            Sign in with Email
          </button>
          <form className={classNames(
            {
              "pt-0 mt-3 border-t border-slate-200": ENABLE_APPLE_SIGNIN,
              "hidden": !(
                focusedMethod === SigninMethod.Email ||
                focusedMethod === SigninMethod.Create
              )
            })} onSubmit={onSigninOrCreate}>
            <input
              disabled={submitting}
              className="rounded-lg w-full p-3 mt-3 bg-slate-200 focus:outline-none"
              type="email"
              name="email"
              required
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              placeholder="Email Address"
            />
            <div>
              {
                focusedMethod === SigninMethod.Create ?
                <input
                  disabled={submitting}
                  className={classNames(
                    "p-3 mt-3 bg-slate-200",
                    "w-full flex-1 rounded-lg sm:rounded-tl-lg sm:rounded-bl-lg",
                    "border-r border-r-slate-300",
                    "focus:outline-none"
                  )}
                  type="password"
                  required
                  name="password"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                :
                <div className="flex w-full">
                  <input
                    disabled={submitting}
                    className={classNames(
                      "p-3 mt-3 bg-slate-200",
                      "flex-1 rounded-tl-lg rounded-bl-lg",
                      "focus:outline-none"
                    )}
                    type="password"
                    required
                    name="password"
                    value={password}
                    onChange={(e: any) => setPassword(e.target.value)}
                    placeholder="Password"
                  />
                  <button
                    disabled={submitting}
                    type="submit"
                    className={classNames(
                      "p-3 mt-3 rounded-tr-lg rounded-br-lg font-semibold text-black",
                      "focus:outline-brightGreen2",
                      {
                        "bg-brightGreen": !submitting,
                        "bg-slate-300": submitting
                      }
                    )}
                  >
                    Sign in
                  </button>
                </div>
              }
              {
                focusedMethod === SigninMethod.Create ?
                <div className="flex">
                  <input
                    disabled={submitting}
                    className={classNames(
                      "p-3 mt-3 bg-slate-200",
                      "flex-1 rounded-tl-lg rounded-bl-lg",
                      "focus:outline-none"
                    )}
                    type="password"
                    required
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e: any) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                  />
                  <button
                    disabled={submitting}
                    type="submit"
                    className={classNames(
                      "p-3 mt-3 rounded-tr-lg rounded-br-lg font-semibold bg-brightGreen text-black",
                      "focus:outline-brightGreen2",
                      {
                        "bg-brightGreen": !submitting,
                        "bg-slate-300": submitting
                      }
                    )}
                  >
                    Sign up
                  </button>
                </div>
                : null
              }
            </div>
            {
              (isAuthError || submitting) &&
              <div className={classNames(
                "mt-5 text-center px-3",
                {
                  "text-slate-400": !isAuthError && submitting,
                  "text-red-400": isAuthError && !submitting,
                }
              )}>
                {
                  submitting &&
                  <LoadingBarbellSvg
                    size={25}
                    className="inline-block align-middle p-1 animate-spin"
                    color="#cbd5e1"
                  />
                }
                <span className="ml-1 align-middle inline-block">
                  {
                    isAuthError ?
                    'Invalid email and/or password. Please try again.' :
                    submitting ?
                    (
                      focusedMethod === SigninMethod.Create ?
                      'Creating account...' :
                      'Signing you in...'
                    ) :
                    null
                  }
                </span>
              </div>
            }
          </form>
          <button onClick={startCreateAccount}
            className={classNames(
              "text-base mt-3 p-3 w-full rounded-lg text-slate-500",
              {
                "hidden": focusedMethod === SigninMethod.Create
              }
            )}>
            Create a New Account
          </button>
          <button onClick={signInWithEmail}
            disabled={submitting}
            className={classNames(
              "text-base mt-3 p-3 w-full rounded-lg text-slate-500",
              {
                "hidden": focusedMethod !== SigninMethod.Create
              }
            )}>
            Sign in with Email
          </button>
        </div>
      </main>
    </Layout>
  )
}

export default SigninPage
