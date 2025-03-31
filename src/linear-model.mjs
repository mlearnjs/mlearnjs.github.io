export class LinearRegression {
    constructor() {
        this.isFit = false;
        this.m = 0;
        this.b = 0;
    }

    checkDataLength(xTrain, yTrain) {
        if (xTrain.length !== yTrain.length)
            throw new Error('The parameters for training do not have the same length!');
        if (!Array.isArray(xTrain) || !Array.isArray(yTrain))
            throw new Error('The xTrain or yTrain parameters are not arrays.');
        if (xTrain.length === 0 || yTrain.length === 0)
            throw new Error('The xTrain or yTrain parameters are empty!.');
        return true;
    }
      
    fit(xTrain, yTrain) {
        try {
            this.checkDataLength(xTrain, yTrain);
            var sumX = 0;
            var sumY = 0;
            var sumXY = 0;
            var sumXX = 0;
    
            for(var i = 0; i < xTrain.length; i++) {
                sumX += xTrain[i]
                sumY += yTrain[i]
                sumXY += xTrain[i] * yTrain[i]
                sumXX += xTrain[i] * xTrain[i]
            }
            this.m = (xTrain.length * sumXY - sumX * sumY) / (xTrain.length * sumXX - Math.pow(Math.abs(sumX), 2))
            this.b = (sumY * sumXX - sumX * sumXY) / (xTrain.length * sumXX - Math.pow(Math.abs(sumX), 2))        
            this.isFit = true
        } catch (error) {
            console.error(error.message);
        }
    }

    predict(xTest) {
        var yPredict = []
        if (this.isFit) {
            for(var i = 0; i < xTest.length; i++) {
                yPredict.push(this.m * xTest[i] + this.b)
            }            
        }
        return yPredict
    }
    

    mserror(yTrain, yPredict) {
        var mse = 0
        for(var i = 0; i < yTrain.length; i++) {
            mse += Math.pow(yTrain[i]-yPredict[i],2)
        }
        return mse / yTrain.length
    }

    coeficientR2(yTrain, yPredict) 
    {
        var avg=0;
        var numerator = 0;
        var denominator = 0;
        for(var i = 0; i < yTrain.length; i++) {
            avg += yTrain[i]
        }
        avg=avg/yTrain.length;
        for(var i = 0; i < yPredict.length; i++) {
            numerator += Math.pow(yPredict[i]-avg,2);
        }
        for(var i = 0; i < yTrain.length; i++) {
            denominator += Math.pow(yTrain[i]-avg,2);
        }
        return numerator/denominator
    }
}

export class PolynomialRegression {
    constructor(degree) {
        this.degree = degree;  // Grado del polinomio
        this.isFit = false;
        this.coefficients = [];  // Coeficientes del polinomio
    }

    // Método para verificar la validez de los datos de entrada
    checkDataLength(xTrain, yTrain) {
        if (xTrain.length !== yTrain.length)
            throw new Error('The parameters for training do not have the same length!');
        if (!Array.isArray(xTrain) || !Array.isArray(yTrain))
            throw new Error('The xTrain or yTrain parameters are not arrays.');
        if (xTrain.length === 0 || yTrain.length === 0)
            throw new Error('The xTrain or yTrain parameters are empty!');
        return true;
    }

    // Función para construir la matriz de diseño
    buildDesignMatrix(xTrain) {
        const matrix = [];
        for (let i = 0; i < xTrain.length; i++) {
            const row = [];
            for (let j = 0; j <= this.degree; j++) {
                row.push(Math.pow(xTrain[i], j)); // Potencia de x hasta el grado
            }
            matrix.push(row);
        }
        return matrix;
    }

    // Método para ajustar el modelo de regresión polinomial
    fit(xTrain, yTrain) {
        try {
            this.checkDataLength(xTrain, yTrain);

            const X = this.buildDesignMatrix(xTrain);  // Matriz de diseño
            const Y = yTrain;

            // Resolución de los coeficientes utilizando el método de mínimos cuadrados
            const XT = math.transpose(X);  // Transpuesta de la matriz de diseño
            const XTX = math.multiply(XT, X);  // Producto X^T * X
            const XTX_inv = math.inv(XTX);  // Inversa de X^T * X
            const XTY = math.multiply(XT, Y);  // Producto X^T * Y

            // Coeficientes del polinomio
            this.coefficients = math.multiply(XTX_inv, XTY);
            this.isFit = true;
        } catch (error) {
            console.error(error.message);
        }
    }

    // Método para hacer predicciones con el modelo ajustado
    predict(xTest) {
        const yPredict = [];
        if (this.isFit) {
            for (let i = 0; i < xTest.length; i++) {
                let y = 0;
                for (let j = 0; j <= this.degree; j++) {
                    y += this.coefficients[j] * Math.pow(xTest[i], j); // Suma de los términos del polinomio
                }
                yPredict.push(y);
            }
        }
        return yPredict;
    }

    // Error cuadrático medio
    mserror(yTrain, yPredict) {
        let mse = 0;
        for (let i = 0; i < yTrain.length; i++) {
            mse += Math.pow(yTrain[i] - yPredict[i], 2);
        }
        return mse / yTrain.length;
    }

    // Coeficiente de determinación R^2
    coeficientR2(yTrain, yPredict) {
        let avg = 0;
        let numerator = 0;
        let denominator = 0;
        for (let i = 0; i < yTrain.length; i++) {
            avg += yTrain[i];
        }
        avg = avg / yTrain.length;
        for (let i = 0; i < yPredict.length; i++) {
            numerator += Math.pow(yPredict[i] - avg, 2);
        }
        for (let i = 0; i < yTrain.length; i++) {
            denominator += Math.pow(yTrain[i] - avg, 2);
        }
        return numerator / denominator;
    }
}
