// app.js
document.addEventListener('DOMContentLoaded', () => {
  // Auth
  if (!localStorage.getItem('authenticated')) {
    window.location.href = 'login.html';
    return;
  }

  // Load courses: prefer saved data in localStorage
  const saved = localStorage.getItem('coursesData');
  const courses = saved ? JSON.parse(saved) : (window.defaultCourses || []);
  const categoriesContainer = document.getElementById('categoriesContainer');
  const categoryFilter = document.getElementById('categoryFilter');

  // populate filter dropdown
  const names = ['all', ...courses.map(c => c.category)];
  names.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name === 'all' ? 'All Categories' : name;
    categoryFilter.appendChild(opt);
  });

  // Render categories + videos
  function render(filter = 'all', searchText = '') {
    categoriesContainer.innerHTML = '';
    const low = searchText.toLowerCase();
    courses.forEach(cat => {
      if (filter !== 'all' && cat.category !== filter) return;

      // filter videos inside category by search
      const vids = cat.videos.filter(v => (v.title || '').toLowerCase().includes(low) || (v.description || '').toLowerCase().includes(low));
      if (vids.length === 0) return;

      const section = document.createElement('section');
      section.className = 'category-section';
      const title = document.createElement('h2');
      title.className = 'category-title';
      title.textContent = cat.category;
      section.appendChild(title);

      const grid = document.createElement('div');
      grid.className = 'video-grid';

      vids.forEach(v => {
        const card = document.createElement('div');
        card.className = 'video-card';

        const h = document.createElement('h3');
        h.textContent = v.title || 'Untitled';
        card.appendChild(h);

        if (v.embed) {
          const holder = document.createElement('div');
          holder.className = 'video-frame';
          const iframe = document.createElement('iframe');
          iframe.src = v.embed;
          iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
          iframe.allowFullscreen = true;
          holder.appendChild(iframe);
          card.appendChild(holder);
        } else if (v.link && v.thumbnail) {
          const a = document.createElement('a');
          a.href = v.link;
          a.target = '_blank';
          const thumb = document.createElement('div');
          thumb.className = 'thumb';
          const img = document.createElement('img');
          img.src = v.thumbnail;
          img.alt = v.title;
          thumb.appendChild(img);
          a.appendChild(thumb);
          const linkText = document.createElement('p');
          linkText.className = 'watch-link';
          linkText.textContent = '▶ Watch on YouTube';
          a.appendChild(linkText);
          card.appendChild(a);
        } else {
          const p = document.createElement('p');
          p.textContent = 'No playable source.';
          card.appendChild(p);
        }

        const meta = document.createElement('div');
        meta.className = 'meta-row';
        const ch = document.createElement('div');
        ch.textContent = v.channel || '';
        const dur = document.createElement('div');
        dur.textContent = v.duration || '';
        meta.appendChild(ch);
        meta.appendChild(dur);
        card.appendChild(meta);

        grid.appendChild(card);
      });

      section.appendChild(grid);
      categoriesContainer.appendChild(section);
    });
  }

  // initial render
  render();

  // Search on Enter
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      render(categoryFilter.value, searchInput.value || '');
    }
  });

  // filter change
  categoryFilter.addEventListener('change', () => {
    render(categoryFilter.value, searchInput.value || '');
  });

  // logout
  document.getElementById('logoutBtn').addEventListener('click', ()=>{
    localStorage.removeItem('authenticated');
    window.location.href = 'login.html';
  });
});
