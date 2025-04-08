# Unilink
Docker command to create the PSQL container: docker run --name postgresql -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=post123 -p 5432:5432 -v /data:/var/lib/postgresql/data -d postgres:alpine

On local PC:
Client container:
docker build -t ecarson2021/unilink_frontend .
docker push ecarson2021/unilink_frontend:latest

Server container:
docker build -t ecarson2021/unilink_backend .
docker push ecarson2021/unilink_backend:latest

On EC2 console:
To refresh/start client:
docker pull ecarson2021/unilink_frontend
docker run -d -p 8081:8081 ecarson2021/unilink_frontend

To refresh/start server:
docker pull ecarson2021/unilink_backend
docker run -d -p 3000:3000 ecarson2021/unilink_backend

To start postgresql container:
docker start postgresql

To stop all:
docker stop <client_container_id>
docker stop <server_container_id>
docker container prune
docker stop postgresql <-- DO NOT PRUNE THIS