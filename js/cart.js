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
            <td style="text-align:center"><img src="` + articulo.src + `" width=90 height=70></td>
            <td style="text-align:center">` + articulo.name + `</td>
            <td style="text-align:center">` + articulo.currency + " " + articulo.unitCost + `</td>
            <td style="text-align:center"><input type="number" id="cant`+ i + `" onchange="modificarItemCarrito(id, ${i})" min="1" style="width: 25%"  value="` + articulo.count + `"></td>
            <td id="costo`+ i + `" style="text-align:center">` + articulo.currency + " " + articulo.count * articulo.unitCost + `</td>
            <td style="text-align:center"><i class="fas fa-trash-alt fa-lg" onclick="borrarItem(${i})"></i>
        </tr>
    `

    }
    document.getElementById("bodyTablaCarrito").innerHTML = htmlAppEnd;


}
 function borrarItem(pos){
    articulosPrecargados.articles.splice(pos, 1);

    mostrarArticulos();
    calcularCostoCarrito();
    modificarItemCarrito("cant0", 0);
    cantidadItemsCarrito();
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

    if (cantArticulos < 1 || cantArticulos == "") {
        cantArticulos = 1;
        document.getElementById(id).value = cantArticulos;
        articulosPrecargados.articles[pos].count = cantArticulos;
    }

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

    for (let i = 0; i < articulosPrecargados.articles.length; i++) {
        let art = articulosPrecargados.articles[i];
        cantidad += parseInt(art.count);
    }

    document.getElementById("badgeCarrito").innerHTML = cantidad;
}



function validarMetodoPago() {
    let valorSelect = document.getElementById("selectMetodoPago").value;


    if (valorSelect == "") {
        $('#errorPagoModal').modal("show")
    }
}



selectMetodoPago.addEventListener("change", function () {
    let datosPago = "";
    let valor = document.getElementById("selectMetodoPago").value;
    if (valor == "1") {
        datosPago =
            `<div class="row">
                <div class="col-md-5 mb-3">
                    <div class="input-group">
                        <label for="tarjetaNumero"><i class="fas fa-credit-card"></i> : </label> &nbsp;
                        <input type="text" class="form-control" id="tarjetaNumero" placeholder="N°. tarjeta" required value="">
                    </div>
                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-md-7 mb-3">
                    <div class="input-group">    
                        <label for="tarjetaVencimiento">Vencimiento: </label> &nbsp;
                        <input type="text" class="form-control" id="tarjetaVencimientoMes" placeholder="mm" required value="">&nbsp;
                        <input type="text" class="form-control" id="tarjetaVencimientoAño" placeholder="aaaa" required value="">&nbsp;
                    </div>
                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-md-4 mb-3">
                    <div class="input-group">
                        <label for="tarjetaVencimiento">CVC: </label> &nbsp;
                        <input type="text" class="form-control" id="tarjetaCodigo" placeholder="Cod." required value="">
                    </div>
                </div>
            </div>
      `;
    } else if (valor == "2") {
        datosPago =
            `<div class="row">
                <div class="col-md-7 mb-3">
                    <div class="input-group">
                        <label for="cuentaBancaria"><i class="fas fa-money-bill-wave"></i> : </label> &nbsp;
                        <input type="text" class="form-control" id="cuentaBancaria" placeholder="Numero de cuenta" required value="">
                    </div>
                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <div class="input-group">
                        <label for="nombreBanco">Banco: </label> &nbsp;
                        <input type="text" class="form-control" id="nombreBanco" placeholder="Nombre del banco" required value="">
                    </div>
                </div>
            </div>
            `;
    }

    document.getElementById("metodoPagoBody").innerHTML = datosPago;
});

function comprobarDatosDePago() {
    let valSelect = document.getElementById("selectMetodoPago").value;
    let msg = "Seleccione un metodo de pago";

    if (valSelect == "1"){
        let numTarjeta = document.getElementById("tarjetaNumero").value;
        let mesVen = document.getElementById("tarjetaVencimientoMes").value;
        let añoVen = document.getElementById("tarjetaVencimientoAño").value;
        let codTarjeta = document.getElementById("tarjetaCodigo").value;
        

        if(numTarjeta !== "" && mesVen !== "" && añoVen !== "" && codTarjeta !== ""){
            $('#pagoModal').modal('hide');
            console.log("success");
            msg = `<i class="fas fa-credit-card"></i> `+ " " +` Tarjeta - Datos completados con exito!`;
            metodoPago.classList.remove('text-danger');
            metodoPago.classList.add('text-success');
        }else{
            console.log("failed");
            msg = `<i class="fas fa-credit-card"></i> `+ " " +` Tarjeta - Falta llenar datos!`;
            metodoPago.classList.add('text-danger');
        }

    }else if (valSelect == "2"){
        let numCuenta = document.getElementById("cuentaBancaria").value;
        let nomBanco = document.getElementById("nombreBanco").value;
    
        if(numCuenta !== "" && nomBanco !== ""){
            $('#pagoModal').modal('hide');
            console.log("success");
            msg = `<i class="fas fa-money-bill-wave"></i>`+ " " +`Transferencia - Datos completados con exito`;
            metodoPago.classList.remove('text-danger');
            metodoPago.classList.add('text-success');
        }else{
            console.log("failed");
            msg = `<i class="fas fa-money-bill-wave"></i>`+ " " +`Transferencia - Falta llenar datos!`;
            metodoPago.classList.add('text-danger');
        }
    }
    document.getElementById("metodoPago").innerHTML = msg;
}