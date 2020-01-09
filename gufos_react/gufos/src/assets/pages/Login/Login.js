import React, { Component } from 'react';
import '../../css/login.css'
import Cabecalho from '../../componentes/Header/Header';
import Axios from 'axios'
import { parseJwt } from '../../Services/auth';
import api from '../../Services/api';



class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      senha: "",
      erroMensagem: "",
      isLoading: false
    }
  }

  realizarLogin = (event) => {
    event.preventDefault();
    this.setState({ erroMensagem: '' })

    //define que uma requisição esta em andamento
    this.setState({ isLoading: true })
    // let config = {
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Access-Control-Allow-Origin": "*"//cors
    //   }
    // }
    // Axios.post("http://localhost:5000/api/login", {
    //   email: this.state.email,
    //   senha: this.state.senha
    // }, config)
    let usuario = {
      email: this.state.email,
      senha: this.state.senha
    }

    api.post("/login", usuario)
      .then(response => {
        // console.log("Retorno do login: ",response);
        //exibe no console somente o token
        console.log("Meu token é: " + response.data.token)

        //caso a requisição retorne um status code 200
        //sarvar o token no localstorage
        //e define que a requiseição terminou
        if (response.status === 200) {

          localStorage.setItem('usuario-gufos', response.data.token)
          this.setState({ isLoading: false })
          //define base 64 recebendo o payload do token
          var base64 = localStorage.getItem('usuario-gufos').split('.')[1]
          console.log(base64)

          //exibe valor convertido para string
          console.log(window.atob(base64))

          //exibe valor convertido pra json
          console.log(JSON.parse(window.atob(base64)))

          //exibe no console o tipo de usuario logado
          console.log(parseJwt().Role)

          if (parseJwt().Role === 'Administrador') {
            this.props.history.push('/categorias')
          } else {
            this.props.history.push('/eventos')
          }
        }

      })
      //caso ocorra algum erro define o state mensagem como 'E-mail ou senha invlaido'
      .catch(erro => {
        console.log("Erro: ", erro)
        this.setState({ erroMensagem: 'E-mail ou senha inválidos!' })
        this.setState({ isLoading: false })
      })
  }

  atualizaEstado = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }
  render() {
    return (
      <div>
        <Cabecalho />
        <section className="container flex">
          <div className="img__login"><div className="img__overlay"></div></div>

          <div className="item__login">
            <div className="row">
              <div className="item">
                {/* <img src="./assets/img/icon-login.png" className="icone__login" /> */}
              </div>
              <div className="item" id="item__title">
                <p className="text__login" id="item__description">
                  Bem-vindo! Faça login para acessar sua conta.
            </p>

              </div>
              <form onSubmit={this.realizarLogin}>
                <div className="item">
                  <input
                    className="input__login"
                    placeholder="username"
                    type="text"
                    name="email"
                    value={this.state.email}
                    onChange={this.atualizaEstado}
                    id="login__email"
                  />
                </div>
                <div className="item">
                  <input
                    className="input__login"
                    placeholder="password"
                    type="password"

                    name="senha"
                    value={this.state.senha}
                    onChange={this.atualizaEstado}
                    id="login__password"
                  />
                </div>

                <div className="item">
                  <p style={{ color: "red" }}>{this.state.erroMensagem}</p>

                </div>
                {
                  this.state.isLoading === true &&
                  <div className="item">
                    <button type="submit" className="btns btn__login" id="btn__login" disabled>
                      Loading...
                                        </button>
                  </div>
                }
                {
                  this.state.isLoading === false &&
                  <div className="item">
                    <button type="submit" className="btns btn__login" id="btn__login" >
                      Login
                                        </button>
                  </div>
                }

              </form>
            </div>
          </div>
        </section>

        {/* <script>
      // console.log(document);
      // id
      // console.log(document.getElementById("login__email"));
      // classNamee
      // console.log(document.getElementsByclassNameName("input__login"));

      // var a = 10;
      // var b = "Texto";

      // // buscar a referencia do botao
      // var btnLogin = document.querySelector("#btn__login");

      // btnLogin.addEventListener("click", function(event) {
      //   event.preventDefault();
      //   // console.log("Hello World!");
      //   console.log(document.querySelector("#login__email").value);
      // });

      var inputSenha = document.querySelector("#login__password");

      inputSenha.addEventListener("keyup", function() {
        // caso a senha tenha menos do que 6 caracteres, fica vermelho, querido
        if (inputSenha.value.length < 6) {
          inputSenha.style.borderBottomColor = "red";
        } else {
          inputSenha.style.borderBottomColor = "green";
        }
      });
    </script>
  </body> */}
      </div>
    );
  }
}
export default Login;