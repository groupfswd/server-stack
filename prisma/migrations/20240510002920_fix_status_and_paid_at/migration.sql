-- AlterTable
ALTER TABLE "Orders" ALTER COLUMN "paid_at" DROP DEFAULT,
ALTER COLUMN "status" SET DEFAULT 'waiting_payment';
