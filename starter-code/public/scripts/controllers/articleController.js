'use strict';
var app = app || {};

(function(module) {
  // variable for our function method to live on, an object!
  const articleController = {};
  // TODONE-WORKING: Setup a function that kicks off the fetching and rendering of articles, using the same
  // code that used to be in index.html.
  // Also be sure to hide all the main section elements, and reveal the #articles section:

  // Same show hide function on articleController.init = funciton...
  articleController.initArticle = function () {
    app.Article.fetchAll(app.articleView.initIndexPage);
    console.log('articleController.initArticle is CALLED')
    $('#about').hide()
    $('#articles').show()
  }

  module.articleController = articleController;
})(app);
