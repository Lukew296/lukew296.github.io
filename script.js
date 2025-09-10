// Replace this with your own YouTube Data API key!
const API_KEY = "YOUR_YOUTUBE_API_KEY";

const form = document.getElementById('searchForm');
const results = document.getElementById('results');
const playerModal = document.getElementById('playerModal');
const videoPlayer = document.getElementById('videoPlayer');
const closeBtn = document.getElementById('closeBtn');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('searchQuery').value.trim();
    if (!query) return;
    searchYouTube(query);
});

function searchYouTube(query) {
    results.innerHTML = '<p>Loading...</p>';
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=${encodeURIComponent(query)}&key=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            results.innerHTML = '';
            if (!data.items) {
                results.innerHTML = '<p>No videos found.</p>';
                return;
            }
            data.items.forEach(item => {
                const { videoId } = item.id;
                const { title, thumbnails } = item.snippet;
                const thumb = thumbnails.medium.url;
                const card = document.createElement('div');
                card.className = 'video-card';
                card.innerHTML = `
                    <img class="thumbnail" src="${thumb}" alt="Thumbnail">
                    <div class="title">${title}</div>
                `;
                card.onclick = () => showPlayer(videoId);
                results.appendChild(card);
            });
        })
        .catch(err => {
            results.innerHTML = '<p>Error loading videos.</p>';
            console.error(err);
        });
}

function showPlayer(videoId) {
    playerModal.style.display = 'flex';
    videoPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
}

closeBtn.onclick = function() {
    playerModal.style.display = 'none';
    videoPlayer.src = '';
};

window.onclick = function(event) {
    if (event.target === playerModal) {
        playerModal.style.display = 'none';
        videoPlayer.src = '';
    }
};
