-- CreateEnum
CREATE TYPE "StatusActivity" AS ENUM ('active', 'inactive');

-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "status" "StatusActivity" NOT NULL DEFAULT 'active';
