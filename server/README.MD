# Boop

Boop is a chat app under development by computer science students from The University of the West Indies along with their mentor David Fowler (Partner Software Architect at Microsoft).

# Database structure

The ERD for the database can be found [here](https://dbdiagram.io/d/612bbd55825b5b0146e9aed7) and in the boop-db.png image in the project root.

# Getting the server to work

1. Docker
    1. If you don't have docker desktop download it [here](https://www.docker.com/products/docker-desktop)
    2. Create your container and database by either:
        1. Using the following command in the terminal (change the variables in quotes + remove quotes):
    
            `docker run -d -p 5432:5432 --name "container-name" -e POSTGRES_PASSWORD="database-password" -e POSTGRES_DB="database-name" -e POSTGRES_USER="database-user" postgres`

        OR

        2. Navigating to the server sub directory and using the docker compose file:

            `docker-compose up -d`

2. Database settings in server files:
    1. In VSCode or whatever code editor you're using open server/config and create a new file called config.json. 
    2. Use the sample_config.json file as a guide for the structure of the contents of config.json and fill in the information used in the command from step 1 or the server/docker-compose.yml file.

3. Run database migrations to create your tables in the database in docker (container MUST be running) using:

    Change to the server dir in the project:

    `cd server`

    Install dependencies:
    `npm i`

    Run the migrations:

    `npx sequelize-cli db:migrate `
    
4. Run the server in development mode using:
    
    `npm run dev`

5. (Optional) Use the [Thunder Client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) VSCode extension to test the routes. Here's a [JSON file](https://drive.google.com/drive/folders/14SfX97UpaPSqzPgeuLMLAoRXbzHXtx0O?usp=sharing) with some sample queries.

# Getting Google Login to Work

1. Installing Dependencies

    Navigate to the Client directory and Run the command:
        `npm i`

    Navigate to the Server directory and run the command:
        `npm i`

2. Setting up Enviroment Variables

    Create a .env file at the root of the server directory if it does not already exist.

    Add the following variables to the .env file:

        GOOGLE_CLIENT_ID = < Google client Id goes here >
        GOOGLE_CLIENT_SECRET = < Google client secret goes here >
        TOKEN_SECRET = < random secret string goes here >
    
    Replace "< random secret string goes here >" with a random string of your choice. You can use env.sample file as a reference.
 
 3. Getting Google App credentials
    
    Sign in to Google's Cloud Console [here](https://accounts.google.com/ServiceLogin/signinchooser?service=cloudconsole&passive=1209600&osid=1&continue=https%3A%2F%2Fconsole.cloud.google.com%2Fapis%2Fcredentials%3Fref%3Dhttps%3A%2F%2Fwww.google.com%2F&followup=https%3A%2F%2Fconsole.cloud.google.com%2Fapis%2Fcredentials%3Fref%3Dhttps%3A%2F%2Fwww.google.com%2F&flowName=GlifWebSignIn&flowEntry=ServiceLogin)
 
    From the side menu select "Credetials" then  "+ CREATE CREDENTIALS" option.

    Select the "OAuth client ID" option.

    Fill out the Form as follows:

        Set the "Application type" to "Web application".
        Name : "Boop chat login" (You can use any name for this. Only you will be able to see this in your google console)
        
        Under Authorized JavaScript origins
            ADD URI "http://localhost:3000"
        
        Under Authorized redirect URIs
            ADD URI "http://localhost:5000/api/login/auth/google/callback"

    Create

    You will be given you Client ID and Client secret.

 4. Setting client ID and client Secret.
    
    In the .env file

        replace < Google client Id goes here > with the acquired Goolge client ID.
            e.g GOOGLE_CLIENT_ID = asdjkh489ajhkajshdjh389380.app.googlecontent.com

        replace < Google client secret goes here > with the acquired Goolge client sercret.
            e.g GOOGLE_CLIENT_SECRET = ajhasjdhjh48978387jkhfjkhzx