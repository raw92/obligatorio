var product = {};
var prodComments = [];

//funcion que muestra las imagenes del producto
//recorre el array de imagenes del producto y luego manda todas al div correspondiente
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
//Muestra las imagenes del producto en forma de Carousel igual que la anterior recorre
//el array de imagenes del prod. y las muestra.
function showCarousel(array) {
    let htmlImages = "";
    let htmlIndicators = "";

    for (i = 0; i < array.length; i++) {
        let imageSrc = array[i];
        // primero pongo la principal "active"
        if(i==0){
            htmlImages += `
            <div class="carousel-item active">
             <img class="d-block w-100" src="${imageSrc}" alt="">
            </div>
            `;
            htmlIndicators += `<li data-target="#carouselExampleControls" data-slide-to="${i}" class="active"></li>`;
        //luego muestro las demas
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
    //tomo la info del json de product info y luego se ejecuta dicha funcion si esta todo correcto continua
    getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            //creo el objeto product con la info del json
            product = resultObj.data;
            //asocio dichas variables a los id del html
            let productNameHTML = document.getElementById("productName");
            let productDescriptionHTML = document.getElementById("productDescription");
            let productCostHTML = document.getElementById("productCost");
            let productSoldCountHTML = document.getElementById("productSoldCount");
            let productCategoryHTML = document.getElementById("productCategory");
            //pongo los datos del producto en dichas variables para mostrar
            productNameHTML.innerHTML = product.name;
            productDescriptionHTML.innerHTML = product.description;
            productCostHTML.innerHTML = product.currency + " " + product.cost;
            productSoldCountHTML.innerHTML = product.soldCount;
            productCategoryHTML.innerHTML = product.category;

            //Muestro las imagenes en forma de galería y carousel
            showImagesGallery(product.images);
            showCarousel(product.images);
            //cargo otro json este sobre productos para poner info sobre prods. relacionados al mismo.
            getJSONData(PRODUCTS_URL).then(function (resultObj) {
                if (resultObj.status === "ok") {
                    //guardo productos
                    let products = resultObj.data;
                    //para cada prod. relacionado con mi prod. principal, paso a mostrar la informacion de c/u de ellos
                    let htmlProducto = "";
                    //compara los prod. relacionados con el indice de mis productos para determinar 
                    //cuales son los relacionados y mostrar la informacion de esos unicamente.
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

            //muestro los comentarios precargados del producto.
            showComments(prodComments);

        }
    });
});


//Funcion para mostrar los comentarios
function showComments(array) {
    let htmlContentToAppend = "";
    //recorro el array de comentarios y muestro su info.
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
    //recorro en base al value del radio button formato estrella en html y retorna la puntuacion
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
    //obtengo info del usuario en localstorage
    let user = localStorage.getItem("usuarioLogeado");
    //saco la fecha del momento y la modifico para que se vea como yo quiero
    let fecha = new Date();
    let dateTime = fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDay() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    let description = document.getElementById("cajaComentarios").value;

    //agrego el comentario al array de comentarios y lo muestro
    prodComments.push({ user, dateTime, description, score })
    showComments(prodComments);

}


//funcion para setear el valor del producto y guardarlo en score
function puntuacionComentario(valor) {
    score = valor;
}





