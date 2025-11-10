FROM node:18-alpine

# Install OpenSSL for Prisma (create symlink for libssl.so.1.1)
RUN apk add --no-cache openssl libc6-compat && \
    ln -s /usr/lib/libssl.so.3 /usr/lib/libssl.so.1.1 && \
    ln -s /usr/lib/libcrypto.so.3 /usr/lib/libcrypto.so.1.1

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "run", "start:dev"]


