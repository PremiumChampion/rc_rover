import { BadRequestError } from "../errorHandling/http/errors/BadRequest";
import { ApplicationJsonStrategy } from "./application-json.strategy";
import { DefaultStrategy } from "./default.strategy";

export type Serialiser<T> = (data: T) => Promise<string>;

export type Deserialiser<T> = (data: string) => Promise<T>;

export type Strategy<T> = {
    for: (acceptHeader: string) => boolean;
    serialise: Serialiser<T>;
    deserialise: Deserialiser<T>;
    contentType: string;
};

/**
 * a generic request interface
 * 
 * @export
 * @type {{ routes: Cache<RouteTree<T>> | null; methods: Cache<Module<T>> | null; }}
 */
export interface IRequest {
    headers: {
        accept: string;
        "Content-Type": string;
    };
};

export class SerilisationFactory {
    private static strategies: Strategy<any>[] = [];

    private static default = DefaultStrategy;

    public static registerStrategy(strategy: Strategy<any>) {
        this.strategies.push(strategy);
    }

    public static getSerialiser<T>({ req }: { req: IRequest; }): Serialiser<T> {
        let accepts = req.headers.accept.split(".");
        let serialiser: Serialiser<T> = null;
        let strategy = null;

        accepts.find((accept) => {
            strategy = SerilisationFactory.strategies.find(strategy => strategy.for(accept));
        });

        serialiser = !isNil(strategy) ? strategy.serialise : SerilisationFactory.default.serialise;

        return serialiser;
    }

    public static getDeserialiser<T>({ req }: { req: IRequest; }): Deserialiser<T> {
        let contentType = req.headers['Content-Type'];
        let deserialiser: Deserialiser<T> = null;

        let strategy = SerilisationFactory.strategies.find(strategy => strategy.for(contentType));

        if (!isNil(strategy)) {
            deserialiser = strategy.deserialise;
        }

        if (isNil(deserialiser)) {
            throw new NoDeserialiserFoundError(`Can not process content-type header: ${contentType}`);
        }
        return deserialiser;
    }

    public static getTargetContentType({ req }: { req: IRequest; }) {
        let accepts = req.headers.accept.split(".");
        let contentType: string = null;
        let strategy = null;

        accepts.find((accept) => {
            strategy = SerilisationFactory.strategies.find(strategy => strategy.for(accept));
        });


        contentType = !isNil(strategy) ? strategy.contentType : SerilisationFactory.default.contentType;

        return contentType;
    }
}

SerilisationFactory.registerStrategy(ApplicationJsonStrategy);

export class NoSerialiserFoundError extends BadRequestError {
    constructor(message) {
        super(message);
    }
}
export class NoDeserialiserFoundError extends BadRequestError {
    constructor(message) {
        super(message);
    }
}

function isNil(val: any) {
    return val == null || val == undefined;
}