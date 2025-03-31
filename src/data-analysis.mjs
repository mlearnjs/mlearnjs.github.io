// Función para leer un archivo CSV
function readCSVFile(file, callback) {
    const reader = new FileReader();
    
    // Leer el archivo como texto
    reader.readAsText(file);
    
    reader.onload = function(event) {
        const csvText = event.target.result;
        const data = parseCSV(csvText);
        callback(data);
    };
    
    reader.onerror = function(event) {
        console.error('Error reading file:', event.target.error);
    };
}

// Función para convertir el CSV en un formato similar a pandas (Array de objetos)
function parseCSV(csvText) {
    // Separar las filas por saltos de línea
    const rows = csvText.trim().split('\n');
    
    // Separar los encabezados (primera fila) y el resto de los datos
    const headers = rows[0].split(',');

    // Convertir cada fila en un objeto con clave:valor
    const data = rows.slice(1).map(row => {
        const values = row.split(',');
        const obj = {};
        headers.forEach((header, index) => {
            obj[header.trim()] = values[index].trim();
        });
        return obj;
    });

    return data;
}

// Función para filtrar los datos según una columna y un valor dado
function filterData(data, column, value) {
    return data.filter(row => parseFloat(row[column]) > value);
}

// Función para calcular el promedio de una columna
function calculateMean(data, column) {
    const sum = data.reduce((acc, row) => acc + parseFloat(row[column]), 0);
    return sum / data.length;
}

// Función para seleccionar una columna específica de los datos
function selectColumn(data, column) {
    return data.map(row => row[column]);
}
