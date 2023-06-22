import Pessoa from '../models/pessoa.js'

function cadastrarView(req, res){
    res.render("pessoa/cadastrar.html", {});
}

function cadastrarPessoa(req, res){
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
    
    Pessoa.create(pessoa).then((result)=>{
        res.render("pessoa/cadastrar.html", {pessoa});
    }).catch((err) => {
        console.log(err)
        let erro = err
        res.render("pessoa/cadastrar.html", {erro});
    })
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
    cadastrarView,
    cadastrarPessoa,
    listarView,
    editarView,
    editarPessoa,
    deletarPessoa
};