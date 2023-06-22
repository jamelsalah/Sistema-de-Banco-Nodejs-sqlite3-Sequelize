function indexView(req, res){
    res.render("index.html", {});
}

function loginView(req, res) {
    res.render("loginView/index.html", {})
}

export default {
    indexView,
    loginView,
};