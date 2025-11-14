"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const knex_1 = __importDefault(require("knex"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const isProduction = process.env.NODE_ENV === 'production';
const dbConfig = isProduction ? {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
        directory: '../migrations'
    },
    pool: {
        min: 2,
        max: 10
    }
} : {
    client: 'sqlite3',
    connection: {
        filename: './dev.sqlite3'
    },
    useNullAsDefault: true,
    migrations: {
        directory: '../migrations'
    }
};
exports.db = (0, knex_1.default)(dbConfig);
exports.default = dbConfig;
//# sourceMappingURL=database.js.map