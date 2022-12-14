export const retries: any = async (
    fetcher: any,
    vars: object[],
    retry = 0,
): Promise<typeof retries> => {
    if (retry < 0) {
        throw new Error("exceed retry limit");
    }

    try {
        let response = await fetcher(
            vars,
            process.env[`${retry + 1}`],
            retry,
        );
        return response;
    } catch (error: any) {
        const is_bad = error.response.data && error.response.data.message === "Bad credentials";
        
        if (is_bad) {
            console.log(`${retry + 1} Failed`);
            retry++;
            return await retries(fetcher, vars, retry);
        } else {
            return error.response;
        }
    }
};