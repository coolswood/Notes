import axios, { Method } from "axios";

export const ApiRequest = <R>(
    data: string,
    method: Method = 'POST'
): Promise<R> => {
    return axios({
        url: `https://mind-health.ru/gq`,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        method,
        data: {
            query: data,
        },
    }).then(({ data }) => data.data);
};

export const getRandomInt = () => {
    const min = 1;
    const max = 100000;

    return Math.floor(Math.random() * (max - min)) + min;
}