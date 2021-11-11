import '../sass/main.scss';
import './apiService';
import listCards from '../templates/listCards.hbs';
import PixabayApiServise from './apiService';
import { Spinner } from 'spin.js';

const opts = {
  lines: 10, // The number of lines to draw
  length: 25, // The length of each line
  width: 12, // The line thickness
  radius: 30, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-shrink', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#e03e3e', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  top: '200px', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  zIndex: 100, // The z-index (defaults to 2e9)
  className: 'spinner', // The CSS class to assign to the spinner
  position: 'absolute', // Element positioning,
};
const optsMore = {
  lines: 10, // The number of lines to draw
  length: 25, // The length of each line
  width: 12, // The line thickness
  radius: 30, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-shrink', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#e03e3e', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  top: '-200px', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  zIndex: 100, // The z-index (defaults to 2e9)
  className: 'spinner', // The CSS class to assign to the spinner
  position: 'absolute', // Element positioning,
};
const optsModal = {
  lines: 10, // The number of lines to draw
  length: 25, // The length of each line
  width: 12, // The line thickness
  radius: 30, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-shrink', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#e03e3e', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  top: '50%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  zIndex: 100, // The z-index (defaults to 2e9)
  className: 'spinner', // The CSS class to assign to the spinner
  position: 'absolute', // Element positioning,
};

const apiServise = new PixabayApiServise();

const refs = {
  searchForm: document.getElementById('search-form'),
  gallery: document.getElementById('cards-js'),
  more: document.getElementById('more'),
  modal: document.getElementById('modal-js'),
  largeImg: document.querySelector('.image-large'),
  btnSearch: document.getElementById('search'),
  spin: document.getElementById('spin'),
  spinMore: document.getElementById('spinMore'),
  spinModal: document.getElementById('spinModal'),
};

const spinner = new Spinner(opts);
const spinnerMore = new Spinner(optsMore);
const spinnerModal = new Spinner(optsModal);

refs.searchForm.addEventListener('submit', onSearch);
refs.more.addEventListener('click', onLoadMore);
refs.gallery.addEventListener('click', showLargeImg);
refs.modal.addEventListener('click', hideModal);

function hideModal() {
  refs.modal.classList.add('is-hidden');
  setAttrImg('', '', 'hidden');
}

function waitingForLoading() {
  const refImg = document.querySelectorAll('.image');

  for (let i = 0; i < refImg.length; i += 1) {
    refImg[i].addEventListener(
      'load',
      () => {
        refImg[i].classList.add('show');
      },
      { once: true },
    );
  }

  spinner.stop();
  spinnerMore.stop();
}

function onSearch(e) {
  e.preventDefault();
  refs.btnSearch.setAttribute('disabled', 'disabled');
  spinner.spin(refs.spin);
  apiServise.query = e.currentTarget.elements.input.value;
  if (!apiServise.query.trim()) return alert('Надо что-нибудь ввести в строку поиска!');
  apiServise.resetPage();
  clearMarkUp();
  onLoad();
}

const onLoad = async () => {
  apiServise
    .fetchImages()
    .then(data => onMarkUp(data))
    .catch(data => alert(`Ошибка: ${data}`));
};

function onLoadMore() {
  spinnerMore.spin(refs.spinMore);
  refs.more.setAttribute('disabled', 'disabled');
  onLoad();
}

function onMarkUp(data) {
  if (parseInt(data.hits.length) > 0) {
    refs.gallery.insertAdjacentHTML('beforeend', listCards(data.hits));
    const maxPageCount = Math.ceil(data.total / apiServise.pPage);
    refs.more.style.display = apiServise.page <= maxPageCount ? 'block' : 'none';
  } else {
    alert('Ни чего не найдено!');
  }

  if (refs.btnSearch.hasAttribute('disabled')) refs.btnSearch.removeAttribute('disabled');
  if (refs.more.hasAttribute('disabled')) refs.more.removeAttribute('disabled');

  waitingForLoading();
  scrollPage();
}

function clearMarkUp() {
  refs.gallery.innerHTML = '';
  refs.more.style.display = 'none';
}

function showLargeImg(e) {
  if (!e.target.dataset.src) return;

  refs.modal.classList.remove('is-hidden');
  spinnerModal.spin(spinModal);
  const refImgLarge = document.querySelector('.image-large');

  setAttrImg(e.target.dataset.src, e.target.alt, 'show');

  refImgLarge.addEventListener('load', () => {
    spinnerModal.stop();
  });
}

function setAttrImg(src, alt, status) {
  refs.largeImg.src = src;
  refs.largeImg.alt = alt;

  if (status === 'show') refs.largeImg.classList.add('js-show');
  else refs.largeImg.classList.remove('js-show');
}

function scrollPage() {
  const refGalleryItem = document.querySelectorAll('.gallery__item');

  if (refGalleryItem.length > apiServise.pPage) {
    refGalleryItem[refGalleryItem.length - apiServise.pPage].scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
