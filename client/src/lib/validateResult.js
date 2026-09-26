function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateStudyResult(data) {
  if (!data || typeof data !== "object") {
    return {
      valid: false,
      message: "The AI returned an invalid result."
    };
  }

  if (!isNonEmptyString(data.title)) {
    return {
      valid: false,
      message: "The AI result is missing a title."
    };
  }

  if (!isNonEmptyString(data.summary)) {
    return {
      valid: false,
      message: "The AI result is missing a summary."
    };
  }

  if (!Array.isArray(data.flashcards) || data.flashcards.length < 3) {
    return {
      valid: false,
      message: "The AI returned invalid flashcards."
    };
  }

  for (const card of data.flashcards) {
    if (
      !isNonEmptyString(card?.question) ||
      !isNonEmptyString(card?.answer)
    ) {
      return {
        valid: false,
        message: "One of the flashcards has an invalid shape."
      };
    }
  }

  if (!Array.isArray(data.quiz) || data.quiz.length < 3) {
    return {
      valid: false,
      message: "The AI returned invalid quiz questions."
    };
  }

  for (const question of data.quiz) {
    if (
      !isNonEmptyString(question?.question) ||
      !Array.isArray(question?.options) ||
      question.options.length !== 4 ||
      !Number.isInteger(question.answer) ||
      question.answer < 0 ||
      question.answer > 3 ||
      !isNonEmptyString(question.explanation)
    ) {
      return {
        valid: false,
        message: "One of the quiz questions has an invalid shape."
      };
    }
  }

  return {
    valid: true,
    data
  };
}
