FROM node
WORKDIR /app
# Copy only package.json and package-lock.json first
COPY package*.json ./
# Install dependencies inside Docker (important!)
RUN npm install
# Now copy the rest of the files
COPY . .
CMD ["node", "index.js"]