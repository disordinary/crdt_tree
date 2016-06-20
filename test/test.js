var CRDT = require('../index.js');

var assert = require("assert");
var util = require('util');


describe( "CRDT" , ( ) => {
	it( "add a string to crdt" , ( done ) => {
		let crdt = new CRDT( "A VERY VERY LONG STRING, I TI S SO LONG THAT IT... WELL IT'S NOT SO LONG" );
		console.log( crdt.toString() );
		crdt.insert( 10 , "1");
		//console.log( util.inspect( crdt , { depth : 100 } ) );

	//	console.log( crdt.toString() );
		crdt.insert( 3 , "2" , true);
		crdt.insert( 8 , "3" , true);
		crdt.insert( 10 , "4" , true);
		
		//crdt.split( 1 );

		
		//console.log( crdt.get( 1 ) );
		console.log( crdt.toString() );
		done( );
	});
});