// Copyright 2002-2015, University of Colorado Boulder

/**
 * Type that represents a residual Line and Square in the view.
 *
 * @author John Blanco
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules

  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LSRConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );

  /**
   *
   * @param {Property.<Residual>} residualProperty
   * @param {Object} lineColor
   * @param {Bounds2} viewBounds
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property.<boolean>} lineVisibilityProperty
   * @param {Property.<boolean>} squareVisibilityProperty
   * @constructor
   */
  function ResidualLineAndSquareNode( residualProperty, lineColor, viewBounds, modelViewTransform, lineVisibilityProperty, squareVisibilityProperty ) {
    Node.call( this );

    var squareResidual = new Rectangle( 0, 0, 1, 1, {fill: lineColor.SQUARED_RESIDUAL_COLOR} );
    var lineResidual = new Line( 0, 0, 1, 1, {stroke: lineColor.RESIDUAL_COLOR, lineWidth: LSRConstants.RESIDUAL_LINE_WIDTH} );

    /**
     * Update the Line and Square Residual
     */
    function updateLineAndSquare() {
      var point1 = modelViewTransform.modelToViewPosition( residualProperty.value.point1 );
      var point2 = modelViewTransform.modelToViewPosition( residualProperty.value.point2 );

      // update line residual
      lineResidual.setPoint1( point1 );
      lineResidual.setPoint2( point2 );
      // the line residual should not show outside the graph.
      lineResidual.clipArea = Shape.bounds( viewBounds );

      // update square residual

      var top = Math.min( point1.y, point2.y );
      var height = Math.abs( point1.y - point2.y );
      // we want a square
      var width = height;

      // the square residual can be on the left or on the right of point1 (the dataPoint position)
      // however the square residual should not overlap with the y = m x + b line:
      var left = (residualProperty.value.isSquaredResidualToTheLeft) ? point1.x - width : point1.x;

      squareResidual.setRect( left, top, width, height );
      // the squareResidual should not show outside the graph.
      squareResidual.clipArea = Shape.bounds( viewBounds );
    }

    updateLineAndSquare();

    this.addChild( squareResidual );
    this.addChild( lineResidual );

    //TODO: MEMORY LEAK ISSUE?
    lineVisibilityProperty.linkAttribute( lineResidual, 'visible' );
    squareVisibilityProperty.linkAttribute( squareResidual, 'visible' );

    residualProperty.link( function() {
        updateLineAndSquare();
      }
    );


  }

  return inherit( Node, ResidualLineAndSquareNode );
} );