"use strict";

// ============== global variables ============== //
const endpoint = "https://my-api-database-ccaf8-default-rtdb.europe-west1.firebasedatabase.app/";
let posts;

// ============== load and init app ============== //

window.addEventListener("load", initApp);

function initApp() {
  updatePostsGrid(); // update the grid of posts: get and show all posts

  // event listener
  document.querySelector("#btn-create-post").addEventListener("click", showCreatePostDialog);
  document.querySelector("#form-delete-post").addEventListener("submit", deletePostClicked);
}

// ============== events ============== //

function deletePostClicked(event) {
  const id = event.target.getAttribute("data-id"); // event.target is the delete form
  deletePost(id); // call deletePost with id
}

function showCreatePostDialog() {
  console.log("Create New Post clicked!");
  document.querySelector("#dialog-create-post").showModal();
  document.querySelector("#form-create-post").addEventListener("submit", createPostClicked);
}

// todo

// ============== posts ============== //

async function updatePostsGrid() {
  posts = await getPosts(); // get posts from rest endpoint and save in global variable
  showPosts(posts); // show all posts (append to the DOM) with posts as argument
}

// Get all posts - HTTP Method: GET
async function getPosts() {
  const response = await fetch(`${endpoint}/posts.json`); // fetch request, (GET)
  const data = await response.json(); // parse JSON to JavaScript
  const posts = prepareData(data); // convert object of object to array of objects
  return posts; // return posts
}

function showPosts(listOfPosts) {
  document.querySelector("#posts").innerHTML = ""; // reset the content of section#posts

  for (const post of listOfPosts) {
    showPost(post); // for every post object in listOfPosts, call showPost
  }
}

function showPost(postObject) {
  const html = /*html*/ `
        <article class="grid-item">
            <img src="${postObject.image}" />
            <h3>${postObject.title}</h3>
            <p>${postObject.body}</p>
            <div class="btns">
                <button class="btn-delete">Delete</button>
                <button class="btn-update">Update</button>
            </div>
        </article>
    `; // html variable to hold generated html in backtick
  document.querySelector("#posts").insertAdjacentHTML("beforeend", html); // append html to the DOM - section#posts

  // add event listeners to .btn-delete and .btn-update
  document.querySelector("#posts article:last-child .btn-delete").addEventListener("click", deleteClicked);
  document.querySelector("#posts article:last-child .btn-update").addEventListener("click", updateClicked);

  // called when delete button is clicked
  function deleteClicked() {
    console.log("Delete button clicked");
    // to do
    document.querySelector("#dialog-delete-post-title").textContent = postObject.title;
    document.querySelector("#form-delete-post").setAttribute("data-id", postObject.id);
    document.querySelector("#dialog-delete-post").showModal();
  }

  // called when update button is clicked
  function updateClicked() {
    console.log("Update button clicked");
    // to do
  }
}

// Create a new post - HTTP Method: POST
async function createPost(title, body, image) {
  const newPost = {
    title: title,
    body: body,
    image: image,
  };
  console.log(newPost);
  const json = JSON.stringify(newPost);
  const response = await fetch(`${endpoint}/posts.json`, { method: "POST", body: json });
  if (response.ok) {
    console.log("New post added to Firebase");
    updatePostsGrid();
  }
}
// create new post object
// convert the JS object to JSON string
// POST fetch request with JSON in the body
// check if response is ok - if the response is successful
// update the post grid to display all posts and the new post

// Update an existing post - HTTP Method: DELETE
async function deletePost(id) {
  const response = await fetch(`${endpoint}/posts/${id}.json`, { method: "DELETE" });
  if (response.ok) {
    console.log("Post successfully deleted from Firebase 🔥");
    updatePostsGrid(); // Call your function to update the post grid
  }
}

// DELETE fetch request
// check if response is ok - if the response is successful
// update the post grid to display posts

// Delete an existing post - HTTP Method: PUT
async function updatePost(id, title, body, image) {
  // post update to update
  // convert the JS object to JSON string
  // PUT fetch request with JSON in the body. Calls the specific element in resource
  // check if response is ok - if the response is successful
  // update the post grid to display all posts and the new post
}

// ============== helper function ============== //

// convert object of objects til an array of objects
function prepareData(dataObject) {
  const array = []; // define empty array
  // loop through every key in dataObject
  // the value of every key is an object
  for (const key in dataObject) {
    const object = dataObject[key]; // define object
    object.id = key; // add the key in the prop id
    array.push(object); // add the object to array
  }
  return array; // return array back to "the caller"
}

function createPostClicked(event) {
  event.preventDefault();
  const form = event.target; //or const from = this;
  const title = form.title.value;
  const body = form.body.value;
  const image = form.image.value;

  createPost(title, body, image);
  form.reset();
  document.querySelector("#dialog-create-post").close();
}
