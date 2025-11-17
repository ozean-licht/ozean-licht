import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{L as a}from"./label-Cp9r14oL.js";import{I as s}from"./input-Db9iZ-Hs.js";import{C as Be}from"./checkbox-M5-a5s-y.js";import"./index-B2-qRKKC.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-B5oyz0SX.js";import"./index-kS-9iBlu.js";import"./index-BiMR7eR1.js";import"./index-BFjtS4uE.js";import"./index-DVF2XGCm.js";import"./cn-CytzSlOG.js";import"./index-D4_CVXg7.js";import"./index-BlCrtW8-.js";import"./index-D1vk04JX.js";import"./index-_AbP6Uzr.js";import"./index-BYfY0yFj.js";import"./index-PNzqWif7.js";import"./check-BFJmnSzs.js";import"./createLucideIcon-BbF4D6Jl.js";const da={title:"Tier 1: Primitives/shadcn/Label",component:a,parameters:{layout:"centered",docs:{description:{component:"A text label component that provides accessible form field labeling with automatic disabled state handling."}}},tags:["autodocs"],argTypes:{htmlFor:{control:"text",description:"ID of the associated form control"},children:{control:"text",description:"Label text content"},className:{control:"text",description:"Additional CSS classes"}},decorators:[Ve=>e.jsx("div",{className:"w-[350px]",children:e.jsx(Ve,{})})]},r={args:{children:"Label Text"}},l={render:()=>e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(a,{htmlFor:"email",children:"Email"}),e.jsx(s,{type:"email",id:"email",placeholder:"email@example.com"})]})},t={render:()=>e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(Be,{id:"terms"}),e.jsx(a,{htmlFor:"terms",children:"Accept terms and conditions"})]})},i={render:()=>e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("input",{type:"radio",id:"option1",name:"options",className:"h-4 w-4 border-gray-300 text-[#0ec2bc] focus:ring-[#0ec2bc]"}),e.jsx(a,{htmlFor:"option1",children:"Option 1"})]})},d={render:()=>e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsxs(a,{htmlFor:"fullname",children:["Full Name ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx(s,{type:"text",id:"fullname",placeholder:"John Doe",required:!0})]})},c={render:()=>e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(a,{htmlFor:"disabled-input",children:"Disabled Field"}),e.jsx(s,{type:"text",id:"disabled-input",disabled:!0,value:"This field is disabled"})]})},n={render:()=>e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(a,{htmlFor:"username",children:"Username"}),e.jsx(s,{type:"text",id:"username",placeholder:"ozean_licht_user"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Your username must be 3-20 characters and can only contain letters, numbers, and underscores."})]})},o={render:()=>e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(a,{htmlFor:"email-error",className:"text-red-500",children:"Email"}),e.jsx(s,{type:"email",id:"email-error",placeholder:"email@example.com",className:"border-red-500 focus-visible:ring-red-500",defaultValue:"invalid-email"}),e.jsx("p",{className:"text-sm text-red-500",children:"Please enter a valid email address."})]})},m={render:()=>e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(a,{htmlFor:"email-success",className:"text-[#0ec2bc]",children:"Email"}),e.jsx(s,{type:"email",id:"email-success",placeholder:"email@example.com",className:"border-[#0ec2bc] focus-visible:ring-[#0ec2bc]",value:"valid@email.com",readOnly:!0}),e.jsx("p",{className:"text-sm text-[#0ec2bc]",children:"✓ Email is valid and available"})]})},p={render:()=>e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsxs("div",{className:"space-y-0.5",children:[e.jsx(a,{htmlFor:"bio",children:"Bio"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Tell us a little bit about yourself"})]}),e.jsx(s,{type:"text",id:"bio",placeholder:"I am a..."})]})},u={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(a,{htmlFor:"top",children:"Label Above (Standard)"}),e.jsx(s,{type:"text",id:"top",placeholder:"Input below label"})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(a,{htmlFor:"left",className:"min-w-[120px]",children:"Label Left"}),e.jsx(s,{type:"text",id:"left",placeholder:"Input to the right"})]}),e.jsxs("div",{className:"flex items-start gap-4",children:[e.jsx(s,{type:"checkbox",id:"right",className:"mt-1"}),e.jsxs("div",{className:"grid gap-1",children:[e.jsx(a,{htmlFor:"right",children:"Label to the Right"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"With additional description text"})]})]})]})},h={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsxs(a,{htmlFor:"firstname",children:["First Name ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx(s,{type:"text",id:"firstname",placeholder:"John",required:!0})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsxs(a,{htmlFor:"lastname",children:["Last Name ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx(s,{type:"text",id:"lastname",placeholder:"Doe",required:!0})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(a,{htmlFor:"email-form",children:"Email"}),e.jsx(s,{type:"email",id:"email-form",placeholder:"john.doe@example.com"})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(a,{htmlFor:"phone",children:"Phone"}),e.jsx(s,{type:"tel",id:"phone",placeholder:"+43 123 456 789"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(Be,{id:"newsletter"}),e.jsx(a,{htmlFor:"newsletter",children:"Subscribe to newsletter"})]})]})},b={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(a,{htmlFor:"bold",className:"text-base font-bold",children:"Bold Label"}),e.jsx(s,{type:"text",id:"bold",placeholder:"Custom bold label"})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(a,{htmlFor:"uppercase",className:"text-xs uppercase tracking-wider",children:"Uppercase Label"}),e.jsx(s,{type:"text",id:"uppercase",placeholder:"Small uppercase label"})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(a,{htmlFor:"colored",className:"text-[#0ec2bc] font-semibold",children:"Ozean Licht Branded Label"}),e.jsx(s,{type:"text",id:"colored",placeholder:"Turquoise colored label"})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(a,{htmlFor:"large",className:"text-lg font-semibold",children:"Large Label"}),e.jsx(s,{type:"text",id:"large",placeholder:"Larger label text"})]})]})},x={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(a,{htmlFor:"default-state",children:"Default State"}),e.jsx(s,{type:"text",id:"default-state",placeholder:"Normal input"})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsxs(a,{htmlFor:"required-state",children:["Required State ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx(s,{type:"text",id:"required-state",placeholder:"Required input",required:!0})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(a,{htmlFor:"disabled-state",className:"cursor-not-allowed opacity-70",children:"Disabled State"}),e.jsx(s,{type:"text",id:"disabled-state",disabled:!0,value:"Disabled input"})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(a,{htmlFor:"error-state",className:"text-red-500",children:"Error State"}),e.jsx(s,{type:"text",id:"error-state",className:"border-red-500 focus-visible:ring-red-500",defaultValue:"Invalid value"}),e.jsx("p",{className:"text-sm text-red-500",children:"This field has an error"})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(a,{htmlFor:"success-state",className:"text-[#0ec2bc]",children:"Success State"}),e.jsx(s,{type:"text",id:"success-state",className:"border-[#0ec2bc] focus-visible:ring-[#0ec2bc]",value:"Valid value",readOnly:!0}),e.jsx("p",{className:"text-sm text-[#0ec2bc]",children:"✓ This field is valid"})]})]})},g={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"rounded-lg border border-border bg-card p-4",children:[e.jsx("h3",{className:"mb-4 font-semibold",children:"Proper Label Association"}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(a,{htmlFor:"accessible",children:"Email Address"}),e.jsx(s,{type:"email",id:"accessible",placeholder:"email@example.com","aria-describedby":"email-description"}),e.jsx("p",{id:"email-description",className:"text-sm text-muted-foreground",children:"We'll never share your email with anyone else."})]})]}),e.jsxs("div",{className:"rounded-lg border border-border bg-card p-4",children:[e.jsx("h3",{className:"mb-4 font-semibold",children:"Required Field Indicator"}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsxs(a,{htmlFor:"required-demo",children:["Password ",e.jsx("span",{className:"text-red-500","aria-label":"required",children:"*"})]}),e.jsx(s,{type:"password",id:"required-demo",placeholder:"Enter password",required:!0,"aria-required":"true"})]})]}),e.jsxs("div",{className:"rounded-lg border border-border bg-card p-4",children:[e.jsx("h3",{className:"mb-4 font-semibold",children:"Disabled Field"}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(a,{htmlFor:"disabled-demo",children:"Read-only Field"}),e.jsx(s,{type:"text",id:"disabled-demo",disabled:!0,value:"This field cannot be edited","aria-disabled":"true"})]})]})]})};var v,N,f,j,y;r.parameters={...r.parameters,docs:{...(v=r.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    children: 'Label Text'
  }
}`,...(f=(N=r.parameters)==null?void 0:N.docs)==null?void 0:f.source},description:{story:"Default label standalone",...(y=(j=r.parameters)==null?void 0:j.docs)==null?void 0:y.description}}};var L,w,F,I,S;l.parameters={...l.parameters,docs:{...(L=l.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: () => <div className="grid w-full gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="email@example.com" />
    </div>
}`,...(F=(w=l.parameters)==null?void 0:w.docs)==null?void 0:F.source},description:{story:"Label with text input",...(S=(I=l.parameters)==null?void 0:I.docs)==null?void 0:S.description}}};var q,D,E,T,W;t.parameters={...t.parameters,docs:{...(q=t.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">
        Accept terms and conditions
      </Label>
    </div>
}`,...(E=(D=t.parameters)==null?void 0:D.docs)==null?void 0:E.source},description:{story:"Label with checkbox",...(W=(T=t.parameters)==null?void 0:T.docs)==null?void 0:W.description}}};var A,R,C,P,k;i.parameters={...i.parameters,docs:{...(A=i.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => <div className="flex items-center space-x-2">
      <input type="radio" id="option1" name="options" className="h-4 w-4 border-gray-300 text-[#0ec2bc] focus:ring-[#0ec2bc]" />
      <Label htmlFor="option1">
        Option 1
      </Label>
    </div>
}`,...(C=(R=i.parameters)==null?void 0:R.docs)==null?void 0:C.source},description:{story:"Label with radio button (using native HTML radio)",...(k=(P=i.parameters)==null?void 0:P.docs)==null?void 0:k.description}}};var O,B,V,_,z;d.parameters={...d.parameters,docs:{...(O=d.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => <div className="grid w-full gap-1.5">
      <Label htmlFor="fullname">
        Full Name <span className="text-red-500">*</span>
      </Label>
      <Input type="text" id="fullname" placeholder="John Doe" required />
    </div>
}`,...(V=(B=d.parameters)==null?void 0:B.docs)==null?void 0:V.source},description:{story:"Label with required indicator",...(z=(_=d.parameters)==null?void 0:_.docs)==null?void 0:z.description}}};var J,U,H,G,M;c.parameters={...c.parameters,docs:{...(J=c.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => <div className="grid w-full gap-1.5">
      <Label htmlFor="disabled-input">
        Disabled Field
      </Label>
      <Input type="text" id="disabled-input" disabled value="This field is disabled" />
    </div>
}`,...(H=(U=c.parameters)==null?void 0:U.docs)==null?void 0:H.source},description:{story:"Label with disabled input (demonstrates peer-disabled styling)",...(M=(G=c.parameters)==null?void 0:G.docs)==null?void 0:M.description}}};var Y,K,Q,X,Z;n.parameters={...n.parameters,docs:{...(Y=n.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: () => <div className="grid w-full gap-1.5">
      <Label htmlFor="username">Username</Label>
      <Input type="text" id="username" placeholder="ozean_licht_user" />
      <p className="text-sm text-muted-foreground">
        Your username must be 3-20 characters and can only contain letters, numbers, and underscores.
      </p>
    </div>
}`,...(Q=(K=n.parameters)==null?void 0:K.docs)==null?void 0:Q.source},description:{story:"Label with helper text",...(Z=(X=n.parameters)==null?void 0:X.docs)==null?void 0:Z.description}}};var $,ee,ae,se,re;o.parameters={...o.parameters,docs:{...($=o.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => <div className="grid w-full gap-1.5">
      <Label htmlFor="email-error" className="text-red-500">
        Email
      </Label>
      <Input type="email" id="email-error" placeholder="email@example.com" className="border-red-500 focus-visible:ring-red-500" defaultValue="invalid-email" />
      <p className="text-sm text-red-500">
        Please enter a valid email address.
      </p>
    </div>
}`,...(ae=(ee=o.parameters)==null?void 0:ee.docs)==null?void 0:ae.source},description:{story:"Label with error state",...(re=(se=o.parameters)==null?void 0:se.docs)==null?void 0:re.description}}};var le,te,ie,de,ce;m.parameters={...m.parameters,docs:{...(le=m.parameters)==null?void 0:le.docs,source:{originalSource:`{
  render: () => <div className="grid w-full gap-1.5">
      <Label htmlFor="email-success" className="text-[#0ec2bc]">
        Email
      </Label>
      <Input type="email" id="email-success" placeholder="email@example.com" className="border-[#0ec2bc] focus-visible:ring-[#0ec2bc]" value="valid@email.com" readOnly />
      <p className="text-sm text-[#0ec2bc]">
        ✓ Email is valid and available
      </p>
    </div>
}`,...(ie=(te=m.parameters)==null?void 0:te.docs)==null?void 0:ie.source},description:{story:"Label with success state (using Ozean Licht turquoise)",...(ce=(de=m.parameters)==null?void 0:de.docs)==null?void 0:ce.description}}};var ne,oe,me,pe,ue;p.parameters={...p.parameters,docs:{...(ne=p.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: () => <div className="grid w-full gap-1.5">
      <div className="space-y-0.5">
        <Label htmlFor="bio">Bio</Label>
        <p className="text-sm text-muted-foreground">
          Tell us a little bit about yourself
        </p>
      </div>
      <Input type="text" id="bio" placeholder="I am a..." />
    </div>
}`,...(me=(oe=p.parameters)==null?void 0:oe.docs)==null?void 0:me.source},description:{story:"Label with description and input",...(ue=(pe=p.parameters)==null?void 0:pe.docs)==null?void 0:ue.description}}};var he,be,xe,ge,ve;u.parameters={...u.parameters,docs:{...(he=u.parameters)==null?void 0:he.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">
      <div className="grid w-full gap-1.5">
        <Label htmlFor="top">Label Above (Standard)</Label>
        <Input type="text" id="top" placeholder="Input below label" />
      </div>

      <div className="flex items-center gap-4">
        <Label htmlFor="left" className="min-w-[120px]">Label Left</Label>
        <Input type="text" id="left" placeholder="Input to the right" />
      </div>

      <div className="flex items-start gap-4">
        <Input type="checkbox" id="right" className="mt-1" />
        <div className="grid gap-1">
          <Label htmlFor="right">Label to the Right</Label>
          <p className="text-sm text-muted-foreground">
            With additional description text
          </p>
        </div>
      </div>
    </div>
}`,...(xe=(be=u.parameters)==null?void 0:be.docs)==null?void 0:xe.source},description:{story:"Label positioning variants",...(ve=(ge=u.parameters)==null?void 0:ge.docs)==null?void 0:ve.description}}};var Ne,fe,je,ye,Le;h.parameters={...h.parameters,docs:{...(Ne=h.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <div className="grid w-full gap-1.5">
        <Label htmlFor="firstname">
          First Name <span className="text-red-500">*</span>
        </Label>
        <Input type="text" id="firstname" placeholder="John" required />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="lastname">
          Last Name <span className="text-red-500">*</span>
        </Label>
        <Input type="text" id="lastname" placeholder="Doe" required />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="email-form">Email</Label>
        <Input type="email" id="email-form" placeholder="john.doe@example.com" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="phone">Phone</Label>
        <Input type="tel" id="phone" placeholder="+43 123 456 789" />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="newsletter" />
        <Label htmlFor="newsletter">
          Subscribe to newsletter
        </Label>
      </div>
    </div>
}`,...(je=(fe=h.parameters)==null?void 0:fe.docs)==null?void 0:je.source},description:{story:"Multiple labels in a form group",...(Le=(ye=h.parameters)==null?void 0:ye.docs)==null?void 0:Le.description}}};var we,Fe,Ie,Se,qe;b.parameters={...b.parameters,docs:{...(we=b.parameters)==null?void 0:we.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">
      <div className="grid w-full gap-1.5">
        <Label htmlFor="bold" className="text-base font-bold">
          Bold Label
        </Label>
        <Input type="text" id="bold" placeholder="Custom bold label" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="uppercase" className="text-xs uppercase tracking-wider">
          Uppercase Label
        </Label>
        <Input type="text" id="uppercase" placeholder="Small uppercase label" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="colored" className="text-[#0ec2bc] font-semibold">
          Ozean Licht Branded Label
        </Label>
        <Input type="text" id="colored" placeholder="Turquoise colored label" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="large" className="text-lg font-semibold">
          Large Label
        </Label>
        <Input type="text" id="large" placeholder="Larger label text" />
      </div>
    </div>
}`,...(Ie=(Fe=b.parameters)==null?void 0:Fe.docs)==null?void 0:Ie.source},description:{story:"Label with custom styling",...(qe=(Se=b.parameters)==null?void 0:Se.docs)==null?void 0:qe.description}}};var De,Ee,Te,We,Ae;x.parameters={...x.parameters,docs:{...(De=x.parameters)==null?void 0:De.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <div className="grid w-full gap-1.5">
        <Label htmlFor="default-state">Default State</Label>
        <Input type="text" id="default-state" placeholder="Normal input" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="required-state">
          Required State <span className="text-red-500">*</span>
        </Label>
        <Input type="text" id="required-state" placeholder="Required input" required />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="disabled-state" className="cursor-not-allowed opacity-70">
          Disabled State
        </Label>
        <Input type="text" id="disabled-state" disabled value="Disabled input" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="error-state" className="text-red-500">
          Error State
        </Label>
        <Input type="text" id="error-state" className="border-red-500 focus-visible:ring-red-500" defaultValue="Invalid value" />
        <p className="text-sm text-red-500">This field has an error</p>
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="success-state" className="text-[#0ec2bc]">
          Success State
        </Label>
        <Input type="text" id="success-state" className="border-[#0ec2bc] focus-visible:ring-[#0ec2bc]" value="Valid value" readOnly />
        <p className="text-sm text-[#0ec2bc]">✓ This field is valid</p>
      </div>
    </div>
}`,...(Te=(Ee=x.parameters)==null?void 0:Ee.docs)==null?void 0:Te.source},description:{story:"All label states showcase",...(Ae=(We=x.parameters)==null?void 0:We.docs)==null?void 0:Ae.description}}};var Re,Ce,Pe,ke,Oe;g.parameters={...g.parameters,docs:{...(Re=g.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-4 font-semibold">Proper Label Association</h3>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="accessible">
            Email Address
          </Label>
          <Input type="email" id="accessible" placeholder="email@example.com" aria-describedby="email-description" />
          <p id="email-description" className="text-sm text-muted-foreground">
            We'll never share your email with anyone else.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-4 font-semibold">Required Field Indicator</h3>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="required-demo">
            Password <span className="text-red-500" aria-label="required">*</span>
          </Label>
          <Input type="password" id="required-demo" placeholder="Enter password" required aria-required="true" />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-4 font-semibold">Disabled Field</h3>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="disabled-demo">
            Read-only Field
          </Label>
          <Input type="text" id="disabled-demo" disabled value="This field cannot be edited" aria-disabled="true" />
        </div>
      </div>
    </div>
}`,...(Pe=(Ce=g.parameters)==null?void 0:Ce.docs)==null?void 0:Pe.source},description:{story:"Accessibility demonstration",...(Oe=(ke=g.parameters)==null?void 0:ke.docs)==null?void 0:Oe.description}}};const ca=["Default","WithInput","WithCheckbox","WithRadio","Required","Disabled","WithHelperText","WithError","WithSuccess","WithDescription","LabelPositions","FormGroup","CustomStyling","AllStates","AccessibilityDemo"];export{g as AccessibilityDemo,x as AllStates,b as CustomStyling,r as Default,c as Disabled,h as FormGroup,u as LabelPositions,d as Required,t as WithCheckbox,p as WithDescription,o as WithError,n as WithHelperText,l as WithInput,i as WithRadio,m as WithSuccess,ca as __namedExportsOrder,da as default};
