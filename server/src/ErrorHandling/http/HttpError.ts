import { type } from "os";

export abstract class HTTPError extends Error {
    public abstract type: string;
    public abstract httpStatusCode: number;
    constructor(message: string) {
        super(message);
    }
    public static isHTTPError(error: HTTPError | Error): error is HTTPError {
        if (error instanceof HTTPError) return true;
        if (!isNil(error["type"]) && !isNil(error["httpStatusCode"])) return true;

        return false;
    }
}

function isNil(val: any) {
    return val == null || val == undefined;
}