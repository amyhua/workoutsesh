import { useSession } from "next-auth/react"
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import Signin from './Signin';
import React from "react";
import Layout from "./Layout";

const AuthenticatedPageWrapper = ({
  children,
}: { children: any; }) => {
  const router = useRouter()

  const session: any = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      router.push({
        pathname: '/signin',
        query: {
          ...(
            (window.location.pathname === '/' ||
          window.location.pathname === '/signin') ?
          {} : {
            redirect: window.location.pathname
          }
          )
        }
      })
      router.push(`/signin?
      
      ${
        (window.location.pathname === '/' ||
        window.location.pathname === '/signin') ? '' :
        `redirect=${window.location.pathname}`
      }`);
    },
  })

  if (session.status.loading) return (
    <Layout title="Loading...">
      Loading...
    </Layout>
  );

  return React.cloneElement(children, {
    ...(session.data || {})
  });
};

export default AuthenticatedPageWrapper
