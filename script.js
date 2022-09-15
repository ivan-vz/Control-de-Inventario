let productos = document.getElementById("Actual");
let tramites = document.getElementById("Nuevo");
let agregar = document.getElementById("agregar");
let infoProducto = [];
let infoProducto2 = []
let registroInv = [];
let registroTrans = [];
let tipo;
let umbral = 50;

function tableroProductos(){
    productos.innerHTML = '';
    //En orden son: ID, Nombre, Descripcion, Inventario y Costo por unidad
    for(let producto of registroInv){
        productos.innerHTML += `
        <tr>
        <td>#${producto.codigo}</td> 
        <td>${producto.nombre}</td> 
        <td>${producto.descripcion}</td>
        <td>${producto.inventario}u.</td>
        <td>$${producto.costoU}</td>
        `;
    }
};

function tableroTransacciones(){
    tramites.innerHTML = '';
    //En orden son: Tipo de transaccion, Fecha, ID, Cantidad, Costo por u, Subtotal, Iva, Total
    for (let tramite of registroTrans){
        tramites.innerHTML += `
        <tr>
        <td>${tramite.tipo}</td>
        <td>${tramite.fecha}</td> 
        <td>#${tramite.codigo}</td>
        <td>${tramite.inventario}u.</td>
        <td>$${tramite.costoU}</td>
        <td>$${tramite.subtotal}</td>
        <td>${tramite.iva}%</td>
        <td>$${tramite.total}</td>
        `;
    }
}

function cuidado(producto){
    let notas = document.getElementById("Cuidado");
    let nota = `<li class="list-group-item list-group-item-warning">Comprar ${producto.nombre} - Actualmente hay: ${producto.inventario}</li>`;
    notas.innerHTML += nota;
}

function Actualizar(){

    if(registroInv.length == 0){ //Si no hay ningun objeto en la lista, lo agrego directamente
        //Declaracion y asignaciones de valores
        infoProducto = [];
        infoProducto = Array.from(document.querySelectorAll('.update'));//query devuelve un nodolis, por lo que lo transformo a un array para un manejo mas comodo
        let tipos = document.querySelectorAll('.tipo');
        if(tipos[0].checked){
            tipo = "Compra";
        } else {
            tipo = "Venta";
        }
        infoProducto.push(tipo);

        //Calculo de subtotal y total
        cuentas(infoProducto[4].value, infoProducto[5].value, parseInt(infoProducto[6].value), infoProducto); //cantidad, coste unitario e IVA

        //Guardar el nuevo objeto
        registroInv.push(agregarLista(infoProducto));
        registroTrans.push(agregarLista(infoProducto));

        //Actualizacion de tableros
        tableroProductos();
        tableroTransacciones();

        //Habilita la opcion de vender
        document.getElementById('venta').disabled = false;

    } else { //Sino hago una serie de preguntas
        infoProducto2 = [];
        infoProducto2 = Array.from(document.querySelectorAll('.update'));//query devuelve un nodolis, por lo que lo transformo a un array para un manejo mas comodo
        let tipos = document.querySelectorAll('.tipo');
        if(tipos[0].checked){
            tipo = "Compra";
        } else {
            tipo = "Venta";
        }
        infoProducto2.push(tipo);

        //Calculo de subtotal y total
        cuentas(infoProducto2[4].value, infoProducto2[5].value, parseInt(infoProducto2[6].value), infoProducto2); //cantidad, coste unitario e IVA

        let n = registroInv.length;
        let newproduct = agregarLista(infoProducto2);

        for(let producto of registroInv){
            if (producto.codigo == newproduct.codigo){//Si el item ya fue agregado

                if (newproduct.tipo === "Venta"){ //Si estoy vendiendo tego que restarle la cantidad al inventario
                    if(producto.inventario - newproduct.inventario >= 0){//Si se dispone de la cantidad suficiente
                        producto.inventario = producto.inventario - newproduct.inventario;           
                        if(producto.inventario < umbral){
                            cuidado(producto);
                        }
                    } else {//sino
                        alert("No se puede vender mas productos de los que se tiene");
                        break;
                    }

                } else { //Si estoy comprando le tengo que sumar la cantidad al inventario
                    producto.inventario = parseInt(producto.inventario) + parseInt(newproduct.inventario); //Desconozco la razon por el que la resta funciona sin parseInt pero la suma no
                }
                registroTrans.push(newproduct);

            } else if(n-1 > 0){
                n = n - 1;

            } else {//EL nuevo item no ha sido agregado a la lista
                if(newproduct.tipo === "Compra"){
                    registroInv.push(newproduct);
                    registroTrans.push(newproduct);
                } else {
                    alert("No se puede vender productos inexistentes");
                }
                    break;
                }
            }
        }

        tableroProductos();
        tableroTransacciones();
    }

//console.log(registroInv);

function cuentas (cantidad, unitario, iva, array){
    let subtotal = cantidad * unitario;
    let total = subtotal + ((subtotal*iva)/100);
    array.push(subtotal, total);
}

function agregarLista(array){
    let newItem = {
        codigo: array[1].value,
        nombre: array[2].value,
        descripcion: array[3].value,
        inventario: array[4].value,
        costoU: array[5].value,
        tipo: array[7],
        fecha: array[0].value,
        subtotal: array[8],
        iva: array[6].value,
        total: array[9]
    }
    return newItem;
}