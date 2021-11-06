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
refs.gallery.addEventListener('click', showLargeImg);

function onSearch(e) {
  e.preventDefault();
  apiServise.query = e.currentTarget.elements.input.value;
  apiServise.resetPage();
  clearMarkUp();
  onLoadMore();
}

function onLoadMore() {
  if (!apiServise.query.trim()) return alert('Надо что-нибудь ввести в строку поиска!');
  apiServise
    .fetchImages()
    .then(data => onMarkUp(data))
    .catch(data => alert(`Ошибка: ${data}`));
}

function onMarkUp(data) {
  if (parseInt(data.hits.length) > 0) {
    refs.gallery.insertAdjacentHTML('beforeend', listCards(data.hits));
    const maxPageCount = Math.ceil(data.total / apiServise.pPage);
    refs.more.style.display = apiServise.page <= maxPageCount ? 'block' : 'none';
  } else {
    alert('Ни чего не найдено!');
  }
}

function clearMarkUp() {
  refs.gallery.innerHTML = '';
  refs.more.style.display = 'none';
}

function showLargeImg(e) {
  console.log(e.target);
}
