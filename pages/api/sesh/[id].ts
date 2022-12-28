import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../lib/prismadb'
import { durationSeconds } from '../../../lib/time-utils';

async function seshRoute(req: NextApiRequest, res: NextApiResponse<any>) {
  const session = await getSession({ req });
  if (!session || !session.user || !session.user.email) {
    res.status(401).send({
      error: 'You must be signed in to access this content.'
    });
    return;
  }
  switch (req.method) {
    case 'GET':
      console.log('!req.query', req.query)
      let sesh = await prisma.sesh.findFirstOrThrow({
        where: {
          id: Number(req.query.id),
          userEmail: session.user.email,
        }
      });
      if (req.query.action) {
        const now = new Date();
         switch (String(req.query.action).toLowerCase()) {
          case 'stop':
            sesh = await prisma.sesh.update({
              where: {
                id: Number(req.query.id),
              },
              data: {
                pausedAt: sesh.pausedAt || now,
                finishedAt: sesh.pausedAt || now,
              },
            });
            break;
          case 'pause':
            sesh = await prisma.sesh.update({
              where: {
                id: Number(req.query.id),
              },
              data: {
                pausedAt: now,
                timeCompletedS: Number(req.query.duration),
              },
            });
            break;
          case 'unpause':
            sesh = await prisma.sesh.update({
              where: {
                id: Number(req.query.id),
              },
              data: {
                pausedAt: null,
              },
            });
            break;
          case 'unstop':
            sesh = await prisma.sesh.update({
              where: {
                id: Number(req.query.id),
              },
              data: {
                finishedAt: null,
              },
            });
            break;
          default:
            res.status(405).end(`Action ${req.query.action} Not Allowed`)
            break;
         }
      }
      res.json(sesh);
      break;
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      break;
  }
}

export default seshRoute;
