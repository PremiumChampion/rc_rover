import { SerilisationFactory, Strategy } from './SerilisationFactory';

export const ApplicationJsonStrategy: Strategy<any> = {
    deserialise: (data: string) => Promise.resolve(JSON.parse(data)),
    for: (acceptHeader: string) => acceptHeader.toLowerCase() == "application/json",
    serialise: (data: Object) => {
        
        return Promise.resolve(JSON.stringify(data));
    },
    contentType: "application/json"
};
