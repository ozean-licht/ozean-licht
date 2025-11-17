import{j as s}from"./jsx-runtime-DF2Pcvd1.js";import{f as V}from"./index-CJu6nLMj.js";import{g as xe,s as je,h as Wr,F as D,u as T,a as _,b as h,c as p,d as g,e as I,f as y}from"./form-BxklCv0T.js";import{I as Z}from"./input-Db9iZ-Hs.js";import{T as Jr}from"./textarea-Cd1j4ONA.js";import{B as E}from"./button-DP4L7qO7.js";import{C as de}from"./checkbox-CokyIhK-.js";import{R as ho,a as ze}from"./radio-group-DMbqJHS0.js";import{r as ke}from"./index-B2-qRKKC.js";import"./index-BiMR7eR1.js";import"./index-BFjtS4uE.js";import"./cn-CytzSlOG.js";import"./label-Cp9r14oL.js";import"./index-B5oyz0SX.js";import"./index-kS-9iBlu.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-DVF2XGCm.js";import"./index-D5ysUGwq.js";import"./index-BlCrtW8-.js";import"./index-D1vk04JX.js";import"./index-_AbP6Uzr.js";import"./index-BYfY0yFj.js";import"./index-PNzqWif7.js";import"./check-BFJmnSzs.js";import"./createLucideIcon-BbF4D6Jl.js";import"./index-DGkrtcXD.js";import"./index-BDyC_JNs.js";import"./index-CpxwHbl5.js";import"./index-ciuW_uyV.js";import"./index-D6fdIYSQ.js";import"./circle-KqIYxgtT.js";const Oe=(e,r,o)=>{if(e&&"reportValidity"in e){const n=xe(o,r);e.setCustomValidity(n&&n.message||""),e.reportValidity()}},Se=(e,r)=>{for(const o in r.fields){const n=r.fields[o];n&&n.ref&&"reportValidity"in n.ref?Oe(n.ref,o,e):n&&n.refs&&n.refs.forEach(t=>Oe(t,o,e))}},Re=(e,r)=>{r.shouldUseNativeValidation&&Se(e,r);const o={};for(const n in e){const t=xe(r.fields,n),i=Object.assign(e[n]||{},{ref:t&&t.ref});if(po(r.names||Object.keys(e),n)){const a=Object.assign({},xe(o,n));je(a,"root",i),je(o,n,a)}else je(o,n,i)}return o},po=(e,r)=>{const o=Le(r);return e.some(n=>Le(n).match(`^${o}\\.\\d+`))};function Le(e){return e.replace(/\]|\[/g,"")}function l(e,r,o){function n(c,u){var m;Object.defineProperty(c,"_zod",{value:c._zod??{},enumerable:!1}),(m=c._zod).traits??(m.traits=new Set),c._zod.traits.add(e),r(c,u);for(const f in a.prototype)f in c||Object.defineProperty(c,f,{value:a.prototype[f].bind(c)});c._zod.constr=a,c._zod.def=u}const t=(o==null?void 0:o.Parent)??Object;class i extends t{}Object.defineProperty(i,"name",{value:e});function a(c){var u;const m=o!=null&&o.Parent?new i:this;n(m,c),(u=m._zod).deferred??(u.deferred=[]);for(const f of m._zod.deferred)f();return m}return Object.defineProperty(a,"init",{value:n}),Object.defineProperty(a,Symbol.hasInstance,{value:c=>{var u,m;return o!=null&&o.Parent&&c instanceof o.Parent?!0:(m=(u=c==null?void 0:c._zod)==null?void 0:u.traits)==null?void 0:m.has(e)}}),Object.defineProperty(a,"name",{value:e}),a}class K extends Error{constructor(){super("Encountered Promise during synchronous parse. Use .parseAsync() instead.")}}class Gr extends Error{constructor(r){super(`Encountered unidirectional transform during encode: ${r}`),this.name="ZodEncodeError"}}const Kr={};function U(e){return Kr}function go(e){const r=Object.values(e).filter(n=>typeof n=="number");return Object.entries(e).filter(([n,t])=>r.indexOf(+n)===-1).map(([n,t])=>t)}function Ze(e,r){return typeof r=="bigint"?r.toString():r}function Ce(e){return{get value(){{const r=e();return Object.defineProperty(this,"value",{value:r}),r}}}}function Pe(e){return e==null}function Ee(e){const r=e.startsWith("^")?1:0,o=e.endsWith("$")?e.length-1:e.length;return e.slice(r,o)}const Ue=Symbol("evaluating");function v(e,r,o){let n;Object.defineProperty(e,r,{get(){if(n!==Ue)return n===void 0&&(n=Ue,n=o()),n},set(t){Object.defineProperty(e,r,{value:t})},configurable:!0})}function B(e,r,o){Object.defineProperty(e,r,{value:o,writable:!0,enumerable:!0,configurable:!0})}function W(...e){const r={};for(const o of e){const n=Object.getOwnPropertyDescriptors(o);Object.assign(r,n)}return Object.defineProperties({},r)}function Me(e){return JSON.stringify(e)}const Yr="captureStackTrace"in Error?Error.captureStackTrace:(...e)=>{};function fe(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}const vo=Ce(()=>{var e;if(typeof navigator<"u"&&((e=navigator==null?void 0:navigator.userAgent)!=null&&e.includes("Cloudflare")))return!1;try{const r=Function;return new r(""),!0}catch{return!1}});function se(e){if(fe(e)===!1)return!1;const r=e.constructor;if(r===void 0)return!0;const o=r.prototype;return!(fe(o)===!1||Object.prototype.hasOwnProperty.call(o,"isPrototypeOf")===!1)}function qr(e){return se(e)?{...e}:Array.isArray(e)?[...e]:e}const bo=new Set(["string","number","symbol"]);function Y(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function O(e,r,o){const n=new e._zod.constr(r??e._zod.def);return(!r||o!=null&&o.parent)&&(n._zod.parent=e),n}function d(e){const r=e;if(!r)return{};if(typeof r=="string")return{error:()=>r};if((r==null?void 0:r.message)!==void 0){if((r==null?void 0:r.error)!==void 0)throw new Error("Cannot specify both `message` and `error` params");r.error=r.message}return delete r.message,typeof r.error=="string"?{...r,error:()=>r.error}:r}function _o(e){return Object.keys(e).filter(r=>e[r]._zod.optin==="optional"&&e[r]._zod.optout==="optional")}function Fo(e,r){const o=e._zod.def,n=W(e._zod.def,{get shape(){const t={};for(const i in r){if(!(i in o.shape))throw new Error(`Unrecognized key: "${i}"`);r[i]&&(t[i]=o.shape[i])}return B(this,"shape",t),t},checks:[]});return O(e,n)}function wo(e,r){const o=e._zod.def,n=W(e._zod.def,{get shape(){const t={...e._zod.def.shape};for(const i in r){if(!(i in o.shape))throw new Error(`Unrecognized key: "${i}"`);r[i]&&delete t[i]}return B(this,"shape",t),t},checks:[]});return O(e,n)}function yo(e,r){if(!se(r))throw new Error("Invalid input to extend: expected a plain object");const o=e._zod.def.checks;if(o&&o.length>0)throw new Error("Object schemas containing refinements cannot be extended. Use `.safeExtend()` instead.");const t=W(e._zod.def,{get shape(){const i={...e._zod.def.shape,...r};return B(this,"shape",i),i},checks:[]});return O(e,t)}function jo(e,r){if(!se(r))throw new Error("Invalid input to safeExtend: expected a plain object");const o={...e._zod.def,get shape(){const n={...e._zod.def.shape,...r};return B(this,"shape",n),n},checks:e._zod.def.checks};return O(e,o)}function zo(e,r){const o=W(e._zod.def,{get shape(){const n={...e._zod.def.shape,...r._zod.def.shape};return B(this,"shape",n),n},get catchall(){return r._zod.def.catchall},checks:[]});return O(e,o)}function xo(e,r,o){const n=W(r._zod.def,{get shape(){const t=r._zod.def.shape,i={...t};if(o)for(const a in o){if(!(a in t))throw new Error(`Unrecognized key: "${a}"`);o[a]&&(i[a]=e?new e({type:"optional",innerType:t[a]}):t[a])}else for(const a in t)i[a]=e?new e({type:"optional",innerType:t[a]}):t[a];return B(this,"shape",i),i},checks:[]});return O(r,n)}function ko(e,r,o){const n=W(r._zod.def,{get shape(){const t=r._zod.def.shape,i={...t};if(o)for(const a in o){if(!(a in i))throw new Error(`Unrecognized key: "${a}"`);o[a]&&(i[a]=new e({type:"nonoptional",innerType:t[a]}))}else for(const a in t)i[a]=new e({type:"nonoptional",innerType:t[a]});return B(this,"shape",i),i},checks:[]});return O(r,n)}function G(e,r=0){var o;if(e.aborted===!0)return!0;for(let n=r;n<e.issues.length;n++)if(((o=e.issues[n])==null?void 0:o.continue)!==!0)return!0;return!1}function Xr(e,r){return r.map(o=>{var n;return(n=o).path??(n.path=[]),o.path.unshift(e),o})}function ce(e){return typeof e=="string"?e:e==null?void 0:e.message}function M(e,r,o){var t,i,a,c,u,m;const n={...e,path:e.path??[]};if(!e.message){const f=ce((a=(i=(t=e.inst)==null?void 0:t._zod.def)==null?void 0:i.error)==null?void 0:a.call(i,e))??ce((c=r==null?void 0:r.error)==null?void 0:c.call(r,e))??ce((u=o.customError)==null?void 0:u.call(o,e))??ce((m=o.localeError)==null?void 0:m.call(o,e))??"Invalid input";n.message=f}return delete n.inst,delete n.continue,r!=null&&r.reportInput||delete n.input,n}function Ne(e){return Array.isArray(e)?"array":typeof e=="string"?"string":"unknown"}function ie(...e){const[r,o,n]=e;return typeof r=="string"?{message:r,code:"custom",input:o,inst:n}:{...r}}const Hr=(e,r)=>{e.name="$ZodError",Object.defineProperty(e,"_zod",{value:e._zod,enumerable:!1}),Object.defineProperty(e,"issues",{value:r,enumerable:!1}),e.message=JSON.stringify(r,Ze,2),Object.defineProperty(e,"toString",{value:()=>e.message,enumerable:!1})},Ae=l("$ZodError",Hr),ve=l("$ZodError",Hr,{Parent:Error});function So(e,r=o=>o.message){const o={},n=[];for(const t of e.issues)t.path.length>0?(o[t.path[0]]=o[t.path[0]]||[],o[t.path[0]].push(r(t))):n.push(r(t));return{formErrors:n,fieldErrors:o}}function Zo(e,r=o=>o.message){const o={_errors:[]},n=t=>{for(const i of t.issues)if(i.code==="invalid_union"&&i.errors.length)i.errors.map(a=>n({issues:a}));else if(i.code==="invalid_key")n({issues:i.issues});else if(i.code==="invalid_element")n({issues:i.issues});else if(i.path.length===0)o._errors.push(r(i));else{let a=o,c=0;for(;c<i.path.length;){const u=i.path[c];c===i.path.length-1?(a[u]=a[u]||{_errors:[]},a[u]._errors.push(r(i))):a[u]=a[u]||{_errors:[]},a=a[u],c++}}};return n(e),o}const be=e=>(r,o,n,t)=>{const i=n?Object.assign(n,{async:!1}):{async:!1},a=r._zod.run({value:o,issues:[]},i);if(a instanceof Promise)throw new K;if(a.issues.length){const c=new((t==null?void 0:t.Err)??e)(a.issues.map(u=>M(u,i,U())));throw Yr(c,t==null?void 0:t.callee),c}return a.value},$o=be(ve),_e=e=>async(r,o,n,t)=>{const i=n?Object.assign(n,{async:!0}):{async:!0};let a=r._zod.run({value:o,issues:[]},i);if(a instanceof Promise&&(a=await a),a.issues.length){const c=new((t==null?void 0:t.Err)??e)(a.issues.map(u=>M(u,i,U())));throw Yr(c,t==null?void 0:t.callee),c}return a.value},Io=_e(ve),Fe=e=>(r,o,n)=>{const t=n?{...n,async:!1}:{async:!1},i=r._zod.run({value:o,issues:[]},t);if(i instanceof Promise)throw new K;return i.issues.length?{success:!1,error:new(e??Ae)(i.issues.map(a=>M(a,t,U())))}:{success:!0,data:i.value}},Co=Fe(ve),we=e=>async(r,o,n)=>{const t=n?Object.assign(n,{async:!0}):{async:!0};let i=r._zod.run({value:o,issues:[]},t);return i instanceof Promise&&(i=await i),i.issues.length?{success:!1,error:new e(i.issues.map(a=>M(a,t,U())))}:{success:!0,data:i.value}},Po=we(ve),Eo=e=>(r,o,n)=>{const t=n?Object.assign(n,{direction:"backward"}):{direction:"backward"};return be(e)(r,o,t)},No=e=>(r,o,n)=>be(e)(r,o,n),Ao=e=>async(r,o,n)=>{const t=n?Object.assign(n,{direction:"backward"}):{direction:"backward"};return _e(e)(r,o,t)},Do=e=>async(r,o,n)=>_e(e)(r,o,n),To=e=>(r,o,n)=>{const t=n?Object.assign(n,{direction:"backward"}):{direction:"backward"};return Fe(e)(r,o,t)},Oo=e=>(r,o,n)=>Fe(e)(r,o,n),Ro=e=>async(r,o,n)=>{const t=n?Object.assign(n,{direction:"backward"}):{direction:"backward"};return we(e)(r,o,t)},Lo=e=>async(r,o,n)=>we(e)(r,o,n),Uo=/^[cC][^\s-]{8,}$/,Mo=/^[0-9a-z]+$/,Vo=/^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/,Bo=/^[0-9a-vA-V]{20}$/,Wo=/^[A-Za-z0-9]{27}$/,Jo=/^[a-zA-Z0-9_-]{21}$/,Go=/^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/,Ko=/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,Ve=e=>e?new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`):/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,Yo=/^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,qo="^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";function Xo(){return new RegExp(qo,"u")}const Ho=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,Qo=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/,en=/^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/,rn=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,on=/^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/,Qr=/^[A-Za-z0-9_-]*$/,nn=/^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/,tn=/^\+(?:[0-9]){6,14}[0-9]$/,eo="(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))",sn=new RegExp(`^${eo}$`);function ro(e){const r="(?:[01]\\d|2[0-3]):[0-5]\\d";return typeof e.precision=="number"?e.precision===-1?`${r}`:e.precision===0?`${r}:[0-5]\\d`:`${r}:[0-5]\\d\\.\\d{${e.precision}}`:`${r}(?::[0-5]\\d(?:\\.\\d+)?)?`}function an(e){return new RegExp(`^${ro(e)}$`)}function cn(e){const r=ro({precision:e.precision}),o=["Z"];e.local&&o.push(""),e.offset&&o.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");const n=`${r}(?:${o.join("|")})`;return new RegExp(`^${eo}T(?:${n})$`)}const ln=e=>{const r=e?`[\\s\\S]{${(e==null?void 0:e.minimum)??0},${(e==null?void 0:e.maximum)??""}}`:"[\\s\\S]*";return new RegExp(`^${r}$`)},un=/^(?:true|false)$/i,mn=/^[^A-Z]*$/,dn=/^[^a-z]*$/,N=l("$ZodCheck",(e,r)=>{var o;e._zod??(e._zod={}),e._zod.def=r,(o=e._zod).onattach??(o.onattach=[])}),fn=l("$ZodCheckMaxLength",(e,r)=>{var o;N.init(e,r),(o=e._zod.def).when??(o.when=n=>{const t=n.value;return!Pe(t)&&t.length!==void 0}),e._zod.onattach.push(n=>{const t=n._zod.bag.maximum??Number.POSITIVE_INFINITY;r.maximum<t&&(n._zod.bag.maximum=r.maximum)}),e._zod.check=n=>{const t=n.value;if(t.length<=r.maximum)return;const a=Ne(t);n.issues.push({origin:a,code:"too_big",maximum:r.maximum,inclusive:!0,input:t,inst:e,continue:!r.abort})}}),hn=l("$ZodCheckMinLength",(e,r)=>{var o;N.init(e,r),(o=e._zod.def).when??(o.when=n=>{const t=n.value;return!Pe(t)&&t.length!==void 0}),e._zod.onattach.push(n=>{const t=n._zod.bag.minimum??Number.NEGATIVE_INFINITY;r.minimum>t&&(n._zod.bag.minimum=r.minimum)}),e._zod.check=n=>{const t=n.value;if(t.length>=r.minimum)return;const a=Ne(t);n.issues.push({origin:a,code:"too_small",minimum:r.minimum,inclusive:!0,input:t,inst:e,continue:!r.abort})}}),pn=l("$ZodCheckLengthEquals",(e,r)=>{var o;N.init(e,r),(o=e._zod.def).when??(o.when=n=>{const t=n.value;return!Pe(t)&&t.length!==void 0}),e._zod.onattach.push(n=>{const t=n._zod.bag;t.minimum=r.length,t.maximum=r.length,t.length=r.length}),e._zod.check=n=>{const t=n.value,i=t.length;if(i===r.length)return;const a=Ne(t),c=i>r.length;n.issues.push({origin:a,...c?{code:"too_big",maximum:r.length}:{code:"too_small",minimum:r.length},inclusive:!0,exact:!0,input:n.value,inst:e,continue:!r.abort})}}),ye=l("$ZodCheckStringFormat",(e,r)=>{var o,n;N.init(e,r),e._zod.onattach.push(t=>{const i=t._zod.bag;i.format=r.format,r.pattern&&(i.patterns??(i.patterns=new Set),i.patterns.add(r.pattern))}),r.pattern?(o=e._zod).check??(o.check=t=>{r.pattern.lastIndex=0,!r.pattern.test(t.value)&&t.issues.push({origin:"string",code:"invalid_format",format:r.format,input:t.value,...r.pattern?{pattern:r.pattern.toString()}:{},inst:e,continue:!r.abort})}):(n=e._zod).check??(n.check=()=>{})}),gn=l("$ZodCheckRegex",(e,r)=>{ye.init(e,r),e._zod.check=o=>{r.pattern.lastIndex=0,!r.pattern.test(o.value)&&o.issues.push({origin:"string",code:"invalid_format",format:"regex",input:o.value,pattern:r.pattern.toString(),inst:e,continue:!r.abort})}}),vn=l("$ZodCheckLowerCase",(e,r)=>{r.pattern??(r.pattern=mn),ye.init(e,r)}),bn=l("$ZodCheckUpperCase",(e,r)=>{r.pattern??(r.pattern=dn),ye.init(e,r)}),_n=l("$ZodCheckIncludes",(e,r)=>{N.init(e,r);const o=Y(r.includes),n=new RegExp(typeof r.position=="number"?`^.{${r.position}}${o}`:o);r.pattern=n,e._zod.onattach.push(t=>{const i=t._zod.bag;i.patterns??(i.patterns=new Set),i.patterns.add(n)}),e._zod.check=t=>{t.value.includes(r.includes,r.position)||t.issues.push({origin:"string",code:"invalid_format",format:"includes",includes:r.includes,input:t.value,inst:e,continue:!r.abort})}}),Fn=l("$ZodCheckStartsWith",(e,r)=>{N.init(e,r);const o=new RegExp(`^${Y(r.prefix)}.*`);r.pattern??(r.pattern=o),e._zod.onattach.push(n=>{const t=n._zod.bag;t.patterns??(t.patterns=new Set),t.patterns.add(o)}),e._zod.check=n=>{n.value.startsWith(r.prefix)||n.issues.push({origin:"string",code:"invalid_format",format:"starts_with",prefix:r.prefix,input:n.value,inst:e,continue:!r.abort})}}),wn=l("$ZodCheckEndsWith",(e,r)=>{N.init(e,r);const o=new RegExp(`.*${Y(r.suffix)}$`);r.pattern??(r.pattern=o),e._zod.onattach.push(n=>{const t=n._zod.bag;t.patterns??(t.patterns=new Set),t.patterns.add(o)}),e._zod.check=n=>{n.value.endsWith(r.suffix)||n.issues.push({origin:"string",code:"invalid_format",format:"ends_with",suffix:r.suffix,input:n.value,inst:e,continue:!r.abort})}}),yn=l("$ZodCheckOverwrite",(e,r)=>{N.init(e,r),e._zod.check=o=>{o.value=r.tx(o.value)}});class jn{constructor(r=[]){this.content=[],this.indent=0,this&&(this.args=r)}indented(r){this.indent+=1,r(this),this.indent-=1}write(r){if(typeof r=="function"){r(this,{execution:"sync"}),r(this,{execution:"async"});return}const n=r.split(`
`).filter(a=>a),t=Math.min(...n.map(a=>a.length-a.trimStart().length)),i=n.map(a=>a.slice(t)).map(a=>" ".repeat(this.indent*2)+a);for(const a of i)this.content.push(a)}compile(){const r=Function,o=this==null?void 0:this.args,t=[...((this==null?void 0:this.content)??[""]).map(i=>`  ${i}`)];return new r(...o,t.join(`
`))}}const zn={major:4,minor:1,patch:12},x=l("$ZodType",(e,r)=>{var t;var o;e??(e={}),e._zod.def=r,e._zod.bag=e._zod.bag||{},e._zod.version=zn;const n=[...e._zod.def.checks??[]];e._zod.traits.has("$ZodCheck")&&n.unshift(e);for(const i of n)for(const a of i._zod.onattach)a(e);if(n.length===0)(o=e._zod).deferred??(o.deferred=[]),(t=e._zod.deferred)==null||t.push(()=>{e._zod.run=e._zod.parse});else{const i=(c,u,m)=>{let f=G(c),b;for(const j of u){if(j._zod.def.when){if(!j._zod.def.when(c))continue}else if(f)continue;const z=c.issues.length,$=j._zod.check(c);if($ instanceof Promise&&(m==null?void 0:m.async)===!1)throw new K;if(b||$ instanceof Promise)b=(b??Promise.resolve()).then(async()=>{await $,c.issues.length!==z&&(f||(f=G(c,z)))});else{if(c.issues.length===z)continue;f||(f=G(c,z))}}return b?b.then(()=>c):c},a=(c,u,m)=>{if(G(c))return c.aborted=!0,c;const f=i(u,n,m);if(f instanceof Promise){if(m.async===!1)throw new K;return f.then(b=>e._zod.parse(b,m))}return e._zod.parse(f,m)};e._zod.run=(c,u)=>{if(u.skipChecks)return e._zod.parse(c,u);if(u.direction==="backward"){const f=e._zod.parse({value:c.value,issues:[]},{...u,skipChecks:!0});return f instanceof Promise?f.then(b=>a(b,c,u)):a(f,c,u)}const m=e._zod.parse(c,u);if(m instanceof Promise){if(u.async===!1)throw new K;return m.then(f=>i(f,n,u))}return i(m,n,u)}}e["~standard"]={validate:i=>{var a;try{const c=Co(e,i);return c.success?{value:c.data}:{issues:(a=c.error)==null?void 0:a.issues}}catch{return Po(e,i).then(u=>{var m;return u.success?{value:u.data}:{issues:(m=u.error)==null?void 0:m.issues}})}},vendor:"zod",version:1}}),De=l("$ZodString",(e,r)=>{var o;x.init(e,r),e._zod.pattern=[...((o=e==null?void 0:e._zod.bag)==null?void 0:o.patterns)??[]].pop()??ln(e._zod.bag),e._zod.parse=(n,t)=>{if(r.coerce)try{n.value=String(n.value)}catch{}return typeof n.value=="string"||n.issues.push({expected:"string",code:"invalid_type",input:n.value,inst:e}),n}}),F=l("$ZodStringFormat",(e,r)=>{ye.init(e,r),De.init(e,r)}),xn=l("$ZodGUID",(e,r)=>{r.pattern??(r.pattern=Ko),F.init(e,r)}),kn=l("$ZodUUID",(e,r)=>{if(r.version){const n={v1:1,v2:2,v3:3,v4:4,v5:5,v6:6,v7:7,v8:8}[r.version];if(n===void 0)throw new Error(`Invalid UUID version: "${r.version}"`);r.pattern??(r.pattern=Ve(n))}else r.pattern??(r.pattern=Ve());F.init(e,r)}),Sn=l("$ZodEmail",(e,r)=>{r.pattern??(r.pattern=Yo),F.init(e,r)}),Zn=l("$ZodURL",(e,r)=>{F.init(e,r),e._zod.check=o=>{try{const n=o.value.trim(),t=new URL(n);r.hostname&&(r.hostname.lastIndex=0,r.hostname.test(t.hostname)||o.issues.push({code:"invalid_format",format:"url",note:"Invalid hostname",pattern:nn.source,input:o.value,inst:e,continue:!r.abort})),r.protocol&&(r.protocol.lastIndex=0,r.protocol.test(t.protocol.endsWith(":")?t.protocol.slice(0,-1):t.protocol)||o.issues.push({code:"invalid_format",format:"url",note:"Invalid protocol",pattern:r.protocol.source,input:o.value,inst:e,continue:!r.abort})),r.normalize?o.value=t.href:o.value=n;return}catch{o.issues.push({code:"invalid_format",format:"url",input:o.value,inst:e,continue:!r.abort})}}}),$n=l("$ZodEmoji",(e,r)=>{r.pattern??(r.pattern=Xo()),F.init(e,r)}),In=l("$ZodNanoID",(e,r)=>{r.pattern??(r.pattern=Jo),F.init(e,r)}),Cn=l("$ZodCUID",(e,r)=>{r.pattern??(r.pattern=Uo),F.init(e,r)}),Pn=l("$ZodCUID2",(e,r)=>{r.pattern??(r.pattern=Mo),F.init(e,r)}),En=l("$ZodULID",(e,r)=>{r.pattern??(r.pattern=Vo),F.init(e,r)}),Nn=l("$ZodXID",(e,r)=>{r.pattern??(r.pattern=Bo),F.init(e,r)}),An=l("$ZodKSUID",(e,r)=>{r.pattern??(r.pattern=Wo),F.init(e,r)}),Dn=l("$ZodISODateTime",(e,r)=>{r.pattern??(r.pattern=cn(r)),F.init(e,r)}),Tn=l("$ZodISODate",(e,r)=>{r.pattern??(r.pattern=sn),F.init(e,r)}),On=l("$ZodISOTime",(e,r)=>{r.pattern??(r.pattern=an(r)),F.init(e,r)}),Rn=l("$ZodISODuration",(e,r)=>{r.pattern??(r.pattern=Go),F.init(e,r)}),Ln=l("$ZodIPv4",(e,r)=>{r.pattern??(r.pattern=Ho),F.init(e,r),e._zod.onattach.push(o=>{const n=o._zod.bag;n.format="ipv4"})}),Un=l("$ZodIPv6",(e,r)=>{r.pattern??(r.pattern=Qo),F.init(e,r),e._zod.onattach.push(o=>{const n=o._zod.bag;n.format="ipv6"}),e._zod.check=o=>{try{new URL(`http://[${o.value}]`)}catch{o.issues.push({code:"invalid_format",format:"ipv6",input:o.value,inst:e,continue:!r.abort})}}}),Mn=l("$ZodCIDRv4",(e,r)=>{r.pattern??(r.pattern=en),F.init(e,r)}),Vn=l("$ZodCIDRv6",(e,r)=>{r.pattern??(r.pattern=rn),F.init(e,r),e._zod.check=o=>{const n=o.value.split("/");try{if(n.length!==2)throw new Error;const[t,i]=n;if(!i)throw new Error;const a=Number(i);if(`${a}`!==i)throw new Error;if(a<0||a>128)throw new Error;new URL(`http://[${t}]`)}catch{o.issues.push({code:"invalid_format",format:"cidrv6",input:o.value,inst:e,continue:!r.abort})}}});function oo(e){if(e==="")return!0;if(e.length%4!==0)return!1;try{return atob(e),!0}catch{return!1}}const Bn=l("$ZodBase64",(e,r)=>{r.pattern??(r.pattern=on),F.init(e,r),e._zod.onattach.push(o=>{o._zod.bag.contentEncoding="base64"}),e._zod.check=o=>{oo(o.value)||o.issues.push({code:"invalid_format",format:"base64",input:o.value,inst:e,continue:!r.abort})}});function Wn(e){if(!Qr.test(e))return!1;const r=e.replace(/[-_]/g,n=>n==="-"?"+":"/"),o=r.padEnd(Math.ceil(r.length/4)*4,"=");return oo(o)}const Jn=l("$ZodBase64URL",(e,r)=>{r.pattern??(r.pattern=Qr),F.init(e,r),e._zod.onattach.push(o=>{o._zod.bag.contentEncoding="base64url"}),e._zod.check=o=>{Wn(o.value)||o.issues.push({code:"invalid_format",format:"base64url",input:o.value,inst:e,continue:!r.abort})}}),Gn=l("$ZodE164",(e,r)=>{r.pattern??(r.pattern=tn),F.init(e,r)});function Kn(e,r=null){try{const o=e.split(".");if(o.length!==3)return!1;const[n]=o;if(!n)return!1;const t=JSON.parse(atob(n));return!("typ"in t&&(t==null?void 0:t.typ)!=="JWT"||!t.alg||r&&(!("alg"in t)||t.alg!==r))}catch{return!1}}const Yn=l("$ZodJWT",(e,r)=>{F.init(e,r),e._zod.check=o=>{Kn(o.value,r.alg)||o.issues.push({code:"invalid_format",format:"jwt",input:o.value,inst:e,continue:!r.abort})}}),qn=l("$ZodBoolean",(e,r)=>{x.init(e,r),e._zod.pattern=un,e._zod.parse=(o,n)=>{if(r.coerce)try{o.value=!!o.value}catch{}const t=o.value;return typeof t=="boolean"||o.issues.push({expected:"boolean",code:"invalid_type",input:t,inst:e}),o}}),Xn=l("$ZodUnknown",(e,r)=>{x.init(e,r),e._zod.parse=o=>o}),Hn=l("$ZodNever",(e,r)=>{x.init(e,r),e._zod.parse=(o,n)=>(o.issues.push({expected:"never",code:"invalid_type",input:o.value,inst:e}),o)});function Be(e,r,o){e.issues.length&&r.issues.push(...Xr(o,e.issues)),r.value[o]=e.value}const Qn=l("$ZodArray",(e,r)=>{x.init(e,r),e._zod.parse=(o,n)=>{const t=o.value;if(!Array.isArray(t))return o.issues.push({expected:"array",code:"invalid_type",input:t,inst:e}),o;o.value=Array(t.length);const i=[];for(let a=0;a<t.length;a++){const c=t[a],u=r.element._zod.run({value:c,issues:[]},n);u instanceof Promise?i.push(u.then(m=>Be(m,o,a))):Be(u,o,a)}return i.length?Promise.all(i).then(()=>o):o}});function he(e,r,o,n){e.issues.length&&r.issues.push(...Xr(o,e.issues)),e.value===void 0?o in n&&(r.value[o]=void 0):r.value[o]=e.value}function no(e){var n,t,i,a;const r=Object.keys(e.shape);for(const c of r)if(!((a=(i=(t=(n=e.shape)==null?void 0:n[c])==null?void 0:t._zod)==null?void 0:i.traits)!=null&&a.has("$ZodType")))throw new Error(`Invalid element at key "${c}": expected a Zod schema`);const o=_o(e.shape);return{...e,keys:r,keySet:new Set(r),numKeys:r.length,optionalKeys:new Set(o)}}function to(e,r,o,n,t,i){const a=[],c=t.keySet,u=t.catchall._zod,m=u.def.type;for(const f of Object.keys(r)){if(c.has(f))continue;if(m==="never"){a.push(f);continue}const b=u.run({value:r[f],issues:[]},n);b instanceof Promise?e.push(b.then(j=>he(j,o,f,r))):he(b,o,f,r)}return a.length&&o.issues.push({code:"unrecognized_keys",keys:a,input:r,inst:i}),e.length?Promise.all(e).then(()=>o):o}const et=l("$ZodObject",(e,r)=>{x.init(e,r);const o=Object.getOwnPropertyDescriptor(r,"shape");if(!(o!=null&&o.get)){const c=r.shape;Object.defineProperty(r,"shape",{get:()=>{const u={...c};return Object.defineProperty(r,"shape",{value:u}),u}})}const n=Ce(()=>no(r));v(e._zod,"propValues",()=>{const c=r.shape,u={};for(const m in c){const f=c[m]._zod;if(f.values){u[m]??(u[m]=new Set);for(const b of f.values)u[m].add(b)}}return u});const t=fe,i=r.catchall;let a;e._zod.parse=(c,u)=>{a??(a=n.value);const m=c.value;if(!t(m))return c.issues.push({expected:"object",code:"invalid_type",input:m,inst:e}),c;c.value={};const f=[],b=a.shape;for(const j of a.keys){const $=b[j]._zod.run({value:m[j],issues:[]},u);$ instanceof Promise?f.push($.then(J=>he(J,c,j,m))):he($,c,j,m)}return i?to(f,m,c,u,n.value,e):f.length?Promise.all(f).then(()=>c):c}}),rt=l("$ZodObjectJIT",(e,r)=>{et.init(e,r);const o=e._zod.parse,n=Ce(()=>no(r)),t=j=>{const z=new jn(["shape","payload","ctx"]),$=n.value,J=A=>{const P=Me(A);return`shape[${P}]._zod.run({ value: input[${P}], issues: [] }, ctx)`};z.write("const input = payload.value;");const Te=Object.create(null);let mo=0;for(const A of $.keys)Te[A]=`key_${mo++}`;z.write("const newResult = {};");for(const A of $.keys){const P=Te[A],q=Me(A);z.write(`const ${P} = ${J(A)};`),z.write(`
        if (${P}.issues.length) {
          payload.issues = payload.issues.concat(${P}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${q}, ...iss.path] : [${q}]
          })));
        }
        
        
        if (${P}.value === undefined) {
          if (${q} in input) {
            newResult[${q}] = undefined;
          }
        } else {
          newResult[${q}] = ${P}.value;
        }
        
      `)}z.write("payload.value = newResult;"),z.write("return payload;");const fo=z.compile();return(A,P)=>fo(j,A,P)};let i;const a=fe,c=!Kr.jitless,m=c&&vo.value,f=r.catchall;let b;e._zod.parse=(j,z)=>{b??(b=n.value);const $=j.value;return a($)?c&&m&&(z==null?void 0:z.async)===!1&&z.jitless!==!0?(i||(i=t(r.shape)),j=i(j,z),f?to([],$,j,z,b,e):j):o(j,z):(j.issues.push({expected:"object",code:"invalid_type",input:$,inst:e}),j)}});function We(e,r,o,n){for(const i of e)if(i.issues.length===0)return r.value=i.value,r;const t=e.filter(i=>!G(i));return t.length===1?(r.value=t[0].value,t[0]):(r.issues.push({code:"invalid_union",input:r.value,inst:o,errors:e.map(i=>i.issues.map(a=>M(a,n,U())))}),r)}const ot=l("$ZodUnion",(e,r)=>{x.init(e,r),v(e._zod,"optin",()=>r.options.some(t=>t._zod.optin==="optional")?"optional":void 0),v(e._zod,"optout",()=>r.options.some(t=>t._zod.optout==="optional")?"optional":void 0),v(e._zod,"values",()=>{if(r.options.every(t=>t._zod.values))return new Set(r.options.flatMap(t=>Array.from(t._zod.values)))}),v(e._zod,"pattern",()=>{if(r.options.every(t=>t._zod.pattern)){const t=r.options.map(i=>i._zod.pattern);return new RegExp(`^(${t.map(i=>Ee(i.source)).join("|")})$`)}});const o=r.options.length===1,n=r.options[0]._zod.run;e._zod.parse=(t,i)=>{if(o)return n(t,i);let a=!1;const c=[];for(const u of r.options){const m=u._zod.run({value:t.value,issues:[]},i);if(m instanceof Promise)c.push(m),a=!0;else{if(m.issues.length===0)return m;c.push(m)}}return a?Promise.all(c).then(u=>We(u,t,e,i)):We(c,t,e,i)}}),nt=l("$ZodIntersection",(e,r)=>{x.init(e,r),e._zod.parse=(o,n)=>{const t=o.value,i=r.left._zod.run({value:t,issues:[]},n),a=r.right._zod.run({value:t,issues:[]},n);return i instanceof Promise||a instanceof Promise?Promise.all([i,a]).then(([u,m])=>Je(o,u,m)):Je(o,i,a)}});function $e(e,r){if(e===r)return{valid:!0,data:e};if(e instanceof Date&&r instanceof Date&&+e==+r)return{valid:!0,data:e};if(se(e)&&se(r)){const o=Object.keys(r),n=Object.keys(e).filter(i=>o.indexOf(i)!==-1),t={...e,...r};for(const i of n){const a=$e(e[i],r[i]);if(!a.valid)return{valid:!1,mergeErrorPath:[i,...a.mergeErrorPath]};t[i]=a.data}return{valid:!0,data:t}}if(Array.isArray(e)&&Array.isArray(r)){if(e.length!==r.length)return{valid:!1,mergeErrorPath:[]};const o=[];for(let n=0;n<e.length;n++){const t=e[n],i=r[n],a=$e(t,i);if(!a.valid)return{valid:!1,mergeErrorPath:[n,...a.mergeErrorPath]};o.push(a.data)}return{valid:!0,data:o}}return{valid:!1,mergeErrorPath:[]}}function Je(e,r,o){if(r.issues.length&&e.issues.push(...r.issues),o.issues.length&&e.issues.push(...o.issues),G(e))return e;const n=$e(r.value,o.value);if(!n.valid)throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(n.mergeErrorPath)}`);return e.value=n.data,e}const tt=l("$ZodEnum",(e,r)=>{x.init(e,r);const o=go(r.entries),n=new Set(o);e._zod.values=n,e._zod.pattern=new RegExp(`^(${o.filter(t=>bo.has(typeof t)).map(t=>typeof t=="string"?Y(t):t.toString()).join("|")})$`),e._zod.parse=(t,i)=>{const a=t.value;return n.has(a)||t.issues.push({code:"invalid_value",values:o,input:a,inst:e}),t}}),st=l("$ZodLiteral",(e,r)=>{if(x.init(e,r),r.values.length===0)throw new Error("Cannot create literal schema with no valid values");e._zod.values=new Set(r.values),e._zod.pattern=new RegExp(`^(${r.values.map(o=>typeof o=="string"?Y(o):o?Y(o.toString()):String(o)).join("|")})$`),e._zod.parse=(o,n)=>{const t=o.value;return e._zod.values.has(t)||o.issues.push({code:"invalid_value",values:r.values,input:t,inst:e}),o}}),it=l("$ZodTransform",(e,r)=>{x.init(e,r),e._zod.parse=(o,n)=>{if(n.direction==="backward")throw new Gr(e.constructor.name);const t=r.transform(o.value,o);if(n.async)return(t instanceof Promise?t:Promise.resolve(t)).then(a=>(o.value=a,o));if(t instanceof Promise)throw new K;return o.value=t,o}});function Ge(e,r){return e.issues.length&&r===void 0?{issues:[],value:void 0}:e}const at=l("$ZodOptional",(e,r)=>{x.init(e,r),e._zod.optin="optional",e._zod.optout="optional",v(e._zod,"values",()=>r.innerType._zod.values?new Set([...r.innerType._zod.values,void 0]):void 0),v(e._zod,"pattern",()=>{const o=r.innerType._zod.pattern;return o?new RegExp(`^(${Ee(o.source)})?$`):void 0}),e._zod.parse=(o,n)=>{if(r.innerType._zod.optin==="optional"){const t=r.innerType._zod.run(o,n);return t instanceof Promise?t.then(i=>Ge(i,o.value)):Ge(t,o.value)}return o.value===void 0?o:r.innerType._zod.run(o,n)}}),ct=l("$ZodNullable",(e,r)=>{x.init(e,r),v(e._zod,"optin",()=>r.innerType._zod.optin),v(e._zod,"optout",()=>r.innerType._zod.optout),v(e._zod,"pattern",()=>{const o=r.innerType._zod.pattern;return o?new RegExp(`^(${Ee(o.source)}|null)$`):void 0}),v(e._zod,"values",()=>r.innerType._zod.values?new Set([...r.innerType._zod.values,null]):void 0),e._zod.parse=(o,n)=>o.value===null?o:r.innerType._zod.run(o,n)}),lt=l("$ZodDefault",(e,r)=>{x.init(e,r),e._zod.optin="optional",v(e._zod,"values",()=>r.innerType._zod.values),e._zod.parse=(o,n)=>{if(n.direction==="backward")return r.innerType._zod.run(o,n);if(o.value===void 0)return o.value=r.defaultValue,o;const t=r.innerType._zod.run(o,n);return t instanceof Promise?t.then(i=>Ke(i,r)):Ke(t,r)}});function Ke(e,r){return e.value===void 0&&(e.value=r.defaultValue),e}const ut=l("$ZodPrefault",(e,r)=>{x.init(e,r),e._zod.optin="optional",v(e._zod,"values",()=>r.innerType._zod.values),e._zod.parse=(o,n)=>(n.direction==="backward"||o.value===void 0&&(o.value=r.defaultValue),r.innerType._zod.run(o,n))}),mt=l("$ZodNonOptional",(e,r)=>{x.init(e,r),v(e._zod,"values",()=>{const o=r.innerType._zod.values;return o?new Set([...o].filter(n=>n!==void 0)):void 0}),e._zod.parse=(o,n)=>{const t=r.innerType._zod.run(o,n);return t instanceof Promise?t.then(i=>Ye(i,e)):Ye(t,e)}});function Ye(e,r){return!e.issues.length&&e.value===void 0&&e.issues.push({code:"invalid_type",expected:"nonoptional",input:e.value,inst:r}),e}const dt=l("$ZodCatch",(e,r)=>{x.init(e,r),v(e._zod,"optin",()=>r.innerType._zod.optin),v(e._zod,"optout",()=>r.innerType._zod.optout),v(e._zod,"values",()=>r.innerType._zod.values),e._zod.parse=(o,n)=>{if(n.direction==="backward")return r.innerType._zod.run(o,n);const t=r.innerType._zod.run(o,n);return t instanceof Promise?t.then(i=>(o.value=i.value,i.issues.length&&(o.value=r.catchValue({...o,error:{issues:i.issues.map(a=>M(a,n,U()))},input:o.value}),o.issues=[]),o)):(o.value=t.value,t.issues.length&&(o.value=r.catchValue({...o,error:{issues:t.issues.map(i=>M(i,n,U()))},input:o.value}),o.issues=[]),o)}}),ft=l("$ZodPipe",(e,r)=>{x.init(e,r),v(e._zod,"values",()=>r.in._zod.values),v(e._zod,"optin",()=>r.in._zod.optin),v(e._zod,"optout",()=>r.out._zod.optout),v(e._zod,"propValues",()=>r.in._zod.propValues),e._zod.parse=(o,n)=>{if(n.direction==="backward"){const i=r.out._zod.run(o,n);return i instanceof Promise?i.then(a=>le(a,r.in,n)):le(i,r.in,n)}const t=r.in._zod.run(o,n);return t instanceof Promise?t.then(i=>le(i,r.out,n)):le(t,r.out,n)}});function le(e,r,o){return e.issues.length?(e.aborted=!0,e):r._zod.run({value:e.value,issues:e.issues},o)}const ht=l("$ZodReadonly",(e,r)=>{x.init(e,r),v(e._zod,"propValues",()=>r.innerType._zod.propValues),v(e._zod,"values",()=>r.innerType._zod.values),v(e._zod,"optin",()=>r.innerType._zod.optin),v(e._zod,"optout",()=>r.innerType._zod.optout),e._zod.parse=(o,n)=>{if(n.direction==="backward")return r.innerType._zod.run(o,n);const t=r.innerType._zod.run(o,n);return t instanceof Promise?t.then(qe):qe(t)}});function qe(e){return e.value=Object.freeze(e.value),e}const pt=l("$ZodCustom",(e,r)=>{N.init(e,r),x.init(e,r),e._zod.parse=(o,n)=>o,e._zod.check=o=>{const n=o.value,t=r.fn(n);if(t instanceof Promise)return t.then(i=>Xe(i,o,n,e));Xe(t,o,n,e)}});function Xe(e,r,o,n){if(!e){const t={code:"custom",input:o,inst:n,path:[...n._zod.def.path??[]],continue:!n._zod.def.abort};n._zod.def.params&&(t.params=n._zod.def.params),r.issues.push(ie(t))}}class gt{constructor(){this._map=new WeakMap,this._idmap=new Map}add(r,...o){const n=o[0];if(this._map.set(r,n),n&&typeof n=="object"&&"id"in n){if(this._idmap.has(n.id))throw new Error(`ID ${n.id} already exists in the registry`);this._idmap.set(n.id,r)}return this}clear(){return this._map=new WeakMap,this._idmap=new Map,this}remove(r){const o=this._map.get(r);return o&&typeof o=="object"&&"id"in o&&this._idmap.delete(o.id),this._map.delete(r),this}get(r){const o=r._zod.parent;if(o){const n={...this.get(o)??{}};delete n.id;const t={...n,...this._map.get(r)};return Object.keys(t).length?t:void 0}return this._map.get(r)}has(r){return this._map.has(r)}}function vt(){return new gt}const ue=vt();function bt(e,r){return new e({type:"string",...d(r)})}function _t(e,r){return new e({type:"string",format:"email",check:"string_format",abort:!1,...d(r)})}function He(e,r){return new e({type:"string",format:"guid",check:"string_format",abort:!1,...d(r)})}function Ft(e,r){return new e({type:"string",format:"uuid",check:"string_format",abort:!1,...d(r)})}function wt(e,r){return new e({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v4",...d(r)})}function yt(e,r){return new e({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v6",...d(r)})}function jt(e,r){return new e({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v7",...d(r)})}function zt(e,r){return new e({type:"string",format:"url",check:"string_format",abort:!1,...d(r)})}function xt(e,r){return new e({type:"string",format:"emoji",check:"string_format",abort:!1,...d(r)})}function kt(e,r){return new e({type:"string",format:"nanoid",check:"string_format",abort:!1,...d(r)})}function St(e,r){return new e({type:"string",format:"cuid",check:"string_format",abort:!1,...d(r)})}function Zt(e,r){return new e({type:"string",format:"cuid2",check:"string_format",abort:!1,...d(r)})}function $t(e,r){return new e({type:"string",format:"ulid",check:"string_format",abort:!1,...d(r)})}function It(e,r){return new e({type:"string",format:"xid",check:"string_format",abort:!1,...d(r)})}function Ct(e,r){return new e({type:"string",format:"ksuid",check:"string_format",abort:!1,...d(r)})}function Pt(e,r){return new e({type:"string",format:"ipv4",check:"string_format",abort:!1,...d(r)})}function Et(e,r){return new e({type:"string",format:"ipv6",check:"string_format",abort:!1,...d(r)})}function Nt(e,r){return new e({type:"string",format:"cidrv4",check:"string_format",abort:!1,...d(r)})}function At(e,r){return new e({type:"string",format:"cidrv6",check:"string_format",abort:!1,...d(r)})}function Dt(e,r){return new e({type:"string",format:"base64",check:"string_format",abort:!1,...d(r)})}function Tt(e,r){return new e({type:"string",format:"base64url",check:"string_format",abort:!1,...d(r)})}function Ot(e,r){return new e({type:"string",format:"e164",check:"string_format",abort:!1,...d(r)})}function Rt(e,r){return new e({type:"string",format:"jwt",check:"string_format",abort:!1,...d(r)})}function Lt(e,r){return new e({type:"string",format:"datetime",check:"string_format",offset:!1,local:!1,precision:null,...d(r)})}function Ut(e,r){return new e({type:"string",format:"date",check:"string_format",...d(r)})}function Mt(e,r){return new e({type:"string",format:"time",check:"string_format",precision:null,...d(r)})}function Vt(e,r){return new e({type:"string",format:"duration",check:"string_format",...d(r)})}function Bt(e,r){return new e({type:"boolean",...d(r)})}function Wt(e){return new e({type:"unknown"})}function Jt(e,r){return new e({type:"never",...d(r)})}function so(e,r){return new fn({check:"max_length",...d(r),maximum:e})}function pe(e,r){return new hn({check:"min_length",...d(r),minimum:e})}function io(e,r){return new pn({check:"length_equals",...d(r),length:e})}function Gt(e,r){return new gn({check:"string_format",format:"regex",...d(r),pattern:e})}function Kt(e){return new vn({check:"string_format",format:"lowercase",...d(e)})}function Yt(e){return new bn({check:"string_format",format:"uppercase",...d(e)})}function qt(e,r){return new _n({check:"string_format",format:"includes",...d(r),includes:e})}function Xt(e,r){return new Fn({check:"string_format",format:"starts_with",...d(r),prefix:e})}function Ht(e,r){return new wn({check:"string_format",format:"ends_with",...d(r),suffix:e})}function ae(e){return new yn({check:"overwrite",tx:e})}function Qt(e){return ae(r=>r.normalize(e))}function es(){return ae(e=>e.trim())}function rs(){return ae(e=>e.toLowerCase())}function os(){return ae(e=>e.toUpperCase())}function ns(e,r,o){return new e({type:"array",element:r,...d(o)})}function ts(e,r,o){return new e({type:"custom",check:"custom",fn:r,...d(o)})}function ss(e){const r=is(o=>(o.addIssue=n=>{if(typeof n=="string")o.issues.push(ie(n,o.value,r._zod.def));else{const t=n;t.fatal&&(t.continue=!1),t.code??(t.code="custom"),t.input??(t.input=o.value),t.inst??(t.inst=r),t.continue??(t.continue=!r._zod.def.abort),o.issues.push(ie(t))}},e(o.value,o)));return r}function is(e,r){const o=new N({check:"custom",...d(r)});return o._zod.check=e,o}function Qe(e,r){try{var o=e()}catch(n){return r(n)}return o&&o.then?o.then(void 0,r):o}function as(e,r){for(var o={};e.length;){var n=e[0],t=n.code,i=n.message,a=n.path.join(".");if(!o[a])if("unionErrors"in n){var c=n.unionErrors[0].errors[0];o[a]={message:c.message,type:c.code}}else o[a]={message:i,type:t};if("unionErrors"in n&&n.unionErrors.forEach(function(f){return f.errors.forEach(function(b){return e.push(b)})}),r){var u=o[a].types,m=u&&u[n.code];o[a]=Wr(a,r,o,t,m?[].concat(m,n.message):n.message)}e.shift()}return o}function cs(e,r){for(var o={};e.length;){var n=e[0],t=n.code,i=n.message,a=n.path.join(".");if(!o[a])if(n.code==="invalid_union"&&n.errors.length>0){var c=n.errors[0][0];o[a]={message:c.message,type:c.code}}else o[a]={message:i,type:t};if(n.code==="invalid_union"&&n.errors.forEach(function(f){return f.forEach(function(b){return e.push(b)})}),r){var u=o[a].types,m=u&&u[n.code];o[a]=Wr(a,r,o,t,m?[].concat(m,n.message):n.message)}e.shift()}return o}function R(e,r,o){if(o===void 0&&(o={}),function(n){return"_def"in n&&typeof n._def=="object"&&"typeName"in n._def}(e))return function(n,t,i){try{return Promise.resolve(Qe(function(){return Promise.resolve(e[o.mode==="sync"?"parse":"parseAsync"](n,r)).then(function(a){return i.shouldUseNativeValidation&&Se({},i),{errors:{},values:o.raw?Object.assign({},n):a}})},function(a){if(function(c){return Array.isArray(c==null?void 0:c.issues)}(a))return{values:{},errors:Re(as(a.errors,!i.shouldUseNativeValidation&&i.criteriaMode==="all"),i)};throw a}))}catch(a){return Promise.reject(a)}};if(function(n){return"_zod"in n&&typeof n._zod=="object"}(e))return function(n,t,i){try{return Promise.resolve(Qe(function(){return Promise.resolve((o.mode==="sync"?$o:Io)(e,n,r)).then(function(a){return i.shouldUseNativeValidation&&Se({},i),{errors:{},values:o.raw?Object.assign({},n):a}})},function(a){if(function(c){return c instanceof Ae}(a))return{values:{},errors:Re(cs(a.issues,!i.shouldUseNativeValidation&&i.criteriaMode==="all"),i)};throw a}))}catch(a){return Promise.reject(a)}};throw new Error("Invalid input: not a Zod schema")}const ls=l("ZodISODateTime",(e,r)=>{Dn.init(e,r),w.init(e,r)});function us(e){return Lt(ls,e)}const ms=l("ZodISODate",(e,r)=>{Tn.init(e,r),w.init(e,r)});function ds(e){return Ut(ms,e)}const fs=l("ZodISOTime",(e,r)=>{On.init(e,r),w.init(e,r)});function hs(e){return Mt(fs,e)}const ps=l("ZodISODuration",(e,r)=>{Rn.init(e,r),w.init(e,r)});function gs(e){return Vt(ps,e)}const vs=(e,r)=>{Ae.init(e,r),e.name="ZodError",Object.defineProperties(e,{format:{value:o=>Zo(e,o)},flatten:{value:o=>So(e,o)},addIssue:{value:o=>{e.issues.push(o),e.message=JSON.stringify(e.issues,Ze,2)}},addIssues:{value:o=>{e.issues.push(...o),e.message=JSON.stringify(e.issues,Ze,2)}},isEmpty:{get(){return e.issues.length===0}}})},C=l("ZodError",vs,{Parent:Error}),bs=be(C),_s=_e(C),Fs=Fe(C),ws=we(C),ys=Eo(C),js=No(C),zs=Ao(C),xs=Do(C),ks=To(C),Ss=Oo(C),Zs=Ro(C),$s=Lo(C),S=l("ZodType",(e,r)=>(x.init(e,r),e.def=r,e.type=r.type,Object.defineProperty(e,"_def",{value:r}),e.check=(...o)=>e.clone(W(r,{checks:[...r.checks??[],...o.map(n=>typeof n=="function"?{_zod:{check:n,def:{check:"custom"},onattach:[]}}:n)]})),e.clone=(o,n)=>O(e,o,n),e.brand=()=>e,e.register=(o,n)=>(o.add(e,n),e),e.parse=(o,n)=>bs(e,o,n,{callee:e.parse}),e.safeParse=(o,n)=>Fs(e,o,n),e.parseAsync=async(o,n)=>_s(e,o,n,{callee:e.parseAsync}),e.safeParseAsync=async(o,n)=>ws(e,o,n),e.spa=e.safeParseAsync,e.encode=(o,n)=>ys(e,o,n),e.decode=(o,n)=>js(e,o,n),e.encodeAsync=async(o,n)=>zs(e,o,n),e.decodeAsync=async(o,n)=>xs(e,o,n),e.safeEncode=(o,n)=>ks(e,o,n),e.safeDecode=(o,n)=>Ss(e,o,n),e.safeEncodeAsync=async(o,n)=>Zs(e,o,n),e.safeDecodeAsync=async(o,n)=>$s(e,o,n),e.refine=(o,n)=>e.check(wi(o,n)),e.superRefine=o=>e.check(yi(o)),e.overwrite=o=>e.check(ae(o)),e.optional=()=>or(e),e.nullable=()=>nr(e),e.nullish=()=>or(nr(e)),e.nonoptional=o=>hi(e,o),e.array=()=>Qs(e),e.or=o=>oi([e,o]),e.and=o=>ti(e,o),e.transform=o=>tr(e,ci(o)),e.default=o=>mi(e,o),e.prefault=o=>fi(e,o),e.catch=o=>gi(e,o),e.pipe=o=>tr(e,o),e.readonly=()=>_i(e),e.describe=o=>{const n=e.clone();return ue.add(n,{description:o}),n},Object.defineProperty(e,"description",{get(){var o;return(o=ue.get(e))==null?void 0:o.description},configurable:!0}),e.meta=(...o)=>{if(o.length===0)return ue.get(e);const n=e.clone();return ue.add(n,o[0]),n},e.isOptional=()=>e.safeParse(void 0).success,e.isNullable=()=>e.safeParse(null).success,e)),ao=l("_ZodString",(e,r)=>{De.init(e,r),S.init(e,r);const o=e._zod.bag;e.format=o.format??null,e.minLength=o.minimum??null,e.maxLength=o.maximum??null,e.regex=(...n)=>e.check(Gt(...n)),e.includes=(...n)=>e.check(qt(...n)),e.startsWith=(...n)=>e.check(Xt(...n)),e.endsWith=(...n)=>e.check(Ht(...n)),e.min=(...n)=>e.check(pe(...n)),e.max=(...n)=>e.check(so(...n)),e.length=(...n)=>e.check(io(...n)),e.nonempty=(...n)=>e.check(pe(1,...n)),e.lowercase=n=>e.check(Kt(n)),e.uppercase=n=>e.check(Yt(n)),e.trim=()=>e.check(es()),e.normalize=(...n)=>e.check(Qt(...n)),e.toLowerCase=()=>e.check(rs()),e.toUpperCase=()=>e.check(os())}),Is=l("ZodString",(e,r)=>{De.init(e,r),ao.init(e,r),e.email=o=>e.check(_t(Cs,o)),e.url=o=>e.check(zt(Ps,o)),e.jwt=o=>e.check(Rt(Gs,o)),e.emoji=o=>e.check(xt(Es,o)),e.guid=o=>e.check(He(er,o)),e.uuid=o=>e.check(Ft(me,o)),e.uuidv4=o=>e.check(wt(me,o)),e.uuidv6=o=>e.check(yt(me,o)),e.uuidv7=o=>e.check(jt(me,o)),e.nanoid=o=>e.check(kt(Ns,o)),e.guid=o=>e.check(He(er,o)),e.cuid=o=>e.check(St(As,o)),e.cuid2=o=>e.check(Zt(Ds,o)),e.ulid=o=>e.check($t(Ts,o)),e.base64=o=>e.check(Dt(Bs,o)),e.base64url=o=>e.check(Tt(Ws,o)),e.xid=o=>e.check(It(Os,o)),e.ksuid=o=>e.check(Ct(Rs,o)),e.ipv4=o=>e.check(Pt(Ls,o)),e.ipv6=o=>e.check(Et(Us,o)),e.cidrv4=o=>e.check(Nt(Ms,o)),e.cidrv6=o=>e.check(At(Vs,o)),e.e164=o=>e.check(Ot(Js,o)),e.datetime=o=>e.check(us(o)),e.date=o=>e.check(ds(o)),e.time=o=>e.check(hs(o)),e.duration=o=>e.check(gs(o))});function k(e){return bt(Is,e)}const w=l("ZodStringFormat",(e,r)=>{F.init(e,r),ao.init(e,r)}),Cs=l("ZodEmail",(e,r)=>{Sn.init(e,r),w.init(e,r)}),er=l("ZodGUID",(e,r)=>{xn.init(e,r),w.init(e,r)}),me=l("ZodUUID",(e,r)=>{kn.init(e,r),w.init(e,r)}),Ps=l("ZodURL",(e,r)=>{Zn.init(e,r),w.init(e,r)}),Es=l("ZodEmoji",(e,r)=>{$n.init(e,r),w.init(e,r)}),Ns=l("ZodNanoID",(e,r)=>{In.init(e,r),w.init(e,r)}),As=l("ZodCUID",(e,r)=>{Cn.init(e,r),w.init(e,r)}),Ds=l("ZodCUID2",(e,r)=>{Pn.init(e,r),w.init(e,r)}),Ts=l("ZodULID",(e,r)=>{En.init(e,r),w.init(e,r)}),Os=l("ZodXID",(e,r)=>{Nn.init(e,r),w.init(e,r)}),Rs=l("ZodKSUID",(e,r)=>{An.init(e,r),w.init(e,r)}),Ls=l("ZodIPv4",(e,r)=>{Ln.init(e,r),w.init(e,r)}),Us=l("ZodIPv6",(e,r)=>{Un.init(e,r),w.init(e,r)}),Ms=l("ZodCIDRv4",(e,r)=>{Mn.init(e,r),w.init(e,r)}),Vs=l("ZodCIDRv6",(e,r)=>{Vn.init(e,r),w.init(e,r)}),Bs=l("ZodBase64",(e,r)=>{Bn.init(e,r),w.init(e,r)}),Ws=l("ZodBase64URL",(e,r)=>{Jn.init(e,r),w.init(e,r)}),Js=l("ZodE164",(e,r)=>{Gn.init(e,r),w.init(e,r)}),Gs=l("ZodJWT",(e,r)=>{Yn.init(e,r),w.init(e,r)}),Ks=l("ZodBoolean",(e,r)=>{qn.init(e,r),S.init(e,r)});function ge(e){return Bt(Ks,e)}const Ys=l("ZodUnknown",(e,r)=>{Xn.init(e,r),S.init(e,r)});function rr(){return Wt(Ys)}const qs=l("ZodNever",(e,r)=>{Hn.init(e,r),S.init(e,r)});function Xs(e){return Jt(qs,e)}const Hs=l("ZodArray",(e,r)=>{Qn.init(e,r),S.init(e,r),e.element=r.element,e.min=(o,n)=>e.check(pe(o,n)),e.nonempty=o=>e.check(pe(1,o)),e.max=(o,n)=>e.check(so(o,n)),e.length=(o,n)=>e.check(io(o,n)),e.unwrap=()=>e.element});function Qs(e,r){return ns(Hs,e,r)}const ei=l("ZodObject",(e,r)=>{rt.init(e,r),S.init(e,r),v(e,"shape",()=>r.shape),e.keyof=()=>co(Object.keys(e._zod.def.shape)),e.catchall=o=>e.clone({...e._zod.def,catchall:o}),e.passthrough=()=>e.clone({...e._zod.def,catchall:rr()}),e.loose=()=>e.clone({...e._zod.def,catchall:rr()}),e.strict=()=>e.clone({...e._zod.def,catchall:Xs()}),e.strip=()=>e.clone({...e._zod.def,catchall:void 0}),e.extend=o=>yo(e,o),e.safeExtend=o=>jo(e,o),e.merge=o=>zo(e,o),e.pick=o=>Fo(e,o),e.omit=o=>wo(e,o),e.partial=(...o)=>xo(lo,e,o[0]),e.required=(...o)=>ko(uo,e,o[0])});function L(e,r){const o={type:"object",shape:e??{},...d(r)};return new ei(o)}const ri=l("ZodUnion",(e,r)=>{ot.init(e,r),S.init(e,r),e.options=r.options});function oi(e,r){return new ri({type:"union",options:e,...d(r)})}const ni=l("ZodIntersection",(e,r)=>{nt.init(e,r),S.init(e,r)});function ti(e,r){return new ni({type:"intersection",left:e,right:r})}const Ie=l("ZodEnum",(e,r)=>{tt.init(e,r),S.init(e,r),e.enum=r.entries,e.options=Object.values(r.entries);const o=new Set(Object.keys(r.entries));e.extract=(n,t)=>{const i={};for(const a of n)if(o.has(a))i[a]=r.entries[a];else throw new Error(`Key ${a} not found in enum`);return new Ie({...r,checks:[],...d(t),entries:i})},e.exclude=(n,t)=>{const i={...r.entries};for(const a of n)if(o.has(a))delete i[a];else throw new Error(`Key ${a} not found in enum`);return new Ie({...r,checks:[],...d(t),entries:i})}});function co(e,r){const o=Array.isArray(e)?Object.fromEntries(e.map(n=>[n,n])):e;return new Ie({type:"enum",entries:o,...d(r)})}const si=l("ZodLiteral",(e,r)=>{st.init(e,r),S.init(e,r),e.values=new Set(r.values),Object.defineProperty(e,"value",{get(){if(r.values.length>1)throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");return r.values[0]}})});function ii(e,r){return new si({type:"literal",values:Array.isArray(e)?e:[e],...d(r)})}const ai=l("ZodTransform",(e,r)=>{it.init(e,r),S.init(e,r),e._zod.parse=(o,n)=>{if(n.direction==="backward")throw new Gr(e.constructor.name);o.addIssue=i=>{if(typeof i=="string")o.issues.push(ie(i,o.value,r));else{const a=i;a.fatal&&(a.continue=!1),a.code??(a.code="custom"),a.input??(a.input=o.value),a.inst??(a.inst=e),o.issues.push(ie(a))}};const t=r.transform(o.value,o);return t instanceof Promise?t.then(i=>(o.value=i,o)):(o.value=t,o)}});function ci(e){return new ai({type:"transform",transform:e})}const lo=l("ZodOptional",(e,r)=>{at.init(e,r),S.init(e,r),e.unwrap=()=>e._zod.def.innerType});function or(e){return new lo({type:"optional",innerType:e})}const li=l("ZodNullable",(e,r)=>{ct.init(e,r),S.init(e,r),e.unwrap=()=>e._zod.def.innerType});function nr(e){return new li({type:"nullable",innerType:e})}const ui=l("ZodDefault",(e,r)=>{lt.init(e,r),S.init(e,r),e.unwrap=()=>e._zod.def.innerType,e.removeDefault=e.unwrap});function mi(e,r){return new ui({type:"default",innerType:e,get defaultValue(){return typeof r=="function"?r():qr(r)}})}const di=l("ZodPrefault",(e,r)=>{ut.init(e,r),S.init(e,r),e.unwrap=()=>e._zod.def.innerType});function fi(e,r){return new di({type:"prefault",innerType:e,get defaultValue(){return typeof r=="function"?r():qr(r)}})}const uo=l("ZodNonOptional",(e,r)=>{mt.init(e,r),S.init(e,r),e.unwrap=()=>e._zod.def.innerType});function hi(e,r){return new uo({type:"nonoptional",innerType:e,...d(r)})}const pi=l("ZodCatch",(e,r)=>{dt.init(e,r),S.init(e,r),e.unwrap=()=>e._zod.def.innerType,e.removeCatch=e.unwrap});function gi(e,r){return new pi({type:"catch",innerType:e,catchValue:typeof r=="function"?r:()=>r})}const vi=l("ZodPipe",(e,r)=>{ft.init(e,r),S.init(e,r),e.in=r.in,e.out=r.out});function tr(e,r){return new vi({type:"pipe",in:e,out:r})}const bi=l("ZodReadonly",(e,r)=>{ht.init(e,r),S.init(e,r),e.unwrap=()=>e._zod.def.innerType});function _i(e){return new bi({type:"readonly",innerType:e})}const Fi=l("ZodCustom",(e,r)=>{pt.init(e,r),S.init(e,r)});function wi(e,r={}){return ts(Fi,e,r)}function yi(e){return ss(e)}const ea={title:"Tier 1: Primitives/shadcn/Form",component:D,parameters:{layout:"centered",docs:{description:{component:"Composable form primitives built on react-hook-form and Radix UI. Provides type-safe forms with Zod validation, automatic error handling, and accessibility features."}}},tags:["autodocs"],decorators:[e=>s.jsx("div",{className:"w-[500px]",children:s.jsx(e,{})})]},X={render:()=>{const e=L({email:k().email("Invalid email address"),password:k().min(8,"Password must be at least 8 characters")}),r=T({resolver:R(e),defaultValues:{email:"",password:""}}),o=V(n=>{console.log("Form submitted:",n)});return s.jsx(D,{...r,children:s.jsxs("form",{onSubmit:r.handleSubmit(o),className:"space-y-6",children:[s.jsx(_,{control:r.control,name:"email",render:({field:n})=>s.jsxs(h,{children:[s.jsx(p,{children:"Email"}),s.jsx(g,{children:s.jsx(Z,{placeholder:"john@example.com",type:"email",...n})}),s.jsx(I,{children:"We'll never share your email with anyone else."}),s.jsx(y,{})]})}),s.jsx(_,{control:r.control,name:"password",render:({field:n})=>s.jsxs(h,{children:[s.jsx(p,{children:"Password"}),s.jsx(g,{children:s.jsx(Z,{placeholder:"••••••••",type:"password",...n})}),s.jsx(y,{})]})}),s.jsx(E,{type:"submit",className:"w-full",children:"Sign In"})]})})}},H={render:()=>{const e=L({username:k().min(3,"Username must be at least 3 characters").max(20,"Username must be less than 20 characters").regex(/^[a-zA-Z0-9_]+$/,"Username can only contain letters, numbers, and underscores"),bio:k().max(160,"Bio must be less than 160 characters").optional(),url:k().url("Please enter a valid URL").optional().or(ii("")),marketing:ge().default(!1)}),r=T({resolver:R(e),defaultValues:{username:"",bio:"",url:"",marketing:!1}}),o=V(n=>{console.log("Profile updated:",n)});return s.jsx(D,{...r,children:s.jsxs("form",{onSubmit:r.handleSubmit(o),className:"space-y-6",children:[s.jsx(_,{control:r.control,name:"username",render:({field:n})=>s.jsxs(h,{children:[s.jsx(p,{children:"Username"}),s.jsx(g,{children:s.jsx(Z,{placeholder:"johndoe",...n})}),s.jsx(I,{children:"This is your public display name. It can be your real name or a pseudonym."}),s.jsx(y,{})]})}),s.jsx(_,{control:r.control,name:"bio",render:({field:n})=>s.jsxs(h,{children:[s.jsx(p,{children:"Bio"}),s.jsx(g,{children:s.jsx(Jr,{placeholder:"Tell us about yourself...",className:"resize-none",...n})}),s.jsx(I,{children:"You can write a brief bio about yourself. Max 160 characters."}),s.jsx(y,{})]})}),s.jsx(_,{control:r.control,name:"url",render:({field:n})=>s.jsxs(h,{children:[s.jsx(p,{children:"Website"}),s.jsx(g,{children:s.jsx(Z,{placeholder:"https://example.com",type:"url",...n})}),s.jsx(I,{children:"Add a link to your website or portfolio."}),s.jsx(y,{})]})}),s.jsx(_,{control:r.control,name:"marketing",render:({field:n})=>s.jsxs(h,{className:"flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4",children:[s.jsx(g,{children:s.jsx(de,{checked:n.value,onCheckedChange:n.onChange})}),s.jsxs("div",{className:"space-y-1 leading-none",children:[s.jsx(p,{children:"Marketing emails"}),s.jsx(I,{children:"Receive emails about new products, features, and more."})]})]})}),s.jsxs("div",{className:"flex gap-4",children:[s.jsx(E,{type:"submit",className:"flex-1",children:"Update Profile"}),s.jsx(E,{type:"button",variant:"outline",onClick:()=>r.reset(),children:"Cancel"})]})]})})}},Q={render:()=>{const e=L({name:k().min(2,"Name must be at least 2 characters"),email:k().email("Invalid email address"),password:k().min(8,"Password must be at least 8 characters"),confirmPassword:k(),terms:ge().refine(n=>n===!0,{message:"You must accept the terms and conditions"})}).refine(n=>n.password===n.confirmPassword,{message:"Passwords don't match",path:["confirmPassword"]}),r=T({resolver:R(e),defaultValues:{name:"",email:"",password:"",confirmPassword:"",terms:!1}}),o=V(n=>{console.log("Registration:",n)});return s.jsx(D,{...r,children:s.jsxs("form",{onSubmit:r.handleSubmit(o),className:"space-y-6",children:[s.jsx(_,{control:r.control,name:"name",render:({field:n})=>s.jsxs(h,{children:[s.jsx(p,{children:"Full Name"}),s.jsx(g,{children:s.jsx(Z,{placeholder:"John Doe",...n})}),s.jsx(y,{})]})}),s.jsx(_,{control:r.control,name:"email",render:({field:n})=>s.jsxs(h,{children:[s.jsx(p,{children:"Email"}),s.jsx(g,{children:s.jsx(Z,{placeholder:"john@example.com",type:"email",...n})}),s.jsx(y,{})]})}),s.jsx(_,{control:r.control,name:"password",render:({field:n})=>s.jsxs(h,{children:[s.jsx(p,{children:"Password"}),s.jsx(g,{children:s.jsx(Z,{placeholder:"••••••••",type:"password",...n})}),s.jsx(I,{children:"Must be at least 8 characters long"}),s.jsx(y,{})]})}),s.jsx(_,{control:r.control,name:"confirmPassword",render:({field:n})=>s.jsxs(h,{children:[s.jsx(p,{children:"Confirm Password"}),s.jsx(g,{children:s.jsx(Z,{placeholder:"••••••••",type:"password",...n})}),s.jsx(y,{})]})}),s.jsx(_,{control:r.control,name:"terms",render:({field:n})=>s.jsxs(h,{className:"flex flex-row items-start space-x-3 space-y-0",children:[s.jsx(g,{children:s.jsx(de,{checked:n.value,onCheckedChange:n.onChange})}),s.jsxs("div",{className:"space-y-1 leading-none",children:[s.jsxs(p,{children:["I accept the"," ",s.jsx("a",{href:"#",className:"text-primary hover:underline",children:"terms and conditions"})]}),s.jsx(y,{})]})]})}),s.jsx(E,{type:"submit",className:"w-full",variant:"default",children:"Create Account"})]})})}},ee={render:()=>{const e=L({type:co(["all","mentions","none"],{required_error:"You need to select a notification type."}),mobile:ge().default(!1),email:ge().default(!0)}),r=T({resolver:R(e),defaultValues:{type:"all",mobile:!1,email:!0}}),o=V(n=>{console.log("Preferences saved:",n)});return s.jsx(D,{...r,children:s.jsxs("form",{onSubmit:r.handleSubmit(o),className:"space-y-6",children:[s.jsx(_,{control:r.control,name:"type",render:({field:n})=>s.jsxs(h,{className:"space-y-3",children:[s.jsx(p,{children:"Notify me about..."}),s.jsx(g,{children:s.jsxs(ho,{onValueChange:n.onChange,defaultValue:n.value,className:"flex flex-col space-y-1",children:[s.jsxs(h,{className:"flex items-center space-x-3 space-y-0",children:[s.jsx(g,{children:s.jsx(ze,{value:"all"})}),s.jsx(p,{className:"font-normal",children:"All new messages"})]}),s.jsxs(h,{className:"flex items-center space-x-3 space-y-0",children:[s.jsx(g,{children:s.jsx(ze,{value:"mentions"})}),s.jsx(p,{className:"font-normal",children:"Direct messages and mentions"})]}),s.jsxs(h,{className:"flex items-center space-x-3 space-y-0",children:[s.jsx(g,{children:s.jsx(ze,{value:"none"})}),s.jsx(p,{className:"font-normal",children:"Nothing"})]})]})}),s.jsx(I,{children:"Choose how you want to receive notifications"}),s.jsx(y,{})]})}),s.jsxs("div",{className:"space-y-4",children:[s.jsx(_,{control:r.control,name:"mobile",render:({field:n})=>s.jsxs(h,{className:"flex flex-row items-center justify-between rounded-lg border p-4",children:[s.jsxs("div",{className:"space-y-0.5",children:[s.jsx(p,{className:"text-base",children:"Mobile notifications"}),s.jsx(I,{children:"Receive push notifications on your mobile device"})]}),s.jsx(g,{children:s.jsx(de,{checked:n.value,onCheckedChange:n.onChange})})]})}),s.jsx(_,{control:r.control,name:"email",render:({field:n})=>s.jsxs(h,{className:"flex flex-row items-center justify-between rounded-lg border p-4",children:[s.jsxs("div",{className:"space-y-0.5",children:[s.jsx(p,{className:"text-base",children:"Email notifications"}),s.jsx(I,{children:"Receive notifications via email"})]}),s.jsx(g,{children:s.jsx(de,{checked:n.value,onCheckedChange:n.onChange})})]})})]}),s.jsx(E,{type:"submit",className:"w-full",children:"Save Preferences"})]})})}},re={render:()=>{const e=L({name:k().min(2,"Name must be at least 2 characters"),email:k().email("Invalid email address"),subject:k().min(5,"Subject must be at least 5 characters"),message:k().min(10,"Message must be at least 10 characters").max(500,"Message must be less than 500 characters")}),r=T({resolver:R(e),defaultValues:{name:"",email:"",subject:"",message:""}}),o=V(t=>{console.log("Message sent:",t),r.reset()}),n=r.watch("message");return s.jsx(D,{...r,children:s.jsxs("form",{onSubmit:r.handleSubmit(o),className:"space-y-6",children:[s.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[s.jsx(_,{control:r.control,name:"name",render:({field:t})=>s.jsxs(h,{children:[s.jsx(p,{children:"Name"}),s.jsx(g,{children:s.jsx(Z,{placeholder:"John Doe",...t})}),s.jsx(y,{})]})}),s.jsx(_,{control:r.control,name:"email",render:({field:t})=>s.jsxs(h,{children:[s.jsx(p,{children:"Email"}),s.jsx(g,{children:s.jsx(Z,{placeholder:"john@example.com",type:"email",...t})}),s.jsx(y,{})]})})]}),s.jsx(_,{control:r.control,name:"subject",render:({field:t})=>s.jsxs(h,{children:[s.jsx(p,{children:"Subject"}),s.jsx(g,{children:s.jsx(Z,{placeholder:"What is this regarding?",...t})}),s.jsx(y,{})]})}),s.jsx(_,{control:r.control,name:"message",render:({field:t})=>s.jsxs(h,{children:[s.jsx(p,{children:"Message"}),s.jsx(g,{children:s.jsx(Jr,{placeholder:"Tell us more...",className:"resize-none h-32",...t})}),s.jsxs("div",{className:"flex justify-between",children:[s.jsx(I,{children:"Your message will be reviewed by our team."}),s.jsxs("span",{className:"text-sm text-muted-foreground",children:[(n==null?void 0:n.length)||0,"/500"]})]}),s.jsx(y,{})]})}),s.jsxs("div",{className:"flex gap-4",children:[s.jsx(E,{type:"submit",className:"flex-1",variant:"default",children:"Send Message"}),s.jsx(E,{type:"button",variant:"outline",onClick:()=>r.reset(),children:"Clear"})]})]})})}},oe={render:()=>{const[e,r]=ke.useState(!1),[o,n]=ke.useState(!1),t=L({username:k().min(3,"Username must be at least 3 characters"),email:k().email("Invalid email address")}),i=T({resolver:R(t),defaultValues:{username:"",email:""}}),a=async c=>{r(!0),n(!1),await new Promise(u=>setTimeout(u,2e3)),console.log("Form submitted:",c),r(!1),n(!0),setTimeout(()=>{n(!1),i.reset()},3e3)};return s.jsx(D,{...i,children:s.jsxs("form",{onSubmit:i.handleSubmit(a),className:"space-y-6",children:[s.jsx(_,{control:i.control,name:"username",render:({field:c})=>s.jsxs(h,{children:[s.jsx(p,{children:"Username"}),s.jsx(g,{children:s.jsx(Z,{placeholder:"johndoe",...c})}),s.jsx(y,{})]})}),s.jsx(_,{control:i.control,name:"email",render:({field:c})=>s.jsxs(h,{children:[s.jsx(p,{children:"Email"}),s.jsx(g,{children:s.jsx(Z,{placeholder:"john@example.com",type:"email",...c})}),s.jsx(y,{})]})}),o&&s.jsx("div",{className:"rounded-md bg-green-50 p-4 border border-green-200",style:{borderColor:"var(--primary)",backgroundColor:"hsl(var(--primary) / 0.1)"},children:s.jsx("p",{className:"text-sm font-medium",style:{color:"var(--primary)"},children:"✓ Successfully submitted! Form will reset shortly."})}),s.jsx(E,{type:"submit",className:"w-full",loading:e,disabled:e,children:e?"Submitting...":"Submit"})]})})}},ne={render:()=>{const e=L({email:k().email("Invalid email address")}),r=T({resolver:R(e),defaultValues:{email:""}}),o=V(n=>{console.log("Email submitted:",n)});return s.jsx(D,{...r,children:s.jsxs("form",{onSubmit:r.handleSubmit(o),className:"space-y-4",children:[s.jsx(_,{control:r.control,name:"email",render:({field:n})=>s.jsxs(h,{children:[s.jsx(p,{children:"Email"}),s.jsx(g,{children:s.jsx(Z,{placeholder:"Enter your email",type:"email",...n})}),s.jsx(y,{})]})}),s.jsx(E,{type:"submit",className:"w-full",children:"Subscribe"})]})})}},te={render:()=>{const e=L({validField:k().min(3),invalidField:k().min(10),disabledField:k(),optionalField:k().optional()}),r=T({resolver:R(e),defaultValues:{validField:"Valid content",invalidField:"Short",disabledField:"Cannot edit",optionalField:""}});ke.useEffect(()=>{r.trigger("invalidField")},[r]);const o=V(n=>{console.log("Form values:",n)});return s.jsx(D,{...r,children:s.jsxs("form",{onSubmit:r.handleSubmit(o),className:"space-y-6",children:[s.jsx(_,{control:r.control,name:"validField",render:({field:n})=>s.jsxs(h,{children:[s.jsx(p,{children:"Valid Field"}),s.jsx(g,{children:s.jsx(Z,{...n})}),s.jsx(I,{children:"This field has valid content"}),s.jsx(y,{})]})}),s.jsx(_,{control:r.control,name:"invalidField",render:({field:n})=>s.jsxs(h,{children:[s.jsx(p,{children:"Invalid Field (Error State)"}),s.jsx(g,{children:s.jsx(Z,{...n})}),s.jsx(I,{children:"This field shows an error (min 10 characters)"}),s.jsx(y,{})]})}),s.jsx(_,{control:r.control,name:"disabledField",render:({field:n})=>s.jsxs(h,{children:[s.jsx(p,{children:"Disabled Field"}),s.jsx(g,{children:s.jsx(Z,{...n,disabled:!0})}),s.jsx(I,{children:"This field cannot be edited"}),s.jsx(y,{})]})}),s.jsx(_,{control:r.control,name:"optionalField",render:({field:n})=>s.jsxs(h,{children:[s.jsx(p,{children:"Optional Field"}),s.jsx(g,{children:s.jsx(Z,{placeholder:"Not required",...n})}),s.jsx(I,{children:"This field is optional"}),s.jsx(y,{})]})}),s.jsx(E,{type:"submit",className:"w-full",children:"Submit"})]})})}};var sr,ir,ar,cr,lr;X.parameters={...X.parameters,docs:{...(sr=X.parameters)==null?void 0:sr.docs,source:{originalSource:`{
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
}`,...(ar=(ir=X.parameters)==null?void 0:ir.docs)==null?void 0:ar.source},description:{story:"Simple login form with email and password fields",...(lr=(cr=X.parameters)==null?void 0:cr.docs)==null?void 0:lr.description}}};var ur,mr,dr,fr,hr;H.parameters={...H.parameters,docs:{...(ur=H.parameters)==null?void 0:ur.docs,source:{originalSource:`{
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
}`,...(dr=(mr=H.parameters)==null?void 0:mr.docs)==null?void 0:dr.source},description:{story:"Profile form with multiple field types",...(hr=(fr=H.parameters)==null?void 0:fr.docs)==null?void 0:hr.description}}};var pr,gr,vr,br,_r;Q.parameters={...Q.parameters,docs:{...(pr=Q.parameters)==null?void 0:pr.docs,source:{originalSource:`{
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
}`,...(vr=(gr=Q.parameters)==null?void 0:gr.docs)==null?void 0:vr.source},description:{story:"Registration form with password confirmation",...(_r=(br=Q.parameters)==null?void 0:br.docs)==null?void 0:_r.description}}};var Fr,wr,yr,jr,zr;ee.parameters={...ee.parameters,docs:{...(Fr=ee.parameters)==null?void 0:Fr.docs,source:{originalSource:`{
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
}`,...(yr=(wr=ee.parameters)==null?void 0:wr.docs)==null?void 0:yr.source},description:{story:"Form with radio group selection",...(zr=(jr=ee.parameters)==null?void 0:jr.docs)==null?void 0:zr.description}}};var xr,kr,Sr,Zr,$r;re.parameters={...re.parameters,docs:{...(xr=re.parameters)==null?void 0:xr.docs,source:{originalSource:`{
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
}`,...(Sr=(kr=re.parameters)==null?void 0:kr.docs)==null?void 0:Sr.source},description:{story:"Contact form with validation",...($r=(Zr=re.parameters)==null?void 0:Zr.docs)==null?void 0:$r.description}}};var Ir,Cr,Pr,Er,Nr;oe.parameters={...oe.parameters,docs:{...(Ir=oe.parameters)==null?void 0:Ir.docs,source:{originalSource:`{
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
}`,...(Pr=(Cr=oe.parameters)==null?void 0:Cr.docs)==null?void 0:Pr.source},description:{story:"Form with custom validation and async submission",...(Nr=(Er=oe.parameters)==null?void 0:Er.docs)==null?void 0:Nr.description}}};var Ar,Dr,Tr,Or,Rr;ne.parameters={...ne.parameters,docs:{...(Ar=ne.parameters)==null?void 0:Ar.docs,source:{originalSource:`{
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
}`,...(Tr=(Dr=ne.parameters)==null?void 0:Dr.docs)==null?void 0:Tr.source},description:{story:"Minimal form example",...(Rr=(Or=ne.parameters)==null?void 0:Or.docs)==null?void 0:Rr.description}}};var Lr,Ur,Mr,Vr,Br;te.parameters={...te.parameters,docs:{...(Lr=te.parameters)==null?void 0:Lr.docs,source:{originalSource:`{
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
}`,...(Mr=(Ur=te.parameters)==null?void 0:Ur.docs)==null?void 0:Mr.source},description:{story:"Form with all field states showcased",...(Br=(Vr=te.parameters)==null?void 0:Vr.docs)==null?void 0:Br.description}}};const ra=["LoginForm","ProfileForm","RegistrationForm","NotificationPreferences","ContactForm","AsyncSubmission","MinimalExample","AllFieldStates"];export{te as AllFieldStates,oe as AsyncSubmission,re as ContactForm,X as LoginForm,ne as MinimalExample,ee as NotificationPreferences,H as ProfileForm,Q as RegistrationForm,ra as __namedExportsOrder,ea as default};
