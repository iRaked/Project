const Calculadora = require('../src/calculadora');

describe('Calculadora', () => {
    let calculadora;

    beforeEach(() => {
        calculadora = new Calculadora();
    });

    describe('Operaciones básicas', () => {
        test('debería sumar dos números correctamente', () => {
            expect(calculadora.sumar(2, 3)).toBe(5);
            expect(calculadora.sumar(-1, 1)).toBe(0);
            expect(calculadora.sumar(0, 0)).toBe(0);
            expect(calculadora.sumar(1.5, 2.5)).toBe(4);
        });

        test('debería restar dos números correctamente', () => {
            expect(calculadora.restar(5, 3)).toBe(2);
            expect(calculadora.restar(1, 1)).toBe(0);
            expect(calculadora.restar(0, 5)).toBe(-5);
            expect(calculadora.restar(3.5, 1.5)).toBe(2);
        });

        test('debería multiplicar dos números correctamente', () => {
            expect(calculadora.multiplicar(2, 3)).toBe(6);
            expect(calculadora.multiplicar(-2, 3)).toBe(-6);
            expect(calculadora.multiplicar(0, 5)).toBe(0);
            expect(calculadora.multiplicar(2.5, 4)).toBe(10);
        });

        test('debería dividir dos números correctamente', () => {
            expect(calculadora.dividir(6, 2)).toBe(3);
            expect(calculadora.dividir(5, 2)).toBe(2.5);
            expect(calculadora.dividir(-6, 2)).toBe(-3);
            expect(calculadora.dividir(0, 5)).toBe(0);
        });

        test('debería lanzar error al dividir por cero', () => {
            expect(() => calculadora.dividir(5, 0)).toThrow('No se puede dividir por cero');
            expect(() => calculadora.dividir(0, 0)).toThrow('No se puede dividir por cero');
        });
    });

    describe('Operaciones avanzadas', () => {
        test('debería calcular potencias correctamente', () => {
            expect(calculadora.potencia(2, 3)).toBe(8);
            expect(calculadora.potencia(5, 2)).toBe(25);
            expect(calculadora.potencia(2, 0)).toBe(1);
            expect(calculadora.potencia(3, -1)).toBeCloseTo(0.333, 2);
        });

        test('debería calcular raíz cuadrada correctamente', () => {
            expect(calculadora.raizCuadrada(4)).toBe(2);
            expect(calculadora.raizCuadrada(9)).toBe(3);
            expect(calculadora.raizCuadrada(0)).toBe(0);
            expect(calculadora.raizCuadrada(2)).toBeCloseTo(1.414, 2);
        });

        test('debería lanzar error al calcular raíz cuadrada de número negativo', () => {
            expect(() => calculadora.raizCuadrada(-1)).toThrow('No se puede calcular la raíz cuadrada de un número negativo');
            expect(() => calculadora.raizCuadrada(-5)).toThrow('No se puede calcular la raíz cuadrada de un número negativo');
        });

        test('debería calcular porcentajes correctamente', () => {
            expect(calculadora.porcentaje(100, 50)).toBe(50);
            expect(calculadora.porcentaje(200, 25)).toBe(50);
            expect(calculadora.porcentaje(50, 100)).toBe(50);
            expect(calculadora.porcentaje(0, 50)).toBe(0);
        });
    });

    describe('Validación de entrada', () => {
        test('debería lanzar error con argumentos no numéricos', () => {
            expect(() => calculadora.sumar('a', 2)).toThrow('Los argumentos deben ser números válidos');
            expect(() => calculadora.restar(1, 'b')).toThrow('Los argumentos deben ser números válidos');
            expect(() => calculadora.multiplicar(null, 2)).toThrow('Los argumentos deben ser números válidos');
            expect(() => calculadora.dividir(1, undefined)).toThrow('Los argumentos deben ser números válidos');
            expect(() => calculadora.potencia(NaN, 2)).toThrow('Los argumentos deben ser números válidos');
            expect(() => calculadora.raizCuadrada('texto')).toThrow('Los argumentos deben ser números válidos');
            expect(() => calculadora.porcentaje(1, 'porcentaje')).toThrow('Los argumentos deben ser números válidos');
        });
    });

    describe('Historial de operaciones', () => {
        test('debería mantener historial de operaciones', () => {
            calculadora.sumar(2, 3);
            calculadora.restar(5, 1);
            calculadora.multiplicar(4, 2);

            const historial = calculadora.obtenerHistorial();
            expect(historial).toHaveLength(3);
            expect(historial[0]).toBe('2 + 3 = 5');
            expect(historial[1]).toBe('5 - 1 = 4');
            expect(historial[2]).toBe('4 * 2 = 8');
        });

        test('debería limpiar el historial correctamente', () => {
            calculadora.sumar(1, 2);
            calculadora.restar(3, 1);

            expect(calculadora.obtenerHistorial()).toHaveLength(2);

            calculadora.limpiarHistorial();

            expect(calculadora.obtenerHistorial()).toHaveLength(0);
        });

        test('debería devolver una copia del historial, no la referencia original', () => {
            calculadora.sumar(1, 2);
            const historial1 = calculadora.obtenerHistorial();
            const historial2 = calculadora.obtenerHistorial();

            expect(historial1).toEqual(historial2);
            expect(historial1).not.toBe(historial2); // Diferentes referencias
        });
    });

    describe('Casos edge', () => {
        test('debería manejar números muy grandes', () => {
            const numeroGrande = Number.MAX_SAFE_INTEGER;
            expect(calculadora.sumar(numeroGrande, 1)).toBe(9007199254740992);
        });

        test('debería manejar números decimales con precisión', () => {
            expect(calculadora.sumar(0.1, 0.2)).toBeCloseTo(0.3, 10);
            expect(calculadora.dividir(1, 3)).toBeCloseTo(0.333, 2);
        });

        test('debería manejar números negativos en todas las operaciones', () => {
            expect(calculadora.sumar(-5, -3)).toBe(-8);
            expect(calculadora.restar(-2, 5)).toBe(-7);
            expect(calculadora.multiplicar(-3, 4)).toBe(-12);
            expect(calculadora.dividir(-8, 2)).toBe(-4);
            expect(calculadora.potencia(-2, 3)).toBe(-8);
            expect(calculadora.porcentaje(-100, 50)).toBe(-50);
        });
    });
});
