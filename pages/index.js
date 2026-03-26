import { useState, useRef, useEffect } from 'react';
import { searchKB, KB_N } from '../lib/kb';

const SYSTEM_PROMPT = "Tu es FiscoBot, assistant fiscal expert spécialisé dans le Code Général des Impôts du Togo (OTR 2025), le Livre des Procédures Fiscales, OHADA et SYSCOHADA révisé 2017.\n\nRÈGLES ABSOLUES :\n1. Réponds TOUJOURS en français professionnel.\n2. Appuie-toi UNIQUEMENT sur les extraits fournis.\n3. Cite toujours les numéros d'articles exacts.\n4. Ne jamais inventer taux, délais ou montants.\n\nFORMAT : ## Titre\n**Principe** : contexte\n**Détails** :\n• point\n**📌 Références** : Art. XX";

export default function FiscoBot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [status, setStatus] = useState('idle');
    const [phase, setPhase] = useState(0);
    const [lastHits, setLastHits] = useState([]);
    const [extraDocs, setExtraDocs] = useState('');
    const [showDocs, setShowDocs] = useState(false);
    const [uploadMsg, setUploadMsg] = useState(null);
    const endRef = useRef(null);
    const inputRef = useRef(null);
    const fileRef = useRef(null);
    const timerRef = useRef(null);
    const phases = ['Recherche dans le CGI Togo 2025...','Analyse des articles...','Rédaction...'];

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
        setLastHits(hits);
        const context = hits.length ? 'EXTRAITS CGI TOGO 2025 :\n\n' + hits.join('\n\n---\n\n') : 'Aucun extrait trouvé.';
        const full = extraDocs.trim() ? context + '\n\n=== DOCS SUPP ===\n' + extraDocs.slice(0,6000) : context;
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
                if (!text) throw new Error('Réponse vide.');
                setMessages(prev => [...prev, { role: 'assistant', content: text }]);
                setStatus('idle');
        } catch (err) {
                clearInterval(timerRef.current);
                setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Erreur : ' + err.message }]);
                setStatus('error');
        }
  };

  const gold = '#c4a464';
    const gf = o => `rgba(196,164,100,${o})`;
    const suggs = ["Pénalités retard déclaration ?","Taux IS au Togo ?","Délais déclaration TVA ?","Retenue source salaires ?","Rescrit fiscal OTR ?","Régime entreprenant ?"];

  return (
        <div style={{fontFamily:'Georgia,serif',background:'linear-gradient(135deg,#0f1923,#1a2a3a)',minHeight:'100vh',color:'#e8dcc8',display:'flex',flexDirection:'column'}}>
      <style>{`@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}*{box-sizing:border-box;margin:0;padding:0}html,body,#__next{height:100%}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(196,164,100,.3);border-radius:4px}`}</style>
      <div style={{borderBottom:`1px solid ${gf(.3)}`,padding:'12px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(0,0,0,.35)'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:36,height:36,background:'linear-gradient(135deg,#c4a464,#8b6914)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>⚖️</div>
          <div><div style={{fontWeight:'bold',fontSize:15}}>FiscoBot Togo</div><div style={{fontSize:9,color:gold,letterSpacing:'1.5px',textTransform:'uppercase'}}>CGI OTR 2025 · LPF · OHADA · SYSCOHADA</div></div>
  </div>
        <div style={{display:'flex',gap:7,alignItems:'center'}}>
          <div style={{fontSize:11,color:'#64c478',background:'rgba(100,196,120,.1)',border:'1px solid rgba(100,196,120,.25)',borderRadius:12,padding:'3px 10px'}}>✓ {KB_N} sections</div>
          <button onClick={()=>setShowDocs(p=>!p)} style={{padding:'4px 10px',border:`1px solid ${gf(.3)}`,borderRadius:12,background:'transparent',color:'#8a9ab0',cursor:'pointer',fontSize:11}}>📎 Docs</button>
  </div>
  </div>
{showDocs&&(<div style={{background:'rgba(0,0,0,.2)',borderBottom:`1px solid ${gf(.15)}`,padding:'10px 20px'}}>
        <div onClick={()=>fileRef.current?.click()} style={{border:`2px dashed ${gf(.3)}`,borderRadius:8,padding:'12px',textAlign:'center',cursor:'pointer',fontSize:12,color:gf(.7)}}>
          <input ref={fileRef} type="file" accept=".pdf,.txt" multiple onChange={async e=>{let a='';for(const f of e.target.files){if(f.name.endsWith('.txt'))a+='\n\n=== '+f.name+' ===\n'+(await f.text());}if(a){setExtraDocs(p=>p+a);setUploadMsg('✓');setTimeout(()=>setUploadMsg(null),2000);}e.target.value='';}} style={{display:'none'}}/>
          📂 Docs supplémentaires {uploadMsg&&<span style={{color:'#64c478'}}>{uploadMsg}</span>}
            </div>
            </div>)}
      <div style={{flex:1,display:'flex',flexDirection:'column',maxWidth:820,width:'100%',margin:'0 auto',padding:'0 16px'}}>
        <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:14,padding:'14px 0',minHeight:300,maxHeight:'60vh'}}>
{messages.length===0?(
              <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:18}}>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:32,marginBottom:8}}>⚖️</div>
                  <div style={{fontSize:17,color:gold,marginBottom:4}}>Bonjour, Maître</div>
                <di
