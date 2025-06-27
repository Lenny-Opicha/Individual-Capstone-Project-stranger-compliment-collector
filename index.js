// DOM Elements
const complimentForm = document.getElementById('compliment-form');
const complimentText = document.getElementById('compliment-text');
const complimentLocation = document.getElementById('compliment-location');
const complimentEmotion = document.getElementById('compliment-emotion');
const filterEmotion = document.getElementById('filter-emotion');
const complimentsContainer = document.getElementById('compliments-container');

const baseURL = 'https://stranger-compliment-collector.onrender.com/compliments';

// Fetch and render all compliments
function fetchCompliments() {
  fetch(baseURL)
    .then(res => res.json())
    .then(data => {
      renderCompliments(data);
    });
}

// Render compliments
function renderCompliments(compliments) {
  complimentsContainer.innerHTML = '';
  compliments.forEach(compliment => {
    complimentsContainer.appendChild(createComplimentCard(compliment));
  });
}

// Create compliment card
function createComplimentCard(compliment) {
  const li = document.createElement('li');
  li.className = 'compliment-card';

  li.innerHTML = `
    <h3>"${compliment.text}"</h3>
    <p><strong>Location:</strong> ${compliment.location}</p>
    <p><strong>Emotion:</strong> ${compliment.emotion}</p>
    <button class="delete-btn" data-id="${compliment.id}">Delete</button>
  `;

  li.querySelector('.delete-btn').addEventListener('click', () => deleteCompliment(compliment.id));

  return li;
}

// Add new compliment
complimentForm.addEventListener('submit', e => {
  e.preventDefault();

  const newCompliment = {
    text: complimentText.value.trim(),
    location: complimentLocation.value.trim(),
    emotion: complimentEmotion.value
  };

  if (!newCompliment.text || !newCompliment.location || !newCompliment.emotion) return;

  fetch(baseURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newCompliment)
  })
    .then(res => res.json())
    .then(compliment => {
      complimentsContainer.appendChild(createComplimentCard(compliment));
      complimentForm.reset();
    });
});

// Filter compliments
filterEmotion.addEventListener('change', () => {
  const selectedEmotion = filterEmotion.value;

  fetch(baseURL)
    .then(res => res.json())
    .then(data => {
      if (selectedEmotion === 'All') {
        renderCompliments(data);
      } else {
        const filtered = data.filter(c => c.emotion === selectedEmotion);
        renderCompliments(filtered);
      }
    });
});

// Delete compliment
function deleteCompliment(id) {
  fetch(`${baseURL}/${id}`, {
    method: 'DELETE'
  }).then(() => {
    fetchCompliments(); // Re-fetch to update UI
  });
}

// Initial load
fetchCompliments();
