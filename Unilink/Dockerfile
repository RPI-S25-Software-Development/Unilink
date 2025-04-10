FROM node
WORKDIR /app
# Copy only prebuilt web package
COPY dist/ .
RUN npm install -g serve
CMD ["serve", "-s", ".", "-l", "8081"]