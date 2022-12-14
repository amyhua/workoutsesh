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
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      break;
  }
}

export default workoutsRoute
