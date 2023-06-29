import Account from '../models/account.js';
import User from '../models/user.js';
import Person from '../models/person.js';

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
        const { value } = req.body;

        const account = await Account.findOne({
            where: {
                number: sessionAccount.number,
                name: sessionAccount.name
            }
        }).then((result) => {
            return result;
        }).catch((error) => {
            return error;
        });

        if(account) {
            const newBalance = parseFloat(account.balance) + parseFloat(value);

            const result = await Account.update(
                {balance: newBalance},
                {where: {
                    number: account.number,
                    name: account.name
                }}
            ).then((result) => {
                return result;
            }).catch((error) => {
                return error;
            });
    
            console.log(result);
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
            return result;
        }).catch((error) => {
            return error;
        });

        if(targetAccount) {
            if(account.number  !==  targetAccount.dataValues.number) {
                let targetPerson;
                const targetUser = await User.findOne({
                    where: {
                        id: targetAccount.dataValues.userId
                    }
                }).then((result) => {
                    return result;
                }).catch((error) => {
                    return error;
                });

                if(targetUser) {
                    targetPerson = await Person.findOne({
                        where: {
                            id: targetUser.dataValues.personId
                        }
                    }).then((result) => {
                        return result;
                    }).catch((error) => {
                        return error;
                    });

                    if(targetPerson) {
                        res.render("transferView/index.html", {account, user, targetAccount: targetAccount.dataValues, targetUser: targetPerson.dataValues});
                    }
                }


            } else {
                console.log('não pode transferir para a mesma conta!')
            }
        }
    }
}

function transferView(req, res) {
}

async function transfer(req, res) {
    const { targetAccountNumber, targetAccountName, value } = req.body;
    const account = req.session.account;

    const targetAccount = await Account.findOne({
        where: {number: targetAccountNumber, name: targetAccountName}
    }).then((result) => {
        return result.dataValues;
    }).catch((error) => {
        return error;
    });

    const currentAccount = await Account.findOne({
        where: {number: account.number, name: account.name}
    }).then((result) => {
        return result.dataValues;
    }).catch((error) => {
        return error;
    });

    console.log("target Account >>>" + targetAccount)

    if(currentAccount  &&  targetAccount) {
        if(currentAccount.number  !==  targetAccount.number) {
            const currentAccountNewBalance = parseFloat(currentAccount.balance) - parseFloat(value);
            const targetAccountNewBalance = parseFloat(targetAccount.balance) + parseFloat(value);

            if(currentAccountNewBalance < 0) {
                console.log("Saldo em Conta insuficiente");
                return;
            }

            const currentResult = await Account.update(
                {balance: currentAccountNewBalance},
                {where: {
                    number: currentAccount.number,
                    name: currentAccount.name
                }}
            ).then((result) => {
                return result;
            }).catch((error) => {
                return error;
            })

            
            const targetResult = await Account.update(
                {balance: targetAccountNewBalance},
                {where: {
                    number: targetAccount.number,
                    name: targetAccount.name
                }}
            ).then((result) => {
                return result;
            }).catch((error) => {
                return error;
            });
        } else {
            console.log('não pode transferir para a mesma conta!')
        }
    }

}

export default {
    createAccountView,
    createAccount,
    accountHome,
    depositView,
    deposit,
    transferCheckView,
    transferCheck,
    transferView,
    transfer
}