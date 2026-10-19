-- CreateTable
CREATE TABLE "TimelineEntry" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'pendidikan',
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "startYear" INTEGER NOT NULL,
    "endYear" INTEGER,
    "description" TEXT,
    "highlights" TEXT,
    "learned" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimelineEntry_pkey" PRIMARY KEY ("id")
);
