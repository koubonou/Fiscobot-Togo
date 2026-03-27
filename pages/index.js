import { useState, useRef, useEffect } from 'react';
import { searchKB, KB_N } from '../lib/kb';
import { searchKB2025, KB_2025_N } from '../lib/kb_cahier2025';
import { searchKBLF2026, KB_LF2026_N } from '../lib/kb_lf2026';
import { searchKBSYSCOHADA, KB_SYSCOHADA_N } from '../lib/kb_syscohada';

const ADMIN_PASSWORD = 'fiscoadmin2025';

const IC = {
  scale:  '\u2696\ufe0f',
  arrow:  '\u2197',
  person: '\ud83d\udc64',
  pin:    '\ud83d\udccc',
  folder: '\ud83d\udcc2',
  book:   '\ud83d\udcda',
  lock:   '\ud83d\udd12',
  send:   '\u27a4',
  check:  '\u2713',
  warn:   '\u26a0\ufe0f',
  hour:   '\u23f3',
  cross:  '\u274c',
  reset:  '\u21ba',
  dot:    '\u00b7',
  globe:  '\ud83c\udf10',
};

const T = {
  placeholder: 'P\u00e9nalit\u00e9s ? Taux IS ? Classe 6 SYSCOHADA ?',
  indexees:    'sections index\u00e9es',
  modeAdmin:   'Mode Admin \u2014 Formats accept\u00e9s : PDF et TXT',
  pdfSupport:  'PDF et TXT support\u00e9s \u2014 ',
  pdfReady:    'PDF.js pr\u00eat',
  pdfLoading:  'Chargement PDF.js...',
  chars:       'caract\u00e8res charg\u00e9s',
  nouvelle:    'Nouvelle conversation',
  redaction:   'R\u00e9daction...',
};

const EXPAND = {
  'tva': 'TVA taxe valeur ajout\u00e9e d\u00e9claration seuil 4441 4452',
  'is': 'imp\u00f4t soci\u00e9t\u00e9s IS taux 871 27%',
  'irpp': 'IRPP imp\u00f4t revenu personnes physiques 872',
  'retenue': 'retenue source salaires dividendes prestations',
  'penalite': 'p\u00e9nalit\u00e9s amende majoration retard',
  'p\u00e9nalit\u00e9': 'p\u00e9nalit\u00e9s amende majoration retard',
  'rescrit': 'rescrit fiscal OTR r\u00e9ponse administration',
  'ohada': 'OHADA SYSCOHADA actes uniformes comptabilit\u00e9',
  'syscohada': 'SYSCOHADA plan comptable classes comptes',
  'classe': 'classe comptes plan comptable SYSCOHADA',
  'bilan': 'bilan actif passif \u00e9tats financiers',
  'amortissement': 'amortissement dotation classe 2 immobilisations',
  'stock': 'stocks classe 3 CMUP FIFO variation',
  'tresorerie': 'tr\u00e9sorerie classe 5 banque caisse',
  'fournisseur': 'fournisseur classe 4 compte 401',
  'client': 'client classe 4 compte 411',
  'entreprenant': 'r\u00e9gime entreprenant micro-entreprise',
  'transfert': 'prix de transfert parties li\u00e9es',
  'enregistrement': 'droits enregistrement actes notari\u00e9s foncier',
  'tvm': 'TVM taxe v\u00e9hicules moteur suspension',
  'delai': 'd\u00e9lai d\u00e9claration paiement',
  'd\u00e9lai': 'd\u00e9lai d\u00e9claration paiement',
  'numerique': 'plateforme \u00e9lectronique e-commerce internet',
  'seuil': 'seuil TVA assujettissement 100 millions FCFA',
  'facture': 'facturation \u00e9lectronique certifi\u00e9e',
  'handicap': 'cr\u00e9dit imp\u00f4t employ\u00e9 handicap\u00e9 120000',
  'foncier': 'droits enregistrement foncier valeur v\u00e9nale',
  'contr\u00f4le': 'contr\u00f4le fiscal d\u00e9lai proc\u00e9dure redressement',
  'gudef': 'GUDEF d\u00e9p\u00f4t \u00e9tats financiers liasse',
};

function expandQuery(q) {
  var lower = q.toLowerCase();
  var extras = [];
  for (var key in EXPAND) { if (lower.indexOf(key) !== -1) extras.push(EXPAND[key]); }
  return extras.length ? q + ' ' + extras.join(' ') : q;
}

const SYSTEM_PROMPT = 'Tu es FiscoBot, assistant fiscal et comptable expert sp\u00e9cialis\u00e9 dans le Code G\u00e9n\u00e9ral des Imp\u00f4ts du Togo (OTR 2025), le Livre des Proc\u00e9dures Fiscales, la Loi de Finances 2025, la Loi de Finances 2026, le Plan Comptable SYSCOHADA R\u00e9vis\u00e9 2017, OHADA et SYSCOHADA.\n\nR\u00c8GLES ABSOLUES :\n1. R\u00e9ponds TOUJOURS en fran\u00e7ais professionnel.\n2. Appuie-toi UNIQUEMENT sur les extraits fournis.\n3. Cite toujours les num\u00e9ros d\'articles ou comptes exacts.\n4. Ne jamais inventer taux, d\u00e9lais ou montants.\n\nFORMAT : ## Titre\n**Principe** : contexte\n**D\u00e9tails** :\n\u2022 point\n**\ud83d\udccc R\u00e9f\u00e9rences** : Art. XX / Compte XXX';

async function extractPdfText(file) {
  const pdfjsLib = window['pdfjs-dist/build/pdf'];
  if (!pdfjsLib) throw new Error('PDF.js non charg\u00e9');
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ') + '\n';
  }
  return text;
}

export default function FiscoBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle');
  const [phase, setPhase] = useState(0);
  const [extraDocs, setExtraDocs] = useState('');
  const [showDocs, setShowDocs] = useState(false);
  const [uploadMsg, setUploadMsg] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const timerRef = useRef(null);
  const TOTAL_N = KB_N + KB_2025_N + KB_LF2026_N + KB_SYSCOHADA_N;
  const phases = ['Recherche CGI + SYSCOHADA...', 'Analyse des r\u00e9f\u00e9rences...', T.redaction];
  const suggs = ['P\u00e9nalit\u00e9s retard d\u00e9claration ?', 'Taux IS au Togo ?', 'D\u00e9lais d\u00e9claration TVA ?', 'Classe 6 SYSCOHADA ?', 'Rescrit fiscal OTR ?', 'Amortissement mat\u00e9riel ?'];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === ADMIN_PASSWORD) setIsAdmin(true);
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => setPdfLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, status]);

  const handleFiles = async (files) => {
    let added = ''; let count = 0;
    setUploadMsg(IC.hour + ' Traitement en cours...');
    for (const f of files) {
      try {
        if (f.name.endsWith('.pdf')) { const text = await extractPdfText(f); added += '\n\n=== ' + f.name + ' ===\n' + text; count++; }
        else if (f.name.endsWith('.txt')) { added += '\n\n=== ' + f.name + ' ===\n' + (await f.text()); count++; }
      } catch(e) { setUploadMsg(IC.cross + ' Erreur: ' + f.name); return; }
    }
    if (added) { setExtraDocs(p => p + added); setUploadMsg(IC.check + ' ' + count + ' fichier(s) charg\u00e9(s)'); setTimeout(() => setUploadMsg(null), 3000); }
  };

  const send = async (q) => {
    const question = q || input.trim();
    if (!question || status === 'loading' || status === 'streaming') return;
    setInput(''); setStatus('loading'); setPhase(0);
    timerRef.current = setInterval(() => setPhase(p => (p + 1) % phases.length), 2200);
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    const expanded = expandQuery(question);
    const hitsMain = searchKB(expanded, 3);
    const hits2025 = searchKB2025(expanded, 2);
    const hits2026 = searchKBLF2026(expanded, 2);
    const hitsSYSCO = searchKBSYSCOHADA(expanded, 2);
    const hits = [...hitsMain, ...hits2025, ...hits2026, ...hitsSYSCO];
    const context = hits.length ? 'EXTRAITS CGI/SYSCOHADA TOGO 2025-2026 :\n\n' + hits.join('\n\n---\n\n') : 'Aucun extrait trouv\u00e9.';
    const full = extraDocs.trim() ? context + '\n\n=== DOCS ADMIN ===\n' + extraDocs.slice(0, 8000) : context;
    const userMsg = full + '\n\n---\n\nQuestion : ' + question;
    try {
      clearInterval(timerRef.current);
      setStatus('streaming');
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stream: true, system: SYSTEM_PROMPT, messages: [{ role: 'user', content: userMsg }] }) });
      if (!res.ok) throw new Error('Erreur serveur ' + res.status);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = ''; let fullText = ''; let isWeb = false;
      setMessages(prev => [...prev, { role: 'assistant', content: '', webSearch: false }]);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const evts = buf.split('\n'); buf = evts.pop();
        for (const line of evts) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (!raw || raw === '[DONE]') continue;
          try {
            const e = JSON.parse(raw);
            if (e.type === 'content_block_start' && e.content_block?.type === 'tool_use') { isWeb = true; setMessages(prev => { const m = [...prev]; m[m.length-1] = {...m[m.length-1], webSearch: true}; return m; }); }
            if (e.type === 'content_block_delta' && e.delta?.type === 'text_delta') { fullText += e.delta.text; setMessages(prev => { const m = [...prev]; m[m.length-1] = {role:'assistant', content:fullText, webSearch:isWeb}; return m; }); }
          } catch(_) {}
        }
      }
      if (!fullText) throw new Error('R\u00e9ponse vide.');
      setStatus('idle');
    } catch (err) {
      clearInterval(timerRef.current);
      setMessages(prev => { const m = [...prev]; if (m[m.length-1]?.role==='assistant'&&!m[m.length-1].content) m.pop(); return [...m, {role:'assistant', content:IC.warn+' Erreur : '+err.message}]; });
      setStatus('error');
    }
  };

  const gold = '#c4a464';
  const gf = o => `rgba(196,164,100,${o})`;

  return (
    <div style={{fontFamily:'Georgia,serif',background:'linear-gradient(135deg,#0f1923,#1a2a3a)',minHeight:'100vh',color:'#e8dcc8',display:'flex',flexDirection:'column'}}>
      <style>{`@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}*{box-sizing:border-box;margin:0;padding:0}html,body,#__next{height:100%}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(196,164,100,.3);border-radius:4px}`}</style>
      <div style={{borderBottom:`1px solid ${gf(.3)}`,padding:'12px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(0,0,0,.35)'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:36,height:36,background:'linear-gradient(135deg,#c4a464,#8b6914)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>{IC.scale}</div>
          <div><div style={{fontWeight:'bold',fontSize:15}}>FiscoBot Togo</div><div style={{fontSize:9,color:gold,letterSpacing:'1.5px',textTransform:'uppercase'}}>CGI {IC.dot} LF2026 {IC.dot} SYSCOHADA {IC.dot} OHADA</div></div>
        </div>
        <div style={{display:'flex',gap:7,alignItems:'center'}}>
          <div style={{fontSize:11,color:'#64c478',background:'rgba(100,196,120,.1)',border:'1px solid rgba(100,196,120,.25)',borderRadius:12,padding:'3px 10px'}}>{IC.check} {TOTAL_N} sections</div>
          {isAdmin && <button onClick={()=>setShowDocs(p=>!p)} style={{padding:'4px 10px',border:`1px solid ${gf(.3)}`,borderRadius:12,background:showDocs?gf(.2):'transparent',color:'#c4a464',cursor:'pointer',fontSize:11}}>{IC.pin} Admin Docs</button>}
        </div>
      </div>
      {isAdmin && showDocs && (
        <div style={{background:'rgba(196,164,100,.05)',borderBottom:`1px solid ${gf(.2)}`,padding:'12px 20px'}}>
          <div style={{fontSize:11,color:gold,marginBottom:8}}>{IC.lock} {T.modeAdmin}</div>
          <div onClick={()=>fileRef.current?.click()} style={{border:`2px dashed ${gf(.4)}`,borderRadius:8,padding:'14px',textAlign:'center',cursor:'pointer',fontSize:12,color:gf(.8)}} onMouseEnter={e=>e.currentTarget.style.background='rgba(196,164,100,.08)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            <input ref={fileRef} type='file' accept='.pdf,.txt' multiple onChange={e=>{handleFiles(Array.from(e.target.files));e.target.value='';}} style={{display:'none'}}/>
            <div style={{fontSize:20,marginBottom:4}}>{IC.folder}</div>
            <div>Cliquer pour ajouter des documents</div>
            <div style={{fontSize:10,color:gf(.5),marginTop:3}}>{T.pdfSupport}{pdfLoaded ? IC.check+' '+T.pdfReady : IC.hour+' '+T.pdfLoading}</div>
            {uploadMsg && <div style={{marginTop:6,color:'#64c478',fontWeight:'bold'}}>{uploadMsg}</div>}
          </div>
          {extraDocs && <div style={{fontSize:10,color:gf(.6),marginTop:6,display:'flex',justifyContent:'space-between',alignItems:'center'}}><span>{IC.book} {extraDocs.length.toLocaleString()} {T.chars}</span><span onClick={()=>setExtraDocs('')} style={{cursor:'pointer',color:'#e07070',textDecoration:'underline'}}>Tout effacer</span></div>}
        </div>
      )}
      <div style={{flex:1,display:'flex',flexDirection:'column',maxWidth:820,width:'100%',margin:'0 auto',padding:'0 16px'}}>
        <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:14,padding:'14px 0',minHeight:300,maxHeight:'60vh'}}>
          {messages.length === 0 ? (
            <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:18}}>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:32,marginBottom:8}}>{IC.scale}</div>
                <div style={{fontSize:17,color:gold,marginBottom:4}}>Mon Comptable</div>
                <div style={{fontSize:13,color:'#8a9ab0',maxWidth:440,lineHeight:1.6}}><strong style={{color:'#c4a464'}}>CGI Togo</strong> {IC.dot} <strong style={{color:'#c4a464'}}>LF 2025-2026</strong> {IC.dot} <strong style={{color:'#c4a464'}}>SYSCOHADA</strong> {IC.dot} {TOTAL_N} {T.indexees}</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7,width:'100%',maxWidth:580}}>
                {suggs.map((q, i) => (<button key={i} onClick={()=>send(q)} style={{padding:'8px 11px',background:'rgba(255,255,255,.03)',border:`1px solid ${gf(.2)}`,borderRadius:8,color:'#b8a88a',cursor:'pointer',fontSize:12,textAlign:'left',lineHeight:1.4}}>{IC.arrow} {q}</button>))}
              </div>
            </div>
          ) : messages.map((msg, i) => (
            <div key={i} style={{display:'flex',gap:10,flexDirection:msg.role==='user'?'row-reverse':'row',alignItems:'flex-start'}}>
              <div style={{width:28,height:28,borderRadius:'50%',flexShrink:0,background:msg.role==='user'?'linear-gradient(135deg,#2a4a6a,#1a3a5a)':'linear-gradient(135deg,#c4a464,#8b6914)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12}}>{msg.role === 'user' ? IC.person : IC.scale}</div>
              <div style={{maxWidth:'78%'}}>
                {msg.webSearch && <div style={{fontSize:10,color:'#6aabff',marginBottom:4}}>{IC.globe} Web search actif</div>}
                <div style={{padding:'10px 14px',borderRadius:msg.role==='user'?'14px 3px 14px 14px':'3px 14px 14px 14px',background:msg.role==='user'?'rgba(42,74,106,.4)':gf(.08),border:msg.role==='user'?'1px solid rgba(42,74,106,.6)':`1px solid ${gf(.2)}`,fontSize:13,lineHeight:1.75,color:'#e0d4bc',whiteSpace:'pre-wrap'}}>
                  {msg.content}{msg.role==='assistant'&&status==='streaming'&&i===messages.length-1&&<span style={{animation:'blink 1s infinite',marginLeft:2,color:gold}}>|</span>}
                </div>
              </div>
            </div>
          ))}
          {status==='loading'&&<div style={{display:'flex',gap:10}}><div style={{width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,#c4a464,#8b6914)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12}}>{IC.scale}</div><div style={{padding:'10px 16px',background:gf(.08),border:`1px solid ${gf(.2)}`,borderRadius:'3px 14px 14px 14px',display:'flex',alignItems:'center',gap:10}}><div style={{display:'flex',gap:4}}>{[0,1,2].map(j=><div key={j} style={{width:5,height:5,borderRadius:'50%',background:gold,animation:'pulse 1.2s infinite',animationDelay:`${j*.2}s`}}/>)}</div><span style={{fontSize:12,color:gf(.7),fontStyle:'italic'}}>{phases[phase]}</span></div></div>}
          <div ref={endRef}/>
        </div>
        <div style={{borderTop:`1px solid ${gf(.15)}`,paddingTop:12,paddingBottom:14}}>
          {messages.length>0&&<div style={{display:'flex',justifyContent:'flex-end',marginBottom:6}}><button onClick={()=>setMessages([])} style={{background:'none',border:'none',color:'#8a9ab0',cursor:'pointer',fontSize:11}}>{IC.reset} {T.nouvelle}</button></div>}
          <div style={{display:'flex',gap:8,alignItems:'flex-end'}}>
            <textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}} placeholder={T.placeholder} rows={2} style={{flex:1,padding:'10px 13px',background:'rgba(255,255,255,.05)',border:`1px solid ${gf(.35)}`,borderRadius:10,color:'#e8dcc8',fontSize:13,resize:'none',outline:'none',fontFamily:'Georgia,serif'}}/>
            <button onClick={()=>send()} disabled={status==='loading'||status==='streaming'||!input.trim()} style={{padding:'10px 16px',background:!input.trim()||status==='loading'||status==='streaming'?gf(.1):'linear-gradient(135deg,#c4a464,#8b6914)',border:'none',borderRadius:10,color:!input.trim()||status==='loading'||status==='streaming'?'#5a6a7a':'#fff',cursor:'pointer',fontSize:16,flexShrink:0}}>{IC.send}</button>
          </div>
          <div style={{fontSize:10,color:'#4a5a6a',marginTop:6,textAlign:'center'}}>FiscoBot Togo {IC.dot} CGI {IC.dot} LF2025/2026 {IC.dot} SYSCOHADA {IC.dot} {TOTAL_N} sections</div>
        </div>
      </div>
    </div>
  );
                      }
