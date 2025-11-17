import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{P as r}from"./PricingCard-Cxinzqq8.js";import"./index-B2-qRKKC.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./Card-CHzXRqp1.js";import"./index-Dp3B9jqt.js";import"./clsx-B-dksMZM.js";import"./card-DPYCUmwK.js";import"./cn-CKXzwFwe.js";import"./Button-PgnE6Xyj.js";import"./button-DhHHw9VN.js";import"./index-BiMR7eR1.js";import"./index-BFjtS4uE.js";import"./Badge-X7SGaqQH.js";import"./arrow-right-2p1MOGVp.js";import"./createLucideIcon-BbF4D6Jl.js";import"./check-BFJmnSzs.js";import"./x-C2AjwpVd.js";const gi={title:"Tier 3: Compositions/Cards/PricingCard",component:r,parameters:{layout:"centered",docs:{description:{component:"Pricing card composition for displaying subscription tiers and product pricing. Features glass morphism design, popular badges, and feature comparison lists. Optimized for Ozean Licht branding with cosmic dark theme."}}},tags:["autodocs"],argTypes:{tier:{description:"Pricing tier data object with name, price, features, and CTA configuration",control:"object"},onCTAClick:{description:"Callback function triggered when the CTA button is clicked",action:"cta-clicked"},className:{description:"Additional CSS classes for custom styling",control:"text"}},decorators:[t=>e.jsx("div",{className:"w-full max-w-sm",children:e.jsx(t,{})})]},s={id:"1",name:"Basic",description:"Perfect for getting started",price:9,currency:"€",period:"month",cta:"Get Started",highlighted:!1,popular:!1,features:[{text:"Access to 10 courses",included:!0},{text:"Community forum access",included:!0},{text:"Basic meditation guides",included:!0},{text:"Email support",included:!0},{text:"Monthly live sessions",included:!1},{text:"Priority support",included:!1},{text:"1-on-1 coaching",included:!1},{text:"Advanced workshops",included:!1}]},i={id:"2",name:"Professional",description:"Most popular for committed learners",price:29,currency:"€",period:"month",cta:"Start Free Trial",highlighted:!0,popular:!0,features:[{text:"Access to all courses",included:!0},{text:"Community forum access",included:!0},{text:"All meditation guides",included:!0},{text:"Priority email support",included:!0,highlight:!0},{text:"Weekly live sessions",included:!0,highlight:!0},{text:"Downloadable resources",included:!0},{text:"Advanced workshops",included:!0},{text:"1-on-1 coaching",included:!1},{text:"Custom learning path",included:!1}]},a={id:"3",name:"Enterprise",description:"For organizations and schools",price:99,currency:"€",period:"month",cta:"Contact Sales",highlighted:!1,popular:!1,features:[{text:"Everything in Professional",included:!0},{text:"Unlimited team members",included:!0,highlight:!0},{text:"Dedicated account manager",included:!0,highlight:!0},{text:"Custom branding",included:!0},{text:"Advanced analytics",included:!0},{text:"SSO integration",included:!0},{text:"API access",included:!0},{text:"Priority phone support",included:!0},{text:"Quarterly training sessions",included:!0},{text:"Custom development",included:!0}]},L={id:"4",name:"Lifetime",description:"One-time payment, lifetime access",price:499,currency:"€",cta:"Get Lifetime Access",highlighted:!0,popular:!1,features:[{text:"Lifetime access to all courses",included:!0,highlight:!0},{text:"All future courses included",included:!0,highlight:!0},{text:"Priority support forever",included:!0},{text:"Early access to new features",included:!0},{text:"Exclusive lifetime community",included:!0},{text:"Annual 1-on-1 coaching session",included:!0}]},F={id:"5",name:"Free",description:"Try before you commit",price:0,currency:"€",period:"forever",cta:"Start Free",highlighted:!1,popular:!1,features:[{text:"Access to 3 intro courses",included:!0},{text:"Community forum (read-only)",included:!0},{text:"Basic meditation guide",included:!0},{text:"Email support",included:!1},{text:"Live sessions",included:!1},{text:"Downloadable resources",included:!1},{text:"Advanced content",included:!1}]},B={id:"6",name:"Student",description:"50% off with valid student ID",price:14.5,currency:"€",period:"month",cta:"Verify Student Status",highlighted:!1,popular:!1,features:[{text:"All Professional features",included:!0},{text:"50% discount",included:!0,highlight:!0},{text:"Student community access",included:!0},{text:"Career development resources",included:!0},{text:"Valid for 4 years",included:!0},{text:"Verification required",included:!0}]},Gr={id:"7",name:"Professional",description:"Save 20% with annual billing",price:279,currency:"€",period:"year",cta:"Save 20%",highlighted:!0,popular:!0,features:[{text:"All Professional features",included:!0},{text:"2 months free (€69 savings)",included:!0,highlight:!0},{text:"Annual payment discount",included:!0},{text:"Billed once per year",included:!0}]},Hr={id:"8",name:"Custom",description:"Tailored to your needs",price:0,cta:"Contact Us",highlighted:!1,popular:!1,features:[{text:"Custom course curation",included:!0},{text:"Flexible pricing model",included:!0},{text:"White-label solution",included:!0},{text:"Dedicated infrastructure",included:!0},{text:"Custom integrations",included:!0},{text:"SLA guarantee",included:!0}]},E={id:"9",name:"Kids Basic",description:"For families with 1-2 children",price:12,currency:"€",period:"month",cta:"Start Learning",highlighted:!1,popular:!1,features:[{text:"Up to 2 child profiles",included:!0},{text:"Age-appropriate content",included:!0},{text:"Interactive exercises",included:!0},{text:"Progress tracking",included:!0},{text:"Parent dashboard",included:!0},{text:"Family workshops",included:!1},{text:"Advanced activities",included:!1}]},D={id:"10",name:"Kids Family",description:"Perfect for growing families",price:24,currency:"€",period:"month",cta:"Start Free Trial",highlighted:!0,popular:!0,features:[{text:"Up to 5 child profiles",included:!0,highlight:!0},{text:"All age groups (3-16)",included:!0},{text:"Interactive exercises",included:!0},{text:"Advanced progress tracking",included:!0},{text:"Parent dashboard",included:!0},{text:"Monthly family workshops",included:!0,highlight:!0},{text:"Printable activities",included:!0},{text:"Priority support",included:!0}]},n={args:{tier:s}},o={args:{tier:i}},c={args:{tier:a}},d={args:{tier:F}},l={args:{tier:L}},u={args:{tier:B}},p={args:{tier:Gr}},m={args:{tier:Hr},parameters:{docs:{description:{story:"Custom pricing tier for enterprise clients requiring tailored solutions."}}}},g={args:{tier:E}},x={args:{tier:D}},h={args:{tier:i,className:"shadow-[0_0_30px_rgba(14,194,188,0.4)] scale-105"},parameters:{docs:{description:{story:"Pricing card with custom className for enhanced visual effects."}}}},f={args:{tier:i,onCTAClick:()=>{alert("Starting Professional trial!")}},parameters:{docs:{description:{story:"Pricing card with onClick handler for the CTA button. Click the button to see the alert."}}}},y={args:{tier:{name:"Starter",price:5,currency:"€",period:"month",features:[{text:"Basic access",included:!0},{text:"Community forum",included:!0},{text:"Premium content",included:!1}]}},parameters:{docs:{description:{story:"Minimal pricing tier with just essential information."}}}},v={args:{tier:{name:"Ultimate",description:"Everything you need and more",price:149,currency:"€",period:"month",popular:!0,highlighted:!0,features:[{text:"Unlimited course access",included:!0},{text:"All meditation guides",included:!0},{text:"Live sessions (weekly)",included:!0},{text:"Priority email support",included:!0},{text:"Priority phone support",included:!0},{text:"1-on-1 coaching (monthly)",included:!0,highlight:!0},{text:"Custom learning path",included:!0,highlight:!0},{text:"Advanced workshops",included:!0},{text:"Downloadable resources",included:!0},{text:"Exclusive community access",included:!0},{text:"Early feature access",included:!0},{text:"API access",included:!0},{text:"White-label options",included:!0},{text:"Custom integrations",included:!0},{text:"Dedicated account manager",included:!0},{text:"Quarterly business reviews",included:!0},{text:"Custom reporting",included:!0},{text:"SSO integration",included:!0},{text:"Advanced analytics",included:!0},{text:"Lifetime access guarantee",included:!0}]}},parameters:{docs:{description:{story:"Pricing tier with extensive feature list demonstrating scrollable content."}}}},C={args:{tier:{...i,price:32,currency:"$"}},parameters:{docs:{description:{story:"Pricing tier with USD currency symbol."}}}},b={render:()=>e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6 p-6 max-w-7xl",children:[e.jsx(r,{tier:s}),e.jsx(r,{tier:i}),e.jsx(r,{tier:a})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Standard three-tier pricing comparison layout (Basic, Pro, Enterprise)."}}}},T={render:()=>e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 max-w-7xl",children:[e.jsx(r,{tier:F}),e.jsx(r,{tier:s}),e.jsx(r,{tier:i}),e.jsx(r,{tier:a})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Four-tier pricing comparison including free tier."}}}},w={render:()=>e.jsxs("div",{className:"space-y-8 p-6 max-w-5xl",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-4 text-[var(--foreground)]",children:"Monthly Billing"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[e.jsx(r,{tier:s}),e.jsx(r,{tier:i}),e.jsx(r,{tier:a})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-4 text-[var(--foreground)]",children:"Annual Billing (Save 20%)"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[e.jsx(r,{tier:{...s,price:86,period:"year",description:"Save €22/year"}}),e.jsx(r,{tier:Gr}),e.jsx(r,{tier:{...a,price:950,period:"year",description:"Save €238/year"}})]})]})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Comparison between monthly and annual billing options showing savings."}}}},P={render:()=>e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-5xl",children:[e.jsx(r,{tier:E}),e.jsx(r,{tier:D})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Kids Ascension pricing tiers for educational platform."}}}},S={render:()=>e.jsxs("div",{className:"space-y-12 p-6 max-w-7xl",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold mb-6 text-[var(--foreground)]",children:"Ozean Licht - Spiritual Learning"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",children:[e.jsx(r,{tier:F}),e.jsx(r,{tier:s}),e.jsx(r,{tier:i}),e.jsx(r,{tier:a})]})]}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold mb-6 text-[var(--foreground)]",children:"Special Offers"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[e.jsx(r,{tier:B}),e.jsx(r,{tier:L}),e.jsx(r,{tier:Hr})]})]}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold mb-6 text-[var(--foreground)]",children:"Kids Ascension - Family Plans"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsx(r,{tier:E}),e.jsx(r,{tier:D})]})]})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Comprehensive showcase of all pricing variants for both Ozean Licht and Kids Ascension."}}}},j={render:()=>e.jsx("div",{className:"min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8",children:e.jsxs("div",{className:"max-w-7xl mx-auto",children:[e.jsxs("div",{className:"text-center mb-12",children:[e.jsx("h1",{className:"text-4xl font-bold text-white mb-4",children:"Choose Your Plan"}),e.jsx("p",{className:"text-[var(--muted-foreground)] text-lg",children:"Start your spiritual journey with Ozean Licht"})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-8",children:[e.jsx(r,{tier:s}),e.jsx(r,{tier:i}),e.jsx(r,{tier:a})]})]})}),parameters:{layout:"fullscreen",docs:{description:{story:"Pricing cards displayed on cosmic dark background with Ozean Licht branding."}}}},A={args:{tier:i},decorators:[t=>e.jsx("div",{className:"w-full max-w-[320px]",children:e.jsx(t,{})})],parameters:{viewport:{defaultViewport:"mobile1"},docs:{description:{story:"Pricing card optimized for mobile viewports."}}}},k={render:()=>e.jsxs("div",{className:"flex flex-col gap-4 p-4 max-w-[360px]",children:[e.jsx(r,{tier:s}),e.jsx(r,{tier:i}),e.jsx(r,{tier:a})]}),parameters:{viewport:{defaultViewport:"mobile1"},layout:"fullscreen",docs:{description:{story:"Stacked pricing cards for mobile comparison view."}}}},N={render:()=>{const t=Yr=>{alert(`Selected: ${Yr}`)};return e.jsxs("div",{className:"space-y-8 p-6 max-w-7xl",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-4 text-[var(--foreground)]",children:"Standard Tiers"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[e.jsx(r,{tier:s,onCTAClick:()=>t("Basic")}),e.jsx(r,{tier:i,onCTAClick:()=>t("Professional")}),e.jsx(r,{tier:a,onCTAClick:()=>t("Enterprise")})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-4 text-[var(--foreground)]",children:"Special Options"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[e.jsx(r,{tier:F,onCTAClick:()=>t("Free")}),e.jsx(r,{tier:B,onCTAClick:()=>t("Student")}),e.jsx(r,{tier:L,onCTAClick:()=>t("Lifetime")})]})]})]})},parameters:{layout:"fullscreen",docs:{description:{story:"Interactive pricing cards with click handlers. Click any CTA button to see the selection."}}}};var O,M,K,z,U;n.parameters={...n.parameters,docs:{...(O=n.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    tier: basicTier
  }
}`,...(K=(M=n.parameters)==null?void 0:M.docs)==null?void 0:K.source},description:{story:"Default pricing card with basic tier",...(U=(z=n.parameters)==null?void 0:z.docs)==null?void 0:U.description}}};var V,I,_,W,$;o.parameters={...o.parameters,docs:{...(V=o.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    tier: proTier
  }
}`,...(_=(I=o.parameters)==null?void 0:I.docs)==null?void 0:_.source},description:{story:"Professional tier marked as popular with highlighted styling",...($=(W=o.parameters)==null?void 0:W.docs)==null?void 0:$.description}}};var q,Q,G,H,Y;c.parameters={...c.parameters,docs:{...(q=c.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    tier: enterpriseTier
  }
}`,...(G=(Q=c.parameters)==null?void 0:Q.docs)==null?void 0:G.source},description:{story:"Enterprise tier with extensive feature list",...(Y=(H=c.parameters)==null?void 0:H.docs)==null?void 0:Y.description}}};var R,J,X,Z,ee;d.parameters={...d.parameters,docs:{...(R=d.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    tier: freeTier
  }
}`,...(X=(J=d.parameters)==null?void 0:J.docs)==null?void 0:X.source},description:{story:"Free tier showing zero price",...(ee=(Z=d.parameters)==null?void 0:Z.docs)==null?void 0:ee.description}}};var re,ie,te,se,ae;l.parameters={...l.parameters,docs:{...(re=l.parameters)==null?void 0:re.docs,source:{originalSource:`{
  args: {
    tier: lifetimeTier
  }
}`,...(te=(ie=l.parameters)==null?void 0:ie.docs)==null?void 0:te.source},description:{story:"Lifetime tier with one-time payment (no period)",...(ae=(se=l.parameters)==null?void 0:se.docs)==null?void 0:ae.description}}};var ne,oe,ce,de,le;u.parameters={...u.parameters,docs:{...(ne=u.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    tier: studentTier
  }
}`,...(ce=(oe=u.parameters)==null?void 0:oe.docs)==null?void 0:ce.source},description:{story:"Student tier with discount",...(le=(de=u.parameters)==null?void 0:de.docs)==null?void 0:le.description}}};var ue,pe,me,ge,xe;p.parameters={...p.parameters,docs:{...(ue=p.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  args: {
    tier: annualProTier
  }
}`,...(me=(pe=p.parameters)==null?void 0:pe.docs)==null?void 0:me.source},description:{story:"Annual billing tier showing yearly price",...(xe=(ge=p.parameters)==null?void 0:ge.docs)==null?void 0:xe.description}}};var he,fe,ye,ve,Ce;m.parameters={...m.parameters,docs:{...(he=m.parameters)==null?void 0:he.docs,source:{originalSource:`{
  args: {
    tier: customTier
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom pricing tier for enterprise clients requiring tailored solutions.'
      }
    }
  }
}`,...(ye=(fe=m.parameters)==null?void 0:fe.docs)==null?void 0:ye.source},description:{story:'Custom tier with "Contact Us" pricing',...(Ce=(ve=m.parameters)==null?void 0:ve.docs)==null?void 0:Ce.description}}};var be,Te,we,Pe,Se;g.parameters={...g.parameters,docs:{...(be=g.parameters)==null?void 0:be.docs,source:{originalSource:`{
  args: {
    tier: kidsBasicTier
  }
}`,...(we=(Te=g.parameters)==null?void 0:Te.docs)==null?void 0:we.source},description:{story:"Kids Ascension basic tier for families",...(Se=(Pe=g.parameters)==null?void 0:Pe.docs)==null?void 0:Se.description}}};var je,Ae,ke,Ne,Fe;x.parameters={...x.parameters,docs:{...(je=x.parameters)==null?void 0:je.docs,source:{originalSource:`{
  args: {
    tier: kidsFamilyTier
  }
}`,...(ke=(Ae=x.parameters)==null?void 0:Ae.docs)==null?void 0:ke.source},description:{story:"Kids Ascension family tier (popular)",...(Fe=(Ne=x.parameters)==null?void 0:Ne.docs)==null?void 0:Fe.description}}};var Le,Be,Ee,De,Oe;h.parameters={...h.parameters,docs:{...(Le=h.parameters)==null?void 0:Le.docs,source:{originalSource:`{
  args: {
    tier: proTier,
    className: 'shadow-[0_0_30px_rgba(14,194,188,0.4)] scale-105'
  },
  parameters: {
    docs: {
      description: {
        story: 'Pricing card with custom className for enhanced visual effects.'
      }
    }
  }
}`,...(Ee=(Be=h.parameters)==null?void 0:Be.docs)==null?void 0:Ee.source},description:{story:"Tier with custom styling",...(Oe=(De=h.parameters)==null?void 0:De.docs)==null?void 0:Oe.description}}};var Me,Ke,ze,Ue,Ve;f.parameters={...f.parameters,docs:{...(Me=f.parameters)==null?void 0:Me.docs,source:{originalSource:`{
  args: {
    tier: proTier,
    onCTAClick: () => {
      alert('Starting Professional trial!');
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Pricing card with onClick handler for the CTA button. Click the button to see the alert.'
      }
    }
  }
}`,...(ze=(Ke=f.parameters)==null?void 0:Ke.docs)==null?void 0:ze.source},description:{story:"Tier with CTA click handler",...(Ve=(Ue=f.parameters)==null?void 0:Ue.docs)==null?void 0:Ve.description}}};var Ie,_e,We,$e,qe;y.parameters={...y.parameters,docs:{...(Ie=y.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  args: {
    tier: {
      name: 'Starter',
      price: 5,
      currency: '€',
      period: 'month',
      features: [{
        text: 'Basic access',
        included: true
      }, {
        text: 'Community forum',
        included: true
      }, {
        text: 'Premium content',
        included: false
      }]
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal pricing tier with just essential information.'
      }
    }
  }
}`,...(We=(_e=y.parameters)==null?void 0:_e.docs)==null?void 0:We.source},description:{story:"Minimal tier with few features",...(qe=($e=y.parameters)==null?void 0:$e.docs)==null?void 0:qe.description}}};var Qe,Ge,He,Ye,Re;v.parameters={...v.parameters,docs:{...(Qe=v.parameters)==null?void 0:Qe.docs,source:{originalSource:`{
  args: {
    tier: {
      name: 'Ultimate',
      description: 'Everything you need and more',
      price: 149,
      currency: '€',
      period: 'month',
      popular: true,
      highlighted: true,
      features: [{
        text: 'Unlimited course access',
        included: true
      }, {
        text: 'All meditation guides',
        included: true
      }, {
        text: 'Live sessions (weekly)',
        included: true
      }, {
        text: 'Priority email support',
        included: true
      }, {
        text: 'Priority phone support',
        included: true
      }, {
        text: '1-on-1 coaching (monthly)',
        included: true,
        highlight: true
      }, {
        text: 'Custom learning path',
        included: true,
        highlight: true
      }, {
        text: 'Advanced workshops',
        included: true
      }, {
        text: 'Downloadable resources',
        included: true
      }, {
        text: 'Exclusive community access',
        included: true
      }, {
        text: 'Early feature access',
        included: true
      }, {
        text: 'API access',
        included: true
      }, {
        text: 'White-label options',
        included: true
      }, {
        text: 'Custom integrations',
        included: true
      }, {
        text: 'Dedicated account manager',
        included: true
      }, {
        text: 'Quarterly business reviews',
        included: true
      }, {
        text: 'Custom reporting',
        included: true
      }, {
        text: 'SSO integration',
        included: true
      }, {
        text: 'Advanced analytics',
        included: true
      }, {
        text: 'Lifetime access guarantee',
        included: true
      }]
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Pricing tier with extensive feature list demonstrating scrollable content.'
      }
    }
  }
}`,...(He=(Ge=v.parameters)==null?void 0:Ge.docs)==null?void 0:He.source},description:{story:"Tier with very long feature list",...(Re=(Ye=v.parameters)==null?void 0:Ye.docs)==null?void 0:Re.description}}};var Je,Xe,Ze,er,rr;C.parameters={...C.parameters,docs:{...(Je=C.parameters)==null?void 0:Je.docs,source:{originalSource:`{
  args: {
    tier: {
      ...proTier,
      price: 32,
      currency: '$'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Pricing tier with USD currency symbol.'
      }
    }
  }
}`,...(Ze=(Xe=C.parameters)==null?void 0:Xe.docs)==null?void 0:Ze.source},description:{story:"Different currency (USD)",...(rr=(er=C.parameters)==null?void 0:er.docs)==null?void 0:rr.description}}};var ir,tr,sr,ar,nr;b.parameters={...b.parameters,docs:{...(ir=b.parameters)==null?void 0:ir.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 max-w-7xl">
      <PricingCard tier={basicTier} />
      <PricingCard tier={proTier} />
      <PricingCard tier={enterpriseTier} />
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Standard three-tier pricing comparison layout (Basic, Pro, Enterprise).'
      }
    }
  }
}`,...(sr=(tr=b.parameters)==null?void 0:tr.docs)==null?void 0:sr.source},description:{story:"Three-tier comparison layout",...(nr=(ar=b.parameters)==null?void 0:ar.docs)==null?void 0:nr.description}}};var or,cr,dr,lr,ur;T.parameters={...T.parameters,docs:{...(or=T.parameters)==null?void 0:or.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 max-w-7xl">
      <PricingCard tier={freeTier} />
      <PricingCard tier={basicTier} />
      <PricingCard tier={proTier} />
      <PricingCard tier={enterpriseTier} />
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Four-tier pricing comparison including free tier.'
      }
    }
  }
}`,...(dr=(cr=T.parameters)==null?void 0:cr.docs)==null?void 0:dr.source},description:{story:"Four-tier comparison including free tier",...(ur=(lr=T.parameters)==null?void 0:lr.docs)==null?void 0:ur.description}}};var pr,mr,gr,xr,hr;w.parameters={...w.parameters,docs:{...(pr=w.parameters)==null?void 0:pr.docs,source:{originalSource:`{
  render: () => <div className="space-y-8 p-6 max-w-5xl">
      <div>
        <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">Monthly Billing</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PricingCard tier={basicTier} />
          <PricingCard tier={proTier} />
          <PricingCard tier={enterpriseTier} />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">Annual Billing (Save 20%)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PricingCard tier={{
          ...basicTier,
          price: 86,
          period: 'year',
          description: 'Save €22/year'
        }} />
          <PricingCard tier={annualProTier} />
          <PricingCard tier={{
          ...enterpriseTier,
          price: 950,
          period: 'year',
          description: 'Save €238/year'
        }} />
        </div>
      </div>
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Comparison between monthly and annual billing options showing savings.'
      }
    }
  }
}`,...(gr=(mr=w.parameters)==null?void 0:mr.docs)==null?void 0:gr.source},description:{story:"Monthly vs Annual billing comparison",...(hr=(xr=w.parameters)==null?void 0:xr.docs)==null?void 0:hr.description}}};var fr,yr,vr,Cr,br;P.parameters={...P.parameters,docs:{...(fr=P.parameters)==null?void 0:fr.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-5xl">
      <PricingCard tier={kidsBasicTier} />
      <PricingCard tier={kidsFamilyTier} />
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Kids Ascension pricing tiers for educational platform.'
      }
    }
  }
}`,...(vr=(yr=P.parameters)==null?void 0:yr.docs)==null?void 0:vr.source},description:{story:"Kids Ascension family tiers",...(br=(Cr=P.parameters)==null?void 0:Cr.docs)==null?void 0:br.description}}};var Tr,wr,Pr,Sr,jr;S.parameters={...S.parameters,docs:{...(Tr=S.parameters)==null?void 0:Tr.docs,source:{originalSource:`{
  render: () => <div className="space-y-12 p-6 max-w-7xl">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)]">Ozean Licht - Spiritual Learning</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PricingCard tier={freeTier} />
          <PricingCard tier={basicTier} />
          <PricingCard tier={proTier} />
          <PricingCard tier={enterpriseTier} />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)]">Special Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PricingCard tier={studentTier} />
          <PricingCard tier={lifetimeTier} />
          <PricingCard tier={customTier} />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)]">Kids Ascension - Family Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PricingCard tier={kidsBasicTier} />
          <PricingCard tier={kidsFamilyTier} />
        </div>
      </div>
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Comprehensive showcase of all pricing variants for both Ozean Licht and Kids Ascension.'
      }
    }
  }
}`,...(Pr=(wr=S.parameters)==null?void 0:wr.docs)==null?void 0:Pr.source},description:{story:"All pricing variants showcase",...(jr=(Sr=S.parameters)==null?void 0:Sr.docs)==null?void 0:jr.description}}};var Ar,kr,Nr,Fr,Lr;j.parameters={...j.parameters,docs:{...(Ar=j.parameters)==null?void 0:Ar.docs,source:{originalSource:`{
  render: () => <div className="min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-[var(--muted-foreground)] text-lg">
            Start your spiritual journey with Ozean Licht
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PricingCard tier={basicTier} />
          <PricingCard tier={proTier} />
          <PricingCard tier={enterpriseTier} />
        </div>
      </div>
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Pricing cards displayed on cosmic dark background with Ozean Licht branding.'
      }
    }
  }
}`,...(Nr=(kr=j.parameters)==null?void 0:kr.docs)==null?void 0:Nr.source},description:{story:"Cosmic dark theme showcase",...(Lr=(Fr=j.parameters)==null?void 0:Fr.docs)==null?void 0:Lr.description}}};var Br,Er,Dr,Or,Mr;A.parameters={...A.parameters,docs:{...(Br=A.parameters)==null?void 0:Br.docs,source:{originalSource:`{
  args: {
    tier: proTier
  },
  decorators: [Story => <div className="w-full max-w-[320px]">
        <Story />
      </div>],
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Pricing card optimized for mobile viewports.'
      }
    }
  }
}`,...(Dr=(Er=A.parameters)==null?void 0:Er.docs)==null?void 0:Dr.source},description:{story:"Mobile view (narrow container)",...(Mr=(Or=A.parameters)==null?void 0:Or.docs)==null?void 0:Mr.description}}};var Kr,zr,Ur,Vr,Ir;k.parameters={...k.parameters,docs:{...(Kr=k.parameters)==null?void 0:Kr.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4 p-4 max-w-[360px]">
      <PricingCard tier={basicTier} />
      <PricingCard tier={proTier} />
      <PricingCard tier={enterpriseTier} />
    </div>,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Stacked pricing cards for mobile comparison view.'
      }
    }
  }
}`,...(Ur=(zr=k.parameters)==null?void 0:zr.docs)==null?void 0:Ur.source},description:{story:"Stacked layout for mobile comparison",...(Ir=(Vr=k.parameters)==null?void 0:Vr.docs)==null?void 0:Ir.description}}};var _r,Wr,$r,qr,Qr;N.parameters={...N.parameters,docs:{...(_r=N.parameters)==null?void 0:_r.docs,source:{originalSource:`{
  render: () => {
    const handleClick = (tierName: string) => {
      alert(\`Selected: \${tierName}\`);
    };
    return <div className="space-y-8 p-6 max-w-7xl">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">Standard Tiers</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PricingCard tier={basicTier} onCTAClick={() => handleClick('Basic')} />
            <PricingCard tier={proTier} onCTAClick={() => handleClick('Professional')} />
            <PricingCard tier={enterpriseTier} onCTAClick={() => handleClick('Enterprise')} />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">Special Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PricingCard tier={freeTier} onCTAClick={() => handleClick('Free')} />
            <PricingCard tier={studentTier} onCTAClick={() => handleClick('Student')} />
            <PricingCard tier={lifetimeTier} onCTAClick={() => handleClick('Lifetime')} />
          </div>
        </div>
      </div>;
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Interactive pricing cards with click handlers. Click any CTA button to see the selection.'
      }
    }
  }
}`,...($r=(Wr=N.parameters)==null?void 0:Wr.docs)==null?void 0:$r.source},description:{story:"Interactive demo with all states",...(Qr=(qr=N.parameters)==null?void 0:qr.docs)==null?void 0:Qr.description}}};const xi=["Default","Popular","Enterprise","Free","Lifetime","Student","AnnualBilling","Custom","KidsBasic","KidsFamily","CustomStyling","WithClickHandler","Minimal","ExtensiveFeatures","USDCurrency","ThreeTierComparison","FourTierComparison","MonthlyVsAnnual","KidsAscensionTiers","AllVariants","CosmicTheme","MobileView","MobileComparison","InteractiveDemo"];export{S as AllVariants,p as AnnualBilling,j as CosmicTheme,m as Custom,h as CustomStyling,n as Default,c as Enterprise,v as ExtensiveFeatures,T as FourTierComparison,d as Free,N as InteractiveDemo,P as KidsAscensionTiers,g as KidsBasic,x as KidsFamily,l as Lifetime,y as Minimal,k as MobileComparison,A as MobileView,w as MonthlyVsAnnual,o as Popular,u as Student,b as ThreeTierComparison,C as USDCurrency,f as WithClickHandler,xi as __namedExportsOrder,gi as default};
