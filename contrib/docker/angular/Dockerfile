FROM node:20-alpine
WORKDIR /app

COPY frontend/package*.json ./
RUN npm install -g @angular/cli@17
RUN npm ci
COPY ./frontend .

EXPOSE 4200
CMD ["ng", "serve", "--host", "0.0.0.0"]