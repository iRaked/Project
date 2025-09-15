/**
 * Aplicación principal de la calculadora web
 * Maneja la interfaz de usuario y la lógica de la calculadora
 */

// Variables globales
let calculadora = new Calculadora();
let displayCurrent = document.getElementById('displayCurrent');
let displayHistory = document.getElementById('displayHistory');
let historyContent = document.getElementById('historyContent');
let modal = document.getElementById('modal');
let notification = document.getElementById('notification');

// Estado de la calculadora
let currentNumber = '0';
let previousNumber = null;
let operator = null;
let waitingForNewNumber = false;
let currentOperation = null;

// Inicialización
document.addEventListener('DOMContentLoaded', function () {
    updateDisplay();
    updateHistory();
    setupKeyboardSupport();
    showNotification('¡Bienvenido a la Calculadora JavaScript!', 'success');
});

/**
 * Configura el soporte para teclado
 */
function setupKeyboardSupport() {
    document.addEventListener('keydown', function (event) {
        const key = event.key;

        // Números
        if (key >= '0' && key <= '9') {
            appendNumber(key);
        }
        // Punto decimal
        else if (key === '.') {
            appendNumber('.');
        }
        // Operadores
        else if (key === '+') {
            setOperator('+');
        }
        else if (key === '-') {
            setOperator('-');
        }
        else if (key === '*') {
            setOperator('*');
        }
        else if (key === '/') {
            event.preventDefault(); // Evitar que abra el menú contextual
            setOperator('/');
        }
        // Enter o = para calcular
        else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            calculate();
        }
        // Escape para limpiar
        else if (key === 'Escape') {
            clearAll();
        }
        // Backspace para borrar último dígito
        else if (key === 'Backspace') {
            deleteLast();
        }
    });
}

/**
 * Agrega un número al display actual
 * @param {string} number - Número a agregar
 */
function appendNumber(number) {
    if (waitingForNewNumber) {
        currentNumber = number;
        waitingForNewNumber = false;
    } else {
        if (number === '.' && currentNumber.includes('.')) {
            return; // No permitir múltiples puntos decimales
        }

        if (currentNumber === '0' && number !== '.') {
            currentNumber = number;
        } else {
            currentNumber += number;
        }
    }

    updateDisplay();
}

/**
 * Establece el operador para la operación
 * @param {string} op - Operador (+, -, *, /)
 */
function setOperator(op) {
    if (operator && !waitingForNewNumber) {
        calculate();
    }

    operator = op;
    previousNumber = parseFloat(currentNumber);
    waitingForNewNumber = true;

    // Actualizar el historial del display
    displayHistory.textContent = `${previousNumber} ${getOperatorSymbol(op)}`;
    updateDisplay();
}

/**
 * Obtiene el símbolo del operador para mostrar
 * @param {string} op - Operador
 * @returns {string} Símbolo del operador
 */
function getOperatorSymbol(op) {
    const symbols = {
        '+': '+',
        '-': '-',
        '*': '×',
        '/': '÷'
    };
    return symbols[op] || op;
}

/**
 * Realiza el cálculo
 */
function calculate() {
    if (operator && previousNumber !== null && !waitingForNewNumber) {
        const current = parseFloat(currentNumber);
        let resultado;

        try {
            switch (operator) {
                case '+':
                    resultado = calculadora.sumar(previousNumber, current);
                    break;
                case '-':
                    resultado = calculadora.restar(previousNumber, current);
                    break;
                case '*':
                    resultado = calculadora.multiplicar(previousNumber, current);
                    break;
                case '/':
                    resultado = calculadora.dividir(previousNumber, current);
                    break;
                default:
                    return;
            }

            // Actualizar el historial del display
            displayHistory.textContent = `${previousNumber} ${getOperatorSymbol(operator)} ${current} =`;

            // Mostrar resultado
            currentNumber = calculadora.formatearNumero(resultado);
            operator = null;
            previousNumber = null;
            waitingForNewNumber = true;

            updateDisplay();
            updateHistory();
            showNotification('Cálculo realizado correctamente', 'success');

        } catch (error) {
            showNotification(error.message, 'error');
            clearAll();
        }
    }
}

/**
 * Limpia todo
 */
function clearAll() {
    currentNumber = '0';
    previousNumber = null;
    operator = null;
    waitingForNewNumber = false;
    displayHistory.textContent = '';
    updateDisplay();
}

/**
 * Limpia la entrada actual
 */
function clearEntry() {
    currentNumber = '0';
    updateDisplay();
}

/**
 * Borra el último dígito
 */
function deleteLast() {
    if (currentNumber.length > 1) {
        currentNumber = currentNumber.slice(0, -1);
    } else {
        currentNumber = '0';
    }
    updateDisplay();
}

/**
 * Actualiza el display
 */
function updateDisplay() {
    displayCurrent.textContent = currentNumber;
}

/**
 * Actualiza el historial en la interfaz
 */
function updateHistory() {
    const historial = calculadora.obtenerHistorial();

    if (historial.length === 0) {
        historyContent.innerHTML = '<p class="no-history">No hay operaciones en el historial</p>';
    } else {
        historyContent.innerHTML = historial
            .slice(-10) // Mostrar solo los últimos 10
            .reverse() // Mostrar los más recientes primero
            .map(operacion => `<div class="history-item" onclick="useFromHistory('${operacion}')">${operacion}</div>`)
            .join('');
    }
}

/**
 * Usa un resultado del historial
 * @param {string} operacion - Operación del historial
 */
function useFromHistory(operacion) {
    const resultado = operacion.split(' = ')[1];
    if (resultado) {
        currentNumber = resultado;
        waitingForNewNumber = true;
        updateDisplay();
        showNotification('Resultado cargado desde el historial', 'success');
    }
}

/**
 * Limpia el historial
 */
function clearHistory() {
    calculadora.limpiarHistorial();
    updateHistory();
    showNotification('Historial limpiado', 'success');
}

// Funciones para operaciones avanzadas
let currentAdvancedOperation = null;

/**
 * Calcula la potencia al cuadrado
 */
function calculatePower() {
    const numero = parseFloat(currentNumber);
    if (numero !== 0) {
        try {
            const resultado = calculadora.potencia(numero, 2);
            currentNumber = calculadora.formatearNumero(resultado);
            waitingForNewNumber = true;
            updateDisplay();
            updateHistory();
            showNotification('Potencia calculada', 'success');
        } catch (error) {
            showNotification(error.message, 'error');
        }
    }
}

/**
 * Calcula la raíz cuadrada
 */
function calculateSqrt() {
    const numero = parseFloat(currentNumber);
    try {
        const resultado = calculadora.raizCuadrada(numero);
        currentNumber = calculadora.formatearNumero(resultado);
        waitingForNewNumber = true;
        updateDisplay();
        updateHistory();
        showNotification('Raíz cuadrada calculada', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

/**
 * Calcula porcentaje
 */
function calculatePercentage() {
    currentAdvancedOperation = 'porcentaje';
    showModal('Calcular Porcentaje', 'Número base:', 'Porcentaje:');
}

/**
 * Calcula potencia personalizada
 */
function calculatePowerCustom() {
    currentAdvancedOperation = 'potencia';
    showModal('Calcular Potencia', 'Base:', 'Exponente:');
}

/**
 * Muestra el modal para operaciones avanzadas
 * @param {string} title - Título del modal
 * @param {string} label1 - Etiqueta del primer input
 * @param {string} label2 - Etiqueta del segundo input
 */
function showModal(title, label1, label2) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalLabel1').textContent = label1;
    document.getElementById('modalLabel2').textContent = label2;
    document.getElementById('modalInput1').value = '';
    document.getElementById('modalInput2').value = '';

    const input2Group = document.getElementById('modalInput2Group');
    if (currentAdvancedOperation === 'porcentaje' || currentAdvancedOperation === 'potencia') {
        input2Group.style.display = 'block';
    } else {
        input2Group.style.display = 'none';
    }

    modal.style.display = 'block';
    document.getElementById('modalInput1').focus();
}

/**
 * Cierra el modal
 */
function closeModal() {
    modal.style.display = 'none';
    currentAdvancedOperation = null;
}

/**
 * Ejecuta la operación avanzada
 */
function executeAdvancedOperation() {
    const input1 = parseFloat(document.getElementById('modalInput1').value);
    const input2 = parseFloat(document.getElementById('modalInput2').value);

    if (isNaN(input1)) {
        showNotification('Por favor, ingresa un número válido', 'error');
        return;
    }

    try {
        let resultado;

        switch (currentAdvancedOperation) {
            case 'porcentaje':
                if (isNaN(input2)) {
                    showNotification('Por favor, ingresa un porcentaje válido', 'error');
                    return;
                }
                resultado = calculadora.porcentaje(input1, input2);
                break;
            case 'potencia':
                if (isNaN(input2)) {
                    showNotification('Por favor, ingresa un exponente válido', 'error');
                    return;
                }
                resultado = calculadora.potencia(input1, input2);
                break;
            default:
                return;
        }

        currentNumber = calculadora.formatearNumero(resultado);
        waitingForNewNumber = true;
        updateDisplay();
        updateHistory();
        closeModal();
        showNotification('Operación avanzada completada', 'success');

    } catch (error) {
        showNotification(error.message, 'error');
    }
}

/**
 * Muestra una notificación
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación (success, error)
 */
function showNotification(message, type = 'success') {
    const notificationText = document.getElementById('notificationText');
    notificationText.textContent = message;

    notification.className = `notification ${type}`;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Cerrar modal al hacer clic fuera de él
window.onclick = function (event) {
    if (event.target === modal) {
        closeModal();
    }
}

// Cerrar modal con tecla Escape
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});
