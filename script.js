document.addEventListener("DOMContentLoaded", function() {
    const bebidasPorMesa = JSON.parse(localStorage.getItem('bebidasPorMesa')) || {}; // Restaurar datos del localStorage si existen
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

    function agregarBebidasPredeterminadas(mesa) {
        bebidasPorMesa[mesa] = bebidasPredeterminadas.map(bebida => ({ nombre: bebida, cantidad: 0 }));
    }

    resetearBtn.addEventListener("click", function() {
        bebidasPorMesa[currentTable].forEach(bebida => {
            if (bebidasPredeterminadas.includes(bebida.nombre)) {
                bebida.cantidad = 0;
            } else {
                bebidasPorMesa[currentTable] = bebidasPorMesa[currentTable].filter(beb => beb !== bebida);
            }
        });
        actualizarListaBebidas();
    });

    confirmarBtn.addEventListener("click", function() {
        const bebidaNombre = bebidaInput.value.trim();
        if (bebidaNombre) {
            if (!bebidasPorMesa[currentTable]) {
                bebidasPorMesa[currentTable] = [];
            }
            let bebida = bebidasPorMesa[currentTable].find(bebida => bebida.nombre === bebidaNombre);
            if (!bebida) {
                bebida = { nombre: bebidaNombre, cantidad: 0 };
                bebidasPorMesa[currentTable].push(bebida);
            }
            actualizarListaBebidas();
            bebidaInput.value = "";
        }
    });

    document.querySelectorAll(".menu a").forEach(function(link) {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const mesa = event.target.textContent;
            currentTable = mesa;
            if (!bebidasPorMesa[currentTable]) {
                agregarBebidasPredeterminadas(currentTable);
            }
            actualizarListaBebidas();
            mesaTitulo.textContent = mesa;
            toggleMenu();
        });
    });

    function actualizarListaBebidas() {
        bebidasLista.innerHTML = "";
        const bebidas = bebidasPorMesa[currentTable] || [];
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

            if (bebidasPredeterminadas.includes(bebida.nombre)) {
                btnDelete.style.display = "none";
            } else {
                btnDelete.textContent = "X";
                btnDelete.classList.add("btn-delete");
                btnDelete.addEventListener("click", function() {
                    bebida.cantidad = 0;
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

        // Guardar datos en el localStorage
        localStorage.setItem('bebidasPorMesa', JSON.stringify(bebidasPorMesa));
    }

    let currentTable = "Taula 1";

    menuBtn.addEventListener("click", toggleMenu);

    document.addEventListener("click", function(event) {
        if (!menu.contains(event.target) && !menuBtn.contains(event.target)) {
            menu.classList.remove("show-menu");
        }
    });

    actualizarListaBebidas();
});