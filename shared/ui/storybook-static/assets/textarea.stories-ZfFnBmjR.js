import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{f as de}from"./index-CJu6nLMj.js";import{T as a}from"./textarea-B_02bPEu.js";import{L as s}from"./label-BZCfx7Ud.js";import{r as ie}from"./index-B2-qRKKC.js";import"./cn-CKXzwFwe.js";import"./clsx-B-dksMZM.js";import"./index-B5oyz0SX.js";import"./index-kS-9iBlu.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-BiMR7eR1.js";import"./index-BFjtS4uE.js";import"./index-Dp3B9jqt.js";const je={title:"Tier 1: Primitives/shadcn/Textarea",component:a,parameters:{layout:"centered",docs:{description:{component:"A multi-line text input field for longer content."}}},tags:["autodocs"],argTypes:{placeholder:{control:"text",description:"Placeholder text"},disabled:{control:"boolean",description:"Disable textarea interaction"},rows:{control:"number",description:"Number of visible text rows"}},args:{onChange:de()},decorators:[r=>e.jsx("div",{className:"w-[400px]",children:e.jsx(r,{})})]},l={args:{placeholder:"Type your message here..."}},i={args:{value:"This is a pre-filled textarea with some content."}},n={args:{disabled:!0,value:"This textarea is disabled."}},d={args:{rows:10,placeholder:"A taller textarea with 10 rows..."}},c={render:()=>e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(s,{htmlFor:"message",children:"Your message"}),e.jsx(a,{id:"message",placeholder:"Type your message here..."})]})},m={render:()=>e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(s,{htmlFor:"bio",children:"Biography"}),e.jsx(a,{id:"bio",placeholder:"Tell us a little bit about yourself...",rows:5}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"You can use markdown formatting in your bio."})]})},p={render:()=>{const[g,t]=ie.useState("");return e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(s,{htmlFor:"tweet",children:"Compose tweet"}),e.jsx(a,{id:"tweet",placeholder:"What's happening?",value:g,onChange:o=>t(o.target.value),maxLength:280,rows:4}),e.jsxs("p",{className:"text-sm text-muted-foreground text-right",children:[g.length,"/",280," characters"]})]})}},u={render:()=>{const[r,g]=ie.useState(""),t=10,o=r.length>=t;return e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(s,{htmlFor:"feedback",children:"Feedback"}),e.jsx(a,{id:"feedback",placeholder:"Share your thoughts...",value:r,onChange:ne=>g(ne.target.value),rows:4,className:!o&&r.length>0?"border-red-500":""}),!o&&r.length>0&&e.jsxs("p",{className:"text-sm text-red-500",children:["Minimum ",t," characters required (",r.length,"/",t,")"]}),o&&e.jsx("p",{className:"text-sm text-green-600",children:"✓ Ready to submit"})]})}},h={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(s,{children:"Empty"}),e.jsx(a,{placeholder:"Empty textarea"})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(s,{children:"With Content"}),e.jsx(a,{value:"This textarea has content"})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(s,{children:"Focused"}),e.jsx(a,{defaultValue:"Click to see focus ring",autoFocus:!0})]}),e.jsxs("div",{className:"grid w-full gap-1.5",children:[e.jsx(s,{className:"text-muted-foreground",children:"Disabled"}),e.jsx(a,{disabled:!0,value:"This is disabled"})]})]})};var x,b,v,w,f;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    placeholder: 'Type your message here...'
  }
}`,...(v=(b=l.parameters)==null?void 0:b.docs)==null?void 0:v.source},description:{story:"Default textarea",...(f=(w=l.parameters)==null?void 0:w.docs)==null?void 0:f.description}}};var y,L,j,N,T;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    value: 'This is a pre-filled textarea with some content.'
  }
}`,...(j=(L=i.parameters)==null?void 0:L.docs)==null?void 0:j.source},description:{story:"Textarea with value",...(T=(N=i.parameters)==null?void 0:N.docs)==null?void 0:T.description}}};var C,F,S,V,W;n.parameters={...n.parameters,docs:{...(C=n.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    disabled: true,
    value: 'This textarea is disabled.'
  }
}`,...(S=(F=n.parameters)==null?void 0:F.docs)==null?void 0:S.source},description:{story:"Disabled textarea",...(W=(V=n.parameters)==null?void 0:V.docs)==null?void 0:W.description}}};var D,k,E,A,R;d.parameters={...d.parameters,docs:{...(D=d.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    rows: 10,
    placeholder: 'A taller textarea with 10 rows...'
  }
}`,...(E=(k=d.parameters)==null?void 0:k.docs)==null?void 0:E.source},description:{story:"Textarea with custom rows",...(R=(A=d.parameters)==null?void 0:A.docs)==null?void 0:R.description}}};var Y,q,B,M,P;c.parameters={...c.parameters,docs:{...(Y=c.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: () => <div className="grid w-full gap-1.5">
      <Label htmlFor="message">Your message</Label>
      <Textarea id="message" placeholder="Type your message here..." />
    </div>
}`,...(B=(q=c.parameters)==null?void 0:q.docs)==null?void 0:B.source},description:{story:"Textarea with label",...(P=(M=c.parameters)==null?void 0:M.docs)==null?void 0:P.description}}};var _,O,z,G,H;m.parameters={...m.parameters,docs:{...(_=m.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: () => <div className="grid w-full gap-1.5">
      <Label htmlFor="bio">Biography</Label>
      <Textarea id="bio" placeholder="Tell us a little bit about yourself..." rows={5} />
      <p className="text-sm text-muted-foreground">
        You can use markdown formatting in your bio.
      </p>
    </div>
}`,...(z=(O=m.parameters)==null?void 0:O.docs)==null?void 0:z.source},description:{story:"Textarea with label and description",...(H=(G=m.parameters)==null?void 0:G.docs)==null?void 0:H.description}}};var I,J,K,Q,U;p.parameters={...p.parameters,docs:{...(I=p.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => {
    const maxLength = 280;
    const [value, setValue] = React.useState('');
    return <div className="grid w-full gap-1.5">
        <Label htmlFor="tweet">Compose tweet</Label>
        <Textarea id="tweet" placeholder="What's happening?" value={value} onChange={e => setValue(e.target.value)} maxLength={maxLength} rows={4} />
        <p className="text-sm text-muted-foreground text-right">
          {value.length}/{maxLength} characters
        </p>
      </div>;
  }
}`,...(K=(J=p.parameters)==null?void 0:J.docs)==null?void 0:K.source},description:{story:"Textarea with character count",...(U=(Q=p.parameters)==null?void 0:Q.docs)==null?void 0:U.description}}};var X,Z,$,ee,ae;u.parameters={...u.parameters,docs:{...(X=u.parameters)==null?void 0:X.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = React.useState('');
    const minLength = 10;
    const isValid = value.length >= minLength;
    return <div className="grid w-full gap-1.5">
        <Label htmlFor="feedback">Feedback</Label>
        <Textarea id="feedback" placeholder="Share your thoughts..." value={value} onChange={e => setValue(e.target.value)} rows={4} className={!isValid && value.length > 0 ? 'border-red-500' : ''} />
        {!isValid && value.length > 0 && <p className="text-sm text-red-500">
            Minimum {minLength} characters required ({value.length}/{minLength})
          </p>}
        {isValid && <p className="text-sm text-green-600">
            ✓ Ready to submit
          </p>}
      </div>;
  }
}`,...($=(Z=u.parameters)==null?void 0:Z.docs)==null?void 0:$.source},description:{story:"Form example with validation",...(ae=(ee=u.parameters)==null?void 0:ee.docs)==null?void 0:ae.description}}};var re,se,te,oe,le;h.parameters={...h.parameters,docs:{...(re=h.parameters)==null?void 0:re.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">
      <div className="grid w-full gap-1.5">
        <Label>Empty</Label>
        <Textarea placeholder="Empty textarea" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label>With Content</Label>
        <Textarea value="This textarea has content" />
      </div>

      <div className="grid w-full gap-1.5">
        <Label>Focused</Label>
        <Textarea defaultValue="Click to see focus ring" autoFocus />
      </div>

      <div className="grid w-full gap-1.5">
        <Label className="text-muted-foreground">Disabled</Label>
        <Textarea disabled value="This is disabled" />
      </div>
    </div>
}`,...(te=(se=h.parameters)==null?void 0:se.docs)==null?void 0:te.source},description:{story:"All states showcase",...(le=(oe=h.parameters)==null?void 0:oe.docs)==null?void 0:le.description}}};const Ne=["Default","WithValue","Disabled","CustomRows","WithLabel","WithLabelAndDescription","WithCharacterCount","FormExample","AllStates"];export{h as AllStates,d as CustomRows,l as Default,n as Disabled,u as FormExample,p as WithCharacterCount,c as WithLabel,m as WithLabelAndDescription,i as WithValue,Ne as __namedExportsOrder,je as default};
