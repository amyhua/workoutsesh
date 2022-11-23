import Layout from "../components/Layout"

const workout = {
  name: 'Example Workout'
}

function Sesh() {
  return (
    <Layout title={`Sesh - ${workout.name}`}>
      <h1>{workout.name}</h1>
    </Layout>
  )
}

export default Sesh
