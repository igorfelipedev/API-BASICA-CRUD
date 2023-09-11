let banco = require('../bancodedados');
const { dataHora } = require('./utilitarios');

let numeroContaGlobal = 1

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const newUser = {
        numero: numeroContaGlobal++,
        saldo: 0,
        usuario: {
            ...req.body
        }
    }
    banco.contas.push(newUser);

    return res.status(201).send();
}

const listarContasBancarias = (req, res) => {
    return res.status(200).json(banco.contas);
}

const updateUser = (req, res) => {
    const numeroConta = Number(req.params.numeroConta);
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const contaEncontrada = banco.contas.find(conta => conta.numero === numeroConta);
    
    contaEncontrada.usuario.nome = nome
    contaEncontrada.usuario.cpf = cpf
    contaEncontrada.usuario.data_nascimento = data_nascimento
    contaEncontrada.usuario.telefone = telefone
    contaEncontrada.usuario.email = email
    contaEncontrada.usuario.senha = senha

    return res.status(204).send();
}

const excluirConta = (req, res) => {
    const numeroConta = Number(req.params.numeroConta);
    const excluirConta = banco.contas.find(conta => conta.numero === numeroConta);

    if (!excluirConta) {
        return res.status(404).json({ mensagem: "Conta não encontrada!" })
    }

    if (excluirConta.saldo > 0) {
        return res.status(409).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" })
    }
    banco.contas = banco.contas.filter(conta => conta.numero !== numeroConta);

    return res.status(204).send();
}

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;
    const conta = banco.contas.find(conta => conta.numero === numero_conta);
    const data = dataHora();
    
    conta.saldo = conta.saldo + valor;

    const registroDeposito = {
        data,
        numero_conta,
        valor
    }
    banco.depositos.push(registroDeposito);

    return res.status(204).send();
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;
    const contaEncontrada = banco.contas.find(conta => conta.numero === numero_conta);
    const data = dataHora();

    contaEncontrada.saldo = contaEncontrada.saldo - valor;
    
    const registroSaque = {
        data,
        numero_conta,
        valor
    }    
    banco.saques.push(registroSaque);

    return res.status(204).send();
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
    const contaOrigem = banco.contas.find(conta => conta.numero === numero_conta_origem);
    const contaDestino = banco.contas.find(conta => conta.numero === numero_conta_destino);
    const data = dataHora();
    
    contaOrigem.saldo = contaOrigem.saldo - valor;
    contaDestino.saldo = contaDestino.saldo + valor;

    const transferenciaRealizada = {
        data,
        numero_conta_origem,
        numero_conta_destino,
        valor
    }
    banco.transferencias.push(transferenciaRealizada);

    return res.status(204).send();
}

const saldo = (req, res) => {
    const numero_conta = Number(req.query.numero_conta);
    const encontrarConta = banco.contas.find(conta => conta.numero === numero_conta);

    return res.status(200).json({ saldo: encontrarConta.saldo });
}

const extrato = (req, res) => {
    const numero_conta = Number(req.query.numero_conta);
    const encontrarConta = banco.contas.find(conta => conta.numero === numero_conta);
    const encontraDeposito = banco.depositos.filter(conta => conta.numero_conta === numero_conta);
    const encontraSaque = banco.saques.filter(conta => conta.numero_conta === numero_conta);
    const transferenciaEnviada = banco.transferencias.filter(conta => conta.numero_conta_origem === numero_conta);
    const transferenciaRecebida = banco.transferencias.filter(conta => conta.numero_conta_destino === numero_conta);
    
    const extrato = {
        depositos: encontraDeposito,
        saques: encontraSaque,
        transferenciaEnviada,
        transferenciaRecebida
    }
    return res.status(200).json(extrato);
}

module.exports = {
    criarConta,
    listarContasBancarias,
    updateUser,
    excluirConta,
    depositar,
    sacar,
    transferir,
    saldo,
    extrato
}