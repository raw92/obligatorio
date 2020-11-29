var productosArray = [];

const ORDER_ASC_BY_PRICE = "Costo Ascendente";
const ORDER_DESC_BY_PRICE = "Costo Descendente";
const ORDER_BY_PROD_SOLD_COUNT = "Relevancia";

var currentSortCriteria = undefined;
var minCount = undefined;
var maxCount = undefined;

//funcion para ordenar los productos 
function sortProducts(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_PRICE) {
        result = array.sort(function (a, b) {
            if (a.cost < b.cost) { return -1; }
            if (a.cost > b.cost) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_PRICE) {
        result = array.sort(function (a, b) {
            if (a.cost > b.cost) { return -1; }
            if (a.cost < b.cost) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_BY_PROD_SOLD_COUNT) {
        result = array.sort(function (a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if (aCount > bCount) { return -1; }
            if (aCount < bCount) { return 1; }
            return 0;
        });
    }

    return result;
}



//muestro grilla de productos,  recorro array de productos
function showProductsList() {
    let htmlContentToAppend = "";
    for (let i = 0; i < productosArray.length; i++) {
        let producto = productosArray[i];

        if (((minCount == undefined) || (minCount != undefined && parseInt(producto.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(producto.cost) <= maxCount))) {
            //creo el contenido para enviar al html y mostrar los productos con sus respectivos datos    
            htmlContentToAppend += `
            <div class="col-md-4">
            <a href="product-info.html" class="card mb-4 shadow-sm custom-card">
              <img class="bd-placeholder-img card-img-top" src="${producto.imgSrc}">
              <h3 class="m-3">${producto.name}</h3>
              <div class="card-body">
                <p class="card-text">${producto.description}</p>
                <p class="card-text">${producto.currency + " " + producto.cost} / ${producto.soldCount} Cantidad vendidos</p>
              </div>
            </a>
          </div>


            
        `
        }
        //mando al contenedor del html la info. para mostrar.
        document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;


    }

}
//ordena y vuelve a mostrar la lista de productos
function sortAndShowProducts(sortCriteria, productsArray) {
    currentSortCriteria = sortCriteria;

    if (productsArray != undefined) {
        productosArray = productsArray;
    }

    productosArray = sortProducts(currentSortCriteria, productosArray);

    //Muestro los productos ordenados
    showProductsList();
}


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    //toma los datos del json y despues ejecuta la funcion
    getJSONData(PRODUCTS_URL).then(function (resultObj) {
        //si todo esta correcto ejecuta la siguiente funcion para ordenar y mostrar los prods.
        if (resultObj.status === "ok") {
            sortAndShowProducts(ORDER_ASC_BY_PRICE, resultObj.data);
        }
    });
    //uso listener para darle funcionabilidad al boton de filtrado por asc, desc, y count.
    document.getElementById("sortAsc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_ASC_BY_PRICE);
    });

    document.getElementById("sortDesc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_DESC_BY_PRICE);
    });

    document.getElementById("sortByCount").addEventListener("click", function () {
        sortAndShowProducts(ORDER_BY_PROD_SOLD_COUNT);
    });
    //agrego listener al limpiar filtro y remuevo los filtros previamente aplicados.
    document.getElementById("clearRangeFilter").addEventListener("click", function () {
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showProductsList();
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function () {
        //Obtengo el mínimo y máximo de los intervalos para filtrar por precio
        //de productos.
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0) {
            minCount = parseInt(minCount);
        }
        else {
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0) {
            maxCount = parseInt(maxCount);
        }
        else {
            maxCount = undefined;
        }

        showProductsList();
    });
});