import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{f as Et}from"./index-CJu6nLMj.js";import{r as l}from"./index-B2-qRKKC.js";import{c as ht}from"./index-BdQq_4o_.js";import{c as Mt,a as k,P as re}from"./index-D4_CVXg7.js";import{u as _}from"./index-BFjtS4uE.js";import{u as At}from"./index-BlCrtW8-.js";import{u as Bt}from"./index-D6fdIYSQ.js";import{u as It}from"./index-_AbP6Uzr.js";import{u as Kt}from"./index-BYfY0yFj.js";import{c as Ot}from"./index-yuRWTe36.js";import{c as zt}from"./cn-CytzSlOG.js";import{L as u}from"./label-Cp9r14oL.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-kS-9iBlu.js";import"./index-D1vk04JX.js";import"./index-B5oyz0SX.js";import"./index-BiMR7eR1.js";import"./index-DVF2XGCm.js";var vt=["PageUp","PageDown"],bt=["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"],St={"from-left":["Home","PageDown","ArrowDown","ArrowLeft"],"from-right":["Home","PageDown","ArrowDown","ArrowRight"],"from-bottom":["Home","PageDown","ArrowDown","ArrowLeft"],"from-top":["Home","PageDown","ArrowUp","ArrowLeft"]},P="Slider",[ce,Ht,Wt]=Ot(P),[jt]=Mt(P,[Wt]),[$t,ne]=jt(P),Nt=l.forwardRef((s,t)=>{const{name:a,min:r=0,max:o=100,step:d=1,orientation:n="horizontal",disabled:i=!1,minStepsBetweenThumbs:p=0,defaultValue:v=[r],value:b,onValueChange:c=()=>{},onValueCommit:x=()=>{},inverted:j=!1,form:y,...S}=s,g=l.useRef(new Set),f=l.useRef(0),N=n==="horizontal"?Gt:Ut,[h=[],T]=At({prop:b,defaultProp:v,onChange:V=>{var L;(L=[...g.current][f.current])==null||L.focus(),c(V)}}),oe=l.useRef(h);function ie(V){const w=Qt(h,V);F(V,w)}function Tt(V){F(V,f.current)}function Ft(){const V=oe.current[f.current];h[f.current]!==V&&x(h)}function F(V,w,{commit:L}={commit:!1}){const pe=ta(d),le=aa(Math.round((V-r)/d)*d+r,pe),E=ht(le,[r,o]);T((D=[])=>{const R=Xt(D,E,w);if(sa(R,p*d)){f.current=R.indexOf(E);const xe=String(R)!==String(D);return xe&&L&&x(R),xe?R:D}else return D})}return e.jsx($t,{scope:s.__scopeSlider,name:a,disabled:i,min:r,max:o,valueIndexToChangeRef:f,thumbs:g.current,values:h,orientation:n,form:y,children:e.jsx(ce.Provider,{scope:s.__scopeSlider,children:e.jsx(ce.Slot,{scope:s.__scopeSlider,children:e.jsx(N,{"aria-disabled":i,"data-disabled":i?"":void 0,...S,ref:t,onPointerDown:k(S.onPointerDown,()=>{i||(oe.current=h)}),min:r,max:o,inverted:j,onSlideStart:i?void 0:ie,onSlideMove:i?void 0:Tt,onSlideEnd:i?void 0:Ft,onHomeKeyDown:()=>!i&&F(r,0,{commit:!0}),onEndKeyDown:()=>!i&&F(o,h.length-1,{commit:!0}),onStepKeyDown:({event:V,direction:w})=>{if(!i){const le=vt.includes(V.key)||V.shiftKey&&bt.includes(V.key)?10:1,E=f.current,D=h[E],R=d*le*w;F(D+R,E,{commit:!0})}}})})})})});Nt.displayName=P;var[Vt,yt]=jt(P,{startEdge:"left",endEdge:"right",size:"width",direction:1}),Gt=l.forwardRef((s,t)=>{const{min:a,max:r,dir:o,inverted:d,onSlideStart:n,onSlideMove:i,onSlideEnd:p,onStepKeyDown:v,...b}=s,[c,x]=l.useState(null),j=_(t,N=>x(N)),y=l.useRef(void 0),S=Bt(o),g=S==="ltr",f=g&&!d||!g&&d;function C(N){const h=y.current||c.getBoundingClientRect(),T=[0,h.width],ie=ue(T,f?[a,r]:[r,a]);return y.current=h,ie(N-h.left)}return e.jsx(Vt,{scope:s.__scopeSlider,startEdge:f?"left":"right",endEdge:f?"right":"left",direction:f?1:-1,size:"width",children:e.jsx(wt,{dir:S,"data-orientation":"horizontal",...b,ref:j,style:{...b.style,"--radix-slider-thumb-transform":"translateX(-50%)"},onSlideStart:N=>{const h=C(N.clientX);n==null||n(h)},onSlideMove:N=>{const h=C(N.clientX);i==null||i(h)},onSlideEnd:()=>{y.current=void 0,p==null||p()},onStepKeyDown:N=>{const T=St[f?"from-left":"from-right"].includes(N.key);v==null||v({event:N,direction:T?-1:1})}})})}),Ut=l.forwardRef((s,t)=>{const{min:a,max:r,inverted:o,onSlideStart:d,onSlideMove:n,onSlideEnd:i,onStepKeyDown:p,...v}=s,b=l.useRef(null),c=_(t,b),x=l.useRef(void 0),j=!o;function y(S){const g=x.current||b.current.getBoundingClientRect(),f=[0,g.height],N=ue(f,j?[r,a]:[a,r]);return x.current=g,N(S-g.top)}return e.jsx(Vt,{scope:s.__scopeSlider,startEdge:j?"bottom":"top",endEdge:j?"top":"bottom",size:"height",direction:j?1:-1,children:e.jsx(wt,{"data-orientation":"vertical",...v,ref:c,style:{...v.style,"--radix-slider-thumb-transform":"translateY(50%)"},onSlideStart:S=>{const g=y(S.clientY);d==null||d(g)},onSlideMove:S=>{const g=y(S.clientY);n==null||n(g)},onSlideEnd:()=>{x.current=void 0,i==null||i()},onStepKeyDown:S=>{const f=St[j?"from-bottom":"from-top"].includes(S.key);p==null||p({event:S,direction:f?-1:1})}})})}),wt=l.forwardRef((s,t)=>{const{__scopeSlider:a,onSlideStart:r,onSlideMove:o,onSlideEnd:d,onHomeKeyDown:n,onEndKeyDown:i,onStepKeyDown:p,...v}=s,b=ne(P,a);return e.jsx(re.span,{...v,ref:t,onKeyDown:k(s.onKeyDown,c=>{c.key==="Home"?(n(c),c.preventDefault()):c.key==="End"?(i(c),c.preventDefault()):vt.concat(bt).includes(c.key)&&(p(c),c.preventDefault())}),onPointerDown:k(s.onPointerDown,c=>{const x=c.target;x.setPointerCapture(c.pointerId),c.preventDefault(),b.thumbs.has(x)?x.focus():r(c)}),onPointerMove:k(s.onPointerMove,c=>{c.target.hasPointerCapture(c.pointerId)&&o(c)}),onPointerUp:k(s.onPointerUp,c=>{const x=c.target;x.hasPointerCapture(c.pointerId)&&(x.releasePointerCapture(c.pointerId),d(c))})})}),Rt="SliderTrack",Ct=l.forwardRef((s,t)=>{const{__scopeSlider:a,...r}=s,o=ne(Rt,a);return e.jsx(re.span,{"data-disabled":o.disabled?"":void 0,"data-orientation":o.orientation,...r,ref:t})});Ct.displayName=Rt;var de="SliderRange",Lt=l.forwardRef((s,t)=>{const{__scopeSlider:a,...r}=s,o=ne(de,a),d=yt(de,a),n=l.useRef(null),i=_(t,n),p=o.values.length,v=o.values.map(x=>_t(x,o.min,o.max)),b=p>1?Math.min(...v):0,c=100-Math.max(...v);return e.jsx(re.span,{"data-orientation":o.orientation,"data-disabled":o.disabled?"":void 0,...r,ref:i,style:{...s.style,[d.startEdge]:b+"%",[d.endEdge]:c+"%"}})});Lt.displayName=de;var me="SliderThumb",Dt=l.forwardRef((s,t)=>{const a=Ht(s.__scopeSlider),[r,o]=l.useState(null),d=_(t,i=>o(i)),n=l.useMemo(()=>r?a().findIndex(i=>i.ref.current===r):-1,[a,r]);return e.jsx(Yt,{...s,ref:d,index:n})}),Yt=l.forwardRef((s,t)=>{const{__scopeSlider:a,index:r,name:o,...d}=s,n=ne(me,a),i=yt(me,a),[p,v]=l.useState(null),b=_(t,C=>v(C)),c=p?n.form||!!p.closest("form"):!0,x=Kt(p),j=n.values[r],y=j===void 0?0:_t(j,n.min,n.max),S=Jt(r,n.values.length),g=x==null?void 0:x[i.size],f=g?Zt(g,y,i.direction):0;return l.useEffect(()=>{if(p)return n.thumbs.add(p),()=>{n.thumbs.delete(p)}},[p,n.thumbs]),e.jsxs("span",{style:{transform:"var(--radix-slider-thumb-transform)",position:"absolute",[i.startEdge]:`calc(${y}% + ${f}px)`},children:[e.jsx(ce.ItemSlot,{scope:s.__scopeSlider,children:e.jsx(re.span,{role:"slider","aria-label":s["aria-label"]||S,"aria-valuemin":n.min,"aria-valuenow":j,"aria-valuemax":n.max,"aria-orientation":n.orientation,"data-orientation":n.orientation,"data-disabled":n.disabled?"":void 0,tabIndex:n.disabled?void 0:0,...d,ref:b,style:j===void 0?{display:"none"}:s.style,onFocus:k(s.onFocus,()=>{n.valueIndexToChangeRef.current=r})})}),c&&e.jsx(kt,{name:o??(n.name?n.name+(n.values.length>1?"[]":""):void 0),form:n.form,value:j},r)]})});Dt.displayName=me;var qt="RadioBubbleInput",kt=l.forwardRef(({__scopeSlider:s,value:t,...a},r)=>{const o=l.useRef(null),d=_(o,r),n=It(t);return l.useEffect(()=>{const i=o.current;if(!i)return;const p=window.HTMLInputElement.prototype,b=Object.getOwnPropertyDescriptor(p,"value").set;if(n!==t&&b){const c=new Event("input",{bubbles:!0});b.call(i,t),i.dispatchEvent(c)}},[n,t]),e.jsx(re.input,{style:{display:"none"},...a,ref:d,defaultValue:t})});kt.displayName=qt;function Xt(s=[],t,a){const r=[...s];return r[a]=t,r.sort((o,d)=>o-d)}function _t(s,t,a){const d=100/(a-t)*(s-t);return ht(d,[0,100])}function Jt(s,t){return t>2?`Value ${s+1} of ${t}`:t===2?["Minimum","Maximum"][s]:void 0}function Qt(s,t){if(s.length===1)return 0;const a=s.map(o=>Math.abs(o-t)),r=Math.min(...a);return a.indexOf(r)}function Zt(s,t,a){const r=s/2,d=ue([0,50],[0,r]);return(r-d(t)*a)*a}function ea(s){return s.slice(0,-1).map((t,a)=>s[a+1]-t)}function sa(s,t){if(t>0){const a=ea(s);return Math.min(...a)>=t}return!0}function ue(s,t){return a=>{if(s[0]===s[1]||t[0]===t[1])return t[0];const r=(t[1]-t[0])/(s[1]-s[0]);return t[0]+r*(a-s[0])}}function ta(s){return(String(s).split(".")[1]||"").length}function aa(s,t){const a=Math.pow(10,t);return Math.round(s*a)/a}var Pt=Nt,ra=Ct,na=Lt,oa=Dt;const m=l.forwardRef(({className:s,...t},a)=>e.jsxs(Pt,{ref:a,className:zt("relative flex w-full touch-none select-none items-center",s),...t,children:[e.jsx(ra,{className:"relative h-2 w-full grow overflow-hidden rounded-full bg-secondary",children:e.jsx(na,{className:"absolute h-full bg-primary"})}),e.jsx(oa,{className:"block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"})]}));m.displayName=Pt.displayName;try{m.displayName="Slider",m.__docgenInfo={description:"",displayName:"Slider",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}const Ra={title:"Tier 1: Primitives/shadcn/Slider",component:m,parameters:{layout:"centered",docs:{description:{component:"An input where the user selects a value from within a given range."}}},tags:["autodocs"],argTypes:{min:{control:"number",description:"Minimum value"},max:{control:"number",description:"Maximum value"},step:{control:"number",description:"Step increment"},disabled:{control:"boolean",description:"Disable slider interaction"},orientation:{control:"radio",options:["horizontal","vertical"],description:"Slider orientation"},value:{control:"object",description:"Current value(s)"}},args:{onValueChange:Et()},decorators:[s=>e.jsx("div",{className:"w-[400px]",children:e.jsx(s,{})})]},M={args:{defaultValue:[50],max:100,step:1}},A={args:{defaultValue:[25],min:0,max:50,step:1}},B={args:{defaultValue:[50],max:100,step:10}},I={args:{defaultValue:[.5],min:0,max:1,step:.01}},K={args:{defaultValue:[0],max:100,step:1}},O={args:{defaultValue:[100],max:100,step:1}},z={args:{defaultValue:[25,75],max:100,step:1}},H={args:{defaultValue:[20,80],min:0,max:100,step:5}},W={args:{defaultValue:[50],max:100,step:1,disabled:!0}},$={args:{defaultValue:[25,75],max:100,step:1,disabled:!0}},G={render:()=>e.jsxs("div",{className:"grid w-full gap-2",children:[e.jsx(u,{htmlFor:"volume",children:"Volume"}),e.jsx(m,{id:"volume",defaultValue:[50],max:100,step:1})]})},U={render:()=>{const[s,t]=l.useState([50]);return e.jsxs("div",{className:"grid w-full gap-2",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx(u,{htmlFor:"brightness",children:"Brightness"}),e.jsxs("span",{className:"text-sm text-muted-foreground",children:[s[0],"%"]})]}),e.jsx(m,{id:"brightness",value:s,onValueChange:t,max:100,step:1})]})}},Y={render:()=>{const[s,t]=l.useState([25,75]);return e.jsxs("div",{className:"grid w-full gap-2",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx(u,{htmlFor:"price-range",children:"Price Range"}),e.jsxs("span",{className:"text-sm text-muted-foreground",children:["$",s[0]," - $",s[1]]})]}),e.jsx(m,{id:"price-range",value:s,onValueChange:t,max:100,step:1})]})}},q={render:()=>{const[s,t]=l.useState([70]);return e.jsxs("div",{className:"grid w-full gap-2",children:[e.jsx(u,{htmlFor:"volume-control",children:"Volume"}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("span",{className:"text-sm",children:"🔈"}),e.jsx(m,{id:"volume-control",value:s,onValueChange:t,max:100,step:1,className:"flex-1"}),e.jsx("span",{className:"text-sm",children:"🔊"}),e.jsxs("span",{className:"text-sm font-medium w-10 text-right",children:[s[0],"%"]})]})]})}},X={render:()=>{const[s,t]=l.useState([22]);return e.jsxs("div",{className:"grid w-full gap-2",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx(u,{htmlFor:"temperature",children:"Temperature"}),e.jsxs("span",{className:"text-sm font-medium",style:{color:"#0ec2bc"},children:[s[0],"°C"]})]}),e.jsx(m,{id:"temperature",value:s,onValueChange:t,min:16,max:30,step:.5,className:"[&_[role=slider]]:border-[#0ec2bc] [&_.bg-primary]:bg-[#0ec2bc]"}),e.jsxs("div",{className:"flex justify-between text-xs text-muted-foreground",children:[e.jsx("span",{children:"16°C"}),e.jsx("span",{children:"30°C"})]})]})}},J={render:()=>{const[s,t]=l.useState([3]),a=["Poor","Fair","Good","Very Good","Excellent"];return e.jsxs("div",{className:"grid w-full gap-2",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx(u,{htmlFor:"rating",children:"Rating"}),e.jsx("span",{className:"text-sm font-medium",style:{color:"#0ec2bc"},children:a[s[0]-1]})]}),e.jsx(m,{id:"rating",value:s,onValueChange:t,min:1,max:5,step:1}),e.jsxs("div",{className:"flex justify-between text-xs text-muted-foreground",children:[e.jsx("span",{children:"1 star"}),e.jsx("span",{children:"5 stars"})]})]})}},Q={render:()=>{const[s,t]=l.useState([9,17]),a=r=>`${r.toString().padStart(2,"0")}:00`;return e.jsxs("div",{className:"grid w-full gap-2",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx(u,{htmlFor:"work-hours",children:"Work Hours"}),e.jsxs("span",{className:"text-sm text-muted-foreground",children:[a(s[0])," - ",a(s[1])]})]}),e.jsx(m,{id:"work-hours",value:s,onValueChange:t,min:0,max:24,step:1}),e.jsxs("div",{className:"flex justify-between text-xs text-muted-foreground",children:[e.jsx("span",{children:"00:00"}),e.jsx("span",{children:"24:00"})]})]})}},Z={render:()=>{const[s,t]=l.useState([30]),[a,r]=l.useState([50]),[o,d]=l.useState([20]),n=s[0]+a[0]+o[0],i=n===100;return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between mb-2",children:[e.jsx(u,{htmlFor:"marketing",children:"Marketing"}),e.jsxs("span",{className:"text-sm font-medium",children:[s[0],"%"]})]}),e.jsx(m,{id:"marketing",value:s,onValueChange:t,max:100,step:5})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between mb-2",children:[e.jsx(u,{htmlFor:"development",children:"Development"}),e.jsxs("span",{className:"text-sm font-medium",children:[a[0],"%"]})]}),e.jsx(m,{id:"development",value:a,onValueChange:r,max:100,step:5})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between mb-2",children:[e.jsx(u,{htmlFor:"operations",children:"Operations"}),e.jsxs("span",{className:"text-sm font-medium",children:[o[0],"%"]})]}),e.jsx(m,{id:"operations",value:o,onValueChange:d,max:100,step:5})]}),e.jsx("div",{className:"pt-4 border-t",children:e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-sm font-medium",children:"Total Allocation"}),e.jsxs("span",{className:`text-sm font-bold ${i?"text-[#0ec2bc]":"text-red-500"}`,children:[n,"% ",i?"✓":"✗"]})]})})]})}},ee={render:()=>{const[s,t]=l.useState([50]);return e.jsxs("div",{className:"flex items-center gap-4 h-64",children:[e.jsx(m,{orientation:"vertical",value:s,onValueChange:t,max:100,step:1,className:"h-full"}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(u,{children:"Volume"}),e.jsxs("span",{className:"text-sm text-muted-foreground",children:[s[0],"%"]})]})]})}},se={render:()=>{const[s,t]=l.useState([25,75]);return e.jsxs("div",{className:"flex items-center gap-4 h-64",children:[e.jsx(m,{orientation:"vertical",value:s,onValueChange:t,max:100,step:1,className:"h-full"}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(u,{children:"Range"}),e.jsxs("span",{className:"text-sm text-muted-foreground",children:[s[0],"% - ",s[1],"%"]})]})]})}},te={render:()=>{const[s,t]=l.useState([70]),[a,r]=l.useState([80]),[o,d]=l.useState([50]),[n,i]=l.useState([22]);return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h3",{className:"text-lg font-medium",children:"Display Settings"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between mb-2",children:[e.jsx(u,{htmlFor:"form-volume",children:"Volume"}),e.jsxs("span",{className:"text-sm text-muted-foreground",children:[s[0],"%"]})]}),e.jsx(m,{id:"form-volume",value:s,onValueChange:t,max:100,step:1})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between mb-2",children:[e.jsx(u,{htmlFor:"form-brightness",children:"Brightness"}),e.jsxs("span",{className:"text-sm text-muted-foreground",children:[a[0],"%"]})]}),e.jsx(m,{id:"form-brightness",value:a,onValueChange:r,max:100,step:1})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between mb-2",children:[e.jsx(u,{htmlFor:"form-contrast",children:"Contrast"}),e.jsxs("span",{className:"text-sm text-muted-foreground",children:[o[0],"%"]})]}),e.jsx(m,{id:"form-contrast",value:o,onValueChange:d,max:100,step:1})]}),e.jsxs("div",{className:"pt-4 border-t",children:[e.jsxs("div",{className:"flex justify-between mb-2",children:[e.jsx(u,{htmlFor:"form-temp",children:"Color Temperature"}),e.jsxs("span",{className:"text-sm font-medium",style:{color:"#0ec2bc"},children:[n[0],"°C"]})]}),e.jsx(m,{id:"form-temp",value:n,onValueChange:i,min:16,max:30,step:.5,className:"[&_[role=slider]]:border-[#0ec2bc] [&_.bg-primary]:bg-[#0ec2bc]"})]})]})]})}},ae={render:()=>e.jsxs("div",{className:"space-y-8",children:[e.jsxs("div",{children:[e.jsx(u,{className:"text-base mb-2 block",children:"Single Value (Default)"}),e.jsx(m,{defaultValue:[50],max:100,step:1})]}),e.jsxs("div",{children:[e.jsx(u,{className:"text-base mb-2 block",children:"Range (Two Thumbs)"}),e.jsx(m,{defaultValue:[25,75],max:100,step:1})]}),e.jsxs("div",{children:[e.jsx(u,{className:"text-base mb-2 block",children:"With Steps (Increments of 10)"}),e.jsx(m,{defaultValue:[50],max:100,step:10})]}),e.jsxs("div",{children:[e.jsx(u,{className:"text-base mb-2 block",children:"At Minimum (0)"}),e.jsx(m,{defaultValue:[0],max:100,step:1})]}),e.jsxs("div",{children:[e.jsx(u,{className:"text-base mb-2 block",children:"At Maximum (100)"}),e.jsx(m,{defaultValue:[100],max:100,step:1})]}),e.jsxs("div",{children:[e.jsx(u,{className:"text-base mb-2 block text-muted-foreground",children:"Disabled"}),e.jsx(m,{defaultValue:[50],max:100,step:1,disabled:!0})]}),e.jsxs("div",{children:[e.jsx(u,{className:"text-base mb-2 block text-muted-foreground",children:"Disabled Range"}),e.jsx(m,{defaultValue:[25,75],max:100,step:1,disabled:!0})]}),e.jsxs("div",{children:[e.jsx(u,{className:"text-base mb-2 block",children:"Custom Styling (Ozean Licht Turquoise)"}),e.jsx(m,{defaultValue:[60],max:100,step:1,className:"[&_[role=slider]]:border-[#0ec2bc] [&_.bg-primary]:bg-[#0ec2bc]"})]})]})};var fe,ge,he,ve,be;M.parameters={...M.parameters,docs:{...(fe=M.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  args: {
    defaultValue: [50],
    max: 100,
    step: 1
  }
}`,...(he=(ge=M.parameters)==null?void 0:ge.docs)==null?void 0:he.source},description:{story:"Default slider with single value (0-100 range)",...(be=(ve=M.parameters)==null?void 0:ve.docs)==null?void 0:be.description}}};var Se,je,Ne,Ve,ye;A.parameters={...A.parameters,docs:{...(Se=A.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  args: {
    defaultValue: [25],
    min: 0,
    max: 50,
    step: 1
  }
}`,...(Ne=(je=A.parameters)==null?void 0:je.docs)==null?void 0:Ne.source},description:{story:"Slider with custom min and max values",...(ye=(Ve=A.parameters)==null?void 0:Ve.docs)==null?void 0:ye.description}}};var we,Re,Ce,Le,De;B.parameters={...B.parameters,docs:{...(we=B.parameters)==null?void 0:we.docs,source:{originalSource:`{
  args: {
    defaultValue: [50],
    max: 100,
    step: 10
  }
}`,...(Ce=(Re=B.parameters)==null?void 0:Re.docs)==null?void 0:Ce.source},description:{story:"Slider with step increments",...(De=(Le=B.parameters)==null?void 0:Le.docs)==null?void 0:De.description}}};var ke,_e,Pe,Te,Fe;I.parameters={...I.parameters,docs:{...(ke=I.parameters)==null?void 0:ke.docs,source:{originalSource:`{
  args: {
    defaultValue: [0.5],
    min: 0,
    max: 1,
    step: 0.01
  }
}`,...(Pe=(_e=I.parameters)==null?void 0:_e.docs)==null?void 0:Pe.source},description:{story:"Fine-grained slider with small steps",...(Fe=(Te=I.parameters)==null?void 0:Te.docs)==null?void 0:Fe.description}}};var Ee,Me,Ae,Be,Ie;K.parameters={...K.parameters,docs:{...(Ee=K.parameters)==null?void 0:Ee.docs,source:{originalSource:`{
  args: {
    defaultValue: [0],
    max: 100,
    step: 1
  }
}`,...(Ae=(Me=K.parameters)==null?void 0:Me.docs)==null?void 0:Ae.source},description:{story:"Slider starting at minimum value",...(Ie=(Be=K.parameters)==null?void 0:Be.docs)==null?void 0:Ie.description}}};var Ke,Oe,ze,He,We;O.parameters={...O.parameters,docs:{...(Ke=O.parameters)==null?void 0:Ke.docs,source:{originalSource:`{
  args: {
    defaultValue: [100],
    max: 100,
    step: 1
  }
}`,...(ze=(Oe=O.parameters)==null?void 0:Oe.docs)==null?void 0:ze.source},description:{story:"Slider starting at maximum value",...(We=(He=O.parameters)==null?void 0:He.docs)==null?void 0:We.description}}};var $e,Ge,Ue,Ye,qe;z.parameters={...z.parameters,docs:{...($e=z.parameters)==null?void 0:$e.docs,source:{originalSource:`{
  args: {
    defaultValue: [25, 75],
    max: 100,
    step: 1
  }
}`,...(Ue=(Ge=z.parameters)==null?void 0:Ge.docs)==null?void 0:Ue.source},description:{story:"Range slider with two thumbs for selecting a range",...(qe=(Ye=z.parameters)==null?void 0:Ye.docs)==null?void 0:qe.description}}};var Xe,Je,Qe,Ze,es;H.parameters={...H.parameters,docs:{...(Xe=H.parameters)==null?void 0:Xe.docs,source:{originalSource:`{
  args: {
    defaultValue: [20, 80],
    min: 0,
    max: 100,
    step: 5
  }
}`,...(Qe=(Je=H.parameters)==null?void 0:Je.docs)==null?void 0:Qe.source},description:{story:"Range slider with custom boundaries",...(es=(Ze=H.parameters)==null?void 0:Ze.docs)==null?void 0:es.description}}};var ss,ts,as,rs,ns;W.parameters={...W.parameters,docs:{...(ss=W.parameters)==null?void 0:ss.docs,source:{originalSource:`{
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    disabled: true
  }
}`,...(as=(ts=W.parameters)==null?void 0:ts.docs)==null?void 0:as.source},description:{story:"Disabled slider state",...(ns=(rs=W.parameters)==null?void 0:rs.docs)==null?void 0:ns.description}}};var os,is,ls,cs,ds;$.parameters={...$.parameters,docs:{...(os=$.parameters)==null?void 0:os.docs,source:{originalSource:`{
  args: {
    defaultValue: [25, 75],
    max: 100,
    step: 1,
    disabled: true
  }
}`,...(ls=(is=$.parameters)==null?void 0:is.docs)==null?void 0:ls.source},description:{story:"Disabled range slider",...(ds=(cs=$.parameters)==null?void 0:cs.docs)==null?void 0:ds.description}}};var ms,us,ps,xs,fs;G.parameters={...G.parameters,docs:{...(ms=G.parameters)==null?void 0:ms.docs,source:{originalSource:`{
  render: () => <div className="grid w-full gap-2">
      <Label htmlFor="volume">Volume</Label>
      <Slider id="volume" defaultValue={[50]} max={100} step={1} />
    </div>
}`,...(ps=(us=G.parameters)==null?void 0:us.docs)==null?void 0:ps.source},description:{story:"Slider with label",...(fs=(xs=G.parameters)==null?void 0:xs.docs)==null?void 0:fs.description}}};var gs,hs,vs,bs,Ss;U.parameters={...U.parameters,docs:{...(gs=U.parameters)==null?void 0:gs.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = React.useState([50]);
    return <div className="grid w-full gap-2">
        <div className="flex justify-between">
          <Label htmlFor="brightness">Brightness</Label>
          <span className="text-sm text-muted-foreground">{value[0]}%</span>
        </div>
        <Slider id="brightness" value={value} onValueChange={setValue} max={100} step={1} />
      </div>;
  }
}`,...(vs=(hs=U.parameters)==null?void 0:hs.docs)==null?void 0:vs.source},description:{story:"Slider with label and value display",...(Ss=(bs=U.parameters)==null?void 0:bs.docs)==null?void 0:Ss.description}}};var js,Ns,Vs,ys,ws;Y.parameters={...Y.parameters,docs:{...(js=Y.parameters)==null?void 0:js.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = React.useState([25, 75]);
    return <div className="grid w-full gap-2">
        <div className="flex justify-between">
          <Label htmlFor="price-range">Price Range</Label>
          <span className="text-sm text-muted-foreground">
            \${value[0]} - \${value[1]}
          </span>
        </div>
        <Slider id="price-range" value={value} onValueChange={setValue} max={100} step={1} />
      </div>;
  }
}`,...(Vs=(Ns=Y.parameters)==null?void 0:Ns.docs)==null?void 0:Vs.source},description:{story:"Range slider with value display",...(ws=(ys=Y.parameters)==null?void 0:ys.docs)==null?void 0:ws.description}}};var Rs,Cs,Ls,Ds,ks;q.parameters={...q.parameters,docs:{...(Rs=q.parameters)==null?void 0:Rs.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = React.useState([70]);
    return <div className="grid w-full gap-2">
        <Label htmlFor="volume-control">Volume</Label>
        <div className="flex items-center gap-3">
          <span className="text-sm">🔈</span>
          <Slider id="volume-control" value={value} onValueChange={setValue} max={100} step={1} className="flex-1" />
          <span className="text-sm">🔊</span>
          <span className="text-sm font-medium w-10 text-right">{value[0]}%</span>
        </div>
      </div>;
  }
}`,...(Ls=(Cs=q.parameters)==null?void 0:Cs.docs)==null?void 0:Ls.source},description:{story:"Volume control example with icon",...(ks=(Ds=q.parameters)==null?void 0:Ds.docs)==null?void 0:ks.description}}};var _s,Ps,Ts,Fs,Es;X.parameters={...X.parameters,docs:{...(_s=X.parameters)==null?void 0:_s.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = React.useState([22]);
    return <div className="grid w-full gap-2">
        <div className="flex justify-between">
          <Label htmlFor="temperature">Temperature</Label>
          <span className="text-sm font-medium" style={{
          color: '#0ec2bc'
        }}>
            {value[0]}°C
          </span>
        </div>
        <Slider id="temperature" value={value} onValueChange={setValue} min={16} max={30} step={0.5} className="[&_[role=slider]]:border-[#0ec2bc] [&_.bg-primary]:bg-[#0ec2bc]" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>16°C</span>
          <span>30°C</span>
        </div>
      </div>;
  }
}`,...(Ts=(Ps=X.parameters)==null?void 0:Ps.docs)==null?void 0:Ts.source},description:{story:"Temperature control with colored track (Ozean Licht turquoise accent)",...(Es=(Fs=X.parameters)==null?void 0:Fs.docs)==null?void 0:Es.description}}};var Ms,As,Bs,Is,Ks;J.parameters={...J.parameters,docs:{...(Ms=J.parameters)==null?void 0:Ms.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = React.useState([3]);
    const ratings = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return <div className="grid w-full gap-2">
        <div className="flex justify-between">
          <Label htmlFor="rating">Rating</Label>
          <span className="text-sm font-medium" style={{
          color: '#0ec2bc'
        }}>
            {ratings[value[0] - 1]}
          </span>
        </div>
        <Slider id="rating" value={value} onValueChange={setValue} min={1} max={5} step={1} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1 star</span>
          <span>5 stars</span>
        </div>
      </div>;
  }
}`,...(Bs=(As=J.parameters)==null?void 0:As.docs)==null?void 0:Bs.source},description:{story:"Rating selector (discrete steps)",...(Ks=(Is=J.parameters)==null?void 0:Is.docs)==null?void 0:Ks.description}}};var Os,zs,Hs,Ws,$s;Q.parameters={...Q.parameters,docs:{...(Os=Q.parameters)==null?void 0:Os.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = React.useState([9, 17]);
    const formatTime = (hour: number) => {
      return \`\${hour.toString().padStart(2, '0')}:00\`;
    };
    return <div className="grid w-full gap-2">
        <div className="flex justify-between">
          <Label htmlFor="work-hours">Work Hours</Label>
          <span className="text-sm text-muted-foreground">
            {formatTime(value[0])} - {formatTime(value[1])}
          </span>
        </div>
        <Slider id="work-hours" value={value} onValueChange={setValue} min={0} max={24} step={1} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>00:00</span>
          <span>24:00</span>
        </div>
      </div>;
  }
}`,...(Hs=(zs=Q.parameters)==null?void 0:zs.docs)==null?void 0:Hs.source},description:{story:"Time range picker (24-hour format)",...($s=(Ws=Q.parameters)==null?void 0:Ws.docs)==null?void 0:$s.description}}};var Gs,Us,Ys,qs,Xs;Z.parameters={...Z.parameters,docs:{...(Gs=Z.parameters)==null?void 0:Gs.docs,source:{originalSource:`{
  render: () => {
    const [marketing, setMarketing] = React.useState([30]);
    const [development, setDevelopment] = React.useState([50]);
    const [operations, setOperations] = React.useState([20]);
    const total = marketing[0] + development[0] + operations[0];
    const isValid = total === 100;
    return <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <Label htmlFor="marketing">Marketing</Label>
            <span className="text-sm font-medium">{marketing[0]}%</span>
          </div>
          <Slider id="marketing" value={marketing} onValueChange={setMarketing} max={100} step={5} />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <Label htmlFor="development">Development</Label>
            <span className="text-sm font-medium">{development[0]}%</span>
          </div>
          <Slider id="development" value={development} onValueChange={setDevelopment} max={100} step={5} />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <Label htmlFor="operations">Operations</Label>
            <span className="text-sm font-medium">{operations[0]}%</span>
          </div>
          <Slider id="operations" value={operations} onValueChange={setOperations} max={100} step={5} />
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Total Allocation</span>
            <span className={\`text-sm font-bold \${isValid ? 'text-[#0ec2bc]' : 'text-red-500'}\`}>
              {total}% {isValid ? '✓' : '✗'}
            </span>
          </div>
        </div>
      </div>;
  }
}`,...(Ys=(Us=Z.parameters)==null?void 0:Us.docs)==null?void 0:Ys.source},description:{story:"Budget allocator with percentage",...(Xs=(qs=Z.parameters)==null?void 0:qs.docs)==null?void 0:Xs.description}}};var Js,Qs,Zs,et,st;ee.parameters={...ee.parameters,docs:{...(Js=ee.parameters)==null?void 0:Js.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = React.useState([50]);
    return <div className="flex items-center gap-4 h-64">
        <Slider orientation="vertical" value={value} onValueChange={setValue} max={100} step={1} className="h-full" />
        <div className="flex flex-col gap-2">
          <Label>Volume</Label>
          <span className="text-sm text-muted-foreground">{value[0]}%</span>
        </div>
      </div>;
  }
}`,...(Zs=(Qs=ee.parameters)==null?void 0:Qs.docs)==null?void 0:Zs.source},description:{story:"Vertical slider orientation",...(st=(et=ee.parameters)==null?void 0:et.docs)==null?void 0:st.description}}};var tt,at,rt,nt,ot;se.parameters={...se.parameters,docs:{...(tt=se.parameters)==null?void 0:tt.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = React.useState([25, 75]);
    return <div className="flex items-center gap-4 h-64">
        <Slider orientation="vertical" value={value} onValueChange={setValue} max={100} step={1} className="h-full" />
        <div className="flex flex-col gap-2">
          <Label>Range</Label>
          <span className="text-sm text-muted-foreground">
            {value[0]}% - {value[1]}%
          </span>
        </div>
      </div>;
  }
}`,...(rt=(at=se.parameters)==null?void 0:at.docs)==null?void 0:rt.source},description:{story:"Vertical range slider",...(ot=(nt=se.parameters)==null?void 0:nt.docs)==null?void 0:ot.description}}};var it,lt,ct,dt,mt;te.parameters={...te.parameters,docs:{...(it=te.parameters)==null?void 0:it.docs,source:{originalSource:`{
  render: () => {
    const [volume, setVolume] = React.useState([70]);
    const [brightness, setBrightness] = React.useState([80]);
    const [contrast, setContrast] = React.useState([50]);
    const [temperature, setTemperature] = React.useState([22]);
    return <div className="space-y-6">
        <h3 className="text-lg font-medium">Display Settings</h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="form-volume">Volume</Label>
              <span className="text-sm text-muted-foreground">{volume[0]}%</span>
            </div>
            <Slider id="form-volume" value={volume} onValueChange={setVolume} max={100} step={1} />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="form-brightness">Brightness</Label>
              <span className="text-sm text-muted-foreground">{brightness[0]}%</span>
            </div>
            <Slider id="form-brightness" value={brightness} onValueChange={setBrightness} max={100} step={1} />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="form-contrast">Contrast</Label>
              <span className="text-sm text-muted-foreground">{contrast[0]}%</span>
            </div>
            <Slider id="form-contrast" value={contrast} onValueChange={setContrast} max={100} step={1} />
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between mb-2">
              <Label htmlFor="form-temp">Color Temperature</Label>
              <span className="text-sm font-medium" style={{
              color: '#0ec2bc'
            }}>
                {temperature[0]}°C
              </span>
            </div>
            <Slider id="form-temp" value={temperature} onValueChange={setTemperature} min={16} max={30} step={0.5} className="[&_[role=slider]]:border-[#0ec2bc] [&_.bg-primary]:bg-[#0ec2bc]" />
          </div>
        </div>
      </div>;
  }
}`,...(ct=(lt=te.parameters)==null?void 0:lt.docs)==null?void 0:ct.source},description:{story:"Form example with multiple sliders",...(mt=(dt=te.parameters)==null?void 0:dt.docs)==null?void 0:mt.description}}};var ut,pt,xt,ft,gt;ae.parameters={...ae.parameters,docs:{...(ut=ae.parameters)==null?void 0:ut.docs,source:{originalSource:`{
  render: () => <div className="space-y-8">
      <div>
        <Label className="text-base mb-2 block">Single Value (Default)</Label>
        <Slider defaultValue={[50]} max={100} step={1} />
      </div>

      <div>
        <Label className="text-base mb-2 block">Range (Two Thumbs)</Label>
        <Slider defaultValue={[25, 75]} max={100} step={1} />
      </div>

      <div>
        <Label className="text-base mb-2 block">With Steps (Increments of 10)</Label>
        <Slider defaultValue={[50]} max={100} step={10} />
      </div>

      <div>
        <Label className="text-base mb-2 block">At Minimum (0)</Label>
        <Slider defaultValue={[0]} max={100} step={1} />
      </div>

      <div>
        <Label className="text-base mb-2 block">At Maximum (100)</Label>
        <Slider defaultValue={[100]} max={100} step={1} />
      </div>

      <div>
        <Label className="text-base mb-2 block text-muted-foreground">Disabled</Label>
        <Slider defaultValue={[50]} max={100} step={1} disabled />
      </div>

      <div>
        <Label className="text-base mb-2 block text-muted-foreground">Disabled Range</Label>
        <Slider defaultValue={[25, 75]} max={100} step={1} disabled />
      </div>

      <div>
        <Label className="text-base mb-2 block">Custom Styling (Ozean Licht Turquoise)</Label>
        <Slider defaultValue={[60]} max={100} step={1} className="[&_[role=slider]]:border-[#0ec2bc] [&_.bg-primary]:bg-[#0ec2bc]" />
      </div>
    </div>
}`,...(xt=(pt=ae.parameters)==null?void 0:pt.docs)==null?void 0:xt.source},description:{story:"All states showcase",...(gt=(ft=ae.parameters)==null?void 0:ft.docs)==null?void 0:gt.description}}};const Ca=["Default","CustomRange","WithSteps","FineGrained","AtMinimum","AtMaximum","Range","RangeCustom","Disabled","DisabledRange","WithLabel","WithValueDisplay","RangeWithValueDisplay","VolumeControl","TemperatureControl","RatingSelector","TimeRangePicker","BudgetAllocator","Vertical","VerticalRange","FormExample","AllStates"];export{ae as AllStates,O as AtMaximum,K as AtMinimum,Z as BudgetAllocator,A as CustomRange,M as Default,W as Disabled,$ as DisabledRange,I as FineGrained,te as FormExample,z as Range,H as RangeCustom,Y as RangeWithValueDisplay,J as RatingSelector,X as TemperatureControl,Q as TimeRangePicker,ee as Vertical,se as VerticalRange,q as VolumeControl,G as WithLabel,B as WithSteps,U as WithValueDisplay,Ca as __namedExportsOrder,Ra as default};
