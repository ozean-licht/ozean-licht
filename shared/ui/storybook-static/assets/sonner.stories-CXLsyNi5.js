import{j as n}from"./jsx-runtime-DF2Pcvd1.js";import{R as o,r as At}from"./index-B2-qRKKC.js";import{I as Xo}from"./index-kS-9iBlu.js";import{L as Vo}from"./loader-circle-D-Axn3Lh.js";import{c as Jo}from"./createLucideIcon-BbF4D6Jl.js";import{T as qo,C as Ko}from"./triangle-alert-BvYms6I2.js";import{I as Go}from"./info-C_HoouFQ.js";import{B as c}from"./button-C8qtCU0L.js";import{S as $t}from"./sparkles-CywWwtDQ.js";import{C as Qo}from"./circle-check-big-BaV2tSNy.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-BiMR7eR1.js";import"./index-BFjtS4uE.js";import"./index-DVF2XGCm.js";import"./cn-CytzSlOG.js";/**
 * @license lucide-react v0.553.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zo=[["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z",key:"2d38gg"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]],ts=Jo("octagon-x",Zo);function es(a){if(typeof document>"u")return;let s=document.head||document.getElementsByTagName("head")[0],e=document.createElement("style");e.type="text/css",s.appendChild(e),e.styleSheet?e.styleSheet.cssText=a:e.appendChild(document.createTextNode(a))}const os=a=>{switch(a){case"success":return as;case"info":return is;case"warning":return rs;case"error":return ls;default:return null}},ss=Array(12).fill(0),ns=({visible:a,className:s})=>o.createElement("div",{className:["sonner-loading-wrapper",s].filter(Boolean).join(" "),"data-visible":a},o.createElement("div",{className:"sonner-spinner"},ss.map((e,r)=>o.createElement("div",{className:"sonner-loading-bar",key:`spinner-bar-${r}`})))),as=o.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",height:"20",width:"20"},o.createElement("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",clipRule:"evenodd"})),rs=o.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",height:"20",width:"20"},o.createElement("path",{fillRule:"evenodd",d:"M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z",clipRule:"evenodd"})),is=o.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",height:"20",width:"20"},o.createElement("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",clipRule:"evenodd"})),ls=o.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",height:"20",width:"20"},o.createElement("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z",clipRule:"evenodd"})),cs=o.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"},o.createElement("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),o.createElement("line",{x1:"6",y1:"6",x2:"18",y2:"18"})),ds=()=>{const[a,s]=o.useState(document.hidden);return o.useEffect(()=>{const e=()=>{s(document.hidden)};return document.addEventListener("visibilitychange",e),()=>window.removeEventListener("visibilitychange",e)},[]),a};let Yt=1;class us{constructor(){this.subscribe=s=>(this.subscribers.push(s),()=>{const e=this.subscribers.indexOf(s);this.subscribers.splice(e,1)}),this.publish=s=>{this.subscribers.forEach(e=>e(s))},this.addToast=s=>{this.publish(s),this.toasts=[...this.toasts,s]},this.create=s=>{var e;const{message:r,...x}=s,m=typeof(s==null?void 0:s.id)=="number"||((e=s.id)==null?void 0:e.length)>0?s.id:Yt++,b=this.toasts.find(h=>h.id===m),N=s.dismissible===void 0?!0:s.dismissible;return this.dismissedToasts.has(m)&&this.dismissedToasts.delete(m),b?this.toasts=this.toasts.map(h=>h.id===m?(this.publish({...h,...s,id:m,title:r}),{...h,...s,id:m,dismissible:N,title:r}):h):this.addToast({title:r,...x,dismissible:N,id:m}),m},this.dismiss=s=>(s?(this.dismissedToasts.add(s),requestAnimationFrame(()=>this.subscribers.forEach(e=>e({id:s,dismiss:!0})))):this.toasts.forEach(e=>{this.subscribers.forEach(r=>r({id:e.id,dismiss:!0}))}),s),this.message=(s,e)=>this.create({...e,message:s}),this.error=(s,e)=>this.create({...e,message:s,type:"error"}),this.success=(s,e)=>this.create({...e,type:"success",message:s}),this.info=(s,e)=>this.create({...e,type:"info",message:s}),this.warning=(s,e)=>this.create({...e,type:"warning",message:s}),this.loading=(s,e)=>this.create({...e,type:"loading",message:s}),this.promise=(s,e)=>{if(!e)return;let r;e.loading!==void 0&&(r=this.create({...e,promise:s,type:"loading",message:e.loading,description:typeof e.description!="function"?e.description:void 0}));const x=Promise.resolve(s instanceof Function?s():s);let m=r!==void 0,b;const N=x.then(async d=>{if(b=["resolve",d],o.isValidElement(d))m=!1,this.create({id:r,type:"default",message:d});else if(ps(d)&&!d.ok){m=!1;const t=typeof e.error=="function"?await e.error(`HTTP error! status: ${d.status}`):e.error,S=typeof e.description=="function"?await e.description(`HTTP error! status: ${d.status}`):e.description,C=typeof t=="object"&&!o.isValidElement(t)?t:{message:t};this.create({id:r,type:"error",description:S,...C})}else if(d instanceof Error){m=!1;const t=typeof e.error=="function"?await e.error(d):e.error,S=typeof e.description=="function"?await e.description(d):e.description,C=typeof t=="object"&&!o.isValidElement(t)?t:{message:t};this.create({id:r,type:"error",description:S,...C})}else if(e.success!==void 0){m=!1;const t=typeof e.success=="function"?await e.success(d):e.success,S=typeof e.description=="function"?await e.description(d):e.description,C=typeof t=="object"&&!o.isValidElement(t)?t:{message:t};this.create({id:r,type:"success",description:S,...C})}}).catch(async d=>{if(b=["reject",d],e.error!==void 0){m=!1;const k=typeof e.error=="function"?await e.error(d):e.error,t=typeof e.description=="function"?await e.description(d):e.description,v=typeof k=="object"&&!o.isValidElement(k)?k:{message:k};this.create({id:r,type:"error",description:t,...v})}}).finally(()=>{m&&(this.dismiss(r),r=void 0),e.finally==null||e.finally.call(e)}),h=()=>new Promise((d,k)=>N.then(()=>b[0]==="reject"?k(b[1]):d(b[1])).catch(k));return typeof r!="string"&&typeof r!="number"?{unwrap:h}:Object.assign(r,{unwrap:h})},this.custom=(s,e)=>{const r=(e==null?void 0:e.id)||Yt++;return this.create({jsx:s(r),id:r,...e}),r},this.getActiveToasts=()=>this.toasts.filter(s=>!this.dismissedToasts.has(s.id)),this.subscribers=[],this.toasts=[],this.dismissedToasts=new Set}}const D=new us,ms=(a,s)=>{const e=(s==null?void 0:s.id)||Yt++;return D.addToast({title:a,...s,id:e}),e},ps=a=>a&&typeof a=="object"&&"ok"in a&&typeof a.ok=="boolean"&&"status"in a&&typeof a.status=="number",fs=ms,hs=()=>D.toasts,gs=()=>D.getActiveToasts(),i=Object.assign(fs,{success:D.success,info:D.info,warning:D.warning,error:D.error,custom:D.custom,message:D.message,promise:D.promise,dismiss:D.dismiss,loading:D.loading},{getHistory:hs,getToasts:gs});es("[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}");function Pt(a){return a.label!==void 0}const bs=3,vs="24px",ys="16px",te=4e3,ws=356,xs=14,Cs=45,ks=200;function F(...a){return a.filter(Boolean).join(" ")}function Ts(a){const[s,e]=a.split("-"),r=[];return s&&r.push(s),e&&r.push(e),r}const Ss=a=>{var s,e,r,x,m,b,N,h,d;const{invert:k,toast:t,unstyled:S,interacting:v,setHeights:C,visibleToasts:K,heights:U,index:p,toasts:St,expanded:G,removeToast:Bt,defaultRichColors:Lt,closeButton:z,style:nt,cancelButtonStyle:W,actionButtonStyle:Ot,className:Et="",descriptionClassName:Ft="",duration:at,position:O,gap:Nt,expandByDefault:rt,classNames:f,icons:B,closeButtonAriaLabel:Y="Close toast"}=a,[X,P]=o.useState(null),[V,jt]=o.useState(null),[u,w]=o.useState(!1),[y,_]=o.useState(!1),[Q,g]=o.useState(!1),[Z,Dt]=o.useState(!1),[Rt,tt]=o.useState(!1),[Mo,zt]=o.useState(0),[Po,Wt]=o.useState(0),it=o.useRef(t.duration||at||te),Xt=o.useRef(null),H=o.useRef(null),Ao=p===0,Lo=p+1<=K,R=t.type,et=t.dismissible!==!1,Oo=t.className||"",Fo=t.descriptionClassName||"",It=o.useMemo(()=>U.findIndex(l=>l.toastId===t.id)||0,[U,t.id]),zo=o.useMemo(()=>{var l;return(l=t.closeButton)!=null?l:z},[t.closeButton,z]),Vt=o.useMemo(()=>t.duration||at||te,[t.duration,at]),Ht=o.useRef(0),ot=o.useRef(0),Jt=o.useRef(0),st=o.useRef(null),[Ho,Uo]=O.split("-"),qt=o.useMemo(()=>U.reduce((l,T,j)=>j>=It?l:l+T.height,0),[U,It]),Kt=ds(),Yo=t.invert||k,Ut=R==="loading";ot.current=o.useMemo(()=>It*Nt+qt,[It,qt]),o.useEffect(()=>{it.current=Vt},[Vt]),o.useEffect(()=>{w(!0)},[]),o.useEffect(()=>{const l=H.current;if(l){const T=l.getBoundingClientRect().height;return Wt(T),C(j=>[{toastId:t.id,height:T,position:t.position},...j]),()=>C(j=>j.filter(I=>I.toastId!==t.id))}},[C,t.id]),o.useLayoutEffect(()=>{if(!u)return;const l=H.current,T=l.style.height;l.style.height="auto";const j=l.getBoundingClientRect().height;l.style.height=T,Wt(j),C(I=>I.find(E=>E.toastId===t.id)?I.map(E=>E.toastId===t.id?{...E,height:j}:E):[{toastId:t.id,height:j,position:t.position},...I])},[u,t.title,t.description,C,t.id,t.jsx,t.action,t.cancel]);const $=o.useCallback(()=>{_(!0),zt(ot.current),C(l=>l.filter(T=>T.toastId!==t.id)),setTimeout(()=>{Bt(t)},ks)},[t,Bt,C,ot]);o.useEffect(()=>{if(t.promise&&R==="loading"||t.duration===1/0||t.type==="loading")return;let l;return G||v||Kt?(()=>{if(Jt.current<Ht.current){const I=new Date().getTime()-Ht.current;it.current=it.current-I}Jt.current=new Date().getTime()})():(()=>{it.current!==1/0&&(Ht.current=new Date().getTime(),l=setTimeout(()=>{t.onAutoClose==null||t.onAutoClose.call(t,t),$()},it.current))})(),()=>clearTimeout(l)},[G,v,t,R,Kt,$]),o.useEffect(()=>{t.delete&&($(),t.onDismiss==null||t.onDismiss.call(t,t))},[$,t.delete]);function $o(){var l;if(B!=null&&B.loading){var T;return o.createElement("div",{className:F(f==null?void 0:f.loader,t==null||(T=t.classNames)==null?void 0:T.loader,"sonner-loader"),"data-visible":R==="loading"},B.loading)}return o.createElement(ns,{className:F(f==null?void 0:f.loader,t==null||(l=t.classNames)==null?void 0:l.loader),visible:R==="loading"})}const Wo=t.icon||(B==null?void 0:B[R])||os(R);var Gt,Qt;return o.createElement("li",{tabIndex:0,ref:H,className:F(Et,Oo,f==null?void 0:f.toast,t==null||(s=t.classNames)==null?void 0:s.toast,f==null?void 0:f.default,f==null?void 0:f[R],t==null||(e=t.classNames)==null?void 0:e[R]),"data-sonner-toast":"","data-rich-colors":(Gt=t.richColors)!=null?Gt:Lt,"data-styled":!(t.jsx||t.unstyled||S),"data-mounted":u,"data-promise":!!t.promise,"data-swiped":Rt,"data-removed":y,"data-visible":Lo,"data-y-position":Ho,"data-x-position":Uo,"data-index":p,"data-front":Ao,"data-swiping":Q,"data-dismissible":et,"data-type":R,"data-invert":Yo,"data-swipe-out":Z,"data-swipe-direction":V,"data-expanded":!!(G||rt&&u),"data-testid":t.testId,style:{"--index":p,"--toasts-before":p,"--z-index":St.length-p,"--offset":`${y?Mo:ot.current}px`,"--initial-height":rt?"auto":`${Po}px`,...nt,...t.style},onDragEnd:()=>{g(!1),P(null),st.current=null},onPointerDown:l=>{l.button!==2&&(Ut||!et||(Xt.current=new Date,zt(ot.current),l.target.setPointerCapture(l.pointerId),l.target.tagName!=="BUTTON"&&(g(!0),st.current={x:l.clientX,y:l.clientY})))},onPointerUp:()=>{var l,T,j;if(Z||!et)return;st.current=null;const I=Number(((l=H.current)==null?void 0:l.style.getPropertyValue("--swipe-amount-x").replace("px",""))||0),_t=Number(((T=H.current)==null?void 0:T.style.getPropertyValue("--swipe-amount-y").replace("px",""))||0),E=new Date().getTime()-((j=Xt.current)==null?void 0:j.getTime()),M=X==="x"?I:_t,Mt=Math.abs(M)/E;if(Math.abs(M)>=Cs||Mt>.11){zt(ot.current),t.onDismiss==null||t.onDismiss.call(t,t),jt(X==="x"?I>0?"right":"left":_t>0?"down":"up"),$(),Dt(!0);return}else{var A,L;(A=H.current)==null||A.style.setProperty("--swipe-amount-x","0px"),(L=H.current)==null||L.style.setProperty("--swipe-amount-y","0px")}tt(!1),g(!1),P(null)},onPointerMove:l=>{var T,j,I;if(!st.current||!et||((T=window.getSelection())==null?void 0:T.toString().length)>0)return;const E=l.clientY-st.current.y,M=l.clientX-st.current.x;var Mt;const A=(Mt=a.swipeDirections)!=null?Mt:Ts(O);!X&&(Math.abs(M)>1||Math.abs(E)>1)&&P(Math.abs(M)>Math.abs(E)?"x":"y");let L={x:0,y:0};const Zt=J=>1/(1.5+Math.abs(J)/20);if(X==="y"){if(A.includes("top")||A.includes("bottom"))if(A.includes("top")&&E<0||A.includes("bottom")&&E>0)L.y=E;else{const J=E*Zt(E);L.y=Math.abs(J)<Math.abs(E)?J:E}}else if(X==="x"&&(A.includes("left")||A.includes("right")))if(A.includes("left")&&M<0||A.includes("right")&&M>0)L.x=M;else{const J=M*Zt(M);L.x=Math.abs(J)<Math.abs(M)?J:M}(Math.abs(L.x)>0||Math.abs(L.y)>0)&&tt(!0),(j=H.current)==null||j.style.setProperty("--swipe-amount-x",`${L.x}px`),(I=H.current)==null||I.style.setProperty("--swipe-amount-y",`${L.y}px`)}},zo&&!t.jsx&&R!=="loading"?o.createElement("button",{"aria-label":Y,"data-disabled":Ut,"data-close-button":!0,onClick:Ut||!et?()=>{}:()=>{$(),t.onDismiss==null||t.onDismiss.call(t,t)},className:F(f==null?void 0:f.closeButton,t==null||(r=t.classNames)==null?void 0:r.closeButton)},(Qt=B==null?void 0:B.close)!=null?Qt:cs):null,(R||t.icon||t.promise)&&t.icon!==null&&((B==null?void 0:B[R])!==null||t.icon)?o.createElement("div",{"data-icon":"",className:F(f==null?void 0:f.icon,t==null||(x=t.classNames)==null?void 0:x.icon)},t.promise||t.type==="loading"&&!t.icon?t.icon||$o():null,t.type!=="loading"?Wo:null):null,o.createElement("div",{"data-content":"",className:F(f==null?void 0:f.content,t==null||(m=t.classNames)==null?void 0:m.content)},o.createElement("div",{"data-title":"",className:F(f==null?void 0:f.title,t==null||(b=t.classNames)==null?void 0:b.title)},t.jsx?t.jsx:typeof t.title=="function"?t.title():t.title),t.description?o.createElement("div",{"data-description":"",className:F(Ft,Fo,f==null?void 0:f.description,t==null||(N=t.classNames)==null?void 0:N.description)},typeof t.description=="function"?t.description():t.description):null),o.isValidElement(t.cancel)?t.cancel:t.cancel&&Pt(t.cancel)?o.createElement("button",{"data-button":!0,"data-cancel":!0,style:t.cancelButtonStyle||W,onClick:l=>{Pt(t.cancel)&&et&&(t.cancel.onClick==null||t.cancel.onClick.call(t.cancel,l),$())},className:F(f==null?void 0:f.cancelButton,t==null||(h=t.classNames)==null?void 0:h.cancelButton)},t.cancel.label):null,o.isValidElement(t.action)?t.action:t.action&&Pt(t.action)?o.createElement("button",{"data-button":!0,"data-action":!0,style:t.actionButtonStyle||Ot,onClick:l=>{Pt(t.action)&&(t.action.onClick==null||t.action.onClick.call(t.action,l),!l.defaultPrevented&&$())},className:F(f==null?void 0:f.actionButton,t==null||(d=t.classNames)==null?void 0:d.actionButton)},t.action.label):null)};function ee(){if(typeof window>"u"||typeof document>"u")return"ltr";const a=document.documentElement.getAttribute("dir");return a==="auto"||!a?window.getComputedStyle(document.documentElement).direction:a}function Bs(a,s){const e={};return[a,s].forEach((r,x)=>{const m=x===1,b=m?"--mobile-offset":"--offset",N=m?ys:vs;function h(d){["top","right","bottom","left"].forEach(k=>{e[`${b}-${k}`]=typeof d=="number"?`${d}px`:d})}typeof r=="number"||typeof r=="string"?h(r):typeof r=="object"?["top","right","bottom","left"].forEach(d=>{r[d]===void 0?e[`${b}-${d}`]=N:e[`${b}-${d}`]=typeof r[d]=="number"?`${r[d]}px`:r[d]}):h(N)}),e}const Es=o.forwardRef(function(s,e){const{id:r,invert:x,position:m="bottom-right",hotkey:b=["altKey","KeyT"],expand:N,closeButton:h,className:d,offset:k,mobileOffset:t,theme:S="light",richColors:v,duration:C,style:K,visibleToasts:U=bs,toastOptions:p,dir:St=ee(),gap:G=xs,icons:Bt,containerAriaLabel:Lt="Notifications"}=s,[z,nt]=o.useState([]),W=o.useMemo(()=>r?z.filter(u=>u.toasterId===r):z.filter(u=>!u.toasterId),[z,r]),Ot=o.useMemo(()=>Array.from(new Set([m].concat(W.filter(u=>u.position).map(u=>u.position)))),[W,m]),[Et,Ft]=o.useState([]),[at,O]=o.useState(!1),[Nt,rt]=o.useState(!1),[f,B]=o.useState(S!=="system"?S:typeof window<"u"&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"),Y=o.useRef(null),X=b.join("+").replace(/Key/g,"").replace(/Digit/g,""),P=o.useRef(null),V=o.useRef(!1),jt=o.useCallback(u=>{nt(w=>{var y;return(y=w.find(_=>_.id===u.id))!=null&&y.delete||D.dismiss(u.id),w.filter(({id:_})=>_!==u.id)})},[]);return o.useEffect(()=>D.subscribe(u=>{if(u.dismiss){requestAnimationFrame(()=>{nt(w=>w.map(y=>y.id===u.id?{...y,delete:!0}:y))});return}setTimeout(()=>{Xo.flushSync(()=>{nt(w=>{const y=w.findIndex(_=>_.id===u.id);return y!==-1?[...w.slice(0,y),{...w[y],...u},...w.slice(y+1)]:[u,...w]})})})}),[z]),o.useEffect(()=>{if(S!=="system"){B(S);return}if(S==="system"&&(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?B("dark"):B("light")),typeof window>"u")return;const u=window.matchMedia("(prefers-color-scheme: dark)");try{u.addEventListener("change",({matches:w})=>{B(w?"dark":"light")})}catch{u.addListener(({matches:y})=>{try{B(y?"dark":"light")}catch(_){console.error(_)}})}},[S]),o.useEffect(()=>{z.length<=1&&O(!1)},[z]),o.useEffect(()=>{const u=w=>{var y;if(b.every(g=>w[g]||w.code===g)){var Q;O(!0),(Q=Y.current)==null||Q.focus()}w.code==="Escape"&&(document.activeElement===Y.current||(y=Y.current)!=null&&y.contains(document.activeElement))&&O(!1)};return document.addEventListener("keydown",u),()=>document.removeEventListener("keydown",u)},[b]),o.useEffect(()=>{if(Y.current)return()=>{P.current&&(P.current.focus({preventScroll:!0}),P.current=null,V.current=!1)}},[Y.current]),o.createElement("section",{ref:e,"aria-label":`${Lt} ${X}`,tabIndex:-1,"aria-live":"polite","aria-relevant":"additions text","aria-atomic":"false",suppressHydrationWarning:!0},Ot.map((u,w)=>{var y;const[_,Q]=u.split("-");return W.length?o.createElement("ol",{key:u,dir:St==="auto"?ee():St,tabIndex:-1,ref:Y,className:d,"data-sonner-toaster":!0,"data-sonner-theme":f,"data-y-position":_,"data-x-position":Q,style:{"--front-toast-height":`${((y=Et[0])==null?void 0:y.height)||0}px`,"--width":`${ws}px`,"--gap":`${G}px`,...K,...Bs(k,t)},onBlur:g=>{V.current&&!g.currentTarget.contains(g.relatedTarget)&&(V.current=!1,P.current&&(P.current.focus({preventScroll:!0}),P.current=null))},onFocus:g=>{g.target instanceof HTMLElement&&g.target.dataset.dismissible==="false"||V.current||(V.current=!0,P.current=g.relatedTarget)},onMouseEnter:()=>O(!0),onMouseMove:()=>O(!0),onMouseLeave:()=>{Nt||O(!1)},onDragEnd:()=>O(!1),onPointerDown:g=>{g.target instanceof HTMLElement&&g.target.dataset.dismissible==="false"||rt(!0)},onPointerUp:()=>rt(!1)},W.filter(g=>!g.position&&w===0||g.position===u).map((g,Z)=>{var Dt,Rt;return o.createElement(Ss,{key:g.id,icons:Bt,index:Z,toast:g,defaultRichColors:v,duration:(Dt=p==null?void 0:p.duration)!=null?Dt:C,className:p==null?void 0:p.className,descriptionClassName:p==null?void 0:p.descriptionClassName,invert:x,visibleToasts:U,closeButton:(Rt=p==null?void 0:p.closeButton)!=null?Rt:h,interacting:Nt,position:u,style:p==null?void 0:p.style,unstyled:p==null?void 0:p.unstyled,classNames:p==null?void 0:p.classNames,cancelButtonStyle:p==null?void 0:p.cancelButtonStyle,actionButtonStyle:p==null?void 0:p.actionButtonStyle,closeButtonAriaLabel:p==null?void 0:p.closeButtonAriaLabel,removeToast:jt,toasts:W.filter(tt=>tt.position==g.position),heights:Et.filter(tt=>tt.position==g.position),setHeights:Ft,expandByDefault:N,gap:G,expanded:at,swipeDirections:s.swipeDirections})})):null}))});var Ns=(a,s,e,r,x,m,b,N)=>{let h=document.documentElement,d=["light","dark"];function k(v){(Array.isArray(a)?a:[a]).forEach(C=>{let K=C==="class",U=K&&m?x.map(p=>m[p]||p):x;K?(h.classList.remove(...U),h.classList.add(m&&m[v]?m[v]:v)):h.setAttribute(C,v)}),t(v)}function t(v){N&&d.includes(v)&&(h.style.colorScheme=v)}function S(){return window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}if(r)k(r);else try{let v=localStorage.getItem(s)||e,C=b&&v==="system"?S():v;k(C)}catch{}},js=At.createContext(void 0),Ds={setTheme:a=>{},themes:[]},Rs=()=>{var a;return(a=At.useContext(js))!=null?a:Ds};At.memo(({forcedTheme:a,storageKey:s,attribute:e,enableSystem:r,enableColorScheme:x,defaultTheme:m,value:b,themes:N,nonce:h,scriptProps:d})=>{let k=JSON.stringify([e,s,m,a,N,b,r,x]).slice(1,-1);return At.createElement("script",{...d,suppressHydrationWarning:!0,nonce:typeof window>"u"?h:"",dangerouslySetInnerHTML:{__html:`(${Ns.toString()})(${k})`}})});const q=({...a})=>{const{theme:s="system"}=Rs();return n.jsx(Es,{theme:s,className:"toaster group",icons:{success:n.jsx(Ko,{className:"h-4 w-4"}),info:n.jsx(Go,{className:"h-4 w-4"}),warning:n.jsx(qo,{className:"h-4 w-4"}),error:n.jsx(ts,{className:"h-4 w-4"}),loading:n.jsx(Vo,{className:"h-4 w-4 animate-spin"})},toastOptions:{classNames:{toast:"group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",description:"group-[.toast]:text-muted-foreground",actionButton:"group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",cancelButton:"group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"}},...a})};try{q.displayName="Toaster",q.__docgenInfo={description:"",displayName:"Toaster",props:{}}}catch{}const Js={title:"Tier 1: Primitives/shadcn/Sonner",component:q,parameters:{layout:"centered",docs:{description:{component:"An opinionated toast component for React. Beautiful, customizable toast notifications with rich features."}}},tags:["autodocs"],decorators:[a=>n.jsxs("div",{children:[n.jsx(a,{}),n.jsx(q,{})]})]},lt={render:()=>n.jsx(c,{onClick:()=>i("This is a default toast notification"),children:"Show Toast"})},ct={render:()=>n.jsxs("div",{className:"flex flex-wrap gap-3",children:[n.jsx(c,{onClick:()=>i.success("Profile updated successfully!"),style:{backgroundColor:"#10b981",color:"white"},children:"Success Toast"}),n.jsx(c,{onClick:()=>i.error("Failed to save changes"),style:{backgroundColor:"#ef4444",color:"white"},children:"Error Toast"}),n.jsx(c,{onClick:()=>i.warning("Your session will expire soon"),style:{backgroundColor:"#f59e0b",color:"white"},children:"Warning Toast"}),n.jsx(c,{onClick:()=>i.info("New features are available"),style:{backgroundColor:"#3b82f6",color:"white"},children:"Info Toast"}),n.jsx(c,{onClick:()=>i.loading("Processing your request..."),variant:"outline",children:"Loading Toast"})]})},dt={render:()=>n.jsx(c,{onClick:()=>i("New message received",{description:"You have a new message from Sarah Chen. Tap to read it now."}),children:"Show Toast with Description"})},ut={render:()=>n.jsx(c,{onClick:()=>i("Meeting starts in 5 minutes",{description:"Daily standup with the engineering team",action:{label:"Join Now",onClick:()=>console.log("Joining meeting...")}}),style:{backgroundColor:"#0ec2bc",color:"white"},children:"Show Action Toast"})},mt={render:()=>n.jsx(c,{onClick:()=>i("File deleted successfully",{description:"document.pdf has been moved to trash",action:{label:"Undo",onClick:()=>console.log("Undo delete")},cancel:{label:"Dismiss",onClick:()=>console.log("Dismissed")}}),variant:"outline",children:"Delete with Undo"})},pt={render:()=>{const a=()=>{const s=new Promise((e,r)=>{setTimeout(()=>{Math.random()>.5?e({name:"User"}):r("Failed")},2e3)});i.promise(s,{loading:"Saving changes...",success:e=>"Changes saved successfully!",error:"Failed to save changes. Please try again."})};return n.jsx(c,{onClick:a,style:{backgroundColor:"#0ec2bc",color:"white"},children:"Save with Promise"})}},ft={render:()=>n.jsxs("div",{className:"flex flex-wrap gap-3",children:[n.jsx(c,{onClick:()=>i("Quick toast (1s)",{duration:1e3}),variant:"outline",children:"1 Second"}),n.jsx(c,{onClick:()=>i("Standard toast (4s)",{duration:4e3}),variant:"outline",children:"4 Seconds (Default)"}),n.jsx(c,{onClick:()=>i("Long toast (10s)",{duration:1e4}),variant:"outline",children:"10 Seconds"}),n.jsx(c,{onClick:()=>i("Persistent toast",{duration:1/0}),variant:"outline",children:"Never Dismiss"})]})},ht={render:()=>n.jsxs("div",{className:"flex flex-wrap gap-3",children:[n.jsx(c,{onClick:()=>i("Achievement unlocked!",{icon:o.createElement($t,{className:"h-4 w-4 text-yellow-500"})}),style:{backgroundColor:"#f59e0b",color:"white"},children:"Custom Icon"}),n.jsx(c,{onClick:()=>i.success("Payment received",{icon:o.createElement(Qo,{className:"h-4 w-4"})}),variant:"outline",children:"Override Success Icon"}),n.jsx(c,{onClick:()=>i("No icon toast",{icon:o.createElement("div",null)}),variant:"outline",children:"No Icon"})]})},gt={render:()=>n.jsxs("div",{className:"flex flex-wrap gap-3",children:[n.jsx(c,{onClick:()=>i("Top Left",{position:"top-left"}),variant:"outline",children:"Top Left"}),n.jsx(c,{onClick:()=>i("Top Center",{position:"top-center"}),variant:"outline",children:"Top Center"}),n.jsx(c,{onClick:()=>i("Top Right",{position:"top-right"}),variant:"outline",children:"Top Right"}),n.jsx(c,{onClick:()=>i("Bottom Left",{position:"bottom-left"}),variant:"outline",children:"Bottom Left"}),n.jsx(c,{onClick:()=>i("Bottom Center",{position:"bottom-center"}),variant:"outline",children:"Bottom Center"}),n.jsx(c,{onClick:()=>i("Bottom Right",{position:"bottom-right"}),variant:"outline",children:"Bottom Right"})]})},bt={render:()=>n.jsxs("div",{children:[n.jsxs("div",{className:"flex flex-wrap gap-3 mb-4",children:[n.jsx(c,{onClick:()=>i.success("Profile updated!"),style:{backgroundColor:"#10b981",color:"white"},children:"Success"}),n.jsx(c,{onClick:()=>i.error("Connection failed"),style:{backgroundColor:"#ef4444",color:"white"},children:"Error"}),n.jsx(c,{onClick:()=>i.warning("Low storage space"),style:{backgroundColor:"#f59e0b",color:"white"},children:"Warning"}),n.jsx(c,{onClick:()=>i.info("Update available"),style:{backgroundColor:"#3b82f6",color:"white"},children:"Info"})]}),n.jsx(q,{richColors:!0})]})},vt={render:()=>n.jsxs("div",{children:[n.jsx(c,{onClick:()=>i("This toast has a close button",{description:"Click the X to dismiss manually"}),children:"Show Toast with Close Button"}),n.jsx(q,{closeButton:!0})]})},yt={render:()=>n.jsxs("div",{className:"flex flex-wrap gap-3",children:[n.jsx(c,{onClick:()=>i.success("Welcome to Ozean Licht!",{description:"Your cosmic journey begins now",style:{border:"1px solid #0ec2bc"}}),style:{backgroundColor:"#0ec2bc",color:"white"},children:"Branded Success"}),n.jsx(c,{onClick:()=>i("New feature unlocked",{description:"Check out the updated dashboard",icon:o.createElement($t,{className:"h-4 w-4",style:{color:"#0ec2bc"}}),action:{label:"Explore",onClick:()=>console.log("Exploring...")},style:{border:"1px solid #0ec2bc"}}),variant:"outline",style:{borderColor:"#0ec2bc",color:"#0ec2bc"},children:"Feature Toast"}),n.jsx(c,{onClick:()=>{const a=new Promise(s=>{setTimeout(()=>s({success:!0}),2e3)});i.promise(a,{loading:"Processing your request...",success:"Request completed successfully!",error:"Failed to process request"})},style:{backgroundColor:"#0ec2bc",color:"white"},children:"Async Operation"})]})},wt={render:()=>{const a=async()=>{const s=new Promise((e,r)=>{setTimeout(()=>{Math.random()>.3?e({id:123}):r("Network error")},2e3)});i.promise(s,{loading:"Submitting form...",success:"Form submitted successfully!",error:e=>`Submission failed: ${e}`})};return n.jsx(c,{onClick:a,style:{backgroundColor:"#0ec2bc",color:"white"},children:"Submit Form"})}},xt={render:()=>{let a=0;const s=()=>{i.success("First action completed"),setTimeout(()=>{i.info("Processing next step...",{description:"This may take a few moments"})},500),setTimeout(()=>{i.success("All tasks completed!",{description:"You can now proceed to the dashboard",action:{label:"Go to Dashboard",onClick:()=>console.log("Navigate to dashboard")}})},1500)},e=()=>{a++;const x=a;i(`Item ${x} deleted`,{description:"The item has been moved to trash",action:{label:"Undo",onClick:()=>{i.success(`Item ${x} restored`)}},cancel:{label:"Dismiss",onClick:()=>console.log("Dismissed")}})},r=()=>{const x=i.loading("Uploading file...");setTimeout(()=>{i.success("File uploaded successfully!",{id:x})},3e3)};return n.jsxs("div",{className:"space-y-4",children:[n.jsxs("div",{className:"flex flex-wrap gap-3",children:[n.jsx(c,{onClick:s,style:{backgroundColor:"#0ec2bc",color:"white"},children:"Multiple Toasts"}),n.jsx(c,{onClick:e,variant:"outline",children:"Delete with Undo"}),n.jsx(c,{onClick:r,variant:"outline",children:"Upload File"}),n.jsx(c,{onClick:()=>i("Meeting reminder",{description:"Team sync in 15 minutes",duration:8e3,action:{label:"Join",onClick:()=>i.success("Joining meeting...")}}),variant:"outline",children:"Meeting Reminder"})]}),n.jsx("p",{className:"text-sm text-muted-foreground max-w-md",children:"Click the buttons to see different toast patterns. The toasts will stack intelligently and can be dismissed by clicking the X or waiting for auto-dismiss."})]})}},Ct={render:()=>n.jsx(c,{onClick:()=>i.error("Critical error occurred",{description:"Please contact support immediately. Error code: ERR_500",duration:1/0,action:{label:"Contact Support",onClick:()=>console.log("Opening support...")}}),style:{backgroundColor:"#ef4444",color:"white"},children:"Show Critical Error"})},kt={render:()=>n.jsx(c,{onClick:()=>i.custom(a=>o.createElement("div",{className:"bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border",style:{borderColor:"#0ec2bc"}},o.createElement("div",{className:"flex items-start gap-3"},o.createElement($t,{className:"h-5 w-5 mt-0.5",style:{color:"#0ec2bc"}}),o.createElement("div",{className:"flex-1"},o.createElement("div",{className:"font-semibold",style:{color:"#0ec2bc"}},"Custom Toast"),o.createElement("div",{className:"text-sm text-gray-600 dark:text-gray-400 mt-1"},"This is a completely custom toast with JSX content and styling."),o.createElement("button",{onClick:()=>i.dismiss(a),className:"mt-2 px-3 py-1 text-sm rounded",style:{backgroundColor:"#0ec2bc",color:"white"}},"Dismiss")))),{duration:5e3}),style:{backgroundColor:"#0ec2bc",color:"white"},children:"Custom JSX Toast"})},Tt={render:()=>n.jsxs("div",{children:[n.jsxs("div",{className:"flex flex-wrap gap-3 mb-4",children:[n.jsx(c,{onClick:()=>i("First notification",{description:"This toast will expand on hover"}),children:"Show Toast 1"}),n.jsx(c,{onClick:()=>i("Second notification",{description:"Hover over the toast stack to see expansion"}),children:"Show Toast 2"}),n.jsx(c,{onClick:()=>i("Third notification",{description:"Multiple toasts stack and expand together"}),children:"Show Toast 3"})]}),n.jsx("p",{className:"text-sm text-muted-foreground max-w-md",children:"When multiple toasts are visible, hover over them to see them expand and show full content."}),n.jsx(q,{expand:!0})]})};var oe,se,ne,ae,re;lt.parameters={...lt.parameters,docs:{...(oe=lt.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  render: () => <Button onClick={() => toast('This is a default toast notification')}>
      Show Toast
    </Button>
}`,...(ne=(se=lt.parameters)==null?void 0:se.docs)==null?void 0:ne.source},description:{story:`Default toast notification.

The most basic toast with just a message. Auto-dismisses after 4 seconds.`,...(re=(ae=lt.parameters)==null?void 0:ae.docs)==null?void 0:re.description}}};var ie,le,ce,de,ue;ct.parameters={...ct.parameters,docs:{...(ie=ct.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-3">
      <Button onClick={() => toast.success('Profile updated successfully!')} style={{
      backgroundColor: '#10b981',
      color: 'white'
    }}>
        Success Toast
      </Button>
      <Button onClick={() => toast.error('Failed to save changes')} style={{
      backgroundColor: '#ef4444',
      color: 'white'
    }}>
        Error Toast
      </Button>
      <Button onClick={() => toast.warning('Your session will expire soon')} style={{
      backgroundColor: '#f59e0b',
      color: 'white'
    }}>
        Warning Toast
      </Button>
      <Button onClick={() => toast.info('New features are available')} style={{
      backgroundColor: '#3b82f6',
      color: 'white'
    }}>
        Info Toast
      </Button>
      <Button onClick={() => toast.loading('Processing your request...')} variant="outline">
        Loading Toast
      </Button>
    </div>
}`,...(ce=(le=ct.parameters)==null?void 0:le.docs)==null?void 0:ce.source},description:{story:`All toast types.

Demonstrates success, error, warning, info, and loading toast variants.`,...(ue=(de=ct.parameters)==null?void 0:de.docs)==null?void 0:ue.description}}};var me,pe,fe,he,ge;dt.parameters={...dt.parameters,docs:{...(me=dt.parameters)==null?void 0:me.docs,source:{originalSource:`{
  render: () => <Button onClick={() => toast('New message received', {
    description: 'You have a new message from Sarah Chen. Tap to read it now.'
  })}>
      Show Toast with Description
    </Button>
}`,...(fe=(pe=dt.parameters)==null?void 0:pe.docs)==null?void 0:fe.source},description:{story:`Toast with description.

Shows title and supporting description text.`,...(ge=(he=dt.parameters)==null?void 0:he.docs)==null?void 0:ge.description}}};var be,ve,ye,we,xe;ut.parameters={...ut.parameters,docs:{...(be=ut.parameters)==null?void 0:be.docs,source:{originalSource:`{
  render: () => <Button onClick={() => toast('Meeting starts in 5 minutes', {
    description: 'Daily standup with the engineering team',
    action: {
      label: 'Join Now',
      onClick: () => console.log('Joining meeting...')
    }
  })} style={{
    backgroundColor: '#0ec2bc',
    color: 'white'
  }}>
      Show Action Toast
    </Button>
}`,...(ye=(ve=ut.parameters)==null?void 0:ve.docs)==null?void 0:ye.source},description:{story:`Toast with action button.

Demonstrates interactive action button in toast.`,...(xe=(we=ut.parameters)==null?void 0:we.docs)==null?void 0:xe.description}}};var Ce,ke,Te,Se,Be;mt.parameters={...mt.parameters,docs:{...(Ce=mt.parameters)==null?void 0:Ce.docs,source:{originalSource:`{
  render: () => <Button onClick={() => toast('File deleted successfully', {
    description: 'document.pdf has been moved to trash',
    action: {
      label: 'Undo',
      onClick: () => console.log('Undo delete')
    },
    cancel: {
      label: 'Dismiss',
      onClick: () => console.log('Dismissed')
    }
  })} variant="outline">
      Delete with Undo
    </Button>
}`,...(Te=(ke=mt.parameters)==null?void 0:ke.docs)==null?void 0:Te.source},description:{story:`Toast with action and cancel buttons.

Shows both action and cancel buttons for undo functionality.`,...(Be=(Se=mt.parameters)==null?void 0:Se.docs)==null?void 0:Be.description}}};var Ee,Ne,je,De,Re;pt.parameters={...pt.parameters,docs:{...(Ee=pt.parameters)==null?void 0:Ee.docs,source:{originalSource:`{
  render: () => {
    const handlePromise = () => {
      const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          Math.random() > 0.5 ? resolve({
            name: 'User'
          }) : reject('Failed');
        }, 2000);
      });
      toast.promise(promise, {
        loading: 'Saving changes...',
        success: data => \`Changes saved successfully!\`,
        error: 'Failed to save changes. Please try again.'
      });
    };
    return <Button onClick={handlePromise} style={{
      backgroundColor: '#0ec2bc',
      color: 'white'
    }}>
        Save with Promise
      </Button>;
  }
}`,...(je=(Ne=pt.parameters)==null?void 0:Ne.docs)==null?void 0:je.source},description:{story:`Promise toast for async operations.

Automatically transitions from loading → success/error based on promise resolution.`,...(Re=(De=pt.parameters)==null?void 0:De.docs)==null?void 0:Re.description}}};var Ie,_e,Me,Pe,Ae;ft.parameters={...ft.parameters,docs:{...(Ie=ft.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-3">
      <Button onClick={() => toast('Quick toast (1s)', {
      duration: 1000
    })} variant="outline">
        1 Second
      </Button>
      <Button onClick={() => toast('Standard toast (4s)', {
      duration: 4000
    })} variant="outline">
        4 Seconds (Default)
      </Button>
      <Button onClick={() => toast('Long toast (10s)', {
      duration: 10000
    })} variant="outline">
        10 Seconds
      </Button>
      <Button onClick={() => toast('Persistent toast', {
      duration: Infinity
    })} variant="outline">
        Never Dismiss
      </Button>
    </div>
}`,...(Me=(_e=ft.parameters)==null?void 0:_e.docs)==null?void 0:Me.source},description:{story:`Custom duration toasts.

Demonstrates different auto-dismiss durations.`,...(Ae=(Pe=ft.parameters)==null?void 0:Pe.docs)==null?void 0:Ae.description}}};var Le,Oe,Fe,ze,He;ht.parameters={...ht.parameters,docs:{...(Le=ht.parameters)==null?void 0:Le.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-3">
      <Button onClick={() => toast('Achievement unlocked!', {
      icon: React.createElement(Sparkles, {
        className: 'h-4 w-4 text-yellow-500'
      })
    })} style={{
      backgroundColor: '#f59e0b',
      color: 'white'
    }}>
        Custom Icon
      </Button>
      <Button onClick={() => toast.success('Payment received', {
      icon: React.createElement(CheckCircle, {
        className: 'h-4 w-4'
      })
    })} variant="outline">
        Override Success Icon
      </Button>
      <Button onClick={() => toast('No icon toast', {
      icon: React.createElement('div', null)
    })} variant="outline">
        No Icon
      </Button>
    </div>
}`,...(Fe=(Oe=ht.parameters)==null?void 0:Oe.docs)==null?void 0:Fe.source},description:{story:`Toast with custom icons.

Override default icons with custom icon components.`,...(He=(ze=ht.parameters)==null?void 0:ze.docs)==null?void 0:He.description}}};var Ue,Ye,$e,We,Xe;gt.parameters={...gt.parameters,docs:{...(Ue=gt.parameters)==null?void 0:Ue.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-3">
      <Button onClick={() => toast('Top Left', {
      position: 'top-left'
    })} variant="outline">
        Top Left
      </Button>
      <Button onClick={() => toast('Top Center', {
      position: 'top-center'
    })} variant="outline">
        Top Center
      </Button>
      <Button onClick={() => toast('Top Right', {
      position: 'top-right'
    })} variant="outline">
        Top Right
      </Button>
      <Button onClick={() => toast('Bottom Left', {
      position: 'bottom-left'
    })} variant="outline">
        Bottom Left
      </Button>
      <Button onClick={() => toast('Bottom Center', {
      position: 'bottom-center'
    })} variant="outline">
        Bottom Center
      </Button>
      <Button onClick={() => toast('Bottom Right', {
      position: 'bottom-right'
    })} variant="outline">
        Bottom Right
      </Button>
    </div>
}`,...($e=(Ye=gt.parameters)==null?void 0:Ye.docs)==null?void 0:$e.source},description:{story:`Different positioning options.

Shows toasts at different screen positions.`,...(Xe=(We=gt.parameters)==null?void 0:We.docs)==null?void 0:Xe.description}}};var Ve,Je,qe,Ke,Ge;bt.parameters={...bt.parameters,docs:{...(Ve=bt.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
  render: () => <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <Button onClick={() => toast.success('Profile updated!')} style={{
        backgroundColor: '#10b981',
        color: 'white'
      }}>
          Success
        </Button>
        <Button onClick={() => toast.error('Connection failed')} style={{
        backgroundColor: '#ef4444',
        color: 'white'
      }}>
          Error
        </Button>
        <Button onClick={() => toast.warning('Low storage space')} style={{
        backgroundColor: '#f59e0b',
        color: 'white'
      }}>
          Warning
        </Button>
        <Button onClick={() => toast.info('Update available')} style={{
        backgroundColor: '#3b82f6',
        color: 'white'
      }}>
          Info
        </Button>
      </div>
      <Toaster richColors />
    </div>
}`,...(qe=(Je=bt.parameters)==null?void 0:Je.docs)==null?void 0:qe.source},description:{story:`Rich colors variant.

Enable rich colors for more vibrant toast styling.`,...(Ge=(Ke=bt.parameters)==null?void 0:Ke.docs)==null?void 0:Ge.description}}};var Qe,Ze,to,eo,oo;vt.parameters={...vt.parameters,docs:{...(Qe=vt.parameters)==null?void 0:Qe.docs,source:{originalSource:`{
  render: () => <div>
      <Button onClick={() => toast('This toast has a close button', {
      description: 'Click the X to dismiss manually'
    })}>
        Show Toast with Close Button
      </Button>
      <Toaster closeButton />
    </div>
}`,...(to=(Ze=vt.parameters)==null?void 0:Ze.docs)==null?void 0:to.source},description:{story:`Close button variant.

Show close button on all toasts.`,...(oo=(eo=vt.parameters)==null?void 0:eo.docs)==null?void 0:oo.description}}};var so,no,ao,ro,io;yt.parameters={...yt.parameters,docs:{...(so=yt.parameters)==null?void 0:so.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-3">
      <Button onClick={() => toast.success('Welcome to Ozean Licht!', {
      description: 'Your cosmic journey begins now',
      style: {
        border: '1px solid #0ec2bc'
      }
    })} style={{
      backgroundColor: '#0ec2bc',
      color: 'white'
    }}>
        Branded Success
      </Button>
      <Button onClick={() => toast('New feature unlocked', {
      description: 'Check out the updated dashboard',
      icon: React.createElement(Sparkles, {
        className: 'h-4 w-4',
        style: {
          color: '#0ec2bc'
        }
      }),
      action: {
        label: 'Explore',
        onClick: () => console.log('Exploring...')
      },
      style: {
        border: '1px solid #0ec2bc'
      }
    })} variant="outline" style={{
      borderColor: '#0ec2bc',
      color: '#0ec2bc'
    }}>
        Feature Toast
      </Button>
      <Button onClick={() => {
      const promise = new Promise(resolve => {
        setTimeout(() => resolve({
          success: true
        }), 2000);
      });
      toast.promise(promise, {
        loading: 'Processing your request...',
        success: 'Request completed successfully!',
        error: 'Failed to process request'
      });
    }} style={{
      backgroundColor: '#0ec2bc',
      color: 'white'
    }}>
        Async Operation
      </Button>
    </div>
}`,...(ao=(no=yt.parameters)==null?void 0:no.docs)==null?void 0:ao.source},description:{story:`Ozean Licht themed toasts.

Demonstrates toast notifications with Ozean Licht turquoise accent (#0ec2bc).`,...(io=(ro=yt.parameters)==null?void 0:ro.docs)==null?void 0:io.description}}};var lo,co,uo,mo,po;wt.parameters={...wt.parameters,docs:{...(lo=wt.parameters)==null?void 0:lo.docs,source:{originalSource:`{
  render: () => {
    const handleSubmit = async () => {
      const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          Math.random() > 0.3 ? resolve({
            id: 123
          }) : reject('Network error');
        }, 2000);
      });
      toast.promise(promise, {
        loading: 'Submitting form...',
        success: 'Form submitted successfully!',
        error: err => \`Submission failed: \${err}\`
      });
    };
    return <Button onClick={handleSubmit} style={{
      backgroundColor: '#0ec2bc',
      color: 'white'
    }}>
        Submit Form
      </Button>;
  }
}`,...(uo=(co=wt.parameters)==null?void 0:co.docs)==null?void 0:uo.source},description:{story:`Form submission example.

Common pattern for showing feedback after form submission.`,...(po=(mo=wt.parameters)==null?void 0:mo.docs)==null?void 0:po.description}}};var fo,ho,go,bo,vo;xt.parameters={...xt.parameters,docs:{...(fo=xt.parameters)==null?void 0:fo.docs,source:{originalSource:`{
  render: () => {
    let toastCount = 0;
    const showMultipleToasts = () => {
      toast.success('First action completed');
      setTimeout(() => {
        toast.info('Processing next step...', {
          description: 'This may take a few moments'
        });
      }, 500);
      setTimeout(() => {
        toast.success('All tasks completed!', {
          description: 'You can now proceed to the dashboard',
          action: {
            label: 'Go to Dashboard',
            onClick: () => console.log('Navigate to dashboard')
          }
        });
      }, 1500);
    };
    const showUndoToast = () => {
      toastCount++;
      const count = toastCount;
      toast(\`Item \${count} deleted\`, {
        description: 'The item has been moved to trash',
        action: {
          label: 'Undo',
          onClick: () => {
            toast.success(\`Item \${count} restored\`);
          }
        },
        cancel: {
          label: 'Dismiss',
          onClick: () => console.log('Dismissed')
        }
      });
    };
    const showLoadingToast = () => {
      const loadingId = toast.loading('Uploading file...');
      setTimeout(() => {
        toast.success('File uploaded successfully!', {
          id: loadingId
        });
      }, 3000);
    };
    return <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Button onClick={showMultipleToasts} style={{
          backgroundColor: '#0ec2bc',
          color: 'white'
        }}>
            Multiple Toasts
          </Button>
          <Button onClick={showUndoToast} variant="outline">
            Delete with Undo
          </Button>
          <Button onClick={showLoadingToast} variant="outline">
            Upload File
          </Button>
          <Button onClick={() => toast('Meeting reminder', {
          description: 'Team sync in 15 minutes',
          duration: 8000,
          action: {
            label: 'Join',
            onClick: () => toast.success('Joining meeting...')
          }
        })} variant="outline">
            Meeting Reminder
          </Button>
        </div>
        <p className="text-sm text-muted-foreground max-w-md">
          Click the buttons to see different toast patterns. The toasts will stack
          intelligently and can be dismissed by clicking the X or waiting for auto-dismiss.
        </p>
      </div>;
  }
}`,...(go=(ho=xt.parameters)==null?void 0:ho.docs)==null?void 0:go.source},description:{story:`Multiple toasts interaction.

Interactive demo showing multiple toasts with different types and actions.`,...(vo=(bo=xt.parameters)==null?void 0:bo.docs)==null?void 0:vo.description}}};var yo,wo,xo,Co,ko;Ct.parameters={...Ct.parameters,docs:{...(yo=Ct.parameters)==null?void 0:yo.docs,source:{originalSource:`{
  render: () => <Button onClick={() => toast.error('Critical error occurred', {
    description: 'Please contact support immediately. Error code: ERR_500',
    duration: Infinity,
    action: {
      label: 'Contact Support',
      onClick: () => console.log('Opening support...')
    }
  })} style={{
    backgroundColor: '#ef4444',
    color: 'white'
  }}>
      Show Critical Error
    </Button>
}`,...(xo=(wo=Ct.parameters)==null?void 0:wo.docs)==null?void 0:xo.source},description:{story:`Important toast that requires dismissal.

Demonstrates toasts that don't auto-dismiss and require user action.`,...(ko=(Co=Ct.parameters)==null?void 0:Co.docs)==null?void 0:ko.description}}};var To,So,Bo,Eo,No;kt.parameters={...kt.parameters,docs:{...(To=kt.parameters)==null?void 0:To.docs,source:{originalSource:`{
  render: () => <Button onClick={() => toast.custom(t => React.createElement('div', {
    className: 'bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border',
    style: {
      borderColor: '#0ec2bc'
    }
  }, React.createElement('div', {
    className: 'flex items-start gap-3'
  }, React.createElement(Sparkles, {
    className: 'h-5 w-5 mt-0.5',
    style: {
      color: '#0ec2bc'
    }
  }), React.createElement('div', {
    className: 'flex-1'
  }, React.createElement('div', {
    className: 'font-semibold',
    style: {
      color: '#0ec2bc'
    }
  }, 'Custom Toast'), React.createElement('div', {
    className: 'text-sm text-gray-600 dark:text-gray-400 mt-1'
  }, 'This is a completely custom toast with JSX content and styling.'), React.createElement('button', {
    onClick: () => toast.dismiss(t),
    className: 'mt-2 px-3 py-1 text-sm rounded',
    style: {
      backgroundColor: '#0ec2bc',
      color: 'white'
    }
  }, 'Dismiss')))), {
    duration: 5000
  })} style={{
    backgroundColor: '#0ec2bc',
    color: 'white'
  }}>
      Custom JSX Toast
    </Button>
}`,...(Bo=(So=kt.parameters)==null?void 0:So.docs)==null?void 0:Bo.source},description:{story:`Custom JSX content.

Shows how to render completely custom JSX in a toast.`,...(No=(Eo=kt.parameters)==null?void 0:Eo.docs)==null?void 0:No.description}}};var jo,Do,Ro,Io,_o;Tt.parameters={...Tt.parameters,docs:{...(jo=Tt.parameters)==null?void 0:jo.docs,source:{originalSource:`{
  render: () => <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <Button onClick={() => toast('First notification', {
        description: 'This toast will expand on hover'
      })}>
          Show Toast 1
        </Button>
        <Button onClick={() => toast('Second notification', {
        description: 'Hover over the toast stack to see expansion'
      })}>
          Show Toast 2
        </Button>
        <Button onClick={() => toast('Third notification', {
        description: 'Multiple toasts stack and expand together'
      })}>
          Show Toast 3
        </Button>
      </div>
      <p className="text-sm text-muted-foreground max-w-md">
        When multiple toasts are visible, hover over them to see them expand
        and show full content.
      </p>
      <Toaster expand />
    </div>
}`,...(Ro=(Do=Tt.parameters)==null?void 0:Do.docs)==null?void 0:Ro.source},description:{story:`Expand on hover.

Toasts expand to show full content when hovered.`,...(_o=(Io=Tt.parameters)==null?void 0:Io.docs)==null?void 0:_o.description}}};const qs=["Default","AllTypes","WithDescription","WithAction","WithActionAndCancel","PromiseToast","CustomDuration","WithCustomIcon","Positioning","RichColors","WithCloseButton","OzeanLichtThemed","FormSubmission","InteractiveDemo","ImportantToast","CustomContent","ExpandOnHover"];export{ct as AllTypes,kt as CustomContent,ft as CustomDuration,lt as Default,Tt as ExpandOnHover,wt as FormSubmission,Ct as ImportantToast,xt as InteractiveDemo,yt as OzeanLichtThemed,gt as Positioning,pt as PromiseToast,bt as RichColors,ut as WithAction,mt as WithActionAndCancel,vt as WithCloseButton,ht as WithCustomIcon,dt as WithDescription,qs as __namedExportsOrder,Js as default};
