// test-logs.js - Script para probar el sistema de logs
// Ejecutar con: node test-logs.js
// IMPORTANTE: Instalar axios primero: npm install axios

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
let adminToken = '';

// 🔹 CONFIGURACIÓN - EDITA ESTAS CREDENCIALES
const ADMIN_CREDENTIALS = {
  email: 'ritolezcano@gmail.com',    // ✅ Tu sistema usa "email", no "usuario"
  password: 'asd123'                  // ✅ Contraseña
};

// Colores para la consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  debug: (msg) => console.log(`${colors.cyan}🔍 ${msg}${colors.reset}`)
};

// Función auxiliar para hacer requests
async function request(endpoint, options = {}) {
  try {
    const config = {
      method: options.method || 'GET',
      url: `${API_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...(adminToken && { 'Authorization': `Bearer ${adminToken}` }),
        ...options.headers
      },
      ...(options.data && { data: options.data }),
      validateStatus: () => true // No lanzar error en respuestas 4xx/5xx
    };
    
    log.debug(`Request: ${config.method} ${config.url}`);
    const response = await axios(config);
    log.debug(`Response: ${response.status} ${response.statusText}`);
    
    return { 
      ok: response.status >= 200 && response.status < 300, 
      status: response.status, 
      data: response.data 
    };
  } catch (error) {
    log.error(`Error en request: ${error.message}`);
    if (error.code === 'ECONNREFUSED') {
      log.error('No se pudo conectar al servidor. ¿Está corriendo en http://localhost:3000?');
    }
    return { ok: false, error: error.message, code: error.code };
  }
}

// 0. Verificar que el servidor está corriendo
async function checkServer() {
  log.info('Paso 0: Verificando conexión con el servidor...');
  
  const result = await request('/');
  
  if (result.code === 'ECONNREFUSED') {
    log.error('El servidor no está corriendo en http://localhost:3000');
    log.warning('Inicia el servidor con: npm start');
    return false;
  }
  
  if (result.ok || result.status === 404) {
    log.success('Servidor corriendo correctamente');
    return true;
  }
  
  log.warning('Respuesta inesperada del servidor');
  return true; // Continuar de todos modos
}

// 1. Login como admin
async function loginAsAdmin() {
  log.info('Paso 1: Intentando login como admin...');
  
  log.warning(`Email: ${ADMIN_CREDENTIALS.email}`);
  log.warning(`Password: ${'*'.repeat(ADMIN_CREDENTIALS.password.length)}`);
  
  const result = await request('/auth/login', {
    method: 'POST',
    data: ADMIN_CREDENTIALS
  });

  if (result.ok && result.data.token) {
    adminToken = result.data.token;
    log.success(`Login exitoso como ${result.data.usuario || 'admin'}`);
    log.debug(`Token recibido: ${adminToken.substring(0, 20)}...`);
    return true;
  } else {
    log.error('No se pudo hacer login.');
    
    if (result.status === 429) {
      log.warning('Demasiados intentos. Espera 15 minutos o reinicia el servidor.');
    } else if (result.status === 401 || result.status === 400) {
      log.error('Credenciales incorrectas. Verifica usuario/password en el script.');
      log.info('Para obtener las credenciales correctas:');
      log.info('1. Conéctate a tu base de datos');
      log.info('2. Ejecuta: SELECT usuario, rol_id FROM usuarios WHERE rol_id = 1;');
      log.info('3. Actualiza ADMIN_CREDENTIALS en la línea 11 del script');
    } else if (result.code === 'ECONNREFUSED') {
      log.error('El servidor no responde. ¿Está corriendo?');
    } else {
      log.error(`Error inesperado: ${result.status}`);
      console.log('Respuesta completa:', JSON.stringify(result.data, null, 2));
    }
    
    return false;
  }
}

// 2. Verificar que la ruta de logs existe
async function checkLogsEndpoint() {
  log.info('Paso 2: Verificando endpoint /api/logs...');
  
  const result = await request('/logs?limite=1');
  
  if (result.ok) {
    log.success('Endpoint /api/logs funciona correctamente');
    return true;
  } else if (result.status === 404) {
    log.error('Endpoint /api/logs NO EXISTE');
    log.warning('Verifica que en app.js tienes:');
    console.log('  import logsRoutes from "./routes/logs.routes.js";');
    console.log('  app.use("/api/logs", logsRoutes);');
    return false;
  } else if (result.status === 401) {
    log.error('Token no válido o expirado');
    return false;
  } else if (result.status === 403) {
    log.error('Sin permisos de admin');
    log.warning('El usuario debe tener rol de "Administrador" o "Admin"');
    return false;
  } else {
    log.error(`Error al acceder: ${result.status}`);
    console.log('Respuesta:', JSON.stringify(result.data, null, 2));
    return false;
  }
}

// 3. Obtener estadísticas
async function getStats() {
  log.info('Paso 3: Obteniendo estadísticas...');
  
  const result = await request('/logs/stats');
  
  if (result.ok) {
    log.success('Estadísticas obtenidas correctamente');
    console.log(`   📊 Total de logs: ${result.data.totalLogs}`);
    console.log(`   📊 Tipos de acciones: ${result.data.accionesPorTipo.length}`);
    console.log(`   📊 Usuarios activos: ${result.data.usuariosActivos.length}`);
    
    if (result.data.totalLogs === 0) {
      log.warning('No hay logs registrados. Crea algún artículo/foto para generar logs.');
    }
    
    return true;
  } else {
    log.error('Error al obtener estadísticas');
    console.log('Status:', result.status);
    console.log('Respuesta:', JSON.stringify(result.data, null, 2));
    return false;
  }
}

// 4. Obtener logs con filtros
async function getLogsWithFilters() {
  log.info('Paso 4: Obteniendo logs con filtros...');
  
  const result = await request('/logs?limite=5');
  
  if (result.ok) {
    const logsCount = result.data.logs?.length || 0;
    log.success(`Se obtuvieron ${logsCount} logs`);
    
    if (logsCount > 0) {
      console.log('\n   📋 Último log registrado:');
      const ultimoLog = result.data.logs[0];
      console.log(`      Usuario: ${ultimoLog.nombre} ${ultimoLog.apellido} (@${ultimoLog.usuario})`);
      console.log(`      Rol: ${ultimoLog.rol}`);
      console.log(`      Acción: ${ultimoLog.accion}`);
      console.log(`      Descripción: ${ultimoLog.descripcion}`);
      console.log(`      Fecha: ${new Date(ultimoLog.fecha).toLocaleString('es-AR')}`);
    } else {
      log.warning('No hay logs registrados todavía.');
      log.info('Para generar logs, realiza alguna acción en el sistema:');
      log.info('  - Sube un artículo');
      log.info('  - Sube una foto');
      log.info('  - Aprueba/rechaza un artículo');
    }
    
    return true;
  } else {
    log.error('Error al obtener logs');
    console.log('Status:', result.status);
    console.log('Respuesta:', JSON.stringify(result.data, null, 2));
    return false;
  }
}

// 5. Obtener tipos de acciones
async function getAcciones() {
  log.info('Paso 5: Obteniendo tipos de acciones...');
  
  const result = await request('/logs/acciones');
  
  if (result.ok) {
    const acciones = result.data;
    log.success('Tipos de acciones obtenidos');
    
    if (acciones.length > 0) {
      console.log(`   📝 Acciones registradas: ${acciones.join(', ')}`);
    } else {
      console.log('   📝 No hay acciones registradas aún');
    }
    
    return true;
  } else {
    log.error('Error al obtener acciones');
    console.log('Status:', result.status);
    console.log('Respuesta:', JSON.stringify(result.data, null, 2));
    return false;
  }
}

// 6. Verificar seguridad (sin token)
async function checkSecurity() {
  log.info('Paso 6: Verificando seguridad (sin token)...');
  
  const tempToken = adminToken;
  adminToken = '';
  
  const result = await request('/logs');
  
  adminToken = tempToken;
  
  if (!result.ok && (result.status === 401 || result.status === 403)) {
    log.success('✅ Seguridad OK: Acceso denegado sin token');
    return true;
  } else if (result.ok) {
    log.error('🔴 PROBLEMA DE SEGURIDAD: Los logs son accesibles sin token!');
    log.warning('Verifica que en logs.routes.js tienes:');
    console.log('  router.use(verifyToken);');
    console.log('  router.use(checkRole([\'Admin\', \'Administrador\']));');
    return false;
  } else {
    log.warning('Respuesta inesperada');
    console.log('Status:', result.status);
    return false;
  }
}

// Ejecutar todas las pruebas
async function runAllTests() {
  console.log('\n╔═══════════════════════════════════════════════════╗');
  console.log('║   🚀 TEST DE SISTEMA DE LOGS - Diario Virtual   ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');
  
  const tests = [
    { name: 'Servidor', fn: checkServer, critical: true },
    { name: 'Login', fn: loginAsAdmin, critical: true },
    { name: 'Endpoint logs', fn: checkLogsEndpoint, critical: true },
    { name: 'Estadísticas', fn: getStats, critical: false },
    { name: 'Filtros', fn: getLogsWithFilters, critical: false },
    { name: 'Acciones', fn: getAcciones, critical: false },
    { name: 'Seguridad', fn: checkSecurity, critical: true }
  ];
  
  let passed = 0;
  let failed = 0;
  let criticalFailed = false;
  
  for (const test of tests) {
    const result = await test.fn();
    
    if (result) {
      passed++;
    } else {
      failed++;
      if (test.critical) {
        criticalFailed = true;
        log.error(`Prueba crítica falló: ${test.name}`);
        log.warning('No se pueden continuar las pruebas.');
        break;
      }
    }
    console.log('');
  }
  
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log(`║  ✅ Pruebas exitosas: ${passed}/${tests.length}`.padEnd(52) + '║');
  console.log(`║  ❌ Pruebas fallidas: ${failed}/${tests.length}`.padEnd(52) + '║');
  console.log('╚═══════════════════════════════════════════════════╝\n');
  
  if (failed === 0) {
    log.success('🎉 ¡PERFECTO! Todas las pruebas pasaron.');
    log.success('El sistema de logs está funcionando correctamente.');
    log.info('\n📌 Próximos pasos:');
    log.info('1. Agrega los logs faltantes en los controladores (file y foto)');
    log.info('2. Crea el componente React para visualizar logs (AdminLogs.jsx)');
    log.info('3. Prueba generando algunas acciones en el sistema');
  } else if (criticalFailed) {
    log.error('❌ Pruebas críticas fallaron. Revisa los errores anteriores.');
  } else {
    log.warning(`⚠️  ${failed} prueba(s) no crítica(s) fallaron.`);
    log.info('El sistema básico funciona, pero revisa las advertencias.');
  }
}

// Ejecutar
runAllTests().catch(err => {
  log.error('Error fatal en el script:');
  console.error(err);
});