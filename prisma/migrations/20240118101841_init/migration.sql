-- CreateEnum
CREATE TYPE "InvestimentType" AS ENUM ('international', 'etf', 'national', 'fii', 'reit', 'crypto', 'valueReserve', 'fixedIncome', 'unknown');

-- CreateEnum
CREATE TYPE "BudgetType" AS ENUM ('fixedCosts', 'comfort', 'goals', 'pleasures', 'freedom', 'knowledge', 'emergency');

-- CreateEnum
CREATE TYPE "Strategy" AS ENUM ('stock', 'reit', 'unknown');

-- CreateTable
CREATE TABLE "Investiment" (
    "id" "InvestimentType" NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DefaultQuestion" (
    "id" TEXT NOT NULL,
    "criteria" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "strategy" "Strategy" NOT NULL,

    CONSTRAINT "DefaultQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "criteria" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "strategy" "Strategy" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "type" "InvestimentType" NOT NULL,
    "ticker" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "questions" TEXT[],

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestimentGoal" (
    "id" TEXT NOT NULL,
    "type" "InvestimentType" NOT NULL,
    "value" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "InvestimentGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetGoal" (
    "id" TEXT NOT NULL,
    "type" "BudgetType" NOT NULL,
    "value" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "BudgetGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Investiment_id_key" ON "Investiment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "InvestimentGoal" ADD CONSTRAINT "InvestimentGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "BudgetGoal" ADD CONSTRAINT "BudgetGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
