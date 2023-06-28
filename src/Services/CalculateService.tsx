import ICalculate from "../Interfaces/ICalculate";

function createResultObject(num1: string, num2: string, operation: string) {
    const result: ICalculate = {
        FirstNumber: num1,
        SecondNumber: num2,
        Operation: operation,
    }
    return result

}

export function Sum(num1: string, num2: string, operation: string) {
    var result = createResultObject(num1, num2, operation)
    console.log(result)
}

//function subtraction(num1, num2, operation) {
//
//}
//
//function multiplication(num1, num2, operation) {
//
//}
//
//function division(num1, num2, operation) {
//
//}
