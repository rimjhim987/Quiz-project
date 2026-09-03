# Quiz Project

A full-stack quiz application built with Node.js, Express, SQLite, HTML, CSS, and JavaScript. The app loads quiz questions from a SQLite database through a backend API and lets users play a multiple-choice quiz in the browser.

## Features

- Start screen and quiz flow
- Multiple-choice questions with answer selection
- Score tracking during the quiz
- Previous/Next navigation
- Result screen showing final score
- Backend API to fetch questions from SQLite
- CORS-enabled frontend-backend communication

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: SQLite
- API: RESTful endpoint for quiz questions

## Project Structure

```text
quiz-project/
├── server.js
├── package.json
├── README.md
├── quiz.db
├── quiz-frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
```

## How it works

1. The Express server runs on port 3000.
2. The frontend fetches quiz questions from the backend using:
   `http://localhost:3000/questions`
3. The backend reads questions from the SQLite database and returns them as JSON.
4. The browser renders the questions, tracks answers, and calculates the final score.

## Prerequisites

Make sure you have installed:

- Node.js
- npm

## Installation

```bash
npm install
```

## Run the project

Start the backend server:

```bash
node server.js
```

Then open the frontend in a browser:

```text
quiz-frontend/index.html
```

If the browser blocks the fetch, make sure the backend is running and that the frontend is served from a local environment or opened via a browser with access to `localhost:3000`.

## Backend API

### GET /questions

Returns all questions stored in the SQLite database.

Example response:

```json
[
  {
    "id": 1,
    "question_text": "What is the capital of France?",
    "option_a": "Berlin",
    "option_b": "Paris",
    "option_c": "Rome",
    "option_d": "Madrid",
    "correct_answer": "B"
  }
]
```

## Notes

- The app expects a SQLite database file named `quiz.db` in the project root.
- The database should contain a `questions` table with fields such as:
  - `id`
  - `question_text`
  - `option_a`
  - `option_b`
  - `option_c`
  - `option_d`
  - `correct_answer`

## Future Improvements

- Add login and user profiles
- Add multiple quiz categories
- Add timer-based rounds
- Add admin panel to manage questions
- Add database seeding and setup scripts

## License

This project is for educational/demo purposes.
