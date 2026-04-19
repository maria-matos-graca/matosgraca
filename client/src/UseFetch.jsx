// UseFetch.jsx
import api from './services/auth';
import { useState, useEffect } from 'react';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(url)
      .then(response => {
        setData(response.data);
        setIsPending(false);
      })
      .catch(err => {
        setError(err.message);
        setIsPending(false);
      });
  }, [url]);

  return { data, isPending, error };
};

export default useFetch;