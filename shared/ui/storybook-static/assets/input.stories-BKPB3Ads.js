import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{f as Ma}from"./index-CJu6nLMj.js";import{I as a}from"./input-Db9iZ-Hs.js";import{L as r}from"./label-Cp9r14oL.js";import{r as V}from"./index-B2-qRKKC.js";import"./cn-CytzSlOG.js";import"./index-B5oyz0SX.js";import"./index-kS-9iBlu.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-BiMR7eR1.js";import"./index-BFjtS4uE.js";import"./index-DVF2XGCm.js";const Za={title:"Tier 1: Primitives/shadcn/Input",component:a,parameters:{layout:"centered",docs:{description:{component:"A single-line text input field with support for various input types and states."}}},tags:["autodocs"],argTypes:{type:{control:"select",options:["text","email","password","number","search","tel","url","date","file"],description:"HTML input type"},placeholder:{control:"text",description:"Placeholder text"},disabled:{control:"boolean",description:"Disable input interaction"},readOnly:{control:"boolean",description:"Make input read-only"},value:{control:"text",description:"Input value"}},args:{onChange:Ma()},decorators:[s=>e.jsx("div",{className:"w-[350px]",children:e.jsx(s,{})})]},i={args:{type:"text",placeholder:"Enter text..."}},d={args:{type:"text",value:"Pre-filled value"}},n={args:{type:"email",placeholder:"email@example.com"}},o={args:{type:"password",placeholder:"Enter password..."}},c={args:{type:"number",placeholder:"0"}},p={args:{type:"search",placeholder:"Search..."}},m={args:{type:"tel",placeholder:"+43 123 456 789"}},u={args:{type:"url",placeholder:"https://example.com"}},h={args:{type:"date"}},x={args:{type:"file"}},g={args:{type:"text",disabled:!0,value:"This input is disabled"}},v={args:{type:"text",readOnly:!0,value:"This input is read-only"}},y={render:()=>e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(r,{htmlFor:"email",children:"Email"}),e.jsx(a,{type:"email",id:"email",placeholder:"email@example.com"})]})},b={render:()=>e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(r,{htmlFor:"username",children:"Username"}),e.jsx(a,{type:"text",id:"username",placeholder:"ozean_licht_user"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"This is your public display name. It can be your real name or a pseudonym."})]})},f={render:()=>e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(r,{htmlFor:"email-error",children:"Email"}),e.jsx(a,{type:"email",id:"email-error",placeholder:"email@example.com",className:"border-red-500 focus-visible:ring-red-500",defaultValue:"invalid-email"}),e.jsx("p",{className:"text-sm text-red-500",children:"Please enter a valid email address."})]})},w={render:()=>e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(r,{htmlFor:"email-success",children:"Email"}),e.jsx(a,{type:"email",id:"email-success",placeholder:"email@example.com",className:"border-[var(--primary)] focus-visible:ring-[var(--primary)]",value:"valid@email.com",readOnly:!0}),e.jsx("p",{className:"text-sm text-[var(--primary)]",children:"✓ Email is valid and available"})]})},j={render:()=>e.jsxs("div",{className:"flex w-full items-center space-x-2",children:[e.jsx(a,{type:"search",placeholder:"Search..."}),e.jsx("button",{type:"submit",className:"inline-flex items-center justify-center rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2",children:"Search"})]})},N={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(r,{htmlFor:"name",children:"Full Name"}),e.jsx(a,{type:"text",id:"name",placeholder:"Max Mustermann"})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(r,{htmlFor:"email-form",children:"Email"}),e.jsx(a,{type:"email",id:"email-form",placeholder:"max@example.com"})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(r,{htmlFor:"phone",children:"Phone"}),e.jsx(a,{type:"tel",id:"phone",placeholder:"+43 123 456 789"})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(r,{htmlFor:"website",children:"Website"}),e.jsx(a,{type:"url",id:"website",placeholder:"https://ozean-licht.dev"})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(r,{htmlFor:"birthdate",children:"Birth Date"}),e.jsx(a,{type:"date",id:"birthdate"})]})]})},L={render:()=>{const[s,l]=V.useState(!1);return e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(r,{htmlFor:"password-toggle",children:"Password"}),e.jsxs("div",{className:"relative",children:[e.jsx(a,{type:s?"text":"password",id:"password-toggle",placeholder:"Enter password..."}),e.jsx("button",{type:"button",onClick:()=>l(!s),className:"absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground",children:s?"Hide":"Show"})]})]})}},S={render:()=>{const[l,T]=V.useState("");return e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(r,{htmlFor:"bio",children:"Bio"}),e.jsx(a,{type:"text",id:"bio",placeholder:"Tell us about yourself...",value:l,onChange:t=>T(t.target.value),maxLength:50}),e.jsxs("p",{className:"text-sm text-muted-foreground text-right",children:[l.length,"/",50," characters"]})]})}},F={render:()=>{const[s,l]=V.useState(""),t=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s),P=s.length>0;return e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(r,{htmlFor:"email-validation",children:"Email"}),e.jsx(a,{type:"email",id:"email-validation",placeholder:"email@example.com",value:s,onChange:Ba=>l(Ba.target.value),className:P?t?"border-[var(--primary)] focus-visible:ring-[var(--primary)]":"border-red-500 focus-visible:ring-red-500":""}),P&&e.jsx("p",{className:`text-sm ${t?"text-[var(--primary)]":"text-red-500"}`,children:t?"✓ Valid email address":"✗ Invalid email address"})]})}},I={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(r,{htmlFor:"text",children:"Text"}),e.jsx(a,{type:"text",id:"text",placeholder:"Text input"})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(r,{htmlFor:"email-all",children:"Email"}),e.jsx(a,{type:"email",id:"email-all",placeholder:"email@example.com"})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(r,{htmlFor:"password-all",children:"Password"}),e.jsx(a,{type:"password",id:"password-all",placeholder:"••••••••"})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(r,{htmlFor:"number-all",children:"Number"}),e.jsx(a,{type:"number",id:"number-all",placeholder:"123"})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(r,{htmlFor:"search-all",children:"Search"}),e.jsx(a,{type:"search",id:"search-all",placeholder:"Search..."})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(r,{htmlFor:"tel-all",children:"Telephone"}),e.jsx(a,{type:"tel",id:"tel-all",placeholder:"+43 123 456 789"})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(r,{htmlFor:"url-all",children:"URL"}),e.jsx(a,{type:"url",id:"url-all",placeholder:"https://example.com"})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(r,{htmlFor:"date-all",children:"Date"}),e.jsx(a,{type:"date",id:"date-all"})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(r,{htmlFor:"file-all",children:"File"}),e.jsx(a,{type:"file",id:"file-all"})]})]})},E={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(r,{children:"Default (Empty)"}),e.jsx(a,{type:"text",placeholder:"Empty input"})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(r,{children:"With Value"}),e.jsx(a,{type:"text",value:"Input with value",readOnly:!0})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(r,{children:"Focused"}),e.jsx(a,{type:"text",defaultValue:"Click to see focus ring",autoFocus:!0})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(r,{className:"text-muted-foreground",children:"Disabled"}),e.jsx(a,{type:"text",disabled:!0,value:"Disabled input"})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(r,{children:"Read-only"}),e.jsx(a,{type:"text",readOnly:!0,value:"Read-only input"})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(r,{children:"Error State"}),e.jsx(a,{type:"text",value:"Invalid value",className:"border-red-500 focus-visible:ring-red-500",readOnly:!0}),e.jsx("p",{className:"text-sm text-red-500",children:"This field has an error"})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(r,{children:"Success State"}),e.jsx(a,{type:"text",value:"Valid value",className:"border-[var(--primary)] focus-visible:ring-[var(--primary)]",readOnly:!0}),e.jsx("p",{className:"text-sm text-[var(--primary)]",children:"✓ This field is valid"})]})]})};var D,W,R,O,C;i.parameters={...i.parameters,docs:{...(D=i.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    type: 'text',
    placeholder: 'Enter text...'
  }
}`,...(R=(W=i.parameters)==null?void 0:W.docs)==null?void 0:R.source},description:{story:"Default text input",...(C=(O=i.parameters)==null?void 0:O.docs)==null?void 0:C.description}}};var A,U,B,M,_;d.parameters={...d.parameters,docs:{...(A=d.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    type: 'text',
    value: 'Pre-filled value'
  }
}`,...(B=(U=d.parameters)==null?void 0:U.docs)==null?void 0:B.source},description:{story:"Input with value",...(_=(M=d.parameters)==null?void 0:M.docs)==null?void 0:_.description}}};var k,z,$,H,q;n.parameters={...n.parameters,docs:{...(k=n.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    type: 'email',
    placeholder: 'email@example.com'
  }
}`,...($=(z=n.parameters)==null?void 0:z.docs)==null?void 0:$.source},description:{story:"Email input type",...(q=(H=n.parameters)==null?void 0:H.docs)==null?void 0:q.description}}};var G,J,K,Q,X;o.parameters={...o.parameters,docs:{...(G=o.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    type: 'password',
    placeholder: 'Enter password...'
  }
}`,...(K=(J=o.parameters)==null?void 0:J.docs)==null?void 0:K.source},description:{story:"Password input type",...(X=(Q=o.parameters)==null?void 0:Q.docs)==null?void 0:X.description}}};var Y,Z,ee,ae,re;c.parameters={...c.parameters,docs:{...(Y=c.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    type: 'number',
    placeholder: '0'
  }
}`,...(ee=(Z=c.parameters)==null?void 0:Z.docs)==null?void 0:ee.source},description:{story:"Number input type",...(re=(ae=c.parameters)==null?void 0:ae.docs)==null?void 0:re.description}}};var se,le,te,ie,de;p.parameters={...p.parameters,docs:{...(se=p.parameters)==null?void 0:se.docs,source:{originalSource:`{
  args: {
    type: 'search',
    placeholder: 'Search...'
  }
}`,...(te=(le=p.parameters)==null?void 0:le.docs)==null?void 0:te.source},description:{story:"Search input type",...(de=(ie=p.parameters)==null?void 0:ie.docs)==null?void 0:de.description}}};var ne,oe,ce,pe,me;m.parameters={...m.parameters,docs:{...(ne=m.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    type: 'tel',
    placeholder: '+43 123 456 789'
  }
}`,...(ce=(oe=m.parameters)==null?void 0:oe.docs)==null?void 0:ce.source},description:{story:"Telephone input type",...(me=(pe=m.parameters)==null?void 0:pe.docs)==null?void 0:me.description}}};var ue,he,xe,ge,ve;u.parameters={...u.parameters,docs:{...(ue=u.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  args: {
    type: 'url',
    placeholder: 'https://example.com'
  }
}`,...(xe=(he=u.parameters)==null?void 0:he.docs)==null?void 0:xe.source},description:{story:"URL input type",...(ve=(ge=u.parameters)==null?void 0:ge.docs)==null?void 0:ve.description}}};var ye,be,fe,we,je;h.parameters={...h.parameters,docs:{...(ye=h.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  args: {
    type: 'date'
  }
}`,...(fe=(be=h.parameters)==null?void 0:be.docs)==null?void 0:fe.source},description:{story:"Date input type",...(je=(we=h.parameters)==null?void 0:we.docs)==null?void 0:je.description}}};var Ne,Le,Se,Fe,Ie;x.parameters={...x.parameters,docs:{...(Ne=x.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
  args: {
    type: 'file'
  }
}`,...(Se=(Le=x.parameters)==null?void 0:Le.docs)==null?void 0:Se.source},description:{story:"File input type with custom file selector styling",...(Ie=(Fe=x.parameters)==null?void 0:Fe.docs)==null?void 0:Ie.description}}};var Ee,Ve,Te,Pe,De;g.parameters={...g.parameters,docs:{...(Ee=g.parameters)==null?void 0:Ee.docs,source:{originalSource:`{
  args: {
    type: 'text',
    disabled: true,
    value: 'This input is disabled'
  }
}`,...(Te=(Ve=g.parameters)==null?void 0:Ve.docs)==null?void 0:Te.source},description:{story:"Disabled input state",...(De=(Pe=g.parameters)==null?void 0:Pe.docs)==null?void 0:De.description}}};var We,Re,Oe,Ce,Ae;v.parameters={...v.parameters,docs:{...(We=v.parameters)==null?void 0:We.docs,source:{originalSource:`{
  args: {
    type: 'text',
    readOnly: true,
    value: 'This input is read-only'
  }
}`,...(Oe=(Re=v.parameters)==null?void 0:Re.docs)==null?void 0:Oe.source},description:{story:"Readonly input state",...(Ae=(Ce=v.parameters)==null?void 0:Ce.docs)==null?void 0:Ae.description}}};var Ue,Be,Me,_e,ke;y.parameters={...y.parameters,docs:{...(Ue=y.parameters)==null?void 0:Ue.docs,source:{originalSource:`{
  render: () => <div className="grid w-full gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="email@example.com" />
    </div>
}`,...(Me=(Be=y.parameters)==null?void 0:Be.docs)==null?void 0:Me.source},description:{story:"Input with label",...(ke=(_e=y.parameters)==null?void 0:_e.docs)==null?void 0:ke.description}}};var ze,$e,He,qe,Ge;b.parameters={...b.parameters,docs:{...(ze=b.parameters)==null?void 0:ze.docs,source:{originalSource:`{
  render: () => <div className="grid w-full gap-1.5">
      <Label htmlFor="username">Username</Label>
      <Input type="text" id="username" placeholder="ozean_licht_user" />
      <p className="text-sm text-muted-foreground">
        This is your public display name. It can be your real name or a pseudonym.
      </p>
    </div>
}`,...(He=($e=b.parameters)==null?void 0:$e.docs)==null?void 0:He.source},description:{story:"Input with label and description",...(Ge=(qe=b.parameters)==null?void 0:qe.docs)==null?void 0:Ge.description}}};var Je,Ke,Qe,Xe,Ye;f.parameters={...f.parameters,docs:{...(Je=f.parameters)==null?void 0:Je.docs,source:{originalSource:`{
  render: () => <div className="grid w-full gap-1.5">
      <Label htmlFor="email-error">Email</Label>
      <Input type="email" id="email-error" placeholder="email@example.com" className="border-red-500 focus-visible:ring-red-500" defaultValue="invalid-email" />
      <p className="text-sm text-red-500">
        Please enter a valid email address.
      </p>
    </div>
}`,...(Qe=(Ke=f.parameters)==null?void 0:Ke.docs)==null?void 0:Qe.source},description:{story:"Input with error state (custom styling)",...(Ye=(Xe=f.parameters)==null?void 0:Xe.docs)==null?void 0:Ye.description}}};var Ze,ea,aa,ra,sa;w.parameters={...w.parameters,docs:{...(Ze=w.parameters)==null?void 0:Ze.docs,source:{originalSource:`{
  render: () => <div className="grid w-full gap-1.5">
      <Label htmlFor="email-success">Email</Label>
      <Input type="email" id="email-success" placeholder="email@example.com" className="border-[var(--primary)] focus-visible:ring-[var(--primary)]" value="valid@email.com" readOnly />
      <p className="text-sm text-[var(--primary)]">
        ✓ Email is valid and available
      </p>
    </div>
}`,...(aa=(ea=w.parameters)==null?void 0:ea.docs)==null?void 0:aa.source},description:{story:"Input with success state (custom styling with Ozean Licht turquoise)",...(sa=(ra=w.parameters)==null?void 0:ra.docs)==null?void 0:sa.description}}};var la,ta,ia,da,na;j.parameters={...j.parameters,docs:{...(la=j.parameters)==null?void 0:la.docs,source:{originalSource:`{
  render: () => <div className="flex w-full items-center space-x-2">
      <Input type="search" placeholder="Search..." />
      <button type="submit" className="inline-flex items-center justify-center rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2">
        Search
      </button>
    </div>
}`,...(ia=(ta=j.parameters)==null?void 0:ta.docs)==null?void 0:ia.source},description:{story:"Input with button (search example)",...(na=(da=j.parameters)==null?void 0:da.docs)==null?void 0:na.description}}};var oa,ca,pa,ma,ua;N.parameters={...N.parameters,docs:{...(oa=N.parameters)==null?void 0:oa.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <div className="grid w-full gap-1.5">
        <Label htmlFor="name">Full Name</Label>
        <Input type="text" id="name" placeholder="Max Mustermann" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="email-form">Email</Label>
        <Input type="email" id="email-form" placeholder="max@example.com" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="phone">Phone</Label>
        <Input type="tel" id="phone" placeholder="+43 123 456 789" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="website">Website</Label>
        <Input type="url" id="website" placeholder="https://ozean-licht.dev" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="birthdate">Birth Date</Label>
        <Input type="date" id="birthdate" />
      </div>
    </div>
}`,...(pa=(ca=N.parameters)==null?void 0:ca.docs)==null?void 0:pa.source},description:{story:"Form example with multiple input types",...(ua=(ma=N.parameters)==null?void 0:ma.docs)==null?void 0:ua.description}}};var ha,xa,ga,va,ya;L.parameters={...L.parameters,docs:{...(ha=L.parameters)==null?void 0:ha.docs,source:{originalSource:`{
  render: () => {
    const [showPassword, setShowPassword] = React.useState(false);
    return <div className="grid w-full gap-1.5">
        <Label htmlFor="password-toggle">Password</Label>
        <div className="relative">
          <Input type={showPassword ? 'text' : 'password'} id="password-toggle" placeholder="Enter password..." />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground">
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>;
  }
}`,...(ga=(xa=L.parameters)==null?void 0:xa.docs)==null?void 0:ga.source},description:{story:"Password input with toggle visibility example",...(ya=(va=L.parameters)==null?void 0:va.docs)==null?void 0:ya.description}}};var ba,fa,wa,ja,Na;S.parameters={...S.parameters,docs:{...(ba=S.parameters)==null?void 0:ba.docs,source:{originalSource:`{
  render: () => {
    const maxLength = 50;
    const [value, setValue] = React.useState('');
    return <div className="grid w-full gap-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Input type="text" id="bio" placeholder="Tell us about yourself..." value={value} onChange={e => setValue(e.target.value)} maxLength={maxLength} />
        <p className="text-sm text-muted-foreground text-right">
          {value.length}/{maxLength} characters
        </p>
      </div>;
  }
}`,...(wa=(fa=S.parameters)==null?void 0:fa.docs)==null?void 0:wa.source},description:{story:"Input with character counter",...(Na=(ja=S.parameters)==null?void 0:ja.docs)==null?void 0:Na.description}}};var La,Sa,Fa,Ia,Ea;F.parameters={...F.parameters,docs:{...(La=F.parameters)==null?void 0:La.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = React.useState('');
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    const isValid = emailRegex.test(value);
    const showValidation = value.length > 0;
    return <div className="grid w-full gap-1.5">
        <Label htmlFor="email-validation">Email</Label>
        <Input type="email" id="email-validation" placeholder="email@example.com" value={value} onChange={e => setValue(e.target.value)} className={showValidation ? isValid ? 'border-[var(--primary)] focus-visible:ring-[var(--primary)]' : 'border-red-500 focus-visible:ring-red-500' : ''} />
        {showValidation && <p className={\`text-sm \${isValid ? 'text-[var(--primary)]' : 'text-red-500'}\`}>
            {isValid ? '✓ Valid email address' : '✗ Invalid email address'}
          </p>}
      </div>;
  }
}`,...(Fa=(Sa=F.parameters)==null?void 0:Sa.docs)==null?void 0:Fa.source},description:{story:"Input with validation",...(Ea=(Ia=F.parameters)==null?void 0:Ia.docs)==null?void 0:Ea.description}}};var Va,Ta,Pa,Da,Wa;I.parameters={...I.parameters,docs:{...(Va=I.parameters)==null?void 0:Va.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <div className="grid w-full gap-1.5">
        <Label htmlFor="text">Text</Label>
        <Input type="text" id="text" placeholder="Text input" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="email-all">Email</Label>
        <Input type="email" id="email-all" placeholder="email@example.com" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="password-all">Password</Label>
        <Input type="password" id="password-all" placeholder="••••••••" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="number-all">Number</Label>
        <Input type="number" id="number-all" placeholder="123" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="search-all">Search</Label>
        <Input type="search" id="search-all" placeholder="Search..." />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="tel-all">Telephone</Label>
        <Input type="tel" id="tel-all" placeholder="+43 123 456 789" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="url-all">URL</Label>
        <Input type="url" id="url-all" placeholder="https://example.com" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="date-all">Date</Label>
        <Input type="date" id="date-all" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="file-all">File</Label>
        <Input type="file" id="file-all" />
      </div>
    </div>
}`,...(Pa=(Ta=I.parameters)==null?void 0:Ta.docs)==null?void 0:Pa.source},description:{story:"All input types showcase",...(Wa=(Da=I.parameters)==null?void 0:Da.docs)==null?void 0:Wa.description}}};var Ra,Oa,Ca,Aa,Ua;E.parameters={...E.parameters,docs:{...(Ra=E.parameters)==null?void 0:Ra.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <div className="grid w-full gap-1.5">
        <Label>Default (Empty)</Label>
        <Input type="text" placeholder="Empty input" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label>With Value</Label>
        <Input type="text" value="Input with value" readOnly />
      </div>

      <div className="grid w-full gap-1.5">
        <Label>Focused</Label>
        <Input type="text" defaultValue="Click to see focus ring" autoFocus />
      </div>

      <div className="grid w-full gap-1.5">
        <Label className="text-muted-foreground">Disabled</Label>
        <Input type="text" disabled value="Disabled input" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label>Read-only</Label>
        <Input type="text" readOnly value="Read-only input" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label>Error State</Label>
        <Input type="text" value="Invalid value" className="border-red-500 focus-visible:ring-red-500" readOnly />
        <p className="text-sm text-red-500">This field has an error</p>
      </div>

      <div className="grid w-full gap-1.5">
        <Label>Success State</Label>
        <Input type="text" value="Valid value" className="border-[var(--primary)] focus-visible:ring-[var(--primary)]" readOnly />
        <p className="text-sm text-[var(--primary)]">✓ This field is valid</p>
      </div>
    </div>
}`,...(Ca=(Oa=E.parameters)==null?void 0:Oa.docs)==null?void 0:Ca.source},description:{story:"All states showcase",...(Ua=(Aa=E.parameters)==null?void 0:Aa.docs)==null?void 0:Ua.description}}};const er=["Default","WithValue","Email","Password","Number","Search","Telephone","URL","Date","File","Disabled","ReadOnly","WithLabel","WithLabelAndDescription","WithError","WithSuccess","WithButton","FormExample","PasswordWithToggle","WithCharacterCounter","WithValidation","AllTypes","AllStates"];export{E as AllStates,I as AllTypes,h as Date,i as Default,g as Disabled,n as Email,x as File,N as FormExample,c as Number,o as Password,L as PasswordWithToggle,v as ReadOnly,p as Search,m as Telephone,u as URL,j as WithButton,S as WithCharacterCounter,f as WithError,y as WithLabel,b as WithLabelAndDescription,w as WithSuccess,F as WithValidation,d as WithValue,er as __namedExportsOrder,Za as default};
