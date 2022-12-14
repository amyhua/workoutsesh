import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials"

import bcrypt from "bcrypt"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "../../../lib/prismadb"

const createUserWithCredentials = (
  email: string,
  password: string,
  confirmPassword: string,
  username: string,
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
      const user = prisma.user.create({
        data: {
          email,
          password: hash,
          username,
        }
      });
      resolve(user);
    });
  });
};

const options = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || 'none',
      clientSecret: process.env.GOOGLE_SECRET || 'none',
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM
    }),
    CredentialsProvider({
      name: 'Email & Password',
      credentials: {
        username: { label: "Email", type: "text", placeholder: "Email Address" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials, req): Promise<any> {
        const { email, username, password, confirmPassword } = credentials as any;
        try {
          
          const user = await prisma.user.findUnique({
            where: {
              ...(email ? { email } : { username }),
            }
          });
          if (user) {
            if (confirmPassword) {
              throw new Error('User already exists. Sign in instead.');
            }
            if (user.password) {
              // match on password
              return new Promise(async (resolve: any, reject:any) => {
                console.log('compare', password, user.password)
                bcrypt.compare(password, user.password as string, (err, result) => {
                  console.log('err?', err, result)
                  if (result) {
                    // password is valid
                    return resolve(user)
                  }
                  throw new Error(
                    'Invalid login.'
                  )
                })
              });
            }
            // non-password user => use social media login
            throw new Error("Sign in with social media instead.");
          } else {
            if (!confirmPassword) {
              // signed in with nonexistent account
              throw new Error('User not found. Use a different username/email or sign up instead.')
            }
            // create
            return await createUserWithCredentials(email, password, confirmPassword, username);
          }
        } catch(err: any) {
          throw new Error(err);
        }
      }
    })
  ],
  pages: {
    signIn: '/signin',
    signOut: '/signin?signedout=true',
    error: '/signin',
    newUser: '/?intro=true',
  },
  callbacks: {
    async signIn({ account, profile }: any) {
      // if (account.provider === 'google') {
      //   // update avatar
      //   const user = await prisma.user.update({
      //     where: {
      //       email: profile.email,
      //     },
      //     data: {
      //       image: profile.picture
      //     }
      //   });
      //   if (user) return true;
      // }
      return true;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
}

export default NextAuth(options)
