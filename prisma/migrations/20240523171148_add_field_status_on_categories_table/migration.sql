-- CreateEnum
CREATE TYPE "StatusCategories" AS ENUM ('active', 'inactive');

-- AlterTable
ALTER TABLE "Categories" ADD COLUMN     "status" "StatusCategories" NOT NULL DEFAULT 'active';
