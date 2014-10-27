//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bucket = require( 'PHETCOMMON/model/Bucket' );
  // var CustomDataFactory  = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/model/CustomDataFactory')
  var DataPoint = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/model/DataPoint' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Graph = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/model/Graph' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

// constants
  var BUCKET_SIZE = new Dimension2( 90, 45 );

  /**
   * Main constructor for LeastSquaresModel, which contains all of the model logic for the entire sim screen.
   * @constructor
   */
  function LeastSquaresRegressionModel() {

    var thisModel = this;

    PropertySet.call( thisModel, {
      showBucket: true,
      showMyLine: false,
      showResidualsOfMyLine: false,
      showSquareResidualsOfMyLine: false,
      showBestFitLine: false,
      showResidualsOfBestFitLine: false,
      showSquareResidualsOfBestFitLine: false,
      slope: 0,
      intercept: 0
    } );


    // It is important to set up the charges first (before the sensors)
    // charge particles that make up the model
    this.dataPointSet = new ObservableArray();

    this.movableDataPoints = new ObservableArray(); // @public

    for ( var i = 0; i < 10; i++ ) {
      var position = new Vector2( 400 * Math.random(), 600 * Math.random() );
      this.dataPointSet.push( new DataPoint( position ) );
    }

    this.graph = new Graph( new Range( 0, 100 ), new Range( 0, 100 ) );
//
//    thisModel.customData = [
//      new CustomDataFactory( 'test1' ),
//      new CustomDataFactory( 'test2' )
//  ];


    this.bucket = new Bucket( {
      position: new Vector2( 100, 400 ),
      baseColor: '#000080',
      caption: '',
      size: BUCKET_SIZE,
      invertY: true
    } );
  }

  return inherit( PropertySet, LeastSquaresRegressionModel, {

    step: function( dt ) {
      this.movableDataPoints.forEach( function( movableDataPoint ) { movableDataPoint.step( dt ); } );
    },

    placeDataPoint: function( movableDataPoint ) {
      var dataPointPlaced = false;
//      for ( var i = 0; i < this.dataPointPlacementBoards.length && !dataPointPlaced; i++ ) {
//        dataPointPlaced = this.dataPointPlacementBoards[i].placeDataPoint( movableDataPoint );
//      }
      if ( !dataPointPlaced ) {
        movableDataPoint.returnToOrigin( true );
      }
    },

    /**
     * Function for adding new movable dataPoints to this model when the user creates them, generally by clicking on some
     * some sort of creator node.
     * @public
     * @param movableDataPoint
     */
    addUserCreatedMovableDataPoint: function( movableDataPoint ) {
      var self = this;
      this.movableDataPoints.push( movableDataPoint );
      movableDataPoint.userControlledProperty.link( function( userControlled ) {
        if ( !userControlled ) {
          self.placeDataPoint( movableDataPoint );
        }
      } );

      // The dataPoint will be removed from the model if and when it returns to its origination point.  This is how a dataPoint
      // can be 'put back' into the bucket.
      movableDataPoint.on( 'returnedToOrigin', function() {
        if ( !movableDataPoint.userControlled ) {
          // The dataPoint has been returned to the bucket.
          self.movableDataPoints.remove( movableDataPoint );
        }
      } );

    },

    sumOfSquaresXX: function( positionArray ) {
      var squaresXX = _.map( positionArray, function( position ) { return position.x * position.x; } );
      var sumOfSquaresXX = _.reduce( squaresXX, function( memo, num ) { return memo + num; }, 0 );
      return sumOfSquaresXX;
    },

    sumOfSquaresXY: function( positionArray ) {
      var squaresXY = _.map( positionArray, function( position ) { return position.x * position.y; } );
      var sumOfSquaresXY = _.reduce( squaresXY, function( memo, num ) { return memo + num; }, 0 );
      return sumOfSquaresXY;
    },

    sumOfSquaresYY: function( positionArray ) {
      var squaresYY = _.map( positionArray, function( position ) { return position.y * position.y; } );
      var sumOfSquaresYY = _.reduce( squaresYY, function( memo, num ) { return memo + num; }, 0 );
      return sumOfSquaresYY;
    },

    sumOfX: function( positionArray ) {
      var positionArrayX = _.map( positionArray, function( position ) { return position.x; } );
      var sumOfX = _.reduce( positionArrayX, function( memo, num ) { return memo + num; }, 0 );
      return sumOfX;
    },

    sumOfY: function( positionArray ) {
      var positionArrayY = _.map( positionArray, function( position ) { return position.y; } );
      var sumOfY = _.reduce( positionArrayY, function( memo, num ) { return memo + num; }, 0 );
      return sumOfY;
    },

    averageOfSumOfSquaresXX: function( positionArray ) {
      return this.sumOfSquaresXX( positionArray ) / positionArray.length;
    },

    averageOfSumOfSquaresXY: function( positionArray ) {
      return this.sumOfSquaresXY( positionArray ) / positionArray.length;
    },

    averageOfSumOfSquaresYY: function( positionArray ) {
      return this.sumOfSquaresYY( positionArray ) / positionArray.length;
    },

    averageOfSumOfX: function( positionArray ) {
      return this.sumOfX( positionArray ) / positionArray.length;
    },

    averageOfSumOfY: function( positionArray ) {
      return this.sumOfY( positionArray ) / positionArray.length;
    },

    standardDeviationOfX: function( positionArray ) {

    },

    standardDeviationOfY: function( positionArray ) {

    },

    getLinearFit: function( positionArray ) {
      var slopeNumerator = this.averageOfSumOfSquaresXY - this.averageOfSumOfX * this.averageOfSumOfY;
      var slopeDenominator = this.averageOfSumOfSquaresXX - this.averageOfSumOfX * this.averageOfSumOfX;
      var slope = slopeNumerator / slopeDenominator;
      var intercept = this.averageOfSumOfY - slope * this.averageOfSumOfX;
      var pearsonCoefficientCorrelationNumerator = slopeNumerator;
      var pearsonCoefficientCorrelationDenominator = Math.sqrt( ( this.averageOfSumOfSquaresXX - this.averageOfSumOfX * this.averageOfSumOfX) * ( this.averageOfSumOfSquaresYY - this.averageOfSumOfY * this.averageOfSumOfY) );
      var pearsonCoefficientCorrelation = pearsonCoefficientCorrelationNumerator / pearsonCoefficientCorrelationDenominator;
      var fitParameters = {
        slope: slope,
        intercept: intercept,
        pearsonCoefficientCorrelation: pearsonCoefficientCorrelation
      };
      return fitParameters;
    },
    reset: function() {
      PropertySet.prototype.reset.call( this );
//      this.dataPointPlacementGraphs.forEach( function( board ) { board.releaseAllShapes( 'jumpHome' ); } );
      this.movableDataPoints.clear();
    }

  } );
} );






