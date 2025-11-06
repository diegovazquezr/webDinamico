onReady.ready(() => {
    let btn_agregar_form = document.querySelector("button[data-accion='agregar']");
    btn_agregar_form.addEventListener('click', agregarFormulario);

    // Dentro del contenedor de formularios se agregan nuevos formularios
    let form_grid_container = document.querySelector("#form-grid-container");

    let cont_form = 1; // Cada formulario tiene asociado un numero

    function cambiarEstadoCampo(event) {
        event.preventDefault();

        let element = event.target;
        element.dataset.pristino = false;

        if (["text", "tel", "email"].includes(element.type)) {
            element.dataset.sucio = (element.value !== "");
        }

        validarCampo(element);
    }

    // Llama la funcion de validación correspondiente
    function validarCampo(element) {
        if (element.name == "nombre") {
             console.log(validarNombre(element));
        } else if (element.name == "apellido") {
             console.log(validarApellido(element));
        } else if (element.name == "rfc") {
             console.log(validarRfc(element));
        } else if (element.name == "calle") {
             console.log(validarCalle(element));
        } else if (element.name == "cp") {
             console.log(validarCp(element));
        } else if (element.name == "celular") {
             console.log(validarCelular(element));
        } else if (element.name == "correo") {
             console.log(validarCorreo(element));
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

    function validarCalle(input_element) {
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
            msg_cp.innerText = "Debes ingresar tu código postal";
            msg_cp.classList.add("msg_error");
            return { valido: false, valor: "" };
        }

        // Valida la estructura del cp 
        let re_cp = /^[0-9]{5}$/;
        let valor = input_element.value.trim();
        if (re_cp.test(valor) === false) {
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

    function validarCorreo(input_element) {
        let msg_correo = document.querySelector(`span[data-target="${input_element.id}"]`)
        limpiarMsg(msg_correo);

        // Valida que el campo correo no este vacio
        if(input_element.dataset.pristino === "true" || input_element.dataset.sucio === "false") {
            msg_correo.innerText = "Debes ingresar tu correo electrónico";
            msg_correo.classList.add("msg_error");
            return { valido: false, valor: "" };
        }

        // Valida la estructura del corero
        let valor = input_element.value.trim();
        let re_correo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (re_correo.test(valor) === false) {
            msg_correo.innerText = "El correo electrónico no es válido";
            msg_correo.classList.add("msg_error");
            return { valido: false, valor: "" }; 
        }

        // El correo es válido
        msg_correo.innerText = `ok`;
        msg_correo.classList.add("msg_ok");
        return { valido: true, valor: valor }; 
    }

    // Limpia los mensajes y estilos de un mensaje
    function limpiarMsg(element) {
        element.innerText = "";
        element.classList.remove("msg_error");
        element.classList.remove("msg_ok");
    }

    function agregarFormulario(e) {
        // div form-card
        let div_form_card = document.createElement("div");
        div_form_card.classList.add("form-card");
        form_grid_container.appendChild(div_form_card);

        // form
        let form = document.createElement("form");
        form.setAttribute("id", `form${cont_form}`);
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

        // seccion direcion 
        let seccion_direccion= document.createElement("seccion");
        form.appendChild(seccion_direccion)

        // div calle 
        let div_calle = document.createElement("div");
        seccion_direccion.appendChild(div_calle);

        // label calle
        let label_calle = document.createElement("label");
        label_calle.innerText = "Calle";
        label_calle.setAttribute("for", `calle${cont_form}`);
        div_calle.appendChild(label_calle);

        // input calle
        let input_calle = document.createElement("input");
        input_calle.setAttribute("type", "text");
        input_calle.setAttribute("id", `calle${cont_form}`);
        input_calle.setAttribute("name", `calle`);
        input_calle.dataset.pristino = true;
        input_calle.dataset.sucio = false;
        input_calle.addEventListener('change', cambiarEstadoCampo);
        div_calle.appendChild(input_calle);

        // span calle
        let span_calle = document.createElement("span");
        span_calle.dataset.target = `calle${cont_form}`;
        div_calle.appendChild(span_calle);

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
        let div_correo = document.createElement("div");
        seccion_direccion.appendChild(div_correo);

        // label correo
        let label_correo = document.createElement("label");
        label_correo.innerText = "Correo electrónico";
        label_correo.setAttribute("for", `correo${cont_form}`);
        div_correo.appendChild(label_correo);

        // input correo
        let input_correo = document.createElement("input");
        input_correo.setAttribute("type", "email");
        input_correo.setAttribute("id", `correo${cont_form}`);
        input_correo.setAttribute("name", `correo`);
        input_correo.dataset.pristino = true;
        input_correo.dataset.sucio = false;
        input_correo.addEventListener('change', cambiarEstadoCampo);
        div_correo.appendChild(input_correo);

        // span correo
        let span_correo = document.createElement("span");
        span_correo.dataset.target = `correo${cont_form}`;
        div_correo.appendChild(span_correo);

        // seccion direcion 
        let seccion_botones = document.createElement("seccion");
        form.appendChild(seccion_botones)

        // btn reset
        let btn_reset = document.createElement("button");
        btn_reset.innerText = "Reset";
        btn_reset.setAttribute("type", "reset");
        btn_reset.dataset.accion = `reset${cont_form}`;
        seccion_botones.appendChild(btn_reset);

        cont_form++;
    }

})

