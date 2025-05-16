export function separateNumberFromString(str) {
    // Extract numbers using regular expression
    const numbers = str.match(/\d+/g);
    // Extract non-numbers using regular expression
    const nonNumbers = str.match(/\D+/g);
    
    // If there are numbers, join them (in case of multiple numbers)
    const number = numbers ? numbers.join('') : '';
    // If there are non-numbers, join them (in case of multiple non-number parts)
    const nonNumber = nonNumbers ? nonNumbers.join('') : '';

    return {
        number: Number(number),
        nonNumber: nonNumber
    };
}