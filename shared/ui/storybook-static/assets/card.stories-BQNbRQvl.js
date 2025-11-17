import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{w as ka,e as S,u as E}from"./index-CJu6nLMj.js";import{r as Ba}from"./index-B2-qRKKC.js";import{C as a,a as s,b as r,c as t,d as n,e as c}from"./card-DMcvVywK.js";import{B as d}from"./button-DP4L7qO7.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./cn-CytzSlOG.js";import"./index-BiMR7eR1.js";import"./index-BFjtS4uE.js";import"./index-DVF2XGCm.js";const Ra={title:"Tier 1: Primitives/shadcn/Card",component:a,parameters:{layout:"centered",docs:{description:{component:"A card container component for grouping related content. Built with simple div elements and Tailwind CSS classes."}}},tags:["autodocs"]},l={render:()=>e.jsx(a,{className:"w-[350px]",children:e.jsx(s,{className:"pt-6",children:e.jsx("p",{className:"text-sm",children:"This is a basic card with just content. No header or footer."})})})},m={render:()=>e.jsxs(a,{className:"w-[350px]",children:[e.jsxs(r,{children:[e.jsx(t,{children:"Card Title"}),e.jsx(n,{children:"Card description goes here"})]}),e.jsx(s,{children:e.jsx("p",{className:"text-sm",children:"This card demonstrates the header section with a title and description. The header automatically adds appropriate spacing."})})]})},p={render:()=>e.jsxs(a,{className:"w-[350px]",children:[e.jsxs(r,{children:[e.jsx(t,{children:"Confirm Action"}),e.jsx(n,{children:"Are you sure you want to proceed?"})]}),e.jsx(s,{children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"This action will make changes to your account settings."})}),e.jsxs(c,{className:"flex justify-end gap-2",children:[e.jsx(d,{variant:"outline",size:"sm",children:"Cancel"}),e.jsx(d,{size:"sm",children:"Confirm"})]})]})},x={render:()=>e.jsxs(a,{className:"w-[380px]",children:[e.jsxs(r,{children:[e.jsx(t,{children:"Complete Card Example"}),e.jsx(n,{children:"This card has all possible sections: header, content, and footer"})]}),e.jsx(s,{children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-sm",children:"This demonstrates a complete card structure with header, content, and footer sections all working together."}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Each section has appropriate spacing and can be customized with className props."})]})}),e.jsxs(c,{className:"flex justify-between",children:[e.jsx(d,{variant:"outline",size:"sm",children:"Secondary"}),e.jsx(d,{size:"sm",children:"Primary"})]})]})},C={render:()=>e.jsxs(a,{className:"w-[350px]",children:[e.jsx(s,{className:"pt-6",children:e.jsxs("div",{className:"space-y-3",children:[e.jsx("p",{className:"font-semibold",children:"No Header Needed"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Not every card needs a formal header. Sometimes you can style your content directly for a more compact design."})]})}),e.jsx(c,{children:e.jsx(d,{size:"sm",className:"w-full",children:"Action"})})]})},u={render:()=>e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4 p-4",children:[e.jsxs(a,{children:[e.jsxs(r,{children:[e.jsx(t,{children:"Card One"}),e.jsx(n,{children:"First card"})]}),e.jsx(s,{children:e.jsx("p",{className:"text-sm",children:"Content for the first card."})})]}),e.jsxs(a,{children:[e.jsxs(r,{children:[e.jsx(t,{children:"Card Two"}),e.jsx(n,{children:"Second card"})]}),e.jsx(s,{children:e.jsx("p",{className:"text-sm",children:"Content for the second card."})})]}),e.jsxs(a,{children:[e.jsxs(r,{children:[e.jsx(t,{children:"Card Three"}),e.jsx(n,{children:"Third card"})]}),e.jsx(s,{children:e.jsx("p",{className:"text-sm",children:"Content for the third card."})})]})]}),parameters:{layout:"padded"}},h={render:()=>e.jsxs(a,{className:"w-[350px] cursor-pointer transition-all hover:shadow-lg hover:scale-105",children:[e.jsxs(r,{children:[e.jsx(t,{children:"Interactive Card"}),e.jsx(n,{children:"Hover over me to see effects"})]}),e.jsx(s,{children:e.jsx("p",{className:"text-sm",children:"This card has custom hover effects added via className. The card scales slightly and increases its shadow on hover."})}),e.jsx(c,{children:e.jsx(d,{size:"sm",className:"w-full",children:"Click Me"})})]})},N={render:()=>{const[i,o]=Ba.useState(!1);return e.jsxs("div",{className:"space-y-4",children:[e.jsxs(a,{className:"w-[350px] cursor-pointer transition-colors hover:bg-accent",onClick:()=>o(!i),"data-testid":"clickable-card",children:[e.jsxs(r,{children:[e.jsx(t,{children:"Clickable Card"}),e.jsx(n,{children:"Click anywhere on this card"})]}),e.jsx(s,{children:e.jsxs("p",{className:"text-sm",children:["The entire card is clickable. Current state:"," ",e.jsx("span",{className:"font-semibold",children:i?"Clicked":"Not clicked"})]})})]}),e.jsx("p",{className:"text-xs text-muted-foreground text-center",children:"Tip: Use asChild pattern or wrap with an anchor for real links"})]})}},j={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs(a,{className:"w-[350px] border-2 border-blue-500 shadow-lg",children:[e.jsxs(r,{className:"bg-blue-50",children:[e.jsx(t,{className:"text-blue-700",children:"Custom Border & Background"}),e.jsx(n,{children:"Override default styles easily"})]}),e.jsx(s,{children:e.jsx("p",{className:"text-sm",children:"This card uses custom border colors and background colors via className."})})]}),e.jsxs(a,{className:"w-[350px] border-green-500 bg-green-50",children:[e.jsxs(r,{children:[e.jsx(t,{className:"text-green-700",children:"Green Theme"}),e.jsx(n,{className:"text-green-600",children:"Completely customized colors"})]}),e.jsx(s,{children:e.jsx("p",{className:"text-sm text-green-800",children:"All styling can be overridden using Tailwind classes."})})]})]})},f={render:()=>e.jsxs(a,{className:"w-[300px]",children:[e.jsxs(r,{className:"pb-3",children:[e.jsx(n,{children:"Total Revenue"}),e.jsx(t,{className:"text-4xl",children:"$45,231.89"})]}),e.jsx(s,{children:e.jsx("div",{className:"text-xs text-muted-foreground",children:"+20.1% from last month"})})]})},w={render:()=>e.jsxs(a,{className:"w-[350px]",children:[e.jsx(r,{children:e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold",children:"JD"}),e.jsxs("div",{className:"flex-1",children:[e.jsx(t,{className:"text-lg",children:"John Doe"}),e.jsx(n,{children:"Software Engineer"})]})]})}),e.jsx(s,{children:e.jsxs("div",{className:"space-y-2 text-sm",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-muted-foreground",children:"Email:"}),e.jsx("span",{children:"john.doe@example.com"})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-muted-foreground",children:"Location:"}),e.jsx("span",{children:"San Francisco, CA"})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-muted-foreground",children:"Joined:"}),e.jsx("span",{children:"January 2024"})]})]})}),e.jsx(c,{children:e.jsx(d,{size:"sm",className:"w-full",children:"View Full Profile"})})]})},g={render:()=>e.jsxs(a,{className:"w-[400px]",children:[e.jsxs(r,{children:[e.jsx(t,{children:"Create Account"}),e.jsx(n,{children:"Enter your details to create a new account"})]}),e.jsx(s,{children:e.jsxs("form",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{htmlFor:"name",className:"text-sm font-medium",children:"Full Name"}),e.jsx("input",{id:"name",type:"text",placeholder:"John Doe",className:"w-full px-3 py-2 border rounded-md text-sm"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{htmlFor:"email",className:"text-sm font-medium",children:"Email"}),e.jsx("input",{id:"email",type:"email",placeholder:"john@example.com",className:"w-full px-3 py-2 border rounded-md text-sm"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{htmlFor:"password",className:"text-sm font-medium",children:"Password"}),e.jsx("input",{id:"password",type:"password",placeholder:"••••••••",className:"w-full px-3 py-2 border rounded-md text-sm"})]})]})}),e.jsxs(c,{className:"flex gap-2",children:[e.jsx(d,{variant:"outline",size:"sm",className:"flex-1",children:"Cancel"}),e.jsx(d,{size:"sm",className:"flex-1",children:"Create Account"})]})]})},v={render:()=>e.jsxs(a,{className:"w-[350px]",children:[e.jsxs(r,{children:[e.jsx(t,{children:"Recent Activity"}),e.jsx(n,{children:"Your latest actions"})]}),e.jsx(s,{children:e.jsx("div",{className:"space-y-3",children:[{action:"Created new project",time:"2 hours ago"},{action:"Updated profile",time:"5 hours ago"},{action:"Uploaded document",time:"1 day ago"},{action:"Joined team meeting",time:"2 days ago"}].map((i,o)=>e.jsxs("div",{className:"flex justify-between items-center text-sm",children:[e.jsx("span",{children:i.action}),e.jsx("span",{className:"text-xs text-muted-foreground",children:i.time})]},o))})}),e.jsx(c,{children:e.jsx(d,{variant:"outline",size:"sm",className:"w-full",children:"View All Activity"})})]})},b={render:()=>e.jsxs(a,{className:"w-[380px] border-l-4 border-l-blue-500",children:[e.jsxs(r,{children:[e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-2 h-2 bg-blue-500 rounded-full"}),e.jsx(t,{className:"text-base",children:"New Update Available"})]}),e.jsx("button",{className:"text-muted-foreground hover:text-foreground",children:"×"})]}),e.jsx(n,{children:"Version 2.0.0 is now available"})]}),e.jsx(s,{children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"This update includes new features, bug fixes, and performance improvements. Update now to get the latest features."})}),e.jsxs(c,{className:"flex gap-2",children:[e.jsx(d,{variant:"outline",size:"sm",children:"Later"}),e.jsx(d,{size:"sm",children:"Update Now"})]})]})},y={render:()=>e.jsxs(a,{className:"w-[350px] overflow-hidden",children:[e.jsx("div",{className:"h-[200px] bg-gradient-to-br from-purple-400 via-pink-500 to-red-500"}),e.jsxs(r,{children:[e.jsx(t,{children:"Beautiful Gradient"}),e.jsx(n,{children:"Card with image header"})]}),e.jsx(s,{children:e.jsx("p",{className:"text-sm",children:"Images can be placed before the header for a visual card design. The card container handles overflow correctly."})}),e.jsx(c,{children:e.jsx(d,{size:"sm",className:"w-full",children:"Learn More"})})]})},T={render:()=>e.jsxs(a,{className:"w-[250px]",children:[e.jsxs(r,{className:"p-4 pb-3",children:[e.jsx(t,{className:"text-lg",children:"Compact Card"}),e.jsx(n,{className:"text-xs",children:"Reduced spacing"})]}),e.jsx(s,{className:"p-4 pt-0",children:e.jsx("p",{className:"text-xs",children:"This card uses reduced padding for a more compact appearance."})}),e.jsx(c,{className:"p-4 pt-0",children:e.jsx(d,{size:"sm",className:"h-8 text-xs w-full",children:"Action"})})]})},H={render:()=>e.jsxs(a,{className:"w-[350px]",children:[e.jsxs(r,{children:[e.jsx("div",{className:"h-6 w-2/3 bg-muted rounded animate-pulse"}),e.jsx("div",{className:"h-4 w-full bg-muted rounded animate-pulse"})]}),e.jsx(s,{children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("div",{className:"h-4 w-full bg-muted rounded animate-pulse"}),e.jsx("div",{className:"h-4 w-5/6 bg-muted rounded animate-pulse"}),e.jsx("div",{className:"h-4 w-4/6 bg-muted rounded animate-pulse"})]})})]})},D={render:()=>e.jsxs(a,{className:"w-[350px] border-0 shadow-none",children:[e.jsxs(r,{children:[e.jsx(t,{children:"Borderless Card"}),e.jsx(n,{children:"No border or shadow"})]}),e.jsx(s,{children:e.jsx("p",{className:"text-sm",children:"This card has its border and shadow removed for a cleaner look. Useful for dense layouts or nested cards."})})]})},B={render:()=>{const i=()=>{const[o,F]=Ba.useState(0);return e.jsxs(a,{className:"w-[350px]","data-testid":"test-card",children:[e.jsxs(r,{children:[e.jsx(t,{children:"Interactive Test Card"}),e.jsx(n,{children:"Testing card interactions"})]}),e.jsxs(s,{children:[e.jsxs("p",{className:"text-sm mb-4",children:["Button has been clicked: ",e.jsx("span",{"data-testid":"count",children:o})," times"]}),e.jsx(d,{size:"sm","data-testid":"increment-button",onClick:()=>F(o+1),children:"Increment"})]})]})};return e.jsx(i,{})},play:async({canvasElement:i})=>{const o=ka(i),F=o.getByTestId("test-card");await S(F).toBeInTheDocument();const z=o.getByTestId("count");await S(z).toHaveTextContent("0");const I=o.getByTestId("increment-button");await E.click(I),await new Promise(A=>setTimeout(A,100)),await S(z).toHaveTextContent("1"),await E.click(I),await new Promise(A=>setTimeout(A,100)),await S(z).toHaveTextContent("2")}},k={render:()=>e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6",children:[e.jsxs(a,{children:[e.jsxs(r,{children:[e.jsx(t,{children:"Basic"}),e.jsx(n,{children:"Simple card"})]}),e.jsx(s,{children:e.jsx("p",{className:"text-sm",children:"Basic card structure"})})]}),e.jsxs(a,{children:[e.jsxs(r,{children:[e.jsx(t,{children:"With Footer"}),e.jsx(n,{children:"Actions in footer"})]}),e.jsx(s,{children:e.jsx("p",{className:"text-sm",children:"Card with footer buttons"})}),e.jsx(c,{children:e.jsx(d,{size:"sm",className:"w-full",children:"Action"})})]}),e.jsxs(a,{children:[e.jsxs(r,{className:"pb-2",children:[e.jsx(n,{children:"Revenue"}),e.jsx(t,{className:"text-3xl",children:"$12,345"})]}),e.jsx(s,{children:e.jsx("p",{className:"text-xs text-muted-foreground",children:"+12.5% from last month"})})]}),e.jsxs(a,{className:"cursor-pointer transition-all hover:shadow-lg",children:[e.jsxs(r,{children:[e.jsx(t,{children:"Interactive"}),e.jsx(n,{children:"Hover effect"})]}),e.jsx(s,{children:e.jsx("p",{className:"text-sm",children:"Hover to see effect"})})]}),e.jsxs(a,{className:"border-purple-500 bg-purple-50",children:[e.jsxs(r,{children:[e.jsx(t,{className:"text-purple-700",children:"Colored"}),e.jsx(n,{className:"text-purple-600",children:"Custom colors"})]}),e.jsx(s,{children:e.jsx("p",{className:"text-sm text-purple-800",children:"Custom styling"})})]}),e.jsxs(a,{children:[e.jsxs(r,{className:"p-4 pb-2",children:[e.jsx(t,{className:"text-base",children:"Compact"}),e.jsx(n,{className:"text-xs",children:"Less padding"})]}),e.jsx(s,{className:"p-4 pt-2",children:e.jsx("p",{className:"text-xs",children:"Reduced spacing"})})]})]}),parameters:{layout:"fullscreen"}};var L,P,U,J,R;l.parameters={...l.parameters,docs:{...(L=l.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: () => <Card className="w-[350px]">
      <CardContent className="pt-6">
        <p className="text-sm">
          This is a basic card with just content. No header or footer.
        </p>
      </CardContent>
    </Card>
}`,...(U=(P=l.parameters)==null?void 0:P.docs)==null?void 0:U.source},description:{story:`Default basic card.

The most minimal card implementation showing just the Card wrapper.`,...(R=(J=l.parameters)==null?void 0:J.docs)==null?void 0:R.description}}};var W,V,M,O,G;m.parameters={...m.parameters,docs:{...(W=m.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          This card demonstrates the header section with a title and description.
          The header automatically adds appropriate spacing.
        </p>
      </CardContent>
    </Card>
}`,...(M=(V=m.parameters)==null?void 0:V.docs)==null?void 0:M.source},description:{story:`Card with header.

Shows the common pattern of header with title and description.`,...(G=(O=m.parameters)==null?void 0:O.docs)==null?void 0:G.description}}};var $,Y,_,q,K;p.parameters={...p.parameters,docs:{...($=p.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Confirm Action</CardTitle>
        <CardDescription>Are you sure you want to proceed?</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This action will make changes to your account settings.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button size="sm">Confirm</Button>
      </CardFooter>
    </Card>
}`,...(_=(Y=p.parameters)==null?void 0:Y.docs)==null?void 0:_.source},description:{story:`Card with footer.

Shows footer with action buttons.`,...(K=(q=p.parameters)==null?void 0:q.docs)==null?void 0:K.description}}};var Q,X,Z,ee,ae;x.parameters={...x.parameters,docs:{...(Q=x.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: () => <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Complete Card Example</CardTitle>
        <CardDescription>
          This card has all possible sections: header, content, and footer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">
            This demonstrates a complete card structure with header, content,
            and footer sections all working together.
          </p>
          <p className="text-sm text-muted-foreground">
            Each section has appropriate spacing and can be customized with
            className props.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          Secondary
        </Button>
        <Button size="sm">Primary</Button>
      </CardFooter>
    </Card>
}`,...(Z=(X=x.parameters)==null?void 0:X.docs)==null?void 0:Z.source},description:{story:`Complete card with all parts.

Demonstrates using all available card sub-components together.`,...(ae=(ee=x.parameters)==null?void 0:ee.docs)==null?void 0:ae.description}}};var se,re,te,ne,de;C.parameters={...C.parameters,docs:{...(se=C.parameters)==null?void 0:se.docs,source:{originalSource:`{
  render: () => <Card className="w-[350px]">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <p className="font-semibold">No Header Needed</p>
          <p className="text-sm text-muted-foreground">
            Not every card needs a formal header. Sometimes you can style
            your content directly for a more compact design.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button size="sm" className="w-full">
          Action
        </Button>
      </CardFooter>
    </Card>
}`,...(te=(re=C.parameters)==null?void 0:re.docs)==null?void 0:te.source},description:{story:`Card without header.

Shows that header is optional - sometimes just content is enough.`,...(de=(ne=C.parameters)==null?void 0:ne.docs)==null?void 0:de.description}}};var ce,oe,ie,le,me;u.parameters={...u.parameters,docs:{...(ce=u.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Card One</CardTitle>
          <CardDescription>First card</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Content for the first card.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Card Two</CardTitle>
          <CardDescription>Second card</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Content for the second card.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Card Three</CardTitle>
          <CardDescription>Third card</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Content for the third card.</p>
        </CardContent>
      </Card>
    </div>,
  parameters: {
    layout: 'padded'
  }
}`,...(ie=(oe=u.parameters)==null?void 0:oe.docs)==null?void 0:ie.source},description:{story:`Multiple cards in a grid.

Shows how cards work in layout contexts like grids.`,...(me=(le=u.parameters)==null?void 0:le.docs)==null?void 0:me.description}}};var pe,xe,Ce,ue,he;h.parameters={...h.parameters,docs:{...(pe=h.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  render: () => <Card className="w-[350px] cursor-pointer transition-all hover:shadow-lg hover:scale-105">
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>Hover over me to see effects</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          This card has custom hover effects added via className. The card
          scales slightly and increases its shadow on hover.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm" className="w-full">
          Click Me
        </Button>
      </CardFooter>
    </Card>
}`,...(Ce=(xe=h.parameters)==null?void 0:xe.docs)==null?void 0:Ce.source},description:{story:`Interactive card with hover effect.

Shows how to add custom hover effects using Tailwind classes.`,...(he=(ue=h.parameters)==null?void 0:ue.docs)==null?void 0:he.description}}};var Ne,je,fe,we,ge;N.parameters={...N.parameters,docs:{...(Ne=N.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
  render: () => {
    const [clicked, setClicked] = useState(false);
    return <div className="space-y-4">
        <Card className="w-[350px] cursor-pointer transition-colors hover:bg-accent" onClick={() => setClicked(!clicked)} data-testid="clickable-card">
          <CardHeader>
            <CardTitle>Clickable Card</CardTitle>
            <CardDescription>Click anywhere on this card</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              The entire card is clickable. Current state:{' '}
              <span className="font-semibold">
                {clicked ? 'Clicked' : 'Not clicked'}
              </span>
            </p>
          </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground text-center">
          Tip: Use asChild pattern or wrap with an anchor for real links
        </p>
      </div>;
  }
}`,...(fe=(je=N.parameters)==null?void 0:je.docs)==null?void 0:fe.source},description:{story:`Card as a clickable link.

Demonstrates making the entire card clickable.`,...(ge=(we=N.parameters)==null?void 0:we.docs)==null?void 0:ge.description}}};var ve,be,ye,Te,He;j.parameters={...j.parameters,docs:{...(ve=j.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <Card className="w-[350px] border-2 border-blue-500 shadow-lg">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-700">Custom Border & Background</CardTitle>
          <CardDescription>Override default styles easily</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            This card uses custom border colors and background colors via className.
          </p>
        </CardContent>
      </Card>

      <Card className="w-[350px] border-green-500 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-700">Green Theme</CardTitle>
          <CardDescription className="text-green-600">
            Completely customized colors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-800">
            All styling can be overridden using Tailwind classes.
          </p>
        </CardContent>
      </Card>
    </div>
}`,...(ye=(be=j.parameters)==null?void 0:be.docs)==null?void 0:ye.source},description:{story:`Card with custom styling.

Shows how to override default styles with className.`,...(He=(Te=j.parameters)==null?void 0:Te.docs)==null?void 0:He.description}}};var De,Be,ke,Se,Fe;f.parameters={...f.parameters,docs:{...(De=f.parameters)==null?void 0:De.docs,source:{originalSource:`{
  render: () => <Card className="w-[300px]">
      <CardHeader className="pb-3">
        <CardDescription>Total Revenue</CardDescription>
        <CardTitle className="text-4xl">$45,231.89</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          +20.1% from last month
        </div>
      </CardContent>
    </Card>
}`,...(ke=(Be=f.parameters)==null?void 0:Be.docs)==null?void 0:ke.source},description:{story:`Stats dashboard card.

Common pattern for displaying statistics.`,...(Fe=(Se=f.parameters)==null?void 0:Se.docs)==null?void 0:Fe.description}}};var ze,Ae,Ie,Ee,Le;w.parameters={...w.parameters,docs:{...(ze=w.parameters)==null?void 0:ze.docs,source:{originalSource:`{
  render: () => <Card className="w-[350px]">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
            JD
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">John Doe</CardTitle>
            <CardDescription>Software Engineer</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span>john.doe@example.com</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Location:</span>
            <span>San Francisco, CA</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Joined:</span>
            <span>January 2024</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button size="sm" className="w-full">
          View Full Profile
        </Button>
      </CardFooter>
    </Card>
}`,...(Ie=(Ae=w.parameters)==null?void 0:Ae.docs)==null?void 0:Ie.source},description:{story:`Profile card example.

Shows card used for user profile display.`,...(Le=(Ee=w.parameters)==null?void 0:Ee.docs)==null?void 0:Le.description}}};var Pe,Ue,Je,Re,We;g.parameters={...g.parameters,docs:{...(Pe=g.parameters)==null?void 0:Pe.docs,source:{originalSource:`{
  render: () => <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Enter your details to create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Full Name
            </label>
            <input id="name" type="text" placeholder="John Doe" className="w-full px-3 py-2 border rounded-md text-sm" />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input id="email" type="email" placeholder="john@example.com" className="w-full px-3 py-2 border rounded-md text-sm" />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input id="password" type="password" placeholder="••••••••" className="w-full px-3 py-2 border rounded-md text-sm" />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          Cancel
        </Button>
        <Button size="sm" className="flex-1">
          Create Account
        </Button>
      </CardFooter>
    </Card>
}`,...(Je=(Ue=g.parameters)==null?void 0:Ue.docs)==null?void 0:Je.source},description:{story:`Form card example.

Shows card used as a container for forms.`,...(We=(Re=g.parameters)==null?void 0:Re.docs)==null?void 0:We.description}}};var Ve,Me,Oe,Ge,$e;v.parameters={...v.parameters,docs:{...(Ve=v.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
  render: () => <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[{
          action: 'Created new project',
          time: '2 hours ago'
        }, {
          action: 'Updated profile',
          time: '5 hours ago'
        }, {
          action: 'Uploaded document',
          time: '1 day ago'
        }, {
          action: 'Joined team meeting',
          time: '2 days ago'
        }].map((item, i) => <div key={i} className="flex justify-between items-center text-sm">
              <span>{item.action}</span>
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </div>)}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          View All Activity
        </Button>
      </CardFooter>
    </Card>
}`,...(Oe=(Me=v.parameters)==null?void 0:Me.docs)==null?void 0:Oe.source},description:{story:`List card example.

Shows card containing a list of items.`,...($e=(Ge=v.parameters)==null?void 0:Ge.docs)==null?void 0:$e.description}}};var Ye,_e,qe,Ke,Qe;b.parameters={...b.parameters,docs:{...(Ye=b.parameters)==null?void 0:Ye.docs,source:{originalSource:`{
  render: () => <Card className="w-[380px] border-l-4 border-l-blue-500">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <CardTitle className="text-base">New Update Available</CardTitle>
          </div>
          <button className="text-muted-foreground hover:text-foreground">
            ×
          </button>
        </div>
        <CardDescription>Version 2.0.0 is now available</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This update includes new features, bug fixes, and performance improvements.
          Update now to get the latest features.
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm">
          Later
        </Button>
        <Button size="sm">Update Now</Button>
      </CardFooter>
    </Card>
}`,...(qe=(_e=b.parameters)==null?void 0:_e.docs)==null?void 0:qe.source},description:{story:`Notification card.

Alert-style card for notifications.`,...(Qe=(Ke=b.parameters)==null?void 0:Ke.docs)==null?void 0:Qe.description}}};var Xe,Ze,ea,aa,sa;y.parameters={...y.parameters,docs:{...(Xe=y.parameters)==null?void 0:Xe.docs,source:{originalSource:`{
  render: () => <Card className="w-[350px] overflow-hidden">
      <div className="h-[200px] bg-gradient-to-br from-purple-400 via-pink-500 to-red-500" />
      <CardHeader>
        <CardTitle>Beautiful Gradient</CardTitle>
        <CardDescription>Card with image header</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          Images can be placed before the header for a visual card design.
          The card container handles overflow correctly.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm" className="w-full">
          Learn More
        </Button>
      </CardFooter>
    </Card>
}`,...(ea=(Ze=y.parameters)==null?void 0:Ze.docs)==null?void 0:ea.source},description:{story:`Card with image.

Shows card with image content.`,...(sa=(aa=y.parameters)==null?void 0:aa.docs)==null?void 0:sa.description}}};var ra,ta,na,da,ca;T.parameters={...T.parameters,docs:{...(ra=T.parameters)==null?void 0:ra.docs,source:{originalSource:`{
  render: () => <Card className="w-[250px]">
      <CardHeader className="p-4 pb-3">
        <CardTitle className="text-lg">Compact Card</CardTitle>
        <CardDescription className="text-xs">Reduced spacing</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-xs">
          This card uses reduced padding for a more compact appearance.
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button size="sm" className="h-8 text-xs w-full">
          Action
        </Button>
      </CardFooter>
    </Card>
}`,...(na=(ta=T.parameters)==null?void 0:ta.docs)==null?void 0:na.source},description:{story:`Compact card.

Smaller card with reduced padding.`,...(ca=(da=T.parameters)==null?void 0:da.docs)==null?void 0:ca.description}}};var oa,ia,la,ma,pa;H.parameters={...H.parameters,docs:{...(oa=H.parameters)==null?void 0:oa.docs,source:{originalSource:`{
  render: () => <Card className="w-[350px]">
      <CardHeader>
        <div className="h-6 w-2/3 bg-muted rounded animate-pulse" />
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
          <div className="h-4 w-4/6 bg-muted rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
}`,...(la=(ia=H.parameters)==null?void 0:ia.docs)==null?void 0:la.source},description:{story:`Loading card state.

Shows card with loading skeleton content.`,...(pa=(ma=H.parameters)==null?void 0:ma.docs)==null?void 0:pa.description}}};var xa,Ca,ua,ha,Na;D.parameters={...D.parameters,docs:{...(xa=D.parameters)==null?void 0:xa.docs,source:{originalSource:`{
  render: () => <Card className="w-[350px] border-0 shadow-none">
      <CardHeader>
        <CardTitle>Borderless Card</CardTitle>
        <CardDescription>No border or shadow</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          This card has its border and shadow removed for a cleaner look.
          Useful for dense layouts or nested cards.
        </p>
      </CardContent>
    </Card>
}`,...(ua=(Ca=D.parameters)==null?void 0:Ca.docs)==null?void 0:ua.source},description:{story:`Card without borders.

Shows borderless variant for seamless designs.`,...(Na=(ha=D.parameters)==null?void 0:ha.docs)==null?void 0:Na.description}}};var ja,fa,wa,ga,va;B.parameters={...B.parameters,docs:{...(ja=B.parameters)==null?void 0:ja.docs,source:{originalSource:`{
  render: () => {
    const InteractiveTestCard = () => {
      const [count, setCount] = useState(0);
      return <Card className="w-[350px]" data-testid="test-card">
          <CardHeader>
            <CardTitle>Interactive Test Card</CardTitle>
            <CardDescription>Testing card interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Button has been clicked: <span data-testid="count">{count}</span> times
            </p>
            <Button size="sm" data-testid="increment-button" onClick={() => setCount(count + 1)}>
              Increment
            </Button>
          </CardContent>
        </Card>;
    };
    return <InteractiveTestCard />;
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // Find the card
    const card = canvas.getByTestId('test-card');
    await expect(card).toBeInTheDocument();

    // Initial count should be 0
    const count = canvas.getByTestId('count');
    await expect(count).toHaveTextContent('0');

    // Click increment button
    const button = canvas.getByTestId('increment-button');
    await userEvent.click(button);

    // Wait for state update
    await new Promise(resolve => setTimeout(resolve, 100));

    // Count should be 1
    await expect(count).toHaveTextContent('1');

    // Click again
    await userEvent.click(button);
    await new Promise(resolve => setTimeout(resolve, 100));

    // Count should be 2
    await expect(count).toHaveTextContent('2');
  }
}`,...(wa=(fa=B.parameters)==null?void 0:fa.docs)==null?void 0:wa.source},description:{story:`Interactive test with play function.

Tests card click interactions using Storybook play function.`,...(va=(ga=B.parameters)==null?void 0:ga.docs)==null?void 0:va.description}}};var ba,ya,Ta,Ha,Da;k.parameters={...k.parameters,docs:{...(ba=k.parameters)==null?void 0:ba.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {/* Basic */}
      <Card>
        <CardHeader>
          <CardTitle>Basic</CardTitle>
          <CardDescription>Simple card</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Basic card structure</p>
        </CardContent>
      </Card>

      {/* With Footer */}
      <Card>
        <CardHeader>
          <CardTitle>With Footer</CardTitle>
          <CardDescription>Actions in footer</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Card with footer buttons</p>
        </CardContent>
        <CardFooter>
          <Button size="sm" className="w-full">
            Action
          </Button>
        </CardFooter>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Revenue</CardDescription>
          <CardTitle className="text-3xl">$12,345</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">+12.5% from last month</p>
        </CardContent>
      </Card>

      {/* Interactive */}
      <Card className="cursor-pointer transition-all hover:shadow-lg">
        <CardHeader>
          <CardTitle>Interactive</CardTitle>
          <CardDescription>Hover effect</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Hover to see effect</p>
        </CardContent>
      </Card>

      {/* Colored */}
      <Card className="border-purple-500 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-purple-700">Colored</CardTitle>
          <CardDescription className="text-purple-600">
            Custom colors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-purple-800">Custom styling</p>
        </CardContent>
      </Card>

      {/* Compact */}
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base">Compact</CardTitle>
          <CardDescription className="text-xs">Less padding</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-xs">Reduced spacing</p>
        </CardContent>
      </Card>
    </div>,
  parameters: {
    layout: 'fullscreen'
  }
}`,...(Ta=(ya=k.parameters)==null?void 0:ya.docs)==null?void 0:Ta.source},description:{story:`All card variations showcase.

Gallery showing different card patterns and use cases.`,...(Da=(Ha=k.parameters)==null?void 0:Ha.docs)==null?void 0:Da.description}}};const Wa=["Default","WithHeader","WithFooter","Complete","ContentOnly","MultipleCards","Interactive","ClickableCard","CustomStyling","StatsCard","ProfileCard","FormCard","ListCard","NotificationCard","WithImage","Compact","Loading","NoBorder","InteractiveTest","AllVariations"];export{k as AllVariations,N as ClickableCard,T as Compact,x as Complete,C as ContentOnly,j as CustomStyling,l as Default,g as FormCard,h as Interactive,B as InteractiveTest,v as ListCard,H as Loading,u as MultipleCards,D as NoBorder,b as NotificationCard,w as ProfileCard,f as StatsCard,p as WithFooter,m as WithHeader,y as WithImage,Wa as __namedExportsOrder,Ra as default};
