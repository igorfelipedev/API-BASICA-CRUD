const banco = require("./bancodedados");

const senhaBanco = (req, res, next) => {
    const { senha_banco } = req.query;

    if (!senha_banco) {
        return res.status(400).json({ mensagem: 'A senha é obrigatória!' })
    }

    if (senha_banco !== banco.banco.senha) {
        return res.status(401).json({ mensagem: 'Senha incorreta!' });
    }
    next();
}

const validarSenhaConta = (req, res, next) => {
    numero_conta = Number(req.query.numero_conta);
    senha = Number(req.query.senha);

    const encontraConta = banco.contas.find(conta => conta.numero === numero_conta);

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: 'Digite a senha e o número da conta' });
    }

    if (!encontraConta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada.' });
    }

    if (encontraConta.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: 'Senha incorreta!' });
    }
    next();
}

const verificaCamposObrigatorios = (req, res, next) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: 'Informe todos os campos obrigatórios: nome, cpf, data de nascimento, telefone, email e senha.' });
    }
    next();
}

const verificaCpf = (req, res, next) => {
    const { cpf } = req.body;
    const cpfExiste = banco.contas.some((conta) => conta.usuario.cpf === cpf);

    if (cpfExiste) {
        return res.status(400).json({ mensagem: 'CPF já cadastrado.' });
    }
    next();
}

const verificaEmail = (req, res, next) => {
    const { email } = req.body;
    const emailExistente = banco.contas.some((conta) => conta.usuario.email === email);

    if (emailExistente) {
        return res.status(400).json({ mensagem: 'E-mail já cadastrado.' });
    }
    next();
}

const verificaCpfRepetido = (req, res, next) => {
    const { cpf } = req.body;
    const encontraCpf = banco.contas.find(conta => conta.usuario.cpf === cpf);

    if (encontraCpf) {
        return res.status(400).json({ mensagem: 'O CPF já está cadastrado!' })
    }
    next();
}

const verificaEmailRepetido = (req, res, next) => {
    const { email } = req.body;
    const encontraCpf = banco.contas.find(conta => conta.usuario.email === email);

    if (encontraCpf) {
        return res.status(400).json({ mensagem: 'O EMAIL já está cadastrado!' });
    }
    next();
}

const validarDeposito = (req, res, next) => {
    const { numero_conta, valor } = req.body;
    const conta = banco.contas.find(conta => conta.numero === numero_conta);

    if (isNaN(numero_conta) || isNaN(valor)) {
        return res.status(400).json({ mensagem: 'Digite um número válido!' })
    }

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada!' })
    }

    if (!numero_conta || !valor || valor <= 0) {
        return res.status(400).json({ mensagem: 'Informe o numero da conta e o valor do deposito!' });
    }
    next();
}

const validarSaque = (req, res, next) => {
    const { numero_conta, valor, senha } = req.body;
    const contaEncontrada = banco.contas.find(conta => conta.numero === numero_conta);

    if (isNaN(numero_conta) || isNaN(valor)) {
        return res.status(400).json({ mensagem: 'Informe um número válido para número da conta, valor e senha!' })
    }

    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ mensagem: 'Informe número da conta, valor e senha válidos para o saque.' });
    }

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: 'Conta não encontrada!' });
    }

    if (contaEncontrada.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: 'Senha incorreta.' });
    }

    if (contaEncontrada.saldo < valor || valor <= 0) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente ou valor inválido!' });
    }
    next();
}

const validarTransferencia = (req, res, next) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
    const senhaOrigem = banco.contas.find(conta => conta.usuario.senha === senha);
    const contaOrigem = banco.contas.find(conta => conta.numero === numero_conta_origem);
    const contaDestino = banco.contas.find(conta => conta.numero === numero_conta_destino);

    if (isNaN(valor)) {
        return res.status(400).json({ mensagem: 'Informe um valor válido!' });
    }

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({ mensagem: 'Informe número da conta de origem, número da conta de destino, valor e senha.' });
    }

    if (contaOrigem === contaDestino) {
        return res.status(400).json({ mensagem: 'Não é possivel transferir para a mesma conta!' });
    }

    if (!senhaOrigem) {
        return res.status(400).json({ mensagem: 'Senha incorreta' });
    }

    if (!contaOrigem) {
        return res.status(404).json({ mensagem: 'Conta de origem não existe!' });
    }

    if (!contaDestino) {
        return res.status(404).json({ mensagem: 'Conta de destino não existe!' });
    }

    if (contaOrigem.saldo < valor || valor <= 0) {
        return res.status(400).json({ mensagem: 'Transferência não realizada, saldo insuficiente ou valor inválido!' });
    }

    if (contaOrigem.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: 'Senha incorreta para a conta de origem.' });
    }
    next();
}

module.exports = {
    senhaBanco,
    validarSenhaConta,
    verificaCamposObrigatorios,
    verificaCpf,
    verificaEmail,
    verificaCpfRepetido,
    verificaEmailRepetido,
    validarDeposito,
    validarSaque,
    validarTransferencia
}