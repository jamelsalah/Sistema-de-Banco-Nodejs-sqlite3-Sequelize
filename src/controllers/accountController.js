import Account from '../models/account.js';
import User from '../models/user.js';
import Person from '../models/person.js';
import Transaction from '../models/transaction.js';

function createAccountView(req, res) {
    res.render("createAccountView/index.html", {})
}

async function createAccount(req, res) {
    const user = req.session.user;
    const { name, number } = req.body;

    if(user) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const date = `${year}-${month}-${day}`;
    
        console.log(user);
        console.log(name, number)
    
    
    
        const account = await Account.create({
            userId: user.id,
            number,
            name,
            openingDate: date,
            balance: 0.0
        })
        .then((result)=> { return result})
        .catch((error) => {return error})
    
        console.log(account)
    }
}

async function accountHome(req, res) {
    const user = req.session.user;
    const { number } = req.body;

    if(user) {
        const account = await Account.findOne({
            where: {number}
        }).then((result) => {
            return result;
        }).catch((error) => {
            return error
        })
        
        if(account) {
            
            req.session.account = account;
            res.render("accountHome/index.html", {user, account: account.dataValues})
        }
        console.log(account)
    }
}

function depositView(req, res) {
    const user = req.session.user;
    const account = req.session.account;

    if(user  &&  account) {
        res.render("depositView/index.html", {account, user})
    }
}

async function deposit(req, res) {
    const user = req.session.user;
    const sessionAccount = req.session.account;

    if(user  &&  sessionAccount) {
        const { value, observation } = req.body;

        const account = await Account.findOne({
            where: {
                number: sessionAccount.number,
                name: sessionAccount.name
            }
        }).then((result) => {
            return {success: true, dataValues: result.dataValues};
        }).catch((error) => {
            return {success: false, error};
        });

        if(account.success) {
            const newBalance = parseFloat(account.dataValues.balance) + parseFloat(value);

            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const date = `${year}-${month}-${day}`;

            const result = await Account.update(
                {balance: newBalance},
                {where: {
                    number: account.dataValues.number,
                    name: account.dataValues.name
                }}
            ).then((result) => {
                return {success: true, dataValues: result};
            }).catch((error) => {
                return {success: false, error};
            });

            if(result.success) {
                const transaction = await Transaction.create({
                    accountId: account.dataValues.id,
                    type: "C",
                    transactionDate: date,
                    value,
                    observation
                }).then((result) => {
                    return {success: true, dataValues: result.dataValues};
                }).catch((error) => {
                    return {success: false, error};
                });

                if(transaction.success) {
                    const success = "Valor Depositado com Sucesso!";

                    res.render("depositView/index.html", {success});
                }
            } else {
                const error = "Erro ao Tranferir o Valor, Tente mais Tarde.";

                res.render("depositView/index.html", {error});
            }
        } else {
            const error = "Conta não Encontrada no Banco de Dados.";

            res.render("depositView/index.html", {error});
        }
    }
    
}

function transferCheckView(req, res) {
    const user = req.session.user;
    const account = req.session.account;

    if(user  &&  account) {
        res.render("transferCheckView/index.html", {account, user});
    }
}

async function transferCheck(req, res) {
    const user = req.session.user;
    const account = req.session.account;

    if(user  &&  account) {
        const { number } = req.body;

        const targetAccount = await Account.findOne({
            where: {number}
        }).then((result) => {
            return {success: true, dataValues: result.dataValues};
        }).catch((error) => {
            return {success: false, error};
        });

        if(targetAccount.success) {
            if(account.number  !==  targetAccount.dataValues.number) {
                let targetPerson;
                const targetUser = await User.findOne({
                    where: {
                        id: targetAccount.dataValues.userId
                    }
                }).then((result) => {
                    return {success: true, dataValues: result.dataValues};
                }).catch((error) => {
                    return {success: false, error};
                });

                if(targetUser.success) {
                    targetPerson = await Person.findOne({
                        where: {
                            id: targetUser.dataValues.personId
                        }
                    }).then((result) => {
                        return {success: true, dataValues: result.dataValues};
                    }).catch((error) => {
                        return {success: false, error};
                    });

                    if(targetPerson.success) {
                        res.render("transferView/index.html", {account, user, targetAccount: targetAccount.dataValues, targetUser: targetPerson.dataValues});
                    } else {
                        const error = "Usuario não Encontrado no Banco de Dados.";

                        res.render("transferCheckView/index.html", {error});
                        return;
                    }
                }
            } else {
                console.log('não pode transferir para a mesma conta!');
                const error = "Não Pode Transferir para a Mesma Conta.";

                res.render("transferCheckView/index.html", {error});
                return;
            }
        } else {
            const error = "Conta não Encontrada no Banco de Dados.";

            res.render("transferCheckView/index.html", {error});
            return;
        }
    } else {
        res.render("loginView/index.html", {});
        return;
    }
}

async function transfer(req, res) {
    const { targetAccountNumber, targetAccountName, value, observation } = req.body;
    const account = req.session.account;
    const user = req.session.user;

    if(!account  ||  !user) {
        res.render("loginView/index.html", {});
        return;
    }


    const targetAccount = await Account.findOne({
        where: {number: targetAccountNumber, name: targetAccountName}
    }).then((result) => {
        return {success: true, dataValues: result.dataValues};
    }).catch((error) => {
        return {success: false, error};
    });

    const currentAccount = await Account.findOne({
        where: {number: account.number, name: account.name}
    }).then((result) => {
        return {success: true, dataValues: result.dataValues};
    }).catch((error) => {
        return {success: false, error};
    });

    if(currentAccount.success  &&  targetAccount.success) {
        if(currentAccount.dataValues.number  !==  targetAccount.dataValues.number) {
            const currentAccountNewBalance = parseFloat(currentAccount.dataValues.balance) - parseFloat(value);
            const targetAccountNewBalance = parseFloat(targetAccount.dataValues.balance) + parseFloat(value);

            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const date = `${year}-${month}-${day}`;

            if(currentAccountNewBalance < 0) {
                const error = "Saldo Insuficiente para Realizar a Tranferencia!";
                console.log('balance error')

                res.render("transferView/index.html", {error});
                return;
            }

            const currentResult = await Account.update(
                {balance: currentAccountNewBalance},
                {where: {
                    number: currentAccount.dataValues.number,
                    name: currentAccount.dataValues.name
                }}
            ).then((result) => {
                return {success: true, result};
            }).catch((error) => {
                return {success: false, error};
            })

            
            const targetResult = await Account.update(
                {balance: targetAccountNewBalance},
                {where: {
                    number: targetAccount.dataValues.number,
                    name: targetAccount.dataValues.name
                }}
            ).then((result) => {
                return {success: true, result};
            }).catch((error) => {
                return {success: false, error};
            });

            if(targetResult.success  &&  currentResult.success) {
                const transactionD = await Transaction.create({
                    accountId: currentAccount.dataValues.id,
                    type: "D",
                    transactionDate: date,
                    value,
                    originAccount: currentAccount.dataValues.number,
                    targetAccount: targetAccount.dataValues.number,
                    observation
                }).then((result) => {
                    return {success: true, dataValues: result.dataValues};
                }).catch((error) => {
                    return {success: false, error};
                });

                const transactionC = await Transaction.create({
                    accountId: targetAccount.dataValues.id,
                    type: "C",
                    transactionDate: date,
                    value,
                    originAccount: currentAccount.dataValues.number,
                    targetAccount: targetAccount.dataValues.number,
                    observation
                }).then((result) => {
                    return {success: true, dataValues: result.dataValues};
                }).catch((error) => {
                    return {success: false, error};
                });

                if(transactionC.success  &&  transactionD.success) {
                    const success = "Valor Transferido com Sucesso!";

                    res.render("transferView/index.html", {success});
                    return;
                } else {
                    const error = "Algo deu errado com sua Transferencia, tente Novamente mais Tarde.";

                    res.render("transferView/index.html", {error});
                    return;
                }
            } else {
                const error = "Conta de Destino não Encontrada no Banco de Dados.";

                res.render("transferView/index.html", {error});
                return;
            }
        } else {
            const error = "Você não Pode Transferir para a mesma Conta.";

            res.render("transferView/index.html", {error});
            return;
        }
    }

}

function listView(req, res) {
    console.log('listview')
}

function list(req, res) {
    console.log('list')
}

export default {
    createAccountView,
    createAccount,
    accountHome,
    depositView,
    deposit,
    transferCheckView,
    transferCheck,
    transfer,
    listView,
    list
}