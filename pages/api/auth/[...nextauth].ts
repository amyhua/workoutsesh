import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from "next-auth/providers/email"

import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../lib/prismadb"

const options = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || 'none',
      clientSecret: process.env.GOOGLE_SECRET || 'none'
    }),
  ],
  pages: {
    signIn: '/signin',
    signOut: '/signin?signedout=true',
    error: '/signin',
    newUser: '/?intro=true',
  },
  callbacks: {
    async session({ session, token, user }: any) {
      // Send properties to the client, like an access_token from a provider.
      console.log('session: user', user)
      return Promise.resolve({ user });
    }
  },
  debug: false
}

export default NextAuth(options)
