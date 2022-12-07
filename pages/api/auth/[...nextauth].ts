import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials"

import bcrypt from "bcrypt"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../lib/prismadb"

const createUserWithCredentials = (
  email: string,
  password: string,
  confirmPassword: string,
) => {
  if (confirmPassword !== password) {
    return false;
  }
  return new Promise((resolve: any, reject: any) => {
    bcrypt.hash(password, 10, function(err, hash) {
      if (err) {
        reject(null);
      }
      // store hash in the database
      resolve(prisma.user.create({
        data: {
          email,
          password: hash,
        }
      }))
    });
  });
};

const options = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || 'none',
      clientSecret: process.env.GOOGLE_SECRET || 'none'
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    CredentialsProvider({
      name: 'Email & Password',
      credentials: {
        username: { label: "Email", type: "text", placeholder: "Email Address" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials, req): Promise<any> {
        const { email, password, confirmPassword } = credentials as any;
        const user = await prisma.user.findUnique({
          where: {
            email,
          }
        });
        if (user) {
          if (user.password) {
            // match on password
            return new Promise(async (resolve: any, reject:any) => {
              bcrypt.compare(password, user.password as string, (err, result) => {
                if (result) {
                  // password is valid
                  resolve(user)
                }
                throw new Error(
                  'Invalid email or password.'
                )
              })
            });
          }
          // non-password user => use social media login
          throw new Error("Sign in with social media instead.");
        } else {
          // create
          return await createUserWithCredentials(email, password, confirmPassword);
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/signin',
    signOut: '/signin?signedout=true',
    error: '/signin',
    newUser: '/?intro=true',
  },
  debug: false
}

export default NextAuth(options)
