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

### Directly Connected ESB with Single Registry ( Probablemente Descartada )
Debido a que esta topologia es mas adecuada cuando los servicios son manejados por las distintas unidades de negocio centralmente,
es correcto decir que el ERP y la Tienda son distintas unidades de negocio pero sin embargo no son centralizadas.

### Directly Connected ESP with multiple Registry ( Probablemente Descartada )
Por la misma razon que la anterior, ya que usualmente es mas adecuada cuando las unidades de negocio estan centralizadas aunque se
accedan desde muchos puntos.

### Brokered ESB ( Probablemente Descartada )
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

