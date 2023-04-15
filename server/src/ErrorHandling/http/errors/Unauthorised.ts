import { HTTPError } from "../HttpError";

export class UnauthorisedError extends HTTPError {
    public type: string = "Unauthorized";
    public httpStatusCode: number = 401;
    constructor(message: string) {
        super(message);
    }
}