import { getIndicadores } from './getIndicadores';
import { ValidaSimulacao } from './validacaoDoFormulario';

/**
 * Função async que realiza a simulação consumindo os dados da API caso as condições para o envio sejam satisfeitas
 */
async function simulation() {
    const parentResult = document.getElementById('resultado_main');
    if (parentResult.hasChildNodes()) parentResult.innerHTML = '';

    const resultTitleTag = document.getElementById('titulo_resultado');
    resultTitleTag.innerText = 'Resultado da Simulação';

    const incomeType = getYield()
    const indexingType = getIndexing()
    const dataAPI = await (await fetch(`http://localhost:3000/simulacoes?tipoIndexacao=${indexingType}&tipoRendimento=${incomeType}`)).json()
    const getData = dataAPI.shift()
    for (let data in getData) {
        criandoDivResultado(data, getData);
    }
}

/**
 * Verifica o tipo de rendimento que o usuário designou
 * @returns o tipo de rendimento
 */
const getYield = () => {
    let inputsRadio = document.getElementsByName('rendimento')
    let inputChecked;

    inputsRadio.forEach(el => {
        if (el.checked) {
            inputChecked = el
        }
    })

    return inputChecked.getAttribute('id');
}

/**
 * Verifica o tipo de indexação do usuário
 * @returns 
 */
const getIndexing = () => {
    let inputsRadio = document.getElementsByName('indexacao')
    let inputChecked;

    inputsRadio.forEach(el => {
        if (el.checked) {
            inputChecked = el
        }
    })

    return inputChecked.getAttribute('id');
}

/**
 * Class para formata os valores para a div de Resultados
 */
class ValoresFormatados {
    /**
     * 
     * @param {String} name Nome da propriedade do objeto
     * @param {Number} value Valor numérico da propriedade do objeto
     * @param {String} color Cor a qual o nome vai obter após a verificação
     */
    constructor(name, value, color = 'black') {
        this.name = name
        this.value = value
        this.color = color
    }
    
    /**
     * Formata os valores para serem inseridos nas caixas de resultados
     */
    formataValores() {
        if (this.name === 'valorFinalBruto') {
            this.name = 'Valor Final Bruto';
            this.value = this.moedaReais(this.value)
            return
        }

        if (this.name === 'valorTotalInvestido') {
            this.name = 'Valor Total Investido';
            this.value = this.moedaReais(this.value)
            return
        }

        if (this.name === 'valorFinalLiquido') {
            this.name = 'Valor Final Liquido';
            this.value = this.moedaReais(this.value)
            this.color = this.color = 'green'
            return
        }

        if (this.name === 'ganhoLiquido') {
            this.name = 'Ganho Liquido';
            this.value = this.moedaReais(this.value)
            this.color = this.color = 'green'
            return
        }

        if (this.name === 'aliquotaIR') {
            this.name = 'Alíquota IR';
            this.value = `${this.value}%`;
            return
        }

        if (this.name === 'valorPagoIR') {
            this.name = 'Valor Pago IR';
            this.value = `${this.value}%`;
            return
        }
    }
    
    /**
     * 
     * @param {Number} value Recebe um valor numérico para converter para a mascara de Reais
     * @returns 
     */
    moedaReais(value) {
        return value.toLocaleString('pt-br', {
            style: 'currency',
            currency: 'BRL'
        })
    }
}

/**
 * Cria a div de resultado de cada parâmetro disponível para o usuário
 * @param {String} nome nome da propriedade
 * @param {Object} obj objeto
 * @returns 
 */
const criandoDivResultado = (nome, obj) => {
    if(!veirificarNomeDasChaves(nome)) return;

    const parentResult = document.getElementById('resultado_main');
    const valor = Number(obj[nome]);
    const boxResultado = document.createElement('div');
    const objetoFormatado = new ValoresFormatados(nome, valor);

    objetoFormatado.formataValores();
    boxResultado.classList.add('box_resultado');
    boxResultado.innerHTML = `<p>${objetoFormatado.name}</p><p style="color:${objetoFormatado.color};">${objetoFormatado.value}</p>`
    parentResult.appendChild(boxResultado);
}

/**
 * Verificar se os dados da API devem ou não ser criados
 * @param {String} name nome da propriedade
 * @returns 
 */
const veirificarNomeDasChaves = name => {
    if(name === 'tipoIndexacao' || name === 'tipoRendimento' || name === 'graficoValores') return false;
    return true
}

const valida = new ValidaSimulacao(simulation)
getIndicadores()
