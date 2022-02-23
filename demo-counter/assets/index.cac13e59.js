var Z=Object.defineProperty,ee=Object.defineProperties;var te=Object.getOwnPropertyDescriptors;var E=Object.getOwnPropertySymbols;var re=Object.prototype.hasOwnProperty,se=Object.prototype.propertyIsEnumerable;var k=(r,e,t)=>e in r?Z(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,y=(r,e)=>{for(var t in e||(e={}))re.call(e,t)&&k(r,t,e[t]);if(E)for(var t of E(e))se.call(e,t)&&k(r,t,e[t]);return r},V=(r,e)=>ee(r,te(e));var a=(r,e,t)=>(k(r,typeof e!="symbol"?e+"":e,t),t);import{d as w,c as j,o as p,i as N,h as ne,t as C,a as oe,r as P,g as T,e as J,K as F,b as ie,n as ae,f as g,j as ue,k as ce,l as M,m as le,p as h,w as _,q as H,s as q,u as de,T as fe,v as he,x as pe,y as ye}from"./vendor.8bc3a274.js";const me=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerpolicy&&(o.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?o.credentials="include":n.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}};me();var b=(r,e)=>{const t=r.__vccOpts||r;for(const[s,n]of e)t[s]=n;return t};const ve=w({data(){return{count:1}},methods:{increase(){this.count+=1}}}),ge=["value"];function _e(r,e,t,s,n,o){return p(),j("input",{type:"textbox",value:r.count},null,8,ge)}var L=b(ve,[["render",_e]]);const u={rpcProvider(){throw new Error("must install with rpcProvider before query or call")}},R=new Map;function we(r,e){v.provide(r),Object.assign(u,e),r.mixin({created(){if(u.dehydrate||u.hydrate){const n=this.$.render;this.$.render=function(...o){let i=n.apply(this,o);if((!N(i)||typeof i.type!="string")&&(i=ne("div",i)),u.hydrate)return i;i.props||(i.props={});const c={},f={};for(const[$,d]of Object.entries(C(this.$.data)))oe(d)&&d.value&&d.value.data&&((d.value.stale?f:c)[$]=d.value.data);return i.props["data-dehydrated"]=JSON.stringify(c),i.props["data-stale"]=JSON.stringify(f),i}}const t=this.$.type;let s=t.instanceCount;s||(s=t.instanceCount=P(0)),s.value++},beforeMount(){var o,i;if(!u.hydrate)return;const t=C(this.$.data),s=JSON.parse(((o=this.$el.dataset)==null?void 0:o.dehydrated)||"{}"),n=JSON.parse(((i=this.$el.dataset)==null?void 0:i.stale)||"{}");for(const c of Object.keys(n))t[c].value._query&&t[c].value._query.refresh();for(const[c,f]of Object.entries(y(y({},s),n)))t[c].value={loading:!1,data:f}},async serverPrefetch(){await v.inject().flushing}})}function be(r,e){J(()=>{const t=e();for(const[s,n]of Object.entries(t))if(typeof n=="object")for(const[o,i]of Object.entries(n))r[s][o]=i;else r[s]=n})}function S(r){return K(r.$).proxy}function K(r){return!r.parent||r.parent.type===F?r:K(r.parent)}function B(r,e){if(r instanceof l){const t=U(r,e);return ie(()=>{const s=t.value;return{loading:s.loading,data:s.data[0],error:s.error}})}return Q(r,e)[0]}function Q(r,e){if(r instanceof l)return U(r,e);const t=r;t.instanceCount||(t.instanceCount=P(0)),t.instanceCount.value;const s=[];let n;if(e.$parent)n=e.$parent.$.subTree;else if(e.$root)n=e.$root.$.subTree,delete e.$root;else throw new Error("must provide $parent or $root");return x(s,n,t,e),s}function x(r,e,t,s){if(!!e){if(e.component)e.type===t&&$e(e.component.proxy,s)&&r.push(e.component.proxy),x(r,e.component.subTree,t,s);else if(Array.isArray(e.children))for(const n of e.children)N(n)&&x(r,n,t,s)}}function $e(r,e){if(!e)return!0;for(const[t,s]of Object.entries(e))if(t==="$parent"){if(r.$.parent.proxy!==s)return!1}else if(r[t]!==s)return!1;return!0}function ke(r,e,...t){const s=r.$;I(!0,e,t,s)}function G(r,e,t){if(t.component)I(!1,r,e,t.component);else if(Array.isArray(t.children))for(const s of t.children)N(s)&&G(r,e,s)}function I(r,e,t,s){const n=s.proxy;!r&&n[e]?n[e].apply(n,t):G(e,t,s.subTree)}function z(){return new Promise(r=>{ae(r)})}async function O(r){return new Promise(e=>setTimeout(e,r))}function qe(r,e){if(e instanceof l)return r;if(r.$.type!==e)throw new Error("type mismatch");return r}function W(r){let e=this&&this.Resource!==l?this:void 0;return{as(t){const s=n=>{const o=[];for(const f of r.affectedTables){const $=R.get(f);for(const d of $||[])o.push(d.newRequest())}const i=r.command||t,c=new Y(i,n);return u.rpcProvider(o,c),c.promise};return V(y({},e),{[t]:s,defineCommand:W})}}}function Ce(r,e){return g(new l(r,e))}const m=class{constructor(){a(this,"buffered",[]);a(this,"flushing")}static provide(e){e.provide(m.key,new m)}static inject(){return T().appContext.provides[m.key]}execute(e){this.buffered.push(e),this.buffered.length===1&&(this.flushing=this.flush())}async flush(){await z();const e=this.buffered;this.buffered=[],await u.rpcProvider(e),this.flushing=void 0}};let v=m;a(v,"key",Symbol());class Re{constructor(e,t){a(this,"result",P({loading:!1,data:[],error:void 0,_query:this}));a(this,"criteria",{});a(this,"version",0);a(this,"queryBuffer");this.resource=e,this.queryBuffer=v.inject();const s=T();J(()=>{t&&(this.criteria=t()),u.hydrate&&!s.isMounted||this.queryBuffer.execute(this.newRequest(!s.isMounted))})}newRequest(e){return this.version++,new X(this,!!e)}refresh(){this.queryBuffer.execute(this.newRequest())}}class l{constructor(e,t){a(this,"pickedFields");a(this,"subResources",{});this.table=e,this.options=t}clone(){const e=new l(this.table,this.options);return e.pickedFields=this.pickedFields,e.subResources=y({},this.subResources),e}pick(...e){const t=this.clone();return t.pickedFields=e,g(t)}load(e,t,s,n){const o=this.clone();return o.subResources[e]={single:!0,resource:t,dynamicCriteria:s,staticCriteria:n==null?void 0:n.staticCriteria},g(o)}query(e,t,s,n){const o=this.clone();return o.subResources[e]={resource:t,dynamicCriteria:s,staticCriteria:n==null?void 0:n.staticCriteria},g(o)}toJSON(){var e;return{table:this.table,staticCriteria:(e=this.options)==null?void 0:e.staticCriteria,subResources:Object.keys(this.subResources).length===0?void 0:this.subResources}}}function U(r,e){const t=new Re(C(r),e);return T().scope.run(()=>{let s=R.get(r.table);s||R.set(r.table,s=new Set),s.add(t),ue(()=>{s.delete(t)})}),t.result}class X{constructor(e,t){a(this,"baseVersion");a(this,"criteria");a(this,"showingLoading");this.query=e,this.showLoading=t,this.baseVersion=e.version,this.criteria=e.criteria,t&&!u.dehydrate&&(u.loadingPreDelay?O(u.loadingPreDelay||0).then(()=>{this.showingLoading=this.loadingCountdown()}):this.showingLoading=this.loadingCountdown())}async loadingCountdown(){this.isExpired||(this.query.result.value={loading:!0,data:[],error:void 0},await O(u.loadingPostDelay||0))}get resource(){return this.query.resource}get isExpired(){return this.baseVersion!==this.query.version}resolve(e,t){if(!this.isExpired){if(this.showingLoading){this.showingLoading.then(()=>{this.showingLoading=void 0,this.resolve(e,t)});return}this.query.version++,this.query.result.value={loading:!1,data:e,error:void 0,stale:t}}}reject(e){if(!this.isExpired){if(this.showingLoading){this.showingLoading.then(()=>{this.showingLoading=void 0,this.reject(e)});return}this.query.version++,this.query.result.value={loading:!1,data:[],error:e}}}toJSON(){return{resource:this.resource,criteria:this.criteria}}}class Y{constructor(e,t){a(this,"promise");a(this,"resolve");a(this,"reject");a(this,"responded",!1);this.command=e,this.args=t,this.promise=new Promise((s,n)=>{this.resolve=o=>{this.responded||(this.responded=!0,s(o))},this.reject=o=>{this.responded||(this.responded=!0,n(o))}})}toJSON(){return{command:this.command,args:this.args}}}var xe=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",install:we,animate:be,pageOf:S,load:B,query:Q,walk:ke,waitNextTick:z,sleep:O,castTo:qe,defineCommand:W,defineResource:Ce,Resource:l,QueryRequest:X,CommandRequest:Y});const Oe=w({methods:{onClicked(){var r;(r=B(L,{$root:S(this)}))==null||r.increase()}}});function je(r,e,t,s,n,o){return p(),j("button",{onClick:e[0]||(e[0]=(...i)=>r.onClicked&&r.onClicked(...i))},"+")}var Ne=b(Oe,[["render",je]]);const Pe=w({computed:{displayBack(){var e;return(((e=B(L,{$root:S(this)}))==null?void 0:e.count)||0)+20}}});function Te(r,e,t,s,n,o){return" current is: "+ce(r.displayBack)}var Le=b(Pe,[["render",Te]]);const Se={style:{display:"flex","flex-direction":"row","column-gap":"8px"}},Be=H("Go to Counter1"),Ae=H("Go to Counter2"),D=w({setup(r){return(e,t)=>{const s=M("router-link");return p(),j("div",null,[le("p",Se,[h(s,{to:"/"},{default:_(()=>[Be]),_:1}),h(s,{to:"/counter2"},{default:_(()=>[Ae]),_:1})]),h(Le),h(L),h(Ne)])}}});const Ee={};function Ve(r,e){const t=M("router-view");return p(),q(t,null,{default:_(({Component:s,route:n})=>[h(fe,{name:"fade"},{default:_(()=>[(p(),q(F,null,[(p(),q(de(s),{key:n.path}))],1024))]),_:2},1024)]),_:1})}var De=b(Ee,[["render",Ve]]);const Je=[{path:"/",component:D},{path:"/counter2",component:D}],Fe=he({history:pe(),routes:Je}),A=ye(De);A.use(Fe);A.use(xe);A.mount("#app");