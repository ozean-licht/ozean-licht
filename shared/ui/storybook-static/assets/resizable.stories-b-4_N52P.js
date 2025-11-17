import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{r as m,a as Da}from"./index-B2-qRKKC.js";import{c as ma}from"./cn-CytzSlOG.js";import{c as _a}from"./createLucideIcon-BbF4D6Jl.js";import{B as ue}from"./button-DP4L7qO7.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-BiMR7eR1.js";import"./index-BFjtS4uE.js";import"./index-DVF2XGCm.js";/**
 * @license lucide-react v0.553.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ga=[["circle",{cx:"9",cy:"12",r:"1",key:"1vctgf"}],["circle",{cx:"9",cy:"5",r:"1",key:"hp0tcf"}],["circle",{cx:"9",cy:"19",r:"1",key:"fkjjf6"}],["circle",{cx:"15",cy:"12",r:"1",key:"1tmaij"}],["circle",{cx:"15",cy:"5",r:"1",key:"19l28e"}],["circle",{cx:"15",cy:"19",r:"1",key:"f4zoj3"}]],$a=_a("grip-vertical",Ga),Ve=m.createContext(null);Ve.displayName="PanelGroupContext";const M={group:"data-panel-group",groupDirection:"data-panel-group-direction",groupId:"data-panel-group-id",panel:"data-panel",panelCollapsible:"data-panel-collapsible",panelId:"data-panel-id",panelSize:"data-panel-size",resizeHandle:"data-resize-handle",resizeHandleActive:"data-resize-handle-active",resizeHandleEnabled:"data-panel-resize-handle-enabled",resizeHandleId:"data-panel-resize-handle-id",resizeHandleState:"data-resize-handle-state"},Qe=10,le=m.useLayoutEffect,nt=Da.useId,Va=typeof nt=="function"?nt:()=>null;let qa=0;function Ze(t=null){const a=Va(),n=m.useRef(t||a||null);return n.current===null&&(n.current=""+qa++),t??n.current}function pa({children:t,className:a="",collapsedSize:n,collapsible:s,defaultSize:i,forwardedRef:l,id:r,maxSize:o,minSize:d,onCollapse:h,onExpand:w,onResize:f,order:c,style:z,tagName:b="div",...C}){const R=m.useContext(Ve);if(R===null)throw Error("Panel components must be rendered within a PanelGroup container");const{collapsePanel:j,expandPanel:k,getPanelSize:A,getPanelStyle:G,groupId:X,isPanelCollapsed:I,reevaluatePanelConstraints:S,registerPanel:U,resizePanel:Z,unregisterPanel:O}=R,B=Ze(r),L=m.useRef({callbacks:{onCollapse:h,onExpand:w,onResize:f},constraints:{collapsedSize:n,collapsible:s,defaultSize:i,maxSize:o,minSize:d},id:B,idIsFromProps:r!==void 0,order:c});m.useRef({didLogMissingDefaultSizeWarning:!1}),le(()=>{const{callbacks:q,constraints:$}=L.current,T={...$};L.current.id=B,L.current.idIsFromProps=r!==void 0,L.current.order=c,q.onCollapse=h,q.onExpand=w,q.onResize=f,$.collapsedSize=n,$.collapsible=s,$.defaultSize=i,$.maxSize=o,$.minSize=d,(T.collapsedSize!==$.collapsedSize||T.collapsible!==$.collapsible||T.maxSize!==$.maxSize||T.minSize!==$.minSize)&&S(L.current,T)}),le(()=>{const q=L.current;return U(q),()=>{O(q)}},[c,B,U,O]),m.useImperativeHandle(l,()=>({collapse:()=>{j(L.current)},expand:q=>{k(L.current,q)},getId(){return B},getSize(){return A(L.current)},isCollapsed(){return I(L.current)},isExpanded(){return!I(L.current)},resize:q=>{Z(L.current,q)}}),[j,k,A,I,B,Z]);const ne=G(L.current,i);return m.createElement(b,{...C,children:t,className:a,id:B,style:{...ne,...z},[M.groupId]:X,[M.panel]:"",[M.panelCollapsible]:s||void 0,[M.panelId]:B,[M.panelSize]:parseFloat(""+ne.flexGrow).toFixed(1)})}const fa=m.forwardRef((t,a)=>m.createElement(pa,{...t,forwardedRef:a}));pa.displayName="Panel";fa.displayName="forwardRef(Panel)";let Ye=null,_e=-1,te=null;function Ba(t,a,n){const s=(a&ga)!==0,i=(a&Na)!==0,l=(a&za)!==0,r=(a&ya)!==0;if(a){if(s)return l?"se-resize":r?"ne-resize":"e-resize";if(i)return l?"sw-resize":r?"nw-resize":"w-resize";if(l)return"s-resize";if(r)return"n-resize"}switch(t){case"horizontal":return"ew-resize";case"intersection":return"move";case"vertical":return"ns-resize"}}function Ta(){te!==null&&(document.head.removeChild(te),Ye=null,te=null,_e=-1)}function We(t,a,n){var s,i;const l=Ba(t,a);if(Ye!==l){if(Ye=l,te===null&&(te=document.createElement("style"),document.head.appendChild(te)),_e>=0){var r;(r=te.sheet)===null||r===void 0||r.removeRule(_e)}_e=(s=(i=te.sheet)===null||i===void 0?void 0:i.insertRule(`*{cursor: ${l} !important;}`))!==null&&s!==void 0?s:-1}}function va(t){return t.type==="keydown"}function xa(t){return t.type.startsWith("pointer")}function ha(t){return t.type.startsWith("mouse")}function qe(t){if(xa(t)){if(t.isPrimary)return{x:t.clientX,y:t.clientY}}else if(ha(t))return{x:t.clientX,y:t.clientY};return{x:1/0,y:1/0}}function Fa(){if(typeof matchMedia=="function")return matchMedia("(pointer:coarse)").matches?"coarse":"fine"}function Oa(t,a,n){return t.x<a.x+a.width&&t.x+t.width>a.x&&t.y<a.y+a.height&&t.y+t.height>a.y}function Wa(t,a){if(t===a)throw new Error("Cannot compare node with itself");const n={a:it(t),b:it(a)};let s;for(;n.a.at(-1)===n.b.at(-1);)t=n.a.pop(),a=n.b.pop(),s=t;N(s,"Stacking order can only be calculated for elements with a common ancestor");const i={a:lt(st(n.a)),b:lt(st(n.b))};if(i.a===i.b){const l=s.childNodes,r={a:n.a.at(-1),b:n.b.at(-1)};let o=l.length;for(;o--;){const d=l[o];if(d===r.a)return 1;if(d===r.b)return-1}}return Math.sign(i.a-i.b)}const Ua=/\b(?:position|zIndex|opacity|transform|webkitTransform|mixBlendMode|filter|webkitFilter|isolation)\b/;function Ja(t){var a;const n=getComputedStyle((a=ba(t))!==null&&a!==void 0?a:t).display;return n==="flex"||n==="inline-flex"}function Ka(t){const a=getComputedStyle(t);return!!(a.position==="fixed"||a.zIndex!=="auto"&&(a.position!=="static"||Ja(t))||+a.opacity<1||"transform"in a&&a.transform!=="none"||"webkitTransform"in a&&a.webkitTransform!=="none"||"mixBlendMode"in a&&a.mixBlendMode!=="normal"||"filter"in a&&a.filter!=="none"||"webkitFilter"in a&&a.webkitFilter!=="none"||"isolation"in a&&a.isolation==="isolate"||Ua.test(a.willChange)||a.webkitOverflowScrolling==="touch")}function st(t){let a=t.length;for(;a--;){const n=t[a];if(N(n,"Missing node"),Ka(n))return n}return null}function lt(t){return t&&Number(getComputedStyle(t).zIndex)||0}function it(t){const a=[];for(;t;)a.push(t),t=ba(t);return a}function ba(t){const{parentNode:a}=t;return a&&a instanceof ShadowRoot?a.host:a}const ga=1,Na=2,za=4,ya=8,Xa=Fa()==="coarse";let K=[],me=!1,ae=new Map,Be=new Map;const He=new Set;function Ya(t,a,n,s,i){var l;const{ownerDocument:r}=a,o={direction:n,element:a,hitAreaMargins:s,setResizeHandlerState:i},d=(l=ae.get(r))!==null&&l!==void 0?l:0;return ae.set(r,d+1),He.add(o),Ge(),function(){var w;Be.delete(t),He.delete(o);const f=(w=ae.get(r))!==null&&w!==void 0?w:1;if(ae.set(r,f-1),Ge(),f===1&&ae.delete(r),K.includes(o)){const c=K.indexOf(o);c>=0&&K.splice(c,1),Te(),i("up",!0,null)}}}function Qa(t){const{target:a}=t,{x:n,y:s}=qe(t);me=!0,et({target:a,x:n,y:s}),Ge(),K.length>0&&($e("down",t),Te(),t.preventDefault(),ja(a)||t.stopImmediatePropagation())}function Ue(t){const{x:a,y:n}=qe(t);if(me&&t.type!=="pointerleave"&&t.buttons===0&&(me=!1,$e("up",t)),!me){const{target:s}=t;et({target:s,x:a,y:n})}$e("move",t),Te(),K.length>0&&t.preventDefault()}function Je(t){const{target:a}=t,{x:n,y:s}=qe(t);Be.clear(),me=!1,K.length>0&&(t.preventDefault(),ja(a)||t.stopImmediatePropagation()),$e("up",t),et({target:a,x:n,y:s}),Te(),Ge()}function ja(t){let a=t;for(;a;){if(a.hasAttribute(M.resizeHandle))return!0;a=a.parentElement}return!1}function et({target:t,x:a,y:n}){K.splice(0);let s=null;(t instanceof HTMLElement||t instanceof SVGElement)&&(s=t),He.forEach(i=>{const{element:l,hitAreaMargins:r}=i,o=l.getBoundingClientRect(),{bottom:d,left:h,right:w,top:f}=o,c=Xa?r.coarse:r.fine;if(a>=h-c&&a<=w+c&&n>=f-c&&n<=d+c){if(s!==null&&document.contains(s)&&l!==s&&!l.contains(s)&&!s.contains(l)&&Wa(s,l)>0){let b=s,C=!1;for(;b&&!b.contains(l);){if(Oa(b.getBoundingClientRect(),o)){C=!0;break}b=b.parentElement}if(C)return}K.push(i)}})}function Ke(t,a){Be.set(t,a)}function Te(){let t=!1,a=!1;K.forEach(s=>{const{direction:i}=s;i==="horizontal"?t=!0:a=!0});let n=0;Be.forEach(s=>{n|=s}),t&&a?We("intersection",n):t?We("horizontal",n):a?We("vertical",n):Ta()}let Xe;function Ge(){var t;(t=Xe)===null||t===void 0||t.abort(),Xe=new AbortController;const a={capture:!0,signal:Xe.signal};He.size&&(me?(K.length>0&&ae.forEach((n,s)=>{const{body:i}=s;n>0&&(i.addEventListener("contextmenu",Je,a),i.addEventListener("pointerleave",Ue,a),i.addEventListener("pointermove",Ue,a))}),ae.forEach((n,s)=>{const{body:i}=s;i.addEventListener("pointerup",Je,a),i.addEventListener("pointercancel",Je,a)})):ae.forEach((n,s)=>{const{body:i}=s;n>0&&(i.addEventListener("pointerdown",Qa,a),i.addEventListener("pointermove",Ue,a))}))}function $e(t,a){He.forEach(n=>{const{setResizeHandlerState:s}=n,i=K.includes(n);s(t,i,a)})}function Za(){const[t,a]=m.useState(0);return m.useCallback(()=>a(n=>n+1),[])}function N(t,a){if(!t)throw console.error(a),Error(a)}function ie(t,a,n=Qe){return t.toFixed(n)===a.toFixed(n)?0:t>a?1:-1}function ee(t,a,n=Qe){return ie(t,a,n)===0}function W(t,a,n){return ie(t,a,n)===0}function en(t,a,n){if(t.length!==a.length)return!1;for(let s=0;s<t.length;s++){const i=t[s],l=a[s];if(!W(i,l,n))return!1}return!0}function ce({panelConstraints:t,panelIndex:a,size:n}){const s=t[a];N(s!=null,`Panel constraints not found for index ${a}`);let{collapsedSize:i=0,collapsible:l,maxSize:r=100,minSize:o=0}=s;if(ie(n,o)<0)if(l){const d=(i+o)/2;ie(n,d)<0?n=i:n=o}else n=o;return n=Math.min(r,n),n=parseFloat(n.toFixed(Qe)),n}function Ie({delta:t,initialLayout:a,panelConstraints:n,pivotIndices:s,prevLayout:i,trigger:l}){if(W(t,0))return a;const r=[...a],[o,d]=s;N(o!=null,"Invalid first pivot index"),N(d!=null,"Invalid second pivot index");let h=0;if(l==="keyboard"){{const f=t<0?d:o,c=n[f];N(c,`Panel constraints not found for index ${f}`);const{collapsedSize:z=0,collapsible:b,minSize:C=0}=c;if(b){const R=a[f];if(N(R!=null,`Previous layout not found for panel index ${f}`),W(R,z)){const j=C-R;ie(j,Math.abs(t))>0&&(t=t<0?0-j:j)}}}{const f=t<0?o:d,c=n[f];N(c,`No panel constraints found for index ${f}`);const{collapsedSize:z=0,collapsible:b,minSize:C=0}=c;if(b){const R=a[f];if(N(R!=null,`Previous layout not found for panel index ${f}`),W(R,C)){const j=R-z;ie(j,Math.abs(t))>0&&(t=t<0?0-j:j)}}}}{const f=t<0?1:-1;let c=t<0?d:o,z=0;for(;;){const C=a[c];N(C!=null,`Previous layout not found for panel index ${c}`);const j=ce({panelConstraints:n,panelIndex:c,size:100})-C;if(z+=j,c+=f,c<0||c>=n.length)break}const b=Math.min(Math.abs(t),Math.abs(z));t=t<0?0-b:b}{let c=t<0?o:d;for(;c>=0&&c<n.length;){const z=Math.abs(t)-Math.abs(h),b=a[c];N(b!=null,`Previous layout not found for panel index ${c}`);const C=b-z,R=ce({panelConstraints:n,panelIndex:c,size:C});if(!W(b,R)&&(h+=b-R,r[c]=R,h.toFixed(3).localeCompare(Math.abs(t).toFixed(3),void 0,{numeric:!0})>=0))break;t<0?c--:c++}}if(en(i,r))return i;{const f=t<0?d:o,c=a[f];N(c!=null,`Previous layout not found for panel index ${f}`);const z=c+h,b=ce({panelConstraints:n,panelIndex:f,size:z});if(r[f]=b,!W(b,z)){let C=z-b,j=t<0?d:o;for(;j>=0&&j<n.length;){const k=r[j];N(k!=null,`Previous layout not found for panel index ${j}`);const A=k+C,G=ce({panelConstraints:n,panelIndex:j,size:A});if(W(k,G)||(C-=G-k,r[j]=G),W(C,0))break;t>0?j--:j++}}}const w=r.reduce((f,c)=>c+f,0);return W(w,100)?r:i}function tn({layout:t,panelsArray:a,pivotIndices:n}){let s=0,i=100,l=0,r=0;const o=n[0];N(o!=null,"No pivot index found"),a.forEach((f,c)=>{const{constraints:z}=f,{maxSize:b=100,minSize:C=0}=z;c===o?(s=C,i=b):(l+=C,r+=b)});const d=Math.min(i,100-l),h=Math.max(s,100-r),w=t[o];return{valueMax:d,valueMin:h,valueNow:w}}function Me(t,a=document){return Array.from(a.querySelectorAll(`[${M.resizeHandleId}][data-panel-group-id="${t}"]`))}function Sa(t,a,n=document){const i=Me(t,n).findIndex(l=>l.getAttribute(M.resizeHandleId)===a);return i??null}function Pa(t,a,n){const s=Sa(t,a,n);return s!=null?[s,s+1]:[-1,-1]}function an(t){return t instanceof HTMLElement?!0:typeof t=="object"&&t!==null&&"tagName"in t&&"getAttribute"in t}function wa(t,a=document){if(an(a)&&a.dataset.panelGroupId==t)return a;const n=a.querySelector(`[data-panel-group][data-panel-group-id="${t}"]`);return n||null}function Fe(t,a=document){const n=a.querySelector(`[${M.resizeHandleId}="${t}"]`);return n||null}function nn(t,a,n,s=document){var i,l,r,o;const d=Fe(a,s),h=Me(t,s),w=d?h.indexOf(d):-1,f=(i=(l=n[w])===null||l===void 0?void 0:l.id)!==null&&i!==void 0?i:null,c=(r=(o=n[w+1])===null||o===void 0?void 0:o.id)!==null&&r!==void 0?r:null;return[f,c]}function sn({committedValuesRef:t,eagerValuesRef:a,groupId:n,layout:s,panelDataArray:i,panelGroupElement:l,setLayout:r}){m.useRef({didWarnAboutMissingResizeHandle:!1}),le(()=>{if(!l)return;const o=Me(n,l);for(let d=0;d<i.length-1;d++){const{valueMax:h,valueMin:w,valueNow:f}=tn({layout:s,panelsArray:i,pivotIndices:[d,d+1]}),c=o[d];if(c!=null){const z=i[d];N(z,`No panel data found for index "${d}"`),c.setAttribute("aria-controls",z.id),c.setAttribute("aria-valuemax",""+Math.round(h)),c.setAttribute("aria-valuemin",""+Math.round(w)),c.setAttribute("aria-valuenow",f!=null?""+Math.round(f):"")}}return()=>{o.forEach((d,h)=>{d.removeAttribute("aria-controls"),d.removeAttribute("aria-valuemax"),d.removeAttribute("aria-valuemin"),d.removeAttribute("aria-valuenow")})}},[n,s,i,l]),m.useEffect(()=>{if(!l)return;const o=a.current;N(o,"Eager values not found");const{panelDataArray:d}=o,h=wa(n,l);N(h!=null,`No group found for id "${n}"`);const w=Me(n,l);N(w,`No resize handles found for group id "${n}"`);const f=w.map(c=>{const z=c.getAttribute(M.resizeHandleId);N(z,"Resize handle element has no handle id attribute");const[b,C]=nn(n,z,d,l);if(b==null||C==null)return()=>{};const R=j=>{if(!j.defaultPrevented)switch(j.key){case"Enter":{j.preventDefault();const k=d.findIndex(A=>A.id===b);if(k>=0){const A=d[k];N(A,`No panel data found for index ${k}`);const G=s[k],{collapsedSize:X=0,collapsible:I,minSize:S=0}=A.constraints;if(G!=null&&I){const U=Ie({delta:W(G,X)?S-X:X-G,initialLayout:s,panelConstraints:d.map(Z=>Z.constraints),pivotIndices:Pa(n,z,l),prevLayout:s,trigger:"keyboard"});s!==U&&r(U)}}break}}};return c.addEventListener("keydown",R),()=>{c.removeEventListener("keydown",R)}});return()=>{f.forEach(c=>c())}},[l,t,a,n,s,i,r])}function rt(t,a){if(t.length!==a.length)return!1;for(let n=0;n<t.length;n++)if(t[n]!==a[n])return!1;return!0}function Ra(t,a){const n=t==="horizontal",{x:s,y:i}=qe(a);return n?s:i}function ln(t,a,n,s,i){const l=n==="horizontal",r=Fe(a,i);N(r,`No resize handle element found for id "${a}"`);const o=r.getAttribute(M.groupId);N(o,"Resize handle element has no group id attribute");let{initialCursorPosition:d}=s;const h=Ra(n,t),w=wa(o,i);N(w,`No group element found for id "${o}"`);const f=w.getBoundingClientRect(),c=l?f.width:f.height;return(h-d)/c*100}function rn(t,a,n,s,i,l){if(va(t)){const r=n==="horizontal";let o=0;t.shiftKey?o=100:i!=null?o=i:o=10;let d=0;switch(t.key){case"ArrowDown":d=r?0:o;break;case"ArrowLeft":d=r?-o:0;break;case"ArrowRight":d=r?o:0;break;case"ArrowUp":d=r?0:-o;break;case"End":d=100;break;case"Home":d=-100;break}return d}else return s==null?0:ln(t,a,n,s,l)}function on({panelDataArray:t}){const a=Array(t.length),n=t.map(l=>l.constraints);let s=0,i=100;for(let l=0;l<t.length;l++){const r=n[l];N(r,`Panel constraints not found for index ${l}`);const{defaultSize:o}=r;o!=null&&(s++,a[l]=o,i-=o)}for(let l=0;l<t.length;l++){const r=n[l];N(r,`Panel constraints not found for index ${l}`);const{defaultSize:o}=r;if(o!=null)continue;const d=t.length-s,h=i/d;s++,a[l]=h,i-=h}return a}function oe(t,a,n){a.forEach((s,i)=>{const l=t[i];N(l,`Panel data not found for index ${i}`);const{callbacks:r,constraints:o,id:d}=l,{collapsedSize:h=0,collapsible:w}=o,f=n[d];if(f==null||s!==f){n[d]=s;const{onCollapse:c,onExpand:z,onResize:b}=r;b&&b(s,f),w&&(c||z)&&(z&&(f==null||ee(f,h))&&!ee(s,h)&&z(),c&&(f==null||!ee(f,h))&&ee(s,h)&&c())}})}function De(t,a){if(t.length!==a.length)return!1;for(let n=0;n<t.length;n++)if(t[n]!=a[n])return!1;return!0}function dn({defaultSize:t,dragState:a,layout:n,panelData:s,panelIndex:i,precision:l=3}){const r=n[i];let o;return r==null?o=t!=null?t.toFixed(l):"1":s.length===1?o="1":o=r.toFixed(l),{flexBasis:0,flexGrow:o,flexShrink:1,overflow:"hidden",pointerEvents:a!==null?"none":void 0}}function cn(t,a=10){let n=null;return(...i)=>{n!==null&&clearTimeout(n),n=setTimeout(()=>{t(...i)},a)}}function ot(t){try{if(typeof localStorage<"u")t.getItem=a=>localStorage.getItem(a),t.setItem=(a,n)=>{localStorage.setItem(a,n)};else throw new Error("localStorage not supported in this environment")}catch(a){console.error(a),t.getItem=()=>null,t.setItem=()=>{}}}function Ca(t){return`react-resizable-panels:${t}`}function Ea(t){return t.map(a=>{const{constraints:n,id:s,idIsFromProps:i,order:l}=a;return i?s:l?`${l}:${JSON.stringify(n)}`:JSON.stringify(n)}).sort((a,n)=>a.localeCompare(n)).join(",")}function Ia(t,a){try{const n=Ca(t),s=a.getItem(n);if(s){const i=JSON.parse(s);if(typeof i=="object"&&i!=null)return i}}catch{}return null}function un(t,a,n){var s,i;const l=(s=Ia(t,n))!==null&&s!==void 0?s:{},r=Ea(a);return(i=l[r])!==null&&i!==void 0?i:null}function mn(t,a,n,s,i){var l;const r=Ca(t),o=Ea(a),d=(l=Ia(t,i))!==null&&l!==void 0?l:{};d[o]={expandToSizes:Object.fromEntries(n.entries()),layout:s};try{i.setItem(r,JSON.stringify(d))}catch(h){console.error(h)}}function dt({layout:t,panelConstraints:a}){const n=[...t],s=n.reduce((l,r)=>l+r,0);if(n.length!==a.length)throw Error(`Invalid ${a.length} panel layout: ${n.map(l=>`${l}%`).join(", ")}`);if(!W(s,100)&&n.length>0)for(let l=0;l<a.length;l++){const r=n[l];N(r!=null,`No layout data found for index ${l}`);const o=100/s*r;n[l]=o}let i=0;for(let l=0;l<a.length;l++){const r=n[l];N(r!=null,`No layout data found for index ${l}`);const o=ce({panelConstraints:a,panelIndex:l,size:r});r!=o&&(i+=r-o,n[l]=o)}if(!W(i,0))for(let l=0;l<a.length;l++){const r=n[l];N(r!=null,`No layout data found for index ${l}`);const o=r+i,d=ce({panelConstraints:a,panelIndex:l,size:o});if(r!==d&&(i-=d-r,n[l]=d,W(i,0)))break}return n}const pn=100,ke={getItem:t=>(ot(ke),ke.getItem(t)),setItem:(t,a)=>{ot(ke),ke.setItem(t,a)}},ct={};function ka({autoSaveId:t=null,children:a,className:n="",direction:s,forwardedRef:i,id:l=null,onLayout:r=null,keyboardResizeBy:o=null,storage:d=ke,style:h,tagName:w="div",...f}){const c=Ze(l),z=m.useRef(null),[b,C]=m.useState(null),[R,j]=m.useState([]),k=Za(),A=m.useRef({}),G=m.useRef(new Map),X=m.useRef(0),I=m.useRef({autoSaveId:t,direction:s,dragState:b,id:c,keyboardResizeBy:o,onLayout:r,storage:d}),S=m.useRef({layout:R,panelDataArray:[],panelDataArrayChanged:!1});m.useRef({didLogIdAndOrderWarning:!1,didLogPanelConstraintsWarning:!1,prevPanelIds:[]}),m.useImperativeHandle(i,()=>({getId:()=>I.current.id,getLayout:()=>{const{layout:u}=S.current;return u},setLayout:u=>{const{onLayout:x}=I.current,{layout:y,panelDataArray:v}=S.current,p=dt({layout:u,panelConstraints:v.map(g=>g.constraints)});rt(y,p)||(j(p),S.current.layout=p,x&&x(p),oe(v,p,A.current))}}),[]),le(()=>{I.current.autoSaveId=t,I.current.direction=s,I.current.dragState=b,I.current.id=c,I.current.onLayout=r,I.current.storage=d}),sn({committedValuesRef:I,eagerValuesRef:S,groupId:c,layout:R,panelDataArray:S.current.panelDataArray,setLayout:j,panelGroupElement:z.current}),m.useEffect(()=>{const{panelDataArray:u}=S.current;if(t){if(R.length===0||R.length!==u.length)return;let x=ct[t];x==null&&(x=cn(mn,pn),ct[t]=x);const y=[...u],v=new Map(G.current);x(t,y,v,R,d)}},[t,R,d]),m.useEffect(()=>{});const U=m.useCallback(u=>{const{onLayout:x}=I.current,{layout:y,panelDataArray:v}=S.current;if(u.constraints.collapsible){const p=v.map(Y=>Y.constraints),{collapsedSize:g=0,panelSize:E,pivotIndices:D}=se(v,u,y);if(N(E!=null,`Panel size not found for panel "${u.id}"`),!ee(E,g)){G.current.set(u.id,E);const Q=de(v,u)===v.length-1?E-g:g-E,H=Ie({delta:Q,initialLayout:y,panelConstraints:p,pivotIndices:D,prevLayout:y,trigger:"imperative-api"});De(y,H)||(j(H),S.current.layout=H,x&&x(H),oe(v,H,A.current))}}},[]),Z=m.useCallback((u,x)=>{const{onLayout:y}=I.current,{layout:v,panelDataArray:p}=S.current;if(u.constraints.collapsible){const g=p.map(J=>J.constraints),{collapsedSize:E=0,panelSize:D=0,minSize:Y=0,pivotIndices:Q}=se(p,u,v),H=x??Y;if(ee(D,E)){const J=G.current.get(u.id),he=J!=null&&J>=H?J:H,Oe=de(p,u)===p.length-1?D-he:he-D,F=Ie({delta:Oe,initialLayout:v,panelConstraints:g,pivotIndices:Q,prevLayout:v,trigger:"imperative-api"});De(v,F)||(j(F),S.current.layout=F,y&&y(F),oe(p,F,A.current))}}},[]),O=m.useCallback(u=>{const{layout:x,panelDataArray:y}=S.current,{panelSize:v}=se(y,u,x);return N(v!=null,`Panel size not found for panel "${u.id}"`),v},[]),B=m.useCallback((u,x)=>{const{panelDataArray:y}=S.current,v=de(y,u);return dn({defaultSize:x,dragState:b,layout:R,panelData:y,panelIndex:v})},[b,R]),L=m.useCallback(u=>{const{layout:x,panelDataArray:y}=S.current,{collapsedSize:v=0,collapsible:p,panelSize:g}=se(y,u,x);return N(g!=null,`Panel size not found for panel "${u.id}"`),p===!0&&ee(g,v)},[]),ne=m.useCallback(u=>{const{layout:x,panelDataArray:y}=S.current,{collapsedSize:v=0,collapsible:p,panelSize:g}=se(y,u,x);return N(g!=null,`Panel size not found for panel "${u.id}"`),!p||ie(g,v)>0},[]),q=m.useCallback(u=>{const{panelDataArray:x}=S.current;x.push(u),x.sort((y,v)=>{const p=y.order,g=v.order;return p==null&&g==null?0:p==null?-1:g==null?1:p-g}),S.current.panelDataArrayChanged=!0,k()},[k]);le(()=>{if(S.current.panelDataArrayChanged){S.current.panelDataArrayChanged=!1;const{autoSaveId:u,onLayout:x,storage:y}=I.current,{layout:v,panelDataArray:p}=S.current;let g=null;if(u){const D=un(u,p,y);D&&(G.current=new Map(Object.entries(D.expandToSizes)),g=D.layout)}g==null&&(g=on({panelDataArray:p}));const E=dt({layout:g,panelConstraints:p.map(D=>D.constraints)});rt(v,E)||(j(E),S.current.layout=E,x&&x(E),oe(p,E,A.current))}}),le(()=>{const u=S.current;return()=>{u.layout=[]}},[]);const $=m.useCallback(u=>{let x=!1;const y=z.current;return y&&window.getComputedStyle(y,null).getPropertyValue("direction")==="rtl"&&(x=!0),function(p){p.preventDefault();const g=z.current;if(!g)return()=>null;const{direction:E,dragState:D,id:Y,keyboardResizeBy:Q,onLayout:H}=I.current,{layout:J,panelDataArray:he}=S.current,{initialLayout:Ae}=D??{},Oe=Pa(Y,u,g);let F=rn(p,u,E,D,Q,g);const tt=E==="horizontal";tt&&x&&(F=-F);const La=he.map(Aa=>Aa.constraints),be=Ie({delta:F,initialLayout:Ae??J,panelConstraints:La,pivotIndices:Oe,prevLayout:J,trigger:va(p)?"keyboard":"mouse-or-touch"}),at=!De(J,be);(xa(p)||ha(p))&&X.current!=F&&(X.current=F,!at&&F!==0?tt?Ke(u,F<0?ga:Na):Ke(u,F<0?za:ya):Ke(u,0)),at&&(j(be),S.current.layout=be,H&&H(be),oe(he,be,A.current))}},[]),T=m.useCallback((u,x)=>{const{onLayout:y}=I.current,{layout:v,panelDataArray:p}=S.current,g=p.map(J=>J.constraints),{panelSize:E,pivotIndices:D}=se(p,u,v);N(E!=null,`Panel size not found for panel "${u.id}"`);const Q=de(p,u)===p.length-1?E-x:x-E,H=Ie({delta:Q,initialLayout:v,panelConstraints:g,pivotIndices:D,prevLayout:v,trigger:"imperative-api"});De(v,H)||(j(H),S.current.layout=H,y&&y(H),oe(p,H,A.current))},[]),pe=m.useCallback((u,x)=>{const{layout:y,panelDataArray:v}=S.current,{collapsedSize:p=0,collapsible:g}=x,{collapsedSize:E=0,collapsible:D,maxSize:Y=100,minSize:Q=0}=u.constraints,{panelSize:H}=se(v,u,y);H!=null&&(g&&D&&ee(H,p)?ee(p,E)||T(u,E):H<Q?T(u,Q):H>Y&&T(u,Y))},[T]),fe=m.useCallback((u,x)=>{const{direction:y}=I.current,{layout:v}=S.current;if(!z.current)return;const p=Fe(u,z.current);N(p,`Drag handle element not found for id "${u}"`);const g=Ra(y,x);C({dragHandleId:u,dragHandleRect:p.getBoundingClientRect(),initialCursorPosition:g,initialLayout:v})},[]),ve=m.useCallback(()=>{C(null)},[]),Le=m.useCallback(u=>{const{panelDataArray:x}=S.current,y=de(x,u);y>=0&&(x.splice(y,1),delete A.current[u.id],S.current.panelDataArrayChanged=!0,k())},[k]),re=m.useMemo(()=>({collapsePanel:U,direction:s,dragState:b,expandPanel:Z,getPanelSize:O,getPanelStyle:B,groupId:c,isPanelCollapsed:L,isPanelExpanded:ne,reevaluatePanelConstraints:pe,registerPanel:q,registerResizeHandle:$,resizePanel:T,startDragging:fe,stopDragging:ve,unregisterPanel:Le,panelGroupElement:z.current}),[U,b,s,Z,O,B,c,L,ne,pe,q,$,T,fe,ve,Le]),xe={display:"flex",flexDirection:s==="horizontal"?"row":"column",height:"100%",overflow:"hidden",width:"100%"};return m.createElement(Ve.Provider,{value:re},m.createElement(w,{...f,children:a,className:n,id:l,ref:z,style:{...xe,...h},[M.group]:"",[M.groupDirection]:s,[M.groupId]:c}))}const Ha=m.forwardRef((t,a)=>m.createElement(ka,{...t,forwardedRef:a}));ka.displayName="PanelGroup";Ha.displayName="forwardRef(PanelGroup)";function de(t,a){return t.findIndex(n=>n===a||n.id===a.id)}function se(t,a,n){const s=de(t,a),l=s===t.length-1?[s-1,s]:[s,s+1],r=n[s];return{...a.constraints,panelSize:r,pivotIndices:l}}function fn({disabled:t,handleId:a,resizeHandler:n,panelGroupElement:s}){m.useEffect(()=>{if(t||n==null||s==null)return;const i=Fe(a,s);if(i==null)return;const l=r=>{if(!r.defaultPrevented)switch(r.key){case"ArrowDown":case"ArrowLeft":case"ArrowRight":case"ArrowUp":case"End":case"Home":{r.preventDefault(),n(r);break}case"F6":{r.preventDefault();const o=i.getAttribute(M.groupId);N(o,`No group element found for id "${o}"`);const d=Me(o,s),h=Sa(o,a,s);N(h!==null,`No resize element found for id "${a}"`);const w=r.shiftKey?h>0?h-1:d.length-1:h+1<d.length?h+1:0;d[w].focus();break}}};return i.addEventListener("keydown",l),()=>{i.removeEventListener("keydown",l)}},[s,t,a,n])}function Ma({children:t=null,className:a="",disabled:n=!1,hitAreaMargins:s,id:i,onBlur:l,onClick:r,onDragging:o,onFocus:d,onPointerDown:h,onPointerUp:w,style:f={},tabIndex:c=0,tagName:z="div",...b}){var C,R;const j=m.useRef(null),k=m.useRef({onClick:r,onDragging:o,onPointerDown:h,onPointerUp:w});m.useEffect(()=>{k.current.onClick=r,k.current.onDragging=o,k.current.onPointerDown=h,k.current.onPointerUp=w});const A=m.useContext(Ve);if(A===null)throw Error("PanelResizeHandle components must be rendered within a PanelGroup container");const{direction:G,groupId:X,registerResizeHandle:I,startDragging:S,stopDragging:U,panelGroupElement:Z}=A,O=Ze(i),[B,L]=m.useState("inactive"),[ne,q]=m.useState(!1),[$,T]=m.useState(null),pe=m.useRef({state:B});le(()=>{pe.current.state=B}),m.useEffect(()=>{if(n)T(null);else{const re=I(O);T(()=>re)}},[n,O,I]);const fe=(C=s==null?void 0:s.coarse)!==null&&C!==void 0?C:15,ve=(R=s==null?void 0:s.fine)!==null&&R!==void 0?R:5;m.useEffect(()=>{if(n||$==null)return;const re=j.current;N(re,"Element ref not attached");let xe=!1;return Ya(O,re,G,{coarse:fe,fine:ve},(x,y,v)=>{if(!y){L("inactive");return}switch(x){case"down":{L("drag"),xe=!1,N(v,'Expected event to be defined for "down" action'),S(O,v);const{onDragging:p,onPointerDown:g}=k.current;p==null||p(!0),g==null||g();break}case"move":{const{state:p}=pe.current;xe=!0,p!=="drag"&&L("hover"),N(v,'Expected event to be defined for "move" action'),$(v);break}case"up":{L("hover"),U();const{onClick:p,onDragging:g,onPointerUp:E}=k.current;g==null||g(!1),E==null||E(),xe||p==null||p();break}}})},[fe,G,n,ve,I,O,$,S,U]),fn({disabled:n,handleId:O,resizeHandler:$,panelGroupElement:Z});const Le={touchAction:"none",userSelect:"none"};return m.createElement(z,{...b,children:t,className:a,id:i,onBlur:()=>{q(!1),l==null||l()},onFocus:()=>{q(!0),d==null||d()},ref:j,role:"separator",style:{...Le,...f},tabIndex:c,[M.groupDirection]:G,[M.groupId]:X,[M.resizeHandle]:"",[M.resizeHandleActive]:B==="drag"?"pointer":ne?"keyboard":void 0,[M.resizeHandleEnabled]:!n,[M.resizeHandleId]:O,[M.resizeHandleState]:B})}Ma.displayName="PanelResizeHandle";const V=({className:t,...a})=>e.jsx(Ha,{className:ma("flex h-full w-full data-[panel-group-direction=vertical]:flex-col",t),...a}),P=fa,_=({withHandle:t,className:a,...n})=>e.jsx(Ma,{className:ma("relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",a),...n,children:t&&e.jsx("div",{className:"z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border",children:e.jsx($a,{className:"h-2.5 w-2.5"})})});try{V.displayName="ResizablePanelGroup",V.__docgenInfo={description:"",displayName:"ResizablePanelGroup",props:{autoSaveId:{defaultValue:null,description:"",name:"autoSaveId",required:!1,type:{name:"string | null"}},direction:{defaultValue:null,description:"",name:"direction",required:!0,type:{name:"enum",value:[{value:'"horizontal"'},{value:'"vertical"'}]}},id:{defaultValue:null,description:"",name:"id",required:!1,type:{name:"string | null"}},keyboardResizeBy:{defaultValue:null,description:"",name:"keyboardResizeBy",required:!1,type:{name:"number | null"}},onLayout:{defaultValue:null,description:"",name:"onLayout",required:!1,type:{name:"PanelGroupOnLayout | null"}},storage:{defaultValue:null,description:"",name:"storage",required:!1,type:{name:"PanelGroupStorage"}},tagName:{defaultValue:null,description:"",name:"tagName",required:!1,type:{name:"enum",value:[{value:'"object"'},{value:'"a"'},{value:'"button"'},{value:'"div"'},{value:'"form"'},{value:'"h2"'},{value:'"h3"'},{value:'"img"'},{value:'"input"'},{value:'"label"'},{value:'"li"'},{value:'"nav"'},{value:'"ol"'},{value:'"p"'},{value:'"select"'},{value:'"span"'},{value:'"ul"'},{value:'"abbr"'},{value:'"address"'},{value:'"area"'},{value:'"article"'},{value:'"aside"'},{value:'"audio"'},{value:'"b"'},{value:'"base"'},{value:'"bdi"'},{value:'"bdo"'},{value:'"blockquote"'},{value:'"body"'},{value:'"br"'},{value:'"canvas"'},{value:'"caption"'},{value:'"cite"'},{value:'"code"'},{value:'"col"'},{value:'"colgroup"'},{value:'"data"'},{value:'"datalist"'},{value:'"dd"'},{value:'"del"'},{value:'"details"'},{value:'"dfn"'},{value:'"dialog"'},{value:'"dl"'},{value:'"dt"'},{value:'"em"'},{value:'"embed"'},{value:'"fieldset"'},{value:'"figcaption"'},{value:'"figure"'},{value:'"footer"'},{value:'"h1"'},{value:'"h4"'},{value:'"h5"'},{value:'"h6"'},{value:'"head"'},{value:'"header"'},{value:'"hgroup"'},{value:'"hr"'},{value:'"html"'},{value:'"i"'},{value:'"iframe"'},{value:'"ins"'},{value:'"kbd"'},{value:'"legend"'},{value:'"link"'},{value:'"main"'},{value:'"map"'},{value:'"mark"'},{value:'"menu"'},{value:'"meta"'},{value:'"meter"'},{value:'"noscript"'},{value:'"optgroup"'},{value:'"option"'},{value:'"output"'},{value:'"picture"'},{value:'"pre"'},{value:'"progress"'},{value:'"q"'},{value:'"rp"'},{value:'"rt"'},{value:'"ruby"'},{value:'"s"'},{value:'"samp"'},{value:'"search"'},{value:'"slot"'},{value:'"script"'},{value:'"section"'},{value:'"small"'},{value:'"source"'},{value:'"strong"'},{value:'"style"'},{value:'"sub"'},{value:'"summary"'},{value:'"sup"'},{value:'"table"'},{value:'"template"'},{value:'"tbody"'},{value:'"td"'},{value:'"textarea"'},{value:'"tfoot"'},{value:'"th"'},{value:'"thead"'},{value:'"time"'},{value:'"title"'},{value:'"tr"'},{value:'"track"'},{value:'"u"'},{value:'"var"'},{value:'"video"'},{value:'"wbr"'}]}}}}}catch{}try{P.displayName="ResizablePanel",P.__docgenInfo={description:"",displayName:"ResizablePanel",props:{collapsedSize:{defaultValue:null,description:"",name:"collapsedSize",required:!1,type:{name:"number"}},collapsible:{defaultValue:null,description:"",name:"collapsible",required:!1,type:{name:"boolean"}},defaultSize:{defaultValue:null,description:"",name:"defaultSize",required:!1,type:{name:"number"}},id:{defaultValue:null,description:"",name:"id",required:!1,type:{name:"string"}},maxSize:{defaultValue:null,description:"",name:"maxSize",required:!1,type:{name:"number"}},minSize:{defaultValue:null,description:"",name:"minSize",required:!1,type:{name:"number"}},onCollapse:{defaultValue:null,description:"",name:"onCollapse",required:!1,type:{name:"PanelOnCollapse"}},onExpand:{defaultValue:null,description:"",name:"onExpand",required:!1,type:{name:"PanelOnExpand"}},onResize:{defaultValue:null,description:"",name:"onResize",required:!1,type:{name:"PanelOnResize"}},order:{defaultValue:null,description:"",name:"order",required:!1,type:{name:"number"}},tagName:{defaultValue:null,description:"",name:"tagName",required:!1,type:{name:"enum",value:[{value:'"object"'},{value:'"a"'},{value:'"button"'},{value:'"div"'},{value:'"form"'},{value:'"h2"'},{value:'"h3"'},{value:'"img"'},{value:'"input"'},{value:'"label"'},{value:'"li"'},{value:'"nav"'},{value:'"ol"'},{value:'"p"'},{value:'"select"'},{value:'"span"'},{value:'"ul"'},{value:'"abbr"'},{value:'"address"'},{value:'"area"'},{value:'"article"'},{value:'"aside"'},{value:'"audio"'},{value:'"b"'},{value:'"base"'},{value:'"bdi"'},{value:'"bdo"'},{value:'"blockquote"'},{value:'"body"'},{value:'"br"'},{value:'"canvas"'},{value:'"caption"'},{value:'"cite"'},{value:'"code"'},{value:'"col"'},{value:'"colgroup"'},{value:'"data"'},{value:'"datalist"'},{value:'"dd"'},{value:'"del"'},{value:'"details"'},{value:'"dfn"'},{value:'"dialog"'},{value:'"dl"'},{value:'"dt"'},{value:'"em"'},{value:'"embed"'},{value:'"fieldset"'},{value:'"figcaption"'},{value:'"figure"'},{value:'"footer"'},{value:'"h1"'},{value:'"h4"'},{value:'"h5"'},{value:'"h6"'},{value:'"head"'},{value:'"header"'},{value:'"hgroup"'},{value:'"hr"'},{value:'"html"'},{value:'"i"'},{value:'"iframe"'},{value:'"ins"'},{value:'"kbd"'},{value:'"legend"'},{value:'"link"'},{value:'"main"'},{value:'"map"'},{value:'"mark"'},{value:'"menu"'},{value:'"meta"'},{value:'"meter"'},{value:'"noscript"'},{value:'"optgroup"'},{value:'"option"'},{value:'"output"'},{value:'"picture"'},{value:'"pre"'},{value:'"progress"'},{value:'"q"'},{value:'"rp"'},{value:'"rt"'},{value:'"ruby"'},{value:'"s"'},{value:'"samp"'},{value:'"search"'},{value:'"slot"'},{value:'"script"'},{value:'"section"'},{value:'"small"'},{value:'"source"'},{value:'"strong"'},{value:'"style"'},{value:'"sub"'},{value:'"summary"'},{value:'"sup"'},{value:'"table"'},{value:'"template"'},{value:'"tbody"'},{value:'"td"'},{value:'"textarea"'},{value:'"tfoot"'},{value:'"th"'},{value:'"thead"'},{value:'"time"'},{value:'"title"'},{value:'"tr"'},{value:'"track"'},{value:'"u"'},{value:'"var"'},{value:'"video"'},{value:'"wbr"'}]}}}}}catch{}try{_.displayName="ResizableHandle",_.__docgenInfo={description:"",displayName:"ResizableHandle",props:{disabled:{defaultValue:null,description:"",name:"disabled",required:!1,type:{name:"boolean"}},hitAreaMargins:{defaultValue:null,description:"",name:"hitAreaMargins",required:!1,type:{name:"PointerHitAreaMargins"}},id:{defaultValue:null,description:"",name:"id",required:!1,type:{name:"string | null"}},onBlur:{defaultValue:null,description:"",name:"onBlur",required:!1,type:{name:"(() => void)"}},onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"(() => void)"}},onDragging:{defaultValue:null,description:"",name:"onDragging",required:!1,type:{name:"PanelResizeHandleOnDragging"}},onFocus:{defaultValue:null,description:"",name:"onFocus",required:!1,type:{name:"(() => void)"}},onPointerDown:{defaultValue:null,description:"",name:"onPointerDown",required:!1,type:{name:"(() => void)"}},onPointerUp:{defaultValue:null,description:"",name:"onPointerUp",required:!1,type:{name:"(() => void)"}},tagName:{defaultValue:null,description:"",name:"tagName",required:!1,type:{name:"enum",value:[{value:'"object"'},{value:'"a"'},{value:'"button"'},{value:'"div"'},{value:'"form"'},{value:'"h2"'},{value:'"h3"'},{value:'"img"'},{value:'"input"'},{value:'"label"'},{value:'"li"'},{value:'"nav"'},{value:'"ol"'},{value:'"p"'},{value:'"select"'},{value:'"span"'},{value:'"ul"'},{value:'"abbr"'},{value:'"address"'},{value:'"area"'},{value:'"article"'},{value:'"aside"'},{value:'"audio"'},{value:'"b"'},{value:'"base"'},{value:'"bdi"'},{value:'"bdo"'},{value:'"blockquote"'},{value:'"body"'},{value:'"br"'},{value:'"canvas"'},{value:'"caption"'},{value:'"cite"'},{value:'"code"'},{value:'"col"'},{value:'"colgroup"'},{value:'"data"'},{value:'"datalist"'},{value:'"dd"'},{value:'"del"'},{value:'"details"'},{value:'"dfn"'},{value:'"dialog"'},{value:'"dl"'},{value:'"dt"'},{value:'"em"'},{value:'"embed"'},{value:'"fieldset"'},{value:'"figcaption"'},{value:'"figure"'},{value:'"footer"'},{value:'"h1"'},{value:'"h4"'},{value:'"h5"'},{value:'"h6"'},{value:'"head"'},{value:'"header"'},{value:'"hgroup"'},{value:'"hr"'},{value:'"html"'},{value:'"i"'},{value:'"iframe"'},{value:'"ins"'},{value:'"kbd"'},{value:'"legend"'},{value:'"link"'},{value:'"main"'},{value:'"map"'},{value:'"mark"'},{value:'"menu"'},{value:'"meta"'},{value:'"meter"'},{value:'"noscript"'},{value:'"optgroup"'},{value:'"option"'},{value:'"output"'},{value:'"picture"'},{value:'"pre"'},{value:'"progress"'},{value:'"q"'},{value:'"rp"'},{value:'"rt"'},{value:'"ruby"'},{value:'"s"'},{value:'"samp"'},{value:'"search"'},{value:'"slot"'},{value:'"script"'},{value:'"section"'},{value:'"small"'},{value:'"source"'},{value:'"strong"'},{value:'"style"'},{value:'"sub"'},{value:'"summary"'},{value:'"sup"'},{value:'"table"'},{value:'"template"'},{value:'"tbody"'},{value:'"td"'},{value:'"textarea"'},{value:'"tfoot"'},{value:'"th"'},{value:'"thead"'},{value:'"time"'},{value:'"title"'},{value:'"tr"'},{value:'"track"'},{value:'"u"'},{value:'"var"'},{value:'"video"'},{value:'"wbr"'}]}},withHandle:{defaultValue:null,description:"",name:"withHandle",required:!1,type:{name:"boolean"}}}}}catch{}const Sn={title:"Tier 1: Primitives/shadcn/Resizable",component:V,parameters:{layout:"fullscreen",docs:{description:{component:"Accessible and composable resizable panel groups built on react-resizable-panels. Create split views and complex layouts with drag-to-resize functionality."}}},tags:["autodocs"]},ge={render:()=>e.jsx("div",{className:"h-[600px] w-full",children:e.jsxs(V,{direction:"horizontal",className:"rounded-lg border",children:[e.jsx(P,{defaultSize:50,minSize:30,children:e.jsx("div",{className:"flex h-full items-center justify-center p-6",children:e.jsxs("div",{className:"text-center space-y-2",children:[e.jsx("h3",{className:"text-xl font-semibold",children:"Left Panel"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Drag the handle to resize"})]})})}),e.jsx(_,{withHandle:!0}),e.jsx(P,{defaultSize:50,minSize:30,children:e.jsx("div",{className:"flex h-full items-center justify-center p-6",children:e.jsxs("div",{className:"text-center space-y-2",children:[e.jsx("h3",{className:"text-xl font-semibold",children:"Right Panel"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Minimum size: 30%"})]})})})]})})},Ne={render:()=>e.jsx("div",{className:"h-[600px] w-full",children:e.jsxs(V,{direction:"vertical",className:"rounded-lg border",children:[e.jsx(P,{defaultSize:60,minSize:30,children:e.jsx("div",{className:"flex h-full items-center justify-center p-6",children:e.jsxs("div",{className:"text-center space-y-2",children:[e.jsx("h3",{className:"text-xl font-semibold",children:"Top Panel"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Main content area (60% default)"})]})})}),e.jsx(_,{withHandle:!0}),e.jsx(P,{defaultSize:40,minSize:20,children:e.jsx("div",{className:"flex h-full items-center justify-center p-6",children:e.jsxs("div",{className:"text-center space-y-2",children:[e.jsx("h3",{className:"text-xl font-semibold",children:"Bottom Panel"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Secondary content (40% default, 20% minimum)"})]})})})]})})},ze={render:()=>e.jsx("div",{className:"h-[600px] w-full",children:e.jsxs(V,{direction:"horizontal",className:"rounded-lg border",children:[e.jsx(P,{defaultSize:20,minSize:15,maxSize:30,children:e.jsxs("div",{className:"flex h-full flex-col gap-2 p-4",children:[e.jsx("h3",{className:"font-semibold",children:"Left Sidebar"}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("div",{className:"rounded-md bg-muted p-2 text-sm",children:"Navigation"}),e.jsx("div",{className:"rounded-md bg-muted p-2 text-sm",children:"Files"}),e.jsx("div",{className:"rounded-md bg-muted p-2 text-sm",children:"Search"}),e.jsx("div",{className:"rounded-md bg-muted p-2 text-sm",children:"Settings"})]})]})}),e.jsx(_,{}),e.jsx(P,{defaultSize:60,minSize:40,children:e.jsx("div",{className:"flex h-full items-center justify-center p-6",children:e.jsxs("div",{className:"text-center space-y-2",children:[e.jsx("h3",{className:"text-2xl font-semibold",children:"Main Content"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Primary workspace area with 60% default width"}),e.jsx("p",{className:"text-xs text-muted-foreground mt-4",children:"Min: 40%, Max: unlimited"})]})})}),e.jsx(_,{}),e.jsx(P,{defaultSize:20,minSize:15,maxSize:30,children:e.jsxs("div",{className:"flex h-full flex-col gap-2 p-4",children:[e.jsx("h3",{className:"font-semibold",children:"Right Sidebar"}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("div",{className:"rounded-md bg-muted p-2 text-sm",children:"Properties"}),e.jsx("div",{className:"rounded-md bg-muted p-2 text-sm",children:"Inspector"}),e.jsx("div",{className:"rounded-md bg-muted p-2 text-sm",children:"History"}),e.jsx("div",{className:"rounded-md bg-muted p-2 text-sm",children:"Debug"})]})]})})]})})},ye={render:()=>e.jsx("div",{className:"h-[600px] w-full",children:e.jsxs(V,{direction:"horizontal",className:"rounded-lg border",children:[e.jsx(P,{defaultSize:25,minSize:20,children:e.jsxs("div",{className:"flex h-full flex-col p-4",children:[e.jsx("h3",{className:"font-semibold mb-2",children:"Sidebar"}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("div",{className:"rounded-md bg-muted p-2 text-sm",children:"Explorer"}),e.jsx("div",{className:"rounded-md bg-muted p-2 text-sm",children:"Search"}),e.jsx("div",{className:"rounded-md bg-muted p-2 text-sm",children:"Git"}),e.jsx("div",{className:"rounded-md bg-muted p-2 text-sm",children:"Extensions"})]})]})}),e.jsx(_,{withHandle:!0}),e.jsx(P,{defaultSize:75,children:e.jsxs(V,{direction:"vertical",children:[e.jsx(P,{defaultSize:70,minSize:50,children:e.jsx("div",{className:"flex h-full items-center justify-center p-6",children:e.jsxs("div",{className:"text-center space-y-2",children:[e.jsx("h3",{className:"text-xl font-semibold",children:"Editor"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Main code editing area"})]})})}),e.jsx(_,{withHandle:!0}),e.jsx(P,{defaultSize:30,minSize:20,children:e.jsx("div",{className:"flex h-full items-center justify-center p-6",children:e.jsxs("div",{className:"text-center space-y-2",children:[e.jsx("h3",{className:"text-xl font-semibold",children:"Terminal"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Integrated terminal output"})]})})})]})})]})})},je={render:()=>e.jsx("div",{className:"h-[700px] w-full bg-[#1e1e1e]",children:e.jsxs(V,{direction:"horizontal",children:[e.jsx(P,{defaultSize:20,minSize:15,maxSize:40,children:e.jsxs("div",{className:"h-full bg-[#252526] text-white p-4",children:[e.jsx("h3",{className:"text-sm font-semibold mb-3 text-gray-300",children:"EXPLORER"}),e.jsxs("div",{className:"space-y-1 text-sm",children:[e.jsx("div",{className:"hover:bg-[#2a2d2e] p-1 rounded cursor-pointer",children:"📁 src/"}),e.jsx("div",{className:"hover:bg-[#2a2d2e] p-1 rounded cursor-pointer pl-4",children:"📄 index.ts"}),e.jsx("div",{className:"hover:bg-[#2a2d2e] p-1 rounded cursor-pointer pl-4",children:"📄 app.tsx"}),e.jsx("div",{className:"hover:bg-[#2a2d2e] p-1 rounded cursor-pointer pl-4",children:"📄 styles.css"}),e.jsx("div",{className:"hover:bg-[#2a2d2e] p-1 rounded cursor-pointer",children:"📁 components/"}),e.jsx("div",{className:"hover:bg-[#2a2d2e] p-1 rounded cursor-pointer pl-4",children:"📄 Button.tsx"}),e.jsx("div",{className:"hover:bg-[#2a2d2e] p-1 rounded cursor-pointer",children:"📄 package.json"}),e.jsx("div",{className:"hover:bg-[#2a2d2e] p-1 rounded cursor-pointer",children:"📄 tsconfig.json"})]})]})}),e.jsx(_,{}),e.jsx(P,{defaultSize:80,children:e.jsxs(V,{direction:"vertical",children:[e.jsx(P,{defaultSize:75,minSize:40,children:e.jsxs("div",{className:"h-full bg-[#1e1e1e] text-white",children:[e.jsxs("div",{className:"bg-[#2d2d30] px-4 py-2 text-sm border-b border-[#3e3e42]",children:[e.jsx("span",{className:"text-gray-300",children:"src/app.tsx"}),e.jsx("span",{className:"ml-2 text-gray-500",children:"●"})]}),e.jsxs("div",{className:"p-4 font-mono text-sm space-y-1",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-[#569cd6]",children:"import"})," ",e.jsx("span",{className:"text-[#ce9178]",children:"React"})," ",e.jsx("span",{className:"text-[#569cd6]",children:"from"})," ",e.jsx("span",{className:"text-[#ce9178]",children:"'react'"}),";"]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-[#569cd6]",children:"import"})," ","{"," ",e.jsx("span",{className:"text-[#9cdcfe]",children:"Button"})," ","}"," ",e.jsx("span",{className:"text-[#569cd6]",children:"from"})," ",e.jsx("span",{className:"text-[#ce9178]",children:"'./components'"}),";"]}),e.jsx("div",{className:"mt-2"}),e.jsxs("div",{children:[e.jsx("span",{className:"text-[#569cd6]",children:"export"})," ",e.jsx("span",{className:"text-[#569cd6]",children:"const"})," ",e.jsx("span",{className:"text-[#4fc1ff]",children:"App"})," = () => ","{"]}),e.jsxs("div",{className:"pl-4",children:[e.jsx("span",{className:"text-[#c586c0]",children:"return"})," ("]}),e.jsxs("div",{className:"pl-8",children:["<",e.jsx("span",{className:"text-[#4ec9b0]",children:"div"}),">"]}),e.jsxs("div",{className:"pl-12",children:["<",e.jsx("span",{className:"text-[#4ec9b0]",children:"Button"}),">Click me</",e.jsx("span",{className:"text-[#4ec9b0]",children:"Button"}),">"]}),e.jsxs("div",{className:"pl-8",children:["</",e.jsx("span",{className:"text-[#4ec9b0]",children:"div"}),">"]}),e.jsx("div",{className:"pl-4",children:");"}),e.jsxs("div",{children:["}",";"]})]})]})}),e.jsx(_,{withHandle:!0}),e.jsx(P,{defaultSize:25,minSize:15,children:e.jsxs("div",{className:"h-full bg-[#1e1e1e] text-white",children:[e.jsx("div",{className:"bg-[#2d2d30] px-4 py-2 text-sm border-b border-[#3e3e42]",children:e.jsx("span",{className:"text-gray-300",children:"TERMINAL"})}),e.jsxs("div",{className:"p-4 font-mono text-xs space-y-1",children:[e.jsx("div",{className:"text-gray-400",children:"$ npm run dev"}),e.jsx("div",{className:"text-green-400",children:"✓ Development server started"}),e.jsx("div",{className:"text-gray-400",children:"Local: http://localhost:3000"}),e.jsx("div",{className:"text-gray-400",children:"Ready in 1.2s"})]})]})})]})})]})})},Se={render:()=>e.jsx("div",{className:"h-[700px] w-full",children:e.jsxs("div",{className:"h-full flex flex-col",children:[e.jsx("div",{className:"bg-gradient-to-r from-[#0ec2bc]/90 to-[#0ec2bc]/70 text-white px-6 py-4",children:e.jsx("h2",{className:"text-xl font-bold",children:"Analytics Dashboard"})}),e.jsx("div",{className:"flex-1 min-h-0",children:e.jsxs(V,{direction:"horizontal",children:[e.jsx(P,{defaultSize:20,minSize:15,maxSize:30,children:e.jsxs("div",{className:"h-full border-r p-4 space-y-2",children:[e.jsx("h3",{className:"font-semibold mb-4",children:"Navigation"}),e.jsx("button",{className:"w-full text-left px-3 py-2 rounded-md bg-[#0ec2bc]/10 text-[#0ec2bc] font-medium",children:"Overview"}),e.jsx("button",{className:"w-full text-left px-3 py-2 rounded-md hover:bg-muted",children:"Analytics"}),e.jsx("button",{className:"w-full text-left px-3 py-2 rounded-md hover:bg-muted",children:"Reports"}),e.jsx("button",{className:"w-full text-left px-3 py-2 rounded-md hover:bg-muted",children:"Users"}),e.jsx("button",{className:"w-full text-left px-3 py-2 rounded-md hover:bg-muted",children:"Settings"})]})}),e.jsx(_,{}),e.jsx(P,{defaultSize:80,children:e.jsxs(V,{direction:"vertical",children:[e.jsx(P,{defaultSize:70,children:e.jsxs("div",{className:"h-full p-6",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Performance Metrics"}),e.jsxs("div",{className:"grid grid-cols-3 gap-4 mb-6",children:[e.jsxs("div",{className:"border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-blue-100",children:[e.jsx("div",{className:"text-sm text-gray-600",children:"Total Users"}),e.jsx("div",{className:"text-2xl font-bold text-blue-600",children:"24,563"}),e.jsx("div",{className:"text-xs text-green-600 mt-1",children:"↑ 12.5%"})]}),e.jsxs("div",{className:"border rounded-lg p-4 bg-gradient-to-br from-green-50 to-green-100",children:[e.jsx("div",{className:"text-sm text-gray-600",children:"Revenue"}),e.jsx("div",{className:"text-2xl font-bold text-green-600",children:"$128,430"}),e.jsx("div",{className:"text-xs text-green-600 mt-1",children:"↑ 8.2%"})]}),e.jsxs("div",{className:"border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-purple-100",children:[e.jsx("div",{className:"text-sm text-gray-600",children:"Conversions"}),e.jsx("div",{className:"text-2xl font-bold text-purple-600",children:"1,247"}),e.jsx("div",{className:"text-xs text-red-600 mt-1",children:"↓ 3.1%"})]})]}),e.jsx("div",{className:"border rounded-lg p-4 h-48 flex items-center justify-center bg-muted/30",children:e.jsx("span",{className:"text-muted-foreground",children:"Chart Visualization Area"})})]})}),e.jsx(_,{withHandle:!0}),e.jsx(P,{defaultSize:30,minSize:20,children:e.jsxs("div",{className:"h-full p-6 border-t bg-muted/20",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Recent Activity"}),e.jsxs("div",{className:"space-y-3 text-sm",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{children:"New user registration"}),e.jsx("span",{className:"text-muted-foreground",children:"2 min ago"})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{children:"Payment received"}),e.jsx("span",{className:"text-muted-foreground",children:"5 min ago"})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{children:"Report generated"}),e.jsx("span",{className:"text-muted-foreground",children:"12 min ago"})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{children:"Settings updated"}),e.jsx("span",{className:"text-muted-foreground",children:"28 min ago"})]})]})]})})]})})]})})]})})},Pe={render:()=>e.jsx("div",{className:"h-[600px] w-full",children:e.jsxs(V,{direction:"horizontal",className:"rounded-lg border",children:[e.jsx(P,{defaultSize:30,minSize:20,maxSize:40,children:e.jsxs("div",{className:"flex h-full flex-col items-center justify-center p-6 text-center space-y-2",children:[e.jsx("h3",{className:"text-xl font-semibold",children:"Constrained Panel"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Min: 20% | Max: 40%"}),e.jsx("p",{className:"text-xs text-muted-foreground mt-4",children:"Cannot be resized beyond these limits"})]})}),e.jsx(_,{withHandle:!0}),e.jsx(P,{defaultSize:40,minSize:30,maxSize:60,children:e.jsxs("div",{className:"flex h-full flex-col items-center justify-center p-6 text-center space-y-2",children:[e.jsx("h3",{className:"text-xl font-semibold",children:"Middle Panel"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Min: 30% | Max: 60%"}),e.jsx("p",{className:"text-xs text-muted-foreground mt-4",children:"Flexible but with limits"})]})}),e.jsx(_,{withHandle:!0}),e.jsx(P,{defaultSize:30,minSize:20,maxSize:40,children:e.jsxs("div",{className:"flex h-full flex-col items-center justify-center p-6 text-center space-y-2",children:[e.jsx("h3",{className:"text-xl font-semibold",children:"Constrained Panel"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Min: 20% | Max: 40%"}),e.jsx("p",{className:"text-xs text-muted-foreground mt-4",children:"Same constraints as left panel"})]})})]})})},we={render:()=>{const t=()=>{const[a,n]=m.useState(!1);return e.jsxs("div",{className:"h-[600px] w-full",children:[e.jsxs("div",{className:"mb-4 flex gap-2",children:[e.jsxs(ue,{variant:"outline",size:"sm",onClick:()=>n(!a),children:[a?"Expand":"Collapse"," Sidebar"]}),e.jsxs("span",{className:"text-sm text-muted-foreground self-center",children:["Sidebar is ",a?"collapsed":"expanded"]})]}),e.jsxs(V,{direction:"horizontal",className:"rounded-lg border",children:[e.jsx(P,{defaultSize:25,minSize:a?0:15,maxSize:40,collapsible:!0,children:e.jsxs("div",{className:"flex h-full flex-col p-4",children:[e.jsx("h3",{className:"font-semibold mb-2",children:"Collapsible Sidebar"}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("div",{className:"rounded-md bg-muted p-2 text-sm",children:"Item 1"}),e.jsx("div",{className:"rounded-md bg-muted p-2 text-sm",children:"Item 2"}),e.jsx("div",{className:"rounded-md bg-muted p-2 text-sm",children:"Item 3"}),e.jsx("div",{className:"rounded-md bg-muted p-2 text-sm",children:"Item 4"})]})]})}),e.jsx(_,{withHandle:!0}),e.jsx(P,{defaultSize:75,children:e.jsx("div",{className:"flex h-full items-center justify-center p-6",children:e.jsxs("div",{className:"text-center space-y-2",children:[e.jsx("h3",{className:"text-xl font-semibold",children:"Main Content"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Content area expands when sidebar collapses"})]})})})]})]})};return e.jsx(t,{})}},Re={render:()=>e.jsx("div",{className:"h-[700px] w-full",children:e.jsxs(V,{direction:"horizontal",className:"rounded-lg border",children:[e.jsx(P,{defaultSize:20,minSize:15,maxSize:30,children:e.jsxs("div",{className:"h-full p-4 border-r",children:[e.jsx("h3",{className:"font-semibold mb-4",children:"Folders"}),e.jsxs("div",{className:"space-y-1 text-sm",children:[e.jsx("div",{className:"px-2 py-1.5 rounded-md bg-[#0ec2bc]/10 text-[#0ec2bc] font-medium cursor-pointer",children:"📥 Inbox (12)"}),e.jsx("div",{className:"px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer",children:"📤 Sent"}),e.jsx("div",{className:"px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer",children:"📝 Drafts (3)"}),e.jsx("div",{className:"px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer",children:"⭐ Starred"}),e.jsx("div",{className:"px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer",children:"🗑️ Trash"}),e.jsx("div",{className:"px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer",children:"📁 Archive"})]})]})}),e.jsx(_,{}),e.jsx(P,{defaultSize:35,minSize:25,children:e.jsxs("div",{className:"h-full border-r flex flex-col",children:[e.jsxs("div",{className:"p-4 border-b",children:[e.jsx("h3",{className:"font-semibold",children:"Inbox"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"12 messages"})]}),e.jsx("div",{className:"flex-1 overflow-auto",children:e.jsxs("div",{className:"divide-y",children:[e.jsxs("div",{className:"p-4 hover:bg-muted cursor-pointer bg-[#0ec2bc]/5 border-l-2 border-[#0ec2bc]",children:[e.jsx("div",{className:"font-semibold text-sm",children:"John Doe"}),e.jsx("div",{className:"text-sm",children:"Meeting Tomorrow"}),e.jsx("div",{className:"text-xs text-muted-foreground mt-1",children:"Let's schedule our weekly sync..."}),e.jsx("div",{className:"text-xs text-muted-foreground mt-1",children:"10:30 AM"})]}),e.jsxs("div",{className:"p-4 hover:bg-muted cursor-pointer",children:[e.jsx("div",{className:"font-semibold text-sm",children:"Jane Smith"}),e.jsx("div",{className:"text-sm",children:"Project Update"}),e.jsx("div",{className:"text-xs text-muted-foreground mt-1",children:"Here's the latest on the dashboard..."}),e.jsx("div",{className:"text-xs text-muted-foreground mt-1",children:"Yesterday"})]}),e.jsxs("div",{className:"p-4 hover:bg-muted cursor-pointer",children:[e.jsx("div",{className:"font-semibold text-sm",children:"Team Notifications"}),e.jsx("div",{className:"text-sm",children:"Weekly Summary"}),e.jsx("div",{className:"text-xs text-muted-foreground mt-1",children:"Your team completed 23 tasks..."}),e.jsx("div",{className:"text-xs text-muted-foreground mt-1",children:"2 days ago"})]})]})})]})}),e.jsx(_,{withHandle:!0}),e.jsx(P,{defaultSize:45,minSize:35,children:e.jsxs("div",{className:"h-full flex flex-col",children:[e.jsx("div",{className:"p-4 border-b",children:e.jsxs("div",{className:"flex justify-between items-start",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"font-semibold",children:"Meeting Tomorrow"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"From: John Doe"})]}),e.jsx("span",{className:"text-xs text-muted-foreground",children:"10:30 AM"})]})}),e.jsx("div",{className:"flex-1 overflow-auto p-4 space-y-4",children:e.jsxs("div",{className:"text-sm",children:[e.jsx("p",{children:"Hi there,"}),e.jsx("p",{className:"mt-4",children:"I wanted to reach out about scheduling our weekly sync meeting for tomorrow. Would 2 PM work for you?"}),e.jsx("p",{className:"mt-4",children:"We can discuss the Q4 roadmap and review the progress on the current sprint. I'll prepare the agenda and send it over before the meeting."}),e.jsx("p",{className:"mt-4",children:"Let me know if this time works or if you'd prefer a different slot."}),e.jsxs("p",{className:"mt-4",children:["Best regards,",e.jsx("br",{}),"John"]})]})}),e.jsx("div",{className:"p-4 border-t",children:e.jsxs("div",{className:"flex gap-2",children:[e.jsx(ue,{variant:"primary",size:"sm",children:"Reply"}),e.jsx(ue,{variant:"outline",size:"sm",children:"Reply All"}),e.jsx(ue,{variant:"outline",size:"sm",children:"Forward"})]})})]})})]})})},Ce={render:()=>e.jsx("div",{className:"h-[600px] w-full",children:e.jsxs(V,{direction:"horizontal",className:"rounded-lg border",children:[e.jsx(P,{defaultSize:50,children:e.jsx("div",{className:"flex h-full items-center justify-center p-6",children:e.jsxs("div",{className:"text-center space-y-2",children:[e.jsx("h3",{className:"text-xl font-semibold",children:"Left Panel"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"No visible handles, but still resizable"})]})})}),e.jsx(_,{}),e.jsx(P,{defaultSize:50,children:e.jsx("div",{className:"flex h-full items-center justify-center p-6",children:e.jsxs("div",{className:"text-center space-y-2",children:[e.jsx("h3",{className:"text-xl font-semibold",children:"Right Panel"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Hover over the edge to see cursor change"})]})})})]})})},Ee={render:()=>e.jsx("div",{className:"h-[600px] w-full",children:e.jsxs(V,{direction:"horizontal",className:"rounded-lg border border-[#0ec2bc]/30",children:[e.jsx(P,{defaultSize:30,minSize:20,children:e.jsxs("div",{className:"h-full p-6",style:{background:"linear-gradient(135deg, rgba(14, 194, 188, 0.05) 0%, rgba(14, 194, 188, 0.1) 100%)"},children:[e.jsx("h3",{className:"text-xl font-semibold mb-4",style:{color:"#0ec2bc"},children:"Navigation"}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("div",{className:"p-3 rounded-lg cursor-pointer",style:{backgroundColor:"#0ec2bc",color:"white"},children:"Dashboard"}),e.jsx("div",{className:"p-3 rounded-lg cursor-pointer hover:bg-[#0ec2bc]/10",style:{border:"1px solid rgba(14, 194, 188, 0.2)"},children:"Projects"}),e.jsx("div",{className:"p-3 rounded-lg cursor-pointer hover:bg-[#0ec2bc]/10",style:{border:"1px solid rgba(14, 194, 188, 0.2)"},children:"Analytics"}),e.jsx("div",{className:"p-3 rounded-lg cursor-pointer hover:bg-[#0ec2bc]/10",style:{border:"1px solid rgba(14, 194, 188, 0.2)"},children:"Settings"})]})]})}),e.jsx(_,{withHandle:!0,className:"bg-[#0ec2bc]/20 hover:bg-[#0ec2bc]/40"}),e.jsx(P,{defaultSize:70,children:e.jsx("div",{className:"h-full p-6",children:e.jsx("div",{className:"h-full rounded-lg p-6 flex items-center justify-center",style:{border:"2px solid rgba(14, 194, 188, 0.2)",background:"linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(14, 194, 188, 0.05) 100%)"},children:e.jsxs("div",{className:"text-center space-y-4",children:[e.jsx("h2",{className:"text-3xl font-bold",style:{color:"#0ec2bc"},children:"Ozean Licht Dashboard"}),e.jsx("p",{className:"text-muted-foreground",children:"Resizable panels with turquoise branding (#0ec2bc)"}),e.jsxs("div",{className:"flex gap-2 justify-center mt-6",children:[e.jsx(ue,{variant:"cta",style:{backgroundColor:"#0ec2bc",color:"white"},children:"Primary Action"}),e.jsx(ue,{variant:"outline",style:{borderColor:"#0ec2bc",color:"#0ec2bc"},children:"Secondary"})]})]})})})})]})})};var ut,mt,pt,ft,vt;ge.parameters={...ge.parameters,docs:{...(ut=ge.parameters)==null?void 0:ut.docs,source:{originalSource:`{
  render: () => <div className="h-[600px] w-full">
      <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="flex h-full items-center justify-center p-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Left Panel</h3>
              <p className="text-sm text-muted-foreground">
                Drag the handle to resize
              </p>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="flex h-full items-center justify-center p-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Right Panel</h3>
              <p className="text-sm text-muted-foreground">
                Minimum size: 30%
              </p>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
}`,...(pt=(mt=ge.parameters)==null?void 0:mt.docs)==null?void 0:pt.source},description:{story:`Default horizontal split with two equal panels.

The most basic resizable implementation showing horizontal split.`,...(vt=(ft=ge.parameters)==null?void 0:ft.docs)==null?void 0:vt.description}}};var xt,ht,bt,gt,Nt;Ne.parameters={...Ne.parameters,docs:{...(xt=Ne.parameters)==null?void 0:xt.docs,source:{originalSource:`{
  render: () => <div className="h-[600px] w-full">
      <ResizablePanelGroup direction="vertical" className="rounded-lg border">
        <ResizablePanel defaultSize={60} minSize={30}>
          <div className="flex h-full items-center justify-center p-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Top Panel</h3>
              <p className="text-sm text-muted-foreground">
                Main content area (60% default)
              </p>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40} minSize={20}>
          <div className="flex h-full items-center justify-center p-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Bottom Panel</h3>
              <p className="text-sm text-muted-foreground">
                Secondary content (40% default, 20% minimum)
              </p>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
}`,...(bt=(ht=Ne.parameters)==null?void 0:ht.docs)==null?void 0:bt.source},description:{story:`Vertical split layout.

Shows vertical orientation with top and bottom panels.`,...(Nt=(gt=Ne.parameters)==null?void 0:gt.docs)==null?void 0:Nt.description}}};var zt,yt,jt,St,Pt;ze.parameters={...ze.parameters,docs:{...(zt=ze.parameters)==null?void 0:zt.docs,source:{originalSource:`{
  render: () => <div className="h-[600px] w-full">
      <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="flex h-full flex-col gap-2 p-4">
            <h3 className="font-semibold">Left Sidebar</h3>
            <div className="space-y-1">
              <div className="rounded-md bg-muted p-2 text-sm">Navigation</div>
              <div className="rounded-md bg-muted p-2 text-sm">Files</div>
              <div className="rounded-md bg-muted p-2 text-sm">Search</div>
              <div className="rounded-md bg-muted p-2 text-sm">Settings</div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60} minSize={40}>
          <div className="flex h-full items-center justify-center p-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-semibold">Main Content</h3>
              <p className="text-sm text-muted-foreground">
                Primary workspace area with 60% default width
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                Min: 40%, Max: unlimited
              </p>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="flex h-full flex-col gap-2 p-4">
            <h3 className="font-semibold">Right Sidebar</h3>
            <div className="space-y-1">
              <div className="rounded-md bg-muted p-2 text-sm">Properties</div>
              <div className="rounded-md bg-muted p-2 text-sm">Inspector</div>
              <div className="rounded-md bg-muted p-2 text-sm">History</div>
              <div className="rounded-md bg-muted p-2 text-sm">Debug</div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
}`,...(jt=(yt=ze.parameters)==null?void 0:yt.docs)==null?void 0:jt.source},description:{story:`Three panel layout with sidebars.

Left sidebar, main content, and right sidebar layout.`,...(Pt=(St=ze.parameters)==null?void 0:St.docs)==null?void 0:Pt.description}}};var wt,Rt,Ct,Et,It;ye.parameters={...ye.parameters,docs:{...(wt=ye.parameters)==null?void 0:wt.docs,source:{originalSource:`{
  render: () => <div className="h-[600px] w-full">
      <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
        <ResizablePanel defaultSize={25} minSize={20}>
          <div className="flex h-full flex-col p-4">
            <h3 className="font-semibold mb-2">Sidebar</h3>
            <div className="space-y-1">
              <div className="rounded-md bg-muted p-2 text-sm">Explorer</div>
              <div className="rounded-md bg-muted p-2 text-sm">Search</div>
              <div className="rounded-md bg-muted p-2 text-sm">Git</div>
              <div className="rounded-md bg-muted p-2 text-sm">Extensions</div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={70} minSize={50}>
              <div className="flex h-full items-center justify-center p-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">Editor</h3>
                  <p className="text-sm text-muted-foreground">
                    Main code editing area
                  </p>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={30} minSize={20}>
              <div className="flex h-full items-center justify-center p-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">Terminal</h3>
                  <p className="text-sm text-muted-foreground">
                    Integrated terminal output
                  </p>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
}`,...(Ct=(Rt=ye.parameters)==null?void 0:Rt.docs)==null?void 0:Ct.source},description:{story:`Nested panels (vertical within horizontal).

Complex layout with vertical split inside horizontal panels.`,...(It=(Et=ye.parameters)==null?void 0:Et.docs)==null?void 0:It.description}}};var kt,Ht,Mt,Lt,At;je.parameters={...je.parameters,docs:{...(kt=je.parameters)==null?void 0:kt.docs,source:{originalSource:`{
  render: () => <div className="h-[700px] w-full bg-[#1e1e1e]">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={40}>
          <div className="h-full bg-[#252526] text-white p-4">
            <h3 className="text-sm font-semibold mb-3 text-gray-300">EXPLORER</h3>
            <div className="space-y-1 text-sm">
              <div className="hover:bg-[#2a2d2e] p-1 rounded cursor-pointer">
                📁 src/
              </div>
              <div className="hover:bg-[#2a2d2e] p-1 rounded cursor-pointer pl-4">
                📄 index.ts
              </div>
              <div className="hover:bg-[#2a2d2e] p-1 rounded cursor-pointer pl-4">
                📄 app.tsx
              </div>
              <div className="hover:bg-[#2a2d2e] p-1 rounded cursor-pointer pl-4">
                📄 styles.css
              </div>
              <div className="hover:bg-[#2a2d2e] p-1 rounded cursor-pointer">
                📁 components/
              </div>
              <div className="hover:bg-[#2a2d2e] p-1 rounded cursor-pointer pl-4">
                📄 Button.tsx
              </div>
              <div className="hover:bg-[#2a2d2e] p-1 rounded cursor-pointer">
                📄 package.json
              </div>
              <div className="hover:bg-[#2a2d2e] p-1 rounded cursor-pointer">
                📄 tsconfig.json
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={80}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={75} minSize={40}>
              <div className="h-full bg-[#1e1e1e] text-white">
                <div className="bg-[#2d2d30] px-4 py-2 text-sm border-b border-[#3e3e42]">
                  <span className="text-gray-300">src/app.tsx</span>
                  <span className="ml-2 text-gray-500">●</span>
                </div>
                <div className="p-4 font-mono text-sm space-y-1">
                  <div><span className="text-[#569cd6]">import</span> <span className="text-[#ce9178]">React</span> <span className="text-[#569cd6]">from</span> <span className="text-[#ce9178]">'react'</span>;</div>
                  <div><span className="text-[#569cd6]">import</span> {'{'} <span className="text-[#9cdcfe]">Button</span> {'}'} <span className="text-[#569cd6]">from</span> <span className="text-[#ce9178]">'./components'</span>;</div>
                  <div className="mt-2"></div>
                  <div><span className="text-[#569cd6]">export</span> <span className="text-[#569cd6]">const</span> <span className="text-[#4fc1ff]">App</span> = () =&gt; {'{'}</div>
                  <div className="pl-4"><span className="text-[#c586c0]">return</span> (</div>
                  <div className="pl-8">&lt;<span className="text-[#4ec9b0]">div</span>&gt;</div>
                  <div className="pl-12">&lt;<span className="text-[#4ec9b0]">Button</span>&gt;Click me&lt;/<span className="text-[#4ec9b0]">Button</span>&gt;</div>
                  <div className="pl-8">&lt;/<span className="text-[#4ec9b0]">div</span>&gt;</div>
                  <div className="pl-4">);</div>
                  <div>{'}'};</div>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={25} minSize={15}>
              <div className="h-full bg-[#1e1e1e] text-white">
                <div className="bg-[#2d2d30] px-4 py-2 text-sm border-b border-[#3e3e42]">
                  <span className="text-gray-300">TERMINAL</span>
                </div>
                <div className="p-4 font-mono text-xs space-y-1">
                  <div className="text-gray-400">$ npm run dev</div>
                  <div className="text-green-400">✓ Development server started</div>
                  <div className="text-gray-400">Local: http://localhost:3000</div>
                  <div className="text-gray-400">Ready in 1.2s</div>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
}`,...(Mt=(Ht=je.parameters)==null?void 0:Ht.docs)==null?void 0:Mt.source},description:{story:`Code editor layout (Monaco/VS Code style).

Professional code editor layout with file tree, editor, and terminal.`,...(At=(Lt=je.parameters)==null?void 0:Lt.docs)==null?void 0:At.description}}};var Dt,_t,Gt,$t,Vt;Se.parameters={...Se.parameters,docs:{...(Dt=Se.parameters)==null?void 0:Dt.docs,source:{originalSource:`{
  render: () => <div className="h-[700px] w-full">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0ec2bc]/90 to-[#0ec2bc]/70 text-white px-6 py-4">
          <h2 className="text-xl font-bold">Analytics Dashboard</h2>
        </div>

        {/* Main Layout */}
        <div className="flex-1 min-h-0">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
              <div className="h-full border-r p-4 space-y-2">
                <h3 className="font-semibold mb-4">Navigation</h3>
                <button className="w-full text-left px-3 py-2 rounded-md bg-[#0ec2bc]/10 text-[#0ec2bc] font-medium">
                  Overview
                </button>
                <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted">
                  Analytics
                </button>
                <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted">
                  Reports
                </button>
                <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted">
                  Users
                </button>
                <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted">
                  Settings
                </button>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={80}>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={70}>
                  <div className="h-full p-6">
                    <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-blue-100">
                        <div className="text-sm text-gray-600">Total Users</div>
                        <div className="text-2xl font-bold text-blue-600">24,563</div>
                        <div className="text-xs text-green-600 mt-1">↑ 12.5%</div>
                      </div>
                      <div className="border rounded-lg p-4 bg-gradient-to-br from-green-50 to-green-100">
                        <div className="text-sm text-gray-600">Revenue</div>
                        <div className="text-2xl font-bold text-green-600">$128,430</div>
                        <div className="text-xs text-green-600 mt-1">↑ 8.2%</div>
                      </div>
                      <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-purple-100">
                        <div className="text-sm text-gray-600">Conversions</div>
                        <div className="text-2xl font-bold text-purple-600">1,247</div>
                        <div className="text-xs text-red-600 mt-1">↓ 3.1%</div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4 h-48 flex items-center justify-center bg-muted/30">
                      <span className="text-muted-foreground">Chart Visualization Area</span>
                    </div>
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={30} minSize={20}>
                  <div className="h-full p-6 border-t bg-muted/20">
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span>New user registration</span>
                        <span className="text-muted-foreground">2 min ago</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Payment received</span>
                        <span className="text-muted-foreground">5 min ago</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Report generated</span>
                        <span className="text-muted-foreground">12 min ago</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Settings updated</span>
                        <span className="text-muted-foreground">28 min ago</span>
                      </div>
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
}`,...(Gt=(_t=Se.parameters)==null?void 0:_t.docs)==null?void 0:Gt.source},description:{story:`Dashboard layout with multiple data panels.

Complex dashboard with header, sidebar, main content, and metrics.`,...(Vt=($t=Se.parameters)==null?void 0:$t.docs)==null?void 0:Vt.description}}};var qt,Bt,Tt,Ft,Ot;Pe.parameters={...Pe.parameters,docs:{...(qt=Pe.parameters)==null?void 0:qt.docs,source:{originalSource:`{
  render: () => <div className="h-[600px] w-full">
      <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
        <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
          <div className="flex h-full flex-col items-center justify-center p-6 text-center space-y-2">
            <h3 className="text-xl font-semibold">Constrained Panel</h3>
            <p className="text-sm text-muted-foreground">
              Min: 20% | Max: 40%
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Cannot be resized beyond these limits
            </p>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40} minSize={30} maxSize={60}>
          <div className="flex h-full flex-col items-center justify-center p-6 text-center space-y-2">
            <h3 className="text-xl font-semibold">Middle Panel</h3>
            <p className="text-sm text-muted-foreground">
              Min: 30% | Max: 60%
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Flexible but with limits
            </p>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
          <div className="flex h-full flex-col items-center justify-center p-6 text-center space-y-2">
            <h3 className="text-xl font-semibold">Constrained Panel</h3>
            <p className="text-sm text-muted-foreground">
              Min: 20% | Max: 40%
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Same constraints as left panel
            </p>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
}`,...(Tt=(Bt=Pe.parameters)==null?void 0:Bt.docs)==null?void 0:Tt.source},description:{story:`Panels with minimum and maximum size constraints.

Demonstrates size constraints to prevent panels from becoming too small or large.`,...(Ot=(Ft=Pe.parameters)==null?void 0:Ft.docs)==null?void 0:Ot.description}}};var Wt,Ut,Jt,Kt,Xt;we.parameters={...we.parameters,docs:{...(Wt=we.parameters)==null?void 0:Wt.docs,source:{originalSource:`{
  render: () => {
    const CollapsibleExample = () => {
      const [isCollapsed, setIsCollapsed] = useState(false);
      return <div className="h-[600px] w-full">
          <div className="mb-4 flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsCollapsed(!isCollapsed)}>
              {isCollapsed ? 'Expand' : 'Collapse'} Sidebar
            </Button>
            <span className="text-sm text-muted-foreground self-center">
              Sidebar is {isCollapsed ? 'collapsed' : 'expanded'}
            </span>
          </div>
          <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
            <ResizablePanel defaultSize={25} minSize={isCollapsed ? 0 : 15} maxSize={40} collapsible={true}>
              <div className="flex h-full flex-col p-4">
                <h3 className="font-semibold mb-2">Collapsible Sidebar</h3>
                <div className="space-y-1">
                  <div className="rounded-md bg-muted p-2 text-sm">Item 1</div>
                  <div className="rounded-md bg-muted p-2 text-sm">Item 2</div>
                  <div className="rounded-md bg-muted p-2 text-sm">Item 3</div>
                  <div className="rounded-md bg-muted p-2 text-sm">Item 4</div>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={75}>
              <div className="flex h-full items-center justify-center p-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">Main Content</h3>
                  <p className="text-sm text-muted-foreground">
                    Content area expands when sidebar collapses
                  </p>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>;
    };
    return <CollapsibleExample />;
  }
}`,...(Jt=(Ut=we.parameters)==null?void 0:Ut.docs)==null?void 0:Jt.source},description:{story:`Collapsible panel that can be fully collapsed.

Shows how panels can collapse to their minimum size or be hidden.`,...(Xt=(Kt=we.parameters)==null?void 0:Kt.docs)==null?void 0:Xt.description}}};var Yt,Qt,Zt,ea,ta;Re.parameters={...Re.parameters,docs:{...(Yt=Re.parameters)==null?void 0:Yt.docs,source:{originalSource:`{
  render: () => <div className="h-[700px] w-full">
      <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full p-4 border-r">
            <h3 className="font-semibold mb-4">Folders</h3>
            <div className="space-y-1 text-sm">
              <div className="px-2 py-1.5 rounded-md bg-[#0ec2bc]/10 text-[#0ec2bc] font-medium cursor-pointer">
                📥 Inbox (12)
              </div>
              <div className="px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">
                📤 Sent
              </div>
              <div className="px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">
                📝 Drafts (3)
              </div>
              <div className="px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">
                ⭐ Starred
              </div>
              <div className="px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">
                🗑️ Trash
              </div>
              <div className="px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">
                📁 Archive
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={35} minSize={25}>
          <div className="h-full border-r flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Inbox</h3>
              <p className="text-sm text-muted-foreground">12 messages</p>
            </div>
            <div className="flex-1 overflow-auto">
              <div className="divide-y">
                <div className="p-4 hover:bg-muted cursor-pointer bg-[#0ec2bc]/5 border-l-2 border-[#0ec2bc]">
                  <div className="font-semibold text-sm">John Doe</div>
                  <div className="text-sm">Meeting Tomorrow</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Let's schedule our weekly sync...
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">10:30 AM</div>
                </div>
                <div className="p-4 hover:bg-muted cursor-pointer">
                  <div className="font-semibold text-sm">Jane Smith</div>
                  <div className="text-sm">Project Update</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Here's the latest on the dashboard...
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Yesterday</div>
                </div>
                <div className="p-4 hover:bg-muted cursor-pointer">
                  <div className="font-semibold text-sm">Team Notifications</div>
                  <div className="text-sm">Weekly Summary</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Your team completed 23 tasks...
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">2 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={45} minSize={35}>
          <div className="h-full flex flex-col">
            <div className="p-4 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Meeting Tomorrow</h3>
                  <p className="text-sm text-muted-foreground">From: John Doe</p>
                </div>
                <span className="text-xs text-muted-foreground">10:30 AM</span>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              <div className="text-sm">
                <p>Hi there,</p>
                <p className="mt-4">
                  I wanted to reach out about scheduling our weekly sync meeting for
                  tomorrow. Would 2 PM work for you?
                </p>
                <p className="mt-4">
                  We can discuss the Q4 roadmap and review the progress on the current
                  sprint. I'll prepare the agenda and send it over before the meeting.
                </p>
                <p className="mt-4">
                  Let me know if this time works or if you'd prefer a different slot.
                </p>
                <p className="mt-4">Best regards,<br />John</p>
              </div>
            </div>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Button variant="primary" size="sm">Reply</Button>
                <Button variant="outline" size="sm">Reply All</Button>
                <Button variant="outline" size="sm">Forward</Button>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
}`,...(Zt=(Qt=Re.parameters)==null?void 0:Qt.docs)==null?void 0:Zt.source},description:{story:`Email client layout.

Classic email client with folder tree, message list, and preview pane.`,...(ta=(ea=Re.parameters)==null?void 0:ea.docs)==null?void 0:ta.description}}};var aa,na,sa,la,ia;Ce.parameters={...Ce.parameters,docs:{...(aa=Ce.parameters)==null?void 0:aa.docs,source:{originalSource:`{
  render: () => <div className="h-[600px] w-full">
      <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center p-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Left Panel</h3>
              <p className="text-sm text-muted-foreground">
                No visible handles, but still resizable
              </p>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center p-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Right Panel</h3>
              <p className="text-sm text-muted-foreground">
                Hover over the edge to see cursor change
              </p>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
}`,...(sa=(na=Ce.parameters)==null?void 0:na.docs)==null?void 0:sa.source},description:{story:`Without visible handles.

Minimal design without visible grip handles on resize bars.`,...(ia=(la=Ce.parameters)==null?void 0:la.docs)==null?void 0:ia.description}}};var ra,oa,da,ca,ua;Ee.parameters={...Ee.parameters,docs:{...(ra=Ee.parameters)==null?void 0:ra.docs,source:{originalSource:`{
  render: () => <div className="h-[600px] w-full">
      <ResizablePanelGroup direction="horizontal" className="rounded-lg border border-[#0ec2bc]/30">
        <ResizablePanel defaultSize={30} minSize={20}>
          <div className="h-full p-6" style={{
          background: 'linear-gradient(135deg, rgba(14, 194, 188, 0.05) 0%, rgba(14, 194, 188, 0.1) 100%)'
        }}>
            <h3 className="text-xl font-semibold mb-4" style={{
            color: '#0ec2bc'
          }}>
              Navigation
            </h3>
            <div className="space-y-2">
              <div className="p-3 rounded-lg cursor-pointer" style={{
              backgroundColor: '#0ec2bc',
              color: 'white'
            }}>
                Dashboard
              </div>
              <div className="p-3 rounded-lg cursor-pointer hover:bg-[#0ec2bc]/10" style={{
              border: '1px solid rgba(14, 194, 188, 0.2)'
            }}>
                Projects
              </div>
              <div className="p-3 rounded-lg cursor-pointer hover:bg-[#0ec2bc]/10" style={{
              border: '1px solid rgba(14, 194, 188, 0.2)'
            }}>
                Analytics
              </div>
              <div className="p-3 rounded-lg cursor-pointer hover:bg-[#0ec2bc]/10" style={{
              border: '1px solid rgba(14, 194, 188, 0.2)'
            }}>
                Settings
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="bg-[#0ec2bc]/20 hover:bg-[#0ec2bc]/40" />
        <ResizablePanel defaultSize={70}>
          <div className="h-full p-6">
            <div className="h-full rounded-lg p-6 flex items-center justify-center" style={{
            border: '2px solid rgba(14, 194, 188, 0.2)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(14, 194, 188, 0.05) 100%)'
          }}>
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold" style={{
                color: '#0ec2bc'
              }}>
                  Ozean Licht Dashboard
                </h2>
                <p className="text-muted-foreground">
                  Resizable panels with turquoise branding (#0ec2bc)
                </p>
                <div className="flex gap-2 justify-center mt-6">
                  <Button variant="cta" style={{
                  backgroundColor: '#0ec2bc',
                  color: 'white'
                }}>
                    Primary Action
                  </Button>
                  <Button variant="outline" style={{
                  borderColor: '#0ec2bc',
                  color: '#0ec2bc'
                }}>
                    Secondary
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
}`,...(da=(oa=Ee.parameters)==null?void 0:oa.docs)==null?void 0:da.source},description:{story:`Ozean Licht themed resizable panels.

Demonstrates using Ozean Licht turquoise branding with resizable layouts.`,...(ua=(ca=Ee.parameters)==null?void 0:ca.docs)==null?void 0:ua.description}}};const Pn=["Default","VerticalSplit","ThreePanels","NestedPanels","CodeEditor","DashboardLayout","WithMinMaxSizes","CollapsiblePanel","EmailClient","WithoutHandles","OzeanLichtThemed"];export{je as CodeEditor,we as CollapsiblePanel,Se as DashboardLayout,ge as Default,Re as EmailClient,ye as NestedPanels,Ee as OzeanLichtThemed,ze as ThreePanels,Ne as VerticalSplit,Pe as WithMinMaxSizes,Ce as WithoutHandles,Pn as __namedExportsOrder,Sn as default};
