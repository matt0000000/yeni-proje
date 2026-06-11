const E="https://image.tmdb.org/t/p/w92",$="https://image.tmdb.org/t/p/w342",f="https://image.tmdb.org/t/p/original",v=document.getElementById("page"),c=document.getElementById("search"),L=document.getElementById("spinner"),u=document.getElementById("clear-btn"),p=document.getElementById("results"),r=document.getElementById("empty"),m=document.getElementById("overlay"),b=document.getElementById("modal-body"),_=document.getElementById("modal-close");let g;function h(e){L.style.display=e?"block":"none",e||k()}function k(){u.style.display=c.value?"flex":"none"}c.addEventListener("input",()=>{k(),clearTimeout(g),g=setTimeout(()=>B(c.value),350)});u.addEventListener("click",()=>{c.value="",u.style.display="none",p.innerHTML="",r.style.display="none",v.classList.remove("has-results"),c.focus()});async function B(e){if(!e.trim()){p.innerHTML="",r.style.display="none",v.classList.remove("has-results");return}h(!0);try{const t=await(await fetch(`/api/search?q=${encodeURIComponent(e)}`)).json();I(t.results,e)}finally{h(!1)}}function I(e,s){if(p.innerHTML="",v.classList.toggle("has-results",!0),!e.length){r.textContent=`"${s}" için sonuç bulunamadı.`,r.style.display="block";return}r.style.display="none",e.forEach(t=>{const a=t.title??t.name??"",n=(t.release_date??t.first_air_date??"").slice(0,4),l=t.media_type==="movie"?"Film":"Dizi",d=t.poster_path?E+t.poster_path:null,o=document.createElement("li");o.innerHTML=`
        <button class="result-row" type="button">
          ${d?`<img class="thumb" src="${d}" alt="" loading="lazy" />`:'<div class="thumb thumb-empty">🎬</div>'}
          <div class="result-text">
            <span class="result-title">${i(a)}</span>
            <span class="result-meta">${n?n+" · ":""}${l}</span>
          </div>
          <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>`,o.querySelector("button").addEventListener("click",()=>w(t)),p.appendChild(o)})}async function w(e){m.classList.add("open"),document.body.style.overflow="hidden";const s=e.title??e.name??"",t=(e.release_date??e.first_air_date??"").slice(0,4),a=e.media_type==="movie"?"Film":"Dizi",n=e.poster_path?$+e.poster_path:null;b.innerHTML=`
      ${n?`<div class="modal-backdrop" style="background-image:url('${f}${e.backdrop_path||e.poster_path}')"></div>`:""}
      <div class="modal-content">
        <div class="modal-meta">
          ${n?`<img class="modal-poster" src="${n}" alt="${i(s)}" />`:""}
          <div class="modal-text">
            <h2>${i(s)}</h2>
            <p class="modal-year">${t?t+" · ":""}${a}</p>
          </div>
        </div>
        <div class="modal-loading" id="modal-providers-loading">
          <div class="modal-spinner"></div>
          <p>Platform bilgisi yükleniyor…</p>
        </div>
        <div id="modal-providers"></div>
      </div>`;const d=await(await fetch(`/api/providers?id=${e.id}&type=${e.media_type}`)).json();document.getElementById("modal-providers-loading").remove();const o=d.detail?.overview||e.overview||"";o&&document.querySelector(".modal-text").insertAdjacentHTML("beforeend",`<p class="modal-overview">${i(o)}</p>`),M(d.tr,document.getElementById("modal-providers"))}const T=[{key:"flatrate",label:"Abonelik (Streaming)"},{key:"rent",label:"Kiralık"},{key:"buy",label:"Satın Al"},{key:"free",label:"Ücretsiz"},{key:"ads",label:"Reklamsız Ücretsiz"}];function M(e,s){if(!e){s.innerHTML=`<div class="no-providers"><span class="emoji">😔</span><p>Bu içerik şu an Türkiye'de hiçbir platformda mevcut değil.</p></div>`;return}let t="";T.forEach(({key:a,label:n})=>{e[a]?.length&&(t+=`<div class="provider-group"><h3>${n}</h3><div class="provider-list">`,e[a].forEach(l=>{t+=`<div class="provider"><img src="${f}${l.logo_path}" alt="${i(l.provider_name)}" loading="lazy" /><span>${i(l.provider_name)}</span></div>`}),t+="</div></div>")}),s.innerHTML=t||`<div class="no-providers"><span class="emoji">😔</span><p>Bu içerik şu an Türkiye'de hiçbir platformda mevcut değil.</p></div>`}function y(){m.classList.remove("open"),document.body.style.overflow="",b.innerHTML=""}_.addEventListener("click",y);m.addEventListener("click",e=>{e.target===m&&y()});document.addEventListener("keydown",e=>{e.key==="Escape"&&y()});function i(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
