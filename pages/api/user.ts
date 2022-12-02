// import { withIronSessionApiRoute } from 'iron-session/next'
// import { sessionOptions } from '../../lib/session'
// import { NextApiRequest, NextApiResponse } from 'next'
// import { PrismaClient } from '@prisma/client'
// import { isImportEqualsDeclaration } from 'typescript'
// import { User } from '../../types'

// const prisma = new PrismaClient()

// export type Error = {
//   error: boolean
//   message: string
// }

// async function userRoute(req: NextApiRequest, res: NextApiResponse<User | Error>) {
//   const method = req.method;
//   var {
//     name, username, email, password, avatarUrl
//   } = req.body || req.query;
//   switch (method) {
//     case 'POST':
//       const user = await prisma.user.findFirst({
//         where: email ? {
//           email,
//         } : {
//           username,
//         }
//       });
//       if (user) {
//         res.json({
//           error: true,
//           message: `Account ${email ? email : username} already exists. Sign in instead.`
//         })
//       } else {
//         await prisma.user.create({
//           data: {
//             name,
//             email,
//             username,
//             password,
//             avatarUrl
//           }
//         })
//         const user = await prisma.user.findUnique({
//           where: { email }
//         })
//         if (user) {
//           res.json(user)
//         } else {
//           res.json({
//             error: true,
//             message: `Cannot find an account with email ${email}. Please try again.`
//           })
//         }
//       }
//       break
//     case 'GET':
//       if (username || email) {
//         const user = await prisma.user.findUnique({
//           where: (email ? {
//             email,
//           } : {
//             username,
//           })
//         })
//         if (user) {
//           res.json(user)
//         } else {
//           res.status(404).json({
//             error: true,
//             message: `Cannot find user ${username || email}. Sign up or try another email/username.`
//           })
//         }
//       } else if (req.session.user) {
//         const user = await prisma.user.findUnique({
//           where: { email: req.session.user.email }
//         })
//         if (user) {
//           res.json(user)
//         } else {
//           res.status(404).json({
//             error: true,
//             message: `Cannot find user with email ${req.session.user.email}. Sign up or try another email.`
//           })
//         }
//       } else {
//         res.status(440).json({
//           error: true,
//           message: 'Session expired. Please sign in again.'
//         })
//       }
//       break
//     default:
//       res.setHeader('Allow', ['GET', 'POST'])
//       res.status(405).end(`Method ${method} Not Allowed`)
//       break
//   }
// }

// export default withIronSessionApiRoute(userRoute, sessionOptions)
