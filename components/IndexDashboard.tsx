/* eslint-disable react-hooks/exhaustive-deps */
import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import Logo from '../components/Logo'
import Image from 'next/image'
import classNames from 'classnames'
import { useContext, useEffect, useState } from 'react'
import AvatarMenu from './AvatarMenu'
import MoreMenu from './MoreMenu'
import { Exercise, Workout } from '@prisma/client'
import { CheckCircleIcon, ClockIcon, ExclamationCircleIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import AppContext from '../contexts/app-context'
import moment from 'moment'
import DurationText from './DurationText'
import { getShownExercises } from '../lib/sesh-utils'

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

export default function IndexDashboard({
  user,
  workouts,
  totalSeshes,
  totalSeshesThisWeek,
  totalSeshesThisMonth,
}: any) {
  const stats = [{
    value: totalSeshes || 0,
    label: 'completed'
  }, {
    value: totalSeshesThisWeek || 0,
    label: 'this week'
  }, {
    value: totalSeshesThisMonth || 0,
    label: 'this month'
  }];
  const router = useRouter()
  const { indexError, indexSuccess } = useContext(AppContext)
  const [winReady, setWinReady] = useState(false)
  useEffect(() => {
    setWinReady(true);
  }, []);

  const onStartWorkout =
    (workout: any) =>
      () => {
        if (winReady) router.push(
          `/workout/${workout.id}`
        )
      }

  if (!user) return null;
  return (
    <Layout title="Workouts" background="#000000">
      <main className="bg-transparent text-white min-h-full bg-gradient-to-b from-active1 to-active2 px-5">
        <nav className="text-white bg-transparent h-[90px]">
          <div className="flex relative max-w-4xl mx-auto h-[90px] align-middle py-4">
            <Link href="/" className="inline-block align-middle py-2.5">
              <Logo size={180} className="my-0 inline-block" />
            </Link>
            <div className="flex-1 text-right">
              <AvatarMenu user={user} />
            </div>
          </div>
        </nav>
        <div className={classNames(
          "p-3 bg-white rounded-lg text-sm max-h-[100px] overflow-y-auto",
          {
            "hidden": !indexError && !indexSuccess,
            "text-red-700": !!indexError,
            "text-green-600": !indexError && !!indexSuccess,
          }
        )}>
          <h2 className={classNames(
            "font-semibold text-sm",
            {
              "mb-1": !!indexError
            }
          )}>
            {
              indexError ?
              <ExclamationCircleIcon className="mt-0.25 inline-block mr-1 h-5 align-top" />
              :
              <CheckCircleIcon className="mt-0.25 inline-block mr-1 h-5 align-top" />
            } {
              indexError ?
              'Something went wrong.' :
              indexSuccess
            }
          </h2>
          {
            indexError &&
            <p className="ml-7">
              {indexError}
            </p>
          }
        </div>
        <div className="mt-10 max-w-sm mx-auto">
          <section className="pt-0">
            <div>
              <article className="sm:pr-5 last:pr-0 mb-8">
                <div className="text-3xl font-semibold text-white inline-block">
                  {totalSeshes.toLocaleString()}
                </div>
                <div className="text-lg text-white/60 mt-2">
                  total completed workouts
                </div>
              </article>
              <div className="flex">
                <article className="flex-1 sm:pr-5 last:pr-0">
                  <div className="text-3xl font-semibold text-white inline-block">
                    {totalSeshesThisWeek.toLocaleString()}
                  </div>
                  <div className="text-lg text-white/60 mt-2">
                    this week
                  </div>
                </article>
                <article className="flex-1 sm:pr-5 last:pr-0">
                  <div className="text-3xl font-semibold text-white inline-block">
                    {totalSeshesThisMonth.toLocaleString()}
                  </div>
                  <div className="text-lg text-white/60 mt-2">
                    this month
                  </div>
                </article>
              </div>
            </div>
          </section>
        </div>
        <section className="max-w-3xl mx-auto">
          <header className="mt-16 sm:mt-10 flex">
            <div className="flex-1 -mt-3 text-right">
              <Link href={`/workout/create`} className="bg-white inline-block text-center text-lg cursor-pointer font-bold ml-2 px-3 py-2 rounded-md text-black">
                + New Workout
              </Link>
            </div>
          </header>
          <main>
            <ul className="mx-auto pb-14">
              {
                workouts.length ?
                workouts.map((workout: any, i: number) => (
                  <li
                    key={i}
                    className="bg-white text-black shadow-xl rounded-lg my-5">
                    <article
                      className="group cursor-pointer px-3 pt-5 sm:pb-8 pb-3"
                      onClick={onStartWorkout && onStartWorkout(workout)}>
                      <PlayCircleIcon className="inline-block h-14 align-middle -ml-1 group-hover:text-green-500" />
                      <h3 className="flex font-bold text-2xl">
                        <div className="mt-2 flex-1 ml-2 mb-2">
                          {workout.name}
                        </div>
                      </h3>
                      <div className="ml-2 mt-2">
                        <div className="mb-3">
                          {
                            workout.seshes.length ?
                            <>
                              <strong className="font-bold">{workout.seshes.length}</strong> seshes total
                            </> :
                            <span className="text-green-600 font-semibold">New!</span>
                          }
                          {
                            workout.seshes.length ?
                            <div className="text-sm text-black mt-1">
                              <div className="font-normal">
                                <div>
                                  {
                                    workout.seshes[workout.seshes.length - 1].finishedAt ?
                                    'Completed' : 'Started'
                                  } {(
                                    workout.seshes[workout.seshes.length - 1].finishedAt ?
                                    moment(workout.seshes[workout.seshes.length - 1].finishedAt) :
                                    moment(workout.seshes[workout.seshes.length - 1].createdAt)
                                  ).fromNow()}. Duration: <DurationText durationM={moment.duration(workout.seshes[workout.seshes.length - 1].timeCompletedS, 'seconds')} />
                                </div>
                              </div>
                            </div>
                            : null
                          }
                          {/* <div className="text-sm text-gray-400 mt-0.5">
                            {workout.seshes.length ? 'Created ' + moment(workout.seshes[0].createdAt).fromNow() : ''}
                          </div> */}
                        </div>
                        <div className="py-0">
                          <ImageTileRow
                            size={75}
                            imageUrls={getShownExercises(workout.exercises)
                              .sort(
                                (a: any, b: any) => a.workoutOrder - b.workoutOrder
                              )
                              .filter((exc: any) => !!exc.imageUrl)
                              .map((exc: any) => exc.imageUrl)
                            }
                            className="border rounded-sm"
                          />
                        </div>
                        <div className="flex sm:flex-row flex-col ml-1">
                          <div className="ml-0.25 flex-1 flex sm:flex-row-reverse">
                            <div className="flex-1">
                              <p className="font-semibold text-base my-2">
                                {workout.description}
                              </p>
                              <p className="text-sm mt-3 text-gray-500">
                                {getShownExercises(workout.exercises).map((exc: Exercise, i: number) => (
                                  <span key={i} className="inline-block mr-2 mb-2 text-xs py-1 px-2 rounded-xl bg-gray-100 text-black border">
                                    {exc.name}
                                  </span>
                                ))}
                              </p>
                            </div>
                          </div>
                          <div onClick={e => e.stopPropagation()} className="text-left text-gray-500 hover:text-black cursor-pointer">
                            <MoreMenu workoutId={workout.id} />
                          </div>
                        </div>
                      </div>
                    </article>    
                  </li>    
                ))
                :
                <div className="p-4 rounded-lg my-3 bg-white/10">
                  <h1 className="font-bold text-lg mb-2">
                    Create a workout!
                  </h1>
                  Click on the &quot;+ New Workout&quot; button to get started.
                </div>
              }
            </ul>
          </main>
        </section>
      </main>
    </Layout>
  )
}
