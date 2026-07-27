YMS - MASTER DOCUMENT
================================================== OBJETIVO

Desarrollar un Yard Management System (YMS) para gestionar:

Reserva de turnos
Ingreso de camiones
Cola FIFO
Asignación de docks
Operaciones de carga y descarga
Liberación automática de docks
Reasignación automática

El objetivo es administrar el flujo completo:

Proveedor ↓ Reserva ↓ Llegada ↓ Check-In ↓ Cola ↓ Asignación Dock ↓ Operación ↓ Salida

================================================== ARQUITECTURA OPERATIVA

Warehouse | v DockGroup | v Dock

Ejemplo:

CD-BA

MP

D01
D02
D03

PT

D04
D05
================================================== ENTIDADES PRINCIPALES

Warehouse

Centro logístico.

DockGroup

Agrupa docks de una misma operación.

Dock

Muelle físico.

Estados:

FREE
OCCUPIED
OUT_OF_SERVICE

VehicleType

Define duración estándar.

Ejemplo:

SEMI LOAD = 45 min UNLOAD = 60 min

BITREN LOAD = 60 min UNLOAD = 90 min

Supplier

Empresa que solicita turno.

Truck

Camión físico.

User

Usuario autenticado.
================================================== ROLES

ADMIN

Acceso total.

PLANNER

Crear turnos
Consultar disponibilidad
Ver appointments
Ejecutar Check-In (habilitado para demo)

SUPPLIER

Crear appointments
Ver únicamente sus appointments

GATE_OPERATOR

Ejecutar Check-In

YARD_OPERATOR

Administrar cola
Asignar dock
Finalizar operación
================================================== AUTENTICACION

Implementado.

Características:

Login
JWT
Auth Middleware
Role Middleware

Endpoint:

POST /api/auth/login

Endpoint:

GET /api/auth/me

================================================== SUPPLIER ISOLATION

Implementado.

Si:

user.role === SUPPLIER

el backend ignora:

req.body.supplierId

y utiliza:

req.user.supplierId

Esto evita que un proveedor reserve para otro.

================================================== SLOT ENGINE

Implementado.

Endpoint:

GET /api/slots/availability

Parámetros:

dockGroupId
vehicleTypeId
operationType
date

Devuelve:

capacity
reserved
available
================================================== CAPACITY

Capacity:

Cantidad de docks activos del DockGroup.

Ejemplo:

MP

D01 D02

Capacity = 2

================================================== NO OVERBOOKING

Implementado.

Si:

available = 0

la reserva es rechazada.

Error:

No capacity available for this slot

================================================== APPOINTMENT

Representa una reserva.

Contiene:

Supplier
VehicleType
Warehouse
DockGroup
OperationType
StartTime
EndTime
Status
================================================== ESTADOS DE APPOINTMENT

Disponibles:

SCHEDULED
CHECKED_IN
WAITING_DOCK
IN_OPERATION
COMPLETED
CANCELLED
NO_SHOW

Flujo actual implementado:

SCHEDULED | v WAITING_DOCK | v IN_OPERATION | v COMPLETED

================================================== CHECK IN

Backend existente.

Endpoint:

POST /api/checkins

Controller existente.

Service existente.

================================================== LOGICA DE CHECK IN

Recibe:

appointmentId
truckId
createdById

Validaciones:

Appointment debe existir

Appointment debe estar:

SCHEDULED

Si no:

Error

================================================== AL EJECUTAR CHECK IN

Se crea:

CheckIn

Con:

appointmentId
truckId
createdById
arrivalTime

Luego:

Appointment

cambia:

SCHEDULED ↓ WAITING_DOCK

================================================== IMPORTANTE

Check-In NO asigna Dock.

Check-In solamente registra llegada.

El camión entra a la cola.

================================================== COLA FIFO

No existe tabla Queue.

La cola se construye usando:

Appointment.status = WAITING_DOCK

y

CheckIn.arrivalTime

Orden:

ASC

Regla:

Primer camión que ingresó

Primer camión que recibe dock

================================================== CONSULTA DE COLA

Endpoint:

GET /api/dock-operations/queue/:dockGroupId

Devuelve:

Camiones esperando
Orden FIFO
================================================== ASIGNACION DE DOCK

Endpoint:

POST /api/dock-operations/assign

Proceso:

Buscar Dock FREE
Crear DockOperation
Cambiar Dock → OCCUPIED
Cambiar Appointment → IN_OPERATION
================================================== DOCK OPERATION

Estados:

ASSIGNED
FINISHED
================================================== FINALIZACION

Endpoint:

POST /api/dock-operations/finish

Proceso:

DockOperation → FINISHED
Dock → FREE
Appointment → COMPLETED
================================================== REASIGNACION AUTOMATICA

Implementada.

Cuando un dock se libera:

Buscar primer WAITING_DOCK
Mismo DockGroup
Crear DockOperation
Occupy Dock
Appointment → IN_OPERATION
================================================== FRONTEND IMPLEMENTADO

Login

✅

JWT

✅

Roles

✅

Dashboard

✅

Sidebar por rol

✅

Appointments

✅

Appointment Form

✅

Slots visuales

✅

Capacity control

✅

Supplier isolation

✅

Check-In Menu

✅

CheckIn Page

⚠️ Placeholder únicamente

Queue Page

⚠️ Placeholder

Docks Page

⚠️ Placeholder

================================================== APPOINTMENT UI

Implementado.

Flujo:

Seleccionar:

Supplier
VehicleType
Warehouse
DockGroup
OperationType
Fecha

↓

Consultar disponibilidad

↓

Mostrar slots

↓

Seleccionar slot

↓

Reservar

================================================== OBSERVACIONES UX

Pendiente:

Conservar filtros luego de reservar.

Hoy:

Reserva ↓ Se limpia formulario

Deseado:

Reserva ↓ Mantener:

Supplier
Warehouse
DockGroup
Date

Limpiar únicamente:

startTime
================================================== MODULO CHECK IN

Objetivo MVP Frontend

Crear pantalla:

CheckInPage

================================================== CHECK IN PAGE

Mostrar:

Appointments

donde:

status = SCHEDULED

================================================== TABLA

Columnas:

Fecha
Hora
Proveedor
Operación
Estado
Acción

Acción:

Check-In

================================================== FLUJO VISUAL

SCHEDULED

↓

Check-In

↓

WAITING_DOCK

↓

Desaparece de la lista

================================================== PROBLEMA ACTUAL

El backend exige:

truckId

para registrar Check-In.

Actualmente no existe módulo Trucks en Frontend.

================================================== DECISION FUNCIONAL

NO solicitar camión durante la reserva.

Appointment representa:

Reserva

NO

Camión específico.

================================================== FLUJO CORRECTO

Supplier

↓

Crea Appointment

↓

Appointment = SCHEDULED

↓

Camión llega físicamente

↓

Check-In

↓

Se carga Camión real

↓

WAITING_DOCK

================================================== MODULO TRUCKS

PENDIENTE

Backend

Crear:

GET /api/trucks

POST /api/trucks

PUT /api/trucks/:id

DELETE /api/trucks/:id

Entidad:

Truck

Campos sugeridos:

id
plate
supplierId
vehicleTypeId
active
================================================== TRUCK UI

Página:

TrucksPage

Funcionalidades:

Alta
Modificación
Baja
Listado
================================================== CHECK IN FUTURO

Flujo deseado:

Appointment SCHEDULED

↓

Click Check-In

↓

Modal

Campos:

Truck

↓

Guardar

↓

POST /api/checkins

↓

WAITING_DOCK

================================================== ESTADO REAL DEL PROYECTO

Backend

✅ MVP operativo completo

Frontend

✅ Authentication

✅ Appointments

✅ Slot Selection

✅ Capacity Validation

✅ Supplier Isolation

🟡 Check-In UI pendiente

🟡 Queue UI pendiente

🟡 Dock Operations UI pendiente

================================================== PROXIMO PASO RECOMENDADO

Implementar CheckInPage

Mostrar Appointments SCHEDULED

Permitir seleccionar Truck

Ejecutar POST /api/checkins

Refrescar pantalla

Mostrar WAITING_DOCK en Queue

================================================== ESTADO GENERAL

BACKEND MVP COMPLETO

FRONTEND APPOINTMENTS COMPLETO

SIGUIENTE MODULO: CHECK-IN