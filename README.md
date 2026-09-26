# StudyAI — Frontend Internship Assignment

StudyAI is a React-based study assistant that converts free-form study topics or notes into structured flashcards and an interactive quiz.

The project was designed around the assignment's main requirement: the LLM returns structured JSON, the application validates it before rendering, and the UI handles malformed, empty, slow, failed, and stale responses without crashing.

## Features

- Free-form topic/notes input
- Real Gemini LLM integration
- Structured JSON output
- Backend proxy so the API key never reaches the browser
- Zod validation on the server
- Defensive validation on the frontend
- Interactive flashcards
- Interactive multiple-choice quiz
- Score calculation
- Retest mode for incorrect questions
- Loading state
- Error state with retry
- Empty state
- Stale-response protection
- Request timeout
- Responsive mobile layout
- Accessible keyboard interaction for flashcards
- No authentication required

## Tech stack

### Frontend
- React
- Vite
- React hooks
- CSS

### Backend
- Node.js
- Express
- Gemini API via `@google/genai`
- Zod
- dotenv
- CORS

## Project structure

```text
study-ai-assignment/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PromptInput.jsx
│   │   │   ├── ResultView.jsx
│   │   │   ├── FlashcardDeck.jsx
│   │   │   ├── Quiz.jsx
│   │   │   ├── ErrorState.jsx
│   │   │   └── LoadingState.jsx
│   │   ├── lib/
│   │   │   ├── api.js
│   │   │   └── validateResult.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── generate.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
├── .gitignore
├── package.json
└── README.md
```

## Setup

### 1. Install Node.js

Use a current Node.js release supported by Vite.

Check:

```bash
node --version
npm --version
```

### 2. Install dependencies

From the project root:

```bash
npm install
cd client
npm install
cd ../server
npm install
cd ..
```

### 3. Add the Gemini API key

Open:

```text
server/.env
```

Create it by copying `server/.env.example`.

Set:

```env
GEMINI_API_KEY=your_key_here
PORT=5000
```

Never put the Gemini key in the React frontend.

### 4. Start the app

From the project root:

```bash
npm start
```

The frontend runs at:

```text
http://localhost:5173
```

The backend runs at:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

Expected response:

```json
{
  "status": "ok"
}
```

## How to use

1. Open the frontend.
2. Enter a topic such as:
   `Explain DBMS normalization including 1NF, 2NF and 3NF`.
3. Click **Generate Study Set**.
4. Review the generated flashcards.
5. Flip cards to reveal answers.
6. Take the quiz.
7. Review the result.
8. Retest incorrect questions.

## AI usage note

AI tools were used during development for brainstorming, implementation assistance, debugging suggestions, and code review. The final application structure and code were reviewed and adapted for this assignment, and the author should be able to explain and modify every part of the implementation during the interview.

## Failure handling

The application explicitly handles:

### Malformed JSON
The backend parses the model response inside a `try/catch`. Invalid JSON becomes an error response instead of reaching the UI.

### Wrong shape
The backend validates the parsed result with Zod. The frontend also checks the response shape before rendering.

### Empty response
An empty model response is treated as a failure.

### Slow response
The UI shows a loading state. The frontend also has a request timeout.

### Failed response
The user receives a visible error state with a retry action.

### Stale response
Each generation request receives an increasing request ID. A slower older request is ignored if a newer request has already started.

## Known limitations

- The app depends on the availability and correctness of the selected Gemini model.
- AI-generated educational content can still contain factual mistakes, so it should be reviewed by the learner.
- Sessions are not persisted between page reloads.
- Authentication is intentionally not included because the assignment says it is not required.
- Production deployment would require environment-specific CORS configuration and deployment of both frontend and backend.

## Testing checklist

### Happy path
- Enter a normal topic.
- Generate material.
- Flip cards.
- Complete quiz.
- Retest incorrect questions.

### Empty input
- Click Generate without entering a topic.
- Confirm a visible validation message appears.

### Network failure
- Stop the backend.
- Try generating.
- Confirm an error state and retry button appear.

### Stale request
- Start two generations quickly.
- Confirm an older response cannot overwrite the newer request.

### Mobile
- Open browser DevTools.
- Toggle a mobile viewport.
- Confirm the input, cards, quiz and buttons remain usable.

## Time spent

Approximately spent 6hrs

## Implementation 
<img width="1907" height="835" alt="Screenshot 2026-09-26 103452" src="https://github.com/user-attachments/assets/e3f978d1-9af2-4641-8be0-1ae526fd05ca" />

