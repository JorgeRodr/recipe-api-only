'use strict';

const path    = require('path');
const async   = require('async');
const debug   = require('debug');
const raven   = require('raven');

raven.config('https://c1e3b55e6a1a4723b9cae2eb9ce56f2e:57e853a74f0e4db98e69a9cf034edcdd@sentry.io/265540').install();

let server     = require(path.resolve(__dirname, '../../server/server'));
let database   = server.datasources.recipeDS;

let helper     = require(path.resolve(__dirname, '../helper'));

// include middleware
// @todo make it auto-icludable from folder
let Users        = require(path.resolve(__dirname, 'users'));

let Menus        = require(path.resolve(__dirname, 'menus'));

let Recipes      = require(path.resolve(__dirname, 'recipes'));

let IngrEx       = require(path.resolve(__dirname, 'ingredients'));
let Recipes2 	= require(path.resolve(__dirname, 'recipes-extended'));

let Department = require(path.resolve(__dirname, '../grocery/departments'));


let options = {
	server: server,
	database: database,
	raven: raven
}

async.parallel({
		users       : async.apply(helper.create, options, Users),
		recipes     : async.apply(helper.create, options, Recipes),
		menus       : async.apply(helper.create, options, Menus),

		// for recipes 2
		ingrEx     : async.apply(helper.create, options, IngrEx),


	}, function(err, results){
		if( err ) {
			raven.captureException(err);
			throw err;

		}

		if( !results || !results.users || !results.recipes || !results.menus ) {
			raven.captureException("not imported well");
		}

		// console.log(err);
		// console.log(results);

		// console.log('123')
		Users.assignAdmin(options, results.users[2].id);
		// console.log('333')
    //
		// // @TODO make this call less shitty
		Menus.relate( options, results, helper );


		//@TODO attach groceries to users will be moved to a next stages



		// imported recipes for search data
		helper.create(options, Recipes2, (err, data) => {
			console.log(data);
		});

		const meatDepartments = Department.get().filter(department => {	
			return department.name === "Meat";
		})
		options.predata = meatDepartments;

		// options.predata = await Department.get().find({ where: {
		// 	name: 'Meat'
		// }});
		// console.log(options.predata);


		// place where we'll attach ingredients with recipes
		// pass department id
		helper.create(options, IngrEx, (err, data) => {
			console.log(data);
		});


		console.log('import finished');
		// process.on('exit', function(code) {
    // 	return console.log(`About to exit with code ${code}`);
		// });
		// process.exit(22);

	}

);
// process.exit(-1);
