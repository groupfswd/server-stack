/*
  Warnings:

  - A unique constraint covering the columns `[item_id]` on the table `Reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Reviews" ADD COLUMN     "item_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Reviews_item_id_key" ON "Reviews"("item_id");

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Order_Items"("id") ON DELETE SET NULL ON UPDATE CASCADE;
