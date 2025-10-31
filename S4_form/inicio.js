onReady.ready(() => {
    init();
});

function init() {
    // Botones
    let btnValidar = document.querySelector("button[data-accion='validar']");
    let btnReset= document.querySelector("button[data-accion='reset']");
    btnValidar.addEventListener('click', validarFormulario);
    btnReset.addEventListener('click', resetFormulario);

    // Campos de formulario
    let inputNombres = document.querySelector("#nombres")
    let msgNombres = document.querySelector("span[data-target='nombres']");
    let inputApellidos = document.querySelector("#apellidos")
    let msgApellidos = document.querySelector("span[data-target='apellidos']");
    let radiosGenero = document.querySelectorAll("input[name='genero']");
    let msgGenero = document.querySelector("span[data-target='genero']");
    let inputRfc = document.querySelector("#rfc");
    let msgRfc = document.querySelector("span[data-target='rfc']");
    let inputCurp = document.querySelector("#curp");
    let msgCurp = document.querySelector("span[data-target='curp']");
    let checkboxIntereses = document.querySelectorAll("input[name='intereses']");
    let msgIntereses = document.querySelector("span[data-target='intereses']");
    let inputCalle = document.querySelector("#calle");
    let msgCalle = document.querySelector("span[data-target='calle']");
    let selectMunicipio = document.querySelector("#municipio");
    let msgMunicipio = document.querySelector("span[data-target='municipio']")
    let inputCP = document.querySelector("#cp");
    let msgCP = document.querySelector("span[data-target='cp']");
    let inputCodigoPais = document.querySelector("#codigo_pais");
    let msgCodigoPais = document.querySelector("span[data-target='codigo_pais']");
    let inputCelular = document.querySelector("#celular");
    let msgCelular = document.querySelector("span[data-target='celular']");
    let inputCorreo = document.querySelector("#correo");
    let msgCorreo = document.querySelector("span[data-target='correo']");

    // Agregar estados y evento de camios
    let inputs = document.querySelectorAll("input");
    for(input of inputs) {
        input.dataset.pristino = true; // no ha sido modificado
        input.dataset.sucio = false; // esta vacio
        input.addEventListener("change", cambiarEstadoCampo);
    }
    selectMunicipio.dataset.pristino = true;
    selectMunicipio.dataset.sucio = false; 
    selectMunicipio.addEventListener("change", cambiarEstadoCampo);
    
    let funcionesValidacion = {
        nombres: validarNombre,
        apellidos: validarApellido,
        genero: validarGenero,
        rfc: validarRFC,
        curp: validarCURP,
        intereses: validarIntereses,
        calle: validarCalle,
        municipio: validarMunicipio,
        cp: validarCodigoPostal,
        codigo_pais: validarCodigoPais,
        celular: validarCelular,
        correo: validarCorreo
    }

    function resetFormulario() {
        let msgs = document.querySelectorAll("span[data-target]");
        for (msg of msgs) {
            limpiarMsg(msg);
        }
    }

    function validarFormulario(e) {
        let formulario = {}; // Almacena la informacion del formulario en un objeto
        let todosValidos = true;

        let resNombre = validarNombre();
        todosValidos &&= resNombre.valido;
        if (resNombre.valido) {
            formulario.nombre = resNombre.valor;
        }
        
        let resApellido = validarApellido();
        todosValidos &&= resApellido.valido;
        if (resApellido.valido) {
            formulario.apellido = resApellido.valor;
        }

        let resGenero = validarGenero();
        todosValidos &&= resGenero.valido;
        if (resGenero.valido) {
            formulario.genero = resGenero.valor;
        }

        let resRfc = validarRFC();
        todosValidos &&= resRfc.valido;
        if (resRfc.valido) {
            formulario.rfc = resRfc.valor;
        }

        let resCurp = validarCURP();
        todosValidos &&= resCurp.valido;
        if (resCurp.valido) {
            formulario.curp = resCurp.valor;
        }

        let resIntereses = validarIntereses();
        todosValidos &&= resIntereses.valido;
        if (resIntereses.valido) {
            formulario.intereses = resIntereses.valor;
        }

        let resCalle = validarCalle();
        todosValidos &&= resCalle.valido;
        if (resCalle.valido) {
            formulario.direccion = resCalle.valor;
        }

        let resMunicipio = validarMunicipio();
        todosValidos &&= resMunicipio.valido;
        if (resMunicipio.valido) {
            formulario.municipio = resMunicipio.valor;
        }

        let resCp = validarCodigoPostal();
        todosValidos &&= resCp.valido;
        if (resCp.valido) {
            formulario.cp = resCp.valor;
        }

        let resCodigoPais = validarCodigoPais();
        todosValidos &&= resCodigoPais.valido;
        if (resCodigoPais.valido) {
            formulario.codigo_pais = resCodigoPais.valor;
        }

        let resCelular = validarCelular();
        todosValidos &&= resCelular.valido;
        if (resCelular.valido) {
            formulario.celular = resCelular.valor;
        }
        
        let resCorreo = validarCorreo();
        todosValidos &&= resCorreo.valido;
        if (resCorreo.valido) {
            formulario.email = resCorreo.valor;
        }
        
        if (todosValidos) {
            // Enviar formulario al servidor
            let url = '//webd.gilberto.codes/api/json.php';
            fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formulario)
            })
                .then(respone => respone.json())
                .then (response => {
                    console.log(response)
                })
                .catch(error => console.error("Error: ", error));
        }

        e.preventDefault()
    }

    // Cambiar el valor de los datos pristino y sucio de los campos
    function cambiarEstadoCampo(e) {
        let elem = e.target;
        let id = ""; // id del elemento, para saber a que funcion de validacion llamar
        elem.dataset.pristino = false;

        if (["text", "tel", "email"].includes(elem.type)) {
            // sucio es verdadero cuando el campo no está vacio
            elem.dataset.sucio = (elem.value !== "");
            id = elem.id;
        } else if (elem.type === "radio") {
            // establecer todos los radios del grupo como no sucios
            for (radio of document.querySelectorAll(`input[type="radio"][name="${elem.name}"]`)) {
                radio.dataset.sucio = false;
            }
            // establecer el radio seleccionado como sucio
            elem.dataset.sucio = true;
            id = elem.name;
        } else if (elem.type === "checkbox") {
            // cambiar el estado del checkbox de acuerdo a su estado anterior
            elem.dataset.sucio = (elem.dataset.sucio === "false"); 
            id = elem.name;
        } else if (elem.type === "select-one"){
            if (elem.value === "vacio") {
                elem.dataset.sucio = false;
            } else {
                elem.dataset.sucio = true;
            }
            id = elem.id;
        }

        // validar el campo
        funcionesValidacion[id]();
    }

    function validarNombre() {
        limpiarMsg(msgNombres);

        if (inputNombres.dataset.pistino === "true" || inputNombres.dataset.sucio === "false") {
            msgNombres.innerText = "Debes ingresar tus nombres";
            msgNombres.classList.add("form_msg_error");
            return { valido: false, valor: "" };
        }

        // El campo está sucio, no agregamos más validaciones
        msgNombres.innerText = "ok";
        msgNombres.classList.add("form_msg_ok");
        let valor = inputNombres.value.trim();
        return { valido: true, valor: valor };
    }

    function validarApellido() {
        limpiarMsg(msgApellidos);

        if (inputApellidos.dataset.pristino === "true" || inputApellidos.dataset.sucio === "false") {
            msgApellidos.innerText = "Debes ingresar tus apellidos";
            msgApellidos.classList.add("form_msg_error");
            return { valido: false, valor: ""};
        }

        // El campo está sucio, no agregamos más validaciones
        msgApellidos.innerText = "ok";
        msgApellidos.classList.add("form_msg_ok");
        let valor = inputApellidos.value.trim();
        return { valido: true, valor: valor };
    }

    function validarGenero() {
        limpiarMsg(msgGenero);

        // Verificar que una de las opcinoes está seleccionada
        for (radio of radiosGenero) {
            if (radio.checked) {
                msgGenero.innerText = "ok";
                msgGenero.classList.add("form_msg_ok");
                return { valido: true, valor: radio.value };
            }
        }

        // No hubo ningun radio seleccionado
        msgGenero.innerText = "Selecciona una opción";
        msgGenero.classList.add("form_msg_error");
        return { valido: false, valor: "" };
    }

    function validarRFC() {
        limpiarMsg(msgRfc);

        if (inputRfc.dataset.pristino === "true" || inputRfc.dataset.sucio === "false") {
            msgCurp.innerText = "Debes ingresar tu RFC";
            msgCurp.classList.add("form_msg_error");
            return { valido: false, valor: "" };
        }
        
        let valor = inputRfc.value.trim();
        if (valor.length < 13 || valor.length > 14) {
            msgRfc.innerText = "El RFC debe tener 13 o 14 caracteres";
            msgRfc.classList.add("form_msg_error");
            return { valido: false, valor: "" };
        }

        let reRFC = /^[a-z]{4}[0-9]{6}[a-z0-9]{3,4}$/i;
        if (reRFC.test(valor) === false) {
            msgRfc.innerText = "El RFC no es válido";
            msgRfc.classList.add("form_msg_error");
            return { valido: false, valor: "" };
        }

        msgRfc.innerText = "ok";
        msgRfc.classList.add("form_msg_ok");
        return { valido: true, valor: valor };
    }

    function validarCURP() {
        limpiarMsg(msgCurp);

        let valor = inputCurp.value.trim().toUpperCase();
        if (inputCurp.dataset.pristino === "true" || inputCurp.dataset.sucio === "false") {
            msgCurp.innerText = "Debes ingresar tu CURP";
            msgCurp.classList.add("form_msg_error");
            return { valido: false, valor: ""};
        }
        
        if (valor.length != 18) {
            msgCurp.innerText = "La CURP debe tener 18 caracteres";
            msgCurp.classList.add("form_msg_error");
            return { valido: false, valor: ""};
        }
        
        let reCurp = /^[A-Z]{1}[AEIOUX]{1}[A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d]{1}\d{1}$/;
        if (reCurp.test(valor) === false) {
            msgCurp.innerText = "Debes ingresar una CURP válida";
            msgCurp.classList.add("form_msg_error");
            return { valido: false, valor: ""};
        }

        msgCurp.innerText = "ok";
        msgCurp.classList.add("form_msg_ok");
        return { valido: true, valor: valor};
    }

    function validarIntereses() {
        limpiarMsg(msgIntereses);

        let contSeleccionados = 0;
        let listIntereses = []
        for(checkbox of checkboxIntereses) {
            if(checkbox.checked) {
                contSeleccionados++;
                listIntereses.push(checkbox.value);
            }
        }
        
        if(contSeleccionados === 0) {
            msgIntereses.innerText = `Debes seleccionar al menos 3 elementos`;
            msgIntereses.classList.add("form_msg_error");
            return { valido: false, valor: []};
        }

        if (contSeleccionados < 3) {
            let resta = 3 - contSeleccionados;
            msgIntereses.innerText = `Debes seleccionar ${resta} elementos más`;
            msgIntereses.classList.add("form_msg_error");
            return { valido: false, valor: []};
        }

        msgIntereses.innerText = "ok";
        msgIntereses.classList.add("form_msg_ok");
        return { valido: true, valor: listIntereses}; 
    }

    function validarCalle() {
        limpiarMsg(msgCalle);

        let valor = inputCalle.value.trim();
        if(valor === "") {
            msgCalle.innerText = "Debes indicar la calle";
            msgCalle.classList.add("form_msg_error");
            return { valido: false, valor: ""}; 
        }

        msgCalle.innerText = "ok";
        msgCalle.classList.add("form_msg_ok");
        return { valido: true, valor: valor }; 
    }

    function validarMunicipio() {
        limpiarMsg(msgMunicipio);

        let valor = selectMunicipio.value;
        if (valor === "vacio") {
            msgMunicipio.innerText = "Debes seleccionar un municipio";
            msgMunicipio.classList.add("form_msg_error");
            return { valido: false, valor: ""}; 
        }

        msgMunicipio.innerText = "ok";
        msgMunicipio.classList.add("form_msg_ok");
        return { valido: true, valor: valor }; 
    }

    function validarCodigoPostal() {
        limpiarMsg(msgCP);
        
        let valor = inputCP.value.trim();
        if (valor === "") {
            msgCP.innerText = "Debes llenar el código postal";
            msgCP.classList.add("form_msg_error");
            return { valido: false, valor: "" }; 
        }

        let reCp = /[0-9]{5}/;
        if (reCp.test(valor) === false) {
            msgCP.innerText = "El CP debe estar formado por 5 digitos";
            msgCP.classList.add("form_msg_error");
            return { valido: false, valor: "" }; 
        }

        msgCP.innerText = "ok";
        msgCP.classList.add("form_msg_ok");
        return { valido: true, valor: valor }; 
    }

    function validarCodigoPais() {
        limpiarMsg(msgCodigoPais);

        let valor = inputCodigoPais.value.trim();
        if (valor === "") {
            msgCodigoPais.innerText = "Debes ingresar el código de pais";
            msgCodigoPais.classList.add("form_msg_error");
            return { valido: false, valor: "" }; 
        }

        let reCodigoPais = /^\d+$/;
        if (reCodigoPais.test(valor) === false) {
            msgCodigoPais.innerText = "Debes ingresar solo digitos";
            msgCodigoPais.classList.add("form_msg_error");
            return { valido: false, valor: "" }; 
        }

        if (valor.length > 3) {
            msgCodigoPais.innerText = "No puedes agregar más de 3 digitos";
            msgCodigoPais.classList.add("form_msg_error");
            return { valido: false, valor: "" }; 
        }

        msgCodigoPais.innerText = "ok";
        msgCodigoPais.classList.add("form_msg_ok");
        return { valido: true, valor: valor }; 
    }

    function validarCelular() {
        limpiarMsg(msgCelular);

        let valor = inputCelular.value.trim();
        if (valor === "") {
            msgCelular.innerText = "Debes ingresar tu número celular";
            msgCelular.classList.add("form_msg_error");
            return { valido: false, valor: "" }; 
        }

        let listCelular = valor.match(/\d+/g);
        if (listCelular === null) {
            msgCelular.innerText = "Debes ingresar solo digitos";
            msgCelular.classList.add("form_msg_error");
            return { valido: false, valor: "" }; 

        }
        
        let celular = listCelular.join("");
        if(celular.length < 10) {
            msgCelular.innerText = "El celular no puede tener menos de 10 digitos";
            msgCelular.classList.add("form_msg_error");
            return { valido: false, valor: "" }; 
        }

        if(celular.length > 12) {
            msgCelular.innerText = "El celular no puede tener más de 12 digitos";
            msgCelular.classList.add("form_msg_error");
            return { valido: false, valor: "" }; 
        }

        msgCelular.innerText = `${celular}`;
        msgCelular.classList.add("form_msg_ok");
        return { valido: true, valor: celular }; 
    }

    function validarCorreo() {
        limpiarMsg(msgCorreo);

        let valor = inputCorreo.value.trim();
        if (valor === "") {
            msgCorreo.innerText = "Debes ingresar tu correo electrónico";
            msgCorreo.classList.add("form_msg_error");
            return { valido: false, valor: "" }; 
        }

        let reCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (reCorreo.test(valor) === false) {
            msgCorreo.innerText = "El correo electrónico no es válido";
            msgCorreo.classList.add("form_msg_error");
            return { valido: false, valor: "" }; 
        }

        msgCorreo.innerText = `ok`;
        msgCorreo.classList.add("form_msg_ok");
        return { valido: true, valor: valor }; 
    }

    function limpiarMsg(elem) {
        elem.innerText = "";
        elem.classList.remove("form_msg_error");
        elem.classList.remove("form_msg_ok");
    }
}