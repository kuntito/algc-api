import { Pool } from "pg";

import { drizzle } from "drizzle-orm/node-postgres";
import { envConfig } from "./envConfig";

export const neonDbClient = new Pool({
    connectionString: envConfig.NEON_CONN_STR,
    // encrypts connection, skips certificate verification (acceptable for personal app)
    ssl: { rejectUnauthorized: false },
});

export const algcDb = drizzle(neonDbClient);