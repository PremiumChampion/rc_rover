import { VerifyAzureBaererToken } from "../Authentication/VerifyAzureBaererToken";
import { RouteDecorator, RoutePropertyDescriptor } from "./RouteDecorator";


export type AuthDecorator = RouteDecorator & ((mandatoryScopes: string[]) => (target: any, propertyKey: string, descriptor: RoutePropertyDescriptor) => void);

/**
* allows to secure a route with authentication in from Azure
* 
*
* @param {string[]} scopes the scopes to allow
* @return {*} void
*/
export const auth: AuthDecorator = (scopes: string[]) => {
    return function (target: any, propertyKey: string, descriptor: RoutePropertyDescriptor): void {

        let method = descriptor.value;

        descriptor.value = async (req, res, next, errorCallback) => {
            try {
                req.logger.info("[AUTHENTICATION=PENDING]")
                await VerifyAzureBaererToken(req.headers.authorization, scopes);
                req.logger.info("[AUTHENTICATION=SUCCESS]")
                method(req, res, next, errorCallback);
            } catch (error) {
                req.logger.warn("[AUTHENTICATION=FAIL]")
                errorCallback(error);
            }
        };
    };
};

