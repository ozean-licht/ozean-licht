import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{r as Re}from"./index-B2-qRKKC.js";import{c as Ie}from"./cn-CKXzwFwe.js";import{L as Be}from"./Input-C2o_RQ9B.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./clsx-B-dksMZM.js";import"./index-Dp3B9jqt.js";import"./input-BK5gJSzh.js";import"./textarea-B_02bPEu.js";import"./label-BZCfx7Ud.js";import"./index-B5oyz0SX.js";import"./index-kS-9iBlu.js";import"./index-BiMR7eR1.js";import"./index-BFjtS4uE.js";const o=Re.forwardRef(({className:n,error:t,selectSize:f="md",options:a,children:y,disabled:b,...F},w)=>{const Ue={sm:"px-3 py-2 text-sm",md:"px-4 py-3 text-base",lg:"px-5 py-4 text-lg"};return e.jsxs("div",{children:[e.jsx("select",{className:Ie("input-base appearance-none cursor-pointer",`bg-input bg-[url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")]`,"bg-[length:20px] bg-[right_0.75rem_center] bg-no-repeat","pr-10",Ue[f],t&&"border-destructive focus:ring-destructive",b&&"opacity-50 cursor-not-allowed",n),ref:w,disabled:b,...F,children:a?a.map(G=>e.jsx("option",{value:G.value,children:G.label},G.value)):y}),typeof t=="string"&&e.jsx("p",{className:"mt-1 text-sm text-destructive",children:t})]})});o.displayName="Select";const r=Re.forwardRef(({className:n,label:t,required:f,error:a,helpText:y,children:b,...F},w)=>e.jsxs("div",{ref:w,className:Ie("space-y-1.5",n),...F,children:[t&&e.jsxs("label",{className:"block text-sm font-medium text-foreground",children:[t,f&&e.jsx("span",{className:"text-destructive ml-1",children:"*"})]}),b,y&&!a&&e.jsx("p",{className:"text-sm text-muted-foreground",children:y}),a&&e.jsx("p",{className:"text-sm text-destructive",children:a})]}));r.displayName="FormGroup";try{o.displayName="Select",o.__docgenInfo={description:"",displayName:"Select",props:{error:{defaultValue:null,description:"Show error state",name:"error",required:!1,type:{name:"string | boolean"}},selectSize:{defaultValue:{value:"md"},description:"Select size",name:"selectSize",required:!1,type:{name:"enum",value:[{value:'"sm"'},{value:'"lg"'},{value:'"md"'}]}},options:{defaultValue:null,description:"Select options (alternative to children)",name:"options",required:!1,type:{name:"{ value: string; label: string; }[]"}}}}}catch{}try{r.displayName="FormGroup",r.__docgenInfo={description:"",displayName:"FormGroup",props:{label:{defaultValue:null,description:"Label text",name:"label",required:!1,type:{name:"string"}},required:{defaultValue:null,description:"Required field indicator",name:"required",required:!1,type:{name:"boolean"}},error:{defaultValue:null,description:"Error message",name:"error",required:!1,type:{name:"string"}},helpText:{defaultValue:null,description:"Help text",name:"helpText",required:!1,type:{name:"string"}}}}}catch{}const io={title:"Tier 2: Branded/Select",component:o,parameters:{layout:"centered",docs:{description:{component:"Native HTML select dropdown with Ozean Licht styling and custom arrow indicator."}}},tags:["autodocs"],argTypes:{selectSize:{control:"select",options:["sm","md","lg"],description:"Select size"},error:{control:"text",description:"Error message (or true for error state only)"},disabled:{control:"boolean",description:"Disable select"}},decorators:[n=>e.jsx("div",{className:"w-[400px]",children:e.jsx(n,{})})]},i={args:{children:e.jsxs(e.Fragment,{children:[e.jsx("option",{value:"",children:"Choose an option..."}),e.jsx("option",{value:"1",children:"Option 1"}),e.jsx("option",{value:"2",children:"Option 2"}),e.jsx("option",{value:"3",children:"Option 3"})]})}},l={args:{options:[{value:"",label:"Select a country..."},{value:"us",label:"United States"},{value:"uk",label:"United Kingdom"},{value:"ca",label:"Canada"},{value:"au",label:"Australia"},{value:"de",label:"Germany"}]}},s={render:()=>e.jsxs("div",{children:[e.jsx(Be,{htmlFor:"country",children:"Country"}),e.jsxs(o,{id:"country",children:[e.jsx("option",{value:"",children:"Select a country..."}),e.jsx("option",{value:"at",children:"Austria"}),e.jsx("option",{value:"de",children:"Germany"}),e.jsx("option",{value:"ch",children:"Switzerland"})]})]})},c={render:()=>e.jsxs("div",{children:[e.jsx(Be,{htmlFor:"role",required:!0,children:"Role"}),e.jsxs(o,{id:"role",children:[e.jsx("option",{value:"",children:"Select a role..."}),e.jsx("option",{value:"admin",children:"Administrator"}),e.jsx("option",{value:"editor",children:"Editor"}),e.jsx("option",{value:"viewer",children:"Viewer"})]})]})},p={args:{selectSize:"sm",options:[{value:"",label:"Small select"},{value:"1",label:"Option 1"},{value:"2",label:"Option 2"}]}},d={args:{selectSize:"lg",options:[{value:"",label:"Large select"},{value:"1",label:"Option 1"},{value:"2",label:"Option 2"}]}},u={args:{error:"Please select a valid option",children:e.jsxs(e.Fragment,{children:[e.jsx("option",{value:"",children:"Select an option..."}),e.jsx("option",{value:"1",children:"Option 1"}),e.jsx("option",{value:"2",children:"Option 2"})]})}},m={args:{disabled:!0,children:e.jsx(e.Fragment,{children:e.jsx("option",{value:"1",children:"Cannot change"})})}},h={args:{defaultValue:"2",children:e.jsxs(e.Fragment,{children:[e.jsx("option",{value:"",children:"Choose..."}),e.jsx("option",{value:"1",children:"Option 1"}),e.jsx("option",{value:"2",children:"Option 2 (default)"}),e.jsx("option",{value:"3",children:"Option 3"})]})}},v={render:()=>e.jsx(r,{label:"Preferred Language",required:!0,helpText:"Choose your preferred language for notifications",children:e.jsxs(o,{children:[e.jsx("option",{value:"",children:"Select a language..."}),e.jsx("option",{value:"en",children:"English"}),e.jsx("option",{value:"de",children:"German"}),e.jsx("option",{value:"fr",children:"French"}),e.jsx("option",{value:"es",children:"Spanish"})]})})},x={render:()=>e.jsx(r,{label:"Payment Method",required:!0,error:"Please select a payment method",children:e.jsxs(o,{error:!0,children:[e.jsx("option",{value:"",children:"Choose payment method..."}),e.jsx("option",{value:"card",children:"Credit Card"}),e.jsx("option",{value:"paypal",children:"PayPal"}),e.jsx("option",{value:"bank",children:"Bank Transfer"})]})})},g={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsx(r,{label:"Category",required:!0,children:e.jsxs(o,{children:[e.jsx("option",{value:"",children:"Select category..."}),e.jsx("option",{value:"tech",children:"Technology"}),e.jsx("option",{value:"design",children:"Design"}),e.jsx("option",{value:"business",children:"Business"})]})}),e.jsx(r,{label:"Status",required:!0,children:e.jsxs(o,{children:[e.jsx("option",{value:"",children:"Select status..."}),e.jsx("option",{value:"active",children:"Active"}),e.jsx("option",{value:"pending",children:"Pending"}),e.jsx("option",{value:"inactive",children:"Inactive"})]})}),e.jsx(r,{label:"Priority",children:e.jsxs(o,{children:[e.jsx("option",{value:"",children:"Select priority..."}),e.jsx("option",{value:"high",children:"High"}),e.jsx("option",{value:"medium",children:"Medium"}),e.jsx("option",{value:"low",children:"Low"})]})})]})},S={render:()=>e.jsxs("div",{className:"space-y-3",children:[e.jsx(o,{selectSize:"sm",children:e.jsx("option",{children:"Small"})}),e.jsx(o,{selectSize:"md",children:e.jsx("option",{children:"Medium (default)"})}),e.jsx(o,{selectSize:"lg",children:e.jsx("option",{children:"Large"})})]})},j={render:()=>e.jsx(r,{label:"Country / Region",required:!0,helpText:"Select your country or region",children:e.jsxs(o,{children:[e.jsx("option",{value:"",children:"Select a country..."}),e.jsxs("optgroup",{label:"Europe",children:[e.jsx("option",{value:"at",children:"Austria"}),e.jsx("option",{value:"de",children:"Germany"}),e.jsx("option",{value:"ch",children:"Switzerland"}),e.jsx("option",{value:"fr",children:"France"}),e.jsx("option",{value:"it",children:"Italy"})]}),e.jsxs("optgroup",{label:"North America",children:[e.jsx("option",{value:"us",children:"United States"}),e.jsx("option",{value:"ca",children:"Canada"}),e.jsx("option",{value:"mx",children:"Mexico"})]}),e.jsxs("optgroup",{label:"Asia",children:[e.jsx("option",{value:"jp",children:"Japan"}),e.jsx("option",{value:"cn",children:"China"}),e.jsx("option",{value:"in",children:"India"})]})]})})};var C,O,z,q,L;i.parameters={...i.parameters,docs:{...(C=i.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    children: <>
        <option value="">Choose an option...</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </>
  }
}`,...(z=(O=i.parameters)==null?void 0:O.docs)==null?void 0:z.source},description:{story:"Default select with children options",...(L=(q=i.parameters)==null?void 0:q.docs)==null?void 0:L.description}}};var N,A,_,P,E;l.parameters={...l.parameters,docs:{...(N=l.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    options: [{
      value: '',
      label: 'Select a country...'
    }, {
      value: 'us',
      label: 'United States'
    }, {
      value: 'uk',
      label: 'United Kingdom'
    }, {
      value: 'ca',
      label: 'Canada'
    }, {
      value: 'au',
      label: 'Australia'
    }, {
      value: 'de',
      label: 'Germany'
    }]
  }
}`,...(_=(A=l.parameters)==null?void 0:A.docs)==null?void 0:_.source},description:{story:"Select with options array",...(E=(P=l.parameters)==null?void 0:P.docs)==null?void 0:E.description}}};var T,V,M,W,k;s.parameters={...s.parameters,docs:{...(T=s.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => <div>
      <Label htmlFor="country">Country</Label>
      <Select id="country">
        <option value="">Select a country...</option>
        <option value="at">Austria</option>
        <option value="de">Germany</option>
        <option value="ch">Switzerland</option>
      </Select>
    </div>
}`,...(M=(V=s.parameters)==null?void 0:V.docs)==null?void 0:M.source},description:{story:"Select with label",...(k=(W=s.parameters)==null?void 0:W.docs)==null?void 0:k.description}}};var D,R,I,B,U;c.parameters={...c.parameters,docs:{...(D=c.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => <div>
      <Label htmlFor="role" required>
        Role
      </Label>
      <Select id="role">
        <option value="">Select a role...</option>
        <option value="admin">Administrator</option>
        <option value="editor">Editor</option>
        <option value="viewer">Viewer</option>
      </Select>
    </div>
}`,...(I=(R=c.parameters)==null?void 0:R.docs)==null?void 0:I.source},description:{story:"Required select with label",...(U=(B=c.parameters)==null?void 0:B.docs)==null?void 0:U.description}}};var H,J,K,Q,X;p.parameters={...p.parameters,docs:{...(H=p.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    selectSize: 'sm',
    options: [{
      value: '',
      label: 'Small select'
    }, {
      value: '1',
      label: 'Option 1'
    }, {
      value: '2',
      label: 'Option 2'
    }]
  }
}`,...(K=(J=p.parameters)==null?void 0:J.docs)==null?void 0:K.source},description:{story:"Small select size",...(X=(Q=p.parameters)==null?void 0:Q.docs)==null?void 0:X.description}}};var Y,Z,$,ee,oe;d.parameters={...d.parameters,docs:{...(Y=d.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    selectSize: 'lg',
    options: [{
      value: '',
      label: 'Large select'
    }, {
      value: '1',
      label: 'Option 1'
    }, {
      value: '2',
      label: 'Option 2'
    }]
  }
}`,...($=(Z=d.parameters)==null?void 0:Z.docs)==null?void 0:$.source},description:{story:"Large select size",...(oe=(ee=d.parameters)==null?void 0:ee.docs)==null?void 0:oe.description}}};var re,ne,te,ae,ie;u.parameters={...u.parameters,docs:{...(re=u.parameters)==null?void 0:re.docs,source:{originalSource:`{
  args: {
    error: 'Please select a valid option',
    children: <>
        <option value="">Select an option...</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </>
  }
}`,...(te=(ne=u.parameters)==null?void 0:ne.docs)==null?void 0:te.source},description:{story:"Select with error state",...(ie=(ae=u.parameters)==null?void 0:ae.docs)==null?void 0:ie.description}}};var le,se,ce,pe,de;m.parameters={...m.parameters,docs:{...(le=m.parameters)==null?void 0:le.docs,source:{originalSource:`{
  args: {
    disabled: true,
    children: <>
        <option value="1">Cannot change</option>
      </>
  }
}`,...(ce=(se=m.parameters)==null?void 0:se.docs)==null?void 0:ce.source},description:{story:"Disabled select",...(de=(pe=m.parameters)==null?void 0:pe.docs)==null?void 0:de.description}}};var ue,me,he,ve,xe;h.parameters={...h.parameters,docs:{...(ue=h.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  args: {
    defaultValue: '2',
    children: <>
        <option value="">Choose...</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2 (default)</option>
        <option value="3">Option 3</option>
      </>
  }
}`,...(he=(me=h.parameters)==null?void 0:me.docs)==null?void 0:he.source},description:{story:"Select with default value",...(xe=(ve=h.parameters)==null?void 0:ve.docs)==null?void 0:xe.description}}};var ge,Se,je,ye,be;v.parameters={...v.parameters,docs:{...(ge=v.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  render: () => <FormGroup label="Preferred Language" required helpText="Choose your preferred language for notifications">
      <Select>
        <option value="">Select a language...</option>
        <option value="en">English</option>
        <option value="de">German</option>
        <option value="fr">French</option>
        <option value="es">Spanish</option>
      </Select>
    </FormGroup>
}`,...(je=(Se=v.parameters)==null?void 0:Se.docs)==null?void 0:je.source},description:{story:"FormGroup with select",...(be=(ye=v.parameters)==null?void 0:ye.docs)==null?void 0:be.description}}};var fe,Fe,we,Ge,Ce;x.parameters={...x.parameters,docs:{...(fe=x.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  render: () => <FormGroup label="Payment Method" required error="Please select a payment method">
      <Select error>
        <option value="">Choose payment method...</option>
        <option value="card">Credit Card</option>
        <option value="paypal">PayPal</option>
        <option value="bank">Bank Transfer</option>
      </Select>
    </FormGroup>
}`,...(we=(Fe=x.parameters)==null?void 0:Fe.docs)==null?void 0:we.source},description:{story:"FormGroup with error",...(Ce=(Ge=x.parameters)==null?void 0:Ge.docs)==null?void 0:Ce.description}}};var Oe,ze,qe,Le,Ne;g.parameters={...g.parameters,docs:{...(Oe=g.parameters)==null?void 0:Oe.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <FormGroup label="Category" required>
        <Select>
          <option value="">Select category...</option>
          <option value="tech">Technology</option>
          <option value="design">Design</option>
          <option value="business">Business</option>
        </Select>
      </FormGroup>

      <FormGroup label="Status" required>
        <Select>
          <option value="">Select status...</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
        </Select>
      </FormGroup>

      <FormGroup label="Priority">
        <Select>
          <option value="">Select priority...</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>
      </FormGroup>
    </div>
}`,...(qe=(ze=g.parameters)==null?void 0:ze.docs)==null?void 0:qe.source},description:{story:"Multiple selects in a form",...(Ne=(Le=g.parameters)==null?void 0:Le.docs)==null?void 0:Ne.description}}};var Ae,_e,Pe,Ee,Te;S.parameters={...S.parameters,docs:{...(Ae=S.parameters)==null?void 0:Ae.docs,source:{originalSource:`{
  render: () => <div className="space-y-3">
      <Select selectSize="sm">
        <option>Small</option>
      </Select>
      <Select selectSize="md">
        <option>Medium (default)</option>
      </Select>
      <Select selectSize="lg">
        <option>Large</option>
      </Select>
    </div>
}`,...(Pe=(_e=S.parameters)==null?void 0:_e.docs)==null?void 0:Pe.source},description:{story:"All select sizes",...(Te=(Ee=S.parameters)==null?void 0:Ee.docs)==null?void 0:Te.description}}};var Ve,Me,We,ke,De;j.parameters={...j.parameters,docs:{...(Ve=j.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
  render: () => <FormGroup label="Country / Region" required helpText="Select your country or region">
      <Select>
        <option value="">Select a country...</option>
        <optgroup label="Europe">
          <option value="at">Austria</option>
          <option value="de">Germany</option>
          <option value="ch">Switzerland</option>
          <option value="fr">France</option>
          <option value="it">Italy</option>
        </optgroup>
        <optgroup label="North America">
          <option value="us">United States</option>
          <option value="ca">Canada</option>
          <option value="mx">Mexico</option>
        </optgroup>
        <optgroup label="Asia">
          <option value="jp">Japan</option>
          <option value="cn">China</option>
          <option value="in">India</option>
        </optgroup>
      </Select>
    </FormGroup>
}`,...(We=(Me=j.parameters)==null?void 0:Me.docs)==null?void 0:We.source},description:{story:"Country selector example",...(De=(ke=j.parameters)==null?void 0:ke.docs)==null?void 0:De.description}}};const lo=["Default","WithOptionsArray","WithLabel","Required","Small","Large","WithError","Disabled","WithDefaultValue","WithFormGroup","FormGroupWithError","MultipleSelects","AllSizes","CountrySelector"];export{S as AllSizes,j as CountrySelector,i as Default,m as Disabled,x as FormGroupWithError,d as Large,g as MultipleSelects,c as Required,p as Small,h as WithDefaultValue,u as WithError,v as WithFormGroup,s as WithLabel,l as WithOptionsArray,lo as __namedExportsOrder,io as default};
