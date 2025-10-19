onReady.ready(() => {
    initFormularioRFC();
})

function initFormularioRFC() {
    let inputRFC = document.querySelector("#rfc");
    inputRFC.dataset.pristino = true;
    
    let btnValidar = document.querySelector("button[data-accion='validar']");
    let spanRFC = document.querySelector("span[data-campo='rfc']");

    let reRFC = /^[a-z]{4}[0-9]{6}[a-z0-9]{3,4}$/i;

    btnValidar.addEventListener("click", validarFormulario);
    inputRFC.addEventListener("change", ajustarRFC);

    function registrar(rfcParam) {
        let estado = ""
        let msg = ""
        if (rfcParam.toLowerCase() === "abcd000102xy9") {
            estado = "exito";
            msg = "El formulario ha sido recibido y la información es correcta";
        } else {
            estado = "error";
            msg = "El RFC no está registrado en el sistema";
        }

        return {
            estado: estado,
            msg: msg
        }
    }

    function validarFormulario(e) {
        let rfcValido = validarRFC();
        if (!rfcValido) {
            e.preventDefault();
            return
        }
        
        let respuesta = registrar(inputRFC.value.trim());
        if(respuesta.estado === "error") {
            spanRFC.innerText = respuesta.msg;
            spanRFC.style.color = "red";
        } else {
            console.log(respuesta)
        }
        e.preventDefault();
    }

    function validarRFC() {
        // Eliminar mensaje de error
        let valor = inputRFC.value.trim();

        if (valor === "") {
            spanRFC.innerText = "Debes completar este campo";
            spanRFC.style.color = "red";
            return false
        }

        if (reRFC.test(valor) === false) {
            spanRFC.innerText = "El RFC no es válido";
            spanRFC.style.color = "red";
            return false
        }
        
        spanRFC.innerText = "";
        spanRFC.style.color = "";
        return true 
    }

    function ajustarRFC(e) {
        inputRFC.dataset.pristino = false;
        validarRFC();
    }
}
