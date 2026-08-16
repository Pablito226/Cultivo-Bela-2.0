# Servidor mínimo para Cultivo-Bela-2.0

Este servidor proporciona:

- POST /api/login { user, pass } -> devuelve token JWT en caso de credenciales correctas
- GET /api/data -> devuelve el JSON con los datos guardados (público)
- POST /api/save -> guarda el JSON (protegido con JWT)

Instrucciones rápidas:

1. Copiá `.env.example` a `.env` y ajustá las variables (ADMIN_USER, ADMIN_PASS, JWT_SECRET, PORT si querés).
2. Desde la carpeta `server/` ejecutá:

   npm install
   npm start

3. El servidor sirve también los archivos estáticos del repositorio padre (incluyendo index.html), por lo que podés abrir http://localhost:3000/index.html (o el puerto que elijas).

Notas de seguridad:
- Este es un ejemplo simple para comenzar. En producción necesitás almacenar usuarios y contraseñas de manera segura (bcrypt, base de datos segura), usar HTTPS y revisar CORS.
