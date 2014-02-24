
<?php 
require 'Slim/Slim.php';
require 'rb.php';
\Slim\Slim::registerAutoloader();
R::setup('mysql:host=localhost;dbname=backbone_training','root','');

$note = R::dispense('note');

$note->title = "this simple note name";
$note->body = " note body start here very importatnt data";
$note->created = time();


R::store($note);




$app = new \Slim\Slim();


$app->get('/',function() use ($app){


//echo $app->view()->getTemplatesDirectory();
$app->render("index.html",array());


});

$app->get('/notes',function(){



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
