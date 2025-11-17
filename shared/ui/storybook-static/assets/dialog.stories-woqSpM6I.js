import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{w as F,u as N,e as Ke}from"./index-CJu6nLMj.js";import{r as Xe}from"./index-B2-qRKKC.js";import{D as o,a as n,b as t,c as a,d as r,e as s,f as c,g as l,h as _e,i as $e}from"./dialog-CsJFWyoR.js";import{B as i}from"./button-DhHHw9VN.js";import{L as w}from"./label-BZCfx7Ud.js";import{I as g}from"./input-BK5gJSzh.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-Bir9vGUy.js";import"./index-BiUY2kQP.js";import"./index-kS-9iBlu.js";import"./index-BFjtS4uE.js";import"./index-CpxwHbl5.js";import"./index-D1vk04JX.js";import"./index-BlCrtW8-.js";import"./index-BVCCCNF7.js";import"./index-ciuW_uyV.js";import"./index-BIMsXDgJ.js";import"./index-B7rHuW0e.js";import"./index-PNzqWif7.js";import"./cn-CKXzwFwe.js";import"./clsx-B-dksMZM.js";import"./x-C2AjwpVd.js";import"./createLucideIcon-BbF4D6Jl.js";import"./index-BiMR7eR1.js";import"./index-Dp3B9jqt.js";import"./index-B5oyz0SX.js";const Ti={title:"Tier 1: Primitives/shadcn/Dialog",component:o,parameters:{layout:"centered",docs:{description:{component:"A window overlaid on either the primary window or another dialog window, rendering the content underneath inert. Built on Radix UI Dialog primitive."}}},tags:["autodocs"]},u={render:()=>e.jsxs(o,{children:[e.jsx(n,{asChild:!0,children:e.jsx(i,{variant:"outline",children:"Open Dialog"})}),e.jsx(t,{children:e.jsxs(a,{children:[e.jsx(r,{children:"Are you absolutely sure?"}),e.jsx(s,{children:"This action cannot be undone. This will permanently delete your account and remove your data from our servers."})]})})]})},p={render:()=>e.jsxs(o,{children:[e.jsx(n,{asChild:!0,children:e.jsx(i,{children:"Edit Profile"})}),e.jsxs(t,{children:[e.jsxs(a,{children:[e.jsx(r,{children:"Edit profile"}),e.jsx(s,{children:"Make changes to your profile here. Click save when you're done."})]}),e.jsxs("div",{className:"grid gap-4 py-4",children:[e.jsxs("div",{className:"grid grid-cols-4 items-center gap-4",children:[e.jsx(w,{htmlFor:"name",className:"text-right",children:"Name"}),e.jsx(g,{id:"name",defaultValue:"Pedro Duarte",className:"col-span-3"})]}),e.jsxs("div",{className:"grid grid-cols-4 items-center gap-4",children:[e.jsx(w,{htmlFor:"username",className:"text-right",children:"Username"}),e.jsx(g,{id:"username",defaultValue:"@peduarte",className:"col-span-3"})]})]}),e.jsx(c,{children:e.jsx(i,{type:"submit",children:"Save changes"})})]})]})},m={render:()=>e.jsxs(o,{children:[e.jsx(n,{asChild:!0,children:e.jsx(i,{variant:"destructive",children:"Delete Account"})}),e.jsxs(t,{children:[e.jsxs(a,{children:[e.jsx(r,{children:"Are you absolutely sure?"}),e.jsx(s,{children:"This action cannot be undone. This will permanently delete your account and remove your data from our servers."})]}),e.jsxs(c,{children:[e.jsx(l,{asChild:!0,children:e.jsx(i,{variant:"outline",children:"Cancel"})}),e.jsx(i,{variant:"destructive",children:"Delete Account"})]})]})]})},h={render:()=>e.jsxs(o,{children:[e.jsx(n,{asChild:!0,children:e.jsx(i,{children:"Create Project"})}),e.jsxs(t,{className:"sm:max-w-[525px]",children:[e.jsxs(a,{children:[e.jsx(r,{children:"Create new project"}),e.jsx(s,{children:"Add a new project to your workspace. Click create when you're done."})]}),e.jsxs("div",{className:"grid gap-4 py-4",children:[e.jsxs("div",{className:"grid gap-2",children:[e.jsx(w,{htmlFor:"project-name",children:"Project name"}),e.jsx(g,{id:"project-name",placeholder:"My Awesome Project"})]}),e.jsxs("div",{className:"grid gap-2",children:[e.jsx(w,{htmlFor:"project-description",children:"Description"}),e.jsx(g,{id:"project-description",placeholder:"A brief description of your project"})]}),e.jsxs("div",{className:"grid gap-2",children:[e.jsx(w,{htmlFor:"project-url",children:"Repository URL"}),e.jsx(g,{id:"project-url",type:"url",placeholder:"https://github.com/username/repo"})]})]}),e.jsxs(c,{children:[e.jsx(l,{asChild:!0,children:e.jsx(i,{variant:"outline",children:"Cancel"})}),e.jsx(i,{type:"submit",children:"Create Project"})]})]})]})},D={render:()=>e.jsxs(o,{children:[e.jsx(n,{asChild:!0,children:e.jsx(i,{variant:"default",style:{backgroundColor:"var(--primary)",color:"white"},children:"Complete Payment"})}),e.jsxs(t,{children:[e.jsxs(a,{children:[e.jsx(r,{style:{color:"var(--primary)"},children:"Payment Successful!"}),e.jsx(s,{children:"Your payment of $99.00 has been processed successfully. A confirmation email has been sent to your inbox."})]}),e.jsx(c,{children:e.jsx(i,{style:{backgroundColor:"var(--primary)",color:"white"},children:"View Receipt"})})]})]})},x={render:()=>{const S=()=>{const[B,d]=Xe.useState(!1);return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsx(i,{onClick:()=>d(!0),children:"Open Dialog"}),e.jsx(i,{variant:"outline",onClick:()=>d(!1),children:"Close Dialog (External)"})]}),e.jsxs("p",{className:"text-sm text-muted-foreground",children:["Dialog is currently: ",B?"Open":"Closed"]}),e.jsx(o,{open:B,onOpenChange:d,children:e.jsxs(t,{children:[e.jsxs(a,{children:[e.jsx(r,{children:"Controlled Dialog"}),e.jsx(s,{children:"This dialog's state is controlled by external state. You can open/close it programmatically."})]}),e.jsx("div",{className:"py-4",children:e.jsx("p",{className:"text-sm",children:"Use the buttons above to control this dialog, or use the built-in close button (X) or click outside to close."})}),e.jsx(c,{children:e.jsx(i,{onClick:()=>d(!1),children:"Close"})})]})})]})};return e.jsx(S,{})}},j={render:()=>e.jsxs(o,{children:[e.jsx(n,{asChild:!0,children:e.jsx(i,{children:"Open Dialog"})}),e.jsxs(t,{children:[e.jsxs(a,{children:[e.jsx(r,{children:"Custom Close Buttons"}),e.jsx(s,{children:"Any element wrapped with DialogClose will close the dialog when clicked."})]}),e.jsxs("div",{className:"py-4 space-y-3",children:[e.jsx(l,{asChild:!0,children:e.jsx("button",{className:"w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm",children:"Custom Button (closes dialog)"})}),e.jsx(l,{asChild:!0,children:e.jsx("div",{className:"w-full px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md text-sm cursor-pointer text-center",children:"Div as close button"})}),e.jsx(l,{asChild:!0,children:e.jsx("a",{href:"#",className:"block w-full px-4 py-2 bg-green-50 hover:bg-green-100 rounded-md text-sm text-center",children:"Link as close button"})})]})]})]})},y={render:()=>e.jsxs(o,{children:[e.jsx(n,{asChild:!0,children:e.jsx(i,{children:"View Terms"})}),e.jsxs(t,{className:"max-h-[80vh]",children:[e.jsxs(a,{children:[e.jsx(r,{children:"Terms and Conditions"}),e.jsx(s,{children:"Please read our terms and conditions carefully."})]}),e.jsxs("div",{className:"overflow-y-auto max-h-[50vh] space-y-4 text-sm",children:[e.jsx("p",{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}),e.jsx("p",{children:"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}),e.jsx("p",{children:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."}),e.jsx("p",{children:"Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}),e.jsx("p",{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}),e.jsx("p",{children:"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}),e.jsx("p",{children:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."}),e.jsx("p",{children:"Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."})]}),e.jsxs(c,{children:[e.jsx(l,{asChild:!0,children:e.jsx(i,{variant:"outline",children:"Decline"})}),e.jsx(i,{children:"Accept"})]})]})]})},C={render:()=>e.jsxs(o,{children:[e.jsx(n,{asChild:!0,children:e.jsx(i,{variant:"outline",children:"Open Dialog"})}),e.jsxs(t,{children:[e.jsx(a,{children:e.jsx(r,{children:"Simple Dialog"})}),e.jsx("div",{className:"py-4",children:e.jsx("p",{className:"text-sm",children:"This dialog doesn't have a DialogDescription component, but it's generally recommended for accessibility."})}),e.jsx(c,{children:e.jsx(l,{asChild:!0,children:e.jsx(i,{children:"Close"})})})]})]})},v={render:()=>e.jsxs(o,{children:[e.jsx(n,{asChild:!0,children:e.jsx(i,{children:"Open Dialog"})}),e.jsxs(_e,{children:[e.jsx($e,{}),e.jsxs(t,{children:[e.jsxs(a,{children:[e.jsx(r,{children:"Explicit Structure"}),e.jsx(s,{children:"This dialog explicitly shows DialogPortal and DialogOverlay usage, though DialogContent includes them automatically."})]}),e.jsx("div",{className:"py-4",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"In most cases, you don't need to use DialogPortal and DialogOverlay directly - DialogContent handles them for you."})})]})]})]})},b={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs(o,{children:[e.jsx(n,{asChild:!0,children:e.jsx(i,{children:"Small Dialog"})}),e.jsxs(t,{className:"sm:max-w-[425px]",children:[e.jsxs(a,{children:[e.jsx(r,{children:"Small Dialog"}),e.jsx(s,{children:"Max width: 425px"})]}),e.jsx("div",{className:"py-4",children:e.jsx("p",{className:"text-sm",children:"This is a small dialog for simple confirmations."})})]})]}),e.jsxs(o,{children:[e.jsx(n,{asChild:!0,children:e.jsx(i,{children:"Medium Dialog (Default)"})}),e.jsxs(t,{children:[e.jsxs(a,{children:[e.jsx(r,{children:"Medium Dialog"}),e.jsx(s,{children:"Default max width: 512px"})]}),e.jsx("div",{className:"py-4",children:e.jsx("p",{className:"text-sm",children:"This is the default dialog size."})})]})]}),e.jsxs(o,{children:[e.jsx(n,{asChild:!0,children:e.jsx(i,{children:"Large Dialog"})}),e.jsxs(t,{className:"sm:max-w-[725px]",children:[e.jsxs(a,{children:[e.jsx(r,{children:"Large Dialog"}),e.jsx(s,{children:"Max width: 725px"})]}),e.jsx("div",{className:"py-4",children:e.jsx("p",{className:"text-sm",children:"This is a large dialog for complex forms or content."})})]})]})]})},T={render:()=>e.jsxs(o,{children:[e.jsx(n,{asChild:!0,children:e.jsx(i,{"data-testid":"open-dialog",children:"Open Dialog"})}),e.jsxs(t,{"data-testid":"dialog-content",children:[e.jsxs(a,{children:[e.jsx(r,{children:"Test Dialog"}),e.jsx(s,{children:"This dialog tests keyboard and mouse interactions."})]}),e.jsx("div",{className:"py-4",children:e.jsx(g,{"data-testid":"dialog-input",placeholder:"Type here..."})}),e.jsxs(c,{children:[e.jsx(l,{asChild:!0,children:e.jsx(i,{variant:"outline","data-testid":"cancel-button",children:"Cancel"})}),e.jsx(i,{"data-testid":"confirm-button",children:"Confirm"})]})]})]}),play:async({canvasElement:S})=>{const B=F(S),d=F(document.body),Re=B.getByTestId("open-dialog");await N.click(Re),await new Promise(k=>setTimeout(k,200));const We=d.getByTestId("dialog-content");await Ke(We).toBeInTheDocument();const O=d.getByTestId("dialog-input");await N.click(O),await N.type(O,"Test input");const Ye=d.getByTestId("cancel-button");await N.click(Ye),await new Promise(k=>setTimeout(k,300))}},f={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs(o,{children:[e.jsx(n,{asChild:!0,children:e.jsx(i,{style:{backgroundColor:"var(--primary)",color:"white"},children:"Turquoise Accent"})}),e.jsxs(t,{children:[e.jsxs(a,{children:[e.jsx(r,{style:{color:"var(--primary)"},children:"Ozean Licht Dialog"}),e.jsx(s,{children:"Using the Ozean Licht primary color (var(--primary)) for accents."})]}),e.jsx("div",{className:"py-4",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"This demonstrates how to apply the Ozean Licht turquoise accent color to dialog elements. For full branded experience, see Tier 2 Dialog."})}),e.jsxs(c,{children:[e.jsx(l,{asChild:!0,children:e.jsx(i,{variant:"outline",children:"Cancel"})}),e.jsx(i,{style:{backgroundColor:"var(--primary)",color:"white"},children:"Confirm"})]})]})]}),e.jsxs(o,{children:[e.jsx(n,{asChild:!0,children:e.jsx(i,{variant:"outline",style:{borderColor:"var(--primary)",color:"var(--primary)"},children:"Turquoise Border"})}),e.jsxs(t,{style:{borderColor:"var(--primary)"},children:[e.jsxs(a,{children:[e.jsx(r,{children:"Dialog with Turquoise Border"}),e.jsx(s,{children:"Border and text accents using Ozean Licht color."})]}),e.jsx("div",{className:"py-4",children:e.jsx("p",{className:"text-sm",style:{color:"var(--primary)"},children:"Key information can be highlighted with the turquoise accent."})})]})]})]})};var L,H,q,P,E;u.parameters={...u.parameters,docs:{...(L=u.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
}`,...(q=(H=u.parameters)==null?void 0:H.docs)==null?void 0:q.source},description:{story:`Default dialog with trigger button.

The most basic dialog implementation showing essential structure.`,...(E=(P=u.parameters)==null?void 0:P.docs)==null?void 0:E.description}}};var I,A,z,M,U;p.parameters={...p.parameters,docs:{...(I=p.parameters)==null?void 0:I.docs,source:{originalSource:`{
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
            <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" defaultValue="@peduarte" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}`,...(z=(A=p.parameters)==null?void 0:A.docs)==null?void 0:z.source},description:{story:`Dialog with footer actions.

Shows common pattern with action buttons in footer.`,...(U=(M=p.parameters)==null?void 0:M.docs)==null?void 0:U.description}}};var V,R,W,Y,K;m.parameters={...m.parameters,docs:{...(V=m.parameters)==null?void 0:V.docs,source:{originalSource:`{
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
}`,...(W=(R=m.parameters)==null?void 0:R.docs)==null?void 0:W.source},description:{story:`Confirmation dialog with explicit DialogClose.

Shows how to use DialogClose component to create cancel buttons.`,...(K=(Y=m.parameters)==null?void 0:Y.docs)==null?void 0:K.description}}};var X,_,$,G,J;h.parameters={...h.parameters,docs:{...(X=h.parameters)==null?void 0:X.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button>Create Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create new project</DialogTitle>
          <DialogDescription>
            Add a new project to your workspace. Click create when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="project-name">Project name</Label>
            <Input id="project-name" placeholder="My Awesome Project" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-description">Description</Label>
            <Input id="project-description" placeholder="A brief description of your project" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-url">Repository URL</Label>
            <Input id="project-url" type="url" placeholder="https://github.com/username/repo" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Create Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}`,...($=(_=h.parameters)==null?void 0:_.docs)==null?void 0:$.source},description:{story:`Form dialog example.

Common pattern for forms inside dialogs.`,...(J=(G=h.parameters)==null?void 0:G.docs)==null?void 0:J.description}}};var Q,Z,ee,ie,oe;D.parameters={...D.parameters,docs:{...(Q=D.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" style={{
        backgroundColor: 'var(--primary)',
        color: 'white'
      }}>
          Complete Payment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle style={{
          color: 'var(--primary)'
        }}>
            Payment Successful!
          </DialogTitle>
          <DialogDescription>
            Your payment of $99.00 has been processed successfully.
            A confirmation email has been sent to your inbox.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button style={{
          backgroundColor: 'var(--primary)',
          color: 'white'
        }}>
            View Receipt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}`,...(ee=(Z=D.parameters)==null?void 0:Z.docs)==null?void 0:ee.source},description:{story:`Success notification dialog with Ozean Licht turquoise accent.

Demonstrates using design tokens for accent colors (#0ec2bc).`,...(oe=(ie=D.parameters)==null?void 0:ie.docs)==null?void 0:oe.description}}};var te,ae,re,ne,se;x.parameters={...x.parameters,docs:{...(te=x.parameters)==null?void 0:te.docs,source:{originalSource:`{
  render: () => {
    const ControlledDialog = () => {
      const [open, setOpen] = useState(false);
      return <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => setOpen(true)}>Open Dialog</Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close Dialog (External)
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Dialog is currently: {open ? 'Open' : 'Closed'}
          </p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Controlled Dialog</DialogTitle>
                <DialogDescription>
                  This dialog's state is controlled by external state.
                  You can open/close it programmatically.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm">
                  Use the buttons above to control this dialog, or use the
                  built-in close button (X) or click outside to close.
                </p>
              </div>
              <DialogFooter>
                <Button onClick={() => setOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>;
    };
    return <ControlledDialog />;
  }
}`,...(re=(ae=x.parameters)==null?void 0:ae.docs)==null?void 0:re.source},description:{story:"Controlled dialog state.\n\nShows how to control dialog open state programmatically using the `open` and `onOpenChange` props.",...(se=(ne=x.parameters)==null?void 0:ne.docs)==null?void 0:se.description}}};var le,ce,de,ge,ue;j.parameters={...j.parameters,docs:{...(le=j.parameters)==null?void 0:le.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Custom Close Buttons</DialogTitle>
          <DialogDescription>
            Any element wrapped with DialogClose will close the dialog when clicked.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-3">
          <DialogClose asChild>
            <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm">
              Custom Button (closes dialog)
            </button>
          </DialogClose>
          <DialogClose asChild>
            <div className="w-full px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md text-sm cursor-pointer text-center">
              Div as close button
            </div>
          </DialogClose>
          <DialogClose asChild>
            <a href="#" className="block w-full px-4 py-2 bg-green-50 hover:bg-green-100 rounded-md text-sm text-center">
              Link as close button
            </a>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
}`,...(de=(ce=j.parameters)==null?void 0:ce.docs)==null?void 0:de.source},description:{story:`Custom close button.

Demonstrates wrapping any element with DialogClose to make it close the dialog.`,...(ue=(ge=j.parameters)==null?void 0:ge.docs)==null?void 0:ue.description}}};var pe,me,he,De,xe;y.parameters={...y.parameters,docs:{...(pe=y.parameters)==null?void 0:pe.docs,source:{originalSource:`{
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
            eu fugiat nulla pariatur.
          </p>
          <p>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
            eu fugiat nulla pariatur.
          </p>
          <p>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Decline</Button>
          </DialogClose>
          <Button>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}`,...(he=(me=y.parameters)==null?void 0:me.docs)==null?void 0:he.source},description:{story:`Scrollable content dialog.

Shows how to handle long content with scrolling.`,...(xe=(De=y.parameters)==null?void 0:De.docs)==null?void 0:xe.description}}};var je,ye,Ce,ve,be;C.parameters={...C.parameters,docs:{...(je=C.parameters)==null?void 0:je.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Simple Dialog</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm">
            This dialog doesn't have a DialogDescription component, but it's
            generally recommended for accessibility.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}`,...(Ce=(ye=C.parameters)==null?void 0:ye.docs)==null?void 0:Ce.source},description:{story:`Dialog without description.

While DialogDescription is recommended for accessibility, it's optional.`,...(be=(ve=C.parameters)==null?void 0:ve.docs)==null?void 0:be.description}}};var Te,fe,we,Be,Ne;v.parameters={...v.parameters,docs:{...(Te=v.parameters)==null?void 0:Te.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Explicit Structure</DialogTitle>
            <DialogDescription>
              This dialog explicitly shows DialogPortal and DialogOverlay usage,
              though DialogContent includes them automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              In most cases, you don't need to use DialogPortal and DialogOverlay
              directly - DialogContent handles them for you.
            </p>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
}`,...(we=(fe=v.parameters)==null?void 0:fe.docs)==null?void 0:we.source},description:{story:`Nested dialog structure demonstration.

Shows the explicit use of DialogPortal and DialogOverlay (though they're
automatically included in DialogContent).`,...(Ne=(Be=v.parameters)==null?void 0:Be.docs)==null?void 0:Ne.description}}};var Se,ke,Oe,Fe,Le;b.parameters={...b.parameters,docs:{...(Se=b.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Small Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Small Dialog</DialogTitle>
            <DialogDescription>Max width: 425px</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">This is a small dialog for simple confirmations.</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button>Medium Dialog (Default)</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Medium Dialog</DialogTitle>
            <DialogDescription>Default max width: 512px</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">This is the default dialog size.</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button>Large Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Large Dialog</DialogTitle>
            <DialogDescription>Max width: 725px</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">This is a large dialog for complex forms or content.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
}`,...(Oe=(ke=b.parameters)==null?void 0:ke.docs)==null?void 0:Oe.source},description:{story:`Size variants.

Demonstrates different dialog sizes by overriding className.`,...(Le=(Fe=b.parameters)==null?void 0:Fe.docs)==null?void 0:Le.description}}};var He,qe,Pe,Ee,Ie;T.parameters={...T.parameters,docs:{...(He=T.parameters)==null?void 0:He.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button data-testid="open-dialog">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent data-testid="dialog-content">
        <DialogHeader>
          <DialogTitle>Test Dialog</DialogTitle>
          <DialogDescription>
            This dialog tests keyboard and mouse interactions.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input data-testid="dialog-input" placeholder="Type here..." />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" data-testid="cancel-button">
              Cancel
            </Button>
          </DialogClose>
          <Button data-testid="confirm-button">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    // Click trigger to open dialog
    const trigger = canvas.getByTestId('open-dialog');
    await userEvent.click(trigger);

    // Wait for dialog to open
    await new Promise(resolve => setTimeout(resolve, 200));

    // Dialog should be visible
    const dialogContent = body.getByTestId('dialog-content');
    await expect(dialogContent).toBeInTheDocument();

    // Focus should be on the dialog content
    const input = body.getByTestId('dialog-input');
    await userEvent.click(input);
    await userEvent.type(input, 'Test input');

    // Click cancel button to close
    const cancelButton = body.getByTestId('cancel-button');
    await userEvent.click(cancelButton);

    // Wait for dialog to close
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}`,...(Pe=(qe=T.parameters)==null?void 0:qe.docs)==null?void 0:Pe.source},description:{story:`Interactive test with play function.

Tests dialog open/close and keyboard navigation using Storybook interactions.`,...(Ie=(Ee=T.parameters)==null?void 0:Ee.docs)==null?void 0:Ie.description}}};var Ae,ze,Me,Ue,Ve;f.parameters={...f.parameters,docs:{...(Ae=f.parameters)==null?void 0:Ae.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button style={{
          backgroundColor: 'var(--primary)',
          color: 'white'
        }}>
            Turquoise Accent
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{
            color: 'var(--primary)'
          }}>
              Ozean Licht Dialog
            </DialogTitle>
            <DialogDescription>
              Using the Ozean Licht primary color (var(--primary)) for accents.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              This demonstrates how to apply the Ozean Licht turquoise accent color
              to dialog elements. For full branded experience, see Tier 2 Dialog.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button style={{
            backgroundColor: 'var(--primary)',
            color: 'white'
          }}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" style={{
          borderColor: 'var(--primary)',
          color: 'var(--primary)'
        }}>
            Turquoise Border
          </Button>
        </DialogTrigger>
        <DialogContent style={{
        borderColor: 'var(--primary)'
      }}>
          <DialogHeader>
            <DialogTitle>Dialog with Turquoise Border</DialogTitle>
            <DialogDescription>
              Border and text accents using Ozean Licht color.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm" style={{
            color: 'var(--primary)'
          }}>
              Key information can be highlighted with the turquoise accent.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
}`,...(Me=(ze=f.parameters)==null?void 0:ze.docs)==null?void 0:Me.source},description:{story:`Ozean Licht themed examples.

Multiple dialogs showcasing the Ozean Licht turquoise color (var(--primary)).`,...(Ve=(Ue=f.parameters)==null?void 0:Ue.docs)==null?void 0:Ve.description}}};const fi=["Default","WithFooter","Confirmation","FormDialog","SuccessDialog","ControlledState","CustomCloseButton","ScrollableContent","WithoutDescription","ExplicitStructure","SizeVariants","InteractiveTest","OzeanLichtThemed"];export{m as Confirmation,x as ControlledState,j as CustomCloseButton,u as Default,v as ExplicitStructure,h as FormDialog,T as InteractiveTest,f as OzeanLichtThemed,y as ScrollableContent,b as SizeVariants,D as SuccessDialog,p as WithFooter,C as WithoutDescription,fi as __namedExportsOrder,Ti as default};
