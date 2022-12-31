import { SeshInterval } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../lib/prismadb'

async function intervalsRoute(req: NextApiRequest, res: NextApiResponse<any>) {
  const session = await getSession({ req });
  if (!session || !session.user || !session.user.email) {
    res.status(401).send({
      error: 'You must be signed in to access this content.'
    });
    return;
  }
  switch (req.method) {
    case 'GET':
      const {
        exerciseId,
        // notesOnly // if 'true' (case-insensitive), shows only those intervals with notes
      } = req.query;
      // load past active periods of the user by exerciseId
      const intervals = await prisma.seshInterval.findMany({
        where: {
          exerciseId: Number(exerciseId),
          // note: (
          //   String(notesOnly).toLowerCase() === 'true' ? {
          //     not: ''
          //   } : undefined
          // ),
          // TODO: make this on a param notesOnly
          // note: {
          //   not: '',
          // },
          active: true,
          sesh: {
            userEmail: session.user.email,
          }
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          createdAt: true,
          note: true,
        }
      });
      // TODO: Fix later
      res.json(intervals.filter((int: any) => int.note));
    case 'POST':
      const body = JSON.parse(req.body);
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
        },
        include: {
          exercise: true,
        }
      })
      res.json(createdSeshInterval);
      break;
    default:
      res.setHeader('Allow', ['POST', 'GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      break;
  }
}

export default intervalsRoute;
