# Boop

Boop is a chat app under development by computer science students from The University of the West Indies along with their mentor David Fowler (Partner Software Architect at Microsoft).

# Getting the server to work

1. Docker
    1. If you don't have docker desktop download it [here](https://www.docker.com/products/docker-desktop)
    2. Create your container and database using the following command in the terminal (change the variables in quotes + remove quotes):
    
        `docker run -d -p 5432:5432 --name "container-name" -e POSTGRES_PASSWORD="database-password" -e POSTGRES_DB="database-name" -e POSTGRES_USER="database-user" postgres`

2. Database settings in server files:
    1. In VSCode or whatever code editor you're using open server/config and create a new file called config.json. 
    2. Use the sample_config.json file as a guide for the structure of the contents of config.json and fill in the information used in the command from step 1.

3. Run database migrations to create your tables in the database in docker (container MUST be running) using:

    Change to the server dir in the project:

    `cd server`

    Run the migrations:

    `npx sequelize-cli db:migrate `
    
4. Run the server in development mode using:
    
    `npm run dev`

5. (Optional) Use the [Thunder Client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) VSCode extension to test the routes. Here's a [JSON file](https://drive.google.com/drive/folders/14SfX97UpaPSqzPgeuLMLAoRXbzHXtx0O?usp=sharing) with some sample queries.

