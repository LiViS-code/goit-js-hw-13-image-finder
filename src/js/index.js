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
  apiServise.fetchArticles().then(data => {
    console.log('Всего найдено:', data.total);
    onMarkUp(data);
  });
}

function onLoadMore() {
  if (!apiServise.query.trim()) return console.log('пустая строка');
  apiServise.fetchArticles().then(data => onMarkUp(data));
}

function onMarkUp(data) {
  if (parseInt(data.hits.length) > 0) {
    refs.gallery.insertAdjacentHTML('beforeend', listCards(data.hits));
    const maxPageCount = Math.ceil(data.total / 12);
    if (apiServise.page <= maxPageCount) {
      refs.more.style.display = 'block';
    } else {
      refs.more.style.display = 'none';
    }
  } else {
    console.log('No Hits');
  }
}

function clearMarkUp() {
  refs.gallery.innerHTML = '';
  refs.more.style.display = 'none';
}
