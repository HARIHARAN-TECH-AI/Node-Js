Movie Collection API using the Tech Stack

*Node-js
*Express
*MySql
*Sequelize
*Joi

Step 1 : To import all the required libraries before importing it install the libraries using this cmd "npm install express sequelize joi mysql2 dotenv"

Setp 2 : Use the middleware (The important objective of middleware is to recieve the req and res between frontend and backend and also parsing, authentication etc...)

Step 3 : Configure the database first, In this case im using Mysql normally MySql is able to run locally but it comes to real time project we need to render the API, If we
         simply render the api it will rendered but there is no response comes from that end point because we need to publish the database first and then we need to render the API

Step 4 : So Im using one of the Open source platform which is (TiDB) this is one of the open source MySql data available in public, so using this TiDB database we need to create a
        Cluster after creating a cluster we need to create a Connection String, it depends upon your project tech stack the connection string will be varied after that you need to
        generate password

Step 5 : Create .env file add all the configuration which is 

            PORT=4040
            DB_NAME=test
            DB_USER=2wpYqhRTwr6WFUT.root
            DB_PASS=LtBer3s7hxrSxVpK
            DB_HOST=gateway01.ap-southeast-1.prod.aws.tidbcloud.com
            DB_PORT=4000
        
        The above details are automatically get when you create a connection string once

Step 6 : Create a Strong validation Schema using Sequelize library for best and strong Validation becuase some of the user are try to give wrong data which is Age:18 this is right but 
            Age: Eighteen this is wrong , so this one will be handled by Sequelize

Step 7 : Sequelize is used for validation next Joi it one of the libaray it will also do validation but it will validate the req body
        Joi === to validate request body
        Sequelize === to validate database constraints

Step 8 : And then im ready to creating a routes to connect the request and response '/' => Simple give response to "Api Running Successfully"

Step 9 : POST /api/entries  =>  This will help to insert the new data to the database and it will autoincrement also
         GET /api/entries  =>  This will help us to show all the present in the Database and i add max entries is 10 per page 
         GET /api/entries/:id => This will help to show the particular id details
         PUT /api/entries/:id => This will help us to update the particular id and update in databse also
         DELETE /api/entries/:id => This will help us to delete the particulat id.
         GET /api/entries/search?title="Avatar"  => This will help us to find the title of the movie

Step 10 : Finally I test the API using Postman and Thunder Client after i pushed in github and then to publish the API public so im using Render.com 
        this will help us to publish the API to connect to github. 


        i provide the rendered api url "https://node-js-azba.onrender.com/"
        in this url you need to add suffix like "/api/entries" , "/api/entries/:id", "/api/entries/search?title=Dream Chasers  like that...


Here  i upload one Screenshot folder which contain all the details contain DB connection String, DB Stored in TiDB , Deployment like that 

Thank You...!