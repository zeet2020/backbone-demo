

//initializing the app global object to attach methods
var App = {};


//extending events handle custom events in application
App.vent = _.extend({}, Backbone.Events);

App.userModel = Backbone.Model.extend({
        urlRoot:'backend/index.php/user',
        initialize:function(){
			id = localStorage.getItem('backbonedemouid');
		 	if(id){
				this.set('id',id);
			}else{
				guid = this.guid();
				localStorage.setItem('backbonedemouid',guid);
		        this.set('id',guid);
			}
		},
        s4:function(){
		 return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		},
        guid:function(){
		  return (this.s4()+this.s4()+"-"+this.s4()+"-"+this.s4()+"-"+this.s4()+"-"+this.s4()+this.s4()+this.s4());
		}
	 });


App.noteModel = Backbone.Model.extend({
	// set default property
    defaults:{
		title:'Title..',
		body:'Body...',

    },
    initialize:function(){

    this.set('guid',App.current_user.attributes.id);
    },
    validate:function(attr,options){   // defining a validation method

		if(attr.title.length > 0){
		   var tempTitle = $("<p>"+attr.title+"<p>").text();
		    if(tempTitle.length > 120){
			  return "validation failed enter only 120 char in title";

			}
		}

    }

});

App.noteCollection = Backbone.Collection.extend({
	model : App.noteModel,   // this is a collection of "noteModel" type
	url:'backend/index.php/notes',  // defining a rest end point for the collection and model..
    initialize:function(){
	   this.comparator = 'title';

	}
});

//defining a itemView for each note
App.noteItemView = Backbone.View.extend({
	tagName:'li',
	className:'panel-heading',
	initialize:function(option){
		this.model = option.model;
        this.listenTo(this.model,'change',this.render);
        this.render();
	},
	events:{
		'click a':'noteSelected',
		'click #deletenote':'deleteNote'
	},
	deleteNote:function(e){
	  e.stopPropagation();
		this.model.destroy({
			success:function(m){

				App.vent.trigger("noteDestroy",m);
            }
        });
    },
	noteSelected:function(e){

		this.$el.parent().find('li.active').removeClass('active');
		this.$el.addClass('active');
		App.vent.trigger("noteSelect",this.model);
	},
	render:function(){
		this.$el.html(_.template($('#notesItemTemplate').html(),this.model.toJSON()));
		return this;
	}
});

App.noteCollectionView = Backbone.View.extend({
	tagName:'ul',
	className:'nav nav-pills nav-stacked',
    initialize:function(option){
		this.collection = option.collection
		ncview = this;

		this.collection.fetch({
			success:function(){
			    ncview.collection.sort(-1);
				ncview.render();
			}
		});

		App.vent.on('createnote',function(model){
			this.collection.create(model,{
				success:function(){

					ncview.render();
                }
	        });
        },this);

        App.vent.on("noteDestroy",function(){
			this.render();
        },this);


	},
	render:function(){

		this.$el.empty(); // empty all elements
		this.collection.each(function(value,key,list){
			var itemView = new App.noteItemView({model:value});
			this.$el.append(itemView.el);
		},this);
		return this;
	}
});

App.noteCreateItemView = Backbone.View.extend({
	tagName:'div',
	className:'createSection',
	events:{
		'click #savenote':'saveNote',
		'click #newnote':'newNote'
	},
	newNote:function(e){
		this.model = new App.noteModel();
		App.vent.trigger("updateRegion");
	},
	saveNote:function(e){
	     originalModel = this.model.toJSON();  //method reten the default earier value if the validation fail
		this.model.set({'title':this.$el.find('#note-title').text()});
		this.model.set('body',this.$el.find('#note-body').html());
        if(!this.model.isValid()){

		     this.model.set(originalModel);
		     alert(this.model.validationError);

		}else{
		if(this.model.get('id')){

			this.model.save();
        }else{
            App.vent.trigger("createnote",this.model);
        }


		}


	},
	initialize:function(){
		this.model = new App.noteModel();
		App.vent.on("noteSelect",function(model){
			this.model = model;
			//view = this;
			App.vent.trigger("updateRegion");
		},this);

	},
	render:function(){
		var template = _.template($('#createNoteItemTemplate').html(),this.model.toJSON());
		this.$el.html(template);
		return this;
	},
});

App.leftRegion = Backbone.View.extend({
	events:{
		'click #addnote':'addNoteEvent'
	},
	addNoteEvent:function(){
		App.vent.trigger("createnote",new App.noteModel());
	},
    initialize:function(){
		this.collectionView =  new App.noteCollectionView({collection:new App.noteCollection()});
		this.render();
	},
	render:function(){
		//rendering the left region
		this.$el.find('.panel-body').html(this.collectionView.el);
	}
});

App.rightRegion = Backbone.View.extend({
   initialize:function(){
		this.noteCreateItemView = new App.noteCreateItemView();
        this.render();
        App.vent.on("updateRegion",this.render,this);

		App.vent.on("noteDestroy",function(){
		        this.noteCreateItemView.model = new App.noteModel();
				this.render();
		},this);

   },
   render:function(){

	//rendering the right region

    this.$el.append(this.noteCreateItemView.render().el);

	 new MediumEditor('#note-title',
	 {
	  buttons:[],
	  disableReturn:true,
	  disableToolbar:true,
	 }
	 );
	   // configuration for medium editor plugin.
	  new MediumEditor('#note-body',{
	  buttons:['pre','bold', 'italic', 'quote','orderedlist','unorderedlist'],
	  buttonLabels:{
	  'bold': '<b>b</b>',
	  'italic': '<i>i</i>',
	  'quote':'<b>"</b>',
	  'unorderedlist':'<b>ul</b>',
	  'orderedlist':'<b>ol</b>',
	  'pre':'<b>pre</b>'
	  },
	  diffLeft: 25,
      diffTop: 10,
      firstHeader: 'h1',
      secondHeader: 'h2',
      delay: 100,
      targetBlank: true
	  });





	},

});

// rendering the regions functionality

App.current_user = new App.userModel();

App.current_user.fetch(); //just setting guid at server...


//delay for completing the ajax request

setTimeout(function(){
	if(App.current_user.attributes.id){
		new App.leftRegion({el:'#leftRegion'});
		new App.rightRegion({el:"#rightRegion"});
	}else{
		alert("wow!... your using very old version of browser");
	}
},2000);











