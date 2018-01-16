// recipes for search
//let getRecipes2     = require(path.resolve(__dirname, 'sample-recipes-search-data'));

//models
var User        = server.models.UserModel;
var Role        = server.models.Role;
var RoleMapping = server.models.RoleMapping;


	async.parallel({
		users       : async.apply(createUsers),
		recipes     : async.apply(createRecipes),

		ingredients : async.apply(createIngredients),
		menus       : async.apply(createMenus),
		groceries   : async.apply(createGroceries),
		departments : async.apply(createDepartments),


		allergies   : async.apply(createAllergies),
		courses     : async.apply(createCourses),
		cuisines    : async.apply(createCuisines),
		diets       : async.apply(createDiets),
		holidays    : async.apply(createHolidays),

		nutritions  : async.apply(createNutritions)

	}, function(err, results){
		if( err ) throw err;



		assignAdmin(results.users[2]);

		attachRecipeToUsers(results.users, results.recipes, function(err){
			console.log('>models create sucessfully');
		});


		attachMenusToUsers(results.users, results.menus, function(err){
			console.log('>models create sucessfully');
		});

		attachRecipesToMenu(results.recipes, results.menus, function(err){
			console.log('>recipes create sucessfully');
		});

		attachIngredientsToRecipes(results.ingredients, results.recipes, function(err){
			console.log('>ingredients create sucessfully');
		});


		attachDepartmentsToIngredients(results.departments, results.ingredients, function(err){
			console.log('>departments attached to ingredients ');
		});

		//:todo remove this function, when departments will work
		attachDepartmentsToGroceries(results.departments, results.groceries, function(err){
			console.log('>departments create sucessfully');
		});



		attachAllergiesToRecipes(results.allergies, results.recipes, function(err){
			console.log('>allergies create sucessfully');
		});

		attachCoursesToRecipes(results.courses, results.recipes, function(err){
			console.log('>courses create sucessfully');
		});

		attachCuisinesToRecipes(results.cuisines, results.recipes, function(err){
			console.log('>cuisines create sucessfully');
		});

		attachDietsToRecipes(results.diets, results.recipes, function(err){
			console.log('>diets create sucessfully');
		});

		attachHolidaysToRecipes(results.holidays, results.recipes, function(err){
			console.log('>models create sucessfully');
		});


		// attach data to recipes


	});


//attaching recipes to admin user
//:todo not important function
function attachRecipeToUsers(users, recipes, cb){

	recipes.forEach(function(recipe){
		recipe.updateAttribute('userId', users[2].id);

	});

};



function attachIngredientsToRecipes(ingredients, recipes, cb){
	var arrayWithIds = idsOnly(ingredients);

	// only first 10 elements attach
	var first10  = arrayWithIds.slice(0, 10);
	var second10 = arrayWithIds.slice(11, 21);

	recipes.forEach(function(recipe, index){

		if (index % 2 === 0){
			recipe.updateAttribute('ingredients', first10);
		} else {
			recipe.updateAttribute('ingredients', second10);
		}

		// recipe.updateAttribute('ingredients', arrayWithIds);

	});
};


function attachDepartmentsToIngredients(departments, ingredients, cb){

	var first  = ingredients.splice(0, 15);
	var second = ingredients.splice(16, 31);
	var third  = ingredients.splice(32, 100);

	var arrayWithIds = idsOnly(departments);

	console.log(arrayWithIds[0]);
	console.log(arrayWithIds[1]);
	console.log(arrayWithIds[2]);

	first.forEach(function(ingredient){
		ingredient.updateAttribute('departmentId', arrayWithIds[0]);
	});

	second.forEach(function(ingredient){
		ingredient.updateAttribute('departmentId', arrayWithIds[1]);
	});

	third.forEach(function(ingredient){
		ingredient.updateAttribute('departmentId', arrayWithIds[2]);
	});

};





function attachDepartmentsToGroceries(departments, groceries, cb){
	var arrayWithIds = idsOnly(departments);
	groceries.forEach(function(grocery){
		grocery.updateAttribute('departments', arrayWithIds);

	});
};



// function attachCoursesToRecipes(courses, recipes, cb){
// 	var arrayWithIds = idsOnly(courses);
// 	recipes.forEach(function(recipe){
// 		recipe.updateAttribute('courses', arrayWithIds);

// 	});
// };

function attachCuisinesToRecipes(cuisines, recipes, cb){
	var arrayWithIds = idsOnly(cuisines);
	recipes.forEach(function(recipe){
		recipe.updateAttribute('cuisines', arrayWithIds);

	});
};


function attachDietsToRecipes(diets, recipes, cb){
	var arrayWithIds = idsOnly(diets);
	recipes.forEach(function(recipe){
		recipe.updateAttribute('diets', arrayWithIds);

	});
};

function attachHolidaysToRecipes(holidays, recipes, cb){
	var arrayWithIds = idsOnly(holidays);
	recipes.forEach(function(recipe){
		recipe.updateAttribute('holidays', arrayWithIds);

	});
};

function idsOnly(array){

	var result = Object.keys(array).map(function(e) {
		return array[e].id;
    });

	return result;

};