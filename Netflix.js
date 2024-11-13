
        const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c';
        const BASE_URL = 'https://api.themoviedb.org/3';
        const IMG_URL = 'https://image.tmdb.org/t/p/w500';
    
        async function fetchMovies(category = 'popular') {
          try {
            const response = await axios.get(`${BASE_URL}/movie/${category}?api_key=${API_KEY}`);
            const movies = response.data.results;
            displayMovies(movies);
          } catch (error) {
            console.error('Error fetching movies:', error);
          }
        }
    
        function displayMovies(movies) {
          const movieGrid = document.getElementById('movieGrid');
          movieGrid.innerHTML = '';
          movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            movieCard.innerHTML = `
              <img src="${IMG_URL + movie.poster_path}" alt="${movie.title} poster" class="movie-poster">
              <div class="movie-info">
                <div class="movie-title">${movie.title}</div>
                <div class="movie-rating">
                  <svg class="star-icon" viewBox="0 0 24 24">
                    <path fill="#ffd700" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                  ${movie.vote_average.toFixed(1)}
                </div>
              </div>
            `;
            movieCard.addEventListener('click', () => openMovieModal(movie.id));
            movieGrid.appendChild(movieCard);
          });
        }
    
        // Category selection
        const categoryButtons = document.querySelectorAll('.category-button');
        categoryButtons.forEach(button => {
          button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            fetchMovies(button.dataset.category);
          });
        });
    
        // Search functionality
        const searchInput = document.querySelector('.search-input');
        const searchButton = document.querySelector('.search-button');
    
        async function searchMovies(query) {
          try {
            const response = await axios.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
            const movies = response.data.results;
            displayMovies(movies);
          } catch (error) {
            console.error('Error searching movies:', error);
          }
        }
    
        searchButton.addEventListener('click', () => {
          const query = searchInput.value.trim();
          if (query) {
            searchMovies(query);
          }
        });
    
        searchInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
              searchMovies(query);
            }
          }
        });
    
        // Movie modal functionality
        const modal = document.getElementById('movieModal');
        const closeBtn = document.getElementsByClassName('close')[0];
        const movieTrailer = document.getElementById('movieTrailer');
        const movieDetails = document.getElementById('movieDetails');
    
        async function openMovieModal(movieId) {
          try {
            const movieResponse = await axios.get(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos`);
            const movie = movieResponse.data;
            
            let trailerKey = '';
            if (movie.videos && movie.videos.results.length > 0) {
              const trailer = movie.videos.results.find(video => video.type === 'Trailer') || movie.videos.results[0];
              trailerKey = trailer.key;
            }
    
            movieTrailer.src = `https://www.youtube.com/embed/${trailerKey}`;
            movieDetails.innerHTML = `
              <h2>${movie.title}</h2>
              <p><strong>Release Date:</strong> ${movie.release_date}</p>
              <p><strong>Runtime:</strong> ${movie.runtime} minutes</p>
              <p><strong>Rating:</strong> ${movie.vote_average.toFixed(1)}/10</p>
              <p><strong>Overview:</strong> ${movie.overview}</p>
            `;
    
            modal.style.display = 'block';
          } catch (error) {
            console.error('Error fetching movie details:', error);
          }
        }
    
        closeBtn.onclick = function() {
          modal.style.display = 'none';
          movieTrailer.src = '';
        }
    
        window.onclick = function(event) {
          if (event.target == modal) {
            modal.style.display = 'none';
            movieTrailer.src = '';
          }
        }
    
        // Initial load
        fetchMovies();
  
