const env = import.meta.env;

export const getAllProblems = async () => {
  const response = await fetch(`${env.VITE_BACKEND_API_ENDPOINT}/problem`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
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
  const response = await fetch(
    `${env.VITE_BACKEND_API_ENDPOINT}/problem/${slug}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    }
  );

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
