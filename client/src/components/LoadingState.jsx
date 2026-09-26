function LoadingState() {
  return (
    <section className="state-card" aria-live="polite">
      <div className="spinner" />
      <h2>Creating your study set...</h2>
      <p>
        The AI is turning your input into structured study material.
      </p>
    </section>
  );
}

export default LoadingState;
