export function binarySearchIndex(array, number) {
    let lowerBound = 0;
    let upperBound = array.length;
    let i = 0
    while (lowerBound !== upperBound) {
        // console.log(`start of loop
        // current lower: ${lowerBound}
        // current upper: ${upperBound}`)
        let midpoint = Math.floor((lowerBound+upperBound)/2);
        // console.log(`midpoint index: ${midpoint}. midpoint value: ${array[midpoint]}`)
        // console.log(`comparing number (${number}) to midpoint value`)
        if (number > array[midpoint]) {
            // console.log("midpoint value too low")
            // console.log(`previous lowerBound: ${lowerBound}`)
            lowerBound = midpoint + 1;
            // console.log(`new lowerBound: ${lowerBound}`)
        } else if (number < array[midpoint]) {
            // console.log("midpoint value too high")
            // console.log(`previous upperBound: ${upperBound}`)
            upperBound = midpoint;
            // console.log(`new upperBound: ${upperBound}`)
        } else {
            // console.log("index found")
            return midpoint
        }
        if (i > 1000) {
            console.log(`error:
            lower bound: ${lowerBound}
            upper bound: ${upperBound}
            midpoint: ${midpoint}
            i: ${i}`);
            throw "binary searched too many times (>1000 loops)"
        }
        i++

    }
    return lowerBound
}

export function sortArray(numbers) {
    let inArray = numbers.split(",");
    let outArray = []
    inArray.forEach(function(number){
        outArray.splice(binarySearchIndex(outArray, number), 0, number)
        console.log(outArray);
    })
    return outArray
}

export function factorNumber(number) {
    const factors = [];
    for (let i = 1; i <= number; i++) {
        if (number % i === 0) {
            factors.push(i);
        };
    };
    return factors
}

export function isPrime(num) {
    return (factorNumber(num).length === 2)
}

function findPrimeFactorisation(number) {  // unit tested
    if (number !== number) {
        throw Error("Input is not a number")
    } else if (!Number.isInteger(number)) {
        throw Error("Input is not an integer")
    } else if ([0, 1].includes(number)) {
        throw Error(`Input (${number}) cannot be factorised`)
    } else if (number < 0) {
        throw Error("Input is negative and cannot be factorised")
    }
    let workingNumber = number;
    let outArray = [];
    let j = 0;
    while (!isPrime(workingNumber)) {
        findDivisor: for (let i = 2; i <= workingNumber; i++) {
            if (workingNumber % i === 0) {
                workingNumber /= i;
                outArray.push(i);
                break findDivisor
            }
        }
        j++
        if (j>10000) {
            throw "too many loops"
        }
    }
    outArray.push(workingNumber);
    // console.log(outArray)
    // outArray.sort();
    // console.log(outArray)
    return outArray;
}

export function mergeArrays(array1, array2) {
    let noDupesArray = array1.filter(element => !(array2.includes(element)))
    return noDupesArray.concat(array2);  // not sorted
}

export function productOfContents(arrayOfNumbers) {  // unit tested
    return arrayOfNumbers.reduce((accumulator, currentValue) => accumulator*currentValue, 1)
}

export function findDuplicatesInArrays(array1, array2) { // unit tested
    const outArray = [];
    const workingArray = array2;
    for (const element of array1) {
        if (workingArray.includes(element)) {
            outArray.push(element)
            const workingArrayIndex = workingArray.indexOf(element)
            workingArray.splice(workingArrayIndex, 1)
        }
    }
    return outArray
}

export function getLowestCommonMultiple(num1, num2) {
    const primeFactors = mergeArrays(factorNumber(num1), factorNumber(num2)).filter(num => isPrime(num))
    console.log(primeFactors)
    const productOfPrimeFactors = primeFactors.reduce((accumulator, currentValue) => accumulator*currentValue)
    return productOfPrimeFactors
}