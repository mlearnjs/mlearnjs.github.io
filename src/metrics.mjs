export function accuracyScore(y, yPredict) {
    let correct = 0;

    for (let i = 0; i < y.length; i++)
        if (y[i] === yPredict[i])
            correct++;

    let accuracy = correct / y.length;
    return accuracy;
}
