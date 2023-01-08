import { Exercise, SeshInterval } from "@prisma/client";

export const getNextIntervalProps = (
  intervals: (
    SeshInterval & { exercise: { restBetweenSets: boolean; } }
  )[] = [],
  activeExercise: Exercise
): {
  setNo: number;
  active: boolean;
} => {
  // assume intervals are ordered by most recently created
  const lastCreatedFinishedInterval = intervals[0];
  if (!lastCreatedFinishedInterval) {
    // next set is a new set for the exercise
    return {
      setNo: 1,
      active: activeExercise.isRest ? false : true,
    };
  }
  if (
    lastCreatedFinishedInterval &&
    lastCreatedFinishedInterval.exercise &&
    lastCreatedFinishedInterval.exercise.restBetweenSets &&
    lastCreatedFinishedInterval.active
  ) {
    // next set is a rest period for the exercise
    return {
      setNo: lastCreatedFinishedInterval.setNo,
      active: false
    };
  }
  // last set was a rest for a rest-between exercise, or,
  // was a set for a no-rest exercise
  return {
    setNo: lastCreatedFinishedInterval.setNo + 1,
    active: !activeExercise.isRest
  };
};

export const getShownExercises = (excs: Exercise[]) => excs
  .sort((a: Exercise, b: Exercise) => a.workoutOrder - b.workoutOrder)
  .filter((exc: Exercise) => exc.connectedToCurrentWorkout);
