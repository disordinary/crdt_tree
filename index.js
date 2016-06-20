var util = require('util');

const START_STRING = String.fromCharCode(2);
const END_STRING = String.fromCharCode(3)
var _debug = false;
//factory to generate CRDT
function CRDT( str ) {
	return new Node( START_STRING + str + END_STRING ); //actually split left right
}

class Node {
	constructor( left , right , id , parent ) {
		if( !right && typeof left === 'string' ) {
			this.left = new Leaf( left.substr( 0 , left.length / 2 )  , 0 );
			this.right = new Leaf( left.substr( left.length / 2 )  , left.length / 2  );
			this.length = this.left.length;
		} else {
			this.left = left;
			this.right = right;
			this.length = this.left ? this.left.length : 0 + this.right ? this.right.length : 0;
		}
		this.parent = parent;
		
		this.id = id || 0;	
	}

	split( offset  , length ) {

		length = length || offset;
	//	if(_debug)console.log( offset , this.left.length );
		if( offset < this.left.length ) {
			
			if( this.left instanceof Leaf) {
				let lx = this.left.split( offset  , length);
				this.left = new Node( lx.left, lx.right , length - offset , this );
				return this.left;
			}
			return this.left.split( offset , length );
			
		} else {
			
			if( this.right instanceof Leaf ) {
				let lx = this.right.split( offset - this.left.length , length );
				this.right = new Node( lx.left , lx.right , length - offset , this );
				return this.right
			}
			this.right.split( offset - this.left.length , length );
			
			
		}
		//if(_debug) console.log( this.left );
		
		
	}
	insert( offset , character , debug ) {
		_debug = debug;
		let res = this.split( offset );
		//if( _debug ) console.log( res.left.left.left );
		console.log( res.left );
		res.left = new Node( res.left , new Leaf( character , ( ( res.right.id - res.left.id + res.left.length ) / 2 ) ) ,res.left.id , this );
		
	}

	get( offset ) {
		console.log( offset , this.left.id , this.right.id )
		if( offset >= this.left.id && offset < this.right.id ) {
		//	console.log( "GET LEFT ");
			return this.left.get( offset );
		} else {
			return this.right.get( offset - this.left.length );
		}
	}

	toString( ) {
		return this.left.toString() + this.right.toString();
	}
}

class Leaf {
	constructor( str  , id ) {
		this.id = id; //the number of order, could be 1, 2, 3, 3.5, 3.75, 3.88, 3.94, 3.9699999999999998, 3.985, 4
		this.str = str;
		this.length = str.length;
	}

	split( offset , length ) {
		let left = null, right = null;

		
		left = new Leaf( this.str.substr( 0 , offset ) ,  length - offset ),
		right = new Leaf( this.str.substr( offset )  ,  length + 1)
		//console.log( left , right );
		return { 
			left, right
		}
	}
	get( ) {
		return this;
	}
	toString() {
		return this.str;
	}
}


module.exports = CRDT;