import { SevereError } from "../SevereError";

export class EnviromentError extends SevereError {
    constructor(enviromentVariableKey: string) {
        super(`Enviroment variable "${enviromentVariableKey}" is missing or invlaid.`)
    }
}