import { prisma } from '../../lib/prismadb'
import WorkoutPlayer from '../../components/WorkoutPlayer'

function WorkoutShareBySlugPage({
  workout,
  error,
  saveCurrentInterval,
}: any) {
  return (
    <WorkoutPlayer
      workout={workout}
      error={error}
      saveCurrentInterval={saveCurrentInterval}
      isUnsavedSesh={true}
    />
  );
}

export async function getServerSideProps(context: any) {
  const { slug } = context.query;
  try {
    const workout = await prisma.workout.findFirstOrThrow({
      where: {
        slug: slug,
      },
      include: {
        exercises: true,
      },
    });
    return {
      props : {
        workout: workout ? JSON.stringify({
          ...workout,
          seshes: [],
        }) : null,
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

export default WorkoutShareBySlugPage;
