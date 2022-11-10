import Image from "next/image"
import Layout from "../components/Layout"

const AppleIconSvg = () => (
  <svg className="inline-block align-top mr-1 mt-0.25" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5977 10.4629C14.5898 9.13086 15.1934 8.12695 16.4121 7.38672C15.7305 6.41016 14.6992 5.87305 13.3398 5.76953C12.0527 5.66797 10.6445 6.51953 10.1289 6.51953C9.58398 6.51953 8.33789 5.80469 7.35742 5.80469C5.33398 5.83594 3.18359 7.41797 3.18359 10.6367C3.18359 11.5879 3.35742 12.5703 3.70508 13.582C4.16992 14.9141 5.8457 18.1777 7.59375 18.125C8.50781 18.1035 9.1543 17.4766 10.3437 17.4766C11.498 17.4766 12.0957 18.125 13.1152 18.125C14.8789 18.0996 16.3945 15.1328 16.8359 13.7969C14.4707 12.6816 14.5977 10.5313 14.5977 10.4629V10.4629ZM12.5449 4.50586C13.5352 3.33008 13.4453 2.25977 13.416 1.875C12.541 1.92578 11.5293 2.4707 10.9531 3.14063C10.3184 3.85938 9.94531 4.74805 10.0254 5.75C10.9707 5.82227 11.834 5.33594 12.5449 4.50586V4.50586Z" fill="white"/>
  </svg>
)

const SigninPage = () => {
  return (
    <Layout title="Sign in | Workout Sesh" background="white">
      <main className="relative max-w-lg mx-auto min-h-[100vh] p-5">
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
              Track your sessions with ease
            </li>
          </ul>
        </header>
        <div className="absolute bottom-0 left-0 right-0 mx-10 py-10">
          <button className="text-base p-3 w-full bg-black text-white rounded-lg">
            <AppleIconSvg /> Sign in with Apple
          </button>
          <button className="text-base mt-3 p-3 w-full text-white bg-blue-500 rounded-lg">
            Sign Up with Email
          </button>
          <button className="text-base mt-3 p-3 w-full rounded-lg text-slate-500">
            Log In
          </button>
        </div>
      </main>
    </Layout>
  )
}
export default SigninPage
