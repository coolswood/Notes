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