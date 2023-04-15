import { EnviromentError } from "../ErrorHandling/SevereError/Enviroment/EnviromentError";
import { SevereError } from "../ErrorHandling/SevereError/SevereError";
import { MainThreadLogger } from "../Logger/MainThreadLogger";

export class ENVParameter {
    private key: string;
    private validator: (value: string) => boolean;

    constructor(key: string, validator: (value: string) => boolean) {
        this.key = key;
        this.validator = validator;
        ENVParameterChecker.registerEnviromentVariable(this);
    }

    public validate(): boolean {
        return this.validator(process.env[this.key]);
    }

    public getValue() {
        if (this.validate()) {
            return process.env[this.key];
        } else {
            throw new EnviromentError(this.key);
        }
    }
    public getKey(): string {
        return this.key;
    }
}



export class ENVParameterChecker {
    private static enviromentDefinitions: ENVParameter[] = [];
    private static enviromentInvalid: boolean = false;
    public static registerEnviromentVariable(envParameter: ENVParameter) {
        this.enviromentDefinitions.push(envParameter);
    }

    public static validateEnviroment() {
        let logger = new MainThreadLogger();

        ENVParameterChecker.enviromentDefinitions.forEach(enviromentDefinition => {
            if (!enviromentDefinition.validate()) {
                ENVParameterChecker.enviromentInvalid = true;
                logger.error("[ENVIROMENT]", new EnviromentError(enviromentDefinition.getKey()).message);
            } else {
                logger.info("[ENVIROMENT]", `Enviroment variable "${enviromentDefinition.getKey()}" valid.`)
            }
        })

        if (ENVParameterChecker.enviromentInvalid) {
            console.error("Enviroment configuration missing or invalid. See logs for more information.");
            throw new SevereError("Enviroment configuration missing or invalid. See logs for more information.");
        }
    }
}