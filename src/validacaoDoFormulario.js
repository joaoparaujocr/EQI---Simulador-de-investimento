class ValidaSimulacao {
    /**
     * 
     * @param {Function} simulation receber a função async para receber os dados da API
     */
    constructor(simulation) {
        this.simulationForm = document.querySelector('form#form_simulador')
        this.btnClear = document.querySelector('#btn_limpar_campos')
        this.formEvents()
        this.simulation = simulation
    }

    formEvents() {
        this.simulationForm.addEventListener('submit', e => {
            this.handleSubmit(e);
        })

        this.simulationForm.addEventListener('focusout', e => {
            const eventElement = e.target;

            if (eventElement.classList.contains('moeda_brl')) this.maskBRL(eventElement);

            if (eventElement.classList.contains('porcentagem')) this.maskPercentage(eventElement);

            if (eventElement.getAttribute('id') === 'prazo') this.inputDeadline(eventElement);
        })

        this.btnClear.addEventListener('click', () => {
            const inputsForm = this.simulationForm.querySelectorAll('input[type=text]');
            inputsForm.forEach(i => {
                if (i.hasAttribute('disabled')) return;
                i.value = ''
            })
        })
    }

    /**
     * Manipulando o evento de submit do formulario
     * @param {Object} e 
     */
    handleSubmit(e) {
        e.preventDefault();
        const theFieldsAreValid = this.fieldValidation()
        if (theFieldsAreValid) this.simulation();
    }

    /**
     * Verifica se os campos do formulário estão validos
     * @returns true ou false se acordo com o campo
     */
    fieldValidation() {
        let isValid = true;
        const inputsArray = document.querySelectorAll('.input_box input');

        for (let input of inputsArray) {
            if (input.getAttribute('id') === 'aporte_inicial') {
                if (!this.maskBRL(input)) isValid = false;
            }

            if (input.getAttribute('id') === 'aporte_mensal') {
                if (!this.maskBRL(input)) isValid = false;
            }

            if (input.getAttribute('id') === 'prazo') {
               if (!this.inputDeadline(input)) isValid = false
            }

            if (input.getAttribute('id') === 'rentabilidade') {
                if (!this.maskPercentage(input)) isValid = false
            }
        }
        return isValid

    }

    /**
     * Mascara para os inputs que são valores monetários (R$)
     * @param {Object} element elemento do input
     * @returns false se o elemento não coincidir com as condições e true se coincidir
     */
    maskBRL(element) {
        let elementValue = element.value
        if (elementValue === '') {
            this.invalidInput(element, 'está vazio.')
            return false
        }

        elementValue = Number(elementValue.replace(/\s+/g, '').replace('.', '').replace(',', '.').replace('R$', ''));
        this.validInput(element);

        if (isNaN(elementValue)) {
            this.invalidInput(element, 'deve ser um número.')
            return false
        };

        if (elementValue <= 0) {
            this.invalidInput(element, 'deve ser um elementValue maior que R$ 0.')
            return false
        }

        this.validInput(element);
        element.value = elementValue.toLocaleString('pt-br', {
            style: 'currency',
            currency: 'BRL'
        })
        return true
    }

    /**
     * Mascara para os inputs que são valores percentuais
     * @param {Object} element elemento do input
     * @returns 
     */
    maskPercentage(element) {
        let elementValue = element.value
        if (elementValue === '') {
            this.invalidInput(element, 'está vazio.')
            return false
        }

        elementValue = Number(elementValue.replace(/\s+/g, '').replace('%', '').replace('.', '').replace(',', '.'));
        this.validInput(element);

        if (isNaN(elementValue)) {
            this.invalidInput(element, 'deve ser um número.')
            return false
        };

        if (elementValue <= 0) {
            this.invalidInput(element, 'deve ser um elementValue maior que 0.')
            return false
        }

        this.validInput(element);
        element.value = `${String(elementValue).replace('.', ',')}%`
        return true
    }

    /**
     * Mascara para o input de prazo
     * @param {Object} element lemento do input
     * @returns
     */
    inputDeadline(element) {
        let elementValue = element.value
        if (elementValue === '') {
            this.invalidInput(element, 'está vazia.')
            return false
        }

        elementValue = Number(elementValue);
        this.validInput(element);

        if (isNaN(elementValue)){
            this.invalidInput(element, 'deve ser um número.')
            return false
        }

        if (elementValue <= 0) {
            this.invalidInput(element, 'deve ser um número maior que 0.');
            return false
        }

        this.validInput(element);
        return true
    }

    /**
     * Função a ser executada caso o input seja invalido.
     * @param {Object} element elemento a ser invalidado
     * @param {String} msg msg de aviso
     */
    invalidInput(element, msg) {
        const parentElement = element.parentElement;
        const label = element.previousElementSibling;
        label.style.color = "red";
        const p = document.createElement('p');
        p.classList.add('input_message_error');
        p.innerText = `${label.textContent} ${msg}`
        parentElement.appendChild(p)
    }

    /**
     * Função a ser executada caso o input seja validado
     * @param {Object} element elemento a ser validado
     */
    validInput(element) {
        const parentElement = element.parentElement;
        const label = element.previousElementSibling;
        label.style.color = "black";
        const p = element.nextElementSibling;
        if (p) parentElement.removeChild(p);
    }
}

export { ValidaSimulacao };