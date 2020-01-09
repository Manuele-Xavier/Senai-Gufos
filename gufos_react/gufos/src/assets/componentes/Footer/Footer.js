import React, {Component} from 'react';
//importar o componente dentro da chaves


class Footer extends Component {

  render() {
    return (
    <footer>Escola {this.props.escola} de informatica </footer>
    );
  }
}

export default Footer;