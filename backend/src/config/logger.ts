import winston from "winston";

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // structured logs for prod
  ),
  transports: [
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === "production"
          ? winston.format.simple() // cleaner in prod
          : winston.format.colorize({ all: true }),
    }),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

// In production, log uncaught errors as well
if (process.env.NODE_ENV === "production") {
  logger.exceptions.handle(
    new winston.transports.File({ filename: "logs/exceptions.log" })
  );
}

export default logger;
