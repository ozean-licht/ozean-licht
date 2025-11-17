import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{L as s}from"./LoginForm-CRIr4mdo.js";import{f as v}from"./index-CJu6nLMj.js";import"./index-B2-qRKKC.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index.esm-SGBzMz4R.js";import"./schemas-C3QG-Qu7.js";import"./Card-B3jXYF8b.js";import"./index-DVF2XGCm.js";import"./cn-CytzSlOG.js";import"./card-DrBDOuQX.js";import"./Button-Clfx5zjS.js";import"./button-C8qtCU0L.js";import"./index-BiMR7eR1.js";import"./index-BFjtS4uE.js";import"./Input-B8-YZaEC.js";import"./input-Db9iZ-Hs.js";import"./textarea-Cd1j4ONA.js";import"./label-Cp9r14oL.js";import"./index-B5oyz0SX.js";import"./index-kS-9iBlu.js";import"./alert-JMCFSqIB.js";import"./eye-off-z17qZm2P.js";import"./createLucideIcon-BbF4D6Jl.js";import"./eye-B2FZkYMJ.js";const wr={title:"Tier 3: Compositions/Forms/LoginForm",component:s,parameters:{layout:"centered",docs:{description:{component:"Complete login form composition with validation, error handling, and password visibility toggle. Features Ozean Licht branding with glass morphism card design and turquoise accents."}}},tags:["autodocs"],argTypes:{onSuccess:{description:"Callback function called when login succeeds",control:!1,action:"login-success"},onError:{description:"Callback function called when login fails",control:!1,action:"login-error"},redirectUrl:{description:"URL to redirect to after successful login",control:"text",table:{defaultValue:{summary:"/dashboard"}}},showPasswordReset:{description:'Show "Forgot password?" link',control:"boolean",table:{defaultValue:{summary:"true"}}},showRegisterLink:{description:'Show "Create account" link',control:"boolean",table:{defaultValue:{summary:"true"}}},className:{description:"Custom className for styling",control:"text"}},args:{onSuccess:v(),onError:v()},decorators:[r=>e.jsx("div",{className:"w-full max-w-md p-4",children:e.jsx(r,{})})]},o={args:{redirectUrl:"/dashboard",showPasswordReset:!0,showRegisterLink:!0}},a={args:{redirectUrl:"/dashboard",showPasswordReset:!1,showRegisterLink:!0},parameters:{docs:{description:{story:"Login form with password reset link hidden."}}}},t={args:{redirectUrl:"/dashboard",showPasswordReset:!0,showRegisterLink:!1},parameters:{docs:{description:{story:"Login form with register link hidden."}}}},i={args:{redirectUrl:"/dashboard",showPasswordReset:!1,showRegisterLink:!1},parameters:{docs:{description:{story:"Minimal login form with only email, password, and submit button."}}}},n={args:{redirectUrl:"/admin/dashboard",showPasswordReset:!0,showRegisterLink:!0},parameters:{docs:{description:{story:"Login form redirecting to a custom URL after successful authentication."}}}},d={args:{redirectUrl:"/dashboard",showPasswordReset:!0,showRegisterLink:!0,className:"shadow-2xl border-2 border-[var(--primary)]"},parameters:{docs:{description:{story:"Login form with custom className applied for enhanced border and shadow."}}}},c={args:{redirectUrl:"/dashboard",showPasswordReset:!0,showRegisterLink:!0,onError:r=>{console.error("Login error:",r),alert(`Login failed: ${r.message}`)}},parameters:{docs:{description:{story:"Demonstrates error handling callback. Try submitting with valid credentials to see the error handler in action."}}}},l={args:{redirectUrl:"/dashboard",showPasswordReset:!0,showRegisterLink:!0,onSuccess:r=>{console.log("Login successful:",r),alert(`Welcome! Logged in as ${r.email}`)}},parameters:{docs:{description:{story:"Demonstrates success handling callback. Submit the form to see the success handler in action (simulates 1s API call)."}}}},m={args:{redirectUrl:"/dashboard",showPasswordReset:!0,showRegisterLink:!0},decorators:[r=>e.jsx("div",{className:"min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center",children:e.jsx(r,{})})],parameters:{layout:"fullscreen",docs:{description:{story:"Login form displayed on cosmic dark background showcasing glass morphism effect."}}}},u={args:{redirectUrl:"/dashboard",showPasswordReset:!0,showRegisterLink:!0},decorators:[r=>e.jsx("div",{className:"w-full max-w-[320px] p-4",children:e.jsx(r,{})})],parameters:{viewport:{defaultViewport:"mobile1"},docs:{description:{story:"Login form optimized for mobile viewports with responsive layout."}}}},p={args:{redirectUrl:"/dashboard",showPasswordReset:!0,showRegisterLink:!0},decorators:[r=>e.jsx("div",{className:"w-full max-w-2xl p-4",children:e.jsx(r,{})})],parameters:{docs:{description:{story:"Login form in a wider container. The form maintains its max-width constraint."}}}},h={args:{redirectUrl:"/dashboard",showPasswordReset:!0,showRegisterLink:!0},parameters:{docs:{description:{story:"Interactive playground to test all props and behaviors. Use the controls panel to modify props dynamically."}}}},g={render:()=>e.jsxs("div",{className:"space-y-6 w-full max-w-2xl",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-2 text-[var(--foreground)]",children:"Validation Rules"}),e.jsxs("ul",{className:"list-disc list-inside space-y-1 text-sm text-[var(--muted-foreground)]",children:[e.jsx("li",{children:"Email: Must be a valid email address"}),e.jsx("li",{children:"Password: Minimum 8 characters"})]})]}),e.jsx(s,{redirectUrl:"/dashboard",showPasswordReset:!0,showRegisterLink:!0,onSuccess:r=>console.log("Success:",r),onError:r=>console.error("Error:",r)}),e.jsxs("div",{className:"text-xs text-[var(--muted-foreground)] space-y-1",children:[e.jsx("p",{children:e.jsx("strong",{children:"Try these test cases:"})}),e.jsxs("ul",{className:"list-disc list-inside space-y-1 ml-4",children:[e.jsx("li",{children:'Invalid email: "test" (shows "Invalid email address")'}),e.jsx("li",{children:'Short password: "pass" (shows "Password must be at least 8 characters")'}),e.jsx("li",{children:'Valid credentials: "test@example.com" + "password123"'})]})]})]}),parameters:{layout:"centered",docs:{description:{story:"Demonstrates form validation with Zod schema. Try submitting with invalid data to see error messages."}}}},f={render:()=>e.jsx("div",{className:"min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center",children:e.jsxs("div",{className:"w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center",children:[e.jsxs("div",{className:"space-y-6 text-[var(--foreground)]",children:[e.jsx("h1",{className:"text-4xl font-light",children:"Willkommen zurück"}),e.jsx("p",{className:"text-lg text-[var(--muted-foreground)]",children:"Melde dich an, um auf dein Dashboard zuzugreifen und deine spirituelle Reise fortzusetzen."}),e.jsxs("ul",{className:"space-y-3 text-sm",children:[e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"text-[var(--primary)] mt-1",children:"✓"}),e.jsx("span",{children:"Zugriff auf alle deine Kurse und Materialien"})]}),e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"text-[var(--primary)] mt-1",children:"✓"}),e.jsx("span",{children:"Fortschritt synchronisiert auf allen Geräten"})]}),e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"text-[var(--primary)] mt-1",children:"✓"}),e.jsx("span",{children:"Personalisierte Empfehlungen und Insights"})]})]})]}),e.jsx("div",{children:e.jsx(s,{redirectUrl:"/dashboard",showPasswordReset:!0,showRegisterLink:!0,onSuccess:r=>console.log("Login successful:",r),onError:r=>console.error("Login failed:",r)})})]})}),parameters:{layout:"fullscreen",docs:{description:{story:"Complete authentication page layout with marketing copy and login form, showcasing real-world usage."}}}},w={render:()=>e.jsxs("div",{className:"space-y-8 p-6 max-w-7xl",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"Default State"}),e.jsx("div",{className:"max-w-md",children:e.jsx(s,{redirectUrl:"/dashboard",showPasswordReset:!0,showRegisterLink:!0})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"Minimal (No Extra Links)"}),e.jsx("div",{className:"max-w-md",children:e.jsx(s,{redirectUrl:"/dashboard",showPasswordReset:!1,showRegisterLink:!1})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"With Custom Styling (Enhanced Border)"}),e.jsx("div",{className:"max-w-md",children:e.jsx(s,{redirectUrl:"/dashboard",showPasswordReset:!0,showRegisterLink:!0,className:"border-2 border-[var(--primary)] shadow-2xl"})})]})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Side-by-side comparison of different form configurations and states."}}}},b={render:()=>e.jsxs("div",{className:"space-y-6 p-6 max-w-4xl",children:[e.jsx("div",{children:e.jsx("h2",{className:"text-2xl font-semibold mb-4 text-[var(--foreground)]",children:"LoginForm Behavior"})}),e.jsxs("div",{className:"space-y-4 text-sm",children:[e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Password Visibility Toggle"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:"Click the eye icon to toggle password visibility. The icon changes from Eye to EyeOff when password is visible."})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Loading State"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:'During authentication (simulated 1s delay), the submit button shows "Wird angemeldet..." and is disabled to prevent duplicate submissions.'})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Error Handling"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:"Validation errors appear inline below each field. Server errors appear in a destructive Alert component above the submit button."})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Redirect Behavior"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:"After successful authentication, if redirectUrl is provided, the form automatically redirects using window.location.href. If onSuccess callback is provided, it's called before redirect."})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Accessibility"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:"All form fields have proper labels with htmlFor attributes. Password toggle button has aria-label. Error messages are associated with fields using ARIA attributes."})]})]}),e.jsxs("div",{className:"mt-8",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"Try it yourself:"}),e.jsx(s,{redirectUrl:"/dashboard",showPasswordReset:!0,showRegisterLink:!0,onSuccess:r=>alert(`Success! Email: ${r.email}`),onError:r=>alert(`Error: ${r.message}`)})]})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Comprehensive documentation of form behavior, states, and user interactions."}}}};var x,y,N,L,R;o.parameters={...o.parameters,docs:{...(x=o.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    redirectUrl: '/dashboard',
    showPasswordReset: true,
    showRegisterLink: true
  }
}`,...(N=(y=o.parameters)==null?void 0:y.docs)==null?void 0:N.source},description:{story:"Default login form with all features enabled",...(R=(L=o.parameters)==null?void 0:L.docs)==null?void 0:R.description}}};var j,k,S,P,U;a.parameters={...a.parameters,docs:{...(j=a.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    redirectUrl: '/dashboard',
    showPasswordReset: false,
    showRegisterLink: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Login form with password reset link hidden.'
      }
    }
  }
}`,...(S=(k=a.parameters)==null?void 0:k.docs)==null?void 0:S.source},description:{story:"Login form without password reset link",...(U=(P=a.parameters)==null?void 0:P.docs)==null?void 0:U.description}}};var E,A,F,C,D;t.parameters={...t.parameters,docs:{...(E=t.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    redirectUrl: '/dashboard',
    showPasswordReset: true,
    showRegisterLink: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Login form with register link hidden.'
      }
    }
  }
}`,...(F=(A=t.parameters)==null?void 0:A.docs)==null?void 0:F.source},description:{story:"Login form without register link",...(D=(C=t.parameters)==null?void 0:C.docs)==null?void 0:D.description}}};var T,V,M,I,W;i.parameters={...i.parameters,docs:{...(T=i.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    redirectUrl: '/dashboard',
    showPasswordReset: false,
    showRegisterLink: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal login form with only email, password, and submit button.'
      }
    }
  }
}`,...(M=(V=i.parameters)==null?void 0:V.docs)==null?void 0:M.source},description:{story:"Minimal login form (no extra links)",...(W=(I=i.parameters)==null?void 0:I.docs)==null?void 0:W.description}}};var z,B,$,H,O;n.parameters={...n.parameters,docs:{...(z=n.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    redirectUrl: '/admin/dashboard',
    showPasswordReset: true,
    showRegisterLink: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Login form redirecting to a custom URL after successful authentication.'
      }
    }
  }
}`,...($=(B=n.parameters)==null?void 0:B.docs)==null?void 0:$.source},description:{story:"Login form with custom redirect URL",...(O=(H=n.parameters)==null?void 0:H.docs)==null?void 0:O.description}}};var Z,G,K,_,q;d.parameters={...d.parameters,docs:{...(Z=d.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    redirectUrl: '/dashboard',
    showPasswordReset: true,
    showRegisterLink: true,
    className: 'shadow-2xl border-2 border-[var(--primary)]'
  },
  parameters: {
    docs: {
      description: {
        story: 'Login form with custom className applied for enhanced border and shadow.'
      }
    }
  }
}`,...(K=(G=d.parameters)==null?void 0:G.docs)==null?void 0:K.source},description:{story:"Login form with custom styling",...(q=(_=d.parameters)==null?void 0:_.docs)==null?void 0:q.description}}};var J,Q,X,Y,ee;c.parameters={...c.parameters,docs:{...(J=c.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    redirectUrl: '/dashboard',
    showPasswordReset: true,
    showRegisterLink: true,
    onError: (error: Error) => {
      console.error('Login error:', error);
      alert(\`Login failed: \${error.message}\`);
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates error handling callback. Try submitting with valid credentials to see the error handler in action.'
      }
    }
  }
}`,...(X=(Q=c.parameters)==null?void 0:Q.docs)==null?void 0:X.source},description:{story:"Login form with error handling demo",...(ee=(Y=c.parameters)==null?void 0:Y.docs)==null?void 0:ee.description}}};var re,se,oe,ae,te;l.parameters={...l.parameters,docs:{...(re=l.parameters)==null?void 0:re.docs,source:{originalSource:`{
  args: {
    redirectUrl: '/dashboard',
    showPasswordReset: true,
    showRegisterLink: true,
    onSuccess: (user: any) => {
      console.log('Login successful:', user);
      alert(\`Welcome! Logged in as \${user.email}\`);
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates success handling callback. Submit the form to see the success handler in action (simulates 1s API call).'
      }
    }
  }
}`,...(oe=(se=l.parameters)==null?void 0:se.docs)==null?void 0:oe.source},description:{story:"Login form with success handling demo",...(te=(ae=l.parameters)==null?void 0:ae.docs)==null?void 0:te.description}}};var ie,ne,de,ce,le;m.parameters={...m.parameters,docs:{...(ie=m.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  args: {
    redirectUrl: '/dashboard',
    showPasswordReset: true,
    showRegisterLink: true
  },
  decorators: [Story => <div className="min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center">
        <Story />
      </div>],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Login form displayed on cosmic dark background showcasing glass morphism effect.'
      }
    }
  }
}`,...(de=(ne=m.parameters)==null?void 0:ne.docs)==null?void 0:de.source},description:{story:"Login form on cosmic dark background",...(le=(ce=m.parameters)==null?void 0:ce.docs)==null?void 0:le.description}}};var me,ue,pe,he,ge;u.parameters={...u.parameters,docs:{...(me=u.parameters)==null?void 0:me.docs,source:{originalSource:`{
  args: {
    redirectUrl: '/dashboard',
    showPasswordReset: true,
    showRegisterLink: true
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
        story: 'Login form optimized for mobile viewports with responsive layout.'
      }
    }
  }
}`,...(pe=(ue=u.parameters)==null?void 0:ue.docs)==null?void 0:pe.source},description:{story:"Login form in narrow mobile container",...(ge=(he=u.parameters)==null?void 0:he.docs)==null?void 0:ge.description}}};var fe,we,be,ve,xe;p.parameters={...p.parameters,docs:{...(fe=p.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  args: {
    redirectUrl: '/dashboard',
    showPasswordReset: true,
    showRegisterLink: true
  },
  decorators: [Story => <div className="w-full max-w-2xl p-4">
        <Story />
      </div>],
  parameters: {
    docs: {
      description: {
        story: 'Login form in a wider container. The form maintains its max-width constraint.'
      }
    }
  }
}`,...(be=(we=p.parameters)==null?void 0:we.docs)==null?void 0:be.source},description:{story:"Login form with wide container",...(xe=(ve=p.parameters)==null?void 0:ve.docs)==null?void 0:xe.description}}};var ye,Ne,Le,Re,je;h.parameters={...h.parameters,docs:{...(ye=h.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  args: {
    redirectUrl: '/dashboard',
    showPasswordReset: true,
    showRegisterLink: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all props and behaviors. Use the controls panel to modify props dynamically.'
      }
    }
  }
}`,...(Le=(Ne=h.parameters)==null?void 0:Ne.docs)==null?void 0:Le.source},description:{story:"Interactive playground with all controls",...(je=(Re=h.parameters)==null?void 0:Re.docs)==null?void 0:je.description}}};var ke,Se,Pe,Ue,Ee;g.parameters={...g.parameters,docs:{...(ke=g.parameters)==null?void 0:ke.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 w-full max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-[var(--foreground)]">Validation Rules</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-[var(--muted-foreground)]">
          <li>Email: Must be a valid email address</li>
          <li>Password: Minimum 8 characters</li>
        </ul>
      </div>
      <LoginForm redirectUrl="/dashboard" showPasswordReset showRegisterLink onSuccess={user => console.log('Success:', user)} onError={error => console.error('Error:', error)} />
      <div className="text-xs text-[var(--muted-foreground)] space-y-1">
        <p>
          <strong>Try these test cases:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Invalid email: "test" (shows "Invalid email address")</li>
          <li>Short password: "pass" (shows "Password must be at least 8 characters")</li>
          <li>Valid credentials: "test@example.com" + "password123"</li>
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
}`,...(Pe=(Se=g.parameters)==null?void 0:Se.docs)==null?void 0:Pe.source},description:{story:"Validation demo - shows inline validation errors",...(Ee=(Ue=g.parameters)==null?void 0:Ue.docs)==null?void 0:Ee.description}}};var Ae,Fe,Ce,De,Te;f.parameters={...f.parameters,docs:{...(Ae=f.parameters)==null?void 0:Ae.docs,source:{originalSource:`{
  render: () => <div className="min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 text-[var(--foreground)]">
          <h1 className="text-4xl font-light">Willkommen zurück</h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            Melde dich an, um auf dein Dashboard zuzugreifen und deine spirituelle Reise fortzusetzen.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-1">✓</span>
              <span>Zugriff auf alle deine Kurse und Materialien</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-1">✓</span>
              <span>Fortschritt synchronisiert auf allen Geräten</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-1">✓</span>
              <span>Personalisierte Empfehlungen und Insights</span>
            </li>
          </ul>
        </div>
        <div>
          <LoginForm redirectUrl="/dashboard" showPasswordReset showRegisterLink onSuccess={user => console.log('Login successful:', user)} onError={error => console.error('Login failed:', error)} />
        </div>
      </div>
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Complete authentication page layout with marketing copy and login form, showcasing real-world usage.'
      }
    }
  }
}`,...(Ce=(Fe=f.parameters)==null?void 0:Fe.docs)==null?void 0:Ce.source},description:{story:"Complete authentication flow showcase",...(Te=(De=f.parameters)==null?void 0:De.docs)==null?void 0:Te.description}}};var Ve,Me,Ie,We,ze;w.parameters={...w.parameters,docs:{...(Ve=w.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
  render: () => <div className="space-y-8 p-6 max-w-7xl">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Default State</h3>
        <div className="max-w-md">
          <LoginForm redirectUrl="/dashboard" showPasswordReset showRegisterLink />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Minimal (No Extra Links)</h3>
        <div className="max-w-md">
          <LoginForm redirectUrl="/dashboard" showPasswordReset={false} showRegisterLink={false} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
          With Custom Styling (Enhanced Border)
        </h3>
        <div className="max-w-md">
          <LoginForm redirectUrl="/dashboard" showPasswordReset showRegisterLink className="border-2 border-[var(--primary)] shadow-2xl" />
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
}`,...(Ie=(Me=w.parameters)==null?void 0:Me.docs)==null?void 0:Ie.source},description:{story:"All form states comparison",...(ze=(We=w.parameters)==null?void 0:We.docs)==null?void 0:ze.description}}};var Be,$e,He,Oe,Ze;b.parameters={...b.parameters,docs:{...(Be=b.parameters)==null?void 0:Be.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 p-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">LoginForm Behavior</h2>
      </div>

      <div className="space-y-4 text-sm">
        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Password Visibility Toggle</h3>
          <p className="text-[var(--muted-foreground)]">
            Click the eye icon to toggle password visibility. The icon changes from Eye to EyeOff when password
            is visible.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Loading State</h3>
          <p className="text-[var(--muted-foreground)]">
            During authentication (simulated 1s delay), the submit button shows "Wird angemeldet..." and is
            disabled to prevent duplicate submissions.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Error Handling</h3>
          <p className="text-[var(--muted-foreground)]">
            Validation errors appear inline below each field. Server errors appear in a destructive Alert
            component above the submit button.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Redirect Behavior</h3>
          <p className="text-[var(--muted-foreground)]">
            After successful authentication, if redirectUrl is provided, the form automatically redirects using
            window.location.href. If onSuccess callback is provided, it's called before redirect.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Accessibility</h3>
          <p className="text-[var(--muted-foreground)]">
            All form fields have proper labels with htmlFor attributes. Password toggle button has aria-label.
            Error messages are associated with fields using ARIA attributes.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Try it yourself:</h3>
        <LoginForm redirectUrl="/dashboard" showPasswordReset showRegisterLink onSuccess={user => alert(\`Success! Email: \${user.email}\`)} onError={error => alert(\`Error: \${error.message}\`)} />
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
}`,...(He=($e=b.parameters)==null?void 0:$e.docs)==null?void 0:He.source},description:{story:"Form behavior documentation",...(Ze=(Oe=b.parameters)==null?void 0:Oe.docs)==null?void 0:Ze.description}}};const br=["Default","NoPasswordReset","NoRegisterLink","MinimalForm","CustomRedirect","CustomStyling","WithErrorHandling","WithSuccessHandling","CosmicTheme","MobileView","WideContainer","Playground","ValidationDemo","AuthenticationFlow","AllStates","BehaviorDocumentation"];export{w as AllStates,f as AuthenticationFlow,b as BehaviorDocumentation,m as CosmicTheme,n as CustomRedirect,d as CustomStyling,o as Default,i as MinimalForm,u as MobileView,a as NoPasswordReset,t as NoRegisterLink,h as Playground,g as ValidationDemo,p as WideContainer,c as WithErrorHandling,l as WithSuccessHandling,br as __namedExportsOrder,wr as default};
