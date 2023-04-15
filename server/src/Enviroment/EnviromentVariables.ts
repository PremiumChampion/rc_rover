import { ENVParameter, ENVParameterChecker } from "./ENVParamenterChecker";

export const ENVIROMENT = {
    port: new ENVParameter("PORT", (value) => Number.isNaN(Number(value)) == false),
}

ENVParameterChecker.validateEnviroment();