# Descripción del Sistema de Gestión de Contenidos

Este documento describe la arquitectura, funcionalidades y tecnologías del Sistema de Gestión de Contenidos.

## 1. Arquitectura General

El sistema sigue una arquitectura cliente-servidor desacoplada, compuesta por dos componentes principales:

- **Backend:** Una API RESTful desarrollada en Node.js con el framework Express.js. Se encarga de toda la lógica de negocio, gestión de la base de datos, autenticación de usuarios y almacenamiento de archivos.
- **Frontend:** Una Single Page Application (SPA) desarrollada con React.js y Vite. Proporciona la interfaz de usuario para interactuar con el sistema, consumiendo los servicios expuestos por el backend.

Ambos componentes se encuentran en el mismo repositorio (monorepo), pero se desarrollan y despliegan de forma independiente.

## 2. Tecnologías Utilizadas

### Backend
- **Lenguaje:** JavaScript (Node.js)
- **Framework:** Express.js
- **Base de Datos:** PostgreSQL (gestionado con la librería `pg`)
- **Autenticación:** JSON Web Tokens (JWT) para sesiones seguras.
- **Manejo de Archivos:** Multer, para la subida de artículos y otros ficheros.
- **Envío de Correos:** Nodemailer, para notificaciones y recuperación de contraseñas.
- **Variables de Entorno:** `dotenv` para la gestión de configuraciones.

### Frontend
- **Librería:** React.js
- **Bundler/Build Tool:** Vite
- **Enrutamiento:** React Router DOM
- **Gestión de Estado:** React Context API (para la autenticación).
- **Estilos:** CSS puro, con archivos dedicados por componente y página.

## 3. Funcionalidades Principales

El sistema está diseñado como una plataforma para la gestión de artículos periodísticos, con un flujo de trabajo que involucra a diferentes roles de usuario.

### 3.1. Gestión de Autenticación y Usuarios
- **Registro y Login:** Los usuarios pueden registrarse y acceder al sistema con sus credenciales.
- **Recuperación de Contraseña:** Un flujo para restablecer la contraseña a través del correo electrónico.
- **Gestión de Perfil:** Los usuarios pueden ver y actualizar la información de su perfil.

### 3.2. Gestión de Roles y Permisos
- El sistema cuenta con un sistema de roles (ej. Administrador, Editor, Periodista, Fotógrafo).
- Un administrador puede crear, editar y eliminar roles, así como asignar roles a los usuarios, controlando el acceso a las diferentes funcionalidades.

### 3.3. Flujo de Artículos (Notas)
- **Creación:** Los usuarios con el rol de "Periodista" pueden crear nuevos artículos, adjuntar archivos (documentos, imágenes) y enviarlos a revisión.
- **Subida de Medios:** Los "Fotógrafos" tienen una interfaz dedicada para subir archivos multimedia.
- **Revisión:** Los "Editores" pueden ver los artículos pendientes de revisión, aprobarlos, rechazarlos o enviar comentarios para su modificación.
- **Publicación:** (Inferido) Una vez aprobados, los artículos estarían disponibles públicamente.

### 3.4. Sistema de Notificaciones
- El sistema cuenta con notificaciones internas para informar a los usuarios sobre eventos relevantes (ej. un artículo ha sido aprobado, un nuevo comentario, etc.).

### 3.5. Gestión de Contenido Adicional
- **Categorías:** Un administrador puede gestionar las categorías a las que se pueden asociar los artículos.
- **Comentarios:** (Inferido) Los usuarios pueden comentar en los artículos publicados.
- **Mensajería Interna:** El sistema parece contar con una funcionalidad de mensajería entre usuarios.

## 4. Roles de Usuario

Se pueden identificar los siguientes roles principales a partir de la estructura del código:

- **Administrador:** Tiene control total sobre el sistema. Gestiona usuarios, roles, categorías y configuraciones generales.
- **Editor:** Responsable de revisar, aprobar o rechazar el contenido enviado por los periodistas.
- **Periodista:** Encargado de la redacción y envío de artículos para su posterior revisión y publicación.
- **Fotógrafo:** Se especializa en la subida de contenido multimedia (imágenes, videos) que puede ser utilizado en los artículos.
- **Usuario Registrado (Genérico):** (Inferido) Puede tener permisos para ver el contenido publicado, comentar y gestionar su propio perfil.

Este documento proporciona una visión general del funcionamiento del sistema basada en el análisis de su código fuente.
