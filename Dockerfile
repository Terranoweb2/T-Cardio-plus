# Dockerfile pour T-Cardio avec serveur et base de données
FROM node:18-alpine

# Installer les dépendances système pour SQLite
RUN apk add --no-cache sqlite

# Créer le répertoire de l'application
WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY server/package*.json ./server/

# Installer les dépendances
RUN npm install
RUN cd server && npm install

# Copier le code source
COPY . .

# Créer le répertoire de la base de données
RUN mkdir -p server/database

# Construire le frontend
RUN npm run build

# Initialiser la base de données
RUN cd server && npm run init-db

# Exposer le port
EXPOSE 3001

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=3001
ENV DB_PATH=./database/t-cardio.db

# Démarrer l'application
CMD ["npm", "run", "start:production"]
