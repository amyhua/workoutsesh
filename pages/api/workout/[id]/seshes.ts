import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../../lib/prismadb'

async function workoutSeshesRoute(req: NextApiRequest, res: NextApiResponse<any>) {
  const session = await getSession({ req });
  if (!session || !session.user || !session.user.email) {
    res.status(401).send({
      error: 'You must be signed in to access this content.'
    });
    return;
  }
  switch (req.method) {
    case 'GET':
      const seshes = await prisma.sesh.findMany({
        where: {
          AND: [{
            workoutId: Number(req.query.id),
          }, {
            userEmail: session.user.email,
          }, (
            String(req.query.finished).toLowerCase() === 'false' ? {
              finishedAt: undefined
            } : String(req.query.finished).toLowerCase() === 'true' ? {
              NOT: {
                finishedAt: undefined
              }
            } : {}
          )]
        }
      });
      res.json(seshes);
      break;
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      break;
  }
}

export default workoutSeshesRoute;
