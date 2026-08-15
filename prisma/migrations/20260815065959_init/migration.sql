-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('NEW', 'CONTACTED', 'QUOTED', 'BOOKED', 'COMPLETED', 'DECLINED');

-- CreateEnum
CREATE TYPE "MoveType" AS ENUM ('LOCAL', 'LONG_DISTANCE_ALBERTA', 'OUT_OF_PROVINCE');

-- CreateTable
CREATE TABLE "QuoteRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "pickupAddress" TEXT NOT NULL,
    "dropoffAddress" TEXT NOT NULL,
    "moveDate" TEXT,
    "moveSize" TEXT,
    "notes" TEXT,
    "photoUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "RequestStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuoteRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookedSlot" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "moveType" "MoveType" NOT NULL,
    "quoteRequestId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookedSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuoteRequest_status_idx" ON "QuoteRequest"("status");

-- CreateIndex
CREATE INDEX "QuoteRequest_createdAt_idx" ON "QuoteRequest"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "BookedSlot_quoteRequestId_key" ON "BookedSlot"("quoteRequestId");

-- CreateIndex
CREATE INDEX "BookedSlot_date_idx" ON "BookedSlot"("date");

-- CreateIndex
CREATE INDEX "BookedSlot_moveType_idx" ON "BookedSlot"("moveType");

-- AddForeignKey
ALTER TABLE "BookedSlot" ADD CONSTRAINT "BookedSlot_quoteRequestId_fkey" FOREIGN KEY ("quoteRequestId") REFERENCES "QuoteRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
