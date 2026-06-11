let productos = JSON.parse(localStorage.getItem("productos")) || [
  {
    id: 1,
    nombre: "Producto base",
    precioUnitario: 1000,
    presentacion: 6,
    precioPresentacion: 6000
  }
];