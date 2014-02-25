
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

$app->post('/notes',function() use ($app){
$body = $app->request->getBody();




$data = (array) json_decode($body);


 if($data){
$note = R::dispense('note');
$note->title = $data['title'];
$note->body = $data['body'];
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
