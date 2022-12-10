import { useRouter } from "next/router";
import { getSession } from 'next-auth/react'
import { prisma } from '../../lib/prismadb'
import { useEffect } from "react";
import Layout from "../../components/Layout";
import Logo from "../../components/Logo";
import WorkoutForm, { FormMode } from "../../components/WorkoutForm";

function EditWorkout() {
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    fetch(`/api/workout?id=${id}`)
  }, [])

  return (
    <Layout title="Edit Workout | WorkoutSesh">
      <nav className="fixed top-0 left-0 right-0 z-10 bg-white h-[90px]">
        <div className="max-w-4xl mx-auto h-[90px]">
          <Logo size={180} className="my-0" />
        </div>
      </nav>
      <WorkoutForm
        mode={FormMode.Edit}

      />
    </Layout>
  )
}

export default EditWorkout

export async function getServerSideProps(context: any) {
  try {
    const session = await getSession(context);
    let workout;
    if (session && session.user) {
      const { email } = session.user || {};
      workout = await prisma.workout.findFirstOrThrow({
        where: {
          AND: {
            userEmail: email || '',
            slug: context.query.workoutSlug,
          }
        },
        include: {
          exercises: true,
        }
      });
    }
    return {
      props : {
        session,
        workout: JSON.stringify(workout || null),
        params: context.params
      }
    }
  } catch(error) {
    return {
      props : {
        error
      }
    }
  }
}
