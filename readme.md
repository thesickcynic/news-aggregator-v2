# News Aggregator

  

An API built using Node.js and Express.js. It supports simple CRUD operations for tasks.

  
# Running the Project
To run the project, 
i) Clone the repository.
ii) `npm run start`

By default the app runs on port 3000.
  

# Endpoints and Features
-   **POST /register**: Registers a new user after validating input data.
    
-   **POST /login**: Checks if the provided email and password are correct and if so, returns a JWT auth token.
    
-   **GET /preferences**: Returns the preferences of the logged in user.
    
-   **PUT /preferences**: Updates the preferences of the logged in user.
    
-   **GET /news**:  Fetches the news from News API Top Headlines based on the logged in users preferences.
