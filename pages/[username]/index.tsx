import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import Logo from '../../components/Logo'
import Image from 'next/image'
import classNames from 'classnames'
import { useEffect, useState } from 'react'

const workouts = [{
  name: 'Upper Body',
  description: 'Arms for 45 minutes.',
  slug: 'upper-body',
  exercises: [{
    imageUrl: 'https://personallevelfitness.com/wp-content/uploads/2018/08/Chest-Press-DB.jpg',
  }, {
    imageUrl: 'https://gethealthyu.com/wp-content/uploads/2014/08/Chest-Flies_Exercise.jpg',
  }, {
    imageUrl: 'https://www.wikihow.com/images/thumb/c/c0/Do-a-Reverse-Lunge-Step-8-Version-2.jpg/v4-460px-Do-a-Reverse-Lunge-Step-8-Version-2.jpg.webp',
  }, {
    imageUrl: 'https://i.pinimg.com/originals/56/e4/61/56e4612e4837f1d0bbd45402c4bc01d7.jpg',
  }, {
    imageUrl: 'https://personallevelfitness.com/wp-content/uploads/2018/08/Chest-Press-DB.jpg',
  }, {
    imageUrl: 'https://gethealthyu.com/wp-content/uploads/2014/08/Chest-Flies_Exercise.jpg',
  }, {
    imageUrl: 'https://www.wikihow.com/images/thumb/c/c0/Do-a-Reverse-Lunge-Step-8-Version-2.jpg/v4-460px-Do-a-Reverse-Lunge-Step-8-Version-2.jpg.webp',
  }, {
    imageUrl: 'https://i.pinimg.com/originals/56/e4/61/56e4612e4837f1d0bbd45402c4bc01d7.jpg',
  }]
}, {
  name: 'Lower Body',
  description: 'Legs, legs, legs. 45 min.',
  slug: 'lower-body',
  exercises: [{
    imageUrl: 'https://personallevelfitness.com/wp-content/uploads/2018/08/Chest-Press-DB.jpg',
  }, {
    imageUrl: 'https://gethealthyu.com/wp-content/uploads/2014/08/Chest-Flies_Exercise.jpg',
  }, {
    imageUrl: 'https://www.wikihow.com/images/thumb/c/c0/Do-a-Reverse-Lunge-Step-8-Version-2.jpg/v4-460px-Do-a-Reverse-Lunge-Step-8-Version-2.jpg.webp',
  }, {
    imageUrl: 'https://i.pinimg.com/originals/56/e4/61/56e4612e4837f1d0bbd45402c4bc01d7.jpg',
  }]
}, {
  name: 'Cardio #1',
  description: 'Cycling Prep. 45 min.',
  slug: 'cardio-1',
  exercises: [{
    imageUrl: 'https://personallevelfitness.com/wp-content/uploads/2018/08/Chest-Press-DB.jpg',
  }, {
    imageUrl: 'https://gethealthyu.com/wp-content/uploads/2014/08/Chest-Flies_Exercise.jpg',
  }, {
    imageUrl: 'https://www.wikihow.com/images/thumb/c/c0/Do-a-Reverse-Lunge-Step-8-Version-2.jpg/v4-460px-Do-a-Reverse-Lunge-Step-8-Version-2.jpg.webp',
  }, {
    imageUrl: 'https://i.pinimg.com/originals/56/e4/61/56e4612e4837f1d0bbd45402c4bc01d7.jpg',
  }]
}]

const WorkoutIconSvg = ({ size }: { size: number; }) => (
  <svg width={size} height={size} viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M63.3325 40.5824C61.9263 39.1778 60.02 38.3893 58.0329 38.3893C56.0452 38.3893 54.1389 39.1778 52.7327 40.5824L52.0658 41.2492L51.2327 40.4161C49.2661 38.5511 46.466 37.8531 43.8539 38.5774C41.2424 39.3012 39.2011 41.3408 38.4751 43.9524C37.7491 46.5633 38.4444 49.3641 40.3082 51.3323L51.1413 62.1653V62.1658C51.466 62.4889 51.9911 62.4889 52.3159 62.1658L63.3325 51.1827C64.7371 49.7764 65.526 47.8702 65.526 45.8825C65.526 43.8948 64.737 41.9885 63.3325 40.5822L63.3325 40.5824ZM62.1663 49.9991L51.7495 60.4159L41.4996 50.166C40.3334 49.0365 39.6688 47.4857 39.6559 45.8625C39.6431 44.2386 40.2821 42.6778 41.4299 41.53C42.5784 40.3815 44.1392 39.7425 45.763 39.7554C47.3863 39.7688 48.9366 40.4328 50.066 41.5991L51.4828 43.0159C51.8081 43.339 52.3327 43.339 52.658 43.0159L53.9164 41.7576C55.4024 40.3569 57.5129 39.8357 59.4805 40.3826C61.448 40.93 62.986 42.4669 63.5351 44.4333C64.0848 46.4004 63.5653 48.5114 62.1663 49.9991L62.1663 49.9991Z" fill="black"/>
    <path d="M37.5 0C27.5543 0 18.0159 3.95081 10.9832 10.9832C3.95081 18.0159 0 27.5544 0 37.5C0 47.4456 3.95081 56.9841 10.9832 64.0168C18.0159 71.0492 27.5544 75 37.5 75C47.4456 75 56.9841 71.0492 64.0168 64.0168C71.0492 56.9841 75 47.4456 75 37.5C75 30.9175 73.2673 24.451 69.9761 18.7502C66.6848 13.0494 61.951 8.31562 56.2502 5.02437C50.5494 1.73312 44.0829 0.000428604 37.5004 0.000428604L37.5 0ZM37.5 1.66684C44.6691 1.67019 51.6723 3.82424 57.6041 7.85034C63.5358 11.876 68.1235 17.5891 70.7746 24.2502L53.2334 24.542L45.3585 10.0007C45.2067 9.72229 44.9093 9.55376 44.5917 9.56715C44.2748 9.58222 43.9935 9.7764 43.8669 10.0671L28.267 45.2667L14.7588 23.6413C14.6059 23.3969 14.3386 23.249 14.0506 23.2495H4.63389C7.41172 16.84 12.0032 11.382 17.8425 7.54829C23.6817 3.71347 30.5142 1.6695 37.5008 1.66721L37.5 1.66684ZM37.5 73.3332V73.3326C29.7389 73.3315 22.1873 70.8109 15.9831 66.1491C9.77775 61.4873 5.25394 54.9372 3.09154 47.4836C0.929132 40.03 1.24499 32.0752 3.9922 24.8167C4.10994 24.8809 4.24164 24.9149 4.37556 24.9172H13.5836L27.6839 47.4998C27.8362 47.7442 28.1041 47.8921 28.392 47.8915H28.4506H28.45C28.7564 47.8692 29.0254 47.68 29.1504 47.3999L44.7002 12.2674L52.0087 25.7588C52.1566 26.0295 52.4417 26.1958 52.7503 26.1919L71.3829 25.8833V25.8838C73.8545 33.098 73.9572 40.9137 71.6759 48.1893C69.3946 55.4649 64.849 61.8236 58.7018 66.3362C52.554 70.8485 45.1261 73.2793 37.5006 73.2742L37.5 73.3332Z" fill="black"/>
    <path d="M38.7328 65.1907C30.9595 65.1823 23.5073 62.0909 18.0102 56.5954C12.5131 51.0993 9.41928 43.6479 9.40871 35.8742C9.40871 35.4138 9.03538 35.041 8.57502 35.041C8.11519 35.041 7.74188 35.4138 7.74188 35.8742C7.75304 44.0895 11.022 51.9654 16.8316 57.7739C22.6419 63.5819 30.5179 66.8485 38.7328 66.8575C39.1932 66.8575 39.5659 66.4848 39.5659 66.0244C39.5659 65.564 39.1932 65.1907 38.7328 65.1907L38.7328 65.1907Z" fill="black"/>
  </svg>
)

type Stat = { value: number | string; label: string; }

const stats = [{
  value: 53,
  label: 'total workouts'
}, {
  value: 7,
  label: 'this month'
}, {
  value: 2.5,
  label: 'weekly average'
}]

const prevWorkout = {
  name: 'Upper Body Madness',
  durationMin: 58.255664,
  exercises: [{
    imageUrl: 'https://personallevelfitness.com/wp-content/uploads/2018/08/Chest-Press-DB.jpg',
  }, {
    imageUrl: 'https://gethealthyu.com/wp-content/uploads/2014/08/Chest-Flies_Exercise.jpg',
  }, {
    imageUrl: 'https://www.wikihow.com/images/thumb/c/c0/Do-a-Reverse-Lunge-Step-8-Version-2.jpg/v4-460px-Do-a-Reverse-Lunge-Step-8-Version-2.jpg.webp',
  }, {
    imageUrl: 'https://i.pinimg.com/originals/56/e4/61/56e4612e4837f1d0bbd45402c4bc01d7.jpg',
  }]
}

const ImageTileRow = ({ className, imageUrls=[], size }: { className?: string; imageUrls: string[]; size: number; }) => (
  <div className="w-full overflow-x-auto">
    <ul className="flex my-2 whitespace-nowrap">
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
              alt="Previous Workout Exercise Image"
              src={imageUrl}
              placeholder={require('../../components/routine-placeholder.png')}
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

export default function IndexPage() {
  const router = useRouter()
  const { username } = router.query
  const [winReady, setWinReady] = useState(false)

  useEffect(() => {
    async function loadUserData() {
      try {
        const resp = await fetch(`/api/user?username=${username}`);
        const data = await resp.json() as any
        if (resp.status !== 200) {
          throw Error(data.message);
        }
      } catch(err) {
        router.push(`/signin?error=${err}`)
      }
    }
    setWinReady(true)
    loadUserData()
  }, [router, username])

  const onStartWorkout =
    (workout: any) =>
      () => {
        if (winReady) router.push(
          `/${username}/workout/${workout.slug}`
        )
      }

  return (
    <Layout title="Workouts" background="#F4F3EC">
      <main className="bg-white min-h-full max-w-4xl mx-auto px-3">
        <nav className="fixed top-0 left-0 right-0 z-10 bg-white h-[90px]">
          <div className="max-w-4xl mx-auto h-[90px]">
            <Logo size={180} className="my-0" />
          </div>
        </nav>
        <div className="mt-[90px]">
          <section className="p-4 border-4 rounded-lg border-black mb-10">
            <header>
              <h2 className="text-3xl font-bold mt-0 mb-6">
                Summary
              </h2>
            </header>
            <div className="sm:flex mt-4 pt-0 mb-0">
              {
                stats.map((stat: Stat, i: number) => (
                  <article key={i} className="flex-1 pr-5 last:pr-0">
                    <div className="text-3xl font-bold text-black inline-block">
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
          <section className="mb-8 px-4 pt-6 pb-8 bg-purple0 p-4 border-4 rounded-lg border-black">
            <header>
              <h2 className="font-bold mb-3 text-3xl">
                Last workout
              </h2>
            </header>
            <main className="my-1">
              <ImageTileRow
                size={75}
                imageUrls={prevWorkout.exercises.map((e: any) => e.imageUrl)}
                className="border-2 border-black rounded-sm"
              />
              <div className="mt-1">
                <h3 className="text-2xl font-bold my-2">{prevWorkout.name}</h3>
                <div className="font-semibold">
                  2 days ago. Completed in {prevWorkout.durationMin.toFixed(1)} minutes. <Link
                  className="block underline" href="#">
                    Summary
                  </Link>
                </div>
              </div>
            </main>
          </section>
        </div>
        <section>
          {
            workouts && workouts.length &&
            <header className="px-5">
              <h2 className="italic uppercase tracking-widest text-3xl mb-6 font-bold">
                Start
              </h2>
            </header>

          }
          <main>
            <ul>
              {
                (workouts || []).map((workout: any, i) => (
                  <li
                    onClick={onStartWorkout && onStartWorkout(workout)}
                    key={i}
                    className="cursor-pointer border-b">
                    <article
                      className="group hover:bg-green-100 py-5 px-5">
                      <h3 className="font-bold text-2xl mb-2">
                        {workout.name}
                      </h3>
                      <ImageTileRow
                        size={75}
                        imageUrls={workout.exercises.map((exc: any) => exc.imageUrl)}
                        className="border-2 border-black rounded-sm"
                      />
                      <div className="flex mt-3">
                        <p className="flex-1 font-semibold mt-2 text-lg">
                          {workout.description}
                        </p>
                        <button className="ml-2 text-xl mt-0.5 py-2 px-3 rounded-sm font-bold bg-brightGreen group-hover:bg-brightGreen1 hover:bg-brightGreen1">
                          Start
                        </button>
                      </div>
                    </article>    
                  </li>    
                ))
              }
            </ul>
            <div className="mt-8 px-5 pb-14">
              <Link href={`/${username}/workout/create`} className="cursor-pointer text-lg font-bold my-2 p-3 rounded-md border-2 border-black hover:bg-brightGreen text-black w-full">
                Create a Workout
              </Link>
            </div>
          </main>
        </section>
      </main>
    </Layout>
  )
}
