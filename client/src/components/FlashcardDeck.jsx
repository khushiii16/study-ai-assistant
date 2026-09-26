import { useState } from "react";

function FlashcardDeck({ flashcards }) {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = flashcards[current];

  function goTo(index) {
    setCurrent(index);
    setFlipped(false);
  }

  function previous() {
    goTo((current - 1 + flashcards.length) % flashcards.length);
  }

  function next() {
    goTo((current + 1) % flashcards.length);
  }

  function toggleFlip() {
    setFlipped((value) => !value);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleFlip();
    }

    if (event.key === "ArrowRight") {
      next();
    }

    if (event.key === "ArrowLeft") {
      previous();
    }
  }

  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">FLASHCARDS</span>
          <h2>Review the concepts</h2>
        </div>
        <span className="counter">
          {current + 1} / {flashcards.length}
        </span>
      </div>

      <div
        className={`flashcard ${flipped ? "flipped" : ""}`}
        role="button"
        tabIndex={0}
        onClick={toggleFlip}
        onKeyDown={handleKeyDown}
        aria-label="Flashcard. Press Enter or Space to flip."
      >
        <div className="flashcard-inner">
          <div className="flashcard-face flashcard-front">
            <span className="card-label">QUESTION</span>
            <h3>{card.question}</h3>
            <span className="flip-hint">
              Click or press Enter to reveal the answer
            </span>
          </div>

          <div className="flashcard-face flashcard-back">
            <span className="card-label">ANSWER</span>
            <p>{card.answer}</p>
            <span className="flip-hint">
              Click to flip back
            </span>
          </div>
        </div>
      </div>

      <div className="card-controls">
        <button onClick={previous}>← Previous</button>
        <button onClick={next}>Next →</button>
      </div>
    </section>
  );
}

export default FlashcardDeck;
