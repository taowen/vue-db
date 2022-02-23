var ee=Object.defineProperty,te=Object.defineProperties;var se=Object.getOwnPropertyDescriptors;var D=Object.getOwnPropertySymbols;var re=Object.prototype.hasOwnProperty,ne=Object.prototype.propertyIsEnumerable;var R=(t,e,s)=>e in t?ee(t,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[e]=s,p=(t,e)=>{for(var s in e||(e={}))re.call(e,s)&&R(t,s,e[s]);if(D)for(var s of D(e))ne.call(e,s)&&R(t,s,e[s]);return t},F=(t,e)=>te(t,se(e));var a=(t,e,s)=>(R(t,typeof e!="symbol"?e+"":e,s),s);import{n as oe,i as j,h as ie,t as _,a as ae,r as x,g as I,e as B,K as ue,c as ce,b as g,o as de,d as q,f as y,w as J,v as le,j as w,k as S,l as O,m as fe,p as h,F as b,q as he,s as pe,u as me,x as ye,y as ve,z as M,A as ge}from"./vendor.0c0e7aab.js";const we=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function s(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerpolicy&&(o.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?o.credentials="include":n.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(n){if(n.ep)return;n.ep=!0;const o=s(n);fetch(n.href,o)}};we();const c={rpcProvider(){throw new Error("must install with rpcProvider before query or call")}},L=new Map;function be(t,e){v.provide(t),Object.assign(c,e),t.mixin({created(){if(c.dehydrate||c.hydrate){const n=this.$.render;this.$.render=function(...o){let i=n.apply(this,o);if((!j(i)||typeof i.type!="string")&&(i=ie("div",i)),c.hydrate)return i;i.props||(i.props={});const u={},f={};for(const[k,l]of Object.entries(_(this.$.data)))ae(l)&&l.value&&l.value.data&&((l.value.stale?f:u)[k]=l.value.data);return i.props["data-dehydrated"]=JSON.stringify(u),i.props["data-stale"]=JSON.stringify(f),i}}const s=this.$.type;let r=s.instanceCount;r||(r=s.instanceCount=x(0)),r.value++},beforeMount(){var o,i;if(!c.hydrate)return;const s=_(this.$.data),r=JSON.parse(((o=this.$el.dataset)==null?void 0:o.dehydrated)||"{}"),n=JSON.parse(((i=this.$el.dataset)==null?void 0:i.stale)||"{}");for(const u of Object.keys(n))s[u].value._query&&s[u].value._query.refresh();for(const[u,f]of Object.entries(p(p({},r),n)))s[u].value={loading:!1,data:f}},async serverPrefetch(){await v.inject().flushing}})}function $e(t,e){B(()=>{const s=e();for(const[r,n]of Object.entries(s))if(typeof n=="object")for(const[o,i]of Object.entries(n))t[r][o]=i;else t[r]=n})}function K(t){return Q(t.$).proxy}function Q(t){return!t.parent||t.parent.type===ue?t:Q(t.parent)}function P(t,e){if(t instanceof d){const s=G(t,e);return ce(()=>{const r=s.value;return{loading:r.loading,data:r.data[0],error:r.error}})}return E(t,e)[0]}function E(t,e){if(t instanceof d)return G(t,e);const s=t;s.instanceCount||(s.instanceCount=x(0)),s.instanceCount.value;const r=[];let n;if(e.$parent)n=e.$parent.$.subTree;else if(e.$root)n=e.$root.$.subTree,delete e.$root;else throw new Error("must provide $parent or $root");return T(r,n,s,e),r}function T(t,e,s,r){if(!!e){if(e.component)e.type===s&&qe(e.component.proxy,r)&&t.push(e.component.proxy),T(t,e.component.subTree,s,r);else if(Array.isArray(e.children))for(const n of e.children)j(n)&&T(t,n,s,r)}}function qe(t,e){if(!e)return!0;for(const[s,r]of Object.entries(e))if(s==="$parent"){if(t.$.parent.proxy!==r)return!1}else if(t[s]!==r)return!1;return!0}function ke(t,e,...s){const r=t.$;H(!0,e,s,r)}function z(t,e,s){if(s.component)H(!1,t,e,s.component);else if(Array.isArray(s.children))for(const r of s.children)j(r)&&z(t,e,r)}function H(t,e,s,r){const n=r.proxy;!t&&n[e]?n[e].apply(n,s):z(e,s,r.subTree)}function $(){return new Promise(t=>{oe(t)})}async function N(t){return new Promise(e=>setTimeout(e,t))}function U(t,e){if(e instanceof d)return t;if(t.$.type!==e)throw new Error("type mismatch");return t}function W(t){let e=this&&this.Resource!==d?this:void 0;return{as(s){const r=n=>{const o=[];for(const f of t.affectedTables){const k=L.get(f);for(const l of k||[])o.push(l.newRequest())}const i=t.command||s,u=new Y(i,n);return c.rpcProvider(o,u),u.promise};return F(p({},e),{[s]:r,defineCommand:W})}}}function Re(t,e){return g(new d(t,e))}const m=class{constructor(){a(this,"buffered",[]);a(this,"flushing")}static provide(e){e.provide(m.key,new m)}static inject(){return I().appContext.provides[m.key]}execute(e){this.buffered.push(e),this.buffered.length===1&&(this.flushing=this.flush())}async flush(){await $();const e=this.buffered;this.buffered=[],await c.rpcProvider(e),this.flushing=void 0}};let v=m;a(v,"key",Symbol());class Ce{constructor(e,s){a(this,"result",x({loading:!1,data:[],error:void 0,_query:this}));a(this,"criteria",{});a(this,"version",0);a(this,"queryBuffer");this.resource=e,this.queryBuffer=v.inject();const r=I();B(()=>{s&&(this.criteria=s()),c.hydrate&&!r.isMounted||this.queryBuffer.execute(this.newRequest(!r.isMounted))})}newRequest(e){return this.version++,new X(this,!!e)}refresh(){this.queryBuffer.execute(this.newRequest())}}class d{constructor(e,s){a(this,"pickedFields");a(this,"subResources",{});this.table=e,this.options=s}clone(){const e=new d(this.table,this.options);return e.pickedFields=this.pickedFields,e.subResources=p({},this.subResources),e}pick(...e){const s=this.clone();return s.pickedFields=e,g(s)}load(e,s,r,n){const o=this.clone();return o.subResources[e]={single:!0,resource:s,dynamicCriteria:r,staticCriteria:n==null?void 0:n.staticCriteria},g(o)}query(e,s,r,n){const o=this.clone();return o.subResources[e]={resource:s,dynamicCriteria:r,staticCriteria:n==null?void 0:n.staticCriteria},g(o)}toJSON(){var e;return{table:this.table,staticCriteria:(e=this.options)==null?void 0:e.staticCriteria,subResources:Object.keys(this.subResources).length===0?void 0:this.subResources}}}function G(t,e){const s=new Ce(_(t),e);return I().scope.run(()=>{let r=L.get(t.table);r||L.set(t.table,r=new Set),r.add(s),de(()=>{r.delete(s)})}),s.result}class X{constructor(e,s){a(this,"baseVersion");a(this,"criteria");a(this,"showingLoading");this.query=e,this.showLoading=s,this.baseVersion=e.version,this.criteria=e.criteria,s&&!c.dehydrate&&(c.loadingPreDelay?N(c.loadingPreDelay||0).then(()=>{this.showingLoading=this.loadingCountdown()}):this.showingLoading=this.loadingCountdown())}async loadingCountdown(){this.isExpired||(this.query.result.value={loading:!0,data:[],error:void 0},await N(c.loadingPostDelay||0))}get resource(){return this.query.resource}get isExpired(){return this.baseVersion!==this.query.version}resolve(e,s){if(!this.isExpired){if(this.showingLoading){this.showingLoading.then(()=>{this.showingLoading=void 0,this.resolve(e,s)});return}this.query.version++,this.query.result.value={loading:!1,data:e,error:void 0,stale:s}}}reject(e){if(!this.isExpired){if(this.showingLoading){this.showingLoading.then(()=>{this.showingLoading=void 0,this.reject(e)});return}this.query.version++,this.query.result.value={loading:!1,data:[],error:e}}}toJSON(){return{resource:this.resource,criteria:this.criteria}}}class Y{constructor(e,s){a(this,"promise");a(this,"resolve");a(this,"reject");a(this,"responded",!1);this.command=e,this.args=s,this.promise=new Promise((r,n)=>{this.resolve=o=>{this.responded||(this.responded=!0,r(o))},this.reject=o=>{this.responded||(this.responded=!0,n(o))}})}toJSON(){return{command:this.command,args:this.args}}}var _e=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",install:be,animate:$e,pageOf:K,load:P,query:E,walk:ke,waitNextTick:$,sleep:N,castTo:U,defineCommand:W,defineResource:Re,Resource:d,QueryRequest:X,CommandRequest:Y}),V=(t,e)=>{const s=t.__vccOpts||t;for(const[r,n]of e)s[r]=n;return s};const Oe=q({props:{itemId:{type:String,required:!0}},data(){return{visible:!1,content:"",completed:!1}},methods:{init(t){this.visible=!0,this.content=t},onRemove(){U(this.$parent,A).remove(this.itemId)}}}),Le={key:0};function Te(t,e,s,r,n,o){return t.visible?(h(),y("div",Le,[J(w("input",{type:"checkbox","onUpdate:modelValue":e[0]||(e[0]=i=>t.completed=i)},null,512),[[le,t.completed]]),S(" "+O(t.content)+" ",1),w("button",{onClick:e[1]||(e[1]=(...i)=>t.onRemove&&t.onRemove(...i))},"x")])):fe("",!0)}var C=V(Oe,[["render",Te]]);const Ne=q({components:{TodoListItem:C},data(){return{itemIds:[]}},computed:{completedCount(){let t=0;for(const e of E(C,{$parent:this}))e.completed&&t++;return t}},methods:{async add(){const t=`${new Date().getTime()}`;return this.itemIds.push(t),await $(),P(C,{$parent:this,itemId:t})},async remove(t){const e=this.itemIds.indexOf(t);e!==-1&&(this.itemIds.splice(e,1),await $())}}});function je(t,e,s,r,n,o){const i=pe("TodoListItem");return h(),y(b,null,[S(O(t.completedCount)+" out of "+O(t.itemIds.length)+" items completed ",1),(h(!0),y(b,null,he(t.itemIds,u=>(h(),me(i,{key:u,itemId:u},null,8,["itemId"]))),128))],64)}var A=V(Ne,[["render",je]]);const xe=q({data(){return{content:""}},methods:{async onEnter(){if(!this.content)return;(await P(A,{$root:K(this)}).add()).init(this.content),this.content=""}}}),Ie=S(" What needs to be done? ");function Se(t,e,s,r,n,o){return h(),y(b,null,[Ie,J(w("input",{type:"textbox","onUpdate:modelValue":e[0]||(e[0]=i=>t.content=i),onKeyup:e[1]||(e[1]=ve((...i)=>t.onEnter&&t.onEnter(...i),["enter"]))},null,544),[[ye,t.content]])],64)}var Pe=V(xe,[["render",Se]]);const Ee=w("h1",null,"To-Do List",-1),Ve=q({setup(t){return(e,s)=>(h(),y(b,null,[Ee,M(Pe),M(A)],64))}}),Z=ge(Ve);Z.use(_e);Z.mount("#app");
