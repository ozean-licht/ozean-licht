import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{w as xr,u as Ye,e as Sn}from"./index-CJu6nLMj.js";import{R as a,r as oe}from"./index-B2-qRKKC.js";import{T as Bn,C as kn,R as En,b as Rn,D as On,P as _n,a as Pn,O as Ln}from"./index-B4UjR001.js";import{c as ge}from"./cn-CytzSlOG.js";import{B as d}from"./button-BHL6w8gg.js";import{L as ce}from"./label-Cp9r14oL.js";import{I as de}from"./input-Db9iZ-Hs.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-D5ysUGwq.js";import"./index-kS-9iBlu.js";import"./index-BFjtS4uE.js";import"./index-CpxwHbl5.js";import"./index-D1vk04JX.js";import"./index-BlCrtW8-.js";import"./index-DwPv8f4P.js";import"./index-ciuW_uyV.js";import"./index-DEKUlYuO.js";import"./index-B3Lresjw.js";import"./index-PNzqWif7.js";import"./index-BiMR7eR1.js";import"./index-DVF2XGCm.js";import"./index-B5oyz0SX.js";function Hn(r){if(typeof document>"u")return;let n=document.head||document.getElementsByTagName("head")[0],t=document.createElement("style");t.type="text/css",n.appendChild(t),t.styleSheet?t.styleSheet.cssText=r:t.appendChild(document.createTextNode(r))}const en=a.createContext({drawerRef:{current:null},overlayRef:{current:null},onPress:()=>{},onRelease:()=>{},onDrag:()=>{},onNestedDrag:()=>{},onNestedOpenChange:()=>{},onNestedRelease:()=>{},openProp:void 0,dismissible:!1,isOpen:!1,isDragging:!1,keyboardIsOpen:{current:!1},snapPointsOffset:null,snapPoints:null,handleOnly:!1,modal:!1,shouldFade:!1,activeSnapPoint:null,onOpenChange:()=>{},setActiveSnapPoint:()=>{},closeDrawer:()=>{},direction:"bottom",shouldAnimate:{current:!0},shouldScaleBackground:!1,setBackgroundColorOnScale:!0,noBodyStyles:!1,container:null,autoFocus:!1}),Ve=()=>{const r=a.useContext(en);if(!r)throw new Error("useDrawerContext must be used within a Drawer.Root");return r};Hn(`[data-vaul-drawer]{touch-action:none;will-change:transform;transition:transform .5s cubic-bezier(.32, .72, 0, 1);animation-duration:.5s;animation-timing-function:cubic-bezier(0.32,0.72,0,1)}[data-vaul-drawer][data-vaul-snap-points=false][data-vaul-drawer-direction=bottom][data-state=open]{animation-name:slideFromBottom}[data-vaul-drawer][data-vaul-snap-points=false][data-vaul-drawer-direction=bottom][data-state=closed]{animation-name:slideToBottom}[data-vaul-drawer][data-vaul-snap-points=false][data-vaul-drawer-direction=top][data-state=open]{animation-name:slideFromTop}[data-vaul-drawer][data-vaul-snap-points=false][data-vaul-drawer-direction=top][data-state=closed]{animation-name:slideToTop}[data-vaul-drawer][data-vaul-snap-points=false][data-vaul-drawer-direction=left][data-state=open]{animation-name:slideFromLeft}[data-vaul-drawer][data-vaul-snap-points=false][data-vaul-drawer-direction=left][data-state=closed]{animation-name:slideToLeft}[data-vaul-drawer][data-vaul-snap-points=false][data-vaul-drawer-direction=right][data-state=open]{animation-name:slideFromRight}[data-vaul-drawer][data-vaul-snap-points=false][data-vaul-drawer-direction=right][data-state=closed]{animation-name:slideToRight}[data-vaul-drawer][data-vaul-snap-points=true][data-vaul-drawer-direction=bottom]{transform:translate3d(0,var(--initial-transform,100%),0)}[data-vaul-drawer][data-vaul-snap-points=true][data-vaul-drawer-direction=top]{transform:translate3d(0,calc(var(--initial-transform,100%) * -1),0)}[data-vaul-drawer][data-vaul-snap-points=true][data-vaul-drawer-direction=left]{transform:translate3d(calc(var(--initial-transform,100%) * -1),0,0)}[data-vaul-drawer][data-vaul-snap-points=true][data-vaul-drawer-direction=right]{transform:translate3d(var(--initial-transform,100%),0,0)}[data-vaul-drawer][data-vaul-delayed-snap-points=true][data-vaul-drawer-direction=top]{transform:translate3d(0,var(--snap-point-height,0),0)}[data-vaul-drawer][data-vaul-delayed-snap-points=true][data-vaul-drawer-direction=bottom]{transform:translate3d(0,var(--snap-point-height,0),0)}[data-vaul-drawer][data-vaul-delayed-snap-points=true][data-vaul-drawer-direction=left]{transform:translate3d(var(--snap-point-height,0),0,0)}[data-vaul-drawer][data-vaul-delayed-snap-points=true][data-vaul-drawer-direction=right]{transform:translate3d(var(--snap-point-height,0),0,0)}[data-vaul-overlay][data-vaul-snap-points=false]{animation-duration:.5s;animation-timing-function:cubic-bezier(0.32,0.72,0,1)}[data-vaul-overlay][data-vaul-snap-points=false][data-state=open]{animation-name:fadeIn}[data-vaul-overlay][data-state=closed]{animation-name:fadeOut}[data-vaul-animate=false]{animation:none!important}[data-vaul-overlay][data-vaul-snap-points=true]{opacity:0;transition:opacity .5s cubic-bezier(.32, .72, 0, 1)}[data-vaul-overlay][data-vaul-snap-points=true]{opacity:1}[data-vaul-drawer]:not([data-vaul-custom-container=true])::after{content:'';position:absolute;background:inherit;background-color:inherit}[data-vaul-drawer][data-vaul-drawer-direction=top]::after{top:initial;bottom:100%;left:0;right:0;height:200%}[data-vaul-drawer][data-vaul-drawer-direction=bottom]::after{top:100%;bottom:initial;left:0;right:0;height:200%}[data-vaul-drawer][data-vaul-drawer-direction=left]::after{left:initial;right:100%;top:0;bottom:0;width:200%}[data-vaul-drawer][data-vaul-drawer-direction=right]::after{left:100%;right:initial;top:0;bottom:0;width:200%}[data-vaul-overlay][data-vaul-snap-points=true]:not([data-vaul-snap-points-overlay=true]):not(
[data-state=closed]
){opacity:0}[data-vaul-overlay][data-vaul-snap-points-overlay=true]{opacity:1}[data-vaul-handle]{display:block;position:relative;opacity:.7;background:#e2e2e4;margin-left:auto;margin-right:auto;height:5px;width:32px;border-radius:1rem;touch-action:pan-y}[data-vaul-handle]:active,[data-vaul-handle]:hover{opacity:1}[data-vaul-handle-hitarea]{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:max(100%,2.75rem);height:max(100%,2.75rem);touch-action:inherit}@media (hover:hover) and (pointer:fine){[data-vaul-drawer]{user-select:none}}@media (pointer:fine){[data-vaul-handle-hitarea]:{width:100%;height:100%}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes fadeOut{to{opacity:0}}@keyframes slideFromBottom{from{transform:translate3d(0,var(--initial-transform,100%),0)}to{transform:translate3d(0,0,0)}}@keyframes slideToBottom{to{transform:translate3d(0,var(--initial-transform,100%),0)}}@keyframes slideFromTop{from{transform:translate3d(0,calc(var(--initial-transform,100%) * -1),0)}to{transform:translate3d(0,0,0)}}@keyframes slideToTop{to{transform:translate3d(0,calc(var(--initial-transform,100%) * -1),0)}}@keyframes slideFromLeft{from{transform:translate3d(calc(var(--initial-transform,100%) * -1),0,0)}to{transform:translate3d(0,0,0)}}@keyframes slideToLeft{to{transform:translate3d(calc(var(--initial-transform,100%) * -1),0,0)}}@keyframes slideFromRight{from{transform:translate3d(var(--initial-transform,100%),0,0)}to{transform:translate3d(0,0,0)}}@keyframes slideToRight{to{transform:translate3d(var(--initial-transform,100%),0,0)}}`);function An(){const r=navigator.userAgent;return typeof window<"u"&&(/Firefox/.test(r)&&/Mobile/.test(r)||/FxiOS/.test(r))}function qn(){return sr(/^Mac/)}function Fn(){return sr(/^iPhone/)}function vr(){return/^((?!chrome|android).)*safari/i.test(navigator.userAgent)}function Mn(){return sr(/^iPad/)||qn()&&navigator.maxTouchPoints>1}function rn(){return Fn()||Mn()}function sr(r){return typeof window<"u"&&window.navigator!=null?r.test(window.navigator.platform):void 0}const In=24,$n=typeof window<"u"?oe.useLayoutEffect:oe.useEffect;function Dr(...r){return(...n)=>{for(let t of r)typeof t=="function"&&t(...n)}}const rr=typeof document<"u"&&window.visualViewport;function yr(r){let n=window.getComputedStyle(r);return/(auto|scroll)/.test(n.overflow+n.overflowX+n.overflowY)}function tn(r){for(yr(r)&&(r=r.parentElement);r&&!yr(r);)r=r.parentElement;return r||document.scrollingElement||document.documentElement}const Vn=new Set(["checkbox","radio","range","color","file","image","button","submit","reset"]);let Xe=0,tr;function Wn(r={}){let{isDisabled:n}=r;$n(()=>{if(!n)return Xe++,Xe===1&&rn()&&(tr=Un()),()=>{Xe--,Xe===0&&(tr==null||tr())}},[n])}function Un(){let r,n=0,t=w=>{r=tn(w.target),!(r===document.documentElement&&r===document.body)&&(n=w.changedTouches[0].pageY)},o=w=>{if(!r||r===document.documentElement||r===document.body){w.preventDefault();return}let f=w.changedTouches[0].pageY,G=r.scrollTop,Y=r.scrollHeight-r.clientHeight;Y!==0&&((G<=0&&f>n||G>=Y&&f<n)&&w.preventDefault(),n=f)},s=w=>{let f=w.target;or(f)&&f!==document.activeElement&&(w.preventDefault(),f.style.transform="translateY(-2000px)",f.focus(),requestAnimationFrame(()=>{f.style.transform=""}))},i=w=>{let f=w.target;or(f)&&(f.style.transform="translateY(-2000px)",requestAnimationFrame(()=>{f.style.transform="",rr&&(rr.height<window.innerHeight?requestAnimationFrame(()=>{br(f)}):rr.addEventListener("resize",()=>br(f),{once:!0}))}))},v=()=>{window.scrollTo(0,0)},h=window.pageXOffset,j=window.pageYOffset,N=Dr(zn(document.documentElement,"paddingRight",`${window.innerWidth-document.documentElement.clientWidth}px`));window.scrollTo(0,0);let x=Dr(Ce(document,"touchstart",t,{passive:!1,capture:!0}),Ce(document,"touchmove",o,{passive:!1,capture:!0}),Ce(document,"touchend",s,{passive:!1,capture:!0}),Ce(document,"focus",i,!0),Ce(window,"scroll",v));return()=>{N(),x(),window.scrollTo(h,j)}}function zn(r,n,t){let o=r.style[n];return r.style[n]=t,()=>{r.style[n]=o}}function Ce(r,n,t,o){return r.addEventListener(n,t,o),()=>{r.removeEventListener(n,t,o)}}function br(r){let n=document.scrollingElement||document.documentElement;for(;r&&r!==n;){let t=tn(r);if(t!==document.documentElement&&t!==document.body&&t!==r){let o=t.getBoundingClientRect().top,s=r.getBoundingClientRect().top,i=r.getBoundingClientRect().bottom;const v=t.getBoundingClientRect().bottom+In;i>v&&(t.scrollTop+=s-o)}r=t.parentElement}}function or(r){return r instanceof HTMLInputElement&&!Vn.has(r.type)||r instanceof HTMLTextAreaElement||r instanceof HTMLElement&&r.isContentEditable}function Yn(r,n){typeof r=="function"?r(n):r!=null&&(r.current=n)}function Xn(...r){return n=>r.forEach(t=>Yn(t,n))}function nn(...r){return oe.useCallback(Xn(...r),r)}const an=new WeakMap;function q(r,n,t=!1){if(!r||!(r instanceof HTMLElement))return;let o={};Object.entries(n).forEach(([s,i])=>{if(s.startsWith("--")){r.style.setProperty(s,i);return}o[s]=r.style[s],r.style[s]=i}),!t&&an.set(r,o)}function Gn(r,n){if(!r||!(r instanceof HTMLElement))return;let t=an.get(r);t&&(r.style[n]=t[n])}const A=r=>{switch(r){case"top":case"bottom":return!0;case"left":case"right":return!1;default:return r}};function Ge(r,n){if(!r)return null;const t=window.getComputedStyle(r),o=t.transform||t.webkitTransform||t.mozTransform;let s=o.match(/^matrix3d\((.+)\)$/);return s?parseFloat(s[1].split(", ")[A(n)?13:12]):(s=o.match(/^matrix\((.+)\)$/),s?parseFloat(s[1].split(", ")[A(n)?5:4]):null)}function Kn(r){return 8*(Math.log(r+1)-2)}function nr(r,n){if(!r)return()=>{};const t=r.style.cssText;return Object.assign(r.style,n),()=>{r.style.cssText=t}}function Qn(...r){return(...n)=>{for(const t of r)typeof t=="function"&&t(...n)}}const k={DURATION:.5,EASE:[.32,.72,0,1]},on=.4,Jn=.25,Zn=100,sn=8,me=16,ir=26,ar="vaul-dragging";function ln(r){const n=a.useRef(r);return a.useEffect(()=>{n.current=r}),a.useMemo(()=>(...t)=>n.current==null?void 0:n.current.call(n,...t),[])}function ea({defaultProp:r,onChange:n}){const t=a.useState(r),[o]=t,s=a.useRef(o),i=ln(n);return a.useEffect(()=>{s.current!==o&&(i(o),s.current=o)},[o,s,i]),t}function cn({prop:r,defaultProp:n,onChange:t=()=>{}}){const[o,s]=ea({defaultProp:n,onChange:t}),i=r!==void 0,v=i?r:o,h=ln(t),j=a.useCallback(N=>{if(i){const w=typeof N=="function"?N(r):N;w!==r&&h(w)}else s(N)},[i,r,s,h]);return[v,j]}function ra({activeSnapPointProp:r,setActiveSnapPointProp:n,snapPoints:t,drawerRef:o,overlayRef:s,fadeFromIndex:i,onSnapPointChange:v,direction:h="bottom",container:j,snapToSequentialPoint:N}){const[x,w]=cn({prop:r,defaultProp:t==null?void 0:t[0],onChange:n}),[f,G]=a.useState(typeof window<"u"?{innerWidth:window.innerWidth,innerHeight:window.innerHeight}:void 0);a.useEffect(()=>{function u(){G({innerWidth:window.innerWidth,innerHeight:window.innerHeight})}return window.addEventListener("resize",u),()=>window.removeEventListener("resize",u)},[]);const Y=a.useMemo(()=>x===(t==null?void 0:t[t.length-1])||null,[t,x]),B=a.useMemo(()=>{var u;return(u=t==null?void 0:t.findIndex(b=>b===x))!=null?u:null},[t,x]),K=t&&t.length>0&&(i||i===0)&&!Number.isNaN(i)&&t[i]===x||!t,g=a.useMemo(()=>{const u=j?{width:j.getBoundingClientRect().width,height:j.getBoundingClientRect().height}:typeof window<"u"?{width:window.innerWidth,height:window.innerHeight}:{width:0,height:0};var b;return(b=t==null?void 0:t.map(y=>{const W=typeof y=="string";let $=0;if(W&&($=parseInt(y,10)),A(h)){const c=W?$:f?y*u.height:0;return f?h==="bottom"?u.height-c:-u.height+c:c}const J=W?$:f?y*u.width:0;return f?h==="right"?u.width-J:-u.width+J:J}))!=null?b:[]},[t,f,j]),I=a.useMemo(()=>B!==null?g==null?void 0:g[B]:null,[g,B]),F=a.useCallback(u=>{var b;const y=(b=g==null?void 0:g.findIndex(W=>W===u))!=null?b:null;v(y),q(o.current,{transition:`transform ${k.DURATION}s cubic-bezier(${k.EASE.join(",")})`,transform:A(h)?`translate3d(0, ${u}px, 0)`:`translate3d(${u}px, 0, 0)`}),g&&y!==g.length-1&&i!==void 0&&y!==i&&y<i?q(s.current,{transition:`opacity ${k.DURATION}s cubic-bezier(${k.EASE.join(",")})`,opacity:"0"}):q(s.current,{transition:`opacity ${k.DURATION}s cubic-bezier(${k.EASE.join(",")})`,opacity:"1"}),w(t==null?void 0:t[Math.max(y,0)])},[o.current,t,g,i,s,w]);a.useEffect(()=>{if(x||r){var u;const b=(u=t==null?void 0:t.findIndex(y=>y===r||y===x))!=null?u:-1;g&&b!==-1&&typeof g[b]=="number"&&F(g[b])}},[x,r,t,g,F]);function p({draggedDistance:u,closeDrawer:b,velocity:y,dismissible:W}){if(i===void 0)return;const $=h==="bottom"||h==="right"?(I??0)-u:(I??0)+u,J=B===i-1,c=B===0,Q=u>0;if(J&&q(s.current,{transition:`opacity ${k.DURATION}s cubic-bezier(${k.EASE.join(",")})`}),!N&&y>2&&!Q){W?b():F(g[0]);return}if(!N&&y>2&&Q&&g&&t){F(g[t.length-1]);return}const U=g==null?void 0:g.reduce((V,ae)=>typeof V!="number"||typeof ae!="number"?V:Math.abs(ae-$)<Math.abs(V-$)?ae:V),Z=A(h)?window.innerHeight:window.innerWidth;if(y>on&&Math.abs(u)<Z*.4){const V=Q?1:-1;if(V>0&&Y&&t){F(g[t.length-1]);return}if(c&&V<0&&W&&b(),B===null)return;F(g[B+V]);return}F(U)}function te({draggedDistance:u}){if(I===null)return;const b=h==="bottom"||h==="right"?I-u:I+u;(h==="bottom"||h==="right")&&b<g[g.length-1]||(h==="top"||h==="left")&&b>g[g.length-1]||q(o.current,{transform:A(h)?`translate3d(0, ${b}px, 0)`:`translate3d(${b}px, 0, 0)`})}function ue(u,b){if(!t||typeof B!="number"||!g||i===void 0)return null;const y=B===i-1;if(B>=i&&b)return 0;if(y&&!b)return 1;if(!K&&!y)return null;const $=y?B+1:B-1,J=y?g[$]-g[$-1]:g[$+1]-g[$],c=u/Math.abs(J);return y?1-c:c}return{isLastSnapPoint:Y,activeSnapPoint:x,shouldFade:K,getPercentageDragged:ue,setActiveSnapPoint:w,activeSnapPointIndex:B,onRelease:p,onDrag:te,snapPointsOffset:g}}const ta=()=>()=>{};function na(){const{direction:r,isOpen:n,shouldScaleBackground:t,setBackgroundColorOnScale:o,noBodyStyles:s}=Ve(),i=a.useRef(null),v=oe.useMemo(()=>document.body.style.backgroundColor,[]);function h(){return(window.innerWidth-ir)/window.innerWidth}a.useEffect(()=>{if(n&&t){i.current&&clearTimeout(i.current);const j=document.querySelector("[data-vaul-drawer-wrapper]")||document.querySelector("[vaul-drawer-wrapper]");if(!j)return;Qn(o&&!s?nr(document.body,{background:"black"}):ta,nr(j,{transformOrigin:A(r)?"top":"left",transitionProperty:"transform, border-radius",transitionDuration:`${k.DURATION}s`,transitionTimingFunction:`cubic-bezier(${k.EASE.join(",")})`}));const N=nr(j,{borderRadius:`${sn}px`,overflow:"hidden",...A(r)?{transform:`scale(${h()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`}:{transform:`scale(${h()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`}});return()=>{N(),i.current=window.setTimeout(()=>{v?document.body.style.background=v:document.body.style.removeProperty("background")},k.DURATION*1e3)}}},[n,t,v])}let je=null;function aa({isOpen:r,modal:n,nested:t,hasBeenOpened:o,preventScrollRestoration:s,noBodyStyles:i}){const[v,h]=a.useState(()=>typeof window<"u"?window.location.href:""),j=a.useRef(0),N=a.useCallback(()=>{if(vr()&&je===null&&r&&!i){je={position:document.body.style.position,top:document.body.style.top,left:document.body.style.left,height:document.body.style.height,right:"unset"};const{scrollX:w,innerHeight:f}=window;document.body.style.setProperty("position","fixed","important"),Object.assign(document.body.style,{top:`${-j.current}px`,left:`${-w}px`,right:"0px",height:"auto"}),window.setTimeout(()=>window.requestAnimationFrame(()=>{const G=f-window.innerHeight;G&&j.current>=f&&(document.body.style.top=`${-(j.current+G)}px`)}),300)}},[r]),x=a.useCallback(()=>{if(vr()&&je!==null&&!i){const w=-parseInt(document.body.style.top,10),f=-parseInt(document.body.style.left,10);Object.assign(document.body.style,je),window.requestAnimationFrame(()=>{if(s&&v!==window.location.href){h(window.location.href);return}window.scrollTo(f,w)}),je=null}},[v]);return a.useEffect(()=>{function w(){j.current=window.scrollY}return w(),window.addEventListener("scroll",w),()=>{window.removeEventListener("scroll",w)}},[]),a.useEffect(()=>{if(n)return()=>{typeof document>"u"||document.querySelector("[data-vaul-drawer]")||x()}},[n,x]),a.useEffect(()=>{t||!o||(r?(!window.matchMedia("(display-mode: standalone)").matches&&N(),n||window.setTimeout(()=>{x()},500)):x())},[r,o,v,n,t,N,x]),{restorePositionSetting:x}}function oa({open:r,onOpenChange:n,children:t,onDrag:o,onRelease:s,snapPoints:i,shouldScaleBackground:v=!1,setBackgroundColorOnScale:h=!0,closeThreshold:j=Jn,scrollLockTimeout:N=Zn,dismissible:x=!0,handleOnly:w=!1,fadeFromIndex:f=i&&i.length-1,activeSnapPoint:G,setActiveSnapPoint:Y,fixed:B,modal:K=!0,onClose:g,nested:I,noBodyStyles:F=!1,direction:p="bottom",defaultOpen:te=!1,disablePreventScroll:ue=!0,snapToSequentialPoint:u=!1,preventScrollRestoration:b=!1,repositionInputs:y=!0,onAnimationEnd:W,container:$,autoFocus:J=!1}){var c,Q;const[U=!1,Z]=cn({defaultProp:te,prop:r,onChange:l=>{n==null||n(l),!l&&!I&&vn(),setTimeout(()=>{W==null||W(l)},k.DURATION*1e3),l&&!K&&typeof window<"u"&&window.requestAnimationFrame(()=>{document.body.style.pointerEvents="auto"}),l||(document.body.style.pointerEvents="auto")}}),[V,ae]=a.useState(!1),[ie,xe]=a.useState(!1),[mn,lr]=a.useState(!1),he=a.useRef(null),We=a.useRef(null),Ke=a.useRef(null),Qe=a.useRef(null),ve=a.useRef(null),De=a.useRef(!1),Je=a.useRef(null),Ze=a.useRef(0),we=a.useRef(!1),cr=a.useRef(!te),dr=a.useRef(0),m=a.useRef(null),ur=a.useRef(((c=m.current)==null?void 0:c.getBoundingClientRect().height)||0),pr=a.useRef(((Q=m.current)==null?void 0:Q.getBoundingClientRect().width)||0),er=a.useRef(0),hn=a.useCallback(l=>{i&&l===ye.length-1&&(We.current=new Date)},[]),{activeSnapPoint:wn,activeSnapPointIndex:fe,setActiveSnapPoint:mr,onRelease:fn,snapPointsOffset:ye,onDrag:gn,shouldFade:hr,getPercentageDragged:xn}=ra({snapPoints:i,activeSnapPointProp:G,setActiveSnapPointProp:Y,drawerRef:m,fadeFromIndex:f,overlayRef:he,onSnapPointChange:hn,direction:p,container:$,snapToSequentialPoint:u});Wn({isDisabled:!U||ie||!K||mn||!V||!y||!ue});const{restorePositionSetting:vn}=aa({isOpen:U,modal:K,nested:I??!1,hasBeenOpened:V,preventScrollRestoration:b,noBodyStyles:F});function Ue(){return(window.innerWidth-ir)/window.innerWidth}function Dn(l){var C,T;!x&&!i||m.current&&!m.current.contains(l.target)||(ur.current=((C=m.current)==null?void 0:C.getBoundingClientRect().height)||0,pr.current=((T=m.current)==null?void 0:T.getBoundingClientRect().width)||0,xe(!0),Ke.current=new Date,rn()&&window.addEventListener("touchend",()=>De.current=!1,{once:!0}),l.target.setPointerCapture(l.pointerId),Ze.current=A(p)?l.pageY:l.pageX)}function wr(l,C){var T;let D=l;const L=(T=window.getSelection())==null?void 0:T.toString(),X=m.current?Ge(m.current,p):null,z=new Date;if(D.tagName==="SELECT"||D.hasAttribute("data-vaul-no-drag")||D.closest("[data-vaul-no-drag]"))return!1;if(p==="right"||p==="left")return!0;if(We.current&&z.getTime()-We.current.getTime()<500)return!1;if(X!==null&&(p==="bottom"?X>0:X<0))return!0;if(L&&L.length>0)return!1;if(ve.current&&z.getTime()-ve.current.getTime()<N&&X===0||C)return ve.current=z,!1;for(;D;){if(D.scrollHeight>D.clientHeight){if(D.scrollTop!==0)return ve.current=new Date,!1;if(D.getAttribute("role")==="dialog")return!0}D=D.parentNode}return!0}function yn(l){if(m.current&&ie){const C=p==="bottom"||p==="right"?1:-1,T=(Ze.current-(A(p)?l.pageY:l.pageX))*C,D=T>0,L=i&&!x&&!D;if(L&&fe===0)return;const X=Math.abs(T),z=document.querySelector("[data-vaul-drawer-wrapper]"),se=p==="bottom"||p==="top"?ur.current:pr.current;let ee=X/se;const pe=xn(X,D);if(pe!==null&&(ee=pe),L&&ee>=1||!De.current&&!wr(l.target,D))return;if(m.current.classList.add(ar),De.current=!0,q(m.current,{transition:"none"}),q(he.current,{transition:"none"}),i&&gn({draggedDistance:T}),D&&!i){const ne=Kn(T),ze=Math.min(ne*-1,0)*C;q(m.current,{transform:A(p)?`translate3d(0, ${ze}px, 0)`:`translate3d(${ze}px, 0, 0)`});return}const le=1-ee;if((hr||f&&fe===f-1)&&(o==null||o(l,ee),q(he.current,{opacity:`${le}`,transition:"none"},!0)),z&&he.current&&v){const ne=Math.min(Ue()+ee*(1-Ue()),1),ze=8-ee*8,gr=Math.max(0,14-ee*14);q(z,{borderRadius:`${ze}px`,transform:A(p)?`scale(${ne}) translate3d(0, ${gr}px, 0)`:`scale(${ne}) translate3d(${gr}px, 0, 0)`,transition:"none"},!0)}if(!i){const ne=X*C;q(m.current,{transform:A(p)?`translate3d(0, ${ne}px, 0)`:`translate3d(${ne}px, 0, 0)`})}}}a.useEffect(()=>{window.requestAnimationFrame(()=>{cr.current=!0})},[]),a.useEffect(()=>{var l;function C(){if(!m.current||!y)return;const T=document.activeElement;if(or(T)||we.current){var D;const L=((D=window.visualViewport)==null?void 0:D.height)||0,X=window.innerHeight;let z=X-L;const se=m.current.getBoundingClientRect().height||0,ee=se>X*.8;er.current||(er.current=se);const pe=m.current.getBoundingClientRect().top;if(Math.abs(dr.current-z)>60&&(we.current=!we.current),i&&i.length>0&&ye&&fe){const le=ye[fe]||0;z+=le}if(dr.current=z,se>L||we.current){const le=m.current.getBoundingClientRect().height;let ne=le;le>L&&(ne=L-(ee?pe:ir)),B?m.current.style.height=`${le-Math.max(z,0)}px`:m.current.style.height=`${Math.max(ne,L-pe)}px`}else An()||(m.current.style.height=`${er.current}px`);i&&i.length>0&&!we.current?m.current.style.bottom="0px":m.current.style.bottom=`${Math.max(z,0)}px`}}return(l=window.visualViewport)==null||l.addEventListener("resize",C),()=>{var T;return(T=window.visualViewport)==null?void 0:T.removeEventListener("resize",C)}},[fe,i,ye]);function be(l){bn(),g==null||g(),l||Z(!1),setTimeout(()=>{i&&mr(i[0])},k.DURATION*1e3)}function fr(){if(!m.current)return;const l=document.querySelector("[data-vaul-drawer-wrapper]"),C=Ge(m.current,p);q(m.current,{transform:"translate3d(0, 0, 0)",transition:`transform ${k.DURATION}s cubic-bezier(${k.EASE.join(",")})`}),q(he.current,{transition:`opacity ${k.DURATION}s cubic-bezier(${k.EASE.join(",")})`,opacity:"1"}),v&&C&&C>0&&U&&q(l,{borderRadius:`${sn}px`,overflow:"hidden",...A(p)?{transform:`scale(${Ue()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,transformOrigin:"top"}:{transform:`scale(${Ue()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`,transformOrigin:"left"},transitionProperty:"transform, border-radius",transitionDuration:`${k.DURATION}s`,transitionTimingFunction:`cubic-bezier(${k.EASE.join(",")})`},!0)}function bn(){!ie||!m.current||(m.current.classList.remove(ar),De.current=!1,xe(!1),Qe.current=new Date)}function Cn(l){if(!ie||!m.current)return;m.current.classList.remove(ar),De.current=!1,xe(!1),Qe.current=new Date;const C=Ge(m.current,p);if(!l||!wr(l.target,!1)||!C||Number.isNaN(C)||Ke.current===null)return;const T=Qe.current.getTime()-Ke.current.getTime(),D=Ze.current-(A(p)?l.pageY:l.pageX),L=Math.abs(D)/T;if(L>.05&&(lr(!0),setTimeout(()=>{lr(!1)},200)),i){fn({draggedDistance:D*(p==="bottom"||p==="right"?1:-1),closeDrawer:be,velocity:L,dismissible:x}),s==null||s(l,!0);return}if(p==="bottom"||p==="right"?D>0:D<0){fr(),s==null||s(l,!0);return}if(L>on){be(),s==null||s(l,!1);return}var X;const z=Math.min((X=m.current.getBoundingClientRect().height)!=null?X:0,window.innerHeight);var se;const ee=Math.min((se=m.current.getBoundingClientRect().width)!=null?se:0,window.innerWidth),pe=p==="left"||p==="right";if(Math.abs(C)>=(pe?ee:z)*j){be(),s==null||s(l,!1);return}s==null||s(l,!0),fr()}a.useEffect(()=>(U&&(q(document.documentElement,{scrollBehavior:"auto"}),We.current=new Date),()=>{Gn(document.documentElement,"scrollBehavior")}),[U]);function jn(l){const C=l?(window.innerWidth-me)/window.innerWidth:1,T=l?-me:0;Je.current&&window.clearTimeout(Je.current),q(m.current,{transition:`transform ${k.DURATION}s cubic-bezier(${k.EASE.join(",")})`,transform:A(p)?`scale(${C}) translate3d(0, ${T}px, 0)`:`scale(${C}) translate3d(${T}px, 0, 0)`}),!l&&m.current&&(Je.current=setTimeout(()=>{const D=Ge(m.current,p);q(m.current,{transition:"none",transform:A(p)?`translate3d(0, ${D}px, 0)`:`translate3d(${D}px, 0, 0)`})},500))}function Tn(l,C){if(C<0)return;const T=(window.innerWidth-me)/window.innerWidth,D=T+C*(1-T),L=-me+C*me;q(m.current,{transform:A(p)?`scale(${D}) translate3d(0, ${L}px, 0)`:`scale(${D}) translate3d(${L}px, 0, 0)`,transition:"none"})}function Nn(l,C){const T=A(p)?window.innerHeight:window.innerWidth,D=C?(T-me)/T:1,L=C?-me:0;C&&q(m.current,{transition:`transform ${k.DURATION}s cubic-bezier(${k.EASE.join(",")})`,transform:A(p)?`scale(${D}) translate3d(0, ${L}px, 0)`:`scale(${D}) translate3d(${L}px, 0, 0)`})}return a.useEffect(()=>{K||window.requestAnimationFrame(()=>{document.body.style.pointerEvents="auto"})},[K]),a.createElement(En,{defaultOpen:te,onOpenChange:l=>{!x&&!l||(l?ae(!0):be(!0),Z(l))},open:U},a.createElement(en.Provider,{value:{activeSnapPoint:wn,snapPoints:i,setActiveSnapPoint:mr,drawerRef:m,overlayRef:he,onOpenChange:n,onPress:Dn,onRelease:Cn,onDrag:yn,dismissible:x,shouldAnimate:cr,handleOnly:w,isOpen:U,isDragging:ie,shouldFade:hr,closeDrawer:be,onNestedDrag:Tn,onNestedOpenChange:jn,onNestedRelease:Nn,keyboardIsOpen:we,modal:K,snapPointsOffset:ye,activeSnapPointIndex:fe,direction:p,shouldScaleBackground:v,setBackgroundColorOnScale:h,noBodyStyles:F,container:$,autoFocus:J}},t))}const dn=a.forwardRef(function({...r},n){const{overlayRef:t,snapPoints:o,onRelease:s,shouldFade:i,isOpen:v,modal:h,shouldAnimate:j}=Ve(),N=nn(n,t),x=o&&o.length>0;if(!h)return null;const w=a.useCallback(f=>s(f),[s]);return a.createElement(Ln,{onMouseUp:w,ref:N,"data-vaul-overlay":"","data-vaul-snap-points":v&&x?"true":"false","data-vaul-snap-points-overlay":v&&i?"true":"false","data-vaul-animate":j!=null&&j.current?"true":"false",...r})});dn.displayName="Drawer.Overlay";const un=a.forwardRef(function({onPointerDownOutside:r,style:n,onOpenAutoFocus:t,...o},s){const{drawerRef:i,onPress:v,onRelease:h,onDrag:j,keyboardIsOpen:N,snapPointsOffset:x,activeSnapPointIndex:w,modal:f,isOpen:G,direction:Y,snapPoints:B,container:K,handleOnly:g,shouldAnimate:I,autoFocus:F}=Ve(),[p,te]=a.useState(!1),ue=nn(s,i),u=a.useRef(null),b=a.useRef(null),y=a.useRef(!1),W=B&&B.length>0;na();const $=(c,Q,U=0)=>{if(y.current)return!0;const Z=Math.abs(c.y),V=Math.abs(c.x),ae=V>Z,ie=["bottom","right"].includes(Q)?1:-1;if(Q==="left"||Q==="right"){if(!(c.x*ie<0)&&V>=0&&V<=U)return ae}else if(!(c.y*ie<0)&&Z>=0&&Z<=U)return!ae;return y.current=!0,!0};a.useEffect(()=>{W&&window.requestAnimationFrame(()=>{te(!0)})},[]);function J(c){u.current=null,y.current=!1,h(c)}return a.createElement(Pn,{"data-vaul-drawer-direction":Y,"data-vaul-drawer":"","data-vaul-delayed-snap-points":p?"true":"false","data-vaul-snap-points":G&&W?"true":"false","data-vaul-custom-container":K?"true":"false","data-vaul-animate":I!=null&&I.current?"true":"false",...o,ref:ue,style:x&&x.length>0?{"--snap-point-height":`${x[w??0]}px`,...n}:n,onPointerDown:c=>{g||(o.onPointerDown==null||o.onPointerDown.call(o,c),u.current={x:c.pageX,y:c.pageY},v(c))},onOpenAutoFocus:c=>{t==null||t(c),F||c.preventDefault()},onPointerDownOutside:c=>{if(r==null||r(c),!f||c.defaultPrevented){c.preventDefault();return}N.current&&(N.current=!1)},onFocusOutside:c=>{if(!f){c.preventDefault();return}},onPointerMove:c=>{if(b.current=c,g||(o.onPointerMove==null||o.onPointerMove.call(o,c),!u.current))return;const Q=c.pageY-u.current.y,U=c.pageX-u.current.x,Z=c.pointerType==="touch"?10:2;$({x:U,y:Q},Y,Z)?j(c):(Math.abs(U)>Z||Math.abs(Q)>Z)&&(u.current=null)},onPointerUp:c=>{o.onPointerUp==null||o.onPointerUp.call(o,c),u.current=null,y.current=!1,h(c)},onPointerOut:c=>{o.onPointerOut==null||o.onPointerOut.call(o,c),J(b.current)},onContextMenu:c=>{o.onContextMenu==null||o.onContextMenu.call(o,c),b.current&&J(b.current)}})});un.displayName="Drawer.Content";const ia=250,sa=120,la=a.forwardRef(function({preventCycle:r=!1,children:n,...t},o){const{closeDrawer:s,isDragging:i,snapPoints:v,activeSnapPoint:h,setActiveSnapPoint:j,dismissible:N,handleOnly:x,isOpen:w,onPress:f,onDrag:G}=Ve(),Y=a.useRef(null),B=a.useRef(!1);function K(){if(B.current){F();return}window.setTimeout(()=>{g()},sa)}function g(){if(i||r||B.current){F();return}if(F(),!v||v.length===0){N||s();return}if(h===v[v.length-1]&&N){s();return}const te=v.findIndex(u=>u===h);if(te===-1)return;const ue=v[te+1];j(ue)}function I(){Y.current=window.setTimeout(()=>{B.current=!0},ia)}function F(){Y.current&&window.clearTimeout(Y.current),B.current=!1}return a.createElement("div",{onClick:K,onPointerCancel:F,onPointerDown:p=>{x&&f(p),I()},onPointerMove:p=>{x&&G(p)},ref:o,"data-vaul-drawer-visible":w?"true":"false","data-vaul-handle":"","aria-hidden":"true",...t},a.createElement("span",{"data-vaul-handle-hitarea":"","aria-hidden":"true"},n))});la.displayName="Drawer.Handle";function ca(r){const n=Ve(),{container:t=n.container,...o}=r;return a.createElement(_n,{container:t,...o})}const re={Root:oa,Content:un,Overlay:dn,Trigger:Bn,Portal:ca,Close:kn,Title:Rn,Description:On},S=({shouldScaleBackground:r=!0,...n})=>e.jsx(re.Root,{shouldScaleBackground:r,...n});S.displayName="Drawer";const H=re.Trigger,pn=re.Portal,E=re.Close,$e=oe.forwardRef(({className:r,...n},t)=>e.jsx(re.Overlay,{ref:t,className:ge("fixed inset-0 z-50 bg-black/80",r),...n}));$e.displayName=re.Overlay.displayName;const R=oe.forwardRef(({className:r,children:n,...t},o)=>e.jsxs(pn,{children:[e.jsx($e,{}),e.jsxs(re.Content,{ref:o,className:ge("fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",r),...t,children:[e.jsx("div",{className:"mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted"}),n]})]}));R.displayName="DrawerContent";const O=({className:r,...n})=>e.jsx("div",{className:ge("grid gap-1.5 p-4 text-center sm:text-left",r),...n});O.displayName="DrawerHeader";const M=({className:r,...n})=>e.jsx("div",{className:ge("mt-auto flex flex-col gap-2 p-4",r),...n});M.displayName="DrawerFooter";const _=oe.forwardRef(({className:r,...n},t)=>e.jsx(re.Title,{ref:t,className:ge("text-lg font-semibold leading-none tracking-tight",r),...n}));_.displayName=re.Title.displayName;const P=oe.forwardRef(({className:r,...n},t)=>e.jsx(re.Description,{ref:t,className:ge("text-sm text-muted-foreground",r),...n}));P.displayName=re.Description.displayName;try{S.displayName="Drawer",S.__docgenInfo={description:"",displayName:"Drawer",props:{activeSnapPoint:{defaultValue:null,description:"",name:"activeSnapPoint",required:!1,type:{name:"string | number | null"}},setActiveSnapPoint:{defaultValue:null,description:"",name:"setActiveSnapPoint",required:!1,type:{name:"((snapPoint: string | number | null) => void)"}},open:{defaultValue:null,description:"",name:"open",required:!1,type:{name:"boolean"}},closeThreshold:{defaultValue:{value:"0.25"},description:`Number between 0 and 1 that determines when the drawer should be closed.
Example: threshold of 0.5 would close the drawer if the user swiped for 50% of the height of the drawer or more.`,name:"closeThreshold",required:!1,type:{name:"number"}},noBodyStyles:{defaultValue:null,description:"When `true` the `body` doesn't get any styles assigned from Vaul",name:"noBodyStyles",required:!1,type:{name:"boolean"}},onOpenChange:{defaultValue:null,description:"",name:"onOpenChange",required:!1,type:{name:"((open: boolean) => void)"}},shouldScaleBackground:{defaultValue:{value:"true"},description:"",name:"shouldScaleBackground",required:!1,type:{name:"boolean"}},setBackgroundColorOnScale:{defaultValue:{value:"true"},description:"When `false` we don't change body's background color when the drawer is open.",name:"setBackgroundColorOnScale",required:!1,type:{name:"boolean"}},scrollLockTimeout:{defaultValue:{value:"500ms"},description:"Duration for which the drawer is not draggable after scrolling content inside of the drawer.",name:"scrollLockTimeout",required:!1,type:{name:"number"}},fixed:{defaultValue:null,description:"When `true`, don't move the drawer upwards if there's space, but rather only change it's height so it's fully scrollable when the keyboard is open",name:"fixed",required:!1,type:{name:"boolean"}},handleOnly:{defaultValue:{value:"false"},description:"When `true` only allows the drawer to be dragged by the `<Drawer.Handle />` component.",name:"handleOnly",required:!1,type:{name:"boolean"}},dismissible:{defaultValue:{value:"true"},description:"When `false` dragging, clicking outside, pressing esc, etc. will not close the drawer.\nUse this in comination with the `open` prop, otherwise you won't be able to open/close the drawer.",name:"dismissible",required:!1,type:{name:"boolean"}},onDrag:{defaultValue:null,description:"",name:"onDrag",required:!1,type:{name:"((event: PointerEvent<HTMLDivElement>, percentageDragged: number) => void)"}},onRelease:{defaultValue:null,description:"",name:"onRelease",required:!1,type:{name:"((event: PointerEvent<HTMLDivElement>, open: boolean) => void)"}},modal:{defaultValue:{value:"true"},description:"When `false` it allows to interact with elements outside of the drawer without closing it.",name:"modal",required:!1,type:{name:"boolean"}},nested:{defaultValue:null,description:"",name:"nested",required:!1,type:{name:"boolean"}},onClose:{defaultValue:null,description:"",name:"onClose",required:!1,type:{name:"(() => void)"}},direction:{defaultValue:{value:"'bottom'"},description:"Direction of the drawer. Can be `top` or `bottom`, `left`, `right`.",name:"direction",required:!1,type:{name:"enum",value:[{value:'"top"'},{value:'"right"'},{value:'"bottom"'},{value:'"left"'}]}},defaultOpen:{defaultValue:{value:"false"},description:"Opened by default, skips initial enter animation. Still reacts to `open` state changes",name:"defaultOpen",required:!1,type:{name:"boolean"}},disablePreventScroll:{defaultValue:{value:"false"},description:"When set to `true` prevents scrolling on the document body on mount, and restores it on unmount.",name:"disablePreventScroll",required:!1,type:{name:"boolean"}},repositionInputs:{defaultValue:{value:"true when {@link snapPoints } is defined"},description:"When `true` Vaul will reposition inputs rather than scroll then into view if the keyboard is in the way.\nSetting it to `false` will fall back to the default browser behavior.",name:"repositionInputs",required:!1,type:{name:"boolean"}},snapToSequentialPoint:{defaultValue:{value:"false"},description:`Disabled velocity based swiping for snap points.
This means that a snap point won't be skipped even if the velocity is high enough.
Useful if each snap point in a drawer is equally important.`,name:"snapToSequentialPoint",required:!1,type:{name:"boolean"}},container:{defaultValue:null,description:"",name:"container",required:!1,type:{name:"HTMLElement | null"}},onAnimationEnd:{defaultValue:null,description:"Gets triggered after the open or close animation ends, it receives an `open` argument with the `open` state of the drawer by the time the function was triggered.\nUseful to revert any state changes for example.",name:"onAnimationEnd",required:!1,type:{name:"((open: boolean) => void)"}},preventScrollRestoration:{defaultValue:null,description:"",name:"preventScrollRestoration",required:!1,type:{name:"boolean"}},autoFocus:{defaultValue:null,description:"",name:"autoFocus",required:!1,type:{name:"boolean"}}}}}catch{}try{Portal.displayName="Portal",Portal.__docgenInfo={description:"",displayName:"Portal",props:{}}}catch{}try{$e.displayName="DrawerOverlay",$e.__docgenInfo={description:"",displayName:"DrawerOverlay",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{H.displayName="DrawerTrigger",H.__docgenInfo={description:"",displayName:"DrawerTrigger",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{E.displayName="DrawerClose",E.__docgenInfo={description:"",displayName:"DrawerClose",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{R.displayName="DrawerContent",R.__docgenInfo={description:"",displayName:"DrawerContent",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{O.displayName="DrawerHeader",O.__docgenInfo={description:"",displayName:"DrawerHeader",props:{}}}catch{}try{M.displayName="DrawerFooter",M.__docgenInfo={description:"",displayName:"DrawerFooter",props:{}}}catch{}try{_.displayName="DrawerTitle",_.__docgenInfo={description:"",displayName:"DrawerTitle",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{P.displayName="DrawerDescription",P.__docgenInfo={description:"",displayName:"DrawerDescription",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}const _a={title:"Tier 1: Primitives/shadcn/Drawer",component:S,parameters:{layout:"centered",docs:{description:{component:"A mobile-optimized drawer component that slides in from the bottom with drag-to-dismiss functionality. Built on Vaul primitive."}}},tags:["autodocs"]},Te={render:()=>e.jsxs(S,{children:[e.jsx(H,{asChild:!0,children:e.jsx(d,{variant:"outline",children:"Open Drawer"})}),e.jsx(R,{children:e.jsxs(O,{children:[e.jsx(_,{children:"Are you absolutely sure?"}),e.jsx(P,{children:"This action cannot be undone. This will permanently delete your account and remove your data from our servers."})]})})]})},Ne={render:()=>e.jsxs(S,{children:[e.jsx(H,{asChild:!0,children:e.jsx(d,{children:"Edit Profile"})}),e.jsxs(R,{children:[e.jsxs(O,{children:[e.jsx(_,{children:"Edit profile"}),e.jsx(P,{children:"Make changes to your profile here. Click save when you're done."})]}),e.jsxs("div",{className:"grid gap-4 py-4 px-4",children:[e.jsxs("div",{className:"grid grid-cols-4 items-center gap-4",children:[e.jsx(ce,{htmlFor:"name",className:"text-right",children:"Name"}),e.jsx(de,{id:"name",defaultValue:"Pedro Duarte",className:"col-span-3"})]}),e.jsxs("div",{className:"grid grid-cols-4 items-center gap-4",children:[e.jsx(ce,{htmlFor:"username",className:"text-right",children:"Username"}),e.jsx(de,{id:"username",defaultValue:"@peduarte",className:"col-span-3"})]})]}),e.jsxs(M,{children:[e.jsx(d,{type:"submit",children:"Save changes"}),e.jsx(E,{asChild:!0,children:e.jsx(d,{variant:"outline",children:"Cancel"})})]})]})]})},Se={render:()=>e.jsxs(S,{children:[e.jsx(H,{asChild:!0,children:e.jsx(d,{variant:"destructive",children:"Delete Account"})}),e.jsxs(R,{children:[e.jsxs(O,{children:[e.jsx(_,{children:"Are you absolutely sure?"}),e.jsx(P,{children:"This action cannot be undone. This will permanently delete your account and remove your data from our servers."})]}),e.jsxs(M,{children:[e.jsx(d,{variant:"destructive",children:"Delete Account"}),e.jsx(E,{asChild:!0,children:e.jsx(d,{variant:"outline",children:"Cancel"})})]})]})]})},Be={render:()=>e.jsxs(S,{children:[e.jsx(H,{asChild:!0,children:e.jsx(d,{children:"Create Project"})}),e.jsxs(R,{children:[e.jsxs(O,{children:[e.jsx(_,{children:"Create new project"}),e.jsx(P,{children:"Add a new project to your workspace. Click create when you're done."})]}),e.jsxs("div",{className:"grid gap-4 py-4 px-4",children:[e.jsxs("div",{className:"grid gap-2",children:[e.jsx(ce,{htmlFor:"project-name",children:"Project name"}),e.jsx(de,{id:"project-name",placeholder:"My Awesome Project"})]}),e.jsxs("div",{className:"grid gap-2",children:[e.jsx(ce,{htmlFor:"project-description",children:"Description"}),e.jsx(de,{id:"project-description",placeholder:"A brief description of your project"})]}),e.jsxs("div",{className:"grid gap-2",children:[e.jsx(ce,{htmlFor:"project-url",children:"Repository URL"}),e.jsx(de,{id:"project-url",type:"url",placeholder:"https://github.com/username/repo"})]})]}),e.jsxs(M,{children:[e.jsx(d,{type:"submit",children:"Create Project"}),e.jsx(E,{asChild:!0,children:e.jsx(d,{variant:"outline",children:"Cancel"})})]})]})]})},ke={render:()=>e.jsxs(S,{children:[e.jsx(H,{asChild:!0,children:e.jsxs(d,{variant:"outline",children:[e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:"mr-2",children:[e.jsx("line",{x1:"3",y1:"12",x2:"21",y2:"12"}),e.jsx("line",{x1:"3",y1:"6",x2:"21",y2:"6"}),e.jsx("line",{x1:"3",y1:"18",x2:"21",y2:"18"})]}),"Menu"]})}),e.jsxs(R,{children:[e.jsxs(O,{children:[e.jsx(_,{children:"Navigation"}),e.jsx(P,{children:"Browse available sections"})]}),e.jsxs("div",{className:"px-4 pb-4 space-y-2",children:[e.jsx(E,{asChild:!0,children:e.jsx("button",{className:"w-full px-4 py-3 text-left hover:bg-gray-100 rounded-md transition-colors",children:"Home"})}),e.jsx(E,{asChild:!0,children:e.jsx("button",{className:"w-full px-4 py-3 text-left hover:bg-gray-100 rounded-md transition-colors",children:"Dashboard"})}),e.jsx(E,{asChild:!0,children:e.jsx("button",{className:"w-full px-4 py-3 text-left hover:bg-gray-100 rounded-md transition-colors",children:"Projects"})}),e.jsx(E,{asChild:!0,children:e.jsx("button",{className:"w-full px-4 py-3 text-left hover:bg-gray-100 rounded-md transition-colors",children:"Settings"})}),e.jsx(E,{asChild:!0,children:e.jsx("button",{className:"w-full px-4 py-3 text-left hover:bg-gray-100 rounded-md transition-colors",children:"Profile"})})]}),e.jsx(M,{children:e.jsx(E,{asChild:!0,children:e.jsx(d,{variant:"outline",children:"Close Menu"})})})]})]})},Ee={render:()=>e.jsxs(S,{children:[e.jsx(H,{asChild:!0,children:e.jsxs(d,{variant:"outline",children:[e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:"mr-2",children:e.jsx("polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"})}),"Filters"]})}),e.jsxs(R,{children:[e.jsxs(O,{children:[e.jsx(_,{children:"Filter Results"}),e.jsx(P,{children:"Refine your search with these filters"})]}),e.jsxs("div",{className:"px-4 pb-4 space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(ce,{children:"Price Range"}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(de,{type:"number",placeholder:"Min"}),e.jsx(de,{type:"number",placeholder:"Max"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(ce,{children:"Category"}),e.jsxs("select",{className:"w-full px-3 py-2 border rounded-md",children:[e.jsx("option",{children:"All Categories"}),e.jsx("option",{children:"Electronics"}),e.jsx("option",{children:"Clothing"}),e.jsx("option",{children:"Home & Garden"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(ce,{children:"Rating"}),e.jsx("div",{className:"space-y-1",children:[5,4,3,2,1].map(r=>e.jsxs("label",{className:"flex items-center gap-2",children:[e.jsx("input",{type:"checkbox"}),e.jsxs("span",{children:[r," stars & up"]})]},r))})]})]}),e.jsxs(M,{children:[e.jsx(d,{children:"Apply Filters"}),e.jsx(E,{asChild:!0,children:e.jsx(d,{variant:"outline",children:"Reset"})})]})]})]})},Re={render:()=>e.jsxs(S,{children:[e.jsx(H,{asChild:!0,children:e.jsx(d,{variant:"cta",style:{backgroundColor:"#0ec2bc",color:"white"},children:"Complete Payment"})}),e.jsxs(R,{children:[e.jsxs(O,{children:[e.jsx(_,{style:{color:"#0ec2bc"},children:"Payment Successful!"}),e.jsx(P,{children:"Your payment of $99.00 has been processed successfully. A confirmation email has been sent to your inbox."})]}),e.jsxs("div",{className:"px-4 py-6 text-center",children:[e.jsx("div",{className:"w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center",style:{backgroundColor:"#0ec2bc20"},children:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"#0ec2bc",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})})}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Transaction ID: TXN-2024-001234"})]}),e.jsxs(M,{children:[e.jsx(d,{style:{backgroundColor:"#0ec2bc",color:"white"},children:"View Receipt"}),e.jsx(E,{asChild:!0,children:e.jsx(d,{variant:"outline",children:"Close"})})]})]})]})},Oe={render:()=>{const r=()=>{const[n,t]=oe.useState(!1);return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsx(d,{onClick:()=>t(!0),children:"Open Drawer"}),e.jsx(d,{variant:"outline",onClick:()=>t(!1),children:"Close Drawer (External)"})]}),e.jsxs("p",{className:"text-sm text-muted-foreground",children:["Drawer is currently: ",n?"Open":"Closed"]}),e.jsx(S,{open:n,onOpenChange:t,children:e.jsxs(R,{children:[e.jsxs(O,{children:[e.jsx(_,{children:"Controlled Drawer"}),e.jsx(P,{children:"This drawer's state is controlled by external state. You can open/close it programmatically."})]}),e.jsx("div",{className:"px-4 py-4",children:e.jsx("p",{className:"text-sm",children:"Use the buttons above to control this drawer, or use the drag handle or click outside to close."})}),e.jsx(M,{children:e.jsx(d,{onClick:()=>t(!1),children:"Close"})})]})})]})};return e.jsx(r,{})}},_e={render:()=>e.jsxs(S,{shouldScaleBackground:!1,children:[e.jsx(H,{asChild:!0,children:e.jsx(d,{variant:"outline",children:"Open Drawer (No Scaling)"})}),e.jsxs(R,{children:[e.jsxs(O,{children:[e.jsx(_,{children:"No Background Scaling"}),e.jsx(P,{children:"This drawer doesn't scale the background content when opened."})]}),e.jsx("div",{className:"px-4 py-4",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"Set shouldScaleBackground=false on the Drawer root component to disable the scaling effect."})}),e.jsx(M,{children:e.jsx(E,{asChild:!0,children:e.jsx(d,{variant:"outline",children:"Close"})})})]})]})},Pe={render:()=>e.jsxs(S,{children:[e.jsx(H,{asChild:!0,children:e.jsx(d,{children:"View Terms"})}),e.jsxs(R,{className:"max-h-[80vh]",children:[e.jsxs(O,{children:[e.jsx(_,{children:"Terms and Conditions"}),e.jsx(P,{children:"Please read our terms and conditions carefully."})]}),e.jsxs("div",{className:"overflow-y-auto max-h-[50vh] px-4 space-y-4 text-sm",children:[e.jsx("p",{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}),e.jsx("p",{children:"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}),e.jsx("p",{children:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."}),e.jsx("p",{children:"Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}),e.jsx("p",{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}),e.jsx("p",{children:"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}),e.jsx("p",{children:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."}),e.jsx("p",{children:"Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}),e.jsx("p",{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."})]}),e.jsxs(M,{children:[e.jsx(d,{children:"Accept"}),e.jsx(E,{asChild:!0,children:e.jsx(d,{variant:"outline",children:"Decline"})})]})]})]})},Le={render:()=>e.jsxs(S,{children:[e.jsx(H,{asChild:!0,children:e.jsx(d,{children:"Open Drawer"})}),e.jsxs(R,{children:[e.jsxs(O,{children:[e.jsx(_,{children:"Custom Close Buttons"}),e.jsx(P,{children:"Any element wrapped with DrawerClose will close the drawer when clicked."})]}),e.jsxs("div",{className:"px-4 py-4 space-y-3",children:[e.jsx(E,{asChild:!0,children:e.jsx("button",{className:"w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm",children:"Custom Button (closes drawer)"})}),e.jsx(E,{asChild:!0,children:e.jsx("div",{className:"w-full px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md text-sm cursor-pointer text-center",children:"Div as close button"})}),e.jsx(E,{asChild:!0,children:e.jsx("a",{href:"#",className:"block w-full px-4 py-2 bg-green-50 hover:bg-green-100 rounded-md text-sm text-center",children:"Link as close button"})})]})]})]})},He={render:()=>e.jsxs(S,{children:[e.jsx(H,{asChild:!0,children:e.jsx(d,{variant:"outline",children:"Open Drawer"})}),e.jsxs(R,{children:[e.jsx(O,{children:e.jsx(_,{children:"Simple Drawer"})}),e.jsx("div",{className:"px-4 py-4",children:e.jsx("p",{className:"text-sm",children:"This drawer doesn't have a DrawerDescription component, but it's generally recommended for accessibility."})}),e.jsx(M,{children:e.jsx(E,{asChild:!0,children:e.jsx(d,{children:"Close"})})})]})]})},Ae={render:()=>e.jsxs(S,{children:[e.jsx(H,{asChild:!0,children:e.jsx(d,{children:"Open Drawer"})}),e.jsxs(pn,{children:[e.jsx($e,{}),e.jsxs(R,{children:[e.jsxs(O,{children:[e.jsx(_,{children:"Explicit Structure"}),e.jsx(P,{children:"This drawer explicitly shows DrawerPortal and DrawerOverlay usage, though DrawerContent includes them automatically."})]}),e.jsx("div",{className:"px-4 py-4",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"In most cases, you don't need to use DrawerPortal and DrawerOverlay directly - DrawerContent handles them for you."})})]})]})]})},qe={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs(S,{children:[e.jsx(H,{asChild:!0,children:e.jsx(d,{children:"Small Drawer"})}),e.jsxs(R,{className:"max-h-[30vh]",children:[e.jsxs(O,{children:[e.jsx(_,{children:"Small Drawer"}),e.jsx(P,{children:"Max height: 30vh"})]}),e.jsx("div",{className:"px-4 py-4",children:e.jsx("p",{className:"text-sm",children:"This is a small drawer for simple confirmations."})})]})]}),e.jsxs(S,{children:[e.jsx(H,{asChild:!0,children:e.jsx(d,{children:"Medium Drawer (Default)"})}),e.jsxs(R,{children:[e.jsxs(O,{children:[e.jsx(_,{children:"Medium Drawer"}),e.jsx(P,{children:"Default auto height"})]}),e.jsx("div",{className:"px-4 py-4",children:e.jsx("p",{className:"text-sm",children:"This is the default drawer size."})})]})]}),e.jsxs(S,{children:[e.jsx(H,{asChild:!0,children:e.jsx(d,{children:"Large Drawer"})}),e.jsxs(R,{className:"max-h-[90vh]",children:[e.jsxs(O,{children:[e.jsx(_,{children:"Large Drawer"}),e.jsx(P,{children:"Max height: 90vh"})]}),e.jsx("div",{className:"px-4 py-4",children:e.jsx("p",{className:"text-sm",children:"This is a large drawer for complex forms or content."})})]})]})]})},Fe={render:()=>e.jsxs(S,{children:[e.jsx(H,{asChild:!0,children:e.jsx(d,{"data-testid":"open-drawer",children:"Open Drawer"})}),e.jsxs(R,{"data-testid":"drawer-content",children:[e.jsxs(O,{children:[e.jsx(_,{children:"Test Drawer"}),e.jsx(P,{children:"This drawer tests keyboard and mouse interactions."})]}),e.jsx("div",{className:"px-4 py-4",children:e.jsx(de,{"data-testid":"drawer-input",placeholder:"Type here..."})}),e.jsxs(M,{children:[e.jsx(d,{"data-testid":"confirm-button",children:"Confirm"}),e.jsx(E,{asChild:!0,children:e.jsx(d,{variant:"outline","data-testid":"cancel-button",children:"Cancel"})})]})]})]}),play:async({canvasElement:r})=>{const n=xr(r),t=xr(document.body),o=n.getByTestId("open-drawer");await Ye.click(o),await new Promise(h=>setTimeout(h,300));const s=t.getByTestId("drawer-content");await Sn(s).toBeInTheDocument();const i=t.getByTestId("drawer-input");await Ye.click(i),await Ye.type(i,"Test input");const v=t.getByTestId("cancel-button");await Ye.click(v),await new Promise(h=>setTimeout(h,300))}},Me={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs(S,{children:[e.jsx(H,{asChild:!0,children:e.jsx(d,{style:{backgroundColor:"#0ec2bc",color:"white"},children:"Turquoise Accent"})}),e.jsxs(R,{children:[e.jsxs(O,{children:[e.jsx(_,{style:{color:"#0ec2bc"},children:"Ozean Licht Drawer"}),e.jsx(P,{children:"Using the Ozean Licht primary color (#0ec2bc) for accents."})]}),e.jsx("div",{className:"px-4 py-4",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"This demonstrates how to apply the Ozean Licht turquoise accent color to drawer elements. For full branded experience, see Tier 2 Drawer."})}),e.jsxs(M,{children:[e.jsx(d,{style:{backgroundColor:"#0ec2bc",color:"white"},children:"Confirm"}),e.jsx(E,{asChild:!0,children:e.jsx(d,{variant:"outline",children:"Cancel"})})]})]})]}),e.jsxs(S,{children:[e.jsx(H,{asChild:!0,children:e.jsx(d,{variant:"outline",style:{borderColor:"#0ec2bc",color:"#0ec2bc"},children:"Turquoise Border"})}),e.jsxs(R,{style:{borderColor:"#0ec2bc"},children:[e.jsxs(O,{children:[e.jsx(_,{children:"Drawer with Turquoise Border"}),e.jsx(P,{children:"Border and text accents using Ozean Licht color."})]}),e.jsx("div",{className:"px-4 py-4",children:e.jsx("p",{className:"text-sm",style:{color:"#0ec2bc"},children:"Key information can be highlighted with the turquoise accent."})}),e.jsx(M,{children:e.jsx(E,{asChild:!0,children:e.jsx(d,{variant:"outline",children:"Close"})})})]})]})]})},Ie={render:()=>e.jsxs(S,{children:[e.jsx(H,{asChild:!0,children:e.jsxs(d,{variant:"outline",children:[e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:"mr-2",children:[e.jsx("circle",{cx:"9",cy:"21",r:"1"}),e.jsx("circle",{cx:"20",cy:"21",r:"1"}),e.jsx("path",{d:"M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"})]}),"Cart (3)"]})}),e.jsxs(R,{className:"max-h-[90vh]",children:[e.jsxs(O,{children:[e.jsx(_,{children:"Shopping Cart"}),e.jsx(P,{children:"Review your items before checkout"})]}),e.jsx("div",{className:"overflow-y-auto max-h-[50vh] px-4 space-y-4",children:[{name:"Wireless Headphones",price:99.99,qty:1},{name:"USB-C Cable",price:14.99,qty:2},{name:"Phone Case",price:24.99,qty:1}].map((r,n)=>e.jsxs("div",{className:"flex items-center gap-4 p-3 border rounded-lg",children:[e.jsx("div",{className:"w-16 h-16 bg-gray-100 rounded"}),e.jsxs("div",{className:"flex-1",children:[e.jsx("h4",{className:"font-medium text-sm",children:r.name}),e.jsxs("p",{className:"text-xs text-muted-foreground",children:["Qty: ",r.qty]})]}),e.jsx("div",{className:"text-right",children:e.jsxs("p",{className:"font-medium",children:["$",r.price]})})]},n))}),e.jsxs("div",{className:"px-4 py-4 border-t",children:[e.jsxs("div",{className:"flex justify-between mb-2",children:[e.jsx("span",{className:"text-sm",children:"Subtotal"}),e.jsx("span",{className:"text-sm",children:"$154.97"})]}),e.jsxs("div",{className:"flex justify-between mb-2",children:[e.jsx("span",{className:"text-sm",children:"Shipping"}),e.jsx("span",{className:"text-sm",children:"$5.99"})]}),e.jsxs("div",{className:"flex justify-between font-bold text-lg border-t pt-2",children:[e.jsx("span",{children:"Total"}),e.jsx("span",{style:{color:"#0ec2bc"},children:"$160.96"})]})]}),e.jsxs(M,{children:[e.jsx(d,{style:{backgroundColor:"#0ec2bc",color:"white"},children:"Proceed to Checkout"}),e.jsx(E,{asChild:!0,children:e.jsx(d,{variant:"outline",children:"Continue Shopping"})})]})]})]})};var Cr,jr,Tr,Nr,Sr;Te.parameters={...Te.parameters,docs:{...(Cr=Te.parameters)==null?void 0:Cr.docs,source:{originalSource:`{
  render: () => <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
}`,...(Tr=(jr=Te.parameters)==null?void 0:jr.docs)==null?void 0:Tr.source},description:{story:`Default drawer with trigger button.

The most basic drawer implementation showing essential structure with drag handle.`,...(Sr=(Nr=Te.parameters)==null?void 0:Nr.docs)==null?void 0:Sr.description}}};var Br,kr,Er,Rr,Or;Ne.parameters={...Ne.parameters,docs:{...(Br=Ne.parameters)==null?void 0:Br.docs,source:{originalSource:`{
  render: () => <Drawer>
      <DrawerTrigger asChild>
        <Button>Edit Profile</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid gap-4 py-4 px-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" defaultValue="@peduarte" className="col-span-3" />
          </div>
        </div>
        <DrawerFooter>
          <Button type="submit">Save changes</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
}`,...(Er=(kr=Ne.parameters)==null?void 0:kr.docs)==null?void 0:Er.source},description:{story:`Drawer with footer actions.

Shows common pattern with action buttons in footer.`,...(Or=(Rr=Ne.parameters)==null?void 0:Rr.docs)==null?void 0:Or.description}}};var _r,Pr,Lr,Hr,Ar;Se.parameters={...Se.parameters,docs:{...(_r=Se.parameters)==null?void 0:_r.docs,source:{originalSource:`{
  render: () => <Drawer>
      <DrawerTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button variant="destructive">Delete Account</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
}`,...(Lr=(Pr=Se.parameters)==null?void 0:Pr.docs)==null?void 0:Lr.source},description:{story:`Confirmation drawer with explicit DrawerClose.

Shows how to use DrawerClose component to create cancel buttons.`,...(Ar=(Hr=Se.parameters)==null?void 0:Hr.docs)==null?void 0:Ar.description}}};var qr,Fr,Mr,Ir,$r;Be.parameters={...Be.parameters,docs:{...(qr=Be.parameters)==null?void 0:qr.docs,source:{originalSource:`{
  render: () => <Drawer>
      <DrawerTrigger asChild>
        <Button>Create Project</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create new project</DrawerTitle>
          <DrawerDescription>
            Add a new project to your workspace. Click create when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid gap-4 py-4 px-4">
          <div className="grid gap-2">
            <Label htmlFor="project-name">Project name</Label>
            <Input id="project-name" placeholder="My Awesome Project" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-description">Description</Label>
            <Input id="project-description" placeholder="A brief description of your project" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-url">Repository URL</Label>
            <Input id="project-url" type="url" placeholder="https://github.com/username/repo" />
          </div>
        </div>
        <DrawerFooter>
          <Button type="submit">Create Project</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
}`,...(Mr=(Fr=Be.parameters)==null?void 0:Fr.docs)==null?void 0:Mr.source},description:{story:`Form drawer example.

Common pattern for forms inside drawers - perfect for mobile data entry.`,...($r=(Ir=Be.parameters)==null?void 0:Ir.docs)==null?void 0:$r.description}}};var Vr,Wr,Ur,zr,Yr;ke.parameters={...ke.parameters,docs:{...(Vr=ke.parameters)==null?void 0:Vr.docs,source:{originalSource:`{
  render: () => <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          Menu
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
          <DrawerDescription>Browse available sections</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4 space-y-2">
          <DrawerClose asChild>
            <button className="w-full px-4 py-3 text-left hover:bg-gray-100 rounded-md transition-colors">
              Home
            </button>
          </DrawerClose>
          <DrawerClose asChild>
            <button className="w-full px-4 py-3 text-left hover:bg-gray-100 rounded-md transition-colors">
              Dashboard
            </button>
          </DrawerClose>
          <DrawerClose asChild>
            <button className="w-full px-4 py-3 text-left hover:bg-gray-100 rounded-md transition-colors">
              Projects
            </button>
          </DrawerClose>
          <DrawerClose asChild>
            <button className="w-full px-4 py-3 text-left hover:bg-gray-100 rounded-md transition-colors">
              Settings
            </button>
          </DrawerClose>
          <DrawerClose asChild>
            <button className="w-full px-4 py-3 text-left hover:bg-gray-100 rounded-md transition-colors">
              Profile
            </button>
          </DrawerClose>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close Menu</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
}`,...(Ur=(Wr=ke.parameters)==null?void 0:Wr.docs)==null?void 0:Ur.source},description:{story:`Mobile menu drawer.

Common pattern for mobile navigation menus.`,...(Yr=(zr=ke.parameters)==null?void 0:zr.docs)==null?void 0:Yr.description}}};var Xr,Gr,Kr,Qr,Jr;Ee.parameters={...Ee.parameters,docs:{...(Xr=Ee.parameters)==null?void 0:Xr.docs,source:{originalSource:`{
  render: () => <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filters
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter Results</DrawerTitle>
          <DrawerDescription>
            Refine your search with these filters
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4 space-y-4">
          <div className="space-y-2">
            <Label>Price Range</Label>
            <div className="flex gap-2">
              <Input type="number" placeholder="Min" />
              <Input type="number" placeholder="Max" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <select className="w-full px-3 py-2 border rounded-md">
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Home & Garden</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="space-y-1">
              {[5, 4, 3, 2, 1].map(rating => <label key={rating} className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span>{rating} stars & up</span>
                </label>)}
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button>Apply Filters</Button>
          <DrawerClose asChild>
            <Button variant="outline">Reset</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
}`,...(Kr=(Gr=Ee.parameters)==null?void 0:Gr.docs)==null?void 0:Kr.source},description:{story:`Filter drawer example.

Common pattern for mobile filter interfaces (e-commerce, search results).`,...(Jr=(Qr=Ee.parameters)==null?void 0:Qr.docs)==null?void 0:Jr.description}}};var Zr,et,rt,tt,nt;Re.parameters={...Re.parameters,docs:{...(Zr=Re.parameters)==null?void 0:Zr.docs,source:{originalSource:`{
  render: () => <Drawer>
      <DrawerTrigger asChild>
        <Button variant="cta" style={{
        backgroundColor: '#0ec2bc',
        color: 'white'
      }}>
          Complete Payment
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle style={{
          color: '#0ec2bc'
        }}>
            Payment Successful!
          </DrawerTitle>
          <DrawerDescription>
            Your payment of $99.00 has been processed successfully.
            A confirmation email has been sent to your inbox.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 py-6 text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{
          backgroundColor: '#0ec2bc20'
        }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0ec2bc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">
            Transaction ID: TXN-2024-001234
          </p>
        </div>
        <DrawerFooter>
          <Button style={{
          backgroundColor: '#0ec2bc',
          color: 'white'
        }}>
            View Receipt
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
}`,...(rt=(et=Re.parameters)==null?void 0:et.docs)==null?void 0:rt.source},description:{story:`Success notification drawer with Ozean Licht turquoise accent.

Demonstrates using design tokens for accent colors (#0ec2bc).`,...(nt=(tt=Re.parameters)==null?void 0:tt.docs)==null?void 0:nt.description}}};var at,ot,it,st,lt;Oe.parameters={...Oe.parameters,docs:{...(at=Oe.parameters)==null?void 0:at.docs,source:{originalSource:`{
  render: () => {
    const ControlledDrawer = () => {
      const [open, setOpen] = useState(false);
      return <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => setOpen(true)}>Open Drawer</Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close Drawer (External)
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Drawer is currently: {open ? 'Open' : 'Closed'}
          </p>
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Controlled Drawer</DrawerTitle>
                <DrawerDescription>
                  This drawer's state is controlled by external state.
                  You can open/close it programmatically.
                </DrawerDescription>
              </DrawerHeader>
              <div className="px-4 py-4">
                <p className="text-sm">
                  Use the buttons above to control this drawer, or use the
                  drag handle or click outside to close.
                </p>
              </div>
              <DrawerFooter>
                <Button onClick={() => setOpen(false)}>Close</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>;
    };
    return <ControlledDrawer />;
  }
}`,...(it=(ot=Oe.parameters)==null?void 0:ot.docs)==null?void 0:it.source},description:{story:"Controlled drawer state.\n\nShows how to control drawer open state programmatically using the `open` and `onOpenChange` props.",...(lt=(st=Oe.parameters)==null?void 0:st.docs)==null?void 0:lt.description}}};var ct,dt,ut,pt,mt;_e.parameters={..._e.parameters,docs:{...(ct=_e.parameters)==null?void 0:ct.docs,source:{originalSource:`{
  render: () => <Drawer shouldScaleBackground={false}>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer (No Scaling)</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>No Background Scaling</DrawerTitle>
          <DrawerDescription>
            This drawer doesn't scale the background content when opened.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 py-4">
          <p className="text-sm text-muted-foreground">
            Set shouldScaleBackground=false on the Drawer root component
            to disable the scaling effect.
          </p>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
}`,...(ut=(dt=_e.parameters)==null?void 0:dt.docs)==null?void 0:ut.source},description:{story:`Drawer without background scaling.

Disables the background scale effect with shouldScaleBackground={false}.`,...(mt=(pt=_e.parameters)==null?void 0:pt.docs)==null?void 0:mt.description}}};var ht,wt,ft,gt,xt;Pe.parameters={...Pe.parameters,docs:{...(ht=Pe.parameters)==null?void 0:ht.docs,source:{originalSource:`{
  render: () => <Drawer>
      <DrawerTrigger asChild>
        <Button>View Terms</Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle>Terms and Conditions</DrawerTitle>
          <DrawerDescription>
            Please read our terms and conditions carefully.
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto max-h-[50vh] px-4 space-y-4 text-sm">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
            eu fugiat nulla pariatur.
          </p>
          <p>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
            eu fugiat nulla pariatur.
          </p>
          <p>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <DrawerFooter>
          <Button>Accept</Button>
          <DrawerClose asChild>
            <Button variant="outline">Decline</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
}`,...(ft=(wt=Pe.parameters)==null?void 0:wt.docs)==null?void 0:ft.source},description:{story:`Scrollable content drawer.

Shows how to handle long content with scrolling.`,...(xt=(gt=Pe.parameters)==null?void 0:gt.docs)==null?void 0:xt.description}}};var vt,Dt,yt,bt,Ct;Le.parameters={...Le.parameters,docs:{...(vt=Le.parameters)==null?void 0:vt.docs,source:{originalSource:`{
  render: () => <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Custom Close Buttons</DrawerTitle>
          <DrawerDescription>
            Any element wrapped with DrawerClose will close the drawer when clicked.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 py-4 space-y-3">
          <DrawerClose asChild>
            <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm">
              Custom Button (closes drawer)
            </button>
          </DrawerClose>
          <DrawerClose asChild>
            <div className="w-full px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md text-sm cursor-pointer text-center">
              Div as close button
            </div>
          </DrawerClose>
          <DrawerClose asChild>
            <a href="#" className="block w-full px-4 py-2 bg-green-50 hover:bg-green-100 rounded-md text-sm text-center">
              Link as close button
            </a>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
}`,...(yt=(Dt=Le.parameters)==null?void 0:Dt.docs)==null?void 0:yt.source},description:{story:`Custom close button.

Demonstrates wrapping any element with DrawerClose to make it close the drawer.`,...(Ct=(bt=Le.parameters)==null?void 0:bt.docs)==null?void 0:Ct.description}}};var jt,Tt,Nt,St,Bt;He.parameters={...He.parameters,docs:{...(jt=He.parameters)==null?void 0:jt.docs,source:{originalSource:`{
  render: () => <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Simple Drawer</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 py-4">
          <p className="text-sm">
            This drawer doesn't have a DrawerDescription component, but it's
            generally recommended for accessibility.
          </p>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
}`,...(Nt=(Tt=He.parameters)==null?void 0:Tt.docs)==null?void 0:Nt.source},description:{story:`Drawer without description.

While DrawerDescription is recommended for accessibility, it's optional.`,...(Bt=(St=He.parameters)==null?void 0:St.docs)==null?void 0:Bt.description}}};var kt,Et,Rt,Ot,_t;Ae.parameters={...Ae.parameters,docs:{...(kt=Ae.parameters)==null?void 0:kt.docs,source:{originalSource:`{
  render: () => <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Drawer</Button>
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Explicit Structure</DrawerTitle>
            <DrawerDescription>
              This drawer explicitly shows DrawerPortal and DrawerOverlay usage,
              though DrawerContent includes them automatically.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-4">
            <p className="text-sm text-muted-foreground">
              In most cases, you don't need to use DrawerPortal and DrawerOverlay
              directly - DrawerContent handles them for you.
            </p>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
}`,...(Rt=(Et=Ae.parameters)==null?void 0:Et.docs)==null?void 0:Rt.source},description:{story:`Nested drawer structure demonstration.

Shows the explicit use of DrawerPortal and DrawerOverlay (though they're
automatically included in DrawerContent).`,...(_t=(Ot=Ae.parameters)==null?void 0:Ot.docs)==null?void 0:_t.description}}};var Pt,Lt,Ht,At,qt;qe.parameters={...qe.parameters,docs:{...(Pt=qe.parameters)==null?void 0:Pt.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <Drawer>
        <DrawerTrigger asChild>
          <Button>Small Drawer</Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[30vh]">
          <DrawerHeader>
            <DrawerTitle>Small Drawer</DrawerTitle>
            <DrawerDescription>Max height: 30vh</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-4">
            <p className="text-sm">This is a small drawer for simple confirmations.</p>
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer>
        <DrawerTrigger asChild>
          <Button>Medium Drawer (Default)</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Medium Drawer</DrawerTitle>
            <DrawerDescription>Default auto height</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-4">
            <p className="text-sm">This is the default drawer size.</p>
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer>
        <DrawerTrigger asChild>
          <Button>Large Drawer</Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>Large Drawer</DrawerTitle>
            <DrawerDescription>Max height: 90vh</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-4">
            <p className="text-sm">This is a large drawer for complex forms or content.</p>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
}`,...(Ht=(Lt=qe.parameters)==null?void 0:Lt.docs)==null?void 0:Ht.source},description:{story:`Height variants.

Demonstrates different drawer heights by overriding className.`,...(qt=(At=qe.parameters)==null?void 0:At.docs)==null?void 0:qt.description}}};var Ft,Mt,It,$t,Vt;Fe.parameters={...Fe.parameters,docs:{...(Ft=Fe.parameters)==null?void 0:Ft.docs,source:{originalSource:`{
  render: () => <Drawer>
      <DrawerTrigger asChild>
        <Button data-testid="open-drawer">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent data-testid="drawer-content">
        <DrawerHeader>
          <DrawerTitle>Test Drawer</DrawerTitle>
          <DrawerDescription>
            This drawer tests keyboard and mouse interactions.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 py-4">
          <Input data-testid="drawer-input" placeholder="Type here..." />
        </div>
        <DrawerFooter>
          <Button data-testid="confirm-button">Confirm</Button>
          <DrawerClose asChild>
            <Button variant="outline" data-testid="cancel-button">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    // Click trigger to open drawer
    const trigger = canvas.getByTestId('open-drawer');
    await userEvent.click(trigger);

    // Wait for drawer to open
    await new Promise(resolve => setTimeout(resolve, 300));

    // Drawer should be visible
    const drawerContent = body.getByTestId('drawer-content');
    await expect(drawerContent).toBeInTheDocument();

    // Focus should work on the drawer content
    const input = body.getByTestId('drawer-input');
    await userEvent.click(input);
    await userEvent.type(input, 'Test input');

    // Click cancel button to close
    const cancelButton = body.getByTestId('cancel-button');
    await userEvent.click(cancelButton);

    // Wait for drawer to close
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}`,...(It=(Mt=Fe.parameters)==null?void 0:Mt.docs)==null?void 0:It.source},description:{story:`Interactive test with play function.

Tests drawer open/close and keyboard navigation using Storybook interactions.`,...(Vt=($t=Fe.parameters)==null?void 0:$t.docs)==null?void 0:Vt.description}}};var Wt,Ut,zt,Yt,Xt;Me.parameters={...Me.parameters,docs:{...(Wt=Me.parameters)==null?void 0:Wt.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <Drawer>
        <DrawerTrigger asChild>
          <Button style={{
          backgroundColor: '#0ec2bc',
          color: 'white'
        }}>
            Turquoise Accent
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle style={{
            color: '#0ec2bc'
          }}>
              Ozean Licht Drawer
            </DrawerTitle>
            <DrawerDescription>
              Using the Ozean Licht primary color (#0ec2bc) for accents.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-4">
            <p className="text-sm text-muted-foreground">
              This demonstrates how to apply the Ozean Licht turquoise accent color
              to drawer elements. For full branded experience, see Tier 2 Drawer.
            </p>
          </div>
          <DrawerFooter>
            <Button style={{
            backgroundColor: '#0ec2bc',
            color: 'white'
          }}>
              Confirm
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" style={{
          borderColor: '#0ec2bc',
          color: '#0ec2bc'
        }}>
            Turquoise Border
          </Button>
        </DrawerTrigger>
        <DrawerContent style={{
        borderColor: '#0ec2bc'
      }}>
          <DrawerHeader>
            <DrawerTitle>Drawer with Turquoise Border</DrawerTitle>
            <DrawerDescription>
              Border and text accents using Ozean Licht color.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-4">
            <p className="text-sm" style={{
            color: '#0ec2bc'
          }}>
              Key information can be highlighted with the turquoise accent.
            </p>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
}`,...(zt=(Ut=Me.parameters)==null?void 0:Ut.docs)==null?void 0:zt.source},description:{story:`Ozean Licht themed examples.

Multiple drawers showcasing the Ozean Licht turquoise color (#0ec2bc).`,...(Xt=(Yt=Me.parameters)==null?void 0:Yt.docs)==null?void 0:Xt.description}}};var Gt,Kt,Qt,Jt,Zt;Ie.parameters={...Ie.parameters,docs:{...(Gt=Ie.parameters)==null?void 0:Gt.docs,source:{originalSource:`{
  render: () => <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Cart (3)
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>Shopping Cart</DrawerTitle>
          <DrawerDescription>
            Review your items before checkout
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto max-h-[50vh] px-4 space-y-4">
          {[{
          name: 'Wireless Headphones',
          price: 99.99,
          qty: 1
        }, {
          name: 'USB-C Cable',
          price: 14.99,
          qty: 2
        }, {
          name: 'Phone Case',
          price: 24.99,
          qty: 1
        }].map((item, i) => <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="w-16 h-16 bg-gray-100 rounded" />
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.name}</h4>
                <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">\${item.price}</p>
              </div>
            </div>)}
        </div>
        <div className="px-4 py-4 border-t">
          <div className="flex justify-between mb-2">
            <span className="text-sm">Subtotal</span>
            <span className="text-sm">$154.97</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm">Shipping</span>
            <span className="text-sm">$5.99</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span style={{
            color: '#0ec2bc'
          }}>$160.96</span>
          </div>
        </div>
        <DrawerFooter>
          <Button style={{
          backgroundColor: '#0ec2bc',
          color: 'white'
        }}>
            Proceed to Checkout
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Continue Shopping</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
}`,...(Qt=(Kt=Ie.parameters)==null?void 0:Kt.docs)==null?void 0:Qt.source},description:{story:`Shopping cart drawer example.

Realistic e-commerce use case showing a mobile shopping cart.`,...(Zt=(Jt=Ie.parameters)==null?void 0:Jt.docs)==null?void 0:Zt.description}}};const Pa=["Default","WithFooter","Confirmation","FormDrawer","MobileMenu","FilterDrawer","SuccessDrawer","ControlledState","NoBackgroundScaling","ScrollableContent","CustomCloseButton","WithoutDescription","ExplicitStructure","HeightVariants","InteractiveTest","OzeanLichtThemed","ShoppingCart"];export{Se as Confirmation,Oe as ControlledState,Le as CustomCloseButton,Te as Default,Ae as ExplicitStructure,Ee as FilterDrawer,Be as FormDrawer,qe as HeightVariants,Fe as InteractiveTest,ke as MobileMenu,_e as NoBackgroundScaling,Me as OzeanLichtThemed,Pe as ScrollableContent,Ie as ShoppingCart,Re as SuccessDrawer,Ne as WithFooter,He as WithoutDescription,Pa as __namedExportsOrder,_a as default};
