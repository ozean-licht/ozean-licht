import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{B as a}from"./button-Bn86PW9u.js";import{I as r}from"./input-BK5gJSzh.js";import{L as t}from"./label-BZCfx7Ud.js";import{r as j}from"./index-B2-qRKKC.js";import{M as f}from"./mail-Cxl1hOu1.js";import{L as b}from"./lock-C07ZgJYN.js";import{A as N}from"./arrow-right-2p1MOGVp.js";import{U as Se}from"./user-DUNvpwAv.js";import{E as Be}from"./eye-off-z17qZm2P.js";import{E as Ae}from"./eye-B2FZkYMJ.js";import{L as ze}from"./loader-circle-D-Axn3Lh.js";import"./clsx-B-dksMZM.js";import"./link-E3I1sHda.js";import"./cn-CKXzwFwe.js";import"./index-B5oyz0SX.js";import"./index-kS-9iBlu.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-BiMR7eR1.js";import"./index-BFjtS4uE.js";import"./index-Dp3B9jqt.js";import"./createLucideIcon-BbF4D6Jl.js";function s({children:i}){return e.jsx("main",{className:"flex min-h-dvh flex-col p-2",children:e.jsx("div",{className:"flex grow items-center justify-center p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-xs lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10",children:i})})}try{s.displayName="AuthLayout",s.__docgenInfo={description:"",displayName:"AuthLayout",props:{}}}catch{}const Ze={title:"Tier 1: Primitives/Catalyst/AuthLayout",component:s,parameters:{layout:"fullscreen",docs:{description:{component:"Authentication page layout with centered card design. Provides consistent structure for login, signup, and other auth pages with responsive behavior and dark mode support."}}},tags:["autodocs"]},l={render:()=>e.jsx(s,{children:e.jsxs("div",{className:"w-full max-w-sm space-y-4",children:[e.jsx("h2",{className:"text-2xl font-semibold text-zinc-900 dark:text-zinc-100",children:"Authentication Page"}),e.jsx("p",{className:"text-sm text-zinc-600 dark:text-zinc-400",children:"This is the default AuthLayout. Content is centered in a responsive card."})]})})},n={render:()=>e.jsx(s,{children:e.jsxs("div",{className:"w-full max-w-sm space-y-6",children:[e.jsxs("div",{className:"space-y-2 text-center",children:[e.jsx("h2",{className:"text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100",children:"Welcome back"}),e.jsx("p",{className:"text-sm text-zinc-600 dark:text-zinc-400",children:"Enter your credentials to access your account"})]}),e.jsxs("form",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"email",children:"Email address"}),e.jsxs("div",{className:"relative",children:[e.jsx(f,{className:"absolute left-3 top-3 h-4 w-4 text-zinc-400"}),e.jsx(r,{id:"email",type:"email",placeholder:"you@example.com",className:"pl-10",defaultValue:""})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(t,{htmlFor:"password",children:"Password"}),e.jsx("a",{href:"#",className:"text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400",children:"Forgot password?"})]}),e.jsxs("div",{className:"relative",children:[e.jsx(b,{className:"absolute left-3 top-3 h-4 w-4 text-zinc-400"}),e.jsx(r,{id:"password",type:"password",placeholder:"••••••••",className:"pl-10"})]})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("input",{type:"checkbox",id:"remember",className:"h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"}),e.jsx(t,{htmlFor:"remember",className:"text-sm font-normal cursor-pointer",children:"Remember me for 30 days"})]}),e.jsxs(a,{type:"submit",color:"indigo",className:"w-full justify-center",children:["Sign in",e.jsx(N,{"data-slot":"icon",className:"size-4"})]})]}),e.jsxs("div",{className:"text-center text-sm",children:[e.jsx("span",{className:"text-zinc-600 dark:text-zinc-400",children:"Don't have an account? "}),e.jsx("a",{href:"#",className:"font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400",children:"Sign up"})]})]})})},c={render:()=>e.jsx(s,{children:e.jsxs("div",{className:"w-full max-w-sm space-y-6",children:[e.jsxs("div",{className:"space-y-2 text-center",children:[e.jsx("h2",{className:"text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100",children:"Create an account"}),e.jsx("p",{className:"text-sm text-zinc-600 dark:text-zinc-400",children:"Get started with your free account today"})]}),e.jsxs("form",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"name",children:"Full name"}),e.jsxs("div",{className:"relative",children:[e.jsx(Se,{className:"absolute left-3 top-3 h-4 w-4 text-zinc-400"}),e.jsx(r,{id:"name",type:"text",placeholder:"John Doe",className:"pl-10"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"signup-email",children:"Email address"}),e.jsxs("div",{className:"relative",children:[e.jsx(f,{className:"absolute left-3 top-3 h-4 w-4 text-zinc-400"}),e.jsx(r,{id:"signup-email",type:"email",placeholder:"you@example.com",className:"pl-10"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"signup-password",children:"Password"}),e.jsxs("div",{className:"relative",children:[e.jsx(b,{className:"absolute left-3 top-3 h-4 w-4 text-zinc-400"}),e.jsx(r,{id:"signup-password",type:"password",placeholder:"••••••••",className:"pl-10"})]}),e.jsx("p",{className:"text-xs text-zinc-500 dark:text-zinc-400",children:"Must be at least 8 characters with a mix of letters and numbers"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"confirm-password",children:"Confirm password"}),e.jsxs("div",{className:"relative",children:[e.jsx(b,{className:"absolute left-3 top-3 h-4 w-4 text-zinc-400"}),e.jsx(r,{id:"confirm-password",type:"password",placeholder:"••••••••",className:"pl-10"})]})]}),e.jsxs("div",{className:"flex items-start space-x-2",children:[e.jsx("input",{type:"checkbox",id:"terms",className:"mt-1 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"}),e.jsxs(t,{htmlFor:"terms",className:"text-xs font-normal leading-relaxed cursor-pointer",children:["I agree to the"," ",e.jsx("a",{href:"#",className:"text-blue-600 hover:text-blue-500 dark:text-blue-400",children:"Terms of Service"})," ","and"," ",e.jsx("a",{href:"#",className:"text-blue-600 hover:text-blue-500 dark:text-blue-400",children:"Privacy Policy"})]})]}),e.jsx(a,{type:"submit",color:"green",className:"w-full justify-center",children:"Create account"})]}),e.jsxs("div",{className:"text-center text-sm",children:[e.jsx("span",{className:"text-zinc-600 dark:text-zinc-400",children:"Already have an account? "}),e.jsx("a",{href:"#",className:"font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400",children:"Sign in"})]})]})})},o={render:()=>e.jsx(s,{children:e.jsxs("div",{className:"w-full max-w-sm space-y-6",children:[e.jsxs("div",{className:"space-y-2 text-center",children:[e.jsx("h2",{className:"text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100",children:"Reset your password"}),e.jsx("p",{className:"text-sm text-zinc-600 dark:text-zinc-400",children:"Enter your email address and we'll send you a link to reset your password"})]}),e.jsxs("form",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"reset-email",children:"Email address"}),e.jsxs("div",{className:"relative",children:[e.jsx(f,{className:"absolute left-3 top-3 h-4 w-4 text-zinc-400"}),e.jsx(r,{id:"reset-email",type:"email",placeholder:"you@example.com",className:"pl-10"})]})]}),e.jsxs(a,{type:"submit",color:"blue",className:"w-full justify-center",children:["Send reset link",e.jsx(N,{"data-slot":"icon",className:"size-4"})]})]}),e.jsx("div",{className:"text-center",children:e.jsx("a",{href:"#",className:"text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400",children:"← Back to sign in"})})]})})},d={render:()=>e.jsx(s,{children:e.jsxs("div",{className:"w-full max-w-sm space-y-6",children:[e.jsxs("div",{className:"space-y-2 text-center",children:[e.jsx("h2",{className:"text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100",children:"Two-factor authentication"}),e.jsx("p",{className:"text-sm text-zinc-600 dark:text-zinc-400",children:"Enter the 6-digit code from your authenticator app"})]}),e.jsxs("form",{className:"space-y-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"otp-code",className:"sr-only",children:"Verification code"}),e.jsx(r,{id:"otp-code",type:"text",placeholder:"000000",maxLength:6,className:"text-center text-2xl tracking-widest font-mono"}),e.jsx("p",{className:"text-xs text-center text-zinc-500 dark:text-zinc-400",children:"The code expires in 30 seconds"})]}),e.jsx(a,{type:"submit",color:"green",className:"w-full justify-center",children:"Verify code"}),e.jsxs("div",{className:"text-center space-y-2",children:[e.jsx("p",{className:"text-sm text-zinc-600 dark:text-zinc-400",children:"Didn't receive a code?"}),e.jsx("button",{type:"button",className:"text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400",children:"Resend code"})]})]}),e.jsx("div",{className:"text-center",children:e.jsx("a",{href:"#",className:"text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400",children:"← Back to sign in"})})]})})},m={render:()=>e.jsx(s,{children:e.jsxs("div",{className:"w-full max-w-md space-y-8",children:[e.jsxs("div",{className:"text-center space-y-4",children:[e.jsx("div",{className:"inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white",children:e.jsx("svg",{className:"w-8 h-8",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M13 10V3L4 14h7v7l9-11h-7z"})})}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100",children:"Welcome to Platform"}),e.jsx("p",{className:"text-sm text-zinc-600 dark:text-zinc-400 mt-2",children:"Sign in to access your dashboard and manage your projects"})]})]}),e.jsxs("form",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"illus-email",children:"Email address"}),e.jsx(r,{id:"illus-email",type:"email",placeholder:"you@example.com"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"illus-password",children:"Password"}),e.jsx(r,{id:"illus-password",type:"password",placeholder:"••••••••"})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("input",{type:"checkbox",id:"illus-remember",className:"h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"}),e.jsx(t,{htmlFor:"illus-remember",className:"text-sm font-normal cursor-pointer",children:"Remember me"})]}),e.jsx("a",{href:"#",className:"text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400",children:"Forgot password?"})]}),e.jsx(a,{type:"submit",color:"blue",className:"w-full justify-center",children:"Sign in to your account"}),e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"absolute inset-0 flex items-center",children:e.jsx("div",{className:"w-full border-t border-zinc-200 dark:border-zinc-700"})}),e.jsx("div",{className:"relative flex justify-center text-xs uppercase",children:e.jsx("span",{className:"bg-white dark:bg-zinc-900 px-2 text-zinc-500 dark:text-zinc-400",children:"Or continue with"})})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsxs(a,{outline:!0,type:"button",className:"justify-center",children:[e.jsxs("svg",{className:"w-5 h-5",viewBox:"0 0 24 24",children:[e.jsx("path",{fill:"currentColor",d:"M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"}),e.jsx("path",{fill:"currentColor",d:"M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"}),e.jsx("path",{fill:"currentColor",d:"M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"}),e.jsx("path",{fill:"currentColor",d:"M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"})]}),"Google"]}),e.jsxs(a,{outline:!0,type:"button",className:"justify-center",children:[e.jsx("svg",{className:"w-5 h-5",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"})}),"GitHub"]})]})]}),e.jsxs("div",{className:"text-center text-sm",children:[e.jsx("span",{className:"text-zinc-600 dark:text-zinc-400",children:"New user? "}),e.jsx("a",{href:"#",className:"font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400",children:"Create an account"})]})]})})},x={render:()=>{const[i,Le]=j.useState(!1),[y,w]=j.useState(!1);return e.jsxs("div",{className:"min-h-screen relative",children:[e.jsxs("div",{className:"absolute inset-0 bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]",children:[e.jsx("div",{className:"absolute inset-0 opacity-30",children:[...Array(50)].map((g,Ce)=>e.jsx("div",{className:"absolute w-1 h-1 bg-white rounded-full animate-pulse",style:{top:`${Math.random()*100}%`,left:`${Math.random()*100}%`,animationDelay:`${Math.random()*3}s`,animationDuration:`${2+Math.random()*3}s`}},Ce))}),e.jsx("div",{className:"absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--primary)]/20 rounded-full blur-3xl"}),e.jsx("div",{className:"absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"})]}),e.jsx(s,{children:e.jsxs("div",{className:"w-full max-w-md space-y-8 relative z-10",children:[e.jsxs("div",{className:"backdrop-blur-xl bg-white/10 dark:bg-zinc-900/40 rounded-2xl p-8 shadow-2xl border border-white/20",style:{boxShadow:"0 8px 32px 0 rgba(14, 194, 188, 0.1)"},children:[e.jsxs("div",{className:"text-center space-y-4 mb-8",children:[e.jsx("div",{className:"inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary)] to-[#0a9b96] shadow-lg shadow-[var(--primary)]/50",children:e.jsx("svg",{className:"w-10 h-10 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"})})}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-3xl font-bold tracking-tight",style:{color:"var(--primary)"},children:"Ozean Licht"}),e.jsx("p",{className:"text-sm text-white/70 mt-2",children:"Dive into the cosmic ocean of light"})]})]}),e.jsxs("form",{className:"space-y-5",onSubmit:g=>{g.preventDefault(),w(!0),setTimeout(()=>w(!1),2e3)},children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"ozean-email",className:"text-white/90",children:"Email address"}),e.jsxs("div",{className:"relative",children:[e.jsx(f,{className:"absolute left-3 top-3 h-4 w-4 text-white/50"}),e.jsx(r,{id:"ozean-email",type:"email",placeholder:"you@example.com",className:"pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[var(--primary)] focus:ring-[var(--primary)]"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(t,{htmlFor:"ozean-password",className:"text-white/90",children:"Password"}),e.jsx("a",{href:"#",className:"text-xs hover:underline",style:{color:"var(--primary)"},children:"Forgot password?"})]}),e.jsxs("div",{className:"relative",children:[e.jsx(b,{className:"absolute left-3 top-3 h-4 w-4 text-white/50"}),e.jsx(r,{id:"ozean-password",type:i?"text":"password",placeholder:"••••••••",className:"pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[var(--primary)] focus:ring-[var(--primary)]"}),e.jsx("button",{type:"button",onClick:()=>Le(!i),className:"absolute right-3 top-3 text-white/50 hover:text-white/80",children:i?e.jsx(Be,{className:"h-4 w-4"}):e.jsx(Ae,{className:"h-4 w-4"})})]})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("input",{type:"checkbox",id:"ozean-remember",className:"h-4 w-4 rounded border-white/20 bg-white/5 text-[var(--primary)] focus:ring-[var(--primary)]"}),e.jsx(t,{htmlFor:"ozean-remember",className:"text-sm font-normal text-white/80 cursor-pointer",children:"Keep me signed in"})]}),e.jsx(a,{type:"submit",disabled:y,className:"w-full justify-center",style:{backgroundColor:"var(--primary)",color:"white"},children:y?e.jsxs(e.Fragment,{children:[e.jsx(ze,{"data-slot":"icon",className:"size-4 animate-spin"}),"Signing in..."]}):e.jsxs(e.Fragment,{children:["Sign in to Ocean Light",e.jsx(N,{"data-slot":"icon",className:"size-4"})]})}),e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"absolute inset-0 flex items-center",children:e.jsx("div",{className:"w-full border-t border-white/20"})}),e.jsx("div",{className:"relative flex justify-center text-xs uppercase",children:e.jsx("span",{className:"px-2 text-white/60 bg-transparent",children:"Or continue with"})})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(a,{outline:!0,type:"button",className:"justify-center border-white/20 text-white/90 hover:bg-white/10",children:e.jsxs("svg",{className:"w-5 h-5",viewBox:"0 0 24 24",children:[e.jsx("path",{fill:"currentColor",d:"M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"}),e.jsx("path",{fill:"currentColor",d:"M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"}),e.jsx("path",{fill:"currentColor",d:"M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"}),e.jsx("path",{fill:"currentColor",d:"M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"})]})}),e.jsx(a,{outline:!0,type:"button",className:"justify-center border-white/20 text-white/90 hover:bg-white/10",children:e.jsx("svg",{className:"w-5 h-5",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"})})})]})]}),e.jsxs("div",{className:"text-center text-sm mt-6",children:[e.jsx("span",{className:"text-white/60",children:"New to Ozean Licht? "}),e.jsx("a",{href:"#",className:"font-medium hover:underline",style:{color:"var(--primary)"},children:"Begin your journey"})]})]}),e.jsx("p",{className:"text-center text-xs text-white/50",children:"By signing in, you agree to our Terms of Service and Privacy Policy"})]})})]})},parameters:{backgrounds:{disable:!0}}},u={render:()=>e.jsx(s,{children:e.jsxs("div",{className:"w-full max-w-sm space-y-6 text-center",children:[e.jsx("div",{className:"inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20",children:e.jsx(f,{className:"w-8 h-8 text-green-600 dark:text-green-400"})}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h2",{className:"text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100",children:"Check your email"}),e.jsx("p",{className:"text-sm text-zinc-600 dark:text-zinc-400",children:"We sent a verification link to"}),e.jsx("p",{className:"text-sm font-medium text-zinc-900 dark:text-zinc-100",children:"john.doe@example.com"})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("p",{className:"text-sm text-zinc-600 dark:text-zinc-400",children:"Click the link in the email to verify your account. If you don't see the email, check your spam folder."}),e.jsx(a,{color:"blue",className:"w-full justify-center",children:"Open email app"}),e.jsxs("div",{className:"text-sm",children:[e.jsx("span",{className:"text-zinc-600 dark:text-zinc-400",children:"Didn't receive the email? "}),e.jsx("button",{type:"button",className:"font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400",children:"Resend"})]})]}),e.jsx("div",{className:"pt-6",children:e.jsx("a",{href:"#",className:"text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400",children:"← Back to sign in"})})]})})},h={render:()=>e.jsx(s,{children:e.jsxs("div",{className:"w-full max-w-sm space-y-6 text-center",children:[e.jsx("div",{className:"inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20",children:e.jsx(ze,{className:"w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin"})}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h2",{className:"text-2xl font-semibold text-zinc-900 dark:text-zinc-100",children:"Signing you in..."}),e.jsx("p",{className:"text-sm text-zinc-600 dark:text-zinc-400",children:"Please wait while we verify your credentials"})]})]})})},p={render:()=>e.jsx(s,{children:e.jsxs("div",{className:"w-full max-w-sm space-y-6 text-center",children:[e.jsx("div",{className:"inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20",children:e.jsx("svg",{className:"w-8 h-8 text-green-600 dark:text-green-400",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M5 13l4 4L19 7"})})}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h2",{className:"text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100",children:"All set!"}),e.jsx("p",{className:"text-sm text-zinc-600 dark:text-zinc-400",children:"Your account has been successfully verified"})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("p",{className:"text-sm text-zinc-600 dark:text-zinc-400",children:"Redirecting you to your dashboard in 3 seconds..."}),e.jsxs(a,{color:"green",className:"w-full justify-center",children:["Go to dashboard",e.jsx(N,{"data-slot":"icon",className:"size-4"})]})]})]})})},v={render:()=>e.jsx(s,{children:e.jsxs("div",{className:"w-full max-w-sm space-y-6 text-center",children:[e.jsx("div",{className:"inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20",children:e.jsx("svg",{className:"w-8 h-8 text-red-600 dark:text-red-400",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h2",{className:"text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100",children:"Authentication failed"}),e.jsx("p",{className:"text-sm text-zinc-600 dark:text-zinc-400",children:"We couldn't verify your credentials. Please check your email and password and try again."})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsx(a,{color:"blue",className:"w-full justify-center",children:"Try again"}),e.jsx("a",{href:"#",className:"block text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400",children:"← Back to sign in"})]})]})})};var k,z,L,C,S;l.parameters={...l.parameters,docs:{...(k=l.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => <AuthLayout>
      <div className="w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Authentication Page
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          This is the default AuthLayout. Content is centered in a responsive card.
        </p>
      </div>
    </AuthLayout>
}`,...(L=(z=l.parameters)==null?void 0:z.docs)==null?void 0:L.source},description:{story:`Default authentication layout with minimal content.

Shows the basic centered card structure with simple text content.
Demonstrates the responsive behavior and dark mode support.`,...(S=(C=l.parameters)==null?void 0:C.docs)==null?void 0:S.description}}};var B,A,F,M,P;n.parameters={...n.parameters,docs:{...(B=n.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: () => <AuthLayout>
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Welcome back
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Enter your credentials to access your account
          </p>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input id="email" type="email" placeholder="you@example.com" className="pl-10" defaultValue="" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input id="password" type="password" placeholder="••••••••" className="pl-10" />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input type="checkbox" id="remember" className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500" />
            <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
              Remember me for 30 days
            </Label>
          </div>

          <Button type="submit" color="indigo" className="w-full justify-center">
            Sign in
            <ArrowRight data-slot="icon" className="size-4" />
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Don't have an account? </span>
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Sign up
          </a>
        </div>
      </div>
    </AuthLayout>
}`,...(F=(A=n.parameters)==null?void 0:A.docs)==null?void 0:F.source},description:{story:`Login form with email and password.

Complete login page implementation with form fields, labels, and action buttons.
Includes "Remember me" checkbox and "Forgot password" link.`,...(P=(M=n.parameters)==null?void 0:M.docs)==null?void 0:P.description}}};var I,E,D,R,O;c.parameters={...c.parameters,docs:{...(I=c.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => <AuthLayout>
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Create an account
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Get started with your free account today
          </p>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input id="name" type="text" placeholder="John Doe" className="pl-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input id="signup-email" type="email" placeholder="you@example.com" className="pl-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input id="signup-password" type="password" placeholder="••••••••" className="pl-10" />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Must be at least 8 characters with a mix of letters and numbers
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input id="confirm-password" type="password" placeholder="••••••••" className="pl-10" />
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <input type="checkbox" id="terms" className="mt-1 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500" />
            <Label htmlFor="terms" className="text-xs font-normal leading-relaxed cursor-pointer">
              I agree to the{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                Privacy Policy
              </a>
            </Label>
          </div>

          <Button type="submit" color="green" className="w-full justify-center">
            Create account
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Already have an account? </span>
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Sign in
          </a>
        </div>
      </div>
    </AuthLayout>
}`,...(D=(E=c.parameters)==null?void 0:E.docs)==null?void 0:D.source},description:{story:`Signup form with name, email, and password.

Complete registration page with all necessary fields and password requirements.
Includes terms of service agreement and link to login page.`,...(O=(R=c.parameters)==null?void 0:R.docs)==null?void 0:O.description}}};var T,W,H,V,_;o.parameters={...o.parameters,docs:{...(T=o.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => <AuthLayout>
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Reset your password
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input id="reset-email" type="email" placeholder="you@example.com" className="pl-10" />
            </div>
          </div>

          <Button type="submit" color="blue" className="w-full justify-center">
            Send reset link
            <ArrowRight data-slot="icon" className="size-4" />
          </Button>
        </form>

        <div className="text-center">
          <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
            ← Back to sign in
          </a>
        </div>
      </div>
    </AuthLayout>
}`,...(H=(W=o.parameters)==null?void 0:W.docs)==null?void 0:H.source},description:{story:`Password reset request form.

Simple form for requesting a password reset link via email.
Includes back to login link for easy navigation.`,...(_=(V=o.parameters)==null?void 0:V.docs)==null?void 0:_.description}}};var G,$,q,U,J;d.parameters={...d.parameters,docs:{...(G=d.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => <AuthLayout>
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Two-factor authentication
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="otp-code" className="sr-only">
              Verification code
            </Label>
            <Input id="otp-code" type="text" placeholder="000000" maxLength={6} className="text-center text-2xl tracking-widest font-mono" />
            <p className="text-xs text-center text-zinc-500 dark:text-zinc-400">
              The code expires in 30 seconds
            </p>
          </div>

          <Button type="submit" color="green" className="w-full justify-center">
            Verify code
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Didn't receive a code?
            </p>
            <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Resend code
            </button>
          </div>
        </form>

        <div className="text-center">
          <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
            ← Back to sign in
          </a>
        </div>
      </div>
    </AuthLayout>
}`,...(q=($=d.parameters)==null?void 0:$.docs)==null?void 0:q.source},description:{story:`Two-factor authentication verification.

2FA verification page with 6-digit code input.
Includes option to resend code if not received.`,...(J=(U=d.parameters)==null?void 0:U.docs)==null?void 0:J.description}}};var K,Y,Q,X,Z;m.parameters={...m.parameters,docs:{...(K=m.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: () => <AuthLayout>
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Welcome to Platform
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              Sign in to access your dashboard and manage your projects
            </p>
          </div>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="illus-email">Email address</Label>
            <Input id="illus-email" type="email" placeholder="you@example.com" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="illus-password">Password</Label>
            <Input id="illus-password" type="password" placeholder="••••••••" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="illus-remember" className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500" />
              <Label htmlFor="illus-remember" className="text-sm font-normal cursor-pointer">
                Remember me
              </Label>
            </div>
            <a href="#" className="text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Forgot password?
            </a>
          </div>

          <Button type="submit" color="blue" className="w-full justify-center">
            Sign in to your account
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-500 dark:text-zinc-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button outline type="button" className="justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </Button>
            <Button outline type="button" className="justify-center">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </Button>
          </div>
        </form>

        <div className="text-center text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">New user? </span>
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Create an account
          </a>
        </div>
      </div>
    </AuthLayout>
}`,...(Q=(Y=m.parameters)==null?void 0:Y.docs)==null?void 0:Q.source},description:{story:`Login form with illustration/branding.

Enhanced login page with logo, tagline, and visual branding elements.
Shows how to add brand identity to auth pages.`,...(Z=(X=m.parameters)==null?void 0:X.docs)==null?void 0:Z.description}}};var ee,te,se,ae,re;x.parameters={...x.parameters,docs:{...(ee=x.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    return <div className="min-h-screen relative">
        {/* Cosmic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
          {/* Animated stars */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(50)].map((_, i) => <div key={i} className="absolute w-1 h-1 bg-white rounded-full animate-pulse" style={{
            top: \`\${Math.random() * 100}%\`,
            left: \`\${Math.random() * 100}%\`,
            animationDelay: \`\${Math.random() * 3}s\`,
            animationDuration: \`\${2 + Math.random() * 3}s\`
          }} />)}
          </div>
          {/* Gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--primary)]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <AuthLayout>
          <div className="w-full max-w-md space-y-8 relative z-10">
            {/* Glass morphism card */}
            <div className="backdrop-blur-xl bg-white/10 dark:bg-zinc-900/40 rounded-2xl p-8 shadow-2xl border border-white/20" style={{
            boxShadow: '0 8px 32px 0 rgba(14, 194, 188, 0.1)'
          }}>
              {/* Logo and branding */}
              <div className="text-center space-y-4 mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary)] to-[#0a9b96] shadow-lg shadow-[var(--primary)]/50">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold tracking-tight" style={{
                  color: 'var(--primary)'
                }}>
                    Ozean Licht
                  </h2>
                  <p className="text-sm text-white/70 mt-2">
                    Dive into the cosmic ocean of light
                  </p>
                </div>
              </div>

              <form className="space-y-5" onSubmit={e => {
              e.preventDefault();
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 2000);
            }}>
                <div className="space-y-2">
                  <Label htmlFor="ozean-email" className="text-white/90">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                    <Input id="ozean-email" type="email" placeholder="you@example.com" className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[var(--primary)] focus:ring-[var(--primary)]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ozean-password" className="text-white/90">
                      Password
                    </Label>
                    <a href="#" className="text-xs hover:underline" style={{
                    color: 'var(--primary)'
                  }}>
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                    <Input id="ozean-password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[var(--primary)] focus:ring-[var(--primary)]" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-white/50 hover:text-white/80">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="ozean-remember" className="h-4 w-4 rounded border-white/20 bg-white/5 text-[var(--primary)] focus:ring-[var(--primary)]" />
                  <Label htmlFor="ozean-remember" className="text-sm font-normal text-white/80 cursor-pointer">
                    Keep me signed in
                  </Label>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full justify-center" style={{
                backgroundColor: 'var(--primary)',
                color: 'white'
              }}>
                  {isLoading ? <>
                      <Loader2 data-slot="icon" className="size-4 animate-spin" />
                      Signing in...
                    </> : <>
                      Sign in to Ocean Light
                      <ArrowRight data-slot="icon" className="size-4" />
                    </>}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-2 text-white/60 bg-transparent">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button outline type="button" className="justify-center border-white/20 text-white/90 hover:bg-white/10">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </Button>
                  <Button outline type="button" className="justify-center border-white/20 text-white/90 hover:bg-white/10">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </Button>
                </div>
              </form>

              <div className="text-center text-sm mt-6">
                <span className="text-white/60">New to Ozean Licht? </span>
                <a href="#" className="font-medium hover:underline" style={{
                color: 'var(--primary)'
              }}>
                  Begin your journey
                </a>
              </div>
            </div>

            {/* Footer text */}
            <p className="text-center text-xs text-white/50">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </AuthLayout>
      </div>;
  },
  parameters: {
    backgrounds: {
      disable: true
    }
  }
}`,...(se=(te=x.parameters)==null?void 0:te.docs)==null?void 0:se.source},description:{story:`Ozean Licht themed authentication pages.

Demonstrates complete auth pages with Ozean Licht cosmic branding.
Includes turquoise accent color (var(--primary)), cosmic backgrounds, and glass morphism effects.`,...(re=(ae=x.parameters)==null?void 0:ae.docs)==null?void 0:re.description}}};var ie,le,ne,ce,oe;u.parameters={...u.parameters,docs:{...(ie=u.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  render: () => <AuthLayout>
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20">
          <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Check your email
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            We sent a verification link to
          </p>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            john.doe@example.com
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Click the link in the email to verify your account. If you don't see the email,
            check your spam folder.
          </p>

          <Button color="blue" className="w-full justify-center">
            Open email app
          </Button>

          <div className="text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Didn't receive the email? </span>
            <button type="button" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Resend
            </button>
          </div>
        </div>

        <div className="pt-6">
          <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
            ← Back to sign in
          </a>
        </div>
      </div>
    </AuthLayout>
}`,...(ne=(le=u.parameters)==null?void 0:le.docs)==null?void 0:ne.source},description:{story:`Email verification page.

Simple page for email verification after signup.
Includes resend verification email option.`,...(oe=(ce=u.parameters)==null?void 0:ce.docs)==null?void 0:oe.description}}};var de,me,xe,ue,he;h.parameters={...h.parameters,docs:{...(de=h.parameters)==null?void 0:de.docs,source:{originalSource:`{
  render: () => <AuthLayout>
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20">
          <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Signing you in...
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Please wait while we verify your credentials
          </p>
        </div>
      </div>
    </AuthLayout>
}`,...(xe=(me=h.parameters)==null?void 0:me.docs)==null?void 0:xe.source},description:{story:`Loading state during authentication.

Shows a loading spinner while processing authentication.
Useful for displaying during OAuth callbacks or session validation.`,...(he=(ue=h.parameters)==null?void 0:ue.docs)==null?void 0:he.description}}};var pe,ve,fe,be,Ne;p.parameters={...p.parameters,docs:{...(pe=p.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  render: () => <AuthLayout>
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            All set!
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Your account has been successfully verified
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Redirecting you to your dashboard in 3 seconds...
          </p>

          <Button color="green" className="w-full justify-center">
            Go to dashboard
            <ArrowRight data-slot="icon" className="size-4" />
          </Button>
        </div>
      </div>
    </AuthLayout>
}`,...(fe=(ve=p.parameters)==null?void 0:ve.docs)==null?void 0:fe.source},description:{story:`Success confirmation page.

Shows a success message after completing an authentication action.
Includes automatic redirect countdown.`,...(Ne=(be=p.parameters)==null?void 0:be.docs)==null?void 0:Ne.description}}};var ye,we,ge,je,ke;v.parameters={...v.parameters,docs:{...(ye=v.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  render: () => <AuthLayout>
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Authentication failed
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            We couldn't verify your credentials. Please check your email and password and try again.
          </p>
        </div>

        <div className="space-y-3">
          <Button color="blue" className="w-full justify-center">
            Try again
          </Button>

          <a href="#" className="block text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
            ← Back to sign in
          </a>
        </div>
      </div>
    </AuthLayout>
}`,...(ge=(we=v.parameters)==null?void 0:we.docs)==null?void 0:ge.source},description:{story:`Error state for authentication failures.

Displays error messages when authentication fails.
Includes options to retry or return to login.`,...(ke=(je=v.parameters)==null?void 0:je.docs)==null?void 0:ke.description}}};const et=["Default","LoginForm","SignupForm","PasswordReset","TwoFactorAuth","WithIllustration","OzeanLichtThemed","EmailVerification","LoadingState","SuccessState","ErrorState"];export{l as Default,u as EmailVerification,v as ErrorState,h as LoadingState,n as LoginForm,x as OzeanLichtThemed,o as PasswordReset,c as SignupForm,p as SuccessState,d as TwoFactorAuth,m as WithIllustration,et as __namedExportsOrder,Ze as default};
