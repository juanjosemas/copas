document.addEventListener("DOMContentLoaded", function() {
    const bebidasPorMesa = {}; // Objeto para almacenar las bebidas de cada mesa
    const bebidasLista = document.getElementById("bebidas-lista");
    const resetearBtn = document.getElementById("resetear-btn");
    const modal = document.getElementById("modal");
    const bebidaInput = document.getElementById("bebida-input");
    const confirmarBtn = document.getElementById("confirmar-btn");
    const closeBtn = document.getElementsByClassName("close")[0];
    const menuBtn = document.querySelector(".menu-btn");
    const menu = document.getElementById("menu");
    const mesaTitulo = document.getElementById("mesa-titulo");
    const bebidasPredeterminadas = ["Coca-cola", "Tonica", "Fanta Naranja", "Fanta Limon", "Sprite", "Coca-cola Zero"];

    function toggleMenu() {
        menu.classList.toggle("show-menu");
    }

    // Agregar bebidas predeterminadas
    function agregarBebidasPredeterminadas(mesa) {
        bebidasPorMesa[mesa] = bebidasPredeterminadas.map(bebida => ({ nombre: bebida, cantidad: 0 }));
    }

    // Agregar evento de clic al botón "Reset"
    resetearBtn.addEventListener("click", function() {
        bebidasPorMesa[currentTable].forEach(bebida => {
            if (bebidasPredeterminadas.includes(bebida.nombre)) {
                bebida.cantidad = 0; // Restablecer las cantidades de las bebidas predeterminadas a cero
            } else {
                bebidasPorMesa[currentTable] = bebidasPorMesa[currentTable].filter(beb => beb !== bebida); // Eliminar las bebidas no predeterminadas
            }
        });
        actualizarListaBebidas();
    });

    confirmarBtn.addEventListener("click", function() {
        const bebidaNombre = bebidaInput.value.trim();
        if (bebidaNombre) {
            // Verificar si existe la mesa en bebidasPorMesa, si no existe, crearla
            if (!bebidasPorMesa[currentTable]) {
                bebidasPorMesa[currentTable] = [];
            }
            let bebida = bebidasPorMesa[currentTable].find(bebida => bebida.nombre === bebidaNombre);
            if (!bebida) {
                bebida = { nombre: bebidaNombre, cantidad: 0 }; // Establecer la cantidad inicial en 0
                bebidasPorMesa[currentTable].push(bebida);
            }
            actualizarListaBebidas();
            bebidaInput.value = ""; // Borrar el contenido del input después de confirmar la bebida
        }
    });

    // Manejar el cambio de mesa y agregar bebidas predeterminadas
    document.querySelectorAll(".menu a").forEach(function(link) {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const mesa = event.target.textContent;
            currentTable = mesa;
            if (!bebidasPorMesa[currentTable]) {
                agregarBebidasPredeterminadas(currentTable); // Agregar bebidas predeterminadas si aún no están definidas para esta mesa
            }
            actualizarListaBebidas();
            mesaTitulo.textContent = mesa; // Mostrar el nombre de la mesa debajo del título
            toggleMenu(); // Ocultar el menú emergente al seleccionar una mesa
        });
    });

    // Función para actualizar la lista de bebidas según la mesa actual
    function actualizarListaBebidas() {
        bebidasLista.innerHTML = ""; // Limpiar la lista de bebidas
        const bebidas = bebidasPorMesa[currentTable] || []; // Obtener las bebidas de la mesa actual
        bebidas.forEach(function(bebida) {
            const li = document.createElement("li");
            const bebidaSpan = document.createElement("span");
            const btnDelete = document.createElement("button");
            const btnSumar = document.createElement("button");
            const btnRestar = document.createElement("button");
            const quantitySpan = document.createElement("span");

            bebidaSpan.textContent = bebida.nombre;
            quantitySpan.textContent = "Cant: " + bebida.cantidad;

            btnSumar.textContent = "+";
            btnRestar.textContent = "-";

            btnSumar.classList.add("btn-sumar");
            btnRestar.classList.add("btn-restar");

            // Verificar si la bebida es predeterminada o agregada por el usuario
            if (bebidasPredeterminadas.includes(bebida.nombre)) {
                btnDelete.style.display = "none"; // Ocultar el botón "X" para las bebidas predeterminadas
            } else {
                btnDelete.textContent = "X"; // Mostrar el botón "X" para las bebidas agregadas por el usuario
                btnDelete.classList.add("btn-delete");
                btnDelete.addEventListener("click", function() {
                    bebida.cantidad = 0; // Restablecer la cantidad a 0
                    const index = bebidasPorMesa[currentTable].indexOf(bebida);
                    if (index !== -1) {
                        bebidasPorMesa[currentTable].splice(index, 1);
                    }
                    actualizarListaBebidas();
                });
            }

            btnSumar.addEventListener("click", function() {
                bebida.cantidad++;
                actualizarListaBebidas();
            });

            btnRestar.addEventListener("click", function() {
                if (bebida.cantidad > 0) {
                    bebida.cantidad--;
                    actualizarListaBebidas();
                }
            });

            li.appendChild(btnDelete);
            li.appendChild(bebidaSpan);
            li.appendChild(btnSumar);
            li.appendChild(btnRestar);
            li.appendChild(quantitySpan);

            li.classList.add("bebida-container");

            bebidasLista.appendChild(li);
        });
    }

    let currentTable = "Taula 1"; // Inicializar la mesa actual

    // Evento de clic para mostrar/ocultar el menú
    menuBtn.addEventListener("click", toggleMenu);

    document.addEventListener("click", function(event) {
        if (!menu.contains(event.target) && !menuBtn.contains(event.target)) {
            menu.classList.remove("show-menu");
        }
    });

    // Actualizar lista de bebidas al cargar la página
    actualizarListaBebidas();
});