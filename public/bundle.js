(()=>{"use strict";class e{constructor(e,t,s){this.eventTarget=e,this.eventName=t,this.eventOptions=s,this.unorderedBindings=new Set}connect(){this.eventTarget.addEventListener(this.eventName,this,this.eventOptions)}disconnect(){this.eventTarget.removeEventListener(this.eventName,this,this.eventOptions)}bindingConnected(e){this.unorderedBindings.add(e)}bindingDisconnected(e){this.unorderedBindings.delete(e)}handleEvent(e){const t=function(e){if("immediatePropagationStopped"in e)return e;{const{stopImmediatePropagation:t}=e;return Object.assign(e,{immediatePropagationStopped:!1,stopImmediatePropagation(){this.immediatePropagationStopped=!0,t.call(this)}})}}(e);for(const e of this.bindings){if(t.immediatePropagationStopped)break;e.handleEvent(t)}}get bindings(){return Array.from(this.unorderedBindings).sort(((e,t)=>{const s=e.index,r=t.index;return s<r?-1:s>r?1:0}))}}class t{constructor(e){this.application=e,this.eventListenerMaps=new Map,this.started=!1}start(){this.started||(this.started=!0,this.eventListeners.forEach((e=>e.connect())))}stop(){this.started&&(this.started=!1,this.eventListeners.forEach((e=>e.disconnect())))}get eventListeners(){return Array.from(this.eventListenerMaps.values()).reduce(((e,t)=>e.concat(Array.from(t.values()))),[])}bindingConnected(e){this.fetchEventListenerForBinding(e).bindingConnected(e)}bindingDisconnected(e){this.fetchEventListenerForBinding(e).bindingDisconnected(e)}handleError(e,t,s={}){this.application.handleError(e,`Error ${t}`,s)}fetchEventListenerForBinding(e){const{eventTarget:t,eventName:s,eventOptions:r}=e;return this.fetchEventListener(t,s,r)}fetchEventListener(e,t,s){const r=this.fetchEventListenerMapForEventTarget(e),n=this.cacheKey(t,s);let i=r.get(n);return i||(i=this.createEventListener(e,t,s),r.set(n,i)),i}createEventListener(t,s,r){const n=new e(t,s,r);return this.started&&n.connect(),n}fetchEventListenerMapForEventTarget(e){let t=this.eventListenerMaps.get(e);return t||(t=new Map,this.eventListenerMaps.set(e,t)),t}cacheKey(e,t){const s=[e];return Object.keys(t).sort().forEach((e=>{s.push(`${t[e]?"":"!"}${e}`)})),s.join(":")}}const s=/^((.+?)(@(window|document))?->)?(.+?)(#([^:]+?))(:(.+))?$/;function r(e){return e.replace(/(?:[_-])([a-z0-9])/g,((e,t)=>t.toUpperCase()))}function n(e){return e.charAt(0).toUpperCase()+e.slice(1)}function i(e){return e.replace(/([A-Z])/g,((e,t)=>`-${t.toLowerCase()}`))}const o={a:e=>"click",button:e=>"click",form:e=>"submit",details:e=>"toggle",input:e=>"submit"==e.getAttribute("type")?"click":"input",select:e=>"change",textarea:e=>"input"};function a(e){throw new Error(e)}function c(e){try{return JSON.parse(e)}catch(t){return e}}class l{constructor(e,t){this.context=e,this.action=t}get index(){return this.action.index}get eventTarget(){return this.action.eventTarget}get eventOptions(){return this.action.eventOptions}get identifier(){return this.context.identifier}handleEvent(e){this.willBeInvokedByEvent(e)&&this.invokeWithEvent(e)}get eventName(){return this.action.eventName}get method(){const e=this.controller[this.methodName];if("function"==typeof e)return e;throw new Error(`Action "${this.action}" references undefined method "${this.methodName}"`)}invokeWithEvent(e){const{target:t,currentTarget:s}=e;try{const{params:r}=this.action,n=Object.assign(e,{params:r});this.method.call(this.controller,n),this.context.logDebugActivity(this.methodName,{event:e,target:t,currentTarget:s,action:this.methodName})}catch(t){const{identifier:s,controller:r,element:n,index:i}=this,o={identifier:s,controller:r,element:n,index:i,event:e};this.context.handleError(t,`invoking action "${this.action}"`,o)}}willBeInvokedByEvent(e){const t=e.target;return this.element===t||(t instanceof Element&&this.element.contains(t)?this.scope.containsElement(t):this.scope.containsElement(this.action.element))}get controller(){return this.context.controller}get methodName(){return this.action.methodName}get element(){return this.scope.element}get scope(){return this.context.scope}}class h{constructor(e,t){this.mutationObserverInit={attributes:!0,childList:!0,subtree:!0},this.element=e,this.started=!1,this.delegate=t,this.elements=new Set,this.mutationObserver=new MutationObserver((e=>this.processMutations(e)))}start(){this.started||(this.started=!0,this.mutationObserver.observe(this.element,this.mutationObserverInit),this.refresh())}pause(e){this.started&&(this.mutationObserver.disconnect(),this.started=!1),e(),this.started||(this.mutationObserver.observe(this.element,this.mutationObserverInit),this.started=!0)}stop(){this.started&&(this.mutationObserver.takeRecords(),this.mutationObserver.disconnect(),this.started=!1)}refresh(){if(this.started){const e=new Set(this.matchElementsInTree());for(const t of Array.from(this.elements))e.has(t)||this.removeElement(t);for(const t of Array.from(e))this.addElement(t)}}processMutations(e){if(this.started)for(const t of e)this.processMutation(t)}processMutation(e){"attributes"==e.type?this.processAttributeChange(e.target,e.attributeName):"childList"==e.type&&(this.processRemovedNodes(e.removedNodes),this.processAddedNodes(e.addedNodes))}processAttributeChange(e,t){const s=e;this.elements.has(s)?this.delegate.elementAttributeChanged&&this.matchElement(s)?this.delegate.elementAttributeChanged(s,t):this.removeElement(s):this.matchElement(s)&&this.addElement(s)}processRemovedNodes(e){for(const t of Array.from(e)){const e=this.elementFromNode(t);e&&this.processTree(e,this.removeElement)}}processAddedNodes(e){for(const t of Array.from(e)){const e=this.elementFromNode(t);e&&this.elementIsActive(e)&&this.processTree(e,this.addElement)}}matchElement(e){return this.delegate.matchElement(e)}matchElementsInTree(e=this.element){return this.delegate.matchElementsInTree(e)}processTree(e,t){for(const s of this.matchElementsInTree(e))t.call(this,s)}elementFromNode(e){if(e.nodeType==Node.ELEMENT_NODE)return e}elementIsActive(e){return e.isConnected==this.element.isConnected&&this.element.contains(e)}addElement(e){this.elements.has(e)||this.elementIsActive(e)&&(this.elements.add(e),this.delegate.elementMatched&&this.delegate.elementMatched(e))}removeElement(e){this.elements.has(e)&&(this.elements.delete(e),this.delegate.elementUnmatched&&this.delegate.elementUnmatched(e))}}class u{constructor(e,t,s){this.attributeName=t,this.delegate=s,this.elementObserver=new h(e,this)}get element(){return this.elementObserver.element}get selector(){return`[${this.attributeName}]`}start(){this.elementObserver.start()}pause(e){this.elementObserver.pause(e)}stop(){this.elementObserver.stop()}refresh(){this.elementObserver.refresh()}get started(){return this.elementObserver.started}matchElement(e){return e.hasAttribute(this.attributeName)}matchElementsInTree(e){const t=this.matchElement(e)?[e]:[],s=Array.from(e.querySelectorAll(this.selector));return t.concat(s)}elementMatched(e){this.delegate.elementMatchedAttribute&&this.delegate.elementMatchedAttribute(e,this.attributeName)}elementUnmatched(e){this.delegate.elementUnmatchedAttribute&&this.delegate.elementUnmatchedAttribute(e,this.attributeName)}elementAttributeChanged(e,t){this.delegate.elementAttributeValueChanged&&this.attributeName==t&&this.delegate.elementAttributeValueChanged(e,t)}}class d{constructor(e,t){this.element=e,this.delegate=t,this.started=!1,this.stringMap=new Map,this.mutationObserver=new MutationObserver((e=>this.processMutations(e)))}start(){this.started||(this.started=!0,this.mutationObserver.observe(this.element,{attributes:!0,attributeOldValue:!0}),this.refresh())}stop(){this.started&&(this.mutationObserver.takeRecords(),this.mutationObserver.disconnect(),this.started=!1)}refresh(){if(this.started)for(const e of this.knownAttributeNames)this.refreshAttribute(e,null)}processMutations(e){if(this.started)for(const t of e)this.processMutation(t)}processMutation(e){const t=e.attributeName;t&&this.refreshAttribute(t,e.oldValue)}refreshAttribute(e,t){const s=this.delegate.getStringMapKeyForAttribute(e);if(null!=s){this.stringMap.has(e)||this.stringMapKeyAdded(s,e);const r=this.element.getAttribute(e);if(this.stringMap.get(e)!=r&&this.stringMapValueChanged(r,s,t),null==r){const t=this.stringMap.get(e);this.stringMap.delete(e),t&&this.stringMapKeyRemoved(s,e,t)}else this.stringMap.set(e,r)}}stringMapKeyAdded(e,t){this.delegate.stringMapKeyAdded&&this.delegate.stringMapKeyAdded(e,t)}stringMapValueChanged(e,t,s){this.delegate.stringMapValueChanged&&this.delegate.stringMapValueChanged(e,t,s)}stringMapKeyRemoved(e,t,s){this.delegate.stringMapKeyRemoved&&this.delegate.stringMapKeyRemoved(e,t,s)}get knownAttributeNames(){return Array.from(new Set(this.currentAttributeNames.concat(this.recordedAttributeNames)))}get currentAttributeNames(){return Array.from(this.element.attributes).map((e=>e.name))}get recordedAttributeNames(){return Array.from(this.stringMap.keys())}}function g(e,t){let s=e.get(t);return s||(s=new Set,e.set(t,s)),s}class m{constructor(){this.valuesByKey=new Map}get keys(){return Array.from(this.valuesByKey.keys())}get values(){return Array.from(this.valuesByKey.values()).reduce(((e,t)=>e.concat(Array.from(t))),[])}get size(){return Array.from(this.valuesByKey.values()).reduce(((e,t)=>e+t.size),0)}add(e,t){!function(e,t,s){g(e,t).add(s)}(this.valuesByKey,e,t)}delete(e,t){!function(e,t,s){g(e,t).delete(s),function(e,t){const s=e.get(t);null!=s&&0==s.size&&e.delete(t)}(e,t)}(this.valuesByKey,e,t)}has(e,t){const s=this.valuesByKey.get(e);return null!=s&&s.has(t)}hasKey(e){return this.valuesByKey.has(e)}hasValue(e){return Array.from(this.valuesByKey.values()).some((t=>t.has(e)))}getValuesForKey(e){const t=this.valuesByKey.get(e);return t?Array.from(t):[]}getKeysForValue(e){return Array.from(this.valuesByKey).filter((([t,s])=>s.has(e))).map((([e,t])=>e))}}class p{constructor(e,t,s){this.attributeObserver=new u(e,t,this),this.delegate=s,this.tokensByElement=new m}get started(){return this.attributeObserver.started}start(){this.attributeObserver.start()}pause(e){this.attributeObserver.pause(e)}stop(){this.attributeObserver.stop()}refresh(){this.attributeObserver.refresh()}get element(){return this.attributeObserver.element}get attributeName(){return this.attributeObserver.attributeName}elementMatchedAttribute(e){this.tokensMatched(this.readTokensForElement(e))}elementAttributeValueChanged(e){const[t,s]=this.refreshTokensForElement(e);this.tokensUnmatched(t),this.tokensMatched(s)}elementUnmatchedAttribute(e){this.tokensUnmatched(this.tokensByElement.getValuesForKey(e))}tokensMatched(e){e.forEach((e=>this.tokenMatched(e)))}tokensUnmatched(e){e.forEach((e=>this.tokenUnmatched(e)))}tokenMatched(e){this.delegate.tokenMatched(e),this.tokensByElement.add(e.element,e)}tokenUnmatched(e){this.delegate.tokenUnmatched(e),this.tokensByElement.delete(e.element,e)}refreshTokensForElement(e){const t=this.tokensByElement.getValuesForKey(e),s=this.readTokensForElement(e),r=function(e,t){const s=Math.max(e.length,t.length);return Array.from({length:s},((s,r)=>[e[r],t[r]]))}(t,s).findIndex((([e,t])=>{return r=t,!((s=e)&&r&&s.index==r.index&&s.content==r.content);var s,r}));return-1==r?[[],[]]:[t.slice(r),s.slice(r)]}readTokensForElement(e){const t=this.attributeName;return function(e,t,s){return e.trim().split(/\s+/).filter((e=>e.length)).map(((e,r)=>({element:t,attributeName:s,content:e,index:r})))}(e.getAttribute(t)||"",e,t)}}class f{constructor(e,t,s){this.tokenListObserver=new p(e,t,this),this.delegate=s,this.parseResultsByToken=new WeakMap,this.valuesByTokenByElement=new WeakMap}get started(){return this.tokenListObserver.started}start(){this.tokenListObserver.start()}stop(){this.tokenListObserver.stop()}refresh(){this.tokenListObserver.refresh()}get element(){return this.tokenListObserver.element}get attributeName(){return this.tokenListObserver.attributeName}tokenMatched(e){const{element:t}=e,{value:s}=this.fetchParseResultForToken(e);s&&(this.fetchValuesByTokenForElement(t).set(e,s),this.delegate.elementMatchedValue(t,s))}tokenUnmatched(e){const{element:t}=e,{value:s}=this.fetchParseResultForToken(e);s&&(this.fetchValuesByTokenForElement(t).delete(e),this.delegate.elementUnmatchedValue(t,s))}fetchParseResultForToken(e){let t=this.parseResultsByToken.get(e);return t||(t=this.parseToken(e),this.parseResultsByToken.set(e,t)),t}fetchValuesByTokenForElement(e){let t=this.valuesByTokenByElement.get(e);return t||(t=new Map,this.valuesByTokenByElement.set(e,t)),t}parseToken(e){try{return{value:this.delegate.parseValueForToken(e)}}catch(e){return{error:e}}}}class b{constructor(e,t){this.context=e,this.delegate=t,this.bindingsByAction=new Map}start(){this.valueListObserver||(this.valueListObserver=new f(this.element,this.actionAttribute,this),this.valueListObserver.start())}stop(){this.valueListObserver&&(this.valueListObserver.stop(),delete this.valueListObserver,this.disconnectAllActions())}get element(){return this.context.element}get identifier(){return this.context.identifier}get actionAttribute(){return this.schema.actionAttribute}get schema(){return this.context.schema}get bindings(){return Array.from(this.bindingsByAction.values())}connectAction(e){const t=new l(this.context,e);this.bindingsByAction.set(e,t),this.delegate.bindingConnected(t)}disconnectAction(e){const t=this.bindingsByAction.get(e);t&&(this.bindingsByAction.delete(e),this.delegate.bindingDisconnected(t))}disconnectAllActions(){this.bindings.forEach((e=>this.delegate.bindingDisconnected(e))),this.bindingsByAction.clear()}parseValueForToken(e){const t=class{constructor(e,t,s){this.element=e,this.index=t,this.eventTarget=s.eventTarget||e,this.eventName=s.eventName||function(e){const t=e.tagName.toLowerCase();if(t in o)return o[t](e)}(e)||a("missing event name"),this.eventOptions=s.eventOptions||{},this.identifier=s.identifier||a("missing identifier"),this.methodName=s.methodName||a("missing method name")}static forToken(e){return new this(e.element,e.index,function(e){const t=e.trim().match(s)||[];return{eventTarget:(r=t[4],"window"==r?window:"document"==r?document:void 0),eventName:t[2],eventOptions:t[9]?(n=t[9],n.split(":").reduce(((e,t)=>Object.assign(e,{[t.replace(/^!/,"")]:!/^!/.test(t)})),{})):{},identifier:t[5],methodName:t[7]};var r,n}(e.content))}toString(){const e=this.eventTargetName?`@${this.eventTargetName}`:"";return`${this.eventName}${e}->${this.identifier}#${this.methodName}`}get params(){return this.eventTarget instanceof Element?this.getParamsFromEventTargetAttributes(this.eventTarget):{}}getParamsFromEventTargetAttributes(e){const t={},s=new RegExp(`^data-${this.identifier}-(.+)-param$`);return Array.from(e.attributes).forEach((({name:e,value:n})=>{const i=e.match(s),o=i&&i[1];o&&Object.assign(t,{[r(o)]:c(n)})})),t}get eventTargetName(){return(e=this.eventTarget)==window?"window":e==document?"document":void 0;var e}}.forToken(e);if(t.identifier==this.identifier)return t}elementMatchedValue(e,t){this.connectAction(t)}elementUnmatchedValue(e,t){this.disconnectAction(t)}}class v{constructor(e,t){this.context=e,this.receiver=t,this.stringMapObserver=new d(this.element,this),this.valueDescriptorMap=this.controller.valueDescriptorMap,this.invokeChangedCallbacksForDefaultValues()}start(){this.stringMapObserver.start()}stop(){this.stringMapObserver.stop()}get element(){return this.context.element}get controller(){return this.context.controller}getStringMapKeyForAttribute(e){if(e in this.valueDescriptorMap)return this.valueDescriptorMap[e].name}stringMapKeyAdded(e,t){const s=this.valueDescriptorMap[t];this.hasValue(e)||this.invokeChangedCallback(e,s.writer(this.receiver[e]),s.writer(s.defaultValue))}stringMapValueChanged(e,t,s){const r=this.valueDescriptorNameMap[t];null!==e&&(null===s&&(s=r.writer(r.defaultValue)),this.invokeChangedCallback(t,e,s))}stringMapKeyRemoved(e,t,s){const r=this.valueDescriptorNameMap[e];this.hasValue(e)?this.invokeChangedCallback(e,r.writer(this.receiver[e]),s):this.invokeChangedCallback(e,r.writer(r.defaultValue),s)}invokeChangedCallbacksForDefaultValues(){for(const{key:e,name:t,defaultValue:s,writer:r}of this.valueDescriptors)null==s||this.controller.data.has(e)||this.invokeChangedCallback(t,r(s),void 0)}invokeChangedCallback(e,t,s){const r=`${e}Changed`,n=this.receiver[r];if("function"==typeof n){const r=this.valueDescriptorNameMap[e],i=r.reader(t);let o=s;s&&(o=r.reader(s)),n.call(this.receiver,i,o)}}get valueDescriptors(){const{valueDescriptorMap:e}=this;return Object.keys(e).map((t=>e[t]))}get valueDescriptorNameMap(){const e={};return Object.keys(this.valueDescriptorMap).forEach((t=>{const s=this.valueDescriptorMap[t];e[s.name]=s})),e}hasValue(e){const t=`has${n(this.valueDescriptorNameMap[e].name)}`;return this.receiver[t]}}class y{constructor(e,t){this.context=e,this.delegate=t,this.targetsByName=new m}start(){this.tokenListObserver||(this.tokenListObserver=new p(this.element,this.attributeName,this),this.tokenListObserver.start())}stop(){this.tokenListObserver&&(this.disconnectAllTargets(),this.tokenListObserver.stop(),delete this.tokenListObserver)}tokenMatched({element:e,content:t}){this.scope.containsElement(e)&&this.connectTarget(e,t)}tokenUnmatched({element:e,content:t}){this.disconnectTarget(e,t)}connectTarget(e,t){var s;this.targetsByName.has(t,e)||(this.targetsByName.add(t,e),null===(s=this.tokenListObserver)||void 0===s||s.pause((()=>this.delegate.targetConnected(e,t))))}disconnectTarget(e,t){var s;this.targetsByName.has(t,e)&&(this.targetsByName.delete(t,e),null===(s=this.tokenListObserver)||void 0===s||s.pause((()=>this.delegate.targetDisconnected(e,t))))}disconnectAllTargets(){for(const e of this.targetsByName.keys)for(const t of this.targetsByName.getValuesForKey(e))this.disconnectTarget(t,e)}get attributeName(){return`data-${this.context.identifier}-target`}get element(){return this.context.element}get scope(){return this.context.scope}}class A{constructor(e,t){this.logDebugActivity=(e,t={})=>{const{identifier:s,controller:r,element:n}=this;t=Object.assign({identifier:s,controller:r,element:n},t),this.application.logDebugActivity(this.identifier,e,t)},this.module=e,this.scope=t,this.controller=new e.controllerConstructor(this),this.bindingObserver=new b(this,this.dispatcher),this.valueObserver=new v(this,this.controller),this.targetObserver=new y(this,this);try{this.controller.initialize(),this.logDebugActivity("initialize")}catch(e){this.handleError(e,"initializing controller")}}connect(){this.bindingObserver.start(),this.valueObserver.start(),this.targetObserver.start();try{this.controller.connect(),this.logDebugActivity("connect")}catch(e){this.handleError(e,"connecting controller")}}disconnect(){try{this.controller.disconnect(),this.logDebugActivity("disconnect")}catch(e){this.handleError(e,"disconnecting controller")}this.targetObserver.stop(),this.valueObserver.stop(),this.bindingObserver.stop()}get application(){return this.module.application}get identifier(){return this.module.identifier}get schema(){return this.application.schema}get dispatcher(){return this.application.dispatcher}get element(){return this.scope.element}get parentElement(){return this.element.parentElement}handleError(e,t,s={}){const{identifier:r,controller:n,element:i}=this;s=Object.assign({identifier:r,controller:n,element:i},s),this.application.handleError(e,`Error ${t}`,s)}targetConnected(e,t){this.invokeControllerMethod(`${t}TargetConnected`,e)}targetDisconnected(e,t){this.invokeControllerMethod(`${t}TargetDisconnected`,e)}invokeControllerMethod(e,...t){const s=this.controller;"function"==typeof s[e]&&s[e](...t)}}function E(e,t){const s=O(e);return Array.from(s.reduce(((e,s)=>(function(e,t){const s=e[t];return Array.isArray(s)?s:[]}(s,t).forEach((t=>e.add(t))),e)),new Set))}function O(e){const t=[];for(;e;)t.push(e),e=Object.getPrototypeOf(e);return t.reverse()}const w="function"==typeof Object.getOwnPropertySymbols?e=>[...Object.getOwnPropertyNames(e),...Object.getOwnPropertySymbols(e)]:Object.getOwnPropertyNames,k=(()=>{function e(e){function t(){return Reflect.construct(e,arguments,new.target)}return t.prototype=Object.create(e.prototype,{constructor:{value:t}}),Reflect.setPrototypeOf(t,e),t}try{return function(){const t=e((function(){this.a.call(this)}));t.prototype.a=function(){},new t}(),e}catch(e){return e=>class extends e{}}})();class M{constructor(e,t){this.application=e,this.definition=function(e){return{identifier:e.identifier,controllerConstructor:(t=e.controllerConstructor,function(e,t){const s=k(e),r=function(e,t){return w(t).reduce(((s,r)=>{const n=function(e,t,s){const r=Object.getOwnPropertyDescriptor(e,s);if(!r||!("value"in r)){const e=Object.getOwnPropertyDescriptor(t,s).value;return r&&(e.get=r.get||e.get,e.set=r.set||e.set),e}}(e,t,r);return n&&Object.assign(s,{[r]:n}),s}),{})}(e.prototype,t);return Object.defineProperties(s.prototype,r),s}(t,function(e){return E(e,"blessings").reduce(((t,s)=>{const r=s(e);for(const e in r){const s=t[e]||{};t[e]=Object.assign(s,r[e])}return t}),{})}(t)))};var t}(t),this.contextsByScope=new WeakMap,this.connectedContexts=new Set}get identifier(){return this.definition.identifier}get controllerConstructor(){return this.definition.controllerConstructor}get contexts(){return Array.from(this.connectedContexts)}connectContextForScope(e){const t=this.fetchContextForScope(e);this.connectedContexts.add(t),t.connect()}disconnectContextForScope(e){const t=this.contextsByScope.get(e);t&&(this.connectedContexts.delete(t),t.disconnect())}fetchContextForScope(e){let t=this.contextsByScope.get(e);return t||(t=new A(this,e),this.contextsByScope.set(e,t)),t}}class T{constructor(e){this.scope=e}has(e){return this.data.has(this.getDataKey(e))}get(e){return this.getAll(e)[0]}getAll(e){return(this.data.get(this.getDataKey(e))||"").match(/[^\s]+/g)||[]}getAttributeName(e){return this.data.getAttributeNameForKey(this.getDataKey(e))}getDataKey(e){return`${e}-class`}get data(){return this.scope.data}}class N{constructor(e){this.scope=e}get element(){return this.scope.element}get identifier(){return this.scope.identifier}get(e){const t=this.getAttributeNameForKey(e);return this.element.getAttribute(t)}set(e,t){const s=this.getAttributeNameForKey(e);return this.element.setAttribute(s,t),this.get(e)}has(e){const t=this.getAttributeNameForKey(e);return this.element.hasAttribute(t)}delete(e){if(this.has(e)){const t=this.getAttributeNameForKey(e);return this.element.removeAttribute(t),!0}return!1}getAttributeNameForKey(e){return`data-${this.identifier}-${i(e)}`}}class C{constructor(e){this.warnedKeysByObject=new WeakMap,this.logger=e}warn(e,t,s){let r=this.warnedKeysByObject.get(e);r||(r=new Set,this.warnedKeysByObject.set(e,r)),r.has(t)||(r.add(t),this.logger.warn(s,e))}}function B(e,t){return`[${e}~="${t}"]`}class F{constructor(e){this.scope=e}get element(){return this.scope.element}get identifier(){return this.scope.identifier}get schema(){return this.scope.schema}has(e){return null!=this.find(e)}find(...e){return e.reduce(((e,t)=>e||this.findTarget(t)||this.findLegacyTarget(t)),void 0)}findAll(...e){return e.reduce(((e,t)=>[...e,...this.findAllTargets(t),...this.findAllLegacyTargets(t)]),[])}findTarget(e){const t=this.getSelectorForTargetName(e);return this.scope.findElement(t)}findAllTargets(e){const t=this.getSelectorForTargetName(e);return this.scope.findAllElements(t)}getSelectorForTargetName(e){return B(this.schema.targetAttributeForScope(this.identifier),e)}findLegacyTarget(e){const t=this.getLegacySelectorForTargetName(e);return this.deprecate(this.scope.findElement(t),e)}findAllLegacyTargets(e){const t=this.getLegacySelectorForTargetName(e);return this.scope.findAllElements(t).map((t=>this.deprecate(t,e)))}getLegacySelectorForTargetName(e){const t=`${this.identifier}.${e}`;return B(this.schema.targetAttribute,t)}deprecate(e,t){if(e){const{identifier:s}=this,r=this.schema.targetAttribute,n=this.schema.targetAttributeForScope(s);this.guide.warn(e,`target:${t}`,`Please replace ${r}="${s}.${t}" with ${n}="${t}". The ${r} attribute is deprecated and will be removed in a future version of Stimulus.`)}return e}get guide(){return this.scope.guide}}class S{constructor(e,t,s,r){this.targets=new F(this),this.classes=new T(this),this.data=new N(this),this.containsElement=e=>e.closest(this.controllerSelector)===this.element,this.schema=e,this.element=t,this.identifier=s,this.guide=new C(r)}findElement(e){return this.element.matches(e)?this.element:this.queryElements(e).find(this.containsElement)}findAllElements(e){return[...this.element.matches(e)?[this.element]:[],...this.queryElements(e).filter(this.containsElement)]}queryElements(e){return Array.from(this.element.querySelectorAll(e))}get controllerSelector(){return B(this.schema.controllerAttribute,this.identifier)}}class ${constructor(e,t,s){this.element=e,this.schema=t,this.delegate=s,this.valueListObserver=new f(this.element,this.controllerAttribute,this),this.scopesByIdentifierByElement=new WeakMap,this.scopeReferenceCounts=new WeakMap}start(){this.valueListObserver.start()}stop(){this.valueListObserver.stop()}get controllerAttribute(){return this.schema.controllerAttribute}parseValueForToken(e){const{element:t,content:s}=e,r=this.fetchScopesByIdentifierForElement(t);let n=r.get(s);return n||(n=this.delegate.createScopeForElementAndIdentifier(t,s),r.set(s,n)),n}elementMatchedValue(e,t){const s=(this.scopeReferenceCounts.get(t)||0)+1;this.scopeReferenceCounts.set(t,s),1==s&&this.delegate.scopeConnected(t)}elementUnmatchedValue(e,t){const s=this.scopeReferenceCounts.get(t);s&&(this.scopeReferenceCounts.set(t,s-1),1==s&&this.delegate.scopeDisconnected(t))}fetchScopesByIdentifierForElement(e){let t=this.scopesByIdentifierByElement.get(e);return t||(t=new Map,this.scopesByIdentifierByElement.set(e,t)),t}}class x{constructor(e){this.application=e,this.scopeObserver=new $(this.element,this.schema,this),this.scopesByIdentifier=new m,this.modulesByIdentifier=new Map}get element(){return this.application.element}get schema(){return this.application.schema}get logger(){return this.application.logger}get controllerAttribute(){return this.schema.controllerAttribute}get modules(){return Array.from(this.modulesByIdentifier.values())}get contexts(){return this.modules.reduce(((e,t)=>e.concat(t.contexts)),[])}start(){this.scopeObserver.start()}stop(){this.scopeObserver.stop()}loadDefinition(e){this.unloadIdentifier(e.identifier);const t=new M(this.application,e);this.connectModule(t)}unloadIdentifier(e){const t=this.modulesByIdentifier.get(e);t&&this.disconnectModule(t)}getContextForElementAndIdentifier(e,t){const s=this.modulesByIdentifier.get(t);if(s)return s.contexts.find((t=>t.element==e))}handleError(e,t,s){this.application.handleError(e,t,s)}createScopeForElementAndIdentifier(e,t){return new S(this.schema,e,t,this.logger)}scopeConnected(e){this.scopesByIdentifier.add(e.identifier,e);const t=this.modulesByIdentifier.get(e.identifier);t&&t.connectContextForScope(e)}scopeDisconnected(e){this.scopesByIdentifier.delete(e.identifier,e);const t=this.modulesByIdentifier.get(e.identifier);t&&t.disconnectContextForScope(e)}connectModule(e){this.modulesByIdentifier.set(e.identifier,e),this.scopesByIdentifier.getValuesForKey(e.identifier).forEach((t=>e.connectContextForScope(t)))}disconnectModule(e){this.modulesByIdentifier.delete(e.identifier),this.scopesByIdentifier.getValuesForKey(e.identifier).forEach((t=>e.disconnectContextForScope(t)))}}const L={controllerAttribute:"data-controller",actionAttribute:"data-action",targetAttribute:"data-target",targetAttributeForScope:e=>`data-${e}-target`};class V{constructor(e=document.documentElement,s=L){this.logger=console,this.debug=!1,this.logDebugActivity=(e,t,s={})=>{this.debug&&this.logFormattedMessage(e,t,s)},this.element=e,this.schema=s,this.dispatcher=new t(this),this.router=new x(this)}static start(e,t){const s=new V(e,t);return s.start(),s}async start(){await new Promise((e=>{"loading"==document.readyState?document.addEventListener("DOMContentLoaded",(()=>e())):e()})),this.logDebugActivity("application","starting"),this.dispatcher.start(),this.router.start(),this.logDebugActivity("application","start")}stop(){this.logDebugActivity("application","stopping"),this.dispatcher.stop(),this.router.stop(),this.logDebugActivity("application","stop")}register(e,t){t.shouldLoad&&this.load({identifier:e,controllerConstructor:t})}load(e,...t){(Array.isArray(e)?e:[e,...t]).forEach((e=>this.router.loadDefinition(e)))}unload(e,...t){(Array.isArray(e)?e:[e,...t]).forEach((e=>this.router.unloadIdentifier(e)))}get controllers(){return this.router.contexts.map((e=>e.controller))}getControllerForElementAndIdentifier(e,t){const s=this.router.getContextForElementAndIdentifier(e,t);return s?s.controller:null}handleError(e,t,s){var r;this.logger.error("%s\n\n%o\n\n%o",t,e,s),null===(r=window.onerror)||void 0===r||r.call(window,t,"",0,0,e)}logFormattedMessage(e,t,s={}){s=Object.assign({application:this},s),this.logger.groupCollapsed(`${e} #${t}`),this.logger.log("details:",Object.assign({},s)),this.logger.groupEnd()}}function D([e,t]){return function(e,t){const s=`${i(e)}-value`,n=function(e){const t=function(e){const t=K(e.type);if(t){const s=j(e.default);if(t!==s)throw new Error(`Type "${t}" must match the type of the default value. Given default value: "${e.default}" as "${s}"`);return t}}(e),s=j(e),r=K(e),n=t||s||r;if(n)return n;throw new Error(`Unknown value type "${e}"`)}(t);return{type:n,key:s,name:r(s),get defaultValue(){return function(e){const t=K(e);if(t)return I[t];const s=e.default;return void 0!==s?s:e}(t)},get hasCustomDefaultValue(){return void 0!==j(t)},reader:R[n],writer:P[n]||P.default}}(e,t)}function K(e){switch(e){case Array:return"array";case Boolean:return"boolean";case Number:return"number";case Object:return"object";case String:return"string"}}function j(e){switch(typeof e){case"boolean":return"boolean";case"number":return"number";case"string":return"string"}return Array.isArray(e)?"array":"[object Object]"===Object.prototype.toString.call(e)?"object":void 0}const I={get array(){return[]},boolean:!1,number:0,get object(){return{}},string:""},R={array(e){const t=JSON.parse(e);if(!Array.isArray(t))throw new TypeError("Expected array");return t},boolean:e=>!("0"==e||"false"==e),number:e=>Number(e),object(e){const t=JSON.parse(e);if(null===t||"object"!=typeof t||Array.isArray(t))throw new TypeError("Expected object");return t},string:e=>e},P={default:function(e){return`${e}`},array:U,object:U};function U(e){return JSON.stringify(e)}class q{constructor(e){this.context=e}static get shouldLoad(){return!0}get application(){return this.context.application}get scope(){return this.context.scope}get element(){return this.scope.element}get identifier(){return this.scope.identifier}get targets(){return this.scope.targets}get classes(){return this.scope.classes}get data(){return this.scope.data}initialize(){}connect(){}disconnect(){}dispatch(e,{target:t=this.element,detail:s={},prefix:r=this.identifier,bubbles:n=!0,cancelable:i=!0}={}){const o=new CustomEvent(r?`${r}:${e}`:e,{detail:s,bubbles:n,cancelable:i});return t.dispatchEvent(o),o}}q.blessings=[function(e){return E(e,"classes").reduce(((e,t)=>{return Object.assign(e,{[`${s=t}Class`]:{get(){const{classes:e}=this;if(e.has(s))return e.get(s);{const t=e.getAttributeName(s);throw new Error(`Missing attribute "${t}"`)}}},[`${s}Classes`]:{get(){return this.classes.getAll(s)}},[`has${n(s)}Class`]:{get(){return this.classes.has(s)}}});var s}),{})},function(e){return E(e,"targets").reduce(((e,t)=>{return Object.assign(e,{[`${s=t}Target`]:{get(){const e=this.targets.find(s);if(e)return e;throw new Error(`Missing target element "${s}" for "${this.identifier}" controller`)}},[`${s}Targets`]:{get(){return this.targets.findAll(s)}},[`has${n(s)}Target`]:{get(){return this.targets.has(s)}}});var s}),{})},function(e){const t=function(e,t){return O(e).reduce(((e,s)=>(e.push(...function(e,t){const s=e[t];return s?Object.keys(s).map((e=>[e,s[e]])):[]}(s,t)),e)),[])}(e,"values"),s={valueDescriptorMap:{get(){return t.reduce(((e,t)=>{const s=D(t),r=this.data.getAttributeNameForKey(s.key);return Object.assign(e,{[r]:s})}),{})}}};return t.reduce(((e,t)=>Object.assign(e,function(e){const t=D(e),{key:s,name:r,reader:i,writer:o}=t;return{[r]:{get(){const e=this.data.get(s);return null!==e?i(e):t.defaultValue},set(e){void 0===e?this.data.delete(s):this.data.set(s,o(e))}},[`has${n(r)}`]:{get(){return this.data.has(s)||t.hasCustomDefaultValue}}}}(t))),s)}],q.targets=[],q.values={};const z=class extends q{static values={debug:{type:Boolean,default:!1}};connect(){let e=[];document.querySelectorAll("[data-toggler-name], [data-toggler-tab]").forEach((t=>{e.push(t)})),this.debugValue&&console.log("connect - toggle classes - ",e),this.toggleClasses(e)}hideOutside(e){let t=[];document.querySelectorAll("[data-toggler-hide-outside]").forEach((s=>{s.contains(e.target)&&(t=t.concat(s.getAttribute("data-toggler-hide-outside")?.split(" ")||[]))})),this.debugValue&&console.log("hideOutside - in_targets - ",t);let s=[];document.querySelectorAll("[data-toggler-hide-outside]").forEach((e=>{(e.getAttribute("data-toggler-hide-outside")?.split(" ")||[]).forEach((e=>{t.includes(e)||s.includes(e)||(document.querySelectorAll(`[data-toggler-name="${e}"]`).forEach((e=>e.toggleAttribute("data-toggler-open",!1))),this.toggleClasses([e]),this.debugValue&&console.log("hideOutside - to_hide - ",e)),s.includes(e)||(s.push(e),this.debugValue&&console.log("hideOutside - already_analyzed_to_hide - ",s))}))}))}all(e){this.debugValue&&console.log("all - event.currentTarget - ",e.currentTarget);let t=this.toggleOpenValues(e.currentTarget,"all");this.toggleClasses(t)}show(e){this.debugValue&&console.log("show - event.currentTarget - ",e.currentTarget);let t=this.toggleOpenValues(e.currentTarget,"show");this.toggleClasses(t)}hide(e){this.debugValue&&console.log("hide - event.currentTarget - ",e.currentTarget);let t=this.toggleOpenValues(e.currentTarget,"hide");this.toggleClasses(t)}toggle(e){this.debugValue&&console.log("toggle - event.currentTarget - ",e.currentTarget);let t=this.toggleOpenValues(e.currentTarget,"toggle");this.toggleClasses(t)}toggleOpenValues(e,t="all"){let s=["all","show"].includes(t)&&e.dataset?.togglerShow?e.dataset?.togglerShow:null,r=["all","hide"].includes(t)&&e.dataset?.togglerHide?e.dataset?.togglerHide:null,n=["all","toggle"].includes(t)&&e.dataset?.togglerToggle?e.dataset?.togglerToggle:null,i=["all"].includes(t)&&e.dataset?.togglerTab?e.dataset?.togglerTab:null,o=s?.split(" ")||[],a=r?.split(" ")||[],c=n?.split(" ")||[];return(i?.split(" ")||[]).forEach((t=>{document.querySelectorAll(`[data-toggler-tab="${t}"]`).forEach((t=>{t.isEqualNode(e)?(e.toggleAttribute("data-toggler-open",!0),o=o.concat(e)):(t.toggleAttribute("data-toggler-open",!1),a=a.concat(t,t.dataset?.togglerShow?.split(" ")||[]))}))})),o.forEach((e=>document.querySelectorAll(`[data-toggler-name="${e}"]`).forEach((e=>e.toggleAttribute("data-toggler-open",!0))))),a.forEach((e=>document.querySelectorAll(`[data-toggler-name="${e}"]`).forEach((e=>e.toggleAttribute("data-toggler-open",!1))))),c.forEach((e=>document.querySelectorAll(`[data-toggler-name="${e}"]`).forEach((e=>e.toggleAttribute("data-toggler-open"))))),[...o,...a,...c]}toggleClasses(e){e.forEach((e=>{("string"==typeof e?document.querySelectorAll(`[data-toggler-name="${e}"]`)||[]:[e]).forEach((e=>{let t=e.dataset?.togglerOffClass||"",s=e.dataset?.togglerOnClass||"";""==t&&""==s&&(t="hidden"),t&&!/^\s*$/.test(t)&&(this.fireEvents(e,"togglerEventsOffBefore"),t.split(" ").forEach((t=>{e.classList.toggle(t,!e.hasAttribute("data-toggler-open"))})),this.fireEvents(e,"togglerEventsOff"),this.fireEvents(e,"togglerEventsOffAfter")),s&&!/^\s*$/.test(s)&&(this.fireEvents(e,"togglerEventsOnBefore"),s.split(" ").forEach((t=>{e.classList.toggle(t,e.hasAttribute("data-toggler-open"))})),this.fireEvents(e,"togglerEventsOn"),this.fireEvents(e,"togglerEventsOnAfter")),this.fireEvents(e,"togglerEvents")}))}))}fireEvents(e,t){if(!e.dataset)return;let s=e.dataset[t]||"";s&&!/^\s*$/.test(s)&&s.split(" ").forEach((t=>{let r=this.dispatch(t,{detail:{content:e}});this.debugValue&&console.log("fireEvents dispatched",e,s,t,r)}))}};window.stimulus=V.start(),stimulus.register("toggler",z)})();