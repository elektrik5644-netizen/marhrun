declare const dbConfig: {
    client: string;
    connection: string | undefined;
    migrations: {
        directory: string;
    };
    pool: {
        min: number;
        max: number;
    };
    useNullAsDefault?: undefined;
} | {
    client: string;
    connection: {
        filename: string;
    };
    useNullAsDefault: boolean;
    migrations: {
        directory: string;
    };
    pool?: undefined;
};
export declare const db: import("knex").Knex<any, unknown[]>;
export default dbConfig;
//# sourceMappingURL=database.d.ts.map