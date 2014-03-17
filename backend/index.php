
<?php 
require 'Slim/Slim.php';
require 'rb.php';
\Slim\Slim::registerAutoloader();
R::setup('mysql:host=localhost;dbname=backbone_training','root',''); // change database name and username and password
session_start();

$app = new \Slim\Slim(array(
	//'mode' => 'development',
    //'debug' => true
));

$app->get('/',function() use ($app){
	echo "speak to me!";
});


$app->get('/user/:id',function($id) use ($app){
	$_SESSION['user_guid'] = $id;
	echo json_encode(array('user_guid'=>$id  ));
});

$app->get('/notes',function(){
	header("Content-Type: application/json");
	if(isset($_SESSION['user_guid'])){
		$guid = $_SESSION['user_guid'];
	}else{
		$guid = '';
	}
	$notes = R::getAll( "select * from note where guid = :guid",array('guid' => $guid));
	echo json_encode($notes);
});

$app->post('/notes',function() use ($app){
	$body = $app->request->getBody();
	$data = (array) json_decode($body);
	if($data){
		$note = R::dispense('note');
		$note->title = $data['title'];
		$note->body = $data['body'];
		$note->guid = $data['guid'];
		$note->created = time(); 
		$result = R::store($note);
		echo json_encode($note->export());
	}else{
		echo json_encode(array());
	}
});


$app->put('/notes/:id', function($id) use ($app) {

	$body = $app->request->getBody();
	$obj = json_decode($body);
	$note = R::load('note',$id);
	if($note->id){
		$note->title = $obj->title;
		$note->body = $obj->body;
		R::store($note);
	}
	echo json_encode($note->export());
});

$app->delete('/notes/:id', function ($id) {
	//Delete book identified by $id
	$note = R::load('note',$id);
	if($note->id){
		R::trash($note);
	}    
	echo json_encode(array());
});

$app->run();
