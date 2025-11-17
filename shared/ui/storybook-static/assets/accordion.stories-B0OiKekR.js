import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{R as d,r as M}from"./index-B2-qRKKC.js";import{c as ge,a as Ae,P as Z}from"./index-BiUY2kQP.js";import{c as xe}from"./index-Da_aXk3M.js";import{u as ve}from"./index-BFjtS4uE.js";import{u as ee}from"./index-BlCrtW8-.js";import{c as oe,R as Ce,T as ye,C as be}from"./index-D6ToYEMl.js";import{u as we}from"./index-CpxwHbl5.js";import{u as _e}from"./index-D6fdIYSQ.js";import{c as V}from"./cn-CKXzwFwe.js";import{C as je}from"./chevron-down-CVm-VZQY.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-kS-9iBlu.js";import"./index-D1vk04JX.js";import"./index-PNzqWif7.js";import"./clsx-B-dksMZM.js";import"./createLucideIcon-BbF4D6Jl.js";var u="Accordion",Ie=["Home","End","ArrowDown","ArrowUp","ArrowLeft","ArrowRight"],[z,Ne,Te]=xe(u),[I]=ge(u,[Te,oe]),H=oe(),ne=d.forwardRef((o,t)=>{const{type:n,...c}=o,i=c,r=c;return e.jsx(z.Provider,{scope:o.__scopeAccordion,children:n==="multiple"?e.jsx(Pe,{...r,ref:t}):e.jsx(Ee,{...i,ref:t})})});ne.displayName=u;var[re,Re]=I(u),[ce,Se]=I(u,{collapsible:!1}),Ee=d.forwardRef((o,t)=>{const{value:n,defaultValue:c,onValueChange:i=()=>{},collapsible:r=!1,...s}=o,[a,f]=ee({prop:n,defaultProp:c??"",onChange:i,caller:u});return e.jsx(re,{scope:o.__scopeAccordion,value:d.useMemo(()=>a?[a]:[],[a]),onItemOpen:f,onItemClose:d.useCallback(()=>r&&f(""),[r,f]),children:e.jsx(ce,{scope:o.__scopeAccordion,collapsible:r,children:e.jsx(te,{...s,ref:t})})})}),Pe=d.forwardRef((o,t)=>{const{value:n,defaultValue:c,onValueChange:i=()=>{},...r}=o,[s,a]=ee({prop:n,defaultProp:c??[],onChange:i,caller:u}),f=d.useCallback(x=>a((g=[])=>[...g,x]),[a]),A=d.useCallback(x=>a((g=[])=>g.filter(T=>T!==x)),[a]);return e.jsx(re,{scope:o.__scopeAccordion,value:s,onItemOpen:f,onItemClose:A,children:e.jsx(ce,{scope:o.__scopeAccordion,collapsible:!0,children:e.jsx(te,{...r,ref:t})})})}),[ke,N]=I(u),te=d.forwardRef((o,t)=>{const{__scopeAccordion:n,disabled:c,dir:i,orientation:r="vertical",...s}=o,a=d.useRef(null),f=ve(a,t),A=Ne(n),g=_e(i)==="ltr",T=Ae(o.onKeyDown,C=>{var K;if(!Ie.includes(C.key))return;const fe=C.target,R=A().filter(D=>{var W;return!((W=D.ref.current)!=null&&W.disabled)}),y=R.findIndex(D=>D.ref.current===fe),G=R.length;if(y===-1)return;C.preventDefault();let h=y;const S=0,E=G-1,P=()=>{h=y+1,h>E&&(h=S)},k=()=>{h=y-1,h<S&&(h=E)};switch(C.key){case"Home":h=S;break;case"End":h=E;break;case"ArrowRight":r==="horizontal"&&(g?P():k());break;case"ArrowDown":r==="vertical"&&P();break;case"ArrowLeft":r==="horizontal"&&(g?k():P());break;case"ArrowUp":r==="vertical"&&k();break}const he=h%G;(K=R[he].ref.current)==null||K.focus()});return e.jsx(ke,{scope:n,disabled:c,direction:i,orientation:r,children:e.jsx(z.Slot,{scope:n,children:e.jsx(Z.div,{...s,"data-orientation":r,ref:f,onKeyDown:c?void 0:T})})})}),j="AccordionItem",[De,L]=I(j),ie=d.forwardRef((o,t)=>{const{__scopeAccordion:n,value:c,...i}=o,r=N(j,n),s=Re(j,n),a=H(n),f=we(),A=c&&s.value.includes(c)||!1,x=r.disabled||o.disabled;return e.jsx(De,{scope:n,open:A,disabled:x,triggerId:f,children:e.jsx(Ce,{"data-orientation":r.orientation,"data-state":me(A),...a,...i,ref:t,disabled:x,open:A,onOpenChange:g=>{g?s.onItemOpen(c):s.onItemClose(c)}})})});ie.displayName=j;var ae="AccordionHeader",Oe=d.forwardRef((o,t)=>{const{__scopeAccordion:n,...c}=o,i=N(u,n),r=L(ae,n);return e.jsx(Z.h3,{"data-orientation":i.orientation,"data-state":me(r.open),"data-disabled":r.disabled?"":void 0,...c,ref:t})});Oe.displayName=ae;var O="AccordionTrigger",se=d.forwardRef((o,t)=>{const{__scopeAccordion:n,...c}=o,i=N(u,n),r=L(O,n),s=Se(O,n),a=H(n);return e.jsx(z.ItemSlot,{scope:n,children:e.jsx(ye,{"aria-disabled":r.open&&!s.collapsible||void 0,"data-orientation":i.orientation,id:r.triggerId,...a,...c,ref:t})})});se.displayName=O;var de="AccordionContent",le=d.forwardRef((o,t)=>{const{__scopeAccordion:n,...c}=o,i=N(u,n),r=L(de,n),s=H(n);return e.jsx(be,{role:"region","aria-labelledby":r.triggerId,"data-orientation":i.orientation,...s,...c,ref:t,style:{"--radix-accordion-content-height":"var(--radix-collapsible-content-height)","--radix-accordion-content-width":"var(--radix-collapsible-content-width)",...o.style}})});le.displayName=de;function me(o){return o?"open":"closed"}var Me=ne,Ve=ie,pe=se,ue=le;const v=Me,l=M.forwardRef(({className:o,...t},n)=>e.jsx(Ve,{ref:n,className:V("border-b",o),...t}));l.displayName="AccordionItem";const m=M.forwardRef(({className:o,children:t,...n},c)=>e.jsxs(pe,{ref:c,className:V("flex flex-1 items-center justify-between py-4 font-normal text-base transition-all [&[data-state=open]>svg]:rotate-180",o),...n,children:[t,e.jsx(je,{className:"h-4 w-4 shrink-0 transition-transform duration-200"})]}));m.displayName=pe.displayName;const p=M.forwardRef(({className:o,children:t,...n},c)=>e.jsx(ue,{ref:c,className:"overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",...n,children:e.jsx("div",{className:V("pb-4 pt-0",o),children:t})}));p.displayName=ue.displayName;try{v.displayName="Accordion",v.__docgenInfo={description:"",displayName:"Accordion",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{l.displayName="AccordionItem",l.__docgenInfo={description:"",displayName:"AccordionItem",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{m.displayName="AccordionTrigger",m.__docgenInfo={description:"",displayName:"AccordionTrigger",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{p.displayName="AccordionContent",p.__docgenInfo={description:"",displayName:"AccordionContent",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}const oo={title:"Tier 1 Primitives/shadcn/Accordion",component:v,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{type:{control:"radio",options:["single","multiple"],description:"Type of accordion (single item open or multiple)"}}},b={render:o=>e.jsx("div",{className:"w-full max-w-md",children:e.jsxs(v,{...o,type:"single",collapsible:!0,children:[e.jsxs(l,{value:"item-1",children:[e.jsx(m,{children:"What is Ozean Licht?"}),e.jsx(p,{children:"Ozean Licht is a content platform offering courses and community features with a cosmic oceanic design theme."})]}),e.jsxs(l,{value:"item-2",children:[e.jsx(m,{children:"What is Kids Ascension?"}),e.jsx(p,{children:"Kids Ascension is a 100% free educational platform for children ages 6-14, providing interactive learning experiences."})]}),e.jsxs(l,{value:"item-3",children:[e.jsx(m,{children:"How does the admin dashboard work?"}),e.jsx(p,{children:"The admin dashboard provides multi-tenant management, role-based access control, and comprehensive analytics for both platforms."})]})]})})},w={render:()=>e.jsx("div",{className:"w-full max-w-md",children:e.jsxs(v,{type:"multiple",children:[e.jsxs(l,{value:"item-1",children:[e.jsx(m,{children:"Design System"}),e.jsx(p,{children:"Ozean Licht Design System features oceanic cyan (#0EA6C1), deep ocean backgrounds, and glass morphism effects."})]}),e.jsxs(l,{value:"item-2",children:[e.jsx(m,{children:"Technologies"}),e.jsx(p,{children:"Built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, and deployed via Coolify on Hetzner infrastructure."})]}),e.jsxs(l,{value:"item-3",children:[e.jsx(m,{children:"Authentication"}),e.jsx(p,{children:"NextAuth with JWT tokens, role-based permissions, and multi-tenant access control via entity scoping."})]})]})})},_={render:()=>e.jsx("div",{className:"w-full max-w-md",children:e.jsxs(v,{type:"single",collapsible:!0,className:"glass-card p-4",children:[e.jsxs(l,{value:"item-1",className:"border-primary/25",children:[e.jsx(m,{className:"hover:text-primary",children:"Glass Morphism"}),e.jsx(p,{children:"This accordion demonstrates the glass-card effect with backdrop blur and subtle borders."})]}),e.jsxs(l,{value:"item-2",className:"border-primary/25",children:[e.jsx(m,{className:"hover:text-primary",children:"Glow Effects"}),e.jsx(p,{children:"Components can include glow effects on hover for enhanced cosmic aesthetics."})]})]})})};var q,$,B;b.parameters={...b.parameters,docs:{...(q=b.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: args => <div className="w-full max-w-md">
      <Accordion {...args} type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>What is Ozean Licht?</AccordionTrigger>
          <AccordionContent>
            Ozean Licht is a content platform offering courses and community features
            with a cosmic oceanic design theme.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>What is Kids Ascension?</AccordionTrigger>
          <AccordionContent>
            Kids Ascension is a 100% free educational platform for children ages 6-14,
            providing interactive learning experiences.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>How does the admin dashboard work?</AccordionTrigger>
          <AccordionContent>
            The admin dashboard provides multi-tenant management, role-based access
            control, and comprehensive analytics for both platforms.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
}`,...(B=($=b.parameters)==null?void 0:$.docs)==null?void 0:B.source}}};var J,U,Y;w.parameters={...w.parameters,docs:{...(J=w.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => <div className="w-full max-w-md">
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>Design System</AccordionTrigger>
          <AccordionContent>
            Ozean Licht Design System features oceanic cyan (#0EA6C1), deep ocean
            backgrounds, and glass morphism effects.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Technologies</AccordionTrigger>
          <AccordionContent>
            Built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, and deployed
            via Coolify on Hetzner infrastructure.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Authentication</AccordionTrigger>
          <AccordionContent>
            NextAuth with JWT tokens, role-based permissions, and multi-tenant
            access control via entity scoping.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
}`,...(Y=(U=w.parameters)==null?void 0:U.docs)==null?void 0:Y.source}}};var F,Q,X;_.parameters={..._.parameters,docs:{...(F=_.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <div className="w-full max-w-md">
      <Accordion type="single" collapsible className="glass-card p-4">
        <AccordionItem value="item-1" className="border-primary/25">
          <AccordionTrigger className="hover:text-primary">
            Glass Morphism
          </AccordionTrigger>
          <AccordionContent>
            This accordion demonstrates the glass-card effect with backdrop blur
            and subtle borders.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" className="border-primary/25">
          <AccordionTrigger className="hover:text-primary">
            Glow Effects
          </AccordionTrigger>
          <AccordionContent>
            Components can include glow effects on hover for enhanced cosmic aesthetics.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
}`,...(X=(Q=_.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};const no=["Default","Multiple","WithGlassEffect"];export{b as Default,w as Multiple,_ as WithGlassEffect,no as __namedExportsOrder,oo as default};
