const url = 'https://jsonplaceholder.typicode.com/posts';

const loadingElement = document.querySelector('#loading');
const postsContainer = document.querySelector('#posts-container');
const btnEnviar = document.querySelector('form input[type=submit]')

const postPage = document.querySelector('#post');
const postContainer = document.querySelector('#post-container');
const commentsContainer = document.querySelector('#comments-container');

const commentForm = document.querySelector('#comment-form');
const emailInput = document.querySelector('#email');
const bodyInput = document.querySelector('#body');

//Get id from url
const paramsURL = new URLSearchParams(location.search);
const postId = paramsURL.get('id');


//Get all posts
async function getAllPosts() {
  const response = await fetch(url);

  const data = await response.json();

  console.log(data);

  loadingElement.classList.add('hide');

  data.map(post => {
    const div = document.createElement('div');
    const title = document.createElement('h2');
    const body = document.createElement('p');
    const link = document.createElement('a');

    title.innerText = post.title;
    body.innerText = post.body;
    link.innerText = "Ler";
    link.setAttribute('href', `./post.html?id=${post.id}`)

    div.classList.add('wrapper');

    div.appendChild(title);
    div.appendChild(body);
    div.appendChild(link);

    postsContainer.appendChild(div);
  })
}

//Get post by ID
async function getPost(id){
  const [responsePost, responseComments] = await Promise.all([
    fetch(`${url}/${id}`),
    fetch(`${url}/${id}/comments`)
  ])

  const dataPost = await responsePost.json();

  const dataComments = await responseComments.json();

  loadingElement.classList.add('hide');
  postPage.classList.remove('hide');

  const title = document.createElement('h1');
  const body = document.createElement('p');

  title.innerText = dataPost.title;
  body.innerText = dataPost.body;

  postContainer.appendChild(title);
  postContainer.appendChild(body);

  console.log(dataComments)

  dataComments.map(comment => {
    createComment(comment);
  })

}

function createComment(comment){
  const div = document.createElement('div');
  const email = document.createElement('h3');
  const commentBody = document.createElement('p');

  email.innerText = comment.email;
  commentBody.innerText = comment.body;

  div.classList.add('wrapper');

  div.appendChild(email);
  div.appendChild(commentBody);

  commentsContainer.appendChild(div);
}


//Post a comment
async function postComment(comment){

  const response = await fetch(`${url}/${postId}/comments`, {
    method: 'POST',
    body: comment,
    headers: { 
      'Content-Type': 'application/json'
    },
  })

  const data = await response.json();

  createComment(data);

  btnEnviar.value = 'Enviar';
  btnEnviar.disabled = false;

  commentForm.reset();

}


if(!postId){
  getAllPosts();
} else {
  getPost(postId);

  //Add event form
  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    btnEnviar.disabled = true;

    btnEnviar.value = 'Enviando...';

    let comment = {
      email: emailInput.value,
      body: bodyInput.value
    }

    comment = JSON.stringify(comment);

    postComment(comment)
  })
}
