// 📁 utils/testInstructions.js
const testInstructions = `
🎯 GUÍA DE PRUEBAS CON VENTANAS INCOGNITO:

1. ✅ PREPARACIÓN:
   - Inicia el backend (puerto 4000)
   - Inicia el frontend (puerto 3000)
   - Asegúrate de tener al menos 5 usuarios de prueba

2. 🔄 PROCESO:
   - Abre 5-10 ventanas incógnito
   - En cada una: http://localhost:3000/login
   - Loguea con usuarios diferentes
   - En el admin: http://localhost:3000/admin/dashboard

3. 📊 MÉTRICAS A OBSERVAR:
   - Tiempo de respuesta del backend
   - Consumo de memoria
   - Usuarios mostrados en dashboard
   - Estabilidad del sistema

4. ⚠️ LÍMITES:
   - Máximo ~15 ventanas simultáneas
   - No simula carga real de CPU
   - Bueno para pruebas funcionales
`;

console.log(testInstructions);