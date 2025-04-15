-- AlterTable
ALTER TABLE "Rumour" ALTER COLUMN "description" DROP NOT NULL;

-- CreateTable
CREATE TABLE "RumourItem" (
    "id" SERIAL NOT NULL,
    "rumour_id" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RumourItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RumourComments" (
    "id" SERIAL NOT NULL,
    "rumour_id" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RumourComments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RumourItem" ADD CONSTRAINT "RumourItem_rumour_id_fkey" FOREIGN KEY ("rumour_id") REFERENCES "Rumour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RumourComments" ADD CONSTRAINT "RumourComments_rumour_id_fkey" FOREIGN KEY ("rumour_id") REFERENCES "Rumour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
