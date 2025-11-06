onReady.ready(() => {
    let btn_agregar_form = document.querySelector("button[data-accion='agregar']");
    btn_agregar_form.addEventListener('click', agregar_formulario);

    // Dentro del contenedor de formularios se agregan nuevos formularios
    let form_grid_container = document.querySelector("#form-grid-container");

    let cont_form = 1; // Cada formulario tiene asociado un numero

    function cambiar_estado_campo(event) {
        event.preventDefault();

        let element = event.target;
        let id = ""; // id del elemento
        element.dataset.pristino = false;

        if (["text", "tel", "email"].includes(element.type)) {
            element.dataset.sucio = (element.value !== "");
            id = element.id;
        }

        validar_campo(element);
    }

    function validar_campo(element) {
        if (element.name == "nombre") {
             console.log(validar_nombre(element));
        }
    }

    function validar_nombre(input_element) {
        let msg_nombre = document.querySelector(`span[data-target="${input_element.id}"]`)
        limpiar_msg(msg_nombre)

        if(input_element.dataset.pristino === "true" || input_element.dataset.sucio === "false") {
            msg_nombre.innerText = "Debes ingresar tus nombres";
            msg_nombre.classList.add("msg_error");
            return { valido: false, valor: "" };
        }

        msg_nombre.innerText = "ok";
        msg_nombre.classList.add("msg_ok");
        let valor = input_element.value.trim();
        return { valido: true, valor: valor };
    }

    function limpiar_msg(element) {
        element.innerText = "";
        element.classList.remove("msg_error");
        element.classList.remove("msg_ok");
    }

    function agregar_formulario(e) {
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
        input_nombre.addEventListener('change', cambiar_estado_campo);
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
        input_apellido.dataset.pristino = true;
        input_apellido.dataset.sucio = false;
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
        input_rfc.dataset.pristino = true;
        input_rfc.dataset.sucio = false;
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
        input_calle.dataset.pristino = true;
        input_calle.dataset.sucio = false;
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
        input_cp.dataset.pristino = true;
        input_cp.dataset.sucio = false;
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
        input_celular.dataset.pristino = true;
        input_celular.dataset.sucio = false;
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
        input_correo.dataset.pristino = true;
        input_correo.dataset.sucio = false;
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

