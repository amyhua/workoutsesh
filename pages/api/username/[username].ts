import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../lib/prismadb'

async function usernameRoute(req: NextApiRequest, res: NextApiResponse<any>) {
  const session = await getSession({ req });
  if (!session || !session.user) {
    res.status(401).send({
      error: 'You must be signed in to access this content.'
    });
    return;
  }
  switch (req.method) {
    case 'GET':
      if (typeof req.query.username === 'string') {
        const user = await prisma.user.findUnique({
          where: {
            username: req.query.username,
          }
        });
        return res.json(user);
      }
      res.status(404);
      break;
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      break;
  }
}

export default usernameRoute;
