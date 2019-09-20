// Copyright 2014-2019, University of Colorado Boulder

/**
 * Shows a dialog box about the source and references of the selected Data Set.
 *
 * @author Martin Veillette (Berea College)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const leastSquaresRegression = require( 'LEAST_SQUARES_REGRESSION/leastSquaresRegression' );
  const LeastSquaresRegressionConstants = require( 'LEAST_SQUARES_REGRESSION/least-squares-regression/LeastSquaresRegressionConstants' );
  const Line = require( 'SCENERY/nodes/Line' );
  const MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // strings
  const sourcePatternString = require( 'string!LEAST_SQUARES_REGRESSION/sourcePattern' );

  /**
   * @param {Property.<DataSet>} selectedDataSetProperty
   * @constructor
   */
  function SourceAndReferenceNode( selectedDataSetProperty ) {

    /*
     * Use ScreenView, to help center and scale content. Renderer must be specified here because the window is added
     * directly to the scene, instead of to some other node that already has svg renderer.
     */
    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 1024, 618 ) } );

    // limit the width of the dialog content for i18n
    const maxContentWidth = this.layoutBounds.width * 2 / 3;

    const self = this;

    const referenceText = new MultiLineText( '', {
      font: LeastSquaresRegressionConstants.REFERENCE_FONT,
      align: 'left'
    } );
    const sourceText = new MultiLineText( '', { font: LeastSquaresRegressionConstants.SOURCE_FONT, align: 'left' } );

    const children = [
      referenceText,
      sourceText
    ];

    // Create the content box
    const content = new LayoutBox( { align: 'left', spacing: 10, children: children, maxWidth: maxContentWidth } );

    // Create the panel that contains the source and reference
    const panel = new Panel( content, {
      centerX: this.layoutBounds.centerX,
      centerY: this.layoutBounds.centerY,
      xMargin: 20,
      yMargin: 20,
      fill: 'white',
      stroke: 'black'
    } );

    // Create the 'Closed Button" in the upper right corner with a circle and a cross inside it.
    // The button is not hooked to any listener since the closing of this node is handled in the main screenView
    const buttonSize = 15;
    const buttonLineWidth = 2;
    const circle = new Circle( buttonSize, {
      fill: 'black',
      stroke: 'white',
      lineWidth: buttonLineWidth,
      centerX: 0,
      centerY: 0
    } );
    const l = buttonSize / 3;
    const upSlopeLine = new Line( l, l, -l, -l, { stroke: 'white', lineWidth: buttonLineWidth, centerX: 0, centerY: 0 } );
    const downwardSlopeLine = new Line( l, -l, -l, l, {
      stroke: 'white',
      lineWidth: buttonLineWidth,
      centerX: 0,
      centerY: 0
    } );
    const button = new Node( { children: [ circle, upSlopeLine, downwardSlopeLine ] } );

    // Add a cursor when hovering (see https://github.com/phetsims/least-squares-regression/issues/10)
    button.cursor = 'pointer';

    // Add to this node
    this.addChild( panel );
    this.addChild( button );

    // Update the content of this node and the layout.
    // no need to unlink, present for the lifetime of the sim
    selectedDataSetProperty.link( function( selectedDataSet ) {
      referenceText.text = selectedDataSet.reference;
      const formattedSourceString = StringUtils.format( sourcePatternString, selectedDataSet.source );
      sourceText.text = formattedSourceString;
      panel.centerX = self.layoutBounds.centerX;
      panel.centerY = self.layoutBounds.centerY;
      button.centerX = panel.right;
      button.centerY = panel.top;
    } );
  }

  leastSquaresRegression.register( 'SourceAndReferenceNode', SourceAndReferenceNode );  

  return inherit( ScreenView, SourceAndReferenceNode );
} );
