import { Workout } from "@prisma/client";
import { getSession } from "next-auth/react";
import { prisma } from '../lib/prismadb'
import AuthenticatedPageWrapper from "../components/AuthenticatedPageWrapper";
import IndexDashboard from "../components/IndexDashboard";
import moment from "moment";

export default function IndexPage({
  workouts,
  totalSeshes,
  totalSeshesThisWeek,
  totalSeshesThisMonth
}: any) {
  if (typeof workouts === 'string') workouts = JSON.parse(workouts) as Workout[];
  console.log('workouts', workouts)
  return (
    <AuthenticatedPageWrapper>
      <IndexDashboard
        workouts={workouts}
        totalSeshes={totalSeshes || 0}
        totalSeshesThisMonth={totalSeshesThisMonth || 0}
        totalSeshesThisWeek={totalSeshesThisWeek || 0}
      />
    </AuthenticatedPageWrapper>
)
}

export async function getServerSideProps(context: any) {
  try {
    const session = await getSession(context);
    let workouts = [] as Workout[],
      aggregTotalSeshes: any,
      aggregTotalSeshesThisMonth: any,
      aggregTotalSeshesThisWeek: any;
    if (session && session.user && session.user.email) {
      workouts = await prisma.workout.findMany({
        where: {
          userEmail: session.user.email,
        },
        include: {
          exercises: true,
          seshes: {
            orderBy: {
              createdAt: 'asc',
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      });
      aggregTotalSeshes = await prisma.sesh.aggregate({
        where: {
          userEmail: session.user.email,
          finishedAt: {
            not: null,
          }
        },
        _count: true,
      });
      const startOfMonth = moment().startOf('month').toDate();
      const startOfWeek = moment().startOf('week').toDate();

      aggregTotalSeshesThisMonth = await prisma.sesh.aggregate({
        where: {
          userEmail: session.user.email,
          finishedAt: {
            gte: startOfMonth,
          }
        },
        _count: true,
      });
      aggregTotalSeshesThisWeek = await prisma.sesh.aggregate({
        where: {
          userEmail: session.user.email,
          finishedAt: {
            gte: startOfWeek,
          }
        },
        _count: true,
      })
    }
    return {
      props : {
        session,
        workouts: workouts ? JSON.stringify(workouts) : null,
        totalSeshes: aggregTotalSeshes._count,
        totalSeshesThisMonth: aggregTotalSeshesThisMonth._count,
        totalSeshesThisWeek: aggregTotalSeshesThisWeek._count,
      }
    }
  } catch(error) {
    console.error('Error loading Index page', error);
    return {
      props : {
        workouts: [],
        error: error ? JSON.stringify(error) : null,
      }
    }
  }  
}
