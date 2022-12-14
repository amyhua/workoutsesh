import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../../lib/prismadb'

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
    case 'DELETE':
      if (!id) {
        return res.json({
          error: 'Missing workout ID as query param [id]'
        })
      }
      if (id !== undefined) {
        try {
          const workout = await prisma.workout.delete({
            where: {
              id: Number(id),
            },
          });
          return res.json({
            success: true
          });
        } catch(err) {
          console.error('Error', err);
          return res.status(404).json(err);
        }
      }
      break;
    default:
      res.setHeader('Allow', ['DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      break;
  }
}

export default workoutRoute;
