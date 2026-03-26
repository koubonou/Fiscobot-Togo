import { useState, useRef, useEffect } from 'react';
import { searchKB, KB_N } from '../lib/kb';

const SYSTEM_PROMPT = "Tu es FiscoBot, assistant fiscal expert spécialisé dans le Code Général des Impôts du Togo (OTR 2025), le Livre des Procédures Fiscales, OHADA et SYSCOHADA révisé 2017.\n\nRÈGLES ABSOLUES :\n1. Réponds TOUJOURS en français professionnel.\n2. Appuie-toi UNIQUEMENT sur les extraits fournis. Si l'info manque, dis-le clairement.\n3. Cite toujours les numéros d'articles exacts (ex: Art. 115 LPF, Art. 67 CGI).\n4. Ne jamais inventer taux, délais ou montants.\n\nFORMAT DE RÉPONSE OBLIGATOIRE :\n## [Titre court]\n**Principe général** : [contexte]\n**Détails** :\n• [point 1]\n• [point 2]\n**📌 Références légales** : Art. XX [source]";

function BotMessage({ text }) {
  const gold = '#c4a464';
  const lines = text.split('\n');

  function renderInline(t) {
    return t.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
      /^\*\*[^*]+\*\*$/.test(p)
        ? <strong key={i} style={{ color: '#d4c090' }}>{p.slice(2,-2)}</strong>
        : <span key={i}>{p}</span>
    );
  }

  return (
    <div style={{ wordBreak: 'break-word' }}>
      {lines.map((line, i) => {
        if (/^## /.test(line))
          return <div key={i} style={{ fontWeight:'bold', fontSize:15, color:gold, marginTop:14, marginBottom:6, borderBottom:'1px solid rgba(196,164,100,.2)', paddingBottom:4 }}>{line.replace(/^## /,'')}</div>;
        if (/^---$/.test(line.trim()))
          return <hr key={i} style={{ border:'none', borderTop:'1px solid rgba(196,164,100,.15)', margin:'10px 0' }}/>;
        if (/^\|[-:| ]+\|$/.test(line.trim())) return null;
        if (/^\|.+\|$/.test(line.trim())) {
          const cells = line.trim().slice(1,-1).split('|').map(c => c.trim());
          return <div key={i} style={{ display:'flex', marginBottom:1 }}>{cells.map((cell,ci) => <div key={ci} style={{ flex:1, padding:'4px 8px', background:ci===0?'rgba(196,164,100,.08)':'rgba(255,255,255,.03)', border:'1px solid rgba(196,164,100,.1)', fontSize:12, color:'#c8bca8' }}>{cell.replace(/\*\*(.+?)\*\*/g,'$1')}</div>)}</div>;
        }
        if (/^[•\-\*] /.test(line))
          return <div key={i} style={{ display:'flex', gap:8, marginBottom:3, paddingLeft:4 }}><span style={{ color:gold }}>•</span><span style={{ color:'#c8bca8', fontSize:12, lineHeight:1.6 }}>{renderInline(line.replace(/^[•\-\*] /,''))}</span></div>;
        if (/^\d+\. /.test(line)) {
          const num = line.match(/^(\d+)\. /)[1];
          return <div key={i} style={{ display:'flex', gap:8, marginBottom:3, paddingLeft:4 }}><span style={{ color:gold, minWidth:16 }}>{num}.</span><span style={{ color:'#c8bca8', fontSize:12, lineHeight:1.6 }}>{renderInline(line.replace(/^\d+\. /,''))}</span></div>;
        }
        if (line.trim() === '') return <div key={i} style={{ height:6 }}/>;
        return <div key={i} style={{ color:'#c8bca8', fontSize:13, lineHeight:1.7, marginBottom:2 }}>{renderInline(line)}</div>;
      }).filter(Boolean)}
    </div>
  );
}

export default function FiscoBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle');
  const [phase, setPhase] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [showDebug, setShowDebug] = useState(false);
  const [lastHits, setLastHits] = useState([]);
  const [extraDocs, setExtraDocs] = useState('');
  const [showDocs, setShowDocs] = useState(false);
  const [uploadMsg, setUploadMsg] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const timerRef = useRef(null);

  const phases = ['Recherche dans le CGI Togo 2025...', 'Analyse des articles pertinents...', 'Rédaction de la réponse...'];

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, status]);

  const send = async (q) => {
    const question = q || input.trim();
    if (!question || status === 'loading') return;
    setInput('');
    setStatus('loading');
    setErrorMsg('');
    setPhase(0);
    timerRef.current = setInterval(() => setPhase(p => (p+1) % phases.length), 2200);
    setMessages(prev => [...prev, { role: 'user', content: question }]);

    const hits = searchKB(question, 4);
    setLastHits(hits);

    const context = hits.length
      ? 'EXTRAITS DU CGI TOGO 2025 ET LPF :\n\n' + hits.join('\n\n---\n\n')
      : 'Aucun extrait trouvé.';
    const full = extraDocs.trim()
      ? context + '\n\n=== DOCUMENTS SUPPLÉMENTAIRES ===\n' + extraDocs.slice(0, 6000)
      : context;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: full + '\n\n---\n\nQuestion : ' + question }],
        }),
      });
      clearInterval(timerRef.current);
      const data = await res.json();
      if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
      const text = (data.content || []).map(b => b.text || '').join('');
      if (!text) throw new Error('Réponse vide.');
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
      setStatus('idle');
    } catch (err) {
      clearInterval(timerRef.current);
      setErrorMsg(err.message);
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Erreur : ' + err.message }]);
      setStatus('error');
    }
  };

  const loadPdfJs = () => new Promise(r => {
    if (window.pdfjsLib) { r(window.pdfjsLib); return; }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    s.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'; r(window.pdfjsLib); };
    document.head.appendChild(s);
  });

  const handleFiles = async (files) => {
    setUploadMsg('Extraction...');
    let added = '';
    for (const file of files) {
      const ext = file.name.split('.').pop().toLowerCase();
      try {
        if (['txt','md'].includes(ext)) { added += '\n\n=== '+file.name+' ===\n'+(await file.text()); }
        else if (ext === 'pdf') {
          const lib = await loadPdfJs();
          const pdf = await lib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
          let t = '=== '+file.name+' ===\n';
          for (let i=1; i<=pdf.numPages; i++) { const p=await pdf.getPage(i); t+=(await p.getTextContent()).items.map(x=>x.str).join(' ')+'\n'; }
          added += '\n\n'+t;
        }
      } catch(e) { console.error(e); }
    }
    if (added) { setExtraDocs(p=>p+added); setUploadMsg('✓ '+files.length+' fichier(s)'); setTimeout(()=>setUploadMsg(null),3000); }
  };

  const gold = '#c4a464';
  const gf = o => `rgba(196,164,100,${o})`;
  const suggestions = [
    "Quelles sont les pénalités pour retard de déclaration ?",
    "Quel est le taux de l'IS au Togo ?",
    "Quand déposer la déclaration IS et TVA ?",
    "Comment fonctionne la retenue à la source ?",
    "Qu'est-ce que le rescrit fiscal au Togo ?",
    "Quel est le régime de l'entreprenant ?",
  ];

  return (
    <div style={{ fontFamily:"'Georgia',serif", background:'linear-gradient(135deg,#0f1923,#1a2a3a,#0f1923)', minHeight:'100vh', color:'#e8dcc8', display:'flex', flexDirection:'column' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}*{box-sizing:border-box;margin:0;padding:0}html,body,#__next{height:100%}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(196,164,100,.3);border-radius:4px}textarea{font-family:inherit}`}</style>

      {/* Header */}
      <div style={{ borderBottom:`1px solid ${gf(.3)}`, padding:'12px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(0,0,0,.35)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:36, height:36, background:'linear-gradient(135deg,#c4a464,#8b6914)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>⚖</div>
          <div>
            <div style={{ fontWeight:'bold', fontSize:15 }}>FiscoBot Togo</div>
            <div style={{ fontSize:9, color:gold, letterSpacing:'1.5px', textTransform:'uppercase' }}>CGI OTR 2025 · LPF · OHADA · SYSCOHADA</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:7, alignItems:'center' }}>
          <div style={{ fontSize:11, color:'#64c478', background:'rgba(100,196,120,.1)', border:'1px solid rgba(100,196,120,.25)', borderRadius:12, padding:'3px 10px' }}>✓ {KB_N} sections</div>
          <button onClick={()=>setShowDocs(p=>!p)} style={{ padding:'4px 10px', border:`1px solid ${showDocs?gold:gf(.3)}`, borderRadius:12, background:showDocs?gf(.15):'transparent', color:showDocs?gold:'#8a9ab0', cursor:'pointer', fontSize:11 }}>📎 Docs</button>
          <button onClick={()=>setShowDebug(p=>!p)} style={{ padding:'4px 10px', border:`1px solid ${gf(.2)}`, borderRadius:12, background:'transparent', color:'#6a7a8a', cursor:'pointer', fontSize:11 }}>🔍</button>
        </div>
      </div>

      {/* Debug Panel */}
      {showDebug && (
        <div style={{ background:'rgba(0,0,0,.5)', borderBottom:`1px solid ${gf(.2)}`, padding:'10px 20px', fontFamily:'monospace', fontSize:11, color:'#8ac4a4' }}>
          <div>KB: <strong style={{color:'#64c478'}}>{KB_N} chunks</strong></div>
          {lastHits.length > 0 && <div style={{marginTop:4,color:'#c4a464'}}>Extraits envoyés ({lastHits.length}) :</div>}
          {lastHits.map((h,i) => <div key={i} style={{marginTop:2,color:'#6a9a7a',fontSize:10}}>[{i+1}] {h.slice(0,90)}...</div>)}
          {errorMsg && <div style={{marginTop:4,color:'#e06464'}}>⚠️ {errorMsg}</div>}
        </div>
      )}

      {/* Docs Panel */}
      {showDocs && (
        <div style={{ background:'rgba(0,0,0,.2)', borderBottom:`1px solid ${gf(.15)}`, padding:'10px 20px' }}>
          <div style={{ fontSize:12, color:'#8a9ab0', marginBottom:6 }}>Ajoute des documents (SYSCOHADA, Doctrine OTR, circulaires...)</div>
          <div
            onDragOver={e=>{e.preventDefault();setDragOver(true);}}
            onDragLeave={()=>setDragOver(false)}
            onDrop={async e=>{e.preventDefault();setDragOver(false);await handleFiles(Array.from(e.dataTransfer.files));}}
            onClick={()=>fileRef.current?.click()}
            style={{ border:`2px dashed ${dragOver?gold:gf(.3)}`, borderRadius:8, padding:'12px', textAlign:'center', cursor:'pointer', background:gf(.04), fontSize:12, color:gf(.7) }}
          >
            <input ref={fileRef} type="file" accept=".pdf,.txt,.md" multiple onChange={async e=>{await handleFiles(Array.from(e.target.files));e.target.value='';}} style={{display:'none'}}/>
            📂 PDF · TXT — Doctrine OTR, Cahier Fiscal, SYSCOHADA...
            {uploadMsg && <span style={{marginLeft:8,color:uploadMsg.startsWith('✓')?'#64c478':'#c4a464'}}>{uploadMsg}</span>}
            {extraDocs && <span style={{marginLeft:8,color:'#64c478'}}>· {(extraDocs.length/1000).toFixed(0)}ko ✓</span>}
          </div>
        </div>
      )}

      {/* Chat */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', maxWidth:820, width:'100%', margin:'0 auto', padding:'0 16px', boxSizing:'border-box' }}>
        <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:14, padding:'14px 0', minHeight:300, maxHeight:'60vh' }}>
          {messages.length === 0 ? (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:18, padding:'16px 0' }}>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:32, marginBottom:8 }}>⚖️</div>
                <div style={{ fontSize:17, color:gold, marginBottom:4 }}>Bonjour, Maître</div>
                <div style={{ fontSize:13, color:'#8a9ab0', maxWidth:440, lineHeight:1.6 }}>
                  <strong style={{color:'#c4a464'}}>CGI Togo 2025</strong> · <strong style={{color:'#c4a464'}}>LPF</strong> · Lexique OTR · Contrôle Fiscal 2026
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7, width:'100%', maxWidth:580 }}>
                {suggestions.map((q,i) => (
                  <button key={i} onClick={()=>send(q)} style={{ padding:'8px 11px', background:'rgba(255,255,255,.03)', border:`1px solid ${gf(.2)}`, borderRadius:8, color:'#b8a88a', cursor:'pointer', fontSize:12, textAlign:'left', lineHeight:1.4 }}>↗ {q}</button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg,i) => (
              <div key={i} style={{ display:'flex', gap:10, flexDirection:msg.role==='user'?'row-reverse':'row', alignItems:'flex-start' }}>
                <div style={{ width:28, height:28, borderRadius:'50%', flexShrink:0, background:msg.role==='user'?'linear-gradient(135deg,#2a4a6a,#1a3a5a)':'linear-gradient(135deg,#c4a464,#8b6914)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12 }}>{msg.role==='user'?'👤':'⚖'}</div>
                <div style={{ maxWidth:'78%', padding:'10px 14px', borderRadius:msg.role==='user'?'14px 3px 14px 14px':'3px 14px 14px 14px', background:msg.role==='user'?'rgba(42,74,106,.4)':gf(.08), border:msg.role==='user'?'1px solid rgba(42,74,106,.6)':`1px solid ${gf(.2)}`, fontSize:13, lineHeight:1.75, color:'#e0d4bc' }}>
                  {msg.role==='user' ? <span style={{whiteSpace:'pre-wrap'}}>{msg.content}</span> : <BotMessage text={msg.content}/>}
                </div>
              </div>
            ))
          )}
          {status === 'loading' && (
            <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#c4a464,#8b6914)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12 }}>⚖</div>
              <div style={{ padding:'10px 16px', background:gf(.08), border:`1px solid ${gf(.2)}`, borderRadius:'3px 14px 14px 14px', display:'flex', alignItems:'center', gap:10 }}>
                <div style={{display:'flex',gap:4}}>{[0,1,2].map(j=><div key={j} style={{width:5,height:5,borderRadius:'50%',background:gold,animation:'pulse 1.2s ease-in-out infinite',animationDelay:`${j*.2}s`}}/>)}</div>
                <span style={{fontSize:12,color:gf(.7),fontStyle:'italic'}}>{phases[phase]}</span>
              </div>
            </div>
          )}
          <div ref={endRef}/>
        </div>

        {/* Input */}
        <div style={{ borderTop:`1px solid ${gf(.15)}`, paddingTop:12, paddingBottom:14 }}>
          {messages.length > 0 && <div style={{display:'flex',justifyContent:'flex-end',marginBottom:6}}><button onClick={()=>{setMessages([]);setLastHits([]);}} style={{background:'none',border:'none',color:'#8a9ab0',cursor:'pointer',fontSize:11}}>↺ Nouvelle conversation</button></div>}
          <div style={{ display:'flex', gap:8, alignItems:'flex-end' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}}
              placeholder="Ex : Pénalités retard ? Taux IS ? Qu'est-ce que le rescrit fiscal ?"
              rows={2}
              style={{ flex:1, padding:'10px 13px', background:'rgba(255,255,255,.05)', border:`1px solid ${gf(.35)}`, borderRadius:10, color:'#e8dcc8', fontSize:13, resize:'none', outline:'none', lineHeight:1.5 }}
            />
            <button onClick={()=>send()} disabled={status==='loading'||!input.trim()} style={{ padding:'10px 16px', background:status==='loading'||!input.trim()?gf(.1):'linear-gradient(135deg,#c4a464,#8b6914)', border:'none', borderRadius:10, color:status==='loading'||!input.trim()?'#5a6a7a':'#fff', cursor:status==='loading'||!input.trim()?'not-allowed':'pointer', fontSize:16, flexShrink:0 }}>➤</button>
          </div>
          <div style={{ fontSize:10, color:'#4a5a6a', marginTop:6, textAlign:'center' }}>CGI OTR Togo 2025 · LPF · {KB_N} sections · Ne remplace pas un avis professionnel</div>
        </div>
      </div>
    </div>
  );
}
