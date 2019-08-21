/* Variables Globales*/
const mymap = L.map("map").setView([-34.595986, -58.3724715], 13); //creo mapa con posición inicial
const markerGroup = L.layerGroup().addTo(mymap); //creo el grupo de marcadores
const coordsGroup = L.layerGroup().addTo(mymap);
let markerToDelete;

/* Funciones */

function run() {
  //cuando carga el documento ejecuta automáticamente la función
  L.tileLayer(
    "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiamFydTQyMyIsImEiOiJjanprYnZ5YjYwOXM3M29rYW9qcmNhbjV4In0.Chv8x8arXQVgzN4V6GYxPg",
    {
      maxZoom: 18,
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: "mapbox.streets"
    }
  ).addTo(mymap);
}

function handleSubmit(e) {
  coordsGroup.clearLayers();
  //cuando se clickea el boton Agregar Punto se validan los datos, si esta todo ok, se ejecuta la función handleAddMaker() a la que se le envia los datos
  e.preventDefault(); //evitar submit
  const desc = document.forms["form_send"]["desc"];
  const address = document.forms["form_send"]["address"];
  const tel = document.forms["form_send"]["tel"];
  const coord = document.forms["form_send"]["coord"];
  const cat = document.forms["form_send"]["cat"];
  const coordArr = coord.value.split(/[,]/);

  if (desc.value == "") {
    window.alert("Ingrese el nombre del punto de interés");
    desc.focus();
    return false;
  }

  if (address.value == "") {
    window.alert("Ingrese la dirección");
    address.focus();
    return false;
  }

  if (!tel.value.match(/^[\d ]*$/)) {
    window.alert("Ingrese un número de teléfono correcto");
    tel.focus();
    return false;
  }

  if (
    // las coordenadas tienen una validación adicional en el input
    coord.value == "" ||
    (coordArr[0] > 180 ||
      coordArr[0] < -180 ||
      coordArr[1] > 180 ||
      coordArr[1] < -180)
  ) {
    window.alert(
      "Ingrese Latitud y Longitud de la siguiente manera:-34.59,-58.37"
    );
    coord.focus();
    return false;
  }

  if (cat.value == "Seleccionar") {
    window.alert("Seleccione una opción en Categoría");
    cat.focus();
    return false;
  }

  const info = {
    desc: desc.value,
    address: address.value,
    tel: tel.value,
    coord: coordArr,
    cat: cat.value
  };

  handleAddMarker(info);
}

function handleAddMarker(info) {
  //recibe la información de la validación y crea el marcador y el popup en base a eso.
  const lat = info.coord[0];
  const lng = info.coord[1];
  const title = info.desc;

  const popup = `<b>Nombre:</b><span> ${title} <br/><b>Dirección:</b><span> ${
    info.address
  } <br/><b>Teléfono:</b><span> ${info.tel} <br/><b>(X,Y):</b><span> ${
    info.coord
  } <br/> <b>Categoría:</b><span> ${info.cat} <br/>`;

  L.marker([lat, lng])
    .addTo(markerGroup)
    .bindPopup(popup)
    .openPopup()
    .on("dblclick", onMarkerClick); //cuando se realiza doble click sobre el marcador se ejecuta la función onMarkerClick
}

function handleExample() {
  //funcion para cargar datos predeterminados en el formulario

  document.forms["form_send"]["desc"].value = "AEROTERRA S.A.";
  document.forms["form_send"]["address"].value =
    "Av. Eduardo Madero 1020, C1001 CABA";
  document.forms["form_send"]["tel"].value = "54 9 11 5272 0900";
  document.forms["form_send"]["coord"].value = "-34.595986,-58.3724715";
  document.forms["form_send"]["cat"].value = "Comercial";
}

function onMarkerClick(e) {
  //cuando se clickea el marcador dos veces se abre un modal y se guarda la información de ese marcador en la variable global markerToDelete
  document.getElementById("modal").classList.add("is-active");
  markerToDelete = e.target;
}

function handleModalClose(e) {
  // si se clickea en el botón cancelar se cierra el modal y NO se elimina el marcador.
  document.getElementById("modal").classList.remove("is-active");
}

function handleDelete(e) {
  //si se clickea en el boton Confirmar se elimina el marcador y se cierra el modal
  console.log(e);
  markerToDelete.removeFrom(markerGroup);
  handleModalClose();
}

function getCoords(e) {
  //doble click para obtener coordenadas
  coordsGroup.clearLayers();
  const lat = e.latlng.lat;
  const lng = e.latlng.lng;
  document.forms["form_send"]["coord"].value = `${lat},${lng}`;

  const circle = L.circle([lat, lng], {
    color: "hsl(348, 100%, 61%)",
    fillColor: "hsl(348, 100%, 61%)",
    fillOpacity: 1,
    radius: 10
  }).addTo(coordsGroup);
}

function handleClean(e) {
  //función para limpiar el mapa completamente
  coordsGroup.clearLayers();
  markerGroup.clearLayers();
  document.forms["form_send"]["desc"].value = "";
  document.forms["form_send"]["address"].value = "";
  document.forms["form_send"]["tel"].value = "";
  document.forms["form_send"]["coord"].value = "";
  document.forms["form_send"]["cat"].value = "";
}

/*Eventos*/
const form = document.getElementById("form_send");
const exampleBtn = document.getElementById("example");
const closeModal = document.getElementById("closeModal");
const acceptModal = document.getElementById("acceptModal");
const cleanAll = document.getElementById("cleanAll");

form.addEventListener("submit", e => handleSubmit(e));

window.addEventListener("load", run());

exampleBtn.addEventListener("click", e => handleExample(e));

closeModal.addEventListener("click", e => handleModalClose(e));

acceptModal.addEventListener("click", e => handleDelete(e));

mymap.on("contextmenu", e => getCoords(e));

cleanAll.addEventListener("click", e => handleClean(e));
