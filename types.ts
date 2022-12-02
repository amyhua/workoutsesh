export type Error = {
  error: boolean;
  message: string;
}

export type User = {
  id: number
  createdAt: Date
  updatedAt: Date
  name: string
  email: string
  emailVerified: boolean | null
  password: string
  image: string | null | undefined
  workouts?: any[]
}
