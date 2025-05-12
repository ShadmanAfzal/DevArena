const BASE_URL = "http://localhost:3000/api";

export const getAllProblems = async () => {
  const response = await fetch(`${BASE_URL}/problem`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    return {
      error: result.error,
    };
  }

  return {
    data: result.data,
  };
};

export const getProblemBySlug = async (slug: string) => {
  const response = await fetch(`${BASE_URL}/problem/${slug}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    return {
      error: result.error,
    };
  }

  return {
    data: result.data,
  };
};
