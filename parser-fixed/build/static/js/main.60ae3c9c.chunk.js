(this["webpackJsonpparser-fixed"]=this["webpackJsonpparser-fixed"]||[]).push([[0],{18:function(t,e,n){},20:function(t,e,n){"use strict";n.r(e);var r=n(1),a=n.n(r),s=n(12),c=n.n(s),i=(n(18),n(2)),u=n(3),o=n(8),l=n(7),h=n(6),p=n(0),f=function(t){Object(l.a)(n,t);var e=Object(h.a)(n);function n(){return Object(i.a)(this,n),e.apply(this,arguments)}return Object(u.a)(n,[{key:"onchange",value:function(t){var e=t.target.value;this.props.onchange(e)}},{key:"render",value:function(){var t=this;return Object(p.jsx)("div",{className:"textarea_outer",children:Object(p.jsx)("textarea",{maxLength:30,"data-gramm":"false",placeholder:this.props.placeholder,onChange:function(e){return t.onchange(e)}})})}}]),n}(a.a.Component),d=f,j=function(t){Object(l.a)(n,t);var e=Object(h.a)(n);function n(){return Object(i.a)(this,n),e.apply(this,arguments)}return Object(u.a)(n,[{key:"render",value:function(){var t=this.props,e=t.pattStr,n=t.testStr;return Object(p.jsxs)("tr",{className:"output_row",children:[Object(p.jsx)("td",{children:e?"/".concat(e,"/"):"(empty)"}),Object(p.jsx)("td",{children:n?'"'.concat(n,'"'):"(empty)"}),Object(p.jsx)("td",{className:"success_"+this.props.success,children:this.props.success?"Accept":"Reject"})]})}}]),n}(a.a.Component),b=j,O=function(t){Object(l.a)(n,t);var e=Object(h.a)(n);function n(t){var r;return Object(i.a)(this,n),(r=e.call(this,t)).state={propsList:[]},r.addToList=r.addToList.bind(Object(o.a)(r)),r.props.setAddToList(r.addToList),r}return Object(u.a)(n,[{key:"addToList",value:function(t){var e=this.state.propsList;e.unshift(t),this.setState({propsList:e})}},{key:"render",value:function(){return this.state.propsList.map((function(t){var e=t.pattStr,n=t.testStr,r=t.success;return Object(p.jsx)(b,{pattStr:e,testStr:n,success:r})}))}}]),n}(a.a.Component),v=function(t){Object(l.a)(n,t);var e=Object(h.a)(n);function n(t){var r;Object(i.a)(this,n),r=e.call(this,t);var a=t.pattStr,s=t.testStr,c=t.success;return r.state={outputList:[{pattStr:a,testStr:s,success:c}],addToList:function(t){return 0}},r}return Object(u.a)(n,[{key:"addToList",value:function(t){return this.state.addToList(t)}},{key:"render",value:function(){var t=this,e=this.props,n=e.pattStr,r=e.testStr,a=e.success;return Object(p.jsxs)("table",{id:"displayTable",children:[Object(p.jsx)(b,{pattStr:n,testStr:r,success:a}),Object(p.jsx)(O,{setAddToList:function(e){t.setState({addToList:e}),t.props.setAddToList(e)}})]})}}]),n}(a.a.Component),y=n(4),S=n(13),g=n(5);Array.prototype.unique=function(){return Object(g.a)(new Set(this))},Array.prototype.deepReverse=function(){return this.reverse().map((function(t){return Array.isArray(t)?t.deepReverse():t}))},Object.prototype.complexmap=function(t){for(var e={},n=0,r=0,a=Object.entries(this);r<a.length;r++){var s=Object(S.a)(a[r],2),c=s[0],i=s[1];this.hasOwnProperty(c)&&(e[c]=t(i,c,n++))}return e};var m=function(t){function e(t){Object(i.a)(this,e),this.charList=[],this.charList=(t+e.EPSILON_CHAR).split("").filter((function(t){return!e.OPS.has(t)})).unique()}return Object(u.a)(e,[{key:"debug",value:function(){console.log("Alphabet: '"+this.charList.join("', '")+"'")}},{key:"getCharList",value:function(){return this.charList.join("")}},{key:"has",value:function(t){if(1!==t.length)throw new Error("chars can only be of length 1");return this.charList.indexOf(t)>=0}},{key:"equals",value:function(t){return this.getCharList()===t.getCharList()}},{key:t,value:function(){var t=this,e=0,n=this.charList.length;return{next:function(){return{done:n===e+1,value:t.charList[e++]}}}}},{key:"getRowTemplate",value:function(){return Object.fromEntries(this.charList.map((function(t){return[t,[]]})))}}],[{key:"union",value:function(t,n){return new e(t.getCharList()+n.getCharList())}}]),e}(Symbol.iterator);m.OPS=new Set("*()|~".split("")),m.EPSILON_CHAR="%",m.EMPTY=new m("");var L,x=function(){function t(e,n,r,a){Object(i.a)(this,t),this.sigma=e,this.delta=n,this.start=r,this.accept=a,this.size=void 0,this.size=this.delta.length}return Object(u.a)(t,[{key:"follow",value:function(t,e){var n=this;return t.map((function(t){return n.delta[t][e]||[]})).filter((function(t){return t&&t.length>0})).flat()}},{key:"fixEpsilonClosure",value:function(){for(var t=0;t<this.size;t++){for(var e=[],n=Object(g.a)(this.follow([t],m.EPSILON_CHAR)).unique();n.length!==e.length;)e=n,n=[].concat(Object(g.a)(e),Object(g.a)(this.follow(e,m.EPSILON_CHAR))).unique();this.delta[t][m.EPSILON_CHAR]=n}}},{key:"eval",value:function(t){for(var e,n=t.split(""),r=[this.start];;){e=[].concat(Object(g.a)(r),Object(g.a)(this.follow(r,m.EPSILON_CHAR)));var a=n.shift();if(void 0===a){r=e;break}e=this.follow(e,a),r=e}return this.accept.some((function(t){return r.indexOf(t)>-1}))}}],[{key:"CHAR",value:function(e){var n,r;return new t(new m(e),[(n={},Object(y.a)(n,e,[1]),Object(y.a)(n,m.EPSILON_CHAR,[]),n),(r={},Object(y.a)(r,e,[]),Object(y.a)(r,m.EPSILON_CHAR,[]),r)],0,[1])}},{key:"reindexDelta",value:function(t,e){return t.map((function(t){return t.complexmap((function(t,n){return t.map((function(t){return t+e}))}))}))}},{key:"copyDelta",value:function(e){return t.reindexDelta(e,0)}},{key:"prepareOperations",value:function(e,n){var r=m.union(e.sigma,n.sigma),a=r.getRowTemplate(),s=e.size,c=t.reindexDelta(n.delta,s);return{sigma:r,deltaRowTemplate:a,shiftSize:s,aDelta:t.reindexDelta(e.delta,0),bDelta:c}}},{key:"union",value:function(e,n){var r=t.prepareOperations(e,n),a=r.sigma,s=r.deltaRowTemplate,c=r.shiftSize,i=r.aDelta,u=r.bDelta,o=n.accept.map((function(t){return t+c})),l=Object(y.a)({},m.EPSILON_CHAR,[e.start,n.start+c]),h=[].concat(Object(g.a)(i),Object(g.a)(u),[l,{}]).map((function(t){return Object.assign({},s,t)}));[].concat(Object(g.a)(o),Object(g.a)(e.accept)).forEach((function(t){h[t][m.EPSILON_CHAR].push(e.size+n.size+1)}));var p=e.size+n.size;return new t(a,h,p,[e.size+n.size+1])}},{key:"concatenate",value:function(e,n){var r=t.prepareOperations(e,n),a=r.sigma,s=r.deltaRowTemplate,c=r.shiftSize,i=r.aDelta,u=r.bDelta,o=n.accept.map((function(t){return t+c})),l=n.start+c,h=[].concat(Object(g.a)(i),Object(g.a)(u)).map((function(t){return Object.assign({},s,t)}));return e.accept.forEach((function(t){h[t][m.EPSILON_CHAR].push(l)})),new t(a,h,e.start,o)}},{key:"star",value:function(e){var n=t.EMPTY(),r=t.prepareOperations(n,e),a=r.sigma,s=r.deltaRowTemplate,c=Object(y.a)({},m.EPSILON_CHAR,[e.start]),i=Object(y.a)({},m.EPSILON_CHAR,[e.start]),u=[].concat(Object(g.a)(e.delta),[c,i]).map((function(t){return Object.assign({},s,t)}));return e.accept.forEach((function(t){u[t][m.EPSILON_CHAR].push(e.size+1)})),new t(a,u,e.size,[0,e.size+1])}},{key:"maybe",value:function(e){return this.union(e,t.EPSILON())}},{key:"some",value:function(t){return this.concatenate(t,this.star(t))}}]),t}();x.EPSILON=function(){return new x(m.EMPTY,[Object(y.a)({},m.EPSILON_CHAR,[])],0,[0])},x.EMPTY=function(){return new x(m.EMPTY,[],-12345678,[])};var k=(L={},Object(y.a)(L,"|",{precd:1,astv:"left",arity:2}),Object(y.a)(L,"*",{precd:4,astv:"right",arity:1}),Object(y.a)(L,"&",{precd:2,astv:"right",arity:2}),Object(y.a)(L,"?",{precd:3,astv:"left",arity:1}),Object(y.a)(L,"+",{precd:3,astv:"left",arity:1}),L),E=function(t){var e,n=[],r=[],a=function(){return r[r.length-1]},s=function(t){var e=a();if(!e||"("===e)return!1;var n,r,s=(n=e,r=t,String.prototype.localeCompare.call(k[n].precd,""+k[r].precd));return 1===s||0===s&&"left"===k[t].astv},c=[],i=0,u=50;if(t.split("").forEach((function(t){if(u)switch(t){case"*":case"?":case"+":for(n.unshift("x");s(t)&&u--;)n.unshift(r.pop());c[i]=!0,n.unshift(t);break;case"|":for(;s(t)&&u--;)n.unshift(r.pop());c[i]=!1,r.push(t);break;case"(":r.push(t),i++,c[i]=!1;break;case")":for(;"("!==a()&&u--;)n.unshift(r.pop());i--,r.pop(),c[i]&&r.push("&"),c[i]=!0;break;default:n.unshift(t),c[i]&&r.push("&"),c[i]=!0}})),!u)return"";for(;e=r.pop();)n.unshift(e);return n.reverse().join("")},w=function t(e){if("string"==typeof e)return x.CHAR(e);switch(e.op){case"|":return x.union(t(e.els[0]),t(e.els[1]));case"*":return x.star(t(e.els[0]));case"?":return x.maybe(t(e.els[0]));case"+":return x.some(t(e.els[0]));case"&":return x.concatenate(t(e.els[0]),t(e.els[1]))}return x.CHAR("")},C=function(t){try{var e=E(t),n=function(t){var e=t.split(""),n=[],r=function(t){return Object.keys(k).indexOf(t)>=0};e.forEach((function(t){if(r(t)){var e={op:t,els:n.splice(-2)};n.push(e)}else n.push(t)}));var a=n[0];if("string"==typeof a&&a.length>1)throw new Error("tree parsed incorrectly");return a}(e),r=w(n);return console.log({fixed:e,tree:n,nfa:r}),r.fixEpsilonClosure(),r.eval.bind(r)}catch(a){return function(t){return!1}}},_=function(t){Object(l.a)(n,t);var e=Object(h.a)(n);function n(){return Object(i.a)(this,n),e.apply(this,arguments)}return Object(u.a)(n,[{key:"render",value:function(){return Object(p.jsxs)("div",{id:"intro",children:["String matcher by Justin Lee and Ben Chong",Object(p.jsx)("br",{}),Object(p.jsx)("br",{}),"Supports standard ops '(', ')', '*', '|'",Object(p.jsx)("br",{}),"and additional ops '+' and '?'",Object(p.jsx)("br",{}),Object(p.jsx)("br",{}),"Press Enter to keep a result"]})}}]),n}(a.a.Component),A=_,R=function(t){Object(l.a)(n,t);var e=Object(h.a)(n);function n(t){var r;return Object(i.a)(this,n),(r=e.call(this,t)).state={pattStr:"",testStr:"",addToList:function(t){return 0},success:!1,evalFunction:function(t){return!1}},r.on_patt_change=r.on_patt_change.bind(Object(o.a)(r)),r.on_test_change=r.on_test_change.bind(Object(o.a)(r)),r}return Object(u.a)(n,[{key:"on_patt_change",value:function(t){this.setState({pattStr:t});var e=C(t);this.setState({evalFunction:e},this.updateSuccessValue)}},{key:"on_test_change",value:function(t){this.setState({testStr:t},this.updateSuccessValue)}},{key:"updateSuccessValue",value:function(){this.setState({success:this.state.evalFunction(this.state.testStr)})}},{key:"onKeyDown",value:function(t){if(13===t.keyCode){t.preventDefault(),console.log(this.state.evalFunction);var e=this.state,n=e.pattStr,r=e.testStr,a=e.success;this.state.addToList({pattStr:n,testStr:r,success:a})}}},{key:"render",value:function(){var t=this;return Object(p.jsxs)("div",{id:"holder_outer",onKeyDown:function(e){return t.onKeyDown(e)},children:[Object(p.jsx)(A,{}),Object(p.jsxs)("div",{className:"holder",children:[Object(p.jsx)(d,{placeholder:"Enter regex here...",onchange:function(e){return t.on_patt_change(e)}}),Object(p.jsx)(d,{placeholder:"Enter test string here...",onchange:function(e){return t.on_test_change(e)}})]}),Object(p.jsx)("div",{className:"holder",children:Object(p.jsx)(v,{success:this.state.success,pattStr:this.state.pattStr,testStr:this.state.testStr,setAddToList:function(e){t.setState({addToList:e})}})})]})}}]),n}(a.a.Component);var T=function(){return Object(p.jsx)("div",{className:"App",children:Object(p.jsx)(R,{})})};c.a.render(Object(p.jsx)(a.a.StrictMode,{children:Object(p.jsx)(T,{})}),document.getElementById("root"))}},[[20,1,2]]]);
//# sourceMappingURL=main.60ae3c9c.chunk.js.map