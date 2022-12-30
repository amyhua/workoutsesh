import { SeshInterval } from "@prisma/client";
import { useState } from "react";

const withSeshHistoryExercises = (Component: React.FC<any>) => {
  const pastIntervals = [] as SeshInterval[];
  const Comp = (props: any) => {
    const [lastSavedInterval, setLastSavedInterval] = useState<any>();
    const saveCurrentInterval = (interval: SeshInterval) => {
      const promises = [];
      let restNote: string | undefined = '';
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
            fetch(`/api/interval/${lastSavedInterval.id}`, {
              method: 'PUT',
              body: JSON.stringify({
                note: interval.note,
              }),
            })
          );
        }
      }
      promises.push(
        fetch(`/api/interval`, {
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
          console.log('saved data...', data);
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
