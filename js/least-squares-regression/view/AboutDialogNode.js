// Copyright 2002-2014, University of Colorado Boulder

/**
 * Shows the About dialog.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  //var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  //var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  //var VStrut = require( 'SUN/VStrut' );
  var Dialog = require( 'JOIST/Dialog' );

  /**
   * @param {Property.<DataSet>} selectedDataSetProperty
   * @constructor
   */
  function AboutDialog( selectedDataSetProperty ) {
    var dialog = this;

    var children = [
      new Text( selectedDataSetProperty.value.name, {font: new PhetFont( 28 )} ),
      //new Text( 'version ' + sim.version, { font: new PhetFont( 20 ) } ),
      //new VStrut( 15 ),
      //new Text( Brand.name, { font: new PhetFont( 16 ) } ),
      new Text( selectedDataSetProperty.value.reference, {font: new PhetFont( 12 )} )
    ];


    //if ( Brand.links && Brand.links.length ) {
    //  children.push( new VStrut( 15 ) );
    //  for ( var i = 0; i < Brand.links.length; i++ ) {
    //    var link = Brand.links[i];
    //    children.push( createLinkNode( link.text, link.url ) );
    //  }
    //}

    var content = new VBox( {align: 'left', spacing: 5, children: children} );

    Dialog.call( this, content, {
      modal: true,
      hasCloseButton: false
    } );

    // close it on a click
    this.addInputListener( new ButtonListener( {
      fire: dialog.hide.bind( dialog )
    } ) );

    //TODO: The peer should not be in the DOM if the button is invisible
    this.addPeer( '<input type="button" aria-label="Close About Dialog">', {
      click: function() {
        dialog.hide();
      },

      //Visit this button after the user has added some pullers to the rope
      tabIndex: 20000,

      onAdded: function( peer ) {
        peer.peerElement.focus();
      }
    } );
  }

  /**
   * Creates a hypertext link.
   * @param {string} text the text that's shown to the user
   * @param {string} url clicking the text opens a window/tab to this URL
   * @returns {Node}
   */
  //var createLinkNode = function( text, url ) {
  //
  //  var link = new Text( text, {
  //    font: new PhetFont( 14 ),
  //    fill: 'rgb(27,0,241)', // blue, like a typical hypertext link
  //    cursor: 'pointer'
  //  } );
  //
  //  link.addInputListener( {
  //    up: function( evt ) {
  //      evt.handle(); // don't close the dialog
  //    },
  //    upImmediate: function( event ) {
  //      var newWindow = window.open( url, '_blank' ); // open in a new window/tab
  //      newWindow.focus();
  //    }
  //  } );
  //
  //  return link;
  //};

  /**
   * Creates node that displays the credits.
   * @param {Object} credits see implementation herein for supported {string} fields
   * @returns {Node}
   */
  //var createCreditsNode = function( credits ) {
  //
  //  var titleFont = new PhetFont( { size: 14, weight: 'bold' } );
  //  var font = new PhetFont( 12 );
  //  var multiLineTextOptions = { font: font, align: 'left' };
  //  var children = [];
  //
  //  // Credits
  //  children.push( new Text( creditsTitleString, { font: titleFont } ) );
  //  if ( credits.leadDesign ) { children.push( new MultiLineText( StringUtils.format( leadDesignString, credits.leadDesign ), multiLineTextOptions ) ); }
  //  if ( credits.softwareDevelopment ) { children.push( new MultiLineText( StringUtils.format( softwareDevelopmentString, credits.softwareDevelopment ), multiLineTextOptions ) ); }
  //  if ( credits.team ) { children.push( new MultiLineText( StringUtils.format( teamString, credits.team ), multiLineTextOptions ) ); }
  //  if ( credits.qualityAssurance ) { children.push( new MultiLineText( StringUtils.format( qualityAssuranceString, credits.qualityAssurance ), multiLineTextOptions ) ); }
  //  if ( credits.graphicArts ) { children.push( new MultiLineText( StringUtils.format( graphicArtsString, credits.graphicArts ), multiLineTextOptions ) ); }
  //
  //  //TODO see joist#163, translation credit should be obtained from string files
  //  // Translation
  //  if ( credits.translation ) {
  //    if ( children.length > 0 ) { children.push( new VStrut( 10 ) ); }
  //    children.push( new Text( translationTitleString, { font: titleFont } ) );
  //    children.push( new MultiLineText( credits.translation, multiLineTextOptions ) );
  //  }
  //
  //  // Thanks
  //  if ( credits.thanks ) {
  //    if ( children.length > 0 ) { children.push( new VStrut( 10 ) ); }
  //    children.push( new Text( thanksTitleString, { font: titleFont } ) );
  //    children.push( new MultiLineText( credits.thanks, multiLineTextOptions ) );
  //  }
  //
  //  return new VBox( { align: 'left', spacing: 1, children: children } );
  //};

  return inherit( Dialog, AboutDialog );
} );