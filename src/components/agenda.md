=========================================================
CRM CONVERSACIONAL CON AGENDA
Documento de Definición Inicial
Versión 1
=========================================================

VISION DEL PRODUCTO

Nombre de trabajo:
CRM Conversacional con Agenda

Propuesta de Valor

"Llená tu agenda automáticamente usando WhatsApp como
canal principal de atención, reserva, confirmación y
reactivación de clientes."

La agenda es una funcionalidad.

El verdadero producto es:

- Gestión de clientes
- Gestión de reservas
- Comunicación por WhatsApp
- Cobro de señas
- Fidelización
- Reactivación de clientes
- Automatizaciones comerciales

=========================================================
DOCUMENTO 1
MODELO DE DOMINIO
=========================================================

NICHO INICIAL

Incluidos en V1

- Peluquerías
- Barberías
- Centros de estética

No incluidos inicialmente

- Consultorios médicos
- Psicólogos
- Gimnasios
- Yoga grupal
- Actividades con cupos

---------------------------------------------------------
ARQUITECTURA DE NEGOCIO
---------------------------------------------------------

La aplicación es Multi-Tenant.

Cada comercio opera de forma independiente.

Cada Tenant posee:

- Su WhatsApp propio
- Su Mercado Pago propio
- Sus sucursales
- Sus profesionales
- Sus clientes
- Su agenda
- Sus conversaciones

---------------------------------------------------------
ENTIDADES
---------------------------------------------------------

TENANT

Representa una empresa.

Ejemplo:

Peluquería XYZ

Campos:

- id
- nombre
- estado
- plan

---------------------------------------------------------

BRANCH

Representa una sucursal.

Ejemplos:

- Palermo
- Belgrano
- Caballito

Campos:

- id
- tenantId
- nombre
- dirección
- teléfono

---------------------------------------------------------

PROFESSIONAL

Representa un profesional que atiende clientes.

Ejemplos:

- Juan
- Ana
- Pedro

Campos:

- id
- branchId
- nombre
- activo

---------------------------------------------------------

SERVICE

Representa un servicio.

Ejemplos:

- Corte
- Barba
- Coloración
- Alisado

Campos:

- id
- tenantId
- nombre
- precio
- duracionMinutos

Configuraciones:

- requiereSeña
- tipoSeña
- valorSeña

---------------------------------------------------------

SERVICE_PROFESSIONAL

Define qué servicios realiza cada profesional.

Ejemplos:

Juan:
- Corte
- Barba

Ana:
- Color
- Alisado

---------------------------------------------------------

CUSTOMER

Cliente final.

Campos:

- id
- tenantId
- nombre
- telefono
- email

Regla:

telefono único por tenant.

El teléfono es el identificador principal.

---------------------------------------------------------

APPOINTMENT

Representa un turno.

Campos:

- id
- tenantId
- branchId
- professionalId
- customerId
- serviceId
- inicio
- fin
- estado

Estados:

- PENDING_PAYMENT
- CONFIRMED
- CANCELLED
- NO_SHOW
- COMPLETED

---------------------------------------------------------

CONVERSATION

Representa una conversación de WhatsApp.

Campos:

- id
- tenantId
- customerId

---------------------------------------------------------

MESSAGE

Representa un mensaje.

Campos:

- id
- conversationId
- dirección
- contenido
- fecha

Todo el historial queda almacenado.

=========================================================
DOCUMENTO 2
REGLAS OPERATIVAS Y FLUJOS
=========================================================

FLUJO PRINCIPAL

Cliente escribe por WhatsApp
↓
Sistema identifica cliente
↓
Sistema identifica servicio
↓
Sistema consulta disponibilidad
↓
Cliente selecciona horario
↓
Se genera reserva
↓
Se solicita seña
↓
Pago aprobado
↓
Reserva confirmada

---------------------------------------------------------
SEÑAS
---------------------------------------------------------

Las señas son configurables.

Opciones:

1. Monto fijo
2. Porcentaje del servicio

Ejemplos:

$5.000

o

20%

La seña se descuenta del precio final.

---------------------------------------------------------
POLÍTICA DE PAGO
---------------------------------------------------------

Al crear una reserva:

Estado:

PENDING_PAYMENT

Tiempo para completar pago:

20 minutos

Si paga:

CONFIRMED

Si no paga:

- Cancelar reserva
- Liberar horario
- Enviar mensaje para intentar reprogramar

---------------------------------------------------------
POLÍTICA DE CANCELACIÓN
---------------------------------------------------------

CLIENTE CANCELA

Resultado:

- Turno cancelado
- Horario liberado
- Se pierde la seña

---------------------------------------------------------

PROFESIONAL CANCELA

Resultado:

- Turno cancelado
- Horario bloqueado
- El sistema deberá ofrecer reprogramación

---------------------------------------------------------

RECEPCIONISTA CANCELA

Resultado:

- Turno cancelado
- Horario bloqueado

---------------------------------------------------------

ADMINISTRADOR CANCELA

Resultado:

- Turno cancelado
- Horario bloqueado

---------------------------------------------------------
SOBRERESERVAS
---------------------------------------------------------

No está permitido cobrar dos veces el mismo turno.

Debe existir protección transaccional para evitar:

- doble reserva
- doble cobro

El horario debe quedar reservado temporalmente durante
el proceso de pago.

---------------------------------------------------------
HORARIOS
---------------------------------------------------------

Cada profesional posee:

Horario semanal regular

Ejemplo:

Lunes a Viernes
09:00 a 18:00

---------------------------------------------------------

Excepciones

- Vacaciones
- Enfermedad
- Feriados
- Capacitaciones

---------------------------------------------------------

Bloqueos manuales

Ejemplos:

- Almuerzo
- Reuniones
- Trámites
- Ausencias personales

---------------------------------------------------------
RECORDATORIOS
---------------------------------------------------------

Configurables por comercio.

Ejemplos:

- 72 horas antes
- 24 horas antes
- 2 horas antes

---------------------------------------------------------
CONFIRMACIÓN POR WHATSAPP
---------------------------------------------------------

Ejemplo:

Tu turno es mañana a las 15:00.

1 Confirmar
2 Cancelar

---------------------------------------------------------
ATENCIÓN HUMANA
---------------------------------------------------------

El cliente puede solicitar:

"Hablar con una persona"

La conversación pasa a un operador humano.

---------------------------------------------------------
LISTA DE ESPERA
---------------------------------------------------------

No forma parte de V1.

Se deja preparado el modelo para futuras versiones.

=========================================================
DOCUMENTO 3
MODELO COMERCIAL Y ROADMAP
=========================================================

MODELO DE NEGOCIO

Suscripción mensual.

Variables de precio:

- Cantidad de profesionales
- Cantidad de sucursales
- Cantidad de mensajes incluidos

---------------------------------------------------------

Ejemplo conceptual

PLAN STARTER

- 1 sucursal
- Hasta X profesionales
- Hasta X mensajes

---------------------------------------------------------

PLAN BUSINESS

- Varias sucursales
- Más profesionales
- Más mensajes

---------------------------------------------------------

EXCEDENTES

Si se supera la cantidad de mensajes incluida:

- Se cobra un adicional

---------------------------------------------------------
ROADMAP
---------------------------------------------------------

V1

Objetivo:

Resolver perfectamente la reserva por WhatsApp.

Incluye:

- Multi-Tenant
- Sucursales
- Profesionales
- Servicios
- Agenda
- WhatsApp
- Mercado Pago
- Señas
- Reserva automática
- Recordatorios
- Atención humana
- Dashboard básico
- Reportes básicos

---------------------------------------------------------

V1.5

Incluye:

- Métricas avanzadas
- Historial de conversaciones
- Análisis de ausencias
- Reportes de clientes
- Reportes de profesionales

---------------------------------------------------------

V2

IA

Incluye:

- Interpretación de mensajes
- Reserva conversacional libre
- Reprogramación inteligente
- Comprensión de lenguaje natural

Ejemplo:

"Quiero un turno mañana después del trabajo"

---------------------------------------------------------

V3

CRM Inteligente

Incluye:

- Reactivación de clientes
- Campañas por WhatsApp
- Segmentación automática
- Cumpleaños
- Promociones automáticas

---------------------------------------------------------

V4

Red Comercial

Incluye:

- Cross-selling entre comercios
- Programa de referidos
- Beneficios compartidos
- Ecosistema de negocios asociados

=========================================================
VISION FINAL
=========================================================

WhatsApp
↓
Reserva
↓
Pago
↓
CRM
↓
Automatizaciones
↓
Fidelización
↓
Reactivación

La agenda administra el presente.

El CRM construye el valor futuro del negocio.