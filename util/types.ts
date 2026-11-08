import { PgTransaction } from "drizzle-orm/pg-core";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { ExtractTablesWithRelations } from "drizzle-orm";

export type ValidationFailure = {
    isValid: false;
    reason: string;
}

export type ValidationSuccess<T> = {
    isValid: true;
    data: T,
}

export type ValidationResult<T> = ValidationFailure | ValidationSuccess<T>;



export type Transaction = PgTransaction<
    NodePgQueryResultHKT,
    Record<string, never>,
    ExtractTablesWithRelations<Record<string, never>>
>;
