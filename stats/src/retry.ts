import { fetcher } from "./fetch";
/**
 * Try to execute the `fetch` function until it success or the max limit is reached.
 * 
 * @param {object[]} retryparams Object that contains the `createTextNode`
 * @param {function} retryparams.f Function to execute
 * @param {object[]} retryparams.variables Variables to pass to the `fetch` function
 * @param {number} retryparams.tries Number of times to retry
 * @returns {Promise<retry>} Promise with the result of the `fetch` function
 */
export const retry = async (
    f: Object[],
    variables: Object[], 
    tries: number,
    ) => {
        if (tries <= 0) {
            throw new Error('Max tries reached');
        }
        try {
            let response = await fetcher(
                variables,
                f,
                tries,
            )
        }
    }