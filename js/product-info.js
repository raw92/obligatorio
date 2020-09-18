var product = {};
var prodComments = [];

function showImagesGallery(array) {

    let htmlContentToAppend = "";

    for (let i = 0; i < array.length; i++) {
        let imageSrc = array[i];

        htmlContentToAppend += `
        <div class="col-lg-3 col-md-4 col-6">
            <div class="d-block mb-4 h-100">
                <img class="img-fluid img-thumbnail" src="` + imageSrc + `" alt="">
            </div>
        </div>
        `

        document.getElementById("productImagesGallery").innerHTML = htmlContentToAppend;
    }
}

function showCarousel(array) {
    let htmlImages = "";
    let htmlIndicators = "";

    for (i = 0; i < array.length; i++) {
        let imageSrc = array[i];
        if(i==0){
            htmlImages += `
            <div class="carousel-item active">
             <img class="d-block w-100" src="${imageSrc}" alt="">
            </div>
            `;
            htmlIndicators += `<li data-target="#carouselExampleControls" data-slide-to="${i}" class="active"></li>`;
        }else{
            htmlImages+= `
            <div class="carousel-item">
             <img class="d-block w-100" src="${imageSrc}" alt="">
            </div>
            `;
            htmlIndicators+= `
            <li data-target="#carouselExampleControls" data-slide-to="${i}"></li>
            `;
        }
    }
    document.getElementById("innerCarousel").innerHTML = htmlImages;
    document.getElementById("indicatorsCarousel").innerHTML = htmlIndicators;
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            product = resultObj.data;

            let productNameHTML = document.getElementById("productName");
            let productDescriptionHTML = document.getElementById("productDescription");
            let productCostHTML = document.getElementById("productCost");
            let productSoldCountHTML = document.getElementById("productSoldCount");
            let productCategoryHTML = document.getElementById("productCategory");

            productNameHTML.innerHTML = product.name;
            productDescriptionHTML.innerHTML = product.description;
            productCostHTML.innerHTML = product.currency + " " + product.cost;
            productSoldCountHTML.innerHTML = product.soldCount;
            productCategoryHTML.innerHTML = product.category;

            //Muestro las imagenes en forma de galería
            showImagesGallery(product.images);
            showCarousel(product.images);

            getJSONData(PRODUCTS_URL).then(function (resultObj) {
                if (resultObj.status === "ok") {
                    let products = resultObj.data;

                    let htmlProducto = "";
                    product.relatedProducts.forEach(function (productIndex) {
                        let productoRelacionado = products[productIndex];
                        htmlProducto += `
                        <div class="card" style="width: 18rem; margin: 20px">
                            <img src="${productoRelacionado.imgSrc}" class="card-img-top    " alt="">
                            <div class="card-body">
                                <h5 class="card-title">${productoRelacionado.name}</h5>
                                <p class="card-text">${productoRelacionado.description}</p>
                                <a href="" class="btn btn-link">Ver</a>
                            </div>
                        </div>`
                    })
                    document.getElementById("productosRelacionados").innerHTML = htmlProducto;

                }
            })

        }
    });
});
//Agrego un listener para buscar la info del json prod-info-comentarios
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            prodComments = resultObj.data;


            showComments(prodComments);

        }
    });
});


//Funcion para mostrar los comentarios
function showComments(array) {
    let htmlContentToAppend = "";

    for (let i = 0; i < array.length; i++) {
        let comment = array[i];

        htmlContentToAppend += `<dt>` + comment.user + `</dt> 
        <dd>` + starScore(comment.score) + `</dd>
        <dd>` + comment.dateTime + `</dd>
        <dd>` + comment.description + `</dd>
        <hr class=my-3>`

    }

    document.getElementById("userComments").innerHTML = htmlContentToAppend;
}

//Funcion para generar el puntaje en base a iconos de estrellas
function starScore(score) {
    let puntuacion = "";

    for (let i = 0; i < 5; i++) {
        if (i < score) {
            puntuacion += `<span class="fa fa-star checked"></span>`;
        }
        else {
            puntuacion += `<span class="fa fa-star"></span>`;
        }
    }

    return puntuacion;
}

//declaro la variable score
let score = 0;
//funciona para enviar el nuevo comentario y agregarlo al array de comentarios y mostrarlo nuevamente completo
function enviarComentario() {
    let user = localStorage.getItem("usuarioLogeado");
    let fecha = new Date();
    let dateTime = fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDay() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    let description = document.getElementById("cajaComentarios").value;


    prodComments.push({ user, dateTime, description, score })
    showComments(prodComments);

}


//funcion para setear el valor del producto y guardarlo en score
function puntuacionComentario(valor) {
    score = valor;
}





