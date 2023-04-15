import { NextFunction } from "express";
import { FrameworkRequest, FrameworkResponse, RouteTemplate } from "../../controller";
import { SerilisationFactory } from "../../serialiser/SerilisationFactory";
import { InternalServerErrorError } from "./Errors/InternalServerError";
import { HTTPError } from "./HttpError";

export class HTTPErrorHandler extends RouteTemplate {
    public error: HTTPError;

    constructor(error: HTTPError | Error) {
        super();

        if (!HTTPError.isHTTPError(error)) {
            error = new InternalServerErrorError(error.message);
        }

        this.error = error as HTTPError;
    }

    public async handle(req: FrameworkRequest, res: FrameworkResponse, next: NextFunction) {
        try {
            const data = {
                error: { type: this.error.type, message: this.error.message, code: this.error.httpStatusCode },
                correlationID: req.params.correlationID
            };

            let send = await SerilisationFactory.getSerialiser<typeof data>({ req: req as any })(data);
            let contentType = SerilisationFactory.getTargetContentType({ req: req as any });

            res.setHeader("Content-Type", contentType);
            res.status(this.error.httpStatusCode);
            res.send(send);

        } catch (error) {
            res.end();
        }
    }
}