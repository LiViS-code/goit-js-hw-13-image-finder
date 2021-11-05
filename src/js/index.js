import '../sass/main.scss';
import './apiService';
import listCards from '../templates/listCards.hbs';
import PixabayApiServise from './apiService';

const apiServise = new PixabayApiServise();

const refs = {
  searchForm: document.getElementById('search-form'),
  gallery: document.getElementById('cards-js'),
  more: document.getElementById('more'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.more.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  apiServise.query = e.currentTarget.elements.input.value;
  apiServise.resetPage();
  clearMarkUp();
  if (!apiServise.query.trim()) return console.log('пустая строка');
  apiServise.fetchArticles().then(data => onMarkUp(data.hits));
}

function onLoadMore() {
  if (!apiServise.query.trim()) return console.log('пустая строка');
  apiServise.fetchArticles().then(data => onMarkUp(data.hits));
}

function onMarkUp(data) {
  if (parseInt(data.length) > 0) {
    refs.gallery.insertAdjacentHTML('beforeend', listCards(data));
    refs.more.style.display = 'block';
  } else {
    console.log('No Hits');
  }
}

function clearMarkUp() {
  refs.gallery.innerHTML = '';
  refs.more.style.display = 'none';
}
