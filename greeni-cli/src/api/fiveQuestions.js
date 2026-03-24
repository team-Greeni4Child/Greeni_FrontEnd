import { request } from "./client";

export async function createFiveQuestionsHint(answer) {
  return request("/api/ai/five-questions/hint", {
    method: "POST",
    body: JSON.stringify({ answer }),
  });
}

export async function checkFiveQuestionsAnswer({ recordPath, answer, sessionId }) {
  const formData = new FormData();

  formData.append("voice", {
    uri: recordPath,
    name: "five_questions_answer.mp4",
    type: "audio/mp4",
  });
  formData.append("answer", answer);

  if (sessionId) {
    formData.append("session_id", sessionId);
  }

  return request("/api/ai/five-questions/check", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}
