/**** Script SQL de Proyecto Software Avanzado ****/

CREATE TABLE Tienda(
	cod_tienda INT AUTO_INCREMENT,
	nombre VARCHAR(50) NOT NULL,
	pais VARCHAR(25) NOT NULL,
	nodo VARCHAR(50) NOT NULL,
	id_cliente VARCHAR(50) NOT NULL,
	id_secreto VARCHAR(50) NOT NULL,
	PRIMARY KEY(cod_tienda)
);

CREATE TABLE Bodega(
	cod_bodega INT AUTO_INCREMENT,
	nombre VARCHAR(50) NOT NULL,
	pais VARCHAR(25) NOT NULL,
	cod_tienda INT NOT NULL,
	PRIMARY KEY(cod_bodega),
	FOREIGN KEY (cod_tienda)
      REFERENCES Tienda (cod_tienda)
);

CREATE TABLE Producto(
	SKU INT,
	nombre VARCHAR(25) NOT NULL,
	precio_lista FLOAT,
	descripcion_corta VARCHAR(100) NULL,
	descripcion_larga TEXT NULL,
	activo INT NOT NULL,
	stock INT NULL,
	cod_tienda INT NOT NULL,
	PRIMARY KEY(SKU),
	FOREIGN KEY (cod_tienda)
		REFERENCES Tienda (cod_tienda)
);

CREATE TABLE Categoria(
	cod_categoria INT AUTO_INCREMENT,
	nombre VARCHAR(50) NOT NULL,
	PRIMARY KEY (cod_categoria)
);

CREATE TABLE Categoria_Producto(
	SKU INT NOT NULL,
	cod_categoria INT NOT NULL,
	PRIMARY KEY (SKU, cod_categoria),
	FOREIGN KEY (SKU)
		REFERENCES Producto (SKU),
	FOREIGN KEY (cod_categoria)
		REFERENCES Categoria (cod_categoria)
);

CREATE TABLE Imagen(
	cod_imagen INT AUTO_INCREMENT,
	ruta TEXT NOT NULL,
	cod_producto INT NOT NULL,
	PRIMARY KEY (cod_imagen),
	FOREIGN KEY (cod_producto)
		REFERENCES Producto (SKU)
);

CREATE TABLE Cliente(
	cod_cliente INT AUTO_INCREMENT,
	nombre VARCHAR(25) NULL,
	pais VARCHAR(25) NOT NULL,
	direccion TEXT NOT NULL,
	PRIMARY KEY (cod_cliente)
);

CREATE TABLE Estado(
	cod_estado INT AUTO_INCREMENT,
	nombre VARCHAR(25) NOT NULL,
	PRIMARY KEY (cod_estado)
);

CREATE TABLE Orden(
	cod_orden INT AUTO_INCREMENT, 
	total FLOAT,
	cod_cliente INT NOT NULL,
	cod_estado INT NOT NULL,
	PRIMARY KEY (cod_orden), 
	FOREIGN KEY (cod_cliente)
		REFERENCES Cliente(cod_cliente),
	FOREIGN KEY (cod_estado)
		REFERENCES Estado(cod_estado)
);

CREATE TABLE Detalle_Orden( 
	cod_det_orden INT AUTO_INCREMENT,
	cod_prod INT NOT NULL, 
	cod_tienda INT NOT NULL, 
	cod_orden INT NOT NULL,
	PRIMARY KEY (cod_det_orden),
	FOREIGN KEY (cod_prod)
		REFERENCES Producto (SKU),
	FOREIGN KEY (cod_tienda)
		REFERENCES Tienda(cod_tienda),
	FOREIGN KEY (cod_orden)
		REFERENCES Orden(cod_orden)	
);

CREATE TABLE Detalle_Bodega( 
	cod_det_orden  INT NOT NULL,
	cod_bodega INT NOT NULL,
	PRIMARY KEY (cod_det_orden, cod_bodega), 
	FOREIGN KEY(cod_bodega)
		REFERENCES Bodega(cod_bodega), 
	FOREIGN KEY (cod_det_orden)
		REFERENCES Detalle_Orden(cod_det_orden)
);

--Borrar
--DROP TABLE Detalle_Bodega;
--DROP TABLE Detalle_Orden;
--DROP TABLE Orden;
--DROP TABLE Estado; 
--DROP TABLE Cliente; 
--DROP TABLE Imagen;
--DROP TABLE Categoria_Producto;
--DROP TABLE Categoria;
--DROP TABLE Producto;
--DROP TABLE Bodega;
--DROP TABLE Tienda;