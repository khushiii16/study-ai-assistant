import { useRef, useState } from "react";
import PromptInput from "./components/PromptInput";
import ResultView from "./components/ResultView";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import { generateStudySet } from "./lib/api";
import { validateStudyResult } from "./lib/validateResult";

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("empty");
  const [error, setError] = useState("");

  const requestId = useRef(0);
  const controllerRef = useRef(null);

  async function generate() {
    const trimmed = input.trim();

    if (!trimmed) {
      setError("Please enter a topic or some notes.");
      setStatus("error");
      return;
    }

    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    const currentRequestId = ++requestId.current;

    setStatus("loading");
    setError("");
    setResult(null);

    const timeout = setTimeout(() => {
      controller.abort();
    }, 45000);

    try {
      const data = await generateStudySet(
        trimmed,
        controller.signal
      );

      if (currentRequestId !== requestId.current) {
        return;
      }

      const validation = validateStudyResult(data);

      if (!validation.valid) {
        throw new Error(validation.message);
      }

      setResult(validation.data);
      setStatus("success");
    } catch (error) {
      if (currentRequestId !== requestId.current) {
        return;
      }

      if (error.name === "AbortError") {
        setError(
          "The request took too long. Please try again."
        );
      } else {
        setError(
          error.message ||
          "Something went wrong. Please try again."
        );
      }

      setStatus("error");
    } finally {
      clearTimeout(timeout);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    generate();
  }

  function retry() {
    generate();
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="brand-icon">✦</div>
          <div>
            <h1>StudyAI</h1>
            <span>Learn smarter</span>
          </div>
        </div>

        <div className="header-badge">
          AI Study Assistant
        </div>
      </header>

      <main className="container">
        <PromptInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          loading={status === "loading"}
        />

        {status === "empty" && (
          <section className="state-card">
            <div className="empty-icon">✦</div>
            <h2>Turn any topic into a study session</h2>
            <p>
              Enter a topic or paste notes to create interactive
              flashcards and a quiz.
            </p>
          </section>
        )}

        {status === "loading" && <LoadingState />}

        {status === "error" && (
          <ErrorState
            message={error}
            onRetry={retry}
          />
        )}

        {status === "success" && result && (
          <ResultView result={result} />
        )}
      </main>
    </div>
  );
}

export default App;
