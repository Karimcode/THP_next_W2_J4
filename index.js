// Threshold and query
const thresholdRatio = 0.15;
const minimumqueryLength = 3;
const errorMessage = "An error ocurred. Please retry later"

const endPoint = 'http://www.omdbapi.com/?apikey=aa5ebc2'// Provide your own API key !!!

// DOM 
const form = document.querySelector('form');
const queryZone = document.querySelector('#query');
const filmList = document.querySelector('#filmList');

const modal = document.querySelector('.modal');
const btnClose = document.querySelector('#btn_close');
const detailTitle = document.querySelector('#detail_title');
const detailPlot = document.querySelector('#detail_plot');

// Film apparition in cards
const filmCard = (film, filmListZone) => {
  filmListZone.innerHTML += `
  <div class='col col-3 mx-1 my-5 film_card card border invisibility'>
    <img class="poster rounded" src="${film.Poster}" alt="${film.Title} poster">
    <p class='title_text'>${film.Title} -${film.Year}- </p>
    <button id="${film.imdbID}" onclick="showfilmDetail('${film.imdbID}')" 
    class='btn_detail btn btn-info mb-3'>Read More</button>
  </div>`
}

const showfilmDetail = (filmId) => {
  modal.style.display = 'block';
  fetch(url('i', filmId))

  .then((response) => (response.json()))
  .then((response) => {
    fillModal(`${response.Title} - ${response.Released} -`, response.Plot)
  }).catch((error) => {
    console.log(error);
    fillModal('Error', errorMessage);
  })
}

const filmsCall = (queryZone) => {
  filmList.innerHTML = "<p class='upload'>We are looking for your films. Please wait.</p>"
  fetch(url('s', queryZone.value))
  .then((response) => (response.json()))
  .then((response) => {
    filmList.innerHTML = "";
    response.Search.forEach((item) => { filmCard(item, filmList) })
    
    // Intersection observer 
    let observer = new IntersectionObserver(
      (entries) => { cardsAnimation(entries);},
      { threshold: thresholdRatio }
    );
    document.querySelectorAll('.film_card').forEach((item) => { observer.observe(item); });
  }).catch((error) => {
    console.log(error);
    filmList.innerHTML = errorMessage;
  })
}

const fillPage= (e) => {
  e.preventDefault();
    filmsCall(queryZone); 
}

// Page loading
form.onsubmit = fillPage;
btnClose.onclick = () => {
  fillModal("One moment please...", "One moment please") 
  modal.style.display = 'none'; 
}

// Url for movies and animation for cards
const url = (params, value) => { return `${endPoint}&${params}=${value}`}

const fillModal = (title, content) => {
  detailTitle.innerHTML = title;
  detailPlot.innerHTML = content; 
}

const cardsAnimation = (cards) => {
  cards.forEach((card) => {
    if (card.intersectionRatio >= thresholdRatio) {
      card.target.classList.remove('invisibility');
    } else {
      card.target.classList.add('invisibility');
    }
  });
}
