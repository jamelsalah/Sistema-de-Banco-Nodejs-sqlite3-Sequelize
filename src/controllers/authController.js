import Person from '../models/person.js';
import User from '../models/user.js';

function loginView(req, res) {
    res.render("loginView/index.html", {})
}

async function auth(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({
        where: { email: email, password: password }
    });

    if(user !== null) {
        const person = await Person.findOne({
            where: { id: user.personId }
        });

        if(person !== null) {
            Object.assign(user, person);

            console.log(user)
    
            req.session.auth = true;
            req.session.user = user;
            res.redirect('/home');
        } else {
            const auth_error = true;
            res.render('loginView/index.html', {auth_error})
        }
    } else {
        const wrongUser = "Usuario ou Senha Incorretos."
        res.render('loginView/index.html', {wrongUser, email: email});
    }
}

export default {
    loginView,
    auth
};