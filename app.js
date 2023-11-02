const url = 'http://172.16.1.27/dashboard/mensajes.php';

document.getElementById('filtrar').addEventListener('click', () => {
    const mes = document.getElementById('mes').value;
    const anio = document.getElementById('anio').value;
    const data = new FormData();
    data.append('fecha', `${anio}-${mes}`);

    fetch(url, {
        method: 'POST',
        body: data,
    })
        .then(response => response.json())
        .then(jsonResponse => {
            console.log(jsonResponse);

            // Obtener el elemento div donde se mostrarán los gráficos
            const graficoContainer = document.getElementById('grafico-container');
            graficoContainer.style.display = 'grid';
            graficoContainer.style.gridTemplateColumns = "1fr 1fr 1fr";
            graficoContainer.style.placeItems = "center";
            // Limpiar los gráficos existentes
            graficoContainer.innerHTML = '';

            // Recopilar todos los IDs únicos de la respuesta JSON
            const uniqueIds = Array.from(new Set(jsonResponse.map(item => item.campaign_id)));

            uniqueIds.forEach(campaign_id => {
                const dataForId = jsonResponse.filter(item => item.campaign_id === campaign_id);

                // Crear un contenedor para cada gráfico y datos
                const conjuntoGraficoDatos = document.createElement('div');
                conjuntoGraficoDatos.classList.add('conjunto-grafico-datos');
                conjuntoGraficoDatos.style.height = '500px';
                conjuntoGraficoDatos.style.position = 'relative'; // Establecer posición relativa

                // Crear una etiqueta <label> con estilos en línea
                const label = document.createElement('label');
                label.textContent = campaign_id;
                label.style.position = 'absolute';
                label.style.top = '0';
                label.style.left = '0';
                label.style.backgroundColor = '#ccc';
                label.style.width = '40px';
                label.style.height = '40px';
                label.style.borderRadius = '50%';
                label.style.display = 'flex';
                label.style.justifyContent = 'center';
                label.style.alignItems = 'center';

                // Adjuntar la etiqueta al contenedor principal
                conjuntoGraficoDatos.appendChild(label);

                graficoContainer.appendChild(conjuntoGraficoDatos);

                // Organizar los datos para el gráfico
                const data = dataForId.reduce((acc, item) => {
                    if (!acc[item.status]) {
                        acc[item.status] = 0;
                    }
                    acc[item.status] += parseInt(item.cantidad, 10);
                    return acc;
                }, {});

                // Crear un elemento canvas para el gráfico
                const canvas = document.createElement('canvas');
                canvas.classList.add('grafico');
                canvas.width = 300; // Establece el ancho deseado en píxeles
                canvas.height = 300; 

                conjuntoGraficoDatos.appendChild(canvas);
                const ctx = canvas.getContext('2d');

                // Crear un contenedor para mostrar los datos de cantidad
                const datosCantidadContainer = document.createElement('div');
                datosCantidadContainer.classList.add('datos-cantidad');
                conjuntoGraficoDatos.appendChild(datosCantidadContainer);

                // Calcular los totales de enviados, no enviados y el total
                const totalEnviados = dataForId.reduce((acc, item) => (item.status === 'Enviado' ? acc + parseInt(item.cantidad, 10) : acc), 0);
                const totalNoEnviados = dataForId.reduce((acc, item) => (item.status === 'No Enviado' ? acc + parseInt(item.cantidad, 10) : acc), 0);
                const total = totalEnviados + totalNoEnviados; // Suma de datos enviados y no enviados
                
                // Agregar los datos de cantidad al contenedor
                datosCantidadContainer.innerHTML = `
        <p>Enviados: ${totalEnviados}</p>
        <p>No Enviados: ${totalNoEnviados}</p>
        <p>Total: ${total}</p>
        `;

                // Crear un contenedor para mostrar detalles
                const detallesContainer = document.createElement('div');
                detallesContainer.classList.add('detalles');
                conjuntoGraficoDatos.appendChild(detallesContainer);

                const detallesParaCampaña = dataForId.map(item => {
                    return `
                    
                        <h3>Nombre: ${item.name}</h3>
                       <p>Cantidad: ${item.cantidad}</p>
                        <span class="btn-1">Ver Mensaje</span>
                        <p class="mensaje">${item.mensaje}</p>
                    `;
                });
                                
                // Agregar detalles al contenedor de detalles
                detallesContainer.innerHTML = detallesParaCampaña.join('');
                
                // Manejador de eventos para los botones "alerta" dentro de este conjunto de datos
                const btns = conjuntoGraficoDatos.querySelectorAll('.btn-1');
                                
                btns.forEach(btn => {
                    btn.addEventListener("click", () => {
                        const mensaje = btn.parentElement.querySelector('.mensaje');
                        mensaje.classList.toggle("active");
                    });
                });

                // Crear un arreglo de etiquetas
                const labels = Object.keys(data);

                // Crear un arreglo de colores para los datos (azul para "Enviados" y rojo para "No Enviados")
                const backgroundColors = labels.map(label => (label === "Enviado" ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)'));

                // Configurar el gráfico como un gráfico de pastel (pie)
                const chartData = {
                    labels: labels,
                    datasets: [
                        {
                            data: labels.map(label => data[label]),
                            backgroundColor: backgroundColors,
                            borderColor: backgroundColors, // Usar el mismo color de borde
                            borderWidth: 1,
                        },
                    ],
                };

                // Crear el gráfico con Chart.js y tipo "pie"
                new Chart(ctx, {
                    type: 'pie',
                    data: chartData,
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});


let btn = document.querySelector(".btn-1")

btn.addEventListener("click", () => {
    alert();
});
