import { SeshInterval } from "@prisma/client";
import { useState } from "react";

const withSeshHistoryExercises = (Component: React.FC<any>) => {
  const pastIntervals = [] as SeshInterval[];
  const Comp = (props: any) => {
    const [lastSavedInterval, setLastSavedInterval] = useState<any>();
    const saveCurrentInterval = (interval: SeshInterval) => {
      if (props.isUnsavedSesh) return Promise.resolve();
      const promises = [];
      if (!interval.active && interval.note) {
        // if note added during a rest period, then
        if (
          lastSavedInterval &&
          lastSavedInterval.exerciseId === interval.exerciseId &&
          lastSavedInterval.seshId === interval.seshId &&
          lastSavedInterval.active
          // redundant check, given that a pre-rest period is always active,
          // but why the heck not
        ) {
          // add it to the last active set's notes
          promises.push(
            fetch(`/api/intervals/${lastSavedInterval.id}`, {
              method: 'PUT',
              body: JSON.stringify({
                note: interval.note,
              }),
            })
          );
        }
      }
      promises.push(
        fetch(`/api/intervals`, {
          method: 'POST',
          body: JSON.stringify({
            ...interval,
            note: interval.active ? interval.note : '',
          })
        })
      );
      return Promise.all(promises)
        .then((rs: any[]) => rs[rs.length - 1].json())
        .then((data: any[]) => {
          setLastSavedInterval(data);
          return {
            ...data,
            note: interval.note,
          };
        })
        .catch((errs: any[]) => {
          console.error('Cannot save set', errs);
          alert('Cannot save set: ' + errs[0]);
        });
    };
    return (
      <Component
        pastIntervals={pastIntervals}
        saveCurrentInterval={saveCurrentInterval}
        {...props}
      />
    );
  };
  Comp.displayName = 'WithSeshHistoryExercises';
  return Comp;
}
export default withSeshHistoryExercises;
