// Copyright 2002-2014, University of Colorado Boulder

/**
 * View representation of a Graph, which is a graph where points
 * can be placed.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  // var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
//  var LSRConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Line = require( 'SCENERY/nodes/Line' );
  // var Path = require( 'SCENERY/nodes/Path' );
  var Panel = require( 'SUN/Panel' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Util = require( 'DOT/Util' );
  var Text = require( 'SCENERY/nodes/Text' );

  // string
  var pattern_0r_1value = "{0} {1}";

  /**
   *
   * @param graph
   * @param model
   * @param modelViewTransform
   * @constructor
   */
  function GraphNode( graph, model, modelViewTransform ) {
    this.graph = graph;
    this.modelViewTransform = modelViewTransform;
    Node.call( this );

    // Create and add the graph itself.

    this.viewBounds = new Bounds2( 200, 50, 550, 450 );
    var graphNode = Rectangle.bounds( this.viewBounds, { fill: 'white', stroke: 'gray' } );
    this.addChild( graphNode );


    var boundaryPoints = graph.getBoundaryPoints( graph.slopeProperty.value, graph.intercept );
    var line = new Line(
      modelViewTransform.modelToViewPosition( boundaryPoints[0] ),
      modelViewTransform.modelToViewPosition( boundaryPoints[1] ),
      { stroke: 'blue', lineWidth: 2 } );
    this.addChild( line );


    var linearFitParameters = graph.getLinearFit();
    var bestBoundaryPoints = graph.getBoundaryPoints( linearFitParameters.slope, linearFitParameters.intercept );
    this.bestFitLine = new Line(
      modelViewTransform.modelToViewPosition( bestBoundaryPoints[0] ),
      modelViewTransform.modelToViewPosition( bestBoundaryPoints[1] ),
      {stroke: 'red', lineWidth: 2} );
    this.addChild( this.bestFitLine );

    Property.multilink( [ graph.slopeProperty, graph.interceptProperty], function( slope, intercept ) {
      var boundaryPoints = graph.getBoundaryPoints( slope, intercept );
      line.setPoint1( modelViewTransform.modelToViewPosition( boundaryPoints[0] ) );
      line.setPoint2( modelViewTransform.modelToViewPosition( boundaryPoints[1] ) );
    } );

    this.equationText = new Text( '**********' );
    var mutableEquationText = new Panel( this.equationText, { fill: 'white', cornerRadius: 2, resize: false } );
    mutableEquationText.bottom = graphNode.bottom - 10;
    mutableEquationText.right = graphNode.right - 10;
    this.addChild( mutableEquationText );

  }

  return inherit( Node, GraphNode, {
    update: function() {
      this.updatePearsonCoefficient();
      this.updateBestFitLine();
    },

    updatePearsonCoefficient: function() {
      var rText = Util.toFixedNumber( this.graph.getPearsonCoefficientCorrelation(), 2 );
      this.equationText.text = StringUtils.format( pattern_0r_1value, 'r =', rText );
    },
    updateResiduals: function() {

    },

    updateSquaredResiduals: function() {


    },

    updateBestFitLine: function() {
      var linearFitParameters = this.graph.getLinearFit();
      var boundaryPoints = this.graph.getBoundaryPoints( linearFitParameters.slope, linearFitParameters.intercept );
      this.bestFitLine.setPoint1( this.modelViewTransform.modelToViewPosition( boundaryPoints[0] ) );
      this.bestFitLine.setPoint2( this.modelViewTransform.modelToViewPosition( boundaryPoints[1] ) );
    }




  } );
} );