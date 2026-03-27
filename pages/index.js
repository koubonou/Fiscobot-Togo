import { useState, useRef, useEffect } from 'react';
import { searchKB, KB_N } from '../lib/kb';

const ADMIN_PASSWORD = 'fiscoadmin2025';

const SYSTEM_PROMPT = "Tu es FiscoBot, assistant fiscal expert spÃ©cialisÃ© dans le Code GÃ©nÃ©ral des ImpÃ´ts du Togo (OTR 2025), le Livre des ProcÃ©dures Fiscales, OHADA et SYSCOHADA rÃ©visÃ© 2017.\n\nRÃGLES ABSOLUES :\n1. RÃ©ponds TOUJOURS en franÃ§ais professionnel.\n2. Appuie-toi UNIQUEMENT sur les extraits fournis.\n3. Cite toujours les numÃ©ros d'articles exacts.\n4. Ne jamais inventer taux, dÃ©lais ou montants.\n\nFORMAT : ## Titre\n**Principe** : contexte\n**DÃ©tails** :\nâ¢ point\n**ð RÃ©fÃ©rences** : Art. XX";

async function extractPdfText(file) {
  const pdfjsLib = window['pdfjs-dist/build/pdf'];
  if (!pdfjsLib) throw new Error('PDF.js non chargÃ©');
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
  const phases = ['Recherche dans le CGI Togo 2025...','Analyse des articles...','RÃ©daction...'];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === ADMIN_PASSWORD) setIsAdmin(true);
    // Charger PDF.js depuis CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => setPdfLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, status]);

  const handleFiles = async (files) => {
    let added = '';
    let count = 0;
    setUploadMsg('â³ Traitement en cours...');
    for (const f of files) {
      try {
        if (f.name.endsWith('.pdf')) {
          const text = await extractPdfText(f);
          added += '\n\n=== ' + f.name + ' ===\n' + text;
          count++;
        } else if (f.name.endsWith('.txt')) {
          added += '\n\n=== ' + f.name + ' ===\n' + (await f.text());
          count++;
        }
      } catch(e) {
        setUploadMsg('â Erreur: ' + f.name);
        return;
      }
    }
    if (added) {
      setExtraDocs(p => p + added);
      setUploadMsg('â ' + count + ' fichier(s) chargÃ©(s)');
      setTimeout(() => setUploadMsg(null), 3000);
    }
  };

  const send = async (q) => {
    const question = q || input.trim();
    if (!question || status === 'loading') return;
    setInput('');
    setStatus('loading');
    setPhase(0);
    timerRef.current = setInterval(() => setPhase(p => (p+1) % phases.length), 2200);
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    const hits = searchKB(question, 4);
    const context = hits.length ? 'EXTRAITS CGI TOGO 2025 :\n\n' + hits.join('\n\n---\n\n') : 'Aucun extrait trouvÃ©.';
    const full = extraDocs.trim() ? context + '\n\n=== DOCS ADMIN ===\n' + extraDocs.slice(0,8000) : context;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system: SYSTEM_PROMPT, messages: [{ role: 'user', content: full + '\n\n---\n\nQuestion : ' + question }] })
      });
      clearInterval(timerRef.current);
      const data = await res.json();
      if (data.error) throw new Error(data.error.message || 'Erreur API');
      const text = (data.content || []).map(b => b.text || '').join('');
      if (!text) throw new Error('RÃ©ponse vide.');
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
      setStatus('idle');
    } catch (err) {
      clearInterval(timerRef.current);
      setMessages(prev => [...prev, { role: 'assistant', content: 'â ï¸ Erreur : ' + err.message }]);
      setStatus('error');
    }
  };

  const gold = '#c4a464';
  const gf = o => `rgba(196,164,100,${o})`;
  const suggs = ["PÃ©nalitÃ©s retard dÃ©claration ?","Taux IS au Togo ?","DÃ©lais dÃ©claration TVA ?","Retenue source salaires ?","Rescrit fiscal OTR ?","RÃ©gime entreprenant ?"];

  return (
    <div style={{fontFamily:'Georgia,serif',background:'linear-gradient(135deg,#0f1923,#1a2a3a)',minHeight:'100vh',color:'#e8dcc8',display:'flex',flexDirection:'column'}}>
      <style>{`@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}*{box-sizing:border-box;margin:0;padding:0}html,body,#__next{height:100%}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(196,164,100,.3);border-radius:4px}`}</style>
      <div style={{borderBottom:`1px solid ${gf(.3)}`,padding:'12px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(0,0,0,.35)'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <img src="https://raw.githubusercontent.com/koubonou/Fiscobot-Togo/main/falcon%20proaccountants%20red.png" alt="Falcon" style={{height:'48px',width:'auto',objectFit:'contain'}} />
          <div><div style={{fontWeight:'bold',fontSize:15}}>FiscoBot Togo</div><div style={{fontSize:9,color:gold,letterSpacing:'1.5px',textTransform:'uppercase'}}>CGI OTR 2025 Â· LPF Â· OHADA Â· SYSCOHADA</div></div>
        </div>
        <div style={{display:'flex',gap:7,alignItems:'center'}}>
          <div style={{fontSize:11,color:'#64c478',background:'rgba(100,196,120,.1)',border:'1px solid rgba(100,196,120,.25)',borderRadius:12,padding:'3px 10px'}}>â {KB_N} sections</div>
          {isAdmin && <button onClick={()=>setShowDocs(p=>!p)} style={{padding:'4px 10px',border:`1px solid ${gf(.3)}`,borderRadius:12,background:showDocs?gf(.2):'transparent',color:'#c4a464',cursor:'pointer',fontSize:11}}>ð Admin Docs</button>}
        </div>
      </div>
      {isAdmin && showDocs && (
        <div style={{background:'rgba(196,164,100,.05)',borderBottom:`1px solid ${gf(.2)}`,padding:'12px 20px'}}>
          <div style={{fontSize:11,color:gold,marginBottom:8}}>ð Mode Admin â Formats acceptÃ©s : PDF et TXT</div>
          <div onClick={()=>fileRef.current?.click()} style={{border:`2px dashed ${gf(.4)}`,borderRadius:8,padding:'14px',textAlign:'center',cursor:'pointer',fontSize:12,color:gf(.8),transition:'background .2s'}}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(196,164,100,.08)'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            <input ref={fileRef} type="file" accept=".pdf,.txt" multiple onChange={e=>{handleFiles(Array.from(e.target.files));e.target.value='';}} style={{display:'none'}}/>
            <div style={{fontSize:20,marginBottom:4}}>ð</div>
            <div>Cliquer pour ajouter des documents</div>
            <div style={{fontSize:10,color:gf(.5),marginTop:3}}>PDF et TXT supportÃ©s â {pdfLoaded ? 'â PDF.js prÃªt' : 'â³ Chargement PDF.js...'}</div>
            {uploadMsg && <div style={{marginTop:6,color:'#64c478',fontWeight:'bold'}}>{uploadMsg}</div>}
          </div>
          {extraDocs && <div style={{fontSize:10,color:gf(.6),marginTop:6,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span>ð {extraDocs.length.toLocaleString()} caractÃ¨res chargÃ©s dans la mÃ©moire</span>
            <span onClick={()=>setExtraDocs('')} style={{cursor:'pointer',color:'#e07070',textDecoration:'underline'}}>Tout effacer</span>
          </div>}
        </div>
      )}
      <div style={{flex:1,display:'flex',flexDirection:'column',maxWidth:820,width:'100%',margin:'0 auto',padding:'0 16px'}}>
        <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:14,padding:'14px 0',minHeight:300,maxHeight:'60vh'}}>
          {messages.length===0?(
            <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:18}}>
              <div style={{textAlign:'center'}}>
                <img src="https://raw.githubusercontent.com/koubonou/Fiscobot-Togo/main/falcon%20proaccountants%20red.png" alt="Falcon" style={{height:'64px',width:'auto',objectFit:'contain',marginBottom:8}} />
                <div style={{fontSize:17,color:gold,marginBottom:4}}>Mon Comptable</div>
                
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7,width:'100%',maxWidth:580}}>
                {suggs.map((q,i)=>(<button key={i} onClick={()=>send(q)} style={{padding:'8px 11px',background:'rgba(255,255,255,.03)',border:`1px solid ${gf(.2)}`,borderRadius:8,color:'#b8a88a',cursor:'pointer',fontSize:12,textAlign:'left',lineHeight:1.4}}>â {q}</button>))}
              </div>
            </div>
          ):messages.map((msg,i)=>(
            <div key={i} style={{display:'flex',gap:10,flexDirection:msg.role==='user'?'row-reverse':'row',alignItems:'flex-start'}}>
              <div style={{width:28,height:28,borderRadius:'50%',flexShrink:0,background:msg.role==='user'?'linear-gradient(135deg,#2a4a6a,#1a3a5a)':'linear-gradient(135deg,#c4a464,#8b6914)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12}}>{msg.role==='user'?'ð¤':'âï¸'}</div>
              <div style={{maxWidth:'78%',padding:'10px 14px',borderRadius:msg.role==='user'?'14px 3px 14px 14px':'3px 14px 14px 14px',background:msg.role==='user'?'rgba(42,74,106,.4)':gf(.08),border:msg.role==='user'?'1px solid rgba(42,74,106,.6)':`1px solid ${gf(.2)}`,fontSize:13,lineHeight:1.75,color:'#e0d4bc',whiteSpace:'pre-wrap'}}>{msg.content}</div>
            </div>
          ))}
          {status==='loading'&&<div style={{display:'flex',gap:10}}><div style={{width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,#c4a464,#8b6914)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12}}>âï¸</div><div style={{padding:'10px 16px',background:gf(.08),border:`1px solid ${gf(.2)}`,borderRadius:'3px 14px 14px 14px',display:'flex',alignItems:'center',gap:10}}><div style={{display:'flex',gap:4}}>{[0,1,2].map(j=><div key={j} style={{width:5,height:5,borderRadius:'50%',background:gold,animation:'pulse 1.2s infinite',animationDelay:`${j*.2}s`}}/>)}</div><span style={{fontSize:12,color:gf(.7),fontStyle:'italic'}}>{phases[phase]}</span></div></div>}
          <div ref={endRef}/>
        </div>
        <div style={{borderTop:`1px solid ${gf(.15)}`,paddingTop:12,paddingBottom:14}}>
          {messages.length>0&&<div style={{display:'flex',justifyContent:'flex-end',marginBottom:6}}><button onClick={()=>setMessages([])} style={{background:'none',border:'none',color:'#8a9ab0',cursor:'pointer',fontSize:11}}>âº Nouvelle conversation</button></div>}
          <div style={{display:'flex',gap:8,alignItemsh:'flex-end'}}>
            <textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}} placeholder="PÃ©nalitÃ©s ? Taux IS ? Rescrit fiscal ?" rows={2} style={{flex:1,padding:'10px 13px',background:'rgba(255,255,255,.05)',border:`1px solid ${gf(.35)}`,borderRadius:10,color:'#e8dcc8',fontSize:13,resize:'none',outline:'none',fontFamily:'Georgia,serif'}}/>
            <button onClick={()=>send()} disabled={status==='loading'||!input.trim()} style={{padding:'10px 16px',background:!input.trim()||status==='loading'?gf(.1):'linear-gradient(135deg,#c4a464,#8b6914)',border:'none',borderRadius:10,color:!input.trim()||status==='loading'?'#5a6a7a':'#fff',cursor:'pointer',fontSize:16,flexShrink:0}}>â¤</button>
          </div>
          <div style={{fontSize:10,color:'#4a5a6a',marginTop:6,textAlign:'center'}}>FiscoBot Togo Â· CGI OTR 2025 Â· {KB_N} sections</div>
        </div>
      </div>
    </div>
  );
  }
