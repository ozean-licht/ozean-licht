import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{w as Ae,e as v,u as S}from"./index-CJu6nLMj.js";import{r as u}from"./index-B2-qRKKC.js";import{c as De,P as V,a as H}from"./index-D5ysUGwq.js";import{c as be,R as Be,I as Ve}from"./index-DGkrtcXD.js";import{P as Pe}from"./index-PNzqWif7.js";import{u as Se}from"./index-D6fdIYSQ.js";import{u as He}from"./index-BlCrtW8-.js";import{u as Me}from"./index-CpxwHbl5.js";import{c as M}from"./cn-CytzSlOG.js";import{C as _,b as I,c as A,d as D,a as B}from"./card-DMcvVywK.js";import{B as E}from"./button-DP4L7qO7.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-kS-9iBlu.js";import"./index-BFjtS4uE.js";import"./index-BDyC_JNs.js";import"./index-ciuW_uyV.js";import"./index-D1vk04JX.js";import"./index-BiMR7eR1.js";import"./index-DVF2XGCm.js";var P="Tabs",[ke]=De(P,[be]),ge=be(),[Ee,k]=ke(P),ve=u.forwardRef((t,a)=>{const{__scopeTabs:o,value:s,onValueChange:l,defaultValue:m,orientation:i="horizontal",dir:g,activationMode:f="automatic",...h}=t,c=Se(g),[d,T]=He({prop:s,onChange:l,defaultProp:m??"",caller:P});return e.jsx(Ee,{scope:o,baseId:Me(),value:d,onValueChange:T,orientation:i,dir:c,activationMode:f,children:e.jsx(V.div,{dir:c,"data-orientation":i,...h,ref:a})})});ve.displayName=P;var Te="TabsList",fe=u.forwardRef((t,a)=>{const{__scopeTabs:o,loop:s=!0,...l}=t,m=k(Te,o),i=ge(o);return e.jsx(Be,{asChild:!0,...i,orientation:m.orientation,dir:m.dir,loop:s,children:e.jsx(V.div,{role:"tablist","aria-orientation":m.orientation,...l,ref:a})})});fe.displayName=Te;var he="TabsTrigger",xe=u.forwardRef((t,a)=>{const{__scopeTabs:o,value:s,disabled:l=!1,...m}=t,i=k(he,o),g=ge(o),f=je(i.baseId,s),h=Ne(i.baseId,s),c=s===i.value;return e.jsx(Ve,{asChild:!0,...g,focusable:!l,active:c,children:e.jsx(V.button,{type:"button",role:"tab","aria-selected":c,"aria-controls":h,"data-state":c?"active":"inactive","data-disabled":l?"":void 0,disabled:l,id:f,...m,ref:a,onMouseDown:H(t.onMouseDown,d=>{!l&&d.button===0&&d.ctrlKey===!1?i.onValueChange(s):d.preventDefault()}),onKeyDown:H(t.onKeyDown,d=>{[" ","Enter"].includes(d.key)&&i.onValueChange(s)}),onFocus:H(t.onFocus,()=>{const d=i.activationMode!=="manual";!c&&!l&&d&&i.onValueChange(s)})})})});xe.displayName=he;var ye="TabsContent",Ce=u.forwardRef((t,a)=>{const{__scopeTabs:o,value:s,forceMount:l,children:m,...i}=t,g=k(ye,o),f=je(g.baseId,s),h=Ne(g.baseId,s),c=s===g.value,d=u.useRef(c);return u.useEffect(()=>{const T=requestAnimationFrame(()=>d.current=!1);return()=>cancelAnimationFrame(T)},[]),e.jsx(Pe,{present:l||c,children:({present:T})=>e.jsx(V.div,{"data-state":c?"active":"inactive","data-orientation":g.orientation,role:"tabpanel","aria-labelledby":f,hidden:!T,id:h,tabIndex:0,...i,ref:a,style:{...t.style,animationDuration:d.current?"0s":void 0},children:T&&m})})});Ce.displayName=ye;function je(t,a){return`${t}-trigger-${a}`}function Ne(t,a){return`${t}-content-${a}`}var Le=ve,we=fe,_e=xe,Ie=Ce;const p=Le,b=u.forwardRef(({className:t,...a},o)=>e.jsx(we,{ref:o,className:M("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",t),...a}));b.displayName=we.displayName;const n=u.forwardRef(({className:t,...a},o)=>e.jsx(_e,{ref:o,className:M("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",t),...a}));n.displayName=_e.displayName;const r=u.forwardRef(({className:t,...a},o)=>e.jsx(Ie,{ref:o,className:M("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",t),...a}));r.displayName=Ie.displayName;try{p.displayName="Tabs",p.__docgenInfo={description:"",displayName:"Tabs",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{b.displayName="TabsList",b.__docgenInfo={description:"",displayName:"TabsList",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{n.displayName="TabsTrigger",n.__docgenInfo={description:"",displayName:"TabsTrigger",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{r.displayName="TabsContent",r.__docgenInfo={description:"",displayName:"TabsContent",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}const ra={title:"Tier 1: Primitives/shadcn/Tabs",component:p,parameters:{layout:"centered",docs:{description:{component:"A set of layered sections of content, known as tab panels, that display one panel at a time."}}},tags:["autodocs"],argTypes:{defaultValue:{control:"text",description:"Default active tab"},orientation:{control:"radio",options:["horizontal","vertical"],description:"Tab list orientation"}},decorators:[t=>e.jsx("div",{className:"w-[600px]",children:e.jsx(t,{})})]},x={render:()=>e.jsxs(p,{defaultValue:"account",className:"w-full",children:[e.jsxs(b,{children:[e.jsx(n,{value:"account",children:"Account"}),e.jsx(n,{value:"password",children:"Password"}),e.jsx(n,{value:"settings",children:"Settings"})]}),e.jsx(r,{value:"account",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"Make changes to your account here. Click save when you're done."})}),e.jsx(r,{value:"password",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"Change your password here. After saving, you'll be logged out."})}),e.jsx(r,{value:"settings",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"Manage your account settings and preferences."})})]})},y={render:()=>e.jsxs(p,{defaultValue:"overview",className:"w-full",children:[e.jsxs(b,{className:"grid w-full grid-cols-2",children:[e.jsx(n,{value:"overview",children:"Overview"}),e.jsx(n,{value:"analytics",children:"Analytics"})]}),e.jsx(r,{value:"overview",children:e.jsxs(_,{children:[e.jsxs(I,{children:[e.jsx(A,{children:"Overview"}),e.jsx(D,{children:"View your account overview and recent activity."})]}),e.jsxs(B,{className:"space-y-2",children:[e.jsxs("div",{className:"text-sm",children:[e.jsx("span",{className:"font-medium",children:"Total Users:"})," 12,543"]}),e.jsxs("div",{className:"text-sm",children:[e.jsx("span",{className:"font-medium",children:"Active Sessions:"})," 89"]}),e.jsxs("div",{className:"text-sm",children:[e.jsx("span",{className:"font-medium",children:"Revenue:"})," $42,150"]})]})]})}),e.jsx(r,{value:"analytics",children:e.jsxs(_,{children:[e.jsxs(I,{children:[e.jsx(A,{children:"Analytics"}),e.jsx(D,{children:"Detailed analytics and insights for your account."})]}),e.jsx(B,{children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"Analytics dashboard coming soon..."})})]})})]})},C={render:()=>e.jsxs(p,{defaultValue:"available",className:"w-full",children:[e.jsxs(b,{children:[e.jsx(n,{value:"available",children:"Available"}),e.jsx(n,{value:"coming-soon",disabled:!0,children:"Coming Soon"}),e.jsx(n,{value:"deprecated",disabled:!0,children:"Deprecated"})]}),e.jsx(r,{value:"available",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"This feature is currently available."})}),e.jsx(r,{value:"coming-soon",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"This feature is coming soon."})}),e.jsx(r,{value:"deprecated",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"This feature has been deprecated."})})]})},j={render:()=>e.jsxs(p,{defaultValue:"personal",className:"w-full",children:[e.jsxs(b,{className:"grid w-full grid-cols-3",children:[e.jsx(n,{value:"personal",children:"Personal"}),e.jsx(n,{value:"company",children:"Company"}),e.jsx(n,{value:"billing",children:"Billing"})]}),e.jsx(r,{value:"personal",children:e.jsxs(_,{children:[e.jsxs(I,{children:[e.jsx(A,{children:"Personal Information"}),e.jsx(D,{children:"Update your personal details here."})]}),e.jsxs(B,{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-sm font-medium",children:"Full Name"}),e.jsx("input",{type:"text",className:"w-full rounded-md border px-3 py-2 text-sm",placeholder:"John Doe"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-sm font-medium",children:"Email"}),e.jsx("input",{type:"email",className:"w-full rounded-md border px-3 py-2 text-sm",placeholder:"john@example.com"})]}),e.jsx(E,{children:"Save Changes"})]})]})}),e.jsx(r,{value:"company",children:e.jsxs(_,{children:[e.jsxs(I,{children:[e.jsx(A,{children:"Company Information"}),e.jsx(D,{children:"Manage your company profile."})]}),e.jsxs(B,{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-sm font-medium",children:"Company Name"}),e.jsx("input",{type:"text",className:"w-full rounded-md border px-3 py-2 text-sm",placeholder:"Acme Corp"})]}),e.jsx(E,{children:"Save Changes"})]})]})}),e.jsx(r,{value:"billing",children:e.jsxs(_,{children:[e.jsxs(I,{children:[e.jsx(A,{children:"Billing Information"}),e.jsx(D,{children:"Update your billing details and payment method."})]}),e.jsx(B,{children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"No billing information on file."})})]})})]})},N={render:()=>e.jsxs(p,{defaultValue:"tab1",className:"w-full",children:[e.jsx(b,{children:Array.from({length:8},(t,a)=>e.jsxs(n,{value:`tab${a+1}`,children:["Tab ",a+1]},a))}),Array.from({length:8},(t,a)=>e.jsx(r,{value:`tab${a+1}`,children:e.jsxs("p",{className:"text-sm text-muted-foreground",children:["Content for tab ",a+1]})},a))]})},w={render:()=>e.jsxs(p,{defaultValue:"home",className:"w-full",children:[e.jsxs(b,{"data-testid":"tabs-list",children:[e.jsx(n,{value:"home","data-testid":"tab-home",children:"Home"}),e.jsx(n,{value:"profile","data-testid":"tab-profile",children:"Profile"}),e.jsx(n,{value:"messages","data-testid":"tab-messages",children:"Messages"})]}),e.jsx(r,{value:"home","data-testid":"content-home",children:e.jsx("p",{children:"Home content"})}),e.jsx(r,{value:"profile","data-testid":"content-profile",children:e.jsx("p",{children:"Profile content"})}),e.jsx(r,{value:"messages","data-testid":"content-messages",children:e.jsx("p",{children:"Messages content"})})]}),play:async({canvasElement:t})=>{const a=Ae(t),o=a.getByTestId("tab-home"),s=a.getByTestId("tab-profile");await v(o).toHaveAttribute("data-state","active"),await v(a.getByTestId("content-home")).toBeInTheDocument(),await S.click(s),await v(s).toHaveAttribute("data-state","active"),await v(a.getByTestId("content-profile")).toBeInTheDocument(),await S.keyboard("{ArrowRight}");const l=a.getByTestId("tab-messages");await v(l).toHaveAttribute("data-state","active"),await v(a.getByTestId("content-messages")).toBeInTheDocument(),await S.keyboard("{ArrowLeft}"),await v(s).toHaveAttribute("data-state","active")}};var L,R,$,F,G;x.parameters={...x.parameters,docs:{...(L=x.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="account" className="w-full">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-sm text-muted-foreground">
          Make changes to your account here. Click save when you're done.
        </p>
      </TabsContent>
      <TabsContent value="password">
        <p className="text-sm text-muted-foreground">
          Change your password here. After saving, you'll be logged out.
        </p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </TabsContent>
    </Tabs>
}`,...($=(R=x.parameters)==null?void 0:R.docs)==null?void 0:$.source},description:{story:"Default tabs with three panels",...(G=(F=x.parameters)==null?void 0:F.docs)==null?void 0:G.description}}};var O,U,q,W,K;y.parameters={...y.parameters,docs:{...(O=y.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              View your account overview and recent activity.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Total Users:</span> 12,543
            </div>
            <div className="text-sm">
              <span className="font-medium">Active Sessions:</span> 89
            </div>
            <div className="text-sm">
              <span className="font-medium">Revenue:</span> $42,150
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="analytics">
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>
              Detailed analytics and insights for your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Analytics dashboard coming soon...
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
}`,...(q=(U=y.parameters)==null?void 0:U.docs)==null?void 0:q.source},description:{story:"Tabs with card content",...(K=(W=y.parameters)==null?void 0:W.docs)==null?void 0:K.description}}};var z,J,Q,X,Y;C.parameters={...C.parameters,docs:{...(z=C.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="available" className="w-full">
      <TabsList>
        <TabsTrigger value="available">Available</TabsTrigger>
        <TabsTrigger value="coming-soon" disabled>
          Coming Soon
        </TabsTrigger>
        <TabsTrigger value="deprecated" disabled>
          Deprecated
        </TabsTrigger>
      </TabsList>
      <TabsContent value="available">
        <p className="text-sm text-muted-foreground">
          This feature is currently available.
        </p>
      </TabsContent>
      <TabsContent value="coming-soon">
        <p className="text-sm text-muted-foreground">
          This feature is coming soon.
        </p>
      </TabsContent>
      <TabsContent value="deprecated">
        <p className="text-sm text-muted-foreground">
          This feature has been deprecated.
        </p>
      </TabsContent>
    </Tabs>
}`,...(Q=(J=C.parameters)==null?void 0:J.docs)==null?void 0:Q.source},description:{story:"Tabs with disabled tab",...(Y=(X=C.parameters)==null?void 0:X.docs)==null?void 0:Y.description}}};var Z,ee,ae,te,se;j.parameters={...j.parameters,docs:{...(Z=j.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="company">Company</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="personal">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <input type="text" className="w-full rounded-md border px-3 py-2 text-sm" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input type="email" className="w-full rounded-md border px-3 py-2 text-sm" placeholder="john@example.com" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="company">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>
              Manage your company profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <input type="text" className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Acme Corp" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="billing">
        <Card>
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
            <CardDescription>
              Update your billing details and payment method.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No billing information on file.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
}`,...(ae=(ee=j.parameters)==null?void 0:ee.docs)==null?void 0:ae.source},description:{story:"Interactive form example with tabs",...(se=(te=j.parameters)==null?void 0:te.docs)==null?void 0:se.description}}};var ne,re,oe,ie,le;N.parameters={...N.parameters,docs:{...(ne=N.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="tab1" className="w-full">
      <TabsList>
        {Array.from({
        length: 8
      }, (_, i) => <TabsTrigger key={i} value={\`tab\${i + 1}\`}>
            Tab {i + 1}
          </TabsTrigger>)}
      </TabsList>
      {Array.from({
      length: 8
    }, (_, i) => <TabsContent key={i} value={\`tab\${i + 1}\`}>
          <p className="text-sm text-muted-foreground">
            Content for tab {i + 1}
          </p>
        </TabsContent>)}
    </Tabs>
}`,...(oe=(re=N.parameters)==null?void 0:re.docs)==null?void 0:oe.source},description:{story:"Many tabs example",...(le=(ie=N.parameters)==null?void 0:ie.docs)==null?void 0:le.description}}};var de,ce,me,ue,pe;w.parameters={...w.parameters,docs:{...(de=w.parameters)==null?void 0:de.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="home" className="w-full">
      <TabsList data-testid="tabs-list">
        <TabsTrigger value="home" data-testid="tab-home">
          Home
        </TabsTrigger>
        <TabsTrigger value="profile" data-testid="tab-profile">
          Profile
        </TabsTrigger>
        <TabsTrigger value="messages" data-testid="tab-messages">
          Messages
        </TabsTrigger>
      </TabsList>
      <TabsContent value="home" data-testid="content-home">
        <p>Home content</p>
      </TabsContent>
      <TabsContent value="profile" data-testid="content-profile">
        <p>Profile content</p>
      </TabsContent>
      <TabsContent value="messages" data-testid="content-messages">
        <p>Messages content</p>
      </TabsContent>
    </Tabs>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // Verify initial state
    const homeTab = canvas.getByTestId('tab-home');
    const profileTab = canvas.getByTestId('tab-profile');
    await expect(homeTab).toHaveAttribute('data-state', 'active');
    await expect(canvas.getByTestId('content-home')).toBeInTheDocument();

    // Click on Profile tab
    await userEvent.click(profileTab);

    // Verify Profile tab is now active
    await expect(profileTab).toHaveAttribute('data-state', 'active');
    await expect(canvas.getByTestId('content-profile')).toBeInTheDocument();

    // Test keyboard navigation - Arrow Right to Messages
    await userEvent.keyboard('{ArrowRight}');
    const messagesTab = canvas.getByTestId('tab-messages');
    await expect(messagesTab).toHaveAttribute('data-state', 'active');
    await expect(canvas.getByTestId('content-messages')).toBeInTheDocument();

    // Arrow Left back to Profile
    await userEvent.keyboard('{ArrowLeft}');
    await expect(profileTab).toHaveAttribute('data-state', 'active');
  }
}`,...(me=(ce=w.parameters)==null?void 0:ce.docs)==null?void 0:me.source},description:{story:`Interactive test with play function
Tests keyboard navigation and tab switching`,...(pe=(ue=w.parameters)==null?void 0:ue.docs)==null?void 0:pe.description}}};const oa=["Default","WithCards","WithDisabledTab","FormExample","ManyTabs","InteractiveTest"];export{x as Default,j as FormExample,w as InteractiveTest,N as ManyTabs,y as WithCards,C as WithDisabledTab,oa as __namedExportsOrder,ra as default};
