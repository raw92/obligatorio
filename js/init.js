//direcciones con los datos de los JSONS (donde esta la info.)

const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/654.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";



//muestra spinner de carga
var showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}
//oculta spinner
var hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

/*getJSONData va a ser lo mismo que hacer la funcion pasandole una url la cual se le da al fetch
este nos permitira obtener los datos a traves de los JSONS mediante la red, este recibira una promesa, la cual retorna
una respuesta dependiendo si esta bien o mal es que actuan los catch o los then en caso positivo continua con los then
retornando el resultado que en dicho caso resulta en captar la info de los jsons de lo contrario
tiraria una error a traves del catch */
var getJSONData = function(url){
    var result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
  
 


});


//FUNCIONES DEL DROPDOWN
function dropdownShow() {
  document.getElementById("myDropdown").classList.toggle("show");
}

//Cierra el dropdown si el usuario clickea fuera
window.onclick = function(event) {
  if (!event.target.matches('#mostrarUsuario')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

//Funcion para desconectarse
function logOut(){
  
  localStorage.clear("usuarioLogeado");
  window.location = "login.html";
}


