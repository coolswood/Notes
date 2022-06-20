import axios, { Method } from "axios";
import dayjs from "dayjs";
import { api } from "diary-mind-health";

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