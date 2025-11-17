import{j as t}from"./jsx-runtime-DF2Pcvd1.js";import{C as d}from"./CTASection-hXkRalZo.js";import"./index-B2-qRKKC.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./Button-Clfx5zjS.js";import"./index-DVF2XGCm.js";import"./cn-CytzSlOG.js";import"./button-C8qtCU0L.js";import"./index-BiMR7eR1.js";import"./index-BFjtS4uE.js";import"./Badge-BblwO-Dx.js";import"./arrow-right-2p1MOGVp.js";import"./createLucideIcon-BbF4D6Jl.js";const D4={title:"Tier 3: Compositions/Sections/CTASection",component:d,parameters:{layout:"fullscreen",docs:{description:{component:"Call-to-action section composition with video backgrounds, tags, and social links. Features Ozean Licht branding with glass morphism effects."}}},tags:["autodocs"],argTypes:{title:{control:"text",description:"Main heading text displayed prominently"},subtitle:{control:"text",description:"Optional subtitle displayed as a badge above the title"},tags:{control:"object",description:"Array of tag strings displayed as pills below the title"},ctaText:{control:"text",description:"Text for the call-to-action button"},ctaHref:{control:"text",description:"URL for the CTA button (if provided, button becomes a link)"},onCTAClick:{action:"clicked",description:"Click handler for the CTA button (used when ctaHref is not provided)"},videoSources:{control:"object",description:"Responsive video backgrounds for desktop, tablet, and mobile"},socialLinks:{control:"object",description:"Array of social media links with icons"},className:{control:"text",description:"Additional CSS classes for custom styling"}}},e={args:{title:"Start Your Journey Today",subtitle:"Join Us",ctaText:"Get Started",ctaHref:"/register"}},r={args:{title:"Transform Your Life with Ozean Licht",subtitle:"Discover Inner Peace",tags:["Meditation","Yoga","Mindfulness","Spiritual Growth"],ctaText:"Begin Your Journey",ctaHref:"/courses"}},a={args:{title:"Ready to Get Started?",subtitle:"Free Trial Available",tags:["No Credit Card Required","14-Day Trial","Cancel Anytime"],ctaText:"Start Free Trial",onCTAClick:()=>alert("CTA button clicked!")}},s={args:{title:"Connect with Ozean Licht Community",subtitle:"Follow Our Journey",ctaText:"Join Community",ctaHref:"/community",socialLinks:[{name:"Facebook",url:"https://facebook.com/ozeanlicht",icon:t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"w-4 h-4",children:t.jsx("path",{d:"M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"})}),iconBg:"bg-[#1877F2]"},{name:"Instagram",url:"https://instagram.com/ozeanlicht",icon:t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"w-4 h-4",children:t.jsx("path",{d:"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"})}),iconBg:"bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]"},{name:"YouTube",url:"https://youtube.com/@ozeanlicht",icon:t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"w-4 h-4",children:t.jsx("path",{d:"M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"})}),iconBg:"bg-[#FF0000]"}]}},o={args:{title:"Join the Ozean Licht Community Today",subtitle:"Special Launch Offer",tags:["Meditation Courses","Live Sessions","Community Support","Expert Guidance"],ctaText:"Start Your Journey",ctaHref:"/register",socialLinks:[{name:"Facebook",url:"https://facebook.com/ozeanlicht",icon:t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"w-4 h-4",children:t.jsx("path",{d:"M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"})}),iconBg:"bg-[#1877F2]"},{name:"Instagram",url:"https://instagram.com/ozeanlicht",icon:t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"w-4 h-4",children:t.jsx("path",{d:"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"})}),iconBg:"bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]"}]}},i={args:{title:"Ready to Begin?",ctaText:"Get Started",ctaHref:"/start"}},c={args:{title:"Embark on a Transformative Journey Toward Inner Peace, Spiritual Growth, and Holistic Wellness",subtitle:"Your Path to Enlightenment",tags:["Meditation","Mindfulness","Yoga","Energy Work","Spiritual Coaching"],ctaText:"Start Transformation",ctaHref:"/transform"}},n={args:{title:"Special Offer",subtitle:"Limited Time",tags:["50% Off","First Month Free","No Commitment"],ctaText:"Claim Offer",ctaHref:"/offer",className:"bg-gradient-to-br from-[var(--primary)]/10 to-[var(--secondary)]/10"}},l={args:{title:"Be Part of Something Bigger",subtitle:"Join 10,000+ Members",tags:["Global Community","Live Events","Expert Teachers","24/7 Support"],ctaText:"Join Community",ctaHref:"/community",socialLinks:[{name:"Facebook",url:"https://facebook.com/ozeanlicht",icon:t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"w-4 h-4",children:t.jsx("path",{d:"M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"})}),iconBg:"bg-[#1877F2]"},{name:"Instagram",url:"https://instagram.com/ozeanlicht",icon:t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"w-4 h-4",children:t.jsx("path",{d:"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"})}),iconBg:"bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]"},{name:"YouTube",url:"https://youtube.com/@ozeanlicht",icon:t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"w-4 h-4",children:t.jsx("path",{d:"M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"})}),iconBg:"bg-[#FF0000]"}]}},m={args:{title:"Transform Your Practice",subtitle:"Advanced Meditation Course",tags:["8 Weeks","Live Sessions","Certificate","Lifetime Access"],ctaText:"Enroll Now",ctaHref:"/courses/advanced-meditation"}},g={args:{title:"Try It Risk-Free",subtitle:"14-Day Free Trial",tags:["No Credit Card","Full Access","Cancel Anytime","Money-Back Guarantee"],ctaText:"Start Free Trial",ctaHref:"/trial"}},u={render:()=>t.jsxs("div",{className:"space-y-8 p-8 bg-[var(--cosmic-dark)]",children:[t.jsx(d,{title:"Default Style",subtitle:"Basic",ctaText:"Get Started",ctaHref:"#"}),t.jsx(d,{title:"With Tags",subtitle:"Enhanced",tags:["Feature 1","Feature 2","Feature 3"],ctaText:"Learn More",ctaHref:"#"}),t.jsx(d,{title:"Complete Example",subtitle:"Full Featured",tags:["Tag 1","Tag 2","Tag 3","Tag 4"],ctaText:"Join Now",ctaHref:"#",socialLinks:[{name:"Facebook",url:"#",icon:t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"w-4 h-4",children:t.jsx("path",{d:"M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"})}),iconBg:"bg-[#1877F2]"},{name:"Instagram",url:"#",icon:t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"w-4 h-4",children:t.jsx("path",{d:"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"})}),iconBg:"bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]"}]})]}),parameters:{layout:"fullscreen"}};var p,h,v,w,f;e.parameters={...e.parameters,docs:{...(p=e.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    title: 'Start Your Journey Today',
    subtitle: 'Join Us',
    ctaText: 'Get Started',
    ctaHref: '/register'
  }
}`,...(v=(h=e.parameters)==null?void 0:h.docs)==null?void 0:v.source},description:{story:"Default CTA section with minimal configuration",...(f=(w=e.parameters)==null?void 0:w.docs)==null?void 0:f.description}}};var C,b,x,T,y;r.parameters={...r.parameters,docs:{...(C=r.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    title: 'Transform Your Life with Ozean Licht',
    subtitle: 'Discover Inner Peace',
    tags: ['Meditation', 'Yoga', 'Mindfulness', 'Spiritual Growth'],
    ctaText: 'Begin Your Journey',
    ctaHref: '/courses'
  }
}`,...(x=(b=r.parameters)==null?void 0:b.docs)==null?void 0:x.source},description:{story:"CTA section with tags showcasing features or benefits",...(y=(T=r.parameters)==null?void 0:T.docs)==null?void 0:y.description}}};var z,F,S,B,k;a.parameters={...a.parameters,docs:{...(z=a.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    title: 'Ready to Get Started?',
    subtitle: 'Free Trial Available',
    tags: ['No Credit Card Required', '14-Day Trial', 'Cancel Anytime'],
    ctaText: 'Start Free Trial',
    onCTAClick: () => alert('CTA button clicked!')
  }
}`,...(S=(F=a.parameters)==null?void 0:F.docs)==null?void 0:S.source},description:{story:"CTA section with click handler instead of href",...(k=(B=a.parameters)==null?void 0:B.docs)==null?void 0:k.description}}};var A,H,M,L,D;s.parameters={...s.parameters,docs:{...(A=s.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    title: 'Connect with Ozean Licht Community',
    subtitle: 'Follow Our Journey',
    ctaText: 'Join Community',
    ctaHref: '/community',
    socialLinks: [{
      name: 'Facebook',
      url: 'https://facebook.com/ozeanlicht',
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>,
      iconBg: 'bg-[#1877F2]'
    }, {
      name: 'Instagram',
      url: 'https://instagram.com/ozeanlicht',
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>,
      iconBg: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]'
    }, {
      name: 'YouTube',
      url: 'https://youtube.com/@ozeanlicht',
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>,
      iconBg: 'bg-[#FF0000]'
    }]
  }
}`,...(M=(H=s.parameters)==null?void 0:H.docs)==null?void 0:M.source},description:{story:"CTA section with social media links",...(D=(L=s.parameters)==null?void 0:L.docs)==null?void 0:D.description}}};var N,j,E,J,Y;o.parameters={...o.parameters,docs:{...(N=o.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    title: 'Join the Ozean Licht Community Today',
    subtitle: 'Special Launch Offer',
    tags: ['Meditation Courses', 'Live Sessions', 'Community Support', 'Expert Guidance'],
    ctaText: 'Start Your Journey',
    ctaHref: '/register',
    socialLinks: [{
      name: 'Facebook',
      url: 'https://facebook.com/ozeanlicht',
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>,
      iconBg: 'bg-[#1877F2]'
    }, {
      name: 'Instagram',
      url: 'https://instagram.com/ozeanlicht',
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>,
      iconBg: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]'
    }]
  }
}`,...(E=(j=o.parameters)==null?void 0:j.docs)==null?void 0:E.source},description:{story:"Complete CTA section with all features",...(Y=(J=o.parameters)==null?void 0:J.docs)==null?void 0:Y.description}}};var O,G,I,V,W;i.parameters={...i.parameters,docs:{...(O=i.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    title: 'Ready to Begin?',
    ctaText: 'Get Started',
    ctaHref: '/start'
  }
}`,...(I=(G=i.parameters)==null?void 0:G.docs)==null?void 0:I.source},description:{story:"Minimal CTA with only title and button",...(W=(V=i.parameters)==null?void 0:V.docs)==null?void 0:W.description}}};var R,P,U,q,_;c.parameters={...c.parameters,docs:{...(R=c.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    title: 'Embark on a Transformative Journey Toward Inner Peace, Spiritual Growth, and Holistic Wellness',
    subtitle: 'Your Path to Enlightenment',
    tags: ['Meditation', 'Mindfulness', 'Yoga', 'Energy Work', 'Spiritual Coaching'],
    ctaText: 'Start Transformation',
    ctaHref: '/transform'
  }
}`,...(U=(P=c.parameters)==null?void 0:P.docs)==null?void 0:U.source},description:{story:"CTA with long title demonstrating text balance",...(_=(q=c.parameters)==null?void 0:q.docs)==null?void 0:_.description}}};var K,Q,X,Z,$;n.parameters={...n.parameters,docs:{...(K=n.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    title: 'Special Offer',
    subtitle: 'Limited Time',
    tags: ['50% Off', 'First Month Free', 'No Commitment'],
    ctaText: 'Claim Offer',
    ctaHref: '/offer',
    className: 'bg-gradient-to-br from-[var(--primary)]/10 to-[var(--secondary)]/10'
  }
}`,...(X=(Q=n.parameters)==null?void 0:Q.docs)==null?void 0:X.source},description:{story:"CTA with custom styling",...($=(Z=n.parameters)==null?void 0:Z.docs)==null?void 0:$.description}}};var t4,e4,r4,a4,s4;l.parameters={...l.parameters,docs:{...(t4=l.parameters)==null?void 0:t4.docs,source:{originalSource:`{
  args: {
    title: 'Be Part of Something Bigger',
    subtitle: 'Join 10,000+ Members',
    tags: ['Global Community', 'Live Events', 'Expert Teachers', '24/7 Support'],
    ctaText: 'Join Community',
    ctaHref: '/community',
    socialLinks: [{
      name: 'Facebook',
      url: 'https://facebook.com/ozeanlicht',
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>,
      iconBg: 'bg-[#1877F2]'
    }, {
      name: 'Instagram',
      url: 'https://instagram.com/ozeanlicht',
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>,
      iconBg: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]'
    }, {
      name: 'YouTube',
      url: 'https://youtube.com/@ozeanlicht',
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>,
      iconBg: 'bg-[#FF0000]'
    }]
  }
}`,...(r4=(e4=l.parameters)==null?void 0:e4.docs)==null?void 0:r4.source},description:{story:"CTA focused on community building",...(s4=(a4=l.parameters)==null?void 0:a4.docs)==null?void 0:s4.description}}};var o4,i4,c4,n4,l4;m.parameters={...m.parameters,docs:{...(o4=m.parameters)==null?void 0:o4.docs,source:{originalSource:`{
  args: {
    title: 'Transform Your Practice',
    subtitle: 'Advanced Meditation Course',
    tags: ['8 Weeks', 'Live Sessions', 'Certificate', 'Lifetime Access'],
    ctaText: 'Enroll Now',
    ctaHref: '/courses/advanced-meditation'
  }
}`,...(c4=(i4=m.parameters)==null?void 0:i4.docs)==null?void 0:c4.source},description:{story:"CTA for course enrollment",...(l4=(n4=m.parameters)==null?void 0:n4.docs)==null?void 0:l4.description}}};var m4,g4,u4,d4,p4;g.parameters={...g.parameters,docs:{...(m4=g.parameters)==null?void 0:m4.docs,source:{originalSource:`{
  args: {
    title: 'Try It Risk-Free',
    subtitle: '14-Day Free Trial',
    tags: ['No Credit Card', 'Full Access', 'Cancel Anytime', 'Money-Back Guarantee'],
    ctaText: 'Start Free Trial',
    ctaHref: '/trial'
  }
}`,...(u4=(g4=g.parameters)==null?void 0:g4.docs)==null?void 0:u4.source},description:{story:"CTA with emphasis on free trial",...(p4=(d4=g.parameters)==null?void 0:d4.docs)==null?void 0:p4.description}}};var h4,v4,w4,f4,C4;u.parameters={...u.parameters,docs:{...(h4=u.parameters)==null?void 0:h4.docs,source:{originalSource:`{
  render: () => <div className="space-y-8 p-8 bg-[var(--cosmic-dark)]">
      <CTASection title="Default Style" subtitle="Basic" ctaText="Get Started" ctaHref="#" />

      <CTASection title="With Tags" subtitle="Enhanced" tags={['Feature 1', 'Feature 2', 'Feature 3']} ctaText="Learn More" ctaHref="#" />

      <CTASection title="Complete Example" subtitle="Full Featured" tags={['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4']} ctaText="Join Now" ctaHref="#" socialLinks={[{
      name: 'Facebook',
      url: '#',
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>,
      iconBg: 'bg-[#1877F2]'
    }, {
      name: 'Instagram',
      url: '#',
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>,
      iconBg: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]'
    }]} />
    </div>,
  parameters: {
    layout: 'fullscreen'
  }
}`,...(w4=(v4=u.parameters)==null?void 0:v4.docs)==null?void 0:w4.source},description:{story:"All variants showcase in a grid",...(C4=(f4=u.parameters)==null?void 0:f4.docs)==null?void 0:C4.description}}};const N4=["Default","WithTags","WithClickHandler","WithSocialLinks","Complete","Minimal","LongTitle","CustomStyled","Community","CourseEnrollment","FreeTrial","AllVariants"];export{u as AllVariants,l as Community,o as Complete,m as CourseEnrollment,n as CustomStyled,e as Default,g as FreeTrial,c as LongTitle,i as Minimal,a as WithClickHandler,s as WithSocialLinks,r as WithTags,N4 as __namedExportsOrder,D4 as default};
