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
	cod_tienda INT NOT NULL,
	PRIMARY KEY(codigo),
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
	PRIMARY KEY(SKU)
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
	PRIMARY KEY (codigo),
	FOREIGN KEY (cod_producto)
		REFERENCES Producto (SKU)
);

CREATE TABLE Cliente(
	cod_cliente INT AUTO_INCREMENT,
	nombre VARCHAR(25) NULL,
	direccion TEXT NOT NULL
);

CREATE TABLE Orden(

);

CREATE TABLE Detalle_Orden(

);