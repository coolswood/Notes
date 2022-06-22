import axios, { Method } from 'axios';

export const ApiRequest = <R, T>(
  url: string,
  data: T,
  method: Method = 'POST'
): Promise<R> => {
  return axios({
    url: `/api/${url}`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
    method,
    data,
  }).then(({ data }) => data);
};

export const getRandomInt = () => {
  const min = 1000;
  const max = 100000;

  return String(Math.floor(Math.random() * (max - min)) + min);
};

export const randomColourGenerator = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
};
