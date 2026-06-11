let clientes = JSON.parse(
localStorage.getItem("clientes")
) || [

{
id: 1,
nombre: "Tienda El Paisa",
telefono: "573001112233",
barrio: "",
direccion: "",
observaciones: ""
}

];