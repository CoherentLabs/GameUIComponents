var suggestionsWrapper = document.getElementById('suggestions-wrapper');
var loader = suggestionsWrapper.querySelector('#loader-container');
var suggestions = document.getElementById('suggestions');
var search = document.getElementById('search');
const form = document.getElementById('form-search');

let baseUrl = "";

baseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
(function () {
  let entries = [];
  let searchScheduled = false;
  search.addEventListener('input', show_results, true);
  show_results();

  function showMoreResults(searchQuery) {
    if (searchQuery) window.localStorage.setItem('searchQuery', searchQuery);
    const searchUrl = window.siteLanguage ? `${window.siteLanguage}/search` : 'search';
    window.location.href = baseUrl + searchUrl;
  }

  function displayShowMoreFooter(searchQuery) {
    const searchFooter = document.createElement('div');
    searchFooter.onclick = () => showMoreResults(searchQuery);
    searchFooter.innerHTML = '<a onclick="return false;" href="/"><span style="width:100%; display:flex; justify-content:center;" class="suggestion__description"><b>Show more</b></span></a>';
    suggestions.appendChild(searchFooter);
  }

  function clearPrevResults() {
    entries = [];
    suggestions.innerHTML = "";
    loader.classList.add('d-none');
    suggestions.classList.remove('d-none');
  }

  function addLoader() {
    loader.classList.remove('d-none');
  }

  function show_results(limit) {
    if (!search.value) {
      searchScheduled = false;
      clearPrevResults();
      return;
    }

    if (!window.searchIndexReady) {
      if (searchScheduled) return;

      addLoader();
      search.addEventListener('search-index-ready', show_results);
      searchScheduled = true;
      return;
    }
    search.removeEventListener('search-index-ready', show_results);

    clearPrevResults();
    if (isNaN(limit)) limit = 3;
    var searchQuery = this.value;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      showMoreResults(searchQuery);
    }, true)

    const [resultIds, resultTitlesIds] = getIndexResults(searchQuery, limit);

    if (!hasResultsForQuery(resultIds, resultTitlesIds, searchQuery)) return;

    // construct a list of suggestions
    constructTitleSuggestions(entries, resultTitlesIds, 'suggestion__description');

    // construct a list of suggestions
    constructContentSuggestions(entries, searchQuery, resultIds, 'suggestion__description', limit);

    if (entries.length) {
      for (const entry of entries) {
        suggestions.appendChild(entry);
      }
    } else {
      return displayNoResultsElement(searchQuery);
    }

    displayShowMoreFooter(searchQuery);
  }
}());