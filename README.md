# meanapp

Includes an angular module that enables users to select a location from the auto complete options and view place details as well as save in db. Location details can be fetched based on id and locations within 50kms can be plotted on map with place details.

# Instructions to run locally

1.Clone repository and download npm packages

    git clone https://github.com/vineeta02/meanapp.git

    npm install

2.Launch mongod then run server.js

    mongod
    node server.js

3.Open browser http://localhost:4000/

# CRUD APIs

1) GET /places - to GET places and their info
   accepted query parameters - name and location

2) POST /places - save new place
   accepted parameters - address,name,reviews,rating,location,opening_hours

3) PUT /places/{id} - parameters same as post

4) DELETE /places/{id} - no parameters

5) GET /places/{id} - to GET place info of a given id






