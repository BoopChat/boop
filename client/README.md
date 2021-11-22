# Boop

Boop is a chat app under development by computer science students from The University of the West Indies
along with their mentor David Fowler (Partner Software Architect at Microsoft).

# Using the client
1. Make sure you have all needed dependencies:
    
    In the project root run:

    `npm run install-all-deps`
2. Make sure you've set up the server according to the README in the root or server sub-directory
2. Ensure the database container is running:
   1. Start your container in the docker desktop app
   
        OR

   2. In the project root run:
   
        `docker run -dp 5432:5432 boop_db`

3. Run the server and client in development mode:
  
    In the project root run:

    `npm run dev`