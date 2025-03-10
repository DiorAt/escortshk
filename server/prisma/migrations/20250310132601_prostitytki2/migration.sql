-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "telegramUsername" TEXT NOT NULL DEFAULT 'your_admin_username',
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "autoModeration" BOOLEAN NOT NULL DEFAULT false,
    "defaultCity" TEXT,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "watermarkEnabled" BOOLEAN NOT NULL DEFAULT true,
    "watermarkText" TEXT NOT NULL DEFAULT '@your_watermark',
    "minPhotoCount" INTEGER NOT NULL DEFAULT 3,
    "maxPhotoCount" INTEGER NOT NULL DEFAULT 10,
    "defaultPriceHour" INTEGER NOT NULL DEFAULT 5000,
    "defaultPriceTwoHours" INTEGER NOT NULL DEFAULT 10000,
    "defaultPriceNight" INTEGER NOT NULL DEFAULT 30000,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
