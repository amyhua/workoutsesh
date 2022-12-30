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
    case 'PUT':
      const interval = await prisma.seshInterval.update({
        where: {
          id: Number(req.query.id),
        },
        data: body,
      })
      res.json(interval);
      break;
    default:
      res.setHeader('Allow', ['PUT'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      break;
  }
}

export default intervalRoute;
