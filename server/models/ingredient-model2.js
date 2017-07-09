'use strict';

module.exports = function(IngredientModel) {
    //@TODO add to done & delete default false
	IngredientModel.validatesPresenceOf(
		// 'name', 'type', 
        // 'done', 'delete'

        'term',
        'description',
        'searchValue',
	);

    IngredientModel.observe("before save", function updateTimestamp(ctx, next) {

    	if( ctx.isNewInstance ){
    		ctx.instance.created_at = new Date();
    		ctx.instance.updated_at = new Date();

            ctx.instance.done   = false;
            ctx.instance.delete = false;            
    	} 


    	next();
    });

    IngredientModel.observe('update', function(ctx, next){
        ctx.instance.updated_at = new Date();
        next();
    });


  // method when Deparments use array of ingredients and move it inside departments array
  // method list attached ingredients by departments

  	// by passing recipeId we'll get all Ingredients, related to this recipe 
  	// and Departments, related to Ingredients.
    IngredientModel.listDepartments = function(recipeId, cb){
        var RecipeModel2 = IngredientModel.app.models.RecipeModel2; //:todo

        RecipeModel2.findById(recipeId,{
        	include: {IngredientModel2: 'department'}
        })
        .then(function(recipe){
        	console.log(recipe);
        });

        // IngredientModel.findById(ingredientId)
        // .then(function(recipe){
        //     console.log( recipe.ingredients );
        //     // @TODO change to custom method on recipe model
        //     IngredientModel.find({
        //         where:{
        //             id: recipe.ingredients
        //         }       
        //     })
        //     .then(function(ingredients){
        //     //  recipe.ingredients = ingredients;
        //     // console.log(recipe);
        //     // return recipe;
        //         cb(null, ingredients);
        //     });




        // })
        // .catch(function(err){
        //     if(err){ cb(err); }
        // });



    };
    IngredientModel.remoteMethod('listIngredients', {
        accepts: {
          arg: 'recipeId',
          type: 'string'
        },
        returns: {
          arg: 'menus', //:todo
          type: 'array'
        },
        http: {
          path: '/recipe/list/departments',
          verb: 'get'
        }
    });

    IngredientModel.findByIds = function(ingredientIds, cb){
        IngredientModel.find({
                where:{
                    id: ingredientIds
                }       
            }).then(cb);
    };

  // method list attached ingredients with unit convertion and additions
	// RecipeModel.listIngredients = function(recipeId, cb){

 //    };

};