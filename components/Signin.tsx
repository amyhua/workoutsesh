import classNames from "classnames";
import Image from "next/image"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../components/Layout"
import AuthService from "../auth-service";
import { getProviders, getCsrfToken, signIn, useSession, } from 'next-auth/react';
import Logo from "../components/Logo";
import { ArrowRightCircleIcon, ArrowRightIcon, StarIcon } from "@heroicons/react/20/solid";

const AppleIconSvg = () => (
  <svg className="inline-block align-top mr-1 mt-0.25" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5977 10.4629C14.5898 9.13086 15.1934 8.12695 16.4121 7.38672C15.7305 6.41016 14.6992 5.87305 13.3398 5.76953C12.0527 5.66797 10.6445 6.51953 10.1289 6.51953C9.58398 6.51953 8.33789 5.80469 7.35742 5.80469C5.33398 5.83594 3.18359 7.41797 3.18359 10.6367C3.18359 11.5879 3.35742 12.5703 3.70508 13.582C4.16992 14.9141 5.8457 18.1777 7.59375 18.125C8.50781 18.1035 9.1543 17.4766 10.3437 17.4766C11.498 17.4766 12.0957 18.125 13.1152 18.125C14.8789 18.0996 16.3945 15.1328 16.8359 13.7969C14.4707 12.6816 14.5977 10.5313 14.5977 10.4629V10.4629ZM12.5449 4.50586C13.5352 3.33008 13.4453 2.25977 13.416 1.875C12.541 1.92578 11.5293 2.4707 10.9531 3.14063C10.3184 3.85938 9.94531 4.74805 10.0254 5.75C10.9707 5.82227 11.834 5.33594 12.5449 4.50586V4.50586Z" fill="white"/>
  </svg>
)

const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

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

enum AuthMethod {
  Apple = 'Apple',
  Email = 'Email',
  MagicLink = 'MagicLink',
  Create = 'Signup',
}

const ENABLE_APPLE_SIGNIN = false

const errorMsg = {
  OAuthAccountNotLinked: 'This account belongs with another sign-in method. Try Sign in with Email.',
  Verification: 'Invalid verification. You may have used an expired token. Please try again.'
} as any;

const Signin = () => {
  const router = useRouter();
  const session = useSession();
  const csrfToken = getCsrfToken();
  const { status } = session;
  console.log('!session', session);
  const { redirect='/' } = router.query;
  if (status === 'authenticated') {
    router.push(typeof redirect === 'string' ? redirect : redirect[0])
  }

  const { error } = router.query;
  console.log('query error', router, router.query, router.query.error, error, errorMsg[router.query.error]);
  const [loading, setLoading] = useState(false)
  const [focusedMethod, setFocusedMethod] = useState<AuthMethod>()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [authError, setAuthError] = useState(
    error === undefined ? undefined :
    (errorMsg[String(error)] || error))
  console.log('!authError', authError);
  const [sentVerifyEmail, setSentVerifyEmail] = useState(false);
  const [submitting, setSubmitting] = useState(false)
  const [providers, setProviders] = useState<any>([]);
  const loadProviders = async () => {
    const providers = await getProviders();
    if (providers) setProviders(providers);
  }
  const signInWithEmail = async () => {
    setFocusedMethod(AuthMethod.Email)
    // const token = await signIn('email', {
    //   email,
    // });
    // console.log('email signin', token);
  }
  const signInWithMagicLink = () => {
    setFocusedMethod(AuthMethod.MagicLink)
  }
  const startCreateAccount = () => {
    setFocusedMethod(AuthMethod.Create)
  }
  const onSigninOrCreate = (e: any) => {
    e.preventDefault()
    setSubmitting(true)
    // sign in
    if (focusedMethod === AuthMethod.Apple) {
      // TODO: apple sign-in
    } else if (focusedMethod === AuthMethod.MagicLink) {
      setSentVerifyEmail(false);
      signIn('email', {
        email,
        redirect: false,
      })
      .then((res) => {
        if (res && res.error) {
          return Promise.reject();
        }
        setSentVerifyEmail(true);
      })
      .catch(err => {
        console.log('on err', err);
      })
      .finally(() => {
        setSubmitting(false);
      });
    } else if (
      focusedMethod === AuthMethod.Email ||
      focusedMethod === AuthMethod.Create
    ) {
      signIn('credentials', {
        email,
        username,
        password,
        confirmPassword: focusedMethod === AuthMethod.Create ?
          confirmPassword : '',
        callbackUrl: '/',
        csrfToken,
      })
      .then((res) => {
        if (res && !res.ok) {
          console.log('set');
          setAuthError(res.error);
        }
        console.log('resolved res', res);
        if (focusedMethod === AuthMethod.Create) {
          // after sign-up, automatically sign in
          signIn('credentials', {
            email,
            password,
            csrfToken,
          });
        }
      })
      .catch(err => {
        console.log('on err', err);
      })
      .finally(() => {
        setSubmitting(false);
      });
    }
    // console.log('TODO: submit form', {
    //   email,
    //   password,
    //   confirmPassword
    // }) 
    // setIsAuthError(false)
    // auth.signin()
    //   .then((token: string) => {
    //     setAuthToken(token)
    //     console.log('Navigating to user homepage...')
    //     // @TODO: fetch username and navigate accordingly
    //     console.log('@TODO: fetch username and navigate accordingly')
    //     if (isFirstTimeUser) {
    //       router.push('/intro')
    //     } else {
    //       router.push('/amyhua')
    //     }
    //   })
    //   .catch(() => {
    //     console.error('Invalid login')
    //     setIsAuthError(true)
    //   })
    //   .finally(() => {
    //     setSubmitting(false)
    //   })
  }
  console.log('!!authError', authError)

  useEffect(() => {
    loadProviders();
  }, []);

  const createDisabled = submitting || !username || !email || !password || !confirmPassword;

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
            <Logo onDark={false} size={320} className="mx-auto mt-3" />
          </h1>
          <div className="mb-3 text-xl text-center">
            Track your workouts with ease.
          </div>
        </header>
        <div className="mx-10 py-10">
          {
            (authError !== undefined || error) ?
            <div className="mb-3 text-sm p-3 rounded-lg bg-red-100 text-red-700">
              <span className="font-bold">Error:</span> {authError || errorMsg[String(error)] || error}
            </div>
            : null
          }
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
          {
            providers.google && (
              <button
                onClick={() => signIn(providers.google.id)}
                disabled={submitting}
                className={classNames(
                "font-semibold text-base p-3 w-full bg-[#4285F4] text-white rounded-lg",
              )}>
                Sign in with Google
              </button>
            )
          }
          <button
            onClick={signInWithMagicLink}
            disabled={submitting}
            className={classNames(
              "text-base font-semibold mt-3 p-3 w-full text-black rounded-lg",
              {
                "hidden": focusedMethod === AuthMethod.MagicLink,
                "bg-slate-500": submitting,
                "bg-white border border-black": !submitting
              }
            )}>
            Sign in with Email
          </button>
          {/* <button
            onClick={signInWithEmail}
            disabled={submitting}
            className={classNames(
              "text-base font-semibold mt-3 p-3 w-full text-black rounded-lg",
              {
                "hidden": focusedMethod === AuthMethod.Email,
                "bg-slate-500": submitting,
                "bg-white border border-black": !submitting
              }
            )}>
            Sign in with Username / Email
          </button> */}
          <form className={classNames(
            {
              "pt-0 mt-3 border-t border-slate-200": ENABLE_APPLE_SIGNIN,
              "hidden": !(
                focusedMethod === AuthMethod.Email ||
                focusedMethod === AuthMethod.Create ||
                focusedMethod === AuthMethod.MagicLink
              )
            })} onSubmit={onSigninOrCreate}>
            <h2 className="mt-7 text-center text-base mb-0 text-gray-600 font-semibold">
              {
                focusedMethod === AuthMethod.Create ?
                'Sign up' :
                focusedMethod === AuthMethod.Email ?
                'Sign in' :
                'Get a Magic Link sent to your email to sign in.'
              }
            </h2>
            {
              focusedMethod === AuthMethod.Email ?
              <input
                disabled={submitting}
                className="rounded-lg w-full p-3 mt-3 bg-slate-200 focus:outline-none"
                type={(email || username).match(/\@/) ? 'email' : 'text'}
                name="username"
                required
                value={email || username}
                onChange={(e: any) => {
                  const str = e.target.value;
                  if (validateEmail(str)) {
                    setEmail(str);
                    setUsername('');
                  } else {
                    // no special characters
                    setUsername(str);
                    setEmail('');
                  }
                }}
                placeholder="Username or Email"
              />
              :
              focusedMethod === AuthMethod.Create ?
              <>
                <input
                  disabled={submitting}
                  className="rounded-lg w-full p-3 mt-3 bg-slate-200 focus:outline-none"
                  type="text"
                  name="username"
                  required
                  value={username}
                  onChange={(e: any) => setUsername(e.target.value)}
                  placeholder="Username"
                />
                <input
                  disabled={submitting}
                  className="rounded-lg w-full p-3 mt-3 bg-slate-200 focus:outline-none"
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  placeholder="Email"
                />
              </>
              :
              focusedMethod === AuthMethod.MagicLink ?
              <>
                <div className="flex w-full">
                  <input
                    disabled={submitting}
                    className={classNames(
                      "py-3 pl-3 pr-5 mt-3 bg-slate-200",
                      "flex-1 rounded-tl-lg rounded-bl-lg",
                      "focus:outline-none"
                    )}
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                    placeholder="Email Address"
                  />
                  <button
                    disabled={submitting}
                    type="submit"
                    className={classNames(
                      "bg-slate-700 p-3 mt-3 rounded-tr-lg rounded-br-lg font-semibold text-white",
                    )}
                  >
                    {
                      submitting ? 'Sending...' : <span>
                        Send <ArrowRightIcon className="align-top mt-0.5 h-5 inline-block" />
                      </span>
                    }
                  </button>
                </div>
                <div className={classNames(
                  "my-3 text-base p-3 rounded-lg bg-green-100 text-green-900",
                  {
                    "hidden": !sentVerifyEmail,
                  }
                )}>
                  <div className="font-semibold mb-1">
                    <StarIcon className="inline-block h-5 align-top mt-0 mr-1" /> Check your email.</div>
                    <div>
                      We just sent an email to <strong className="font-semibold">{email}</strong>.<br/>
                      Click on the link inside to sign in.
                    </div>
                </div>
              </>
              :
              null
            }
            <div>
              {
                focusedMethod === AuthMethod.Create ?
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
                (
                  focusedMethod === AuthMethod.Email &&
                  <div className="flex w-full">
                    <input
                      disabled={submitting}
                      className={classNames(
                        "py-3 pl-3 pr-5 mt-3 bg-slate-200",
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
                        "bg-slate-500 p-3 mt-3 rounded-tr-lg rounded-br-lg font-semibold text-white",
                      )}
                    >
                      {
                        submitting ? 'Submitting...' : 'Sign in'
                      }
                    </button>
                  </div>
                )
              }
              {
                focusedMethod === AuthMethod.Create ?
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
                    disabled={createDisabled}
                    type="submit"
                    className={classNames(
                      "p-3 mt-3 rounded-tr-lg rounded-br-lg font-semibold bg-brightGreen text-black",
                      "focus:outline-brightGreen2",
                      {
                        "bg-brightGreen text-black": !submitting && !createDisabled,
                        "bg-slate-300 text-slate-500": submitting || createDisabled
                      }
                    )}
                  >
                    Sign up
                  </button>
                </div>
                : null
              }
            </div>
            <div className={classNames(
              "mt-2 text-sm text-red-700",
              {
                "hidden": confirmPassword === password ||
                  focusedMethod !== AuthMethod.Create
              }
            )}>
              Passwords do not match.
            </div>
            {
              (submitting || authError) &&
              <div className={classNames(
                "mt-5 text-center px-3",
                {
                  "text-slate-400": !authError && submitting,
                  "text-red-700": !!authError && !submitting,
                }
              )}>
                {
                  (submitting || status === 'loading') &&
                  <LoadingBarbellSvg
                    size={25}
                    className="inline-block align-middle p-1 animate-spin"
                    color="#cbd5e1"
                  />
                }
                <span className="ml-1 align-middle inline-block">
                  {
                    status === 'loading' ?
                    'Loading...' :
                    (submitting && focusedMethod === AuthMethod.Create) ?
                    'Creating account...' :
                    submitting ?
                      (
                        focusedMethod === AuthMethod.MagicLink ?
                        'Sending email...' :
                        'Signing you in...'
                      ) :
                    'See error message above.'
                  }
                </span>
              </div>
            }
          </form>
          <button onClick={focusedMethod === AuthMethod.Create ?
            signInWithEmail : startCreateAccount}
            className={classNames(
              "text-base mt-3 p-3 w-full rounded-lg mb-2 text-black underline font-semibold",
              {
                "hidden": focusedMethod === AuthMethod.Create
              }
            )}>
            Don't have an account? Sign up
          </button>
        </div>
      </main>
    </Layout>
  )
}

export default Signin

