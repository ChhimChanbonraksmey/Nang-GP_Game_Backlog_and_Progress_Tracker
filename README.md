# Game Backlog and Progress Tracker

## Project Description
Game Backlog and Progress Tracker is a frontend web application developed for the Web Development II Final Project. The purpose of this project is to provide users with a structured and interactive platform for managing their personal video game collection and tracking their gaming progress.

The application allows users to search for real game information through the RAWG API and save selected games into a personal library managed through Mockoon. Users can then organize and maintain their library by updating game details such as playing status, platform, priority level, favorite marking, notes, and completion date. The interface updates dynamically without requiring a page refresh, which provides a smoother and more interactive user experience.

This project combines API integration, CRUD operations, client-side validation, dynamic rendering, dashboard statistics, and user-friendly design into a single application that remains relevant to the selected project scope.

## Main Features

### 1. Game Search
The application allows users to search for video games using the RAWG API. Search results display useful game information such as title, cover image, release date, genres, rating, and a direct link to view the game on RAWG.

### 2. Add Game to Library
Users can add games from the RAWG search results directly into their personal library stored in Mockoon.

### 3. Quick Add Custom Game
The application includes a custom add form that allows users to manually add games when needed. This is useful when a game is not found in the search results.

### 4. Edit Game Information
Users can update saved game information through an edit modal. Editable fields include:
- title
- cover image
- status
- platform
- priority
- favorite marking
- completion date
- notes

### 5. Delete Game
Users can remove games from their saved library. A confirmation prompt is shown before deletion.

### 6. Search, Filter, and Sort Library
The saved library can be searched, filtered, and sorted using multiple controls. Users can:
- search by title
- filter by status
- filter by priority
- filter by platform
- show favorites only
- sort by title, status, priority, completion date, or newest items

### 7. Progress Dashboard
The dashboard displays summary statistics for the saved library, including:
- total games
- want to play
- playing
- completed
- want to replay
- favorite games
- high priority games
- completion percentage

### 8. Additional Library Details
Each saved game can include:
- favorite badge
- priority level
- platform field
- completion date
- personal notes
- release date
- genres
- rating

### 9. API Status Indicators
The interface shows connection status for both:
- RAWG API
- Mockoon API

### 10. Error Handling and Validation
The application includes:
- user-friendly messages for failed API requests
- form validation for required fields
- image URL validation
- notes length validation
- completion date validation
- duplicate prevention when adding the same RAWG game to the library

### 11. UI and Interaction Enhancements
The application also includes:
- gamer-themed visual design
- section color distinctions
- badge-based information display
- loading states for buttons
- character counters for notes
- local fallback cover image support

## APIs Used

### RAWG API
RAWG API is used to search and retrieve real game data. It provides:
- game titles
- cover images
- release dates
- genres
- ratings

### Mockoon API
Mockoon is used as the local backend for the project’s personal game library. It supports the main CRUD operations:
- GET saved games
- POST new games
- PUT updated games
- DELETE removed games

## How to Run the Project

### 1. Open Mockoon
Open Mockoon on your device and import or open the file:

`mockoon/game-backlog-api.json`

### 2. Start the Mockoon Server
Make sure the Mockoon environment runs on port `3000`, then start the server.

Expected local endpoint:

`http://localhost:3000/games`

### 3. Open the Project in VS Code
Open the project folder in Visual Studio Code.

### 4. Run the Frontend
Use the Live Server extension in VS Code to open `index.html` in the browser.

### 5. Use the Application
After both Mockoon and Live Server are running:
- search games using RAWG
- add games to the library
- add custom games manually
- edit and delete saved games
- use filters, sorting, favorite options, and dashboard features

## Notes
- RAWG search results are fetched live from the external API.
- The RAWG API key is already included in the project files for testing and demonstration purposes.