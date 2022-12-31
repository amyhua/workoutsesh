import { Exercise } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../lib/prismadb'

async function workoutRoute(req: NextApiRequest, res: NextApiResponse<any>) {
  const session = await getSession({ req });
  if (!session || !session.user) {
    res.status(401).send({
      error: 'You must be signed in to access this content.'
    });
    return;
  }
  const { id } = req.query;
  switch (req.method) {
    case 'GET':
      if (!id) {
        return res.json({
          error: 'Missing workout ID as query param [id]'
        })
      }
      if (id !== undefined) {
        try {
          const workout = await prisma.workout.findUniqueOrThrow({
            where: {
              id: Number(id),
            },
            include: {
              exercises: true,
              seshes: true,
            }
          });
          return res.json(workout);
        } catch(err) {
          console.error('Error', err);
          return res.status(404).json(err);
        }
      }
      break;
    case 'PUT':
      req.body = req.body ? JSON.parse(req.body) : {}
      if (!req.body ||  !req.body.id) {
        throw new Error('Missing workout ID as body field [id]')
      }
      if (typeof session.user.email !== 'string') {
        throw new Error('Missing logged in user')
      }
      const workoutExercises = req.body.exercises || [];
      workoutExercises.forEach(async (exc: Exercise) => {
        await prisma.exercise.upsert({
          where: {
            id: exc.id ? Number(exc.id) : 0,
          },
          update: {
            ...exc,
            workout: undefined,
            workoutId: Number(req.body.id),
          },
          create: {
            ...exc,
            workout: undefined,
            workoutId: Number(req.body.id),
          }
        });
      });
      const workout = await prisma.workout.update({
        where: {
          id: Number(req.body.id),
        },
        data: {
          ...req.body,
          exercises: undefined,
        },
      });
      res.json(workout);
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
          exercises
            .forEach(async (exercise: Exercise, i: number) => {
            const exc = await prisma.exercise.create({
              data: {
                ...exercise,
                workoutId: workout.id
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
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      break;
  }
}

export default workoutRoute;
