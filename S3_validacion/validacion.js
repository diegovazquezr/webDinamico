let rfc = document.querySelector("#rfc");
rfc.dataset.pristino = true;
rfc.dataset.sucio = false;

let validar = document.querySelector("button[data-accion='validar']");

let reRFC = /^[a-z]{4}[0-9]{6}[a-z0-9]{3,4}$/i;

validar.addEventListener("click", validarRFC);
rfc.addEventListener("change", ajustarRFC);

function ajustarRFC(e) {
	e.target.dataset.pristino = false;
	let valor = e.target.value.trim();
	if (valor != "") {
		rfc.dataset.sucio = true;
	} else {
		rfc.dataset.sucio = false;
	}
}

function validarRFC(e) {
	let valor = rfc.value.trim();
	console.log(valor);
	if (valor != "") {
		if (reRFC.test(valor)) {
			console.log("Es un RFC válido");
		} else {
			console.log("Deberías reportar que no es un RFC válido");
		}
	} else {
		console.log("Deberías reportar que no ingresaron un RFC");
	}
	e.preventDefault();
}


