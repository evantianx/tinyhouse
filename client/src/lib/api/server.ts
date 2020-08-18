interface Body<TVar> {
  query: string;
  variables?: TVar;
}

interface Error {
  message: string;
}

export const server = {
  fetch: async <TData = any, TVar = any>(body: Body<TVar>) => {
    const res = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return res.json() as Promise<{ data: TData; errors: Error[] }>;
  },
};
