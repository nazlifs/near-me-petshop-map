FROM node:20.16-alpine3.20 AS builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .
ENV NODE_ENV production

RUN npm run build

FROM nginx:1.21-alpine AS production

ENV NODE_ENV production

COPY --from=builder /app/dist /usr/share/nginx/html
RUN ls -latr /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]