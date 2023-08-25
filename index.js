var suggestionsWrapper = document.getElementById('suggestions-wrapper');
var loader = suggestionsWrapper.querySelector('#loader-container');
var suggestions = document.getElementById('suggestions');
var search = document.getElementById('search');
const form = document.getElementById('form-search');

const MAX_LIMIT_PAGE_ENTRIES = 300; // https://github.com/nextapps-de/flexsearch#limit--offset
const pagesCount = parseInt('60');
// This value has impact on the search performance.
const searchDocumentsLimit = (pagesCount > MAX_LIMIT_PAGE_ENTRIES) ? MAX_LIMIT_PAGE_ENTRIES : pagesCount;

let baseUrl = "https://CoherentLabs.github.io/GameUIComponents/";

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

  function show_results() {
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
    const searchQuery = this.value;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      showMoreResults(searchQuery);
    }, true)

    const [resultIds, resultTitlesIds] = getIndexResults(index, searchQuery, searchDocumentsLimit);

    if (!hasResultsForQuery(resultIds, resultTitlesIds, searchQuery)) return;

    // construct a list of suggestions
    constructTitleSuggestions(entries, resultTitlesIds, 'suggestion__description', true);

    const RESULTS_PER_DOCUMENT_LIMIT = 3;
    // construct a list of suggestions
    constructContentSuggestions(entries, searchQuery, resultIds, 'suggestion__description', true, RESULTS_PER_DOCUMENT_LIMIT);

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
