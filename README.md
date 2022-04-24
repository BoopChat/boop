# Boop <!-- omit in toc -->

Boop is a chat app under development by computer science students from The University of the West Indies
along with their mentor David Fowler (Partner Software Architect at Microsoft).

# ✍️ Getting Started with Boop <!-- omit in toc -->


- [🔻Downloading the project](#downloading-the-project)
- [🚀 Quick Start](#-quick-start)
- [🏃‍♂️ Quick resume](#️-quick-resume)
- [🗄 Setting up the server](#-setting-up-the-server)
  - [📄 Setting up Environment Variables](#-setting-up-environment-variables)
  - [Getting the server to work](#getting-the-server-to-work)
  - [Getting Google Login to Work](#getting-google-login-to-work)
  - [Getting Facebook Login to Work](#getting-facebook-login-to-work)
- [💻 Using the client](#-using-the-client)
- [🐋 Building a docker image](#-building-a-docker-image)
- [☸ Deploying to Kubernetes Digital Ocean](#-deploying-to-kubernetes-digital-ocean)
- [☸ Redeploying to Kubernetes Digital Ocean](#-redeploying-to-kubernetes-digital-ocean)

## 🔻Downloading the project

[This](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository#cloning-a-repository) GitHub guide can walk you through cloning the repo. 

## 🚀 Quick Start

 1. Make a .env file at the root of the server directory, with your values for the variables in server/env.sample

 2. Start [docker desktop](https://www.docker.com/products/docker-desktop). Let it run in the background.

 3. From the root directory run the following to install all dependencies and create the database:
    
    `npm run dev-quick-setup` 

 4. After it is complete wait a few seconds for your database container to start running

 5. From the root run the following to run the migrations and seed the database (it will be cleared first):
   
    `npm run dev-quick-server`

 6. Run the application in development mode:
  
    `npm run dev`

## 🏃‍♂️ Quick resume
Assuming you've already installed all dependencies, created the database, run all migrations and seeded the database:
1. Start the database container and run the app in development mode:
   
   `npm run dev-quick-resume`
   
   OR

2. If the database container is already running, start the app in development mode:
   
   `npm run dev`

<br>
<br>

## 🗄 Setting up the server

<b>Database structure</b>

The ERD for the database can be found [here](https://dbdiagram.io/d/612bbd55825b5b0146e9aed7) and in the boop-db.png image in the project root.

### 📄 Setting up Environment Variables

1. Make a .env file at the root of the server directory, with your values for the variables in server/env.sample. 
2. Make a .env.production file at the root of the server directory, with your values for the variables in server/env.production.sample

### Getting the server to work

1. Docker
    1. If you don't have docker desktop download it [here](https://www.docker.com/products/docker-desktop). Make sure it's running.
    2. Create your container and database:
        1. From the root:
    
            `npm run server-docker-compose`

        OR

        2. From the server sub directory:

            `docker-compose up -d`

2. Run database migrations to create your tables in the database in docker (container MUST be running) using:

    1. Make sure you have all needed dependencies:
    
        In the project root run:

        `npm run install-all-deps`

    2. Run the migrations:

       1. from root:
       
           `npm run server-migration`

           OR

       2. from server sub-dir 
        
           `npx sequelize-cli db:migrate `
    
3. Run the application in development mode using (in the root):
    
    `npm run dev`

4. (Optional) Use the [Thunder Client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) VSCode extension to test the routes. Here's a [JSON file](https://drive.google.com/drive/folders/14SfX97UpaPSqzPgeuLMLAoRXbzHXtx0O?usp=sharing) with some sample queries.

### Getting Google Login to Work

1. Installing Dependencies

    In the project root run:

    `npm run install-all-deps`

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

### Getting Facebook Login to Work

1. Setting up Enviroment Variables

    Add the following variables to the .env file:

        FACEBOOK_CLIENT_ID = < Facebook client Id goes here >
        FACEBOOK_CLIENT_SECRET = < Facebook client secret goes here >

2. Getting Facebook app credentials

    1. While logged into facebook, navigate to the [Facebook for developers](https://developers.facebook.com/) website.

    2. Click "Get Started" in the top right corner of the webage OR MyApps and skip to step 3.

        "Register" by clicking Continue.
        "Verify account" by adding a cell phone number (e.g 2468435599) and entering the verfication number sent via sms. 
        Confirm email address.
        Select an option which decribes you and complete registration. 

    3. Click Create App.
        Select Consumer.
        Enter the App display name and create the app.

    4. On the left, next to the App display name you chose, click the down arrow.
        create test app.
        click create test app again.
    
    5. Under the "Facebook Login" card option, click setup.
        Select "www".
        Under site URL enter "http://localhost:3000" and click save.
        No need to click continue.
    
    6. Go to settings on the left and select basic.
        Copy the app ID into the .env file in the FACEBOOK_CLIENT_ID variable.
        Click show next to the App secret.
        Copy the app secret into the .env file in the FACEBOOK_CLIENT_SECRET variable.

## 💻 Using the client

1. Ensure you've followed all previous setup instructions.
2. Ensure the database container is running:
   1. Start your container in the docker desktop app
   
        OR

   2. In the project root run:
   
        `npm run docker-start`

3. Run the server and client in development mode:
  
    In the project root run:

    `npm run dev`

## 🐋 Building a docker image

To build the docker image yourself you can use `docker build -t boop:0.1.0 .` while in the root of the project. This will read and perform the actions described in the Dockerfile. Ensure you have all the appropriate env vars set.

Once the image is built, a container can be created from the image with the docker-compose file located in the root of the project. You will need to pass docker-compose the required env vars for each container (boop app and postgres). For example: `docker-compose -f docker-compose.yml --env-file server/.env up -d`.

The app should then be accessible on port 8080. From here you will need to run the database migration before you can login to the app.

## ☸ Deploying to Kubernetes Digital Ocean

1. Make sure your env variables in server/.env.production have the correct values.
   
2. Obtain your yaml key for `kubectl` from DigitalOcean in Kubernetes overview section, with the download config file button. This is required if your are using kubectl to manage the kubernetes cluster; this is not required for `doctl`.

    <i>If you are using a *nix system, the deploy-script.bash script can run the following commands automatically. Simply pass the path to the yaml key for kubectl as the first arg (in project root: `./deploy-script.bash <path to yaml key>`).</i>

3. Use `npm run make-yaml-secrets` in the project root to create a secret yaml file (./boop-secret.yaml). The secrets can be pushed to DigitalOcean with kubectl using the command `kubectl --kubeconfig="/path/to/your/yaml/key" apply -f /path/to/your/secret.yaml`.

4. The HOME_URL var in the boop-deployment.yaml file needs to be filled in with the url to be used for the app. You can then push the deployment to DigitalOcean using `kubectl --kubeconfig="/path/to/your/yaml/key" create -f ../path/to/boop-deployment.yaml`.

5. To create the service to expose the created pods to the outside world, use the boop-service.yaml. The command to push is `kubectl --kubeconfig="/path/to/your/yaml/key" apply -f /path/to/boop-service.yaml`.

## ☸ Redeploying to Kubernetes Digital Ocean

If you want to update the env variables used after previously deploying to Kubernetes Digital Ocean:

1. Update the env values in your server/.env.production file
   
    <i>If you are using a *nix system, the redeploy-script.bash script can run the following commands automatically. Simply pass the path to the yaml key for kubectl as the first arg (in project root: `./redeploy-script.bash <path to yaml key>`).</i>

2. Delete the current deployment using `kubectl --kubeconfig="/path/to/your/yaml/key" delete deployment boop-deployment`

3. Use `npm run make-yaml-secrets` in the project root to create a secret yaml file (./boop-secret.yaml) with the updated env values. The secrets can be pushed to DigitalOcean with kubectl using the command `kubectl --kubeconfig="/path/to/your/yaml/key" apply -f /path/to/your/secret.yaml`.

4. The HOME_URL var in the boop-deployment.yaml file needs to be filled in with the url to be used for the app. You can then push the deployment to DigitalOcean using `kubectl --kubeconfig="/path/to/your/yaml/key" create -f ../path/to/boop-deployment.yaml`.

5. To create the service to expose the created pods to the outside world, use the boop-service.yaml. The command to push is `kubectl --kubeconfig="/path/to/your/yaml/key" apply -f /path/to/boop-service.yaml`.