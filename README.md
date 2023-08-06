# Users Backend API:
 Users API  - link to the repo :  https://github.com/VeselinAtanasov/users
## Description:
Backend API for managing users. Following technologies has been used:
* Express framework
* REST JSON API
* Postgres and Sequelize
* Bearer JWT 
## Design:
The application is split into two parts
* User functionality:
    * Once the user is registered/logged in a JWT token is returned from the server.
    * Using this token the user can :
		* Edit its own account, but it is not allowed to change the username and the role from user to admin 
		* Retrieve its own account, along with all friends, if there are any.
		* Retrieve a list of all friends(only users with role = user are allowed).
		* Add a friend in its friend list(only users with role = user are allowed).
		* Remove a friend from its friend list(only users with role = user are allowed).
		* Add an image to the profile.
* Admin functionality:
    * Admins are normal user and has access to all user functionality, except friends list feature
    * Admins can:
		* Retrieve all users with pagination
		* Retrieve a single user by id
		* Reset user password, but are not allowed to do any other modifications on user profile
		* Create new user
		* Delete user
## Additional information:
* Postman collection is provided in the repo, so anyone can test the API functionality
* Once the API is started and the database is not created yet, an error like: "Database is down or it is not created! Try to create it by executing form terminal `node createDb/dbSetup.js`" will be returned. So the API user can create this database by executing the command form the response.
* By default the app uses cookies to send the token to the user. On logout the cookie is set to expired and thus no attempts are allowed and user is forced to login again
* The application supports also, authorization without cookie, i.e. the server checks the authorization headers in the request and token is extracted from there. In this case, a black list table in the database with tokens per user is supported. In order to allow this functionality a process.env param called USE_TOKEN_FROM should not be set as `cookie`