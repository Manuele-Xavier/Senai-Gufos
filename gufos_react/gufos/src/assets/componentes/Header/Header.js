import React, { Component } from 'react';
import '../../css/cabecalho.css'
import logo from '../../img/icon-login.png'
import { Link , withRouter } from 'react-router-dom'
import { usuarioAutenticado, parseJwt } from '../../Services/auth';

class Cabecalho extends Component {
    logout =() => {
        localStorage.removeItem("usuario-gufos");
        this.props.history.push("/");
    }
    render() {
        return (
            <header className="cabecalhoPrincipal">
                <div className="container">
                    <img src={logo} />

                    <nav className="cabecalhoPrincipal-nav">
                        <React.Fragment>
                        <Link to="/"> Home</Link>
                        </React.Fragment>
                        {usuarioAutenticado() && parseJwt().Role === "Administrador" ? (
                            //usuario altenticado
                            <>
                                <Link to="/categorias"> Categorias</Link>
                                <a onClick={this.logout}>Sair</a>
                            </>
                        ) : (

                            usuarioAutenticado()&& parseJwt().Role === "Aluno"?(
                                <>
                                    
                                    <Link to="/eventos">Eventos</Link>
                                    <a onClick={this.logout}>Sair</a>
                                </>

                            ) : (
                            
                                <React.Fragment>
                                  <Link to="/login" className="cabecalhoPrincipal-nav-login" >Login</Link> 
                                  </React.Fragment>
                            

                            )
                        )}

                        {/* ? = if
                        : = else */}
                        {/* <Link to="/"> Home</Link>
                        <Link to="/eventos">Eventos</Link>
                        <Link to="/categorias">Contato</Link>
                        <Link to="/login" className="cabecalhoPrincipal-nav-login" >Login</Link> */}
                    </nav>
                </div>
            </header>
        );
    }
}
export default withRouter(Cabecalho);

