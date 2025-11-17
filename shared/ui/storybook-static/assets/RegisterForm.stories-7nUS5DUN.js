import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{R as s}from"./RegisterForm-mlDHufI8.js";import{f as y}from"./index-CJu6nLMj.js";import"./index-B2-qRKKC.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index.esm-SGBzMz4R.js";import"./schemas-C3QG-Qu7.js";import"./Card-CHzXRqp1.js";import"./index-Dp3B9jqt.js";import"./clsx-B-dksMZM.js";import"./card-DPYCUmwK.js";import"./cn-CKXzwFwe.js";import"./Button-PgnE6Xyj.js";import"./button-DhHHw9VN.js";import"./index-BiMR7eR1.js";import"./index-BFjtS4uE.js";import"./Input-C2o_RQ9B.js";import"./input-BK5gJSzh.js";import"./textarea-B_02bPEu.js";import"./label-BZCfx7Ud.js";import"./index-B5oyz0SX.js";import"./index-kS-9iBlu.js";import"./alert-D3j30XLg.js";import"./checkbox-BAdY7mee.js";import"./index-BiUY2kQP.js";import"./index-BlCrtW8-.js";import"./index-D1vk04JX.js";import"./index-_AbP6Uzr.js";import"./index-BYfY0yFj.js";import"./index-PNzqWif7.js";import"./check-BFJmnSzs.js";import"./createLucideIcon-BbF4D6Jl.js";import"./eye-off-z17qZm2P.js";import"./eye-B2FZkYMJ.js";const Wr={title:"Tier 3: Compositions/Forms/RegisterForm",component:s,parameters:{layout:"centered",docs:{description:{component:"Complete registration form composition with validation, password matching, terms acceptance, and error handling. Features Ozean Licht branding with glass morphism card design and turquoise accents."}}},tags:["autodocs"],argTypes:{onSuccess:{description:"Callback function called when registration succeeds",control:!1,action:"register-success"},onError:{description:"Callback function called when registration fails",control:!1,action:"register-error"},redirectUrl:{description:"URL to redirect to after successful registration",control:"text",table:{defaultValue:{summary:"/dashboard"}}},showLoginLink:{description:'Show "Already have an account?" login link',control:"boolean",table:{defaultValue:{summary:"true"}}},requireTerms:{description:"Require terms and conditions acceptance",control:"boolean",table:{defaultValue:{summary:"true"}}},className:{description:"Custom className for styling",control:"text"}},args:{onSuccess:y(),onError:y()},decorators:[r=>e.jsx("div",{className:"w-full max-w-md p-4",children:e.jsx(r,{})})]},a={args:{redirectUrl:"/dashboard",showLoginLink:!0,requireTerms:!0}},t={args:{redirectUrl:"/dashboard",showLoginLink:!1,requireTerms:!0},parameters:{docs:{description:{story:"Registration form with login link hidden."}}}},i={args:{redirectUrl:"/dashboard",showLoginLink:!0,requireTerms:!1},parameters:{docs:{description:{story:"Registration form without terms and conditions checkbox."}}}},o={args:{redirectUrl:"/dashboard",showLoginLink:!1,requireTerms:!1},parameters:{docs:{description:{story:"Minimal registration form with only required fields: name, email, password, and confirm password."}}}},n={args:{redirectUrl:"/onboarding",showLoginLink:!0,requireTerms:!0},parameters:{docs:{description:{story:"Registration form redirecting to a custom onboarding URL after successful registration."}}}},d={args:{redirectUrl:"/dashboard",showLoginLink:!0,requireTerms:!0,className:"shadow-2xl border-2 border-[var(--primary)]"},parameters:{docs:{description:{story:"Registration form with custom className applied for enhanced border and shadow."}}}},c={args:{redirectUrl:"/dashboard",showLoginLink:!0,requireTerms:!0,onError:r=>{console.error("Registration error:",r),alert(`Registration failed: ${r.message}`)}},parameters:{docs:{description:{story:"Demonstrates error handling callback. Try submitting with valid data to see the error handler in action."}}}},l={args:{redirectUrl:"/dashboard",showLoginLink:!0,requireTerms:!0,onSuccess:r=>{console.log("Registration successful:",r),alert(`Welcome ${r.name}! Account created for ${r.email}`)}},parameters:{docs:{description:{story:"Demonstrates success handling callback. Submit the form to see the success handler in action (simulates 1s API call)."}}}},m={args:{redirectUrl:"/dashboard",showLoginLink:!0,requireTerms:!0},decorators:[r=>e.jsx("div",{className:"min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center",children:e.jsx(r,{})})],parameters:{layout:"fullscreen",docs:{description:{story:"Registration form displayed on cosmic dark background showcasing glass morphism effect."}}}},u={args:{redirectUrl:"/dashboard",showLoginLink:!0,requireTerms:!0},decorators:[r=>e.jsx("div",{className:"w-full max-w-[320px] p-4",children:e.jsx(r,{})})],parameters:{viewport:{defaultViewport:"mobile1"},docs:{description:{story:"Registration form optimized for mobile viewports with responsive layout."}}}},p={args:{redirectUrl:"/dashboard",showLoginLink:!0,requireTerms:!0},decorators:[r=>e.jsx("div",{className:"w-full max-w-2xl p-4",children:e.jsx(r,{})})],parameters:{docs:{description:{story:"Registration form in a wider container. The form maintains its max-width constraint."}}}},g={args:{redirectUrl:"/dashboard",showLoginLink:!0,requireTerms:!0},parameters:{docs:{description:{story:"Interactive playground to test all props and behaviors. Use the controls panel to modify props dynamically."}}}},h={render:()=>e.jsxs("div",{className:"space-y-6 w-full max-w-2xl",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-2 text-[var(--foreground)]",children:"Validation Rules"}),e.jsxs("ul",{className:"list-disc list-inside space-y-1 text-sm text-[var(--muted-foreground)]",children:[e.jsx("li",{children:"Name: Minimum 2 characters"}),e.jsx("li",{children:"Email: Must be a valid email address"}),e.jsx("li",{children:"Password: Minimum 8 characters"}),e.jsx("li",{children:"Confirm Password: Must match password field"}),e.jsx("li",{children:"Terms: Must be accepted"})]})]}),e.jsx(s,{redirectUrl:"/dashboard",showLoginLink:!0,requireTerms:!0,onSuccess:r=>console.log("Success:",r),onError:r=>console.error("Error:",r)}),e.jsxs("div",{className:"text-xs text-[var(--muted-foreground)] space-y-1",children:[e.jsx("p",{children:e.jsx("strong",{children:"Try these test cases:"})}),e.jsxs("ul",{className:"list-disc list-inside space-y-1 ml-4",children:[e.jsx("li",{children:'Short name: "A" (shows "Name must be at least 2 characters")'}),e.jsx("li",{children:'Invalid email: "test" (shows "Invalid email address")'}),e.jsx("li",{children:'Short password: "pass" (shows "Password must be at least 8 characters")'}),e.jsx("li",{children:`Mismatched passwords: Different values in password fields (shows "Passwords don't match")`}),e.jsx("li",{children:'Missing terms: Submit without checking terms (shows "You must accept the terms")'}),e.jsx("li",{children:'Valid data: "John Doe" + "test@example.com" + "password123" (matching) + terms checked'})]})]})]}),parameters:{layout:"centered",docs:{description:{story:"Demonstrates form validation with Zod schema including password matching. Try submitting with invalid data to see error messages."}}}},f={render:()=>e.jsx("div",{className:"min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center",children:e.jsxs("div",{className:"w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center",children:[e.jsxs("div",{className:"space-y-6 text-[var(--foreground)]",children:[e.jsx("h1",{className:"text-4xl font-light",children:"Beginne deine Reise"}),e.jsx("p",{className:"text-lg text-[var(--muted-foreground)]",children:"Erstelle dein Konto und tauche ein in die Welt der spirituellen Entwicklung und persönlichen Transformation."}),e.jsxs("ul",{className:"space-y-3 text-sm",children:[e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"text-[var(--primary)] mt-1",children:"✓"}),e.jsx("span",{children:"Zugang zu exklusiven Kursen und Workshops"})]}),e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"text-[var(--primary)] mt-1",children:"✓"}),e.jsx("span",{children:"Personalisierte Lernpfade und Empfehlungen"})]}),e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"text-[var(--primary)] mt-1",children:"✓"}),e.jsx("span",{children:"Community-Zugang und regelmäßige Updates"})]}),e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"text-[var(--primary)] mt-1",children:"✓"}),e.jsx("span",{children:"Fortschrittsverfolgung und Zertifikate"})]})]})]}),e.jsx("div",{children:e.jsx(s,{redirectUrl:"/dashboard",showLoginLink:!0,requireTerms:!0,onSuccess:r=>console.log("Registration successful:",r),onError:r=>console.error("Registration failed:",r)})})]})}),parameters:{layout:"fullscreen",docs:{description:{story:"Complete registration page layout with marketing copy and registration form, showcasing real-world usage."}}}},x={render:()=>e.jsxs("div",{className:"space-y-8 p-6 max-w-7xl",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"Default State (Full Features)"}),e.jsx("div",{className:"max-w-md",children:e.jsx(s,{redirectUrl:"/dashboard",showLoginLink:!0,requireTerms:!0})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"Minimal (No Extra Features)"}),e.jsx("div",{className:"max-w-md",children:e.jsx(s,{redirectUrl:"/dashboard",showLoginLink:!1,requireTerms:!1})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"With Terms, No Login Link"}),e.jsx("div",{className:"max-w-md",children:e.jsx(s,{redirectUrl:"/dashboard",showLoginLink:!1,requireTerms:!0})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"With Custom Styling (Enhanced Border)"}),e.jsx("div",{className:"max-w-md",children:e.jsx(s,{redirectUrl:"/dashboard",showLoginLink:!0,requireTerms:!0,className:"border-2 border-[var(--primary)] shadow-2xl"})})]})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Side-by-side comparison of different form configurations and states."}}}},v={render:()=>e.jsxs("div",{className:"space-y-6 p-6 max-w-4xl",children:[e.jsx("div",{children:e.jsx("h2",{className:"text-2xl font-semibold mb-4 text-[var(--foreground)]",children:"RegisterForm Behavior"})}),e.jsxs("div",{className:"space-y-4 text-sm",children:[e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Password Visibility Toggle"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:"Click the eye icon in the password field to toggle password visibility. The icon changes from Eye to EyeOff when password is visible. Note: Confirm password field remains hidden for security."})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Password Matching Validation"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:`The form validates that password and confirm password fields match. If they don't match, an error message "Passwords don't match" appears below the confirm password field.`})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Terms Acceptance"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:'When requireTerms is true, users must check the terms acceptance checkbox before submitting. The checkbox includes a link to the terms page. Submitting without acceptance shows "You must accept the terms" error.'})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Loading State"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:'During registration (simulated 1s delay), the submit button shows "Wird erstellt..." and is disabled to prevent duplicate submissions.'})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Error Handling"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:"Validation errors appear inline below each field. Server errors appear in a destructive Alert component above the submit button."})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Redirect Behavior"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:"After successful registration, if redirectUrl is provided, the form automatically redirects using window.location.href. If onSuccess callback is provided, it's called before redirect."})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Login Link"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:'When showLoginLink is true, a "Bereits ein Konto?" link appears below the form, directing existing users to the login page.'})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Accessibility"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:"All form fields have proper labels with htmlFor attributes. Password toggle button has aria-label. Error messages are associated with fields using ARIA attributes. Checkbox is keyboard accessible."})]})]}),e.jsxs("div",{className:"mt-8",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"Try it yourself:"}),e.jsx(s,{redirectUrl:"/dashboard",showLoginLink:!0,requireTerms:!0,onSuccess:r=>alert(`Success! Account created for ${r.name} (${r.email})`),onError:r=>alert(`Error: ${r.message}`)})]})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Comprehensive documentation of form behavior, states, and user interactions."}}}},b={render:()=>e.jsx("div",{className:"min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center",children:e.jsxs("div",{className:"w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start",children:[e.jsxs("div",{className:"space-y-6 text-[var(--foreground)]",children:[e.jsx("h2",{className:"text-3xl font-light",children:"Sichere Passwörter"}),e.jsxs("div",{className:"space-y-4 text-sm",children:[e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--primary)]",children:"Mindestanforderungen"}),e.jsxs("ul",{className:"list-disc list-inside space-y-1 text-[var(--muted-foreground)]",children:[e.jsx("li",{children:"Mindestens 8 Zeichen lang"}),e.jsx("li",{children:"Verwendung von Buchstaben und Zahlen"})]})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--primary)]",children:"Empfohlene Best Practices"}),e.jsxs("ul",{className:"list-disc list-inside space-y-1 text-[var(--muted-foreground)]",children:[e.jsx("li",{children:"Verwendung von Groß- und Kleinbuchstaben"}),e.jsx("li",{children:"Einbeziehung von Sonderzeichen (!@#$%^&*)"}),e.jsx("li",{children:"Vermeidung persönlicher Informationen"}),e.jsx("li",{children:"Keine Wiederverwendung alter Passwörter"}),e.jsx("li",{children:"Verwendung eines Passwort-Managers"})]})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--primary)]",children:"Beispiele für starke Passwörter"}),e.jsxs("ul",{className:"list-disc list-inside space-y-1 text-[var(--muted-foreground)]",children:[e.jsx("li",{children:"Tr0p!calP@radise2024"}),e.jsx("li",{children:"M00nL!ght&Stars99"}),e.jsx("li",{children:"C0sm!cJ0urney#2024"})]})]})]})]}),e.jsx("div",{children:e.jsx(s,{redirectUrl:"/dashboard",showLoginLink:!0,requireTerms:!0,onSuccess:r=>console.log("Registration successful:",r),onError:r=>console.error("Registration failed:",r)})})]})}),parameters:{layout:"fullscreen",docs:{description:{story:"Registration form with password security guidance and best practices display."}}}},w={render:()=>e.jsx("div",{className:"min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center",children:e.jsxs("div",{className:"w-full max-w-4xl space-y-6",children:[e.jsxs("div",{className:"flex items-center justify-center gap-4 mb-8",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-sm font-semibold",children:"1"}),e.jsx("span",{className:"text-[var(--foreground)] font-medium",children:"Konto"})]}),e.jsx("div",{className:"w-16 h-0.5 bg-[var(--border)]"}),e.jsxs("div",{className:"flex items-center gap-2 opacity-50",children:[e.jsx("div",{className:"w-8 h-8 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] flex items-center justify-center text-sm font-semibold",children:"2"}),e.jsx("span",{className:"text-[var(--muted-foreground)]",children:"Profil"})]}),e.jsx("div",{className:"w-16 h-0.5 bg-[var(--border)]"}),e.jsxs("div",{className:"flex items-center gap-2 opacity-50",children:[e.jsx("div",{className:"w-8 h-8 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] flex items-center justify-center text-sm font-semibold",children:"3"}),e.jsx("span",{className:"text-[var(--muted-foreground)]",children:"Bestätigung"})]})]}),e.jsx("div",{className:"flex justify-center",children:e.jsx(s,{redirectUrl:"/onboarding/profile",showLoginLink:!0,requireTerms:!0,onSuccess:r=>console.log("Step 1 complete:",r),onError:r=>console.error("Registration failed:",r)})}),e.jsx("div",{className:"text-center text-sm text-[var(--muted-foreground)]",children:e.jsx("p",{children:"Schritt 1 von 3: Erstelle dein Konto mit den Basis-Informationen"})})]})}),parameters:{layout:"fullscreen",docs:{description:{story:"Registration form in a multi-step onboarding context with progress indicator, showing how it fits into a larger registration flow."}}}};var N,j,L,k,S;a.parameters={...a.parameters,docs:{...(N=a.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    redirectUrl: '/dashboard',
    showLoginLink: true,
    requireTerms: true
  }
}`,...(L=(j=a.parameters)==null?void 0:j.docs)==null?void 0:L.source},description:{story:"Default registration form with all features enabled",...(S=(k=a.parameters)==null?void 0:k.docs)==null?void 0:S.description}}};var T,R,A,U,q;t.parameters={...t.parameters,docs:{...(T=t.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    redirectUrl: '/dashboard',
    showLoginLink: false,
    requireTerms: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Registration form with login link hidden.'
      }
    }
  }
}`,...(A=(R=t.parameters)==null?void 0:R.docs)==null?void 0:A.source},description:{story:"Registration form without login link",...(q=(U=t.parameters)==null?void 0:U.docs)==null?void 0:q.description}}};var E,F,P,M,C;i.parameters={...i.parameters,docs:{...(E=i.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    redirectUrl: '/dashboard',
    showLoginLink: true,
    requireTerms: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Registration form without terms and conditions checkbox.'
      }
    }
  }
}`,...(P=(F=i.parameters)==null?void 0:F.docs)==null?void 0:P.source},description:{story:"Registration form without terms requirement",...(C=(M=i.parameters)==null?void 0:M.docs)==null?void 0:C.description}}};var V,W,B,D,I;o.parameters={...o.parameters,docs:{...(V=o.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    redirectUrl: '/dashboard',
    showLoginLink: false,
    requireTerms: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal registration form with only required fields: name, email, password, and confirm password.'
      }
    }
  }
}`,...(B=(W=o.parameters)==null?void 0:W.docs)==null?void 0:B.source},description:{story:"Minimal registration form (no extra features)",...(I=(D=o.parameters)==null?void 0:D.docs)==null?void 0:I.description}}};var K,$,Z,z,H;n.parameters={...n.parameters,docs:{...(K=n.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    redirectUrl: '/onboarding',
    showLoginLink: true,
    requireTerms: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Registration form redirecting to a custom onboarding URL after successful registration.'
      }
    }
  }
}`,...(Z=($=n.parameters)==null?void 0:$.docs)==null?void 0:Z.source},description:{story:"Registration form with custom redirect URL",...(H=(z=n.parameters)==null?void 0:z.docs)==null?void 0:H.description}}};var J,O,Y,G,_;d.parameters={...d.parameters,docs:{...(J=d.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    redirectUrl: '/dashboard',
    showLoginLink: true,
    requireTerms: true,
    className: 'shadow-2xl border-2 border-[var(--primary)]'
  },
  parameters: {
    docs: {
      description: {
        story: 'Registration form with custom className applied for enhanced border and shadow.'
      }
    }
  }
}`,...(Y=(O=d.parameters)==null?void 0:O.docs)==null?void 0:Y.source},description:{story:"Registration form with custom styling",...(_=(G=d.parameters)==null?void 0:G.docs)==null?void 0:_.description}}};var Q,X,ee,re,se;c.parameters={...c.parameters,docs:{...(Q=c.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    redirectUrl: '/dashboard',
    showLoginLink: true,
    requireTerms: true,
    onError: (error: Error) => {
      console.error('Registration error:', error);
      alert(\`Registration failed: \${error.message}\`);
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates error handling callback. Try submitting with valid data to see the error handler in action.'
      }
    }
  }
}`,...(ee=(X=c.parameters)==null?void 0:X.docs)==null?void 0:ee.source},description:{story:"Registration form with error handling demo",...(se=(re=c.parameters)==null?void 0:re.docs)==null?void 0:se.description}}};var ae,te,ie,oe,ne;l.parameters={...l.parameters,docs:{...(ae=l.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  args: {
    redirectUrl: '/dashboard',
    showLoginLink: true,
    requireTerms: true,
    onSuccess: (user: any) => {
      console.log('Registration successful:', user);
      alert(\`Welcome \${user.name}! Account created for \${user.email}\`);
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates success handling callback. Submit the form to see the success handler in action (simulates 1s API call).'
      }
    }
  }
}`,...(ie=(te=l.parameters)==null?void 0:te.docs)==null?void 0:ie.source},description:{story:"Registration form with success handling demo",...(ne=(oe=l.parameters)==null?void 0:oe.docs)==null?void 0:ne.description}}};var de,ce,le,me,ue;m.parameters={...m.parameters,docs:{...(de=m.parameters)==null?void 0:de.docs,source:{originalSource:`{
  args: {
    redirectUrl: '/dashboard',
    showLoginLink: true,
    requireTerms: true
  },
  decorators: [Story => <div className="min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center">
        <Story />
      </div>],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Registration form displayed on cosmic dark background showcasing glass morphism effect.'
      }
    }
  }
}`,...(le=(ce=m.parameters)==null?void 0:ce.docs)==null?void 0:le.source},description:{story:"Registration form on cosmic dark background",...(ue=(me=m.parameters)==null?void 0:me.docs)==null?void 0:ue.description}}};var pe,ge,he,fe,xe;u.parameters={...u.parameters,docs:{...(pe=u.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  args: {
    redirectUrl: '/dashboard',
    showLoginLink: true,
    requireTerms: true
  },
  decorators: [Story => <div className="w-full max-w-[320px] p-4">
        <Story />
      </div>],
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Registration form optimized for mobile viewports with responsive layout.'
      }
    }
  }
}`,...(he=(ge=u.parameters)==null?void 0:ge.docs)==null?void 0:he.source},description:{story:"Registration form in narrow mobile container",...(xe=(fe=u.parameters)==null?void 0:fe.docs)==null?void 0:xe.description}}};var ve,be,we,ye,Ne;p.parameters={...p.parameters,docs:{...(ve=p.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  args: {
    redirectUrl: '/dashboard',
    showLoginLink: true,
    requireTerms: true
  },
  decorators: [Story => <div className="w-full max-w-2xl p-4">
        <Story />
      </div>],
  parameters: {
    docs: {
      description: {
        story: 'Registration form in a wider container. The form maintains its max-width constraint.'
      }
    }
  }
}`,...(we=(be=p.parameters)==null?void 0:be.docs)==null?void 0:we.source},description:{story:"Registration form with wide container",...(Ne=(ye=p.parameters)==null?void 0:ye.docs)==null?void 0:Ne.description}}};var je,Le,ke,Se,Te;g.parameters={...g.parameters,docs:{...(je=g.parameters)==null?void 0:je.docs,source:{originalSource:`{
  args: {
    redirectUrl: '/dashboard',
    showLoginLink: true,
    requireTerms: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all props and behaviors. Use the controls panel to modify props dynamically.'
      }
    }
  }
}`,...(ke=(Le=g.parameters)==null?void 0:Le.docs)==null?void 0:ke.source},description:{story:"Interactive playground with all controls",...(Te=(Se=g.parameters)==null?void 0:Se.docs)==null?void 0:Te.description}}};var Re,Ae,Ue,qe,Ee;h.parameters={...h.parameters,docs:{...(Re=h.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 w-full max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-[var(--foreground)]">Validation Rules</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-[var(--muted-foreground)]">
          <li>Name: Minimum 2 characters</li>
          <li>Email: Must be a valid email address</li>
          <li>Password: Minimum 8 characters</li>
          <li>Confirm Password: Must match password field</li>
          <li>Terms: Must be accepted</li>
        </ul>
      </div>
      <RegisterForm redirectUrl="/dashboard" showLoginLink requireTerms onSuccess={user => console.log('Success:', user)} onError={error => console.error('Error:', error)} />
      <div className="text-xs text-[var(--muted-foreground)] space-y-1">
        <p>
          <strong>Try these test cases:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Short name: "A" (shows "Name must be at least 2 characters")</li>
          <li>Invalid email: "test" (shows "Invalid email address")</li>
          <li>Short password: "pass" (shows "Password must be at least 8 characters")</li>
          <li>Mismatched passwords: Different values in password fields (shows "Passwords don't match")</li>
          <li>Missing terms: Submit without checking terms (shows "You must accept the terms")</li>
          <li>Valid data: "John Doe" + "test@example.com" + "password123" (matching) + terms checked</li>
        </ul>
      </div>
    </div>,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: 'Demonstrates form validation with Zod schema including password matching. Try submitting with invalid data to see error messages.'
      }
    }
  }
}`,...(Ue=(Ae=h.parameters)==null?void 0:Ae.docs)==null?void 0:Ue.source},description:{story:"Validation demo - shows inline validation errors",...(Ee=(qe=h.parameters)==null?void 0:qe.docs)==null?void 0:Ee.description}}};var Fe,Pe,Me,Ce,Ve;f.parameters={...f.parameters,docs:{...(Fe=f.parameters)==null?void 0:Fe.docs,source:{originalSource:`{
  render: () => <div className="min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 text-[var(--foreground)]">
          <h1 className="text-4xl font-light">Beginne deine Reise</h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            Erstelle dein Konto und tauche ein in die Welt der spirituellen Entwicklung und persönlichen Transformation.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-1">✓</span>
              <span>Zugang zu exklusiven Kursen und Workshops</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-1">✓</span>
              <span>Personalisierte Lernpfade und Empfehlungen</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-1">✓</span>
              <span>Community-Zugang und regelmäßige Updates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-1">✓</span>
              <span>Fortschrittsverfolgung und Zertifikate</span>
            </li>
          </ul>
        </div>
        <div>
          <RegisterForm redirectUrl="/dashboard" showLoginLink requireTerms onSuccess={user => console.log('Registration successful:', user)} onError={error => console.error('Registration failed:', error)} />
        </div>
      </div>
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Complete registration page layout with marketing copy and registration form, showcasing real-world usage.'
      }
    }
  }
}`,...(Me=(Pe=f.parameters)==null?void 0:Pe.docs)==null?void 0:Me.source},description:{story:"Complete registration flow showcase",...(Ve=(Ce=f.parameters)==null?void 0:Ce.docs)==null?void 0:Ve.description}}};var We,Be,De,Ie,Ke;x.parameters={...x.parameters,docs:{...(We=x.parameters)==null?void 0:We.docs,source:{originalSource:`{
  render: () => <div className="space-y-8 p-6 max-w-7xl">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Default State (Full Features)</h3>
        <div className="max-w-md">
          <RegisterForm redirectUrl="/dashboard" showLoginLink requireTerms />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Minimal (No Extra Features)</h3>
        <div className="max-w-md">
          <RegisterForm redirectUrl="/dashboard" showLoginLink={false} requireTerms={false} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">With Terms, No Login Link</h3>
        <div className="max-w-md">
          <RegisterForm redirectUrl="/dashboard" showLoginLink={false} requireTerms />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
          With Custom Styling (Enhanced Border)
        </h3>
        <div className="max-w-md">
          <RegisterForm redirectUrl="/dashboard" showLoginLink requireTerms className="border-2 border-[var(--primary)] shadow-2xl" />
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
}`,...(De=(Be=x.parameters)==null?void 0:Be.docs)==null?void 0:De.source},description:{story:"All form states comparison",...(Ke=(Ie=x.parameters)==null?void 0:Ie.docs)==null?void 0:Ke.description}}};var $e,Ze,ze,He,Je;v.parameters={...v.parameters,docs:{...($e=v.parameters)==null?void 0:$e.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 p-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">RegisterForm Behavior</h2>
      </div>

      <div className="space-y-4 text-sm">
        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Password Visibility Toggle</h3>
          <p className="text-[var(--muted-foreground)]">
            Click the eye icon in the password field to toggle password visibility. The icon changes from Eye to
            EyeOff when password is visible. Note: Confirm password field remains hidden for security.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Password Matching Validation</h3>
          <p className="text-[var(--muted-foreground)]">
            The form validates that password and confirm password fields match. If they don't match, an error message
            "Passwords don't match" appears below the confirm password field.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Terms Acceptance</h3>
          <p className="text-[var(--muted-foreground)]">
            When requireTerms is true, users must check the terms acceptance checkbox before submitting. The checkbox
            includes a link to the terms page. Submitting without acceptance shows "You must accept the terms" error.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Loading State</h3>
          <p className="text-[var(--muted-foreground)]">
            During registration (simulated 1s delay), the submit button shows "Wird erstellt..." and is disabled to
            prevent duplicate submissions.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Error Handling</h3>
          <p className="text-[var(--muted-foreground)]">
            Validation errors appear inline below each field. Server errors appear in a destructive Alert component
            above the submit button.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Redirect Behavior</h3>
          <p className="text-[var(--muted-foreground)]">
            After successful registration, if redirectUrl is provided, the form automatically redirects using
            window.location.href. If onSuccess callback is provided, it's called before redirect.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Login Link</h3>
          <p className="text-[var(--muted-foreground)]">
            When showLoginLink is true, a "Bereits ein Konto?" link appears below the form, directing existing users
            to the login page.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Accessibility</h3>
          <p className="text-[var(--muted-foreground)]">
            All form fields have proper labels with htmlFor attributes. Password toggle button has aria-label. Error
            messages are associated with fields using ARIA attributes. Checkbox is keyboard accessible.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Try it yourself:</h3>
        <RegisterForm redirectUrl="/dashboard" showLoginLink requireTerms onSuccess={user => alert(\`Success! Account created for \${user.name} (\${user.email})\`)} onError={error => alert(\`Error: \${error.message}\`)} />
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
}`,...(ze=(Ze=v.parameters)==null?void 0:Ze.docs)==null?void 0:ze.source},description:{story:"Form behavior documentation",...(Je=(He=v.parameters)==null?void 0:He.docs)==null?void 0:Je.description}}};var Oe,Ye,Ge,_e,Qe;b.parameters={...b.parameters,docs:{...(Oe=b.parameters)==null?void 0:Oe.docs,source:{originalSource:`{
  render: () => <div className="min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6 text-[var(--foreground)]">
          <h2 className="text-3xl font-light">Sichere Passwörter</h2>
          <div className="space-y-4 text-sm">
            <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
              <h3 className="font-semibold mb-2 text-[var(--primary)]">Mindestanforderungen</h3>
              <ul className="list-disc list-inside space-y-1 text-[var(--muted-foreground)]">
                <li>Mindestens 8 Zeichen lang</li>
                <li>Verwendung von Buchstaben und Zahlen</li>
              </ul>
            </div>

            <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
              <h3 className="font-semibold mb-2 text-[var(--primary)]">Empfohlene Best Practices</h3>
              <ul className="list-disc list-inside space-y-1 text-[var(--muted-foreground)]">
                <li>Verwendung von Groß- und Kleinbuchstaben</li>
                <li>Einbeziehung von Sonderzeichen (!@#$%^&*)</li>
                <li>Vermeidung persönlicher Informationen</li>
                <li>Keine Wiederverwendung alter Passwörter</li>
                <li>Verwendung eines Passwort-Managers</li>
              </ul>
            </div>

            <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
              <h3 className="font-semibold mb-2 text-[var(--primary)]">Beispiele für starke Passwörter</h3>
              <ul className="list-disc list-inside space-y-1 text-[var(--muted-foreground)]">
                <li>Tr0p!calP@radise2024</li>
                <li>M00nL!ght&Stars99</li>
                <li>C0sm!cJ0urney#2024</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <RegisterForm redirectUrl="/dashboard" showLoginLink requireTerms onSuccess={user => console.log('Registration successful:', user)} onError={error => console.error('Registration failed:', error)} />
        </div>
      </div>
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Registration form with password security guidance and best practices display.'
      }
    }
  }
}`,...(Ge=(Ye=b.parameters)==null?void 0:Ye.docs)==null?void 0:Ge.source},description:{story:"Password strength and security guidance",...(Qe=(_e=b.parameters)==null?void 0:_e.docs)==null?void 0:Qe.description}}};var Xe,er,rr,sr,ar;w.parameters={...w.parameters,docs:{...(Xe=w.parameters)==null?void 0:Xe.docs,source:{originalSource:`{
  render: () => <div className="min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <span className="text-[var(--foreground)] font-medium">Konto</span>
          </div>
          <div className="w-16 h-0.5 bg-[var(--border)]" />
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-8 h-8 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <span className="text-[var(--muted-foreground)]">Profil</span>
          </div>
          <div className="w-16 h-0.5 bg-[var(--border)]" />
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-8 h-8 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] flex items-center justify-center text-sm font-semibold">
              3
            </div>
            <span className="text-[var(--muted-foreground)]">Bestätigung</span>
          </div>
        </div>

        {/* Form */}
        <div className="flex justify-center">
          <RegisterForm redirectUrl="/onboarding/profile" showLoginLink requireTerms onSuccess={user => console.log('Step 1 complete:', user)} onError={error => console.error('Registration failed:', error)} />
        </div>

        {/* Help text */}
        <div className="text-center text-sm text-[var(--muted-foreground)]">
          <p>Schritt 1 von 3: Erstelle dein Konto mit den Basis-Informationen</p>
        </div>
      </div>
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Registration form in a multi-step onboarding context with progress indicator, showing how it fits into a larger registration flow.'
      }
    }
  }
}`,...(rr=(er=w.parameters)==null?void 0:er.docs)==null?void 0:rr.source},description:{story:"Multi-step registration preview",...(ar=(sr=w.parameters)==null?void 0:sr.docs)==null?void 0:ar.description}}};const Br=["Default","NoLoginLink","NoTermsRequired","MinimalForm","CustomRedirect","CustomStyling","WithErrorHandling","WithSuccessHandling","CosmicTheme","MobileView","WideContainer","Playground","ValidationDemo","RegistrationFlow","AllStates","BehaviorDocumentation","PasswordSecurity","MultiStepContext"];export{x as AllStates,v as BehaviorDocumentation,m as CosmicTheme,n as CustomRedirect,d as CustomStyling,a as Default,o as MinimalForm,u as MobileView,w as MultiStepContext,t as NoLoginLink,i as NoTermsRequired,b as PasswordSecurity,g as Playground,f as RegistrationFlow,h as ValidationDemo,p as WideContainer,c as WithErrorHandling,l as WithSuccessHandling,Br as __namedExportsOrder,Wr as default};
