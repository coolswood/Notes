import axios, { Method } from "axios";

export const ApiRequest = <R, T>(
    url: string,
    data: T,
    method: Method = 'POST'
): Promise<R> => {
    return axios({
        url: `http://localhost:3001/api/${url}`,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        method,
        data,
    }).then(({ data }) => data.data);
};

export const getRandomInt = () => {
    const min = 1;
    const max = 100000;

    return Math.floor(Math.random() * (max - min)) + min;
}