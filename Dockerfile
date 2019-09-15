FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN mkdir /app
COPY ./dist /app
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
