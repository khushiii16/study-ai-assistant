function ErrorState({ message, onRetry }) {
  return (
    <section className="state-card error-card" role="alert">
      <div className="error-icon">!</div>
      <h2>We couldn't create that</h2>
      <p>{message}</p>
      <button onClick={onRetry}>Try Again</button>
    </section>
  );
}

export default ErrorState;
