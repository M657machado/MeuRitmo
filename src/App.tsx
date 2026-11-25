import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { Activity, ArrowRight, BookHeart, Check, CheckCircle2, Crown, Download, Flame, Heart, Leaf, LockKeyhole, Menu, Plus, Share2, Sparkles, Sun, Target, Trash2, Trophy, Upload, X } from 'lucide-react'

type Step = { id: string; title: string; done: boolean }
type Day = { mood: string; energy: number; priority: string; steps: Step[]; note: string; updatedAt: string }
type Store = Record<string, Day>
const KEY = 'meuritmo.v1'
const todayKey = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0') }
const emptyDay = (): Day => ({ mood: '', energy: 3, priority: '', steps: [], note: '', updatedAt: new Date().toISOString() })
const readStore = (): Store => { try { return JSON.parse(localStorage.getItem(KEY) || '{}') as Store } catch { return {} } }
const moods = [{ emoji: '🌧️', label: 'Difícil' }, { emoji: '😕', label: 'Mais ou menos' }, { emoji: '🙂', label: 'Bem' }, { emoji: '😊', label: 'Muito bem' }, { emoji: '✨', label: 'Incrível' }]
const dateLabel = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())
const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite' }

export default function App() {
  const [store, setStore] = useState<Store>(readStore)
  const [active, setActive] = useState('Hoje')
  const [showJournal, setShowJournal] = useState(false)
  const [journal, setJournal] = useState('')
  const [newStep, setNewStep] = useState('')
  const [toast, setToast] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const today = todayKey()
  const day = store[today] || emptyDay()
  const completed = day.steps.filter(s => s.done).length
  const progress = day.steps.length ? Math.round(completed / day.steps.length * 100) : 0
  const streak = useMemo(() => { let count = 0; const d = new Date(); for (let i=0;i<30;i++) { const k = new Date(d.getFullYear(),d.getMonth(),d.getDate()-i).toLocaleDateString('en-CA'); const v=store[k]; if (v && (v.mood || v.priority || v.steps.some(s=>s.done) || v.note)) count++; else if (i>0) break } return count }, [store])
  const update = (patch: Partial<Day>) => setStore(prev => ({ ...prev, [today]: { ...(prev[today] || emptyDay()), ...patch, updatedAt: new Date().toISOString() } }))
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(store)) }, [store])
  useEffect(() => { if (!toast) return; const t = window.setTimeout(() => setToast(''), 2600); return () => window.clearTimeout(t) }, [toast])
  const addStep = () => { const title = newStep.trim(); if (!title) return; update({ steps: [...day.steps, { id: crypto.randomUUID(), title, done: false }] }); setNewStep('') }
  const toggleStep = (id: string) => update({ steps: day.steps.map(s => s.id === id ? { ...s, done: !s.done } : s) })
  const removeStep = (id: string) => update({ steps: day.steps.filter(s => s.id !== id) })
  const exportBackup = () => {
    const backup = { app: 'MeuRitmo', version: 1, exportedAt: new Date().toISOString(), data: store }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'meuritmo-backup-' + today + '.json'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    setToast('Backup preparado. Guarde o arquivo em um local seguro.')
  }
  const importBackup = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const parsed = JSON.parse(await file.text())
      const data = parsed?.data ?? parsed
      const valid = data && typeof data === 'object' && !Array.isArray(data) && Object.values(data).every((value: any) => value && typeof value === 'object' && Array.isArray(value.steps))
      if (!valid) throw new Error('Formato inválido')
      if (window.confirm('A restauração substituirá os registros deste navegador pelos dados do backup. Deseja continuar?')) {
        setStore(data as Store)
        setToast('Backup restaurado com sucesso.')
      }
    } catch {
      setToast('Não foi possível ler esse backup. Escolha um arquivo JSON válido do MeuRitmo.')
    } finally {
      event.target.value = ''
    }
  }
  const share = async () => { const text = `Hoje no MeuRitmo 🌿\nUm passo de cada vez: ${completed} de ${day.steps.length} pequenos passos concluídos.\nMenos cobrança. Mais presença.\nmeuritmo.app`; try { if (navigator.share) await navigator.share({ title: 'Meu dia no MeuRitmo', text }); else { await navigator.clipboard.writeText(text); setToast('Resumo copiado para compartilhar!') } } catch { /* compartilhamento cancelado */ } }
  const nav = [{ name: 'Hoje', icon: Sun }, { name: 'Meu diário', icon: BookHeart }, { name: 'Minha evolução', icon: Activity }]
  return <div className="app-shell">
    <aside className={`sidebar ${mobileMenu ? 'open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Leaf size={21}/></div><span>meu<span className="brand-light">ritmo</span><i>.</i></span></div>
      <div className="side-label">SEU ESPAÇO</div>
      <nav>{nav.map(item => <button key={item.name} className={active===item.name?'nav-item selected':'nav-item'} onClick={()=>{setActive(item.name);setMobileMenu(false)}}><item.icon size={18}/>{item.name}{active===item.name&&<span className="nav-dot"/>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="quote-card"><div className="quote-icon"><Heart size={16}/></div><p>“Você não precisa dar conta de tudo. Só precisa começar por algum lugar.”</p><span>UM LEMBRETE GENTIL</span></div><div className="profile"><div className="avatar">🌱</div><div><strong>Meu cantinho</strong><small>Seu espaço pessoal</small></div><button className="icon-button" title="Menu"><Menu size={17}/></button></div></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><button className="mobile-brand" onClick={()=>setMobileMenu(!mobileMenu)}><Leaf size={20}/> meu ritmo</button><div className="breadcrumb">Meu espaço <span>/</span> <b>{active}</b></div><div className="top-actions"><div className="streak-pill"><Flame size={16}/><b>{streak}</b><span>{streak===1?'dia':'dias'} de presença</span></div><button className="upgrade-button" onClick={()=>setToast('Novidades do plano premium em breve!')}><Crown size={15}/> Seja premium</button></div></header>
      <div className="content">
        {active==='Hoje' && <><section className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-line"/> {dateLabel}</div><h1>{greeting()}, que bom<br/>ter você <em>por aqui.</em></h1><p className="welcome-sub">Respire. Este é o seu espaço. Vamos cuidar de hoje, sem pressa?</p></div><div className="sun-art"><div className="sun-halo"/><div className="sun-face">☀️</div><span className="spark spark-one">✳</span><span className="spark spark-two">✦</span><span className="art-leaf">〰</span></div></section>
        <section className="dashboard-grid">
          <div className="main-column">
            <article className="panel mood-panel"><div className="panel-heading"><div><span className="section-kicker">01 — COMO VOCÊ ESTÁ?</span><h2>Faça seu check-in</h2><p>Não existe resposta certa. Como você se sente hoje?</p></div><div className="heading-icon peach"><Heart size={19}/></div></div><div className="mood-options">{moods.map(m=><button key={m.label} onClick={()=>update({mood:m.label})} className={day.mood===m.label?'mood-option active':'mood-option'}><span>{m.emoji}</span><small>{m.label}</small></button>)}</div>{day.mood&&<div className="inline-success"><CheckCircle2 size={14}/> Check-in registrado. Obrigado por se ouvir.</div>}</article>
            <article className="panel priority-panel"><div className="panel-heading"><div><span className="section-kicker">02 — O QUE IMPORTA</span><h2>Sua prioridade de hoje</h2><p>Uma coisa de cada vez. O que faria seu dia valer a pena?</p></div><div className="heading-icon lavender"><Target size={19}/></div></div><div className="priority-input-wrap"><input value={day.priority} onChange={e=>update({priority:e.target.value})} placeholder="Ex.: cuidar de mim, resolver algo importante..." maxLength={120}/><span className="input-spark">✳</span></div><div className="soft-hint"><Sparkles size={14}/> Pequeno também é progresso.</div></article>
            <article className="panel steps-panel"><div className="panel-heading"><div><span className="section-kicker">03 — NO SEU TEMPO</span><h2>Pequenos passos</h2><p>Divida sua prioridade em ações leves e possíveis.</p></div><div className="heading-icon mint"><Check size={19}/></div></div><div className="progress-area"><div className="progress-copy"><span>Seu progresso de hoje</span><b>{progress}%</b></div><div className="progress-track"><div className="progress-fill" style={{width:progress+'%'}}/></div></div><div className="steps-list">{day.steps.map(s=><div className={s.done?'step-row done':'step-row'} key={s.id}><button className="check-circle" onClick={()=>toggleStep(s.id)} aria-label={s.done?'Desmarcar':'Concluir'}>{s.done&&<Check size={13}/>}</button><span>{s.title}</span><button className="remove-step" onClick={()=>removeStep(s.id)} aria-label="Remover passo"><Trash2 size={14}/></button></div>)}{!day.steps.length&&<div className="empty-steps"> <span>🌿</span> Seus pequenos passos começam aqui.</div>}</div><form className="add-step" onSubmit={e=>{e.preventDefault();addStep()}}><Plus size={17}/><input value={newStep} onChange={e=>setNewStep(e.target.value)} placeholder="Adicionar um pequeno passo..." maxLength={90}/><button type="submit" disabled={!newStep.trim()}>Adicionar</button></form><div className="steps-footer"><span>{completed} de {day.steps.length} concluídos</span><span>Feito é melhor que perfeito ♡</span></div></article>
          </div>
          <div className="right-column"><article className="daily-card"><div className="daily-card-top"><span>SEU DIA, SEU RITMO</span><div className="daily-sun">✳</div></div><div className="daily-illustration"><div className="hill hill-back"/><div className="hill hill-front"/><span className="flower flower-a">✿</span><span className="flower flower-b">✾</span><span className="flower flower-c">✿</span></div><h3>Um dia de cada vez.</h3><p>Não compare seu capítulo 1 com o capítulo 20 de alguém.</p><button onClick={share}><Share2 size={15}/> Compartilhar meu progresso</button></article>
          <article className="panel journal-teaser"><div className="journal-top"><div className="heading-icon peach"><BookHeart size={18}/></div><span className="section-kicker">UM ESPAÇO SÓ SEU</span></div><h3>Coloque pra fora.</h3><p>Seus pensamentos merecem espaço. Escreva sem filtros, sem julgamentos.</p><button className="text-link" onClick={()=>{setJournal(day.note);setShowJournal(true)}}>Abrir meu diário <ArrowRight size={15}/></button></article>
          <article className="gentle-card"><div className="gentle-flower">✿</div><div><b>Um lembrete pra você</b><p>Descansar também faz parte do caminho. Você está indo bem.</p></div></article>
          <div className="privacy-note"><LockKeyhole size={13}/> Seus registros ficam neste dispositivo.</div></div>
        </section><footer className="footer-note">Feito com carinho, para a vida real. <span>♡</span></footer></>}
        {active==='Meu diário' && <section className="page-section"><div className="eyebrow"><span className="eyebrow-line"/> SEU ESPAÇO DE ACOLHIMENTO</div><h1>Seu diário, <em>suas palavras.</em></h1><p className="welcome-sub">Escreva o que vier. Aqui não existe certo ou errado.</p><div className="panel journal-page"><div className="journal-date"><BookHeart size={19}/> <b>{dateLabel}</b></div><textarea value={day.note} onChange={e=>update({note:e.target.value})} placeholder="Como foi seu dia? O que está passando pela sua cabeça? O que você gostaria de lembrar?..." rows={11}/><div className="journal-bottom"><span>✦ Este espaço é só seu.</span><span>{day.note.length} caracteres</span></div></div><div className="journal-privacy"><LockKeyhole size={15}/> Seu diário é salvo automaticamente neste navegador.</div></section>}
        {active==='Minha evolução' && <section className="page-section"><div className="eyebrow"><span className="eyebrow-line"/> CADA PASSO CONTA</div><h1>Olha só o quanto <em>você caminhou.</em></h1><p className="welcome-sub">Sua evolução não precisa ser perfeita. Ela só precisa ser sua.</p><div className="stats-grid"><div className="stat-card"><div className="heading-icon peach"><Flame size={20}/></div><strong>{streak}</strong><span>dias de presença seguidos</span></div><div className="stat-card"><div className="heading-icon mint"><CheckCircle2 size={20}/></div><strong>{Object.values(store).reduce((n,d)=>n+d.steps.filter(s=>s.done).length,0)}</strong><span>pequenos passos concluídos</span></div><div className="stat-card"><div className="heading-icon lavender"><Heart size={20}/></div><strong>{Object.values(store).filter(d=>d.mood).length}</strong><span>check-ins feitos</span></div></div><div className="backup-panel"><div><strong>Seus dados, sempre com você</strong><p>Baixe uma cópia dos seus registros ou restaure um backup anterior.</p></div><div className="backup-actions"><button onClick={exportBackup}><Download size={15}/> Baixar backup</button><label className="backup-import"><Upload size={15}/> Restaurar backup<input type="file" accept="application/json,.json" onChange={importBackup}/></label></div><small>O backup é um arquivo JSON. Guarde-o em um local seguro; ele pode conter informações pessoais do seu diário.</small></div><div className="panel history-panel"><div className="panel-heading"><div><span className="section-kicker">SEUS REGISTROS</span><h2>Uma história em construção</h2><p>Cada dia em que você aparece por si já é uma conquista.</p></div><Trophy className="history-trophy" size={24}/></div>{Object.entries(store).filter(([,d])=>d.mood||d.priority||d.note||d.steps.length).sort(([a],[b])=>b.localeCompare(a)).slice(0,12).map(([date,d])=><div className="history-row" key={date}><span className="history-date">{new Date(date+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})}</span><span className="history-mood">{moods.find(m=>m.label===d.mood)?.emoji||'🌱'}</span><span className="history-priority">{d.priority||d.note.slice(0,70)||'Um dia de presença'}</span><span className="history-count">{d.steps.filter(s=>s.done).length} passos</span></div>)}{!Object.values(store).some(d=>d.mood||d.priority||d.note||d.steps.length)&&<div className="empty-steps">Seus registros vão aparecer aqui conforme você usar o MeuRitmo.</div>}</div></section>}
      </div>
    </main>
    {showJournal&&<div className="modal-backdrop" onClick={()=>setShowJournal(false)}><div className="journal-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setShowJournal(false)}><X size={18}/></button><div className="heading-icon peach"><BookHeart size={20}/></div><span className="section-kicker">UM ESPAÇO SÓ SEU</span><h2>O que está no seu coração?</h2><p>Escreva livremente. Seus pensamentos têm lugar aqui.</p><textarea autoFocus value={journal||day.note} onChange={e=>setJournal(e.target.value)} placeholder="Pode começar por qualquer palavra..." rows={7}/><button className="primary-action" onClick={()=>{update({note:journal});setShowJournal(false);setActive('Meu diário');setToast('Seu registro foi salvo com carinho.')}}>Salvar meu registro <ArrowRight size={16}/></button></div></div>}
    {toast&&<div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
  </div>
}