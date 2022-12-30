import { Exercise, Sesh, SeshInterval } from "@prisma/client";
import { getSession } from "next-auth/react";
import Layout from "../../../../components/Layout";
import SeshHistoryContainer from "../../../../components/SeshHistoryContainer";
import { prisma } from '../../../../lib/prismadb'

type SeshDatum = Sesh & { intervals: (SeshInterval & { exercise: Exercise })[] } & { workout: { name: string; id: number; } };

const SeshPage = ({
  sesh,
}: {
  sesh: string | SeshDatum | null
}) => {
  if (typeof sesh === 'string') sesh = JSON.parse(sesh) as SeshDatum;
  return (
    <Layout title="Sesh Summary" background="#345537">
      <SeshHistoryContainer
        intervals={sesh ? sesh.intervals : []}
        workoutName={sesh && sesh.workout.name}
        workoutId={sesh && sesh.workout.id}
        isSeshPage={true} />
    </Layout>
  );
}

export default SeshPage;

export async function getServerSideProps(context: any) {
  try {
    const session = await getSession(context);
    if (session && session.user) {
      const { email } = session.user;
      const sesh = await prisma.sesh.findFirstOrThrow({
        where: {
          id: Number(context.query.seshId),
          userEmail: String(email),
        },
        include: {
          workout: {
            select: {
              id: true,
              name: true
            }
          },
          intervals: {
            orderBy: {
              createdAt: 'asc',
            },
            select: {
              id: true,
              createdAt: true,
              active: true,
              durationS: true,
              note: true,
              setNo: true,
              exercise: {
                select: {
                  id: true,
                  name: true,
                }
              }
            },
          },
        },
      });
      return {
        props: {
          session: JSON.stringify(session),
          sesh: sesh ? JSON.stringify(sesh) : null,
          params: context.params,
        }
      };
    }
    // TODO: handle not logged in user
  } catch(error) {
    return {
      props: {
        error: error ? JSON.stringify(error): null
        // TODO: handle errors
      }
    }
  }
}