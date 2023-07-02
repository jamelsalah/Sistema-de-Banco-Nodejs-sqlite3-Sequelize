import Person from '../models/person.js';
import User from '../models/user.js';
import Account from '../models/account.js';

function registerView(req, res){
    res.render("registerView/index.html", {});
}

function userRegister(req, res){
    const { name, cpf, birth, telephone, address, postalCode, email, password} = req.body;

    const person = {
        name,
        cpf,
        birth,
        telephone,
        address,
        postalCode
    }

    const user = {
        email,
        password
    }

    console.log(person)
    console.log(user)

    //check for empty fields
        const emptyError = [];
        const msg = "não pode ser vazio."

        for(let i in person) {
            const atrib = person[i];
            
            if(atrib.length == 0) {
                emptyError.push({name: i, msg})
            }
        }

        for(let i in user) {
            const atrib = user[i];
            
            if(atrib.length == 0) {
                emptyError.push({name: i, msg})
            }
        }

        console.log(emptyError);

        if(emptyError.length > 0) {
            res.render("registerView/index.html", {person, user, emptyError});
            return
        }
    // ====
    
    Person.create(person).then((result)=>{
        user.personId = result.id;

        User.create(user).then(() => {
            const success = 'Usuario Cadastrado(a) com Sucesso!';

            res.render("registerView/index.html", {person, user, success});
        }).catch((error) => {
            console.log(error);

            Person.destroy({
                where: {id: user.personId}
            })
            
            if(error.errors[0]) {
                const uniqueError =  {
                    name : error.errors[0].path,
                    msg: "já cadastrado em nosso Sistema."
                }

                console.log(uniqueError)
    
                res.render("registerView/index.html", {person, user, uniqueError});
            } else {
                res.render("registerView/index.html", {person, user, error});
            }
        });
    }).catch((error) => {
        console.log(error);

        if(error.errors[0]) {
            const uniqueError =  {
                name : error.errors[0].path,
                msg: "já cadastrado em nosso Sistema."
            }

            res.render("registerView/index.html", {person, user, uniqueError});
        } else {
            res.render("registerView/index.html", {person, user, error});
        }
    });
}

async function homeView(req, res) {
    const user = req.session.user;
    if(user) {
        const accounts = await Account.findAll({
            where: { userId: user.id }
        });

        console.log(accounts)

        if(accounts.length == 0) {
            console.log("Você não possui contas correntes criadas.")
            res.render("homeView/index.html", {user, noAccount: {msg: 'Você não possui contas correntes criadas.'}});
        } else {
            const arrayAccounts = [];

            for(let i in accounts) {
                const account = accounts[i];

                arrayAccounts.push(account.dataValues);
            }

            console.log(arrayAccounts);
            res.render("homeView/index.html", {user, arrayAccounts});
        }

    }
}

export default {
    registerView,
    userRegister,
    homeView
};