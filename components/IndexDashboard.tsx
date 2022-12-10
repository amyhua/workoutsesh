/* eslint-disable react-hooks/exhaustive-deps */
import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import Logo from '../components/Logo'
import Image from 'next/image'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { getSession } from 'next-auth/react'
import AvatarMenu from './AvatarMenu'
import MoreMenu from './MoreMenu'
import { Exercise } from '@prisma/client'
import { PlayCircleIcon } from '@heroicons/react/20/solid'

type Stat = { value: number | string; label: string; }

const ImageTileRow = ({ className, imageUrls=[], size }: { className?: string; imageUrls: string[]; size: number; }) => (
  <div className="w-full my-2 overflow-x-auto">
    <ul className="flex whitespace-nowrap">
      {
        imageUrls.map((imageUrl: string, i: number) => (
          <li key={i} className={classNames(
            `mr-3 last:mr-0 min-h-[${size}px] min-w-[${size}px] bg-[#00000024] text-center`,
            className,
          )} style={{
            minWidth: size,
            minHeight: size,
          }}>
            <Image
              alt="Exercise"
              src={imageUrl}
              placeholder={require('./routine-placeholder.png')}
              width={size}
              height={size}
              className={classNames(
                `w-[${size}px] h-[${size}px] inline-block`
              )}
            />
          </li>
        ))
      }
    </ul>
  </div>
)

// const LastSeshPreview = ({ sesh }: { sesh: any }) => (
//   <section className="mb-8 px-4 pt-6 pb-8 bg-purple0 p-4 border-4 rounded-lg border-black">
//     <header>
//       <h2 className="font-bold mb-3 text-3xl">
//         Last workout
//       </h2>
//     </header>
//     <main className="my-1">
//       <ImageTileRow
//         size={75}
//         imageUrls={prevWorkout.exercises.map((e: any) => e.imageUrl)}
//         className="border-2 border-black rounded-sm"
//       />
//       <div className="mt-1">
//         <h3 className="text-2xl font-bold my-2">{prevWorkout.name}</h3>
//         <div className="font-semibold">
//           SAMPLE 2 days ago. Completed in {prevWorkout.durationMin.toFixed(1)} minutes. <Link
//           className="block underline" href="#">
//             Summary
//           </Link>
//         </div>
//       </div>
//     </main>
//   </section>
// )

export default function IndexDashboard({
  user
}: any) {
  const stats = [{
    value: user.seshesTotal || 0,
    label: 'total workouts'
  }, {
    value: user.seshesThisMonth || 0,
    label: 'this month'
  }]
  const router = useRouter()
  const [winReady, setWinReady] = useState(false)
  const [workouts, setWorkouts] = useState([])
  const loadWorkouts = async () => {
    const resp = await fetch(`/api/workouts`);
    const data = await resp.json();
    setWorkouts(data);
  };
  const lastSesh = (user.seshes || [])[(user.seshes || []).length - 1];
  useEffect(() => {
    loadWorkouts();
    setWinReady(true);
  }, []);

  const onStartWorkout =
    (workout: any) =>
      () => {
        if (winReady) router.push(
          `/workout/${workout.slug}`
        )
      }

  if (!user) return null;
  return (
    <Layout title="Workouts" background="#000000">
      <main className="bg-transparent text-white min-h-full bg-gradient-to-b from-active1 to-active2 px-5">
        <nav className="text-white bg-transparent h-[90px]">
          <div className="flex relative max-w-4xl mx-auto h-[90px] align-middle py-4">
            <Link href="/" className="inline-block align-middle text-center py-2.5">
              <Logo size={180} className="my-0 inline-block" />
            </Link>
            <div className="flex-1 text-right">
              <AvatarMenu user={user} />
            </div>
          </div>
        </nav>
        <div className="mt-10 max-w-sm mx-auto">
          <section className="pt-0 mb-2">
            <div className="sm:flex">
              {
                stats.map((stat: Stat, i: number) => (
                  <article key={i} className="flex-1 text-center sm:pr-5 last:pr-0">
                    <div className="text-3xl font-bold text-white inline-block">
                      {stat.value.toLocaleString()}
                    </div>
                    <div className="text-xl font-bold mt-2 mb-6">
                      {stat.label}
                    </div>
                  </article>
                ))
              }
            </div>
          </section>
          {/* {
            lastSesh &&
            <LastSeshPreview sesh={lastSesh} />
          } */}
        </div>
        <section className="max-w-3xl mx-auto">
          {
            workouts && workouts.length ?
            <header className="mt-10 flex">
              <div className="flex-1 -mt-3 text-right">
                <Link href={`/workout/create`} className="bg-white inline-block text-center text-lg cursor-pointer font-bold ml-2 px-3 py-2 rounded-md text-black">
                  + New Workout
                </Link>
              </div>
            </header>
            : null
          }
          <main>
            <ul className="mx-auto pb-14">
              {
                workouts.length ?
                workouts.map((workout: any, i) => (
                  <li
                    key={i}
                    className="bg-white text-black shadow-xl rounded-lg my-5">
                    <article
                      className="group cursor-pointer px-6 pt-5 sm:pb-8 pb-3"
                      onClick={onStartWorkout && onStartWorkout(workout)}>
                      <div className="py-0">
                        <ImageTileRow
                          size={75}
                          imageUrls={workout.exercises
                            .filter((exc: any) => !!exc.imageUrl)
                            .map((exc: any) => exc.imageUrl)
                          }
                          className="border rounded-sm"
                        />
                      </div>
                      <h3 className="font-bold text-2xl mt-4">
                        <PlayCircleIcon className="inline-block h-9 align-middle -ml-0.5 -mt-1" /> {workout.name}
                      </h3>
                      <div className="flex sm:flex-row flex-col">
                        <div className="ml-0.25 flex-1 flex sm:flex-row-reverse">
                          <div className="flex-1">
                            <p className="font-semibold text-lg mt-1">
                              {workout.description}
                            </p>
                            <p className="text-sm mt-1 text-gray-500">
                              {workout.exercises.map((exc: Exercise) => exc.name).join(' · ')}
                            </p>
                          </div>
                        </div>
                        <div onClick={e => e.stopPropagation()} className="text-left text-gray-500 hover:text-black cursor-pointer">
                          <MoreMenu workoutId={workout.id} />
                        </div>
                      </div>
                    </article>    
                  </li>    
                ))
                :
                <div className="p-4 rounded-lg my-3 border-2 border-black">
                  <h1 className="font-bold text-lg mb-2">
                    Create a workout!
                  </h1>
                  Click on the "+ New Workout" button to get started.
                </div>
              }
            </ul>
          </main>
        </section>
      </main>
    </Layout>
  )
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  // const workouts = await prisma.workout.findMany({
  //   where: {
  //     userEmail: session && session.user &&
  //       session.user.email,
  //   }
  // });
  try {
    return {
      props : {
        session,
        // workouts,
        params: context.params
      }
    }
  } catch(error) {
    console.log('error: ', error)
    return {
      props : {
        error
      }
    }
  }  
}
