import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{C as Dt,d as kt}from"./Card-CHzXRqp1.js";import{c as Kt}from"./cn-CKXzwFwe.js";import{T as jt,a as O}from"./trending-up-4KQp64av.js";import{c as G}from"./createLucideIcon-BbF4D6Jl.js";import{U as W}from"./users-DqXpMwnv.js";import{B as F}from"./book-open-DNYwrNLu.js";import{S as P}from"./star-DeLbPkV3.js";import{C as I}from"./clock-lsPh53_V.js";import"./index-B2-qRKKC.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-Dp3B9jqt.js";import"./clsx-B-dksMZM.js";import"./card-DPYCUmwK.js";/**
 * @license lucide-react v0.553.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const It=[["path",{d:"m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",key:"1yiouv"}],["circle",{cx:"12",cy:"8",r:"6",key:"1vp47v"}]],Ct=G("award",It);/**
 * @license lucide-react v0.553.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lt=[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]],Vt=G("dollar-sign",Lt);/**
 * @license lucide-react v0.553.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _t=[["path",{d:"M16 17h6v-6",key:"t6n2it"}],["path",{d:"m22 17-8.5-8.5-5 5L2 7",key:"x473p"}]],Ft=G("trending-down",_t);function s({stat:t,className:Mt,showTrend:Rt=!0}){return e.jsx(Dt,{variant:"default",hover:!0,className:Mt,children:e.jsx(kt,{className:"p-6",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-[var(--muted-foreground)] text-sm",children:t.label}),e.jsx("p",{className:"text-4xl font-bold text-primary",children:t.value}),Rt&&t.trend&&t.trendValue&&e.jsxs("div",{className:Kt("flex items-center gap-1 text-sm",t.trend==="up"&&"text-green-500",t.trend==="down"&&"text-red-500",t.trend==="neutral"&&"text-[var(--muted-foreground)]"),children:[t.trend==="up"&&e.jsx(jt,{className:"w-4 h-4"}),t.trend==="down"&&e.jsx(Ft,{className:"w-4 h-4"}),e.jsx("span",{children:t.trendValue})]})]}),t.icon&&e.jsx("div",{className:"text-primary opacity-20",children:t.icon})]})})})}s.displayName="StatsCard";try{s.displayName="StatsCard",s.__docgenInfo={description:"",displayName:"StatsCard",props:{stat:{defaultValue:null,description:"",name:"stat",required:!0,type:{name:"Stat"}},className:{defaultValue:null,description:"Custom className for styling",name:"className",required:!1,type:{name:"string"}},showTrend:{defaultValue:{value:"true"},description:"Show trend indicator",name:"showTrend",required:!1,type:{name:"boolean"}}}}}catch{}const sr={title:"Tier 3: Compositions/Cards/StatsCard",component:s,parameters:{layout:"centered",docs:{description:{component:"Statistics card composition for displaying metrics, KPIs, and analytics data. Features trend indicators, decorative icons, and glass morphism design optimized for Ozean Licht branding."}}},tags:["autodocs"],argTypes:{stat:{description:"Statistics data object with label, value, trend, and optional icon",control:"object"},className:{description:"Custom className for styling",control:"text"},showTrend:{description:"Display trend indicator with icon and value",control:"boolean",table:{defaultValue:{summary:"true"}}}},decorators:[t=>e.jsx("div",{className:"w-full max-w-sm",children:e.jsx(t,{})})]},r={id:"1",label:"Total Students",value:"12,543",trend:"up",trendValue:"+12.5%",icon:e.jsx(W,{className:"w-12 h-12"})},a={id:"2",label:"Active Courses",value:"48",trend:"up",trendValue:"+8 this month",icon:e.jsx(F,{className:"w-12 h-12"})},o={id:"3",label:"Average Rating",value:"4.9",trend:"up",trendValue:"+0.2",icon:e.jsx(P,{className:"w-12 h-12"})},L={id:"4",label:"Completion Rate",value:"87%",trend:"up",trendValue:"+5%",icon:e.jsx(Ct,{className:"w-12 h-12"})},z={id:"5",label:"Monthly Revenue",value:"€24,589",trend:"up",trendValue:"+18.2%",icon:e.jsx(Vt,{className:"w-12 h-12"})},q={id:"6",label:"Total Watch Time",value:"3,420h",trend:"up",trendValue:"+420h",icon:e.jsx(I,{className:"w-12 h-12"})},_={id:"7",label:"Enrollment Rate",value:"68%",trend:"down",trendValue:"-3.2%",icon:e.jsx(jt,{className:"w-12 h-12"})},U={id:"8",label:"Active Sessions",value:"2,108",trend:"neutral",trendValue:"±0%",icon:e.jsx(O,{className:"w-12 h-12"})},B={id:"9",label:"Community Members",value:"8,432",trend:"up",trendValue:"+156 today"},E={id:"10",label:"Total Certificates",value:"5,823",icon:e.jsx(Ct,{className:"w-12 h-12"})},Pt={id:"11",label:"Meditation Minutes",value:"1.2M",trend:"up",trendValue:"+340K",icon:e.jsx(I,{className:"w-12 h-12"})},Ut={id:"12",label:"Premium Courses",value:"12",trend:"up",trendValue:"+2",icon:e.jsx(F,{className:"w-12 h-12"})},Ot={id:"13",label:"Status",value:"Excellent",trend:"up",trendValue:"Improving",icon:e.jsx(P,{className:"w-12 h-12"})},At={id:"14",label:"Average Course Completion Time (Days)",value:"28",trend:"down",trendValue:"-4 days",icon:e.jsx(I,{className:"w-12 h-12"})},d={args:{stat:r,showTrend:!0}},n={args:{stat:_,showTrend:!0}},i={args:{stat:U,showTrend:!0}},l={args:{stat:B,showTrend:!0}},c={args:{stat:E,showTrend:!1}},m={args:{stat:r,showTrend:!1},parameters:{docs:{description:{story:"Stats card with trend data available but hidden via showTrend=false prop."}}}},u={args:{stat:a,showTrend:!0}},p={args:{stat:o,showTrend:!0}},h={args:{stat:L,showTrend:!0}},g={args:{stat:z,showTrend:!0}},w={args:{stat:q,showTrend:!0}},x={args:{stat:Pt,showTrend:!0}},v={args:{stat:Ut,showTrend:!0}},S={args:{stat:Ot,showTrend:!0},parameters:{docs:{description:{story:"Stats card displaying text values instead of numbers."}}}},T={args:{stat:At,showTrend:!0},parameters:{docs:{description:{story:"Stats card with longer label text demonstrating text wrapping."}}}},b={args:{stat:{label:"Active Users",value:"342"},showTrend:!1},parameters:{docs:{description:{story:"Minimal stats card with only label and value."}}}},f={args:{stat:r,showTrend:!0,className:"shadow-[0_0_30px_rgba(14,194,188,0.4)] scale-105"},parameters:{docs:{description:{story:"Stats card with custom className for enhanced turquoise glow effect."}}}},y={render:()=>e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-4xl",children:[e.jsx(s,{stat:r,showTrend:!0}),e.jsx(s,{stat:a,showTrend:!0})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Two-column grid layout for side-by-side stat comparison."}}}},N={render:()=>e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-6xl",children:[e.jsx(s,{stat:r,showTrend:!0}),e.jsx(s,{stat:a,showTrend:!0}),e.jsx(s,{stat:o,showTrend:!0})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Three-column responsive grid layout for dashboard KPIs."}}}},j={render:()=>e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 max-w-7xl",children:[e.jsx(s,{stat:r,showTrend:!0}),e.jsx(s,{stat:a,showTrend:!0}),e.jsx(s,{stat:o,showTrend:!0}),e.jsx(s,{stat:L,showTrend:!0})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Four-column grid layout for comprehensive dashboard overview."}}}},C={render:()=>e.jsxs("div",{className:"space-y-8 p-6 max-w-7xl",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold mb-6 text-[var(--foreground)]",children:"Key Performance Indicators"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",children:[e.jsx(s,{stat:r,showTrend:!0}),e.jsx(s,{stat:a,showTrend:!0}),e.jsx(s,{stat:o,showTrend:!0}),e.jsx(s,{stat:L,showTrend:!0})]})]}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold mb-6 text-[var(--foreground)]",children:"Financial Metrics"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:[e.jsx(s,{stat:z,showTrend:!0}),e.jsx(s,{stat:q,showTrend:!0}),e.jsx(s,{stat:_,showTrend:!0})]})]}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold mb-6 text-[var(--foreground)]",children:"Community Metrics"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:[e.jsx(s,{stat:B,showTrend:!0}),e.jsx(s,{stat:U,showTrend:!0}),e.jsx(s,{stat:E,showTrend:!1})]})]})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Complete dashboard view with multiple stat categories and metrics."}}}},V={render:()=>e.jsxs("div",{className:"space-y-8 p-6 max-w-5xl",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"Upward Trends (Green)"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[e.jsx(s,{stat:r,showTrend:!0}),e.jsx(s,{stat:a,showTrend:!0}),e.jsx(s,{stat:o,showTrend:!0})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"Downward Trends (Red)"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[e.jsx(s,{stat:_,showTrend:!0}),e.jsx(s,{stat:At,showTrend:!0}),e.jsx(s,{stat:{label:"Response Time",value:"2.4s",trend:"down",trendValue:"-0.6s",icon:e.jsx(I,{className:"w-12 h-12"})},showTrend:!0})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"Neutral Trends (Gray)"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[e.jsx(s,{stat:U,showTrend:!0}),e.jsx(s,{stat:{label:"Pending Reviews",value:"42",trend:"neutral",trendValue:"Stable",icon:e.jsx(P,{className:"w-12 h-12"})},showTrend:!0}),e.jsx(s,{stat:{label:"Server Uptime",value:"99.9%",trend:"neutral",trendValue:"No change",icon:e.jsx(O,{className:"w-12 h-12"})},showTrend:!0})]})]})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Comprehensive showcase of all trend indicator types with color coding."}}}},A={render:()=>e.jsxs("div",{className:"space-y-8 p-6 max-w-7xl",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"With Icons & Trends"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",children:[e.jsx(s,{stat:r,showTrend:!0}),e.jsx(s,{stat:a,showTrend:!0}),e.jsx(s,{stat:o,showTrend:!0}),e.jsx(s,{stat:L,showTrend:!0})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"Without Trends"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",children:[e.jsx(s,{stat:r,showTrend:!1}),e.jsx(s,{stat:a,showTrend:!1}),e.jsx(s,{stat:o,showTrend:!1}),e.jsx(s,{stat:E,showTrend:!1})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"Without Icons"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",children:[e.jsx(s,{stat:B,showTrend:!0}),e.jsx(s,{stat:{label:"Downloads",value:"15.2K",trend:"up",trendValue:"+2.1K"},showTrend:!0}),e.jsx(s,{stat:{label:"Subscribers",value:"8,945",trend:"up",trendValue:"+234"},showTrend:!0}),e.jsx(s,{stat:{label:"Shares",value:"1,823",trend:"up",trendValue:"+45"},showTrend:!0})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4 text-[var(--foreground)]",children:"Minimal (No Icons, No Trends)"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",children:[e.jsx(s,{stat:{label:"Views",value:"24.5K"},showTrend:!1}),e.jsx(s,{stat:{label:"Clicks",value:"8,432"},showTrend:!1}),e.jsx(s,{stat:{label:"Conversions",value:"342"},showTrend:!1}),e.jsx(s,{stat:{label:"Impressions",value:"145K"},showTrend:!1})]})]})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Complete showcase of all stat card variations and combinations."}}}},M={render:()=>e.jsx("div",{className:"min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8",children:e.jsxs("div",{className:"max-w-7xl mx-auto",children:[e.jsxs("div",{className:"text-center mb-12",children:[e.jsx("h1",{className:"text-4xl font-bold text-white mb-4",children:"Platform Analytics"}),e.jsx("p",{className:"text-[var(--muted-foreground)] text-lg",children:"Real-time metrics from Ozean Licht"})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",children:[e.jsx(s,{stat:r,showTrend:!0}),e.jsx(s,{stat:a,showTrend:!0}),e.jsx(s,{stat:o,showTrend:!0}),e.jsx(s,{stat:L,showTrend:!0}),e.jsx(s,{stat:z,showTrend:!0}),e.jsx(s,{stat:q,showTrend:!0}),e.jsx(s,{stat:_,showTrend:!0}),e.jsx(s,{stat:U,showTrend:!0})]})]})}),parameters:{layout:"fullscreen",docs:{description:{story:"Stats cards displayed on cosmic dark background with Ozean Licht branding."}}}},R={args:{stat:r,showTrend:!0},decorators:[t=>e.jsx("div",{className:"w-full max-w-[320px]",children:e.jsx(t,{})})],parameters:{viewport:{defaultViewport:"mobile1"},docs:{description:{story:"Stats card optimized for mobile viewports."}}}},D={render:()=>e.jsxs("div",{className:"flex flex-col gap-4 p-4 max-w-[360px]",children:[e.jsx(s,{stat:r,showTrend:!0}),e.jsx(s,{stat:a,showTrend:!0}),e.jsx(s,{stat:o,showTrend:!0}),e.jsx(s,{stat:_,showTrend:!0})]}),parameters:{viewport:{defaultViewport:"mobile1"},layout:"fullscreen",docs:{description:{story:"Vertically stacked stats cards for mobile dashboard view."}}}},k={render:()=>e.jsx("div",{className:"space-y-6 p-6 max-w-7xl",children:e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold mb-6 text-[var(--foreground)]",children:"Kids Ascension - Platform Metrics"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",children:[e.jsx(s,{stat:{label:"Active Kids",value:"3,845",trend:"up",trendValue:"+234 this week",icon:e.jsx(W,{className:"w-12 h-12"})},showTrend:!0}),e.jsx(s,{stat:{label:"Learning Activities",value:"127",trend:"up",trendValue:"+12 new",icon:e.jsx(F,{className:"w-12 h-12"})},showTrend:!0}),e.jsx(s,{stat:{label:"Average Age",value:"8.5",trend:"neutral",trendValue:"Stable",icon:e.jsx(O,{className:"w-12 h-12"})},showTrend:!0}),e.jsx(s,{stat:{label:"Parent Satisfaction",value:"97%",trend:"up",trendValue:"+2%",icon:e.jsx(P,{className:"w-12 h-12"})},showTrend:!0})]})]})}),parameters:{layout:"fullscreen",docs:{description:{story:"Dashboard metrics specifically for Kids Ascension educational platform."}}}},K={render:()=>e.jsxs("div",{className:"space-y-6 p-6 max-w-7xl",children:[e.jsxs("div",{className:"flex items-center justify-between mb-6",children:[e.jsx("h2",{className:"text-2xl font-bold text-[var(--foreground)]",children:"Live Metrics"}),e.jsxs("div",{className:"flex items-center gap-2 text-sm text-[var(--muted-foreground)]",children:[e.jsx("div",{className:"w-2 h-2 bg-green-500 rounded-full animate-pulse"}),e.jsx("span",{children:"Updated in real-time"})]})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",children:[e.jsx(s,{stat:{label:"Online Now",value:"1,234",trend:"up",trendValue:"+56",icon:e.jsx(W,{className:"w-12 h-12"})},showTrend:!0}),e.jsx(s,{stat:{label:"Active Sessions",value:"842",trend:"up",trendValue:"+23",icon:e.jsx(I,{className:"w-12 h-12"})},showTrend:!0}),e.jsx(s,{stat:{label:"Current Revenue",value:"€1,245",trend:"up",trendValue:"+€89",icon:e.jsx(Vt,{className:"w-12 h-12"})},showTrend:!0}),e.jsx(s,{stat:{label:"Lessons Started",value:"345",trend:"up",trendValue:"+12",icon:e.jsx(F,{className:"w-12 h-12"})},showTrend:!0})]})]}),parameters:{layout:"fullscreen",docs:{description:{story:"Real-time metrics dashboard with live update indicator."}}}};var H,$,J,Q,X;d.parameters={...d.parameters,docs:{...(H=d.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    stat: studentsStat,
    showTrend: true
  }
}`,...(J=($=d.parameters)==null?void 0:$.docs)==null?void 0:J.source},description:{story:"Default stats card with upward trend",...(X=(Q=d.parameters)==null?void 0:Q.docs)==null?void 0:X.description}}};var Y,Z,ee,se,te;n.parameters={...n.parameters,docs:{...(Y=n.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    stat: enrollmentDeclineStat,
    showTrend: true
  }
}`,...(ee=(Z=n.parameters)==null?void 0:Z.docs)==null?void 0:ee.source},description:{story:"Stats card with downward trend (red indicator)",...(te=(se=n.parameters)==null?void 0:se.docs)==null?void 0:te.description}}};var re,ae,oe,de,ne;i.parameters={...i.parameters,docs:{...(re=i.parameters)==null?void 0:re.docs,source:{originalSource:`{
  args: {
    stat: neutralStat,
    showTrend: true
  }
}`,...(oe=(ae=i.parameters)==null?void 0:ae.docs)==null?void 0:oe.source},description:{story:"Stats card with neutral trend (gray indicator)",...(ne=(de=i.parameters)==null?void 0:de.docs)==null?void 0:ne.description}}};var ie,le,ce,me,ue;l.parameters={...l.parameters,docs:{...(ie=l.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  args: {
    stat: noIconStat,
    showTrend: true
  }
}`,...(ce=(le=l.parameters)==null?void 0:le.docs)==null?void 0:ce.source},description:{story:"Stats card without icon",...(ue=(me=l.parameters)==null?void 0:me.docs)==null?void 0:ue.description}}};var pe,he,ge,we,xe;c.parameters={...c.parameters,docs:{...(pe=c.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  args: {
    stat: noTrendStat,
    showTrend: false
  }
}`,...(ge=(he=c.parameters)==null?void 0:he.docs)==null?void 0:ge.source},description:{story:"Stats card without trend indicator",...(xe=(we=c.parameters)==null?void 0:we.docs)==null?void 0:xe.description}}};var ve,Se,Te,be,fe;m.parameters={...m.parameters,docs:{...(ve=m.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  args: {
    stat: studentsStat,
    showTrend: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Stats card with trend data available but hidden via showTrend=false prop.'
      }
    }
  }
}`,...(Te=(Se=m.parameters)==null?void 0:Se.docs)==null?void 0:Te.source},description:{story:"Stats card with trend hidden via prop",...(fe=(be=m.parameters)==null?void 0:be.docs)==null?void 0:fe.description}}};var ye,Ne,je,Ce,Ve;u.parameters={...u.parameters,docs:{...(ye=u.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  args: {
    stat: coursesStat,
    showTrend: true
  }
}`,...(je=(Ne=u.parameters)==null?void 0:Ne.docs)==null?void 0:je.source},description:{story:"Course statistics card",...(Ve=(Ce=u.parameters)==null?void 0:Ce.docs)==null?void 0:Ve.description}}};var Ae,Me,Re,De,ke;p.parameters={...p.parameters,docs:{...(Ae=p.parameters)==null?void 0:Ae.docs,source:{originalSource:`{
  args: {
    stat: ratingsStat,
    showTrend: true
  }
}`,...(Re=(Me=p.parameters)==null?void 0:Me.docs)==null?void 0:Re.source},description:{story:"Rating statistics card",...(ke=(De=p.parameters)==null?void 0:De.docs)==null?void 0:ke.description}}};var Ke,Ie,Le,_e,Fe;h.parameters={...h.parameters,docs:{...(Ke=h.parameters)==null?void 0:Ke.docs,source:{originalSource:`{
  args: {
    stat: completionStat,
    showTrend: true
  }
}`,...(Le=(Ie=h.parameters)==null?void 0:Ie.docs)==null?void 0:Le.source},description:{story:"Completion rate card",...(Fe=(_e=h.parameters)==null?void 0:_e.docs)==null?void 0:Fe.description}}};var Pe,Ue,Oe,Ge,We;g.parameters={...g.parameters,docs:{...(Pe=g.parameters)==null?void 0:Pe.docs,source:{originalSource:`{
  args: {
    stat: revenueStat,
    showTrend: true
  }
}`,...(Oe=(Ue=g.parameters)==null?void 0:Ue.docs)==null?void 0:Oe.source},description:{story:"Revenue statistics card",...(We=(Ge=g.parameters)==null?void 0:Ge.docs)==null?void 0:We.description}}};var ze,qe,Be,Ee,He;w.parameters={...w.parameters,docs:{...(ze=w.parameters)==null?void 0:ze.docs,source:{originalSource:`{
  args: {
    stat: watchTimeStat,
    showTrend: true
  }
}`,...(Be=(qe=w.parameters)==null?void 0:qe.docs)==null?void 0:Be.source},description:{story:"Watch time statistics card",...(He=(Ee=w.parameters)==null?void 0:Ee.docs)==null?void 0:He.description}}};var $e,Je,Qe,Xe,Ye;x.parameters={...x.parameters,docs:{...($e=x.parameters)==null?void 0:$e.docs,source:{originalSource:`{
  args: {
    stat: largeNumberStat,
    showTrend: true
  }
}`,...(Qe=(Je=x.parameters)==null?void 0:Je.docs)==null?void 0:Qe.source},description:{story:"Stats card with large number (millions)",...(Ye=(Xe=x.parameters)==null?void 0:Xe.docs)==null?void 0:Ye.description}}};var Ze,es,ss,ts,rs;v.parameters={...v.parameters,docs:{...(Ze=v.parameters)==null?void 0:Ze.docs,source:{originalSource:`{
  args: {
    stat: smallNumberStat,
    showTrend: true
  }
}`,...(ss=(es=v.parameters)==null?void 0:es.docs)==null?void 0:ss.source},description:{story:"Stats card with small number",...(rs=(ts=v.parameters)==null?void 0:ts.docs)==null?void 0:rs.description}}};var as,os,ds,ns,is;S.parameters={...S.parameters,docs:{...(as=S.parameters)==null?void 0:as.docs,source:{originalSource:`{
  args: {
    stat: textValueStat,
    showTrend: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Stats card displaying text values instead of numbers.'
      }
    }
  }
}`,...(ds=(os=S.parameters)==null?void 0:os.docs)==null?void 0:ds.source},description:{story:"Stats card with text value (non-numeric)",...(is=(ns=S.parameters)==null?void 0:ns.docs)==null?void 0:is.description}}};var ls,cs,ms,us,ps;T.parameters={...T.parameters,docs:{...(ls=T.parameters)==null?void 0:ls.docs,source:{originalSource:`{
  args: {
    stat: longLabelStat,
    showTrend: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Stats card with longer label text demonstrating text wrapping.'
      }
    }
  }
}`,...(ms=(cs=T.parameters)==null?void 0:cs.docs)==null?void 0:ms.source},description:{story:"Stats card with long label",...(ps=(us=T.parameters)==null?void 0:us.docs)==null?void 0:ps.description}}};var hs,gs,ws,xs,vs;b.parameters={...b.parameters,docs:{...(hs=b.parameters)==null?void 0:hs.docs,source:{originalSource:`{
  args: {
    stat: {
      label: 'Active Users',
      value: '342'
    },
    showTrend: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal stats card with only label and value.'
      }
    }
  }
}`,...(ws=(gs=b.parameters)==null?void 0:gs.docs)==null?void 0:ws.source},description:{story:"Minimal stats card (no icon, no trend)",...(vs=(xs=b.parameters)==null?void 0:xs.docs)==null?void 0:vs.description}}};var Ss,Ts,bs,fs,ys;f.parameters={...f.parameters,docs:{...(Ss=f.parameters)==null?void 0:Ss.docs,source:{originalSource:`{
  args: {
    stat: studentsStat,
    showTrend: true,
    className: 'shadow-[0_0_30px_rgba(14,194,188,0.4)] scale-105'
  },
  parameters: {
    docs: {
      description: {
        story: 'Stats card with custom className for enhanced turquoise glow effect.'
      }
    }
  }
}`,...(bs=(Ts=f.parameters)==null?void 0:Ts.docs)==null?void 0:bs.source},description:{story:"Stats card with custom styling",...(ys=(fs=f.parameters)==null?void 0:fs.docs)==null?void 0:ys.description}}};var Ns,js,Cs,Vs,As;y.parameters={...y.parameters,docs:{...(Ns=y.parameters)==null?void 0:Ns.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-4xl">
      <StatsCard stat={studentsStat} showTrend />
      <StatsCard stat={coursesStat} showTrend />
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Two-column grid layout for side-by-side stat comparison.'
      }
    }
  }
}`,...(Cs=(js=y.parameters)==null?void 0:js.docs)==null?void 0:Cs.source},description:{story:"Dashboard grid layout with 2 columns",...(As=(Vs=y.parameters)==null?void 0:Vs.docs)==null?void 0:As.description}}};var Ms,Rs,Ds,ks,Ks;N.parameters={...N.parameters,docs:{...(Ms=N.parameters)==null?void 0:Ms.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-6xl">
      <StatsCard stat={studentsStat} showTrend />
      <StatsCard stat={coursesStat} showTrend />
      <StatsCard stat={ratingsStat} showTrend />
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Three-column responsive grid layout for dashboard KPIs.'
      }
    }
  }
}`,...(Ds=(Rs=N.parameters)==null?void 0:Rs.docs)==null?void 0:Ds.source},description:{story:"Dashboard grid layout with 3 columns",...(Ks=(ks=N.parameters)==null?void 0:ks.docs)==null?void 0:Ks.description}}};var Is,Ls,_s,Fs,Ps;j.parameters={...j.parameters,docs:{...(Is=j.parameters)==null?void 0:Is.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 max-w-7xl">
      <StatsCard stat={studentsStat} showTrend />
      <StatsCard stat={coursesStat} showTrend />
      <StatsCard stat={ratingsStat} showTrend />
      <StatsCard stat={completionStat} showTrend />
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Four-column grid layout for comprehensive dashboard overview.'
      }
    }
  }
}`,...(_s=(Ls=j.parameters)==null?void 0:Ls.docs)==null?void 0:_s.source},description:{story:"Dashboard grid layout with 4 columns",...(Ps=(Fs=j.parameters)==null?void 0:Fs.docs)==null?void 0:Ps.description}}};var Us,Os,Gs,Ws,zs;C.parameters={...C.parameters,docs:{...(Us=C.parameters)==null?void 0:Us.docs,source:{originalSource:`{
  render: () => <div className="space-y-8 p-6 max-w-7xl">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)]">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard stat={studentsStat} showTrend />
          <StatsCard stat={coursesStat} showTrend />
          <StatsCard stat={ratingsStat} showTrend />
          <StatsCard stat={completionStat} showTrend />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)]">Financial Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard stat={revenueStat} showTrend />
          <StatsCard stat={watchTimeStat} showTrend />
          <StatsCard stat={enrollmentDeclineStat} showTrend />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)]">Community Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard stat={noIconStat} showTrend />
          <StatsCard stat={neutralStat} showTrend />
          <StatsCard stat={noTrendStat} showTrend={false} />
        </div>
      </div>
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Complete dashboard view with multiple stat categories and metrics.'
      }
    }
  }
}`,...(Gs=(Os=C.parameters)==null?void 0:Os.docs)==null?void 0:Gs.source},description:{story:"Full dashboard metrics view",...(zs=(Ws=C.parameters)==null?void 0:Ws.docs)==null?void 0:zs.description}}};var qs,Bs,Es,Hs,$s;V.parameters={...V.parameters,docs:{...(qs=V.parameters)==null?void 0:qs.docs,source:{originalSource:`{
  render: () => <div className="space-y-8 p-6 max-w-5xl">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Upward Trends (Green)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard stat={studentsStat} showTrend />
          <StatsCard stat={coursesStat} showTrend />
          <StatsCard stat={ratingsStat} showTrend />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Downward Trends (Red)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard stat={enrollmentDeclineStat} showTrend />
          <StatsCard stat={longLabelStat} showTrend />
          <StatsCard stat={{
          label: 'Response Time',
          value: '2.4s',
          trend: 'down',
          trendValue: '-0.6s',
          icon: <Clock className="w-12 h-12" />
        }} showTrend />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Neutral Trends (Gray)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard stat={neutralStat} showTrend />
          <StatsCard stat={{
          label: 'Pending Reviews',
          value: '42',
          trend: 'neutral',
          trendValue: 'Stable',
          icon: <Star className="w-12 h-12" />
        }} showTrend />
          <StatsCard stat={{
          label: 'Server Uptime',
          value: '99.9%',
          trend: 'neutral',
          trendValue: 'No change',
          icon: <Target className="w-12 h-12" />
        }} showTrend />
        </div>
      </div>
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Comprehensive showcase of all trend indicator types with color coding.'
      }
    }
  }
}`,...(Es=(Bs=V.parameters)==null?void 0:Bs.docs)==null?void 0:Es.source},description:{story:"All trend types showcase",...($s=(Hs=V.parameters)==null?void 0:Hs.docs)==null?void 0:$s.description}}};var Js,Qs,Xs,Ys,Zs;A.parameters={...A.parameters,docs:{...(Js=A.parameters)==null?void 0:Js.docs,source:{originalSource:`{
  render: () => <div className="space-y-8 p-6 max-w-7xl">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">With Icons & Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard stat={studentsStat} showTrend />
          <StatsCard stat={coursesStat} showTrend />
          <StatsCard stat={ratingsStat} showTrend />
          <StatsCard stat={completionStat} showTrend />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Without Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard stat={studentsStat} showTrend={false} />
          <StatsCard stat={coursesStat} showTrend={false} />
          <StatsCard stat={ratingsStat} showTrend={false} />
          <StatsCard stat={noTrendStat} showTrend={false} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Without Icons</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard stat={noIconStat} showTrend />
          <StatsCard stat={{
          label: 'Downloads',
          value: '15.2K',
          trend: 'up',
          trendValue: '+2.1K'
        }} showTrend />
          <StatsCard stat={{
          label: 'Subscribers',
          value: '8,945',
          trend: 'up',
          trendValue: '+234'
        }} showTrend />
          <StatsCard stat={{
          label: 'Shares',
          value: '1,823',
          trend: 'up',
          trendValue: '+45'
        }} showTrend />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Minimal (No Icons, No Trends)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard stat={{
          label: 'Views',
          value: '24.5K'
        }} showTrend={false} />
          <StatsCard stat={{
          label: 'Clicks',
          value: '8,432'
        }} showTrend={false} />
          <StatsCard stat={{
          label: 'Conversions',
          value: '342'
        }} showTrend={false} />
          <StatsCard stat={{
          label: 'Impressions',
          value: '145K'
        }} showTrend={false} />
        </div>
      </div>
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Complete showcase of all stat card variations and combinations.'
      }
    }
  }
}`,...(Xs=(Qs=A.parameters)==null?void 0:Qs.docs)==null?void 0:Xs.source},description:{story:"All variations showcase",...(Zs=(Ys=A.parameters)==null?void 0:Ys.docs)==null?void 0:Zs.description}}};var et,st,tt,rt,at;M.parameters={...M.parameters,docs:{...(et=M.parameters)==null?void 0:et.docs,source:{originalSource:`{
  render: () => <div className="min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Platform Analytics</h1>
          <p className="text-[var(--muted-foreground)] text-lg">Real-time metrics from Ozean Licht</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard stat={studentsStat} showTrend />
          <StatsCard stat={coursesStat} showTrend />
          <StatsCard stat={ratingsStat} showTrend />
          <StatsCard stat={completionStat} showTrend />
          <StatsCard stat={revenueStat} showTrend />
          <StatsCard stat={watchTimeStat} showTrend />
          <StatsCard stat={enrollmentDeclineStat} showTrend />
          <StatsCard stat={neutralStat} showTrend />
        </div>
      </div>
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Stats cards displayed on cosmic dark background with Ozean Licht branding.'
      }
    }
  }
}`,...(tt=(st=M.parameters)==null?void 0:st.docs)==null?void 0:tt.source},description:{story:"Cosmic dark theme showcase",...(at=(rt=M.parameters)==null?void 0:rt.docs)==null?void 0:at.description}}};var ot,dt,nt,it,lt;R.parameters={...R.parameters,docs:{...(ot=R.parameters)==null?void 0:ot.docs,source:{originalSource:`{
  args: {
    stat: studentsStat,
    showTrend: true
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
        story: 'Stats card optimized for mobile viewports.'
      }
    }
  }
}`,...(nt=(dt=R.parameters)==null?void 0:dt.docs)==null?void 0:nt.source},description:{story:"Mobile view (narrow container)",...(lt=(it=R.parameters)==null?void 0:it.docs)==null?void 0:lt.description}}};var ct,mt,ut,pt,ht;D.parameters={...D.parameters,docs:{...(ct=D.parameters)==null?void 0:ct.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4 p-4 max-w-[360px]">
      <StatsCard stat={studentsStat} showTrend />
      <StatsCard stat={coursesStat} showTrend />
      <StatsCard stat={ratingsStat} showTrend />
      <StatsCard stat={enrollmentDeclineStat} showTrend />
    </div>,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Vertically stacked stats cards for mobile dashboard view.'
      }
    }
  }
}`,...(ut=(mt=D.parameters)==null?void 0:mt.docs)==null?void 0:ut.source},description:{story:"Stacked mobile layout",...(ht=(pt=D.parameters)==null?void 0:pt.docs)==null?void 0:ht.description}}};var gt,wt,xt,vt,St;k.parameters={...k.parameters,docs:{...(gt=k.parameters)==null?void 0:gt.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 p-6 max-w-7xl">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)]">Kids Ascension - Platform Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard stat={{
          label: 'Active Kids',
          value: '3,845',
          trend: 'up',
          trendValue: '+234 this week',
          icon: <Users className="w-12 h-12" />
        }} showTrend />
          <StatsCard stat={{
          label: 'Learning Activities',
          value: '127',
          trend: 'up',
          trendValue: '+12 new',
          icon: <BookOpen className="w-12 h-12" />
        }} showTrend />
          <StatsCard stat={{
          label: 'Average Age',
          value: '8.5',
          trend: 'neutral',
          trendValue: 'Stable',
          icon: <Target className="w-12 h-12" />
        }} showTrend />
          <StatsCard stat={{
          label: 'Parent Satisfaction',
          value: '97%',
          trend: 'up',
          trendValue: '+2%',
          icon: <Star className="w-12 h-12" />
        }} showTrend />
        </div>
      </div>
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Dashboard metrics specifically for Kids Ascension educational platform.'
      }
    }
  }
}`,...(xt=(wt=k.parameters)==null?void 0:wt.docs)==null?void 0:xt.source},description:{story:"Kids Ascension metrics",...(St=(vt=k.parameters)==null?void 0:vt.docs)==null?void 0:St.description}}};var Tt,bt,ft,yt,Nt;K.parameters={...K.parameters,docs:{...(Tt=K.parameters)==null?void 0:Tt.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">Live Metrics</h2>
        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Updated in real-time</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard stat={{
        label: 'Online Now',
        value: '1,234',
        trend: 'up',
        trendValue: '+56',
        icon: <Users className="w-12 h-12" />
      }} showTrend />
        <StatsCard stat={{
        label: 'Active Sessions',
        value: '842',
        trend: 'up',
        trendValue: '+23',
        icon: <Clock className="w-12 h-12" />
      }} showTrend />
        <StatsCard stat={{
        label: 'Current Revenue',
        value: '€1,245',
        trend: 'up',
        trendValue: '+€89',
        icon: <DollarSign className="w-12 h-12" />
      }} showTrend />
        <StatsCard stat={{
        label: 'Lessons Started',
        value: '345',
        trend: 'up',
        trendValue: '+12',
        icon: <BookOpen className="w-12 h-12" />
      }} showTrend />
      </div>
    </div>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Real-time metrics dashboard with live update indicator.'
      }
    }
  }
}`,...(ft=(bt=K.parameters)==null?void 0:bt.docs)==null?void 0:ft.source},description:{story:"Real-time metrics simulation",...(Nt=(yt=K.parameters)==null?void 0:yt.docs)==null?void 0:Nt.description}}};const tr=["Default","DownwardTrend","NeutralTrend","NoIcon","NoTrend","TrendHidden","CourseStats","RatingStats","CompletionRate","RevenueStats","WatchTime","LargeNumber","SmallNumber","TextValue","LongLabel","Minimal","CustomStyling","TwoColumnGrid","ThreeColumnGrid","FourColumnGrid","FullDashboard","AllTrendTypes","AllVariations","CosmicTheme","MobileView","MobileStacked","KidsAscensionMetrics","RealTimeMetrics"];export{V as AllTrendTypes,A as AllVariations,h as CompletionRate,M as CosmicTheme,u as CourseStats,f as CustomStyling,d as Default,n as DownwardTrend,j as FourColumnGrid,C as FullDashboard,k as KidsAscensionMetrics,x as LargeNumber,T as LongLabel,b as Minimal,D as MobileStacked,R as MobileView,i as NeutralTrend,l as NoIcon,c as NoTrend,p as RatingStats,K as RealTimeMetrics,g as RevenueStats,v as SmallNumber,S as TextValue,N as ThreeColumnGrid,m as TrendHidden,y as TwoColumnGrid,w as WatchTime,tr as __namedExportsOrder,sr as default};
