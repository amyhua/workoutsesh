import { Sesh, SeshInterval } from "@prisma/client";

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

export type SeshDto = {
  id: number;
  createdAt: string;
  updatedAt: string;
  finishedAt?: string;
  pausedAt?: string;
  timeCompletedS: number;
  orderedExerciseIds: number[];
}

export type SeshIntervalDto = {
  seshId: number;
  exerciseId: number;
  durationS: number;
  setNo: number;
  note?: string;
  active: boolean;
}

export type IntervalsMeta = {
  intervalsBySetNo: Record<string, SeshInterval[]>;
  noteBySetNo: Record<string, string>;
}

export type SeshDatum = Sesh & { intervals: (SeshInterval & { exercise: Exercise })[] } & { workout: { name: string; id: number; } };
