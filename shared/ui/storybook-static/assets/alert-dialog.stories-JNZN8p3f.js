import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{w as L,u as q,e as z}from"./index-CJu6nLMj.js";import{r as i}from"./index-B2-qRKKC.js";import{c as jt,a as Nt,f as wt}from"./index-BiUY2kQP.js";import{u as tt}from"./index-BFjtS4uE.js";import{c as ot,R as Tt,T as _t,P as kt,W as St,a as Bt,b as It,D as Ot,C as rt,O as Et}from"./index-Bir9vGUy.js";import{c as f}from"./cn-CKXzwFwe.js";import{b as at}from"./button-DhHHw9VN.js";import{B as h}from"./Button-PgnE6Xyj.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-kS-9iBlu.js";import"./index-CpxwHbl5.js";import"./index-D1vk04JX.js";import"./index-BlCrtW8-.js";import"./index-BVCCCNF7.js";import"./index-ciuW_uyV.js";import"./index-BIMsXDgJ.js";import"./index-B7rHuW0e.js";import"./index-PNzqWif7.js";import"./clsx-B-dksMZM.js";import"./index-BiMR7eR1.js";import"./index-Dp3B9jqt.js";var lt="AlertDialog",[Pt]=jt(lt,[ot]),D=ot(),it=t=>{const{__scopeAlertDialog:o,...r}=t,a=D(o);return e.jsx(Tt,{...a,...r,modal:!0})};it.displayName=lt;var Ft="AlertDialogTrigger",st=i.forwardRef((t,o)=>{const{__scopeAlertDialog:r,...a}=t,l=D(r);return e.jsx(_t,{...l,...a,ref:o})});st.displayName=Ft;var Rt="AlertDialogPortal",nt=t=>{const{__scopeAlertDialog:o,...r}=t,a=D(o);return e.jsx(kt,{...a,...r})};nt.displayName=Rt;var Wt="AlertDialogOverlay",ct=i.forwardRef((t,o)=>{const{__scopeAlertDialog:r,...a}=t,l=D(r);return e.jsx(Et,{...l,...a,ref:o})});ct.displayName=Wt;var v="AlertDialogContent",[Ht,Ut]=Pt(v),Lt=wt("AlertDialogContent"),dt=i.forwardRef((t,o)=>{const{__scopeAlertDialog:r,children:a,...l}=t,x=D(r),y=i.useRef(null),C=tt(o,y),H=i.useRef(null);return e.jsx(St,{contentName:v,titleName:gt,docsSlug:"alert-dialog",children:e.jsx(Ht,{scope:r,cancelRef:H,children:e.jsxs(Bt,{role:"alertdialog",...x,...l,ref:C,onOpenAutoFocus:Nt(l.onOpenAutoFocus,b=>{var U;b.preventDefault(),(U=H.current)==null||U.focus({preventScroll:!0})}),onPointerDownOutside:b=>b.preventDefault(),onInteractOutside:b=>b.preventDefault(),children:[e.jsx(Lt,{children:a}),e.jsx(zt,{contentRef:y})]})})})});dt.displayName=v;var gt="AlertDialogTitle",ut=i.forwardRef((t,o)=>{const{__scopeAlertDialog:r,...a}=t,l=D(r);return e.jsx(It,{...l,...a,ref:o})});ut.displayName=gt;var pt="AlertDialogDescription",mt=i.forwardRef((t,o)=>{const{__scopeAlertDialog:r,...a}=t,l=D(r);return e.jsx(Ot,{...l,...a,ref:o})});mt.displayName=pt;var qt="AlertDialogAction",ht=i.forwardRef((t,o)=>{const{__scopeAlertDialog:r,...a}=t,l=D(r);return e.jsx(rt,{...l,...a,ref:o})});ht.displayName=qt;var At="AlertDialogCancel",Dt=i.forwardRef((t,o)=>{const{__scopeAlertDialog:r,...a}=t,{cancelRef:l}=Ut(At,r),x=D(r),y=tt(o,l);return e.jsx(rt,{...x,...a,ref:y})});Dt.displayName=At;var zt=({contentRef:t})=>{const o=`\`${v}\` requires a description for the component to be accessible for screen reader users.

You can add a description to the \`${v}\` by passing a \`${pt}\` component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in \`${v}\`. If the description is confusing or duplicative for sighted users, you can use the \`@radix-ui/react-visually-hidden\` primitive as a wrapper around your description component.

For more information, see https://radix-ui.com/primitives/docs/components/alert-dialog`;return i.useEffect(()=>{var a;document.getElementById((a=t.current)==null?void 0:a.getAttribute("aria-describedby"))||console.warn(o)},[o,t]),null},Yt=it,Mt=st,Vt=nt,xt=ct,yt=dt,ft=ht,vt=Dt,Ct=ut,bt=mt;const s=Yt,A=Mt,W=Vt,R=i.forwardRef(({className:t,...o},r)=>e.jsx(xt,{className:f("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",t),...o,ref:r}));R.displayName=xt.displayName;const n=i.forwardRef(({className:t,...o},r)=>e.jsxs(W,{children:[e.jsx(R,{}),e.jsx(yt,{ref:r,className:f("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",t),...o})]}));n.displayName=yt.displayName;const c=({className:t,...o})=>e.jsx("div",{className:f("flex flex-col space-y-2 text-center sm:text-left",t),...o});c.displayName="AlertDialogHeader";const d=({className:t,...o})=>e.jsx("div",{className:f("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",t),...o});d.displayName="AlertDialogFooter";const g=i.forwardRef(({className:t,...o},r)=>e.jsx(Ct,{ref:r,className:f("text-lg font-semibold",t),...o}));g.displayName=Ct.displayName;const u=i.forwardRef(({className:t,...o},r)=>e.jsx(bt,{ref:r,className:f("text-sm text-muted-foreground",t),...o}));u.displayName=bt.displayName;const p=i.forwardRef(({className:t,...o},r)=>e.jsx(ft,{ref:r,className:f(at(),t),...o}));p.displayName=ft.displayName;const m=i.forwardRef(({className:t,...o},r)=>e.jsx(vt,{ref:r,className:f(at({variant:"outline"}),"mt-2 sm:mt-0",t),...o}));m.displayName=vt.displayName;try{s.displayName="AlertDialog",s.__docgenInfo={description:"",displayName:"AlertDialog",props:{}}}catch{}try{W.displayName="AlertDialogPortal",W.__docgenInfo={description:"",displayName:"AlertDialogPortal",props:{}}}catch{}try{R.displayName="AlertDialogOverlay",R.__docgenInfo={description:"",displayName:"AlertDialogOverlay",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{A.displayName="AlertDialogTrigger",A.__docgenInfo={description:"",displayName:"AlertDialogTrigger",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{n.displayName="AlertDialogContent",n.__docgenInfo={description:"",displayName:"AlertDialogContent",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{c.displayName="AlertDialogHeader",c.__docgenInfo={description:"",displayName:"AlertDialogHeader",props:{}}}catch{}try{d.displayName="AlertDialogFooter",d.__docgenInfo={description:"",displayName:"AlertDialogFooter",props:{}}}catch{}try{g.displayName="AlertDialogTitle",g.__docgenInfo={description:"",displayName:"AlertDialogTitle",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{u.displayName="AlertDialogDescription",u.__docgenInfo={description:"",displayName:"AlertDialogDescription",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{p.displayName="AlertDialogAction",p.__docgenInfo={description:"",displayName:"AlertDialogAction",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{m.displayName="AlertDialogCancel",m.__docgenInfo={description:"",displayName:"AlertDialogCancel",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}const Ao={title:"Tier 1: Primitives/shadcn/AlertDialog",component:s,parameters:{layout:"centered",docs:{description:{component:"A modal dialog that interrupts the user with important content and expects a response. Built on Radix UI AlertDialog primitive."}}},tags:["autodocs"]},j={render:()=>e.jsxs(s,{children:[e.jsx(A,{asChild:!0,children:e.jsx(h,{variant:"outline",children:"Show Alert"})}),e.jsxs(n,{children:[e.jsxs(c,{children:[e.jsx(g,{children:"Are you absolutely sure?"}),e.jsx(u,{children:"This action cannot be undone. This will permanently delete your account and remove your data from our servers."})]}),e.jsxs(d,{children:[e.jsx(m,{children:"Cancel"}),e.jsx(p,{children:"Continue"})]})]})]})},N={render:()=>e.jsxs(s,{children:[e.jsx(A,{asChild:!0,children:e.jsx(h,{variant:"destructive",children:"Delete Account"})}),e.jsxs(n,{children:[e.jsxs(c,{children:[e.jsx(g,{children:"Delete Account"}),e.jsx(u,{children:"This will permanently delete your account and all associated data. This action cannot be undone. Are you sure you want to continue?"})]}),e.jsxs(d,{children:[e.jsx(m,{children:"Cancel"}),e.jsx(p,{className:"bg-destructive text-destructive-foreground hover:bg-destructive/90",children:"Delete Account"})]})]})]})},w={render:()=>e.jsxs(s,{children:[e.jsx(A,{asChild:!0,children:e.jsx(h,{variant:"outline",children:"Proceed with Caution"})}),e.jsxs(n,{children:[e.jsxs(c,{children:[e.jsx(g,{className:"text-yellow-600 dark:text-yellow-500",children:"⚠️ Warning"}),e.jsx(u,{children:"You are about to perform an action that may have unintended consequences. Please review your changes carefully before proceeding."})]}),e.jsxs(d,{children:[e.jsx(m,{children:"Go Back"}),e.jsx(p,{className:"bg-yellow-600 hover:bg-yellow-700 text-white",children:"I Understand, Continue"})]})]})]})},T={render:()=>e.jsxs(s,{children:[e.jsx(A,{asChild:!0,children:e.jsx(h,{children:"Important Information"})}),e.jsxs(n,{children:[e.jsxs(c,{children:[e.jsx(g,{className:"text-blue-600 dark:text-blue-500",children:"ℹ️ Important Update"}),e.jsx(u,{children:"We've updated our privacy policy. Please review the changes before continuing to use our service. The new policy takes effect on January 1, 2025."})]}),e.jsxs(d,{children:[e.jsx(m,{children:"Review Later"}),e.jsx(p,{className:"bg-blue-600 hover:bg-blue-700 text-white",children:"Review Now"})]})]})]})},_={render:()=>e.jsxs(s,{children:[e.jsx(A,{asChild:!0,children:e.jsx(h,{variant:"cta",style:{backgroundColor:"#0ec2bc",color:"white"},children:"Complete Setup"})}),e.jsxs(n,{children:[e.jsxs(c,{children:[e.jsx(g,{className:"text-green-600 dark:text-green-500",children:"✓ Setup Complete!"}),e.jsx(u,{children:"Your account has been successfully configured. You can now start using all features of the platform. Would you like to view the quick start guide?"})]}),e.jsxs(d,{children:[e.jsx(m,{children:"Skip Guide"}),e.jsx(p,{className:"bg-green-600 hover:bg-green-700 text-white",children:"View Guide"})]})]})]})},k={render:()=>e.jsxs(s,{children:[e.jsx(A,{asChild:!0,children:e.jsx(h,{variant:"outline",children:"Show Acknowledgment"})}),e.jsxs(n,{children:[e.jsxs(c,{children:[e.jsx(g,{children:"Terms of Service"}),e.jsx(u,{children:'You must accept the terms of service to continue using this application. By clicking "I Accept", you agree to be bound by these terms.'})]}),e.jsx(d,{children:e.jsx(p,{children:"I Accept"})})]})]})},S={render:()=>e.jsxs(s,{children:[e.jsx(A,{asChild:!0,children:e.jsx(h,{children:"View Critical Update"})}),e.jsxs(n,{className:"max-h-[80vh]",children:[e.jsxs(c,{children:[e.jsx(g,{children:"Critical Security Update Required"}),e.jsx(u,{children:"Please read the following important security information carefully."})]}),e.jsxs("div",{className:"overflow-y-auto max-h-[40vh] space-y-3 text-sm my-4",children:[e.jsx("p",{children:"We have detected a critical security vulnerability that affects your account. Immediate action is required to protect your data."}),e.jsx("p",{className:"font-semibold",children:"What happened:"}),e.jsx("p",{children:"A security researcher discovered a potential vulnerability in our authentication system that could allow unauthorized access under specific circumstances."}),e.jsx("p",{className:"font-semibold",children:"What we're doing:"}),e.jsx("p",{children:"We have already deployed a fix to our systems and are requiring all users to update their passwords and enable two-factor authentication."}),e.jsx("p",{className:"font-semibold",children:"What you need to do:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-1 ml-2",children:[e.jsx("li",{children:"Update your password immediately"}),e.jsx("li",{children:"Enable two-factor authentication"}),e.jsx("li",{children:"Review your recent account activity"}),e.jsx("li",{children:"Update your security questions"})]}),e.jsx("p",{children:"We take security very seriously and apologize for any inconvenience this may cause. Your data security is our top priority."}),e.jsx("p",{className:"text-muted-foreground text-xs",children:"For more information, please visit our security blog or contact our support team at security@example.com."})]}),e.jsxs(d,{children:[e.jsx(m,{children:"I'll Do This Later"}),e.jsx(p,{className:"bg-destructive text-destructive-foreground hover:bg-destructive/90",children:"Update Now"})]})]})]})},B={render:()=>{const t=()=>{const[o,r]=i.useState(!1),[a,l]=i.useState(null),x=y=>{l(y),r(!1),setTimeout(()=>l(null),3e3)};return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsx(h,{onClick:()=>r(!0),children:"Open Alert"}),e.jsx(h,{variant:"outline",onClick:()=>r(!1),children:"Close Alert (External)"})]}),e.jsxs("div",{className:"text-sm space-y-1",children:[e.jsxs("p",{className:"text-muted-foreground",children:["Alert is currently: ",e.jsx("span",{className:"font-semibold",children:o?"Open":"Closed"})]}),a&&e.jsxs("p",{className:"text-muted-foreground",children:["Last action: ",e.jsx("span",{className:"font-semibold",children:a})]})]}),e.jsx(s,{open:o,onOpenChange:r,children:e.jsxs(n,{children:[e.jsxs(c,{children:[e.jsx(g,{children:"Controlled Alert Dialog"}),e.jsx(u,{children:"This alert dialog's state is controlled by external state. The component tracks which action was taken."})]}),e.jsx("div",{className:"py-4",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"Click one of the action buttons below, and the component will track which action you took."})}),e.jsxs(d,{children:[e.jsx(m,{onClick:()=>x("cancel"),children:"Cancel"}),e.jsx(p,{onClick:()=>x("confirm"),children:"Confirm"})]})]})})]})};return e.jsx(t,{})}},I={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs(s,{children:[e.jsx(A,{asChild:!0,children:e.jsx(h,{style:{backgroundColor:"#0ec2bc",color:"white"},children:"Ozean Licht Confirmation"})}),e.jsxs(n,{children:[e.jsxs(c,{children:[e.jsx(g,{style:{color:"#0ec2bc"},children:"Confirm Your Choice"}),e.jsx(u,{children:"This action will update your Ozean Licht profile settings. Your changes will be saved immediately."})]}),e.jsxs(d,{children:[e.jsx(m,{children:"Cancel"}),e.jsx(p,{style:{backgroundColor:"#0ec2bc",color:"white"},className:"hover:opacity-90",children:"Confirm Changes"})]})]})]}),e.jsxs(s,{children:[e.jsx(A,{asChild:!0,children:e.jsx(h,{variant:"outline",style:{borderColor:"#0ec2bc",color:"#0ec2bc"},children:"Ozean Licht Warning"})}),e.jsxs(n,{style:{borderColor:"#0ec2bc",borderWidth:"2px"},children:[e.jsxs(c,{children:[e.jsx(g,{children:"Important Notice"}),e.jsx(u,{children:"This operation will affect your Ozean Licht content library. Please ensure you have a backup before proceeding."})]}),e.jsx("div",{className:"py-2",children:e.jsx("p",{className:"text-sm",style:{color:"#0ec2bc"},children:"💡 Pro Tip: You can restore from backups in your account settings."})}),e.jsxs(d,{children:[e.jsx(m,{children:"Go Back"}),e.jsx(p,{style:{backgroundColor:"#0ec2bc",color:"white"},className:"hover:opacity-90",children:"I Have a Backup"})]})]})]}),e.jsxs(s,{children:[e.jsx(A,{asChild:!0,children:e.jsx(h,{variant:"destructive",children:"Delete with Ozean Licht Theme"})}),e.jsxs(n,{children:[e.jsxs(c,{children:[e.jsx(g,{className:"text-destructive",children:"Delete Content"}),e.jsx(u,{children:"This will permanently delete the selected content from Ozean Licht. This action cannot be undone."})]}),e.jsxs("div",{className:"py-3 px-4 rounded-md border-2 my-2",style:{borderColor:"#0ec2bc",backgroundColor:"#0ec2bc10"},children:[e.jsx("p",{className:"text-sm font-medium",style:{color:"#0ec2bc"},children:"Alternative: Archive Instead"}),e.jsx("p",{className:"text-xs text-muted-foreground mt-1",children:"Consider archiving this content instead of deleting it permanently."})]}),e.jsxs(d,{children:[e.jsx(m,{children:"Cancel"}),e.jsx(p,{className:"bg-destructive text-destructive-foreground hover:bg-destructive/90",children:"Delete Permanently"})]})]})]})]})},O={render:()=>e.jsxs(s,{children:[e.jsx(A,{asChild:!0,children:e.jsx(h,{children:"Unsaved Changes"})}),e.jsxs(n,{children:[e.jsxs(c,{children:[e.jsx(g,{children:"Unsaved Changes"}),e.jsx(u,{children:"You have unsaved changes. What would you like to do?"})]}),e.jsxs(d,{className:"sm:flex-col sm:space-x-0 gap-2",children:[e.jsx(p,{className:"bg-green-600 hover:bg-green-700 text-white sm:w-full",children:"Save Changes"}),e.jsx(p,{className:"bg-muted hover:bg-muted/80 text-foreground sm:w-full",children:"Discard Changes"}),e.jsx(m,{className:"sm:w-full",children:"Continue Editing"})]})]})]})},E={render:()=>e.jsxs(s,{children:[e.jsx(A,{asChild:!0,children:e.jsx(h,{children:"Show Explicit Structure"})}),e.jsxs(W,{children:[e.jsx(R,{}),e.jsxs(n,{children:[e.jsxs(c,{children:[e.jsx(g,{children:"Explicit Structure"}),e.jsx(u,{children:"This alert dialog explicitly shows AlertDialogPortal and AlertDialogOverlay usage, though AlertDialogContent includes them automatically."})]}),e.jsx("div",{className:"py-4",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"In most cases, you don't need to use AlertDialogPortal and AlertDialogOverlay directly - AlertDialogContent handles them for you."})}),e.jsx(d,{children:e.jsx(m,{children:"Close"})})]})]})]})},P={render:()=>e.jsxs(s,{children:[e.jsx(A,{asChild:!0,children:e.jsx(h,{"data-testid":"open-alert",children:"Open Alert Dialog"})}),e.jsxs(n,{"data-testid":"alert-content",children:[e.jsxs(c,{children:[e.jsx(g,{children:"Test Alert Dialog"}),e.jsx(u,{children:"This alert dialog tests that user must take explicit action to dismiss."})]}),e.jsx("div",{className:"py-4",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"Try pressing ESC or clicking outside - the dialog should remain open. You must click Cancel or Confirm to close."})}),e.jsxs(d,{children:[e.jsx(m,{"data-testid":"cancel-button",children:"Cancel"}),e.jsx(p,{"data-testid":"confirm-button",children:"Confirm"})]})]})]}),play:async({canvasElement:t})=>{const o=L(t),r=L(document.body),a=o.getByTestId("open-alert");await q.click(a),await new Promise(C=>setTimeout(C,200));const l=r.getByTestId("alert-content");await z(l).toBeInTheDocument();const x=r.getByTestId("confirm-button");await z(x).toBeInTheDocument();const y=r.getByTestId("cancel-button");await q.click(y),await new Promise(C=>setTimeout(C,300))}},F={render:()=>e.jsxs("div",{className:"space-y-6 p-6 max-w-4xl",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"When to Use Each Component"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Choose the right modal component based on your use case."})]}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-6",children:[e.jsxs("div",{className:"space-y-4 p-4 border rounded-lg",children:[e.jsx("h4",{className:"font-semibold text-destructive",children:"Use AlertDialog for:"}),e.jsxs("ul",{className:"text-sm space-y-2 list-disc list-inside",children:[e.jsx("li",{children:"Destructive actions (delete, remove)"}),e.jsx("li",{children:"Critical warnings"}),e.jsx("li",{children:"Confirmations that can't be ignored"}),e.jsx("li",{children:"Actions requiring explicit user response"})]}),e.jsxs(s,{children:[e.jsx(A,{asChild:!0,children:e.jsx(h,{variant:"destructive",className:"w-full",children:"Example: Delete Account"})}),e.jsxs(n,{children:[e.jsxs(c,{children:[e.jsx(g,{children:"Delete Account?"}),e.jsx(u,{children:"This action cannot be undone. All your data will be permanently deleted."})]}),e.jsxs(d,{children:[e.jsx(m,{children:"Cancel"}),e.jsx(p,{className:"bg-destructive text-destructive-foreground hover:bg-destructive/90",children:"Delete"})]})]})]})]}),e.jsxs("div",{className:"space-y-4 p-4 border rounded-lg",children:[e.jsx("h4",{className:"font-semibold",style:{color:"#0ec2bc"},children:"Use Dialog for:"}),e.jsxs("ul",{className:"text-sm space-y-2 list-disc list-inside",children:[e.jsx("li",{children:"Forms and data entry"}),e.jsx("li",{children:"Settings and preferences"}),e.jsx("li",{children:"Detail views"}),e.jsx("li",{children:"Non-critical information"})]}),e.jsx("p",{className:"text-sm text-muted-foreground pt-2",children:"See dialog.stories.tsx for Dialog examples."})]})]}),e.jsxs("div",{className:"p-4 bg-muted rounded-lg space-y-2",children:[e.jsx("h4",{className:"font-semibold text-sm",children:"Key Difference:"}),e.jsxs("p",{className:"text-sm",children:[e.jsx("strong",{children:"AlertDialog"})," requires explicit user action (must click confirm/cancel). User cannot dismiss by pressing ESC or clicking outside."]}),e.jsxs("p",{className:"text-sm",children:[e.jsx("strong",{children:"Dialog"})," can be dismissed multiple ways (ESC, click outside, close button). More flexible for non-critical interactions."]})]})]})};var Y,M,V,$,G;j.parameters={...j.parameters,docs:{...(Y=j.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: () => <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Alert</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
}`,...(V=(M=j.parameters)==null?void 0:M.docs)==null?void 0:V.source},description:{story:`Default alert dialog with basic confirmation.

The most basic alert dialog implementation showing essential structure.
User must click an action button to dismiss - no ESC or click-outside closing.`,...(G=($=j.parameters)==null?void 0:$.docs)==null?void 0:G.description}}};var J,K,Q,X,Z;N.parameters={...N.parameters,docs:{...(J=N.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your account and all associated data.
            This action cannot be undone. Are you sure you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
}`,...(Q=(K=N.parameters)==null?void 0:K.docs)==null?void 0:Q.source},description:{story:`Destructive action confirmation.

Most common use case - confirming a destructive action like deletion.
Uses destructive button styling for the confirm action.`,...(Z=(X=N.parameters)==null?void 0:X.docs)==null?void 0:Z.description}}};var ee,te,oe,re,ae;w.parameters={...w.parameters,docs:{...(ee=w.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: () => <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Proceed with Caution</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-yellow-600 dark:text-yellow-500">
            ⚠️ Warning
          </AlertDialogTitle>
          <AlertDialogDescription>
            You are about to perform an action that may have unintended consequences.
            Please review your changes carefully before proceeding.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Go Back</AlertDialogCancel>
          <AlertDialogAction className="bg-yellow-600 hover:bg-yellow-700 text-white">
            I Understand, Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
}`,...(oe=(te=w.parameters)==null?void 0:te.docs)==null?void 0:oe.source},description:{story:`Warning dialog.

Alert dialog for warning users about potential issues or risks.
Uses warning colors to emphasize the cautionary nature.`,...(ae=(re=w.parameters)==null?void 0:re.docs)==null?void 0:ae.description}}};var le,ie,se,ne,ce;T.parameters={...T.parameters,docs:{...(le=T.parameters)==null?void 0:le.docs,source:{originalSource:`{
  render: () => <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Important Information</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-blue-600 dark:text-blue-500">
            ℹ️ Important Update
          </AlertDialogTitle>
          <AlertDialogDescription>
            We've updated our privacy policy. Please review the changes before
            continuing to use our service. The new policy takes effect on January 1, 2025.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Review Later</AlertDialogCancel>
          <AlertDialogAction className="bg-blue-600 hover:bg-blue-700 text-white">
            Review Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
}`,...(se=(ie=T.parameters)==null?void 0:ie.docs)==null?void 0:se.source},description:{story:`Info dialog.

Alert dialog for important information that requires user acknowledgment.
Uses informational styling.`,...(ce=(ne=T.parameters)==null?void 0:ne.docs)==null?void 0:ce.description}}};var de,ge,ue,pe,me;_.parameters={..._.parameters,docs:{...(de=_.parameters)==null?void 0:de.docs,source:{originalSource:`{
  render: () => <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="cta" style={{
        backgroundColor: '#0ec2bc',
        color: 'white'
      }}>
          Complete Setup
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-green-600 dark:text-green-500">
            ✓ Setup Complete!
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your account has been successfully configured. You can now start using
            all features of the platform. Would you like to view the quick start guide?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Skip Guide</AlertDialogCancel>
          <AlertDialogAction className="bg-green-600 hover:bg-green-700 text-white">
            View Guide
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
}`,...(ue=(ge=_.parameters)==null?void 0:ge.docs)==null?void 0:ue.source},description:{story:`Success confirmation dialog.

Alert dialog for confirming successful operations or important completions.
Uses success/green styling.`,...(me=(pe=_.parameters)==null?void 0:pe.docs)==null?void 0:me.description}}};var he,Ae,De,xe,ye;k.parameters={...k.parameters,docs:{...(he=k.parameters)==null?void 0:he.docs,source:{originalSource:`{
  render: () => <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Acknowledgment</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Terms of Service</AlertDialogTitle>
          <AlertDialogDescription>
            You must accept the terms of service to continue using this application.
            By clicking "I Accept", you agree to be bound by these terms.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>I Accept</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
}`,...(De=(Ae=k.parameters)==null?void 0:Ae.docs)==null?void 0:De.source},description:{story:`Without cancel button.

Alert dialog with only an action button - user must confirm to dismiss.
Use sparingly, only when there's truly no alternative action.`,...(ye=(xe=k.parameters)==null?void 0:xe.docs)==null?void 0:ye.description}}};var fe,ve,Ce,be,je;S.parameters={...S.parameters,docs:{...(fe=S.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  render: () => <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>View Critical Update</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[80vh]">
        <AlertDialogHeader>
          <AlertDialogTitle>Critical Security Update Required</AlertDialogTitle>
          <AlertDialogDescription>
            Please read the following important security information carefully.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="overflow-y-auto max-h-[40vh] space-y-3 text-sm my-4">
          <p>
            We have detected a critical security vulnerability that affects your account.
            Immediate action is required to protect your data.
          </p>
          <p className="font-semibold">What happened:</p>
          <p>
            A security researcher discovered a potential vulnerability in our authentication
            system that could allow unauthorized access under specific circumstances.
          </p>
          <p className="font-semibold">What we're doing:</p>
          <p>
            We have already deployed a fix to our systems and are requiring all users to
            update their passwords and enable two-factor authentication.
          </p>
          <p className="font-semibold">What you need to do:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Update your password immediately</li>
            <li>Enable two-factor authentication</li>
            <li>Review your recent account activity</li>
            <li>Update your security questions</li>
          </ul>
          <p>
            We take security very seriously and apologize for any inconvenience this may cause.
            Your data security is our top priority.
          </p>
          <p className="text-muted-foreground text-xs">
            For more information, please visit our security blog or contact our support team
            at security@example.com.
          </p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>I'll Do This Later</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Update Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
}`,...(Ce=(ve=S.parameters)==null?void 0:ve.docs)==null?void 0:Ce.source},description:{story:`Long description with scrollable content.

Alert dialog with lengthy content that requires scrolling.
Useful for detailed warnings or terms that need acknowledgment.`,...(je=(be=S.parameters)==null?void 0:be.docs)==null?void 0:je.description}}};var Ne,we,Te,_e,ke;B.parameters={...B.parameters,docs:{...(Ne=B.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
  render: () => {
    const ControlledAlertDialog = () => {
      const [open, setOpen] = useState(false);
      const [action, setAction] = useState<string | null>(null);
      const handleAction = (actionType: 'confirm' | 'cancel') => {
        setAction(actionType);
        setOpen(false);
        // Reset action after a delay
        setTimeout(() => setAction(null), 3000);
      };
      return <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => setOpen(true)}>Open Alert</Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close Alert (External)
            </Button>
          </div>
          <div className="text-sm space-y-1">
            <p className="text-muted-foreground">
              Alert is currently: <span className="font-semibold">{open ? 'Open' : 'Closed'}</span>
            </p>
            {action && <p className="text-muted-foreground">
                Last action: <span className="font-semibold">{action}</span>
              </p>}
          </div>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Controlled Alert Dialog</AlertDialogTitle>
                <AlertDialogDescription>
                  This alert dialog's state is controlled by external state.
                  The component tracks which action was taken.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground">
                  Click one of the action buttons below, and the component will track
                  which action you took.
                </p>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => handleAction('cancel')}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={() => handleAction('confirm')}>
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>;
    };
    return <ControlledAlertDialog />;
  }
}`,...(Te=(we=B.parameters)==null?void 0:we.docs)==null?void 0:Te.source},description:{story:"Controlled state alert dialog.\n\nShows how to control alert dialog open state programmatically using\nthe `open` and `onOpenChange` props.",...(ke=(_e=B.parameters)==null?void 0:_e.docs)==null?void 0:ke.description}}};var Se,Be,Ie,Oe,Ee;I.parameters={...I.parameters,docs:{...(Se=I.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button style={{
          backgroundColor: '#0ec2bc',
          color: 'white'
        }}>
            Ozean Licht Confirmation
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle style={{
            color: '#0ec2bc'
          }}>
              Confirm Your Choice
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action will update your Ozean Licht profile settings.
              Your changes will be saved immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction style={{
            backgroundColor: '#0ec2bc',
            color: 'white'
          }} className="hover:opacity-90">
              Confirm Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" style={{
          borderColor: '#0ec2bc',
          color: '#0ec2bc'
        }}>
            Ozean Licht Warning
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent style={{
        borderColor: '#0ec2bc',
        borderWidth: '2px'
      }}>
          <AlertDialogHeader>
            <AlertDialogTitle>Important Notice</AlertDialogTitle>
            <AlertDialogDescription>
              This operation will affect your Ozean Licht content library.
              Please ensure you have a backup before proceeding.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            <p className="text-sm" style={{
            color: '#0ec2bc'
          }}>
              💡 Pro Tip: You can restore from backups in your account settings.
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction style={{
            backgroundColor: '#0ec2bc',
            color: 'white'
          }} className="hover:opacity-90">
              I Have a Backup
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete with Ozean Licht Theme</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Delete Content
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the selected content from Ozean Licht.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-3 px-4 rounded-md border-2 my-2" style={{
          borderColor: '#0ec2bc',
          backgroundColor: '#0ec2bc10'
        }}>
            <p className="text-sm font-medium" style={{
            color: '#0ec2bc'
          }}>
              Alternative: Archive Instead
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Consider archiving this content instead of deleting it permanently.
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
}`,...(Ie=(Be=I.parameters)==null?void 0:Be.docs)==null?void 0:Ie.source},description:{story:`Ozean Licht themed alert dialogs.

Alert dialogs showcasing the Ozean Licht turquoise color (#0ec2bc).
Demonstrates how to apply branding to alert dialogs.`,...(Ee=(Oe=I.parameters)==null?void 0:Oe.docs)==null?void 0:Ee.description}}};var Pe,Fe,Re,We,He;O.parameters={...O.parameters,docs:{...(Pe=O.parameters)==null?void 0:Pe.docs,source:{originalSource:`{
  render: () => <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Unsaved Changes</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes. What would you like to do?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:flex-col sm:space-x-0 gap-2">
          <AlertDialogAction className="bg-green-600 hover:bg-green-700 text-white sm:w-full">
            Save Changes
          </AlertDialogAction>
          <AlertDialogAction className="bg-muted hover:bg-muted/80 text-foreground sm:w-full">
            Discard Changes
          </AlertDialogAction>
          <AlertDialogCancel className="sm:w-full">
            Continue Editing
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
}`,...(Re=(Fe=O.parameters)==null?void 0:Fe.docs)==null?void 0:Re.source},description:{story:`Multiple action buttons.

Alert dialog with multiple action choices beyond simple confirm/cancel.
Shows how to provide users with multiple options.`,...(He=(We=O.parameters)==null?void 0:We.docs)==null?void 0:He.description}}};var Ue,Le,qe,ze,Ye;E.parameters={...E.parameters,docs:{...(Ue=E.parameters)==null?void 0:Ue.docs,source:{originalSource:`{
  render: () => <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Show Explicit Structure</Button>
      </AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Explicit Structure</AlertDialogTitle>
            <AlertDialogDescription>
              This alert dialog explicitly shows AlertDialogPortal and
              AlertDialogOverlay usage, though AlertDialogContent includes
              them automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              In most cases, you don't need to use AlertDialogPortal and
              AlertDialogOverlay directly - AlertDialogContent handles them for you.
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
}`,...(qe=(Le=E.parameters)==null?void 0:Le.docs)==null?void 0:qe.source},description:{story:`Explicit structure demonstration.

Shows the explicit use of AlertDialogPortal and AlertDialogOverlay
(though they're automatically included in AlertDialogContent).`,...(Ye=(ze=E.parameters)==null?void 0:ze.docs)==null?void 0:Ye.description}}};var Me,Ve,$e,Ge,Je;P.parameters={...P.parameters,docs:{...(Me=P.parameters)==null?void 0:Me.docs,source:{originalSource:`{
  render: () => <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button data-testid="open-alert">Open Alert Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent data-testid="alert-content">
        <AlertDialogHeader>
          <AlertDialogTitle>Test Alert Dialog</AlertDialogTitle>
          <AlertDialogDescription>
            This alert dialog tests that user must take explicit action to dismiss.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Try pressing ESC or clicking outside - the dialog should remain open.
            You must click Cancel or Confirm to close.
          </p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel data-testid="cancel-button">Cancel</AlertDialogCancel>
          <AlertDialogAction data-testid="confirm-button">Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    // Click trigger to open alert dialog
    const trigger = canvas.getByTestId('open-alert');
    await userEvent.click(trigger);

    // Wait for alert dialog to open
    await new Promise(resolve => setTimeout(resolve, 200));

    // Alert dialog should be visible
    const alertContent = body.getByTestId('alert-content');
    await expect(alertContent).toBeInTheDocument();

    // Verify confirm button exists
    const confirmButton = body.getByTestId('confirm-button');
    await expect(confirmButton).toBeInTheDocument();

    // Click cancel button to close
    const cancelButton = body.getByTestId('cancel-button');
    await userEvent.click(cancelButton);

    // Wait for alert dialog to close
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}`,...($e=(Ve=P.parameters)==null?void 0:Ve.docs)==null?void 0:$e.source},description:{story:`Interactive test with play function.

Tests alert dialog open/close and keyboard navigation using Storybook interactions.
Validates that alert dialog requires explicit action (no ESC or click-outside closing).`,...(Je=(Ge=P.parameters)==null?void 0:Ge.docs)==null?void 0:Je.description}}};var Ke,Qe,Xe,Ze,et;F.parameters={...F.parameters,docs:{...(Ke=F.parameters)==null?void 0:Ke.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 p-6 max-w-4xl">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">When to Use Each Component</h3>
        <p className="text-sm text-muted-foreground">
          Choose the right modal component based on your use case.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4 p-4 border rounded-lg">
          <h4 className="font-semibold text-destructive">Use AlertDialog for:</h4>
          <ul className="text-sm space-y-2 list-disc list-inside">
            <li>Destructive actions (delete, remove)</li>
            <li>Critical warnings</li>
            <li>Confirmations that can't be ignored</li>
            <li>Actions requiring explicit user response</li>
          </ul>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                Example: Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. All your data will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="space-y-4 p-4 border rounded-lg">
          <h4 className="font-semibold" style={{
          color: '#0ec2bc'
        }}>Use Dialog for:</h4>
          <ul className="text-sm space-y-2 list-disc list-inside">
            <li>Forms and data entry</li>
            <li>Settings and preferences</li>
            <li>Detail views</li>
            <li>Non-critical information</li>
          </ul>
          <p className="text-sm text-muted-foreground pt-2">
            See dialog.stories.tsx for Dialog examples.
          </p>
        </div>
      </div>

      <div className="p-4 bg-muted rounded-lg space-y-2">
        <h4 className="font-semibold text-sm">Key Difference:</h4>
        <p className="text-sm">
          <strong>AlertDialog</strong> requires explicit user action (must click confirm/cancel).
          User cannot dismiss by pressing ESC or clicking outside.
        </p>
        <p className="text-sm">
          <strong>Dialog</strong> can be dismissed multiple ways (ESC, click outside, close button).
          More flexible for non-critical interactions.
        </p>
      </div>
    </div>
}`,...(Xe=(Qe=F.parameters)==null?void 0:Qe.docs)==null?void 0:Xe.source},description:{story:`Comparison with Dialog.

Side-by-side comparison showing when to use AlertDialog vs Dialog.
This is educational to help developers choose the right component.`,...(et=(Ze=F.parameters)==null?void 0:Ze.docs)==null?void 0:et.description}}};const Do=["Default","DestructiveAction","WarningDialog","InfoDialog","SuccessConfirmation","WithoutCancel","LongDescription","ControlledState","OzeanLichtThemed","MultipleActions","ExplicitStructure","InteractiveTest","ComparisonWithDialog"];export{F as ComparisonWithDialog,B as ControlledState,j as Default,N as DestructiveAction,E as ExplicitStructure,T as InfoDialog,P as InteractiveTest,S as LongDescription,O as MultipleActions,I as OzeanLichtThemed,_ as SuccessConfirmation,w as WarningDialog,k as WithoutCancel,Do as __namedExportsOrder,Ao as default};
