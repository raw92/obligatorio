//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    form = document.forms[0];

    form.addEventListener('submit', onSubmit);
});


function onSubmit(evento){
    evento.preventDefault();

    var user = document.getElementById('userInput').value;
    var pass = document.getElementById('passInput').value;

    if(user !== "" && pass !== ""){
        localStorage.setItem("usuarioLogeado", user);
        window.location = "index.html";
    }
    //alert(localStorage.getItem("usuarioLogeado"));
    //showUser();

}

function showUser(){
    var nombreUsuario = localStorage.getItem("usuarioLogeado");

    document.getElementById("mostrarUsuario").innerHTML = nombreUsuario;
    //alert(nombreUsuario);
    

}