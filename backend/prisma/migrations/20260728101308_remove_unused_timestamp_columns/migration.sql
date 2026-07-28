/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `folders` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `folders` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "folders" DROP COLUMN "deleted_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "notes" DROP COLUMN "deleted_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "deleted_at",
DROP COLUMN "updated_at";
