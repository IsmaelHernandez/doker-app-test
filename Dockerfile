# ==========================================
# ETAPA 1: Construcción (Build) con Node.js
# ==========================================
# Usamos una imagen ligera de Node
FROM node:20-alpine as builder

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos solo los archivos de dependencias primero (aprovecha la caché de Docker)
COPY package.json package-lock.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Compilamos la aplicación React (esto genera la carpeta 'dist')
RUN npm run build

# ==========================================
# ETAPA 2: Producción (Servir) con Nginx
# ==========================================
# Usamos una imagen de Nginx para servir los estáticos
FROM nginx:alpine

# Borramos el HTML por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiamos SOLO la carpeta 'dist' generada en la Etapa 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponemos el puerto 80 (puerto por defecto de Nginx)
EXPOSE 80

# Mantenemos Nginx corriendo en primer plano
CMD ["nginx", "-g", "daemon off;"]
