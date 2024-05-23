-- CreateEnum
CREATE TYPE "StatusCategory" AS ENUM ('active', 'inactive');

-- AlterTable
ALTER TABLE "Categories" ADD COLUMN     "status" "StatusCategory" NOT NULL DEFAULT 'active';
