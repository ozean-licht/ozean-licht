import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{r as B}from"./index-B2-qRKKC.js";import{c as Ve}from"./index-Dp3B9jqt.js";import{a as ke,C as Ae,b as Ie,D as ze}from"./index-Bir9vGUy.js";import{D as qe,a as Ee,g as We,h as Pe,i as Me}from"./dialog-CsJFWyoR.js";import{c as p}from"./cn-CKXzwFwe.js";import{X as Re}from"./x-C2AjwpVd.js";import{B as a}from"./Button-PgnE6Xyj.js";import{I as b}from"./Input-C2o_RQ9B.js";import{L as w}from"./label-BZCfx7Ud.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./clsx-B-dksMZM.js";import"./index-BiUY2kQP.js";import"./index-kS-9iBlu.js";import"./index-BFjtS4uE.js";import"./index-CpxwHbl5.js";import"./index-D1vk04JX.js";import"./index-BlCrtW8-.js";import"./index-BVCCCNF7.js";import"./index-ciuW_uyV.js";import"./index-BIMsXDgJ.js";import"./index-B7rHuW0e.js";import"./index-PNzqWif7.js";import"./createLucideIcon-BbF4D6Jl.js";import"./button-DhHHw9VN.js";import"./index-BiMR7eR1.js";import"./input-BK5gJSzh.js";import"./textarea-B_02bPEu.js";import"./index-B5oyz0SX.js";const r=qe,l=Ee,H=Pe,m=We,$e=Ve("fixed inset-0 z-50 bg-black/80 backdrop-blur-sm",{variants:{cosmic:{true:"bg-gradient-to-br from-black/90 via-[var(--primary)]/5 to-black/90",false:"bg-black/80"}},defaultVariants:{cosmic:!1}}),_=B.forwardRef(({className:i,cosmic:c,...g},F)=>e.jsx(Me,{ref:F,className:p($e({cosmic:c}),i),...g}));_.displayName="DialogOverlay";const Ue=Ve(["fixed left-[50%] top-[50%] z-50","translate-x-[-50%] translate-y-[-50%]","grid w-full max-w-lg gap-4 p-6","duration-200","data-[state=open]:animate-in data-[state=closed]:animate-out","data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0","data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95","data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]","data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]","sm:rounded-lg"].join(" "),{variants:{variant:{default:"glass-card-strong",glass:"glass-card",solid:"bg-[var(--card)] border border-[var(--border)]"},glow:{true:"glow",false:""}},defaultVariants:{variant:"default",glow:!1}}),o=B.forwardRef(({className:i,variant:c,glow:g,cosmic:F=!1,children:Oe,...Le},Ge)=>e.jsxs(H,{children:[e.jsx(_,{cosmic:F}),e.jsxs(ke,{ref:Ge,className:p(Ue({variant:c,glow:g}),i),...Le,children:[Oe,e.jsxs(Ae,{className:p("absolute right-4 top-4 rounded-sm","opacity-70 transition-opacity hover:opacity-100","ring-offset-[var(--background)]","focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2","disabled:pointer-events-none","data-[state=open]:bg-[var(--accent)] data-[state=open]:text-[var(--muted-foreground)]"),children:[e.jsx(Re,{className:"h-4 w-4"}),e.jsx("span",{className:"sr-only",children:"Close"})]})]})]}));o.displayName="DialogContent";const t=({className:i,...c})=>e.jsx("div",{className:p("flex flex-col space-y-2 text-center sm:text-left",i),...c});t.displayName="DialogHeader";const d=({className:i,...c})=>e.jsx("div",{className:p("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2",i),...c});d.displayName="DialogFooter";const s=B.forwardRef(({className:i,...c},g)=>e.jsx(Ie,{ref:g,className:p("font-sans text-xl md:text-2xl font-normal leading-none tracking-tight","text-[var(--foreground)]",i),...c}));s.displayName="DialogTitle";const n=B.forwardRef(({className:i,...c},g)=>e.jsx(ze,{ref:g,className:p("text-sm text-[var(--muted-foreground)]",i),...c}));n.displayName="DialogDescription";try{r.displayName="Dialog",r.__docgenInfo={description:"",displayName:"Dialog",props:{}}}catch{}try{l.displayName="DialogTrigger",l.__docgenInfo={description:"",displayName:"DialogTrigger",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{H.displayName="DialogPortal",H.__docgenInfo={description:"",displayName:"DialogPortal",props:{}}}catch{}try{_.displayName="DialogOverlay",_.__docgenInfo={description:"",displayName:"DialogOverlay",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}},cosmic:{defaultValue:{value:"false"},description:"",name:"cosmic",required:!1,type:{name:"boolean | null"}}}}}catch{}try{m.displayName="DialogClose",m.__docgenInfo={description:"",displayName:"DialogClose",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{o.displayName="DialogContent",o.__docgenInfo={description:"",displayName:"DialogContent",props:{cosmic:{defaultValue:{value:"false"},description:"Apply cosmic backdrop",name:"cosmic",required:!1,type:{name:"boolean"}},asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}},variant:{defaultValue:null,description:"",name:"variant",required:!1,type:{name:'"default" | "glass" | "solid" | null'}},glow:{defaultValue:null,description:"",name:"glow",required:!1,type:{name:"boolean | null"}}}}}catch{}try{t.displayName="DialogHeader",t.__docgenInfo={description:"",displayName:"DialogHeader",props:{}}}catch{}try{d.displayName="DialogFooter",d.__docgenInfo={description:"",displayName:"DialogFooter",props:{}}}catch{}try{s.displayName="DialogTitle",s.__docgenInfo={description:"",displayName:"DialogTitle",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}try{n.displayName="DialogDescription",n.__docgenInfo={description:"",displayName:"DialogDescription",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}const Na={title:"Tier 2: Branded/Dialog",component:r,parameters:{layout:"centered",docs:{description:{component:"Ozean Licht branded dialog with glass morphism effects, extending shadcn Dialog primitive."}}},tags:["autodocs"]},u={render:()=>e.jsxs(r,{children:[e.jsx(l,{asChild:!0,children:e.jsx(a,{variant:"outline",children:"Open Dialog"})}),e.jsxs(o,{children:[e.jsxs(t,{children:[e.jsx(s,{children:"Ozean Licht Dialog"}),e.jsx(n,{children:"This is a branded dialog with glass morphism effects and cosmic theme."})]}),e.jsx("div",{className:"py-4",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"Dialog content goes here. This dialog uses the default glass morphism variant."})})]})]})},h={render:()=>e.jsxs(r,{children:[e.jsx(l,{asChild:!0,children:e.jsx(a,{children:"Glass Dialog"})}),e.jsxs(o,{variant:"glass",children:[e.jsxs(t,{children:[e.jsx(s,{children:"Glass Variant"}),e.jsx(n,{children:"Lighter glass morphism effect for subtle modals."})]}),e.jsx("div",{className:"py-4",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"This variant has a more transparent glass effect."})})]})]})},D={render:()=>e.jsxs(r,{children:[e.jsx(l,{asChild:!0,children:e.jsx(a,{variant:"secondary",children:"Solid Dialog"})}),e.jsxs(o,{variant:"solid",children:[e.jsxs(t,{children:[e.jsx(s,{children:"Solid Variant"}),e.jsx(n,{children:"No transparency for better readability in bright contexts."})]}),e.jsx("div",{className:"py-4",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"This variant has a solid background without glass effects."})})]})]})},x={render:()=>e.jsxs(r,{children:[e.jsx(l,{asChild:!0,children:e.jsx(a,{variant:"cta",glow:!0,children:"Open Glowing Dialog"})}),e.jsxs(o,{glow:!0,children:[e.jsxs(t,{children:[e.jsx(s,{children:"Glowing Dialog"}),e.jsx(n,{children:"Dialog with turquoise glow effect for emphasis."})]}),e.jsx("div",{className:"py-4",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"This dialog has a subtle glow effect around its border."})})]})]})},f={render:()=>e.jsxs(r,{children:[e.jsx(l,{asChild:!0,children:e.jsx(a,{variant:"cta",children:"Open Cosmic Dialog"})}),e.jsxs(o,{cosmic:!0,glow:!0,children:[e.jsxs(t,{children:[e.jsx(s,{children:"Cosmic Experience"}),e.jsx(n,{children:"Full cosmic theme with gradient overlay and glow effects."})]}),e.jsx("div",{className:"py-4",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"This dialog features the cosmic gradient overlay backdrop for the ultimate Ozean Licht experience."})})]})]})},v={render:()=>e.jsxs(r,{children:[e.jsx(l,{asChild:!0,children:e.jsx(a,{children:"Edit Profile"})}),e.jsxs(o,{children:[e.jsxs(t,{children:[e.jsx(s,{children:"Edit profile"}),e.jsx(n,{children:"Make changes to your profile here. Click save when you're done."})]}),e.jsxs("div",{className:"grid gap-4 py-4",children:[e.jsxs("div",{className:"grid grid-cols-4 items-center gap-4",children:[e.jsx(w,{htmlFor:"name",className:"text-right",children:"Name"}),e.jsx(b,{id:"name",value:"Maria Schneider",className:"col-span-3"})]}),e.jsxs("div",{className:"grid grid-cols-4 items-center gap-4",children:[e.jsx(w,{htmlFor:"email",className:"text-right",children:"Email"}),e.jsx(b,{id:"email",value:"maria@ozean-licht.dev",className:"col-span-3"})]})]}),e.jsxs(d,{children:[e.jsx(m,{asChild:!0,children:e.jsx(a,{variant:"ghost",children:"Cancel"})}),e.jsx(a,{variant:"primary",children:"Save changes"})]})]})]})},y={render:()=>e.jsxs(r,{children:[e.jsx(l,{asChild:!0,children:e.jsx(a,{variant:"destructive",children:"Delete Account"})}),e.jsxs(o,{children:[e.jsxs(t,{children:[e.jsx(s,{children:"Are you absolutely sure?"}),e.jsx(n,{children:"This action cannot be undone. This will permanently delete your account and remove your data from our servers."})]}),e.jsxs(d,{children:[e.jsx(m,{asChild:!0,children:e.jsx(a,{variant:"outline",children:"Cancel"})}),e.jsx(a,{variant:"destructive",children:"Delete Account"})]})]})]})},j={render:()=>e.jsxs(r,{children:[e.jsx(l,{asChild:!0,children:e.jsx(a,{variant:"cta",children:"Create Course"})}),e.jsxs(o,{className:"sm:max-w-[525px]",children:[e.jsxs(t,{children:[e.jsx(s,{children:"Create new course"}),e.jsx(n,{children:"Add a new course to your platform. Click create when you're done."})]}),e.jsxs("div",{className:"grid gap-4 py-4",children:[e.jsxs("div",{className:"grid gap-2",children:[e.jsx(w,{htmlFor:"course-name",children:"Course name"}),e.jsx(b,{id:"course-name",placeholder:"Introduction to Meditation"})]}),e.jsxs("div",{className:"grid gap-2",children:[e.jsx(w,{htmlFor:"course-description",children:"Description"}),e.jsx(b,{id:"course-description",placeholder:"A brief description of your course"})]}),e.jsxs("div",{className:"grid gap-2",children:[e.jsx(w,{htmlFor:"course-duration",children:"Duration (hours)"}),e.jsx(b,{id:"course-duration",type:"number",placeholder:"8"})]})]}),e.jsxs(d,{children:[e.jsx(m,{asChild:!0,children:e.jsx(a,{variant:"outline",children:"Cancel"})}),e.jsx(a,{variant:"cta",children:"Create Course"})]})]})]})},C={render:()=>e.jsxs(r,{children:[e.jsx(l,{asChild:!0,children:e.jsx(a,{variant:"cta",glow:!0,children:"Complete Enrollment"})}),e.jsxs(o,{glow:!0,children:[e.jsxs(t,{children:[e.jsx(s,{className:"text-[var(--primary)]",children:"Enrollment Successful!"}),e.jsx(n,{children:"You have been successfully enrolled in the course. A confirmation email has been sent to your inbox."})]}),e.jsx(d,{children:e.jsx(a,{variant:"cta",children:"View Course"})})]})]})},N={render:()=>e.jsxs(r,{children:[e.jsx(l,{asChild:!0,children:e.jsx(a,{children:"View Terms"})}),e.jsxs(o,{className:"max-h-[80vh]",children:[e.jsxs(t,{children:[e.jsx(s,{children:"Terms and Conditions"}),e.jsx(n,{children:"Please read our terms and conditions carefully."})]}),e.jsxs("div",{className:"overflow-y-auto max-h-[50vh] space-y-4 text-sm",children:[e.jsx("p",{children:"Welcome to Ozean Licht. By accessing our platform, you agree to be bound by these terms and conditions."}),e.jsx("p",{children:"Our services are designed to provide educational content and spiritual guidance through various courses, workshops, and community features."}),e.jsx("p",{children:"All content on the platform is protected by copyright and may not be reproduced without explicit permission from Ozean Licht."}),e.jsx("p",{children:"Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account."}),e.jsx("p",{children:"We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of any modifications."}),e.jsx("p",{children:"For questions about these terms, please contact us at support@ozean-licht.dev"})]}),e.jsxs(d,{children:[e.jsx(m,{asChild:!0,children:e.jsx(a,{variant:"outline",children:"Decline"})}),e.jsx(a,{variant:"primary",children:"Accept"})]})]})]})},T={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-4 p-4",children:[e.jsxs(r,{children:[e.jsx(l,{asChild:!0,children:e.jsx(a,{variant:"primary",children:"Default"})}),e.jsx(o,{children:e.jsxs(t,{children:[e.jsx(s,{children:"Default Variant"}),e.jsx(n,{children:"Glass morphism strong"})]})})]}),e.jsxs(r,{children:[e.jsx(l,{asChild:!0,children:e.jsx(a,{variant:"secondary",children:"Glass"})}),e.jsx(o,{variant:"glass",children:e.jsxs(t,{children:[e.jsx(s,{children:"Glass Variant"}),e.jsx(n,{children:"Lighter glass effect"})]})})]}),e.jsxs(r,{children:[e.jsx(l,{asChild:!0,children:e.jsx(a,{variant:"outline",children:"Solid"})}),e.jsx(o,{variant:"solid",children:e.jsxs(t,{children:[e.jsx(s,{children:"Solid Variant"}),e.jsx(n,{children:"No transparency"})]})})]}),e.jsxs(r,{children:[e.jsx(l,{asChild:!0,children:e.jsx(a,{variant:"cta",children:"Glow"})}),e.jsx(o,{glow:!0,children:e.jsxs(t,{children:[e.jsx(s,{children:"With Glow"}),e.jsx(n,{children:"Turquoise glow effect"})]})})]}),e.jsxs(r,{children:[e.jsx(l,{asChild:!0,children:e.jsx(a,{variant:"cta",glow:!0,children:"Cosmic"})}),e.jsx(o,{cosmic:!0,glow:!0,children:e.jsxs(t,{children:[e.jsx(s,{children:"Cosmic Overlay"}),e.jsx(n,{children:"Full cosmic experience"})]})})]})]}),parameters:{layout:"padded"}};var S,V,O,L,G;u.parameters={...u.parameters,docs:{...(S=u.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ozean Licht Dialog</DialogTitle>
          <DialogDescription>
            This is a branded dialog with glass morphism effects and cosmic theme.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Dialog content goes here. This dialog uses the default glass morphism variant.
          </p>
        </div>
      </DialogContent>
    </Dialog>
}`,...(O=(V=u.parameters)==null?void 0:V.docs)==null?void 0:O.source},description:{story:"Default dialog with glass morphism",...(G=(L=u.parameters)==null?void 0:L.docs)==null?void 0:G.description}}};var k,A,I,z,q;h.parameters={...h.parameters,docs:{...(k=h.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button>Glass Dialog</Button>
      </DialogTrigger>
      <DialogContent variant="glass">
        <DialogHeader>
          <DialogTitle>Glass Variant</DialogTitle>
          <DialogDescription>
            Lighter glass morphism effect for subtle modals.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            This variant has a more transparent glass effect.
          </p>
        </div>
      </DialogContent>
    </Dialog>
}`,...(I=(A=h.parameters)==null?void 0:A.docs)==null?void 0:I.source},description:{story:"Glass variant with lighter effect",...(q=(z=h.parameters)==null?void 0:z.docs)==null?void 0:q.description}}};var E,W,P,M,R;D.parameters={...D.parameters,docs:{...(E=D.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Solid Dialog</Button>
      </DialogTrigger>
      <DialogContent variant="solid">
        <DialogHeader>
          <DialogTitle>Solid Variant</DialogTitle>
          <DialogDescription>
            No transparency for better readability in bright contexts.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            This variant has a solid background without glass effects.
          </p>
        </div>
      </DialogContent>
    </Dialog>
}`,...(P=(W=D.parameters)==null?void 0:W.docs)==null?void 0:P.source},description:{story:"Solid variant without transparency",...(R=(M=D.parameters)==null?void 0:M.docs)==null?void 0:R.description}}};var $,U,Y,X,J;x.parameters={...x.parameters,docs:{...($=x.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button variant="cta" glow>
          Open Glowing Dialog
        </Button>
      </DialogTrigger>
      <DialogContent glow>
        <DialogHeader>
          <DialogTitle>Glowing Dialog</DialogTitle>
          <DialogDescription>
            Dialog with turquoise glow effect for emphasis.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            This dialog has a subtle glow effect around its border.
          </p>
        </div>
      </DialogContent>
    </Dialog>
}`,...(Y=(U=x.parameters)==null?void 0:U.docs)==null?void 0:Y.source},description:{story:"Dialog with glow effect",...(J=(X=x.parameters)==null?void 0:X.docs)==null?void 0:J.description}}};var K,Q,Z,ee,ae;f.parameters={...f.parameters,docs:{...(K=f.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button variant="cta">Open Cosmic Dialog</Button>
      </DialogTrigger>
      <DialogContent cosmic glow>
        <DialogHeader>
          <DialogTitle>Cosmic Experience</DialogTitle>
          <DialogDescription>
            Full cosmic theme with gradient overlay and glow effects.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            This dialog features the cosmic gradient overlay backdrop for the ultimate Ozean Licht experience.
          </p>
        </div>
      </DialogContent>
    </Dialog>
}`,...(Z=(Q=f.parameters)==null?void 0:Q.docs)==null?void 0:Z.source},description:{story:"Dialog with cosmic overlay",...(ae=(ee=f.parameters)==null?void 0:ee.docs)==null?void 0:ae.description}}};var ie,re,oe,te,se;v.parameters={...v.parameters,docs:{...(ie=v.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Maria Schneider" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" value="maria@ozean-licht.dev" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button variant="primary">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}`,...(oe=(re=v.parameters)==null?void 0:re.docs)==null?void 0:oe.source},description:{story:"Dialog with footer actions",...(se=(te=v.parameters)==null?void 0:te.docs)==null?void 0:se.description}}};var ne,le,ce,de,ge;y.parameters={...y.parameters,docs:{...(ne=y.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive">Delete Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}`,...(ce=(le=y.parameters)==null?void 0:le.docs)==null?void 0:ce.source},description:{story:"Confirmation dialog",...(ge=(de=y.parameters)==null?void 0:de.docs)==null?void 0:ge.description}}};var pe,me,ue,he,De;j.parameters={...j.parameters,docs:{...(pe=j.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button variant="cta">Create Course</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create new course</DialogTitle>
          <DialogDescription>
            Add a new course to your platform. Click create when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="course-name">Course name</Label>
            <Input id="course-name" placeholder="Introduction to Meditation" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="course-description">Description</Label>
            <Input id="course-description" placeholder="A brief description of your course" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="course-duration">Duration (hours)</Label>
            <Input id="course-duration" type="number" placeholder="8" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="cta">Create Course</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}`,...(ue=(me=j.parameters)==null?void 0:me.docs)==null?void 0:ue.source},description:{story:"Form dialog example",...(De=(he=j.parameters)==null?void 0:he.docs)==null?void 0:De.description}}};var xe,fe,ve,ye,je;C.parameters={...C.parameters,docs:{...(xe=C.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button variant="cta" glow>
          Complete Enrollment
        </Button>
      </DialogTrigger>
      <DialogContent glow>
        <DialogHeader>
          <DialogTitle className="text-[var(--primary)]">Enrollment Successful!</DialogTitle>
          <DialogDescription>
            You have been successfully enrolled in the course.
            A confirmation email has been sent to your inbox.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="cta">View Course</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}`,...(ve=(fe=C.parameters)==null?void 0:fe.docs)==null?void 0:ve.source},description:{story:"Success notification dialog",...(je=(ye=C.parameters)==null?void 0:ye.docs)==null?void 0:je.description}}};var Ce,Ne,Te,be,we;N.parameters={...N.parameters,docs:{...(Ce=N.parameters)==null?void 0:Ce.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button>View Terms</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Please read our terms and conditions carefully.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[50vh] space-y-4 text-sm">
          <p>
            Welcome to Ozean Licht. By accessing our platform, you agree to be bound by these terms and conditions.
          </p>
          <p>
            Our services are designed to provide educational content and spiritual guidance
            through various courses, workshops, and community features.
          </p>
          <p>
            All content on the platform is protected by copyright and may not be reproduced
            without explicit permission from Ozean Licht.
          </p>
          <p>
            Users are responsible for maintaining the confidentiality of their account
            information and for all activities that occur under their account.
          </p>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the
            platform constitutes acceptance of any modifications.
          </p>
          <p>
            For questions about these terms, please contact us at support@ozean-licht.dev
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Decline</Button>
          </DialogClose>
          <Button variant="primary">Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}`,...(Te=(Ne=N.parameters)==null?void 0:Ne.docs)==null?void 0:Te.source},description:{story:"Scrollable content dialog",...(we=(be=N.parameters)==null?void 0:be.docs)==null?void 0:we.description}}};var _e,Be,Fe,He,Se;T.parameters={...T.parameters,docs:{...(_e=T.parameters)==null?void 0:_e.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-4 p-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="primary">Default</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Default Variant</DialogTitle>
            <DialogDescription>Glass morphism strong</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Glass</Button>
        </DialogTrigger>
        <DialogContent variant="glass">
          <DialogHeader>
            <DialogTitle>Glass Variant</DialogTitle>
            <DialogDescription>Lighter glass effect</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Solid</Button>
        </DialogTrigger>
        <DialogContent variant="solid">
          <DialogHeader>
            <DialogTitle>Solid Variant</DialogTitle>
            <DialogDescription>No transparency</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="cta">Glow</Button>
        </DialogTrigger>
        <DialogContent glow>
          <DialogHeader>
            <DialogTitle>With Glow</DialogTitle>
            <DialogDescription>Turquoise glow effect</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="cta" glow>
            Cosmic
          </Button>
        </DialogTrigger>
        <DialogContent cosmic glow>
          <DialogHeader>
            <DialogTitle>Cosmic Overlay</DialogTitle>
            <DialogDescription>Full cosmic experience</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>,
  parameters: {
    layout: 'padded'
  }
}`,...(Fe=(Be=T.parameters)==null?void 0:Be.docs)==null?void 0:Fe.source},description:{story:"All variants showcase",...(Se=(He=T.parameters)==null?void 0:He.docs)==null?void 0:Se.description}}};const Ta=["Default","GlassVariant","SolidVariant","WithGlow","CosmicOverlay","WithFooter","Confirmation","FormDialog","SuccessDialog","ScrollableContent","AllVariants"];export{T as AllVariants,y as Confirmation,f as CosmicOverlay,u as Default,j as FormDialog,h as GlassVariant,N as ScrollableContent,D as SolidVariant,C as SuccessDialog,v as WithFooter,x as WithGlow,Ta as __namedExportsOrder,Na as default};
