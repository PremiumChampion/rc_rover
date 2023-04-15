import { NextFunction, Request, Response } from 'express';
import { SerilisationFactory } from '../serialiser/SerilisationFactory';
import { FrameworkRequest, FrameworkResponse, RouteTemplate } from '../controller';
import { HTTPErrorCallback } from '../errorHandling/http/HTTPErrorCallback';

// Route: /
// Method: GET

export default class extends RouteTemplate {

    public async handle(req: FrameworkRequest, res: FrameworkResponse, next: NextFunction, errorCallback: HTTPErrorCallback) {
        try {

            let send = await SerilisationFactory.getSerialiser<string>({ req: req as any })("NO CONTENT");
            let contentType = SerilisationFactory.getTargetContentType({ req: req as any });

            res.setHeader("Content-Type", contentType).status(200).send(send).end();
        } catch (error) {
            errorCallback(error);
        }
    };
}