const apiUrl = 'https://tyradex.app/api/v1/pokemon';
const div = document.getElementById("affichagePokemon");
const divMap = document.getElementById("map");
const map = L.map('map').setView([46.2044, 6.1432], 12);
var pokemonTemp;
map.on('click', function (e) {
    var coord = e.latlng;
    var lat = coord.lat;

    var lng = coord.lng;
    const coordMarker = [lat, lng];
    console.log(pokemonTemp)
    L.marker(coordMarker, {

        icon: L.icon({
            iconUrl: pokemonTemp.sprites.regular,
            iconSize: [50, 50]
        })
    }).addTo(map).openPopup();
});



function AfficherPokemon() {
    divMap.style.display = "none";
    div.style.display = "block";
    const tableau = document.getElementById("tableauPokemon");
    div.style.display = "block"


    // Vérifier si le tableau a déjà des en-têtes
    if (tableau.querySelector("thead") === null) {
        const thead = document.createElement("thead");
        const tr = document.createElement("tr");

        const th1 = document.createElement("th");
        th1.textContent = "Nom";
        const th2 = document.createElement("th");
        th2.textContent = "Image";
        const th3 = document.createElement("th");
        th3.textContent = "Ajouter";

        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3);
        thead.appendChild(tr);
        tableau.appendChild(thead);
    }

    // Supprimer les anciennes données pour éviter les doublons
    const tbody = tableau.querySelector("tbody") || document.createElement("tbody");
    tbody.innerHTML = ""; // Réinitialise le corps du tableau
    tableau.appendChild(tbody);

    // Faire une requête GET
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data)) {
                data.forEach(pokemon => {
                    if (pokemon.pokedex_id > 0) {
                        const tbody = document.getElementById("tbodyPokemon");

                        const tr = document.createElement("tr");
                        tr.className = "align-middle"; // Centrer verticalement le contenu des cellules

                        const td1 = document.createElement("td");
                        td1.className = "text-capitalize fw-bold"; // Met le nom en gras avec une première lettre majuscule
                        td1.textContent = pokemon.name.fr;

                        const td2 = document.createElement("td");
                        td2.className = "text-center"; // Centrer l'image dans la cellule
                        const img = document.createElement("img");
                        img.width = 150;
                        img.src = pokemon.sprites.regular;
                        img.alt = `Image de ${pokemon.name.fr}`;
                        img.className = "img-fluid rounded"; // Rend l'image responsive avec des bords arrondis
                        td2.appendChild(img);

                        const td3 = document.createElement("td");
                        td3.className = "text-center"; // Centrer le bouton dans la cellule
                        const button = document.createElement("button");
                        button.type = "button";
                        button.className = "btn btn-primary btn-sm"; // Bouton stylé avec une taille plus petite
                        button.textContent = "Ajouter";
                        button.onclick = () => ajouterUnPokemonSurLaCarte(pokemon);
                        td3.appendChild(button);

                        tr.appendChild(td1);
                        tr.appendChild(td2);
                        tr.appendChild(td3);

                        tbody.appendChild(tr);


                    }
                });
            } else {
                console.error('Les données ne sont pas sous le bon format.');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données :', error);
        });
}

function afficherLaCarte() {
    // Initialiser la carte centrée sur Genève
    div.style.display = "none";
    divMap.style.display = "block";


    // Ajouter le fond de carte
    const Stadia_AlidadeSatellite = L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 0,
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });
    Stadia_AlidadeSatellite.addTo(map);




}

function ajouterUnPokemonSurLaCarte(pokemon) {
    pokemonTemp = pokemon;
    console.log(pokemon);
    console.log(pokemonTemp);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userCoords = [position.coords.latitude, position.coords.longitude];


            L.marker(userCoords, {
                icon: L.icon({
                    iconUrl: pokemon.sprites.regular,
                    iconSize: [50, 50]
                })
            }).addTo(map).openPopup();


            map.setView(userCoords, 13);
        }, error => {
            console.error("Erreur lors de la récupération de la position de l'utilisateur :", error);
        });
    } else {
        console.error("La géolocalisation n'est pas supportée par ce navigateur.");
    }

}




