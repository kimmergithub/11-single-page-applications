'use strict';
var app = app || {};

// TODONE ??? -WORKING: Configure routes for this app with page.js, by registering each URL your app can handle, linked to a a single controller function to handle it. Note that these routes do not need to wrapped in an IIFE.
// write the page paths page();

// OUR CONTROLLER === WHEN YOU GO HERE ===> LOAD THIS VIEW
// THE BACKEND WORK BEHIND CLICKING AN Href LINK (research)
page('/', app.articleController.initArticle);

//We added app here because article controller lives on app!! What what!!
// about information is on our admin page!
page('/about', app.aboutController.initAbout);


// TODONE-WORKING: What function do you call to activate page.js? Fire it off now, to execute. Note that it does not need to be attached to the 'app' object nor wrapped in an IIFE.
// call page page();
page();
