\--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: adjuntos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.adjuntos (
    id_adjunto integer NOT NULL,
    articulo_id integer,
    tipo_archivo character varying(50),
    ruta_archivo character varying(255),
    fecha timestamp without time zone
);


ALTER TABLE public.adjuntos OWNER TO postgres;

--
-- Name: adjuntos_id_adjunto_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.adjuntos_id_adjunto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.adjuntos_id_adjunto_seq OWNER TO postgres;

--
-- Name: adjuntos_id_adjunto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.adjuntos_id_adjunto_seq OWNED BY public.adjuntos.id_adjunto;


--
-- Name: archivossistema; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.archivossistema (
    id_archivo integer NOT NULL,
    tipo character varying(50),
    ruta character varying(255),
    "tamaño" character varying(50),
    fecha_subida timestamp without time zone,
    entidad_asociada character varying(100),
    referencia_id integer,
    usuario_propietario_id integer
);


ALTER TABLE public.archivossistema OWNER TO postgres;

--
-- Name: archivossistema_id_archivo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.archivossistema_id_archivo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.archivossistema_id_archivo_seq OWNER TO postgres;

--
-- Name: archivossistema_id_archivo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.archivossistema_id_archivo_seq OWNED BY public.archivossistema.id_archivo;


--
-- Name: articulos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.articulos (
    id_articulo integer NOT NULL,
    titulo character varying(255),
    cuerpo text,
    estado character varying(50),
    fecha_creacion timestamp without time zone,
    fecha_modificacion timestamp without time zone,
    periodista_id integer,
    categoria_id integer
);


ALTER TABLE public.articulos OWNER TO postgres;

--
-- Name: articulos_id_articulo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.articulos_id_articulo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.articulos_id_articulo_seq OWNER TO postgres;

--
-- Name: articulos_id_articulo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.articulos_id_articulo_seq OWNED BY public.articulos.id_articulo;


--
-- Name: backups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.backups (
    id_backup integer NOT NULL,
    descripcion character varying(255),
    fecha timestamp without time zone,
    ruta_archivo character varying(255),
    generado_por integer
);


ALTER TABLE public.backups OWNER TO postgres;

--
-- Name: backups_id_backup_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.backups_id_backup_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.backups_id_backup_seq OWNER TO postgres;

--
-- Name: backups_id_backup_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.backups_id_backup_seq OWNED BY public.backups.id_backup;


--
-- Name: categorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorias (
    id_categoria integer NOT NULL,
    nombre character varying(100),
    descripcion character varying(255)
);


ALTER TABLE public.categorias OWNER TO postgres;

--
-- Name: categorias_id_categoria_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categorias_id_categoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categorias_id_categoria_seq OWNER TO postgres;

--
-- Name: categorias_id_categoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categorias_id_categoria_seq OWNED BY public.categorias.id_categoria;


--
-- Name: colaboraciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.colaboraciones (
    id_colaboracion integer NOT NULL,
    articulo_id integer,
    colaborador_id integer
);


ALTER TABLE public.colaboraciones OWNER TO postgres;

--
-- Name: colaboraciones_id_colaboracion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.colaboraciones_id_colaboracion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.colaboraciones_id_colaboracion_seq OWNER TO postgres;

--
-- Name: colaboraciones_id_colaboracion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.colaboraciones_id_colaboracion_seq OWNED BY public.colaboraciones.id_colaboracion;


--
-- Name: comentarioseditor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comentarioseditor (
    id_comentario integer NOT NULL,
    articulo_id integer,
    editor_id integer,
    comentario text,
    fecha timestamp without time zone
);


ALTER TABLE public.comentarioseditor OWNER TO postgres;

--
-- Name: comentarioseditor_id_comentario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comentarioseditor_id_comentario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comentarioseditor_id_comentario_seq OWNER TO postgres;

--
-- Name: comentarioseditor_id_comentario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comentarioseditor_id_comentario_seq OWNED BY public.comentarioseditor.id_comentario;


--
-- Name: eventos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.eventos (
    id_evento integer NOT NULL,
    nombre character varying(255),
    descripcion text,
    fecha timestamp without time zone
);


ALTER TABLE public.eventos OWNER TO postgres;

--
-- Name: eventos_id_evento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.eventos_id_evento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.eventos_id_evento_seq OWNER TO postgres;

--
-- Name: eventos_id_evento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.eventos_id_evento_seq OWNED BY public.eventos.id_evento;


--
-- Name: fotos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fotos (
    id_foto integer NOT NULL,
    tipo_archivo character varying(50),
    titulo character varying(255),
    descripcion text,
    fecha timestamp without time zone,
    fotografo_id integer,
    categoria_id integer,
    evento_id integer
);


ALTER TABLE public.fotos OWNER TO postgres;

--
-- Name: fotos_id_foto_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fotos_id_foto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fotos_id_foto_seq OWNER TO postgres;

--
-- Name: fotos_id_foto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fotos_id_foto_seq OWNED BY public.fotos.id_foto;


--
-- Name: fotos_usadas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fotos_usadas (
    id_foto_usada integer NOT NULL,
    foto_id integer,
    articulo_id integer,
    usuario_uso_id integer
);


ALTER TABLE public.fotos_usadas OWNER TO postgres;

--
-- Name: fotos_usadas_id_foto_usada_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fotos_usadas_id_foto_usada_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fotos_usadas_id_foto_usada_seq OWNER TO postgres;

--
-- Name: fotos_usadas_id_foto_usada_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fotos_usadas_id_foto_usada_seq OWNED BY public.fotos_usadas.id_foto_usada;


--
-- Name: logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.logs (
    id_log integer NOT NULL,
    usuario_id integer,
    accion character varying(255),
    descripcion text,
    fecha timestamp without time zone
);


ALTER TABLE public.logs OWNER TO postgres;

--
-- Name: logs_id_log_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.logs_id_log_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.logs_id_log_seq OWNER TO postgres;

--
-- Name: logs_id_log_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.logs_id_log_seq OWNED BY public.logs.id_log;


--
-- Name: notificaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notificaciones (
    id_notificacion integer NOT NULL,
    titulo character varying(255),
    mensaje text,
    usuario_destino_id integer,
    leido boolean DEFAULT false,
    fecha timestamp without time zone
);


ALTER TABLE public.notificaciones OWNER TO postgres;

--
-- Name: notificaciones_id_notificacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notificaciones_id_notificacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notificaciones_id_notificacion_seq OWNER TO postgres;

--
-- Name: notificaciones_id_notificacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notificaciones_id_notificacion_seq OWNED BY public.notificaciones.id_notificacion;


--
-- Name: permisos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permisos (
    id_permiso integer NOT NULL,
    nombre character varying(50),
    descripcion character varying(255)
);


ALTER TABLE public.permisos OWNER TO postgres;

--
-- Name: permisos_id_permiso_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permisos_id_permiso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permisos_id_permiso_seq OWNER TO postgres;

--
-- Name: permisos_id_permiso_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permisos_id_permiso_seq OWNED BY public.permisos.id_permiso;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id_rol integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(255)
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_rol_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_rol_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_rol_seq OWNER TO postgres;

--
-- Name: roles_id_rol_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_rol_seq OWNED BY public.roles.id_rol;


--
-- Name: roles_permisos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles_permisos (
    id_rol integer NOT NULL,
    id_permiso integer NOT NULL
);


ALTER TABLE public.roles_permisos OWNER TO postgres;

--
-- Name: tokensrecuperacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tokensrecuperacion (
    id_token integer NOT NULL,
    usuario_id integer,
    token character varying(255),
    fecha_creacion timestamp without time zone,
    fecha_expiracion timestamp without time zone,
    usado boolean DEFAULT false
);


ALTER TABLE public.tokensrecuperacion OWNER TO postgres;

--
-- Name: tokensrecuperacion_id_token_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tokensrecuperacion_id_token_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tokensrecuperacion_id_token_seq OWNER TO postgres;

--
-- Name: tokensrecuperacion_id_token_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tokensrecuperacion_id_token_seq OWNED BY public.tokensrecuperacion.id_token;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id_usuario integer NOT NULL,
    nombre character varying(100),
    apellido character varying(100),
    usuario character varying(100),
    "contraseña" character varying(255),
    rol_id integer,
    categoria_id integer,
    activo boolean DEFAULT true,
    email character varying(100)
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_usuario_seq OWNER TO postgres;

--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_usuario_seq OWNED BY public.usuarios.id_usuario;


--
-- Name: versionesarticulo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.versionesarticulo (
    id_version integer NOT NULL,
    articulo_id integer,
    contenido text,
    fecha timestamp without time zone
);


ALTER TABLE public.versionesarticulo OWNER TO postgres;

--
-- Name: versionesarticulo_id_version_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.versionesarticulo_id_version_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.versionesarticulo_id_version_seq OWNER TO postgres;

--
-- Name: versionesarticulo_id_version_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.versionesarticulo_id_version_seq OWNED BY public.versionesarticulo.id_version;


--
-- Name: adjuntos id_adjunto; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adjuntos ALTER COLUMN id_adjunto SET DEFAULT nextval('public.adjuntos_id_adjunto_seq'::regclass);


--
-- Name: archivossistema id_archivo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.archivossistema ALTER COLUMN id_archivo SET DEFAULT nextval('public.archivossistema_id_archivo_seq'::regclass);


--
-- Name: articulos id_articulo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articulos ALTER COLUMN id_articulo SET DEFAULT nextval('public.articulos_id_articulo_seq'::regclass);


--
-- Name: backups id_backup; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.backups ALTER COLUMN id_backup SET DEFAULT nextval('public.backups_id_backup_seq'::regclass);


--
-- Name: categorias id_categoria; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias ALTER COLUMN id_categoria SET DEFAULT nextval('public.categorias_id_categoria_seq'::regclass);


--
-- Name: colaboraciones id_colaboracion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colaboraciones ALTER COLUMN id_colaboracion SET DEFAULT nextval('public.colaboraciones_id_colaboracion_seq'::regclass);


--
-- Name: comentarioseditor id_comentario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comentarioseditor ALTER COLUMN id_comentario SET DEFAULT nextval('public.comentarioseditor_id_comentario_seq'::regclass);


--
-- Name: eventos id_evento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos ALTER COLUMN id_evento SET DEFAULT nextval('public.eventos_id_evento_seq'::regclass);


--
-- Name: fotos id_foto; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fotos ALTER COLUMN id_foto SET DEFAULT nextval('public.fotos_id_foto_seq'::regclass);


--
-- Name: fotos_usadas id_foto_usada; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fotos_usadas ALTER COLUMN id_foto_usada SET DEFAULT nextval('public.fotos_usadas_id_foto_usada_seq'::regclass);


--
-- Name: logs id_log; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs ALTER COLUMN id_log SET DEFAULT nextval('public.logs_id_log_seq'::regclass);


--
-- Name: notificaciones id_notificacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificaciones ALTER COLUMN id_notificacion SET DEFAULT nextval('public.notificaciones_id_notificacion_seq'::regclass);


--
-- Name: permisos id_permiso; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permisos ALTER COLUMN id_permiso SET DEFAULT nextval('public.permisos_id_permiso_seq'::regclass);


--
-- Name: roles id_rol; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id_rol SET DEFAULT nextval('public.roles_id_rol_seq'::regclass);


--
-- Name: tokensrecuperacion id_token; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokensrecuperacion ALTER COLUMN id_token SET DEFAULT nextval('public.tokensrecuperacion_id_token_seq'::regclass);


--
-- Name: usuarios id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuarios_id_usuario_seq'::regclass);


--
-- Name: versionesarticulo id_version; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.versionesarticulo ALTER COLUMN id_version SET DEFAULT nextval('public.versionesarticulo_id_version_seq'::regclass);


--
-- Data for Name: adjuntos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.adjuntos (id_adjunto, articulo_id, tipo_archivo, ruta_archivo, fecha) FROM stdin;
\.


--
-- Data for Name: archivossistema; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.archivossistema (id_archivo, tipo, ruta, "tamaño", fecha_subida, entidad_asociada, referencia_id, usuario_propietario_id) FROM stdin;
\.


--
-- Data for Name: articulos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.articulos (id_articulo, titulo, cuerpo, estado, fecha_creacion, fecha_modificacion, periodista_id, categoria_id) FROM stdin;
\.


--
-- Data for Name: backups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.backups (id_backup, descripcion, fecha, ruta_archivo, generado_por) FROM stdin;
\.


--
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categorias (id_categoria, nombre, descripcion) FROM stdin;
1	General	Categoría general de usuarios
\.


--
-- Data for Name: colaboraciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.colaboraciones (id_colaboracion, articulo_id, colaborador_id) FROM stdin;
\.


--
-- Data for Name: comentarioseditor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comentarioseditor (id_comentario, articulo_id, editor_id, comentario, fecha) FROM stdin;
\.


--
-- Data for Name: eventos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.eventos (id_evento, nombre, descripcion, fecha) FROM stdin;
\.


--
-- Data for Name: fotos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fotos (id_foto, tipo_archivo, titulo, descripcion, fecha, fotografo_id, categoria_id, evento_id) FROM stdin;
\.


--
-- Data for Name: fotos_usadas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fotos_usadas (id_foto_usada, foto_id, articulo_id, usuario_uso_id) FROM stdin;
\.


--
-- Data for Name: logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.logs (id_log, usuario_id, accion, descripcion, fecha) FROM stdin;
\.


--
-- Data for Name: notificaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notificaciones (id_notificacion, titulo, mensaje, usuario_destino_id, leido, fecha) FROM stdin;
\.


--
-- Data for Name: permisos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permisos (id_permiso, nombre, descripcion) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id_rol, nombre, descripcion) FROM stdin;
1	administrador	Administrador del sistema
\.


--
-- Data for Name: roles_permisos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles_permisos (id_rol, id_permiso) FROM stdin;
\.


--
-- Data for Name: tokensrecuperacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tokensrecuperacion (id_token, usuario_id, token, fecha_creacion, fecha_expiracion, usado) FROM stdin;
1	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c3VhcmlvIjoxLCJpYXQiOjE3NTIzMDA2NjEsImV4cCI6MTc1MjMwNDI2MX0.GwEwMQA57UBbkjhM1OA37BrIickXnv5NA83qzOLdeJU	2025-07-12 03:11:01.175892	2025-07-12 04:11:01.175892	t
2	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c3VhcmlvIjoxLCJpYXQiOjE3NTIzMDA4MzIsImV4cCI6MTc1MjMwNDQzMn0.6Y_b9JNyHudL-PxjLoJPeytn7XpcB4YAsF3WworK81s	2025-07-12 03:13:52.658856	2025-07-12 04:13:52.658856	t
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id_usuario, nombre, apellido, usuario, "contraseña", rol_id, categoria_id, activo, email) FROM stdin;
1	Martín	Peralta	admin	$2b$10$wGLmGweMqp85rHHaMA0aUO7qjtaG5yAR5RVZvBecAldIy6IFkWOTW	1	1	t	martinprlt02@gmail.com
\.


--
-- Data for Name: versionesarticulo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.versionesarticulo (id_version, articulo_id, contenido, fecha) FROM stdin;
\.


--
-- Name: adjuntos_id_adjunto_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.adjuntos_id_adjunto_seq', 1, false);


--
-- Name: archivossistema_id_archivo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.archivossistema_id_archivo_seq', 1, false);


--
-- Name: articulos_id_articulo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.articulos_id_articulo_seq', 1, false);


--
-- Name: backups_id_backup_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.backups_id_backup_seq', 1, false);


--
-- Name: categorias_id_categoria_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorias_id_categoria_seq', 1, true);


--
-- Name: colaboraciones_id_colaboracion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.colaboraciones_id_colaboracion_seq', 1, false);


--
-- Name: comentarioseditor_id_comentario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comentarioseditor_id_comentario_seq', 1, false);


--
-- Name: eventos_id_evento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.eventos_id_evento_seq', 1, false);


--
-- Name: fotos_id_foto_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.fotos_id_foto_seq', 1, false);


--
-- Name: fotos_usadas_id_foto_usada_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.fotos_usadas_id_foto_usada_seq', 1, false);


--
-- Name: logs_id_log_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.logs_id_log_seq', 1, false);


--
-- Name: notificaciones_id_notificacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notificaciones_id_notificacion_seq', 1, false);


--
-- Name: permisos_id_permiso_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permisos_id_permiso_seq', 1, false);


--
-- Name: roles_id_rol_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_rol_seq', 1, true);


--
-- Name: tokensrecuperacion_id_token_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tokensrecuperacion_id_token_seq', 2, true);


--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_usuario_seq', 1, true);


--
-- Name: versionesarticulo_id_version_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.versionesarticulo_id_version_seq', 1, false);


--
-- Name: adjuntos adjuntos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adjuntos
    ADD CONSTRAINT adjuntos_pkey PRIMARY KEY (id_adjunto);


--
-- Name: archivossistema archivossistema_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.archivossistema
    ADD CONSTRAINT archivossistema_pkey PRIMARY KEY (id_archivo);


--
-- Name: articulos articulos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articulos
    ADD CONSTRAINT articulos_pkey PRIMARY KEY (id_articulo);


--
-- Name: backups backups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.backups
    ADD CONSTRAINT backups_pkey PRIMARY KEY (id_backup);


--
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (id_categoria);


--
-- Name: colaboraciones colaboraciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colaboraciones
    ADD CONSTRAINT colaboraciones_pkey PRIMARY KEY (id_colaboracion);


--
-- Name: comentarioseditor comentarioseditor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comentarioseditor
    ADD CONSTRAINT comentarioseditor_pkey PRIMARY KEY (id_comentario);


--
-- Name: eventos eventos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos
    ADD CONSTRAINT eventos_pkey PRIMARY KEY (id_evento);


--
-- Name: fotos fotos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fotos
    ADD CONSTRAINT fotos_pkey PRIMARY KEY (id_foto);


--
-- Name: fotos_usadas fotos_usadas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fotos_usadas
    ADD CONSTRAINT fotos_usadas_pkey PRIMARY KEY (id_foto_usada);


--
-- Name: logs logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_pkey PRIMARY KEY (id_log);


--
-- Name: notificaciones notificaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT notificaciones_pkey PRIMARY KEY (id_notificacion);


--
-- Name: permisos permisos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permisos
    ADD CONSTRAINT permisos_pkey PRIMARY KEY (id_permiso);


--
-- Name: roles_permisos roles_permisos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles_permisos
    ADD CONSTRAINT roles_permisos_pkey PRIMARY KEY (id_rol, id_permiso);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id_rol);


--
-- Name: tokensrecuperacion tokensrecuperacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokensrecuperacion
    ADD CONSTRAINT tokensrecuperacion_pkey PRIMARY KEY (id_token);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);


--
-- Name: usuarios usuarios_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_usuario_key UNIQUE (usuario);


--
-- Name: versionesarticulo versionesarticulo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.versionesarticulo
    ADD CONSTRAINT versionesarticulo_pkey PRIMARY KEY (id_version);


--
-- Name: adjuntos adjuntos_articulo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adjuntos
    ADD CONSTRAINT adjuntos_articulo_id_fkey FOREIGN KEY (articulo_id) REFERENCES public.articulos(id_articulo);


--
-- Name: archivossistema archivossistema_usuario_propietario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.archivossistema
    ADD CONSTRAINT archivossistema_usuario_propietario_id_fkey FOREIGN KEY (usuario_propietario_id) REFERENCES public.usuarios(id_usuario);


--
-- Name: articulos articulos_categoria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articulos
    ADD CONSTRAINT articulos_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias(id_categoria);


--
-- Name: articulos articulos_periodista_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articulos
    ADD CONSTRAINT articulos_periodista_id_fkey FOREIGN KEY (periodista_id) REFERENCES public.usuarios(id_usuario);


--
-- Name: backups backups_generado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.backups
    ADD CONSTRAINT backups_generado_por_fkey FOREIGN KEY (generado_por) REFERENCES public.usuarios(id_usuario);


--
-- Name: colaboraciones colaboraciones_articulo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colaboraciones
    ADD CONSTRAINT colaboraciones_articulo_id_fkey FOREIGN KEY (articulo_id) REFERENCES public.articulos(id_articulo);


--
-- Name: colaboraciones colaboraciones_colaborador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colaboraciones
    ADD CONSTRAINT colaboraciones_colaborador_id_fkey FOREIGN KEY (colaborador_id) REFERENCES public.usuarios(id_usuario);


--
-- Name: comentarioseditor comentarioseditor_articulo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comentarioseditor
    ADD CONSTRAINT comentarioseditor_articulo_id_fkey FOREIGN KEY (articulo_id) REFERENCES public.articulos(id_articulo);


--
-- Name: comentarioseditor comentarioseditor_editor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comentarioseditor
    ADD CONSTRAINT comentarioseditor_editor_id_fkey FOREIGN KEY (editor_id) REFERENCES public.usuarios(id_usuario);


--
-- Name: fotos fotos_categoria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fotos
    ADD CONSTRAINT fotos_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias(id_categoria);


--
-- Name: fotos fotos_evento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fotos
    ADD CONSTRAINT fotos_evento_id_fkey FOREIGN KEY (evento_id) REFERENCES public.eventos(id_evento);


--
-- Name: fotos fotos_fotografo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fotos
    ADD CONSTRAINT fotos_fotografo_id_fkey FOREIGN KEY (fotografo_id) REFERENCES public.usuarios(id_usuario);


--
-- Name: fotos_usadas fotos_usadas_articulo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fotos_usadas
    ADD CONSTRAINT fotos_usadas_articulo_id_fkey FOREIGN KEY (articulo_id) REFERENCES public.articulos(id_articulo);


--
-- Name: fotos_usadas fotos_usadas_foto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fotos_usadas
    ADD CONSTRAINT fotos_usadas_foto_id_fkey FOREIGN KEY (foto_id) REFERENCES public.fotos(id_foto);


--
-- Name: fotos_usadas fotos_usadas_usuario_uso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fotos_usadas
    ADD CONSTRAINT fotos_usadas_usuario_uso_id_fkey FOREIGN KEY (usuario_uso_id) REFERENCES public.usuarios(id_usuario);


--
-- Name: logs logs_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id_usuario);


--
-- Name: notificaciones notificaciones_usuario_destino_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT notificaciones_usuario_destino_id_fkey FOREIGN KEY (usuario_destino_id) REFERENCES public.usuarios(id_usuario);


--
-- Name: roles_permisos roles_permisos_id_permiso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles_permisos
    ADD CONSTRAINT roles_permisos_id_permiso_fkey FOREIGN KEY (id_permiso) REFERENCES public.permisos(id_permiso);


--
-- Name: roles_permisos roles_permisos_id_rol_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles_permisos
    ADD CONSTRAINT roles_permisos_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.roles(id_rol);


--
-- Name: tokensrecuperacion tokensrecuperacion_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokensrecuperacion
    ADD CONSTRAINT tokensrecuperacion_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id_usuario);


--
-- Name: usuarios usuarios_categoria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias(id_categoria);


--
-- Name: usuarios usuarios_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(id_rol);


--
-- Name: versionesarticulo versionesarticulo_articulo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.versionesarticulo
    ADD CONSTRAINT versionesarticulo_articulo_id_fkey FOREIGN KEY (articulo_id) REFERENCES public.articulos(id_articulo);


--
-- PostgreSQL database dump complete
--

