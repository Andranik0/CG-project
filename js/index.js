/*
 * NOVALSYS PROJECT
 * @author : AG
 * 
*/

/* -> VOID - Génère la carte et toutes les données lui étant liées */
function initMap() {
	var empireSbuilding = {lat: 40.748441, lng: -73.985664};
    var map = new google.maps.Map(document.getElementById('map'), {center: empireSbuilding, zoom: 19});
   
    generateRandomMarkers(5, empireSbuilding, 2000, map);
    
}

/*	-> VOID - Génère les marqueurs sur la carte
 *  @nombre : le nombre de marqueurs que l'on veut ajouter (nombre d'amis)
 *  @centre : le lieu (coordonnées latitude et longitude) centre de la zone
 *  @rayon  : le rayon (en mètres) de la zone dans laquelle les marqueurs seront ajoutés 
 *  @carte  : la carte sur laquelle toutes les opérations seront effectuées
 */
function generateRandomMarkers(nombre, centre, rayon, carte){
	 var markers = [];

	 for(i=0;i<nombre;i++){
		 var point = randomGeoCoord(centre,rayon);
		 // On ajoute au tableau markers chaque nouveau marqueur (qui s'ajoute à la carte en même temps)
		 markers.push(new google.maps.Marker({position:new google.maps.LatLng(point.lat,point.lng), map: carte}));
	 }
}

/* -> Retourne un couple latitude/longitude aléatoire 
 * @ rayon : le rayon (en mètres) de la zone dans laquelle les coordonnées sont bornées
 * @ centre : le lieu (coordonnées latitude et longitude) centre de la zone
 */
function randomGeoCoord(centre, rayon) {
		var y0 = centre.lat;
		var x0 = centre.lng;
		var rd = rayon / 111300; // Un degré vaut environ 111300 mètres
		
		var u = Math.random();
		var v = Math.random();
		
		var w = rd * Math.sqrt(u);
		var t = 2 * Math.PI * v;
		var x = w * Math.cos(t);
		var y = w * Math.sin(t);
		
		var xp = x / Math.cos(y0); // Ajustement de la coordonnée x pour le rétrécissement des distances est-ouest
		
		var newlat = y + y0;
		var newlng = x + x0;
		
		return {
		    'lat' : newlat.toFixed(5), // toFixed() formate le nombre en notation à point-fixe 
		    'lng' : newlng.toFixed(5), // i.e arrondit au Nième chiffre après la virgule (ici : 5)
		    'dist': distance(centre.lat,centre.lng,newlat,newlng),
		};
}

/* -> FLOAT - Calcule la distance entre deux points A et B
 * @latA : latitude du point A
 * @lngA : longitude du point A
 * @latB : latitude du point B
 * @lngB : longitude du point B
 */
function distance(latA, lngA, latB, lngB) {
	    var R = 6371000; // Rayon de la Terre en mètres
	    var a = 0.5 - Math.cos((latB - latA) * Math.PI / 180) / 2 + Math.cos(latA * Math.PI / 180) * Math.cos(latB * Math.PI / 180) * (1 - Math.cos((lngB - lngA) * Math.PI / 180)) / 2;
	    return R * 2 * Math.asin(Math.sqrt(a));
}