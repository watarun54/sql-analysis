FROM nginx:1.13.0

RUN mkdir /app
RUN chmod 755 -R /app

COPY ./nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]