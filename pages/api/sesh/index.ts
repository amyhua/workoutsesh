import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../lib/prismadb'

async function seshRoute(req: NextApiRequest, res: NextApiResponse<any>) {
  const session = await getSession({ req });
  if (!session || !session.user || !session.user.email) {
    res.status(401).send({
      error: 'You must be signed in to access this content.'
    });
    return;
  }
  const body = JSON.parse(req.body);
  switch (req.method) {
    case 'POST':
      const createdSesh = await prisma.sesh.create({
        data: {
          user: {
            connect: {
              email: session.user.email
            }
          },
          workout: {
            connect: {
              id: Number(body.workoutId)
            }
          }
        }
      })
      res.json(createdSesh);
      break;
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      break;
  }
}

export default seshRoute;
