"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".nav-left").removeClass("hidden");
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function navCreateStoryClick(evt) {
  hidePageComponents();
  $submitStoryForm.show();
}

$navSubmitStory.on("click", navCreateStoryClick);

function navMyStories(evt) {
  hidePageComponents();
  putMyStoriesOnPage();
  $myStoriesList.show();
}

$body.on("click", "#nav-my-stories", navMyStories);

function navFavStories(evt) {
  hidePageComponents();
  putFavStoriesOnPage();
  $favStoriesList.show();
}

$body.on("click", "#nav-fav-stories", navFavStories);