import { Exercise, SeshInterval } from "@prisma/client";

export const getNextIntervalProps = (intervals: (SeshInterval & { exercise: { restBetweenSets: boolean; } })[] = []): {
  setNo: number;
  active: boolean;
} => {
  const intervalsByLastCreated = intervals.sort((intA: SeshInterval, intB: SeshInterval) => (
    new Date(intB.createdAt).getTime() - new Date(intA.createdAt).getTime()
  ));
  const lastCreatedFinishedInterval = intervalsByLastCreated[0];
  if (!lastCreatedFinishedInterval) {
    return {
      setNo: 1,
      active: true,
    };
  }
  if (
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

