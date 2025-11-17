import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{f as j}from"./index-CJu6nLMj.js";import{u as F}from"./index.esm-SGBzMz4R.js";import{o as b,s as n,a as x,b as M,l as Se,_ as Ce}from"./schemas-C3QG-Qu7.js";import{F as h,a as t,b as s,c as a,d as l,e as u,f as m}from"./form-D17IeaWv.js";import{I as c}from"./input-Db9iZ-Hs.js";import{T as ge}from"./textarea-Cd1j4ONA.js";import{B as p}from"./button-C8qtCU0L.js";import{C as P}from"./checkbox-M5-a5s-y.js";import{R as we,a as k}from"./radio-group-DRzI9o6c.js";import{r as D}from"./index-B2-qRKKC.js";import"./index-BiMR7eR1.js";import"./index-BFjtS4uE.js";import"./cn-CytzSlOG.js";import"./label-Cp9r14oL.js";import"./index-B5oyz0SX.js";import"./index-kS-9iBlu.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-DVF2XGCm.js";import"./index-D4_CVXg7.js";import"./index-BlCrtW8-.js";import"./index-D1vk04JX.js";import"./index-_AbP6Uzr.js";import"./index-BYfY0yFj.js";import"./index-PNzqWif7.js";import"./check-BFJmnSzs.js";import"./createLucideIcon-BbF4D6Jl.js";import"./index-C-LTtwzP.js";import"./index-yuRWTe36.js";import"./index-CpxwHbl5.js";import"./index-ciuW_uyV.js";import"./index-D6fdIYSQ.js";import"./circle-KqIYxgtT.js";const lr={title:"Tier 1: Primitives/shadcn/Form",component:h,parameters:{layout:"centered",docs:{description:{component:"Composable form primitives built on react-hook-form and Radix UI. Provides type-safe forms with Zod validation, automatic error handling, and accessibility features."}}},tags:["autodocs"],decorators:[i=>e.jsx("div",{className:"w-[500px]",children:e.jsx(i,{})})]},v={render:()=>{const i=b({email:n().email("Invalid email address"),password:n().min(8,"Password must be at least 8 characters")}),o=F({resolver:x(i),defaultValues:{email:"",password:""}}),d=j(r=>{console.log("Form submitted:",r)});return e.jsx(h,{...o,children:e.jsxs("form",{onSubmit:o.handleSubmit(d),className:"space-y-6",children:[e.jsx(t,{control:o.control,name:"email",render:({field:r})=>e.jsxs(s,{children:[e.jsx(a,{children:"Email"}),e.jsx(l,{children:e.jsx(c,{placeholder:"john@example.com",type:"email",...r})}),e.jsx(u,{children:"We'll never share your email with anyone else."}),e.jsx(m,{})]})}),e.jsx(t,{control:o.control,name:"password",render:({field:r})=>e.jsxs(s,{children:[e.jsx(a,{children:"Password"}),e.jsx(l,{children:e.jsx(c,{placeholder:"••••••••",type:"password",...r})}),e.jsx(m,{})]})}),e.jsx(p,{type:"submit",className:"w-full",children:"Sign In"})]})})}},S={render:()=>{const i=b({username:n().min(3,"Username must be at least 3 characters").max(20,"Username must be less than 20 characters").regex(/^[a-zA-Z0-9_]+$/,"Username can only contain letters, numbers, and underscores"),bio:n().max(160,"Bio must be less than 160 characters").optional(),url:n().url("Please enter a valid URL").optional().or(Se("")),marketing:M().default(!1)}),o=F({resolver:x(i),defaultValues:{username:"",bio:"",url:"",marketing:!1}}),d=j(r=>{console.log("Profile updated:",r)});return e.jsx(h,{...o,children:e.jsxs("form",{onSubmit:o.handleSubmit(d),className:"space-y-6",children:[e.jsx(t,{control:o.control,name:"username",render:({field:r})=>e.jsxs(s,{children:[e.jsx(a,{children:"Username"}),e.jsx(l,{children:e.jsx(c,{placeholder:"johndoe",...r})}),e.jsx(u,{children:"This is your public display name. It can be your real name or a pseudonym."}),e.jsx(m,{})]})}),e.jsx(t,{control:o.control,name:"bio",render:({field:r})=>e.jsxs(s,{children:[e.jsx(a,{children:"Bio"}),e.jsx(l,{children:e.jsx(ge,{placeholder:"Tell us about yourself...",className:"resize-none",...r})}),e.jsx(u,{children:"You can write a brief bio about yourself. Max 160 characters."}),e.jsx(m,{})]})}),e.jsx(t,{control:o.control,name:"url",render:({field:r})=>e.jsxs(s,{children:[e.jsx(a,{children:"Website"}),e.jsx(l,{children:e.jsx(c,{placeholder:"https://example.com",type:"url",...r})}),e.jsx(u,{children:"Add a link to your website or portfolio."}),e.jsx(m,{})]})}),e.jsx(t,{control:o.control,name:"marketing",render:({field:r})=>e.jsxs(s,{className:"flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4",children:[e.jsx(l,{children:e.jsx(P,{checked:r.value,onCheckedChange:r.onChange})}),e.jsxs("div",{className:"space-y-1 leading-none",children:[e.jsx(a,{children:"Marketing emails"}),e.jsx(u,{children:"Receive emails about new products, features, and more."})]})]})}),e.jsxs("div",{className:"flex gap-4",children:[e.jsx(p,{type:"submit",className:"flex-1",children:"Update Profile"}),e.jsx(p,{type:"button",variant:"outline",onClick:()=>o.reset(),children:"Cancel"})]})]})})}},C={render:()=>{const i=b({name:n().min(2,"Name must be at least 2 characters"),email:n().email("Invalid email address"),password:n().min(8,"Password must be at least 8 characters"),confirmPassword:n(),terms:M().refine(r=>r===!0,{message:"You must accept the terms and conditions"})}).refine(r=>r.password===r.confirmPassword,{message:"Passwords don't match",path:["confirmPassword"]}),o=F({resolver:x(i),defaultValues:{name:"",email:"",password:"",confirmPassword:"",terms:!1}}),d=j(r=>{console.log("Registration:",r)});return e.jsx(h,{...o,children:e.jsxs("form",{onSubmit:o.handleSubmit(d),className:"space-y-6",children:[e.jsx(t,{control:o.control,name:"name",render:({field:r})=>e.jsxs(s,{children:[e.jsx(a,{children:"Full Name"}),e.jsx(l,{children:e.jsx(c,{placeholder:"John Doe",...r})}),e.jsx(m,{})]})}),e.jsx(t,{control:o.control,name:"email",render:({field:r})=>e.jsxs(s,{children:[e.jsx(a,{children:"Email"}),e.jsx(l,{children:e.jsx(c,{placeholder:"john@example.com",type:"email",...r})}),e.jsx(m,{})]})}),e.jsx(t,{control:o.control,name:"password",render:({field:r})=>e.jsxs(s,{children:[e.jsx(a,{children:"Password"}),e.jsx(l,{children:e.jsx(c,{placeholder:"••••••••",type:"password",...r})}),e.jsx(u,{children:"Must be at least 8 characters long"}),e.jsx(m,{})]})}),e.jsx(t,{control:o.control,name:"confirmPassword",render:({field:r})=>e.jsxs(s,{children:[e.jsx(a,{children:"Confirm Password"}),e.jsx(l,{children:e.jsx(c,{placeholder:"••••••••",type:"password",...r})}),e.jsx(m,{})]})}),e.jsx(t,{control:o.control,name:"terms",render:({field:r})=>e.jsxs(s,{className:"flex flex-row items-start space-x-3 space-y-0",children:[e.jsx(l,{children:e.jsx(P,{checked:r.value,onCheckedChange:r.onChange})}),e.jsxs("div",{className:"space-y-1 leading-none",children:[e.jsxs(a,{children:["I accept the"," ",e.jsx("a",{href:"#",className:"text-primary hover:underline",children:"terms and conditions"})]}),e.jsx(m,{})]})]})}),e.jsx(p,{type:"submit",className:"w-full",variant:"default",children:"Create Account"})]})})}},w={render:()=>{const i=b({type:Ce(["all","mentions","none"],{required_error:"You need to select a notification type."}),mobile:M().default(!1),email:M().default(!0)}),o=F({resolver:x(i),defaultValues:{type:"all",mobile:!1,email:!0}}),d=j(r=>{console.log("Preferences saved:",r)});return e.jsx(h,{...o,children:e.jsxs("form",{onSubmit:o.handleSubmit(d),className:"space-y-6",children:[e.jsx(t,{control:o.control,name:"type",render:({field:r})=>e.jsxs(s,{className:"space-y-3",children:[e.jsx(a,{children:"Notify me about..."}),e.jsx(l,{children:e.jsxs(we,{onValueChange:r.onChange,defaultValue:r.value,className:"flex flex-col space-y-1",children:[e.jsxs(s,{className:"flex items-center space-x-3 space-y-0",children:[e.jsx(l,{children:e.jsx(k,{value:"all"})}),e.jsx(a,{className:"font-normal",children:"All new messages"})]}),e.jsxs(s,{className:"flex items-center space-x-3 space-y-0",children:[e.jsx(l,{children:e.jsx(k,{value:"mentions"})}),e.jsx(a,{className:"font-normal",children:"Direct messages and mentions"})]}),e.jsxs(s,{className:"flex items-center space-x-3 space-y-0",children:[e.jsx(l,{children:e.jsx(k,{value:"none"})}),e.jsx(a,{className:"font-normal",children:"Nothing"})]})]})}),e.jsx(u,{children:"Choose how you want to receive notifications"}),e.jsx(m,{})]})}),e.jsxs("div",{className:"space-y-4",children:[e.jsx(t,{control:o.control,name:"mobile",render:({field:r})=>e.jsxs(s,{className:"flex flex-row items-center justify-between rounded-lg border p-4",children:[e.jsxs("div",{className:"space-y-0.5",children:[e.jsx(a,{className:"text-base",children:"Mobile notifications"}),e.jsx(u,{children:"Receive push notifications on your mobile device"})]}),e.jsx(l,{children:e.jsx(P,{checked:r.value,onCheckedChange:r.onChange})})]})}),e.jsx(t,{control:o.control,name:"email",render:({field:r})=>e.jsxs(s,{className:"flex flex-row items-center justify-between rounded-lg border p-4",children:[e.jsxs("div",{className:"space-y-0.5",children:[e.jsx(a,{className:"text-base",children:"Email notifications"}),e.jsx(u,{children:"Receive notifications via email"})]}),e.jsx(l,{children:e.jsx(P,{checked:r.value,onCheckedChange:r.onChange})})]})})]}),e.jsx(p,{type:"submit",className:"w-full",children:"Save Preferences"})]})})}},N={render:()=>{const i=b({name:n().min(2,"Name must be at least 2 characters"),email:n().email("Invalid email address"),subject:n().min(5,"Subject must be at least 5 characters"),message:n().min(10,"Message must be at least 10 characters").max(500,"Message must be less than 500 characters")}),o=F({resolver:x(i),defaultValues:{name:"",email:"",subject:"",message:""}}),d=j(f=>{console.log("Message sent:",f),o.reset()}),r=o.watch("message");return e.jsx(h,{...o,children:e.jsxs("form",{onSubmit:o.handleSubmit(d),className:"space-y-6",children:[e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsx(t,{control:o.control,name:"name",render:({field:f})=>e.jsxs(s,{children:[e.jsx(a,{children:"Name"}),e.jsx(l,{children:e.jsx(c,{placeholder:"John Doe",...f})}),e.jsx(m,{})]})}),e.jsx(t,{control:o.control,name:"email",render:({field:f})=>e.jsxs(s,{children:[e.jsx(a,{children:"Email"}),e.jsx(l,{children:e.jsx(c,{placeholder:"john@example.com",type:"email",...f})}),e.jsx(m,{})]})})]}),e.jsx(t,{control:o.control,name:"subject",render:({field:f})=>e.jsxs(s,{children:[e.jsx(a,{children:"Subject"}),e.jsx(l,{children:e.jsx(c,{placeholder:"What is this regarding?",...f})}),e.jsx(m,{})]})}),e.jsx(t,{control:o.control,name:"message",render:({field:f})=>e.jsxs(s,{children:[e.jsx(a,{children:"Message"}),e.jsx(l,{children:e.jsx(ge,{placeholder:"Tell us more...",className:"resize-none h-32",...f})}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx(u,{children:"Your message will be reviewed by our team."}),e.jsxs("span",{className:"text-sm text-muted-foreground",children:[(r==null?void 0:r.length)||0,"/500"]})]}),e.jsx(m,{})]})}),e.jsxs("div",{className:"flex gap-4",children:[e.jsx(p,{type:"submit",className:"flex-1",variant:"default",children:"Send Message"}),e.jsx(p,{type:"button",variant:"outline",onClick:()=>o.reset(),children:"Clear"})]})]})})}},I={render:()=>{const[i,o]=D.useState(!1),[d,r]=D.useState(!1),f=b({username:n().min(3,"Username must be at least 3 characters"),email:n().email("Invalid email address")}),g=F({resolver:x(f),defaultValues:{username:"",email:""}}),ye=async y=>{o(!0),r(!1),await new Promise(ve=>setTimeout(ve,2e3)),console.log("Form submitted:",y),o(!1),r(!0),setTimeout(()=>{r(!1),g.reset()},3e3)};return e.jsx(h,{...g,children:e.jsxs("form",{onSubmit:g.handleSubmit(ye),className:"space-y-6",children:[e.jsx(t,{control:g.control,name:"username",render:({field:y})=>e.jsxs(s,{children:[e.jsx(a,{children:"Username"}),e.jsx(l,{children:e.jsx(c,{placeholder:"johndoe",...y})}),e.jsx(m,{})]})}),e.jsx(t,{control:g.control,name:"email",render:({field:y})=>e.jsxs(s,{children:[e.jsx(a,{children:"Email"}),e.jsx(l,{children:e.jsx(c,{placeholder:"john@example.com",type:"email",...y})}),e.jsx(m,{})]})}),d&&e.jsx("div",{className:"rounded-md bg-green-50 p-4 border border-green-200",style:{borderColor:"var(--primary)",backgroundColor:"hsl(var(--primary) / 0.1)"},children:e.jsx("p",{className:"text-sm font-medium",style:{color:"var(--primary)"},children:"✓ Successfully submitted! Form will reset shortly."})}),e.jsx(p,{type:"submit",className:"w-full",loading:i,disabled:i,children:i?"Submitting...":"Submit"})]})})}},z={render:()=>{const i=b({email:n().email("Invalid email address")}),o=F({resolver:x(i),defaultValues:{email:""}}),d=j(r=>{console.log("Email submitted:",r)});return e.jsx(h,{...o,children:e.jsxs("form",{onSubmit:o.handleSubmit(d),className:"space-y-4",children:[e.jsx(t,{control:o.control,name:"email",render:({field:r})=>e.jsxs(s,{children:[e.jsx(a,{children:"Email"}),e.jsx(l,{children:e.jsx(c,{placeholder:"Enter your email",type:"email",...r})}),e.jsx(m,{})]})}),e.jsx(p,{type:"submit",className:"w-full",children:"Subscribe"})]})})}},L={render:()=>{const i=b({validField:n().min(3),invalidField:n().min(10),disabledField:n(),optionalField:n().optional()}),o=F({resolver:x(i),defaultValues:{validField:"Valid content",invalidField:"Short",disabledField:"Cannot edit",optionalField:""}});D.useEffect(()=>{o.trigger("invalidField")},[o]);const d=j(r=>{console.log("Form values:",r)});return e.jsx(h,{...o,children:e.jsxs("form",{onSubmit:o.handleSubmit(d),className:"space-y-6",children:[e.jsx(t,{control:o.control,name:"validField",render:({field:r})=>e.jsxs(s,{children:[e.jsx(a,{children:"Valid Field"}),e.jsx(l,{children:e.jsx(c,{...r})}),e.jsx(u,{children:"This field has valid content"}),e.jsx(m,{})]})}),e.jsx(t,{control:o.control,name:"invalidField",render:({field:r})=>e.jsxs(s,{children:[e.jsx(a,{children:"Invalid Field (Error State)"}),e.jsx(l,{children:e.jsx(c,{...r})}),e.jsx(u,{children:"This field shows an error (min 10 characters)"}),e.jsx(m,{})]})}),e.jsx(t,{control:o.control,name:"disabledField",render:({field:r})=>e.jsxs(s,{children:[e.jsx(a,{children:"Disabled Field"}),e.jsx(l,{children:e.jsx(c,{...r,disabled:!0})}),e.jsx(u,{children:"This field cannot be edited"}),e.jsx(m,{})]})}),e.jsx(t,{control:o.control,name:"optionalField",render:({field:r})=>e.jsxs(s,{children:[e.jsx(a,{children:"Optional Field"}),e.jsx(l,{children:e.jsx(c,{placeholder:"Not required",...r})}),e.jsx(u,{children:"This field is optional"}),e.jsx(m,{})]})}),e.jsx(p,{type:"submit",className:"w-full",children:"Submit"})]})})}};var R,B,E,V,T;v.parameters={...v.parameters,docs:{...(R=v.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => {
    const formSchema = z.object({
      email: z.string().email('Invalid email address'),
      password: z.string().min(8, 'Password must be at least 8 characters')
    });
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: '',
        password: ''
      }
    });
    const onSubmit = fn((values: z.infer<typeof formSchema>) => {
      console.log('Form submitted:', values);
    });
    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField control={form.control} name="email" render={({
          field
        }) => <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" type="email" {...field} />
                </FormControl>
                <FormDescription>
                  We'll never share your email with anyone else.
                </FormDescription>
                <FormMessage />
              </FormItem>} />
          <FormField control={form.control} name="password" render={({
          field
        }) => <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="••••••••" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>} />
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </Form>;
  }
}`,...(E=(B=v.parameters)==null?void 0:B.docs)==null?void 0:E.source},description:{story:"Simple login form with email and password fields",...(T=(V=v.parameters)==null?void 0:V.docs)==null?void 0:T.description}}};var U,A,Y,_,G;S.parameters={...S.parameters,docs:{...(U=S.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: () => {
    const formSchema = z.object({
      username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be less than 20 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
      bio: z.string().max(160, 'Bio must be less than 160 characters').optional(),
      url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
      marketing: z.boolean().default(false)
    });
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        username: '',
        bio: '',
        url: '',
        marketing: false
      }
    });
    const onSubmit = fn((values: z.infer<typeof formSchema>) => {
      console.log('Profile updated:', values);
    });
    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField control={form.control} name="username" render={({
          field
        }) => <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name. It can be your real name or a pseudonym.
                </FormDescription>
                <FormMessage />
              </FormItem>} />
          <FormField control={form.control} name="bio" render={({
          field
        }) => <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea placeholder="Tell us about yourself..." className="resize-none" {...field} />
                </FormControl>
                <FormDescription>
                  You can write a brief bio about yourself. Max 160 characters.
                </FormDescription>
                <FormMessage />
              </FormItem>} />
          <FormField control={form.control} name="url" render={({
          field
        }) => <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" type="url" {...field} />
                </FormControl>
                <FormDescription>Add a link to your website or portfolio.</FormDescription>
                <FormMessage />
              </FormItem>} />
          <FormField control={form.control} name="marketing" render={({
          field
        }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Marketing emails</FormLabel>
                  <FormDescription>
                    Receive emails about new products, features, and more.
                  </FormDescription>
                </div>
              </FormItem>} />
          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Update Profile
            </Button>
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>;
  }
}`,...(Y=(A=S.parameters)==null?void 0:A.docs)==null?void 0:Y.source},description:{story:"Profile form with multiple field types",...(G=(_=S.parameters)==null?void 0:_.docs)==null?void 0:G.description}}};var W,q,J,O,Z;C.parameters={...C.parameters,docs:{...(W=C.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => {
    const formSchema = z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Invalid email address'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      confirmPassword: z.string(),
      terms: z.boolean().refine(val => val === true, {
        message: 'You must accept the terms and conditions'
      })
    }).refine(data => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword']
    });
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false
      }
    });
    const onSubmit = fn((values: z.infer<typeof formSchema>) => {
      console.log('Registration:', values);
    });
    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField control={form.control} name="name" render={({
          field
        }) => <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>} />
          <FormField control={form.control} name="email" render={({
          field
        }) => <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>} />
          <FormField control={form.control} name="password" render={({
          field
        }) => <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="••••••••" type="password" {...field} />
                </FormControl>
                <FormDescription>Must be at least 8 characters long</FormDescription>
                <FormMessage />
              </FormItem>} />
          <FormField control={form.control} name="confirmPassword" render={({
          field
        }) => <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder="••••••••" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>} />
          <FormField control={form.control} name="terms" render={({
          field
        }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I accept the{' '}
                    <a href="#" className="text-primary hover:underline">
                      terms and conditions
                    </a>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>} />
          <Button type="submit" className="w-full" variant="default">
            Create Account
          </Button>
        </form>
      </Form>;
  }
}`,...(J=(q=C.parameters)==null?void 0:q.docs)==null?void 0:J.source},description:{story:"Registration form with password confirmation",...(Z=(O=C.parameters)==null?void 0:O.docs)==null?void 0:Z.description}}};var $,H,K,Q,X;w.parameters={...w.parameters,docs:{...($=w.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => {
    const formSchema = z.object({
      type: z.enum(['all', 'mentions', 'none'], {
        required_error: 'You need to select a notification type.'
      }),
      mobile: z.boolean().default(false),
      email: z.boolean().default(true)
    });
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        type: 'all',
        mobile: false,
        email: true
      }
    });
    const onSubmit = fn((values: z.infer<typeof formSchema>) => {
      console.log('Preferences saved:', values);
    });
    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField control={form.control} name="type" render={({
          field
        }) => <FormItem className="space-y-3">
                <FormLabel>Notify me about...</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="all" />
                      </FormControl>
                      <FormLabel className="font-normal">All new messages</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="mentions" />
                      </FormControl>
                      <FormLabel className="font-normal">Direct messages and mentions</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="none" />
                      </FormControl>
                      <FormLabel className="font-normal">Nothing</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormDescription>Choose how you want to receive notifications</FormDescription>
                <FormMessage />
              </FormItem>} />
          <div className="space-y-4">
            <FormField control={form.control} name="mobile" render={({
            field
          }) => <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Mobile notifications</FormLabel>
                    <FormDescription>Receive push notifications on your mobile device</FormDescription>
                  </div>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>} />
            <FormField control={form.control} name="email" render={({
            field
          }) => <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Email notifications</FormLabel>
                    <FormDescription>Receive notifications via email</FormDescription>
                  </div>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>} />
          </div>
          <Button type="submit" className="w-full">
            Save Preferences
          </Button>
        </form>
      </Form>;
  }
}`,...(K=(H=w.parameters)==null?void 0:H.docs)==null?void 0:K.source},description:{story:"Form with radio group selection",...(X=(Q=w.parameters)==null?void 0:Q.docs)==null?void 0:X.description}}};var ee,re,oe,se,ae;N.parameters={...N.parameters,docs:{...(ee=N.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: () => {
    const formSchema = z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Invalid email address'),
      subject: z.string().min(5, 'Subject must be at least 5 characters'),
      message: z.string().min(10, 'Message must be at least 10 characters').max(500, 'Message must be less than 500 characters')
    });
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
    });
    const onSubmit = fn((values: z.infer<typeof formSchema>) => {
      console.log('Message sent:', values);
      form.reset();
    });
    const messageValue = form.watch('message');
    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="name" render={({
            field
          }) => <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
            <FormField control={form.control} name="email" render={({
            field
          }) => <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
          </div>
          <FormField control={form.control} name="subject" render={({
          field
        }) => <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="What is this regarding?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>} />
          <FormField control={form.control} name="message" render={({
          field
        }) => <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea placeholder="Tell us more..." className="resize-none h-32" {...field} />
                </FormControl>
                <div className="flex justify-between">
                  <FormDescription>Your message will be reviewed by our team.</FormDescription>
                  <span className="text-sm text-muted-foreground">
                    {messageValue?.length || 0}/500
                  </span>
                </div>
                <FormMessage />
              </FormItem>} />
          <div className="flex gap-4">
            <Button type="submit" className="flex-1" variant="default">
              Send Message
            </Button>
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Clear
            </Button>
          </div>
        </form>
      </Form>;
  }
}`,...(oe=(re=N.parameters)==null?void 0:re.docs)==null?void 0:oe.source},description:{story:"Contact form with validation",...(ae=(se=N.parameters)==null?void 0:se.docs)==null?void 0:ae.description}}};var le,te,me,ne,ie;I.parameters={...I.parameters,docs:{...(le=I.parameters)==null?void 0:le.docs,source:{originalSource:`{
  render: () => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitSuccess, setSubmitSuccess] = React.useState(false);
    const formSchema = z.object({
      username: z.string().min(3, 'Username must be at least 3 characters'),
      email: z.string().email('Invalid email address')
    });
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        username: '',
        email: ''
      }
    });
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      setIsSubmitting(true);
      setSubmitSuccess(false);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted:', values);
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        form.reset();
      }, 3000);
    };
    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField control={form.control} name="username" render={({
          field
        }) => <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>} />
          <FormField control={form.control} name="email" render={({
          field
        }) => <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>} />
          {submitSuccess && <div className="rounded-md bg-green-50 p-4 border border-green-200" style={{
          borderColor: 'var(--primary)',
          backgroundColor: 'hsl(var(--primary) / 0.1)'
        }}>
              <p className="text-sm font-medium" style={{
            color: 'var(--primary)'
          }}>
                ✓ Successfully submitted! Form will reset shortly.
              </p>
            </div>}
          <Button type="submit" className="w-full" loading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </Form>;
  }
}`,...(me=(te=I.parameters)==null?void 0:te.docs)==null?void 0:me.source},description:{story:"Form with custom validation and async submission",...(ie=(ne=I.parameters)==null?void 0:ne.docs)==null?void 0:ie.description}}};var ce,de,ue,fe,pe;z.parameters={...z.parameters,docs:{...(ce=z.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  render: () => {
    const formSchema = z.object({
      email: z.string().email('Invalid email address')
    });
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: ''
      }
    });
    const onSubmit = fn((values: z.infer<typeof formSchema>) => {
      console.log('Email submitted:', values);
    });
    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="email" render={({
          field
        }) => <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>} />
          <Button type="submit" className="w-full">
            Subscribe
          </Button>
        </form>
      </Form>;
  }
}`,...(ue=(de=z.parameters)==null?void 0:de.docs)==null?void 0:ue.source},description:{story:"Minimal form example",...(pe=(fe=z.parameters)==null?void 0:fe.docs)==null?void 0:pe.description}}};var he,Fe,be,xe,je;L.parameters={...L.parameters,docs:{...(he=L.parameters)==null?void 0:he.docs,source:{originalSource:`{
  render: () => {
    const formSchema = z.object({
      validField: z.string().min(3),
      invalidField: z.string().min(10),
      disabledField: z.string(),
      optionalField: z.string().optional()
    });
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        validField: 'Valid content',
        invalidField: 'Short',
        disabledField: 'Cannot edit',
        optionalField: ''
      }
    });

    // Trigger validation to show errors
    React.useEffect(() => {
      form.trigger('invalidField');
    }, [form]);
    const onSubmit = fn((values: z.infer<typeof formSchema>) => {
      console.log('Form values:', values);
    });
    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField control={form.control} name="validField" render={({
          field
        }) => <FormItem>
                <FormLabel>Valid Field</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>This field has valid content</FormDescription>
                <FormMessage />
              </FormItem>} />
          <FormField control={form.control} name="invalidField" render={({
          field
        }) => <FormItem>
                <FormLabel>Invalid Field (Error State)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>This field shows an error (min 10 characters)</FormDescription>
                <FormMessage />
              </FormItem>} />
          <FormField control={form.control} name="disabledField" render={({
          field
        }) => <FormItem>
                <FormLabel>Disabled Field</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormDescription>This field cannot be edited</FormDescription>
                <FormMessage />
              </FormItem>} />
          <FormField control={form.control} name="optionalField" render={({
          field
        }) => <FormItem>
                <FormLabel>Optional Field</FormLabel>
                <FormControl>
                  <Input placeholder="Not required" {...field} />
                </FormControl>
                <FormDescription>This field is optional</FormDescription>
                <FormMessage />
              </FormItem>} />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>;
  }
}`,...(be=(Fe=L.parameters)==null?void 0:Fe.docs)==null?void 0:be.source},description:{story:"Form with all field states showcased",...(je=(xe=L.parameters)==null?void 0:xe.docs)==null?void 0:je.description}}};const tr=["LoginForm","ProfileForm","RegistrationForm","NotificationPreferences","ContactForm","AsyncSubmission","MinimalExample","AllFieldStates"];export{L as AllFieldStates,I as AsyncSubmission,N as ContactForm,v as LoginForm,z as MinimalExample,w as NotificationPreferences,S as ProfileForm,C as RegistrationForm,tr as __namedExportsOrder,lr as default};
