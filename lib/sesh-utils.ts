import { Exercise, SeshInterval } from "@prisma/client";

export const getNextIntervalProps = (intervals: (SeshInterval & { exercise: { restBetweenSets: boolean; } })[] = []): {
  setNo: number;
  active: boolean;
} => {
  // assume intervals are ordered by most recently created
  const lastCreatedFinishedInterval = intervals[0];
  if (!lastCreatedFinishedInterval) {
    return {
      setNo: 1,
      active: true,
    };
  }
  if (
    lastCreatedFinishedInterval.exercise &&
    lastCreatedFinishedInterval.exercise.restBetweenSets &&
    lastCreatedFinishedInterval &&
    lastCreatedFinishedInterval.active
  ) {
    return {
      setNo: lastCreatedFinishedInterval.setNo,
      active: false
    };
  }
  return {
    setNo: (lastCreatedFinishedInterval ? lastCreatedFinishedInterval.setNo : 0) + 1,
    active: true
  };
};

export const getShownExercises = (excs: Exercise[]) => excs
  .sort((a: Exercise, b: Exercise) => a.workoutOrder - b.workoutOrder)
  .filter((exc: Exercise) => exc.connectedToCurrentWorkout);
