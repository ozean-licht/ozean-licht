import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{r as S}from"./index-B2-qRKKC.js";import{u as us}from"./index.esm-SGBzMz4R.js";import{a as ps,o as hs,s as N}from"./schemas-C3QG-Qu7.js";import{C as gs,a as fs,b as xs,d as bs}from"./Card-B3jXYF8b.js";import{B as vs}from"./Button-Clfx5zjS.js";import{L as w,I as C,T as ys}from"./Input-B8-YZaEC.js";import{A as W,a as V}from"./alert-JMCFSqIB.js";import{c as Ns}from"./cn-CytzSlOG.js";import{f as L}from"./index-CJu6nLMj.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-DVF2XGCm.js";import"./card-DrBDOuQX.js";import"./button-C8qtCU0L.js";import"./index-BiMR7eR1.js";import"./index-BFjtS4uE.js";import"./input-Db9iZ-Hs.js";import"./textarea-Cd1j4ONA.js";import"./label-Cp9r14oL.js";import"./index-B5oyz0SX.js";import"./index-kS-9iBlu.js";const ws=hs({name:N().min(2,"Name must be at least 2 characters"),email:N().email("Invalid email address"),subject:N().optional(),message:N().min(10,"Message must be at least 10 characters")});function r({onSuccess:s,onError:j,className:os}){var M,D,I,$;const[F,A]=S.useState(""),[ns,k]=S.useState(!1),[T,E]=S.useState(!1),{register:v,handleSubmit:is,reset:ds,formState:{errors:y}}=us({resolver:ps(ws)}),cs=async ls=>{A(""),E(!0);try{await new Promise(a=>setTimeout(a,1e3)),k(!0),s==null||s(ls),ds(),setTimeout(()=>k(!1),5e3)}catch(a){const ms=a instanceof Error?a.message:"An error occurred";A(ms),j==null||j(a)}finally{E(!1)}};return e.jsxs(gs,{variant:"default",className:Ns("w-full max-w-2xl shadow-lg",os),children:[e.jsx(fs,{className:"space-y-4 text-center",children:e.jsx(xs,{className:"text-2xl font-light",children:"Kontaktiere Uns"})}),e.jsx(bs,{className:"space-y-6",children:e.jsxs("form",{onSubmit:is(cs),className:"space-y-4",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(w,{htmlFor:"name",children:"Name"}),e.jsx(C,{id:"name",placeholder:"Dein Name",...v("name"),error:(M=y.name)==null?void 0:M.message})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(w,{htmlFor:"email",children:"Email"}),e.jsx(C,{id:"email",type:"email",placeholder:"deine@mail.com",...v("email"),error:(D=y.email)==null?void 0:D.message})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(w,{htmlFor:"subject",children:"Betreff (Optional)"}),e.jsx(C,{id:"subject",placeholder:"Worum geht es?",...v("subject"),error:(I=y.subject)==null?void 0:I.message})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(w,{htmlFor:"message",children:"Nachricht"}),e.jsx(ys,{id:"message",placeholder:"Deine Nachricht...",rows:6,...v("message"),error:($=y.message)==null?void 0:$.message})]}),F&&e.jsx(W,{variant:"destructive",children:e.jsx(V,{children:F})}),ns&&e.jsx(W,{className:"border-green-500 bg-green-500/10",children:e.jsx(V,{className:"text-green-400",children:"Vielen Dank! Deine Nachricht wurde erfolgreich gesendet."})}),e.jsx(vs,{type:"submit",variant:"primary",fullWidth:!0,disabled:T,className:"text-lg py-3",children:T?"Wird gesendet...":"Nachricht Senden"})]})})]})}r.displayName="ContactForm";try{r.displayName="ContactForm",r.__docgenInfo={description:"",displayName:"ContactForm",props:{onSuccess:{defaultValue:null,description:"",name:"onSuccess",required:!1,type:{name:"((data: ContactFormData) => void)"}},onError:{defaultValue:null,description:"",name:"onError",required:!1,type:{name:"((error: Error) => void)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const Ps={title:"Tier 3: Compositions/Forms/ContactForm",component:r,parameters:{layout:"centered",docs:{description:{component:"Complete contact form composition with validation, error handling, and success feedback. Features Ozean Licht branding with glass morphism card design and turquoise accents."}}},tags:["autodocs"],argTypes:{onSuccess:{description:"Callback function called when message is sent successfully",control:!1,action:"contact-success"},onError:{description:"Callback function called when submission fails",control:!1,action:"contact-error"},className:{description:"Custom className for styling",control:"text"}},args:{onSuccess:L(),onError:L()},decorators:[s=>e.jsx("div",{className:"w-full max-w-2xl p-4",children:e.jsx(s,{})})]},t={args:{}},o={args:{className:"shadow-2xl border-2 border-[var(--primary)]"},parameters:{docs:{description:{story:"Contact form with custom className applied for enhanced border and shadow."}}}},n={args:{onSuccess:s=>{console.log("Message sent:",s),alert(`Thank you ${s.name}! Your message has been sent.

Email: ${s.email}
Subject: ${s.subject||"No subject"}
Message: ${s.message}`)}},parameters:{docs:{description:{story:"Demonstrates success handling callback. Fill out and submit the form to see the success handler in action (simulates 1s API call)."}}}},i={args:{onError:s=>{console.error("Send error:",s),alert(`Failed to send message: ${s.message}`)}},parameters:{docs:{description:{story:"Demonstrates error handling callback. The form will show internal error state plus call the onError callback."}}}},d={args:{},decorators:[s=>e.jsx("div",{className:"min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center",children:e.jsx(s,{})})],parameters:{layout:"fullscreen",docs:{description:{story:"Contact form displayed on cosmic dark background showcasing glass morphism effect."}}}},c={args:{},decorators:[s=>e.jsx("div",{className:"w-full max-w-[320px] p-4",children:e.jsx(s,{})})],parameters:{viewport:{defaultViewport:"mobile1"},docs:{description:{story:"Contact form optimized for mobile viewports. The grid layout automatically switches to single column on small screens."}}}},l={args:{},decorators:[s=>e.jsx("div",{className:"w-full max-w-4xl p-4",children:e.jsx(s,{})})],parameters:{docs:{description:{story:"Contact form in a wider container. The form maintains its max-width constraint (max-w-2xl)."}}}},m={args:{},parameters:{docs:{description:{story:"Interactive playground to test all props and behaviors. Use the controls panel to modify props dynamically."}}}},u={render:()=>e.jsxs("div",{className:"space-y-6 w-full max-w-2xl",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-2 text-[var(--foreground)]",children:"Validation Rules"}),e.jsxs("ul",{className:"list-disc list-inside space-y-1 text-sm text-[var(--muted-foreground)]",children:[e.jsx("li",{children:"Name: Minimum 2 characters"}),e.jsx("li",{children:"Email: Must be a valid email address"}),e.jsx("li",{children:"Subject: Optional field (no validation)"}),e.jsx("li",{children:"Message: Minimum 10 characters"})]})]}),e.jsx(r,{onSuccess:s=>console.log("Success:",s),onError:s=>console.error("Error:",s)}),e.jsxs("div",{className:"text-xs text-[var(--muted-foreground)] space-y-1",children:[e.jsx("p",{children:e.jsx("strong",{children:"Try these test cases:"})}),e.jsxs("ul",{className:"list-disc list-inside space-y-1 ml-4",children:[e.jsx("li",{children:'Short name: "A" (shows "Name must be at least 2 characters")'}),e.jsx("li",{children:'Invalid email: "test" (shows "Invalid email address")'}),e.jsx("li",{children:'Short message: "Hello" (shows "Message must be at least 10 characters")'}),e.jsx("li",{children:'Valid data: Name "John Doe", Email "john@example.com", Message "This is a test message with more than 10 characters."'})]})]})]}),parameters:{layout:"centered",docs:{description:{story:"Demonstrates form validation with Zod schema. Try submitting with invalid data to see error messages appear below each field."}}}},p={render:()=>e.jsx("div",{className:"min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center",children:e.jsxs("div",{className:"w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center",children:[e.jsxs("div",{className:"space-y-6 text-[var(--foreground)]",children:[e.jsx("h1",{className:"text-4xl font-light",children:"Kontaktiere Uns"}),e.jsx("p",{className:"text-lg text-[var(--muted-foreground)]",children:"Hast du Fragen zu unseren Kursen oder Angeboten? Wir sind hier, um dir zu helfen."}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:"w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0 mt-1",children:e.jsx("span",{className:"text-[var(--primary)] text-xl",children:"📧"})}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-semibold mb-1",children:"Email Support"}),e.jsx("p",{className:"text-sm text-[var(--muted-foreground)]",children:"Wir antworten normalerweise innerhalb von 24 Stunden"})]})]}),e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:"w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0 mt-1",children:e.jsx("span",{className:"text-[var(--primary)] text-xl",children:"💬"})}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-semibold mb-1",children:"Community Support"}),e.jsx("p",{className:"text-sm text-[var(--muted-foreground)]",children:"Tritt unserer Community bei für schnellere Antworten"})]})]}),e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:"w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0 mt-1",children:e.jsx("span",{className:"text-[var(--primary)] text-xl",children:"📞"})}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-semibold mb-1",children:"Telefon Support"}),e.jsx("p",{className:"text-sm text-[var(--muted-foreground)]",children:"Mo-Fr: 9:00 - 17:00 Uhr"})]})]})]})]}),e.jsx("div",{children:e.jsx(r,{onSuccess:s=>console.log("Message sent:",s),onError:s=>console.error("Send failed:",s)})})]})}),parameters:{layout:"fullscreen",docs:{description:{story:"Complete contact page layout with information sidebar and contact form, showcasing real-world usage."}}}},h={render:()=>e.jsxs("div",{className:"space-y-8 p-6 max-w-7xl",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"Default State"}),e.jsx("div",{className:"max-w-2xl",children:e.jsx(r,{})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"With Custom Styling (Enhanced Border)"}),e.jsx("div",{className:"max-w-2xl",children:e.jsx(r,{className:"border-2 border-[var(--primary)] shadow-2xl"})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"In Narrow Container (Mobile-like)"}),e.jsx("div",{className:"max-w-sm",children:e.jsx(r,{})})]})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Side-by-side comparison of different form configurations and container widths."}}}},g={render:()=>e.jsxs("div",{className:"space-y-6 p-6 max-w-4xl",children:[e.jsx("div",{children:e.jsx("h2",{className:"text-2xl font-semibold mb-4 text-[var(--foreground)]",children:"ContactForm Behavior"})}),e.jsxs("div",{className:"space-y-4 text-sm",children:[e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Responsive Layout"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:"The form uses a responsive grid layout. Name and Email fields are side-by-side on desktop (md:grid-cols-2) and stack vertically on mobile. Subject and Message fields always span full width."})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Loading State"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:'During submission (simulated 1s delay), the submit button shows "Wird gesendet..." and is disabled to prevent duplicate submissions.'})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Success State"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:'On successful submission, a green success Alert appears with the message "Vielen Dank! Deine Nachricht wurde erfolgreich gesendet." The form is automatically reset and the success message disappears after 5 seconds.'})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Error Handling"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:"Validation errors appear inline below each field with red styling. Server errors appear in a destructive Alert component above the submit button. Both onSuccess and onError callbacks are called with appropriate data."})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Form Reset"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:"After successful submission, the form is automatically reset using React Hook Form's reset() function, clearing all field values and validation states."})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Accessibility"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:"All form fields have proper labels with htmlFor attributes. The Textarea has configurable rows (default: 6). Error messages are associated with fields using ARIA attributes from the Input and Textarea components."})]}),e.jsxs("div",{className:"p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]",children:[e.jsx("h3",{className:"font-semibold mb-2 text-[var(--foreground)]",children:"Glass Morphism Design"}),e.jsx("p",{className:"text-[var(--muted-foreground)]",children:'The form uses a Card component with default variant, featuring glass morphism effect with subtle backdrop blur. The card has shadow-lg for depth and max-w-2xl constraint. The title "Kontaktiere Uns" uses text-2xl font-light for elegant typography.'})]})]}),e.jsxs("div",{className:"mt-8",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"Try it yourself:"}),e.jsx(r,{onSuccess:s=>alert(`Success! Message from ${s.name} (${s.email})`),onError:s=>alert(`Error: ${s.message}`)})]})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Comprehensive documentation of form behavior, states, and user interactions."}}}},f={render:()=>e.jsxs("div",{className:"space-y-6 w-full max-w-2xl",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-2 text-[var(--foreground)]",children:"Loading State Demo"}),e.jsx("p",{className:"text-sm text-[var(--muted-foreground)] mb-4",children:'Submit the form below to see the loading state in action. The button text changes to "Wird gesendet..." and becomes disabled during the simulated 1-second API call.'})]}),e.jsx(r,{onSuccess:s=>console.log("Message sent:",s),onError:s=>console.error("Send failed:",s)})]}),parameters:{layout:"centered",docs:{description:{story:'Demonstrates the loading state during form submission. Fill out and submit the form to see the button change to "Wird gesendet..." state.'}}}},x={render:()=>e.jsxs("div",{className:"space-y-6 w-full max-w-2xl",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-2 text-[var(--foreground)]",children:"Success Feedback Demo"}),e.jsx("p",{className:"text-sm text-[var(--muted-foreground)] mb-4",children:"Submit the form below to see the success feedback. A green Alert appears with a success message, the form resets automatically, and the success message disappears after 5 seconds."})]}),e.jsx(r,{onSuccess:s=>console.log("Message sent:",s),onError:s=>console.error("Send failed:",s)})]}),parameters:{layout:"centered",docs:{description:{story:"Demonstrates the success feedback flow. Submit the form to see the green success Alert, automatic form reset, and auto-dismissal after 5 seconds."}}}},b={render:()=>e.jsxs("div",{className:"space-y-6 w-full max-w-2xl",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-2 text-[var(--foreground)]",children:"Subject Field (Optional)"}),e.jsx("p",{className:"text-sm text-[var(--muted-foreground)] mb-4",children:"The subject field is optional and can be used to categorize messages. It appears between the name/email row and the message textarea. Try submitting with and without a subject to see how both cases are handled."})]}),e.jsx(r,{onSuccess:s=>{console.log("Message sent:",s),alert(`Message received!

From: ${s.name}
Email: ${s.email}
Subject: ${s.subject||"(No subject)"}

Message:
${s.message}`)},onError:s=>console.error("Send failed:",s)})]}),parameters:{layout:"centered",docs:{description:{story:"Showcases the optional subject field. Submit the form with and without a subject to see how ContactFormData includes or omits the subject field."}}}};var H,B,R,_,z;t.parameters={...t.parameters,docs:{...(H=t.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {}
}`,...(R=(B=t.parameters)==null?void 0:B.docs)==null?void 0:R.source},description:{story:"Default contact form with all features enabled",...(z=(_=t.parameters)==null?void 0:_.docs)==null?void 0:z.description}}};var O,P,U,K,q;o.parameters={...o.parameters,docs:{...(O=o.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    className: 'shadow-2xl border-2 border-[var(--primary)]'
  },
  parameters: {
    docs: {
      description: {
        story: 'Contact form with custom className applied for enhanced border and shadow.'
      }
    }
  }
}`,...(U=(P=o.parameters)==null?void 0:P.docs)==null?void 0:U.source},description:{story:"Contact form with custom styling",...(q=(K=o.parameters)==null?void 0:K.docs)==null?void 0:q.description}}};var G,J,Y,Z,Q;n.parameters={...n.parameters,docs:{...(G=n.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    onSuccess: data => {
      console.log('Message sent:', data);
      alert(\`Thank you \${data.name}! Your message has been sent.\\n\\nEmail: \${data.email}\\nSubject: \${data.subject || 'No subject'}\\nMessage: \${data.message}\`);
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates success handling callback. Fill out and submit the form to see the success handler in action (simulates 1s API call).'
      }
    }
  }
}`,...(Y=(J=n.parameters)==null?void 0:J.docs)==null?void 0:Y.source},description:{story:"Contact form with success handling demo",...(Q=(Z=n.parameters)==null?void 0:Z.docs)==null?void 0:Q.description}}};var X,ee,se,re,ae;i.parameters={...i.parameters,docs:{...(X=i.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    onError: (error: Error) => {
      console.error('Send error:', error);
      alert(\`Failed to send message: \${error.message}\`);
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates error handling callback. The form will show internal error state plus call the onError callback.'
      }
    }
  }
}`,...(se=(ee=i.parameters)==null?void 0:ee.docs)==null?void 0:se.source},description:{story:"Contact form with error handling demo",...(ae=(re=i.parameters)==null?void 0:re.docs)==null?void 0:ae.description}}};var te,oe,ne,ie,de;d.parameters={...d.parameters,docs:{...(te=d.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {},
  decorators: [Story => <div className="min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center">
        <Story />
      </div>],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Contact form displayed on cosmic dark background showcasing glass morphism effect.'
      }
    }
  }
}`,...(ne=(oe=d.parameters)==null?void 0:oe.docs)==null?void 0:ne.source},description:{story:"Contact form on cosmic dark background",...(de=(ie=d.parameters)==null?void 0:ie.docs)==null?void 0:de.description}}};var ce,le,me,ue,pe;c.parameters={...c.parameters,docs:{...(ce=c.parameters)==null?void 0:ce.docs,source:{originalSource:`{
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
        story: 'Contact form optimized for mobile viewports. The grid layout automatically switches to single column on small screens.'
      }
    }
  }
}`,...(me=(le=c.parameters)==null?void 0:le.docs)==null?void 0:me.source},description:{story:"Contact form in narrow mobile container",...(pe=(ue=c.parameters)==null?void 0:ue.docs)==null?void 0:pe.description}}};var he,ge,fe,xe,be;l.parameters={...l.parameters,docs:{...(he=l.parameters)==null?void 0:he.docs,source:{originalSource:`{
  args: {},
  decorators: [Story => <div className="w-full max-w-4xl p-4">
        <Story />
      </div>],
  parameters: {
    docs: {
      description: {
        story: 'Contact form in a wider container. The form maintains its max-width constraint (max-w-2xl).'
      }
    }
  }
}`,...(fe=(ge=l.parameters)==null?void 0:ge.docs)==null?void 0:fe.source},description:{story:"Contact form with wide container",...(be=(xe=l.parameters)==null?void 0:xe.docs)==null?void 0:be.description}}};var ve,ye,Ne,we,je;m.parameters={...m.parameters,docs:{...(ve=m.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all props and behaviors. Use the controls panel to modify props dynamically.'
      }
    }
  }
}`,...(Ne=(ye=m.parameters)==null?void 0:ye.docs)==null?void 0:Ne.source},description:{story:"Interactive playground with all controls",...(je=(we=m.parameters)==null?void 0:we.docs)==null?void 0:je.description}}};var Se,Ce,Fe,Ae,ke;u.parameters={...u.parameters,docs:{...(Se=u.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 w-full max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-[var(--foreground)]">Validation Rules</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-[var(--muted-foreground)]">
          <li>Name: Minimum 2 characters</li>
          <li>Email: Must be a valid email address</li>
          <li>Subject: Optional field (no validation)</li>
          <li>Message: Minimum 10 characters</li>
        </ul>
      </div>
      <ContactForm onSuccess={data => console.log('Success:', data)} onError={error => console.error('Error:', error)} />
      <div className="text-xs text-[var(--muted-foreground)] space-y-1">
        <p>
          <strong>Try these test cases:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Short name: "A" (shows "Name must be at least 2 characters")</li>
          <li>Invalid email: "test" (shows "Invalid email address")</li>
          <li>Short message: "Hello" (shows "Message must be at least 10 characters")</li>
          <li>Valid data: Name "John Doe", Email "john@example.com", Message "This is a test message with more than 10 characters."</li>
        </ul>
      </div>
    </div>,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: 'Demonstrates form validation with Zod schema. Try submitting with invalid data to see error messages appear below each field.'
      }
    }
  }
}`,...(Fe=(Ce=u.parameters)==null?void 0:Ce.docs)==null?void 0:Fe.source},description:{story:"Validation demo - shows inline validation errors",...(ke=(Ae=u.parameters)==null?void 0:Ae.docs)==null?void 0:ke.description}}};var Te,Ee,Me,De,Ie;p.parameters={...p.parameters,docs:{...(Te=p.parameters)==null?void 0:Te.docs,source:{originalSource:`{
  render: () => <div className="min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 text-[var(--foreground)]">
          <h1 className="text-4xl font-light">Kontaktiere Uns</h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            Hast du Fragen zu unseren Kursen oder Angeboten? Wir sind hier, um dir zu helfen.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-[var(--primary)] text-xl">📧</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email Support</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Wir antworten normalerweise innerhalb von 24 Stunden
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-[var(--primary)] text-xl">💬</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Community Support</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Tritt unserer Community bei für schnellere Antworten
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-[var(--primary)] text-xl">📞</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Telefon Support</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Mo-Fr: 9:00 - 17:00 Uhr
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <ContactForm onSuccess={data => console.log('Message sent:', data)} onError={error => console.error('Send failed:', error)} />
        </div>
      </div>
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Complete contact page layout with information sidebar and contact form, showcasing real-world usage.'
      }
    }
  }
}`,...(Me=(Ee=p.parameters)==null?void 0:Ee.docs)==null?void 0:Me.source},description:{story:"Complete contact page showcase",...(Ie=(De=p.parameters)==null?void 0:De.docs)==null?void 0:Ie.description}}};var $e,We,Ve,Le,He;h.parameters={...h.parameters,docs:{...($e=h.parameters)==null?void 0:$e.docs,source:{originalSource:`{
  render: () => <div className="space-y-8 p-6 max-w-7xl">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Default State</h3>
        <div className="max-w-2xl">
          <ContactForm />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
          With Custom Styling (Enhanced Border)
        </h3>
        <div className="max-w-2xl">
          <ContactForm className="border-2 border-[var(--primary)] shadow-2xl" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
          In Narrow Container (Mobile-like)
        </h3>
        <div className="max-w-sm">
          <ContactForm />
        </div>
      </div>
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Side-by-side comparison of different form configurations and container widths.'
      }
    }
  }
}`,...(Ve=(We=h.parameters)==null?void 0:We.docs)==null?void 0:Ve.source},description:{story:"All form states comparison",...(He=(Le=h.parameters)==null?void 0:Le.docs)==null?void 0:He.description}}};var Be,Re,_e,ze,Oe;g.parameters={...g.parameters,docs:{...(Be=g.parameters)==null?void 0:Be.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 p-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">ContactForm Behavior</h2>
      </div>

      <div className="space-y-4 text-sm">
        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Responsive Layout</h3>
          <p className="text-[var(--muted-foreground)]">
            The form uses a responsive grid layout. Name and Email fields are side-by-side on desktop
            (md:grid-cols-2) and stack vertically on mobile. Subject and Message fields always span full width.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Loading State</h3>
          <p className="text-[var(--muted-foreground)]">
            During submission (simulated 1s delay), the submit button shows "Wird gesendet..." and is
            disabled to prevent duplicate submissions.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Success State</h3>
          <p className="text-[var(--muted-foreground)]">
            On successful submission, a green success Alert appears with the message "Vielen Dank! Deine Nachricht
            wurde erfolgreich gesendet." The form is automatically reset and the success message disappears after 5
            seconds.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Error Handling</h3>
          <p className="text-[var(--muted-foreground)]">
            Validation errors appear inline below each field with red styling. Server errors appear in a destructive
            Alert component above the submit button. Both onSuccess and onError callbacks are called with appropriate
            data.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Form Reset</h3>
          <p className="text-[var(--muted-foreground)]">
            After successful submission, the form is automatically reset using React Hook Form's reset() function,
            clearing all field values and validation states.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Accessibility</h3>
          <p className="text-[var(--muted-foreground)]">
            All form fields have proper labels with htmlFor attributes. The Textarea has configurable rows (default: 6).
            Error messages are associated with fields using ARIA attributes from the Input and Textarea components.
          </p>
        </div>

        <div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-[var(--foreground)]">Glass Morphism Design</h3>
          <p className="text-[var(--muted-foreground)]">
            The form uses a Card component with default variant, featuring glass morphism effect with subtle backdrop
            blur. The card has shadow-lg for depth and max-w-2xl constraint. The title "Kontaktiere Uns" uses text-2xl
            font-light for elegant typography.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Try it yourself:</h3>
        <ContactForm onSuccess={data => alert(\`Success! Message from \${data.name} (\${data.email})\`)} onError={error => alert(\`Error: \${error.message}\`)} />
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
}`,...(_e=(Re=g.parameters)==null?void 0:Re.docs)==null?void 0:_e.source},description:{story:"Form behavior documentation",...(Oe=(ze=g.parameters)==null?void 0:ze.docs)==null?void 0:Oe.description}}};var Pe,Ue,Ke,qe,Ge;f.parameters={...f.parameters,docs:{...(Pe=f.parameters)==null?void 0:Pe.docs,source:{originalSource:`{
  render: () => {
    // Note: This is a visual demo. In real usage, loading state is managed internally
    return <div className="space-y-6 w-full max-w-2xl">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-[var(--foreground)]">Loading State Demo</h3>
          <p className="text-sm text-[var(--muted-foreground)] mb-4">
            Submit the form below to see the loading state in action. The button text changes to "Wird gesendet..." and
            becomes disabled during the simulated 1-second API call.
          </p>
        </div>
        <ContactForm onSuccess={data => console.log('Message sent:', data)} onError={error => console.error('Send failed:', error)} />
      </div>;
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: 'Demonstrates the loading state during form submission. Fill out and submit the form to see the button change to "Wird gesendet..." state.'
      }
    }
  }
}`,...(Ke=(Ue=f.parameters)==null?void 0:Ue.docs)==null?void 0:Ke.source},description:{story:"Loading state demonstration",...(Ge=(qe=f.parameters)==null?void 0:qe.docs)==null?void 0:Ge.description}}};var Je,Ye,Ze,Qe,Xe;x.parameters={...x.parameters,docs:{...(Je=x.parameters)==null?void 0:Je.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 w-full max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-[var(--foreground)]">Success Feedback Demo</h3>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          Submit the form below to see the success feedback. A green Alert appears with a success message, the form
          resets automatically, and the success message disappears after 5 seconds.
        </p>
      </div>
      <ContactForm onSuccess={data => console.log('Message sent:', data)} onError={error => console.error('Send failed:', error)} />
    </div>,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: 'Demonstrates the success feedback flow. Submit the form to see the green success Alert, automatic form reset, and auto-dismissal after 5 seconds.'
      }
    }
  }
}`,...(Ze=(Ye=x.parameters)==null?void 0:Ye.docs)==null?void 0:Ze.source},description:{story:"Success feedback demonstration",...(Xe=(Qe=x.parameters)==null?void 0:Qe.docs)==null?void 0:Xe.description}}};var es,ss,rs,as,ts;b.parameters={...b.parameters,docs:{...(es=b.parameters)==null?void 0:es.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 w-full max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-[var(--foreground)]">Subject Field (Optional)</h3>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          The subject field is optional and can be used to categorize messages. It appears between the name/email row
          and the message textarea. Try submitting with and without a subject to see how both cases are handled.
        </p>
      </div>
      <ContactForm onSuccess={data => {
      console.log('Message sent:', data);
      alert(\`Message received!\\n\\nFrom: \${data.name}\\nEmail: \${data.email}\\nSubject: \${data.subject || '(No subject)'}\\n\\nMessage:\\n\${data.message}\`);
    }} onError={error => console.error('Send failed:', error)} />
    </div>,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: 'Showcases the optional subject field. Submit the form with and without a subject to see how ContactFormData includes or omits the subject field.'
      }
    }
  }
}`,...(rs=(ss=b.parameters)==null?void 0:ss.docs)==null?void 0:rs.source},description:{story:"Subject field usage showcase",...(ts=(as=b.parameters)==null?void 0:as.docs)==null?void 0:ts.description}}};const Us=["Default","CustomStyling","WithSuccessHandling","WithErrorHandling","CosmicTheme","MobileView","WideContainer","Playground","ValidationDemo","ContactPageLayout","AllStates","BehaviorDocumentation","LoadingState","SuccessFeedback","SubjectFieldShowcase"];export{h as AllStates,g as BehaviorDocumentation,p as ContactPageLayout,d as CosmicTheme,o as CustomStyling,t as Default,f as LoadingState,c as MobileView,m as Playground,b as SubjectFieldShowcase,x as SuccessFeedback,u as ValidationDemo,l as WideContainer,i as WithErrorHandling,n as WithSuccessHandling,Us as __namedExportsOrder,Ps as default};
