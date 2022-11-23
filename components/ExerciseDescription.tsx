import Clamped from "./Clamped";

const ExerciseDescription = ({ setsDescription, repsDescription }: { setsDescription: string; repsDescription: string; }) => (
  <Clamped clamp={1}>
      {setsDescription || '<Sets>'} sets of {repsDescription || '<Reps>'}
  </Clamped>
)

export default ExerciseDescription
