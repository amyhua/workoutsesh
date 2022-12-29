import { SeshInterval } from "@prisma/client";

export const getNextIntervalProps = (intervals: SeshInterval[], restBetweenSets: boolean): {
  setNo: number;
  active: boolean;
} => {
  const lastCreatedFinishedInterval = intervals[0];
  if (
    restBetweenSets &&
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

