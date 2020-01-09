import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './assets/pages/Home/App';
//importou a pagina categorias
import Categorias from './assets/pages/Categorias/Categorias'
import Eventos from './assets/pages/Eventos/Eventos'
import Login from './assets/pages/Login/Login'
import NotFound from "./assets/pages/NotFaund/NotFound"
import * as serviceWorker from './serviceWorker';

//importou routrt-dom
import {Route, BrowserRouter as Router, Switch, Redirect} from 'react-router-dom';

//material-desingn
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

//importamos nosso css padrão
import './assets/css/flexbox.css';
import './assets/css/reset.css';
import './assets/css/style.css';


import { usuarioAutenticado, parseJwt } from './assets/Services/auth';



const PermissaoAdmin = ({ component : Component}) =>(
    <Route
    render = {props =>
        usuarioAutenticado()&& parseJwt().Role === "Administrador" ? (
            <Component {...props} />
        ):(
            <Redirect to={{ pathname : "/login"}}/>
        )

    }

    />
)

const PermissaoAluno = ({ component : Component}) =>(
    <Route
    render = {props =>
        usuarioAutenticado()&& parseJwt().Role === "Aluno" ? (
            <Component {...props} />
        ):(
            <Redirect to={{ pathname : "/login"}}/>
        )

    }

    />
)


const Rotas = (
    <Router>
        <div>
        
            <Switch>
            <Route exact path="/" component={App} />
            <PermissaoAdmin path="/categorias" component={() =><Categorias titulo_pagina="Categorias - Gufos"/>}/>
            <PermissaoAluno path="/Eventos" component={Eventos}/>
            <Route path="/Login" component={Login}/>
            <Route component = {NotFound}/>
            </Switch>
        </div>
    </Router>
)


ReactDOM.render(Rotas, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
