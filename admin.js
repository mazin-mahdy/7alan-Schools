// admin.js
document.addEventListener('DOMContentLoaded', ()=> {
  // load current courses (saved or default)
  const saved = localStorage.getItem('coursesData');
  let courses = saved ? JSON.parse(saved) : (window.defaultCourses || []);

  const categoriesList = document.getElementById('categoriesList');
  const addCategoryBtn = document.getElementById('addCategoryBtn');
  const newCategoryName = document.getElementById('newCategoryName');
  const saveBtn = document.getElementById('saveBtn');
  const resetBtn = document.getElementById('resetBtn');
  const exportBtn = document.getElementById('exportBtn');
  const importBtn = document.getElementById('importBtn');
  const importArea = document.getElementById('importArea');

  function render() {
    categoriesList.innerHTML = '';
    courses.forEach((cat, ci) => {
      const card = document.createElement('div');
      card.className = 'category-card';

      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.alignItems = 'center';

      const title = document.createElement('strong');
      title.textContent = cat.category;
      header.appendChild(title);

      const right = document.createElement('div');

      const renameBtn = document.createElement('button');
      renameBtn.className = 'btn btn-ghost small';
      renameBtn.textContent = 'Rename';
      renameBtn.onclick = ()=> {
        const val = prompt('New category name', cat.category);
        if (val) { cat.category = val.trim(); render(); }
      };
      right.appendChild(renameBtn);

      const delBtn = document.createElement('button');
      delBtn.className = 'btn small';
      delBtn.textContent = 'Delete';
      delBtn.style.marginLeft = '8px';
      delBtn.onclick = ()=> {
        if (confirm('Delete category and all its videos?')) {
          courses.splice(ci,1); render();
        }
      };
      right.appendChild(delBtn);

      header.appendChild(right);
      card.appendChild(header);

      // videos
      const vidWrap = document.createElement('div');
      vidWrap.style.marginTop = '12px';

      (cat.videos || []).forEach((v, vi) => {
        const row = document.createElement('div');
        row.className = 'video-item';

        // title input
        const titleIn = document.createElement('input');
        titleIn.value = v.title || '';
        titleIn.placeholder = 'Video title';
        titleIn.oninput = ()=> v.title = titleIn.value;

        // embed/link input
        const srcIn = document.createElement('input');
        srcIn.value = v.embed || v.link || '';
        srcIn.placeholder = 'Paste embed URL (embed/ID) OR link';
        srcIn.oninput = ()=> {
          // naive: if contains '/embed/' treat as embed, otherwise treat as link
          const val = srcIn.value.trim();
          if (val.includes('/embed/')) {
            v.embed = val;
            delete v.link; delete v.thumbnail;
          } else if (val.includes('youtube.com/watch') || val.includes('youtu.be')) {
            v.link = val;
            // try to set thumbnail
            const id = extractYouTubeID(val);
            if (id) v.thumbnail = `https://img.youtube.com/vi/${id}/0.jpg`;
            delete v.embed;
          } else {
            // allow direct embed or other urls
            if (val) { v.embed = val; delete v.link; delete v.thumbnail; }
            else { delete v.embed; delete v.link; delete v.thumbnail; }
          }
        };

        // delete video
        const vDel = document.createElement('button');
        vDel.className = 'btn small';
        vDel.textContent = 'Remove';
        vDel.onclick = ()=> { cat.videos.splice(vi,1); render(); }

        row.appendChild(titleIn);
        row.appendChild(srcIn);
        row.appendChild(vDel);
        vidWrap.appendChild(row);
      });

      // add new video button
      const addVidRow = document.createElement('div');
      addVidRow.style.marginTop = '10px';
      const addVidBtn = document.createElement('button');
      addVidBtn.className = 'btn btn-primary small';
      addVidBtn.textContent = 'Add Video';
      addVidBtn.onclick = ()=> {
        cat.videos = cat.videos || [];
        cat.videos.push({ title: 'New Video', embed: '' });
        render();
      };
      addVidRow.appendChild(addVidBtn);
      card.appendChild(vidWrap);
      card.appendChild(addVidRow);

      categoriesList.appendChild(card);
    });
  }

  addCategoryBtn.addEventListener('click', ()=> {
    const name = (newCategoryName.value || '').trim();
    if (!name) return alert('Enter category name');
    courses.push({ category: name, videos: [] });
    newCategoryName.value = '';
    render();
  });

  saveBtn.addEventListener('click', ()=> {
    localStorage.setItem('coursesData', JSON.stringify(courses));
    alert('Saved to localStorage.coursesData — open/refresh index.html to see changes');
  });

  resetBtn.addEventListener('click', ()=> {
    if (!confirm('Reset to default courses? This will overwrite local edits.')) return;
    localStorage.removeItem('coursesData');
    courses = window.defaultCourses ? JSON.parse(JSON.stringify(window.defaultCourses)) : [];
    render();
  });

  exportBtn.addEventListener('click', ()=> {
    const json = JSON.stringify(courses, null, 2);
    // copy to clipboard if possible
    navigator.clipboard?.writeText(json).then(()=> alert('JSON copied to clipboard'), ()=> {
      // fallback: open in new tab
      const w = window.open();
      w.document.write('<pre>'+escapeHtml(json)+'</pre>');
    });
  });

  importBtn.addEventListener('click', ()=> {
    const text = importArea.value.trim();
    if (!text) return alert('Paste JSON into import area first');
    try {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) throw new Error('Invalid format: expected array');
      courses = parsed;
      alert('Imported (not yet saved). Click Save & Publish to persist.');
      render();
    } catch (err) {
      alert('Import failed: ' + err.message);
    }
  });

  function extractYouTubeID(url) {
    if (!url) return null;
    const m = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?&]+)/) || url.match(/\/embed\/([^?&]+)/);
    return m ? m[1] : null;
  }
  function escapeHtml(str){ return str.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

  // initial render
  render();
});
