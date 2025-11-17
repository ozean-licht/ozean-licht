import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{r as T}from"./index-B2-qRKKC.js";import{C as nr,d as lr,e as cr}from"./Card-B3jXYF8b.js";import{B as dr}from"./Button-Clfx5zjS.js";import{B as ur}from"./Badge-BblwO-Dx.js";import{c as ir}from"./cn-CytzSlOG.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-DVF2XGCm.js";import"./card-DrBDOuQX.js";import"./button-C8qtCU0L.js";import"./index-BiMR7eR1.js";import"./index-BFjtS4uE.js";import"./arrow-right-2p1MOGVp.js";import"./createLucideIcon-BbF4D6Jl.js";function L(r){const n=`<svg width="600" height="337" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="337" fill="#0A0F1A"/>
    <rect x="20" y="20" width="560" height="297" fill="#0ec2bc" rx="12"/>
    <text x="300" y="168" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-size="20" font-weight="bold" dy=".3em">${r.replace(/[äöüÄÖÜß]/g,o=>({ä:"ae",ö:"oe",ü:"ue",Ä:"Ae",Ö:"Oe",Ü:"Ue",ß:"ss"})[o]||o).replace(/[^a-zA-Z0-9\s\-_]/g,"").substring(0,25)}...</text>
  </svg>`;return`data:image/svg+xml;charset=utf-8,${encodeURIComponent(n)}`}function mr({src:r,alt:i,className:n}){const[S,o]=T.useState(null),[_,l]=T.useState(!0);return T.useEffect(()=>{if(!r){o(L(i)),l(!1);return}if(r.startsWith("data:image/svg+xml")){o(r),l(!1);return}const t=new Image;return t.onload=()=>{o(r),l(!1)},t.onerror=()=>{o(L(i)),l(!1)},t.src=r,()=>{t.onload=null,t.onerror=null}},[r,i]),_?e.jsx("div",{className:ir(n,"bg-[var(--background)] flex items-center justify-center"),children:e.jsx("div",{className:"w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"})}):e.jsx("img",{src:S,alt:i,className:n})}function s({course:r,className:i,hover:n=!0,glow:S=!1,href:o}){var t;const _=r.thumbnail_url_desktop||r.thumbnail_url_mobile||L(r.title),l=o||`/courses/${r.slug}`;return e.jsx("a",{href:l,className:"block",children:e.jsxs(nr,{variant:"default",hover:n,glow:S,className:ir("group overflow-hidden transition-all duration-300 cursor-pointer","bg-[var(--card)] border-[var(--border)]",i),children:[e.jsxs("div",{className:"relative aspect-[16/9] bg-gradient-to-br from-[var(--background)] to-[var(--card)] overflow-hidden",children:[e.jsx(mr,{src:_,alt:r.title,className:"w-full h-full object-cover"}),e.jsx("div",{className:"absolute top-4 right-4",children:e.jsxs(ur,{variant:"gradient",glow:!0,size:"md",className:"shadow-lg",children:["€",r.price]})})]}),e.jsxs(lr,{className:"p-6 space-y-4",children:[e.jsx("h3",{className:"font-decorative text-xl md:text-2xl text-[var(--foreground)] leading-tight line-clamp-2",children:r.title}),e.jsxs("p",{className:"text-[var(--muted-foreground)] text-sm leading-relaxed line-clamp-3",children:[((t=r.description)==null?void 0:t.substring(0,120))||"Entdecke transformative Inhalte für dein spirituelles Wachstum und deine persönliche Entwicklung.",r.description&&r.description.length>120?"...":""]}),e.jsxs("div",{className:"flex items-center justify-between text-xs text-[var(--muted-foreground)]",children:[e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx("svg",{className:"w-4 h-4",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"})}),r.is_available!==!1?"Verfügbar":"Bald verfügbar"]}),e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx("svg",{className:"w-4 h-4",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"})}),r.duration||"Lebenslang"]})]})]}),e.jsx(cr,{className:"p-6 pt-0",children:e.jsx(dr,{variant:"primary",fullWidth:!0,className:"group-hover:shadow-lg transition-shadow",children:"Kurs ansehen"})})]})})}s.displayName="CourseCard";try{s.displayName="CourseCard",s.__docgenInfo={description:"CourseCard - Display course information with image, title, description, and CTA",displayName:"CourseCard",props:{course:{defaultValue:null,description:"",name:"course",required:!0,type:{name:"Course"}},className:{defaultValue:null,description:"Custom className for styling",name:"className",required:!1,type:{name:"string"}},hover:{defaultValue:{value:"true"},description:"Show hover effects",name:"hover",required:!1,type:{name:"boolean"}},glow:{defaultValue:{value:"false"},description:"Show glow effect",name:"glow",required:!1,type:{name:"boolean"}},href:{defaultValue:null,description:"Custom link href (overrides default /courses/[slug])",name:"href",required:!1,type:{name:"string"}}}}}catch{}const kr={title:"Tier 3: Compositions/Cards/CourseCard",component:s,parameters:{layout:"centered",docs:{description:{component:"Course card composition showcasing course offerings with image, title, description, price badge, and CTA. Features Ozean Licht branding with glass morphism and cosmic dark theme."}}},tags:["autodocs"],argTypes:{course:{description:"Course data object with id, slug, title, description, price, and thumbnail URLs",control:"object"},className:{description:"Custom className for styling",control:"text"},hover:{description:"Enable hover effects on the card",control:"boolean",table:{defaultValue:{summary:"true"}}},glow:{description:"Enable turquoise glow effect around the card",control:"boolean",table:{defaultValue:{summary:"false"}}},href:{description:"Custom link href (overrides default /courses/[slug])",control:"text"}},decorators:[r=>e.jsx("div",{className:"w-full max-w-sm",children:e.jsx(r,{})})]},a={id:"1",slug:"intro-meditation",title:"Introduction to Meditation",description:"Learn the basics of meditation and mindfulness. This comprehensive course covers breathing techniques, body awareness, and mental clarity practices for beginners.",price:49.99,thumbnail_url_desktop:"https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=450&fit=crop",is_available:!0,duration:"8 Stunden"},k={id:"2",slug:"advanced-chakra",title:"Advanced Chakra Healing & Energy Work",description:"Deep dive into chakra systems, energy healing techniques, and spiritual awakening. Learn to balance your energy centers and unlock your full spiritual potential through guided practices and ancient wisdom.",price:129.99,thumbnail_url_desktop:"https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=450&fit=crop",is_available:!0,duration:"12 Stunden",instructor:"Maria Schneider"},I={id:"3",slug:"crystal-healing",title:"Crystal Healing Masterclass",description:"Discover the power of crystals and how to use them for healing, protection, and manifestation. This course covers crystal properties, grid layouts, and practical applications.",price:79.99,thumbnail_url_desktop:"https://images.unsplash.com/photo-1518047601542-79f18c655718?w=800&h=450&fit=crop",is_available:!1,duration:"10 Stunden"},M={id:"4",slug:"no-image-course",title:"Spirituelle Transformation durch Achtsamkeit",description:"Ein umfassender Kurs über Achtsamkeit und ihre transformative Kraft im täglichen Leben.",price:39.99,is_available:!0,duration:"Lebenslang"},F={id:"5",slug:"yoga-basics",title:"Yoga Basics",description:"Quick intro to yoga.",price:29.99,thumbnail_url_desktop:"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=450&fit=crop",is_available:!0},A={id:"6",slug:"comprehensive-spiritual-journey",title:"Comprehensive Spiritual Journey: Awakening Your Inner Light Through Ancient Practices and Modern Wisdom",description:"This extensive course combines ancient spiritual practices with modern psychological insights to create a transformative journey of self-discovery. Over the course of several months, you will explore meditation, breathwork, energy healing, mindfulness practices, and consciousness expansion techniques. Perfect for both beginners and advanced practitioners seeking deep spiritual growth and personal transformation.",price:299.99,thumbnail_url_desktop:"https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=800&h=450&fit=crop",is_available:!0,duration:"40 Stunden",instructor:"Dr. Andreas Lichtenberg"},c={args:{course:a,hover:!0,glow:!1}},d={args:{course:a,hover:!0,glow:!0}},u={args:{course:k,hover:!0,glow:!1}},m={args:{course:I,hover:!0,glow:!1}},p={args:{course:M,hover:!0,glow:!1}},g={args:{course:F,hover:!0,glow:!1}},h={args:{course:A,hover:!0,glow:!1}},f={args:{course:a,hover:!1,glow:!1}},v={args:{course:a,hover:!0,glow:!1,href:"/custom-path/meditation-course"},parameters:{docs:{description:{story:"Override the default /courses/[slug] link with a custom href."}}}},w={args:{course:{id:"7",slug:"spiritual-mastery",title:"Spiritual Mastery Program",description:"The ultimate spiritual transformation program. A year-long journey into consciousness, energy work, and enlightenment. Includes personal mentorship and lifetime access to all materials.",price:999.99,thumbnail_url_desktop:"https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&h=450&fit=crop",is_available:!0,duration:"365 Tage",instructor:"Master Li Wei"},hover:!0,glow:!0}},C={args:{course:{id:"8",slug:"meditation-intro-free",title:"Free Meditation Introduction",description:"Start your meditation journey with this free introductory course. No credit card required.",price:0,thumbnail_url_desktop:"https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&h=450&fit=crop",is_available:!0,duration:"2 Stunden"},hover:!0,glow:!1}},x={render:()=>e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-7xl",children:[e.jsx(s,{course:a,hover:!0,glow:!1}),e.jsx(s,{course:k,hover:!0,glow:!0}),e.jsx(s,{course:I,hover:!0,glow:!1}),e.jsx(s,{course:M,hover:!0,glow:!1}),e.jsx(s,{course:F,hover:!0,glow:!1}),e.jsx(s,{course:A,hover:!0,glow:!0})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Multiple course cards in a responsive grid layout."}}}},b={render:()=>e.jsxs("div",{className:"space-y-8 p-6 max-w-7xl",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"Available Courses"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:[e.jsx(s,{course:a,hover:!0,glow:!1}),e.jsx(s,{course:k,hover:!0,glow:!0}),e.jsx(s,{course:F,hover:!0,glow:!1})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"Coming Soon"}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:e.jsx(s,{course:I,hover:!0,glow:!1})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"Without Images (Fallback)"}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:e.jsx(s,{course:M,hover:!0,glow:!1})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"Edge Cases"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:[e.jsx(s,{course:A,hover:!0,glow:!0}),e.jsx(s,{course:{id:"9",slug:"test",title:"Test",price:0,is_available:!0},hover:!0,glow:!1})]})]})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Comprehensive showcase of all course card states and variations."}}}},y={args:{course:{...a,thumbnail_url_desktop:"https://example.com/very-slow-loading-image.jpg"},hover:!0,glow:!1},parameters:{docs:{description:{story:"Demonstrates loading state with spinner while image loads. Will fallback to generated SVG if image fails to load."}}}},j={args:{course:a,hover:!0,glow:!1},decorators:[r=>e.jsx("div",{className:"w-full max-w-[320px]",children:e.jsx(r,{})})],parameters:{viewport:{defaultViewport:"mobile1"},docs:{description:{story:"Course card optimized for mobile viewports."}}}},N={render:()=>e.jsx("div",{className:"min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8",children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto",children:[e.jsx(s,{course:a,hover:!0,glow:!0}),e.jsx(s,{course:k,hover:!0,glow:!0}),e.jsx(s,{course:A,hover:!0,glow:!0})]})}),parameters:{layout:"fullscreen",docs:{description:{story:"Course cards displayed on cosmic dark background with glow effects."}}}};var V,W,E,q,z;c.parameters={...c.parameters,docs:{...(V=c.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    course: sampleCourse,
    hover: true,
    glow: false
  }
}`,...(E=(W=c.parameters)==null?void 0:W.docs)==null?void 0:E.source},description:{story:"Default course card with all standard features",...(z=(q=c.parameters)==null?void 0:q.docs)==null?void 0:z.description}}};var D,B,G,H,P;d.parameters={...d.parameters,docs:{...(D=d.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    course: sampleCourse,
    hover: true,
    glow: true
  }
}`,...(G=(B=d.parameters)==null?void 0:B.docs)==null?void 0:G.source},description:{story:"Course card with glow effect for emphasis",...(P=(H=d.parameters)==null?void 0:H.docs)==null?void 0:P.description}}};var O,R,U,K,$;u.parameters={...u.parameters,docs:{...(O=u.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    course: advancedCourse,
    hover: true,
    glow: false
  }
}`,...(U=(R=u.parameters)==null?void 0:R.docs)==null?void 0:U.source},description:{story:"Advanced course with higher price point",...($=(K=u.parameters)==null?void 0:K.docs)==null?void 0:$.description}}};var Y,J,Q,Z,X;m.parameters={...m.parameters,docs:{...(Y=m.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    course: comingSoonCourse,
    hover: true,
    glow: false
  }
}`,...(Q=(J=m.parameters)==null?void 0:J.docs)==null?void 0:Q.source},description:{story:"Coming soon course (not available)",...(X=(Z=m.parameters)==null?void 0:Z.docs)==null?void 0:X.description}}};var ee,re,se,oe,ae;p.parameters={...p.parameters,docs:{...(ee=p.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  args: {
    course: noCourse,
    hover: true,
    glow: false
  }
}`,...(se=(re=p.parameters)==null?void 0:re.docs)==null?void 0:se.source},description:{story:"Course without image - shows fallback SVG generation",...(ae=(oe=p.parameters)==null?void 0:oe.docs)==null?void 0:ae.description}}};var te,ie,ne,le,ce;g.parameters={...g.parameters,docs:{...(te=g.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {
    course: shortTitleCourse,
    hover: true,
    glow: false
  }
}`,...(ne=(ie=g.parameters)==null?void 0:ie.docs)==null?void 0:ne.source},description:{story:"Course with short title and description",...(ce=(le=g.parameters)==null?void 0:le.docs)==null?void 0:ce.description}}};var de,ue,me,pe,ge;h.parameters={...h.parameters,docs:{...(de=h.parameters)==null?void 0:de.docs,source:{originalSource:`{
  args: {
    course: longTitleCourse,
    hover: true,
    glow: false
  }
}`,...(me=(ue=h.parameters)==null?void 0:ue.docs)==null?void 0:me.source},description:{story:"Course with very long title and description (shows truncation)",...(ge=(pe=h.parameters)==null?void 0:pe.docs)==null?void 0:ge.description}}};var he,fe,ve,we,Ce;f.parameters={...f.parameters,docs:{...(he=f.parameters)==null?void 0:he.docs,source:{originalSource:`{
  args: {
    course: sampleCourse,
    hover: false,
    glow: false
  }
}`,...(ve=(fe=f.parameters)==null?void 0:fe.docs)==null?void 0:ve.source},description:{story:"Course card without hover effects",...(Ce=(we=f.parameters)==null?void 0:we.docs)==null?void 0:Ce.description}}};var xe,be,ye,je,Ne;v.parameters={...v.parameters,docs:{...(xe=v.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  args: {
    course: sampleCourse,
    hover: true,
    glow: false,
    href: '/custom-path/meditation-course'
  },
  parameters: {
    docs: {
      description: {
        story: 'Override the default /courses/[slug] link with a custom href.'
      }
    }
  }
}`,...(ye=(be=v.parameters)==null?void 0:be.docs)==null?void 0:ye.source},description:{story:"Course card with custom href",...(Ne=(je=v.parameters)==null?void 0:je.docs)==null?void 0:Ne.description}}};var Se,_e,ke,Ae,Te;w.parameters={...w.parameters,docs:{...(Se=w.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  args: {
    course: {
      id: '7',
      slug: 'spiritual-mastery',
      title: 'Spiritual Mastery Program',
      description: 'The ultimate spiritual transformation program. A year-long journey into consciousness, energy work, and enlightenment. Includes personal mentorship and lifetime access to all materials.',
      price: 999.99,
      thumbnail_url_desktop: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&h=450&fit=crop',
      is_available: true,
      duration: '365 Tage',
      instructor: 'Master Li Wei'
    },
    hover: true,
    glow: true
  }
}`,...(ke=(_e=w.parameters)==null?void 0:_e.docs)==null?void 0:ke.source},description:{story:"Premium course with glow effect",...(Te=(Ae=w.parameters)==null?void 0:Ae.docs)==null?void 0:Te.description}}};var Le,Ie,Me,Fe,Ve;C.parameters={...C.parameters,docs:{...(Le=C.parameters)==null?void 0:Le.docs,source:{originalSource:`{
  args: {
    course: {
      id: '8',
      slug: 'meditation-intro-free',
      title: 'Free Meditation Introduction',
      description: 'Start your meditation journey with this free introductory course. No credit card required.',
      price: 0,
      thumbnail_url_desktop: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&h=450&fit=crop',
      is_available: true,
      duration: '2 Stunden'
    },
    hover: true,
    glow: false
  }
}`,...(Me=(Ie=C.parameters)==null?void 0:Ie.docs)==null?void 0:Me.source},description:{story:"Free course (price = 0)",...(Ve=(Fe=C.parameters)==null?void 0:Fe.docs)==null?void 0:Ve.description}}};var We,Ee,qe,ze,De;x.parameters={...x.parameters,docs:{...(We=x.parameters)==null?void 0:We.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-7xl">
      <CourseCard course={sampleCourse} hover glow={false} />
      <CourseCard course={advancedCourse} hover glow />
      <CourseCard course={comingSoonCourse} hover glow={false} />
      <CourseCard course={noCourse} hover glow={false} />
      <CourseCard course={shortTitleCourse} hover glow={false} />
      <CourseCard course={longTitleCourse} hover glow />
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Multiple course cards in a responsive grid layout.'
      }
    }
  }
}`,...(qe=(Ee=x.parameters)==null?void 0:Ee.docs)==null?void 0:qe.source},description:{story:"Grid layout showing multiple cards",...(De=(ze=x.parameters)==null?void 0:ze.docs)==null?void 0:De.description}}};var Be,Ge,He,Pe,Oe;b.parameters={...b.parameters,docs:{...(Be=b.parameters)==null?void 0:Be.docs,source:{originalSource:`{
  render: () => <div className="space-y-8 p-6 max-w-7xl">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Available Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseCard course={sampleCourse} hover glow={false} />
          <CourseCard course={advancedCourse} hover glow />
          <CourseCard course={shortTitleCourse} hover glow={false} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Coming Soon</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseCard course={comingSoonCourse} hover glow={false} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Without Images (Fallback)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseCard course={noCourse} hover glow={false} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Edge Cases</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseCard course={longTitleCourse} hover glow />
          <CourseCard course={{
          id: '9',
          slug: 'test',
          title: 'Test',
          price: 0,
          is_available: true
        }} hover glow={false} />
        </div>
      </div>
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Comprehensive showcase of all course card states and variations.'
      }
    }
  }
}`,...(He=(Ge=b.parameters)==null?void 0:Ge.docs)==null?void 0:He.source},description:{story:"All states showcase",...(Oe=(Pe=b.parameters)==null?void 0:Pe.docs)==null?void 0:Oe.description}}};var Re,Ue,Ke,$e,Ye;y.parameters={...y.parameters,docs:{...(Re=y.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  args: {
    course: {
      ...sampleCourse,
      thumbnail_url_desktop: 'https://example.com/very-slow-loading-image.jpg' // Intentionally slow/broken
    },
    hover: true,
    glow: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates loading state with spinner while image loads. Will fallback to generated SVG if image fails to load.'
      }
    }
  }
}`,...(Ke=(Ue=y.parameters)==null?void 0:Ue.docs)==null?void 0:Ke.source},description:{story:"Loading state (image loading simulation)",...(Ye=($e=y.parameters)==null?void 0:$e.docs)==null?void 0:Ye.description}}};var Je,Qe,Ze,Xe,er;j.parameters={...j.parameters,docs:{...(Je=j.parameters)==null?void 0:Je.docs,source:{originalSource:`{
  args: {
    course: sampleCourse,
    hover: true,
    glow: false
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
        story: 'Course card optimized for mobile viewports.'
      }
    }
  }
}`,...(Ze=(Qe=j.parameters)==null?void 0:Qe.docs)==null?void 0:Ze.source},description:{story:"Mobile view (narrow container)",...(er=(Xe=j.parameters)==null?void 0:Xe.docs)==null?void 0:er.description}}};var rr,sr,or,ar,tr;N.parameters={...N.parameters,docs:{...(rr=N.parameters)==null?void 0:rr.docs,source:{originalSource:`{
  render: () => <div className="min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <CourseCard course={sampleCourse} hover glow />
        <CourseCard course={advancedCourse} hover glow />
        <CourseCard course={longTitleCourse} hover glow />
      </div>
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Course cards displayed on cosmic dark background with glow effects.'
      }
    }
  }
}`,...(or=(sr=N.parameters)==null?void 0:sr.docs)==null?void 0:or.source},description:{story:"Dark cosmic theme showcase",...(tr=(ar=N.parameters)==null?void 0:ar.docs)==null?void 0:tr.description}}};const Ar=["Default","WithGlow","AdvancedCourse","ComingSoon","NoImage","ShortContent","LongContent","NoHover","CustomHref","PremiumCourse","FreeCourse","GridLayout","AllStates","LoadingState","MobileView","CosmicTheme"];export{u as AdvancedCourse,b as AllStates,m as ComingSoon,N as CosmicTheme,v as CustomHref,c as Default,C as FreeCourse,x as GridLayout,y as LoadingState,h as LongContent,j as MobileView,f as NoHover,p as NoImage,w as PremiumCourse,g as ShortContent,d as WithGlow,Ar as __namedExportsOrder,kr as default};
