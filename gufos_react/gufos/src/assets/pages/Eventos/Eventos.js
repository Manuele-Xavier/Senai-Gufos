import React, { Component } from 'react';
import Footer from '../../componentes/Footer/Footer'
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBInput} from 'mdbreact';
import Cabecalho from '../../componentes/Header/Header';
//utilizando o link do router dom 


class Eventos extends Component {

  constructor() {

    super();
    this.state = {
      lista: [],
      nome: "",
      data: "",
      acesso: "",
      categoriaId: "",
      listaCategorias: [],
      modal: false,
      //usamo para armazenar os dados a serem alterados 
      editarModal: {
        eventoId: "",
        titulo: "",
        dataEvento: "",
        AcessoLivre: "",
        categoriaId: "",
      },


      loading: false,

      erroMsg: ""

    }

    this.CadastrarEvento = this.CadastrarEvento.bind(this);

  }
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
    this.ListarCategorias();
  }

  componentDidUpdate() {
    console.log("Atualizando");
  }

  componentWillUnmount() {
    console.log("saindo")

  }

  //get
  listaAtualizada = () => {

    this.setState({ loading: true });

    fetch("http://localhost:5000/api/Evento")
      .then(response => response.json())
      .then(data => {
        this.setState({ lista: data })
        console.log(data)
      })

    //desabilita o icone apos dois segundos
    setTimeout(() => {
      this.setState({ loading: false })
    }, 2000);
  }

  //categoria
  ListarCategorias = () => {

    fetch("http://localhost:5000/api/Categoria")
      .then(response => response.json())
      .then(data => {
        this.setState({ listaCategorias: data });
        console.log(data);
      })
      .catch(error => console.log(error));



  }
  

  //deletar

  deletarEvento = (id) => {
    console.log("Excluindo")

    fetch("http://localhost:5000/api/Evento/" + id, {
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
      .catch(error => this.setState({ erroMsg: "Não é possivel excluir essa categoria, verifique se não ha eventos que a utilizem" }))

  }


  //post

  CadastrarEvento(event) {
    //impede que a pagina seja recarregada
    event.preventDefault();
    console.log("Cadastrando");
    console.log(this.state.nome);
    console.log(this.state.data);
    console.log(this.state.acesso);
    console.log(this.state.categoriaId);

    fetch("http://localhost:5000/api/Evento", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        titulo: this.state.nome,
        dataEvento: this.state.data,
        AcessoLivre: this.state.acesso === "1" ? true :  false,
        categoriaId: this.state.categoriaId
      }
      )

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
  


  alterarEvento = (evento) => {
    console.log(evento)

    this.setState({
      editarModal: {
      eventoId: evento.eventoId,
      titulo: evento.nome,
      dataEvento: evento.data,
      AcessoLivre: evento.acesso,
      categoriaId: evento.categoriaId
        
        
      }
    });
    

    //abrir modal

    this.toggle();
  }

  atualizaEditarModalTitulo = (input) => {
    this.setState({
      editarModal: {
        ...this.state.editarModal,[input.target.name] : input.target.value}
    });
  }

  //update

  salvarAlteracoes = (event) => {
    event.preventDefault();

    let id = this.state.editarModal.eventoId;   
       
        let AlteracaoEventos = {
          titulo: this.state.editarModal.nome,
          dataEvento: this.state.editarModal.data,
          AcessoLivre: this.state.editarModal.acesso === "1" ? true :  false,
          categoriaId: this.state.editarModal.categoriaId
            
        }

        console.log(AlteracaoEventos);

    fetch(`http://localhost:5000/api/Evento/${id}`,{
      method: "PUT",
      headers: {
        "Content-Type" : "application/json"
      },

      body: JSON.stringify(AlteracaoEventos)

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


  //utilizamos para atualizar os states dos inputs
  atualizaEstado = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

 


  render() {



    let options = {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false,
      timeZone: 'America/Sao_Paulo'
    };

    
    

    return (
      

      <div>
        <Cabecalho />
        <h1>Eventos</h1>
        <main className="conteudoPrincipal">
          <section className="conteudoPrincipal-cadastro">
            <h1 className="conteudoPrincipal-cadastro-titulo">Eventos</h1>
            <div className="container" id="conteudoPrincipal-lista">
              <table id="tabela-lista">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Evento</th>
                    <th>Data</th>
                    <th>Acesso Livre</th>
                    <th>Tipo do Evento</th>
                    <th>Ações</th>
                    {/* <th>Localizacao</th> */}
                  </tr>
                </thead>

                <tbody id="tabela-lista-corpo">{
                  //varrer a lista de evento
                  this.state.lista.map(function (evento) {
                    return (
                      //colocamos uma key pois cada linha em jsx precisa de um id unico
                      <tr key={evento.eventoId}>
                        <td>{evento.eventoId}</td>
                        <td>{evento.titulo}</td>
                        <td>{new Intl.DateTimeFormat('pt-BR', options).format(Date.parse(evento.dataEvento))}</td>
                        <td>{evento.AcessoLivre ? "sim" : "não"}</td>
                        <td>{evento.categoria.titulo}</td>
                        <td>
                          <button onClick={e => this.alterarEvento(evento)}>Alterar</button>
                          <button onClick={e => this.deletarEvento(evento.eventoId)}>Excluir</button></td>

                      </tr>
                    )
                    //usamos para vincular todo o contesto do map

                  }.bind(this))
                }

                </tbody>

              </table>
              {/* verifica  */}
              {this.state.erroMsg && <div className="text-danger">{this.state.erroMsg} </div>}
                {/* verifica se o estado de loading esta como true e mostra carregando */}
                {this.state.loading && <i className="fas fa-spinner fa-spin fa-2x blue-text"></i>}
            </div>

            <form onSubmit={this.CadastrarEvento}>

              <div className="container" id="conteudoPrincipal-cadastro">
                <h2 className="conteudoPrincipal-cadastro-titulo">Cadastrar Evento</h2>
                <div className="container">
                  <input
                    type="text"
                    id="evento__titulo"
                    placeholder="título do evento"

                    value={this.state.nome}
                    onChange={this.atualizaEstado} name="nome"


                  />

                  < input type="date" id="evento__data" placeholder="dd/MM/yyyy"
                    value={this.state.data}
                    onChange={this.atualizaEstado} name="data"
                    getValue={this.getPickerValue}
                  />
                  <select id="option__acessolivre"
                    value={this.state.acesso}
                    onChange={this.atualizaEstado} name="acesso"
                  >
                    <option value="1">Livre</option>
                    <option value="0">Restrito</option>


                  </select>
                  <select id="option__tipoevento" onChange={this.atualizaEstado} name="categoriaId">
                    {/* <option value="0" selected disabled>Selecione Tipo do Evento</option> */}
                    {   // Percorrer a lista de categoria
                      this.state.listaCategorias.map(function (categoria) {
                        return (
                          // Colocamos uma Key pois cada linha em jsx precisa de um Id Unico
                          <option key={categoria.categoriaId} value={categoria.categoriaId}>{categoria.titulo}</option>
                        )
                        // Usamos para vincular todo o contexto do map
                      })
                    }

                  </select>

                </div>
                <button
                  type="submit"
                  className="conteudoPrincipal-btn conteudoPrincipal-btn-cadastro"
                >
                  Cadastrar
          </button>
              </div>
            </form>
            <MDBContainer>
              {/* abraçamos os inputs do container com um form para utilizar o evento onsubmit */}
              <form onSubmit={this.salvarAlteracoes}>

                <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
                  <MDBModalHeader toggle={this.toggle}>Editar - {this.state.editarModal.titulo}</MDBModalHeader>
                  <MDBModalBody>
                    
                  <input
                    type="text"
                    id="evento__titulo"
                    placeholder="título do evento"

                    value={this.state.nome}
                    onChange={this.atualizaEstado} name="nome"


                  />
                  <br/><br/>

                  < input type="date" id="evento__data" placeholder="dd/MM/yyyy"
                    value={this.state.data}
                    onChange={this.atualizaEstado} name="data"
                    getValue={this.getPickerValue}
                  />
                  <br/><br/>
                  <select id="option__acessolivre"
                    value={this.state.acesso}
                    onChange={this.atualizaEstado} name="acesso"
                  >
                    <option value="1">Livre</option>
                    <option value="0">Restrito</option>


                  </select>
                  <br/><br/>
                  <select id="option__tipoevento" onChange={this.atualizaEstado} name="categoriaId">
                    {/* <option value="0" selected disabled>Selecione Tipo do Evento</option> */}
                    {   // Percorrer a lista de categoria
                      this.state.listaCategorias.map(function (categoria) {
                        return (
                          // Colocamos uma Key pois cada linha em jsx precisa de um Id Unico
                          <option key={categoria.categoriaId} value={categoria.categoriaId}>{categoria.titulo}</option>
                        )
                        // Usamos para vincular todo o contexto do map
                      })
                    }

                  </select>
        

                  </MDBModalBody>

                  <MDBModalFooter>
                    <MDBBtn color="secondary" onClick={this.toggle}>Fechar</MDBBtn>
                    {/* incluimos o type submit no botão para enviar o formulario */}
                    <MDBBtn color="primary" type="submit">Salvar</MDBBtn>
                  </MDBModalFooter>
                </MDBModal>
              </form>
            </MDBContainer>
          </section>

        </main>
        <Footer />
      </div>

    );

  }
}




export default Eventos;
