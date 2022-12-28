export type SeshIntervalDto = {
  id?: number;
  seshId: number;
  exerciseId: number;
  durationS: number;
  setNo: number;
  active?: boolean;
  note?: string;
}

const withSeshHistoryExercises = (Component: React.FC<any>) => {
  const pastIntervals = [] as SeshIntervalDto[];
  const saveCurrentInterval = (interval: SeshIntervalDto) => {
    console.log('saveCurrentInterval', interval)
    if (!interval.active && interval.note) {
      // if note added during a rest period, then
      // add it to the last active set's notes

      // TODO
    }
    
  };
  const comp = (props: any) => (
    <Component
      pastIntervals={pastIntervals}
      saveCurrentInterval={saveCurrentInterval}
      {...props}
    />
  );
  comp.displayName = 'WithSeshHistoryExercises';
  return comp;
}
export default withSeshHistoryExercises;
