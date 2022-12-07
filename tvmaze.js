"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
let $episodesList = $('#episodesList')
const $searchForm = $("#searchForm");
const $searchTerm = $("#searchForm-term").value
let $showID = ''
let $eps = []


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm($searchTerm) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  
  const res = await axios.get('http://api.tvmaze.com/search/shows', {params: {q: $searchTerm}})
  for(let i = 0; i <res.data.length; i++)
  $showID = res.data[0].show.id
  getEpisodes($showID);
    return [
      {
        id: res.data[0].show.id,
        name: res.data[0].show.name,
        summary: res.data[0].show.summary,
        image: res.data[0].show.image.original
      }
    ];
  }
  
  
  /** Given list of shows, create markup for each and to DOM */
  
  function populateShows(shows) {
    $showsList.empty();
    
    for (let show of shows) {
      const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
        <div class="media">
        <img
        src=${show.image}
        alt="Bletchly Circle San Francisco"
        class="w-25 me-3">
        <div class="media-body">
        <h5 class="text-primary">${show.name}</h5>
        <div><small>${show.summary}</small></div>
        <button class="btn btn-outline-light btn-sm Show-getEpisodes" onclick = 'populateEpisodes($eps)'>
        Episodes
        </button>
        </div>
        </div>
        </div>
        `);
        
    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);
  
  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

async function getEpisodes($showID){
  $eps = []
  const res = await axios.get(`https://api.tvmaze.com/shows/${$showID}/episodes`);
  $eps = res.data
  return res
}

function populateEpisodes($eps){
  $episodesList.empty()
  for(let ep of $eps){
    const epData = $(
      `<li>${ep.name}, (season ${ep.season}, episode ${ep.number})</li>`
      )
      $episodesList.append(epData)
    }
    $episodesArea.show()
  }
  
  /** Given a show ID, get from API and return (promise) array of episodes:
   *      { id, name, season, number }
   */
  
  // async function getEpisodesOfShow(id) { }
  
  /** Write a clear docstring for this function... */
  
  // function populateEpisodes(episodes) { }
  