window.addEventListener('load', function(){

    // referenciar controles de pantalla
    const msgSuccess = this.document.getElementById('msgSuccess');

    // recuperar nombre de usuario
    const result = JSON.parse(this.localStorage.getItem('result'));

    // mostrar nombre de usuario en alerta
    mostrarAlerta(`Bienvenido ${result.nombreUsuario}`);


    const user = JSON.parse(this.localStorage.getItem('user'));

    // Proceso de LOGOUT

    const btnLogout = this.document.getElementById('btnLogout');
    btnLogout.addEventListener('click', function(){

        if(user.tipoDocumento.trim() === '' || user.numeroDocumento.trim() === '') {
            mostrarAlerta('Error: Los datos del usuario logeado son invalidos');
            return;
        }

        logout(user.tipoDocumento, user.numeroDocumento)
    })


});

function mostrarAlerta(mensaje) {
    msgSuccess.innerHTML = mensaje;
    msgSuccess.style.display = 'block';
}

async function logout (tipoDocumento, numeroDocumento) {

    const url = 'http://localhost:8083/login/logout';
    const request = {
        tipoDocumento: tipoDocumento,
        numeroDocumento: numeroDocumento,
    };

    try {
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });

        if(!response.ok) {
            mostrarAlerta('Error: Ocurrió un problema con la autenticación');
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Respuesta del servidor: ', result);

        if(result.resultado) {
            localStorage.clear();
            localStorage.setItem('result', JSON.stringify(result));
            window.location.replace('http://localhost:5173/');
            
        } else {
            mostrarAlerta(result.mensajeError);
        }

    } catch (error) {
        
        console.log('Error: Ocurrió un problema con el logout', error);
        mostrarAlerta('Error: Ocurrió un problema con la logout');

    }

}