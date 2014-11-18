// Copyright 2002-2014, University of Colorado Boulder

/**
 * A Scenery node that depicts a grid icon.
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  // var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function GridIcon( options ) {

    Node.call( this );

    options = _.extend( {
      // defaults
      columns: 4,
      rows: 4,
      cellLength: 10,
      gridStroke: 'black',
      gridLineWidth: 1,
      gridFill: null
    }, options );


    var bounds = new Bounds2( 0, 0, options.columns * options.cellLength, options.rows * options.cellLength );
    var gridShape = new Shape();

    // Add the vertical lines
    for ( var i = bounds.minX + options.cellLength; i < bounds.minX + bounds.width; i += options.cellLength ) {
      gridShape.moveTo( i, bounds.minY );
      gridShape.lineTo( i, bounds.minY + bounds.height );
    }

    // Add the horizontal lines
    for ( i = bounds.minY + options.cellLength; i < bounds.minY + bounds.height; i += options.cellLength ) {
      gridShape.moveTo( bounds.minX, i );
      gridShape.lineTo( bounds.minX + bounds.width, i );
    }

    var gridPath = new Path( gridShape, {
      stroke: options.gridStroke,
      lineWidth: options.gridLineWidth,
      fill: options.gridFill
    } );

    this.addChild( gridPath );


    // Pass options through to the parent class.
    this.mutate( options );
  }

  return inherit( Node, GridIcon );
} )
;