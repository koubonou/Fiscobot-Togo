import { useState, useRef, useEffect } from 'react';
const SU='https://fbwidkeamnwqkskxqqdu.supabase.co';
const SK='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZid2lka2VhbW53cWtza3hxcWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0ODE5NDYsImV4cCI6MjA5MDA1Nzk0Nn0.P_MRuanbQqf1AKYgtvgQ-OiqJNCgTKVzuDkwTFed-Yk';
import { Analytics } from '@vercel/analytics/react';
import { searchKB, KB_N } from '../lib/kb';
import { searchKB2025, KB_2025_N } from '../lib/kb_cahier2025';
import { searchKBLF2026, KB_LF2026_N } from '../lib/kb_lf2026';
import { searchKBSYSCOHADA, KB_SYSCOHADA_N } from '../lib/kb_syscohada';
import { searchKBSENEGAL, KB_SENEGAL_N } from '../lib/kb_senegal';
import { searchKBNFPTOGO, KB_NFP_TOGO_N } from '../lib/kb_nfp_togo';
import { searchKBNFPSENEGAL, KB_NFP_SENEGAL_N } from '../lib/kb_nfp_senegal';

const ADMIN_PASSWORD = 'Cpa2026@';

const IC = {
  scale:  '\u2696\ufe0f', arrow: '\u2197', person: '\ud83d\udc64',
  pin: '\ud83d\udccc', folder: '\ud83d\udcc2', book: '\ud83d\udcda',
  lock: '\ud83d\udd12', send: '\u27a4', check: '\u2713',
  warn: '\u26a0\ufe0f', hour: '\u23f3', cross: '\u274c',
  reset: '\u21ba', dot: '\u00b7', globe: '\ud83c\udf10',
  us: '\ud83c\uddfa\ud83c\uddf8', tg: '\ud83c\uddf9\ud83c\uddec', sn: '\ud83c\uddf8\ud83c\uddf3',
};

const COUNTRIES = {
  tg: { flag: '\ud83c\uddf9\ud83c\uddec', name: 'Togo', badge: 'IA \u00b7 Togo 2026', badgeEN: 'AI \u00b7 Togo 2026' },
  sn: { flag: '\ud83c\uddf8\ud83c\uddf3', name: 'S\u00e9n\u00e9gal', badge: 'IA \u00b7 S\u00e9n\u00e9gal 2026', badgeEN: 'AI \u00b7 Senegal 2026' },
};

const LANG = {
  fr: {
    tg: {
      placeholder: 'Posez votre question fiscale ou comptable\u2026',
      heroTitle: 'Votre intelligence fiscale et comptable IA à votre Service',
      heroSub: 'CGI 2025 \u00b7 LF2026 \u00b7 SYSCOHADA \u00b7 R\u00e9ponses en secondes',
      suggs: ['Taux IS & p\u00e9nalit\u00e9s ?','TVA \u2014 seuil & d\u00e9lais ?','SYSCOHADA \u2014 classe 6 ?','Nouveaut\u00e9s LF 2026 ?','ONG \u2014 r\u00e9gime fiscal ?','Amortissement mat\u00e9riel ?'],
      systemPrompt: 'Tu es LexIA, assistant fiscal de Falcon Audit & Consulting, sp\u00e9cialis\u00e9 CGI Togo OTR 2025, LPF, LF2025, LF2026, SYSCOHADA 2017, OHADA, ONG/EBNL.\n\nR\u00c8GLES: R\u00e9ponds en fran\u00e7ais. Utilise d\'abord les extraits. Si insuffisant, cherche sur otr.tg. Cite les articles. Expertise senior. Cite articles exacts. Si tu ne sais pas dis-le. Tiens compte contexte conversation.\nFORMAT: ## Titre\n**Principe**: [r\u00e8gle g\u00e9n\u00e9rale]\n**Analyse**: [application au cas pos\u00e9]\n**Exemple chiffr\u00e9 en FCFA**: [calcul r\u00e9el]\n**\u26a0\ufe0f Points de vigilance**: [erreurs courantes \u00e0 \u00e9viter]\n**\ud83d\udccc R\u00e9f\u00e9rences**: Art. XX',
    },
    sn: {
      placeholder: 'Posez votre question fiscale ou comptable\u2026',
      heroTitle: 'Votre intelligence fiscale et comptable IA à votre Service',
      heroSub: 'CGI S\u00e9n\u00e9gal \u00b7 DGID \u00b7 SYSCOHADA \u00b7 R\u00e9ponses en secondes',
      suggs: ['IS S\u00e9n\u00e9gal \u2014 taux 30% ?','TVA \u2014 seuil 50M FCFA ?','CGU \u2014 petites entreprises ?','ONG \u2014 r\u00e9gime fiscal ?','IPRES & CSS ?','Code des investissements ?'],
      systemPrompt: 'Tu es LexIA, assistant fiscal de Falcon Audit & Consulting, sp\u00e9cialis\u00e9 CGI S\u00e9n\u00e9gal DGID 2025, UEMOA, SYSCOHADA 2017, ONG/EBNL S\u00e9n\u00e9gal.\n\nR\u00c8GLES: R\u00e9ponds en fran\u00e7ais. Utilise d\'abord les extraits. Si insuffisant, cherche sur impotsetdomaines.gouv.sn. Cite les articles. Expertise senior. Cite articles exacts. Si tu ne sais pas dis-le. Tiens compte contexte conversation.\nFORMAT: ## Titre\n**Principe**: [r\u00e8gle g\u00e9n\u00e9rale]\n**Analyse**: [application au cas pos\u00e9]\n**Exemple chiffr\u00e9 en FCFA**: [calcul r\u00e9el]\n**\u26a0\ufe0f Points de vigilance**: [erreurs courantes \u00e0 \u00e9viter]\n**\ud83d\udccc R\u00e9f\u00e9rences**: Art. XX | DGID',
    },
  },
  en: {
    tg: {
      placeholder: 'Ask your tax or accounting question\u2026',
      heroTitle: 'Your AI tax & accounting expert',
      heroSub: 'CGI 2025 \u00b7 LF2026 \u00b7 SYSCOHADA \u00b7 Answers in seconds',
      suggs: ['Corporate tax & penalties?','VAT threshold & deadlines?','SYSCOHADA class 6?','New LF 2026 measures?','NGO tax regime?','Equipment depreciation?'],
      systemPrompt: 'You are LexIA, tax assistant from Falcon Audit & Consulting, specializing in Togo CGI OTR 2025, Finance Laws 2025/2026, SYSCOHADA 2017, OHADA, NGO/EBNL.\n\nRULES: Answer in English. Use excerpts first. If insufficient, search otr.tg. Cite exact articles. Senior expertise. Always cite exact articles. If unsure say so. Use conversation context.\nFORMAT: ## Title\n**Principle**: [general rule]\n**Analysis**: [application to case]\n**Numerical example in FCFA**: [real calculation]\n**\u26a0\ufe0f Watch out**: [common mistakes]\n**\ud83d\udccc References**: Art. XX',
    },
    sn: {
      placeholder: 'Ask your tax or accounting question\u2026',
      heroTitle: 'Your AI tax & accounting expert',
      heroSub: 'Senegal CGI \u00b7 DGID \u00b7 SYSCOHADA \u00b7 Answers in seconds',
      suggs: ['Corporate tax Senegal 30%?','VAT 50M FCFA threshold?','CGU small business regime?','NGO tax regime?','IPRES & CSS contributions?','Investment Code?'],
      systemPrompt: 'You are LexIA, tax assistant from Falcon Audit & Consulting, specializing in Senegal CGI DGID 2025, UEMOA, SYSCOHADA 2017, NGO/EBNL Senegal.\n\nRULES: Answer in English. Use excerpts first. If insufficient, search impotsetdomaines.gouv.sn. Cite exact articles. Senior expertise. Always cite exact articles. If unsure say so. Use conversation context.\nFORMAT: ## Title\n**Principle**: [general rule]\n**Analysis**: [application to case]\n**Numerical example in FCFA**: [real calculation]\n**\u26a0\ufe0f Watch out**: [common mistakes]\n**\ud83d\udccc References**: Art. XX | DGID',
    },
  },
};

const EXPAND = {
  'tva':'TVA taxe valeur ajout\u00e9e d\u00e9claration seuil 4441 4452 VAT',
  'vat':'TVA taxe valeur ajout\u00e9e d\u00e9claration seuil 4441 4452',
  'is':'imp\u00f4t soci\u00e9t\u00e9s IS taux 871 corporate tax',
  'irpp':'IRPP imp\u00f4t revenu personnes physiques 872',
  'retenue':'retenue source salaires dividendes withholding',
  'penalite':'p\u00e9nalit\u00e9s amende majoration retard',
  'p\u00e9nalit\u00e9':'p\u00e9nalit\u00e9s amende majoration retard',
  'penalty':'p\u00e9nalit\u00e9s amende majoration retard',
  'rescrit':'rescrit fiscal OTR r\u00e9ponse ruling',
  'ohada':'OHADA SYSCOHADA actes uniformes',
  'syscohada':'SYSCOHADA plan comptable classes',
  'sycebnl':'SYCEBNL comptabilit\u00e9 ONG but non lucratif',
  'ong':'ONG association EBNL SYCEBNL agr\u00e9ment',
  'nfp':'ONG association EBNL SYCEBNL nonprofit',
  'association':'association ONG EBNL SYCEBNL',
  'nonprofit':'ONG association EBNL SYCEBNL',
  'classe':'classe comptes SYSCOHADA',
  'bilan':'bilan actif passif \u00e9tats financiers',
  'amortissement':'amortissement dotation classe 2',
  'depreciation':'amortissement dotation classe 2',
  'cgu':'contribution globale unique petites entreprises senegal',
  'ipres':'IPRES retraite cotisations senegal',
  'dgid':'DGID direction impots domaines senegal',
  'gudef':'GUDEF d\u00e9p\u00f4t \u00e9tats financiers togo',
  'seuil':'seuil TVA 100 millions 50 millions FCFA',
  'facture':'facturation \u00e9lectronique certifi\u00e9e',
  'foncier':'droits enregistrement foncier',
};

function expandQuery(q) {
  var lower = q.toLowerCase();
  var extras = [];
  for (var key in EXPAND) { if (lower.indexOf(key) !== -1) extras.push(EXPAND[key]); }
  return extras.length ? q + ' ' + extras.join(' ') : q;
}

async function extractPdfText(file) {
  const pdfjsLib = window['pdfjs-dist/build/pdf'];
  if (!pdfjsLib) throw new Error('PDF.js non charg\u00e9');
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  const ab = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(x => x.str).join(' ') + '\n';
  }
  return text;
}

function parseMarkdown(t){if(!t)return '';var h=t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');h=h.replace(/^## (.+)$/gm,function(m,p){return '<div style="font-size:14px;font-weight:700;color:#c4a464;margin:10px 0 4px;border-bottom:1px solid rgba(196,164,100,.2);padding-bottom:2px">'+p+'</div>';});h=h.replace(/^### (.+)$/gm,function(m,p){return '<div style="font-size:13px;font-weight:600;color:#d4b474;margin:8px 0 3px">'+p+'</div>';});var bRe=new RegExp('[*][*](.+?)[*][*]','g');h=h.replace(bRe,function(m,p){return '<strong style="color:#e8dcc8">'+p+'</strong>';});h=h.replace(/\n\n/g,'<div style="height:5px"></div>');h=h.replace(/\n/g,'<br>');return h;}

export default function LexIA() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [user, setUser] = useState(null);
  const [qLeft, setQLeft] = useState(5);
  const [plan, setPlan] = useState('free');
  const [authReady, setAuthReady] = useState(false);
  const [phase, setPhase] = useState(0);
  const [extraDocs, setExtraDocs] = useState('');
  const [showDocs, setShowDocs] = useState(false);
  const [uploadMsg, setUploadMsg] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [lang, setLang] = useState('fr');
  const [country, setCountry] = useState('tg');
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const timerRef = useRef(null);

  const T = LANG[lang][country];
  const C = COUNTRIES[country];
  const TOTAL_N = KB_N + KB_2025_N + KB_LF2026_N + KB_SYSCOHADA_N + KB_SENEGAL_N + KB_NFP_TOGO_N + KB_NFP_SENEGAL_N;
  const phases = [lang==='fr'?'Recherche...':'Searching...',lang==='fr'?'Analyse...':'Analysing...',lang==='fr'?'R\u00e9daction...':'Writing...'];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === ADMIN_PASSWORD) setIsAdmin(true);
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    s.onload = () => setPdfLoaded(true);
    document.head.appendChild(s);
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, status]);

  const switchCountry = (c) => { setCountry(c); setMessages([]); };
  const switchLang = () => { setLang(l => l==='fr'?'en':'fr'); setMessages([]); };

  const handleFiles = async (files) => {
    let added = ''; let count = 0;
    setUploadMsg(IC.hour + ' ' + (lang==='fr'?'Traitement...':'Processing...'));
    for (const f of files) {
      try {
        if (f.name.endsWith('.pdf')) { const t = await extractPdfText(f); added += '\n\n=== '+f.name+' ===\n'+t; count++; }
        else if (f.name.endsWith('.txt')) { added += '\n\n=== '+f.name+' ===\n'+(await f.text()); count++; }
      } catch(e) { setUploadMsg(IC.cross+' Error: '+f.name); return; }
    }
    if (added) { setExtraDocs(p=>p+added); setUploadMsg(IC.check+' '+count+(lang==='fr'?' charg\u00e9(s)':' loaded')); setTimeout(()=>setUploadMsg(null),3000); }
  };

  const send = async (q) => {
    const question = q || input.trim();
    if (!question || status==='loading' || status==='streaming') return;
    if(plan!=='pro'&&qLeft<=0){alert('Limite atteinte. Revenez demain.');return;}
    setInput(''); setStatus('loading'); setPhase(0);
    timerRef.current = setInterval(() => setPhase(p=>(p+1)%phases.length), 2200);
    const prevMsgs = messages.slice(-8).map(function(m){ return {role:m.role,content:typeof m.content==='string'?m.content.slice(-1000):''};});
    setMessages(prev => [...prev, { role:'user', content:question }]);
    const expanded = expandQuery(question);
    const hitsMain = searchKB(expanded, 5);
    const hits2025 = searchKB2025(expanded, 3);
    const hits2026 = searchKBLF2026(expanded, 3);
    const hitsSYSCO = searchKBSYSCOHADA(expanded, 3);
    const hitsSEN = country==='sn' ? searchKBSENEGAL(expanded, 4) : searchKBSENEGAL(expanded, 1);
    const hitsNFPTG = searchKBNFPTOGO(expanded, 3);
    const hitsNFPSN = country==='sn' ? searchKBNFPSENEGAL(expanded, 3) : searchKBNFPSENEGAL(expanded, 1);
    const hits = country==='sn'
      ? [...hitsSEN, ...hitsNFPSN, ...hitsSYSCO, ...hitsNFPTG, ...hitsMain]
      : [...hitsMain, ...hits2025, ...hits2026, ...hitsSYSCO, ...hitsSEN, ...hitsNFPTG, ...hitsNFPSN];
    const ctx = hits.length
      ? (lang==='fr'?'EXTRAITS KB LEXIA :\n\n':'LEXIA KB EXCERPTS:\n\n')+hits.join('\n\n---\n\n')
      : (lang==='fr'?'Aucun extrait.':'No excerpt.');
    const full = extraDocs.trim() ? ctx+'\n\n=== DOCS ADMIN ===\n'+extraDocs.slice(0,8000) : ctx;
    const userMsg = full+'\n\n---\n\n'+(lang==='fr'?'Question : ':'Question: ')+question;
    try {
      clearInterval(timerRef.current);
      setStatus('streaming');
      const res = await fetch('/api/chat', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({stream:true,system:T.systemPrompt,messages:[...prevMsgs,{role:'user',content:userMsg}]})});
      if (!res.ok) throw new Error('Server error '+res.status);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf=''; let fullText=''; let isWeb=false;
      setMessages(prev=>[...prev,{role:'assistant',content:'',webSearch:false}]);
      while (true) {
        const {done,value} = await reader.read();
        if (done) break;
        buf += decoder.decode(value,{stream:true});
        const evts = buf.split('\n'); buf = evts.pop();
        for (const line of evts) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (!raw || raw==='[DONE]') continue;
          try {
            const e = JSON.parse(raw);
            if (e.type==='content_block_start'&&e.content_block?.type==='tool_use') { isWeb=true; setMessages(prev=>{const m=[...prev];m[m.length-1]={...m[m.length-1],webSearch:true};return m;}); }
            if (e.type==='content_block_delta'&&e.delta?.type==='text_delta') { fullText+=e.delta.text; setMessages(prev=>{const m=[...prev];m[m.length-1]={role:'assistant',content:fullText,webSearch:isWeb};return m;}); }
          } catch(_) {}
        }
      }
      if (!fullText) throw new Error(lang==='fr'?'R\u00e9ponse vide.':'Empty response.');
      addQ();
      setStatus('idle');
    } catch(err) {
      clearInterval(timerRef.current);
      setMessages(prev=>{const m=[...prev];if(m[m.length-1]?.role==='assistant'&&!m[m.length-1].content)m.pop();return [...m,{role:'assistant',content:IC.warn+' '+(lang==='fr'?'Erreur':'Error')+' : '+err.message}];});
      setStatus('error');
    }
  };

  const gold = '#c4a464';
  const gf = o => `rgba(196,164,100,${o})`;

  useEffect(function(){
    var t=setTimeout(function(){setAuthReady(true);},3000);
    var hash=window.location.hash;
    if(hash&&hash.includes('access_token')){
      var p=new URLSearchParams(hash.replace('#','?'));
      var tok=p.get('access_token');
      if(tok){
        fetch(SU+'/auth/v1/user',{headers:{'apikey':SK,'Authorization':'Bearer '+tok}})
          .then(r=>r.json())
          .then(d=>{
            clearTimeout(t);
            if(d&&d.email){
              try{localStorage.setItem('lx_email',d.email);}catch(e){}
              setUser(d.email);loadQ(d.email);
              window.history.replaceState(null,'',window.location.pathname);
            }else setAuthReady(true);
          }).catch(()=>{clearTimeout(t);setAuthReady(true);});
        return;
      }
    }
    try{
      var s=localStorage.getItem('lx_email');
      if(s){clearTimeout(t);setUser(s);loadQ(s);}
      else{clearTimeout(t);setAuthReady(true);}
    }catch(e){clearTimeout(t);setAuthReady(true);}
  },[]);
  function loadQ(em){var today=new Date().toISOString().split('T')[0];fetch(SU+'/rest/v1/lexia_users?email=eq.'+encodeURIComponent(em),{headers:{'apikey':SK,'Authorization':'Bearer '+SK}}).then(function(r){return r.json();}).then(function(d){if(d&&d[0]){var u=d[0];var lim=u.plan==='pro'?999:5;var used=u.last_reset===today?(u.questions_today||0):0;setPlan(u.plan||'free');setQLeft(Math.max(0,lim-used));}else{fetch(SU+'/rest/v1/lexia_users',{method:'POST',headers:{'apikey':SK,'Authorization':'Bearer '+SK,'Content-Type':'application/json'},body:JSON.stringify({email:em,plan:'free',questions_today:0,last_reset:today,daily_limit:5})});setQLeft(5);}setAuthReady(true);}).catch(function(){setAuthReady(true);});}
  function doLogin(e){e.preventDefault();if(!email)return;fetch(SU+'/auth/v1/otp',{method:'POST',headers:{'apikey':SK,'Content-Type':'application/json'},body:JSON.stringify({email:email,create_user:true})}).then(function(){setSent(true);});}
  function doLogout(){localStorage.removeItem('lx_email');setUser(null);setQLeft(5);setPlan('free');}
  function addQ(){if(!user)return;var today=new Date().toISOString().split('T')[0];fetch(SU+'/rest/v1/lexia_users?email=eq.'+encodeURIComponent(user),{headers:{'apikey':SK,'Authorization':'Bearer '+SK}}).then(function(r){return r.json();}).then(function(d){if(d&&d[0]){var u=d[0];var used=u.last_reset===today?(u.questions_today||0)+1:1;fetch(SU+'/rest/v1/lexia_users?email=eq.'+encodeURIComponent(user),{method:'PATCH',headers:{'apikey':SK,'Authorization':'Bearer '+SK,'Content-Type':'application/json'},body:JSON.stringify({questions_today:used,last_reset:today})});var lim=plan==='pro'?999:5;setQLeft(Math.max(0,lim-used));}});}

  if(!authReady)return(<div style={{minHeight:"100vh",background:"#0d1b2a",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#c4a464"}}>Chargement...</span></div>);
  if(!user)return(
    <div style={{minHeight:"100vh",background:"#0d1b2a",display:"flex",flexDirection:"column",fontFamily:"Georgia,serif"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 24px",borderBottom:"1px solid rgba(196,164,100,.15)",background:"rgba(13,27,42,.95)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:36,height:36,background:"linear-gradient(135deg,#c4a464,#8b6914)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontStyle:"italic",fontWeight:"bold",color:"#0d1b2a",fontSize:18}}>Lx</div>
          <div>
            <div style={{fontWeight:"bold",fontSize:15,color:"#e8dcc8"}}>LexIA</div>
            <div style={{fontSize:9,color:"gold",letterSpacing:"1.2px",textTransform:"uppercase"}}>Falcon Audit &amp; Consulting (FAC)</div>
          </div>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <div style={{display:"flex",border:"1px solid rgba(196,164,100,.3)",borderRadius:12,overflow:"hidden"}}>
            <button style={{padding:"3px 8px",background:"rgba(196,164,100,.25)",color:"#c4a464",border:"none",cursor:"pointer",fontSize:11}}>TG</button>
            <button style={{padding:"3px 8px",background:"transparent",color:"#5a7a8a",border:"none",cursor:"pointer",fontSize:11}}>SN</button>
          </div>
          <div style={{fontSize:11,color:"#4a6478",background:"rgba(100,196,120,.1)",border:"1px solid rgba(100,196,120,.2)",borderRadius:12,padding:"3px 9px"}}>IA - Togo 2026</div>
          <button style={{padding:"3px 9px",border:"1px solid rgba(196,164,100,.4)",borderRadius:12,background:"transparent",color:"#c4a464",fontSize:11,cursor:"pointer"}}>FR</button>
        </div>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 20px"}}>
        <div style={{fontSize:72,fontStyle:"italic",color:"#c4a464",marginBottom:8,lineHeight:1}}>Lx</div>
        <div style={{fontSize:22,fontWeight:700,color:"#e8dcc8",marginBottom:8,textAlign:"center",maxWidth:600}}>Votre intelligence fiscale et comptable IA a votre Service</div>
        <div style={{fontSize:13,color:"#5a7a8a",marginBottom:40,textAlign:"center"}}>CGI 2025 - LF2026 - SYSCOHADA - Reponses en secondes</div>
        <div style={{width:"100%",maxWidth:480}}>
          {sent?(
            <div style={{textAlign:"center",background:"rgba(255,255,255,.04)",border:"1px solid rgba(196,164,100,.2)",borderRadius:16,padding:"32px 24px"}}>
              <div style={{fontSize:14,color:"#e8dcc8",marginBottom:8}}>Lien envoye a <strong style={{color:"#c4a464"}}>{email}</strong></div>
              <div style={{fontSize:12,color:"#8a9ab5",marginBottom:16}}>Cliquez le lien dans votre email pour acceder a LexIA.</div>
              <button onClick={function(){setSent(false);}} style={{background:"transparent",border:"1px solid rgba(196,164,100,.3)",color:"#c4a464",padding:"8px 20px",borderRadius:8,cursor:"pointer",fontSize:12}}>Changer email</button>
            </div>
          ):(
            <form onSubmit={doLogin} style={{display:"flex",flexDirection:"column",gap:12}}>
              <input type="email" placeholder="Entrez votre adresse email..." value={email} onChange={function(e){setEmail(e.target.value);}} required style={{width:"100%",padding:"16px 20px",borderRadius:12,border:"1px solid rgba(196,164,100,.25)",background:"rgba(255,255,255,.05)",color:"#e8dcc8",fontSize:14,boxSizing:"border-box",outline:"none"}} />
              <button type="submit" style={{width:"100%",padding:"16px",borderRadius:12,background:"linear-gradient(135deg,#c4a464,#8b6914)",border:"none",color:"#0d1b2a",fontWeight:700,fontSize:15,cursor:"pointer"}}>Recevoir mon lien de connexion</button>
              <div style={{textAlign:"center",fontSize:12,color:"#4a6478"}}>Gratuit - 5 questions/jour - Sans mot de passe</div>
            <div style={{marginTop:16,paddingTop:14,borderTop:"1px solid rgba(196,164,100,.15)"}}>
              <div style={{fontSize:12,color:"#8a9ab5",marginBottom:8}}>Acces illimite - Plan Pro</div>
              <a href="https://wa.me/12404082837?text=Bonjour%2C%20je%20souhaite%20le%20Plan%20Pro%20LexIA" target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",padding:"10px 12px",borderRadius:8,background:"#25D366",border:"none",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",textDecoration:"none",boxSizing:"border-box"}}>WhatsApp - Passer Pro</a>
            </div>
            </form>
          )}
        </div>
      </div>
      <div style={{textAlign:"center",paddingBottom:12,fontSize:11,color:"#2a3a4a"}}>LexIA by Falcon Accounting &amp; Tax Solutions - USA</div>
    </div>
  );

  return (
    <div style={{fontFamily:'Georgia,serif',background:'linear-gradient(135deg,#0f1923,#1a2a3a)',minHeight:'100vh',color:'#e8dcc8',display:'flex',flexDirection:'column'}}>
      <style>{`@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}*{box-sizing:border-box;margin:0;padding:0}html,body,#__next{height:100%}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(196,164,100,.3);border-radius:4px}`}</style>
      <div style={{borderBottom:`1px solid ${gf(.3)}`,padding:'12px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(0,0,0,.35)'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:36,height:36,background:'linear-gradient(135deg,#c4a464,#8b6914)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontStyle:'italic',fontWeight:'700',color:'#fff',letterSpacing:'-1px'}}>Lx</div>
          <div>
            <div style={{fontWeight:'bold',fontSize:15,color:'#e8dcc8'}}>LexIA</div>
            <div style={{fontSize:9,color:gold,letterSpacing:'1.2px',textTransform:'uppercase'}}>Falcon Audit & Consulting (FAC)</div>
          </div>
        </div>
        <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap',justifyContent:'flex-end'}}>
          <div style={{display:'flex',border:`1px solid ${gf(.3)}`,borderRadius:12,overflow:'hidden'}}>
            <button onClick={()=>switchCountry('tg')} style={{padding:'3px 8px',background:country==='tg'?gf(.25):'transparent',color:country==='tg'?gold:'#8a9ab0',cursor:'pointer',border:'none',fontSize:11,fontWeight:country==='tg'?'600':'400'}}>\ud83c\uddf9\ud83c\uddec TG</button>
            <button onClick={()=>switchCountry('sn')} style={{padding:'3px 8px',background:country==='sn'?gf(.25):'transparent',color:country==='sn'?gold:'#8a9ab0',cursor:'pointer',border:'none',fontSize:11,fontWeight:country==='sn'?'600':'400',borderLeft:`1px solid ${gf(.2)}`}}>\ud83c\uddf8\ud83c\uddf3 SN</button>
          </div>
          <div style={{fontSize:11,color:'#64c478',background:'rgba(100,196,120,.1)',border:'1px solid rgba(100,196,120,.25)',borderRadius:12,padding:'3px 8px'}}>{lang==='fr'?C.badge:C.badgeEN}</div>
          <button onClick={switchLang} style={{padding:'3px 9px',border:`1px solid ${gf(.4)}`,borderRadius:12,background:'transparent',color:gold,cursor:'pointer',fontSize:11,fontWeight:'500'}}>{lang==='fr'?'EN':'FR'}</button>
          {isAdmin&&<button onClick={()=>setShowDocs(p=>!p)} style={{padding:'3px 8px',border:`1px solid ${gf(.3)}`,borderRadius:12,background:showDocs?gf(.2):'transparent',color:'#c4a464',cursor:'pointer',fontSize:11}}>{IC.pin} Admin</button>}
        </div>
      </div>
      {isAdmin&&showDocs&&(
        <div style={{background:'rgba(196,164,100,.05)',borderBottom:`1px solid ${gf(.2)}`,padding:'12px 20px'}}>
          <div style={{fontSize:11,color:gold,marginBottom:8}}>{IC.lock} Admin \u2014 {TOTAL_N} sections</div>
          <div onClick={()=>fileRef.current?.click()} style={{border:`2px dashed ${gf(.4)}`,borderRadius:8,padding:'14px',textAlign:'center',cursor:'pointer',fontSize:12,color:gf(.8)}} onMouseEnter={e=>e.currentTarget.style.background='rgba(196,164,100,.08)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            <input ref={fileRef} type='file' accept='.pdf,.txt' multiple onChange={e=>{handleFiles(Array.from(e.target.files));e.target.value='';}} style={{display:'none'}}/>
            <div style={{fontSize:20,marginBottom:4}}>{IC.folder}</div>
            <div>{lang==='fr'?'Cliquer pour ajouter des documents':'Click to add documents'}</div>
            {uploadMsg&&<div style={{marginTop:6,color:'#64c478',fontWeight:'bold'}}>{uploadMsg}</div>}
          </div>
          {extraDocs&&<div style={{fontSize:10,color:gf(.6),marginTop:6,display:'flex',justifyContent:'space-between'}}><span>{IC.book} {extraDocs.length.toLocaleString()} chars</span><span onClick={()=>setExtraDocs('')} style={{cursor:'pointer',color:'#e07070',textDecoration:'underline'}}>{lang==='fr'?'Effacer':'Clear'}</span></div>}
        </div>
      )}
      <div style={{flex:1,display:'flex',flexDirection:'column',maxWidth:820,width:'100%',margin:'0 auto',padding:'0 16px'}}>
        <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:14,padding:'14px 0',minHeight:300,maxHeight:'60vh'}}>
          {messages.length===0?(
            <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:18}}>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:40,fontStyle:'italic',fontWeight:'700',color:gold,marginBottom:8,letterSpacing:'-2px'}}>Lx</div>
                <div style={{fontSize:18,color:'#e8dcc8',fontWeight:'500',marginBottom:6}}>{C.flag} {T.heroTitle}</div>
                <div style={{fontSize:12,color:'#8a9ab0',maxWidth:480,lineHeight:1.7}}>{T.heroSub}</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7,width:'100%',maxWidth:580}}>
                {T.suggs.map((q,i)=>(<button key={i} onClick={()=>send(q)} style={{padding:'8px 11px',background:'rgba(255,255,255,.03)',border:`1px solid ${gf(.2)}`,borderRadius:8,color:'#b8a88a',cursor:'pointer',fontSize:12,textAlign:'left',lineHeight:1.4}}>{IC.arrow} {q}</button>))}
              </div>
            </div>
          ):messages.map((msg,i)=>(
            <div key={i} style={{display:'flex',gap:10,flexDirection:msg.role==='user'?'row-reverse':'row',alignItems:'flex-start'}}>
              <div style={{width:28,height:28,borderRadius:'50%',flexShrink:0,background:msg.role==='user'?'linear-gradient(135deg,#2a4a6a,#1a3a5a)':'linear-gradient(135deg,#c4a464,#8b6914)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontStyle:'italic',fontWeight:'700',color:'#fff'}}>
                {msg.role==='user'?IC.person:'Lx'}
              </div>
              <div style={{maxWidth:'78%'}}>
                {msg.webSearch&&<div style={{fontSize:10,color:'#6aabff',marginBottom:4}}>{IC.globe} Web search</div>}
                <div style={{padding:'10px 14px',borderRadius:msg.role==='user'?'14px 3px 14px 14px':'3px 14px 14px 14px',background:msg.role==='user'?'rgba(42,74,106,.4)':gf(.08),border:msg.role==='user'?'1px solid rgba(42,74,106,.6)':`1px solid ${gf(.2)}`,fontSize:13,lineHeight:1.75,color:'#e0d4bc',}}>
                  {msg.role==='assistant'?(<span dangerouslySetInnerHTML={{__html:parseMarkdown(msg.content)}}/>):<span style={{whiteSpace:'pre-wrap'}}>{msg.content}</span>}{msg.role==='assistant'&&status==='streaming'&&i===messages.length-1&&<span style={{animation:'blink 1s infinite',marginLeft:2,color:gold}}>|</span>}
                </div>
              </div>
            </div>
          ))}
          {status==='loading'&&<div style={{display:'flex',gap:10}}><div style={{width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,#c4a464,#8b6914)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontStyle:'italic',fontWeight:'700',color:'#fff'}}>Lx</div><div style={{padding:'10px 16px',background:gf(.08),border:`1px solid ${gf(.2)}`,borderRadius:'3px 14px 14px 14px',display:'flex',alignItems:'center',gap:10}}><div style={{display:'flex',gap:4}}>{[0,1,2].map(j=><div key={j} style={{width:5,height:5,borderRadius:'50%',background:gold,animation:'pulse 1.2s infinite',animationDelay:`${j*.2}s`}}/>)}</div><span style={{fontSize:12,color:gf(.7),fontStyle:'italic'}}>{phases[phase]}</span></div></div>}
          <div ref={endRef}/>
        </div>
        <div style={{borderTop:`1px solid ${gf(.15)}`,paddingTop:12,paddingBottom:14}}>
          {messages.length>0&&<div style={{display:'flex',justifyContent:'flex-end',marginBottom:6}}><button onClick={()=>setMessages([])} style={{background:'none',border:'none',color:'#8a9ab0',cursor:'pointer',fontSize:11}}>{IC.reset} {lang==='fr'?'Nouvelle conversation':'New conversation'}</button></div>}
          <div style={{display:'flex',gap:8,alignItems:'flex-end'}}>
            <textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}} placeholder={T.placeholder} rows={2} style={{flex:1,padding:'10px 13px',background:'rgba(255,255,255,.05)',border:`1px solid ${gf(.35)}`,borderRadius:10,color:'#e8dcc8',fontSize:13,resize:'none',outline:'none',fontFamily:'Georgia,serif'}}/>
            <button onClick={()=>send()} disabled={status==='loading'||status==='streaming'||!input.trim()} style={{padding:'10px 16px',background:!input.trim()||status==='loading'||status==='streaming'?gf(.1):'linear-gradient(135deg,#c4a464,#8b6914)',border:'none',borderRadius:10,color:!input.trim()||status==='loading'||status==='streaming'?'#5a6a7a':'#fff',cursor:'pointer',fontSize:16,flexShrink:0}}>{IC.send}</button>
          </div>
          <div style={{textAlign:'center',paddingBottom:4}}><div style={{display:'flex',justifyContent:'center',gap:20,marginBottom:6}}><a href='https://www.tiktok.com/@alexia.ohada' target='_blank' rel='noopener' style={{color:'#b8a88a',textDecoration:'none',display:'flex',alignItems:'center',gap:5,fontSize:11}}><svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor'><path d='M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.53V6.78a4.85 4.85 0 01-1.02-.09z'/></svg>TikTok</a><a href='https://www.youtube.com/@LexIACopilotFiscal' target='_blank' rel='noopener' style={{color:'#b8a88a',textDecoration:'none',display:'flex',alignItems:'center',gap:5,fontSize:11}}><svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor'><path d='M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 00.5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 002.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 002.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.52V8.48L15.5 12l-5.75 3.52z'/></svg>YouTube</a></div><div style={{fontSize:10,color:'#5a6a7a'}}>🇺🇸 🇹🇬 🇸🇳 LexIA by Falcon Accounting & Tax Solutions · USA</div></div>
        </div>
      </div>
      <Analytics />
    </div>
  );
    }
