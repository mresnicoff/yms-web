CRM CONVERSACIONAL CON AGENDA
DOCUMENTO MAESTRO V1

=========================================================
DOCUMENTO 1 - MODELO DE DOMINIO
=========================================================

VISION DEL PRODUCTO

CRM Conversacional con Agenda.

Propuesta de valor:
Llená tu agenda automáticamente usando WhatsApp como canal principal de atención, reserva, confirmación y reactivación de clientes.

La agenda es una funcionalidad.
El verdadero producto es:
- Gestión de clientes
- Gestión de reservas
- Comunicación por WhatsApp
- Cobro de señas
- Fidelización
- Reactivación de clientes
- Automatizaciones comerciales

NICHO INICIAL
- Peluquerías
- Barberías
- Centros de estética

MULTI-TENANT
Cada comercio posee:
- WhatsApp propio
- Mercado Pago propio
- Sucursales propias
- Profesionales propios
- Clientes propios
- Agenda propia
- Conversaciones propias

ENTIDADES PRINCIPALES

Tenant
- id
- nombre
- estado
- plan

Branch
- id
- tenantId
- nombre
- direccion
- telefono

Professional
- id
- branchId
- nombre
- activo

Service
- id
- tenantId
- nombre
- precio
- duracionMinutos
- requiereSena
- tipoSena
- valorSena

ServiceProfessional
Relación entre servicios y profesionales.

Customer
- id
- tenantId
- nombre
- telefono
- email (opcional)

Regla:
telefono unico por tenant.

Appointment
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

Conversation
- id
- tenantId
- customerId

Message
- id
- conversationId
- direccion
- contenido
- fecha

=========================================================
DOCUMENTO 2 - REGLAS OPERATIVAS
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

SEÑAS

Configurables:
- monto fijo
- porcentaje

La seña se descuenta del importe final.

PAGO

Estado inicial:
PENDING_PAYMENT

Tiempo máximo para pagar:
20 minutos.

Si paga:
CONFIRMED

Si no paga:
- cancelar reserva
- liberar horario
- enviar mensaje invitando a reservar nuevamente

CANCELACIONES

Cliente:
- cancela
- pierde la seña
- libera el horario

Profesional:
- cancela
- horario bloqueado
- se ofrecerá reprogramación

Recepcionista:
- horario bloqueado

Administrador:
- horario bloqueado

OVERBOOKING

No se permite cobrar ni reservar dos veces un mismo horario.

HORARIOS

Horario regular semanal.

Excepciones:
- vacaciones
- enfermedad
- feriados
- capacitaciones

Bloqueos manuales:
- almuerzo
- reuniones
- trámites

RECORDATORIOS

Configurables por tenant.

Ejemplos:
- 72 horas antes
- 24 horas antes
- 2 horas antes

ATENCIÓN HUMANA

El cliente puede solicitar hablar con una persona.

LISTA DE ESPERA

No incluida en V1.

=========================================================
DOCUMENTO 3 - MODELO COMERCIAL Y ROADMAP
=========================================================

MODELO COMERCIAL

Suscripción mensual.

Variables:
- cantidad de profesionales
- cantidad de sucursales
- cantidad de mensajes incluidos

Excedentes:
- cargo adicional por mensajes

ROADMAP

V1
- multi-tenant
- sucursales
- profesionales
- servicios
- agenda
- WhatsApp
- Mercado Pago
- señas
- reserva automática
- recordatorios
- atención humana
- dashboard básico

V1.5
- métricas avanzadas
- historial de conversaciones
- reportes
- análisis de ausencias

V2
- IA para comprender mensajes
- reservas en lenguaje natural
- reprogramación inteligente

V3
- CRM inteligente
- campañas
- reactivación automática
- promociones
- segmentación

V4
- cross selling entre comercios
- programa de referidos
- beneficios compartidos

=========================================================
DOCUMENTO 4 - ARQUITECTURA TÉCNICA
=========================================================

STACK

Frontend:
- Next.js
- React
- TailwindCSS

Backend:
- Next.js App Router
- Route Handlers

ORM:
- Prisma

Base de datos:
- PostgreSQL

Autenticación:
- Auth.js

Hosting:
- Vercel

Mensajería:
- WhatsApp Cloud API

Pagos:
- Mercado Pago OAuth

ARQUITECTURA INICIAL

Cliente WhatsApp
↓
WhatsApp Cloud API
↓
Webhook Next.js
↓
Motor Conversacional
↓
Motor de Reservas
↓
PostgreSQL

Mercado Pago
↓
Webhook Next.js
↓
Motor de Pagos
↓
PostgreSQL

MÓDULOS

/modules
- auth
- tenant
- branch
- professional
- service
- customer
- booking
- whatsapp
- payments
- analytics
- campaigns

ESCALABILIDAD

Fase 1
- monolito modular en Next.js

Fase 2
- colas para mensajes y eventos

Fase 3
- workers separados

Fase 4
- servicios independientes si fuera necesario

EVENTOS FUTUROS

- appointment.created
- appointment.confirmed
- appointment.cancelled
- payment.approved
- payment.rejected
- customer.reactivated

ONBOARDING DEL CLIENTE

1. Registro.
2. Creación de tenant.
3. Conexión de WhatsApp.
4. Conexión de Mercado Pago.
5. Alta de sucursales.
6. Alta de profesionales.
7. Definición de servicios.
8. Definición de horarios.
9. Inicio de operación.

VISIÓN FINAL

WhatsApp
↓
Reserva
↓
Pago
↓
CRM
↓
Automatización
↓
Fidelización
↓
Reactivación
