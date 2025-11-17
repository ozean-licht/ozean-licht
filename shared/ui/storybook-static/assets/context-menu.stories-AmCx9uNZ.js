import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{w as te,u as ne,e as se}from"./index-CJu6nLMj.js";import{r as c,R as f}from"./index-B2-qRKKC.js";import{c as on,P as an,a as E}from"./index-D5ysUGwq.js";import{c as Ct,R as rn,A as cn,a as dn,S as un,G as ln,P as xn,C as mn,I as pn,b as hn,L as Cn,d as Mn,e as gn,f as jn,g as fn,h as wn,i as Sn}from"./index-B1beNcww.js";import{u as bn}from"./index-ciuW_uyV.js";import{u as Nn}from"./index-BlCrtW8-.js";import{c as b}from"./cn-CytzSlOG.js";import{C as In}from"./check-BFJmnSzs.js";import{C as yn}from"./circle-KqIYxgtT.js";import{C as vn}from"./chevron-right-CK3AtDi5.js";import{F as Mt}from"./file-text-CDZzEi0q.js";import{c as Q}from"./createLucideIcon-BbF4D6Jl.js";import{E as gt}from"./eye-B2FZkYMJ.js";import{C as v,a as jt,S as k}from"./share-2-CxCtZKBm.js";import{D as K}from"./download-Dhm86lFi.js";import{T as Y}from"./trash-2-D2tcQEV5.js";import{M as J}from"./mail-Cxl1hOu1.js";import{M as ft,a as wt,C as _n}from"./message-square-Cqhc6cF0.js";import{C as Rn,K as kn,a as St,L as bt}from"./log-out-CRwwUM2-.js";import{B as Nt}from"./book-open-DNYwrNLu.js";import{U as It}from"./user-DUNvpwAv.js";import{S as yt}from"./settings-DfwhJ3T1.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-kS-9iBlu.js";import"./index-BFjtS4uE.js";import"./index-BDyC_JNs.js";import"./index-D6fdIYSQ.js";import"./index-DwPv8f4P.js";import"./index-DEKUlYuO.js";import"./index-CpxwHbl5.js";import"./index-D1vk04JX.js";import"./index-FV1saqzH.js";import"./index-BYfY0yFj.js";import"./index-B3Lresjw.js";import"./index-PNzqWif7.js";import"./index-DGkrtcXD.js";/**
 * @license lucide-react v0.553.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tn=[["path",{d:"M12.659 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v9.34",key:"o6klzx"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10.378 12.622a1 1 0 0 1 3 3.003L8.36 20.637a2 2 0 0 1-.854.506l-2.867.837a.5.5 0 0 1-.62-.62l.836-2.869a2 2 0 0 1 .506-.853z",key:"zhnas1"}]],Z=Q("file-pen",Tn);/**
 * @license lucide-react v0.553.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pn=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]],vt=Q("image",Pn);/**
 * @license lucide-react v0.553.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const En=[["circle",{cx:"6",cy:"6",r:"3",key:"1lh9wr"}],["path",{d:"M8.12 8.12 12 12",key:"1alkpv"}],["path",{d:"M20 4 8.12 15.88",key:"xgtan2"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["path",{d:"M14.8 14.8 20 20",key:"ptml3r"}]],_t=Q("scissors",En);var ee="ContextMenu",[Ln]=on(ee,[Ct]),p=Ct(),[Dn,Rt]=Ln(ee),kt=t=>{const{__scopeContextMenu:n,children:o,onOpenChange:a,dir:r,modal:u=!0}=t,[M,g]=c.useState(!1),w=p(n),T=bn(a),j=c.useCallback(P=>{g(P),T(P)},[T]);return e.jsx(Dn,{scope:n,open:M,onOpenChange:j,modal:u,children:e.jsx(rn,{...w,dir:r,open:M,onOpenChange:j,modal:u,children:o})})};kt.displayName=ee;var Tt="ContextMenuTrigger",Pt=c.forwardRef((t,n)=>{const{__scopeContextMenu:o,disabled:a=!1,...r}=t,u=Rt(Tt,o),M=p(o),g=c.useRef({x:0,y:0}),w=c.useRef({getBoundingClientRect:()=>DOMRect.fromRect({width:0,height:0,...g.current})}),T=c.useRef(0),j=c.useCallback(()=>window.clearTimeout(T.current),[]),P=N=>{g.current={x:N.clientX,y:N.clientY},u.onOpenChange(!0)};return c.useEffect(()=>j,[j]),c.useEffect(()=>void(a&&j()),[a,j]),e.jsxs(e.Fragment,{children:[e.jsx(cn,{...M,virtualRef:w}),e.jsx(an.span,{"data-state":u.open?"open":"closed","data-disabled":a?"":void 0,...r,ref:n,style:{WebkitTouchCallout:"none",...t.style},onContextMenu:a?t.onContextMenu:E(t.onContextMenu,N=>{j(),P(N),N.preventDefault()}),onPointerDown:a?t.onPointerDown:E(t.onPointerDown,H(N=>{j(),T.current=window.setTimeout(()=>P(N),700)})),onPointerMove:a?t.onPointerMove:E(t.onPointerMove,H(j)),onPointerCancel:a?t.onPointerCancel:E(t.onPointerCancel,H(j)),onPointerUp:a?t.onPointerUp:E(t.onPointerUp,H(j))})]})});Pt.displayName=Tt;var On="ContextMenuPortal",Et=t=>{const{__scopeContextMenu:n,...o}=t,a=p(n);return e.jsx(xn,{...a,...o})};Et.displayName=On;var Lt="ContextMenuContent",Dt=c.forwardRef((t,n)=>{const{__scopeContextMenu:o,...a}=t,r=Rt(Lt,o),u=p(o),M=c.useRef(!1);return e.jsx(mn,{...u,...a,ref:n,side:"right",sideOffset:2,align:"start",onCloseAutoFocus:g=>{var w;(w=t.onCloseAutoFocus)==null||w.call(t,g),!g.defaultPrevented&&M.current&&g.preventDefault(),M.current=!1},onInteractOutside:g=>{var w;(w=t.onInteractOutside)==null||w.call(t,g),!g.defaultPrevented&&!r.modal&&(M.current=!0)},style:{...t.style,"--radix-context-menu-content-transform-origin":"var(--radix-popper-transform-origin)","--radix-context-menu-content-available-width":"var(--radix-popper-available-width)","--radix-context-menu-content-available-height":"var(--radix-popper-available-height)","--radix-context-menu-trigger-width":"var(--radix-popper-anchor-width)","--radix-context-menu-trigger-height":"var(--radix-popper-anchor-height)"}})});Dt.displayName=Lt;var Bn="ContextMenuGroup",Ot=c.forwardRef((t,n)=>{const{__scopeContextMenu:o,...a}=t,r=p(o);return e.jsx(ln,{...r,...a,ref:n})});Ot.displayName=Bn;var Vn="ContextMenuLabel",Bt=c.forwardRef((t,n)=>{const{__scopeContextMenu:o,...a}=t,r=p(o);return e.jsx(Cn,{...r,...a,ref:n})});Bt.displayName=Vn;var An="ContextMenuItem",Vt=c.forwardRef((t,n)=>{const{__scopeContextMenu:o,...a}=t,r=p(o);return e.jsx(pn,{...r,...a,ref:n})});Vt.displayName=An;var Gn="ContextMenuCheckboxItem",At=c.forwardRef((t,n)=>{const{__scopeContextMenu:o,...a}=t,r=p(o);return e.jsx(Mn,{...r,...a,ref:n})});At.displayName=Gn;var Fn="ContextMenuRadioGroup",Gt=c.forwardRef((t,n)=>{const{__scopeContextMenu:o,...a}=t,r=p(o);return e.jsx(dn,{...r,...a,ref:n})});Gt.displayName=Fn;var zn="ContextMenuRadioItem",Ft=c.forwardRef((t,n)=>{const{__scopeContextMenu:o,...a}=t,r=p(o);return e.jsx(jn,{...r,...a,ref:n})});Ft.displayName=zn;var Un="ContextMenuItemIndicator",zt=c.forwardRef((t,n)=>{const{__scopeContextMenu:o,...a}=t,r=p(o);return e.jsx(gn,{...r,...a,ref:n})});zt.displayName=Un;var qn="ContextMenuSeparator",Ut=c.forwardRef((t,n)=>{const{__scopeContextMenu:o,...a}=t,r=p(o);return e.jsx(hn,{...r,...a,ref:n})});Ut.displayName=qn;var Wn="ContextMenuArrow",$n=c.forwardRef((t,n)=>{const{__scopeContextMenu:o,...a}=t,r=p(o);return e.jsx(Sn,{...r,...a,ref:n})});$n.displayName=Wn;var qt="ContextMenuSub",Wt=t=>{const{__scopeContextMenu:n,children:o,onOpenChange:a,open:r,defaultOpen:u}=t,M=p(n),[g,w]=Nn({prop:r,defaultProp:u??!1,onChange:a,caller:qt});return e.jsx(un,{...M,open:g,onOpenChange:w,children:o})};Wt.displayName=qt;var Xn="ContextMenuSubTrigger",$t=c.forwardRef((t,n)=>{const{__scopeContextMenu:o,...a}=t,r=p(o);return e.jsx(fn,{...r,...a,ref:n})});$t.displayName=Xn;var Hn="ContextMenuSubContent",Xt=c.forwardRef((t,n)=>{const{__scopeContextMenu:o,...a}=t,r=p(o);return e.jsx(wn,{...r,...a,ref:n,style:{...t.style,"--radix-context-menu-content-transform-origin":"var(--radix-popper-transform-origin)","--radix-context-menu-content-available-width":"var(--radix-popper-available-width)","--radix-context-menu-content-available-height":"var(--radix-popper-available-height)","--radix-context-menu-trigger-width":"var(--radix-popper-anchor-width)","--radix-context-menu-trigger-height":"var(--radix-popper-anchor-height)"}})});Xt.displayName=Hn;function H(t){return n=>n.pointerType!=="mouse"?t(n):void 0}var Kn=kt,Zn=Pt,Ht=Et,Kt=Dt,Qn=Ot,Zt=Bt,Qt=Vt,Yt=At,Yn=Gt,Jt=Ft,en=zt,tn=Ut,Jn=Wt,nn=$t,sn=Xt;const x=Kn,C=Zn,X=Qn,oe=Ht,_=Jn,R=Yn,I=c.forwardRef(({className:t,inset:n,children:o,...a},r)=>e.jsxs(nn,{ref:r,className:b("flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",n&&"pl-8",t),...a,children:[o,e.jsx(vn,{className:"ml-auto h-4 w-4"})]}));I.displayName=nn.displayName;const y=c.forwardRef(({className:t,...n},o)=>e.jsx(sn,{ref:o,className:b("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-context-menu-content-transform-origin]",t),...n}));y.displayName=sn.displayName;const m=c.forwardRef(({className:t,...n},o)=>e.jsx(Ht,{children:e.jsx(Kt,{ref:o,className:b("z-50 max-h-[--radix-context-menu-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-context-menu-content-transform-origin]",t),...n})}));m.displayName=Kt.displayName;const s=c.forwardRef(({className:t,inset:n,...o},a)=>e.jsx(Qt,{ref:a,className:b("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",n&&"pl-8",t),...o}));s.displayName=Qt.displayName;const S=c.forwardRef(({className:t,children:n,checked:o,...a},r)=>e.jsxs(Yt,{ref:r,className:b("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",t),checked:o,...a,children:[e.jsx("span",{className:"absolute left-2 flex h-3.5 w-3.5 items-center justify-center",children:e.jsx(en,{children:e.jsx(In,{className:"h-4 w-4"})})}),n]}));S.displayName=Yt.displayName;const h=c.forwardRef(({className:t,children:n,...o},a)=>e.jsxs(Jt,{ref:a,className:b("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",t),...o,children:[e.jsx("span",{className:"absolute left-2 flex h-3.5 w-3.5 items-center justify-center",children:e.jsx(en,{children:e.jsx(yn,{className:"h-2 w-2 fill-current"})})}),n]}));h.displayName=Jt.displayName;const l=c.forwardRef(({className:t,inset:n,...o},a)=>e.jsx(Zt,{ref:a,className:b("px-2 py-1.5 text-sm font-semibold text-foreground",n&&"pl-8",t),...o}));l.displayName=Zt.displayName;const i=c.forwardRef(({className:t,...n},o)=>e.jsx(tn,{ref:o,className:b("-mx-1 my-1 h-px bg-border",t),...n}));i.displayName=tn.displayName;const d=({className:t,...n})=>e.jsx("span",{className:b("ml-auto text-xs tracking-widest text-muted-foreground",t),...n});d.displayName="ContextMenuShortcut";try{x.displayName="ContextMenu",x.__docgenInfo={description:"",displayName:"ContextMenu",props:{}}}catch{}try{C.displayName="ContextMenuTrigger",C.__docgenInfo={description:"",displayName:"ContextMenuTrigger",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{m.displayName="ContextMenuContent",m.__docgenInfo={description:"",displayName:"ContextMenuContent",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{s.displayName="ContextMenuItem",s.__docgenInfo={description:"",displayName:"ContextMenuItem",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}},inset:{defaultValue:null,description:"",name:"inset",required:!1,type:{name:"boolean"}}}}}catch{}try{S.displayName="ContextMenuCheckboxItem",S.__docgenInfo={description:"",displayName:"ContextMenuCheckboxItem",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{h.displayName="ContextMenuRadioItem",h.__docgenInfo={description:"",displayName:"ContextMenuRadioItem",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{l.displayName="ContextMenuLabel",l.__docgenInfo={description:"",displayName:"ContextMenuLabel",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}},inset:{defaultValue:null,description:"",name:"inset",required:!1,type:{name:"boolean"}}}}}catch{}try{i.displayName="ContextMenuSeparator",i.__docgenInfo={description:"",displayName:"ContextMenuSeparator",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{d.displayName="ContextMenuShortcut",d.__docgenInfo={description:"",displayName:"ContextMenuShortcut",props:{}}}catch{}try{X.displayName="ContextMenuGroup",X.__docgenInfo={description:"",displayName:"ContextMenuGroup",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{oe.displayName="ContextMenuPortal",oe.__docgenInfo={description:"",displayName:"ContextMenuPortal",props:{}}}catch{}try{_.displayName="ContextMenuSub",_.__docgenInfo={description:"",displayName:"ContextMenuSub",props:{}}}catch{}try{y.displayName="ContextMenuSubContent",y.__docgenInfo={description:"",displayName:"ContextMenuSubContent",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{I.displayName="ContextMenuSubTrigger",I.__docgenInfo={description:"",displayName:"ContextMenuSubTrigger",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}},inset:{defaultValue:null,description:"",name:"inset",required:!1,type:{name:"boolean"}}}}}catch{}try{R.displayName="ContextMenuRadioGroup",R.__docgenInfo={description:"",displayName:"ContextMenuRadioGroup",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}const Bs={title:"Tier 1: Primitives/shadcn/ContextMenu",component:x,parameters:{layout:"centered",docs:{description:{component:"Displays a menu to the user when right-clicking on an element — such as a set of actions or functions — triggered by right-click."}}},tags:["autodocs"]},L={render:()=>e.jsxs(x,{children:[e.jsx(C,{asChild:!0,children:e.jsx("div",{className:"flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm",children:"Right-click here"})}),e.jsxs(m,{children:[e.jsx(s,{children:"Back"}),e.jsx(s,{children:"Forward"}),e.jsx(s,{children:"Reload"}),e.jsx(i,{}),e.jsx(s,{children:"View Source"})]})]})},D={render:()=>e.jsxs(x,{children:[e.jsx(C,{asChild:!0,children:e.jsxs("div",{className:"flex h-[180px] w-[320px] items-center justify-center rounded-lg border bg-card text-card-foreground shadow-sm",children:[e.jsx(Mt,{className:"mr-2 h-6 w-6 text-muted-foreground"}),e.jsx("span",{children:"Document.pdf"})]})}),e.jsxs(m,{className:"w-56",children:[e.jsxs(s,{children:[e.jsx(Z,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Open"}),e.jsx(d,{children:"⌘O"})]}),e.jsxs(s,{children:[e.jsx(gt,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Preview"}),e.jsx(d,{children:"Space"})]}),e.jsx(i,{}),e.jsxs(s,{children:[e.jsx(v,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Copy"}),e.jsx(d,{children:"⌘C"})]}),e.jsxs(s,{children:[e.jsx(_t,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Cut"}),e.jsx(d,{children:"⌘X"})]}),e.jsxs(s,{children:[e.jsx(jt,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Paste"}),e.jsx(d,{children:"⌘V"})]}),e.jsx(i,{}),e.jsxs(s,{children:[e.jsx(k,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Share"})]}),e.jsxs(s,{children:[e.jsx(K,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Download"})]}),e.jsx(i,{}),e.jsxs(s,{className:"text-destructive focus:text-destructive",children:[e.jsx(Y,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Delete"}),e.jsx(d,{children:"⌘⌫"})]})]})]})},O={render:()=>{const[t,n]=f.useState(!1),[o,a]=f.useState(!0),[r,u]=f.useState(!1);return e.jsxs(x,{children:[e.jsx(C,{asChild:!0,children:e.jsx("div",{className:"flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm",children:"Right-click for view options"})}),e.jsxs(m,{className:"w-56",children:[e.jsx(l,{children:"View Options"}),e.jsx(i,{}),e.jsx(S,{checked:t,onCheckedChange:n,children:"Show Bookmarks Bar"}),e.jsx(S,{checked:o,onCheckedChange:a,children:"Show Full URLs"}),e.jsx(S,{checked:r,onCheckedChange:u,children:"Show Developer Tools"})]})]})}},B={render:()=>{const[t,n]=f.useState("grid");return e.jsxs(x,{children:[e.jsx(C,{asChild:!0,children:e.jsx("div",{className:"flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm",children:"Right-click to change view"})}),e.jsxs(m,{className:"w-56",children:[e.jsx(l,{children:"View Mode"}),e.jsx(i,{}),e.jsxs(R,{value:t,onValueChange:n,children:[e.jsx(h,{value:"grid",children:"Grid View"}),e.jsx(h,{value:"list",children:"List View"}),e.jsx(h,{value:"compact",children:"Compact View"})]})]})]})}},V={render:()=>e.jsxs(x,{children:[e.jsx(C,{asChild:!0,children:e.jsx("div",{className:"flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm",children:"Right-click for nested options"})}),e.jsxs(m,{className:"w-56",children:[e.jsxs(s,{children:[e.jsx(Z,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Open"})]}),e.jsxs(_,{children:[e.jsxs(I,{children:[e.jsx(k,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Share"})]}),e.jsxs(y,{children:[e.jsxs(s,{children:[e.jsx(J,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Email"})]}),e.jsxs(s,{children:[e.jsx(ft,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Message"})]}),e.jsx(i,{}),e.jsxs(s,{children:[e.jsx(v,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Copy Link"})]})]})]}),e.jsxs(_,{children:[e.jsxs(I,{children:[e.jsx(Rn,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"New"})]}),e.jsxs(y,{children:[e.jsxs(s,{children:[e.jsx(Mt,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Document"})]}),e.jsxs(s,{children:[e.jsx(vt,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Image"})]}),e.jsxs(s,{children:[e.jsx(Nt,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Folder"})]})]})]}),e.jsx(i,{}),e.jsxs(s,{children:[e.jsx(K,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Download"})]}),e.jsxs(s,{disabled:!0,children:[e.jsx(wt,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Upload to Cloud"})]})]})]})},A={render:()=>e.jsxs(x,{children:[e.jsx(C,{asChild:!0,children:e.jsx("div",{className:"flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm",children:"Right-click for grouped actions"})}),e.jsxs(m,{className:"w-56",children:[e.jsx(l,{children:"File Actions"}),e.jsx(i,{}),e.jsxs(X,{children:[e.jsxs(s,{children:[e.jsx(Z,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Edit"}),e.jsx(d,{children:"⌘E"})]}),e.jsxs(s,{children:[e.jsx(v,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Duplicate"}),e.jsx(d,{children:"⌘D"})]})]}),e.jsx(i,{}),e.jsxs(X,{children:[e.jsxs(s,{children:[e.jsx(k,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Share"})]}),e.jsxs(s,{children:[e.jsx(K,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Download"})]})]}),e.jsx(i,{}),e.jsxs(s,{className:"text-destructive focus:text-destructive",children:[e.jsx(Y,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Delete"}),e.jsx(d,{children:"⌘⌫"})]})]})]})},G={render:()=>{const[t,n]=f.useState(!1),[o,a]=f.useState(!1),[r,u]=f.useState("medium");return e.jsxs(x,{children:[e.jsx(C,{asChild:!0,children:e.jsx("div",{className:"h-[200px] w-[400px] rounded-md border bg-card p-4",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"Right-click this text to see editor options. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."})})}),e.jsxs(m,{className:"w-56",children:[e.jsx(l,{children:"Text Formatting"}),e.jsx(i,{}),e.jsxs(S,{checked:t,onCheckedChange:n,children:["Bold",e.jsx(d,{children:"⌘B"})]}),e.jsxs(S,{checked:o,onCheckedChange:a,children:["Italic",e.jsx(d,{children:"⌘I"})]}),e.jsx(i,{}),e.jsx(l,{children:"Font Size"}),e.jsxs(R,{value:r,onValueChange:u,children:[e.jsx(h,{value:"small",children:"Small"}),e.jsx(h,{value:"medium",children:"Medium"}),e.jsx(h,{value:"large",children:"Large"})]}),e.jsx(i,{}),e.jsxs(s,{children:[e.jsx(v,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Copy"}),e.jsx(d,{children:"⌘C"})]}),e.jsxs(s,{children:[e.jsx(_t,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Cut"}),e.jsx(d,{children:"⌘X"})]}),e.jsxs(s,{children:[e.jsx(jt,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Paste"}),e.jsx(d,{children:"⌘V"})]})]})]})}},F={render:()=>e.jsxs(x,{children:[e.jsx(C,{asChild:!0,children:e.jsx("div",{className:"flex h-[180px] w-[320px] items-center justify-center rounded-lg border-2 border-[#0ec2bc] bg-gradient-to-br from-[#0ec2bc]/10 to-transparent text-sm font-medium",children:"Right-click for Ozean Licht menu"})}),e.jsxs(m,{className:"w-56",children:[e.jsx(l,{className:"text-[#0ec2bc]",children:"Ozean Licht"}),e.jsx(i,{}),e.jsxs(s,{children:[e.jsx(It,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Profile"})]}),e.jsxs(s,{children:[e.jsx(Nt,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"My Courses"})]}),e.jsxs(s,{children:[e.jsx(J,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Messages"})]}),e.jsx(i,{}),e.jsxs(s,{children:[e.jsx(yt,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Settings"})]}),e.jsxs(s,{children:[e.jsx(kn,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Keyboard Shortcuts"})]}),e.jsx(i,{}),e.jsxs(s,{children:[e.jsx(St,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Help & Support"})]}),e.jsxs(s,{className:"text-destructive focus:text-destructive",children:[e.jsx(bt,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Sign Out"})]})]})]})},z={render:()=>e.jsxs(x,{children:[e.jsx(C,{asChild:!0,children:e.jsx("div",{className:"flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm",children:"Right-click to see disabled items"})}),e.jsxs(m,{className:"w-56",children:[e.jsx(l,{children:"Actions"}),e.jsx(i,{}),e.jsxs(s,{children:[e.jsx(Z,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Edit"})]}),e.jsxs(s,{children:[e.jsx(v,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Duplicate"})]}),e.jsxs(s,{disabled:!0,children:[e.jsx(k,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Share (Coming soon)"})]}),e.jsx(i,{}),e.jsxs(s,{disabled:!0,children:[e.jsx(Y,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Delete (No permission)"})]})]})]})},U={render:()=>{const[t,n]=f.useState(!0),[o,a]=f.useState("fit");return e.jsxs(x,{children:[e.jsx(C,{asChild:!0,children:e.jsx("div",{className:"flex h-[200px] w-[350px] items-center justify-center rounded-lg border bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900",children:e.jsx(vt,{className:"h-16 w-16 text-muted-foreground"})})}),e.jsxs(m,{className:"w-56",children:[e.jsx(l,{children:"Image Options"}),e.jsx(i,{}),e.jsxs(s,{children:[e.jsx(gt,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"View Full Size"}),e.jsx(d,{children:"Space"})]}),e.jsx(i,{}),e.jsx(l,{children:"Zoom"}),e.jsxs(R,{value:o,onValueChange:a,children:[e.jsx(h,{value:"fit",children:"Fit to Window"}),e.jsx(h,{value:"actual",children:"Actual Size"}),e.jsx(h,{value:"fill",children:"Fill Window"})]}),e.jsx(i,{}),e.jsx(S,{checked:t,onCheckedChange:n,children:"Show Metadata"}),e.jsx(i,{}),e.jsxs(s,{children:[e.jsx(K,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Download"}),e.jsx(d,{children:"⌘S"})]}),e.jsxs(s,{children:[e.jsx(k,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Share"})]}),e.jsxs(s,{children:[e.jsx(v,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Copy Image"}),e.jsx(d,{children:"⌘C"})]})]})]})}},q={render:()=>e.jsxs(x,{children:[e.jsx(C,{asChild:!0,children:e.jsx("div",{className:"flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm",children:"Right-click for inset menu"})}),e.jsxs(m,{className:"w-56",children:[e.jsxs(s,{children:["Open",e.jsx(d,{children:"⌘O"})]}),e.jsxs(s,{children:["Save",e.jsx(d,{children:"⌘S"})]}),e.jsx(s,{disabled:!0,children:"Save As..."}),e.jsx(i,{}),e.jsxs(_,{children:[e.jsx(I,{inset:!0,children:"Export"}),e.jsxs(y,{children:[e.jsx(s,{children:"PDF"}),e.jsx(s,{children:"PNG"}),e.jsx(s,{children:"SVG"})]})]}),e.jsx(i,{}),e.jsxs(s,{inset:!0,children:["Print",e.jsx(d,{children:"⌘P"})]})]})]})},W={render:()=>e.jsxs(x,{children:[e.jsx(C,{asChild:!0,children:e.jsx("div",{className:"flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm","data-testid":"context-trigger",children:"Right-click to test"})}),e.jsxs(m,{"data-testid":"context-content",children:[e.jsx(l,{children:"Test Menu"}),e.jsx(i,{}),e.jsx(s,{"data-testid":"edit-item",children:"Edit"}),e.jsx(s,{"data-testid":"copy-item",children:"Copy"}),e.jsx(i,{}),e.jsx(s,{"data-testid":"delete-item",children:"Delete"})]})]}),play:async({canvasElement:t})=>{const n=te(t),o=te(document.body),a=n.getByTestId("context-trigger");await ne.pointer([{keys:"[MouseRight>]",target:a},{keys:"[/MouseRight]"}]),await new Promise(M=>setTimeout(M,200));const r=o.getByTestId("context-content");await se(r).toBeInTheDocument();const u=o.getByTestId("edit-item");await se(u).toBeInTheDocument(),await ne.click(u),await new Promise(M=>setTimeout(M,300))}},$={render:()=>{const[t,n]=f.useState(!0),[o,a]=f.useState(!1),[r,u]=f.useState("light");return e.jsxs(x,{children:[e.jsx(C,{asChild:!0,children:e.jsxs("div",{className:"flex h-[220px] w-[400px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-[#0ec2bc] bg-gradient-to-br from-[#0ec2bc]/10 via-transparent to-[#0ec2bc]/5 p-6 text-center",children:[e.jsx(yt,{className:"h-8 w-8 text-[#0ec2bc]"}),e.jsx("p",{className:"text-sm font-medium",children:"Right-click for full menu"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Demonstrates all context menu features"})]})}),e.jsxs(m,{className:"w-56",children:[e.jsx(l,{className:"text-[#0ec2bc]",children:"Complete Menu"}),e.jsx(i,{}),e.jsxs(X,{children:[e.jsxs(s,{children:[e.jsx(It,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Profile"}),e.jsx(d,{children:"⇧⌘P"})]}),e.jsxs(s,{children:[e.jsx(_n,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Billing"}),e.jsx(d,{children:"⌘B"})]})]}),e.jsx(i,{}),e.jsx(l,{children:"Preferences"}),e.jsx(S,{checked:t,onCheckedChange:n,children:"Enable notifications"}),e.jsx(S,{checked:o,onCheckedChange:a,children:"Auto-save"}),e.jsx(i,{}),e.jsx(l,{children:"Theme"}),e.jsxs(R,{value:r,onValueChange:u,children:[e.jsx(h,{value:"light",children:"Light"}),e.jsx(h,{value:"dark",children:"Dark"}),e.jsx(h,{value:"system",children:"System"})]}),e.jsx(i,{}),e.jsxs(_,{children:[e.jsxs(I,{children:[e.jsx(k,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Share"})]}),e.jsxs(y,{children:[e.jsxs(s,{children:[e.jsx(J,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Email"})]}),e.jsxs(s,{children:[e.jsx(ft,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Message"})]}),e.jsx(i,{}),e.jsxs(s,{children:[e.jsx(v,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Copy Link"})]})]})]}),e.jsx(i,{}),e.jsxs(s,{children:[e.jsx(St,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Support"})]}),e.jsxs(s,{disabled:!0,children:[e.jsx(wt,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"API (Coming soon)"})]}),e.jsx(i,{}),e.jsxs(s,{className:"text-destructive focus:text-destructive",children:[e.jsx(bt,{className:"mr-2 h-4 w-4"}),e.jsx("span",{children:"Sign Out"}),e.jsx(d,{children:"⇧⌘Q"})]})]})]})}};var ae,re,ie,ce,de;L.parameters={...L.parameters,docs:{...(ae=L.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  render: () => <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
          Right-click here
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Back</ContextMenuItem>
        <ContextMenuItem>Forward</ContextMenuItem>
        <ContextMenuItem>Reload</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>View Source</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
}`,...(ie=(re=L.parameters)==null?void 0:re.docs)==null?void 0:ie.source},description:{story:"Default context menu with basic items",...(de=(ce=L.parameters)==null?void 0:ce.docs)==null?void 0:de.description}}};var ue,le,xe,me,pe;D.parameters={...D.parameters,docs:{...(ue=D.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  render: () => <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="flex h-[180px] w-[320px] items-center justify-center rounded-lg border bg-card text-card-foreground shadow-sm">
          <FileText className="mr-2 h-6 w-6 text-muted-foreground" />
          <span>Document.pdf</span>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem>
          <FileEdit className="mr-2 h-4 w-4" />
          <span>Open</span>
          <ContextMenuShortcut>⌘O</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <Eye className="mr-2 h-4 w-4" />
          <span>Preview</span>
          <ContextMenuShortcut>Space</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <Copy className="mr-2 h-4 w-4" />
          <span>Copy</span>
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <Scissors className="mr-2 h-4 w-4" />
          <span>Cut</span>
          <ContextMenuShortcut>⌘X</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <ClipboardPaste className="mr-2 h-4 w-4" />
          <span>Paste</span>
          <ContextMenuShortcut>⌘V</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <Share2 className="mr-2 h-4 w-4" />
          <span>Share</span>
        </ContextMenuItem>
        <ContextMenuItem>
          <Download className="mr-2 h-4 w-4" />
          <span>Download</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
          <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
}`,...(xe=(le=D.parameters)==null?void 0:le.docs)==null?void 0:xe.source},description:{story:"File explorer context menu with icons and shortcuts",...(pe=(me=D.parameters)==null?void 0:me.docs)==null?void 0:pe.description}}};var he,Ce,Me,ge,je;O.parameters={...O.parameters,docs:{...(he=O.parameters)==null?void 0:he.docs,source:{originalSource:`{
  render: () => {
    const [showBookmarks, setShowBookmarks] = React.useState(false);
    const [showFullUrls, setShowFullUrls] = React.useState(true);
    const [showDevTools, setShowDevTools] = React.useState(false);
    return <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
            Right-click for view options
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuLabel>View Options</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem checked={showBookmarks} onCheckedChange={setShowBookmarks}>
            Show Bookmarks Bar
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked={showFullUrls} onCheckedChange={setShowFullUrls}>
            Show Full URLs
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked={showDevTools} onCheckedChange={setShowDevTools}>
            Show Developer Tools
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>;
  }
}`,...(Me=(Ce=O.parameters)==null?void 0:Ce.docs)==null?void 0:Me.source},description:{story:"Menu with checkbox items for toggleable settings",...(je=(ge=O.parameters)==null?void 0:ge.docs)==null?void 0:je.description}}};var fe,we,Se,be,Ne;B.parameters={...B.parameters,docs:{...(fe=B.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  render: () => {
    const [view, setView] = React.useState('grid');
    return <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
            Right-click to change view
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuLabel>View Mode</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuRadioGroup value={view} onValueChange={setView}>
            <ContextMenuRadioItem value="grid">Grid View</ContextMenuRadioItem>
            <ContextMenuRadioItem value="list">List View</ContextMenuRadioItem>
            <ContextMenuRadioItem value="compact">Compact View</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>;
  }
}`,...(Se=(we=B.parameters)==null?void 0:we.docs)==null?void 0:Se.source},description:{story:"Menu with radio group for single selection",...(Ne=(be=B.parameters)==null?void 0:be.docs)==null?void 0:Ne.description}}};var Ie,ye,ve,_e,Re;V.parameters={...V.parameters,docs:{...(Ie=V.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  render: () => <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
          Right-click for nested options
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem>
          <FileEdit className="mr-2 h-4 w-4" />
          <span>Open</span>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Share2 className="mr-2 h-4 w-4" />
            <span>Share</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              <span>Email</span>
            </ContextMenuItem>
            <ContextMenuItem>
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Message</span>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>
              <Copy className="mr-2 h-4 w-4" />
              <span>Copy Link</span>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>New</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              <span>Document</span>
            </ContextMenuItem>
            <ContextMenuItem>
              <ImageIcon className="mr-2 h-4 w-4" />
              <span>Image</span>
            </ContextMenuItem>
            <ContextMenuItem>
              <BookOpen className="mr-2 h-4 w-4" />
              <span>Folder</span>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <Download className="mr-2 h-4 w-4" />
          <span>Download</span>
        </ContextMenuItem>
        <ContextMenuItem disabled>
          <Cloud className="mr-2 h-4 w-4" />
          <span>Upload to Cloud</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
}`,...(ve=(ye=V.parameters)==null?void 0:ye.docs)==null?void 0:ve.source},description:{story:"Menu with sub-menus (nested menus)",...(Re=(_e=V.parameters)==null?void 0:_e.docs)==null?void 0:Re.description}}};var ke,Te,Pe,Ee,Le;A.parameters={...A.parameters,docs:{...(ke=A.parameters)==null?void 0:ke.docs,source:{originalSource:`{
  render: () => <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
          Right-click for grouped actions
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuLabel>File Actions</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem>
            <FileEdit className="mr-2 h-4 w-4" />
            <span>Edit</span>
            <ContextMenuShortcut>⌘E</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <Copy className="mr-2 h-4 w-4" />
            <span>Duplicate</span>
            <ContextMenuShortcut>⌘D</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem>
            <Share2 className="mr-2 h-4 w-4" />
            <span>Share</span>
          </ContextMenuItem>
          <ContextMenuItem>
            <Download className="mr-2 h-4 w-4" />
            <span>Download</span>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
          <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
}`,...(Pe=(Te=A.parameters)==null?void 0:Te.docs)==null?void 0:Pe.source},description:{story:"Menu with grouped items",...(Le=(Ee=A.parameters)==null?void 0:Ee.docs)==null?void 0:Le.description}}};var De,Oe,Be,Ve,Ae;G.parameters={...G.parameters,docs:{...(De=G.parameters)==null?void 0:De.docs,source:{originalSource:`{
  render: () => {
    const [isBold, setIsBold] = React.useState(false);
    const [isItalic, setIsItalic] = React.useState(false);
    const [fontSize, setFontSize] = React.useState('medium');
    return <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="h-[200px] w-[400px] rounded-md border bg-card p-4">
            <p className="text-sm text-muted-foreground">
              Right-click this text to see editor options. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuLabel>Text Formatting</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem checked={isBold} onCheckedChange={setIsBold}>
            Bold
            <ContextMenuShortcut>⌘B</ContextMenuShortcut>
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked={isItalic} onCheckedChange={setIsItalic}>
            Italic
            <ContextMenuShortcut>⌘I</ContextMenuShortcut>
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuLabel>Font Size</ContextMenuLabel>
          <ContextMenuRadioGroup value={fontSize} onValueChange={setFontSize}>
            <ContextMenuRadioItem value="small">Small</ContextMenuRadioItem>
            <ContextMenuRadioItem value="medium">Medium</ContextMenuRadioItem>
            <ContextMenuRadioItem value="large">Large</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy</span>
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <Scissors className="mr-2 h-4 w-4" />
            <span>Cut</span>
            <ContextMenuShortcut>⌘X</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <ClipboardPaste className="mr-2 h-4 w-4" />
            <span>Paste</span>
            <ContextMenuShortcut>⌘V</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>;
  }
}`,...(Be=(Oe=G.parameters)==null?void 0:Oe.docs)==null?void 0:Be.source},description:{story:"Text editor context menu",...(Ae=(Ve=G.parameters)==null?void 0:Ve.docs)==null?void 0:Ae.description}}};var Ge,Fe,ze,Ue,qe;F.parameters={...F.parameters,docs:{...(Ge=F.parameters)==null?void 0:Ge.docs,source:{originalSource:`{
  render: () => <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="flex h-[180px] w-[320px] items-center justify-center rounded-lg border-2 border-[#0ec2bc] bg-gradient-to-br from-[#0ec2bc]/10 to-transparent text-sm font-medium">
          Right-click for Ozean Licht menu
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuLabel className="text-[#0ec2bc]">Ozean Licht</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </ContextMenuItem>
        <ContextMenuItem>
          <BookOpen className="mr-2 h-4 w-4" />
          <span>My Courses</span>
        </ContextMenuItem>
        <ContextMenuItem>
          <Mail className="mr-2 h-4 w-4" />
          <span>Messages</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </ContextMenuItem>
        <ContextMenuItem>
          <Keyboard className="mr-2 h-4 w-4" />
          <span>Keyboard Shortcuts</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <LifeBuoy className="mr-2 h-4 w-4" />
          <span>Help & Support</span>
        </ContextMenuItem>
        <ContextMenuItem className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
}`,...(ze=(Fe=F.parameters)==null?void 0:Fe.docs)==null?void 0:ze.source},description:{story:"Ozean Licht branded context menu",...(qe=(Ue=F.parameters)==null?void 0:Ue.docs)==null?void 0:qe.description}}};var We,$e,Xe,He,Ke;z.parameters={...z.parameters,docs:{...(We=z.parameters)==null?void 0:We.docs,source:{originalSource:`{
  render: () => <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
          Right-click to see disabled items
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuLabel>Actions</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <FileEdit className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </ContextMenuItem>
        <ContextMenuItem>
          <Copy className="mr-2 h-4 w-4" />
          <span>Duplicate</span>
        </ContextMenuItem>
        <ContextMenuItem disabled>
          <Share2 className="mr-2 h-4 w-4" />
          <span>Share (Coming soon)</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem disabled>
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete (No permission)</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
}`,...(Xe=($e=z.parameters)==null?void 0:$e.docs)==null?void 0:Xe.source},description:{story:"Menu with disabled items",...(Ke=(He=z.parameters)==null?void 0:He.docs)==null?void 0:Ke.description}}};var Ze,Qe,Ye,Je,et;U.parameters={...U.parameters,docs:{...(Ze=U.parameters)==null?void 0:Ze.docs,source:{originalSource:`{
  render: () => {
    const [showMetadata, setShowMetadata] = React.useState(true);
    const [zoom, setZoom] = React.useState('fit');
    return <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="flex h-[200px] w-[350px] items-center justify-center rounded-lg border bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
            <ImageIcon className="h-16 w-16 text-muted-foreground" />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuLabel>Image Options</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <Eye className="mr-2 h-4 w-4" />
            <span>View Full Size</span>
            <ContextMenuShortcut>Space</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuLabel>Zoom</ContextMenuLabel>
          <ContextMenuRadioGroup value={zoom} onValueChange={setZoom}>
            <ContextMenuRadioItem value="fit">Fit to Window</ContextMenuRadioItem>
            <ContextMenuRadioItem value="actual">Actual Size</ContextMenuRadioItem>
            <ContextMenuRadioItem value="fill">Fill Window</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem checked={showMetadata} onCheckedChange={setShowMetadata}>
            Show Metadata
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <Download className="mr-2 h-4 w-4" />
            <span>Download</span>
            <ContextMenuShortcut>⌘S</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <Share2 className="mr-2 h-4 w-4" />
            <span>Share</span>
          </ContextMenuItem>
          <ContextMenuItem>
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy Image</span>
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>;
  }
}`,...(Ye=(Qe=U.parameters)==null?void 0:Qe.docs)==null?void 0:Ye.source},description:{story:"Image viewer context menu",...(et=(Je=U.parameters)==null?void 0:Je.docs)==null?void 0:et.description}}};var tt,nt,st,ot,at;q.parameters={...q.parameters,docs:{...(tt=q.parameters)==null?void 0:tt.docs,source:{originalSource:`{
  render: () => <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
          Right-click for inset menu
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem>
          Open
          <ContextMenuShortcut>⌘O</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Save
          <ContextMenuShortcut>⌘S</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem disabled>Save As...</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Export</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>PDF</ContextMenuItem>
            <ContextMenuItem>PNG</ContextMenuItem>
            <ContextMenuItem>SVG</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem inset>
          Print
          <ContextMenuShortcut>⌘P</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
}`,...(st=(nt=q.parameters)==null?void 0:nt.docs)==null?void 0:st.source},description:{story:"Inset items (indented for visual hierarchy)",...(at=(ot=q.parameters)==null?void 0:ot.docs)==null?void 0:at.description}}};var rt,it,ct,dt,ut;W.parameters={...W.parameters,docs:{...(rt=W.parameters)==null?void 0:rt.docs,source:{originalSource:`{
  render: () => <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm" data-testid="context-trigger">
          Right-click to test
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent data-testid="context-content">
        <ContextMenuLabel>Test Menu</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem data-testid="edit-item">Edit</ContextMenuItem>
        <ContextMenuItem data-testid="copy-item">Copy</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem data-testid="delete-item">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    // Right-click trigger to open context menu
    const trigger = canvas.getByTestId('context-trigger');
    await userEvent.pointer([{
      keys: '[MouseRight>]',
      target: trigger
    }, {
      keys: '[/MouseRight]'
    }]);

    // Wait for menu to open
    await new Promise(resolve => setTimeout(resolve, 200));

    // Menu should be visible
    const menuContent = body.getByTestId('context-content');
    await expect(menuContent).toBeInTheDocument();

    // Items should be accessible
    const editItem = body.getByTestId('edit-item');
    await expect(editItem).toBeInTheDocument();

    // Click edit item
    await userEvent.click(editItem);

    // Wait for menu to close
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}`,...(ct=(it=W.parameters)==null?void 0:it.docs)==null?void 0:ct.source},description:{story:`Interactive test with play function
Tests context menu interactions and keyboard navigation`,...(ut=(dt=W.parameters)==null?void 0:dt.docs)==null?void 0:ut.description}}};var lt,xt,mt,pt,ht;$.parameters={...$.parameters,docs:{...(lt=$.parameters)==null?void 0:lt.docs,source:{originalSource:`{
  render: () => {
    const [notifications, setNotifications] = React.useState(true);
    const [autoSave, setAutoSave] = React.useState(false);
    const [theme, setTheme] = React.useState('light');
    return <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="flex h-[220px] w-[400px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-[#0ec2bc] bg-gradient-to-br from-[#0ec2bc]/10 via-transparent to-[#0ec2bc]/5 p-6 text-center">
            <Settings className="h-8 w-8 text-[#0ec2bc]" />
            <p className="text-sm font-medium">Right-click for full menu</p>
            <p className="text-xs text-muted-foreground">
              Demonstrates all context menu features
            </p>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuLabel className="text-[#0ec2bc]">Complete Menu</ContextMenuLabel>
          <ContextMenuSeparator />

          {/* Regular items with icons and shortcuts */}
          <ContextMenuGroup>
            <ContextMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <ContextMenuShortcut>⇧⌘P</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <ContextMenuShortcut>⌘B</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>

          <ContextMenuSeparator />

          {/* Checkbox items */}
          <ContextMenuLabel>Preferences</ContextMenuLabel>
          <ContextMenuCheckboxItem checked={notifications} onCheckedChange={setNotifications}>
            Enable notifications
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked={autoSave} onCheckedChange={setAutoSave}>
            Auto-save
          </ContextMenuCheckboxItem>

          <ContextMenuSeparator />

          {/* Radio group */}
          <ContextMenuLabel>Theme</ContextMenuLabel>
          <ContextMenuRadioGroup value={theme} onValueChange={setTheme}>
            <ContextMenuRadioItem value="light">Light</ContextMenuRadioItem>
            <ContextMenuRadioItem value="dark">Dark</ContextMenuRadioItem>
            <ContextMenuRadioItem value="system">System</ContextMenuRadioItem>
          </ContextMenuRadioGroup>

          <ContextMenuSeparator />

          {/* Sub-menu */}
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <Share2 className="mr-2 h-4 w-4" />
              <span>Share</span>
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                <span>Email</span>
              </ContextMenuItem>
              <ContextMenuItem>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Message</span>
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                <span>Copy Link</span>
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>

          <ContextMenuSeparator />

          {/* Support and logout */}
          <ContextMenuItem>
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Support</span>
          </ContextMenuItem>
          <ContextMenuItem disabled>
            <Cloud className="mr-2 h-4 w-4" />
            <span>API (Coming soon)</span>
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
            <ContextMenuShortcut>⇧⌘Q</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>;
  }
}`,...(mt=(xt=$.parameters)==null?void 0:xt.docs)==null?void 0:mt.source},description:{story:"Complete example combining all features",...(ht=(pt=$.parameters)==null?void 0:pt.docs)==null?void 0:ht.description}}};const Vs=["Default","FileExplorer","WithCheckboxItems","WithRadioGroup","WithSubMenus","WithGroups","TextEditor","OzeanLichtBranded","WithDisabledItems","ImageViewer","WithInsetItems","InteractiveTest","CompleteExample"];export{$ as CompleteExample,L as Default,D as FileExplorer,U as ImageViewer,W as InteractiveTest,F as OzeanLichtBranded,G as TextEditor,O as WithCheckboxItems,z as WithDisabledItems,A as WithGroups,q as WithInsetItems,B as WithRadioGroup,V as WithSubMenus,Vs as __namedExportsOrder,Bs as default};
