// let API_KEY = 'b971c2f0de8767f08d2bb84160ba24b7'

let API_KEY = 'dcea1fd7b3e65d34387ad6de7ef9cc5e'

let top_rated = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&page=`
let popular = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=`
let upcoming = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&page=`

let lastPage = window.localStorage.getItem('lastPage') ?? top_rated;

let lastURL

const appendDiv = document.querySelector(".append");
const nextPageBtn = document.querySelector(".next");
const prevPageBtn = document.querySelector(".prev");
const titlePath = document.querySelector(".title");
const categoryBtns = document.querySelectorAll(".btns");
const searchButton = document.querySelector("#button");

;
(async function () {
    let response = await fetch(lastPage + 1)
    response = await response.json()
    let filmsArray = response.results
    appendDiv.innerHTML = null
    for (let film of filmsArray) {
        let appendFilm = creatorHTML(film)
        appendDiv.innerHTML += appendFilm
    }
    nullingInputsTextContent()
    categoryBtns.forEach(btn => {
        btn.addEventListener("click", (event) => {
            event.preventDefault()
            filmsRender(btn.value, 1)
        })
    })
})()

async function filmsRender(url, pageNum) {
    lastURL = url
    lastPage = url == "top_rated" ? top_rated : url == "popular" ? popular : url == "upcoming" ? upcoming : upcoming
    window.localStorage.setItem('lastPage', lastPage)
    let response = await fetch(lastPage + pageNum)
    response = await response.json()
    let filmsArray = response.results
    appendDiv.innerHTML = null
    for (let film of filmsArray) {
        let appendFilm = creatorHTML(film)
        appendDiv.innerHTML += appendFilm
    }
    nullingInputsTextContent()
}

function creatorHTML(data) {
    return ` <div class="movie">
                <img src="${'https://image.tmdb.org/t/p/w500' + data.poster_path}" alt="${data.title}">
                <div class="movie-info">
                    <h3>${data.title}</h3>
                    <span class="orange">${data.vote_average}</span>
                    </div>
                <span class="date">${data.release_date}</span>
                </div>`
}

function nullingInputsTextContent() {
    search.value = null
    min.value = null
    max.value = null
    score.value = null
    search.value = null
}

searchButton.addEventListener("click", async (event) => {
    event.preventDefault()
    let searchValue = search.value ? search.value : ''.toLowerCase()
    let minValue = min.value ? min.value : 1900
    let maxValue = max.value ? max.value : 2025
    let scoreValue = score.value ? score.value : 1.1
    let filteredFilms = []
    let response = await fetch(lastPage + 1)
    response = await response.json()
    filteredFilms = response.results.filter(film => film.release_date.split('-')[0] >= minValue && film.release_date.split('-')[0] <= maxValue)
    filteredFilms = filteredFilms.filter(film => film.vote_average >= scoreValue)
    filteredFilms = filteredFilms.filter(film => film.original_title.toLowerCase().includes(searchValue))
    appendDiv.innerHTML = null
    for (let film of filteredFilms) {
        let appendFilm = creatorHTML(film)
        appendDiv.innerHTML += appendFilm
    }
})

nextPageBtn.addEventListener("click", (event) => {
    event.preventDefault()
    if (appendDiv.innerHTML.length < 500) return
    titlePath.textContent = +titlePath.textContent + 1
    filmsRender(lastURL, titlePath.textContent)
})

prevPageBtn.addEventListener("click", (event) => {
    event.preventDefault()
    if (titlePath.textContent == 1) return
    titlePath.textContent = titlePath.textContent > 1 ? titlePath.textContent - 1 : titlePath.textContent
    filmsRender(lastURL, titlePath.textContent)
})