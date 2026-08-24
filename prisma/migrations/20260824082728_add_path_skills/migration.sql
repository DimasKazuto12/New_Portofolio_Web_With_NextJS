-- CreateTable
CREATE TABLE "PathSkill" (
    "id" TEXT NOT NULL,
    "pathName" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PathSkill_pkey" PRIMARY KEY ("id")
);
