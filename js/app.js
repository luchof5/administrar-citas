let DB;

// Campos del formulario
const mascotaInput = document.querySelector('#mascota');
const propietarInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

let editando;

// UI
const formulario =  document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

class Citas {
    constructor() {
        this.citas = [];
    }

    agregarCitas(cita) {
        this.citas = [...this.citas, cita];
    }

    eliminarCita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id)
    }

    editarCita(citaActualizada) {
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita)
    }
}

class UI {

    imprimirAlerta(mensaje, tipo) {
        // Crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        // Agregar el mensaje de tipo error
        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        // Quitar el alerta después de 5 segundos
        setTimeout(() => {
            divMensaje.remove();
        }, 5000);
    }

    imprimirCitas({citas}) {

        this.limpiarHTML()

        citas.forEach( cita => {
            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;
            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            // Scripting de los elementos de cita
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('cita-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrfo = document.createElement('p');
            propietarioParrfo.innerHTML = `
                <span class="font-weight-bolder"> Propietario: </span> ${propietario}
            `;
            
            const telefonoParrfo = document.createElement('p');
            telefonoParrfo.innerHTML = `
                <span class="font-weight-bolder"> Telefono: </span> ${telefono}
            `;

            const fechaParrfo = document.createElement('p');
            fechaParrfo.innerHTML = `
                <span class="font-weight-bolder"> Fecha: </span> ${fecha}
            `;

            const horaParrfo = document.createElement('p');
            horaParrfo.innerHTML = `
                <span class="font-weight-bolder"> Hora: </span> ${hora}
            `;

            
            const sintomasParrfo = document.createElement('p');
            sintomasParrfo.innerHTML = `
                <span class="font-weight-bolder"> Síntomas: </span> ${sintomas}
            `;

            // Boton para eliminar esta cita
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2',);
            btnEliminar.innerHTML = 'Eliminar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
            btnEliminar.onclick = () => eliminarCita(id);

            // Añade un botón para editar
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = 'Editar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>';
            btnEditar.onclick = () => cargarEdicion(cita);


            // Agregar los parrafos al divCita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrfo);
            divCita.appendChild(telefonoParrfo);
            divCita.appendChild(fechaParrfo);
            divCita.appendChild(horaParrfo);
            divCita.appendChild(sintomasParrfo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            // Agregar las citas al HTML
            contenedorCitas.appendChild(divCita);
        });
    }

    limpiarHTML() {
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild)
        }
    }
}

const ui = new UI();
const administrarCitas = new Citas();

window.onload = () => {
    eventListeners();
    
    crearDB();
}


// Registrar eventos

function eventListeners() {
    mascotaInput.addEventListener('input', datosCita);
    propietarInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita);
}

// Objeto principal con la información de la cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

// Agrega datos al objeto de cita
function datosCita(e) {
    citaObj[e.target.name] = e.target.value;
}

// Valida y agrega una nueva cita a la clase citas
function nuevaCita(e) {
    e.preventDefault();

    // Extraer las información del objeto de cita
    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    // Validar
    if (mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '' ) {
        ui.imprimirAlerta('Todos los campos on obligatorios', 'error');
        return;
    }

    if (editando) {
        ui.imprimirAlerta('Editado correctamente');

        // Pasar el objeto de la cita a edición
        administrarCitas.editarCita({...citaObj});

        // Regresar el texto del botón a su estado original
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

        // Quitar modo edicioón
        editando = false;
    } else {
        // Generar un único ID
    citaObj.id = Date.now();

    // Creando una nueva cita
    administrarCitas.agregarCitas({...citaObj});

    // Insertar registro in IndexDB
    const transaction = DB.transaction(['citas'], 'readwrite');

    // Habilitar el objectStore
    const objectStore = transaction.objectStore('citas');

    // Insertar en la BD
    objectStore.add(citaObj);

    transaction.oncomplete = function() {
        console.log('Cita agregada');

        // Mensaje mostrado 
        ui.imprimirAlerta('Se agregó correctamente');
        
    }
    }

    

    // Reiniciar el objeto de la validación
    reiniciarObjeto();

    // Reiniciar el formulario
    formulario.reset();

    // Mostrar el HTML
    ui.imprimirCitas(administrarCitas);
}

function reiniciarObjeto() {
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

function eliminarCita(id) {
    // Elminar la cita
    administrarCitas.eliminarCita(id);

    // Muestra un mensaje
    ui.imprimirAlerta('Se eliminó exitosamente');

    // Refrescar las citas
    ui.imprimirCitas(administrarCitas);
}

// Carga los datos y el modo edicion
function cargarEdicion(cita) {
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    // LLenar los inputs
    mascotaInput.value = mascota;
    propietarInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // Llenar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    // Cambiar el texto del botón
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;
}


function crearDB() {
    // Crear la base de datos version 1.0
    const crearDB = window.indexedDB.open('citas', 1);

    // Si hay un error
    crearDB.onerror = function() {
        console.log('Hubo un error');
    }

    // Si todo sale bien
    crearDB.onsuccess = function() {
        console.log('DB Creada');
       
        DB = crearDB.result;


    }

    // Definir el schema
    crearDB.onupgradeneeded = function(e) {
        const db = e.target.result;

        const objectStore = db.createObjectStore('citas', {
            keyPat: 'id',
            autoIncrement: true
        })

        // Definior las columnas
        objectStore.createIndex('mascota', 'mascota', { unique: false });
        objectStore.createIndex('propietario', 'propietario', { unique: false });
        objectStore.createIndex('telefono', 'telefono', { unique: false });
        objectStore.createIndex('fecha', 'fecha', { unique: false });
        objectStore.createIndex('hora', 'hora', { unique: false });
        objectStore.createIndex('sintomas', 'sintomas', { unique: false });
        objectStore.createIndex('id', 'id', { unique: true });

        console.log('DB creada y lista');
    }


}