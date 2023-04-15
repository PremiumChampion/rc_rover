import { verify, VerifyOptions, setConfig } from "azure-ad-verify-token";
import { JwtPayload } from "jsonwebtoken";
import { ForbiddenError } from "../errorHandling/http/errors/Forbidden";
import { UnauthorisedError } from "../errorHandling/http/errors/Unauthorised";
import { HTTPError } from "../errorHandling/http/HttpError";

const options: VerifyOptions = {
    jwksUri: 'https://login.microsoftonline.com/common/discovery/keys', // same for every azure ad app
    // https://sts.windows.net/{tenantid}/
    // known from from https://login.microsoftonline.com/common/.well-known/openid-configuration
    issuer: 'https://sts.windows.net/e5a27ec3-662f-4581-b6fb-462676aa77c1/',
    audience: 'api://de298b2b-bffd-41a6-b767-ba9f8f540803', // api://{clientid},
};

const verifyBaererToken: (token: string, config: VerifyOptions) => Promise<IAzureTokenInformation | null> = async (token: string, config: VerifyOptions) => {
    try {
        let tokenInformation = await verify(token.replace("Bearer ", ""), config) as IAzureTokenInformation;
        return tokenInformation;
    } catch (error) {
        return null;
    }
};

interface IAzureTokenInformation extends JwtPayload {
    /**
     * the issuer
     *
     * @type {string}
     * @memberof ITokenInformation
     */
    iss: string | undefined;
    sub: string | undefined;
    /**
     * audiance
     *
     * @type {string}
     * @memberof ITokenInformation
     */
    aud: string | string[] | undefined;
    exp: number | undefined;
    nbf: number | undefined;
    iat: number | undefined;
    jti: string | undefined;
    acr: string;
    aio: string;
    amr: string[],
    appid: string;
    appidacr: string;
    family_name: string;
    given_name: string;
    ipaddr: string;
    name: string;
    oid: string;
    rh: string;
    /**
     * all scopes space-delimited
     *
     * @type {string}
     * @memberof ITokenInformation
     */
    scp: string;
    tid: string;
    unique_name: string;
    upn: string;
    uti: string;
    ver: string;
}

export const VerifyAzureBaererToken = async (token: string | undefined, scopes: string[]) => {
    try {
        token = token ?? "";
        let tokenInformation: IAzureTokenInformation | null = await verifyBaererToken(token, options);
        if (!tokenInformation) throw new UnauthorisedError("Access denied.");

        let tokenScopes = tokenInformation.scp.split(" ");
        let oneMandatoryScopePresent = scopes.some(scope => tokenScopes.some(tScope => tScope == scope));

        if (!oneMandatoryScopePresent) throw new ForbiddenError("You do not have the permission to access this ressource.");
    } catch (err) {
        if (err instanceof HTTPError) throw err;
        console.error(err);
    }
}