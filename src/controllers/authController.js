import Pessoa from '../models/pessoa.js';
import Usuario from '../models/usuario.js';
import pessoaController from './pessoaController.js';

function loginView(req, res) {
    res.render("loginView/index.html", {})
}

async function auth(req, res) {
    const { email, password } = req.body;

    const user = await Usuario.findOne({
        where: { email: email, password: password }
    });

    if(user !== null) {
        const pessoa = await Pessoa.findOne({
            where: { id: user.pessoaId }
        });

        if(pessoa !== null) {
            Object.assign(user, pessoa);
    
            req.session.auth = true;
            req.session.user = user;
            res.redirect('/home');
        } else {
            const auth_error = true;
            res.render('loginView/index.html', {auth_error})
        }
    }
}

export default {
    loginView,
    auth
};