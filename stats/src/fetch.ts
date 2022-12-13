import request from "./utils";
import { MissingParams } from "./error";
import { RepositoryData } from './types';
import { AxiosResponse } from "axios";

const dummyRepoUrl = "/api/pin?username=USERNAME&amp;repo=REPO_NAME";

/**
 * Fetches the stats for a given Repository.
 *
 * @param {import('axios').AxiosRequestHeaders} variables Fetcher variables
 * @param {string} token GitHub token
 * @returns {Promise<import('axios').AxiosResponse>} Axios response
 */
export const fetcher = (
    variables: any, 
    token: string
    ): Promise<AxiosResponse> => {
	return request(
		{
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
			variables,
		},
		{
			Authorization: `token ${token}`,
		}
	);
};

/**
 * Fetch Repository data
 *
 * @param {string} username GitHub user name
 * @param {string} reponame GitHub repository name
 * @returns {Promise<import('./types').RepositoryData>} Repository data
 */
const fetchRepo = async (
    username: string, 
    reponame: string
    ): RepositoryData => {
        if (!username || !reponame) {
            throw new Error("Username or repository name not provided");
        }

        if (!username) throw new MissingParams(["username"], dummyRepoUrl);
        if (!reponame) throw new MissingParams(["reponame"], dummyRepoUrl);
    };