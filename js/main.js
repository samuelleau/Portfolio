// Navigation toggle + active link highlight + smooth scroll + modal gallery
(function(){
  // Mobile nav toggle
  const navToggle=document.querySelector('.nav-toggle');
  const nav=document.querySelector('.nav');
  if(navToggle && nav){
    navToggle.addEventListener('click',()=>{
      const open=nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const id=a.getAttribute('href');
      if(id.length>1){ e.preventDefault(); document.querySelector(id)?.scrollIntoView({behavior:'smooth'}); nav?.classList.remove('open'); navToggle?.setAttribute('aria-expanded','false'); }
    });
  });

  // Active section highlight
  const links=Array.from(document.querySelectorAll('.nav-link'));
  const sections=links.map(l=>document.querySelector(l.getAttribute('href'))).filter(Boolean);
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(ent=>{
      if(ent.isIntersecting){
        links.forEach(l=>l.classList.toggle('active', l.getAttribute('href')==='#'+ent.target.id));
      }
    });
  },{rootMargin:'-40% 0px -55% 0px', threshold:[0,1]});
  sections.forEach(s=>io.observe(s));
})();

// Project modal + gallery
(function(){
  const modal=document.getElementById('project-modal');
  if(!modal) return;
  const imgEl=modal.querySelector('#project-modal-image');
  const titleEl=modal.querySelector('#project-modal-title');
  const descEl=modal.querySelector('#project-modal-description');
  const toolsEl=modal.querySelector('#project-modal-tools');
  const linkEl=modal.querySelector('#project-modal-link');
  const githubEl=modal.querySelector('#project-modal-github');
  const thumbsEl=modal.querySelector('#project-modal-thumbs');
  const prevBtn=modal.querySelector('.carousel-btn.prev');
  const nextBtn=modal.querySelector('.carousel-btn.next');

  let gallery=[]; let idx=0;

  function renderImage(){
    if(!gallery.length) return;
    imgEl.src=gallery[idx];
    imgEl.alt=`Image ${idx+1} of ${gallery.length}`;
    Array.from(thumbsEl.children).forEach((t,i)=>t.classList.toggle('active', i===idx));
  }

  function openModalFromCard(card){
    const title = card.getAttribute('data-title') || 'Project';
    const desc = card.getAttribute('data-description') || '';
    const tools = (card.getAttribute('data-tools') || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

    const link = card.getAttribute('data-link');   // no fallback
    const github = card.getAttribute('data-github'); // no fallback
    const images = (card.getAttribute('data-images') || '')
        .split('|')
        .map(s => s.trim())
        .filter(Boolean);

    // Populate text
    titleEl.textContent = title;
    descEl.innerHTML= desc;

    // Tools
    toolsEl.innerHTML = '';
    tools.forEach(t => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = t;
      toolsEl.appendChild(span);
    });

    // Links: show/hide depending on presence
    if (link) {
      linkEl.href = link;
      linkEl.style.display = '';  // show
    } else {
      linkEl.style.display = 'none'; // hide
    }

    if (github) {
      githubEl.href = github;
      githubEl.style.display = '';
    } else {
      githubEl.style.display = 'none';
    }

    // Images
    gallery = images.length ? images : [card.querySelector('img')?.src].filter(Boolean);
    idx = 0;
    thumbsEl.innerHTML = '';
    gallery.forEach((src,i) => {
      const ti = document.createElement('img');
      ti.src = src;
      ti.alt = `Thumb ${i+1}`;
      if (i===0) ti.classList.add('active');
      ti.addEventListener('click',()=>{ idx=i; renderImage(); });
      thumbsEl.appendChild(ti);
    });

    renderImage();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }


  function closeModal(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }

  prevBtn.addEventListener('click',()=>{ if(!gallery.length) return; idx=(idx-1+gallery.length)%gallery.length; renderImage(); });
  nextBtn.addEventListener('click',()=>{ if(!gallery.length) return; idx=(idx+1)%gallery.length; renderImage(); });

  document.querySelectorAll('.project-card').forEach(card=>{
    card.addEventListener('click',()=>openModalFromCard(card));
    card.addEventListener('keydown',(e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); openModalFromCard(card); } });
  });

  modal.addEventListener('click',(e)=>{ if(e.target.closest('[data-close="modal"]') || e.target.classList.contains('modal-backdrop')) closeModal(); });
  window.addEventListener('keydown',(e)=>{ if(e.key==='Escape' && modal.classList.contains('open')) closeModal(); });
})();

document.addEventListener('DOMContentLoaded', function() {
  // Remove the cursor after animation completes
  const cursor = document.querySelector('.cursor');
  if (cursor) {
    setTimeout(() => {
      cursor.style.display = 'none';
    }, 2000); // Match this with the typing animation duration
  }
});

// Achievement Modal
(function() {
  const achievementModal = document.getElementById('achievement-modal');
  if (!achievementModal) return;
  
  const modalTitle = document.getElementById('achievement-modal-title');
  const modalDescription = document.getElementById('achievement-modal-description');
  const modalImage = document.getElementById('achievement-modal-image');
  const modalTechTags = document.getElementById('achievement-modal-tech-tags');
  const modalThumbnails = document.getElementById('achievement-modal-thumbnails');

  function closeModal() {
    achievementModal.setAttribute('aria-hidden', 'true');
    achievementModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.achievement-card').forEach(card => {
    card.addEventListener('click', () => {
      // Set title, description and image
      modalTitle.textContent = card.dataset.title || '';
      modalDescription.textContent = card.dataset.description || '';
      modalImage.src = card.dataset.image || '';
      modalImage.alt = card.dataset.title || 'Achievement';

      // Populate tech tags
      if (modalTechTags) {
        modalTechTags.innerHTML = '';
        const techTags = card.dataset.tech || '';
        if (techTags) {
          techTags.split(',').forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.className = 'tech-tag';
            tagEl.textContent = tag.trim();
            modalTechTags.appendChild(tagEl);
          });
        }
      }

      // Populate thumbnails
      if (modalThumbnails) {
        modalThumbnails.innerHTML = '';
        const thumbnails = card.dataset.thumbnails || '';
        if (thumbnails) {
          thumbnails.split('|').forEach((thumbSrc, index) => {
            const thumbImg = document.createElement('img');
            thumbImg.src = thumbSrc.trim();
            thumbImg.alt = `Thumbnail ${index + 1}`;
            if (index === 0) thumbImg.classList.add('active');
            
            // Click thumbnail to change main image
            thumbImg.addEventListener('click', () => {
              modalImage.src = thumbSrc.trim();
              modalThumbnails.querySelectorAll('img').forEach(img => img.classList.remove('active'));
              thumbImg.classList.add('active');
            });
            
            modalThumbnails.appendChild(thumbImg);
          });
        }
      }

      achievementModal.setAttribute('aria-hidden', 'false');
      achievementModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal handlers
  achievementModal.querySelectorAll('[data-close="achievement-modal"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });
  });

  const backdrop = achievementModal.querySelector('.modal-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', closeModal);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && achievementModal.classList.contains('open')) {
      closeModal();
    }
  });
})();

// Achievements Show More/Less Toggle
(function() {
  const achievementsGrid = document.querySelector('.achievements-grid');
  const toggleContainer = document.querySelector('.achievements-toggle-container');
  const toggleBtn = document.getElementById('achievements-show-more-btn');
  
  if (!achievementsGrid || !toggleContainer || !toggleBtn) return;
  
  const achievementCards = Array.from(achievementsGrid.querySelectorAll('.achievement-card'));
  const maxVisible = 3;
  
  // Only show toggle button if there are more than 3 achievements
  if (achievementCards.length > maxVisible) {
    toggleContainer.style.display = 'block';
    
    // Hide achievements beyond the first 3
    achievementCards.forEach((card, index) => {
      if (index >= maxVisible) {
        card.classList.add('hidden');
      }
    });
    
    // Toggle button click handler
    let isExpanded = false;
    toggleBtn.addEventListener('click', () => {
      isExpanded = !isExpanded;
      
      achievementCards.forEach((card, index) => {
        if (index >= maxVisible) {
          if (isExpanded) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        }
      });
      
      // Update button text and icon
      if (isExpanded) {
        toggleBtn.innerHTML = 'Show Less <i class="fas fa-chevron-up"></i>';
        toggleBtn.classList.add('expanded');
      } else {
        toggleBtn.innerHTML = 'Show More <i class="fas fa-chevron-down"></i>';
        toggleBtn.classList.remove('expanded');
      }
    });
  }
})();
