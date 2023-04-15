import { RouteDecorator, RoutePropertyDescriptor } from "./RouteDecorator";
import * as joi from "joi";
import { HTTPError } from "../errorHandling/http/HttpError";
import { BadRequestError } from "../errorHandling/http/errors/BadRequest";



export type BodyValidationDecorator = RouteDecorator & ((schema: joi.Schema) => (target: any, propertyKey: string, descriptor: RoutePropertyDescriptor) => void)


/**
* allows to validate the request body of a request
* 
*
* @param {joi.Schema} schema the scopes to allow
* @return {*} void
*/
export const BodyValidation: BodyValidationDecorator = (schema: joi.Schema) => {
    return function (target: any, propertyKey: string, descriptor: RoutePropertyDescriptor): void {

        let method = descriptor.value;

        descriptor.value = async (req, res, next, errorCallback) => {
            try {
                req.body = await schema.validateAsync(req.body, { convert: true })
                req.logger.info("[BODY=VALID]");

                method(req, res, next, errorCallback);
            } catch (error) {

                if (!(error instanceof Error)) {
                    error = new Error(error);
                }

                if (!HTTPError.isHTTPError(error)) {
                    error = new BadRequestError(error.message);
                }

                req.logger.warn("[BODY=INVALID]", req.body, `[MESSAGE=${error.message}]`);

                errorCallback(error);
            }
        };
    };
};

