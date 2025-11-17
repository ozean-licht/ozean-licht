import{j as r}from"./jsx-runtime-DF2Pcvd1.js";import{c as dt}from"./cn-CytzSlOG.js";import{L as t}from"./LoginForm-CRIr4mdo.js";import{R as mt}from"./RegisterForm-BNc-dfBp.js";import{R as e}from"./index-B2-qRKKC.js";import"./index.esm-SGBzMz4R.js";import"./schemas-C3QG-Qu7.js";import"./Card-B3jXYF8b.js";import"./index-DVF2XGCm.js";import"./card-DrBDOuQX.js";import"./Button-Clfx5zjS.js";import"./button-C8qtCU0L.js";import"./index-BiMR7eR1.js";import"./index-BFjtS4uE.js";import"./Input-B8-YZaEC.js";import"./input-Db9iZ-Hs.js";import"./textarea-Cd1j4ONA.js";import"./label-Cp9r14oL.js";import"./index-B5oyz0SX.js";import"./index-kS-9iBlu.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./alert-JMCFSqIB.js";import"./eye-off-z17qZm2P.js";import"./createLucideIcon-BbF4D6Jl.js";import"./eye-B2FZkYMJ.js";import"./checkbox-M5-a5s-y.js";import"./index-D4_CVXg7.js";import"./index-BlCrtW8-.js";import"./index-D1vk04JX.js";import"./index-_AbP6Uzr.js";import"./index-BYfY0yFj.js";import"./index-PNzqWif7.js";import"./check-BFJmnSzs.js";function n({children:R,title:E,description:w,logoSrc:F,backgroundImage:N,className:lt}){return r.jsxs("div",{className:dt("min-h-screen bg-[var(--background)] flex items-center justify-center p-4",lt),children:[N&&r.jsxs("div",{className:"absolute inset-0 z-0",children:[r.jsx("img",{src:N,alt:"",className:"w-full h-full object-cover opacity-10"}),r.jsx("div",{className:"absolute inset-0 bg-gradient-to-b from-[var(--background)]/50 to-[var(--background)]"})]}),r.jsxs("div",{className:"relative z-10 w-full max-w-md space-y-8",children:[(F||E||w)&&r.jsxs("div",{className:"text-center space-y-4",children:[F&&r.jsx("div",{className:"flex justify-center mb-6",children:r.jsx("img",{src:F,alt:"Logo",className:"h-20 w-auto"})}),E&&r.jsx("h1",{className:"text-3xl md:text-4xl font-decorative text-white",children:E}),w&&r.jsx("p",{className:"text-[var(--muted-foreground)]",children:w})]}),r.jsx("div",{children:R})]})]})}n.displayName="AuthLayout";try{n.displayName="AuthLayout",n.__docgenInfo={description:"",displayName:"AuthLayout",props:{title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string"}},description:{defaultValue:null,description:"",name:"description",required:!1,type:{name:"string"}},logoSrc:{defaultValue:null,description:"",name:"logoSrc",required:!1,type:{name:"string"}},backgroundImage:{defaultValue:null,description:"",name:"backgroundImage",required:!1,type:{name:"string"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const _t={title:"Tier 3: Compositions/Layouts/AuthLayout",component:n,parameters:{layout:"fullscreen",docs:{description:{component:"Centered authentication layout wrapper for login, registration, and password reset pages. Features optional logo, title, description, and background image with Ozean Licht cosmic dark theme and glass morphism."}}},tags:["autodocs"],argTypes:{children:{description:"Authentication form or content to display",control:!1},title:{description:"Page title (displayed with decorative font)",control:"text"},description:{description:"Page description (displayed below title)",control:"text"},logoSrc:{description:"Logo image URL (displayed at h-20)",control:"text"},backgroundImage:{description:"Background image URL (displayed at 10% opacity with gradient overlay)",control:"text"},className:{description:"Custom className for styling",control:"text"}}},a={args:{title:"Welcome Back",description:"Sign in to continue your journey",children:e.createElement(t,{redirectUrl:"/dashboard",showPasswordReset:!0,showRegisterLink:!0})}},o={args:{title:"Willkommen zurück",description:"Melde dich an, um auf dein Dashboard zuzugreifen",logoSrc:"https://placehold.co/200x200/0ec2bc/FFFFFF?text=Ozean+Licht",backgroundImage:"https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80",children:e.createElement(t,{redirectUrl:"/dashboard",showPasswordReset:!0,showRegisterLink:!0})},parameters:{docs:{description:{story:"Complete login page with logo, title, description, background image, and login form."}}}},i={args:{title:"Join Our Community",description:"Create your account to start your spiritual journey",logoSrc:"https://placehold.co/200x200/0ec2bc/FFFFFF?text=Ozean+Licht",backgroundImage:"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80",children:e.createElement(mt,{redirectUrl:"/dashboard",showLoginLink:!0,requireTerms:!0})},parameters:{docs:{description:{story:"Complete registration page with logo, title, description, background image, and register form."}}}},c={args:{title:"Reset Password",description:"Enter your email to receive a password reset link",logoSrc:"https://placehold.co/200x200/0ec2bc/FFFFFF?text=Ozean+Licht",children:e.createElement("div",{className:"bg-[var(--card)] backdrop-blur-md p-8 rounded-lg border border-[var(--border)] shadow-lg",children:e.createElement("form",{className:"space-y-4",children:[e.createElement("div",{key:"email-field"},[e.createElement("label",{key:"label",htmlFor:"email",className:"block text-sm font-medium text-[var(--foreground)] mb-2",children:"Email"}),e.createElement("input",{key:"input",type:"email",id:"email",className:"w-full px-4 py-2 bg-[var(--input)] text-[var(--foreground)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]",placeholder:"your@email.com"})]),e.createElement("button",{key:"submit",type:"submit",className:"w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white py-2 px-4 rounded-lg font-medium transition-colors",children:"Send Reset Link"}),e.createElement("div",{key:"links",className:"text-center text-sm text-[var(--muted-foreground)]",children:[e.createElement("a",{key:"login",href:"/login",className:"text-[var(--primary)] hover:underline",children:"Back to login"})]})]})})},parameters:{docs:{description:{story:"Password reset page with email input form. Demonstrates layout with custom form content."}}}},s={args:{title:"Sign in with Magic Link",description:"Enter your email and we'll send you a secure login link",logoSrc:"https://placehold.co/200x200/0ec2bc/FFFFFF?text=Ozean+Licht",backgroundImage:"https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80",children:e.createElement("div",{className:"bg-[var(--card)] backdrop-blur-md p-8 rounded-lg border border-[var(--border)] shadow-lg",children:e.createElement("form",{className:"space-y-6",children:[e.createElement("div",{key:"email-field"},[e.createElement("label",{key:"label",htmlFor:"magic-email",className:"block text-sm font-medium text-[var(--foreground)] mb-2",children:"Email Address"}),e.createElement("input",{key:"input",type:"email",id:"magic-email",className:"w-full px-4 py-2 bg-[var(--input)] text-[var(--foreground)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]",placeholder:"your@email.com"})]),e.createElement("div",{key:"info",className:"text-xs text-[var(--muted-foreground)] bg-[var(--muted)]/20 p-3 rounded",children:"✨ No password required. We'll send a secure link to your email."}),e.createElement("button",{key:"submit",type:"submit",className:"w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white py-2 px-4 rounded-lg font-medium transition-colors",children:"Send Magic Link"}),e.createElement("div",{key:"divider",className:"relative my-6",children:[e.createElement("div",{key:"line",className:"absolute inset-0 flex items-center",children:e.createElement("div",{className:"w-full border-t border-[var(--border)]"})}),e.createElement("div",{key:"text",className:"relative flex justify-center text-xs uppercase",children:e.createElement("span",{className:"bg-[var(--background)] px-2 text-[var(--muted-foreground)]",children:"or"})})]}),e.createElement("div",{key:"links",className:"text-center text-sm text-[var(--muted-foreground)]",children:[e.createElement("a",{key:"password",href:"/login",className:"text-[var(--primary)] hover:underline",children:"Sign in with password"})]})]})})},parameters:{docs:{description:{story:"Magic link authentication page with passwordless login flow. Shows email input with informational message."}}}},l={args:{title:"Welcome Back",description:"Sign in to continue",backgroundImage:"https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80",children:e.createElement(t,{redirectUrl:"/dashboard",showPasswordReset:!0,showRegisterLink:!0})},parameters:{docs:{description:{story:"Authentication layout without logo. Title and description are still displayed."}}}},d={args:{logoSrc:"https://placehold.co/200x200/0ec2bc/FFFFFF?text=Ozean+Licht",backgroundImage:"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80",children:e.createElement(t,{redirectUrl:"/dashboard",showPasswordReset:!0,showRegisterLink:!0})},parameters:{docs:{description:{story:"Authentication layout with only logo (no title or description)."}}}},m={args:{backgroundImage:"https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80",children:e.createElement(t,{redirectUrl:"/dashboard",showPasswordReset:!0,showRegisterLink:!0})},parameters:{docs:{description:{story:"Minimal authentication layout with only form content and background image."}}}},p={args:{title:"Welcome Back",description:"Sign in to continue",logoSrc:"https://placehold.co/200x200/0ec2bc/FFFFFF?text=Ozean+Licht",children:e.createElement(t,{redirectUrl:"/dashboard",showPasswordReset:!0,showRegisterLink:!0})},parameters:{docs:{description:{story:"Authentication layout without background image. Uses solid background color."}}}},h={args:{title:"Welcome Back",description:"Sign in to continue",logoSrc:"https://placehold.co/200x200/0ec2bc/FFFFFF?text=Ozean+Licht",backgroundImage:"https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80",className:"bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A]",children:e.createElement(t,{redirectUrl:"/dashboard",showPasswordReset:!0,showRegisterLink:!0})},parameters:{docs:{description:{story:"Authentication layout with custom className applied for gradient background."}}}},u={args:{title:"Ozean Licht",description:"Deine Reise beginnt hier",logoSrc:"https://placehold.co/200x200/0ec2bc/FFFFFF?text=OL",backgroundImage:"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80&fit=crop&auto=format",children:e.createElement(t,{redirectUrl:"/dashboard",showPasswordReset:!0,showRegisterLink:!0})},parameters:{docs:{description:{story:"Full cosmic dark theme with glass morphism, turquoise accents (#0ec2bc), and atmospheric background."}}}},g={args:{title:"Welcome",description:"Sign in",logoSrc:"https://placehold.co/200x200/0ec2bc/FFFFFF?text=OL",backgroundImage:"https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80",children:e.createElement(t,{redirectUrl:"/dashboard",showPasswordReset:!0,showRegisterLink:!0})},parameters:{viewport:{defaultViewport:"mobile1"},docs:{description:{story:"Authentication layout optimized for mobile devices with responsive padding and font sizes."}}}},b={args:{title:"Welcome Back",description:"Sign in to continue your journey",logoSrc:"https://placehold.co/200x200/0ec2bc/FFFFFF?text=Ozean+Licht",backgroundImage:"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&q=80",children:e.createElement(t,{redirectUrl:"/dashboard",showPasswordReset:!0,showRegisterLink:!0})},parameters:{viewport:{defaultViewport:"tablet"},docs:{description:{story:"Authentication layout on tablet viewport (md breakpoint active for title font size)."}}}},y={render:()=>e.createElement("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-4",children:[e.createElement("div",{key:"full",className:"border border-[var(--border)] rounded-lg overflow-hidden",children:e.createElement("div",{className:"h-[600px]",children:e.createElement(n,{title:"Full Featured",description:"With logo, title, description, and background",logoSrc:"https://placehold.co/200x200/0ec2bc/FFFFFF?text=OL",backgroundImage:"https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80",children:e.createElement("div",{className:"bg-[var(--card)] backdrop-blur-md p-6 rounded-lg border border-[var(--border)] text-center",children:e.createElement("p",{className:"text-sm text-[var(--muted-foreground)]",children:"Login form content"})})})})}),e.createElement("div",{key:"no-logo",className:"border border-[var(--border)] rounded-lg overflow-hidden",children:e.createElement("div",{className:"h-[600px]",children:e.createElement(n,{title:"Without Logo",description:"Title and description only",backgroundImage:"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80",children:e.createElement("div",{className:"bg-[var(--card)] backdrop-blur-md p-6 rounded-lg border border-[var(--border)] text-center",children:e.createElement("p",{className:"text-sm text-[var(--muted-foreground)]",children:"Login form content"})})})})}),e.createElement("div",{key:"logo-only",className:"border border-[var(--border)] rounded-lg overflow-hidden",children:e.createElement("div",{className:"h-[600px]",children:e.createElement(n,{logoSrc:"https://placehold.co/200x200/0ec2bc/FFFFFF?text=OL",backgroundImage:"https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",children:e.createElement("div",{className:"bg-[var(--card)] backdrop-blur-md p-6 rounded-lg border border-[var(--border)] text-center",children:e.createElement("p",{className:"text-sm text-[var(--muted-foreground)]",children:"Login form content"})})})})}),e.createElement("div",{key:"minimal",className:"border border-[var(--border)] rounded-lg overflow-hidden",children:e.createElement("div",{className:"h-[600px]",children:e.createElement(n,{backgroundImage:"https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80",children:e.createElement("div",{className:"bg-[var(--card)] backdrop-blur-md p-6 rounded-lg border border-[var(--border)] text-center",children:e.createElement("p",{className:"text-sm text-[var(--muted-foreground)]",children:"Login form content"})})})})})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Side-by-side comparison of all major layout variants in a grid."}}}},v={render:()=>e.createElement("div",{className:"min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A]",children:e.createElement("div",{className:"container mx-auto px-4 py-12",children:e.createElement("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto",children:[e.createElement("div",{key:"marketing",className:"space-y-8 text-[var(--foreground)] order-2 lg:order-1",children:[e.createElement("div",{key:"header",className:"space-y-4",children:[e.createElement("h1",{key:"title",className:"text-5xl font-light leading-tight",children:"Willkommen bei Ozean Licht"}),e.createElement("p",{key:"subtitle",className:"text-xl text-[var(--muted-foreground)]",children:"Deine Plattform für spirituelles Wachstum und persönliche Transformation."})]}),e.createElement("div",{key:"features",className:"space-y-4",children:[e.createElement("div",{key:"f1",className:"flex items-start gap-3",children:[e.createElement("div",{key:"icon",className:"mt-1 text-[var(--primary)] text-xl",children:"✓"}),e.createElement("div",{key:"text",children:[e.createElement("h3",{key:"h",className:"font-medium",children:"Umfassende Kurse"}),e.createElement("p",{key:"p",className:"text-sm text-[var(--muted-foreground)]",children:"Zugriff auf alle Kurse, Meditationen und Lehrmaterialien"})]})]}),e.createElement("div",{key:"f2",className:"flex items-start gap-3",children:[e.createElement("div",{key:"icon",className:"mt-1 text-[var(--primary)] text-xl",children:"✓"}),e.createElement("div",{key:"text",children:[e.createElement("h3",{key:"h",className:"font-medium",children:"Persönlicher Fortschritt"}),e.createElement("p",{key:"p",className:"text-sm text-[var(--muted-foreground)]",children:"Verfolge deine Entwicklung und setze individuelle Ziele"})]})]}),e.createElement("div",{key:"f3",className:"flex items-start gap-3",children:[e.createElement("div",{key:"icon",className:"mt-1 text-[var(--primary)] text-xl",children:"✓"}),e.createElement("div",{key:"text",children:[e.createElement("h3",{key:"h",className:"font-medium",children:"Community Zugang"}),e.createElement("p",{key:"p",className:"text-sm text-[var(--muted-foreground)]",children:"Verbinde dich mit Gleichgesinnten auf deinem Weg"})]})]})]}),e.createElement("div",{key:"testimonial",className:"bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)] rounded-lg p-6",children:[e.createElement("p",{key:"quote",className:"text-sm italic text-[var(--muted-foreground)] mb-4",children:'"Ozean Licht hat mein Leben verändert. Die Kurse sind tiefgründig und die Community ist inspirierend."'}),e.createElement("div",{key:"author",className:"flex items-center gap-3",children:[e.createElement("div",{key:"avatar",className:"w-10 h-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] font-medium",children:"MK"}),e.createElement("div",{key:"info",children:[e.createElement("p",{key:"name",className:"text-sm font-medium",children:"Maria K."}),e.createElement("p",{key:"role",className:"text-xs text-[var(--muted-foreground)]",children:"Mitglied seit 2023"})]})]})]})]}),e.createElement("div",{key:"form",className:"order-1 lg:order-2",children:e.createElement(n,{title:"Anmelden",description:"Setze deine Reise fort",logoSrc:"https://placehold.co/200x200/0ec2bc/FFFFFF?text=OL",children:e.createElement(t,{redirectUrl:"/dashboard",showPasswordReset:!0,showRegisterLink:!0})})})]})})}),parameters:{layout:"fullscreen",docs:{description:{story:"Complete authentication page with marketing content, features list, testimonial, and AuthLayout component. Demonstrates real-world usage with German content."}}}},x={render:()=>e.createElement("div",{className:"p-8 space-y-8 max-w-6xl mx-auto",children:[e.createElement("div",{key:"header",children:e.createElement("h2",{className:"text-3xl font-semibold text-[var(--foreground)] mb-4",children:"AuthLayout Structure"})}),e.createElement("div",{key:"structure",className:"space-y-6",children:[e.createElement("div",{key:"layer1",className:"p-6 bg-[var(--card)] border border-[var(--border)] rounded-lg",children:[e.createElement("h3",{key:"title",className:"text-lg font-semibold text-[var(--foreground)] mb-3",children:"1. Background Layer (z-0)"}),e.createElement("ul",{key:"list",className:"list-disc list-inside space-y-2 text-sm text-[var(--muted-foreground)]",children:[e.createElement("li",{key:"i1",children:"Optional background image at 10% opacity"}),e.createElement("li",{key:"i2",children:"Gradient overlay from background/50 to solid background"}),e.createElement("li",{key:"i3",children:"Full viewport coverage (absolute inset-0)"})]})]}),e.createElement("div",{key:"layer2",className:"p-6 bg-[var(--card)] border border-[var(--border)] rounded-lg",children:[e.createElement("h3",{key:"title",className:"text-lg font-semibold text-[var(--foreground)] mb-3",children:"2. Content Container (z-10)"}),e.createElement("ul",{key:"list",className:"list-disc list-inside space-y-2 text-sm text-[var(--muted-foreground)]",children:[e.createElement("li",{key:"i1",children:"Max-width: 28rem (448px)"}),e.createElement("li",{key:"i2",children:"Centered with flexbox (items-center justify-center)"}),e.createElement("li",{key:"i3",children:"Padding: 1rem (16px)"}),e.createElement("li",{key:"i4",children:"Space between sections: 2rem (32px)"})]})]}),e.createElement("div",{key:"layer3",className:"p-6 bg-[var(--card)] border border-[var(--border)] rounded-lg",children:[e.createElement("h3",{key:"title",className:"text-lg font-semibold text-[var(--foreground)] mb-3",children:"3. Header Section (Logo, Title, Description)"}),e.createElement("ul",{key:"list",className:"list-disc list-inside space-y-2 text-sm text-[var(--muted-foreground)]",children:[e.createElement("li",{key:"i1",children:"Logo: h-20 (80px height), auto width"}),e.createElement("li",{key:"i2",children:"Title: 3xl (1.875rem) on mobile, 4xl (2.25rem) on md+"}),e.createElement("li",{key:"i3",children:"Description: muted foreground color"}),e.createElement("li",{key:"i4",children:"Text alignment: center"})]})]}),e.createElement("div",{key:"layer4",className:"p-6 bg-[var(--card)] border border-[var(--border)] rounded-lg",children:[e.createElement("h3",{key:"title",className:"text-lg font-semibold text-[var(--foreground)] mb-3",children:"4. Form Content Area"}),e.createElement("ul",{key:"list",className:"list-disc list-inside space-y-2 text-sm text-[var(--muted-foreground)]",children:[e.createElement("li",{key:"i1",children:"Renders children prop (LoginForm, RegisterForm, etc.)"}),e.createElement("li",{key:"i2",children:"No constraints on child content structure"}),e.createElement("li",{key:"i3",children:"Inherits spacing from parent container"})]})]})]}),e.createElement("div",{key:"demo",className:"mt-8",children:[e.createElement("h3",{key:"title",className:"text-xl font-semibold text-[var(--foreground)] mb-4",children:"Visual Example:"}),e.createElement("div",{key:"example",className:"border-2 border-[var(--border)] rounded-lg overflow-hidden",style:{height:"600px"},children:e.createElement(n,{title:"Example Layout",description:"Showcasing the layer structure",logoSrc:"https://placehold.co/200x200/0ec2bc/FFFFFF?text=Logo",backgroundImage:"https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80",children:e.createElement("div",{className:"bg-[var(--card)] backdrop-blur-md p-8 rounded-lg border-2 border-[var(--primary)] shadow-xl",children:e.createElement("p",{className:"text-center text-[var(--muted-foreground)]",children:"This is the children prop area where forms are rendered"})})})})]})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Detailed documentation of the AuthLayout component structure, layers, and spacing system."}}}},f={render:()=>e.createElement("div",{className:"space-y-8 p-6",children:[e.createElement("div",{key:"header",children:[e.createElement("h2",{key:"title",className:"text-2xl font-semibold text-[var(--foreground)] mb-2",children:"Responsive Breakpoints"}),e.createElement("p",{key:"desc",className:"text-[var(--muted-foreground)]",children:"AuthLayout adapts to different screen sizes:"})]}),e.createElement("div",{key:"breakpoints",className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:[e.createElement("div",{key:"mobile",className:"p-4 bg-[var(--card)] border border-[var(--border)] rounded-lg",children:[e.createElement("h3",{key:"title",className:"font-semibold text-[var(--foreground)] mb-3",children:"Mobile (< 768px)"}),e.createElement("ul",{key:"list",className:"text-sm text-[var(--muted-foreground)] space-y-2",children:[e.createElement("li",{key:"i1",children:"• Title: text-3xl (1.875rem)"}),e.createElement("li",{key:"i2",children:"• Padding: p-4 (1rem)"}),e.createElement("li",{key:"i3",children:"• Full-width container"})]})]}),e.createElement("div",{key:"tablet",className:"p-4 bg-[var(--card)] border border-[var(--border)] rounded-lg",children:[e.createElement("h3",{key:"title",className:"font-semibold text-[var(--foreground)] mb-3",children:"Tablet (≥ 768px)"}),e.createElement("ul",{key:"list",className:"text-sm text-[var(--muted-foreground)] space-y-2",children:[e.createElement("li",{key:"i1",children:"• Title: text-4xl (2.25rem)"}),e.createElement("li",{key:"i2",children:"• Padding: p-4 (1rem)"}),e.createElement("li",{key:"i3",children:"• Max-width: 28rem"})]})]}),e.createElement("div",{key:"desktop",className:"p-4 bg-[var(--card)] border border-[var(--border)] rounded-lg",children:[e.createElement("h3",{key:"title",className:"font-semibold text-[var(--foreground)] mb-3",children:"Desktop (≥ 1024px)"}),e.createElement("ul",{key:"list",className:"text-sm text-[var(--muted-foreground)] space-y-2",children:[e.createElement("li",{key:"i1",children:"• Title: text-4xl (2.25rem)"}),e.createElement("li",{key:"i2",children:"• Padding: p-4 (1rem)"}),e.createElement("li",{key:"i3",children:"• Max-width: 28rem"})]})]})]}),e.createElement("div",{key:"demo",className:"mt-4",children:[e.createElement("h3",{key:"title",className:"text-lg font-semibold text-[var(--foreground)] mb-4",children:"Try resizing your browser:"}),e.createElement("div",{key:"example",className:"border border-[var(--border)] rounded-lg overflow-hidden",style:{height:"500px"},children:e.createElement(n,{title:"Responsive Title",description:"Watch the title size change at md breakpoint (768px)",logoSrc:"https://placehold.co/200x200/0ec2bc/FFFFFF?text=R",backgroundImage:"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80",children:e.createElement("div",{className:"bg-[var(--card)] backdrop-blur-md p-6 rounded-lg border border-[var(--border)]",children:e.createElement("p",{className:"text-sm text-[var(--muted-foreground)] text-center",children:"Form content scales with container"})})})})]})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Demonstrates responsive behavior across different screen sizes with detailed breakpoint information."}}}},k={args:{title:"Welcome Back",description:"Sign in to continue",logoSrc:"https://placehold.co/200x200/0ec2bc/FFFFFF?text=Ozean+Licht",backgroundImage:"https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80",children:e.createElement(t,{redirectUrl:"/dashboard",showPasswordReset:!0,showRegisterLink:!0})},parameters:{docs:{description:{story:"Interactive playground to experiment with all AuthLayout props. Use the controls panel to modify props dynamically."}}}};var L,S,A,z,P;a.parameters={...a.parameters,docs:{...(L=a.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    title: 'Welcome Back',
    description: 'Sign in to continue your journey',
    children: React.createElement(LoginForm, {
      redirectUrl: '/dashboard',
      showPasswordReset: true,
      showRegisterLink: true
    })
  }
}`,...(A=(S=a.parameters)==null?void 0:S.docs)==null?void 0:A.source},description:{story:"Default authentication layout with login form",...(P=(z=a.parameters)==null?void 0:z.docs)==null?void 0:P.description}}};var q,I,O,M,T;o.parameters={...o.parameters,docs:{...(q=o.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    title: 'Willkommen zurück',
    description: 'Melde dich an, um auf dein Dashboard zuzugreifen',
    logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=Ozean+Licht',
    backgroundImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80',
    children: React.createElement(LoginForm, {
      redirectUrl: '/dashboard',
      showPasswordReset: true,
      showRegisterLink: true
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete login page with logo, title, description, background image, and login form.'
      }
    }
  }
}`,...(O=(I=o.parameters)==null?void 0:I.docs)==null?void 0:O.source},description:{story:"Login page with all layout features enabled",...(T=(M=o.parameters)==null?void 0:M.docs)==null?void 0:T.description}}};var U,W,C,j,D;i.parameters={...i.parameters,docs:{...(U=i.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    title: 'Join Our Community',
    description: 'Create your account to start your spiritual journey',
    logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=Ozean+Licht',
    backgroundImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80',
    children: React.createElement(RegisterForm, {
      redirectUrl: '/dashboard',
      showLoginLink: true,
      requireTerms: true
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete registration page with logo, title, description, background image, and register form.'
      }
    }
  }
}`,...(C=(W=i.parameters)==null?void 0:W.docs)==null?void 0:C.source},description:{story:"Registration page with all layout features",...(D=(j=i.parameters)==null?void 0:j.docs)==null?void 0:D.description}}};var B,V,K,_,G;c.parameters={...c.parameters,docs:{...(B=c.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    title: 'Reset Password',
    description: 'Enter your email to receive a password reset link',
    logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=Ozean+Licht',
    children: React.createElement('div', {
      className: 'bg-[var(--card)] backdrop-blur-md p-8 rounded-lg border border-[var(--border)] shadow-lg',
      children: React.createElement('form', {
        className: 'space-y-4',
        children: [React.createElement('div', {
          key: 'email-field'
        }, [React.createElement('label', {
          key: 'label',
          htmlFor: 'email',
          className: 'block text-sm font-medium text-[var(--foreground)] mb-2',
          children: 'Email'
        }), React.createElement('input', {
          key: 'input',
          type: 'email',
          id: 'email',
          className: 'w-full px-4 py-2 bg-[var(--input)] text-[var(--foreground)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]',
          placeholder: 'your@email.com'
        })]), React.createElement('button', {
          key: 'submit',
          type: 'submit',
          className: 'w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white py-2 px-4 rounded-lg font-medium transition-colors',
          children: 'Send Reset Link'
        }), React.createElement('div', {
          key: 'links',
          className: 'text-center text-sm text-[var(--muted-foreground)]',
          children: [React.createElement('a', {
            key: 'login',
            href: '/login',
            className: 'text-[var(--primary)] hover:underline',
            children: 'Back to login'
          })]
        })]
      })
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'Password reset page with email input form. Demonstrates layout with custom form content.'
      }
    }
  }
}`,...(K=(V=c.parameters)==null?void 0:V.docs)==null?void 0:K.source},description:{story:"Password reset page",...(G=(_=c.parameters)==null?void 0:_.docs)==null?void 0:G.description}}};var Z,H,J,Q,X;s.parameters={...s.parameters,docs:{...(Z=s.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    title: 'Sign in with Magic Link',
    description: 'Enter your email and we\\'ll send you a secure login link',
    logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=Ozean+Licht',
    backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
    children: React.createElement('div', {
      className: 'bg-[var(--card)] backdrop-blur-md p-8 rounded-lg border border-[var(--border)] shadow-lg',
      children: React.createElement('form', {
        className: 'space-y-6',
        children: [React.createElement('div', {
          key: 'email-field'
        }, [React.createElement('label', {
          key: 'label',
          htmlFor: 'magic-email',
          className: 'block text-sm font-medium text-[var(--foreground)] mb-2',
          children: 'Email Address'
        }), React.createElement('input', {
          key: 'input',
          type: 'email',
          id: 'magic-email',
          className: 'w-full px-4 py-2 bg-[var(--input)] text-[var(--foreground)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]',
          placeholder: 'your@email.com'
        })]), React.createElement('div', {
          key: 'info',
          className: 'text-xs text-[var(--muted-foreground)] bg-[var(--muted)]/20 p-3 rounded',
          children: '✨ No password required. We\\'ll send a secure link to your email.'
        }), React.createElement('button', {
          key: 'submit',
          type: 'submit',
          className: 'w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white py-2 px-4 rounded-lg font-medium transition-colors',
          children: 'Send Magic Link'
        }), React.createElement('div', {
          key: 'divider',
          className: 'relative my-6',
          children: [React.createElement('div', {
            key: 'line',
            className: 'absolute inset-0 flex items-center',
            children: React.createElement('div', {
              className: 'w-full border-t border-[var(--border)]'
            })
          }), React.createElement('div', {
            key: 'text',
            className: 'relative flex justify-center text-xs uppercase',
            children: React.createElement('span', {
              className: 'bg-[var(--background)] px-2 text-[var(--muted-foreground)]',
              children: 'or'
            })
          })]
        }), React.createElement('div', {
          key: 'links',
          className: 'text-center text-sm text-[var(--muted-foreground)]',
          children: [React.createElement('a', {
            key: 'password',
            href: '/login',
            className: 'text-[var(--primary)] hover:underline',
            children: 'Sign in with password'
          })]
        })]
      })
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'Magic link authentication page with passwordless login flow. Shows email input with informational message.'
      }
    }
  }
}`,...(J=(H=s.parameters)==null?void 0:H.docs)==null?void 0:J.source},description:{story:"Magic link authentication page",...(X=(Q=s.parameters)==null?void 0:Q.docs)==null?void 0:X.description}}};var Y,$,ee,te,re;l.parameters={...l.parameters,docs:{...(Y=l.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    title: 'Welcome Back',
    description: 'Sign in to continue',
    backgroundImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80',
    children: React.createElement(LoginForm, {
      redirectUrl: '/dashboard',
      showPasswordReset: true,
      showRegisterLink: true
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'Authentication layout without logo. Title and description are still displayed.'
      }
    }
  }
}`,...(ee=($=l.parameters)==null?void 0:$.docs)==null?void 0:ee.source},description:{story:"Layout without logo (title and description only)",...(re=(te=l.parameters)==null?void 0:te.docs)==null?void 0:re.description}}};var ne,ae,oe,ie,ce;d.parameters={...d.parameters,docs:{...(ne=d.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=Ozean+Licht',
    backgroundImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80',
    children: React.createElement(LoginForm, {
      redirectUrl: '/dashboard',
      showPasswordReset: true,
      showRegisterLink: true
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'Authentication layout with only logo (no title or description).'
      }
    }
  }
}`,...(oe=(ae=d.parameters)==null?void 0:ae.docs)==null?void 0:oe.source},description:{story:"Layout without title and description (logo only)",...(ce=(ie=d.parameters)==null?void 0:ie.docs)==null?void 0:ce.description}}};var se,le,de,me,pe;m.parameters={...m.parameters,docs:{...(se=m.parameters)==null?void 0:se.docs,source:{originalSource:`{
  args: {
    backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
    children: React.createElement(LoginForm, {
      redirectUrl: '/dashboard',
      showPasswordReset: true,
      showRegisterLink: true
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal authentication layout with only form content and background image.'
      }
    }
  }
}`,...(de=(le=m.parameters)==null?void 0:le.docs)==null?void 0:de.source},description:{story:"Minimal layout (no logo, title, or description)",...(pe=(me=m.parameters)==null?void 0:me.docs)==null?void 0:pe.description}}};var he,ue,ge,be,ye;p.parameters={...p.parameters,docs:{...(he=p.parameters)==null?void 0:he.docs,source:{originalSource:`{
  args: {
    title: 'Welcome Back',
    description: 'Sign in to continue',
    logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=Ozean+Licht',
    children: React.createElement(LoginForm, {
      redirectUrl: '/dashboard',
      showPasswordReset: true,
      showRegisterLink: true
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'Authentication layout without background image. Uses solid background color.'
      }
    }
  }
}`,...(ge=(ue=p.parameters)==null?void 0:ue.docs)==null?void 0:ge.source},description:{story:"Layout without background image",...(ye=(be=p.parameters)==null?void 0:be.docs)==null?void 0:ye.description}}};var ve,xe,fe,ke,Ee;h.parameters={...h.parameters,docs:{...(ve=h.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  args: {
    title: 'Welcome Back',
    description: 'Sign in to continue',
    logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=Ozean+Licht',
    backgroundImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80',
    className: 'bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A]',
    children: React.createElement(LoginForm, {
      redirectUrl: '/dashboard',
      showPasswordReset: true,
      showRegisterLink: true
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'Authentication layout with custom className applied for gradient background.'
      }
    }
  }
}`,...(fe=(xe=h.parameters)==null?void 0:xe.docs)==null?void 0:fe.source},description:{story:"Layout with custom styling",...(Ee=(ke=h.parameters)==null?void 0:ke.docs)==null?void 0:Ee.description}}};var we,Fe,Re,Ne,Le;u.parameters={...u.parameters,docs:{...(we=u.parameters)==null?void 0:we.docs,source:{originalSource:`{
  args: {
    title: 'Ozean Licht',
    description: 'Deine Reise beginnt hier',
    logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=OL',
    backgroundImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80&fit=crop&auto=format',
    children: React.createElement(LoginForm, {
      redirectUrl: '/dashboard',
      showPasswordReset: true,
      showRegisterLink: true
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'Full cosmic dark theme with glass morphism, turquoise accents (#0ec2bc), and atmospheric background.'
      }
    }
  }
}`,...(Re=(Fe=u.parameters)==null?void 0:Fe.docs)==null?void 0:Re.source},description:{story:"Cosmic dark theme showcase",...(Le=(Ne=u.parameters)==null?void 0:Ne.docs)==null?void 0:Le.description}}};var Se,Ae,ze,Pe,qe;g.parameters={...g.parameters,docs:{...(Se=g.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  args: {
    title: 'Welcome',
    description: 'Sign in',
    logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=OL',
    backgroundImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80',
    children: React.createElement(LoginForm, {
      redirectUrl: '/dashboard',
      showPasswordReset: true,
      showRegisterLink: true
    })
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Authentication layout optimized for mobile devices with responsive padding and font sizes.'
      }
    }
  }
}`,...(ze=(Ae=g.parameters)==null?void 0:Ae.docs)==null?void 0:ze.source},description:{story:"Mobile responsive view",...(qe=(Pe=g.parameters)==null?void 0:Pe.docs)==null?void 0:qe.description}}};var Ie,Oe,Me,Te,Ue;b.parameters={...b.parameters,docs:{...(Ie=b.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  args: {
    title: 'Welcome Back',
    description: 'Sign in to continue your journey',
    logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=Ozean+Licht',
    backgroundImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&q=80',
    children: React.createElement(LoginForm, {
      redirectUrl: '/dashboard',
      showPasswordReset: true,
      showRegisterLink: true
    })
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    },
    docs: {
      description: {
        story: 'Authentication layout on tablet viewport (md breakpoint active for title font size).'
      }
    }
  }
}`,...(Me=(Oe=b.parameters)==null?void 0:Oe.docs)==null?void 0:Me.source},description:{story:"Tablet responsive view",...(Ue=(Te=b.parameters)==null?void 0:Te.docs)==null?void 0:Ue.description}}};var We,Ce,je,De,Be;y.parameters={...y.parameters,docs:{...(We=y.parameters)==null?void 0:We.docs,source:{originalSource:`{
  render: () => React.createElement('div', {
    className: 'grid grid-cols-1 lg:grid-cols-2 gap-4',
    children: [React.createElement('div', {
      key: 'full',
      className: 'border border-[var(--border)] rounded-lg overflow-hidden',
      children: React.createElement('div', {
        className: 'h-[600px]',
        children: React.createElement(AuthLayout, {
          title: 'Full Featured',
          description: 'With logo, title, description, and background',
          logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=OL',
          backgroundImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80',
          children: React.createElement('div', {
            className: 'bg-[var(--card)] backdrop-blur-md p-6 rounded-lg border border-[var(--border)] text-center',
            children: React.createElement('p', {
              className: 'text-sm text-[var(--muted-foreground)]',
              children: 'Login form content'
            })
          })
        })
      })
    }), React.createElement('div', {
      key: 'no-logo',
      className: 'border border-[var(--border)] rounded-lg overflow-hidden',
      children: React.createElement('div', {
        className: 'h-[600px]',
        children: React.createElement(AuthLayout, {
          title: 'Without Logo',
          description: 'Title and description only',
          backgroundImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80',
          children: React.createElement('div', {
            className: 'bg-[var(--card)] backdrop-blur-md p-6 rounded-lg border border-[var(--border)] text-center',
            children: React.createElement('p', {
              className: 'text-sm text-[var(--muted-foreground)]',
              children: 'Login form content'
            })
          })
        })
      })
    }), React.createElement('div', {
      key: 'logo-only',
      className: 'border border-[var(--border)] rounded-lg overflow-hidden',
      children: React.createElement('div', {
        className: 'h-[600px]',
        children: React.createElement(AuthLayout, {
          logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=OL',
          backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
          children: React.createElement('div', {
            className: 'bg-[var(--card)] backdrop-blur-md p-6 rounded-lg border border-[var(--border)] text-center',
            children: React.createElement('p', {
              className: 'text-sm text-[var(--muted-foreground)]',
              children: 'Login form content'
            })
          })
        })
      })
    }), React.createElement('div', {
      key: 'minimal',
      className: 'border border-[var(--border)] rounded-lg overflow-hidden',
      children: React.createElement('div', {
        className: 'h-[600px]',
        children: React.createElement(AuthLayout, {
          backgroundImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80',
          children: React.createElement('div', {
            className: 'bg-[var(--card)] backdrop-blur-md p-6 rounded-lg border border-[var(--border)] text-center',
            children: React.createElement('p', {
              className: 'text-sm text-[var(--muted-foreground)]',
              children: 'Login form content'
            })
          })
        })
      })
    })]
  }),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Side-by-side comparison of all major layout variants in a grid.'
      }
    }
  }
}`,...(je=(Ce=y.parameters)==null?void 0:Ce.docs)==null?void 0:je.source},description:{story:"Side-by-side comparison of all variants",...(Be=(De=y.parameters)==null?void 0:De.docs)==null?void 0:Be.description}}};var Ve,Ke,_e,Ge,Ze;v.parameters={...v.parameters,docs:{...(Ve=v.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
  render: () => React.createElement('div', {
    className: 'min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A]',
    children: React.createElement('div', {
      className: 'container mx-auto px-4 py-12',
      children: React.createElement('div', {
        className: 'grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto',
        children: [React.createElement('div', {
          key: 'marketing',
          className: 'space-y-8 text-[var(--foreground)] order-2 lg:order-1',
          children: [React.createElement('div', {
            key: 'header',
            className: 'space-y-4',
            children: [React.createElement('h1', {
              key: 'title',
              className: 'text-5xl font-light leading-tight',
              children: 'Willkommen bei Ozean Licht'
            }), React.createElement('p', {
              key: 'subtitle',
              className: 'text-xl text-[var(--muted-foreground)]',
              children: 'Deine Plattform für spirituelles Wachstum und persönliche Transformation.'
            })]
          }), React.createElement('div', {
            key: 'features',
            className: 'space-y-4',
            children: [React.createElement('div', {
              key: 'f1',
              className: 'flex items-start gap-3',
              children: [React.createElement('div', {
                key: 'icon',
                className: 'mt-1 text-[var(--primary)] text-xl',
                children: '✓'
              }), React.createElement('div', {
                key: 'text',
                children: [React.createElement('h3', {
                  key: 'h',
                  className: 'font-medium',
                  children: 'Umfassende Kurse'
                }), React.createElement('p', {
                  key: 'p',
                  className: 'text-sm text-[var(--muted-foreground)]',
                  children: 'Zugriff auf alle Kurse, Meditationen und Lehrmaterialien'
                })]
              })]
            }), React.createElement('div', {
              key: 'f2',
              className: 'flex items-start gap-3',
              children: [React.createElement('div', {
                key: 'icon',
                className: 'mt-1 text-[var(--primary)] text-xl',
                children: '✓'
              }), React.createElement('div', {
                key: 'text',
                children: [React.createElement('h3', {
                  key: 'h',
                  className: 'font-medium',
                  children: 'Persönlicher Fortschritt'
                }), React.createElement('p', {
                  key: 'p',
                  className: 'text-sm text-[var(--muted-foreground)]',
                  children: 'Verfolge deine Entwicklung und setze individuelle Ziele'
                })]
              })]
            }), React.createElement('div', {
              key: 'f3',
              className: 'flex items-start gap-3',
              children: [React.createElement('div', {
                key: 'icon',
                className: 'mt-1 text-[var(--primary)] text-xl',
                children: '✓'
              }), React.createElement('div', {
                key: 'text',
                children: [React.createElement('h3', {
                  key: 'h',
                  className: 'font-medium',
                  children: 'Community Zugang'
                }), React.createElement('p', {
                  key: 'p',
                  className: 'text-sm text-[var(--muted-foreground)]',
                  children: 'Verbinde dich mit Gleichgesinnten auf deinem Weg'
                })]
              })]
            })]
          }), React.createElement('div', {
            key: 'testimonial',
            className: 'bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)] rounded-lg p-6',
            children: [React.createElement('p', {
              key: 'quote',
              className: 'text-sm italic text-[var(--muted-foreground)] mb-4',
              children: '"Ozean Licht hat mein Leben verändert. Die Kurse sind tiefgründig und die Community ist inspirierend."'
            }), React.createElement('div', {
              key: 'author',
              className: 'flex items-center gap-3',
              children: [React.createElement('div', {
                key: 'avatar',
                className: 'w-10 h-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] font-medium',
                children: 'MK'
              }), React.createElement('div', {
                key: 'info',
                children: [React.createElement('p', {
                  key: 'name',
                  className: 'text-sm font-medium',
                  children: 'Maria K.'
                }), React.createElement('p', {
                  key: 'role',
                  className: 'text-xs text-[var(--muted-foreground)]',
                  children: 'Mitglied seit 2023'
                })]
              })]
            })]
          })]
        }), React.createElement('div', {
          key: 'form',
          className: 'order-1 lg:order-2',
          children: React.createElement(AuthLayout, {
            title: 'Anmelden',
            description: 'Setze deine Reise fort',
            logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=OL',
            children: React.createElement(LoginForm, {
              redirectUrl: '/dashboard',
              showPasswordReset: true,
              showRegisterLink: true
            })
          })
        })]
      })
    })
  }),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Complete authentication page with marketing content, features list, testimonial, and AuthLayout component. Demonstrates real-world usage with German content.'
      }
    }
  }
}`,...(_e=(Ke=v.parameters)==null?void 0:Ke.docs)==null?void 0:_e.source},description:{story:"Complete authentication flow showcase with German content",...(Ze=(Ge=v.parameters)==null?void 0:Ge.docs)==null?void 0:Ze.description}}};var He,Je,Qe,Xe,Ye;x.parameters={...x.parameters,docs:{...(He=x.parameters)==null?void 0:He.docs,source:{originalSource:`{
  render: () => React.createElement('div', {
    className: 'p-8 space-y-8 max-w-6xl mx-auto',
    children: [React.createElement('div', {
      key: 'header',
      children: React.createElement('h2', {
        className: 'text-3xl font-semibold text-[var(--foreground)] mb-4',
        children: 'AuthLayout Structure'
      })
    }), React.createElement('div', {
      key: 'structure',
      className: 'space-y-6',
      children: [React.createElement('div', {
        key: 'layer1',
        className: 'p-6 bg-[var(--card)] border border-[var(--border)] rounded-lg',
        children: [React.createElement('h3', {
          key: 'title',
          className: 'text-lg font-semibold text-[var(--foreground)] mb-3',
          children: '1. Background Layer (z-0)'
        }), React.createElement('ul', {
          key: 'list',
          className: 'list-disc list-inside space-y-2 text-sm text-[var(--muted-foreground)]',
          children: [React.createElement('li', {
            key: 'i1',
            children: 'Optional background image at 10% opacity'
          }), React.createElement('li', {
            key: 'i2',
            children: 'Gradient overlay from background/50 to solid background'
          }), React.createElement('li', {
            key: 'i3',
            children: 'Full viewport coverage (absolute inset-0)'
          })]
        })]
      }), React.createElement('div', {
        key: 'layer2',
        className: 'p-6 bg-[var(--card)] border border-[var(--border)] rounded-lg',
        children: [React.createElement('h3', {
          key: 'title',
          className: 'text-lg font-semibold text-[var(--foreground)] mb-3',
          children: '2. Content Container (z-10)'
        }), React.createElement('ul', {
          key: 'list',
          className: 'list-disc list-inside space-y-2 text-sm text-[var(--muted-foreground)]',
          children: [React.createElement('li', {
            key: 'i1',
            children: 'Max-width: 28rem (448px)'
          }), React.createElement('li', {
            key: 'i2',
            children: 'Centered with flexbox (items-center justify-center)'
          }), React.createElement('li', {
            key: 'i3',
            children: 'Padding: 1rem (16px)'
          }), React.createElement('li', {
            key: 'i4',
            children: 'Space between sections: 2rem (32px)'
          })]
        })]
      }), React.createElement('div', {
        key: 'layer3',
        className: 'p-6 bg-[var(--card)] border border-[var(--border)] rounded-lg',
        children: [React.createElement('h3', {
          key: 'title',
          className: 'text-lg font-semibold text-[var(--foreground)] mb-3',
          children: '3. Header Section (Logo, Title, Description)'
        }), React.createElement('ul', {
          key: 'list',
          className: 'list-disc list-inside space-y-2 text-sm text-[var(--muted-foreground)]',
          children: [React.createElement('li', {
            key: 'i1',
            children: 'Logo: h-20 (80px height), auto width'
          }), React.createElement('li', {
            key: 'i2',
            children: 'Title: 3xl (1.875rem) on mobile, 4xl (2.25rem) on md+'
          }), React.createElement('li', {
            key: 'i3',
            children: 'Description: muted foreground color'
          }), React.createElement('li', {
            key: 'i4',
            children: 'Text alignment: center'
          })]
        })]
      }), React.createElement('div', {
        key: 'layer4',
        className: 'p-6 bg-[var(--card)] border border-[var(--border)] rounded-lg',
        children: [React.createElement('h3', {
          key: 'title',
          className: 'text-lg font-semibold text-[var(--foreground)] mb-3',
          children: '4. Form Content Area'
        }), React.createElement('ul', {
          key: 'list',
          className: 'list-disc list-inside space-y-2 text-sm text-[var(--muted-foreground)]',
          children: [React.createElement('li', {
            key: 'i1',
            children: 'Renders children prop (LoginForm, RegisterForm, etc.)'
          }), React.createElement('li', {
            key: 'i2',
            children: 'No constraints on child content structure'
          }), React.createElement('li', {
            key: 'i3',
            children: 'Inherits spacing from parent container'
          })]
        })]
      })]
    }), React.createElement('div', {
      key: 'demo',
      className: 'mt-8',
      children: [React.createElement('h3', {
        key: 'title',
        className: 'text-xl font-semibold text-[var(--foreground)] mb-4',
        children: 'Visual Example:'
      }), React.createElement('div', {
        key: 'example',
        className: 'border-2 border-[var(--border)] rounded-lg overflow-hidden',
        style: {
          height: '600px'
        },
        children: React.createElement(AuthLayout, {
          title: 'Example Layout',
          description: 'Showcasing the layer structure',
          logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=Logo',
          backgroundImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80',
          children: React.createElement('div', {
            className: 'bg-[var(--card)] backdrop-blur-md p-8 rounded-lg border-2 border-[var(--primary)] shadow-xl',
            children: React.createElement('p', {
              className: 'text-center text-[var(--muted-foreground)]',
              children: 'This is the children prop area where forms are rendered'
            })
          })
        })
      })]
    })]
  }),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Detailed documentation of the AuthLayout component structure, layers, and spacing system.'
      }
    }
  }
}`,...(Qe=(Je=x.parameters)==null?void 0:Je.docs)==null?void 0:Qe.source},description:{story:"Layout structure documentation",...(Ye=(Xe=x.parameters)==null?void 0:Xe.docs)==null?void 0:Ye.description}}};var $e,et,tt,rt,nt;f.parameters={...f.parameters,docs:{...($e=f.parameters)==null?void 0:$e.docs,source:{originalSource:`{
  render: () => React.createElement('div', {
    className: 'space-y-8 p-6',
    children: [React.createElement('div', {
      key: 'header',
      children: [React.createElement('h2', {
        key: 'title',
        className: 'text-2xl font-semibold text-[var(--foreground)] mb-2',
        children: 'Responsive Breakpoints'
      }), React.createElement('p', {
        key: 'desc',
        className: 'text-[var(--muted-foreground)]',
        children: 'AuthLayout adapts to different screen sizes:'
      })]
    }), React.createElement('div', {
      key: 'breakpoints',
      className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
      children: [React.createElement('div', {
        key: 'mobile',
        className: 'p-4 bg-[var(--card)] border border-[var(--border)] rounded-lg',
        children: [React.createElement('h3', {
          key: 'title',
          className: 'font-semibold text-[var(--foreground)] mb-3',
          children: 'Mobile (< 768px)'
        }), React.createElement('ul', {
          key: 'list',
          className: 'text-sm text-[var(--muted-foreground)] space-y-2',
          children: [React.createElement('li', {
            key: 'i1',
            children: '• Title: text-3xl (1.875rem)'
          }), React.createElement('li', {
            key: 'i2',
            children: '• Padding: p-4 (1rem)'
          }), React.createElement('li', {
            key: 'i3',
            children: '• Full-width container'
          })]
        })]
      }), React.createElement('div', {
        key: 'tablet',
        className: 'p-4 bg-[var(--card)] border border-[var(--border)] rounded-lg',
        children: [React.createElement('h3', {
          key: 'title',
          className: 'font-semibold text-[var(--foreground)] mb-3',
          children: 'Tablet (≥ 768px)'
        }), React.createElement('ul', {
          key: 'list',
          className: 'text-sm text-[var(--muted-foreground)] space-y-2',
          children: [React.createElement('li', {
            key: 'i1',
            children: '• Title: text-4xl (2.25rem)'
          }), React.createElement('li', {
            key: 'i2',
            children: '• Padding: p-4 (1rem)'
          }), React.createElement('li', {
            key: 'i3',
            children: '• Max-width: 28rem'
          })]
        })]
      }), React.createElement('div', {
        key: 'desktop',
        className: 'p-4 bg-[var(--card)] border border-[var(--border)] rounded-lg',
        children: [React.createElement('h3', {
          key: 'title',
          className: 'font-semibold text-[var(--foreground)] mb-3',
          children: 'Desktop (≥ 1024px)'
        }), React.createElement('ul', {
          key: 'list',
          className: 'text-sm text-[var(--muted-foreground)] space-y-2',
          children: [React.createElement('li', {
            key: 'i1',
            children: '• Title: text-4xl (2.25rem)'
          }), React.createElement('li', {
            key: 'i2',
            children: '• Padding: p-4 (1rem)'
          }), React.createElement('li', {
            key: 'i3',
            children: '• Max-width: 28rem'
          })]
        })]
      })]
    }), React.createElement('div', {
      key: 'demo',
      className: 'mt-4',
      children: [React.createElement('h3', {
        key: 'title',
        className: 'text-lg font-semibold text-[var(--foreground)] mb-4',
        children: 'Try resizing your browser:'
      }), React.createElement('div', {
        key: 'example',
        className: 'border border-[var(--border)] rounded-lg overflow-hidden',
        style: {
          height: '500px'
        },
        children: React.createElement(AuthLayout, {
          title: 'Responsive Title',
          description: 'Watch the title size change at md breakpoint (768px)',
          logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=R',
          backgroundImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80',
          children: React.createElement('div', {
            className: 'bg-[var(--card)] backdrop-blur-md p-6 rounded-lg border border-[var(--border)]',
            children: React.createElement('p', {
              className: 'text-sm text-[var(--muted-foreground)] text-center',
              children: 'Form content scales with container'
            })
          })
        })
      })]
    })]
  }),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Demonstrates responsive behavior across different screen sizes with detailed breakpoint information.'
      }
    }
  }
}`,...(tt=(et=f.parameters)==null?void 0:et.docs)==null?void 0:tt.source},description:{story:"Responsive behavior demonstration",...(nt=(rt=f.parameters)==null?void 0:rt.docs)==null?void 0:nt.description}}};var at,ot,it,ct,st;k.parameters={...k.parameters,docs:{...(at=k.parameters)==null?void 0:at.docs,source:{originalSource:`{
  args: {
    title: 'Welcome Back',
    description: 'Sign in to continue',
    logoSrc: 'https://placehold.co/200x200/0ec2bc/FFFFFF?text=Ozean+Licht',
    backgroundImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80',
    children: React.createElement(LoginForm, {
      redirectUrl: '/dashboard',
      showPasswordReset: true,
      showRegisterLink: true
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to experiment with all AuthLayout props. Use the controls panel to modify props dynamically.'
      }
    }
  }
}`,...(it=(ot=k.parameters)==null?void 0:ot.docs)==null?void 0:it.source},description:{story:"Interactive playground with all controls",...(st=(ct=k.parameters)==null?void 0:ct.docs)==null?void 0:st.description}}};const Gt=["Default","LoginPage","RegisterPage","PasswordResetPage","MagicLinkPage","WithoutLogo","LogoOnly","MinimalLayout","NoBackgroundImage","CustomStyling","CosmicTheme","MobileView","TabletView","AllVariants","AuthenticationFlow","LayoutStructure","ResponsiveBehavior","Playground"];export{y as AllVariants,v as AuthenticationFlow,u as CosmicTheme,h as CustomStyling,a as Default,x as LayoutStructure,o as LoginPage,d as LogoOnly,s as MagicLinkPage,m as MinimalLayout,g as MobileView,p as NoBackgroundImage,c as PasswordResetPage,k as Playground,i as RegisterPage,f as ResponsiveBehavior,b as TabletView,l as WithoutLogo,Gt as __namedExportsOrder,_t as default};
