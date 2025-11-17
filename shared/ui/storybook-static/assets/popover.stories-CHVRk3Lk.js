import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{w as q,u as j,e as Q}from"./index-CJu6nLMj.js";import{r as p}from"./index-B2-qRKKC.js";import{c as Lt,P as Pt,a as L,d as Mt}from"./index-D4_CVXg7.js";import{u as jt}from"./index-BFjtS4uE.js";import{D as zt}from"./index-Cs6PchLL.js";import{h as Wt,R as Ht,u as Vt,F as $t}from"./index-ntJH2KtH.js";import{u as Ut}from"./index-CpxwHbl5.js";import{c as Ct,R as qt,A as wt,C as Qt,a as Gt}from"./index-DWyTAKiW.js";import{P as Jt}from"./index-BHKRsyNi.js";import{P as bt}from"./index-PNzqWif7.js";import{u as Kt}from"./index-BlCrtW8-.js";import{c as Yt}from"./cn-CytzSlOG.js";import{B as s}from"./Button-Clfx5zjS.js";import{L as h}from"./label-Cp9r14oL.js";import{I as v}from"./input-Db9iZ-Hs.js";import{S as yt}from"./settings-DfwhJ3T1.js";import{U as $}from"./user-DUNvpwAv.js";import{M as Zt}from"./mail-Cxl1hOu1.js";import{c as Xt}from"./createLucideIcon-BbF4D6Jl.js";import{C as es}from"./calendar-XdJTf2nA.js";import{C as Tt}from"./circle-question-mark-zmzNVHl7.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-kS-9iBlu.js";import"./index-ciuW_uyV.js";import"./index-D1vk04JX.js";import"./index-BYfY0yFj.js";import"./index-DVF2XGCm.js";import"./button-C8qtCU0L.js";import"./index-BiMR7eR1.js";import"./index-B5oyz0SX.js";/**
 * @license lucide-react v0.553.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ts=[["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]],ss=Xt("phone",ts);var H="Popover",[Bt]=Lt(H,[Ct]),M=Ct(),[os,f]=Bt(H),St=t=>{const{__scopePopover:r,children:o,open:d,defaultOpen:n,onOpenChange:a,modal:m=!1}=t,u=M(r),x=p.useRef(null),[g,z]=p.useState(!1),[W,N]=Kt({prop:d,defaultProp:n??!1,onChange:a,caller:H});return e.jsx(qt,{...u,children:e.jsx(os,{scope:r,contentId:Ut(),triggerRef:x,open:W,onOpenChange:N,onOpenToggle:p.useCallback(()=>N(V=>!V),[N]),hasCustomAnchor:g,onCustomAnchorAdd:p.useCallback(()=>z(!0),[]),onCustomAnchorRemove:p.useCallback(()=>z(!1),[]),modal:m,children:o})})};St.displayName=H;var At="PopoverAnchor",ns=p.forwardRef((t,r)=>{const{__scopePopover:o,...d}=t,n=f(At,o),a=M(o),{onCustomAnchorAdd:m,onCustomAnchorRemove:u}=n;return p.useEffect(()=>(m(),()=>u()),[m,u]),e.jsx(wt,{...a,...d,ref:r})});ns.displayName=At;var Ot="PopoverTrigger",kt=p.forwardRef((t,r)=>{const{__scopePopover:o,...d}=t,n=f(Ot,o),a=M(o),m=jt(r,n.triggerRef),u=e.jsx(Pt.button,{type:"button","aria-haspopup":"dialog","aria-expanded":n.open,"aria-controls":n.contentId,"data-state":Et(n.open),...d,ref:m,onClick:L(t.onClick,n.onOpenToggle)});return n.hasCustomAnchor?u:e.jsx(wt,{asChild:!0,...a,children:u})});kt.displayName=Ot;var U="PopoverPortal",[rs,as]=Bt(U,{forceMount:void 0}),Ft=t=>{const{__scopePopover:r,forceMount:o,children:d,container:n}=t,a=f(U,r);return e.jsx(rs,{scope:r,forceMount:o,children:e.jsx(bt,{present:o||a.open,children:e.jsx(Jt,{asChild:!0,container:n,children:d})})})};Ft.displayName=U;var P="PopoverContent",_t=p.forwardRef((t,r)=>{const o=as(P,t.__scopePopover),{forceMount:d=o.forceMount,...n}=t,a=f(P,t.__scopePopover);return e.jsx(bt,{present:d||a.open,children:a.modal?e.jsx(ls,{...n,ref:r}):e.jsx(cs,{...n,ref:r})})});_t.displayName=P;var is=Mt("PopoverContent.RemoveScroll"),ls=p.forwardRef((t,r)=>{const o=f(P,t.__scopePopover),d=p.useRef(null),n=jt(r,d),a=p.useRef(!1);return p.useEffect(()=>{const m=d.current;if(m)return Wt(m)},[]),e.jsx(Ht,{as:is,allowPinchZoom:!0,children:e.jsx(Dt,{...t,ref:n,trapFocus:o.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:L(t.onCloseAutoFocus,m=>{var u;m.preventDefault(),a.current||(u=o.triggerRef.current)==null||u.focus()}),onPointerDownOutside:L(t.onPointerDownOutside,m=>{const u=m.detail.originalEvent,x=u.button===0&&u.ctrlKey===!0,g=u.button===2||x;a.current=g},{checkForDefaultPrevented:!1}),onFocusOutside:L(t.onFocusOutside,m=>m.preventDefault(),{checkForDefaultPrevented:!1})})})}),cs=p.forwardRef((t,r)=>{const o=f(P,t.__scopePopover),d=p.useRef(!1),n=p.useRef(!1);return e.jsx(Dt,{...t,ref:r,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:a=>{var m,u;(m=t.onCloseAutoFocus)==null||m.call(t,a),a.defaultPrevented||(d.current||(u=o.triggerRef.current)==null||u.focus(),a.preventDefault()),d.current=!1,n.current=!1},onInteractOutside:a=>{var x,g;(x=t.onInteractOutside)==null||x.call(t,a),a.defaultPrevented||(d.current=!0,a.detail.originalEvent.type==="pointerdown"&&(n.current=!0));const m=a.target;((g=o.triggerRef.current)==null?void 0:g.contains(m))&&a.preventDefault(),a.detail.originalEvent.type==="focusin"&&n.current&&a.preventDefault()}})}),Dt=p.forwardRef((t,r)=>{const{__scopePopover:o,trapFocus:d,onOpenAutoFocus:n,onCloseAutoFocus:a,disableOutsidePointerEvents:m,onEscapeKeyDown:u,onPointerDownOutside:x,onFocusOutside:g,onInteractOutside:z,...W}=t,N=f(P,o),V=M(o);return Vt(),e.jsx($t,{asChild:!0,loop:!0,trapped:d,onMountAutoFocus:n,onUnmountAutoFocus:a,children:e.jsx(zt,{asChild:!0,disableOutsidePointerEvents:m,onInteractOutside:z,onEscapeKeyDown:u,onPointerDownOutside:x,onFocusOutside:g,onDismiss:()=>N.onOpenChange(!1),children:e.jsx(Qt,{"data-state":Et(N.open),role:"dialog",id:N.contentId,...V,...W,ref:r,style:{...W.style,"--radix-popover-content-transform-origin":"var(--radix-popper-transform-origin)","--radix-popover-content-available-width":"var(--radix-popper-available-width)","--radix-popover-content-available-height":"var(--radix-popper-available-height)","--radix-popover-trigger-width":"var(--radix-popper-anchor-width)","--radix-popover-trigger-height":"var(--radix-popper-anchor-height)"}})})})}),Rt="PopoverClose",ds=p.forwardRef((t,r)=>{const{__scopePopover:o,...d}=t,n=f(Rt,o);return e.jsx(Pt.button,{type:"button",...d,ref:r,onClick:L(t.onClick,()=>n.onOpenChange(!1))})});ds.displayName=Rt;var ps="PopoverArrow",ms=p.forwardRef((t,r)=>{const{__scopePopover:o,...d}=t,n=M(o);return e.jsx(Gt,{...n,...d,ref:r})});ms.displayName=ps;function Et(t){return t?"open":"closed"}var us=St,hs=kt,vs=Ft,It=_t;const i=us,c=hs,l=p.forwardRef(({className:t,align:r="center",sideOffset:o=4,...d},n)=>e.jsx(vs,{children:e.jsx(It,{ref:n,align:r,sideOffset:o,className:Yt("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-popover-content-transform-origin]",t),...d})}));l.displayName=It.displayName;try{i.displayName="Popover",i.__docgenInfo={description:"",displayName:"Popover",props:{}}}catch{}try{c.displayName="PopoverTrigger",c.__docgenInfo={description:"",displayName:"PopoverTrigger",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{l.displayName="PopoverContent",l.__docgenInfo={description:"",displayName:"PopoverContent",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}const Qs={title:"Tier 1: Primitives/shadcn/Popover",component:i,parameters:{layout:"centered",docs:{description:{component:"A lightweight overlay that displays rich content triggered by a button. Built on Radix UI Popover primitive. Perfect for contextual information, forms, and interactive panels that don't require modal behavior."}}},tags:["autodocs"]},C={render:()=>e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsx(s,{variant:"outline",children:"Open Popover"})}),e.jsx(l,{children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-medium text-sm",children:"About Popovers"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Popovers are perfect for displaying rich, interactive content without blocking the page."})]})})]})},w={render:()=>e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsxs(s,{variant:"outline",children:[e.jsx(yt,{className:"mr-2 h-4 w-4"}),"Settings"]})}),e.jsx(l,{className:"w-80",children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-medium text-sm leading-none",children:"Dimensions"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Set the dimensions for the layer."})]}),e.jsxs("div",{className:"grid gap-2",children:[e.jsxs("div",{className:"grid grid-cols-3 items-center gap-4",children:[e.jsx(h,{htmlFor:"width",children:"Width"}),e.jsx(v,{id:"width",defaultValue:"100%",className:"col-span-2 h-8"})]}),e.jsxs("div",{className:"grid grid-cols-3 items-center gap-4",children:[e.jsx(h,{htmlFor:"maxWidth",children:"Max. width"}),e.jsx(v,{id:"maxWidth",defaultValue:"300px",className:"col-span-2 h-8"})]}),e.jsxs("div",{className:"grid grid-cols-3 items-center gap-4",children:[e.jsx(h,{htmlFor:"height",children:"Height"}),e.jsx(v,{id:"height",defaultValue:"25px",className:"col-span-2 h-8"})]}),e.jsxs("div",{className:"grid grid-cols-3 items-center gap-4",children:[e.jsx(h,{htmlFor:"maxHeight",children:"Max. height"}),e.jsx(v,{id:"maxHeight",defaultValue:"none",className:"col-span-2 h-8"})]})]})]})})]})},b={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-4 items-center justify-center p-8",children:[e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsx(s,{variant:"outline",children:"Top"})}),e.jsx(l,{side:"top",children:e.jsx("p",{className:"text-sm",children:"Popover positioned on top"})})]}),e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsx(s,{variant:"outline",children:"Right"})}),e.jsx(l,{side:"right",children:e.jsx("p",{className:"text-sm",children:"Popover positioned on right"})})]}),e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsx(s,{variant:"outline",children:"Bottom (Default)"})}),e.jsx(l,{side:"bottom",children:e.jsx("p",{className:"text-sm",children:"Popover positioned on bottom"})})]}),e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsx(s,{variant:"outline",children:"Left"})}),e.jsx(l,{side:"left",children:e.jsx("p",{className:"text-sm",children:"Popover positioned on left"})})]})]})},y={render:()=>e.jsxs("div",{className:"flex flex-col gap-8 items-center justify-center p-8",children:[e.jsxs("div",{className:"space-y-2 text-center",children:[e.jsx("p",{className:"text-sm text-muted-foreground",children:"Side: bottom"}),e.jsxs("div",{className:"flex gap-4",children:[e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsx(s,{variant:"outline",children:"Align Start"})}),e.jsx(l,{align:"start",className:"w-60",children:e.jsx("p",{className:"text-sm",children:"Aligned to the start (left edge)"})})]}),e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsx(s,{variant:"outline",children:"Align Center"})}),e.jsx(l,{align:"center",className:"w-60",children:e.jsx("p",{className:"text-sm",children:"Aligned to center (default)"})})]}),e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsx(s,{variant:"outline",children:"Align End"})}),e.jsx(l,{align:"end",className:"w-60",children:e.jsx("p",{className:"text-sm",children:"Aligned to the end (right edge)"})})]})]})]}),e.jsxs("div",{className:"space-y-2 text-center",children:[e.jsx("p",{className:"text-sm text-muted-foreground",children:"Side: right"}),e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsx(s,{variant:"outline",children:"Align Start (Top)"})}),e.jsx(l,{side:"right",align:"start",className:"w-60",children:e.jsx("p",{className:"text-sm",children:"Aligned to start (top edge)"})})]}),e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsx(s,{variant:"outline",children:"Align Center"})}),e.jsx(l,{side:"right",align:"center",className:"w-60",children:e.jsx("p",{className:"text-sm",children:"Aligned to center"})})]}),e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsx(s,{variant:"outline",children:"Align End (Bottom)"})}),e.jsx(l,{side:"right",align:"end",className:"w-60",children:e.jsx("p",{className:"text-sm",children:"Aligned to end (bottom edge)"})})]})]})]})]})},T={render:()=>e.jsxs("div",{className:"flex gap-4",children:[e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsx(s,{variant:"outline",children:"Default Offset (4px)"})}),e.jsx(l,{sideOffset:4,children:e.jsx("p",{className:"text-sm",children:"Default offset: 4px"})})]}),e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsx(s,{variant:"outline",children:"Large Offset (20px)"})}),e.jsx(l,{sideOffset:20,children:e.jsx("p",{className:"text-sm",children:"Large offset: 20px from trigger"})})]}),e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsx(s,{variant:"outline",children:"No Offset (0px)"})}),e.jsx(l,{sideOffset:0,children:e.jsx("p",{className:"text-sm",children:"No offset: Directly touching trigger"})})]})]})},B={render:()=>{const t=()=>{const[r,o]=p.useState(!1);return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsx(s,{onClick:()=>o(!0),children:"Open Popover"}),e.jsx(s,{variant:"outline",onClick:()=>o(!1),children:"Close Popover (External)"})]}),e.jsxs("p",{className:"text-sm text-muted-foreground",children:["Popover is currently: ",r?"Open":"Closed"]}),e.jsxs(i,{open:r,onOpenChange:o,children:[e.jsx(c,{asChild:!0,children:e.jsx(s,{variant:"outline",children:"Toggle Trigger"})}),e.jsx(l,{children:e.jsxs("div",{className:"space-y-3",children:[e.jsx("h4",{className:"font-medium text-sm",children:"Controlled Popover"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"This popover's state is controlled by external state. You can open/close it programmatically."}),e.jsx(s,{size:"sm",onClick:()=>o(!1),children:"Close from Inside"})]})})]})]})};return e.jsx(t,{})}},S={render:()=>e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsxs(s,{variant:"outline",children:[e.jsx($,{className:"mr-2 h-4 w-4"}),"View Profile"]})}),e.jsx(l,{className:"w-80",children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-start gap-4",children:[e.jsx("div",{className:"h-12 w-12 rounded-full bg-gradient-to-br from-[#0ec2bc] to-[#0ec2bc]/60 flex items-center justify-center",children:e.jsx($,{className:"h-6 w-6 text-white"})}),e.jsxs("div",{className:"space-y-1 flex-1",children:[e.jsx("h4",{className:"font-semibold text-sm",children:"Maria Schmidt"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Product Designer"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex items-center gap-2 text-sm",children:[e.jsx(Zt,{className:"h-4 w-4 text-muted-foreground"}),e.jsx("span",{className:"text-muted-foreground",children:"maria.schmidt@example.com"})]}),e.jsxs("div",{className:"flex items-center gap-2 text-sm",children:[e.jsx(ss,{className:"h-4 w-4 text-muted-foreground"}),e.jsx("span",{className:"text-muted-foreground",children:"+43 123 456 789"})]})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(s,{size:"sm",className:"flex-1",children:"Message"}),e.jsx(s,{size:"sm",variant:"outline",className:"flex-1",children:"Follow"})]})]})})]})},A={render:()=>e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsxs(s,{variant:"outline",children:[e.jsx(es,{className:"mr-2 h-4 w-4"}),"Pick a date"]})}),e.jsx(l,{className:"w-auto p-0",children:e.jsxs("div",{className:"p-4 space-y-3",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(h,{htmlFor:"date-input",children:"Select Date"}),e.jsx(v,{id:"date-input",type:"date",className:"w-full"})]}),e.jsxs("div",{className:"flex justify-end gap-2",children:[e.jsx(s,{size:"sm",variant:"outline",children:"Cancel"}),e.jsx(s,{size:"sm",children:"Confirm"})]})]})})]})},O={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(h,{children:"Password Requirements"}),e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsx("button",{className:"text-muted-foreground hover:text-foreground transition-colors",children:e.jsx(Tt,{className:"h-4 w-4"})})}),e.jsx(l,{side:"right",align:"start",className:"w-72",children:e.jsxs("div",{className:"space-y-3",children:[e.jsx("h4",{className:"font-medium text-sm",children:"Password Requirements"}),e.jsxs("ul",{className:"space-y-1 text-sm text-muted-foreground",children:[e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"text-[#0ec2bc] mt-0.5",children:"✓"}),e.jsx("span",{children:"At least 8 characters long"})]}),e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"text-[#0ec2bc] mt-0.5",children:"✓"}),e.jsx("span",{children:"Contains at least one uppercase letter"})]}),e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"text-[#0ec2bc] mt-0.5",children:"✓"}),e.jsx("span",{children:"Contains at least one number"})]}),e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"text-[#0ec2bc] mt-0.5",children:"✓"}),e.jsx("span",{children:"Contains at least one special character"})]})]})]})})]})]}),e.jsx(v,{type:"password",placeholder:"Enter password"})]})},k={render:()=>{const t=()=>{const[r,o]=p.useState(!0),[d,n]=p.useState(!1);return e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsxs(s,{variant:"outline",children:[e.jsx(yt,{className:"mr-2 h-4 w-4"}),"Preferences"]})}),e.jsx(l,{className:"w-80",children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-medium text-sm leading-none",children:"Settings"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Configure your preferences"})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(h,{htmlFor:"notifications",className:"text-sm",children:"Enable notifications"}),e.jsx("button",{id:"notifications",onClick:()=>o(!r),className:`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${r?"bg-[#0ec2bc]":"bg-muted"}`,children:e.jsx("span",{className:`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${r?"translate-x-6":"translate-x-1"}`})})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(h,{htmlFor:"autosave",className:"text-sm",children:"Auto-save changes"}),e.jsx("button",{id:"autosave",onClick:()=>n(!d),className:`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${d?"bg-[#0ec2bc]":"bg-muted"}`,children:e.jsx("span",{className:`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${d?"translate-x-6":"translate-x-1"}`})})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(h,{htmlFor:"theme",className:"text-sm",children:"Theme"}),e.jsxs("select",{id:"theme",className:"w-full rounded-md border border-input bg-background px-3 py-2 text-sm",children:[e.jsx("option",{children:"Light"}),e.jsx("option",{children:"Dark"}),e.jsx("option",{children:"System"})]})]})]}),e.jsx("div",{className:"flex justify-end pt-2",children:e.jsx(s,{size:"sm",children:"Save Changes"})})]})})]})};return e.jsx(t,{})}},F={render:()=>e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsxs(s,{variant:"cta",style:{backgroundColor:"#0ec2bc",color:"white"},children:[e.jsx(Tt,{className:"mr-2 h-4 w-4"}),"Learn More"]})}),e.jsx(l,{className:"w-80",style:{borderColor:"#0ec2bc"},children:e.jsxs("div",{className:"space-y-3",children:[e.jsx("h4",{className:"font-semibold text-sm",style:{color:"#0ec2bc"},children:"Ozean Licht Platform"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"A content platform and educational ecosystem serving two Austrian associations with cosmic-inspired design and advanced content management."}),e.jsxs("div",{className:"pt-2 space-y-2",children:[e.jsxs("div",{className:"flex items-center gap-2 text-sm",children:[e.jsx("span",{className:"text-[#0ec2bc]",children:"✓"}),e.jsx("span",{children:"Multi-tenant architecture"})]}),e.jsxs("div",{className:"flex items-center gap-2 text-sm",children:[e.jsx("span",{className:"text-[#0ec2bc]",children:"✓"}),e.jsx("span",{children:"Advanced content streaming"})]}),e.jsxs("div",{className:"flex items-center gap-2 text-sm",children:[e.jsx("span",{className:"text-[#0ec2bc]",children:"✓"}),e.jsx("span",{children:"Real-time collaboration"})]})]}),e.jsx(s,{size:"sm",className:"w-full",style:{backgroundColor:"#0ec2bc",color:"white"},children:"Get Started"})]})})]})},_={render:()=>e.jsxs("div",{className:"flex gap-4",children:[e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsx(s,{variant:"outline",children:"Narrow"})}),e.jsx(l,{className:"w-48",children:e.jsx("p",{className:"text-sm",children:"Narrow popover (w-48)"})})]}),e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsx(s,{variant:"outline",children:"Default"})}),e.jsx(l,{children:e.jsx("p",{className:"text-sm",children:"Default width popover (w-72)"})})]}),e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsx(s,{variant:"outline",children:"Wide"})}),e.jsx(l,{className:"w-96",children:e.jsx("p",{className:"text-sm",children:"Wide popover (w-96) with more space for content"})})]}),e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsx(s,{variant:"outline",children:"Auto"})}),e.jsx(l,{className:"w-auto",children:e.jsx("p",{className:"text-sm whitespace-nowrap",children:"Auto width"})})]})]})},D={render:()=>e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsx(s,{variant:"outline",children:"Quick Actions"})}),e.jsx(l,{className:"w-56 p-2",children:e.jsxs("div",{className:"space-y-1",children:[e.jsx("button",{className:"w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",children:"Edit"}),e.jsx("button",{className:"w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",children:"Duplicate"}),e.jsx("button",{className:"w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",children:"Archive"}),e.jsx("div",{className:"h-px bg-border my-1"}),e.jsx("button",{className:"w-full text-left px-3 py-2 text-sm rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors",children:"Delete"})]})})]})},R={render:()=>e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsx(s,{variant:"outline","data-testid":"popover-trigger",children:"Open Popover"})}),e.jsx(l,{"data-testid":"popover-content",children:e.jsxs("div",{className:"space-y-3",children:[e.jsx("h4",{className:"font-medium text-sm",children:"Test Popover"}),e.jsx(v,{"data-testid":"popover-input",placeholder:"Type here..."}),e.jsx(s,{size:"sm","data-testid":"popover-button",children:"Submit"})]})})]}),play:async({canvasElement:t})=>{const r=q(t),o=q(document.body),d=r.getByTestId("popover-trigger");await j.click(d),await new Promise(u=>setTimeout(u,200));const n=o.getByTestId("popover-content");await Q(n).toBeInTheDocument();const a=o.getByTestId("popover-input");await j.click(a),await j.type(a,"Test input");const m=o.getByTestId("popover-button");await j.click(m),await Q(n).toBeInTheDocument(),await j.click(t),await new Promise(u=>setTimeout(u,300))}},E={render:()=>e.jsxs("div",{className:"flex gap-4",children:[e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsx(s,{variant:"outline",children:"Popover 1"})}),e.jsx(l,{children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-medium text-sm",children:"First Popover"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"This is the first independent popover."})]})})]}),e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsx(s,{variant:"outline",children:"Popover 2"})}),e.jsx(l,{children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-medium text-sm",children:"Second Popover"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"This is the second independent popover."})]})})]}),e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsx(s,{variant:"outline",children:"Popover 3"})}),e.jsx(l,{children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-medium text-sm",children:"Third Popover"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"This is the third independent popover. Opening one doesn't close the others."})]})})]})]})},I={render:()=>{const t=()=>{const[r,o]=p.useState(""),[d,n]=p.useState("");return e.jsxs(i,{children:[e.jsx(c,{asChild:!0,children:e.jsxs(s,{children:[e.jsx($,{className:"mr-2 h-4 w-4"}),"Create Account"]})}),e.jsx(l,{className:"w-96",children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-semibold text-base",children:"Create New Account"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Fill in the information below to create your account."})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(h,{htmlFor:"name",children:"Full Name"}),e.jsx(v,{id:"name",placeholder:"John Doe",value:d,onChange:a=>n(a.target.value)})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(h,{htmlFor:"email",children:"Email"}),e.jsx(v,{id:"email",type:"email",placeholder:"john.doe@example.com",value:r,onChange:a=>o(a.target.value)})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(h,{htmlFor:"password",children:"Password"}),e.jsx(v,{id:"password",type:"password",placeholder:"••••••••"})]}),e.jsxs("div",{className:"flex items-center gap-2 text-sm",children:[e.jsx("input",{type:"checkbox",id:"terms",className:"rounded"}),e.jsx(h,{htmlFor:"terms",className:"font-normal",children:"I agree to the terms and conditions"})]})]}),e.jsxs("div",{className:"flex gap-2 pt-2",children:[e.jsx(s,{size:"sm",variant:"outline",className:"flex-1",children:"Cancel"}),e.jsx(s,{size:"sm",className:"flex-1",style:{backgroundColor:"#0ec2bc",color:"white"},children:"Create Account"})]})]})})]})};return e.jsx(t,{})}};var G,J,K,Y,Z;C.parameters={...C.parameters,docs:{...(G=C.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">About Popovers</h4>
          <p className="text-sm text-muted-foreground">
            Popovers are perfect for displaying rich, interactive content without blocking the page.
          </p>
        </div>
      </PopoverContent>
    </Popover>
}`,...(K=(J=C.parameters)==null?void 0:J.docs)==null?void 0:K.source},description:{story:`Default popover with basic content.

The most basic popover implementation showing essential structure.`,...(Z=(Y=C.parameters)==null?void 0:Y.docs)==null?void 0:Z.description}}};var X,ee,te,se,oe;w.parameters={...w.parameters,docs:{...(X=w.parameters)==null?void 0:X.docs,source:{originalSource:`{
  render: () => <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm leading-none">Dimensions</h4>
            <p className="text-sm text-muted-foreground">
              Set the dimensions for the layer.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Width</Label>
              <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Max. width</Label>
              <Input id="maxWidth" defaultValue="300px" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Height</Label>
              <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxHeight">Max. height</Label>
              <Input id="maxHeight" defaultValue="none" className="col-span-2 h-8" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
}`,...(te=(ee=w.parameters)==null?void 0:ee.docs)==null?void 0:te.source},description:{story:`Popover with form content.

Common pattern for inline forms and settings that don't require a full dialog.`,...(oe=(se=w.parameters)==null?void 0:se.docs)==null?void 0:oe.description}}};var ne,re,ae,ie,le;b.parameters={...b.parameters,docs:{...(ne=b.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-4 items-center justify-center p-8">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Top</Button>
        </PopoverTrigger>
        <PopoverContent side="top">
          <p className="text-sm">Popover positioned on top</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Right</Button>
        </PopoverTrigger>
        <PopoverContent side="right">
          <p className="text-sm">Popover positioned on right</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Bottom (Default)</Button>
        </PopoverTrigger>
        <PopoverContent side="bottom">
          <p className="text-sm">Popover positioned on bottom</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Left</Button>
        </PopoverTrigger>
        <PopoverContent side="left">
          <p className="text-sm">Popover positioned on left</p>
        </PopoverContent>
      </Popover>
    </div>
}`,...(ae=(re=b.parameters)==null?void 0:re.docs)==null?void 0:ae.source},description:{story:`Popover positioned on different sides.

Demonstrates the side prop for controlling where the popover appears relative to the trigger.`,...(le=(ie=b.parameters)==null?void 0:ie.docs)==null?void 0:le.description}}};var ce,de,pe,me,ue;y.parameters={...y.parameters,docs:{...(ce=y.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-8 items-center justify-center p-8">
      <div className="space-y-2 text-center">
        <p className="text-sm text-muted-foreground">Side: bottom</p>
        <div className="flex gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Align Start</Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-60">
              <p className="text-sm">Aligned to the start (left edge)</p>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Align Center</Button>
            </PopoverTrigger>
            <PopoverContent align="center" className="w-60">
              <p className="text-sm">Aligned to center (default)</p>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Align End</Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-60">
              <p className="text-sm">Aligned to the end (right edge)</p>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2 text-center">
        <p className="text-sm text-muted-foreground">Side: right</p>
        <div className="flex flex-col gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Align Start (Top)</Button>
            </PopoverTrigger>
            <PopoverContent side="right" align="start" className="w-60">
              <p className="text-sm">Aligned to start (top edge)</p>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Align Center</Button>
            </PopoverTrigger>
            <PopoverContent side="right" align="center" className="w-60">
              <p className="text-sm">Aligned to center</p>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Align End (Bottom)</Button>
            </PopoverTrigger>
            <PopoverContent side="right" align="end" className="w-60">
              <p className="text-sm">Aligned to end (bottom edge)</p>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
}`,...(pe=(de=y.parameters)==null?void 0:de.docs)==null?void 0:pe.source},description:{story:`Popover with different alignments.

Shows how to align the popover relative to the trigger using the align prop.`,...(ue=(me=y.parameters)==null?void 0:me.docs)==null?void 0:ue.description}}};var he,ve,xe,ge,fe;T.parameters={...T.parameters,docs:{...(he=T.parameters)==null?void 0:he.docs,source:{originalSource:`{
  render: () => <div className="flex gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Default Offset (4px)</Button>
        </PopoverTrigger>
        <PopoverContent sideOffset={4}>
          <p className="text-sm">Default offset: 4px</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Large Offset (20px)</Button>
        </PopoverTrigger>
        <PopoverContent sideOffset={20}>
          <p className="text-sm">Large offset: 20px from trigger</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">No Offset (0px)</Button>
        </PopoverTrigger>
        <PopoverContent sideOffset={0}>
          <p className="text-sm">No offset: Directly touching trigger</p>
        </PopoverContent>
      </Popover>
    </div>
}`,...(xe=(ve=T.parameters)==null?void 0:ve.docs)==null?void 0:xe.source},description:{story:`Popover with custom offset.

Demonstrates sideOffset prop to control distance from trigger.`,...(fe=(ge=T.parameters)==null?void 0:ge.docs)==null?void 0:fe.description}}};var Ne,Pe,je,Ce,we;B.parameters={...B.parameters,docs:{...(Ne=B.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
  render: () => {
    const ControlledPopover = () => {
      const [open, setOpen] = useState(false);
      return <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => setOpen(true)}>Open Popover</Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close Popover (External)
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Popover is currently: {open ? 'Open' : 'Closed'}
          </p>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline">Toggle Trigger</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Controlled Popover</h4>
                <p className="text-sm text-muted-foreground">
                  This popover's state is controlled by external state.
                  You can open/close it programmatically.
                </p>
                <Button size="sm" onClick={() => setOpen(false)}>
                  Close from Inside
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>;
    };
    return <ControlledPopover />;
  }
}`,...(je=(Pe=B.parameters)==null?void 0:Pe.docs)==null?void 0:je.source},description:{story:`Controlled popover state.

Shows how to control popover open state programmatically using open and onOpenChange props.`,...(we=(Ce=B.parameters)==null?void 0:Ce.docs)==null?void 0:we.description}}};var be,ye,Te,Be,Se;S.parameters={...S.parameters,docs:{...(be=S.parameters)==null?void 0:be.docs,source:{originalSource:`{
  render: () => <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <User className="mr-2 h-4 w-4" />
          View Profile
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#0ec2bc] to-[#0ec2bc]/60 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="font-semibold text-sm">Maria Schmidt</h4>
              <p className="text-xs text-muted-foreground">Product Designer</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">maria.schmidt@example.com</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">+43 123 456 789</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="flex-1">Message</Button>
            <Button size="sm" variant="outline" className="flex-1">Follow</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
}`,...(Te=(ye=S.parameters)==null?void 0:ye.docs)==null?void 0:Te.source},description:{story:`User profile card popover.

Real-world example showing a user profile card with interactive content.`,...(Se=(Be=S.parameters)==null?void 0:Be.docs)==null?void 0:Se.description}}};var Ae,Oe,ke,Fe,_e;A.parameters={...A.parameters,docs:{...(Ae=A.parameters)==null?void 0:Ae.docs,source:{originalSource:`{
  render: () => <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          Pick a date
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="p-4 space-y-3">
          <div className="space-y-2">
            <Label htmlFor="date-input">Select Date</Label>
            <Input id="date-input" type="date" className="w-full" />
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline">Cancel</Button>
            <Button size="sm">Confirm</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
}`,...(ke=(Oe=A.parameters)==null?void 0:Oe.docs)==null?void 0:ke.source},description:{story:`Date picker popover example.

Shows how popovers are commonly used for date/time pickers.`,...(_e=(Fe=A.parameters)==null?void 0:Fe.docs)==null?void 0:_e.description}}};var De,Re,Ee,Ie,Le;O.parameters={...O.parameters,docs:{...(De=O.parameters)==null?void 0:De.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label>Password Requirements</Label>
        <Popover>
          <PopoverTrigger asChild>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <HelpCircle className="h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent side="right" align="start" className="w-72">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Password Requirements</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-[#0ec2bc] mt-0.5">✓</span>
                  <span>At least 8 characters long</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0ec2bc] mt-0.5">✓</span>
                  <span>Contains at least one uppercase letter</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0ec2bc] mt-0.5">✓</span>
                  <span>Contains at least one number</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0ec2bc] mt-0.5">✓</span>
                  <span>Contains at least one special character</span>
                </li>
              </ul>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Input type="password" placeholder="Enter password" />
    </div>
}`,...(Ee=(Re=O.parameters)==null?void 0:Re.docs)==null?void 0:Ee.source},description:{story:`Help tooltip with rich content.

Shows how to use popover for contextual help that needs more than plain text.`,...(Le=(Ie=O.parameters)==null?void 0:Ie.docs)==null?void 0:Le.description}}};var Me,ze,We,He,Ve;k.parameters={...k.parameters,docs:{...(Me=k.parameters)==null?void 0:Me.docs,source:{originalSource:`{
  render: () => {
    const SettingsPopover = () => {
      const [notifications, setNotifications] = useState(true);
      const [autoSave, setAutoSave] = useState(false);
      return <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Preferences
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm leading-none">Settings</h4>
                <p className="text-xs text-muted-foreground">
                  Configure your preferences
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications" className="text-sm">
                    Enable notifications
                  </Label>
                  <button id="notifications" onClick={() => setNotifications(!notifications)} className={\`relative inline-flex h-6 w-11 items-center rounded-full transition-colors \${notifications ? 'bg-[#0ec2bc]' : 'bg-muted'}\`}>
                    <span className={\`inline-block h-4 w-4 transform rounded-full bg-white transition-transform \${notifications ? 'translate-x-6' : 'translate-x-1'}\`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="autosave" className="text-sm">
                    Auto-save changes
                  </Label>
                  <button id="autosave" onClick={() => setAutoSave(!autoSave)} className={\`relative inline-flex h-6 w-11 items-center rounded-full transition-colors \${autoSave ? 'bg-[#0ec2bc]' : 'bg-muted'}\`}>
                    <span className={\`inline-block h-4 w-4 transform rounded-full bg-white transition-transform \${autoSave ? 'translate-x-6' : 'translate-x-1'}\`} />
                  </button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme" className="text-sm">Theme</Label>
                  <select id="theme" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option>Light</option>
                    <option>Dark</option>
                    <option>System</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button size="sm">Save Changes</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>;
    };
    return <SettingsPopover />;
  }
}`,...(We=(ze=k.parameters)==null?void 0:ze.docs)==null?void 0:We.source},description:{story:`Settings panel popover.

Complex example with multiple form controls in a popover.`,...(Ve=(He=k.parameters)==null?void 0:He.docs)==null?void 0:Ve.description}}};var $e,Ue,qe,Qe,Ge;F.parameters={...F.parameters,docs:{...($e=F.parameters)==null?void 0:$e.docs,source:{originalSource:`{
  render: () => <Popover>
      <PopoverTrigger asChild>
        <Button variant="cta" style={{
        backgroundColor: '#0ec2bc',
        color: 'white'
      }}>
          <HelpCircle className="mr-2 h-4 w-4" />
          Learn More
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" style={{
      borderColor: '#0ec2bc'
    }}>
        <div className="space-y-3">
          <h4 className="font-semibold text-sm" style={{
          color: '#0ec2bc'
        }}>
            Ozean Licht Platform
          </h4>
          <p className="text-sm text-muted-foreground">
            A content platform and educational ecosystem serving two Austrian associations
            with cosmic-inspired design and advanced content management.
          </p>
          <div className="pt-2 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#0ec2bc]">✓</span>
              <span>Multi-tenant architecture</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#0ec2bc]">✓</span>
              <span>Advanced content streaming</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#0ec2bc]">✓</span>
              <span>Real-time collaboration</span>
            </div>
          </div>
          <Button size="sm" className="w-full" style={{
          backgroundColor: '#0ec2bc',
          color: 'white'
        }}>
            Get Started
          </Button>
        </div>
      </PopoverContent>
    </Popover>
}`,...(qe=(Ue=F.parameters)==null?void 0:Ue.docs)==null?void 0:qe.source},description:{story:`Ozean Licht branded popover.

Demonstrates using Ozean Licht turquoise accent color (#0ec2bc).`,...(Ge=(Qe=F.parameters)==null?void 0:Qe.docs)==null?void 0:Ge.description}}};var Je,Ke,Ye,Ze,Xe;_.parameters={..._.parameters,docs:{...(Je=_.parameters)==null?void 0:Je.docs,source:{originalSource:`{
  render: () => <div className="flex gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Narrow</Button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <p className="text-sm">Narrow popover (w-48)</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Default</Button>
        </PopoverTrigger>
        <PopoverContent>
          <p className="text-sm">Default width popover (w-72)</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Wide</Button>
        </PopoverTrigger>
        <PopoverContent className="w-96">
          <p className="text-sm">Wide popover (w-96) with more space for content</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Auto</Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto">
          <p className="text-sm whitespace-nowrap">Auto width</p>
        </PopoverContent>
      </Popover>
    </div>
}`,...(Ye=(Ke=_.parameters)==null?void 0:Ke.docs)==null?void 0:Ye.source},description:{story:`Custom width popovers.

Shows how to control popover width with className.`,...(Xe=(Ze=_.parameters)==null?void 0:Ze.docs)==null?void 0:Xe.description}}};var et,tt,st,ot,nt;D.parameters={...D.parameters,docs:{...(et=D.parameters)==null?void 0:et.docs,source:{originalSource:`{
  render: () => <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Quick Actions</Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2">
        <div className="space-y-1">
          <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
            Edit
          </button>
          <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
            Duplicate
          </button>
          <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
            Archive
          </button>
          <div className="h-px bg-border my-1" />
          <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors">
            Delete
          </button>
        </div>
      </PopoverContent>
    </Popover>
}`,...(st=(tt=D.parameters)==null?void 0:tt.docs)==null?void 0:st.source},description:{story:`Quick action menu in popover.

Shows how popover can be used for action menus (alternative to DropdownMenu).`,...(nt=(ot=D.parameters)==null?void 0:ot.docs)==null?void 0:nt.description}}};var rt,at,it,lt,ct;R.parameters={...R.parameters,docs:{...(rt=R.parameters)==null?void 0:rt.docs,source:{originalSource:`{
  render: () => <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" data-testid="popover-trigger">
          Open Popover
        </Button>
      </PopoverTrigger>
      <PopoverContent data-testid="popover-content">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Test Popover</h4>
          <Input data-testid="popover-input" placeholder="Type here..." />
          <Button size="sm" data-testid="popover-button">
            Submit
          </Button>
        </div>
      </PopoverContent>
    </Popover>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    // Click trigger to open popover
    const trigger = canvas.getByTestId('popover-trigger');
    await userEvent.click(trigger);

    // Wait for popover to open
    await new Promise(resolve => setTimeout(resolve, 200));

    // Popover should be visible
    const popoverContent = body.getByTestId('popover-content');
    await expect(popoverContent).toBeInTheDocument();

    // Interact with input inside popover
    const input = body.getByTestId('popover-input');
    await userEvent.click(input);
    await userEvent.type(input, 'Test input');

    // Click button inside popover
    const button = body.getByTestId('popover-button');
    await userEvent.click(button);

    // Popover should still be open (buttons don't close it by default)
    await expect(popoverContent).toBeInTheDocument();

    // Click outside to close
    await userEvent.click(canvasElement);

    // Wait for popover to close
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}`,...(it=(at=R.parameters)==null?void 0:at.docs)==null?void 0:it.source},description:{story:`Interactive test with play function.

Tests popover open/close and keyboard interactions using Storybook interactions.`,...(ct=(lt=R.parameters)==null?void 0:lt.docs)==null?void 0:ct.description}}};var dt,pt,mt,ut,ht;E.parameters={...E.parameters,docs:{...(dt=E.parameters)==null?void 0:dt.docs,source:{originalSource:`{
  render: () => <div className="flex gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Popover 1</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="space-y-2">
            <h4 className="font-medium text-sm">First Popover</h4>
            <p className="text-sm text-muted-foreground">
              This is the first independent popover.
            </p>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Popover 2</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Second Popover</h4>
            <p className="text-sm text-muted-foreground">
              This is the second independent popover.
            </p>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Popover 3</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Third Popover</h4>
            <p className="text-sm text-muted-foreground">
              This is the third independent popover. Opening one doesn't close the others.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
}`,...(mt=(pt=E.parameters)==null?void 0:pt.docs)==null?void 0:mt.source},description:{story:`Multiple popovers example.

Shows multiple independent popovers working together.`,...(ht=(ut=E.parameters)==null?void 0:ut.docs)==null?void 0:ht.description}}};var vt,xt,gt,ft,Nt;I.parameters={...I.parameters,docs:{...(vt=I.parameters)==null?void 0:vt.docs,source:{originalSource:`{
  render: () => {
    const FormPopover = () => {
      const [email, setEmail] = useState('');
      const [name, setName] = useState('');
      return <Popover>
          <PopoverTrigger asChild>
            <Button>
              <User className="mr-2 h-4 w-4" />
              Create Account
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-base">Create New Account</h4>
                <p className="text-sm text-muted-foreground">
                  Fill in the information below to create your account.
                </p>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <input type="checkbox" id="terms" className="rounded" />
                  <Label htmlFor="terms" className="font-normal">
                    I agree to the terms and conditions
                  </Label>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button size="sm" className="flex-1" style={{
                backgroundColor: '#0ec2bc',
                color: 'white'
              }}>
                  Create Account
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>;
    };
    return <FormPopover />;
  }
}`,...(gt=(xt=I.parameters)==null?void 0:xt.docs)==null?void 0:gt.source},description:{story:`Complex form in popover.

Demonstrates a complete form workflow inside a popover.`,...(Nt=(ft=I.parameters)==null?void 0:ft.docs)==null?void 0:Nt.description}}};const Gs=["Default","WithForm","Positioning","Alignment","WithOffset","ControlledState","UserProfileCard","DatePickerExample","HelpTooltip","SettingsPanel","OzeanLichtBranded","CustomWidth","QuickActions","InteractiveTest","MultiplePopovers","ComplexForm"];export{y as Alignment,I as ComplexForm,B as ControlledState,_ as CustomWidth,A as DatePickerExample,C as Default,O as HelpTooltip,R as InteractiveTest,E as MultiplePopovers,F as OzeanLichtBranded,b as Positioning,D as QuickActions,k as SettingsPanel,S as UserProfileCard,w as WithForm,T as WithOffset,Gs as __namedExportsOrder,Qs as default};
