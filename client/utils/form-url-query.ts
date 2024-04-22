import queryString from "query-string";

export const formUrlQuery = (
  params: string,
  key: string,
  value: string | null,
) => {
  if (typeof window !== "undefined") {
    const currentUrl = queryString.parse(params as string);

    currentUrl[key] = value;

    return queryString.stringifyUrl(
      {
        url: window.location.pathname,
        query: currentUrl,
      },
      { skipNull: true },
    );
  }
};
export const deleteQuery = (params: string, key: string) => {
  const currentUrl = queryString.parse(params as string);

  queryString.exclude(window.location.pathname, (name) => name === key);

  return queryString.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
};
