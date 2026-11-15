
/**
 * checks a value is a whole number above zero, the shape of an id.
 *
 * anything else returns false.
 */
export const isValidId = (value: unknown): boolean =>
    Number.isInteger(value) && (value as number) > 0;


/**
 * checks that no value appears twice in the list.
 *
 * values are compared the way `Set` compares them: numbers and strings
 * by value, objects by reference. two objects with the same contents
 * still count as different.
 */
export const isUniqueList = <T,>(
    values: T[]
): boolean => {
    const valueSet = new Set(values);

    return valueSet.size === values.length;
};