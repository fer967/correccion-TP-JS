
const tabla = document.querySelector('#lista-usuarios tbody');
function cargarUsuarios(){
    fetch('usuarios.json')
    .then(res => res.json())
    .then(usuarios => {
        usuarios.forEach(usuario => {
            const row = document.createElement('tr');
            row.innerHTML += `
            <td>${usuario.nombre}</td>
            <td>${usuario.puntos}</td>
            `;
            tabla.appendChild(row);
            setTimeout(()=>{
                tabla.removeChild(row);
            }, 5000);
        });
    })
}

let datos
fetch('preguntas.json')
.then((res)=>res.json())
.then((datos)=>{
    setPreguntas(datos);
    console.log(datos)
})

function setPreguntas(datos){
    localStorage.setItem("lista", JSON.stringify(datos));         
}
const preguntas = JSON.parse(localStorage.getItem("lista")); 

const preguntaElement = document.getElementById("pregunta");
const botonRespuesta = document.getElementById("boton-respuesta");
const siguienteBoton = document.getElementById("next-btn");
const botonLista = document.getElementById('btn-lista');
botonLista.style.display = "none";
let indicePreguntaActual = 0;
let puntuacion = 0;

comenzar();

function comenzar() {
    Swal.fire({
        width:"50%",
        background: "burlywood",
        position: "center",
        text:"¿listo para jugar?",
        title: "Bienvenido",
        showConfirmButton: false, 
        timer: 3000
});
    setTimeout(() => {
        indicePreguntaActual = 0;
        puntuacion = 0;
        siguienteBoton.innerHTML = "jugar de nuevo";
        mostrarPregunta();
    }, 3000);
}

function mostrarPregunta() { 
    setTimeout(() => {                                     
        usarProximoBoton();
        Toastify({
            text: "Quedan 5 segundos",
            duration: 5000,
            gravity: "top",
            position: "center",
            style: {
                background: "red"
            }
        }).showToast();
    }, 5000);
    resetear();
    let preguntaActual = preguntas[indicePreguntaActual];
    let preguntaNumero = indicePreguntaActual + 1;
    preguntaElement.innerHTML = preguntaNumero + ". " + preguntaActual.pregunta;
    preguntaActual.respuestas.forEach(respuesta => {
        const button = document.createElement("button");
        button.innerHTML = respuesta.text;
        button.classList.add("btn");
        botonRespuesta.appendChild(button);
        if (respuesta.correct) {
            button.dataset.correct = respuesta.correct;
        }
        button.addEventListener("click", seleccionarRespuesta);
    });
}

function resetear() {
    siguienteBoton.style.display = "none";                            
    while (botonRespuesta.firstChild) {
        botonRespuesta.removeChild(botonRespuesta.firstChild);
    }
}

function seleccionarRespuesta(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        puntuacion++;
    } else {
        selectedBtn.classList.add("incorrect");
    }
    Array.from(botonRespuesta.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });                                                       
}

function mostrarPuntos() {
    resetear();
    preguntaElement.innerHTML = `Tu puntuacion  : ${puntuacion} de ${preguntas.length}`;
    siguienteBoton.innerHTML = "jugar de nuevo";
    siguienteBoton.style.display = "block";
    botonLista.style.display = "none";                       
}

function usarProximoBoton() {
    setTimeout(() => {
        indicePreguntaActual++;
        if (indicePreguntaActual < preguntas.length) {
            mostrarPregunta();
        } else {
            mostrarPuntos();
            cargarUsuarios();
            botonLista.style.display = "none"                  
        }
    }, 5000);
}

siguienteBoton.addEventListener("click", () => {
    if (indicePreguntaActual < preguntas.length) {
        usarProximoBoton();
    } else {
        comenzar();
        botonLista.style.display = "none";                    
    }
});

































