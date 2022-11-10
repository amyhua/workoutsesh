import classNames from "classnames";
import Image from "next/image"
import { useState } from "react";
import Layout from "../components/Layout"

const AppleIconSvg = () => (
  <svg className="inline-block align-top mr-1 mt-0.25" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5977 10.4629C14.5898 9.13086 15.1934 8.12695 16.4121 7.38672C15.7305 6.41016 14.6992 5.87305 13.3398 5.76953C12.0527 5.66797 10.6445 6.51953 10.1289 6.51953C9.58398 6.51953 8.33789 5.80469 7.35742 5.80469C5.33398 5.83594 3.18359 7.41797 3.18359 10.6367C3.18359 11.5879 3.35742 12.5703 3.70508 13.582C4.16992 14.9141 5.8457 18.1777 7.59375 18.125C8.50781 18.1035 9.1543 17.4766 10.3437 17.4766C11.498 17.4766 12.0957 18.125 13.1152 18.125C14.8789 18.0996 16.3945 15.1328 16.8359 13.7969C14.4707 12.6816 14.5977 10.5313 14.5977 10.4629V10.4629ZM12.5449 4.50586C13.5352 3.33008 13.4453 2.25977 13.416 1.875C12.541 1.92578 11.5293 2.4707 10.9531 3.14063C10.3184 3.85938 9.94531 4.74805 10.0254 5.75C10.9707 5.82227 11.834 5.33594 12.5449 4.50586V4.50586Z" fill="white"/>
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

const SigninPage = () => {
  const [loading, setLoading] = useState(false);
  const [focusedMethod, setFocusedMethod] = useState<SigninMethod>();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const signInWithEmail = () => {
    setFocusedMethod(SigninMethod.Email)
  }
  const startCreateAccount = () => {
    setFocusedMethod(SigninMethod.Create)
  }
  const onSigninOrCreate = (e: any) => {
    e.preventDefault()
    if (focusedMethod === SigninMethod.Apple) {

    } else if (focusedMethod === SigninMethod.Email) {

    } else if (focusedMethod === SigninMethod.Create) {

    }
  }
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
          <h1 className="leading-10 text-center my-6 text-3xl font-bold px-3">
            Welcome to<br/>
            <div className="mt-5 uppercase tracking-wider italic">Workout Sesh</div>
          </h1>
          <ul className="mt-7 text-xl text-center mx-auto">
            <li className="mb-3">
              Track your workouts with ease.
            </li>
          </ul>
        </header>
        <div className="mx-10 py-10">
          <button className={classNames(
            "text-base p-3 w-full bg-black text-white rounded-lg",
            {
              "hidden": !ENABLE_APPLE_SIGNIN
            }
          )}>
            <AppleIconSvg /> Sign in with Apple
          </button>
          <button
            onClick={signInWithEmail}
            className={classNames(
              "text-base font-semibold mt-3 p-3 w-full text-black bg-brightGreen rounded-lg",
              {
                "hidden": focusedMethod === SigninMethod.Email ||
                  focusedMethod === SigninMethod.Create
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
              className="rounded-lg w-full p-3 mt-3 bg-slate-200"
              type="email"
              name="email"
              placeholder="Email Address"
            />
            <div>
              {
                focusedMethod === SigninMethod.Create ?
                <input
                  className={classNames(
                    "p-3 mt-3 bg-slate-200",
                    "w-full flex-1 rounded-lg sm:rounded-tl-lg sm:rounded-bl-lg",
                    "border-r border-r-slate-300"
                  )}
                  type="password"
                  name="password"
                  placeholder="Password"
                />
                :
                <div className="flex w-full">
                  <input
                    className={classNames(
                      "p-3 mt-3 bg-slate-200",
                      "flex-1 rounded-tl-lg rounded-bl-lg"
                    )}
                    type="password"
                    name="password"
                    placeholder="Password"
                  />
                  <button
                    type="submit"
                    className="p-3 mt-3 rounded-tr-lg rounded-br-lg font-semibold bg-brightGreen text-black"
                  >
                    Sign in
                  </button>
                </div>
              }
              {
                focusedMethod === SigninMethod.Create ?
                <div className="flex">
                  <input
                    className={classNames(
                      "p-3 mt-3 bg-slate-200",
                      "flex-1 rounded-tl-lg rounded-bl-lg"
                    )}
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                  />
                  <button
                    type="submit"
                    className="p-3 mt-3 rounded-tr-lg rounded-br-lg font-semibold bg-brightGreen text-black"
                  >
                    Sign up
                  </button>
                </div>
                : null
              }
            </div>
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
