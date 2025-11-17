import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{r as l}from"./index-B2-qRKKC.js";import{c as xt,P as B,a as j}from"./index-D5ysUGwq.js";import{P as G}from"./index-PNzqWif7.js";import{u as P}from"./index-BFjtS4uE.js";import{u as S}from"./index-ciuW_uyV.js";import{u as ft}from"./index-D6fdIYSQ.js";import{u as bt}from"./index-D1vk04JX.js";import{c as gt}from"./index-BdQq_4o_.js";import{c as tt}from"./cn-CytzSlOG.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-kS-9iBlu.js";function vt(t,r){return l.useReducer((s,n)=>r[s][n]??s,t)}var ee="ScrollArea",[rt]=xt(ee),[yt,v]=rt(ee),st=l.forwardRef((t,r)=>{const{__scopeScrollArea:s,type:n="hover",dir:o,scrollHideDelay:a=600,...i}=t,[c,d]=l.useState(null),[u,m]=l.useState(null),[p,h]=l.useState(null),[x,g]=l.useState(null),[k,K]=l.useState(null),[N,F]=l.useState(0),[Z,M]=l.useState(0),[U,E]=l.useState(!1),[V,X]=l.useState(!1),f=P(r,C=>d(C)),y=ft(o);return e.jsx(yt,{scope:s,type:n,dir:y,scrollHideDelay:a,scrollArea:c,viewport:u,onViewportChange:m,content:p,onContentChange:h,scrollbarX:x,onScrollbarXChange:g,scrollbarXEnabled:U,onScrollbarXEnabledChange:E,scrollbarY:k,onScrollbarYChange:K,scrollbarYEnabled:V,onScrollbarYEnabledChange:X,onCornerWidthChange:F,onCornerHeightChange:M,children:e.jsx(B.div,{dir:y,...i,ref:f,style:{position:"relative","--radix-scroll-area-corner-width":N+"px","--radix-scroll-area-corner-height":Z+"px",...t.style}})})});st.displayName=ee;var ot="ScrollAreaViewport",nt=l.forwardRef((t,r)=>{const{__scopeScrollArea:s,children:n,nonce:o,...a}=t,i=v(ot,s),c=l.useRef(null),d=P(r,c,i.onViewportChange);return e.jsxs(e.Fragment,{children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:"[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}"},nonce:o}),e.jsx(B.div,{"data-radix-scroll-area-viewport":"",...a,ref:d,style:{overflowX:i.scrollbarXEnabled?"scroll":"hidden",overflowY:i.scrollbarYEnabled?"scroll":"hidden",...t.style},children:e.jsx("div",{ref:i.onContentChange,style:{minWidth:"100%",display:"table"},children:n})})]})});nt.displayName=ot;var w="ScrollAreaScrollbar",te=l.forwardRef((t,r)=>{const{forceMount:s,...n}=t,o=v(w,t.__scopeScrollArea),{onScrollbarXEnabledChange:a,onScrollbarYEnabledChange:i}=o,c=t.orientation==="horizontal";return l.useEffect(()=>(c?a(!0):i(!0),()=>{c?a(!1):i(!1)}),[c,a,i]),o.type==="hover"?e.jsx(wt,{...n,ref:r,forceMount:s}):o.type==="scroll"?e.jsx(Nt,{...n,ref:r,forceMount:s}):o.type==="auto"?e.jsx(at,{...n,ref:r,forceMount:s}):o.type==="always"?e.jsx(re,{...n,ref:r}):null});te.displayName=w;var wt=l.forwardRef((t,r)=>{const{forceMount:s,...n}=t,o=v(w,t.__scopeScrollArea),[a,i]=l.useState(!1);return l.useEffect(()=>{const c=o.scrollArea;let d=0;if(c){const u=()=>{window.clearTimeout(d),i(!0)},m=()=>{d=window.setTimeout(()=>i(!1),o.scrollHideDelay)};return c.addEventListener("pointerenter",u),c.addEventListener("pointerleave",m),()=>{window.clearTimeout(d),c.removeEventListener("pointerenter",u),c.removeEventListener("pointerleave",m)}}},[o.scrollArea,o.scrollHideDelay]),e.jsx(G,{present:s||a,children:e.jsx(at,{"data-state":a?"visible":"hidden",...n,ref:r})})}),Nt=l.forwardRef((t,r)=>{const{forceMount:s,...n}=t,o=v(w,t.__scopeScrollArea),a=t.orientation==="horizontal",i=Q(()=>d("SCROLL_END"),100),[c,d]=vt("hidden",{hidden:{SCROLL:"scrolling"},scrolling:{SCROLL_END:"idle",POINTER_ENTER:"interacting"},interacting:{SCROLL:"interacting",POINTER_LEAVE:"idle"},idle:{HIDE:"hidden",SCROLL:"scrolling",POINTER_ENTER:"interacting"}});return l.useEffect(()=>{if(c==="idle"){const u=window.setTimeout(()=>d("HIDE"),o.scrollHideDelay);return()=>window.clearTimeout(u)}},[c,o.scrollHideDelay,d]),l.useEffect(()=>{const u=o.viewport,m=a?"scrollLeft":"scrollTop";if(u){let p=u[m];const h=()=>{const x=u[m];p!==x&&(d("SCROLL"),i()),p=x};return u.addEventListener("scroll",h),()=>u.removeEventListener("scroll",h)}},[o.viewport,a,d,i]),e.jsx(G,{present:s||c!=="hidden",children:e.jsx(re,{"data-state":c==="hidden"?"hidden":"visible",...n,ref:r,onPointerEnter:j(t.onPointerEnter,()=>d("POINTER_ENTER")),onPointerLeave:j(t.onPointerLeave,()=>d("POINTER_LEAVE"))})})}),at=l.forwardRef((t,r)=>{const s=v(w,t.__scopeScrollArea),{forceMount:n,...o}=t,[a,i]=l.useState(!1),c=t.orientation==="horizontal",d=Q(()=>{if(s.viewport){const u=s.viewport.offsetWidth<s.viewport.scrollWidth,m=s.viewport.offsetHeight<s.viewport.scrollHeight;i(c?u:m)}},10);return T(s.viewport,d),T(s.content,d),e.jsx(G,{present:n||a,children:e.jsx(re,{"data-state":a?"visible":"hidden",...o,ref:r})})}),re=l.forwardRef((t,r)=>{const{orientation:s="vertical",...n}=t,o=v(w,t.__scopeScrollArea),a=l.useRef(null),i=l.useRef(0),[c,d]=l.useState({content:0,viewport:0,scrollbar:{size:0,paddingStart:0,paddingEnd:0}}),u=mt(c.viewport,c.content),m={...n,sizes:c,onSizesChange:d,hasThumb:u>0&&u<1,onThumbChange:h=>a.current=h,onThumbPointerUp:()=>i.current=0,onThumbPointerDown:h=>i.current=h};function p(h,x){return Pt(h,i.current,c,x)}return s==="horizontal"?e.jsx(St,{...m,ref:r,onThumbPositionChange:()=>{if(o.viewport&&a.current){const h=o.viewport.scrollLeft,x=oe(h,c,o.dir);a.current.style.transform=`translate3d(${x}px, 0, 0)`}},onWheelScroll:h=>{o.viewport&&(o.viewport.scrollLeft=h)},onDragScroll:h=>{o.viewport&&(o.viewport.scrollLeft=p(h,o.dir))}}):s==="vertical"?e.jsx(jt,{...m,ref:r,onThumbPositionChange:()=>{if(o.viewport&&a.current){const h=o.viewport.scrollTop,x=oe(h,c);a.current.style.transform=`translate3d(0, ${x}px, 0)`}},onWheelScroll:h=>{o.viewport&&(o.viewport.scrollTop=h)},onDragScroll:h=>{o.viewport&&(o.viewport.scrollTop=p(h))}}):null}),St=l.forwardRef((t,r)=>{const{sizes:s,onSizesChange:n,...o}=t,a=v(w,t.__scopeScrollArea),[i,c]=l.useState(),d=l.useRef(null),u=P(r,d,a.onScrollbarXChange);return l.useEffect(()=>{d.current&&c(getComputedStyle(d.current))},[d]),e.jsx(it,{"data-orientation":"horizontal",...o,ref:u,sizes:s,style:{bottom:0,left:a.dir==="rtl"?"var(--radix-scroll-area-corner-width)":0,right:a.dir==="ltr"?"var(--radix-scroll-area-corner-width)":0,"--radix-scroll-area-thumb-width":J(s)+"px",...t.style},onThumbPointerDown:m=>t.onThumbPointerDown(m.x),onDragScroll:m=>t.onDragScroll(m.x),onWheelScroll:(m,p)=>{if(a.viewport){const h=a.viewport.scrollLeft+m.deltaX;t.onWheelScroll(h),ut(h,p)&&m.preventDefault()}},onResize:()=>{d.current&&a.viewport&&i&&n({content:a.viewport.scrollWidth,viewport:a.viewport.offsetWidth,scrollbar:{size:d.current.clientWidth,paddingStart:$(i.paddingLeft),paddingEnd:$(i.paddingRight)}})}})}),jt=l.forwardRef((t,r)=>{const{sizes:s,onSizesChange:n,...o}=t,a=v(w,t.__scopeScrollArea),[i,c]=l.useState(),d=l.useRef(null),u=P(r,d,a.onScrollbarYChange);return l.useEffect(()=>{d.current&&c(getComputedStyle(d.current))},[d]),e.jsx(it,{"data-orientation":"vertical",...o,ref:u,sizes:s,style:{top:0,right:a.dir==="ltr"?0:void 0,left:a.dir==="rtl"?0:void 0,bottom:"var(--radix-scroll-area-corner-height)","--radix-scroll-area-thumb-height":J(s)+"px",...t.style},onThumbPointerDown:m=>t.onThumbPointerDown(m.y),onDragScroll:m=>t.onDragScroll(m.y),onWheelScroll:(m,p)=>{if(a.viewport){const h=a.viewport.scrollTop+m.deltaY;t.onWheelScroll(h),ut(h,p)&&m.preventDefault()}},onResize:()=>{d.current&&a.viewport&&i&&n({content:a.viewport.scrollHeight,viewport:a.viewport.offsetHeight,scrollbar:{size:d.current.clientHeight,paddingStart:$(i.paddingTop),paddingEnd:$(i.paddingBottom)}})}})}),[At,lt]=rt(w),it=l.forwardRef((t,r)=>{const{__scopeScrollArea:s,sizes:n,hasThumb:o,onThumbChange:a,onThumbPointerUp:i,onThumbPointerDown:c,onThumbPositionChange:d,onDragScroll:u,onWheelScroll:m,onResize:p,...h}=t,x=v(w,s),[g,k]=l.useState(null),K=P(r,f=>k(f)),N=l.useRef(null),F=l.useRef(""),Z=x.viewport,M=n.content-n.viewport,U=S(m),E=S(d),V=Q(p,10);function X(f){if(N.current){const y=f.clientX-N.current.left,C=f.clientY-N.current.top;u({x:y,y:C})}}return l.useEffect(()=>{const f=y=>{const C=y.target;(g==null?void 0:g.contains(C))&&U(y,M)};return document.addEventListener("wheel",f,{passive:!1}),()=>document.removeEventListener("wheel",f,{passive:!1})},[Z,g,M,U]),l.useEffect(E,[n,E]),T(g,V),T(x.content,V),e.jsx(At,{scope:s,scrollbar:g,hasThumb:o,onThumbChange:S(a),onThumbPointerUp:S(i),onThumbPositionChange:E,onThumbPointerDown:S(c),children:e.jsx(B.div,{...h,ref:K,style:{position:"absolute",...h.style},onPointerDown:j(t.onPointerDown,f=>{f.button===0&&(f.target.setPointerCapture(f.pointerId),N.current=g.getBoundingClientRect(),F.current=document.body.style.webkitUserSelect,document.body.style.webkitUserSelect="none",x.viewport&&(x.viewport.style.scrollBehavior="auto"),X(f))}),onPointerMove:j(t.onPointerMove,X),onPointerUp:j(t.onPointerUp,f=>{const y=f.target;y.hasPointerCapture(f.pointerId)&&y.releasePointerCapture(f.pointerId),document.body.style.webkitUserSelect=F.current,x.viewport&&(x.viewport.style.scrollBehavior=""),N.current=null})})})}),q="ScrollAreaThumb",ct=l.forwardRef((t,r)=>{const{forceMount:s,...n}=t,o=lt(q,t.__scopeScrollArea);return e.jsx(G,{present:s||o.hasThumb,children:e.jsx(Ct,{ref:r,...n})})}),Ct=l.forwardRef((t,r)=>{const{__scopeScrollArea:s,style:n,...o}=t,a=v(q,s),i=lt(q,s),{onThumbPositionChange:c}=i,d=P(r,p=>i.onThumbChange(p)),u=l.useRef(void 0),m=Q(()=>{u.current&&(u.current(),u.current=void 0)},100);return l.useEffect(()=>{const p=a.viewport;if(p){const h=()=>{if(m(),!u.current){const x=kt(p,c);u.current=x,c()}};return c(),p.addEventListener("scroll",h),()=>p.removeEventListener("scroll",h)}},[a.viewport,m,c]),e.jsx(B.div,{"data-state":i.hasThumb?"visible":"hidden",...o,ref:d,style:{width:"var(--radix-scroll-area-thumb-width)",height:"var(--radix-scroll-area-thumb-height)",...n},onPointerDownCapture:j(t.onPointerDownCapture,p=>{const x=p.target.getBoundingClientRect(),g=p.clientX-x.left,k=p.clientY-x.top;i.onThumbPointerDown({x:g,y:k})}),onPointerUp:j(t.onPointerUp,i.onThumbPointerUp)})});ct.displayName=q;var se="ScrollAreaCorner",dt=l.forwardRef((t,r)=>{const s=v(se,t.__scopeScrollArea),n=!!(s.scrollbarX&&s.scrollbarY);return s.type!=="scroll"&&n?e.jsx(Tt,{...t,ref:r}):null});dt.displayName=se;var Tt=l.forwardRef((t,r)=>{const{__scopeScrollArea:s,...n}=t,o=v(se,s),[a,i]=l.useState(0),[c,d]=l.useState(0),u=!!(a&&c);return T(o.scrollbarX,()=>{var p;const m=((p=o.scrollbarX)==null?void 0:p.offsetHeight)||0;o.onCornerHeightChange(m),d(m)}),T(o.scrollbarY,()=>{var p;const m=((p=o.scrollbarY)==null?void 0:p.offsetWidth)||0;o.onCornerWidthChange(m),i(m)}),u?e.jsx(B.div,{...n,ref:r,style:{width:a,height:c,position:"absolute",right:o.dir==="ltr"?0:void 0,left:o.dir==="rtl"?0:void 0,bottom:0,...t.style}}):null});function $(t){return t?parseInt(t,10):0}function mt(t,r){const s=t/r;return isNaN(s)?0:s}function J(t){const r=mt(t.viewport,t.content),s=t.scrollbar.paddingStart+t.scrollbar.paddingEnd,n=(t.scrollbar.size-s)*r;return Math.max(n,18)}function Pt(t,r,s,n="ltr"){const o=J(s),a=o/2,i=r||a,c=o-i,d=s.scrollbar.paddingStart+i,u=s.scrollbar.size-s.scrollbar.paddingEnd-c,m=s.content-s.viewport,p=n==="ltr"?[0,m]:[m*-1,0];return ht([d,u],p)(t)}function oe(t,r,s="ltr"){const n=J(r),o=r.scrollbar.paddingStart+r.scrollbar.paddingEnd,a=r.scrollbar.size-o,i=r.content-r.viewport,c=a-n,d=s==="ltr"?[0,i]:[i*-1,0],u=gt(t,d);return ht([0,i],[0,c])(u)}function ht(t,r){return s=>{if(t[0]===t[1]||r[0]===r[1])return r[0];const n=(r[1]-r[0])/(t[1]-t[0]);return r[0]+n*(s-t[0])}}function ut(t,r){return t>0&&t<r}var kt=(t,r=()=>{})=>{let s={left:t.scrollLeft,top:t.scrollTop},n=0;return function o(){const a={left:t.scrollLeft,top:t.scrollTop},i=s.left!==a.left,c=s.top!==a.top;(i||c)&&r(),s=a,n=window.requestAnimationFrame(o)}(),()=>window.cancelAnimationFrame(n)};function Q(t,r){const s=S(t),n=l.useRef(0);return l.useEffect(()=>()=>window.clearTimeout(n.current),[]),l.useCallback(()=>{window.clearTimeout(n.current),n.current=window.setTimeout(s,r)},[s,r])}function T(t,r){const s=S(r);bt(()=>{let n=0;if(t){const o=new ResizeObserver(()=>{cancelAnimationFrame(n),n=window.requestAnimationFrame(s)});return o.observe(t),()=>{window.cancelAnimationFrame(n),o.unobserve(t)}}},[t,s])}var pt=st,Et=nt,Rt=dt;const b=l.forwardRef(({className:t,children:r,...s},n)=>e.jsxs(pt,{ref:n,className:tt("relative overflow-hidden",t),...s,children:[e.jsx(Et,{className:"h-full w-full rounded-[inherit]",children:r}),e.jsx(A,{}),e.jsx(Rt,{})]}));b.displayName=pt.displayName;const A=l.forwardRef(({className:t,orientation:r="vertical",...s},n)=>e.jsx(te,{ref:n,orientation:r,className:tt("flex touch-none select-none transition-colors",r==="vertical"&&"h-full w-2.5 border-l border-l-transparent p-[1px]",r==="horizontal"&&"h-2.5 flex-col border-t border-t-transparent p-[1px]",t),...s,children:e.jsx(ct,{className:"relative flex-1 rounded-full bg-border"})}));A.displayName=te.displayName;try{b.displayName="ScrollArea",b.__docgenInfo={description:"",displayName:"ScrollArea",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{A.displayName="ScrollBar",A.__docgenInfo={description:"",displayName:"ScrollBar",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}const Vt={title:"Tier 1: Primitives/shadcn/ScrollArea",component:b,parameters:{layout:"centered",docs:{description:{component:"A custom scrollbar component that replaces native browser scrollbars with styled versions. Built on Radix UI ScrollArea primitive for consistent cross-browser behavior."}}},tags:["autodocs"]},R={render:()=>e.jsx(b,{className:"h-72 w-80 rounded-md border p-4",children:e.jsxs("div",{className:"space-y-4",children:[e.jsx("h4",{className:"text-sm font-medium leading-none",children:"The Ocean of Light"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"The ocean represents the vastness of consciousness, where each wave is a thought, each ripple an emotion. In the depths below, silence speaks louder than any word."}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"As we dive deeper into the waters of awareness, we discover treasures long forgotten. Ancient wisdom flows through currents of time, connecting past, present, and future in a single drop of water."}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"The light penetrates the surface, dancing with shadows in an eternal ballet. Each beam carries stories from distant stars, reminding us that we are all stardust floating in an infinite sea."}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"In stillness, we find motion. In darkness, we find light. The paradox of existence unfolds in every moment, waiting for those brave enough to look within."}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"The journey inward is the longest journey, yet it takes no time at all. Space collapses when consciousness expands, revealing that everything we seek has always been here, now, within."})]})})},D={render:()=>e.jsxs(b,{className:"w-96 whitespace-nowrap rounded-md border",children:[e.jsx("div",{className:"flex w-max space-x-4 p-4",children:Array.from({length:8},(t,r)=>e.jsxs("div",{className:"shrink-0 rounded-md bg-slate-100 p-8 text-center",style:{width:"200px"},children:[e.jsxs("h4",{className:"text-sm font-medium",children:["Card ",r+1]}),e.jsx("p",{className:"mt-2 text-xs text-muted-foreground",children:"Scroll horizontally to see more"})]},r))}),e.jsx(A,{orientation:"horizontal"})]})},_={render:()=>e.jsxs(b,{className:"h-72 w-96 rounded-md border",children:[e.jsx("div",{className:"p-4",children:e.jsxs("table",{className:"w-max border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b",children:[e.jsx("th",{className:"px-4 py-2 text-left text-sm font-medium",children:"Name"}),e.jsx("th",{className:"px-4 py-2 text-left text-sm font-medium",children:"Email"}),e.jsx("th",{className:"px-4 py-2 text-left text-sm font-medium",children:"Role"}),e.jsx("th",{className:"px-4 py-2 text-left text-sm font-medium",children:"Department"}),e.jsx("th",{className:"px-4 py-2 text-left text-sm font-medium",children:"Status"}),e.jsx("th",{className:"px-4 py-2 text-left text-sm font-medium",children:"Location"})]})}),e.jsx("tbody",{children:Array.from({length:20},(t,r)=>e.jsxs("tr",{className:"border-b",children:[e.jsxs("td",{className:"px-4 py-2 text-sm",children:["User ",r+1]}),e.jsxs("td",{className:"px-4 py-2 text-sm",children:["user",r+1,"@example.com"]}),e.jsx("td",{className:"px-4 py-2 text-sm",children:"Developer"}),e.jsx("td",{className:"px-4 py-2 text-sm",children:"Engineering"}),e.jsx("td",{className:"px-4 py-2 text-sm",children:"Active"}),e.jsx("td",{className:"px-4 py-2 text-sm",children:"Vienna, Austria"})]},r))})]})}),e.jsx(A,{orientation:"horizontal"})]})},I={render:()=>e.jsx(b,{className:"h-96 w-full max-w-2xl rounded-md border p-6",children:e.jsxs("article",{className:"prose prose-sm max-w-none",children:[e.jsx("h1",{className:"text-2xl font-bold mb-4",children:"Understanding Consciousness"}),e.jsx("h2",{className:"text-xl font-semibold mt-6 mb-3",children:"Introduction"}),e.jsx("p",{className:"text-muted-foreground mb-4",children:"Consciousness remains one of the most fascinating and elusive concepts in both philosophy and neuroscience. It encompasses our subjective experiences, our awareness of ourselves and the world around us, and the mysterious quality of what it feels like to be alive and aware."}),e.jsx("h2",{className:"text-xl font-semibold mt-6 mb-3",children:"The Nature of Awareness"}),e.jsx("p",{className:"text-muted-foreground mb-4",children:'When we examine consciousness, we encounter what philosophers call the "hard problem" - explaining how physical processes in the brain give rise to subjective experiences. Why does the processing of visual information create the experience of seeing the color blue? Why does any physical process have an inner, subjective dimension at all?'}),e.jsx("h2",{className:"text-xl font-semibold mt-6 mb-3",children:"Layers of Consciousness"}),e.jsx("p",{className:"text-muted-foreground mb-4",children:"Consciousness appears to operate on multiple levels simultaneously. At the most basic level, we have sensory awareness - the raw data of sight, sound, touch, taste, and smell. Above this, we have emotional awareness - the feelings that color our experiences. Higher still, we find cognitive awareness - our thoughts, beliefs, and mental models of reality."}),e.jsx("h2",{className:"text-xl font-semibold mt-6 mb-3",children:"The Observer Effect"}),e.jsx("p",{className:"text-muted-foreground mb-4",children:"One of the most intriguing aspects of consciousness is its relationship to observation. In quantum mechanics, the act of observation appears to affect the observed system. This raises profound questions: Does consciousness play a fundamental role in the structure of reality itself? Or is this correlation merely coincidental?"}),e.jsx("h2",{className:"text-xl font-semibold mt-6 mb-3",children:"The Illusion of Self"}),e.jsx("p",{className:"text-muted-foreground mb-4",children:'Many contemplative traditions suggest that the sense of a separate, independent self is itself an illusion created by consciousness. What we experience as "I" may be more accurately described as a process rather than an entity - a flowing stream of experiences without a fixed experiencer.'}),e.jsx("h2",{className:"text-xl font-semibold mt-6 mb-3",children:"Conclusion"}),e.jsx("p",{className:"text-muted-foreground mb-4",children:"As we continue to explore consciousness through both scientific inquiry and direct contemplative practice, we may discover that the boundaries between observer and observed, between mind and matter, are far more fluid than our everyday experience suggests. The ocean of consciousness may be deeper and more mysterious than we ever imagined."})]})})},L={render:()=>e.jsx(b,{className:"h-96 w-full max-w-2xl rounded-md border p-4",children:e.jsx("div",{className:"grid grid-cols-3 gap-4",children:Array.from({length:24},(t,r)=>e.jsx("div",{className:"aspect-square rounded-md bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center",children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"text-4xl mb-2",children:"🌊"}),e.jsxs("p",{className:"text-xs text-muted-foreground",children:["Image ",r+1]})]})},r))})})},W={render:()=>e.jsxs(b,{className:"h-72 w-full max-w-2xl rounded-md border",children:[e.jsx("div",{className:"p-4 bg-slate-950 text-slate-50",children:e.jsx("pre",{className:"text-sm font-mono",children:e.jsx("code",{children:`import { ScrollArea, ScrollBar } from './scroll-area';

export function CodeExample() {
  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <ScrollArea className="h-96 w-full rounded-md border">
      <div className="p-4">
        {data.map((item) => (
          <div key={item.id} className="border-b py-2">
            <h3 className="font-medium">{item.title}</h3>
            <p className="text-sm text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}`})})}),e.jsx(A,{orientation:"horizontal"})]})},O={render:()=>{const t=[{id:1,sender:"Alice",content:"Hey, how are you?",time:"10:30"},{id:2,sender:"You",content:"I'm doing great! Just working on some code.",time:"10:31"},{id:3,sender:"Alice",content:"Nice! What are you building?",time:"10:32"},{id:4,sender:"You",content:"A component library with Storybook. It's pretty interesting!",time:"10:33"},{id:5,sender:"Alice",content:"That sounds cool. Are you using any specific framework?",time:"10:34"},{id:6,sender:"You",content:"Yeah, React with TypeScript and Radix UI primitives.",time:"10:35"},{id:7,sender:"Alice",content:"Radix UI is excellent for accessibility!",time:"10:36"},{id:8,sender:"You",content:"Absolutely! The composability is really powerful too.",time:"10:37"},{id:9,sender:"Alice",content:"Have you tried their ScrollArea component yet?",time:"10:38"},{id:10,sender:"You",content:"Actually, I'm documenting it right now in Storybook! 😄",time:"10:39"}];return e.jsxs("div",{className:"w-96 rounded-lg border bg-background shadow-lg",children:[e.jsxs("div",{className:"border-b p-4",children:[e.jsx("h3",{className:"font-semibold",children:"Chat with Alice"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Online"})]}),e.jsx(b,{className:"h-96 p-4",children:e.jsx("div",{className:"space-y-4",children:t.map(r=>e.jsx("div",{className:`flex ${r.sender==="You"?"justify-end":"justify-start"}`,children:e.jsxs("div",{className:`max-w-[70%] rounded-lg px-4 py-2 ${r.sender==="You"?"bg-blue-500 text-white":"bg-slate-100 text-slate-900"}`,children:[e.jsx("p",{className:"text-sm",children:r.content}),e.jsx("p",{className:`mt-1 text-xs ${r.sender==="You"?"text-blue-100":"text-slate-500"}`,children:r.time})]})},r.id))})}),e.jsx("div",{className:"border-t p-4",children:e.jsx("input",{type:"text",placeholder:"Type a message...",className:"w-full rounded-md border px-3 py-2 text-sm"})})]})}},z={render:()=>{const t=[{category:"Getting Started",items:["Introduction","Installation","Quick Start","Configuration"]},{category:"Components",items:["Button","Input","Select","Checkbox","Radio","Switch","Slider","Dialog","Sheet","Popover","Dropdown Menu","Context Menu","Tooltip"]},{category:"Forms",items:["Form","Form Field","Form Control","Form Label","Form Message","Form Description"]},{category:"Layout",items:["Container","Grid","Flex","Stack","Separator","Divider"]},{category:"Navigation",items:["Breadcrumb","Pagination","Tabs","Menu Bar","Command"]},{category:"Feedback",items:["Alert","Toast","Progress","Skeleton","Spinner"]},{category:"Advanced",items:["ScrollArea","Accordion","Collapsible","Carousel","Calendar","Date Picker"]}];return e.jsxs("div",{className:"w-64 rounded-lg border bg-background shadow-lg",children:[e.jsx("div",{className:"border-b p-4",children:e.jsx("h3",{className:"font-semibold",children:"Documentation"})}),e.jsx(b,{className:"h-96",children:e.jsx("div",{className:"p-4 space-y-4",children:t.map(r=>e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-semibold text-slate-900 mb-2",children:r.category}),e.jsx("ul",{className:"space-y-1",children:r.items.map(s=>e.jsx("li",{children:e.jsx("a",{href:"#",className:"block text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2 py-1 rounded",children:s})},s))})]},r.category))})})]})}},H={render:()=>e.jsxs("div",{className:"space-y-8",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium mb-2",children:"Small (h-48)"}),e.jsx(b,{className:"h-48 w-80 rounded-md border p-4",children:e.jsx("div",{className:"space-y-2",children:Array.from({length:20},(t,r)=>e.jsxs("p",{className:"text-sm",children:["Item ",r+1,": This is a scrollable list item"]},r))})})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium mb-2",children:"Medium (h-72)"}),e.jsx(b,{className:"h-72 w-80 rounded-md border p-4",children:e.jsx("div",{className:"space-y-2",children:Array.from({length:20},(t,r)=>e.jsxs("p",{className:"text-sm",children:["Item ",r+1,": This is a scrollable list item"]},r))})})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium mb-2",children:"Large (h-96)"}),e.jsx(b,{className:"h-96 w-80 rounded-md border p-4",children:e.jsx("div",{className:"space-y-2",children:Array.from({length:20},(t,r)=>e.jsxs("p",{className:"text-sm",children:["Item ",r+1,": This is a scrollable list item"]},r))})})]})]})},Y={render:()=>e.jsxs("div",{className:"w-full max-w-2xl",children:[e.jsx(b,{className:"h-96 rounded-lg border-2 border-[#0ec2bc] p-6",children:e.jsxs("article",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-bold mb-2",style:{color:"#0ec2bc"},children:"Ozean Licht - Ocean of Light"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"A journey through consciousness and awareness"})]}),e.jsxs("section",{className:"space-y-4",children:[e.jsx("h2",{className:"text-xl font-semibold",style:{color:"#0ec2bc"},children:"Our Mission"}),e.jsx("p",{className:"text-muted-foreground leading-relaxed",children:"Ozean Licht is dedicated to exploring the depths of consciousness and sharing transformative content that illuminates the path to greater awareness. Like light penetrating the ocean, our work seeks to bring clarity to the mysterious waters of human experience."})]}),e.jsxs("section",{className:"space-y-4",children:[e.jsx("h2",{className:"text-xl font-semibold",style:{color:"#0ec2bc"},children:"Core Values"}),e.jsxs("ul",{className:"space-y-3",children:[e.jsxs("li",{className:"flex items-start",children:[e.jsx("span",{className:"mr-2 mt-1 text-xl",style:{color:"#0ec2bc"},children:"•"}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-medium",children:"Authenticity"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"We believe in genuine exploration and honest sharing of insights."})]})]}),e.jsxs("li",{className:"flex items-start",children:[e.jsx("span",{className:"mr-2 mt-1 text-xl",style:{color:"#0ec2bc"},children:"•"}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-medium",children:"Compassion"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Every journey is unique, and we honor each individual's path."})]})]}),e.jsxs("li",{className:"flex items-start",children:[e.jsx("span",{className:"mr-2 mt-1 text-xl",style:{color:"#0ec2bc"},children:"•"}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-medium",children:"Curiosity"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"We approach the unknown with wonder and open-mindedness."})]})]}),e.jsxs("li",{className:"flex items-start",children:[e.jsx("span",{className:"mr-2 mt-1 text-xl",style:{color:"#0ec2bc"},children:"•"}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-medium",children:"Integration"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Insights are valuable only when integrated into daily life."})]})]})]})]}),e.jsxs("section",{className:"space-y-4",children:[e.jsx("h2",{className:"text-xl font-semibold",style:{color:"#0ec2bc"},children:"Our Approach"}),e.jsx("p",{className:"text-muted-foreground leading-relaxed",children:"We combine ancient wisdom with modern understanding, creating bridges between contemplative traditions and contemporary life. Through various media formats - articles, videos, podcasts, and interactive experiences - we make profound insights accessible to everyone."}),e.jsx("p",{className:"text-muted-foreground leading-relaxed",children:"The ocean metaphor guides our work: just as the ocean contains infinite depths and diversity, so too does consciousness. We invite you to dive deep, explore freely, and discover the light that shines within the depths of your own awareness."})]}),e.jsx("div",{className:"mt-8 p-4 rounded-md border-2",style:{borderColor:"#0ec2bc",backgroundColor:"rgba(14, 194, 188, 0.05)"},children:e.jsx("p",{className:"text-sm text-center font-medium",style:{color:"#0ec2bc"},children:"Scroll to explore more about our journey through the ocean of light"})})]})}),e.jsx("style",{children:`
        /* Custom scrollbar styling for Ozean Licht theme */
        [data-radix-scroll-area-viewport] {
          scrollbar-color: #0ec2bc transparent;
        }

        [data-radix-scroll-area-viewport]::-webkit-scrollbar-thumb {
          background-color: #0ec2bc;
        }

        [data-radix-scroll-area-viewport]::-webkit-scrollbar-thumb:hover {
          background-color: #0da59f;
        }
      `})]})};var ne,ae,le,ie,ce;R.parameters={...R.parameters,docs:{...(ne=R.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: () => <ScrollArea className="h-72 w-80 rounded-md border p-4">
      <div className="space-y-4">
        <h4 className="text-sm font-medium leading-none">The Ocean of Light</h4>
        <p className="text-sm text-muted-foreground">
          The ocean represents the vastness of consciousness, where each wave is a
          thought, each ripple an emotion. In the depths below, silence speaks louder
          than any word.
        </p>
        <p className="text-sm text-muted-foreground">
          As we dive deeper into the waters of awareness, we discover treasures long
          forgotten. Ancient wisdom flows through currents of time, connecting past,
          present, and future in a single drop of water.
        </p>
        <p className="text-sm text-muted-foreground">
          The light penetrates the surface, dancing with shadows in an eternal ballet.
          Each beam carries stories from distant stars, reminding us that we are all
          stardust floating in an infinite sea.
        </p>
        <p className="text-sm text-muted-foreground">
          In stillness, we find motion. In darkness, we find light. The paradox of
          existence unfolds in every moment, waiting for those brave enough to look
          within.
        </p>
        <p className="text-sm text-muted-foreground">
          The journey inward is the longest journey, yet it takes no time at all.
          Space collapses when consciousness expands, revealing that everything we
          seek has always been here, now, within.
        </p>
      </div>
    </ScrollArea>
}`,...(le=(ae=R.parameters)==null?void 0:ae.docs)==null?void 0:le.source},description:{story:`Default vertical scroll example.

The most basic ScrollArea implementation with vertical scrolling only.`,...(ce=(ie=R.parameters)==null?void 0:ie.docs)==null?void 0:ce.description}}};var de,me,he,ue,pe;D.parameters={...D.parameters,docs:{...(de=D.parameters)==null?void 0:de.docs,source:{originalSource:`{
  render: () => <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {Array.from({
        length: 8
      }, (_, i) => <div key={i} className="shrink-0 rounded-md bg-slate-100 p-8 text-center" style={{
        width: '200px'
      }}>
            <h4 className="text-sm font-medium">Card {i + 1}</h4>
            <p className="mt-2 text-xs text-muted-foreground">
              Scroll horizontally to see more
            </p>
          </div>)}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
}`,...(he=(me=D.parameters)==null?void 0:me.docs)==null?void 0:he.source},description:{story:`Horizontal scroll example.

Shows horizontal scrolling with explicit ScrollBar component.`,...(pe=(ue=D.parameters)==null?void 0:ue.docs)==null?void 0:pe.description}}};var xe,fe,be,ge,ve;_.parameters={..._.parameters,docs:{...(xe=_.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  render: () => <ScrollArea className="h-72 w-96 rounded-md border">
      <div className="p-4">
        <table className="w-max border-collapse">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left text-sm font-medium">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Email</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Role</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Department</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Location</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({
            length: 20
          }, (_, i) => <tr key={i} className="border-b">
                <td className="px-4 py-2 text-sm">User {i + 1}</td>
                <td className="px-4 py-2 text-sm">user{i + 1}@example.com</td>
                <td className="px-4 py-2 text-sm">Developer</td>
                <td className="px-4 py-2 text-sm">Engineering</td>
                <td className="px-4 py-2 text-sm">Active</td>
                <td className="px-4 py-2 text-sm">Vienna, Austria</td>
              </tr>)}
          </tbody>
        </table>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
}`,...(be=(fe=_.parameters)==null?void 0:fe.docs)==null?void 0:be.source},description:{story:`Both directions scroll.

Demonstrates scrolling in both vertical and horizontal directions simultaneously.`,...(ve=(ge=_.parameters)==null?void 0:ge.docs)==null?void 0:ve.description}}};var ye,we,Ne,Se,je;I.parameters={...I.parameters,docs:{...(ye=I.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  render: () => <ScrollArea className="h-96 w-full max-w-2xl rounded-md border p-6">
      <article className="prose prose-sm max-w-none">
        <h1 className="text-2xl font-bold mb-4">Understanding Consciousness</h1>

        <h2 className="text-xl font-semibold mt-6 mb-3">Introduction</h2>
        <p className="text-muted-foreground mb-4">
          Consciousness remains one of the most fascinating and elusive concepts in
          both philosophy and neuroscience. It encompasses our subjective experiences,
          our awareness of ourselves and the world around us, and the mysterious quality
          of what it feels like to be alive and aware.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">The Nature of Awareness</h2>
        <p className="text-muted-foreground mb-4">
          When we examine consciousness, we encounter what philosophers call the
          "hard problem" - explaining how physical processes in the brain give rise
          to subjective experiences. Why does the processing of visual information
          create the experience of seeing the color blue? Why does any physical
          process have an inner, subjective dimension at all?
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Layers of Consciousness</h2>
        <p className="text-muted-foreground mb-4">
          Consciousness appears to operate on multiple levels simultaneously. At the
          most basic level, we have sensory awareness - the raw data of sight, sound,
          touch, taste, and smell. Above this, we have emotional awareness - the
          feelings that color our experiences. Higher still, we find cognitive
          awareness - our thoughts, beliefs, and mental models of reality.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">The Observer Effect</h2>
        <p className="text-muted-foreground mb-4">
          One of the most intriguing aspects of consciousness is its relationship to
          observation. In quantum mechanics, the act of observation appears to affect
          the observed system. This raises profound questions: Does consciousness
          play a fundamental role in the structure of reality itself? Or is this
          correlation merely coincidental?
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">The Illusion of Self</h2>
        <p className="text-muted-foreground mb-4">
          Many contemplative traditions suggest that the sense of a separate,
          independent self is itself an illusion created by consciousness. What we
          experience as "I" may be more accurately described as a process rather
          than an entity - a flowing stream of experiences without a fixed experiencer.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Conclusion</h2>
        <p className="text-muted-foreground mb-4">
          As we continue to explore consciousness through both scientific inquiry and
          direct contemplative practice, we may discover that the boundaries between
          observer and observed, between mind and matter, are far more fluid than our
          everyday experience suggests. The ocean of consciousness may be deeper and
          more mysterious than we ever imagined.
        </p>
      </article>
    </ScrollArea>
}`,...(Ne=(we=I.parameters)==null?void 0:we.docs)==null?void 0:Ne.source},description:{story:`Long text content example.

Common use case for terms of service, privacy policies, or article content.`,...(je=(Se=I.parameters)==null?void 0:Se.docs)==null?void 0:je.description}}};var Ae,Ce,Te,Pe,ke;L.parameters={...L.parameters,docs:{...(Ae=L.parameters)==null?void 0:Ae.docs,source:{originalSource:`{
  render: () => <ScrollArea className="h-96 w-full max-w-2xl rounded-md border p-4">
      <div className="grid grid-cols-3 gap-4">
        {Array.from({
        length: 24
      }, (_, i) => <div key={i} className="aspect-square rounded-md bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🌊</div>
              <p className="text-xs text-muted-foreground">Image {i + 1}</p>
            </div>
          </div>)}
      </div>
    </ScrollArea>
}`,...(Te=(Ce=L.parameters)==null?void 0:Ce.docs)==null?void 0:Te.source},description:{story:`Image gallery example.

Demonstrates scrollable grid of images/thumbnails.`,...(ke=(Pe=L.parameters)==null?void 0:Pe.docs)==null?void 0:ke.description}}};var Ee,Re,De,_e,Ie;W.parameters={...W.parameters,docs:{...(Ee=W.parameters)==null?void 0:Ee.docs,source:{originalSource:`{
  render: () => <ScrollArea className="h-72 w-full max-w-2xl rounded-md border">
      <div className="p-4 bg-slate-950 text-slate-50">
        <pre className="text-sm font-mono">
          <code>{\`import { ScrollArea, ScrollBar } from './scroll-area';

export function CodeExample() {
  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <ScrollArea className="h-96 w-full rounded-md border">
      <div className="p-4">
        {data.map((item) => (
          <div key={item.id} className="border-b py-2">
            <h3 className="font-medium">{item.title}</h3>
            <p className="text-sm text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}\`}</code>
        </pre>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
}`,...(De=(Re=W.parameters)==null?void 0:Re.docs)==null?void 0:De.source},description:{story:`Code block with syntax highlighting.

Common pattern for displaying code snippets with scrollable overflow.`,...(Ie=(_e=W.parameters)==null?void 0:_e.docs)==null?void 0:Ie.description}}};var Le,We,Oe,ze,He;O.parameters={...O.parameters,docs:{...(Le=O.parameters)==null?void 0:Le.docs,source:{originalSource:`{
  render: () => {
    const messages = [{
      id: 1,
      sender: 'Alice',
      content: 'Hey, how are you?',
      time: '10:30'
    }, {
      id: 2,
      sender: 'You',
      content: 'I\\'m doing great! Just working on some code.',
      time: '10:31'
    }, {
      id: 3,
      sender: 'Alice',
      content: 'Nice! What are you building?',
      time: '10:32'
    }, {
      id: 4,
      sender: 'You',
      content: 'A component library with Storybook. It\\'s pretty interesting!',
      time: '10:33'
    }, {
      id: 5,
      sender: 'Alice',
      content: 'That sounds cool. Are you using any specific framework?',
      time: '10:34'
    }, {
      id: 6,
      sender: 'You',
      content: 'Yeah, React with TypeScript and Radix UI primitives.',
      time: '10:35'
    }, {
      id: 7,
      sender: 'Alice',
      content: 'Radix UI is excellent for accessibility!',
      time: '10:36'
    }, {
      id: 8,
      sender: 'You',
      content: 'Absolutely! The composability is really powerful too.',
      time: '10:37'
    }, {
      id: 9,
      sender: 'Alice',
      content: 'Have you tried their ScrollArea component yet?',
      time: '10:38'
    }, {
      id: 10,
      sender: 'You',
      content: 'Actually, I\\'m documenting it right now in Storybook! 😄',
      time: '10:39'
    }];
    return <div className="w-96 rounded-lg border bg-background shadow-lg">
        <div className="border-b p-4">
          <h3 className="font-semibold">Chat with Alice</h3>
          <p className="text-xs text-muted-foreground">Online</p>
        </div>

        <ScrollArea className="h-96 p-4">
          <div className="space-y-4">
            {messages.map(message => <div key={message.id} className={\`flex \${message.sender === 'You' ? 'justify-end' : 'justify-start'}\`}>
                <div className={\`max-w-[70%] rounded-lg px-4 py-2 \${message.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-900'}\`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={\`mt-1 text-xs \${message.sender === 'You' ? 'text-blue-100' : 'text-slate-500'}\`}>
                    {message.time}
                  </p>
                </div>
              </div>)}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <input type="text" placeholder="Type a message..." className="w-full rounded-md border px-3 py-2 text-sm" />
        </div>
      </div>;
  }
}`,...(Oe=(We=O.parameters)==null?void 0:We.docs)==null?void 0:Oe.source},description:{story:`Chat window example.

Demonstrates a typical chat interface with scrollable message history.`,...(He=(ze=O.parameters)==null?void 0:ze.docs)==null?void 0:He.description}}};var Ye,Be,Fe,Me,Ue;z.parameters={...z.parameters,docs:{...(Ye=z.parameters)==null?void 0:Ye.docs,source:{originalSource:`{
  render: () => {
    const menuItems = [{
      category: 'Getting Started',
      items: ['Introduction', 'Installation', 'Quick Start', 'Configuration']
    }, {
      category: 'Components',
      items: ['Button', 'Input', 'Select', 'Checkbox', 'Radio', 'Switch', 'Slider', 'Dialog', 'Sheet', 'Popover', 'Dropdown Menu', 'Context Menu', 'Tooltip']
    }, {
      category: 'Forms',
      items: ['Form', 'Form Field', 'Form Control', 'Form Label', 'Form Message', 'Form Description']
    }, {
      category: 'Layout',
      items: ['Container', 'Grid', 'Flex', 'Stack', 'Separator', 'Divider']
    }, {
      category: 'Navigation',
      items: ['Breadcrumb', 'Pagination', 'Tabs', 'Menu Bar', 'Command']
    }, {
      category: 'Feedback',
      items: ['Alert', 'Toast', 'Progress', 'Skeleton', 'Spinner']
    }, {
      category: 'Advanced',
      items: ['ScrollArea', 'Accordion', 'Collapsible', 'Carousel', 'Calendar', 'Date Picker']
    }];
    return <div className="w-64 rounded-lg border bg-background shadow-lg">
        <div className="border-b p-4">
          <h3 className="font-semibold">Documentation</h3>
        </div>

        <ScrollArea className="h-96">
          <div className="p-4 space-y-4">
            {menuItems.map(section => <div key={section.category}>
                <h4 className="text-sm font-semibold text-slate-900 mb-2">
                  {section.category}
                </h4>
                <ul className="space-y-1">
                  {section.items.map(item => <li key={item}>
                      <a href="#" className="block text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2 py-1 rounded">
                        {item}
                      </a>
                    </li>)}
                </ul>
              </div>)}
          </div>
        </ScrollArea>
      </div>;
  }
}`,...(Fe=(Be=z.parameters)==null?void 0:Be.docs)==null?void 0:Fe.source},description:{story:`Sidebar navigation menu.

Shows a typical sidebar with scrollable navigation links.`,...(Ue=(Me=z.parameters)==null?void 0:Me.docs)==null?void 0:Ue.description}}};var Ve,Xe,qe,$e,Ge;H.parameters={...H.parameters,docs:{...(Ve=H.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
  render: () => <div className="space-y-8">
      <div>
        <h4 className="text-sm font-medium mb-2">Small (h-48)</h4>
        <ScrollArea className="h-48 w-80 rounded-md border p-4">
          <div className="space-y-2">
            {Array.from({
            length: 20
          }, (_, i) => <p key={i} className="text-sm">
                Item {i + 1}: This is a scrollable list item
              </p>)}
          </div>
        </ScrollArea>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Medium (h-72)</h4>
        <ScrollArea className="h-72 w-80 rounded-md border p-4">
          <div className="space-y-2">
            {Array.from({
            length: 20
          }, (_, i) => <p key={i} className="text-sm">
                Item {i + 1}: This is a scrollable list item
              </p>)}
          </div>
        </ScrollArea>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Large (h-96)</h4>
        <ScrollArea className="h-96 w-80 rounded-md border p-4">
          <div className="space-y-2">
            {Array.from({
            length: 20
          }, (_, i) => <p key={i} className="text-sm">
                Item {i + 1}: This is a scrollable list item
              </p>)}
          </div>
        </ScrollArea>
      </div>
    </div>
}`,...(qe=(Xe=H.parameters)==null?void 0:Xe.docs)==null?void 0:qe.source},description:{story:`Custom height variations.

Shows different height configurations for various use cases.`,...(Ge=($e=H.parameters)==null?void 0:$e.docs)==null?void 0:Ge.description}}};var Je,Qe,Ke,Ze,et;Y.parameters={...Y.parameters,docs:{...(Je=Y.parameters)==null?void 0:Je.docs,source:{originalSource:`{
  render: () => <div className="w-full max-w-2xl">
      <ScrollArea className="h-96 rounded-lg border-2 border-[#0ec2bc] p-6">
        <article className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{
            color: '#0ec2bc'
          }}>
              Ozean Licht - Ocean of Light
            </h1>
            <p className="text-sm text-muted-foreground">
              A journey through consciousness and awareness
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold" style={{
            color: '#0ec2bc'
          }}>
              Our Mission
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Ozean Licht is dedicated to exploring the depths of consciousness and
              sharing transformative content that illuminates the path to greater
              awareness. Like light penetrating the ocean, our work seeks to bring
              clarity to the mysterious waters of human experience.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold" style={{
            color: '#0ec2bc'
          }}>
              Core Values
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-xl" style={{
                color: '#0ec2bc'
              }}>
                  •
                </span>
                <div>
                  <h3 className="font-medium">Authenticity</h3>
                  <p className="text-sm text-muted-foreground">
                    We believe in genuine exploration and honest sharing of insights.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-xl" style={{
                color: '#0ec2bc'
              }}>
                  •
                </span>
                <div>
                  <h3 className="font-medium">Compassion</h3>
                  <p className="text-sm text-muted-foreground">
                    Every journey is unique, and we honor each individual's path.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-xl" style={{
                color: '#0ec2bc'
              }}>
                  •
                </span>
                <div>
                  <h3 className="font-medium">Curiosity</h3>
                  <p className="text-sm text-muted-foreground">
                    We approach the unknown with wonder and open-mindedness.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-xl" style={{
                color: '#0ec2bc'
              }}>
                  •
                </span>
                <div>
                  <h3 className="font-medium">Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Insights are valuable only when integrated into daily life.
                  </p>
                </div>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold" style={{
            color: '#0ec2bc'
          }}>
              Our Approach
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We combine ancient wisdom with modern understanding, creating bridges
              between contemplative traditions and contemporary life. Through various
              media formats - articles, videos, podcasts, and interactive experiences -
              we make profound insights accessible to everyone.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The ocean metaphor guides our work: just as the ocean contains infinite
              depths and diversity, so too does consciousness. We invite you to dive
              deep, explore freely, and discover the light that shines within the
              depths of your own awareness.
            </p>
          </section>

          <div className="mt-8 p-4 rounded-md border-2" style={{
          borderColor: '#0ec2bc',
          backgroundColor: 'rgba(14, 194, 188, 0.05)'
        }}>
            <p className="text-sm text-center font-medium" style={{
            color: '#0ec2bc'
          }}>
              Scroll to explore more about our journey through the ocean of light
            </p>
          </div>
        </article>
      </ScrollArea>

      <style>{\`
        /* Custom scrollbar styling for Ozean Licht theme */
        [data-radix-scroll-area-viewport] {
          scrollbar-color: #0ec2bc transparent;
        }

        [data-radix-scroll-area-viewport]::-webkit-scrollbar-thumb {
          background-color: #0ec2bc;
        }

        [data-radix-scroll-area-viewport]::-webkit-scrollbar-thumb:hover {
          background-color: #0da59f;
        }
      \`}</style>
    </div>
}`,...(Ke=(Qe=Y.parameters)==null?void 0:Qe.docs)==null?void 0:Ke.source},description:{story:`Ozean Licht themed example.

Demonstrates the ScrollArea with Ozean Licht turquoise accent color (#0ec2bc).`,...(et=(Ze=Y.parameters)==null?void 0:Ze.docs)==null?void 0:et.description}}};const Xt=["Default","HorizontalScroll","BothDirections","WithLongContent","WithImages","CodeBlock","ChatWindow","SidebarMenu","CustomHeight","OzeanLichtThemed"];export{_ as BothDirections,O as ChatWindow,W as CodeBlock,H as CustomHeight,R as Default,D as HorizontalScroll,Y as OzeanLichtThemed,z as SidebarMenu,L as WithImages,I as WithLongContent,Xt as __namedExportsOrder,Vt as default};
