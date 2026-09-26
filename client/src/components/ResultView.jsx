import FlashcardDeck from "./FlashcardDeck";
import Quiz from "./Quiz";

function ResultView({ result }) {
  return (
    <section className="results" aria-live="polite">
      <div className="study-header">
        <span className="eyebrow">AI GENERATED STUDY SET</span>
        <h1>{result.title}</h1>
        <p>{result.summary}</p>
      </div>

      <FlashcardDeck flashcards={result.flashcards} />
      <Quiz questions={result.quiz} />
    </section>
  );
}

export default ResultView;
