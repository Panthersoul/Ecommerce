import dotenv from "dotenv";
import pino from "pino";
import pretty from "pino-pretty"

dotenv.config();

const buildInfoLogger = () => {
    const infoLogger = pino(
        {

            transport: {
                target: 'pino-pretty',
                options: {
                  colorize: true
                }
              }
        }
    );
    infoLogger.level = "info";
    
    return infoLogger;
}

const buildErrorLogger = () => {
    const errorLogger = pino("./logs/error.log",{
        transport: {
            target: 'pino-pretty',
            options: {
              colorize: true
            }
          }
    } );
    errorLogger.level = "error";
    return errorLogger;
}

let info = buildInfoLogger();
let error = buildErrorLogger();

const logger = {info, error}
export default logger;
