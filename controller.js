
let train = {};


document.addEventListener('DOMContentLoaded', async () => {
    // Llamar a la función que carga la lista de archivos
    await loadFileList();

    // Seleccionar el primer archivo automáticamente después de cargar la lista
    const fileSelect = document.getElementById('csvSelect');
    // Verificar si hay opciones disponibles
    if (fileSelect.options.length > 0) {
        fileSelect.selectedIndex = 0;  // Esto selecciona el primer archivo de la lista
        fileSelect.dispatchEvent(new Event('change')); // Dispara el evento 'change' para cargar el archivo automáticamente
    }
    // Agregar el evento change para cargar el archivo seleccionado
    fileSelect.addEventListener('change', loadCSV);


    // Obtener los elementos del DOM
    const openCSVButton = document.getElementById('openCSVButton');
    const csvFileInput = document.getElementById('csvFileInput');
    // Agregar un evento click al botón para abrir el archivo
    openCSVButton.addEventListener('click', () => {
        // Disparar el click del input de archivo oculto
        csvFileInput.click();
    });
    // Agregar un evento change para cuando se seleccione un archivo
    csvFileInput.addEventListener('change', handleFileSelect);


    // Llenar el select con modelos predeterminados
    const mlModelSelect = document.getElementById('mlModel');
    // Aquí defines los modelos manualmente
    const models = [
        { value: 'linear-regression', label: 'Linear Regression' }
    ];
    // Añadir las opciones al select
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.value;
        option.textContent = model.label;
        mlModelSelect.appendChild(option);
    });
    // Agregar el evento 'change' al select de modelos
    //mlModelSelect.addEventListener('change', loadModel);

});

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

// Función para cargar y mostrar el CSV en formato tabla
async function loadCSV() {
    const fileSelect = document.getElementById('csvSelect');
    const url = fileSelect.value;

    if (url) {
        const response = await fetch(url);
        const content = await response.text();

        displayCSVGrid(content);
    }
    const csvFileInput = document.getElementById('csvFileInput');
    csvFileInput.value = ''; 
}

// Función para mostrar los datos del CSV en una tabla HTML
function displayCSVGrid(csvContent) {
    // Dividir el contenido CSV en líneas y asegurarnos de manejar las comas entre comillas
    const rows = csvContent.trim().split('\n').map(row => {
        // Dividir las filas con un método que respeta las comillas
        return row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(cell => cell.replace(/^"|"$/g, '').trim());
    });

    // Verificar si el CSV tiene filas
    if (rows.length === 0) {
        alert('El archivo CSV está vacío.');
        return;
    }

    train = {};

    const table = document.createElement('table');

    // Crear los encabezados de la tabla
    const headerRow = rows[0];
    const thead = document.createElement('thead');
    const header = document.createElement('tr');
    headerRow.forEach(headerCell => {
        const th = document.createElement('th');
        th.textContent = headerCell.trim();
        header.appendChild(th);
        train[headerCell] = [];
    });

    // Rellenar las columnas con los valores de las filas
    rows.slice(1).forEach(row => {
        row.forEach((cell, index) => {
            const columnName = headerRow[index];
            train[columnName].push(cell === '' ? 0 : parseInt(cell));  // Usar null para valores vacíos si se prefiere
        });
    });

    thead.appendChild(header);
    table.appendChild(thead);

    // Crear el cuerpo de la tabla
    const tbody = document.createElement('tbody');
    rows.slice(1).forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell === '' ? '' : cell.trim();  // Si la celda está vacía, dejémosla vacía
            tr.appendChild(td);

        });
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);

    // Limpiar el contenido previo y agregar la nueva tabla
    const displayDiv = document.getElementById('csvDisplay');
    displayDiv.innerHTML = ''; // Limpiar el contenido anterior
    displayDiv.appendChild(table);
    fillVariables();
}

function fillVariables(){
    // Obtener los selectores de los elementos HTML
    const featuresSelect = document.getElementById('featuresSelect');
    const labelSelect = document.getElementById('labelSelect');

    // Obtener las columnas de las características (features) y la etiqueta (label)
    const columns = Object.keys(train);

    // Poblar el select de "features" con todas las columnas
    columns.forEach(col => {
        // Crear una opción para cada columna
        let option = document.createElement('option');
        option.value = col; // Valor del nombre de la columna
        option.textContent = col; // Texto visible para la columna

        // Añadir la opción al select de "features"
        featuresSelect.appendChild(option);
    });

    // Poblar el select de "label" con todas las columnas
    columns.forEach(col => {
        // Crear una opción para cada columna
        let option = document.createElement('option');
        option.value = col; // Valor del nombre de la columna
        option.textContent = col; // Texto visible para la columna

        // Añadir la opción al select de "label"
        labelSelect.appendChild(option);
    });
}

// Función que maneja la selección del archivo CSV desde el dispositivo del usuario
function handleFileSelect(event) {
    const file = event.target.files[0];  // Obtener el archivo seleccionado
    if (!file) return;  // Si no hay archivo seleccionado, salir

    const reader = new FileReader();  // Crear un lector de archivos
    reader.onload = function(e) {
        const content = e.target.result;  // Obtener el contenido del archivo
        displayCSVGrid(content);  // Pasar el contenido al método para mostrarlo en el grid
    };
    reader.readAsText(file);  // Leer el archivo como texto

    const fileSelect = document.getElementById('csvSelect');
    fileSelect.selectedIndex = -1;  // Desmarcar el select
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



/* Loading Machine Learning Models */

// Función para cargar el modelo de Machine Learning
function loadModel(event) {
    const selectedModel = event.target.value;
}

function getSelectedOptions(selectElement) {
    const selectedOptions = [];
    
    // Verificar si es un select múltiple
    if (selectElement.multiple) {
        // Obtener todas las opciones seleccionadas
        for (const option of selectElement.options) {
            if (option.selected) {
                selectedOptions.push(option.value);  // Guardamos el valor de la opción seleccionada
            }
        }
    } else {
        // Si no es un select múltiple, solo obtenemos la opción seleccionada
        selectedOptions.push(selectElement.value);
    }
    
    return selectedOptions;
}

async function fitModel() {
    const mlModelSelect = document.getElementById('mlModel');
    const featuresSelect = document.getElementById('featuresSelect');
    const labelSelect = document.getElementById('labelSelect');
    const X = getSelectedOptions(featuresSelect);
    const y = getSelectedOptions(labelSelect); 
    if (mlModelSelect.value === 'linear-regression'){
        const { LinearRegression, joinArrays } = await import("/dist/mlearn.mjs");

        const myLinearRegression = await LinearRegression(); 
        const model = new myLinearRegression();
        model.fit(train[X[0]], train[y]);
        console.log(train[X[0]]);
        console.log(train[y]);

        yPredict = model.predict(train[X[0]])

        const myjoinArrays = await joinArrays();
        var a = myjoinArrays('x',train[X[0]],'y',train[y],'yPredict',yPredict);
        console.log(a);
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);
        
        function drawChart() {
            var data = google.visualization.arrayToDataTable(a);
            var options = {
                seriesType : 'scatter',
                series: {1: {type: 'line'}}
            };  
            var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
            chart.draw(data, options);         
        }
    }
}


