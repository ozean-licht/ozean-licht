import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{w as Ze,e as _,u as el}from"./index-CJu6nLMj.js";import{r as C}from"./index-B2-qRKKC.js";import{c as g}from"./clsx-B-dksMZM.js";import{L as ll}from"./link-E3I1sHda.js";import{B as p}from"./Button-PgnE6Xyj.js";import{C as L}from"./checkbox-BAdY7mee.js";import{B as x}from"./Badge-X7SGaqQH.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-Dp3B9jqt.js";import"./button-DhHHw9VN.js";import"./index-BiMR7eR1.js";import"./index-BFjtS4uE.js";import"./cn-CKXzwFwe.js";import"./index-BiUY2kQP.js";import"./index-kS-9iBlu.js";import"./index-BlCrtW8-.js";import"./index-D1vk04JX.js";import"./index-_AbP6Uzr.js";import"./index-BYfY0yFj.js";import"./index-PNzqWif7.js";import"./check-BFJmnSzs.js";import"./createLucideIcon-BbF4D6Jl.js";import"./arrow-right-2p1MOGVp.js";const E=C.createContext({bleed:!1,dense:!1,grid:!1,striped:!1});function b({bleed:i=!1,dense:t=!1,grid:o=!1,striped:n=!1,className:c,children:h,...T}){return e.jsx(E.Provider,{value:{bleed:i,dense:t,grid:o,striped:n},children:e.jsx("div",{className:"flow-root",children:e.jsx("div",{...T,className:g(c,"-mx-(--gutter) overflow-x-auto whitespace-nowrap"),children:e.jsx("div",{className:g("inline-block min-w-full align-middle",!i&&"sm:px-(--gutter)"),children:e.jsx("table",{className:"min-w-full text-left text-sm/6 text-zinc-950 dark:text-white",children:h})})})})})}function m({className:i,...t}){return e.jsx("thead",{...t,className:g(i,"text-zinc-500 dark:text-zinc-400")})}function u(i){return e.jsx("tbody",{...i})}const Ye=C.createContext({href:void 0,target:void 0,title:void 0});function r({href:i,target:t,title:o,className:n,...c}){let{striped:h}=C.useContext(E);return e.jsx(Ye.Provider,{value:{href:i,target:t,title:o},children:e.jsx("tr",{...c,className:g(n,i&&"has-[[data-row-link][data-focus]]:outline-2 has-[[data-row-link][data-focus]]:-outline-offset-2 has-[[data-row-link][data-focus]]:outline-blue-500 dark:focus-within:bg-white/2.5",h&&"even:bg-zinc-950/2.5 dark:even:bg-white/2.5",i&&h&&"hover:bg-zinc-950/5 dark:hover:bg-white/5",i&&!h&&"hover:bg-zinc-950/2.5 dark:hover:bg-white/2.5")})})}function a({className:i,...t}){let{bleed:o,grid:n}=C.useContext(E);return e.jsx("th",{...t,className:g(i,"border-b border-b-zinc-950/10 px-4 py-2 font-medium first:pl-(--gutter,--spacing(2)) last:pr-(--gutter,--spacing(2)) dark:border-b-white/10",n&&"border-l border-l-zinc-950/5 first:border-l-0 dark:border-l-white/5",!o&&"sm:first:pl-1 sm:last:pr-1")})}function l({className:i,children:t,...o}){let{bleed:n,dense:c,grid:h,striped:T}=C.useContext(E),{href:j,target:s,title:d}=C.useContext(Ye),[v,D]=C.useState(null);return e.jsxs("td",{ref:j?D:void 0,...o,className:g(i,"relative px-4 first:pl-(--gutter,--spacing(2)) last:pr-(--gutter,--spacing(2))",!T&&"border-b border-zinc-950/5 dark:border-white/5",h&&"border-l border-l-zinc-950/5 first:border-l-0 dark:border-l-white/5",c?"py-2.5":"py-4",!n&&"sm:first:pl-1 sm:last:pr-1"),children:[j&&e.jsx(ll,{"data-row-link":!0,href:j,target:s,"aria-label":d,tabIndex:(v==null?void 0:v.previousElementSibling)===null?0:-1,className:"absolute inset-0 focus:outline-hidden"}),t]})}try{b.displayName="Table",b.__docgenInfo={description:"",displayName:"Table",props:{bleed:{defaultValue:{value:"false"},description:"",name:"bleed",required:!1,type:{name:"boolean"}},dense:{defaultValue:{value:"false"},description:"",name:"dense",required:!1,type:{name:"boolean"}},grid:{defaultValue:{value:"false"},description:"",name:"grid",required:!1,type:{name:"boolean"}},striped:{defaultValue:{value:"false"},description:"",name:"striped",required:!1,type:{name:"boolean"}}}}}catch{}try{m.displayName="TableHead",m.__docgenInfo={description:"",displayName:"TableHead",props:{}}}catch{}try{u.displayName="TableBody",u.__docgenInfo={description:"",displayName:"TableBody",props:{}}}catch{}try{r.displayName="TableRow",r.__docgenInfo={description:"",displayName:"TableRow",props:{href:{defaultValue:null,description:"",name:"href",required:!1,type:{name:"string"}},target:{defaultValue:null,description:"",name:"target",required:!1,type:{name:"string"}},title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string"}}}}}catch{}try{a.displayName="TableHeader",a.__docgenInfo={description:"",displayName:"TableHeader",props:{}}}catch{}try{l.displayName="TableCell",l.__docgenInfo={description:"",displayName:"TableCell",props:{}}}catch{}const Hl={title:"Tier 1: Primitives/Catalyst/Table",component:b,parameters:{layout:"padded",docs:{description:{component:"A flexible, accessible data table component built with Headless UI patterns and Catalyst design system. Supports sorting, selection, striped rows, and clickable rows."}}},tags:["autodocs"]},y={render:()=>e.jsxs(b,{children:[e.jsx(m,{children:e.jsxs(r,{children:[e.jsx(a,{children:"Name"}),e.jsx(a,{children:"Email"}),e.jsx(a,{children:"Role"}),e.jsx(a,{children:"Status"})]})}),e.jsxs(u,{children:[e.jsxs(r,{children:[e.jsx(l,{children:"Anna Schmidt"}),e.jsx(l,{children:"anna.schmidt@ozean-licht.dev"}),e.jsx(l,{children:"Administrator"}),e.jsx(l,{children:"Active"})]}),e.jsxs(r,{children:[e.jsx(l,{children:"Markus Weber"}),e.jsx(l,{children:"markus.weber@ozean-licht.dev"}),e.jsx(l,{children:"Editor"}),e.jsx(l,{children:"Active"})]}),e.jsxs(r,{children:[e.jsx(l,{children:"Sophie Mueller"}),e.jsx(l,{children:"sophie.mueller@ozean-licht.dev"}),e.jsx(l,{children:"Viewer"}),e.jsx(l,{children:"Inactive"})]}),e.jsxs(r,{children:[e.jsx(l,{children:"Lukas Fischer"}),e.jsx(l,{children:"lukas.fischer@kids-ascension.dev"}),e.jsx(l,{children:"Teacher"}),e.jsx(l,{children:"Active"})]})]})]})},w={render:()=>e.jsxs(b,{striped:!0,children:[e.jsx(m,{children:e.jsxs(r,{children:[e.jsx(a,{children:"Product"}),e.jsx(a,{children:"Category"}),e.jsx(a,{children:"Price"}),e.jsx(a,{children:"Stock"})]})}),e.jsxs(u,{children:[e.jsxs(r,{children:[e.jsx(l,{children:"Meditation Cushion"}),e.jsx(l,{children:"Accessories"}),e.jsx(l,{children:"€45.00"}),e.jsx(l,{children:"24"})]}),e.jsxs(r,{children:[e.jsx(l,{children:"Crystal Singing Bowl"}),e.jsx(l,{children:"Instruments"}),e.jsx(l,{children:"€180.00"}),e.jsx(l,{children:"8"})]}),e.jsxs(r,{children:[e.jsx(l,{children:"Yoga Mat"}),e.jsx(l,{children:"Equipment"}),e.jsx(l,{children:"€32.00"}),e.jsx(l,{children:"56"})]}),e.jsxs(r,{children:[e.jsx(l,{children:"Essential Oil Set"}),e.jsx(l,{children:"Wellness"}),e.jsx(l,{children:"€28.00"}),e.jsx(l,{children:"42"})]}),e.jsxs(r,{children:[e.jsx(l,{children:"Incense Bundle"}),e.jsx(l,{children:"Aromatherapy"}),e.jsx(l,{children:"€12.00"}),e.jsx(l,{children:"98"})]})]})]})},f={render:()=>e.jsxs(b,{grid:!0,children:[e.jsx(m,{children:e.jsxs(r,{children:[e.jsx(a,{children:"Region"}),e.jsx(a,{children:"Q1"}),e.jsx(a,{children:"Q2"}),e.jsx(a,{children:"Q3"}),e.jsx(a,{children:"Q4"}),e.jsx(a,{children:"Total"})]})}),e.jsxs(u,{children:[e.jsxs(r,{children:[e.jsx(l,{children:"Vienna"}),e.jsx(l,{children:"€24,500"}),e.jsx(l,{children:"€28,200"}),e.jsx(l,{children:"€31,800"}),e.jsx(l,{children:"€35,400"}),e.jsx(l,{children:"€119,900"})]}),e.jsxs(r,{children:[e.jsx(l,{children:"Salzburg"}),e.jsx(l,{children:"€18,600"}),e.jsx(l,{children:"€21,400"}),e.jsx(l,{children:"€19,800"}),e.jsx(l,{children:"€23,200"}),e.jsx(l,{children:"€83,000"})]}),e.jsxs(r,{children:[e.jsx(l,{children:"Innsbruck"}),e.jsx(l,{children:"€15,200"}),e.jsx(l,{children:"€17,900"}),e.jsx(l,{children:"€16,500"}),e.jsx(l,{children:"€19,400"}),e.jsx(l,{children:"€69,000"})]}),e.jsxs(r,{children:[e.jsx(l,{children:"Graz"}),e.jsx(l,{children:"€12,800"}),e.jsx(l,{children:"€14,600"}),e.jsx(l,{children:"€13,900"}),e.jsx(l,{children:"€16,700"}),e.jsx(l,{children:"€58,000"})]})]})]})},k={render:()=>e.jsxs(b,{dense:!0,children:[e.jsx(m,{children:e.jsxs(r,{children:[e.jsx(a,{children:"ID"}),e.jsx(a,{children:"Timestamp"}),e.jsx(a,{children:"Event"}),e.jsx(a,{children:"User"}),e.jsx(a,{children:"IP Address"})]})}),e.jsxs(u,{children:[e.jsxs(r,{children:[e.jsx(l,{children:"#1024"}),e.jsx(l,{children:"2025-11-13 14:32:18"}),e.jsx(l,{children:"Login"}),e.jsx(l,{children:"anna.schmidt@ozean-licht.dev"}),e.jsx(l,{children:"138.201.139.25"})]}),e.jsxs(r,{children:[e.jsx(l,{children:"#1025"}),e.jsx(l,{children:"2025-11-13 14:34:52"}),e.jsx(l,{children:"File Upload"}),e.jsx(l,{children:"markus.weber@ozean-licht.dev"}),e.jsx(l,{children:"138.201.139.25"})]}),e.jsxs(r,{children:[e.jsx(l,{children:"#1026"}),e.jsx(l,{children:"2025-11-13 14:38:10"}),e.jsx(l,{children:"Settings Change"}),e.jsx(l,{children:"sophie.mueller@ozean-licht.dev"}),e.jsx(l,{children:"138.201.139.25"})]}),e.jsxs(r,{children:[e.jsx(l,{children:"#1027"}),e.jsx(l,{children:"2025-11-13 14:42:35"}),e.jsx(l,{children:"Logout"}),e.jsx(l,{children:"anna.schmidt@ozean-licht.dev"}),e.jsx(l,{children:"138.201.139.25"})]}),e.jsxs(r,{children:[e.jsx(l,{children:"#1028"}),e.jsx(l,{children:"2025-11-13 14:45:19"}),e.jsx(l,{children:"Login"}),e.jsx(l,{children:"lukas.fischer@kids-ascension.dev"}),e.jsx(l,{children:"138.201.139.25"})]})]})]})},H={render:()=>e.jsxs(b,{striped:!0,children:[e.jsx(m,{children:e.jsxs(r,{children:[e.jsx(a,{children:"Workshop"}),e.jsx(a,{children:"Instructor"}),e.jsx(a,{children:"Date"}),e.jsx(a,{children:"Participants"})]})}),e.jsxs(u,{children:[e.jsxs(r,{href:"/workshops/mindfulness-basics",title:"View Mindfulness Basics",children:[e.jsx(l,{children:"Mindfulness Basics"}),e.jsx(l,{children:"Maria Huber"}),e.jsx(l,{children:"Nov 20, 2025"}),e.jsx(l,{children:"12 / 15"})]}),e.jsxs(r,{href:"/workshops/crystal-healing",title:"View Crystal Healing",children:[e.jsx(l,{children:"Crystal Healing Workshop"}),e.jsx(l,{children:"Thomas Bauer"}),e.jsx(l,{children:"Nov 22, 2025"}),e.jsx(l,{children:"8 / 10"})]}),e.jsxs(r,{href:"/workshops/meditation-intensive",title:"View Meditation Intensive",children:[e.jsx(l,{children:"Meditation Intensive"}),e.jsx(l,{children:"Elisabeth Gruber"}),e.jsx(l,{children:"Nov 25, 2025"}),e.jsx(l,{children:"15 / 20"})]}),e.jsxs(r,{href:"/workshops/energy-work",title:"View Energy Work",children:[e.jsx(l,{children:"Energy Work Fundamentals"}),e.jsx(l,{children:"Johannes Steiner"}),e.jsx(l,{children:"Nov 28, 2025"}),e.jsx(l,{children:"6 / 12"})]})]})]})},S={render:()=>{const i=()=>{const[t,o]=C.useState("name"),[n,c]=C.useState("asc"),h=[{name:"Anna Schmidt",email:"anna.schmidt@ozean-licht.dev",role:"Admin",joined:"2023-01-15"},{name:"Markus Weber",email:"markus.weber@ozean-licht.dev",role:"Editor",joined:"2023-03-22"},{name:"Sophie Mueller",email:"sophie.mueller@ozean-licht.dev",role:"Viewer",joined:"2024-05-10"},{name:"Lukas Fischer",email:"lukas.fischer@kids-ascension.dev",role:"Teacher",joined:"2024-08-03"}],T=d=>{t===d?c(n==="asc"?"desc":"asc"):(o(d),c("asc"))},j=[...h].sort((d,v)=>{const D=d[t],$e=v[t],I=n==="asc"?1:-1;return D<$e?-I:I}),s=({column:d})=>t!==d?e.jsx("span",{className:"text-zinc-400",children:"↕"}):n==="asc"?e.jsx("span",{children:"↑"}):e.jsx("span",{children:"↓"});return e.jsxs(b,{children:[e.jsx(m,{children:e.jsxs(r,{children:[e.jsx(a,{children:e.jsxs("button",{onClick:()=>T("name"),className:"flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white",children:["Name ",e.jsx(s,{column:"name"})]})}),e.jsx(a,{children:e.jsxs("button",{onClick:()=>T("email"),className:"flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white",children:["Email ",e.jsx(s,{column:"email"})]})}),e.jsx(a,{children:e.jsxs("button",{onClick:()=>T("role"),className:"flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white",children:["Role ",e.jsx(s,{column:"role"})]})}),e.jsx(a,{children:e.jsxs("button",{onClick:()=>T("joined"),className:"flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white",children:["Joined ",e.jsx(s,{column:"joined"})]})})]})}),e.jsx(u,{children:j.map((d,v)=>e.jsxs(r,{children:[e.jsx(l,{children:d.name}),e.jsx(l,{children:d.email}),e.jsx(l,{children:d.role}),e.jsx(l,{children:d.joined})]},v))})]})};return e.jsx(i,{})}},R={render:()=>{const i=()=>{const[t,o]=C.useState(new Set),n=[{id:1,name:"Anna Schmidt",email:"anna.schmidt@ozean-licht.dev",role:"Admin"},{id:2,name:"Markus Weber",email:"markus.weber@ozean-licht.dev",role:"Editor"},{id:3,name:"Sophie Mueller",email:"sophie.mueller@ozean-licht.dev",role:"Viewer"},{id:4,name:"Lukas Fischer",email:"lukas.fischer@kids-ascension.dev",role:"Teacher"}],c=s=>{const d=new Set(t);d.has(s)?d.delete(s):d.add(s),o(d)},h=()=>{t.size===n.length?o(new Set):o(new Set(n.map(s=>s.id)))},T=t.size===n.length,j=t.size>0&&t.size<n.length;return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"text-sm text-zinc-600 dark:text-zinc-400",children:[t.size," of ",n.length," rows selected"]}),e.jsxs(b,{children:[e.jsx(m,{children:e.jsxs(r,{children:[e.jsx(a,{children:e.jsx(L,{checked:T,ref:s=>{s&&(s.indeterminate=j)},onCheckedChange:h,"aria-label":"Select all rows"})}),e.jsx(a,{children:"Name"}),e.jsx(a,{children:"Email"}),e.jsx(a,{children:"Role"})]})}),e.jsx(u,{children:n.map(s=>e.jsxs(r,{children:[e.jsx(l,{children:e.jsx(L,{checked:t.has(s.id),onCheckedChange:()=>c(s.id),"aria-label":`Select ${s.name}`})}),e.jsx(l,{children:s.name}),e.jsx(l,{children:s.email}),e.jsx(l,{children:s.role})]},s.id))})]})]})};return e.jsx(i,{})}},B={render:()=>{const i=()=>{const[t,o]=C.useState(1),n=5,c=[{id:1,course:"Math Fundamentals",students:24,teacher:"Prof. Weber",progress:"85%"},{id:2,course:"Science Exploration",students:18,teacher:"Dr. Schmidt",progress:"72%"},{id:3,course:"Creative Writing",students:15,teacher:"Maria Huber",progress:"90%"},{id:4,course:"History of Austria",students:22,teacher:"Thomas Bauer",progress:"68%"},{id:5,course:"Digital Art",students:12,teacher:"Sophie Mueller",progress:"78%"},{id:6,course:"Physical Education",students:28,teacher:"Lukas Fischer",progress:"82%"},{id:7,course:"Music Theory",students:16,teacher:"Elisabeth Gruber",progress:"75%"},{id:8,course:"Environmental Studies",students:20,teacher:"Johannes Steiner",progress:"88%"},{id:9,course:"Language Arts",students:19,teacher:"Anna Hoffman",progress:"91%"},{id:10,course:"Social Studies",students:21,teacher:"Michael Koch",progress:"70%"}],h=Math.ceil(c.length/n),T=(t-1)*n,j=c.slice(T,T+n);return e.jsxs("div",{className:"space-y-4",children:[e.jsxs(b,{striped:!0,children:[e.jsx(m,{children:e.jsxs(r,{children:[e.jsx(a,{children:"Course"}),e.jsx(a,{children:"Students"}),e.jsx(a,{children:"Teacher"}),e.jsx(a,{children:"Progress"})]})}),e.jsx(u,{children:j.map(s=>e.jsxs(r,{children:[e.jsx(l,{children:s.course}),e.jsx(l,{children:s.students}),e.jsx(l,{children:s.teacher}),e.jsx(l,{children:s.progress})]},s.id))})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"text-sm text-zinc-600 dark:text-zinc-400",children:["Showing ",T+1," to ",Math.min(T+n,c.length)," of ",c.length," ","results"]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(p,{variant:"outline",onClick:()=>o(s=>Math.max(1,s-1)),disabled:t===1,children:"Previous"}),e.jsx("div",{className:"flex items-center gap-2",children:Array.from({length:h},(s,d)=>d+1).map(s=>e.jsx(p,{variant:t===s?"solid":"outline",onClick:()=>o(s),children:s},s))}),e.jsx(p,{variant:"outline",onClick:()=>o(s=>Math.min(h,s+1)),disabled:t===h,children:"Next"})]})]})]})};return e.jsx(i,{})}},z={render:()=>e.jsx("div",{className:"max-w-2xl",children:e.jsxs(b,{children:[e.jsx(m,{children:e.jsxs(r,{children:[e.jsx(a,{children:"Transaction ID"}),e.jsx(a,{children:"Date"}),e.jsx(a,{children:"Description"}),e.jsx(a,{children:"Category"}),e.jsx(a,{children:"Amount"}),e.jsx(a,{children:"Status"})]})}),e.jsxs(u,{children:[e.jsxs(r,{children:[e.jsx(l,{children:"TXN-2025-001"}),e.jsx(l,{children:"2025-11-13"}),e.jsx(l,{children:"Workshop Registration - Mindfulness Basics"}),e.jsx(l,{children:"Education"}),e.jsx(l,{children:"€45.00"}),e.jsx(l,{children:e.jsx(x,{variant:"secondary",style:{backgroundColor:"var(--primary)20",color:"var(--primary)"},children:"Completed"})})]}),e.jsxs(r,{children:[e.jsx(l,{children:"TXN-2025-002"}),e.jsx(l,{children:"2025-11-12"}),e.jsx(l,{children:"Crystal Singing Bowl Purchase"}),e.jsx(l,{children:"Product"}),e.jsx(l,{children:"€180.00"}),e.jsx(l,{children:e.jsx(x,{variant:"secondary",style:{backgroundColor:"var(--primary)20",color:"var(--primary)"},children:"Completed"})})]}),e.jsxs(r,{children:[e.jsx(l,{children:"TXN-2025-003"}),e.jsx(l,{children:"2025-11-10"}),e.jsx(l,{children:"Monthly Membership Subscription"}),e.jsx(l,{children:"Subscription"}),e.jsx(l,{children:"€29.99"}),e.jsx(l,{children:e.jsx(x,{variant:"outline",children:"Pending"})})]})]})]})})},N={render:()=>{const i=()=>{const t=[{id:1,name:"Anna Schmidt",email:"anna.schmidt@ozean-licht.dev",role:"Administrator",entity:"Ozean Licht",status:"active",lastLogin:"2025-11-13 14:32"},{id:2,name:"Markus Weber",email:"markus.weber@ozean-licht.dev",role:"Editor",entity:"Ozean Licht",status:"active",lastLogin:"2025-11-13 10:15"},{id:3,name:"Sophie Mueller",email:"sophie.mueller@ozean-licht.dev",role:"Viewer",entity:"Ozean Licht",status:"inactive",lastLogin:"2025-11-05 16:42"},{id:4,name:"Lukas Fischer",email:"lukas.fischer@kids-ascension.dev",role:"Teacher",entity:"Kids Ascension",status:"active",lastLogin:"2025-11-13 09:28"},{id:5,name:"Maria Huber",email:"maria.huber@kids-ascension.dev",role:"Teacher",entity:"Kids Ascension",status:"active",lastLogin:"2025-11-12 18:50"}],o=n=>n==="active"?e.jsx(x,{variant:"secondary",style:{backgroundColor:"var(--primary)20",color:"var(--primary)"},children:"Active"}):e.jsx(x,{variant:"outline",style:{color:"#71717a"},children:"Inactive"});return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-lg font-semibold text-zinc-900 dark:text-white",children:"User Management"}),e.jsx("p",{className:"text-sm text-zinc-600 dark:text-zinc-400",children:"Manage users across both entities"})]}),e.jsx(p,{style:{backgroundColor:"var(--primary)",color:"white"},children:"Add User"})]}),e.jsxs(b,{striped:!0,children:[e.jsx(m,{children:e.jsxs(r,{children:[e.jsx(a,{children:"User"}),e.jsx(a,{children:"Entity"}),e.jsx(a,{children:"Role"}),e.jsx(a,{children:"Status"}),e.jsx(a,{children:"Last Login"}),e.jsx(a,{children:"Actions"})]})}),e.jsx(u,{children:t.map(n=>e.jsxs(r,{children:[e.jsx(l,{children:e.jsxs("div",{children:[e.jsx("div",{className:"font-medium text-zinc-900 dark:text-white",children:n.name}),e.jsx("div",{className:"text-sm text-zinc-500 dark:text-zinc-400",children:n.email})]})}),e.jsx(l,{children:n.entity}),e.jsx(l,{children:n.role}),e.jsx(l,{children:o(n.status)}),e.jsx(l,{children:n.lastLogin}),e.jsx(l,{children:e.jsxs("div",{className:"flex gap-2",children:[e.jsx(p,{variant:"plain",size:"sm",children:"Edit"}),e.jsx(p,{variant:"plain",size:"sm",style:{color:"#ef4444"},children:"Delete"})]})})]},n.id))})]})]})};return e.jsx(i,{})}},M={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-lg font-semibold",style:{color:"var(--primary)"},children:"Workshop Schedule"}),e.jsx("p",{className:"text-sm text-zinc-600 dark:text-zinc-400",children:"Upcoming workshops with Ozean Licht turquoise accents"})]}),e.jsxs(b,{striped:!0,children:[e.jsx(m,{children:e.jsxs(r,{children:[e.jsx(a,{style:{color:"var(--primary)"},children:"Workshop"}),e.jsx(a,{style:{color:"var(--primary)"},children:"Instructor"}),e.jsx(a,{style:{color:"var(--primary)"},children:"Date"}),e.jsx(a,{style:{color:"var(--primary)"},children:"Capacity"}),e.jsx(a,{style:{color:"var(--primary)"},children:"Status"})]})}),e.jsxs(u,{children:[e.jsxs(r,{children:[e.jsx(l,{children:e.jsx("span",{className:"font-medium",style:{color:"var(--primary)"},children:"Mindfulness Basics"})}),e.jsx(l,{children:"Maria Huber"}),e.jsx(l,{children:"Nov 20, 2025"}),e.jsx(l,{children:"12 / 15"}),e.jsx(l,{children:e.jsx(x,{variant:"secondary",style:{backgroundColor:"var(--primary)20",color:"var(--primary)"},children:"Available"})})]}),e.jsxs(r,{children:[e.jsx(l,{children:e.jsx("span",{className:"font-medium",style:{color:"var(--primary)"},children:"Crystal Healing Workshop"})}),e.jsx(l,{children:"Thomas Bauer"}),e.jsx(l,{children:"Nov 22, 2025"}),e.jsx(l,{children:"8 / 10"}),e.jsx(l,{children:e.jsx(x,{variant:"secondary",style:{backgroundColor:"var(--primary)20",color:"var(--primary)"},children:"Available"})})]}),e.jsxs(r,{children:[e.jsx(l,{children:e.jsx("span",{className:"font-medium",style:{color:"var(--primary)"},children:"Meditation Intensive"})}),e.jsx(l,{children:"Elisabeth Gruber"}),e.jsx(l,{children:"Nov 25, 2025"}),e.jsx(l,{children:"15 / 20"}),e.jsx(l,{children:e.jsx(x,{variant:"secondary",style:{backgroundColor:"var(--primary)20",color:"var(--primary)"},children:"Available"})})]}),e.jsxs(r,{children:[e.jsx(l,{children:e.jsx("span",{className:"font-medium",style:{color:"var(--primary)"},children:"Energy Work Fundamentals"})}),e.jsx(l,{children:"Johannes Steiner"}),e.jsx(l,{children:"Nov 28, 2025"}),e.jsx(l,{children:"12 / 12"}),e.jsx(l,{children:e.jsx(x,{variant:"outline",style:{borderColor:"#ef4444",color:"#ef4444"},children:"Full"})})]})]})]}),e.jsxs("div",{className:"flex justify-end gap-2",children:[e.jsx(p,{variant:"outline",style:{borderColor:"var(--primary)",color:"var(--primary)"},children:"View All Workshops"}),e.jsx(p,{style:{backgroundColor:"var(--primary)",color:"white"},children:"Create Workshop"})]})]})},A={render:()=>e.jsxs(b,{grid:!0,dense:!0,striped:!0,children:[e.jsx(m,{children:e.jsxs(r,{children:[e.jsx(a,{children:"Service"}),e.jsx(a,{children:"Host"}),e.jsx(a,{children:"Port"}),e.jsx(a,{children:"Status"}),e.jsx(a,{children:"Uptime"}),e.jsx(a,{children:"CPU"}),e.jsx(a,{children:"Memory"})]})}),e.jsxs(u,{children:[e.jsxs(r,{children:[e.jsx(l,{children:"Admin Dashboard"}),e.jsx(l,{children:"coolify.ozean-licht.dev"}),e.jsx(l,{children:"9200"}),e.jsx(l,{children:e.jsx(x,{variant:"secondary",style:{backgroundColor:"var(--primary)20",color:"var(--primary)"},children:"Running"})}),e.jsx(l,{children:"24d 16h"}),e.jsx(l,{children:"12%"}),e.jsx(l,{children:"342 MB"})]}),e.jsxs(r,{children:[e.jsx(l,{children:"MCP Gateway"}),e.jsx(l,{children:"coolify.ozean-licht.dev"}),e.jsx(l,{children:"8100"}),e.jsx(l,{children:e.jsx(x,{variant:"secondary",style:{backgroundColor:"var(--primary)20",color:"var(--primary)"},children:"Running"})}),e.jsx(l,{children:"24d 16h"}),e.jsx(l,{children:"8%"}),e.jsx(l,{children:"256 MB"})]}),e.jsxs(r,{children:[e.jsx(l,{children:"PostgreSQL"}),e.jsx(l,{children:"138.201.139.25"}),e.jsx(l,{children:"5432"}),e.jsx(l,{children:e.jsx(x,{variant:"secondary",style:{backgroundColor:"var(--primary)20",color:"var(--primary)"},children:"Running"})}),e.jsx(l,{children:"24d 16h"}),e.jsx(l,{children:"18%"}),e.jsx(l,{children:"1.2 GB"})]}),e.jsxs(r,{children:[e.jsx(l,{children:"MinIO"}),e.jsx(l,{children:"138.201.139.25"}),e.jsx(l,{children:"9000"}),e.jsx(l,{children:e.jsx(x,{variant:"secondary",style:{backgroundColor:"var(--primary)20",color:"var(--primary)"},children:"Running"})}),e.jsx(l,{children:"24d 16h"}),e.jsx(l,{children:"5%"}),e.jsx(l,{children:"512 MB"})]}),e.jsxs(r,{children:[e.jsx(l,{children:"Grafana"}),e.jsx(l,{children:"grafana.ozean-licht.dev"}),e.jsx(l,{children:"3000"}),e.jsx(l,{children:e.jsx(x,{variant:"secondary",style:{backgroundColor:"var(--primary)20",color:"var(--primary)"},children:"Running"})}),e.jsx(l,{children:"24d 16h"}),e.jsx(l,{children:"3%"}),e.jsx(l,{children:"198 MB"})]})]})]})},P={render:()=>e.jsxs(b,{striped:!0,children:[e.jsx(m,{children:e.jsxs(r,{children:[e.jsx(a,{children:"Name"}),e.jsx(a,{children:"Email"}),e.jsx(a,{children:"Actions"})]})}),e.jsxs(u,{children:[e.jsxs(r,{children:[e.jsx(l,{"data-testid":"user-name-1",children:"Anna Schmidt"}),e.jsx(l,{children:"anna.schmidt@ozean-licht.dev"}),e.jsx(l,{children:e.jsx(p,{variant:"plain",size:"sm","data-testid":"edit-button-1",children:"Edit"})})]}),e.jsxs(r,{children:[e.jsx(l,{"data-testid":"user-name-2",children:"Markus Weber"}),e.jsx(l,{children:"markus.weber@ozean-licht.dev"}),e.jsx(l,{children:e.jsx(p,{variant:"plain",size:"sm","data-testid":"edit-button-2",children:"Edit"})})]})]})]}),play:async({canvasElement:i})=>{const t=Ze(i),o=t.getByTestId("user-name-1");await _(o).toHaveTextContent("Anna Schmidt");const n=t.getByTestId("user-name-2");await _(n).toHaveTextContent("Markus Weber");const c=t.getByTestId("edit-button-1");await el.click(c)}};var W,V,F,G,O;y.parameters={...y.parameters,docs:{...(W=y.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Email</TableHeader>
          <TableHeader>Role</TableHeader>
          <TableHeader>Status</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Anna Schmidt</TableCell>
          <TableCell>anna.schmidt@ozean-licht.dev</TableCell>
          <TableCell>Administrator</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Markus Weber</TableCell>
          <TableCell>markus.weber@ozean-licht.dev</TableCell>
          <TableCell>Editor</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Sophie Mueller</TableCell>
          <TableCell>sophie.mueller@ozean-licht.dev</TableCell>
          <TableCell>Viewer</TableCell>
          <TableCell>Inactive</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Lukas Fischer</TableCell>
          <TableCell>lukas.fischer@kids-ascension.dev</TableCell>
          <TableCell>Teacher</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
      </TableBody>
    </Table>
}`,...(F=(V=y.parameters)==null?void 0:V.docs)==null?void 0:F.source},description:{story:`Default table with basic data.

Shows the simplest table implementation with clean, minimal styling.`,...(O=(G=y.parameters)==null?void 0:G.docs)==null?void 0:O.description}}};var U,q,Q,J,K;w.parameters={...w.parameters,docs:{...(U=w.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: () => <Table striped>
      <TableHead>
        <TableRow>
          <TableHeader>Product</TableHeader>
          <TableHeader>Category</TableHeader>
          <TableHeader>Price</TableHeader>
          <TableHeader>Stock</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Meditation Cushion</TableCell>
          <TableCell>Accessories</TableCell>
          <TableCell>€45.00</TableCell>
          <TableCell>24</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Crystal Singing Bowl</TableCell>
          <TableCell>Instruments</TableCell>
          <TableCell>€180.00</TableCell>
          <TableCell>8</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Yoga Mat</TableCell>
          <TableCell>Equipment</TableCell>
          <TableCell>€32.00</TableCell>
          <TableCell>56</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Essential Oil Set</TableCell>
          <TableCell>Wellness</TableCell>
          <TableCell>€28.00</TableCell>
          <TableCell>42</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Incense Bundle</TableCell>
          <TableCell>Aromatherapy</TableCell>
          <TableCell>€12.00</TableCell>
          <TableCell>98</TableCell>
        </TableRow>
      </TableBody>
    </Table>
}`,...(Q=(q=w.parameters)==null?void 0:q.docs)==null?void 0:Q.source},description:{story:"Striped table with alternating row colors.\n\nThe `striped` prop adds subtle background color to even rows for better readability.",...(K=(J=w.parameters)==null?void 0:J.docs)==null?void 0:K.description}}};var X,Y,$,Z,ee;f.parameters={...f.parameters,docs:{...(X=f.parameters)==null?void 0:X.docs,source:{originalSource:`{
  render: () => <Table grid>
      <TableHead>
        <TableRow>
          <TableHeader>Region</TableHeader>
          <TableHeader>Q1</TableHeader>
          <TableHeader>Q2</TableHeader>
          <TableHeader>Q3</TableHeader>
          <TableHeader>Q4</TableHeader>
          <TableHeader>Total</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Vienna</TableCell>
          <TableCell>€24,500</TableCell>
          <TableCell>€28,200</TableCell>
          <TableCell>€31,800</TableCell>
          <TableCell>€35,400</TableCell>
          <TableCell>€119,900</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Salzburg</TableCell>
          <TableCell>€18,600</TableCell>
          <TableCell>€21,400</TableCell>
          <TableCell>€19,800</TableCell>
          <TableCell>€23,200</TableCell>
          <TableCell>€83,000</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Innsbruck</TableCell>
          <TableCell>€15,200</TableCell>
          <TableCell>€17,900</TableCell>
          <TableCell>€16,500</TableCell>
          <TableCell>€19,400</TableCell>
          <TableCell>€69,000</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Graz</TableCell>
          <TableCell>€12,800</TableCell>
          <TableCell>€14,600</TableCell>
          <TableCell>€13,900</TableCell>
          <TableCell>€16,700</TableCell>
          <TableCell>€58,000</TableCell>
        </TableRow>
      </TableBody>
    </Table>
}`,...($=(Y=f.parameters)==null?void 0:Y.docs)==null?void 0:$.source},description:{story:"Grid table with vertical borders.\n\nThe `grid` prop adds vertical borders between columns for structured data visualization.",...(ee=(Z=f.parameters)==null?void 0:Z.docs)==null?void 0:ee.description}}};var le,ae,re,se,ne;k.parameters={...k.parameters,docs:{...(le=k.parameters)==null?void 0:le.docs,source:{originalSource:`{
  render: () => <Table dense>
      <TableHead>
        <TableRow>
          <TableHeader>ID</TableHeader>
          <TableHeader>Timestamp</TableHeader>
          <TableHeader>Event</TableHeader>
          <TableHeader>User</TableHeader>
          <TableHeader>IP Address</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>#1024</TableCell>
          <TableCell>2025-11-13 14:32:18</TableCell>
          <TableCell>Login</TableCell>
          <TableCell>anna.schmidt@ozean-licht.dev</TableCell>
          <TableCell>138.201.139.25</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>#1025</TableCell>
          <TableCell>2025-11-13 14:34:52</TableCell>
          <TableCell>File Upload</TableCell>
          <TableCell>markus.weber@ozean-licht.dev</TableCell>
          <TableCell>138.201.139.25</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>#1026</TableCell>
          <TableCell>2025-11-13 14:38:10</TableCell>
          <TableCell>Settings Change</TableCell>
          <TableCell>sophie.mueller@ozean-licht.dev</TableCell>
          <TableCell>138.201.139.25</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>#1027</TableCell>
          <TableCell>2025-11-13 14:42:35</TableCell>
          <TableCell>Logout</TableCell>
          <TableCell>anna.schmidt@ozean-licht.dev</TableCell>
          <TableCell>138.201.139.25</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>#1028</TableCell>
          <TableCell>2025-11-13 14:45:19</TableCell>
          <TableCell>Login</TableCell>
          <TableCell>lukas.fischer@kids-ascension.dev</TableCell>
          <TableCell>138.201.139.25</TableCell>
        </TableRow>
      </TableBody>
    </Table>
}`,...(re=(ae=k.parameters)==null?void 0:ae.docs)==null?void 0:re.source},description:{story:"Dense table with reduced vertical spacing.\n\nThe `dense` prop reduces padding for compact data display.",...(ne=(se=k.parameters)==null?void 0:se.docs)==null?void 0:ne.description}}};var te,ie,oe,de,ce;H.parameters={...H.parameters,docs:{...(te=H.parameters)==null?void 0:te.docs,source:{originalSource:`{
  render: () => <Table striped>
      <TableHead>
        <TableRow>
          <TableHeader>Workshop</TableHeader>
          <TableHeader>Instructor</TableHeader>
          <TableHeader>Date</TableHeader>
          <TableHeader>Participants</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow href="/workshops/mindfulness-basics" title="View Mindfulness Basics">
          <TableCell>Mindfulness Basics</TableCell>
          <TableCell>Maria Huber</TableCell>
          <TableCell>Nov 20, 2025</TableCell>
          <TableCell>12 / 15</TableCell>
        </TableRow>
        <TableRow href="/workshops/crystal-healing" title="View Crystal Healing">
          <TableCell>Crystal Healing Workshop</TableCell>
          <TableCell>Thomas Bauer</TableCell>
          <TableCell>Nov 22, 2025</TableCell>
          <TableCell>8 / 10</TableCell>
        </TableRow>
        <TableRow href="/workshops/meditation-intensive" title="View Meditation Intensive">
          <TableCell>Meditation Intensive</TableCell>
          <TableCell>Elisabeth Gruber</TableCell>
          <TableCell>Nov 25, 2025</TableCell>
          <TableCell>15 / 20</TableCell>
        </TableRow>
        <TableRow href="/workshops/energy-work" title="View Energy Work">
          <TableCell>Energy Work Fundamentals</TableCell>
          <TableCell>Johannes Steiner</TableCell>
          <TableCell>Nov 28, 2025</TableCell>
          <TableCell>6 / 12</TableCell>
        </TableRow>
      </TableBody>
    </Table>
}`,...(oe=(ie=H.parameters)==null?void 0:ie.docs)==null?void 0:oe.source},description:{story:"Table with clickable rows using href.\n\nAdd `href` to TableRow to make the entire row clickable with proper hover and focus states.",...(ce=(de=H.parameters)==null?void 0:de.docs)==null?void 0:ce.description}}};var be,he,Te,me,ue;S.parameters={...S.parameters,docs:{...(be=S.parameters)==null?void 0:be.docs,source:{originalSource:`{
  render: () => {
    const SortableTable = () => {
      const [sortColumn, setSortColumn] = useState<string>('name');
      const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
      const data = [{
        name: 'Anna Schmidt',
        email: 'anna.schmidt@ozean-licht.dev',
        role: 'Admin',
        joined: '2023-01-15'
      }, {
        name: 'Markus Weber',
        email: 'markus.weber@ozean-licht.dev',
        role: 'Editor',
        joined: '2023-03-22'
      }, {
        name: 'Sophie Mueller',
        email: 'sophie.mueller@ozean-licht.dev',
        role: 'Viewer',
        joined: '2024-05-10'
      }, {
        name: 'Lukas Fischer',
        email: 'lukas.fischer@kids-ascension.dev',
        role: 'Teacher',
        joined: '2024-08-03'
      }];
      const handleSort = (column: string) => {
        if (sortColumn === column) {
          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
          setSortColumn(column);
          setSortDirection('asc');
        }
      };
      const sortedData = [...data].sort((a, b) => {
        const aVal = a[sortColumn as keyof typeof a];
        const bVal = b[sortColumn as keyof typeof b];
        const modifier = sortDirection === 'asc' ? 1 : -1;
        return aVal < bVal ? -modifier : modifier;
      });
      const SortIcon = ({
        column
      }: {
        column: string;
      }) => {
        if (sortColumn !== column) return <span className="text-zinc-400">↕</span>;
        return sortDirection === 'asc' ? <span>↑</span> : <span>↓</span>;
      };
      return <Table>
          <TableHead>
            <TableRow>
              <TableHeader>
                <button onClick={() => handleSort('name')} className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white">
                  Name <SortIcon column="name" />
                </button>
              </TableHeader>
              <TableHeader>
                <button onClick={() => handleSort('email')} className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white">
                  Email <SortIcon column="email" />
                </button>
              </TableHeader>
              <TableHeader>
                <button onClick={() => handleSort('role')} className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white">
                  Role <SortIcon column="role" />
                </button>
              </TableHeader>
              <TableHeader>
                <button onClick={() => handleSort('joined')} className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white">
                  Joined <SortIcon column="joined" />
                </button>
              </TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row, index) => <TableRow key={index}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>{row.joined}</TableCell>
              </TableRow>)}
          </TableBody>
        </Table>;
    };
    return <SortableTable />;
  }
}`,...(Te=(he=S.parameters)==null?void 0:he.docs)==null?void 0:Te.source},description:{story:`Table with sorting functionality.

Demonstrates sortable columns with visual indicators and state management.`,...(ue=(me=S.parameters)==null?void 0:me.docs)==null?void 0:ue.description}}};var xe,Ce,pe,je,ve;R.parameters={...R.parameters,docs:{...(xe=R.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  render: () => {
    const SelectableTable = () => {
      const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
      const data = [{
        id: 1,
        name: 'Anna Schmidt',
        email: 'anna.schmidt@ozean-licht.dev',
        role: 'Admin'
      }, {
        id: 2,
        name: 'Markus Weber',
        email: 'markus.weber@ozean-licht.dev',
        role: 'Editor'
      }, {
        id: 3,
        name: 'Sophie Mueller',
        email: 'sophie.mueller@ozean-licht.dev',
        role: 'Viewer'
      }, {
        id: 4,
        name: 'Lukas Fischer',
        email: 'lukas.fischer@kids-ascension.dev',
        role: 'Teacher'
      }];
      const toggleRow = (id: number) => {
        const newSelected = new Set(selectedRows);
        if (newSelected.has(id)) {
          newSelected.delete(id);
        } else {
          newSelected.add(id);
        }
        setSelectedRows(newSelected);
      };
      const toggleAll = () => {
        if (selectedRows.size === data.length) {
          setSelectedRows(new Set());
        } else {
          setSelectedRows(new Set(data.map(row => row.id)));
        }
      };
      const allSelected = selectedRows.size === data.length;
      const someSelected = selectedRows.size > 0 && selectedRows.size < data.length;
      return <div className="space-y-4">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            {selectedRows.size} of {data.length} rows selected
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>
                  <Checkbox checked={allSelected} ref={ref => {
                  if (ref) ref.indeterminate = someSelected;
                }} onCheckedChange={toggleAll} aria-label="Select all rows" />
                </TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Role</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map(row => <TableRow key={row.id}>
                  <TableCell>
                    <Checkbox checked={selectedRows.has(row.id)} onCheckedChange={() => toggleRow(row.id)} aria-label={\`Select \${row.name}\`} />
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.role}</TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </div>;
    };
    return <SelectableTable />;
  }
}`,...(pe=(Ce=R.parameters)==null?void 0:Ce.docs)==null?void 0:pe.source},description:{story:`Table with row selection using checkboxes.

Demonstrates multi-select functionality with select all header.`,...(ve=(je=R.parameters)==null?void 0:je.docs)==null?void 0:ve.description}}};var ge,ye,we,fe,ke;B.parameters={...B.parameters,docs:{...(ge=B.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  render: () => {
    const PaginatedTable = () => {
      const [currentPage, setCurrentPage] = useState(1);
      const itemsPerPage = 5;
      const allData = [{
        id: 1,
        course: 'Math Fundamentals',
        students: 24,
        teacher: 'Prof. Weber',
        progress: '85%'
      }, {
        id: 2,
        course: 'Science Exploration',
        students: 18,
        teacher: 'Dr. Schmidt',
        progress: '72%'
      }, {
        id: 3,
        course: 'Creative Writing',
        students: 15,
        teacher: 'Maria Huber',
        progress: '90%'
      }, {
        id: 4,
        course: 'History of Austria',
        students: 22,
        teacher: 'Thomas Bauer',
        progress: '68%'
      }, {
        id: 5,
        course: 'Digital Art',
        students: 12,
        teacher: 'Sophie Mueller',
        progress: '78%'
      }, {
        id: 6,
        course: 'Physical Education',
        students: 28,
        teacher: 'Lukas Fischer',
        progress: '82%'
      }, {
        id: 7,
        course: 'Music Theory',
        students: 16,
        teacher: 'Elisabeth Gruber',
        progress: '75%'
      }, {
        id: 8,
        course: 'Environmental Studies',
        students: 20,
        teacher: 'Johannes Steiner',
        progress: '88%'
      }, {
        id: 9,
        course: 'Language Arts',
        students: 19,
        teacher: 'Anna Hoffman',
        progress: '91%'
      }, {
        id: 10,
        course: 'Social Studies',
        students: 21,
        teacher: 'Michael Koch',
        progress: '70%'
      }];
      const totalPages = Math.ceil(allData.length / itemsPerPage);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedData = allData.slice(startIndex, startIndex + itemsPerPage);
      return <div className="space-y-4">
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeader>Course</TableHeader>
                <TableHeader>Students</TableHeader>
                <TableHeader>Teacher</TableHeader>
                <TableHeader>Progress</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map(row => <TableRow key={row.id}>
                  <TableCell>{row.course}</TableCell>
                  <TableCell>{row.students}</TableCell>
                  <TableCell>{row.teacher}</TableCell>
                  <TableCell>{row.progress}</TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, allData.length)} of {allData.length}{' '}
              results
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({
                length: totalPages
              }, (_, i) => i + 1).map(page => <Button key={page} variant={currentPage === page ? 'solid' : 'outline'} onClick={() => setCurrentPage(page)}>
                    {page}
                  </Button>)}
              </div>
              <Button variant="outline" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                Next
              </Button>
            </div>
          </div>
        </div>;
    };
    return <PaginatedTable />;
  }
}`,...(we=(ye=B.parameters)==null?void 0:ye.docs)==null?void 0:we.source},description:{story:`Table with pagination controls.

Demonstrates paginated data display with navigation controls.`,...(ke=(fe=B.parameters)==null?void 0:fe.docs)==null?void 0:ke.description}}};var He,Se,Re,Be,ze;z.parameters={...z.parameters,docs:{...(He=z.parameters)==null?void 0:He.docs,source:{originalSource:`{
  render: () => <div className="max-w-2xl">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Transaction ID</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Description</TableHeader>
            <TableHeader>Category</TableHeader>
            <TableHeader>Amount</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>TXN-2025-001</TableCell>
            <TableCell>2025-11-13</TableCell>
            <TableCell>Workshop Registration - Mindfulness Basics</TableCell>
            <TableCell>Education</TableCell>
            <TableCell>€45.00</TableCell>
            <TableCell>
              <Badge variant="secondary" style={{
              backgroundColor: 'var(--primary)20',
              color: 'var(--primary)'
            }}>
                Completed
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>TXN-2025-002</TableCell>
            <TableCell>2025-11-12</TableCell>
            <TableCell>Crystal Singing Bowl Purchase</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>€180.00</TableCell>
            <TableCell>
              <Badge variant="secondary" style={{
              backgroundColor: 'var(--primary)20',
              color: 'var(--primary)'
            }}>
                Completed
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>TXN-2025-003</TableCell>
            <TableCell>2025-11-10</TableCell>
            <TableCell>Monthly Membership Subscription</TableCell>
            <TableCell>Subscription</TableCell>
            <TableCell>€29.99</TableCell>
            <TableCell>
              <Badge variant="outline">Pending</Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
}`,...(Re=(Se=z.parameters)==null?void 0:Se.docs)==null?void 0:Re.source},description:{story:`Responsive table with horizontal scroll.

Demonstrates how table handles overflow on small screens.`,...(ze=(Be=z.parameters)==null?void 0:Be.docs)==null?void 0:ze.description}}};var Ne,Me,Ae,Pe,Ee;N.parameters={...N.parameters,docs:{...(Ne=N.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
  render: () => {
    const AdminTable = () => {
      const users = [{
        id: 1,
        name: 'Anna Schmidt',
        email: 'anna.schmidt@ozean-licht.dev',
        role: 'Administrator',
        entity: 'Ozean Licht',
        status: 'active',
        lastLogin: '2025-11-13 14:32'
      }, {
        id: 2,
        name: 'Markus Weber',
        email: 'markus.weber@ozean-licht.dev',
        role: 'Editor',
        entity: 'Ozean Licht',
        status: 'active',
        lastLogin: '2025-11-13 10:15'
      }, {
        id: 3,
        name: 'Sophie Mueller',
        email: 'sophie.mueller@ozean-licht.dev',
        role: 'Viewer',
        entity: 'Ozean Licht',
        status: 'inactive',
        lastLogin: '2025-11-05 16:42'
      }, {
        id: 4,
        name: 'Lukas Fischer',
        email: 'lukas.fischer@kids-ascension.dev',
        role: 'Teacher',
        entity: 'Kids Ascension',
        status: 'active',
        lastLogin: '2025-11-13 09:28'
      }, {
        id: 5,
        name: 'Maria Huber',
        email: 'maria.huber@kids-ascension.dev',
        role: 'Teacher',
        entity: 'Kids Ascension',
        status: 'active',
        lastLogin: '2025-11-12 18:50'
      }];
      const getStatusBadge = (status: string) => {
        if (status === 'active') {
          return <Badge variant="secondary" style={{
            backgroundColor: 'var(--primary)20',
            color: 'var(--primary)'
          }}>
              Active
            </Badge>;
        }
        return <Badge variant="outline" style={{
          color: '#71717a'
        }}>
            Inactive
          </Badge>;
      };
      return <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">User Management</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Manage users across both entities</p>
            </div>
            <Button style={{
            backgroundColor: 'var(--primary)',
            color: 'white'
          }}>Add User</Button>
          </div>
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeader>User</TableHeader>
                <TableHeader>Entity</TableHeader>
                <TableHeader>Role</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Last Login</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-zinc-900 dark:text-white">{user.name}</div>
                      <div className="text-sm text-zinc-500 dark:text-zinc-400">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{user.entity}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="plain" size="sm">
                        Edit
                      </Button>
                      <Button variant="plain" size="sm" style={{
                    color: '#ef4444'
                  }}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </div>;
    };
    return <AdminTable />;
  }
}`,...(Ae=(Me=N.parameters)==null?void 0:Me.docs)==null?void 0:Ae.source},description:{story:`Dashboard-style admin table with realistic data.

Demonstrates a complete admin dashboard table with status badges, actions, and rich data.`,...(Ee=(Pe=N.parameters)==null?void 0:Pe.docs)==null?void 0:Ee.description}}};var De,Ie,_e,Le,We;M.parameters={...M.parameters,docs:{...(De=M.parameters)==null?void 0:De.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold" style={{
        color: 'var(--primary)'
      }}>
          Workshop Schedule
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Upcoming workshops with Ozean Licht turquoise accents
        </p>
      </div>
      <Table striped>
        <TableHead>
          <TableRow>
            <TableHeader style={{
            color: 'var(--primary)'
          }}>Workshop</TableHeader>
            <TableHeader style={{
            color: 'var(--primary)'
          }}>Instructor</TableHeader>
            <TableHeader style={{
            color: 'var(--primary)'
          }}>Date</TableHeader>
            <TableHeader style={{
            color: 'var(--primary)'
          }}>Capacity</TableHeader>
            <TableHeader style={{
            color: 'var(--primary)'
          }}>Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <span className="font-medium" style={{
              color: 'var(--primary)'
            }}>
                Mindfulness Basics
              </span>
            </TableCell>
            <TableCell>Maria Huber</TableCell>
            <TableCell>Nov 20, 2025</TableCell>
            <TableCell>12 / 15</TableCell>
            <TableCell>
              <Badge variant="secondary" style={{
              backgroundColor: 'var(--primary)20',
              color: 'var(--primary)'
            }}>
                Available
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <span className="font-medium" style={{
              color: 'var(--primary)'
            }}>
                Crystal Healing Workshop
              </span>
            </TableCell>
            <TableCell>Thomas Bauer</TableCell>
            <TableCell>Nov 22, 2025</TableCell>
            <TableCell>8 / 10</TableCell>
            <TableCell>
              <Badge variant="secondary" style={{
              backgroundColor: 'var(--primary)20',
              color: 'var(--primary)'
            }}>
                Available
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <span className="font-medium" style={{
              color: 'var(--primary)'
            }}>
                Meditation Intensive
              </span>
            </TableCell>
            <TableCell>Elisabeth Gruber</TableCell>
            <TableCell>Nov 25, 2025</TableCell>
            <TableCell>15 / 20</TableCell>
            <TableCell>
              <Badge variant="secondary" style={{
              backgroundColor: 'var(--primary)20',
              color: 'var(--primary)'
            }}>
                Available
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <span className="font-medium" style={{
              color: 'var(--primary)'
            }}>
                Energy Work Fundamentals
              </span>
            </TableCell>
            <TableCell>Johannes Steiner</TableCell>
            <TableCell>Nov 28, 2025</TableCell>
            <TableCell>12 / 12</TableCell>
            <TableCell>
              <Badge variant="outline" style={{
              borderColor: '#ef4444',
              color: '#ef4444'
            }}>
                Full
              </Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="flex justify-end gap-2">
        <Button variant="outline" style={{
        borderColor: 'var(--primary)',
        color: 'var(--primary)'
      }}>
          View All Workshops
        </Button>
        <Button style={{
        backgroundColor: 'var(--primary)',
        color: 'white'
      }}>Create Workshop</Button>
      </div>
    </div>
}`,...(_e=(Ie=M.parameters)==null?void 0:Ie.docs)==null?void 0:_e.source},description:{story:`Ozean Licht themed table.

Demonstrates applying Ozean Licht turquoise (var(--primary)) accents to table elements.`,...(We=(Le=M.parameters)==null?void 0:Le.docs)==null?void 0:We.description}}};var Ve,Fe,Ge,Oe,Ue;A.parameters={...A.parameters,docs:{...(Ve=A.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
  render: () => <Table grid dense striped>
      <TableHead>
        <TableRow>
          <TableHeader>Service</TableHeader>
          <TableHeader>Host</TableHeader>
          <TableHeader>Port</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>Uptime</TableHeader>
          <TableHeader>CPU</TableHeader>
          <TableHeader>Memory</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Admin Dashboard</TableCell>
          <TableCell>coolify.ozean-licht.dev</TableCell>
          <TableCell>9200</TableCell>
          <TableCell>
            <Badge variant="secondary" style={{
            backgroundColor: 'var(--primary)20',
            color: 'var(--primary)'
          }}>
              Running
            </Badge>
          </TableCell>
          <TableCell>24d 16h</TableCell>
          <TableCell>12%</TableCell>
          <TableCell>342 MB</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>MCP Gateway</TableCell>
          <TableCell>coolify.ozean-licht.dev</TableCell>
          <TableCell>8100</TableCell>
          <TableCell>
            <Badge variant="secondary" style={{
            backgroundColor: 'var(--primary)20',
            color: 'var(--primary)'
          }}>
              Running
            </Badge>
          </TableCell>
          <TableCell>24d 16h</TableCell>
          <TableCell>8%</TableCell>
          <TableCell>256 MB</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>PostgreSQL</TableCell>
          <TableCell>138.201.139.25</TableCell>
          <TableCell>5432</TableCell>
          <TableCell>
            <Badge variant="secondary" style={{
            backgroundColor: 'var(--primary)20',
            color: 'var(--primary)'
          }}>
              Running
            </Badge>
          </TableCell>
          <TableCell>24d 16h</TableCell>
          <TableCell>18%</TableCell>
          <TableCell>1.2 GB</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>MinIO</TableCell>
          <TableCell>138.201.139.25</TableCell>
          <TableCell>9000</TableCell>
          <TableCell>
            <Badge variant="secondary" style={{
            backgroundColor: 'var(--primary)20',
            color: 'var(--primary)'
          }}>
              Running
            </Badge>
          </TableCell>
          <TableCell>24d 16h</TableCell>
          <TableCell>5%</TableCell>
          <TableCell>512 MB</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Grafana</TableCell>
          <TableCell>grafana.ozean-licht.dev</TableCell>
          <TableCell>3000</TableCell>
          <TableCell>
            <Badge variant="secondary" style={{
            backgroundColor: 'var(--primary)20',
            color: 'var(--primary)'
          }}>
              Running
            </Badge>
          </TableCell>
          <TableCell>24d 16h</TableCell>
          <TableCell>3%</TableCell>
          <TableCell>198 MB</TableCell>
        </TableRow>
      </TableBody>
    </Table>
}`,...(Ge=(Fe=A.parameters)==null?void 0:Fe.docs)==null?void 0:Ge.source},description:{story:`Combined features table.

Demonstrates multiple features working together: grid, dense, and custom styling.`,...(Ue=(Oe=A.parameters)==null?void 0:Oe.docs)==null?void 0:Ue.description}}};var qe,Qe,Je,Ke,Xe;P.parameters={...P.parameters,docs:{...(qe=P.parameters)==null?void 0:qe.docs,source:{originalSource:`{
  render: () => <Table striped>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Email</TableHeader>
          <TableHeader>Actions</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell data-testid="user-name-1">Anna Schmidt</TableCell>
          <TableCell>anna.schmidt@ozean-licht.dev</TableCell>
          <TableCell>
            <Button variant="plain" size="sm" data-testid="edit-button-1">
              Edit
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell data-testid="user-name-2">Markus Weber</TableCell>
          <TableCell>markus.weber@ozean-licht.dev</TableCell>
          <TableCell>
            <Button variant="plain" size="sm" data-testid="edit-button-2">
              Edit
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // Verify table renders with correct data
    const userName1 = canvas.getByTestId('user-name-1');
    await expect(userName1).toHaveTextContent('Anna Schmidt');
    const userName2 = canvas.getByTestId('user-name-2');
    await expect(userName2).toHaveTextContent('Markus Weber');

    // Test button interaction
    const editButton = canvas.getByTestId('edit-button-1');
    await userEvent.click(editButton);
  }
}`,...(Je=(Qe=P.parameters)==null?void 0:Qe.docs)==null?void 0:Je.source},description:{story:`Interactive test with play function.

Tests table interactions using Storybook testing utilities.`,...(Xe=(Ke=P.parameters)==null?void 0:Ke.docs)==null?void 0:Xe.description}}};const Sl=["Default","Striped","Grid","Dense","ClickableRows","WithSorting","WithSelection","WithPagination","ResponsiveTable","DashboardTable","OzeanLichtThemed","CombinedFeatures","InteractiveTest"];export{H as ClickableRows,A as CombinedFeatures,N as DashboardTable,y as Default,k as Dense,f as Grid,P as InteractiveTest,M as OzeanLichtThemed,z as ResponsiveTable,w as Striped,B as WithPagination,R as WithSelection,S as WithSorting,Sl as __namedExportsOrder,Hl as default};
