import { NextFunction, Request as _Request, Response as _Response } from 'express';
import { HTTPErrorCallback } from './errorHandling/http/HTTPErrorCallback';
import { MainThreadRequestLogger } from './Logger/MainThreadRequestLogger';
import { Mapper } from './Mapper/Mapper';

export interface FrameworkRequest extends _Request {
    params: {
        readonly correlationID: string;
        [key: string]: any
    }
    readonly logger: MainThreadRequestLogger;
}

export interface FrameworkResponse extends _Response {

}

export abstract class RouteTemplate {
    public abstract handle(req: FrameworkRequest, res: FrameworkResponse, next: NextFunction, error: HTTPErrorCallback): Promise<any>;
}

/**
 * The Mapper for the current project
 * 
 * @export
 * @class Controller
 * @extends {Mapper<(req: FrameworkRequest, res: FrameworkResponse, next: NextFunction) => void>}
 */
export class RouteMapper extends Mapper<RouteTemplate>{

    constructor() {
        super(require.context("./Controller", true, /\.(ts|js|mjs)$/)); // the context is injected at build time
    }
}

export const routeMapper = new RouteMapper();
