/* NetRunner - logika game: save, HUD, halaman, musik, renderer tugas, engine level.
   Butuh levels.js dimuat lebih dulu (lihat index.html). */
const $=s=>document.querySelector(s),SK='netrunner_save_v1',V={};
let S={name:'',done:0,life:100,pts:0,fin:false},tid,snd=true,AC;
try{const x=JSON.parse(localStorage.getItem(SK));if(x&&typeof x=='object')S=Object.assign(S,x)}catch(e){}
const save=()=>{try{localStorage.setItem(SK,JSON.stringify(S))}catch(e){}};
const rank=()=>S.done>=10?'Famous Hacker':S.done>=5?'Advance Coder':'Script Kiddie';
function beep(f=600,d=.08){if(!snd)return;try{ac();const o=AC.createOscillator(),g=AC.createGain();o.type='square';o.frequency.value=f;g.gain.value=.04;o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+d)}catch(e){}}
function hud(){const n=Math.max(0,S.life)/25;$('#hud').innerHTML=`NYAWA <b class="rdc">${S.life}% ${'▮'.repeat(n)}${'▯'.repeat(4-n)}</b> &nbsp;POIN <b class="cy">${S.pts}</b> &nbsp;PERINGKAT <b>${rank()}</b>`}
function ac(){AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state=='suspended')AC.resume();return AC}
const BPM=92,NT=m=>440*2**((m-69)/12),CH=[[57,60,64],[53,57,60],[48,52,55],[55,59,62]];let MG,mt=0,step=0,nxt=0,NB;
function vo(t,f,d,ty,v,lp){const o=AC.createOscillator(),g=AC.createGain(),fl=AC.createBiquadFilter();o.type=ty;o.frequency.value=f;fl.type='lowpass';fl.frequency.value=lp;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(fl);fl.connect(g);g.connect(MG);o.start(t);o.stop(t+d+.05)}
function kick(t){const o=AC.createOscillator(),g=AC.createGain();o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(40,t+.15);g.gain.setValueAtTime(.7,t);g.gain.exponentialRampToValueAtTime(.001,t+.2);o.connect(g);g.connect(MG);o.start(t);o.stop(t+.25)}
function nz(t,d,v,hp){const s=AC.createBufferSource(),g=AC.createGain(),f=AC.createBiquadFilter();s.buffer=NB;f.type='highpass';f.frequency.value=hp;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(f);f.connect(g);g.connect(MG);s.start(t);s.stop(t+d)}
function sched(){while(nxt<AC.currentTime+.25){const s=step%64,i=s&15,c=CH[s>>4],t=nxt;if(i%4==0)kick(t);if(i==4||i==12)nz(t,.16,.25,1500);if(i%4==2)nz(t,.04,.12,7000);if(i%2==0)vo(t,NT(c[0]-12),.24,'sawtooth',.2,450);vo(t,NT(c[[0,1,2,1][i&3]]+12),.14,'square',.04,1800+(s>>2)*40%1400);if(i==0)c.forEach(n=>{vo(t,NT(n),2.4,'sawtooth',.035,900);vo(t,NT(n)*1.006,2.4,'sawtooth',.03,900)});nxt+=60/BPM/4;step++}}
function startM(){ac();if(!MG){MG=AC.createGain();MG.gain.value=.45;MG.connect(AC.destination);NB=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}if(!mt){nxt=AC.currentTime+.1;mt=setInterval(sched,60)}}
function stopM(){clearInterval(mt);mt=0}
['pointerdown','keydown'].forEach(ev=>addEventListener(ev,()=>{if(snd&&!mt)try{startM()}catch(e){}}));
addEventListener('visibilitychange',()=>{if(AC)document.hidden?AC.suspend():AC.resume()});
$('#snd').onclick=e=>{snd=!snd;e.target.textContent='SOUND '+(snd?'ON':'OFF');if(snd){try{startM()}catch(x){}}else stopM();beep()};
V.beranda=()=>{set(`<div class="hub"><div class="tb2"><div class="cy">VOID FRAME INTERACTIVE PRESENTS</div><h1 class="ttl">NETRUNNER</h1><p>Retas kota Neo Nitro dengan <b class="cy">berpikir komputasional</b>.</p><p>Selamat datang, <b id="nm" class="rdc"></b>.</p><button class="btn rd" id="go">${S.done||S.fin?'LANJUTKAN':'MULAI'}</button></div><div class="g3">${[['1','Dekomposisi'],['2','Pola &amp; Abstraksi'],['3','Algoritma']].map(m=>`<button class="cd" data-g="materi">MATERI ${m[0]}<small>${m[1]}</small></button>`).join('')}</div><div class="g6">${[['beranda','Beranda'],['panduan','Panduan'],['tujuan','Tujuan &amp; Manfaat'],['game','Game'],['game','Soal Ujian'],['profil','Referensi &amp; Profil']].map(m=>`<button class="cd" data-g="${m[0]}">${m[1]}</button>`).join('')}</div></div>`);
$('#nm').textContent=S.name;$('#go').onclick=()=>go(S.done||S.fin?'game':'tujuan');document.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>go(b.dataset.g))};
V.game=()=>{const P=[[3,4],[27,2],[55,4],[81,2],[69,36],[42,38],[16,35],[3,67],[27,69],[58,67]],pc=i=>[P[i][0]+(i==9?15:5.5),P[i][1]+14];
const ln=[...Array(9)].map((_,i)=>{const a=pc(i),b=pc(i+1),on=S.fin||i+1<=S.done;return `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${on?'#17c3d6':'#3a3d4d'}" stroke-width="2" stroke-dasharray="7 6" vector-effect="non-scaling-stroke"/>`}).join('');
set(sc('05','PETA GEDUNG')+`<div class="mw"><div class="mp"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${ln}</svg>${LV.map((l,i)=>{const open=S.fin||i==S.done,st=S.fin||i<S.done?'dn':i==S.done?'now':'lk',sx=S.fin?(i<S.done?'✓ ulangi':'buka'):i<S.done?'✓ selesai':i==S.done?'▶ MASUK':'🔒 terkunci';return `<button class="bd ${st} ${i==9?'fn':''}" data-i="${i}" style="left:${P[i][0]}%;top:${P[i][1]}%;width:${i==9?30:11}%;height:28%" ${open?'':'aria-disabled="true"'}><span class="lb">${i==9?'GEDUNG FINAL':'GEDUNG '+(i+1)}<br>${l.k}<br>${sx}</span></button>`}).join('')}</div></div><p class="cy">${S.fin?'Peta terbuka. Pilih gedung mana saja (mode ulang, tanpa poin dan tanpa pengurangan nyawa).':`Peta terkunci sampai game tamat. Lanjutkan ke Gedung ${S.done+1}.`}</p>`);
$('.mp').onclick=e=>{const b=e.target.closest('.bd');if(!b)return;const i=+b.dataset.i;if(S.fin||i==S.done){beep(700);lvl(i)}else beep(150,.15)}};
$('#mp').onclick=()=>go('game');
const T=['beranda','tujuan','panduan','materi','game','profil'],TN=['1. Beranda','2. Tujuan','3. Panduan','4. Materi','5. Game','6. Profil'];
$('#tabs').innerHTML=T.map((t,i)=>`<button data-s="${t}">${TN[i]}</button>`).join('');
$('#tabs').onclick=e=>{if(e.target.dataset.s)go(e.target.dataset.s)};
function go(n){clearTimeout(tid);if(!S.name)n='nama';document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.s==n));V[n]();hud();scrollTo(0,0)}
const set=h=>$('#v').innerHTML=h,sc=(a,b)=>`<div><span class="cy">SCENE ${a}</span> <h2 style="display:inline">${b}</h2></div>`;
function tw(el,txt,cb){let i=0;(function f(){el.textContent=txt.slice(0,i++);if(i%3==0)beep(1200,.015);if(i<=txt.length)tid=setTimeout(f,22);else cb&&cb()})()}

V.nama=()=>{set(`<div class="p" style="max-width:560px;margin:30px auto"><h2>IDENTITAS RUNNER</h2><p>Masukkan nama samaranmu. Nama dan progres tersimpan otomatis di perangkat ini.</p><div class="term"><div class="tb">● ● ●  PowerShell — login</div><div class="tc"><div class="tl"><span class="ps">PS C:\\NetRunner&gt;</span><input id="ni" maxlength="16" placeholder="nama runner" aria-label="nama" autocomplete="off"></div></div></div><button class="btn rd" id="nb">MASUK</button></div>`);
const f=()=>{const v=$('#ni').value.trim();if(!v){$('#nb').textContent='ISI NAMA DULU';$('#ni').focus();return}S.name=v.slice(0,16);save();beep(900);go('tujuan')};$('#nb').onclick=f;$('#ni').onkeydown=e=>{if(e.key=='Enter')f()};$('#ni').focus()};


V.tujuan=()=>{set(sc('02','HOOK, TUJUAN dan MANFAAT')+`<div class="g3" style="margin-top:12px"><div class="p"><h3>HOOK // TERMINAL</h3><pre class="cy" id="hk" style="min-height:150px"></pre><button class="btn rd" id="lj" style="visibility:hidden;margin-top:14px">LANJUT</button></div><div class="p"><h3>TUJUAN</h3><ol style="padding-left:20px"><li>Menjelaskan 4 pilar berpikir komputasional.</li><li>Menerapkan dekomposisi, pola, abstraksi, dan algoritma pada kasus nyata.</li><li>Menyusun algoritma sebagai solusi masalah.</li></ol></div><div class="p"><h3>MANFAAT</h3><p>Menyelesaikan masalah sehari-hari secara sistematis.</p><p>Fondasi belajar pemrograman.</p><p>Melatih logika dan ketelitian.</p></div></div>`);
const b=$('#lj');b.onclick=()=>go('panduan');tw($('#hk'),'> KOTA NEO NITRO DIBOBOL\n> Firewall runtuh, sistem kota kacau.\n> CORTEX-9: Hanya kamu yang bisa masuk. Pecah masalahnya. Temukan polanya. Susun jalannya.',()=>b.style.visibility='visible')};

V.panduan=()=>{set(sc('03','PANDUAN')+`<div class="g2" style="margin-top:12px"><div class="p"><h3>ATURAN</h3><ul><li>10 gedung: 5 puzzle, 4 quiz, 1 puzzle final.</li><li>Nyawa 100%. Tiap salah menjawab −25%.</li><li>Nyawa habis (4 kali salah): ulang dari awal, poin dan peringkat ikut reset.</li><li>Tiap gedung selesai: +10 poin. Tamat = 100 poin.</li></ul></div><div class="p"><h3>PERINGKAT & PETA</h3><ul><li>Script Kiddie: awal permainan.</li><li>Advance Coder: setengah game (5 gedung).</li><li>Famous Hacker: tamat semua gedung.</li><li>Peta bebas pilih level terbuka setelah game tamat; sebelum itu gedung terkunci.</li></ul></div><div class="p"><h3>JENIS TUGAS</h3><ul><li>Pilihan ganda dan pilih semua yang benar.</li><li>Ketik jawaban di terminal PowerShell, lalu Enter.</li><li>Urutkan langkah algoritma.</li><li>Program robot dengan perintah ↑ ↓ ← →.</li></ul></div><div class="p"><h3>CORTEX-9</h3><p class="cy">[◉_◉] AI pendampingmu. Ia memberi petunjuk di bagian bawah layar tiap gedung. Baca petunjuknya sebelum menjawab lagi.</p><button class="btn rd" onclick="go('materi')">BACA MATERI</button></div></div>`)};

V.materi=()=>{const M=[['DEKOMPOSISI','Memecah masalah besar menjadi bagian kecil yang lebih mudah diselesaikan.','Aplikasi absen: form, database, login, laporan.'],['PENGENALAN POLA','Mencari kesamaan atau keteraturan agar solusi dapat dipakai ulang.','2, 4, 8, 16, ... : tiap angka dikali 2.'],['ABSTRAKSI','Menyaring informasi penting dan membuang detail yang tidak perlu.','Peta MRT hanya menampilkan stasiun dan jalur.'],['ALGORITMA','Langkah terurut dan jelas untuk menyelesaikan masalah.','Kirim pesan: buka chat, pilih kontak, ketik, kirim.']];
set(sc('04','MATERI: 4 PILAR')+`<div class="g2" style="margin-top:12px">`+M.map(m=>`<div class="p"><h3>${m[0]}</h3><p>${m[1]}</p><p class="cy">Contoh: ${m[2]}</p></div>`).join('')+`</div>`)};

V.profil=()=>{set(sc('06','PROFIL & REFERENSI')+`<div class="g2" style="margin-top:12px"><div class="p"><h3>RUNNER</h3><p>Nama: <b id="pn" class="cy"></b></p><p>Peringkat: <b>${rank()}</b></p><p>Poin: ${S.pts}/100</p><p>Gedung selesai: ${S.done}/10</p><button class="btn" id="rs">RESET PROGRES</button></div><div class="p"><h3>REFERENSI</h3><ul><li>Wing, J. M. (2006). Computational Thinking. Communications of the ACM.</li><li>Kemendikbudristek. Buku Informatika, Kurikulum Merdeka: Berpikir Komputasional.</li></ul><p>Produksi: VOID Frame Interactive.</p></div></div>`);$('#pn').textContent=S.name;
const b=$('#rs');b.onclick=()=>{if(b.dataset.c){S=Object.assign(S,{done:0,life:100,pts:0,fin:false});save();go('profil')}else{b.dataset.c=1;b.textContent='KLIK LAGI UNTUK KONFIRMASI'}}};



const R={};let busy=false;
const hdr=(n,m,t)=>`<div class="cy">TUGAS ${n}/${m}</div><div class="q">${t.q}</div>`;
const shuf=a=>{a=[...a];for(let i=a.length;i>1;){const j=Math.floor(Math.random()*i--);[a[i],a[j]]=[a[j],a[i]]}return a};
R.mc=(e,t,ok,bad,n,m)=>{e.innerHTML=hdr(n,m,t)+t.o.map((o,j)=>`<button class="btn op" data-j="${j}">${'ABCD'[j]}. ${o}</button>`).join('');e.querySelectorAll('.op').forEach(b=>b.onclick=()=>{if(+b.dataset.j===t.a)ok();else{b.disabled=true;bad(t)}})};
R.type=(e,t,ok,bad,n,m)=>{e.innerHTML=hdr(n,m,t)+`<div class="term"><div class="tb">● ● ●  PowerShell — NetRunner</div><div class="tc"><div id="lg">Cortex-9 shell v9.0 — ketik jawaban, tekan Enter.</div><div class="tl"><span class="ps">PS C:\\NetRunner&gt;</span><input id="ti" autocomplete="off" spellcheck="false" aria-label="jawaban"></div></div></div>`;
const i=$('#ti');i.focus();i.onkeydown=ev=>{if(ev.key!='Enter')return;const v=i.value.trim().toLowerCase();$('#lg').innerHTML+=`<br>&gt; ${v.replace(/[<>&]/g,'')}`;i.value='';t.a.includes(v)?ok():bad(t)}};
R.pick=(e,t,ok,bad,n,m)=>{const s=new Set();e.innerHTML=hdr(n,m,t)+t.o.map((o,j)=>`<button class="btn op" data-j="${j}">[ ] ${o}</button>`).join('')+`<button class="btn rd" id="kr">KIRIM</button>`;
e.querySelectorAll('.op').forEach(b=>b.onclick=()=>{const j=+b.dataset.j;s.has(j)?s.delete(j):s.add(j);b.classList.toggle('on');b.textContent=(s.has(j)?'[x] ':'[ ] ')+t.o[j]});
$('#kr').onclick=()=>[...s].sort().join()==t.a.join()?ok():bad(t)};
R.order=(e,t,ok,bad,n,m)=>{let pool=shuf(t.o),an=[];const d=()=>{e.innerHTML=hdr(n,m,t)+`<div class="cy">Urutanmu (klik untuk melepas):</div>`+an.map((x,j)=>`<button class="btn op" data-a="${j}">${j+1}. ${x}</button>`).join('')+`<div class="cy" style="margin-top:8px">Pilihan langkah:</div>`+pool.map((x,j)=>`<button class="btn op" style="border-color:var(--ln);color:var(--tx)" data-p="${j}">${x}</button>`).join('')+`<button class="btn rd" id="kr">KIRIM</button>`;
e.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{an.push(pool.splice(+b.dataset.p,1)[0]);d()});e.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{pool.push(an.splice(+b.dataset.a,1)[0]);d()});
$('#kr').onclick=()=>an.join('|')==t.o.join('|')?ok():bad(t)};d()};
R.grid=(e,t,ok,bad,n,m)=>{const g=t.g,dy=[-1,1,0,0],dx=[0,0,-1,1];let c=[];busy=false;
const cells=p=>`<div class="gr" style="grid-template-columns:repeat(${g[0].length},44px)">`+g.map((r,y)=>[...r].map((ch,x)=>`<div class="c ${ch=='#'?'wl':''}">${p[0]==y&&p[1]==x?'◉':ch=='G'?'⚑':ch=='#'?'▓':''}</div>`).join('')).join('')+`</div>`;
const d=p=>{e.innerHTML=hdr(n,m,t)+cells(p)+`<div>Program: <b class="ok">${c.map(x=>'↑↓←→'[x]).join(' ')||'(kosong)'}</b></div><div class="r" style="margin-top:8px">${'↑↓←→'.split('').map((a,j)=>`<button class="btn" data-d="${j}" aria-label="perintah ${a}">${a}</button>`).join('')}<button class="btn" id="hp">HAPUS</button><button class="btn rd" id="jl">JALANKAN</button></div>`;
e.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{if(!busy){c.push(+b.dataset.d);beep(500,.03);d([0,0])}});$('#hp').onclick=()=>{if(!busy){c=[];d([0,0])}};$('#jl').onclick=run};
const fail=()=>{bad(t);c=[];busy=false;setTimeout(()=>d([0,0]),900)};
const run=()=>{if(busy||!c.length)return;busy=true;let p=[0,0],k=0;(function s(){if(k<c.length){const y=p[0]+dy[c[k]],x=p[1]+dx[c[k]];k++;if(!g[y]||!g[y][x]||g[y][x]=='#'){beep(120,.2);return fail()}p=[y,x];beep(400+k*30,.04);d(p);busy=true;setTimeout(s,320)}else g[p[0]][p[1]]=='G'?(busy=false,ok()):fail()})()};d([0,0])};

const say=s=>{const x=$('#cx');if(x)x.textContent='[◉_◉] CORTEX-9: '+s};
function lvl(i){const l=LV[i],rep=S.fin;let k=0;go.cur=i;document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.s=='game'));
set(sc(`LEVEL ${i+1}/10`,`GEDUNG ${i+1}: ${l.k}`)+`<div class="p" id="tk" style="margin-top:12px"></div><div class="cx cy" id="cx"></div>`);say(l.i+(rep?' (mode ulang, tanpa poin)':''));
const nx=()=>{if(k>=l.t.length)return fin();R[l.t[k].y]($('#tk'),l.t[k],ok,bad,k+1,l.t.length)};
const ok=()=>{say('AKSES DITERIMA.');beep(900,.12);k++;setTimeout(nx,650)};
const bad=t=>{beep(140,.25);if(!rep){S.life-=25;save();hud()}say('AKSES DITOLAK'+(rep?'':' (−25% nyawa)')+'. Petunjuk: '+t.h);if(S.life<=0)over()};
const fin=()=>{let end=false;if(!rep){S.done++;S.pts+=10;if(S.done>=10){S.fin=true;end=true}save();hud()}beep(1000,.3);
$('#tk').innerHTML=end?`<h2>FIREWALL TERAKHIR RUNTUH</h2><p>Neo Nitro kembali pulih. Kamu, <b class="cy" id="en"></b>, kini bergelar <b class="rdc">Famous Hacker</b> dengan 100 poin.</p><p class="cy">Peta gedung kini terbuka: ulangi level mana saja.</p><button class="btn rd" id="nl">BUKA PETA</button>`:`<h2>GEDUNG ${i+1} DIBOBOL</h2><p class="ok">${rep?'Level diulang. Poin tidak bertambah.':'+10 POIN'}</p><button class="btn rd" id="nl">KEMBALI KE PETA</button>`;
if(end)$('#en').textContent=S.name;$('#nl').onclick=()=>go('game')};nx()}
function over(){const o=document.createElement('div');o.className='ov';o.innerHTML=`<div class="p" style="max-width:480px;border-color:var(--rd)"><h2>SISTEM TERKUNCI</h2><p>Nyawa habis. Progres, poin, dan peringkat kembali ke awal. Nama runner tetap tersimpan.</p><button class="btn rd" id="ul">ULANGI DARI AWAL</button></div>`;document.body.appendChild(o);
$('#ul').onclick=()=>{o.remove();S=Object.assign(S,{done:0,life:100,pts:0,fin:false});save();go('game')}}
S.life=Math.min(100,Math.max(0,S.life))||(S.life>0?S.life:100);if(S.life<=0)S.life=100;
go('beranda');
