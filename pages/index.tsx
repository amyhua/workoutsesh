import AuthenticatedPageWrapper from "../components/AuthenticatedPageWrapper";
import IndexDashboard from "../components/IndexDashboard";

export default function IndexPage({ data, user }: any) {
  return (
    <AuthenticatedPageWrapper>
      <IndexDashboard />
    </AuthenticatedPageWrapper>
  )
}
