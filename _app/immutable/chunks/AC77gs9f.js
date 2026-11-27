import{c as Ft}from"./TDtrdbi3.js";function Hh(W,$e){for(var Ae=0;Ae<$e.length;Ae++){const ve=$e[Ae];if(typeof ve!="string"&&!Array.isArray(ve)){for(const Ee in ve)if(Ee!=="default"&&!(Ee in W)){const me=Object.getOwnPropertyDescriptor(ve,Ee);me&&Object.defineProperty(W,Ee,me.get?me:{enumerable:!0,get:()=>ve[Ee]})}}}return Object.freeze(Object.defineProperty(W,Symbol.toStringTag,{value:"Module"}))}var Ds={},Ua={},Sc;function Nc(){if(Sc)return Ua;Sc=1,Object.defineProperty(Ua,"__esModule",{value:!0}),Ua.baseAssetPath=void 0;const $e=typeof window<"u"&&typeof window.document<"u"?window.document.currentScript:null;let Ae="/";return $e&&(Ae=$e.src.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^/]+$/,"/")),Ua.baseAssetPath=Ae,Ua}var La={},Tc;function Ns(){if(Tc)return La;Tc=1,Object.defineProperty(La,"__esModule",{value:!0}),La.defaultModelFetcher=void 0;const W=$e=>fetch($e).then(Ae=>Ae.arrayBuffer());return La.defaultModelFetcher=W,La}var wr={},Na={},Ec;function Wa(){if(Ec)return Na;Ec=1,Object.defineProperty(Na,"__esModule",{value:!0}),Na.log=void 0;const W=$e=>Ae=>{console.log(`VAD | ${$e} >`,Ae)};return Na.log={error:W("error"),debug:W("debug"),warn:W("warn")},Na}var qa={},kc;function hn(){if(kc)return qa;kc=1,Object.defineProperty(qa,"__esModule",{value:!0}),qa.Message=void 0;var W;return function($e){$e.AudioFrame="AUDIO_FRAME",$e.SpeechStart="SPEECH_START",$e.VADMisfire="VAD_MISFIRE",$e.SpeechEnd="SPEECH_END",$e.SpeechStop="SPEECH_STOP",$e.SpeechRealStart="SPEECH_REAL_START",$e.FrameProcessed="FRAME_PROCESSED"}(W||(qa.Message=W={})),qa}var Ic;function qs(){if(Ic)return wr;Ic=1,Object.defineProperty(wr,"__esModule",{value:!0}),wr.FrameProcessor=wr.validateOptions=wr.defaultFrameProcessorOptions=void 0;const W=Wa(),$e=hn();wr.defaultFrameProcessorOptions={positiveSpeechThreshold:.3,negativeSpeechThreshold:.25,preSpeechPadMs:800,redemptionMs:1400,minSpeechMs:400,submitUserSpeechOnPause:!1};function Ae(ue){(ue.positiveSpeechThreshold<0||ue.positiveSpeechThreshold>1)&&W.log.error("positiveSpeechThreshold should be a number between 0 and 1"),(ue.negativeSpeechThreshold<0||ue.negativeSpeechThreshold>ue.positiveSpeechThreshold)&&W.log.error("negativeSpeechThreshold should be between 0 and positiveSpeechThreshold"),ue.preSpeechPadMs<0&&W.log.error("preSpeechPadMs should be positive"),ue.redemptionMs<0&&W.log.error("redemptionMs should be positive"),ue.minSpeechMs<0&&W.log.error("minSpeechMs should be positive")}wr.validateOptions=Ae;const ve=ue=>{const j=ue.reduce((Q,_e)=>(Q.push(Q.at(-1)+_e.length),Q),[0]),k=new Float32Array(j.at(-1));return ue.forEach((Q,_e)=>{const Se=j[_e];k.set(Q,Se)}),k};function Ee(ue,j){const k=Math.floor(ue.redemptionMs/j),Q=Math.floor(ue.preSpeechPadMs/j),_e=Math.floor(ue.minSpeechMs/j);return{redemptionFrames:k,preSpeechPadFrames:Q,minSpeechFrames:_e}}class me{constructor(j,k,Q,_e){this.modelProcessFunc=j,this.modelResetFunc=k,this.options=Q,this.msPerFrame=_e,this.speaking=!1,this.redemptionCounter=0,this.speechFrameCount=0,this.active=!1,this.speechRealStartFired=!1,this.setOptions=J=>{this.options={...this.options,...J};const{redemptionFrames:H,preSpeechPadFrames:Oe,minSpeechFrames:We}=Ee(this.options,this.msPerFrame);this.redemptionFrames=H,this.preSpeechPadFrames=Oe,this.minSpeechFrames=We},this.reset=()=>{this.speaking=!1,this.speechRealStartFired=!1,this.audioBuffer=[],this.modelResetFunc(),this.redemptionCounter=0,this.speechFrameCount=0},this.pause=J=>{this.active=!1,this.options.submitUserSpeechOnPause?this.endSegment(J):this.reset()},this.resume=()=>{this.active=!0},this.endSegment=J=>{const H=this.audioBuffer;this.audioBuffer=[];const Oe=this.speaking;if(this.reset(),Oe)if(H.reduce((xe,ge)=>ge.isSpeech?xe+1:xe,0)>=this.minSpeechFrames){const xe=ve(H.map(ge=>ge.frame));J({msg:$e.Message.SpeechEnd,audio:xe})}else J({msg:$e.Message.VADMisfire});return{}},this.process=async(J,H)=>{if(!this.active)return;const Oe=await this.modelProcessFunc(J),We=Oe.isSpeech>=this.options.positiveSpeechThreshold;if(H({probs:Oe,msg:$e.Message.FrameProcessed,frame:J}),this.audioBuffer.push({frame:J,isSpeech:We}),We&&(this.speechFrameCount++,this.redemptionCounter=0),We&&!this.speaking&&(this.speaking=!0,H({msg:$e.Message.SpeechStart})),this.speaking&&this.speechFrameCount===this.minSpeechFrames&&!this.speechRealStartFired&&(this.speechRealStartFired=!0,H({msg:$e.Message.SpeechRealStart})),Oe.isSpeech<this.options.negativeSpeechThreshold&&this.speaking&&++this.redemptionCounter>=this.redemptionFrames){this.redemptionCounter=0,this.speechFrameCount=0,this.speaking=!1,this.speechRealStartFired=!1;const xe=this.audioBuffer;if(this.audioBuffer=[],xe.reduce((ye,Le)=>Le.isSpeech?ye+1:ye,0)>=this.minSpeechFrames){const ye=ve(xe.map(Le=>Le.frame));H({msg:$e.Message.SpeechEnd,audio:ye})}else H({msg:$e.Message.VADMisfire})}if(!this.speaking){for(;this.audioBuffer.length>this.preSpeechPadFrames;)this.audioBuffer.shift();this.speechFrameCount=0}},this.audioBuffer=[];const{redemptionFrames:Se,preSpeechPadFrames:ce,minSpeechFrames:ie}=Ee(this.options,this.msPerFrame);this.redemptionFrames=Se,this.preSpeechPadFrames=ce,this.minSpeechFrames=ie,this.reset()}}return wr.FrameProcessor=me,wr}var _r={},Ps={exports:{}};/*!
 * ONNX Runtime Web v1.31.1
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */var zc;function Kh(){return zc||(zc=1,function(W,$e){var Ae=(()=>{var ve=Object.defineProperty,Ee=Object.getOwnPropertyDescriptor,me=Object.getOwnPropertyNames,ue=Object.prototype.hasOwnProperty,j=(e=>typeof Ft<"u"?Ft:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof Ft<"u"?Ft:t)[r]}):e)(function(e){if(typeof Ft<"u")return Ft.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),k=(e,t,r)=>()=>{if(r)throw r[0];try{return e&&(t=e(e=0)),t}catch(i){throw r=[i],i}},Q=(e,t)=>{for(var r in t)ve(e,r,{get:t[r],enumerable:!0})},_e=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of me(t))!ue.call(e,a)&&a!==r&&ve(e,a,{get:()=>t[a],enumerable:!(i=Ee(t,a))||i.enumerable});return e},Se=e=>_e(ve({},"__esModule",{value:!0}),e),ce,ie,J,H,Oe,We,xe,ge=k(()=>{"use strict";ce=new Map,ie=[],J=new WeakMap,H=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let i=ce.get(e);if(i===void 0)ce.set(e,{backend:t,priority:r});else{if(i.priority>r)return;if(i.priority===r&&i.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let a=ie.indexOf(e);a!==-1&&ie.splice(a,1);for(let n=0;n<ie.length;n++)if(ce.get(ie[n]).priority<=r){ie.splice(n,0,e);return}ie.push(e)}return}throw new TypeError("not a valid backend")},Oe=async e=>{let t=ce.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let r=!!t.initPromise;try{if(!r){let i=t.backend,a=J.get(i);t.initPromise=a?a.then(async()=>i.init(e),async()=>i.init(e)):i.init(e),J.set(i,t.initPromise)}return await t.initPromise,t.initialized=!0,t.backend}catch(i){return r||(t.error=`${i}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},We=async e=>{let t=e.executionProviders||[],r=t.map(u=>typeof u=="string"?u:u.name),i=r.length===0?ie:r,a,n=[],s=new Set;for(let u of i){let l=await Oe(u);typeof l=="string"?n.push({name:u,err:l}):(a||(a=l),a===l&&s.add(u))}if(!a)throw new Error(`no available backend found. ERR: ${n.map(u=>`[${u.name}] ${u.err}`).join(", ")}`);for(let{name:u,err:l}of n)r.includes(u)&&console.warn(`removing requested execution provider "${u}" from session options because it is not available: ${l}`);let o=t.filter(u=>s.has(typeof u=="string"?u:u.name));return[a,new Proxy(e,{get:(u,l)=>l==="executionProviders"?o:Reflect.get(u,l)})]},xe=async()=>{let e=[];for(let r of ie){if(typeof ce.get(r).backend.createLoraAdapterHandler!="function")continue;let i=await Oe(r);if(typeof i!="string")return i;e.push({name:r,err:i})}let t=e.length===0?"":` ERR: ${e.map(r=>`[${r.name}] ${r.err}`).join(", ")}`;throw new Error(`no available backend supports LoRA adapters.${t}`)}}),ye=k(()=>{"use strict";ge()}),Le,pt=k(()=>{"use strict";Le="1.31.1"}),je,we,ut=k(()=>{"use strict";pt(),je="warning",we={wasm:{},webgl:{},webgpu:{},versions:{common:Le},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);je=e}},get logLevel(){return je}},Object.defineProperty(we,"logLevel",{enumerable:!0})}),ee,ar=k(()=>{"use strict";ut(),ee=we}),mt,Vt,Xe,He,ze,rt,nr=k(()=>{"use strict";ut(),mt=(e,t)=>{(typeof we.trace>"u"?!we.wasm.trace:!we.trace)||console.timeStamp(`${e}::ORT::${t}`)},Vt=(e,t)=>{var a;let r=((a=new Error().stack)==null?void 0:a.split(/\r\n|\r|\n/g))||[],i=!1;for(let n=0;n<r.length;n++){if(i&&!r[n].includes("TRACE_FUNC")){let s=`FUNC_${e}::${r[n].trim().split(" ")[1]}`;t&&(s+=`::${t}`),mt("CPU",s);return}r[n].includes("TRACE_FUNC")&&(i=!0)}},Xe=e=>{(typeof we.trace>"u"?!we.wasm.trace:!we.trace)||Vt("BEGIN",e)},He=e=>{(typeof we.trace>"u"?!we.wasm.trace:!we.trace)||Vt("END",e)},ze=e=>{(typeof we.trace>"u"?!we.wasm.trace:!we.trace)||console.time(`ORT::${e}`)},rt=e=>{(typeof we.trace>"u"?!we.wasm.trace:!we.trace)||console.timeEnd(`ORT::${e}`)}}),Yt,Mi=k(()=>{"use strict";ge(),nr(),Yt=class qc{constructor(t,r){this.backend=t,this.handler=r}static async create(t){if(Xe(),typeof t!="string"&&!(t instanceof Uint8Array))throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let r=await xe(),i=await r.createLoraAdapterHandler(t);return He(),new qc(r,i)}async release(){return this.handler.dispose()}}}),Di,Pi,fn=k(()=>{"use strict";Di=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];let i=r.getContext("2d");if(i!=null){let a,n;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(a=e.dims[2],n=e.dims[3]):(a=e.dims[3],n=e.dims[2]);let s=(t==null?void 0:t.format)!==void 0?t.format:"RGB",o=t==null?void 0:t.norm,u,l;o===void 0||o.mean===void 0?u=[255,255,255,255]:typeof o.mean=="number"?u=[o.mean,o.mean,o.mean,o.mean]:(u=[o.mean[0],o.mean[1],o.mean[2],0],o.mean[3]!==void 0&&(u[3]=o.mean[3])),o===void 0||o.bias===void 0?l=[0,0,0,0]:typeof o.bias=="number"?l=[o.bias,o.bias,o.bias,o.bias]:(l=[o.bias[0],o.bias[1],o.bias[2],0],o.bias[3]!==void 0&&(l[3]=o.bias[3]));let d=n*a,c=0,h=d,g=d*2,m=-1;s==="RGBA"?(c=0,h=d,g=d*2,m=d*3):s==="RGB"?(c=0,h=d,g=d*2):s==="RBG"&&(c=0,g=d,h=d*2);for(let $=0;$<n;$++)for(let x=0;x<a;x++){let _=(e.data[c++]-l[0])*u[0],y=(e.data[h++]-l[1])*u[1],S=(e.data[g++]-l[2])*u[2],T=m===-1?255:(e.data[m++]-l[3])*u[3];i.fillStyle="rgba("+_+","+y+","+S+","+T+")",i.fillRect(x,$,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},Pi=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),i;if(r!=null){let a,n,s;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(a=e.dims[2],n=e.dims[1],s=e.dims[3]):(a=e.dims[3],n=e.dims[2],s=e.dims[1]);let o=t!==void 0&&t.format!==void 0?t.format:"RGB",u=t==null?void 0:t.norm,l,d;u===void 0||u.mean===void 0?l=[255,255,255,255]:typeof u.mean=="number"?l=[u.mean,u.mean,u.mean,u.mean]:(l=[u.mean[0],u.mean[1],u.mean[2],255],u.mean[3]!==void 0&&(l[3]=u.mean[3])),u===void 0||u.bias===void 0?d=[0,0,0,0]:typeof u.bias=="number"?d=[u.bias,u.bias,u.bias,u.bias]:(d=[u.bias[0],u.bias[1],u.bias[2],0],u.bias[3]!==void 0&&(d[3]=u.bias[3]));let c=n*a;if(t!==void 0&&(t.format!==void 0&&s===4&&t.format!=="RGBA"||s===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let h=4,g=0,m=1,$=2,x=3,_=0,y=c,S=c*2,T=-1;o==="RGBA"?(_=0,y=c,S=c*2,T=c*3):o==="RGB"?(_=0,y=c,S=c*2):o==="RBG"&&(_=0,S=c,y=c*2),i=r.createImageData(a,n);for(let E=0;E<n*a;g+=h,m+=h,$+=h,x+=h,E++)i.data[g]=(e.data[_++]-d[0])*l[0],i.data[m]=(e.data[y++]-d[1])*l[1],i.data[$]=(e.data[S++]-d[2])*l[2],i.data[x]=T===-1?255:(e.data[T++]-d[3])*l[3]}else throw new Error("Can not access image data");return i}}),sr,Ui,Li,Ni,qi,Fi,mn=k(()=>{"use strict";Br(),sr=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:i}=t,a=t.norm??{mean:255,bias:0},n,s;typeof a.mean=="number"?n=[a.mean,a.mean,a.mean,a.mean]:n=[a.mean[0],a.mean[1],a.mean[2],a.mean[3]??255],typeof a.bias=="number"?s=[a.bias,a.bias,a.bias,a.bias]:s=[a.bias[0],a.bias[1],a.bias[2],a.bias[3]??0];let o=t.format!==void 0?t.format:"RGBA",u=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",l=r*i,d=u==="RGBA"?new Float32Array(l*4):new Float32Array(l*3),c=4,h=0,g=1,m=2,$=3,x=0,_=l,y=l*2,S=-1;o==="RGB"&&(c=3,h=0,g=1,m=2,$=-1),u==="RGBA"?S=l*3:u==="RBG"?(x=0,y=l,_=l*2):u==="BGR"&&(y=0,_=l,x=l*2);for(let T=0;T<l;T++,h+=c,m+=c,g+=c,$+=c)d[x++]=(e[h]+s[0])/n[0],d[_++]=(e[g]+s[1])/n[1],d[y++]=(e[m]+s[2])/n[2],S!==-1&&$!==-1&&(d[S++]=(e[$]+s[3])/n[3]);return u==="RGBA"?new Fe("float32",d,[1,4,r,i]):new Fe("float32",d,[1,3,r,i])},Ui=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,i=typeof ImageData<"u"&&e instanceof ImageData,a=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,n=typeof e=="string",s,o=t??{},u=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},l=d=>typeof HTMLCanvasElement<"u"&&d instanceof HTMLCanvasElement||d instanceof OffscreenCanvas?d.getContext("2d"):null;if(r){let d=u();d.width=e.width,d.height=e.height;let c=l(d);if(c!=null){let h=e.height,g=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(h=t.resizedHeight,g=t.resizedWidth),t!==void 0){if(o=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");o.tensorFormat="RGBA",o.height=h,o.width=g}else o.tensorFormat="RGBA",o.height=h,o.width=g;c.drawImage(e,0,0),s=c.getImageData(0,0,g,h).data}else throw new Error("Can not access image data")}else if(i){let d,c;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(d=t.resizedHeight,c=t.resizedWidth):(d=e.height,c=e.width),t!==void 0&&(o=t),o.format="RGBA",o.height=d,o.width=c,t!==void 0){let h=u();h.width=c,h.height=d;let g=l(h);if(g!=null)g.putImageData(e,0,0),s=g.getImageData(0,0,c,d).data;else throw new Error("Can not access image data")}else s=e.data}else if(a){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let d=u();d.width=e.width,d.height=e.height;let c=l(d);if(c!=null){let h=e.height,g=e.width;return c.drawImage(e,0,0,g,h),s=c.getImageData(0,0,g,h).data,o.height=h,o.width=g,sr(s,o)}else throw new Error("Can not access image data")}else{if(n)return new Promise((d,c)=>{let h=u(),g=l(h);if(!e||!g)return c();let m=new Image;m.crossOrigin="Anonymous",m.src=e,m.onload=()=>{h.width=m.width,h.height=m.height,g.drawImage(m,0,0,h.width,h.height);let $=g.getImageData(0,0,h.width,h.height);o.height=h.height,o.width=h.width,d(sr($.data,o))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(s!==void 0)return sr(s,o);throw new Error("Input data provided is not supported - aborted tensor creation")},Li=(e,t)=>{let{width:r,height:i,download:a,dispose:n}=t,s=[1,i,r,4];return new Fe({location:"texture",type:"float32",texture:e,dims:s,download:a,dispose:n})},Ni=(e,t)=>{let{dataType:r,dims:i,download:a,dispose:n}=t;return new Fe({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:i,download:a,dispose:n})},qi=(e,t)=>{let{dataType:r,dims:i,download:a,dispose:n}=t;return new Fe({location:"ml-tensor",type:r??"float32",mlTensor:e,dims:i,download:a,dispose:n})},Fi=(e,t,r)=>new Fe({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})}),vt,Gt,Rr,Vi,gn=k(()=>{"use strict";vt=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),Gt=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),Rr=!1,Vi=()=>{if(!Rr){Rr=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.Float16Array,i=typeof r<"u"&&r.from;e&&(vt.set("int64",BigInt64Array),Gt.set(BigInt64Array,"int64")),t&&(vt.set("uint64",BigUint64Array),Gt.set(BigUint64Array,"uint64")),i?(vt.set("float16",r),Gt.set(r,"float16")):vt.set("float16",Uint16Array)}}}),Gi,Wi,yn=k(()=>{"use strict";Br(),Gi=e=>{let t=1;for(let r=0;r<e.length;r++){let i=e[r];if(typeof i!="number"||!Number.isSafeInteger(i))throw new TypeError(`dims[${r}] must be an integer, got: ${i}`);if(i<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${i}`);t*=i}return t},Wi=(e,t)=>{switch(e.location){case"cpu":return new Fe(e.type,e.data,t);case"cpu-pinned":return new Fe({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new Fe({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new Fe({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new Fe({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),Fe,Br=k(()=>{"use strict";fn(),mn(),gn(),yn(),Fe=class{constructor(e,t,r){Vi();let i,a;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,i=e.type,a=e.dims,e.location){case"cpu-pinned":{let s=vt.get(i);if(!s)throw new TypeError(`unsupported type "${i}" to create tensor from pinned buffer`);if(!(e.data instanceof s))throw new TypeError(`buffer should be of type ${s.name}`);this.cpuData=e.data;break}case"texture":{if(i!=="float32")throw new TypeError(`unsupported type "${i}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint64"&&i!=="int8"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let s,o;if(typeof e=="string")if(i=e,o=r,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");s=t}else{let u=vt.get(e);if(u===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&u===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${u.name} as data.`);e==="uint64"||e==="int64"?s=u.from(t,BigInt):s=u.from(t)}else if(t instanceof u)s=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")s=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&u!==Uint16Array)s=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${i} tensor's data must be type of ${u}`)}else if(o=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let u=typeof e[0];if(u==="string")i="string",s=e;else if(u==="boolean")i="bool",s=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${u}.`)}else if(e instanceof Uint8ClampedArray)i="uint8",s=Uint8Array.from(e);else{let u=Gt.get(e.constructor);if(u===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);i=u,s=e}if(o===void 0)o=[s.length];else if(!Array.isArray(o))throw new TypeError("A tensor's dims must be a number array");a=o,this.cpuData=s,this.dataLocation="cpu"}let n=Gi(a);if(this.cpuData&&n!==this.cpuData.length&&!((i==="uint4"||i==="int4")&&Math.ceil(n/2)===this.cpuData.length))throw new Error(`Tensor's size(${n}) does not match data length(${this.cpuData.length}).`);this.type=i,this.dims=a,this.size=n}static async fromImage(e,t){return Ui(e,t)}static fromTexture(e,t){return Li(e,t)}static fromGpuBuffer(e,t){return Ni(e,t)}static fromMLTensor(e,t){return qi(e,t)}static fromPinnedBuffer(e,t,r){return Fi(e,t,r)}toDataURL(e){return Di(this,e)}toImageData(e){return Pi(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return Wi(this,e)}}}),it,ji=k(()=>{"use strict";Br(),it=Fe}),Hi,wn=k(()=>{"use strict";ge(),Mi(),ji(),nr(),Hi=class Fc{constructor(t,r){this.handler=t,this.backend=r}async run(t,r,i){Xe(),ze("InferenceSession.run");let a={},n={};if(typeof t!="object"||t===null||t instanceof it||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let s=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(r instanceof it)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError("'fetches' cannot be an empty array.");s=!1;for(let d of r){if(typeof d!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(d)===-1)throw new RangeError(`'fetches' contains invalid output name: ${d}.`);a[d]=null}if(typeof i=="object"&&i!==null)n=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else{let d=!1,c=Object.getOwnPropertyNames(r);for(let h of this.outputNames)if(c.indexOf(h)!==-1){let g=r[h];(g===null||g instanceof it)&&(d=!0,s=!1,a[h]=g)}if(d){if(typeof i=="object"&&i!==null)n=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else n=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let d of this.inputNames)if(typeof t[d]>"u")throw new Error(`input '${d}' is missing in 'feeds'.`);if(s)for(let d of this.outputNames)a[d]=null;let o;if(n.activeLoraAdapters!==void 0){if(!Array.isArray(n.activeLoraAdapters))throw new TypeError("'activeLoraAdapters' must be an array.");o=n.activeLoraAdapters.map(d=>{if(!(d instanceof Yt))throw new TypeError("'activeLoraAdapters' must be an array of LoraAdapter objects.");if(d.backend!==this.backend)throw new Error("LoRA adapter was created by a different backend than the session.");return d.handler})}let u=await this.handler.run(t,a,n,o),l={};for(let d in u)if(Object.hasOwnProperty.call(u,d)){let c=u[d];c instanceof it?l[d]=c:l[d]=new it(c.type,c.data,c.dims)}return rt("InferenceSession.run"),He(),l}async release(){return this.handler.dispose()}static async create(t,r,i,a){Xe(),ze("InferenceSession.create");let n,s={};if(typeof t=="string"){if(n=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(n=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let d=t,c=0,h=t.byteLength;if(typeof r=="object"&&r!==null)s=r;else if(typeof r=="number"){if(c=r,!Number.isSafeInteger(c))throw new RangeError("'byteOffset' must be an integer.");if(c<0||c>=d.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${d.byteLength}).`);if(h=t.byteLength-c,typeof i=="number"){if(h=i,!Number.isSafeInteger(h))throw new RangeError("'byteLength' must be an integer.");if(h<=0||c+h>d.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${d.byteLength-c}].`);if(typeof a=="object"&&a!==null)s=a;else if(typeof a<"u")throw new TypeError("'options' must be an object.")}else if(typeof i<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");n=new Uint8Array(d,c,h)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[o,u]=await We(s),l=await o.createInferenceSessionHandler(n,u);return rt("InferenceSession.create"),He(),new Fc(l,o)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),Mr,_n=k(()=>{"use strict";wn(),Mr=Hi}),Dr,bn=k(()=>{"use strict";Mi(),Dr=Yt}),$n=k(()=>{"use strict"}),vn=k(()=>{"use strict"}),xn=k(()=>{"use strict"}),Sn=k(()=>{"use strict"}),Ki={};Q(Ki,{InferenceSession:()=>Mr,LoraAdapter:()=>Dr,TRACE:()=>mt,TRACE_EVENT_BEGIN:()=>ze,TRACE_EVENT_END:()=>rt,TRACE_FUNC_BEGIN:()=>Xe,TRACE_FUNC_END:()=>He,Tensor:()=>it,env:()=>ee,registerBackend:()=>H});var st=k(()=>{"use strict";ye(),ar(),_n(),bn(),ji(),$n(),vn(),nr(),xn(),Sn()}),Pr=k(()=>{"use strict"}),Zi={};Q(Zi,{default:()=>Qi});var Ur,Lr,Qi,Tn=k(()=>{"use strict";var e;nc(),Tt(),Gr(),Ur="ort-wasm-proxy-worker",Lr=((e=globalThis.self)==null?void 0:e.name)===Ur,Lr&&(self.onmessage=t=>{let{type:r,in:i}=t.data;try{switch(r){case"init-wasm":Hr(i.wasm).then(()=>{$s(i).then(()=>{postMessage({type:r})},a=>{postMessage({type:r,err:a})})},a=>{postMessage({type:r,err:a})});break;case"init-ep":{let{epName:a,env:n}=i;vs(n,a).then(()=>{postMessage({type:r})},s=>{postMessage({type:r,err:s})});break}case"copy-from":{let{buffer:a}=i,n=ln(a);postMessage({type:r,out:n});break}case"create":{let{model:a,options:n}=i;Ss(a,n).then(s=>{postMessage({type:r,out:s})},s=>{postMessage({type:r,err:s})});break}case"release":Ts(i),postMessage({type:r});break;case"run":{let{sessionId:a,inputIndices:n,inputs:s,outputIndices:o,options:u}=i;ks(a,n,s,o,new Array(o.length).fill(null),u).then(l=>{l.some(d=>d[3]!=="cpu")?postMessage({type:r,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:r,out:l},zs([...s,...l]))},l=>{postMessage({type:r,err:l})});break}case"end-profiling":Is(i),postMessage({type:r});break;default:}}catch(a){postMessage({type:r,err:a})}}),Qi=Lr?null:t=>new Worker(t??Ve,{type:"classic",name:Ur})}),Xi,Yi,Ve,Nr,or,Ji,ea,qr,ta,Fr,ra,Vr,ia,Gr=k(()=>{"use strict";Pr(),Xi=typeof location>"u"?void 0:location.origin,Yi=()=>{var e,t;return typeof document<"u"?(e=document.currentScript)==null?void 0:e.src:typeof self<"u"?(t=self.location)==null?void 0:t.href:void 0},Ve=Yi(),Nr=()=>{if(Ve&&!Ve.startsWith("blob:"))return Ve.substring(0,Ve.lastIndexOf("/")+1)},or=(e,t)=>{try{let r=t??Ve;return(r?new URL(e,r):new URL(e)).origin===Xi}catch{return!1}},Ji=(e,t)=>{let r=t??Ve;try{return(r?new URL(e,r):new URL(e)).href}catch{return}},ea=(e,t)=>`${t??"./"}${e}`,qr=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},ta=async e=>(await import(e)).default,Fr=(Tn(),Se(Zi)).default,ra=async()=>{if(!Ve)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(or(Ve))return[void 0,Fr()];let e=await qr(Ve);return[e,Fr(e)]},Vr=void 0,ia=async(e,t,r,i)=>{let a=Vr&&!(e||t);if(a)if(Ve)a=or(Ve)||i&&!r;else if(i&&!r)a=!0;else throw new Error("cannot determine the script source URL.");if(a)return[void 0,Vr];{let n="ort-wasm-simd-threaded.jsep.mjs",s=e??Ji(n,t),o=r&&s&&!or(s,t),u=o?await qr(s):s??ea(n,t);return[o?u:void 0,await ta(u)]}}}),Wr,ur,Wt,jr,aa,na,sa,Hr,ne,Tt=k(()=>{"use strict";Gr(),ur=!1,Wt=!1,jr=!1,aa=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},na=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},sa=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},Hr=async e=>{if(ur)return Promise.resolve();if(Wt)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(jr)throw new Error("previous call to 'initializeWebAssembly()' failed.");Wt=!0;let t=e.initTimeout,r=e.numThreads;if(e.simd!==!1){if(e.simd==="relaxed"){if(!sa())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!na())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let i=aa();r>1&&!i&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let a=e.wasmPaths,n=typeof a=="string"?a:void 0,s=a==null?void 0:a.mjs,o=(s==null?void 0:s.href)??s,u=a==null?void 0:a.wasm,l=(u==null?void 0:u.href)??u,d=e.wasmBinary,[c,h]=await ia(o,n,r>1,!!d||!!l),g=!1,m=[];if(t>0&&m.push(new Promise($=>{setTimeout(()=>{g=!0,$()},t)})),m.push(new Promise(($,x)=>{let _={numThreads:r};if(d)_.wasmBinary=d,_.locateFile=y=>y;else if(l||n)_.locateFile=y=>l??n+y;else if(o&&o.indexOf("blob:")!==0)_.locateFile=y=>new URL(y,o).href;else if(c){let y=Nr();y&&(_.locateFile=S=>y+S)}h(_).then(y=>{Wt=!1,ur=!0,Wr=y,$(),c&&URL.revokeObjectURL(c)},y=>{Wt=!1,jr=!0,x(y)})})),await Promise.race(m),g)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},ne=()=>{if(ur&&Wr)return Wr;throw new Error("WebAssembly is not initialized yet.")}}),at,lr,Z,Kr=k(()=>{"use strict";Tt(),at=(e,t)=>{let r=ne(),i=r.lengthBytesUTF8(e)+1,a=r._malloc(i);return r.stringToUTF8(e,a,i),t.push(a),a},lr=(e,t,r,i)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach(([a,n])=>{let s=t?t+a:a;if(typeof n=="object")lr(n,s+".",r,i);else if(typeof n=="string"||typeof n=="number")i(s,n.toString());else if(typeof n=="boolean")i(s,n?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof n}`)})},Z=e=>{let t=ne(),r=t.stackSave();try{let i=t.PTR_SIZE,a=t.stackAlloc(2*i);t._OrtGetLastError(a,a+i);let n=Number(t.getValue(a,i===4?"i32":"i64")),s=t.getValue(a+i,"*"),o=s?t.UTF8ToString(s):"";throw new Error(`${e} ERROR_CODE: ${n}, ERROR_MESSAGE: ${o}`)}finally{t.stackRestore(r)}}}),oa,En=k(()=>{"use strict";Tt(),Kr(),oa=(e,t)=>{let r=ne(),i=0,a=[],n=e||{};try{if((e==null?void 0:e.logSeverityLevel)===void 0)n.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log severity level is not valid: ${e.logSeverityLevel}`);if((e==null?void 0:e.logVerbosityLevel)===void 0)n.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);(e==null?void 0:e.terminate)===void 0&&(n.terminate=!1);let s=0;(e==null?void 0:e.tag)!==void 0&&(s=at(e.tag,a)),i=r._OrtCreateRunOptions(n.logSeverityLevel,n.logVerbosityLevel,!!n.terminate,s),i===0&&Z("Can't create run options."),(e==null?void 0:e.extra)!==void 0&&lr(e.extra,"",new WeakSet,(o,u)=>{let l=at(o,a),d=at(u,a);r._OrtAddRunConfigEntry(i,l,d)!==0&&Z(`Can't set a run config entry: ${o} - ${u}.`)});for(let o of t)r._OrtRunOptionsAddActiveLoraAdapter(i,o)!==0&&Z("Can't add an active LoRA adapter.");return[i,a]}catch(s){throw i!==0&&r._OrtReleaseRunOptions(i),a.forEach(o=>r._free(o)),s}}}),ua,la,da,xt,pa,ca,kn=k(()=>{"use strict";Tt(),Kr(),ua=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"layout":return 3;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},la=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},da=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},xt=(e,t,r,i)=>{let a=at(t,i),n=at(r,i);ne()._OrtAddSessionConfigEntry(e,a,n)!==0&&Z(`Can't set a session config entry: ${t} - ${r}.`)},pa=async(e,t,r)=>{let i=t.executionProviders;for(let a of i){let n=typeof a=="string"?a:a.name,s=[],o;switch(n){case"webnn":if(n="WEBNN",xt(e,"session.disable_quant_qdq","1",r),xt(e,"session.disable_qdq_constant_folding","1",r),typeof a!="string"){let h=a==null?void 0:a.deviceType;h&&xt(e,"deviceType",h,r)}break;case"webgpu":if(n="JS",typeof a!="string"){let h=a;if(h!=null&&h.preferredLayout){if(h.preferredLayout!=="NCHW"&&h.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${h.preferredLayout}`);xt(e,"preferredLayout",h.preferredLayout,r)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${n}`)}let u=s.length,l=0,d=0;if(u>0){l=ne()._malloc(u*ne().PTR_SIZE),r.push(l),d=ne()._malloc(u*ne().PTR_SIZE),r.push(d);for(let h=0;h<u;h++)ne().setValue(l+h*ne().PTR_SIZE,s[h][0],"*"),ne().setValue(d+h*ne().PTR_SIZE,s[h][1],"*")}let c;if(o===void 0){let h=at(n,r);c=await ne()._OrtAppendExecutionProvider(e,h,l,d,u)}c!==0&&Z(`Can't append execution provider: ${n}.`)}},ca=async e=>{let t=ne(),r=0,i=[],a=e||{};da(a);try{let n=ua(a.graphOptimizationLevel??"all"),s=la(a.executionMode??"sequential"),o=typeof a.logId=="string"?at(a.logId,i):0,u=a.logSeverityLevel??2;if(!Number.isInteger(u)||u<0||u>4)throw new Error(`log severity level is not valid: ${u}`);let l=a.logVerbosityLevel??0;if(!Number.isInteger(l)||l<0||l>4)throw new Error(`log verbosity level is not valid: ${l}`);let d=typeof a.optimizedModelFilePath=="string"?at(a.optimizedModelFilePath,i):0;if(r=t._OrtCreateSessionOptions(n,!!a.enableCpuMemArena,!!a.enableMemPattern,s,!!a.enableProfiling,0,o,u,l,d),r===0&&Z("Can't create session options."),a.executionProviders&&await pa(r,a,i),a.enableGraphCapture!==void 0){if(typeof a.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${a.enableGraphCapture}`);xt(r,"enableGraphCapture",a.enableGraphCapture.toString(),i)}if(a.freeDimensionOverrides)for(let[c,h]of Object.entries(a.freeDimensionOverrides)){if(typeof c!="string")throw new Error(`free dimension override name must be a string: ${c}`);if(typeof h!="number"||!Number.isInteger(h)||h<0)throw new Error(`free dimension override value must be a non-negative integer: ${h}`);let g=at(c,i);t._OrtAddFreeDimensionOverride(r,g,h)!==0&&Z(`Can't set a free dimension override: ${c} - ${h}.`)}return a.extra!==void 0&&lr(a.extra,"",new WeakSet,(c,h)=>{xt(r,c,h,i)}),[r,i]}catch(n){throw r!==0&&t._OrtReleaseSessionOptions(r)!==0&&Z("Can't release session options."),i.forEach(s=>t._free(s)),n}}}),Et,kt,It,Zr,Qr,Xr,Yr,yi,se=k(()=>{"use strict";Et=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},kt=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},It=(e,t)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],i=typeof t=="number"?t:t.reduce((a,n)=>a*n,1);return r>0?Math.ceil(i*r):void 0},Zr=e=>{switch(e){case"float16":return typeof Float16Array<"u"?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},Qr=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},Xr=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",Yr=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",yi=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),dr,Jr=k(()=>{"use strict";Pr(),dr=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let r=t.headers.get("Content-Length"),i=r?parseInt(r,10):0;if(i<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let a=t.body.getReader(),n;try{n=new ArrayBuffer(i)}catch(o){if(o instanceof RangeError){let u=Math.ceil(i/65536);n=new WebAssembly.Memory({initial:u,maximum:u}).buffer}else throw o}let s=0;for(;;){let{done:o,value:u}=await a.read();if(o)break;let l=u.byteLength;new Uint8Array(n,s,l).set(u),s+=l}return new Uint8Array(n,0,i)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),ha,wi,_i,Jt,bi,$i,ke,Ot=k(()=>{"use strict";se(),ha=["V","I","W","E","F"],wi=(e,t)=>{console.log(`[${ha[e]},${new Date().toISOString()}]${t}`)},bi=(e,t)=>{_i=e,Jt=t},$i=(e,t)=>{let r=Qr(e),i=Qr(_i);r>=i&&wi(r,typeof t=="function"?t():t)},ke=(...e)=>{Jt&&$i(...e)}}),vi,Ut,B,Lt,fa,ma,xi,he=k(()=>{"use strict";vi=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},Ut=class{static calcShape(e,t,r=!1){let i=e.length,a=t.length;if(i===0)return t;if(a===0)return e;let n=Math.max(e.length,t.length),s=new Array(n);if(r){if(i<2||a<2)return;let o=vi.calcMatMulShape([e[i-2],e[i-1]],[t[a-2],t[a-1]]);if(o===void 0)return;[s[n-2],s[n-1]]=o}for(let o=r?3:1;o<=n;o++){let u=i-o<0?1:e[i-o],l=a-o<0?1:t[a-o];if(u!==l&&u>1&&l>1)return;let d=Math.max(u,l);if(u&&l)s[n-o]=Math.max(u,l);else{if(d>1)return;s[n-o]=0}}return s}static isValidBroadcast(e,t){let r=e.length,i=t.length;if(r>i)return!1;for(let a=1;a<=r;a++)if(e[r-a]!==1&&e[r-a]!==t[i-a])return!1;return!0}},B=class cn{static size(t){return cn.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,r=4){let i=t.length;if(i===0)return[];let a=new Array(i),n=i-1;for(;n>=0;){if(t[n]%r===0){a[n]=t[n]/r;break}if(r%t[n]!==0)throw new Error("cannot convert shape");a[n]=1,r/=t[n],n--}for(n--;n>=0;n--)a[n]=t[n];return a}static sizeFromDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return cn.getSizeFromDimensionRange(t,r,t.length)}static sizeToDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeToDimension as Tensor has ${t.length} dimensions.`);return cn.getSizeFromDimensionRange(t,0,r)}static getSizeFromDimensionRange(t,r,i){let a=1;for(let n=r;n<i;n++){if(t[n]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");a*=Number(t[n])}return a}static computeStrides(t){let r=t.length;if(r===0)return[];if(r===1)return[1];let i=new Array(r);i[r-1]=1,i[r-2]=t[r-1];for(let a=r-3;a>=0;--a)i[a]=i[a+1]*t[a+1];return i}static normalizeAxis(t,r){if(t<-r&&t>=r)throw new Error("unsupported axis for this operation.");return t<0?t+r:t}static normalizeAxes(t,r){return t.map(i=>this.normalizeAxis(i,r??t.length))}static sortBasedOnPerm(t,r){return r?r.map(i=>t[i]):t.slice().reverse()}static padShape(t,r){let i=t.length;return t.map((a,n)=>a+r[n]+r[n+i])}static areEqual(t,r){return t.length!==r.length?!1:t.every((i,a)=>i===r[a])}},Lt=class Or{static adjustPoolAttributes(t,r,i,a,n,s){if(!t&&i.length!==r.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let o=0;o<r.length-2;o++)o>=i.length?i.push(r[o+2]):i[o]=r[o+2];for(let o=0;o<i.length;o++)if(o<a.length){if(a[o]<0)throw new Error("strides should be greater than or equal to 1")}else a.push(1);for(let o=0;o<i.length;o++)if(o<n.length){if(n[o]<0)throw new Error("dilations should be greater than or equal to 1")}else n.push(1);for(let o=0;o<i.length*2;o++)if(o<s.length){if(s[o]<0)throw new Error("pad should be greater than or equal to 1")}else s.push(0);for(let o=0;o<i.length;o++){if(i[o]<=0)throw new Error("kernel shapes need to be greater than 0");if(s[o]>=i[o]||s[o+i.length]>=i[o])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,r,i,a,n,s,o){if(o){if(n.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(r.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(a.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let u=0;u<t.length-2;u++)Or.adjustPadAndReturnShape(t[u+(s?1:2)],r[u],i[u],a[u],n,u,u+t.length-2,o)}}static computePoolOutputShape(t,r,i,a,n,s,o,u=0){if(r.length<=0)throw new Error("input shape must be of size greater than 0");let l=[r[0],r[1]];return Or.computeShapeHelper(t,r,l,i,a,n,s,o,u),l}static computeConvOutputShape(t,r,i,a,n,s,o){if(t.length<=0||r.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let u=[t[0],r[0]];return Or.computeShapeHelper(!1,t,u,i,a,n,s,o),u}static computeShapeHelper(t,r,i,a,n,s,o,u,l=0){if(t)for(let d=0;d<r.length-2;d++)i.push(1);else for(let d=0;d<r.length-2;d++)i.push(Or.adjustPadAndReturnShape(r[d+2],a[d],n[d],s[d],o,d,d+r.length-2,u,l))}static computeOutputSize(t,r,i,a,n){let s=Math.floor(t/r)+1;return n===1&&(s=Math.ceil(t/r)+1,(s-1)*r>=i+a&&(s-=1)),s}static adjustPadAndReturnShape(t,r,i,a,n,s,o,u,l=0){let d=i*(a-1)+1;if(u&&u!=="NOTSET")switch(u){case"VALID":return n[s]=0,n[o]=0,Or.computeOutputSize(t-d,r,t,0,l);case"SAME_LOWER":case"SAME_UPPER":if(i!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let c=(Math.floor((t+r-1)/r)-1)*r+a-t;return n[s]=Math.floor(u==="SAME_LOWER"?(c+1)/2:c/2),n[o]=c-n[s],Or.computeOutputSize(t+n[s]+n[o]-d,r,t,n[s],l)}default:throw new Error("Unsupported AutoPad type")}else return Or.computeOutputSize(t+n[s]+n[o]-d,r,t,n[s],l)}},fa=class{static getShapeOfGemmResult(e,t,r,i,a){if(e.length!==2||r.length!==2)throw new Error("shape need to be of size 2");let n,s,o;t?(n=e[1],s=e[0]):(n=e[0],s=e[1]);let u=-1;if(i?(o=r[0],u=1):(o=r[1],u=0),r[u]!==s)throw new Error("dimension mismatch");if(n<=0||o<=0||s<=0)throw new Error("invalid shape specified");if(a&&!Ut.isValidBroadcast(a,[n,o]))throw new Error("gemm: invalid bias shape for broadcast");return[n,o,s]}},ma=-34028234663852886e22,xi=34028234663852886e22}),ei,Si=k(()=>{"use strict";se(),ei=(e,t)=>new(Zr(t))(e)}),Ti,Rt,gt,pr,cr,$r,vr,ti,xr,er,tr,ja=k(()=>{"use strict";se(),Ot(),Ti=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),Rt=(e,t)=>{if(t==="int32")return e;let r=Ti.get(t);if(!r)throw new Error(`WebNN backend does not support data type: ${t}`);let i=r/8;if(e.byteLength%i!==0)throw new Error(`Invalid Uint8Array length - must be a multiple of ${i}.`);let a=e.byteLength/i,n=new(Zr(t))(e.buffer,e.byteOffset,a);switch(t){case"int64":case"uint64":{let s=new Int32Array(a);for(let o=0;o<a;o++){let u=n[o];if(u>2147483647n||u<-2147483648n)throw new Error("Can not convert int64 data to int32 - value out of range.");s[o]=Number(u)}return new Uint8Array(s.buffer)}case"int8":case"uint8":case"uint32":{if(t==="uint32"&&n.some(o=>o>2147483647))throw new Error("Can not convert uint32 data to int32 - value out of range.");let s=Int32Array.from(n,Number);return new Uint8Array(s.buffer)}default:throw new Error(`Unsupported data conversion from ${t} to 'int32'`)}},gt=(e,t)=>{if(t==="int32")return e;if(e.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");let r=e.byteLength/4,i=new Int32Array(e.buffer,e.byteOffset,r);switch(t){case"int64":{let a=BigInt64Array.from(i,BigInt);return new Uint8Array(a.buffer)}case"uint64":{if(i.some(n=>n<0))throw new Error("Can not convert int32 data to uin64 - negative value found.");let a=BigUint64Array.from(i,BigInt);return new Uint8Array(a.buffer)}case"int8":{if(i.some(n=>n<-128||n>127))throw new Error("Can not convert int32 data to int8 - value out of range.");let a=Int8Array.from(i,Number);return new Uint8Array(a.buffer)}case"uint8":{if(i.some(a=>a<0||a>255))throw new Error("Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(i,Number)}case"uint32":{if(i.some(n=>n<0))throw new Error("Can not convert int32 data to uint32 - negative value found.");let a=Uint32Array.from(i,Number);return new Uint8Array(a.buffer)}default:throw new Error(`Unsupported data conversion from 'int32' to ${t}`)}},pr=1,cr=()=>pr++,$r=new Map([["int8","int32"],["uint8","int32"],["uint32","int32"],["int64","int32"]]),vr=(e,t)=>{let r=Ti.get(e);if(!r)throw new Error(`WebNN backend does not support data type: ${e}`);return t.length>0?Math.ceil(t.reduce((i,a)=>i*a)*r/8):0},ti=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:r,tensor:i,dataType:a,shape:n,fallbackDataType:s}=e;this.sessionId=t,this.mlContext=r,this.mlTensor=i,this.dataType=a,this.tensorShape=n,this.fallbackDataType=s}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return vr(this.dataType,this.tensorShape)}destroy(){ke("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){if(this.fallbackDataType){let t=await this.mlContext.readTensor(this.mlTensor),r=gt(new Uint8Array(t),this.dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(r);return}else return new Uint8Array(r).buffer}else return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,r){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===r.length&&this.tensorShape.every((i,a)=>i===r[a])}setIsDataConverted(e){this.isDataConverted=e}},xr=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,r,i){let a=this.tensorManager.getMLContext(e),n=this.tensorManager.getMLOpSupportLimits(e),s;if(!(n!=null&&n.input.dataTypes.includes(t))){if(s=$r.get(t),!s||!(n!=null&&n.input.dataTypes.includes(s)))throw new Error(`WebNN backend does not support data type: ${t}`);ke("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${s}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(a,t,r))return this.wrapper.tensor;if(i){if(this.wrapper.byteLength!==vr(t,r))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let o=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,r,o,!0,!0,s),i&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper){if(this.wrapper.fallbackType)if(this.wrapper.fallbackType==="int32")t=Rt(e,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}else ke("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor()}this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){var t,r;if(this.activeUpload){let i=(t=this.wrapper)!=null&&t.isDataConverted?gt(this.activeUpload,(r=this.wrapper)==null?void 0:r.type):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(i):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(i);return}else return i.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},er=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}getMLOpSupportLimits(e){return this.backend.getMLOpSupportLimits(e)}reserveTensorId(){let e=cr();return this.tensorTrackersById.set(e,new xr(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,r,i,a){ke("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${r}, shape: ${i}, copyOld: ${a}}`);let n=this.tensorTrackersById.get(t);if(!n)throw new Error("Tensor not found.");return n.ensureTensor(e,r,i,a)}upload(e,t){let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");r.upload(t)}async download(e,t){ke("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t==null?void 0:t.byteLength}}`);let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");return r.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,r,i){let a=this.getMLContext(e),n=cr(),s=new ti({sessionId:e,context:a,tensor:t,dataType:r,shape:i});return this.tensorTrackersById.set(n,new xr(this,s)),this.externalTensors.add(s),n}async getCachedTensor(e,t,r,i,a,n,s){let o=this.getMLContext(e);for(let[l,d]of this.freeTensors.entries())if(d.canReuseTensor(o,t,r)){ke("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}`);let c=this.freeTensors.splice(l,1)[0];return c.sessionId=e,c}ke("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}}`);let u=await o.createTensor({dataType:s??t,shape:r,dimensions:r,usage:i,writable:a,readable:n});return new ti({sessionId:e,context:o,tensor:u,dataType:t,shape:r,fallbackDataType:s})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},tr=(...e)=>new er(...e)}),Sr,ga,ya,Ha=k(()=>{"use strict";se(),Tt(),Si(),ja(),Ot(),Sr=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),ga=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let r=Object.keys(e).sort(),i=Object.keys(t).sort();return r.length===i.length&&r.every((a,n)=>a===i[n]&&e[a]===t[a])},ya=class{constructor(e){this.tensorManager=tr(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,this.mlOpSupportLimitsBySessionId=new Map,bi(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){ke("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){ke("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let r of t)ke("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${r}}`),this.tensorManager.releaseTensorId(r);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let r=this.mlContextCache.findIndex(i=>i.gpuDevice===e);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:i}),i}}else if(e===void 0){let r=this.mlContextCache.findIndex(i=>i.options===void 0&&i.gpuDevice===void 0);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:i}),i}}let t=this.mlContextCache.findIndex(r=>ga(r.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let r=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:r}),r}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let r=this.sessionIdsByMLContext.get(t);r||(r=new Set,this.sessionIdsByMLContext.set(t,r)),r.add(e),this.mlOpSupportLimitsBySessionId.has(e)||this.mlOpSupportLimitsBySessionId.set(e,t.opSupportLimits()),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e),this.mlOpSupportLimitsBySessionId.delete(e);let r=this.sessionIdsByMLContext.get(t);if(r.delete(e),r.size===0){this.sessionIdsByMLContext.delete(t);let i=this.mlContextCache.findIndex(a=>a.mlContext===t);i!==-1&&this.mlContextCache.splice(i,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}getMLOpSupportLimits(e){return this.mlOpSupportLimitsBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){ke("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,r,i,a){let n=Sr.get(r);if(!n)throw new Error(`Unsupported ONNX data type: ${r}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,n,i,a)}async createTemporaryTensor(e,t,r){ke("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${r}}`);let i=Sr.get(t);if(!i)throw new Error(`Unsupported ONNX data type: ${t}`);let a=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,a,i,r,!1);let n=this.temporarySessionTensorIds.get(e);return n?n.push(a):this.temporarySessionTensorIds.set(e,[a]),a}uploadTensor(e,t){if(!ne().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");ke("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let r=await this.tensorManager.download(e);return ei(r,t)}}registerMLTensor(e,t,r,i){let a=Sr.get(r);if(!a)throw new Error(`Unsupported ONNX data type: ${r}`);let n=this.tensorManager.registerTensor(e,t,a,i);return ke("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${a}, dimensions: ${i}} -> {tensorId: ${n}}`),n}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.push(e)}isGraphInput(e,t){let r=this.sessionGraphInputs.get(e);return r?r.includes(t):!1}isGraphOutput(e,t){let r=this.sessionGraphOutputs.get(e);return r?r.includes(t):!1}isGraphInputOutputTypeSupported(e,t,r=!0){let i=Sr.get(Et(t)),a=this.mlOpSupportLimitsBySessionId.get(e);return typeof i>"u"?!1:r?!!(a!=null&&a.input.dataTypes.includes(i)):!!(a!=null&&a.output.dataTypes.includes(i))}flush(){}}}),Ei=k(()=>{"use strict"}),ki,ri,ii,wa,Ii,ai,zi,Ci,_a,Ka=k(()=>{"use strict";Ot(),Ei(),ki=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),ri=[],ii=e=>Math.ceil(Number(e)/16)*16,wa=e=>{for(let t=0;t<ri.length;t++){let r=ri[t];if(e<=r)return r}return Math.ceil(e/16)*16},Ii=1,ai=()=>Ii++,zi=async(e,t,r,i)=>{let a=ii(r),n=e.device.createBuffer({size:a,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let s=e.getCommandEncoder();e.endComputePass(),s.copyBufferToBuffer(t,0,n,0,a),e.flush(),await n.mapAsync(GPUMapMode.READ);let o=n.getMappedRange();if(i){let u=i();return u.set(new Uint8Array(o,0,r)),u}else return new Uint8Array(o.slice(0,r))}finally{n.destroy()}},Ci=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of ki)ri.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let r=t.buffer,i=t.byteOffset,a=t.byteLength,n=ii(a),s=this.storageCache.get(e);if(!s)throw new Error("gpu data for uploading does not exist");if(Number(s.originalSize)!==a)throw new Error(`inconsistent data size. gpu data size=${s.originalSize}, data size=${a}`);if(n===a&&i%4===0)this.backend.device.queue.writeBuffer(s.gpuData.buffer,0,r,i,a);else{let o=new Uint8Array(n);o.set(t),this.backend.device.queue.writeBuffer(s.gpuData.buffer,0,o,0,n)}ke("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let r=this.storageCache.get(e);if(!r)throw new Error("source gpu data for memcpy does not exist");let i=this.storageCache.get(t);if(!i)throw new Error("destination gpu data for memcpy does not exist");if(r.originalSize!==i.originalSize)throw new Error("inconsistent source and destination gpu data size");let a=ii(r.originalSize),n=this.backend.getCommandEncoder();this.backend.endComputePass(),n.copyBufferToBuffer(r.gpuData.buffer,0,i.gpuData.buffer,0,a)}registerExternalBuffer(e,t,r){let i;if(r){if(i=r[0],e===r[1])return ke("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, buffer is the same, skip.`),i;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else i=ai();return this.storageCache.set(i,{gpuData:{id:i,type:0,buffer:e},originalSize:t}),ke("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, registered.`),i}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),ke("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let r=wa(e),i,a=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,n=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(a||n){let o=(a?this.freeBuffers:this.freeUniformBuffers).get(r);o?o.length>0?i=o.pop():i=this.backend.device.createBuffer({size:r,usage:t}):i=this.backend.device.createBuffer({size:r,usage:t})}else i=this.backend.device.createBuffer({size:r,usage:t});let s={id:ai(),type:0,buffer:i};return this.storageCache.set(s.id,{gpuData:s,originalSize:Number(e)}),ke("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${s.id}`),s}get(e){var t;return(t=this.storageCache.get(e))==null?void 0:t.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,r=this.storageCache.get(t);if(!r){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return ke("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${r.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(r.gpuData.buffer),r.originalSize}async download(e,t){let r=this.storageCache.get(Number(e));if(!r)throw new Error("data does not exist");await zi(this.backend,r.gpuData.buffer,r.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=ki.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let r=this.freeBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let r=this.freeUniformBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(r=>{r.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&(ke("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(r=>{r.gpuData.buffer.destroy()}),this.storageCache=new Map)}},_a=(...e)=>new Ci(...e)}),Za,Re,Ke=k(()=>{"use strict";Za=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},Re=e=>new Za(e)}),hr,Tr,nt,ot,X,Ge,ba,Er,p,f,v,w,b,A,D,I,O,R=k(()=>{"use strict";se(),he(),hr=64,Tr=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},nt=(e,t=1)=>{let r=Tr(e,t);return typeof r=="string"?r:r[0]},ot=(e,t=1)=>{let r=Tr(e,t);return typeof r=="string"?r:r[1]},X=(...e)=>{let t=[];return e.forEach(r=>{r.length!==0&&t.push({type:12,data:r},{type:12,data:B.computeStrides(r)})}),t},Ge=e=>e%4===0?4:e%2===0?2:1,ba=(e="f32",t,r="0")=>!t||t===1?`${e}(${r})`:`vec${t}<${e}>(${r})`,Er=(e,t,r)=>e==="f32"?r:t===1?`f32(${r})`:`vec${t}<f32>(${r})`,p=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,f=(e,t,r,i)=>e.startsWith("uniforms.")&&r>4?typeof t=="string"?i==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:i==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:r>1?`${e}[${t}]`:e,v=(e,t,r,i,a)=>{let n=typeof r=="number",s=n?r:r.length,o=[...new Array(s).keys()],u=s<2?"u32":s<=4?`vec${s}<u32>`:`array<u32, ${s}>`,l=Tr(t,a),d=typeof l=="string"?l:l[1],c=typeof l=="string"?l:l[0],h={indices:u,value:d,storage:c,tensor:t},g=P=>typeof P=="string"?P:`${P}u`,m={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},$=n?"uniforms.":"",x=`${$}${e}_shape`,_=`${$}${e}_strides`,y="";for(let P=0;P<s-1;P++)y+=`
    let dim${P} = current / ${f(_,P,s)};
    let rest${P} = current % ${f(_,P,s)};
    indices[${P}] = dim${P};
    current = rest${P};
    `;y+=`indices[${s-1}] = current;`;let S=s<2?"":`
  fn o2i_${e}(offset: u32) -> ${h.indices} {
    var indices: ${h.indices};
    var current = offset;
    ${y}
    return indices;
  }`,T=P=>(m.offsetToIndices=!0,s<2?P:`o2i_${e}(${P})`),E=[];if(s>=2)for(let P=s-1;P>=0;P--)E.push(`${f(_,P,s)} * (indices[${P}])`);let z=s<2?"":`
  fn i2o_${e}(indices: ${h.indices}) -> u32 {
    return ${E.join("+")};
  }`,C=P=>(m.indicesToOffset=!0,s<2?P:`i2o_${e}(${P})`),M=(...P)=>s===0?"0u":`${h.indices}(${P.map(g).join(",")})`,U=(P,te)=>s<2?`${P}`:`${f(P,te,s)}`,V=(P,te,oe)=>s<2?`${P}=${oe};`:`${f(P,te,s)}=${oe};`,ae={},K=(P,te)=>{m.broadcastedIndicesToOffset=!0;let oe=`${te.name}broadcastedIndicesTo${e}Offset`;if(oe in ae)return`${oe}(${P})`;let F=[];for(let Ze=s-1;Ze>=0;Ze--){let tt=te.indicesGet("outputIndices",Ze+te.rank-s);F.push(`${U(_,Ze)} * (${tt} % ${U(x,Ze)})`)}return ae[oe]=`fn ${oe}(outputIndices: ${te.type.indices}) -> u32 {
             return ${F.length>0?F.join("+"):"0u"};
           }`,`${oe}(${P})`},Y=(P,te)=>(()=>{if(h.storage===h.value)return`${e}[${P}]=${te};`;if(h.storage==="vec2<u32>"&&h.value==="i32")return`${e}[${P}]=vec2<u32>(u32(${te}), select(0u, 0xFFFFFFFFu, ${te} < 0));`;if(h.storage==="vec2<u32>"&&h.value==="u32")return`${e}[${P}]=vec2<u32>(u32(${te}), 0u);`;if(h.storage==="u32"&&h.value==="vec4<bool>")return`${e}[${P}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${te}));`;throw new Error(`not supported combination of storage type ${h.storage} and value type ${h.value} yet`)})(),Ce=P=>(()=>{if(h.storage===h.value)return`${e}[${P}]`;if(h.storage==="vec2<u32>"&&h.value==="i32")return`i32(${e}[${P}].x)`;if(h.storage==="vec2<u32>"&&h.value==="u32")return`u32(${e}[${P}].x)`;if(h.storage==="u32"&&h.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${P}] & 0xFFu), bool(${e}[${P}] & 0xFF00u), bool(${e}[${P}] & 0xFF0000u), bool(${e}[${P}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${h.storage} and value type ${h.value} yet`)})(),De=s<2?"":`
  fn get_${e}ByIndices(indices: ${h.indices}) -> ${d} {
    return ${Ce(`i2o_${e}(indices)`)};
  }`,pe=s<2?"":(()=>{let P=o.map(oe=>`d${oe}: u32`).join(", "),te=o.map(oe=>`d${oe}`).join(", ");return`
  fn get_${e}(${P}) -> ${d} {
    return get_${e}ByIndices(${M(te)});
  }`})(),be=(...P)=>{if(P.length!==s)throw new Error(`indices length must be ${s}`);let te=P.map(g).join(",");return s===0?Ce("0u"):s===1?Ce(te[0]):(m.get=!0,m.getByIndices=!0,m.indicesToOffset=!0,`get_${e}(${te})`)},Me=P=>s<2?Ce(P):(m.getByIndices=!0,m.indicesToOffset=!0,`get_${e}ByIndices(${P})`),le=s<2?"":`
  fn set_${e}ByIndices(indices: ${h.indices}, value: ${d}) {
    ${Y(`i2o_${e}(indices)`,"value")}
  }`,Je=s<2?"":(()=>{let P=o.map(oe=>`d${oe}: u32`).join(", "),te=o.map(oe=>`d${oe}`).join(", ");return`
  fn set_${e}(${P}, value: ${d}) {
    set_${e}ByIndices(${M(te)}, value);
  }`})();return{impl:()=>{let P=[],te=!1;return m.offsetToIndices&&(P.push(S),te=!0),m.indicesToOffset&&(P.push(z),te=!0),m.broadcastedIndicesToOffset&&(Object.values(ae).forEach(oe=>P.push(oe)),te=!0),m.set&&(P.push(Je),te=!0),m.setByIndices&&(P.push(le),te=!0),m.get&&(P.push(pe),te=!0),m.getByIndices&&(P.push(De),te=!0),!n&&te&&P.unshift(`const ${x} = ${h.indices}(${r.join(",")});`,`const ${_} = ${h.indices}(${B.computeStrides(r).join(",")});`),P.join(`
`)},type:h,offsetToIndices:T,indicesToOffset:C,broadcastedIndicesToOffset:K,indices:M,indicesGet:U,indicesSet:V,set:(...P)=>{if(P.length!==s+1)throw new Error(`indices length must be ${s}`);let te=P[s];if(typeof te!="string")throw new Error("value must be string");let oe=P.slice(0,s).map(g).join(",");return s===0?Y("0u",te):s===1?Y(oe[0],te):(m.set=!0,m.setByIndices=!0,m.indicesToOffset=!0,`set_${e}(${oe}, ${te})`)},setByOffset:Y,setByIndices:(P,te)=>s<2?Y(P,te):(m.setByIndices=!0,m.indicesToOffset=!0,`set_${e}ByIndices(${P}, ${te});`),get:be,getByOffset:Ce,getByIndices:Me,usage:i,name:e,strides:_,shape:x,rank:s}},w=(e,t,r,i=1)=>v(e,t,r,"input",i),b=(e,t,r,i=1)=>v(e,t,r,"output",i),A=(e,t,r)=>v(e,t,r,"atomicOutput",1),D=(e,t,r,i=1)=>v(e,t,r,"internal",i),I=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=hr){let t=typeof e=="number"?e:e[0],r=typeof e=="number"?1:e[1],i=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||r>this.limits.maxComputeWorkgroupSizeY||i>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*r*i>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let a=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,n=a?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,s=a?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t*r*i}u + local_idx;`;return`@compute @workgroup_size(${t}, ${r}, ${i})
  fn main(${n}) {
    ${s}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith("uniforms.")&&this.uniforms.push({name:e.shape.replace("uniforms.",""),type:"u32",length:e.rank}),e.strides.startsWith("uniforms.")&&this.uniforms.push({name:e.strides.replace("uniforms.",""),type:"u32",length:e.rank}))}declareVariable(e,t){if(e.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(e),this.appendVariableUniforms(e);let r=e.usage==="input"?"read":"read_write",i=e.usage==="atomicOutput"?"atomic<i32>":e.type.storage;return`@group(0) @binding(${t}) var<storage, ${r}> ${e.name}: array<${i}>;`}declareVariables(...e){return e.map(t=>this.declareVariable(t,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(t=>this.registerInternalVariable(t)),this}registerUniform(e,t,r=1){return this.uniforms.push({name:e,type:t,length:r}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let e=[];for(let{name:t,type:r,length:i}of this.uniforms)if(i&&i>4)r==="f16"?e.push(`@align(16) ${t}:array<mat2x4<${r}>, ${Math.ceil(i/8)}>`):e.push(`${t}:array<vec4<${r}>, ${Math.ceil(i/4)}>`);else{let a=i==null||i===1?r:`vec${i}<${r}>`;e.push(`${t}:${a}`)}return`
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},O=(e,t)=>new I(e,t)}),L,N,q,G,re,Ne,Ie,fe,de,Ue=k(()=>{"use strict";se(),he(),Ke(),R(),L=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},N=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),q=(e,t)=>B.sortBasedOnPerm(e,N(e.length,t)),G=(e,t,r,i)=>{let a=`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`;for(let n=0;n<t;++n)a+=`a[${e[n]}]=i[${n}];`;return a+="return a;}"},re=(e,t)=>{let r=[],i=[];for(let a=0;a<e.length;++a)e[a]!==1&&r.push(e[a]),e[t[a]]!==1&&i.push(t[a]);return{newShape:r,newPerm:i}},Ne=(e,t)=>{let r=0;for(let i=0;i<e.length;++i)if(t[e[i]]!==1){if(e[i]<r)return!1;r=e[i]}return!0},Ie=(e,t)=>{let r=e.dataType,i=e.dims.length,a=N(i,t),n=q(e.dims,a),s=e.dims,o=n,u=i<2||Ne(a,e.dims),l;if(u)return l=m=>{let $=w("input",r,s,4),x=b("output",r,o,4);return`
  ${m.registerUniform("output_size","u32").declareVariables($,x)}
  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let m=B.size(n);return{outputs:[{dims:n,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(m/64/4)},programUniforms:[{type:12,data:Math.ceil(m/4)}]}},getShaderSource:l};let{newShape:d,newPerm:c}=re(e.dims,a),h=B.areEqual(c,[2,3,1]),g=B.areEqual(c,[3,1,2]);if(d.length===2||h||g){s=h?[d[0],d[1]*d[2]]:g?[d[0]*d[1],d[2]]:d,o=[s[1],s[0]];let m=16;return l=$=>{let x=w("a",r,s.length),_=b("output",r,o.length);return`
  ${$.registerUniform("output_size","u32").declareVariables(x,_)}
  var<workgroup> tile : array<array<${_.type.value}, ${m+1}>, ${m}>;
  ${$.mainStart([m,m,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${m} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${m}u + local_id.x;
    let input_row = workgroup_id_x * ${m}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${x.getByIndices(`${x.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${m}u + local_id.x;
    let output_row = workgroup_id_y * ${m}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${_.setByIndices(`${_.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let $=B.size(n);return{outputs:[{dims:n,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(o[1]/m),y:Math.ceil(o[0]/m)},programUniforms:[{type:12,data:$},...X(s,o)]}},getShaderSource:l}}return l=m=>{let $=w("a",r,s.length),x=b("output",r,o.length);return`
  ${m.registerUniform("output_size","u32").declareVariables($,x)}

  ${G(a,i,$,x)}

  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${x.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${x.setByOffset("global_idx",$.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let m=B.size(n);return{outputs:[{dims:n,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:[{type:12,data:m},...X(s,o)]}},getShaderSource:l}},fe=(e,t)=>{L(e.inputs,t.perm),e.compute(Ie(e.inputs[0],t.perm))},de=e=>Re({perm:e.perm})}),ct,Bt,qe,Be,yt,Mt,$t,ni,Ai,$a,zt,va,xa,ht,wt,Sa,Te,Dt,Qa,jt,si,ft=k(()=>{"use strict";se(),he(),R(),In(),Ue(),ct={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},Bt={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},qe={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},Be={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},yt=(e,t)=>{let r=[];for(let i=t-e;i<t;++i)r.push(i);return r},Mt=(e,t)=>{let r=[],i=e.length;for(let n=0;n<i;n++)t.indexOf(n)===-1&&r.push(e[n]);let a=t.map(n=>e[n]);return[r,a]},$t=(e,t)=>{let r=e.length+t.length,i=[],a=0;for(let n=0;n<r;n++)t.indexOf(n)===-1?i.push(e[a++]):i.push(1);return i},ni=(e,t)=>{for(let r=0;r<e.length;++r)if(e[e.length-r-1]!==t-1-r)return!1;return!0},Ai=(e,t)=>{let r=[];if(!ni(e,t)){for(let i=0;i<t;++i)e.indexOf(i)===-1&&r.push(i);e.forEach(i=>r.push(i))}return r},$a=(e,t,r,i,a,n,s)=>{let o=r[0].dims,u=B.size(n),l=B.size(s),d=w("_A",r[0].dataType,o),c=b("output",a,n),h=64;u===1&&(h=256);let g=`
          var<workgroup> aBestValues : array<f32, ${h}>;
       `,m=$=>`
        ${$.registerUniform("reduceSize","u32").declareVariables(d,c)}
        ${g}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${$.mainStart(h)}

          let outputIndex = global_idx / ${h};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${qe[i]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${h}) {
           let candidate = f32(${d.getByOffset("offset + k")});
           bestValue = ${ct[i]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${h}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${Bt[i]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${c.setByOffset("outputIndex",`${i==="mean"?`${c.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${c.type.storage}(${Be[i]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${h}`,inputDependencies:["type"]},getShaderSource:m,getRunData:()=>({outputs:[{dims:n,dataType:a}],dispatchGroup:{x:u},programUniforms:[{type:12,data:l}]})}},zt=(e,t,r,i)=>{let a=e.inputs.length===1?r:Ri(e.inputs,r),n=a.axes;n.length===0&&!a.noopWithEmptyAxes&&(n=e.inputs[0].dims.map((g,m)=>m));let s=B.normalizeAxes(n,e.inputs[0].dims.length),o=s,u=e.inputs[0],l=Ai(o,e.inputs[0].dims.length);l.length>0&&(u=e.compute(Ie(e.inputs[0],l),{inputs:[0],outputs:[-1]})[0],o=yt(o.length,u.dims.length));let[d,c]=Mt(u.dims,o),h=d;a.keepDims&&(h=$t(d,s)),e.compute($a(t,a.cacheKey,[u],i,e.inputs[0].dataType,h,c),{inputs:[u]})},va=(e,t)=>{zt(e,"ReduceMeanShared",t,"mean")},xa=(e,t)=>{zt(e,"ReduceL1Shared",t,"l1")},ht=(e,t)=>{zt(e,"ReduceL2Shared",t,"l2")},wt=(e,t)=>{zt(e,"ReduceLogSumExpShared",t,"logSumExp")},Sa=(e,t)=>{zt(e,"ReduceMaxShared",t,"max")},Te=(e,t)=>{zt(e,"ReduceMinShared",t,"min")},Dt=(e,t)=>{zt(e,"ReduceProdShared",t,"prod")},Qa=(e,t)=>{zt(e,"ReduceSumShared",t,"sum")},jt=(e,t)=>{zt(e,"ReduceSumSquareShared",t,"sumSquare")},si=(e,t)=>{zt(e,"ReduceLogSumShared",t,"logSum")}}),Ye,Oi,fr,Ri,Pt,Ht,Kt,kr,lt,et,Nt,Xa,Ya,Fs,Vs,Zt,Gs,Ws,js,Hs,Ks,Zs,Qs,Xs,Ys,Js,In=k(()=>{"use strict";se(),he(),Ke(),R(),ft(),Ye=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},Oi=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],fr=(e,t,r,i,a,n,s=!1,o=!1)=>{let u=[],l=r[0].dims,d=l.length,c=B.normalizeAxes(a,d),h=!o&&c.length===0;l.forEach(($,x)=>{h||c.indexOf(x)>=0?s&&u.push(1):u.push($)});let g=u.length,m=B.size(u);return{name:e,shaderCache:t,getShaderSource:$=>{let x=[],_=w("_A",r[0].dataType,d),y=b("output",n,g),S=i(_,y,c),T=S[2];for(let E=0,z=0;E<d;E++)h||c.indexOf(E)>=0?(s&&z++,T=`for(var j${E}: u32 = 0; j${E} < ${l[E]}; j${E}++) {
                  ${S[2].includes("last_index")?`let last_index = j${E};`:""}
                  ${_.indicesSet("input_indices",E,`j${E}`)}
                  ${T}
                }`):(x.push(`${_.indicesSet("input_indices",E,y.indicesGet("output_indices",z))};`),z++);return`

        ${$.registerUniform("output_size","u32").declareVariables(_,y)}

        ${$.mainStart()}
          ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${_.type.indices};
          let output_indices = ${y.offsetToIndices("global_idx")};

          ${x.join(`
`)}
          ${S[0]}       // init ops for reduce max/min
          ${S[1]}
          ${T}
          ${S[3]}
          ${S.length===4?y.setByOffset("global_idx","value"):S.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:u,dataType:n}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:[{type:12,data:m},...X(l,u)]})}},Ri=(e,t)=>{let r=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(i=>r.push(Number(i))),Re({axes:r,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},Pt=(e,t,r,i)=>{let a=e.inputs,n=a.length===1?r:Ri(a,r);e.compute(fr(t,{hint:n.cacheKey,inputDependencies:["rank"]},[a[0]],n.noopWithEmptyAxes&&n.axes.length===0?Oi:i,n.axes,a[0].dataType,n.keepDims,n.noopWithEmptyAxes),{inputs:[0]})},Ht=(e,t)=>{Ye(e.inputs),Pt(e,"ReduceLogSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,"value = log(value);"])},Kt=(e,t)=>{Ye(e.inputs),Pt(e,"ReduceL1",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += abs(${r.getByIndices("input_indices")});`,""])},kr=(e,t)=>{Ye(e.inputs),Pt(e,"ReduceL2",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},lt=(e,t)=>{Ye(e.inputs),Pt(e,"ReduceLogSumExp",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += exp(${r.getByIndices("input_indices")});`,"value = log(value);"])},et=(e,t)=>{Ye(e.inputs),Pt(e,"ReduceMax",t,(r,i,a)=>{let n=[];for(let s=0;s<r.rank;s++)(a.indexOf(s)>=0||a.length===0)&&n.push(r.indicesSet("input_indices",s,0));return[`${n.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = max(value, ${r.getByIndices("input_indices")});`,""]})},Nt=(e,t)=>{Ye(e.inputs),Pt(e,"ReduceMean",t,(r,i,a)=>{let n=1;for(let s=0;s<r.rank;s++)(a.indexOf(s)>=0||a.length===0)&&(n*=e.inputs[0].dims[s]);return["var sum = f32(0);","",`sum += f32(${r.getByIndices("input_indices")});`,`let value = ${i.type.value}(sum / ${n});`]})},Xa=(e,t)=>{Ye(e.inputs),Pt(e,"ReduceMin",t,(r,i,a)=>{let n=[];for(let s=0;s<r.rank;s++)(a.indexOf(s)>=0||a.length===0)&&n.push(`input_indices[${s}] = 0;`);return[`${n.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = min(value, ${r.getByIndices("input_indices")});`,""]})},Ya=(e,t)=>{Ye(e.inputs),Pt(e,"ReduceProd",t,(r,i)=>[`var value = ${i.type.storage}(1);`,"",`value *= ${r.getByIndices("input_indices")};`,""])},Fs=(e,t)=>{Ye(e.inputs),Pt(e,"ReduceSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,""])},Vs=(e,t)=>{Ye(e.inputs),Pt(e,"ReduceSumSquare",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += t * t;`,""])},Zt=(e,t,r)=>{if(t.length===0)return r;let i=1,a=1;for(let n=0;n<t.length;n++)t.indexOf(n)===-1?i*=e[n]:a*=e[n];return a<32&&i>1024},Gs=(e,t)=>{Zt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Nt(e,t):va(e,t)},Ws=(e,t)=>{Zt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Kt(e,t):xa(e,t)},js=(e,t)=>{Zt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?kr(e,t):ht(e,t)},Hs=(e,t)=>{Zt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?lt(e,t):wt(e,t)},Ks=(e,t)=>{Zt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?et(e,t):Sa(e,t)},Zs=(e,t)=>{Zt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Xa(e,t):Te(e,t)},Qs=(e,t)=>{Zt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Ya(e,t):Dt(e,t)},Xs=(e,t)=>{Zt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Fs(e,t):Qa(e,t)},Ys=(e,t)=>{Zt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Vs(e,t):jt(e,t)},Js=(e,t)=>{Zt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Ht(e,t):si(e,t)}}),zn,eo,to,Cn,Kc=k(()=>{"use strict";se(),Ke(),In(),zn=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},eo=(e,t)=>{zn(e.inputs);let r=(i,a,n)=>{let s=[];for(let o=0;o<i.rank;o++)(n.indexOf(o)>=0||n.length===0)&&s.push(`input_indices[${o}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",a.setByOffset("global_idx","best_index")]};e.compute(fr("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},to=(e,t)=>{zn(e.inputs);let r=(i,a,n)=>{let s=[];for(let o=0;o<i.rank;o++)(n.indexOf(o)>=0||n.length===0)&&s.push(`input_indices[${o}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",a.setByOffset("global_idx","best_index")]};e.compute(fr("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},Cn=e=>Re(e)}),ro,Ja,io,ao,no,Ta,so,oo,An=k(()=>{"use strict";se(),he(),Ei(),R(),ro=(e,t)=>{let r=e[0],i=e[1],a=e[2],n=e[3],s=e[4],o=e[5];if(s&&o)throw new Error("Attention cannot have both past and attention_bias");if(r.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let u=r.dims[0],l=r.dims[1],d=r.dims[2];if(a.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(i.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(i.dims[0]!==d)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(a.dims[0]!==i.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let c=a.dims[0]/3,h=c,g=h;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let S of t.qkvHiddenSizes)if(S%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");c=t.qkvHiddenSizes[0],h=t.qkvHiddenSizes[1],g=t.qkvHiddenSizes[2]}let m=l;if(c!==h)throw new Error("qkv_hidden_sizes first element should be same as the second");if(a.dims[0]!==c+h+g)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let $=0;if(s){if(h!==g)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(s.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(s.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(s.dims[1]!==u)throw new Error('Input "past" second dimension must be batch_size');if(s.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(s.dims[4]!==h/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||($=s.dims[3])}let x=m+$,_=-1,y=0;if(n)throw new Error("Mask not supported");if(s)throw new Error("past is not supported");if(o){if(o.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(o.dims[0]!==u||o.dims[1]!==t.numHeads||o.dims[2]!==l||o.dims[3]!==x)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:u,sequenceLength:l,pastSequenceLength:$,kvSequenceLength:m,totalSequenceLength:x,maxSequenceLength:_,inputHiddenSize:d,hiddenSize:c,vHiddenSize:g,headSize:Math.floor(c/t.numHeads),vHeadSize:Math.floor(g/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:y,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},Ja=(e,t,r)=>t&&e?`
      let total_sequence_length_input = u32(${t.getByOffset("0")});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${e==null?void 0:e.getByOffset("batchIdx")}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${r?"let past_sequence_length = uniforms.past_sequence_length":""};
    let present_sequence_length = total_sequence_length;
    `,io=(e,t,r,i,a,n,s,o)=>{let u=Ge(s?1:n),l=64,d=n/u;d<l&&(l=32);let c=Math.ceil(n/u/l),h=[{type:12,data:t},{type:12,data:r},{type:12,data:i},{type:12,data:a},{type:12,data:d},{type:12,data:c}],g=nt(e.dataType,u),m=ot(1,u),$=["type"];s&&$.push("type"),o&&$.push("type");let x=_=>{let y=b("x",e.dataType,e.dims,u),S=[y],T=s?w("seq_lens",s.dataType,s.dims):void 0;T&&S.push(T);let E=o?w("total_sequence_length_input",o.dataType,o.dims):void 0;E&&S.push(E);let z=ot(e.dataType),C=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${l}>;
  var<workgroup> thread_sum: array<f32, ${l}>;
  ${_.registerUniforms(C).declareVariables(...S)}
  ${_.mainStart([l,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${Ja(T,E,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${l}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${s?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${m}(-3.4028234663852886e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${m}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(u){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${u}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.4028234663852886e+38f);
    for (var i = 0u; i < ${l}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${m}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${m}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(u){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${u}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${l}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${y.type.value}(${z}(1.0) / ${z}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${m}(x[offset + i]);
        x[offset + i] = ${y.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${s?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${y.type.value}(${z}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${l};${g};${u}`,inputDependencies:$},getShaderSource:x,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:a,z:t*r},programUniforms:h})}},ao=(e,t,r,i,a,n,s,o,u)=>{let l=s+n.kvSequenceLength,d=[n.batchSize,n.numHeads,n.sequenceLength,l],c=e>1&&i,h=n.kvNumHeads?n.kvNumHeads:n.numHeads,g=c?[n.batchSize,h,l,n.headSize]:void 0,m=n.nReps?n.nReps:1,$=n.scale===0?1/Math.sqrt(n.headSize):n.scale,x=Ge(n.headSize),_=n.headSize/x,y=12,S={x:Math.ceil(l/y),y:Math.ceil(n.sequenceLength/y),z:n.batchSize*n.numHeads},T=[{type:12,data:n.sequenceLength},{type:12,data:_},{type:12,data:l},{type:12,data:n.numHeads},{type:12,data:n.headSize},{type:1,data:$},{type:12,data:s},{type:12,data:n.kvSequenceLength},{type:12,data:m}],E=c&&i&&B.size(i.dims)>0,z=["type","type"];E&&z.push("type"),a&&z.push("type"),o&&z.push("type"),u&&z.push("type");let C=[{dims:d,dataType:t.dataType,gpuDataType:0}];c&&C.push({dims:g,dataType:t.dataType,gpuDataType:0});let M=U=>{let V=w("q",t.dataType,t.dims,x),ae=w("key",r.dataType,r.dims,x),K=[V,ae];if(E){let le=w("past_key",i.dataType,i.dims,x);K.push(le)}a&&K.push(w("attention_bias",a.dataType,a.dims));let Y=o?w("seq_lens",o.dataType,o.dims):void 0;Y&&K.push(Y);let Ce=u?w("total_sequence_length_input",u.dataType,u.dims):void 0;Ce&&K.push(Ce);let De=b("output",t.dataType,d),pe=[De];c&&pe.push(b("present_key",t.dataType,g,x));let be=ot(1,x),Me=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${y}u;

  var<workgroup> tileQ: array<${V.type.storage}, ${y*y}>;
  var<workgroup> tileK: array<${V.type.storage}, ${y*y}>;
  ${U.registerUniforms(Me).declareVariables(...K,...pe)}
  ${U.mainStart([y,y,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${m===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${m===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${Ja(Y,Ce,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${E&&c?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${c?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${be}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${E&&c?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${c?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${be}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(x){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${x}`)}})()};
        output[outputIdx] = ${De.type.value} (sum * uniforms.alpha) + ${a?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${x};${a!==void 0};${i!==void 0};${e}`,inputDependencies:z},getRunData:()=>({outputs:C,dispatchGroup:S,programUniforms:T}),getShaderSource:M}},no=(e,t,r,i,a,n,s=void 0,o=void 0)=>{let u=n+a.kvSequenceLength,l=a.nReps?a.nReps:1,d=a.vHiddenSize*l,c=e>1&&i,h=a.kvNumHeads?a.kvNumHeads:a.numHeads,g=c?[a.batchSize,h,u,a.headSize]:void 0,m=[a.batchSize,a.sequenceLength,d],$=12,x={x:Math.ceil(a.vHeadSize/$),y:Math.ceil(a.sequenceLength/$),z:a.batchSize*a.numHeads},_=[{type:12,data:a.sequenceLength},{type:12,data:u},{type:12,data:a.vHeadSize},{type:12,data:a.numHeads},{type:12,data:a.headSize},{type:12,data:d},{type:12,data:n},{type:12,data:a.kvSequenceLength},{type:12,data:l}],y=c&&i&&B.size(i.dims)>0,S=["type","type"];y&&S.push("type"),s&&S.push("type"),o&&S.push("type");let T=[{dims:m,dataType:t.dataType,gpuDataType:0}];c&&T.push({dims:g,dataType:t.dataType,gpuDataType:0});let E=z=>{let C=w("probs",t.dataType,t.dims),M=w("v",r.dataType,r.dims),U=[C,M];y&&U.push(w("past_value",i.dataType,i.dims));let V=s?w("seq_lens",s.dataType,s.dims):void 0;s&&U.push(V);let ae=o?w("total_sequence_length_input",o.dataType,o.dims):void 0;o&&U.push(ae);let K=[b("output",t.dataType,m)];c&&K.push(b("present_value",t.dataType,g));let Y=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${$}u;
  var<workgroup> tileQ: array<${C.type.value}, ${$*$}>;
  var<workgroup> tileV: array<${C.type.value}, ${$*$}>;
  ${z.registerUniforms(Y).declareVariables(...U,...K)}
  ${z.mainStart([$,$,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${l===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${l===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${Ja(V,ae,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${y&&c?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${c?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${C.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${y&&c?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${c?`
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }`:""}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`};return{name:"AttentionScore",shaderCache:{hint:`${i!==void 0};${e}`,inputDependencies:S},getRunData:()=>({outputs:T,dispatchGroup:x,programUniforms:_}),getShaderSource:E}},Ta=(e,t,r,i,a,n,s,o,u,l,d=void 0,c=void 0)=>{let h=Math.min(e.outputCount,1+(s?1:0)+(o?1:0)),g=h>1?s:void 0,m=h>1?o:void 0,$=h>1?l.pastSequenceLength:0,x=$+l.kvSequenceLength,_=u&&B.size(u.dims)>0?u:void 0,y=[t,r];g&&B.size(g.dims)>0&&y.push(g),_&&y.push(_),d&&y.push(d),c&&y.push(c);let S=e.compute(ao(h,t,r,g,_,l,$,d,c),{inputs:y,outputs:h>1?[-1,1]:[-1]})[0];e.compute(io(S,l.batchSize,l.numHeads,$,l.sequenceLength,x,d,c),{inputs:d&&c?[S,d,c]:[S],outputs:[]});let T=[S,i];m&&B.size(m.dims)>0&&T.push(m),d&&T.push(d),c&&T.push(c),e.compute(no(h,S,i,m,l,$,d,c),{inputs:T,outputs:h>1?[0,2]:[0]})},so=(e,t)=>{let r=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],i=t.sequenceLength,a=t.inputHiddenSize,n=t.headSize,s=12,o={x:Math.ceil(t.headSize/s),y:Math.ceil(t.sequenceLength/s),z:t.batchSize*t.numHeads},u=[e.inputs[0],e.inputs[1],e.inputs[2]],l=[{type:12,data:i},{type:12,data:a},{type:12,data:n},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],d=c=>{let h=b("output_q",u[0].dataType,r),g=b("output_k",u[0].dataType,r),m=b("output_v",u[0].dataType,r),$=w("input",u[0].dataType,u[0].dims),x=w("weight",u[1].dataType,u[1].dims),_=w("bias",u[2].dataType,u[2].dims),y=$.type.storage,S=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${s}u;
  var<workgroup> tileInput: array<${y}, ${s*s}>;
  var<workgroup> tileWeightQ: array<${y}, ${s*s}>;
  var<workgroup> tileWeightK: array<${y}, ${s*s}>;
  var<workgroup> tileWeightV: array<${y}, ${s*s}>;
  ${c.registerUniforms(S).declareVariables($,x,_,h,g,m)}
  ${c.mainStart([s,s,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${y}(0);
    var valueK = ${y}(0);
    var valueV = ${y}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:o,programUniforms:l}),getShaderSource:d},{inputs:u,outputs:[-1,-1,-1]})},oo=(e,t)=>{let r=ro(e.inputs,t),[i,a,n]=so(e,r);return Ta(e,i,a,n,e.inputs[4],void 0,void 0,void 0,e.inputs[5],r)}}),uo,lo,po,co,Zc=k(()=>{"use strict";st(),se(),he(),Ke(),R(),uo=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let r=(i,a,n)=>{let s=a.length;if(s!==i.length)throw new Error(`${n}: num dimensions != ${s}`);a.forEach((o,u)=>{if(o!==i[u])throw new Error(`${n}: dim[${u}] do not match`)})};if(e[0].dims.length>1){let i=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);r(e[1].dims,i,"Invalid input scale"),r(e[2].dims,i,"Invalid input B"),r(e[3].dims,i,"Invalid input mean"),r(e[4].dims,i,"Invalid input var")}else r(e[1].dims,[1],"Invalid input scale"),r(e[2].dims,[1],"Invalid input B"),r(e[3].dims,[1],"Invalid input mean"),r(e[4].dims,[1],"Invalid input var")},lo=(e,t)=>{let{epsilon:r,spatial:i,format:a}=t,n=e[0].dims,s=i?Ge(n[n.length-1]):1,o=a==="NHWC"&&n.length>1?s:1,u=B.size(n)/s,l=i,d=l?n.length:n,c=w("x",e[0].dataType,e[0].dims,s),h=w("scale",e[1].dataType,e[1].dims,o),g=w("bias",e[2].dataType,e[2].dims,o),m=w("inputMean",e[3].dataType,e[3].dims,o),$=w("inputVar",e[4].dataType,e[4].dims,o),x=b("y",e[0].dataType,d,s),_=()=>{let S="";if(i)S=`let cOffset = ${n.length===1?"0u":a==="NHWC"?`outputIndices[${n.length-1}] / ${s}`:"outputIndices[1]"};`;else if(a==="NCHW")S=`
            ${x.indicesSet("outputIndices","0","0")}
            let cOffset = ${x.indicesToOffset("outputIndices")};`;else{S=`var cIndices = ${h.type.indices}(0);
                       cIndices[0] = outputIndices[${n.length-1}];`;for(let T=1;T<h.rank;T++)S+=`cIndices[${T}] = outputIndices[${T}];`;S+=`let cOffset = ${h.indicesToOffset("cIndices")};`}return S},y=S=>`
  const epsilon = ${r};
  ${S.registerUniform("outputSize","u32").declareVariables(c,h,g,m,$,x)}
  ${S.mainStart()}
  ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${x.offsetToIndices(`global_idx * ${s}`)};
    ${_()}
    let scale = ${h.getByOffset("cOffset")};
    let bias = ${g.getByOffset("cOffset")};
    let inputMean = ${m.getByOffset("cOffset")};
    let inputVar = ${$.getByOffset("cOffset")};
    let x = ${c.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${x.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${i}_${s}`,inputDependencies:l?["rank","type","type","type","type"]:void 0},getShaderSource:y,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:l?[{type:12,data:u},...X(n)]:[{type:12,data:u}]})}},po=e=>Re(e),co=(e,t)=>{let{inputs:r,outputCount:i}=e,a=po({...t,outputCount:i});if(ee.webgpu.validateInputContent&&uo(r,a),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(lo(r,a))}}),ho,fo,mo,Qc=k(()=>{"use strict";he(),R(),ho=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},fo=e=>{let t=e[0].dims,r=e[0].dims[2],i=B.size(t)/4,a=e[0].dataType,n=w("input",a,t,4),s=w("bias",a,[r],4),o=w("residual",a,t,4),u=b("output",a,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)}}),getShaderSource:l=>`
  const channels = ${r}u / 4;
  ${l.declareVariables(n,s,o,u)}

  ${l.mainStart()}
    ${l.guardAgainstOutOfBoundsWorkgroupSizes(i)}
    let value = ${n.getByOffset("global_idx")}
      + ${s.getByOffset("global_idx % channels")} + ${o.getByOffset("global_idx")};
    ${u.setByOffset("global_idx","value")}
  }`}},mo=e=>{ho(e.inputs),e.compute(fo(e.inputs))}}),go,Pe,yo,wo,_o,bo,$o,vo,xo,So,To,Eo,ko,Io,zo,Co,Ea,Ao,en,Oo,Ro,Bo,Mo,Do,Po,Uo,Lo,No,qo,Fo,Vo,Go,Wo,jo,Ho,Ko,On,Zo,Rn,Bn,Qo,Xo,Yo,Jo,eu,tu,Mn=k(()=>{"use strict";se(),he(),Ke(),R(),go=(e,t,r,i,a,n,s)=>{let o=Math.ceil(t/4),u="";typeof a=="string"?u=`${a}(a)`:u=a("a");let l=w("inputData",r,[o],4),d=b("outputData",i,[o],4),c=[{name:"vec_size",type:"u32"}];return s&&c.push(...s),`
      ${e.registerUniforms(c).declareVariables(l,d)}

  ${n??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${l.getByOffset("global_idx")};
    ${d.setByOffset("global_idx",u)}
  }`},Pe=(e,t,r,i,a,n=e.dataType,s,o)=>{let u=[{type:12,data:Math.ceil(B.size(e.dims)/4)}];return s&&u.push(...s),{name:t,shaderCache:{hint:a,inputDependencies:["type"]},getShaderSource:l=>go(l,B.size(e.dims),e.dataType,n,r,i,o),getRunData:l=>({outputs:[{dims:e.dims,dataType:n}],dispatchGroup:{x:Math.ceil(B.size(l[0].dims)/64/4)},programUniforms:u})}},yo=e=>{e.compute(Pe(e.inputs[0],"Abs","abs"))},wo=e=>{e.compute(Pe(e.inputs[0],"Acos","acos"))},_o=e=>{e.compute(Pe(e.inputs[0],"Acosh","acosh"))},bo=e=>{e.compute(Pe(e.inputs[0],"Asin","asin"))},$o=e=>{e.compute(Pe(e.inputs[0],"Asinh","asinh"))},vo=e=>{e.compute(Pe(e.inputs[0],"Atan","atan"))},xo=e=>{e.compute(Pe(e.inputs[0],"Atanh","atanh"))},So=e=>Re(e),To=(e,t)=>{let r;switch(t.to){case 10:r="vec4<f16>";break;case 1:r="vec4<f32>";break;case 12:r="vec4<u32>";break;case 6:r="vec4<i32>";break;case 9:r="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(Pe(e.inputs[0],"Cast",r,void 0,t.cacheKey,t.to))},Eo=e=>{let t,r,i=e.length>=2&&e[1].data!==0,a=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=i?e[1].getFloat32Array()[0]:-34028234663852886e22,r=a?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=i?e[1].getUint16Array()[0]:64511,r=a?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return Re({min:t,max:r})},ko=(e,t)=>{let r=t||Eo(e.inputs),i=ot(e.inputs[0].dataType);e.compute(Pe(e.inputs[0],"Clip",a=>`clamp(${a}, vec4<${i}>(uniforms.min), vec4<${i}>(uniforms.max))`,void 0,r.cacheKey,void 0,[{type:e.inputs[0].dataType,data:r.min},{type:e.inputs[0].dataType,data:r.max}],[{name:"min",type:i},{name:"max",type:i}]),{inputs:[0]})},Io=e=>{e.compute(Pe(e.inputs[0],"Ceil","ceil"))},zo=e=>{e.compute(Pe(e.inputs[0],"Cos","cos"))},Co=e=>{e.compute(Pe(e.inputs[0],"Cosh","cosh"))},Ea=e=>Re(e),Ao=(e,t)=>{let r=ot(e.inputs[0].dataType);e.compute(Pe(e.inputs[0],"Elu",i=>`elu_vf32(${i})`,`
  const elu_alpha_ = ${r}(${t.alpha});

  fn elu_f32(a: ${r}) -> ${r} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${r}>) -> vec4<${r}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},en=(e="f32")=>`
const r0: ${e} = 0.3275911;
const r1: ${e} = 0.254829592;
const r2: ${e} = -0.284496736;
const r3: ${e} = 1.421413741;
const r4: ${e} = -1.453152027;
const r5: ${e} = 1.061405429;

fn erf_vf32(v: vec4<${e}>) -> vec4<${e}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,Oo=e=>{let t=ot(e.inputs[0].dataType);e.compute(Pe(e.inputs[0],"Erf",r=>`erf_vf32(${r})`,en(t)))},Ro=e=>{e.compute(Pe(e.inputs[0],"Exp","exp"))},Bo=e=>{e.compute(Pe(e.inputs[0],"Floor","floor"))},Mo=e=>{let t=ot(e.inputs[0].dataType);e.compute(Pe(e.inputs[0],"Gelu",r=>`0.5 * ${r} * (1.0 + erf_vf32(${r} * 0.7071067811865475))`,en(t)))},Do=(e,t)=>{let r=ot(e.inputs[0].dataType);e.compute(Pe(e.inputs[0],"LeakyRelu",i=>`select(leaky_relu_alpha_ * ${i}, ${i}, ${i} >= vec4<${r}>(0.0))`,`const leaky_relu_alpha_ = ${r}(${t.alpha});`,t.cacheKey))},Po=e=>{e.compute(Pe(e.inputs[0],"Not",t=>`!${t}`))},Uo=e=>{e.compute(Pe(e.inputs[0],"Neg",t=>`-${t}`))},Lo=e=>{e.compute(Pe(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},No=e=>{let t=ot(e.inputs[0].dataType);e.compute(Pe(e.inputs[0],"Relu",r=>`select(vec4<${t}>(0.0), ${r}, ${r} > vec4<${t}>(0.0))`))},qo=e=>{e.compute(Pe(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},Fo=e=>Re(e),Vo=(e,t)=>{let r=ot(e.inputs[0].dataType);e.compute(Pe(e.inputs[0],"HardSigmoid",i=>`max(vec4<${r}>(0.0), min(vec4<${r}>(1.0), ${t.alpha} * ${i} + vec4<${r}>(${t.beta})))`,void 0,t.cacheKey))},Go=e=>{let t=ot(e.inputs[0].dataType);e.compute(Pe(e.inputs[0],"HardSwish",r=>`${r} * max(vec4<${t}>(0.0), min(vec4<${t}>(1.0), vec4<${t}>(${t}(1.0 / 6.0)) * ${r} + vec4<${t}>(0.5)))`))},Wo=e=>{e.compute(Pe(e.inputs[0],"Sin","sin"))},jo=e=>{e.compute(Pe(e.inputs[0],"Sinh","sinh"))},Ho=e=>{e.compute(Pe(e.inputs[0],"Sqrt","sqrt"))},Ko=e=>{e.compute(Pe(e.inputs[0],"Tan","tan"))},On=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,Zo=e=>{e.compute(Pe(e.inputs[0],"Tanh",On))},Rn=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${On("v")};
}
`,Bn=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,Qo=e=>{let t=ot(e.inputs[0].dataType);e.compute(Pe(e.inputs[0],"FastGelu",Bn,Rn(t),void 0,e.inputs[0].dataType))},Xo=(e,t)=>{let r=ot(e.inputs[0].dataType);return e.compute(Pe(e.inputs[0],"ThresholdedRelu",i=>`select(vec4<${r}>(0.0), ${i}, ${i} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${r}>(${t.alpha});`,t.cacheKey)),0},Yo=e=>{e.compute(Pe(e.inputs[0],"Log","log"))},Jo=(e,t)=>`
const alpha = vec4<${e}>(${t});
const one = ${e}(1.0);
const zero = ${e}(0.0);

fn quick_gelu_impl(x: vec4<${e}>) -> vec4<${e}> {
  let v = x *alpha;
  var x1 : vec4<${e}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,eu=e=>`quick_gelu_impl(${e})`,tu=(e,t)=>{let r=ot(e.inputs[0].dataType);e.compute(Pe(e.inputs[0],"QuickGelu",eu,Jo(r,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),ru,iu,au,Xc=k(()=>{"use strict";he(),R(),Mn(),ru=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},iu=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let r=w("input",e[0].dataType,e[0].dims,4),i=w("bias",e[0].dataType,[e[0].dims[2]],4),a=b("output",e[0].dataType,t,4),n=B.size(t)/4,s=nt(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(n/64)}}),getShaderSource:o=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${o.declareVariables(r,i,a)}

  ${en(s)}

  ${o.mainStart()}
    ${o.guardAgainstOutOfBoundsWorkgroupSizes(n)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${a.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},au=e=>{ru(e.inputs),e.compute(iu(e.inputs))}}),nu,su,Qt,ou,uu,lu,du,pu,cu,hu,fu,mu,gu,Yc=k(()=>{"use strict";se(),he(),R(),nu=(e,t,r,i,a,n,s,o,u,l,d,c)=>{let h,g;typeof o=="string"?h=g=(y,S)=>`${o}((${y}),(${S}))`:typeof o=="function"?h=g=o:(h=o.scalar,g=o.vector);let m=b("outputData",d,i.length,4),$=w("aData",u,t.length,4),x=w("bData",l,r.length,4),_;if(a)if(n){let y=B.size(t)===1,S=B.size(r)===1,T=t.length>0&&t[t.length-1]%4===0,E=r.length>0&&r[r.length-1]%4===0;y||S?_=m.setByOffset("global_idx",g(y?`${$.type.value}(${$.getByOffset("0")}.x)`:$.getByOffset("global_idx"),S?`${x.type.value}(${x.getByOffset("0")}.x)`:x.getByOffset("global_idx"))):_=`
            let outputIndices = ${m.offsetToIndices("global_idx * 4u")};
            let offsetA = ${$.broadcastedIndicesToOffset("outputIndices",m)};
            let offsetB = ${x.broadcastedIndicesToOffset("outputIndices",m)};
            ${m.setByOffset("global_idx",g(s||T?$.getByOffset("offsetA / 4u"):`${$.type.value}(${$.getByOffset("offsetA / 4u")}[offsetA % 4u])`,s||E?x.getByOffset("offsetB / 4u"):`${x.type.value}(${x.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else _=m.setByOffset("global_idx",g($.getByOffset("global_idx"),x.getByOffset("global_idx")));else{if(!n)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let y=(S,T,E="")=>{let z=`aData[indexA${T}][componentA${T}]`,C=`bData[indexB${T}][componentB${T}]`;return`
            let outputIndices${T} = ${m.offsetToIndices(`global_idx * 4u + ${T}u`)};
            let offsetA${T} = ${$.broadcastedIndicesToOffset(`outputIndices${T}`,m)};
            let offsetB${T} = ${x.broadcastedIndicesToOffset(`outputIndices${T}`,m)};
            let indexA${T} = offsetA${T} / 4u;
            let indexB${T} = offsetB${T} / 4u;
            let componentA${T} = offsetA${T} % 4u;
            let componentB${T} = offsetB${T} % 4u;
            ${S}[${T}] = ${E}(${h(z,C)});
          `};d===9?_=`
            var data = vec4<u32>(0);
            ${y("data",0,"u32")}
            ${y("data",1,"u32")}
            ${y("data",2,"u32")}
            ${y("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:_=`
            ${y("outputData[global_idx]",0)}
            ${y("outputData[global_idx]",1)}
            ${y("outputData[global_idx]",2)}
            ${y("outputData[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables($,x,m)}

        ${c??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${_}
      }`},su=(e,t,r,i,a,n,s=r.dataType)=>{let o=r.dims.map(Number),u=i.dims.map(Number),l=!B.areEqual(o,u),d=o,c=B.size(o),h=!1,g=!1,m=[l];if(l){let $=Ut.calcShape(o,u,!1);if(!$)throw new Error("Can't perform binary op on the given tensors");d=$.slice(),c=B.size(d);let x=B.size(o)===1,_=B.size(u)===1,y=o.length>0&&o[o.length-1]%4===0,S=u.length>0&&u[u.length-1]%4===0;m.push(x),m.push(_),m.push(y),m.push(S);let T=1;for(let E=1;E<d.length;E++){let z=o[o.length-E],C=u[u.length-E];if(z===C)T*=z;else break}T%4===0?(g=!0,h=!0):(x||_||y||S)&&(h=!0)}else h=!0;return m.push(h),{name:e,shaderCache:{hint:t+m.map($=>$.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:$=>nu($,o,u,d,h,l,g,a,r.dataType,i.dataType,s,n),getRunData:()=>({outputs:[{dims:d,dataType:s}],dispatchGroup:{x:Math.ceil(c/64/4)},programUniforms:[{type:12,data:Math.ceil(B.size(d)/4)},...X(o,u,d)]})}},Qt=(e,t,r,i,a,n)=>{e.compute(su(t,a??"",e.inputs[0],e.inputs[1],r,i,n))},ou=e=>{Qt(e,"Add",(t,r)=>`${t}+${r}`)},uu=e=>{Qt(e,"Div",(t,r)=>`${t}/${r}`)},lu=e=>{Qt(e,"Equal",{scalar:(t,r)=>`u32(${t}==${r})`,vector:(t,r)=>`vec4<u32>(${t}==${r})`},void 0,void 0,9)},du=e=>{Qt(e,"Mul",(t,r)=>`${t}*${r}`)},pu=e=>{let t=w("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;Qt(e,"Pow",{scalar:(r,i)=>`pow_custom(${r},${i})`,vector:(r,i)=>`pow_vector_custom(${r},${i})`},`
    fn pow_custom(a : ${t}, b : ${t}) -> ${t} {
      if (b == ${t}(0.0)) {
        return ${t}(1.0);
      } else if (a < ${t}(0.0) && f32(b) != floor(f32(b))) {
        return ${t}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${t}(1.0), round(f32(abs(b) % ${t}(2.0))) != 1.0) * ${t}(${t==="i32"?"round":""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${t}>, b : vec4<${t}>) -> vec4<${t}> {
      // TODO: implement vectorized pow
      return vec4<${t}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},cu=e=>{Qt(e,"Sub",(t,r)=>`${t}-${r}`)},hu=e=>{Qt(e,"Greater",{scalar:(t,r)=>`u32(${t}>${r})`,vector:(t,r)=>`vec4<u32>(${t}>${r})`},void 0,void 0,9)},fu=e=>{Qt(e,"Less",{scalar:(t,r)=>`u32(${t}<${r})`,vector:(t,r)=>`vec4<u32>(${t}<${r})`},void 0,void 0,9)},mu=e=>{Qt(e,"GreaterOrEqual",{scalar:(t,r)=>`u32(${t}>=${r})`,vector:(t,r)=>`vec4<u32>(${t}>=${r})`},void 0,void 0,9)},gu=e=>{Qt(e,"LessOrEqual",{scalar:(t,r)=>`u32(${t}<=${r})`,vector:(t,r)=>`vec4<u32>(${t}<=${r})`},void 0,void 0,9)}}),yu,wu,_u,bu,Jc=k(()=>{"use strict";se(),he(),Ke(),R(),yu=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let r=0,i=e[r],a=i.dataType,n=i.dims.length;e.forEach((s,o)=>{if(o!==r){if(s.dataType!==a)throw new Error("input tensors should be one type");if(s.dims.length!==n)throw new Error("input tensors should have the same shape");s.dims.forEach((u,l)=>{if(l!==t&&u!==i.dims[l])throw new Error("non concat dimensions must match")})}})},wu=(e,t,r,i,a=0)=>{let n=e.reduce((_,y)=>_+B.size(y.dims),0),s=new Array(e.length),o=new Array(e.length),u=new Array(e.length),l=0,d=a,c=[],h=[],g=[{type:12,data:n}];for(let _=0;_<e.length;++_)s[_]=l,o[_]=d,l+=B.size(e[_].dims),d+=e[_].dims[t],h.push(e[_].dims.length),u[_]=w(`input${_}`,i,h[_]),c.push("rank"),g.push({type:12,data:s[_]}),g.push({type:12,data:o[_]});for(let _=0;_<e.length;++_)g.push(...X(e[_].dims));g.push(...X(r));let m=b("output",i,r.length),$=u.map((_,y)=>{let S=`
        let inputOffset = ${`global_idx - uniforms.inputOffset${y}`};
        var outputIndices = ${_.offsetToIndices("inputOffset")};
        ${m.indicesGet("outputIndices",t)} += uniforms.outputAxisOffset${y};
        ${m.setByIndices("outputIndices",_.getByOffset("inputOffset"))}`;return e.length===1?S:y===0?`if (inputIndex == 0u) {${S}}`:y===e.length-1?`else {${S}}`:`else if (inputIndex == ${y}u) {${S}}`}).join(`
`),x=_=>`

  ${(()=>{_.registerUniform("outputSize","u32");for(let y=0;y<e.length;y++)_.registerUniform(`inputOffset${y}`,"u32"),_.registerUniform(`outputAxisOffset${y}`,"u32");return _.declareVariables(...u,m)})()}

  fn calculateInputIndex(global_idx: u32) -> u32 {
    ${u.slice(1).map((y,S)=>`if (global_idx < uniforms.inputOffset${S+1}) {
      return ${S}u;
    }`).join(`
`)}
    return ${e.length-1}u;
  }

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    let inputIndex = calculateInputIndex(global_idx);
    ${$}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:c},getRunData:()=>({outputs:[{dims:r,dataType:i}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:g}),getShaderSource:x}},_u=(e,t)=>{let r=e.inputs,i=r[0].dims,a=B.normalizeAxis(t.axis,i.length);yu(r,a);let n=i.slice();n[a]=r.reduce((l,d)=>l+(d.dims.length>a?d.dims[a]:0),0);let s=r.filter(l=>B.size(l.dims)>0);if(s.length===0){e.output(0,n);return}let o=e.deviceLimits.maxStorageBuffersPerShaderStage-1,u=0;for(let l=0;l<s.length;l+=o){let d=s.slice(l,l+o);e.compute(wu(d,a,n,r[0].dataType,u),{inputs:d,outputs:[0]}),u+=d.reduce((c,h)=>c+h.dims[a],0)}},bu=e=>Re({axis:e.axis})}),oi,ui,li,Dn,di=k(()=>{"use strict";se(),he(),oi=(e,t,r="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${r}(uniforms.clip_min)), ${t}(${r}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${r}(uniforms.alpha) * value + ${r}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${r}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},ui=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},li=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},Dn=e=>{let t=(e==null?void 0:e.activation)||"";if(t==="HardSigmoid"){let[r,i]=(e==null?void 0:e.activation_params)||[.2,.5];return{activation:t,alpha:r,beta:i}}else if(t==="Clip"){let[r,i]=(e==null?void 0:e.activation_params)||[ma,xi];return{activation:t,clipMax:i,clipMin:r}}else if(t==="LeakyRelu"){let[r]=(e==null?void 0:e.activation_params)||[.01];return{activation:t,alpha:r}}return{activation:t}}}),_t,$u,Pn=k(()=>{"use strict";_t=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},$u=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),vu,eh=k(()=>{"use strict";vu=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),ka,Un,Ln=k(()=>{"use strict";se(),he(),R(),di(),ka=(e,t,r,i,a)=>{let n=i-r;return`
      ${Array.from({length:r}).map((s,o)=>`
      if (${f(t.shape,o,t.rank)} != 1) {
        ${t.indicesSet(e,o,f(a,o+n,i))}
      } else {
        ${t.indicesSet(e,o,0)}
      }`).join("")}
`},Un=(e,t,r,i,a=!1,n)=>{let s=e[0].dims,o=e[1].dims,u=s[s.length-2],l=o[o.length-1],d=s[s.length-1],c=Ge(l),h=Ge(d),g=Ge(u),m=B.size(r)/c/g,$=e.length>2,x=i?i.slice(0,-2):r.slice(0,-2),_=[B.size(x),u,l],y=[{type:12,data:m},{type:12,data:u},{type:12,data:l},{type:12,data:d}];ui(t,y),y.push(...X(x,s,o)),$&&y.push(...X(e[2].dims)),y.push(...X(_));let S=T=>{let E=D("batch_dims",e[0].dataType,x.length),z=w("a",e[0].dataType,s.length,h),C=w("b",e[1].dataType,o.length,c),M=b("output",e[0].dataType,_.length,c),U=nt(M.type.tensor),V=oi(t,M.type.value,U),ae=[z,C],K="";if($){let De=a?c:1;ae.push(w("bias",e[2].dataType,e[2].dims.length,De)),K=`${a?`value += bias[col / ${De}];`:`value += ${M.type.value}(bias[row + i]);`}`}let Y=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];li(t,Y);let Ce=()=>{let De=`var a_data: ${z.type.value};`;for(let pe=0;pe<h;pe++)De+=`
              let b_data${pe} = b[(b_offset + (k + ${pe}) * uniforms.N + col) / ${c}];`;for(let pe=0;pe<g;pe++){De+=`a_data = a[(a_offset + (row + ${pe}) * uniforms.K + k) / ${h}];`;for(let be=0;be<h;be++)De+=`
            values[${pe}] = fma(${C.type.value}(a_data${h===1?"":`[${be}]`}), b_data${be}, values[${pe}]);
`}return De};return`
  ${T.registerUniforms(Y).registerInternalVariables(E).declareVariables(...ae,M)}
  ${T.mainStart()}
    ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${c})) * ${c};
    var index1 = global_idx / (uniforms.N / ${c});
    let stride1 = uniforms.M / ${g};
    let row = (index1 % stride1) * ${g};
    let batch = index1 / stride1;

    ${r.length===2?"":`let batch_indices = ${E.offsetToIndices("batch")};`}

    var a_indices: ${z.type.indices};
    ${ka("a_indices",z,z.rank-2,E.rank,"batch_indices")}
    ${z.indicesSet("a_indices",z.rank-2,0)}
    ${z.indicesSet("a_indices",z.rank-1,0)}
    let a_offset = ${z.indicesToOffset("a_indices")};

    var b_indices: ${C.type.indices};
    ${ka("b_indices",C,C.rank-2,E.rank,"batch_indices")}
    ${C.indicesSet("b_indices",C.rank-2,0)}
    ${C.indicesSet("b_indices",C.rank-1,0)}
    let b_offset = ${C.indicesToOffset("b_indices")};
    var values: array<${M.type.value}, ${g}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${h}) {
      ${Ce()}
    }
    for (var i = 0u; i < ${g}u; i++) {
      var value = values[i];
      ${K}
      ${V}
      let cur_indices = ${M.type.indices}(batch, row + i, col);
      let offset = ${M.indicesToOffset("cur_indices")};
      ${M.setByOffset(`offset / ${c}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${c};${h};${g};${a}`,inputDependencies:$?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:n?n(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:y}),getShaderSource:S}}}),xu,Su,Nn,qn,Tu,Fn,Eu,tn,Vn=k(()=>{"use strict";se(),he(),R(),di(),Ln(),Pn(),xu=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,Su=(e,t)=>e?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${t===3?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached.w + acc[i];"}
        }`,Nn=(e,t,r="f32",i,a=!1,n=32,s=!1,o=32)=>{let u=t[1]*e[1],l=t[0]*e[0],d=a?u:n,c=a?n:u,h=d/t[0],g=n/t[1];if(!((a&&h===4&&e[1]===4||!a&&(h===3||h===4))&&d%t[0]===0&&n%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${a} is true, innerElementSize ${h} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${h} must be 3 or 4.
  tileAWidth ${d} must be divisible by workgroupSize[0]${t[0]}. tileInner ${n} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${h}<${r}>, ${d/h}>, ${c}>;
var<workgroup> mm_Bsub: array<array<vec4<${r}>, ${l/e[0]}>, ${n}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${h};
const tileInner = ${n};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${s?"0":"i32(globalId.z)"};
  ${i?`let batchIndices = ${i.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${u};

  let num_tiles = ${s?`${Math.ceil(o/n)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${s?`i32(globalId.z) * ${o}`:"0"};

  var acc: array<vec4<${r}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${g};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${xu(a,i)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${g}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${i?", batchIndices":""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${h===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${Su(a,h)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},qn=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,Tu=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",Fn=(e,t,r="f32",i,a=!1,n=32,s=!1,o=32,u=!1)=>{let l=e[1]*t[1],d=e[0]*t[0],c=a?l:n,h=a?n:l;if(!(h%t[1]===0&&c%t[0]===0&&n%t[1]===0))throw new Error(`tileAHight ${h} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${c} must be divisible by workgroupSize[0]${t[0]}, tileInner ${n} must be divisible by workgroupSize[1]${t[1]}`);let g=h/t[1],m=c/t[0],$=n/t[1],x=u?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${l};
    let globalColStart = i32(workgroupId.x) * ${d};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${h}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${c}; inputCol = inputCol + ${t[0]}) {
          ${qn(a,i)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${n}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${d}; inputCol = inputCol + ${t[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${i?", batchIndices":""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${r}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${a?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${t[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${t[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${l};

let tileRowA = i32(localId.y) * ${g};
let tileColA = i32(localId.x) * ${m};
let tileRowB = i32(localId.y) * ${$};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${g}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${m}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${qn(a,i)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${$}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${i?", batchIndices":""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${r}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${Tu(a)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;return`
  var<workgroup> mm_Asub : array<array<${r}, ${c}>, ${h}>;
  var<workgroup> mm_Bsub : array<array<${r}, ${d}>, ${n}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${n};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${s?"0":"i32(globalId.z)"};
    ${i?`let batchIndices = ${i.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${s?`${Math.ceil(o/n)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${s?`i32(globalId.z) * ${o}`:"0"};

    var acc : array<array<${r}, colPerThread>, rowPerThread>;
    ${x}
  }
`},Eu=(e,t,r,i,a=!1)=>{let[n,s,o,u]=i,l=nt(i[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${n.type.indices}) -> ${_t(e,l)} {
      var value = ${_t(e,l)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${s.type.indices};
        ${ka("aIndices",s,s.rank-2,n.rank,"batchIndices")}
        ${s.indicesSet("aIndices",s.rank-2,"u32(row)")}
        ${s.indicesSet("aIndices",s.rank-1,"u32(colIn)")}
        value = ${s.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${n.type.indices}) -> ${_t(e,l)} {
      var value = ${_t(e,l)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${o.type.indices};
        ${ka("bIndices",o,o.rank-2,n.rank,"batchIndices")}
        ${o.indicesSet("bIndices",o.rank-2,"u32(row)")}
        ${o.indicesSet("bIndices",o.rank-1,"u32(colIn)")}
        value = ${o.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${_t(e,l)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${a?"bias[colIn]":`${_t(e,l)}(bias[row])`};`:""}
        ${r}
        ${u.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},tn=(e,t,r,i,a=!1,n)=>{let s=e[0].dims,o=e[1].dims,u=s.slice(0,-2),l=o.slice(0,-2),d=i?i.slice(0,-2):r.slice(0,-2),c=B.size(d),h=s[s.length-2],g=s[s.length-1],m=o[o.length-1],$=g%4===0&&m%4===0,x=h<=8?[4,1,1]:[4,4,1],_=[8,8,1],y=[Math.ceil(m/_[0]/x[0]),Math.ceil(h/_[1]/x[1]),Math.ceil(c/_[2]/x[2])],S=$?4:1,T=[...u,h,g/S],E=T.length,z=[...l,g,m/S],C=z.length,M=[c,h,m/S],U=[{type:6,data:h},{type:6,data:m},{type:6,data:g}];ui(t,U),U.push(...X(d,T,z));let V=["rank","rank"],ae=e.length>2;ae&&(U.push(...X(e[2].dims)),V.push("rank")),U.push(...X(M));let K=Y=>{let Ce=d.length,De=D("batchDims",e[0].dataType,Ce,1),pe=nt(e[0].dataType),be=w("a",e[0].dataType,E,S),Me=w("b",e[1].dataType,C,S),le=b("result",e[0].dataType,M.length,S),Je=[be,Me];if(ae){let Ze=a?S:1;Je.push(w("bias",e[2].dataType,e[2].dims.length,Ze))}let P=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];li(t,P);let te=nt(le.type.tensor),oe=oi(t,le.type.value,te),F=Eu(S,ae,oe,[De,be,Me,le],a);return`
  ${Y.registerUniforms(P).registerInternalVariables(De).declareVariables(...Je,le)}
  ${F}
  ${$?Nn(x,_,pe,De):Fn(x,_,pe,De)}
                   `};return{name:"MatMul",shaderCache:{hint:`${x};${t.activation};${$};${a}`,inputDependencies:V},getRunData:()=>({outputs:[{dims:n?n(r):r,dataType:e[0].dataType}],dispatchGroup:{x:y[0],y:y[1],z:y[2]},programUniforms:U}),getShaderSource:K}}}),ku,Iu,th=k(()=>{"use strict";se(),Ot(),R(),di(),Pn(),eh(),Vn(),ku=(e,t,r,i,a=!1,n,s=4,o=4,u=4,l="f32")=>{let d=U=>{switch(U){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${l}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${U} is not supported.`)}},c=U=>{switch(U){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${U} is not supported.`)}},h=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,g=e?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,m=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",$=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",x=e?"row":"col",_=e?"col":"row",y=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${x} / outWidth;
    let outCol = ${x} % outWidth;

    let WRow = ${_} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${_} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${_} % inChannels;
    var resData = ${_t(s,l)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${m} && xCol >= 0 && xCol < ${$}) {
      ${h}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${d(s)}
    }
    return resData;`,S=e?t&&i?`
    let col = colIn * ${s};
    ${y}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${y}
    }
    return ${_t(s,l)}(0.0);`:i&&r?`
    let col = colIn * ${s};
    ${y}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${y}
    }
    return ${_t(s,l)}(0.0);`,T=e?i&&r?c(o):`
    let col = colIn * ${o};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${c(o)}
    }
    return ${_t(o,l)}(0.0);`:`
    let col = colIn * ${o};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${c(o)}
    }
    return ${_t(o,l)}(0.0);`,E=_t(u,l),z=_t(e?s:o,l),C=_t(e?o:s,l),M=oi(n,E,l);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${z} {
      ${e?S:T}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${C} {
      ${e?T:S}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${E}) {
      let col = colIn * ${u};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${g}
      ${$u(a)}
      ${M}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},Iu=(e,t,r,i,a,n,s,o,u)=>{let l=t.format==="NHWC",d=l?e[0].dims[3]:e[0].dims[1],c=r[0],h=l?r[2]:r[3],g=l?r[1]:r[2],m=l?r[3]:r[1],$=l&&(d%4===0||d%3===0)&&m%4===0,x=l?m:h*g,_=l?h*g:m,y=[8,8,1],S=i<=8?[4,1,1]:[4,4,1],T=[Math.ceil(x/y[0]/S[0]),Math.ceil(_/y[1]/S[1]),Math.ceil(c/y[2]/S[2])];ke("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${T}`);let E=$?l&&d%4!==0?3:4:1,z=y[1]*S[1],C=y[0]*S[0],M=Math.max(y[0]*E,y[1]),U=i%z===0,V=a%C===0,ae=n%M===0,K=$?[E,4,4]:[1,1,1],Y=[{type:6,data:i},{type:6,data:a},{type:6,data:n},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];ui(t,Y),Y.push(...X(e[0].dims,e[1].dims));let Ce=["rank","rank"];s&&(Y.push(...X(e[2].dims)),Ce.push("rank")),Y.push(...X(r));let De=pe=>{let be=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];li(t,be);let Me=$?4:1,le=nt(e[0].dataType),Je=`
      fn setOutputAtIndex(flatIndex : i32, value : ${$?`vec4<${le}>`:le}) {
        result[flatIndex] = ${$?`vec4<${le}>`:le}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${$?`vec4<${le}>`:le}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${$?"/ 4":""}, value);
      }`,P=w("x",e[0].dataType,e[0].dims.length,E===3?1:E),te=w("w",e[1].dataType,e[1].dims.length,Me),oe=[P,te],F=b("result",e[0].dataType,r.length,Me);if(s){let Ze=w("bias",e[2].dataType,e[2].dims.length,Me);oe.push(Ze),Je+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${$?`vec4<${le}>`:le} {
          return bias[coords.${l?"w":"y"}${$?"/ 4":""}];
        }`}return`
        ${vu("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${pe.registerUniforms(be).declareVariables(...oe,F)}
        ${Je}
        ${ku(l,U,V,ae,s,t,K[0],K[1],K[2],le)}
        ${$?Nn(S,y,le,void 0,!l,M):Fn(S,y,le,void 0,!l,M,!1,void 0,o)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${E};${$};${U};${V};${ae};${z};${C};${M}`,inputDependencies:Ce},getRunData:()=>({outputs:[{dims:u?u(r):r,dataType:e[0].dataType}],dispatchGroup:{x:T[0],y:T[1],z:T[2]},programUniforms:Y}),getShaderSource:De}}}),zu,Gn,Ia,Cu,Wn,Au,Ou,Ru,rh=k(()=>{"use strict";se(),Ot(),he(),R(),di(),Pn(),zu=e=>{let t=1;for(let r=0;r<e.length;r++)t*=e[r];return t},Gn=e=>typeof e=="number"?[e,e,e]:e,Ia=(e,t)=>t<=1?e:e+(e-1)*(t-1),Cu=(e,t,r,i=1)=>{let a=Ia(t,i);return Math.floor((e[0]*(r-1)-r+a)/2)},Wn=(e,t,r,i,a)=>{a==null&&(a=Cu(e,t[0],i[0]));let n=[0,0,0,r];for(let s=0;s<3;s++)e[s]+2*a>=t[s]&&(n[s]=Math.trunc((e[s]-t[s]+2*a)/i[s]+1));return n},Au=(e,t,r,i,a,n,s,o,u,l)=>{let d,c,h,g;if(e==="VALID"&&(e=0),typeof e=="number"){d={top:e,bottom:e,left:e,right:e,front:e,back:e};let m=Wn([t,r,i,1],[o,u,l],1,[a,n,s],e);c=m[0],h=m[1],g=m[2]}else if(Array.isArray(e)){if(!e.every(($,x,_)=>$===_[0]))throw Error(`Unsupported padding parameter: ${e}`);d={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let m=Wn([t,r,i,1],[o,u,l],1,[a,n,s],e[0]);c=m[0],h=m[1],g=m[2]}else if(e==="SAME_UPPER"){c=Math.ceil(t/a),h=Math.ceil(r/n),g=Math.ceil(i/s);let m=(c-1)*a+o-t,$=(h-1)*n+u-r,x=(g-1)*s+l-i,_=Math.floor(m/2),y=m-_,S=Math.floor($/2),T=$-S,E=Math.floor(x/2),z=x-E;d={top:S,bottom:T,left:E,right:z,front:_,back:y}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:d,outDepth:c,outHeight:h,outWidth:g}},Ou=(e,t,r,i,a,n=!1,s="channelsLast")=>{let o,u,l,d,c;if(s==="channelsLast")[o,u,l,d,c]=e;else if(s==="channelsFirst")[o,c,u,l,d]=e;else throw new Error(`Unknown dataFormat ${s}`);let[h,,g,m,$]=t,[x,_,y]=Gn(r),[S,T,E]=Gn(i),z=Ia(g,S),C=Ia(m,T),M=Ia($,E),{padInfo:U,outDepth:V,outHeight:ae,outWidth:K}=Au(a,u,l,d,x,_,y,z,C,M),Y=n?h*c:h,Ce=[0,0,0,0,0];return s==="channelsFirst"?Ce=[o,Y,V,ae,K]:s==="channelsLast"&&(Ce=[o,V,ae,K,Y]),{batchSize:o,dataFormat:s,inDepth:u,inHeight:l,inWidth:d,inChannels:c,outDepth:V,outHeight:ae,outWidth:K,outChannels:Y,padInfo:U,strideDepth:x,strideHeight:_,strideWidth:y,filterDepth:g,filterHeight:m,filterWidth:$,effectiveFilterDepth:z,effectiveFilterHeight:C,effectiveFilterWidth:M,dilationDepth:S,dilationHeight:T,dilationWidth:E,inShape:e,outShape:Ce,filterShape:t}},Ru=(e,t,r,i,a,n)=>{let s=n==="channelsLast",o=s?e[0].dims[3]:e[0].dims[1],u=!1,l=[64,1,1],d={x:r.map((y,S)=>S)},c=[Math.ceil(zu(d.x.map(y=>r[y]))/l[0]),1,1];ke("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${c}`);let h=u?s&&o%4!==0?3:4:1,g=B.size(r),m=[{type:12,data:g},{type:12,data:i},{type:12,data:a},{type:12,data:t.strides},{type:12,data:t.dilations}];ui(t,m),m.push(...X(e[0].dims,e[1].dims));let $=["rank","rank"],x=e.length===3;x&&(m.push(...X(e[2].dims)),$.push("rank")),m.push(...X(r));let _=y=>{let S=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:i.length},{name:"pads",type:"u32",length:a.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];li(t,S);let T=u?4:1,E=nt(e[0].dataType),z=w("x",e[0].dataType,e[0].dims.length,h===3?1:h),C=w("W",e[1].dataType,e[1].dims.length,T),M=[z,C],U=b("result",e[0].dataType,r.length,T),V="";if(x){let Y=w("bias",e[2].dataType,e[2].dims.length,T);M.push(Y),V+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${u?`vec4<${E}>`:E} {
          return bias[${s?f("coords",4,5):f("coords",1,5)}${u?"/ 4":""}];
        }`}let ae=_t(h,E),K=oi(t,ae,E);return`
            ${V}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> ${E} {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${z.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> ${E} {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${C.getByIndices("aIndices")};
            }
          ${y.registerUniforms(S).declareVariables(...M,U)}
          ${y.mainStart()}
          ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${U.offsetToIndices("global_idx")};
              let batch = ${f("coords",0,z.rank)};
              let d2 = ${s?f("coords",z.rank-1,z.rank):f("coords",1,z.rank)};
              let xFRCCorner = vec3<u32>(${s?f("coords",1,z.rank):f("coords",2,z.rank)},
              ${s?f("coords",2,z.rank):f("coords",3,z.rank)},
              ${s?f("coords",3,z.rank):f("coords",4,z.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${s?f("uniforms.x_shape",1,z.rank):f("uniforms.x_shape",2,z.rank)};
              let xShapeZ = ${s?f("uniforms.x_shape",2,z.rank):f("uniforms.x_shape",3,z.rank)};
              let xShapeW = ${s?f("uniforms.x_shape",3,z.rank):f("uniforms.x_shape",4,z.rank)};
              let xShapeU = ${s?f("uniforms.x_shape",4,z.rank):f("uniforms.x_shape",1,z.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = ${E}(0);
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${s?`let xValues = vec4<${E}>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<${E}>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<${E}>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${s?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${s?`let xValues = vec2<${E}>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<${E}>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<${E}>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${s?`let xValues = vec3<${E}>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<${E}>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<${E}>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${x?"value = value + getBiasByOutputCoords(coords)":""};
              ${K}
              result[global_idx] = ${E}(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${s};${h};${x}`,inputDependencies:$},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:c[0],y:c[1],z:c[2]},programUniforms:m}),getShaderSource:_}}}),Bu,Mu,ih=k(()=>{"use strict";se(),he(),R(),di(),Bu=(e,t,r,i)=>{let a=e.length>2,n=a?"value += b[output_channel];":"",s=e[0].dims,o=e[1].dims,u=t.format==="NHWC",l=u?r[3]:r[1],d=l/t.group,c=u&&d>=4?Ge(l):1,h=B.size(r)/c,g=[{type:12,data:h},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:d}];ui(t,g),g.push(...X(s,[o[0],o[1],o[2],o[3]/c]));let m=a?["rank","rank","rank"]:["rank","rank"];g.push(...X([r[0],r[1],r[2],r[3]/c]));let $=x=>{let _=b("output",e[0].dataType,r.length,c),y=nt(_.type.tensor),S=oi(t,_.type.value,y),T=w("x",e[0].dataType,s.length),E=w("w",e[1].dataType,o.length,c),z=[T,E];a&&z.push(w("b",e[2].dataType,e[2].dims,c));let C=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];li(t,C);let M=u?`
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${T.get("batch","xHeight","xWidth","input_channel")};
            let wVal = ${E.get("wHeight","wWidth","wInChannel","output_channel")};
            value += xVal * wVal;
          }
        }
      }
      `:`
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${T.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${E.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${x.registerUniforms(C).declareVariables(...z,_)}

  ${x.mainStart()}
    ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${_.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${u?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${u?1:2}], outputIndices[${u?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${c} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${u?2:1}];

    var value: ${_.type.value} = ${_.type.value}(0);
    ${M}
    ${n}
    ${S}
    ${_.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${c}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:g}),getShaderSource:$}},Mu=(e,t,r,i)=>{let a=e.length>2,n=Ge(r[3]),s=Ge(r[2]),o=B.size(r)/n/s,u=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/n],l=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/n],d=[r[0],r[1],r[2],r[3]/n],c=[{type:12,data:o},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];ui(t,c),c.push(...X(u,l,d));let h=(s-1)*t.strides[1]+l[1],g=m=>{let $=b("output",e[0].dataType,d.length,n),x=nt($.type.tensor),_=oi(t,$.type.value,x),y=w("x",e[0].dataType,u.length,n),S=w("w",e[1].dataType,l.length,n),T=[y,S];a&&T.push(w("b",e[2].dataType,e[2].dims,n));let E=a?"value += b[output_channel];":"",z=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return li(t,z),`
  ${m.registerUniforms(z).declareVariables(...T,$)}
  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${s}u;
    let col = (index1 % width1) * ${s}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${y.type.value}, ${h}>;
    var values: array<${$.type.value}, ${s}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${l[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${h}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${y.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${y.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${l[1]}; w_width++) {
          let w_val = ${S.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${s}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${s}u; i++) {
      var value = values[i];
      ${E}
      ${_}
      ${$.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${n};${s};${h};${l[0]};${l[1]}`,inputDependencies:a?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:c}),getShaderSource:g}}}),Du,rn,Pu,an,jn,Hn,Uu,Lu,Kn,ah=k(()=>{"use strict";he(),th(),rh(),Vn(),ih(),di(),Ln(),Ue(),Du=(e,t,r,i,a,n)=>{let s=e[0],o=e.slice(n?1:2,n?3:4),u=o.length,l=t[0],d=t.slice(2).map((h,g)=>h+(h-1)*(r[g]-1)),c=o.map((h,g)=>h+i[g]+i[g+u]).map((h,g)=>Math.floor((h-d[g]+a[g])/a[g]));return c.splice(0,0,s),c.splice(n?3:1,0,l),c},rn=[2,3,1,0],Pu=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[1]*t.group;if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let a=e[0].dims.length-2;if(t.dilations.length!==a)throw new Error(`dilations should be ${a}D`);if(t.strides.length!==a)throw new Error(`strides should be ${a}D`);if(t.pads.length!==a*2)throw new Error(`pads should be ${a*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},an=(e,t)=>{let r=e.kernelShape.slice();r.length<t[1].dims.length-2&&r.push(...Array(t[1].dims.length-2-r.length).fill(0));for(let n=2;n<t[1].dims.length;++n)r[n-2]===0&&(r[n-2]=t[1].dims[n]);let i=e.pads.slice();Lt.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,r,i,e.format==="NHWC",e.autoPad);let a=Object.assign({},e);return Object.assign(a,{kernelShape:r,pads:i}),a},jn=e=>{let t=Dn(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],a=e.dilations,n=e.group,s=e.kernel_shape,o=e.pads,u=e.strides,l=e.w_is_const();return{autoPad:i,format:r,dilations:a,group:n,kernelShape:s,pads:o,strides:u,wIsConst:l,...t,cacheKey:`${e.format};${t.activation};`}},Hn=(e,t,r,i)=>{let a=r.format==="NHWC",n=Du(t[0].dims,t[1].dims,r.dilations,r.pads,r.strides,a);if(r.group!==1){let z=[t[0]];if(a){let C=e.kernelCustomData.wT??e.compute(Ie(t[1],rn),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=C),z.push(C)}else z.push(t[1]);t.length===3&&z.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&a&&t[1].dims[0]===r.group&&t[1].dims[1]===1&&r.dilations[0]===1&&r.dilations[1]===1?e.compute(Mu(z,r,n,i),{inputs:z}):e.compute(Bu(z,r,n,i),{inputs:z});return}let s=t.length===3,o=t[0].dims[a?1:2],u=t[0].dims[a?2:3],l=t[0].dims[a?3:1],d=t[1].dims[2],c=t[1].dims[3],h=n[a?1:2],g=n[a?2:3],m=n[a?3:1],$=a&&d===o&&c===u&&r.pads[0]===0&&r.pads[1]===0;if($||d===1&&c===1&&r.dilations[0]===1&&r.dilations[1]===1&&r.strides[0]===1&&r.strides[1]===1&&r.pads[0]===0&&r.pads[1]===0){let z=n[0],C,M,U,V=[];if(a){let Y=e.kernelCustomData.wT??e.compute(Ie(t[1],rn),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];if(r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=Y),$){let Ce=o*u*l;C=t[0].reshape([1,z,Ce]),M=Y.reshape([1,Ce,m]),U=[1,z,m]}else C=t[0].reshape([z,o*u,l]),M=Y.reshape([1,l,m]),U=[z,h*g,m];V.push(C),V.push(M)}else C=t[0].reshape([z,l,o*u]),M=t[1].reshape([1,m,l]),U=[z,m,h*g],V.push(M),V.push(C);s&&V.push(t[2]);let ae=U[2],K=V[0].dims[V[0].dims.length-1];ae<8&&K<8?e.compute(Un(V,r,n,U,a,i),{inputs:V}):e.compute(tn(V,r,n,U,a,i),{inputs:V});return}let x=!0,_=e.kernelCustomData.wT??e.compute(Ie(t[1],rn),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=_);let y=[t[0],_];s&&y.push(t[2]);let S=a?h*g:m,T=a?m:h*g,E=d*c*l;e.compute(Iu(y,r,n,S,T,E,s,x,i),{inputs:y})},Uu=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let a=[0,t.pads[0],0,t.pads[1]],n=[1].concat(t.strides),s=[1].concat(t.dilations),o=[1].concat(t.kernelShape),u=an({...t,pads:a,strides:n,dilations:s,kernelShape:o},i);Hn(e,i,u,l=>r?[l[0],l[2],l[3]]:[l[0],l[1],l[3]])},Lu=(e,t,r)=>{let i=r.format==="NHWC"?"channelsLast":"channelsFirst",a=an(r,t),n=r.autoPad==="NOTSET"?r.pads:r.autoPad,s=Ou(t[0].dims,t[1].dims,r.strides,r.dilations,n,!1,i);e.compute(Ru(t,a,s.outShape,[s.filterDepth,s.filterHeight,s.filterWidth],[s.padInfo.front,s.padInfo.top,s.padInfo.left],i))},Kn=(e,t)=>{if(Pu(e.inputs,t),e.inputs[0].dims.length===3)Uu(e,t);else if(e.inputs[0].dims.length===5)Lu(e,e.inputs,t);else{let r=an(t,e.inputs);Hn(e,e.inputs,r)}}}),Nu,nh=k(()=>{"use strict";se(),Ot(),he(),R(),Nu=(e,t,r)=>{let i=e.length>2,a=t.outputShape,n=t.format==="NHWC",s=t.group,o=e[1].dims,u=o[2]/s,l=o[3],d=n?Ge(u):1,c=n&&l===1&&u>=4,h=c?Math.floor(u/4)*4:Math.floor(u/d)*d,g=u-h,m=n?Ge(l):1,$=n?l===1?d:m:1,x=B.size(a)/m,_=[Math.ceil(x/64),1,1];ke("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${_}`);let y=["rank","rank"],S=[t.strides[0],t.strides[1]],T=[t.kernelShape[n?1:2],t.kernelShape[n?2:3]],E=[t.dilations[0],t.dilations[1]],z=[T[0]+(t.dilations[0]<=1?0:(t.kernelShape[n?1:2]-1)*(t.dilations[0]-1)),T[1]+(t.dilations[1]<=1?0:(t.kernelShape[n?2:3]-1)*(t.dilations[1]-1))],C=[z[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),z[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],M=[{type:12,data:x},{type:12,data:S},{type:12,data:T},{type:12,data:E},{type:12,data:z},{type:6,data:C},{type:12,data:h},{type:12,data:u},{type:12,data:l},...X(e[0].dims,e[1].dims)];i&&(M.push(...X(e[2].dims)),y.push("rank")),M.push(...X(a));let U=V=>{let ae=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:S.length},{name:"filter_dims",type:"u32",length:T.length},{name:"dilations",type:"u32",length:T.length},{name:"effective_filter_dims",type:"u32",length:z.length},{name:"pads",type:"i32",length:C.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],K=nt(e[0].dataType),Y=n?1:2,Ce=n?2:3,De=n?3:1,pe=w("W",e[1].dataType,e[1].dims.length,$),be=w("Dy",e[0].dataType,e[0].dims.length,d),Me=[be,pe];i&&Me.push(w("bias",e[2].dataType,[a[De]].length,m));let le=b("result",e[0].dataType,a.length,m),Je=()=>{let oe="";if(c)d===4?oe+=`
        let xValue = ${be.getByOffset("x_offset")};
        let wValue = ${pe.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:d===2?oe+=`
          dotProd = dotProd + dot(vec4<${K}>(${be.getByOffset("x_offset")}, ${be.getByOffset("x_offset + 1u")}), vec4<${K}>(${pe.getByOffset("w_offset")}, ${pe.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:d===1&&(oe+=`
          dotProd = dotProd + dot(vec4<${K}>(${be.getByOffset("x_offset")}, ${be.getByOffset("x_offset + 1u")}, ${be.getByOffset("x_offset + 2u")}, ${be.getByOffset("x_offset + 3u")}), vec4<${K}>(${pe.getByOffset("w_offset")}, ${pe.getByOffset("w_offset + 1u")}, ${pe.getByOffset("w_offset + 2u")}, ${pe.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(oe+=`
                  let xValue = ${n?be.getByOffset(`${be.indicesToOffset(`${be.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${d}`):be.get("batch","inputChannel","idyR","idyC")};
        `,d===1)oe+=`
          let w_offset = ${pe.indicesToOffset(`${pe.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${pe.getByOffset(`w_offset / ${$}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let F=0;F<d;F++)oe+=`
            let wValue${F} = ${pe.getByOffset(`${pe.indicesToOffset(`${pe.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${F}, wOutChannel)`)} / ${$}`)};
            dotProd = dotProd + xValue[${F}] * wValue${F};`;return oe},P=()=>{if(g===0)return"";if(!c)throw new Error(`packInputAs4 ${c} is not true.`);let oe="";if(d===1){oe+="dotProd = dotProd";for(let F=0;F<g;F++)oe+=`
            + ${be.getByOffset(`x_offset + ${F}`)} * ${pe.getByOffset(`w_offset + ${F}`)}`;oe+=";"}else if(d===2){if(g!==2)throw new Error(`Invalid inputChannelsRemainder ${g}.`);oe+=`
          let xValue = ${be.getByOffset("x_offset")};
          let wValue = ${pe.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return oe},te=`
            let outputIndices = ${le.offsetToIndices(`global_idx * ${m}`)};
            let batch = ${le.indicesGet("outputIndices",0)};
            let d1 = ${le.indicesGet("outputIndices",De)};
            let r = ${le.indicesGet("outputIndices",Y)};
            let c = ${le.indicesGet("outputIndices",Ce)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${le.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${K}(dyRCorner) + ${K}(wR)) / ${K}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${K}(uniforms.Dy_shape[${Y}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }
              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${K}(dyCCorner) + ${K}(wC)) / ${K}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${K}(uniforms.Dy_shape[${Ce}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${c?`
                var x_offset = ${be.indicesToOffset(`${be.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${d};
                var w_offset = ${pe.indicesToOffset(`${pe.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${$};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${c?4:d}) {
                  ${Je()}
                  inputChannel = inputChannel + ${c?4:d};
                }
                ${P()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${i?` + bias[d1 / ${m}]`:""};
            ${le.setByOffset("global_idx","value")};
          `;return`
    ${V.registerUniforms(ae).declareVariables(...Me,le)}
      ${V.mainStart()}
      ${V.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${te}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${d}${$}${m}${c}${g}`,inputDependencies:y},getRunData:()=>({dispatchGroup:{x:_[0],y:_[1],z:_[2]},outputs:[{dims:r?r(a):a,dataType:e[0].dataType}],programUniforms:M}),getShaderSource:U}}}),qu,Fu,Vu,Zn,Gu,Wu,Qn,ju,Hu,sh=k(()=>{"use strict";nh(),di(),Ue(),qu=(e,t,r,i,a,n)=>(e-1)*t+r+(i-1)*a+1-n,Fu=(e,t,r,i,a)=>{let n=Math.floor(e/2);t==="SAME_UPPER"?(r[i]=n,r[a]=e-n):t==="SAME_LOWER"&&(r[i]=e-n,r[a]=n)},Vu=(e,t,r,i,a,n,s,o,u,l)=>{let d=e.length-2,c=l.length===0;u.length<d&&u.push(...Array(d-u.length).fill(0));let h=e[0],g=t[o?3:1]*a;for(let m=0,$=e.length-d-(o?1:0);m<d;++m,++$){let x=e[$],_=c?x*s[m]:l[m],y=qu(x,s[m],n[m],t[$],r[m],_);Fu(y,i,n,m,m+d),c&&l.push(s[m]*(x-1)+u[m]+(t[$]-1)*r[m]+1-n[m]-n[m+d])}l.splice(0,0,h),l.splice(o?3:1,0,g)},Zn=(e,t)=>{let r=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((c,h)=>c*h,1)===0){r.length=0;for(let c=2;c<t[1].dims.length;++c)r.push(t[1].dims[c])}let i=e.format==="NHWC";r.splice(0,0,t[1].dims[0]),r.splice(i?3:1,0,t[1].dims[1]);let a=e.pads.slice(),n=e.outputShape.slice(),s=e.outputPadding.slice(),o=t[0].dims,u=e.dilations.slice();if(u.reduce((c,h)=>c+h,0)===0){let c=t[0].dims.length-2;u=new Array(c).fill(1)}let l=e.strides.slice();if(l.reduce((c,h)=>c+h,0)===0){let c=t[0].dims.length-2;l=new Array(c).fill(1)}Vu(o,r,u,e.autoPad,e.group,a,l,i,s,n);let d=Object.assign({},e);return Object.assign(d,{kernelShape:r,pads:a,outputPadding:s,outputShape:n,dilations:u,strides:l}),d},Gu=e=>{let t=Dn(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],a=e.dilations,n=e.group??1,s=e.kernelShape,o=e.pads,u=e.strides,l=e.wIsConst(),d=e.outputPadding,c=e.outputShape;return{autoPad:i,format:r,dilations:a,group:n,kernelShape:s,outputPadding:d,outputShape:c,pads:o,strides:u,wIsConst:l,...t,cacheKey:`${e.format};${t.activation};`}},Wu=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[0];if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let a=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==a))throw new Error("invalid bias");let n=e[0].dims.length-2;if(t.dilations.reduce((s,o)=>s+o,0)>0&&t.dilations.length!==n)throw new Error(`dilations should be ${n}D`);if(t.strides.reduce((s,o)=>s+o,0)>0&&t.strides.length!==n)throw new Error(`strides should be ${n}D`);if(t.pads.reduce((s,o)=>s+o,0)>0&&t.pads.length!==n*2)throw new Error(`pads should be ${n*2}D`);if(t.outputPadding.length!==n&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${n}D`);if(t.kernelShape.reduce((s,o)=>s+o,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},Qn=(e,t,r,i)=>{let a=e.kernelCustomData.wT??e.compute(Ie(t[1],[2,3,0,1]),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=a);let n=[t[0],a];t.length===3&&n.push(t[2]),e.compute(Nu(n,r,i),{inputs:n})},ju=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let a=t.kernelShape;(a.length===0||a[0]===0)&&(a=[e.inputs[1].dims[2]]);let n=t.dilations;(n.length===0||n[0]===0)&&(n=[1]);let s=t.strides;(s.length===0||s[0]===0)&&(s=[1]);let o=t.pads;o.length===0&&(o=[0,0]),o=[0,o[0],0,o[1]],s=[1].concat(s),n=[1].concat(n),a=[1].concat(a);let u=t.outputPadding;u=[0].concat(u);let l=Zn({...t,pads:o,strides:s,dilations:n,kernelShape:a,outputPadding:u},i);Qn(e,i,l,d=>r?[d[0],d[2],d[3]]:[d[0],d[1],d[3]])},Hu=(e,t)=>{if(Wu(e.inputs,t),e.inputs[0].dims.length===3)ju(e,t);else{let r=Zn(t,e.inputs);Qn(e,e.inputs,r)}}}),Ku,Zu,Qu,oh=k(()=>{"use strict";se(),he(),Ke(),R(),Ku=(e,t,r,i)=>{let a=B.size(t),n=t.length,s=w("input",e,n),o=b("output",e,n),u=r.dataType===6?r.getInt32Array()[0]:Number(r.getBigInt64Array()[0]),l=B.normalizeAxis(u,n),d=c=>{let h=` i32(${s.indicesGet("inputIndices","uniforms.axis")}) `,g=f("uniforms.input_shape","uniforms.axis",n),m=i.reverse?h+(i.exclusive?" + 1":""):"0",$=i.reverse?g:h+(i.exclusive?"":" + 1");return`
                ${c.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(s,o)}
                ${c.mainStart()}
                  ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${o.offsetToIndices("global_idx")};
                  var sum = ${o.type.value}(0);
                  let first : i32 = ${m};
                  let last : i32 = ${$};
                  for (var i : i32 = first; i < last; i++) {
                    ${s.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${s.getByIndices("inputIndices")};
                  }
                  ${o.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:i.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:[{type:12,data:a},{type:12,data:l},...X(t,t)]}),getShaderSource:d}},Zu=(e,t)=>{let r=e.inputs[0].dims,i=e.inputs[0].dataType,a=e.inputs[1];e.compute(Ku(i,r,a,t),{inputs:[0]})},Qu=e=>{let t=e.exclusive===1,r=e.reverse===1;return Re({exclusive:t,reverse:r})}}),Xu,Yu,Ju,el,tl,uh=k(()=>{"use strict";se(),he(),Ke(),R(),Xu=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},Yu=(e,t,r,i)=>{let a=[];a.push(`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);for(let n=0;n<t;++n)a.push(r.indicesSet("a",e[n],`i[${n}]`));return a.push("return a;}"),a.join(`
`)},Ju=(e,t)=>{let r,i,a,n,s,o,u=t.format==="NHWC",l=t.blocksize,d=t.mode==="DCR";u?([r,i,a,n]=e.dims,s=d?[r,i,a,l,l,n/l**2]:[r,i,a,n/l**2,l,l],o=d?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([r,i,a,n]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],s=d?[r,l,l,n/l**2,i,a]:[r,n/l**2,l,l,i,a],o=d?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let c=e.reshape(s),h=c.dims.length,g=e.dataType,m=w("a",g,h),$=b("output",g,h),x=_=>`
  ${_.registerUniform("output_size","u32").declareVariables(m,$)}

  ${Yu(o,h,m,$)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${$.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${$.setByOffset("global_idx",m.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:_=>{let y=u?[r,i*l,a*l,n/l**2]:[r,n/l**2,i*l,a*l],S=B.size(y),T=c.dims,E=B.sortBasedOnPerm(T,o);return{outputs:[{dims:y,dataType:_[0].dataType}],dispatchGroup:{x:Math.ceil(S/64)},programUniforms:[{type:12,data:S},...X(T,E)]}},getShaderSource:x}},el=(e,t)=>{Xu(e.inputs),e.compute(Ju(e.inputs[0],t))},tl=e=>Re({blocksize:e.blocksize,mode:e.mode,format:e.format})}),mr,za,nn,Xn,Ir,rl,il,al,Yn,Jn,es,nl,sl,ts,ol,ul,ll,lh=k(()=>{"use strict";se(),he(),Ke(),R(),mr=256,za=512,nn=2*Math.PI,Xn=e=>{let t=[],r=e;for(let i of[4,2,3,5])for(;r%i===0;)t.push(i),r/=i;return r===1?t:void 0},Ir=e=>{let t=e.toPrecision(9);return/[.eE]/.test(t)?t:`${t}.0`},rl=(e,t,r,i,a)=>{let n=r/e,s=za-i,o=l=>`smem[${s}u + base + ${l*t}u]`,u=`  for (var t = local_idx; t < ${n}u; t += ${mr}u) {
`;u+=`    let twiddleIndex = t % ${t}u;
    let angleUnit = f32(twiddleIndex);
`,u+=`    var leg: array<vec2<f32>, 5>;
`;for(let l=0;l<e;l++){let d=`${i}u + t + ${l*n}u`;if(l===0)u+=`    leg[0] = smem[${d}];
`;else{let c=a*nn*l/(e*t);u+=`    { let a = ${Ir(c)} * angleUnit; leg[${l}] = cmul(smem[${d}], vec2<f32>(cos(a), sin(a))); }
`}}if(u+=`    let base = (t / ${t}u) * ${t*e}u + twiddleIndex;
`,e===2)u+=`    ${o(0)} = leg[0] + leg[1];
    ${o(1)} = leg[0] - leg[1];
`;else if(e===4){let l=a<0?"vec2<f32>(oddDiff.y, -oddDiff.x)":"vec2<f32>(-oddDiff.y, oddDiff.x)";u+=`    let evenSum = leg[0] + leg[2]; let evenDiff = leg[0] - leg[2];
`,u+=`    let oddSum = leg[1] + leg[3]; let oddDiff = leg[1] - leg[3];
`,u+=`    let oddRot = ${l};
`,u+=`    ${o(0)} = evenSum + oddSum;
    ${o(1)} = evenDiff + oddRot;
`,u+=`    ${o(2)} = evenSum - oddSum;
    ${o(3)} = evenDiff - oddRot;
`}else for(let l=0;l<e;l++){let d=["leg[0]"];for(let c=1;c<e;c++){let h=a*nn*(c*l)/e,g=Ir(Math.cos(h)),m=Ir(Math.sin(h));d.push(`vec2<f32>(leg[${c}].x*${g} - leg[${c}].y*${m}, leg[${c}].x*${m} + leg[${c}].y*${g})`)}u+=`    ${o(l)} = ${d.join(" + ")};
`}return`${u}  }
  workgroupBarrier();
`},il=(e,t,r)=>{let i="",a=1,n=0;for(let s of e)i+=rl(s,a,t,n,r),a*=s,n=za-n;return{code:i,resultOffset:n}},al=(e,t,r,i,a)=>{let n=e.dims,s=n.length,o=n[s-1],u=n[t],l=r&&i?(u-1)*2:u;a!==void 0&&(l=a);let d=r&&i?1:2,c=i&&!r?Math.floor(l/2)+1:l,h=n.slice();h[t]=c,h[s-1]=d;let g=1;for(let $=t+1;$<s-1;$++)g*=n[$];let m=B.size(n)/o/u;return{dataType:e.dataType,outputDims:h,length:l,signalLength:u,inner:g,batch:m,inputComponents:o,outputComponents:d,outputLength:c,inverse:r,onesided:i}},Yn=(e,t)=>[t,e.length,e.inputComponents,e.outputComponents,e.inverse,e.onesided].join(";"),Jn=e=>[{type:12,data:e.batch},{type:12,data:e.signalLength},{type:12,data:e.inner},{type:12,data:e.outputLength}],es=(e,t,r)=>e.registerUniform("batch","u32").registerUniform("signalLength","u32").registerUniform("inner","u32").registerUniform("outputLength","u32").declareVariables(t,r),nl=e=>{let{dataType:t,length:r,inputComponents:i,outputComponents:a,inverse:n,onesided:s}=e,o=ot(t),u=n?1:-1,l=n?1/r:1,d=Xn(r),c=h=>{let g=w("x",t,[1]),m=b("y",t,[1]),$=E=>{let z=`inBase + (${E}) * uniforms.inner * ${i}u`,C=`f32(${g.getByOffset(z)})`,M=i===2?`f32(${g.getByOffset(`${z} + 1u`)})`:"0.0";return`vec2<f32>(${C}, ${M})`},x;if(n&&s){let E=Math.floor(r/2)+1,z=r%2===0?`select(provided, provided - 1u, provided == ${E}u)`:"provided";x=`
    let provided = min(uniforms.signalLength, ${E}u);
    for (var i = local_idx; i < ${r}u; i += ${mr}u) {
      if (i < provided) { smem[i] = ${$("i")}; } else { smem[i] = vec2<f32>(0.0); }
    }
    workgroupBarrier();
    for (var k = local_idx + 1u; k < ${z}; k += ${mr}u) {
      let h = smem[k];
      smem[${r}u - k] = vec2<f32>(h.x, -h.y);
    }
    workgroupBarrier();`}else x=`
    let loadCount = min(uniforms.signalLength, ${r}u);
    for (var i = local_idx; i < ${r}u; i += ${mr}u) {
      if (i < loadCount) { smem[i] = ${$("i")}; } else { smem[i] = vec2<f32>(0.0); }
    }
    workgroupBarrier();`;let{code:_,resultOffset:y}=il(d,r,u),S=l===1?`smem[${y}u + i]`:`smem[${y}u + i] * ${Ir(l)}`,T=a===2?m.setByOffset("off + 1u",`${o}(v.y)`):"";return`
  ${es(h,g,m)}
  var<workgroup> smem: array<vec2<f32>, ${2*za}>;
  fn cmul(a: vec2<f32>, b: vec2<f32>) -> vec2<f32> {
    return vec2<f32>(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
  }
  ${h.mainStart(mr)}
    let row = workgroup_index;
    if (row >= uniforms.batch) { return; }
    let outer = row / uniforms.inner;
    let within = row % uniforms.inner;
    let inBase = (outer * uniforms.signalLength * uniforms.inner + within) * ${i}u;
    let outBase = (outer * uniforms.outputLength * uniforms.inner + within) * ${a}u;
    ${x}
${_}    for (var i = local_idx; i < uniforms.outputLength; i += ${mr}u) {
      let v = ${S};
      let off = outBase + i * uniforms.inner * ${a}u;
      ${m.setByOffset("off",`${o}(v.x)`)}
      ${T}
    }
  }`};return{name:"DFT",shaderCache:{hint:Yn(e,"fft"),inputDependencies:["type"]},getShaderSource:c,getRunData:()=>({outputs:[{dims:e.outputDims,dataType:t}],programUniforms:Jn(e),dispatchGroup:{x:e.batch}})}},sl=e=>{let{dataType:t,length:r,inputComponents:i,outputComponents:a,inverse:n,onesided:s}=e,o=ot(t),u=n?1:-1,l=n?1/r:1,d=c=>{let h=w("x",t,[1]),g=b("y",t,[1]),m=S=>{let T=`inBase + (${S}) * uniforms.inner * ${i}u`,E=`f32(${h.getByOffset(T)})`,z=i===2?`f32(${h.getByOffset(`${T} + 1u`)})`:"0.0";return`vec2<f32>(${E}, ${z})`},$=n&&s?`fn spectrum(inBase: u32, k: u32) -> vec2<f32> {
    let provided = min(uniforms.signalLength, ${Math.floor(r/2)+1}u);
    if (k < provided) { return ${m("k")}; }
    let m = ${r}u - k;
    if (m < provided) {
      let h = ${m("m")};
      return vec2<f32>(h.x, -h.y);
    }
    return vec2<f32>(0.0, 0.0);
  }`:`fn spectrum(inBase: u32, n: u32) -> vec2<f32> {
    if (n < uniforms.signalLength) { return ${m("n")}; }
    return vec2<f32>(0.0, 0.0);
  }`,x=`
      let angle = ${Ir(u*nn)} * f32(knMod) / ${Ir(r)};
      acc += cmul(spectrum(inBase, n), vec2<f32>(cos(angle), sin(angle)));
      knMod += k;
      if (knMod >= ${r}u) { knMod -= ${r}u; }`,_=a===2?g.setByOffset("off + 1u",`${o}(v.y)`):"",y=l===1?"acc":`acc * ${Ir(l)}`;return`
  ${es(c,h,g)}
  fn cmul(a: vec2<f32>, b: vec2<f32>) -> vec2<f32> {
    return vec2<f32>(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
  }
  ${$}
  ${c.mainStart(mr)}
    let row = workgroup_index;
    if (row >= uniforms.batch) { return; }
    let outer = row / uniforms.inner;
    let within = row % uniforms.inner;
    let inBase = (outer * uniforms.signalLength * uniforms.inner + within) * ${i}u;
    let outBase = (outer * uniforms.outputLength * uniforms.inner + within) * ${a}u;
    for (var k = local_idx; k < uniforms.outputLength; k += ${mr}u) {
      var acc = vec2<f32>(0.0, 0.0);
      var knMod = 0u;
      for (var n = 0u; n < ${r}u; n++) {${x}
      }
      let v = ${y};
      let off = outBase + k * uniforms.inner * ${a}u;
      ${g.setByOffset("off",`${o}(v.x)`)}
      ${_}
    }
  }`};return{name:"DFT",shaderCache:{hint:Yn(e,"direct"),inputDependencies:["type"]},getShaderSource:d,getRunData:()=>({outputs:[{dims:e.outputDims,dataType:t}],programUniforms:Jn(e),dispatchGroup:{x:e.batch}})}},ts=e=>{if(!e||e.dataType===0)return;if(B.size(e.dims)!==1)throw new Error("DFT optional scalar inputs must have exactly 1 element.");if(e.dataType===6)return e.getInt32Array()[0];let t=Number(e.getBigInt64Array()[0]);if(!Number.isSafeInteger(t))throw new Error("DFT optional scalar inputs are out of JavaScript safe integer range.");return t},ol=e=>{if(!e||e.length<1)throw new Error("DFT requires at least 1 input.");let t=e[0].dims;if(t.length<2)throw new Error("DFT input must have at least 2 dimensions.");let r=t[t.length-1];if(r!==1&&r!==2)throw new Error("DFT input's innermost dimension must be 1 (real) or 2 (complex).")},ul=(e,t)=>{ol(e.inputs);let r=e.inputs[0],i=r.dims.length,a=t.inverse!==0,n=t.onesided!==0,s=ts(e.inputs[1]);if(s!==void 0&&s<=0)throw new Error("dft_length must be greater than zero.");let o=B.normalizeAxis(ts(e.inputs[2])??t.axis,i);if(o===i-1)throw new Error("DFT axis must refer to a signal dimension, not the innermost (real/imaginary) dimension.");if(a&&n&&r.dims[i-1]!==2)throw new Error("Inverse one-sided DFT (IRFFT) requires complex-valued input (innermost dimension 2).");let u=al(r,o,a,n,s);if(u.length<=0)throw new Error(`Invalid DFT length: ${u.length}`);let l=u.length<=za&&Xn(u.length)!==void 0?nl(u):sl(u);e.compute(l,{inputs:[0]})},ll=e=>Re({axis:e.axis??1,inverse:e.inverse??0,onesided:e.onesided??0})}),sn,Ca,rs,dl,pl,cl,hl,is,fl,ml,gl,dh=k(()=>{"use strict";se(),he(),Ke(),R(),sn="[a-zA-Z]|\\.\\.\\.",Ca="("+sn+")+",rs="^"+Ca+"$",dl="("+Ca+",)*"+Ca,pl="^"+dl+"$",cl=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let r=this.symbolToIndices.get(e);r===void 0?r=[t]:r.push(t),this.symbolToIndices.set(e,r)}},hl=class{constructor(e,t){var a;this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[r,i]=t.includes("->")?t.split("->",2):[t,""];if(!r.match(RegExp(pl)))throw new Error("Invalid LHS term");if(r.split(",").forEach((n,s)=>{let o=e[s].dims.slice();if(!n.match(RegExp(rs)))throw new Error("Invalid LHS term");let u=this.processTerm(n,!0,o,s);this.lhs.push(u)}),i==="")i+=[...this.symbolToInfo.entries()].filter(([n,s])=>s.count===1||n==="...").map(([n])=>n).join("");else if(!i.match(RegExp(Ca)))throw new Error("Invalid RHS");(a=i.match(RegExp(sn,"g")))==null||a.forEach(n=>{if(n==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let s=this.symbolToInfo.get(n);if(s===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(s.dimValue)}}),this.rhs=this.processTerm(i,!1,this.outputDims)}addSymbol(e,t,r){let i=this.symbolToInfo.get(e);if(i!==void 0){if(i.dimValue!==t&&i.count!==1)throw new Error("Dimension mismatch");i.count++,i.inputIndices.push(r)}else i={count:1,dimValue:t,inputIndices:[r]};this.symbolToInfo.set(e,i)}processTerm(e,t,r,i=-1){let a=r.length,n=!1,s=[],o=0;if(!e.match(RegExp(rs))&&!t&&e!=="")throw new Error("Invalid LHS term");let u=e.match(RegExp(sn,"g")),l=new cl(i);return u==null||u.forEach((d,c)=>{if(d==="..."){if(n)throw new Error("Only one ellipsis is allowed per input term");n=!0;let h=a-u.length+1;if(h<0)throw new Error("Ellipsis out of bounds");if(s=r.slice(o,o+h),this.hasEllipsis){if(this.ellipsisDims.length!==s.length||this.ellipsisDims.toString()!==s.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=s;else throw new Error("Ellipsis must be specified in the LHS");for(let g=0;g<s.length;g++){let m=String.fromCharCode(48+g);l.addSymbol(m,c+g),this.addSymbol(m,r[o++],i)}}else l.addSymbol(d,c+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(d,r[o++],i)}),l}},is=e=>e+"_max",fl=(e,t,r,i)=>{let a=e.map(l=>l.length).map((l,d)=>w(`input${d}`,t,l)),n=B.size(i),s=b("output",t,i.length),o=[...r.symbolToInfo.keys()].filter(l=>!r.rhs.symbolToIndices.has(l)),u=l=>{let d=[],c="var prod = 1.0;",h="var sum = 0.0;",g="sum += prod;",m=[],$=[],x=[],_=[],y=r.symbolToInfo.size===r.rhs.symbolToIndices.size;r.symbolToInfo.forEach((T,E)=>{var z;if(r.rhs.symbolToIndices.has(E)){let C=(z=r.rhs.symbolToIndices.get(E))==null?void 0:z[0];C!==void 0&&r.lhs.forEach((M,U)=>{if(T.inputIndices.includes(U)){let V=M.symbolToIndices.get(E);if(V===void 0)throw new Error("Invalid symbol error");V.forEach(ae=>{d.push(`${a[U].indicesSet(`input${U}Indices`,ae,s.indicesGet("outputIndices",C))}`)})}})}else r.lhs.forEach((C,M)=>{if(T.inputIndices.includes(M)){let U=C.symbolToIndices.get(E);if(U===void 0)throw new Error("Invalid symbol error");U.forEach(V=>{m.push(`${a[M].indicesSet(`input${M}Indices`,V,`${E}`)}`)}),_.push(`prod *= ${a[M].getByIndices(`input${M}Indices`)};`)}}),$.push(`for(var ${E}: u32 = 0; ${E} < uniforms.${is(E)}; ${E}++) {`),x.push("}")});let S=y?[...d,`let sum = ${a.map((T,E)=>T.getByIndices(`input${E}Indices`)).join(" * ")};`]:[...d,h,...$,...m,c,..._,g,...x];return`
            ${l.registerUniforms(o.map(T=>({name:`${is(T)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...a,s)}

            ${l.mainStart()}
            ${l.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${s.offsetToIndices("global_idx")};
            ${a.map((T,E)=>`var input${E}Indices: ${a[E].type.indices};`).join(`
`)}
            ${S.join(`
`)};
            ${s.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:r.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let l=o.filter(c=>r.symbolToInfo.has(c)).map(c=>{var h;return{type:12,data:((h=r.symbolToInfo.get(c))==null?void 0:h.dimValue)||0}});l.push({type:12,data:n});let d=e.map((c,h)=>[...X(c)]).reduce((c,h)=>c.concat(h),l);return d.push(...X(i)),{outputs:[{dims:i,dataType:t}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:d}},getShaderSource:u}},ml=(e,t)=>{let r=new hl(e.inputs,t.equation),i=r.outputDims,a=e.inputs.map((n,s)=>n.dims);e.compute(fl(a,e.inputs[0].dataType,r,i))},gl=e=>{let t=e.equation.replace(/\s+/g,"");return Re({equation:t})}}),yl,as,wl,_l,bl,ph=k(()=>{"use strict";se(),he(),R(),yl=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=r.length<t.length?0:r.length-t.length,a=t.length<r.length?0:t.length-r.length;for(;i<r.length&&a<t.length;++i,++a)if(r[i]!==t[a]&&r[i]!==1&&t[a]!==1)throw new Error("Expand requires shape to be broadcastable to input")},as=(e,t)=>{let r=e.length-t.length,i=[];for(let a=0;a<r;++a)i.push(e[a]);for(let a=0;a<t.length;++a)i.push(t[a]===1?e[a+r]:t[a]);return i},wl=(e,t)=>e.length>t.length?as(e,t):as(t,e),_l=e=>{let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=wl(t,r),a=e[0].dataType,n=a===9||B.size(t)===1,s=a===9||t.length>0&&t[t.length-1]%4===0?4:1,o=n||i.length>0&&i[i.length-1]%4===0?4:1,u=Math.ceil(B.size(i)/o),l=c=>{let h=w("input",a,t.length,s),g=b("output",a,i.length,o),m;if(a===9){let $=(x,_,y="")=>`
          let outputIndices${_} = ${g.offsetToIndices(`outputOffset + ${_}u`)};
          let offset${_} = ${h.broadcastedIndicesToOffset(`outputIndices${_}`,g)};
          let index${_} = offset${_} / 4u;
          let component${_} = offset${_} % 4u;
          ${x}[${_}] = ${y}(${h.getByOffset(`index${_}`)}[component${_}]);
        `;m=`
        let outputOffset = global_idx * ${o};
        var data = vec4<u32>(0);
        ${$("data",0,"u32")}
        ${$("data",1,"u32")}
        ${$("data",2,"u32")}
        ${$("data",3,"u32")}
        ${g.setByOffset("global_idx","data")}
      }`}else m=`
        let outputIndices = ${g.offsetToIndices(`global_idx * ${o}`)};
        let inputOffset = ${h.broadcastedIndicesToOffset("outputIndices",g)};
        let data = ${g.type.value}(${h.getByOffset(`inputOffset / ${s}`)});
        ${g.setByOffset("global_idx","data")}
      }`;return`
    ${c.registerUniform("vec_size","u32").declareVariables(h,g)}
    ${c.mainStart()}
    ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${m}`},d=[{type:12,data:u},...X(t,i)];return{name:"Expand",shaderCache:{hint:`${i.length};${s}${o}`,inputDependencies:["rank"]},getShaderSource:l,getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:d})}},bl=e=>{yl(e.inputs),e.compute(_l(e.inputs),{inputs:[0]})}}),$l,vl,ch=k(()=>{"use strict";se(),he(),R(),Mn(),$l=e=>{let t=e[0].dataType,r=B.size(e[0].dims),i=B.size(e[1].dims),a=i%4===0,n=s=>{let o=w("x",t,[1],4),u=w("bias",t,[1],4),l=b("y",t,[1],4),d=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],c=g=>`
      let bias${g}_offset: u32 = (global_idx * 4 + ${g}) % uniforms.bias_size;
      let bias${g} = ${u.getByOffset(`bias${g}_offset / 4`)}[bias${g}_offset % 4];`,h=a?`
      let bias = ${u.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${c(0)}${c(1)}${c(2)}${c(3)}
      let bias = ${o.type.value}(bias0, bias1, bias2, bias3);`;return`${s.registerUniforms(d).declareVariables(o,u,l)}

    ${Rn(ot(t))}

    ${s.mainStart(hr)}
      ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${o.getByOffset("global_idx")};
      ${h}
      let x_in = x + bias;
      ${l.setByOffset("global_idx",Bn("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${a}`,inputDependencies:["type","type"]},getShaderSource:n,getRunData:s=>({outputs:[{dims:s[0].dims,dataType:s[0].dataType}],programUniforms:[{type:12,data:Math.ceil(r/4)},{type:12,data:i}],dispatchGroup:{x:Math.ceil(r/hr/4)}})}},vl=e=>{e.inputs.length<2||B.size(e.inputs[1].dims)===0?Qo(e):e.compute($l(e.inputs))}}),xl,Sl,Tl,El,hh=k(()=>{"use strict";se(),he(),Ke(),R(),xl=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},Sl=(e,t)=>{let r=e[0].dims,i=e[1].dims,a=r.length,n=B.normalizeAxis(t.axis,a),s=r.slice(0);s.splice(n,1,...i);let o=r[n],u=e[0].dataType===9?4:1,l=Math.ceil(B.size(s)/u),d=[{type:12,data:l},{type:6,data:o},{type:12,data:n},...X(e[0].dims,e[1].dims,s)],c=h=>{let g=w("data",e[0].dataType,e[0].dims.length,u),m=w("inputIndices",e[1].dataType,e[1].dims.length),$=b("output",e[0].dataType,s.length,u),x=y=>{let S=i.length,T=`var indicesIndices${y}  = ${m.type.indices}(0);`;for(let E=0;E<S;E++)T+=`${S>1?`indicesIndices${y}[${E}]`:`indicesIndices${y}`} = ${s.length>1?`outputIndices${y}[uniforms.axis + ${E}]`:`outputIndices${y}`};`;T+=`
          var idx${y} = ${m.getByIndices(`indicesIndices${y}`)};
          if (idx${y} < 0) {
            idx${y} = idx${y} + uniforms.axisDimLimit;
          }
          var dataIndices${y} : ${g.type.indices};
        `;for(let E=0,z=0;E<a;E++)E===n?(T+=`${a>1?`dataIndices${y}[${E}]`:`dataIndices${y}`} = u32(idx${y});`,z+=S):(T+=`${a>1?`dataIndices${y}[${E}]`:`dataIndices${y}`} = ${s.length>1?`outputIndices${y}[${z}]`:`outputIndices${y}`};`,z++);return T},_;if(e[0].dataType===9){let y=(S,T,E="")=>`
          let outputIndices${T} = ${$.offsetToIndices(`outputOffset + ${T}u`)};
          ${x(T)};
          let offset${T} = ${g.indicesToOffset(`dataIndices${T}`)};
          let index${T} = offset${T} / 4u;
          let component${T} = offset${T} % 4u;
          ${S}[${T}] = ${E}(${g.getByOffset(`index${T}`)}[component${T}]);
        `;_=`
        let outputOffset = global_idx * ${u};
        var value = vec4<u32>(0);
        ${y("value",0,"u32")}
        ${y("value",1,"u32")}
        ${y("value",2,"u32")}
        ${y("value",3,"u32")}
        ${$.setByOffset("global_idx","value")}
      `}else _=`
      let outputIndices = ${$.offsetToIndices("global_idx")};
      ${x("")};
      let value = ${g.getByIndices("dataIndices")};
      ${$.setByOffset("global_idx","value")};
      `;return`
      ${h.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(g,m,$)}
      ${h.mainStart()}
        ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${_}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:s,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d}),getShaderSource:c}},Tl=e=>Re({axis:e.axis}),El=(e,t)=>{let r=e.inputs;xl(r),e.compute(Sl(e.inputs,t))}}),kl,Il,zl,fh=k(()=>{"use strict";se(),he(),R(),kl=(e,t,r,i,a,n,s,o,u)=>{let l=[{type:12,data:n},{type:12,data:i},{type:12,data:a},{type:12,data:r},{type:12,data:s},{type:12,data:o},{type:12,data:u}],d=[n];l.push(...X(t.dims,d));let c=h=>{let g=w("indices_data",t.dataType,t.dims.length),m=b("input_slice_offsets_data",12,1,1),$=[g,m],x=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:a.length},{name:"sizes_from_slice_dims_data",type:"u32",length:r.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${h.registerUniforms(x).declareVariables(...$)}
  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${a.length===1?"index += i32(uniforms.input_dims);":"index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${r.length===1?"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);":"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${a.length}_${r.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:d,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:l}),getShaderSource:c},{inputs:[t],outputs:[-1]})[0]},Il=(e,t)=>{let r=e.inputs,i=r[0].dims,a=r[0].dataType,n=r[1].dims,s=n[n.length-1],o=B.sizeToDimension(n,n.length-1),u=B.sizeFromDimension(i,t.batchDims+s),l=B.sizeToDimension(i,t.batchDims),d=B.sizeFromDimension(i,t.batchDims),c=o/l,h=new Array(s),g=u;for(let T=0;T<s;++T)h[s-1-T]=g,g*=i[t.batchDims+s-1-T];let m=kl(e,r[1],h,t.batchDims,i,o,c,d,s),$=t.batchDims+s;if($>i.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let x=n.slice(0,-1).concat(i.slice($)),_=B.size(x),y=[{type:12,data:_},{type:12,data:u},...X(r[0].dims,m.dims,x)],S=T=>{let E=w("data",r[0].dataType,r[0].dims.length),z=w("slice_offsets",12,m.dims.length),C=b("output",r[0].dataType,x.length);return`
          ${T.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(E,z,C)}
            ${T.mainStart()}
            ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:x,dataType:a}],dispatchGroup:{x:Math.ceil(_/64)},programUniforms:y}),getShaderSource:S},{inputs:[r[0],m]})},zl=e=>({batchDims:e.batch_dims,cacheKey:""})}),Cl,Al,Ol,Rl,mh=k(()=>{"use strict";se(),he(),Ke(),R(),Cl=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let r=B.normalizeAxis(t.quantizeAxis,e[0].dims.length),i=t.blockSize,a=e[0],n=e[2],s=e.length===4?e[3]:void 0;if(n.dims.length!==a.dims.length||!a.dims.map((o,u)=>u===r?Math.ceil(o/i)===n.dims[u]:o===n.dims[u]).reduce((o,u)=>o&&u,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(s){if(s.dataType!==a.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(s.dims.length!==n.dims.length||!s.dims.map((o,u)=>o===n.dims[u]).reduce((o,u)=>o&&u,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},Al=(e,t)=>{let r=e[0].dims,i=e[1].dims,a=r.length,n=B.normalizeAxis(t.gatherAxis,a),s=B.normalizeAxis(t.quantizeAxis,a),o=r.slice(0);o.splice(n,1,...i);let u=B.size(o),l=e[2].dataType,d=e[0].dataType===22,c=[{type:12,data:u},{type:12,data:s},{type:12,data:n},{type:12,data:t.blockSize},...X(...e.map((g,m)=>g.dims),o)],h=g=>{let m=w("data",e[0].dataType,e[0].dims.length),$=w("inputIndices",e[1].dataType,e[1].dims.length),x=w("scales",e[2].dataType,e[2].dims.length),_=e.length>3?w("zeroPoint",e[3].dataType,e[3].dims.length):void 0,y=b("output",l,o.length),S=[m,$,x];_&&S.push(_);let T=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${g.registerUniforms(T).declareVariables(...S,y)}
        ${g.mainStart()}
        let output_indices = ${y.offsetToIndices("global_idx")};
        var indices_indices = ${$.type.indices}(0);
        ${i.length>1?`
          for (var i: u32 = 0; i < ${i.length}; i++) {
            let index = ${y.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${$.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${y.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${m.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${y.indicesGet("output_indices","i")};
          ${m.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${$.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${r[n]};
        }
        ${m.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${o.length}; i++) {
          let index = ${y.indicesGet("output_indices",`i + ${i.length} - 1`)};
          ${m.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${m.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${m.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${d?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${x.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${x.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${x.getByIndices("scale_indices")};
        ${_?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${_.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${_.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${d?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${ot(l)}(quantized_data - zero_point) * scale;
        ${y.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((g,m)=>m!==1).map(g=>g.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(g,m)=>"rank")},getRunData:()=>({outputs:[{dims:o,dataType:l}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:c}),getShaderSource:h}},Ol=(e,t)=>{let r=e.inputs;Cl(r,t),e.compute(Al(e.inputs,t))},Rl=e=>Re({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),Bl,Ml,Dl,Pl,gh=k(()=>{"use strict";se(),he(),Ke(),R(),Bl=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},Ml=(e,t)=>{let r=e[0].dims,i=e[0].dataType,a=r.length,n=e[1].dims,s=e[1].dataType,o=B.normalizeAxis(t.axis,a),u=r[o],l=n.slice(0),d=B.size(l),c=w("input",i,a),h=w("indicesInput",s,n.length),g=b("output",i,l.length),m=[{type:12,data:d},{type:6,data:u},{type:12,data:o}];return m.push(...X(r,n,l)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:l,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:m}),getShaderSource:$=>`
      ${$.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(c,h,g)}
      ${$.mainStart()}
      ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${g.offsetToIndices("global_idx")};

      var idx = ${h.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${c.type.indices}(outputIndices);
      ${c.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${c.getByIndices("inputIndices")};

      ${g.setByOffset("global_idx","value")};
  }`}},Dl=e=>Re({axis:e.axis}),Pl=(e,t)=>{let r=e.inputs;Bl(r),e.compute(Ml(e.inputs,t))}}),Ul,Ll,Nl,ql,yh=k(()=>{"use strict";se(),he(),R(),Ul=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},Ll=(e,t)=>{let r=e[0].dims.slice(),i=e[1].dims.slice(),[a,n,s]=fa.getShapeOfGemmResult(r,t.transA,i,t.transB,e.length===3?e[2].dims:void 0),o=[a,n];if(!o)throw new Error("Can't use gemm on the given tensors");let u=16,l=Math.ceil(n/u),d=Math.ceil(a/u),c=!0,h=B.size(o),g=[{type:12,data:c?l:h},{type:12,data:a},{type:12,data:n},{type:12,data:s},{type:1,data:t.alpha},{type:1,data:t.beta}],m=["type","type"];e.length===3&&(g.push(...X(e[2].dims)),m.push("rank")),g.push(...X(o));let $=_=>{let y="";t.transA&&t.transB?y="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?y="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?y="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(y="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let S=t.alpha===1?"":"value *= uniforms.alpha;",T=w("a",e[0].dataType,e[0].dims),E=w("b",e[1].dataType,e[1].dims),z=T.type.value,C=null,M=[T,E];e.length===3&&(C=w("c",e[2].dataType,e[2].dims.length),M.push(C));let U=b("output",e[0].dataType,o.length);M.push(U);let V=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${_.registerUniforms(V).declareVariables(...M)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${z}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${y}
    }

    ${S}
    ${C!=null?`let cOffset = ${C.broadcastedIndicesToOffset("vec2(m, n)",U)}; value += ${z}(uniforms.beta) * ${C.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},x=_=>{let y=w("a",e[0].dataType,e[0].dims),S=w("b",e[1].dataType,e[1].dims),T=null,E=[y,S];e.length===3&&(T=w("c",e[2].dataType,e[2].dims.length),E.push(T));let z=b("output",e[0].dataType,o.length);E.push(z);let C=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],M="",U="";t.transA&&t.transB?(U=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${y.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `,M="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):t.transA&&!t.transB?(U=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${y.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `,M="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!t.transA&&t.transB?(U=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${y.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `,M="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!t.transA&&!t.transB&&(U=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${y.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `,M="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let V=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${_.registerUniforms(C).declareVariables(...E)}
  var<workgroup> tile_a: array<array<${y.type.storage}, ${u}>, ${u}>;
  var<workgroup> tile_b: array<array<${S.type.storage}, ${u}>, ${u}>;
  ${_.mainStart([u,u,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${u};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${u};
    let num_tiles = (uniforms.K - 1) / ${u} + 1;
    var k_start = 0u;
    var value = ${z.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${U}
      k_start = k_start + ${u};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${u}; k++) {
        ${M}
      }
      workgroupBarrier();
    }

    ${V}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${T!=null?`let cOffset = ${T.broadcastedIndicesToOffset("vec2(m, n)",z)}; value += ${z.type.value}(uniforms.beta) * ${T.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return c?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:l*d},programUniforms:g}),getShaderSource:x}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:g}),getShaderSource:$}},Nl=e=>{let t=e.transA,r=e.transB,i=e.alpha,a=e.beta;return{transA:t,transB:r,alpha:i,beta:a,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},ql=(e,t)=>{Ul(e.inputs),e.compute(Ll(e.inputs,t))}}),rr,gr,pi,ci,Fl,Vl,Gl,Wl,jl,Hl,Kl,Zl,Ql,Xl,wh=k(()=>{"use strict";se(),he(),Ke(),R(),[rr,gr,pi,ci]=[0,1,2,3],Fl=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},Vl=`
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`,Gl=e=>`
  fn gs_bicubic_interpolate(p: mat4x4<${e}>, x: f32, y: f32) -> ${e} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${e}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`,Wl=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,jl=e=>`
  ${e.paddingMode==="reflection"?`
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }`:""}
`,Hl=(e,t,r)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${rr}] = batch;
     indices[${gr}] = channel;`+(()=>{switch(r.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${pi}] = u32(r);
            indices[${ci}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case"border":return`
          indices[${pi}] = u32(clamp(r, 0, H - 1));
          indices[${ci}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${pi}] = gs_reflect(r, border[1], border[3]);
          indices[${ci}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${r.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,Kl=(e,t,r)=>(()=>{switch(r.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${rr}], indices[${gr}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${rr}], indices[${gr}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${rr}], indices[${gr}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${rr}], indices[${gr}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${rr}], indices[${gr}], border);

          let dx2 = ${t}(f32(x2) - x);
          let dx1 = ${t}(x - f32(x1));
          let dy2 = ${t}(f32(y2) - y);
          let dy1 = ${t}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;case"bicubic":return`
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${t}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${rr}], indices[${gr}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${r.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,Zl=(e,t)=>{let r=w("x",e[0].dataType,e[0].dims.length),i=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],a=w("grid",e[1].dataType,i.length,2),n=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(n=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[rr,gr,pi,ci]=[0,3,1,2]);let s=b("output",e[0].dataType,n.length),o=r.type.value,u=B.size(n),l=[{type:12,data:u},...X(e[0].dims,i,n)],d=c=>`
  ${c.registerUniform("output_size","u32").declareVariables(r,a,s)}
  ${Vl}
  ${Gl(o)}
  ${Wl(t)}
  ${jl(t)}
  ${Hl(r,o,t)}

  ${c.mainStart()}
    ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${pi}]);
      let W_in = i32(uniforms.x_shape[${ci}]);

      ${t.alignCorners===0?`
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      `:`
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${s.offsetToIndices("global_idx")};
      var grid_indices = vec3<u32>(indices[${rr}], indices[${pi}], indices[${ci}]);
      let nxy = ${a.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${Kl(s,o,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:c=>{let h=B.size(n);return{outputs:[{dims:n,dataType:c[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:l}},getShaderSource:d}},Ql=(e,t)=>{Fl(e.inputs),e.compute(Zl(e.inputs,t))},Xl=e=>Re({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),St,Yl,Jl,ns,ed,Aa,td,rd=k(()=>{"use strict";se(),he(),Ke(),Ei(),An(),R(),Ue(),St=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,Yl=(e,t)=>{let r=e[0],i=St(e,1),a=St(e,2),n=St(e,3),s=St(e,4),o=St(e,5),u=St(e,6),l=St(e,7);if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let d=r.dims[0],c=r.dims[1],h=r.dims.length===3?r.dims[2]:t.numHeads*r.dims[4],g=c,m=0,$=0,x=Math.floor(h/t.numHeads);if(u&&l&&B.size(u.dims)&&B.size(l.dims)){if(u.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(u.dims[0]!==d||u.dims[1]!==t.numHeads||u.dims[3]!==x)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(l.dims[0]!==d||l.dims[1]!==t.numHeads||l.dims[3]!==x)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(u.dims[2]!==l.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(l.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');m=u.dims[2],$=u.dims[2]}else if(u&&B.size(u.dims)||l&&B.size(l.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let _;if(i&&B.size(i.dims)>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(i.dims[2]!==r.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');_=2,g=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==x)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(a)throw new Error('Expect "value" be none when "key" has packed kv format.');_=5,g=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==x)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');_=0,g=i.dims[2]}}else{if(r.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(r.dims[2]!==t.numHeads||r.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');_=3}if(n&&B.size(n.dims)>0){if(n.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(i&&i.dims.length===5&&i.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let y=m+g,S=0;if(s&&B.size(s.dims)>0){S=8;let C=s.dims;throw C.length===1?C[0]===d?S=1:C[0]===3*d+2&&(S=3):C.length===2&&C[0]===d&&C[1]===y&&(S=5),S===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let T=!1,E=h;if(a&&B.size(a.dims)>0){if(a.dims.length!==3&&a.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==a.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(a.dims.length===3){if(g!==a.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');E=a.dims[2]}else{if(g!==a.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');E=a.dims[1]*a.dims[3],T=!0}}let z=!1;if(s&&B.size(s.dims)>0)throw new Error("Key padding mask is not supported");if(o&&B.size(o.dims)>0){if(o.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(o.dims[0]!==d||o.dims[1]!==t.numHeads||o.dims[2]!==c||o.dims[3]!==y)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:d,sequenceLength:c,pastSequenceLength:m,kvSequenceLength:g,totalSequenceLength:y,maxSequenceLength:$,inputHiddenSize:0,hiddenSize:h,vHiddenSize:E,headSize:x,vHeadSize:Math.floor(E/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:S,scale:t.scale,broadcastResPosBias:z,passPastInKv:T,qkvFormat:_}},Jl=e=>Re({...e}),ns=Re({perm:[0,2,1,3]}),ed=(e,t,r,i,a,n,s)=>{let o=[i,a,n],u=B.size(o),l=[{type:12,data:u},{type:12,data:s},{type:12,data:n}],d=c=>{let h=b("qkv_with_bias",t.dataType,o),g=w("qkv",t.dataType,o),m=w("bias",r.dataType,o),$=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${c.registerUniforms($).declareVariables(g,m,h)}
  ${c.mainStart()}
    ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:o,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:l}),getShaderSource:d},{inputs:[t,r],outputs:[-1]})[0]},Aa=(e,t,r,i,a,n,s,o)=>{let u=n;if(s&&B.size(s.dims)>0){if(i===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return u=ed(e,n,s,t,i,r*a,o),u=u.reshape([t,i,r,a]),r===1||i===1?u:e.compute(Ie(u,ns.perm),{inputs:[u],outputs:[-1]})[0]}else return n.dims.length===3&&(u=n.reshape([t,i,r,a])),r===1||i===1?u:e.compute(Ie(u,ns.perm),{inputs:[u],outputs:[-1]})[0]},td=(e,t)=>{let r=Yl(e.inputs,t),i=e.inputs[0],a=St(e.inputs,1),n=St(e.inputs,2),s=St(e.inputs,3),o=St(e.inputs,4),u=St(e.inputs,5),l=St(e.inputs,6),d=St(e.inputs,7);if(i.dims.length===5)throw new Error("Packed QKV is not implemented");if((a==null?void 0:a.dims.length)===5)throw new Error("Packed KV is not implemented");let c=a&&n&&a.dims.length===4&&n.dims.length===4,h=Aa(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,i,s,0);if(c)return Ta(e,h,a,n,o,void 0,l,d,u,r);if(!a||!n)throw new Error("key and value must be provided");let g=Aa(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.headSize,a,s,r.hiddenSize),m=Aa(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.vHeadSize,n,s,2*r.hiddenSize);Ta(e,h,g,m,o,void 0,l,d,u,r)}}),id,ad,nd,sd,ss,od,ud,ld=k(()=>{"use strict";se(),he(),Ke(),R(),id=e=>{if(!e||e.length<1)throw new Error("too few inputs")},ad=(e,t)=>{let r=[],i=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(a=>r.push(Number(a))),i=r.length),Re({numOutputs:i,axis:t.axis,splitSizes:r})},nd=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${f("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,sd=e=>{let t=e.length,r=[];for(let i=0;i<t;++i){let a=e[i].setByIndices("indices","input[global_idx]");t===1?r.push(a):i===0?r.push(`if (output_number == ${i}u) { ${a} }`):i===t-1?r.push(`else { ${a} }`):r.push(`else if (output_number == ${i}) { ${a} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${r.join(`
`)}
      }`},ss=(e,t)=>{let r=e[0].dims,i=B.size(r),a=e[0].dataType,n=B.normalizeAxis(t.axis,r.length),s=new Array(t.numOutputs),o=w("input",a,r.length),u=new Array(t.numOutputs),l=[],d=[],c=0,h=[{type:12,data:i}];for(let m=0;m<t.numOutputs;m++){c+=t.splitSizes[m],u[m]=c;let $=r.slice();$[n]=t.splitSizes[m],d.push($),s[m]=b(`output${m}`,a,$.length),l.push({dims:d[m],dataType:e[0].dataType})}h.push({type:12,data:u},...X(r,...d));let g=m=>`
  ${m.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",u.length).declareVariables(o,...s)}
  ${nd(u.length)}
  ${sd(s)}

  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${o.offsetToIndices("global_idx")};
    var index = ${o.indicesGet("indices",n)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${f("uniforms.size_in_split_axis","output_number - 1u",u.length)};
      ${o.indicesSet("indices",n,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:g,getRunData:()=>({outputs:l,dispatchGroup:{x:Math.ceil(i/64)},programUniforms:h})}},od=(e,t)=>{id(e.inputs);let r=e.inputs.length===1?t:ad(e.inputs,t);e.compute(ss(e.inputs,r),{inputs:[0]})},ud=e=>{let t=e.axis,r=e.splitSizes,i=e.numOutputs<0?r.length:e.numOutputs;if(i!==r.length)throw new Error("numOutputs and splitSizes length must be equal");return Re({axis:t,numOutputs:i,splitSizes:r})}}),dd,on,pd,cd=k(()=>{"use strict";se(),he(),Ke(),R(),dd=(e,t)=>{let[r,i,a,n]=e,{numHeads:s,rotaryEmbeddingDim:o}=t;if(r.dims.length!==3&&r.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${r.dims.length}`);if(!B.areEqual(i.dims,[])&&!B.areEqual(i.dims,[1])&&i.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${i.dims.length}`);if(a.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${a.dims.length}`);if(n.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${n.dims.length}`);if(!B.areEqual(a.dims,n.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(o>0&&s===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let u=r.dims[0],l=r.dims[r.dims.length-2],d=a.dims[0],c=B.sizeFromDimension(r.dims,1)/l,h=o===0?a.dims[1]*2:c/s;if(o>h)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(i.dims.length===2){if(u!==i.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${i.dims[0]}`);if(l!==i.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${i.dims[1]}`)}if(l>d)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported");if(h/2!==a.dims[1]&&o/2!==a.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${a.dims[1]}`)},on=(e,t)=>{let{interleaved:r,numHeads:i,rotaryEmbeddingDim:a,scale:n}=t,s=e[0].dims[0],o=B.sizeFromDimension(e[0].dims,1),u=e[0].dims[e[0].dims.length-2],l=o/u,d=e[2].dims[1],c=a===0?d*2:l/i,h=new Array(s,u,l/c,c-d),g=B.computeStrides(h),m=[{type:1,data:n},{type:12,data:h},{type:12,data:g},...e[0].dims.length===3?new Array({type:12,data:[o,l,c,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[o,c,u*c,1]}):[],...X(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],$=x=>{let _=w("input",e[0].dataType,e[0].dims.length),y=w("position_ids",e[1].dataType,e[1].dims.length),S=w("cos_cache",e[2].dataType,e[2].dims.length),T=w("sin_cache",e[3].dataType,e[3].dims.length),E=b("output",e[0].dataType,e[0].dims.length);return x.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:h.length},{name:"global_strides",type:"u32",length:g.length},{name:"input_output_strides",type:"u32",length:g.length}]),`
        ${x.declareVariables(_,y,S,T,E)}

        ${x.mainStart(hr)}
          let half_rotary_emb_dim = uniforms.${S.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${x.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${y.broadcastedIndicesToOffset("bsnh.xy",b("",y.type.tensor,2))};
            let position_id =
                u32(${y.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${r});
            let j = i + select(half_rotary_emb_dim, 1, ${r});
            let re = ${_.getByOffset("i")} * ${S.get("position_id","bsnh[3]")} -
                ${_.getByOffset("j")} * ${T.get("position_id","bsnh[3]")};
            ${E.setByOffset("i","re")}
            let im = ${_.getByOffset("i")} * ${T.get("position_id","bsnh[3]")} +
                ${_.getByOffset("j")} * ${S.get("position_id","bsnh[3]")};
            ${E.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${E.setByOffset("k",_.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:Re({interleaved:r}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:$,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(B.size(h)/hr)},programUniforms:m})}},pd=(e,t)=>{dd(e.inputs,t),e.compute(on(e.inputs,t))}}),hd,fd,os,md,gd,_h=k(()=>{"use strict";Ke(),se(),An(),rd(),ld(),Ue(),cd(),R(),hd=(e,t)=>{if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let r=e[0],i=e[1],a=e[2],n=e[3],s=e[4];if(t.doRotary!==0&&e.length<=7)throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let o=!1,u=r.dims[0],l=r.dims[1],d=r.dims.length===3?o?r.dims[2]/3:r.dims[2]:t.numHeads*r.dims[4],c=l,h=0,g=!i||i.dims.length===0,m=Math.floor(g?d/(t.numHeads+2*t.kvNumHeads):d/t.numHeads);g&&(d=m*t.numHeads);let $=n&&n.dims.length!==0,x=s&&s.dims.length!==0;if($&&n.dims.length===4&&n.dims[0]===u&&n.dims[1]!==t.kvNumHeads&&n.dims[2]===t.kvNumHeads&&n.dims[3]===m)throw new Error("BSNH pastKey/pastValue is not supported");if($&&x){if(n.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(s.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');h=n.dims[2]}else if($||x)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let _=1;if(i&&i.dims.length>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(r.dims[2]%i.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');c=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==m)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(a)throw new Error('Expect "value" be none when "key" has packed kv format.');c=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==m)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');c=i.dims[2]}}else{if(r.dims.length!==3&&r.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(r.dims.length===5&&(r.dims[2]!==t.numHeads||r.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');_=3}let y=0,S=!1,T=t.kvNumHeads?m*t.kvNumHeads:d;if(a&&a.dims.length>0){if(a.dims.length!==3&&a.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==a.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(a.dims.length===3){if(c!==a.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');T=a.dims[2]}else{if(c!==a.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');T=a.dims[1]*a.dims[3],S=!0}}let E=e.length>4?e[5]:void 0;if(E){if(E.dims.length===0)throw new Error("seqlens_k must be at least 1D, got scalar.");let z=E.dims.reduce((C,M)=>C*M,1);if(z!==u)throw new Error(`seqlens_k must have batch_size (${u}) elements, got ${z}.`);for(let C=0;C<E.dims.length;C++)if(E.dims[C]!==1&&E.dims[C]!==u)throw new Error(`seqlens_k has unexpected shape. Each dimension must be 1 or batch_size (${u}), got dims[${C}] = ${E.dims[C]}.`)}return{batchSize:u,sequenceLength:l,pastSequenceLength:h,kvSequenceLength:c,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:d,vHiddenSize:T,headSize:m,vHeadSize:Math.floor(T/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:y,scale:t.scale,broadcastResPosBias:!1,passPastInKv:S,qkvFormat:_}},fd=Re({perm:[0,2,1,3]}),os=(e,t,r)=>{let i=t,a=r.kvNumHeads;return t.dims.length===3&&r.kvSequenceLength!==0&&(i=t.reshape([r.batchSize,r.kvSequenceLength,a,r.headSize]),i=e.compute(Ie(i,fd.perm),{inputs:[i],outputs:[-1]})[0]),i},md=(e,t,r,i)=>{let a=7,n=["type","type"],s=[e*t],o=e*t,u=[{type:12,data:o},{type:12,data:t},{type:12,data:e}],l=d=>{let c=w("seq_lens",r.dataType,r.dims),h=w("total_seq_lens",i.dataType,i.dims),g=b("pos_ids",a,s),m=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
  ${d.registerUniforms(m).declareVariables(c,h,g)}
  ${d.mainStart()}
    ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${h.getByOffset("0")});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${c.getByOffset("batch_idx")};
    let total_seqlen = seqlen + 1;
    if (is_first_prompt) {
      if (sequence_idx < total_seqlen) {
        pos_id = sequence_idx;
      } else {
        pos_id = 1;
      }
      ${g.setByOffset("global_idx","pos_id")}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${g.setByOffset("global_idx","pos_id")}
    } else if (global_idx < uniforms.batch_size) {
      ${g.setByOffset("global_idx","seqlen")}
    };
  }
  `};return{name:"GeneratePositionIds",shaderCache:{hint:`${e};${t}`,inputDependencies:n},getRunData:()=>({outputs:[{dims:s,dataType:a}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:u}),getShaderSource:l}},gd=(e,t)=>{var T;if(e.inputs.length>14&&e.inputs[14]||e.inputs.length>15&&e.inputs[15])throw new Error("GroupQueryAttention (JSEP): q_norm_weight / k_norm_weight inputs are not supported. The per-head Q/K RMS normalization prologue is implemented only on the CUDA and native WebGPU EPs.");let r=hd(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(((T=e.inputs[1])==null?void 0:T.dims.length)===5)throw new Error("Packed KV is not implemented");let i=e.inputs[0],a=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,n=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,s=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,o=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,u=e.inputs.length>4?e.inputs[5]:void 0,l=e.inputs.length>5?e.inputs[6]:void 0,d=r.kvNumHeads?r.kvNumHeads:r.numHeads,c=Re({axis:2,numOutputs:3,splitSizes:[r.numHeads*r.headSize,d*r.headSize,d*r.headSize]}),[h,g,m]=!a&&!n?e.compute(ss([i],c),{inputs:[i],outputs:[-1,-1,-1]}):[i,a,n],$,x;if(t.doRotary){let E=e.compute(md(r.batchSize,r.sequenceLength,u,l),{inputs:[u,l],outputs:[-1]})[0],z=e.inputs[7],C=e.inputs[8],M=Re({interleaved:t.rotaryInterleaved!==0,numHeads:r.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),U=[h,E,z,C],V=[-1];$=e.compute(on(U,M),{inputs:U,outputs:V})[0],U.splice(0,1,g);let ae=Re({interleaved:t.rotaryInterleaved!==0,numHeads:r.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});x=e.compute(on(U,ae),{inputs:U,outputs:V})[0]}let _=Aa(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,t.doRotary?$:h,void 0,0),y=os(e,t.doRotary?x:g,r),S=os(e,m,r);Ta(e,_,y,S,void 0,void 0,s,o,void 0,r,u,l)}}),us,yd,wd,_d,bh=k(()=>{"use strict";se(),he(),Ue(),R(),us=(e,t,r,i,a,n,s,o)=>{let u=Ge(n),l=u===1?"f32":`vec${u}f`,d=u===1?"vec2f":`mat2x${u}f`,c=a*s,h=64;c===1&&(h=256);let g=[a,s,n/u],m=[a,s,2],$=["rank","type","type"],x=[];x.push(...X(g,m));let _=y=>{let S=w("x",t.dataType,3,u),T=w("scale",r.dataType,r.dims),E=w("bias",i.dataType,i.dims),z=b("output",1,3,2),C=[S,T,E,z];return`
  var<workgroup> workgroup_shared : array<${d}, ${h}>;
  const workgroup_size = ${h}u;
  ${y.declareVariables(...C)}
  ${y.mainStart(h)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${l}(0);
    var squared_sum = ${l}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${l}(${S.get("batch","channel","h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${d}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${p("workgroup_shared[0][0]",u)} / f32(hight * ${u});
      let squared_sum_final = ${p("workgroup_shared[0][1]",u)} / f32(hight * ${u});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${o}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${u};${o};${h}`,inputDependencies:$},getRunData:()=>({outputs:[{dims:m,dataType:1}],dispatchGroup:{x:c},programUniforms:x}),getShaderSource:_},{inputs:[t,r,i],outputs:[-1]})[0]},yd=(e,t,r)=>{let i=t[0].dims,a=i,n=2,s=i[0],o=i[1],u=B.sizeFromDimension(i,n),l=Ge(u),d=B.size(a)/l,c=us(e,t[0],t[1],t[2],s,u,o,r.epsilon),h=[s,o,u/l],g=[s,o],m=["type","none"],$=x=>{let _=w("x",t[0].dataType,h.length,l),y=w("scale_shift",1,g.length,2),S=b("output",t[0].dataType,h.length,l),T=[_,y,S];return`
  ${x.registerUniform("output_size","u32").declareVariables(...T)}
  ${x.mainStart()}
  ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${S.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${y.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${_.getByOffset("global_idx")} * ${S.type.value}(scale_shift.x) + ${S.type.value}(scale_shift.y);
      ${S.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${l}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:a,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:[{type:12,data:d},...X(h,g,h)]}),getShaderSource:$},{inputs:[t[0],c]})},wd=(e,t,r)=>{let i=t[0].dims,a=i,n=i[0],s=i[i.length-1],o=B.sizeFromDimension(i,1)/s,u=Ge(s),l=B.size(a)/u,d=[{type:12,data:o},{type:12,data:Math.floor(s/u)}],c=["type","type"],h=!1,g=[0,i.length-1];for(let _=0;_<i.length-2;_++)h=h||i[_+1]!==1,g.push(_+1);h=h&&i[i.length-1]!==1;let m=h?e.compute(Ie(e.inputs[0],g),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:i.length},(_,y)=>i[g[y]])),$=us(e,m,t[1],t[2],n,o,s,r.epsilon),x=_=>{let y=nt(t[0].dataType),S=u===1?"vec2f":`mat${u}x2f`,T=C=>{let M=C===0?"x":"y",U=u===1?"f32":`vec${u}f`;switch(u){case 1:return`${y}(${U}(scale.${M}))`;case 2:return`vec2<${y}>(${U}(scale[0].${M}, scale[1].${M}))`;case 4:return`vec4<${y}>(${U}(scale[0].${M}, scale[1].${M}, scale[2].${M}, scale[3].${M}))`;default:throw new Error(`Not supported compoents ${u}`)}},E=w("input",t[0].dataType,t[0].dims,u),z=b("output",t[0].dataType,a,u);return`
  @group(0) @binding(0) var<storage, read> input : array<${E.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${S}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${z.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${_.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${T(0)}, ${T(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${u}`,inputDependencies:c},getRunData:()=>({outputs:[{dims:a,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d}),getShaderSource:x},{inputs:[t[0],$]})},_d=(e,t)=>{t.format==="NHWC"?wd(e,e.inputs,t):yd(e,e.inputs,t)}}),bd,$d,vd,$h=k(()=>{"use strict";se(),he(),R(),bd=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},$d=(e,t,r)=>{let i=t.simplified,a=e[0].dims,n=e[1],s=!i&&e[2],o=a,u=B.normalizeAxis(t.axis,a.length),l=B.sizeToDimension(a,u),d=B.sizeFromDimension(a,u),c=B.size(n.dims),h=s?B.size(s.dims):0;if(c!==d||s&&h!==d)throw new Error(`Size of X.shape()[axis:] == ${d}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${c} and bias size of ${h}`);let g=[];for(let E=0;E<a.length;++E)E<u?g.push(a[E]):g.push(1);let m=Ge(d),$=["type","type"],x=[{type:12,data:l},{type:1,data:d},{type:12,data:Math.floor(d/m)},{type:1,data:t.epsilon}];s&&$.push("type");let _=r>1,y=r>2,S=E=>{let z=nt(e[0].dataType),C=[w("x",e[0].dataType,e[0].dims,m),w("scale",n.dataType,n.dims,m)];s&&C.push(w("bias",s.dataType,s.dims,m)),C.push(b("output",e[0].dataType,o,m)),_&&C.push(b("mean_data_output",1,g)),y&&C.push(b("inv_std_output",1,g));let M=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${E.registerUniforms(M).declareVariables(...C)}
  ${E.mainStart()}
    ${E.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${ba("f32",m)};
    var mean_square_vector = ${ba("f32",m)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${Er(z,m,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${p("mean_vector",m)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${p("mean_square_vector",m)} / uniforms.norm_size ${i?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${Er(z,m,"x[j + offset]")};
      let f32scale = ${Er(z,m,"scale[j]")};
      output[j + offset] = ${C[0].type.value}((f32input ${i?"":"- mean"}) * inv_std_dev * f32scale
        ${s?`+ ${Er(z,m,"bias[j]")}`:""}
      );
    }

    ${_?"mean_data_output[global_idx] = mean":""};
    ${y?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},T=[{dims:o,dataType:e[0].dataType}];return _&&T.push({dims:g,dataType:1}),y&&T.push({dims:g,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${m};${r};${i}`,inputDependencies:$},getRunData:()=>({outputs:T,dispatchGroup:{x:Math.ceil(l/64)},programUniforms:x}),getShaderSource:S}},vd=(e,t)=>{bd(e.inputs),e.compute($d(e.inputs,t,e.outputCount))}}),xd,Sd,vh=k(()=>{"use strict";he(),Ln(),Vn(),xd=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},Sd=e=>{xd(e.inputs);let t=Ut.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let r=t[t.length-1],i=e.inputs[0].dims[e.inputs[0].dims.length-1];if(r<8&&i<8)e.compute(Un(e.inputs,{activation:""},t));else{let a=t[t.length-2],n=B.size(e.inputs[0].dims.slice(0,-2)),s=B.size(e.inputs[1].dims.slice(0,-2));if(n!==1&&a===1&&s===1){let o=e.inputs[0].reshape([1,n,i]),u=e.inputs[1].reshape([1,i,r]),l=[1,n,r],d=[o,u];e.compute(tn(d,{activation:""},t,l),{inputs:d})}else e.compute(tn(e.inputs,{activation:""},t))}}}),Td,Ed,kd,Id,zd,xh=k(()=>{"use strict";se(),he(),Ke(),R(),Td=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let r=e[0],i=r.dims.length;if(r.dims[i-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let a=Math.floor((t.k+t.blockSize-1)/t.blockSize),n=t.blockSize/8*t.bits,s=e[1];if(!B.areEqual(s.dims,[t.n,a,n]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let o=e[2].dims;if(B.size(o)!==t.n*a)throw new Error("scales input size error.");if(e.length===4){let u=e[3].dims,l=t.n*(t.bits===8?a:Math.floor((a*t.bits+7)/8));if(B.size(u)!==l)throw new Error("zeroPoints input size error.")}},Ed=(e,t)=>{let r=e[0].dims,i=r.length,a=r[i-2],n=t.k,s=t.n,o=r.slice(0,i-2),u=B.size(o),l=e[1].dims[2]/4,d=e[0].dataType,c=Ge(t.k),h=Ge(l),g=Ge(s),m=o.concat([a,s]),$=a>1&&s/g%2===0?2:1,x=B.size(m)/g/$,_=64,y=[],S=[u,a,n/c],T=B.convertShape(e[1].dims).slice();T.splice(-1,1,l/h),y.push(...X(S)),y.push(...X(T)),y.push(...X(e[2].dims)),e.length===4&&y.push(...X(B.convertShape(e[3].dims)));let E=[u,a,s/g];y.push(...X(E));let z=C=>{let M=S.length,U=w("a",e[0].dataType,M,c),V=w("b",12,T.length,h),ae=w("scales",e[2].dataType,e[2].dims.length),K=[U,V,ae],Y=e.length===4?w("zero_points",12,e[3].dims.length):void 0;Y&&K.push(Y);let Ce=E.length,De=b("output",e[0].dataType,Ce,g),pe=nt(e[0].dataType),be=(()=>{switch(c){case 1:return`array<${pe}, 8>`;case 2:return`mat4x2<${pe}>`;case 4:return`mat2x4<${pe}>`;default:throw new Error(`${c}-component is not supported.`)}})(),Me=Math.floor(32/t.bits),le=Math.floor(Me/8),Je=()=>{let oe="";for(let F=0;F<le;F++){let Ze=F*t.bits*4,tt=Ze+t.bits;oe+=`
          // reuse a data (pass ${F})
            var input_offset${F>0?F:""} = ${F===0?U.indicesToOffset(`${U.type.indices}(batch, row, word_offset)`):"input_offset"};
            var a_data${F>0?F:""}: ${be};
            for (var j${F>0?F:""}: u32 = 0; j${F>0?F:""} < ${8/c}; j${F>0?F:""}++) {
              a_data${F>0?F:""}[j${F>0?F:""}] = ${U.getByOffset(`input_offset${F>0?F:""}`)};
              input_offset${F>0?F:""}++;
            }
          `;for(let Qe=0;Qe<g*$;Qe++)oe+=`
            b_value = ${h===1?`b${Qe}_data`:`b${Qe}_data[i]`};
            ${t.bits===2?`{
              let half_word = b_value >> ${F*16}u;
              let byte_lo = half_word & 0xFFu;
              let byte_hi = (half_word >> 8u) & 0xFFu;
              let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
              b_value_lower = unpack4xU8(spread_word & b_mask);
              b_value_upper = unpack4xU8((spread_word >> 2u) & b_mask);
            }`:`b_value_lower = unpack4xU8((b_value >> ${Ze}u) & b_mask);
            b_value_upper = unpack4xU8((b_value >> ${tt}u) & b_mask);`}
            b_quantized_values = ${be}(${Array.from({length:4},(qt,At)=>`${pe}(b_value_lower[${At}]), ${pe}(b_value_upper[${At}])`).join(", ")});
            b_dequantized_values = ${c===1?`${be}(${Array.from({length:8},(qt,At)=>`(b_quantized_values[${At}] - ${Y?`zero_point${Qe}`:"zero_point"}) * scale${Qe}`).join(", ")});`:`(b_quantized_values - ${be}(${Array(8).fill(`${Y?`zero_point${Qe}`:"zero_point"}`).join(",")})) * scale${Qe};`};
            workgroup_shared[local_id.x * ${$} + ${Math.floor(Qe/g)}]${g>1?`[${Qe%g}]`:""} += ${Array.from({length:8/c},(qt,At)=>`${c===1?`a_data${F>0?F:""}[${At}] * b_dequantized_values[${At}]`:`dot(a_data${F>0?F:""}[${At}], b_dequantized_values[${At}])`}`).join(" + ")};
          `}return oe},P=()=>{let oe=`
            var col_index = col * ${g};
            ${Y?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (nBlocksPerCol + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${pe}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            `;for(let F=0;F<g*$;F++)oe+=`
            let scale${F} = ${ae.getByOffset("col_index * nBlocksPerCol + block")};
            ${Y?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            zero_point_word = ${Y.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${F} = ${pe}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:""}
            col_index += 1;`;return oe},te=()=>{let oe=`col_index = col * ${g};`;for(let F=0;F<g*$;F++)oe+=`
            let b${F}_data = ${V.getByIndices(`${V.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return oe+=`
            var b_value: u32;
            let b_mask: u32 = ${t.bits===2?"0x03030303u":"0x0F0F0F0Fu"};
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${be};
            var b_dequantized_values: ${be};`,oe};return`
        var<workgroup> workgroup_shared: array<${De.type.value}, ${$*_}>;
        ${C.declareVariables(...K,De)}
        ${C.mainStart([_,1,1])}
          let output_indices = ${De.offsetToIndices(`(global_idx / ${_}) * ${$}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${_}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/c};
            ${P()}
            for (var word: u32 = 0; word < ${l}; word += ${h}) {
              ${te()}
              for (var i: u32 = 0; i < ${h}; i++) {
                ${Je()}
                word_offset += ${Me/c};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${$}) {
            var output_value: ${De.type.value} = ${De.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${_}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${$};
            }
            ${De.setByIndices(`${De.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${c};${h};${g};${$};${_}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:m,dataType:d}],dispatchGroup:{x},programUniforms:y}),getShaderSource:z}},kd=(e,t)=>{let r=e[0].dims,i=r.length,a=r[i-2],n=t.k,s=t.n,o=r.slice(0,i-2),u=B.size(o),l=e[1].dims[2]/4,d=e[0].dataType,c=Ge(t.k),h=Ge(l),g=o.concat([a,s]),m=128,$=s%8===0?8:s%4===0?4:1,x=m/$,_=Math.floor(32/t.bits),y=x*h*_,S=y/c,T=y/t.blockSize,E=B.size(g)/$,z=[],C=[u,a,n/c],M=B.convertShape(e[1].dims).slice();M.splice(-1,1,l/h),z.push(...X(C)),z.push(...X(M)),z.push(...X(e[2].dims)),e.length===4&&z.push(...X(B.convertShape(e[3].dims)));let U=[u,a,s];z.push(...X(U));let V=ae=>{let K=C.length,Y=w("a",e[0].dataType,K,c),Ce=w("b",12,M.length,h),De=w("scales",e[2].dataType,e[2].dims.length),pe=[Y,Ce,De],be=e.length===4?w("zero_points",12,e[3].dims.length):void 0;be&&pe.push(be);let Me=U.length,le=b("output",e[0].dataType,Me),Je=nt(e[0].dataType),P=()=>{switch(c){case 1:return`
          let a_data0 = vec4<${Je}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${Je}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${Je}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${Je}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${c}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${Y.type.value}, ${S}>;
        var<workgroup> inter_results: array<array<${le.type.value}, ${x}>, ${$}>;
        ${ae.declareVariables(...pe,le)}
        ${ae.mainStart([x,$,1])}
          let output_indices = ${le.offsetToIndices(`workgroup_index * ${$}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${T} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${S};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${S}; a_offset += ${m})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${Y.getByIndices(`${Y.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${Y.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${T} + local_id.x;
            ${be?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (n_blocks_per_col + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            let zero_point_word = ${be.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${Je}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${Je}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            let scale = ${De.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${Ce.getByIndices(`${Ce.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/c};
            for (var i: u32 = 0; i < ${h}; i++) {
              let b_value = ${h===1?"b_data":"b_data[i]"};
              ${(()=>{let te=Math.floor(_/8),oe="";for(let F=0;F<te;F++){let Ze=F*t.bits*4,tt=Ze+t.bits;oe+=`
              ${P()}
              {${t.bits===2?`
                let half_word = b_value >> ${F*16}u;
                let byte_lo = half_word & 0xFFu;
                let byte_hi = (half_word >> 8u) & 0xFFu;
                let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
                let b_value_lower = unpack4xU8(spread_word & 0x03030303u);
                let b_value_upper = unpack4xU8((spread_word >> 2u) & 0x03030303u);`:`
                let b_value_lower = unpack4xU8((b_value >> ${Ze}u) & 0x0F0F0F0Fu);
                let b_value_upper = unpack4xU8((b_value >> ${tt}u) & 0x0F0F0F0Fu);`}
                let b_quantized_values = mat2x4<${Je}>(${Array.from({length:4},(Qe,qt)=>`${Je}(b_value_lower[${qt}]), ${Je}(b_value_upper[${qt}])`).join(", ")});
                let b_dequantized_values = (b_quantized_values - mat2x4<${Je}>(${Array(8).fill("zero_point").join(",")})) * scale;
                inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(Qe,qt)=>`${`dot(a_data${qt}, b_dequantized_values[${qt}])`}`).join(" + ")};
              }
              word_offset += ${8/c};`}return oe})()}
            }
            workgroupBarrier();
          }

          if (local_idx < ${$}) {
            var output_value: ${le.type.value} = ${le.type.value}(0);
            for (var b = 0u; b < ${x}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${le.setByIndices(`${le.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${c};${h};${x};${$}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:g,dataType:d}],dispatchGroup:{x:E},programUniforms:z}),getShaderSource:V}},Id=(e,t)=>{Td(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(kd(e.inputs,t)):e.compute(Ed(e.inputs,t))},zd=e=>Re(e)}),Cd,Ad,Od,Rd,Bd,Md,Dd,Pd,Ud,Sh=k(()=>{"use strict";se(),he(),R(),Cd=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},Ad=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
            k = i32(${e.indicesGet("indices",a)}) - ${f("uniforms.pads",a,r)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${f("uniforms.x_shape",a,t)})) {
              break;
            }
            offset += k * i32(${f("uniforms.x_strides",a,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${i}
            value = x[offset];
          }
      `},Od=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
                k = i32(${e.indicesGet("indices",a)}) - ${f("uniforms.pads",a,r)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${f("uniforms.x_shape",a,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${f("uniforms.x_shape",a,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${f("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},Rd=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
                k = i32(${e.indicesGet("indices",a)}) - ${f("uniforms.pads",a,r)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${f("uniforms.x_shape",a,t)})) {
                  k = i32(${f("uniforms.x_shape",a,t)}) - 1;
                }
                offset += k * i32(${f("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},Bd=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
                k = i32(${e.indicesGet("indices",a)}) - ${f("uniforms.pads",a,r)};
                if (k < 0)  {
                  k += i32(${f("uniforms.x_shape",a,t)}]);
                }
                if (k >= i32(${f("uniforms.x_shape",a,t)})) {
                  k -= i32(${f("uniforms.x_shape",a,t)});
                }
                offset += k * i32(${f("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},Md=(e,t,r)=>{switch(r.mode){case 0:return Ad(e,t,r.pads.length);case 1:return Od(e,t,r.pads.length);case 2:return Rd(e,t,r.pads.length);case 3:return Bd(e,t,r.pads.length);default:throw new Error("Invalid mode")}},Dd=(e,t)=>{let r=B.padShape(e[0].dims.slice(),t.pads),i=e[0].dims,a=B.size(r),n=[{type:12,data:a},{type:6,data:t.pads}],s=e.length>=3&&e[2].data;t.mode===0&&n.push({type:s?e[2].dataType:1,data:t.value}),n.push(...X(e[0].dims,r));let o=["rank"],u=l=>{let d=b("output",e[0].dataType,r.length),c=w("x",e[0].dataType,i.length),h=c.type.value,g=Md(d,i.length,t),m=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&m.push({name:"constant_value",type:s?h:"f32"}),`
            ${l.registerUniforms(m).declareVariables(c,d)}
            ${l.mainStart()}
            ${l.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${d.offsetToIndices("global_idx")};

            var value = ${h}(0);
            ${g}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${s}`,inputDependencies:o},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(B.size(r)/64)},programUniforms:n}),getShaderSource:u}},Pd=(e,t)=>{if(e.length>1){let r=e[1].getBigInt64Array(),i=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,a=e[0].dims.length,n=new Int32Array(2*a).fill(0);if(e.length>=4){let o=e[3].getBigInt64Array();for(let u=0;u<o.length;u++)n[Number(o[u])]=Number(r[u]),n[Number(o[u])+a]=Number(r[u+o.length])}else r.forEach((o,u)=>n[Number(u)]=Number(o));let s=[];return n.forEach(o=>s.push(o)),{mode:t.mode,value:i,pads:s}}else return t},Ud=(e,t)=>{Cd(e.inputs);let r=Pd(e.inputs,t);e.compute(Dd(e.inputs,r),{inputs:[0]})}}),Oa,ls,ds,ps,cs,Ld,Nd,hs,fs,qd,Fd,ms,Vd,Gd,gs,Wd,jd,Hd,Kd,Th=k(()=>{"use strict";st(),se(),he(),R(),Oa=e=>{if(ee.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},ls=(e,t,r)=>{let i=t.format==="NHWC",a=e.dims.slice();i&&a.splice(1,0,a.pop());let n=Object.hasOwnProperty.call(t,"dilations"),s=t.kernelShape.slice(),o=t.strides.slice(),u=n?t.dilations.slice():[],l=t.pads.slice();Lt.adjustPoolAttributes(r,a,s,o,u,l);let d=Lt.computePoolOutputShape(r,a,o,u,s,l,t.autoPad,t.ceilMode),c=Object.assign({},t);n?Object.assign(c,{kernelShape:s,strides:o,pads:l,dilations:u,cacheKey:t.cacheKey}):Object.assign(c,{kernelShape:s,strides:o,pads:l,cacheKey:t.cacheKey});let h=d.slice();return h.push(h.splice(1,1)[0]),[c,i?h:d]},ds=(e,t)=>{let r=t.format==="NHWC",i=B.size(e),a=B.size(t.kernelShape),n=[{type:12,data:i},{type:12,data:a}],s=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let o=t.kernelShape[t.kernelShape.length-1],u=t.strides[t.strides.length-1],l=t.pads[t.pads.length/2-1],d=t.pads[t.pads.length-1],c=!!(l+d);n.push({type:12,data:o},{type:12,data:u},{type:12,data:l},{type:12,data:d}),s.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let h=!1;if(t.kernelShape.length===2){let g=t.kernelShape[t.kernelShape.length-2],m=t.strides[t.strides.length-2],$=t.pads[t.pads.length/2-2],x=t.pads[t.pads.length-2];h=!!($+x),n.push({type:12,data:g},{type:12,data:m},{type:12,data:$},{type:12,data:x}),s.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[n,s,!0,c,h]}else{if(r)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let o=B.computeStrides(t.kernelShape);n.push({type:12,data:o},{type:12,data:t.pads},{type:12,data:t.strides}),s.push({name:"kernelStrides",type:"u32",length:o.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let u=t.pads.reduce((l,d)=>l+d);return[n,s,!!u,!1,!1]}},ps=(e,t,r,i,a,n,s,o,u,l,d,c)=>{let h=a.format==="NHWC",g=t.type.value,m=b("output",t.type.tensor,i);if(a.kernelShape.length<=2){let $="",x="",_="",y=r-(h?2:1);if(d?$=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${y}] = indices[${y}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${y}] < 0 || xIndices[${y}]
                      >= uniforms.x_shape[${y}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${n}
                }`:$=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${y}] = indices[${y}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${n}
                }`,a.kernelShape.length===2){let S=r-(h?3:2);c?x=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${S}] = indices[${S}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${S}] < 0 || xIndices[${S}] >= uniforms.x_shape[${S}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:x=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${S}] = indices[${S}] * uniforms.sh - uniforms.phStart + j;
                `,_=`
              }
            `}return`
            ${e.registerUniforms(u).declareVariables(t,m)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${m.offsetToIndices("global_idx")};
              var xIndices = ${m.offsetToIndices("global_idx")};

              var value = ${g}(${o});
              var pad = 0;
              ${x}
              ${$}
              ${_}
              ${s}

              output[global_idx] = value;
            }`}else{if(h)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let $=a.kernelShape.length,x=a.pads.length,_="";return l?_=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${n}
              }`:_=`
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${n}
            `,`
            ${e.registerUniforms(u).declareVariables(t,m)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${m.offsetToIndices("global_idx")};
              var xIndices = ${m.offsetToIndices("global_idx")};

              var offsets: array<u32, ${$}>;

              var value = ${g}(${o});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${$-1}u; j++) {
                  offsets[j] = offset / ${f("uniforms.kernelStrides","j",$)};
                  offset -= offsets[j] * ${f("uniforms.kernelStrides","j",$)};
                }
                offsets[${$-1}] = offset;

                isPad = false;
                for (var j = ${r-$}u; j < ${r}u; j++) {
                  xIndices[j] = indices[j] * ${f("uniforms.strides",`j - ${r-$}u`,$)}
                    + offsets[j - ${r-$}u] - ${f("uniforms.pads","j - 2u",x)};
                  ${_}
              }
              ${s}

              output[global_idx] = value;
            }`}},cs=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,Ld=e=>`${cs(e)};${e.countIncludePad}`,Nd=e=>`${cs(e)};${e.storageOrder};${e.dilations}`,hs=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),fs=(e,t,r,i)=>{let[a,n]=ls(t,i,r),s=w("x",t.dataType,t.dims.length),o=s.type.value,u="value += x_val;",l="";a.countIncludePad?l+=`value /= ${o}(uniforms.kernelSize);`:l+=`value /= ${o}(i32(uniforms.kernelSize) - pad);`;let[d,c,h,g,m]=ds(n,a);d.push(...X(t.dims,n));let $=["rank"];return{name:e,shaderCache:{hint:`${i.cacheKey};${h};${g};${m}`,inputDependencies:$},getRunData:()=>({outputs:[{dims:n,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(B.size(n)/64)},programUniforms:d}),getShaderSource:x=>ps(x,s,t.dims.length,n.length,a,u,l,0,c,h,g,m)}},qd=e=>{let t=e.count_include_pad!==0,r=hs(e);if(r.ceilMode!==0)throw new Error("ceil_mode output-shape is computed, but ceil_mode kernel execution (padding/divisor) is not yet implemented in the WebGPU AveragePool kernel");let i={countIncludePad:t,...r,cacheKey:""};return{...i,cacheKey:Ld(i)}},Fd=(e,t)=>{Oa(e.inputs),e.compute(fs("AveragePool",e.inputs[0],!1,t))},ms={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},Vd=e=>{let t=e.format;return{format:t,...ms,cacheKey:t}},Gd=(e,t)=>{Oa(e.inputs),e.compute(fs("GlobalAveragePool",e.inputs[0],!0,t))},gs=(e,t,r,i)=>{let[a,n]=ls(t,i,r),s=`
      value = max(x_val, value);
    `,o="",u=w("x",t.dataType,t.dims.length),l=["rank"],[d,c,h,g,m]=ds(n,a);return d.push(...X(t.dims,n)),{name:e,shaderCache:{hint:`${i.cacheKey};${h};${g};${m}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:n,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(B.size(n)/64)},programUniforms:d}),getShaderSource:$=>ps($,u,t.dims.length,n.length,a,s,o,t.dataType===10?-65504:-1e5,c,h,g,m)}},Wd=(e,t)=>{Oa(e.inputs),e.compute(gs("MaxPool",e.inputs[0],!1,t))},jd=e=>{let t=e.storage_order,r=e.dilations,i=hs(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(i.ceilMode!==0)throw new Error("ceil_mode output-shape is computed, but ceil_mode kernel execution (padding) is not yet implemented in the WebGPU MaxPool kernel");let a={storageOrder:t,dilations:r,...i,cacheKey:""};return{...a,cacheKey:Nd(a)}},Hd=e=>{let t=e.format;return{format:t,...ms,cacheKey:t}},Kd=(e,t)=>{Oa(e.inputs),e.compute(gs("GlobalMaxPool",e.inputs[0],!0,t))}}),Zd,Qd,Xd,Yd,Eh=k(()=>{"use strict";se(),he(),Ke(),R(),Zd=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((r,i)=>r===e[2].dims[i]).reduce((r,i)=>r&&i,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((a,n)=>n===t.axis||a===e[0].dims[n]).reduce((a,n)=>a&&n,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let r=e[0].dims[t.axis],i=e[1].dims[t.axis];if(t.blockSize<Math.ceil(r/i)||t.blockSize>Math.ceil(r/(i-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},Qd=(e,t)=>{let r=B.normalizeAxis(t.axis,e[0].dims.length),i=e[0].dataType,a=i===3,n=e[0].dims,s=e[1].dataType,o=B.size(n),u=i===3||i===2,l=u?[Math.ceil(B.size(e[0].dims)/4)]:e[0].dims,d=e[1].dims,c=e.length>2?e[2]:void 0,h=c?u?[Math.ceil(B.size(c.dims)/4)]:c.dims:void 0,g=d.length===0||d.length===1&&d[0]===1,m=g===!1&&d.length===1,$=Ge(o),x=g&&(!u||$===4),_=x?$:1,y=x&&!u?$:1,S=w("input",u?12:i,l.length,y),T=w("scale",s,d.length),E=c?w("zero_point",u?12:i,h.length):void 0,z=b("output",s,n.length,_),C=[S,T];E&&C.push(E);let M=[l,d];c&&M.push(h);let U=[{type:12,data:o/_},{type:12,data:r},{type:12,data:t.blockSize},...X(...M,n)],V=ae=>{let K=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${ae.registerUniforms(K).declareVariables(...C,z)}
      ${ae.mainStart()}
          ${ae.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${z.offsetToIndices("global_idx")};

          // Set input x
          ${u?`
            let input = ${S.getByOffset("global_idx / 4")};
            let x_vec = ${a?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${_===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${S.getByOffset("global_idx")};`};

          // Set scale input
          ${g?`let scale_value= ${T.getByOffset("0")}`:m?`
            let scale_index = ${z.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${T.getByOffset("scale_index")};`:`
            var scale_indices: ${T.type.indices} = output_indices;
            let index = ${T.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${T.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${T.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${E?g?u?`
                let zero_point_input = ${E.getByOffset("0")};
                let zero_point_vec =  ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${E.getByOffset("0")}`:m?u?`
                let zero_point_index = ${z.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${E.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${z.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${E.getByOffset("zero_point_index")};`:u?`
                let zero_point_offset = ${T.indicesToOffset("scale_indices")};
                let zero_point_input = ${E.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${E.getByIndices("scale_indices")};`:`let zero_point_value = ${u?a?"i32":"u32":S.type.value}(0);`};
      // Compute and write output
      ${z.setByOffset("global_idx",`${z.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:E?["rank","rank","rank"]:["rank","rank"]},getShaderSource:V,getRunData:()=>({outputs:[{dims:n,dataType:s}],dispatchGroup:{x:Math.ceil(o/_/64),y:1,z:1},programUniforms:U})}},Xd=(e,t)=>{Zd(e.inputs,t),e.compute(Qd(e.inputs,t))},Yd=e=>Re({axis:e.axis,blockSize:e.blockSize})}),Jd,ep,tp,kh=k(()=>{"use strict";st(),se(),R(),Jd=(e,t,r)=>{let i=e===t,a=e<t&&r<0,n=e>t&&r>0;if(i||a||n)throw new Error("Range these inputs' contents are invalid.")},ep=(e,t,r,i)=>{let a=Math.abs(Math.ceil((t-e)/r)),n=[a],s=a,o=[{type:12,data:s},{type:i,data:e},{type:i,data:r},...X(n)],u=l=>{let d=b("output",i,n.length),c=d.type.value,h=[{name:"outputSize",type:"u32"},{name:"start",type:c},{name:"delta",type:c}];return`
        ${l.registerUniforms(h).declareVariables(d)}
        ${l.mainStart()}
        ${l.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${c}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${i}`},getShaderSource:u,getRunData:()=>({outputs:[{dims:n,dataType:i}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:o})}},tp=e=>{let t=0,r=0,i=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],r=e.inputs[1].getInt32Array()[0],i=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],r=e.inputs[1].getFloat32Array()[0],i=e.inputs[2].getFloat32Array()[0]),ee.webgpu.validateInputContent&&Jd(t,r,i),e.compute(ep(t,r,i,e.inputs[0].dataType),{inputs:[]})}}),rp,ip,ap,np,Ih=k(()=>{"use strict";se(),he(),Ke(),R(),rp=(e,t,r,i)=>{if(e!=="none"&&i!=="i32"&&i!=="u32"&&i!=="f32")throw new Error(`Input ${i} is not supported with reduction ${e}.`);let a=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,n=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(e){case"none":return`${t}=${r};`;case"add":return i==="i32"||i==="u32"?`atomicAdd(&${t}, bitcast<${i}>(${r}));`:`
              ${a}bitcast<${i}>(oldValue) + (${r})${n}`;case"max":return i==="i32"||i==="u32"?`atomicMax(&${t}, bitcast<${i}>(${r}));`:`
                ${a}max(bitcast<f32>(oldValue), (${r}))${n}`;case"min":return i==="i32"||i==="u32"?`atomicMin(&${t}, bitcast<${i}>(${r}));`:`${a}min(bitcast<${i}>(oldValue), (${r}))${n}`;case"mul":return`${a}(bitcast<${i}>(oldValue) * (${r}))${n}`;default:throw new Error(`Reduction ${e} is not supported.`)}},ip=(e,t)=>{let r=e[0].dims,i=e[1].dims,a=r,n=1,s=Math.ceil(B.sizeToDimension(i,i.length-1)/n),o=i[i.length-1],u=B.sizeFromDimension(r,o),l=[{type:12,data:s},{type:12,data:o},{type:12,data:u},...X(e[1].dims,e[2].dims,a)],d=c=>{let h=w("indices",e[1].dataType,e[1].dims.length),g=w("updates",e[2].dataType,e[2].dims.length,n),m=t.reduction!=="none"&&t.reduction!==""?A("output",e[0].dataType,a.length):b("output",e[0].dataType,a.length,n);return`
      ${c.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(h,g,m)}
      ${c.mainStart()}
        ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var data_offset = 0u;
  let indices_start = uniforms.last_index_dimension * global_idx;
  let indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${e[0].dims.length===1?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[i - indices_start];
    let dim_value = uniforms.output_shape[i - indices_start];`}
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));
  }

  for (var i = 0u; i < uniforms.num_updates_elements; i++) {
    let value = updates[uniforms.num_updates_elements * global_idx + i];
    ${rp(t.reduction,"output[data_offset + i]","value",m.type.value)}
  }

      }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:l}),getShaderSource:d}},ap=e=>Re({reduction:e.reduction}),np=(e,t)=>{e.compute(ip(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),sp,op,up,ys,lp,dp,pp,cp,hp,fp,mp,gp,ws,yp,wp,_p,bp,$p,vp,xp,zh=k(()=>{"use strict";se(),he(),Ke(),R(),sp=(e,t)=>{if(e.every(r=>r>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},op=(e,t,r)=>{t.every(a=>a>=0&&a<r||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let i=new Array(r).fill(1);return t.forEach((a,n)=>i[a]=e[n]),i},up=(e,t,r,i,a,n)=>{let[s,o,u]=r>10?[1,2,3]:[-1,e.length>1?1:-1,-1],l=e[0].dims.length;if(s>0&&e.length>s&&e[s].dims.length>0)e[s].getFloat32Array().forEach(d=>n.push(d));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(o>0&&e.length>o&&e[o].dims.length===1&&e[o].dims[0]>0){if(e[o].getFloat32Array().forEach(d=>i.push(d)),i.length!==0&&i.length!==l&&r>=18&&i.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");sp(i,t),t.axes.length>0&&op(i,t.axes,l).forEach((d,c)=>i[c]=d)}if(u>0&&e.length>u&&e[u].dims.length===1&&e[u].dims[0]>0&&(e[u].getBigInt64Array().forEach(d=>a.push(Number(d))),a.length!==0&&a.length!==l&&r>=18&&a.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(i.length!==0&&i.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(a.length!==0&&a.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof i<"u"&&typeof a<"u"&&i.length>0&&a.length>l)throw new Error("Resize requires only of scales or sizes to be specified")},ys=(e,t,r,i)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${i}(big / (${r}));
  let fract = ${i}(big % (${r})) / ${i}(${r});
  return whole + fract;
`,lp=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${ys("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${ys("xResized","lengthOriginal - 1","lengthResized - 1",t)}
                  }`;case"tf_crop_and_resize":return`if (lengthResized > 1) {
                    return ${t}(roiStart) * ${t}(lengthOriginal - 1) +
                        (${t}(xResized) * ${t}(roiEnd - roiStart) * ${t}(lengthOriginal - 1)) /
                        ${t}(lengthResized - 1);
                  } else {
                    return 0.5 * ${t}(roiStart + roiEnd) * ${t}(lengthOriginal - 1);
                  }`;case"half_pixel_symmetric":return`const outputWidth = ${t}xScale * ${t}(lengthResized);
                  const adjustment = ${t}(lengthResized) / outputWidth;
                  const center = ${t}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",dp=(e,t,r)=>`fn getNearestPixelFromOriginal(xOriginal: ${r}, isDownSample: bool) -> ${r} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",pp=(e,t,r)=>{let i=new Array(r).fill(0).concat(new Array(r).fill(1)),a=e.length===0?i:e.slice();return t.length>0?(t.forEach((n,s)=>{i[n]=a[s],i[s+r]=a[t.length+s]}),i):a},cp=(e,t,r,i)=>{let a=[];if(r.length>0)if(i.length>0){if(e.forEach(n=>a.push(n)),Math.max(...i)>e.length)throw new Error("axes is out of bound");i.forEach((n,s)=>a[n]=r[s])}else r.forEach(n=>a.push(n));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");a=e.map((n,s)=>Math.round(n*t[s]))}return a},hp=(e,t,r)=>{let i=(()=>{switch(r.keepAspectRatioPolicy){case"not_larger":return r.axes.length>0?Math.min(...r.axes.map(n=>t[n]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return r.axes.length>0?Math.max(...r.axes.map(n=>t[n]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${r.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let a=e.slice();return r.axes.length>0?(r.axes.forEach(n=>t[n]=i),r.axes.forEach(n=>a[n]=Math.round(e[n]*t[n]))):(t.fill(i,0,t.length),a.forEach((n,s)=>a[s]=Math.round(n*t[s]))),a},fp=(e,t,r,i,a)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${r.length}> {
      var original_indices: array<${e.type.value}, ${r.length}>;
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${f("uniforms.scales","i",i)};
        var roi_low = ${f("uniforms.roi","i",a)};
        var roi_hi = ${f("uniforms.roi",`i + ${t.length}`,a)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${f("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${f("uniforms.output_shape","i",r.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,mp=(e,t,r,i,a,n,s)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${i.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${f("uniforms.scales","i",a)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${f("uniforms.roi","i",n)};
          var roi_hi = ${f("uniforms.roi",`i + ${r.length}`,n)};
          var input_shape_i = ${f("uniforms.input_shape","i",r.length)};
          var output_shape_i = ${f("uniforms.output_shape","i",i.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${s} || (original_idx >= 0 && original_idx < ${t.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${t.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${e.indicesSet("input_indices","i","input_index")}
      }
      return input_indices;
    }`,gp=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${f("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,ws=(e,t,r,i)=>e.rank>i?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",r,"batch")};
`:"",yp=(e,t,r,i,a)=>{let[n,s,o,u]=r.length===2?[-1,0,1,-1]:[0,2,3,1],l=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${l} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(row, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",o,`max(0, min(col, ${r[o]} - 1))`)};
      ${ws(e,u,n,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${l} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${l} = originalIndices[${s}];
      var col:${l} = originalIndices[${o}];
      ${i?`if (row < 0 || row > (${r[s]} - 1) || col < 0 || col > (${r[o]} - 1)) {
        return ${a};
      }`:""};
      row = max(0, min(row, ${r[s]} - 1));
      col = max(0, min(col, ${r[o]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${r.length>2?`u32(originalIndices[${u}])`:"0"};
      var batch: u32 =  ${r.length>2?`u32(originalIndices[${n}])`:"0"};
      var x11: ${l} = getInputValue(batch, channel, row1, col1);
      var x12: ${l} = getInputValue(batch, channel, row1, col2);
      var x21: ${l} = getInputValue(batch, channel, row2, col1);
      var x22: ${l} = getInputValue(batch, channel, row2, col2);
      var dx1: ${l} = abs(row - ${l}(row1));
      var dx2: ${l} = abs(${l}(row2) - row);
      var dy1: ${l} = abs(col - ${l}(col1));
      var dy2: ${l} = abs(${l}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},wp=(e,t,r,i,a,n,s,o,u,l)=>{let d=r.length===2,c=!0,[h,g]=d?[0,1]:c?[2,3]:[1,2],m=e.type.value,$=x=>{let _=x===h?"row":"col";return`
      fn ${_}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${m} {
        var output_index = ${t.indicesGet("output_indices",x)};
        var originalIdx: ${m} = getOriginalCoordinateFromResizedCoordinate(output_index, ${a[x]},
        ${i[x]}, ${r[x]}, ${n[x]}, ${n[x]} + ${r.length});
        var fractOriginalIdx: ${m} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${o} && (originalIdx < 0 || originalIdx > (${r[x]} - 1))) {
          return ${u};
        }
        var data: array<${m}, 4> = array<${m}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${_}: ${m} = originalIdx + ${m}(i);
          if (${_} < 0 || ${_} >= ${r[x]}) {
            ${l?`coefs[i + 1] = 0.0;
                        continue;`:o?`return ${u};`:`${_} = max(0, min(${_}, ${r[x]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",x,`u32(${_})`)};
          data[i + 1] = ${x===h?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${$(h)};
    ${$(g)};
  fn getCubicInterpolationCoefs(s: ${m}) -> array<${m}, 4> {
    var absS = abs(s);
    var coeffs: array<${m}, 4> = array<${m}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${m} = 1.0 - absS;
    var twoMinusAbsS: ${m} = 2.0 - absS;
    var onePlusAbsS: ${m} = 1.0 + absS;
    coeffs[0] = ((${s} * onePlusAbsS - 5 * ${s}) * onePlusAbsS + 8 * ${s}) * onePlusAbsS - 4 * ${s};
    coeffs[1] = ((${s} + 2) * absS - (${s} + 3)) * absS * absS + 1;
    coeffs[2] = ((${s} + 2) * oneMinusAbsS - (${s} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${s} * twoMinusAbsS - 5 * ${s}) * twoMinusAbsS + 8 * ${s}) * twoMinusAbsS - 4 * ${s};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${m}, 4>, coefs: array<${m}, 4>) -> ${m} {
    var coefsSum: ${m} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${m} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},_p=(e,t,r,i,a)=>{let[n,s,o,u,l]=r.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],d=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${d} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(depth, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",o,`max(0, min(height, ${r[o]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(width, ${r[u]} - 1))`)};
      ${ws(e,l,n,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${d} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${d} = originalIndices[${s}];
      var height:${d} = originalIndices[${o}];
      var width:${d} = originalIndices[${u}];
      ${i?`if (depth < 0 || depth > (${r[s]} - 1) || height < 0 || height > (${r[o]} - 1) || width < 0 || (width > ${r[u]} - 1)) {
      return ${a};
        }`:""};

    depth = max(0, min(depth, ${r[s]} - 1));
      height = max(0, min(height, ${r[o]} - 1));
      width = max(0, min(width, ${r[u]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${r.length>3?`u32(originalIndices[${l}])`:"0"};
      var batch: u32 =  ${r.length>3?`u32(originalIndices[${n}])`:"0"};

      var x111: ${d} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${d} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${d} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${d} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${d} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${d} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${d} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${d} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${d} = abs(depth - ${d}(depth1));
      var dx2: ${d} = abs(${d}(depth2) - depth);
      var dy1: ${d} = abs(height - ${d}(height1));
      var dy2: ${d} = abs(${d}(height2) - height);
      var dz1: ${d} = abs(width - ${d}(width1));
      var dz2: ${d} = abs(${d}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`},bp=(e,t,r,i,a,n)=>{let s=e.dims,o=pp(n,t.axes,s.length),u=cp(s,i,a,t.axes),l=i.slice();i.length===0&&(l=s.map((y,S)=>y===0?1:u[S]/y),t.keepAspectRatioPolicy!=="stretch"&&(u=hp(s,l,t)));let d=b("output",e.dataType,u.length),c=w("input",e.dataType,s.length),h=B.size(u),g=s.length===u.length&&s.every((y,S)=>y===u[S]),m=t.coordinateTransformMode==="tf_crop_and_resize",$=t.extrapolationValue,x=c.type.value,_=y=>`
      ${g?"":`
      ${lp(t.coordinateTransformMode,x)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${gp(c,s)};
              ${dp(t.nearestMode,r,x)};
              ${mp(c,d,s,u,l.length,o.length,m)};
              `;case"linear":return`
              ${fp(d,s,u,l.length,o.length)};
              ${(()=>{if(s.length===2||s.length===4)return`${yp(c,d,s,m,$)}`;if(s.length===3||s.length===5)return`${_p(c,d,s,m,$)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(s.length===2||s.length===4)return`${wp(c,d,s,u,l,o,t.cubicCoeffA,m,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${y.registerUniform("output_size","u32").registerUniform("scales","f32",l.length).registerUniform("roi","f32",o.length).declareVariables(c,d)}
      ${y.mainStart()}
        ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${g?"output[global_idx] = input[global_idx];":`
        let output_indices = ${d.offsetToIndices("global_idx")};
        var input_indices: ${c.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${c.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${s.length===2||s.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${r}|${l.length>0?t.mode==="cubic"?l:l.length:""}|${a.length>0?a:""}|${o.length>0?o:""}|${g}|${t.mode==="nearest"?s.length:s}`,inputDependencies:["rank"]},getShaderSource:_,getRunData:()=>({outputs:[{dims:u,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:[{type:12,data:h},{type:1,data:l},{type:1,data:o},...X(s,u)]})}},$p=e=>{let t=e.customDataBuffer;return new Uint32Array(t.buffer,t.byteOffset,1)[0]},vp=(e,t)=>{let r=[],i=[],a=[],n=$p(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");up(e.inputs,t,n,r,i,a),e.compute(bp(e.inputs[0],t,n,r,i,a),{inputs:[0]})},xp=e=>{let t=e.antialias,r=e.axes,i=e.coordinateTransformMode,a=e.cubicCoeffA,n=e.excludeOutside!==0,s=e.extrapolationValue,o=e.keepAspectRatioPolicy,u=e.mode,l=e.nearestMode===""?"simple":e.nearestMode;return Re({antialias:t,axes:r,coordinateTransformMode:i,cubicCoeffA:a,excludeOutside:n,extrapolationValue:s,keepAspectRatioPolicy:o,mode:u,nearestMode:l})}}),Sp,Tp,Ep,Ch=k(()=>{"use strict";se(),he(),R(),Sp=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],r=e[1],i=e[2];if(t.dataType!==r.dataType||t.dataType!==i.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(r.dims.length!==3&&r.dims.length!==2)throw new Error("Skip must be 2D or 3D");let a=t.dims[t.dims.length-1],n=t.dims[t.dims.length-2];if(r.dims[r.dims.length-1]!==a)throw new Error("Skip must have the same hidden size as input");if(r.dims[r.dims.length-2]!==n)throw new Error("Skip must have the same sequence length as input");if(i.dims.length!==1)throw new Error("Gamma must be 1D");if(i.dims[i.dims.length-1]!==a)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let s=e[3];if(s.dims.length!==1)throw new Error("Beta must be 1D");if(s.dims[s.dims.length-1]!==a)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let s=e[4];if(s.dims.length!==1)throw new Error("Bias must be 1D");if(s.dims[s.dims.length-1]!==a)throw new Error("Bias must have the same hidden size as input")}},Tp=(e,t,r,i)=>{let a=t.simplified,n=e[0].dims,s=B.size(n),o=n,u=s,l=n.slice(-1)[0],d=i?n.slice(0,-1).concat(1):[],c=!a&&e.length>3,h=e.length>4,g=i&&r>1,m=i&&r>2,$=r>3,x=64,_=Ge(l),y=[{type:12,data:u},{type:12,data:_},{type:12,data:l},{type:1,data:t.epsilon}],S=E=>{let z=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],C=[w("x",e[0].dataType,e[0].dims,_),w("skip",e[1].dataType,e[1].dims,_),w("gamma",e[2].dataType,e[2].dims,_)];c&&C.push(w("beta",e[3].dataType,e[3].dims,_)),h&&C.push(w("bias",e[4].dataType,e[4].dims,_)),C.push(b("output",e[0].dataType,o,_)),g&&C.push(b("mean_output",1,d)),m&&C.push(b("inv_std_output",1,d)),$&&C.push(b("input_skip_bias_sum",e[0].dataType,o,_));let M=nt(e[0].dataType),U=nt(1,_);return`

      ${E.registerUniforms(z).declareVariables(...C)}
      var<workgroup> sum_shared : array<${U}, ${x}>;
      var<workgroup> sum_squared_shared : array<${U}, ${x}>;

      ${E.mainStart([x,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${x};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${x};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${x-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${h?"bias[offset1d + i]":M+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${$?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${Er(M,_,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${x};
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${p("sum",_)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${p("square_sum",_)} / f32(uniforms.hidden_size) ${a?"":"- mean * mean"} + uniforms.epsilon);
        ${g?"mean_output[global_idx] = mean;":""}
        ${m?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${a?"":`- ${M}(mean)`}) *
            ${M}(inv_std_dev) * gamma[offset1d + i]
            ${c?"+ beta[offset1d + i]":""};
        }
      }`},T=[{dims:o,dataType:e[0].dataType}];return r>1&&T.push({dims:d,dataType:1}),r>2&&T.push({dims:d,dataType:1}),r>3&&T.push({dims:n,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${_};${g};${m};${$}`,inputDependencies:e.map((E,z)=>"type")},getShaderSource:S,getRunData:()=>({outputs:T,dispatchGroup:{x:Math.ceil(u/l)},programUniforms:y})}},Ep=(e,t)=>{Sp(e.inputs);let r=[0];e.outputCount>1&&r.push(-3),e.outputCount>2&&r.push(-3),e.outputCount>3&&r.push(3),e.compute(Tp(e.inputs,t,e.outputCount,!1),{outputs:r})}}),kp,Ra,Ip,_s,zp,Cp,Ap,Op,Ah=k(()=>{"use strict";se(),he(),Ke(),R(),kp=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((r,i)=>{if(e[i+1].dataType!==6&&e[i+1].dataType!==7)throw new Error(`Input ${i} must be an array of int32 or int64`)})},Ra=(e,t)=>{let r=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(i=>r.push(Number(i)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(i=>r.push(Number(i)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return r},Ip=(e,t)=>{if(e.length>1){let r=Ra(e,1),i=Ra(e,2),a=Ra(e,3);return a.length===0&&(a=[...Array(e[0].dims.length).keys()]),Re({starts:r,ends:i,axes:a})}else return t},_s=(e,t,r,i,a)=>{let n=e;return e<0&&(n+=r[i[t]]),a[t]<0?Math.max(0,Math.min(n,r[i[t]]-1)):Math.max(0,Math.min(n,r[i[t]]))},zp=(e,t,r)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${r.length-1}; i >= 0; i--) {
            let input_shape_i = ${f("uniforms.input_shape","i",r.length)};
            let steps_i = ${f("uniforms.steps","i",r.length)};
            let signs_i = ${f("uniforms.signs","i",r.length)};
            let starts_i = ${f("uniforms.starts","i",r.length)};
            var output_index = ${t.indicesGet("output_indices","i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${e.indicesSet("input_indices","i","input_index")};
          }
          return input_indices;
      }`,Cp=(e,t)=>{let r=e[0].dims,i=B.size(r),a=t.axes.length>0?B.normalizeAxes(t.axes,r.length):[...Array(r.length).keys()],n=Ra(e,4);n.forEach(_=>_!==0||(()=>{throw new Error("step cannot be 0")})),n.length===0&&(n=Array(a.length).fill(1));let s=t.starts.map((_,y)=>_s(_,y,r,a,n)),o=t.ends.map((_,y)=>_s(_,y,r,a,n));if(a.length!==s.length||a.length!==o.length)throw new Error("start, ends and axes should have the same number of elements");if(a.length!==r.length)for(let _=0;_<r.length;++_)a.includes(_)||(s.splice(_,0,0),o.splice(_,0,r[_]),n.splice(_,0,1));let u=n.map(_=>Math.sign(_));n.forEach((_,y,S)=>{if(_<0){let T=(o[y]-s[y])/_,E=s[y],z=E+T*n[y];s[y]=z,o[y]=E,S[y]=-_}});let l=r.slice(0);a.forEach((_,y)=>{l[_]=Math.ceil((o[_]-s[_])/n[_])});let d={dims:l,dataType:e[0].dataType},c=b("output",e[0].dataType,l.length),h=w("input",e[0].dataType,e[0].dims.length),g=B.size(l),m=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:s.length},{name:"signs",type:"i32",length:u.length},{name:"steps",type:"u32",length:n.length}],$=[{type:12,data:g},{type:12,data:s},{type:6,data:u},{type:12,data:n},...X(e[0].dims,l)],x=_=>`
      ${_.registerUniforms(m).declareVariables(h,c)}
        ${zp(h,c,r)}
        ${_.mainStart()}
          ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${c.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${c.setByOffset("global_idx",h.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${u.length}_${s.length}_${n.length}`,inputDependencies:["rank"]},getShaderSource:x,getRunData:()=>({outputs:[d],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:$})}},Ap=(e,t)=>{kp(e.inputs,t);let r=Ip(e.inputs,t);e.compute(Cp(e.inputs,r),{inputs:[0]})},Op=e=>{let t=e.starts,r=e.ends,i=e.axes;return Re({starts:t,ends:r,axes:i})}}),Rp,Bp,Mp,Dp,Oh=k(()=>{"use strict";se(),he(),Ke(),Ue(),R(),Rp=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},Bp=(e,t)=>{let r=e.inputs[0],i=r.dims,a=B.size(i),n=i.length,s=B.normalizeAxis(t.axis,n),o=s<i.length-1,u,l=[];o?(l=Array.from({length:n},(C,M)=>M),l[s]=n-1,l[n-1]=s,u=e.compute(Ie(r,l),{inputs:[r],outputs:[-1]})[0]):u=r;let d=u.dims,c=d[n-1],h=a/c,g=Ge(c),m=c/g,$=64;h===1&&($=256);let x=(C,M)=>M===4?`max(max(${C}.x, ${C}.y), max(${C}.z, ${C}.w))`:M===2?`max(${C}.x, ${C}.y)`:M===3?`max(max(${C}.x, ${C}.y), ${C}.z)`:C,_=w("x",u.dataType,u.dims,g),y=b("result",u.dataType,u.dims,g),S=_.type.value,T=nt(u.dataType)==="f32"?`var threadMax = ${S}(-3.4028234663852886e+38f);`:`var threadMax = ${S}(-65504.0h);`,E=C=>`
      var<workgroup> rowMaxShared : ${S};
      var<workgroup> rowSumShared : ${S};
      var<workgroup> threadShared : array<${S}, ${$}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${S} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${S}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${C.registerUniform("packedCols","i32").declareVariables(_,y)}
      ${C.mainStart($)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${$};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${T}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${S}(${x("threadShared[0]",g)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${S}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${S}(${p("threadShared[0]",g)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          var value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          // max operation protects against NaN since all values should be >=0
          value = max(value, ${S}(0.0));
          setValue(row, col, row_stride, value);
        }
      }`,z=e.compute({name:"Softmax",shaderCache:{hint:`${g};${$}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:d,dataType:u.dataType}],dispatchGroup:{x:h},programUniforms:[{type:6,data:m}]}),getShaderSource:E},{inputs:[u],outputs:[o?-1:0]})[0];o&&e.compute(Ie(z,l),{inputs:[z]})},Mp=(e,t)=>{Rp(e.inputs),Bp(e,t)},Dp=e=>Re({axis:e.axis})}),bs,Pp,Up,Lp,Np,Rh=k(()=>{"use strict";se(),he(),R(),bs=e=>Array.from(e.getBigInt64Array(),Number),Pp=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(bs(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},Up=(e,t)=>{let r=[];for(let i=0;i<e.length;++i)r.push(e[i]*t[i]);return r},Lp=(e,t)=>{let r=e[0].dims,i=t??bs(e[1]),a=Up(r,i),n=B.size(a),s=e[0].dataType,o=w("input",s,r.length),u=b("output",s,a.length),l=d=>`
      const inputShape = ${o.indices(...r)};
      ${d.registerUniform("output_size","u32").declareVariables(o,u)}
      ${d.mainStart()}
      ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${u.offsetToIndices("global_idx")};
      var input_indices: ${o.type.indices};
      for (var i = 0; i < ${r.length}; i++) {
        let input_dim_i = ${o.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${u.indicesGet("output_indices","i")}  % input_dim_i;

        ${o.indicesSet("input_indices","i","input_dim_value")}
      }
      ${u.setByOffset("global_idx",o.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${i}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:[{type:12,data:n},...X(e[0].dims,a)]}),getShaderSource:l}},Np=e=>{Pp(e.inputs),e.compute(Lp(e.inputs),{inputs:[0]})}}),qp,Fp,Vp,Bh=k(()=>{"use strict";se(),he(),R(),qp=(e,t,r,i,a)=>{let n=b("output_data",a,r.length,4),s=w("a_data",t[1].dataType,t[1].dims.length,4),o=w("b_data",t[2].dataType,t[2].dims.length,4),u=w("c_data",t[0].dataType,t[0].dims.length,4),l,d=(c,h,g)=>`select(${h}, ${c}, ${g})`;if(!i)l=n.setByOffset("global_idx",d(s.getByOffset("global_idx"),o.getByOffset("global_idx"),u.getByOffset("global_idx")));else{let c=(h,g,m="")=>{let $=`a_data[index_a${g}][component_a${g}]`,x=`b_data[index_b${g}][component_b${g}]`,_=`bool(c_data[index_c${g}] & (0xffu << (component_c${g} * 8)))`;return`
            let output_indices${g} = ${n.offsetToIndices(`global_idx * 4u + ${g}u`)};
            let offset_a${g} = ${s.broadcastedIndicesToOffset(`output_indices${g}`,n)};
            let offset_b${g} = ${o.broadcastedIndicesToOffset(`output_indices${g}`,n)};
            let offset_c${g} = ${u.broadcastedIndicesToOffset(`output_indices${g}`,n)};
            let index_a${g} = offset_a${g} / 4u;
            let index_b${g} = offset_b${g} / 4u;
            let index_c${g} = offset_c${g} / 4u;
            let component_a${g} = offset_a${g} % 4u;
            let component_b${g} = offset_b${g} % 4u;
            let component_c${g} = offset_c${g} % 4u;
            ${h}[${g}] = ${m}(${d($,x,_)});
          `};a===9?l=`
            var data = vec4<u32>(0);
            ${c("data",0,"u32")}
            ${c("data",1,"u32")}
            ${c("data",2,"u32")}
            ${c("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:l=`
            ${c("output_data[global_idx]",0)}
            ${c("output_data[global_idx]",1)}
            ${c("output_data[global_idx]",2)}
            ${c("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(u,s,o,n)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${l}
      }`},Fp=e=>{let t=e[1].dims,r=e[2].dims,i=e[0].dims,a=e[1].dataType,n=!(B.areEqual(t,r)&&B.areEqual(r,i)),s=t,o=B.size(t);if(n){let l=Ut.calcShape(Ut.calcShape(t,r,!1),i,!1);if(!l)throw new Error("Can't perform where op on the given tensors");s=l,o=B.size(s)}let u=Math.ceil(o/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:l=>qp(l,e,s,n,a),getRunData:()=>({outputs:[{dims:s,dataType:a}],dispatchGroup:{x:Math.ceil(o/64/4)},programUniforms:[{type:12,data:u},...X(i,t,r,s)]})}},Vp=e=>{e.compute(Fp(e.inputs))}}),Gp,Mh=k(()=>{"use strict";Kc(),An(),Zc(),Qc(),Xc(),Yc(),Jc(),ah(),sh(),oh(),uh(),lh(),dh(),ph(),ch(),hh(),fh(),mh(),gh(),yh(),wh(),_h(),bh(),$h(),vh(),xh(),rd(),Sh(),Th(),Eh(),kh(),Ih(),In(),zh(),cd(),Ch(),Ah(),Oh(),ld(),Rh(),Ue(),Mn(),Bh(),Gp=new Map([["Abs",[yo]],["Acos",[wo]],["Acosh",[_o]],["Add",[ou]],["ArgMax",[to,Cn]],["ArgMin",[eo,Cn]],["Asin",[bo]],["Asinh",[$o]],["Atan",[vo]],["Atanh",[xo]],["Attention",[oo]],["AveragePool",[Fd,qd]],["BatchNormalization",[co]],["BiasAdd",[mo]],["BiasSplitGelu",[au]],["Cast",[To,So]],["Ceil",[Io]],["Clip",[ko]],["Concat",[_u,bu]],["Conv",[Kn,jn]],["ConvTranspose",[Hu,Gu]],["Cos",[zo]],["Cosh",[Co]],["CumSum",[Zu,Qu]],["DepthToSpace",[el,tl]],["DequantizeLinear",[Xd,Yd]],["DFT",[ul,ll]],["Div",[uu]],["Einsum",[ml,gl]],["Elu",[Ao,Ea]],["Equal",[lu]],["Erf",[Oo]],["Exp",[Ro]],["Expand",[bl]],["FastGelu",[vl]],["Floor",[Bo]],["FusedConv",[Kn,jn]],["Gather",[El,Tl]],["GatherElements",[Pl,Dl]],["GatherBlockQuantized",[Ol,Rl]],["GatherND",[Il,zl]],["Gelu",[Mo]],["Gemm",[ql,Nl]],["GlobalAveragePool",[Gd,Vd]],["GlobalMaxPool",[Kd,Hd]],["Greater",[hu]],["GreaterOrEqual",[mu]],["GridSample",[Ql,Xl]],["GroupQueryAttention",[gd]],["HardSigmoid",[Vo,Fo]],["HardSwish",[Go]],["InstanceNormalization",[_d]],["LayerNormalization",[vd]],["LeakyRelu",[Do,Ea]],["Less",[fu]],["LessOrEqual",[gu]],["Log",[Yo]],["MatMul",[Sd]],["MatMulNBits",[Id,zd]],["MaxPool",[Wd,jd]],["Mul",[du]],["MultiHeadAttention",[td,Jl]],["Neg",[Uo]],["Not",[Po]],["Pad",[Ud]],["Pow",[pu]],["QuickGelu",[tu,Ea]],["Range",[tp]],["Reciprocal",[Lo]],["ReduceMin",[Zs]],["ReduceMean",[Gs]],["ReduceMax",[Ks]],["ReduceSum",[Xs]],["ReduceProd",[Qs]],["ReduceL1",[Ws]],["ReduceL2",[js]],["ReduceLogSum",[Js]],["ReduceLogSumExp",[Hs]],["ReduceSumSquare",[Ys]],["Relu",[No]],["Resize",[vp,xp]],["RotaryEmbedding",[pd]],["ScatterND",[np,ap]],["Sigmoid",[qo]],["Sin",[Wo]],["Sinh",[jo]],["Slice",[Ap,Op]],["SkipLayerNormalization",[Ep]],["Split",[od,ud]],["Sqrt",[Ho]],["Softmax",[Mp,Dp]],["Sub",[cu]],["Tan",[Ko]],["Tanh",[Zo]],["ThresholdedRelu",[Xo,Ea]],["Tile",[Np]],["Transpose",[fe,de]],["Where",[Vp]]])}),Wp,Dh=k(()=>{"use strict";st(),Ot(),R(),Wp=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,r,i,a){Xe(e.programInfo.name);let n=this.backend.device,s=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let o=[];for(let l of t)o.push({binding:o.length,resource:{buffer:l.buffer}});for(let l of r)o.push({binding:o.length,resource:{buffer:l.buffer}});a&&o.push({binding:o.length,resource:a});let u=n.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:o,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let l={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:u,dispatchGroup:i};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(l)}s.setPipeline(e.computePipeline),s.setBindGroup(0,u),s.dispatchWorkgroups(...i),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),He(e.programInfo.name)}dispose(){}build(e,t){Xe(e.name);let r=this.backend.device,i=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(l=>{r.features.has(l.feature)&&i.push(`enable ${l.extension};`)});let a=O(t,this.backend.device.limits),n=e.getShaderSource(a),s=`${i.join(`
`)}
${a.additionalImplementations}
${n}`,o=r.createShaderModule({code:s,label:e.name});ke("verbose",()=>`[WebGPU] ${e.name} shader code: ${s}`);let u=r.createComputePipeline({compute:{module:o,entryPoint:"main"},layout:"auto",label:e.name});return He(e.name),{programInfo:e,computePipeline:u,uniformVariablesInfo:a.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,r=typeof e=="number"?1:e.y||1,i=typeof e=="number"?1:e.z||1,a=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=a&&r<=a&&i<=a)return[t,r,i];let n=t*r*i,s=Math.ceil(Math.sqrt(n));if(s>a){if(s=Math.ceil(Math.cbrt(n)),s>a)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[s,s,s]}else return[s,s,1]}}}),jp={};Q(jp,{WebGpuBackend:()=>Qp});var Hp,Kp,Zp,Qp,Ph=k(()=>{"use strict";st(),se(),Ot(),Si(),Ka(),Mh(),Dh(),Hp=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let r=[];for(let i=0;i<e.length;++i){let a=e[i].dataType;switch(t[i]){case"none":{r.push("");break}case"type":{r.push(`${a}`);break}case"rank":{let n=e[i].dims.length;r.push(`${a};${n}`);break}case"dims":{let n=e[i].dims.join(",");r.push(`${a};${n}`);break}default:throw new Error(`unsupported input dependency: ${t[i]}`)}}return r.join("|")},Kp=(e,t,r)=>{var a,n;let i=e.name;return(a=e.shaderCache)!=null&&a.hint&&(i+="["+e.shaderCache.hint+"]"),i+=":"+r+`:${Hp(t,((n=e.shaderCache)==null?void 0:n.inputDependencies)??new Array(t.length).fill("dims"))}`,i},Zp=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},Qp=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let r=[],i={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:r},a=o=>t.features.has(o)&&r.push(o)&&!0;a("chromium-experimental-timestamp-query-inside-passes")||a("timestamp-query"),a("shader-f16"),a("subgroups"),this.device=await t.requestDevice(i);let n=t,s=t.info??(typeof n.requestAdapterInfo=="function"?await n.requestAdapterInfo():void 0);this.adapterInfo=new Zp(s),this.gpuDataManager=_a(this),this.programManager=new Wp(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,bi(e.logLevel,!!e.debug),this.device.onuncapturederror=o=>{o.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${o.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!0}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){var e;typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose(),this.device&&((e=this.env)!=null&&e.webgpu)&&this.device.lost.then(()=>{delete this.env.webgpu.device})}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;Xe(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{var i;let t=new BigUint64Array(e.getMappedRange()),r=this.pendingQueries.get(e);for(let a=0;a<t.length/2;a++){let n=r[a],s=n.kernelId,o=this.kernels.get(s),u=o.kernelType,l=o.kernelName,d=n.programName,c=n.inputTensorViews,h=n.outputTensorViews,g=t[a*2],m=t[a*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=g);let $=Number(g-this.queryTimeBase),x=Number(m-this.queryTimeBase);if(!Number.isSafeInteger($)||!Number.isSafeInteger(x))throw new RangeError("incorrect timestamp range");if((i=this.env.webgpu.profiling)!=null&&i.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:c.map(_=>({dims:_.dims,dataType:kt(_.dataType)})),outputsMetadata:h.map(_=>({dims:_.dims,dataType:kt(_.dataType)})),kernelId:s,kernelType:u,kernelName:l,programName:d,startTime:$,endTime:x});else{let _="";c.forEach((S,T)=>{_+=`input[${T}]: [${S.dims}] | ${kt(S.dataType)}, `});let y="";h.forEach((S,T)=>{y+=`output[${T}]: [${S.dims}] | ${kt(S.dataType)}, `}),console.log(`[profiling] kernel "${s}|${u}|${l}|${d}" ${_}${y}start time: ${$} ns, execution time: ${x-$} ns`)}mt("GPU",`${d}::${g}::${m}`)}e.unmap(),this.pendingQueries.delete(e)}),He()}run(e,t,r,i,a,n){Xe(e.name);let s=[];for(let y=0;y<t.length;++y){let S=t[y].data;if(S===0)continue;let T=this.gpuDataManager.get(S);if(!T)throw new Error(`no GPU data for input: ${S}`);s.push(T)}let{outputs:o,dispatchGroup:u,programUniforms:l}=e.getRunData(t),d=r.length===0?o.map((y,S)=>S):r;if(d.length!==o.length)throw new Error(`Output size ${d.length} must be equal to ${o.length}.`);let c=[],h=[];for(let y=0;y<o.length;++y){if(!Number.isInteger(d[y])||d[y]<-3||d[y]>=n)throw new Error(`Invalid output index: ${d[y]}`);if(d[y]===-3)continue;let S=d[y]===-1,T=d[y]===-2,E=S||T?a(o[y].dataType,o[y].dims):i(d[y],o[y].dataType,o[y].dims);if(c.push(E),E.data===0)continue;let z=this.gpuDataManager.get(E.data);if(!z)throw new Error(`no GPU data for output: ${E.data}`);if(S&&this.temporaryData.push(z),T){let C=this.kernelPersistentData.get(this.currentKernelId);C||(C=[],this.kernelPersistentData.set(this.currentKernelId,C)),C.push(z)}h.push(z)}if(s.length!==t.length||h.length!==c.length){if(h.length===0)return He(e.name),c;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let g;if(l){let y=0,S=[];l.forEach(C=>{let M=typeof C.data=="number"?[C.data]:C.data;if(M.length===0)return;let U=C.type===10?2:4,V,ae;C.type===10?(ae=M.length>4?16:M.length>2?8:M.length*U,V=M.length>4?16:U*M.length):(ae=M.length<=2?M.length*U:16,V=16),y=Math.ceil(y/ae)*ae,S.push(y);let K=C.type===10?8:4;y+=M.length>4?Math.ceil(M.length/K)*V:M.length*U});let T=16;y=Math.ceil(y/T)*T;let E=new ArrayBuffer(y);l.forEach((C,M)=>{let U=S[M],V=typeof C.data=="number"?[C.data]:C.data;if(C.type===6)new Int32Array(E,U,V.length).set(V);else if(C.type===12)new Uint32Array(E,U,V.length).set(V);else if(C.type===10)new Uint16Array(E,U,V.length).set(V);else if(C.type===1)new Float32Array(E,U,V.length).set(V);else throw new Error(`Unsupported uniform type: ${kt(C.type)}`)});let z=this.gpuDataManager.create(y,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(z.buffer,0,E,0,y),this.gpuDataManager.release(z.id),g={offset:0,size:y,buffer:z.buffer}}let m=this.programManager.normalizeDispatchGroupSize(u),$=m[1]===1&&m[2]===1,x=Kp(e,t,$),_=this.programManager.getArtifact(x);if(_||(_=this.programManager.build(e,m),this.programManager.setArtifact(x,_),ke("info",()=>`[artifact] key: ${x}, programName: ${e.name}`)),l&&_.uniformVariablesInfo){if(l.length!==_.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${_.uniformVariablesInfo.length}, got ${l.length} in program "${_.programInfo.name}".`);for(let y=0;y<l.length;y++){let S=l[y],T=S.type,E=typeof S.data=="number"?1:S.data.length,[z,C]=_.uniformVariablesInfo[y];if(T!==z||E!==C)throw new Error(`Uniform variable ${y} mismatch: expect type ${z} with size ${C}, got type ${T} with size ${E} in program "${_.programInfo.name}".`)}}if(ke("info",()=>`[ProgramManager] run "${e.name}" (key=${x}) with ${m[0]}x${m[1]}x${m[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let y={kernelId:this.currentKernelId,programName:_.programInfo.name,inputTensorViews:t,outputTensorViews:c};this.pendingKernels.push(y),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(y)}return this.programManager.run(_,s,h,m,g),He(e.name),c}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,r,i){let a=Gp.get(e);if(!a)throw new Error(`kernel not implemented: ${e}`);let n={kernelType:e,kernelName:i,kernelEntry:a[0],attributes:[a[1],r]};this.kernels.set(t,n)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let r of t)this.gpuDataManager.release(r.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,r){let i=this.kernels.get(e);if(!i)throw new Error(`kernel not created: ${e}`);let a=i.kernelType,n=i.kernelName,s=i.kernelEntry,o=i.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${a}] ${n}" is not allowed to be called recursively`);this.currentKernelId=e,o[0]&&(o[1]=o[0](o[1]),o[0]=void 0),ke("info",()=>`[WebGPU] Start to run kernel "[${a}] ${n}"...`);let u=this.env.debug;this.temporaryData=[];try{return u&&this.device.pushErrorScope("validation"),s(t,o[1]),0}catch(l){return r.push(Promise.resolve(`[WebGPU] Kernel "[${a}] ${n}" failed. ${l}`)),1}finally{u&&r.push(this.device.popErrorScope().then(l=>l?`GPU validation error for kernel "[${a}] ${n}": ${l.message}`:null));for(let l of this.temporaryData)this.gpuDataManager.release(l.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,r,i){let a=this.sessionExternalDataMapping.get(e);a||(a=new Map,this.sessionExternalDataMapping.set(e,a));let n=a.get(t),s=this.gpuDataManager.registerExternalBuffer(r,i,n);return a.set(t,[s,r]),s}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(r=>this.gpuDataManager.unregisterExternalBuffer(r[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,r){return async()=>{let i=await zi(this,e,t);return ei(i.buffer,r)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){var e;this.queryType="none",(((e=this.env.webgpu.profiling)==null?void 0:e.mode)==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){ke("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){ke("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){ke("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),r=e.length;this.pendingKernels=[];for(let i=0;i<r;i++){let a=this.getComputePassEncoder(),n=e[i];this.writeTimestamp(this.pendingDispatchNumber*2),a.setPipeline(n.computePipeline),a.setBindGroup(0,n.bindGroup),a.dispatchWorkgroups(...n.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[i]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),Xp={};Q(Xp,{init:()=>Jp});var un,Yp,Jp,Uh=k(()=>{"use strict";se(),Ot(),he(),Ha(),un=class Vc{constructor(t,r,i,a){this.module=t,this.dataType=r,this.data=i,this.dims=a}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=B.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=B.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=B.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=B.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(B.size(t)!==B.size(this.dims))throw new Error("Invalid new shape");return new Vc(this.module,this.dataType,this.data,t)}},Yp=class{constructor(e,t,r){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo,this.deviceLimits=t.device.limits;let i=e.PTR_SIZE,a=r/e.PTR_SIZE,n=i===4?"i32":"i64";this.opKernelContext=Number(e.getValue(i*a++,n));let s=Number(e.getValue(i*a++,n));this.outputCount=Number(e.getValue(i*a++,n)),this.customDataOffset=Number(e.getValue(i*a++,"*")),this.customDataSize=Number(e.getValue(i*a++,n));let o=[];for(let u=0;u<s;u++){let l=Number(e.getValue(i*a++,n)),d=Number(e.getValue(i*a++,"*")),c=Number(e.getValue(i*a++,n)),h=[];for(let g=0;g<c;g++)h.push(Number(e.getValue(i*a++,n)));o.push(new un(e,l,d,h))}this.inputs=o}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){var s;let r=((s=t==null?void 0:t.inputs)==null?void 0:s.map(o=>typeof o=="number"?this.inputs[o]:o))??this.inputs,i=(t==null?void 0:t.outputs)??[],a=(o,u,l)=>new un(this.module,u,this.output(o,l),l),n=(o,u)=>{let l=It(o,u);if(!l)throw new Error(`Unsupported data type: ${o}`);let d=l>0?this.backend.gpuDataManager.create(l).id:0;return new un(this.module,o,d,u)};return this.backend.run(e,r,i,a,n,this.outputCount)}output(e,t){let r=this.module.stackSave();try{let i=this.module.PTR_SIZE,a=i===4?"i32":"i64",n=this.module.stackAlloc((1+t.length)*i);this.module.setValue(n,t.length,a);for(let s=0;s<t.length;s++)this.module.setValue(n+i*(s+1),t[s],a);return this.module._JsepOutput(this.opKernelContext,e,n)}catch(i){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${i}`)}finally{this.module.stackRestore(r)}}},Jp=async(e,t,r,i)=>{let a=t.jsepInit;if(!a)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let n=(Ph(),Se(jp)).WebGpuBackend,s=new n;await s.initialize(r,i),a("webgpu",[s,o=>s.alloc(Number(o)),o=>s.free(o),(o,u,l,d=!1)=>{if(d)ke("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(o)}, dst=${Number(u)}, size=${Number(l)}`),s.memcpy(Number(o),Number(u));else{ke("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(o)}, gpuDataId=${Number(u)}, size=${Number(l)}`);let c=t.HEAPU8.subarray(Number(o>>>0),Number(o>>>0)+Number(l));s.upload(Number(u),c)}},async(o,u,l)=>{ke("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${o}, dataOffset=${u}, size=${l}`),await s.download(Number(o),()=>t.HEAPU8.subarray(Number(u)>>>0,Number(u+l)>>>0))},(o,u,l)=>s.createKernel(o,Number(u),l,t.UTF8ToString(t._JsepGetNodeName(Number(u)))),o=>s.releaseKernel(o),(o,u,l,d)=>{ke("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${l}, kernel=${o}, contextDataOffset=${u}`);let c=new Yp(t,s,Number(u));return s.computeKernel(Number(o),c,d)},()=>s.captureBegin(),()=>s.captureEnd(),()=>s.replay()])}else{let n=new ya(r);a("webnn",[n,()=>n.reserveTensorId(),s=>n.releaseTensorId(s),async(s,o,u,l,d)=>n.ensureTensor(s,o,u,l,d),(s,o)=>{n.uploadTensor(s,o)},async(s,o)=>n.downloadTensor(s,o),(s,o)=>n.registerMLContext(s,o),!!r.trace])}}}),ec,$s,vs,zr,tc,xs,ln,Ss,Ts,Ba,rc,hi,ic,ac,Es,ks,Is,zs,nc=k(()=>{"use strict";st(),En(),kn(),se(),Tt(),Kr(),Jr(),ec=(e,t)=>{ne()._OrtInit(e,t)!==0&&Z("Can't initialize onnxruntime.")},$s=async e=>{ec(e.wasm.numThreads,Qr(e.logLevel))},vs=async(e,t)=>{var i,a;(a=(i=ne()).asyncInit)==null||a.call(i);let r=e.webgpu.adapter;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");if(r){if(typeof r.limits!="object"||typeof r.features!="object"||typeof r.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let n=e.webgpu.powerPreference;if(n!==void 0&&n!=="low-power"&&n!=="high-performance")throw new Error(`Invalid powerPreference setting: "${n}"`);let s=e.webgpu.forceFallbackAdapter;if(s!==void 0&&typeof s!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${s}"`);if(r=await navigator.gpu.requestAdapter({powerPreference:n,forceFallbackAdapter:s}),!r)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}}if(t==="webnn"&&(typeof navigator>"u"||!navigator.ml))throw new Error("WebNN is not supported in current environment");{let n=(Uh(),Se(Xp)).init;t==="webgpu"&&await n("webgpu",ne(),e,r),t==="webnn"&&await n("webnn",ne(),e)}},zr=new Map,tc=e=>{let t=ne(),r=t.stackSave();try{let i=t.PTR_SIZE,a=t.stackAlloc(2*i);t._OrtGetInputOutputCount(e,a,a+i)!==0&&Z("Can't get session input/output count.");let n=i===4?"i32":"i64";return[Number(t.getValue(a,n)),Number(t.getValue(a+i,n))]}finally{t.stackRestore(r)}},xs=(e,t)=>{let r=ne(),i=r.stackSave(),a=0;try{let n=r.PTR_SIZE,s=r.stackAlloc(2*n);r._OrtGetInputOutputMetadata(e,t,s,s+n)!==0&&Z("Can't get session input/output metadata.");let o=Number(r.getValue(s,"*"));a=Number(r.getValue(s+n,"*"));let u=r.HEAP32[a/4];if(u===0)return[o,0];let l=r.HEAPU32[a/4+1],d=[];for(let c=0;c<l;c++){let h=Number(r.getValue(a+8+c*n,"*"));d.push(h!==0?r.UTF8ToString(h):Number(r.getValue(a+8+(c+l)*n,"*")))}return[o,u,d]}finally{r.stackRestore(i),a!==0&&r._OrtFree(a)}},ln=e=>{let t=ne(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},Ss=async(e,t)=>{var c,h,g,m;let r,i,a=ne();Array.isArray(e)?[r,i]=e:e.buffer===a.HEAPU8.buffer?[r,i]=[e.byteOffset,e.byteLength]:[r,i]=ln(e);let n=0,s=0,o=0,u=[],l=[],d=[];try{if([s,u]=await ca(t),(t==null?void 0:t.externalData)&&a.mountExternalData){let M=[];for(let U of t.externalData){let V=typeof U=="string"?U:U.path,ae=typeof U=="string"?U:U.data;M.push(dr(ae).then(K=>{a.mountExternalData(V,K)}))}await Promise.all(M)}for(let M of(t==null?void 0:t.executionProviders)??[])if((typeof M=="string"?M:M.name)==="webnn"){if(a.shouldTransferToMLTensor=!1,typeof M!="string"){let U=M,V=U==null?void 0:U.context,ae=U==null?void 0:U.gpuDevice,K=U==null?void 0:U.deviceType,Y=U==null?void 0:U.powerPreference;V?a.currentContext=V:ae?a.currentContext=await a.webnnCreateMLContext(ae):a.currentContext=await a.webnnCreateMLContext({deviceType:K,powerPreference:Y})}else a.currentContext=await a.webnnCreateMLContext();break}n=await a._OrtCreateSession(r,i,s),(c=a.webgpuOnCreateSession)==null||c.call(a,n),n===0&&Z("Can't create a session."),(h=a.jsepOnCreateSession)==null||h.call(a),a.currentContext&&(a.webnnRegisterMLContext(n,a.currentContext),a.currentContext=void 0,a.shouldTransferToMLTensor=!0);let[$,x]=tc(n),_=!!(t!=null&&t.enableGraphCapture),y=[],S=[],T=[],E=[],z=[];for(let M=0;M<$;M++){let[U,V,ae]=xs(n,M);U===0&&Z("Can't get an input name."),l.push(U);let K=a.UTF8ToString(U);y.push(K),T.push(V===0?{name:K,isTensor:!1}:{name:K,isTensor:!0,type:kt(V),shape:ae})}for(let M=0;M<x;M++){let[U,V,ae]=xs(n,M+$);U===0&&Z("Can't get an output name."),d.push(U);let K=a.UTF8ToString(U);S.push(K),E.push(V===0?{name:K,isTensor:!1}:{name:K,isTensor:!0,type:kt(V),shape:ae});{if(_&&(t==null?void 0:t.preferredOutputLocation)===void 0){z.push("gpu-buffer");continue}let Y=typeof(t==null?void 0:t.preferredOutputLocation)=="string"?t.preferredOutputLocation:((g=t==null?void 0:t.preferredOutputLocation)==null?void 0:g[K])??"cpu",Ce=a.webnnIsGraphOutput;if(Y==="cpu"&&Ce&&Ce(n,K)){z.push("ml-tensor-cpu-output");continue}if(Y!=="cpu"&&Y!=="cpu-pinned"&&Y!=="gpu-buffer"&&Y!=="ml-tensor")throw new Error(`Not supported preferred output location: ${Y}.`);if(_&&Y!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${Y}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);z.push(Y)}}let C=null;return z.some(M=>M==="gpu-buffer"||M==="ml-tensor"||M==="ml-tensor-cpu-output")&&(o=a._OrtCreateBinding(n),o===0&&Z("Can't create IO binding."),C={handle:o,outputPreferredLocations:z,outputPreferredLocationsEncoded:z.map(M=>M==="ml-tensor-cpu-output"?"ml-tensor":M).map(M=>yi(M))}),zr.set(n,[n,l,d,C,_,!1]),[n,y,S,T,E]}catch($){throw l.forEach(x=>a._OrtFree(x)),d.forEach(x=>a._OrtFree(x)),o!==0&&a._OrtReleaseBinding(o)!==0&&Z("Can't release IO binding."),n!==0&&a._OrtReleaseSession(n)!==0&&Z("Can't release session."),$}finally{a._free(r),s!==0&&a._OrtReleaseSessionOptions(s)!==0&&Z("Can't release session options."),u.forEach($=>a._free($)),(m=a.unmountExternalData)==null||m.call(a)}},Ts=e=>{var u,l,d;let t=ne(),r=zr.get(e);if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[i,a,n,s,o]=r;s&&(o&&t._OrtClearBoundOutputs(s.handle)!==0&&Z("Can't clear bound outputs."),t._OrtReleaseBinding(s.handle)!==0&&Z("Can't release IO binding.")),(u=t.jsepOnReleaseSession)==null||u.call(t,e),(l=t.webnnOnReleaseSession)==null||l.call(t,e),(d=t.webgpuOnReleaseSession)==null||d.call(t,e),a.forEach(c=>t._OrtFree(c)),n.forEach(c=>t._OrtFree(c)),t._OrtReleaseSession(i)!==0&&Z("Can't release session."),zr.delete(e)},Ba=new Map,rc=1,hi=new Map,ic=e=>{let t=ne(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a LoRA adapter. failed to allocate a buffer of size ${e.byteLength}.`);try{t.HEAPU8.set(e,r);let i=t._OrtCreateLoraAdapter(r,e.byteLength);i===0&&Z("Can't create a LoRA adapter.");let a=rc++;return Ba.set(a,i),a}finally{t._free(r)}},ac=e=>{let t=ne(),r=Ba.get(e);if(r===void 0)throw new Error(`cannot release LoRA adapter. invalid adapter id: ${e}`);if(hi.has(e))throw new Error(`cannot release LoRA adapter. the adapter is used by a run in progress. adapter id: ${e}`);t._OrtReleaseLoraAdapter(r)!==0&&Z("Can't release LoRA adapter."),Ba.delete(e)},Es=async(e,t,r,i,a,n,s=!1)=>{if(!e){t.push(0);return}let o=ne(),u=o.PTR_SIZE,l=e[0],d=e[1],c=e[3],h=c,g,m;if(l==="string"&&(c==="gpu-buffer"||c==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(s&&c!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${n} when enableGraphCapture is true.`);if(c==="gpu-buffer"){let _=e[2].gpuBuffer;m=It(Et(l),d);{let y=o.jsepRegisterBuffer;if(!y)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');g=y(i,n,_,m)}}else if(c==="ml-tensor"){let _=e[2].mlTensor;m=It(Et(l),d);let y=o.webnnRegisterMLTensor;if(!y)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');g=y(i,_,Et(l),d)}else{let _=e[2];if(Array.isArray(_)){m=u*_.length,g=o._malloc(m),r.push(g);for(let y=0;y<_.length;y++){if(typeof _[y]!="string")throw new TypeError(`tensor data at index ${y} is not a string`);o.setValue(g+y*u,at(_[y],r),"*")}}else{let y=o.webnnIsGraphInput,S=o.webnnIsGraphOutput;if(l!=="string"&&y&&S){let T=o.UTF8ToString(a);if(y(i,T)||S(i,T)){let E=Et(l);m=It(E,d),h="ml-tensor";let z=o.webnnCreateTemporaryTensor,C=o.webnnUploadTensor;if(!z||!C)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let M=await z(i,E,d);C(M,new Uint8Array(_.buffer,_.byteOffset,_.byteLength)),g=M}else m=_.byteLength,g=o._malloc(m),r.push(g),o.HEAPU8.set(new Uint8Array(_.buffer,_.byteOffset,m),g)}else m=_.byteLength,g=o._malloc(m),r.push(g),o.HEAPU8.set(new Uint8Array(_.buffer,_.byteOffset,m),g)}}let $=o.stackSave(),x=o.stackAlloc(4*d.length);try{d.forEach((y,S)=>o.setValue(x+S*u,y,u===4?"i32":"i64"));let _=o._OrtCreateTensor(Et(l),g,m,x,d.length,yi(h));_===0&&Z(`Can't create tensor for input/output. session=${i}, index=${n}.`),t.push(_)}finally{o.stackRestore($)}},ks=async(e,t,r,i,a,n,s=[])=>{var Ce,De,pe,be;let o=ne(),u=o.PTR_SIZE,l=zr.get(e);if(!l)throw new Error(`cannot run inference. invalid session id: ${e}`);let d=l[0],c=l[1],h=l[2],g=l[3],m=l[4],$=l[5],x=[];if(s.length>0){if(g)throw new Error("LoRA adapters are not supported for a session that uses IO binding, e.g. when an output is preferred to be on GPU, or when the WebNN execution provider produces an output.");for(let Me of s){let le=Ba.get(Me);if(le===void 0)throw new Error(`cannot run inference. invalid LoRA adapter id: ${Me}`);x.push(le)}}let _=t.length,y=i.length,S=0,T=[],E=[],z=[],C=[],M=[],U=o.stackSave(),V=o.stackAlloc(_*u),ae=o.stackAlloc(_*u),K=o.stackAlloc(y*u),Y=o.stackAlloc(y*u);try{for(let P of s)hi.set(P,(hi.get(P)??0)+1);[S,T]=oa(n,x),ze("wasm prepareInputOutputTensor");for(let P=0;P<_;P++)await Es(r[P],E,C,e,c[t[P]],t[P],m);for(let P=0;P<y;P++)await Es(a[P],z,C,e,h[i[P]],_+i[P],m);rt("wasm prepareInputOutputTensor");for(let P=0;P<_;P++)o.setValue(V+P*u,E[P],"*"),o.setValue(ae+P*u,c[t[P]],"*");for(let P=0;P<y;P++)o.setValue(K+P*u,z[P],"*"),o.setValue(Y+P*u,h[i[P]],"*");if(g&&!$){let{handle:P,outputPreferredLocations:te,outputPreferredLocationsEncoded:oe}=g;if(c.length!==_)throw new Error(`input count from feeds (${_}) is expected to be always equal to model's input count (${c.length}).`);ze("wasm bindInputsOutputs");for(let F=0;F<_;F++){let Ze=t[F];await o._OrtBindInput(P,c[Ze],E[F])!==0&&Z(`Can't bind input[${F}] for session=${e}.`)}for(let F=0;F<y;F++){let Ze=i[F];(Ce=a[F])!=null&&Ce[3]?(M.push(z[F]),o._OrtBindOutput(P,h[Ze],z[F],0)!==0&&Z(`Can't bind pre-allocated output[${F}] for session=${e}.`)):o._OrtBindOutput(P,h[Ze],0,oe[Ze])!==0&&Z(`Can't bind output[${F}] to ${te[F]} for session=${e}.`)}rt("wasm bindInputsOutputs"),zr.set(e,[d,c,h,g,m,!0])}(De=o.jsepOnRunStart)==null||De.call(o,d),(pe=o.webnnOnRunStart)==null||pe.call(o,d);let Me;g?Me=await o._OrtRunWithBinding(d,g.handle,y,K,S):Me=await o._OrtRun(d,ae,V,_,Y,y,K,S),Me!==0&&Z("failed to call OrtRun().");let le=[],Je=[];ze("wasm ProcessOutputTensor");for(let P=0;P<y;P++){let te=Number(o.getValue(K+P*u,"*"));if(te===z[P]||M.includes(z[P])){le.push(a[P]),te!==z[P]&&o._OrtReleaseTensor(te)!==0&&Z("Can't release tensor.");continue}let oe=o.stackSave(),F=o.stackAlloc(4*u),Ze=!1,tt,Qe=0;try{o._OrtGetTensorData(te,F,F+u,F+2*u,F+3*u)!==0&&Z(`Can't access output tensor data on index ${P}.`);let qt=u===4?"i32":"i64",At=Number(o.getValue(F,qt));Qe=o.getValue(F+u,"*");let xc=o.getValue(F+u*2,"*"),Gh=Number(o.getValue(F+u*3,qt)),Cr=[];for(let bt=0;bt<Gh;bt++)Cr.push(Number(o.getValue(xc+bt*u,qt)));o._OrtFree(xc)!==0&&Z("Can't free memory for tensor dims.");let Ar=Cr.reduce((bt,dt)=>bt*dt,1);tt=kt(At);let Pa=g==null?void 0:g.outputPreferredLocations[i[P]];if(tt==="string"){if(Pa==="gpu-buffer"||Pa==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let bt=[];for(let dt=0;dt<Ar;dt++){let yr=o.getValue(Qe+dt*u,"*"),Wh=o.getValue(Qe+(dt+1)*u,"*"),jh=dt===Ar-1?void 0:Wh-yr;bt.push(o.UTF8ToString(yr,jh))}le.push([tt,Cr,bt,"cpu"])}else if(Pa==="gpu-buffer"&&Ar>0){let bt=o.jsepGetBuffer;if(!bt)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let dt=bt(Qe),yr=It(At,Ar);if(yr===void 0||!Xr(tt))throw new Error(`Unsupported data type: ${tt}`);Ze=!0,le.push([tt,Cr,{gpuBuffer:dt,download:o.jsepCreateDownloader(dt,yr,tt),dispose:()=>{o._OrtReleaseTensor(te)!==0&&Z("Can't release tensor.")}},"gpu-buffer"])}else if(Pa==="ml-tensor"&&Ar>0){let bt=o.webnnEnsureTensor,dt=o.webnnIsGraphInputOutputTypeSupported;if(!bt||!dt)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(It(At,Ar)===void 0||!Yr(tt))throw new Error(`Unsupported data type: ${tt}`);if(!dt(e,tt,!1))throw new Error(`preferredLocation "ml-tensor" for ${tt} output is not supported by current WebNN Context.`);let yr=await bt(e,Qe,At,Cr,!1);Ze=!0,le.push([tt,Cr,{mlTensor:yr,download:o.webnnCreateMLTensorDownloader(Qe,tt),dispose:()=>{o.webnnReleaseTensorId(Qe),o._OrtReleaseTensor(te)}},"ml-tensor"])}else if(Pa==="ml-tensor-cpu-output"&&Ar>0){let bt=o.webnnCreateMLTensorDownloader(Qe,tt)(),dt=le.length;Ze=!0,Je.push((async()=>{let yr=[dt,await bt];return o.webnnReleaseTensorId(Qe),o._OrtReleaseTensor(te),yr})()),le.push([tt,Cr,[],"cpu"])}else{let bt=Zr(tt),dt=new bt(Ar);new Uint8Array(dt.buffer,dt.byteOffset,dt.byteLength).set(o.HEAPU8.subarray(Qe,Qe+dt.byteLength)),le.push([tt,Cr,dt,"cpu"])}}finally{o.stackRestore(oe),tt==="string"&&Qe&&o._free(Qe),Ze||o._OrtReleaseTensor(te)}}g&&!m&&(o._OrtClearBoundOutputs(g.handle)!==0&&Z("Can't clear bound outputs."),zr.set(e,[d,c,h,g,m,!1]));for(let[P,te]of await Promise.all(Je))le[P][2]=te;return rt("wasm ProcessOutputTensor"),le}finally{(be=o.webnnOnRunEnd)==null||be.call(o,d),o.stackRestore(U),E.forEach(Me=>o._OrtReleaseTensor(Me)),z.forEach(Me=>o._OrtReleaseTensor(Me)),C.forEach(Me=>o._free(Me)),S!==0&&o._OrtReleaseRunOptions(S),T.forEach(Me=>o._free(Me));for(let Me of s){let le=hi.get(Me)-1;le===0?hi.delete(Me):hi.set(Me,le)}}},Is=e=>{let t=ne(),r=zr.get(e);if(!r)throw new Error("invalid session id");let i=r[0],a=t._OrtEndProfiling(i);a===0&&Z("Can't get an profile file name."),t._OrtFree(a)},zs=e=>{let t=[];for(let r of e){let i=r[2];!Array.isArray(i)&&"buffer"in i&&t.push(i.buffer)}return t}}),ir,Ct,Bi,Ma,Da,dn,Cs,pn,fi,mi,sc,oc,uc,lc,dc,pc,cc,hc,fc,mc,As=k(()=>{"use strict";st(),nc(),Tt(),Gr(),Jr(),ir=()=>!!ee.wasm.proxy&&typeof document<"u",Bi=!1,Ma=!1,Da=!1,pn=new Map,fi=(e,t)=>{let r=pn.get(e);r?r.push(t):pn.set(e,[t])},mi=()=>{if(Bi||!Ma||Da||!Ct)throw new Error("worker not ready")},sc=e=>{switch(e.data.type){case"init-wasm":Bi=!1,e.data.err?(Da=!0,Cs[1](e.data.err)):(Ma=!0,Cs[0]()),dn&&(URL.revokeObjectURL(dn),dn=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=pn.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}default:}},oc=async()=>{if(!Ma){if(Bi)throw new Error("multiple calls to 'initWasm()' detected.");if(Da)throw new Error("previous call to 'initWasm()' failed.");if(Bi=!0,ir())return new Promise((e,t)=>{Ct==null||Ct.terminate(),ra().then(([r,i])=>{try{Ct=i,Ct.onerror=n=>t(n),Ct.onmessage=sc,Cs=[e,t];let a={type:"init-wasm",in:ee};if(!a.in.wasm.wasmPaths&&r){let n=Nr();n&&(a.in.wasm.wasmPaths=n)}Ct.postMessage(a),dn=r}catch(a){t(a)}},t)});try{await Hr(ee.wasm),await $s(ee),Ma=!0}catch(e){throw Da=!0,e}finally{Bi=!1}}},uc=async e=>{if(ir())return mi(),new Promise((t,r)=>{fi("init-ep",[t,r]);let i={type:"init-ep",in:{epName:e,env:ee}};Ct.postMessage(i)});await vs(ee,e)},lc=async e=>ir()?(mi(),new Promise((t,r)=>{fi("copy-from",[t,r]);let i={type:"copy-from",in:{buffer:e}};Ct.postMessage(i,[e.buffer])})):ln(e),dc=async(e,t)=>{if(ir()){if(t!=null&&t.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return mi(),new Promise((r,i)=>{fi("create",[r,i]);let a={type:"create",in:{model:e,options:{...t}}},n=[];e instanceof Uint8Array&&n.push(e.buffer),Ct.postMessage(a,n)})}else return Ss(e,t)},pc=async e=>{if(ir())return mi(),new Promise((t,r)=>{fi("release",[t,r]);let i={type:"release",in:e};Ct.postMessage(i)});Ts(e)},cc=async e=>{if(ir())throw new Error("LoRA adapter is not supported for proxy.");let t=typeof e=="string"?await dr(e):e;return ic(t)},hc=async e=>{if(ir())throw new Error("LoRA adapter is not supported for proxy.");ac(e)},fc=async(e,t,r,i,a,n,s)=>{if(ir()){if(s.length>0)throw new Error("LoRA adapter is not supported for proxy.");if(r.some(o=>o[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(a.some(o=>o))throw new Error("pre-allocated output tensor is not supported for proxy.");return mi(),new Promise((o,u)=>{fi("run",[o,u]);let l=r,d={type:"run",in:{sessionId:e,inputIndices:t,inputs:l,outputIndices:i,options:n}};Ct.postMessage(d,zs(l))})}else return ks(e,t,r,i,a,n,s)},mc=async e=>{if(ir())return mi(),new Promise((t,r)=>{fi("end-profiling",[t,r]);let i={type:"end-profiling",in:e};Ct.postMessage(i)});Is(e)}}),Os,gc=k(()=>{"use strict";st(),As(),Os=class{async loadAdapter(e){Xe(),this.adapterId=await cc(e),He()}async dispose(){return hc(this.adapterId)}}}),Rs,yc,wc,Lh=k(()=>{"use strict";st(),gc(),As(),se(),Pr(),Jr(),Rs=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},yc=e=>{switch(e[3]){case"cpu":return new it(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!Xr(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:i,dispose:a}=e[2];return it.fromGpuBuffer(r,{dataType:t,dims:e[1],download:i,dispose:a})}case"ml-tensor":{let t=e[0];if(!Yr(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:r,download:i,dispose:a}=e[2];return it.fromMLTensor(r,{dataType:t,dims:e[1],download:i,dispose:a})}default:throw new Error(`invalid data location: ${e[3]}`)}},wc=class{async fetchModelAndCopyToWasmMemory(e){return lc(await dr(e))}async loadModel(e,t){Xe();let r;typeof e=="string"?r=await this.fetchModelAndCopyToWasmMemory(e):r=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await dc(r,t),He()}async dispose(){return pc(this.sessionId)}async run(e,t,r,i=[]){Xe();let a=i.map(g=>{if(!(g instanceof Os))throw new Error("LoRA adapter was not created by the WebAssembly backend.");return g.adapterId}),n=[],s=[];Object.entries(e).forEach(g=>{let m=g[0],$=g[1],x=this.inputNames.indexOf(m);if(x===-1)throw new Error(`invalid input '${m}'`);n.push($),s.push(x)});let o=[],u=[];Object.entries(t).forEach(g=>{let m=g[0],$=g[1],x=this.outputNames.indexOf(m);if(x===-1)throw new Error(`invalid output '${m}'`);o.push($),u.push(x)});let l=n.map((g,m)=>Rs(g,()=>`input "${this.inputNames[s[m]]}"`)),d=o.map((g,m)=>g?Rs(g,()=>`output "${this.outputNames[u[m]]}"`):null),c=await fc(this.sessionId,s,l,u,d,r,a),h={};for(let g=0;g<c.length;g++)h[this.outputNames[u[g]]]=o[g]??yc(c[g]);return He(),h}startProfiling(){}endProfiling(){mc(this.sessionId)}}}),_c,Nh=k(()=>{"use strict";_c=e=>{if(e!=null&&e.epContextDataRead)throw new Error('session option "epContextDataRead" is not supported by ONNX Runtime Web')}}),bc={};Q(bc,{OnnxruntimeWebAssemblyBackend:()=>Ms,initializeFlags:()=>Bs,wasmBackend:()=>$c});var Bs,Ms,$c,qh=k(()=>{"use strict";st(),gc(),As(),Lh(),Nh(),Bs=()=>{(typeof ee.wasm.initTimeout!="number"||ee.wasm.initTimeout<0)&&(ee.wasm.initTimeout=0);let e=ee.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),ee.wasm.simd=!1),typeof ee.wasm.proxy!="boolean"&&(ee.wasm.proxy=!1),typeof ee.wasm.trace!="boolean"&&(ee.wasm.trace=!1),typeof ee.wasm.numThreads!="number"||!Number.isInteger(ee.wasm.numThreads)||ee.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)ee.wasm.numThreads=1;else{let t=typeof navigator>"u"?j("node:os").cpus().length:navigator.hardwareConcurrency;ee.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},Ms=class{async init(e){Bs(),await oc(),await uc(e)}async createInferenceSessionHandler(e,t){_c(t);let r=new wc;return await r.loadModel(e,t),r}async createLoraAdapterHandler(e){let t=new Os;return await t.loadAdapter(e),t}},$c=new Ms}),vc={};Q(vc,{InferenceSession:()=>Mr,LoraAdapter:()=>Dr,TRACE:()=>mt,TRACE_EVENT_BEGIN:()=>ze,TRACE_EVENT_END:()=>rt,TRACE_FUNC_BEGIN:()=>Xe,TRACE_FUNC_END:()=>He,Tensor:()=>it,default:()=>Vh,env:()=>ee,registerBackend:()=>H}),st(),st(),st();var Fh="1.31.1",Vh=Ki;{let e=(qh(),Se(bc)).wasmBackend;H("webgpu",e,5),H("webnn",e,5),H("cpu",e,10),H("wasm",e,10)}return Object.defineProperty(ee.versions,"web",{value:Fh,enumerable:!0}),Se(vc)})();/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 *//**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 *//**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */W.exports=Ae}(Ps)),Ps.exports}var gi={},Us={},Cc;function Zh(){return Cc||(Cc=1,Object.defineProperty(Us,"__esModule",{value:!0})),Us}var Fa={},Ac;function Qh(){if(Ac)return Fa;Ac=1;var W;Object.defineProperty(Fa,"__esModule",{value:!0}),Fa.SileroLegacy=void 0;const $e=Wa();class Ae{constructor(Ee,me,ue,j,k){this.ortInstance=Ee,this._session=me,this._h=ue,this._c=j,this._sr=k,this.reset_state=()=>{const Q=Array(128).fill(0);this._h=new this.ortInstance.Tensor("float32",Q,[2,1,64]),this._c=new this.ortInstance.Tensor("float32",Q,[2,1,64])},this.process=async Q=>{var H;const Se={input:new this.ortInstance.Tensor("float32",Q,[1,Q.length]),h:this._h,c:this._c,sr:this._sr},ce=await this._session.run(Se);this._h=ce.hn,this._c=ce.cn;const[ie]=(H=ce.output)==null?void 0:H.data;return{notSpeech:1-ie,isSpeech:ie}},this.release=async()=>{await this._session.release(),this._h.dispose(),this._c.dispose(),this._sr.dispose()}}}return Fa.SileroLegacy=Ae,W=Ae,Ae.new=async(ve,Ee)=>{$e.log.debug("initializing vad");const me=await Ee(),ue=await ve.InferenceSession.create(me),j=new ve.Tensor("int64",[16000n]),k=Array(2*64).fill(0),Q=new ve.Tensor("float32",k,[2,1,64]),_e=new ve.Tensor("float32",k,[2,1,64]);return $e.log.debug("vad is initialized"),new W(ve,ue,Q,_e,j)},Fa}var Va={},Oc;function Xh(){if(Oc)return Va;Oc=1;var W;Object.defineProperty(Va,"__esModule",{value:!0}),Va.Silero=void 0;const $e=Wa(),Ae=64;function ve(me){const ue=Array(256).fill(0);return new me.Tensor("float32",ue,[2,1,128])}class Ee{constructor(ue,j,k,Q){this._session=ue,this._state=j,this._sr=k,this.ortInstance=Q,this._context=new Float32Array(Ae),this.reset_state=()=>{this._state=ve(this.ortInstance),this._context=new Float32Array(Ae)},this.process=async _e=>{var We;const Se=new Float32Array(Ae+_e.length);Se.set(this._context,0),Se.set(_e,Ae),this._context=_e.slice(-Ae);const ie={input:new this.ortInstance.Tensor("float32",Se,[1,Se.length]),state:this._state,sr:this._sr},J=await this._session.run(ie);if(!J.stateN)throw new Error("No state from model");if(this._state=J.stateN,!((We=J.output)!=null&&We.data))throw new Error("No output from model");const H=J.output.data[0];if(typeof H!="number")throw new Error("Weird output data");return{notSpeech:1-H,isSpeech:H}},this.release=async()=>{await this._session.release(),this._state.dispose(),this._sr.dispose()}}}return Va.Silero=Ee,W=Ee,Ee.new=async(me,ue)=>{$e.log.debug("Loading VAD...");const j=await ue(),k=await me.InferenceSession.create(j),Q=new me.Tensor("int64",[16000n]),_e=ve(me);return $e.log.debug("...finished loading VAD"),new W(k,_e,Q,me)},Va}var Rc;function Gc(){return Rc||(Rc=1,function(W){var $e=gi&&gi.__createBinding||(Object.create?function(me,ue,j,k){k===void 0&&(k=j);var Q=Object.getOwnPropertyDescriptor(ue,j);(!Q||("get"in Q?!ue.__esModule:Q.writable||Q.configurable))&&(Q={enumerable:!0,get:function(){return ue[j]}}),Object.defineProperty(me,k,Q)}:function(me,ue,j,k){k===void 0&&(k=j),me[k]=ue[j]}),Ae=gi&&gi.__exportStar||function(me,ue){for(var j in me)j!=="default"&&!Object.prototype.hasOwnProperty.call(ue,j)&&$e(ue,me,j)};Object.defineProperty(W,"__esModule",{value:!0}),W.Silero=W.SileroLegacy=void 0,Ae(Zh(),W);var ve=Qh();Object.defineProperty(W,"SileroLegacy",{enumerable:!0,get:function(){return ve.SileroLegacy}});var Ee=Xh();Object.defineProperty(W,"Silero",{enumerable:!0,get:function(){return Ee.Silero}})}(gi)),gi}var Ga={},Bc;function Wc(){if(Bc)return Ga;Bc=1,Object.defineProperty(Ga,"__esModule",{value:!0}),Ga.Resampler=void 0;const W=Wa();class $e{constructor(ve){this.options=ve,this.process=Ee=>{const me=[];for(const ue of Ee)for(this.inputBuffer.push(ue);this.hasEnoughDataForFrame();){const j=this.generateOutputFrame();me.push(j)}return me},ve.nativeSampleRate<16e3&&W.log.error("nativeSampleRate is too low. Should have 16000 = targetSampleRate <= nativeSampleRate"),this.inputBuffer=[]}async*stream(ve){for(const Ee of ve)for(this.inputBuffer.push(Ee);this.hasEnoughDataForFrame();)yield this.generateOutputFrame()}hasEnoughDataForFrame(){return this.inputBuffer.length*this.options.targetSampleRate/this.options.nativeSampleRate>=this.options.targetFrameSize}generateOutputFrame(){const ve=new Float32Array(this.options.targetFrameSize);let Ee=0,me=0;for(;Ee<this.options.targetFrameSize;){let ue=0,j=0;for(;me<Math.min(this.inputBuffer.length,(Ee+1)*this.options.nativeSampleRate/this.options.targetSampleRate);){const k=this.inputBuffer[me];k!==void 0&&(ue+=k,j++),me++}ve[Ee]=ue/j,Ee++}return this.inputBuffer=this.inputBuffer.slice(me),ve}}return Ga.Resampler=$e,Ga}var Mc;function Yh(){return Mc||(Mc=1,function(W){var $e=_r&&_r.__createBinding||(Object.create?function(ce,ie,J,H){H===void 0&&(H=J);var Oe=Object.getOwnPropertyDescriptor(ie,J);(!Oe||("get"in Oe?!ie.__esModule:Oe.writable||Oe.configurable))&&(Oe={enumerable:!0,get:function(){return ie[J]}}),Object.defineProperty(ce,H,Oe)}:function(ce,ie,J,H){H===void 0&&(H=J),ce[H]=ie[J]}),Ae=_r&&_r.__setModuleDefault||(Object.create?function(ce,ie){Object.defineProperty(ce,"default",{enumerable:!0,value:ie})}:function(ce,ie){ce.default=ie}),ve=_r&&_r.__importStar||function(ce){if(ce&&ce.__esModule)return ce;var ie={};if(ce!=null)for(var J in ce)J!=="default"&&Object.prototype.hasOwnProperty.call(ce,J)&&$e(ie,ce,J);return Ae(ie,ce),ie};Object.defineProperty(W,"__esModule",{value:!0}),W.NonRealTimeVAD=W.defaultNonRealTimeVADOptions=void 0;const Ee=ve(Kh()),me=Nc(),ue=Ns(),j=qs(),k=hn(),Q=Gc(),_e=Wc();W.defaultNonRealTimeVADOptions={...j.defaultFrameProcessorOptions,modelURL:me.baseAssetPath+"silero_vad_legacy.onnx",modelFetcher:ue.defaultModelFetcher};class Se{static async new(ie={}){const J={...W.defaultNonRealTimeVADOptions,...ie};(0,j.validateOptions)(J),J.ortConfig!==void 0&&J.ortConfig(Ee);const H=()=>J.modelFetcher(J.modelURL),Oe=await Q.SileroLegacy.new(Ee,H),We=new j.FrameProcessor(Oe.process,Oe.reset_state,{positiveSpeechThreshold:J.positiveSpeechThreshold,negativeSpeechThreshold:J.negativeSpeechThreshold,redemptionMs:J.redemptionMs,preSpeechPadMs:J.preSpeechPadMs,minSpeechMs:J.minSpeechMs,submitUserSpeechOnPause:J.submitUserSpeechOnPause},1536/16);return We.resume(),new this(H,Ee,J,We)}constructor(ie,J,H,Oe){this.modelFetcher=ie,this.ort=J,this.options=H,this.frameProcessor=Oe,this.frameSamples=1536}async*run(ie,J){const H={nativeSampleRate:J,targetSampleRate:16e3,targetFrameSize:this.frameSamples},Oe=new _e.Resampler(H);let We=0,xe=0,ge=0;for await(const Le of Oe.stream(ie)){const pt=[];await this.frameProcessor.process(Le,je=>{pt.push(je)});for(const je of pt)switch(je.msg){case k.Message.SpeechStart:We=ge*this.frameSamples/16;break;case k.Message.SpeechEnd:xe=(ge+1)*this.frameSamples/16,yield{audio:je.audio,start:We,end:xe};break}ge++}const ye=[];this.frameProcessor.endSegment(Le=>{ye.push(Le)});for(const Le of ye)switch(Le.msg){case k.Message.SpeechEnd:yield{audio:Le.audio,start:We,end:ge*this.frameSamples/16}}}}W.NonRealTimeVAD=Se}(_r)),_r}var Xt={},Dc;function Jh(){if(Dc)return Xt;Dc=1,Object.defineProperty(Xt,"__esModule",{value:!0}),Xt.audioFileToArray=Xt.encodeWAV=Xt.arrayBufferToBase64=Xt.minFramesForTargetMS=void 0;function W(j,k,Q=16e3){return Math.ceil(j*Q/1e3/k)}Xt.minFramesForTargetMS=W;function $e(j){const k=new Uint8Array(j),Q=k.byteLength,_e=new Array(Q);for(let Se=0;Se<Q;Se++){const ce=k[Se];if(ce===void 0)break;_e[Se]=String.fromCharCode(ce)}return btoa(_e.join(""))}Xt.arrayBufferToBase64=$e;function Ae(j,k=3,Q=16e3,_e=1,Se=32){const ce=Se/8,ie=_e*ce,J=new ArrayBuffer(44+j.length*ce),H=new DataView(J);return me(H,0,"RIFF"),H.setUint32(4,36+j.length*ce,!0),me(H,8,"WAVE"),me(H,12,"fmt "),H.setUint32(16,16,!0),H.setUint16(20,k,!0),H.setUint16(22,_e,!0),H.setUint32(24,Q,!0),H.setUint32(28,Q*ie,!0),H.setUint16(32,ie,!0),H.setUint16(34,Se,!0),me(H,36,"data"),H.setUint32(40,j.length*ce,!0),k===1?Ee(H,44,j):ve(H,44,j),J}Xt.encodeWAV=Ae;function ve(j,k,Q){for(let _e=0;_e<Q.length;_e++,k+=4)j.setFloat32(k,Q[_e],!0)}function Ee(j,k,Q){for(let _e=0;_e<Q.length;_e++,k+=2){const Se=Math.max(-1,Math.min(1,Q[_e]));j.setInt16(k,Se<0?Se*32768:Se*32767,!0)}}function me(j,k,Q){for(let _e=0;_e<Q.length;_e++)j.setUint8(k+_e,Q.charCodeAt(_e))}async function ue(j){const k=new OfflineAudioContext(1,1,44100),Q=new FileReader;let _e=null;if(await new Promise(ie=>{Q.addEventListener("loadend",()=>{const J=Q.result;k.decodeAudioData(J,H=>{_e=H,k.startRendering().then(()=>{console.log("Rendering completed successfully"),ie()}).catch(Oe=>{console.error("Rendering failed: ",Oe)})},H=>{console.log("Error with decoding audio data: ",H)})}),Q.readAsArrayBuffer(j)}),_e===null)throw Error("some shit");const Se=_e,ce=new Float32Array(Se.length);for(let ie=0;ie<Se.length;ie++)for(let J=0;J<Se.numberOfChannels;J++){const H=Se.getChannelData(J)[ie],Oe=ce[ie];if(H===void 0||Oe===void 0)throw new Error("sample or out[i] is undefined");ce[ie]=Oe+H}return{audio:ce,sampleRate:Se.sampleRate}}return Xt.audioFileToArray=ue,Xt}var br={},Ls={exports:{}};/*!
 * ONNX Runtime Web v1.31.1
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */var Pc;function ef(){return Pc||(Pc=1,function(W,$e){var Ae=(()=>{var ve=Object.defineProperty,Ee=Object.getOwnPropertyDescriptor,me=Object.getOwnPropertyNames,ue=Object.prototype.hasOwnProperty,j=(p=>typeof Ft<"u"?Ft:typeof Proxy<"u"?new Proxy(p,{get:(f,v)=>(typeof Ft<"u"?Ft:f)[v]}):p)(function(p){if(typeof Ft<"u")return Ft.apply(this,arguments);throw Error('Dynamic require of "'+p+'" is not supported')}),k=(p,f,v)=>()=>{if(v)throw v[0];try{return p&&(f=p(p=0)),f}catch(w){throw v=[w],w}},Q=(p,f)=>{for(var v in f)ve(p,v,{get:f[v],enumerable:!0})},_e=(p,f,v,w)=>{if(f&&typeof f=="object"||typeof f=="function")for(let b of me(f))!ue.call(p,b)&&b!==v&&ve(p,b,{get:()=>f[b],enumerable:!(w=Ee(f,b))||w.enumerable});return p},Se=p=>_e(ve({},"__esModule",{value:!0}),p),ce,ie,J,H,Oe,We,xe,ge=k(()=>{"use strict";ce=new Map,ie=[],J=new WeakMap,H=(p,f,v)=>{if(f&&typeof f.init=="function"&&typeof f.createInferenceSessionHandler=="function"){let w=ce.get(p);if(w===void 0)ce.set(p,{backend:f,priority:v});else{if(w.priority>v)return;if(w.priority===v&&w.backend!==f)throw new Error(`cannot register backend "${p}" using priority ${v}`)}if(v>=0){let b=ie.indexOf(p);b!==-1&&ie.splice(b,1);for(let A=0;A<ie.length;A++)if(ce.get(ie[A]).priority<=v){ie.splice(A,0,p);return}ie.push(p)}return}throw new TypeError("not a valid backend")},Oe=async p=>{let f=ce.get(p);if(!f)return"backend not found.";if(f.initialized)return f.backend;if(f.aborted)return f.error;{let v=!!f.initPromise;try{if(!v){let w=f.backend,b=J.get(w);f.initPromise=b?b.then(async()=>w.init(p),async()=>w.init(p)):w.init(p),J.set(w,f.initPromise)}return await f.initPromise,f.initialized=!0,f.backend}catch(w){return v||(f.error=`${w}`,f.aborted=!0),f.error}finally{delete f.initPromise}}},We=async p=>{let f=p.executionProviders||[],v=f.map(O=>typeof O=="string"?O:O.name),w=v.length===0?ie:v,b,A=[],D=new Set;for(let O of w){let R=await Oe(O);typeof R=="string"?A.push({name:O,err:R}):(b||(b=R),b===R&&D.add(O))}if(!b)throw new Error(`no available backend found. ERR: ${A.map(O=>`[${O.name}] ${O.err}`).join(", ")}`);for(let{name:O,err:R}of A)v.includes(O)&&console.warn(`removing requested execution provider "${O}" from session options because it is not available: ${R}`);let I=f.filter(O=>D.has(typeof O=="string"?O:O.name));return[b,new Proxy(p,{get:(O,R)=>R==="executionProviders"?I:Reflect.get(O,R)})]},xe=async()=>{let p=[];for(let v of ie){if(typeof ce.get(v).backend.createLoraAdapterHandler!="function")continue;let w=await Oe(v);if(typeof w!="string")return w;p.push({name:v,err:w})}let f=p.length===0?"":` ERR: ${p.map(v=>`[${v.name}] ${v.err}`).join(", ")}`;throw new Error(`no available backend supports LoRA adapters.${f}`)}}),ye=k(()=>{"use strict";ge()}),Le,pt=k(()=>{"use strict";Le="1.31.1"}),je,we,ut=k(()=>{"use strict";pt(),je="warning",we={wasm:{},webgl:{},webgpu:{},versions:{common:Le},set logLevel(p){if(p!==void 0){if(typeof p!="string"||["verbose","info","warning","error","fatal"].indexOf(p)===-1)throw new Error(`Unsupported logging level: ${p}`);je=p}},get logLevel(){return je}},Object.defineProperty(we,"logLevel",{enumerable:!0})}),ee,ar=k(()=>{"use strict";ut(),ee=we}),mt,Vt,Xe,He,ze,rt,nr=k(()=>{"use strict";ut(),mt=(p,f)=>{(typeof we.trace>"u"?!we.wasm.trace:!we.trace)||console.timeStamp(`${p}::ORT::${f}`)},Vt=(p,f)=>{var b;let v=((b=new Error().stack)==null?void 0:b.split(/\r\n|\r|\n/g))||[],w=!1;for(let A=0;A<v.length;A++){if(w&&!v[A].includes("TRACE_FUNC")){let D=`FUNC_${p}::${v[A].trim().split(" ")[1]}`;f&&(D+=`::${f}`),mt("CPU",D);return}v[A].includes("TRACE_FUNC")&&(w=!0)}},Xe=p=>{(typeof we.trace>"u"?!we.wasm.trace:!we.trace)||Vt("BEGIN",p)},He=p=>{(typeof we.trace>"u"?!we.wasm.trace:!we.trace)||Vt("END",p)},ze=p=>{(typeof we.trace>"u"?!we.wasm.trace:!we.trace)||console.time(`ORT::${p}`)},rt=p=>{(typeof we.trace>"u"?!we.wasm.trace:!we.trace)||console.timeEnd(`ORT::${p}`)}}),Yt,Mi=k(()=>{"use strict";ge(),nr(),Yt=class jc{constructor(f,v){this.backend=f,this.handler=v}static async create(f){if(Xe(),typeof f!="string"&&!(f instanceof Uint8Array))throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let v=await xe(),w=await v.createLoraAdapterHandler(f);return He(),new jc(v,w)}async release(){return this.handler.dispose()}}}),Di,Pi,fn=k(()=>{"use strict";Di=(p,f)=>{let v=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);v.width=p.dims[3],v.height=p.dims[2];let w=v.getContext("2d");if(w!=null){let b,A;(f==null?void 0:f.tensorLayout)!==void 0&&f.tensorLayout==="NHWC"?(b=p.dims[2],A=p.dims[3]):(b=p.dims[3],A=p.dims[2]);let D=(f==null?void 0:f.format)!==void 0?f.format:"RGB",I=f==null?void 0:f.norm,O,R;I===void 0||I.mean===void 0?O=[255,255,255,255]:typeof I.mean=="number"?O=[I.mean,I.mean,I.mean,I.mean]:(O=[I.mean[0],I.mean[1],I.mean[2],0],I.mean[3]!==void 0&&(O[3]=I.mean[3])),I===void 0||I.bias===void 0?R=[0,0,0,0]:typeof I.bias=="number"?R=[I.bias,I.bias,I.bias,I.bias]:(R=[I.bias[0],I.bias[1],I.bias[2],0],I.bias[3]!==void 0&&(R[3]=I.bias[3]));let L=A*b,N=0,q=L,G=L*2,re=-1;D==="RGBA"?(N=0,q=L,G=L*2,re=L*3):D==="RGB"?(N=0,q=L,G=L*2):D==="RBG"&&(N=0,G=L,q=L*2);for(let Ne=0;Ne<A;Ne++)for(let Ie=0;Ie<b;Ie++){let fe=(p.data[N++]-R[0])*O[0],de=(p.data[q++]-R[1])*O[1],Ue=(p.data[G++]-R[2])*O[2],ct=re===-1?255:(p.data[re++]-R[3])*O[3];w.fillStyle="rgba("+fe+","+de+","+Ue+","+ct+")",w.fillRect(Ie,Ne,1,1)}if("toDataURL"in v)return v.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},Pi=(p,f)=>{let v=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),w;if(v!=null){let b,A,D;(f==null?void 0:f.tensorLayout)!==void 0&&f.tensorLayout==="NHWC"?(b=p.dims[2],A=p.dims[1],D=p.dims[3]):(b=p.dims[3],A=p.dims[2],D=p.dims[1]);let I=f!==void 0&&f.format!==void 0?f.format:"RGB",O=f==null?void 0:f.norm,R,L;O===void 0||O.mean===void 0?R=[255,255,255,255]:typeof O.mean=="number"?R=[O.mean,O.mean,O.mean,O.mean]:(R=[O.mean[0],O.mean[1],O.mean[2],255],O.mean[3]!==void 0&&(R[3]=O.mean[3])),O===void 0||O.bias===void 0?L=[0,0,0,0]:typeof O.bias=="number"?L=[O.bias,O.bias,O.bias,O.bias]:(L=[O.bias[0],O.bias[1],O.bias[2],0],O.bias[3]!==void 0&&(L[3]=O.bias[3]));let N=A*b;if(f!==void 0&&(f.format!==void 0&&D===4&&f.format!=="RGBA"||D===3&&f.format!=="RGB"&&f.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let q=4,G=0,re=1,Ne=2,Ie=3,fe=0,de=N,Ue=N*2,ct=-1;I==="RGBA"?(fe=0,de=N,Ue=N*2,ct=N*3):I==="RGB"?(fe=0,de=N,Ue=N*2):I==="RBG"&&(fe=0,Ue=N,de=N*2),w=v.createImageData(b,A);for(let Bt=0;Bt<A*b;G+=q,re+=q,Ne+=q,Ie+=q,Bt++)w.data[G]=(p.data[fe++]-L[0])*R[0],w.data[re]=(p.data[de++]-L[1])*R[1],w.data[Ne]=(p.data[Ue++]-L[2])*R[2],w.data[Ie]=ct===-1?255:(p.data[ct++]-L[3])*R[3]}else throw new Error("Can not access image data");return w}}),sr,Ui,Li,Ni,qi,Fi,mn=k(()=>{"use strict";Br(),sr=(p,f)=>{if(p===void 0)throw new Error("Image buffer must be defined");if(f.height===void 0||f.width===void 0)throw new Error("Image height and width must be defined");if(f.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:v,width:w}=f,b=f.norm??{mean:255,bias:0},A,D;typeof b.mean=="number"?A=[b.mean,b.mean,b.mean,b.mean]:A=[b.mean[0],b.mean[1],b.mean[2],b.mean[3]??255],typeof b.bias=="number"?D=[b.bias,b.bias,b.bias,b.bias]:D=[b.bias[0],b.bias[1],b.bias[2],b.bias[3]??0];let I=f.format!==void 0?f.format:"RGBA",O=f.tensorFormat!==void 0&&f.tensorFormat!==void 0?f.tensorFormat:"RGB",R=v*w,L=O==="RGBA"?new Float32Array(R*4):new Float32Array(R*3),N=4,q=0,G=1,re=2,Ne=3,Ie=0,fe=R,de=R*2,Ue=-1;I==="RGB"&&(N=3,q=0,G=1,re=2,Ne=-1),O==="RGBA"?Ue=R*3:O==="RBG"?(Ie=0,de=R,fe=R*2):O==="BGR"&&(de=0,fe=R,Ie=R*2);for(let ct=0;ct<R;ct++,q+=N,re+=N,G+=N,Ne+=N)L[Ie++]=(p[q]+D[0])/A[0],L[fe++]=(p[G]+D[1])/A[1],L[de++]=(p[re]+D[2])/A[2],Ue!==-1&&Ne!==-1&&(L[Ue++]=(p[Ne]+D[3])/A[3]);return O==="RGBA"?new Fe("float32",L,[1,4,v,w]):new Fe("float32",L,[1,3,v,w])},Ui=async(p,f)=>{let v=typeof HTMLImageElement<"u"&&p instanceof HTMLImageElement,w=typeof ImageData<"u"&&p instanceof ImageData,b=typeof ImageBitmap<"u"&&p instanceof ImageBitmap,A=typeof p=="string",D,I=f??{},O=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},R=L=>typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||L instanceof OffscreenCanvas?L.getContext("2d"):null;if(v){let L=O();L.width=p.width,L.height=p.height;let N=R(L);if(N!=null){let q=p.height,G=p.width;if(f!==void 0&&f.resizedHeight!==void 0&&f.resizedWidth!==void 0&&(q=f.resizedHeight,G=f.resizedWidth),f!==void 0){if(I=f,f.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");I.tensorFormat="RGBA",I.height=q,I.width=G}else I.tensorFormat="RGBA",I.height=q,I.width=G;N.drawImage(p,0,0),D=N.getImageData(0,0,G,q).data}else throw new Error("Can not access image data")}else if(w){let L,N;if(f!==void 0&&f.resizedWidth!==void 0&&f.resizedHeight!==void 0?(L=f.resizedHeight,N=f.resizedWidth):(L=p.height,N=p.width),f!==void 0&&(I=f),I.format="RGBA",I.height=L,I.width=N,f!==void 0){let q=O();q.width=N,q.height=L;let G=R(q);if(G!=null)G.putImageData(p,0,0),D=G.getImageData(0,0,N,L).data;else throw new Error("Can not access image data")}else D=p.data}else if(b){if(f===void 0)throw new Error("Please provide image config with format for Imagebitmap");let L=O();L.width=p.width,L.height=p.height;let N=R(L);if(N!=null){let q=p.height,G=p.width;return N.drawImage(p,0,0,G,q),D=N.getImageData(0,0,G,q).data,I.height=q,I.width=G,sr(D,I)}else throw new Error("Can not access image data")}else{if(A)return new Promise((L,N)=>{let q=O(),G=R(q);if(!p||!G)return N();let re=new Image;re.crossOrigin="Anonymous",re.src=p,re.onload=()=>{q.width=re.width,q.height=re.height,G.drawImage(re,0,0,q.width,q.height);let Ne=G.getImageData(0,0,q.width,q.height);I.height=q.height,I.width=q.width,L(sr(Ne.data,I))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(D!==void 0)return sr(D,I);throw new Error("Input data provided is not supported - aborted tensor creation")},Li=(p,f)=>{let{width:v,height:w,download:b,dispose:A}=f,D=[1,w,v,4];return new Fe({location:"texture",type:"float32",texture:p,dims:D,download:b,dispose:A})},Ni=(p,f)=>{let{dataType:v,dims:w,download:b,dispose:A}=f;return new Fe({location:"gpu-buffer",type:v??"float32",gpuBuffer:p,dims:w,download:b,dispose:A})},qi=(p,f)=>{let{dataType:v,dims:w,download:b,dispose:A}=f;return new Fe({location:"ml-tensor",type:v??"float32",mlTensor:p,dims:w,download:b,dispose:A})},Fi=(p,f,v)=>new Fe({location:"cpu-pinned",type:p,data:f,dims:v??[f.length]})}),vt,Gt,Rr,Vi,gn=k(()=>{"use strict";vt=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),Gt=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),Rr=!1,Vi=()=>{if(!Rr){Rr=!0;let p=typeof BigInt64Array<"u"&&BigInt64Array.from,f=typeof BigUint64Array<"u"&&BigUint64Array.from,v=globalThis.Float16Array,w=typeof v<"u"&&v.from;p&&(vt.set("int64",BigInt64Array),Gt.set(BigInt64Array,"int64")),f&&(vt.set("uint64",BigUint64Array),Gt.set(BigUint64Array,"uint64")),w?(vt.set("float16",v),Gt.set(v,"float16")):vt.set("float16",Uint16Array)}}}),Gi,Wi,yn=k(()=>{"use strict";Br(),Gi=p=>{let f=1;for(let v=0;v<p.length;v++){let w=p[v];if(typeof w!="number"||!Number.isSafeInteger(w))throw new TypeError(`dims[${v}] must be an integer, got: ${w}`);if(w<0)throw new RangeError(`dims[${v}] must be a non-negative integer, got: ${w}`);f*=w}return f},Wi=(p,f)=>{switch(p.location){case"cpu":return new Fe(p.type,p.data,f);case"cpu-pinned":return new Fe({location:"cpu-pinned",data:p.data,type:p.type,dims:f});case"texture":return new Fe({location:"texture",texture:p.texture,type:p.type,dims:f});case"gpu-buffer":return new Fe({location:"gpu-buffer",gpuBuffer:p.gpuBuffer,type:p.type,dims:f});case"ml-tensor":return new Fe({location:"ml-tensor",mlTensor:p.mlTensor,type:p.type,dims:f});default:throw new Error(`tensorReshape: tensor location ${p.location} is not supported`)}}}),Fe,Br=k(()=>{"use strict";fn(),mn(),gn(),yn(),Fe=class{constructor(p,f,v){Vi();let w,b;if(typeof p=="object"&&"location"in p)switch(this.dataLocation=p.location,w=p.type,b=p.dims,p.location){case"cpu-pinned":{let D=vt.get(w);if(!D)throw new TypeError(`unsupported type "${w}" to create tensor from pinned buffer`);if(!(p.data instanceof D))throw new TypeError(`buffer should be of type ${D.name}`);this.cpuData=p.data;break}case"texture":{if(w!=="float32")throw new TypeError(`unsupported type "${w}" to create tensor from texture`);this.gpuTextureData=p.texture,this.downloader=p.download,this.disposer=p.dispose;break}case"gpu-buffer":{if(w!=="float32"&&w!=="float16"&&w!=="int32"&&w!=="int64"&&w!=="uint32"&&w!=="uint8"&&w!=="bool"&&w!=="uint4"&&w!=="int4")throw new TypeError(`unsupported type "${w}" to create tensor from gpu buffer`);this.gpuBufferData=p.gpuBuffer,this.downloader=p.download,this.disposer=p.dispose;break}case"ml-tensor":{if(w!=="float32"&&w!=="float16"&&w!=="int32"&&w!=="int64"&&w!=="uint32"&&w!=="uint64"&&w!=="int8"&&w!=="uint8"&&w!=="bool"&&w!=="uint4"&&w!=="int4")throw new TypeError(`unsupported type "${w}" to create tensor from MLTensor`);this.mlTensorData=p.mlTensor,this.downloader=p.download,this.disposer=p.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let D,I;if(typeof p=="string")if(w=p,I=v,p==="string"){if(!Array.isArray(f))throw new TypeError("A string tensor's data must be a string array.");D=f}else{let O=vt.get(p);if(O===void 0)throw new TypeError(`Unsupported tensor type: ${p}.`);if(Array.isArray(f)){if(p==="float16"&&O===Uint16Array||p==="uint4"||p==="int4")throw new TypeError(`Creating a ${p} tensor from number array is not supported. Please use ${O.name} as data.`);p==="uint64"||p==="int64"?D=O.from(f,BigInt):D=O.from(f)}else if(f instanceof O)D=f;else if(f instanceof Uint8ClampedArray)if(p==="uint8")D=Uint8Array.from(f);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(p==="float16"&&f instanceof Uint16Array&&O!==Uint16Array)D=new globalThis.Float16Array(f.buffer,f.byteOffset,f.length);else throw new TypeError(`A ${w} tensor's data must be type of ${O}`)}else if(I=f,Array.isArray(p)){if(p.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let O=typeof p[0];if(O==="string")w="string",D=p;else if(O==="boolean")w="bool",D=Uint8Array.from(p);else throw new TypeError(`Invalid element type of data array: ${O}.`)}else if(p instanceof Uint8ClampedArray)w="uint8",D=Uint8Array.from(p);else{let O=Gt.get(p.constructor);if(O===void 0)throw new TypeError(`Unsupported type for tensor data: ${p.constructor}.`);w=O,D=p}if(I===void 0)I=[D.length];else if(!Array.isArray(I))throw new TypeError("A tensor's dims must be a number array");b=I,this.cpuData=D,this.dataLocation="cpu"}let A=Gi(b);if(this.cpuData&&A!==this.cpuData.length&&!((w==="uint4"||w==="int4")&&Math.ceil(A/2)===this.cpuData.length))throw new Error(`Tensor's size(${A}) does not match data length(${this.cpuData.length}).`);this.type=w,this.dims=b,this.size=A}static async fromImage(p,f){return Ui(p,f)}static fromTexture(p,f){return Li(p,f)}static fromGpuBuffer(p,f){return Ni(p,f)}static fromMLTensor(p,f){return qi(p,f)}static fromPinnedBuffer(p,f,v){return Fi(p,f,v)}toDataURL(p){return Di(this,p)}toImageData(p){return Pi(this,p)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(p){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let f=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=f,p&&this.disposer&&(this.disposer(),this.disposer=void 0),f}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(p){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return Wi(this,p)}}}),it,ji=k(()=>{"use strict";Br(),it=Fe}),Hi,wn=k(()=>{"use strict";ge(),Mi(),ji(),nr(),Hi=class Hc{constructor(f,v){this.handler=f,this.backend=v}async run(f,v,w){Xe(),ze("InferenceSession.run");let b={},A={};if(typeof f!="object"||f===null||f instanceof it||Array.isArray(f))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let D=!0;if(typeof v=="object"){if(v===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(v instanceof it)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(v)){if(v.length===0)throw new TypeError("'fetches' cannot be an empty array.");D=!1;for(let L of v){if(typeof L!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(L)===-1)throw new RangeError(`'fetches' contains invalid output name: ${L}.`);b[L]=null}if(typeof w=="object"&&w!==null)A=w;else if(typeof w<"u")throw new TypeError("'options' must be an object.")}else{let L=!1,N=Object.getOwnPropertyNames(v);for(let q of this.outputNames)if(N.indexOf(q)!==-1){let G=v[q];(G===null||G instanceof it)&&(L=!0,D=!1,b[q]=G)}if(L){if(typeof w=="object"&&w!==null)A=w;else if(typeof w<"u")throw new TypeError("'options' must be an object.")}else A=v}}else if(typeof v<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let L of this.inputNames)if(typeof f[L]>"u")throw new Error(`input '${L}' is missing in 'feeds'.`);if(D)for(let L of this.outputNames)b[L]=null;let I;if(A.activeLoraAdapters!==void 0){if(!Array.isArray(A.activeLoraAdapters))throw new TypeError("'activeLoraAdapters' must be an array.");I=A.activeLoraAdapters.map(L=>{if(!(L instanceof Yt))throw new TypeError("'activeLoraAdapters' must be an array of LoraAdapter objects.");if(L.backend!==this.backend)throw new Error("LoRA adapter was created by a different backend than the session.");return L.handler})}let O=await this.handler.run(f,b,A,I),R={};for(let L in O)if(Object.hasOwnProperty.call(O,L)){let N=O[L];N instanceof it?R[L]=N:R[L]=new it(N.type,N.data,N.dims)}return rt("InferenceSession.run"),He(),R}async release(){return this.handler.dispose()}static async create(f,v,w,b){Xe(),ze("InferenceSession.create");let A,D={};if(typeof f=="string"){if(A=f,typeof v=="object"&&v!==null)D=v;else if(typeof v<"u")throw new TypeError("'options' must be an object.")}else if(f instanceof Uint8Array){if(A=f,typeof v=="object"&&v!==null)D=v;else if(typeof v<"u")throw new TypeError("'options' must be an object.")}else if(f instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&f instanceof SharedArrayBuffer){let L=f,N=0,q=f.byteLength;if(typeof v=="object"&&v!==null)D=v;else if(typeof v=="number"){if(N=v,!Number.isSafeInteger(N))throw new RangeError("'byteOffset' must be an integer.");if(N<0||N>=L.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${L.byteLength}).`);if(q=f.byteLength-N,typeof w=="number"){if(q=w,!Number.isSafeInteger(q))throw new RangeError("'byteLength' must be an integer.");if(q<=0||N+q>L.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${L.byteLength-N}].`);if(typeof b=="object"&&b!==null)D=b;else if(typeof b<"u")throw new TypeError("'options' must be an object.")}else if(typeof w<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof v<"u")throw new TypeError("'options' must be an object.");A=new Uint8Array(L,N,q)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[I,O]=await We(D),R=await I.createInferenceSessionHandler(A,O);return rt("InferenceSession.create"),He(),new Hc(R,I)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),Mr,_n=k(()=>{"use strict";wn(),Mr=Hi}),Dr,bn=k(()=>{"use strict";Mi(),Dr=Yt}),$n=k(()=>{"use strict"}),vn=k(()=>{"use strict"}),xn=k(()=>{"use strict"}),Sn=k(()=>{"use strict"}),Ki={};Q(Ki,{InferenceSession:()=>Mr,LoraAdapter:()=>Dr,TRACE:()=>mt,TRACE_EVENT_BEGIN:()=>ze,TRACE_EVENT_END:()=>rt,TRACE_FUNC_BEGIN:()=>Xe,TRACE_FUNC_END:()=>He,Tensor:()=>it,env:()=>ee,registerBackend:()=>H});var st=k(()=>{"use strict";ye(),ar(),_n(),bn(),ji(),$n(),vn(),nr(),xn(),Sn()}),Pr=k(()=>{"use strict"}),Zi={};Q(Zi,{default:()=>Qi});var Ur,Lr,Qi,Tn=k(()=>{"use strict";var p;Ti(),Tt(),Gr(),Ur="ort-wasm-proxy-worker",Lr=((p=globalThis.self)==null?void 0:p.name)===Ur,Lr&&(self.onmessage=f=>{let{type:v,in:w}=f.data;try{switch(v){case"init-wasm":Hr(w.wasm).then(()=>{wi(w).then(()=>{postMessage({type:v})},b=>{postMessage({type:v,err:b})})},b=>{postMessage({type:v,err:b})});break;case"init-ep":{let{epName:b,env:A}=w;_i(A,b).then(()=>{postMessage({type:v})},D=>{postMessage({type:v,err:D})});break}case"copy-from":{let{buffer:b}=w,A=ke(b);postMessage({type:v,out:A});break}case"create":{let{model:b,options:A}=w;Ot(b,A).then(D=>{postMessage({type:v,out:D})},D=>{postMessage({type:v,err:D})});break}case"release":vi(w),postMessage({type:v});break;case"run":{let{sessionId:b,inputIndices:A,inputs:D,outputIndices:I,options:O}=w;he(b,A,D,I,new Array(I.length).fill(null),O).then(R=>{R.some(L=>L[3]!=="cpu")?postMessage({type:v,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:v,out:R},Si([...D,...R]))},R=>{postMessage({type:v,err:R})});break}case"end-profiling":ei(w),postMessage({type:v});break;default:}}catch(b){postMessage({type:v,err:b})}}),Qi=Lr?null:f=>new Worker(f??Ve,{type:"classic",name:Ur})}),Xi,Yi,Ve,Nr,or,Ji,ea,qr,ta,Fr,ra,Vr,ia,Gr=k(()=>{"use strict";Pr(),Xi=typeof location>"u"?void 0:location.origin,Yi=()=>{var p,f;return typeof document<"u"?(p=document.currentScript)==null?void 0:p.src:typeof self<"u"?(f=self.location)==null?void 0:f.href:void 0},Ve=Yi(),Nr=()=>{if(Ve&&!Ve.startsWith("blob:"))return Ve.substring(0,Ve.lastIndexOf("/")+1)},or=(p,f)=>{try{let v=f??Ve;return(v?new URL(p,v):new URL(p)).origin===Xi}catch{return!1}},Ji=(p,f)=>{let v=f??Ve;try{return(v?new URL(p,v):new URL(p)).href}catch{return}},ea=(p,f)=>`${f??"./"}${p}`,qr=async p=>{let f=await(await fetch(p,{credentials:"same-origin"})).blob();return URL.createObjectURL(f)},ta=async p=>(await import(p)).default,Fr=(Tn(),Se(Zi)).default,ra=async()=>{if(!Ve)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(or(Ve))return[void 0,Fr()];let p=await qr(Ve);return[p,Fr(p)]},Vr=void 0,ia=async(p,f,v,w)=>{let b=Vr&&!(p||f);if(b)if(Ve)b=or(Ve)||w&&!v;else if(w&&!v)b=!0;else throw new Error("cannot determine the script source URL.");if(b)return[void 0,Vr];{let A="ort-wasm-simd-threaded.mjs",D=p??Ji(A,f),I=v&&D&&!or(D,f),O=I?await qr(D):D??ea(A,f);return[I?O:void 0,await ta(O)]}}}),Wr,ur,Wt,jr,aa,na,sa,Hr,ne,Tt=k(()=>{"use strict";Gr(),ur=!1,Wt=!1,jr=!1,aa=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},na=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},sa=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},Hr=async p=>{if(ur)return Promise.resolve();if(Wt)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(jr)throw new Error("previous call to 'initializeWebAssembly()' failed.");Wt=!0;let f=p.initTimeout,v=p.numThreads;if(p.simd!==!1){if(p.simd==="relaxed"){if(!sa())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!na())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let w=aa();v>1&&!w&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+v+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),p.numThreads=v=1);let b=p.wasmPaths,A=typeof b=="string"?b:void 0,D=b==null?void 0:b.mjs,I=(D==null?void 0:D.href)??D,O=b==null?void 0:b.wasm,R=(O==null?void 0:O.href)??O,L=p.wasmBinary,[N,q]=await ia(I,A,v>1,!!L||!!R),G=!1,re=[];if(f>0&&re.push(new Promise(Ne=>{setTimeout(()=>{G=!0,Ne()},f)})),re.push(new Promise((Ne,Ie)=>{let fe={numThreads:v};if(L)fe.wasmBinary=L,fe.locateFile=de=>de;else if(R||A)fe.locateFile=de=>R??A+de;else if(I&&I.indexOf("blob:")!==0)fe.locateFile=de=>new URL(de,I).href;else if(N){let de=Nr();de&&(fe.locateFile=Ue=>de+Ue)}q(fe).then(de=>{Wt=!1,ur=!0,Wr=de,Ne(),N&&URL.revokeObjectURL(N)},de=>{Wt=!1,jr=!0,Ie(de)})})),await Promise.race(re),G)throw new Error(`WebAssembly backend initializing failed due to timeout: ${f}ms`)},ne=()=>{if(ur&&Wr)return Wr;throw new Error("WebAssembly is not initialized yet.")}}),at,lr,Z,Kr=k(()=>{"use strict";Tt(),at=(p,f)=>{let v=ne(),w=v.lengthBytesUTF8(p)+1,b=v._malloc(w);return v.stringToUTF8(p,b,w),f.push(b),b},lr=(p,f,v,w)=>{if(typeof p=="object"&&p!==null){if(v.has(p))throw new Error("Circular reference in options");v.add(p)}Object.entries(p).forEach(([b,A])=>{let D=f?f+b:b;if(typeof A=="object")lr(A,D+".",v,w);else if(typeof A=="string"||typeof A=="number")w(D,A.toString());else if(typeof A=="boolean")w(D,A?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof A}`)})},Z=p=>{let f=ne(),v=f.stackSave();try{let w=f.PTR_SIZE,b=f.stackAlloc(2*w);f._OrtGetLastError(b,b+w);let A=Number(f.getValue(b,w===4?"i32":"i64")),D=f.getValue(b+w,"*"),I=D?f.UTF8ToString(D):"";throw new Error(`${p} ERROR_CODE: ${A}, ERROR_MESSAGE: ${I}`)}finally{f.stackRestore(v)}}}),oa,En=k(()=>{"use strict";Tt(),Kr(),oa=(p,f)=>{let v=ne(),w=0,b=[],A=p||{};try{if((p==null?void 0:p.logSeverityLevel)===void 0)A.logSeverityLevel=2;else if(typeof p.logSeverityLevel!="number"||!Number.isInteger(p.logSeverityLevel)||p.logSeverityLevel<0||p.logSeverityLevel>4)throw new Error(`log severity level is not valid: ${p.logSeverityLevel}`);if((p==null?void 0:p.logVerbosityLevel)===void 0)A.logVerbosityLevel=0;else if(typeof p.logVerbosityLevel!="number"||!Number.isInteger(p.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${p.logVerbosityLevel}`);(p==null?void 0:p.terminate)===void 0&&(A.terminate=!1);let D=0;(p==null?void 0:p.tag)!==void 0&&(D=at(p.tag,b)),w=v._OrtCreateRunOptions(A.logSeverityLevel,A.logVerbosityLevel,!!A.terminate,D),w===0&&Z("Can't create run options."),(p==null?void 0:p.extra)!==void 0&&lr(p.extra,"",new WeakSet,(I,O)=>{let R=at(I,b),L=at(O,b);v._OrtAddRunConfigEntry(w,R,L)!==0&&Z(`Can't set a run config entry: ${I} - ${O}.`)});for(let I of f)v._OrtRunOptionsAddActiveLoraAdapter(w,I)!==0&&Z("Can't add an active LoRA adapter.");return[w,b]}catch(D){throw w!==0&&v._OrtReleaseRunOptions(w),b.forEach(I=>v._free(I)),D}}}),ua,la,da,xt,pa,ca,kn=k(()=>{"use strict";Tt(),Kr(),ua=p=>{switch(p){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"layout":return 3;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${p}`)}},la=p=>{switch(p){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${p}`)}},da=p=>{p.extra||(p.extra={}),p.extra.session||(p.extra.session={});let f=p.extra.session;f.use_ort_model_bytes_directly||(f.use_ort_model_bytes_directly="1"),p.executionProviders&&p.executionProviders.some(v=>(typeof v=="string"?v:v.name)==="webgpu")&&(p.enableMemPattern=!1)},xt=(p,f,v,w)=>{let b=at(f,w),A=at(v,w);ne()._OrtAddSessionConfigEntry(p,b,A)!==0&&Z(`Can't set a session config entry: ${f} - ${v}.`)},pa=async(p,f,v)=>{let w=f.executionProviders;for(let b of w){let A=typeof b=="string"?b:b.name,D=[],I;switch(A){case"webnn":if(A="WEBNN",xt(p,"session.disable_quant_qdq","1",v),xt(p,"session.disable_qdq_constant_folding","1",v),typeof b!="string"){let q=b==null?void 0:b.deviceType;q&&xt(p,"deviceType",q,v)}break;case"webgpu":if(A="JS",typeof b!="string"){let q=b;if(q!=null&&q.preferredLayout){if(q.preferredLayout!=="NCHW"&&q.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${q.preferredLayout}`);xt(p,"preferredLayout",q.preferredLayout,v)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${A}`)}let O=D.length,R=0,L=0;if(O>0){R=ne()._malloc(O*ne().PTR_SIZE),v.push(R),L=ne()._malloc(O*ne().PTR_SIZE),v.push(L);for(let q=0;q<O;q++)ne().setValue(R+q*ne().PTR_SIZE,D[q][0],"*"),ne().setValue(L+q*ne().PTR_SIZE,D[q][1],"*")}let N;if(I===void 0){let q=at(A,v);N=await ne()._OrtAppendExecutionProvider(p,q,R,L,O)}N!==0&&Z(`Can't append execution provider: ${A}.`)}},ca=async p=>{let f=ne(),v=0,w=[],b=p||{};da(b);try{let A=ua(b.graphOptimizationLevel??"all"),D=la(b.executionMode??"sequential"),I=typeof b.logId=="string"?at(b.logId,w):0,O=b.logSeverityLevel??2;if(!Number.isInteger(O)||O<0||O>4)throw new Error(`log severity level is not valid: ${O}`);let R=b.logVerbosityLevel??0;if(!Number.isInteger(R)||R<0||R>4)throw new Error(`log verbosity level is not valid: ${R}`);let L=typeof b.optimizedModelFilePath=="string"?at(b.optimizedModelFilePath,w):0;if(v=f._OrtCreateSessionOptions(A,!!b.enableCpuMemArena,!!b.enableMemPattern,D,!!b.enableProfiling,0,I,O,R,L),v===0&&Z("Can't create session options."),b.executionProviders&&await pa(v,b,w),b.enableGraphCapture!==void 0){if(typeof b.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${b.enableGraphCapture}`);xt(v,"enableGraphCapture",b.enableGraphCapture.toString(),w)}if(b.freeDimensionOverrides)for(let[N,q]of Object.entries(b.freeDimensionOverrides)){if(typeof N!="string")throw new Error(`free dimension override name must be a string: ${N}`);if(typeof q!="number"||!Number.isInteger(q)||q<0)throw new Error(`free dimension override value must be a non-negative integer: ${q}`);let G=at(N,w);f._OrtAddFreeDimensionOverride(v,G,q)!==0&&Z(`Can't set a free dimension override: ${N} - ${q}.`)}return b.extra!==void 0&&lr(b.extra,"",new WeakSet,(N,q)=>{xt(v,N,q,w)}),[v,w]}catch(A){throw v!==0&&f._OrtReleaseSessionOptions(v)!==0&&Z("Can't release session options."),w.forEach(D=>f._free(D)),A}}}),Et,kt,It,Zr,Qr,Xr,Yr,yi,se=k(()=>{"use strict";Et=p=>{switch(p){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${p}`)}},kt=p=>{switch(p){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${p}`)}},It=(p,f)=>{let v=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][p],w=typeof f=="number"?f:f.reduce((b,A)=>b*A,1);return v>0?Math.ceil(w*v):void 0},Zr=p=>{switch(p){case"float16":return typeof Float16Array<"u"?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${p}`)}},Qr=p=>{switch(p){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${p}`)}},Xr=p=>p==="float32"||p==="float16"||p==="int32"||p==="int64"||p==="uint32"||p==="uint8"||p==="bool"||p==="uint4"||p==="int4",Yr=p=>p==="float32"||p==="float16"||p==="int32"||p==="int64"||p==="uint32"||p==="uint64"||p==="int8"||p==="uint8"||p==="bool"||p==="uint4"||p==="int4",yi=p=>{switch(p){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${p}`)}}}),dr,Jr=k(()=>{"use strict";Pr(),dr=async p=>{if(typeof p=="string"){let f=await fetch(p);if(!f.ok)throw new Error(`failed to load external data file: ${p}`);let v=f.headers.get("Content-Length"),w=v?parseInt(v,10):0;if(w<1073741824)return new Uint8Array(await f.arrayBuffer());{if(!f.body)throw new Error(`failed to load external data file: ${p}, no response body.`);let b=f.body.getReader(),A;try{A=new ArrayBuffer(w)}catch(I){if(I instanceof RangeError){let O=Math.ceil(w/65536);A=new WebAssembly.Memory({initial:O,maximum:O}).buffer}else throw I}let D=0;for(;;){let{done:I,value:O}=await b.read();if(I)break;let R=O.byteLength;new Uint8Array(A,D,R).set(O),D+=R}return new Uint8Array(A,0,w)}}else return p instanceof Blob?new Uint8Array(await p.arrayBuffer()):p instanceof Uint8Array?p:new Uint8Array(p)}}),ha,wi,_i,Jt,bi,$i,ke,Ot,vi,Ut,B,Lt,fa,ma,xi,he,ei,Si,Ti=k(()=>{"use strict";st(),En(),kn(),se(),Tt(),Kr(),Jr(),ha=(p,f)=>{ne()._OrtInit(p,f)!==0&&Z("Can't initialize onnxruntime.")},wi=async p=>{ha(p.wasm.numThreads,Qr(p.logLevel))},_i=async(p,f)=>{var w,b;(b=(w=ne()).asyncInit)==null||b.call(w);let v=p.webgpu.adapter;if(f==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");if(v){if(typeof v.limits!="object"||typeof v.features!="object"||typeof v.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let A=p.webgpu.powerPreference;if(A!==void 0&&A!=="low-power"&&A!=="high-performance")throw new Error(`Invalid powerPreference setting: "${A}"`);let D=p.webgpu.forceFallbackAdapter;if(D!==void 0&&typeof D!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${D}"`);if(v=await navigator.gpu.requestAdapter({powerPreference:A,forceFallbackAdapter:D}),!v)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}}if(f==="webnn"&&(typeof navigator>"u"||!navigator.ml))throw new Error("WebNN is not supported in current environment")},Jt=new Map,bi=p=>{let f=ne(),v=f.stackSave();try{let w=f.PTR_SIZE,b=f.stackAlloc(2*w);f._OrtGetInputOutputCount(p,b,b+w)!==0&&Z("Can't get session input/output count.");let A=w===4?"i32":"i64";return[Number(f.getValue(b,A)),Number(f.getValue(b+w,A))]}finally{f.stackRestore(v)}},$i=(p,f)=>{let v=ne(),w=v.stackSave(),b=0;try{let A=v.PTR_SIZE,D=v.stackAlloc(2*A);v._OrtGetInputOutputMetadata(p,f,D,D+A)!==0&&Z("Can't get session input/output metadata.");let I=Number(v.getValue(D,"*"));b=Number(v.getValue(D+A,"*"));let O=v.HEAP32[b/4];if(O===0)return[I,0];let R=v.HEAPU32[b/4+1],L=[];for(let N=0;N<R;N++){let q=Number(v.getValue(b+8+N*A,"*"));L.push(q!==0?v.UTF8ToString(q):Number(v.getValue(b+8+(N+R)*A,"*")))}return[I,O,L]}finally{v.stackRestore(w),b!==0&&v._OrtFree(b)}},ke=p=>{let f=ne(),v=f._malloc(p.byteLength);if(v===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${p.byteLength}.`);return f.HEAPU8.set(p,v),[v,p.byteLength]},Ot=async(p,f)=>{var N,q,G;let v,w,b=ne();Array.isArray(p)?[v,w]=p:p.buffer===b.HEAPU8.buffer?[v,w]=[p.byteOffset,p.byteLength]:[v,w]=ke(p);let A=0,D=0,I=0,O=[],R=[],L=[];try{if([D,O]=await ca(f),(f==null?void 0:f.externalData)&&b.mountExternalData){let qe=[];for(let Be of f.externalData){let yt=typeof Be=="string"?Be:Be.path,Mt=typeof Be=="string"?Be:Be.data;qe.push(dr(Mt).then($t=>{b.mountExternalData(yt,$t)}))}await Promise.all(qe)}for(let qe of(f==null?void 0:f.executionProviders)??[])if((typeof qe=="string"?qe:qe.name)==="webnn"){if(b.shouldTransferToMLTensor=!1,typeof qe!="string"){let Be=qe,yt=Be==null?void 0:Be.context,Mt=Be==null?void 0:Be.gpuDevice,$t=Be==null?void 0:Be.deviceType,ni=Be==null?void 0:Be.powerPreference;yt?b.currentContext=yt:Mt?b.currentContext=await b.webnnCreateMLContext(Mt):b.currentContext=await b.webnnCreateMLContext({deviceType:$t,powerPreference:ni})}else b.currentContext=await b.webnnCreateMLContext();break}A=await b._OrtCreateSession(v,w,D),(N=b.webgpuOnCreateSession)==null||N.call(b,A),A===0&&Z("Can't create a session."),(q=b.jsepOnCreateSession)==null||q.call(b),b.currentContext&&(b.webnnRegisterMLContext(A,b.currentContext),b.currentContext=void 0,b.shouldTransferToMLTensor=!0);let[re,Ne]=bi(A),Ie=!!(f!=null&&f.enableGraphCapture),fe=[],de=[],Ue=[],ct=[],Bt=[];for(let qe=0;qe<re;qe++){let[Be,yt,Mt]=$i(A,qe);Be===0&&Z("Can't get an input name."),R.push(Be);let $t=b.UTF8ToString(Be);fe.push($t),Ue.push(yt===0?{name:$t,isTensor:!1}:{name:$t,isTensor:!0,type:kt(yt),shape:Mt})}for(let qe=0;qe<Ne;qe++){let[Be,yt,Mt]=$i(A,qe+re);Be===0&&Z("Can't get an output name."),L.push(Be);let $t=b.UTF8ToString(Be);de.push($t),ct.push(yt===0?{name:$t,isTensor:!1}:{name:$t,isTensor:!0,type:kt(yt),shape:Mt})}return Jt.set(A,[A,R,L,null,Ie,!1]),[A,fe,de,Ue,ct]}catch(re){throw R.forEach(Ne=>b._OrtFree(Ne)),L.forEach(Ne=>b._OrtFree(Ne)),I!==0&&b._OrtReleaseBinding(I)!==0&&Z("Can't release IO binding."),A!==0&&b._OrtReleaseSession(A)!==0&&Z("Can't release session."),re}finally{b._free(v),D!==0&&b._OrtReleaseSessionOptions(D)!==0&&Z("Can't release session options."),O.forEach(re=>b._free(re)),(G=b.unmountExternalData)==null||G.call(b)}},vi=p=>{var O,R,L;let f=ne(),v=Jt.get(p);if(!v)throw new Error(`cannot release session. invalid session id: ${p}`);let[w,b,A,D,I]=v;D&&(I&&f._OrtClearBoundOutputs(D.handle)!==0&&Z("Can't clear bound outputs."),f._OrtReleaseBinding(D.handle)!==0&&Z("Can't release IO binding.")),(O=f.jsepOnReleaseSession)==null||O.call(f,p),(R=f.webnnOnReleaseSession)==null||R.call(f,p),(L=f.webgpuOnReleaseSession)==null||L.call(f,p),b.forEach(N=>f._OrtFree(N)),A.forEach(N=>f._OrtFree(N)),f._OrtReleaseSession(w)!==0&&Z("Can't release session."),Jt.delete(p)},Ut=new Map,B=1,Lt=new Map,fa=p=>{let f=ne(),v=f._malloc(p.byteLength);if(v===0)throw new Error(`Can't create a LoRA adapter. failed to allocate a buffer of size ${p.byteLength}.`);try{f.HEAPU8.set(p,v);let w=f._OrtCreateLoraAdapter(v,p.byteLength);w===0&&Z("Can't create a LoRA adapter.");let b=B++;return Ut.set(b,w),b}finally{f._free(v)}},ma=p=>{let f=ne(),v=Ut.get(p);if(v===void 0)throw new Error(`cannot release LoRA adapter. invalid adapter id: ${p}`);if(Lt.has(p))throw new Error(`cannot release LoRA adapter. the adapter is used by a run in progress. adapter id: ${p}`);f._OrtReleaseLoraAdapter(v)!==0&&Z("Can't release LoRA adapter."),Ut.delete(p)},xi=async(p,f,v,w,b,A,D=!1)=>{if(!p){f.push(0);return}let I=ne(),O=I.PTR_SIZE,R=p[0],L=p[1],N=p[3],q=N,G,re;if(R==="string"&&(N==="gpu-buffer"||N==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(D&&N!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${A} when enableGraphCapture is true.`);if(N==="gpu-buffer"){let fe=p[2].gpuBuffer;re=It(Et(R),L);{let de=I.jsepRegisterBuffer;if(!de)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');G=de(w,A,fe,re)}}else if(N==="ml-tensor"){let fe=p[2].mlTensor;re=It(Et(R),L);let de=I.webnnRegisterMLTensor;if(!de)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');G=de(w,fe,Et(R),L)}else{let fe=p[2];if(Array.isArray(fe)){re=O*fe.length,G=I._malloc(re),v.push(G);for(let de=0;de<fe.length;de++){if(typeof fe[de]!="string")throw new TypeError(`tensor data at index ${de} is not a string`);I.setValue(G+de*O,at(fe[de],v),"*")}}else{let de=I.webnnIsGraphInput,Ue=I.webnnIsGraphOutput;if(R!=="string"&&de&&Ue){let ct=I.UTF8ToString(b);if(de(w,ct)||Ue(w,ct)){let Bt=Et(R);re=It(Bt,L),q="ml-tensor";let qe=I.webnnCreateTemporaryTensor,Be=I.webnnUploadTensor;if(!qe||!Be)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let yt=await qe(w,Bt,L);Be(yt,new Uint8Array(fe.buffer,fe.byteOffset,fe.byteLength)),G=yt}else re=fe.byteLength,G=I._malloc(re),v.push(G),I.HEAPU8.set(new Uint8Array(fe.buffer,fe.byteOffset,re),G)}else re=fe.byteLength,G=I._malloc(re),v.push(G),I.HEAPU8.set(new Uint8Array(fe.buffer,fe.byteOffset,re),G)}}let Ne=I.stackSave(),Ie=I.stackAlloc(4*L.length);try{L.forEach((de,Ue)=>I.setValue(Ie+Ue*O,de,O===4?"i32":"i64"));let fe=I._OrtCreateTensor(Et(R),G,re,Ie,L.length,yi(q));fe===0&&Z(`Can't create tensor for input/output. session=${w}, index=${A}.`),f.push(fe)}finally{I.stackRestore(Ne)}},he=async(p,f,v,w,b,A,D=[])=>{var zt,va,xa;let I=ne(),O=I.PTR_SIZE,R=Jt.get(p);if(!R)throw new Error(`cannot run inference. invalid session id: ${p}`);let L=R[0],N=R[1],q=R[2],G=R[3],re=R[4],Ne=R[5],Ie=[];if(D.length>0){if(G)throw new Error("LoRA adapters are not supported for a session that uses IO binding, e.g. when an output is preferred to be on GPU, or when the WebNN execution provider produces an output.");for(let ht of D){let wt=Ut.get(ht);if(wt===void 0)throw new Error(`cannot run inference. invalid LoRA adapter id: ${ht}`);Ie.push(wt)}}let fe=f.length,de=w.length,Ue=0,ct=[],Bt=[],qe=[],Be=[],yt=[],Mt=I.stackSave(),$t=I.stackAlloc(fe*O),ni=I.stackAlloc(fe*O),Ai=I.stackAlloc(de*O),$a=I.stackAlloc(de*O);try{for(let Te of D)Lt.set(Te,(Lt.get(Te)??0)+1);[Ue,ct]=oa(A,Ie),ze("wasm prepareInputOutputTensor");for(let Te=0;Te<fe;Te++)await xi(v[Te],Bt,Be,p,N[f[Te]],f[Te],re);for(let Te=0;Te<de;Te++)await xi(b[Te],qe,Be,p,q[w[Te]],fe+w[Te],re);rt("wasm prepareInputOutputTensor");for(let Te=0;Te<fe;Te++)I.setValue($t+Te*O,Bt[Te],"*"),I.setValue(ni+Te*O,N[f[Te]],"*");for(let Te=0;Te<de;Te++)I.setValue(Ai+Te*O,qe[Te],"*"),I.setValue($a+Te*O,q[w[Te]],"*");(zt=I.jsepOnRunStart)==null||zt.call(I,L),(va=I.webnnOnRunStart)==null||va.call(I,L);let ht;ht=await I._OrtRun(L,ni,$t,fe,$a,de,Ai,Ue),ht!==0&&Z("failed to call OrtRun().");let wt=[],Sa=[];ze("wasm ProcessOutputTensor");for(let Te=0;Te<de;Te++){let Dt=Number(I.getValue(Ai+Te*O,"*"));if(Dt===qe[Te]||yt.includes(qe[Te])){wt.push(b[Te]),Dt!==qe[Te]&&I._OrtReleaseTensor(Dt)!==0&&Z("Can't release tensor.");continue}let Qa=I.stackSave(),jt=I.stackAlloc(4*O),si=!1,ft,Ye=0;try{I._OrtGetTensorData(Dt,jt,jt+O,jt+2*O,jt+3*O)!==0&&Z(`Can't access output tensor data on index ${Te}.`);let Oi=O===4?"i32":"i64",fr=Number(I.getValue(jt,Oi));Ye=I.getValue(jt+O,"*");let Ri=I.getValue(jt+O*2,"*"),Pt=Number(I.getValue(jt+O*3,Oi)),Ht=[];for(let lt=0;lt<Pt;lt++)Ht.push(Number(I.getValue(Ri+lt*O,Oi)));I._OrtFree(Ri)!==0&&Z("Can't free memory for tensor dims.");let Kt=Ht.reduce((lt,et)=>lt*et,1);ft=kt(fr);let kr=G==null?void 0:G.outputPreferredLocations[w[Te]];if(ft==="string"){if(kr==="gpu-buffer"||kr==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let lt=[];for(let et=0;et<Kt;et++){let Nt=I.getValue(Ye+et*O,"*"),Xa=I.getValue(Ye+(et+1)*O,"*"),Ya=et===Kt-1?void 0:Xa-Nt;lt.push(I.UTF8ToString(Nt,Ya))}wt.push([ft,Ht,lt,"cpu"])}else if(kr==="gpu-buffer"&&Kt>0){let lt=I.jsepGetBuffer;if(!lt)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let et=lt(Ye),Nt=It(fr,Kt);if(Nt===void 0||!Xr(ft))throw new Error(`Unsupported data type: ${ft}`);si=!0,wt.push([ft,Ht,{gpuBuffer:et,download:I.jsepCreateDownloader(et,Nt,ft),dispose:()=>{I._OrtReleaseTensor(Dt)!==0&&Z("Can't release tensor.")}},"gpu-buffer"])}else if(kr==="ml-tensor"&&Kt>0){let lt=I.webnnEnsureTensor,et=I.webnnIsGraphInputOutputTypeSupported;if(!lt||!et)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(It(fr,Kt)===void 0||!Yr(ft))throw new Error(`Unsupported data type: ${ft}`);if(!et(p,ft,!1))throw new Error(`preferredLocation "ml-tensor" for ${ft} output is not supported by current WebNN Context.`);let Nt=await lt(p,Ye,fr,Ht,!1);si=!0,wt.push([ft,Ht,{mlTensor:Nt,download:I.webnnCreateMLTensorDownloader(Ye,ft),dispose:()=>{I.webnnReleaseTensorId(Ye),I._OrtReleaseTensor(Dt)}},"ml-tensor"])}else if(kr==="ml-tensor-cpu-output"&&Kt>0){let lt=I.webnnCreateMLTensorDownloader(Ye,ft)(),et=wt.length;si=!0,Sa.push((async()=>{let Nt=[et,await lt];return I.webnnReleaseTensorId(Ye),I._OrtReleaseTensor(Dt),Nt})()),wt.push([ft,Ht,[],"cpu"])}else{let lt=Zr(ft),et=new lt(Kt);new Uint8Array(et.buffer,et.byteOffset,et.byteLength).set(I.HEAPU8.subarray(Ye,Ye+et.byteLength)),wt.push([ft,Ht,et,"cpu"])}}finally{I.stackRestore(Qa),ft==="string"&&Ye&&I._free(Ye),si||I._OrtReleaseTensor(Dt)}}G&&!re&&(I._OrtClearBoundOutputs(G.handle)!==0&&Z("Can't clear bound outputs."),Jt.set(p,[L,N,q,G,re,!1]));for(let[Te,Dt]of await Promise.all(Sa))wt[Te][2]=Dt;return rt("wasm ProcessOutputTensor"),wt}finally{(xa=I.webnnOnRunEnd)==null||xa.call(I,L),I.stackRestore(Mt),Bt.forEach(ht=>I._OrtReleaseTensor(ht)),qe.forEach(ht=>I._OrtReleaseTensor(ht)),Be.forEach(ht=>I._free(ht)),Ue!==0&&I._OrtReleaseRunOptions(Ue),ct.forEach(ht=>I._free(ht));for(let ht of D){let wt=Lt.get(ht)-1;wt===0?Lt.delete(ht):Lt.set(ht,wt)}}},ei=p=>{let f=ne(),v=Jt.get(p);if(!v)throw new Error("invalid session id");let w=v[0],b=f._OrtEndProfiling(w);b===0&&Z("Can't get an profile file name."),f._OrtFree(b)},Si=p=>{let f=[];for(let v of p){let w=v[2];!Array.isArray(w)&&"buffer"in w&&f.push(w.buffer)}return f}}),Rt,gt,pr,cr,$r,vr,ti,xr,er,tr,ja,Sr,ga,ya,Ha,Ei,ki,ri,ii,wa,Ii=k(()=>{"use strict";st(),Ti(),Tt(),Gr(),Jr(),Rt=()=>!!ee.wasm.proxy&&typeof document<"u",pr=!1,cr=!1,$r=!1,xr=new Map,er=(p,f)=>{let v=xr.get(p);v?v.push(f):xr.set(p,[f])},tr=()=>{if(pr||!cr||$r||!gt)throw new Error("worker not ready")},ja=p=>{switch(p.data.type){case"init-wasm":pr=!1,p.data.err?($r=!0,ti[1](p.data.err)):(cr=!0,ti[0]()),vr&&(URL.revokeObjectURL(vr),vr=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let f=xr.get(p.data.type);p.data.err?f.shift()[1](p.data.err):f.shift()[0](p.data.out);break}default:}},Sr=async()=>{if(!cr){if(pr)throw new Error("multiple calls to 'initWasm()' detected.");if($r)throw new Error("previous call to 'initWasm()' failed.");if(pr=!0,Rt())return new Promise((p,f)=>{gt==null||gt.terminate(),ra().then(([v,w])=>{try{gt=w,gt.onerror=A=>f(A),gt.onmessage=ja,ti=[p,f];let b={type:"init-wasm",in:ee};if(!b.in.wasm.wasmPaths&&v){let A=Nr();A&&(b.in.wasm.wasmPaths=A)}gt.postMessage(b),vr=v}catch(b){f(b)}},f)});try{await Hr(ee.wasm),await wi(ee),cr=!0}catch(p){throw $r=!0,p}finally{pr=!1}}},ga=async p=>{if(Rt())return tr(),new Promise((f,v)=>{er("init-ep",[f,v]);let w={type:"init-ep",in:{epName:p,env:ee}};gt.postMessage(w)});await _i(ee,p)},ya=async p=>Rt()?(tr(),new Promise((f,v)=>{er("copy-from",[f,v]);let w={type:"copy-from",in:{buffer:p}};gt.postMessage(w,[p.buffer])})):ke(p),Ha=async(p,f)=>{if(Rt()){if(f!=null&&f.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return tr(),new Promise((v,w)=>{er("create",[v,w]);let b={type:"create",in:{model:p,options:{...f}}},A=[];p instanceof Uint8Array&&A.push(p.buffer),gt.postMessage(b,A)})}else return Ot(p,f)},Ei=async p=>{if(Rt())return tr(),new Promise((f,v)=>{er("release",[f,v]);let w={type:"release",in:p};gt.postMessage(w)});vi(p)},ki=async p=>{if(Rt())throw new Error("LoRA adapter is not supported for proxy.");let f=typeof p=="string"?await dr(p):p;return fa(f)},ri=async p=>{if(Rt())throw new Error("LoRA adapter is not supported for proxy.");ma(p)},ii=async(p,f,v,w,b,A,D)=>{if(Rt()){if(D.length>0)throw new Error("LoRA adapter is not supported for proxy.");if(v.some(I=>I[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(b.some(I=>I))throw new Error("pre-allocated output tensor is not supported for proxy.");return tr(),new Promise((I,O)=>{er("run",[I,O]);let R=v,L={type:"run",in:{sessionId:p,inputIndices:f,inputs:R,outputIndices:w,options:A}};gt.postMessage(L,Si(R))})}else return he(p,f,v,w,b,A,D)},wa=async p=>{if(Rt())return tr(),new Promise((f,v)=>{er("end-profiling",[f,v]);let w={type:"end-profiling",in:p};gt.postMessage(w)});ei(p)}}),ai,zi=k(()=>{"use strict";st(),Ii(),ai=class{async loadAdapter(p){Xe(),this.adapterId=await ki(p),He()}async dispose(){return ri(this.adapterId)}}}),Ci,_a,Ka,Za=k(()=>{"use strict";st(),zi(),Ii(),se(),Pr(),Jr(),Ci=(p,f)=>{switch(p.location){case"cpu":return[p.type,p.dims,p.data,"cpu"];case"gpu-buffer":return[p.type,p.dims,{gpuBuffer:p.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[p.type,p.dims,{mlTensor:p.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${p.location} for ${f()}`)}},_a=p=>{switch(p[3]){case"cpu":return new it(p[0],p[2],p[1]);case"gpu-buffer":{let f=p[0];if(!Xr(f))throw new Error(`not supported data type: ${f} for deserializing GPU tensor`);let{gpuBuffer:v,download:w,dispose:b}=p[2];return it.fromGpuBuffer(v,{dataType:f,dims:p[1],download:w,dispose:b})}case"ml-tensor":{let f=p[0];if(!Yr(f))throw new Error(`not supported data type: ${f} for deserializing MLTensor tensor`);let{mlTensor:v,download:w,dispose:b}=p[2];return it.fromMLTensor(v,{dataType:f,dims:p[1],download:w,dispose:b})}default:throw new Error(`invalid data location: ${p[3]}`)}},Ka=class{async fetchModelAndCopyToWasmMemory(p){return ya(await dr(p))}async loadModel(p,f){Xe();let v;typeof p=="string"?v=await this.fetchModelAndCopyToWasmMemory(p):v=p,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await Ha(v,f),He()}async dispose(){return Ei(this.sessionId)}async run(p,f,v,w=[]){Xe();let b=w.map(G=>{if(!(G instanceof ai))throw new Error("LoRA adapter was not created by the WebAssembly backend.");return G.adapterId}),A=[],D=[];Object.entries(p).forEach(G=>{let re=G[0],Ne=G[1],Ie=this.inputNames.indexOf(re);if(Ie===-1)throw new Error(`invalid input '${re}'`);A.push(Ne),D.push(Ie)});let I=[],O=[];Object.entries(f).forEach(G=>{let re=G[0],Ne=G[1],Ie=this.outputNames.indexOf(re);if(Ie===-1)throw new Error(`invalid output '${re}'`);I.push(Ne),O.push(Ie)});let R=A.map((G,re)=>Ci(G,()=>`input "${this.inputNames[D[re]]}"`)),L=I.map((G,re)=>G?Ci(G,()=>`output "${this.outputNames[O[re]]}"`):null),N=await ii(this.sessionId,D,R,O,L,v,b),q={};for(let G=0;G<N.length;G++)q[this.outputNames[O[G]]]=I[G]??_a(N[G]);return He(),q}startProfiling(){}endProfiling(){wa(this.sessionId)}}}),Re,Ke=k(()=>{"use strict";Re=p=>{if(p!=null&&p.epContextDataRead)throw new Error('session option "epContextDataRead" is not supported by ONNX Runtime Web')}}),hr={};Q(hr,{OnnxruntimeWebAssemblyBackend:()=>nt,initializeFlags:()=>Tr,wasmBackend:()=>ot});var Tr,nt,ot,X=k(()=>{"use strict";st(),zi(),Ii(),Za(),Ke(),Tr=()=>{(typeof ee.wasm.initTimeout!="number"||ee.wasm.initTimeout<0)&&(ee.wasm.initTimeout=0);let p=ee.wasm.simd;if(typeof p!="boolean"&&p!==void 0&&p!=="fixed"&&p!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${p}". Reset it to \`false\` and ignore SIMD feature checking.`),ee.wasm.simd=!1),typeof ee.wasm.proxy!="boolean"&&(ee.wasm.proxy=!1),typeof ee.wasm.trace!="boolean"&&(ee.wasm.trace=!1),typeof ee.wasm.numThreads!="number"||!Number.isInteger(ee.wasm.numThreads)||ee.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)ee.wasm.numThreads=1;else{let f=typeof navigator>"u"?j("node:os").cpus().length:navigator.hardwareConcurrency;ee.wasm.numThreads=Math.min(4,Math.ceil((f||1)/2))}},nt=class{async init(p){Tr(),await Sr(),await ga(p)}async createInferenceSessionHandler(p,f){Re(f);let v=new Ka;return await v.loadModel(p,f),v}async createLoraAdapterHandler(p){let f=new ai;return await f.loadAdapter(p),f}},ot=new nt}),Ge={};Q(Ge,{InferenceSession:()=>Mr,LoraAdapter:()=>Dr,TRACE:()=>mt,TRACE_EVENT_BEGIN:()=>ze,TRACE_EVENT_END:()=>rt,TRACE_FUNC_BEGIN:()=>Xe,TRACE_FUNC_END:()=>He,Tensor:()=>it,default:()=>Er,env:()=>ee,registerBackend:()=>H}),st(),st(),st();var ba="1.31.1",Er=Ki;{let p=(X(),Se(hr)).wasmBackend;H("cpu",p,10),H("wasm",p,10)}return Object.defineProperty(ee.versions,"web",{value:ba,enumerable:!0}),Se(Ge)})();W.exports=Ae}(Ls)),Ls.exports}var Uc;function tf(){return Uc||(Uc=1,function(W){var $e=br&&br.__createBinding||(Object.create?function(xe,ge,ye,Le){Le===void 0&&(Le=ye);var pt=Object.getOwnPropertyDescriptor(ge,ye);(!pt||("get"in pt?!ge.__esModule:pt.writable||pt.configurable))&&(pt={enumerable:!0,get:function(){return ge[ye]}}),Object.defineProperty(xe,Le,pt)}:function(xe,ge,ye,Le){Le===void 0&&(Le=ye),xe[Le]=ge[ye]}),Ae=br&&br.__setModuleDefault||(Object.create?function(xe,ge){Object.defineProperty(xe,"default",{enumerable:!0,value:ge})}:function(xe,ge){xe.default=ge}),ve=br&&br.__importStar||function(xe){if(xe&&xe.__esModule)return xe;var ge={};if(xe!=null)for(var ye in xe)ye!=="default"&&Object.prototype.hasOwnProperty.call(xe,ye)&&$e(ge,xe,ye);return Ae(ge,xe),ge};Object.defineProperty(W,"__esModule",{value:!0}),W.MicVAD=W.getDefaultRealTimeVADOptions=W.ort=W.DEFAULT_MODEL=void 0;const Ee=ve(ef()),me=Ns(),ue=qs(),j=Wa(),k=hn(),Q=Gc(),_e=Wc();W.DEFAULT_MODEL="legacy",W.ort=Ee;const Se="vad.worklet.bundle.min.js",ce={legacy:"silero_vad_legacy.onnx",v5:"silero_vad_v5.onnx",v6:"silero_vad_v6.onnx"},ie=xe=>({...ue.defaultFrameProcessorOptions,onFrameProcessed:()=>{},onVADMisfire:()=>{j.log.debug("VAD misfire")},onSpeechStart:()=>{j.log.debug("Detected speech start")},onSpeechEnd:()=>{j.log.debug("Detected speech end")},onSpeechRealStart:()=>{j.log.debug("Detected real speech start")},baseAssetPath:"./",onnxWASMBasePath:"./",model:xe,workletOptions:{},getStream:async()=>await navigator.mediaDevices.getUserMedia({audio:{channelCount:1,echoCancellation:!0,autoGainControl:!0,noiseSuppression:!0}}),pauseStream:async ge=>{ge.getTracks().forEach(ye=>{ye.stop()})},resumeStream:async()=>await navigator.mediaDevices.getUserMedia({audio:{channelCount:1,echoCancellation:!0,autoGainControl:!0,noiseSuppression:!0}}),ortConfig:ge=>{ge.env.logLevel="error"},startOnLoad:!0,processorType:"auto"});W.getDefaultRealTimeVADOptions=ie;const J=xe=>"audioWorklet"in xe&&typeof AudioWorkletNode=="function"?"AudioWorklet":"ScriptProcessor";async function H(xe,ge,ye,Le,pt){await ye.audioWorklet.addModule(xe),ge.processorOptions={...ge.processorOptions??{},frameSamples:Le};const je=new AudioWorkletNode(ye,"vad-helper-worklet",ge);return je.port.onmessage=async we=>{const ut=we.data;if(!(typeof ut=="object"&&ut&&"message"in ut)){console.error("Invalid message event",ut);return}switch(ut.message){case k.Message.AudioFrame:{if(!("data"in ut&&ut.data instanceof ArrayBuffer)){console.log("Audio frame message has no data");return}const ee=new Float32Array(ut.data);await pt(ee);break}}},je}async function Oe(xe,ge,ye){const Le=new _e.Resampler({nativeSampleRate:xe.sampleRate,targetSampleRate:16e3,targetFrameSize:ge});j.log.debug("using script processor");const je=xe.createScriptProcessor(4096,1,1);let we=!1;return je.onaudioprocess=async ut=>{if(!we){we=!0;try{const ee=ut.inputBuffer.getChannelData(0);ut.outputBuffer.getChannelData(0).fill(0);const mt=Le.process(ee);for(const Vt of mt)await ye(Vt)}catch(ee){console.error("Error processing audio:",ee)}finally{we=!1}}},je.connect(xe.destination),je}class We{constructor(ge,ye,Le,pt,je=!1,we=null,ut=null,ee=null,ar=null,mt=null,Vt=null,Xe="uninitialized",He=!1){this.options=ge,this.frameProcessor=ye,this.model=Le,this.frameSamples=pt,this.listening=je,this.errored=we,this._stream=ut,this._audioContext=ee,this._vadNode=ar,this._mediaStreamAudioSourceNode=mt,this._audioProcessorAdapterType=Vt,this.initializationState=Xe,this.ownsAudioContext=He,this.getAudioInstances=()=>{if(this._stream===null||this._audioContext===null||this._vadNode==null||this._mediaStreamAudioSourceNode==null)throw new Error("MicVAD has null stream, audio context, or processor adapter");return{stream:this._stream,audioContext:this._audioContext,vadNode:this._vadNode,mediaStreamAudioSourceNode:this._mediaStreamAudioSourceNode}},this.setErrored=ze=>{this.initializationState="errored",this.errored=ze},this.start=async()=>{switch(this.initializationState){case"uninitialized":{j.log.debug("initializing micVAD"),this.initializationState="initializing",this.frameProcessor.resume();try{this._stream=await this.options.getStream()}catch(ze){throw ze instanceof Error?this.setErrored(ze.message):this.setErrored(String(ze)),ze}if(this.options.audioContext?(console.log("using custom audio context"),this._audioContext=this.options.audioContext):(console.log("using default audio context"),this._audioContext=new AudioContext,this.ownsAudioContext=!0),!this._audioContext)throw this.setErrored("Audio context is null"),Error("Audio context is null");switch(this._audioProcessorAdapterType=this.options.processorType=="auto"?J(this._audioContext):this.options.processorType,this._audioProcessorAdapterType){case"AudioWorklet":this._vadNode=await H(this.options.baseAssetPath+Se,this.options.workletOptions,this._audioContext,this.frameSamples,this.processFrame);break;case"ScriptProcessor":this._vadNode=await Oe(this._audioContext,this.frameSamples,this.processFrame);break;default:throw new Error(`Unsupported audio processor adapter type: ${this._audioProcessorAdapterType}`)}this._mediaStreamAudioSourceNode=new MediaStreamAudioSourceNode(this._audioContext,{mediaStream:this._stream}),this._mediaStreamAudioSourceNode.connect(this._vadNode),j.log.debug("started micVAD"),this.listening=!0,this.initializationState="initialized";break}case"initializing":{j.log.warn("start called while initializing");break}case"initialized":{if(this.listening)return;this.listening=!0,this.frameProcessor.resume();const{stream:ze,audioContext:rt,vadNode:nr}=this.getAudioInstances();this._stream=await this.options.resumeStream(ze);const Yt=new MediaStreamAudioSourceNode(rt,{mediaStream:this._stream});this._mediaStreamAudioSourceNode=Yt,Yt.connect(nr);break}case"destroyed":{j.log.warn("start called after destroyed");break}case"errored":{j.log.error("start called after errored");break}default:{j.log.warn("weird initialization state");break}}},this.pause=async()=>{if(!this.listening)return;this.listening=!1;const{stream:ze,mediaStreamAudioSourceNode:rt}=this.getAudioInstances();await this.options.pauseStream(ze),rt.disconnect(),this.frameProcessor.pause(this.handleFrameProcessorEvent)},this.destroy=async()=>{var rt;j.log.debug("destroy called"),this.initializationState="destroyed";const{vadNode:ze}=this.getAudioInstances();ze instanceof AudioWorkletNode&&ze.port.postMessage(k.Message.SpeechStop),this.listening&&await this.pause(),await this.model.release(),this.ownsAudioContext&&await((rt=this._audioContext)==null?void 0:rt.close())},this.setOptions=ze=>{this.frameProcessor.setOptions(ze)},this.processFrame=async ze=>{await this.frameProcessor.process(ze,this.handleFrameProcessorEvent)},this.handleFrameProcessorEvent=ze=>{switch(ze.msg){case k.Message.FrameProcessed:this.options.onFrameProcessed(ze.probs,ze.frame);break;case k.Message.SpeechStart:this.options.onSpeechStart();break;case k.Message.SpeechRealStart:this.options.onSpeechRealStart();break;case k.Message.VADMisfire:this.options.onVADMisfire();break;case k.Message.SpeechEnd:this.options.onSpeechEnd(ze.audio);break}}}static async new(ge={}){const ye={...(0,W.getDefaultRealTimeVADOptions)(ge.model??W.DEFAULT_MODEL),...ge};(0,ue.validateOptions)(ye),W.ort.env.wasm.wasmPaths=ye.onnxWASMBasePath,ye.ortConfig!==void 0&&ye.ortConfig(W.ort);const Le=ye.baseAssetPath+ce[ye.model],pt=ye.model==="legacy"?Q.SileroLegacy.new:Q.Silero.new;let je;try{je=await pt(W.ort,()=>(0,me.defaultModelFetcher)(Le))}catch(mt){throw console.error(`Encountered an error while loading model file ${Le}`),mt}const we=ye.model==="legacy"?1536:512,ut=we/16,ee=new ue.FrameProcessor(je.process,je.reset_state,{positiveSpeechThreshold:ye.positiveSpeechThreshold,negativeSpeechThreshold:ye.negativeSpeechThreshold,redemptionMs:ye.redemptionMs,preSpeechPadMs:ye.preSpeechPadMs,minSpeechMs:ye.minSpeechMs,submitUserSpeechOnPause:ye.submitUserSpeechOnPause},ut),ar=new We(ye,ee,je,we);if(ye.startOnLoad)try{await ar.start()}catch(mt){throw console.error("Error starting micVad",mt),mt}return ar}}W.MicVAD=We}(br)),br}var Lc;function rf(){return Lc||(Lc=1,function(W){Object.defineProperty(W,"__esModule",{value:!0}),W.getDefaultRealTimeVADOptions=W.MicVAD=W.DEFAULT_MODEL=W.utils=W.NonRealTimeVAD=W.Message=W.FrameProcessor=W.defaultModelFetcher=W.baseAssetPath=void 0;var $e=Nc();Object.defineProperty(W,"baseAssetPath",{enumerable:!0,get:function(){return $e.baseAssetPath}});var Ae=Ns();Object.defineProperty(W,"defaultModelFetcher",{enumerable:!0,get:function(){return Ae.defaultModelFetcher}});var ve=qs();Object.defineProperty(W,"FrameProcessor",{enumerable:!0,get:function(){return ve.FrameProcessor}});var Ee=hn();Object.defineProperty(W,"Message",{enumerable:!0,get:function(){return Ee.Message}});var me=Yh();Object.defineProperty(W,"NonRealTimeVAD",{enumerable:!0,get:function(){return me.NonRealTimeVAD}});const ue=Jh();W.utils={audioFileToArray:ue.audioFileToArray,minFramesForTargetMS:ue.minFramesForTargetMS,arrayBufferToBase64:ue.arrayBufferToBase64,encodeWAV:ue.encodeWAV};var j=tf();Object.defineProperty(W,"DEFAULT_MODEL",{enumerable:!0,get:function(){return j.DEFAULT_MODEL}}),Object.defineProperty(W,"MicVAD",{enumerable:!0,get:function(){return j.MicVAD}}),Object.defineProperty(W,"getDefaultRealTimeVADOptions",{enumerable:!0,get:function(){return j.getDefaultRealTimeVADOptions}})}(Ds)),Ds}var af=rf();const sf=Hh({__proto__:null},[af]);export{sf as i};
