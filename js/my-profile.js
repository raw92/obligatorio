//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    //Se obtiene el formulario de publicación de producto
    var userDataForm = document.getElementById("perfil-info");
    
    
    var infoUsuario = JSON.parse(localStorage.getItem("userInfo")); 
    
    
    let userName = document.getElementById("userName");
    document.getElementById("userName").value = infoUsuario.name;
    let userLastName = document.getElementById("userLastName");
    document.getElementById("userLastName").value = infoUsuario.lastName;
    let userAge = document.getElementById("userAge");
    document.getElementById("userAge").value = infoUsuario.age;
    let userEmail = document.getElementById("userEmail");
    document.getElementById("userEmail").value = infoUsuario.email;
    let userTel = document.getElementById("userTel");
    document.getElementById("userTel").value = infoUsuario.phone;
    let userSecondName = document.getElementById("userName2");
    document.getElementById("userName2").value = infoUsuario.secondName;
    let userSecondLastName = document.getElementById("userLastName2");
    document.getElementById("userLastName2").value = infoUsuario.secondLastName;

    //Se agrega una escucha en el evento 'submit' que será
    //lanzado por el formulario cuando se seleccione 'Vender'.
    userDataForm.addEventListener("submit", function (e) {

        infoUsuario.name = document.getElementById("userName").value;
        infoUsuario.lastName = document.getElementById("userLastName").value;
        infoUsuario.age = document.getElementById("userAge").value;
        infoUsuario.email = document.getElementById("userEmail").value;
        infoUsuario.phone = document.getElementById("userTel").value;
        infoUsuario.secondName = document.getElementById("userName2").value;
        infoUsuario.secondLastName = document.getElementById("userLastName2").value;
        let infoMissing = false;

        //Quito las clases que marcan como inválidos
        userName.classList.remove('is-invalid');
        userLastName.classList.remove('is-invalid');
        userAge.classList.remove('is-invalid');
        userEmail.classList.remove('is-invalid');
        userTel.classList.remove('is-invalid');
        userSecondName.classList.remove('is-invalid');
        userSecondLastName.classList.remove('is-invalid');

        //Se realizan los controles necesarios,
        //En este caso se controla que se haya ingresado el nombre y categoría.
        //Consulto por el nombre
        if (userName.value === "") {
            userName.classList.add('is-invalid');
            infoMissing = true;
        }

        //Consulto por el apellido
        if (userLastName.value === "") {
            userLastName.classList.add('is-invalid');
            infoMissing = true;
        }

        //Consulto por la edad
        if (userAge.value <= 17) {
            userAge.classList.add('is-invalid');
            infoMissing = true;
        }

        //Consulto por el email
        if (userEmail.value === "") {
            userEmail.classList.add('is-invalid');
            infoMissing = true;
        }

        //Consulto por el telefono
        if (userTel.value === "") {
            userTel.classList.add('is-invalid');
            infoMissing = true;
        }

        if (!infoMissing) {
            //Aquí ingresa si pasó los controles, irá a enviar
            //la solicitud para crear la publicación.
            
            localStorage.setItem("userInfo", JSON.stringify(infoUsuario));
            let msgToShowHTML = document.getElementById("resultSpan");
            let msgToShow = "¡Se guardaron los cambios con exito!";

            document.getElementById("alertResult").classList.add('alert-success');

            msgToShowHTML.innerHTML = msgToShow;
            document.getElementById("alertResult").classList.add("show");

        }



        //Esto se debe realizar para prevenir que el formulario se envíe (comportamiento por defecto del navegador)
        if (e.preventDefault) e.preventDefault();
        return false;
    });
});