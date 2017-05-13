/*
 * NOVALSYS PROJECT
 * @author : AG
 * 
*/
var images = ['./img/boy.png', './img/girl.png'];
var markers = [];
var people = [{nom:"Yorick", poste:"FOUNDER & CEO", desc:"Yorick manages the CampusGroups team and also participates in developments and sales. Prior to launching CampusGroups, Yorick accumulated 10 years of experience in Web development, IT consulting and trading at large corporations such as JPMorgan, Accenture and AXA. Yorick earned a Nuclear Engineering Degree from Centrale Marseille (France) and his MBA from NYU Stern School of Business."},
	  {nom:"Claire", poste:"CAMPUS RELATIONS", desc:"Claire is a young professional, close to students needs. She has an Engineering Degree in Computer Science from the Engineering School of Polytech Nice-Sophia, and a Master of Business Administration from Nice College (France), Marketing & Management major. She has had professional experiences in computer science, marketing and communication. She uses all these skills in her daily work at CampusGroups: development, maintenance of the CampusGroups platform and also clients relationship management."},
	  {nom:"Richard", poste:"UI DESIGNER", desc:"Richard is a graphic designer from the United Kingdom with experience in Birmingham and London before relocating to Paris, France. He worked in Central London for two and a half years at a web media company before joining CampusGroups in 2011. Richard has a strong passion for all things creative and always looking into new ways to use design to communicate. Illustration also plays its part in what Richard pursues along with writing for his blog."},
	  {nom:"Laura", poste:"WEB DEVELOPER", desc:"Laura graduated from EPITA, a well known computer engineering school in Paris, France. She enjoys travelling and most recently spent time at Czech Technical University in Prague. Laura has had experience in managing students clubs and she knows how easy it can be when using the right tools. Laura is dedicated to helping students achieve successful outcomes, in the development of the CampusGroups platform."},
	  {nom:"Erwann", poste:"WEB DESIGNER", desc:"Erwann was the first designer of the CampusGroups graphic interface back in 2005. He is now partnering with Richard on all graphic design and integration aspects of CampusGroups. Erwann is passionate about design, Web standards and visual arts in general."}];

/* -> VOID - Génère la carte et toutes les données lui étant liées */
function initMap() {
	var empireSbuilding = {lat: 40.748441, lng: -73.985664};
    var map = new google.maps.Map(document.getElementById('map'), {center: empireSbuilding, zoom: 14});
   
    generateRandomMarkers(5, empireSbuilding, 2000, map);
    
}

/*	-> VOID - Génère les marqueurs sur la carte
 *  @nombre : le nombre de marqueurs que l'on veut ajouter (nombre d'amis)
 *  @centre : le lieu (coordonnées latitude et longitude) centre de la zone
 *  @rayon  : le rayon (en mètres) de la zone dans laquelle les marqueurs seront ajoutés 
 *  @carte  : la carte sur laquelle toutes les opérations seront effectuées
 */
function generateRandomMarkers(nombre, centre, rayon, carte){

	 for(i=0;i<nombre;i++){
		 var point = randomGeoCoord(centre,rayon);
		 // On ajoute au tableau markers chaque nouveau marqueur (qui s'ajoute à la carte en même temps)
		 var marker = new google.maps.Marker({position:new google.maps.LatLng(point.lat,point.lng), map: carte, icon:images[i % 2], title:"Ami n°"+(i+1)});
		 addInfoMarker(marker,i);
		 markers.push(marker);
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

/* -> VOID - Ajoute une infobulle au marqueur en fonction de son index
 * @marker : le marqueur concerné par cet ajout
 * @index  : l'index du marqueur permettant de récupérer les données du tableau people 
 */
function addInfoMarker(marker, index){
	  // Contenu de l'infobulle adapté à chaque marqueur
	  var contentString = '<div id="content"><div id="siteNotice"></div>'+
	  '<img class="imageProfil" src="./img/user'+index+'.jpg" alt="PhotoProfil"/>'+
      '<div id="titleContent"><h1 id="firstHeading" class="firstHeading">'+people[index].nom+'</h1>'+
      '<h2>'+people[index].poste+'</h2></div> <div id="bodyContent"><p>'+people[index].desc+'</p>'+
      '</div> <p><b>DISTANCE :</b> situé(e) à <b>'+1+'</b>m de l\'Empire State Building'+
      '<br/><br/> <i>LATITUDE :</i> '+ 17 +
      '<br/> <i>LONGITUDE :</i> '+-73+'</p></div>';

	  var infowindow = new google.maps.InfoWindow({
	    content: contentString
	  });
	
	  marker.addListener('click', function() {
	    infowindow.open(map, marker);
	  });
}