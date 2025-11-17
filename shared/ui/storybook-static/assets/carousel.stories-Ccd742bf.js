import{j as s}from"./jsx-runtime-DF2Pcvd1.js";import{r as b}from"./index-B2-qRKKC.js";import{c as Oe}from"./cn-CytzSlOG.js";import{B as le}from"./button-DP4L7qO7.js";import{c as Ms}from"./createLucideIcon-BbF4D6Jl.js";import{A as qs}from"./arrow-right-2p1MOGVp.js";import{C as G}from"./card-DMcvVywK.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-BiMR7eR1.js";import"./index-BFjtS4uE.js";import"./index-DVF2XGCm.js";/**
 * @license lucide-react v0.553.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fs=[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]],Bs=Ms("arrow-left",Fs);function Vs(t){return Object.prototype.toString.call(t)==="[object Object]"}function lt(t){return Vs(t)||Array.isArray(t)}function Rs(){return!!(typeof window<"u"&&window.document&&window.document.createElement)}function Ue(t,e){const n=Object.keys(t),r=Object.keys(e);if(n.length!==r.length)return!1;const i=JSON.stringify(Object.keys(t.breakpoints||{})),a=JSON.stringify(Object.keys(e.breakpoints||{}));return i!==a?!1:n.every(o=>{const u=t[o],l=e[o];return typeof u=="function"?`${u}`==`${l}`:!lt(u)||!lt(l)?u===l:Ue(u,l)})}function ct(t){return t.concat().sort((e,n)=>e.name>n.name?1:-1).map(e=>e.options)}function $s(t,e){if(t.length!==e.length)return!1;const n=ct(t),r=ct(e);return n.every((i,a)=>{const o=r[a];return Ue(i,o)})}function Ye(t){return typeof t=="number"}function Ke(t){return typeof t=="string"}function Fe(t){return typeof t=="boolean"}function ut(t){return Object.prototype.toString.call(t)==="[object Object]"}function T(t){return Math.abs(t)}function Qe(t){return Math.sign(t)}function Le(t,e){return T(t-e)}function Gs(t,e){if(t===0||e===0||T(t)<=T(e))return 0;const n=Le(T(t),T(e));return T(n/t)}function Hs(t){return Math.round(t*100)/100}function Te(t){return De(t).map(Number)}function K(t){return t[ze(t)]}function ze(t){return Math.max(0,t.length-1)}function Xe(t,e){return e===ze(t)}function dt(t,e=0){return Array.from(Array(t),(n,r)=>e+r)}function De(t){return Object.keys(t)}function js(t,e){return[t,e].reduce((n,r)=>(De(r).forEach(i=>{const a=n[i],o=r[i],u=ut(a)&&ut(o);n[i]=u?js(a,o):o}),n),{})}function Je(t,e){return typeof e.MouseEvent<"u"&&t instanceof e.MouseEvent}function Ks(t,e){const n={start:r,center:i,end:a};function r(){return 0}function i(l){return a(l)/2}function a(l){return e-l}function o(l,c){return Ke(t)?n[t](l):t(e,l,c)}return{measure:o}}function _e(){let t=[];function e(i,a,o,u={passive:!0}){let l;if("addEventListener"in i)i.addEventListener(a,o,u),l=()=>i.removeEventListener(a,o,u);else{const c=i;c.addListener(o),l=()=>c.removeListener(o)}return t.push(l),r}function n(){t=t.filter(i=>i())}const r={add:e,clear:n};return r}function Js(t,e,n,r){const i=_e(),a=1e3/60;let o=null,u=0,l=0;function c(){i.add(t,"visibilitychange",()=>{t.hidden&&d()})}function g(){C(),i.clear()}function p(v){if(!l)return;o||(o=v,n(),n());const m=v-o;for(o=v,u+=m;u>=a;)n(),u-=a;const h=u/a;r(h),l&&(l=e.requestAnimationFrame(p))}function f(){l||(l=e.requestAnimationFrame(p))}function C(){e.cancelAnimationFrame(l),o=null,u=0,l=0}function d(){o=null,u=0}return{init:c,destroy:g,start:f,stop:C,update:n,render:r}}function Us(t,e){const n=e==="rtl",r=t==="y",i=r?"y":"x",a=r?"x":"y",o=!r&&n?-1:1,u=g(),l=p();function c(d){const{height:x,width:v}=d;return r?x:v}function g(){return r?"top":n?"right":"left"}function p(){return r?"bottom":n?"left":"right"}function f(d){return d*o}return{scroll:i,cross:a,startEdge:u,endEdge:l,measureSize:c,direction:f}}function ce(t=0,e=0){const n=T(t-e);function r(c){return c<t}function i(c){return c>e}function a(c){return r(c)||i(c)}function o(c){return a(c)?r(c)?t:e:c}function u(c){return n?c-n*Math.ceil((c-e)/n):c}return{length:n,max:e,min:t,constrain:o,reachedAny:a,reachedMax:i,reachedMin:r,removeOffset:u}}function Ss(t,e,n){const{constrain:r}=ce(0,t),i=t+1;let a=o(e);function o(f){return n?T((i+f)%i):r(f)}function u(){return a}function l(f){return a=o(f),p}function c(f){return g().set(u()+f)}function g(){return Ss(t,u(),n)}const p={get:u,set:l,add:c,clone:g};return p}function Ys(t,e,n,r,i,a,o,u,l,c,g,p,f,C,d,x,v,m,h){const{cross:y,direction:w}=t,k=["INPUT","SELECT","TEXTAREA"],I={passive:!1},j=_e(),S=_e(),A=ce(50,225).constrain(C.measure(20)),D={mouse:300,touch:400},P={mouse:500,touch:600},B=d?43:25;let J=!1,U=0,Y=0,oe=!1,ne=!1,Z=!1,W=!1;function fe(N){if(!h)return;function E(F){(Fe(h)||h(N,F))&&xe(F)}const _=e;j.add(_,"dragstart",F=>F.preventDefault(),I).add(_,"touchmove",()=>{},I).add(_,"touchend",()=>{}).add(_,"touchstart",E).add(_,"mousedown",E).add(_,"touchcancel",q).add(_,"contextmenu",q).add(_,"click",te,!0)}function Q(){j.clear(),S.clear()}function ue(){const N=W?n:e;S.add(N,"touchmove",$,I).add(N,"touchend",q).add(N,"mousemove",$,I).add(N,"mouseup",q)}function de(N){const E=N.nodeName||"";return k.includes(E)}function ee(){return(d?P:D)[W?"mouse":"touch"]}function pe(N,E){const _=p.add(Qe(N)*-1),F=g.byDistance(N,!d).distance;return d||T(N)<A?F:v&&E?F*.5:g.byIndex(_.get(),0).distance}function xe(N){const E=Je(N,r);W=E,Z=d&&E&&!N.buttons&&J,J=Le(i.get(),o.get())>=2,!(E&&N.button!==0)&&(de(N.target)||(oe=!0,a.pointerDown(N),c.useFriction(0).useDuration(0),i.set(o),ue(),U=a.readPoint(N),Y=a.readPoint(N,y),f.emit("pointerDown")))}function $(N){if(!Je(N,r)&&N.touches.length>=2)return q(N);const _=a.readPoint(N),F=a.readPoint(N,y),X=Le(_,U),se=Le(F,Y);if(!ne&&!W&&(!N.cancelable||(ne=X>se,!ne)))return q(N);const ae=a.pointerMove(N);X>x&&(Z=!0),c.useFriction(.3).useDuration(.75),u.start(),i.add(w(ae)),N.preventDefault()}function q(N){const _=g.byDistance(0,!1).index!==p.get(),F=a.pointerUp(N)*ee(),X=pe(w(F),_),se=Gs(F,X),ae=B-10*se,re=m+se/50;ne=!1,oe=!1,S.clear(),c.useDuration(ae).useFriction(re),l.distance(X,!d),W=!1,f.emit("pointerUp")}function te(N){Z&&(N.stopPropagation(),N.preventDefault(),Z=!1)}function H(){return oe}return{init:fe,destroy:Q,pointerDown:H}}function Qs(t,e){let r,i;function a(p){return p.timeStamp}function o(p,f){const d=`client${(f||t.scroll)==="x"?"X":"Y"}`;return(Je(p,e)?p:p.touches[0])[d]}function u(p){return r=p,i=p,o(p)}function l(p){const f=o(p)-o(i),C=a(p)-a(r)>170;return i=p,C&&(r=p),f}function c(p){if(!r||!i)return 0;const f=o(i)-o(r),C=a(p)-a(r),d=a(p)-a(i)>170,x=f/C;return C&&!d&&T(x)>.1?x:0}return{pointerDown:u,pointerMove:l,pointerUp:c,readPoint:o}}function Xs(){function t(n){const{offsetTop:r,offsetLeft:i,offsetWidth:a,offsetHeight:o}=n;return{top:r,right:i+a,bottom:r+o,left:i,width:a,height:o}}return{measure:t}}function Zs(t){function e(r){return t*(r/100)}return{measure:e}}function Ws(t,e,n,r,i,a,o){const u=[t].concat(r);let l,c,g=[],p=!1;function f(v){return i.measureSize(o.measure(v))}function C(v){if(!a)return;c=f(t),g=r.map(f);function m(h){for(const y of h){if(p)return;const w=y.target===t,k=r.indexOf(y.target),I=w?c:g[k],j=f(w?t:r[k]);if(T(j-I)>=.5){v.reInit(),e.emit("resize");break}}}l=new ResizeObserver(h=>{(Fe(a)||a(v,h))&&m(h)}),n.requestAnimationFrame(()=>{u.forEach(h=>l.observe(h))})}function d(){p=!0,l&&l.disconnect()}return{init:C,destroy:d}}function en(t,e,n,r,i,a){let o=0,u=0,l=i,c=a,g=t.get(),p=0;function f(){const I=r.get()-t.get(),j=!l;let S=0;return j?(o=0,n.set(r),t.set(r),S=I):(n.set(t),o+=I/l,o*=c,g+=o,t.add(o),S=g-p),u=Qe(S),p=g,k}function C(){const I=r.get()-e.get();return T(I)<.001}function d(){return l}function x(){return u}function v(){return o}function m(){return y(i)}function h(){return w(a)}function y(I){return l=I,k}function w(I){return c=I,k}const k={direction:x,duration:d,velocity:v,seek:f,settled:C,useBaseFriction:h,useBaseDuration:m,useFriction:w,useDuration:y};return k}function tn(t,e,n,r,i){const a=i.measure(10),o=i.measure(50),u=ce(.1,.99);let l=!1;function c(){return!(l||!t.reachedAny(n.get())||!t.reachedAny(e.get()))}function g(C){if(!c())return;const d=t.reachedMin(e.get())?"min":"max",x=T(t[d]-e.get()),v=n.get()-e.get(),m=u.constrain(x/o);n.subtract(v*m),!C&&T(v)<a&&(n.set(t.constrain(n.get())),r.useDuration(25).useBaseFriction())}function p(C){l=!C}return{shouldConstrain:c,constrain:g,toggleActive:p}}function sn(t,e,n,r,i){const a=ce(-e+t,0),o=p(),u=g(),l=f();function c(d,x){return Le(d,x)<=1}function g(){const d=o[0],x=K(o),v=o.lastIndexOf(d),m=o.indexOf(x)+1;return ce(v,m)}function p(){return n.map((d,x)=>{const{min:v,max:m}=a,h=a.constrain(d),y=!x,w=Xe(n,x);return y?m:w||c(v,h)?v:c(m,h)?m:h}).map(d=>parseFloat(d.toFixed(3)))}function f(){if(e<=t+i)return[a.max];if(r==="keepSnaps")return o;const{min:d,max:x}=u;return o.slice(d,x)}return{snapsContained:l,scrollContainLimit:u}}function nn(t,e,n){const r=e[0],i=n?r-t:K(e);return{limit:ce(i,r)}}function rn(t,e,n,r){const a=e.min+.1,o=e.max+.1,{reachedMin:u,reachedMax:l}=ce(a,o);function c(f){return f===1?l(n.get()):f===-1?u(n.get()):!1}function g(f){if(!c(f))return;const C=t*(f*-1);r.forEach(d=>d.add(C))}return{loop:g}}function on(t){const{max:e,length:n}=t;function r(a){const o=a-e;return n?o/-n:0}return{get:r}}function an(t,e,n,r,i){const{startEdge:a,endEdge:o}=t,{groupSlides:u}=i,l=p().map(e.measure),c=f(),g=C();function p(){return u(r).map(x=>K(x)[o]-x[0][a]).map(T)}function f(){return r.map(x=>n[a]-x[a]).map(x=>-T(x))}function C(){return u(c).map(x=>x[0]).map((x,v)=>x+l[v])}return{snaps:c,snapsAligned:g}}function ln(t,e,n,r,i,a){const{groupSlides:o}=i,{min:u,max:l}=r,c=g();function g(){const f=o(a),C=!t||e==="keepSnaps";return n.length===1?[a]:C?f:f.slice(u,l).map((d,x,v)=>{const m=!x,h=Xe(v,x);if(m){const y=K(v[0])+1;return dt(y)}if(h){const y=ze(a)-K(v)[0]+1;return dt(y,K(v)[0])}return d})}return{slideRegistry:c}}function cn(t,e,n,r,i){const{reachedAny:a,removeOffset:o,constrain:u}=r;function l(d){return d.concat().sort((x,v)=>T(x)-T(v))[0]}function c(d){const x=t?o(d):u(d),v=e.map((h,y)=>({diff:g(h-x,0),index:y})).sort((h,y)=>T(h.diff)-T(y.diff)),{index:m}=v[0];return{index:m,distance:x}}function g(d,x){const v=[d,d+n,d-n];if(!t)return d;if(!x)return l(v);const m=v.filter(h=>Qe(h)===x);return m.length?l(m):K(v)-n}function p(d,x){const v=e[d]-i.get(),m=g(v,x);return{index:d,distance:m}}function f(d,x){const v=i.get()+d,{index:m,distance:h}=c(v),y=!t&&a(v);if(!x||y)return{index:m,distance:d};const w=e[m]-h,k=d+g(w,0);return{index:m,distance:k}}return{byDistance:f,byIndex:p,shortcut:g}}function un(t,e,n,r,i,a,o){function u(p){const f=p.distance,C=p.index!==e.get();a.add(f),f&&(r.duration()?t.start():(t.update(),t.render(1),t.update())),C&&(n.set(e.get()),e.set(p.index),o.emit("select"))}function l(p,f){const C=i.byDistance(p,f);u(C)}function c(p,f){const C=e.clone().set(p),d=i.byIndex(C.get(),f);u(d)}return{distance:l,index:c}}function dn(t,e,n,r,i,a,o,u){const l={passive:!0,capture:!0};let c=0;function g(C){if(!u)return;function d(x){if(new Date().getTime()-c>10)return;o.emit("slideFocusStart"),t.scrollLeft=0;const h=n.findIndex(y=>y.includes(x));Ye(h)&&(i.useDuration(0),r.index(h,0),o.emit("slideFocus"))}a.add(document,"keydown",p,!1),e.forEach((x,v)=>{a.add(x,"focus",m=>{(Fe(u)||u(C,m))&&d(v)},l)})}function p(C){C.code==="Tab"&&(c=new Date().getTime())}return{init:g}}function ke(t){let e=t;function n(){return e}function r(l){e=o(l)}function i(l){e+=o(l)}function a(l){e-=o(l)}function o(l){return Ye(l)?l:l.get()}return{get:n,set:r,add:i,subtract:a}}function ws(t,e){const n=t.scroll==="x"?o:u,r=e.style;let i=null,a=!1;function o(f){return`translate3d(${f}px,0px,0px)`}function u(f){return`translate3d(0px,${f}px,0px)`}function l(f){if(a)return;const C=Hs(t.direction(f));C!==i&&(r.transform=n(C),i=C)}function c(f){a=!f}function g(){a||(r.transform="",e.getAttribute("style")||e.removeAttribute("style"))}return{clear:g,to:l,toggleActive:c}}function mn(t,e,n,r,i,a,o,u,l){const g=Te(i),p=Te(i).reverse(),f=m().concat(h());function C(j,S){return j.reduce((A,D)=>A-i[D],S)}function d(j,S){return j.reduce((A,D)=>C(A,S)>0?A.concat([D]):A,[])}function x(j){return a.map((S,A)=>({start:S-r[A]+.5+j,end:S+e-.5+j}))}function v(j,S,A){const D=x(S);return j.map(P=>{const B=A?0:-n,J=A?n:0,U=A?"end":"start",Y=D[P][U];return{index:P,loopPoint:Y,slideLocation:ke(-1),translate:ws(t,l[P]),target:()=>u.get()>Y?B:J}})}function m(){const j=o[0],S=d(p,j);return v(S,n,!1)}function h(){const j=e-o[0]-1,S=d(g,j);return v(S,-n,!0)}function y(){return f.every(({index:j})=>{const S=g.filter(A=>A!==j);return C(S,e)<=.1})}function w(){f.forEach(j=>{const{target:S,translate:A,slideLocation:D}=j,P=S();P!==D.get()&&(A.to(P),D.set(P))})}function k(){f.forEach(j=>j.translate.clear())}return{canLoop:y,clear:k,loop:w,loopPoints:f}}function fn(t,e,n){let r,i=!1;function a(l){if(!n)return;function c(g){for(const p of g)if(p.type==="childList"){l.reInit(),e.emit("slidesChanged");break}}r=new MutationObserver(g=>{i||(Fe(n)||n(l,g))&&c(g)}),r.observe(t,{childList:!0})}function o(){r&&r.disconnect(),i=!0}return{init:a,destroy:o}}function pn(t,e,n,r){const i={};let a=null,o=null,u,l=!1;function c(){u=new IntersectionObserver(d=>{l||(d.forEach(x=>{const v=e.indexOf(x.target);i[v]=x}),a=null,o=null,n.emit("slidesInView"))},{root:t.parentElement,threshold:r}),e.forEach(d=>u.observe(d))}function g(){u&&u.disconnect(),l=!0}function p(d){return De(i).reduce((x,v)=>{const m=parseInt(v),{isIntersecting:h}=i[m];return(d&&h||!d&&!h)&&x.push(m),x},[])}function f(d=!0){if(d&&a)return a;if(!d&&o)return o;const x=p(d);return d&&(a=x),d||(o=x),x}return{init:c,destroy:g,get:f}}function xn(t,e,n,r,i,a){const{measureSize:o,startEdge:u,endEdge:l}=t,c=n[0]&&i,g=d(),p=x(),f=n.map(o),C=v();function d(){if(!c)return 0;const h=n[0];return T(e[u]-h[u])}function x(){if(!c)return 0;const h=a.getComputedStyle(K(r));return parseFloat(h.getPropertyValue(`margin-${l}`))}function v(){return n.map((h,y,w)=>{const k=!y,I=Xe(w,y);return k?f[y]+g:I?f[y]+p:w[y+1][u]-h[u]}).map(T)}return{slideSizes:f,slideSizesWithGaps:C,startGap:g,endGap:p}}function hn(t,e,n,r,i,a,o,u,l){const{startEdge:c,endEdge:g,direction:p}=t,f=Ye(n);function C(m,h){return Te(m).filter(y=>y%h===0).map(y=>m.slice(y,y+h))}function d(m){return m.length?Te(m).reduce((h,y,w)=>{const k=K(h)||0,I=k===0,j=y===ze(m),S=i[c]-a[k][c],A=i[c]-a[y][g],D=!r&&I?p(o):0,P=!r&&j?p(u):0,B=T(A-P-(S+D));return w&&B>e+l&&h.push(y),j&&h.push(m.length),h},[]).map((h,y,w)=>{const k=Math.max(w[y-1]||0);return m.slice(k,h)}):[]}function x(m){return f?C(m,n):d(m)}return{groupSlides:x}}function gn(t,e,n,r,i,a,o){const{align:u,axis:l,direction:c,startIndex:g,loop:p,duration:f,dragFree:C,dragThreshold:d,inViewThreshold:x,slidesToScroll:v,skipSnaps:m,containScroll:h,watchResize:y,watchSlides:w,watchDrag:k,watchFocus:I}=a,j=2,S=Xs(),A=S.measure(e),D=n.map(S.measure),P=Us(l,c),B=P.measureSize(A),J=Zs(B),U=Ks(u,B),Y=!p&&!!h,oe=p||!!h,{slideSizes:ne,slideSizesWithGaps:Z,startGap:W,endGap:fe}=xn(P,A,D,n,oe,i),Q=hn(P,B,v,p,A,D,W,fe,j),{snaps:ue,snapsAligned:de}=an(P,U,A,D,Q),ee=-K(ue)+K(Z),{snapsContained:pe,scrollContainLimit:xe}=sn(B,ee,de,h,j),$=Y?pe:de,{limit:q}=nn(ee,$,p),te=Ss(ze($),g,p),H=te.clone(),L=Te(n),N=({dragHandler:me,scrollBody:Ge,scrollBounds:He,options:{loop:Me}})=>{Me||He.constrain(me.pointerDown()),Ge.seek()},E=({scrollBody:me,translate:Ge,location:He,offsetLocation:Me,previousLocation:Es,scrollLooper:ks,slideLooper:Ls,dragHandler:Ts,animation:Ds,eventHandler:st,scrollBounds:_s,options:{loop:nt}},rt)=>{const ot=me.settled(),Os=!_s.shouldConstrain(),at=nt?ot:ot&&Os,it=at&&!Ts.pointerDown();it&&Ds.stop();const zs=He.get()*rt+Es.get()*(1-rt);Me.set(zs),nt&&(ks.loop(me.direction()),Ls.loop()),Ge.to(Me.get()),it&&st.emit("settle"),at||st.emit("scroll")},_=Js(r,i,()=>N($e),me=>E($e,me)),F=.68,X=$[te.get()],se=ke(X),ae=ke(X),re=ke(X),ie=ke(X),he=en(se,re,ae,ie,f,F),Ve=cn(p,$,ee,q,ie),Re=un(_,te,H,he,Ve,ie,o),We=on(q),et=_e(),As=pn(e,n,o,x),{slideRegistry:tt}=ln(Y,h,$,xe,Q,L),Ps=dn(t,n,tt,Re,he,et,o,I),$e={ownerDocument:r,ownerWindow:i,eventHandler:o,containerRect:A,slideRects:D,animation:_,axis:P,dragHandler:Ys(P,t,r,i,ie,Qs(P,i),se,_,Re,he,Ve,te,o,J,C,d,m,F,k),eventStore:et,percentOfView:J,index:te,indexPrevious:H,limit:q,location:se,offsetLocation:re,previousLocation:ae,options:a,resizeHandler:Ws(e,o,i,n,P,y,S),scrollBody:he,scrollBounds:tn(q,re,ie,he,J),scrollLooper:rn(ee,q,re,[se,re,ae,ie]),scrollProgress:We,scrollSnapList:$.map(We.get),scrollSnaps:$,scrollTarget:Ve,scrollTo:Re,slideLooper:mn(P,B,ee,ne,Z,ue,$,re,n),slideFocus:Ps,slidesHandler:fn(e,o,w),slidesInView:As,slideIndexes:L,slideRegistry:tt,slidesToScroll:Q,target:ie,translate:ws(P,e)};return $e}function vn(){let t={},e;function n(c){e=c}function r(c){return t[c]||[]}function i(c){return r(c).forEach(g=>g(e,c)),l}function a(c,g){return t[c]=r(c).concat([g]),l}function o(c,g){return t[c]=r(c).filter(p=>p!==g),l}function u(){t={}}const l={init:n,emit:i,off:o,on:a,clear:u};return l}const Nn={align:"center",axis:"x",container:null,slides:null,containScroll:"trimSnaps",direction:"ltr",slidesToScroll:1,inViewThreshold:0,breakpoints:{},dragFree:!1,dragThreshold:10,loop:!1,skipSnaps:!1,duration:25,startIndex:0,active:!0,watchDrag:!0,watchResize:!0,watchSlides:!0,watchFocus:!0};function Cn(t){function e(a,o){return js(a,o||{})}function n(a){const o=a.breakpoints||{},u=De(o).filter(l=>t.matchMedia(l).matches).map(l=>o[l]).reduce((l,c)=>e(l,c),{});return e(a,u)}function r(a){return a.map(o=>De(o.breakpoints||{})).reduce((o,u)=>o.concat(u),[]).map(t.matchMedia)}return{mergeOptions:e,optionsAtMedia:n,optionsMediaQueries:r}}function yn(t){let e=[];function n(a,o){return e=o.filter(({options:u})=>t.optionsAtMedia(u).active!==!1),e.forEach(u=>u.init(a,t)),o.reduce((u,l)=>Object.assign(u,{[l.name]:l}),{})}function r(){e=e.filter(a=>a.destroy())}return{init:n,destroy:r}}function qe(t,e,n){const r=t.ownerDocument,i=r.defaultView,a=Cn(i),o=yn(a),u=_e(),l=vn(),{mergeOptions:c,optionsAtMedia:g,optionsMediaQueries:p}=a,{on:f,off:C,emit:d}=l,x=P;let v=!1,m,h=c(Nn,qe.globalOptions),y=c(h),w=[],k,I,j;function S(){const{container:L,slides:N}=y;I=(Ke(L)?t.querySelector(L):L)||t.children[0];const _=Ke(N)?I.querySelectorAll(N):N;j=[].slice.call(_||I.children)}function A(L){const N=gn(t,I,j,r,i,L,l);if(L.loop&&!N.slideLooper.canLoop()){const E=Object.assign({},L,{loop:!1});return A(E)}return N}function D(L,N){v||(h=c(h,L),y=g(h),w=N||w,S(),m=A(y),p([h,...w.map(({options:E})=>E)]).forEach(E=>u.add(E,"change",P)),y.active&&(m.translate.to(m.location.get()),m.animation.init(),m.slidesInView.init(),m.slideFocus.init(H),m.eventHandler.init(H),m.resizeHandler.init(H),m.slidesHandler.init(H),m.options.loop&&m.slideLooper.loop(),I.offsetParent&&j.length&&m.dragHandler.init(H),k=o.init(H,w)))}function P(L,N){const E=Q();B(),D(c({startIndex:E},L),N),l.emit("reInit")}function B(){m.dragHandler.destroy(),m.eventStore.clear(),m.translate.clear(),m.slideLooper.clear(),m.resizeHandler.destroy(),m.slidesHandler.destroy(),m.slidesInView.destroy(),m.animation.destroy(),o.destroy(),u.clear()}function J(){v||(v=!0,u.clear(),B(),l.emit("destroy"),l.clear())}function U(L,N,E){!y.active||v||(m.scrollBody.useBaseFriction().useDuration(N===!0?0:y.duration),m.scrollTo.index(L,E||0))}function Y(L){const N=m.index.add(1).get();U(N,L,-1)}function oe(L){const N=m.index.add(-1).get();U(N,L,1)}function ne(){return m.index.add(1).get()!==Q()}function Z(){return m.index.add(-1).get()!==Q()}function W(){return m.scrollSnapList}function fe(){return m.scrollProgress.get(m.offsetLocation.get())}function Q(){return m.index.get()}function ue(){return m.indexPrevious.get()}function de(){return m.slidesInView.get()}function ee(){return m.slidesInView.get(!1)}function pe(){return k}function xe(){return m}function $(){return t}function q(){return I}function te(){return j}const H={canScrollNext:ne,canScrollPrev:Z,containerNode:q,internalEngine:xe,destroy:J,off:C,on:f,emit:d,plugins:pe,previousScrollSnap:ue,reInit:x,rootNode:$,scrollNext:Y,scrollPrev:oe,scrollProgress:fe,scrollSnapList:W,scrollTo:U,selectedScrollSnap:Q,slideNodes:te,slidesInView:de,slidesNotInView:ee};return D(e,n),setTimeout(()=>l.emit("init"),0),H}qe.globalOptions=void 0;function Ze(t={},e=[]){const n=b.useRef(t),r=b.useRef(e),[i,a]=b.useState(),[o,u]=b.useState(),l=b.useCallback(()=>{i&&i.reInit(n.current,r.current)},[i]);return b.useEffect(()=>{Ue(n.current,t)||(n.current=t,l())},[t,l]),b.useEffect(()=>{$s(r.current,e)||(r.current=e,l())},[e,l]),b.useEffect(()=>{if(Rs()&&o){qe.globalOptions=Ze.globalOptions;const c=qe(o,n.current,r.current);return a(c),()=>c.destroy()}else a(void 0)},[o,a]),[u,i]}Ze.globalOptions=void 0;const Is=b.createContext(null);function Be(){const t=b.useContext(Is);if(!t)throw new Error("useCarousel must be used within a <Carousel />");return t}const O=b.forwardRef(({orientation:t="horizontal",opts:e,setApi:n,plugins:r,className:i,children:a,...o},u)=>{const[l,c]=Ze({...e,axis:t==="horizontal"?"x":"y"},r),[g,p]=b.useState(!1),[f,C]=b.useState(!1),d=b.useCallback(h=>{h&&(p(h.canScrollPrev()),C(h.canScrollNext()))},[]),x=b.useCallback(()=>{c==null||c.scrollPrev()},[c]),v=b.useCallback(()=>{c==null||c.scrollNext()},[c]),m=b.useCallback(h=>{h.key==="ArrowLeft"?(h.preventDefault(),x()):h.key==="ArrowRight"&&(h.preventDefault(),v())},[x,v]);return b.useEffect(()=>{!c||!n||n(c)},[c,n]),b.useEffect(()=>{if(c)return d(c),c.on("reInit",d),c.on("select",d),()=>{c==null||c.off("select",d)}},[c,d]),s.jsx(Is.Provider,{value:{carouselRef:l,api:c,opts:e,orientation:t||((e==null?void 0:e.axis)==="y"?"vertical":"horizontal"),scrollPrev:x,scrollNext:v,canScrollPrev:g,canScrollNext:f},children:s.jsx("div",{ref:u,onKeyDownCapture:m,className:Oe("relative",i),role:"region","aria-roledescription":"carousel",...o,children:a})})});O.displayName="Carousel";const z=b.forwardRef(({className:t,...e},n)=>{const{carouselRef:r,orientation:i}=Be();return s.jsx("div",{ref:r,className:"overflow-hidden",children:s.jsx("div",{ref:n,className:Oe("flex",i==="horizontal"?"-ml-4":"-mt-4 flex-col",t),...e})})});z.displayName="CarouselContent";const M=b.forwardRef(({className:t,...e},n)=>{const{orientation:r}=Be();return s.jsx("div",{ref:n,role:"group","aria-roledescription":"slide",className:Oe("min-w-0 shrink-0 grow-0 basis-full",r==="horizontal"?"pl-4":"pt-4",t),...e})});M.displayName="CarouselItem";const V=b.forwardRef(({className:t,variant:e="outline",size:n="icon",...r},i)=>{const{orientation:a,scrollPrev:o,canScrollPrev:u}=Be();return s.jsxs(le,{ref:i,variant:e,size:n,className:Oe("absolute  h-8 w-8 rounded-full",a==="horizontal"?"-left-12 top-1/2 -translate-y-1/2":"-top-12 left-1/2 -translate-x-1/2 rotate-90",t),disabled:!u,onClick:o,...r,children:[s.jsx(Bs,{className:"h-4 w-4"}),s.jsx("span",{className:"sr-only",children:"Previous slide"})]})});V.displayName="CarouselPrevious";const R=b.forwardRef(({className:t,variant:e="outline",size:n="icon",...r},i)=>{const{orientation:a,scrollNext:o,canScrollNext:u}=Be();return s.jsxs(le,{ref:i,variant:e,size:n,className:Oe("absolute h-8 w-8 rounded-full",a==="horizontal"?"-right-12 top-1/2 -translate-y-1/2":"-bottom-12 left-1/2 -translate-x-1/2 rotate-90",t),disabled:!u,onClick:o,...r,children:[s.jsx(qs,{className:"h-4 w-4"}),s.jsx("span",{className:"sr-only",children:"Next slide"})]})});R.displayName="CarouselNext";try{O.displayName="Carousel",O.__docgenInfo={description:"",displayName:"Carousel",props:{opts:{defaultValue:null,description:"",name:"opts",required:!1,type:{name:"Partial<OptionsType>"}},plugins:{defaultValue:null,description:"",name:"plugins",required:!1,type:{name:"CreatePluginType<LoosePluginType, {}>[]"}},orientation:{defaultValue:{value:"horizontal"},description:"",name:"orientation",required:!1,type:{name:"enum",value:[{value:'"horizontal"'},{value:'"vertical"'}]}},setApi:{defaultValue:null,description:"",name:"setApi",required:!1,type:{name:"((api: EmblaCarouselType) => void)"}}}}}catch{}try{z.displayName="CarouselContent",z.__docgenInfo={description:"",displayName:"CarouselContent",props:{}}}catch{}try{M.displayName="CarouselItem",M.__docgenInfo={description:"",displayName:"CarouselItem",props:{}}}catch{}try{V.displayName="CarouselPrevious",V.__docgenInfo={description:"",displayName:"CarouselPrevious",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}},size:{defaultValue:{value:"icon"},description:"",name:"size",required:!1,type:{name:'"default" | "sm" | "lg" | "icon" | null'}},variant:{defaultValue:{value:"outline"},description:"",name:"variant",required:!1,type:{name:'"link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null'}}}}}catch{}try{R.displayName="CarouselNext",R.__docgenInfo={description:"",displayName:"CarouselNext",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean"}},size:{defaultValue:{value:"icon"},description:"",name:"size",required:!1,type:{name:'"default" | "sm" | "lg" | "icon" | null'}},variant:{defaultValue:{value:"outline"},description:"",name:"variant",required:!1,type:{name:'"link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null'}}}}}catch{}const Dn={title:"Tier 1: Primitives/shadcn/Carousel",component:O,parameters:{layout:"centered",docs:{description:{component:"A carousel/slider component built on Embla Carousel with support for touch, keyboard, and mouse interactions. Supports horizontal and vertical orientations, looping, alignment options, and responsive layouts."}}},tags:["autodocs"]},ge={render:()=>s.jsxs(O,{className:"w-full max-w-xs",children:[s.jsx(z,{children:Array.from({length:5}).map((t,e)=>s.jsx(M,{children:s.jsx("div",{className:"p-1",children:s.jsx(G,{className:"border-2 border-slate-200",children:s.jsx("div",{className:"flex aspect-square items-center justify-center p-6",children:s.jsx("span",{className:"text-4xl font-semibold",children:e+1})})})})},e))}),s.jsx(V,{}),s.jsx(R,{})]})},ve={render:()=>s.jsxs(O,{orientation:"vertical",className:"w-full max-w-xs",children:[s.jsx(z,{className:"h-[400px]",children:Array.from({length:5}).map((t,e)=>s.jsx(M,{children:s.jsx("div",{className:"p-1",children:s.jsx(G,{className:"border-2 border-slate-200",children:s.jsx("div",{className:"flex aspect-square items-center justify-center p-6",children:s.jsx("span",{className:"text-4xl font-semibold",children:e+1})})})})},e))}),s.jsx(V,{}),s.jsx(R,{})]})},Ne={render:()=>s.jsxs(O,{opts:{loop:!0},className:"w-full max-w-xs",children:[s.jsx(z,{children:Array.from({length:5}).map((t,e)=>s.jsx(M,{children:s.jsx("div",{className:"p-1",children:s.jsx(G,{className:"border-2 border-slate-200",children:s.jsxs("div",{className:"flex aspect-square items-center justify-center p-6",children:[s.jsxs("span",{className:"text-3xl font-semibold",children:["Slide ",e+1]}),s.jsx("span",{className:"absolute bottom-4 text-xs text-muted-foreground",children:"Loop enabled"})]})})})},e))}),s.jsx(V,{}),s.jsx(R,{})]})},Ce={render:()=>s.jsxs(O,{opts:{align:"center",loop:!0},className:"w-full max-w-sm",children:[s.jsx(z,{children:Array.from({length:7}).map((t,e)=>s.jsx(M,{className:"basis-4/5",children:s.jsx("div",{className:"p-1",children:s.jsx(G,{className:"border-2 border-slate-200",children:s.jsx("div",{className:"flex aspect-square items-center justify-center p-6",children:s.jsx("span",{className:"text-3xl font-semibold",children:e+1})})})})},e))}),s.jsx(V,{}),s.jsx(R,{})]})},ye={render:()=>s.jsxs(O,{className:"w-full max-w-4xl",children:[s.jsx(z,{className:"-ml-2 md:-ml-4",children:Array.from({length:9}).map((t,e)=>s.jsx(M,{className:"pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3",children:s.jsx("div",{className:"p-1",children:s.jsx(G,{className:"border-2 border-slate-200",children:s.jsx("div",{className:"flex aspect-square items-center justify-center p-6",children:s.jsxs("span",{className:"text-2xl font-semibold",children:["Item ",e+1]})})})})},e))}),s.jsx(V,{}),s.jsx(R,{})]})},be={render:()=>{const t=()=>{const[e,n]=b.useState(),[r,i]=b.useState(0),[a,o]=b.useState(0);return b.useEffect(()=>{e&&(o(e.scrollSnapList().length),i(e.selectedScrollSnap()),e.on("select",()=>{i(e.selectedScrollSnap())}))},[e]),s.jsxs("div",{className:"space-y-4",children:[s.jsxs(O,{setApi:n,className:"w-full max-w-xs",children:[s.jsx(z,{children:Array.from({length:5}).map((u,l)=>s.jsx(M,{children:s.jsx("div",{className:"p-1",children:s.jsx(G,{className:"border-2 border-slate-200",children:s.jsx("div",{className:"flex aspect-square items-center justify-center p-6",children:s.jsx("span",{className:"text-4xl font-semibold",children:l+1})})})})},l))}),s.jsx(V,{}),s.jsx(R,{})]}),s.jsx("div",{className:"flex justify-center gap-2",children:Array.from({length:a}).map((u,l)=>s.jsx("button",{className:`h-2 w-2 rounded-full transition-all ${l===r?"bg-slate-900 w-8":"bg-slate-300 hover:bg-slate-400"}`,onClick:()=>e==null?void 0:e.scrollTo(l),"aria-label":`Go to slide ${l+1}`},l))}),s.jsxs("div",{className:"text-center text-sm text-muted-foreground",children:["Slide ",r+1," of ",a]})]})};return s.jsx(t,{})}},je={render:()=>{const t=()=>{const[e,n]=b.useState();return b.useEffect(()=>{if(!e)return;const r=setInterval(()=>{e.scrollNext()},3e3);return()=>clearInterval(r)},[e]),s.jsxs("div",{className:"space-y-2",children:[s.jsxs(O,{setApi:n,opts:{loop:!0},className:"w-full max-w-xs",children:[s.jsx(z,{children:Array.from({length:5}).map((r,i)=>s.jsx(M,{children:s.jsx("div",{className:"p-1",children:s.jsx(G,{className:"border-2 border-slate-200",children:s.jsx("div",{className:"flex aspect-square items-center justify-center p-6",children:s.jsxs("div",{className:"text-center",children:[s.jsx("span",{className:"text-4xl font-semibold",children:i+1}),s.jsx("p",{className:"mt-2 text-sm text-muted-foreground",children:"Auto-advances"})]})})})})},i))}),s.jsx(V,{}),s.jsx(R,{})]}),s.jsx("p",{className:"text-center text-xs text-muted-foreground",children:"Auto-play every 3 seconds (manual implementation)"})]})};return s.jsx(t,{})}},Se={render:()=>{const t=[{color:"#0ec2bc",title:"Turquoise Dream",desc:"Ocean waves at sunset"},{color:"#10b981",title:"Emerald Forest",desc:"Deep woodland paths"},{color:"#8b5cf6",title:"Violet Sky",desc:"Northern lights dance"},{color:"#f59e0b",title:"Amber Glow",desc:"Desert dunes at dawn"},{color:"#ec4899",title:"Rose Garden",desc:"Blooming in spring"}];return s.jsxs(O,{opts:{loop:!0},className:"w-full max-w-md",children:[s.jsx(z,{children:t.map((e,n)=>s.jsx(M,{children:s.jsx("div",{className:"p-1",children:s.jsxs(G,{className:"border-2 border-slate-200 overflow-hidden",children:[s.jsx("div",{className:"flex aspect-video items-center justify-center relative",style:{backgroundColor:e.color},children:s.jsx("span",{className:"text-white text-6xl font-bold opacity-30",children:n+1})}),s.jsxs("div",{className:"p-4 bg-white",children:[s.jsx("h3",{className:"font-semibold text-lg",children:e.title}),s.jsx("p",{className:"text-sm text-muted-foreground",children:e.desc})]})]})})},n))}),s.jsx(V,{}),s.jsx(R,{})]})}},we={render:()=>{const t=[{name:"Ocean Breeze",price:"$29.99",rating:4.5},{name:"Mountain Peak",price:"$34.99",rating:5},{name:"Forest Trail",price:"$24.99",rating:4},{name:"Desert Sun",price:"$39.99",rating:4.8},{name:"Arctic Ice",price:"$44.99",rating:4.7},{name:"Coral Reef",price:"$27.99",rating:4.3},{name:"Valley Mist",price:"$32.99",rating:4.6}];return s.jsxs("div",{className:"w-full max-w-5xl space-y-4",children:[s.jsxs("div",{className:"text-center",children:[s.jsx("h2",{className:"text-2xl font-bold",children:"Featured Products"}),s.jsx("p",{className:"text-muted-foreground",children:"Discover our latest collection"})]}),s.jsxs(O,{className:"w-full",children:[s.jsx(z,{className:"-ml-2 md:-ml-4",children:t.map((e,n)=>s.jsx(M,{className:"pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4",children:s.jsx("div",{className:"p-1",children:s.jsx(G,{className:"border-2 border-slate-200 hover:border-slate-300 transition-colors",children:s.jsxs("div",{className:"p-4 space-y-3",children:[s.jsx("div",{className:"aspect-square rounded-lg flex items-center justify-center text-white text-2xl font-bold",style:{backgroundColor:"#0ec2bc"},children:e.name.substring(0,2)}),s.jsxs("div",{children:[s.jsx("h3",{className:"font-semibold",children:e.name}),s.jsxs("div",{className:"flex items-center justify-between mt-2",children:[s.jsx("span",{className:"text-lg font-bold",style:{color:"#0ec2bc"},children:e.price}),s.jsxs("div",{className:"flex items-center gap-1",children:[s.jsx("span",{className:"text-yellow-500",children:"★"}),s.jsx("span",{className:"text-sm text-muted-foreground",children:e.rating})]})]})]}),s.jsx(le,{className:"w-full",variant:"outline",size:"sm",children:"Add to Cart"})]})})})},n))}),s.jsx(V,{}),s.jsx(R,{})]})]})}},Ie={render:()=>{const t=[{quote:"This product completely transformed how we work. Incredible results!",author:"Sarah Johnson",role:"CEO, TechCorp",avatar:"SJ"},{quote:"Outstanding quality and support. Highly recommended for any team.",author:"Michael Chen",role:"Designer, Creative Studio",avatar:"MC"},{quote:"Game-changer for our business. Couldn't be happier with the results.",author:"Emma Rodriguez",role:"Product Manager, StartupXYZ",avatar:"ER"},{quote:"Intuitive, powerful, and reliable. Everything we needed and more.",author:"David Kim",role:"CTO, Innovation Labs",avatar:"DK"}],e=()=>{const[n,r]=b.useState();return b.useEffect(()=>{if(!n)return;const i=setInterval(()=>{n.scrollNext()},5e3);return()=>clearInterval(i)},[n]),s.jsxs("div",{className:"w-full max-w-3xl space-y-4",children:[s.jsxs("div",{className:"text-center",children:[s.jsx("h2",{className:"text-2xl font-bold",children:"What Our Customers Say"}),s.jsx("p",{className:"text-muted-foreground",children:"Real feedback from real people"})]}),s.jsxs(O,{setApi:r,opts:{loop:!0,align:"center"},className:"w-full",children:[s.jsx(z,{children:t.map((i,a)=>s.jsx(M,{children:s.jsx("div",{className:"p-4",children:s.jsx(G,{className:"border-2 border-slate-200",children:s.jsxs("div",{className:"p-8 space-y-6",children:[s.jsxs("div",{className:"text-center",children:[s.jsx("svg",{className:"w-8 h-8 mx-auto mb-4 opacity-20",fill:"currentColor",viewBox:"0 0 24 24",children:s.jsx("path",{d:"M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"})}),s.jsx("p",{className:"text-lg italic",children:i.quote})]}),s.jsxs("div",{className:"flex items-center justify-center gap-4",children:[s.jsx("div",{className:"w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold",style:{backgroundColor:"#0ec2bc"},children:i.avatar}),s.jsxs("div",{className:"text-left",children:[s.jsx("p",{className:"font-semibold",children:i.author}),s.jsx("p",{className:"text-sm text-muted-foreground",children:i.role})]})]})]})})})},a))}),s.jsx(V,{}),s.jsx(R,{})]}),s.jsx("p",{className:"text-center text-xs text-muted-foreground",children:"Auto-advances every 5 seconds"})]})};return s.jsx(e,{})}},Ae={render:()=>{const t=[{icon:"🌊",title:"Ocean-Inspired",description:"Design flows like water"},{icon:"✨",title:"Cosmic Effects",description:"Stars guide your journey"},{icon:"🎨",title:"Elegant Design",description:"Beauty meets function"},{icon:"⚡",title:"Lightning Fast",description:"Performance optimized"},{icon:"🔒",title:"Secure by Default",description:"Your data is safe"}];return s.jsxs("div",{className:"w-full max-w-4xl space-y-6",children:[s.jsxs("div",{className:"text-center",children:[s.jsx("h2",{className:"text-3xl font-bold",style:{color:"#0ec2bc"},children:"Ozean Licht Features"}),s.jsx("p",{className:"text-muted-foreground mt-2",children:"Discover the magic of our platform"})]}),s.jsxs(O,{opts:{loop:!0},className:"w-full",children:[s.jsx(z,{className:"-ml-2 md:-ml-4",children:t.map((e,n)=>s.jsx(M,{className:"pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3",children:s.jsx("div",{className:"p-1",children:s.jsx(G,{className:"border-2 transition-all hover:shadow-lg",style:{borderColor:"#0ec2bc"},children:s.jsxs("div",{className:"p-6 space-y-4 text-center",children:[s.jsx("div",{className:"text-5xl",children:e.icon}),s.jsx("h3",{className:"text-xl font-semibold",style:{color:"#0ec2bc"},children:e.title}),s.jsx("p",{className:"text-sm text-muted-foreground",children:e.description})]})})})},n))}),s.jsx(V,{className:"border-2",style:{borderColor:"#0ec2bc",color:"#0ec2bc"}}),s.jsx(R,{className:"border-2",style:{borderColor:"#0ec2bc",color:"#0ec2bc"}})]}),s.jsxs("div",{className:"flex justify-center gap-2 text-sm text-muted-foreground",children:[s.jsx("span",{children:"Swipe"}),s.jsx("span",{children:"•"}),s.jsx("span",{children:"Drag"}),s.jsx("span",{children:"•"}),s.jsx("span",{children:"Arrow Keys"})]})]})}},Pe={render:()=>{const t=()=>{const[e,n]=b.useState(),[r,i]=b.useState(0),[a,o]=b.useState(0),[u,l]=b.useState(!1),[c,g]=b.useState(!1);return b.useEffect(()=>{e&&(o(e.scrollSnapList().length),i(e.selectedScrollSnap()),l(e.canScrollPrev()),g(e.canScrollNext()),e.on("select",()=>{i(e.selectedScrollSnap()),l(e.canScrollPrev()),g(e.canScrollNext())}))},[e]),s.jsxs("div",{className:"w-full max-w-md space-y-4",children:[s.jsx(O,{setApi:n,className:"w-full",children:s.jsx(z,{children:Array.from({length:7}).map((p,f)=>s.jsx(M,{children:s.jsx("div",{className:"p-1",children:s.jsx(G,{className:"border-2 border-slate-200",children:s.jsx("div",{className:"flex aspect-square items-center justify-center p-6",children:s.jsx("span",{className:"text-4xl font-semibold",children:f+1})})})})},f))})}),s.jsxs("div",{className:"space-y-3",children:[s.jsxs("div",{className:"flex justify-between items-center",children:[s.jsx(le,{variant:"outline",size:"sm",onClick:()=>e==null?void 0:e.scrollPrev(),disabled:!u,children:"Previous"}),s.jsxs("span",{className:"text-sm font-medium",children:[r+1," / ",a]}),s.jsx(le,{variant:"outline",size:"sm",onClick:()=>e==null?void 0:e.scrollNext(),disabled:!c,children:"Next"})]}),s.jsxs("div",{className:"flex gap-2",children:[s.jsx(le,{variant:"outline",size:"sm",className:"flex-1",onClick:()=>e==null?void 0:e.scrollTo(0),children:"First"}),s.jsx(le,{variant:"outline",size:"sm",className:"flex-1",onClick:()=>e==null?void 0:e.scrollTo(a-1),children:"Last"})]}),s.jsx("div",{className:"flex gap-1",children:Array.from({length:a}).map((p,f)=>s.jsx("button",{className:`flex-1 h-1 rounded transition-colors ${f===r?"bg-slate-900":"bg-slate-300"}`,onClick:()=>e==null?void 0:e.scrollTo(f),"aria-label":`Go to slide ${f+1}`},f))})]})]})};return s.jsx(t,{})}},Ee={render:()=>s.jsxs("div",{className:"w-full max-w-2xl space-y-2",children:[s.jsx(O,{opts:{dragFree:!0,containScroll:"trimSnaps"},className:"w-full",children:s.jsx(z,{className:"-ml-2",children:Array.from({length:15}).map((t,e)=>s.jsx(M,{className:"pl-2 basis-1/4",children:s.jsx("div",{className:"p-1",children:s.jsx(G,{className:"border-2 border-slate-200",children:s.jsx("div",{className:"flex aspect-square items-center justify-center p-4",children:s.jsx("span",{className:"text-xl font-semibold",children:e+1})})})})},e))})}),s.jsx("p",{className:"text-center text-xs text-muted-foreground",children:"Drag freely without snap points"})]})};var mt,ft,pt,xt,ht;ge.parameters={...ge.parameters,docs:{...(mt=ge.parameters)==null?void 0:mt.docs,source:{originalSource:`{
  render: () => <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({
        length: 5
      }).map((_, index) => <CarouselItem key={index}>
            <div className="p-1">
              <Card className="border-2 border-slate-200">
                <div className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </div>
              </Card>
            </div>
          </CarouselItem>)}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
}`,...(pt=(ft=ge.parameters)==null?void 0:ft.docs)==null?void 0:pt.source},description:{story:`Default horizontal carousel.

Basic carousel with horizontal orientation showing numbered slides.`,...(ht=(xt=ge.parameters)==null?void 0:xt.docs)==null?void 0:ht.description}}};var gt,vt,Nt,Ct,yt;ve.parameters={...ve.parameters,docs:{...(gt=ve.parameters)==null?void 0:gt.docs,source:{originalSource:`{
  render: () => <Carousel orientation="vertical" className="w-full max-w-xs">
      <CarouselContent className="h-[400px]">
        {Array.from({
        length: 5
      }).map((_, index) => <CarouselItem key={index}>
            <div className="p-1">
              <Card className="border-2 border-slate-200">
                <div className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </div>
              </Card>
            </div>
          </CarouselItem>)}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
}`,...(Nt=(vt=ve.parameters)==null?void 0:vt.docs)==null?void 0:Nt.source},description:{story:`Vertical orientation carousel.

Carousel with vertical scrolling using arrow buttons rotated 90 degrees.`,...(yt=(Ct=ve.parameters)==null?void 0:Ct.docs)==null?void 0:yt.description}}};var bt,jt,St,wt,It;Ne.parameters={...Ne.parameters,docs:{...(bt=Ne.parameters)==null?void 0:bt.docs,source:{originalSource:`{
  render: () => <Carousel opts={{
    loop: true
  }} className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({
        length: 5
      }).map((_, index) => <CarouselItem key={index}>
            <div className="p-1">
              <Card className="border-2 border-slate-200">
                <div className="flex aspect-square items-center justify-center p-6">
                  <span className="text-3xl font-semibold">
                    Slide {index + 1}
                  </span>
                  <span className="absolute bottom-4 text-xs text-muted-foreground">
                    Loop enabled
                  </span>
                </div>
              </Card>
            </div>
          </CarouselItem>)}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
}`,...(St=(jt=Ne.parameters)==null?void 0:jt.docs)==null?void 0:St.source},description:{story:`Carousel with loop enabled.

Infinite looping allows continuous navigation in both directions.`,...(It=(wt=Ne.parameters)==null?void 0:wt.docs)==null?void 0:It.description}}};var At,Pt,Et,kt,Lt;Ce.parameters={...Ce.parameters,docs:{...(At=Ce.parameters)==null?void 0:At.docs,source:{originalSource:`{
  render: () => <Carousel opts={{
    align: 'center',
    loop: true
  }} className="w-full max-w-sm">
      <CarouselContent>
        {Array.from({
        length: 7
      }).map((_, index) => <CarouselItem key={index} className="basis-4/5">
            <div className="p-1">
              <Card className="border-2 border-slate-200">
                <div className="flex aspect-square items-center justify-center p-6">
                  <span className="text-3xl font-semibold">{index + 1}</span>
                </div>
              </Card>
            </div>
          </CarouselItem>)}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
}`,...(Et=(Pt=Ce.parameters)==null?void 0:Pt.docs)==null?void 0:Et.source},description:{story:`Center-aligned carousel.

Slides are centered in the viewport with partial views of adjacent slides.`,...(Lt=(kt=Ce.parameters)==null?void 0:kt.docs)==null?void 0:Lt.description}}};var Tt,Dt,_t,Ot,zt;ye.parameters={...ye.parameters,docs:{...(Tt=ye.parameters)==null?void 0:Tt.docs,source:{originalSource:`{
  render: () => <Carousel className="w-full max-w-4xl">
      <CarouselContent className="-ml-2 md:-ml-4">
        {Array.from({
        length: 9
      }).map((_, index) => <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card className="border-2 border-slate-200">
                <div className="flex aspect-square items-center justify-center p-6">
                  <span className="text-2xl font-semibold">Item {index + 1}</span>
                </div>
              </Card>
            </div>
          </CarouselItem>)}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
}`,...(_t=(Dt=ye.parameters)==null?void 0:Dt.docs)==null?void 0:_t.source},description:{story:`Multiple items per view.

Responsive carousel showing 1 item on mobile, 2 on tablets, 3 on desktop.`,...(zt=(Ot=ye.parameters)==null?void 0:Ot.docs)==null?void 0:zt.description}}};var Mt,qt,Ft,Bt,Vt;be.parameters={...be.parameters,docs:{...(Mt=be.parameters)==null?void 0:Mt.docs,source:{originalSource:`{
  render: () => {
    const IndicatorCarousel = () => {
      const [api, setApi] = useState<CarouselApi>();
      const [current, setCurrent] = useState(0);
      const [count, setCount] = useState(0);
      useEffect(() => {
        if (!api) {
          return;
        }
        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());
        api.on('select', () => {
          setCurrent(api.selectedScrollSnap());
        });
      }, [api]);
      return <div className="space-y-4">
          <Carousel setApi={setApi} className="w-full max-w-xs">
            <CarouselContent>
              {Array.from({
              length: 5
            }).map((_, index) => <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="border-2 border-slate-200">
                      <div className="flex aspect-square items-center justify-center p-6">
                        <span className="text-4xl font-semibold">{index + 1}</span>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>)}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2">
            {Array.from({
            length: count
          }).map((_, index) => <button key={index} className={\`h-2 w-2 rounded-full transition-all \${index === current ? 'bg-slate-900 w-8' : 'bg-slate-300 hover:bg-slate-400'}\`} onClick={() => api?.scrollTo(index)} aria-label={\`Go to slide \${index + 1}\`} />)}
          </div>

          {/* Counter */}
          <div className="text-center text-sm text-muted-foreground">
            Slide {current + 1} of {count}
          </div>
        </div>;
    };
    return <IndicatorCarousel />;
  }
}`,...(Ft=(qt=be.parameters)==null?void 0:qt.docs)==null?void 0:Ft.source},description:{story:`Carousel with custom indicators.

Shows current slide position with dots indicator using carousel API.`,...(Vt=(Bt=be.parameters)==null?void 0:Bt.docs)==null?void 0:Vt.description}}};var Rt,$t,Gt,Ht,Kt;je.parameters={...je.parameters,docs:{...(Rt=je.parameters)==null?void 0:Rt.docs,source:{originalSource:`{
  render: () => {
    const AutoPlayCarousel = () => {
      const [api, setApi] = useState<CarouselApi>();
      useEffect(() => {
        if (!api) {
          return;
        }
        const intervalId = setInterval(() => {
          api.scrollNext();
        }, 3000);
        return () => clearInterval(intervalId);
      }, [api]);
      return <div className="space-y-2">
          <Carousel setApi={setApi} opts={{
          loop: true
        }} className="w-full max-w-xs">
            <CarouselContent>
              {Array.from({
              length: 5
            }).map((_, index) => <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="border-2 border-slate-200">
                      <div className="flex aspect-square items-center justify-center p-6">
                        <div className="text-center">
                          <span className="text-4xl font-semibold">{index + 1}</span>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Auto-advances
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>)}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <p className="text-center text-xs text-muted-foreground">
            Auto-play every 3 seconds (manual implementation)
          </p>
        </div>;
    };
    return <AutoPlayCarousel />;
  }
}`,...(Gt=($t=je.parameters)==null?void 0:$t.docs)==null?void 0:Gt.source},description:{story:`Auto-play carousel.

Automatically advances slides every 3 seconds with loop enabled.
Note: For production autoplay with plugins, install embla-carousel-autoplay.`,...(Kt=(Ht=je.parameters)==null?void 0:Ht.docs)==null?void 0:Kt.description}}};var Jt,Ut,Yt,Qt,Xt;Se.parameters={...Se.parameters,docs:{...(Jt=Se.parameters)==null?void 0:Jt.docs,source:{originalSource:`{
  render: () => {
    const images = [{
      color: '#0ec2bc',
      title: 'Turquoise Dream',
      desc: 'Ocean waves at sunset'
    }, {
      color: '#10b981',
      title: 'Emerald Forest',
      desc: 'Deep woodland paths'
    }, {
      color: '#8b5cf6',
      title: 'Violet Sky',
      desc: 'Northern lights dance'
    }, {
      color: '#f59e0b',
      title: 'Amber Glow',
      desc: 'Desert dunes at dawn'
    }, {
      color: '#ec4899',
      title: 'Rose Garden',
      desc: 'Blooming in spring'
    }];
    return <Carousel opts={{
      loop: true
    }} className="w-full max-w-md">
        <CarouselContent>
          {images.map((image, index) => <CarouselItem key={index}>
              <div className="p-1">
                <Card className="border-2 border-slate-200 overflow-hidden">
                  <div className="flex aspect-video items-center justify-center relative" style={{
                backgroundColor: image.color
              }}>
                    <span className="text-white text-6xl font-bold opacity-30">
                      {index + 1}
                    </span>
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="font-semibold text-lg">{image.title}</h3>
                    <p className="text-sm text-muted-foreground">{image.desc}</p>
                  </div>
                </Card>
              </div>
            </CarouselItem>)}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>;
  }
}`,...(Yt=(Ut=Se.parameters)==null?void 0:Ut.docs)==null?void 0:Yt.source},description:{story:`Image gallery carousel.

Carousel optimized for displaying images with descriptions.`,...(Xt=(Qt=Se.parameters)==null?void 0:Qt.docs)==null?void 0:Xt.description}}};var Zt,Wt,es,ts,ss;we.parameters={...we.parameters,docs:{...(Zt=we.parameters)==null?void 0:Zt.docs,source:{originalSource:`{
  render: () => {
    const products = [{
      name: 'Ocean Breeze',
      price: '$29.99',
      rating: 4.5
    }, {
      name: 'Mountain Peak',
      price: '$34.99',
      rating: 5.0
    }, {
      name: 'Forest Trail',
      price: '$24.99',
      rating: 4.0
    }, {
      name: 'Desert Sun',
      price: '$39.99',
      rating: 4.8
    }, {
      name: 'Arctic Ice',
      price: '$44.99',
      rating: 4.7
    }, {
      name: 'Coral Reef',
      price: '$27.99',
      rating: 4.3
    }, {
      name: 'Valley Mist',
      price: '$32.99',
      rating: 4.6
    }];
    return <div className="w-full max-w-5xl space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <p className="text-muted-foreground">Discover our latest collection</p>
        </div>

        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {products.map((product, index) => <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div className="p-1">
                  <Card className="border-2 border-slate-200 hover:border-slate-300 transition-colors">
                    <div className="p-4 space-y-3">
                      {/* Product image placeholder */}
                      <div className="aspect-square rounded-lg flex items-center justify-center text-white text-2xl font-bold" style={{
                    backgroundColor: '#0ec2bc'
                  }}>
                        {product.name.substring(0, 2)}
                      </div>

                      {/* Product details */}
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold" style={{
                        color: '#0ec2bc'
                      }}>
                            {product.price}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm text-muted-foreground">
                              {product.rating}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button className="w-full" variant="outline" size="sm">
                        Add to Cart
                      </Button>
                    </div>
                  </Card>
                </div>
              </CarouselItem>)}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>;
  }
}`,...(es=(Wt=we.parameters)==null?void 0:Wt.docs)==null?void 0:es.source},description:{story:`Product showcase carousel.

E-commerce style product carousel with multiple items and responsive layout.`,...(ss=(ts=we.parameters)==null?void 0:ts.docs)==null?void 0:ss.description}}};var ns,rs,os,as,is;Ie.parameters={...Ie.parameters,docs:{...(ns=Ie.parameters)==null?void 0:ns.docs,source:{originalSource:`{
  render: () => {
    const testimonials = [{
      quote: 'This product completely transformed how we work. Incredible results!',
      author: 'Sarah Johnson',
      role: 'CEO, TechCorp',
      avatar: 'SJ'
    }, {
      quote: 'Outstanding quality and support. Highly recommended for any team.',
      author: 'Michael Chen',
      role: 'Designer, Creative Studio',
      avatar: 'MC'
    }, {
      quote: 'Game-changer for our business. Couldn\\'t be happier with the results.',
      author: 'Emma Rodriguez',
      role: 'Product Manager, StartupXYZ',
      avatar: 'ER'
    }, {
      quote: 'Intuitive, powerful, and reliable. Everything we needed and more.',
      author: 'David Kim',
      role: 'CTO, Innovation Labs',
      avatar: 'DK'
    }];
    const TestimonialCarouselComponent = () => {
      const [api, setApi] = useState<CarouselApi>();
      useEffect(() => {
        if (!api) {
          return;
        }
        const intervalId = setInterval(() => {
          api.scrollNext();
        }, 5000);
        return () => clearInterval(intervalId);
      }, [api]);
      return <div className="w-full max-w-3xl space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold">What Our Customers Say</h2>
            <p className="text-muted-foreground">Real feedback from real people</p>
          </div>

          <Carousel setApi={setApi} opts={{
          loop: true,
          align: 'center'
        }} className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial, index) => <CarouselItem key={index}>
                  <div className="p-4">
                    <Card className="border-2 border-slate-200">
                      <div className="p-8 space-y-6">
                        {/* Quote */}
                        <div className="text-center">
                          <svg className="w-8 h-8 mx-auto mb-4 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                          </svg>
                          <p className="text-lg italic">{testimonial.quote}</p>
                        </div>

                        {/* Author */}
                        <div className="flex items-center justify-center gap-4">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold" style={{
                        backgroundColor: '#0ec2bc'
                      }}>
                            {testimonial.avatar}
                          </div>
                          <div className="text-left">
                            <p className="font-semibold">{testimonial.author}</p>
                            <p className="text-sm text-muted-foreground">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>)}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <p className="text-center text-xs text-muted-foreground">
            Auto-advances every 5 seconds
          </p>
        </div>;
    };
    return <TestimonialCarouselComponent />;
  }
}`,...(os=(rs=Ie.parameters)==null?void 0:rs.docs)==null?void 0:os.source},description:{story:`Testimonial carousel.

Customer testimonials with autoplay and center alignment.`,...(is=(as=Ie.parameters)==null?void 0:as.docs)==null?void 0:is.description}}};var ls,cs,us,ds,ms;Ae.parameters={...Ae.parameters,docs:{...(ls=Ae.parameters)==null?void 0:ls.docs,source:{originalSource:`{
  render: () => {
    const features = [{
      icon: '🌊',
      title: 'Ocean-Inspired',
      description: 'Design flows like water'
    }, {
      icon: '✨',
      title: 'Cosmic Effects',
      description: 'Stars guide your journey'
    }, {
      icon: '🎨',
      title: 'Elegant Design',
      description: 'Beauty meets function'
    }, {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Performance optimized'
    }, {
      icon: '🔒',
      title: 'Secure by Default',
      description: 'Your data is safe'
    }];
    return <div className="w-full max-w-4xl space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold" style={{
          color: '#0ec2bc'
        }}>
            Ozean Licht Features
          </h2>
          <p className="text-muted-foreground mt-2">
            Discover the magic of our platform
          </p>
        </div>

        <Carousel opts={{
        loop: true
      }} className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {features.map((feature, index) => <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="border-2 transition-all hover:shadow-lg" style={{
                borderColor: '#0ec2bc'
              }}>
                    <div className="p-6 space-y-4 text-center">
                      <div className="text-5xl">{feature.icon}</div>
                      <h3 className="text-xl font-semibold" style={{
                    color: '#0ec2bc'
                  }}>
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </Card>
                </div>
              </CarouselItem>)}
          </CarouselContent>
          <CarouselPrevious className="border-2" style={{
          borderColor: '#0ec2bc',
          color: '#0ec2bc'
        }} />
          <CarouselNext className="border-2" style={{
          borderColor: '#0ec2bc',
          color: '#0ec2bc'
        }} />
        </Carousel>

        <div className="flex justify-center gap-2 text-sm text-muted-foreground">
          <span>Swipe</span>
          <span>•</span>
          <span>Drag</span>
          <span>•</span>
          <span>Arrow Keys</span>
        </div>
      </div>;
  }
}`,...(us=(cs=Ae.parameters)==null?void 0:cs.docs)==null?void 0:us.source},description:{story:`Ozean Licht themed carousel.

Carousel with Ozean Licht turquoise (#0ec2bc) accent colors and branding.`,...(ms=(ds=Ae.parameters)==null?void 0:ds.docs)==null?void 0:ms.description}}};var fs,ps,xs,hs,gs;Pe.parameters={...Pe.parameters,docs:{...(fs=Pe.parameters)==null?void 0:fs.docs,source:{originalSource:`{
  render: () => {
    const ControlledCarouselComponent = () => {
      const [api, setApi] = useState<CarouselApi>();
      const [current, setCurrent] = useState(0);
      const [count, setCount] = useState(0);
      const [canScrollPrev, setCanScrollPrev] = useState(false);
      const [canScrollNext, setCanScrollNext] = useState(false);
      useEffect(() => {
        if (!api) {
          return;
        }
        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());
        setCanScrollPrev(api.canScrollPrev());
        setCanScrollNext(api.canScrollNext());
        api.on('select', () => {
          setCurrent(api.selectedScrollSnap());
          setCanScrollPrev(api.canScrollPrev());
          setCanScrollNext(api.canScrollNext());
        });
      }, [api]);
      return <div className="w-full max-w-md space-y-4">
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
              {Array.from({
              length: 7
            }).map((_, index) => <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="border-2 border-slate-200">
                      <div className="flex aspect-square items-center justify-center p-6">
                        <span className="text-4xl font-semibold">{index + 1}</span>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>)}
            </CarouselContent>
          </Carousel>

          {/* Custom controls */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm" onClick={() => api?.scrollPrev()} disabled={!canScrollPrev}>
                Previous
              </Button>

              <span className="text-sm font-medium">
                {current + 1} / {count}
              </span>

              <Button variant="outline" size="sm" onClick={() => api?.scrollNext()} disabled={!canScrollNext}>
                Next
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => api?.scrollTo(0)}>
                First
              </Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={() => api?.scrollTo(count - 1)}>
                Last
              </Button>
            </div>

            <div className="flex gap-1">
              {Array.from({
              length: count
            }).map((_, index) => <button key={index} className={\`flex-1 h-1 rounded transition-colors \${index === current ? 'bg-slate-900' : 'bg-slate-300'}\`} onClick={() => api?.scrollTo(index)} aria-label={\`Go to slide \${index + 1}\`} />)}
            </div>
          </div>
        </div>;
    };
    return <ControlledCarouselComponent />;
  }
}`,...(xs=(ps=Pe.parameters)==null?void 0:ps.docs)==null?void 0:xs.source},description:{story:`Controlled carousel API.

Demonstrates programmatic control using the Carousel API with custom controls.`,...(gs=(hs=Pe.parameters)==null?void 0:hs.docs)==null?void 0:gs.description}}};var vs,Ns,Cs,ys,bs;Ee.parameters={...Ee.parameters,docs:{...(vs=Ee.parameters)==null?void 0:vs.docs,source:{originalSource:`{
  render: () => <div className="w-full max-w-2xl space-y-2">
      <Carousel opts={{
      dragFree: true,
      containScroll: 'trimSnaps'
    }} className="w-full">
        <CarouselContent className="-ml-2">
          {Array.from({
          length: 15
        }).map((_, index) => <CarouselItem key={index} className="pl-2 basis-1/4">
              <div className="p-1">
                <Card className="border-2 border-slate-200">
                  <div className="flex aspect-square items-center justify-center p-4">
                    <span className="text-xl font-semibold">{index + 1}</span>
                  </div>
                </Card>
              </div>
            </CarouselItem>)}
        </CarouselContent>
      </Carousel>
      <p className="text-center text-xs text-muted-foreground">
        Drag freely without snap points
      </p>
    </div>
}`,...(Cs=(Ns=Ee.parameters)==null?void 0:Ns.docs)==null?void 0:Cs.source},description:{story:`Drag-free carousel.

Free-scrolling carousel without snap points for fluid dragging.`,...(bs=(ys=Ee.parameters)==null?void 0:ys.docs)==null?void 0:bs.description}}};const _n=["Default","VerticalOrientation","WithLoop","CenterAlign","MultipleItemsPerView","WithIndicators","AutoPlay","ImageGallery","ProductShowcase","TestimonialCarousel","OzeanLichtThemed","ControlledCarouselAPI","DragFree"];export{je as AutoPlay,Ce as CenterAlign,Pe as ControlledCarouselAPI,ge as Default,Ee as DragFree,Se as ImageGallery,ye as MultipleItemsPerView,Ae as OzeanLichtThemed,we as ProductShowcase,Ie as TestimonialCarousel,ve as VerticalOrientation,be as WithIndicators,Ne as WithLoop,_n as __namedExportsOrder,Dn as default};
