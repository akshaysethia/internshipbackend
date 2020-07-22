# Backend For The ImageEditBootcamp

* ## All The API's have been implemented
* ## All the APIs have been implemented using *__Node, Express JS__*.
* ## For Backend I have used *__Mongodb__*.


# To Run The Code

1. #### Add the .env file with
    1. ##### MONGO_URI
    2. ##### PORT
    3. ##### SECRET
2. #### Now you have to do *__npm i__*
3. #### Now use *__npm run start__* to run the backend

# APIs in the Code

1. ### *__/user__*
    1. #### /register - GET - To get the register page
    2. #### /register - POST - To Register the user
    3. #### /login - GET - To load the login page
    4. #### /login - POST - To log the user into the application
    5. #### /checkToken - GET - To check if the JWT token is valid or not
    6. #### /profile - GET - To load the profile page of the user

2. ### *__/work__*
    1. #### /addTask - POST - To add the Task into the System
    2. #### /assignTask/:taskId - GET - To get the page with all the students to whom the task has to be assigned
    3. #### /assigntask/:taskId - POST - to implement the above method.
    4. #### /allTasks - GET - To get all the tasks of the user
    5. #### /submitTask/:taskId - POST - To submit the task that has been assigned to the user.
    6. #### /users - GET - To get all the users in the system for the admin to evaluate them.
    7. #### /review/:studentId/task/:taskId - POST - For the admin to post the grade for each student for a specified task.

# Functionality

### Over here the model contains the colums of how the app has been created (in the models folder) 
### Routes are the APIs implementation present in the routes folder
### the config folder contains the passport jwt setup.
