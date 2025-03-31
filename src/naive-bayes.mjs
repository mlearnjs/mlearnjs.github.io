export class GaussianNB {
  constructor() {
    this.classProbabilities = {};
    this.featureStats = {}; // Almacena media y desviación estándar para cada clase y cada característica
    this.classes = [];
  }

  // Entrenamiento
  fit(X, y) {
    const classCounts = {};
    const featureSums = {};
    const featureSquaredSums = {};

    // Inicializamos las estructuras de datos
    for (let i = 0; i < y.length; i++) {
      const label = y[i];
      classCounts[label] = (classCounts[label] || 0) + 1;
      if (!featureSums[label]) {
        featureSums[label] = new Array(X[0].length).fill(0);
        featureSquaredSums[label] = new Array(X[0].length).fill(0);
      }

      // Sumamos las características por clase
      for (let j = 0; j < X[i].length; j++) {
        featureSums[label][j] += X[i][j];
        featureSquaredSums[label][j] += X[i][j] ** 2;
      }
    }

    const totalCount = y.length;
    this.classes = Object.keys(classCounts);

    // Calculamos la probabilidad de cada clase
    for (const label of this.classes) {
      this.classProbabilities[label] = classCounts[label] / totalCount;
    }

    // Calculamos la media y desviación estándar de las características para cada clase
    this.featureStats = {};

    for (const label of this.classes) {
      this.featureStats[label] = [];
      for (let i = 0; i < X[0].length; i++) {
        const mean = featureSums[label][i] / classCounts[label];
        const variance = (featureSquaredSums[label][i] / classCounts[label]) - mean ** 2;
        const stdDev = Math.sqrt(variance);
        this.featureStats[label].push({ mean, stdDev });
      }
    }
  }

  // Función para calcular la probabilidad de que un valor siga una distribución normal
  gaussian(x, mean, stdDev) {
    const exponent = Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
    return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * exponent;
  }

  // Predicción
  predict(X) {
    return X.map((sample) => {
      const classScores = this.classes.map((label) => {
        let score = Math.log(this.classProbabilities[label]); // Log de la probabilidad de la clase

        // Calculamos la probabilidad condicional para cada característica
        this.featureStats[label].forEach((featureStats, idx) => {
          score += Math.log(this.gaussian(sample[idx], featureStats.mean, featureStats.stdDev)); // Log de la probabilidad de la característica
        });

        return { label, score };
      });

      // Retorna la clase con la mayor probabilidad
      const bestClass = classScores.reduce((prev, current) => (prev.score > current.score ? prev : current));
      return bestClass.label;
    });
  }
}
  
/*
  // Ejemplo de uso
  const X = [
    [1, 2],
    [1, 3],
    [2, 2],
    [3, 3],
    [3, 4]
  ];
  const y = [0, 0, 1, 1, 0];
  
  const model = new GaussianNB();
  model.fit(X, y);
  
  const predictions = model.predict([[2, 3], [3, 4]]);
  console.log(predictions); // Resultado esperado: [1, 0]
  
*/