import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{w as q,u as M,e as G}from"./index-CJu6nLMj.js";import{r as l}from"./index-B2-qRKKC.js";import{c as is,P as cs,a as v}from"./index-D5ysUGwq.js";import{u as ls}from"./index-BlCrtW8-.js";import{u as ds}from"./index-BFjtS4uE.js";import{c as Ze,R as ms,A as ps,C as us,a as vs}from"./index-FV1saqzH.js";import{P as xs}from"./index-PNzqWif7.js";import{D as hs}from"./index-DwPv8f4P.js";import{c as gs}from"./cn-CytzSlOG.js";import{B as a}from"./button-BHL6w8gg.js";import{A as h,a as fs,b as g}from"./avatar-Cgik7SBR.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-kS-9iBlu.js";import"./index-D1vk04JX.js";import"./index-ciuW_uyV.js";import"./index-BYfY0yFj.js";import"./index-BiMR7eR1.js";import"./index-DVF2XGCm.js";import"./index-D7N8UVpi.js";import"./index-B5oyz0SX.js";var V,L="HoverCard",[es]=is(L,[Ze]),U=Ze(),[Cs,W]=es(L),ss=s=>{const{__scopeHoverCard:t,children:r,open:m,defaultOpen:d,onOpenChange:p,openDelay:C=700,closeDelay:N=300}=s,u=U(t),b=l.useRef(0),x=l.useRef(0),D=l.useRef(!1),f=l.useRef(!1),[O,n]=ls({prop:m,defaultProp:d??!1,onChange:p,caller:L}),F=l.useCallback(()=>{clearTimeout(x.current),b.current=window.setTimeout(()=>n(!0),C)},[C,n]),z=l.useCallback(()=>{clearTimeout(b.current),!D.current&&!f.current&&(x.current=window.setTimeout(()=>n(!1),N))},[N,n]),os=l.useCallback(()=>n(!1),[n]);return l.useEffect(()=>()=>{clearTimeout(b.current),clearTimeout(x.current)},[]),e.jsx(Cs,{scope:t,open:O,onOpenChange:n,onOpen:F,onClose:z,onDismiss:os,hasSelectionRef:D,isPointerDownOnContentRef:f,children:e.jsx(ms,{...u,children:r})})};ss.displayName=L;var as="HoverCardTrigger",ts=l.forwardRef((s,t)=>{const{__scopeHoverCard:r,...m}=s,d=W(as,r),p=U(r);return e.jsx(ps,{asChild:!0,...p,children:e.jsx(cs.a,{"data-state":d.open?"open":"closed",...m,ref:t,onPointerEnter:v(s.onPointerEnter,E(d.onOpen)),onPointerLeave:v(s.onPointerLeave,E(d.onClose)),onFocus:v(s.onFocus,d.onOpen),onBlur:v(s.onBlur,d.onClose),onTouchStart:v(s.onTouchStart,C=>C.preventDefault())})})});ts.displayName=as;var Ns="HoverCardPortal",[Ks,bs]=es(Ns,{forceMount:void 0}),I="HoverCardContent",rs=l.forwardRef((s,t)=>{const r=bs(I,s.__scopeHoverCard),{forceMount:m=r.forceMount,...d}=s,p=W(I,s.__scopeHoverCard);return e.jsx(xs,{present:m||p.open,children:e.jsx(ys,{"data-state":p.open?"open":"closed",...d,onPointerEnter:v(s.onPointerEnter,E(p.onOpen)),onPointerLeave:v(s.onPointerLeave,E(p.onClose)),ref:t})})});rs.displayName=I;var ys=l.forwardRef((s,t)=>{const{__scopeHoverCard:r,onEscapeKeyDown:m,onPointerDownOutside:d,onFocusOutside:p,onInteractOutside:C,...N}=s,u=W(I,r),b=U(r),x=l.useRef(null),D=ds(t,x),[f,O]=l.useState(!1);return l.useEffect(()=>{if(f){const n=document.body;return V=n.style.userSelect||n.style.webkitUserSelect,n.style.userSelect="none",n.style.webkitUserSelect="none",()=>{n.style.userSelect=V,n.style.webkitUserSelect=V}}},[f]),l.useEffect(()=>{if(x.current){const n=()=>{O(!1),u.isPointerDownOnContentRef.current=!1,setTimeout(()=>{var z;((z=document.getSelection())==null?void 0:z.toString())!==""&&(u.hasSelectionRef.current=!0)})};return document.addEventListener("pointerup",n),()=>{document.removeEventListener("pointerup",n),u.hasSelectionRef.current=!1,u.isPointerDownOnContentRef.current=!1}}},[u.isPointerDownOnContentRef,u.hasSelectionRef]),l.useEffect(()=>{x.current&&Hs(x.current).forEach(F=>F.setAttribute("tabindex","-1"))}),e.jsx(hs,{asChild:!0,disableOutsidePointerEvents:!1,onInteractOutside:C,onEscapeKeyDown:m,onPointerDownOutside:d,onFocusOutside:v(p,n=>{n.preventDefault()}),onDismiss:u.onDismiss,children:e.jsx(us,{...b,...N,onPointerDown:v(N.onPointerDown,n=>{n.currentTarget.contains(n.target)&&O(!0),u.hasSelectionRef.current=!1,u.isPointerDownOnContentRef.current=!0}),ref:D,style:{...N.style,userSelect:f?"text":void 0,WebkitUserSelect:f?"text":void 0,"--radix-hover-card-content-transform-origin":"var(--radix-popper-transform-origin)","--radix-hover-card-content-available-width":"var(--radix-popper-available-width)","--radix-hover-card-content-available-height":"var(--radix-popper-available-height)","--radix-hover-card-trigger-width":"var(--radix-popper-anchor-width)","--radix-hover-card-trigger-height":"var(--radix-popper-anchor-height)"}})})}),js="HoverCardArrow",ws=l.forwardRef((s,t)=>{const{__scopeHoverCard:r,...m}=s,d=U(r);return e.jsx(vs,{...d,...m,ref:t})});ws.displayName=js;function E(s){return t=>t.pointerType==="touch"?void 0:s()}function Hs(s){const t=[],r=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT,{acceptNode:m=>m.tabIndex>=0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP});for(;r.nextNode();)t.push(r.currentNode);return t}var ks=ss,Ts=ts,ns=rs;const o=ks,c=Ts,i=l.forwardRef(({className:s,align:t="center",sideOffset:r=4,...m},d)=>e.jsx(ns,{ref:d,align:t,sideOffset:r,className:gs("z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-hover-card-content-transform-origin]",s),...m}));i.displayName=ns.displayName;try{o.displayName="HoverCard",o.__docgenInfo={description:"",displayName:"HoverCard",props:{}}}catch{}try{c.displayName="HoverCardTrigger",c.__docgenInfo={description:"",displayName:"HoverCardTrigger",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{i.displayName="HoverCardContent",i.__docgenInfo={description:"",displayName:"HoverCardContent",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}const Xs={title:"Tier 1: Primitives/shadcn/HoverCard",component:o,parameters:{layout:"centered",docs:{description:{component:"For sighted users to preview content available behind a link. Built on Radix UI HoverCard primitive."}}},tags:["autodocs"]},y={render:()=>e.jsxs(o,{children:[e.jsx(c,{asChild:!0,children:e.jsx(a,{variant:"link",children:"@nextjs"})}),e.jsx(i,{className:"w-80",children:e.jsxs("div",{className:"flex justify-between space-x-4",children:[e.jsxs(h,{children:[e.jsx(fs,{src:"https://github.com/vercel.png"}),e.jsx(g,{children:"VC"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("h4",{className:"text-sm font-semibold",children:"@nextjs"}),e.jsx("p",{className:"text-sm",children:"The React Framework – created and maintained by @vercel."}),e.jsx("div",{className:"flex items-center pt-2",children:e.jsx("span",{className:"text-xs text-muted-foreground",children:"Joined December 2021"})})]})]})})]})},j={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsx("p",{className:"text-sm text-muted-foreground",children:"Check out this article:"}),e.jsxs(o,{children:[e.jsx(c,{asChild:!0,children:e.jsx("a",{href:"https://ui.shadcn.com",className:"text-blue-600 hover:underline cursor-pointer",children:"shadcn/ui Documentation"})}),e.jsx(i,{className:"w-80",children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"text-sm font-semibold",children:"shadcn/ui"}),e.jsx("p",{className:"text-sm",children:"Beautifully designed components built with Radix UI and Tailwind CSS. Accessible and customizable components that you can copy and paste into your apps."}),e.jsx("div",{className:"flex items-center pt-2 text-xs text-muted-foreground",children:e.jsx("span",{children:"ui.shadcn.com"})})]})})]})]})},w={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsx("p",{className:"text-sm text-muted-foreground",children:"Hover over any user to see their profile:"}),e.jsxs("div",{className:"flex gap-4",children:[e.jsxs(o,{children:[e.jsx(c,{asChild:!0,children:e.jsx(a,{variant:"link",className:"text-base",children:"@sarah_dev"})}),e.jsx(i,{className:"w-80",children:e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex gap-4",children:[e.jsx(h,{className:"h-12 w-12",children:e.jsx(g,{style:{backgroundColor:"#0ec2bc",color:"white"},children:"SD"})}),e.jsxs("div",{className:"space-y-1 flex-1",children:[e.jsx("h4",{className:"text-sm font-semibold",children:"Sarah Developer"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"@sarah_dev"})]})]}),e.jsx("p",{className:"text-sm",children:"Full-stack developer passionate about React, TypeScript, and building accessible user interfaces. Currently working on design systems."}),e.jsxs("div",{className:"flex gap-4 text-xs text-muted-foreground",children:[e.jsxs("div",{children:[e.jsx("span",{className:"font-semibold text-foreground",children:"234"})," Following"]}),e.jsxs("div",{children:[e.jsx("span",{className:"font-semibold text-foreground",children:"1.2k"})," Followers"]})]})]})})]}),e.jsxs(o,{children:[e.jsx(c,{asChild:!0,children:e.jsx(a,{variant:"link",className:"text-base",children:"@alex_design"})}),e.jsx(i,{className:"w-80",children:e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex gap-4",children:[e.jsx(h,{className:"h-12 w-12",children:e.jsx(g,{style:{backgroundColor:"#6366f1",color:"white"},children:"AD"})}),e.jsxs("div",{className:"space-y-1 flex-1",children:[e.jsx("h4",{className:"text-sm font-semibold",children:"Alex Designer"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"@alex_design"})]})]}),e.jsx("p",{className:"text-sm",children:"UI/UX designer focused on creating beautiful, intuitive experiences. Love working with designers and developers to build great products."}),e.jsxs("div",{className:"flex gap-4 text-xs text-muted-foreground",children:[e.jsxs("div",{children:[e.jsx("span",{className:"font-semibold text-foreground",children:"892"})," Following"]}),e.jsxs("div",{children:[e.jsx("span",{className:"font-semibold text-foreground",children:"3.4k"})," Followers"]})]})]})})]})]})]})},H={render:()=>e.jsxs("div",{className:"space-y-2 w-96",children:[e.jsx("h3",{className:"text-sm font-semibold mb-4",children:"Team Members"}),e.jsx("div",{className:"space-y-1",children:[{name:"Emma Wilson",username:"emma_w",role:"Product Manager",initials:"EW",color:"#0ec2bc"},{name:"James Chen",username:"jchen",role:"Senior Engineer",initials:"JC",color:"#f59e0b"},{name:"Maria Garcia",username:"mgarcia",role:"UX Designer",initials:"MG",color:"#ec4899"},{name:"David Kim",username:"dkim",role:"DevOps Lead",initials:"DK",color:"#8b5cf6"}].map(s=>e.jsx("div",{className:"flex items-center gap-2 p-2 rounded-md hover:bg-gray-50",children:e.jsxs(o,{children:[e.jsx(c,{asChild:!0,children:e.jsxs("button",{className:"flex items-center gap-2 text-left",children:[e.jsx(h,{className:"h-8 w-8",children:e.jsx(g,{style:{backgroundColor:s.color,color:"white"},children:s.initials})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-medium",children:s.name}),e.jsx("p",{className:"text-xs text-muted-foreground",children:s.role})]})]})}),e.jsx(i,{className:"w-80",children:e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex gap-3",children:[e.jsx(h,{className:"h-12 w-12",children:e.jsx(g,{style:{backgroundColor:s.color,color:"white"},children:s.initials})}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("h4",{className:"text-sm font-semibold",children:s.name}),e.jsxs("p",{className:"text-sm text-muted-foreground",children:["@",s.username]}),e.jsx("p",{className:"text-xs text-muted-foreground",children:s.role})]})]}),e.jsxs("p",{className:"text-sm",children:["Contact: ",s.username,"@company.com"]}),e.jsxs("div",{className:"flex gap-2 pt-2",children:[e.jsx(a,{size:"sm",variant:"outline",children:"View Profile"}),e.jsx(a,{size:"sm",style:{backgroundColor:s.color,color:"white"},children:"Message"})]})]})})]})},s.username))})]})},k={render:()=>{const s=()=>{const[t,r]=l.useState(!1);return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsx(a,{onClick:()=>r(!0),size:"sm",children:"Open HoverCard"}),e.jsx(a,{variant:"outline",onClick:()=>r(!1),size:"sm",children:"Close HoverCard"})]}),e.jsxs("p",{className:"text-sm text-muted-foreground",children:["HoverCard is currently: ",e.jsx("strong",{children:t?"Open":"Closed"})]}),e.jsxs(o,{open:t,onOpenChange:r,children:[e.jsx(c,{asChild:!0,children:e.jsx(a,{variant:"link",children:"@controlled_user"})}),e.jsx(i,{className:"w-80",children:e.jsxs("div",{className:"flex justify-between space-x-4",children:[e.jsx(h,{children:e.jsx(g,{style:{backgroundColor:"#0ec2bc",color:"white"},children:"CU"})}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("h4",{className:"text-sm font-semibold",children:"Controlled User"}),e.jsx("p",{className:"text-sm",children:"This hover card's state is controlled externally. You can open/close it programmatically or by hovering."}),e.jsx("div",{className:"flex items-center pt-2",children:e.jsx("span",{className:"text-xs text-muted-foreground",children:"onOpenChange fires when state changes"})})]})]})})]})]})};return e.jsx(s,{})}},T={render:()=>e.jsxs("div",{className:"grid grid-cols-2 gap-8 p-12",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx("p",{className:"text-xs text-muted-foreground mb-2",children:"Top (default center align)"}),e.jsxs(o,{children:[e.jsx(c,{asChild:!0,children:e.jsx(a,{variant:"outline",children:"Hover (Top)"})}),e.jsx(i,{side:"top",className:"w-64",children:e.jsx("p",{className:"text-sm",children:"Content positioned on top"})})]})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx("p",{className:"text-xs text-muted-foreground mb-2",children:"Right (align start)"}),e.jsxs(o,{children:[e.jsx(c,{asChild:!0,children:e.jsx(a,{variant:"outline",children:"Hover (Right)"})}),e.jsx(i,{side:"right",align:"start",className:"w-64",children:e.jsx("p",{className:"text-sm",children:"Content positioned on right, aligned to start"})})]})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx("p",{className:"text-xs text-muted-foreground mb-2",children:"Bottom (align end)"}),e.jsxs(o,{children:[e.jsx(c,{asChild:!0,children:e.jsx(a,{variant:"outline",children:"Hover (Bottom)"})}),e.jsx(i,{side:"bottom",align:"end",className:"w-64",children:e.jsx("p",{className:"text-sm",children:"Content positioned on bottom, aligned to end"})})]})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx("p",{className:"text-xs text-muted-foreground mb-2",children:"Left (default center align)"}),e.jsxs(o,{children:[e.jsx(c,{asChild:!0,children:e.jsx(a,{variant:"outline",children:"Hover (Left)"})}),e.jsx(i,{side:"left",className:"w-64",children:e.jsx("p",{className:"text-sm",children:"Content positioned on left"})})]})]})]})},S={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-sm font-medium",children:"Instant open (0ms delay)"}),e.jsxs(o,{openDelay:0,children:[e.jsx(c,{asChild:!0,children:e.jsx(a,{variant:"outline",children:"Instant"})}),e.jsx(i,{className:"w-64",children:e.jsx("p",{className:"text-sm",children:"Opens immediately on hover (0ms delay)"})})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-sm font-medium",children:"Default timing (700ms delay)"}),e.jsxs(o,{children:[e.jsx(c,{asChild:!0,children:e.jsx(a,{variant:"outline",children:"Default"})}),e.jsx(i,{className:"w-64",children:e.jsx("p",{className:"text-sm",children:"Opens after default 700ms hover delay"})})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-sm font-medium",children:"Long delay (1500ms)"}),e.jsxs(o,{openDelay:1500,children:[e.jsx(c,{asChild:!0,children:e.jsx(a,{variant:"outline",children:"Long Delay"})}),e.jsx(i,{className:"w-64",children:e.jsx("p",{className:"text-sm",children:"Opens after 1500ms (1.5 second) delay"})})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-sm font-medium",children:"Quick close (0ms close delay)"}),e.jsxs(o,{closeDelay:0,children:[e.jsx(c,{asChild:!0,children:e.jsx(a,{variant:"outline",children:"Quick Close"})}),e.jsx(i,{className:"w-64",children:e.jsx("p",{className:"text-sm",children:"Closes immediately when you stop hovering (0ms close delay)"})})]})]})]})},B={render:()=>e.jsxs("div",{className:"space-y-4 w-96",children:[e.jsx("h3",{className:"text-sm font-semibold mb-4",children:"Product Catalog"}),e.jsx("div",{className:"grid grid-cols-2 gap-4",children:[{name:"Wireless Headphones",price:"$129.99",rating:"4.5",description:"Premium noise-canceling wireless headphones with 30-hour battery life."},{name:"Smart Watch",price:"$299.99",rating:"4.8",description:"Advanced fitness tracking with heart rate monitoring and GPS."},{name:"Laptop Stand",price:"$49.99",rating:"4.6",description:"Ergonomic aluminum stand with adjustable height and angle."},{name:"Mechanical Keyboard",price:"$159.99",rating:"4.9",description:"RGB backlit mechanical keyboard with customizable keys."}].map((s,t)=>e.jsxs(o,{children:[e.jsx(c,{asChild:!0,children:e.jsxs("div",{className:"border rounded-lg p-3 cursor-pointer hover:border-gray-400 transition-colors",children:[e.jsx("div",{className:"aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center text-xs text-gray-400",children:"Image"}),e.jsx("h4",{className:"text-sm font-medium",children:s.name}),e.jsx("p",{className:"text-sm font-semibold",style:{color:"#0ec2bc"},children:s.price})]})}),e.jsx(i,{className:"w-80",children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"text-sm font-semibold",children:s.name}),e.jsx("p",{className:"text-sm text-muted-foreground",children:s.description}),e.jsxs("div",{className:"flex items-center gap-2 text-xs",children:[e.jsx("span",{className:"font-semibold",children:s.rating}),e.jsx("span",{className:"text-yellow-500",children:"★★★★★"}),e.jsx("span",{className:"text-muted-foreground",children:"(256 reviews)"})]}),e.jsxs("div",{className:"flex items-center justify-between pt-2",children:[e.jsx("span",{className:"text-lg font-bold",style:{color:"#0ec2bc"},children:s.price}),e.jsx(a,{size:"sm",style:{backgroundColor:"#0ec2bc",color:"white"},children:"Add to Cart"})]})]})})]},t))})]})},P={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsx("p",{className:"text-sm text-muted-foreground",children:"Hover over the user to see interactive profile card:"}),e.jsxs(o,{children:[e.jsx(c,{asChild:!0,children:e.jsx(a,{variant:"link",className:"text-base",children:"@interactive_user"})}),e.jsx(i,{className:"w-80",children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex gap-3",children:[e.jsx(h,{className:"h-12 w-12",children:e.jsx(g,{style:{backgroundColor:"#0ec2bc",color:"white"},children:"IU"})}),e.jsxs("div",{className:"space-y-1 flex-1",children:[e.jsx("h4",{className:"text-sm font-semibold",children:"Interactive User"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"@interactive_user"})]})]}),e.jsx("p",{className:"text-sm",children:"Full-stack developer with a passion for creating interactive user experiences."}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(a,{size:"sm",style:{backgroundColor:"#0ec2bc",color:"white"},onClick:()=>alert("Following user!"),children:"Follow"}),e.jsx(a,{size:"sm",variant:"outline",onClick:()=>alert("Viewing profile!"),children:"View Profile"})]}),e.jsx("div",{className:"pt-2 border-t text-xs text-muted-foreground",children:"Click the buttons above - card stays open!"})]})})]})]})},A={render:()=>e.jsxs("div",{className:"space-y-4 w-96",children:[e.jsx("h3",{className:"text-sm font-semibold mb-4",children:"Popular Repositories"}),e.jsx("div",{className:"space-y-2",children:[{name:"shadcn/ui",description:"Beautifully designed components built with Radix UI and Tailwind CSS.",stars:"42.5k",language:"TypeScript",languageColor:"#3178c6"},{name:"vercel/next.js",description:"The React Framework for Production",stars:"115k",language:"JavaScript",languageColor:"#f1e05a"},{name:"facebook/react",description:"A declarative, efficient, and flexible JavaScript library for building user interfaces.",stars:"215k",language:"JavaScript",languageColor:"#f1e05a"}].map((s,t)=>e.jsxs(o,{children:[e.jsx(c,{asChild:!0,children:e.jsxs("div",{className:"border rounded-lg p-3 cursor-pointer hover:border-gray-400 transition-colors",children:[e.jsx("h4",{className:"text-sm font-semibold text-blue-600",children:s.name}),e.jsx("p",{className:"text-xs text-muted-foreground mt-1 line-clamp-1",children:s.description})]})}),e.jsx(i,{className:"w-80",children:e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-semibold",children:s.name}),e.jsx("p",{className:"text-sm text-muted-foreground mt-1",children:s.description})]}),e.jsxs("div",{className:"flex items-center gap-4 text-xs text-muted-foreground",children:[e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsx("span",{className:"w-3 h-3 rounded-full",style:{backgroundColor:s.languageColor}}),s.language]}),e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsx("span",{children:"⭐"}),s.stars]}),e.jsx("div",{children:"MIT license"})]}),e.jsxs("div",{className:"flex gap-2 pt-2",children:[e.jsx(a,{size:"sm",variant:"outline",className:"flex-1",children:"View Repo"}),e.jsx(a,{size:"sm",style:{backgroundColor:"#0ec2bc",color:"white"},className:"flex-1",children:"Star"})]})]})})]},t))})]})},R={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-sm font-medium",children:"Turquoise accent hover card"}),e.jsxs(o,{children:[e.jsx(c,{asChild:!0,children:e.jsx(a,{variant:"outline",style:{borderColor:"#0ec2bc",color:"#0ec2bc"},children:"Hover for info"})}),e.jsx(i,{className:"w-80",style:{borderColor:"#0ec2bc"},children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"text-sm font-semibold",style:{color:"#0ec2bc"},children:"Ozean Licht Design System"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Built with Radix UI primitives and styled with the Ozean Licht turquoise accent color (#0ec2bc)."}),e.jsx("div",{className:"pt-2",children:e.jsx(a,{size:"sm",style:{backgroundColor:"#0ec2bc",color:"white"},children:"Learn More"})})]})})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-sm font-medium",children:"Team member with turquoise avatar"}),e.jsxs(o,{children:[e.jsx(c,{asChild:!0,children:e.jsx(a,{variant:"link",style:{color:"#0ec2bc"},children:"@ozean_team"})}),e.jsx(i,{className:"w-80",children:e.jsxs("div",{className:"flex gap-4",children:[e.jsx(h,{className:"h-12 w-12",children:e.jsx(g,{style:{backgroundColor:"#0ec2bc",color:"white"},children:"OL"})}),e.jsxs("div",{className:"space-y-2 flex-1",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-semibold",children:"Ozean Licht Team"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"@ozean_team"})]}),e.jsx("p",{className:"text-sm",children:"Building modern web applications with beautiful design and accessible components."}),e.jsxs("div",{className:"flex gap-2 pt-1",children:[e.jsx(a,{size:"sm",style:{backgroundColor:"#0ec2bc",color:"white"},children:"Follow"}),e.jsx(a,{size:"sm",variant:"outline",children:"Visit Site"})]})]})]})})]})]})]})},_={render:()=>e.jsxs(o,{children:[e.jsx(c,{asChild:!0,children:e.jsx(a,{variant:"outline","data-testid":"hover-trigger",children:"Hover or Focus Me"})}),e.jsx(i,{className:"w-80","data-testid":"hover-content",children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"text-sm font-semibold",children:"Test HoverCard"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"This hover card tests both mouse hover and keyboard focus interactions."}),e.jsx(a,{size:"sm","data-testid":"interactive-button",style:{backgroundColor:"#0ec2bc",color:"white"},children:"Interactive Button"})]})})]}),play:async({canvasElement:s})=>{const r=q(s).getByTestId("hover-trigger");await M.hover(r),await new Promise(p=>setTimeout(p,1e3));const d=q(document.body).getByTestId("hover-content");await G(d).toBeInTheDocument(),await M.tab(),await G(r).toHaveFocus(),await M.unhover(r),await new Promise(p=>setTimeout(p,500))}};var J,$,K,X,Q;y.parameters={...y.parameters,docs:{...(J=y.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@nextjs</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm">
              The React Framework – created and maintained by @vercel.
            </p>
            <div className="flex items-center pt-2">
              <span className="text-xs text-muted-foreground">
                Joined December 2021
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
}`,...(K=($=y.parameters)==null?void 0:$.docs)==null?void 0:K.source},description:{story:`Default hover card with user profile.

The most common use case - showing user profile information on hover.
Hover over the username to see the profile card.`,...(Q=(X=y.parameters)==null?void 0:X.docs)==null?void 0:Q.description}}};var Y,Z,ee,se,ae;j.parameters={...j.parameters,docs:{...(Y=j.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Check out this article:
      </p>
      <HoverCard>
        <HoverCardTrigger asChild>
          <a href="https://ui.shadcn.com" className="text-blue-600 hover:underline cursor-pointer">
            shadcn/ui Documentation
          </a>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">shadcn/ui</h4>
            <p className="text-sm">
              Beautifully designed components built with Radix UI and Tailwind CSS.
              Accessible and customizable components that you can copy and paste
              into your apps.
            </p>
            <div className="flex items-center pt-2 text-xs text-muted-foreground">
              <span>ui.shadcn.com</span>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
}`,...(ee=(Z=j.parameters)==null?void 0:Z.docs)==null?void 0:ee.source},description:{story:`Link preview hover card.

Shows a preview of link content similar to social media link cards.
Useful for external links or article previews.`,...(ae=(se=j.parameters)==null?void 0:se.docs)==null?void 0:ae.description}}};var te,re,ne,oe,ie;w.parameters={...w.parameters,docs:{...(te=w.parameters)==null?void 0:te.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Hover over any user to see their profile:
      </p>
      <div className="flex gap-4">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link" className="text-base">
              @sarah_dev
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-3">
              <div className="flex gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback style={{
                  backgroundColor: '#0ec2bc',
                  color: 'white'
                }}>
                    SD
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 flex-1">
                  <h4 className="text-sm font-semibold">Sarah Developer</h4>
                  <p className="text-sm text-muted-foreground">@sarah_dev</p>
                </div>
              </div>
              <p className="text-sm">
                Full-stack developer passionate about React, TypeScript, and building
                accessible user interfaces. Currently working on design systems.
              </p>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <div>
                  <span className="font-semibold text-foreground">234</span> Following
                </div>
                <div>
                  <span className="font-semibold text-foreground">1.2k</span> Followers
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>

        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link" className="text-base">
              @alex_design
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-3">
              <div className="flex gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback style={{
                  backgroundColor: '#6366f1',
                  color: 'white'
                }}>
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 flex-1">
                  <h4 className="text-sm font-semibold">Alex Designer</h4>
                  <p className="text-sm text-muted-foreground">@alex_design</p>
                </div>
              </div>
              <p className="text-sm">
                UI/UX designer focused on creating beautiful, intuitive experiences.
                Love working with designers and developers to build great products.
              </p>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <div>
                  <span className="font-semibold text-foreground">892</span> Following
                </div>
                <div>
                  <span className="font-semibold text-foreground">3.4k</span> Followers
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
}`,...(ne=(re=w.parameters)==null?void 0:re.docs)==null?void 0:ne.source},description:{story:`Rich user profile with avatar and stats.

Comprehensive user profile card with avatar, bio, and statistics.
Perfect for social applications or team directories.`,...(ie=(oe=w.parameters)==null?void 0:oe.docs)==null?void 0:ie.description}}};var ce,le,de,me,pe;H.parameters={...H.parameters,docs:{...(ce=H.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  render: () => <div className="space-y-2 w-96">
      <h3 className="text-sm font-semibold mb-4">Team Members</h3>
      <div className="space-y-1">
        {[{
        name: 'Emma Wilson',
        username: 'emma_w',
        role: 'Product Manager',
        initials: 'EW',
        color: '#0ec2bc'
      }, {
        name: 'James Chen',
        username: 'jchen',
        role: 'Senior Engineer',
        initials: 'JC',
        color: '#f59e0b'
      }, {
        name: 'Maria Garcia',
        username: 'mgarcia',
        role: 'UX Designer',
        initials: 'MG',
        color: '#ec4899'
      }, {
        name: 'David Kim',
        username: 'dkim',
        role: 'DevOps Lead',
        initials: 'DK',
        color: '#8b5cf6'
      }].map(member => <div key={member.username} className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50">
            <HoverCard>
              <HoverCardTrigger asChild>
                <button className="flex items-center gap-2 text-left">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback style={{
                  backgroundColor: member.color,
                  color: 'white'
                }}>
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback style={{
                    backgroundColor: member.color,
                    color: 'white'
                  }}>
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">@{member.username}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <p className="text-sm">
                    Contact: {member.username}@company.com
                  </p>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline">
                      View Profile
                    </Button>
                    <Button size="sm" style={{
                  backgroundColor: member.color,
                  color: 'white'
                }}>
                      Message
                    </Button>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>)}
      </div>
    </div>
}`,...(de=(le=H.parameters)==null?void 0:le.docs)==null?void 0:de.source},description:{story:`Multiple hover cards in a list.

Demonstrates hover cards in a practical list scenario.
Each item shows detailed information on hover.`,...(pe=(me=H.parameters)==null?void 0:me.docs)==null?void 0:pe.description}}};var ue,ve,xe,he,ge;k.parameters={...k.parameters,docs:{...(ue=k.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  render: () => {
    const ControlledHoverCard = () => {
      const [open, setOpen] = useState(false);
      return <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => setOpen(true)} size="sm">
              Open HoverCard
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)} size="sm">
              Close HoverCard
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            HoverCard is currently: <strong>{open ? 'Open' : 'Closed'}</strong>
          </p>
          <HoverCard open={open} onOpenChange={setOpen}>
            <HoverCardTrigger asChild>
              <Button variant="link">@controlled_user</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <Avatar>
                  <AvatarFallback style={{
                  backgroundColor: '#0ec2bc',
                  color: 'white'
                }}>
                    CU
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Controlled User</h4>
                  <p className="text-sm">
                    This hover card's state is controlled externally.
                    You can open/close it programmatically or by hovering.
                  </p>
                  <div className="flex items-center pt-2">
                    <span className="text-xs text-muted-foreground">
                      onOpenChange fires when state changes
                    </span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>;
    };
    return <ControlledHoverCard />;
  }
}`,...(xe=(ve=k.parameters)==null?void 0:ve.docs)==null?void 0:xe.source},description:{story:"Controlled open state.\n\nShows how to control the hover card state programmatically using `open` and `onOpenChange` props.\nUseful for programmatic control or analytics tracking.",...(ge=(he=k.parameters)==null?void 0:he.docs)==null?void 0:ge.description}}};var fe,Ce,Ne,be,ye;T.parameters={...T.parameters,docs:{...(fe=T.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-2 gap-8 p-12">
      {/* Top positioning */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-muted-foreground mb-2">Top (default center align)</p>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="outline">Hover (Top)</Button>
          </HoverCardTrigger>
          <HoverCardContent side="top" className="w-64">
            <p className="text-sm">Content positioned on top</p>
          </HoverCardContent>
        </HoverCard>
      </div>

      {/* Right positioning */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-muted-foreground mb-2">Right (align start)</p>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="outline">Hover (Right)</Button>
          </HoverCardTrigger>
          <HoverCardContent side="right" align="start" className="w-64">
            <p className="text-sm">Content positioned on right, aligned to start</p>
          </HoverCardContent>
        </HoverCard>
      </div>

      {/* Bottom positioning */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-muted-foreground mb-2">Bottom (align end)</p>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="outline">Hover (Bottom)</Button>
          </HoverCardTrigger>
          <HoverCardContent side="bottom" align="end" className="w-64">
            <p className="text-sm">Content positioned on bottom, aligned to end</p>
          </HoverCardContent>
        </HoverCard>
      </div>

      {/* Left positioning */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-muted-foreground mb-2">Left (default center align)</p>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="outline">Hover (Left)</Button>
          </HoverCardTrigger>
          <HoverCardContent side="left" className="w-64">
            <p className="text-sm">Content positioned on left</p>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
}`,...(Ne=(Ce=T.parameters)==null?void 0:Ce.docs)==null?void 0:Ne.source},description:{story:"Custom positioning.\n\nDemonstrates different positioning options using the `side` and `align` props.\nContent can be positioned on any side with different alignments.",...(ye=(be=T.parameters)==null?void 0:be.docs)==null?void 0:ye.description}}};var je,we,He,ke,Te;S.parameters={...S.parameters,docs:{...(je=S.parameters)==null?void 0:je.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">Instant open (0ms delay)</p>
        <HoverCard openDelay={0}>
          <HoverCardTrigger asChild>
            <Button variant="outline">Instant</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-64">
            <p className="text-sm">Opens immediately on hover (0ms delay)</p>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Default timing (700ms delay)</p>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="outline">Default</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-64">
            <p className="text-sm">Opens after default 700ms hover delay</p>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Long delay (1500ms)</p>
        <HoverCard openDelay={1500}>
          <HoverCardTrigger asChild>
            <Button variant="outline">Long Delay</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-64">
            <p className="text-sm">Opens after 1500ms (1.5 second) delay</p>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Quick close (0ms close delay)</p>
        <HoverCard closeDelay={0}>
          <HoverCardTrigger asChild>
            <Button variant="outline">Quick Close</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-64">
            <p className="text-sm">Closes immediately when you stop hovering (0ms close delay)</p>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
}`,...(He=(we=S.parameters)==null?void 0:we.docs)==null?void 0:He.source},description:{story:`Custom timing and delays.

HoverCard supports custom open and close delays for better UX.
This shows how to configure timing behavior.`,...(Te=(ke=S.parameters)==null?void 0:ke.docs)==null?void 0:Te.description}}};var Se,Be,Pe,Ae,Re;B.parameters={...B.parameters,docs:{...(Se=B.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 w-96">
      <h3 className="text-sm font-semibold mb-4">Product Catalog</h3>
      <div className="grid grid-cols-2 gap-4">
        {[{
        name: 'Wireless Headphones',
        price: '$129.99',
        rating: '4.5',
        description: 'Premium noise-canceling wireless headphones with 30-hour battery life.'
      }, {
        name: 'Smart Watch',
        price: '$299.99',
        rating: '4.8',
        description: 'Advanced fitness tracking with heart rate monitoring and GPS.'
      }, {
        name: 'Laptop Stand',
        price: '$49.99',
        rating: '4.6',
        description: 'Ergonomic aluminum stand with adjustable height and angle.'
      }, {
        name: 'Mechanical Keyboard',
        price: '$159.99',
        rating: '4.9',
        description: 'RGB backlit mechanical keyboard with customizable keys.'
      }].map((product, index) => <HoverCard key={index}>
            <HoverCardTrigger asChild>
              <div className="border rounded-lg p-3 cursor-pointer hover:border-gray-400 transition-colors">
                <div className="aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center text-xs text-gray-400">
                  Image
                </div>
                <h4 className="text-sm font-medium">{product.name}</h4>
                <p className="text-sm font-semibold" style={{
              color: '#0ec2bc'
            }}>
                  {product.price}
                </p>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">{product.name}</h4>
                <p className="text-sm text-muted-foreground">{product.description}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-yellow-500">★★★★★</span>
                  <span className="text-muted-foreground">(256 reviews)</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-lg font-bold" style={{
                color: '#0ec2bc'
              }}>
                    {product.price}
                  </span>
                  <Button size="sm" style={{
                backgroundColor: '#0ec2bc',
                color: 'white'
              }}>
                    Add to Cart
                  </Button>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>)}
      </div>
    </div>
}`,...(Pe=(Be=B.parameters)==null?void 0:Be.docs)==null?void 0:Pe.source},description:{story:`Product card example.

Real-world example showing product information on hover.
Useful for e-commerce or catalog applications.`,...(Re=(Ae=B.parameters)==null?void 0:Ae.docs)==null?void 0:Re.description}}};var _e,De,Oe,Fe,ze;P.parameters={...P.parameters,docs:{...(_e=P.parameters)==null?void 0:_e.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Hover over the user to see interactive profile card:
      </p>
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link" className="text-base">
            @interactive_user
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-4">
            <div className="flex gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback style={{
                backgroundColor: '#0ec2bc',
                color: 'white'
              }}>
                  IU
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 flex-1">
                <h4 className="text-sm font-semibold">Interactive User</h4>
                <p className="text-sm text-muted-foreground">@interactive_user</p>
              </div>
            </div>
            <p className="text-sm">
              Full-stack developer with a passion for creating interactive user experiences.
            </p>
            <div className="flex gap-2">
              <Button size="sm" style={{
              backgroundColor: '#0ec2bc',
              color: 'white'
            }} onClick={() => alert('Following user!')}>
                Follow
              </Button>
              <Button size="sm" variant="outline" onClick={() => alert('Viewing profile!')}>
                View Profile
              </Button>
            </div>
            <div className="pt-2 border-t text-xs text-muted-foreground">
              Click the buttons above - card stays open!
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
}`,...(Oe=(De=P.parameters)==null?void 0:De.docs)==null?void 0:Oe.source},description:{story:`Interactive content.

HoverCard can contain interactive elements like buttons, links, and forms.
The card stays open when you hover over its content.`,...(ze=(Fe=P.parameters)==null?void 0:Fe.docs)==null?void 0:ze.description}}};var Ie,Ee,Le,Ue,Me;A.parameters={...A.parameters,docs:{...(Ie=A.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 w-96">
      <h3 className="text-sm font-semibold mb-4">Popular Repositories</h3>
      <div className="space-y-2">
        {[{
        name: 'shadcn/ui',
        description: 'Beautifully designed components built with Radix UI and Tailwind CSS.',
        stars: '42.5k',
        language: 'TypeScript',
        languageColor: '#3178c6'
      }, {
        name: 'vercel/next.js',
        description: 'The React Framework for Production',
        stars: '115k',
        language: 'JavaScript',
        languageColor: '#f1e05a'
      }, {
        name: 'facebook/react',
        description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
        stars: '215k',
        language: 'JavaScript',
        languageColor: '#f1e05a'
      }].map((repo, index) => <HoverCard key={index}>
            <HoverCardTrigger asChild>
              <div className="border rounded-lg p-3 cursor-pointer hover:border-gray-400 transition-colors">
                <h4 className="text-sm font-semibold text-blue-600">{repo.name}</h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                  {repo.description}
                </p>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold">{repo.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {repo.description}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full" style={{
                  backgroundColor: repo.languageColor
                }} />
                    {repo.language}
                  </div>
                  <div className="flex items-center gap-1">
                    <span>⭐</span>
                    {repo.stars}
                  </div>
                  <div>MIT license</div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Repo
                  </Button>
                  <Button size="sm" style={{
                backgroundColor: '#0ec2bc',
                color: 'white'
              }} className="flex-1">
                    Star
                  </Button>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>)}
      </div>
    </div>
}`,...(Le=(Ee=A.parameters)==null?void 0:Ee.docs)==null?void 0:Le.source},description:{story:`Repository preview.

GitHub-style repository preview on hover.
Shows metadata and quick actions.`,...(Me=(Ue=A.parameters)==null?void 0:Ue.docs)==null?void 0:Me.description}}};var Ve,We,qe,Ge,Je;R.parameters={...R.parameters,docs:{...(Ve=R.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">Turquoise accent hover card</p>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="outline" style={{
            borderColor: '#0ec2bc',
            color: '#0ec2bc'
          }}>
              Hover for info
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80" style={{
          borderColor: '#0ec2bc'
        }}>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold" style={{
              color: '#0ec2bc'
            }}>
                Ozean Licht Design System
              </h4>
              <p className="text-sm text-muted-foreground">
                Built with Radix UI primitives and styled with the Ozean Licht
                turquoise accent color (#0ec2bc).
              </p>
              <div className="pt-2">
                <Button size="sm" style={{
                backgroundColor: '#0ec2bc',
                color: 'white'
              }}>
                  Learn More
                </Button>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Team member with turquoise avatar</p>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link" style={{
            color: '#0ec2bc'
          }}>
              @ozean_team
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback style={{
                backgroundColor: '#0ec2bc',
                color: 'white'
              }}>
                  OL
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 flex-1">
                <div>
                  <h4 className="text-sm font-semibold">Ozean Licht Team</h4>
                  <p className="text-sm text-muted-foreground">@ozean_team</p>
                </div>
                <p className="text-sm">
                  Building modern web applications with beautiful design and
                  accessible components.
                </p>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" style={{
                  backgroundColor: '#0ec2bc',
                  color: 'white'
                }}>
                    Follow
                  </Button>
                  <Button size="sm" variant="outline">
                    Visit Site
                  </Button>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
}`,...(qe=(We=R.parameters)==null?void 0:We.docs)==null?void 0:qe.source},description:{story:`Ozean Licht themed examples.

Multiple hover cards showcasing the Ozean Licht turquoise color (#0ec2bc).
Demonstrates how to apply brand colors to hover card components.`,...(Je=(Ge=R.parameters)==null?void 0:Ge.docs)==null?void 0:Je.description}}};var $e,Ke,Xe,Qe,Ye;_.parameters={..._.parameters,docs:{...($e=_.parameters)==null?void 0:$e.docs,source:{originalSource:`{
  render: () => <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="outline" data-testid="hover-trigger">
          Hover or Focus Me
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" data-testid="hover-content">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Test HoverCard</h4>
          <p className="text-sm text-muted-foreground">
            This hover card tests both mouse hover and keyboard focus interactions.
          </p>
          <Button size="sm" data-testid="interactive-button" style={{
          backgroundColor: '#0ec2bc',
          color: 'white'
        }}>
            Interactive Button
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // Get trigger element
    const trigger = canvas.getByTestId('hover-trigger');

    // Hover over trigger
    await userEvent.hover(trigger);

    // Wait for hover delay and animation
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Content should be visible in the document body
    const body = within(document.body);
    const content = body.getByTestId('hover-content');
    await expect(content).toBeInTheDocument();

    // Test keyboard navigation - trigger should be focusable
    await userEvent.tab();
    await expect(trigger).toHaveFocus();

    // Unhover to close
    await userEvent.unhover(trigger);

    // Wait for close delay and animation
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}`,...(Xe=(Ke=_.parameters)==null?void 0:Ke.docs)==null?void 0:Xe.source},description:{story:`Interactive test with play function.

Tests hover card interactions using Storybook play function.
Validates keyboard and mouse interactions.`,...(Ye=(Qe=_.parameters)==null?void 0:Qe.docs)==null?void 0:Ye.description}}};const Qs=["Default","LinkPreview","WithAvatarAndDetails","MultipleHoverCards","ControlledState","CustomPositioning","CustomTiming","ProductCard","InteractiveContent","RepositoryPreview","OzeanLichtThemed","InteractiveTest"];export{k as ControlledState,T as CustomPositioning,S as CustomTiming,y as Default,P as InteractiveContent,_ as InteractiveTest,j as LinkPreview,H as MultipleHoverCards,R as OzeanLichtThemed,B as ProductCard,A as RepositoryPreview,w as WithAvatarAndDetails,Qs as __namedExportsOrder,Xs as default};
