export class LabelEncoder{
    constructor() {
      this.classes_ = [];
      this.classToIndex = {};
      this.indexToClass = {};
    }
  
    // Ajusta el encoder a las clases de las etiquetas
    fit(y) {
      // Obtiene las clases únicas en las etiquetas
      this.classes_ = [...new Set(y)];
      
      // Crea el mapeo de clase -> índice
      this.classToIndex = {};
      this.indexToClass = {};
      
      this.classes_.forEach((cls, idx) => {
        this.classToIndex[cls] = idx;
        this.indexToClass[idx] = cls;
      });
    }
  
    // Transforma las etiquetas a valores numéricos
    transform(y) {
      if (this.classes_.length === 0) {
        throw new Error("fit() debe ser llamado antes de transform.");
      }
      
      return y.map(label => {
        if (!(label in this.classToIndex)) {
          throw new Error(`Etiqueta "${label}" no encontrada en las clases entrenadas.`);
        }
        return this.classToIndex[label];
      });
    }
  
    // Transforma las etiquetas numéricas de vuelta a las etiquetas originales
    inverseTransform(y) {
      return y.map(index => {
        if (!(index in this.indexToClass)) {
          throw new Error(`Índice "${index}" no encontrado en las clases entrenadas.`);
        }
        return this.indexToClass[index];
      });
    }
  
    // Combinación de fit() y transform() en un solo paso
    fitTransform(y) {
      this.fit(y);
      return this.transform(y);
    }
}

  /*
  // Ejemplo de uso:
  const labels = ["cat", "dog", "fish", "dog", "cat"];
  
  const encoder = new LabelEncoder();
  encoder.fit(labels);
  
  // Transformar etiquetas de texto a valores numéricos
  const transformed = encoder.transform(labels);
  console.log(transformed); // [0, 1, 2, 1, 0]
  
  // Volver a transformar valores numéricos a etiquetas originales
  const original = encoder.inverse_transform(transformed);
  console.log(original); // ["cat", "dog", "fish", "dog", "cat"]
  */