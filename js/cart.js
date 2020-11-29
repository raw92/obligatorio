var articulo = {};
var articulosPrecargados = [];


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    //cargo el json del cart info y luego ejecuto una funcion en caso que este correcto
    getJSONData(CART_INFO_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            //guardo los articulos del json precargado en la variable
            articulosPrecargados = resultObj.data;
            
            mostrarArticulos();
            calcularCostoCarrito();
            modificarItemCarrito("cant0", 0);
        }
    });
});

//muestra los articulos del carrito
function mostrarArticulos() {

    var htmlAppEnd = "";
    //recorro los articulos precargados y muestro la info del mismo
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
    //luego de guardar su info en la variable lo muestro x html
    document.getElementById("bodyTablaCarrito").innerHTML = htmlAppEnd;


}
//elimina un item del carrito usando la pos.
 function borrarItem(pos){
     //le digo que en dicha pos me borre 1 objeto unicamente
    articulosPrecargados.articles.splice(pos, 1);
    //luego muestro, calculo
    mostrarArticulos();
    calcularCostoCarrito();
    modificarItemCarrito("cant0", 0);
    cantidadItemsCarrito();
 }

//calculo el costo del carrito
function calcularCostoCarrito() {
    let costoProductosCarrito = 0;
    let costoEnvio = 0;
    let total = 0;

    //recorro articulos precargados y calculo en base a la currency del prod. y calculo costo de los prod del carrito
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

    //dependiendo el envio seleccionado calcula el costo del mismo.
    if (envioPremium) {
        costoEnvio = (costoProductosCarrito * 15) / 100;
    } else if (envioExpress) {
        costoEnvio = (costoProductosCarrito * 7) / 100;
    } else if (envioEstandar) {
        costoEnvio = (costoProductosCarrito * 5) / 100;
    }
    //costo prod de carrito + costo de envio y los muestros independientes
    total = costoProductosCarrito + costoEnvio;
    document.getElementById("costoEnvioProductos").innerHTML = "USD " + costoEnvio;
    document.getElementById("costoProductos").innerHTML = "USD " + costoProductosCarrito;
    document.getElementById("totalCostText").innerHTML = "USD " + total;
}


//modifica el item del carrito, setea de forma predeterminada una primera ves en base a la info del json
//y luego modificia si cambia la cantidad de los productos en base a su id y su pos.
function modificarItemCarrito(id, pos) {
    //toma el valor del input 
    let cantArticulos = document.getElementById(id).value;
    //usa la pos para sacar el costo por unidad
    let precioUnidad = articulosPrecargados.articles[pos].unitCost;
    //usa la pos para sacar la moneda del producto
    let moneda = articulosPrecargados.articles[pos].currency;
    //modifica la cantidad de articulos del mismo
    articulosPrecargados.articles[pos].count = cantArticulos;
    
    //validacion por si el producto llegara a ser vacio o menor a 1 lo coloca en un minimo de 1
    if (cantArticulos < 1 || cantArticulos == "") {
        cantArticulos = 1;
        document.getElementById(id).value = cantArticulos;
        articulosPrecargados.articles[pos].count = cantArticulos;
    }
    //si la currency esta en uyu lo convierte en dolares
    if (moneda === "UYU") {
        let converDolares = precioUnidad / 40;
        document.getElementById("costo" + pos).innerHTML = "USD " + cantArticulos * converDolares;
    } else {
        document.getElementById("costo" + pos).innerHTML = "USD " + cantArticulos * precioUnidad;
    }
    //recalcula el costo del carrito
    calcularCostoCarrito();
    //muestra cantidad de items del carrito
    cantidadItemsCarrito();

}
//recorre array de articulos del carrito para mostrar una badge de la cantidad de items presentes en el mismo.
function cantidadItemsCarrito() {
    var cantidad = 0;

    for (let i = 0; i < articulosPrecargados.articles.length; i++) {
        let art = articulosPrecargados.articles[i];
        cantidad += parseInt(art.count);
    }

    document.getElementById("badgeCarrito").innerHTML = cantidad;
}


//Validacion de metodo de pago, si no se selecciono ninguna opcion del select tira error por ventana modal.
function validarMetodoPago() {
    let valorSelect = document.getElementById("selectMetodoPago").value;


    if (valorSelect == "") {
        $('#errorPagoModal').modal("show")
    }
}


//Agrego un evento listener al selectMetodoPago el cual al cambiar se ejecuta
//y toma el valor del select, en caso que este sea 1 crea los inputs y los muestra sobre tarjeta de credito
//en caso que sea 2 crea los mismos para transferencia bancaria
//en caso que no coincida ninguna no realiza ningun cambio
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
    //muestro la info en el bodoy del modal de metodo de pago
    document.getElementById("metodoPagoBody").innerHTML = datosPago;
});

//Validacion de datos de pago, si valor del select es 1 valida los datos de tarjeta que no esten vacios
//si realiza con exito muestra mensaje de "success" de lo contrario informa de falta de datos
//si es opcion 2 valida datos de trans. bancaria que no esten vacios, igual que la anterior
// 
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
    //muestra el mensaje 
    document.getElementById("metodoPago").innerHTML = msg;
}