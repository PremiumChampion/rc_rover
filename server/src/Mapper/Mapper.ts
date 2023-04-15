import { BadRequestError } from "../errorHandling/http/errors/BadRequest";
import { NotFoundError } from "../errorHandling/http/errors/NotFound";

/**
 * a generic cache tape
 *
 * @export
 * @type
 * @template T The type of the default exports of the route handler
 */
export type Cache<T> = { [key: string]: T; };
/**
 * a generic module type
 *
 * @export
 * @type
 * @template T The type of the default exports of the route handler
 */
export type Module<T> = { default: T; };
/**
 * a generic route tree type for traversing recursively
 * 
 * @export
 * @type {{ routes: Cache<RouteTree<T>> | null; methods: Cache<Module<T>> | null; }}
 * @template T The type of the default exports of the route handler
 */
export type RouteTree<T> = {
    routes: Cache<RouteTree<T>> | null;
    methods: Cache<Module<T>> | null;
};
/**
 * a generic request interface
 * 
 * @export
 * @type {{ routes: Cache<RouteTree<T>> | null; methods: Cache<Module<T>> | null; }}
 */
export interface IRequest {
    /**
     * the method of the request
     * 
     * @type {string}
     * @memberOf IRequest
     */
    method: string;
    /**
     *  the URL of the request
     * 
     * @type {string}
     * @memberOf IRequest
     */
    url: string;
    /**
     *  a params object where the availavle params will be injected
     * 
     * @type {{
     *         [key: string]: string;
     *     }}
     * @memberOf IRequest
     */
    params?: {
        [key: string]: string;
    };
};

/**
 * indicates that a given class has a default contructor
 *
 * @export
 * @interface IConstructable
 * @template T the class with the default contructor
 */
export interface IConstructable<T> {
    new(): T;
};

/**
 * constructs a instance of a constructable class
 *
 * @template T the class to instanciate
 * @param {IConstructable<T>} ctor the constructable class
 * @return {*}  {T} the class instance
 */
function construct<T>(ctor: IConstructable<T>): T {
    return new ctor();
}

/**
 * A astract class for creating mvc routes
 * This class can only be used when using webpack.
 *
 * @export
 * @abstract
 * @class MVC
 * @template T The type of the default exports of the route handler
 */
export abstract class Mapper<T> {

    /**
     * contains the necesarry regular expretions for parsing methods and urlParameter
     * 
     * @protected
     * @type {{
     *         method: RegExp;
     *         urlParam: RegExp;
     *     }}
     * @memberOf Mapper
     */
    protected regExp: {
        method: RegExp;
        urlParam: RegExp;
    } = {
            method: /\.(tsx?|jsx?|mjs)$/g,
            urlParam: /^\[.*\]$/i
        };

    /**
     * the route cache of the MVC controller
     *
     * @private
     * @type {RouteTree<T>}
     * @memberof Mapper
     */
    private routeTree: RouteTree<IConstructable<T>> = {
        methods: null,
        routes: null
    };

    /**
     * Creates an instance of MVC.
     * @param {__WebpackModuleApi.RequireContext} context This attribute is used to define the root of the mvc mapping (`require.context('./../relative/path/to/routes', true, /\.(tsx?|jsx?|mjs)$/)`)
     * 
     * @memberOf Mapper
     */
    constructor(context: __WebpackModuleApi.RequireContext) {
        this.createRouteTree(context);
    }

    /**
     * generates the current route cache
     *
     * @private
     * @param {__WebpackModuleApi.RequireContext} r the require context
     * @memberof Mapper
     */
    private createRouteTree(r: __WebpackModuleApi.RequireContext) {
        r.keys().forEach((key) => // loop over each path
        {
            let url = key.toLowerCase(); // ignore casing
            let path = url.split("/").slice(1); // ignore leading ""
            let method = path.pop().replace(this.regExp.method, ""); // parse method

            let currentContext = this.routeTree;
            path.forEach(path => {
                if (isNil(currentContext.routes)) {
                    currentContext.routes = {};
                }

                if (isNil(currentContext.routes[path])) {
                    currentContext.routes[path] = {
                        methods: null,
                        routes: null,
                    };
                }

                currentContext = currentContext.routes[path];
            });

            if (isNil(currentContext.methods)) {
                currentContext.methods = {};
            }

            currentContext.methods[method] = r(key);
        });
    }

    /**
     * resolves a route tree
     * 
     * @private
     * @param {{ req: IRequest; }} { req } the request
     * @returns 
     * 
     * @memberOf Mapper
     */
    private mapTree({ req }: { req: IRequest; }) {
        let pathname = new URL(req.url, `http://localhost`).pathname;
        pathname = pathname.toLowerCase(); // ignore casing

        let path = pathname.split("/").slice(1); // remove leading ''
        if (pathname == "/") path = []; // removes bug on bad request

        let currentContext = this.routeTree;

        path.forEach(pathSegment => {
            // check if a route with the pathsegmentname exists
            let routePresent: boolean = isNil(currentContext.routes[pathSegment]) == false;

            if (!routePresent) {
                let parameterRoute: string | undefined = Object.keys(currentContext.routes).filter(route => this.regExp.urlParam.test(route))[0]; // select the first parameter route

                if (!isNil(parameterRoute)) {
                    let parameterName: string = parameterRoute.substring(1, parameterRoute.length - 1);

                    if (isNil(req.params)) req.params = {};

                    req.params[parameterName] = pathSegment; // set the parameter value equal to the url segment inside the request
                    pathSegment = parameterRoute; // select the first parameter route
                } else {
                    // the url can not pe mapped to the available routes
                    throw new NotFoundError(`The requested URL ${pathname} was not found on this server.`);
                }
            }
            currentContext = currentContext.routes[pathSegment];
        });

        return currentContext;
    }

    /**
     *  resolves a method from a route tree
     * 
     * @private
     * @param {{ req: IRequest, tree: RouteTree<IConstructable<T>>; }} { req, context } the request and routetree
     * @returns  the method to use
     * 
     * @memberOf Mapper
     */
    private mapMethod({ req, tree: context }: { req: IRequest, tree: RouteTree<IConstructable<T>>; }) {
        let method: string = req.method;

        method = method.toLowerCase(); // ignore casing

        if (Object.keys(context.methods).indexOf(method) == -1) // check if method exists in available methods
        {
            throw new BadRequestError(`The method ${method.toUpperCase()} is not allowed for the requested URL.`);
        }

        return context.methods[method];
    }

    /**
     * Resolves a given route or the fallback route
     *
     * @param {string} route the route to resolve
     * @param {string} method the method of the route to resolve
     * @return {*}  {T} the type of the default export of the handler
     * @memberof Mapper
     */
    public map({ req }: { req: IRequest; }): T {
        let context: RouteTree<IConstructable<T>> = this.mapTree({ req });
        let methodHandler = this.mapMethod({ req, tree: context });
        return construct<T>(methodHandler.default);
    }
}

//#region helper
function isNil(val: any) {
    return val == null || val == undefined;
}
//#endregion
