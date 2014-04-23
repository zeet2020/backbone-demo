
describe("user model",function(){
beforeEach(function(){
 App.current_user =  new App.userModel();
});
 
it("should be able to initialize user model",function(){
     //var userModel =  new App.userModel();
     expect(App.current_user).toBeDefined();
	 
});
it("and should  have valid id",function(){
     //var userModel =  new App.userModel();
     expect(App.current_user.attributes.id).toBeDefined();
});



});


// second to check the notes model 

describe("note model",function(){
beforeEach(function(){
  App.noteTest = new App.noteModel();
  App.noteCollectionTest = new App.noteCollection();
});
 it("should have guid defined on initialize",function(){
     expect(App.noteTest.attributes.guid).toBe(App.current_user.attributes.id);
 });

 it("and should have defined default value for title and body",function(){
    expect(App.noteTest.attributes.title).toEqual("Title..");
    expect(App.noteTest.attributes.body).toEqual("Body...");
 });
 
 
 it("and should be new note model since its not saved yet",function(){
 
    expect(App.noteTest.isNew()).toBeTruthy()
 
 });
 
 it("and should not save model if the title character lenght is greater then 120 characters",function(){
    App.noteTest.set("title","121545487erwer78werwerkwek;lskdfpoipowqieqwei9-0qwepoqwepoiqopwesada;lsda;sld'sadkjdklfjsdlkfslkdjfsdjflkshdfhsdkjfhskjdfasdasdasdasdasdasdasdasdasdasdasdasdasd");
    App.noteCollectionTest.create(App.noteTest);
	expect(App.noteTest.attributes.id).not.toBeDefined();
 
 });
 
 it("and should successfull handle all CRUD operations",function(){
    App.noteTest.set("title","121545487");
	App.noteCollectionTest.create(App.noteTest);
	waits(1000);
	runs(function(){
		expect(App.noteTest.attributes.id).toBeDefined();  //create
        App.noteTest.set("title","hello world");
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
 
 
 it("and should handle collection of note model",function(){
    App.noteCollectionTest.fetch();
	waits(1000);
	templen=0;
	runs(function(){ 
	templen = App.noteCollectionTest.length;
	App.noteTest.set("title","awesome model");
	App.noteCollectionTest.create(App.noteTest);
	App.noteCollectionTest.fetch();
	});
	
    
	waits(1000);
	
	runs(function(){
	   expect(App.noteCollectionTest.length).toEqual(templen+1);
	}); 
 });
 
 
});