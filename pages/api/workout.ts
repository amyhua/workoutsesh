import { NextApiRequest, NextApiResponse } from 'next'
import { Exercise, PrismaClient } from '@prisma/client'
import { getSession } from 'next-auth/react'
import prisma from '../../lib/prismadb'

async function workoutsRoute(req: NextApiRequest, res: NextApiResponse<any>) {
  const session = await getSession({ req });
  if (!session || !session.user) {
    res.send({
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
      if (!req.query.id) {
        return res.json({
          error: 'Missing workout ID as query param [id]'
        })
      }
      if (typeof req.query.id === 'number') {
        const workout = await prisma.workout.findUnique({
          where: {
            id: req.query.id,
          },
          include: {
            exercises: true,
          }
        });
        return res.json(workout);
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      break;
  }
}

export default workoutsRoute
