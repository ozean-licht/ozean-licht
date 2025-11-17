import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{r as n}from"./index-B2-qRKKC.js";import{r as ms}from"./index-kS-9iBlu.js";import{a as S,c as fs,P as B,e as hs}from"./index-BiUY2kQP.js";import{u as Wt}from"./index-BFjtS4uE.js";import{c as ws}from"./index-Da_aXk3M.js";import{R as xs,B as vs}from"./index-BVCCCNF7.js";import{P as Ts}from"./index-B7rHuW0e.js";import{P as gs}from"./index-PNzqWif7.js";import{u as fe}from"./index-ciuW_uyV.js";import{u as bs}from"./index-BlCrtW8-.js";import{u as ys}from"./index-D1vk04JX.js";import{V as Yt}from"./index-BO3lQbAq.js";import{c as Cs}from"./index-Dp3B9jqt.js";import{c as F}from"./cn-CKXzwFwe.js";import{X as Ns}from"./x-C2AjwpVd.js";import{B as p}from"./Button-PgnE6Xyj.js";import{C as se,T as Kt}from"./triangle-alert-BvYms6I2.js";import{C as zt}from"./circle-alert-dUHh-VJv.js";import{I as Es}from"./info-C_HoouFQ.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./clsx-B-dksMZM.js";import"./createLucideIcon-BbF4D6Jl.js";import"./button-DhHHw9VN.js";import"./index-BiMR7eR1.js";var Ee="ToastProvider",[Se,Ss,ks]=ws("Toast"),[$t]=fs("Toast",[ks]),[js,we]=$t(Ee),qt=t=>{const{__scopeToast:s,label:o="Notification",duration:r=5e3,swipeDirection:a="right",swipeThreshold:d=50,children:u}=t,[w,x]=n.useState(null),[i,E]=n.useState(0),b=n.useRef(!1),L=n.useRef(!1);return o.trim()||console.error(`Invalid prop \`label\` supplied to \`${Ee}\`. Expected non-empty \`string\`.`),e.jsx(Se.Provider,{scope:s,children:e.jsx(js,{scope:s,label:o,duration:r,swipeDirection:a,swipeThreshold:d,toastCount:i,viewport:w,onViewportChange:x,onToastAdd:n.useCallback(()=>E(D=>D+1),[]),onToastRemove:n.useCallback(()=>E(D=>D-1),[]),isFocusedToastEscapeKeyDownRef:b,isClosePausedRef:L,children:u})})};qt.displayName=Ee;var Ht="ToastViewport",Ds=["F8"],ye="toast.viewportPause",Ce="toast.viewportResume",Xt=n.forwardRef((t,s)=>{const{__scopeToast:o,hotkey:r=Ds,label:a="Notifications ({hotkey})",...d}=t,u=we(Ht,o),w=Ss(o),x=n.useRef(null),i=n.useRef(null),E=n.useRef(null),b=n.useRef(null),L=Wt(s,b,u.onViewportChange),D=r.join("+").replace(/Key/g,"").replace(/Digit/g,""),P=u.toastCount>0;n.useEffect(()=>{const l=y=>{var h;r.length!==0&&r.every(v=>y[v]||y.code===v)&&((h=b.current)==null||h.focus())};return document.addEventListener("keydown",l),()=>document.removeEventListener("keydown",l)},[r]),n.useEffect(()=>{const l=x.current,y=b.current;if(P&&l&&y){const f=()=>{if(!u.isClosePausedRef.current){const C=new CustomEvent(ye);y.dispatchEvent(C),u.isClosePausedRef.current=!0}},h=()=>{if(u.isClosePausedRef.current){const C=new CustomEvent(Ce);y.dispatchEvent(C),u.isClosePausedRef.current=!1}},v=C=>{!l.contains(C.relatedTarget)&&h()},T=()=>{l.contains(document.activeElement)||h()};return l.addEventListener("focusin",f),l.addEventListener("focusout",v),l.addEventListener("pointermove",f),l.addEventListener("pointerleave",T),window.addEventListener("blur",f),window.addEventListener("focus",h),()=>{l.removeEventListener("focusin",f),l.removeEventListener("focusout",v),l.removeEventListener("pointermove",f),l.removeEventListener("pointerleave",T),window.removeEventListener("blur",f),window.removeEventListener("focus",h)}}},[P,u.isClosePausedRef]);const m=n.useCallback(({tabbingDirection:l})=>{const f=w().map(h=>{const v=h.ref.current,T=[v,...Ws(v)];return l==="forwards"?T:T.reverse()});return(l==="forwards"?f.reverse():f).flat()},[w]);return n.useEffect(()=>{const l=b.current;if(l){const y=f=>{var T,C,_;const h=f.altKey||f.ctrlKey||f.metaKey;if(f.key==="Tab"&&!h){const U=document.activeElement,A=f.shiftKey;if(f.target===l&&A){(T=i.current)==null||T.focus();return}const I=m({tabbingDirection:A?"backwards":"forwards"}),ce=I.findIndex(c=>c===U);Te(I.slice(ce+1))?f.preventDefault():A?(C=i.current)==null||C.focus():(_=E.current)==null||_.focus()}};return l.addEventListener("keydown",y),()=>l.removeEventListener("keydown",y)}},[w,m]),e.jsxs(vs,{ref:x,role:"region","aria-label":a.replace("{hotkey}",D),tabIndex:-1,style:{pointerEvents:P?void 0:"none"},children:[P&&e.jsx(Ne,{ref:i,onFocusFromOutsideViewport:()=>{const l=m({tabbingDirection:"forwards"});Te(l)}}),e.jsx(Se.Slot,{scope:o,children:e.jsx(B.ol,{tabIndex:-1,...d,ref:L})}),P&&e.jsx(Ne,{ref:E,onFocusFromOutsideViewport:()=>{const l=m({tabbingDirection:"backwards"});Te(l)}})]})});Xt.displayName=Ht;var Gt="ToastFocusProxy",Ne=n.forwardRef((t,s)=>{const{__scopeToast:o,onFocusFromOutsideViewport:r,...a}=t,d=we(Gt,o);return e.jsx(Yt,{tabIndex:0,...a,ref:s,style:{position:"fixed"},onFocus:u=>{var i;const w=u.relatedTarget;!((i=d.viewport)!=null&&i.contains(w))&&r()}})});Ne.displayName=Gt;var ie="Toast",Ps="toast.swipeStart",_s="toast.swipeMove",Is="toast.swipeCancel",As="toast.swipeEnd",Qt=n.forwardRef((t,s)=>{const{forceMount:o,open:r,defaultOpen:a,onOpenChange:d,...u}=t,[w,x]=bs({prop:r,defaultProp:a??!0,onChange:d,caller:ie});return e.jsx(gs,{present:o||w,children:e.jsx(Bs,{open:w,...u,ref:s,onClose:()=>x(!1),onPause:fe(t.onPause),onResume:fe(t.onResume),onSwipeStart:S(t.onSwipeStart,i=>{i.currentTarget.setAttribute("data-swipe","start")}),onSwipeMove:S(t.onSwipeMove,i=>{const{x:E,y:b}=i.detail.delta;i.currentTarget.setAttribute("data-swipe","move"),i.currentTarget.style.setProperty("--radix-toast-swipe-move-x",`${E}px`),i.currentTarget.style.setProperty("--radix-toast-swipe-move-y",`${b}px`)}),onSwipeCancel:S(t.onSwipeCancel,i=>{i.currentTarget.setAttribute("data-swipe","cancel"),i.currentTarget.style.removeProperty("--radix-toast-swipe-move-x"),i.currentTarget.style.removeProperty("--radix-toast-swipe-move-y"),i.currentTarget.style.removeProperty("--radix-toast-swipe-end-x"),i.currentTarget.style.removeProperty("--radix-toast-swipe-end-y")}),onSwipeEnd:S(t.onSwipeEnd,i=>{const{x:E,y:b}=i.detail.delta;i.currentTarget.setAttribute("data-swipe","end"),i.currentTarget.style.removeProperty("--radix-toast-swipe-move-x"),i.currentTarget.style.removeProperty("--radix-toast-swipe-move-y"),i.currentTarget.style.setProperty("--radix-toast-swipe-end-x",`${E}px`),i.currentTarget.style.setProperty("--radix-toast-swipe-end-y",`${b}px`),x(!1)})})})});Qt.displayName=ie;var[Rs,Os]=$t(ie,{onClose(){}}),Bs=n.forwardRef((t,s)=>{const{__scopeToast:o,type:r="foreground",duration:a,open:d,onClose:u,onEscapeKeyDown:w,onPause:x,onResume:i,onSwipeStart:E,onSwipeMove:b,onSwipeCancel:L,onSwipeEnd:D,...P}=t,m=we(ie,o),[l,y]=n.useState(null),f=Wt(s,c=>y(c)),h=n.useRef(null),v=n.useRef(null),T=a||m.duration,C=n.useRef(0),_=n.useRef(T),U=n.useRef(0),{onToastAdd:A,onToastRemove:xe}=m,R=fe(()=>{var N;(l==null?void 0:l.contains(document.activeElement))&&((N=m.viewport)==null||N.focus()),u()}),I=n.useCallback(c=>{!c||c===1/0||(window.clearTimeout(U.current),C.current=new Date().getTime(),U.current=window.setTimeout(R,c))},[R]);n.useEffect(()=>{const c=m.viewport;if(c){const N=()=>{I(_.current),i==null||i()},j=()=>{const M=new Date().getTime()-C.current;_.current=_.current-M,window.clearTimeout(U.current),x==null||x()};return c.addEventListener(ye,j),c.addEventListener(Ce,N),()=>{c.removeEventListener(ye,j),c.removeEventListener(Ce,N)}}},[m.viewport,T,x,i,I]),n.useEffect(()=>{d&&!m.isClosePausedRef.current&&I(T)},[d,T,m.isClosePausedRef,I]),n.useEffect(()=>(A(),()=>xe()),[A,xe]);const ce=n.useMemo(()=>l?rs(l):null,[l]);return m.viewport?e.jsxs(e.Fragment,{children:[ce&&e.jsx(Fs,{__scopeToast:o,role:"status","aria-live":r==="foreground"?"assertive":"polite",children:ce}),e.jsx(Rs,{scope:o,onClose:R,children:ms.createPortal(e.jsx(Se.ItemSlot,{scope:o,children:e.jsx(xs,{asChild:!0,onEscapeKeyDown:S(w,()=>{m.isFocusedToastEscapeKeyDownRef.current||R(),m.isFocusedToastEscapeKeyDownRef.current=!1}),children:e.jsx(B.li,{tabIndex:0,"data-state":d?"open":"closed","data-swipe-direction":m.swipeDirection,...P,ref:f,style:{userSelect:"none",touchAction:"none",...t.style},onKeyDown:S(t.onKeyDown,c=>{c.key==="Escape"&&(w==null||w(c.nativeEvent),c.nativeEvent.defaultPrevented||(m.isFocusedToastEscapeKeyDownRef.current=!0,R()))}),onPointerDown:S(t.onPointerDown,c=>{c.button===0&&(h.current={x:c.clientX,y:c.clientY})}),onPointerMove:S(t.onPointerMove,c=>{if(!h.current)return;const N=c.clientX-h.current.x,j=c.clientY-h.current.y,M=!!v.current,V=["left","right"].includes(m.swipeDirection),le=["left","up"].includes(m.swipeDirection)?Math.min:Math.max,us=V?le(0,N):0,ps=V?0:le(0,j),ve=c.pointerType==="touch"?10:2,de={x:us,y:ps},je={originalEvent:c,delta:de};M?(v.current=de,ue(_s,b,je,{discrete:!1})):De(de,m.swipeDirection,ve)?(v.current=de,ue(Ps,E,je,{discrete:!1}),c.target.setPointerCapture(c.pointerId)):(Math.abs(N)>ve||Math.abs(j)>ve)&&(h.current=null)}),onPointerUp:S(t.onPointerUp,c=>{const N=v.current,j=c.target;if(j.hasPointerCapture(c.pointerId)&&j.releasePointerCapture(c.pointerId),v.current=null,h.current=null,N){const M=c.currentTarget,V={originalEvent:c,delta:N};De(N,m.swipeDirection,m.swipeThreshold)?ue(As,D,V,{discrete:!0}):ue(Is,L,V,{discrete:!0}),M.addEventListener("click",le=>le.preventDefault(),{once:!0})}})})})}),m.viewport)})]}):null}),Fs=t=>{const{__scopeToast:s,children:o,...r}=t,a=we(ie,s),[d,u]=n.useState(!1),[w,x]=n.useState(!1);return Ms(()=>u(!0)),n.useEffect(()=>{const i=window.setTimeout(()=>x(!0),1e3);return()=>window.clearTimeout(i)},[]),w?null:e.jsx(Ts,{asChild:!0,children:e.jsx(Yt,{...r,children:d&&e.jsxs(e.Fragment,{children:[a.label," ",o]})})})},Ls="ToastTitle",Jt=n.forwardRef((t,s)=>{const{__scopeToast:o,...r}=t;return e.jsx(B.div,{...r,ref:s})});Jt.displayName=Ls;var Us="ToastDescription",Zt=n.forwardRef((t,s)=>{const{__scopeToast:o,...r}=t;return e.jsx(B.div,{...r,ref:s})});Zt.displayName=Us;var es="ToastAction",ts=n.forwardRef((t,s)=>{const{altText:o,...r}=t;return o.trim()?e.jsx(os,{altText:o,asChild:!0,children:e.jsx(ke,{...r,ref:s})}):(console.error(`Invalid prop \`altText\` supplied to \`${es}\`. Expected non-empty \`string\`.`),null)});ts.displayName=es;var ss="ToastClose",ke=n.forwardRef((t,s)=>{const{__scopeToast:o,...r}=t,a=Os(ss,o);return e.jsx(os,{asChild:!0,children:e.jsx(B.button,{type:"button",...r,ref:s,onClick:S(t.onClick,a.onClose)})})});ke.displayName=ss;var os=n.forwardRef((t,s)=>{const{__scopeToast:o,altText:r,...a}=t;return e.jsx(B.div,{"data-radix-toast-announce-exclude":"","data-radix-toast-announce-alt":r||void 0,...a,ref:s})});function rs(t){const s=[];return Array.from(t.childNodes).forEach(r=>{if(r.nodeType===r.TEXT_NODE&&r.textContent&&s.push(r.textContent),Vs(r)){const a=r.ariaHidden||r.hidden||r.style.display==="none",d=r.dataset.radixToastAnnounceExclude==="";if(!a)if(d){const u=r.dataset.radixToastAnnounceAlt;u&&s.push(u)}else s.push(...rs(r))}}),s}function ue(t,s,o,{discrete:r}){const a=o.originalEvent.currentTarget,d=new CustomEvent(t,{bubbles:!0,cancelable:!0,detail:o});s&&a.addEventListener(t,s,{once:!0}),r?hs(a,d):a.dispatchEvent(d)}var De=(t,s,o=0)=>{const r=Math.abs(t.x),a=Math.abs(t.y),d=r>a;return s==="left"||s==="right"?d&&r>o:!d&&a>o};function Ms(t=()=>{}){const s=fe(t);ys(()=>{let o=0,r=0;return o=window.requestAnimationFrame(()=>r=window.requestAnimationFrame(s)),()=>{window.cancelAnimationFrame(o),window.cancelAnimationFrame(r)}},[s])}function Vs(t){return t.nodeType===t.ELEMENT_NODE}function Ws(t){const s=[],o=document.createTreeWalker(t,NodeFilter.SHOW_ELEMENT,{acceptNode:r=>{const a=r.tagName==="INPUT"&&r.type==="hidden";return r.disabled||r.hidden||a?NodeFilter.FILTER_SKIP:r.tabIndex>=0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});for(;o.nextNode();)s.push(o.currentNode);return s}function Te(t){const s=document.activeElement;return t.some(o=>o===s?!0:(o.focus(),document.activeElement!==s))}var Ys=qt,ns=Xt,as=Qt,is=Jt,cs=Zt,ls=ts,ds=ke;const he=Ys,oe=n.forwardRef(({className:t,...s},o)=>e.jsx(ns,{ref:o,className:F("fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",t),...s}));oe.displayName=ns.displayName;const Ks=Cs("group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",{variants:{variant:{default:"border bg-background text-foreground",destructive:"destructive group border-destructive bg-destructive text-destructive-foreground"}},defaultVariants:{variant:"default"}}),O=n.forwardRef(({className:t,variant:s,...o},r)=>e.jsx(as,{ref:r,className:F(Ks({variant:s}),t),...o}));O.displayName=as.displayName;const k=n.forwardRef(({className:t,...s},o)=>e.jsx(ls,{ref:o,className:F("inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",t),...s}));k.displayName=ls.displayName;const re=n.forwardRef(({className:t,...s},o)=>e.jsx(ds,{ref:o,className:F("absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",t),"toast-close":"",...s,children:e.jsx(Ns,{className:"h-4 w-4"})}));re.displayName=ds.displayName;const ne=n.forwardRef(({className:t,...s},o)=>e.jsx(is,{ref:o,className:F("text-sm font-semibold",t),...s}));ne.displayName=is.displayName;const ae=n.forwardRef(({className:t,...s},o)=>e.jsx(cs,{ref:o,className:F("text-sm opacity-90",t),...s}));ae.displayName=cs.displayName;try{he.displayName="ToastProvider",he.__docgenInfo={description:"",displayName:"ToastProvider",props:{}}}catch{}try{oe.displayName="ToastViewport",oe.__docgenInfo={description:"",displayName:"ToastViewport",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{O.displayName="Toast",O.__docgenInfo={description:"",displayName:"Toast",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}},variant:{defaultValue:null,description:"",name:"variant",required:!1,type:{name:'"default" | "destructive" | null'}}}}}catch{}try{ne.displayName="ToastTitle",ne.__docgenInfo={description:"",displayName:"ToastTitle",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{ae.displayName="ToastDescription",ae.__docgenInfo={description:"",displayName:"ToastDescription",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{re.displayName="ToastClose",re.__docgenInfo={description:"",displayName:"ToastClose",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{k.displayName="ToastAction",k.__docgenInfo={description:"",displayName:"ToastAction",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}const zs=1,$s=1e6;let ge=0;function qs(){return ge=(ge+1)%Number.MAX_SAFE_INTEGER,ge.toString()}const be=new Map,Pe=t=>{if(be.has(t))return;const s=setTimeout(()=>{be.delete(t),te({type:"REMOVE_TOAST",toastId:t})},$s);be.set(t,s)},Hs=(t,s)=>{switch(s.type){case"ADD_TOAST":return{...t,toasts:[s.toast,...t.toasts].slice(0,zs)};case"UPDATE_TOAST":return{...t,toasts:t.toasts.map(o=>o.id===s.toast.id?{...o,...s.toast}:o)};case"DISMISS_TOAST":{const{toastId:o}=s;return o?Pe(o):t.toasts.forEach(r=>{Pe(r.id)}),{...t,toasts:t.toasts.map(r=>r.id===o||o===void 0?{...r,open:!1}:r)}}case"REMOVE_TOAST":return s.toastId===void 0?{...t,toasts:[]}:{...t,toasts:t.toasts.filter(o=>o.id!==s.toastId)}}},pe=[];let me={toasts:[]};function te(t){me=Hs(me,t),pe.forEach(s=>{s(me)})}function Xs({...t}){const s=qs(),o=a=>te({type:"UPDATE_TOAST",toast:{...a,id:s}}),r=()=>te({type:"DISMISS_TOAST",toastId:s});return te({type:"ADD_TOAST",toast:{...t,id:s,open:!0,onOpenChange:a=>{a||r()}}}),{id:s,dismiss:r,update:o}}function g(){const[t,s]=n.useState(me);return n.useEffect(()=>(pe.push(s),()=>{const o=pe.indexOf(s);o>-1&&pe.splice(o,1)}),[t]),{...t,toast:Xs,dismiss:o=>te({type:"DISMISS_TOAST",toastId:o})}}function Gs(){const{toasts:t}=g();return e.jsxs(he,{children:[t.map(function({id:s,title:o,description:r,action:a,...d}){return e.jsxs(O,{...d,children:[e.jsxs("div",{className:"grid gap-1",children:[o&&e.jsx(ne,{children:o}),r&&e.jsx(ae,{children:r})]}),a,e.jsx(re,{})]},s)}),e.jsx(oe,{})]})}const Co={title:"Tier 1: Primitives/shadcn/Toast",component:O,parameters:{layout:"centered",docs:{description:{component:"A succinct message that is displayed temporarily. Built on Radix UI Toast primitive with programmatic control via useToast() hook."}}},tags:["autodocs"],decorators:[t=>e.jsxs("div",{className:"relative min-h-[400px] w-full flex items-center justify-center",children:[e.jsx(t,{}),e.jsx(Gs,{})]})]},W={render:()=>{const t=()=>{const{toast:s}=g();return e.jsx(p,{onClick:()=>{s({title:"Notification",description:"This is a default toast notification."})},children:"Show Default Toast"})};return e.jsx(t,{})}},Y={render:()=>{const t=()=>{const{toast:s}=g();return e.jsx(p,{variant:"destructive",onClick:()=>{s({variant:"destructive",title:"Error",description:"Something went wrong. Please try again."})},children:"Show Error Toast"})};return e.jsx(t,{})}},K={render:()=>{const t=()=>{const{toast:s}=g();return e.jsx(p,{style:{backgroundColor:"#0ec2bc",color:"white"},onClick:()=>{s({title:"Success!",description:"Your changes have been saved successfully.",className:"border-[#0ec2bc]/50 bg-[#0ec2bc]/10 text-foreground dark:bg-[#0ec2bc]/20"})},children:"Show Success Toast"})};return e.jsx(t,{})}},z={render:()=>{const t=()=>{const{toast:s}=g();return e.jsx(p,{onClick:()=>{s({title:"File deleted",description:"Your file has been moved to trash.",action:e.jsx(k,{altText:"Undo deletion",onClick:()=>{console.log("Undo clicked!")},children:"Undo"})})},children:"Show Toast with Action"})};return e.jsx(t,{})}},$={render:()=>{const t=()=>{const{toast:s}=g();return e.jsx(p,{onClick:()=>{s({title:"Message sent successfully"})},children:"Show Title Only"})};return e.jsx(t,{})}},q={render:()=>{const t=()=>{const{toast:s}=g();return e.jsx(p,{onClick:()=>{s({description:"Your session will expire in 5 minutes."})},children:"Show Description Only"})};return e.jsx(t,{})}},H={render:()=>{const t=()=>{const{toast:s}=g(),o=()=>{s({title:"Default Toast",description:"This is a default notification."})},r=()=>{s({title:"Success!",description:"Operation completed successfully.",className:"border-[#0ec2bc]/50 bg-[#0ec2bc]/10 text-foreground dark:bg-[#0ec2bc]/20"})},a=()=>{s({title:"Warning",description:"Please review your changes before proceeding.",className:"border-yellow-500/50 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100"})},d=()=>{s({variant:"destructive",title:"Error",description:"Unable to complete the operation."})},u=()=>{s({title:"Information",description:"System maintenance scheduled for Sunday at 2:00 AM UTC.",className:"border-blue-500/50 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100"})};return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(p,{onClick:o,variant:"outline",children:"Default"}),e.jsx(p,{onClick:r,style:{backgroundColor:"#0ec2bc",color:"white"},children:"Success (Ozean Licht)"}),e.jsx(p,{onClick:a,className:"bg-yellow-500 text-white hover:bg-yellow-600",children:"Warning"}),e.jsx(p,{onClick:d,variant:"destructive",children:"Error"}),e.jsx(p,{onClick:u,className:"bg-blue-500 text-white hover:bg-blue-600",children:"Info"})]})};return e.jsx(t,{})}},X={render:()=>{const t=()=>{const{toast:s}=g(),o=()=>{s({title:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(se,{className:"h-5 w-5 text-[#0ec2bc]"}),e.jsx("span",{children:"Success!"})]}),description:"Your changes have been saved.",className:"border-[#0ec2bc]/50"})},r=()=>{s({variant:"destructive",title:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(zt,{className:"h-5 w-5"}),e.jsx("span",{children:"Error"})]}),description:"Unable to save changes."})},a=()=>{s({title:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(Kt,{className:"h-5 w-5 text-yellow-600"}),e.jsx("span",{children:"Warning"})]}),description:"This action cannot be undone.",className:"border-yellow-500/50 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100"})},d=()=>{s({title:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(Es,{className:"h-5 w-5 text-blue-600"}),e.jsx("span",{children:"Information"})]}),description:"New version available.",className:"border-blue-500/50 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100"})};return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(p,{onClick:o,style:{backgroundColor:"#0ec2bc",color:"white"},children:"Success with Icon"}),e.jsx(p,{onClick:r,variant:"destructive",children:"Error with Icon"}),e.jsx(p,{onClick:a,className:"bg-yellow-500 text-white hover:bg-yellow-600",children:"Warning with Icon"}),e.jsx(p,{onClick:d,className:"bg-blue-500 text-white hover:bg-blue-600",children:"Info with Icon"})]})};return e.jsx(t,{})}},G={render:()=>{const t=()=>{const{toast:s}=g(),o=()=>{s({title:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(se,{className:"h-5 w-5 text-[#0ec2bc]"}),e.jsx("span",{children:"Profile Updated"})]}),description:"Your profile changes have been saved successfully.",className:"border-[#0ec2bc]/50"})},r=()=>{s({title:"Item deleted",description:"The item has been moved to trash.",action:e.jsx(k,{altText:"Undo deletion",onClick:()=>{s({title:"Deletion undone",description:"The item has been restored.",className:"border-[#0ec2bc]/50"})},children:"Undo"})})},a=()=>{s({variant:"destructive",title:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(zt,{className:"h-5 w-5"}),e.jsx("span",{children:"API Error"})]}),description:"Failed to fetch data. Please check your connection and try again.",action:e.jsx(k,{altText:"Retry request",onClick:()=>console.log("Retry"),children:"Retry"})})},d=()=>{s({title:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(Kt,{className:"h-5 w-5 text-yellow-600"}),e.jsx("span",{children:"Session Expiring Soon"})]}),description:"Your session will expire in 5 minutes. Save your work.",className:"border-yellow-500/50 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100",action:e.jsx(k,{altText:"Extend session",onClick:()=>console.log("Extend"),children:"Extend"})})},u=()=>{s({title:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(se,{className:"h-5 w-5 text-[#0ec2bc]"}),e.jsx("span",{children:"Upload Complete"})]}),description:"document.pdf has been uploaded successfully (2.4 MB).",className:"border-[#0ec2bc]/50",action:e.jsx(k,{altText:"View file",onClick:()=>console.log("View"),children:"View"})})};return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(p,{onClick:o,style:{backgroundColor:"#0ec2bc",color:"white"},children:"Save Profile"}),e.jsx(p,{onClick:r,variant:"outline",children:"Delete Item (with Undo)"}),e.jsx(p,{onClick:a,variant:"destructive",children:"API Error (with Retry)"}),e.jsx(p,{onClick:d,className:"bg-yellow-500 text-white hover:bg-yellow-600",children:"Session Warning"}),e.jsx(p,{onClick:u,style:{backgroundColor:"#0ec2bc",color:"white"},children:"File Upload Success"})]})};return e.jsx(t,{})}},Q={render:()=>{const t=()=>{const{toast:s,dismiss:o}=g(),r=()=>{const{id:u}=s({title:"Persistent Toast",description:"This toast will stay until manually dismissed."});window.currentToastId=u},a=()=>{o()},d=()=>{const u=window.currentToastId;u&&o(u)};return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(p,{onClick:r,variant:"outline",children:"Show Persistent Toast"}),e.jsx(p,{onClick:d,variant:"secondary",children:"Dismiss Specific Toast"}),e.jsx(p,{onClick:a,variant:"destructive",children:"Dismiss All Toasts"})]})};return e.jsx(t,{})}},J={render:()=>{const t=()=>{const{toast:s}=g();return e.jsx(p,{onClick:()=>{s({title:"System Update Available",description:"A new system update (v2.5.0) is available with bug fixes, performance improvements, and new features. The update includes enhanced security patches and improved user interface components. Please save your work before proceeding with the installation.",action:e.jsx(k,{altText:"Update now",onClick:()=>console.log("Update"),children:"Update"})})},children:"Show Long Content Toast"})};return e.jsx(t,{})}},Z={render:()=>{const t=()=>{const{toast:s}=g(),o=()=>{s({title:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(se,{className:"h-5 w-5"}),e.jsx("span",{className:"font-bold",children:"Premium Feature Unlocked!"})]}),description:"You now have access to all premium features.",className:"bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none"})},r=()=>{s({title:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(se,{className:"h-5 w-5"}),e.jsx("span",{className:"font-semibold",children:"Ozean Licht"})]}),description:"Experience the cosmic UI of Ozean Licht design system.",className:"bg-gradient-to-br from-[#0ec2bc]/20 to-blue-500/20 border-[#0ec2bc] backdrop-blur-sm"})};return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(p,{onClick:o,className:"bg-gradient-to-r from-purple-500 to-pink-500 text-white",children:"Gradient Toast"}),e.jsx(p,{onClick:r,style:{backgroundColor:"#0ec2bc",color:"white"},children:"Ozean Licht Branded"})]})};return e.jsx(t,{})}},ee={render:()=>e.jsxs(he,{children:[e.jsxs(O,{children:[e.jsxs("div",{className:"grid gap-1",children:[e.jsx(ne,{children:"Direct Primitive Usage"}),e.jsx(ae,{children:"This toast is rendered directly using primitive components."})]}),e.jsx(re,{})]}),e.jsx(oe,{})]})};var _e,Ie,Ae,Re,Oe;W.parameters={...W.parameters,docs:{...(_e=W.parameters)==null?void 0:_e.docs,source:{originalSource:`{
  render: () => {
    const ToastDemo = () => {
      const {
        toast
      } = useToast();
      return <Button onClick={() => {
        toast({
          title: 'Notification',
          description: 'This is a default toast notification.'
        });
      }}>
          Show Default Toast
        </Button>;
    };
    return <ToastDemo />;
  }
}`,...(Ae=(Ie=W.parameters)==null?void 0:Ie.docs)==null?void 0:Ae.source},description:{story:`Default toast with title and description.

The most common toast pattern showing a simple notification.`,...(Oe=(Re=W.parameters)==null?void 0:Re.docs)==null?void 0:Oe.description}}};var Be,Fe,Le,Ue,Me;Y.parameters={...Y.parameters,docs:{...(Be=Y.parameters)==null?void 0:Be.docs,source:{originalSource:`{
  render: () => {
    const ToastDemo = () => {
      const {
        toast
      } = useToast();
      return <Button variant="destructive" onClick={() => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Something went wrong. Please try again.'
        });
      }}>
          Show Error Toast
        </Button>;
    };
    return <ToastDemo />;
  }
}`,...(Le=(Fe=Y.parameters)==null?void 0:Fe.docs)==null?void 0:Le.source},description:{story:`Destructive variant for errors.

Use for error messages, warnings, or destructive actions.`,...(Me=(Ue=Y.parameters)==null?void 0:Ue.docs)==null?void 0:Me.description}}};var Ve,We,Ye,Ke,ze;K.parameters={...K.parameters,docs:{...(Ve=K.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
  render: () => {
    const ToastDemo = () => {
      const {
        toast
      } = useToast();
      return <Button style={{
        backgroundColor: '#0ec2bc',
        color: 'white'
      }} onClick={() => {
        toast({
          title: 'Success!',
          description: 'Your changes have been saved successfully.',
          className: 'border-[#0ec2bc]/50 bg-[#0ec2bc]/10 text-foreground dark:bg-[#0ec2bc]/20'
        });
      }}>
          Show Success Toast
        </Button>;
    };
    return <ToastDemo />;
  }
}`,...(Ye=(We=K.parameters)==null?void 0:We.docs)==null?void 0:Ye.source},description:{story:`Success toast with custom styling (Ozean Licht turquoise).

Demonstrates using the Ozean Licht primary color (#0ec2bc) for success messages.`,...(ze=(Ke=K.parameters)==null?void 0:Ke.docs)==null?void 0:ze.description}}};var $e,qe,He,Xe,Ge;z.parameters={...z.parameters,docs:{...($e=z.parameters)==null?void 0:$e.docs,source:{originalSource:`{
  render: () => {
    const ToastDemo = () => {
      const {
        toast
      } = useToast();
      return <Button onClick={() => {
        toast({
          title: 'File deleted',
          description: 'Your file has been moved to trash.',
          action: <ToastAction altText="Undo deletion" onClick={() => {
            console.log('Undo clicked!');
          }}>
                  Undo
                </ToastAction>
        });
      }}>
          Show Toast with Action
        </Button>;
    };
    return <ToastDemo />;
  }
}`,...(He=(qe=z.parameters)==null?void 0:qe.docs)==null?void 0:He.source},description:{story:`Toast with action button.

Shows how to add an actionable button (e.g., Undo, Retry, View).`,...(Ge=(Xe=z.parameters)==null?void 0:Xe.docs)==null?void 0:Ge.description}}};var Qe,Je,Ze,et,tt;$.parameters={...$.parameters,docs:{...(Qe=$.parameters)==null?void 0:Qe.docs,source:{originalSource:`{
  render: () => {
    const ToastDemo = () => {
      const {
        toast
      } = useToast();
      return <Button onClick={() => {
        toast({
          title: 'Message sent successfully'
        });
      }}>
          Show Title Only
        </Button>;
    };
    return <ToastDemo />;
  }
}`,...(Ze=(Je=$.parameters)==null?void 0:Je.docs)==null?void 0:Ze.source},description:{story:`Toast with title only.

Simple, concise notifications without description.`,...(tt=(et=$.parameters)==null?void 0:et.docs)==null?void 0:tt.description}}};var st,ot,rt,nt,at;q.parameters={...q.parameters,docs:{...(st=q.parameters)==null?void 0:st.docs,source:{originalSource:`{
  render: () => {
    const ToastDemo = () => {
      const {
        toast
      } = useToast();
      return <Button onClick={() => {
        toast({
          description: 'Your session will expire in 5 minutes.'
        });
      }}>
          Show Description Only
        </Button>;
    };
    return <ToastDemo />;
  }
}`,...(rt=(ot=q.parameters)==null?void 0:ot.docs)==null?void 0:rt.source},description:{story:`Toast with description only.

For cases where you don't need a title.`,...(at=(nt=q.parameters)==null?void 0:nt.docs)==null?void 0:at.description}}};var it,ct,lt,dt,ut;H.parameters={...H.parameters,docs:{...(it=H.parameters)==null?void 0:it.docs,source:{originalSource:`{
  render: () => {
    const ToastDemo = () => {
      const {
        toast
      } = useToast();
      const showDefault = () => {
        toast({
          title: 'Default Toast',
          description: 'This is a default notification.'
        });
      };
      const showSuccess = () => {
        toast({
          title: 'Success!',
          description: 'Operation completed successfully.',
          className: 'border-[#0ec2bc]/50 bg-[#0ec2bc]/10 text-foreground dark:bg-[#0ec2bc]/20'
        });
      };
      const showWarning = () => {
        toast({
          title: 'Warning',
          description: 'Please review your changes before proceeding.',
          className: 'border-yellow-500/50 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100'
        });
      };
      const showError = () => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Unable to complete the operation.'
        });
      };
      const showInfo = () => {
        toast({
          title: 'Information',
          description: 'System maintenance scheduled for Sunday at 2:00 AM UTC.',
          className: 'border-blue-500/50 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100'
        });
      };
      return <div className="flex flex-col gap-3">
          <Button onClick={showDefault} variant="outline">
            Default
          </Button>
          <Button onClick={showSuccess} style={{
          backgroundColor: '#0ec2bc',
          color: 'white'
        }}>
            Success (Ozean Licht)
          </Button>
          <Button onClick={showWarning} className="bg-yellow-500 text-white hover:bg-yellow-600">
            Warning
          </Button>
          <Button onClick={showError} variant="destructive">
            Error
          </Button>
          <Button onClick={showInfo} className="bg-blue-500 text-white hover:bg-blue-600">
            Info
          </Button>
        </div>;
    };
    return <ToastDemo />;
  }
}`,...(lt=(ct=H.parameters)==null?void 0:ct.docs)==null?void 0:lt.source},description:{story:`Multiple toasts showcase.

Demonstrates different toast variants and use cases.
Note: Only 1 toast shown at a time (configured in use-toast.ts).`,...(ut=(dt=H.parameters)==null?void 0:dt.docs)==null?void 0:ut.description}}};var pt,mt,ft,ht,wt;X.parameters={...X.parameters,docs:{...(pt=X.parameters)==null?void 0:pt.docs,source:{originalSource:`{
  render: () => {
    const ToastDemo = () => {
      const {
        toast
      } = useToast();
      const showSuccess = () => {
        toast({
          title: <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#0ec2bc]" />
              <span>Success!</span>
            </div>,
          description: 'Your changes have been saved.',
          className: 'border-[#0ec2bc]/50'
        });
      };
      const showError = () => {
        toast({
          variant: 'destructive',
          title: <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>Error</span>
            </div>,
          description: 'Unable to save changes.'
        });
      };
      const showWarning = () => {
        toast({
          title: <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span>Warning</span>
            </div>,
          description: 'This action cannot be undone.',
          className: 'border-yellow-500/50 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100'
        });
      };
      const showInfo = () => {
        toast({
          title: <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              <span>Information</span>
            </div>,
          description: 'New version available.',
          className: 'border-blue-500/50 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100'
        });
      };
      return <div className="flex flex-col gap-3">
          <Button onClick={showSuccess} style={{
          backgroundColor: '#0ec2bc',
          color: 'white'
        }}>
            Success with Icon
          </Button>
          <Button onClick={showError} variant="destructive">
            Error with Icon
          </Button>
          <Button onClick={showWarning} className="bg-yellow-500 text-white hover:bg-yellow-600">
            Warning with Icon
          </Button>
          <Button onClick={showInfo} className="bg-blue-500 text-white hover:bg-blue-600">
            Info with Icon
          </Button>
        </div>;
    };
    return <ToastDemo />;
  }
}`,...(ft=(mt=X.parameters)==null?void 0:mt.docs)==null?void 0:ft.source},description:{story:`Toast with icons.

Add visual indicators using lucide-react icons in title.`,...(wt=(ht=X.parameters)==null?void 0:ht.docs)==null?void 0:wt.description}}};var xt,vt,Tt,gt,bt;G.parameters={...G.parameters,docs:{...(xt=G.parameters)==null?void 0:xt.docs,source:{originalSource:`{
  render: () => {
    const ToastDemo = () => {
      const {
        toast
      } = useToast();
      const saveProfile = () => {
        toast({
          title: <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#0ec2bc]" />
              <span>Profile Updated</span>
            </div>,
          description: 'Your profile changes have been saved successfully.',
          className: 'border-[#0ec2bc]/50'
        });
      };
      const deleteItem = () => {
        toast({
          title: 'Item deleted',
          description: 'The item has been moved to trash.',
          action: <ToastAction altText="Undo deletion" onClick={() => {
            toast({
              title: 'Deletion undone',
              description: 'The item has been restored.',
              className: 'border-[#0ec2bc]/50'
            });
          }}>
              Undo
            </ToastAction>
        });
      };
      const apiError = () => {
        toast({
          variant: 'destructive',
          title: <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>API Error</span>
            </div>,
          description: 'Failed to fetch data. Please check your connection and try again.',
          action: <ToastAction altText="Retry request" onClick={() => console.log('Retry')}>
              Retry
            </ToastAction>
        });
      };
      const sessionWarning = () => {
        toast({
          title: <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span>Session Expiring Soon</span>
            </div>,
          description: 'Your session will expire in 5 minutes. Save your work.',
          className: 'border-yellow-500/50 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100',
          action: <ToastAction altText="Extend session" onClick={() => console.log('Extend')}>
              Extend
            </ToastAction>
        });
      };
      const fileUpload = () => {
        toast({
          title: <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#0ec2bc]" />
              <span>Upload Complete</span>
            </div>,
          description: 'document.pdf has been uploaded successfully (2.4 MB).',
          className: 'border-[#0ec2bc]/50',
          action: <ToastAction altText="View file" onClick={() => console.log('View')}>
              View
            </ToastAction>
        });
      };
      return <div className="flex flex-col gap-3">
          <Button onClick={saveProfile} style={{
          backgroundColor: '#0ec2bc',
          color: 'white'
        }}>
            Save Profile
          </Button>
          <Button onClick={deleteItem} variant="outline">
            Delete Item (with Undo)
          </Button>
          <Button onClick={apiError} variant="destructive">
            API Error (with Retry)
          </Button>
          <Button onClick={sessionWarning} className="bg-yellow-500 text-white hover:bg-yellow-600">
            Session Warning
          </Button>
          <Button onClick={fileUpload} style={{
          backgroundColor: '#0ec2bc',
          color: 'white'
        }}>
            File Upload Success
          </Button>
        </div>;
    };
    return <ToastDemo />;
  }
}`,...(Tt=(vt=G.parameters)==null?void 0:vt.docs)==null?void 0:Tt.source},description:{story:`Real-world usage examples.

Common patterns for form submissions, API calls, and user actions.`,...(bt=(gt=G.parameters)==null?void 0:gt.docs)==null?void 0:bt.description}}};var yt,Ct,Nt,Et,St;Q.parameters={...Q.parameters,docs:{...(yt=Q.parameters)==null?void 0:yt.docs,source:{originalSource:`{
  render: () => {
    const ToastDemo = () => {
      const {
        toast,
        dismiss
      } = useToast();
      const showPersistentToast = () => {
        const {
          id
        } = toast({
          title: 'Persistent Toast',
          description: 'This toast will stay until manually dismissed.'
        });

        // Store the ID for later dismissal
        (window as any).currentToastId = id;
      };
      const dismissAll = () => {
        dismiss(); // Dismiss all toasts
      };
      const dismissSpecific = () => {
        const id = (window as any).currentToastId;
        if (id) {
          dismiss(id); // Dismiss specific toast by ID
        }
      };
      return <div className="flex flex-col gap-3">
          <Button onClick={showPersistentToast} variant="outline">
            Show Persistent Toast
          </Button>
          <Button onClick={dismissSpecific} variant="secondary">
            Dismiss Specific Toast
          </Button>
          <Button onClick={dismissAll} variant="destructive">
            Dismiss All Toasts
          </Button>
        </div>;
    };
    return <ToastDemo />;
  }
}`,...(Nt=(Ct=Q.parameters)==null?void 0:Ct.docs)==null?void 0:Nt.source},description:{story:`Programmatic dismiss.

Shows how to dismiss toasts programmatically using the dismiss() function.`,...(St=(Et=Q.parameters)==null?void 0:Et.docs)==null?void 0:St.description}}};var kt,jt,Dt,Pt,_t;J.parameters={...J.parameters,docs:{...(kt=J.parameters)==null?void 0:kt.docs,source:{originalSource:`{
  render: () => {
    const ToastDemo = () => {
      const {
        toast
      } = useToast();
      return <Button onClick={() => {
        toast({
          title: 'System Update Available',
          description: 'A new system update (v2.5.0) is available with bug fixes, performance improvements, and new features. The update includes enhanced security patches and improved user interface components. Please save your work before proceeding with the installation.',
          action: <ToastAction altText="Update now" onClick={() => console.log('Update')}>
                  Update
                </ToastAction>
        });
      }}>
          Show Long Content Toast
        </Button>;
    };
    return <ToastDemo />;
  }
}`,...(Dt=(jt=J.parameters)==null?void 0:jt.docs)==null?void 0:Dt.source},description:{story:`Long content toast.

Shows how toasts handle longer descriptions and complex content.`,...(_t=(Pt=J.parameters)==null?void 0:Pt.docs)==null?void 0:_t.description}}};var It,At,Rt,Ot,Bt;Z.parameters={...Z.parameters,docs:{...(It=Z.parameters)==null?void 0:It.docs,source:{originalSource:`{
  render: () => {
    const ToastDemo = () => {
      const {
        toast
      } = useToast();
      const showGradientToast = () => {
        toast({
          title: <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-bold">Premium Feature Unlocked!</span>
            </div>,
          description: 'You now have access to all premium features.',
          className: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none'
        });
      };
      const showOzeanLichtBranded = () => {
        toast({
          title: <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">Ozean Licht</span>
            </div>,
          description: 'Experience the cosmic UI of Ozean Licht design system.',
          className: 'bg-gradient-to-br from-[#0ec2bc]/20 to-blue-500/20 border-[#0ec2bc] backdrop-blur-sm'
        });
      };
      return <div className="flex flex-col gap-3">
          <Button onClick={showGradientToast} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            Gradient Toast
          </Button>
          <Button onClick={showOzeanLichtBranded} style={{
          backgroundColor: '#0ec2bc',
          color: 'white'
        }}>
            Ozean Licht Branded
          </Button>
        </div>;
    };
    return <ToastDemo />;
  }
}`,...(Rt=(At=Z.parameters)==null?void 0:At.docs)==null?void 0:Rt.source},description:{story:`Custom styled toast.

Demonstrates full customization with className prop.`,...(Bt=(Ot=Z.parameters)==null?void 0:Ot.docs)==null?void 0:Bt.description}}};var Ft,Lt,Ut,Mt,Vt;ee.parameters={...ee.parameters,docs:{...(Ft=ee.parameters)==null?void 0:Ft.docs,source:{originalSource:`{
  render: () => {
    return <ToastProvider>
        <Toast>
          <div className="grid gap-1">
            <ToastTitle>Direct Primitive Usage</ToastTitle>
            <ToastDescription>
              This toast is rendered directly using primitive components.
            </ToastDescription>
          </div>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>;
  }
}`,...(Ut=(Lt=ee.parameters)==null?void 0:Lt.docs)==null?void 0:Ut.source},description:{story:`Primitive component structure (low-level usage).

Shows how to use the Toast primitive components directly without the hook.
In most cases, you should use the useToast() hook instead.`,...(Vt=(Mt=ee.parameters)==null?void 0:Mt.docs)==null?void 0:Vt.description}}};const No=["Default","Destructive","Success","WithAction","TitleOnly","DescriptionOnly","AllVariants","WithIcons","RealWorldExamples","ProgrammaticDismiss","LongContent","CustomStyled","PrimitiveStructure"];export{H as AllVariants,Z as CustomStyled,W as Default,q as DescriptionOnly,Y as Destructive,J as LongContent,ee as PrimitiveStructure,Q as ProgrammaticDismiss,G as RealWorldExamples,K as Success,$ as TitleOnly,z as WithAction,X as WithIcons,No as __namedExportsOrder,Co as default};
