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
  switch (req.method) {
    case 'GET':
      if (!req.query.slug) {
        return res.json({
          error: 'Missing workout slug as query param [slug]'
        })
      }
      if (typeof req.query.slug === 'number' &&
      typeof session.user.email === 'string') {
        try {
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
        } catch(err) {
          console.error('Error', err);
          return res.status(404).json(err);
        }
      }
      break;
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      break;
  }
}

export default workoutRoute;
