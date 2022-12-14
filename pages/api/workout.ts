import { Exercise } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next'
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
      if (!req.query.slug) {
        return res.json({
          error: 'Missing workout slug as query param [slug]'
        })
      }
      if (typeof req.query.slug === 'number' &&
      typeof session.user.email === 'string') {
        const workout = await prisma.workout.findFirstOrThrow({
          where: {
            userEmail: session.user.email,
            slug: req.query.slug,
          },
          include: {
            exercises: true,
          }
        });
        return res.json(workout);
      }
      break;
    case 'PUT':
      console.log('PUT!!!!', req.query, req.query.data)
      if (!req.query.data || !req.query.data.id) {
        throw new Error('Missing workout ID as query param [id]')
      }
      if (req.query.id &&
        typeof req.query.data === 'string' &&
        typeof session.user.email === 'string') {
          const data = JSON.parse(req.query.data || '{}');
          console.log('data', data)
          const exercises = data.exercises || [];
          exercises.forEach(async (exc: Exercise) => {
            try {
              const updatedExc = await prisma.exercise.upsert({
                where: {
                  id: exc.id ? Number(exc.id) : undefined,
                },
                update: {
                  ...exc,
                },
                create: {
                  ...exc,
                }
              });
              console.log('Exercise created:', updatedExc)
            } catch(err) {
              res.json(err);
              return;
            }
          });
        const workout = await prisma.workout.update({
          where: {
            id: Number(req.query.id),
          },
          data: {
            ...(JSON.parse(req.query.data))
          },
        });
        return res.json(workout);
      }
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
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      break;
  }
}

export default workoutsRoute
