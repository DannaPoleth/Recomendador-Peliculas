const campoEdad = document.getElementById("edad");
const contenedorPelicula = document.getElementById("pelicula");
const botonesGenero = document.querySelectorAll(".generos button");

async function recomendar(genero) {
  const edad = Number(campoEdad.value);

  if (!Number.isInteger(edad) || edad < 2 || edad > 120) {
    contenedorPelicula.innerHTML = '<p class="etiqueta alerta">Ingresa una edad válida (de 2 a 120 años).</p>';
    campoEdad.focus();
    return;
  }

  try {
    const respuesta = await fetch("./peliculas.json");
    if (!respuesta.ok) throw new Error("No se pudo cargar el archivo JSON.");
    const peliculas = await respuesta.json();

    // Filtramos por género y por edad mínima recomendada.
    const opciones = peliculas.filter(p => p.genero === genero && edad >= p.minEdad);

    if (opciones.length === 0) {
      contenedorPelicula.innerHTML = `
        <p>No encontramos una película de <strong>${genero}</strong> adecuada para tu edad.</p>
        <p class="detalle">Prueba con otro género.</p>`;
      return;
    }

    // Elegimos una recomendación al azar de las opciones que cumplen la edad.
    const pelicula = opciones[Math.floor(Math.random() * opciones.length)];
    const advertencia = edad < pelicula.minEdad
      ? '<span class="etiqueta alerta">No recomendada para esta edad</span>'
      : `<span class="etiqueta">Recomendada para ${edad} años · Clasificación ${pelicula.clasificacion}</span>`;

    contenedorPelicula.innerHTML = `
      <h3>${pelicula.titulo}</h3>
      <p class="detalle">${pelicula.anio} · Dir. ${pelicula.director} · ${pelicula.descripcion}</p>
      ${advertencia}`;
  } catch (error) {
    contenedorPelicula.innerHTML = '<p class="etiqueta alerta">Error al cargar las películas. Ejecuta el proyecto con Live Server.</p>';
    console.error(error);
  }
}

botonesGenero.forEach(boton => {
  boton.addEventListener("click", () => recomendar(boton.dataset.genero));
});
