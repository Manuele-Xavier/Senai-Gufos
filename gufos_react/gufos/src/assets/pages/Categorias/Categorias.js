import React, { Component } from 'react';
import Footer from '../../componentes/Footer/Footer'
//import da biblioteca material
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBInput } from 'mdbreact';
//utilizando o link do router dom 
import { Link } from 'react-router-dom'
import Cabecalho from '../../componentes/Header/Header';

class Categorias extends Component {

  //usado para criar nossos state(algo mutavel)
  constructor() {
    //usado para poder manipulas os states, que são erdados de component
    super();
    this.state = {
      //definimos uma lista inicial vazia
      lista: [],
      //pegar input do form de cadastro
      nome: "",
      //material desingn bootstrap
      modal: false,
      //usamo para armazenar os dados a serem alterados 
      editarModal: {

        categoriaId: "",
        titulo: ""
      },


      loading: false,

      erroMsg: ""

    }
    //damos o bind no caso de nao usarmos arrow fuction

    this.CadastrarCategoria = this.CadastrarCategoria.bind(this);
    // this.CadastrarCategoria = this.deletarCategoria.bind(this);
  }
  //toggle do modal
  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  UNSAFE_componentWillMount() {
    //this pega qualquer coisa do componente
    //props pode repetir nas outras pages meio que replicando
    document.title = this.props.titulo_pagina;
    console.log("Carregando");
  }


  componentDidMount() {
    console.log("carregado");
    console.log(this.state.lista);
    this.listaAtualizada();
  }

  componentDidUpdate() {
    console.log("Atualizando");
  }

  componentWillUnmount() {
    console.log("saindo")

  }
  //get - listar
  listaAtualizada = () => {

    this.setState({ loading: true });

    fetch("http://localhost:5000/api/Categoria")
      .then(response => response.json())
      .then(data => this.setState({ lista: data }))

    //desabilita o icone apos dois segundos
    setTimeout(() => {
      this.setState({ loading: false })
    }, 2000);
  }


  //post


  CadastrarCategoria(event) {
    //impede que a pagina seja recarregada
    event.preventDefault();
    console.log("Cadastrando");
    console.log(this.state.nome);

    fetch("http://localhost:5000/api/Categoria", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ titulo: this.state.nome })
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
        this.listaAtualizada();
        this.setState(() => ({ lista: this.state.lista }))
      })
      .catch(error => {
        console.log(error);
       
      })
    }
    //exclui a categoria 
    deletarCategoria = (id) => {
      console.log("Excluindo")

      fetch("http://localhost:5000/api/Categoria/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },

      })
        .then(response => response.json())
        .then(response => {
          console.log(response);
          this.listaAtualizada();
          this.setState(() => ({ lista: this.state.lista }))
        })
        .catch(error =>  this.setState({ erroMsg: "Não é possivel excluir essa categoria, verifique se não ha eventos que a utilizem" })) 
        
    }
    //adicionado quando clicamos no botão editar para capturar
    //e salvar no state dos dados atuais
    alterarCategoria = (categoria) => {
      console.log(categoria);

      this.setState({
        editarModal: {
          categoriaId: categoria.categoriaId,
          titulo: categoria.titulo
        }
      });

      //abrir modal

      this.toggle();
    }
    //updade atualiza a categoria
    salvarAlteracoes = (event) => {
      event.preventDefault();
      fetch("http://localhost:5000/api/Categoria/" + this.state.editarModal.categoriaId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(this.state.editarModal)

      })
        .then(response => response.json())
        .catch(error => console.log(error));

      //atraso na requisição, pois as requests possuem intervalos muito
      setTimeout(() => {
        this.listaAtualizada();

      }, 1500);




      //fechar modal
      this.toggle();
    }

    //utilizamos para alterae o input de cadastro
    atualizaNome(input){
      this.setState({ nome: input.target.value })
    }
    //utilizamos para atualizar os states dos inputs
    atualizaEditarModalTitulo(input){
      this.setState({
        editarModal: {
          categoriaId: this.state.editarModal.categoriaId,
          titulo: input.target.value
        }
      })
    }


    render() {
      let instituicao = "SENAI";
      return (
        
        <div>
        <Cabecalho/>
          <h1>Categorias</h1>
          <main className="conteudoPrincipal">
            <Link to="/">Voltar</Link>
            <section className="conteudoPrincipal-cadastro">
              <h1 className="conteudoPrincipal-cadastro-titulo">Categorias</h1>
              <div className="container" id="conteudoPrincipal-lista">
                <table id="tabela-lista">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Título</th>
                      <th>Ações</th>
                    </tr>
                  </thead>

                  <tbody id="tabela-lista-corpo">
                    {
                      //varrer a lista de categoria
                      this.state.lista.map(function (categoria) {
                        return (
                          //colocamos uma key pois cada linha em jsx precisa de um id unico
                          <tr key={categoria.categoriaId}>
                            <td>{categoria.categoriaId}</td>
                            <td>{categoria.titulo}</td>
                            <td>
                              <button onClick={e => this.alterarCategoria(categoria)}>Alterar</button>
                              <button onClick={e => this.deletarCategoria(categoria.categoriaId)}>Excluir</button>
                            </td>
                          </tr>
                        )
                        //usamos para vincular todo o contesto do map

                      }.bind(this))
                    }</tbody>
                </table>
                {/* verifica  */}
                {this.state.erroMsg && <div className="text-danger">{this.state.erroMsg} </div>}
                {/* verifica se o estado de loading esta como true e mostra carregando */}
                {this.state.loading && <i className="fas fa-spinner fa-spin fa-2x blue-text"></i>}
              </div>

              <div className="container" id="conteudoPrincipal-cadastro">
                <h2 className="conteudoPrincipal-cadastro-titulo">
                  Cadastrar Tipo de Evento
            </h2>
                <form onSubmit={this.CadastrarCategoria}>
                  <div className="container">
                    <input
                      type="text"
                      id="nome-tipo-evento"
                      placeholder="tipo do evento"
                      value={this.state.nome}
                      onChange={this.atualizaNome.bind(this)}
                    />
                    <button
                      className="conteudoPrincipal-btn conteudoPrincipal-btn-cadastro"
                    >
                      Cadastrar
                </button>
                  </div>
                </form>
                {/* utilizamos o modal da biblioteca para fazer o update */}
                <MDBContainer>
                  {/* abraçamos os inputs do container com um form para utilizar o evento onsubmit */}
                  <form onSubmit={this.salvarAlteracoes}>

                    <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
                      <MDBModalHeader toggle={this.toggle}>Editar - {this.state.editarModal.titulo}</MDBModalHeader>
                      <MDBModalBody>
                        <MDBInput label="Categoria"
                          value={this.state.editarModal.titulo}
                          onChange={this.atualizaEditarModalTitulo.bind(this)}
                        />


                      </MDBModalBody>

                      <MDBModalFooter>
                        <MDBBtn color="secondary" onClick={this.toggle}>Fechar</MDBBtn>
                        {/* incluimos o type submit no botão para enviar o formulario */}
                        <MDBBtn color="primary" type="submit">Salvar</MDBBtn>
                      </MDBModalFooter>
                    </MDBModal>
                  </form>
                </MDBContainer>

              </div>
            </section>
          </main>
          <Footer escola={instituicao} />

        </div>
      );
    }
  }

  export default Categorias;