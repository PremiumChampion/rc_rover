import { HTTPError } from "../HttpError";

export class NotFoundError extends HTTPError {
    public type: string = "Not Found";
    public httpStatusCode: number = 404;
    constructor(message: string) {
        super(message);
    }
}