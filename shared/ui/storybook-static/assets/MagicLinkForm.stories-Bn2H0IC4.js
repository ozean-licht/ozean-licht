import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{r as y}from"./index-B2-qRKKC.js";import{u as ir}from"./index.esm-SGBzMz4R.js";import{a as tr,o as or,s as nr}from"./schemas-C3QG-Qu7.js";import{C as lr,a as dr,b as cr,c as mr,d as ur}from"./Card-B3jXYF8b.js";import{B as pr}from"./Button-Clfx5zjS.js";import{L as gr,I as hr}from"./Input-B8-YZaEC.js";import{A as S,a as E}from"./alert-JMCFSqIB.js";import{c as xr}from"./cn-CytzSlOG.js";import{f as A}from"./index-CJu6nLMj.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-DVF2XGCm.js";import"./card-DrBDOuQX.js";import"./button-C8qtCU0L.js";import"./index-BiMR7eR1.js";import"./index-BFjtS4uE.js";import"./input-Db9iZ-Hs.js";import"./textarea-Cd1j4ONA.js";import"./label-Cp9r14oL.js";import"./index-B5oyz0SX.js";import"./index-kS-9iBlu.js";const fr=or({email:nr().email("Invalid email address")});function s({onSuccess:r,onError:v,className:Ze}){var M;const[N,k]=y.useState(""),[Ye,Je]=y.useState(!1),[j,w]=y.useState(!1),{register:Qe,handleSubmit:er,formState:{errors:rr}}=ir({resolver:tr(fr)}),sr=async br=>{k(""),w(!0);try{await new Promise(a=>setTimeout(a,1e3)),Je(!0),r==null||r()}catch(a){const ar=a instanceof Error?a.message:"An error occurred";k(ar),v==null||v(a)}finally{w(!1)}};return e.jsxs(lr,{variant:"default",className:xr("w-full max-w-md shadow-lg",Ze),children:[e.jsxs(dr,{className:"space-y-4 text-center",children:[e.jsx(cr,{className:"text-2xl font-light",children:"Magic Link Anmeldung"}),e.jsx(mr,{children:"Erhalte einen sicheren Anmeldelink per E-Mail. Kein Passwort erforderlich."})]}),e.jsxs(ur,{className:"space-y-6",children:[Ye?e.jsx(S,{className:"border-green-500 bg-green-500/10",children:e.jsx(E,{className:"text-green-400",children:"Ein Magic Link wurde an deine E-Mail-Adresse gesendet. Überprüfe dein Postfach."})}):e.jsxs("form",{onSubmit:er(sr),className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(gr,{htmlFor:"email",children:"Email"}),e.jsx(hr,{id:"email",type:"email",placeholder:"deine@mail.com",...Qe("email"),error:(M=rr.email)==null?void 0:M.message})]}),N&&e.jsx(S,{variant:"destructive",children:e.jsx(E,{children:N})}),e.jsx(pr,{type:"submit",variant:"primary",fullWidth:!0,disabled:j,className:"text-lg py-3",children:j?"Wird gesendet...":"Magic Link Senden"})]}),e.jsx("div",{className:"text-center text-xs text-[var(--muted-foreground)]",children:e.jsx("a",{href:"/login",className:"text-primary hover:underline font-medium",children:"Mit Passwort anmelden"})})]})]})}s.displayName="MagicLinkForm";try{s.displayName="MagicLinkForm",s.__docgenInfo={description:"",displayName:"MagicLinkForm",props:{onSuccess:{defaultValue:null,description:"",name:"onSuccess",required:!1,type:{name:"(() => void)"}},onError:{defaultValue:null,description:"",name:"onError",required:!1,type:{name:"((error: Error) => void)"}},redirectUrl:{defaultValue:null,description:"",name:"redirectUrl",required:!1,type:{name:"string"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const qr={title:"Tier 3: Compositions/Forms/MagicLinkForm",component:s,parameters:{layout:"centered",docs:{description:{component:"Passwordless authentication form that sends a secure magic link to the user's email. Features Ozean Licht branding with glass morphism card design and turquoise accents. Provides a smooth user experience with clear state feedback."}}},tags:["autodocs"],argTypes:{onSuccess:{description:"Callback function called when magic link is sent successfully",control:!1,action:"magic-link-success"},onError:{description:"Callback function called when magic link sending fails",control:!1,action:"magic-link-error"},redirectUrl:{description:"URL to redirect to after successful magic link sending (optional)",control:"text",table:{defaultValue:{summary:"undefined"}}},className:{description:"Custom className for styling",control:"text"}},args:{onSuccess:A(),onError:A()},decorators:[r=>e.jsx("div",{className:"w-full max-w-md p-4",children:e.jsx(r,{})})]},i={args:{}},t={args:{redirectUrl:"/check-email"},parameters:{docs:{description:{story:"Magic link form configured to redirect to a confirmation page after sending the link."}}}},o={args:{className:"shadow-2xl border-2 border-[var(--primary)]"},parameters:{docs:{description:{story:"Magic link form with custom className applied for enhanced border and shadow effects."}}}},n={args:{onSuccess:()=>{console.log("Magic link sent successfully"),alert("Magic link has been sent to your email! Check your inbox.")}},parameters:{docs:{description:{story:"Demonstrates success handling callback. Submit the form to see the success handler in action (simulates 1s API call)."}}}},l={args:{onError:r=>{console.error("Magic link error:",r),alert(`Failed to send magic link: ${r.message}`)}},parameters:{docs:{description:{story:"Demonstrates error handling callback. The form shows inline errors for validation and server errors in an Alert component."}}}},d={args:{},decorators:[r=>e.jsx("div",{className:"min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center",children:e.jsx(r,{})})],parameters:{layout:"fullscreen",docs:{description:{story:"Magic link form displayed on cosmic dark background showcasing glass morphism effect and turquoise accents."}}}},c={args:{},decorators:[r=>e.jsx("div",{className:"w-full max-w-[320px] p-4",children:e.jsx(r,{})})],parameters:{viewport:{defaultViewport:"mobile1"},docs:{description:{story:"Magic link form optimized for mobile viewports with responsive layout."}}}},m={args:{},decorators:[r=>e.jsx("div",{className:"w-full max-w-2xl p-4",children:e.jsx(r,{})})],parameters:{docs:{description:{story:"Magic link form in a wider container. The form maintains its max-width constraint."}}}},u={args:{},parameters:{docs:{description:{story:"Interactive playground to test all props and behaviors. Use the controls panel to modify props dynamically."}}}},p={render:()=>e.jsxs("div",{className:"space-y-6 w-full max-w-2xl",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-2 text-[var(--foreground)]",children:"Validation Rules"}),e.jsx("ul",{className:"list-disc list-inside space-y-1 text-sm text-[var(--muted-foreground)]",children:e.jsx("li",{children:"Email: Must be a valid email address"})})]}),e.jsx(s,{onSuccess:()=>console.log("Magic link sent"),onError:r=>console.error("Error:",r)}),e.jsxs("div",{className:"text-xs text-[var(--muted-foreground)] space-y-1",children:[e.jsx("p",{children:e.jsx("strong",{children:"Try these test cases:"})}),e.jsxs("ul",{className:"list-disc list-inside space-y-1 ml-4",children:[e.jsx("li",{children:'Invalid email: "test" (shows "Invalid email address")'}),e.jsx("li",{children:'Invalid email: "test@" (shows "Invalid email address")'}),e.jsx("li",{children:'Invalid email: "@example.com" (shows "Invalid email address")'}),e.jsx("li",{children:'Valid email: "test@example.com" (submits successfully)'})]})]})]}),parameters:{layout:"centered",docs:{description:{story:"Demonstrates form validation with Zod schema. Try submitting with invalid email formats to see error messages."}}}},g={render:()=>e.jsx("div",{className:"min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center",children:e.jsxs("div",{className:"w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center",children:[e.jsxs("div",{className:"space-y-6 text-[var(--foreground)]",children:[e.jsx("h1",{className:"text-4xl font-light",children:"Sicher & Einfach"}),e.jsx("p",{className:"text-lg text-[var(--muted-foreground)]",children:"Melde dich ohne Passwort an. Wir senden dir einen sicheren Link per E-Mail, mit dem du dich sofort anmelden kannst."}),e.jsxs("ul",{className:"space-y-3 text-sm",children:[e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"text-[var(--primary)] mt-1",children:"✓"}),e.jsx("span",{children:"Kein Passwort merken - einfach E-Mail eingeben"})]}),e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"text-[var(--primary)] mt-1",children:"✓"}),e.jsx("span",{children:"Höhere Sicherheit durch zeitlich begrenzte Links"})]}),e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"text-[var(--primary)] mt-1",children:"✓"}),e.jsx("span",{children:"Funktioniert auf allen deinen Geräten"})]}),e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"text-[var(--primary)] mt-1",children:"✓"}),e.jsx("span",{children:"Keine Sorgen über vergessene Passwörter"})]})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)]/50 rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-sm",children:"So funktioniert's:"}),e.jsxs("ol",{className:"list-decimal list-inside space-y-1 text-xs text-[var(--muted-foreground)]",children:[e.jsx("li",{children:"E-Mail-Adresse eingeben"}),e.jsx("li",{children:"Magic Link anfordern"}),e.jsx("li",{children:"E-Mail in deinem Postfach öffnen"}),e.jsx("li",{children:"Auf den Link klicken und automatisch anmelden"})]})]})]}),e.jsx("div",{children:e.jsx(s,{onSuccess:()=>console.log("Magic link sent"),onError:r=>console.error("Error:",r)})})]})}),parameters:{layout:"fullscreen",docs:{description:{story:"Complete passwordless authentication page layout with marketing copy and magic link form, showcasing real-world usage."}}}},h={render:()=>e.jsxs("div",{className:"space-y-8 p-6 max-w-7xl",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"Default State (Initial)"}),e.jsx("div",{className:"max-w-md",children:e.jsx(s,{})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"With Custom Styling"}),e.jsx("div",{className:"max-w-md",children:e.jsx(s,{className:"border-2 border-[var(--primary)] shadow-2xl"})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"With Redirect Configuration"}),e.jsx("div",{className:"max-w-md",children:e.jsx(s,{redirectUrl:"/check-email"})})]})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Side-by-side comparison of different form configurations."}}}},x={render:()=>e.jsxs("div",{className:"space-y-6 p-6 max-w-4xl",children:[e.jsx("div",{children:e.jsx("h2",{className:"text-2xl font-semibold mb-4 text-[var(--foreground)]",children:"MagicLinkForm Behavior"})}),e.jsxs("div",{className:"space-y-4 text-sm",children:[e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Initial State"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:'Form shows with title "Magic Link Anmeldung", description explaining passwordless auth, email input field, submit button, and a link to password-based login at the bottom.'})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Loading State"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:'During magic link generation (simulated 1s delay), the submit button shows "Wird gesendet..." and is disabled to prevent duplicate submissions. All form interactions are blocked.'})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Success State"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:'After successful submission, the form is replaced with a green success Alert showing the message: "Ein Magic Link wurde an deine E-Mail-Adresse gesendet. Überprüfe dein Postfach." The login link remains visible at the bottom.'})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Error Handling"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:"Validation errors appear inline below the email field with red text. Server errors appear in a destructive Alert component above the submit button, with clear error message."})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Email Validation"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:'Uses Zod schema validation to ensure email format is correct before submission. Invalid formats trigger inline error message: "Invalid email address".'})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Alternative Login"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:'At the bottom of the form, users can find a link "Mit Passwort anmelden" to switch to traditional password-based authentication if preferred.'})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Accessibility"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:"Email field has proper label with htmlFor attribute. Error messages are associated with the field using ARIA attributes. All interactive elements are keyboard accessible."})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Callbacks"}),e.jsxs("p",{className:"text-[var(--muted-foreground)]",children:[e.jsx("strong",{children:"onSuccess"}),": Called after magic link is sent successfully. Use this to track analytics, show additional UI, or perform redirects.",e.jsx("br",{}),e.jsx("strong",{children:"onError"}),": Called when magic link sending fails. Receives Error object with details about the failure."]})]})]}),e.jsxs("div",{className:"mt-8",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"Try it yourself:"}),e.jsx(s,{onSuccess:()=>alert("Magic link sent! Check your email."),onError:r=>alert(`Error: ${r.message}`)})]})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Comprehensive documentation of form behavior, states, and user interactions."}}}},f={render:()=>e.jsxs("div",{className:"space-y-6 p-6 max-w-4xl",children:[e.jsx("div",{children:e.jsx("h2",{className:"text-2xl font-semibold mb-4 text-[var(--foreground)]",children:"Security & UX Best Practices"})}),e.jsxs("div",{className:"space-y-4 text-sm",children:[e.jsxs("div",{className:"p-4 bg-green-500/10 rounded-lg border border-green-500/30",children:[e.jsx("h3",{className:"font-semibold mb-2 text-green-400",children:"Security Benefits"}),e.jsxs("ul",{className:"list-disc list-inside space-y-1 text-[var(--muted-foreground)] ml-2",children:[e.jsx("li",{children:"No password storage or transmission"}),e.jsx("li",{children:"Time-limited authentication tokens"}),e.jsx("li",{children:"Single-use links prevent replay attacks"}),e.jsx("li",{children:"Email verification built into authentication"}),e.jsx("li",{children:"Reduced risk of credential stuffing"}),e.jsx("li",{children:"No password reset flows needed"})]})]}),e.jsxs("div",{className:"p-4 bg-blue-500/10 rounded-lg border border-blue-500/30",children:[e.jsx("h3",{className:"font-semibold mb-2 text-blue-400",children:"User Experience Benefits"}),e.jsxs("ul",{className:"list-disc list-inside space-y-1 text-[var(--muted-foreground)] ml-2",children:[e.jsx("li",{children:"Faster login process (no password typing)"}),e.jsx("li",{children:"Works across all devices seamlessly"}),e.jsx("li",{children:"No password memory burden"}),e.jsx("li",{children:"Reduced login friction"}),e.jsx("li",{children:"Clear success feedback"}),e.jsx("li",{children:"Graceful error handling"})]})]}),e.jsxs("div",{className:"p-4 bg-[var(--primary)]/10 rounded-lg border border-[var(--primary)]/30",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--primary)]",children:"Implementation Best Practices"}),e.jsxs("ul",{className:"list-disc list-inside space-y-1 text-[var(--muted-foreground)] ml-2",children:[e.jsx("li",{children:"Validate email format before submission"}),e.jsx("li",{children:"Show clear loading states during API calls"}),e.jsx("li",{children:"Display success message after link is sent"}),e.jsx("li",{children:"Provide fallback to password login"}),e.jsx("li",{children:"Rate limit requests to prevent abuse"}),e.jsx("li",{children:"Set appropriate token expiration (15-30 minutes)"}),e.jsx("li",{children:"Log authentication events for security monitoring"})]})]}),e.jsxs("div",{className:"p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30",children:[e.jsx("h3",{className:"font-semibold mb-2 text-yellow-400",children:"Potential Issues to Consider"}),e.jsxs("ul",{className:"list-disc list-inside space-y-1 text-[var(--muted-foreground)] ml-2",children:[e.jsx("li",{children:"Users must have access to their email"}),e.jsx("li",{children:"Email delivery can be delayed"}),e.jsx("li",{children:"Links may be marked as spam"}),e.jsx("li",{children:"Mobile email clients may have poor UX"}),e.jsx("li",{children:"Requires fallback for email access issues"})]})]})]}),e.jsxs("div",{className:"mt-8",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"Recommended Email Template"}),e.jsx("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)] font-mono text-xs",children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-[var(--foreground)]",children:"Subject: Dein Anmelde-Link für Ozean Licht"}),e.jsxs("div",{className:"border-t border-[var(--border)] pt-2 mt-2 space-y-2 text-[var(--muted-foreground)]",children:[e.jsx("p",{children:"Hallo,"}),e.jsx("p",{children:"Du hast einen Magic Link für die Anmeldung bei Ozean Licht angefordert."}),e.jsx("p",{children:"Klicke auf den folgenden Link, um dich anzumelden:"}),e.jsx("p",{className:"text-[var(--primary)]",children:"[MAGIC LINK BUTTON]"}),e.jsx("p",{children:"Dieser Link ist 15 Minuten gültig und kann nur einmal verwendet werden."}),e.jsx("p",{children:"Falls du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren."}),e.jsxs("p",{children:["Viele Grüße,",e.jsx("br",{}),"Dein Ozean Licht Team"]})]})]})})]})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Comprehensive guide to security considerations, UX benefits, and implementation best practices for magic link authentication."}}}},b={render:()=>e.jsxs("div",{className:"space-y-6 p-6 max-w-4xl",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-semibold mb-4 text-[var(--foreground)]",children:"Integration Example"}),e.jsx("p",{className:"text-sm text-[var(--muted-foreground)] mb-4",children:"Example showing how to integrate MagicLinkForm with Next.js routing and API"})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)] text-sm",children:"1. API Route Handler (app/api/auth/magic-link/route.ts)"}),e.jsx("pre",{className:"text-xs bg-black/20 p-3 rounded overflow-x-auto",children:e.jsx("code",{children:`import { NextResponse } from 'next/server';
import { sendMagicLink } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Generate and send magic link
    await sendMagicLink(email);

    return NextResponse.json({
      success: true,
      message: 'Magic link sent successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send magic link' },
      { status: 500 }
    );
  }
}`})})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)] text-sm",children:"2. Page Component (app/auth/magic-link/page.tsx)"}),e.jsx("pre",{className:"text-xs bg-black/20 p-3 rounded overflow-x-auto",children:e.jsx("code",{children:`'use client';
import { useRouter } from 'next/navigation';
import { MagicLinkForm } from '@shared/ui';

export default function MagicLinkPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <MagicLinkForm
        onSuccess={() => {
          router.push('/auth/check-email');
        }}
        onError={(error) => {
          console.error('Magic link error:', error);
          // Show toast notification
        }}
      />
    </div>
  );
}`})})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)] text-sm",children:"3. Email Verification Page (app/auth/check-email/page.tsx)"}),e.jsx("pre",{className:"text-xs bg-black/20 p-3 rounded overflow-x-auto",children:e.jsx("code",{children:`export default function CheckEmailPage() {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-2xl font-light">Check Your Email</h1>
      <p>We've sent you a magic link.</p>
      <p>Click the link in your email to sign in.</p>
    </div>
  );
}`})})]}),e.jsxs("div",{className:"mt-8",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"Try the form:"}),e.jsx(s,{onSuccess:()=>alert("Redirecting to /auth/check-email..."),onError:r=>alert(`Error: ${r.message}`)})]})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Complete integration example showing API routes, page components, and form usage."}}}};var L,I,C,P,F;i.parameters={...i.parameters,docs:{...(L=i.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {}
}`,...(C=(I=i.parameters)==null?void 0:I.docs)==null?void 0:C.source},description:{story:"Default magic link form with standard configuration",...(F=(P=i.parameters)==null?void 0:P.docs)==null?void 0:F.description}}};var R,T,U,D,V;t.parameters={...t.parameters,docs:{...(R=t.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    redirectUrl: '/check-email'
  },
  parameters: {
    docs: {
      description: {
        story: 'Magic link form configured to redirect to a confirmation page after sending the link.'
      }
    }
  }
}`,...(U=(T=t.parameters)==null?void 0:T.docs)==null?void 0:U.source},description:{story:"Magic link form with redirect URL",...(V=(D=t.parameters)==null?void 0:D.docs)==null?void 0:V.description}}};var W,q,B,z,H;o.parameters={...o.parameters,docs:{...(W=o.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    className: 'shadow-2xl border-2 border-[var(--primary)]'
  },
  parameters: {
    docs: {
      description: {
        story: 'Magic link form with custom className applied for enhanced border and shadow effects.'
      }
    }
  }
}`,...(B=(q=o.parameters)==null?void 0:q.docs)==null?void 0:B.source},description:{story:"Magic link form with custom styling",...(H=(z=o.parameters)==null?void 0:z.docs)==null?void 0:H.description}}};var O,_,G,K,X;n.parameters={...n.parameters,docs:{...(O=n.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    onSuccess: () => {
      console.log('Magic link sent successfully');
      alert('Magic link has been sent to your email! Check your inbox.');
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates success handling callback. Submit the form to see the success handler in action (simulates 1s API call).'
      }
    }
  }
}`,...(G=(_=n.parameters)==null?void 0:_.docs)==null?void 0:G.source},description:{story:"Magic link form with success handling demo",...(X=(K=n.parameters)==null?void 0:K.docs)==null?void 0:X.description}}};var $,Z,Y,J,Q;l.parameters={...l.parameters,docs:{...($=l.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    onError: (error: Error) => {
      console.error('Magic link error:', error);
      alert(\`Failed to send magic link: \${error.message}\`);
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates error handling callback. The form shows inline errors for validation and server errors in an Alert component.'
      }
    }
  }
}`,...(Y=(Z=l.parameters)==null?void 0:Z.docs)==null?void 0:Y.source},description:{story:"Magic link form with error handling demo",...(Q=(J=l.parameters)==null?void 0:J.docs)==null?void 0:Q.description}}};var ee,re,se,ae,ie;d.parameters={...d.parameters,docs:{...(ee=d.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  args: {},
  decorators: [Story => <div className="min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center">
        <Story />
      </div>],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Magic link form displayed on cosmic dark background showcasing glass morphism effect and turquoise accents.'
      }
    }
  }
}`,...(se=(re=d.parameters)==null?void 0:re.docs)==null?void 0:se.source},description:{story:"Magic link form on cosmic dark background",...(ie=(ae=d.parameters)==null?void 0:ae.docs)==null?void 0:ie.description}}};var te,oe,ne,le,de;c.parameters={...c.parameters,docs:{...(te=c.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {},
  decorators: [Story => <div className="w-full max-w-[320px] p-4">
        <Story />
      </div>],
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Magic link form optimized for mobile viewports with responsive layout.'
      }
    }
  }
}`,...(ne=(oe=c.parameters)==null?void 0:oe.docs)==null?void 0:ne.source},description:{story:"Magic link form in narrow mobile container",...(de=(le=c.parameters)==null?void 0:le.docs)==null?void 0:de.description}}};var ce,me,ue,pe,ge;m.parameters={...m.parameters,docs:{...(ce=m.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  args: {},
  decorators: [Story => <div className="w-full max-w-2xl p-4">
        <Story />
      </div>],
  parameters: {
    docs: {
      description: {
        story: 'Magic link form in a wider container. The form maintains its max-width constraint.'
      }
    }
  }
}`,...(ue=(me=m.parameters)==null?void 0:me.docs)==null?void 0:ue.source},description:{story:"Magic link form with wide container",...(ge=(pe=m.parameters)==null?void 0:pe.docs)==null?void 0:ge.description}}};var he,xe,fe,be,ve;u.parameters={...u.parameters,docs:{...(he=u.parameters)==null?void 0:he.docs,source:{originalSource:`{
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all props and behaviors. Use the controls panel to modify props dynamically.'
      }
    }
  }
}`,...(fe=(xe=u.parameters)==null?void 0:xe.docs)==null?void 0:fe.source},description:{story:"Interactive playground with all controls",...(ve=(be=u.parameters)==null?void 0:be.docs)==null?void 0:ve.description}}};var ye,Ne,ke,je,we;p.parameters={...p.parameters,docs:{...(ye=p.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 w-full max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-[var(--foreground)]">Validation Rules</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-[var(--muted-foreground)]">
          <li>Email: Must be a valid email address</li>
        </ul>
      </div>
      <MagicLinkForm onSuccess={() => console.log('Magic link sent')} onError={error => console.error('Error:', error)} />
      <div className="text-xs text-[var(--muted-foreground)] space-y-1">
        <p>
          <strong>Try these test cases:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Invalid email: "test" (shows "Invalid email address")</li>
          <li>Invalid email: "test@" (shows "Invalid email address")</li>
          <li>Invalid email: "@example.com" (shows "Invalid email address")</li>
          <li>Valid email: "test@example.com" (submits successfully)</li>
        </ul>
      </div>
    </div>,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: 'Demonstrates form validation with Zod schema. Try submitting with invalid email formats to see error messages.'
      }
    }
  }
}`,...(ke=(Ne=p.parameters)==null?void 0:Ne.docs)==null?void 0:ke.source},description:{story:"Validation demo - shows inline validation errors",...(we=(je=p.parameters)==null?void 0:je.docs)==null?void 0:we.description}}};var Me,Se,Ee,Ae,Le;g.parameters={...g.parameters,docs:{...(Me=g.parameters)==null?void 0:Me.docs,source:{originalSource:`{
  render: () => <div className="min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 text-[var(--foreground)]">
          <h1 className="text-4xl font-light">Sicher & Einfach</h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            Melde dich ohne Passwort an. Wir senden dir einen sicheren Link per E-Mail,
            mit dem du dich sofort anmelden kannst.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-1">✓</span>
              <span>Kein Passwort merken - einfach E-Mail eingeben</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-1">✓</span>
              <span>Höhere Sicherheit durch zeitlich begrenzte Links</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-1">✓</span>
              <span>Funktioniert auf allen deinen Geräten</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-1">✓</span>
              <span>Keine Sorgen über vergessene Passwörter</span>
            </li>
          </ul>
          <div className="p-4 bg-[var(--card)]/50 rounded-lg border border-[var(--border)]">
            <h3 className="font-semibold mb-2 text-sm">So funktioniert's:</h3>
            <ol className="list-decimal list-inside space-y-1 text-xs text-[var(--muted-foreground)]">
              <li>E-Mail-Adresse eingeben</li>
              <li>Magic Link anfordern</li>
              <li>E-Mail in deinem Postfach öffnen</li>
              <li>Auf den Link klicken und automatisch anmelden</li>
            </ol>
          </div>
        </div>
        <div>
          <MagicLinkForm onSuccess={() => console.log('Magic link sent')} onError={error => console.error('Error:', error)} />
        </div>
      </div>
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Complete passwordless authentication page layout with marketing copy and magic link form, showcasing real-world usage.'
      }
    }
  }
}`,...(Ee=(Se=g.parameters)==null?void 0:Se.docs)==null?void 0:Ee.source},description:{story:"Complete passwordless authentication flow showcase",...(Le=(Ae=g.parameters)==null?void 0:Ae.docs)==null?void 0:Le.description}}};var Ie,Ce,Pe,Fe,Re;h.parameters={...h.parameters,docs:{...(Ie=h.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  render: () => <div className="space-y-8 p-6 max-w-7xl">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Default State (Initial)</h3>
        <div className="max-w-md">
          <MagicLinkForm />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">With Custom Styling</h3>
        <div className="max-w-md">
          <MagicLinkForm className="border-2 border-[var(--primary)] shadow-2xl" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
          With Redirect Configuration
        </h3>
        <div className="max-w-md">
          <MagicLinkForm redirectUrl="/check-email" />
        </div>
      </div>
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Side-by-side comparison of different form configurations.'
      }
    }
  }
}`,...(Pe=(Ce=h.parameters)==null?void 0:Ce.docs)==null?void 0:Pe.source},description:{story:"All form states comparison",...(Re=(Fe=h.parameters)==null?void 0:Fe.docs)==null?void 0:Re.description}}};var Te,Ue,De,Ve,We;x.parameters={...x.parameters,docs:{...(Te=x.parameters)==null?void 0:Te.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 p-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">MagicLinkForm Behavior</h2>
      </div>

      <div className="space-y-4 text-sm">
        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Initial State</h3>
          <p className="text-[var(--muted-foreground)]">
            Form shows with title "Magic Link Anmeldung", description explaining passwordless auth,
            email input field, submit button, and a link to password-based login at the bottom.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Loading State</h3>
          <p className="text-[var(--muted-foreground)]">
            During magic link generation (simulated 1s delay), the submit button shows "Wird gesendet..."
            and is disabled to prevent duplicate submissions. All form interactions are blocked.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Success State</h3>
          <p className="text-[var(--muted-foreground)]">
            After successful submission, the form is replaced with a green success Alert showing the message:
            "Ein Magic Link wurde an deine E-Mail-Adresse gesendet. Überprüfe dein Postfach."
            The login link remains visible at the bottom.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Error Handling</h3>
          <p className="text-[var(--muted-foreground)]">
            Validation errors appear inline below the email field with red text. Server errors appear
            in a destructive Alert component above the submit button, with clear error message.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Email Validation</h3>
          <p className="text-[var(--muted-foreground)]">
            Uses Zod schema validation to ensure email format is correct before submission.
            Invalid formats trigger inline error message: "Invalid email address".
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Alternative Login</h3>
          <p className="text-[var(--muted-foreground)]">
            At the bottom of the form, users can find a link "Mit Passwort anmelden" to switch
            to traditional password-based authentication if preferred.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Accessibility</h3>
          <p className="text-[var(--muted-foreground)]">
            Email field has proper label with htmlFor attribute. Error messages are associated
            with the field using ARIA attributes. All interactive elements are keyboard accessible.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Callbacks</h3>
          <p className="text-[var(--muted-foreground)]">
            <strong>onSuccess</strong>: Called after magic link is sent successfully. Use this to track
            analytics, show additional UI, or perform redirects.<br />
            <strong>onError</strong>: Called when magic link sending fails. Receives Error object with
            details about the failure.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Try it yourself:</h3>
        <MagicLinkForm onSuccess={() => alert('Magic link sent! Check your email.')} onError={error => alert(\`Error: \${error.message}\`)} />
      </div>
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Comprehensive documentation of form behavior, states, and user interactions.'
      }
    }
  }
}`,...(De=(Ue=x.parameters)==null?void 0:Ue.docs)==null?void 0:De.source},description:{story:"Form behavior documentation",...(We=(Ve=x.parameters)==null?void 0:Ve.docs)==null?void 0:We.description}}};var qe,Be,ze,He,Oe;f.parameters={...f.parameters,docs:{...(qe=f.parameters)==null?void 0:qe.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 p-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">
          Security & UX Best Practices
        </h2>
      </div>

      <div className="space-y-4 text-sm">
        <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
          <h3 className="font-semibold mb-2 text-green-400">Security Benefits</h3>
          <ul className="list-disc list-inside space-y-1 text-[var(--muted-foreground)] ml-2">
            <li>No password storage or transmission</li>
            <li>Time-limited authentication tokens</li>
            <li>Single-use links prevent replay attacks</li>
            <li>Email verification built into authentication</li>
            <li>Reduced risk of credential stuffing</li>
            <li>No password reset flows needed</li>
          </ul>
        </div>

        <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
          <h3 className="font-semibold mb-2 text-blue-400">User Experience Benefits</h3>
          <ul className="list-disc list-inside space-y-1 text-[var(--muted-foreground)] ml-2">
            <li>Faster login process (no password typing)</li>
            <li>Works across all devices seamlessly</li>
            <li>No password memory burden</li>
            <li>Reduced login friction</li>
            <li>Clear success feedback</li>
            <li>Graceful error handling</li>
          </ul>
        </div>

        <div className="p-4 bg-[var(--primary)]/10 rounded-lg border border-[var(--primary)]/30">
          <h3 className="font-semibold mb-2 text-[var(--primary)]">Implementation Best Practices</h3>
          <ul className="list-disc list-inside space-y-1 text-[var(--muted-foreground)] ml-2">
            <li>Validate email format before submission</li>
            <li>Show clear loading states during API calls</li>
            <li>Display success message after link is sent</li>
            <li>Provide fallback to password login</li>
            <li>Rate limit requests to prevent abuse</li>
            <li>Set appropriate token expiration (15-30 minutes)</li>
            <li>Log authentication events for security monitoring</li>
          </ul>
        </div>

        <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
          <h3 className="font-semibold mb-2 text-yellow-400">Potential Issues to Consider</h3>
          <ul className="list-disc list-inside space-y-1 text-[var(--muted-foreground)] ml-2">
            <li>Users must have access to their email</li>
            <li>Email delivery can be delayed</li>
            <li>Links may be marked as spam</li>
            <li>Mobile email clients may have poor UX</li>
            <li>Requires fallback for email access issues</li>
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
          Recommended Email Template
        </h3>
        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)] font-mono text-xs">
          <div className="space-y-2">
            <p className="text-[var(--foreground)]">Subject: Dein Anmelde-Link für Ozean Licht</p>
            <div className="border-t border-[var(--border)] pt-2 mt-2 space-y-2 text-[var(--muted-foreground)]">
              <p>Hallo,</p>
              <p>Du hast einen Magic Link für die Anmeldung bei Ozean Licht angefordert.</p>
              <p>Klicke auf den folgenden Link, um dich anzumelden:</p>
              <p className="text-[var(--primary)]">[MAGIC LINK BUTTON]</p>
              <p>Dieser Link ist 15 Minuten gültig und kann nur einmal verwendet werden.</p>
              <p>Falls du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren.</p>
              <p>Viele Grüße,<br />Dein Ozean Licht Team</p>
            </div>
          </div>
        </div>
      </div>
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Comprehensive guide to security considerations, UX benefits, and implementation best practices for magic link authentication.'
      }
    }
  }
}`,...(ze=(Be=f.parameters)==null?void 0:Be.docs)==null?void 0:ze.source},description:{story:"Security & UX best practices showcase",...(Oe=(He=f.parameters)==null?void 0:He.docs)==null?void 0:Oe.description}}};var _e,Ge,Ke,Xe,$e;b.parameters={...b.parameters,docs:{...(_e=b.parameters)==null?void 0:_e.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 p-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">Integration Example</h2>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          Example showing how to integrate MagicLinkForm with Next.js routing and API
        </p>
      </div>

      <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
        <h3 className="font-semibold mb-2 text-[var(--foreground)] text-sm">
          1. API Route Handler (app/api/auth/magic-link/route.ts)
        </h3>
        <pre className="text-xs bg-black/20 p-3 rounded overflow-x-auto">
          <code>{\`import { NextResponse } from 'next/server';
import { sendMagicLink } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Generate and send magic link
    await sendMagicLink(email);

    return NextResponse.json({
      success: true,
      message: 'Magic link sent successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send magic link' },
      { status: 500 }
    );
  }
}\`}</code>
        </pre>
      </div>

      <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
        <h3 className="font-semibold mb-2 text-[var(--foreground)] text-sm">
          2. Page Component (app/auth/magic-link/page.tsx)
        </h3>
        <pre className="text-xs bg-black/20 p-3 rounded overflow-x-auto">
          <code>{\`'use client';
import { useRouter } from 'next/navigation';
import { MagicLinkForm } from '@shared/ui';

export default function MagicLinkPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <MagicLinkForm
        onSuccess={() => {
          router.push('/auth/check-email');
        }}
        onError={(error) => {
          console.error('Magic link error:', error);
          // Show toast notification
        }}
      />
    </div>
  );
}\`}</code>
        </pre>
      </div>

      <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
        <h3 className="font-semibold mb-2 text-[var(--foreground)] text-sm">
          3. Email Verification Page (app/auth/check-email/page.tsx)
        </h3>
        <pre className="text-xs bg-black/20 p-3 rounded overflow-x-auto">
          <code>{\`export default function CheckEmailPage() {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-2xl font-light">Check Your Email</h1>
      <p>We've sent you a magic link.</p>
      <p>Click the link in your email to sign in.</p>
    </div>
  );
}\`}</code>
        </pre>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Try the form:</h3>
        <MagicLinkForm onSuccess={() => alert('Redirecting to /auth/check-email...')} onError={error => alert(\`Error: \${error.message}\`)} />
      </div>
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Complete integration example showing API routes, page components, and form usage.'
      }
    }
  }
}`,...(Ke=(Ge=b.parameters)==null?void 0:Ge.docs)==null?void 0:Ke.source},description:{story:"Integration example with routing",...($e=(Xe=b.parameters)==null?void 0:Xe.docs)==null?void 0:$e.description}}};const Br=["Default","WithRedirect","CustomStyling","WithSuccessHandling","WithErrorHandling","CosmicTheme","MobileView","WideContainer","Playground","ValidationDemo","PasswordlessAuthFlow","AllStates","BehaviorDocumentation","SecurityAndUX","IntegrationExample"];export{h as AllStates,x as BehaviorDocumentation,d as CosmicTheme,o as CustomStyling,i as Default,b as IntegrationExample,c as MobileView,g as PasswordlessAuthFlow,u as Playground,f as SecurityAndUX,p as ValidationDemo,m as WideContainer,l as WithErrorHandling,t as WithRedirect,n as WithSuccessHandling,Br as __namedExportsOrder,qr as default};
