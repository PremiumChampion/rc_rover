import { HTTPError } from "../HttpError";

export class InternalServerErrorError extends HTTPError {
    public type: string = "Internal Server Error";
    public httpStatusCode: number = 500;
    constructor(message: string) {
        super(message);
    }
}