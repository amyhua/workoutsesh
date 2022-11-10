import Image from "next/image"
import Layout from "../components/Layout"

const SigninPage = () => {
  return (
    <Layout title="Sign in | Workout Sesh" background="white">
      <main className="relative max-w-4xl mx-auto min-h-[100vh] p-5">
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
            Sign in with Apple
          </button>
          <button className="text-base mt-3 p-3 w-full text-white bg-blue-500 rounded-lg">
            Sign Up
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
