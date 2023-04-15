import { ApplicationJsonStrategy } from './application-json.strategy';
import { Strategy } from './SerilisationFactory';

export const DefaultStrategy: Strategy<any> = {
    ...ApplicationJsonStrategy,
    for: (acceptHeader: string) => true,
};
