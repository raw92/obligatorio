var articulo = {};
var articulosPrecargados = [];


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(CART_INFO_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            articulosPrecargados = resultObj.data;

            mostrarArticulos();
            calcularCostoCarrito();
            modificarItemCarrito("cant0", 0);
        }
    });
});


function mostrarArticulos() {

    var htmlAppEnd = "";

    for (var i = 0; i < articulosPrecargados.articles.length; i++) {
        articulo = articulosPrecargados.articles[i];

        htmlAppEnd += ` 
        <tr>
            <td><img src="` + articulo.src + `" width=90 height=70></td>
            <td>` + articulo.name + `</td>
            <td>` + articulo.currency + " " + articulo.unitCost + `</td>
            <td><input type="number" id="cant`+ i + `" onchange="modificarItemCarrito(id, ${i})" min="1" style="width: 50%" value="` + articulo.count + `"></td>
            <td id="costo`+ i + `">` + articulo.currency + " " + articulo.count * articulo.unitCost + `</td>
        </tr>
    `

    }
    document.getElementById("bodyTablaCarrito").innerHTML = htmlAppEnd;


}



function calcularCostoCarrito() {
    let costoProductosCarrito = 0;
    let costoEnvio = 0;
    let total = 0;


    for (let i = 0; i < articulosPrecargados.articles.length; i++) {
        articulo = articulosPrecargados.articles[i];
        if (articulo.currency === "USD") {
            costoProductosCarrito += articulo.count * articulo.unitCost;
        } else if (articulo.currency === "UYU") {
            costoProductosCarrito += (articulo.unitCost / 40) * articulo.count;
        }
    }
    let envioPremium = document.getElementById("premiumradio").checked;
    let envioExpress = document.getElementById("expressradio").checked;
    let envioEstandar = document.getElementById("estandarradio").checked;

    if (envioPremium) {
        costoEnvio = (costoProductosCarrito * 15) / 100;
    } else if (envioExpress) {
        costoEnvio = (costoProductosCarrito * 7) / 100;
    } else if (envioEstandar) {
        costoEnvio = (costoProductosCarrito * 5) / 100;
    }

    total = costoProductosCarrito + costoEnvio;
    document.getElementById("costoEnvioProductos").innerHTML = "USD " + costoEnvio;
    document.getElementById("costoProductos").innerHTML = "USD " + costoProductosCarrito;
    document.getElementById("totalCostText").innerHTML = "USD " + total;
}



function modificarItemCarrito(id, pos) {
    let cantArticulos = document.getElementById(id).value;
    let precioUnidad = articulosPrecargados.articles[pos].unitCost;
    let moneda = articulosPrecargados.articles[pos].currency;
    articulosPrecargados.articles[pos].count = cantArticulos;

    if (moneda === "UYU") {
        let converDolares = precioUnidad / 40;
        document.getElementById("costo" + pos).innerHTML = "USD " + cantArticulos * converDolares;
    } else {
        document.getElementById("costo" + pos).innerHTML = "USD " + cantArticulos * precioUnidad;
    }

    calcularCostoCarrito();
    cantidadItemsCarrito();
}

function cantidadItemsCarrito() {
    var cantidad = 0;
    
    for(let i = 0; i < articulosPrecargados.articles.length; i++){
        let art = articulosPrecargados.articles[i];
        cantidad += parseInt(art.count);
    }

    document.getElementById("badgeCarrito").innerHTML = cantidad;
}