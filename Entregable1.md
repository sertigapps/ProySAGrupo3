# Entregable Numero 1

Para antes poder plantear cual sera la topologia a utilizar debemos escoger que estructura de negocio se acopla mas al conglomerado 
de negocios que vamos a analizar. De las diferentes estructuras consideramos que es una mezcla de dos estructuras estas siendo :

1. Red de Tiendas/ Sucursales ( Store/Branch Network )
2. Multiples Geografias

Esto basado en que el conglomerado se organiza geograficamente y cada region opera parcialmente independiente , pero si de forma sinergica 
en apoyo a los objetivos globales de la empresa, de igual forma se presentan funciones de integracion, procesos y capacidades bajo el 
control cental o regional.

##Topologia Propuesta

### Single Logical ESB (Descartada)
Consideramos no ser adecuada ya que en el conglomerado cada tienda implementara su ERP Y Tienda en linea de forma individual

### Directly Connected ESB with Single Registry ( Descartada )
Debido a que esta topologia es mas adecuada cuando los servicios son manejados por las distintas unidades de negocio centralmente,
es correcto decir que el ERP y la Tienda son distintas unidades de negocio pero sin embargo no son centralizadas.

### Directly Connected ESP with multiple Registry ( Descartada )
Por la misma razon que la anterior, ya que usualmente es mas adecuada cuando las unidades de negocio estan centralizadas aunque se
accedan desde muchos puntos.

### Brokered ESB ( Descartada )
La razon para descartar esta topologia , es por razones de limitaciones en el proyecto ya que se tiene planeado tomar a cada grupo con su
implementacion de ESB y unirlos para realizar las pruebas, esta topologia necesita de un orquestador central el cual probablemente no es
viable implementar por cuestiones de tiempo y cordinacion necesaria para soportar todos los frameworks que cada grupo utilizara

### Hub and Spokes ESB ( Adecuada )
Usualmente disenada para modelos de negocio de sucursales , en la cual cada Hub tiene control de la implementacion y desplegue del ESB,
lo cual se adapta a los requerimientos del proyecto tanto en implementacion como pruebas.

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
1. Realizar suscripcion de tienda a bodega
  a. Nombre de la funcion: suscribirse
  b. Explicacion: Una tienda, con su propio id, podra suscribirse a una bodega del mismo o diferente pais para llevar a cabo los despachos al momento de que se lleve a cabo una compra.
  c. Parametros de entrada:
    - Codigo de tienda (entero)
    - Codigo de bodega (entero)
  d. Respuesta: la respuesta sera de tipo booleano, true si se pudo realizar la suscripcion y false si no.
2. Solicitar despacho
  a. Nombre de la funcion:
  b. Explicacion:
  c. Parametros de entrada:
  d. Respuesta:
3. Consultar tiempo de entrega
  a. Nombre de la funcion:
  b. Explicacion:
  c. Parametros de entrada:
  d. Respuesta:
#### PIM
#### Bodegas
### Autenticacion
#### Funciones afectadas
#### Protocolo de Autenticacion
Propongo JWT por versatilidad y disponibilidad en varios lenguajes
#### Roles y niveles de usuario a crearse
