
<?php 
require 'Slim/Slim.php';
require 'rb.php';
\Slim\Slim::registerAutoloader();
R::setup('mysql:host=localhost;dbname=backbone_training','root','');

/*$note = R::dispense('note');

$note->title = "this simple note name";
$note->body = " note body start here very importatnt data";
$note->created = time();


R::store($note);*/




$app = new \Slim\Slim();


$app->get('/',function() use ($app){


echo "this server backend";
print_r($app->request);

});




$app->get('/notes',function(){

header("Content-Type: application/json");

$notes = R::getAll( 'select * from note' );
echo json_encode($notes);

});

$app->post('/notes',function(){
$notes = $app->request->getBody();




});


$app->put('/notes/:id', function ($id) {
    
});

$app->delete('/notes/:id', function ($id) {
    //Delete book identified by $id
});

$app->run();
