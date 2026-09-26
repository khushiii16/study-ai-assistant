import { useState } from "react";

function Quiz({ questions }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [mode, setMode] = useState("all");
  const [retestIndexes, setRetestIndexes] = useState([]);

  const activeIndexes =
    mode === "wrong" ? retestIndexes : questions.map((_, i) => i);

  const originalIndex = activeIndexes[current];
  const question = questions[originalIndex];

  const score = questions.reduce((total, item, index) => {
    return total + (answers[index] === item.answer ? 1 : 0);
  }, 0);

  const wrongIndexes = questions
    .map((_question, index) => index)
    .filter(
      (index) =>
        answers[index] !== undefined &&
        answers[index] !== questions[index].answer
    );

  function chooseAnswer(index) {
    if (answers[originalIndex] !== undefined) {
      return;
    }

    setAnswers((previous) => ({
      ...previous,
      [originalIndex]: index
    }));
  }

  function next() {
    if (current === activeIndexes.length - 1) {
      setFinished(true);
      return;
    }

    setCurrent((value) => value + 1);
  }

  function startRetest() {
    setRetestIndexes(wrongIndexes);
    setMode("wrong");
    setCurrent(0);
    setFinished(false);
  }

  function restartAll() {
    setMode("all");
    setRetestIndexes([]);
    setCurrent(0);
    setAnswers({});
    setFinished(false);
  }

  if (!question && activeIndexes.length === 0) {
    return (
      <section className="section quiz-results">
        <span className="eyebrow">QUIZ</span>
        <h2>No questions need a retest.</h2>
        <button onClick={restartAll}>Restart Quiz</button>
      </section>
    );
  }

  if (finished) {
    return (
      <section className="section quiz-results">
        <span className="eyebrow">QUIZ COMPLETE</span>

        <h2>
          {mode === "wrong"
            ? "Retest complete"
            : `You scored ${score}/${questions.length}`}
        </h2>

        <p>
          {mode === "wrong"
            ? wrongIndexes.length === 0
              ? "You cleared the questions you missed."
              : `You still have ${wrongIndexes.length} question${
                  wrongIndexes.length === 1 ? "" : "s"
                } to review.`
            : wrongIndexes.length === 0
              ? "Perfect — you got every question right."
              : `You have ${wrongIndexes.length} question${
                  wrongIndexes.length === 1 ? "" : "s"
                } to review.`}
        </p>

        {mode === "all" && wrongIndexes.length > 0 && (
          <button onClick={startRetest}>
            Retest Wrong Answers
          </button>
        )}

        <button className="secondary-button" onClick={restartAll}>
          Restart Full Quiz
        </button>
      </section>
    );
  }

  const selected = answers[originalIndex];
  const answered = selected !== undefined;

  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            {mode === "wrong" ? "RETEST" : "QUIZ"}
          </span>
          <h2>Test yourself</h2>
        </div>

        <span className="counter">
          {current + 1} / {activeIndexes.length}
        </span>
      </div>

      <div className="quiz-card">
        <h3>{question.question}</h3>

        <div className="options">
          {question.options.map((option, index) => {
            let className = "option";

            if (answered) {
              if (index === question.answer) {
                className += " correct";
              } else if (index === selected) {
                className += " incorrect";
              }
            }

            return (
              <button
                key={`${originalIndex}-${index}`}
                className={className}
                onClick={() => chooseAnswer(index)}
                disabled={answered}
              >
                <span>{String.fromCharCode(65 + index)}</span>
                {option}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="explanation">
            <strong>
              {selected === question.answer
                ? "Correct!"
                : "Not quite."}
            </strong>
            <p>{question.explanation}</p>
          </div>
        )}

        {answered && (
          <button className="next-question" onClick={next}>
            {current === activeIndexes.length - 1
              ? "See Results"
              : "Next Question →"}
          </button>
        )}
      </div>
    </section>
  );
}

export default Quiz;
