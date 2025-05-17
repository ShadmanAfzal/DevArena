import { Language } from "@dev-arena/shared";

const env = import.meta.env;

const toBase64 = (str: string) => {
  const utf8Bytes = new TextEncoder().encode(str);

  const binaryString = Array.from(utf8Bytes)
    .map((b) => String.fromCharCode(b))
    .join("");

  return btoa(binaryString);
};

export const executeExpression = async (
  problemId: string,
  code: string,
  language: Language
) => {
  const response = await fetch(
    `${env.VITE_BACKEND_API_ENDPOINT}/problem/${problemId}/run`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: toBase64(code),
        language: language,
      }),
    }
  );

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
