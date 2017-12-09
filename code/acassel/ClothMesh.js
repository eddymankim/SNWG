	

import * as T from '../acassel/module.js'

export default class ClothMesh {
	constructor({ }) { // geometry=new T.SphereGeometry(1,16,16)

		// Physics variables
		var gravityConstant = -9.8;
		var physicsWorld;
		var rigidBodies = [];
		var margin = 0.05;
		var hinge;
		var cloth;
		var transformAux1 = new Ammo.btTransform();
		var time = 0;
		var armMovement = 0;

		var collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
		var dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
		var broadphase = new Ammo.btDbvtBroadphase();
		var solver = new Ammo.btSequentialImpulseConstraintSolver();
		var softBodySolver = new Ammo.btDefaultSoftBodySolver();
		physicsWorld = new Ammo.btSoftRigidDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration, softBodySolver);
		physicsWorld.setGravity( new Ammo.btVector3( 0, gravityConstant, 0 ) );
		physicsWorld.getWorldInfo().set_m_gravity( new Ammo.btVector3( 0, gravityConstant, 0 ) );

		var clothWidth = 4;
		var clothHeight = 3;
		var clothNumSegmentsZ = clothWidth * 5;
		var clothNumSegmentsY = clothHeight * 5;
		var clothSegmentLengthZ = clothWidth / clothNumSegmentsZ;
		var clothSegmentLengthY = clothHeight / clothNumSegmentsY;
		var clothPos = new T.Vector3( -3, 3, 2 );
		//var clothGeometry = new T.BufferGeometry();
		var clothGeometry = new T.SphereBufferGeometry( clothWidth, clothNumSegmentsZ, clothNumSegmentsY );
		clothGeometry.rotateY( Math.PI * 0.5 );
		clothGeometry.translate( clothPos.x, clothPos.y + clothHeight * 0.5, clothPos.z - clothWidth * 0.5 );
		//var clothMaterial = new T.MeshLambertMaterial( { color: 0x0030A0, side: T.DoubleSide } );
		var clothMaterial = new T.MeshLambertMaterial( { color: 0xFFFFFF, side: T.DoubleSide } );
		cloth = this.cloth = new T.Mesh( clothGeometry, clothMaterial );
		cloth.scale.set(100,100,100)
		cloth.castShadow = true;
		cloth.receiveShadow = true;
		// scene.add( cloth );
		// textureLoader.load( "textures/grid.png", function( texture ) {
		// 	texture.wrapS = T.RepeatWrapping;
		// 	texture.wrapT = T.RepeatWrapping;
		// 	texture.repeat.set( clothNumSegmentsZ, clothNumSegmentsY );
		// 	cloth.material.map = texture;
		// 	cloth.material.needsUpdate = true;
		// } );
		// Cloth physic object
		var softBodyHelpers = new Ammo.btSoftBodyHelpers();
		var clothCorner00 = new Ammo.btVector3( clothPos.x, clothPos.y + clothHeight, clothPos.z );
		var clothCorner01 = new Ammo.btVector3( clothPos.x, clothPos.y + clothHeight, clothPos.z - clothWidth );
		var clothCorner10 = new Ammo.btVector3( clothPos.x, clothPos.y, clothPos.z );
		var clothCorner11 = new Ammo.btVector3( clothPos.x, clothPos.y, clothPos.z - clothWidth );
		var clothSoftBody = softBodyHelpers.CreatePatch( physicsWorld.getWorldInfo(), clothCorner00, clothCorner01, clothCorner10, clothCorner11, clothNumSegmentsZ + 1, clothNumSegmentsY + 1, 0, true );
		var sbConfig = clothSoftBody.get_m_cfg();
		sbConfig.set_viterations( 10 );
		sbConfig.set_piterations( 10 );
		clothSoftBody.setTotalMass( 0.9, false );
		Ammo.castObject( clothSoftBody, Ammo.btCollisionObject ).getCollisionShape().setMargin( margin * 3 );
		physicsWorld.addSoftBody( clothSoftBody, 1, -1 );
		cloth.userData.physicsBody = clothSoftBody;
		// Disable deactivation
		clothSoftBody.setActivationState( 4 );



		function createParalellepiped( sx, sy, sz, mass, pos, quat, material ) {

			var threeObject = new T.Mesh( new T.BoxGeometry( sx, sy, sz, 1, 1, 1 ), material );
			var shape = new Ammo.btBoxShape( new Ammo.btVector3( sx * 0.5, sy * 0.5, sz * 0.5 ) );
			shape.setMargin( margin );

			createRigidBody( threeObject, shape, mass, pos, quat );

			return threeObject;

		}

		function createRigidBody( threeObject, physicsShape, mass, pos, quat ) {

			threeObject.position.copy( pos );
			threeObject.quaternion.copy( quat );

			var transform = new Ammo.btTransform();
			transform.setIdentity();
			transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
			transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
			var motionState = new Ammo.btDefaultMotionState( transform );

			var localInertia = new Ammo.btVector3( 0, 0, 0 );
			physicsShape.calculateLocalInertia( mass, localInertia );

			var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, physicsShape, localInertia );
			var body = new Ammo.btRigidBody( rbInfo );

			threeObject.userData.physicsBody = body;

			// scene.add( threeObject );

			if ( mass > 0 ) {
				rigidBodies.push( threeObject );

				// Disable deactivation
				body.setActivationState( 4 );
			}

			physicsWorld.addRigidBody( body );

		}


		var pos = new T.Vector3();
		var quat = new T.Quaternion();
		var armMass = 2;
		var armLength = 3 + clothWidth;
		var pylonHeight = clothPos.y + clothHeight;
		var baseMaterial = new T.MeshPhongMaterial( { color: 0x606060 } );
		pos.set( clothPos.x, 0.1, clothPos.z - armLength );
		quat.set( 0, 0, 0, 1 );
		var base = createParalellepiped( 1, 0.2, 1, 0, pos, quat, baseMaterial );
		base.castShadow = true;
		base.receiveShadow = true;
		pos.set( clothPos.x, 0.5 * pylonHeight, clothPos.z - armLength );
		var pylon = createParalellepiped( 0.4, pylonHeight, 0.4, 0, pos, quat, baseMaterial );
		pylon.castShadow = true;
		pylon.receiveShadow = true;
		pos.set( clothPos.x, pylonHeight + 0.2, clothPos.z - 0.5 * armLength );
		var arm = createParalellepiped( 0.4, 0.4, armLength + 0.4, armMass, pos, quat, baseMaterial );
		arm.castShadow = true;
		arm.receiveShadow = true;

		// Glue the cloth to the arm
		var influence = 0.5;
		clothSoftBody.appendAnchor( 0, arm.userData.physicsBody, false, influence );
		clothSoftBody.appendAnchor( clothNumSegmentsZ, arm.userData.physicsBody, false, influence );

		// Hinge constraint to move the arm
		var pivotA = new Ammo.btVector3( 0, pylonHeight * 0.5, 0 );
		var pivotB = new Ammo.btVector3( 0, -0.2, - armLength * 0.5 );
		var axis = new Ammo.btVector3( 0, 1, 0 );
		hinge = new Ammo.btHingeConstraint( pylon.userData.physicsBody, arm.userData.physicsBody, pivotA, pivotB, axis, axis, true );
		physicsWorld.addConstraint( hinge, true );



		const update = this.update = (dt) => {
			// Hinge control
			hinge.enableAngularMotor( true, 0.8 * armMovement, 50 );
			// Step world
			physicsWorld.stepSimulation( dt, 10 );
			// Update cloth
			var softBody = cloth.userData.physicsBody;
			var clothPositions = cloth.geometry.attributes.position.array;
			var numVerts = clothPositions.length / 3;
			var nodes = softBody.get_m_nodes();
			var indexFloat = 0;
			for ( var i = 0; i < numVerts; i ++ ) {
				var node = nodes.at( i );
				var nodePos = node.get_m_x();
				clothPositions[ indexFloat++ ] = nodePos.x();
				clothPositions[ indexFloat++ ] = nodePos.y();
				clothPositions[ indexFloat++ ] = nodePos.z();
			}
			cloth.geometry.computeVertexNormals();
			cloth.geometry.attributes.position.needsUpdate = true;
			cloth.geometry.attributes.normal.needsUpdate = true;
			// Update rigid bodies
			for ( var i = 0, il = rigidBodies.length; i < il; i++ ) {
				var objT = rigidBodies[ i ];
				var objPhys = objT.userData.physicsBody;
				var ms = objPhys.getMotionState();
				if ( ms ) {
					ms.getWorldTransform( transformAux1 );
					var p = transformAux1.getOrigin();
					var q = transformAux1.getRotation();
					objT.position.set( p.x(), p.y(), p.z() );
					objT.quaternion.set( q.x(), q.y(), q.z(), q.w() );
				}
			}
		}

		// window.addEventListener('load', this.init, false)

	}
}
