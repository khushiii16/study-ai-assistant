function PromptInput({
  value,
  onChange,
  onSubmit,
  loading
}) {
  return (
    <form className="prompt-panel" onSubmit={onSubmit}>
      <div>
        <span className="eyebrow">START LEARNING</span>
        <h2>What do you want to learn?</h2>
        <p>
          Enter a topic, chapter, or paste your notes. StudyAI
          will turn them into flashcards and a quiz.
        </p>
      </div>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Example: Explain DBMS normalization including 1NF, 2NF and 3NF..."
        maxLength={2000}
        rows={6}
        disabled={loading}
        aria-label="Study topic or notes"
      />

      <div className="prompt-footer">
        <span>{value.length}/2000</span>

        <button
          type="submit"
          disabled={loading || !value.trim()}
        >
          {loading ? "Generating..." : "Generate Study Set →"}
        </button>
      </div>
    </form>
  );
}

export default PromptInput;
