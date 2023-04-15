import { HTTPError } from "../HttpError";

export class ForbiddenError extends HTTPError {
    public type = "Forbidden";
    public httpStatusCode: number = 403;
    constructor(message: string) {
        super(message);
    }
}