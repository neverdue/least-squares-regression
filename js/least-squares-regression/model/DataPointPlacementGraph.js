/*
 * Copyright 2002-2014, University of Colorado Boulder
 */

/**
 * Model of a rectangular graph upon which various data points can be placed.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  // var PropertySet = require( 'AXON/PropertySet' );
  // var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Dimension2} size
   * @param {Vector2} originPosition
   * @param {Range} xRange
   * @param {Range} yRange
   * @constructor
   */
  function DataPointPlacementGraph( size, originPosition, xRange, yRange ) {

    this.size = size;
    this.originPosition = originPosition;
    this.xRange = xRange;
    this.yRange = yRange;

    this.lines = new ObservableArray(); // {Line} lines that the graph is currently displaying

    // Observable array of the points that have been placed on this graph.
    // this.graphDataPoints = new ObservableArray();

    // Non-dynamic public values.
    this.bounds = new Bounds2( originPosition.x, originPosition.y, originPosition.x + size.width, originPosition.y + size.height ); // @public
  }

  return inherit( Object, DataPointPlacementGraph, {

    // @private
    dataPointOverlapsGraph: function( dataPoint ) {
      return this.bounds.containsPoint( dataPoint.position );
    },

    /**
     * Place the provide data point on this graph. Returns false if the data point
     * is not over the graph.
     * @public
     * @param {DataPoint} dataPoint A model data point
     */
    placeDataPoint: function( dataPoint ) {
      assert && assert( dataPoint.userControlled === false, 'Data Points can\'t be placed when still controlled by user.' );
      if ( this.dataPointOverlapsGraph( dataPoint ) ) {
        dataPoint.setDestination( dataPoint.position, false );
        return true;
      }
      return false;
    },

    graphViewTransform: function() {
      var graphOriginPosition = new Vector2( this.xRange.min, this.yRange.min );
      var viewOriginPosition = new Vector2( this.bounds.minX, this.bounds.maxY );
      var scaleXFactor = this.bounds.width / this.xRange.getLength();
      var scaleYFactor = -1 * this.bounds.height / this.yRange.getLength();
      var graphViewTransform = ModelViewTransform2.createSinglePointXYScaleMapping( graphOriginPosition, viewOriginPosition, scaleXFactor, scaleYFactor );
      return graphViewTransform;
    }

  } );
} );