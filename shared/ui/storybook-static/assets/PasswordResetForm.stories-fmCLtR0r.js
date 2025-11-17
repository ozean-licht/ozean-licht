import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{r as w}from"./index-B2-qRKKC.js";import{u as ts}from"./index.esm-SGBzMz4R.js";import{a as os,o as is,s as ds}from"./schemas-C3QG-Qu7.js";import{C as ns,a as ls,b as cs,c as ms,d as us}from"./Card-CHzXRqp1.js";import{B as ps}from"./Button-PgnE6Xyj.js";import{L as xs,I as hs}from"./Input-C2o_RQ9B.js";import{A,a as k}from"./alert-D3j30XLg.js";import{c as gs}from"./cn-CKXzwFwe.js";import{f as E}from"./index-CJu6nLMj.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-Dp3B9jqt.js";import"./clsx-B-dksMZM.js";import"./card-DPYCUmwK.js";import"./button-DhHHw9VN.js";import"./index-BiMR7eR1.js";import"./index-BFjtS4uE.js";import"./input-BK5gJSzh.js";import"./textarea-B_02bPEu.js";import"./label-BZCfx7Ud.js";import"./index-B5oyz0SX.js";import"./index-kS-9iBlu.js";const fs=is({email:ds().email("Invalid email address")});function r({onSuccess:s,onError:b,className:Je}){var P;const[N,y]=w.useState(""),[Qe,Xe]=w.useState(!1),[j,S]=w.useState(!1),{register:Ye,handleSubmit:es,formState:{errors:ss}}=ts({resolver:os(fs)}),rs=async vs=>{y(""),S(!0);try{await new Promise(a=>setTimeout(a,1e3)),Xe(!0),s==null||s()}catch(a){const as=a instanceof Error?a.message:"An error occurred";y(as),b==null||b(a)}finally{S(!1)}};return e.jsxs(ns,{variant:"default",className:gs("w-full max-w-md shadow-lg",Je),children:[e.jsxs(ls,{className:"space-y-4 text-center",children:[e.jsx(cs,{className:"text-2xl font-light",children:"Passwort Zurücksetzen"}),e.jsx(ms,{children:"Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum Zurücksetzen deines Passworts."})]}),e.jsxs(us,{className:"space-y-6",children:[Qe?e.jsx(A,{className:"border-green-500 bg-green-500/10",children:e.jsx(k,{className:"text-green-400",children:"Eine E-Mail zum Zurücksetzen deines Passworts wurde gesendet. Bitte überprüfe dein Postfach."})}):e.jsxs("form",{onSubmit:es(rs),className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(xs,{htmlFor:"email",children:"Email"}),e.jsx(hs,{id:"email",type:"email",placeholder:"deine@mail.com",...Ye("email"),error:(P=ss.email)==null?void 0:P.message})]}),N&&e.jsx(A,{variant:"destructive",children:e.jsx(k,{children:N})}),e.jsx(ps,{type:"submit",variant:"primary",fullWidth:!0,disabled:j,className:"text-lg py-3",children:j?"Wird gesendet...":"Link Senden"})]}),e.jsx("div",{className:"text-center text-xs text-[var(--muted-foreground)]",children:e.jsx("a",{href:"/login",className:"text-primary hover:underline font-medium",children:"Zurück zur Anmeldung"})})]})]})}r.displayName="PasswordResetForm";try{r.displayName="PasswordResetForm",r.__docgenInfo={description:"",displayName:"PasswordResetForm",props:{onSuccess:{defaultValue:null,description:"",name:"onSuccess",required:!1,type:{name:"(() => void)"}},onError:{defaultValue:null,description:"",name:"onError",required:!1,type:{name:"((error: Error) => void)"}},redirectUrl:{defaultValue:null,description:"",name:"redirectUrl",required:!1,type:{name:"string"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const Vs={title:"Tier 3: Compositions/Forms/PasswordResetForm",component:r,parameters:{layout:"centered",docs:{description:{component:"Complete password reset form composition with email validation, success confirmation, and error handling. Features Ozean Licht branding with glass morphism card design and turquoise accents."}}},tags:["autodocs"],argTypes:{onSuccess:{description:"Callback function called when reset email is sent successfully",control:!1,action:"reset-success"},onError:{description:"Callback function called when reset request fails",control:!1,action:"reset-error"},redirectUrl:{description:"URL to redirect to after successful password reset (optional)",control:"text",table:{defaultValue:{summary:"undefined"}}},className:{description:"Custom className for styling",control:"text"}},args:{onSuccess:E(),onError:E()},decorators:[s=>e.jsx("div",{className:"w-full max-w-md p-4",children:e.jsx(s,{})})]},t={args:{}},o={args:{redirectUrl:"/login"},parameters:{docs:{description:{story:"Password reset form with optional redirect URL for navigation after success."}}}},i={args:{className:"shadow-2xl border-2 border-[var(--primary)]"},parameters:{docs:{description:{story:"Password reset form with custom className applied for enhanced border and shadow."}}}},d={args:{onSuccess:()=>{console.log("Reset email sent successfully"),alert("Eine E-Mail zum Zurücksetzen deines Passworts wurde gesendet!")}},parameters:{docs:{description:{story:"Demonstrates success handling callback. Submit with a valid email to see the success handler in action (simulates 1s API call)."}}}},n={args:{onError:s=>{console.error("Reset error:",s),alert(`Password reset failed: ${s.message}`)}},parameters:{docs:{description:{story:"Demonstrates error handling callback. The form includes built-in error display with Alert component."}}}},l={args:{},decorators:[s=>e.jsx("div",{className:"min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center",children:e.jsx(s,{})})],parameters:{layout:"fullscreen",docs:{description:{story:"Password reset form displayed on cosmic dark background showcasing glass morphism effect."}}}},c={args:{},decorators:[s=>e.jsx("div",{className:"w-full max-w-[320px] p-4",children:e.jsx(s,{})})],parameters:{viewport:{defaultViewport:"mobile1"},docs:{description:{story:"Password reset form optimized for mobile viewports with responsive layout."}}}},m={args:{},decorators:[s=>e.jsx("div",{className:"w-full max-w-2xl p-4",children:e.jsx(s,{})})],parameters:{docs:{description:{story:"Password reset form in a wider container. The form maintains its max-width constraint."}}}},u={args:{},parameters:{docs:{description:{story:"Interactive playground to test all props and behaviors. Use the controls panel to modify props dynamically."}}}},p={render:()=>e.jsxs("div",{className:"space-y-6 w-full max-w-2xl",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-2 text-[var(--foreground)]",children:"Validation Rules"}),e.jsx("ul",{className:"list-disc list-inside space-y-1 text-sm text-[var(--muted-foreground)]",children:e.jsx("li",{children:"Email: Must be a valid email address"})})]}),e.jsx(r,{onSuccess:()=>console.log("Reset successful"),onError:s=>console.error("Reset error:",s)}),e.jsxs("div",{className:"text-xs text-[var(--muted-foreground)] space-y-1",children:[e.jsx("p",{children:e.jsx("strong",{children:"Try these test cases:"})}),e.jsxs("ul",{className:"list-disc list-inside space-y-1 ml-4",children:[e.jsx("li",{children:'Invalid email: "test" (shows "Invalid email address")'}),e.jsx("li",{children:'Invalid email: "test@" (shows "Invalid email address")'}),e.jsx("li",{children:'Valid email: "test@example.com" (shows success message)'})]})]})]}),parameters:{layout:"centered",docs:{description:{story:"Demonstrates form validation with Zod schema. Try submitting with invalid data to see error messages."}}}},x={render:()=>e.jsx("div",{className:"min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center",children:e.jsxs("div",{className:"w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center",children:[e.jsxs("div",{className:"space-y-6 text-[var(--foreground)]",children:[e.jsx("h1",{className:"text-4xl font-light",children:"Passwort vergessen?"}),e.jsx("p",{className:"text-lg text-[var(--muted-foreground)]",children:"Kein Problem! Gib deine E-Mail-Adresse ein und wir senden dir einen sicheren Link zum Zurücksetzen deines Passworts."}),e.jsxs("ul",{className:"space-y-3 text-sm",children:[e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"text-[var(--primary)] mt-1",children:"✓"}),e.jsx("span",{children:"Sicherer Reset-Link wird per E-Mail gesendet"})]}),e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"text-[var(--primary)] mt-1",children:"✓"}),e.jsx("span",{children:"Link ist nur für kurze Zeit gültig"})]}),e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"text-[var(--primary)] mt-1",children:"✓"}),e.jsx("span",{children:"Deine Daten bleiben sicher und verschlüsselt"})]})]})]}),e.jsx("div",{children:e.jsx(r,{onSuccess:()=>console.log("Reset email sent"),onError:s=>console.error("Reset failed:",s)})})]})}),parameters:{layout:"fullscreen",docs:{description:{story:"Complete password reset page layout with informational copy and reset form, showcasing real-world usage."}}}},h={render:()=>e.jsxs("div",{className:"space-y-8 p-6 max-w-7xl",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"Default State (Email Input)"}),e.jsx("div",{className:"max-w-md",children:e.jsx(r,{})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"With Custom Styling (Enhanced Border)"}),e.jsx("div",{className:"max-w-md",children:e.jsx(r,{className:"border-2 border-[var(--primary)] shadow-2xl"})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"With Redirect URL"}),e.jsx("div",{className:"max-w-md",children:e.jsx(r,{redirectUrl:"/login"})})]})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Side-by-side comparison of different form configurations and states."}}}},g={render:()=>e.jsxs("div",{className:"space-y-6 p-6 max-w-4xl",children:[e.jsx("div",{children:e.jsx("h2",{className:"text-2xl font-semibold mb-4 text-[var(--foreground)]",children:"PasswordResetForm Behavior"})}),e.jsxs("div",{className:"space-y-4 text-sm",children:[e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Email Input Step"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:"User enters their email address. The form validates that the email is in a valid format before submission."})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Loading State"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:'During the reset request (simulated 1s delay), the submit button shows "Wird gesendet..." (Sending...) and is disabled to prevent duplicate submissions.'})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Success State"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:'After successful submission, the form replaces the input with a green success Alert displaying: "Eine E-Mail zum Zurücksetzen deines Passworts wurde gesendet. Bitte überprüfe dein Postfach." (An email to reset your password has been sent. Please check your inbox.)'})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Error Handling"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:"Validation errors appear inline below the email field. Server errors appear in a destructive Alert component above the submit button. Errors are cleared when user resubmits the form."})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Navigation"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:'The form includes a "Zurück zur Anmeldung" (Back to Login) link at the bottom for easy navigation back to the login page at /login.'})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Accessibility"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:"Form field has proper label with htmlFor attribute. Error messages are associated with fields using ARIA attributes. Success alert uses semantic HTML for screen readers."})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Internationalization"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:'All UI text is in German (Austrian German context). Titles: "Passwort Zurücksetzen". Buttons: "Link Senden", "Wird gesendet...". Messages and descriptions are fully localized.'})]})]}),e.jsxs("div",{className:"mt-8",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"Try it yourself:"}),e.jsx(r,{onSuccess:()=>alert("Reset email sent successfully!"),onError:s=>alert(`Error: ${s.message}`)})]})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Comprehensive documentation of form behavior, states, and user interactions."}}}},f={render:()=>e.jsxs("div",{className:"space-y-8 p-6 max-w-7xl",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-semibold mb-4 text-[var(--foreground)]",children:"Password Reset State Flow"}),e.jsx("p",{className:"text-[var(--muted-foreground)] mb-6",children:"The form progresses through three main states: Initial (email input), Loading (sending request), and Success (confirmation message)."})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-semibold text-sm",children:"1"}),e.jsx("h3",{className:"text-lg font-semibold text-[var(--foreground)]",children:"Initial State"})]}),e.jsx("div",{className:"max-w-md",children:e.jsx(r,{})}),e.jsx("p",{className:"text-sm text-[var(--muted-foreground)]",children:'User enters email address and clicks "Link Senden" button'})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-semibold text-sm",children:"2"}),e.jsx("h3",{className:"text-lg font-semibold text-[var(--foreground)]",children:"Loading State"})]}),e.jsxs("div",{className:"text-center p-8 border border-dashed border-[var(--border)] rounded-lg bg-[var(--card)]",children:[e.jsx("p",{className:"text-[var(--muted-foreground)] mb-2",children:"Button shows:"}),e.jsx("p",{className:"font-semibold text-[var(--foreground)]",children:'"Wird gesendet..."'}),e.jsx("p",{className:"text-sm text-[var(--muted-foreground)] mt-4",children:"Button is disabled"})]}),e.jsx("p",{className:"text-sm text-[var(--muted-foreground)]",children:"Request is being processed (simulated 1s API call)"})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold text-sm",children:"✓"}),e.jsx("h3",{className:"text-lg font-semibold text-[var(--foreground)]",children:"Success State"})]}),e.jsx("div",{className:"text-center p-8 border border-dashed border-green-500 rounded-lg bg-green-500/10",children:e.jsx("p",{className:"text-green-400 text-sm",children:'"Eine E-Mail zum Zurücksetzen deines Passworts wurde gesendet. Bitte überprüfe dein Postfach."'})}),e.jsx("p",{className:"text-sm text-[var(--muted-foreground)]",children:"Form input replaced with success message"})]})]}),e.jsxs("div",{className:"mt-8 p-6 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"text-lg font-semibold mb-3 text-[var(--foreground)]",children:"Complete Flow Example"}),e.jsx("p",{className:"text-sm text-[var(--muted-foreground)] mb-4",children:"Try the complete workflow in this live example. Enter a valid email and watch the state transitions:"}),e.jsx("div",{className:"max-w-md mx-auto",children:e.jsx(r,{onSuccess:()=>console.log("Password reset email sent"),onError:s=>console.error("Error:",s)})})]})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Visual demonstration of the three main states: Initial (email input), Loading, and Success."}}}},v={render:()=>e.jsxs("div",{className:"space-y-12 p-6 max-w-7xl",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-semibold mb-4 text-[var(--foreground)]",children:"Integration with Authentication Flow"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:"The PasswordResetForm integrates seamlessly with other authentication forms like LoginForm and RegisterForm. Below are common page layouts using the component."})]}),e.jsxs("div",{className:"space-y-8",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-4 text-[var(--foreground)]",children:"Simple Reset Page"}),e.jsx("div",{className:"bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 rounded-lg min-h-[500px] flex items-center justify-center",children:e.jsx(r,{})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-4 text-[var(--foreground)]",children:"Reset Page with Branding"}),e.jsx("div",{className:"bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 rounded-lg min-h-[600px] flex items-center justify-center",children:e.jsxs("div",{className:"w-full max-w-md space-y-8",children:[e.jsxs("div",{className:"text-center space-y-2",children:[e.jsx("div",{className:"text-[var(--primary)] text-5xl font-light mb-4",children:"Ozean Licht"}),e.jsx("p",{className:"text-sm text-[var(--muted-foreground)]",children:"Dein spiritueller Begleiter"})]}),e.jsx(r,{})]})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-4 text-[var(--foreground)]",children:"Side-by-Side Layout (Desktop)"}),e.jsx("div",{className:"bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 rounded-lg min-h-[600px]",children:e.jsxs("div",{className:"max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full",children:[e.jsxs("div",{className:"space-y-6 text-[var(--foreground)]",children:[e.jsx("h1",{className:"text-4xl font-light",children:"Passwort zurücksetzen"}),e.jsx("p",{className:"text-lg text-[var(--muted-foreground)]",children:"Gib deine E-Mail-Adresse ein und wir senden dir einen sicheren Link zum Zurücksetzen deines Passworts."}),e.jsxs("ul",{className:"space-y-3",children:[e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"text-[var(--primary)] mt-1",children:"✓"}),e.jsx("span",{className:"text-sm",children:"Schneller und sicherer Prozess"})]}),e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"text-[var(--primary)] mt-1",children:"✓"}),e.jsx("span",{className:"text-sm",children:"Link ist zeitlich begrenzt gültig"})]}),e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"text-[var(--primary)] mt-1",children:"✓"}),e.jsx("span",{className:"text-sm",children:"Deine Daten bleiben geschützt"})]})]})]}),e.jsx("div",{children:e.jsx(r,{})})]})})]})]})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Examples of how to integrate PasswordResetForm into complete authentication pages with various layouts and branding."}}}};var F,R,z,L,I;t.parameters={...t.parameters,docs:{...(F=t.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {}
}`,...(z=(R=t.parameters)==null?void 0:R.docs)==null?void 0:z.source},description:{story:"Default password reset form with all features",...(I=(L=t.parameters)==null?void 0:L.docs)==null?void 0:I.description}}};var T,D,B,C,M;o.parameters={...o.parameters,docs:{...(T=o.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    redirectUrl: '/login'
  },
  parameters: {
    docs: {
      description: {
        story: 'Password reset form with optional redirect URL for navigation after success.'
      }
    }
  }
}`,...(B=(D=o.parameters)==null?void 0:D.docs)==null?void 0:B.source},description:{story:"Password reset form with redirect URL",...(M=(C=o.parameters)==null?void 0:C.docs)==null?void 0:M.description}}};var Z,U,V,W,q;i.parameters={...i.parameters,docs:{...(Z=i.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    className: 'shadow-2xl border-2 border-[var(--primary)]'
  },
  parameters: {
    docs: {
      description: {
        story: 'Password reset form with custom className applied for enhanced border and shadow.'
      }
    }
  }
}`,...(V=(U=i.parameters)==null?void 0:U.docs)==null?void 0:V.source},description:{story:"Password reset form with custom styling",...(q=(W=i.parameters)==null?void 0:W.docs)==null?void 0:q.description}}};var _,G,H,O,$;d.parameters={...d.parameters,docs:{...(_=d.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    onSuccess: () => {
      console.log('Reset email sent successfully');
      alert('Eine E-Mail zum Zurücksetzen deines Passworts wurde gesendet!');
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates success handling callback. Submit with a valid email to see the success handler in action (simulates 1s API call).'
      }
    }
  }
}`,...(H=(G=d.parameters)==null?void 0:G.docs)==null?void 0:H.source},description:{story:"Password reset form with success callback demo",...($=(O=d.parameters)==null?void 0:O.docs)==null?void 0:$.description}}};var K,J,Q,X,Y;n.parameters={...n.parameters,docs:{...(K=n.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    onError: (error: Error) => {
      console.error('Reset error:', error);
      alert(\`Password reset failed: \${error.message}\`);
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates error handling callback. The form includes built-in error display with Alert component.'
      }
    }
  }
}`,...(Q=(J=n.parameters)==null?void 0:J.docs)==null?void 0:Q.source},description:{story:"Password reset form with error callback demo",...(Y=(X=n.parameters)==null?void 0:X.docs)==null?void 0:Y.description}}};var ee,se,re,ae,te;l.parameters={...l.parameters,docs:{...(ee=l.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  args: {},
  decorators: [Story => <div className="min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center">
        <Story />
      </div>],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Password reset form displayed on cosmic dark background showcasing glass morphism effect.'
      }
    }
  }
}`,...(re=(se=l.parameters)==null?void 0:se.docs)==null?void 0:re.source},description:{story:"Password reset form on cosmic dark background",...(te=(ae=l.parameters)==null?void 0:ae.docs)==null?void 0:te.description}}};var oe,ie,de,ne,le;c.parameters={...c.parameters,docs:{...(oe=c.parameters)==null?void 0:oe.docs,source:{originalSource:`{
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
        story: 'Password reset form optimized for mobile viewports with responsive layout.'
      }
    }
  }
}`,...(de=(ie=c.parameters)==null?void 0:ie.docs)==null?void 0:de.source},description:{story:"Password reset form in narrow mobile container",...(le=(ne=c.parameters)==null?void 0:ne.docs)==null?void 0:le.description}}};var ce,me,ue,pe,xe;m.parameters={...m.parameters,docs:{...(ce=m.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  args: {},
  decorators: [Story => <div className="w-full max-w-2xl p-4">
        <Story />
      </div>],
  parameters: {
    docs: {
      description: {
        story: 'Password reset form in a wider container. The form maintains its max-width constraint.'
      }
    }
  }
}`,...(ue=(me=m.parameters)==null?void 0:me.docs)==null?void 0:ue.source},description:{story:"Password reset form with wide container",...(xe=(pe=m.parameters)==null?void 0:pe.docs)==null?void 0:xe.description}}};var he,ge,fe,ve,be;u.parameters={...u.parameters,docs:{...(he=u.parameters)==null?void 0:he.docs,source:{originalSource:`{
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all props and behaviors. Use the controls panel to modify props dynamically.'
      }
    }
  }
}`,...(fe=(ge=u.parameters)==null?void 0:ge.docs)==null?void 0:fe.source},description:{story:"Interactive playground with all controls",...(be=(ve=u.parameters)==null?void 0:ve.docs)==null?void 0:be.description}}};var we,Ne,ye,je,Se;p.parameters={...p.parameters,docs:{...(we=p.parameters)==null?void 0:we.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 w-full max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-[var(--foreground)]">Validation Rules</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-[var(--muted-foreground)]">
          <li>Email: Must be a valid email address</li>
        </ul>
      </div>
      <PasswordResetForm onSuccess={() => console.log('Reset successful')} onError={error => console.error('Reset error:', error)} />
      <div className="text-xs text-[var(--muted-foreground)] space-y-1">
        <p>
          <strong>Try these test cases:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Invalid email: "test" (shows "Invalid email address")</li>
          <li>Invalid email: "test@" (shows "Invalid email address")</li>
          <li>Valid email: "test@example.com" (shows success message)</li>
        </ul>
      </div>
    </div>,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: 'Demonstrates form validation with Zod schema. Try submitting with invalid data to see error messages.'
      }
    }
  }
}`,...(ye=(Ne=p.parameters)==null?void 0:Ne.docs)==null?void 0:ye.source},description:{story:"Validation demo - shows inline validation errors",...(Se=(je=p.parameters)==null?void 0:je.docs)==null?void 0:Se.description}}};var Pe,Ae,ke,Ee,Fe;x.parameters={...x.parameters,docs:{...(Pe=x.parameters)==null?void 0:Pe.docs,source:{originalSource:`{
  render: () => <div className="min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 text-[var(--foreground)]">
          <h1 className="text-4xl font-light">Passwort vergessen?</h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            Kein Problem! Gib deine E-Mail-Adresse ein und wir senden dir einen sicheren Link zum Zurücksetzen
            deines Passworts.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-1">✓</span>
              <span>Sicherer Reset-Link wird per E-Mail gesendet</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-1">✓</span>
              <span>Link ist nur für kurze Zeit gültig</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-1">✓</span>
              <span>Deine Daten bleiben sicher und verschlüsselt</span>
            </li>
          </ul>
        </div>
        <div>
          <PasswordResetForm onSuccess={() => console.log('Reset email sent')} onError={error => console.error('Reset failed:', error)} />
        </div>
      </div>
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Complete password reset page layout with informational copy and reset form, showcasing real-world usage.'
      }
    }
  }
}`,...(ke=(Ae=x.parameters)==null?void 0:Ae.docs)==null?void 0:ke.source},description:{story:"Complete password reset flow showcase",...(Fe=(Ee=x.parameters)==null?void 0:Ee.docs)==null?void 0:Fe.description}}};var Re,ze,Le,Ie,Te;h.parameters={...h.parameters,docs:{...(Re=h.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  render: () => <div className="space-y-8 p-6 max-w-7xl">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Default State (Email Input)</h3>
        <div className="max-w-md">
          <PasswordResetForm />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">With Custom Styling (Enhanced Border)</h3>
        <div className="max-w-md">
          <PasswordResetForm className="border-2 border-[var(--primary)] shadow-2xl" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">With Redirect URL</h3>
        <div className="max-w-md">
          <PasswordResetForm redirectUrl="/login" />
        </div>
      </div>
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Side-by-side comparison of different form configurations and states.'
      }
    }
  }
}`,...(Le=(ze=h.parameters)==null?void 0:ze.docs)==null?void 0:Le.source},description:{story:"All form states comparison",...(Te=(Ie=h.parameters)==null?void 0:Ie.docs)==null?void 0:Te.description}}};var De,Be,Ce,Me,Ze;g.parameters={...g.parameters,docs:{...(De=g.parameters)==null?void 0:De.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 p-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">PasswordResetForm Behavior</h2>
      </div>

      <div className="space-y-4 text-sm">
        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Email Input Step</h3>
          <p className="text-[var(--muted-foreground)]">
            User enters their email address. The form validates that the email is in a valid format before
            submission.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Loading State</h3>
          <p className="text-[var(--muted-foreground)]">
            During the reset request (simulated 1s delay), the submit button shows "Wird gesendet..." (Sending...) and
            is disabled to prevent duplicate submissions.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Success State</h3>
          <p className="text-[var(--muted-foreground)]">
            After successful submission, the form replaces the input with a green success Alert displaying: "Eine
            E-Mail zum Zurücksetzen deines Passworts wurde gesendet. Bitte überprüfe dein Postfach." (An email to
            reset your password has been sent. Please check your inbox.)
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Error Handling</h3>
          <p className="text-[var(--muted-foreground)]">
            Validation errors appear inline below the email field. Server errors appear in a destructive Alert
            component above the submit button. Errors are cleared when user resubmits the form.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Navigation</h3>
          <p className="text-[var(--muted-foreground)]">
            The form includes a "Zurück zur Anmeldung" (Back to Login) link at the bottom for easy navigation back to
            the login page at /login.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Accessibility</h3>
          <p className="text-[var(--muted-foreground)]">
            Form field has proper label with htmlFor attribute. Error messages are associated with fields using ARIA
            attributes. Success alert uses semantic HTML for screen readers.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Internationalization</h3>
          <p className="text-[var(--muted-foreground)]">
            All UI text is in German (Austrian German context). Titles: "Passwort Zurücksetzen". Buttons: "Link
            Senden", "Wird gesendet...". Messages and descriptions are fully localized.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Try it yourself:</h3>
        <PasswordResetForm onSuccess={() => alert('Reset email sent successfully!')} onError={error => alert(\`Error: \${error.message}\`)} />
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
}`,...(Ce=(Be=g.parameters)==null?void 0:Be.docs)==null?void 0:Ce.source},description:{story:"Form behavior documentation",...(Ze=(Me=g.parameters)==null?void 0:Me.docs)==null?void 0:Ze.description}}};var Ue,Ve,We,qe,_e;f.parameters={...f.parameters,docs:{...(Ue=f.parameters)==null?void 0:Ue.docs,source:{originalSource:`{
  render: () => <div className="space-y-8 p-6 max-w-7xl">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">Password Reset State Flow</h2>
        <p className="text-[var(--muted-foreground)] mb-6">
          The form progresses through three main states: Initial (email input), Loading (sending request), and Success
          (confirmation message).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-semibold text-sm">
              1
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Initial State</h3>
          </div>
          <div className="max-w-md">
            <PasswordResetForm />
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">
            User enters email address and clicks "Link Senden" button
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-semibold text-sm">
              2
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Loading State</h3>
          </div>
          <div className="text-center p-8 border border-dashed border-[var(--border)] rounded-lg bg-[var(--card)]">
            <p className="text-[var(--muted-foreground)] mb-2">Button shows:</p>
            <p className="font-semibold text-[var(--foreground)]">"Wird gesendet..."</p>
            <p className="text-sm text-[var(--muted-foreground)] mt-4">Button is disabled</p>
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">
            Request is being processed (simulated 1s API call)
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold text-sm">
              ✓
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Success State</h3>
          </div>
          <div className="text-center p-8 border border-dashed border-green-500 rounded-lg bg-green-500/10">
            <p className="text-green-400 text-sm">
              "Eine E-Mail zum Zurücksetzen deines Passworts wurde gesendet. Bitte überprüfe dein Postfach."
            </p>
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">
            Form input replaced with success message
          </p>
        </div>
      </div>

      <div className="mt-8 p-6 bg-[var(--card)] rounded-lg border border-[var(--border)]">
        <h3 className="text-lg font-semibold mb-3 text-[var(--foreground)]">Complete Flow Example</h3>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          Try the complete workflow in this live example. Enter a valid email and watch the state transitions:
        </p>
        <div className="max-w-md mx-auto">
          <PasswordResetForm onSuccess={() => console.log('Password reset email sent')} onError={error => console.error('Error:', error)} />
        </div>
      </div>
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Visual demonstration of the three main states: Initial (email input), Loading, and Success.'
      }
    }
  }
}`,...(We=(Ve=f.parameters)==null?void 0:Ve.docs)==null?void 0:We.source},description:{story:"State transitions demo - showing the workflow",...(_e=(qe=f.parameters)==null?void 0:qe.docs)==null?void 0:_e.description}}};var Ge,He,Oe,$e,Ke;v.parameters={...v.parameters,docs:{...(Ge=v.parameters)==null?void 0:Ge.docs,source:{originalSource:`{
  render: () => <div className="space-y-12 p-6 max-w-7xl">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">
          Integration with Authentication Flow
        </h2>
        <p className="text-[var(--muted-foreground)]">
          The PasswordResetForm integrates seamlessly with other authentication forms like LoginForm and
          RegisterForm. Below are common page layouts using the component.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">Simple Reset Page</h3>
          <div className="bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 rounded-lg min-h-[500px] flex items-center justify-center">
            <PasswordResetForm />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">Reset Page with Branding</h3>
          <div className="bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 rounded-lg min-h-[600px] flex items-center justify-center">
            <div className="w-full max-w-md space-y-8">
              <div className="text-center space-y-2">
                <div className="text-[var(--primary)] text-5xl font-light mb-4">Ozean Licht</div>
                <p className="text-sm text-[var(--muted-foreground)]">Dein spiritueller Begleiter</p>
              </div>
              <PasswordResetForm />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">
            Side-by-Side Layout (Desktop)
          </h3>
          <div className="bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 rounded-lg min-h-[600px]">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
              <div className="space-y-6 text-[var(--foreground)]">
                <h1 className="text-4xl font-light">Passwort zurücksetzen</h1>
                <p className="text-lg text-[var(--muted-foreground)]">
                  Gib deine E-Mail-Adresse ein und wir senden dir einen sicheren Link zum Zurücksetzen deines
                  Passworts.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--primary)] mt-1">✓</span>
                    <span className="text-sm">Schneller und sicherer Prozess</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--primary)] mt-1">✓</span>
                    <span className="text-sm">Link ist zeitlich begrenzt gültig</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--primary)] mt-1">✓</span>
                    <span className="text-sm">Deine Daten bleiben geschützt</span>
                  </li>
                </ul>
              </div>
              <div>
                <PasswordResetForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Examples of how to integrate PasswordResetForm into complete authentication pages with various layouts and branding.'
      }
    }
  }
}`,...(Oe=(He=v.parameters)==null?void 0:He.docs)==null?void 0:Oe.source},description:{story:"Integration example with full authentication pages",...(Ke=($e=v.parameters)==null?void 0:$e.docs)==null?void 0:Ke.description}}};const Ws=["Default","WithRedirect","CustomStyling","WithSuccessHandling","WithErrorHandling","CosmicTheme","MobileView","WideContainer","Playground","ValidationDemo","PasswordResetFlow","AllStates","BehaviorDocumentation","StateTransitions","AuthenticationPages"];export{h as AllStates,v as AuthenticationPages,g as BehaviorDocumentation,l as CosmicTheme,i as CustomStyling,t as Default,c as MobileView,x as PasswordResetFlow,u as Playground,f as StateTransitions,p as ValidationDemo,m as WideContainer,n as WithErrorHandling,o as WithRedirect,d as WithSuccessHandling,Ws as __namedExportsOrder,Vs as default};
