export function trainTestSplit(X, y, testSize = 0.2, randomState = 42) {
    // Crear un objeto de estado aleatorio basado en la semilla (si es necesario)
    function setSeed(seed) {
        const seedrandom = require('seedrandom');
        return seedrandom(seed);
    }
    
    // Unir X y y en un array de objetos
    const data = X.map((feature, index) => ({
        feature,
        label: y[index]
    }));

    // Configurar el generador de números aleatorios
    const rng = setSeed(randomState);

    // Aleatorizar los datos
    data.sort(() => rng() - 0.5); // Desordenar aleatoriamente

    // Calcular el índice de división para la prueba
    const testSizeIndex = Math.floor(data.length * testSize);

    // Dividir los datos en entrenamiento y prueba
    const testData = data.slice(0, testSizeIndex);
    const trainData = data.slice(testSizeIndex);

    // Separar X e y para los conjuntos de entrenamiento y prueba
    const xTrain = trainData.map(d => d.feature);
    const yTrain = trainData.map(d => d.label);
    const xTest = testData.map(d => d.feature);
    const yTest = testData.map(d => d.label);

    return { xTrain, xTest, yTrain, yTest };
}

// Datos de ejemplo
//const X = [[1], [2], [3], [4], [5]];
//const y = [1, 2, 3, 4, 5];

// Dividir los datos
//const { X_train, X_test, y_train, y_test } = trainTestSplit(X, y, 0.33, 42);

//console.log("X_train:", X_train);
//console.log("X_test:", X_test);
//console.log("y_train:", y_train);
//console.log("y_test:", y_test);


export function joinArrays() {
    var a = []
    if (arguments.length == 6) {
        a.push([arguments[0],arguments[2],arguments[4]])
        for(var i = 0; i < arguments[1].length; i++) {
            a.push([arguments[1][i],arguments[3][i],arguments[5][i]])
        }
    }
    return a
}

export function zip(arrays) {
    return arrays[0].map(function(_,i){
        return arrays.map(function(array){return array[i]})
    });
}