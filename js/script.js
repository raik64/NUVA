// =========================
// MANEJO DEL CARRITO
// =========================

// Crear carrito global (si no existe en localStorage)
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Actualiza el contador de productos
function actualizarContador() {
    const contador = document.getElementById("contador-carrito");
    if (contador) contador.textContent = carrito.reduce((acc, p) => acc + p.cantidad, 0);
}
actualizarContador();

// Mostrar carrito en la tabla
function mostrarCarrito() {
    const tbody = document.querySelector("#tabla-carrito tbody");
    // Solo si estamos en carrito.html
    if (!tbody) return;

    tbody.innerHTML = "";

    carrito.forEach((producto, index) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td><img src="${producto.imagen}" alt="${producto.nombre}" style="width:50px; height:50px; object-fit:contain;"> ${producto.nombre}</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td>
                <input type="number" min="1" value="${producto.cantidad}" class="input-cant" data-index="${index}">
            </td>
            <td>$${(producto.precio * producto.cantidad).toFixed(2)}</td>
            <td><button class="btn-eliminar" data-index="${index}">Eliminar</button></td>
        `;

        tbody.appendChild(fila);
    });

    actualizarTotal();
}
// Llamar a mostrarCarrito solo si estamos en la página del carrito
if (document.querySelector("#tabla-carrito")) {
    mostrarCarrito();
}


// Calcular total del carrito
function actualizarTotal() {
    const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    const totalSpan = document.getElementById("total-carrito");
    if (totalSpan) totalSpan.textContent = `$${total.toFixed(2)}`;
}

// Añadir producto al carrito desde la página de productos.html
function agregarAlCarrito(producto) {
    const productoExistente = carrito.find(p => p.id === producto.id);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContador();
    alert(`${producto.nombre} añadido al carrito.`);
}


// Manejar Eventos Globales (Input de Cantidad y Eliminar)
document.addEventListener("click", (e) => {
    // 1. Eliminar producto
    if (e.target.classList.contains("btn-eliminar")) {
        const index = e.target.dataset.index;
        carrito.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
        actualizarContador();
    }
    
    // 2. Agregar producto (desde productos.html)
    if (e.target.classList.contains("btn-agregar")) {
        const id = e.target.dataset.id;
        const nombre = e.target.dataset.nombre;
        const precio = parseFloat(e.target.dataset.precio);
        const imagen = e.target.dataset.imagen;

        agregarAlCarrito({ id, nombre, precio, imagen });
    }
});

document.addEventListener("input", (e) => {
    // 3. Cambiar cantidad (solo en carrito.html)
    if (e.target.classList.contains("input-cant")) {
        const index = e.target.dataset.index;
        // Asegurarse que la cantidad sea al menos 1
        let nuevaCantidad = parseInt(e.target.value);
        if (nuevaCantidad < 1 || isNaN(nuevaCantidad)) {
            nuevaCantidad = 1;
            e.target.value = 1;
        }

        carrito[index].cantidad = nuevaCantidad;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
        actualizarContador();
    }
});

// Confirmar compra
const btnConfirmar = document.getElementById("btn-confirmar");
if (btnConfirmar) {
    btnConfirmar.addEventListener("click", () => {
        if (carrito.length === 0) {
            alert("Tu carrito está vacío.");
            return;
        }
        alert("¡Compra confirmada! Gracias por tu pedido.");
        carrito = [];
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
        actualizarContador();
    });
}