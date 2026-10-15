-- AlterTable
ALTER TABLE "CellarBottle" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "CellarBottle_userId_idx" ON "CellarBottle"("userId");

-- AddForeignKey
ALTER TABLE "CellarBottle" ADD CONSTRAINT "CellarBottle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
