import express from 'express';
import mustacheExpress from 'mustache-express';
import session from 'express-session';
import db from './src/db.js';
import { fileURLToPath } from 'url';
import path from 'path';

import userRoutes from './src/routes/userRoutes.js';
import indexRoutes from './src/routes/indexRoutes.js';
import authRoutes from './src/routes/authRoutes.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine('html', mustacheExpress())
app.set('view engine', 'html');
app.use(express.static('src'));
app.set('views', __dirname + '/src/views');
app.use(session({
    secret: 'secret-token',
    name: 'sessionId',
    resave: false,
    saveUninitialized: false
}));

app.use(express.urlencoded({extended: true}))

// Define as rotas da aplicação (declaradas na pasta /src/routes/)
app.use('/', indexRoutes);
app.use('/', authRoutes)
app.use('/', userRoutes);

db.sync(() => console.log(`Banco de dados conectado`));
// db.sync(({ force: true })).then(() => {
//     console.log('Tabelas recriadas com sucesso.');
//     // O código aqui será executado após a sincronização com o banco de dados
//   })
//   .catch((error) => {
//     console.error('Erro ao recriar as tabelas:', error);
//   });
const app_port = 8000
app.listen(app_port, function () {
    console.log('app rodando na porta ' + app_port)
})