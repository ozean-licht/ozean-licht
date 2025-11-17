import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{w as je,u as we,e as ke}from"./index-CJu6nLMj.js";import{r}from"./index-B2-qRKKC.js";import{I as tt}from"./index-kS-9iBlu.js";import{P as A,c as at,a as _,e as ye}from"./index-D5ysUGwq.js";import{u as yn}from"./index-BlCrtW8-.js";import{u as Z,c as ot}from"./index-BFjtS4uE.js";import{u as it}from"./index-D6fdIYSQ.js";import{P as ae}from"./index-PNzqWif7.js";import{u as Cn}from"./index-CpxwHbl5.js";import{c as Ln}from"./index-BDyC_JNs.js";import{D as st}from"./index-DwPv8f4P.js";import{u as rt}from"./index-_AbP6Uzr.js";import{u as ie}from"./index-D1vk04JX.js";import{u as z}from"./index-ciuW_uyV.js";import{R as ct}from"./index-BOUwz6lr.js";import{c as lt}from"./index-DVF2XGCm.js";import{c as B}from"./cn-CytzSlOG.js";import{C as dt}from"./chevron-down-CVm-VZQY.js";import{B as se}from"./button-BHL6w8gg.js";import{c as he}from"./createLucideIcon-BbF4D6Jl.js";import{C as ut}from"./code-C3pA4Cmp.js";import{F as pe}from"./file-text-CDZzEi0q.js";import{P as mt,G as gt}from"./palette-DokdBykw.js";import{B as In}from"./book-open-DNYwrNLu.js";import{U as re}from"./users-DqXpMwnv.js";import{M as ht}from"./mail-Cxl1hOu1.js";import{S as pt}from"./settings-DfwhJ3T1.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-BiMR7eR1.js";/**
 * @license lucide-react v0.553.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xt=[["path",{d:"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",key:"jecpp"}],["rect",{width:"20",height:"14",x:"2",y:"6",rx:"2",key:"i6l2r4"}]],Tn=he("briefcase",xt);/**
 * @license lucide-react v0.553.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vt=[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]],_n=he("layers",vt);/**
 * @license lucide-react v0.553.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ft=[["path",{d:"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",key:"1a0edw"}],["path",{d:"M12 22V12",key:"d0xqtd"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}]],Nt=he("package",ft);var V="NavigationMenu",[xe,En,bt]=Ln(V),[ce,Mt,jt]=Ln(V),[ve]=at(V,[bt,jt]),[wt,S]=ve(V),[kt,yt]=ve(V),Pn=r.forwardRef((n,t)=>{const{__scopeNavigationMenu:a,value:s,onValueChange:i,defaultValue:c,delayDuration:l=200,skipDelayDuration:m=300,orientation:d="horizontal",dir:j,...u}=n,[v,y]=r.useState(null),C=Z(t,N=>y(N)),b=it(j),f=r.useRef(0),w=r.useRef(0),L=r.useRef(0),[D,p]=r.useState(!0),[x,h]=yn({prop:s,onChange:N=>{const O=N!=="",oe=m>0;O?(window.clearTimeout(L.current),oe&&p(!1)):(window.clearTimeout(L.current),L.current=window.setTimeout(()=>p(!0),m)),i==null||i(N)},defaultProp:c??"",caller:V}),k=r.useCallback(()=>{window.clearTimeout(w.current),w.current=window.setTimeout(()=>h(""),150)},[h]),R=r.useCallback(N=>{window.clearTimeout(w.current),h(N)},[h]),F=r.useCallback(N=>{x===N?window.clearTimeout(w.current):f.current=window.setTimeout(()=>{window.clearTimeout(w.current),h(N)},l)},[x,h,l]);return r.useEffect(()=>()=>{window.clearTimeout(f.current),window.clearTimeout(w.current),window.clearTimeout(L.current)},[]),e.jsx(Rn,{scope:a,isRootMenu:!0,value:x,dir:b,orientation:d,rootNavigationMenu:v,onTriggerEnter:N=>{window.clearTimeout(f.current),D?F(N):R(N)},onTriggerLeave:()=>{window.clearTimeout(f.current),k()},onContentEnter:()=>window.clearTimeout(w.current),onContentLeave:k,onItemSelect:N=>{h(O=>O===N?"":N)},onItemDismiss:()=>h(""),children:e.jsx(A.nav,{"aria-label":"Main","data-orientation":d,dir:b,...u,ref:C})})});Pn.displayName=V;var le="NavigationMenuSub",Ct=r.forwardRef((n,t)=>{const{__scopeNavigationMenu:a,value:s,onValueChange:i,defaultValue:c,orientation:l="horizontal",...m}=n,d=S(le,a),[j,u]=yn({prop:s,onChange:i,defaultProp:c??"",caller:le});return e.jsx(Rn,{scope:a,isRootMenu:!1,value:j,dir:d.dir,orientation:l,rootNavigationMenu:d.rootNavigationMenu,onTriggerEnter:v=>u(v),onItemSelect:v=>u(v),onItemDismiss:()=>u(""),children:e.jsx(A.div,{"data-orientation":l,...m,ref:t})})});Ct.displayName=le;var Rn=n=>{const{scope:t,isRootMenu:a,rootNavigationMenu:s,dir:i,orientation:c,children:l,value:m,onItemSelect:d,onItemDismiss:j,onTriggerEnter:u,onTriggerLeave:v,onContentEnter:y,onContentLeave:C}=n,[b,f]=r.useState(null),[w,L]=r.useState(new Map),[D,p]=r.useState(null);return e.jsx(wt,{scope:t,isRootMenu:a,rootNavigationMenu:s,value:m,previousValue:rt(m),baseId:Cn(),dir:i,orientation:c,viewport:b,onViewportChange:f,indicatorTrack:D,onIndicatorTrackChange:p,onTriggerEnter:z(u),onTriggerLeave:z(v),onContentEnter:z(y),onContentLeave:z(C),onItemSelect:z(d),onItemDismiss:z(j),onViewportContentChange:r.useCallback((x,h)=>{L(k=>(k.set(x,h),new Map(k)))},[]),onViewportContentRemove:r.useCallback(x=>{L(h=>h.has(x)?(h.delete(x),new Map(h)):h)},[]),children:e.jsx(xe.Provider,{scope:t,children:e.jsx(kt,{scope:t,items:w,children:l})})})},Sn="NavigationMenuList",An=r.forwardRef((n,t)=>{const{__scopeNavigationMenu:a,...s}=n,i=S(Sn,a),c=e.jsx(A.ul,{"data-orientation":i.orientation,...s,ref:t});return e.jsx(A.div,{style:{position:"relative"},ref:i.onIndicatorTrackChange,children:e.jsx(xe.Slot,{scope:a,children:i.isRootMenu?e.jsx(Wn,{asChild:!0,children:c}):c})})});An.displayName=Sn;var Dn="NavigationMenuItem",[Lt,Fn]=ve(Dn),On=r.forwardRef((n,t)=>{const{__scopeNavigationMenu:a,value:s,...i}=n,c=Cn(),l=s||c||"LEGACY_REACT_AUTO_VALUE",m=r.useRef(null),d=r.useRef(null),j=r.useRef(null),u=r.useRef(()=>{}),v=r.useRef(!1),y=r.useCallback((b="start")=>{if(m.current){u.current();const f=ue(m.current);f.length&&be(b==="start"?f:f.reverse())}},[]),C=r.useCallback(()=>{if(m.current){const b=ue(m.current);b.length&&(u.current=St(b))}},[]);return e.jsx(Lt,{scope:a,value:l,triggerRef:d,contentRef:m,focusProxyRef:j,wasEscapeCloseRef:v,onEntryKeyDown:y,onFocusProxyEnter:y,onRootContentClose:C,onContentFocusOutside:C,children:e.jsx(A.li,{...i,ref:t})})});On.displayName=Dn;var de="NavigationMenuTrigger",zn=r.forwardRef((n,t)=>{const{__scopeNavigationMenu:a,disabled:s,...i}=n,c=S(de,n.__scopeNavigationMenu),l=Fn(de,n.__scopeNavigationMenu),m=r.useRef(null),d=Z(m,l.triggerRef,t),j=$n(c.baseId,l.value),u=qn(c.baseId,l.value),v=r.useRef(!1),y=r.useRef(!1),C=l.value===c.value;return e.jsxs(e.Fragment,{children:[e.jsx(xe.ItemSlot,{scope:a,value:l.value,children:e.jsx(Hn,{asChild:!0,children:e.jsx(A.button,{id:j,disabled:s,"data-disabled":s?"":void 0,"data-state":Me(C),"aria-expanded":C,"aria-controls":u,...i,ref:d,onPointerEnter:_(n.onPointerEnter,()=>{y.current=!1,l.wasEscapeCloseRef.current=!1}),onPointerMove:_(n.onPointerMove,ne(()=>{s||y.current||l.wasEscapeCloseRef.current||v.current||(c.onTriggerEnter(l.value),v.current=!0)})),onPointerLeave:_(n.onPointerLeave,ne(()=>{s||(c.onTriggerLeave(),v.current=!1)})),onClick:_(n.onClick,()=>{c.onItemSelect(l.value),y.current=C}),onKeyDown:_(n.onKeyDown,b=>{const w={horizontal:"ArrowDown",vertical:c.dir==="rtl"?"ArrowLeft":"ArrowRight"}[c.orientation];C&&b.key===w&&(l.onEntryKeyDown(),b.preventDefault())})})})}),C&&e.jsxs(e.Fragment,{children:[e.jsx(ct,{"aria-hidden":!0,tabIndex:0,ref:l.focusProxyRef,onFocus:b=>{const f=l.contentRef.current,w=b.relatedTarget,L=w===m.current,D=f==null?void 0:f.contains(w);(L||!D)&&l.onFocusProxyEnter(L?"start":"end")}}),c.viewport&&e.jsx("span",{"aria-owns":u})]})]})});zn.displayName=de;var It="NavigationMenuLink",Ce="navigationMenu.linkSelect",Bn=r.forwardRef((n,t)=>{const{__scopeNavigationMenu:a,active:s,onSelect:i,...c}=n;return e.jsx(Hn,{asChild:!0,children:e.jsx(A.a,{"data-active":s?"":void 0,"aria-current":s?"page":void 0,...c,ref:t,onClick:_(n.onClick,l=>{const m=l.target,d=new CustomEvent(Ce,{bubbles:!0,cancelable:!0});if(m.addEventListener(Ce,j=>i==null?void 0:i(j),{once:!0}),ye(m,d),!d.defaultPrevented&&!l.metaKey){const j=new CustomEvent(ee,{bubbles:!0,cancelable:!0});ye(m,j)}},{checkForDefaultPrevented:!1})})})});Bn.displayName=It;var fe="NavigationMenuIndicator",Vn=r.forwardRef((n,t)=>{const{forceMount:a,...s}=n,i=S(fe,n.__scopeNavigationMenu),c=!!i.value;return i.indicatorTrack?tt.createPortal(e.jsx(ae,{present:a||c,children:e.jsx(Tt,{...s,ref:t})}),i.indicatorTrack):null});Vn.displayName=fe;var Tt=r.forwardRef((n,t)=>{const{__scopeNavigationMenu:a,...s}=n,i=S(fe,a),c=En(a),[l,m]=r.useState(null),[d,j]=r.useState(null),u=i.orientation==="horizontal",v=!!i.value;r.useEffect(()=>{var f;const b=(f=c().find(w=>w.value===i.value))==null?void 0:f.ref.current;b&&m(b)},[c,i.value]);const y=()=>{l&&j({size:u?l.offsetWidth:l.offsetHeight,offset:u?l.offsetLeft:l.offsetTop})};return me(l,y),me(i.indicatorTrack,y),d?e.jsx(A.div,{"aria-hidden":!0,"data-state":v?"visible":"hidden","data-orientation":i.orientation,...s,ref:t,style:{position:"absolute",...u?{left:0,width:d.size+"px",transform:`translateX(${d.offset}px)`}:{top:0,height:d.size+"px",transform:`translateY(${d.offset}px)`},...s.style}}):null}),K="NavigationMenuContent",Kn=r.forwardRef((n,t)=>{const{forceMount:a,...s}=n,i=S(K,n.__scopeNavigationMenu),c=Fn(K,n.__scopeNavigationMenu),l=Z(c.contentRef,t),m=c.value===i.value,d={value:c.value,triggerRef:c.triggerRef,focusProxyRef:c.focusProxyRef,wasEscapeCloseRef:c.wasEscapeCloseRef,onContentFocusOutside:c.onContentFocusOutside,onRootContentClose:c.onRootContentClose,...s};return i.viewport?e.jsx(_t,{forceMount:a,...d,ref:l}):e.jsx(ae,{present:a||m,children:e.jsx(Gn,{"data-state":Me(m),...d,ref:l,onPointerEnter:_(n.onPointerEnter,i.onContentEnter),onPointerLeave:_(n.onPointerLeave,ne(i.onContentLeave)),style:{pointerEvents:!m&&i.isRootMenu?"none":void 0,...d.style}})})});Kn.displayName=K;var _t=r.forwardRef((n,t)=>{const a=S(K,n.__scopeNavigationMenu),{onViewportContentChange:s,onViewportContentRemove:i}=a;return ie(()=>{s(n.value,{ref:t,...n})},[n,t,s]),ie(()=>()=>i(n.value),[n.value,i]),null}),ee="navigationMenu.rootContentDismiss",Gn=r.forwardRef((n,t)=>{const{__scopeNavigationMenu:a,value:s,triggerRef:i,focusProxyRef:c,wasEscapeCloseRef:l,onRootContentClose:m,onContentFocusOutside:d,...j}=n,u=S(K,a),v=r.useRef(null),y=Z(v,t),C=$n(u.baseId,s),b=qn(u.baseId,s),f=En(a),w=r.useRef(null),{onItemDismiss:L}=u;r.useEffect(()=>{const p=v.current;if(u.isRootMenu&&p){const x=()=>{var h;L(),m(),p.contains(document.activeElement)&&((h=i.current)==null||h.focus())};return p.addEventListener(ee,x),()=>p.removeEventListener(ee,x)}},[u.isRootMenu,n.value,i,L,m]);const D=r.useMemo(()=>{const x=f().map(O=>O.value);u.dir==="rtl"&&x.reverse();const h=x.indexOf(u.value),k=x.indexOf(u.previousValue),R=s===u.value,F=k===x.indexOf(s);if(!R&&!F)return w.current;const N=(()=>{if(h!==k){if(R&&k!==-1)return h>k?"from-end":"from-start";if(F&&h!==-1)return h>k?"to-start":"to-end"}return null})();return w.current=N,N},[u.previousValue,u.value,u.dir,f,s]);return e.jsx(Wn,{asChild:!0,children:e.jsx(st,{id:b,"aria-labelledby":C,"data-motion":D,"data-orientation":u.orientation,...j,ref:y,disableOutsidePointerEvents:!1,onDismiss:()=>{var x;const p=new Event(ee,{bubbles:!0,cancelable:!0});(x=v.current)==null||x.dispatchEvent(p)},onFocusOutside:_(n.onFocusOutside,p=>{var h;d();const x=p.target;(h=u.rootNavigationMenu)!=null&&h.contains(x)&&p.preventDefault()}),onPointerDownOutside:_(n.onPointerDownOutside,p=>{var R;const x=p.target,h=f().some(F=>{var N;return(N=F.ref.current)==null?void 0:N.contains(x)}),k=u.isRootMenu&&((R=u.viewport)==null?void 0:R.contains(x));(h||k||!u.isRootMenu)&&p.preventDefault()}),onKeyDown:_(n.onKeyDown,p=>{var k;const x=p.altKey||p.ctrlKey||p.metaKey;if(p.key==="Tab"&&!x){const R=ue(p.currentTarget),F=document.activeElement,N=R.findIndex(nt=>nt===F),oe=p.shiftKey?R.slice(0,N).reverse():R.slice(N+1,R.length);be(oe)?p.preventDefault():(k=c.current)==null||k.focus()}}),onEscapeKeyDown:_(n.onEscapeKeyDown,p=>{l.current=!0})})})}),Ne="NavigationMenuViewport",Un=r.forwardRef((n,t)=>{const{forceMount:a,...s}=n,c=!!S(Ne,n.__scopeNavigationMenu).value;return e.jsx(ae,{present:a||c,children:e.jsx(Et,{...s,ref:t})})});Un.displayName=Ne;var Et=r.forwardRef((n,t)=>{const{__scopeNavigationMenu:a,children:s,...i}=n,c=S(Ne,a),l=Z(t,c.onViewportChange),m=yt(K,n.__scopeNavigationMenu),[d,j]=r.useState(null),[u,v]=r.useState(null),y=d?(d==null?void 0:d.width)+"px":void 0,C=d?(d==null?void 0:d.height)+"px":void 0,b=!!c.value,f=b?c.value:c.previousValue;return me(u,()=>{u&&j({width:u.offsetWidth,height:u.offsetHeight})}),e.jsx(A.div,{"data-state":Me(b),"data-orientation":c.orientation,...i,ref:l,style:{pointerEvents:!b&&c.isRootMenu?"none":void 0,"--radix-navigation-menu-viewport-width":y,"--radix-navigation-menu-viewport-height":C,...i.style},onPointerEnter:_(n.onPointerEnter,c.onContentEnter),onPointerLeave:_(n.onPointerLeave,ne(c.onContentLeave)),children:Array.from(m.items).map(([L,{ref:D,forceMount:p,...x}])=>{const h=f===L;return e.jsx(ae,{present:p||h,children:e.jsx(Gn,{...x,ref:ot(D,k=>{h&&k&&v(k)})})},L)})})}),Pt="FocusGroup",Wn=r.forwardRef((n,t)=>{const{__scopeNavigationMenu:a,...s}=n,i=S(Pt,a);return e.jsx(ce.Provider,{scope:a,children:e.jsx(ce.Slot,{scope:a,children:e.jsx(A.div,{dir:i.dir,...s,ref:t})})})}),Le=["ArrowRight","ArrowLeft","ArrowUp","ArrowDown"],Rt="FocusGroupItem",Hn=r.forwardRef((n,t)=>{const{__scopeNavigationMenu:a,...s}=n,i=Mt(a),c=S(Rt,a);return e.jsx(ce.ItemSlot,{scope:a,children:e.jsx(A.button,{...s,ref:t,onKeyDown:_(n.onKeyDown,l=>{if(["Home","End",...Le].includes(l.key)){let d=i().map(v=>v.ref.current);if([c.dir==="rtl"?"ArrowRight":"ArrowLeft","ArrowUp","End"].includes(l.key)&&d.reverse(),Le.includes(l.key)){const v=d.indexOf(l.currentTarget);d=d.slice(v+1)}setTimeout(()=>be(d)),l.preventDefault()}})})})});function ue(n){const t=[],a=document.createTreeWalker(n,NodeFilter.SHOW_ELEMENT,{acceptNode:s=>{const i=s.tagName==="INPUT"&&s.type==="hidden";return s.disabled||s.hidden||i?NodeFilter.FILTER_SKIP:s.tabIndex>=0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});for(;a.nextNode();)t.push(a.currentNode);return t}function be(n){const t=document.activeElement;return n.some(a=>a===t?!0:(a.focus(),document.activeElement!==t))}function St(n){return n.forEach(t=>{t.dataset.tabindex=t.getAttribute("tabindex")||"",t.setAttribute("tabindex","-1")}),()=>{n.forEach(t=>{const a=t.dataset.tabindex;t.setAttribute("tabindex",a)})}}function me(n,t){const a=z(t);ie(()=>{let s=0;if(n){const i=new ResizeObserver(()=>{cancelAnimationFrame(s),s=window.requestAnimationFrame(a)});return i.observe(n),()=>{window.cancelAnimationFrame(s),i.unobserve(n)}}},[n,a])}function Me(n){return n?"open":"closed"}function $n(n,t){return`${n}-trigger-${t}`}function qn(n,t){return`${n}-content-${t}`}function ne(n){return t=>t.pointerType==="mouse"?n(t):void 0}var Yn=Pn,Jn=An,At=On,Qn=zn,Dt=Bn,Xn=Vn,Zn=Kn,et=Un;const E=r.forwardRef(({className:n,children:t,...a},s)=>e.jsxs(Yn,{ref:s,className:B("relative z-10 flex max-w-max flex-1 items-center justify-center",n),...a,children:[t,e.jsx(te,{})]}));E.displayName=Yn.displayName;const P=r.forwardRef(({className:n,...t},a)=>e.jsx(Jn,{ref:a,className:B("group flex flex-1 list-none items-center justify-center space-x-1",n),...t}));P.displayName=Jn.displayName;const g=At,M=lt("group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-accent-foreground data-[state=open]:bg-accent/50 data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent"),I=r.forwardRef(({className:n,children:t,...a},s)=>e.jsxs(Qn,{ref:s,className:B(M(),"group",n),...a,children:[t," ",e.jsx(dt,{className:"relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180","aria-hidden":"true"})]}));I.displayName=Qn.displayName;const T=r.forwardRef(({className:n,...t},a)=>e.jsx(Zn,{ref:a,className:B("left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",n),...t}));T.displayName=Zn.displayName;const o=Dt,te=r.forwardRef(({className:n,...t},a)=>e.jsx("div",{className:B("absolute left-0 top-full flex justify-center"),children:e.jsx(et,{className:B("origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",n),ref:a,...t})}));te.displayName=et.displayName;const ge=r.forwardRef(({className:n,...t},a)=>e.jsx(Xn,{ref:a,className:B("top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",n),...t,children:e.jsx("div",{className:"relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md"})}));ge.displayName=Xn.displayName;try{E.displayName="NavigationMenu",E.__docgenInfo={description:"",displayName:"NavigationMenu",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{P.displayName="NavigationMenuList",P.__docgenInfo={description:"",displayName:"NavigationMenuList",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{g.displayName="NavigationMenuItem",g.__docgenInfo={description:"",displayName:"NavigationMenuItem",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{T.displayName="NavigationMenuContent",T.__docgenInfo={description:"",displayName:"NavigationMenuContent",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{I.displayName="NavigationMenuTrigger",I.__docgenInfo={description:"",displayName:"NavigationMenuTrigger",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{o.displayName="NavigationMenuLink",o.__docgenInfo={description:"",displayName:"NavigationMenuLink",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{ge.displayName="NavigationMenuIndicator",ge.__docgenInfo={description:"",displayName:"NavigationMenuIndicator",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{te.displayName="NavigationMenuViewport",te.__docgenInfo={description:"",displayName:"NavigationMenuViewport",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}const ga={title:"Tier 1: Primitives/shadcn/NavigationMenu",component:E,parameters:{layout:"centered",docs:{description:{component:"A collection of links for navigating websites, with dropdown panels for additional navigation options."}}},tags:["autodocs"],decorators:[n=>e.jsx("div",{className:"w-full min-h-[400px] flex items-start justify-center pt-8",children:e.jsx(n,{})})]},G={render:()=>e.jsx(E,{children:e.jsxs(P,{children:[e.jsx(g,{children:e.jsx(o,{href:"/",className:M(),children:"Home"})}),e.jsx(g,{children:e.jsx(o,{href:"/about",className:M(),children:"About"})}),e.jsx(g,{children:e.jsx(o,{href:"/contact",className:M(),children:"Contact"})})]})})},U={render:()=>e.jsx(E,{children:e.jsxs(P,{children:[e.jsxs(g,{children:[e.jsx(I,{children:"Getting Started"}),e.jsx(T,{children:e.jsxs("ul",{className:"grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]",children:[e.jsx("li",{className:"row-span-3",children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md",href:"/",children:[e.jsx(_n,{className:"h-6 w-6"}),e.jsx("div",{className:"mb-2 mt-4 text-lg font-medium",children:"Ozean Licht Ecosystem"}),e.jsx("p",{className:"text-sm leading-tight text-muted-foreground",children:"Educational and content platforms for Austrian associations."})]})})}),e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",href:"/docs",children:[e.jsx("div",{className:"text-sm font-medium leading-none",children:"Introduction"}),e.jsx("p",{className:"line-clamp-2 text-sm leading-snug text-muted-foreground",children:"Learn about the platform and its features."})]})})}),e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",href:"/installation",children:[e.jsx("div",{className:"text-sm font-medium leading-none",children:"Installation"}),e.jsx("p",{className:"line-clamp-2 text-sm leading-snug text-muted-foreground",children:"Set up your development environment."})]})})}),e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",href:"/tutorials",children:[e.jsx("div",{className:"text-sm font-medium leading-none",children:"Tutorials"}),e.jsx("p",{className:"line-clamp-2 text-sm leading-snug text-muted-foreground",children:"Step-by-step guides to get you started."})]})})})]})})]}),e.jsxs(g,{children:[e.jsx(I,{children:"Components"}),e.jsx(T,{children:e.jsxs("ul",{className:"grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]",children:[e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",href:"/components/primitives",children:[e.jsx("div",{className:"text-sm font-medium leading-none",children:"Primitives"}),e.jsx("p",{className:"line-clamp-2 text-sm leading-snug text-muted-foreground",children:"Low-level UI components built on Radix UI."})]})})}),e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",href:"/components/compositions",children:[e.jsx("div",{className:"text-sm font-medium leading-none",children:"Compositions"}),e.jsx("p",{className:"line-clamp-2 text-sm leading-snug text-muted-foreground",children:"Complex components built from primitives."})]})})}),e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",href:"/components/forms",children:[e.jsx("div",{className:"text-sm font-medium leading-none",children:"Forms"}),e.jsx("p",{className:"line-clamp-2 text-sm leading-snug text-muted-foreground",children:"Form components with validation."})]})})}),e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",href:"/components/layouts",children:[e.jsx("div",{className:"text-sm font-medium leading-none",children:"Layouts"}),e.jsx("p",{className:"line-clamp-2 text-sm leading-snug text-muted-foreground",children:"Page layout templates and structures."})]})})})]})})]}),e.jsx(g,{children:e.jsx(o,{href:"/documentation",className:M(),children:"Documentation"})})]})})},W={render:()=>e.jsx(E,{children:e.jsxs(P,{children:[e.jsxs(g,{children:[e.jsxs(I,{children:[e.jsx(ut,{className:"mr-2 h-4 w-4"}),"Resources"]}),e.jsx(T,{children:e.jsxs("ul",{className:"grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2",children:[e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",href:"/docs",children:[e.jsx(pe,{className:"h-6 w-6 shrink-0"}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("div",{className:"text-sm font-medium leading-none",children:"Documentation"}),e.jsx("p",{className:"text-sm leading-snug text-muted-foreground",children:"Complete guides and API references."})]})]})})}),e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",href:"/components",children:[e.jsx(Nt,{className:"h-6 w-6 shrink-0"}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("div",{className:"text-sm font-medium leading-none",children:"Components"}),e.jsx("p",{className:"text-sm leading-snug text-muted-foreground",children:"Browse our component library."})]})]})})}),e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",href:"/design",children:[e.jsx(mt,{className:"h-6 w-6 shrink-0"}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("div",{className:"text-sm font-medium leading-none",children:"Design System"}),e.jsx("p",{className:"text-sm leading-snug text-muted-foreground",children:"Colors, typography, and design tokens."})]})]})})}),e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",href:"/examples",children:[e.jsx(In,{className:"h-6 w-6 shrink-0"}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("div",{className:"text-sm font-medium leading-none",children:"Examples"}),e.jsx("p",{className:"text-sm leading-snug text-muted-foreground",children:"Real-world examples and patterns."})]})]})})})]})})]}),e.jsxs(g,{children:[e.jsxs(I,{children:[e.jsx(re,{className:"mr-2 h-4 w-4"}),"Company"]}),e.jsx(T,{children:e.jsxs("ul",{className:"grid w-[400px] gap-3 p-4",children:[e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",href:"/about",children:[e.jsx(Tn,{className:"h-6 w-6 shrink-0"}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("div",{className:"text-sm font-medium leading-none",children:"About Us"}),e.jsx("p",{className:"text-sm leading-snug text-muted-foreground",children:"Learn about our mission and values."})]})]})})}),e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",href:"/team",children:[e.jsx(re,{className:"h-6 w-6 shrink-0"}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("div",{className:"text-sm font-medium leading-none",children:"Team"}),e.jsx("p",{className:"text-sm leading-snug text-muted-foreground",children:"Meet the people behind the platform."})]})]})})}),e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",href:"/contact",children:[e.jsx(ht,{className:"h-6 w-6 shrink-0"}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("div",{className:"text-sm font-medium leading-none",children:"Contact"}),e.jsx("p",{className:"text-sm leading-snug text-muted-foreground",children:"Get in touch with our team."})]})]})})})]})})]}),e.jsx(g,{children:e.jsx(o,{href:"/blog",className:M(),children:"Blog"})})]})})},H={render:()=>e.jsx(E,{children:e.jsxs(P,{children:[e.jsxs(g,{children:[e.jsx(I,{children:"Products"}),e.jsx(T,{children:e.jsxs("div",{className:"w-[600px] p-4",children:[e.jsxs("div",{className:"grid gap-4 md:grid-cols-2",children:[e.jsxs("div",{className:"space-y-3",children:[e.jsx("h3",{className:"text-sm font-semibold",children:"For Developers"}),e.jsxs("ul",{className:"space-y-2",children:[e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground",href:"/products/api",children:[e.jsx("div",{className:"font-medium",children:"API Platform"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"RESTful and GraphQL APIs"})]})})}),e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground",href:"/products/sdk",children:[e.jsx("div",{className:"font-medium",children:"SDK Libraries"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"JavaScript, Python, and more"})]})})}),e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground",href:"/products/cli",children:[e.jsx("div",{className:"font-medium",children:"CLI Tools"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Command-line interface"})]})})})]})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsx("h3",{className:"text-sm font-semibold",children:"For Businesses"}),e.jsxs("ul",{className:"space-y-2",children:[e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground",href:"/products/enterprise",children:[e.jsx("div",{className:"font-medium",children:"Enterprise Edition"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Advanced features and SLAs"})]})})}),e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground",href:"/products/consulting",children:[e.jsx("div",{className:"font-medium",children:"Consulting"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Expert guidance and support"})]})})}),e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground",href:"/products/training",children:[e.jsx("div",{className:"font-medium",children:"Training"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Workshops and certifications"})]})})})]})]})]}),e.jsx("div",{className:"mt-4 border-t pt-4",children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"flex items-center justify-between rounded-md bg-muted p-3 text-sm hover:bg-accent hover:text-accent-foreground",href:"/products/all",children:[e.jsx("span",{className:"font-medium",children:"View all products"}),e.jsx(gt,{className:"h-4 w-4"})]})})})]})})]}),e.jsxs(g,{children:[e.jsx(I,{children:"Solutions"}),e.jsx(T,{children:e.jsxs("ul",{className:"grid w-[400px] gap-3 p-4",children:[e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",href:"/solutions/education",children:[e.jsx("div",{className:"text-sm font-medium",children:"Education"}),e.jsx("p",{className:"line-clamp-2 text-sm leading-snug text-muted-foreground",children:"Tools for educational institutions."})]})})}),e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",href:"/solutions/nonprofit",children:[e.jsx("div",{className:"text-sm font-medium",children:"Non-Profit"}),e.jsx("p",{className:"line-clamp-2 text-sm leading-snug text-muted-foreground",children:"Solutions for non-profit organizations."})]})})}),e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",href:"/solutions/enterprise",children:[e.jsx("div",{className:"text-sm font-medium",children:"Enterprise"}),e.jsx("p",{className:"line-clamp-2 text-sm leading-snug text-muted-foreground",children:"Scalable solutions for large organizations."})]})})})]})})]}),e.jsx(g,{children:e.jsx(o,{href:"/pricing",className:M(),children:"Pricing"})}),e.jsx(g,{children:e.jsx(o,{href:"/support",className:M(),children:"Support"})})]})})},$={render:()=>e.jsx(E,{children:e.jsxs(P,{children:[e.jsx(g,{children:e.jsx(o,{href:"/",className:M(),children:e.jsx("span",{className:"font-semibold text-[#0ec2bc]",children:"Home"})})}),e.jsxs(g,{children:[e.jsx(I,{className:"data-[state=open]:text-[#0ec2bc]",children:"Platforms"}),e.jsx(T,{children:e.jsxs("ul",{className:"grid w-[400px] gap-3 p-4",children:[e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-[#0ec2bc] focus:bg-accent focus:text-[#0ec2bc]",href:"/kids-ascension",children:[e.jsx("div",{className:"text-sm font-medium",children:"Kids Ascension"}),e.jsx("p",{className:"line-clamp-2 text-sm leading-snug text-muted-foreground",children:"Educational platform for children and families."})]})})}),e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-[#0ec2bc] focus:bg-accent focus:text-[#0ec2bc]",href:"/ozean-licht",children:[e.jsx("div",{className:"text-sm font-medium",children:"Ozean Licht"}),e.jsx("p",{className:"line-clamp-2 text-sm leading-snug text-muted-foreground",children:"Content and community platform."})]})})})]})})]}),e.jsxs(g,{children:[e.jsx(I,{className:"data-[state=open]:text-[#0ec2bc]",children:"Resources"}),e.jsx(T,{children:e.jsxs("ul",{className:"grid w-[400px] gap-3 p-4 md:grid-cols-2",children:[e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-[#0ec2bc] focus:bg-accent focus:text-[#0ec2bc]",href:"/docs",children:[e.jsx(pe,{className:"mb-2 h-5 w-5 text-[#0ec2bc]"}),e.jsx("div",{className:"text-sm font-medium",children:"Documentation"}),e.jsx("p",{className:"text-xs leading-snug text-muted-foreground",children:"Complete guides and references."})]})})}),e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-[#0ec2bc] focus:bg-accent focus:text-[#0ec2bc]",href:"/blog",children:[e.jsx(In,{className:"mb-2 h-5 w-5 text-[#0ec2bc]"}),e.jsx("div",{className:"text-sm font-medium",children:"Blog"}),e.jsx("p",{className:"text-xs leading-snug text-muted-foreground",children:"Latest news and updates."})]})})})]})})]}),e.jsx(g,{children:e.jsx(o,{href:"/contact",className:M(),children:"Contact"})})]})})},q={render:()=>e.jsx(E,{orientation:"vertical",className:"max-w-none",children:e.jsxs(P,{className:"flex-col space-x-0 space-y-1",children:[e.jsx(g,{className:"w-full",children:e.jsxs(o,{href:"/",className:M()+" w-full justify-start",children:[e.jsx(pe,{className:"mr-2 h-4 w-4"}),"Dashboard"]})}),e.jsxs(g,{className:"w-full",children:[e.jsxs(I,{className:"w-full justify-start",children:[e.jsx(re,{className:"mr-2 h-4 w-4"}),"Team"]}),e.jsx(T,{children:e.jsxs("ul",{className:"w-[200px] p-2",children:[e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsx("a",{className:"block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground",href:"/team/members",children:"Members"})})}),e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsx("a",{className:"block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground",href:"/team/roles",children:"Roles"})})}),e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsx("a",{className:"block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground",href:"/team/permissions",children:"Permissions"})})})]})})]}),e.jsx(g,{className:"w-full",children:e.jsxs(o,{href:"/projects",className:M()+" w-full justify-start",children:[e.jsx(Tn,{className:"mr-2 h-4 w-4"}),"Projects"]})}),e.jsx(g,{className:"w-full",children:e.jsxs(o,{href:"/settings",className:M()+" w-full justify-start",children:[e.jsx(pt,{className:"mr-2 h-4 w-4"}),"Settings"]})})]})})},Y={render:()=>e.jsx(E,{children:e.jsxs(P,{children:[e.jsx(g,{children:e.jsx(o,{href:"/",className:M(),children:"Home"})}),e.jsx(g,{children:e.jsx(o,{href:"/features",className:M(),children:"Features"})}),e.jsx(g,{children:e.jsx(o,{href:"/pricing",className:M(),children:"Pricing"})}),e.jsx(g,{children:e.jsx(o,{href:"/about",className:M(),children:"About"})})]})})},J={render:()=>e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(E,{children:e.jsxs(P,{children:[e.jsx(g,{children:e.jsx(o,{href:"/",className:M(),children:"Home"})}),e.jsxs(g,{children:[e.jsx(I,{children:"Products"}),e.jsx(T,{children:e.jsxs("ul",{className:"grid w-[300px] gap-3 p-4",children:[e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground",href:"/products/pro",children:[e.jsx("div",{className:"text-sm font-medium",children:"Professional"}),e.jsx("p",{className:"text-xs leading-snug text-muted-foreground",children:"For professional teams."})]})})}),e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground",href:"/products/enterprise",children:[e.jsx("div",{className:"text-sm font-medium",children:"Enterprise"}),e.jsx("p",{className:"text-xs leading-snug text-muted-foreground",children:"For large organizations."})]})})})]})})]}),e.jsx(g,{children:e.jsx(o,{href:"/docs",className:M(),children:"Docs"})})]})}),e.jsx(se,{variant:"cta",size:"sm",children:"Get Started"})]})},Q={render:()=>e.jsx(E,{children:e.jsxs(P,{"data-testid":"nav-list",children:[e.jsxs(g,{children:[e.jsx(I,{"data-testid":"products-trigger",children:"Products"}),e.jsx(T,{"data-testid":"products-content",children:e.jsxs("ul",{className:"grid w-[300px] gap-3 p-4",children:[e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsx("a",{className:"block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent",href:"/product-a","data-testid":"product-a-link",children:"Product A"})})}),e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsx("a",{className:"block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent",href:"/product-b","data-testid":"product-b-link",children:"Product B"})})})]})})]}),e.jsx(g,{children:e.jsx(o,{href:"/about",className:M(),"data-testid":"about-link",children:"About"})})]})}),play:async({canvasElement:n})=>{const t=je(n),a=je(document.body),s=t.getByTestId("products-trigger");await we.click(s),await new Promise(m=>setTimeout(m,300));const i=a.getByTestId("products-content");await ke(i).toBeInTheDocument();const c=a.getByTestId("product-a-link");await ke(c).toBeInTheDocument();const l=t.getByTestId("about-link");await we.click(l),await new Promise(m=>setTimeout(m,300))}},X={render:()=>e.jsxs("div",{className:"flex w-full items-center justify-between border-b px-6 py-3",children:[e.jsxs("div",{className:"flex items-center gap-6",children:[e.jsx("div",{className:"font-bold text-[#0ec2bc]",children:"Ozean Licht"}),e.jsx(E,{children:e.jsxs(P,{children:[e.jsxs(g,{children:[e.jsx(I,{className:"data-[state=open]:text-[#0ec2bc]",children:"Getting Started"}),e.jsx(T,{children:e.jsxs("ul",{className:"grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]",children:[e.jsx("li",{className:"row-span-3",children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-[#0ec2bc]/20 to-[#0ec2bc]/10 p-6 no-underline outline-none focus:shadow-md",href:"/",children:[e.jsx(_n,{className:"h-6 w-6 text-[#0ec2bc]"}),e.jsx("div",{className:"mb-2 mt-4 text-lg font-medium",children:"Ozean Licht"}),e.jsx("p",{className:"text-sm leading-tight text-muted-foreground",children:"Educational platforms for Austrian associations."})]})})}),e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-[#0ec2bc] focus:bg-accent",href:"/intro",children:[e.jsx("div",{className:"text-sm font-medium leading-none",children:"Introduction"}),e.jsx("p",{className:"line-clamp-2 text-sm leading-snug text-muted-foreground",children:"Learn about our mission and platforms."})]})})}),e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-[#0ec2bc] focus:bg-accent",href:"/setup",children:[e.jsx("div",{className:"text-sm font-medium leading-none",children:"Setup Guide"}),e.jsx("p",{className:"line-clamp-2 text-sm leading-snug text-muted-foreground",children:"Get started with your account."})]})})}),e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-[#0ec2bc] focus:bg-accent",href:"/tutorials",children:[e.jsx("div",{className:"text-sm font-medium leading-none",children:"Tutorials"}),e.jsx("p",{className:"line-clamp-2 text-sm leading-snug text-muted-foreground",children:"Step-by-step learning resources."})]})})})]})})]}),e.jsxs(g,{children:[e.jsx(I,{className:"data-[state=open]:text-[#0ec2bc]",children:"Platforms"}),e.jsx(T,{children:e.jsxs("ul",{className:"grid w-[300px] gap-3 p-4",children:[e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-[#0ec2bc] focus:bg-accent",href:"/kids-ascension",children:[e.jsx("div",{className:"text-sm font-medium",children:"Kids Ascension"}),e.jsx("p",{className:"text-xs leading-snug text-muted-foreground",children:"Educational content for children."})]})})}),e.jsx("li",{children:e.jsx(o,{asChild:!0,children:e.jsxs("a",{className:"block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-[#0ec2bc] focus:bg-accent",href:"/ozean-licht",children:[e.jsx("div",{className:"text-sm font-medium",children:"Ozean Licht Platform"}),e.jsx("p",{className:"text-xs leading-snug text-muted-foreground",children:"Community and content hub."})]})})})]})})]}),e.jsx(g,{children:e.jsx(o,{href:"/docs",className:M(),children:"Documentation"})})]})})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(se,{variant:"outline",size:"sm",children:"Sign In"}),e.jsx(se,{variant:"cta",size:"sm",children:"Get Started"})]})]})};var Ie,Te,_e,Ee,Pe;G.parameters={...G.parameters,docs:{...(Ie=G.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  render: () => <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/about" className={navigationMenuTriggerStyle()}>
            About
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/contact" className={navigationMenuTriggerStyle()}>
            Contact
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
}`,...(_e=(Te=G.parameters)==null?void 0:Te.docs)==null?void 0:_e.source},description:{story:"Default navigation menu with simple links",...(Pe=(Ee=G.parameters)==null?void 0:Ee.docs)==null?void 0:Pe.description}}};var Re,Se,Ae,De,Fe;U.parameters={...U.parameters,docs:{...(Re=U.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  render: () => <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md" href="/">
                    <Layers className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Ozean Licht Ecosystem
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Educational and content platforms for Austrian associations.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" href="/docs">
                    <div className="text-sm font-medium leading-none">Introduction</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Learn about the platform and its features.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" href="/installation">
                    <div className="text-sm font-medium leading-none">Installation</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Set up your development environment.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" href="/tutorials">
                    <div className="text-sm font-medium leading-none">Tutorials</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Step-by-step guides to get you started.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li>
                <NavigationMenuLink asChild>
                  <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" href="/components/primitives">
                    <div className="text-sm font-medium leading-none">Primitives</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Low-level UI components built on Radix UI.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" href="/components/compositions">
                    <div className="text-sm font-medium leading-none">Compositions</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Complex components built from primitives.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" href="/components/forms">
                    <div className="text-sm font-medium leading-none">Forms</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Form components with validation.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" href="/components/layouts">
                    <div className="text-sm font-medium leading-none">Layouts</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Page layout templates and structures.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/documentation" className={navigationMenuTriggerStyle()}>
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
}`,...(Ae=(Se=U.parameters)==null?void 0:Se.docs)==null?void 0:Ae.source},description:{story:"Navigation menu with dropdown panels",...(Fe=(De=U.parameters)==null?void 0:De.docs)==null?void 0:Fe.description}}};var Oe,ze,Be,Ve,Ke;W.parameters={...W.parameters,docs:{...(Oe=W.parameters)==null?void 0:Oe.docs,source:{originalSource:`{
  render: () => <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Code className="mr-2 h-4 w-4" />
            Resources
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
              <li>
                <NavigationMenuLink asChild>
                  <a className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" href="/docs">
                    <FileText className="h-6 w-6 shrink-0" />
                    <div className="space-y-1">
                      <div className="text-sm font-medium leading-none">Documentation</div>
                      <p className="text-sm leading-snug text-muted-foreground">
                        Complete guides and API references.
                      </p>
                    </div>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" href="/components">
                    <Package className="h-6 w-6 shrink-0" />
                    <div className="space-y-1">
                      <div className="text-sm font-medium leading-none">Components</div>
                      <p className="text-sm leading-snug text-muted-foreground">
                        Browse our component library.
                      </p>
                    </div>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" href="/design">
                    <Palette className="h-6 w-6 shrink-0" />
                    <div className="space-y-1">
                      <div className="text-sm font-medium leading-none">Design System</div>
                      <p className="text-sm leading-snug text-muted-foreground">
                        Colors, typography, and design tokens.
                      </p>
                    </div>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" href="/examples">
                    <BookOpen className="h-6 w-6 shrink-0" />
                    <div className="space-y-1">
                      <div className="text-sm font-medium leading-none">Examples</div>
                      <p className="text-sm leading-snug text-muted-foreground">
                        Real-world examples and patterns.
                      </p>
                    </div>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Users className="mr-2 h-4 w-4" />
            Company
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4">
              <li>
                <NavigationMenuLink asChild>
                  <a className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" href="/about">
                    <Briefcase className="h-6 w-6 shrink-0" />
                    <div className="space-y-1">
                      <div className="text-sm font-medium leading-none">About Us</div>
                      <p className="text-sm leading-snug text-muted-foreground">
                        Learn about our mission and values.
                      </p>
                    </div>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" href="/team">
                    <Users className="h-6 w-6 shrink-0" />
                    <div className="space-y-1">
                      <div className="text-sm font-medium leading-none">Team</div>
                      <p className="text-sm leading-snug text-muted-foreground">
                        Meet the people behind the platform.
                      </p>
                    </div>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" href="/contact">
                    <Mail className="h-6 w-6 shrink-0" />
                    <div className="space-y-1">
                      <div className="text-sm font-medium leading-none">Contact</div>
                      <p className="text-sm leading-snug text-muted-foreground">
                        Get in touch with our team.
                      </p>
                    </div>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/blog" className={navigationMenuTriggerStyle()}>
            Blog
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
}`,...(Be=(ze=W.parameters)==null?void 0:ze.docs)==null?void 0:Be.source},description:{story:"Navigation menu with icons in dropdown",...(Ke=(Ve=W.parameters)==null?void 0:Ve.docs)==null?void 0:Ke.description}}};var Ge,Ue,We,He,$e;H.parameters={...H.parameters,docs:{...(Ge=H.parameters)==null?void 0:Ge.docs,source:{originalSource:`{
  render: () => <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[600px] p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">For Developers</h3>
                  <ul className="space-y-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <a className="block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground" href="/products/api">
                          <div className="font-medium">API Platform</div>
                          <p className="text-xs text-muted-foreground">
                            RESTful and GraphQL APIs
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a className="block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground" href="/products/sdk">
                          <div className="font-medium">SDK Libraries</div>
                          <p className="text-xs text-muted-foreground">
                            JavaScript, Python, and more
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a className="block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground" href="/products/cli">
                          <div className="font-medium">CLI Tools</div>
                          <p className="text-xs text-muted-foreground">
                            Command-line interface
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">For Businesses</h3>
                  <ul className="space-y-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <a className="block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground" href="/products/enterprise">
                          <div className="font-medium">Enterprise Edition</div>
                          <p className="text-xs text-muted-foreground">
                            Advanced features and SLAs
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a className="block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground" href="/products/consulting">
                          <div className="font-medium">Consulting</div>
                          <p className="text-xs text-muted-foreground">
                            Expert guidance and support
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a className="block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground" href="/products/training">
                          <div className="font-medium">Training</div>
                          <p className="text-xs text-muted-foreground">
                            Workshops and certifications
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 border-t pt-4">
                <NavigationMenuLink asChild>
                  <a className="flex items-center justify-between rounded-md bg-muted p-3 text-sm hover:bg-accent hover:text-accent-foreground" href="/products/all">
                    <span className="font-medium">View all products</span>
                    <Globe className="h-4 w-4" />
                  </a>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4">
              <li>
                <NavigationMenuLink asChild>
                  <a className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" href="/solutions/education">
                    <div className="text-sm font-medium">Education</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Tools for educational institutions.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" href="/solutions/nonprofit">
                    <div className="text-sm font-medium">Non-Profit</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Solutions for non-profit organizations.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" href="/solutions/enterprise">
                    <div className="text-sm font-medium">Enterprise</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Scalable solutions for large organizations.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/pricing" className={navigationMenuTriggerStyle()}>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/support" className={navigationMenuTriggerStyle()}>
            Support
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
}`,...(We=(Ue=H.parameters)==null?void 0:Ue.docs)==null?void 0:We.source},description:{story:"Complex navigation with mixed content types",...($e=(He=H.parameters)==null?void 0:He.docs)==null?void 0:$e.description}}};var qe,Ye,Je,Qe,Xe;$.parameters={...$.parameters,docs:{...(qe=$.parameters)==null?void 0:qe.docs,source:{originalSource:`{
  render: () => <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
            <span className="font-semibold text-[#0ec2bc]">Home</span>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="data-[state=open]:text-[#0ec2bc]">
            Platforms
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4">
              <li>
                <NavigationMenuLink asChild>
                  <a className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-[#0ec2bc] focus:bg-accent focus:text-[#0ec2bc]" href="/kids-ascension">
                    <div className="text-sm font-medium">Kids Ascension</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Educational platform for children and families.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-[#0ec2bc] focus:bg-accent focus:text-[#0ec2bc]" href="/ozean-licht">
                    <div className="text-sm font-medium">Ozean Licht</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Content and community platform.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="data-[state=open]:text-[#0ec2bc]">
            Resources
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
              <li>
                <NavigationMenuLink asChild>
                  <a className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-[#0ec2bc] focus:bg-accent focus:text-[#0ec2bc]" href="/docs">
                    <FileText className="mb-2 h-5 w-5 text-[#0ec2bc]" />
                    <div className="text-sm font-medium">Documentation</div>
                    <p className="text-xs leading-snug text-muted-foreground">
                      Complete guides and references.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-[#0ec2bc] focus:bg-accent focus:text-[#0ec2bc]" href="/blog">
                    <BookOpen className="mb-2 h-5 w-5 text-[#0ec2bc]" />
                    <div className="text-sm font-medium">Blog</div>
                    <p className="text-xs leading-snug text-muted-foreground">
                      Latest news and updates.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/contact" className={navigationMenuTriggerStyle()}>
            Contact
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
}`,...(Je=(Ye=$.parameters)==null?void 0:Ye.docs)==null?void 0:Je.source},description:{story:"Ozean Licht branded navigation",...(Xe=(Qe=$.parameters)==null?void 0:Qe.docs)==null?void 0:Xe.description}}};var Ze,en,nn,tn,an;q.parameters={...q.parameters,docs:{...(Ze=q.parameters)==null?void 0:Ze.docs,source:{originalSource:`{
  render: () => <NavigationMenu orientation="vertical" className="max-w-none">
      <NavigationMenuList className="flex-col space-x-0 space-y-1">
        <NavigationMenuItem className="w-full">
          <NavigationMenuLink href="/" className={navigationMenuTriggerStyle() + " w-full justify-start"}>
            <FileText className="mr-2 h-4 w-4" />
            Dashboard
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="w-full">
          <NavigationMenuTrigger className="w-full justify-start">
            <Users className="mr-2 h-4 w-4" />
            Team
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-[200px] p-2">
              <li>
                <NavigationMenuLink asChild>
                  <a className="block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground" href="/team/members">
                    Members
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a className="block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground" href="/team/roles">
                    Roles
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a className="block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground" href="/team/permissions">
                    Permissions
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="w-full">
          <NavigationMenuLink href="/projects" className={navigationMenuTriggerStyle() + " w-full justify-start"}>
            <Briefcase className="mr-2 h-4 w-4" />
            Projects
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="w-full">
          <NavigationMenuLink href="/settings" className={navigationMenuTriggerStyle() + " w-full justify-start"}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
}`,...(nn=(en=q.parameters)==null?void 0:en.docs)==null?void 0:nn.source},description:{story:"Vertical navigation menu",...(an=(tn=q.parameters)==null?void 0:tn.docs)==null?void 0:an.description}}};var on,sn,rn,cn,ln;Y.parameters={...Y.parameters,docs:{...(on=Y.parameters)==null?void 0:on.docs,source:{originalSource:`{
  render: () => <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/features" className={navigationMenuTriggerStyle()}>
            Features
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/pricing" className={navigationMenuTriggerStyle()}>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/about" className={navigationMenuTriggerStyle()}>
            About
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
}`,...(rn=(sn=Y.parameters)==null?void 0:sn.docs)==null?void 0:rn.source},description:{story:"Minimal navigation with just text links",...(ln=(cn=Y.parameters)==null?void 0:cn.docs)==null?void 0:ln.description}}};var dn,un,mn,gn,hn;J.parameters={...J.parameters,docs:{...(dn=J.parameters)==null?void 0:dn.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[300px] gap-3 p-4">
                <li>
                  <NavigationMenuLink asChild>
                    <a className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground" href="/products/pro">
                      <div className="text-sm font-medium">Professional</div>
                      <p className="text-xs leading-snug text-muted-foreground">
                        For professional teams.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <a className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground" href="/products/enterprise">
                      <div className="text-sm font-medium">Enterprise</div>
                      <p className="text-xs leading-snug text-muted-foreground">
                        For large organizations.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/docs" className={navigationMenuTriggerStyle()}>
              Docs
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Button variant="cta" size="sm">
        Get Started
      </Button>
    </div>
}`,...(mn=(un=J.parameters)==null?void 0:un.docs)==null?void 0:mn.source},description:{story:"Navigation with call-to-action button",...(hn=(gn=J.parameters)==null?void 0:gn.docs)==null?void 0:hn.description}}};var pn,xn,vn,fn,Nn;Q.parameters={...Q.parameters,docs:{...(pn=Q.parameters)==null?void 0:pn.docs,source:{originalSource:`{
  render: () => <NavigationMenu>
      <NavigationMenuList data-testid="nav-list">
        <NavigationMenuItem>
          <NavigationMenuTrigger data-testid="products-trigger">
            Products
          </NavigationMenuTrigger>
          <NavigationMenuContent data-testid="products-content">
            <ul className="grid w-[300px] gap-3 p-4">
              <li>
                <NavigationMenuLink asChild>
                  <a className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent" href="/product-a" data-testid="product-a-link">
                    Product A
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent" href="/product-b" data-testid="product-b-link">
                    Product B
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/about" className={navigationMenuTriggerStyle()} data-testid="about-link">
            About
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    // Get the trigger button
    const productsTrigger = canvas.getByTestId('products-trigger');

    // Click to open the menu
    await userEvent.click(productsTrigger);

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 300));

    // Content should be visible
    const productsContent = body.getByTestId('products-content');
    await expect(productsContent).toBeInTheDocument();

    // Products should be accessible
    const productALink = body.getByTestId('product-a-link');
    await expect(productALink).toBeInTheDocument();

    // Click outside to close (click on About link)
    const aboutLink = canvas.getByTestId('about-link');
    await userEvent.click(aboutLink);

    // Wait for close animation
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}`,...(vn=(xn=Q.parameters)==null?void 0:xn.docs)==null?void 0:vn.source},description:{story:`Interactive test with play function
Tests navigation menu interactions and keyboard navigation`,...(Nn=(fn=Q.parameters)==null?void 0:fn.docs)==null?void 0:Nn.description}}};var bn,Mn,jn,wn,kn;X.parameters={...X.parameters,docs:{...(bn=X.parameters)==null?void 0:bn.docs,source:{originalSource:`{
  render: () => <div className="flex w-full items-center justify-between border-b px-6 py-3">
      <div className="flex items-center gap-6">
        <div className="font-bold text-[#0ec2bc]">Ozean Licht</div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="data-[state=open]:text-[#0ec2bc]">
                Getting Started
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-[#0ec2bc]/20 to-[#0ec2bc]/10 p-6 no-underline outline-none focus:shadow-md" href="/">
                        <Layers className="h-6 w-6 text-[#0ec2bc]" />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Ozean Licht
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Educational platforms for Austrian associations.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-[#0ec2bc] focus:bg-accent" href="/intro">
                        <div className="text-sm font-medium leading-none">Introduction</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Learn about our mission and platforms.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-[#0ec2bc] focus:bg-accent" href="/setup">
                        <div className="text-sm font-medium leading-none">Setup Guide</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Get started with your account.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-[#0ec2bc] focus:bg-accent" href="/tutorials">
                        <div className="text-sm font-medium leading-none">Tutorials</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Step-by-step learning resources.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="data-[state=open]:text-[#0ec2bc]">
                Platforms
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-3 p-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <a className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-[#0ec2bc] focus:bg-accent" href="/kids-ascension">
                        <div className="text-sm font-medium">Kids Ascension</div>
                        <p className="text-xs leading-snug text-muted-foreground">
                          Educational content for children.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-[#0ec2bc] focus:bg-accent" href="/ozean-licht">
                        <div className="text-sm font-medium">Ozean Licht Platform</div>
                        <p className="text-xs leading-snug text-muted-foreground">
                          Community and content hub.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/docs" className={navigationMenuTriggerStyle()}>
                Documentation
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          Sign In
        </Button>
        <Button variant="cta" size="sm">
          Get Started
        </Button>
      </div>
    </div>
}`,...(jn=(Mn=X.parameters)==null?void 0:Mn.docs)==null?void 0:jn.source},description:{story:"Complete example with all features",...(kn=(wn=X.parameters)==null?void 0:wn.docs)==null?void 0:kn.description}}};const ha=["Default","WithDropdowns","WithIcons","ComplexNavigation","OzeanLichtBranded","VerticalOrientation","Minimal","WithCTAButton","InteractiveTest","CompleteExample"];export{X as CompleteExample,H as ComplexNavigation,G as Default,Q as InteractiveTest,Y as Minimal,$ as OzeanLichtBranded,q as VerticalOrientation,J as WithCTAButton,U as WithDropdowns,W as WithIcons,ha as __namedExportsOrder,ga as default};
