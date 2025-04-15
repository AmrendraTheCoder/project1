-- CreateTable
CREATE TABLE "Rumour" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expire_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rumour_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Rumour" ADD CONSTRAINT "Rumour_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
