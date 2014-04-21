
describe("User model suite",function(){
beforeEach(function(){
 App.current_user =  new App.userModel();
});
 
it("should be able to initialize",function(){
     //var userModel =  new App.userModel();
     expect(App.current_user).toBeDefined();
	 
});
it("should  have valid id",function(){
     //var userModel =  new App.userModel();
     expect(App.current_user.attributes.id).toBeDefined();
});



});


// second to check the notes model 

describe("note model suite",function(){
beforeEach(function(){

  App.noteTest = new App.noteModel();
  App.noteCollectionTest = new App.noteCollection();
  
});
 it("should have guid defined",function(){
 
    expect(App.noteTest.attributes.guid).toBe(App.current_user.attributes.id);
     
 });

 it("should have defiend default value for title and body",function(){
 
   expect(App.noteTest.attributes.title).toEqual("Title..");
 
    expect(App.noteTest.attributes.body).toEqual("Body...");
 });
 
 
 it("should be new note model('not saved yet')",function(){
 
    expect(App.noteTest.isNew()).toBeTruthy()
 
 });
 
 it("should fail validations",function(){
    App.noteTest.set("title","121545487erwer78werwerkwek;lskdfpoipowqieqwei9-0qwepoqwepoiqopwesada;lsda;sld'sadkjdklfjsdlkfslkdjfsdjflkshdfhsdkjfhskjdfasdasdasdasdasdasdasdasdasdasdasdasdasd");
    App.noteCollectionTest.create(App.noteTest);
	expect(App.noteTest.attributes.id).not.toBeDefined();
 
 });
 
 it("should PASS CRUD",function(){
    App.noteTest.set("title","121545487");
	App.noteCollectionTest.create(App.noteTest);
	waits(1000);
	runs(function(){
		expect(App.noteTest.attributes.id).toBeDefined();  //create
        App.noteTest.set("title","hello world")
	    App.noteTest.save();
        waits(1000);
        runs(function(){
			expect(App.noteTest.attributes.title).toEqual("hello world");  //create 
			App.noteTest.destroy();
			waits(1000);
			runs(function(){
				expect(App.noteCollectionTest.findWhere(App.noteTest.toJSON())).not.toBeDefined();  //create 
			});		
		});		
	});	
 });
 
 
 
});