// Copyright 2002-2014, University of Colorado Boulder


define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  // var LSRConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Range = require( 'DOT/Range' );

  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var sumString = require( 'string!LEAST_SQUARES_REGRESSION/sum' );

  var pattern_0sign_1intercept = " {0}{1} ";

  // constants

  var RECTANGLE_BAROMETER_HEIGHT = 10;
  var LINE_WIDTH = 1;
  var FONT = new PhetFont( 12 );

  /**
   *
   * @param {number} sumOfSquaredResiduals
   * @param {Color} fillColor
   * @param {Property Boolean} visibleProperty
   * @constructor
   */
  function SumOfSquaredResidualsChart( model, getSumOfSquaredResiduals, fillColor, visibleProperty ) {

    Node.call( this );
    var self = this;

    // the barometer is on its side
    var width = getSumOfSquaredResiduals();
    var rectangleBarometer = new Rectangle( 0, 0, width, RECTANGLE_BAROMETER_HEIGHT, { fill: fillColor } );

    var l = 1;
    var horizontalArrow = new ArrowNode( 0, 0, 120, 0, {tailWidth: LINE_WIDTH, headWidth: 4, headHeight: 6 } );
    var verticalLine = new Line( 0, 0, 0, -2 * RECTANGLE_BAROMETER_HEIGHT, {lineWidth: LINE_WIDTH, stroke: 'black' } );
    this.addChild( verticalLine );
    this.addChild( horizontalArrow );
    this.addChild( rectangleBarometer );
    rectangleBarometer.bottom = -LINE_WIDTH;
    rectangleBarometer.left = LINE_WIDTH;

    var label = new Text( sumString, {font: FONT, centerX: horizontalArrow.centerX, top: horizontalArrow.bottom + 5} );
    var zeroLabel = new Text( '0', {font: FONT, centerX: horizontalArrow.left, top: horizontalArrow.bottom + 5} );
    this.addChild( zeroLabel );
    this.addChild( label );


    Property.multilink( [ model.graph.angleProperty, model.graph.interceptProperty], function( angle, intercept ) {
      rectangleBarometer.rectWidth = getSumOfSquaredResiduals();
    } );

    // Handle the comings and goings of  dataPoints.
    model.dataPoints.addItemAddedListener( function( addedDataPoint ) {
      addedDataPoint.positionProperty.link( function() {
        rectangleBarometer.rectWidth = getSumOfSquaredResiduals();
      } );
    } );


    visibleProperty.linkAttribute( this, 'visible' );
  }

  return inherit( Node, SumOfSquaredResidualsChart );
} );