import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{A as r,b as s,a as t}from"./alert-JMCFSqIB.js";import{T as he}from"./terminal-CrcXkPQW.js";import{C as A}from"./circle-alert-dUHh-VJv.js";import{C as h,T as g}from"./triangle-alert-BvYms6I2.js";import{I as x}from"./info-C_HoouFQ.js";import"./index-B2-qRKKC.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-DVF2XGCm.js";import"./cn-CytzSlOG.js";import"./createLucideIcon-BbF4D6Jl.js";const Ce={title:"Tier 1: Primitives/shadcn/Alert",component:r,parameters:{layout:"centered",docs:{description:{component:"Displays a callout for user attention with optional icon, title, and description."}}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","destructive"],description:"Visual style variant"}},decorators:[Ae=>e.jsx("div",{className:"w-[500px]",children:e.jsx(Ae,{})})]},n={render:()=>e.jsxs(r,{children:[e.jsx(he,{className:"h-4 w-4"}),e.jsx(s,{children:"Heads up!"}),e.jsx(t,{children:"You can add components to your app using the CLI."})]})},l={render:()=>e.jsxs(r,{variant:"destructive",children:[e.jsx(A,{className:"h-4 w-4"}),e.jsx(s,{children:"Error"}),e.jsx(t,{children:"Your session has expired. Please log in again."})]})},a={render:()=>e.jsxs(r,{className:"border-green-500/50 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100",children:[e.jsx(h,{className:"h-4 w-4"}),e.jsx(s,{children:"Success!"}),e.jsx(t,{children:"Your changes have been saved successfully."})]})},i={render:()=>e.jsxs(r,{className:"border-yellow-500/50 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100",children:[e.jsx(g,{className:"h-4 w-4"}),e.jsx(s,{children:"Warning"}),e.jsx(t,{children:"This action cannot be undone. Please proceed with caution."})]})},o={render:()=>e.jsxs(r,{className:"border-blue-500/50 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100",children:[e.jsx(x,{className:"h-4 w-4"}),e.jsx(s,{children:"Information"}),e.jsx(t,{children:"The system will undergo maintenance on Sunday at 2:00 AM UTC."})]})},c={render:()=>e.jsxs(r,{children:[e.jsx(h,{className:"h-4 w-4"}),e.jsx(s,{children:"Operation completed successfully"})]})},d={render:()=>e.jsxs(r,{children:[e.jsx(x,{className:"h-4 w-4"}),e.jsx(t,{children:"This is a simple notification without a title."})]})},p={render:()=>e.jsxs(r,{children:[e.jsx(s,{children:"No Icon Alert"}),e.jsx(t,{children:"This alert doesn't include an icon."})]})},m={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs(r,{children:[e.jsx(he,{className:"h-4 w-4"}),e.jsx(s,{children:"Default"}),e.jsx(t,{children:"Standard alert variant."})]}),e.jsxs(r,{variant:"destructive",children:[e.jsx(A,{className:"h-4 w-4"}),e.jsx(s,{children:"Destructive"}),e.jsx(t,{children:"Error or danger alert variant."})]}),e.jsxs(r,{className:"border-green-500/50 bg-green-50 text-green-900",children:[e.jsx(h,{className:"h-4 w-4"}),e.jsx(s,{children:"Success"}),e.jsx(t,{children:"Custom success styling."})]}),e.jsxs(r,{className:"border-yellow-500/50 bg-yellow-50 text-yellow-900",children:[e.jsx(g,{className:"h-4 w-4"}),e.jsx(s,{children:"Warning"}),e.jsx(t,{children:"Custom warning styling."})]}),e.jsxs(r,{className:"border-blue-500/50 bg-blue-50 text-blue-900",children:[e.jsx(x,{className:"h-4 w-4"}),e.jsx(s,{children:"Info"}),e.jsx(t,{children:"Custom info styling."})]})]})},u={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs(r,{children:[e.jsx(h,{className:"h-4 w-4 text-green-600"}),e.jsx(s,{children:"Deployment successful"}),e.jsx(t,{children:"Application v2.4.1 has been deployed to production at 14:23 UTC."})]}),e.jsxs(r,{variant:"destructive",children:[e.jsx(A,{className:"h-4 w-4"}),e.jsx(s,{children:"Database connection failed"}),e.jsx(t,{children:"Unable to connect to PostgreSQL database. Check your connection settings and try again."})]}),e.jsxs(r,{className:"border-yellow-500/50 bg-yellow-50 text-yellow-900",children:[e.jsx(g,{className:"h-4 w-4"}),e.jsx(s,{children:"Rate limit approaching"}),e.jsx(t,{children:"You have used 850 of 1000 API requests this hour. Consider upgrading your plan."})]})]})};var y,w,j,b,T;n.parameters={...n.parameters,docs:{...(y=n.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the CLI.
      </AlertDescription>
    </Alert>
}`,...(j=(w=n.parameters)==null?void 0:w.docs)==null?void 0:j.source},description:{story:"Default alert with info styling",...(T=(b=n.parameters)==null?void 0:b.docs)==null?void 0:T.description}}};var N,D,f,v,C;l.parameters={...l.parameters,docs:{...(N=l.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
}`,...(f=(D=l.parameters)==null?void 0:D.docs)==null?void 0:f.source},description:{story:"Destructive alert for error messages",...(C=(v=l.parameters)==null?void 0:v.docs)==null?void 0:C.description}}};var I,S,k,W,P;a.parameters={...a.parameters,docs:{...(I=a.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => <Alert className="border-green-500/50 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100">
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle>Success!</AlertTitle>
      <AlertDescription>
        Your changes have been saved successfully.
      </AlertDescription>
    </Alert>
}`,...(k=(S=a.parameters)==null?void 0:S.docs)==null?void 0:k.source},description:{story:"Success alert (custom styling)",...(P=(W=a.parameters)==null?void 0:W.docs)==null?void 0:P.description}}};var E,Y,O,R,U;i.parameters={...i.parameters,docs:{...(E=i.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => <Alert className="border-yellow-500/50 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        This action cannot be undone. Please proceed with caution.
      </AlertDescription>
    </Alert>
}`,...(O=(Y=i.parameters)==null?void 0:Y.docs)==null?void 0:O.source},description:{story:"Warning alert (custom styling)",...(U=(R=i.parameters)==null?void 0:R.docs)==null?void 0:U.description}}};var L,V,q,H,M;o.parameters={...o.parameters,docs:{...(L=o.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: () => <Alert className="border-blue-500/50 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        The system will undergo maintenance on Sunday at 2:00 AM UTC.
      </AlertDescription>
    </Alert>
}`,...(q=(V=o.parameters)==null?void 0:V.docs)==null?void 0:q.source},description:{story:"Info alert (custom styling)",...(M=(H=o.parameters)==null?void 0:H.docs)==null?void 0:M.description}}};var Q,_,$,z,B;c.parameters={...c.parameters,docs:{...(Q=c.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: () => <Alert>
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle>Operation completed successfully</AlertTitle>
    </Alert>
}`,...($=(_=c.parameters)==null?void 0:_.docs)==null?void 0:$.source},description:{story:"Alert with only title (no description)",...(B=(z=c.parameters)==null?void 0:z.docs)==null?void 0:B.description}}};var F,G,J,K,X;d.parameters={...d.parameters,docs:{...(F=d.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <Alert>
      <InfoIcon className="h-4 w-4" />
      <AlertDescription>
        This is a simple notification without a title.
      </AlertDescription>
    </Alert>
}`,...(J=(G=d.parameters)==null?void 0:G.docs)==null?void 0:J.source},description:{story:"Alert with only description (no title)",...(X=(K=d.parameters)==null?void 0:K.docs)==null?void 0:X.description}}};var Z,ee,re,se,te;p.parameters={...p.parameters,docs:{...(Z=p.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  render: () => <Alert>
      <AlertTitle>No Icon Alert</AlertTitle>
      <AlertDescription>
        This alert doesn't include an icon.
      </AlertDescription>
    </Alert>
}`,...(re=(ee=p.parameters)==null?void 0:ee.docs)==null?void 0:re.source},description:{story:"Alert without icon",...(te=(se=p.parameters)==null?void 0:se.docs)==null?void 0:te.description}}};var ne,le,ae,ie,oe;m.parameters={...m.parameters,docs:{...(ne=m.parameters)==null?void 0:ne.docs,source:{originalSource:`{
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
}`,...(ae=(le=m.parameters)==null?void 0:le.docs)==null?void 0:ae.source},description:{story:"All alert variants showcase",...(oe=(ie=m.parameters)==null?void 0:ie.docs)==null?void 0:oe.description}}};var ce,de,pe,me,ue;u.parameters={...u.parameters,docs:{...(ce=u.parameters)==null?void 0:ce.docs,source:{originalSource:`{
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
}`,...(pe=(de=u.parameters)==null?void 0:de.docs)==null?void 0:pe.source},description:{story:"Real-world usage examples",...(ue=(me=u.parameters)==null?void 0:me.docs)==null?void 0:ue.description}}};const Ie=["Default","Destructive","Success","Warning","Info","TitleOnly","DescriptionOnly","WithoutIcon","AllVariants","RealWorldExamples"];export{m as AllVariants,n as Default,d as DescriptionOnly,l as Destructive,o as Info,u as RealWorldExamples,a as Success,c as TitleOnly,i as Warning,p as WithoutIcon,Ie as __namedExportsOrder,Ce as default};
