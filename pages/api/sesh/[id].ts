import { Sesh, SeshInterval } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../lib/prismadb'

const getAverage = (nums: number[]) => {
  const total = nums.reduce((sum: number, x: number) => sum + x);
  return total / nums.length;
}

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
      let sesh = await prisma.sesh.findFirstOrThrow({
        where: {
          id: Number(req.query.id),
          userEmail: session.user.email,
        },
        include: {
          intervals: {
            orderBy: {
              createdAt: 'desc',
            },
            select: {
              id: true,
              createdAt: true,
              active: true,
              durationS: true,
              note: true,
              setNo: true,
              exerciseId: true,
              exercise: {
                select: {
                  name: true,
                  restBetweenSets: true,
                }
              }
            },
          },
        },
      }) as Sesh | Sesh & { intervals: SeshInterval[]; };
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
            const orderedExerciseIds = req.query.orderedExerciseIds ?
              String(req.query.orderedExerciseIds).split(',').map((x: string) => Number(x)) : undefined;

            sesh = await prisma.sesh.update({
              where: {
                id: Number(req.query.id),
              },
              data: {
                pausedAt: now,
                timeCompletedS: Number(req.query.duration),
                orderedExerciseIds,
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
              include: {
                intervals: true,
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
          case 'finish':
            sesh = await prisma.sesh.update({
              where: {
                id: Number(req.query.id),
              },
              data: {
                finishedAt: now,
                timeCompletedS: Number(req.query.duration),
                pausedAt: now,
              },
            });
            const workout = await prisma.workout.findFirstOrThrow({
              where: {
                id: sesh.workoutId,
              },
              include: {
                seshes: true,
              }
            });
            await prisma.workout.update({
              where: {
                id: workout.id,
              },
              data: {
                averageDurationS: Number(getAverage([
                  ...(workout.seshes || []).map((s: Sesh) => s.timeCompletedS),
                  sesh.timeCompletedS,
                ]).toFixed(3)),
              }
            })
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
