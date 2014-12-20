/*
 * Copyright 2002-2014, University of Colorado Boulder
 */

/**
 * Type that represents a static dataPoint in the view.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules

  var Circle = require( 'SCENERY/nodes/Circle' );
  var DataPointNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/DataPointNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LSRConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );

  /**
   * @param {DataPoint} dataPoint
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function StaticDataPointNode( dataPoint, modelViewTransform ) {
    DataPointNode.call( this, dataPoint, modelViewTransform );

    var representation = new Circle( LSRConstants.STATIC_DATA_POINT_RADIUS, {
      fill: LSRConstants.STATIC_DATA_POINT_FILL,
      stroke: LSRConstants.STATIC_DATA_POINT_STROKE,
      lineWidth: LSRConstants.STATIC_DATA_POINT_LINE_WIDTH
    } );

    this.addChild( representation );
  }

  return inherit( DataPointNode, StaticDataPointNode );
} );