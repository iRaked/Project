/**
 * Clase Calculadora que implementa operaciones matemáticas básicas
 */
class Calculadora {
    /**
     * Constructor de la calculadora
     */
    constructor() {
        this.historial = [];
    }

    /**
     * Suma dos números
     * @param {number} a - Primer número
     * @param {number} b - Segundo número
     * @returns {number} Resultado de la suma
     */
    sumar(a, b) {
        this._validarNumeros(a, b);
        const resultado = a + b;
        this._agregarAlHistorial(`${a} + ${b} = ${resultado}`);
        return resultado;
    }

    /**
     * Resta dos números
     * @param {number} a - Primer número
     * @param {number} b - Segundo número
     * @returns {number} Resultado de la resta
     */
    restar(a, b) {
        this._validarNumeros(a, b);
        const resultado = a - b;
        this._agregarAlHistorial(`${a} - ${b} = ${resultado}`);
        return resultado;
    }

    /**
     * Multiplica dos números
     * @param {number} a - Primer número
     * @param {number} b - Segundo número
     * @returns {number} Resultado de la multiplicación
     */
    multiplicar(a, b) {
        this._validarNumeros(a, b);
        const resultado = a * b;
        this._agregarAlHistorial(`${a} * ${b} = ${resultado}`);
        return resultado;
    }

    /**
     * Divide dos números
     * @param {number} a - Dividendo
     * @param {number} b - Divisor
     * @returns {number} Resultado de la división
     * @throws {Error} Si el divisor es cero
     */
    dividir(a, b) {
        this._validarNumeros(a, b);
        if (b === 0) {
            throw new Error("No se puede dividir por cero");
        }
        const resultado = a / b;
        this._agregarAlHistorial(`${a} / ${b} = ${resultado}`);
        return resultado;
    }

    /**
     * Calcula la potencia de un número
     * @param {number} base - Base
     * @param {number} exponente - Exponente
     * @returns {number} Resultado de la potencia
     */
    potencia(base, exponente) {
        this._validarNumeros(base, exponente);
        const resultado = Math.pow(base, exponente);
        this._agregarAlHistorial(`${base}^${exponente} = ${resultado}`);
        return resultado;
    }

    /**
     * Calcula la raíz cuadrada de un número
     * @param {number} numero - Número
     * @returns {number} Raíz cuadrada
     * @throws {Error} Si el número es negativo
     */
    raizCuadrada(numero) {
        this._validarNumeros(numero);
        if (numero < 0) {
            throw new Error("No se puede calcular la raíz cuadrada de un número negativo");
        }
        const resultado = Math.sqrt(numero);
        this._agregarAlHistorial(`√${numero} = ${resultado}`);
        return resultado;
    }

    /**
     * Calcula el porcentaje
     * @param {number} numero - Número base
     * @param {number} porcentaje - Porcentaje a calcular
     * @returns {number} Resultado del porcentaje
     */
    porcentaje(numero, porcentaje) {
        this._validarNumeros(numero, porcentaje);
        const resultado = (numero * porcentaje) / 100;
        this._agregarAlHistorial(`${porcentaje}% de ${numero} = ${resultado}`);
        return resultado;
    }

    /**
     * Obtiene el historial de operaciones
     * @returns {Array} Array con el historial de operaciones
     */
    obtenerHistorial() {
        return [...this.historial];
    }

    /**
     * Limpia el historial de operaciones
     */
    limpiarHistorial() {
        this.historial = [];
    }

    /**
     * Valida que los argumentos sean números válidos
     * @param {...number} numeros - Números a validar
     * @throws {Error} Si algún argumento no es un número válido
     * @private
     */
    _validarNumeros(...numeros) {
        for (const numero of numeros) {
            if (typeof numero !== 'number' || isNaN(numero)) {
                throw new Error("Los argumentos deben ser números válidos");
            }
        }
    }

    /**
     * Agrega una operación al historial
     * @param {string} operacion - Descripción de la operación
     * @private
     */
    _agregarAlHistorial(operacion) {
        this.historial.push(operacion);
    }
}

module.exports = Calculadora;
