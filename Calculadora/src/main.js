const Calculadora = require('./calculadora');
const readline = require('readline');

/**
 * Programa principal que demuestra el uso de la calculadora
 */
class ProgramaCalculadora {
    constructor() {
        this.calculadora = new Calculadora();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    /**
     * Inicia el programa principal
     */
    async iniciar() {
        console.log('🧮 ¡Bienvenido a la Calculadora JavaScript! 🧮\n');

        // Demostración automática de funcionalidades
        this.demostrarFuncionalidades();

        // Menú interactivo
        await this.mostrarMenu();
    }

    /**
     * Demuestra las funcionalidades de la calculadora
     */
    demostrarFuncionalidades() {
        console.log('📊 DEMOSTRACIÓN DE FUNCIONALIDADES:\n');

        try {
            // Operaciones básicas
            console.log('🔢 Operaciones Básicas:');
            console.log(`   5 + 3 = ${this.calculadora.sumar(5, 3)}`);
            console.log(`   10 - 4 = ${this.calculadora.restar(10, 4)}`);
            console.log(`   6 × 7 = ${this.calculadora.multiplicar(6, 7)}`);
            console.log(`   15 ÷ 3 = ${this.calculadora.dividir(15, 3)}`);

            // Operaciones avanzadas
            console.log('\n🚀 Operaciones Avanzadas:');
            console.log(`   2³ = ${this.calculadora.potencia(2, 3)}`);
            console.log(`   √16 = ${this.calculadora.raizCuadrada(16)}`);
            console.log(`   20% de 150 = ${this.calculadora.porcentaje(150, 20)}`);

            // Manejo de errores
            console.log('\n⚠️  Manejo de Errores:');
            try {
                this.calculadora.dividir(5, 0);
            } catch (error) {
                console.log(`   División por cero: ${error.message}`);
            }

            try {
                this.calculadora.raizCuadrada(-4);
            } catch (error) {
                console.log(`   Raíz de número negativo: ${error.message}`);
            }

            // Historial
            console.log('\n📝 Historial de Operaciones:');
            const historial = this.calculadora.obtenerHistorial();
            historial.forEach((operacion, index) => {
                console.log(`   ${index + 1}. ${operacion}`);
            });

        } catch (error) {
            console.error('Error en la demostración:', error.message);
        }

        console.log('\n' + '='.repeat(50) + '\n');
    }

    /**
     * Muestra el menú interactivo
     */
    async mostrarMenu() {
        while (true) {
            console.log('🎯 MENÚ PRINCIPAL:');
            console.log('1. Sumar');
            console.log('2. Restar');
            console.log('3. Multiplicar');
            console.log('4. Dividir');
            console.log('5. Potencia');
            console.log('6. Raíz cuadrada');
            console.log('7. Porcentaje');
            console.log('8. Ver historial');
            console.log('9. Limpiar historial');
            console.log('10. Ejecutar tests');
            console.log('0. Salir');

            const opcion = await this.preguntar('\nSelecciona una opción (0-10): ');

            switch (opcion.trim()) {
                case '1':
                    await this.realizarOperacion('sumar');
                    break;
                case '2':
                    await this.realizarOperacion('restar');
                    break;
                case '3':
                    await this.realizarOperacion('multiplicar');
                    break;
                case '4':
                    await this.realizarOperacion('dividir');
                    break;
                case '5':
                    await this.realizarOperacion('potencia');
                    break;
                case '6':
                    await this.realizarOperacion('raizCuadrada');
                    break;
                case '7':
                    await this.realizarOperacion('porcentaje');
                    break;
                case '8':
                    this.mostrarHistorial();
                    break;
                case '9':
                    this.limpiarHistorial();
                    break;
                case '10':
                    await this.ejecutarTests();
                    break;
                case '0':
                    console.log('👋 ¡Gracias por usar la calculadora! ¡Hasta luego!');
                    this.rl.close();
                    return;
                default:
                    console.log('❌ Opción no válida. Por favor, selecciona una opción del 0 al 10.');
            }

            console.log('\n' + '-'.repeat(30) + '\n');
        }
    }

    /**
     * Realiza una operación específica
     */
    async realizarOperacion(operacion) {
        try {
            let resultado;

            switch (operacion) {
                case 'sumar':
                    const a1 = parseFloat(await this.preguntar('Ingresa el primer número: '));
                    const b1 = parseFloat(await this.preguntar('Ingresa el segundo número: '));
                    resultado = this.calculadora.sumar(a1, b1);
                    break;

                case 'restar':
                    const a2 = parseFloat(await this.preguntar('Ingresa el primer número: '));
                    const b2 = parseFloat(await this.preguntar('Ingresa el segundo número: '));
                    resultado = this.calculadora.restar(a2, b2);
                    break;

                case 'multiplicar':
                    const a3 = parseFloat(await this.preguntar('Ingresa el primer número: '));
                    const b3 = parseFloat(await this.preguntar('Ingresa el segundo número: '));
                    resultado = this.calculadora.multiplicar(a3, b3);
                    break;

                case 'dividir':
                    const a4 = parseFloat(await this.preguntar('Ingresa el dividendo: '));
                    const b4 = parseFloat(await this.preguntar('Ingresa el divisor: '));
                    resultado = this.calculadora.dividir(a4, b4);
                    break;

                case 'potencia':
                    const base = parseFloat(await this.preguntar('Ingresa la base: '));
                    const exponente = parseFloat(await this.preguntar('Ingresa el exponente: '));
                    resultado = this.calculadora.potencia(base, exponente);
                    break;

                case 'raizCuadrada':
                    const numero = parseFloat(await this.preguntar('Ingresa el número: '));
                    resultado = this.calculadora.raizCuadrada(numero);
                    break;

                case 'porcentaje':
                    const num = parseFloat(await this.preguntar('Ingresa el número: '));
                    const porcentaje = parseFloat(await this.preguntar('Ingresa el porcentaje: '));
                    resultado = this.calculadora.porcentaje(num, porcentaje);
                    break;
            }

            console.log(`✅ Resultado: ${resultado}`);

        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
        }
    }

    /**
     * Muestra el historial de operaciones
     */
    mostrarHistorial() {
        const historial = this.calculadora.obtenerHistorial();

        if (historial.length === 0) {
            console.log('📝 El historial está vacío.');
        } else {
            console.log('📝 Historial de operaciones:');
            historial.forEach((operacion, index) => {
                console.log(`   ${index + 1}. ${operacion}`);
            });
        }
    }

    /**
     * Limpia el historial
     */
    limpiarHistorial() {
        this.calculadora.limpiarHistorial();
        console.log('🗑️  Historial limpiado correctamente.');
    }

    /**
     * Ejecuta los tests
     */
    async ejecutarTests() {
        console.log('🧪 Ejecutando tests...');
        console.log('💡 Para ejecutar los tests desde la terminal, usa: npm test');
        console.log('💡 Para ejecutar los tests en modo watch, usa: npm run test:watch');
    }

    /**
     * Hace una pregunta al usuario
     */
    preguntar(pregunta) {
        return new Promise((resolve) => {
            this.rl.question(pregunta, resolve);
        });
    }
}

// Ejecutar el programa si es llamado directamente
if (require.main === module) {
    const programa = new ProgramaCalculadora();
    programa.iniciar().catch(console.error);
}

module.exports = ProgramaCalculadora;
