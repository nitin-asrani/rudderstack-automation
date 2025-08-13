"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// utils/logger.ts
const winston_1 = require("winston");
const logger = (0, winston_1.createLogger)({
    level: 'info',
    format: winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: 'logs/test-run.log', level: 'info' })
    ],
});
exports.default = logger;
//# sourceMappingURL=logger.js.map