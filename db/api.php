<?php
/*  Fichier PHP qui se connecte à la base de données MySQL et transmet le XML au navigateur */
require("db_conf.php");

function parseToXML($htmlStr)
{
	$xmlStr=str_replace('<','&lt;',$htmlStr);
	$xmlStr=str_replace('>','&gt;',$xmlStr);
	$xmlStr=str_replace('"','&quot;',$xmlStr);
	$xmlStr=str_replace("'",'&#39;',$xmlStr);
	$xmlStr=str_replace("&",'&amp;',$xmlStr);
	return $xmlStr;
}

/* Connexion à la bdd */
$mysqli = new mysqli($hostname, $username, $password, $database);

/* Vérification de la connexion */
if (mysqli_connect_errno()) {
	printf("Échec de la connexion : %s\n", mysqli_connect_error());
	exit();
}

header("Content-type: text/xml");

// Start XML file, echo parent node
echo '<markers>';

$query = "SELECT * FROM markers";
$res = $mysqli->query($query);

if($res){
	$res->data_seek(0);
	while ($row = $res->fetch_assoc()) {
		// Add to XML document node
		echo '<marker ';
		echo 'name="' . parseToXML($row['name']) . '" ';
		echo 'address="' . parseToXML($row['address']) . '" ';
		echo 'lat="' . $row['lat'] . '" ';
		echo 'lng="' . $row['lng'] . '" ';
		echo 'type="' . $row['type'] . '" ';
		echo '/>';
	}
}

// End XML file
echo '</markers>';

$mysqli->close();
?>