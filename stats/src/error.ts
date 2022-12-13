export class MissingParams extends Error {
    constructor(missedParams: string[], message: string) {
        const msg = `Missing params: ${missedParams.join(', ')}`;
        super(msg);

        this.message = message;
    }
}