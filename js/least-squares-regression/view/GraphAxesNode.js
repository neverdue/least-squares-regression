// Copyright 2002-2014, University of Colorado Boulder

/**
 * Base type for graphs, displays a 2D grid and axes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules

  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LSRConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  //----------------------------------------------------------------------------------------
  // constants
  //----------------------------------------------------------------------------------------

  // background

  var GRID_BACKGROUND_FILL = 'white';
  var GRID_BACKGROUND_LINE_WIDTH = '0.5'; // for the border of graph
  var GRID_BACKGROUND_STROKE = 'gray';

  // grid

  var MAJOR_GRID_LINE_WIDTH = 0.75;
  var MAJOR_GRID_LINE_COLOR = LSRConstants.MAJOR_GRID_STROKE_COLOR;
  var MINOR_GRID_LINE_WIDTH = 0.35;
  var MINOR_GRID_LINE_COLOR = LSRConstants.MINOR_GRID_STROKE_COLOR;


  // axes

  var AXIS_COLOR = 'black';
  var AXIS_EXTENT = 0.0; // how far the line extends past the min/max ticks, in model coordinates

  // labels
  var AXIS_LABEL_FONT = LSRConstants.TEXT_FONT_BOLD;
  var AXIS_LABEL_COLOR = 'black'; // space between end of axis and label

  // ticks
  var MINOR_TICK_LENGTH = 3; // how far a minor tick extends from the axis
  var MINOR_TICK_LINE_WIDTH = 0.5;
  var MINOR_TICK_COLOR = 'black';
  var MAJOR_TICK_LENGTH = 6; // how far a major tick extends from the axis
  var MAJOR_TICK_LINE_WIDTH = 1;
  var MAJOR_TICK_COLOR = 'black';
  var MAJOR_TICK_FONT = LSRConstants.MAJOR_TICK_FONT;
  var TICK_LABEL_SPACING = 2;
  var MINUS_SIGN_WIDTH = new Text( '\u2212', {font: MAJOR_TICK_FONT} ).width;

  var SMALL_EPSILON = 0.0000001; // for equalEpsilon check
  //----------------------------------------------------------------------------------------
  // A major or minor line in the grid
  //----------------------------------------------------------------------------------------

  // Line goes from (x1,y1) to (x2,y2), and is either a major or minor grid line.
  function GridLineNode( x1, y1, x2, y2, isMajor ) {
    Line.call( this, x1, y1, x2, y2, {
      lineWidth: isMajor ? MAJOR_GRID_LINE_WIDTH : MINOR_GRID_LINE_WIDTH,
      stroke: isMajor ? MAJOR_GRID_LINE_COLOR : MINOR_GRID_LINE_COLOR
    } );
  }

  inherit( Line, GridLineNode );

  //----------------------------------------------------------------------------------------
  // major tick with label, orientation is vertical or horizontal
  //----------------------------------------------------------------------------------------

  // Tick is placed at (x,y) and is either vertical or horizontal.
  function MajorTickNode( x, y, value, isVertical ) {

    Node.call( this );

    // tick line
    var tickLineNode = new Path( isVertical ?
                                 Shape.lineSegment( x, y - MAJOR_TICK_LENGTH, x, y + MAJOR_TICK_LENGTH ) :
                                 Shape.lineSegment( x - MAJOR_TICK_LENGTH, y, x + MAJOR_TICK_LENGTH, y ), {
      stroke: MAJOR_TICK_COLOR,
      lineWidth: MAJOR_TICK_LINE_WIDTH
    } );
    this.addChild( tickLineNode );

    // tick label
    var tickLabelNode = new Text( value, {font: MAJOR_TICK_FONT, fill: MAJOR_TICK_COLOR} );
    this.addChild( tickLabelNode );

    // label position
    if ( isVertical ) {
      // center label under line, compensate for minus sign
      var signXOffset = ( value < 0 ) ? -( MINUS_SIGN_WIDTH / 2 ) : 0;
      tickLabelNode.left = tickLineNode.centerX - ( tickLabelNode.width / 2 ) + signXOffset;
      tickLabelNode.top = tickLineNode.bottom + TICK_LABEL_SPACING;
    }
    else {
      // center label to left of line
      tickLabelNode.right = tickLineNode.left - TICK_LABEL_SPACING;
      tickLabelNode.centerY = tickLineNode.centerY;
    }
  }

  inherit( Node, MajorTickNode );

  //----------------------------------------------------------------------------------------
  // minor tick mark, no label, orientation is vertical or horizontal
  //----------------------------------------------------------------------------------------

  // Tick is placed at (x,y) and is either vertical or horizontal
  function MinorTickNode( x, y, isVertical ) {
    Path.call( this, isVertical ?
                     Shape.lineSegment( x, y - MINOR_TICK_LENGTH, x, y + MINOR_TICK_LENGTH ) :
                     Shape.lineSegment( x - MINOR_TICK_LENGTH, y, x + MINOR_TICK_LENGTH, y ), {
      lineWidth: MINOR_TICK_LINE_WIDTH,
      stroke: MINOR_TICK_COLOR
    } );
  }

  inherit( Path, MinorTickNode );

  //--------------
  // Tick Spacing for major and minor ticks
  //--------------

  function tickSpacing( range ) {
    var width = range.max - range.min;
    var logOfWidth = Math.log10( width );
    var exponent = Math.floor( logOfWidth ); // width = mantissa*10^exponent
    var mantissa = Math.pow( 10, logOfWidth - exponent );// mantissa  ranges from 1 to 10;

    var majorBaseMultiple;
    var minorTicksPerMajor;

    // on a graph there should be minimum of 4 major ticks mark and a maximum of 8.
    if ( mantissa >= 6.5 ) {
      majorBaseMultiple = 2;
      minorTicksPerMajor = 4;
    }
    else if ( mantissa >= 3.2 ) {
      majorBaseMultiple = 1;
      minorTicksPerMajor = 5;
    }
    else if ( mantissa >= 1.55 ) {
      majorBaseMultiple = 0.5;
      minorTicksPerMajor = 5;
    }
    else {
      majorBaseMultiple = 0.2;
      minorTicksPerMajor = 4;
    }

    var majorTickSpacing = majorBaseMultiple * Math.pow( 10, exponent );
    var minorTickSpacing = majorBaseMultiple * Math.pow( 10, exponent ) / minorTicksPerMajor;
    var startPositionTick = Math.ceil( range.min / minorTickSpacing ) * minorTickSpacing;
    var stopPositionTick = Math.floor( range.max / minorTickSpacing ) * minorTickSpacing;
    var numberOfTicks = (stopPositionTick - startPositionTick) / minorTickSpacing + 1;
    var decimalPlaces = majorTickSpacing > 1 ? 0 : -1 * Math.log10( majorTickSpacing ) + 1;

    var tickSeparation = {
      majorTickSpacing: majorTickSpacing,
      minorTickSpacing: minorTickSpacing,
      minorTicksPerMajor: minorTicksPerMajor,
      startPositionTick: startPositionTick,
      stopPositionTick: stopPositionTick,
      numberOfTicks: numberOfTicks,
      decimalPlaces: decimalPlaces
    };
    return tickSeparation;
  }

  //----------------------------------------------------------------------------------------
  // x-axis (horizontal)
  //----------------------------------------------------------------------------------------

  /**
   * @param {Graph} graph
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function XAxisNode( graph, modelViewTransform ) {

    Node.call( this );

    // horizontal line
    var tailLocation = new Vector2( modelViewTransform.modelToViewX( graph.xRange.min - AXIS_EXTENT ), modelViewTransform.modelToViewY( graph.yRange.min ) );
    var tipLocation = new Vector2( modelViewTransform.modelToViewX( graph.xRange.max + AXIS_EXTENT ), modelViewTransform.modelToViewY( graph.yRange.min ) );
    var lineNode = new Line( tailLocation.x, tailLocation.y, tipLocation.x, tipLocation.y, {
      fill: AXIS_COLOR,
      stroke: 'black'
    } );
    this.addChild( lineNode );

    // ticks
    var tickSeparation = tickSpacing( graph.xRange );
    var numberOfTicks = tickSeparation.numberOfTicks;

    for ( var i = 0; i < numberOfTicks; i++ ) {
      var modelX = tickSeparation.startPositionTick + tickSeparation.minorTickSpacing * i;
      var x = modelViewTransform.modelToViewX( modelX );
      var y = modelViewTransform.modelToViewY( graph.yRange.min );

      if ( Math.abs( modelX / tickSeparation.minorTickSpacing ) % (tickSeparation.minorTicksPerMajor) < SMALL_EPSILON ) {
        // major tick
        this.addChild( new MajorTickNode( x, y, Util.toFixed( modelX, tickSeparation.decimalPlaces ), true ) );
      }
      else {
        // minor tick
        this.addChild( new MinorTickNode( x, y, true ) );
      }

    }
  }

  inherit( Node, XAxisNode );

  //----------------------------------------------------------------------------------------
  // y-axis (vertical)
  //----------------------------------------------------------------------------------------

  /**
   * @param {Graph} graph
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function YAxisNode( graph, modelViewTransform ) {

    Node.call( this );

    // vertical line
    var tailLocation = new Vector2( modelViewTransform.modelToViewX( graph.xRange.min ), modelViewTransform.modelToViewY( graph.yRange.min - AXIS_EXTENT ) );
    var tipLocation = new Vector2( modelViewTransform.modelToViewX( graph.xRange.min ), modelViewTransform.modelToViewY( graph.yRange.max + AXIS_EXTENT ) );
    var lineNode = new Line( tailLocation.x, tailLocation.y, tipLocation.x, tipLocation.y, {
      fill: AXIS_COLOR,
      stroke: 'black'
    } );
    this.addChild( lineNode );

    // ticks

    var tickSeparation = tickSpacing( graph.yRange );
    var numberOfTicks = tickSeparation.numberOfTicks;

    for ( var i = 0; i < numberOfTicks; i++ ) {
      var modelY = tickSeparation.startPositionTick + tickSeparation.minorTickSpacing * i;

      var x = modelViewTransform.modelToViewX( graph.xRange.min );
      var y = modelViewTransform.modelToViewY( modelY );
      if ( Math.abs( modelY / tickSeparation.minorTickSpacing ) % (tickSeparation.minorTicksPerMajor) < SMALL_EPSILON ) {
        // major tick
        this.addChild( new MajorTickNode( x, y, Util.toFixed( modelY, tickSeparation.decimalPlaces ), false ) );
      }
      else {
        // minor tick
        this.addChild( new MinorTickNode( x, y, false ) );
      }
    }

  }

  inherit( Node, YAxisNode );

  //----------------------------------------------------------------------------------------
//  X label
//----------------------------------------------------------------------------------------

  /**
   * @param {Graph} graph
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function XLabelNode( graph, modelViewTransform ) {

    Node.call( this );

    var centerX = modelViewTransform.modelToViewX( (graph.xRange.min + graph.xRange.max) / 2 );
    var bottom = modelViewTransform.modelToViewY( graph.yRange.min );
    var xLabelNode = new Text( graph.xAxisTitle, {font: AXIS_LABEL_FONT, fill: AXIS_LABEL_COLOR, centerX: centerX, bottom: bottom + 50} );
    this.addChild( xLabelNode );
  }

  inherit( Node, XLabelNode );

  //----------------------------------------------------------------------------------------
//  X label
//----------------------------------------------------------------------------------------

  /**
   * @param {Graph} graph
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function YLabelNode( graph, modelViewTransform ) {

    Node.call( this );

    var centerY = modelViewTransform.modelToViewY( (graph.yRange.min + graph.yRange.max) / 2 );
    var left = modelViewTransform.modelToViewX( graph.xRange.min );
    var yLabelNode = new Text( graph.yAxisTitle, {
      font: AXIS_LABEL_FONT,
      fill: AXIS_LABEL_COLOR,
      centerY: centerY,
      left: left - 50,
      rotation: -Math.PI / 2
    } );
    this.addChild( yLabelNode );
  }

  inherit( Node, YLabelNode );

  //----------------------------------------------------------------------------------------
// 2D Background
//----------------------------------------------------------------------------------------

  /**
   * @param {Graph} graph
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function BackgroundNode( graph, modelViewTransform ) {
    Node.call( this );

    var backgroundNode = new Rectangle(
      modelViewTransform.modelToViewX( graph.xRange.min ),
      modelViewTransform.modelToViewY( graph.yRange.max ),
      modelViewTransform.modelToViewDeltaX( graph.xRange.getLength() ),
      modelViewTransform.modelToViewDeltaY( -graph.yRange.getLength() ),
      {fill: GRID_BACKGROUND_FILL, lineWidth: GRID_BACKGROUND_LINE_WIDTH, stroke: GRID_BACKGROUND_STROKE} );
    this.addChild( backgroundNode );

  }

  inherit( Node, BackgroundNode );

//----------------------------------------------------------------------------------------
// 2D grid
//----------------------------------------------------------------------------------------

  /**
   * @param {Graph} graph
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function GridNode( graph, modelViewTransform ) {
    Node.call( this );

    // horizontal grid lines, one line for each unit of grid spacing
    var horizontalGridLinesNode = new Node();
    this.addChild( horizontalGridLinesNode );
    var tickYSeparation = tickSpacing( graph.yRange );
    var numberOfHorizontalGridLines = tickYSeparation.numberOfTicks;

    var minX = modelViewTransform.modelToViewX( graph.xRange.min );
    var maxX = modelViewTransform.modelToViewX( graph.xRange.max );
    for ( var i = 0; i < numberOfHorizontalGridLines; i++ ) {
      var modelY = tickYSeparation.startPositionTick + tickYSeparation.minorTickSpacing * i;
      if ( modelY !== graph.yRange.min ) { // skip origin, x axis will live here
        var yOffset = modelViewTransform.modelToViewY( modelY );
        var isMajorX = Math.abs( modelY / tickYSeparation.minorTickSpacing ) % (tickYSeparation.minorTicksPerMajor) < SMALL_EPSILON;
        horizontalGridLinesNode.addChild( new GridLineNode( minX, yOffset, maxX, yOffset, isMajorX ) );
      }
    }

    // vertical grid lines, one line for each unit of grid spacing
    var verticalGridLinesNode = new Node();
    this.addChild( verticalGridLinesNode );
    var tickXSeparation = tickSpacing( graph.xRange );
    var numberOfVerticalGridLines = tickXSeparation.numberOfTicks;
    var minY = modelViewTransform.modelToViewY( graph.yRange.max ); // yes, swap min and max
    var maxY = modelViewTransform.modelToViewY( graph.yRange.min );
    for ( var j = 0; j < numberOfVerticalGridLines; j++ ) {
      var modelX = tickXSeparation.startPositionTick + tickXSeparation.minorTickSpacing * j;
      //TODO decide if we want to skip origin or implement a more roust version using small epsilon
      if ( modelX !== graph.xRange.min ) { // skip origin, y axis will live here
        var xOffset = modelViewTransform.modelToViewX( modelX );
        var isMajorY = Math.abs( modelX / tickXSeparation.minorTickSpacing ) % (tickXSeparation.minorTicksPerMajor) < SMALL_EPSILON;
        verticalGridLinesNode.addChild( new GridLineNode( xOffset, minY, xOffset, maxY, isMajorY ) );
      }
    }
  }

  inherit( Node, GridNode );
//----------------------------------------------------------------------------------------

  /**
   * @param {Graph} graph
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function GraphAxesNode( graph, modelViewTransform ) {

    //making its visibility available to the parent node.
    this.gridNode = new GridNode( graph, modelViewTransform );

    Node.call( this, {
        children: [
          new BackgroundNode( graph, modelViewTransform ),
          this.gridNode,
          new XAxisNode( graph, modelViewTransform ),
          new YAxisNode( graph, modelViewTransform ),
          new XLabelNode( graph, modelViewTransform ),
          new YLabelNode( graph, modelViewTransform )
        ]
      }
    );
  }

  return inherit( Node, GraphAxesNode );
} )
;