import Axios from 'axios';
const api = Axios.create({
    //publishdeixar só localrost
    //npm run biuld
    //netcoreapp.3.0 dotnet publish
    

    baseURL:"http://localhost:5000/api",
    headers:{
        "Content-Type" : "application/json",
        "Authentication" : "Bearer" + localStorage.getItem("usuario-gufos")
    }
});

export default api;