import axios, { AxiosRequestConfig } from "axios"

/**
 * Send GraphQL request to GitHub API
 * 
 * @param {import('axios').AxiosRequestConfig['data']} data Request data 
 * @param {import('axios').AxiosRequestConfig['headers']} headers Request headers
 * 
 * @returns {Promise<any>} Axios response
 */
export const request = (
    data: AxiosRequestConfig['data'], 
    headers: AxiosRequestConfig['headers']): Promise<any> => {
    // @ts-ignore
    return axios({
        url: "https://api.github.com/graphql",
        method: "post",
        headers,
        data,
    });
}

export default request;