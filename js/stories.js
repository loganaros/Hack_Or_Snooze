"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, userStory = false) {
  // console.debug("generateStoryMarkup", story);

  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        ${showStar ? getStarHTML(story, currentUser) : ""}
          <div class="story-container">
            <div class="story-title">
              <a href="${story.url}" target="a_blank" class="story-link">
              ${story.title}
              </a>
              <small class="story-hostname">(${story.url})</small>
            </div>
            ${userStory ? "<small class='delete-btn'>delete</small>" : ""}
            <div class="story-author">by ${story.author}</div>
            <div class="story-user">posted by ${story.username}</div>
          </div>
      </li>
    `);
}

async function deleteStory(evt) {
  await storyList.removeStory(currentUser, evt.target.closest("li").id);
  await putMyStoriesOnPage();
}

$body.on("click", ".delete-btn", deleteStory);

function getStarHTML(story, user) {
  let favorite = user.isFavorite(story);
  let starClass = favorite ? "fas" : "far"

  return `<span class="star"><i id="favIcon" class="${starClass} fa-star"></i></span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function putMyStoriesOnPage() {
  $myStoriesList.empty();
  for (let story of currentUser.ownStories) {
    const $story = generateStoryMarkup(story, true);
    $myStoriesList.append($story);
  }
}

function putFavStoriesOnPage() {
  $favStoriesList.empty();
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $favStoriesList.append($story);
  }
}

async function submitStory(evt) {
  evt.preventDefault();

  const title = $("#story-title").val();
  const author = $("#story-author").val();
  const url = $("#story-url").val();
  const storyData = { title, author, url };

  const story = await storyList.addStory(currentUser, storyData);

  $submitStoryForm.hide();
  $submitStoryForm.trigger("reset");
  getAndShowStoriesOnStart();
}

$submitStoryForm.on("submit", submitStory);

async function toggleFavoriteStory(evt) {
  $(evt.target).toggleClass("far fas");
  await currentUser.toggleFavorite(storyList.stories.find(s => s.storyId == evt.target.closest("li").id));
}

$body.on("click", ".star", toggleFavoriteStory);