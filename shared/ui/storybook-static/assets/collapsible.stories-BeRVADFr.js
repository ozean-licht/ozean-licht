import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{w as Ae,u as T}from"./index-CJu6nLMj.js";import{r as u}from"./index-B2-qRKKC.js";import{R as _e,a as Ee,b as Me}from"./index-DK43Dhyl.js";import{B as t}from"./Button-Clfx5zjS.js";import{C as m}from"./chevron-down-CVm-VZQY.js";import{C as We}from"./circle-question-mark-zmzNVHl7.js";import{P as Re}from"./plus-CM_6FUG5.js";import{F as ze}from"./funnel-B_2SqD__.js";import{C as O}from"./chevron-right-CK3AtDi5.js";import{S as Ue}from"./settings-DfwhJ3T1.js";import{M as Le}from"./menu-pXUB4QSR.js";import{c as Qe}from"./createLucideIcon-BbF4D6Jl.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-D4_CVXg7.js";import"./index-kS-9iBlu.js";import"./index-BFjtS4uE.js";import"./index-BlCrtW8-.js";import"./index-D1vk04JX.js";import"./index-PNzqWif7.js";import"./index-CpxwHbl5.js";import"./index-DVF2XGCm.js";import"./cn-CytzSlOG.js";import"./button-C8qtCU0L.js";import"./index-BiMR7eR1.js";/**
 * @license lucide-react v0.553.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ye=[["path",{d:"M5 12h14",key:"1ays0h"}]],He=Qe("minus",Ye),l=_e,r=Ee,c=Me;try{l.displayName="Collapsible",l.__docgenInfo={description:"",displayName:"Collapsible",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{r.displayName="CollapsibleTrigger",r.__docgenInfo={description:"",displayName:"CollapsibleTrigger",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{c.displayName="CollapsibleContent",c.__docgenInfo={description:"",displayName:"CollapsibleContent",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}const fs={title:"Tier 1: Primitives/shadcn/Collapsible",component:l,parameters:{layout:"centered",docs:{description:{component:"An interactive component which expands/collapses content. Built on Radix UI Collapsible primitive."}}},tags:["autodocs"]},h={render:()=>e.jsxs(l,{className:"w-[350px] space-y-2",children:[e.jsx(r,{asChild:!0,children:e.jsxs(t,{variant:"outline",className:"w-full justify-between",children:["Can I use this in my project?",e.jsx(m,{className:"h-4 w-4"})]})}),e.jsx(c,{className:"space-y-2",children:e.jsx("div",{className:"rounded-md border px-4 py-3 text-sm",children:"Yes! This component is built on Radix UI primitives and is free to use in your projects."})})]})},b={render:()=>{const o=()=>{const[s,d]=u.useState(!1);return e.jsxs(l,{open:s,onOpenChange:d,className:"w-[350px] space-y-2",children:[e.jsx(r,{asChild:!0,children:e.jsxs(t,{variant:"outline",className:"w-full justify-between",children:["How does it work?",e.jsx(m,{className:`h-4 w-4 transition-transform duration-200 ${s?"rotate-180":""}`})]})}),e.jsx(c,{className:"space-y-2",children:e.jsx("div",{className:"rounded-md border px-4 py-3 text-sm",children:"The Collapsible component uses Radix UI primitives to manage state and accessibility. When clicked, the trigger toggles the visibility of the content with smooth animations."})})]})};return e.jsx(o,{})}},g={render:()=>{const o=()=>{const[s,d]=u.useState(!1);return e.jsxs("div",{className:"w-[350px] space-y-4",children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsx(t,{onClick:()=>d(!0),size:"sm",children:"Expand"}),e.jsx(t,{onClick:()=>d(!1),variant:"outline",size:"sm",children:"Collapse"}),e.jsx(t,{onClick:()=>d(!s),variant:"outline",size:"sm",children:"Toggle"})]}),e.jsxs("p",{className:"text-sm text-muted-foreground",children:["State: ",s?"Open":"Closed"]}),e.jsxs(l,{open:s,onOpenChange:d,className:"space-y-2",children:[e.jsx(r,{asChild:!0,children:e.jsxs(t,{variant:"outline",className:"w-full justify-between",children:["Controlled Collapsible",e.jsx(m,{className:`h-4 w-4 transition-transform duration-200 ${s?"rotate-180":""}`})]})}),e.jsx(c,{className:"space-y-2",children:e.jsx("div",{className:"rounded-md border px-4 py-3 text-sm",children:"This collapsible's state is controlled externally. You can programmatically open, close, or toggle it using the buttons above."})})]})]})};return e.jsx(o,{})}},x={render:()=>{const o=()=>{const[s,d]=u.useState([]),i=n=>{d(p=>p.includes(n)?p.filter(I=>I!==n):[...p,n])},a=[{id:"section1",question:"What is Radix UI?",answer:"Radix UI is an open-source component library optimized for fast development, easy maintenance, and accessibility."},{id:"section2",question:"How is it different from other libraries?",answer:"Radix UI provides unstyled, accessible components that give you full control over styling while handling complex interactions and accessibility."},{id:"section3",question:"Can I use it with Tailwind CSS?",answer:"Yes! Radix UI components work perfectly with Tailwind CSS. You have complete freedom to style them however you want."}];return e.jsx("div",{className:"w-[350px] space-y-2",children:a.map(n=>{const p=s.includes(n.id);return e.jsxs(l,{open:p,onOpenChange:()=>i(n.id),className:"space-y-2",children:[e.jsx(r,{asChild:!0,children:e.jsxs(t,{variant:"outline",className:"w-full justify-between",children:[n.question,e.jsx(m,{className:`h-4 w-4 transition-transform duration-200 ${p?"rotate-180":""}`})]})}),e.jsx(c,{children:e.jsx("div",{className:"rounded-md border px-4 py-3 text-sm",children:n.answer})})]},n.id)})})};return e.jsx(o,{})}},C={render:()=>{const[o,s]=u.useState(!1);return e.jsxs(l,{open:o,onOpenChange:s,className:"w-[450px] space-y-2",children:[e.jsx(r,{asChild:!0,children:e.jsxs(t,{variant:"outline",className:"w-full justify-between",children:["View Component Documentation",e.jsx(m,{className:`h-4 w-4 transition-transform duration-200 ${o?"rotate-180":""}`})]})}),e.jsx(c,{children:e.jsxs("div",{className:"rounded-md border px-4 py-4 space-y-4 text-sm",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"font-semibold mb-2",children:"Installation"}),e.jsx("code",{className:"bg-gray-100 px-2 py-1 rounded text-xs",children:"npm install @radix-ui/react-collapsible"})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-semibold mb-2",children:"Features"}),e.jsxs("ul",{className:"list-disc list-inside space-y-1 text-muted-foreground",children:[e.jsx("li",{children:"Fully accessible with ARIA attributes"}),e.jsx("li",{children:"Keyboard navigation support"}),e.jsx("li",{children:"Smooth animations"}),e.jsx("li",{children:"Controlled and uncontrolled modes"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-semibold mb-2",children:"API Reference"}),e.jsxs("p",{className:"text-muted-foreground",children:["See the full API documentation at"," ",e.jsx("a",{href:"https://radix-ui.com",className:"text-blue-600 underline",children:"radix-ui.com"})]})]})]})})]})}},f={render:()=>{const o=()=>{const[s,d]=u.useState([0]),i=[{question:"What payment methods do you accept?",answer:"We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers."},{question:"How long does shipping take?",answer:"Standard shipping takes 5-7 business days. Express shipping (2-3 days) and overnight options are available at checkout."},{question:"What is your return policy?",answer:"We offer a 30-day money-back guarantee. Items must be unused and in original packaging. Return shipping is free for defective items."},{question:"Do you offer customer support?",answer:"Yes! Our support team is available 24/7 via email, chat, and phone. Premium customers get priority support with dedicated account managers."}];return e.jsxs("div",{className:"w-[450px] space-y-3",children:[e.jsx("h2",{className:"text-xl font-semibold mb-4",children:"Frequently Asked Questions"}),i.map((a,n)=>{const p=s.includes(n);return e.jsxs(l,{open:p,onOpenChange:I=>d(I?[...s,n]:s.filter(qe=>qe!==n)),className:"space-y-2",children:[e.jsx(r,{asChild:!0,children:e.jsxs(t,{variant:"ghost",className:"w-full justify-between text-left font-normal h-auto py-3 px-4 hover:bg-gray-50",children:[e.jsxs("span",{className:"flex items-center gap-3",children:[e.jsx(We,{className:"h-4 w-4 text-muted-foreground flex-shrink-0"}),e.jsx("span",{className:"font-medium",children:a.question})]}),e.jsx(Re,{className:`h-4 w-4 flex-shrink-0 transition-all duration-200 ${p?"rotate-45":""}`})]})}),e.jsx(c,{children:e.jsx("div",{className:"px-4 py-3 ml-7 text-sm text-muted-foreground bg-gray-50 rounded-md",children:a.answer})})]},n)})]})};return e.jsx(o,{})}},y={render:()=>{const o=()=>{const[s,d]=u.useState(["category","price"]),i=a=>{d(n=>n.includes(a)?n.filter(p=>p!==a):[...n,a])};return e.jsxs("div",{className:"w-[300px] space-y-4 border rounded-lg p-4",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx(ze,{className:"h-4 w-4"}),e.jsx("h3",{className:"font-semibold",children:"Filters"})]}),e.jsxs(l,{open:s.includes("category"),onOpenChange:()=>i("category"),className:"space-y-2",children:[e.jsx(r,{asChild:!0,children:e.jsxs(t,{variant:"ghost",className:"w-full justify-between px-2 h-8 font-normal",children:["Category",e.jsx(O,{className:`h-4 w-4 transition-transform duration-200 ${s.includes("category")?"rotate-90":""}`})]})}),e.jsx(c,{children:e.jsx("div",{className:"px-2 space-y-2",children:["Electronics","Clothing","Books","Home & Garden"].map(a=>e.jsxs("label",{className:"flex items-center gap-2 text-sm cursor-pointer",children:[e.jsx("input",{type:"checkbox",className:"rounded"}),e.jsx("span",{children:a})]},a))})})]}),e.jsxs(l,{open:s.includes("price"),onOpenChange:()=>i("price"),className:"space-y-2",children:[e.jsx(r,{asChild:!0,children:e.jsxs(t,{variant:"ghost",className:"w-full justify-between px-2 h-8 font-normal",children:["Price Range",e.jsx(O,{className:`h-4 w-4 transition-transform duration-200 ${s.includes("price")?"rotate-90":""}`})]})}),e.jsx(c,{children:e.jsx("div",{className:"px-2 space-y-2",children:["Under $25","$25 - $50","$50 - $100","Over $100"].map(a=>e.jsxs("label",{className:"flex items-center gap-2 text-sm cursor-pointer",children:[e.jsx("input",{type:"checkbox",className:"rounded"}),e.jsx("span",{children:a})]},a))})})]}),e.jsxs(l,{open:s.includes("brand"),onOpenChange:()=>i("brand"),className:"space-y-2",children:[e.jsx(r,{asChild:!0,children:e.jsxs(t,{variant:"ghost",className:"w-full justify-between px-2 h-8 font-normal",children:["Brand",e.jsx(O,{className:`h-4 w-4 transition-transform duration-200 ${s.includes("brand")?"rotate-90":""}`})]})}),e.jsx(c,{children:e.jsx("div",{className:"px-2 space-y-2",children:["Apple","Samsung","Sony","LG"].map(a=>e.jsxs("label",{className:"flex items-center gap-2 text-sm cursor-pointer",children:[e.jsx("input",{type:"checkbox",className:"rounded"}),e.jsx("span",{children:a})]},a))})})]})]})};return e.jsx(o,{})}},v={render:()=>{const o=()=>{const[s,d]=u.useState(["settings"]),i=a=>{d(n=>n.includes(a)?n.filter(p=>p!==a):[...n,a])};return e.jsxs("div",{className:"w-[280px] border rounded-lg p-3 space-y-1",children:[e.jsx("div",{className:"px-3 py-2 mb-2",children:e.jsx("h3",{className:"font-semibold text-sm",children:"Dashboard"})}),e.jsxs(l,{open:s.includes("settings"),onOpenChange:()=>i("settings"),children:[e.jsx(r,{asChild:!0,children:e.jsxs(t,{variant:"ghost",className:"w-full justify-between px-3 h-9 font-normal hover:bg-gray-100",children:[e.jsxs("span",{className:"flex items-center gap-2",children:[e.jsx(Ue,{className:"h-4 w-4"}),"Settings"]}),e.jsx(m,{className:`h-4 w-4 transition-transform duration-200 ${s.includes("settings")?"rotate-180":""}`})]})}),e.jsx(c,{children:e.jsxs("div",{className:"ml-6 mt-1 space-y-1",children:[e.jsx(t,{variant:"ghost",className:"w-full justify-start px-3 h-8 text-sm font-normal",children:"General"}),e.jsx(t,{variant:"ghost",className:"w-full justify-start px-3 h-8 text-sm font-normal",children:"Security"}),e.jsx(t,{variant:"ghost",className:"w-full justify-start px-3 h-8 text-sm font-normal",children:"Notifications"}),e.jsx(t,{variant:"ghost",className:"w-full justify-start px-3 h-8 text-sm font-normal",children:"Privacy"})]})})]}),e.jsxs(l,{open:s.includes("content"),onOpenChange:()=>i("content"),children:[e.jsx(r,{asChild:!0,children:e.jsxs(t,{variant:"ghost",className:"w-full justify-between px-3 h-9 font-normal hover:bg-gray-100",children:[e.jsxs("span",{className:"flex items-center gap-2",children:[e.jsx(Le,{className:"h-4 w-4"}),"Content"]}),e.jsx(m,{className:`h-4 w-4 transition-transform duration-200 ${s.includes("content")?"rotate-180":""}`})]})}),e.jsx(c,{children:e.jsxs("div",{className:"ml-6 mt-1 space-y-1",children:[e.jsx(t,{variant:"ghost",className:"w-full justify-start px-3 h-8 text-sm font-normal",children:"Posts"}),e.jsx(t,{variant:"ghost",className:"w-full justify-start px-3 h-8 text-sm font-normal",children:"Pages"}),e.jsx(t,{variant:"ghost",className:"w-full justify-start px-3 h-8 text-sm font-normal",children:"Media"})]})})]})]})};return e.jsx(o,{})}},w={render:()=>e.jsxs("div",{className:"w-[350px] space-y-4",children:[e.jsxs(l,{className:"space-y-2",children:[e.jsx(r,{asChild:!0,children:e.jsxs(t,{variant:"outline",className:"w-full justify-between",children:["Enabled Collapsible",e.jsx(m,{className:"h-4 w-4"})]})}),e.jsx(c,{children:e.jsx("div",{className:"rounded-md border px-4 py-3 text-sm",children:"This collapsible is enabled and can be toggled."})})]}),e.jsxs(l,{disabled:!0,className:"space-y-2",children:[e.jsx(r,{asChild:!0,children:e.jsxs(t,{variant:"outline",className:"w-full justify-between",disabled:!0,children:["Disabled Collapsible",e.jsx(m,{className:"h-4 w-4"})]})}),e.jsx(c,{children:e.jsx("div",{className:"rounded-md border px-4 py-3 text-sm",children:"This content is not accessible because the collapsible is disabled."})})]})]})},N={render:()=>{const o=()=>{const[s,d]=u.useState([]),i=a=>{d(n=>n.includes(a)?n.filter(p=>p!==a):[...n,a])};return e.jsxs("div",{className:"w-[400px] space-y-4",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-semibold mb-2",children:"Plus/Minus Icon"}),e.jsxs(l,{open:s.includes("plus-minus"),onOpenChange:()=>i("plus-minus"),className:"space-y-2",children:[e.jsx(r,{asChild:!0,children:e.jsxs(t,{variant:"outline",className:"w-full justify-between",children:["Toggle Content",s.includes("plus-minus")?e.jsx(He,{className:"h-4 w-4"}):e.jsx(Re,{className:"h-4 w-4"})]})}),e.jsx(c,{children:e.jsx("div",{className:"rounded-md border px-4 py-3 text-sm",children:"Content with plus/minus icon indicator."})})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-semibold mb-2",children:"Rotating Chevron"}),e.jsxs(l,{open:s.includes("rotating"),onOpenChange:()=>i("rotating"),className:"space-y-2",children:[e.jsx(r,{asChild:!0,children:e.jsxs(t,{variant:"outline",className:"w-full justify-between",children:["Toggle Content",e.jsx(m,{className:`h-4 w-4 transition-transform duration-200 ${s.includes("rotating")?"rotate-180":""}`})]})}),e.jsx(c,{children:e.jsx("div",{className:"rounded-md border px-4 py-3 text-sm",children:"Content with rotating chevron down icon."})})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-semibold mb-2",children:"Chevron Right to Down"}),e.jsxs(l,{open:s.includes("chevron-right"),onOpenChange:()=>i("chevron-right"),className:"space-y-2",children:[e.jsx(r,{asChild:!0,children:e.jsxs(t,{variant:"outline",className:"w-full justify-between",children:["Toggle Content",e.jsx(O,{className:`h-4 w-4 transition-transform duration-200 ${s.includes("chevron-right")?"rotate-90":""}`})]})}),e.jsx(c,{children:e.jsx("div",{className:"rounded-md border px-4 py-3 text-sm",children:"Content with chevron right that rotates to down."})})]})]})]})};return e.jsx(o,{})}},j={render:()=>{const o=()=>{const[s,d]=u.useState(["features"]),i=a=>{d(n=>n.includes(a)?n.filter(p=>p!==a):[...n,a])};return e.jsxs("div",{className:"w-[400px] space-y-3",children:[e.jsx("h2",{className:"text-xl font-semibold mb-4",style:{color:"#0ec2bc"},children:"Ozean Licht Platform"}),e.jsxs(l,{open:s.includes("features"),onOpenChange:()=>i("features"),className:"space-y-2",children:[e.jsx(r,{asChild:!0,children:e.jsxs(t,{variant:"outline",className:"w-full justify-between",style:{borderColor:"#0ec2bc",color:s.includes("features")?"#0ec2bc":void 0},children:["Platform Features",e.jsx(m,{className:`h-4 w-4 transition-transform duration-200 ${s.includes("features")?"rotate-180":""}`,style:{color:"#0ec2bc"}})]})}),e.jsx(c,{children:e.jsx("div",{className:"rounded-md border px-4 py-3 text-sm",style:{borderColor:"#0ec2bc20",backgroundColor:"#0ec2bc10"},children:e.jsxs("ul",{className:"space-y-2",children:[e.jsx("li",{style:{color:"#0ec2bc"},children:"✓ Content Management"}),e.jsx("li",{style:{color:"#0ec2bc"},children:"✓ Educational Resources"}),e.jsx("li",{style:{color:"#0ec2bc"},children:"✓ Community Features"})]})})})]}),e.jsxs(l,{open:s.includes("pricing"),onOpenChange:()=>i("pricing"),className:"space-y-2",children:[e.jsx(r,{asChild:!0,children:e.jsxs(t,{variant:"outline",className:"w-full justify-between",style:{borderColor:"#0ec2bc",color:s.includes("pricing")?"#0ec2bc":void 0},children:["Pricing Options",e.jsx(m,{className:`h-4 w-4 transition-transform duration-200 ${s.includes("pricing")?"rotate-180":""}`,style:{color:"#0ec2bc"}})]})}),e.jsx(c,{children:e.jsx("div",{className:"rounded-md border px-4 py-3 text-sm",style:{borderColor:"#0ec2bc20",backgroundColor:"#0ec2bc10"},children:e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{children:[e.jsx("strong",{style:{color:"#0ec2bc"},children:"Free Tier:"})," Basic features"]}),e.jsxs("div",{children:[e.jsx("strong",{style:{color:"#0ec2bc"},children:"Pro Tier:"})," Advanced features"]}),e.jsxs("div",{children:[e.jsx("strong",{style:{color:"#0ec2bc"},children:"Enterprise:"})," Custom solutions"]})]})})})]}),e.jsxs(l,{open:s.includes("support"),onOpenChange:()=>i("support"),className:"space-y-2",children:[e.jsx(r,{asChild:!0,children:e.jsxs(t,{variant:"outline",className:"w-full justify-between",style:{borderColor:"#0ec2bc",color:s.includes("support")?"#0ec2bc":void 0},children:["Support & Resources",e.jsx(m,{className:`h-4 w-4 transition-transform duration-200 ${s.includes("support")?"rotate-180":""}`,style:{color:"#0ec2bc"}})]})}),e.jsx(c,{children:e.jsxs("div",{className:"rounded-md border px-4 py-3 text-sm",style:{borderColor:"#0ec2bc20",backgroundColor:"#0ec2bc10"},children:[e.jsx("p",{children:"Contact our support team 24/7 for assistance with any platform features or questions about your account."}),e.jsx(t,{className:"mt-3 w-full",style:{backgroundColor:"#0ec2bc",color:"white"},children:"Contact Support"})]})})]})]})};return e.jsx(o,{})}},S={render:()=>e.jsxs(l,{className:"w-[350px] space-y-2",children:[e.jsx(r,{asChild:!0,children:e.jsxs(t,{variant:"outline",className:"w-full justify-between","data-testid":"collapsible-trigger",children:["Toggle Test Content",e.jsx(m,{className:"h-4 w-4","data-testid":"chevron-icon"})]})}),e.jsx(c,{"data-testid":"collapsible-content",children:e.jsx("div",{className:"rounded-md border px-4 py-3 text-sm",children:"This is the collapsible content that should appear when opened."})})]}),play:async({canvasElement:o})=>{const s=Ae(o);s.queryByTestId("collapsible-content");const d=s.getByTestId("collapsible-trigger");await T.click(d),await new Promise(i=>setTimeout(i,300)),await T.click(d),await new Promise(i=>setTimeout(i,300))}};var B,k,D,F,$;h.parameters={...h.parameters,docs:{...(B=h.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: () => <Collapsible className="w-[350px] space-y-2">
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          Can I use this in my project?
          <ChevronDown className="h-4 w-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-3 text-sm">
          Yes! This component is built on Radix UI primitives and is free to use in
          your projects.
        </div>
      </CollapsibleContent>
    </Collapsible>
}`,...(D=(k=h.parameters)==null?void 0:k.docs)==null?void 0:D.source},description:{story:`Default collapsible with simple text content.

The most basic collapsible implementation showing essential structure.`,...($=(F=h.parameters)==null?void 0:F.docs)==null?void 0:$.description}}};var P,R,q,A,_;b.parameters={...b.parameters,docs:{...(P=b.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => {
    const CollapsibleWithIcon = () => {
      const [isOpen, setIsOpen] = useState(false);
      return <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-[350px] space-y-2">
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              How does it work?
              <ChevronDown className={\`h-4 w-4 transition-transform duration-200 \${isOpen ? 'rotate-180' : ''}\`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            <div className="rounded-md border px-4 py-3 text-sm">
              The Collapsible component uses Radix UI primitives to manage state and
              accessibility. When clicked, the trigger toggles the visibility of the
              content with smooth animations.
            </div>
          </CollapsibleContent>
        </Collapsible>;
    };
    return <CollapsibleWithIcon />;
  }
}`,...(q=(R=b.parameters)==null?void 0:R.docs)==null?void 0:q.source},description:{story:`Collapsible with rotating chevron icon.

Shows animated icon rotation based on open/closed state.`,...(_=(A=b.parameters)==null?void 0:A.docs)==null?void 0:_.description}}};var E,M,W,z,U;g.parameters={...g.parameters,docs:{...(E=g.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => {
    const ControlledCollapsible = () => {
      const [isOpen, setIsOpen] = useState(false);
      return <div className="w-[350px] space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => setIsOpen(true)} size="sm">
              Expand
            </Button>
            <Button onClick={() => setIsOpen(false)} variant="outline" size="sm">
              Collapse
            </Button>
            <Button onClick={() => setIsOpen(!isOpen)} variant="outline" size="sm">
              Toggle
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            State: {isOpen ? 'Open' : 'Closed'}
          </p>
          <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                Controlled Collapsible
                <ChevronDown className={\`h-4 w-4 transition-transform duration-200 \${isOpen ? 'rotate-180' : ''}\`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <div className="rounded-md border px-4 py-3 text-sm">
                This collapsible's state is controlled externally. You can programmatically
                open, close, or toggle it using the buttons above.
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>;
    };
    return <ControlledCollapsible />;
  }
}`,...(W=(M=g.parameters)==null?void 0:M.docs)==null?void 0:W.source},description:{story:`Controlled state example.

Demonstrates controlling the collapsible state programmatically.`,...(U=(z=g.parameters)==null?void 0:z.docs)==null?void 0:U.description}}};var L,Q,Y,H,V;x.parameters={...x.parameters,docs:{...(L=x.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: () => {
    const MultipleCollapsiblesDemo = () => {
      const [openSections, setOpenSections] = useState<string[]>([]);
      const toggleSection = (section: string) => {
        setOpenSections(prev => prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]);
      };
      const sections = [{
        id: 'section1',
        question: 'What is Radix UI?',
        answer: 'Radix UI is an open-source component library optimized for fast development, easy maintenance, and accessibility.'
      }, {
        id: 'section2',
        question: 'How is it different from other libraries?',
        answer: 'Radix UI provides unstyled, accessible components that give you full control over styling while handling complex interactions and accessibility.'
      }, {
        id: 'section3',
        question: 'Can I use it with Tailwind CSS?',
        answer: 'Yes! Radix UI components work perfectly with Tailwind CSS. You have complete freedom to style them however you want.'
      }];
      return <div className="w-[350px] space-y-2">
          {sections.map(section => {
          const isOpen = openSections.includes(section.id);
          return <Collapsible key={section.id} open={isOpen} onOpenChange={() => toggleSection(section.id)} className="space-y-2">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {section.question}
                    <ChevronDown className={\`h-4 w-4 transition-transform duration-200 \${isOpen ? 'rotate-180' : ''}\`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="rounded-md border px-4 py-3 text-sm">
                    {section.answer}
                  </div>
                </CollapsibleContent>
              </Collapsible>;
        })}
        </div>;
    };
    return <MultipleCollapsiblesDemo />;
  }
}`,...(Y=(Q=x.parameters)==null?void 0:Q.docs)==null?void 0:Y.source},description:{story:`Multiple collapsibles (accordion-like behavior).

Shows multiple independent collapsible sections or mutually exclusive ones.`,...(V=(H=x.parameters)==null?void 0:H.docs)==null?void 0:V.description}}};var G,K,J,X,Z;C.parameters={...C.parameters,docs:{...(G=C.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-[450px] space-y-2">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            View Component Documentation
            <ChevronDown className={\`h-4 w-4 transition-transform duration-200 \${isOpen ? 'rotate-180' : ''}\`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="rounded-md border px-4 py-4 space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Installation</h3>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                npm install @radix-ui/react-collapsible
              </code>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Features</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Fully accessible with ARIA attributes</li>
                <li>Keyboard navigation support</li>
                <li>Smooth animations</li>
                <li>Controlled and uncontrolled modes</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">API Reference</h3>
              <p className="text-muted-foreground">
                See the full API documentation at{' '}
                <a href="https://radix-ui.com" className="text-blue-600 underline">
                  radix-ui.com
                </a>
              </p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>;
  }
}`,...(J=(K=C.parameters)==null?void 0:K.docs)==null?void 0:J.source},description:{story:`Nested content with rich formatting.

Demonstrates collapsible with complex nested content.`,...(Z=(X=C.parameters)==null?void 0:X.docs)==null?void 0:Z.description}}};var ee,se,te,ne,ae;f.parameters={...f.parameters,docs:{...(ee=f.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: () => {
    const FAQDemo = () => {
      const [openItems, setOpenItems] = useState<number[]>([0]);
      const faqs = [{
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers.'
      }, {
        question: 'How long does shipping take?',
        answer: 'Standard shipping takes 5-7 business days. Express shipping (2-3 days) and overnight options are available at checkout.'
      }, {
        question: 'What is your return policy?',
        answer: 'We offer a 30-day money-back guarantee. Items must be unused and in original packaging. Return shipping is free for defective items.'
      }, {
        question: 'Do you offer customer support?',
        answer: 'Yes! Our support team is available 24/7 via email, chat, and phone. Premium customers get priority support with dedicated account managers.'
      }];
      return <div className="w-[450px] space-y-3">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          {faqs.map((faq, index) => {
          const isOpen = openItems.includes(index);
          return <Collapsible key={index} open={isOpen} onOpenChange={open => setOpenItems(open ? [...openItems, index] : openItems.filter(i => i !== index))} className="space-y-2">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between text-left font-normal h-auto py-3 px-4 hover:bg-gray-50">
                    <span className="flex items-center gap-3">
                      <HelpCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="font-medium">{faq.question}</span>
                    </span>
                    <Plus className={\`h-4 w-4 flex-shrink-0 transition-all duration-200 \${isOpen ? 'rotate-45' : ''}\`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 py-3 ml-7 text-sm text-muted-foreground bg-gray-50 rounded-md">
                    {faq.answer}
                  </div>
                </CollapsibleContent>
              </Collapsible>;
        })}
        </div>;
    };
    return <FAQDemo />;
  }
}`,...(te=(se=f.parameters)==null?void 0:se.docs)==null?void 0:te.source},description:{story:`FAQ example with help circle icons.

Common FAQ pattern with question/answer format.`,...(ae=(ne=f.parameters)==null?void 0:ne.docs)==null?void 0:ae.description}}};var oe,le,ie,re,ce;y.parameters={...y.parameters,docs:{...(oe=y.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  render: () => {
    const FilterDemo = () => {
      const [openFilters, setOpenFilters] = useState<string[]>(['category', 'price']);
      const toggleFilter = (filter: string) => {
        setOpenFilters(prev => prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]);
      };
      return <div className="w-[300px] space-y-4 border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="h-4 w-4" />
            <h3 className="font-semibold">Filters</h3>
          </div>

          <Collapsible open={openFilters.includes('category')} onOpenChange={() => toggleFilter('category')} className="space-y-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between px-2 h-8 font-normal">
                Category
                <ChevronRight className={\`h-4 w-4 transition-transform duration-200 \${openFilters.includes('category') ? 'rotate-90' : ''}\`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-2 space-y-2">
                {['Electronics', 'Clothing', 'Books', 'Home & Garden'].map(cat => <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>{cat}</span>
                  </label>)}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={openFilters.includes('price')} onOpenChange={() => toggleFilter('price')} className="space-y-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between px-2 h-8 font-normal">
                Price Range
                <ChevronRight className={\`h-4 w-4 transition-transform duration-200 \${openFilters.includes('price') ? 'rotate-90' : ''}\`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-2 space-y-2">
                {['Under $25', '$25 - $50', '$50 - $100', 'Over $100'].map(range => <label key={range} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>{range}</span>
                  </label>)}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={openFilters.includes('brand')} onOpenChange={() => toggleFilter('brand')} className="space-y-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between px-2 h-8 font-normal">
                Brand
                <ChevronRight className={\`h-4 w-4 transition-transform duration-200 \${openFilters.includes('brand') ? 'rotate-90' : ''}\`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-2 space-y-2">
                {['Apple', 'Samsung', 'Sony', 'LG'].map(brand => <label key={brand} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>{brand}</span>
                  </label>)}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>;
    };
    return <FilterDemo />;
  }
}`,...(ie=(le=y.parameters)==null?void 0:le.docs)==null?void 0:ie.source},description:{story:`Filter section for sidebars.

Shows collapsible filter groups commonly used in e-commerce or data apps.`,...(ce=(re=y.parameters)==null?void 0:re.docs)==null?void 0:ce.description}}};var de,pe,me,ue,he;v.parameters={...v.parameters,docs:{...(de=v.parameters)==null?void 0:de.docs,source:{originalSource:`{
  render: () => {
    const SidebarDemo = () => {
      const [openSections, setOpenSections] = useState<string[]>(['settings']);
      const toggleSection = (section: string) => {
        setOpenSections(prev => prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]);
      };
      return <div className="w-[280px] border rounded-lg p-3 space-y-1">
          <div className="px-3 py-2 mb-2">
            <h3 className="font-semibold text-sm">Dashboard</h3>
          </div>

          <Collapsible open={openSections.includes('settings')} onOpenChange={() => toggleSection('settings')}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between px-3 h-9 font-normal hover:bg-gray-100">
                <span className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </span>
                <ChevronDown className={\`h-4 w-4 transition-transform duration-200 \${openSections.includes('settings') ? 'rotate-180' : ''}\`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="ml-6 mt-1 space-y-1">
                <Button variant="ghost" className="w-full justify-start px-3 h-8 text-sm font-normal">
                  General
                </Button>
                <Button variant="ghost" className="w-full justify-start px-3 h-8 text-sm font-normal">
                  Security
                </Button>
                <Button variant="ghost" className="w-full justify-start px-3 h-8 text-sm font-normal">
                  Notifications
                </Button>
                <Button variant="ghost" className="w-full justify-start px-3 h-8 text-sm font-normal">
                  Privacy
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={openSections.includes('content')} onOpenChange={() => toggleSection('content')}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between px-3 h-9 font-normal hover:bg-gray-100">
                <span className="flex items-center gap-2">
                  <Menu className="h-4 w-4" />
                  Content
                </span>
                <ChevronDown className={\`h-4 w-4 transition-transform duration-200 \${openSections.includes('content') ? 'rotate-180' : ''}\`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="ml-6 mt-1 space-y-1">
                <Button variant="ghost" className="w-full justify-start px-3 h-8 text-sm font-normal">
                  Posts
                </Button>
                <Button variant="ghost" className="w-full justify-start px-3 h-8 text-sm font-normal">
                  Pages
                </Button>
                <Button variant="ghost" className="w-full justify-start px-3 h-8 text-sm font-normal">
                  Media
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>;
    };
    return <SidebarDemo />;
  }
}`,...(me=(pe=v.parameters)==null?void 0:pe.docs)==null?void 0:me.source},description:{story:`Sidebar navigation section.

Demonstrates collapsible navigation groups for app sidebars.`,...(he=(ue=v.parameters)==null?void 0:ue.docs)==null?void 0:he.description}}};var be,ge,xe,Ce,fe;w.parameters={...w.parameters,docs:{...(be=w.parameters)==null?void 0:be.docs,source:{originalSource:`{
  render: () => <div className="w-[350px] space-y-4">
      <Collapsible className="space-y-2">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            Enabled Collapsible
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="rounded-md border px-4 py-3 text-sm">
            This collapsible is enabled and can be toggled.
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible disabled className="space-y-2">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between" disabled>
            Disabled Collapsible
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="rounded-md border px-4 py-3 text-sm">
            This content is not accessible because the collapsible is disabled.
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
}`,...(xe=(ge=w.parameters)==null?void 0:ge.docs)==null?void 0:xe.source},description:{story:`Disabled state example.

Shows how to disable collapsible interaction.`,...(fe=(Ce=w.parameters)==null?void 0:Ce.docs)==null?void 0:fe.description}}};var ye,ve,we,Ne,je;N.parameters={...N.parameters,docs:{...(ye=N.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  render: () => {
    const AnimationDemoComponent = () => {
      const [openItems, setOpenItems] = useState<string[]>([]);
      const toggleItem = (item: string) => {
        setOpenItems(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
      };
      return <div className="w-[400px] space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">Plus/Minus Icon</h3>
            <Collapsible open={openItems.includes('plus-minus')} onOpenChange={() => toggleItem('plus-minus')} className="space-y-2">
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Toggle Content
                  {openItems.includes('plus-minus') ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="rounded-md border px-4 py-3 text-sm">
                  Content with plus/minus icon indicator.
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Rotating Chevron</h3>
            <Collapsible open={openItems.includes('rotating')} onOpenChange={() => toggleItem('rotating')} className="space-y-2">
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Toggle Content
                  <ChevronDown className={\`h-4 w-4 transition-transform duration-200 \${openItems.includes('rotating') ? 'rotate-180' : ''}\`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="rounded-md border px-4 py-3 text-sm">
                  Content with rotating chevron down icon.
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Chevron Right to Down</h3>
            <Collapsible open={openItems.includes('chevron-right')} onOpenChange={() => toggleItem('chevron-right')} className="space-y-2">
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Toggle Content
                  <ChevronRight className={\`h-4 w-4 transition-transform duration-200 \${openItems.includes('chevron-right') ? 'rotate-90' : ''}\`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="rounded-md border px-4 py-3 text-sm">
                  Content with chevron right that rotates to down.
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>;
    };
    return <AnimationDemoComponent />;
  }
}`,...(we=(ve=N.parameters)==null?void 0:ve.docs)==null?void 0:we.source},description:{story:`Animation demo with different transitions.

Shows various animation styles for opening/closing.`,...(je=(Ne=N.parameters)==null?void 0:Ne.docs)==null?void 0:je.description}}};var Se,Oe,Ie,Te,Be;j.parameters={...j.parameters,docs:{...(Se=j.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  render: () => {
    const OzeanLichtDemo = () => {
      const [openItems, setOpenItems] = useState<string[]>(['features']);
      const toggleItem = (item: string) => {
        setOpenItems(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
      };
      return <div className="w-[400px] space-y-3">
          <h2 className="text-xl font-semibold mb-4" style={{
          color: '#0ec2bc'
        }}>
            Ozean Licht Platform
          </h2>

          <Collapsible open={openItems.includes('features')} onOpenChange={() => toggleItem('features')} className="space-y-2">
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between" style={{
              borderColor: '#0ec2bc',
              color: openItems.includes('features') ? '#0ec2bc' : undefined
            }}>
                Platform Features
                <ChevronDown className={\`h-4 w-4 transition-transform duration-200 \${openItems.includes('features') ? 'rotate-180' : ''}\`} style={{
                color: '#0ec2bc'
              }} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="rounded-md border px-4 py-3 text-sm" style={{
              borderColor: '#0ec2bc20',
              backgroundColor: '#0ec2bc10'
            }}>
                <ul className="space-y-2">
                  <li style={{
                  color: '#0ec2bc'
                }}>✓ Content Management</li>
                  <li style={{
                  color: '#0ec2bc'
                }}>✓ Educational Resources</li>
                  <li style={{
                  color: '#0ec2bc'
                }}>✓ Community Features</li>
                </ul>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={openItems.includes('pricing')} onOpenChange={() => toggleItem('pricing')} className="space-y-2">
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between" style={{
              borderColor: '#0ec2bc',
              color: openItems.includes('pricing') ? '#0ec2bc' : undefined
            }}>
                Pricing Options
                <ChevronDown className={\`h-4 w-4 transition-transform duration-200 \${openItems.includes('pricing') ? 'rotate-180' : ''}\`} style={{
                color: '#0ec2bc'
              }} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="rounded-md border px-4 py-3 text-sm" style={{
              borderColor: '#0ec2bc20',
              backgroundColor: '#0ec2bc10'
            }}>
                <div className="space-y-2">
                  <div>
                    <strong style={{
                    color: '#0ec2bc'
                  }}>Free Tier:</strong> Basic features
                  </div>
                  <div>
                    <strong style={{
                    color: '#0ec2bc'
                  }}>Pro Tier:</strong> Advanced features
                  </div>
                  <div>
                    <strong style={{
                    color: '#0ec2bc'
                  }}>Enterprise:</strong> Custom solutions
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={openItems.includes('support')} onOpenChange={() => toggleItem('support')} className="space-y-2">
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between" style={{
              borderColor: '#0ec2bc',
              color: openItems.includes('support') ? '#0ec2bc' : undefined
            }}>
                Support & Resources
                <ChevronDown className={\`h-4 w-4 transition-transform duration-200 \${openItems.includes('support') ? 'rotate-180' : ''}\`} style={{
                color: '#0ec2bc'
              }} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="rounded-md border px-4 py-3 text-sm" style={{
              borderColor: '#0ec2bc20',
              backgroundColor: '#0ec2bc10'
            }}>
                <p>
                  Contact our support team 24/7 for assistance with any platform
                  features or questions about your account.
                </p>
                <Button className="mt-3 w-full" style={{
                backgroundColor: '#0ec2bc',
                color: 'white'
              }}>
                  Contact Support
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>;
    };
    return <OzeanLichtDemo />;
  }
}`,...(Ie=(Oe=j.parameters)==null?void 0:Oe.docs)==null?void 0:Ie.source},description:{story:`Ozean Licht themed examples.

Demonstrates the Ozean Licht turquoise color (#0ec2bc) with collapsibles.`,...(Be=(Te=j.parameters)==null?void 0:Te.docs)==null?void 0:Be.description}}};var ke,De,Fe,$e,Pe;S.parameters={...S.parameters,docs:{...(ke=S.parameters)==null?void 0:ke.docs,source:{originalSource:`{
  render: () => <Collapsible className="w-[350px] space-y-2">
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between" data-testid="collapsible-trigger">
          Toggle Test Content
          <ChevronDown className="h-4 w-4" data-testid="chevron-icon" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent data-testid="collapsible-content">
        <div className="rounded-md border px-4 py-3 text-sm">
          This is the collapsible content that should appear when opened.
        </div>
      </CollapsibleContent>
    </Collapsible>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // Initially, content should not be visible
    const content = canvas.queryByTestId('collapsible-content');

    // Click trigger to open
    const trigger = canvas.getByTestId('collapsible-trigger');
    await userEvent.click(trigger);

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 300));

    // Click trigger again to close
    await userEvent.click(trigger);

    // Wait for close animation
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}`,...(Fe=(De=S.parameters)==null?void 0:De.docs)==null?void 0:Fe.source},description:{story:`Interactive test with play function.

Tests collapsible open/close and keyboard navigation using Storybook interactions.`,...(Pe=($e=S.parameters)==null?void 0:$e.docs)==null?void 0:Pe.description}}};const ys=["Default","WithIcon","ControlledState","MultipleCollapsibles","NestedContent","FAQExample","FilterSection","SidebarSection","DisabledState","AnimationDemo","OzeanLichtThemed","InteractiveTest"];export{N as AnimationDemo,g as ControlledState,h as Default,w as DisabledState,f as FAQExample,y as FilterSection,S as InteractiveTest,x as MultipleCollapsibles,C as NestedContent,j as OzeanLichtThemed,v as SidebarSection,b as WithIcon,ys as __namedExportsOrder,fs as default};
