export function convertToNumber(variable) {
    if (typeof variable === 'string') {
        if (variable.trim() !== '') { // Check if the string is not empty after trimming whitespace
            const number = parseFloat(variable); // Attempt to parse string to float
            if (!isNaN(number)) {
                return number; // Return the number if parsing successful
            }
        }
    }
    return null; // Return null if variable is not a string or if it's an empty string
}