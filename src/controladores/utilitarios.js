function adicionarZero(numero) {
    return numero < 10 ? `0${numero}` : numero;
}

const dataHora = () => {
    const dataHora = new Date();
    const ano = dataHora.getFullYear();
    const mes = adicionarZero(dataHora.getMonth() + 1);
    const dia = adicionarZero(dataHora.getDate());
    const hora = adicionarZero(dataHora.getHours());
    const minuto = adicionarZero(dataHora.getMinutes());
    const segundo = adicionarZero(dataHora.getSeconds());

    const dataHoraFormatada = `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;

    return dataHoraFormatada;
}

module.exports = {
    dataHora
}