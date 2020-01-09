//define a constante usuarioAutenticado
//que verifica se ha um token no localhost
export const usuarioAutenticado = () => localStorage.getItem('usuario-gufos') !==null

//define a constante parseJWT
export const parseJwt = () =>{
    //Define a variavel base64 que recebe o payload do token
    var base64 = localStorage.getItem('usuario-gufos').split('.')[1]

    //retorna o payload convertido na base64 para string e de string pa json
    return JSON.parse(window.atob(base64))
}