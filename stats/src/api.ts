import { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from "axios";
import axios from "axios";
import { retries } from "./utils";

/**
 * Send GraphQL request to GitHub API
 * @param data Request data
 * @param headers Request headers
 * @returns Request response
 */
const request = (
    data: AxiosRequestConfig['data'],
    headers: AxiosRequestConfig['headers']
): Promise<any> => {
    return axios({
        url: "https://api.github.com/graphql",
        method: "POST",
        data,
        headers,
    })
}

const fetchData = (
    variable: AxiosRequestHeaders,
    token: string
): Promise<AxiosResponse> => {
    return request({
        query: `
            fragment RepoInfo on Repository {
                name
                nameWithOwner
                isPrivate
                isArchived
                isTemplate
                stargazers {
                    totalCount
                }
                description
                primaryLanguage {
                    color
                    id
                    name
                }
                forkCount
            }
            query getRepo($login: String!, $repo: String!) {
                user(login: $login) {
                    repository(name: $repo) {
                    ...RepoInfo
                }
            }
            organization(login: $login) {
                repository(name: $repo) {
                    ...RepoInfo
                    }
                }
            }
            `,
            variable,
        },
    {
        Authorization: `token ${token}`,
    });
}

const urlExample = "/api/pin?username=USERNAME&amp;repo=REPO_NAME";

/**
 * fetch repository data from github api
 * @param userName Get GitHub `username`
 * @param repoName Get GitHub repository `name`
 * @returns Return repository `data`
 */
export const fetchRepo = async (
    userName: string, 
    repoName: string
): Promise<RepositoryData | undefined> => {
    if (!userName && !repoName) {
        throw new Error("username and repo name is empty");
    }

    if (!userName) {
        throw new Error("username is empty");
    }

    if (!repoName) {
        throw new Error("repo name is empty");
    }

    let res = await retries(fetchData, { login: userName, repo: repoName });
    const data = res.data.data;

    if (!data.user && !data.organization) {
        throw new Error("user or organization is empty");
    }

    const isUser = data.organization === null && data.user;
    const isOrg = data.user === null && data.organization;

    if (isUser) {
        if (!data.user.repository || data.user.repository.isPrivate) {
            throw new Error("repository is private or cannot found");
        }
        return {
            ...data.user.repository,
            starCount: data.user.repository.stargazers.totalCount,
        };
    }

    if (isOrg) {
        if (!data.organization.repository || data.organization.repository.isPrivate) {
            throw new Error("repository is private or cannot found");
        }

        return {
            ...data.organization.repository,
            starCount: data.organization.repository.stargazers.totalCount,
        };
    }
};

type RepositoryData ={
    name: string;
    nameWithOwner: string;
    isPrivate: boolean;
    isArchived: boolean;
    isTemplate: boolean;
    stargazers: {
        totalCount: number;
    };
    description: string;
    primaryLanguage: {
        name: string;
        color: string;
        id: string;
    };
    forkCount: number;
    starCount: number;
}