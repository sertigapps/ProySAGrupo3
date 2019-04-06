# Entregable Numero 1

Para antes poder plantear cual sera la topología a utilizar debemos escoger que estructura de negocio se acopla mas al conglomerado 
de negocios que vamos a analizar. De las diferentes estructuras consideramos que es una mezcla de dos estructuras estas siendo :

1. Red de Tiendas/ Sucursales ( Store/Branch Network )
2. Multiples Geografías

Esto basado en que el conglomerado se organiza geograficamente y cada región opera parcialmente independiente , pero si de forma sinérgica 
en apoyo a los objetivos globales de la empresa, de igual forma se presentan funciones de integración, procesos y capacidades bajo el 
control cental o regional.

##Topología Propuesta

### Single Logical ESB (Descartada)
Consideramos no ser adecuada ya que en el conglomerado cada tienda implementara su ERP Y Tienda en linea de forma individual

### Directly Connected ESB with Single Registry ( Descartada )
Debido a que esta topología es mas adecuada cuando los servicios son manejados por las distintas unidades de negocio centralmente,
es correcto decir que el ERP y la Tienda son distintas unidades de negocio pero sin embargo no son centralizadas.

### Directly Connected ESP with multiple Registry ( Descartada )
Por la misma razon que la anterior, ya que usualmente es mas adecuada cuando las unidades de negocio estan centralizadas aunque se
accedan desde muchos puntos.

### Brokered ESB ( Descartada )
La razon para descartar esta topología , es por razones de limitaciones en el proyecto ya que se tiene planeado tomar a cada grupo con su
implementacion de ESB y unirlos para realizar las pruebas, esta topología necesita de un orquestador central el cual probablemente no es
viable implementar por cuestiones de tiempo y coordinacion necesaria para soportar todos los frameworks que cada grupo utilizará

### Hub and Spokes ESB ( Adecuada )
Usualmente diseñada para modelos de negocio de sucursales , en la cual cada Hub tiene control de la implementacion y desplegue del ESB,
lo cual se adapta a los requerimientos del proyecto tanto en implementación como pruebas.

### Imposed ESB ( Descartada )
Descartada no por razones tecnicas sino debido a restricciones del proyecto ya que en esta topologia, las oficinas centrales o altos 
mandos de IT proveen de todo lo necesario para implementar y desplegar los ESB en cada HUB, lo cual es descartado ya que el enfoque del
proyecto es que se desarrolle el ESB.

## Definicion de Servicios
### Servicios Web de Entidades
#### Tiendas
1. Subscribirse a Bodega
2. Solicitar Despacho
3. Consultar Tiempo de Entrega
#### PIM
1. Obtener Catalogo Completo
2. Obtener Productos Descontinuados
3. Actualizar Precios basados en moneda local
4. Obtener Lista por Categorias
#### Bodegas
1. Obtener Inventario Real
2. Tiempo de Entrega
3. Registrar Subscripcion
4. Recibir Solicitud de Despacho
5. Enviar Inventario
### Protocolos a Utilizar
1. Propongo REST para los servicios 
2. AMQP para colas
### Operaciones
#### Tiendas
1. Realizar suscripcion a bodega
  - Nombre de la funcion: suscribirse
  - Explicacion: Una tienda, con su propio id, podra suscribirse a una bodega del mismo o diferente pais para llevar a cabo los despachos al momento de que se lleve a cabo una compra.
  - Parametros de entrada:
    - Codigo de tienda (tentativamente de tipo entero)
    - Codigo de bodega (tentativamente de tipo entero)
  - Respuesta: la respuesta sera de tipo booleano, true si se pudo realizar la suscripcion y false si no.
2. Solicitar despacho
  - Nombre de la funcion: solicitar_despacho
  - Explicacion: Al momento de generarse una orden por un cliente, la tienda solicita el producto a las bodegas a las que esta suscrita.
  - Parametros de entrada:
    - Codigo de tienda (tentativamente de tipo entero)
    - SKU (tentativamente de tipo entero)
    - Cantidad (entero)
  - Respuesta: la respuesta sera el tiempo en dias que se tardara en realizar el despacho a la tienda.
3. Consultar tiempo de entrega
  - Nombre de la funcion: consultar_tiempo_entrega
  - Explicacion: La tienda, al realizar un pedido podrá consultar el tiempo de entrega a las bodegas en las que esta subscrito. Verificara cual es el tiempo de entrega menor entre las bodegas en base a la ubicacion de la tienda para retornar un resultado.
  - Parametros de entrada:
	- Fecha de realizacion del pedido (tipo fecha)
	- Codigo de tienda (tentativamente de tipo entero)
  - Respuesta: la respuesta sera el tiempo en días en que se entregará el producto (tipo entero)
#### PIM
1. Obtener catálogo completo 
  - Nombre de la función: 
  - Explicación:
  - Parámetros de entrada:
  - Respuesta
2. Obtener productos descontinuados
  - Nombre de la función: 
  - Explicación:
  - Parámetros de entrada:
  - Respuesta
3. Actualizar precios basados en moneda local
  - Nombre de la función: 
  - Explicación:
  - Parámetros de entrada:
  - Respuesta
4. Obtener lista por categorias
  - Nombre de la función: 
  - Explicación:
  - Parámetros de entrada:
  - Respuesta
#### Bodegas
1. Obtener inventario real
  - Nombre de la función: 
  - Explicación:
  - Parámetros de entrada:
  - Respuesta
2. Tiempo de entrega
   - Nombre de la función: 
  - Explicación:
  - Parámetros de entrada:
  - Respuesta
3. Registrar subscripcion
    - Nombre de la función: 
  - Explicación:
  - Parámetros de entrada:
  - Respuesta
4. Recibir solicitud de despacho
  - Nombre de la función: 
  - Explicación:
  - Parámetros de entrada:
  - Respuesta
5. Enviar inventario
  - Nombre de la función: 
  - Explicación:
  - Parámetros de entrada:
  - Respuesta
### Autenticación
#### Funciones afectadas
#### Protocolo de Autenticación
Propongo JWT por versatilidad y disponibilidad en varios lenguajes
#### Roles y niveles de usuario a crearse

