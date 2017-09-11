// Copyright 2014-2015, University of Colorado Boulder

/**
 * View representation of a Graph. Responsible for the view of 'MyLine', 'BestFitLine'
 * and the residuals on the graph. The view of the dataPoints is handled in the main ScreenView
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var leastSquaresRegression = require( 'LEAST_SQUARES_REGRESSION/leastSquaresRegression' );
  var LeastSquaresRegressionConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var ResidualLineAndSquareNode = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/view/ResidualLineAndSquareNode' );
  var Shape = require( 'KITE/Shape' );

  /**
   *
   * @param {Graph} graph
   * @param {Bounds2} viewBounds
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function GraphNode( graph, viewBounds, modelViewTransform ) {
    var self = this;

    this.graph = graph;
    this.viewBounds = viewBounds;
    this.modelViewTransform = modelViewTransform;

    Node.call( this );

    // Create 'MyLine'
    // First, get the two points formed by the intersection of the line and the boundary of the graph
    var myLineBoundaryPoints = graph.getBoundaryPoints( graph.slope( graph.angleProperty.value ), graph.interceptProperty.value );
    this.myLine = new Line(
      modelViewTransform.modelToViewPosition( myLineBoundaryPoints.point1 ),
      modelViewTransform.modelToViewPosition( myLineBoundaryPoints.point2 ),
      {
        stroke: LeastSquaresRegressionConstants.MY_LINE_COLOR.BASE_COLOR,
        lineWidth: LeastSquaresRegressionConstants.LINE_WIDTH
      } );

    // Create 'Best Fit Line'; initially set bestFitLine to zero length and then update it
    this.bestFitLine = new Line( 0, 0, 0, 0, {
      stroke: LeastSquaresRegressionConstants.BEST_FIT_LINE_COLOR.BASE_COLOR,
      lineWidth: LeastSquaresRegressionConstants.LINE_WIDTH
    } );

    if ( graph.isLinearFitDefined() ) {
      var linearFitParameters = graph.getLinearFit();
      var bestFitLineBoundaryPoints = graph.getBoundaryPoints( linearFitParameters.slope, linearFitParameters.intercept );
      this.bestFitLine = new Line(
        modelViewTransform.modelToViewPosition( bestFitLineBoundaryPoints.point1 ),
        modelViewTransform.modelToViewPosition( bestFitLineBoundaryPoints.point2 ),
        {
          stroke: LeastSquaresRegressionConstants.BEST_FIT_LINE_COLOR.BASE_COLOR,
          lineWidth: LeastSquaresRegressionConstants.LINE_WIDTH
        } );
    }

    // Update 'MyLine' and update 'MyLine' Residuals upon of change of angle (a proxy for the slope), or intercept
    // No need to unlink, listener is present for the lifetime of the sim
    Property.multilink( [ graph.angleProperty, graph.interceptProperty ], function( angle, intercept ) {
      var slope = graph.slope( angle );
      updateMyLine( slope, intercept );
      graph.updateMyLineResiduals();
    } );

    // we will add all the residuals in a separate node
    var residualsLayer = new Node();

    // we need to track the best fit residuals in a separate array so that we can toggle their visibility when
    // the best fit is undefined
    this.bestFitResiduals = [];

    // Handle the comings and goings of 'My Line' Residuals. Recall that graph.myLineResiduals is an
    // observable array of Property.<Residual>
    graph.myLineResiduals.addItemAddedListener( function( addedResidualProperty ) {

      // Create and add the view representation for this residual.
      var residualNode = ResidualLineAndSquareNode.createFromPool(
        addedResidualProperty,
        LeastSquaresRegressionConstants.MY_LINE_COLOR,
        self.viewBounds,
        modelViewTransform,
        graph.myLineResidualsVisibleProperty,
        graph.myLineSquaredResidualsVisibleProperty );
      residualsLayer.addChild( residualNode );

      // Add the removal listener for if and when this residual is removed from the model.
      graph.myLineResiduals.addItemRemovedListener( function removalListener( removedResidualProperty ) {
        if ( removedResidualProperty === addedResidualProperty ) {
          residualNode.release();
          residualsLayer.removeChild( residualNode );
          graph.myLineResiduals.removeItemRemovedListener( removalListener );
        }
      } );
    } );

    // Handle the comings and goings of Best Fit Line Residuals. Recall that graph.bestFitResiduals is an
    // observable array of Property.<Residual>
    graph.bestFitLineResiduals.addItemAddedListener( function( addedResidualProperty ) {

      // Create and add the view representation for this residual.
      var residualNode = ResidualLineAndSquareNode.createFromPool(
        addedResidualProperty,
        LeastSquaresRegressionConstants.BEST_FIT_LINE_COLOR,
        self.viewBounds,
        modelViewTransform,
        graph.bestFitLineResidualsVisibleProperty,
        graph.bestFitLineSquaredResidualsVisibleProperty );
      residualsLayer.addChild( residualNode );

      self.bestFitResiduals.push( residualNode );

      // Add the removal listener for if and when this residual is removed from the model.
      graph.bestFitLineResiduals.addItemRemovedListener( function removalListener( removedResidualProperty ) {
        if ( removedResidualProperty === addedResidualProperty ) {

          // remove the residualNode from this.bestFitResiduals
          var index = self.bestFitResiduals.indexOf( residualNode );
          if( index > -1 ) {
            self.bestFitResiduals.splice( index, 1 );
          }

          residualNode.release();
          residualsLayer.removeChild( residualNode );
        }
      } );
    } );

    // Hide or show the visibility of 'MyLine' and 'BestFitLine', both listeners are present for the lifetime of the sim
    graph.myLineVisibleProperty.linkAttribute( this.myLine, 'visible' );
    graph.bestFitLineVisibleProperty.linkAttribute( this.bestFitLine, 'visible' );

    // Add the residuaslLayer
    this.addChild( residualsLayer );

    // Add the two lines to this Node
    this.addChild( this.myLine );
    this.addChild( this.bestFitLine );


    /**
     * Update 'My Line'
     * @param {number} slope
     * @param {number} intercept
     */
    function updateMyLine( slope, intercept ) {
      var boundaryPoints = graph.getBoundaryPoints( slope, intercept );
      self.myLine.setPoint1( modelViewTransform.modelToViewPosition( boundaryPoints.point1 ) );
      self.myLine.setPoint2( modelViewTransform.modelToViewPosition( boundaryPoints.point2 ) );
      self.myLine.clipArea = Shape.bounds( self.viewBounds );
    }

  }

  leastSquaresRegression.register( 'GraphNode', GraphNode );

  return inherit( Node, GraphNode, {
    reset: function() {
      this.updateBestFitLine();
    },

    update: function() {
      this.updateBestFitLine();

      // make sure that the best fit residuals are only visible when the best fit line is defined
      this.updateBestFitResidualsVisible();
    },
    /**
     * Update Best Fit Line
     * @private
     */
    updateBestFitLine: function() {
      if ( this.graph.isLinearFitDefined() ) {
        var linearFitParameters = this.graph.getLinearFit();
        var boundaryPoints = this.graph.getBoundaryPoints( linearFitParameters.slope, linearFitParameters.intercept );
        this.bestFitLine.setPoint1( this.modelViewTransform.modelToViewPosition( boundaryPoints.point1 ) );
        this.bestFitLine.setPoint2( this.modelViewTransform.modelToViewPosition( boundaryPoints.point2 ) );
        this.bestFitLine.clipArea = Shape.bounds( this.viewBounds );
      }
      else {
        this.bestFitLine.setPoint1( 0, 0 ); // set line in the upper left corner
        this.bestFitLine.setPoint2( 0, 0 ); // of length zero
      }
    },

    /**
     * Make sure that the best fit residuals and squares are only visible if the linear fit is defined.
     * This visibility is separate from the visibility handled by the control panel
     */
    updateBestFitResidualsVisible: function() {
      for( var i = 0; i < this.bestFitResiduals.length; i++ ) {
        this.bestFitResiduals[ i ].visible = this.graph.isLinearFitDefined();
      }
    }

  } );
} );