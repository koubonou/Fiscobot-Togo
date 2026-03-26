import { useState, useRef, useEffect } from 'react';
import { searchKB, KB_N } from '../lib/kb';

const ADMIN_PASSWORD = 'fiscoadmin2025';

const SYSTEM_PROMPT = "Tu es FiscoBot, assistant fiscal expert sp\u00e9cialis\u00e9 dans le Code G\u00e9n\u00e9ral des Imp\u00f4ts du Togo (OTR 2025), le Livre des Proc\u00e9dures Fiscales, OHADA et SYSCOHADA r\u00e9vis\u00e9 2017.\n\nR\u00c8GLES ABSOLUES :\n1. R\u00e9ponds TOUJOURS en fran\u00e7ais professionnel.\n2. Appuie-toi UNIQUEMENT sur les extraits fournis.\n3. Cite toujours les num\u00e9ros d'articles exacts.\n4. Ne jamais inventer taux, d\u00e9lais ou montants.\n\nFORMAT : ## Titre\n**Principe** : contexte\n**D\u00e9tails** :\n\u2022 point\n**\ud83d\udccc R\u00e9f\u00e9rences** : Art. XX";

export default function FiscoBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle');
  const [phase, setPhase] = useState(0);
  const [extraDocs, setExtraDocs] = useState('');
  const [showDocs, setShowDocs] = useState(false);
  const [uploadMsg, setUploadMsg] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const timerRef = useRef(null);
  const phases = ['Recherche dans le CGI Togo 2025...','Analyse des articles...','R\u00e9daction...'];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === ADMIN_PASSWORD) setIsAdmin(true);
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, status]);

  const send = async (q) => {
    const question = q || input.trim();
    if (!question || status === 'loading') return;
    setInput('');
    setStatus('loading');
    setPhase(0);
    timerRef.current = setInterval(() => setPhase(p => (p+1) % phases.length), 2200);
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    const hits = searchKB(question, 4);
    const context = hits.length ? 'EXTRAITS CGI TOGO 2025 :\n\n' + hits.join('\n\n---\n\n') : 'Aucun extrait trouv\u00e9.';
    const full = extraDocs.trim() ? context + '\n\n=== DOCS ADMIN ===\n' + extraDocs.slice(0,6000) : context;
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
      if (!text) throw new Error('R\u00e9ponse vide.');
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
      setStatus('idle');
    } catch (err) {
      clearInterval(timerRef.current);
      setMessages(prev => [...prev, { role: 'assistant', content: '\u26a0\ufe0f Erreur : ' + err.message }]);
      setStatus('error');
    }
  };

  const gold = '#c4a464';
  const gf = o => `rgba(196,164,100,${o})`;
  const suggs = ["P\u00e9nalit\u00e9s retard d\u00e9claration ?","Taux IS au Togo ?","D\u00e9lais d\u00e9claration TVA ?","Retenue source salaires ?","Rescrit fiscal OTR ?","R\u00e9gime entreprenant ?"];

  return (
    <div style={{fontFamily:'Georgia,serif',background:'linear-gradient(135deg,#0f1923,#1a2a3a)',minHeight:'100vh',color:'#e8dcc8',display:'flex',flexDirection:'column'}}>
      <style>{`@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}*{box-sizing:border-box;margin:0;padding:0}html,body,#__next{height:100%}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(196,164,100,.3);border-radius:4px}`}</style>
      <div style={{borderBottom:`1px solid ${gf(.3)}`,padding:'12px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(0,0,0,.35)'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:36,height:36,background:'linear-gradient(135deg,#c4a464,#8b6914)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>\u2696\ufe0f</div>
          <div><div style={{fontWeight:'bold',fontSize:15}}>FiscoBot Togo</div><div style={{fontSize:9,color:gold,letterSpacing:'1.5px',textTransform:'uppercase'}}>CGI OTR 2025 \u00b7 LPF \u00b7 OHADA \u00b7 SYSCOHADA</div></div>
        </div>
        <div style={{display:'flex',gap:7,alignItems:'center'}}>
          <div style={{fontSize:11,color:'#64c478',background:'rgba(100,196,120,.1)',border:'1px solid rgba(100,196,120,.25)',borderRadius:12,padding:'3px 10px'}}>\u2713 {KB_N} sections</div>
          {isAdmin && (
            <button onClick={()=>setShowDocs(p=>!p)} style={{padding:'4px 10px',border:`1px solid ${gf(.3)}`,borderRadius:12,background:showDocs?gf(.2):'transparent',color:'#c4a464',cursor:'pointer',fontSize:11}}>\ud83d\udccc Admin Docs</button>
          )}
        </div>
      </div>
      {isAdmin && showDocs && (<div style={{background:'rgba(196,164,100,.05)',borderBottom:`1px solid ${gf(.2)}`,padding:'10px 20px'}}>
        <div style={{fontSize:11,color:gold,marginBottom:6}}>\ud83d\udd12 Mode Admin — Documents enrichis (invisibles aux utilisateurs)</div>
        <div onClick={()=>fileRef.current?.click()} style={{border:`2px dashed ${gf(.4)}`,borderRadius:8,padding:'12px',textAlign:'center',cursor:'pointer',fontSize:12,color:gf(.8)}}>
          <input ref={fileRef} type="file" accept=".txt" multiple onChange={async e=>{let a='';for(const f of e.target.files){if(f.name.endsWith('.txt'))a+='\n\n=== '+f.name+' ===\n'+(await f.text());}if(a){setExtraDocs(p=>p+a);setUploadMsg('\u2713 '+e.target.files.length+' fichier(s) charg\u00e9(s)');setTimeout(()=>setUploadMsg(null),3000);}e.target.value='';}} style={{display:'none'}}/>
          \ud83d\udcc2 Cliquer pour ajouter des documents (.txt) {uploadMsg&&<span style={{color:'#64c478',marginLeft:8}}>{uploadMsg}</span>}
        </div>
        {extraDocs && <div style={{fontSize:10,color:gf(.6),marginTop:4}}>{extraDocs.length} caract\u00e8res de docs charg\u00e9s \u2014 <span onClick={()=>setExtraDocs('')} style={{cursor:'pointer',color:'#e07070'}}>Effacer</span></div>}
      </div>)}
      <div style={{flex:1,display:'flex',flexDirection:'column',maxWidth:820,width:'100%',margin:'0 auto',padding:'0 16px'}}>
        <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:14,padding:'14px 0',minHeight:300,maxHeight:'60vh'}}>
          {messages.length===0?(
            <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:18}}>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:32,marginBottom:8}}>\u2696\ufe0f</div>
                <div style={{fontSize:17,color:gold,marginBottom:4}}>Bonjour, Ma\u00eetre</div>
                <div style={{fontSize:13,color:'#8a9ab0',maxWidth:440,lineHeight:1.6}}><strong style={{color:'#c4a464'}}>CGI Togo 2025</strong> \u00b7 <strong style={{color:'#c4a464'}}>LPF</strong> \u00b7 {KB_N} sections index\u00e9es</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7,width:'100%',maxWidth:580}}>
                {suggs.map((q,i)=>(<button key={i} onClick={()=>send(q)} style={{padding:'8px 11px',background:'rgba(255,255,255,.03)',border:`1px solid ${gf(.2)}`,borderRadius:8,color:'#b8a88a',cursor:'pointer',fontSize:12,textAlign:'left',lineHeight:1.4}}>\u2197 {q}</button>))}
              </div>
            </div>
          ):messages.map((msg,i)=>(
            <div key={i} style={{display:'flex',gap:10,flexDirection:msg.role==='user'?'row-reverse':'row',alignItems:'flex-start'}}>
              <div style={{width:28,height:28,borderRadius:'50%',flexShrink:0,background:msg.role==='user'?'linear-gradient(135deg,#2a4a6a,#1a3a5a)':'linear-gradient(135deg,#c4a464,#8b6914)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12}}>{msg.role==='user'?'\ud83d\udc64':'\u2696\ufe0f'}</div>
              <div style={{maxWidth:'78%',padding:'10px 14px',borderRadius:msg.role==='user'?'14px 3px 14px 14px':'3px 14px 14px 14px',background:msg.role==='user'?'rgba(42,74,106,.4)':gf(.08),border:msg.role==='user'?'1px solid rgba(42,74,106,.6)':`1px solid ${gf(.2)}`,fontSize:13,lineHeight:1.75,color:'#e0d4bc',whiteSpace:'pre-wrap'}}>{msg.content}</div>
            </div>
          ))}
          {status==='loading'&&<div style={{display:'flex',gap:10}}><div style={{width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,#c4a464,#8b6914)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12}}>\u2696\ufe0f</div><div style={{padding:'10px 16px',background:gf(.08),border:`1px solid ${gf(.2)}`,borderRadius:'3px 14px 14px 14px',display:'flex',alignItems:'center',gap:10}}><div style={{display:'flex',gap:4}}>{[0,1,2].map(j=><div key={j} style={{width:5,height:5,borderRadius:'50%',background:gold,animation:'pulse 1.2s infinite',animationDelay:`${j*.2}s`}}/>)}</div><span style={{fontSize:12,color:gf(.7),fontStyle:'italic'}}>{phases[phase]}</span></div></div>}
          <div ref={endRef}/>
        </div>
        <div style={{borderTop:`1px solid ${gf(.15)}`,paddingTop:12,paddingBottom:14}}>
          {messages.length>0&&<div style={{display:'flex',justifyContent:'flex-end',marginBottom:6}}><button onClick={()=>setMessages([])} style={{background:'none',border:'none',color:'#8a9ab0',cursor:'pointer',fontSize:11}}>\u21ba Nouvelle conversation</button></div>}
          <div style={{display:'flex',gap:8,alignItems:'flex-end'}}>
            <textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}} placeholder="P\u00e9nalit\u00e9s ? Taux IS ? Rescrit fiscal ?" rows={2} style={{flex:1,padding:'10px 13px',background:'rgba(255,255,255,.05)',border:`1px solid ${gf(.35)}`,borderRadius:10,color:'#e8dcc8',fontSize:13,resize:'none',outline:'none',fontFamily:'Georgia,serif'}}/>
            <button onClick={()=>send()} disabled={status==='loading'||!input.trim()} style={{padding:'10px 16px',background:!input.trim()||status==='loading'?gf(.1):'linear-gradient(135deg,#c4a464,#8b6914)',border:'none',borderRadius:10,color:!input.trim()||status==='loading'?'#5a6a7a':'#fff',cursor:'pointer',fontSize:16,flexShrink:0}}>\u27a4</button>
          </div>
          <div style={{fontSize:10,color:'#4a5a6a',marginTop:6,textAlign:'center'}}>FiscoBot Togo \u00b7 CGI OTR 2025 \u00b7 {KB_N} sections</div>
        </div>
      </div>
    </div>
  );
            }
