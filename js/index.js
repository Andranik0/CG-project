/*
 * NOVALSYS PROJECT
 * @author : AG
 * 
*/

/* PARAMÈTRES GLOBAUX ------------------------------------------------------------------------------------------------------------------------*/

var RADIUS = 2000; // Définir le rayon de la zone d'action (i.e la zone dans laquelle les marqueurs seront placés aléatoirement)
var NUMBER_OF_FRIENDS = 5; // Définir le nombre de personnes se rencontrant - (Invariant : assurez-vous que NUMBER_OF_FRIENDS <= people.length)
var CENTER = {lat: 40.748441, lng: -73.985664}; // Définir le centre de la carte (Il s'agit ici de l'Empire State Building)

/* -------------------------------------------------------------------------------------------------------------------------------------------*/

var images = ['./img/boy.png', './img/girl.png', './img/center-icon.png', './img/friends-off.png', './img/friends-on.png', './img/add-marker.png']; // Tableau d'images des icones affichées sur la carte
var markers = []; // Tableau des marqueurs affichés sur la carte
var circle; // Cercle de la zone d'action (sur laquelle les marqueurs peuvent être aléatoirement positionnés)
var circleFriends; // Cercle montrant la distance relative des marqueurs positionnés sur la carte

// Tableau de données des personnes affichées sur la carte
var people = [{nom:"Yorick", poste:"FOUNDER & CEO", desc:"Yorick manages the CampusGroups team and also participates in developments and sales. Prior to launching CampusGroups, Yorick accumulated 10 years of experience in Web development, IT consulting and trading at large corporations such as JPMorgan, Accenture and AXA. Yorick earned a Nuclear Engineering Degree from Centrale Marseille (France) and his MBA from NYU Stern School of Business.", sexe:"M"},
	  {nom:"Claire", poste:"CAMPUS RELATIONS", desc:"Claire is a young professional, close to students needs. She has an Engineering Degree in Computer Science from the Engineering School of Polytech Nice-Sophia, and a Master of Business Administration from Nice College (France), Marketing & Management major. She has had professional experiences in computer science, marketing and communication. She uses all these skills in her daily work at CampusGroups: development, maintenance of the CampusGroups platform and also clients relationship management.", sexe:"F"},
	  {nom:"Richard", poste:"UI DESIGNER", desc:"Richard is a graphic designer from the United Kingdom with experience in Birmingham and London before relocating to Paris, France. He worked in Central London for two and a half years at a web media company before joining CampusGroups in 2011. Richard has a strong passion for all things creative and always looking into new ways to use design to communicate. Illustration also plays its part in what Richard pursues along with writing for his blog.", sexe:"M"},
	  {nom:"Laura", poste:"WEB DEVELOPER", desc:"Laura graduated from EPITA, a well known computer engineering school in Paris, France. She enjoys travelling and most recently spent time at Czech Technical University in Prague. Laura has had experience in managing students clubs and she knows how easy it can be when using the right tools. Laura is dedicated to helping students achieve successful outcomes, in the development of the CampusGroups platform.", sexe:"F"},
	  {nom:"Erwann", poste:"WEB DESIGNER", desc:"Erwann was the first designer of the CampusGroups graphic interface back in 2005. He is now partnering with Richard on all graphic design and integration aspects of CampusGroups. Erwann is passionate about design, Web standards and visual arts in general.", sexe:"M"}];

/* -----------------------------------------------------------------------------------------------------------------------------------------*/

/* -> VOID - Génère la carte et toutes les données lui étant liées */
function initMap() {
	// Création de la carte GoogleMaps, définition du centre et du zoom qui conviennent 
    var map = new google.maps.Map(document.getElementById('map'), {center: CENTER, zoom: 14});
   
    // Fait appel à generateRandomMarkers() pour générer les marqueurs aléatoirement sur la carte
    generateRandomMarkers(NUMBER_OF_FRIENDS, CENTER, RADIUS, map);
    
    // Création du bouton permettant de contrôler CenterControl
    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);
    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
    
    // Création du bouton permettant de contrôler CircleFriendsControl
    var circleFriendsControlDiv = document.createElement('div');
    var circleFriendsControl = new CircleFriendsControl(circleFriendsControlDiv, map);
    circleFriendsControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(circleFriendsControlDiv);
    
    // Création du bouton permettant de contrôler CircleControl
    var circleControlDiv = document.createElement('div');
    var circleControl = new CircleControl(circleControlDiv, map);
    circleControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(circleControlDiv);
    
    // Création du bouton permettant de contrôler AddMarkerControl
    var addMarkerControlDiv = document.createElement('div');
    var addMarkerControl = new AddMarkerControl(addMarkerControlDiv, map);
    addMarkerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(addMarkerControlDiv);
    
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
		 
		 // Ligne utile pour afficher l'icone du marqueur correspondant au sexe de la personne associée
		 var indexImage=1;
		 if (people[markers.length].sexe == "M"){ indexImage = 0; }
		 
		 // On ajoute au tableau markers chaque nouveau marqueur (qui s'ajoute à la carte en même temps)
		 var marker = new google.maps.Marker({position:new google.maps.LatLng(point.lat,point.lng), map: carte, icon:images[indexImage], title:"Ami n°"+(markers.length+1), dist:point.dist});
		 addInfoMarker(marker,markers.length);
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
	  // Ligne utile à l'affichage d'une photo de profil Anonyme si aucune image ne matche avec le marqueur
	  var indexImg=index; if(index>=NUMBER_OF_FRIENDS){indexImg='X';}
	
	  // Contenu de l'infobulle adapté à chaque marqueur
	  var contentString = '<div id="content"><div id="siteNotice"></div>'+
	  '<img class="imageProfil" src="./img/users/user'+indexImg+'.jpg" alt="PhotoProfil"/>'+
      '<div id="titleContent"><h1 id="firstHeading" class="firstHeading">'+people[index].nom+'</h1>'+
      '<h2>'+people[index].poste+'</h2></div> <div id="bodyContent"><p>'+people[index].desc+'</p>'+
      '</div> <p><b>DISTANCE :</b> situé(e) à <b>'+marker['dist'].toFixed(0)+'</b>m de l\'Empire State Building'+
      '<br/><br/> <i>POSITION : </i>'+marker['position']+'</p></div>';

	  var infowindow = new google.maps.InfoWindow({
	    content: contentString
	  });
	
	  marker.addListener('click', function() {
		  // On s'arrange pour fermer la fenêtre précédente à l'ouverture d'une nouvelle
		  if (typeof( window.infoopened ) != 'undefined') infoopened.close();
		  infowindow.open(map, marker);
	      infoopened = infowindow;
	  });
}

/* -> VOID - Au clic sur le bouton de l'UI, dessine un cercle de rayon RADIUS et de centre CENTER
 * @map        : la carte sur laquelle dessiner le cercle
 * @controlDiv : le bouton permettant de contrôler l'événement
 */
function CircleControl(controlDiv,map){
	  var textesBtn = ['Cliquer pour afficher la zone d\'action','Afficher la zone d\'action','Cliquer pour masquer la zone d\'action','Masquer la zone d\'action'];
	
	  // Création du bouton de contrôle
	  var controlUI = document.createElement('div');
	  controlUI.id = 'controlUI';
	  controlUI.title = textesBtn[0];
	  controlUI.innerHTML = textesBtn[1];
	  controlDiv.appendChild(controlUI);

	  // Au clic sur le bouton Afficher, fait apparaître la zone d'action
	  controlUI.addEventListener('click', function() {
		  if(circle==null){
			  circle = new google.maps.Circle({
				    strokeColor: '#5E9DE5',
				    strokeOpacity: 0.5,
				    strokeWeight: 2,
				    fillColor: '#5E9DE5',
				    fillOpacity: 0.1,
				    map: map,
				    center: CENTER,
				    radius: RADIUS
			  });
			  controlUI.title = textesBtn[2];
			  controlUI.innerHTML = textesBtn[3] ;
		  }
		  else{
			  circle.setMap(null);
			  circle = null;
			  controlUI.title =  textesBtn[0];
			  controlUI.innerHTML =  textesBtn[1];
		  }
	  });		
}

/* -> VOID - Au clic sur le bouton de l'UI, recentre la carte
 * @controlDiv : le bouton permettant de contrôler l'événement
 * @map        : la carte concernée par l'événement décrit
 */
function CenterControl(controlDiv, map) {

	  // Création du bouton de contrôle
	  var controlUI = document.createElement('div');
	  controlUI.id = 'controlUI';
	  controlUI.title = 'Cliquer pour recentrer la carte';
	  controlUI.innerHTML = '<img  class="icon" src="'+images[2]+'" alt="rencentrer" /> Centrer';
	  controlDiv.appendChild(controlUI);

	  // Au clic sur le bouton Centrer, centre la carte sur CENTER
	  controlUI.addEventListener('click', function() {
	    map.setCenter(CENTER);
	  });
}

/* -> VOID - Au clic sur le bouton de l'UI, dessine un cercle de rayon "distance de l'ami le plus éloigné du point de rencontre" et de centre CENTER
 * @map        : la carte sur laquelle dessiner le cercle
 * @controlDiv : le bouton permettant de contrôler l'événement
 */
function CircleFriendsControl(controlDiv,map){
	  var textesBtn = ['Cliquer pour afficher le cercle de l\'amitié','<img class="icon" src="'+images[3]+'" alt="amis"/>','Cliquer pour masquer le cercle de l\'amitié','<img  class="icon" src="'+images[4]+'" alt="amis"/>'];
	
	  // Création du bouton de contrôle
	  var controlUI = document.createElement('div');
	  controlUI.id = 'controlUI';
	  controlUI.title = textesBtn[0];
	  controlUI.innerHTML = textesBtn[1];
	  controlDiv.appendChild(controlUI);

	  // Au clic sur le bouton Afficher, fait apparaître le cercle de l'amitié
	  controlUI.addEventListener('click', function() {
		  if(circleFriends==null){
			  var rayon = 0;
			  
			  // Déterminer le rayon du cerlce à tracer
			  for(i=0;i<markers.length;i++){
				  if(markers[i].dist>rayon){
					  rayon = markers[i].dist;
				  }
			  }
			  
			  // Création du cercle
			  circleFriends = new google.maps.Circle({
				    strokeColor: '#40A47C',
				    strokeOpacity: 0.5,
				    strokeWeight: 2,
				    fillColor: '#40A47C',
				    fillOpacity: 0.1,
				    map: map,
				    center: CENTER,
				    radius: rayon
			  });
			  controlUI.title = textesBtn[2];
			  controlUI.innerHTML = textesBtn[3] ;
		  }
		  else{
			  circleFriends.setMap(null);
			  circleFriends = null;
			  controlUI.title =  textesBtn[0];
			  controlUI.innerHTML =  textesBtn[1];
		  }
	  });		
}

/* -> VOID - Au clic sur le bouton de l'UI, ajoute un marqueur aléatoirement sur la carte
 * @map        : la carte sur laquelle ajouter le marqueur
 * @controlDiv : le bouton permettant de contrôler l'événement
 */
function AddMarkerControl(controlDiv,map){
	  var textesBtn = ['Cliquer pour ajouter un marqueur','<img class="icon" style="opacity:0.8" src="'+images[5]+'" alt="add-marker"/>'];
	
	  // Création du bouton de contrôle
	  var controlUI = document.createElement('div');
	  controlUI.id = 'controlUI';
	  controlUI.title = textesBtn[0];
	  controlUI.innerHTML = textesBtn[1];
	  controlDiv.appendChild(controlUI);

	  // Au clic sur le bouton Afficher, interagit avec l'utilisateur pour ajouter un marqueur
	  controlUI.addEventListener('click', function() {
		 var nom = prompt("Entrez le nom de la personne à ajouter.");
	     var poste = prompt("Entrez le poste de la personne à ajouter.");
	     var desc = prompt("Entrez la description de la personne à ajouter.");
	     var sexe = prompt("Entrez le sexe de la personne à ajouter. [M/F]");
	     
	     var newFriend = {nom:nom, poste:poste, desc:desc, sexe:sexe};
	 	 if(nom!=null && poste!=null && desc!=null && (sexe=='M' || sexe=='F')){
		     people.push(newFriend);
		     generateRandomMarkers(1, CENTER, RADIUS, map);
	 	 }
	 	 else{
	 		 alert("Erreur dans les données entrées, recommencez s'il-vous-plait ! :)");
	 	 }
	  });		
}