import { Workout } from "@prisma/client";
import { getSession } from "next-auth/react";
import { prisma } from '../lib/prismadb'
import AuthenticatedPageWrapper from "../components/AuthenticatedPageWrapper";
import IndexDashboard from "../components/IndexDashboard";

export default function IndexPage({ user, workouts }: any) {
  if (typeof workouts === 'string') workouts = JSON.parse(workouts) as Workout[];
  return (
    <AuthenticatedPageWrapper>
      <IndexDashboard workouts={workouts} />
    </AuthenticatedPageWrapper>
  )
}

export async function getServerSideProps(context: any) {
  try {
    const session = await getSession(context);
    let workouts = [] as Workout[];
    if (session && session.user && session.user.email) {
      workouts = await prisma.workout.findMany({
        where: {
          userEmail: session.user.email,
        },
        include: {
          exercises: true,
        },
      })
    }
    return {
      props : {
        session,
        workouts: workouts ? JSON.stringify(workouts) : null,
        // params: context.params
      }
    }
  } catch(error) {
    return {
      props : {
        error: error ? JSON.stringify(error) : null,
      }
    }
  }  
}
