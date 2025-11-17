import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{T as Sa}from"./TestimonialCard-Dv2PTurx.js";import{c as E}from"./cn-CytzSlOG.js";import"./index-B2-qRKKC.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./Card-B3jXYF8b.js";import"./index-DVF2XGCm.js";import"./card-DrBDOuQX.js";import"./avatar-Cgik7SBR.js";import"./index-D7N8UVpi.js";import"./index-ciuW_uyV.js";import"./index-D1vk04JX.js";import"./index-B5oyz0SX.js";import"./index-kS-9iBlu.js";import"./index-BiMR7eR1.js";import"./index-BFjtS4uE.js";function s({title:a,subtitle:i,testimonials:ga,layout:ha="grid",columns:va=3,className:ya}){const ba={2:"md:grid-cols-2",3:"md:grid-cols-2 lg:grid-cols-3"};return e.jsxs("section",{className:E("container mx-auto px-6 py-12",ya),children:[(a||i)&&e.jsxs("div",{className:"text-center max-w-3xl mx-auto mb-12 space-y-4",children:[i&&e.jsx("p",{className:"text-primary text-sm font-alt uppercase tracking-wide",children:i}),a&&e.jsx("h2",{className:"text-4xl md:text-5xl font-decorative text-white",style:{textShadow:"0 0 8px rgba(255, 255, 255, 0.42)"},children:a})]}),e.jsx("div",{className:E("grid grid-cols-1 gap-6",ha==="grid"&&ba[va]),children:ga.map((j,fa)=>e.jsx(Sa,{testimonial:j},j.id||fa))})]})}s.displayName="TestimonialsSection";try{s.displayName="TestimonialsSection",s.__docgenInfo={description:"",displayName:"TestimonialsSection",props:{title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string"}},subtitle:{defaultValue:null,description:"",name:"subtitle",required:!1,type:{name:"string"}},testimonials:{defaultValue:null,description:"",name:"testimonials",required:!0,type:{name:"Testimonial[]"}},layout:{defaultValue:{value:"grid"},description:"",name:"layout",required:!1,type:{name:"enum",value:[{value:'"grid"'},{value:'"carousel"'}]}},columns:{defaultValue:{value:"3"},description:"",name:"columns",required:!1,type:{name:"enum",value:[{value:"3"},{value:"2"}]}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const qa={title:"Tier 3: Compositions/Sections/TestimonialsSection",component:s,parameters:{layout:"fullscreen",docs:{description:{component:"Testimonials section composition for displaying customer reviews with responsive grid layouts, ratings, and avatars."}}},tags:["autodocs"],argTypes:{title:{control:"text",description:"Main section heading (optional)"},subtitle:{control:"text",description:"Badge subtitle shown above title in primary color"},testimonials:{control:"object",description:"Array of testimonial objects with name, location, quote, rating, and avatar"},layout:{control:"select",options:["grid","carousel"],description:"Layout style (currently only grid is implemented)"},columns:{control:"select",options:[2,3],description:"Number of columns in grid layout (2 or 3)"},className:{control:"text",description:"Additional CSS classes for custom styling"}}},t=[{id:"1",name:"Maria Schmidt",location:"Vienna, Austria",testimonial:"The meditation courses have completely transformed my daily practice. I feel more centered and at peace than ever before.",avatar:"https://i.pravatar.cc/150?img=1",rating:5,date:"2024-01-15"},{id:"2",name:"Hans Mueller",location:"Salzburg, Austria",testimonial:"An incredible journey of self-discovery. The teachers are authentic and the community is truly supportive.",avatar:"https://i.pravatar.cc/150?img=12",rating:5,date:"2024-01-10"},{id:"3",name:"Sophie Weber",location:"Innsbruck, Austria",testimonial:"I was skeptical at first, but the practical techniques and clear guidance made all the difference. Highly recommend!",avatar:"https://i.pravatar.cc/150?img=5",rating:4,date:"2024-01-05"}],V=[...t,{id:"4",name:"Thomas Bauer",location:"Graz, Austria",testimonial:"The Kids Ascension platform has been a game-changer for my children. They are learning and growing in ways I never imagined.",avatar:"https://i.pravatar.cc/150?img=13",rating:5,date:"2023-12-20"},{id:"5",name:"Anna Friedl",location:"Linz, Austria",testimonial:"Beautiful content, thoughtful design, and a truly transformative experience. Worth every moment invested.",avatar:"https://i.pravatar.cc/150?img=9",rating:5,date:"2023-12-15"},{id:"6",name:"Michael Gruber",location:"Klagenfurt, Austria",testimonial:"The community support and expert guidance have helped me overcome challenges I struggled with for years.",avatar:"https://i.pravatar.cc/150?img=14",rating:4,date:"2023-12-10"}],Ta=[{id:"1",name:"Lisa Hofmann",location:"Bregenz, Austria",testimonial:"Simple yet profound teachings that have enriched my spiritual journey beyond measure.",rating:5},{id:"2",name:"David Steiner",location:"Villach, Austria",testimonial:"Clear, practical, and life-changing. These courses deliver exactly what they promise.",rating:5},{id:"3",name:"Julia Moser",location:"Wels, Austria",testimonial:"I appreciate the authentic approach and the genuine care for student progress. Excellent platform!",rating:4}],wa=[{id:"1",name:"Elisabeth Wagner",location:"Vienna, Austria",testimonial:"After years of searching for the right spiritual guidance, I finally found Ozean Licht. The comprehensive curriculum, experienced teachers, and supportive community have helped me develop a consistent meditation practice that has truly transformed my life. I am more present with my family, more focused at work, and more at peace with myself. I cannot recommend this platform highly enough to anyone serious about their spiritual growth and personal development.",avatar:"https://i.pravatar.cc/150?img=10",rating:5,date:"2024-02-01"},{id:"2",name:"Martin Berger",location:"Salzburg, Austria",testimonial:"As a busy professional, I was struggling to find time for self-care and spiritual practice. The flexible course structure and accessible teachings have made it possible for me to integrate mindfulness into my daily routine. The results have been remarkable - better sleep, reduced stress, improved relationships, and a deeper sense of purpose. This is not just a course, it is a complete life transformation toolkit.",avatar:"https://i.pravatar.cc/150?img=15",rating:5,date:"2024-01-28"}],n={args:{title:"What Our Community Says",subtitle:"Testimonials",testimonials:t,layout:"grid",columns:3}},r={args:{title:"Trusted by Thousands",testimonials:t,columns:3}},o={args:{testimonials:t,columns:3}},l={args:{title:"Student Success Stories",subtitle:"Reviews",testimonials:t.slice(0,2),columns:2}},c={args:{title:"Transformative Experiences",subtitle:"What Members Say",testimonials:t,columns:3}},m={args:{title:"Join Our Growing Community",subtitle:"Member Feedback",testimonials:V,columns:3}},d={args:{title:"Real Results from Real People",subtitle:"Success Stories",testimonials:V.slice(0,4),columns:2}},u={args:{title:"Featured Review",subtitle:"Member Spotlight",testimonials:[t[0]],columns:3}},p={args:{title:"Community Feedback",subtitle:"Recent Reviews",testimonials:Ta,columns:3}},g={args:{title:"Honest Reviews",subtitle:"What Students Say",testimonials:[{id:"1",name:"Clara Richter",location:"Vienna, Austria",testimonial:"Excellent courses with practical applications. The only thing I wish is that there were more advanced-level content.",avatar:"https://i.pravatar.cc/150?img=20",rating:4},{id:"2",name:"Stefan Koch",location:"Salzburg, Austria",testimonial:"Absolutely perfect. Everything I was looking for in a spiritual education platform.",avatar:"https://i.pravatar.cc/150?img=33",rating:5},{id:"3",name:"Nina Huber",location:"Innsbruck, Austria",testimonial:"Very good overall. The community is wonderful and the teachers are knowledgeable. Would recommend!",avatar:"https://i.pravatar.cc/150?img=25",rating:4}],columns:3}},h={args:{title:"Excellence in Every Experience",subtitle:"Top Rated",testimonials:t.map(a=>({...a,rating:5})),columns:3}},v={args:{title:"Deep Dive Reviews",subtitle:"Detailed Feedback",testimonials:wa,columns:2}},y={args:{title:"Words from Our Community",subtitle:"Member Voices",testimonials:t.map(({rating:a,...i})=>i),columns:3}},b={args:{title:"Global Community",subtitle:"Member Reviews",testimonials:t.map(({location:a,...i})=>i),columns:3}},f={args:{title:"Timeless Wisdom",subtitle:"Community Praise",testimonials:t.map(({date:a,...i})=>i),columns:3}},S={args:{title:"Advanced Meditation Course Reviews",subtitle:"Student Feedback",testimonials:[{id:"1",name:"Alexandra Wimmer",location:"Vienna, Austria",testimonial:"This advanced course took my practice to an entirely new level. The techniques are powerful yet accessible.",avatar:"https://i.pravatar.cc/150?img=30",rating:5,date:"2024-02-10"},{id:"2",name:"Robert Maier",location:"Graz, Austria",testimonial:"Challenging in the best way. I feel like I have the tools to continue deepening my practice for years to come.",avatar:"https://i.pravatar.cc/150?img=31",rating:5,date:"2024-02-08"},{id:"3",name:"Katharina Lang",location:"Linz, Austria",testimonial:"The progression from beginner to advanced was seamless. Highly structured and incredibly effective.",avatar:"https://i.pravatar.cc/150?img=32",rating:4,date:"2024-02-05"}],columns:3}},T={args:{title:"Parents Love Kids Ascension",subtitle:"Parent Testimonials",testimonials:[{id:"1",name:"Sabine Leitner",location:"Vienna, Austria",testimonial:"My children are thriving! The educational content is engaging, age-appropriate, and truly transformative.",avatar:"https://i.pravatar.cc/150?img=40",rating:5},{id:"2",name:"Andreas Pichler",location:"Salzburg, Austria",testimonial:"As a parent and educator, I am impressed by the quality and depth of the Kids Ascension curriculum.",avatar:"https://i.pravatar.cc/150?img=41",rating:5},{id:"3",name:"Martina Schuster",location:"Innsbruck, Austria",testimonial:"Safe, enriching, and beautifully designed. My kids actually ask to do their lessons!",avatar:"https://i.pravatar.cc/150?img=42",rating:5}],columns:3}},w={args:{title:"Custom Padding Example",subtitle:"Extended Spacing",testimonials:t,columns:3,className:"py-20"}},x={args:{title:"Cosmic Testimonials",subtitle:"Community Reviews",testimonials:t,columns:3},decorators:[a=>e.jsx("div",{className:"relative min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d1f3a] to-[#0a1628]",children:e.jsx(a,{})})]},A={args:{title:"Clean & Minimal",subtitle:"Reviews",testimonials:t,columns:3},decorators:[a=>e.jsx("div",{className:"bg-white min-h-screen",children:e.jsx(a,{})})]},C={args:{title:"Ozean Licht Reviews",subtitle:"Transformative Experiences",testimonials:t,columns:3},decorators:[a=>e.jsxs("div",{className:"relative min-h-screen bg-[#0a0a0a]",children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-br from-[#0ec2bc]/5 via-transparent to-[#0ec2bc]/5 pointer-events-none"}),e.jsx(a,{})]})]},R={args:{title:"Responsive Grid",subtitle:"Mobile First Design",testimonials:t,columns:3},parameters:{viewport:{defaultViewport:"mobile1"}}},M={args:{title:"Community Voices",subtitle:"What Our Members Say",testimonials:[...V,{id:"7",name:"Eva Brunner",location:"Vienna, Austria",testimonial:"Life-changing content and wonderful community. So grateful I found this platform!",avatar:"https://i.pravatar.cc/150?img=21",rating:5},{id:"8",name:"Florian Ebner",location:"Graz, Austria",testimonial:"The quality of instruction is unmatched. Highly professional and deeply authentic.",avatar:"https://i.pravatar.cc/150?img=22",rating:5},{id:"9",name:"Sandra Eder",location:"Salzburg, Austria",testimonial:"From the first lesson, I knew I had found something special. Absolutely transformative!",avatar:"https://i.pravatar.cc/150?img=23",rating:4}],columns:3}},k={args:{title:"Featured",testimonials:[t[0]],columns:3},parameters:{viewport:{defaultViewport:"mobile1"}}},N={render:()=>e.jsxs("div",{className:"space-y-16 bg-[var(--background)] py-8",children:[e.jsx(s,{title:"Three Columns Default",subtitle:"Standard Layout",testimonials:t,columns:3}),e.jsx("div",{className:"h-px bg-[var(--border)]"}),e.jsx(s,{title:"Two Columns Wide",subtitle:"Alternative Layout",testimonials:t.slice(0,2),columns:2}),e.jsx("div",{className:"h-px bg-[var(--border)]"}),e.jsx(s,{title:"No Header Style",testimonials:t,columns:3}),e.jsx("div",{className:"h-px bg-[var(--border)]"}),e.jsx(s,{subtitle:"Subtitle Only",testimonials:t.slice(0,2),columns:2})]})},W={args:{title:"What Students Are Saying",subtitle:"Course Reviews",testimonials:[{id:"1",name:"Maria Schmidt",location:"Vienna, Austria",testimonial:"This course exceeded all my expectations. The structured approach and expert guidance helped me establish a consistent meditation practice.",avatar:"https://i.pravatar.cc/150?img=1",rating:5,date:"2024-02-15"},{id:"2",name:"Hans Mueller",location:"Salzburg, Austria",testimonial:"Practical, accessible, and deeply transformative. I recommend this to everyone interested in mindfulness.",avatar:"https://i.pravatar.cc/150?img=12",rating:5,date:"2024-02-12"},{id:"3",name:"Sophie Weber",location:"Innsbruck, Austria",testimonial:"The community support and clear instruction made learning meditation easier than I ever imagined.",avatar:"https://i.pravatar.cc/150?img=5",rating:4,date:"2024-02-10"}],columns:3},decorators:[a=>e.jsx("div",{className:"bg-gradient-to-b from-[#0a1628] to-[#0a0a0a] min-h-screen",children:e.jsx(a,{})})]},I={args:{title:"Trusted by Thousands",subtitle:"Join Our Community",testimonials:V.slice(0,3),columns:3}},L={args:{title:"Why Members Choose Us",subtitle:"Member Success",testimonials:[{id:"1",name:"Elisabeth Wagner",location:"Vienna, Austria",testimonial:"Best investment in myself I have ever made. The value far exceeds the price.",avatar:"https://i.pravatar.cc/150?img=10",rating:5},{id:"2",name:"Martin Berger",location:"Salzburg, Austria",testimonial:"Worth every cent. The quality of content and community support is unparalleled.",avatar:"https://i.pravatar.cc/150?img=15",rating:5}],columns:2}};var F,z,P,q,H;n.parameters={...n.parameters,docs:{...(F=n.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    title: 'What Our Community Says',
    subtitle: 'Testimonials',
    testimonials: sampleTestimonials,
    layout: 'grid',
    columns: 3
  }
}`,...(P=(z=n.parameters)==null?void 0:z.docs)==null?void 0:P.source},description:{story:"Default testimonials section with 3 testimonials in a grid",...(H=(q=n.parameters)==null?void 0:q.docs)==null?void 0:H.description}}};var O,D,B,K,G;r.parameters={...r.parameters,docs:{...(O=r.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    title: 'Trusted by Thousands',
    testimonials: sampleTestimonials,
    columns: 3
  }
}`,...(B=(D=r.parameters)==null?void 0:D.docs)==null?void 0:B.source},description:{story:"Testimonials section with title only (no subtitle)",...(G=(K=r.parameters)==null?void 0:K.docs)==null?void 0:G.description}}};var _,J,U,Q,X;o.parameters={...o.parameters,docs:{...(_=o.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    testimonials: sampleTestimonials,
    columns: 3
  }
}`,...(U=(J=o.parameters)==null?void 0:J.docs)==null?void 0:U.source},description:{story:"Testimonials section without header (testimonials only)",...(X=(Q=o.parameters)==null?void 0:Q.docs)==null?void 0:X.description}}};var Y,Z,$,ee,te;l.parameters={...l.parameters,docs:{...(Y=l.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    title: 'Student Success Stories',
    subtitle: 'Reviews',
    testimonials: sampleTestimonials.slice(0, 2),
    columns: 2
  }
}`,...($=(Z=l.parameters)==null?void 0:Z.docs)==null?void 0:$.source},description:{story:"Two-column grid layout",...(te=(ee=l.parameters)==null?void 0:ee.docs)==null?void 0:te.description}}};var ae,ie,se,ne,re;c.parameters={...c.parameters,docs:{...(ae=c.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  args: {
    title: 'Transformative Experiences',
    subtitle: 'What Members Say',
    testimonials: sampleTestimonials,
    columns: 3
  }
}`,...(se=(ie=c.parameters)==null?void 0:ie.docs)==null?void 0:se.source},description:{story:"Three-column grid layout (default)",...(re=(ne=c.parameters)==null?void 0:ne.docs)==null?void 0:re.description}}};var oe,le,ce,me,de;m.parameters={...m.parameters,docs:{...(oe=m.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  args: {
    title: 'Join Our Growing Community',
    subtitle: 'Member Feedback',
    testimonials: extendedTestimonials,
    columns: 3
  }
}`,...(ce=(le=m.parameters)==null?void 0:le.docs)==null?void 0:ce.source},description:{story:"Six testimonials in a 3-column grid",...(de=(me=m.parameters)==null?void 0:me.docs)==null?void 0:de.description}}};var ue,pe,ge,he,ve;d.parameters={...d.parameters,docs:{...(ue=d.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  args: {
    title: 'Real Results from Real People',
    subtitle: 'Success Stories',
    testimonials: extendedTestimonials.slice(0, 4),
    columns: 2
  }
}`,...(ge=(pe=d.parameters)==null?void 0:pe.docs)==null?void 0:ge.source},description:{story:"Four testimonials in a 2-column grid",...(ve=(he=d.parameters)==null?void 0:he.docs)==null?void 0:ve.description}}};var ye,be,fe,Se,Te;u.parameters={...u.parameters,docs:{...(ye=u.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  args: {
    title: 'Featured Review',
    subtitle: 'Member Spotlight',
    testimonials: [sampleTestimonials[0]],
    columns: 3
  }
}`,...(fe=(be=u.parameters)==null?void 0:be.docs)==null?void 0:fe.source},description:{story:"Single testimonial (useful for highlighting a featured review)",...(Te=(Se=u.parameters)==null?void 0:Se.docs)==null?void 0:Te.description}}};var we,xe,Ae,Ce,Re;p.parameters={...p.parameters,docs:{...(we=p.parameters)==null?void 0:we.docs,source:{originalSource:`{
  args: {
    title: 'Community Feedback',
    subtitle: 'Recent Reviews',
    testimonials: testimonialsNoAvatar,
    columns: 3
  }
}`,...(Ae=(xe=p.parameters)==null?void 0:xe.docs)==null?void 0:Ae.source},description:{story:"Testimonials without avatars (initials fallback)",...(Re=(Ce=p.parameters)==null?void 0:Ce.docs)==null?void 0:Re.description}}};var Me,ke,Ne,We,Ie;g.parameters={...g.parameters,docs:{...(Me=g.parameters)==null?void 0:Me.docs,source:{originalSource:`{
  args: {
    title: 'Honest Reviews',
    subtitle: 'What Students Say',
    testimonials: [{
      id: '1',
      name: 'Clara Richter',
      location: 'Vienna, Austria',
      testimonial: 'Excellent courses with practical applications. The only thing I wish is that there were more advanced-level content.',
      avatar: 'https://i.pravatar.cc/150?img=20',
      rating: 4
    }, {
      id: '2',
      name: 'Stefan Koch',
      location: 'Salzburg, Austria',
      testimonial: 'Absolutely perfect. Everything I was looking for in a spiritual education platform.',
      avatar: 'https://i.pravatar.cc/150?img=33',
      rating: 5
    }, {
      id: '3',
      name: 'Nina Huber',
      location: 'Innsbruck, Austria',
      testimonial: 'Very good overall. The community is wonderful and the teachers are knowledgeable. Would recommend!',
      avatar: 'https://i.pravatar.cc/150?img=25',
      rating: 4
    }],
    columns: 3
  }
}`,...(Ne=(ke=g.parameters)==null?void 0:ke.docs)==null?void 0:Ne.source},description:{story:"Mixed ratings (showing 4 and 5 star reviews)",...(Ie=(We=g.parameters)==null?void 0:We.docs)==null?void 0:Ie.description}}};var Le,Ve,je,Ee,Fe;h.parameters={...h.parameters,docs:{...(Le=h.parameters)==null?void 0:Le.docs,source:{originalSource:`{
  args: {
    title: 'Excellence in Every Experience',
    subtitle: 'Top Rated',
    testimonials: sampleTestimonials.map(t => ({
      ...t,
      rating: 5
    })),
    columns: 3
  }
}`,...(je=(Ve=h.parameters)==null?void 0:Ve.docs)==null?void 0:je.source},description:{story:"All 5-star testimonials",...(Fe=(Ee=h.parameters)==null?void 0:Ee.docs)==null?void 0:Fe.description}}};var ze,Pe,qe,He,Oe;v.parameters={...v.parameters,docs:{...(ze=v.parameters)==null?void 0:ze.docs,source:{originalSource:`{
  args: {
    title: 'Deep Dive Reviews',
    subtitle: 'Detailed Feedback',
    testimonials: longTestimonials,
    columns: 2
  }
}`,...(qe=(Pe=v.parameters)==null?void 0:Pe.docs)==null?void 0:qe.source},description:{story:"Long-form testimonials with extended text",...(Oe=(He=v.parameters)==null?void 0:He.docs)==null?void 0:Oe.description}}};var De,Be,Ke,Ge,_e;y.parameters={...y.parameters,docs:{...(De=y.parameters)==null?void 0:De.docs,source:{originalSource:`{
  args: {
    title: 'Words from Our Community',
    subtitle: 'Member Voices',
    testimonials: sampleTestimonials.map(({
      rating,
      ...t
    }) => t),
    columns: 3
  }
}`,...(Ke=(Be=y.parameters)==null?void 0:Be.docs)==null?void 0:Ke.source},description:{story:"Testimonials without ratings (quote-focused)",...(_e=(Ge=y.parameters)==null?void 0:Ge.docs)==null?void 0:_e.description}}};var Je,Ue,Qe,Xe,Ye;b.parameters={...b.parameters,docs:{...(Je=b.parameters)==null?void 0:Je.docs,source:{originalSource:`{
  args: {
    title: 'Global Community',
    subtitle: 'Member Reviews',
    testimonials: sampleTestimonials.map(({
      location,
      ...t
    }) => t),
    columns: 3
  }
}`,...(Qe=(Ue=b.parameters)==null?void 0:Ue.docs)==null?void 0:Qe.source},description:{story:"Testimonials without location",...(Ye=(Xe=b.parameters)==null?void 0:Xe.docs)==null?void 0:Ye.description}}};var Ze,$e,et,tt,at;f.parameters={...f.parameters,docs:{...(Ze=f.parameters)==null?void 0:Ze.docs,source:{originalSource:`{
  args: {
    title: 'Timeless Wisdom',
    subtitle: 'Community Praise',
    testimonials: sampleTestimonials.map(({
      date,
      ...t
    }) => t),
    columns: 3
  }
}`,...(et=($e=f.parameters)==null?void 0:$e.docs)==null?void 0:et.source},description:{story:"Testimonials without dates",...(at=(tt=f.parameters)==null?void 0:tt.docs)==null?void 0:at.description}}};var it,st,nt,rt,ot;S.parameters={...S.parameters,docs:{...(it=S.parameters)==null?void 0:it.docs,source:{originalSource:`{
  args: {
    title: 'Advanced Meditation Course Reviews',
    subtitle: 'Student Feedback',
    testimonials: [{
      id: '1',
      name: 'Alexandra Wimmer',
      location: 'Vienna, Austria',
      testimonial: 'This advanced course took my practice to an entirely new level. The techniques are powerful yet accessible.',
      avatar: 'https://i.pravatar.cc/150?img=30',
      rating: 5,
      date: '2024-02-10'
    }, {
      id: '2',
      name: 'Robert Maier',
      location: 'Graz, Austria',
      testimonial: 'Challenging in the best way. I feel like I have the tools to continue deepening my practice for years to come.',
      avatar: 'https://i.pravatar.cc/150?img=31',
      rating: 5,
      date: '2024-02-08'
    }, {
      id: '3',
      name: 'Katharina Lang',
      location: 'Linz, Austria',
      testimonial: 'The progression from beginner to advanced was seamless. Highly structured and incredibly effective.',
      avatar: 'https://i.pravatar.cc/150?img=32',
      rating: 4,
      date: '2024-02-05'
    }],
    columns: 3
  }
}`,...(nt=(st=S.parameters)==null?void 0:st.docs)==null?void 0:nt.source},description:{story:"Course-specific testimonials",...(ot=(rt=S.parameters)==null?void 0:rt.docs)==null?void 0:ot.description}}};var lt,ct,mt,dt,ut;T.parameters={...T.parameters,docs:{...(lt=T.parameters)==null?void 0:lt.docs,source:{originalSource:`{
  args: {
    title: 'Parents Love Kids Ascension',
    subtitle: 'Parent Testimonials',
    testimonials: [{
      id: '1',
      name: 'Sabine Leitner',
      location: 'Vienna, Austria',
      testimonial: 'My children are thriving! The educational content is engaging, age-appropriate, and truly transformative.',
      avatar: 'https://i.pravatar.cc/150?img=40',
      rating: 5
    }, {
      id: '2',
      name: 'Andreas Pichler',
      location: 'Salzburg, Austria',
      testimonial: 'As a parent and educator, I am impressed by the quality and depth of the Kids Ascension curriculum.',
      avatar: 'https://i.pravatar.cc/150?img=41',
      rating: 5
    }, {
      id: '3',
      name: 'Martina Schuster',
      location: 'Innsbruck, Austria',
      testimonial: 'Safe, enriching, and beautifully designed. My kids actually ask to do their lessons!',
      avatar: 'https://i.pravatar.cc/150?img=42',
      rating: 5
    }],
    columns: 3
  }
}`,...(mt=(ct=T.parameters)==null?void 0:ct.docs)==null?void 0:mt.source},description:{story:"Kids Ascension platform testimonials",...(ut=(dt=T.parameters)==null?void 0:dt.docs)==null?void 0:ut.description}}};var pt,gt,ht,vt,yt;w.parameters={...w.parameters,docs:{...(pt=w.parameters)==null?void 0:pt.docs,source:{originalSource:`{
  args: {
    title: 'Custom Padding Example',
    subtitle: 'Extended Spacing',
    testimonials: sampleTestimonials,
    columns: 3,
    className: 'py-20'
  }
}`,...(ht=(gt=w.parameters)==null?void 0:gt.docs)==null?void 0:ht.source},description:{story:"Custom styled with extended padding",...(yt=(vt=w.parameters)==null?void 0:vt.docs)==null?void 0:yt.description}}};var bt,ft,St,Tt,wt;x.parameters={...x.parameters,docs:{...(bt=x.parameters)==null?void 0:bt.docs,source:{originalSource:`{
  args: {
    title: 'Cosmic Testimonials',
    subtitle: 'Community Reviews',
    testimonials: sampleTestimonials,
    columns: 3
  },
  decorators: [Story => <div className="relative min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d1f3a] to-[#0a1628]">
        <Story />
      </div>]
}`,...(St=(ft=x.parameters)==null?void 0:ft.docs)==null?void 0:St.source},description:{story:"Cosmic dark theme showcase",...(wt=(Tt=x.parameters)==null?void 0:Tt.docs)==null?void 0:wt.description}}};var xt,At,Ct,Rt,Mt;A.parameters={...A.parameters,docs:{...(xt=A.parameters)==null?void 0:xt.docs,source:{originalSource:`{
  args: {
    title: 'Clean & Minimal',
    subtitle: 'Reviews',
    testimonials: sampleTestimonials,
    columns: 3
  },
  decorators: [Story => <div className="bg-white min-h-screen">
        <Story />
      </div>]
}`,...(Ct=(At=A.parameters)==null?void 0:At.docs)==null?void 0:Ct.source},description:{story:"Light background variant",...(Mt=(Rt=A.parameters)==null?void 0:Rt.docs)==null?void 0:Mt.description}}};var kt,Nt,Wt,It,Lt;C.parameters={...C.parameters,docs:{...(kt=C.parameters)==null?void 0:kt.docs,source:{originalSource:`{
  args: {
    title: 'Ozean Licht Reviews',
    subtitle: 'Transformative Experiences',
    testimonials: sampleTestimonials,
    columns: 3
  },
  decorators: [Story => <div className="relative min-h-screen bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0ec2bc]/5 via-transparent to-[#0ec2bc]/5 pointer-events-none" />
        <Story />
      </div>]
}`,...(Wt=(Nt=C.parameters)==null?void 0:Nt.docs)==null?void 0:Wt.source},description:{story:"Turquoise accent showcase (Ozean Licht branding)",...(Lt=(It=C.parameters)==null?void 0:It.docs)==null?void 0:Lt.description}}};var Vt,jt,Et,Ft,zt;R.parameters={...R.parameters,docs:{...(Vt=R.parameters)==null?void 0:Vt.docs,source:{originalSource:`{
  args: {
    title: 'Responsive Grid',
    subtitle: 'Mobile First Design',
    testimonials: sampleTestimonials,
    columns: 3
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
}`,...(Et=(jt=R.parameters)==null?void 0:jt.docs)==null?void 0:Et.source},description:{story:"Responsive preview showing mobile layout",...(zt=(Ft=R.parameters)==null?void 0:Ft.docs)==null?void 0:zt.description}}};var Pt,qt,Ht,Ot,Dt;M.parameters={...M.parameters,docs:{...(Pt=M.parameters)==null?void 0:Pt.docs,source:{originalSource:`{
  args: {
    title: 'Community Voices',
    subtitle: 'What Our Members Say',
    testimonials: [...extendedTestimonials, {
      id: '7',
      name: 'Eva Brunner',
      location: 'Vienna, Austria',
      testimonial: 'Life-changing content and wonderful community. So grateful I found this platform!',
      avatar: 'https://i.pravatar.cc/150?img=21',
      rating: 5
    }, {
      id: '8',
      name: 'Florian Ebner',
      location: 'Graz, Austria',
      testimonial: 'The quality of instruction is unmatched. Highly professional and deeply authentic.',
      avatar: 'https://i.pravatar.cc/150?img=22',
      rating: 5
    }, {
      id: '9',
      name: 'Sandra Eder',
      location: 'Salzburg, Austria',
      testimonial: 'From the first lesson, I knew I had found something special. Absolutely transformative!',
      avatar: 'https://i.pravatar.cc/150?img=23',
      rating: 4
    }],
    columns: 3
  }
}`,...(Ht=(qt=M.parameters)==null?void 0:qt.docs)==null?void 0:Ht.source},description:{story:"Large collection (9 testimonials)",...(Dt=(Ot=M.parameters)==null?void 0:Ot.docs)==null?void 0:Dt.description}}};var Bt,Kt,Gt,_t,Jt;k.parameters={...k.parameters,docs:{...(Bt=k.parameters)==null?void 0:Bt.docs,source:{originalSource:`{
  args: {
    title: 'Featured',
    testimonials: [sampleTestimonials[0]],
    columns: 3
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
}`,...(Gt=(Kt=k.parameters)==null?void 0:Kt.docs)==null?void 0:Gt.source},description:{story:"Minimal single column on small screens",...(Jt=(_t=k.parameters)==null?void 0:_t.docs)==null?void 0:Jt.description}}};var Ut,Qt,Xt,Yt,Zt;N.parameters={...N.parameters,docs:{...(Ut=N.parameters)==null?void 0:Ut.docs,source:{originalSource:`{
  render: () => <div className="space-y-16 bg-[var(--background)] py-8">
      <TestimonialsSection title="Three Columns Default" subtitle="Standard Layout" testimonials={sampleTestimonials} columns={3} />

      <div className="h-px bg-[var(--border)]" />

      <TestimonialsSection title="Two Columns Wide" subtitle="Alternative Layout" testimonials={sampleTestimonials.slice(0, 2)} columns={2} />

      <div className="h-px bg-[var(--border)]" />

      <TestimonialsSection title="No Header Style" testimonials={sampleTestimonials} columns={3} />

      <div className="h-px bg-[var(--border)]" />

      <TestimonialsSection subtitle="Subtitle Only" testimonials={sampleTestimonials.slice(0, 2)} columns={2} />
    </div>
}`,...(Xt=(Qt=N.parameters)==null?void 0:Qt.docs)==null?void 0:Xt.source},description:{story:"Showcase all layout variants",...(Zt=(Yt=N.parameters)==null?void 0:Yt.docs)==null?void 0:Zt.description}}};var $t,ea,ta,aa,ia;W.parameters={...W.parameters,docs:{...($t=W.parameters)==null?void 0:$t.docs,source:{originalSource:`{
  args: {
    title: 'What Students Are Saying',
    subtitle: 'Course Reviews',
    testimonials: [{
      id: '1',
      name: 'Maria Schmidt',
      location: 'Vienna, Austria',
      testimonial: 'This course exceeded all my expectations. The structured approach and expert guidance helped me establish a consistent meditation practice.',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      date: '2024-02-15'
    }, {
      id: '2',
      name: 'Hans Mueller',
      location: 'Salzburg, Austria',
      testimonial: 'Practical, accessible, and deeply transformative. I recommend this to everyone interested in mindfulness.',
      avatar: 'https://i.pravatar.cc/150?img=12',
      rating: 5,
      date: '2024-02-12'
    }, {
      id: '3',
      name: 'Sophie Weber',
      location: 'Innsbruck, Austria',
      testimonial: 'The community support and clear instruction made learning meditation easier than I ever imagined.',
      avatar: 'https://i.pravatar.cc/150?img=5',
      rating: 4,
      date: '2024-02-10'
    }],
    columns: 3
  },
  decorators: [Story => <div className="bg-gradient-to-b from-[#0a1628] to-[#0a0a0a] min-h-screen">
        <Story />
      </div>]
}`,...(ta=(ea=W.parameters)==null?void 0:ea.docs)==null?void 0:ta.source},description:{story:"Real-world example: Course landing page",...(ia=(aa=W.parameters)==null?void 0:aa.docs)==null?void 0:ia.description}}};var sa,na,ra,oa,la;I.parameters={...I.parameters,docs:{...(sa=I.parameters)==null?void 0:sa.docs,source:{originalSource:`{
  args: {
    title: 'Trusted by Thousands',
    subtitle: 'Join Our Community',
    testimonials: extendedTestimonials.slice(0, 3),
    columns: 3
  }
}`,...(ra=(na=I.parameters)==null?void 0:na.docs)==null?void 0:ra.source},description:{story:"Real-world example: Homepage social proof",...(la=(oa=I.parameters)==null?void 0:oa.docs)==null?void 0:la.description}}};var ca,ma,da,ua,pa;L.parameters={...L.parameters,docs:{...(ca=L.parameters)==null?void 0:ca.docs,source:{originalSource:`{
  args: {
    title: 'Why Members Choose Us',
    subtitle: 'Member Success',
    testimonials: [{
      id: '1',
      name: 'Elisabeth Wagner',
      location: 'Vienna, Austria',
      testimonial: 'Best investment in myself I have ever made. The value far exceeds the price.',
      avatar: 'https://i.pravatar.cc/150?img=10',
      rating: 5
    }, {
      id: '2',
      name: 'Martin Berger',
      location: 'Salzburg, Austria',
      testimonial: 'Worth every cent. The quality of content and community support is unparalleled.',
      avatar: 'https://i.pravatar.cc/150?img=15',
      rating: 5
    }],
    columns: 2
  }
}`,...(da=(ma=L.parameters)==null?void 0:ma.docs)==null?void 0:da.source},description:{story:"Real-world example: Pricing page testimonials",...(pa=(ua=L.parameters)==null?void 0:ua.docs)==null?void 0:pa.description}}};const Ha=["Default","TitleOnly","NoHeader","TwoColumns","ThreeColumns","SixTestimonials","FourTestimonials","SingleTestimonial","WithoutAvatars","MixedRatings","AllFiveStars","LongForm","WithoutRatings","WithoutLocation","WithoutDates","CourseReviews","KidsAscension","CustomStyled","CosmicTheme","LightBackground","TurquoiseAccent","ResponsiveDemo","LargeCollection","MinimalMobile","AllVariants","CourseLandingPage","HomepageSocialProof","PricingPageTestimonials"];export{h as AllFiveStars,N as AllVariants,x as CosmicTheme,W as CourseLandingPage,S as CourseReviews,w as CustomStyled,n as Default,d as FourTestimonials,I as HomepageSocialProof,T as KidsAscension,M as LargeCollection,A as LightBackground,v as LongForm,k as MinimalMobile,g as MixedRatings,o as NoHeader,L as PricingPageTestimonials,R as ResponsiveDemo,u as SingleTestimonial,m as SixTestimonials,c as ThreeColumns,r as TitleOnly,C as TurquoiseAccent,l as TwoColumns,p as WithoutAvatars,f as WithoutDates,b as WithoutLocation,y as WithoutRatings,Ha as __namedExportsOrder,qa as default};
