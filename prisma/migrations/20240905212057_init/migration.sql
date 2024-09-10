-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "artistaId" INTEGER,
    "clienteId" INTEGER,
    CONSTRAINT "Usuario_artistaId_fkey" FOREIGN KEY ("artistaId") REFERENCES "Artista" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Usuario_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Artista" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "estadisticasId" INTEGER,
    CONSTRAINT "Cliente_estadisticasId_fkey" FOREIGN KEY ("estadisticasId") REFERENCES "Estadisticas" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Estampa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "imagenes" TEXT NOT NULL,
    "tema" TEXT NOT NULL,
    "popularidad" INTEGER NOT NULL,
    "rating" REAL NOT NULL,
    "autorId" INTEGER NOT NULL,
    "disponibleParaVenta" BOOLEAN NOT NULL,
    CONSTRAINT "Estampa_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Artista" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Camiseta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "modelo" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "talla" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "precio" REAL NOT NULL,
    "estampaId" INTEGER NOT NULL,
    "clienteId" INTEGER,
    CONSTRAINT "Camiseta_estampaId_fkey" FOREIGN KEY ("estampaId") REFERENCES "Estampa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Camiseta_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Compra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "estado" TEXT NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "fecha" DATETIME NOT NULL,
    "total" REAL NOT NULL,
    "metodoPagoId" INTEGER NOT NULL,
    CONSTRAINT "Compra_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Compra_metodoPagoId_fkey" FOREIGN KEY ("metodoPagoId") REFERENCES "MetodoPago" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Estadisticas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ventasTotales" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "MetodoPago" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" TEXT NOT NULL,
    "detalles" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FiltroEstampas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tema" TEXT NOT NULL,
    "popularidad" INTEGER NOT NULL,
    "ratingMinimo" REAL NOT NULL,
    "autorId" INTEGER NOT NULL,
    "artistaId" INTEGER NOT NULL,
    CONSTRAINT "FiltroEstampas_artistaId_fkey" FOREIGN KEY ("artistaId") REFERENCES "Artista" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FiltroCamisetas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "modelo" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "talla" TEXT NOT NULL,
    "material" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CatalogoEstampas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "CatalogoCamisetas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "_CamisetaCompra" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CamisetaCompra_A_fkey" FOREIGN KEY ("A") REFERENCES "Camiseta" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CamisetaCompra_B_fkey" FOREIGN KEY ("B") REFERENCES "Compra" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CamisetasCatalogo" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CamisetasCatalogo_A_fkey" FOREIGN KEY ("A") REFERENCES "Camiseta" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CamisetasCatalogo_B_fkey" FOREIGN KEY ("B") REFERENCES "CatalogoCamisetas" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EstampasVendidas" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_EstampasVendidas_A_fkey" FOREIGN KEY ("A") REFERENCES "Estadisticas" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EstampasVendidas_B_fkey" FOREIGN KEY ("B") REFERENCES "Estampa" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EstampasCatalogo" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_EstampasCatalogo_A_fkey" FOREIGN KEY ("A") REFERENCES "CatalogoEstampas" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EstampasCatalogo_B_fkey" FOREIGN KEY ("B") REFERENCES "Estampa" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_artistaId_key" ON "Usuario"("artistaId");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_clienteId_key" ON "Usuario"("clienteId");

-- CreateIndex
CREATE UNIQUE INDEX "_CamisetaCompra_AB_unique" ON "_CamisetaCompra"("A", "B");

-- CreateIndex
CREATE INDEX "_CamisetaCompra_B_index" ON "_CamisetaCompra"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CamisetasCatalogo_AB_unique" ON "_CamisetasCatalogo"("A", "B");

-- CreateIndex
CREATE INDEX "_CamisetasCatalogo_B_index" ON "_CamisetasCatalogo"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EstampasVendidas_AB_unique" ON "_EstampasVendidas"("A", "B");

-- CreateIndex
CREATE INDEX "_EstampasVendidas_B_index" ON "_EstampasVendidas"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EstampasCatalogo_AB_unique" ON "_EstampasCatalogo"("A", "B");

-- CreateIndex
CREATE INDEX "_EstampasCatalogo_B_index" ON "_EstampasCatalogo"("B");
