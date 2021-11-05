export default class PixabayApiServise {
  constructor() {
    this.sQuery = '';
    this.pageNum = 1;
    this.perPage = 12;
    this.API_KEY = '24165340-8b0e7a7ee772979b6a936f118';
  }

  fetchArticles = async () => {
    const URL = `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${this.sQuery}&page=${this.pageNum}&per_page=${this.perPage}&key=${this.API_KEY}`;

    const response = await fetch(URL);
    const data = response.json();
    console.log(data);
    this.incrementPage();
    return data;
  };

  incrementPage() {
    this.pageNum += 1;
  }

  resetPage() {
    this.pageNum = 1;
  }

  get query() {
    return this.sQuery;
  }

  set query(newQuery) {
    return (this.sQuery = newQuery);
  }
}
