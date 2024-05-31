import { useState } from "react";

type UseFetchReturnType<T> = {
  data: T | null;
  fetchData: (...args: Parameters<typeof fetch>) => void;
  requestDuration: number /** The request duration in ms */;
  isLoading: boolean;
  error?: any;
};

export function useFetch<T extends any>(): UseFetchReturnType<T> {
  const [requestDuration, setRequestDuration] = useState(0);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(undefined);
  const [isLoading, setLoading] = useState(false);

  const fetchData = (...args: Parameters<typeof fetch>) => {
    const start_time = Date.now();
    setLoading(true);
    fetch(...args)
      .then((response) => {
        if (!response.ok) throw Error("Error while fetching data");
        return response.json();
      })
      .then((json) => {
        setData(json as T);
      })
      .catch((err) => {
        setError(err);
        setData(null);
      })
      .finally(() => {
        const end_time = Date.now();
        setRequestDuration(end_time - start_time);
        setLoading(false);
      });
  };
  return { data, fetchData, isLoading, requestDuration, error };
}
