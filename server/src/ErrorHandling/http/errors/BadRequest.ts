import { HTTPError } from "../HttpError";

export class BadRequestError extends HTTPError {
    public type = "Bad Request";
    public httpStatusCode: number = 400;
    constructor(message: string) {
        super(message);
    }
}