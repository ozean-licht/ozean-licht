import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{r as y}from"./index-B2-qRKKC.js";import{c as be}from"./index-DVF2XGCm.js";import{c as w}from"./cn-CytzSlOG.js";import{T as we}from"./terminal-CrcXkPQW.js";import{C as j}from"./circle-alert-dUHh-VJv.js";import{C as x,T as b}from"./triangle-alert-BvYms6I2.js";import{I as v}from"./info-C_HoouFQ.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./createLucideIcon-BbF4D6Jl.js";const ve=be("relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",{variants:{variant:{default:"bg-background text-foreground",destructive:"border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"}},defaultVariants:{variant:"default"}}),r=y.forwardRef(({className:n,variant:a,...l},je)=>e.jsx("div",{ref:je,role:"alert",className:w(ve({variant:a}),n),...l}));r.displayName="Alert";const t=y.forwardRef(({className:n,...a},l)=>e.jsx("h5",{ref:l,className:w("mb-1 font-medium leading-none tracking-tight",n),...a}));t.displayName="AlertTitle";const s=y.forwardRef(({className:n,...a},l)=>e.jsx("div",{ref:l,className:w("text-sm [&_p]:leading-relaxed",n),...a}));s.displayName="AlertDescription";try{r.displayName="Alert",r.__docgenInfo={description:"",displayName:"Alert",props:{variant:{defaultValue:null,description:"",name:"variant",required:!1,type:{name:'"default" | "destructive" | null'}}}}}catch{}try{t.displayName="AlertTitle",t.__docgenInfo={description:"",displayName:"AlertTitle",props:{}}}catch{}try{s.displayName="AlertDescription",s.__docgenInfo={description:"",displayName:"AlertDescription",props:{}}}catch{}const Ee={title:"Tier 1: Primitives/shadcn/Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"Displays a callout for user attention with optional icon, title, and description."}}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","destructive"],description:"Visual style variant"}},decorators:[n=>e.jsx("div",{className:"w-[500px]",children:e.jsx(n,{})})]},i={render:()=>e.jsxs(r,{children:[e.jsx(we,{className:"h-4 w-4"}),e.jsx(t,{children:"Heads up!"}),e.jsx(s,{children:"You can add components to your app using the CLI."})]})},o={render:()=>e.jsxs(r,{variant:"destructive",children:[e.jsx(j,{className:"h-4 w-4"}),e.jsx(t,{children:"Error"}),e.jsx(s,{children:"Your session has expired. Please log in again."})]})},c={render:()=>e.jsxs(r,{className:"border-green-500/50 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100",children:[e.jsx(x,{className:"h-4 w-4"}),e.jsx(t,{children:"Success!"}),e.jsx(s,{children:"Your changes have been saved successfully."})]})},d={render:()=>e.jsxs(r,{className:"border-yellow-500/50 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100",children:[e.jsx(b,{className:"h-4 w-4"}),e.jsx(t,{children:"Warning"}),e.jsx(s,{children:"This action cannot be undone. Please proceed with caution."})]})},p={render:()=>e.jsxs(r,{className:"border-blue-500/50 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100",children:[e.jsx(v,{className:"h-4 w-4"}),e.jsx(t,{children:"Information"}),e.jsx(s,{children:"The system will undergo maintenance on Sunday at 2:00 AM UTC."})]})},m={render:()=>e.jsxs(r,{children:[e.jsx(x,{className:"h-4 w-4"}),e.jsx(t,{children:"Operation completed successfully"})]})},u={render:()=>e.jsxs(r,{children:[e.jsx(v,{className:"h-4 w-4"}),e.jsx(s,{children:"This is a simple notification without a title."})]})},h={render:()=>e.jsxs(r,{children:[e.jsx(t,{children:"No Icon Alert"}),e.jsx(s,{children:"This alert doesn't include an icon."})]})},A={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs(r,{children:[e.jsx(we,{className:"h-4 w-4"}),e.jsx(t,{children:"Default"}),e.jsx(s,{children:"Standard alert variant."})]}),e.jsxs(r,{variant:"destructive",children:[e.jsx(j,{className:"h-4 w-4"}),e.jsx(t,{children:"Destructive"}),e.jsx(s,{children:"Error or danger alert variant."})]}),e.jsxs(r,{className:"border-green-500/50 bg-green-50 text-green-900",children:[e.jsx(x,{className:"h-4 w-4"}),e.jsx(t,{children:"Success"}),e.jsx(s,{children:"Custom success styling."})]}),e.jsxs(r,{className:"border-yellow-500/50 bg-yellow-50 text-yellow-900",children:[e.jsx(b,{className:"h-4 w-4"}),e.jsx(t,{children:"Warning"}),e.jsx(s,{children:"Custom warning styling."})]}),e.jsxs(r,{className:"border-blue-500/50 bg-blue-50 text-blue-900",children:[e.jsx(v,{className:"h-4 w-4"}),e.jsx(t,{children:"Info"}),e.jsx(s,{children:"Custom info styling."})]})]})},g={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs(r,{children:[e.jsx(x,{className:"h-4 w-4 text-green-600"}),e.jsx(t,{children:"Deployment successful"}),e.jsx(s,{children:"Application v2.4.1 has been deployed to production at 14:23 UTC."})]}),e.jsxs(r,{variant:"destructive",children:[e.jsx(j,{className:"h-4 w-4"}),e.jsx(t,{children:"Database connection failed"}),e.jsx(s,{children:"Unable to connect to PostgreSQL database. Check your connection settings and try again."})]}),e.jsxs(r,{className:"border-yellow-500/50 bg-yellow-50 text-yellow-900",children:[e.jsx(b,{className:"h-4 w-4"}),e.jsx(t,{children:"Rate limit approaching"}),e.jsx(s,{children:"You have used 850 of 1000 API requests this hour. Consider upgrading your plan."})]})]})};var f,N,T,D,C;i.parameters={...i.parameters,docs:{...(f=i.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the CLI.
      </AlertDescription>
    </Alert>
}`,...(T=(N=i.parameters)==null?void 0:N.docs)==null?void 0:T.source},description:{story:"Default alert with info styling",...(C=(D=i.parameters)==null?void 0:D.docs)==null?void 0:C.description}}};var _,I,S,k,W;o.parameters={...o.parameters,docs:{...(_=o.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: () => <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
}`,...(S=(I=o.parameters)==null?void 0:I.docs)==null?void 0:S.source},description:{story:"Destructive alert for error messages",...(W=(k=o.parameters)==null?void 0:k.docs)==null?void 0:W.description}}};var E,P,R,Y,O;c.parameters={...c.parameters,docs:{...(E=c.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => <Alert className="border-green-500/50 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100">
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle>Success!</AlertTitle>
      <AlertDescription>
        Your changes have been saved successfully.
      </AlertDescription>
    </Alert>
}`,...(R=(P=c.parameters)==null?void 0:P.docs)==null?void 0:R.source},description:{story:"Success alert (custom styling)",...(O=(Y=c.parameters)==null?void 0:Y.docs)==null?void 0:O.description}}};var U,V,L,q,H;d.parameters={...d.parameters,docs:{...(U=d.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: () => <Alert className="border-yellow-500/50 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        This action cannot be undone. Please proceed with caution.
      </AlertDescription>
    </Alert>
}`,...(L=(V=d.parameters)==null?void 0:V.docs)==null?void 0:L.source},description:{story:"Warning alert (custom styling)",...(H=(q=d.parameters)==null?void 0:q.docs)==null?void 0:H.description}}};var M,Q,$,z,B;p.parameters={...p.parameters,docs:{...(M=p.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => <Alert className="border-blue-500/50 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        The system will undergo maintenance on Sunday at 2:00 AM UTC.
      </AlertDescription>
    </Alert>
}`,...($=(Q=p.parameters)==null?void 0:Q.docs)==null?void 0:$.source},description:{story:"Info alert (custom styling)",...(B=(z=p.parameters)==null?void 0:z.docs)==null?void 0:B.description}}};var F,G,J,K,X;m.parameters={...m.parameters,docs:{...(F=m.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <Alert>
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle>Operation completed successfully</AlertTitle>
    </Alert>
}`,...(J=(G=m.parameters)==null?void 0:G.docs)==null?void 0:J.source},description:{story:"Alert with only title (no description)",...(X=(K=m.parameters)==null?void 0:K.docs)==null?void 0:X.description}}};var Z,ee,re,te,se;u.parameters={...u.parameters,docs:{...(Z=u.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  render: () => <Alert>
      <InfoIcon className="h-4 w-4" />
      <AlertDescription>
        This is a simple notification without a title.
      </AlertDescription>
    </Alert>
}`,...(re=(ee=u.parameters)==null?void 0:ee.docs)==null?void 0:re.source},description:{story:"Alert with only description (no title)",...(se=(te=u.parameters)==null?void 0:te.docs)==null?void 0:se.description}}};var ne,ae,le,ie,oe;h.parameters={...h.parameters,docs:{...(ne=h.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: () => <Alert>
      <AlertTitle>No Icon Alert</AlertTitle>
      <AlertDescription>
        This alert doesn't include an icon.
      </AlertDescription>
    </Alert>
}`,...(le=(ae=h.parameters)==null?void 0:ae.docs)==null?void 0:le.source},description:{story:"Alert without icon",...(oe=(ie=h.parameters)==null?void 0:ie.docs)==null?void 0:oe.description}}};var ce,de,pe,me,ue;A.parameters={...A.parameters,docs:{...(ce=A.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>Standard alert variant.</AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Destructive</AlertTitle>
        <AlertDescription>Error or danger alert variant.</AlertDescription>
      </Alert>

      <Alert className="border-green-500/50 bg-green-50 text-green-900">
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Custom success styling.</AlertDescription>
      </Alert>

      <Alert className="border-yellow-500/50 bg-yellow-50 text-yellow-900">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Custom warning styling.</AlertDescription>
      </Alert>

      <Alert className="border-blue-500/50 bg-blue-50 text-blue-900">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>Custom info styling.</AlertDescription>
      </Alert>
    </div>
}`,...(pe=(de=A.parameters)==null?void 0:de.docs)==null?void 0:pe.source},description:{story:"All alert variants showcase",...(ue=(me=A.parameters)==null?void 0:me.docs)==null?void 0:ue.description}}};var he,Ae,ge,xe,ye;g.parameters={...g.parameters,docs:{...(he=g.parameters)==null?void 0:he.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <Alert>
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle>Deployment successful</AlertTitle>
        <AlertDescription>
          Application v2.4.1 has been deployed to production at 14:23 UTC.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Database connection failed</AlertTitle>
        <AlertDescription>
          Unable to connect to PostgreSQL database. Check your connection settings and try again.
        </AlertDescription>
      </Alert>

      <Alert className="border-yellow-500/50 bg-yellow-50 text-yellow-900">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Rate limit approaching</AlertTitle>
        <AlertDescription>
          You have used 850 of 1000 API requests this hour. Consider upgrading your plan.
        </AlertDescription>
      </Alert>
    </div>
}`,...(ge=(Ae=g.parameters)==null?void 0:Ae.docs)==null?void 0:ge.source},description:{story:"Real-world usage examples",...(ye=(xe=g.parameters)==null?void 0:xe.docs)==null?void 0:ye.description}}};const Pe=["Default","Destructive","Success","Warning","Info","TitleOnly","DescriptionOnly","WithoutIcon","AllVariants","RealWorldExamples"];export{A as AllVariants,i as Default,u as DescriptionOnly,o as Destructive,p as Info,g as RealWorldExamples,c as Success,m as TitleOnly,d as Warning,h as WithoutIcon,Pe as __namedExportsOrder,Ee as default};
