const readline = require('readline');
const open = require('open').default;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function mostrarMenu() {
  console.clear();
  console.log('==============================');
  console.log('        MENÚ PRINCIPAL         ');
  console.log('==============================');
  console.log('1. Abrir Swagger (API Docs)');
  console.log('0. Salir');
  console.log('------------------------------');
  rl.question('Seleccione una opción: ', async (opcion) => {
    switch (opcion.trim()) {
      case '1':
        console.log('Abriendo Swagger en el navegador...');
        await open('http://localhost:3000/api-docs');
        rl.close();
        break;
      case '0':
        console.log('Saliendo...');
        rl.close();
        break;
      default:
        console.log('Opción no válida. Intente de nuevo.');
        setTimeout(mostrarMenu, 1500);
        break;
    }
  });
}

mostrarMenu();
