# Adnat
A React Node SQL stack application that allows you create an account to join an organisation where you're able to create and delete shifts within the rostering system etc.

## Installation and running the project
1. Firstly install yarn if it isn't already.
2. Then in both frontend/adnat and backend run "yarn install" to download all required dependencies. You may also need to install @material-ui/pickers, @date-io/date-fns, date-fns@next and material-table manually.
3. Run the backend server first with "yarn start".
4. Then run the frontend from adnat with "yarn start" as well. When prompted to run on a different port, select yes.

## Features
* **Login** - Takes email and password as user input to receive a sessionId from the backend. Then routes to the organisation index page with either the sessionId  stored in a cookie or sent through the location state, depending if remember is true or false respectively.
  
* **Signup** - Sends user input for name, email, password and confirmationPassword to the backend server to create a new user once all inputs are validated. User is then routed back to login.

* **Validation** - The validation function takes as input a value and rule that the value should follow. The rules determine the contraints that are place on the value. Helper Texts and Error Flags are updated accordingly for the result of validation.

* **Authorization** - A PrivateRoute is used to block a user from access the organisation pages if they do not have a valid sessionId that's returned after successfully logging in.

* **Organisation** :
  * **Create** - A user can create and then join an organisation which is added to the list of organisations on the backend server and the user is routed to the organisation actions page.
  * **Edit** - If a user belongs to an organisation they can edit the organisation's name and hourly rate.
  * **Join** - A list of exisiting organisations are displayed in a table where the user can select to join any one of them.
  * **Shifts**:
    * **Create** - Shifts are created from a start and finish time that's set on the current day and time and 8 hours in the future respectively by default. The list of shifts for the organisations are then retrieved again to be sorted and parsed into the correct format.
    * **Delete** - Shifts may be deleted by selecting the actions button at the start of each row. 
  * **Leave** - An organisation may also be left by clicking the leave button. The user will then be routed to create or join an organisation.
* **Change Password** - The users password can also be changed from the organisation index page once they're logged in with a valid sessionId.

### Notes
* An additional GET endpoint was added to the backend server to retrieve a single organisations details by parsing the organsation Id as a parameter. This allowed for easily getting the current organisations details in various components.
* The shifts table is also set to dynamically increase in size until a limit of 10 where additional page size options become avaialable.
