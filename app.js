document.addEventListener("DOMContentLoaded", () => {

  const vendedor = JSON.parse(localStorage.getItem("vendedor"));

  if (!vendedor) {
    window.location.href = "/login.html";
    return;
  }

});



////////////////////////////////////////////////////////
// 🔵 DOM
////////////////////////////////////////////////////////


const clienteSelect =
document.getElementById("clienteSelect");

function getVendedor() {
  return JSON.parse(localStorage.getItem("vendedor")) || null;
}

const productosContainer =
document.getElementById("productosContainer");

let pedidoActivo = false;

let pedidoEliminadoTemporal = null;

let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

let pedidoEditandoId = null;

////////////////////////////////////////////////////////
// 🔵 CLIENTES INIT
////////////////////////////////////////////////////////

clientes.forEach(cliente => {

clienteSelect.innerHTML += `
<option value="${cliente.id}">
${cliente.nombre}
</option>
`;

});

////////////////////////////////////////////////////////
// 🔵 PRODUCTOS EN PEDIDO
////////////////////////////////////////////////////////

function agregarProducto() {

let opciones = "";

productos.forEach(producto => {
  opciones += `
    <option value="${producto.id}">
      ${producto.nombre}
    </option>
  `;
});

const fila = document.createElement("tr");

fila.innerHTML = `
  <td>
    <select class="producto">
      ${opciones}
    </select>
  </td>

  <td>
    <select class="tipoVenta">
      <option value="unidad">Unidad</option>
      <option value="presentacion">Presentación</option>
    </select>
  </td>

  <td>
    <input type="number" class="cantidad" value="1" min="1">
  </td>

  <td class="precioUnitario">0</td>

  <td class="subtotal">0</td>

<td>
  <button type="button" onclick="eliminarFila(this)">
    🗑
  </button>
</td>
`;

document.getElementById("bodyPedido").appendChild(fila);

// eventos
fila.querySelector(".cantidad").addEventListener("input", calcularTotal);
fila.querySelector(".producto").addEventListener("change", calcularTotal);
fila.querySelector(".tipoVenta").addEventListener("change", calcularTotal);

calcularTotal();
}

function nuevoPedido(){

pedidoActivo = true;

// 1. MOSTRAR TABLA
document.getElementById("contenedorTabla").style.display = "block";

// 2. LIMPIAR TABLA
document.getElementById("bodyPedido").innerHTML = "";

// 3. RESET TOTAL
document.getElementById("totalPedido").innerText = "Total: $0";

// 4. CREAR PRIMER PRODUCTO
agregarProducto();

alert("Nuevo pedido iniciado");

}

if(!pedidoActivo){
pedidoActivo = true;
}

////////////////////////////////////////////////////////
// 🔵 CALCULAR TOTAL
////////////////////////////////////////////////////////

function calcularTotal() {

let total = 0;

document.querySelectorAll("#bodyPedido tr").forEach(row => {

const productoId = Number(row.querySelector(".producto").value);
const cantidad = Number(row.querySelector(".cantidad").value);
const tipo = row.querySelector(".tipoVenta").value;

const producto = productos.find(p => p.id === productoId);

if (!producto) return;

let precio = 0;

if (tipo === "unidad") {
  precio = producto.precioUnitario;
} else {
  precio = producto.precioPresentacion;
}

const subtotal = precio * cantidad;

// mostrar en fila
row.querySelector(".precioUnitario").innerText = precio.toLocaleString();
row.querySelector(".subtotal").innerText = subtotal.toLocaleString();

total += subtotal;

});

document.getElementById("totalPedido").innerText =
"Total: $" + total.toLocaleString();

}

////////////////////////////////////////////////////////
// 🔵 WHATSAPP
////////////////////////////////////////////////////////

function enviarWhatsapp(){

const clienteId =
Number(clienteSelect.value);

if(!clienteId){

alert("Seleccione cliente");

return;

}

const cliente =
clientes.find(
c => c.id === clienteId
);

let mensaje =
`Hola ${cliente.nombre}%0A%0A`;

mensaje +=
`📦 Pedido:%0A`;

let total = 0;

document
.querySelectorAll(".producto-row")
.forEach(row=>{

const productoId =
Number(
row.querySelector(".producto").value
);

const cantidad =
Number(
row.querySelector(".cantidad").value
);

const producto =
productos.find(
p => p.id === productoId
);

if(!producto) return;

const tipo =
row.querySelector(".tipoVenta").value;

if(!tipo) return;
if(!producto || isNaN(cantidad)) return;

if(tipo === "unidad"){
total += producto.precioUnitario * cantidad;
} else {
total += producto.precioPresentacion * cantidad;
}

mensaje +=
`- ${producto.nombre} (${tipo}) x${cantidad}%0A`;

});

mensaje +=
`%0A💰 Total: $${total.toLocaleString()}`;

window.open(
`https://wa.me/${cliente.telefono}?text=${mensaje}`
);

}

////////////////////////////////////////////////////////
// 🔵 CLIENTES
////////////////////////////////////////////////////////

function nuevoCliente(){

const nombre =
prompt("Nombre de la tienda");

if(!nombre) return;

const telefono =
prompt("WhatsApp");

if(!telefono) return;

const barrio =
prompt("Barrio");

const direccion =
prompt("Dirección");

const observaciones =
prompt("Observaciones");

const cliente = {

id: Date.now(),

nombre,

telefono,

barrio,

direccion,

observaciones

};

clientes.push(cliente);

guardarClientes();

actualizarClientes();

clienteSelect.value =
cliente.id;

alert("Cliente agregado");

}

function editarCliente(){

const clienteId =
Number(clienteSelect.value);

if(!clienteId){

alert("Seleccione un cliente");

return;

}

const cliente =
clientes.find(
c => c.id === clienteId
);

cliente.nombre =
prompt(
"Nombre",
cliente.nombre
) || cliente.nombre;

cliente.telefono =
prompt(
"WhatsApp",
cliente.telefono
) || cliente.telefono;

cliente.barrio =
prompt(
"Barrio",
cliente.barrio
) || cliente.barrio;

cliente.direccion =
prompt(
"Dirección",
cliente.direccion
) || cliente.direccion;

cliente.observaciones =
prompt(
"Observaciones",
cliente.observaciones
) || cliente.observaciones;

actualizarClientes();

guardarClientes();

alert("Cliente actualizado");

}

function eliminarCliente(){

const clienteId =
Number(clienteSelect.value);

if(!clienteId){

alert("Seleccione un cliente");

return;

}

const confirmar =
confirm(
"¿Eliminar cliente?"
);

if(!confirmar) return;

const index =
clientes.findIndex(
c => c.id === clienteId
);

clientes.splice(index,1);

actualizarClientes();

guardarClientes();

alert("Cliente eliminado");

}

function actualizarClientes(){

clienteSelect.innerHTML = `
<option value="">
Seleccionar cliente
</option>
`;

clientes.forEach(cliente=>{

clienteSelect.innerHTML += `
<option value="${cliente.id}">
${cliente.nombre}
</option>
`;

});

}

function guardarClientes(){

localStorage.setItem(
"clientes",
JSON.stringify(clientes)
);

}

////////////////////////////////////////////////////////
// 🔵 MOSTRAR CLIENTE (LUPA)
////////////////////////////////////////////////////////

function mostrarCliente(){

const clienteId =
Number(clienteSelect.value);

if(!clienteId){

alert("Seleccione un cliente");

return;

}

const info =
document.getElementById(
"infoCliente"
);

if(info.style.display === "block"){

info.style.display = "none";

return;

}

const cliente =
clientes.find(
c => c.id === clienteId
);

info.style.display = "block";

info.innerHTML = `

<h3>${cliente.nombre}</h3>

<b>📱 Teléfono:</b>
${cliente.telefono}<br>

<b>📍 Barrio:</b>
${cliente.barrio}<br>

<b>🏠 Dirección:</b>
${cliente.direccion}<br>

<b>📝 Observaciones:</b>
${cliente.observaciones}

`;

}

////////////////////////////////////////////////////////
// 🔵 PRODUCTOS ADMIN
////////////////////////////////////////////////////////

function guardarProductos(){

localStorage.setItem(
"productos",
JSON.stringify(productos)
);

}

function nuevoProducto(){

const nombre =
prompt("Nombre del producto");

if(!nombre) return;

const precioUnitario =
Number(
prompt(
"Precio unitario"
)
);

if(!precioUnitario) return;

const presentacion =
Number(
prompt(
"Presentación (6, 8 o 12)"
)
);

if(
presentacion !== 6 &&
presentacion !== 8 &&
presentacion !== 12
){

alert(
"La presentación debe ser 6, 8 o 12"
);

return;

}

const producto = {

id: Date.now(),

nombre,

precioUnitario,

presentacion,

precioPresentacion:
precioUnitario *
presentacion

};

productos.push(
producto
);

guardarProductos();

actualizarProductosAdmin();

alert(
"Producto agregado"
);

}

function editarProducto(){

const productoId =
Number(
document.getElementById(
"productoAdminSelect"
).value
);

if(!productoId){

alert("Seleccione producto");

return;

}

const producto =
productos.find(
p => p.id === productoId
);

producto.nombre =
prompt(
"Nombre",
producto.nombre
) || producto.nombre;

producto.precioUnitario =
Number(
prompt(
"Precio unitario",
producto.precioUnitario
)
) || producto.precioUnitario;

producto.presentacion =
Number(
prompt(
"Presentación (6,8,12)",
producto.presentacion
)
) || producto.presentacion;

producto.precioPresentacion =
producto.precioUnitario *
producto.presentacion;

guardarProductos();

actualizarProductosAdmin();

alert("Producto actualizado");

}

function eliminarProducto(){

const productoId =
Number(
document.getElementById(
"productoAdminSelect"
).value
);

if(!productoId){

alert("Seleccione producto");

return;

}

const confirmar =
confirm(
"¿Eliminar producto?"
);

if(!confirmar) return;

const index =
productos.findIndex(
p => p.id === productoId
);

productos.splice(index,1);

guardarProductos();

actualizarProductosAdmin();

alert("Producto eliminado");

}

function actualizarProductosAdmin(){

const select =
document.getElementById(
"productoAdminSelect"
);

if(!select) return;

select.innerHTML = `
<option value="">
Seleccionar producto
</option>
`;

productos.forEach(producto=>{

select.innerHTML += `
<option value="${producto.id}">
${producto.nombre}
 | Unidad $${producto.precioUnitario.toLocaleString()}
 | x${producto.presentacion} $${producto.precioPresentacion.toLocaleString()}
</option>
`;

});

}

actualizarProductosAdmin();

////////////////////////////////////////////////////////
// 🔵 PEDIDOS
////////////////////////////////////////////////////////


function guardarPedidos() {

localStorage.setItem("pedidos", JSON.stringify(pedidos));

pedidoActivo = false;

document.getElementById("bodyPedido").innerHTML = "";
document.getElementById("contenedorTabla").style.display = "none";
document.getElementById("totalPedido").innerText = "Total: $0";

}

function obtenerFechaEntrega(){

const fecha = new Date();

fecha.setDate(
fecha.getDate() + 2
);

return fecha.toLocaleDateString();

}

function guardarPedido(){

const clienteId = Number(clienteSelect.value);

if(!clienteId){
  alert("Seleccione un cliente");
  return;
}

const cliente = clientes.find(c => c.id === clienteId);

const vendedor = getVendedor();

if(!vendedor){
  alert("No hay vendedor activo. Inicia sesión nuevamente.");
  return;
}

const productosPedido = [];
let total = 0;

if (document.querySelectorAll("#bodyPedido tr").length === 0) {
  alert("Agrega al menos un producto al pedido");
  return;
}

document.querySelectorAll("#bodyPedido tr").forEach(row=>{

const productoId = Number(row.querySelector(".producto").value);
const cantidad = Number(row.querySelector(".cantidad").value);
const tipo = row.querySelector(".tipoVenta").value;

const producto = productos.find(p => p.id === productoId);
if(!producto) return;

productosPedido.push({
  nombre: producto.nombre,
  tipo,
  cantidad,
  precioUnitario: producto.precioUnitario,
  precioPresentacion: producto.precioPresentacion
});

if(tipo === "unidad"){
  total += producto.precioUnitario * cantidad;
}else{
  total += producto.precioPresentacion * cantidad;
}

});

const pedido = {

id: Date.now(),
cliente: cliente.nombre,
fecha: new Date().toLocaleDateString(),
productos: productosPedido,
total,
estado: "pendiente",
vendedor: vendedor.nombre

};

if (pedidoEditandoId) {

  const index = pedidos.findIndex(p => p.id === pedidoEditandoId);

  if (index !== -1) {
    pedidos[index] = {
      ...pedido,
      id: pedidoEditandoId
    };
  }

  pedidoEditandoId = null;

} else {
  pedidos.push(pedido);
}

console.log("GUARDANDO:", pedido);

localStorage.setItem("pedidos", JSON.stringify(pedidos));

mostrarPedidos();


// 🔥 RESET DE EDICIÓN
pedidoEditandoId = null;

// 🔥 CERRAR TABLA Y LIMPIAR PEDIDO (igual que nuevo)
document.getElementById("bodyPedido").innerHTML = "";
document.getElementById("contenedorTabla").style.display = "none";
document.getElementById("totalPedido").innerText = "Total: $0";

alert("Pedido guardado");

actualizarInventario();
}

function mostrarPedidos() {

  const lista = document.getElementById("listaPedidos");
  if (!lista) return;

  lista.innerHTML = "";

  const vendedorActual = getVendedor()?.nombre;

  pedidos
    .slice()
    .reverse()
    .filter(p => {
      if (!vendedorActual) return true;
      return p.vendedor === vendedorActual;
    })
    .forEach(pedido => {

      const estado = pedido.estado || "pendiente";

      const productosHTML = pedido.productos.map(p =>
        `<li>${p.nombre} - ${p.tipo} x${p.cantidad}</li>`
      ).join("");

      lista.innerHTML += `
        <div class="pedido-card">

          <details>

            <summary>
              <b>${pedido.cliente}</b> |
              📅 ${pedido.fecha} |
              💰 $${pedido.total.toLocaleString()}
              ${estado === "entregado"
                ? " <span style='color:green;font-weight:bold;'>✔</span>"
                : ""
              }
            </summary>

            <div style="margin-top:10px;">

              <ul>
                ${productosHTML}
              </ul>

              <div style="margin-top:10px; display:flex; gap:10px;">

                <button 
                  onclick="cambiarEstado(${pedido.id}, 'pendiente')"
                  style="background:${estado === 'pendiente' ? '#6f42c1' : '#eee'}; color:${estado === 'pendiente' ? 'white' : 'black'};">
                  🟣 Pendiente
                </button>

                <button 
                  onclick="cambiarEstado(${pedido.id}, 'entregado')"
                  style="background:${estado === 'entregado' ? 'green' : '#eee'}; color:${estado === 'entregado' ? 'white' : 'black'};">
                  🟢 Entregado
                </button>

                <button 
  onclick="editarPedido(${pedido.id})"
  style="background:#ffc107; color:black;">
  ✏️ Editar
</button>

<button 
  onclick="eliminarPedido(${pedido.id})"
  style="background:#dc3545; color:white;">
  🗑 Eliminar
</button>

<button 
  onclick="enviarPedidoWhatsapp(${pedido.id})"
  style="background:#25D366; color:white;">
  📲 WhatsApp
</button>

              </div>

            </div>

          </details>

        </div>
      `;
    });
}

mostrarPedidos();

function eliminarFila(boton) {

const fila = boton.closest("tr");

if (!fila) return;

// eliminar fila
fila.remove();

// recalcular total
calcularTotal();

}

function cambiarEstado(id, estado) {

const pedido = pedidos.find(p => p.id === id);
if (!pedido) return;

pedido.estado = estado;

localStorage.setItem("pedidos", JSON.stringify(pedidos));
mostrarPedidos();

actualizarInventario();

}

function editarPedido(id){

const pedido = pedidos.find(p => p.id === id);
if(!pedido) return;

const confirmar = confirm("¿Quieres editar este pedido?");
if(!confirmar) return;

// cargar datos al pedido activo
document.getElementById("contenedorTabla").style.display = "block";
document.getElementById("bodyPedido").innerHTML = "";

// reconstruir productos
pedido.productos.forEach(p => {

const fila = document.createElement("tr");

const opciones = productos.map(prod => 
  `<option value="${prod.id}" ${prod.nombre === p.nombre ? "selected" : ""}>
    ${prod.nombre}
  </option>`
).join("");

fila.innerHTML = `
<td>
  <select class="producto">
    ${opciones}
  </select>
</td>

<td>
  <select class="tipoVenta">
    <option value="unidad" ${p.tipo === "unidad" ? "selected" : ""}>Unidad</option>
    <option value="presentacion" ${p.tipo === "presentacion" ? "selected" : ""}>Presentación</option>
  </select>
</td>

<td>
  <input type="number" class="cantidad" value="${p.cantidad}" min="1">
</td>

<td class="precioUnitario">0</td>
<td class="subtotal">0</td>

<td>
  <button type="button" onclick="eliminarFila(this)">🗑</button>
</td>
`;

document.getElementById("bodyPedido").appendChild(fila);

fila.querySelector(".cantidad").addEventListener("input", calcularTotal);
fila.querySelector(".producto").addEventListener("change", calcularTotal);
fila.querySelector(".tipoVenta").addEventListener("change", calcularTotal);

});

calcularTotal();

pedidoEditandoId = id;

}

function eliminarPedido(id){

const confirmar = confirm("¿Seguro que deseas eliminar este pedido?");
if(!confirmar) return;

// buscar pedido antes de borrar
const index = pedidos.findIndex(p => p.id === id);

if (index === -1) return;

// guardar copia para deshacer
pedidoEliminadoTemporal = {
  pedido: pedidos[index],
  index: index
};

// eliminar
pedidos.splice(index, 1);

// guardar en storage
localStorage.setItem("pedidos", JSON.stringify(pedidos));

// refrescar vista
mostrarPedidos();

// mostrar opción de deshacer
mostrarUndo();

alert("Pedido eliminado");

actualizarInventario();
}

function mostrarUndo() {

const existente = document.getElementById("undoBar");
if (existente) existente.remove();

const div = document.createElement("div");
div.id = "undoBar";

div.innerHTML = `
  <div style="
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: #222;
    color: white;
    padding: 12px;
    border-radius: 10px;
    display: flex;
    gap: 10px;
    align-items: center;
    z-index: 9999;
  ">
    <span>Pedido eliminado</span>

    <button onclick="deshacerEliminar()" style="background:green;color:white;">
      ↩️ Deshacer
    </button>

    <button onclick="this.parentElement.parentElement.remove()" style="background:red;color:white;">
      ✖
    </button>
  </div>
`;

document.body.appendChild(div);

// auto cerrar en 10s
setTimeout(() => {
  if (document.getElementById("undoBar")) {
    document.getElementById("undoBar").remove();
  }
}, 10000);

}

function deshacerEliminar() {

if (!pedidoEliminadoTemporal) return;

pedidos.splice(
  pedidoEliminadoTemporal.index,
  0,
  pedidoEliminadoTemporal.pedido
);

pedidoEliminadoTemporal = null;

localStorage.setItem("pedidos", JSON.stringify(pedidos));

mostrarPedidos();

// quitar barra de undo
const bar = document.getElementById("undoBar");
if (bar) bar.remove();
}

function enviarPedidoWhatsapp(id){

const pedido = pedidos.find(p => p.id === id);
if(!pedido) return;

const vendedor = getVendedor();

if(!vendedor || !vendedor.telefono){
  alert("No hay vendedor con número de WhatsApp");
  return;
}

let mensaje = `🛒 PEDIDO%0A%0A`;

mensaje += `👤 Cliente: ${pedido.cliente}%0A`;
mensaje += `📅 Fecha: ${pedido.fecha}%0A%0A`;

mensaje += `📦 Productos:%0A`;

pedido.productos.forEach(p => {
  mensaje += `- ${p.nombre} (${p.tipo}) x${p.cantidad}%0A`;
});

mensaje += `%0A💰 Total: $${pedido.total.toLocaleString()}`;

location.href = `https://wa.me/${vendedor.telefono}?text=${encodeURIComponent(mensaje)}`;

}

function abrirInventario() {

document.getElementById("modalInventario").style.display = "block";

actualizarInventario();

}

function cerrarInventario() {
document.getElementById("modalInventario").style.display = "none";
}

function actualizarInventario() {

const hoy = new Date().toLocaleDateString();

const pedidosHoy = pedidos.filter(p => p.fecha === hoy);

const inventario = {};

pedidosHoy.forEach(pedido => {

pedido.productos.forEach(prod => {

  const productoBase = productos.find(p => p.nombre === prod.nombre);

  if (!productoBase) return;

  let cantidadConvertida = 0;

  // 🔥 CONVERSIÓN A PRESENTACIÓN
  if (prod.tipo === "unidad") {
    cantidadConvertida = prod.cantidad / productoBase.presentacion;
  } else {
    cantidadConvertida = prod.cantidad;
  }

  const key = prod.nombre;

  if (!inventario[key]) {
    inventario[key] = {
      nombre: prod.nombre,
      cantidad: 0
    };
  }

  inventario[key].cantidad += cantidadConvertida;

});

});

let html = `
<table style="width:100%; border-collapse:collapse;">
<tr>
<th>Producto</th>
<th>Presentaciones</th>
</tr>
`;

Object.values(inventario).forEach(item => {
html += `
<tr>
<td>${item.nombre}</td>
<td>${item.cantidad.toFixed(2)}</td>
</tr>
`;
});

html += `</table>`;

document.getElementById("inventarioContenido").innerHTML = html;

}

function descargarInventarioPDF() {

const hoy = new Date().toLocaleDateString();

const pedidosHoy = pedidos.filter(p => p.fecha === hoy);

const inventario = {};

pedidosHoy.forEach(pedido => {

pedido.productos.forEach(prod => {

  const productoBase = productos.find(p => p.nombre === prod.nombre);

  if (!productoBase) return;

  let cantidadConvertida = 0;

  // 🔥 conversión igual que inventario
  if (prod.tipo === "unidad") {
    cantidadConvertida = prod.cantidad / productoBase.presentacion;
  } else {
    cantidadConvertida = prod.cantidad;
  }

  const key = prod.nombre;

  if (!inventario[key]) {
    inventario[key] = 0;
  }

  inventario[key] += cantidadConvertida;

});

});

const { jsPDF } = window.jspdf;
const doc = new jsPDF();

doc.setFontSize(16);
doc.text("Inventario del Día (Presentaciones)", 10, 10);

let y = 20;

Object.entries(inventario).forEach(([nombre, cantidad]) => {

doc.text(`${nombre}: ${cantidad.toFixed(2)}`, 10, y);
y += 10;

});

const pdfBase64 = doc.output("datauristring").split(",")[1];
Android.guardarPDF(pdfBase64);

}

function convertirAPresentacion(producto, cantidad, tipo) {

if (!producto) return 0;

// si es unidad → convertir a presentaciones
if (tipo === "unidad") {
  return cantidad / producto.presentacion;
}

// si ya es presentación → 그대로
if (tipo === "presentacion") {
  return cantidad;
}

return 0;
}


if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js")
      .then(() => console.log("Service Worker activo"))
      .catch(err => console.log("Error SW:", err));
  });
}

window.addEventListener("load", () => {
  if (vendedor && document.getElementById("userName")) {
    document.getElementById("userName").innerText = vendedor.nombre;
  }
});

function toggleMenu() {
  const menu = document.getElementById("userMenu");
  if (!menu) return;

  menu.style.display =
    menu.style.display === "block" ? "none" : "block";
}

function logout() {
  localStorage.removeItem("vendedor");
  window.location.href = "/login.html";
}

document.addEventListener("click", function (e) {
  const box = document.getElementById("userBox");
  const menu = document.getElementById("userMenu");

  if (box && menu && !box.contains(e.target)) {
    menu.style.display = "none";
  }
});

function cerrarSesion() {
  localStorage.removeItem("vendedor");
  window.location.href = "/login.html";
}

window.addEventListener("load", () => {
  console.log("Android object:", window.Android);
});
