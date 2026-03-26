import { useState, useRef, useEffect } from 'react';
import { searchKB, KB_N } from '../lib/kb';

const SYSTEM_PROMPT = "Tu es FiscoBot, assistant fiscal expert sp\u00e9cialis\u00e9 dans le Code G\u00e9n\u00e9ral des Imp\u00f4ts du Togo (OTR 2025), le Livre des Proc\u00e9dures Fiscales, OHADA et SYSCOHADA r\u00e9vis\u00e9 2017.\n\nR\u00c8GLES ABSOLUES :\n1. R\u00e9ponds TOUJOURS en fran\u00e7ais professionnel.\n2. Appuie-toi UNIQUEMENT sur les extraits fournis. Si l'info manque, dis-le clairement.\n3. Cite toujours les num\u00e9ros d'articles exacts (ex: Art. 115 LPF, Art. 67 CGI).\n4. Ne jamais inventer taux, d\u00e9lais ou montants.\n\nFORMAT DE R\u00c9PONSE OBLIGATOIRE :\n## [Titre court]\n**Principe g\u00e9n\u00e9ral** : [contexte]\n**D\u00e9tails** :\n\u2022 [point 1]\n\u2022 [point 2]\n**\ud83d\udccc R\u00e9f\u00e9rences l\u00e9gales** : Art. XX [source]";

export default function FiscoBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle');
  const [phase, setPhase] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [lastHits, setLastHits] = useState([]);
  const [extraDocs, setExtraDocs] = useState('');
  const [showDocs, setShowDocs] = useState(false);
  const [uploadMsg, setUploadMsg] = useState(null);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const timerRef = useRef(null);
  const phases = ['Recherche dans le CGI Togo 2025...','Analyse des articles...','R\u00e9daction...'];
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, status]);

  const send = async (q) => {
    const question = q || input.trim();
    if (!question || status === 'loading') return;
    setInput(''); setStatus('loading'); setPhase(0);
    timerRef.current = setInterval(() => setPhase(p => (p+1) % phases.length), 2200);
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    const hits = searchKB(question, 4);
    setLastHits(hits);
    const context = hits.length ? 'EXTRAITS CGI TOGO 2025:\n\n' + hits.join('\n\n---\n\n') : 'Aucun extrait.';
    const full = extraDocs.trim() ? context + '\n\n=== DOCS SUPP ===\n' + extraDocs.slice(0,6000) : context;
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ system: SYSTEM_PROMPT, messages: [{ role: 'user', content: full + '\n\n---\n\nQuestion : ' + question }] }) });
      clearInterval(timerRef.current);
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const text = (data.content || []).map(b => b.text || '').join('');
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
      setStatus('idle');
    } catch (err) {
      clearInterval(timerRef.current);
      setMessages(prev => [...prev, { role: 'assistant', content: '\u26a0\ufe0f ' + err.message }]);
      setStatus('error');
    }
  };

  const gold = '#c4a464';
  const gf = o => `rgba(196,164,100,${o})`;
  const suggestions = [
    "P\u00e9nalit\u00e9s pour retard de d\u00e9claration ?",
    "Taux de l'IS au Togo ?",
    "D\u00e9lais d\u00e9claration IS et TVA ?",
    "Retenue \u00e0 la source sur salaires ?",
    "Rescrit fiscal OTR ?",
    "R\u00e9gime de l'entreprenant ?",
  ];

  return (
    <div style={{fontFamily:"Georgia,serif",background:'linear-gradient(135deg,#0f1923,#1a2a3a)',minHeight:'100vh',color:'#e8dcc8',display:'flex',flexDirection:'column'}}>
      <style>{`@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}*{box-sizing:border-box;margin:0;padding:0}html,body,#__next{height:100%}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(196,164,100,.3);border-radius:4px}`}</style>
      <div style={{borderBottom:`1px solid ${gf(.3)}`,padding:'12px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(0,0,0,.35)'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:36,height:36,background:'linear-gradient(135deg,#c4a464,#8b6914)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>\u2696</div>
          <div><div style={{fontWeight:'bold',fontSize:15}}>FiscoBot Togo</div><div style={{fontSize:9,color:gold,letterSpacing:'1.5px',textTransform:'uppercase'}}>CGI OTR 2025 \u00b7 LPF \u00b7 OHADA</div></div>
        </div>
        <div style={{display:'flex',gap:7,alignItems:'center'}}>
          <div style={{fontSize:11,color:'#64c478',background:'rgba(100,196,120,.1)',border:'1px solid rgba(100,196,120,.25)',borderRadius:12,padding:'3px 10px'}}>\u2713 {KB_N} sections</div>
          <button onClick={()=>setShowDocs(p=>!p)} style={{padding:'4px 10px',border:`1px solid ${gf(.3)}`,borderRadius:12,background:'transparent',color:'#8a9ab0',cursor:'pointer',fontSize:11}}>\ud83d\udcce Docs</button>
        </div>
      </div>
      {showDocs && (
        <div style={{background:'rgba(0,0,0,.2)',borderBottom:`1px solid ${gf(.15)}`,padding:'10px 20px'}}>
          <div onClick={()=>fileRef.current?.click()} style={{border:`2px dashed ${gf(.3)}`,borderRadius:8,padding:'12px',textAlign:'center',cursor:'pointer',fontSize:12,color:gf(.7)}}>
            <input ref={fileRef} type="file" accept=".pdf,.txt" multiple onChange={async e=>{ let added=''; for(const f of e.target.files){ if(f.name.endsWith('.txt')) added+='\n\n=== '+f.name+' ===\n'+(await f.text()); } if(added){setExtraDocs(p=>p+added);setUploadMsg('\u2713');setTimeout(()=>setUploadMsg(null),2000);} e.target.value=''; }} style={{display:'none'}}/>
            \ud83d\udcc2 Glisse PDF ou TXT ici {uploadMsg && <span style={{color:'#64c478'}}>{uploadMsg}</span>}
          </div>
        </div>
      )}
      <div style={{flex:1,display:'flex',flexDirection:'column',maxWidth:820,width:'100%',margin:'0 auto',padding:'0 16px'}}>
        <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:14,padding:'14px 0',minHeight:300,maxHeight:'60vh'}}>
          {messages.length===0 ? (
            <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:18}}>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:32,marginBottom:8}}>\u2696\ufe0f</div>
                <div style={{fontSize:17,color:gold,marginBottom:4}}>Bonjour, Ma\u00eetre</div>
                <div style={{fontSize:13,color:'#8a9ab0',maxWidth:440,lineHeight:1.6}}><strong style={{color:'#c4a464'}}>CGI Togo 2025</strong> \u00b7 <strong style={{color:'#c4a464'}}>LPF</strong> \u00b7 {KB_N} sections</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7,width:'100%',maxWidth:580}}>
                {suggestions.map((q,i)=>(<button key={i} onClick={()=>send(q)} style={{padding:'8px 11px',background:'rgba(255,255,255,.03)',border:`1px solid ${gf(.2)}`,borderRadius:8,color:'#b8a88a',cursor:'pointer',fontSize:12,textAlign:'left',lineHeight:1.4}}>\u2197 {q}</button>))}
              </div>
            </div>
          ) : messages.map((msg,i)=>(
            <div key={i} style={{display:'flex',gap:10,flexDirection:msg.role==='user'?'row-reverse':'row',alignItems:'flex-start'}}>
              <div style={{width:28,height:28,borderRadius:'50%',flexShrink:0,background:msg.role==='user'?'linear-gradient(135deg,#2a4a6a,#1a3a5a)':'linear-gradient(135deg,#c4a464,#8b6914)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12}}>{msg.role==='user'?'\ud83d\udc64':'\u2696'}</div>
              <div style={{maxWidth:'78%',padding:'10px 14px',borderRadius:msg.role==='user'?'14px 3px 14px 14px':'3px 14px 14px 14px',background:msg.role==='user'?'rgba(42,74,106,.4)':gf(.08),border:msg.role==='user'?'1px solid rgba(42,74,106,.6)':`1px solid ${gf(.2)}`,fontSize:13,lineHeight:1.75,color:'#e0d4bc',whiteSpace:'pre-wrap'}}>{msg.content}</div>
            </div>
          ))}
          {status==='loading'&&(<div style={{display:'flex',gap:10,alignItems:'flex-start'}}><div style={{width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,#c4a464,#8b6914)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12}}>\u2696</div><div style={{padding:'10px 16px',background:gf(.08),border:`1px solid ${gf(.2)}`,borderRadius:'3px 14px 14px 14px',display:'flex',alignItems:'center',gap:10}}><div style={{display:'flex',gap:4}}>{[0,1,2].map(j=><div key={j} style={{width:5,height:5,borderRadius:'50%',background:gold,animation:'pulse 1.2s ease-in-out infinite',animationDelay:`${j*.2}s`}}/>)}</div><span style={{fontSize:12,color:gf(.7),fontStyle:'italic'}}>{phases[phase]}</span></div></div>)}
          <div ref={endRef}/>
        </div>
        <div style={{borderTop:`1px solid ${gf(.15)}`,paddingTop:12,paddingBottom:14}}>
          {messages.length>0&&<div style={{display:'flex',justifyContent:'flex-end',marginBottom:6}}><button onClick={()=>{setMessages([]);setLastHits([]);}} style={{background:'none',border:'none',color:'#8a9ab0',cursor:'pointer',fontSize:11}}>\u21ba Nouvelle conversation</button></div>}
          <div style={{display:'flex',gap:8,alignItems:'flex-end'}}>
            <textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Ex : P\u00e9nalit\u00e9s retard ? Taux IS ? Rescrit fiscal ?" rows={2} style={{flex:1,padding:'10px 13px',background:'rgba(255,255,255,.05)',border:`1px solid ${gf(.35)}`,borderRadius:10,color:'#e8dcc8',fontSize:13,resize:'none',outline:'none',fontFamily:'Georgia,serif'}}/>
            <button onClick={()=>send()} disabled={status==='loading'||!input.trim()} style={{padding:'10px 16px',background:status==='loading'||!input.trim()?gf(.1):'linear-gradient(135deg,#c4a464,#8b6914)',border:'none',borderRadius:10,color:status==='loading'||!input.trim()?'#5a6a7a':'#fff',cursor:status==='loading'||!input.trim()?'not-allowed':'pointer',fontSize:16,flexShrink:0}}>\u27a4</button>
          </div>
          <div style={{fontSize:10,color:'#4a5a6a',marginTop:6,textAlign:'center'}}>CGI OTR Togo 2025 \u00b7 LPF \u00b7 {KB_N} sections</div>
        </div>
      </div>
    </div>
  );
}
