//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    //al cargar la pagina guardo el primer y unico form
    form = document.forms[0];
    //agrego un listener al form cuando hace el submit
    form.addEventListener('submit', onSubmit);
});

//Al hacer el submit le saco las opciones que vienen x defecto para que no se envie
function onSubmit(evento){
    evento.preventDefault();
    //guardo los valores de usuario y password del usuario
    var user = document.getElementById('userInput').value;
    var pass = document.getElementById('passInput').value;
    //creo objeto de usuario info para el perfil
    let usuarioInfo = {
        name: '',
        secondName: '',
        lastName: '',
        secondLastName: '',
        age: '',
        email: '',
        phone: ''
    }
//controlo que no esten vacios los campos y los guardo en el localstorage
    if(user !== "" && pass !== ""){
        localStorage.setItem("usuarioLogeado", user);//guardo para mostrar el nombre del user
        //guardo para posteriormente guardar los datos que guste en el perfil del usuario, utilizo
        //stringify sobre el objeto para poder guardarlo en el localstorage ya que solo acepta texto
        localStorage.setItem("userInfo", JSON.stringify(usuarioInfo));
        window.location = "index.html";
    }
    //alert(localStorage.getItem("usuarioLogeado"));
    //showUser();

}

function showUser(){
    var nombreUsuario = localStorage.getItem("usuarioLogeado");

    document.getElementById("mostrarUsuario").innerHTML = nombreUsuario;
    
    

}