import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{r as c}from"./index-B2-qRKKC.js";import{c as _s}from"./index-D7N8UVpi.js";import{P as Is}from"./index-B5oyz0SX.js";import{c as $s}from"./cn-CKXzwFwe.js";import{L as r}from"./label-BZCfx7Ud.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-kS-9iBlu.js";import"./index-BiMR7eR1.js";import"./index-BFjtS4uE.js";import"./clsx-B-dksMZM.js";import"./index-Dp3B9jqt.js";var D="Progress",R=100,[ks]=_s(D),[Gs,Us]=ks(D),Bs=c.forwardRef((s,t)=>{const{__scopeProgress:n,value:o=null,max:l,getValueLabel:u=Vs,...i}=s;(l||l===0)&&!z(l)&&console.error(As(`${l}`,"Progress"));const d=z(l)?l:R;o!==null&&!_(o,d)&&console.error(Ws(`${o}`,"Progress"));const m=_(o,d)?o:null,zs=M(m)?u(m,d):void 0;return e.jsx(Gs,{scope:n,value:m,max:d,children:e.jsx(Is.div,{"aria-valuemax":d,"aria-valuemin":0,"aria-valuenow":M(m)?m:void 0,"aria-valuetext":zs,role:"progressbar","data-state":Ds(m,d),"data-value":m??void 0,"data-max":d,...i,ref:t})})});Bs.displayName=D;var Es="ProgressIndicator",Ms=c.forwardRef((s,t)=>{const{__scopeProgress:n,...o}=s,l=Us(Es,n);return e.jsx(Is.div,{"data-state":Ds(l.value,l.max),"data-value":l.value??void 0,"data-max":l.max,...o,ref:t})});Ms.displayName=Es;function Vs(s,t){return`${Math.round(s/t*100)}%`}function Ds(s,t){return s==null?"indeterminate":s===t?"complete":"loading"}function M(s){return typeof s=="number"}function z(s){return M(s)&&!isNaN(s)&&s>0}function _(s,t){return M(s)&&!isNaN(s)&&s<=t&&s>=0}function As(s,t){return`Invalid prop \`max\` of value \`${s}\` supplied to \`${t}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${R}\`.`}function Ws(s,t){return`Invalid prop \`value\` of value \`${s}\` supplied to \`${t}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${R} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`}var Rs=Bs,Os=Ms;const a=c.forwardRef(({className:s,value:t,...n},o)=>e.jsx(Rs,{ref:o,className:$s("relative h-4 w-full overflow-hidden rounded-full bg-secondary",s),...n,children:e.jsx(Os,{className:"h-full w-full flex-1 bg-primary transition-all",style:{transform:`translateX(-${100-(t||0)}%)`}})}));a.displayName=Rs.displayName;try{a.displayName="Progress",a.__docgenInfo={description:"",displayName:"Progress",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}}}}}catch{}const ta={title:"Tier 1: Primitives/shadcn/Progress",component:a,parameters:{layout:"centered",docs:{description:{component:"Displays an indicator showing the completion progress of a task, typically displayed as a progress bar."}}},tags:["autodocs"],argTypes:{value:{control:{type:"range",min:0,max:100,step:1},description:"The progress value (0-100)"},max:{control:"number",description:"Maximum value"},className:{control:"text",description:"Additional CSS classes"}},decorators:[s=>e.jsx("div",{className:"w-[400px]",children:e.jsx(s,{})})]},p={args:{value:0}},x={args:{value:25}},v={args:{value:50}},g={args:{value:75}},f={args:{value:100}},N={args:{value:void 0}},b={render:()=>e.jsxs("div",{className:"w-full space-y-2",children:[e.jsx(r,{htmlFor:"file-upload",children:"Uploading file..."}),e.jsx(a,{id:"file-upload",value:60})]})},j={render:()=>e.jsxs("div",{className:"w-full space-y-2",children:[e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx(r,{children:"Installation progress"}),e.jsxs("span",{className:"text-muted-foreground",children:[65,"%"]})]}),e.jsx(a,{value:65})]})},h={render:()=>{const[s,t]=c.useState(0);return c.useEffect(()=>{const n=setTimeout(()=>{s<100&&t(s+1)},50);return()=>clearTimeout(n)},[s]),e.jsxs("div",{className:"w-full space-y-2",children:[e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx(r,{children:"Processing..."}),e.jsxs("span",{className:"text-muted-foreground",children:[s,"%"]})]}),e.jsx(a,{value:s})]})}},y={render:()=>e.jsx(a,{value:60,className:"h-2"})},w={render:()=>e.jsx(a,{value:60,className:"h-6"})},P={render:()=>e.jsxs("div",{className:"w-full space-y-2",children:[e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx(r,{children:"Course progress"}),e.jsx("span",{className:"font-medium",style:{color:"#0ec2bc"},children:"75%"})]}),e.jsx(a,{value:75,className:"[&>div]:bg-[#0ec2bc]"})]})},L={render:()=>e.jsxs("div",{className:"w-full space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"text-green-700",children:"Success"}),e.jsx(a,{value:80,className:"bg-green-100 [&>div]:bg-green-500"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"text-yellow-700",children:"Warning"}),e.jsx(a,{value:45,className:"bg-yellow-100 [&>div]:bg-yellow-500"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"text-red-700",children:"Error"}),e.jsx(a,{value:90,className:"bg-red-100 [&>div]:bg-red-500"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"text-blue-700",children:"Info"}),e.jsx(a,{value:60,className:"bg-blue-100 [&>div]:bg-blue-500"})]})]})},S={render:()=>{const[s,t]=c.useState(13);return c.useEffect(()=>{const n=setTimeout(()=>{s<100&&t(s+10)},500);return()=>clearTimeout(n)},[s]),e.jsxs("div",{className:"w-full space-y-2",children:[e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx(r,{children:"document.pdf"}),e.jsx("span",{className:"text-muted-foreground",children:s<100?`${s}%`:"Complete ✓"})]}),e.jsx(a,{value:s,className:"h-2"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:s<100?"Uploading...":"Upload complete"})]})}},C={render:()=>{const[s,t]=c.useState(0),n=45.6;c.useEffect(()=>{const l=setTimeout(()=>{s<100&&t(s+2)},100);return()=>clearTimeout(l)},[s]);const o=(s/100*n).toFixed(1);return e.jsxs("div",{className:"w-full space-y-2",children:[e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx(r,{children:"Downloading software update..."}),e.jsxs("span",{className:"text-muted-foreground",children:[o," MB / ",n," MB"]})]}),e.jsx(a,{value:s}),e.jsxs("div",{className:"flex justify-between text-xs text-muted-foreground",children:[e.jsxs("span",{children:[s,"% complete"]}),e.jsx("span",{children:s<100?"Time remaining: ~2 min":"Download complete"})]})]})}},T={render:()=>e.jsxs("div",{className:"w-full space-y-2",children:[e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx(r,{children:"Course: React Fundamentals"}),e.jsxs("span",{className:"font-medium",style:{color:"#0ec2bc"},children:[12,"/",20," lessons"]})]}),e.jsx(a,{value:60,className:"[&>div]:bg-[#0ec2bc]"}),e.jsxs("p",{className:"text-xs text-muted-foreground",children:[Math.round(60),"% complete - ",8," lessons remaining"]})]})},F={render:()=>{const[s,t]=c.useState(1),n=5,o=s/n*100;c.useEffect(()=>{const u=setTimeout(()=>{s<n&&t(s+1)},1500);return()=>clearTimeout(u)},[s]);const l=["Verifying system requirements","Downloading dependencies","Installing packages","Configuring environment","Finalizing setup"];return e.jsxs("div",{className:"w-full space-y-3",children:[e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx(r,{children:"Installation in progress"}),e.jsxs("span",{className:"text-muted-foreground",children:["Step ",s," of ",n]})]}),e.jsx(a,{value:o,className:"h-3"}),e.jsx("div",{className:"space-y-1",children:l.map((u,i)=>e.jsxs("div",{className:`text-xs ${i<s?"text-green-600 line-through":i===s?"text-foreground font-medium":"text-muted-foreground"}`,children:[i<s?"✓":i===s?"▶":"○"," ",u]},i))})]})}},I={render:()=>e.jsxs("div",{className:"w-full space-y-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx(r,{children:"Storage used"}),e.jsx("span",{className:"text-muted-foreground",children:"7.2 GB / 10 GB"})]}),e.jsx(a,{value:72})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx(r,{children:"Memory usage"}),e.jsx("span",{className:"text-muted-foreground",children:"4.8 GB / 8 GB"})]}),e.jsx(a,{value:60})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx(r,{children:"CPU usage"}),e.jsx("span",{className:"text-muted-foreground",children:"45%"})]}),e.jsx(a,{value:45})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx(r,{children:"Bandwidth"}),e.jsx("span",{className:"text-muted-foreground",children:"850 GB / 1 TB"})]}),e.jsx(a,{value:85})]})]})},B={render:()=>e.jsxs("div",{className:"w-full space-y-3",children:[e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx(r,{children:"Profile completion"}),e.jsxs("span",{className:"font-medium",style:{color:"#0ec2bc"},children:[Math.round(60),"%"]})]}),e.jsx(a,{value:60,className:"h-3 [&>div]:bg-[#0ec2bc]"}),e.jsxs("div",{className:"space-y-1 text-xs",children:[e.jsx("div",{className:"flex justify-between",children:e.jsx("span",{className:"text-green-600",children:"✓ Basic information"})}),e.jsx("div",{className:"flex justify-between",children:e.jsx("span",{className:"text-green-600",children:"✓ Profile picture"})}),e.jsx("div",{className:"flex justify-between",children:e.jsx("span",{className:"text-green-600",children:"✓ Contact details"})}),e.jsx("div",{className:"flex justify-between",children:e.jsx("span",{className:"text-green-600",children:"✓ Bio"})}),e.jsx("div",{className:"flex justify-between",children:e.jsx("span",{className:"text-muted-foreground",children:"○ Skills"})}),e.jsx("div",{className:"flex justify-between",children:e.jsx("span",{className:"text-muted-foreground",children:"○ Work experience"})}),e.jsx("div",{className:"flex justify-between",children:e.jsx("span",{className:"text-muted-foreground",children:"○ Education"})}),e.jsx("div",{className:"flex justify-between",children:e.jsx("span",{className:"text-muted-foreground",children:"○ Certifications"})})]})]})},E={render:()=>e.jsxs("div",{className:"w-full space-y-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"text-base",children:"0% - Not started"}),e.jsx(a,{value:0})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"text-base",children:"25% - Getting started"}),e.jsx(a,{value:25})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"text-base",children:"50% - Half way"}),e.jsx(a,{value:50})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"text-base",children:"75% - Almost there"}),e.jsx(a,{value:75})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"text-base",children:"100% - Complete"}),e.jsx(a,{value:100})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"text-base",children:"Indeterminate - Unknown progress"}),e.jsx(a,{value:void 0})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"text-base",children:"Small size (h-2)"}),e.jsx(a,{value:60,className:"h-2"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"text-base",children:"Default size (h-4)"}),e.jsx(a,{value:60})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"text-base",children:"Large size (h-6)"}),e.jsx(a,{value:60,className:"h-6"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"text-base",children:"Custom color (Ozean Licht turquoise)"}),e.jsx(a,{value:60,className:"[&>div]:bg-[#0ec2bc]"})]})]})};var $,k,G,U,V;p.parameters={...p.parameters,docs:{...($=p.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    value: 0
  }
}`,...(G=(k=p.parameters)==null?void 0:k.docs)==null?void 0:G.source},description:{story:"Default progress bar at 0%",...(V=(U=p.parameters)==null?void 0:U.docs)==null?void 0:V.description}}};var A,W,O,q,H;x.parameters={...x.parameters,docs:{...(A=x.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    value: 25
  }
}`,...(O=(W=x.parameters)==null?void 0:W.docs)==null?void 0:O.source},description:{story:"Progress at 25%",...(H=(q=x.parameters)==null?void 0:q.docs)==null?void 0:H.description}}};var X,J,K,Q,Y;v.parameters={...v.parameters,docs:{...(X=v.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    value: 50
  }
}`,...(K=(J=v.parameters)==null?void 0:J.docs)==null?void 0:K.source},description:{story:"Progress at 50% (half complete)",...(Y=(Q=v.parameters)==null?void 0:Q.docs)==null?void 0:Y.description}}};var Z,ee,se,ae,re;g.parameters={...g.parameters,docs:{...(Z=g.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    value: 75
  }
}`,...(se=(ee=g.parameters)==null?void 0:ee.docs)==null?void 0:se.source},description:{story:"Progress at 75%",...(re=(ae=g.parameters)==null?void 0:ae.docs)==null?void 0:re.description}}};var te,ne,le,oe,ce;f.parameters={...f.parameters,docs:{...(te=f.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {
    value: 100
  }
}`,...(le=(ne=f.parameters)==null?void 0:ne.docs)==null?void 0:le.source},description:{story:"Progress at 100% (complete)",...(ce=(oe=f.parameters)==null?void 0:oe.docs)==null?void 0:ce.description}}};var ie,de,me,ue,pe;N.parameters={...N.parameters,docs:{...(ie=N.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  args: {
    value: undefined
  }
}`,...(me=(de=N.parameters)==null?void 0:de.docs)==null?void 0:me.source},description:{story:`Indeterminate progress (no value set)
Useful for operations where progress cannot be determined`,...(pe=(ue=N.parameters)==null?void 0:ue.docs)==null?void 0:pe.description}}};var xe,ve,ge,fe,Ne;b.parameters={...b.parameters,docs:{...(xe=b.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  render: () => <div className="w-full space-y-2">
      <Label htmlFor="file-upload">Uploading file...</Label>
      <Progress id="file-upload" value={60} />
    </div>
}`,...(ge=(ve=b.parameters)==null?void 0:ve.docs)==null?void 0:ge.source},description:{story:"Progress with label",...(Ne=(fe=b.parameters)==null?void 0:fe.docs)==null?void 0:Ne.description}}};var be,je,he,ye,we;j.parameters={...j.parameters,docs:{...(be=j.parameters)==null?void 0:be.docs,source:{originalSource:`{
  render: () => {
    const value = 65;
    return <div className="w-full space-y-2">
        <div className="flex justify-between text-sm">
          <Label>Installation progress</Label>
          <span className="text-muted-foreground">{value}%</span>
        </div>
        <Progress value={value} />
      </div>;
  }
}`,...(he=(je=j.parameters)==null?void 0:je.docs)==null?void 0:he.source},description:{story:"Progress with percentage display",...(we=(ye=j.parameters)==null?void 0:ye.docs)==null?void 0:we.description}}};var Pe,Le,Se,Ce,Te;h.parameters={...h.parameters,docs:{...(Pe=h.parameters)==null?void 0:Pe.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = React.useState(0);
    React.useEffect(() => {
      const timer = setTimeout(() => {
        if (value < 100) {
          setValue(value + 1);
        }
      }, 50);
      return () => clearTimeout(timer);
    }, [value]);
    return <div className="w-full space-y-2">
        <div className="flex justify-between text-sm">
          <Label>Processing...</Label>
          <span className="text-muted-foreground">{value}%</span>
        </div>
        <Progress value={value} />
      </div>;
  }
}`,...(Se=(Le=h.parameters)==null?void 0:Le.docs)==null?void 0:Se.source},description:{story:"Progress with live value tracking",...(Te=(Ce=h.parameters)==null?void 0:Ce.docs)==null?void 0:Te.description}}};var Fe,Ie,Be,Ee,Me;y.parameters={...y.parameters,docs:{...(Fe=y.parameters)==null?void 0:Fe.docs,source:{originalSource:`{
  render: () => <Progress value={60} className="h-2" />
}`,...(Be=(Ie=y.parameters)==null?void 0:Ie.docs)==null?void 0:Be.source},description:{story:"Small progress bar",...(Me=(Ee=y.parameters)==null?void 0:Ee.docs)==null?void 0:Me.description}}};var De,Re,ze,_e,$e;w.parameters={...w.parameters,docs:{...(De=w.parameters)==null?void 0:De.docs,source:{originalSource:`{
  render: () => <Progress value={60} className="h-6" />
}`,...(ze=(Re=w.parameters)==null?void 0:Re.docs)==null?void 0:ze.source},description:{story:"Large progress bar",...($e=(_e=w.parameters)==null?void 0:_e.docs)==null?void 0:$e.description}}};var ke,Ge,Ue,Ve,Ae;P.parameters={...P.parameters,docs:{...(ke=P.parameters)==null?void 0:ke.docs,source:{originalSource:`{
  render: () => <div className="w-full space-y-2">
      <div className="flex justify-between text-sm">
        <Label>Course progress</Label>
        <span className="font-medium" style={{
        color: '#0ec2bc'
      }}>75%</span>
      </div>
      <Progress value={75} className="[&>div]:bg-[#0ec2bc]" />
    </div>
}`,...(Ue=(Ge=P.parameters)==null?void 0:Ge.docs)==null?void 0:Ue.source},description:{story:"Progress with custom color (Ozean Licht turquoise)",...(Ae=(Ve=P.parameters)==null?void 0:Ve.docs)==null?void 0:Ae.description}}};var We,Oe,qe,He,Xe;L.parameters={...L.parameters,docs:{...(We=L.parameters)==null?void 0:We.docs,source:{originalSource:`{
  render: () => <div className="w-full space-y-4">
      <div className="space-y-2">
        <Label className="text-green-700">Success</Label>
        <Progress value={80} className="bg-green-100 [&>div]:bg-green-500" />
      </div>

      <div className="space-y-2">
        <Label className="text-yellow-700">Warning</Label>
        <Progress value={45} className="bg-yellow-100 [&>div]:bg-yellow-500" />
      </div>

      <div className="space-y-2">
        <Label className="text-red-700">Error</Label>
        <Progress value={90} className="bg-red-100 [&>div]:bg-red-500" />
      </div>

      <div className="space-y-2">
        <Label className="text-blue-700">Info</Label>
        <Progress value={60} className="bg-blue-100 [&>div]:bg-blue-500" />
      </div>
    </div>
}`,...(qe=(Oe=L.parameters)==null?void 0:Oe.docs)==null?void 0:qe.source},description:{story:"Progress with custom background and indicator colors",...(Xe=(He=L.parameters)==null?void 0:He.docs)==null?void 0:Xe.description}}};var Je,Ke,Qe,Ye,Ze;S.parameters={...S.parameters,docs:{...(Je=S.parameters)==null?void 0:Je.docs,source:{originalSource:`{
  render: () => {
    const [progress, setProgress] = React.useState(13);
    React.useEffect(() => {
      const timer = setTimeout(() => {
        if (progress < 100) {
          setProgress(progress + 10);
        }
      }, 500);
      return () => clearTimeout(timer);
    }, [progress]);
    return <div className="w-full space-y-2">
        <div className="flex justify-between text-sm">
          <Label>document.pdf</Label>
          <span className="text-muted-foreground">
            {progress < 100 ? \`\${progress}%\` : 'Complete ✓'}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground">
          {progress < 100 ? 'Uploading...' : 'Upload complete'}
        </p>
      </div>;
  }
}`,...(Qe=(Ke=S.parameters)==null?void 0:Ke.docs)==null?void 0:Qe.source},description:{story:"File upload progress example",...(Ze=(Ye=S.parameters)==null?void 0:Ye.docs)==null?void 0:Ze.description}}};var es,ss,as,rs,ts;C.parameters={...C.parameters,docs:{...(es=C.parameters)==null?void 0:es.docs,source:{originalSource:`{
  render: () => {
    const [progress, setProgress] = React.useState(0);
    const totalSize = 45.6; // MB

    React.useEffect(() => {
      const timer = setTimeout(() => {
        if (progress < 100) {
          setProgress(progress + 2);
        }
      }, 100);
      return () => clearTimeout(timer);
    }, [progress]);
    const downloaded = (progress / 100 * totalSize).toFixed(1);
    return <div className="w-full space-y-2">
        <div className="flex justify-between text-sm">
          <Label>Downloading software update...</Label>
          <span className="text-muted-foreground">
            {downloaded} MB / {totalSize} MB
          </span>
        </div>
        <Progress value={progress} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{progress}% complete</span>
          <span>{progress < 100 ? 'Time remaining: ~2 min' : 'Download complete'}</span>
        </div>
      </div>;
  }
}`,...(as=(ss=C.parameters)==null?void 0:ss.docs)==null?void 0:as.source},description:{story:"Download progress example",...(ts=(rs=C.parameters)==null?void 0:rs.docs)==null?void 0:ts.description}}};var ns,ls,os,cs,is;T.parameters={...T.parameters,docs:{...(ns=T.parameters)==null?void 0:ns.docs,source:{originalSource:`{
  render: () => {
    const completedLessons = 12;
    const totalLessons = 20;
    const progress = completedLessons / totalLessons * 100;
    return <div className="w-full space-y-2">
        <div className="flex justify-between text-sm">
          <Label>Course: React Fundamentals</Label>
          <span className="font-medium" style={{
          color: '#0ec2bc'
        }}>
            {completedLessons}/{totalLessons} lessons
          </span>
        </div>
        <Progress value={progress} className="[&>div]:bg-[#0ec2bc]" />
        <p className="text-xs text-muted-foreground">
          {Math.round(progress)}% complete - {totalLessons - completedLessons} lessons remaining
        </p>
      </div>;
  }
}`,...(os=(ls=T.parameters)==null?void 0:ls.docs)==null?void 0:os.source},description:{story:"Course progress tracker",...(is=(cs=T.parameters)==null?void 0:cs.docs)==null?void 0:is.description}}};var ds,ms,us,ps,xs;F.parameters={...F.parameters,docs:{...(ds=F.parameters)==null?void 0:ds.docs,source:{originalSource:`{
  render: () => {
    const [currentStep, setCurrentStep] = React.useState(1);
    const totalSteps = 5;
    const progress = currentStep / totalSteps * 100;
    React.useEffect(() => {
      const timer = setTimeout(() => {
        if (currentStep < totalSteps) {
          setCurrentStep(currentStep + 1);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }, [currentStep]);
    const steps = ['Verifying system requirements', 'Downloading dependencies', 'Installing packages', 'Configuring environment', 'Finalizing setup'];
    return <div className="w-full space-y-3">
        <div className="flex justify-between text-sm">
          <Label>Installation in progress</Label>
          <span className="text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <Progress value={progress} className="h-3" />
        <div className="space-y-1">
          {steps.map((step, index) => <div key={index} className={\`text-xs \${index < currentStep ? 'text-green-600 line-through' : index === currentStep ? 'text-foreground font-medium' : 'text-muted-foreground'}\`}>
              {index < currentStep ? '✓' : index === currentStep ? '▶' : '○'} {step}
            </div>)}
        </div>
      </div>;
  }
}`,...(us=(ms=F.parameters)==null?void 0:ms.docs)==null?void 0:us.source},description:{story:"Installation steps progress",...(xs=(ps=F.parameters)==null?void 0:ps.docs)==null?void 0:xs.description}}};var vs,gs,fs,Ns,bs;I.parameters={...I.parameters,docs:{...(vs=I.parameters)==null?void 0:vs.docs,source:{originalSource:`{
  render: () => <div className="w-full space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <Label>Storage used</Label>
          <span className="text-muted-foreground">7.2 GB / 10 GB</span>
        </div>
        <Progress value={72} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <Label>Memory usage</Label>
          <span className="text-muted-foreground">4.8 GB / 8 GB</span>
        </div>
        <Progress value={60} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <Label>CPU usage</Label>
          <span className="text-muted-foreground">45%</span>
        </div>
        <Progress value={45} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <Label>Bandwidth</Label>
          <span className="text-muted-foreground">850 GB / 1 TB</span>
        </div>
        <Progress value={85} />
      </div>
    </div>
}`,...(fs=(gs=I.parameters)==null?void 0:gs.docs)==null?void 0:fs.source},description:{story:"Multiple progress bars (dashboard example)",...(bs=(Ns=I.parameters)==null?void 0:Ns.docs)==null?void 0:bs.description}}};var js,hs,ys,ws,Ps;B.parameters={...B.parameters,docs:{...(js=B.parameters)==null?void 0:js.docs,source:{originalSource:`{
  render: () => {
    const completedFields = 6;
    const totalFields = 10;
    const progress = completedFields / totalFields * 100;
    return <div className="w-full space-y-3">
        <div className="flex justify-between text-sm">
          <Label>Profile completion</Label>
          <span className="font-medium" style={{
          color: '#0ec2bc'
        }}>
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-3 [&>div]:bg-[#0ec2bc]" />
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-green-600">✓ Basic information</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-600">✓ Profile picture</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-600">✓ Contact details</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-600">✓ Bio</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">○ Skills</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">○ Work experience</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">○ Education</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">○ Certifications</span>
          </div>
        </div>
      </div>;
  }
}`,...(ys=(hs=B.parameters)==null?void 0:hs.docs)==null?void 0:ys.source},description:{story:"Profile completion tracker",...(Ps=(ws=B.parameters)==null?void 0:ws.docs)==null?void 0:Ps.description}}};var Ls,Ss,Cs,Ts,Fs;E.parameters={...E.parameters,docs:{...(Ls=E.parameters)==null?void 0:Ls.docs,source:{originalSource:`{
  render: () => <div className="w-full space-y-6">
      <div className="space-y-2">
        <Label className="text-base">0% - Not started</Label>
        <Progress value={0} />
      </div>

      <div className="space-y-2">
        <Label className="text-base">25% - Getting started</Label>
        <Progress value={25} />
      </div>

      <div className="space-y-2">
        <Label className="text-base">50% - Half way</Label>
        <Progress value={50} />
      </div>

      <div className="space-y-2">
        <Label className="text-base">75% - Almost there</Label>
        <Progress value={75} />
      </div>

      <div className="space-y-2">
        <Label className="text-base">100% - Complete</Label>
        <Progress value={100} />
      </div>

      <div className="space-y-2">
        <Label className="text-base">Indeterminate - Unknown progress</Label>
        <Progress value={undefined} />
      </div>

      <div className="space-y-2">
        <Label className="text-base">Small size (h-2)</Label>
        <Progress value={60} className="h-2" />
      </div>

      <div className="space-y-2">
        <Label className="text-base">Default size (h-4)</Label>
        <Progress value={60} />
      </div>

      <div className="space-y-2">
        <Label className="text-base">Large size (h-6)</Label>
        <Progress value={60} className="h-6" />
      </div>

      <div className="space-y-2">
        <Label className="text-base">Custom color (Ozean Licht turquoise)</Label>
        <Progress value={60} className="[&>div]:bg-[#0ec2bc]" />
      </div>
    </div>
}`,...(Cs=(Ss=E.parameters)==null?void 0:Ss.docs)==null?void 0:Cs.source},description:{story:"All progress states showcase",...(Fs=(Ts=E.parameters)==null?void 0:Ts.docs)==null?void 0:Fs.description}}};const na=["Default","TwentyFivePercent","FiftyPercent","SeventyFivePercent","Complete","Indeterminate","WithLabel","WithPercentage","WithLiveValue","Small","Large","OzeanLichtBranded","CustomColors","FileUpload","Download","CourseProgress","InstallationSteps","MultipleProgress","ProfileCompletion","AllStates"];export{E as AllStates,f as Complete,T as CourseProgress,L as CustomColors,p as Default,C as Download,v as FiftyPercent,S as FileUpload,N as Indeterminate,F as InstallationSteps,w as Large,I as MultipleProgress,P as OzeanLichtBranded,B as ProfileCompletion,g as SeventyFivePercent,y as Small,x as TwentyFivePercent,b as WithLabel,h as WithLiveValue,j as WithPercentage,na as __namedExportsOrder,ta as default};
