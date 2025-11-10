onReady.ready(() => {
    let btn_agregar_form = document.querySelector("button[data-accion='agregar']");
    btn_agregar_form.addEventListener('click', agregarFormulario);

    let btn_enviar_forms = document.querySelector("button[data-accion='enviar_todos']")
    btn_enviar_forms.addEventListener('click', enviarFormularios);

    let modal = document.querySelector("#modal");

    // Dentro del contenedor de formularios se agregan nuevos formularios
    let form_grid_container = document.querySelector("#form-grid-container");

    let cont_form = 1; // Cada formulario tiene asociado un numero

    function enviar(url, cuerpo) {
        return new Promise((resolve, reject) => {
            // EL códigfo dentro de la promesa se ejecutra de forma asincrona
            // y es quien decide si la promesa es resulta o reochazada.
            const promise_fetch = fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cuerpo)
            });

            promise_fetch.then((response) => { // La promesa fue resulta (fetch llamó internamente a resolve)
                if(!response.ok){
                    return response.json().then((data_errors) => {
                        let error = new Error("La llamada a fetch no se completo"); // fetch devueve un estado de error
                        error.data = data_errors;
                        throw error;
                    });
                }
                return response.json(); // Devuelve una promesa
            })
            .then((data) => {
                console.log("La promesa (fetch) fue resuelta"); // La promesa del fetch fue resulta correctamente
                resolve(data);
                
            })
            .catch((error) => { // La promesa fue rechaza (fetch llamó internamente a reject) o hubo una excepción
                console.error("La promesa (fetch) fue rechazada o se lanzo una excepción");
                reject(error);
            })
        });
    }

    function enviarFormularios(event) {
        event.preventDefault();

        let forms = document.querySelectorAll("form[data-habilitado='true']");
        if (forms.length == 0) {
            console.log("Debes agregar al menos un formulario");
            return
        }
        
        // Deshabilitar todos los formularios que no han sido enviados
        deshabilitarFormularios();

        let errores = false;
        let cuerpos_formularios = [] // Almacena la información de los formularios

        for (form of forms) {
            let cuerpo = {} // Información del formulario actual

            let inputs = form.querySelectorAll("input");
            for (input of inputs) {
                let respuesta = validarCampo(input);
                if (respuesta.valido === false) {
                    errores = true;
                }
                cuerpo[`${input.name}`] = respuesta.valor;
            }
            cuerpos_formularios.push(cuerpo);
        }

        // Validar si hubo errores en los formularios
        if (errores) {
            console.log("Resuelve todos los errores");
            // Habilitar formularios para su corrección
            habilitarFormularios();
            return
        }

        console.log(`ENVIANDO ${cuerpos_formularios.length} FORMULARIOS AL SERVIDOR`);
        console.log(cuerpos_formularios);
        
        modal.showModal();

        // Enviar la información de todos los formularios
        Promise.allSettled(
            cuerpos_formularios.map(cuerpo => enviar("//webd.gilberto.codes/api/json.php", cuerpo))
        )
        .then(respuestas => {
            console.log(respuestas);
            let cont_deshabilitados = 0; // Se utiliza para corregir el desfase de indices causado por deshabilitar los formularios enviados correctamente
            
            respuestas.forEach((respuesta, idx) => {
                console.log(respuesta);
                if (respuesta.status === "fulfilled") { // Envio completado
                    // ocultar formulario de la vista o deshabilitar 
                    deshabilitarFormularioEnviado(respuesta.value, idx - cont_deshabilitados);
                    cont_deshabilitados += 1; 
                }
                if (respuesta.status === "rejected") { // Envio rechazado
                    // Mostrar mensaje de errores
                    mostrarErroresServidor(respuesta.reason.data, idx - cont_deshabilitados);
                }
            });
        })
        .finally(() => {
            console.log("SE HAN RECIBIDO TODAS LAS RESPUESTAS");
            habilitarFormularios();
            modal.close();
        })
    }

    function deshabilitarFormularios() {
        // Deshabilitar botones de reset
        let resets = document.querySelectorAll("button[type='reset']");
        resets.forEach(reset => reset.disabled = true);

        let forms = document.querySelectorAll("form[data-habilitado='true']");
        forms.forEach(form => {
            // Deshabilitar campos
            let inputs = form.querySelectorAll("input");
            inputs.forEach(input => {
                input.disabled = true;
            })
        })
    }

    function habilitarFormularios() {
        // Habilitar botones de reset
        let resets = document.querySelectorAll("button[type='reset']");
        resets.forEach(reset => reset.disabled = false);

        let forms = document.querySelectorAll("form[data-habilitado='true']");
        forms.forEach(form => {
            // Deshabilitar campos
            let inputs = form.querySelectorAll("input");
            inputs.forEach(input => {
                input.disabled = false;
            })
        })
    }

    function deshabilitarFormularioEnviado(cuerpo, idx) {
        let forms = document.querySelectorAll("form[data-habilitado='true']");
        let form = forms[idx];
        form.dataset.habilitado = false;

        let reset = form.querySelector("button[type='reset']");
        reset.remove();

        let msg_enviado = form.querySelector("span[name='msg_enviado']");
        msg_enviado.textContent = `Formulario recibido correctamente`;

        let msg_id = form.querySelector("span[name='id']");
        msg_id.textContent = `ID: ${cuerpo.id}`;
    }

    // Muestra los errores del servidor del formulario
    function mostrarErroresServidor(cuerpo, idx) {
        // Recupera solo los formularios habilitados
        let forms = document.querySelectorAll("form[data-habilitado='true']");
        let form = forms[idx]

        if (cuerpo.nombre.length > 0) {
            let msg = form.querySelector(`input[name="nombre"]`).nextElementSibling;
            mostrarMsgError(msg, cuerpo.nombre[0]);
        }

        if (cuerpo.apellido.length > 0) {
            let msg = form.querySelector(`input[name="apellido"]`).nextElementSibling;
            mostrarMsgError(msg, cuerpo.apellido[0]);
        }

        if (cuerpo.rfc.length > 0) {
            let msg = form.querySelector(`input[name="rfc"]`).nextElementSibling;
            mostrarMsgError(msg, cuerpo.rfc[0]);
        }

        if (cuerpo.direccion.length > 0) {
            let msg = form.querySelector(`input[name="direccion"]`).nextElementSibling;
            mostrarMsgError(msg, cuerpo.direccion[0]);
        }

        if (cuerpo.cp.length > 0) {
            let msg = form.querySelector(`input[name="cp"]`).nextElementSibling;
            mostrarMsgError(msg, cuerpo.cp[0]);
        }

        if (cuerpo.email.length > 0) {
            let msg = form.querySelector(`input[name="email"]`).nextElementSibling;
            mostrarMsgError(msg, cuerpo.email[0]);
        }
    }

    function mostrarMsgError(element, msg) {
        limpiarMsg(element);
        element.innerText = msg;
        element.classList.add("msg_error");
    }


    function cambiarEstadoCampo(event) {
        event.preventDefault();

        let element = event.target;
        element.dataset.pristino = false;

        if (["text", "tel", "email"].includes(element.type)) {
            element.dataset.sucio = (element.value !== "");
        } else if(element.type === "radio") {
            // establecer los demas radios del grupo como no sucios
            for (radio of document.querySelectorAll(`input[type='radio'][data-padre='${element.dataset.padre}']`)) {
                radio.dataset.sucio = false;
            }
            // establecer el radio seleccionado como sucio
            element.dataset.sucio = true;
        } else if (element.type === "checkbox") {
            element.dataset.sucio = (element.dataset.sucio === "false");
        }

        validarCampo(element);
    }

    // Llama la funcion de validación correspondiente
    function validarCampo(element) {
        if (element.name == "nombre") {
             return validarNombre(element);
        } else if (element.name == "apellido") {
             return validarApellido(element);
        } else if(element.name == "sexo") {
            return validarSexo(element);
        } else if (element.name == "rfc") {
             return validarRfc(element);
        } else if (element.name == "curp") {
             return validarCurp(element);
        } else if(element.name == "intereses") {
            return validarIntereses(element);
        } else if (element.name == "direccion") {
             return validarDireccion(element);
        } else if (element.name == "cp") {
             return validarCp(element);
        } else if (element.name == "celular") {
             return validarCelular(element);
        } else if (element.name == "email") {
             return validarEmail(element);
        }
    }

    function validarNombre(input_element) {
        let msg_nombre = document.querySelector(`span[data-target="${input_element.id}"]`)
        limpiarMsg(msg_nombre);

        // Valida que el campo nombre no este vacio
        if(input_element.dataset.pristino === "true" || input_element.dataset.sucio === "false") {
            msg_nombre.innerText = "Debes ingresar tus nombres";
            msg_nombre.classList.add("msg_error");
            return { valido: false, valor: "" };
        }

        // El nombre es válido
        msg_nombre.innerText = "ok";
        msg_nombre.classList.add("msg_ok");
        let valor = input_element.value.trim();
        return { valido: true, valor: valor };
    }

    function validarApellido(input_element) {
        let msg_apellido = document.querySelector(`span[data-target="${input_element.id}"]`)
        limpiarMsg(msg_apellido);

        // Valida que el campo apellido no este vacio
        if(input_element.dataset.pristino === "true" || input_element.dataset.sucio === "false") {
            msg_apellido.innerText = "Debes ingresar tus apellidos";
            msg_apellido.classList.add("msg_error");
            return { valido: false, valor: "" };
        }

        // El apellido es válido
        msg_apellido.innerText = "ok";
        msg_apellido.classList.add("msg_ok");
        let valor = input_element.value.trim();
        return { valido: true, valor: valor };
    }

    function validarSexo(input_element) {
        let msg_sexo = document.querySelector(`span[data-target="${input_element.dataset.padre}"]`)
        limpiarMsg(msg_sexo);

        for (radio of document.querySelectorAll(`input[type="radio"][data-padre="${input_element.dataset.padre}"]`)) {
            if (radio.checked) {
                msg_sexo.innerText = "ok";
                msg_sexo.classList.add("msg_ok");
                return { valido: true, valor: radio.value };
            }
        }

        msg_sexo.innerText = "Selecciona una opción";
        msg_sexo.classList.add("msg_error");
        return { valido: false, valor: "" };
    }

    function validarRfc(input_element) {
        let msg_rfc = document.querySelector(`span[data-target="${input_element.id}"]`)
        limpiarMsg(msg_rfc);

        // Valida que el campo rfc no este vacio
        if(input_element.dataset.pristino === "true" || input_element.dataset.sucio === "false") {
            msg_rfc.innerText = "Debes ingresar tu RFC";
            msg_rfc.classList.add("msg_error");
            return { valido: false, valor: "" };
        }

        // Valida la longitud del rfc
        let valor = input_element.value.trim();
        if (valor.length < 13 || valor.length > 14) {
            msg_rfc.innerText = "El RFC debe tener 13 o 14 caracteres";
            msg_rfc.classList.add("msg_error");
            return { valido: false, valor: "" };
        }

        // Valida la estructura del rfc
        let re_rfc = /^[a-z]{4}[0-9]{6}[a-z0-9]{3,4}$/i;
        if (re_rfc.test(valor) === false) {
            msg_rfc.innerText = "El RFC no tiene una estructura válida";
            msg_rfc.classList.add("msg_error");
            return { valido: false, valor: "" };
        }

        // El rfc es válido
        msg_rfc.innerText = "ok";
        msg_rfc.classList.add("msg_ok");
        return { valido: true, valor: valor };
    }

    function validarCurp(input_element) {
        let msg_curp = document.querySelector(`span[data-target="${input_element.id}"]`)
        limpiarMsg(msg_curp);

        // Valida que el campo curp no este vacio
        if(input_element.dataset.pristino === "true" || input_element.dataset.sucio === "false") {
            msg_curp.innerText = "Debes ingresar tu CURP";
            msg_curp.classList.add("msg_error");
            return { valido: false, valor: "" };
        }

        // Valida la longitud de la curp
        let valor = input_element.value.trim().toUpperCase();
        if (valor.length != 18) {
            msg_curp.innerText = "La CURP debe tener 18 caracteres";
            msg_curp.classList.add("msg_error");
            return { valido: false, valor: ""};
        }
        
        // Valida que tenga una estructura correcta
        let reCurp = /^[A-Z]{1}[AEIOUX]{1}[A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d]{1}\d{1}$/;
        if (reCurp.test(valor) === false) {
            msg_curp.innerText = "Debes ingresar una CURP válida";
            msg_curp.classList.add("msg_error");
            return { valido: false, valor: ""};
        }

        // El curp es válido
        msg_curp.innerText = "ok";
        msg_curp.classList.add("msg_ok");
        return { valido: true, valor: valor };
    }

    function validarIntereses(input_element) {
        let msg_intereses = document.querySelector(`span[data-target="${input_element.dataset.padre}"]`)
        limpiarMsg(msg_intereses);

        let cont_seleccionados = 0;
        let array_intereses = [];

        for (checkbox of document.querySelectorAll(`input[type="checkbox"][data-padre="${input_element.dataset.padre}"]`)) {
            if (checkbox.checked) {
                cont_seleccionados++;
                array_intereses.push(checkbox.value);
            }
        }

        // Valida que haya algun elemento seleccionado
        if (cont_seleccionados === 0) {
            msg_intereses.innerText = "Debes seleccionar al menos 2 elemento";
            msg_intereses.classList.add("msg_error");
            return { valido: false, valor: [] };
        }

        // Valida que hay al menos 2 elementos seleccionados
        if (cont_seleccionados < 2) {
            msg_intereses.innerText = `Debes seleccionar ${2 - cont_seleccionados} elementos más`;
            msg_intereses.classList.add("msg_error");
            return { valido: false, valor: [] };
        }

        // Información valida
        msg_intereses.innerText = "ok";
        msg_intereses.classList.add("msg_ok");
        return { valido: true, valor: array_intereses };
    }

    function validarDireccion(input_element) {
        let msg_calle = document.querySelector(`span[data-target="${input_element.id}"]`)
        limpiarMsg(msg_calle);

        // Valida que el campo calle no este vacio
        if(input_element.dataset.pristino === "true" || input_element.dataset.sucio === "false") {
            msg_calle.innerText = "Debes ingresar tu calle";
            msg_calle.classList.add("msg_error");
            return { valido: false, valor: "" };
        }

        // La calle es válido
        msg_calle.innerText = "ok";
        msg_calle.classList.add("msg_ok");
        let valor = input_element.value.trim();
        return { valido: true, valor: valor };
    }

    function validarCp(input_element) {
        let msg_cp = document.querySelector(`span[data-target="${input_element.id}"]`)
        limpiarMsg(msg_cp);

        // Valida que el campo cp no este vacio
        if(input_element.dataset.pristino === "true" || input_element.dataset.sucio === "false") {
            input_element.dataset.corregido = false;
            msg_cp.innerText = "Debes ingresar tu código postal";
            msg_cp.classList.add("msg_error");
            return { valido: false, valor: "" };
        }

        // Valida la estructura del cp 
        let re_cp = /^[0-9]{5}$/;
        let valor = input_element.value.trim();
        if (re_cp.test(valor) === false) {
            input_element.dataset.corregido = false;
            msg_cp.innerText = "El CP debe estar formado por 5 digitos";
            msg_cp.classList.add("msg_error");
            return { valido: false, valor: "" }; 
        }

        // El CP es válido
        msg_cp.innerText = "ok";
        msg_cp.classList.add("msg_ok");
        return { valido: true, valor: valor };
    }

    function validarCelular(input_element) {
        let msg_celular = document.querySelector(`span[data-target="${input_element.id}"]`)
        limpiarMsg(msg_celular);

        // Valida que el campo celular no este vacio
        if(input_element.dataset.pristino === "true" || input_element.dataset.sucio === "false") {
            msg_celular.innerText = "Debes ingresar tu numero de celular";
            msg_celular.classList.add("msg_error");
            return { valido: false, valor: "" };
        }

        // Valida que el celular tenga digitos
        let valor = input_element.value.trim();
        let digitos = valor.match(/\d+/g); // lista de digitos
        if (digitos === null) {
            msg_celular.innerText = "Debes ingresar solo digitos";
            msg_celular.classList.add("msg_error");
            return { valido: false, valor: "" }; 
        }

        // Valida la longitud del celular
        let celular = digitos.join("");
        if(celular.length != 10) {
            msg_celular.innerText = "El celular debe tener 10 digitos";
            msg_celular.classList.add("msg_error");
            return { valido: false, valor: "" }; 
        }

        // El celular es válido
        msg_celular.innerText = `${celular}`;
        msg_celular.classList.add("msg_ok");
        return { valido: true, valor: celular }; 
    }

    function validarEmail(input_element) {
        let msg_email = document.querySelector(`span[data-target="${input_element.id}"]`)
        limpiarMsg(msg_email);

        // Valida que el campo correo no este vacio
        if(input_element.dataset.pristino === "true" || input_element.dataset.sucio === "false") {
            msg_email.innerText = "Debes ingresar tu correo electrónico";
            msg_email.classList.add("msg_error");
            return { valido: false, valor: "" };
        }

        // Valida la estructura del corero
        let valor = input_element.value.trim();
        let re_correo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (re_correo.test(valor) === false) {
            msg_email.innerText = "El correo electrónico no es válido";
            msg_email.classList.add("msg_error");
            return { valido: false, valor: "" }; 
        }

        // El correo es válido
        msg_email.innerText = `ok`;
        msg_email.classList.add("msg_ok");
        return { valido: true, valor: valor }; 
    }

    // Limpia los mensajes y estilos de un mensaje
    function limpiarMsg(element) {
        element.innerText = "";
        element.classList.remove("msg_error");
        element.classList.remove("msg_ok");
    }

    function resetFormulario(e) {
        // Recupera el formulario padre
        let form = document.querySelector(`#${e.target.dataset.target}`)

        // Selecciona todos los elementos de mensajes
        let msgs = form.querySelectorAll("span[data-target]");
        // Limpiar todos los mensajes
        for (msg of msgs) {
            limpiarMsg(msg);
        }

        // Selecciona todos los campos
        let inputs = form.querySelectorAll("input");
        // Establecer pristino en true y sucio en false
        for (input of inputs) {
            input.dataset.pristino = true;
            input.dataset.sucio = false;
        }
    }

    function agregarFormulario(e) {
        // div form-card
        let div_form_card = document.createElement("div");
        div_form_card.classList.add("form-card");
        form_grid_container.appendChild(div_form_card);

        // form
        let form = document.createElement("form");
        form.setAttribute("id", `form${cont_form}`);
        form.dataset.habilitado = true;
        div_form_card.appendChild(form);

        // seccion información personal
        let seccion_personal = document.createElement("seccion");
        form.appendChild(seccion_personal)

        // div nombre
        let div_nombre = document.createElement("div");
        seccion_personal.appendChild(div_nombre);

        // label nombre
        let label_nombre = document.createElement("label");
        label_nombre.innerText = "Nombre";
        label_nombre.setAttribute("for", `nombre${cont_form}`);
        div_nombre.appendChild(label_nombre);

        // input nombre
        let input_nombre = document.createElement("input");
        input_nombre.setAttribute("type", "text");
        input_nombre.setAttribute("id", `nombre${cont_form}`);
        input_nombre.setAttribute("name", `nombre`);
        input_nombre.dataset.pristino = true;
        input_nombre.dataset.sucio = false;
        input_nombre.addEventListener('change', cambiarEstadoCampo);
        div_nombre.appendChild(input_nombre);

        // span nombre
        let span_nombre = document.createElement("span");
        span_nombre.dataset.target = `nombre${cont_form}`;
        div_nombre.appendChild(span_nombre);

        // div apellido 
        let div_apellido = document.createElement("div");
        seccion_personal.appendChild(div_apellido);

        // label apellido
        let label_apellido = document.createElement("label");
        label_apellido.innerText = "Apellido";
        label_apellido.setAttribute("for", `apellido${cont_form}`);
        div_apellido.appendChild(label_apellido);

        // input apellido
        let input_apellido = document.createElement("input");
        input_apellido.setAttribute("type", "text");
        input_apellido.setAttribute("id", `apellido${cont_form}`);
        input_apellido.setAttribute("name", `apellido`);
        input_apellido.dataset.pristino = true;
        input_apellido.dataset.sucio = false;
        input_apellido.addEventListener('change', cambiarEstadoCampo);
        div_apellido.appendChild(input_apellido);

        // span apellido
        let span_apellido = document.createElement("span");
        span_apellido.dataset.target = `apellido${cont_form}`;
        div_apellido.appendChild(span_apellido);

        // div sexo
        let div_sexo = document.createElement("div");
        seccion_personal.appendChild(div_sexo);

        // fieldset sexo
        let fieldset_sexo = document.createElement("fieldset");
        fieldset_sexo.setAttribute("id", `fs_sexo${cont_form}`);
        div_sexo.appendChild(fieldset_sexo);

        // legend sexo
        let legend_sexo = document.createElement("legend");
        legend_sexo.innerText = "Sexo";
        fieldset_sexo.appendChild(legend_sexo);

        // input sexo > masculino
        let input_sexo_masculino = document.createElement("input");
        input_sexo_masculino.setAttribute("type", "radio");
        input_sexo_masculino.setAttribute("name", "sexo");
        input_sexo_masculino.setAttribute("id", `sexo_masculino${cont_form}`);
        input_sexo_masculino.setAttribute("value", "masculino");
        input_sexo_masculino.dataset.pristino = true;
        input_sexo_masculino.dataset.sucio = false;
        input_sexo_masculino.dataset.padre = `fs_sexo${cont_form}`;
        input_sexo_masculino.addEventListener('change', cambiarEstadoCampo);
        fieldset_sexo.appendChild(input_sexo_masculino);

        // label sexo > masculino
        let label_sexo_masculino = document.createElement("label");
        label_sexo_masculino.innerText = "Masculino";
        label_sexo_masculino.setAttribute("for", `sexo_masculino${cont_form}`);
        fieldset_sexo.appendChild(label_sexo_masculino);

        // input sexo > femenino
        let input_sexo_femenino = document.createElement("input");
        input_sexo_femenino.setAttribute("type", "radio");
        input_sexo_femenino.setAttribute("name", "sexo");
        input_sexo_femenino.setAttribute("id", `sexo_femenino${cont_form}`);
        input_sexo_femenino.setAttribute("value", "femenino");
        input_sexo_femenino.dataset.pristino = true;
        input_sexo_femenino.dataset.sucio = false;
        input_sexo_femenino.dataset.padre = `fs_sexo${cont_form}`;
        input_sexo_femenino.addEventListener('change', cambiarEstadoCampo);
        fieldset_sexo.appendChild(input_sexo_femenino);

        // label sexo > femenino
        let label_sexo_femenino = document.createElement("label");
        label_sexo_femenino.innerText = "Femenino";
        label_sexo_femenino.setAttribute("for", `sexo_femenino${cont_form}`);
        fieldset_sexo.appendChild(label_sexo_femenino);

        // span sexo
        let span_sexo = document.createElement("span");
        span_sexo.dataset.target = `fs_sexo${cont_form}`;
        fieldset_sexo.appendChild(span_sexo);

        // div RFC 
        let div_rfc = document.createElement("div");
        seccion_personal.appendChild(div_rfc);

        // label apellido
        let label_rfc = document.createElement("label");
        label_rfc.innerText = "RFC";
        label_rfc.setAttribute("for", `rfc${cont_form}`);
        div_rfc.appendChild(label_rfc);

        // input rfc
        let input_rfc = document.createElement("input");
        input_rfc.setAttribute("type", "text");
        input_rfc.setAttribute("id", `rfc${cont_form}`);
        input_rfc.setAttribute("name", `rfc`);
        input_rfc.dataset.pristino = true;
        input_rfc.dataset.sucio = false;
        input_rfc.addEventListener('change', cambiarEstadoCampo);
        div_rfc.appendChild(input_rfc);

        // span rfc
        let span_rfc = document.createElement("span");
        span_rfc.dataset.target = `rfc${cont_form}`;
        div_rfc.appendChild(span_rfc);

        // div curp
        let div_curp = document.createElement("div");
        seccion_personal.appendChild(div_curp);

        // label curp
        let label_curp = document.createElement("label");
        label_curp.innerText = "CURP";
        label_curp.setAttribute("for", `curp${cont_form}`);
        div_curp.appendChild(label_curp);

        // input curp
        let input_curp = document.createElement("input");
        input_curp.setAttribute("type", "text");
        input_curp.setAttribute("id", `curp${cont_form}`);
        input_curp.setAttribute("name", `curp`);
        input_curp.dataset.pristino = true;
        input_curp.dataset.sucio = false;
        input_curp.addEventListener('change', cambiarEstadoCampo);
        div_curp.appendChild(input_curp);

        // span curp
        let span_curp = document.createElement("span");
        span_curp.dataset.target = `curp${cont_form}`;
        div_curp.appendChild(span_curp);

        // div intereses
        let div_intereses = document.createElement("div");
        seccion_personal.appendChild(div_intereses);

        // fielset intereses
        let fieldset_intereses = document.createElement("fieldset");
        fieldset_intereses.setAttribute("id", `fs_intereses${cont_form}`);
        div_intereses.appendChild(fieldset_intereses);

        // legend sexo
        let legend_intereses = document.createElement("legend");
        legend_intereses.innerText = "Intereses";
        fieldset_intereses.appendChild(legend_intereses);

        // input intereses > Python
        let input_intereses_python = document.createElement("input");
        input_intereses_python.setAttribute("type", "checkbox");
        input_intereses_python.setAttribute("name", "intereses");
        input_intereses_python.setAttribute("id", `intereses_python${cont_form}`);
        input_intereses_python.setAttribute("value", "python");
        input_intereses_python.dataset.pristino = true;
        input_intereses_python.dataset.sucio = false;
        input_intereses_python.dataset.padre = `fs_intereses${cont_form}`;
        input_intereses_python.addEventListener('change', cambiarEstadoCampo);
        fieldset_intereses.appendChild(input_intereses_python);

        // label intereses > python
        let label_intereses_python = document.createElement("label");
        label_intereses_python.innerText = "Python";
        label_intereses_python.setAttribute("for", `intereses_python${cont_form}`);
        fieldset_intereses.appendChild(label_intereses_python);

        // input intereses > JavaScript 
        let input_intereses_js = document.createElement("input");
        input_intereses_js.setAttribute("type", "checkbox");
        input_intereses_js.setAttribute("name", "intereses");
        input_intereses_js.setAttribute("id", `intereses_js${cont_form}`);
        input_intereses_js.setAttribute("value", "javascript");
        input_intereses_js.dataset.pristino = true;
        input_intereses_js.dataset.sucio = false;
        input_intereses_js.dataset.padre = `fs_intereses${cont_form}`;
        input_intereses_js.addEventListener('change', cambiarEstadoCampo);
        fieldset_intereses.appendChild(input_intereses_js);

        // label intereses > js
        let label_intereses_js = document.createElement("label");
        label_intereses_js.innerText = "JavaScript";
        label_intereses_js.setAttribute("for", `intereses_js${cont_form}`);
        fieldset_intereses.appendChild(label_intereses_js);

        // input intereses > C
        let input_intereses_c = document.createElement("input");
        input_intereses_c.setAttribute("type", "checkbox");
        input_intereses_c.setAttribute("name", "intereses");
        input_intereses_c.setAttribute("id", `intereses_c${cont_form}`);
        input_intereses_c.setAttribute("value", "c_c++");
        input_intereses_c.dataset.pristino = true;
        input_intereses_c.dataset.sucio = false;
        input_intereses_c.dataset.padre = `fs_intereses${cont_form}`;
        input_intereses_c.addEventListener('change', cambiarEstadoCampo);
        fieldset_intereses.appendChild(input_intereses_c);

        // label intereses > C
        let label_intereses_c = document.createElement("label");
        label_intereses_c.innerText = "C/C++";
        label_intereses_c.setAttribute("for", `intereses_c${cont_form}`);
        fieldset_intereses.appendChild(label_intereses_c);

        // input intereses > Java
        let input_intereses_java = document.createElement("input");
        input_intereses_java.setAttribute("type", "checkbox");
        input_intereses_java.setAttribute("name", "intereses");
        input_intereses_java.setAttribute("id", `intereses_java${cont_form}`);
        input_intereses_java.setAttribute("value", "java");
        input_intereses_java.dataset.pristino = true;
        input_intereses_java.dataset.sucio = false;
        input_intereses_java.dataset.padre = `fs_intereses${cont_form}`;
        input_intereses_java.addEventListener('change', cambiarEstadoCampo);
        fieldset_intereses.appendChild(input_intereses_java);

        // label intereses > Java
        let label_intereses_java = document.createElement("label");
        label_intereses_java.innerText = "Java";
        label_intereses_java.setAttribute("for", `intereses_java${cont_form}`);
        fieldset_intereses.appendChild(label_intereses_java);

        // span intereses
        let span_intereses = document.createElement("span");
        span_intereses.dataset.target = `fs_intereses${cont_form}`;
        fieldset_intereses.appendChild(span_intereses);


        // seccion direcion 
        let seccion_direccion= document.createElement("seccion");
        form.appendChild(seccion_direccion)

        // div direccion
        let div_direccion = document.createElement("div");
        seccion_direccion.appendChild(div_direccion);

        // label direccion
        let label_direccion = document.createElement("label");
        label_direccion.innerText = "Direccion";
        label_direccion.setAttribute("for", `direccion${cont_form}`);
        div_direccion.appendChild(label_direccion);

        // input direccion
        let input_direccion = document.createElement("input");
        input_direccion.setAttribute("type", "text");
        input_direccion.setAttribute("id", `direccion${cont_form}`);
        input_direccion.setAttribute("name", `direccion`);
        input_direccion.dataset.pristino = true;
        input_direccion.dataset.sucio = false;
        input_direccion.addEventListener('change', cambiarEstadoCampo);
        div_direccion.appendChild(input_direccion);

        // span direccion
        let span_direccion = document.createElement("span");
        span_direccion.dataset.target = `direccion${cont_form}`;
        div_direccion.appendChild(span_direccion);

        // div cp 
        let div_cp = document.createElement("div");
        seccion_direccion.appendChild(div_cp);

        // label cp
        let label_cp = document.createElement("label");
        label_cp.innerText = "Código Postal";
        label_cp.setAttribute("for", `cp${cont_form}`);
        div_cp.appendChild(label_cp);

        // input cp
        let input_cp = document.createElement("input");
        input_cp.setAttribute("type", "text");
        input_cp.setAttribute("id", `cp${cont_form}`);
        input_cp.setAttribute("name", `cp`);
        input_cp.dataset.pristino = true;
        input_cp.dataset.sucio = false;
        input_cp.addEventListener('change', cambiarEstadoCampo);
        div_cp.appendChild(input_cp);

        // span cp
        let span_cp = document.createElement("span");
        span_cp.dataset.target = `cp${cont_form}`;
        div_cp.appendChild(span_cp);

        // div celular 
        let div_celular = document.createElement("div");
        seccion_direccion.appendChild(div_celular);

        // label celular
        let label_celular = document.createElement("label");
        label_celular.innerText = "No. de Celular";
        label_celular.setAttribute("for", `celular${cont_form}`);
        div_celular.appendChild(label_celular);

        // input celular
        let input_celular = document.createElement("input");
        input_celular.setAttribute("type", "tel");
        input_celular.setAttribute("id", `celular${cont_form}`);
        input_celular.setAttribute("name", `celular`);
        input_celular.dataset.pristino = true;
        input_celular.dataset.sucio = false;
        input_celular.addEventListener('change', cambiarEstadoCampo);
        div_celular.appendChild(input_celular);

        // span celular
        let span_celular = document.createElement("span");
        span_celular.dataset.target = `celular${cont_form}`;
        div_celular.appendChild(span_celular);

        // div correo 
        let div_email = document.createElement("div");
        seccion_direccion.appendChild(div_email);

        // label correo
        let label_email = document.createElement("label");
        label_email.innerText = "Correo electrónico";
        label_email.setAttribute("for", `email${cont_form}`);
        div_email.appendChild(label_email);

        // input correo
        let input_email = document.createElement("input");
        input_email.setAttribute("type", "email");
        input_email.setAttribute("id", `email${cont_form}`);
        input_email.setAttribute("name", `email`);
        input_email.dataset.pristino = true;
        input_email.dataset.sucio = false;
        input_email.addEventListener('change', cambiarEstadoCampo);
        div_email.appendChild(input_email);

        // span correo
        let span_email = document.createElement("span");
        span_email.dataset.target = `email${cont_form}`;
        div_email.appendChild(span_email);

        // seccion botones
        let seccion_botones = document.createElement("seccion");
        form.appendChild(seccion_botones)

        // btn reset
        let btn_reset = document.createElement("button");
        btn_reset.innerText = "Reset";
        btn_reset.setAttribute("type", "reset");
        btn_reset.dataset.accion = `reset${cont_form}`;
        btn_reset.dataset.target = `form${cont_form}`;
        btn_reset.addEventListener('click', resetFormulario);
        seccion_botones.appendChild(btn_reset);

        let span_enviado = document.createElement("span");
        span_enviado.setAttribute("name", `msg_enviado`);
        seccion_botones.appendChild(span_enviado);

        let span_id = document.createElement("span");
        span_id.setAttribute("name", `id`);
        seccion_botones.appendChild(span_id);

        cont_form++;
    }
})

