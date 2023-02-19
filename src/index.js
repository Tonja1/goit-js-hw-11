import Notiflix from "notiflix";
import axios from "axios";

const loadMore = document.querySelector('.load-more');
const list = document.querySelector('.gallery');
const input = document.querySelector('[name="searchQuery"]');
const submitForm = document.querySelector('.search-form');
submitForm.addEventListener('submit', onLoad);
loadMore.addEventListener('click', onClick);
let page = 1;
let hits = 40;

function onLoad() {
  event.preventDefault();
  page = 1;
  hits = 40;
  loadMore.hidden = true;
  const query = input.value;
  list.innerHTML = "";
  if (query === "") {
    return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    };
  onSearch(query);
};

async function onSearch(query, page = 1) {
  try {
    const API_KEY = '33640880-36f1b5ee21a4606cc05d3afaa';
    const BASE_URL = 'https://pixabay.com/api/';
    const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`);
    
      if (response.data.totalHits === 0) {
      return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        };
      list.insertAdjacentHTML("beforeend", createMarkup(response));
    loadMore.hidden = false;
    if (response.data.totalHits <= hits) {
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      loadMore.hidden = true;
      hits = 40;
    };
  } catch (error) {
    console.error(error);
  };
};

async function onClick(response) {
  try {
    page += 1;
    hits += 40;
    await onSearch(input.value, page);
    list.insertAdjacentHTML("beforeend", createMarkup(response));
  } catch (error) {
    console.log(error);
  };
};

function createMarkup(response) {
  const { data } = response;
  const oblect = data.hits;
  return oblect.map(({
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads
  }) =>

    `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
  </div>
        `
  ).join('');

};