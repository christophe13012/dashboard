(this.webpackJsonpunextradashboard=this.webpackJsonpunextradashboard||[]).push([[4],{374:function(e,t,a){},396:function(e,t,a){"use strict";a.r(t),a.d(t,"GRAPHQL_ENDPOINT",(function(){return G})),a.d(t,"GRAPHQL_SUBSCRIPTIONS",(function(){return R})),a.d(t,"SECRET_KEY",(function(){return H})),a.d(t,"AUTH_JWT",(function(){return M}));a(154),a(162),a(163),a(165),a(91),a(147),a(171),a(172),a(173),a(177),a(178),a(179),a(183),a(184),a(185),a(186),a(189),a(190),a(191),a(197),a(111),a(201),a(148),a(205),a(206),a(207),a(208),a(211),a(212),a(213),a(214),a(215),a(216),a(217),a(218),a(219),a(220),a(221),a(263),a(266),a(267),a(268),a(272),a(273),a(275),a(276),a(277),a(278),a(279),a(280),a(281),a(282),a(284),a(285),a(286),a(287),a(288),a(289),a(290),a(291),a(292),a(293),a(294),a(295),a(296),a(299),a(300),a(301),a(302),a(303),a(304),a(305),a(307),a(308),a(309),a(311),a(312),a(314),a(316),a(317),a(318),a(319),a(320),a(322),a(323),a(324),a(325),a(326),a(327),a(328),a(329),a(330),a(331),a(332),a(333),a(334),a(335),a(336),a(337),a(338),a(339),a(340),a(341),a(342),a(343),a(344),a(345),a(346),a(347),a(349),a(351),a(352),a(353),a(354),a(355),a(356),a(357),a(358),a(359),a(360),a(149),a(228),a(229),a(230),a(232),a(137),a(368);var n=a(4),r=a.n(n),s=a(90),c=a.n(s),o=a(146),i=a(20),d=(a(374),a(375),a(21));const l=Object(d.jsx)("div",{className:"pt-3 text-center",children:Object(d.jsx)("div",{className:"sk-spinner sk-spinner-pulse"})}),b=r.a.lazy((()=>Promise.all([a.e(2),a.e(6),a.e(9)]).then(a.bind(null,1022)))),h=r.a.lazy((()=>Promise.all([a.e(2),a.e(10)]).then(a.bind(null,1048)))),p=r.a.lazy((()=>Promise.all([a.e(2),a.e(11)]).then(a.bind(null,1049)))),u=r.a.lazy((()=>Promise.all([a.e(2),a.e(18)]).then(a.bind(null,1050)))),j=r.a.lazy((()=>Promise.all([a.e(2),a.e(19)]).then(a.bind(null,1051))));class x extends n.Component{render(){return Object(d.jsx)(o.a,{children:Object(d.jsx)(r.a.Suspense,{fallback:l,children:Object(d.jsxs)(i.d,{children:[Object(d.jsx)(i.b,{exact:!0,path:"/login",name:"Login Page",render:e=>Object(d.jsx)(h,{...e})}),Object(d.jsx)(i.b,{exact:!0,path:"/register",name:"Register Page",render:e=>Object(d.jsx)(p,{...e})}),Object(d.jsx)(i.b,{exact:!0,path:"/404",name:"Page 404",render:e=>Object(d.jsx)(u,{...e})}),Object(d.jsx)(i.b,{exact:!0,path:"/500",name:"Page 500",render:e=>Object(d.jsx)(j,{...e})}),Object(d.jsx)(i.b,{path:"/",name:"Home",render:e=>Object(d.jsx)(b,{...e})})]})})})}}var m=x;Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var O=a(151),I=a(237);const g={sidebarShow:!0},w=Object(I.a)((function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:g,{type:t,...a}=arguments.length>1?arguments[1]:void 0;return"set"===t?{...e,...a}:e}));var v=w,y=a(408),f=a(402),z=a(407),P=a(409),L=a(52),J=a(145),W=a(240),k=a(144);const S=Object(W.a)({apiKey:"AIzaSyBpl62VOwT6totZxn3LPHrnt4JhG3xjWdI",authDomain:"unextra-prod.firebaseapp.com",databaseURL:"https://unextra-prod-default-rtdb.europe-west1.firebasedatabase.app",projectId:"unextra-prod",storageBucket:"unextra-prod.appspot.com",messagingSenderId:"705321915257",appId:"1:705321915257:web:dfa27120f912c0a40e15a8",measurementId:"G-9L9NKZV52Y"}),G="https://unextra.hasura.app/v1/graphql",R="wss://unextra.hasura.app/v1/graphql",H="2tGF4WeLMIOsP/Q/h/VS2cd++EmJzMcb",M="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYW5vbnltb3VzIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6ImFub255bW91cyJ9fQ.HM2vL95bDWL2xTMwCXXDatxlfLMd_8-Mx1ymyMiCKb4";Object(k.a)(S),(()=>{const e=new y.a({uri:G,headers:{Authorization:"Bearer ".concat(M)}}),t=new J.a({uri:R,headers:{Authorization:"Bearer ".concat(M)},options:{reconnect:!0}}),a=Object(f.a)((e=>{let{query:t}=e;const a=Object(L.e)(t);return"OperationDefinition"===a.kind&&"subscription"===a.operation}),t,e);new z.a({link:a,cache:new P.a})})();c.a.render(Object(d.jsx)(O.a,{store:v,children:Object(d.jsx)(m,{})}),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((e=>{e.unregister()}))}},[[396,5,7]]]);
//# sourceMappingURL=main.0b75a939.chunk.js.map