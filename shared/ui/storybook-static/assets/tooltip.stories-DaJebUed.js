import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{r as s}from"./index-B2-qRKKC.js";import{c as Ue,P as We,a as N,f as qe}from"./index-BiUY2kQP.js";import{u as ke}from"./index-BFjtS4uE.js";import{D as $e}from"./index-BVCCCNF7.js";import{u as Ke}from"./index-CpxwHbl5.js";import{c as Ae,R as Ye,A as Xe,C as Je,a as Qe}from"./index-rQjoU0Cs.js";import{P as Ze}from"./index-PNzqWif7.js";import{u as et}from"./index-BlCrtW8-.js";import{R as tt}from"./index-BO3lQbAq.js";import{c as ot}from"./cn-CKXzwFwe.js";import{B as C}from"./Button-PgnE6Xyj.js";import{I as nt}from"./info-C_HoouFQ.js";import{P as rt}from"./plus-CM_6FUG5.js";import{S as it}from"./settings-DfwhJ3T1.js";import{T as st}from"./trash-2-D2tcQEV5.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-kS-9iBlu.js";import"./index-ciuW_uyV.js";import"./index-D1vk04JX.js";import"./floating-ui.react-dom-DvwKYfZ0.js";import"./index-BYfY0yFj.js";import"./clsx-B-dksMZM.js";import"./index-Dp3B9jqt.js";import"./button-DhHHw9VN.js";import"./index-BiMR7eR1.js";import"./createLucideIcon-BbF4D6Jl.js";var[H]=Ue("Tooltip",[Ae]),z=Ae(),Le="TooltipProvider",at=700,V="tooltip.open",[lt,W]=H(Le),Oe=t=>{const{__scopeTooltip:n,delayDuration:o=at,skipDelayDuration:r=300,disableHoverableContent:i=!1,children:c}=t,l=s.useRef(!0),x=s.useRef(!1),a=s.useRef(0);return s.useEffect(()=>{const u=a.current;return()=>window.clearTimeout(u)},[]),e.jsx(lt,{scope:n,isOpenDelayedRef:l,delayDuration:o,onOpen:s.useCallback(()=>{window.clearTimeout(a.current),l.current=!1},[]),onClose:s.useCallback(()=>{window.clearTimeout(a.current),a.current=window.setTimeout(()=>l.current=!0,r)},[r]),isPointerInTransitRef:x,onPointerInTransitChange:s.useCallback(u=>{x.current=u},[]),disableHoverableContent:i,children:c})};Oe.displayName=Le;var M="Tooltip",[ct,G]=H(M),Me=t=>{const{__scopeTooltip:n,children:o,open:r,defaultOpen:i,onOpenChange:c,disableHoverableContent:l,delayDuration:x}=t,a=W(M,t.__scopeTooltip),u=z(n),[p,m]=s.useState(null),f=Ke(),d=s.useRef(0),v=l??a.disableHoverableContent,j=x??a.delayDuration,y=s.useRef(!1),[w,b]=et({prop:r,defaultProp:i??!1,onChange:$=>{$?(a.onOpen(),document.dispatchEvent(new CustomEvent(V))):a.onClose(),c==null||c($)},caller:M}),P=s.useMemo(()=>w?y.current?"delayed-open":"instant-open":"closed",[w]),E=s.useCallback(()=>{window.clearTimeout(d.current),d.current=0,y.current=!1,b(!0)},[b]),R=s.useCallback(()=>{window.clearTimeout(d.current),d.current=0,b(!1)},[b]),q=s.useCallback(()=>{window.clearTimeout(d.current),d.current=window.setTimeout(()=>{y.current=!0,b(!0),d.current=0},j)},[j,b]);return s.useEffect(()=>()=>{d.current&&(window.clearTimeout(d.current),d.current=0)},[]),e.jsx(Ye,{...u,children:e.jsx(ct,{scope:n,contentId:f,open:w,stateAttribute:P,trigger:p,onTriggerChange:m,onTriggerEnter:s.useCallback(()=>{a.isOpenDelayedRef.current?q():E()},[a.isOpenDelayedRef,q,E]),onTriggerLeave:s.useCallback(()=>{v?R():(window.clearTimeout(d.current),d.current=0)},[R,v]),onOpen:E,onClose:R,disableHoverableContent:v,children:o})})};Me.displayName=M;var F="TooltipTrigger",He=s.forwardRef((t,n)=>{const{__scopeTooltip:o,...r}=t,i=G(F,o),c=W(F,o),l=z(o),x=s.useRef(null),a=ke(n,x,i.onTriggerChange),u=s.useRef(!1),p=s.useRef(!1),m=s.useCallback(()=>u.current=!1,[]);return s.useEffect(()=>()=>document.removeEventListener("pointerup",m),[m]),e.jsx(Xe,{asChild:!0,...l,children:e.jsx(We.button,{"aria-describedby":i.open?i.contentId:void 0,"data-state":i.stateAttribute,...r,ref:a,onPointerMove:N(t.onPointerMove,f=>{f.pointerType!=="touch"&&!p.current&&!c.isPointerInTransitRef.current&&(i.onTriggerEnter(),p.current=!0)}),onPointerLeave:N(t.onPointerLeave,()=>{i.onTriggerLeave(),p.current=!1}),onPointerDown:N(t.onPointerDown,()=>{i.open&&i.onClose(),u.current=!0,document.addEventListener("pointerup",m,{once:!0})}),onFocus:N(t.onFocus,()=>{u.current||i.onOpen()}),onBlur:N(t.onBlur,i.onClose),onClick:N(t.onClick,i.onClose)})})});He.displayName=F;var pt="TooltipPortal",[Zt,dt]=H(pt,{forceMount:void 0}),_="TooltipContent",ze=s.forwardRef((t,n)=>{const o=dt(_,t.__scopeTooltip),{forceMount:r=o.forceMount,side:i="top",...c}=t,l=G(_,t.__scopeTooltip);return e.jsx(Ze,{present:r||l.open,children:l.disableHoverableContent?e.jsx(Ge,{side:i,...c,ref:n}):e.jsx(ut,{side:i,...c,ref:n})})}),ut=s.forwardRef((t,n)=>{const o=G(_,t.__scopeTooltip),r=W(_,t.__scopeTooltip),i=s.useRef(null),c=ke(n,i),[l,x]=s.useState(null),{trigger:a,onClose:u}=o,p=i.current,{onPointerInTransitChange:m}=r,f=s.useCallback(()=>{x(null),m(!1)},[m]),d=s.useCallback((v,j)=>{const y=v.currentTarget,w={x:v.clientX,y:v.clientY},b=ft(w,y.getBoundingClientRect()),P=gt(w,b),E=vt(j.getBoundingClientRect()),R=yt([...P,...E]);x(R),m(!0)},[m]);return s.useEffect(()=>()=>f(),[f]),s.useEffect(()=>{if(a&&p){const v=y=>d(y,p),j=y=>d(y,a);return a.addEventListener("pointerleave",v),p.addEventListener("pointerleave",j),()=>{a.removeEventListener("pointerleave",v),p.removeEventListener("pointerleave",j)}}},[a,p,d,f]),s.useEffect(()=>{if(l){const v=j=>{const y=j.target,w={x:j.clientX,y:j.clientY},b=(a==null?void 0:a.contains(y))||(p==null?void 0:p.contains(y)),P=!Ct(w,l);b?f():P&&(f(),u())};return document.addEventListener("pointermove",v),()=>document.removeEventListener("pointermove",v)}},[a,p,l,u,f]),e.jsx(Ge,{...t,ref:c})}),[mt,ht]=H(M,{isInside:!1}),Tt=qe("TooltipContent"),Ge=s.forwardRef((t,n)=>{const{__scopeTooltip:o,children:r,"aria-label":i,onEscapeKeyDown:c,onPointerDownOutside:l,...x}=t,a=G(_,o),u=z(o),{onClose:p}=a;return s.useEffect(()=>(document.addEventListener(V,p),()=>document.removeEventListener(V,p)),[p]),s.useEffect(()=>{if(a.trigger){const m=f=>{const d=f.target;d!=null&&d.contains(a.trigger)&&p()};return window.addEventListener("scroll",m,{capture:!0}),()=>window.removeEventListener("scroll",m,{capture:!0})}},[a.trigger,p]),e.jsx($e,{asChild:!0,disableOutsidePointerEvents:!1,onEscapeKeyDown:c,onPointerDownOutside:l,onFocusOutside:m=>m.preventDefault(),onDismiss:p,children:e.jsxs(Je,{"data-state":a.stateAttribute,...u,...x,ref:n,style:{...x.style,"--radix-tooltip-content-transform-origin":"var(--radix-popper-transform-origin)","--radix-tooltip-content-available-width":"var(--radix-popper-available-width)","--radix-tooltip-content-available-height":"var(--radix-popper-available-height)","--radix-tooltip-trigger-width":"var(--radix-popper-anchor-width)","--radix-tooltip-trigger-height":"var(--radix-popper-anchor-height)"},children:[e.jsx(Tt,{children:r}),e.jsx(mt,{scope:o,isInside:!0,children:e.jsx(tt,{id:a.contentId,role:"tooltip",children:i||r})})]})})});ze.displayName=_;var Ve="TooltipArrow",xt=s.forwardRef((t,n)=>{const{__scopeTooltip:o,...r}=t,i=z(o);return ht(Ve,o).isInside?null:e.jsx(Qe,{...i,...r,ref:n})});xt.displayName=Ve;function ft(t,n){const o=Math.abs(n.top-t.y),r=Math.abs(n.bottom-t.y),i=Math.abs(n.right-t.x),c=Math.abs(n.left-t.x);switch(Math.min(o,r,i,c)){case c:return"left";case i:return"right";case o:return"top";case r:return"bottom";default:throw new Error("unreachable")}}function gt(t,n,o=5){const r=[];switch(n){case"top":r.push({x:t.x-o,y:t.y+o},{x:t.x+o,y:t.y+o});break;case"bottom":r.push({x:t.x-o,y:t.y-o},{x:t.x+o,y:t.y-o});break;case"left":r.push({x:t.x+o,y:t.y-o},{x:t.x+o,y:t.y+o});break;case"right":r.push({x:t.x-o,y:t.y-o},{x:t.x-o,y:t.y+o});break}return r}function vt(t){const{top:n,right:o,bottom:r,left:i}=t;return[{x:i,y:n},{x:o,y:n},{x:o,y:r},{x:i,y:r}]}function Ct(t,n){const{x:o,y:r}=t;let i=!1;for(let c=0,l=n.length-1;c<n.length;l=c++){const x=n[c],a=n[l],u=x.x,p=x.y,m=a.x,f=a.y;p>r!=f>r&&o<(m-u)*(r-p)/(f-p)+u&&(i=!i)}return i}function yt(t){const n=t.slice();return n.sort((o,r)=>o.x<r.x?-1:o.x>r.x?1:o.y<r.y?-1:o.y>r.y?1:0),jt(n)}function jt(t){if(t.length<=1)return t.slice();const n=[];for(let r=0;r<t.length;r++){const i=t[r];for(;n.length>=2;){const c=n[n.length-1],l=n[n.length-2];if((c.x-l.x)*(i.y-l.y)>=(c.y-l.y)*(i.x-l.x))n.pop();else break}n.push(i)}n.pop();const o=[];for(let r=t.length-1;r>=0;r--){const i=t[r];for(;o.length>=2;){const c=o[o.length-1],l=o[o.length-2];if((c.x-l.x)*(i.y-l.y)>=(c.y-l.y)*(i.x-l.x))o.pop();else break}o.push(i)}return o.pop(),n.length===1&&o.length===1&&n[0].x===o[0].x&&n[0].y===o[0].y?n:n.concat(o)}var bt=Oe,wt=Me,Nt=He,Fe=ze;const U=bt,h=wt,g=Nt,T=s.forwardRef(({className:t,sideOffset:n=4,...o},r)=>e.jsx(Fe,{ref:r,sideOffset:n,className:ot("z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]",t),...o}));T.displayName=Fe.displayName;try{h.displayName="Tooltip",h.__docgenInfo={description:"",displayName:"Tooltip",props:{}}}catch{}try{g.displayName="TooltipTrigger",g.__docgenInfo={description:"",displayName:"TooltipTrigger",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{T.displayName="TooltipContent",T.__docgenInfo={description:"",displayName:"TooltipContent",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{U.displayName="TooltipProvider",U.__docgenInfo={description:"",displayName:"TooltipProvider",props:{}}}catch{}const eo={title:"Tier 1: Primitives/shadcn/Tooltip",component:h,parameters:{layout:"centered",docs:{description:{component:"A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it."}}},tags:["autodocs"],decorators:[t=>e.jsx(U,{children:e.jsx("div",{className:"flex items-center justify-center p-20",children:e.jsx(t,{})})})]},S={render:()=>e.jsxs(h,{children:[e.jsx(g,{asChild:!0,children:e.jsx(C,{variant:"outline",children:"Hover me"})}),e.jsx(T,{children:e.jsx("p",{children:"This is a tooltip"})})]})},D={render:()=>e.jsxs("div",{className:"flex flex-col gap-8",children:[e.jsxs(h,{children:[e.jsx(g,{asChild:!0,children:e.jsx(C,{variant:"outline",children:"Top (default)"})}),e.jsx(T,{side:"top",children:e.jsx("p",{children:"Tooltip on top"})})]}),e.jsxs(h,{children:[e.jsx(g,{asChild:!0,children:e.jsx(C,{variant:"outline",children:"Right"})}),e.jsx(T,{side:"right",children:e.jsx("p",{children:"Tooltip on right"})})]}),e.jsxs(h,{children:[e.jsx(g,{asChild:!0,children:e.jsx(C,{variant:"outline",children:"Bottom"})}),e.jsx(T,{side:"bottom",children:e.jsx("p",{children:"Tooltip on bottom"})})]}),e.jsxs(h,{children:[e.jsx(g,{asChild:!0,children:e.jsx(C,{variant:"outline",children:"Left"})}),e.jsx(T,{side:"left",children:e.jsx("p",{children:"Tooltip on left"})})]})]})},B={render:()=>e.jsxs(h,{children:[e.jsx(g,{asChild:!0,children:e.jsx(C,{size:"icon",variant:"ghost",children:e.jsx(nt,{className:"h-4 w-4"})})}),e.jsx(T,{children:e.jsx("p",{children:"More information"})})]})},I={render:()=>e.jsxs("div",{className:"flex gap-4",children:[e.jsxs(h,{children:[e.jsx(g,{asChild:!0,children:e.jsx(C,{size:"icon",variant:"outline",children:e.jsx(rt,{className:"h-4 w-4"})})}),e.jsx(T,{children:e.jsx("p",{children:"Add new item"})})]}),e.jsxs(h,{children:[e.jsx(g,{asChild:!0,children:e.jsx(C,{size:"icon",variant:"outline",children:e.jsx(it,{className:"h-4 w-4"})})}),e.jsx(T,{children:e.jsx("p",{children:"Settings"})})]}),e.jsxs(h,{children:[e.jsx(g,{asChild:!0,children:e.jsx(C,{size:"icon",variant:"destructive",children:e.jsx(st,{className:"h-4 w-4"})})}),e.jsx(T,{children:e.jsx("p",{children:"Delete item"})})]})]})},k={render:()=>e.jsxs(h,{children:[e.jsx(g,{asChild:!0,children:e.jsx(C,{variant:"outline",children:"Deployment Status"})}),e.jsx(T,{className:"max-w-xs",children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"font-semibold",children:"Deployment Information"}),e.jsx("p",{className:"text-xs",children:"Last deployed: 2 hours ago"}),e.jsx("p",{className:"text-xs",children:"Status: Active"}),e.jsx("p",{className:"text-xs",children:"Version: v2.4.1"})]})})]})},A={render:()=>e.jsxs(h,{children:[e.jsx(g,{asChild:!0,children:e.jsx(C,{variant:"outline",children:"Save"})}),e.jsx(T,{children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{children:"Save changes"}),e.jsxs("kbd",{className:"pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100",children:[e.jsx("span",{className:"text-xs",children:"⌘"}),"S"]})]})})]})},L={render:()=>e.jsxs(h,{children:[e.jsx(g,{asChild:!0,children:e.jsx("span",{tabIndex:0,children:e.jsx(C,{disabled:!0,variant:"outline",className:"pointer-events-none",children:"Disabled Button"})})}),e.jsx(T,{children:e.jsx("p",{children:"This action is currently unavailable"})})]})},O={render:()=>e.jsx("div",{className:"flex items-center gap-1 rounded-lg border p-2",children:["Bold","Italic","Underline","Strike"].map(t=>e.jsxs(h,{children:[e.jsx(g,{asChild:!0,children:e.jsx(C,{size:"icon",variant:"ghost",className:"h-8 w-8",children:e.jsx("span",{className:"font-bold text-sm",children:t[0]})})}),e.jsx(T,{children:e.jsx("p",{children:t})})]},t))})};var K,Y,X,J,Q;S.parameters={...S.parameters,docs:{...(K=S.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: () => <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a tooltip</p>
      </TooltipContent>
    </Tooltip>
}`,...(X=(Y=S.parameters)==null?void 0:Y.docs)==null?void 0:X.source},description:{story:"Default tooltip on top",...(Q=(J=S.parameters)==null?void 0:J.docs)==null?void 0:Q.description}}};var Z,ee,te,oe,ne;D.parameters={...D.parameters,docs:{...(Z=D.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-8">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Top (default)</Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Tooltip on top</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Right</Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Tooltip on right</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Tooltip on bottom</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Left</Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Tooltip on left</p>
        </TooltipContent>
      </Tooltip>
    </div>
}`,...(te=(ee=D.parameters)==null?void 0:ee.docs)==null?void 0:te.source},description:{story:"Tooltip on different sides",...(ne=(oe=D.parameters)==null?void 0:oe.docs)==null?void 0:ne.description}}};var re,ie,se,ae,le;B.parameters={...B.parameters,docs:{...(re=B.parameters)==null?void 0:re.docs,source:{originalSource:`{
  render: () => <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" variant="ghost">
          <Info className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>More information</p>
      </TooltipContent>
    </Tooltip>
}`,...(se=(ie=B.parameters)==null?void 0:ie.docs)==null?void 0:se.source},description:{story:"Tooltip with icon button",...(le=(ae=B.parameters)==null?void 0:ae.docs)==null?void 0:le.description}}};var ce,pe,de,ue,me;I.parameters={...I.parameters,docs:{...(ce=I.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  render: () => <div className="flex gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add new item</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="outline">
            <Settings className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Settings</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete item</p>
        </TooltipContent>
      </Tooltip>
    </div>
}`,...(de=(pe=I.parameters)==null?void 0:pe.docs)==null?void 0:de.source},description:{story:"Multiple tooltips",...(me=(ue=I.parameters)==null?void 0:ue.docs)==null?void 0:me.description}}};var he,Te,xe,fe,ge;k.parameters={...k.parameters,docs:{...(he=k.parameters)==null?void 0:he.docs,source:{originalSource:`{
  render: () => <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Deployment Status</Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="space-y-2">
          <p className="font-semibold">Deployment Information</p>
          <p className="text-xs">Last deployed: 2 hours ago</p>
          <p className="text-xs">Status: Active</p>
          <p className="text-xs">Version: v2.4.1</p>
        </div>
      </TooltipContent>
    </Tooltip>
}`,...(xe=(Te=k.parameters)==null?void 0:Te.docs)==null?void 0:xe.source},description:{story:"Tooltip with detailed content",...(ge=(fe=k.parameters)==null?void 0:fe.docs)==null?void 0:ge.description}}};var ve,Ce,ye,je,be;A.parameters={...A.parameters,docs:{...(ve=A.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  render: () => <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Save</Button>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex items-center gap-2">
          <span>Save changes</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-xs">⌘</span>S
          </kbd>
        </div>
      </TooltipContent>
    </Tooltip>
}`,...(ye=(Ce=A.parameters)==null?void 0:Ce.docs)==null?void 0:ye.source},description:{story:"Tooltip with keyboard shortcut",...(be=(je=A.parameters)==null?void 0:je.docs)==null?void 0:be.description}}};var we,Ne,_e,Pe,Ee;L.parameters={...L.parameters,docs:{...(we=L.parameters)==null?void 0:we.docs,source:{originalSource:`{
  render: () => <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0}>
          <Button disabled variant="outline" className="pointer-events-none">
            Disabled Button
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>This action is currently unavailable</p>
      </TooltipContent>
    </Tooltip>
}`,...(_e=(Ne=L.parameters)==null?void 0:Ne.docs)==null?void 0:_e.source},description:{story:"Disabled trigger with tooltip",...(Ee=(Pe=L.parameters)==null?void 0:Pe.docs)==null?void 0:Ee.description}}};var Re,Se,De,Be,Ie;O.parameters={...O.parameters,docs:{...(Re=O.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-1 rounded-lg border p-2">
      {['Bold', 'Italic', 'Underline', 'Strike'].map(format => <Tooltip key={format}>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <span className="font-bold text-sm">{format[0]}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{format}</p>
          </TooltipContent>
        </Tooltip>)}
    </div>
}`,...(De=(Se=O.parameters)==null?void 0:Se.docs)==null?void 0:De.source},description:{story:"Tooltip in a toolbar",...(Ie=(Be=O.parameters)==null?void 0:Be.docs)==null?void 0:Ie.description}}};const to=["Default","Sides","WithIconButton","Multiple","DetailedContent","WithKeyboardShortcut","DisabledTrigger","Toolbar"];export{S as Default,k as DetailedContent,L as DisabledTrigger,I as Multiple,D as Sides,O as Toolbar,B as WithIconButton,A as WithKeyboardShortcut,to as __namedExportsOrder,eo as default};
