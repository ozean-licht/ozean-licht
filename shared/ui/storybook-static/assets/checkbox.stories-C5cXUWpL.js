import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{f as te}from"./index-CJu6nLMj.js";import{C as s}from"./checkbox-M5-a5s-y.js";import{L as a}from"./label-Cp9r14oL.js";import"./index-B2-qRKKC.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-BFjtS4uE.js";import"./index-D4_CVXg7.js";import"./index-kS-9iBlu.js";import"./index-BlCrtW8-.js";import"./index-D1vk04JX.js";import"./index-_AbP6Uzr.js";import"./index-BYfY0yFj.js";import"./index-PNzqWif7.js";import"./cn-CytzSlOG.js";import"./check-BFJmnSzs.js";import"./createLucideIcon-BbF4D6Jl.js";import"./index-B5oyz0SX.js";import"./index-BiMR7eR1.js";import"./index-DVF2XGCm.js";const ye={title:"Tier 1: Primitives/shadcn/Checkbox",component:s,parameters:{layout:"centered",docs:{description:{component:"A control that allows the user to toggle between checked and unchecked states."}}},tags:["autodocs"],argTypes:{checked:{control:"radio",options:[!0,!1,"indeterminate"],description:"Checked state of checkbox"},disabled:{control:"boolean",description:"Disable checkbox interaction"}},args:{onCheckedChange:te()}},t={args:{checked:!1}},r={args:{checked:!0}},c={args:{checked:"indeterminate"}},n={args:{disabled:!0,checked:!1}},i={args:{disabled:!0,checked:!0}},d={render:()=>e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{id:"terms"}),e.jsx(a,{htmlFor:"terms",className:"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",children:"Accept terms and conditions"})]})},o={render:()=>e.jsxs("div",{className:"flex items-start space-x-3",children:[e.jsx(s,{id:"marketing",className:"mt-1"}),e.jsxs("div",{className:"grid gap-1.5 leading-none",children:[e.jsx(a,{htmlFor:"marketing",className:"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",children:"Marketing emails"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Receive emails about new products, features, and more."})]})]})},l={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{id:"notifications",defaultChecked:!0}),e.jsx(a,{htmlFor:"notifications",children:"Enable notifications"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{id:"two-factor"}),e.jsx(a,{htmlFor:"two-factor",children:"Enable two-factor authentication"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{id:"analytics",defaultChecked:!0}),e.jsx(a,{htmlFor:"analytics",children:"Share analytics data"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{id:"beta",disabled:!0}),e.jsx(a,{htmlFor:"beta",className:"text-muted-foreground",children:"Beta features (coming soon)"})]})]})},m={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{checked:!1}),e.jsx("span",{className:"text-sm",children:"Unchecked"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{checked:!0}),e.jsx("span",{className:"text-sm",children:"Checked"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{checked:"indeterminate"}),e.jsx("span",{className:"text-sm",children:"Indeterminate"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{disabled:!0,checked:!1}),e.jsx("span",{className:"text-sm text-muted-foreground",children:"Disabled Unchecked"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{disabled:!0,checked:!0}),e.jsx("span",{className:"text-sm text-muted-foreground",children:"Disabled Checked"})]})]})};var p,x,h,u,b;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    checked: false
  }
}`,...(h=(x=t.parameters)==null?void 0:x.docs)==null?void 0:h.source},description:{story:"Default unchecked checkbox",...(b=(u=t.parameters)==null?void 0:u.docs)==null?void 0:b.description}}};var f,k,g,N,v;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    checked: true
  }
}`,...(g=(k=r.parameters)==null?void 0:k.docs)==null?void 0:g.source},description:{story:"Checked checkbox",...(v=(N=r.parameters)==null?void 0:N.docs)==null?void 0:v.description}}};var j,C,y,w,D;c.parameters={...c.parameters,docs:{...(j=c.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    checked: 'indeterminate'
  }
}`,...(y=(C=c.parameters)==null?void 0:C.docs)==null?void 0:y.source},description:{story:"Indeterminate state (partial selection)",...(D=(w=c.parameters)==null?void 0:w.docs)==null?void 0:D.description}}};var L,F,S,E,A;n.parameters={...n.parameters,docs:{...(L=n.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    disabled: true,
    checked: false
  }
}`,...(S=(F=n.parameters)==null?void 0:F.docs)==null?void 0:S.source},description:{story:"Disabled checkbox (unchecked)",...(A=(E=n.parameters)==null?void 0:E.docs)==null?void 0:A.description}}};var I,U,W,R,B;i.parameters={...i.parameters,docs:{...(I=i.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    disabled: true,
    checked: true
  }
}`,...(W=(U=i.parameters)==null?void 0:U.docs)==null?void 0:W.source},description:{story:"Disabled checkbox (checked)",...(B=(R=i.parameters)==null?void 0:R.docs)==null?void 0:B.description}}};var M,T,_,O,P;d.parameters={...d.parameters,docs:{...(M=d.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Accept terms and conditions
      </Label>
    </div>
}`,...(_=(T=d.parameters)==null?void 0:T.docs)==null?void 0:_.source},description:{story:"Checkbox with label",...(P=(O=d.parameters)==null?void 0:O.docs)==null?void 0:P.description}}};var q,z,G,H,J;o.parameters={...o.parameters,docs:{...(q=o.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => <div className="flex items-start space-x-3">
      <Checkbox id="marketing" className="mt-1" />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor="marketing" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Marketing emails
        </Label>
        <p className="text-sm text-muted-foreground">
          Receive emails about new products, features, and more.
        </p>
      </div>
    </div>
}`,...(G=(z=o.parameters)==null?void 0:z.docs)==null?void 0:G.source},description:{story:"Checkbox with description",...(J=(H=o.parameters)==null?void 0:H.docs)==null?void 0:J.description}}};var K,Q,V,X,Y;l.parameters={...l.parameters,docs:{...(K=l.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="notifications" defaultChecked />
        <Label htmlFor="notifications">Enable notifications</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="two-factor" />
        <Label htmlFor="two-factor">Enable two-factor authentication</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="analytics" defaultChecked />
        <Label htmlFor="analytics">Share analytics data</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="beta" disabled />
        <Label htmlFor="beta" className="text-muted-foreground">
          Beta features (coming soon)
        </Label>
      </div>
    </div>
}`,...(V=(Q=l.parameters)==null?void 0:Q.docs)==null?void 0:V.source},description:{story:"Form example with multiple checkboxes",...(Y=(X=l.parameters)==null?void 0:X.docs)==null?void 0:Y.description}}};var Z,$,ee,se,ae;m.parameters={...m.parameters,docs:{...(Z=m.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox checked={false} />
        <span className="text-sm">Unchecked</span>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox checked={true} />
        <span className="text-sm">Checked</span>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox checked="indeterminate" />
        <span className="text-sm">Indeterminate</span>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox disabled checked={false} />
        <span className="text-sm text-muted-foreground">Disabled Unchecked</span>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox disabled checked={true} />
        <span className="text-sm text-muted-foreground">Disabled Checked</span>
      </div>
    </div>
}`,...(ee=($=m.parameters)==null?void 0:$.docs)==null?void 0:ee.source},description:{story:"All states showcase",...(ae=(se=m.parameters)==null?void 0:se.docs)==null?void 0:ae.description}}};const we=["Default","Checked","Indeterminate","Disabled","DisabledChecked","WithLabel","WithDescription","FormExample","AllStates"];export{m as AllStates,r as Checked,t as Default,n as Disabled,i as DisabledChecked,l as FormExample,c as Indeterminate,o as WithDescription,d as WithLabel,we as __namedExportsOrder,ye as default};
