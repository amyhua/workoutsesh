import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../lib/prismadb'

async function intervalRoute(req: NextApiRequest, res: NextApiResponse<any>) {
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
      const createdSeshInterval = await prisma.seshInterval.create({
        data: {
          durationS: Number(body.durationS),
          setNo: Number(body.setNo),
          note: body.note,
          active: body.active,
          exercise: {
            connect: {
              id: Number(body.exerciseId)
            }
          },
          sesh: {
            connect: {
              id: Number(body.seshId)
            }
          }
        }
      })
      res.json(createdSeshInterval);
      break;
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      break;
  }
}

export default intervalRoute;
