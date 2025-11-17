import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{P as Qt}from"./PricingCard-Cxinzqq8.js";import{c as Xt}from"./cn-CKXzwFwe.js";import"./index-B2-qRKKC.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./Card-CHzXRqp1.js";import"./index-Dp3B9jqt.js";import"./clsx-B-dksMZM.js";import"./card-DPYCUmwK.js";import"./Button-PgnE6Xyj.js";import"./button-DhHHw9VN.js";import"./index-BiMR7eR1.js";import"./index-BFjtS4uE.js";import"./Badge-X7SGaqQH.js";import"./arrow-right-2p1MOGVp.js";import"./createLucideIcon-BbF4D6Jl.js";import"./check-BFJmnSzs.js";import"./x-C2AjwpVd.js";function n({title:t,subtitle:T,tiers:Ht,onTierSelect:M,className:$t}){return e.jsxs("section",{className:Xt("container mx-auto px-6 py-12",$t),children:[(t||T)&&e.jsxs("div",{className:"text-center max-w-3xl mx-auto mb-12 space-y-4",children:[T&&e.jsx("p",{className:"text-primary text-sm font-alt uppercase tracking-wide",children:T}),t&&e.jsx("h2",{className:"text-4xl md:text-5xl font-decorative text-white",style:{textShadow:"0 0 8px rgba(255, 255, 255, 0.42)"},children:t})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto",children:Ht.map((G,Kt)=>e.jsx(Qt,{tier:G,onCTAClick:()=>M==null?void 0:M(G)},G.id||Kt))})]})}n.displayName="PricingSection";try{n.displayName="PricingSection",n.__docgenInfo={description:"",displayName:"PricingSection",props:{title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string"}},subtitle:{defaultValue:null,description:"",name:"subtitle",required:!1,type:{name:"string"}},tiers:{defaultValue:null,description:"",name:"tiers",required:!0,type:{name:"PricingTier[]"}},onTierSelect:{defaultValue:null,description:"",name:"onTierSelect",required:!1,type:{name:"((tier: PricingTier) => void)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const yn={title:"Tier 3: Compositions/Sections/PricingSection",component:n,parameters:{layout:"fullscreen",docs:{description:{component:"Pricing section composition for displaying subscription tiers and pricing plans with responsive grid layouts and feature comparisons."}}},tags:["autodocs"],argTypes:{title:{control:"text",description:"Main section heading (optional)"},subtitle:{control:"text",description:"Badge subtitle shown above title in primary turquoise color"},tiers:{control:"object",description:"Array of pricing tier objects with name, price, features, and CTA"},onTierSelect:{action:"tier-selected",description:"Callback when a tier CTA is clicked, receives the selected tier object"},className:{control:"text",description:"Additional CSS classes for custom styling"}}},r={args:{title:"Choose Your Plan",subtitle:"Flexible Pricing",tiers:[{id:"1",name:"Basic",description:"Perfect for getting started",price:9,currency:"€",period:"month",features:[{text:"Access to 50+ guided meditations",included:!0},{text:"Community forum access",included:!0},{text:"Monthly live sessions",included:!0},{text:"Downloadable content",included:!1},{text:"Priority support",included:!1},{text:"Advanced courses",included:!1}],cta:"Get Started"},{id:"2",name:"Pro",description:"Most popular choice",price:19,currency:"€",period:"month",features:[{text:"Access to all 500+ meditations",included:!0},{text:"Community forum access",included:!0},{text:"Weekly live sessions",included:!0},{text:"Unlimited downloads",included:!0},{text:"Priority email support",included:!0},{text:"Advanced courses",included:!1}],cta:"Start Free Trial",highlighted:!0,popular:!0},{id:"3",name:"Premium",description:"For serious practitioners",price:39,currency:"€",period:"month",features:[{text:"Everything in Pro",included:!0,highlight:!0},{text:"Daily live sessions",included:!0},{text:"All advanced courses",included:!0},{text:"1-on-1 coaching sessions",included:!0},{text:"Certification programs",included:!0},{text:"Lifetime access to content",included:!0}],cta:"Go Premium"}]}},i={args:{title:"Simple Pricing",subtitle:"Choose What Works for You",tiers:[{id:"1",name:"Free",description:"Try before you commit",price:0,currency:"€",period:"forever",features:[{text:"10 guided meditations",included:!0},{text:"Basic breathing exercises",included:!0},{text:"Community forum (read-only)",included:!0},{text:"Full content library",included:!1},{text:"Live sessions",included:!1},{text:"Downloads",included:!1}],cta:"Start Free"},{id:"2",name:"Unlimited",description:"Everything you need",price:15,currency:"€",period:"month",features:[{text:"Unlimited meditations",included:!0},{text:"All breathing exercises",included:!0},{text:"Community forum (full access)",included:!0},{text:"Full content library",included:!0},{text:"Weekly live sessions",included:!0},{text:"Unlimited downloads",included:!0}],cta:"Upgrade Now",highlighted:!0,popular:!0}]}},s={args:{title:"Plans for Everyone",subtitle:"From Individual to Enterprise",tiers:[{id:"1",name:"Starter",description:"Individual practice",price:5,currency:"€",period:"month",features:[{text:"Basic meditation library",included:!0},{text:"Community access",included:!0},{text:"Mobile app",included:!0},{text:"Live sessions",included:!1}],cta:"Start"},{id:"2",name:"Personal",description:"Dedicated practitioners",price:15,currency:"€",period:"month",features:[{text:"Full meditation library",included:!0},{text:"Community access",included:!0},{text:"Mobile app",included:!0},{text:"Weekly live sessions",included:!0}],cta:"Choose Personal",popular:!0},{id:"3",name:"Professional",description:"Teachers & coaches",price:29,currency:"€",period:"month",features:[{text:"Everything in Personal",included:!0},{text:"Certification access",included:!0},{text:"Teaching resources",included:!0},{text:"Daily live sessions",included:!0}],cta:"Go Pro",highlighted:!0},{id:"4",name:"Enterprise",description:"Organizations",price:99,currency:"€",period:"month",features:[{text:"Everything in Professional",included:!0},{text:"Unlimited team members",included:!0},{text:"Custom branding",included:!0},{text:"Dedicated support",included:!0}],cta:"Contact Sales"}]}},a={args:{title:"Save with Annual Plans",subtitle:"2 Months Free",tiers:[{id:"1",name:"Basic",description:"Save €18 per year",price:90,currency:"€",period:"year",features:[{text:"50+ guided meditations",included:!0},{text:"Community forum",included:!0},{text:"Monthly live sessions",included:!0},{text:"Priority support",included:!1}],cta:"Get Started"},{id:"2",name:"Pro",description:"Save €38 per year",price:190,currency:"€",period:"year",features:[{text:"500+ guided meditations",included:!0},{text:"Community forum",included:!0},{text:"Weekly live sessions",included:!0},{text:"Priority support",included:!0}],cta:"Start Trial",highlighted:!0,popular:!0},{id:"3",name:"Premium",description:"Save €78 per year",price:390,currency:"€",period:"year",features:[{text:"All Pro features",included:!0,highlight:!0},{text:"Daily live sessions",included:!0},{text:"1-on-1 coaching",included:!0},{text:"Certification programs",included:!0}],cta:"Go Premium"}]}},d={args:{tiers:[{id:"1",name:"Monthly",price:15,period:"month",features:[{text:"All features included",included:!0},{text:"Cancel anytime",included:!0},{text:"Monthly billing",included:!0}],cta:"Subscribe Monthly"},{id:"2",name:"Annual",price:150,period:"year",features:[{text:"All features included",included:!0},{text:"Save 2 months",included:!0,highlight:!0},{text:"Annual billing",included:!0}],cta:"Subscribe Annually",highlighted:!0,popular:!0}]}},c={args:{title:"Membership Plans",tiers:[{name:"Individual",price:12,period:"month",features:[{text:"Personal account",included:!0},{text:"Full library access",included:!0}],cta:"Join"},{name:"Family",price:25,period:"month",features:[{text:"Up to 5 accounts",included:!0},{text:"Full library access",included:!0}],cta:"Join",popular:!0},{name:"Studio",price:99,period:"month",features:[{text:"Unlimited accounts",included:!0},{text:"Commercial license",included:!0}],cta:"Contact Us"}]}},u={args:{title:"Learning Plans for Every Child",subtitle:"Kids Ascension",tiers:[{id:"1",name:"Explorer",description:"Ages 4-7",price:8,currency:"€",period:"month",features:[{text:"50+ age-appropriate lessons",included:!0},{text:"Interactive games",included:!0},{text:"Progress tracking",included:!0},{text:"Parental controls",included:!0},{text:"Advanced courses",included:!1},{text:"Live tutoring",included:!1}],cta:"Start Learning"},{id:"2",name:"Scholar",description:"Ages 8-12",price:12,currency:"€",period:"month",features:[{text:"200+ comprehensive lessons",included:!0},{text:"Interactive projects",included:!0},{text:"Detailed analytics",included:!0},{text:"Parental dashboard",included:!0},{text:"Advanced STEM courses",included:!0},{text:"Monthly group sessions",included:!0}],cta:"Enroll Now",highlighted:!0,popular:!0},{id:"3",name:"Academy",description:"Ages 13+",price:18,currency:"€",period:"month",features:[{text:"All Scholar features",included:!0,highlight:!0},{text:"University prep courses",included:!0},{text:"Career guidance",included:!0},{text:"Weekly live tutoring",included:!0},{text:"Certificate programs",included:!0},{text:"College application support",included:!0}],cta:"Get Started"}]}},o={args:{title:"Transform Your Consciousness",subtitle:"Spiritual Growth Memberships",tiers:[{id:"1",name:"Seeker",description:"Begin your journey",price:10,currency:"€",period:"month",features:[{text:"Foundational courses",included:!0},{text:"Guided meditations",included:!0},{text:"Community forums",included:!0},{text:"Monthly workshops",included:!0},{text:"Advanced teachings",included:!1},{text:"Personal mentoring",included:!1}],cta:"Begin Journey"},{id:"2",name:"Practitioner",description:"Deepen your practice",price:25,currency:"€",period:"month",features:[{text:"All Seeker features",included:!0},{text:"Advanced courses",included:!0},{text:"Weekly live sessions",included:!0},{text:"Energy work training",included:!0},{text:"Retreat discounts",included:!0},{text:"Personal mentoring",included:!1}],cta:"Level Up",highlighted:!0,popular:!0},{id:"3",name:"Master",description:"Complete transformation",price:50,currency:"€",period:"month",features:[{text:"All Practitioner features",included:!0,highlight:!0},{text:"Teacher certification path",included:!0},{text:"Private mentoring sessions",included:!0},{text:"Exclusive master classes",included:!0},{text:"Free retreat attendance",included:!0},{text:"Lifetime community access",included:!0}],cta:"Ascend Now"}]}},l={args:{title:"Most Choose Pro",subtitle:"Recommended",tiers:[{name:"Basic",price:9,period:"month",features:[{text:"Essential features",included:!0},{text:"Email support",included:!0},{text:"Advanced tools",included:!1}],cta:"Get Basic"},{name:"Pro",description:"Best value for most users",price:19,period:"month",features:[{text:"All Basic features",included:!0,highlight:!0},{text:"Priority support",included:!0},{text:"Advanced tools",included:!0}],cta:"Get Pro",highlighted:!0,popular:!0},{name:"Enterprise",price:49,period:"month",features:[{text:"All Pro features",included:!0},{text:"Dedicated support",included:!0},{text:"Custom integrations",included:!0}],cta:"Contact Sales"}]}},p={args:{title:"Global Pricing",subtitle:"USD Rates",tiers:[{name:"Basic",price:10,currency:"$",period:"month",features:[{text:"Core features",included:!0},{text:"Community support",included:!0}],cta:"Subscribe"},{name:"Pro",price:20,currency:"$",period:"month",features:[{text:"All features",included:!0},{text:"Priority support",included:!0}],cta:"Subscribe",popular:!0},{name:"Team",price:50,currency:"$",period:"month",features:[{text:"Everything in Pro",included:!0},{text:"Team management",included:!0}],cta:"Subscribe"}]}},m={args:{title:"Flexible Options",subtitle:"Your Choice",tiers:[{name:"Free Trial",price:0,period:"14 days",features:[{text:"Full access trial",included:!0},{text:"No credit card required",included:!0}],cta:"Start Free Trial"},{name:"Monthly",price:15,period:"month",features:[{text:"All features",included:!0},{text:"Cancel anytime",included:!0}],cta:"Subscribe Now",popular:!0},{name:"Lifetime",price:299,period:"one-time",features:[{text:"All features forever",included:!0},{text:"Free updates",included:!0}],cta:"Buy Lifetime Access"}]}},x={args:{title:"Compare Features",subtitle:"Find Your Perfect Fit",tiers:[{name:"Starter",price:10,period:"month",features:[{text:"Basic meditations",included:!0},{text:"Community access",included:!0},{text:"Live sessions",included:!1},{text:"Downloads",included:!1},{text:"Coaching",included:!1}],cta:"Get Started"},{name:"Growth",price:20,period:"month",features:[{text:"All meditations",included:!0},{text:"Community access",included:!0},{text:"4 live sessions/month",included:!0,highlight:!0},{text:"Unlimited downloads",included:!0,highlight:!0},{text:"Coaching",included:!1}],cta:"Choose Growth",popular:!0},{name:"Transformation",price:40,period:"month",features:[{text:"Everything in Growth",included:!0},{text:"Premium community",included:!0},{text:"Unlimited live sessions",included:!0,highlight:!0},{text:"Priority downloads",included:!0},{text:"Monthly 1-on-1 coaching",included:!0,highlight:!0}],cta:"Transform Now",highlighted:!0}]}},h={args:{title:"Simple & Clear",subtitle:"No Hidden Fees",tiers:[{name:"Personal",price:12,period:"month",features:[{text:"Full content access",included:!0},{text:"24/7 support",included:!0}],cta:"Get Personal"},{name:"Team",price:35,period:"month",features:[{text:"Everything in Personal",included:!0},{text:"Team collaboration",included:!0}],cta:"Get Team",popular:!0}]}},g={args:{title:"Comprehensive Plans",subtitle:"Everything You Need",tiers:[{name:"Complete",price:29,period:"month",features:[{text:"Unlimited guided meditations",included:!0},{text:"All breathing exercises",included:!0},{text:"Full course library",included:!0},{text:"Community forum access",included:!0},{text:"Weekly live sessions",included:!0},{text:"Unlimited downloads",included:!0},{text:"Mobile & desktop apps",included:!0},{text:"Progress tracking",included:!0},{text:"Email support",included:!0},{text:"Monthly challenges",included:!0}],cta:"Get Everything",popular:!0}]}},f={args:{title:"Enterprise Solutions",subtitle:"Custom Pricing",tiers:[{name:"Pro",price:25,period:"month",features:[{text:"All premium features",included:!0},{text:"Up to 10 users",included:!0},{text:"Priority support",included:!0}],cta:"Get Pro"},{name:"Enterprise",description:"Custom solutions for large teams",price:0,currency:"",period:"custom",features:[{text:"Everything in Pro",included:!0},{text:"Unlimited users",included:!0},{text:"Custom integrations",included:!0},{text:"Dedicated account manager",included:!0},{text:"SLA guarantee",included:!0},{text:"Custom branding",included:!0}],cta:"Contact Sales",highlighted:!0}]}},y={args:{title:"One Simple Plan",subtitle:"All-Inclusive",tiers:[{name:"All Access",description:"Everything included",price:19,period:"month",features:[{text:"Unlimited content access",included:!0},{text:"All courses & workshops",included:!0},{text:"Live sessions",included:!0},{text:"Community access",included:!0},{text:"Priority support",included:!0},{text:"Mobile apps",included:!0}],cta:"Get Started",highlighted:!0}]}},v={args:{title:"Custom Layout",subtitle:"Extended Spacing",tiers:[{name:"Standard",price:15,period:"month",features:[{text:"All features",included:!0}],cta:"Subscribe"},{name:"Premium",price:30,period:"month",features:[{text:"Everything + extras",included:!0}],cta:"Upgrade",popular:!0}],className:"py-20"}},b={args:{title:"Cosmic Pricing",subtitle:"Choose Your Path",tiers:[{name:"Novice",description:"Start your cosmic journey",price:12,period:"month",features:[{text:"Basic cosmic teachings",included:!0},{text:"Meditation library",included:!0},{text:"Community forums",included:!0}],cta:"Begin"},{name:"Adept",description:"Deepen your practice",price:24,period:"month",features:[{text:"Advanced cosmic wisdom",included:!0},{text:"Full meditation access",included:!0},{text:"Live sessions",included:!0}],cta:"Ascend",highlighted:!0,popular:!0},{name:"Master",description:"Achieve enlightenment",price:48,period:"month",features:[{text:"All cosmic knowledge",included:!0},{text:"Personal guidance",included:!0},{text:"Exclusive teachings",included:!0}],cta:"Transcend"}]},decorators:[t=>e.jsx("div",{className:"relative min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d1f3a] to-[#0a1628]",children:e.jsx(t,{})})]},S={args:{title:"Modern Design",subtitle:"Glass Effect",tiers:[{name:"Essential",price:10,period:"month",features:[{text:"Core features",included:!0},{text:"Standard support",included:!0}],cta:"Get Essential"},{name:"Professional",price:25,period:"month",features:[{text:"All features",included:!0},{text:"Priority support",included:!0}],cta:"Go Pro",popular:!0},{name:"Ultimate",price:50,period:"month",features:[{text:"Everything",included:!0},{text:"White-glove support",included:!0}],cta:"Get Ultimate"}]},decorators:[t=>e.jsx("div",{className:"min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d1f3a] to-[#0a1628] p-8",children:e.jsx("div",{className:"backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-8",children:e.jsx(t,{})})})]},P={args:{title:"Ozean Licht Memberships",subtitle:"Signature Branding",tiers:[{name:"Wave",description:"Ride the gentle waves",price:15,period:"month",features:[{text:"Foundational teachings",included:!0},{text:"Calm & clarity",included:!0}],cta:"Ride Wave"},{name:"Ocean",description:"Dive into depths",price:30,period:"month",features:[{text:"Deep teachings",included:!0},{text:"Transformation",included:!0}],cta:"Dive Deep",highlighted:!0,popular:!0},{name:"Light",description:"Illuminate your path",price:60,period:"month",features:[{text:"Complete wisdom",included:!0},{text:"Full enlightenment",included:!0}],cta:"Find Light"}]},decorators:[t=>e.jsxs("div",{className:"relative min-h-screen bg-[#0a0a0a]",children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-br from-[#0ec2bc]/10 via-transparent to-[#0ec2bc]/10 pointer-events-none"}),e.jsx(t,{})]})]},C={args:{title:"Clean Pricing",subtitle:"Simple & Clear",tiers:[{name:"Basic",price:9,period:"month",features:[{text:"Essential tools",included:!0}],cta:"Get Basic"},{name:"Pro",price:19,period:"month",features:[{text:"All tools",included:!0}],cta:"Get Pro",popular:!0},{name:"Team",price:39,period:"month",features:[{text:"Unlimited access",included:!0}],cta:"Get Team"}]},decorators:[t=>e.jsx("div",{className:"bg-white min-h-screen",children:e.jsx(t,{})})]},A={args:{title:"Mobile Optimized",subtitle:"Responsive Pricing",tiers:[{name:"Mobile",price:5,period:"month",features:[{text:"Mobile app access",included:!0},{text:"Offline mode",included:!0}],cta:"Subscribe"},{name:"Multi-Device",price:10,period:"month",features:[{text:"All devices",included:!0},{text:"Cloud sync",included:!0}],cta:"Subscribe",popular:!0},{name:"Family",price:20,period:"month",features:[{text:"Up to 5 devices",included:!0},{text:"Shared library",included:!0}],cta:"Subscribe"}]},parameters:{viewport:{defaultViewport:"mobile1"}}},E={render:()=>e.jsxs("div",{className:"space-y-16 py-8 bg-[var(--background)]",children:[e.jsx(n,{title:"Two Tiers",subtitle:"Comparison Layout",tiers:[{name:"Basic",price:10,period:"month",features:[{text:"Core features",included:!0},{text:"Email support",included:!0}],cta:"Get Basic"},{name:"Pro",price:20,period:"month",features:[{text:"All features",included:!0},{text:"Priority support",included:!0}],cta:"Get Pro",popular:!0}]}),e.jsx("div",{className:"border-t border-[var(--border)]"}),e.jsx(n,{title:"Three Tiers",subtitle:"Standard Layout",tiers:[{name:"Basic",price:10,period:"month",features:[{text:"Basic features",included:!0}],cta:"Start"},{name:"Pro",price:20,period:"month",features:[{text:"Pro features",included:!0}],cta:"Upgrade",popular:!0},{name:"Enterprise",price:50,period:"month",features:[{text:"All features",included:!0}],cta:"Contact"}]}),e.jsx("div",{className:"border-t border-[var(--border)]"}),e.jsx(n,{title:"Four Tiers",subtitle:"Extended Layout",tiers:[{name:"Free",price:0,period:"forever",features:[{text:"Limited",included:!0}],cta:"Start Free"},{name:"Basic",price:10,period:"month",features:[{text:"Standard",included:!0}],cta:"Subscribe"},{name:"Pro",price:20,period:"month",features:[{text:"Advanced",included:!0}],cta:"Subscribe",popular:!0},{name:"Team",price:50,period:"month",features:[{text:"Unlimited",included:!0}],cta:"Subscribe"}]})]})},w={args:{title:"Pricing Plans",subtitle:"Choose the Right Plan for Your Team",tiers:[{id:"1",name:"Starter",description:"Perfect for individuals",price:12,currency:"€",period:"month",features:[{text:"Up to 3 projects",included:!0},{text:"5GB storage",included:!0},{text:"Basic analytics",included:!0},{text:"Email support",included:!0},{text:"Advanced features",included:!1},{text:"Priority support",included:!1}],cta:"Get Started"},{id:"2",name:"Business",description:"For growing teams",price:49,currency:"€",period:"month",features:[{text:"Unlimited projects",included:!0},{text:"100GB storage",included:!0},{text:"Advanced analytics",included:!0},{text:"Priority email support",included:!0},{text:"Advanced automation",included:!0},{text:"Team collaboration",included:!0}],cta:"Start Free Trial",highlighted:!0,popular:!0},{id:"3",name:"Enterprise",description:"For large organizations",price:199,currency:"€",period:"month",features:[{text:"Everything in Business",included:!0,highlight:!0},{text:"Unlimited storage",included:!0},{text:"Custom integrations",included:!0},{text:"Dedicated account manager",included:!0},{text:"SLA guarantee",included:!0},{text:"24/7 phone support",included:!0}],cta:"Contact Sales"}]},decorators:[t=>e.jsx("div",{className:"bg-gradient-to-b from-[#0a1628] to-[#0a0a0a] min-h-screen",children:e.jsx(t,{})})]},F={args:{title:"Unlock Your Spiritual Potential",subtitle:"Membership Options",tiers:[{id:"1",name:"Journey Starter",description:"Perfect for beginners exploring meditation",price:12,currency:"€",period:"month",features:[{text:"Access to 100+ guided meditations",included:!0},{text:"Beginner courses & workshops",included:!0},{text:"Community forum access",included:!0},{text:"Monthly live Q&A sessions",included:!0},{text:"Mobile app access",included:!0},{text:"Advanced courses",included:!1},{text:"Download for offline use",included:!1},{text:"Personal coaching",included:!1}],cta:"Start Journey"},{id:"2",name:"Spiritual Seeker",description:"For dedicated practitioners deepening their practice",price:25,currency:"€",period:"month",features:[{text:"Everything in Journey Starter",included:!0,highlight:!0},{text:"Access to all 500+ meditations",included:!0},{text:"All advanced courses",included:!0},{text:"Weekly live meditation sessions",included:!0},{text:"Unlimited offline downloads",included:!0},{text:"Exclusive community groups",included:!0},{text:"Priority email support",included:!0},{text:"Monthly 1-on-1 coaching",included:!1}],cta:"Deepen Practice",highlighted:!0,popular:!0},{id:"3",name:"Enlightened Master",description:"Complete transformation with personal guidance",price:50,currency:"€",period:"month",features:[{text:"Everything in Spiritual Seeker",included:!0,highlight:!0},{text:"Teacher certification programs",included:!0},{text:"Monthly 1-on-1 coaching sessions",included:!0},{text:"Exclusive master classes",included:!0},{text:"Private mentoring group",included:!0},{text:"Free retreat attendance",included:!0},{text:"Lifetime community access",included:!0},{text:"Commercial teaching license",included:!0}],cta:"Achieve Mastery"}]},decorators:[t=>e.jsx("div",{className:"relative min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d1f3a] to-[#0a1628]",children:e.jsx(t,{})})]};var U,B,k,N,D;r.parameters={...r.parameters,docs:{...(U=r.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    title: 'Choose Your Plan',
    subtitle: 'Flexible Pricing',
    tiers: [{
      id: '1',
      name: 'Basic',
      description: 'Perfect for getting started',
      price: 9,
      currency: '€',
      period: 'month',
      features: [{
        text: 'Access to 50+ guided meditations',
        included: true
      }, {
        text: 'Community forum access',
        included: true
      }, {
        text: 'Monthly live sessions',
        included: true
      }, {
        text: 'Downloadable content',
        included: false
      }, {
        text: 'Priority support',
        included: false
      }, {
        text: 'Advanced courses',
        included: false
      }],
      cta: 'Get Started'
    }, {
      id: '2',
      name: 'Pro',
      description: 'Most popular choice',
      price: 19,
      currency: '€',
      period: 'month',
      features: [{
        text: 'Access to all 500+ meditations',
        included: true
      }, {
        text: 'Community forum access',
        included: true
      }, {
        text: 'Weekly live sessions',
        included: true
      }, {
        text: 'Unlimited downloads',
        included: true
      }, {
        text: 'Priority email support',
        included: true
      }, {
        text: 'Advanced courses',
        included: false
      }],
      cta: 'Start Free Trial',
      highlighted: true,
      popular: true
    }, {
      id: '3',
      name: 'Premium',
      description: 'For serious practitioners',
      price: 39,
      currency: '€',
      period: 'month',
      features: [{
        text: 'Everything in Pro',
        included: true,
        highlight: true
      }, {
        text: 'Daily live sessions',
        included: true
      }, {
        text: 'All advanced courses',
        included: true
      }, {
        text: '1-on-1 coaching sessions',
        included: true
      }, {
        text: 'Certification programs',
        included: true
      }, {
        text: 'Lifetime access to content',
        included: true
      }],
      cta: 'Go Premium'
    }]
  }
}`,...(k=(B=r.parameters)==null?void 0:B.docs)==null?void 0:k.source},description:{story:"Default pricing section with 3 tiers",...(D=(N=r.parameters)==null?void 0:N.docs)==null?void 0:D.description}}};var L,j,W,O,R;i.parameters={...i.parameters,docs:{...(L=i.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    title: 'Simple Pricing',
    subtitle: 'Choose What Works for You',
    tiers: [{
      id: '1',
      name: 'Free',
      description: 'Try before you commit',
      price: 0,
      currency: '€',
      period: 'forever',
      features: [{
        text: '10 guided meditations',
        included: true
      }, {
        text: 'Basic breathing exercises',
        included: true
      }, {
        text: 'Community forum (read-only)',
        included: true
      }, {
        text: 'Full content library',
        included: false
      }, {
        text: 'Live sessions',
        included: false
      }, {
        text: 'Downloads',
        included: false
      }],
      cta: 'Start Free'
    }, {
      id: '2',
      name: 'Unlimited',
      description: 'Everything you need',
      price: 15,
      currency: '€',
      period: 'month',
      features: [{
        text: 'Unlimited meditations',
        included: true
      }, {
        text: 'All breathing exercises',
        included: true
      }, {
        text: 'Community forum (full access)',
        included: true
      }, {
        text: 'Full content library',
        included: true
      }, {
        text: 'Weekly live sessions',
        included: true
      }, {
        text: 'Unlimited downloads',
        included: true
      }],
      cta: 'Upgrade Now',
      highlighted: true,
      popular: true
    }]
  }
}`,...(W=(j=i.parameters)==null?void 0:j.docs)==null?void 0:W.source},description:{story:"Two-tier pricing (comparison layout)",...(R=(O=i.parameters)==null?void 0:O.docs)==null?void 0:R.description}}};var Y,I,z,J,q;s.parameters={...s.parameters,docs:{...(Y=s.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    title: 'Plans for Everyone',
    subtitle: 'From Individual to Enterprise',
    tiers: [{
      id: '1',
      name: 'Starter',
      description: 'Individual practice',
      price: 5,
      currency: '€',
      period: 'month',
      features: [{
        text: 'Basic meditation library',
        included: true
      }, {
        text: 'Community access',
        included: true
      }, {
        text: 'Mobile app',
        included: true
      }, {
        text: 'Live sessions',
        included: false
      }],
      cta: 'Start'
    }, {
      id: '2',
      name: 'Personal',
      description: 'Dedicated practitioners',
      price: 15,
      currency: '€',
      period: 'month',
      features: [{
        text: 'Full meditation library',
        included: true
      }, {
        text: 'Community access',
        included: true
      }, {
        text: 'Mobile app',
        included: true
      }, {
        text: 'Weekly live sessions',
        included: true
      }],
      cta: 'Choose Personal',
      popular: true
    }, {
      id: '3',
      name: 'Professional',
      description: 'Teachers & coaches',
      price: 29,
      currency: '€',
      period: 'month',
      features: [{
        text: 'Everything in Personal',
        included: true
      }, {
        text: 'Certification access',
        included: true
      }, {
        text: 'Teaching resources',
        included: true
      }, {
        text: 'Daily live sessions',
        included: true
      }],
      cta: 'Go Pro',
      highlighted: true
    }, {
      id: '4',
      name: 'Enterprise',
      description: 'Organizations',
      price: 99,
      currency: '€',
      period: 'month',
      features: [{
        text: 'Everything in Professional',
        included: true
      }, {
        text: 'Unlimited team members',
        included: true
      }, {
        text: 'Custom branding',
        included: true
      }, {
        text: 'Dedicated support',
        included: true
      }],
      cta: 'Contact Sales'
    }]
  }
}`,...(z=(I=s.parameters)==null?void 0:I.docs)==null?void 0:z.source},description:{story:"Four-tier pricing (enterprise layout)",...(q=(J=s.parameters)==null?void 0:J.docs)==null?void 0:q.description}}};var _,V,H,$,K;a.parameters={...a.parameters,docs:{...(_=a.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    title: 'Save with Annual Plans',
    subtitle: '2 Months Free',
    tiers: [{
      id: '1',
      name: 'Basic',
      description: 'Save €18 per year',
      price: 90,
      currency: '€',
      period: 'year',
      features: [{
        text: '50+ guided meditations',
        included: true
      }, {
        text: 'Community forum',
        included: true
      }, {
        text: 'Monthly live sessions',
        included: true
      }, {
        text: 'Priority support',
        included: false
      }],
      cta: 'Get Started'
    }, {
      id: '2',
      name: 'Pro',
      description: 'Save €38 per year',
      price: 190,
      currency: '€',
      period: 'year',
      features: [{
        text: '500+ guided meditations',
        included: true
      }, {
        text: 'Community forum',
        included: true
      }, {
        text: 'Weekly live sessions',
        included: true
      }, {
        text: 'Priority support',
        included: true
      }],
      cta: 'Start Trial',
      highlighted: true,
      popular: true
    }, {
      id: '3',
      name: 'Premium',
      description: 'Save €78 per year',
      price: 390,
      currency: '€',
      period: 'year',
      features: [{
        text: 'All Pro features',
        included: true,
        highlight: true
      }, {
        text: 'Daily live sessions',
        included: true
      }, {
        text: '1-on-1 coaching',
        included: true
      }, {
        text: 'Certification programs',
        included: true
      }],
      cta: 'Go Premium'
    }]
  }
}`,...(H=(V=a.parameters)==null?void 0:V.docs)==null?void 0:H.source},description:{story:"Annual billing pricing (discounted)",...(K=($=a.parameters)==null?void 0:$.docs)==null?void 0:K.description}}};var Q,X,Z,ee,te;d.parameters={...d.parameters,docs:{...(Q=d.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    tiers: [{
      id: '1',
      name: 'Monthly',
      price: 15,
      period: 'month',
      features: [{
        text: 'All features included',
        included: true
      }, {
        text: 'Cancel anytime',
        included: true
      }, {
        text: 'Monthly billing',
        included: true
      }],
      cta: 'Subscribe Monthly'
    }, {
      id: '2',
      name: 'Annual',
      price: 150,
      period: 'year',
      features: [{
        text: 'All features included',
        included: true
      }, {
        text: 'Save 2 months',
        included: true,
        highlight: true
      }, {
        text: 'Annual billing',
        included: true
      }],
      cta: 'Subscribe Annually',
      highlighted: true,
      popular: true
    }]
  }
}`,...(Z=(X=d.parameters)==null?void 0:X.docs)==null?void 0:Z.source},description:{story:"No header (just pricing cards)",...(te=(ee=d.parameters)==null?void 0:ee.docs)==null?void 0:te.description}}};var ne,re,ie,se,ae;c.parameters={...c.parameters,docs:{...(ne=c.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    title: 'Membership Plans',
    tiers: [{
      name: 'Individual',
      price: 12,
      period: 'month',
      features: [{
        text: 'Personal account',
        included: true
      }, {
        text: 'Full library access',
        included: true
      }],
      cta: 'Join'
    }, {
      name: 'Family',
      price: 25,
      period: 'month',
      features: [{
        text: 'Up to 5 accounts',
        included: true
      }, {
        text: 'Full library access',
        included: true
      }],
      cta: 'Join',
      popular: true
    }, {
      name: 'Studio',
      price: 99,
      period: 'month',
      features: [{
        text: 'Unlimited accounts',
        included: true
      }, {
        text: 'Commercial license',
        included: true
      }],
      cta: 'Contact Us'
    }]
  }
}`,...(ie=(re=c.parameters)==null?void 0:re.docs)==null?void 0:ie.source},description:{story:"Title only (no subtitle)",...(ae=(se=c.parameters)==null?void 0:se.docs)==null?void 0:ae.description}}};var de,ce,ue,oe,le;u.parameters={...u.parameters,docs:{...(de=u.parameters)==null?void 0:de.docs,source:{originalSource:`{
  args: {
    title: 'Learning Plans for Every Child',
    subtitle: 'Kids Ascension',
    tiers: [{
      id: '1',
      name: 'Explorer',
      description: 'Ages 4-7',
      price: 8,
      currency: '€',
      period: 'month',
      features: [{
        text: '50+ age-appropriate lessons',
        included: true
      }, {
        text: 'Interactive games',
        included: true
      }, {
        text: 'Progress tracking',
        included: true
      }, {
        text: 'Parental controls',
        included: true
      }, {
        text: 'Advanced courses',
        included: false
      }, {
        text: 'Live tutoring',
        included: false
      }],
      cta: 'Start Learning'
    }, {
      id: '2',
      name: 'Scholar',
      description: 'Ages 8-12',
      price: 12,
      currency: '€',
      period: 'month',
      features: [{
        text: '200+ comprehensive lessons',
        included: true
      }, {
        text: 'Interactive projects',
        included: true
      }, {
        text: 'Detailed analytics',
        included: true
      }, {
        text: 'Parental dashboard',
        included: true
      }, {
        text: 'Advanced STEM courses',
        included: true
      }, {
        text: 'Monthly group sessions',
        included: true
      }],
      cta: 'Enroll Now',
      highlighted: true,
      popular: true
    }, {
      id: '3',
      name: 'Academy',
      description: 'Ages 13+',
      price: 18,
      currency: '€',
      period: 'month',
      features: [{
        text: 'All Scholar features',
        included: true,
        highlight: true
      }, {
        text: 'University prep courses',
        included: true
      }, {
        text: 'Career guidance',
        included: true
      }, {
        text: 'Weekly live tutoring',
        included: true
      }, {
        text: 'Certificate programs',
        included: true
      }, {
        text: 'College application support',
        included: true
      }],
      cta: 'Get Started'
    }]
  }
}`,...(ue=(ce=u.parameters)==null?void 0:ce.docs)==null?void 0:ue.source},description:{story:"Kids Ascension educational pricing",...(le=(oe=u.parameters)==null?void 0:oe.docs)==null?void 0:le.description}}};var pe,me,xe,he,ge;o.parameters={...o.parameters,docs:{...(pe=o.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  args: {
    title: 'Transform Your Consciousness',
    subtitle: 'Spiritual Growth Memberships',
    tiers: [{
      id: '1',
      name: 'Seeker',
      description: 'Begin your journey',
      price: 10,
      currency: '€',
      period: 'month',
      features: [{
        text: 'Foundational courses',
        included: true
      }, {
        text: 'Guided meditations',
        included: true
      }, {
        text: 'Community forums',
        included: true
      }, {
        text: 'Monthly workshops',
        included: true
      }, {
        text: 'Advanced teachings',
        included: false
      }, {
        text: 'Personal mentoring',
        included: false
      }],
      cta: 'Begin Journey'
    }, {
      id: '2',
      name: 'Practitioner',
      description: 'Deepen your practice',
      price: 25,
      currency: '€',
      period: 'month',
      features: [{
        text: 'All Seeker features',
        included: true
      }, {
        text: 'Advanced courses',
        included: true
      }, {
        text: 'Weekly live sessions',
        included: true
      }, {
        text: 'Energy work training',
        included: true
      }, {
        text: 'Retreat discounts',
        included: true
      }, {
        text: 'Personal mentoring',
        included: false
      }],
      cta: 'Level Up',
      highlighted: true,
      popular: true
    }, {
      id: '3',
      name: 'Master',
      description: 'Complete transformation',
      price: 50,
      currency: '€',
      period: 'month',
      features: [{
        text: 'All Practitioner features',
        included: true,
        highlight: true
      }, {
        text: 'Teacher certification path',
        included: true
      }, {
        text: 'Private mentoring sessions',
        included: true
      }, {
        text: 'Exclusive master classes',
        included: true
      }, {
        text: 'Free retreat attendance',
        included: true
      }, {
        text: 'Lifetime community access',
        included: true
      }],
      cta: 'Ascend Now'
    }]
  }
}`,...(xe=(me=o.parameters)==null?void 0:me.docs)==null?void 0:xe.source},description:{story:"Ozean Licht spiritual courses pricing",...(ge=(he=o.parameters)==null?void 0:he.docs)==null?void 0:ge.description}}};var fe,ye,ve,be,Se;l.parameters={...l.parameters,docs:{...(fe=l.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  args: {
    title: 'Most Choose Pro',
    subtitle: 'Recommended',
    tiers: [{
      name: 'Basic',
      price: 9,
      period: 'month',
      features: [{
        text: 'Essential features',
        included: true
      }, {
        text: 'Email support',
        included: true
      }, {
        text: 'Advanced tools',
        included: false
      }],
      cta: 'Get Basic'
    }, {
      name: 'Pro',
      description: 'Best value for most users',
      price: 19,
      period: 'month',
      features: [{
        text: 'All Basic features',
        included: true,
        highlight: true
      }, {
        text: 'Priority support',
        included: true
      }, {
        text: 'Advanced tools',
        included: true
      }],
      cta: 'Get Pro',
      highlighted: true,
      popular: true
    }, {
      name: 'Enterprise',
      price: 49,
      period: 'month',
      features: [{
        text: 'All Pro features',
        included: true
      }, {
        text: 'Dedicated support',
        included: true
      }, {
        text: 'Custom integrations',
        included: true
      }],
      cta: 'Contact Sales'
    }]
  }
}`,...(ve=(ye=l.parameters)==null?void 0:ye.docs)==null?void 0:ve.source},description:{story:"Highlighted featured tier (middle tier emphasized)",...(Se=(be=l.parameters)==null?void 0:be.docs)==null?void 0:Se.description}}};var Pe,Ce,Ae,Ee,we;p.parameters={...p.parameters,docs:{...(Pe=p.parameters)==null?void 0:Pe.docs,source:{originalSource:`{
  args: {
    title: 'Global Pricing',
    subtitle: 'USD Rates',
    tiers: [{
      name: 'Basic',
      price: 10,
      currency: '$',
      period: 'month',
      features: [{
        text: 'Core features',
        included: true
      }, {
        text: 'Community support',
        included: true
      }],
      cta: 'Subscribe'
    }, {
      name: 'Pro',
      price: 20,
      currency: '$',
      period: 'month',
      features: [{
        text: 'All features',
        included: true
      }, {
        text: 'Priority support',
        included: true
      }],
      cta: 'Subscribe',
      popular: true
    }, {
      name: 'Team',
      price: 50,
      currency: '$',
      period: 'month',
      features: [{
        text: 'Everything in Pro',
        included: true
      }, {
        text: 'Team management',
        included: true
      }],
      cta: 'Subscribe'
    }]
  }
}`,...(Ae=(Ce=p.parameters)==null?void 0:Ce.docs)==null?void 0:Ae.source},description:{story:"Different currencies (USD example)",...(we=(Ee=p.parameters)==null?void 0:Ee.docs)==null?void 0:we.description}}};var Fe,Te,Me,Ge,Ue;m.parameters={...m.parameters,docs:{...(Fe=m.parameters)==null?void 0:Fe.docs,source:{originalSource:`{
  args: {
    title: 'Flexible Options',
    subtitle: 'Your Choice',
    tiers: [{
      name: 'Free Trial',
      price: 0,
      period: '14 days',
      features: [{
        text: 'Full access trial',
        included: true
      }, {
        text: 'No credit card required',
        included: true
      }],
      cta: 'Start Free Trial'
    }, {
      name: 'Monthly',
      price: 15,
      period: 'month',
      features: [{
        text: 'All features',
        included: true
      }, {
        text: 'Cancel anytime',
        included: true
      }],
      cta: 'Subscribe Now',
      popular: true
    }, {
      name: 'Lifetime',
      price: 299,
      period: 'one-time',
      features: [{
        text: 'All features forever',
        included: true
      }, {
        text: 'Free updates',
        included: true
      }],
      cta: 'Buy Lifetime Access'
    }]
  }
}`,...(Me=(Te=m.parameters)==null?void 0:Te.docs)==null?void 0:Me.source},description:{story:"Custom CTA text per tier",...(Ue=(Ge=m.parameters)==null?void 0:Ge.docs)==null?void 0:Ue.description}}};var Be,ke,Ne,De,Le;x.parameters={...x.parameters,docs:{...(Be=x.parameters)==null?void 0:Be.docs,source:{originalSource:`{
  args: {
    title: 'Compare Features',
    subtitle: 'Find Your Perfect Fit',
    tiers: [{
      name: 'Starter',
      price: 10,
      period: 'month',
      features: [{
        text: 'Basic meditations',
        included: true
      }, {
        text: 'Community access',
        included: true
      }, {
        text: 'Live sessions',
        included: false
      }, {
        text: 'Downloads',
        included: false
      }, {
        text: 'Coaching',
        included: false
      }],
      cta: 'Get Started'
    }, {
      name: 'Growth',
      price: 20,
      period: 'month',
      features: [{
        text: 'All meditations',
        included: true
      }, {
        text: 'Community access',
        included: true
      }, {
        text: '4 live sessions/month',
        included: true,
        highlight: true
      }, {
        text: 'Unlimited downloads',
        included: true,
        highlight: true
      }, {
        text: 'Coaching',
        included: false
      }],
      cta: 'Choose Growth',
      popular: true
    }, {
      name: 'Transformation',
      price: 40,
      period: 'month',
      features: [{
        text: 'Everything in Growth',
        included: true
      }, {
        text: 'Premium community',
        included: true
      }, {
        text: 'Unlimited live sessions',
        included: true,
        highlight: true
      }, {
        text: 'Priority downloads',
        included: true
      }, {
        text: 'Monthly 1-on-1 coaching',
        included: true,
        highlight: true
      }],
      cta: 'Transform Now',
      highlighted: true
    }]
  }
}`,...(Ne=(ke=x.parameters)==null?void 0:ke.docs)==null?void 0:Ne.source},description:{story:"Feature highlights (emphasized features)",...(Le=(De=x.parameters)==null?void 0:De.docs)==null?void 0:Le.description}}};var je,We,Oe,Re,Ye;h.parameters={...h.parameters,docs:{...(je=h.parameters)==null?void 0:je.docs,source:{originalSource:`{
  args: {
    title: 'Simple & Clear',
    subtitle: 'No Hidden Fees',
    tiers: [{
      name: 'Personal',
      price: 12,
      period: 'month',
      features: [{
        text: 'Full content access',
        included: true
      }, {
        text: '24/7 support',
        included: true
      }],
      cta: 'Get Personal'
    }, {
      name: 'Team',
      price: 35,
      period: 'month',
      features: [{
        text: 'Everything in Personal',
        included: true
      }, {
        text: 'Team collaboration',
        included: true
      }],
      cta: 'Get Team',
      popular: true
    }]
  }
}`,...(Oe=(We=h.parameters)==null?void 0:We.docs)==null?void 0:Oe.source},description:{story:"Minimal features (short feature lists)",...(Ye=(Re=h.parameters)==null?void 0:Re.docs)==null?void 0:Ye.description}}};var Ie,ze,Je,qe,_e;g.parameters={...g.parameters,docs:{...(Ie=g.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  args: {
    title: 'Comprehensive Plans',
    subtitle: 'Everything You Need',
    tiers: [{
      name: 'Complete',
      price: 29,
      period: 'month',
      features: [{
        text: 'Unlimited guided meditations',
        included: true
      }, {
        text: 'All breathing exercises',
        included: true
      }, {
        text: 'Full course library',
        included: true
      }, {
        text: 'Community forum access',
        included: true
      }, {
        text: 'Weekly live sessions',
        included: true
      }, {
        text: 'Unlimited downloads',
        included: true
      }, {
        text: 'Mobile & desktop apps',
        included: true
      }, {
        text: 'Progress tracking',
        included: true
      }, {
        text: 'Email support',
        included: true
      }, {
        text: 'Monthly challenges',
        included: true
      }],
      cta: 'Get Everything',
      popular: true
    }]
  }
}`,...(Je=(ze=g.parameters)==null?void 0:ze.docs)==null?void 0:Je.source},description:{story:"Extensive features (long feature lists)",...(_e=(qe=g.parameters)==null?void 0:qe.docs)==null?void 0:_e.description}}};var Ve,He,$e,Ke,Qe;f.parameters={...f.parameters,docs:{...(Ve=f.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
  args: {
    title: 'Enterprise Solutions',
    subtitle: 'Custom Pricing',
    tiers: [{
      name: 'Pro',
      price: 25,
      period: 'month',
      features: [{
        text: 'All premium features',
        included: true
      }, {
        text: 'Up to 10 users',
        included: true
      }, {
        text: 'Priority support',
        included: true
      }],
      cta: 'Get Pro'
    }, {
      name: 'Enterprise',
      description: 'Custom solutions for large teams',
      price: 0,
      currency: '',
      period: 'custom',
      features: [{
        text: 'Everything in Pro',
        included: true
      }, {
        text: 'Unlimited users',
        included: true
      }, {
        text: 'Custom integrations',
        included: true
      }, {
        text: 'Dedicated account manager',
        included: true
      }, {
        text: 'SLA guarantee',
        included: true
      }, {
        text: 'Custom branding',
        included: true
      }],
      cta: 'Contact Sales',
      highlighted: true
    }]
  }
}`,...($e=(He=f.parameters)==null?void 0:He.docs)==null?void 0:$e.source},description:{story:"Contact sales tier (enterprise)",...(Qe=(Ke=f.parameters)==null?void 0:Ke.docs)==null?void 0:Qe.description}}};var Xe,Ze,et,tt,nt;y.parameters={...y.parameters,docs:{...(Xe=y.parameters)==null?void 0:Xe.docs,source:{originalSource:`{
  args: {
    title: 'One Simple Plan',
    subtitle: 'All-Inclusive',
    tiers: [{
      name: 'All Access',
      description: 'Everything included',
      price: 19,
      period: 'month',
      features: [{
        text: 'Unlimited content access',
        included: true
      }, {
        text: 'All courses & workshops',
        included: true
      }, {
        text: 'Live sessions',
        included: true
      }, {
        text: 'Community access',
        included: true
      }, {
        text: 'Priority support',
        included: true
      }, {
        text: 'Mobile apps',
        included: true
      }],
      cta: 'Get Started',
      highlighted: true
    }]
  }
}`,...(et=(Ze=y.parameters)==null?void 0:Ze.docs)==null?void 0:et.source},description:{story:"Single tier (one option only)",...(nt=(tt=y.parameters)==null?void 0:tt.docs)==null?void 0:nt.description}}};var rt,it,st,at,dt;v.parameters={...v.parameters,docs:{...(rt=v.parameters)==null?void 0:rt.docs,source:{originalSource:`{
  args: {
    title: 'Custom Layout',
    subtitle: 'Extended Spacing',
    tiers: [{
      name: 'Standard',
      price: 15,
      period: 'month',
      features: [{
        text: 'All features',
        included: true
      }],
      cta: 'Subscribe'
    }, {
      name: 'Premium',
      price: 30,
      period: 'month',
      features: [{
        text: 'Everything + extras',
        included: true
      }],
      cta: 'Upgrade',
      popular: true
    }],
    className: 'py-20'
  }
}`,...(st=(it=v.parameters)==null?void 0:it.docs)==null?void 0:st.source},description:{story:"Custom styling with extended padding",...(dt=(at=v.parameters)==null?void 0:at.docs)==null?void 0:dt.description}}};var ct,ut,ot,lt,pt;b.parameters={...b.parameters,docs:{...(ct=b.parameters)==null?void 0:ct.docs,source:{originalSource:`{
  args: {
    title: 'Cosmic Pricing',
    subtitle: 'Choose Your Path',
    tiers: [{
      name: 'Novice',
      description: 'Start your cosmic journey',
      price: 12,
      period: 'month',
      features: [{
        text: 'Basic cosmic teachings',
        included: true
      }, {
        text: 'Meditation library',
        included: true
      }, {
        text: 'Community forums',
        included: true
      }],
      cta: 'Begin'
    }, {
      name: 'Adept',
      description: 'Deepen your practice',
      price: 24,
      period: 'month',
      features: [{
        text: 'Advanced cosmic wisdom',
        included: true
      }, {
        text: 'Full meditation access',
        included: true
      }, {
        text: 'Live sessions',
        included: true
      }],
      cta: 'Ascend',
      highlighted: true,
      popular: true
    }, {
      name: 'Master',
      description: 'Achieve enlightenment',
      price: 48,
      period: 'month',
      features: [{
        text: 'All cosmic knowledge',
        included: true
      }, {
        text: 'Personal guidance',
        included: true
      }, {
        text: 'Exclusive teachings',
        included: true
      }],
      cta: 'Transcend'
    }]
  },
  decorators: [Story => <div className="relative min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d1f3a] to-[#0a1628]">
        <Story />
      </div>]
}`,...(ot=(ut=b.parameters)==null?void 0:ut.docs)==null?void 0:ot.source},description:{story:"Cosmic dark theme showcase",...(pt=(lt=b.parameters)==null?void 0:lt.docs)==null?void 0:pt.description}}};var mt,xt,ht,gt,ft;S.parameters={...S.parameters,docs:{...(mt=S.parameters)==null?void 0:mt.docs,source:{originalSource:`{
  args: {
    title: 'Modern Design',
    subtitle: 'Glass Effect',
    tiers: [{
      name: 'Essential',
      price: 10,
      period: 'month',
      features: [{
        text: 'Core features',
        included: true
      }, {
        text: 'Standard support',
        included: true
      }],
      cta: 'Get Essential'
    }, {
      name: 'Professional',
      price: 25,
      period: 'month',
      features: [{
        text: 'All features',
        included: true
      }, {
        text: 'Priority support',
        included: true
      }],
      cta: 'Go Pro',
      popular: true
    }, {
      name: 'Ultimate',
      price: 50,
      period: 'month',
      features: [{
        text: 'Everything',
        included: true
      }, {
        text: 'White-glove support',
        included: true
      }],
      cta: 'Get Ultimate'
    }]
  },
  decorators: [Story => <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d1f3a] to-[#0a1628] p-8">
        <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-8">
          <Story />
        </div>
      </div>]
}`,...(ht=(xt=S.parameters)==null?void 0:xt.docs)==null?void 0:ht.source},description:{story:"Glass morphism effect",...(ft=(gt=S.parameters)==null?void 0:gt.docs)==null?void 0:ft.description}}};var yt,vt,bt,St,Pt;P.parameters={...P.parameters,docs:{...(yt=P.parameters)==null?void 0:yt.docs,source:{originalSource:`{
  args: {
    title: 'Ozean Licht Memberships',
    subtitle: 'Signature Branding',
    tiers: [{
      name: 'Wave',
      description: 'Ride the gentle waves',
      price: 15,
      period: 'month',
      features: [{
        text: 'Foundational teachings',
        included: true
      }, {
        text: 'Calm & clarity',
        included: true
      }],
      cta: 'Ride Wave'
    }, {
      name: 'Ocean',
      description: 'Dive into depths',
      price: 30,
      period: 'month',
      features: [{
        text: 'Deep teachings',
        included: true
      }, {
        text: 'Transformation',
        included: true
      }],
      cta: 'Dive Deep',
      highlighted: true,
      popular: true
    }, {
      name: 'Light',
      description: 'Illuminate your path',
      price: 60,
      period: 'month',
      features: [{
        text: 'Complete wisdom',
        included: true
      }, {
        text: 'Full enlightenment',
        included: true
      }],
      cta: 'Find Light'
    }]
  },
  decorators: [Story => <div className="relative min-h-screen bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0ec2bc]/10 via-transparent to-[#0ec2bc]/10 pointer-events-none" />
        <Story />
      </div>]
}`,...(bt=(vt=P.parameters)==null?void 0:vt.docs)==null?void 0:bt.source},description:{story:"Turquoise accent (Ozean Licht branding)",...(Pt=(St=P.parameters)==null?void 0:St.docs)==null?void 0:Pt.description}}};var Ct,At,Et,wt,Ft;C.parameters={...C.parameters,docs:{...(Ct=C.parameters)==null?void 0:Ct.docs,source:{originalSource:`{
  args: {
    title: 'Clean Pricing',
    subtitle: 'Simple & Clear',
    tiers: [{
      name: 'Basic',
      price: 9,
      period: 'month',
      features: [{
        text: 'Essential tools',
        included: true
      }],
      cta: 'Get Basic'
    }, {
      name: 'Pro',
      price: 19,
      period: 'month',
      features: [{
        text: 'All tools',
        included: true
      }],
      cta: 'Get Pro',
      popular: true
    }, {
      name: 'Team',
      price: 39,
      period: 'month',
      features: [{
        text: 'Unlimited access',
        included: true
      }],
      cta: 'Get Team'
    }]
  },
  decorators: [Story => <div className="bg-white min-h-screen">
        <Story />
      </div>]
}`,...(Et=(At=C.parameters)==null?void 0:At.docs)==null?void 0:Et.source},description:{story:"Light background variant",...(Ft=(wt=C.parameters)==null?void 0:wt.docs)==null?void 0:Ft.description}}};var Tt,Mt,Gt,Ut,Bt;A.parameters={...A.parameters,docs:{...(Tt=A.parameters)==null?void 0:Tt.docs,source:{originalSource:`{
  args: {
    title: 'Mobile Optimized',
    subtitle: 'Responsive Pricing',
    tiers: [{
      name: 'Mobile',
      price: 5,
      period: 'month',
      features: [{
        text: 'Mobile app access',
        included: true
      }, {
        text: 'Offline mode',
        included: true
      }],
      cta: 'Subscribe'
    }, {
      name: 'Multi-Device',
      price: 10,
      period: 'month',
      features: [{
        text: 'All devices',
        included: true
      }, {
        text: 'Cloud sync',
        included: true
      }],
      cta: 'Subscribe',
      popular: true
    }, {
      name: 'Family',
      price: 20,
      period: 'month',
      features: [{
        text: 'Up to 5 devices',
        included: true
      }, {
        text: 'Shared library',
        included: true
      }],
      cta: 'Subscribe'
    }]
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
}`,...(Gt=(Mt=A.parameters)==null?void 0:Mt.docs)==null?void 0:Gt.source},description:{story:"Responsive mobile view",...(Bt=(Ut=A.parameters)==null?void 0:Ut.docs)==null?void 0:Bt.description}}};var kt,Nt,Dt,Lt,jt;E.parameters={...E.parameters,docs:{...(kt=E.parameters)==null?void 0:kt.docs,source:{originalSource:`{
  render: () => <div className="space-y-16 py-8 bg-[var(--background)]">
      <PricingSection title="Two Tiers" subtitle="Comparison Layout" tiers={[{
      name: 'Basic',
      price: 10,
      period: 'month',
      features: [{
        text: 'Core features',
        included: true
      }, {
        text: 'Email support',
        included: true
      }],
      cta: 'Get Basic'
    }, {
      name: 'Pro',
      price: 20,
      period: 'month',
      features: [{
        text: 'All features',
        included: true
      }, {
        text: 'Priority support',
        included: true
      }],
      cta: 'Get Pro',
      popular: true
    }]} />

      <div className="border-t border-[var(--border)]" />

      <PricingSection title="Three Tiers" subtitle="Standard Layout" tiers={[{
      name: 'Basic',
      price: 10,
      period: 'month',
      features: [{
        text: 'Basic features',
        included: true
      }],
      cta: 'Start'
    }, {
      name: 'Pro',
      price: 20,
      period: 'month',
      features: [{
        text: 'Pro features',
        included: true
      }],
      cta: 'Upgrade',
      popular: true
    }, {
      name: 'Enterprise',
      price: 50,
      period: 'month',
      features: [{
        text: 'All features',
        included: true
      }],
      cta: 'Contact'
    }]} />

      <div className="border-t border-[var(--border)]" />

      <PricingSection title="Four Tiers" subtitle="Extended Layout" tiers={[{
      name: 'Free',
      price: 0,
      period: 'forever',
      features: [{
        text: 'Limited',
        included: true
      }],
      cta: 'Start Free'
    }, {
      name: 'Basic',
      price: 10,
      period: 'month',
      features: [{
        text: 'Standard',
        included: true
      }],
      cta: 'Subscribe'
    }, {
      name: 'Pro',
      price: 20,
      period: 'month',
      features: [{
        text: 'Advanced',
        included: true
      }],
      cta: 'Subscribe',
      popular: true
    }, {
      name: 'Team',
      price: 50,
      period: 'month',
      features: [{
        text: 'Unlimited',
        included: true
      }],
      cta: 'Subscribe'
    }]} />
    </div>
}`,...(Dt=(Nt=E.parameters)==null?void 0:Nt.docs)==null?void 0:Dt.source},description:{story:"Showcase all tier configurations",...(jt=(Lt=E.parameters)==null?void 0:Lt.docs)==null?void 0:jt.description}}};var Wt,Ot,Rt,Yt,It;w.parameters={...w.parameters,docs:{...(Wt=w.parameters)==null?void 0:Wt.docs,source:{originalSource:`{
  args: {
    title: 'Pricing Plans',
    subtitle: 'Choose the Right Plan for Your Team',
    tiers: [{
      id: '1',
      name: 'Starter',
      description: 'Perfect for individuals',
      price: 12,
      currency: '€',
      period: 'month',
      features: [{
        text: 'Up to 3 projects',
        included: true
      }, {
        text: '5GB storage',
        included: true
      }, {
        text: 'Basic analytics',
        included: true
      }, {
        text: 'Email support',
        included: true
      }, {
        text: 'Advanced features',
        included: false
      }, {
        text: 'Priority support',
        included: false
      }],
      cta: 'Get Started'
    }, {
      id: '2',
      name: 'Business',
      description: 'For growing teams',
      price: 49,
      currency: '€',
      period: 'month',
      features: [{
        text: 'Unlimited projects',
        included: true
      }, {
        text: '100GB storage',
        included: true
      }, {
        text: 'Advanced analytics',
        included: true
      }, {
        text: 'Priority email support',
        included: true
      }, {
        text: 'Advanced automation',
        included: true
      }, {
        text: 'Team collaboration',
        included: true
      }],
      cta: 'Start Free Trial',
      highlighted: true,
      popular: true
    }, {
      id: '3',
      name: 'Enterprise',
      description: 'For large organizations',
      price: 199,
      currency: '€',
      period: 'month',
      features: [{
        text: 'Everything in Business',
        included: true,
        highlight: true
      }, {
        text: 'Unlimited storage',
        included: true
      }, {
        text: 'Custom integrations',
        included: true
      }, {
        text: 'Dedicated account manager',
        included: true
      }, {
        text: 'SLA guarantee',
        included: true
      }, {
        text: '24/7 phone support',
        included: true
      }],
      cta: 'Contact Sales'
    }]
  },
  decorators: [Story => <div className="bg-gradient-to-b from-[#0a1628] to-[#0a0a0a] min-h-screen">
        <Story />
      </div>]
}`,...(Rt=(Ot=w.parameters)==null?void 0:Ot.docs)==null?void 0:Rt.source},description:{story:"Real-world example: SaaS pricing page",...(It=(Yt=w.parameters)==null?void 0:Yt.docs)==null?void 0:It.description}}};var zt,Jt,qt,_t,Vt;F.parameters={...F.parameters,docs:{...(zt=F.parameters)==null?void 0:zt.docs,source:{originalSource:`{
  args: {
    title: 'Unlock Your Spiritual Potential',
    subtitle: 'Membership Options',
    tiers: [{
      id: '1',
      name: 'Journey Starter',
      description: 'Perfect for beginners exploring meditation',
      price: 12,
      currency: '€',
      period: 'month',
      features: [{
        text: 'Access to 100+ guided meditations',
        included: true
      }, {
        text: 'Beginner courses & workshops',
        included: true
      }, {
        text: 'Community forum access',
        included: true
      }, {
        text: 'Monthly live Q&A sessions',
        included: true
      }, {
        text: 'Mobile app access',
        included: true
      }, {
        text: 'Advanced courses',
        included: false
      }, {
        text: 'Download for offline use',
        included: false
      }, {
        text: 'Personal coaching',
        included: false
      }],
      cta: 'Start Journey'
    }, {
      id: '2',
      name: 'Spiritual Seeker',
      description: 'For dedicated practitioners deepening their practice',
      price: 25,
      currency: '€',
      period: 'month',
      features: [{
        text: 'Everything in Journey Starter',
        included: true,
        highlight: true
      }, {
        text: 'Access to all 500+ meditations',
        included: true
      }, {
        text: 'All advanced courses',
        included: true
      }, {
        text: 'Weekly live meditation sessions',
        included: true
      }, {
        text: 'Unlimited offline downloads',
        included: true
      }, {
        text: 'Exclusive community groups',
        included: true
      }, {
        text: 'Priority email support',
        included: true
      }, {
        text: 'Monthly 1-on-1 coaching',
        included: false
      }],
      cta: 'Deepen Practice',
      highlighted: true,
      popular: true
    }, {
      id: '3',
      name: 'Enlightened Master',
      description: 'Complete transformation with personal guidance',
      price: 50,
      currency: '€',
      period: 'month',
      features: [{
        text: 'Everything in Spiritual Seeker',
        included: true,
        highlight: true
      }, {
        text: 'Teacher certification programs',
        included: true
      }, {
        text: 'Monthly 1-on-1 coaching sessions',
        included: true
      }, {
        text: 'Exclusive master classes',
        included: true
      }, {
        text: 'Private mentoring group',
        included: true
      }, {
        text: 'Free retreat attendance',
        included: true
      }, {
        text: 'Lifetime community access',
        included: true
      }, {
        text: 'Commercial teaching license',
        included: true
      }],
      cta: 'Achieve Mastery'
    }]
  },
  decorators: [Story => <div className="relative min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d1f3a] to-[#0a1628]">
        <Story />
      </div>]
}`,...(qt=(Jt=F.parameters)==null?void 0:Jt.docs)==null?void 0:qt.source},description:{story:"Complete example with all features",...(Vt=(_t=F.parameters)==null?void 0:_t.docs)==null?void 0:Vt.description}}};const vn=["Default","TwoTiers","FourTiers","AnnualBilling","NoHeader","TitleOnly","KidsAscension","OzeanLicht","FeaturedTier","USDPricing","CustomCTAs","FeatureHighlights","MinimalFeatures","ExtensiveFeatures","ContactSales","SingleTier","CustomStyled","CosmicTheme","GlassMorphism","TurquoiseAccent","LightBackground","ResponsiveDemo","AllVariants","SaaSPricingPage","CompleteExample"];export{E as AllVariants,a as AnnualBilling,F as CompleteExample,f as ContactSales,b as CosmicTheme,m as CustomCTAs,v as CustomStyled,r as Default,g as ExtensiveFeatures,x as FeatureHighlights,l as FeaturedTier,s as FourTiers,S as GlassMorphism,u as KidsAscension,C as LightBackground,h as MinimalFeatures,d as NoHeader,o as OzeanLicht,A as ResponsiveDemo,w as SaaSPricingPage,y as SingleTier,c as TitleOnly,P as TurquoiseAccent,i as TwoTiers,p as USDPricing,vn as __namedExportsOrder,yn as default};
