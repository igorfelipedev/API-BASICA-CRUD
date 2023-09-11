const express = require('express');
const intermediarios = require('./intermediarios');
const recursos = require('./controladores/recursos');

const rotas = express();

rotas.post('/contas',
    intermediarios.verificaCamposObrigatorios,
    intermediarios.verificaCpf,
    intermediarios.verificaEmail,
    recursos.criarConta
);
rotas.get('/contas',
    intermediarios.senhaBanco,
    recursos.listarContasBancarias
);
rotas.put('/contas/:numeroConta/usuario',
    intermediarios.verificaCamposObrigatorios,
    intermediarios.verificaCpfRepetido,
    intermediarios.verificaEmailRepetido,
    recursos.updateUser
);
rotas.delete('/contas/:numeroConta', recursos.excluirConta);
rotas.post('/transacoes/depositar',
    intermediarios.validarDeposito,
    recursos.depositar
);
rotas.post('/transacoes/sacar',
    intermediarios.validarSaque,
    recursos.sacar
);
rotas.post('/transacoes/transferir',
    intermediarios.validarTransferencia,
    recursos.transferir
);
rotas.get('/contas/saldo',
    intermediarios.validarSenhaConta,
    recursos.saldo
);
rotas.get('/contas/extrato',
    intermediarios.validarSenhaConta,
    recursos.extrato
);


module.exports = rotas;