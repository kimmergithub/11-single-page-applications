'use strict';
var app = app || {};

// IFII
(function(module) {
  // we are declaring this variables so our FUNCTION can live in an object!
  const aboutController = {};

  // TODONE-WORKING: Define a function that hides all main section elements, and then reveals just the #about section:
  // JQuery === aboutController.init =>  ====> .init?
  // we want to hide #articles and show #about
  // INIT === we are chosing to call this aboutController.initAbout because we are initializes
  aboutController.initAbout = function () {
    console.log('aboutController.initAbout is CALLED')
    $('main').hide
    $('#about').show
  }

  module.aboutController = aboutController;
})(app);
