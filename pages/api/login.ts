

// import { withIronSessionApiRoute } from 'iron-session/next'
// import { sessionOptions } from '../../lib/session'
// import { NextApiRequest, NextApiResponse } from 'next'
// // const octokit = new Octokit()

// async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
//   const { username } = await req.body

//   try {
//     // const {
//     //   data: { login, avatar_url },
//     // } = await octokit.rest.users.getByUsername({ username })
//     const login = {
//       username: 'Amy H',
//       avatar_url: 'https://avatars.githubusercontent.com/u/51768384?v=4',
//     }

//     const user = { isLoggedIn: true, login: login.username, avatarUrl: login.avatar_url } as User
//     req.session.user = user
//     await req.session.save()
//     res.json(user)
//   } catch (error) {
//     res.status(500).json({ message: (error as Error).message })
//   }
// }

// export default withIronSessionApiRoute(loginRoute, sessionOptions)
