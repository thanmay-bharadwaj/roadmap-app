-- CreateTable
CREATE TABLE "Progress" (
    "id" SERIAL NOT NULL,
    "itemId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Progress_itemId_key" ON "Progress"("itemId");
