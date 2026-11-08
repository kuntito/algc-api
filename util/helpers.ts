
/**
 * checks a value is a whole number above zero, the shape of an id.
 *
 * anything else returns false.
 */
export const isValidId = (value: unknown): boolean =>
    Number.isInteger(value) && (value as number) > 0;
