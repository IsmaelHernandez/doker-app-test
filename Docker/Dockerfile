#Nos paramos en la imagen base
FROM nginx:alpine 
#Borramos el html por defecto que tare nginx para tener el nuestro 
RUN rm -rf /usr/share/nginx/html/*

#pasamos todo el codigo al contenedor
COPY . /usr/share/nginx/html

#exponemos que la app se expone en el puerto 80 jajaja
EXPOSE 80

# Le decimos a Nginx que se quede prendido en primer plano
CMD ["nginx", "-g", "daemon off;"]