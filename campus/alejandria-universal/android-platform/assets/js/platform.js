document.addEventListener('DOMContentLoaded',()=>{
  const q = document.getElementById('q');
  if(q){
    q.addEventListener('input',()=>{
      const v=q.value.toLowerCase().trim();
      document.querySelectorAll('[data-search]').forEach(el=>{
        const hay = el.getAttribute('data-search').toLowerCase();
        el.style.display = !v || hay.includes(v) ? '' : 'none';
      });
    });
  }
  // mark progress locally
  const id=document.body.dataset.pageId;
  if(id){
    let done=JSON.parse(localStorage.getItem('android-done')||'[]');
    if(!done.includes(id)){done.push(id);localStorage.setItem('android-done',JSON.stringify(done));}
    const pct = Math.min(100, Math.round(done.length/211*100));
    const bar=document.querySelector('.bar');
    if(bar) bar.style.width=pct+'%';
    const pctEl=document.getElementById('pct'); if(pctEl) pctEl.textContent=pct+'%';
  }
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      e.preventDefault();
      document.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior:'smooth'});
    });
  });
});
