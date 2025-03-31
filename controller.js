import { MachineLearningModel } from './model/model.mjs'; // Asumiendo que tienes un archivo de modelo exportado

let model;

// Obtener la lista de archivos CSV de la carpeta ./csv/ en el repositorio de GitHub
async function loadFileList() {
    const response = await fetch(`https://api.github.com/repos/mlearnjs/mlearnjs.github.io/contents/csv`);
    const data = await response.json();

    const fileSelect = document.getElementById('csvSelect');

    if (Array.isArray(data)) {
        data.forEach(file => {
            if (file.type === 'file' && file.name.endsWith('.csv')) {
                const option = document.createElement('option');
                option.value = file.download_url; // URL para descargar el archivo
                option.textContent = file.name; // Nombre del archivo
                fileSelect.appendChild(option);
            }
        });
    }
}

// Llamada inicial para cargar la lista de archivos CSV al cargar la página
loadFileList();

// Vincula la función de carga CSV al selector de archivo
document.getElementById('csvSelect').addEventListener('change', loadCSV);

// Función para cargar y mostrar el CSV en formato tabla
async function loadCSV() {
    const fileSelect = document.getElementById('csvSelect');
    const url = fileSelect.value;

    if (url) {
        const response = await fetch(url);
        const content = await response.text();

        displayGridCSV(content);
    }
}

// Función para mostrar los datos del CSV en una cuadrícula
function displayCSVGrid(rows) {
    const csvDisplay = document.getElementById('csvDisplay');
    csvDisplay.innerHTML = '';  // Limpiar el área anterior

    const table = document.createElement('table');
    rows.forEach((row, index) => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
    csvDisplay.appendChild(table);
}

// Función para cargar el modelo de Machine Learning
function loadModel(event) {
    const modelFile = event.target.value;
    if (modelFile) {
        import(`./model/${modelFile}`)
            .then(m => {
                model = m.default; // Asumiendo que el modelo es exportado por defecto
                console.log("Modelo cargado:", model);
            })
            .catch(error => console.error("Error loading model:", error));
    }
}

// Función para hacer predicciones
function predictValues() {
    const input = document.getElementById('predictInput').value;
    if (input && model) {
        const prediction = model.predict(input);  // Asumiendo que `predict` es un método del modelo
        document.getElementById('predictionResults').value = prediction;
        renderChart(prediction);
    } else {
        alert("Por favor, ingresa datos y selecciona un modelo.");
    }
}

// Función para renderizar el gráfico con Google Charts
function renderChart(prediction) {
    google.charts.load('current', {
        packages: ['corechart', 'line']
    });
    google.charts.setOnLoadCallback(() => {
        const data = new google.visualization.DataTable();
        data.addColumn('number', 'X');
        data.addColumn('number', 'Predicción');

        data.addRows(prediction.map((value, index) => [index, value])); // Asumiendo que prediction es un arreglo de valores

        const options = {
            title: 'Predicciones',
            curveType: 'function',
            legend: { position: 'bottom' }
        };

        const chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Llenar el combo de archivos CSV
    fetch('./csv')
        .then(response => response.text())
        .then(data => {
            const files = data.split('\n').filter(file => file.endsWith('.csv'));
            const select = document.getElementById('csvFile');
            files.forEach(file => {
                const option = document.createElement('option');
                option.value = file;
                option.textContent = file;
                select.appendChild(option);
            });
        });
});

