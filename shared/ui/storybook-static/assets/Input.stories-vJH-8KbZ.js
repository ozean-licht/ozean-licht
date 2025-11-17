import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{I as r,L as f,T as v}from"./Input-C2o_RQ9B.js";import{r as xr}from"./index-B2-qRKKC.js";import{S as mr}from"./search-BZ28WsQ8.js";import{M as yr}from"./mail-Cxl1hOu1.js";import{L as ur}from"./lock-C07ZgJYN.js";import{E as hr}from"./eye-B2FZkYMJ.js";import{E as wr}from"./eye-off-z17qZm2P.js";import"./index-Dp3B9jqt.js";import"./clsx-B-dksMZM.js";import"./input-BK5gJSzh.js";import"./cn-CKXzwFwe.js";import"./textarea-B_02bPEu.js";import"./label-BZCfx7Ud.js";import"./index-B5oyz0SX.js";import"./index-kS-9iBlu.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-BiMR7eR1.js";import"./index-BFjtS4uE.js";import"./createLucideIcon-BbF4D6Jl.js";const kr={title:"Tier 2: Branded/Input",component:r,parameters:{layout:"centered",docs:{description:{component:"Ozean Licht branded form inputs with turquoise focus rings and icon support."}}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","glass"],description:"Visual style variant"},inputSize:{control:"select",options:["sm","md","lg"],description:"Input size"},error:{control:"text",description:"Error message (or true for error state only)"},disabled:{control:"boolean",description:"Disable input"}},decorators:[E=>e.jsx("div",{className:"w-[400px]",children:e.jsx(E,{})})]},s={args:{placeholder:"Enter text..."}},a={render:()=>e.jsxs("div",{children:[e.jsx(f,{htmlFor:"name",children:"Name"}),e.jsx(r,{id:"name",placeholder:"Enter your name"})]})},o={render:()=>e.jsxs("div",{children:[e.jsx(f,{htmlFor:"email",required:!0,children:"Email Address"}),e.jsx(r,{id:"email",type:"email",placeholder:"you@example.com"})]})},t={args:{variant:"glass",placeholder:"Glass input..."}},i={args:{icon:e.jsx(mr,{className:"h-4 w-4"}),placeholder:"Search..."}},n={args:{type:"email",icon:e.jsx(yr,{className:"h-4 w-4"}),placeholder:"you@example.com"}},c={args:{type:"password",icon:e.jsx(ur,{className:"h-4 w-4"}),placeholder:"Enter password"}},p={args:{iconAfter:e.jsx(hr,{className:"h-4 w-4"}),placeholder:"Password",type:"password"}},d={args:{inputSize:"sm",placeholder:"Small input"}},l={args:{inputSize:"lg",placeholder:"Large input"}},m={args:{error:"This field is required",placeholder:"Enter value"}},u={args:{disabled:!0,placeholder:"Disabled input",value:"Cannot edit"}},h={render:()=>e.jsxs("div",{children:[e.jsx(f,{htmlFor:"username",required:!0,children:"Username"}),e.jsx(r,{id:"username",placeholder:"Choose a username",icon:e.jsx(mr,{className:"h-4 w-4"})}),e.jsx("p",{className:"mt-1.5 text-sm text-muted-foreground",children:"This will be your public display name."})]})},g={render:()=>e.jsx(v,{placeholder:"Enter your message..."})},x={render:()=>e.jsxs("div",{children:[e.jsx(f,{htmlFor:"message",required:!0,children:"Message"}),e.jsx(v,{id:"message",placeholder:"Type your message here..."})]})},y={render:()=>e.jsx(v,{error:"Message must be at least 10 characters",placeholder:"Too short..."})},w={render:function(){const[j,gr]=xr.useState(!1);return e.jsxs("div",{children:[e.jsx(f,{htmlFor:"password",required:!0,children:"Password"}),e.jsxs("div",{className:"relative",children:[e.jsx(r,{id:"password",type:j?"text":"password",icon:e.jsx(ur,{className:"h-4 w-4"}),placeholder:"Enter your password"}),e.jsx("button",{type:"button",onClick:()=>gr(!j),className:"absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",children:j?e.jsx(wr,{className:"h-4 w-4"}):e.jsx(hr,{className:"h-4 w-4"})})]})]})}},S={render:()=>e.jsxs("div",{className:"space-y-3",children:[e.jsx(r,{inputSize:"sm",placeholder:"Small"}),e.jsx(r,{inputSize:"md",placeholder:"Medium (default)"}),e.jsx(r,{inputSize:"lg",placeholder:"Large"})]})},b={render:()=>e.jsxs("div",{className:"space-y-3",children:[e.jsx(r,{type:"text",placeholder:"Text input"}),e.jsx(r,{type:"email",placeholder:"Email input"}),e.jsx(r,{type:"password",placeholder:"Password input"}),e.jsx(r,{type:"number",placeholder:"Number input"}),e.jsx(r,{type:"url",placeholder:"URL input"}),e.jsx(r,{type:"tel",placeholder:"Phone input"}),e.jsx(r,{type:"search",placeholder:"Search input"})]})};var T,I,N,L,P;s.parameters={...s.parameters,docs:{...(T=s.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    placeholder: 'Enter text...'
  }
}`,...(N=(I=s.parameters)==null?void 0:I.docs)==null?void 0:N.source},description:{story:"Default input",...(P=(L=s.parameters)==null?void 0:L.docs)==null?void 0:P.description}}};var z,q,F,A,W;a.parameters={...a.parameters,docs:{...(z=a.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: () => <div>
      <Label htmlFor="name">Name</Label>
      <Input id="name" placeholder="Enter your name" />
    </div>
}`,...(F=(q=a.parameters)==null?void 0:q.docs)==null?void 0:F.source},description:{story:"Input with label",...(W=(A=a.parameters)==null?void 0:A.docs)==null?void 0:W.description}}};var D,M,C,R,k;o.parameters={...o.parameters,docs:{...(D=o.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => <div>
      <Label htmlFor="email" required>
        Email Address
      </Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
}`,...(C=(M=o.parameters)==null?void 0:M.docs)==null?void 0:C.source},description:{story:"Required input with label",...(k=(R=o.parameters)==null?void 0:R.docs)==null?void 0:k.description}}};var G,O,U,_,B;t.parameters={...t.parameters,docs:{...(G=t.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    variant: 'glass',
    placeholder: 'Glass input...'
  }
}`,...(U=(O=t.parameters)==null?void 0:O.docs)==null?void 0:U.source},description:{story:"Glass variant with transparency",...(B=(_=t.parameters)==null?void 0:_.docs)==null?void 0:B.description}}};var V,H,J,K,Q;i.parameters={...i.parameters,docs:{...(V=i.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    icon: <Search className="h-4 w-4" />,
    placeholder: 'Search...'
  }
}`,...(J=(H=i.parameters)==null?void 0:H.docs)==null?void 0:J.source},description:{story:"Input with search icon",...(Q=(K=i.parameters)==null?void 0:K.docs)==null?void 0:Q.description}}};var X,Y,Z,$,ee;n.parameters={...n.parameters,docs:{...(X=n.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    type: 'email',
    icon: <Mail className="h-4 w-4" />,
    placeholder: 'you@example.com'
  }
}`,...(Z=(Y=n.parameters)==null?void 0:Y.docs)==null?void 0:Z.source},description:{story:"Email input with icon",...(ee=($=n.parameters)==null?void 0:$.docs)==null?void 0:ee.description}}};var re,se,ae,oe,te;c.parameters={...c.parameters,docs:{...(re=c.parameters)==null?void 0:re.docs,source:{originalSource:`{
  args: {
    type: 'password',
    icon: <Lock className="h-4 w-4" />,
    placeholder: 'Enter password'
  }
}`,...(ae=(se=c.parameters)==null?void 0:se.docs)==null?void 0:ae.source},description:{story:"Password input with icon",...(te=(oe=c.parameters)==null?void 0:oe.docs)==null?void 0:te.description}}};var ie,ne,ce,pe,de;p.parameters={...p.parameters,docs:{...(ie=p.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  args: {
    iconAfter: <Eye className="h-4 w-4" />,
    placeholder: 'Password',
    type: 'password'
  }
}`,...(ce=(ne=p.parameters)==null?void 0:ne.docs)==null?void 0:ce.source},description:{story:"Input with icon after",...(de=(pe=p.parameters)==null?void 0:pe.docs)==null?void 0:de.description}}};var le,me,ue,he,ge;d.parameters={...d.parameters,docs:{...(le=d.parameters)==null?void 0:le.docs,source:{originalSource:`{
  args: {
    inputSize: 'sm',
    placeholder: 'Small input'
  }
}`,...(ue=(me=d.parameters)==null?void 0:me.docs)==null?void 0:ue.source},description:{story:"Small input size",...(ge=(he=d.parameters)==null?void 0:he.docs)==null?void 0:ge.description}}};var xe,ye,we,Se,be;l.parameters={...l.parameters,docs:{...(xe=l.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  args: {
    inputSize: 'lg',
    placeholder: 'Large input'
  }
}`,...(we=(ye=l.parameters)==null?void 0:ye.docs)==null?void 0:we.source},description:{story:"Large input size",...(be=(Se=l.parameters)==null?void 0:Se.docs)==null?void 0:be.description}}};var fe,je,ve,Ee,Te;m.parameters={...m.parameters,docs:{...(fe=m.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  args: {
    error: 'This field is required',
    placeholder: 'Enter value'
  }
}`,...(ve=(je=m.parameters)==null?void 0:je.docs)==null?void 0:ve.source},description:{story:"Input with error state",...(Te=(Ee=m.parameters)==null?void 0:Ee.docs)==null?void 0:Te.description}}};var Ie,Ne,Le,Pe,ze;u.parameters={...u.parameters,docs:{...(Ie=u.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  args: {
    disabled: true,
    placeholder: 'Disabled input',
    value: 'Cannot edit'
  }
}`,...(Le=(Ne=u.parameters)==null?void 0:Ne.docs)==null?void 0:Le.source},description:{story:"Disabled input",...(ze=(Pe=u.parameters)==null?void 0:Pe.docs)==null?void 0:ze.description}}};var qe,Fe,Ae,We,De;h.parameters={...h.parameters,docs:{...(qe=h.parameters)==null?void 0:qe.docs,source:{originalSource:`{
  render: () => <div>
      <Label htmlFor="username" required>
        Username
      </Label>
      <Input id="username" placeholder="Choose a username" icon={<Search className="h-4 w-4" />} />
      <p className="mt-1.5 text-sm text-muted-foreground">
        This will be your public display name.
      </p>
    </div>
}`,...(Ae=(Fe=h.parameters)==null?void 0:Fe.docs)==null?void 0:Ae.source},description:{story:"Complete form field example",...(De=(We=h.parameters)==null?void 0:We.docs)==null?void 0:De.description}}};var Me,Ce,Re,ke,Ge;g.parameters={...g.parameters,docs:{...(Me=g.parameters)==null?void 0:Me.docs,source:{originalSource:`{
  render: () => <Textarea placeholder="Enter your message..." />
}`,...(Re=(Ce=g.parameters)==null?void 0:Ce.docs)==null?void 0:Re.source},description:{story:"Textarea default",...(Ge=(ke=g.parameters)==null?void 0:ke.docs)==null?void 0:Ge.description}}};var Oe,Ue,_e,Be,Ve;x.parameters={...x.parameters,docs:{...(Oe=x.parameters)==null?void 0:Oe.docs,source:{originalSource:`{
  render: () => <div>
      <Label htmlFor="message" required>
        Message
      </Label>
      <Textarea id="message" placeholder="Type your message here..." />
    </div>
}`,...(_e=(Ue=x.parameters)==null?void 0:Ue.docs)==null?void 0:_e.source},description:{story:"Textarea with label",...(Ve=(Be=x.parameters)==null?void 0:Be.docs)==null?void 0:Ve.description}}};var He,Je,Ke,Qe,Xe;y.parameters={...y.parameters,docs:{...(He=y.parameters)==null?void 0:He.docs,source:{originalSource:`{
  render: () => <Textarea error="Message must be at least 10 characters" placeholder="Too short..." />
}`,...(Ke=(Je=y.parameters)==null?void 0:Je.docs)==null?void 0:Ke.source},description:{story:"Textarea with error",...(Xe=(Qe=y.parameters)==null?void 0:Qe.docs)==null?void 0:Xe.description}}};var Ye,Ze,$e,er,rr;w.parameters={...w.parameters,docs:{...(Ye=w.parameters)==null?void 0:Ye.docs,source:{originalSource:`{
  render: function PasswordToggleExample() {
    const [showPassword, setShowPassword] = useState(false);
    return <div>
        <Label htmlFor="password" required>
          Password
        </Label>
        <div className="relative">
          <Input id="password" type={showPassword ? 'text' : 'password'} icon={<Lock className="h-4 w-4" />} placeholder="Enter your password" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>;
  }
}`,...($e=(Ze=w.parameters)==null?void 0:Ze.docs)==null?void 0:$e.source},description:{story:"Interactive password visibility toggle",...(rr=(er=w.parameters)==null?void 0:er.docs)==null?void 0:rr.description}}};var sr,ar,or,tr,ir;S.parameters={...S.parameters,docs:{...(sr=S.parameters)==null?void 0:sr.docs,source:{originalSource:`{
  render: () => <div className="space-y-3">
      <Input inputSize="sm" placeholder="Small" />
      <Input inputSize="md" placeholder="Medium (default)" />
      <Input inputSize="lg" placeholder="Large" />
    </div>
}`,...(or=(ar=S.parameters)==null?void 0:ar.docs)==null?void 0:or.source},description:{story:"All input sizes",...(ir=(tr=S.parameters)==null?void 0:tr.docs)==null?void 0:ir.description}}};var nr,cr,pr,dr,lr;b.parameters={...b.parameters,docs:{...(nr=b.parameters)==null?void 0:nr.docs,source:{originalSource:`{
  render: () => <div className="space-y-3">
      <Input type="text" placeholder="Text input" />
      <Input type="email" placeholder="Email input" />
      <Input type="password" placeholder="Password input" />
      <Input type="number" placeholder="Number input" />
      <Input type="url" placeholder="URL input" />
      <Input type="tel" placeholder="Phone input" />
      <Input type="search" placeholder="Search input" />
    </div>
}`,...(pr=(cr=b.parameters)==null?void 0:cr.docs)==null?void 0:pr.source},description:{story:"All input types",...(lr=(dr=b.parameters)==null?void 0:dr.docs)==null?void 0:lr.description}}};const Gr=["Default","WithLabel","Required","Glass","WithSearchIcon","EmailInput","PasswordInput","WithIconAfter","Small","Large","WithError","Disabled","FormField","TextareaDefault","TextareaWithLabel","TextareaWithError","PasswordToggle","AllSizes","AllTypes"];export{S as AllSizes,b as AllTypes,s as Default,u as Disabled,n as EmailInput,h as FormField,t as Glass,l as Large,c as PasswordInput,w as PasswordToggle,o as Required,d as Small,g as TextareaDefault,y as TextareaWithError,x as TextareaWithLabel,m as WithError,p as WithIconAfter,a as WithLabel,i as WithSearchIcon,Gr as __namedExportsOrder,kr as default};
