'use strict';


var Grocery     = server.models.GroceryModel2;

function getGroceries(){

	var grocery = [
		{

			
			'title':"Ultimate Grocery List"



		}
	];

	return grocery;

};

function createGroceries(cb){
	database.autoupdate('GroceryModel2', function(err){
		if (err) return cb(err);

		Grocery.create(getGroceries(), cb);
	
	});
};

function idsOnly(array){

  var result = Object.keys(array).map(function(e) {
    return array[e].id;
    });

  return result;    

};


module.exports.createGroceries = createGroceries;