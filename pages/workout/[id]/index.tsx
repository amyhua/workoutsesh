import { prisma } from '../../../lib/prismadb'
import WorkoutPlayer from '../../../components/WorkoutPlayer'

function WorkoutIdPage({
  workout,
  error,
  saveCurrentInterval,
}: any) {
  return (
    <WorkoutPlayer
      workout={workout}
      error={error}
      saveCurrentInterval={saveCurrentInterval}
    />
  );
}

export async function getServerSideProps(context: any) {
  try {
    const workout = await prisma.workout.findFirstOrThrow({
      where: {
        id: Number(context.query.id),
      },
      include: {
        exercises: true,
        seshes: {
          where: {
            finishedAt: null,
          }
        }
      },
    });
    return {
      props : {
        workout: workout ? JSON.stringify(workout) : null,
        params: context.params
      }
    }
    // TODO: handle not logged in user
  } catch(error) {
    return {
      props : {
        error: error ? JSON.stringify(error) : null,
      }
    }
  }
}

export default WorkoutIdPage;
