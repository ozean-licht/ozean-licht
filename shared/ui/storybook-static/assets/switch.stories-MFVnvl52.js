import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{f as Xe}from"./index-CJu6nLMj.js";import{r as c}from"./index-B2-qRKKC.js";import{c as $e,P as Be,a as Je}from"./index-BiUY2kQP.js";import{u as Me}from"./index-BFjtS4uE.js";import{u as Ke}from"./index-BlCrtW8-.js";import{u as Qe}from"./index-_AbP6Uzr.js";import{u as Ye}from"./index-BYfY0yFj.js";import{c as A}from"./cn-CKXzwFwe.js";import{L as i}from"./label-BZCfx7Ud.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-kS-9iBlu.js";import"./index-D1vk04JX.js";import"./clsx-B-dksMZM.js";import"./index-B5oyz0SX.js";import"./index-BiMR7eR1.js";import"./index-Dp3B9jqt.js";var P="Switch",[Ze]=$e(P),[es,ss]=Ze(P),Ue=c.forwardRef((t,r)=>{const{__scopeSwitch:a,name:d,checked:n,defaultChecked:F,required:m,disabled:o,value:p="on",onCheckedChange:D,form:l,...R}=t,[k,S]=c.useState(null),_=Me(r,L=>S(L)),E=c.useRef(!1),T=k?l||!!k.closest("form"):!0,[C,He]=Ke({prop:n,defaultProp:F??!1,onChange:D,caller:P});return e.jsxs(es,{scope:a,checked:C,disabled:o,children:[e.jsx(Be.button,{type:"button",role:"switch","aria-checked":C,"aria-required":m,"data-state":We(C),"data-disabled":o?"":void 0,disabled:o,value:p,...R,ref:_,onClick:Je(t.onClick,L=>{He(Ve=>!Ve),T&&(E.current=L.isPropagationStopped(),E.current||L.stopPropagation())})}),T&&e.jsx(ze,{control:k,bubbles:!E.current,name:d,value:p,checked:C,required:m,disabled:o,form:l,style:{transform:"translateX(-100%)"}})]})});Ue.displayName=P;var Oe="SwitchThumb",qe=c.forwardRef((t,r)=>{const{__scopeSwitch:a,...d}=t,n=ss(Oe,a);return e.jsx(Be.span,{"data-state":We(n.checked),"data-disabled":n.disabled?"":void 0,...d,ref:r})});qe.displayName=Oe;var ts="SwitchBubbleInput",ze=c.forwardRef(({__scopeSwitch:t,control:r,checked:a,bubbles:d=!0,...n},F)=>{const m=c.useRef(null),o=Me(m,F),p=Qe(a),D=Ye(r);return c.useEffect(()=>{const l=m.current;if(!l)return;const R=window.HTMLInputElement.prototype,S=Object.getOwnPropertyDescriptor(R,"checked").set;if(p!==a&&S){const _=new Event("click",{bubbles:d});S.call(l,a),l.dispatchEvent(_)}},[p,a,d]),e.jsx("input",{type:"checkbox","aria-hidden":!0,defaultChecked:a,...n,tabIndex:-1,ref:o,style:{...n.style,...D,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})});ze.displayName=ts;function We(t){return t?"checked":"unchecked"}var Ge=Ue,as=qe;const s=c.forwardRef(({className:t,...r},a)=>e.jsx(Ge,{className:A("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",t),...r,ref:a,children:e.jsx(as,{className:A("pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0")})}));s.displayName=Ge.displayName;try{s.displayName="Switch",s.__docgenInfo={description:"",displayName:"Switch",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}const gs={title:"Tier 1: Primitives/shadcn/Switch",component:s,parameters:{layout:"centered",docs:{description:{component:"A control that allows the user to toggle between on and off states. Use switches for settings that take effect immediately."}}},tags:["autodocs"],argTypes:{checked:{control:"boolean",description:"Checked state of switch"},disabled:{control:"boolean",description:"Disable switch interaction"},onCheckedChange:{description:"Callback when checked state changes"}},args:{onCheckedChange:Xe()}},u={args:{checked:!1}},h={args:{checked:!0}},x={args:{disabled:!0,checked:!1}},f={args:{disabled:!0,checked:!0}},v={render:()=>e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{id:"airplane-mode"}),e.jsx(i,{htmlFor:"airplane-mode",className:"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",children:"Airplane mode"})]})},b={render:()=>e.jsxs("div",{className:"flex items-start space-x-3",children:[e.jsx(s,{id:"notifications",className:"mt-1"}),e.jsxs("div",{className:"grid gap-1.5 leading-none",children:[e.jsx(i,{htmlFor:"notifications",className:"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",children:"Push notifications"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Receive push notifications for important updates and messages."})]})]})},N={render:()=>{const[t,r]=c.useState(!1);return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{id:"controlled-switch",checked:t,onCheckedChange:r}),e.jsx(i,{htmlFor:"controlled-switch",children:"Toggle me"})]}),e.jsxs("p",{className:"text-sm text-muted-foreground",children:["Current state: ",e.jsx("strong",{children:t?"On":"Off"})]})]})}},w={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between space-x-2",children:[e.jsxs("div",{className:"space-y-0.5",children:[e.jsx(i,{htmlFor:"marketing-emails",children:"Marketing emails"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Receive emails about new products and features"})]}),e.jsx(s,{id:"marketing-emails"})]}),e.jsxs("div",{className:"flex items-center justify-between space-x-2",children:[e.jsxs("div",{className:"space-y-0.5",children:[e.jsx(i,{htmlFor:"security-emails",children:"Security emails"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Receive emails about your account security"})]}),e.jsx(s,{id:"security-emails",defaultChecked:!0})]}),e.jsxs("div",{className:"flex items-center justify-between space-x-2",children:[e.jsxs("div",{className:"space-y-0.5",children:[e.jsx(i,{htmlFor:"beta-features",children:"Beta features"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Try out new features before they launch"})]}),e.jsx(s,{id:"beta-features"})]}),e.jsxs("div",{className:"flex items-center justify-between space-x-2",children:[e.jsxs("div",{className:"space-y-0.5",children:[e.jsx(i,{htmlFor:"premium-feature",className:"text-muted-foreground",children:"Premium feature"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Available with Pro plan (coming soon)"})]}),e.jsx(s,{id:"premium-feature",disabled:!0})]})]})},g={render:()=>e.jsxs("div",{className:"w-[400px] space-y-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-medium mb-4",children:"Privacy Settings"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"space-y-0.5",children:[e.jsx(i,{htmlFor:"profile-visible",children:"Public profile"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Make your profile visible to everyone"})]}),e.jsx(s,{id:"profile-visible",defaultChecked:!0})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"space-y-0.5",children:[e.jsx(i,{htmlFor:"show-email",children:"Show email"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Display email on your profile"})]}),e.jsx(s,{id:"show-email"})]})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-medium mb-4",children:"Notifications"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"space-y-0.5",children:[e.jsx(i,{htmlFor:"email-notifs",children:"Email notifications"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Get notified via email"})]}),e.jsx(s,{id:"email-notifs",defaultChecked:!0})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"space-y-0.5",children:[e.jsx(i,{htmlFor:"push-notifs",children:"Push notifications"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Get browser push notifications"})]}),e.jsx(s,{id:"push-notifs",defaultChecked:!0})]})]})]})]})},j={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{checked:!1}),e.jsx("span",{className:"text-sm",children:"Unchecked"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{checked:!0}),e.jsx("span",{className:"text-sm",children:"Checked (Turquoise #0ec2bc)"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{disabled:!0,checked:!1}),e.jsx("span",{className:"text-sm text-muted-foreground",children:"Disabled Unchecked"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{disabled:!0,checked:!0}),e.jsx("span",{className:"text-sm text-muted-foreground",children:"Disabled Checked"})]})]})},y={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{className:"h-4 w-8 [&>span]:h-3 [&>span]:w-3 [&>span]:data-[state=checked]:translate-x-4"}),e.jsx("span",{className:"text-sm",children:"Small switch"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{}),e.jsx("span",{className:"text-sm",children:"Default switch"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{className:"h-8 w-14 [&>span]:h-7 [&>span]:w-7 [&>span]:data-[state=checked]:translate-x-6"}),e.jsx("span",{className:"text-sm",children:"Large switch"})]})]})};var I,B,M,U,O;u.parameters={...u.parameters,docs:{...(I=u.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    checked: false
  }
}`,...(M=(B=u.parameters)==null?void 0:B.docs)==null?void 0:M.source},description:{story:"Default unchecked switch",...(O=(U=u.parameters)==null?void 0:U.docs)==null?void 0:O.description}}};var q,z,W,G,H;h.parameters={...h.parameters,docs:{...(q=h.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    checked: true
  }
}`,...(W=(z=h.parameters)==null?void 0:z.docs)==null?void 0:W.source},description:{story:"Checked switch with turquoise accent color (#0ec2bc)",...(H=(G=h.parameters)==null?void 0:G.docs)==null?void 0:H.description}}};var V,X,$,J,K;x.parameters={...x.parameters,docs:{...(V=x.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    disabled: true,
    checked: false
  }
}`,...($=(X=x.parameters)==null?void 0:X.docs)==null?void 0:$.source},description:{story:"Disabled switch (unchecked)",...(K=(J=x.parameters)==null?void 0:J.docs)==null?void 0:K.description}}};var Q,Y,Z,ee,se;f.parameters={...f.parameters,docs:{...(Q=f.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    disabled: true,
    checked: true
  }
}`,...(Z=(Y=f.parameters)==null?void 0:Y.docs)==null?void 0:Z.source},description:{story:"Disabled switch (checked)",...(se=(ee=f.parameters)==null?void 0:ee.docs)==null?void 0:se.description}}};var te,ae,ie,re,ce;v.parameters={...v.parameters,docs:{...(te=v.parameters)==null?void 0:te.docs,source:{originalSource:`{
  render: () => <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Airplane mode
      </Label>
    </div>
}`,...(ie=(ae=v.parameters)==null?void 0:ae.docs)==null?void 0:ie.source},description:{story:"Switch with label",...(ce=(re=v.parameters)==null?void 0:re.docs)==null?void 0:ce.description}}};var ne,de,oe,le,me;b.parameters={...b.parameters,docs:{...(ne=b.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: () => <div className="flex items-start space-x-3">
      <Switch id="notifications" className="mt-1" />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor="notifications" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Push notifications
        </Label>
        <p className="text-sm text-muted-foreground">
          Receive push notifications for important updates and messages.
        </p>
      </div>
    </div>
}`,...(oe=(de=b.parameters)==null?void 0:de.docs)==null?void 0:oe.source},description:{story:"Switch with description",...(me=(le=b.parameters)==null?void 0:le.docs)==null?void 0:me.description}}};var pe,ue,he,xe,fe;N.parameters={...N.parameters,docs:{...(pe=N.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  render: () => {
    const [isChecked, setIsChecked] = React.useState(false);
    return <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch id="controlled-switch" checked={isChecked} onCheckedChange={setIsChecked} />
          <Label htmlFor="controlled-switch">
            Toggle me
          </Label>
        </div>
        <p className="text-sm text-muted-foreground">
          Current state: <strong>{isChecked ? 'On' : 'Off'}</strong>
        </p>
      </div>;
  }
}`,...(he=(ue=N.parameters)==null?void 0:ue.docs)==null?void 0:he.source},description:{story:"Controlled switch with React state",...(fe=(xe=N.parameters)==null?void 0:xe.docs)==null?void 0:fe.description}}};var ve,be,Ne,we,ge;w.parameters={...w.parameters,docs:{...(ve=w.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <div className="flex items-center justify-between space-x-2">
        <div className="space-y-0.5">
          <Label htmlFor="marketing-emails">Marketing emails</Label>
          <p className="text-sm text-muted-foreground">
            Receive emails about new products and features
          </p>
        </div>
        <Switch id="marketing-emails" />
      </div>

      <div className="flex items-center justify-between space-x-2">
        <div className="space-y-0.5">
          <Label htmlFor="security-emails">Security emails</Label>
          <p className="text-sm text-muted-foreground">
            Receive emails about your account security
          </p>
        </div>
        <Switch id="security-emails" defaultChecked />
      </div>

      <div className="flex items-center justify-between space-x-2">
        <div className="space-y-0.5">
          <Label htmlFor="beta-features">Beta features</Label>
          <p className="text-sm text-muted-foreground">
            Try out new features before they launch
          </p>
        </div>
        <Switch id="beta-features" />
      </div>

      <div className="flex items-center justify-between space-x-2">
        <div className="space-y-0.5">
          <Label htmlFor="premium-feature" className="text-muted-foreground">
            Premium feature
          </Label>
          <p className="text-sm text-muted-foreground">
            Available with Pro plan (coming soon)
          </p>
        </div>
        <Switch id="premium-feature" disabled />
      </div>
    </div>
}`,...(Ne=(be=w.parameters)==null?void 0:be.docs)==null?void 0:Ne.source},description:{story:"Form example with multiple switches",...(ge=(we=w.parameters)==null?void 0:we.docs)==null?void 0:ge.description}}};var je,ye,ke,Se,Ce;g.parameters={...g.parameters,docs:{...(je=g.parameters)==null?void 0:je.docs,source:{originalSource:`{
  render: () => <div className="w-[400px] space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="profile-visible">Public profile</Label>
              <p className="text-sm text-muted-foreground">
                Make your profile visible to everyone
              </p>
            </div>
            <Switch id="profile-visible" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-email">Show email</Label>
              <p className="text-sm text-muted-foreground">
                Display email on your profile
              </p>
            </div>
            <Switch id="show-email" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifs">Email notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified via email
              </p>
            </div>
            <Switch id="email-notifs" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifs">Push notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get browser push notifications
              </p>
            </div>
            <Switch id="push-notifs" defaultChecked />
          </div>
        </div>
      </div>
    </div>
}`,...(ke=(ye=g.parameters)==null?void 0:ye.docs)==null?void 0:ke.source},description:{story:"Settings panel example",...(Ce=(Se=g.parameters)==null?void 0:Se.docs)==null?void 0:Ce.description}}};var Le,Pe,Fe,De,Re;j.parameters={...j.parameters,docs:{...(Le=j.parameters)==null?void 0:Le.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch checked={false} />
        <span className="text-sm">Unchecked</span>
      </div>
      <div className="flex items-center space-x-2">
        <Switch checked={true} />
        <span className="text-sm">Checked (Turquoise #0ec2bc)</span>
      </div>
      <div className="flex items-center space-x-2">
        <Switch disabled checked={false} />
        <span className="text-sm text-muted-foreground">Disabled Unchecked</span>
      </div>
      <div className="flex items-center space-x-2">
        <Switch disabled checked={true} />
        <span className="text-sm text-muted-foreground">Disabled Checked</span>
      </div>
    </div>
}`,...(Fe=(Pe=j.parameters)==null?void 0:Pe.docs)==null?void 0:Fe.source},description:{story:"All states showcase",...(Re=(De=j.parameters)==null?void 0:De.docs)==null?void 0:Re.description}}};var _e,Ee,Te,Ae,Ie;y.parameters={...y.parameters,docs:{...(_e=y.parameters)==null?void 0:_e.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch className="h-4 w-8 [&>span]:h-3 [&>span]:w-3 [&>span]:data-[state=checked]:translate-x-4" />
        <span className="text-sm">Small switch</span>
      </div>
      <div className="flex items-center space-x-2">
        <Switch />
        <span className="text-sm">Default switch</span>
      </div>
      <div className="flex items-center space-x-2">
        <Switch className="h-8 w-14 [&>span]:h-7 [&>span]:w-7 [&>span]:data-[state=checked]:translate-x-6" />
        <span className="text-sm">Large switch</span>
      </div>
    </div>
}`,...(Te=(Ee=y.parameters)==null?void 0:Ee.docs)==null?void 0:Te.source},description:{story:"Size variations (custom styling)",...(Ie=(Ae=y.parameters)==null?void 0:Ae.docs)==null?void 0:Ie.description}}};const js=["Default","Checked","Disabled","DisabledChecked","WithLabel","WithDescription","Controlled","FormExample","SettingsPanel","AllStates","CustomSizes"];export{j as AllStates,h as Checked,N as Controlled,y as CustomSizes,u as Default,x as Disabled,f as DisabledChecked,w as FormExample,g as SettingsPanel,b as WithDescription,v as WithLabel,js as __namedExportsOrder,gs as default};
