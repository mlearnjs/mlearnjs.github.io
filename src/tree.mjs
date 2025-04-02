export class DecisionTreeClassifier {
    constructor() {
        this.tree = null;
    }

    // Método principal que entrena el modelo
    fit(X, y) {
        this.tree = this.buildTree(X, y);
    }

    // Función recursiva que construye el árbol
    buildTree(X, y) {
        const uniqueLabels = [...new Set(y)];
        
        // Caso base: Si todas las etiquetas son iguales, devuelve la etiqueta
        if (uniqueLabels.length === 1) {
            return { label: uniqueLabels[0] };
        }

        // Caso base: Si no hay más características, devuelve la etiqueta mayoritaria
        if (X[0].length === 0) {
            const majorityLabel = this.majorityLabel(y);
            return { label: majorityLabel };
        }

        // Encuentra el mejor atributo para dividir
        const bestFeatureIndex = this.bestSplit(X, y);
        const bestFeatureValues = [...new Set(X.map(row => row[bestFeatureIndex]))];

        // Crear nodo del árbol
        const node = {
            featureIndex: bestFeatureIndex,
            featureValues: bestFeatureValues,
            children: []
        };

        // Dividir los datos por el valor del mejor atributo
        bestFeatureValues.forEach(value => {
            const indices = X.map((row, idx) => (row[bestFeatureIndex] === value ? idx : -1)).filter(idx => idx !== -1);
            const XSubset = indices.map(idx => X[idx].filter((_, i) => i !== bestFeatureIndex));
            const ySubset = indices.map(idx => y[idx]);

            // Llamada recursiva para construir los nodos hijos
            const childNode = this.buildTree(XSubset, ySubset);
            node.children.push({ value, childNode });
        });

        return node;
    }

    // Calcular la entropía
    entropy(y) {
        const labelCounts = {};
        y.forEach(label => labelCounts[label] = (labelCounts[label] || 0) + 1);
        const total = y.length;
        let entropyValue = 0;

        Object.values(labelCounts).forEach(count => {
            const prob = count / total;
            entropyValue -= prob * Math.log2(prob);
        });

        return entropyValue;
    }

    // Calcular la ganancia de información para un atributo
    informationGain(X, y, featureIndex) {
        const featureValues = [...new Set(X.map(row => row[featureIndex]))];
        const totalEntropy = this.entropy(y);
        let weightedEntropy = 0;

        featureValues.forEach(value => {
            const indices = X.map((row, idx) => (row[featureIndex] === value ? idx : -1)).filter(idx => idx !== -1);
            const ySubset = indices.map(idx => y[idx]);

            const entropyValue = this.entropy(ySubset);
            weightedEntropy += (ySubset.length / y.length) * entropyValue;
        });

        return totalEntropy - weightedEntropy;
    }

    // Seleccionar el mejor atributo con la mayor ganancia de información
    bestSplit(X, y) {
        let bestGain = -Infinity;
        let bestFeatureIndex = -1;

        for (let i = 0; i < X[0].length; i++) {
            const gain = this.informationGain(X, y, i);
            if (gain > bestGain) {
                bestGain = gain;
                bestFeatureIndex = i;
            }
        }

        return bestFeatureIndex;
    }

    // Calcular la etiqueta mayoritaria
    majorityLabel(y) {
        const labelCounts = {};
        y.forEach(label => labelCounts[label] = (labelCounts[label] || 0) + 1);
        return Object.keys(labelCounts).reduce((a, b) => labelCounts[a] > labelCounts[b] ? a : b);
    }

    // Predecir las etiquetas para un conjunto de datos
    predict(X) {
        return X.map(row => this.predictRow(row, this.tree));
    }

    // Predicción recursiva para una sola fila
    predictRow(row, tree) {
        if (tree.label !== undefined) {
            return tree.label;
        }

        const value = row[tree.featureIndex];
        const childNode = tree.children.find(child => child.value === value);

        return this.predictRow(row, childNode.childNode);
    }
}
/*
// Ejemplo de uso
const X = [
    [1, 1],
    [1, 2],
    [2, 2],
    [2, 3],
    [3, 3],
    [3, 4],
    [4, 4]
];

const y = ['A', 'A', 'B', 'B', 'A', 'A', 'B'];

const model = new C4_5();
model.fit(X, y);
const predictions = model.predict([
    [1, 1],
    [3, 3]
]);

console.log('Predicciones:', predictions);
*/