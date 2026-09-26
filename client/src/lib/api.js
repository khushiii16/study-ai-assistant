const API_URL = "http://localhost:5000";

export async function generateStudySet(topic, signal) {
  const response = await fetch(`${API_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ topic }),
    signal
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    throw new Error("The server returned an unreadable response.");
  }

  if (!response.ok) {
    throw new Error(
      data?.error || "The server could not generate the study set."
    );
  }

  return data;
}
