function calcularDistribucionBancas(votos, bancas) {
    const resultados = [];
    const divisores = Array(votos.length).fill(1);

    for (let i = 0; i < bancas; i++) {
        const cocientes = votos.map((voto, index) => voto / divisores[index]);
        const maxIndex = cocientes.indexOf(Math.max(...cocientes));
        resultados.push(maxIndex);
        divisores[maxIndex]++;
    }

    const distribucion = Array(votos.length).fill(0);
    resultados.forEach((index) => distribucion[index]++);

    return distribucion;
}

function redistribuirIndecisos(votos, indecisos) {
    const totalVotosDeclarados = votos.reduce((sum, voto) => sum + voto, 0);
    return votos.map(voto => voto + (voto / totalVotosDeclarados) * indecisos);
}

function actualizarGraficos() {
    const coloresPartidos = [
        '#000986', '#44CCF5', '#860000', '#CA7D31', '#4125A8',
        '#19A820', '#A6C4C5', '#5F0013', '#EEE9E3', '#EF7000', '#005F20'
    ];

    const partidos = Array.from({ length: 11 }, (_, i) => ({
        nombre: document.getElementById(`partido${i + 1}`).name,
        color: coloresPartidos[i]
    }));

    let votos = partidos.map((_, i) => parseFloat(document.getElementById(`partido${i + 1}`).value));
    const votosBlancos = parseFloat(document.getElementById('votosBlancos').value);
    const votosAnulados = parseFloat(document.getElementById('votosAnulados').value);
    const indecisos = parseFloat(document.getElementById('indecisos').value);

    const totalVotos = votos.reduce((sum, voto) => sum + voto, 0);
    const totalVotosValidos = totalVotos - votosBlancos - votosAnulados;
    
    const precision = 10;
    const totalVotosRedondeado = Math.round((votosBlancos + votosAnulados + totalVotos + indecisos) * Math.pow(10, precision)) / Math.pow(10, precision);

    if (totalVotosValidos > 0 && Math.abs(totalVotosRedondeado - 100) < 0.001) {
        votos = redistribuirIndecisos(votos, indecisos);

        const bancasDiputados = 99;
        const bancasSenadores = 30;

        const distribucionDiputados = calcularDistribucionBancas(votos, bancasDiputados);
        const distribucionSenadores = calcularDistribucionBancas(votos, bancasSenadores);

        const datosDiputados = partidos.map((partido, index) => ({
            name: partido.nombre,
            y: distribucionDiputados[index],
            color: partido.color,
            label: partido.nombre
        })).filter(partido => partido.y > 0);

        const datosSenadores = partidos.map((partido, index) => ({
            name: partido.nombre,
            y: distribucionSenadores[index],
            color: partido.color,
            label: partido.nombre
        })).filter(partido => partido.y > 0);

        Highcharts.chart('deputies-container', {
            chart: { type: 'item' },
            title: { text: `Distribución de bancas en la Cámara de Diputados (${bancasDiputados} bancas)` },
            legend: { labelFormat: '{name} <span style="opacity: 0.4">{y}</span>' },
            series: [{
                name: 'Representantes',
                keys: ['name', 'y', 'color', 'label'],
                data: datosDiputados,
                dataLabels: {
                    enabled: true,
                    format: '{point.label}',
                    style: { textOutline: '3px contrast' }
                },
                center: ['50%', '88%'],
                size: '170%',
                startAngle: -100,
                endAngle: 100
            }],
            responsive: {
                rules: [{
                    condition: { maxWidth: 600 },
                    chartOptions: {
                        series: [{ dataLabels: { distance: -30 } }]
                    }
                }]
            }
        });

        Highcharts.chart('senators-container', {
            chart: { type: 'item' },
            title: { text: `Distribución de bancas en la Cámara de Senadores (${bancasSenadores} bancas)` },
            legend: { labelFormat: '{name} <span style="opacity: 0.4">{y}</span>' },
            series: [{
                name: 'Representantes',
                keys: ['name', 'y', 'color', 'label'],
                data: datosSenadores,
                dataLabels: {
                    enabled: true,
                    format: '{point.label}',
                    style: { textOutline: '3px contrast' }
                },
                center: ['50%', '88%'],
                size: '170%',
                startAngle: -100,
                endAngle: 100
            }],
            responsive: {
                rules: [{
                    condition: { maxWidth: 600 },
                    chartOptions: {
                        series: [{ dataLabels: { distance: -30 } }]
                    }
                }]
            }
        });
    } else {
        alert('Por favor, ingrese porcentajes válidos y asegúrese de que el total sea 100%.');
    }
}



