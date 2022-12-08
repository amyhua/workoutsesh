import { NextApiRequest, NextApiResponse } from 'next'
import { Exercise, PrismaClient } from '@prisma/client'
import { getSession } from 'next-auth/react'
import { prisma } from '../../lib/prismadb'

async function workoutsRoute(req: NextApiRequest, res: NextApiResponse<any>) {
  const session = await getSession({ req });
  if (!session || !session.user) {
    res.status(401).send({
      error: 'You must be signed in to access this content.'
    });
    return;
  }
  if (!session.user.email) {
    return res.json({
      error: 'No user email specified.'
    })
  }
  switch (req.method) {
    case 'GET':
      const workouts = await prisma.workout.findMany({
        where: {
          userEmail: session.user.email,
        },
        include: {
          exercises: true,
        }
      });
      res.json(workouts);
      break;
    case 'POST':
      const {
        name,
        description,
        exercises,
      } = JSON.parse(req.body || {});
      if (session.user.email) {
        const workout = await prisma.workout.create({
          data: {
            name,
            description,
            slug: name.toLowerCase().replace(/\s+/g, '-'),
            userEmail: session.user.email,
          }
        })
        const createdExercises = [] as Exercise[];
        try {
          exercises.forEach(async (exercise: Exercise, i: number) => {
            const exc = await prisma.exercise.create({
              data: {
                ...exercise,
                workoutId: workout.id,
                workoutOrder: i,
              }
            })
            createdExercises.push(exc);
          });
        } catch(err) {
          return res.status(500).json({
            error: `${exercises.length} exercises were meant to be created, but ${createdExercises.length} created.`
          });
        }
        return res.json({
          ...workout,
          exercises: createdExercises,
        });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      break;
  }
}

export default workoutsRoute
