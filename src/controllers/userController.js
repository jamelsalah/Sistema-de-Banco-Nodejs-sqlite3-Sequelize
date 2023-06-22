import Pessoa from '../models/pessoa.js';
import Usuario from '../models/usuario.js';

function registerView(req, res){
    res.render("registerView/index.html", {});
}

function userRegister(req, res){
    const { nome, cpf, nascimento, telefone, endereco, cep, email, senha} = req.body;

    const pessoa = {
        nome: nome,
        cpf: cpf,
        nascimento: nascimento,
        telefone: telefone,
        endereco: endereco,
        cep: cep
    }

    const usuario = {
        email: email,
        password: senha
    }

    console.log(pessoa)
    console.log(usuario)

    //check for empty fields
        const emptyError = [];
        const msg = "não pode ser vazio."

        for(let i in pessoa) {
            const atrib = pessoa[i];
            
            if(atrib.length == 0) {
                emptyError.push({name: i, msg: msg})
            }
        }

        for(let i in usuario) {
            const atrib = usuario[i];
            
            if(atrib.length == 0) {
                emptyError.push({name: i, msg: msg})
            }
        }

        console.log(emptyError);

        if(emptyError.length > 0) {
            res.render("registerView/index.html", {pessoa, usuario, emptyError});
            return
        }
    // ====
    
    Pessoa.create(pessoa).then((result)=>{
        usuario.pessoaId = result.id;

        Usuario.create(usuario).then(() => {
            const sucesso = 'Usuario Cadastrado(a) com Sucesso!';

            res.render("registerView/index.html", {pessoa, usuario, sucesso});
        }).catch((err) => {
            console.log(err);
            
            if(err.errors.ValidationErrorItem) {
                const uniqueError =  {
                    name : err.ValidationErrorItem.path,
                    msg: "já cadastrado em nosso Sistema."
                }
    
                res.render("registerView/index.html", {pessoa, usuario, uniqueError});
            } else {
                const erro = err;
                res.render("registerView/index.html", {pessoa, usuario, erro});
            }
        });
    }).catch((err) => {
        console.log(err);

        if(err.errors.ValidationErrorItem) {
            const uniqueError =  {
                name : err.ValidationErrorItem.path,
                msg: "já cadastrado em nosso Sistema."
            }

            res.render("registerView/index.html", {pessoa, usuario, uniqueError});
        } else {
            const erro = err;
            res.render("registerView/index.html", {pessoa, usuario, erro});
        }
    });
}

function listarView(req, res){
    Pessoa.findAll().then((pessoas)=>{
        res.render("pessoa/listar.html", {pessoas});
    }).catch((err) => {
        console.log(err)
        let erro = err
        res.render("pessoa/listar.html", {erro});
    })
}

function editarView(req, res){
    let id = req.params.id
    Pessoa.findByPk(id).then(function(pessoa){
        res.render("pessoa/editar.html", {pessoa});
    })
}

function editarPessoa(req, res) {
    const { nome, sobrenome, cpf, email, telefone, altura, peso} = req.body;

    const pessoa = {
        nome: nome,
        sobrenome: sobrenome,
        cpf: cpf,
        email: email,
        telefone: telefone,
        altura: altura,
        peso: peso
    }
    
    Pessoa.update(
      pessoa,
      {
        where: {
          id: req.body.id,
        },
      }
    ).then(function (sucesso) {
        res.render("pessoa/editar.html", {pessoa, sucesso});
    })
    .catch(function (erro) {
        res.render("pessoa/editar.html", {pessoa, erro})
    });

}

function deletarPessoa(req, res) {
    let id = req.params.id;

    Pessoa.destroy({
        where: {id: id}
    })

    //Pessoa.destroy(id)
}

export default {
    registerView,
    userRegister,
};