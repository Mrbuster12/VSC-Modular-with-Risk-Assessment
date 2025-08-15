// shared/session-store.js
window.SessionStore = (()=>{
  const KEY="vsc_session_state";
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(_){return{}}};
  const write=o=>{try{localStorage.setItem(KEY,JSON.stringify(o))}catch(_){}};
  return {get(){return read()}, saveEnvelope(env){const st=read(); st.envelope=env; st.updated_at=Date.now(); write(st);}, clear(){localStorage.removeItem(KEY)}};
})();