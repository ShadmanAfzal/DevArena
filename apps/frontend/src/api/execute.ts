import Language from "../types/Language";

const BASE_URL = "http://localhost:3000/api";

const toBase64 = (str: string) => {
  const utf8Bytes = new TextEncoder().encode(str);

  const binaryString = Array.from(utf8Bytes)
    .map((b) => String.fromCharCode(b))
    .join("");

  return btoa(binaryString);
};

export const executeExpression = async (
  expression: string,
  language: Language
) => {
  if (!expression) return;

  const response = await fetch(`${BASE_URL}/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      expression: toBase64(expression),
      language: language,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    return {
      error: result.error,
      errorType: result.errorType,
    };
  }

  return {
    data: result.data,
  };
};
