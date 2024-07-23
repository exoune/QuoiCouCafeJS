# Utiliser une image Node.js officielle basée sur Debian pour ARM
FROM arm32v7/node:18

# Installer les dépendances nécessaires pour canvas
RUN apt-get update && apt-get install -y \
    libc6 \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    build-essential

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier le package.json et le package-lock.json
COPY package*.json ./

# Installer toutes les dépendances (y compris celles pour le développement)
RUN npm install --verbose

# Copier les fichiers de l'application
COPY . .

# Copier les polices
COPY fonts /usr/src/app/fonts

# Exposer le port si nécessaire (facultatif)
EXPOSE 8081

# Commande par défaut pour démarrer l'application
CMD ["node", "index.js"]
