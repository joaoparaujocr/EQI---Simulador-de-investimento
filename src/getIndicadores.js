/**
 * Função assíncrona para fazer a requisição do CDI e IPCA
 */
const getIndicadores = async () => {
    const getCDI = await (await fetch('http://localhost:3000/indicadores?nome=cdi')).json()
    const getIPCA = await (await fetch('http://localhost:3000/indicadores?nome=ipca')).json()
    setIndicadores(getCDI[0].valor, getIPCA[0].valor)
}

/**
 * Coloca os valores nos campos inicias já preenchidos
 * @param {Number} cdi 
 * @param {Number} ipca 
 */
const setIndicadores = (cdi, ipca) => {
    const inputCDI = document.querySelector('#cdi')
    const inputIPCA = document.querySelector('#ipca_ano')
    inputCDI.value = `${String(cdi).replace('.', ',')}%`
    inputIPCA.value = `${String(ipca).replace('.', ',')}%`
}

export {getIndicadores};