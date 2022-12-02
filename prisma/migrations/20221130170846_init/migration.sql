-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" SERIAL NOT NULL,
    "workoutId" INTEGER NOT NULL,
    "workoutOrder" INTEGER NOT NULL DEFAULT 0,
    "name" VARCHAR(200) NOT NULL,
    "imageUrl" TEXT,
    "setsDescription" TEXT,
    "repsDescription" TEXT,
    "restBetweenSets" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workout" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(300) NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "userOrder" INTEGER NOT NULL DEFAULT 0,
    "averageDurationS" INTEGER NOT NULL,
    "countCompleted" INTEGER NOT NULL,

    CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sesh" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "timeCompletedS" INTEGER NOT NULL,
    "workoutId" INTEGER NOT NULL,
    "note" VARCHAR(200),

    CONSTRAINT "Sesh_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeshInterval" (
    "id" SERIAL NOT NULL,
    "seshId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "durationS" INTEGER NOT NULL,
    "setNo" INTEGER NOT NULL DEFAULT 1,
    "active" BOOLEAN NOT NULL,
    "note" TEXT,

    CONSTRAINT "SeshInterval_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Workout_slug_key" ON "Workout"("slug");

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sesh" ADD CONSTRAINT "Sesh_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeshInterval" ADD CONSTRAINT "SeshInterval_seshId_fkey" FOREIGN KEY ("seshId") REFERENCES "Sesh"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeshInterval" ADD CONSTRAINT "SeshInterval_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
