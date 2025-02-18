# Contributing guide

## Regarding .env file

 - ```Intentionally added .env file to github so that code can be tested as per use.```

   
## Setup

- git clone ```https://github.com/aytida7/WorkIndia.git```
- cd WorkIndia
- run `npm install`

## Swagger UI

- It is used for API documentation.
- All endpoints with example data is added to try out.
- start server using `npm start` and go to url `http://localhost:5000/api-docs` to see Swagger UI.
- Authorize section has two subsections 1) bearerAuth 2) apiKeyAuth.
   1) bearerAuth: No need to use this in our case.
   2) apiKeyAuth: Add `WorkIndiaAdminApiKey` and Authorize to access Admin api.
- Click `Try it out` and add or edit necessary data then click `execute` to hit the Api.
- All Api except one Api endpoint `http://localhost:5000/bookings/book` will execute successfully on Swagger UI.
- To hit Api endpoint `http://localhost:5000//bookings/book` use platforms such as Postman and add header as `Authorization` with value `<token from login endpoint>` to verify user.


## Testing enpoint to large traffic.

- run `npm start` and open another terminal, then
- run `node test.js` to test traffic controls and race conditions.
- Developer can change user credentials [ It needs to be registered already ] .
- Booking Data: Train data which is already present with Number of seats needs to book.
- By default 10 people at a time trying to book 10 ticket according to code [ Number can be changed to alter length of for loop ] .


