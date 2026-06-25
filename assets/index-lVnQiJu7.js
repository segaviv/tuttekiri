(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const ke={backgroundColor:"#515153ff",gridColor:"#222",lineColor:"#000000ff",unitLineColor:"#000000ff",fillColor:"rgba(89, 215, 253, 0.7)",faceColor0:"#BDE0FE",faceColor1:"#FFC2D1",faceColor2:"rgba(87, 255, 129)",unitFaceColor0:"#7BB6FF",unitFaceColor1:"#FF84B4",unitFaceColor2:"rgba(0, 210, 52)",zoomSensitivity:.03,minZoom:5,maxZoom:2e3,defaultZoom:40},Oo=()=>({mesh:null,camera:{x:0,y:0,zoom:ke.defaultZoom},repX:1,repY:1,isDragging:!1,lastMouse:{x:0,y:0},dragStart:{x:0,y:0},baseMesh:null,unitPatternBaseMesh:null,showIndices:!1,showBaseMesh:!1,deployAngle:0,kernelWeights:[],renderMode:"bbox",bboxWidth:20,bboxHeight:20,circleRadius:10,circleShiftX:0,circleShiftY:0,enableThirdColor:!1,showUnitParallelogram:!1,alignUnitParallelogram:!1,splitScreen:!1,detectCollisions:!1,max_angle:Math.PI,color_map:{},mtlBrightness:1,mtlInterpolation:1,svgAverageEdgeSizeMm:40,svgHingeSizeMm:2,barrier:.1,barrier_strength:10,close_to_original_weight:.1,targetMesh:null,scale:1,rotation:0,deployedAngle:0,viewer3D:null,initMesh:null,liftedMesh:null,optimizedGround:null,optimizedLifted:null,edgeStyles:[],edgeStyleMap:{},selectedStyleIndex:-1,isPickingEdge:!1,periodicInfo:null}),Pe=Oo();function wa(){const s=Oo();Object.assign(Pe,s)}function Po(s){const e=/^#?([a-f\d])([a-f\d])([a-f\d])$/i;s=s.replace(e,(n,i,r,a)=>i+i+r+r+a+a);const t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(s);return t?{r:parseInt(t[1],16),g:parseInt(t[2],16),b:parseInt(t[3],16)}:{r:128,g:128,b:128}}function Aa(s,e){const t=s.canvas.clientWidth,n=s.canvas.clientHeight,i=t/2,r=n/2,{x:a,y:o,zoom:c}=e.camera;let l=1;for(;l*c<50;)l*=2;for(;l*c>200;)l/=2;s.strokeStyle=ke.gridColor,s.lineWidth=1;const d=Math.floor((-i/c+a)/l)*l,h=Math.ceil((i/c+a)/l)*l;s.beginPath();for(let f=d;f<=h;f+=l){const y=i+(f-a)*c;s.moveTo(y,0),s.lineTo(y,n)}const u=Math.floor((-r/c+o)/l)*l,m=Math.ceil((r/c+o)/l)*l;for(let f=u;f<=m;f+=l){const y=r-(f-o)*c;s.moveTo(0,y),s.lineTo(t,y)}s.stroke(),s.strokeStyle="#333",s.lineWidth=2,s.beginPath();const x=r-(0-o)*c;x>=0&&x<=n&&(s.moveTo(0,x),s.lineTo(t,x));const p=i+(0-a)*c;p>=0&&p<=t&&(s.moveTo(p,0),s.lineTo(p,n)),s.stroke()}function Gi(s,e,t,n,i,r,a,o){let c=e.faces[t];s.beginPath();const l=e.vertices[c[0]],d=r(l,n,i);s.moveTo(d.x,d.y);for(let h=0;h<c.length;h++){const u=c[h],m=c[(h+1)%c.length],x=e.vertices[m],p=r(x,n,i),f=`${u}_${m}`,{styleIdx:y,flip:w}=a.edgeStyleMap&&a.edgeStyleMap[f]||{styleIdx:void 0,flip:0};if(y!==void 0&&a.edgeStyles[y]){const S=a.edgeStyles[y].points;let b,I,O=w%2==1,v=Math.floor(w/2)==1^O;O?(b=r(e.vertices[u],n,i),I=p):(b=p,I=r(e.vertices[u],n,i));const D=I.x-b.x,R=I.y-b.y,K=-R,q=D,L=$=>({x:b.x+$.x*D+(v?-1:1)*$.y*K,y:b.y+$.x*R+(v?-1:1)*$.y*q}),C=$=>{const Y=L($);return $.hIn?Y.hIn=L($.hIn):Y.hIn={...Y},$.hOut?Y.hOut=L($.hOut):Y.hOut={...Y},Y},W=S.map(C),Q=O?W:W.slice().reverse();for(let $=0;$<Q.length-1;$++){const Y=Q[$],ee=Q[$+1],se=O?Y.hOut:Y.hIn,ce=O?ee.hIn:ee.hOut;s.bezierCurveTo(se.x,se.y,ce.x,ce.y,ee.x,ee.y)}}else s.lineTo(p.x,p.y)}s.closePath(),o==="stroke"?s.stroke():o==="fill"&&s.fill()}function ba(s,e){if(!e.mesh||!e.baseMesh)return;const t=s.canvas.clientWidth,n=s.canvas.clientHeight,i=t/2,r=n/2,{x:a,y:o,zoom:c}=e.camera,l=(m,x,p)=>({x:i+(m.x+x[0]+p[0]-a)*c,y:r-(m.y+x[1]+p[1]-o)*c});s.lineJoin="round",s.lineCap="round";const d=e.repX,h=e.repY;let u=e.mesh;e.showBaseMesh&&(u=e.baseMesh);for(let m=d-1;m>=0;m--)for(let x=h-1;x>=0;x--){const p=u.periodicity[0].map(w=>w*m),f=u.periodicity[1].map(w=>w*x);if(u.faces.length>0)for(let w=0;w<u.faces.length;w++){u.faces[w];let _=ke.fillColor;if(u.face_colors&&u.face_colors[w]===1?_=m==0&&x==0?ke.unitFaceColor1:ke.faceColor1:u.face_colors&&u.face_colors[w]===0?_=m==0&&x==0?ke.unitFaceColor0:ke.faceColor0:u.face_colors&&u.face_colors[w]===2&&(_=m==0&&x==0?ke.unitFaceColor2:ke.faceColor2),e.color_map&&e.baseMesh&&e.baseMesh.mtl_face_color_names&&e.baseMesh.mtl_face_color_names[w]in e.color_map){const S=e.color_map[e.baseMesh.mtl_face_color_names[w]],b=e.mtlBrightness!==void 0?e.mtlBrightness:1,I=e.mtlInterpolation!==void 0?e.mtlInterpolation:1,O=Po(_),v=S[0]*b,D=S[1]*b,R=S[2]*b,K=O.r*(1-I)+v*I,q=O.g*(1-I)+D*I,L=O.b*(1-I)+R*I;s.fillStyle=`rgb(${Math.floor(K)}, ${Math.floor(q)}, ${Math.floor(L)})`}else s.fillStyle=_;Gi(s,u,w,p,f,l,e,"fill")}const y=e.camera.zoom/ke.defaultZoom;m==0&&x==0?(s.strokeStyle=ke.unitLineColor,s.lineWidth=Math.max(.7,3*y)):(s.strokeStyle=ke.lineColor,s.lineWidth=Math.max(.5,2*y));for(let w=0;w<u.faces.length;w++)Gi(s,u,w,p,f,l,e,"stroke");if(e.showIndices&&m===0&&x===0){s.fillStyle="#000000ff",s.font="12px Inter, sans-serif",s.textAlign="center",s.textBaseline="middle";for(let w=0;w<u.vertices.length;w++){const _=u.vertices[w],S=l(_,p,f);S.x<-20||S.x>t+20||S.y<-20||S.y>n+20||s.fillText(w.toString(),S.x+4,S.y-4)}}}}function er(s,e,t){if(!e.mesh||!e.baseMesh)return;const n=s.canvas.clientWidth,i=s.canvas.clientHeight,r=n/2,a=i/2,{x:o,y:c,zoom:l}=e.camera,d=(L,C,W)=>({x:r+(L.x+C[0]+W[0]-o)*l,y:a-(L.y+C[1]+W[1]-c)*l});s.lineJoin="round",s.lineCap="round";let h=e.mesh;e.showBaseMesh&&(h=e.baseMesh);const u=t.minX,m=t.maxX,x=t.minY,p=t.maxY,f=e.baseMesh.periodicity[0],y=e.baseMesh.periodicity[1],w=f[0]*y[1]-f[1]*y[0];let _=1/0,S=-1/0,b=1/0,I=-1/0;if(Math.abs(w)<1e-6)_=0,S=1,b=0,I=1;else{const L=[[y[1]/w,-y[0]/w],[-f[1]/w,f[0]/w]],C=($,Y)=>({u:L[0][0]*$+L[0][1]*Y,v:L[1][0]*$+L[1][1]*Y}),W=[{x:u,y:x},{x:m,y:x},{x:m,y:p},{x:u,y:p}];let Q=0;for(const $ of h.vertices)Q=Math.max(Q,Math.hypot($.x,$.y));W.forEach($=>{[{x:0,y:0},{x:Q,y:0},{x:-Q,y:0},{x:0,y:Q},{x:0,y:-Q}].forEach(ee=>{const se=C($.x+ee.x,$.y+ee.y);_=Math.min(_,se.u),S=Math.max(S,se.u),b=Math.min(b,se.v),I=Math.max(I,se.v)})})}const O=Math.floor(_),v=Math.ceil(S),D=Math.floor(b),R=Math.ceil(I);let K=L=>e.renderMode==="bbox"?L.x>=u&&L.x<=m&&L.y>=x&&L.y<=p:Math.hypot(L.x-e.circleShiftX,L.y-e.circleShiftY)<=e.circleRadius,q=(L,C)=>{const W=h.periodicity[0].map(ce=>ce*L),Q=h.periodicity[1].map(ce=>ce*C),$=e.baseMesh.periodicity[0].map(ce=>ce*L),Y=e.baseMesh.periodicity[1].map(ce=>ce*C),ee=[],se=e.baseMesh.vertices.map(ce=>({x:ce.x+$[0]+Y[0],y:ce.y+$[1]+Y[1]}));for(let ce=0;ce<e.baseMesh.faces.length;ce++){const V=e.baseMesh.faces[ce];let re=!0;for(const de of V){const U=se[de];if(!K(U)){re=!1;break}}re&&ee.push(ce)}if(ee.length!==0)for(const ce of ee){h.faces[ce];let V=ke.fillColor;if(h.face_colors&&h.face_colors[ce]===1?V=L==0&&C==0?ke.unitFaceColor1:ke.faceColor1:h.face_colors&&h.face_colors[ce]===0?V=L==0&&C==0?ke.unitFaceColor0:ke.faceColor0:h.face_colors&&h.face_colors[ce]===2&&(V=L==0&&C==0?ke.unitFaceColor2:ke.faceColor2),e.color_map&&e.baseMesh&&e.baseMesh.mtl_face_color_names&&e.baseMesh.mtl_face_color_names[ce]in e.color_map){const de=e.color_map[e.baseMesh.mtl_face_color_names[ce]],U=e.mtlBrightness!==void 0?e.mtlBrightness:1,ne=e.mtlInterpolation!==void 0?e.mtlInterpolation:1,oe=Po(V),le=de[0]*U,ue=de[1]*U,xe=de[2]*U,_e=oe.r*(1-ne)+le*ne,ye=oe.g*(1-ne)+ue*ne,we=oe.b*(1-ne)+xe*ne;s.fillStyle=`rgb(${Math.floor(_e)}, ${Math.floor(ye)}, ${Math.floor(we)})`}else s.fillStyle=V;Gi(s,h,ce,W,Q,d,e,"fill");const re=e.camera.zoom/ke.defaultZoom;L==0&&C==0?(s.strokeStyle=ke.unitLineColor,s.lineWidth=Math.max(.7,3*re)):(s.strokeStyle=ke.lineColor,s.lineWidth=Math.max(.5,2*re)),Gi(s,h,ce,W,Q,d,e,"stroke")}};for(let L=O;L<=v;L++)for(let C=D;C<=R;C++)q(L,C);q(0,0)}function Sa(s,e,t){s.fillStyle=ke.backgroundColor,s.fillRect(0,0,e.width,e.height),Aa(s,t);const n=s.canvas.clientWidth,i=s.canvas.clientHeight,r=n/2,a=i/2,{x:o,y:c,zoom:l}=t.camera,d=(h,u)=>({x:r+(h-o)*l,y:a-(u-c)*l});if(t.renderMode==="bbox"){const h=t.bboxWidth||10,u=t.bboxHeight||10,m={minX:-h/2,maxX:h/2,minY:-u/2,maxY:u/2},x=d(m.minX,m.minY),p=d(m.maxX,m.minY),f=d(m.maxX,m.maxY),y=d(m.minX,m.maxY);s.strokeStyle="rgba(255, 255, 0, 0.5)",s.lineWidth=2,s.setLineDash([5,5]),s.beginPath(),s.moveTo(x.x,x.y),s.lineTo(p.x,p.y),s.lineTo(f.x,f.y),s.lineTo(y.x,y.y),s.closePath(),s.stroke(),s.setLineDash([]),er(s,t,m)}else if(t.renderMode==="circle"){const h=t.circleRadius||10,u=d(t.circleShiftX,t.circleShiftY),m=h*l;s.strokeStyle="rgba(255, 255, 0, 0.5)",s.lineWidth=2,s.setLineDash([5,5]),s.beginPath(),s.arc(u.x,u.y,m,0,2*Math.PI),s.stroke(),s.setLineDash([]);const x={minX:-h,maxX:h,minY:-h,maxY:h};er(s,t,x)}else ba(s,t);if(t.showUnitParallelogram&&t.mesh&&t.mesh.vertices&&t.mesh.vertices.length>0&&t.mesh.periodicity){if(t.mesh.singular_values&&t.mesh.U){let w=t.baseMesh.periodicity[0][0],_=t.baseMesh.periodicity[0][1],S=Math.sqrt(w*w+_*_),b=t.baseMesh.periodicity[1][0],I=t.baseMesh.periodicity[1][1],O=Math.sqrt(b*b+I*I),v=Math.max(S,O);const D=v*l*t.mesh.singular_values[0][0],R=v*l*t.mesh.singular_values[1][1],K=d(t.mesh.vertices[0].x,t.mesh.vertices[0].y),q=d(t.mesh.vertices[0].x+t.mesh.periodicity[0][0],t.mesh.vertices[0].y+t.mesh.periodicity[0][1]),L=d(t.mesh.vertices[0].x+t.mesh.periodicity[1][0],t.mesh.vertices[0].y+t.mesh.periodicity[1][1]),C=t.mesh.U[0][0],W=t.mesh.U[1][0],$=-Math.atan2(W,C);s.strokeStyle="#70cd47A0",s.fillStyle="#70cd4750",s.lineWidth=5,s.beginPath(),s.ellipse(K.x,K.y,D,R,$,0,2*Math.PI),s.stroke(),s.fill(),s.setLineDash([]),s.fillStyle="#379b0cff",s.strokeStyle="#379b0cff",s.beginPath(),s.arc(K.x,K.y,8,0,2*Math.PI),s.fill(),s.beginPath(),s.arc(q.x,q.y,8,0,2*Math.PI),s.fill(),s.beginPath(),s.arc(L.x,L.y,8,0,2*Math.PI),s.fill(),s.beginPath(),s.moveTo(K.x,K.y),s.lineTo(q.x,q.y),s.stroke(),s.beginPath(),s.moveTo(K.x,K.y),s.lineTo(L.x,L.y),s.stroke()}const h=t.mesh.vertices[0],u=t.mesh.periodicity[0],m=t.mesh.periodicity[1],x=d(h.x,h.y),p=d(h.x+u[0],h.y+u[1]),f=d(h.x+u[0]+m[0],h.y+u[1]+m[1]),y=d(h.x+m[0],h.y+m[1]);s.strokeStyle="#FF00FF",s.lineWidth=2,s.setLineDash([5,5]),s.beginPath(),s.moveTo(x.x,x.y),s.lineTo(p.x,p.y),s.lineTo(f.x,f.y),s.lineTo(y.x,y.y),s.closePath(),s.stroke(),s.setLineDash([])}}const Ta="data:application/octet-stream;base64,diAwLjU5MDczMDEzNTc1MjQ4OTEgLTIuNjAzOTcyNzc5Mzk5NzQKdiAtMC41NTAwMzIyODA5OTE1NDk0IC0xLjc0MjM3NDQ2MzEzNDIzODYKdiAtMS45NzkxODI2OTE2MDE1OTgyIC0xLjc4MTY2MDExMTA5NDU4NjQKdiAtMS43OTg2NTkxMzY0ODQzNjE2IC0wLjM2MDA1MjI0NDk2Mzc1NzY1CnYgLTIuNTQ5NTg4NDY3ODQ3OTQ1NyAwLjg1OTg4Njc2ODM0NTAyOTYKdiAtMS4yMjgyNTMzNjAyMzgwMTI4IDEuNDA3NjcwNjk0MTk2MDE2NAp2IC0wLjU1MDAzMjI4MDk5MTU0OTEgMi42NjY4OTUzNTU0NjUxNTMKdiAwLjU5MDczMDEzNTc1MjQ4OTQgMS44MDUyOTcwMzkxOTk2NDk1CnYgMi4wMTk4ODA1NDYzNjI1Mzg0IDEuODQ0NTgyNjY0MzM1OTM3NQp2IDEuODM5MzU2OTkxMjQ1MzAyNyAwLjQyMjk3NDc5ODIwNTEwNzcKdiAyLjU5MDI4NjMyMjYwODg5MTUgLTAuNzk2OTY0MjE1MTAzNjc5NQp2IDEuMjY4OTUxMjE0OTk4OTU0IC0xLjM0NDc0ODE0MDk1NDY2Ngp2IC0xLjk3OTE4MjY5MTYwMTU5ODQgMi42Mjc2MDk3NTMxNTI5MjYKdiAxLjI2ODk1MTIxNDk5ODk1NDQgMy4wNjQ1MjE3MjMyOTI4NDc0CmYgMTIgMTEgMTAgOSA4IDcgNiA1IDQgMyAyIDEKZiAxMyA2IDcKZiAxNCA4IDkKcHggMCA0LjQwOTI2OTg2NDI0NzUxMQpweSAzLjgxODUzOTY4Mjg0NjkwMTYgMi4yMDQ2MzQ5MDkyOTk2OTUKZmMgMApmYyAxCmZjIDEK",Da="data:application/octet-stream;base64,diAxMi45NDA5NTIgLTQ4LjI5NjI5MQp2IC0xMi45NDA5NTIgLTQ4LjI5NjI5MQp2IC0zNS4zNTUzMzkgLTM1LjM1NTMzOQp2IC00OC4yOTYyOTEgLTEyLjk0MDk1Mgp2IC00OC4yOTYyOTEgMTIuOTQwOTUyCnYgLTM1LjM1NTMzOSAzNS4zNTUzMzkKdiAtMTIuOTQwOTUyIDQ4LjI5NjI5MQp2IDEyLjk0MDk1MiA0OC4yOTYyOTEKdiAzNS4zNTUzMzkgMzUuMzU1MzM5CnYgNDguMjk2MjkxIDEyLjk0MDk1Mgp2IDQ4LjI5NjI5MSAtMTIuOTQwOTUyCnYgMzUuMzU1MzM5IC0zNS4zNTUzMzkKdiAtMzUuMzU1MzM5IDYxLjIzNzI0NAp2IDM1LjM1NTMzOSA2MS4yMzcyNDQKZiAxMiAxMSAxMCA5IDggNyA2IDUgNCAzIDIgMQpmIDEzIDYgNwpmIDE0IDggOQpweCAwIDk2LjU5MjU4MwpweSA4My42NTE2MyA0OC4yOTYyOTEK",Ea="data:application/octet-stream;base64,diAxLjk4NTY3MzE1MzY2NjE3MDMgLTEuOTg1NjczMTUzNjY2MTcwNQp2IDIuNDc2MDU0MjAzMzIyODc1IC0xLjEzNjMwODIzNjQyNzM0NTYKdiAyLjQ3NjA1NDIwMzMyMjg3NSAtMC4xNTU1NDYxMzcxMTM5MzU0NQp2IDEuOTg1NjczMTUzNjY2MTcwMyAwLjY5MzgxODc4MDEyNDg4OTUKdiAxLjEzNjMwODIzNjQyNzM0NTQgMS4xODQxOTk4Mjk3ODE1OTQzCnYgMC4xNTU1NDYxMzcxMTM5MzUzIDEuMTg0MTk5ODI5NzgxNTk0Mwp2IC0wLjY5MzgxODc4MDEyNDg4OTYgMC42OTM4MTg3ODAxMjQ4ODk1CnYgLTEuMTg0MTk5ODI5NzgxNTk0NSAtMC4xNTU1NDYxMzcxMTM5MzU0NQp2IC0xLjE4NDE5OTgyOTc4MTU5NDUgLTEuMTM2MzA4MjM2NDI3MzQ1Ngp2IC0wLjY5MzgxODc4MDEyNDg4OTYgLTEuOTg1NjczMTUzNjY2MTcwNQp2IDAuMTU1NTQ2MTM3MTEzOTM1MyAtMi40NzYwNTQyMDMzMjI4NzUKdiAxLjEzNjMwODIzNjQyNzM0NTQgLTIuNDc2MDU0MjAzMzIyODc1CnYgLTAuNjkzODE4NzgwMTI0ODg5NiAxLjY3NDU4MDkxNzMzMjAzNzgKdiAtMS42NzQ1ODA5MTczMzIwMzc4IDAuNjkzODE4NzgwMTI0ODg5NQp2IC0xLjY3NDU4MDkxNzMzMjAzNzggMS42NzQ1ODA5MTczMzIwMzc4CnYgLTEuMTg0MTk5ODI5NzgxNTk0NSAyLjUyMzk0NTc5NjY3NzEyNAp2IC0yLjUyMzk0NTc5NjY3NzEyNDYgMS4xODQxOTk4Mjk3ODE1OTQzCmYgMSAyIDMgNCA1IDYgNyA4IDkgMTAgMTEgMTIKZiAxMyA3IDYKZiAxNCA4IDcKZiAxNSAxNCA3IDEzCmYgMTYgMTUgMTMKZiAxNyAxNCAxNQpweCAzLjY2MDI1NDA3MDk5ODIwODggMApweSAwIDMuNjYwMjU0MDcwOTk4MjA4OApmYyAwCmZjIDEKZmMgMQpmYyAwCmZjIDEKZmMgMQo=",Ia="data:application/octet-stream;base64,diAxLjk4NTY3MzE1MzY2NjE3MDMgLTEuOTg1NjczMTUzNjY2MTY5NAp2IDIuMzQ5MjI5NjE4NjI3NTg4NSAtMC44ODY1NzU5NzIyMzE2NTgKdiAyLjcyMTI5NjgyNzk2ODM2NCAwLjIwOTY3ODU2MjI5MDEyNjkKdiAyLjM1MzQ4NTAwMDI5MDcgMC45NDIxMjk3Mzk4MTEwODI0CnYgMS4yNTQzMDQ3ODUyMzk2MTYzIDEuMzA3OTM0OTEzNDE4NDgxMgp2IDAuMTU1OTY3NjI4MjUxODY3MzMgMS42NzU0MjE3MDk3NDQ0NTYxCnYgLTAuNTc1NDAwNzIxMjI3ODE5OSAxLjMwODc3NTcyNDc3Nzc3MDcKdiAtMC45Mzg5NTcyMDUxMzYxMDQxIDAuMjA5Njc4NTYyMjkwMTI2NTcKdiAtMS4zMTEwMjQ0MTQ0NzY4ODQ4IC0wLjg4NjU3NTk3MjIzMTY1ODQKdiAtMC45NDMyMTI1Njc4NTIzNTIgLTEuNjE5MDI3MTY4Njk5NDg0Mgp2IDAuMTU1OTY3NjI4MjUxODY3MDUgLTEuOTg0ODMyMzIzMzYwMDE0CnYgMS4yNTQzMDQ3ODUyMzk2MTY3IC0yLjM1MjMxOTExOTY4NTk4NjUKdiAtMC45NDMyMTI1Njc4NTIzNTE3IDIuMDQxMjI2OTAyMjk4NzI0CnYgLTEuMzA2NzY5MDcwNzA3NTA2IDAuOTQyMTI5NzM5ODExMDgzMwp2IC0xLjY3NDU4MDkxNzMzMjAzOCAxLjY3NDU4MDkxNzMzMjAzOTIKdiAtMS4zMTEwMjQ0MTQ0NzY4ODU3IDIuNzczNjc4MDYwODcyODA5Mwp2IC0yLjQwNTk0OTI0Nzg2NDg1NTQgMS4zMDc5MzQ5MTM0MTg0ODE3CmYgMSAyIDMgNCA1IDYgNyA4IDkgMTAgMTEgMTIKZiAxMyA3IDYKZiAxNCA4IDcKZiAxNSAxNCA3IDEzCmYgMTYgMTUgMTMKZiAxNyAxNCAxNQpweCAzLjY2MDI1NDA3MDk5ODIwODggMApweSAwIDMuNjYwMjU0MDcwOTk4MjA4OApmYyAwCmZjIDEKZmMgMQpmYyAwCmZjIDEKZmMgMQo=",Na="data:application/octet-stream;base64,diAxLjI1IDAKdiAwLjYyNSAxLjA4MjUzMTc1CnYgLTAuNjI1IDEuMDgyNTMxNzUKdiAtMS4yNSAwCnYgLTAuNjI1IC0xLjA4MjUzMTc1CnYgMC42MjUgLTEuMDgyNTMxNzUKdiAwIDIuMTY1MDYzNQp2IDAgLTIuMTY1MDYzNQp2IC0xLjg3NSAxLjA4MjUzMTc1CnYgMS44NzUgLTEuMDgyNTMxNzUKdiAtMS44NzUgLTEuMDgyNTMxNzUKdiAtMi41IDAKdiAyLjUgMAp2IDEuODc1IDEuMDgyNTMxNzUKZiAxIDIgMyA0IDUgNgpmIDcgMyAyCmYgOCA2IDUKZiA5IDQgMwpmIDEwIDEgNgpmIDExIDUgNApmIDEyIDQgOQpmIDEzIDEgMTAKZiAxNCAyIDEKcHggMC42MjUgMy4yNDc1OTUyNzUKcHkgMy4xMjUgMS4wODI1MzE3NQpmYyAwCmZjIDEKZmMgMQpmYyAxCmZjIDEKZmMgMQpmYyAwCmZjIDAKZmMgMQo=",Ca="data:application/octet-stream;base64,diAwLjUyODMxMjE2MTgyOTI5MDQgMC43MTUxMTc5NzIyMDczNjgKdiAtMC41MjgzMTIxNjE4MjkyOTA0IDAuNzE1MTE3OTcyMjA3MzY4CnYgLTAuNTI4MzEyMTYxODI5MjkwNCAtMC4zNDE1MDYzNTE0NTEyMTI4CnYgMC41MjgzMTIxNjE4MjkyOTA0IC0wLjM0MTUwNjM1MTQ1MTIxMjgKdiAtMC41MjgzMTIxNjE4MjkyOTA0IC0xLjM5ODEzMDY3NTEwOTc5MzcKdiAwLjUyODMxMjE2MTgyOTI5MDQgLTEuMzk4MTMwNjc1MTA5NzkzNwp2IDEuNDQzMzc1Njc2MzQxNDE5NCAwLjE4NjgwNTgxMDM3ODA3NzUzCnYgMS40NDMzNzU2NzYzNDE0MTk0IC0wLjg2OTgxODUxMzI4MDUwMzIKdiAtMS40NDMzNzU2NzYzNDE0MTk0IDAuMTg2ODA1ODEwMzc4MDc3NTMKdiAtMS40NDMzNzU2NzYzNDE0MTk0IC0wLjg2OTgxODUxMzI4MDUwMzIKdiAtMi41IDAuMTg2ODA1ODEwMzc4MDc3NTMKdiAtMi41IC0wLjg2OTgxODUxMzI4MDUwMzIKdiAyLjUgLTAuODY5ODE4NTEzMjgwNTAzMgp2IDIuNSAwLjE4NjgwNTgxMDM3ODA3NzUzCnYgMS45NzE2ODc4MzgxNzA3MDk3IDEuMTAxODY5MzI0ODkwMjA2NQp2IDEuMDU2NjI0MzIzNjU4NTgwOCAxLjYzMDE4MTQ4NjcxOTQ5NjgKdiAtMS4wNTY2MjQzMjM2NTg1ODA4IDEuNjMwMTgxNDg2NzE5NDk2OAp2IC0xLjk3MTY4NzgzODE3MDcwOTcgMS4xMDE4NjkzMjQ4OTAyMDY1CnYgMCAxLjYzMDE4MTQ4NjcxOTQ5NjgKdiAwIC0yLjMxMzE5NDE4OTYyMTkyMjQKZiAxIDIgMyA0CmYgNSA2IDQgMwpmIDcgMSA0CmYgOCA0IDYKZiA4IDcgNApmIDkgMyAyCmYgMTAgMyA5CmYgMTAgNSAzCmYgMTEgMTIgMTAgOQpmIDEzIDE0IDcgOApmIDE1IDE2IDEgNwpmIDE3IDE4IDkgMgpmIDE5IDIgMQpmIDIwIDYgNQpmIDE5IDE3IDIKZiAxNiAxOSAxCmYgMTEgOSAxOApmIDE0IDE1IDcKcHggNC45OTk5OTk5ODUwNTcwNzYgMApweSAyLjUgMi41CmZjIDAKZmMgMQpmYyAxCmZjIDEKZmMgMApmYyAxCmZjIDAKZmMgMQpmYyAxCmZjIDEKZmMgMApmYyAwCmZjIDEKZmMgMApmYyAwCmZjIDAKZmMgMQpmYyAxCg==",La="data:application/octet-stream;base64,diAtMS44NzgxMjA0MjU0MzY1NTEgLTEuMzg1ODIzMjk0MTk2NTExNgp2IC0xLjA3MjE2ODE3NTc3ODQ4MzMgLTEuMzgzNDYyNjQ1NjMxMzA0NAp2IC0wLjU0NjQ3MzU5MDU1NjI5OTMgLTAuNTU1Njk0MTc2MDE5NTkxNQp2IC0wLjk4MjkzMTA2NjY4MTY2MzUgMC4wMjE2NDMwNzY2NDQ2NDc3MzUKdiAtMS43MTMzOTc5NzAwMjcyNDQ0IC0wLjM0MDgzMjc0NTM3OTUwOTc1CnYgMC42MTA3OTQyMjQwNjM3MDYgMS4xMDMwOTEzNTUzMDM3NDU2CnYgMC40NDYwNzE3Njg2NTQ0MDAzNSAwLjA1ODEwMDgwNjQ4Njc0MzQzCnYgMS40ODAzNjgwMDEyMDcwNDIyIDAuMTY1ODAzNjg4MjA5NjUwNzUKdiAxLjg1MTM4MjY0NTAzNjMwMDUgMC42OTkwMjE0MzE0NTU5MDcxCnYgMS40MTY3NDY0NzM3MjE3NzQ4IDEuMTA1NDUyMDAzODY4OTUzMwp2IC0wLjYzNzUzMjAwNDQ2Mzk1NTMgLTEuNzg5ODkzMjE4MDQ0MzQ4OAp2IDAuMTY4NDIwMjQ1MTk0MTEyMTQgLTEuNzg3NTMyNTY5NDc5MTQzMwp2IDAuMjE2MjQ5NTI5MzE3OTYwNTQgLTAuODQ4MzAzNDk5MzA2OTI0NAp2IC0wLjAyMDc3OTAwNTMzNDExNjE0IDAuMjcyMDc0MjkzNTkyMTIxMQp2IC0wLjQ4NDgwOTQ0Njg4OTY2MTA0IDAuNTUxODQ0MzQ5MTMwODkKdiAtMS4zMDY4MDg4OTIzMzQxMjE3IDAuNTcxMjE4MzMwNzY3MjI2Ngp2IDAuNzc1NTE2Njc5NDczMDExNSAyLjE0ODA4MTkwNDEyMDc0Nwp2IDAuMTIwNTkwOTY2MDI5MTUzNjYgMi4yNTEwNjc2NTkzNDkxNTIKdiAtMC42MDk4NzU5MzExMTc4MTggMS44ODg1OTE4MzczMjQ5OTUyCnYgLTAuMjExMjA1MjIxMzgwNzU0NDMgMS4xMjI0NjUzMzY5NDAwODIKdiAxLjE4MjEwNTc0OTcyNzgwMjcgLTEuOTE3Njk2MzE4NzMzMDI5MQp2IDEuMzAxODEwNjg2MjU0OTQ2OCAtMS4wNDc0OTYzMTU1ODU2MTQKdiAwLjUzOTA4NzU2NjM4MDY4NjcgLTAuNzU0ODg2OTkyMjk4MjgyCnYgLTEuMTg3MTAzOTU4Mjg2NDIyNSAxLjQ0MTQxODMzMzkxNDY0MjIKdiAxLjg3OTAzODcxMDk0NDEwNjcgLTAuNjAwMzIyODEyMTc1MjYyNwp2IDIuNjA5NTA1NjEwNTcwNTIxNyAtMC4yMzc4NDY5OTAxNTExMDQ3Mgp2IDIuNjU3MzM0ODk0Njk0MzY5MyAwLjcwMTM4MjA4MDAyMTExNDQKdiAtMi4zMjA0OTQzODk0Mjk0NzggMC43MDEzODIwODAwMjExMTQKdiAtMi4zNjgzMjM2NzM1NTMzMjggLTAuMjM3ODQ2OTkwMTUxMTA0NDQKZiAxIDIgMyA0IDUKZiA2IDcgOCA5IDEwCmYgMiAxMSAxMiAxMyAzCmYgMyAxNCAxNSAxNiA0CmYgNiAxNyAxOCAxOSAyMApmIDYgMjAgMTUgMTQgNwpmIDEyIDIxIDIyIDIzIDEzCmYgMyAxMyAyMyA3IDE0CmYgMjAgMTkgMjQgMTYgMTUKZiA3IDIzIDIyIDI1IDgKZiA4IDI1IDI2IDI3IDkKZiAyOCAyOSA1IDQgMTYKcHggNC45Nzc4MjkyODQxMjM4NDggMApweSAyLjQ4ODkxNDY0OTUwMDI1NyAyLjQ4ODkxNDY0OTUwMDI1NwpmYyAwCmZjIDEKZmMgMQpmYyAxCmZjIDEKZmMgMApmYyAwCmZjIDAKZmMgMApmYyAxCmZjIDAKZmMgMQo=",za="data:application/octet-stream;base64,diAwLjUzMjUzNjU5OTk5OTk5OTkgMC4xNTcxMzcwMDAwMDAwMDA1Mwp2IC0wLjIwMzgxOTQwMDAwMDAwMDEgMC4xNTcxMzcwMDAwMDAwMDA1Mwp2IC0wLjIwMzgxOTQwMDAwMDAwMDEgLTAuNTc5MjE5OTk5OTk5OTk5NAp2IDAuNTMyNTM2NTk5OTk5OTk5OSAtMC41NzkyMTk5OTk5OTk5OTk0CnYgMC4xNjQzNTg1OTk5OTk5OTk5NyAwLjc5NDg0MDAwMDAwMDAwMDUKdiAtMC44NDE1MjM0IC0wLjIxMTA0MTk5OTk5OTk5OTUKdiAwLjE2NDM1ODU5OTk5OTk5OTk3IC0xLjIxNjkyMzk5OTk5OTk5OTcKdiAxLjE3MDI0MDYgLTAuMjExMDQxOTk5OTk5OTk5NQp2IC0wLjg0MTUyMzQgMC41MjUzMTUwMDAwMDAwMDA0CnYgLTAuNDczMzQ1NDAwMDAwMDAwMTQgMS4xNjMwMTkwMDAwMDAwMDA1CmYgMSAyIDMgNApmIDEgNSAyCmYgMiA2IDMKZiAzIDcgNApmIDQgOCAxCmYgOSAyIDUgMTAKcHggMS4zNzQwNiAtMC4zNjgxNzc5OTk5OTk5OTk5CnB5IC0xLjAwNTg4MjAwMDAwMDAwMDIgMS43NDIyMzg5OTk5OTk5OTk5Cg==",Oa="data:application/octet-stream;base64,IyBQbGFuZSBUaWxpbmcgVW5pdCBQYXR0ZXJuIEV4cG9ydAp2IDUwLjAwMDAwMCAwIDAuMAp2IDI1LjAwMDAwMCA0My4zMDEyNyAwLjAKdiAtMjUuMDAwMDAwIDQzLjMwMTI3IDAuMAp2IC01MC4wMDAwMDAgMCAwLjAKdiAtMjUuMDAwMDAwIC00My4zMDEyNyAwLjAKdiAyNS4wMDAwMDAgLTQzLjMwMTI3IDAuMApmIDEgMiAzIDQgNSA2CnYgLTc1LjAwMDAwMCA0My4zMDEyNyAwLjAKdiAtNTAuMDAwMDAwIDAgMC4wCnYgLTI1LjAwMDAwMCA0My4zMDEyNyAwLjAKZiA3IDggOQp2IDI1LjAwMDAwMCA5My4zMDEyNyAwLjAKdiAtMjUuMDAwMDAwIDkzLjMwMTI3IDAuMAp2IC0yNS4wMDAwMDAgNDMuMzAxMjcgMC4wCnYgMjUuMDAwMDAwIDQzLjMwMTI3IDAuMApmIDEwIDExIDEyIDEzCnYgNzUuMDAwMDAwIC00My4zMDEyNyAwLjAKdiA1MC4wMDAwMDAgMCAwLjAKdiAyNS4wMDAwMDAgLTQzLjMwMTI3IDAuMApmIDE0IDE1IDE2CnYgLTI1LjAwMDAwMCA5My4zMDEyNyAwLjAKdiAtNzUuMDAwMDAwIDkzLjMwMTI3IDAuMAp2IC03NS4wMDAwMDAgNDMuMzAxMjcgMC4wCnYgLTI1LjAwMDAwMCA0My4zMDEyNyAwLjAKZiAxNyAxOCAxOSAyMApweCAxMDAuMDAwMDAwIDAKcHkgLTEwMC4wMDAwMDAgMTM2LjYwMjU0Cg==",Pa="data:application/octet-stream;base64,IyBQbGFuZSBUaWxpbmcgVW5pdCBQYXR0ZXJuIEV4cG9ydAp2IDI1LjAwMDAwMCA0My4zMDEyNzAgMC4wCnYgLTI1LjAwMDAwMCA0My4zMDEyNzAgMC4wCnYgLTUwLjAwMDAwMCAwLjAwMDAwMCAwLjAKdiAtMjUuMDAwMDAwIC00My4zMDEyNzAgMC4wCnYgMjUuMDAwMDAwIC00My4zMDEyNzAgMC4wCnYgNTAuMDAwMDAwIC0wLjAwMDAwMCAwLjAKZiAxIDIgMyA0IDUgNgp2IDI1LjAwMDAwMCAtNDMuMzAxMjcwIDAuMAp2IC0yNS4wMDAwMDAgLTQzLjMwMTI3MCAwLjAKdiAtMjUuMDAwMDAwIC05My4zMDEyNzAgMC4wCnYgMjUuMDAwMDAwIC05My4zMDEyNzAgMC4wCmYgNyA4IDkgMTAKdiAtMjUuMDAwMDAwIC00My4zMDEyNzAgMC4wCnYgLTUwLjAwMDAwMCAwLjAwMDAwMCAwLjAKdiAtOTMuMzAxMjcwIC0yNS4wMDAwMDAgMC4wCnYgLTY4LjMwMTI3MCAtNjguMzAxMjcwIDAuMApmIDExIDEyIDEzIDE0CnYgLTUwLjAwMDAwMCAwLjAwMDAwMCAwLjAKdiAtMjUuMDAwMDAwIDQzLjMwMTI3MCAwLjAKdiAtNjguMzAxMjcwIDY4LjMwMTI3MCAwLjAKdiAtOTMuMzAxMjcwIDI1LjAwMDAwMCAwLjAKZiAxNSAxNiAxNyAxOAp2IC0yNS4wMDAwMDAgLTkzLjMwMTI3MCAwLjAKdiAtMjUuMDAwMDAwIC00My4zMDEyNzAgMC4wCnYgLTY4LjMwMTI3MCAtNjguMzAxMjcwIDAuMApmIDE5IDIwIDIxCnYgLTkzLjMwMTI3MCAtMjUuMDAwMDAwIDAuMAp2IC01MC4wMDAwMDAgMC4wMDAwMDAgMC4wCnYgLTkzLjMwMTI3MCAyNS4wMDAwMDAgMC4wCmYgMjIgMjMgMjQKcHggMTE4LjMwMTI3MCAtNjguMzAxMjcwCnB5IDAuMDAwMDAwIDEzNi42MDI1NDAK",Ra="data:application/octet-stream;base64,diAxLjE4MTQ2MDI5ODE2MDg4MjIgLTAuMjc5NTM2NTA3NDU0MDIyMQp2IDAuNTkwNzMwMTQ5MDgwNDQxMSAwLjc0MzYzODExOTg0NDg3NTMKdiAtMC41OTA3MzAxNDkwODA0NDExIDAuNzQzNjM4MTE5ODQ0ODc1Mwp2IC0xLjE4MTQ2MDI5ODE2MDg4MjIgLTAuMjc5NTM2NTA3NDU0MDIyMQp2IC0wLjU5MDczMDE0OTA4MDQ0MTEgLTEuMzAyNzExMTM0NzUyOTE5NAp2IDAuNTkwNzMwMTQ5MDgwNDQxMSAtMS4zMDI3MTExMzQ3NTI5MTk0CnYgMC41OTA3MzAxNDkwODA0NDExIDEuOTI1MDk4NDE4MDA1NzU3NQp2IC0wLjU5MDczMDE0OTA4MDQ0MTEgMS45MjUwOTg0MTgwMDU3NTc1CnYgLTAuNTkwNzMwMTQ5MDgwNDQxMSAtMi40ODQxNzE0MzI5MTM4MDE2CnYgMC41OTA3MzAxNDkwODA0NDExIC0yLjQ4NDE3MTQzMjkxMzgwMTYKdiAxLjYxMzkwNDc3NjM3OTMzODQgLTEuODkzNDQxMjgzODMzMzYwNwp2IDIuMjA0NjM0OTI1NDU5Nzc5NSAtMC44NzAyNjY2NTY1MzQ0NjMzCnYgLTEuNjEzOTA0Nzc2Mzc5MzM4NCAxLjMzNDM2ODI2ODkyNTMxNjIKdiAtMi4yMDQ2MzQ5MjU0NTk3Nzk1IDAuMzExMTkzNjQxNjI2NDE5MDUKdiAyLjIwNDYzNDkyNTQ1OTc3OTUgMC4zMTExOTM2NDE2MjY0MTkwNQp2IDEuNjEzOTA0Nzc2Mzc5MzM4NCAxLjMzNDM2ODI2ODkyNTMxNjIKdiAtMi4yMDQ2MzQ5MjU0NTk3Nzk1IC0wLjg3MDI2NjY1NjUzNDQ2MzMKdiAtMS42MTM5MDQ3NzYzNzkzMzg0IC0xLjg5MzQ0MTI4MzgzMzM2MDcKdiAtMS42MTM5MDQ3NzYzNzkzMzg0IDIuNTE1ODI4NTY3MDg2MTk4NAp2IDEuNjEzOTA0Nzc2Mzc5MzM4NCAyLjUxNTgyODU2NzA4NjE5ODQKZiAxIDIgMyA0IDUgNgpmIDcgOCAzIDIKZiA5IDEwIDYgNQpmIDExIDEyIDEgNgpmIDEzIDE0IDQgMwpmIDE1IDE2IDIgMQpmIDE3IDE4IDUgNApmIDEzIDMgOApmIDE2IDcgMgpmIDE3IDQgMTQKZiA5IDUgMTgKZiAxMSA2IDEwCmYgMTIgMTUgMQpmIDE5IDEzIDgKZiAyMCA3IDE2CnB4IDAgLTQuNDA5MjY5ODUwOTE5NTU5CnB5IDMuODE4NTM5NzAxODM5MTE4MyAtMi4yMDQ2MzQ5MjU0NTk3Nzk1CmZjIDAKZmMgMQpmYyAxCmZjIDEKZmMgMQpmYyAxCmZjIDEKZmMgMApmYyAwCmZjIDAKZmMgMApmYyAwCmZjIDAKZmMgMQpmYyAxCg==",Ua="data:application/octet-stream;base64,diAwLjkxNTA2MzUxMTk5NjE4OTggLTUuMjAxNTMzODQ5NjY0MTQ0NWUtMTcKdiAwLjQ1NzUzMTc1NTk5ODA5NDkgMC43OTI0NjgyNDQwMDE5MDUyCnYgLTAuNDU3NTMxNzU1OTk4MDk0OSAwLjc5MjQ2ODI0NDAwMTkwNTIKdiAtMC45MTUwNjM1MTE5OTYxODk4IC01LjIwMTUzMzg0OTY2NDE0NDVlLTE3CnYgLTAuNDU3NTMxNzU1OTk4MDk0OSAtMC43OTI0NjgyNDQwMDE5MDUyCnYgMC40NTc1MzE3NTU5OTgwOTQ5IC0wLjc5MjQ2ODI0NDAwMTkwNTIKdiAwLjQ1NzUzMTc1NTk5ODA5NDkgMS43MDc1MzE3NTU5OTgwOTUxCnYgLTAuNDU3NTMxNzU1OTk4MDk0OSAxLjcwNzUzMTc1NTk5ODA5NTEKdiAtMS4yNTAwMDAwMDAwMDAwMDAyIDEuMjUwMDAwMDAwMDAwMDAwMgp2IC0xLjcwNzUzMTc1NTk5ODA5NTEgMC40NTc1MzE3NTU5OTgwOTQ4Nwp2IDEuNzA3NTMxNzU1OTk4MDk1MSAwLjQ1NzUzMTc1NTk5ODA5NDg3CnYgMS4yNTAwMDAwMDAwMDAwMDAyIDEuMjUwMDAwMDAwMDAwMDAwMgp2IDAgMi41MDAwMDAwMDAwMDAwMDA0CnYgLTAuNDU3NTMxNzU1OTk4MDk0OSAtMS43MDc1MzE3NTU5OTgwOTUxCnYgMC40NTc1MzE3NTU5OTgwOTQ5IC0xLjcwNzUzMTc1NTk5ODA5NTEKdiAwIC0yLjUwMDAwMDAwMDAwMDAwMDQKdiAxLjcwNzUzMTc1NTk5ODA5NTEgLTAuNDU3NTMxNzU1OTk4MDk1CnYgLTEuNzA3NTMxNzU1OTk4MDk1MSAtMC40NTc1MzE3NTU5OTgwOTUKdiAtMS4yNTAwMDAwMDAwMDAwMDAyIC0xLjI1MDAwMDAwMDAwMDAwMDIKdiAxLjI1MDAwMDAwMDAwMDAwMDIgLTEuMjUwMDAwMDAwMDAwMDAwMgpmIDEgMiAzIDQgNSA2CmYgNyA4IDMgMgpmIDkgMTAgNCAzCmYgMTEgMTIgMiAxCmYgOCA5IDMKZiAxMiA3IDIKZiAxMyA4IDcKZiAxNCAxNSA2IDUKZiAxNiAxNSAxNApmIDE3IDExIDEKZiAxOCA0IDEwCmYgMTggMTkgNSA0CmYgMjAgMTcgMSA2CmYgMTkgMTQgNQpmIDIwIDYgMTUKcHggLTEuNzA3NTMxNzU1OTk4MDk1MSAtMi45NTc1MzE3NTU5OTgwOTUKcHkgMy40MTUwNjM1MTE5OTYxOTAzIDAKZmMgMApmYyAxCmZjIDEKZmMgMQpmYyAwCmZjIDAKZmMgMApmYyAxCmZjIDAKZmMgMApmYyAwCmZjIDEKZmMgMQpmYyAwCmZjIDAK",ka="data:application/octet-stream;base64,diAzLjQ2MDIwOTcxOTE5NjUxNzdlLTE2IC0wLjc2OTIzMDc2OTIzMDc2ODkKdiAtMC42Njk4NzI5Nzk3MTkyNTUgLTEuOTI5NDg0ODA5NzkyMjYxNAp2IDAuNjY5ODcyOTc5NzE5MjU0NiAtMS45Mjk0ODQ4MDk3OTIyNjAzCnYgMS4zMzk3NDU5NTk0Mzg1MDg2IC0wLjc2OTIzMDc2OTIzMDc2OQp2IC0wLjY2OTg3Mjk3OTcxOTI1NTEgMC4zOTEwMjMyNzEzMzA3MjIyCnYgMC42Njk4NzI5Nzk3MTkyNTQ3IDAuMzkxMDIzMjcxMzMwNzIyOQp2IC0xLjMzOTc0NTk1OTQzODUwODQgLTAuNzY5MjMwNzY5MjMwNzY4OQp2IDAuNjY5ODcyOTc5NzE5MjU0NiAxLjczMDc2OTIzMDc2OTIzMDgKdiAtMC42Njk4NzI5Nzk3MTkyNTQ1IDEuNzMwNzY5MjMwNzY5MjI5Nwp2IC0xLjgzMDEyNzAyMDI4MDc0NTEgMS4wNjA4OTYyNTEwNDk5NzYyCnYgLTIuNSAtMC4wOTkzNTc3ODk1MTE1MTQ5Ngp2IDEuODMwMTI3MDIwMjgwNzQ1NCAxLjA2MDg5NjI1MTA0OTk3NjYKdiAyLjQ5OTk5OTk5OTk5OTk5OTYgLTAuMDk5MzU3Nzg5NTExNTE1MzcKZiAxIDIgMwpmIDQgMSAzCmYgNSAxIDYKZiA3IDEgNQpmIDIgMSA3CmYgNiAxIDQKZiA4IDkgNSA2CmYgMTAgNSA5CmYgMTAgMTEgNyA1CmYgMTIgOCA2CmYgMTMgMTIgNiA0CnB4IDAgMy42NjAyNTQwNDA1NjE0OTEKcHkgMy4xNjk4NzI5OTUxODkzMDggLTEuODMwMTI3MDIwMjgwNzQ1NgpmYyAxCmZjIDEKZmMgMQpmYyAxCmZjIDAKZmMgMApmYyAwCmZjIDEKZmMgMApmYyAxCmZjIDAK",ja="data:application/octet-stream;base64,IyBQbGFuZSBUaWxpbmcgVW5pdCBQYXR0ZXJuIEV4cG9ydAp2IDUwLjAwMDAwMCAwIDAuMAp2IDI1LjAwMDAwMCA0My4zMDEyNyAwLjAKdiAtMjUuMDAwMDAwIDQzLjMwMTI3IDAuMAp2IC01MC4wMDAwMDAgMCAwLjAKdiAtMjUuMDAwMDAwIC00My4zMDEyNyAwLjAKdiAyNS4wMDAwMDAgLTQzLjMwMTI3IDAuMApmIDEgMiAzIDQgNSA2CnYgLTAuMDAwMDAwIDg2LjYwMjU0IDAuMAp2IC0yNS4wMDAwMDAgNDMuMzAxMjcgMC4wCnYgMjUuMDAwMDAwIDQzLjMwMTI3IDAuMApmIDcgOCA5CnYgLTUwLjAwMDAwMCAtODYuNjAyNTQgMC4wCnYgLTI1LjAwMDAwMCAtMTI5LjkwMzgxMSAwLjAKdiAyNS4wMDAwMDAgLTEyOS45MDM4MTEgMC4wCnYgNTAuMDAwMDAwIC04Ni42MDI1NCAwLjAKdiAyNS4wMDAwMDAgLTQzLjMwMTI3IDAuMAp2IC0yNS4wMDAwMDAgLTQzLjMwMTI3IDAuMApmIDEwIDExIDEyIDEzIDE0IDE1CnYgMC4wMDAwMDAgLTE3My4yMDUwODEgMC4wCnYgMjUuMDAwMDAwIC0xMjkuOTAzODExIDAuMAp2IC0yNS4wMDAwMDAgLTEyOS45MDM4MTEgMC4wCmYgMTYgMTcgMTgKdiA3NS4wMDAwMDAgLTQzLjMwMTI3IDAuMAp2IDUwLjAwMDAwMCAwIDAuMAp2IDI1LjAwMDAwMCAtNDMuMzAxMjcgMC4wCmYgMTkgMjAgMjEKdiA3NS4wMDAwMDAgLTQzLjMwMTI3IDAuMAp2IDI1LjAwMDAwMCAtNDMuMzAxMjcgMC4wCnYgNTAuMDAwMDAwIC04Ni42MDI1NCAwLjAKZiAyMiAyMyAyNAp2IC03NS4wMDAwMDAgLTQzLjMwMTI3IDAuMAp2IC0yNS4wMDAwMDAgLTQzLjMwMTI3IDAuMAp2IC01MC4wMDAwMDAgMCAwLjAKZiAyNSAyNiAyNwp2IC03NS4wMDAwMDAgLTQzLjMwMTI3IDAuMAp2IC01MC4wMDAwMDAgLTg2LjYwMjU0IDAuMAp2IC0yNS4wMDAwMDAgLTQzLjMwMTI3IDAuMApmIDI4IDI5IDMwCnB4IDc1LjAwMDAwMCAxMjkuOTAzODExCnB5IDc1LjAwMDAwMCAtMTI5LjkwMzgxMQo=",Fa="data:application/octet-stream;base64,diAyLjExMTkyNDYwMzA3MzEyODUgLTEuNzQ3NjMyNDAyMDc0NDcyNQp2IDIuNTY5NDU2MzQ5NTUxMzYyIC0wLjk1NTE2NDE0ODU1MjcwNTYKdiAyLjU2OTQ1NjM0OTU1MTM2MiAtMC4wNDAxMDA2NTU1OTYyMzg4CnYgMi4xMTE5MjQ2MDMwNzMxMjg1IDAuNzUyMzY3NTk3OTI1NTI3OQp2IDEuMzE5NDU2MzQ5NTUxMzYxOCAxLjIwOTg5OTM0NDQwMzc2MQp2IDAuNDA0MzkyODU2NTk0ODk1MTYgMS4yMDk4OTkzNDQ0MDM3NjEKdiAtMC4zODgwNzUzOTY5MjY4NzE0MyAwLjc1MjM2NzU5NzkyNTUyNzkKdiAtMC44NDU2MDcxNDM0MDUxMDQ4IC0wLjA0MDEwMDY1NTU5NjIzODgKdiAtMC44NDU2MDcxNDM0MDUxMDQ4IC0wLjk1NTE2NDE0ODU1MjcwNTYKdiAtMC4zODgwNzUzOTY5MjY4NzE0MyAtMS43NDc2MzI0MDIwNzQ0NzI1CnYgMC40MDQzOTI4NTY1OTQ4OTUxNiAtMi4yMDUxNjQxNDg1NTI3MDU2CnYgMS4zMTk0NTYzNDk1NTEzNjE4IC0yLjIwNTE2NDE0ODU1MjcwNTYKdiAxLjMxOTQ1NjM0OTU1MTM2MTggMi4xMjQ5NjI4NzI3MTU1NjcKdiAwLjQwNDM5Mjg1NjU5NDg5NTE2IDIuMTI0OTYyODcyNzE1NTY3CnYgLTEuMTgwNTQzNjUwNDQ4NjM4IDEuMjA5ODk5MzQ0NDAzNzYxCnYgLTEuNjM4MDc1Mzk2OTI2ODcxNSAwLjQxNzQzMTEyNjIzNzMzMzgKdiAtMS42MzgwNzUzOTY5MjY4NzE1IC0xLjQxMjY5NTkzMDM4NjI3ODUKdiAtMS4xODA1NDM2NTA0NDg2MzggLTIuMjA1MTY0MTQ4NTUyNzA1Ngp2IC0wLjM4ODA3NTM5NjkyNjg3MTQzIDIuNTgyNDk0NjE5MTkzODAwMwp2IC0xLjE4MDU0MzY1MDQ0ODYzOCAyLjEyNDk2Mjg3MjcxNTU2Nwp2IC0yLjQzMDU0MzY1MDQ0ODYzOCAtMC4wNDAxMDA2NTU1OTYyMzg4CnYgLTIuNDMwNTQzNjUwNDQ4NjM4IC0wLjk1NTE2NDE0ODU1MjcwNTYKZiAxIDIgMyA0IDUgNiA3IDggOSAxMCAxMSAxMgpmIDEzIDE0IDYgNQpmIDE1IDE2IDggNwpmIDE3IDE4IDEwIDkKZiAxNCAxOSAyMCAxNSA3IDYKZiAxNiAyMSAyMiAxNyA5IDgKcHggMCA0LjMzMDEyNzAyMTI2ODI3MjUKcHkgMy43NSAtMi4xNjUwNjM1MjgzMTE4MDYKZmMgMApmYyAxCmZjIDEKZmMgMQpmYyAwCmZjIDAK",Ba="data:application/octet-stream;base64,diAyLjExMTkyNDYwMzA3MzEzIC0xLjc0NzYzMjQwMjA3NDQ3MjUKdiAyLjcxODEyODM3ODA3NzkwMjQgLTEuMDQwNzYzNjU4MjU2MDEKdiAyLjcyMjA5OTU3NDI3Nzk3MTQgLTAuMTA5NjA1MzUxODg3OTcyMzcKdiAyLjQxMzA1NTgyODEzMjg1OTYgMC43Njk0NDE0Mzk4ODg2MjYyCnYgMS42MTAzOTg4ODczNjAzNjU4IDEuMjQyMjMzMTAzNTk1NDkyOAp2IDAuNjk0MTYyOTg1MTIwNzY2OSAxLjQxMzk3MjA5MTc3MjIxNAp2IC0wLjExNTYzNTcxOTY4MjQ5NjEzIDAuOTUyNTYwODQ2NTIzNzMzMgp2IC0wLjcyMTkyNjEzNDEyNzE1NDUgMC4yNDQ2MDk3NjE1NjQxMzI2NAp2IC0wLjczMDY1Mzc1NzQyMjQ4MTQgLTAuNjg3NjcxMDAzNDYzNTc5MQp2IC0wLjQyMTY5NjY1MDcxNzI1MTUgLTEuNTY3ODAwMTM2MzgxMzE2Mwp2IDAuMzg1MjA1ODc4NDE1NTM2NyAtMi4wMzYwMjU3OTY1NzgzMTg0CnYgMS4zMDEzNTUxNDEyMTUyNTEgLTIuMjA4ODQ3MTQzNTczODUyCnYgMS4zMDEzNTUxNDEyMTUyNTI0IDIuMTIxMjc5ODc3Njk0NDIwNgp2IDAuMzg1MjA1ODc4NDE1NTM3MyAyLjI5NDEwMTIyNDY4OTk1Mgp2IC0xLjAzMTg3MTYyMTkyMjA5NDUgMS4xMjQyOTk4MzQ3MDA0NTYKdiAtMS42MzgwNzUzOTY5MjY4NzA5IDAuNDE3NDMxMTI2MjM3MzM0Mgp2IC0xLjMzNjk0NDE3MTg2NzE0MDkgLTEuMzk1NjIyMDg4NDIzMTc5Ngp2IC0xLjAyNzkwMDQyNTcyMjAyNjggLTIuMjc0NjY4ODQ0ODQ0NDM3Nwp2IC0wLjQyMTY5NjY1MDcxNzI1MTA0IDIuNzYyMzI2ODg0ODg2OTU0Nwp2IC0xLjAyNzkwMDQyNTcyMjAyNyAyLjA1NTQ1ODE3NjQyMzgzNTMKdiAtMi40NDg2NDQ4NTg3ODQ3NDY3IC0wLjA0Mzc4MzY1MDYxNzM4NTMzCnYgLTIuMTM5NjAxMTEyNjM5NjM1NyAtMC45MjI4MzAzODkzNjA5NzQKZiAxIDIgMyA0IDUgNiA3IDggOSAxMCAxMSAxMgpmIDEzIDE0IDYgNQpmIDE1IDE2IDggNwpmIDE3IDE4IDEwIDkKZiAxNCAxOSAyMCAxNSA3IDYKZiAxNiAyMSAyMiAxNyA5IDgKcHggMCA0LjMzMDEyNzAyMTI2ODI3MjUKcHkgMy43NSAtMi4xNjUwNjM1MjgzMTE4MDYKZmMgMApmYyAxCmZjIDEKZmMgMQpmYyAwCmZjIDAK",Ga="data:application/octet-stream;base64,diAxLjc2Nzc2Njk2MDM2MzE4ODcgLTEuMzc4Njc5NjY2Njk4MzQ1Mgp2IDEuNzY3NzY2OTYwMzYzMTg4NyAwLjA4NTc4NjQ1MDg0MzYyMDYyCnYgMC43MzIyMzMwNTg3NzA5ODMgMS4xMjEzMjAzNTI0MzU4MjY0CnYgLTAuNzMyMjMzMDU4NzcwOTgzIDEuMTIxMzIwMzUyNDM1ODI2NAp2IC0xLjc2Nzc2Njk2MDM2MzE4ODcgMC4wODU3ODY0NTA4NDM2MjA2Mgp2IC0xLjc2Nzc2Njk2MDM2MzE4ODcgLTEuMzc4Njc5NjY2Njk4MzQ1Mgp2IC0wLjczMjIzMzA1ODc3MDk4MyAtMi40MTQyMTM1NjgyOTA1NTEKdiAwLjczMjIzMzA1ODc3MDk4MyAtMi40MTQyMTM1NjgyOTA1NTEKdiAwLjczMjIzMzA1ODc3MDk4MyAyLjU4NTc4NjQzMTcwOTQ0OQp2IC0wLjczMjIzMzA1ODc3MDk4MyAyLjU4NTc4NjQzMTcwOTQ0OQpmIDEgMiAzIDQgNSA2IDcgOApmIDkgMTAgNCAzCnB4IDIuNDk5OTk5OTgwODY1ODI4NCAyLjQ5OTk5OTk4MDg2NTgyODQKcHkgMi40OTk5OTk5ODA4NjU4Mjg0IC0yLjQ5OTk5OTk4MDg2NTgyODQKZmMgMApmYyAxCg==",Va="data:application/octet-stream;base64,diAxLjU2MzY1Njk4NTg4ODI1MDUgLTAuNjI1CnYgMC42MDE0MDY1MzMwMzM5NDI0IDEuMDQxNjY2NjY2NjY2NjY2NQp2IC0xLjMyMzA5NDM3MjY3NDY3MzMgMS4wNDE2NjY2NjY2NjY2NjY1CnYgLTIuMjg1MzQ0ODI1NTI4OTgxNCAtMC42MjUKdiAtMS4zMjMwOTQzNzI2NzQ2NzMzIC0yLjI5MTY2NjY2NjY2NjY2NjUKdiAwLjYwMTQwNjUzMzAzMzk0MjQgLTIuMjkxNjY2NjY2NjY2NjY2NQp2IC0wLjM2MDg0MzkxOTgyMDM2NTUgMi43MDgzMzMzMzMzMzMzMzMKdiAyLjUyNTkwNzQzODc0MjU1ODQgMS4wNDE2NjY2NjY2NjY2NjY1CmYgMSAyIDMgNCA1IDYKZiA3IDMgMgpmIDggMiAxCnB4IDMuODQ5MDAxODExNDE3MjMyIDAKcHkgLTEuOTI0NTAwOTA1NzA4NjE2IDMuMzMzMzMzMzMzMzMzMzMzCmZjIDAKZmMgMQpmYyAxCg==",Ya="data:application/octet-stream;base64,diAwIDAKdiAxIDAKdiAxIDEKdiAwIDEKZiAxIDIgMwpmIDEgMyA0CgpweCAxIDAKcHkgMCAx",Ha="data:application/octet-stream;base64,diAwIDAKdiAxIDAKdiAxIDEKdiAwIDEKZiAxIDIgMyA0CgpweCAxIDAKcHkgMCAxCgpyZXAyeDI=",Wa="data:application/octet-stream;base64,diAtMS40OTk5OTk5OTk5OTk5OTkgLTIuMzMzMzMzMzMzMzMzMzMyNgp2IDAuMzc3Nzk2MTk4MTE2NDIxNTcgLTEuNDMwMzEyOTM5MDEwNDIwNgp2IDIuMzg1Njc5MjgwNDA1MjIxIC0xLjk5MDAxMzAxOTE1NDI3Ngp2IDEuNDkyMTE2OTE3NzExMjAzMyAtMC4xMDY5NjY1ODY1MjI4MDk0NQp2IDIuMDQ0NDYyODY0NzgzMDkgMS45MDMwMjAzOTQzMjI5MTM4CnYgMC4xNjY2NjY2NjY2NjY2NjcwNyAxLjAwMDAwMDAwMDAwMDAwMDQKdiAtMS44NDEyMTY0MTU2MjIxMyAxLjU1OTcwMDA4MDE0Mzg1Nwp2IC0wLjk0NzY1NDA1MjkyODExMjcgLTAuMzIzMzQ2MzUyNDg3NjEwNAp2IDAuNzE5MDEyNjEzNzM4NTUzNSAzLjAwOTk4Njk4MDg0NTcyNQp2IC0xLjI4ODg3MDQ2ODU1MDI0NCAzLjU2OTY4NzA2MDk4OTU4MTQKZiAxIDIgMyA0IDUgNiA3IDgKZiA2IDkgMTAgNwpweCAzLjMzMzMzMzMzMzMzMzMzMzUgLTEuNjY2NjY2NjY2NjY2NjY2NwpweSAxLjY2NjY2NjY2NjY2NjY2NjcgMy4zMzMzMzMzMzMzMzMzMzM1CmZjIDEKZmMgMAo=",Qa="data:application/octet-stream;base64,diAtMC40NzA4NjI1ODE3NjAwMzE0MyAtMS43NTcyODQ3NjMwOTcyNjQzCnYgMS4wMTQ1Njg3MDkxMTk5ODQ0IC0xLjc1NzI4NTE4OTM5NzAyNwp2IDEuNzU3Mjg0MzU0NTU5OTkyIC0wLjQ3MDg2Mjk5MDI5NzMwMzgzCnYgMC40NzA4NjI1ODE3NjAwMzE0MyAwLjI3MTg1MzA4MTQ0MjQ2NjU2CnYgLTAuNDcwODYyNTgxNzYwMDMxNDMgLTAuMjcxODUzMDQ1OTE3NDg2NQp2IC0yLjQ5OTk5OTk5OTk5OTk5OTYgLTAuODE1NTU5Mzg2NDI3MzIwNwp2IC0xLjk1NjI5Mzg3MjY0MDA0NyAtMS43NTcyODU0MDI1NDY5MDgKdiAtMS43NTcyODQzNTQ1NTk5OTIgMC40NzA4NjI4MTI2NzI0MDI0CnYgMi41IDAuODE1NTU5MjA4ODAyNDE5Nwp2IDEuOTU2MjkzODcyNjQwMDQ3NiAxLjc1NzI4NjA3NzUyMTUzMgp2IDAuNDcwODYyNTgxNzYwMDMxNDMgMS43NTcyODUyMjQ5MjIwMDcKdiAtMS4wMTQ1Njg3MDkxMTk5ODQ0IDEuNzU3Mjg0MzcyMzIyNDgyCmYgMSAyIDMgNCA1CmYgNiA3IDEgNSA4CmYgMyA5IDEwIDExIDQKZiA1IDQgMTEgMTIgOApweCAzLjUxNDU2ODcwOTExOTk4NCAtMC45NDE3MjU4MDI5Njk3MDYyCnB5IC0yLjU3Mjg0MzU0NTU5OTkyMTUgNC40NTYyOTY0MzA0Mzg2MjIKZmMgMApmYyAxCmZjIDEKZmMgMAo=",Ka="data:application/octet-stream;base64,diAtMC40NzA4NjI1ODE3NjAwMzE1NCAtMS43NTcyODQ3NjMwOTcyNjQzCnYgMC43NjQ1Njg3MDkxMTk5ODU4IC0yLjA4NzI4NDcwOTgwOTc5NQp2IDEuNzU3Mjg0MzU0NTU5OTkyOCAtMC40NzA4NjI2NzA1NzI0ODIwNAp2IDAuNTIxODUyNzQzOTU1NDQ0OCAtMC4xNDA4NjExMjUyMzYyODcxCnYgLTAuNTIxODUyNzQzOTU1NDQ1MiAwLjE0MDg2MTU4NzA2MTAyOTcyCnYgLTIuNzQ5OTk5OTk5OTk5OTk4IC0xLjE0NTU1ODkwNjg0MDA4NzMKdiAtMS43MDYyOTM4NzI2NDAwNDkgLTEuNDI3Mjg0OTIyOTU5Njc2Mgp2IC0xLjc1NzI4NDM1NDU1OTk5MzkgMC40NzA4NjMxMzIzOTcyMjQ1CnYgMi43NDk5OTk5OTk5OTk5OTczIDEuMTQ1NTU5Njg4Mzg5NjUyMgp2IDEuNzA2MjkzODcyNjQwMDQ3OCAxLjQyNzI4NjU1NzEwODc2NTQKdiAwLjQ3MDg2MjU4MTc2MDAzMTU0IDEuNzU3Mjg1MjI0OTIyMDA2OAp2IC0wLjc2NDU2ODcwOTExOTk4NjUgMi4wODcyODQ4NTE5MDk3MTQyCmYgMSAyIDMgNCA1CmYgNiA3IDEgNSA4CmYgMyA5IDEwIDExIDQKZiA1IDQgMTEgMTIgOApweCAzLjUxNDU2ODcwOTExOTk4NCAtMC45NDE3MjU4MDI5Njk3MDYyCnB5IC0yLjU3Mjg0MzU0NTU5OTkyMTUgNC40NTYyOTY0MzA0Mzg2MjIKZmMgMApmYyAxCmZjIDEKZmMgMAo=",Xa="data:application/octet-stream;base64,diAwIC0yLjUKdiAyLjE2NTA2MzUgLTEuMjUKdiAyLjE2NTA2MzUgMS4yNQp2IDAgMi41CnYgLTIuMTY1MDYzNSAxLjI1CnYgLTIuMTY1MDYzNSAtMS4yNQp2IDQuMzMwMTI3IDIuNQp2IDQuMzMwMTI3IDUKdiAyLjE2NTA2MzUgNi4yNQp2IDAgNQp2IDQuMzMwMTI3IC0yLjUKdiA2LjQ5NTE5MDUgLTEuMjUKdiA2LjQ5NTE5MDUgMS4yNQp2IDguNjYwMjU0IDIuNQp2IDguNjYwMjU0IDUKdiA2LjQ5NTE5MDUgNi4yNQpmIDEgMiAzIDQgNSA2CmYgMyA3IDggOSAxMCA0CmYgMTEgMTIgMTMgNyAzIDIKZiAxMyAxNCAxNSAxNiA4IDcKcHggOC42NjAyNTQgMApweSA0LjMzMDEyNyA3LjUK",Za="data:application/octet-stream;base64,diAwIDAKdiAxIDAKdiAxIDEKdiAwIDEKdiAyIDAKdiAyIDEKdiAxLjUgMC41CnYgMiAyCnYgMSAyCnYgMCAyCnYgMC41IDEuNQoKIyBCb3R0b20gbGVmdCBzcXVhcmUKZiAxIDIgMyA0CiMgQm90dG9tIHJpZ2h0IHRyaWFuZ2xlcwpmIDIgNSA3CmYgNSA2IDcKZiA2IDMgNwpmIDMgMiA3CiMgVG9wIHJpZ2h0IHNxdWFyZQpmIDMgNiA4IDkKIyBUb3AgbGVmdCB0cmlhbmdsZXMKZiA0IDMgMTEKZiAzIDkgMTEKZiA5IDEwIDExCmYgMTAgNCAxMQoKcHggMiAwCnB5IDAgMg==",Ro=new Worker(new URL("https://segaviv.github.io/tuttekiri/assets/worker-COmNgNFS.js",import.meta.url),{type:"module"});let Uo;const qa=new Promise(s=>Uo=s);let $a=0;const Fi=new Map;Ro.onmessage=s=>{const{type:e,id:t,result:n,error:i}=s.data;if(e==="initialized"){Uo();return}if(Fi.has(t)){const{resolve:r,reject:a}=Fi.get(t);Fi.delete(t),i?a(new Error(i)):r(n)}};async function Ze(s,...e){await qa;const t=$a++;return new Promise((n,i)=>{Fi.set(t,{resolve:n,reject:i}),Ro.postMessage({id:t,method:s,args:e})})}async function gi(s){return Ze("init_coloring",s)}async function st(s,e,t){return Ze("deploy",s,e,t)}async function Ja(s){return Ze("detect_unit_pattern",s)}async function tr(s){return Ze("replicate_2x2",s)}async function Mi(s,e){return Ze("test_make_deployable",s,e)}async function el(s,e){return Ze("change_periodicity",s,e)}async function tl(s){return Ze("dual",s)}async function nl(s){return Ze("find_all_good_colorings",s)}async function il(s,e){return Ze("deploy_unit_with_holes",s,e)}async function sl(s,e,t){return Ze("make_non_periodic",s,e,t)}async function rl(s,e,t,n,i){return Ze("make_non_periodic_in_box",s,e,t,n,i)}async function ol(s,e,t,n,i,r,a){return Ze("lift",s,e,t,n,i,r,a)}async function al(s,e,t){return Ze("init_optimization",s,e,t)}async function ll(){return Ze("optimize")}async function Os(){return Ze("get_optimized_patterns")}async function nr(s,e){return Ze("max_opening_angle",s,e)}async function cl(){return Ze("get_optimization_errors")}async function dl(){return Ze("get_optimization_parameters")}async function ul(s){return Ze("set_optimization_parameters",s)}async function hl(s){return Ze("conformalize",s)}async function fl(s){return Ze("optimize_fully_closed",s)}async function pl(s,e,t,n){return Ze("prevent_intersections",s,e,t,n)}async function ml(s,e){return Ze("mesh_to_pattern",s,e)}async function gl(s){return Ze("get_periodic_info",s)}function Ml(s){const t=[],n=new Map,i=new Array(s.vertices.length);for(let r=0;r<s.vertices.length;r++){const a=s.vertices[r],o=Math.round(a.x/.001),c=Math.round(a.y/.001),l=a.z?Math.round(a.z/.001):0,d=`${o},${c},${l}`;if(n.has(d))i[r]=n.get(d);else{const h=t.length;n.set(d,h),i[r]=h,t.push(a)}}for(const r of s.faces)for(let a=0;a<r.length;a++)r[a]=i[r[a]];return s.vertices=t,s}function xl(s){const e=s.split(`
`),t={};let n=null;for(let i of e){if(i=i.trim(),i.startsWith("#")||i==="")continue;const r=i.split(/\s+/),a=r[0];a==="newmtl"?(n=r[1],t[n]={}):a==="Kd"&&(t[n]=r.slice(1).map(o=>parseFloat(o)*255))}return t}function qi(s){const e=s.split(`
`),t=[],n=[],i=[],r=[],a=[],o=[];let c="";for(let l of e){if(l=l.trim(),l.startsWith("#")||l==="")continue;const d=l.split(/\s+/),h=d[0];if(h==="v")t.push({x:parseFloat(d[1]),y:parseFloat(d[2]),z:d.length>3?parseFloat(d[3]):0});else if(h==="vt")n.push({x:parseFloat(d[1]),y:parseFloat(d[2])});else if(h==="f"){const u=d.slice(1).map(m=>{const x=m.split("/")[0];return parseInt(x,10)-1});r.push(u),i.push(d.slice(1).map(m=>{const x=m.split("/")[1];return parseInt(x,10)-1})),o.push(c)}else if(h==="fc"){const u=d.slice(1).map(m=>parseInt(m));a.push(u)}else h==="usemtl"&&(c=d[1])}return{vertices:t,faces:r,face_colors:a,mtl_face_color_names:o,uvs:n,uv_faces:i}}function _l(s){const e=s.split(`
`),t=[],n=[],i=[];let r=[],a=[],o=1,c=1;for(let d of e){if(d=d.trim(),d.startsWith("#")||d==="")continue;const h=d.split(/\s+/),u=h[0];if(u==="v")t.push({x:parseFloat(h[1]),y:parseFloat(h[2])});else if(u==="f"){const m=h.slice(1).map(x=>{const p=x.split("/")[0];return parseInt(p,10)-1});n.push(m)}else if(u==="fc"){const m=parseInt(h[1]);i.push(m)}else if(u==="px"){const m=parseFloat(h[1]),x=parseFloat(h[2]);r=[m,x]}else if(u==="py"){const m=parseFloat(h[1]),x=parseFloat(h[2]);a=[m,x]}else u==="rep2x2"&&(o=2,c=2)}console.info("face colors",i);let l={vertices:t,faces:n,face_colors:i,periodicity:[r,a],repX:o,repY:c};return l=Ml(l),l}function ir(s){if(s.vertices.length===0)return;let e=1/0,t=1/0,n=-1/0,i=-1/0,r=0,a=0;s.vertices.forEach(d=>{d.x<e&&(e=d.x),d.y<t&&(t=d.y),d.x>n&&(n=d.x),d.y>i&&(i=d.y),r+=d.x,a+=d.y});const o=n-e,c=i-t;r/=s.vertices.length,a/=s.vertices.length,s.vertices.forEach(d=>{d.x-=r,d.y-=a});const l=Math.max(o,c);if(l>0){const h=5/l;return s.vertices.forEach(u=>{u.x*=h,u.y*=h,u.z!==void 0&&(u.z*=h)}),s.periodicity&&(Array.isArray(s.periodicity[0])&&(s.periodicity[0][0]*=h,s.periodicity[0][1]*=h),Array.isArray(s.periodicity[1])&&(s.periodicity[1][0]*=h,s.periodicity[1][1]*=h)),s.width=o*h,s.height=c*h,{width:s.width,height:s.height}}return s.width=o,s.height=c,{width:o,height:c}}function yl(s){if(s.startsWith("#")){let e=s.substring(1).split("");e.length===3&&(e=[e[0],e[0],e[1],e[1],e[2],e[2]]);const t=parseInt(e.join(""),16),n=t>>16&255,i=t>>8&255,r=t&255;return[n/255,i/255,r/255]}else if(s.startsWith("rgba")){const e=s.match(/(\d+),\s*(\d+),\s*(\d+)/);if(e)return[parseInt(e[1])/255,parseInt(e[2])/255,parseInt(e[3])/255]}return[.8,.8,.8]}function vl(s){const[e,t]=s[0],[n,i]=s[1],r=e*i-t*n;return Math.abs(r)<1e-9?null:[[i/r,-t/r],[-n/r,e/r]]}function sr(s,e){const{obj:t,mtl:n}=ko(s,{mtlFileName:`${e}.mtl`}),i=new Blob([t],{type:"text/plain"}),r=URL.createObjectURL(i),a=document.createElement("a");a.href=r,a.download=`${e}.obj`,document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(r);const o=new Blob([n],{type:"text/plain"}),c=URL.createObjectURL(o),l=document.createElement("a");l.href=c,l.download=`${e}.mtl`,document.body.appendChild(l),l.click(),document.body.removeChild(l),URL.revokeObjectURL(c)}function wl(s,e,t,n,i){const r=s*s,a=r*s,o=1-s,c=o*o,l=c*o,d=l*e.x+3*c*s*t.x+3*o*r*n.x+a*i.x,h=l*e.y+3*c*s*t.y+3*o*r*n.y+a*i.y,u=l*(e.z||0)+3*c*s*(t.z||0)+3*o*r*(n.z||0)+a*(i.z||0);return{x:d,y:h,z:u}}function ko(s,e={}){const{repX:t=1,repY:n=1,bbox:i=null,mtlFileName:r="tessellation_export.mtl",edgeStyles:a=[],edgeStyleMap:o={},periodicInfo:c=null}=e;let l=`# Exported from Plane Tessellations
`;l+=`mtllib ${r}
`;let d=`# Materials for Plane Tessellations
`;if(Pe.mtlInterpolation<1||!Pe.baseMesh.mtl_face_color_names){const _=(S,b)=>{const I=yl(b);return`newmtl ${S}
Kd ${I[0].toFixed(3)} ${I[1].toFixed(3)} ${I[2].toFixed(3)}

`};d+=_("Mat0","#BDE0FE"),d+=_("Mat1","#FFC2D1"),d+=_("Mat2",ke.faceColor2),d+=_("MatDefault",ke.fillColor),d+=_("MatUnit0","#7BB6FF"),d+=_("MatUnit1","#FF84B4"),d+=_("MatUnit2",ke.unitFaceColor2)}else Object.entries(Pe.color_map).forEach(([_,S])=>{d+=`newmtl ${_}
Kd ${S[0]/255} ${S[1]/255} ${S[2]/255}

`});let h=0,u=null;const m=(_,S)=>{if(Pe.mtlInterpolation<1||!Pe.baseMesh.mtl_face_color_names){if(!s.face_colors)return"MatDefault";const b=s.face_colors[_],I=S?"MatUnit":"Mat";return b===0?`${I}0`:b===1?`${I}1`:b===2?`${I}2`:"MatDefault"}else return Pe.baseMesh.mtl_face_color_names[_]};let x,p,f,y,w=!1;if(i){w=!0;const{minX:_,maxX:S,minY:b,maxY:I}=i,O=vl(Pe.baseMesh.periodicity);if(!O)x=0,p=0,f=0,y=0;else{const v=[{x:_,y:b},{x:S,y:b},{x:S,y:I},{x:_,y:I}];let D=1/0,R=-1/0,K=1/0,q=-1/0;v.forEach(C=>{const W=C.x*O[0][0]+C.y*O[0][1],Q=C.x*O[1][0]+C.y*O[0][1];D=Math.min(D,W),R=Math.max(R,W),K=Math.min(K,Q),q=Math.max(q,Q)});const L=1.5;x=Math.floor(D-L),p=Math.ceil(R+L),f=Math.floor(K-L),y=Math.ceil(q+L)}}else x=0,p=t-1,f=0,y=n-1;for(let _=x;_<=p;_++)for(let S=f;S<=y;S++){const b=s.periodicity[0],I=s.periodicity[1],O=b[0]*_+I[0]*S,v=b[1]*_+I[1]*S,D=Pe.baseMesh.periodicity[0].map(Q=>Q*_),R=Pe.baseMesh.periodicity[1].map(Q=>Q*S),K=h;for(const Q of s.vertices){const $=Q.z||0;l+=`v ${(Q.x+O).toFixed(6)} ${(Q.y+v).toFixed(6)} ${$.toFixed(6)}
`}h+=s.vertices.length;const q=_===0&&S===0,L=w?Pe.baseMesh.vertices.map(Q=>({x:Q.x+D[0]+R[0],y:Q.y+D[1]+R[1]})):null,C={};let W=Q=>Pe.renderMode==="bbox"?Q.x>=i.minX&&Q.x<=i.maxX&&Q.y>=i.minY&&Q.y<=i.maxY:Math.hypot(Q.x-Pe.circleShiftX,Q.y-Pe.circleShiftY)<=Pe.circleRadius;for(let Q=0;Q<s.faces.length;Q++){const $=s.faces[Q];if(w){let se=!0;for(const ce of Pe.baseMesh.faces[Q]){const V=L[ce];if(!W(V)){se=!1;break}}if(!se)continue}const Y=m(Q,q);Y!==u&&(l+=`usemtl ${Y}
`,u=Y);const ee=[];for(let se=0;se<$.length;se++){const ce=$[se],V=$[(se+1)%$.length];if(ee.push(ce+1+K),c&&o){const re=`${ce}_${V}`,{styleIdx:de,flip:U}=o[re]||{styleIdx:void 0,flip:0};if(de!==void 0&&a[de]){let ne=[];if(C[re]){const oe=C[re];ce===oe.src?ne=oe.indices:ne=[...oe.indices].reverse()}else{const le=a[de].points,ue=s.vertices[ce],xe=s.vertices[V];let _e=U%2==1,ye=Math.floor(U/2)==1^_e,we=_e?ue:xe,Ie=_e?xe:ue;const je={x:we.x+O,y:we.y+v,z:we.z||0},Ae={x:Ie.x+O,y:Ie.y+v,z:Ie.z||0},Le=Ae.x-je.x,Se=Ae.y-je.y,Te=Ae.z-je.z,Ke=-Se,He=Le,M=H=>({x:je.x+H.x*Le-(ye?-1:1)*H.y*Ke,y:je.y+H.x*Se-(ye?-1:1)*H.y*He,z:je.z+H.x*Te}),g=H=>{const X=M(H);return H.hIn?X.hIn=M(H.hIn):X.hIn={...X},H.hOut?X.hOut=M(H.hOut):X.hOut={...X},X},E=le.map(g),P=_e?E:E.slice().reverse(),k=[];for(let H=0;H<P.length-1;H++){const X=P[H],A=P[H+1],N=_e?X.hOut:X.hIn,ie=_e?A.hIn:A.hOut,ae=10;for(let he=1;he<ae;he++){const ge=he/ae,pe=wl(ge,X,N,ie,A);l+=`v ${pe.x.toFixed(6)} ${pe.y.toFixed(6)} ${pe.z.toFixed(6)}
`,h++,k.push(h)}H<P.length-2&&(l+=`v ${A.x.toFixed(6)} ${A.y.toFixed(6)} ${A.z.toFixed(6)}
`,h++,k.push(h))}C[re]={indices:k,src:ce,dst:V},ne=k}ne.forEach(oe=>ee.push(oe))}}}l+=`f ${ee.join(" ")}
`}}return{obj:l,mtl:d}}function Al(s){let e="";for(const t of s.vertices)e+=`v ${t.x} ${t.y}
`;for(const t of s.faces){const n=t.map(i=>i+1).join(" ");e+=`f ${n}
`}if(s.periodicity&&s.periodicity.length===2&&(e+=`px ${s.periodicity[0][0]} ${s.periodicity[0][1]}
`,e+=`py ${s.periodicity[1][0]} ${s.periodicity[1][1]}
`),s.face_colors&&s.face_colors.length===s.faces.length)for(let t=0;t<s.face_colors.length;t++){const n=s.face_colors[t];e+=`fc ${n}
`}return e}async function bl(s){let e=Number.MAX_VALUE,t=Number.MIN_VALUE,n=Number.MAX_VALUE,i=Number.MIN_VALUE,r=Number.MAX_VALUE,a=Number.MIN_VALUE,o=0,c=0;for(let d=0;d<s.vertices.length;d++){const h=s.vertices[d];e=Math.min(e,h.y),n=Math.min(n,h.x),r=Math.min(r,h.z),t=Math.max(t,h.y),i=Math.max(i,h.x),a=Math.max(a,h.z),o+=h.x,c+=h.z}o/=s.vertices.length,c/=s.vertices.length;for(let d=0;d<s.vertices.length;d++){const h=s.vertices[d];h.y-=e,h.x-=o,h.z-=c}const l=Math.max(i-n,t-e,a-r)/10;for(let d=0;d<s.vertices.length;d++){const h=s.vertices[d];h.x/=l,h.y/=l,h.z/=l}for(let d=0;d<s.uvs.length;d++){const h=s.uvs[d];h.x/=l,h.y/=l}return s}function Sl(s){let e=0,t=0,n=0;for(let i=0;i<s.vertices.length;i++){const r=s.vertices[i];e+=r.x,t+=r.y,r.z!==void 0&&(n+=r.z)}e/=s.vertices.length,t/=s.vertices.length,n/=s.vertices.length;for(let i=0;i<s.vertices.length;i++){const r=s.vertices[i];r.x-=e,r.y-=t,r.z!==void 0&&(r.z-=n)}return s}const Hs="150",In={ROTATE:0,DOLLY:1,PAN:2},Nn={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Tl=0,rr=1,Dl=2,jo=1,El=2,ci=3,cn=0,Dt=1,qt=2,an=0,Wn=1,or=2,ar=3,lr=4,Il=5,Yn=100,Nl=101,Cl=102,cr=103,dr=104,Ll=200,zl=201,Ol=202,Pl=203,Fo=204,Bo=205,Rl=206,Ul=207,kl=208,jl=209,Fl=210,Bl=0,Gl=1,Vl=2,Ps=3,Yl=4,Hl=5,Wl=6,Ql=7,Go=0,Kl=1,Xl=2,$t=0,Zl=1,ql=2,$l=3,Jl=4,ec=5,Vo=300,Xn=301,Zn=302,Rs=303,Us=304,Yi=306,ks=1e3,Rt=1001,js=1002,_t=1003,ur=1004,$i=1005,Nt=1006,tc=1007,ui=1008,An=1009,nc=1010,ic=1011,Yo=1012,sc=1013,yn=1014,vn=1015,hi=1016,rc=1017,oc=1018,Qn=1020,ac=1021,Ut=1023,lc=1024,cc=1025,wn=1026,qn=1027,dc=1028,uc=1029,hc=1030,fc=1031,pc=1033,Ji=33776,es=33777,ts=33778,ns=33779,hr=35840,fr=35841,pr=35842,mr=35843,mc=36196,gr=37492,Mr=37496,xr=37808,_r=37809,yr=37810,vr=37811,wr=37812,Ar=37813,br=37814,Sr=37815,Tr=37816,Dr=37817,Er=37818,Ir=37819,Nr=37820,Cr=37821,is=36492,gc=36283,Lr=36284,zr=36285,Or=36286,bn=3e3,Xe=3001,Mc=3200,xc=3201,Ho=0,_c=1,Bt="srgb",fi="srgb-linear",Wo="display-p3",ss=7680,yc=519,Fs=35044,Pr="300 es",Bs=1035;class Dn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,e);e.target=null}}}const ht=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],rs=Math.PI/180,Rr=180/Math.PI;function ln(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ht[s&255]+ht[s>>8&255]+ht[s>>16&255]+ht[s>>24&255]+"-"+ht[e&255]+ht[e>>8&255]+"-"+ht[e>>16&15|64]+ht[e>>24&255]+"-"+ht[t&63|128]+ht[t>>8&255]+"-"+ht[t>>16&255]+ht[t>>24&255]+ht[n&255]+ht[n>>8&255]+ht[n>>16&255]+ht[n>>24&255]).toLowerCase()}function vt(s,e,t){return Math.max(e,Math.min(t,s))}function vc(s,e){return(s%e+e)%e}function os(s,e,t){return(1-t)*s+t*e}function Ur(s){return(s&s-1)===0&&s!==0}function wc(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function sn(s,e){switch(e.constructor){case Float32Array:return s;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Qe(s,e){switch(e.constructor){case Float32Array:return s;case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}class Ce{constructor(e=0,t=0){Ce.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*i+e.x,this.y=r*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class yt{constructor(){yt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1]}set(e,t,n,i,r,a,o,c,l){const d=this.elements;return d[0]=e,d[1]=i,d[2]=o,d[3]=t,d[4]=r,d[5]=c,d[6]=n,d[7]=a,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],d=n[4],h=n[7],u=n[2],m=n[5],x=n[8],p=i[0],f=i[3],y=i[6],w=i[1],_=i[4],S=i[7],b=i[2],I=i[5],O=i[8];return r[0]=a*p+o*w+c*b,r[3]=a*f+o*_+c*I,r[6]=a*y+o*S+c*O,r[1]=l*p+d*w+h*b,r[4]=l*f+d*_+h*I,r[7]=l*y+d*S+h*O,r[2]=u*p+m*w+x*b,r[5]=u*f+m*_+x*I,r[8]=u*y+m*S+x*O,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8];return t*a*d-t*o*l-n*r*d+n*o*c+i*r*l-i*a*c}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8],h=d*a-o*l,u=o*c-d*r,m=l*r-a*c,x=t*h+n*u+i*m;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const p=1/x;return e[0]=h*p,e[1]=(i*l-d*n)*p,e[2]=(o*n-i*a)*p,e[3]=u*p,e[4]=(d*t-i*c)*p,e[5]=(i*r-o*t)*p,e[6]=m*p,e[7]=(n*c-l*t)*p,e[8]=(a*t-n*r)*p,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-i*l,i*c,-i*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(as.makeScale(e,t)),this}rotate(e){return this.premultiply(as.makeRotation(-e)),this}translate(e,t){return this.premultiply(as.makeTranslation(e,t)),this}makeTranslation(e,t){return this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const as=new yt;function Qo(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function Vi(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}class Sn{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,a,o){let c=n[i+0],l=n[i+1],d=n[i+2],h=n[i+3];const u=r[a+0],m=r[a+1],x=r[a+2],p=r[a+3];if(o===0){e[t+0]=c,e[t+1]=l,e[t+2]=d,e[t+3]=h;return}if(o===1){e[t+0]=u,e[t+1]=m,e[t+2]=x,e[t+3]=p;return}if(h!==p||c!==u||l!==m||d!==x){let f=1-o;const y=c*u+l*m+d*x+h*p,w=y>=0?1:-1,_=1-y*y;if(_>Number.EPSILON){const b=Math.sqrt(_),I=Math.atan2(b,y*w);f=Math.sin(f*I)/b,o=Math.sin(o*I)/b}const S=o*w;if(c=c*f+u*S,l=l*f+m*S,d=d*f+x*S,h=h*f+p*S,f===1-o){const b=1/Math.sqrt(c*c+l*l+d*d+h*h);c*=b,l*=b,d*=b,h*=b}}e[t]=c,e[t+1]=l,e[t+2]=d,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,i,r,a){const o=n[i],c=n[i+1],l=n[i+2],d=n[i+3],h=r[a],u=r[a+1],m=r[a+2],x=r[a+3];return e[t]=o*x+d*h+c*m-l*u,e[t+1]=c*x+d*u+l*h-o*m,e[t+2]=l*x+d*m+o*u-c*h,e[t+3]=d*x-o*h-c*u-l*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t){const n=e._x,i=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),d=o(i/2),h=o(r/2),u=c(n/2),m=c(i/2),x=c(r/2);switch(a){case"XYZ":this._x=u*d*h+l*m*x,this._y=l*m*h-u*d*x,this._z=l*d*x+u*m*h,this._w=l*d*h-u*m*x;break;case"YXZ":this._x=u*d*h+l*m*x,this._y=l*m*h-u*d*x,this._z=l*d*x-u*m*h,this._w=l*d*h+u*m*x;break;case"ZXY":this._x=u*d*h-l*m*x,this._y=l*m*h+u*d*x,this._z=l*d*x+u*m*h,this._w=l*d*h-u*m*x;break;case"ZYX":this._x=u*d*h-l*m*x,this._y=l*m*h+u*d*x,this._z=l*d*x-u*m*h,this._w=l*d*h+u*m*x;break;case"YZX":this._x=u*d*h+l*m*x,this._y=l*m*h+u*d*x,this._z=l*d*x-u*m*h,this._w=l*d*h-u*m*x;break;case"XZY":this._x=u*d*h-l*m*x,this._y=l*m*h-u*d*x,this._z=l*d*x+u*m*h,this._w=l*d*h+u*m*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t!==!1&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],d=t[6],h=t[10],u=n+o+h;if(u>0){const m=.5/Math.sqrt(u+1);this._w=.25/m,this._x=(d-c)*m,this._y=(r-l)*m,this._z=(a-i)*m}else if(n>o&&n>h){const m=2*Math.sqrt(1+n-o-h);this._w=(d-c)/m,this._x=.25*m,this._y=(i+a)/m,this._z=(r+l)/m}else if(o>h){const m=2*Math.sqrt(1+o-n-h);this._w=(r-l)/m,this._x=(i+a)/m,this._y=.25*m,this._z=(c+d)/m}else{const m=2*Math.sqrt(1+h-n-o);this._w=(a-i)/m,this._x=(r+l)/m,this._y=(c+d)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(vt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,d=t._w;return this._x=n*d+a*o+i*l-r*c,this._y=i*d+a*c+r*o-n*l,this._z=r*d+a*l+n*c-i*o,this._w=a*d-n*o-i*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,r=this._z,a=this._w;let o=a*e._w+n*e._x+i*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=i,this._z=r,this;const c=1-o*o;if(c<=Number.EPSILON){const m=1-t;return this._w=m*a+t*this._w,this._x=m*n+t*this._x,this._y=m*i+t*this._y,this._z=m*r+t*this._z,this.normalize(),this._onChangeCallback(),this}const l=Math.sqrt(c),d=Math.atan2(l,o),h=Math.sin((1-t)*d)/l,u=Math.sin(t*d)/l;return this._w=a*h+this._w*u,this._x=n*h+this._x*u,this._y=i*h+this._y*u,this._z=r*h+this._z*u,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=Math.random(),t=Math.sqrt(1-e),n=Math.sqrt(e),i=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(t*Math.cos(i),n*Math.sin(r),n*Math.cos(r),t*Math.sin(i))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class F{constructor(e=0,t=0,n=0){F.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(kr.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(kr.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=c*t+a*i-o*n,d=c*n+o*t-r*i,h=c*i+r*n-a*t,u=-r*t-a*n-o*i;return this.x=l*c+u*-r+d*-o-h*-a,this.y=d*c+u*-a+h*-r-l*-o,this.z=h*c+u*-o+l*-a-d*-r,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=i*c-r*o,this.y=r*a-n*c,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return ls.copy(this).projectOnVector(e),this.sub(ls)}reflect(e){return this.sub(ls.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(vt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,n=Math.sqrt(1-e**2);return this.x=n*Math.cos(t),this.y=n*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ls=new F,kr=new Sn;function Kn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function cs(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}const Ac=new yt().fromArray([.8224621,.0331941,.0170827,.177538,.9668058,.0723974,-1e-7,1e-7,.9105199]),bc=new yt().fromArray([1.2249401,-.0420569,-.0196376,-.2249404,1.0420571,-.0786361,1e-7,0,1.0982735]),rn=new F;function Sc(s){return s.convertSRGBToLinear(),rn.set(s.r,s.g,s.b).applyMatrix3(bc),s.setRGB(rn.x,rn.y,rn.z)}function Tc(s){return rn.set(s.r,s.g,s.b).applyMatrix3(Ac),s.setRGB(rn.x,rn.y,rn.z).convertLinearToSRGB()}const Dc={[fi]:s=>s,[Bt]:s=>s.convertSRGBToLinear(),[Wo]:Sc},Ec={[fi]:s=>s,[Bt]:s=>s.convertLinearToSRGB(),[Wo]:Tc},gt={enabled:!1,get legacyMode(){return console.warn("THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150."),!this.enabled},set legacyMode(s){console.warn("THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150."),this.enabled=!s},get workingColorSpace(){return fi},set workingColorSpace(s){console.warn("THREE.ColorManagement: .workingColorSpace is readonly.")},convert:function(s,e,t){if(this.enabled===!1||e===t||!e||!t)return s;const n=Dc[e],i=Ec[t];if(n===void 0||i===void 0)throw new Error(`Unsupported color space conversion, "${e}" to "${t}".`);return i(n(s))},fromWorkingColorSpace:function(s,e){return this.convert(s,this.workingColorSpace,e)},toWorkingColorSpace:function(s,e){return this.convert(s,e,this.workingColorSpace)}};let Cn;class Ko{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Cn===void 0&&(Cn=Vi("canvas")),Cn.width=e.width,Cn.height=e.height;const n=Cn.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Cn}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Vi("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=Kn(r[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Kn(t[n]/255)*255):t[n]=Kn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}class Xo{constructor(e=null){this.isSource=!0,this.uuid=ln(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(ds(i[a].image)):r.push(ds(i[a]))}else r=ds(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function ds(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Ko.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Ic=0;class Et extends Dn{constructor(e=Et.DEFAULT_IMAGE,t=Et.DEFAULT_MAPPING,n=Rt,i=Rt,r=Nt,a=ui,o=Ut,c=An,l=Et.DEFAULT_ANISOTROPY,d=bn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ic++}),this.uuid=ln(),this.name="",this.source=new Xo(e),this.mipmaps=[],this.mapping=t,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Ce(0,0),this.repeat=new Ce(1,1),this.center=new Ce(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new yt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.encoding=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.encoding=e.encoding,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.5,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,encoding:this.encoding,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Vo)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ks:e.x=e.x-Math.floor(e.x);break;case Rt:e.x=e.x<0?0:1;break;case js:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ks:e.y=e.y-Math.floor(e.y);break;case Rt:e.y=e.y<0?0:1;break;case js:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}}Et.DEFAULT_IMAGE=null;Et.DEFAULT_MAPPING=Vo;Et.DEFAULT_ANISOTROPY=1;class ct{constructor(e=0,t=0,n=0,i=1){ct.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const c=e.elements,l=c[0],d=c[4],h=c[8],u=c[1],m=c[5],x=c[9],p=c[2],f=c[6],y=c[10];if(Math.abs(d-u)<.01&&Math.abs(h-p)<.01&&Math.abs(x-f)<.01){if(Math.abs(d+u)<.1&&Math.abs(h+p)<.1&&Math.abs(x+f)<.1&&Math.abs(l+m+y-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const _=(l+1)/2,S=(m+1)/2,b=(y+1)/2,I=(d+u)/4,O=(h+p)/4,v=(x+f)/4;return _>S&&_>b?_<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(_),i=I/n,r=O/n):S>b?S<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(S),n=I/i,r=v/i):b<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(b),n=O/r,i=v/r),this.set(n,i,r,t),this}let w=Math.sqrt((f-x)*(f-x)+(h-p)*(h-p)+(u-d)*(u-d));return Math.abs(w)<.001&&(w=1),this.x=(f-x)/w,this.y=(h-p)/w,this.z=(u-d)/w,this.w=Math.acos((l+m+y-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this.w=this.w<0?Math.ceil(this.w):Math.floor(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Tn extends Dn{constructor(e=1,t=1,n={}){super(),this.isWebGLRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ct(0,0,e,t),this.scissorTest=!1,this.viewport=new ct(0,0,e,t);const i={width:e,height:t,depth:1};this.texture=new Et(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.encoding),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.internalFormat=n.internalFormat!==void 0?n.internalFormat:null,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:Nt,this.depthBuffer=n.depthBuffer!==void 0?n.depthBuffer:!0,this.stencilBuffer=n.stencilBuffer!==void 0?n.stencilBuffer:!1,this.depthTexture=n.depthTexture!==void 0?n.depthTexture:null,this.samples=n.samples!==void 0?n.samples:0}setSize(e,t,n=1){(this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Xo(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Zo extends Et{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=_t,this.minFilter=_t,this.wrapR=Rt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Nc extends Et{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=_t,this.minFilter=_t,this.wrapR=Rt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class En{constructor(e=new F(1/0,1/0,1/0),t=new F(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){let t=1/0,n=1/0,i=1/0,r=-1/0,a=-1/0,o=-1/0;for(let c=0,l=e.length;c<l;c+=3){const d=e[c],h=e[c+1],u=e[c+2];d<t&&(t=d),h<n&&(n=h),u<i&&(i=u),d>r&&(r=d),h>a&&(a=h),u>o&&(o=u)}return this.min.set(t,n,i),this.max.set(r,a,o),this}setFromBufferAttribute(e){let t=1/0,n=1/0,i=1/0,r=-1/0,a=-1/0,o=-1/0;for(let c=0,l=e.count;c<l;c++){const d=e.getX(c),h=e.getY(c),u=e.getZ(c);d<t&&(t=d),h<n&&(n=h),u<i&&(i=u),d>r&&(r=d),h>a&&(a=h),u>o&&(o=u)}return this.min.set(t,n,i),this.max.set(r,a,o),this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=pn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0)if(t&&n.attributes!=null&&n.attributes.position!==void 0){const r=n.attributes.position;for(let a=0,o=r.count;a<o;a++)pn.fromBufferAttribute(r,a).applyMatrix4(e.matrixWorld),this.expandByPoint(pn)}else n.boundingBox===null&&n.computeBoundingBox(),us.copy(n.boundingBox),us.applyMatrix4(e.matrixWorld),this.union(us);const i=e.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,pn),pn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ni),xi.subVectors(this.max,ni),Ln.subVectors(e.a,ni),zn.subVectors(e.b,ni),On.subVectors(e.c,ni),Jt.subVectors(zn,Ln),en.subVectors(On,zn),mn.subVectors(Ln,On);let t=[0,-Jt.z,Jt.y,0,-en.z,en.y,0,-mn.z,mn.y,Jt.z,0,-Jt.x,en.z,0,-en.x,mn.z,0,-mn.x,-Jt.y,Jt.x,0,-en.y,en.x,0,-mn.y,mn.x,0];return!hs(t,Ln,zn,On,xi)||(t=[1,0,0,0,1,0,0,0,1],!hs(t,Ln,zn,On,xi))?!1:(_i.crossVectors(Jt,en),t=[_i.x,_i.y,_i.z],hs(t,Ln,zn,On,xi))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,pn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(pn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Yt[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Yt[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Yt[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Yt[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Yt[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Yt[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Yt[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Yt[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Yt),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Yt=[new F,new F,new F,new F,new F,new F,new F,new F],pn=new F,us=new En,Ln=new F,zn=new F,On=new F,Jt=new F,en=new F,mn=new F,ni=new F,xi=new F,_i=new F,gn=new F;function hs(s,e,t,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){gn.fromArray(s,r);const o=i.x*Math.abs(gn.x)+i.y*Math.abs(gn.y)+i.z*Math.abs(gn.z),c=e.dot(gn),l=t.dot(gn),d=n.dot(gn);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>o)return!1}return!0}const Cc=new En,ii=new F,fs=new F;class pi{constructor(e=new F,t=-1){this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Cc.setFromPoints(e).getCenter(n);let i=0;for(let r=0,a=e.length;r<a;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ii.subVectors(e,this.center);const t=ii.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(ii,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(fs.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ii.copy(e.center).add(fs)),this.expandByPoint(ii.copy(e.center).sub(fs))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Ht=new F,ps=new F,yi=new F,tn=new F,ms=new F,vi=new F,gs=new F;class qo{constructor(e=new F,t=new F(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ht)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Ht.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ht.copy(this.origin).addScaledVector(this.direction,t),Ht.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){ps.copy(e).add(t).multiplyScalar(.5),yi.copy(t).sub(e).normalize(),tn.copy(this.origin).sub(ps);const r=e.distanceTo(t)*.5,a=-this.direction.dot(yi),o=tn.dot(this.direction),c=-tn.dot(yi),l=tn.lengthSq(),d=Math.abs(1-a*a);let h,u,m,x;if(d>0)if(h=a*c-o,u=a*o-c,x=r*d,h>=0)if(u>=-x)if(u<=x){const p=1/d;h*=p,u*=p,m=h*(h+a*u+2*o)+u*(a*h+u+2*c)+l}else u=r,h=Math.max(0,-(a*u+o)),m=-h*h+u*(u+2*c)+l;else u=-r,h=Math.max(0,-(a*u+o)),m=-h*h+u*(u+2*c)+l;else u<=-x?(h=Math.max(0,-(-a*r+o)),u=h>0?-r:Math.min(Math.max(-r,-c),r),m=-h*h+u*(u+2*c)+l):u<=x?(h=0,u=Math.min(Math.max(-r,-c),r),m=u*(u+2*c)+l):(h=Math.max(0,-(a*r+o)),u=h>0?r:Math.min(Math.max(-r,-c),r),m=-h*h+u*(u+2*c)+l);else u=a>0?-r:r,h=Math.max(0,-(a*u+o)),m=-h*h+u*(u+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,h),i&&i.copy(ps).addScaledVector(yi,u),m}intersectSphere(e,t){Ht.subVectors(e.center,this.origin);const n=Ht.dot(this.direction),i=Ht.dot(Ht)-n*n,r=e.radius*e.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,a,o,c;const l=1/this.direction.x,d=1/this.direction.y,h=1/this.direction.z,u=this.origin;return l>=0?(n=(e.min.x-u.x)*l,i=(e.max.x-u.x)*l):(n=(e.max.x-u.x)*l,i=(e.min.x-u.x)*l),d>=0?(r=(e.min.y-u.y)*d,a=(e.max.y-u.y)*d):(r=(e.max.y-u.y)*d,a=(e.min.y-u.y)*d),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),h>=0?(o=(e.min.z-u.z)*h,c=(e.max.z-u.z)*h):(o=(e.max.z-u.z)*h,c=(e.min.z-u.z)*h),n>c||o>i)||((o>n||n!==n)&&(n=o),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Ht)!==null}intersectTriangle(e,t,n,i,r){ms.subVectors(t,e),vi.subVectors(n,e),gs.crossVectors(ms,vi);let a=this.direction.dot(gs),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;tn.subVectors(this.origin,e);const c=o*this.direction.dot(vi.crossVectors(tn,vi));if(c<0)return null;const l=o*this.direction.dot(ms.cross(tn));if(l<0||c+l>a)return null;const d=-o*tn.dot(gs);return d<0?null:this.at(d/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class tt{constructor(){tt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}set(e,t,n,i,r,a,o,c,l,d,h,u,m,x,p,f){const y=this.elements;return y[0]=e,y[4]=t,y[8]=n,y[12]=i,y[1]=r,y[5]=a,y[9]=o,y[13]=c,y[2]=l,y[6]=d,y[10]=h,y[14]=u,y[3]=m,y[7]=x,y[11]=p,y[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new tt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/Pn.setFromMatrixColumn(e,0).length(),r=1/Pn.setFromMatrixColumn(e,1).length(),a=1/Pn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(i),l=Math.sin(i),d=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){const u=a*d,m=a*h,x=o*d,p=o*h;t[0]=c*d,t[4]=-c*h,t[8]=l,t[1]=m+x*l,t[5]=u-p*l,t[9]=-o*c,t[2]=p-u*l,t[6]=x+m*l,t[10]=a*c}else if(e.order==="YXZ"){const u=c*d,m=c*h,x=l*d,p=l*h;t[0]=u+p*o,t[4]=x*o-m,t[8]=a*l,t[1]=a*h,t[5]=a*d,t[9]=-o,t[2]=m*o-x,t[6]=p+u*o,t[10]=a*c}else if(e.order==="ZXY"){const u=c*d,m=c*h,x=l*d,p=l*h;t[0]=u-p*o,t[4]=-a*h,t[8]=x+m*o,t[1]=m+x*o,t[5]=a*d,t[9]=p-u*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const u=a*d,m=a*h,x=o*d,p=o*h;t[0]=c*d,t[4]=x*l-m,t[8]=u*l+p,t[1]=c*h,t[5]=p*l+u,t[9]=m*l-x,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const u=a*c,m=a*l,x=o*c,p=o*l;t[0]=c*d,t[4]=p-u*h,t[8]=x*h+m,t[1]=h,t[5]=a*d,t[9]=-o*d,t[2]=-l*d,t[6]=m*h+x,t[10]=u-p*h}else if(e.order==="XZY"){const u=a*c,m=a*l,x=o*c,p=o*l;t[0]=c*d,t[4]=-h,t[8]=l*d,t[1]=u*h+p,t[5]=a*d,t[9]=m*h-x,t[2]=x*h-m,t[6]=o*d,t[10]=p*h+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Lc,e,zc)}lookAt(e,t,n){const i=this.elements;return St.subVectors(e,t),St.lengthSq()===0&&(St.z=1),St.normalize(),nn.crossVectors(n,St),nn.lengthSq()===0&&(Math.abs(n.z)===1?St.x+=1e-4:St.z+=1e-4,St.normalize(),nn.crossVectors(n,St)),nn.normalize(),wi.crossVectors(St,nn),i[0]=nn.x,i[4]=wi.x,i[8]=St.x,i[1]=nn.y,i[5]=wi.y,i[9]=St.y,i[2]=nn.z,i[6]=wi.z,i[10]=St.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],d=n[1],h=n[5],u=n[9],m=n[13],x=n[2],p=n[6],f=n[10],y=n[14],w=n[3],_=n[7],S=n[11],b=n[15],I=i[0],O=i[4],v=i[8],D=i[12],R=i[1],K=i[5],q=i[9],L=i[13],C=i[2],W=i[6],Q=i[10],$=i[14],Y=i[3],ee=i[7],se=i[11],ce=i[15];return r[0]=a*I+o*R+c*C+l*Y,r[4]=a*O+o*K+c*W+l*ee,r[8]=a*v+o*q+c*Q+l*se,r[12]=a*D+o*L+c*$+l*ce,r[1]=d*I+h*R+u*C+m*Y,r[5]=d*O+h*K+u*W+m*ee,r[9]=d*v+h*q+u*Q+m*se,r[13]=d*D+h*L+u*$+m*ce,r[2]=x*I+p*R+f*C+y*Y,r[6]=x*O+p*K+f*W+y*ee,r[10]=x*v+p*q+f*Q+y*se,r[14]=x*D+p*L+f*$+y*ce,r[3]=w*I+_*R+S*C+b*Y,r[7]=w*O+_*K+S*W+b*ee,r[11]=w*v+_*q+S*Q+b*se,r[15]=w*D+_*L+S*$+b*ce,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],d=e[2],h=e[6],u=e[10],m=e[14],x=e[3],p=e[7],f=e[11],y=e[15];return x*(+r*c*h-i*l*h-r*o*u+n*l*u+i*o*m-n*c*m)+p*(+t*c*m-t*l*u+r*a*u-i*a*m+i*l*d-r*c*d)+f*(+t*l*h-t*o*m-r*a*h+n*a*m+r*o*d-n*l*d)+y*(-i*o*d-t*c*h+t*o*u+i*a*h-n*a*u+n*c*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8],h=e[9],u=e[10],m=e[11],x=e[12],p=e[13],f=e[14],y=e[15],w=h*f*l-p*u*l+p*c*m-o*f*m-h*c*y+o*u*y,_=x*u*l-d*f*l-x*c*m+a*f*m+d*c*y-a*u*y,S=d*p*l-x*h*l+x*o*m-a*p*m-d*o*y+a*h*y,b=x*h*c-d*p*c-x*o*u+a*p*u+d*o*f-a*h*f,I=t*w+n*_+i*S+r*b;if(I===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const O=1/I;return e[0]=w*O,e[1]=(p*u*r-h*f*r-p*i*m+n*f*m+h*i*y-n*u*y)*O,e[2]=(o*f*r-p*c*r+p*i*l-n*f*l-o*i*y+n*c*y)*O,e[3]=(h*c*r-o*u*r-h*i*l+n*u*l+o*i*m-n*c*m)*O,e[4]=_*O,e[5]=(d*f*r-x*u*r+x*i*m-t*f*m-d*i*y+t*u*y)*O,e[6]=(x*c*r-a*f*r-x*i*l+t*f*l+a*i*y-t*c*y)*O,e[7]=(a*u*r-d*c*r+d*i*l-t*u*l-a*i*m+t*c*m)*O,e[8]=S*O,e[9]=(x*h*r-d*p*r-x*n*m+t*p*m+d*n*y-t*h*y)*O,e[10]=(a*p*r-x*o*r+x*n*l-t*p*l-a*n*y+t*o*y)*O,e[11]=(d*o*r-a*h*r-d*n*l+t*h*l+a*n*m-t*o*m)*O,e[12]=b*O,e[13]=(d*p*i-x*h*i+x*n*u-t*p*u-d*n*f+t*h*f)*O,e[14]=(x*o*i-a*p*i-x*n*c+t*p*c+a*n*f-t*o*f)*O,e[15]=(a*h*i-d*o*i+d*n*c-t*h*c-a*n*u+t*o*u)*O,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,d=r*o;return this.set(l*a+n,l*o-i*c,l*c+i*o,0,l*o+i*c,d*o+n,d*c-i*a,0,l*c-i*o,d*c+i*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,a){return this.set(1,n,r,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,d=a+a,h=o+o,u=r*l,m=r*d,x=r*h,p=a*d,f=a*h,y=o*h,w=c*l,_=c*d,S=c*h,b=n.x,I=n.y,O=n.z;return i[0]=(1-(p+y))*b,i[1]=(m+S)*b,i[2]=(x-_)*b,i[3]=0,i[4]=(m-S)*I,i[5]=(1-(u+y))*I,i[6]=(f+w)*I,i[7]=0,i[8]=(x+_)*O,i[9]=(f-w)*O,i[10]=(1-(u+p))*O,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let r=Pn.set(i[0],i[1],i[2]).length();const a=Pn.set(i[4],i[5],i[6]).length(),o=Pn.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],zt.copy(this);const l=1/r,d=1/a,h=1/o;return zt.elements[0]*=l,zt.elements[1]*=l,zt.elements[2]*=l,zt.elements[4]*=d,zt.elements[5]*=d,zt.elements[6]*=d,zt.elements[8]*=h,zt.elements[9]*=h,zt.elements[10]*=h,t.setFromRotationMatrix(zt),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,i,r,a){const o=this.elements,c=2*r/(t-e),l=2*r/(n-i),d=(t+e)/(t-e),h=(n+i)/(n-i),u=-(a+r)/(a-r),m=-2*a*r/(a-r);return o[0]=c,o[4]=0,o[8]=d,o[12]=0,o[1]=0,o[5]=l,o[9]=h,o[13]=0,o[2]=0,o[6]=0,o[10]=u,o[14]=m,o[3]=0,o[7]=0,o[11]=-1,o[15]=0,this}makeOrthographic(e,t,n,i,r,a){const o=this.elements,c=1/(t-e),l=1/(n-i),d=1/(a-r),h=(t+e)*c,u=(n+i)*l,m=(a+r)*d;return o[0]=2*c,o[4]=0,o[8]=0,o[12]=-h,o[1]=0,o[5]=2*l,o[9]=0,o[13]=-u,o[2]=0,o[6]=0,o[10]=-2*d,o[14]=-m,o[3]=0,o[7]=0,o[11]=0,o[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Pn=new F,zt=new tt,Lc=new F(0,0,0),zc=new F(1,1,1),nn=new F,wi=new F,St=new F,jr=new tt,Fr=new Sn;class Hi{constructor(e=0,t=0,n=0,i=Hi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],a=i[4],o=i[8],c=i[1],l=i[5],d=i[9],h=i[2],u=i[6],m=i[10];switch(t){case"XYZ":this._y=Math.asin(vt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-vt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(vt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-h,m),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-vt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(u,m),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(vt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-vt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return jr.makeRotationFromQuaternion(e),this.setFromRotationMatrix(jr,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Fr.setFromEuler(this),this.setFromQuaternion(Fr,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Hi.DEFAULT_ORDER="XYZ";class $o{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Oc=0;const Br=new F,Rn=new Sn,Wt=new tt,Ai=new F,si=new F,Pc=new F,Rc=new Sn,Gr=new F(1,0,0),Vr=new F(0,1,0),Yr=new F(0,0,1),Uc={type:"added"},Hr={type:"removed"};class ut extends Dn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Oc++}),this.uuid=ln(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ut.DEFAULT_UP.clone();const e=new F,t=new Hi,n=new Sn,i=new F(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new tt},normalMatrix:{value:new yt}}),this.matrix=new tt,this.matrixWorld=new tt,this.matrixAutoUpdate=ut.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.matrixWorldAutoUpdate=ut.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.layers=new $o,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Rn.setFromAxisAngle(e,t),this.quaternion.multiply(Rn),this}rotateOnWorldAxis(e,t){return Rn.setFromAxisAngle(e,t),this.quaternion.premultiply(Rn),this}rotateX(e){return this.rotateOnAxis(Gr,e)}rotateY(e){return this.rotateOnAxis(Vr,e)}rotateZ(e){return this.rotateOnAxis(Yr,e)}translateOnAxis(e,t){return Br.copy(e).applyQuaternion(this.quaternion),this.position.add(Br.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Gr,e)}translateY(e){return this.translateOnAxis(Vr,e)}translateZ(e){return this.translateOnAxis(Yr,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Wt.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ai.copy(e):Ai.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),si.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Wt.lookAt(si,Ai,this.up):Wt.lookAt(Ai,si,this.up),this.quaternion.setFromRotationMatrix(Wt),i&&(Wt.extractRotation(i.matrixWorld),Rn.setFromRotationMatrix(Wt),this.quaternion.premultiply(Rn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(Uc)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Hr)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){for(let e=0;e<this.children.length;e++){const t=this.children[e];t.parent=null,t.dispatchEvent(Hr)}return this.children.length=0,this}attach(e){return this.updateWorldMatrix(!0,!1),Wt.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Wt.multiply(e.parent.matrixWorld)),e.applyMatrix4(Wt),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t){let n=[];this[e]===t&&n.push(this);for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectsByProperty(e,t);a.length>0&&(n=n.concat(a))}return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(si,e,Pc),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(si,Rc,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++){const r=t[n];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const i=this.children;for(let r=0,a=i.length;r<a;r++){const o=i[r];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.5,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){const h=c[l];r(e.shapes,h)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));i.material=o}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];i.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),d=a(e.images),h=a(e.shapes),u=a(e.skeletons),m=a(e.animations),x=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),d.length>0&&(n.images=d),h.length>0&&(n.shapes=h),u.length>0&&(n.skeletons=u),m.length>0&&(n.animations=m),x.length>0&&(n.nodes=x)}return n.object=i,n;function a(o){const c=[];for(const l in o){const d=o[l];delete d.metadata,c.push(d)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}ut.DEFAULT_UP=new F(0,1,0);ut.DEFAULT_MATRIX_AUTO_UPDATE=!0;ut.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Ot=new F,Qt=new F,Ms=new F,Kt=new F,Un=new F,kn=new F,Wr=new F,xs=new F,_s=new F,ys=new F;class Xt{constructor(e=new F,t=new F,n=new F){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Ot.subVectors(e,t),i.cross(Ot);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){Ot.subVectors(i,t),Qt.subVectors(n,t),Ms.subVectors(e,t);const a=Ot.dot(Ot),o=Ot.dot(Qt),c=Ot.dot(Ms),l=Qt.dot(Qt),d=Qt.dot(Ms),h=a*l-o*o;if(h===0)return r.set(-2,-1,-1);const u=1/h,m=(l*c-o*d)*u,x=(a*d-o*c)*u;return r.set(1-m-x,x,m)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Kt),Kt.x>=0&&Kt.y>=0&&Kt.x+Kt.y<=1}static getUV(e,t,n,i,r,a,o,c){return this.getBarycoord(e,t,n,i,Kt),c.set(0,0),c.addScaledVector(r,Kt.x),c.addScaledVector(a,Kt.y),c.addScaledVector(o,Kt.z),c}static isFrontFacing(e,t,n,i){return Ot.subVectors(n,t),Qt.subVectors(e,t),Ot.cross(Qt).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ot.subVectors(this.c,this.b),Qt.subVectors(this.a,this.b),Ot.cross(Qt).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Xt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Xt.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,n,i,r){return Xt.getUV(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return Xt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Xt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let a,o;Un.subVectors(i,n),kn.subVectors(r,n),xs.subVectors(e,n);const c=Un.dot(xs),l=kn.dot(xs);if(c<=0&&l<=0)return t.copy(n);_s.subVectors(e,i);const d=Un.dot(_s),h=kn.dot(_s);if(d>=0&&h<=d)return t.copy(i);const u=c*h-d*l;if(u<=0&&c>=0&&d<=0)return a=c/(c-d),t.copy(n).addScaledVector(Un,a);ys.subVectors(e,r);const m=Un.dot(ys),x=kn.dot(ys);if(x>=0&&m<=x)return t.copy(r);const p=m*l-c*x;if(p<=0&&l>=0&&x<=0)return o=l/(l-x),t.copy(n).addScaledVector(kn,o);const f=d*x-m*h;if(f<=0&&h-d>=0&&m-x>=0)return Wr.subVectors(r,i),o=(h-d)/(h-d+(m-x)),t.copy(i).addScaledVector(Wr,o);const y=1/(f+p+u);return a=p*y,o=u*y,t.copy(n).addScaledVector(Un,a).addScaledVector(kn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}let kc=0;class Jn extends Dn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:kc++}),this.uuid=ln(),this.name="",this.type="Material",this.blending=Wn,this.side=cn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.blendSrc=Fo,this.blendDst=Bo,this.blendEquation=Yn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.depthFunc=Ps,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=yc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ss,this.stencilZFail=ss,this.stencilZPass=ss,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn("THREE.Material: '"+t+"' parameter is undefined.");continue}const i=this[t];if(i===void 0){console.warn("THREE."+this.type+": '"+t+"' is not a property of this material.");continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.5,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Wn&&(n.blending=this.blending),this.side!==cn&&(n.side=this.side),this.vertexColors&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=this.transparent),n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.stencilWrite=this.stencilWrite,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaToCoverage===!0&&(n.alphaToCoverage=this.alphaToCoverage),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=this.premultipliedAlpha),this.forceSinglePass===!0&&(n.forceSinglePass=this.forceSinglePass),this.wireframe===!0&&(n.wireframe=this.wireframe),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=this.flatShading),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=i(e.textures),a=i(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Jo={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Pt={h:0,s:0,l:0},bi={h:0,s:0,l:0};function vs(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class Ye{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,t===void 0&&n===void 0?this.set(e):this.setRGB(e,t,n)}set(e){return e&&e.isColor?this.copy(e):typeof e=="number"?this.setHex(e):typeof e=="string"&&this.setStyle(e),this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Bt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,gt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=gt.workingColorSpace){return this.r=e,this.g=t,this.b=n,gt.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=gt.workingColorSpace){if(e=vc(e,1),t=vt(t,0,1),n=vt(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=vs(a,r,e+1/3),this.g=vs(a,r,e),this.b=vs(a,r,e-1/3)}return gt.toWorkingColorSpace(this,i),this}setStyle(e,t=Bt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return this.r=Math.min(255,parseInt(r[1],10))/255,this.g=Math.min(255,parseInt(r[2],10))/255,this.b=Math.min(255,parseInt(r[3],10))/255,gt.toWorkingColorSpace(this,t),n(r[4]),this;if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return this.r=Math.min(100,parseInt(r[1],10))/100,this.g=Math.min(100,parseInt(r[2],10))/100,this.b=Math.min(100,parseInt(r[3],10))/100,gt.toWorkingColorSpace(this,t),n(r[4]),this;break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o)){const c=parseFloat(r[1])/360,l=parseFloat(r[2])/100,d=parseFloat(r[3])/100;return n(r[4]),this.setHSL(c,l,d,t)}break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],a=r.length;if(a===3)return this.r=parseInt(r.charAt(0)+r.charAt(0),16)/255,this.g=parseInt(r.charAt(1)+r.charAt(1),16)/255,this.b=parseInt(r.charAt(2)+r.charAt(2),16)/255,gt.toWorkingColorSpace(this,t),this;if(a===6)return this.r=parseInt(r.charAt(0)+r.charAt(1),16)/255,this.g=parseInt(r.charAt(2)+r.charAt(3),16)/255,this.b=parseInt(r.charAt(4)+r.charAt(5),16)/255,gt.toWorkingColorSpace(this,t),this;console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Bt){const n=Jo[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Kn(e.r),this.g=Kn(e.g),this.b=Kn(e.b),this}copyLinearToSRGB(e){return this.r=cs(e.r),this.g=cs(e.g),this.b=cs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Bt){return gt.fromWorkingColorSpace(ft.copy(this),e),vt(ft.r*255,0,255)<<16^vt(ft.g*255,0,255)<<8^vt(ft.b*255,0,255)<<0}getHexString(e=Bt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=gt.workingColorSpace){gt.fromWorkingColorSpace(ft.copy(this),t);const n=ft.r,i=ft.g,r=ft.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let c,l;const d=(o+a)/2;if(o===a)c=0,l=0;else{const h=a-o;switch(l=d<=.5?h/(a+o):h/(2-a-o),a){case n:c=(i-r)/h+(i<r?6:0);break;case i:c=(r-n)/h+2;break;case r:c=(n-i)/h+4;break}c/=6}return e.h=c,e.s=l,e.l=d,e}getRGB(e,t=gt.workingColorSpace){return gt.fromWorkingColorSpace(ft.copy(this),t),e.r=ft.r,e.g=ft.g,e.b=ft.b,e}getStyle(e=Bt){gt.fromWorkingColorSpace(ft.copy(this),e);const t=ft.r,n=ft.g,i=ft.b;return e!==Bt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${t*255|0},${n*255|0},${i*255|0})`}offsetHSL(e,t,n){return this.getHSL(Pt),Pt.h+=e,Pt.s+=t,Pt.l+=n,this.setHSL(Pt.h,Pt.s,Pt.l),this}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Pt),e.getHSL(bi);const n=os(Pt.h,bi.h,t),i=os(Pt.s,bi.s,t),r=os(Pt.l,bi.l,t);return this.setHSL(n,i,r),this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const ft=new Ye;Ye.NAMES=Jo;class ea extends Jn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ye(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Go,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const et=new F,Si=new Ce;class kt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Fs,this.updateRange={offset:0,count:-1},this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Si.fromBufferAttribute(this,t),Si.applyMatrix3(e),this.setXY(t,Si.x,Si.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)et.fromBufferAttribute(this,t),et.applyMatrix3(e),this.setXYZ(t,et.x,et.y,et.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)et.fromBufferAttribute(this,t),et.applyMatrix4(e),this.setXYZ(t,et.x,et.y,et.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)et.fromBufferAttribute(this,t),et.applyNormalMatrix(e),this.setXYZ(t,et.x,et.y,et.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)et.fromBufferAttribute(this,t),et.transformDirection(e),this.setXYZ(t,et.x,et.y,et.z);return this}set(e,t=0){return this.array.set(e,t),this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=sn(t,this.array)),t}setX(e,t){return this.normalized&&(t=Qe(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=sn(t,this.array)),t}setY(e,t){return this.normalized&&(t=Qe(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=sn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Qe(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=sn(t,this.array)),t}setW(e,t){return this.normalized&&(t=Qe(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Qe(t,this.array),n=Qe(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=Qe(t,this.array),n=Qe(n,this.array),i=Qe(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=Qe(t,this.array),n=Qe(n,this.array),i=Qe(i,this.array),r=Qe(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Fs&&(e.usage=this.usage),(this.updateRange.offset!==0||this.updateRange.count!==-1)&&(e.updateRange=this.updateRange),e}copyColorsArray(){console.error("THREE.BufferAttribute: copyColorsArray() was removed in r144.")}copyVector2sArray(){console.error("THREE.BufferAttribute: copyVector2sArray() was removed in r144.")}copyVector3sArray(){console.error("THREE.BufferAttribute: copyVector3sArray() was removed in r144.")}copyVector4sArray(){console.error("THREE.BufferAttribute: copyVector4sArray() was removed in r144.")}}class ta extends kt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class na extends kt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class pt extends kt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let jc=0;const It=new tt,ws=new ut,jn=new F,Tt=new En,ri=new En,lt=new F;class Lt extends Dn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:jc++}),this.uuid=ln(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Qo(e)?na:ta)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new yt().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return It.makeRotationFromQuaternion(e),this.applyMatrix4(It),this}rotateX(e){return It.makeRotationX(e),this.applyMatrix4(It),this}rotateY(e){return It.makeRotationY(e),this.applyMatrix4(It),this}rotateZ(e){return It.makeRotationZ(e),this.applyMatrix4(It),this}translate(e,t,n){return It.makeTranslation(e,t,n),this.applyMatrix4(It),this}scale(e,t,n){return It.makeScale(e,t,n),this.applyMatrix4(It),this}lookAt(e){return ws.lookAt(e),ws.updateMatrix(),this.applyMatrix4(ws.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(jn).negate(),this.translate(jn.x,jn.y,jn.z),this}setFromPoints(e){const t=[];for(let n=0,i=e.length;n<i;n++){const r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new pt(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new En);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new F(-1/0,-1/0,-1/0),new F(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];Tt.setFromBufferAttribute(r),this.morphTargetsRelative?(lt.addVectors(this.boundingBox.min,Tt.min),this.boundingBox.expandByPoint(lt),lt.addVectors(this.boundingBox.max,Tt.max),this.boundingBox.expandByPoint(lt)):(this.boundingBox.expandByPoint(Tt.min),this.boundingBox.expandByPoint(Tt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new pi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new F,1/0);return}if(e){const n=this.boundingSphere.center;if(Tt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];ri.setFromBufferAttribute(o),this.morphTargetsRelative?(lt.addVectors(Tt.min,ri.min),Tt.expandByPoint(lt),lt.addVectors(Tt.max,ri.max),Tt.expandByPoint(lt)):(Tt.expandByPoint(ri.min),Tt.expandByPoint(ri.max))}Tt.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)lt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(lt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let l=0,d=o.count;l<d;l++)lt.fromBufferAttribute(o,l),c&&(jn.fromBufferAttribute(e,l),lt.add(jn)),i=Math.max(i,n.distanceToSquared(lt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.array,i=t.position.array,r=t.normal.array,a=t.uv.array,o=i.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new kt(new Float32Array(4*o),4));const c=this.getAttribute("tangent").array,l=[],d=[];for(let R=0;R<o;R++)l[R]=new F,d[R]=new F;const h=new F,u=new F,m=new F,x=new Ce,p=new Ce,f=new Ce,y=new F,w=new F;function _(R,K,q){h.fromArray(i,R*3),u.fromArray(i,K*3),m.fromArray(i,q*3),x.fromArray(a,R*2),p.fromArray(a,K*2),f.fromArray(a,q*2),u.sub(h),m.sub(h),p.sub(x),f.sub(x);const L=1/(p.x*f.y-f.x*p.y);isFinite(L)&&(y.copy(u).multiplyScalar(f.y).addScaledVector(m,-p.y).multiplyScalar(L),w.copy(m).multiplyScalar(p.x).addScaledVector(u,-f.x).multiplyScalar(L),l[R].add(y),l[K].add(y),l[q].add(y),d[R].add(w),d[K].add(w),d[q].add(w))}let S=this.groups;S.length===0&&(S=[{start:0,count:n.length}]);for(let R=0,K=S.length;R<K;++R){const q=S[R],L=q.start,C=q.count;for(let W=L,Q=L+C;W<Q;W+=3)_(n[W+0],n[W+1],n[W+2])}const b=new F,I=new F,O=new F,v=new F;function D(R){O.fromArray(r,R*3),v.copy(O);const K=l[R];b.copy(K),b.sub(O.multiplyScalar(O.dot(K))).normalize(),I.crossVectors(v,K);const L=I.dot(d[R])<0?-1:1;c[R*4]=b.x,c[R*4+1]=b.y,c[R*4+2]=b.z,c[R*4+3]=L}for(let R=0,K=S.length;R<K;++R){const q=S[R],L=q.start,C=q.count;for(let W=L,Q=L+C;W<Q;W+=3)D(n[W+0]),D(n[W+1]),D(n[W+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new kt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,m=n.count;u<m;u++)n.setXYZ(u,0,0,0);const i=new F,r=new F,a=new F,o=new F,c=new F,l=new F,d=new F,h=new F;if(e)for(let u=0,m=e.count;u<m;u+=3){const x=e.getX(u+0),p=e.getX(u+1),f=e.getX(u+2);i.fromBufferAttribute(t,x),r.fromBufferAttribute(t,p),a.fromBufferAttribute(t,f),d.subVectors(a,r),h.subVectors(i,r),d.cross(h),o.fromBufferAttribute(n,x),c.fromBufferAttribute(n,p),l.fromBufferAttribute(n,f),o.add(d),c.add(d),l.add(d),n.setXYZ(x,o.x,o.y,o.z),n.setXYZ(p,c.x,c.y,c.z),n.setXYZ(f,l.x,l.y,l.z)}else for(let u=0,m=t.count;u<m;u+=3)i.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),d.subVectors(a,r),h.subVectors(i,r),d.cross(h),n.setXYZ(u+0,d.x,d.y,d.z),n.setXYZ(u+1,d.x,d.y,d.z),n.setXYZ(u+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}merge(){return console.error("THREE.BufferGeometry.merge() has been removed. Use THREE.BufferGeometryUtils.mergeBufferGeometries() instead."),this}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)lt.fromBufferAttribute(e,t),lt.normalize(),e.setXYZ(t,lt.x,lt.y,lt.z)}toNonIndexed(){function e(o,c){const l=o.array,d=o.itemSize,h=o.normalized,u=new l.constructor(c.length*d);let m=0,x=0;for(let p=0,f=c.length;p<f;p++){o.isInterleavedBufferAttribute?m=c[p]*o.data.stride+o.offset:m=c[p]*d;for(let y=0;y<d;y++)u[x++]=l[m++]}return new kt(u,d,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Lt,n=this.index.array,i=this.attributes;for(const o in i){const c=i[o],l=e(c,n);t.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let d=0,h=l.length;d<h;d++){const u=l[d],m=e(u,n);c.push(m)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.5,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const i={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],d=[];for(let h=0,u=l.length;h<u;h++){const m=l[h];d.push(m.toJSON(e.data))}d.length>0&&(i[c]=d,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const l in i){const d=i[l];this.setAttribute(l,d.clone(t))}const r=e.morphAttributes;for(const l in r){const d=[],h=r[l];for(let u=0,m=h.length;u<m;u++)d.push(h[u].clone(t));this.morphAttributes[l]=d}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,d=a.length;l<d;l++){const h=a[l];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Qr=new tt,Ft=new qo,Ti=new pi,Kr=new F,oi=new F,ai=new F,li=new F,As=new F,Di=new F,Ei=new Ce,Ii=new Ce,Ni=new Ce,bs=new F,Ci=new F;class Gt extends ut{constructor(e=new Lt,t=new ea){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(r&&o){Di.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const d=o[c],h=r[c];d!==0&&(As.fromBufferAttribute(h,e),a?Di.addScaledVector(As,d):Di.addScaledVector(As.sub(t),d))}t.add(Di)}return this.isSkinnedMesh&&this.boneTransform(e,t),t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;if(i===void 0||(n.boundingSphere===null&&n.computeBoundingSphere(),Ti.copy(n.boundingSphere),Ti.applyMatrix4(r),Ft.copy(e.ray).recast(e.near),Ti.containsPoint(Ft.origin)===!1&&(Ft.intersectSphere(Ti,Kr)===null||Ft.origin.distanceToSquared(Kr)>(e.far-e.near)**2))||(Qr.copy(r).invert(),Ft.copy(e.ray).applyMatrix4(Qr),n.boundingBox!==null&&Ft.intersectsBox(n.boundingBox)===!1))return;let a;const o=n.index,c=n.attributes.position,l=n.attributes.uv,d=n.attributes.uv2,h=n.groups,u=n.drawRange;if(o!==null)if(Array.isArray(i))for(let m=0,x=h.length;m<x;m++){const p=h[m],f=i[p.materialIndex],y=Math.max(p.start,u.start),w=Math.min(o.count,Math.min(p.start+p.count,u.start+u.count));for(let _=y,S=w;_<S;_+=3){const b=o.getX(_),I=o.getX(_+1),O=o.getX(_+2);a=Li(this,f,e,Ft,l,d,b,I,O),a&&(a.faceIndex=Math.floor(_/3),a.face.materialIndex=p.materialIndex,t.push(a))}}else{const m=Math.max(0,u.start),x=Math.min(o.count,u.start+u.count);for(let p=m,f=x;p<f;p+=3){const y=o.getX(p),w=o.getX(p+1),_=o.getX(p+2);a=Li(this,i,e,Ft,l,d,y,w,_),a&&(a.faceIndex=Math.floor(p/3),t.push(a))}}else if(c!==void 0)if(Array.isArray(i))for(let m=0,x=h.length;m<x;m++){const p=h[m],f=i[p.materialIndex],y=Math.max(p.start,u.start),w=Math.min(c.count,Math.min(p.start+p.count,u.start+u.count));for(let _=y,S=w;_<S;_+=3){const b=_,I=_+1,O=_+2;a=Li(this,f,e,Ft,l,d,b,I,O),a&&(a.faceIndex=Math.floor(_/3),a.face.materialIndex=p.materialIndex,t.push(a))}}else{const m=Math.max(0,u.start),x=Math.min(c.count,u.start+u.count);for(let p=m,f=x;p<f;p+=3){const y=p,w=p+1,_=p+2;a=Li(this,i,e,Ft,l,d,y,w,_),a&&(a.faceIndex=Math.floor(p/3),t.push(a))}}}}function Fc(s,e,t,n,i,r,a,o){let c;if(e.side===Dt?c=n.intersectTriangle(a,r,i,!0,o):c=n.intersectTriangle(i,r,a,e.side===cn,o),c===null)return null;Ci.copy(o),Ci.applyMatrix4(s.matrixWorld);const l=t.ray.origin.distanceTo(Ci);return l<t.near||l>t.far?null:{distance:l,point:Ci.clone(),object:s}}function Li(s,e,t,n,i,r,a,o,c){s.getVertexPosition(a,oi),s.getVertexPosition(o,ai),s.getVertexPosition(c,li);const l=Fc(s,e,t,n,oi,ai,li,bs);if(l){i&&(Ei.fromBufferAttribute(i,a),Ii.fromBufferAttribute(i,o),Ni.fromBufferAttribute(i,c),l.uv=Xt.getUV(bs,oi,ai,li,Ei,Ii,Ni,new Ce)),r&&(Ei.fromBufferAttribute(r,a),Ii.fromBufferAttribute(r,o),Ni.fromBufferAttribute(r,c),l.uv2=Xt.getUV(bs,oi,ai,li,Ei,Ii,Ni,new Ce));const d={a,b:o,c,normal:new F,materialIndex:0};Xt.getNormal(oi,ai,li,d.normal),l.face=d}return l}class mi extends Lt{constructor(e=1,t=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],d=[],h=[];let u=0,m=0;x("z","y","x",-1,-1,n,t,e,a,r,0),x("z","y","x",1,-1,n,t,-e,a,r,1),x("x","z","y",1,1,e,n,t,i,a,2),x("x","z","y",1,-1,e,n,-t,i,a,3),x("x","y","z",1,-1,e,t,n,i,r,4),x("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(c),this.setAttribute("position",new pt(l,3)),this.setAttribute("normal",new pt(d,3)),this.setAttribute("uv",new pt(h,2));function x(p,f,y,w,_,S,b,I,O,v,D){const R=S/O,K=b/v,q=S/2,L=b/2,C=I/2,W=O+1,Q=v+1;let $=0,Y=0;const ee=new F;for(let se=0;se<Q;se++){const ce=se*K-L;for(let V=0;V<W;V++){const re=V*R-q;ee[p]=re*w,ee[f]=ce*_,ee[y]=C,l.push(ee.x,ee.y,ee.z),ee[p]=0,ee[f]=0,ee[y]=I>0?1:-1,d.push(ee.x,ee.y,ee.z),h.push(V/O),h.push(1-se/v),$+=1}}for(let se=0;se<v;se++)for(let ce=0;ce<O;ce++){const V=u+ce+W*se,re=u+ce+W*(se+1),de=u+(ce+1)+W*(se+1),U=u+(ce+1)+W*se;c.push(V,re,U),c.push(re,de,U),Y+=6}o.addGroup(m,Y,D),m+=Y,u+=$}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new mi(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function $n(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function xt(s){const e={};for(let t=0;t<s.length;t++){const n=$n(s[t]);for(const i in n)e[i]=n[i]}return e}function Bc(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function ia(s){return s.getRenderTarget()===null&&s.outputEncoding===Xe?Bt:fi}const Ws={clone:$n,merge:xt};var Gc=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Vc=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class dn extends Jn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Gc,this.fragmentShader=Vc,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv2:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=$n(e.uniforms),this.uniformsGroups=Bc(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class sa extends ut{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new tt,this.projectionMatrix=new tt,this.projectionMatrixInverse=new tt}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(-t[8],-t[9],-t[10]).normalize()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class Ct extends sa{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Rr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(rs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Rr*2*Math.atan(Math.tan(rs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,n,i,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(rs*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*i/c,t-=a.offsetY*n/l,i*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Fn=-90,Bn=1;class Yc extends ut{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n;const i=new Ct(Fn,Bn,e,t);i.layers=this.layers,i.up.set(0,1,0),i.lookAt(1,0,0),this.add(i);const r=new Ct(Fn,Bn,e,t);r.layers=this.layers,r.up.set(0,1,0),r.lookAt(-1,0,0),this.add(r);const a=new Ct(Fn,Bn,e,t);a.layers=this.layers,a.up.set(0,0,-1),a.lookAt(0,1,0),this.add(a);const o=new Ct(Fn,Bn,e,t);o.layers=this.layers,o.up.set(0,0,1),o.lookAt(0,-1,0),this.add(o);const c=new Ct(Fn,Bn,e,t);c.layers=this.layers,c.up.set(0,1,0),c.lookAt(0,0,1),this.add(c);const l=new Ct(Fn,Bn,e,t);l.layers=this.layers,l.up.set(0,1,0),l.lookAt(0,0,-1),this.add(l)}update(e,t){this.parent===null&&this.updateMatrixWorld();const n=this.renderTarget,[i,r,a,o,c,l]=this.children,d=e.getRenderTarget(),h=e.toneMapping,u=e.xr.enabled;e.toneMapping=$t,e.xr.enabled=!1;const m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0),e.render(t,i),e.setRenderTarget(n,1),e.render(t,r),e.setRenderTarget(n,2),e.render(t,a),e.setRenderTarget(n,3),e.render(t,o),e.setRenderTarget(n,4),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5),e.render(t,l),e.setRenderTarget(d),e.toneMapping=h,e.xr.enabled=u,n.texture.needsPMREMUpdate=!0}}class ra extends Et{constructor(e,t,n,i,r,a,o,c,l,d){e=e!==void 0?e:[],t=t!==void 0?t:Xn,super(e,t,n,i,r,a,o,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Hc extends Tn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new ra(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.encoding),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Nt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.encoding=t.encoding,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new mi(5,5,5),r=new dn({name:"CubemapFromEquirect",uniforms:$n(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Dt,blending:an});r.uniforms.tEquirect.value=t;const a=new Gt(i,r),o=t.minFilter;return t.minFilter===ui&&(t.minFilter=Nt),new Yc(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,i){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(r)}}const Ss=new F,Wc=new F,Qc=new yt;class Mn{constructor(e=new F(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=Ss.subVectors(n,t).cross(Wc.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Ss),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Qc.getNormalMatrix(e),i=this.coplanarPoint(Ss).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Gn=new pi,zi=new F;class Qs{constructor(e=new Mn,t=new Mn,n=new Mn,i=new Mn,r=new Mn,a=new Mn){this.planes=[e,t,n,i,r,a]}set(e,t,n,i,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e){const t=this.planes,n=e.elements,i=n[0],r=n[1],a=n[2],o=n[3],c=n[4],l=n[5],d=n[6],h=n[7],u=n[8],m=n[9],x=n[10],p=n[11],f=n[12],y=n[13],w=n[14],_=n[15];return t[0].setComponents(o-i,h-c,p-u,_-f).normalize(),t[1].setComponents(o+i,h+c,p+u,_+f).normalize(),t[2].setComponents(o+r,h+l,p+m,_+y).normalize(),t[3].setComponents(o-r,h-l,p-m,_-y).normalize(),t[4].setComponents(o-a,h-d,p-x,_-w).normalize(),t[5].setComponents(o+a,h+d,p+x,_+w).normalize(),this}intersectsObject(e){const t=e.geometry;return t.boundingSphere===null&&t.computeBoundingSphere(),Gn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld),this.intersectsSphere(Gn)}intersectsSprite(e){return Gn.center.set(0,0,0),Gn.radius=.7071067811865476,Gn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Gn)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(zi.x=i.normal.x>0?e.max.x:e.min.x,zi.y=i.normal.y>0?e.max.y:e.min.y,zi.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(zi)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function oa(){let s=null,e=!1,t=null,n=null;function i(r,a){t(r,a),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function Kc(s,e){const t=e.isWebGL2,n=new WeakMap;function i(l,d){const h=l.array,u=l.usage,m=s.createBuffer();s.bindBuffer(d,m),s.bufferData(d,h,u),l.onUploadCallback();let x;if(h instanceof Float32Array)x=5126;else if(h instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(t)x=5131;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else x=5123;else if(h instanceof Int16Array)x=5122;else if(h instanceof Uint32Array)x=5125;else if(h instanceof Int32Array)x=5124;else if(h instanceof Int8Array)x=5120;else if(h instanceof Uint8Array)x=5121;else if(h instanceof Uint8ClampedArray)x=5121;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:m,type:x,bytesPerElement:h.BYTES_PER_ELEMENT,version:l.version}}function r(l,d,h){const u=d.array,m=d.updateRange;s.bindBuffer(h,l),m.count===-1?s.bufferSubData(h,0,u):(t?s.bufferSubData(h,m.offset*u.BYTES_PER_ELEMENT,u,m.offset,m.count):s.bufferSubData(h,m.offset*u.BYTES_PER_ELEMENT,u.subarray(m.offset,m.offset+m.count)),m.count=-1),d.onUploadCallback()}function a(l){return l.isInterleavedBufferAttribute&&(l=l.data),n.get(l)}function o(l){l.isInterleavedBufferAttribute&&(l=l.data);const d=n.get(l);d&&(s.deleteBuffer(d.buffer),n.delete(l))}function c(l,d){if(l.isGLBufferAttribute){const u=n.get(l);(!u||u.version<l.version)&&n.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);const h=n.get(l);h===void 0?n.set(l,i(l,d)):h.version<l.version&&(r(h.buffer,l,d),h.version=l.version)}return{get:a,remove:o,update:c}}class Ks extends Lt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(i),l=o+1,d=c+1,h=e/o,u=t/c,m=[],x=[],p=[],f=[];for(let y=0;y<d;y++){const w=y*u-a;for(let _=0;_<l;_++){const S=_*h-r;x.push(S,-w,0),p.push(0,0,1),f.push(_/o),f.push(1-y/c)}}for(let y=0;y<c;y++)for(let w=0;w<o;w++){const _=w+l*y,S=w+l*(y+1),b=w+1+l*(y+1),I=w+1+l*y;m.push(_,S,I),m.push(S,b,I)}this.setIndex(m),this.setAttribute("position",new pt(x,3)),this.setAttribute("normal",new pt(p,3)),this.setAttribute("uv",new pt(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ks(e.width,e.height,e.widthSegments,e.heightSegments)}}var Xc=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vUv ).g;
#endif`,Zc=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,qc=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,$c=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Jc=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vUv2 ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,ed=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,td="vec3 transformed = vec3( position );",nd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,id=`vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 f0, const in float f90, const in float roughness ) {
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
	float D = D_GGX( alpha, dotNH );
	return F * ( V * D );
}
#ifdef USE_IRIDESCENCE
	vec3 BRDF_GGX_Iridescence( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 f0, const in float f90, const in float iridescence, const in vec3 iridescenceFresnel, const in float roughness ) {
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = mix( F_Schlick( f0, f90, dotVH ), iridescenceFresnel, iridescence );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif`,sd=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			 return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float R21 = R12;
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,rd=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vUv );
		vec2 dSTdy = dFdy( vUv );
		float Hll = bumpScale * texture2D( bumpMap, vUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = dFdx( surf_pos.xyz );
		vec3 vSigmaY = dFdy( surf_pos.xyz );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,od=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,ad=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ld=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,cd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,dd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,ud=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,hd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,fd=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,pd=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal;
#endif
};
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}`,md=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_v0 0.339
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_v1 0.276
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_v4 0.046
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_v5 0.016
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_v6 0.0038
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,gd=`vec3 transformedNormal = objectNormal;
#ifdef USE_INSTANCING
	mat3 m = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );
	transformedNormal = m * transformedNormal;
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	vec3 transformedTangent = ( modelViewMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Md=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,xd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vUv ).x * displacementScale + displacementBias );
#endif`,_d=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,yd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,vd="gl_FragColor = linearToOutputTexel( gl_FragColor );",wd=`vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Ad=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,bd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Sd=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Td=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Dd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Ed=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Id=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Nd=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Cd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ld=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,zd=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vUv2 );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Od=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Pd=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Rd=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in GeometricContext geometry, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in GeometricContext geometry, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ud=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
uniform vec3 lightProbe[ 9 ];
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometry.position;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in GeometricContext geometry, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometry.position;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,kd=`#if defined( USE_ENVMAP )
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#if defined( ENVMAP_TYPE_CUBE_UV )
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#if defined( ENVMAP_TYPE_CUBE_UV )
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
#endif`,jd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Fd=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometry.normal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Bd=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Gd=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometry.viewDir, geometry.normal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Vd=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( geometryNormal ) ), abs( dFdy( geometryNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULARINTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vUv ).a;
		#endif
		#ifdef USE_SPECULARCOLORMAP
			specularColorFactor *= texture2D( specularColorMap, vUv ).rgb;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEENCOLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEENROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vUv ).a;
	#endif
#endif`,Yd=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
};
vec3 clearcoatSpecular = vec3( 0.0 );
vec3 sheenSpecular = vec3( 0.0 );
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometry.normal;
		vec3 viewDir = geometry.viewDir;
		vec3 position = geometry.position;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometry.clearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecular += ccIrradiance * BRDF_GGX( directLight.direction, geometry.viewDir, geometry.clearcoatNormal, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecular += irradiance * BRDF_Sheen( directLight.direction, geometry.viewDir, geometry.normal, material.sheenColor, material.sheenRoughness );
	#endif
	#ifdef USE_IRIDESCENCE
		reflectedLight.directSpecular += irradiance * BRDF_GGX_Iridescence( directLight.direction, geometry.viewDir, geometry.normal, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness );
	#else
		reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometry.viewDir, geometry.normal, material.specularColor, material.specularF90, material.roughness );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecular += clearcoatRadiance * EnvironmentBRDF( geometry.clearcoatNormal, geometry.viewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecular += irradiance * material.sheenColor * IBLSheenBRDF( geometry.normal, geometry.viewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometry.normal, geometry.viewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometry.normal, geometry.viewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Hd=`
GeometricContext geometry;
geometry.position = - vViewPosition;
geometry.normal = normal;
geometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
#ifdef USE_CLEARCOAT
	geometry.clearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometry.viewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometry, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometry, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, geometry, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	irradiance += getLightProbeIrradiance( lightProbe, geometry.normal );
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry.normal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Wd=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vUv2 );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometry.normal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	radiance += getIBLRadiance( geometry.viewDir, geometry.normal, material.roughness );
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometry.viewDir, geometry.clearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Qd=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometry, material, reflectedLight );
#endif`,Kd=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Xd=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Zd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,qd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,$d=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Jd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,eu=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,tu=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	uniform mat3 uvTransform;
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,nu=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vUv );
	metalnessFactor *= texelMetalness.b;
#endif`,iu=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,su=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ru=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,ou=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,au=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,lu=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	#ifdef USE_TANGENT
		vec3 tangent = normalize( vTangent );
		vec3 bitangent = normalize( vBitangent );
		#ifdef DOUBLE_SIDED
			tangent = tangent * faceDirection;
			bitangent = bitangent * faceDirection;
		#endif
		#if defined( TANGENTSPACE_NORMALMAP ) || defined( USE_CLEARCOAT_NORMALMAP )
			mat3 vTBN = mat3( tangent, bitangent, normal );
		#endif
	#endif
#endif
vec3 geometryNormal = normal;`,cu=`#ifdef OBJECTSPACE_NORMALMAP
	normal = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( TANGENTSPACE_NORMALMAP )
	vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	#ifdef USE_TANGENT
		normal = normalize( vTBN * mapN );
	#else
		normal = perturbNormal2Arb( - vViewPosition, normal, mapN, faceDirection );
	#endif
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,du=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,uu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,hu=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,fu=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef OBJECTSPACE_NORMALMAP
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( TANGENTSPACE_NORMALMAP ) || defined ( USE_CLEARCOAT_NORMALMAP ) )
	vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm, vec3 mapN, float faceDirection ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( vUv.st );
		vec2 st1 = dFdy( vUv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : faceDirection * inversesqrt( det );
		return normalize( T * ( mapN.x * scale ) + B * ( mapN.y * scale ) + N * mapN.z );
	}
#endif`,pu=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = geometryNormal;
#endif`,mu=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	#ifdef USE_TANGENT
		clearcoatNormal = normalize( vTBN * clearcoatMapN );
	#else
		clearcoatNormal = perturbNormal2Arb( - vViewPosition, clearcoatNormal, clearcoatMapN, faceDirection );
	#endif
#endif`,gu=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif`,Mu=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,xu=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha + 0.1;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,_u=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float linearClipZ, const in float near, const in float far ) {
	return linearClipZ * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * invClipZ - far );
}`,yu=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,vu=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,wu=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Au=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,bu=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Su=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Tu=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,Du=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Eu=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Iu=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Nu=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Cu=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	uniform int boneTextureSize;
	mat4 getBoneMatrix( const in float i ) {
		float j = i * 4.0;
		float x = mod( j, float( boneTextureSize ) );
		float y = floor( j / float( boneTextureSize ) );
		float dx = 1.0 / float( boneTextureSize );
		float dy = 1.0 / float( boneTextureSize );
		y = dy * ( y + 0.5 );
		vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );
		vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );
		vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );
		vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );
		mat4 bone = mat4( v1, v2, v3, v4 );
		return bone;
	}
#endif`,Lu=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,zu=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Ou=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Pu=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ru=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Uu=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return toneMappingExposure * color;
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,ku=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmission = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmission.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmission.rgb, material.transmission );
#endif`,ju=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, vec2 fullSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		
		vec2 lodFudge = pow( 1.95, lod ) / fullSize;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec2 fullSize = vec2( textureSize( sampler, 0 ) );
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), fullSize, floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), fullSize, ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 applyVolumeAttenuation( const in vec3 radiance, const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return radiance;
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance * radiance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 attenuatedColor = applyVolumeAttenuation( transmittedLight.rgb, length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		return vec4( ( 1.0 - F ) * attenuatedColor * diffuseColor, transmittedLight.a );
	}
#endif`,Fu=`#if ( defined( USE_UV ) && ! defined( UVS_VERTEX_ONLY ) )
	varying vec2 vUv;
#endif`,Bu=`#ifdef USE_UV
	#ifdef UVS_VERTEX_ONLY
		vec2 vUv;
	#else
		varying vec2 vUv;
	#endif
	uniform mat3 uvTransform;
#endif`,Gu=`#ifdef USE_UV
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
#endif`,Vu=`#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	varying vec2 vUv2;
#endif`,Yu=`#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	attribute vec2 uv2;
	varying vec2 vUv2;
	uniform mat3 uv2Transform;
#endif`,Hu=`#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	vUv2 = ( uv2Transform * vec3( uv2, 1 ) ).xy;
#endif`,Wu=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Qu=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ku=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,Xu=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Zu=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,qu=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,$u=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,Ju=`#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,eh=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,th=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,nh=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,ih=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,sh=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,rh=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,oh=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ah=`#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,lh=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vUv2 );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ch=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,dh=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,uh=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,hh=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fh=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )
	vViewPosition = - mvPosition.xyz;
#endif
}`,ph=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,mh=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,gh=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Mh=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,xh=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULARINTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
	#ifdef USE_SPECULARCOLORMAP
		uniform sampler2D specularColorMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEENCOLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEENROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <bsdfs>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecular;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometry.clearcoatNormal, geometry.viewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + clearcoatSpecular * material.clearcoat;
	#endif
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_h=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,yh=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vh=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,wh=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ah=`#include <common>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,bh=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
}`,Sh=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Th=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
}`,Ne={alphamap_fragment:Xc,alphamap_pars_fragment:Zc,alphatest_fragment:qc,alphatest_pars_fragment:$c,aomap_fragment:Jc,aomap_pars_fragment:ed,begin_vertex:td,beginnormal_vertex:nd,bsdfs:id,iridescence_fragment:sd,bumpmap_pars_fragment:rd,clipping_planes_fragment:od,clipping_planes_pars_fragment:ad,clipping_planes_pars_vertex:ld,clipping_planes_vertex:cd,color_fragment:dd,color_pars_fragment:ud,color_pars_vertex:hd,color_vertex:fd,common:pd,cube_uv_reflection_fragment:md,defaultnormal_vertex:gd,displacementmap_pars_vertex:Md,displacementmap_vertex:xd,emissivemap_fragment:_d,emissivemap_pars_fragment:yd,encodings_fragment:vd,encodings_pars_fragment:wd,envmap_fragment:Ad,envmap_common_pars_fragment:bd,envmap_pars_fragment:Sd,envmap_pars_vertex:Td,envmap_physical_pars_fragment:kd,envmap_vertex:Dd,fog_vertex:Ed,fog_pars_vertex:Id,fog_fragment:Nd,fog_pars_fragment:Cd,gradientmap_pars_fragment:Ld,lightmap_fragment:zd,lightmap_pars_fragment:Od,lights_lambert_fragment:Pd,lights_lambert_pars_fragment:Rd,lights_pars_begin:Ud,lights_toon_fragment:jd,lights_toon_pars_fragment:Fd,lights_phong_fragment:Bd,lights_phong_pars_fragment:Gd,lights_physical_fragment:Vd,lights_physical_pars_fragment:Yd,lights_fragment_begin:Hd,lights_fragment_maps:Wd,lights_fragment_end:Qd,logdepthbuf_fragment:Kd,logdepthbuf_pars_fragment:Xd,logdepthbuf_pars_vertex:Zd,logdepthbuf_vertex:qd,map_fragment:$d,map_pars_fragment:Jd,map_particle_fragment:eu,map_particle_pars_fragment:tu,metalnessmap_fragment:nu,metalnessmap_pars_fragment:iu,morphcolor_vertex:su,morphnormal_vertex:ru,morphtarget_pars_vertex:ou,morphtarget_vertex:au,normal_fragment_begin:lu,normal_fragment_maps:cu,normal_pars_fragment:du,normal_pars_vertex:uu,normal_vertex:hu,normalmap_pars_fragment:fu,clearcoat_normal_fragment_begin:pu,clearcoat_normal_fragment_maps:mu,clearcoat_pars_fragment:gu,iridescence_pars_fragment:Mu,output_fragment:xu,packing:_u,premultiplied_alpha_fragment:yu,project_vertex:vu,dithering_fragment:wu,dithering_pars_fragment:Au,roughnessmap_fragment:bu,roughnessmap_pars_fragment:Su,shadowmap_pars_fragment:Tu,shadowmap_pars_vertex:Du,shadowmap_vertex:Eu,shadowmask_pars_fragment:Iu,skinbase_vertex:Nu,skinning_pars_vertex:Cu,skinning_vertex:Lu,skinnormal_vertex:zu,specularmap_fragment:Ou,specularmap_pars_fragment:Pu,tonemapping_fragment:Ru,tonemapping_pars_fragment:Uu,transmission_fragment:ku,transmission_pars_fragment:ju,uv_pars_fragment:Fu,uv_pars_vertex:Bu,uv_vertex:Gu,uv2_pars_fragment:Vu,uv2_pars_vertex:Yu,uv2_vertex:Hu,worldpos_vertex:Wu,background_vert:Qu,background_frag:Ku,backgroundCube_vert:Xu,backgroundCube_frag:Zu,cube_vert:qu,cube_frag:$u,depth_vert:Ju,depth_frag:eh,distanceRGBA_vert:th,distanceRGBA_frag:nh,equirect_vert:ih,equirect_frag:sh,linedashed_vert:rh,linedashed_frag:oh,meshbasic_vert:ah,meshbasic_frag:lh,meshlambert_vert:ch,meshlambert_frag:dh,meshmatcap_vert:uh,meshmatcap_frag:hh,meshnormal_vert:fh,meshnormal_frag:ph,meshphong_vert:mh,meshphong_frag:gh,meshphysical_vert:Mh,meshphysical_frag:xh,meshtoon_vert:_h,meshtoon_frag:yh,points_vert:vh,points_frag:wh,shadow_vert:Ah,shadow_frag:bh,sprite_vert:Sh,sprite_frag:Th},me={common:{diffuse:{value:new Ye(16777215)},opacity:{value:1},map:{value:null},uvTransform:{value:new yt},uv2Transform:{value:new yt},alphaMap:{value:null},alphaTest:{value:0}},specularmap:{specularMap:{value:null}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1}},emissivemap:{emissiveMap:{value:null}},bumpmap:{bumpMap:{value:null},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalScale:{value:new Ce(1,1)}},displacementmap:{displacementMap:{value:null},displacementScale:{value:1},displacementBias:{value:0}},roughnessmap:{roughnessMap:{value:null}},metalnessmap:{metalnessMap:{value:null}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ye(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ye(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaTest:{value:0},uvTransform:{value:new yt}},sprite:{diffuse:{value:new Ye(16777215)},opacity:{value:1},center:{value:new Ce(.5,.5)},rotation:{value:0},map:{value:null},alphaMap:{value:null},alphaTest:{value:0},uvTransform:{value:new yt}}},wt={basic:{uniforms:xt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.fog]),vertexShader:Ne.meshbasic_vert,fragmentShader:Ne.meshbasic_frag},lambert:{uniforms:xt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new Ye(0)}}]),vertexShader:Ne.meshlambert_vert,fragmentShader:Ne.meshlambert_frag},phong:{uniforms:xt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new Ye(0)},specular:{value:new Ye(1118481)},shininess:{value:30}}]),vertexShader:Ne.meshphong_vert,fragmentShader:Ne.meshphong_frag},standard:{uniforms:xt([me.common,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.roughnessmap,me.metalnessmap,me.fog,me.lights,{emissive:{value:new Ye(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ne.meshphysical_vert,fragmentShader:Ne.meshphysical_frag},toon:{uniforms:xt([me.common,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.gradientmap,me.fog,me.lights,{emissive:{value:new Ye(0)}}]),vertexShader:Ne.meshtoon_vert,fragmentShader:Ne.meshtoon_frag},matcap:{uniforms:xt([me.common,me.bumpmap,me.normalmap,me.displacementmap,me.fog,{matcap:{value:null}}]),vertexShader:Ne.meshmatcap_vert,fragmentShader:Ne.meshmatcap_frag},points:{uniforms:xt([me.points,me.fog]),vertexShader:Ne.points_vert,fragmentShader:Ne.points_frag},dashed:{uniforms:xt([me.common,me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ne.linedashed_vert,fragmentShader:Ne.linedashed_frag},depth:{uniforms:xt([me.common,me.displacementmap]),vertexShader:Ne.depth_vert,fragmentShader:Ne.depth_frag},normal:{uniforms:xt([me.common,me.bumpmap,me.normalmap,me.displacementmap,{opacity:{value:1}}]),vertexShader:Ne.meshnormal_vert,fragmentShader:Ne.meshnormal_frag},sprite:{uniforms:xt([me.sprite,me.fog]),vertexShader:Ne.sprite_vert,fragmentShader:Ne.sprite_frag},background:{uniforms:{uvTransform:{value:new yt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ne.background_vert,fragmentShader:Ne.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Ne.backgroundCube_vert,fragmentShader:Ne.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ne.cube_vert,fragmentShader:Ne.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ne.equirect_vert,fragmentShader:Ne.equirect_frag},distanceRGBA:{uniforms:xt([me.common,me.displacementmap,{referencePosition:{value:new F},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ne.distanceRGBA_vert,fragmentShader:Ne.distanceRGBA_frag},shadow:{uniforms:xt([me.lights,me.fog,{color:{value:new Ye(0)},opacity:{value:1}}]),vertexShader:Ne.shadow_vert,fragmentShader:Ne.shadow_frag}};wt.physical={uniforms:xt([wt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatNormalScale:{value:new Ce(1,1)},clearcoatNormalMap:{value:null},iridescence:{value:0},iridescenceMap:{value:null},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},sheen:{value:0},sheenColor:{value:new Ye(0)},sheenColorMap:{value:null},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},transmission:{value:0},transmissionMap:{value:null},transmissionSamplerSize:{value:new Ce},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},attenuationDistance:{value:0},attenuationColor:{value:new Ye(0)},specularIntensity:{value:1},specularIntensityMap:{value:null},specularColor:{value:new Ye(1,1,1)},specularColorMap:{value:null}}]),vertexShader:Ne.meshphysical_vert,fragmentShader:Ne.meshphysical_frag};const Oi={r:0,b:0,g:0};function Dh(s,e,t,n,i,r,a){const o=new Ye(0);let c=r===!0?0:1,l,d,h=null,u=0,m=null;function x(f,y){let w=!1,_=y.isScene===!0?y.background:null;_&&_.isTexture&&(_=(y.backgroundBlurriness>0?t:e).get(_));const S=s.xr,b=S.getSession&&S.getSession();b&&b.environmentBlendMode==="additive"&&(_=null),_===null?p(o,c):_&&_.isColor&&(p(_,1),w=!0),(s.autoClear||w)&&s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil),_&&(_.isCubeTexture||_.mapping===Yi)?(d===void 0&&(d=new Gt(new mi(1,1,1),new dn({name:"BackgroundCubeMaterial",uniforms:$n(wt.backgroundCube.uniforms),vertexShader:wt.backgroundCube.vertexShader,fragmentShader:wt.backgroundCube.fragmentShader,side:Dt,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(I,O,v){this.matrixWorld.copyPosition(v.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(d)),d.material.uniforms.envMap.value=_,d.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,d.material.toneMapped=_.encoding!==Xe,(h!==_||u!==_.version||m!==s.toneMapping)&&(d.material.needsUpdate=!0,h=_,u=_.version,m=s.toneMapping),d.layers.enableAll(),f.unshift(d,d.geometry,d.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new Gt(new Ks(2,2),new dn({name:"BackgroundMaterial",uniforms:$n(wt.background.uniforms),vertexShader:wt.background.vertexShader,fragmentShader:wt.background.fragmentShader,side:cn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,l.material.toneMapped=_.encoding!==Xe,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),(h!==_||u!==_.version||m!==s.toneMapping)&&(l.material.needsUpdate=!0,h=_,u=_.version,m=s.toneMapping),l.layers.enableAll(),f.unshift(l,l.geometry,l.material,0,0,null))}function p(f,y){f.getRGB(Oi,ia(s)),n.buffers.color.setClear(Oi.r,Oi.g,Oi.b,y,a)}return{getClearColor:function(){return o},setClearColor:function(f,y=1){o.set(f),c=y,p(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(f){c=f,p(o,c)},render:x}}function Eh(s,e,t,n){const i=s.getParameter(34921),r=n.isWebGL2?null:e.get("OES_vertex_array_object"),a=n.isWebGL2||r!==null,o={},c=f(null);let l=c,d=!1;function h(C,W,Q,$,Y){let ee=!1;if(a){const se=p($,Q,W);l!==se&&(l=se,m(l.object)),ee=y(C,$,Q,Y),ee&&w(C,$,Q,Y)}else{const se=W.wireframe===!0;(l.geometry!==$.id||l.program!==Q.id||l.wireframe!==se)&&(l.geometry=$.id,l.program=Q.id,l.wireframe=se,ee=!0)}Y!==null&&t.update(Y,34963),(ee||d)&&(d=!1,v(C,W,Q,$),Y!==null&&s.bindBuffer(34963,t.get(Y).buffer))}function u(){return n.isWebGL2?s.createVertexArray():r.createVertexArrayOES()}function m(C){return n.isWebGL2?s.bindVertexArray(C):r.bindVertexArrayOES(C)}function x(C){return n.isWebGL2?s.deleteVertexArray(C):r.deleteVertexArrayOES(C)}function p(C,W,Q){const $=Q.wireframe===!0;let Y=o[C.id];Y===void 0&&(Y={},o[C.id]=Y);let ee=Y[W.id];ee===void 0&&(ee={},Y[W.id]=ee);let se=ee[$];return se===void 0&&(se=f(u()),ee[$]=se),se}function f(C){const W=[],Q=[],$=[];for(let Y=0;Y<i;Y++)W[Y]=0,Q[Y]=0,$[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:W,enabledAttributes:Q,attributeDivisors:$,object:C,attributes:{},index:null}}function y(C,W,Q,$){const Y=l.attributes,ee=W.attributes;let se=0;const ce=Q.getAttributes();for(const V in ce)if(ce[V].location>=0){const de=Y[V];let U=ee[V];if(U===void 0&&(V==="instanceMatrix"&&C.instanceMatrix&&(U=C.instanceMatrix),V==="instanceColor"&&C.instanceColor&&(U=C.instanceColor)),de===void 0||de.attribute!==U||U&&de.data!==U.data)return!0;se++}return l.attributesNum!==se||l.index!==$}function w(C,W,Q,$){const Y={},ee=W.attributes;let se=0;const ce=Q.getAttributes();for(const V in ce)if(ce[V].location>=0){let de=ee[V];de===void 0&&(V==="instanceMatrix"&&C.instanceMatrix&&(de=C.instanceMatrix),V==="instanceColor"&&C.instanceColor&&(de=C.instanceColor));const U={};U.attribute=de,de&&de.data&&(U.data=de.data),Y[V]=U,se++}l.attributes=Y,l.attributesNum=se,l.index=$}function _(){const C=l.newAttributes;for(let W=0,Q=C.length;W<Q;W++)C[W]=0}function S(C){b(C,0)}function b(C,W){const Q=l.newAttributes,$=l.enabledAttributes,Y=l.attributeDivisors;Q[C]=1,$[C]===0&&(s.enableVertexAttribArray(C),$[C]=1),Y[C]!==W&&((n.isWebGL2?s:e.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](C,W),Y[C]=W)}function I(){const C=l.newAttributes,W=l.enabledAttributes;for(let Q=0,$=W.length;Q<$;Q++)W[Q]!==C[Q]&&(s.disableVertexAttribArray(Q),W[Q]=0)}function O(C,W,Q,$,Y,ee){n.isWebGL2===!0&&(Q===5124||Q===5125)?s.vertexAttribIPointer(C,W,Q,Y,ee):s.vertexAttribPointer(C,W,Q,$,Y,ee)}function v(C,W,Q,$){if(n.isWebGL2===!1&&(C.isInstancedMesh||$.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;_();const Y=$.attributes,ee=Q.getAttributes(),se=W.defaultAttributeValues;for(const ce in ee){const V=ee[ce];if(V.location>=0){let re=Y[ce];if(re===void 0&&(ce==="instanceMatrix"&&C.instanceMatrix&&(re=C.instanceMatrix),ce==="instanceColor"&&C.instanceColor&&(re=C.instanceColor)),re!==void 0){const de=re.normalized,U=re.itemSize,ne=t.get(re);if(ne===void 0)continue;const oe=ne.buffer,le=ne.type,ue=ne.bytesPerElement;if(re.isInterleavedBufferAttribute){const xe=re.data,_e=xe.stride,ye=re.offset;if(xe.isInstancedInterleavedBuffer){for(let we=0;we<V.locationSize;we++)b(V.location+we,xe.meshPerAttribute);C.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=xe.meshPerAttribute*xe.count)}else for(let we=0;we<V.locationSize;we++)S(V.location+we);s.bindBuffer(34962,oe);for(let we=0;we<V.locationSize;we++)O(V.location+we,U/V.locationSize,le,de,_e*ue,(ye+U/V.locationSize*we)*ue)}else{if(re.isInstancedBufferAttribute){for(let xe=0;xe<V.locationSize;xe++)b(V.location+xe,re.meshPerAttribute);C.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let xe=0;xe<V.locationSize;xe++)S(V.location+xe);s.bindBuffer(34962,oe);for(let xe=0;xe<V.locationSize;xe++)O(V.location+xe,U/V.locationSize,le,de,U*ue,U/V.locationSize*xe*ue)}}else if(se!==void 0){const de=se[ce];if(de!==void 0)switch(de.length){case 2:s.vertexAttrib2fv(V.location,de);break;case 3:s.vertexAttrib3fv(V.location,de);break;case 4:s.vertexAttrib4fv(V.location,de);break;default:s.vertexAttrib1fv(V.location,de)}}}}I()}function D(){q();for(const C in o){const W=o[C];for(const Q in W){const $=W[Q];for(const Y in $)x($[Y].object),delete $[Y];delete W[Q]}delete o[C]}}function R(C){if(o[C.id]===void 0)return;const W=o[C.id];for(const Q in W){const $=W[Q];for(const Y in $)x($[Y].object),delete $[Y];delete W[Q]}delete o[C.id]}function K(C){for(const W in o){const Q=o[W];if(Q[C.id]===void 0)continue;const $=Q[C.id];for(const Y in $)x($[Y].object),delete $[Y];delete Q[C.id]}}function q(){L(),d=!0,l!==c&&(l=c,m(l.object))}function L(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:h,reset:q,resetDefaultState:L,dispose:D,releaseStatesOfGeometry:R,releaseStatesOfProgram:K,initAttributes:_,enableAttribute:S,disableUnusedAttributes:I}}function Ih(s,e,t,n){const i=n.isWebGL2;let r;function a(l){r=l}function o(l,d){s.drawArrays(r,l,d),t.update(d,r,1)}function c(l,d,h){if(h===0)return;let u,m;if(i)u=s,m="drawArraysInstanced";else if(u=e.get("ANGLE_instanced_arrays"),m="drawArraysInstancedANGLE",u===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}u[m](r,l,d,h),t.update(d,r,h)}this.setMode=a,this.render=o,this.renderInstances=c}function Nh(s,e,t){let n;function i(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const O=e.get("EXT_texture_filter_anisotropic");n=s.getParameter(O.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(O){if(O==="highp"){if(s.getShaderPrecisionFormat(35633,36338).precision>0&&s.getShaderPrecisionFormat(35632,36338).precision>0)return"highp";O="mediump"}return O==="mediump"&&s.getShaderPrecisionFormat(35633,36337).precision>0&&s.getShaderPrecisionFormat(35632,36337).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&s instanceof WebGL2RenderingContext;let o=t.precision!==void 0?t.precision:"highp";const c=r(o);c!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",c,"instead."),o=c);const l=a||e.has("WEBGL_draw_buffers"),d=t.logarithmicDepthBuffer===!0,h=s.getParameter(34930),u=s.getParameter(35660),m=s.getParameter(3379),x=s.getParameter(34076),p=s.getParameter(34921),f=s.getParameter(36347),y=s.getParameter(36348),w=s.getParameter(36349),_=u>0,S=a||e.has("OES_texture_float"),b=_&&S,I=a?s.getParameter(36183):0;return{isWebGL2:a,drawBuffers:l,getMaxAnisotropy:i,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:d,maxTextures:h,maxVertexTextures:u,maxTextureSize:m,maxCubemapSize:x,maxAttributes:p,maxVertexUniforms:f,maxVaryings:y,maxFragmentUniforms:w,vertexTextures:_,floatFragmentTextures:S,floatVertexTextures:b,maxSamples:I}}function Ch(s){const e=this;let t=null,n=0,i=!1,r=!1;const a=new Mn,o=new yt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,u){const m=h.length!==0||u||n!==0||i;return i=u,n=h.length,m},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,u){t=d(h,u,0)},this.setState=function(h,u,m){const x=h.clippingPlanes,p=h.clipIntersection,f=h.clipShadows,y=s.get(h);if(!i||x===null||x.length===0||r&&!f)r?d(null):l();else{const w=r?0:n,_=w*4;let S=y.clippingState||null;c.value=S,S=d(x,u,_,m);for(let b=0;b!==_;++b)S[b]=t[b];y.clippingState=S,this.numIntersection=p?this.numPlanes:0,this.numPlanes+=w}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function d(h,u,m,x){const p=h!==null?h.length:0;let f=null;if(p!==0){if(f=c.value,x!==!0||f===null){const y=m+p*4,w=u.matrixWorldInverse;o.getNormalMatrix(w),(f===null||f.length<y)&&(f=new Float32Array(y));for(let _=0,S=m;_!==p;++_,S+=4)a.copy(h[_]).applyMatrix4(w,o),a.normal.toArray(f,S),f[S+3]=a.constant}c.value=f,c.needsUpdate=!0}return e.numPlanes=p,e.numIntersection=0,f}}function Lh(s){let e=new WeakMap;function t(a,o){return o===Rs?a.mapping=Xn:o===Us&&(a.mapping=Zn),a}function n(a){if(a&&a.isTexture&&a.isRenderTargetTexture===!1){const o=a.mapping;if(o===Rs||o===Us)if(e.has(a)){const c=e.get(a).texture;return t(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new Hc(c.height/2);return l.fromEquirectangularTexture(s,a),e.set(a,l),a.addEventListener("dispose",i),t(l.texture,a.mapping)}else return null}}return a}function i(a){const o=a.target;o.removeEventListener("dispose",i);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class aa extends sa{constructor(e=-1,t=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=i+t,c=i-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Hn=4,Xr=[.125,.215,.35,.446,.526,.582],_n=20,Ts=new aa,Zr=new Ye;let Ds=null;const xn=(1+Math.sqrt(5))/2,Vn=1/xn,qr=[new F(1,1,1),new F(-1,1,1),new F(1,1,-1),new F(-1,1,-1),new F(0,xn,Vn),new F(0,xn,-Vn),new F(Vn,0,xn),new F(-Vn,0,xn),new F(xn,Vn,0),new F(-xn,Vn,0)];class $r{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){Ds=this._renderer.getRenderTarget(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,i,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=to(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=eo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Ds),e.scissorTest=!1,Pi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Xn||e.mapping===Zn?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ds=this._renderer.getRenderTarget();const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Nt,minFilter:Nt,generateMipmaps:!1,type:hi,format:Ut,encoding:bn,depthBuffer:!1},i=Jr(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Jr(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=zh(r)),this._blurMaterial=Oh(r,e,t)}return i}_compileMaterial(e){const t=new Gt(this._lodPlanes[0],e);this._renderer.compile(t,Ts)}_sceneToCubeUV(e,t,n,i){const o=new Ct(90,1,t,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,u=d.toneMapping;d.getClearColor(Zr),d.toneMapping=$t,d.autoClear=!1;const m=new ea({name:"PMREM.Background",side:Dt,depthWrite:!1,depthTest:!1}),x=new Gt(new mi,m);let p=!1;const f=e.background;f?f.isColor&&(m.color.copy(f),e.background=null,p=!0):(m.color.copy(Zr),p=!0);for(let y=0;y<6;y++){const w=y%3;w===0?(o.up.set(0,c[y],0),o.lookAt(l[y],0,0)):w===1?(o.up.set(0,0,c[y]),o.lookAt(0,l[y],0)):(o.up.set(0,c[y],0),o.lookAt(0,0,l[y]));const _=this._cubeSize;Pi(i,w*_,y>2?_:0,_,_),d.setRenderTarget(i),p&&d.render(x,o),d.render(e,o)}x.geometry.dispose(),x.material.dispose(),d.toneMapping=u,d.autoClear=h,e.background=f}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===Xn||e.mapping===Zn;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=to()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=eo());const r=i?this._cubemapMaterial:this._equirectMaterial,a=new Gt(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;Pi(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,Ts)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let i=1;i<this._lodPlanes.length;i++){const r=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),a=qr[(i-1)%qr.length];this._blur(e,i-1,i,r,a)}t.autoClear=n}_blur(e,t,n,i,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",r),this._halfBlur(a,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,h=new Gt(this._lodPlanes[i],l),u=l.uniforms,m=this._sizeLods[n]-1,x=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*_n-1),p=r/x,f=isFinite(r)?1+Math.floor(d*p):_n;f>_n&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${f} samples when the maximum is set to ${_n}`);const y=[];let w=0;for(let O=0;O<_n;++O){const v=O/p,D=Math.exp(-v*v/2);y.push(D),O===0?w+=D:O<f&&(w+=2*D)}for(let O=0;O<y.length;O++)y[O]=y[O]/w;u.envMap.value=e.texture,u.samples.value=f,u.weights.value=y,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:_}=this;u.dTheta.value=x,u.mipInt.value=_-n;const S=this._sizeLods[i],b=3*S*(i>_-Hn?i-_+Hn:0),I=4*(this._cubeSize-S);Pi(t,b,I,3*S,2*S),c.setRenderTarget(t),c.render(h,Ts)}}function zh(s){const e=[],t=[],n=[];let i=s;const r=s-Hn+1+Xr.length;for(let a=0;a<r;a++){const o=Math.pow(2,i);t.push(o);let c=1/o;a>s-Hn?c=Xr[a-s+Hn-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),d=-l,h=1+l,u=[d,d,h,d,h,h,d,d,h,h,d,h],m=6,x=6,p=3,f=2,y=1,w=new Float32Array(p*x*m),_=new Float32Array(f*x*m),S=new Float32Array(y*x*m);for(let I=0;I<m;I++){const O=I%3*2/3-1,v=I>2?0:-1,D=[O,v,0,O+2/3,v,0,O+2/3,v+1,0,O,v,0,O+2/3,v+1,0,O,v+1,0];w.set(D,p*x*I),_.set(u,f*x*I);const R=[I,I,I,I,I,I];S.set(R,y*x*I)}const b=new Lt;b.setAttribute("position",new kt(w,p)),b.setAttribute("uv",new kt(_,f)),b.setAttribute("faceIndex",new kt(S,y)),e.push(b),i>Hn&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Jr(s,e,t){const n=new Tn(s,e,t);return n.texture.mapping=Yi,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Pi(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function Oh(s,e,t){const n=new Float32Array(_n),i=new F(0,1,0);return new dn({name:"SphericalGaussianBlur",defines:{n:_n,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Xs(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:an,depthTest:!1,depthWrite:!1})}function eo(){return new dn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Xs(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:an,depthTest:!1,depthWrite:!1})}function to(){return new dn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Xs(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:an,depthTest:!1,depthWrite:!1})}function Xs(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Ph(s){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===Rs||c===Us,d=c===Xn||c===Zn;if(l||d)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let h=e.get(o);return t===null&&(t=new $r(s)),h=l?t.fromEquirectangular(o,h):t.fromCubemap(o,h),e.set(o,h),h.texture}else{if(e.has(o))return e.get(o).texture;{const h=o.image;if(l&&h&&h.height>0||d&&h&&i(h)){t===null&&(t=new $r(s));const u=l?t.fromEquirectangular(o):t.fromCubemap(o);return e.set(o,u),o.addEventListener("dispose",r),u.texture}else return null}}}return o}function i(o){let c=0;const l=6;for(let d=0;d<l;d++)o[d]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Rh(s){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?t("EXT_color_buffer_float"):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(n){const i=t(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Uh(s,e,t,n){const i={},r=new WeakMap;function a(h){const u=h.target;u.index!==null&&e.remove(u.index);for(const x in u.attributes)e.remove(u.attributes[x]);u.removeEventListener("dispose",a),delete i[u.id];const m=r.get(u);m&&(e.remove(m),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(h,u){return i[u.id]===!0||(u.addEventListener("dispose",a),i[u.id]=!0,t.memory.geometries++),u}function c(h){const u=h.attributes;for(const x in u)e.update(u[x],34962);const m=h.morphAttributes;for(const x in m){const p=m[x];for(let f=0,y=p.length;f<y;f++)e.update(p[f],34962)}}function l(h){const u=[],m=h.index,x=h.attributes.position;let p=0;if(m!==null){const w=m.array;p=m.version;for(let _=0,S=w.length;_<S;_+=3){const b=w[_+0],I=w[_+1],O=w[_+2];u.push(b,I,I,O,O,b)}}else{const w=x.array;p=x.version;for(let _=0,S=w.length/3-1;_<S;_+=3){const b=_+0,I=_+1,O=_+2;u.push(b,I,I,O,O,b)}}const f=new(Qo(u)?na:ta)(u,1);f.version=p;const y=r.get(h);y&&e.remove(y),r.set(h,f)}function d(h){const u=r.get(h);if(u){const m=h.index;m!==null&&u.version<m.version&&l(h)}else l(h);return r.get(h)}return{get:o,update:c,getWireframeAttribute:d}}function kh(s,e,t,n){const i=n.isWebGL2;let r;function a(u){r=u}let o,c;function l(u){o=u.type,c=u.bytesPerElement}function d(u,m){s.drawElements(r,m,o,u*c),t.update(m,r,1)}function h(u,m,x){if(x===0)return;let p,f;if(i)p=s,f="drawElementsInstanced";else if(p=e.get("ANGLE_instanced_arrays"),f="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[f](r,m,o,u*c,x),t.update(m,r,x)}this.setMode=a,this.setIndex=l,this.render=d,this.renderInstances=h}function jh(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case 4:t.triangles+=o*(r/3);break;case 1:t.lines+=o*(r/2);break;case 3:t.lines+=o*(r-1);break;case 2:t.lines+=o*r;break;case 0:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){t.frame++,t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function Fh(s,e){return s[0]-e[0]}function Bh(s,e){return Math.abs(e[1])-Math.abs(s[1])}function Gh(s,e,t){const n={},i=new Float32Array(8),r=new WeakMap,a=new ct,o=[];for(let l=0;l<8;l++)o[l]=[l,0];function c(l,d,h){const u=l.morphTargetInfluences;if(e.isWebGL2===!0){const m=d.morphAttributes.position||d.morphAttributes.normal||d.morphAttributes.color,x=m!==void 0?m.length:0;let p=r.get(d);if(p===void 0||p.count!==x){let C=function(){q.dispose(),r.delete(d),d.removeEventListener("dispose",C)};p!==void 0&&p.texture.dispose();const w=d.morphAttributes.position!==void 0,_=d.morphAttributes.normal!==void 0,S=d.morphAttributes.color!==void 0,b=d.morphAttributes.position||[],I=d.morphAttributes.normal||[],O=d.morphAttributes.color||[];let v=0;w===!0&&(v=1),_===!0&&(v=2),S===!0&&(v=3);let D=d.attributes.position.count*v,R=1;D>e.maxTextureSize&&(R=Math.ceil(D/e.maxTextureSize),D=e.maxTextureSize);const K=new Float32Array(D*R*4*x),q=new Zo(K,D,R,x);q.type=vn,q.needsUpdate=!0;const L=v*4;for(let W=0;W<x;W++){const Q=b[W],$=I[W],Y=O[W],ee=D*R*4*W;for(let se=0;se<Q.count;se++){const ce=se*L;w===!0&&(a.fromBufferAttribute(Q,se),K[ee+ce+0]=a.x,K[ee+ce+1]=a.y,K[ee+ce+2]=a.z,K[ee+ce+3]=0),_===!0&&(a.fromBufferAttribute($,se),K[ee+ce+4]=a.x,K[ee+ce+5]=a.y,K[ee+ce+6]=a.z,K[ee+ce+7]=0),S===!0&&(a.fromBufferAttribute(Y,se),K[ee+ce+8]=a.x,K[ee+ce+9]=a.y,K[ee+ce+10]=a.z,K[ee+ce+11]=Y.itemSize===4?a.w:1)}}p={count:x,texture:q,size:new Ce(D,R)},r.set(d,p),d.addEventListener("dispose",C)}let f=0;for(let w=0;w<u.length;w++)f+=u[w];const y=d.morphTargetsRelative?1:1-f;h.getUniforms().setValue(s,"morphTargetBaseInfluence",y),h.getUniforms().setValue(s,"morphTargetInfluences",u),h.getUniforms().setValue(s,"morphTargetsTexture",p.texture,t),h.getUniforms().setValue(s,"morphTargetsTextureSize",p.size)}else{const m=u===void 0?0:u.length;let x=n[d.id];if(x===void 0||x.length!==m){x=[];for(let _=0;_<m;_++)x[_]=[_,0];n[d.id]=x}for(let _=0;_<m;_++){const S=x[_];S[0]=_,S[1]=u[_]}x.sort(Bh);for(let _=0;_<8;_++)_<m&&x[_][1]?(o[_][0]=x[_][0],o[_][1]=x[_][1]):(o[_][0]=Number.MAX_SAFE_INTEGER,o[_][1]=0);o.sort(Fh);const p=d.morphAttributes.position,f=d.morphAttributes.normal;let y=0;for(let _=0;_<8;_++){const S=o[_],b=S[0],I=S[1];b!==Number.MAX_SAFE_INTEGER&&I?(p&&d.getAttribute("morphTarget"+_)!==p[b]&&d.setAttribute("morphTarget"+_,p[b]),f&&d.getAttribute("morphNormal"+_)!==f[b]&&d.setAttribute("morphNormal"+_,f[b]),i[_]=I,y+=I):(p&&d.hasAttribute("morphTarget"+_)===!0&&d.deleteAttribute("morphTarget"+_),f&&d.hasAttribute("morphNormal"+_)===!0&&d.deleteAttribute("morphNormal"+_),i[_]=0)}const w=d.morphTargetsRelative?1:1-y;h.getUniforms().setValue(s,"morphTargetBaseInfluence",w),h.getUniforms().setValue(s,"morphTargetInfluences",i)}}return{update:c}}function Vh(s,e,t,n){let i=new WeakMap;function r(c){const l=n.render.frame,d=c.geometry,h=e.get(c,d);return i.get(h)!==l&&(e.update(h),i.set(h,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),t.update(c.instanceMatrix,34962),c.instanceColor!==null&&t.update(c.instanceColor,34962)),h}function a(){i=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:a}}const la=new Et,ca=new Zo,da=new Nc,ua=new ra,no=[],io=[],so=new Float32Array(16),ro=new Float32Array(9),oo=new Float32Array(4);function ei(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=no[i];if(r===void 0&&(r=new Float32Array(i),no[i]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function rt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function ot(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function Wi(s,e){let t=io[e];t===void 0&&(t=new Int32Array(e),io[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function Yh(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function Hh(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(rt(t,e))return;s.uniform2fv(this.addr,e),ot(t,e)}}function Wh(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(rt(t,e))return;s.uniform3fv(this.addr,e),ot(t,e)}}function Qh(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(rt(t,e))return;s.uniform4fv(this.addr,e),ot(t,e)}}function Kh(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(rt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),ot(t,e)}else{if(rt(t,n))return;oo.set(n),s.uniformMatrix2fv(this.addr,!1,oo),ot(t,n)}}function Xh(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(rt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),ot(t,e)}else{if(rt(t,n))return;ro.set(n),s.uniformMatrix3fv(this.addr,!1,ro),ot(t,n)}}function Zh(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(rt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),ot(t,e)}else{if(rt(t,n))return;so.set(n),s.uniformMatrix4fv(this.addr,!1,so),ot(t,n)}}function qh(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function $h(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(rt(t,e))return;s.uniform2iv(this.addr,e),ot(t,e)}}function Jh(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(rt(t,e))return;s.uniform3iv(this.addr,e),ot(t,e)}}function ef(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(rt(t,e))return;s.uniform4iv(this.addr,e),ot(t,e)}}function tf(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function nf(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(rt(t,e))return;s.uniform2uiv(this.addr,e),ot(t,e)}}function sf(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(rt(t,e))return;s.uniform3uiv(this.addr,e),ot(t,e)}}function rf(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(rt(t,e))return;s.uniform4uiv(this.addr,e),ot(t,e)}}function of(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2D(e||la,i)}function af(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||da,i)}function lf(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||ua,i)}function cf(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||ca,i)}function df(s){switch(s){case 5126:return Yh;case 35664:return Hh;case 35665:return Wh;case 35666:return Qh;case 35674:return Kh;case 35675:return Xh;case 35676:return Zh;case 5124:case 35670:return qh;case 35667:case 35671:return $h;case 35668:case 35672:return Jh;case 35669:case 35673:return ef;case 5125:return tf;case 36294:return nf;case 36295:return sf;case 36296:return rf;case 35678:case 36198:case 36298:case 36306:case 35682:return of;case 35679:case 36299:case 36307:return af;case 35680:case 36300:case 36308:case 36293:return lf;case 36289:case 36303:case 36311:case 36292:return cf}}function uf(s,e){s.uniform1fv(this.addr,e)}function hf(s,e){const t=ei(e,this.size,2);s.uniform2fv(this.addr,t)}function ff(s,e){const t=ei(e,this.size,3);s.uniform3fv(this.addr,t)}function pf(s,e){const t=ei(e,this.size,4);s.uniform4fv(this.addr,t)}function mf(s,e){const t=ei(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function gf(s,e){const t=ei(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function Mf(s,e){const t=ei(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function xf(s,e){s.uniform1iv(this.addr,e)}function _f(s,e){s.uniform2iv(this.addr,e)}function yf(s,e){s.uniform3iv(this.addr,e)}function vf(s,e){s.uniform4iv(this.addr,e)}function wf(s,e){s.uniform1uiv(this.addr,e)}function Af(s,e){s.uniform2uiv(this.addr,e)}function bf(s,e){s.uniform3uiv(this.addr,e)}function Sf(s,e){s.uniform4uiv(this.addr,e)}function Tf(s,e,t){const n=this.cache,i=e.length,r=Wi(t,i);rt(n,r)||(s.uniform1iv(this.addr,r),ot(n,r));for(let a=0;a!==i;++a)t.setTexture2D(e[a]||la,r[a])}function Df(s,e,t){const n=this.cache,i=e.length,r=Wi(t,i);rt(n,r)||(s.uniform1iv(this.addr,r),ot(n,r));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||da,r[a])}function Ef(s,e,t){const n=this.cache,i=e.length,r=Wi(t,i);rt(n,r)||(s.uniform1iv(this.addr,r),ot(n,r));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||ua,r[a])}function If(s,e,t){const n=this.cache,i=e.length,r=Wi(t,i);rt(n,r)||(s.uniform1iv(this.addr,r),ot(n,r));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||ca,r[a])}function Nf(s){switch(s){case 5126:return uf;case 35664:return hf;case 35665:return ff;case 35666:return pf;case 35674:return mf;case 35675:return gf;case 35676:return Mf;case 5124:case 35670:return xf;case 35667:case 35671:return _f;case 35668:case 35672:return yf;case 35669:case 35673:return vf;case 5125:return wf;case 36294:return Af;case 36295:return bf;case 36296:return Sf;case 35678:case 36198:case 36298:case 36306:case 35682:return Tf;case 35679:case 36299:case 36307:return Df;case 35680:case 36300:case 36308:case 36293:return Ef;case 36289:case 36303:case 36311:case 36292:return If}}class Cf{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.setValue=df(t.type)}}class Lf{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.size=t.size,this.setValue=Nf(t.type)}}class zf{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(e,t[o.id],n)}}}const Es=/(\w+)(\])?(\[|\.)?/g;function ao(s,e){s.seq.push(e),s.map[e.id]=e}function Of(s,e,t){const n=s.name,i=n.length;for(Es.lastIndex=0;;){const r=Es.exec(n),a=Es.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===i){ao(t,l===void 0?new Cf(o,s,e):new Lf(o,s,e));break}else{let h=t.map[o];h===void 0&&(h=new zf(o),ao(t,h)),t=h}}}class Bi{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,35718);for(let i=0;i<n;++i){const r=e.getActiveUniform(t,i),a=e.getUniformLocation(t,r.name);Of(r,a,this)}}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function lo(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}let Pf=0;function Rf(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}function Uf(s){switch(s){case bn:return["Linear","( value )"];case Xe:return["sRGB","( value )"];default:return console.warn("THREE.WebGLProgram: Unsupported encoding:",s),["Linear","( value )"]}}function co(s,e,t){const n=s.getShaderParameter(e,35713),i=s.getShaderInfoLog(e).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const a=parseInt(r[1]);return t.toUpperCase()+`

`+i+`

`+Rf(s.getShaderSource(e),a)}else return i}function kf(s,e){const t=Uf(e);return"vec4 "+s+"( vec4 value ) { return LinearTo"+t[0]+t[1]+"; }"}function jf(s,e){let t;switch(e){case Zl:t="Linear";break;case ql:t="Reinhard";break;case $l:t="OptimizedCineon";break;case Jl:t="ACESFilmic";break;case ec:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function Ff(s){return[s.extensionDerivatives||s.envMapCubeUVHeight||s.bumpMap||s.tangentSpaceNormalMap||s.clearcoatNormalMap||s.flatShading||s.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(s.extensionFragDepth||s.logarithmicDepthBuffer)&&s.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",s.extensionDrawBuffers&&s.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(s.extensionShaderTextureLOD||s.envMap||s.transmission)&&s.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(di).join(`
`)}function Bf(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Gf(s,e){const t={},n=s.getProgramParameter(e,35721);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),a=r.name;let o=1;r.type===35674&&(o=2),r.type===35675&&(o=3),r.type===35676&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function di(s){return s!==""}function uo(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ho(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Vf=/^[ \t]*#include +<([\w\d./]+)>/gm;function Gs(s){return s.replace(Vf,Yf)}function Yf(s,e){const t=Ne[e];if(t===void 0)throw new Error("Can not resolve #include <"+e+">");return Gs(t)}const Hf=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function fo(s){return s.replace(Hf,Wf)}function Wf(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function po(s){let e="precision "+s.precision+` float;
precision `+s.precision+" int;";return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Qf(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===jo?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===El?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===ci&&(e="SHADOWMAP_TYPE_VSM"),e}function Kf(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Xn:case Zn:e="ENVMAP_TYPE_CUBE";break;case Yi:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Xf(s){let e="ENVMAP_MODE_REFLECTION";return s.envMap&&s.envMapMode===Zn&&(e="ENVMAP_MODE_REFRACTION"),e}function Zf(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Go:e="ENVMAP_BLENDING_MULTIPLY";break;case Kl:e="ENVMAP_BLENDING_MIX";break;case Xl:e="ENVMAP_BLENDING_ADD";break}return e}function qf(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function $f(s,e,t,n){const i=s.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=Qf(t),l=Kf(t),d=Xf(t),h=Zf(t),u=qf(t),m=t.isWebGL2?"":Ff(t),x=Bf(r),p=i.createProgram();let f,y,w=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=[x].filter(di).join(`
`),f.length>0&&(f+=`
`),y=[m,x].filter(di).join(`
`),y.length>0&&(y+=`
`)):(f=[po(t),"#define SHADER_NAME "+t.shaderName,x,t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.supportsVertexTextures?"#define VERTEX_TEXTURES":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMap&&t.objectSpaceNormalMap?"#define OBJECTSPACE_NORMALMAP":"",t.normalMap&&t.tangentSpaceNormalMap?"#define TANGENTSPACE_NORMALMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.displacementMap&&t.supportsVertexTextures?"#define USE_DISPLACEMENTMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularIntensityMap?"#define USE_SPECULARINTENSITYMAP":"",t.specularColorMap?"#define USE_SPECULARCOLORMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEENCOLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEENROUGHNESSMAP":"",t.vertexTangents?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUvs?"#define USE_UV":"",t.uvsVertexOnly?"#define UVS_VERTEX_ONLY":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(di).join(`
`),y=[m,po(t),"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+d:"",t.envMap?"#define "+h:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMap&&t.objectSpaceNormalMap?"#define OBJECTSPACE_NORMALMAP":"",t.normalMap&&t.tangentSpaceNormalMap?"#define TANGENTSPACE_NORMALMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularIntensityMap?"#define USE_SPECULARINTENSITYMAP":"",t.specularColorMap?"#define USE_SPECULARCOLORMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEENCOLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEENROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.vertexTangents?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUvs?"#define USE_UV":"",t.uvsVertexOnly?"#define UVS_VERTEX_ONLY":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==$t?"#define TONE_MAPPING":"",t.toneMapping!==$t?Ne.tonemapping_pars_fragment:"",t.toneMapping!==$t?jf("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ne.encodings_pars_fragment,kf("linearToOutputTexel",t.outputEncoding),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(di).join(`
`)),a=Gs(a),a=uo(a,t),a=ho(a,t),o=Gs(o),o=uo(o,t),o=ho(o,t),a=fo(a),o=fo(o),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,f=["precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,y=["#define varying in",t.glslVersion===Pr?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Pr?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+y);const _=w+f+a,S=w+y+o,b=lo(i,35633,_),I=lo(i,35632,S);if(i.attachShader(p,b),i.attachShader(p,I),t.index0AttributeName!==void 0?i.bindAttribLocation(p,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(p,0,"position"),i.linkProgram(p),s.debug.checkShaderErrors){const D=i.getProgramInfoLog(p).trim(),R=i.getShaderInfoLog(b).trim(),K=i.getShaderInfoLog(I).trim();let q=!0,L=!0;if(i.getProgramParameter(p,35714)===!1){q=!1;const C=co(i,b,"vertex"),W=co(i,I,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(p,35715)+`

Program Info Log: `+D+`
`+C+`
`+W)}else D!==""?console.warn("THREE.WebGLProgram: Program Info Log:",D):(R===""||K==="")&&(L=!1);L&&(this.diagnostics={runnable:q,programLog:D,vertexShader:{log:R,prefix:f},fragmentShader:{log:K,prefix:y}})}i.deleteShader(b),i.deleteShader(I);let O;this.getUniforms=function(){return O===void 0&&(O=new Bi(i,p)),O};let v;return this.getAttributes=function(){return v===void 0&&(v=Gf(i,p)),v},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(p),this.program=void 0},this.name=t.shaderName,this.id=Pf++,this.cacheKey=e,this.usedTimes=1,this.program=p,this.vertexShader=b,this.fragmentShader=I,this}let Jf=0;class ep{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new tp(e),t.set(e,n)),n}}class tp{constructor(e){this.id=Jf++,this.code=e,this.usedTimes=0}}function np(s,e,t,n,i,r,a){const o=new $o,c=new ep,l=[],d=i.isWebGL2,h=i.logarithmicDepthBuffer,u=i.vertexTextures;let m=i.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(v,D,R,K,q){const L=K.fog,C=q.geometry,W=v.isMeshStandardMaterial?K.environment:null,Q=(v.isMeshStandardMaterial?t:e).get(v.envMap||W),$=Q&&Q.mapping===Yi?Q.image.height:null,Y=x[v.type];v.precision!==null&&(m=i.getMaxPrecision(v.precision),m!==v.precision&&console.warn("THREE.WebGLProgram.getParameters:",v.precision,"not supported, using",m,"instead."));const ee=C.morphAttributes.position||C.morphAttributes.normal||C.morphAttributes.color,se=ee!==void 0?ee.length:0;let ce=0;C.morphAttributes.position!==void 0&&(ce=1),C.morphAttributes.normal!==void 0&&(ce=2),C.morphAttributes.color!==void 0&&(ce=3);let V,re,de,U;if(Y){const _e=wt[Y];V=_e.vertexShader,re=_e.fragmentShader}else V=v.vertexShader,re=v.fragmentShader,c.update(v),de=c.getVertexShaderID(v),U=c.getFragmentShaderID(v);const ne=s.getRenderTarget(),oe=v.alphaTest>0,le=v.clearcoat>0,ue=v.iridescence>0;return{isWebGL2:d,shaderID:Y,shaderName:v.type,vertexShader:V,fragmentShader:re,defines:v.defines,customVertexShaderID:de,customFragmentShaderID:U,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:m,instancing:q.isInstancedMesh===!0,instancingColor:q.isInstancedMesh===!0&&q.instanceColor!==null,supportsVertexTextures:u,outputEncoding:ne===null?s.outputEncoding:ne.isXRRenderTarget===!0?ne.texture.encoding:bn,map:!!v.map,matcap:!!v.matcap,envMap:!!Q,envMapMode:Q&&Q.mapping,envMapCubeUVHeight:$,lightMap:!!v.lightMap,aoMap:!!v.aoMap,emissiveMap:!!v.emissiveMap,bumpMap:!!v.bumpMap,normalMap:!!v.normalMap,objectSpaceNormalMap:v.normalMapType===_c,tangentSpaceNormalMap:v.normalMapType===Ho,decodeVideoTexture:!!v.map&&v.map.isVideoTexture===!0&&v.map.encoding===Xe,clearcoat:le,clearcoatMap:le&&!!v.clearcoatMap,clearcoatRoughnessMap:le&&!!v.clearcoatRoughnessMap,clearcoatNormalMap:le&&!!v.clearcoatNormalMap,iridescence:ue,iridescenceMap:ue&&!!v.iridescenceMap,iridescenceThicknessMap:ue&&!!v.iridescenceThicknessMap,displacementMap:!!v.displacementMap,roughnessMap:!!v.roughnessMap,metalnessMap:!!v.metalnessMap,specularMap:!!v.specularMap,specularIntensityMap:!!v.specularIntensityMap,specularColorMap:!!v.specularColorMap,opaque:v.transparent===!1&&v.blending===Wn,alphaMap:!!v.alphaMap,alphaTest:oe,gradientMap:!!v.gradientMap,sheen:v.sheen>0,sheenColorMap:!!v.sheenColorMap,sheenRoughnessMap:!!v.sheenRoughnessMap,transmission:v.transmission>0,transmissionMap:!!v.transmissionMap,thicknessMap:!!v.thicknessMap,combine:v.combine,vertexTangents:!!v.normalMap&&!!C.attributes.tangent,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!C.attributes.color&&C.attributes.color.itemSize===4,vertexUvs:!!v.map||!!v.bumpMap||!!v.normalMap||!!v.specularMap||!!v.alphaMap||!!v.emissiveMap||!!v.roughnessMap||!!v.metalnessMap||!!v.clearcoatMap||!!v.clearcoatRoughnessMap||!!v.clearcoatNormalMap||!!v.iridescenceMap||!!v.iridescenceThicknessMap||!!v.displacementMap||!!v.transmissionMap||!!v.thicknessMap||!!v.specularIntensityMap||!!v.specularColorMap||!!v.sheenColorMap||!!v.sheenRoughnessMap,uvsVertexOnly:!(v.map||v.bumpMap||v.normalMap||v.specularMap||v.alphaMap||v.emissiveMap||v.roughnessMap||v.metalnessMap||v.clearcoatNormalMap||v.iridescenceMap||v.iridescenceThicknessMap||v.transmission>0||v.transmissionMap||v.thicknessMap||v.specularIntensityMap||v.specularColorMap||v.sheen>0||v.sheenColorMap||v.sheenRoughnessMap)&&!!v.displacementMap,fog:!!L,useFog:v.fog===!0,fogExp2:L&&L.isFogExp2,flatShading:!!v.flatShading,sizeAttenuation:v.sizeAttenuation,logarithmicDepthBuffer:h,skinning:q.isSkinnedMesh===!0,morphTargets:C.morphAttributes.position!==void 0,morphNormals:C.morphAttributes.normal!==void 0,morphColors:C.morphAttributes.color!==void 0,morphTargetsCount:se,morphTextureStride:ce,numDirLights:D.directional.length,numPointLights:D.point.length,numSpotLights:D.spot.length,numSpotLightMaps:D.spotLightMap.length,numRectAreaLights:D.rectArea.length,numHemiLights:D.hemi.length,numDirLightShadows:D.directionalShadowMap.length,numPointLightShadows:D.pointShadowMap.length,numSpotLightShadows:D.spotShadowMap.length,numSpotLightShadowsWithMaps:D.numSpotLightShadowsWithMaps,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:v.dithering,shadowMapEnabled:s.shadowMap.enabled&&R.length>0,shadowMapType:s.shadowMap.type,toneMapping:v.toneMapped?s.toneMapping:$t,useLegacyLights:s.useLegacyLights,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===qt,flipSided:v.side===Dt,useDepthPacking:!!v.depthPacking,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionDerivatives:v.extensions&&v.extensions.derivatives,extensionFragDepth:v.extensions&&v.extensions.fragDepth,extensionDrawBuffers:v.extensions&&v.extensions.drawBuffers,extensionShaderTextureLOD:v.extensions&&v.extensions.shaderTextureLOD,rendererExtensionFragDepth:d||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:d||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:d||n.has("EXT_shader_texture_lod"),customProgramCacheKey:v.customProgramCacheKey()}}function f(v){const D=[];if(v.shaderID?D.push(v.shaderID):(D.push(v.customVertexShaderID),D.push(v.customFragmentShaderID)),v.defines!==void 0)for(const R in v.defines)D.push(R),D.push(v.defines[R]);return v.isRawShaderMaterial===!1&&(y(D,v),w(D,v),D.push(s.outputEncoding)),D.push(v.customProgramCacheKey),D.join()}function y(v,D){v.push(D.precision),v.push(D.outputEncoding),v.push(D.envMapMode),v.push(D.envMapCubeUVHeight),v.push(D.combine),v.push(D.vertexUvs),v.push(D.fogExp2),v.push(D.sizeAttenuation),v.push(D.morphTargetsCount),v.push(D.morphAttributeCount),v.push(D.numDirLights),v.push(D.numPointLights),v.push(D.numSpotLights),v.push(D.numSpotLightMaps),v.push(D.numHemiLights),v.push(D.numRectAreaLights),v.push(D.numDirLightShadows),v.push(D.numPointLightShadows),v.push(D.numSpotLightShadows),v.push(D.numSpotLightShadowsWithMaps),v.push(D.shadowMapType),v.push(D.toneMapping),v.push(D.numClippingPlanes),v.push(D.numClipIntersection),v.push(D.depthPacking)}function w(v,D){o.disableAll(),D.isWebGL2&&o.enable(0),D.supportsVertexTextures&&o.enable(1),D.instancing&&o.enable(2),D.instancingColor&&o.enable(3),D.map&&o.enable(4),D.matcap&&o.enable(5),D.envMap&&o.enable(6),D.lightMap&&o.enable(7),D.aoMap&&o.enable(8),D.emissiveMap&&o.enable(9),D.bumpMap&&o.enable(10),D.normalMap&&o.enable(11),D.objectSpaceNormalMap&&o.enable(12),D.tangentSpaceNormalMap&&o.enable(13),D.clearcoat&&o.enable(14),D.clearcoatMap&&o.enable(15),D.clearcoatRoughnessMap&&o.enable(16),D.clearcoatNormalMap&&o.enable(17),D.iridescence&&o.enable(18),D.iridescenceMap&&o.enable(19),D.iridescenceThicknessMap&&o.enable(20),D.displacementMap&&o.enable(21),D.specularMap&&o.enable(22),D.roughnessMap&&o.enable(23),D.metalnessMap&&o.enable(24),D.gradientMap&&o.enable(25),D.alphaMap&&o.enable(26),D.alphaTest&&o.enable(27),D.vertexColors&&o.enable(28),D.vertexAlphas&&o.enable(29),D.vertexUvs&&o.enable(30),D.vertexTangents&&o.enable(31),D.uvsVertexOnly&&o.enable(32),v.push(o.mask),o.disableAll(),D.fog&&o.enable(0),D.useFog&&o.enable(1),D.flatShading&&o.enable(2),D.logarithmicDepthBuffer&&o.enable(3),D.skinning&&o.enable(4),D.morphTargets&&o.enable(5),D.morphNormals&&o.enable(6),D.morphColors&&o.enable(7),D.premultipliedAlpha&&o.enable(8),D.shadowMapEnabled&&o.enable(9),D.useLegacyLights&&o.enable(10),D.doubleSided&&o.enable(11),D.flipSided&&o.enable(12),D.useDepthPacking&&o.enable(13),D.dithering&&o.enable(14),D.specularIntensityMap&&o.enable(15),D.specularColorMap&&o.enable(16),D.transmission&&o.enable(17),D.transmissionMap&&o.enable(18),D.thicknessMap&&o.enable(19),D.sheen&&o.enable(20),D.sheenColorMap&&o.enable(21),D.sheenRoughnessMap&&o.enable(22),D.decodeVideoTexture&&o.enable(23),D.opaque&&o.enable(24),v.push(o.mask)}function _(v){const D=x[v.type];let R;if(D){const K=wt[D];R=Ws.clone(K.uniforms)}else R=v.uniforms;return R}function S(v,D){let R;for(let K=0,q=l.length;K<q;K++){const L=l[K];if(L.cacheKey===D){R=L,++R.usedTimes;break}}return R===void 0&&(R=new $f(s,D,v,r),l.push(R)),R}function b(v){if(--v.usedTimes===0){const D=l.indexOf(v);l[D]=l[l.length-1],l.pop(),v.destroy()}}function I(v){c.remove(v)}function O(){c.dispose()}return{getParameters:p,getProgramCacheKey:f,getUniforms:_,acquireProgram:S,releaseProgram:b,releaseShaderCache:I,programs:l,dispose:O}}function ip(){let s=new WeakMap;function e(r){let a=s.get(r);return a===void 0&&(a={},s.set(r,a)),a}function t(r){s.delete(r)}function n(r,a,o){s.get(r)[a]=o}function i(){s=new WeakMap}return{get:e,remove:t,update:n,dispose:i}}function sp(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function mo(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function go(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function a(h,u,m,x,p,f){let y=s[e];return y===void 0?(y={id:h.id,object:h,geometry:u,material:m,groupOrder:x,renderOrder:h.renderOrder,z:p,group:f},s[e]=y):(y.id=h.id,y.object=h,y.geometry=u,y.material=m,y.groupOrder=x,y.renderOrder=h.renderOrder,y.z=p,y.group=f),e++,y}function o(h,u,m,x,p,f){const y=a(h,u,m,x,p,f);m.transmission>0?n.push(y):m.transparent===!0?i.push(y):t.push(y)}function c(h,u,m,x,p,f){const y=a(h,u,m,x,p,f);m.transmission>0?n.unshift(y):m.transparent===!0?i.unshift(y):t.unshift(y)}function l(h,u){t.length>1&&t.sort(h||sp),n.length>1&&n.sort(u||mo),i.length>1&&i.sort(u||mo)}function d(){for(let h=e,u=s.length;h<u;h++){const m=s[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:o,unshift:c,finish:d,sort:l}}function rp(){let s=new WeakMap;function e(n,i){const r=s.get(n);let a;return r===void 0?(a=new go,s.set(n,[a])):i>=r.length?(a=new go,r.push(a)):a=r[i],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function op(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new F,color:new Ye};break;case"SpotLight":t={position:new F,direction:new F,color:new Ye,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new F,color:new Ye,distance:0,decay:0};break;case"HemisphereLight":t={direction:new F,skyColor:new Ye,groundColor:new Ye};break;case"RectAreaLight":t={color:new Ye,position:new F,halfWidth:new F,halfHeight:new F};break}return s[e.id]=t,t}}}function ap(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ce};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ce};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ce,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let lp=0;function cp(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function dp(s,e){const t=new op,n=ap(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0};for(let d=0;d<9;d++)i.probe.push(new F);const r=new F,a=new tt,o=new tt;function c(d,h){let u=0,m=0,x=0;for(let K=0;K<9;K++)i.probe[K].set(0,0,0);let p=0,f=0,y=0,w=0,_=0,S=0,b=0,I=0,O=0,v=0;d.sort(cp);const D=h===!0?Math.PI:1;for(let K=0,q=d.length;K<q;K++){const L=d[K],C=L.color,W=L.intensity,Q=L.distance,$=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)u+=C.r*W*D,m+=C.g*W*D,x+=C.b*W*D;else if(L.isLightProbe)for(let Y=0;Y<9;Y++)i.probe[Y].addScaledVector(L.sh.coefficients[Y],W);else if(L.isDirectionalLight){const Y=t.get(L);if(Y.color.copy(L.color).multiplyScalar(L.intensity*D),L.castShadow){const ee=L.shadow,se=n.get(L);se.shadowBias=ee.bias,se.shadowNormalBias=ee.normalBias,se.shadowRadius=ee.radius,se.shadowMapSize=ee.mapSize,i.directionalShadow[p]=se,i.directionalShadowMap[p]=$,i.directionalShadowMatrix[p]=L.shadow.matrix,S++}i.directional[p]=Y,p++}else if(L.isSpotLight){const Y=t.get(L);Y.position.setFromMatrixPosition(L.matrixWorld),Y.color.copy(C).multiplyScalar(W*D),Y.distance=Q,Y.coneCos=Math.cos(L.angle),Y.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),Y.decay=L.decay,i.spot[y]=Y;const ee=L.shadow;if(L.map&&(i.spotLightMap[O]=L.map,O++,ee.updateMatrices(L),L.castShadow&&v++),i.spotLightMatrix[y]=ee.matrix,L.castShadow){const se=n.get(L);se.shadowBias=ee.bias,se.shadowNormalBias=ee.normalBias,se.shadowRadius=ee.radius,se.shadowMapSize=ee.mapSize,i.spotShadow[y]=se,i.spotShadowMap[y]=$,I++}y++}else if(L.isRectAreaLight){const Y=t.get(L);Y.color.copy(C).multiplyScalar(W),Y.halfWidth.set(L.width*.5,0,0),Y.halfHeight.set(0,L.height*.5,0),i.rectArea[w]=Y,w++}else if(L.isPointLight){const Y=t.get(L);if(Y.color.copy(L.color).multiplyScalar(L.intensity*D),Y.distance=L.distance,Y.decay=L.decay,L.castShadow){const ee=L.shadow,se=n.get(L);se.shadowBias=ee.bias,se.shadowNormalBias=ee.normalBias,se.shadowRadius=ee.radius,se.shadowMapSize=ee.mapSize,se.shadowCameraNear=ee.camera.near,se.shadowCameraFar=ee.camera.far,i.pointShadow[f]=se,i.pointShadowMap[f]=$,i.pointShadowMatrix[f]=L.shadow.matrix,b++}i.point[f]=Y,f++}else if(L.isHemisphereLight){const Y=t.get(L);Y.skyColor.copy(L.color).multiplyScalar(W*D),Y.groundColor.copy(L.groundColor).multiplyScalar(W*D),i.hemi[_]=Y,_++}}w>0&&(e.isWebGL2||s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=me.LTC_FLOAT_1,i.rectAreaLTC2=me.LTC_FLOAT_2):s.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=me.LTC_HALF_1,i.rectAreaLTC2=me.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=u,i.ambient[1]=m,i.ambient[2]=x;const R=i.hash;(R.directionalLength!==p||R.pointLength!==f||R.spotLength!==y||R.rectAreaLength!==w||R.hemiLength!==_||R.numDirectionalShadows!==S||R.numPointShadows!==b||R.numSpotShadows!==I||R.numSpotMaps!==O)&&(i.directional.length=p,i.spot.length=y,i.rectArea.length=w,i.point.length=f,i.hemi.length=_,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.pointShadow.length=b,i.pointShadowMap.length=b,i.spotShadow.length=I,i.spotShadowMap.length=I,i.directionalShadowMatrix.length=S,i.pointShadowMatrix.length=b,i.spotLightMatrix.length=I+O-v,i.spotLightMap.length=O,i.numSpotLightShadowsWithMaps=v,R.directionalLength=p,R.pointLength=f,R.spotLength=y,R.rectAreaLength=w,R.hemiLength=_,R.numDirectionalShadows=S,R.numPointShadows=b,R.numSpotShadows=I,R.numSpotMaps=O,i.version=lp++)}function l(d,h){let u=0,m=0,x=0,p=0,f=0;const y=h.matrixWorldInverse;for(let w=0,_=d.length;w<_;w++){const S=d[w];if(S.isDirectionalLight){const b=i.directional[u];b.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),b.direction.sub(r),b.direction.transformDirection(y),u++}else if(S.isSpotLight){const b=i.spot[x];b.position.setFromMatrixPosition(S.matrixWorld),b.position.applyMatrix4(y),b.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),b.direction.sub(r),b.direction.transformDirection(y),x++}else if(S.isRectAreaLight){const b=i.rectArea[p];b.position.setFromMatrixPosition(S.matrixWorld),b.position.applyMatrix4(y),o.identity(),a.copy(S.matrixWorld),a.premultiply(y),o.extractRotation(a),b.halfWidth.set(S.width*.5,0,0),b.halfHeight.set(0,S.height*.5,0),b.halfWidth.applyMatrix4(o),b.halfHeight.applyMatrix4(o),p++}else if(S.isPointLight){const b=i.point[m];b.position.setFromMatrixPosition(S.matrixWorld),b.position.applyMatrix4(y),m++}else if(S.isHemisphereLight){const b=i.hemi[f];b.direction.setFromMatrixPosition(S.matrixWorld),b.direction.transformDirection(y),f++}}}return{setup:c,setupView:l,state:i}}function Mo(s,e){const t=new dp(s,e),n=[],i=[];function r(){n.length=0,i.length=0}function a(h){n.push(h)}function o(h){i.push(h)}function c(h){t.setup(n,h)}function l(h){t.setupView(n,h)}return{init:r,state:{lightsArray:n,shadowsArray:i,lights:t},setupLights:c,setupLightsView:l,pushLight:a,pushShadow:o}}function up(s,e){let t=new WeakMap;function n(r,a=0){const o=t.get(r);let c;return o===void 0?(c=new Mo(s,e),t.set(r,[c])):a>=o.length?(c=new Mo(s,e),o.push(c)):c=o[a],c}function i(){t=new WeakMap}return{get:n,dispose:i}}class hp extends Jn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Mc,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class fp extends Jn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.referencePosition=new F,this.nearDistance=1,this.farDistance=1e3,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.referencePosition.copy(e.referencePosition),this.nearDistance=e.nearDistance,this.farDistance=e.farDistance,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const pp=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,mp=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function gp(s,e,t){let n=new Qs;const i=new Ce,r=new Ce,a=new ct,o=new hp({depthPacking:xc}),c=new fp,l={},d=t.maxTextureSize,h={[cn]:Dt,[Dt]:cn,[qt]:qt},u=new dn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ce},radius:{value:4}},vertexShader:pp,fragmentShader:mp}),m=u.clone();m.defines.HORIZONTAL_PASS=1;const x=new Lt;x.setAttribute("position",new kt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const p=new Gt(x,u),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=jo,this.render=function(S,b,I){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||S.length===0)return;const O=s.getRenderTarget(),v=s.getActiveCubeFace(),D=s.getActiveMipmapLevel(),R=s.state;R.setBlending(an),R.buffers.color.setClear(1,1,1,1),R.buffers.depth.setTest(!0),R.setScissorTest(!1);for(let K=0,q=S.length;K<q;K++){const L=S[K],C=L.shadow;if(C===void 0){console.warn("THREE.WebGLShadowMap:",L,"has no shadow.");continue}if(C.autoUpdate===!1&&C.needsUpdate===!1)continue;i.copy(C.mapSize);const W=C.getFrameExtents();if(i.multiply(W),r.copy(C.mapSize),(i.x>d||i.y>d)&&(i.x>d&&(r.x=Math.floor(d/W.x),i.x=r.x*W.x,C.mapSize.x=r.x),i.y>d&&(r.y=Math.floor(d/W.y),i.y=r.y*W.y,C.mapSize.y=r.y)),C.map===null){const $=this.type!==ci?{minFilter:_t,magFilter:_t}:{};C.map=new Tn(i.x,i.y,$),C.map.texture.name=L.name+".shadowMap",C.camera.updateProjectionMatrix()}s.setRenderTarget(C.map),s.clear();const Q=C.getViewportCount();for(let $=0;$<Q;$++){const Y=C.getViewport($);a.set(r.x*Y.x,r.y*Y.y,r.x*Y.z,r.y*Y.w),R.viewport(a),C.updateMatrices(L,$),n=C.getFrustum(),_(b,I,C.camera,L,this.type)}C.isPointLightShadow!==!0&&this.type===ci&&y(C,I),C.needsUpdate=!1}f.needsUpdate=!1,s.setRenderTarget(O,v,D)};function y(S,b){const I=e.update(p);u.defines.VSM_SAMPLES!==S.blurSamples&&(u.defines.VSM_SAMPLES=S.blurSamples,m.defines.VSM_SAMPLES=S.blurSamples,u.needsUpdate=!0,m.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Tn(i.x,i.y)),u.uniforms.shadow_pass.value=S.map.texture,u.uniforms.resolution.value=S.mapSize,u.uniforms.radius.value=S.radius,s.setRenderTarget(S.mapPass),s.clear(),s.renderBufferDirect(b,null,I,u,p,null),m.uniforms.shadow_pass.value=S.mapPass.texture,m.uniforms.resolution.value=S.mapSize,m.uniforms.radius.value=S.radius,s.setRenderTarget(S.map),s.clear(),s.renderBufferDirect(b,null,I,m,p,null)}function w(S,b,I,O,v,D){let R=null;const K=I.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(K!==void 0)R=K;else if(R=I.isPointLight===!0?c:o,s.localClippingEnabled&&b.clipShadows===!0&&Array.isArray(b.clippingPlanes)&&b.clippingPlanes.length!==0||b.displacementMap&&b.displacementScale!==0||b.alphaMap&&b.alphaTest>0||b.map&&b.alphaTest>0){const q=R.uuid,L=b.uuid;let C=l[q];C===void 0&&(C={},l[q]=C);let W=C[L];W===void 0&&(W=R.clone(),C[L]=W),R=W}return R.visible=b.visible,R.wireframe=b.wireframe,D===ci?R.side=b.shadowSide!==null?b.shadowSide:b.side:R.side=b.shadowSide!==null?b.shadowSide:h[b.side],R.alphaMap=b.alphaMap,R.alphaTest=b.alphaTest,R.map=b.map,R.clipShadows=b.clipShadows,R.clippingPlanes=b.clippingPlanes,R.clipIntersection=b.clipIntersection,R.displacementMap=b.displacementMap,R.displacementScale=b.displacementScale,R.displacementBias=b.displacementBias,R.wireframeLinewidth=b.wireframeLinewidth,R.linewidth=b.linewidth,I.isPointLight===!0&&R.isMeshDistanceMaterial===!0&&(R.referencePosition.setFromMatrixPosition(I.matrixWorld),R.nearDistance=O,R.farDistance=v),R}function _(S,b,I,O,v){if(S.visible===!1)return;if(S.layers.test(b.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&v===ci)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,S.matrixWorld);const K=e.update(S),q=S.material;if(Array.isArray(q)){const L=K.groups;for(let C=0,W=L.length;C<W;C++){const Q=L[C],$=q[Q.materialIndex];if($&&$.visible){const Y=w(S,$,O,I.near,I.far,v);s.renderBufferDirect(I,null,K,Y,S,Q)}}}else if(q.visible){const L=w(S,q,O,I.near,I.far,v);s.renderBufferDirect(I,null,K,L,S,null)}}const R=S.children;for(let K=0,q=R.length;K<q;K++)_(R[K],b,I,O,v)}}function Mp(s,e,t){const n=t.isWebGL2;function i(){let z=!1;const j=new ct;let Z=null;const fe=new ct(0,0,0,0);return{setMask:function(Me){Z!==Me&&!z&&(s.colorMask(Me,Me,Me,Me),Z=Me)},setLocked:function(Me){z=Me},setClear:function(Me,Re,We,nt,dt){dt===!0&&(Me*=nt,Re*=nt,We*=nt),j.set(Me,Re,We,nt),fe.equals(j)===!1&&(s.clearColor(Me,Re,We,nt),fe.copy(j))},reset:function(){z=!1,Z=null,fe.set(-1,0,0,0)}}}function r(){let z=!1,j=null,Z=null,fe=null;return{setTest:function(Me){Me?oe(2929):le(2929)},setMask:function(Me){j!==Me&&!z&&(s.depthMask(Me),j=Me)},setFunc:function(Me){if(Z!==Me){switch(Me){case Bl:s.depthFunc(512);break;case Gl:s.depthFunc(519);break;case Vl:s.depthFunc(513);break;case Ps:s.depthFunc(515);break;case Yl:s.depthFunc(514);break;case Hl:s.depthFunc(518);break;case Wl:s.depthFunc(516);break;case Ql:s.depthFunc(517);break;default:s.depthFunc(515)}Z=Me}},setLocked:function(Me){z=Me},setClear:function(Me){fe!==Me&&(s.clearDepth(Me),fe=Me)},reset:function(){z=!1,j=null,Z=null,fe=null}}}function a(){let z=!1,j=null,Z=null,fe=null,Me=null,Re=null,We=null,nt=null,dt=null;return{setTest:function(qe){z||(qe?oe(2960):le(2960))},setMask:function(qe){j!==qe&&!z&&(s.stencilMask(qe),j=qe)},setFunc:function(qe,it,jt){(Z!==qe||fe!==it||Me!==jt)&&(s.stencilFunc(qe,it,jt),Z=qe,fe=it,Me=jt)},setOp:function(qe,it,jt){(Re!==qe||We!==it||nt!==jt)&&(s.stencilOp(qe,it,jt),Re=qe,We=it,nt=jt)},setLocked:function(qe){z=qe},setClear:function(qe){dt!==qe&&(s.clearStencil(qe),dt=qe)},reset:function(){z=!1,j=null,Z=null,fe=null,Me=null,Re=null,We=null,nt=null,dt=null}}}const o=new i,c=new r,l=new a,d=new WeakMap,h=new WeakMap;let u={},m={},x=new WeakMap,p=[],f=null,y=!1,w=null,_=null,S=null,b=null,I=null,O=null,v=null,D=!1,R=null,K=null,q=null,L=null,C=null;const W=s.getParameter(35661);let Q=!1,$=0;const Y=s.getParameter(7938);Y.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(Y)[1]),Q=$>=1):Y.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),Q=$>=2);let ee=null,se={};const ce=s.getParameter(3088),V=s.getParameter(2978),re=new ct().fromArray(ce),de=new ct().fromArray(V);function U(z,j,Z){const fe=new Uint8Array(4),Me=s.createTexture();s.bindTexture(z,Me),s.texParameteri(z,10241,9728),s.texParameteri(z,10240,9728);for(let Re=0;Re<Z;Re++)s.texImage2D(j+Re,0,6408,1,1,0,6408,5121,fe);return Me}const ne={};ne[3553]=U(3553,3553,1),ne[34067]=U(34067,34069,6),o.setClear(0,0,0,1),c.setClear(1),l.setClear(0),oe(2929),c.setFunc(Ps),Ae(!1),Le(rr),oe(2884),Ie(an);function oe(z){u[z]!==!0&&(s.enable(z),u[z]=!0)}function le(z){u[z]!==!1&&(s.disable(z),u[z]=!1)}function ue(z,j){return m[z]!==j?(s.bindFramebuffer(z,j),m[z]=j,n&&(z===36009&&(m[36160]=j),z===36160&&(m[36009]=j)),!0):!1}function xe(z,j){let Z=p,fe=!1;if(z)if(Z=x.get(j),Z===void 0&&(Z=[],x.set(j,Z)),z.isWebGLMultipleRenderTargets){const Me=z.texture;if(Z.length!==Me.length||Z[0]!==36064){for(let Re=0,We=Me.length;Re<We;Re++)Z[Re]=36064+Re;Z.length=Me.length,fe=!0}}else Z[0]!==36064&&(Z[0]=36064,fe=!0);else Z[0]!==1029&&(Z[0]=1029,fe=!0);fe&&(t.isWebGL2?s.drawBuffers(Z):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(Z))}function _e(z){return f!==z?(s.useProgram(z),f=z,!0):!1}const ye={[Yn]:32774,[Nl]:32778,[Cl]:32779};if(n)ye[cr]=32775,ye[dr]=32776;else{const z=e.get("EXT_blend_minmax");z!==null&&(ye[cr]=z.MIN_EXT,ye[dr]=z.MAX_EXT)}const we={[Ll]:0,[zl]:1,[Ol]:768,[Fo]:770,[Fl]:776,[kl]:774,[Rl]:772,[Pl]:769,[Bo]:771,[jl]:775,[Ul]:773};function Ie(z,j,Z,fe,Me,Re,We,nt){if(z===an){y===!0&&(le(3042),y=!1);return}if(y===!1&&(oe(3042),y=!0),z!==Il){if(z!==w||nt!==D){if((_!==Yn||I!==Yn)&&(s.blendEquation(32774),_=Yn,I=Yn),nt)switch(z){case Wn:s.blendFuncSeparate(1,771,1,771);break;case or:s.blendFunc(1,1);break;case ar:s.blendFuncSeparate(0,769,0,1);break;case lr:s.blendFuncSeparate(0,768,0,770);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}else switch(z){case Wn:s.blendFuncSeparate(770,771,1,771);break;case or:s.blendFunc(770,1);break;case ar:s.blendFuncSeparate(0,769,0,1);break;case lr:s.blendFunc(0,768);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}S=null,b=null,O=null,v=null,w=z,D=nt}return}Me=Me||j,Re=Re||Z,We=We||fe,(j!==_||Me!==I)&&(s.blendEquationSeparate(ye[j],ye[Me]),_=j,I=Me),(Z!==S||fe!==b||Re!==O||We!==v)&&(s.blendFuncSeparate(we[Z],we[fe],we[Re],we[We]),S=Z,b=fe,O=Re,v=We),w=z,D=!1}function je(z,j){z.side===qt?le(2884):oe(2884);let Z=z.side===Dt;j&&(Z=!Z),Ae(Z),z.blending===Wn&&z.transparent===!1?Ie(an):Ie(z.blending,z.blendEquation,z.blendSrc,z.blendDst,z.blendEquationAlpha,z.blendSrcAlpha,z.blendDstAlpha,z.premultipliedAlpha),c.setFunc(z.depthFunc),c.setTest(z.depthTest),c.setMask(z.depthWrite),o.setMask(z.colorWrite);const fe=z.stencilWrite;l.setTest(fe),fe&&(l.setMask(z.stencilWriteMask),l.setFunc(z.stencilFunc,z.stencilRef,z.stencilFuncMask),l.setOp(z.stencilFail,z.stencilZFail,z.stencilZPass)),Te(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits),z.alphaToCoverage===!0?oe(32926):le(32926)}function Ae(z){R!==z&&(z?s.frontFace(2304):s.frontFace(2305),R=z)}function Le(z){z!==Tl?(oe(2884),z!==K&&(z===rr?s.cullFace(1029):z===Dl?s.cullFace(1028):s.cullFace(1032))):le(2884),K=z}function Se(z){z!==q&&(Q&&s.lineWidth(z),q=z)}function Te(z,j,Z){z?(oe(32823),(L!==j||C!==Z)&&(s.polygonOffset(j,Z),L=j,C=Z)):le(32823)}function Ke(z){z?oe(3089):le(3089)}function He(z){z===void 0&&(z=33984+W-1),ee!==z&&(s.activeTexture(z),ee=z)}function M(z,j,Z){Z===void 0&&(ee===null?Z=33984+W-1:Z=ee);let fe=se[Z];fe===void 0&&(fe={type:void 0,texture:void 0},se[Z]=fe),(fe.type!==z||fe.texture!==j)&&(ee!==Z&&(s.activeTexture(Z),ee=Z),s.bindTexture(z,j||ne[z]),fe.type=z,fe.texture=j)}function g(){const z=se[ee];z!==void 0&&z.type!==void 0&&(s.bindTexture(z.type,null),z.type=void 0,z.texture=void 0)}function E(){try{s.compressedTexImage2D.apply(s,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function P(){try{s.compressedTexImage3D.apply(s,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function k(){try{s.texSubImage2D.apply(s,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function H(){try{s.texSubImage3D.apply(s,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function X(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function A(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function N(){try{s.texStorage2D.apply(s,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function ie(){try{s.texStorage3D.apply(s,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function ae(){try{s.texImage2D.apply(s,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function he(){try{s.texImage3D.apply(s,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function ge(z){re.equals(z)===!1&&(s.scissor(z.x,z.y,z.z,z.w),re.copy(z))}function pe(z){de.equals(z)===!1&&(s.viewport(z.x,z.y,z.z,z.w),de.copy(z))}function ve(z,j){let Z=h.get(j);Z===void 0&&(Z=new WeakMap,h.set(j,Z));let fe=Z.get(z);fe===void 0&&(fe=s.getUniformBlockIndex(j,z.name),Z.set(z,fe))}function Ee(z,j){const fe=h.get(j).get(z);d.get(j)!==fe&&(s.uniformBlockBinding(j,fe,z.__bindingPointIndex),d.set(j,fe))}function ze(){s.disable(3042),s.disable(2884),s.disable(2929),s.disable(32823),s.disable(3089),s.disable(2960),s.disable(32926),s.blendEquation(32774),s.blendFunc(1,0),s.blendFuncSeparate(1,0,1,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(513),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(519,0,4294967295),s.stencilOp(7680,7680,7680),s.clearStencil(0),s.cullFace(1029),s.frontFace(2305),s.polygonOffset(0,0),s.activeTexture(33984),s.bindFramebuffer(36160,null),n===!0&&(s.bindFramebuffer(36009,null),s.bindFramebuffer(36008,null)),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),u={},ee=null,se={},m={},x=new WeakMap,p=[],f=null,y=!1,w=null,_=null,S=null,b=null,I=null,O=null,v=null,D=!1,R=null,K=null,q=null,L=null,C=null,re.set(0,0,s.canvas.width,s.canvas.height),de.set(0,0,s.canvas.width,s.canvas.height),o.reset(),c.reset(),l.reset()}return{buffers:{color:o,depth:c,stencil:l},enable:oe,disable:le,bindFramebuffer:ue,drawBuffers:xe,useProgram:_e,setBlending:Ie,setMaterial:je,setFlipSided:Ae,setCullFace:Le,setLineWidth:Se,setPolygonOffset:Te,setScissorTest:Ke,activeTexture:He,bindTexture:M,unbindTexture:g,compressedTexImage2D:E,compressedTexImage3D:P,texImage2D:ae,texImage3D:he,updateUBOMapping:ve,uniformBlockBinding:Ee,texStorage2D:N,texStorage3D:ie,texSubImage2D:k,texSubImage3D:H,compressedTexSubImage2D:X,compressedTexSubImage3D:A,scissor:ge,viewport:pe,reset:ze}}function xp(s,e,t,n,i,r,a){const o=i.isWebGL2,c=i.maxTextures,l=i.maxCubemapSize,d=i.maxTextureSize,h=i.maxSamples,u=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,m=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),x=new WeakMap;let p;const f=new WeakMap;let y=!1;try{y=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function w(M,g){return y?new OffscreenCanvas(M,g):Vi("canvas")}function _(M,g,E,P){let k=1;if((M.width>P||M.height>P)&&(k=P/Math.max(M.width,M.height)),k<1||g===!0)if(typeof HTMLImageElement<"u"&&M instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&M instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&M instanceof ImageBitmap){const H=g?wc:Math.floor,X=H(k*M.width),A=H(k*M.height);p===void 0&&(p=w(X,A));const N=E?w(X,A):p;return N.width=X,N.height=A,N.getContext("2d").drawImage(M,0,0,X,A),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+M.width+"x"+M.height+") to ("+X+"x"+A+")."),N}else return"data"in M&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+M.width+"x"+M.height+")."),M;return M}function S(M){return Ur(M.width)&&Ur(M.height)}function b(M){return o?!1:M.wrapS!==Rt||M.wrapT!==Rt||M.minFilter!==_t&&M.minFilter!==Nt}function I(M,g){return M.generateMipmaps&&g&&M.minFilter!==_t&&M.minFilter!==Nt}function O(M){s.generateMipmap(M)}function v(M,g,E,P,k=!1){if(o===!1)return g;if(M!==null){if(s[M]!==void 0)return s[M];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+M+"'")}let H=g;return g===6403&&(E===5126&&(H=33326),E===5131&&(H=33325),E===5121&&(H=33321)),g===33319&&(E===5126&&(H=33328),E===5131&&(H=33327),E===5121&&(H=33323)),g===6408&&(E===5126&&(H=34836),E===5131&&(H=34842),E===5121&&(H=P===Xe&&k===!1?35907:32856),E===32819&&(H=32854),E===32820&&(H=32855)),(H===33325||H===33326||H===33327||H===33328||H===34842||H===34836)&&e.get("EXT_color_buffer_float"),H}function D(M,g,E){return I(M,E)===!0||M.isFramebufferTexture&&M.minFilter!==_t&&M.minFilter!==Nt?Math.log2(Math.max(g.width,g.height))+1:M.mipmaps!==void 0&&M.mipmaps.length>0?M.mipmaps.length:M.isCompressedTexture&&Array.isArray(M.image)?g.mipmaps.length:1}function R(M){return M===_t||M===ur||M===$i?9728:9729}function K(M){const g=M.target;g.removeEventListener("dispose",K),L(g),g.isVideoTexture&&x.delete(g)}function q(M){const g=M.target;g.removeEventListener("dispose",q),W(g)}function L(M){const g=n.get(M);if(g.__webglInit===void 0)return;const E=M.source,P=f.get(E);if(P){const k=P[g.__cacheKey];k.usedTimes--,k.usedTimes===0&&C(M),Object.keys(P).length===0&&f.delete(E)}n.remove(M)}function C(M){const g=n.get(M);s.deleteTexture(g.__webglTexture);const E=M.source,P=f.get(E);delete P[g.__cacheKey],a.memory.textures--}function W(M){const g=M.texture,E=n.get(M),P=n.get(g);if(P.__webglTexture!==void 0&&(s.deleteTexture(P.__webglTexture),a.memory.textures--),M.depthTexture&&M.depthTexture.dispose(),M.isWebGLCubeRenderTarget)for(let k=0;k<6;k++)s.deleteFramebuffer(E.__webglFramebuffer[k]),E.__webglDepthbuffer&&s.deleteRenderbuffer(E.__webglDepthbuffer[k]);else{if(s.deleteFramebuffer(E.__webglFramebuffer),E.__webglDepthbuffer&&s.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&s.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let k=0;k<E.__webglColorRenderbuffer.length;k++)E.__webglColorRenderbuffer[k]&&s.deleteRenderbuffer(E.__webglColorRenderbuffer[k]);E.__webglDepthRenderbuffer&&s.deleteRenderbuffer(E.__webglDepthRenderbuffer)}if(M.isWebGLMultipleRenderTargets)for(let k=0,H=g.length;k<H;k++){const X=n.get(g[k]);X.__webglTexture&&(s.deleteTexture(X.__webglTexture),a.memory.textures--),n.remove(g[k])}n.remove(g),n.remove(M)}let Q=0;function $(){Q=0}function Y(){const M=Q;return M>=c&&console.warn("THREE.WebGLTextures: Trying to use "+M+" texture units while this GPU supports only "+c),Q+=1,M}function ee(M){const g=[];return g.push(M.wrapS),g.push(M.wrapT),g.push(M.wrapR||0),g.push(M.magFilter),g.push(M.minFilter),g.push(M.anisotropy),g.push(M.internalFormat),g.push(M.format),g.push(M.type),g.push(M.generateMipmaps),g.push(M.premultiplyAlpha),g.push(M.flipY),g.push(M.unpackAlignment),g.push(M.encoding),g.join()}function se(M,g){const E=n.get(M);if(M.isVideoTexture&&Ke(M),M.isRenderTargetTexture===!1&&M.version>0&&E.__version!==M.version){const P=M.image;if(P===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(P.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{le(E,M,g);return}}t.bindTexture(3553,E.__webglTexture,33984+g)}function ce(M,g){const E=n.get(M);if(M.version>0&&E.__version!==M.version){le(E,M,g);return}t.bindTexture(35866,E.__webglTexture,33984+g)}function V(M,g){const E=n.get(M);if(M.version>0&&E.__version!==M.version){le(E,M,g);return}t.bindTexture(32879,E.__webglTexture,33984+g)}function re(M,g){const E=n.get(M);if(M.version>0&&E.__version!==M.version){ue(E,M,g);return}t.bindTexture(34067,E.__webglTexture,33984+g)}const de={[ks]:10497,[Rt]:33071,[js]:33648},U={[_t]:9728,[ur]:9984,[$i]:9986,[Nt]:9729,[tc]:9985,[ui]:9987};function ne(M,g,E){if(E?(s.texParameteri(M,10242,de[g.wrapS]),s.texParameteri(M,10243,de[g.wrapT]),(M===32879||M===35866)&&s.texParameteri(M,32882,de[g.wrapR]),s.texParameteri(M,10240,U[g.magFilter]),s.texParameteri(M,10241,U[g.minFilter])):(s.texParameteri(M,10242,33071),s.texParameteri(M,10243,33071),(M===32879||M===35866)&&s.texParameteri(M,32882,33071),(g.wrapS!==Rt||g.wrapT!==Rt)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),s.texParameteri(M,10240,R(g.magFilter)),s.texParameteri(M,10241,R(g.minFilter)),g.minFilter!==_t&&g.minFilter!==Nt&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),e.has("EXT_texture_filter_anisotropic")===!0){const P=e.get("EXT_texture_filter_anisotropic");if(g.magFilter===_t||g.minFilter!==$i&&g.minFilter!==ui||g.type===vn&&e.has("OES_texture_float_linear")===!1||o===!1&&g.type===hi&&e.has("OES_texture_half_float_linear")===!1)return;(g.anisotropy>1||n.get(g).__currentAnisotropy)&&(s.texParameterf(M,P.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,i.getMaxAnisotropy())),n.get(g).__currentAnisotropy=g.anisotropy)}}function oe(M,g){let E=!1;M.__webglInit===void 0&&(M.__webglInit=!0,g.addEventListener("dispose",K));const P=g.source;let k=f.get(P);k===void 0&&(k={},f.set(P,k));const H=ee(g);if(H!==M.__cacheKey){k[H]===void 0&&(k[H]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,E=!0),k[H].usedTimes++;const X=k[M.__cacheKey];X!==void 0&&(k[M.__cacheKey].usedTimes--,X.usedTimes===0&&C(g)),M.__cacheKey=H,M.__webglTexture=k[H].texture}return E}function le(M,g,E){let P=3553;(g.isDataArrayTexture||g.isCompressedArrayTexture)&&(P=35866),g.isData3DTexture&&(P=32879);const k=oe(M,g),H=g.source;t.bindTexture(P,M.__webglTexture,33984+E);const X=n.get(H);if(H.version!==X.__version||k===!0){t.activeTexture(33984+E),s.pixelStorei(37440,g.flipY),s.pixelStorei(37441,g.premultiplyAlpha),s.pixelStorei(3317,g.unpackAlignment),s.pixelStorei(37443,0);const A=b(g)&&S(g.image)===!1;let N=_(g.image,A,!1,d);N=He(g,N);const ie=S(N)||o,ae=r.convert(g.format,g.encoding);let he=r.convert(g.type),ge=v(g.internalFormat,ae,he,g.encoding,g.isVideoTexture);ne(P,g,ie);let pe;const ve=g.mipmaps,Ee=o&&g.isVideoTexture!==!0,ze=X.__version===void 0||k===!0,z=D(g,N,ie);if(g.isDepthTexture)ge=6402,o?g.type===vn?ge=36012:g.type===yn?ge=33190:g.type===Qn?ge=35056:ge=33189:g.type===vn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),g.format===wn&&ge===6402&&g.type!==Yo&&g.type!==yn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),g.type=yn,he=r.convert(g.type)),g.format===qn&&ge===6402&&(ge=34041,g.type!==Qn&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),g.type=Qn,he=r.convert(g.type))),ze&&(Ee?t.texStorage2D(3553,1,ge,N.width,N.height):t.texImage2D(3553,0,ge,N.width,N.height,0,ae,he,null));else if(g.isDataTexture)if(ve.length>0&&ie){Ee&&ze&&t.texStorage2D(3553,z,ge,ve[0].width,ve[0].height);for(let j=0,Z=ve.length;j<Z;j++)pe=ve[j],Ee?t.texSubImage2D(3553,j,0,0,pe.width,pe.height,ae,he,pe.data):t.texImage2D(3553,j,ge,pe.width,pe.height,0,ae,he,pe.data);g.generateMipmaps=!1}else Ee?(ze&&t.texStorage2D(3553,z,ge,N.width,N.height),t.texSubImage2D(3553,0,0,0,N.width,N.height,ae,he,N.data)):t.texImage2D(3553,0,ge,N.width,N.height,0,ae,he,N.data);else if(g.isCompressedTexture)if(g.isCompressedArrayTexture){Ee&&ze&&t.texStorage3D(35866,z,ge,ve[0].width,ve[0].height,N.depth);for(let j=0,Z=ve.length;j<Z;j++)pe=ve[j],g.format!==Ut?ae!==null?Ee?t.compressedTexSubImage3D(35866,j,0,0,0,pe.width,pe.height,N.depth,ae,pe.data,0,0):t.compressedTexImage3D(35866,j,ge,pe.width,pe.height,N.depth,0,pe.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ee?t.texSubImage3D(35866,j,0,0,0,pe.width,pe.height,N.depth,ae,he,pe.data):t.texImage3D(35866,j,ge,pe.width,pe.height,N.depth,0,ae,he,pe.data)}else{Ee&&ze&&t.texStorage2D(3553,z,ge,ve[0].width,ve[0].height);for(let j=0,Z=ve.length;j<Z;j++)pe=ve[j],g.format!==Ut?ae!==null?Ee?t.compressedTexSubImage2D(3553,j,0,0,pe.width,pe.height,ae,pe.data):t.compressedTexImage2D(3553,j,ge,pe.width,pe.height,0,pe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ee?t.texSubImage2D(3553,j,0,0,pe.width,pe.height,ae,he,pe.data):t.texImage2D(3553,j,ge,pe.width,pe.height,0,ae,he,pe.data)}else if(g.isDataArrayTexture)Ee?(ze&&t.texStorage3D(35866,z,ge,N.width,N.height,N.depth),t.texSubImage3D(35866,0,0,0,0,N.width,N.height,N.depth,ae,he,N.data)):t.texImage3D(35866,0,ge,N.width,N.height,N.depth,0,ae,he,N.data);else if(g.isData3DTexture)Ee?(ze&&t.texStorage3D(32879,z,ge,N.width,N.height,N.depth),t.texSubImage3D(32879,0,0,0,0,N.width,N.height,N.depth,ae,he,N.data)):t.texImage3D(32879,0,ge,N.width,N.height,N.depth,0,ae,he,N.data);else if(g.isFramebufferTexture){if(ze)if(Ee)t.texStorage2D(3553,z,ge,N.width,N.height);else{let j=N.width,Z=N.height;for(let fe=0;fe<z;fe++)t.texImage2D(3553,fe,ge,j,Z,0,ae,he,null),j>>=1,Z>>=1}}else if(ve.length>0&&ie){Ee&&ze&&t.texStorage2D(3553,z,ge,ve[0].width,ve[0].height);for(let j=0,Z=ve.length;j<Z;j++)pe=ve[j],Ee?t.texSubImage2D(3553,j,0,0,ae,he,pe):t.texImage2D(3553,j,ge,ae,he,pe);g.generateMipmaps=!1}else Ee?(ze&&t.texStorage2D(3553,z,ge,N.width,N.height),t.texSubImage2D(3553,0,0,0,ae,he,N)):t.texImage2D(3553,0,ge,ae,he,N);I(g,ie)&&O(P),X.__version=H.version,g.onUpdate&&g.onUpdate(g)}M.__version=g.version}function ue(M,g,E){if(g.image.length!==6)return;const P=oe(M,g),k=g.source;t.bindTexture(34067,M.__webglTexture,33984+E);const H=n.get(k);if(k.version!==H.__version||P===!0){t.activeTexture(33984+E),s.pixelStorei(37440,g.flipY),s.pixelStorei(37441,g.premultiplyAlpha),s.pixelStorei(3317,g.unpackAlignment),s.pixelStorei(37443,0);const X=g.isCompressedTexture||g.image[0].isCompressedTexture,A=g.image[0]&&g.image[0].isDataTexture,N=[];for(let j=0;j<6;j++)!X&&!A?N[j]=_(g.image[j],!1,!0,l):N[j]=A?g.image[j].image:g.image[j],N[j]=He(g,N[j]);const ie=N[0],ae=S(ie)||o,he=r.convert(g.format,g.encoding),ge=r.convert(g.type),pe=v(g.internalFormat,he,ge,g.encoding),ve=o&&g.isVideoTexture!==!0,Ee=H.__version===void 0||P===!0;let ze=D(g,ie,ae);ne(34067,g,ae);let z;if(X){ve&&Ee&&t.texStorage2D(34067,ze,pe,ie.width,ie.height);for(let j=0;j<6;j++){z=N[j].mipmaps;for(let Z=0;Z<z.length;Z++){const fe=z[Z];g.format!==Ut?he!==null?ve?t.compressedTexSubImage2D(34069+j,Z,0,0,fe.width,fe.height,he,fe.data):t.compressedTexImage2D(34069+j,Z,pe,fe.width,fe.height,0,fe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ve?t.texSubImage2D(34069+j,Z,0,0,fe.width,fe.height,he,ge,fe.data):t.texImage2D(34069+j,Z,pe,fe.width,fe.height,0,he,ge,fe.data)}}}else{z=g.mipmaps,ve&&Ee&&(z.length>0&&ze++,t.texStorage2D(34067,ze,pe,N[0].width,N[0].height));for(let j=0;j<6;j++)if(A){ve?t.texSubImage2D(34069+j,0,0,0,N[j].width,N[j].height,he,ge,N[j].data):t.texImage2D(34069+j,0,pe,N[j].width,N[j].height,0,he,ge,N[j].data);for(let Z=0;Z<z.length;Z++){const Me=z[Z].image[j].image;ve?t.texSubImage2D(34069+j,Z+1,0,0,Me.width,Me.height,he,ge,Me.data):t.texImage2D(34069+j,Z+1,pe,Me.width,Me.height,0,he,ge,Me.data)}}else{ve?t.texSubImage2D(34069+j,0,0,0,he,ge,N[j]):t.texImage2D(34069+j,0,pe,he,ge,N[j]);for(let Z=0;Z<z.length;Z++){const fe=z[Z];ve?t.texSubImage2D(34069+j,Z+1,0,0,he,ge,fe.image[j]):t.texImage2D(34069+j,Z+1,pe,he,ge,fe.image[j])}}}I(g,ae)&&O(34067),H.__version=k.version,g.onUpdate&&g.onUpdate(g)}M.__version=g.version}function xe(M,g,E,P,k){const H=r.convert(E.format,E.encoding),X=r.convert(E.type),A=v(E.internalFormat,H,X,E.encoding);n.get(g).__hasExternalTextures||(k===32879||k===35866?t.texImage3D(k,0,A,g.width,g.height,g.depth,0,H,X,null):t.texImage2D(k,0,A,g.width,g.height,0,H,X,null)),t.bindFramebuffer(36160,M),Te(g)?u.framebufferTexture2DMultisampleEXT(36160,P,k,n.get(E).__webglTexture,0,Se(g)):(k===3553||k>=34069&&k<=34074)&&s.framebufferTexture2D(36160,P,k,n.get(E).__webglTexture,0),t.bindFramebuffer(36160,null)}function _e(M,g,E){if(s.bindRenderbuffer(36161,M),g.depthBuffer&&!g.stencilBuffer){let P=33189;if(E||Te(g)){const k=g.depthTexture;k&&k.isDepthTexture&&(k.type===vn?P=36012:k.type===yn&&(P=33190));const H=Se(g);Te(g)?u.renderbufferStorageMultisampleEXT(36161,H,P,g.width,g.height):s.renderbufferStorageMultisample(36161,H,P,g.width,g.height)}else s.renderbufferStorage(36161,P,g.width,g.height);s.framebufferRenderbuffer(36160,36096,36161,M)}else if(g.depthBuffer&&g.stencilBuffer){const P=Se(g);E&&Te(g)===!1?s.renderbufferStorageMultisample(36161,P,35056,g.width,g.height):Te(g)?u.renderbufferStorageMultisampleEXT(36161,P,35056,g.width,g.height):s.renderbufferStorage(36161,34041,g.width,g.height),s.framebufferRenderbuffer(36160,33306,36161,M)}else{const P=g.isWebGLMultipleRenderTargets===!0?g.texture:[g.texture];for(let k=0;k<P.length;k++){const H=P[k],X=r.convert(H.format,H.encoding),A=r.convert(H.type),N=v(H.internalFormat,X,A,H.encoding),ie=Se(g);E&&Te(g)===!1?s.renderbufferStorageMultisample(36161,ie,N,g.width,g.height):Te(g)?u.renderbufferStorageMultisampleEXT(36161,ie,N,g.width,g.height):s.renderbufferStorage(36161,N,g.width,g.height)}}s.bindRenderbuffer(36161,null)}function ye(M,g){if(g&&g.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(36160,M),!(g.depthTexture&&g.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(g.depthTexture).__webglTexture||g.depthTexture.image.width!==g.width||g.depthTexture.image.height!==g.height)&&(g.depthTexture.image.width=g.width,g.depthTexture.image.height=g.height,g.depthTexture.needsUpdate=!0),se(g.depthTexture,0);const P=n.get(g.depthTexture).__webglTexture,k=Se(g);if(g.depthTexture.format===wn)Te(g)?u.framebufferTexture2DMultisampleEXT(36160,36096,3553,P,0,k):s.framebufferTexture2D(36160,36096,3553,P,0);else if(g.depthTexture.format===qn)Te(g)?u.framebufferTexture2DMultisampleEXT(36160,33306,3553,P,0,k):s.framebufferTexture2D(36160,33306,3553,P,0);else throw new Error("Unknown depthTexture format")}function we(M){const g=n.get(M),E=M.isWebGLCubeRenderTarget===!0;if(M.depthTexture&&!g.__autoAllocateDepthBuffer){if(E)throw new Error("target.depthTexture not supported in Cube render targets");ye(g.__webglFramebuffer,M)}else if(E){g.__webglDepthbuffer=[];for(let P=0;P<6;P++)t.bindFramebuffer(36160,g.__webglFramebuffer[P]),g.__webglDepthbuffer[P]=s.createRenderbuffer(),_e(g.__webglDepthbuffer[P],M,!1)}else t.bindFramebuffer(36160,g.__webglFramebuffer),g.__webglDepthbuffer=s.createRenderbuffer(),_e(g.__webglDepthbuffer,M,!1);t.bindFramebuffer(36160,null)}function Ie(M,g,E){const P=n.get(M);g!==void 0&&xe(P.__webglFramebuffer,M,M.texture,36064,3553),E!==void 0&&we(M)}function je(M){const g=M.texture,E=n.get(M),P=n.get(g);M.addEventListener("dispose",q),M.isWebGLMultipleRenderTargets!==!0&&(P.__webglTexture===void 0&&(P.__webglTexture=s.createTexture()),P.__version=g.version,a.memory.textures++);const k=M.isWebGLCubeRenderTarget===!0,H=M.isWebGLMultipleRenderTargets===!0,X=S(M)||o;if(k){E.__webglFramebuffer=[];for(let A=0;A<6;A++)E.__webglFramebuffer[A]=s.createFramebuffer()}else{if(E.__webglFramebuffer=s.createFramebuffer(),H)if(i.drawBuffers){const A=M.texture;for(let N=0,ie=A.length;N<ie;N++){const ae=n.get(A[N]);ae.__webglTexture===void 0&&(ae.__webglTexture=s.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&M.samples>0&&Te(M)===!1){const A=H?g:[g];E.__webglMultisampledFramebuffer=s.createFramebuffer(),E.__webglColorRenderbuffer=[],t.bindFramebuffer(36160,E.__webglMultisampledFramebuffer);for(let N=0;N<A.length;N++){const ie=A[N];E.__webglColorRenderbuffer[N]=s.createRenderbuffer(),s.bindRenderbuffer(36161,E.__webglColorRenderbuffer[N]);const ae=r.convert(ie.format,ie.encoding),he=r.convert(ie.type),ge=v(ie.internalFormat,ae,he,ie.encoding,M.isXRRenderTarget===!0),pe=Se(M);s.renderbufferStorageMultisample(36161,pe,ge,M.width,M.height),s.framebufferRenderbuffer(36160,36064+N,36161,E.__webglColorRenderbuffer[N])}s.bindRenderbuffer(36161,null),M.depthBuffer&&(E.__webglDepthRenderbuffer=s.createRenderbuffer(),_e(E.__webglDepthRenderbuffer,M,!0)),t.bindFramebuffer(36160,null)}}if(k){t.bindTexture(34067,P.__webglTexture),ne(34067,g,X);for(let A=0;A<6;A++)xe(E.__webglFramebuffer[A],M,g,36064,34069+A);I(g,X)&&O(34067),t.unbindTexture()}else if(H){const A=M.texture;for(let N=0,ie=A.length;N<ie;N++){const ae=A[N],he=n.get(ae);t.bindTexture(3553,he.__webglTexture),ne(3553,ae,X),xe(E.__webglFramebuffer,M,ae,36064+N,3553),I(ae,X)&&O(3553)}t.unbindTexture()}else{let A=3553;(M.isWebGL3DRenderTarget||M.isWebGLArrayRenderTarget)&&(o?A=M.isWebGL3DRenderTarget?32879:35866:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(A,P.__webglTexture),ne(A,g,X),xe(E.__webglFramebuffer,M,g,36064,A),I(g,X)&&O(A),t.unbindTexture()}M.depthBuffer&&we(M)}function Ae(M){const g=S(M)||o,E=M.isWebGLMultipleRenderTargets===!0?M.texture:[M.texture];for(let P=0,k=E.length;P<k;P++){const H=E[P];if(I(H,g)){const X=M.isWebGLCubeRenderTarget?34067:3553,A=n.get(H).__webglTexture;t.bindTexture(X,A),O(X),t.unbindTexture()}}}function Le(M){if(o&&M.samples>0&&Te(M)===!1){const g=M.isWebGLMultipleRenderTargets?M.texture:[M.texture],E=M.width,P=M.height;let k=16384;const H=[],X=M.stencilBuffer?33306:36096,A=n.get(M),N=M.isWebGLMultipleRenderTargets===!0;if(N)for(let ie=0;ie<g.length;ie++)t.bindFramebuffer(36160,A.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(36160,36064+ie,36161,null),t.bindFramebuffer(36160,A.__webglFramebuffer),s.framebufferTexture2D(36009,36064+ie,3553,null,0);t.bindFramebuffer(36008,A.__webglMultisampledFramebuffer),t.bindFramebuffer(36009,A.__webglFramebuffer);for(let ie=0;ie<g.length;ie++){H.push(36064+ie),M.depthBuffer&&H.push(X);const ae=A.__ignoreDepthValues!==void 0?A.__ignoreDepthValues:!1;if(ae===!1&&(M.depthBuffer&&(k|=256),M.stencilBuffer&&(k|=1024)),N&&s.framebufferRenderbuffer(36008,36064,36161,A.__webglColorRenderbuffer[ie]),ae===!0&&(s.invalidateFramebuffer(36008,[X]),s.invalidateFramebuffer(36009,[X])),N){const he=n.get(g[ie]).__webglTexture;s.framebufferTexture2D(36009,36064,3553,he,0)}s.blitFramebuffer(0,0,E,P,0,0,E,P,k,9728),m&&s.invalidateFramebuffer(36008,H)}if(t.bindFramebuffer(36008,null),t.bindFramebuffer(36009,null),N)for(let ie=0;ie<g.length;ie++){t.bindFramebuffer(36160,A.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(36160,36064+ie,36161,A.__webglColorRenderbuffer[ie]);const ae=n.get(g[ie]).__webglTexture;t.bindFramebuffer(36160,A.__webglFramebuffer),s.framebufferTexture2D(36009,36064+ie,3553,ae,0)}t.bindFramebuffer(36009,A.__webglMultisampledFramebuffer)}}function Se(M){return Math.min(h,M.samples)}function Te(M){const g=n.get(M);return o&&M.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&g.__useRenderToTexture!==!1}function Ke(M){const g=a.render.frame;x.get(M)!==g&&(x.set(M,g),M.update())}function He(M,g){const E=M.encoding,P=M.format,k=M.type;return M.isCompressedTexture===!0||M.isVideoTexture===!0||M.format===Bs||E!==bn&&(E===Xe?o===!1?e.has("EXT_sRGB")===!0&&P===Ut?(M.format=Bs,M.minFilter=Nt,M.generateMipmaps=!1):g=Ko.sRGBToLinear(g):(P!==Ut||k!==An)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture encoding:",E)),g}this.allocateTextureUnit=Y,this.resetTextureUnits=$,this.setTexture2D=se,this.setTexture2DArray=ce,this.setTexture3D=V,this.setTextureCube=re,this.rebindTextures=Ie,this.setupRenderTarget=je,this.updateRenderTargetMipmap=Ae,this.updateMultisampleRenderTarget=Le,this.setupDepthRenderbuffer=we,this.setupFrameBufferTexture=xe,this.useMultisampledRTT=Te}function _p(s,e,t){const n=t.isWebGL2;function i(r,a=null){let o;if(r===An)return 5121;if(r===rc)return 32819;if(r===oc)return 32820;if(r===nc)return 5120;if(r===ic)return 5122;if(r===Yo)return 5123;if(r===sc)return 5124;if(r===yn)return 5125;if(r===vn)return 5126;if(r===hi)return n?5131:(o=e.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(r===ac)return 6406;if(r===Ut)return 6408;if(r===lc)return 6409;if(r===cc)return 6410;if(r===wn)return 6402;if(r===qn)return 34041;if(r===Bs)return o=e.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(r===dc)return 6403;if(r===uc)return 36244;if(r===hc)return 33319;if(r===fc)return 33320;if(r===pc)return 36249;if(r===Ji||r===es||r===ts||r===ns)if(a===Xe)if(o=e.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(r===Ji)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===es)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===ts)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===ns)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=e.get("WEBGL_compressed_texture_s3tc"),o!==null){if(r===Ji)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===es)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===ts)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===ns)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===hr||r===fr||r===pr||r===mr)if(o=e.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(r===hr)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===fr)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===pr)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===mr)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===mc)return o=e.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===gr||r===Mr)if(o=e.get("WEBGL_compressed_texture_etc"),o!==null){if(r===gr)return a===Xe?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(r===Mr)return a===Xe?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===xr||r===_r||r===yr||r===vr||r===wr||r===Ar||r===br||r===Sr||r===Tr||r===Dr||r===Er||r===Ir||r===Nr||r===Cr)if(o=e.get("WEBGL_compressed_texture_astc"),o!==null){if(r===xr)return a===Xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===_r)return a===Xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===yr)return a===Xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===vr)return a===Xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===wr)return a===Xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Ar)return a===Xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===br)return a===Xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Sr)return a===Xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Tr)return a===Xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Dr)return a===Xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Er)return a===Xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Ir)return a===Xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Nr)return a===Xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Cr)return a===Xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===is)if(o=e.get("EXT_texture_compression_bptc"),o!==null){if(r===is)return a===Xe?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT}else return null;if(r===gc||r===Lr||r===zr||r===Or)if(o=e.get("EXT_texture_compression_rgtc"),o!==null){if(r===is)return o.COMPRESSED_RED_RGTC1_EXT;if(r===Lr)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===zr)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Or)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Qn?n?34042:(o=e.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):s[r]!==void 0?s[r]:null}return{convert:i}}class yp extends Ct{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Ri extends ut{constructor(){super(),this.isGroup=!0,this.type="Group"}}const vp={type:"move"};class Is{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ri,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ri,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new F,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new F),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ri,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new F,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new F),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const p of e.hand.values()){const f=t.getJointPose(p,n),y=this._getHandJoint(l,p);f!==null&&(y.matrix.fromArray(f.transform.matrix),y.matrix.decompose(y.position,y.rotation,y.scale),y.jointRadius=f.radius),y.visible=f!==null}const d=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],u=d.position.distanceTo(h.position),m=.02,x=.005;l.inputState.pinching&&u>m+x?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&u<=m-x&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(vp)))}return o!==null&&(o.visible=i!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Ri;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class wp extends Et{constructor(e,t,n,i,r,a,o,c,l,d){if(d=d!==void 0?d:wn,d!==wn&&d!==qn)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&d===wn&&(n=yn),n===void 0&&d===qn&&(n=Qn),super(null,i,r,a,o,c,d,n,l),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:_t,this.minFilter=c!==void 0?c:_t,this.flipY=!1,this.generateMipmaps=!1}}class Ap extends Dn{constructor(e,t){super();const n=this;let i=null,r=1,a=null,o="local-floor",c=1,l=null,d=null,h=null,u=null,m=null,x=null;const p=t.getContextAttributes();let f=null,y=null;const w=[],_=[],S=new Set,b=new Map,I=new Ct;I.layers.enable(1),I.viewport=new ct;const O=new Ct;O.layers.enable(2),O.viewport=new ct;const v=[I,O],D=new yp;D.layers.enable(1),D.layers.enable(2);let R=null,K=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let re=w[V];return re===void 0&&(re=new Is,w[V]=re),re.getTargetRaySpace()},this.getControllerGrip=function(V){let re=w[V];return re===void 0&&(re=new Is,w[V]=re),re.getGripSpace()},this.getHand=function(V){let re=w[V];return re===void 0&&(re=new Is,w[V]=re),re.getHandSpace()};function q(V){const re=_.indexOf(V.inputSource);if(re===-1)return;const de=w[re];de!==void 0&&de.dispatchEvent({type:V.type,data:V.inputSource})}function L(){i.removeEventListener("select",q),i.removeEventListener("selectstart",q),i.removeEventListener("selectend",q),i.removeEventListener("squeeze",q),i.removeEventListener("squeezestart",q),i.removeEventListener("squeezeend",q),i.removeEventListener("end",L),i.removeEventListener("inputsourceschange",C);for(let V=0;V<w.length;V++){const re=_[V];re!==null&&(_[V]=null,w[V].disconnect(re))}R=null,K=null,e.setRenderTarget(f),m=null,u=null,h=null,i=null,y=null,ce.stop(),n.isPresenting=!1,n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){r=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){o=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(V){l=V},this.getBaseLayer=function(){return u!==null?u:m},this.getBinding=function(){return h},this.getFrame=function(){return x},this.getSession=function(){return i},this.setSession=async function(V){if(i=V,i!==null){if(f=e.getRenderTarget(),i.addEventListener("select",q),i.addEventListener("selectstart",q),i.addEventListener("selectend",q),i.addEventListener("squeeze",q),i.addEventListener("squeezestart",q),i.addEventListener("squeezeend",q),i.addEventListener("end",L),i.addEventListener("inputsourceschange",C),p.xrCompatible!==!0&&await t.makeXRCompatible(),i.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const re={antialias:i.renderState.layers===void 0?p.antialias:!0,alpha:p.alpha,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(i,t,re),i.updateRenderState({baseLayer:m}),y=new Tn(m.framebufferWidth,m.framebufferHeight,{format:Ut,type:An,encoding:e.outputEncoding,stencilBuffer:p.stencil})}else{let re=null,de=null,U=null;p.depth&&(U=p.stencil?35056:33190,re=p.stencil?qn:wn,de=p.stencil?Qn:yn);const ne={colorFormat:32856,depthFormat:U,scaleFactor:r};h=new XRWebGLBinding(i,t),u=h.createProjectionLayer(ne),i.updateRenderState({layers:[u]}),y=new Tn(u.textureWidth,u.textureHeight,{format:Ut,type:An,depthTexture:new wp(u.textureWidth,u.textureHeight,de,void 0,void 0,void 0,void 0,void 0,void 0,re),stencilBuffer:p.stencil,encoding:e.outputEncoding,samples:p.antialias?4:0});const oe=e.properties.get(y);oe.__ignoreDepthValues=u.ignoreDepthValues}y.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await i.requestReferenceSpace(o),ce.setContext(i),ce.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}};function C(V){for(let re=0;re<V.removed.length;re++){const de=V.removed[re],U=_.indexOf(de);U>=0&&(_[U]=null,w[U].disconnect(de))}for(let re=0;re<V.added.length;re++){const de=V.added[re];let U=_.indexOf(de);if(U===-1){for(let oe=0;oe<w.length;oe++)if(oe>=_.length){_.push(de),U=oe;break}else if(_[oe]===null){_[oe]=de,U=oe;break}if(U===-1)break}const ne=w[U];ne&&ne.connect(de)}}const W=new F,Q=new F;function $(V,re,de){W.setFromMatrixPosition(re.matrixWorld),Q.setFromMatrixPosition(de.matrixWorld);const U=W.distanceTo(Q),ne=re.projectionMatrix.elements,oe=de.projectionMatrix.elements,le=ne[14]/(ne[10]-1),ue=ne[14]/(ne[10]+1),xe=(ne[9]+1)/ne[5],_e=(ne[9]-1)/ne[5],ye=(ne[8]-1)/ne[0],we=(oe[8]+1)/oe[0],Ie=le*ye,je=le*we,Ae=U/(-ye+we),Le=Ae*-ye;re.matrixWorld.decompose(V.position,V.quaternion,V.scale),V.translateX(Le),V.translateZ(Ae),V.matrixWorld.compose(V.position,V.quaternion,V.scale),V.matrixWorldInverse.copy(V.matrixWorld).invert();const Se=le+Ae,Te=ue+Ae,Ke=Ie-Le,He=je+(U-Le),M=xe*ue/Te*Se,g=_e*ue/Te*Se;V.projectionMatrix.makePerspective(Ke,He,M,g,Se,Te)}function Y(V,re){re===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices(re.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(i===null)return;D.near=O.near=I.near=V.near,D.far=O.far=I.far=V.far,(R!==D.near||K!==D.far)&&(i.updateRenderState({depthNear:D.near,depthFar:D.far}),R=D.near,K=D.far);const re=V.parent,de=D.cameras;Y(D,re);for(let ne=0;ne<de.length;ne++)Y(de[ne],re);D.matrixWorld.decompose(D.position,D.quaternion,D.scale),V.matrix.copy(D.matrix),V.matrix.decompose(V.position,V.quaternion,V.scale);const U=V.children;for(let ne=0,oe=U.length;ne<oe;ne++)U[ne].updateMatrixWorld(!0);de.length===2?$(D,I,O):D.projectionMatrix.copy(I.projectionMatrix)},this.getCamera=function(){return D},this.getFoveation=function(){if(!(u===null&&m===null))return c},this.setFoveation=function(V){c=V,u!==null&&(u.fixedFoveation=V),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=V)},this.getPlanes=function(){return S};let ee=null;function se(V,re){if(d=re.getViewerPose(l||a),x=re,d!==null){const de=d.views;m!==null&&(e.setRenderTargetFramebuffer(y,m.framebuffer),e.setRenderTarget(y));let U=!1;de.length!==D.cameras.length&&(D.cameras.length=0,U=!0);for(let ne=0;ne<de.length;ne++){const oe=de[ne];let le=null;if(m!==null)le=m.getViewport(oe);else{const xe=h.getViewSubImage(u,oe);le=xe.viewport,ne===0&&(e.setRenderTargetTextures(y,xe.colorTexture,u.ignoreDepthValues?void 0:xe.depthStencilTexture),e.setRenderTarget(y))}let ue=v[ne];ue===void 0&&(ue=new Ct,ue.layers.enable(ne),ue.viewport=new ct,v[ne]=ue),ue.matrix.fromArray(oe.transform.matrix),ue.projectionMatrix.fromArray(oe.projectionMatrix),ue.viewport.set(le.x,le.y,le.width,le.height),ne===0&&D.matrix.copy(ue.matrix),U===!0&&D.cameras.push(ue)}}for(let de=0;de<w.length;de++){const U=_[de],ne=w[de];U!==null&&ne!==void 0&&ne.update(U,re,l||a)}if(ee&&ee(V,re),re.detectedPlanes){n.dispatchEvent({type:"planesdetected",data:re.detectedPlanes});let de=null;for(const U of S)re.detectedPlanes.has(U)||(de===null&&(de=[]),de.push(U));if(de!==null)for(const U of de)S.delete(U),b.delete(U),n.dispatchEvent({type:"planeremoved",data:U});for(const U of re.detectedPlanes)if(!S.has(U))S.add(U),b.set(U,re.lastChangedTime),n.dispatchEvent({type:"planeadded",data:U});else{const ne=b.get(U);U.lastChangedTime>ne&&(b.set(U,U.lastChangedTime),n.dispatchEvent({type:"planechanged",data:U}))}}x=null}const ce=new oa;ce.setAnimationLoop(se),this.setAnimationLoop=function(V){ee=V},this.dispose=function(){}}}function bp(s,e){function t(p,f){f.color.getRGB(p.fogColor.value,ia(s)),f.isFog?(p.fogNear.value=f.near,p.fogFar.value=f.far):f.isFogExp2&&(p.fogDensity.value=f.density)}function n(p,f,y,w,_){f.isMeshBasicMaterial||f.isMeshLambertMaterial?i(p,f):f.isMeshToonMaterial?(i(p,f),d(p,f)):f.isMeshPhongMaterial?(i(p,f),l(p,f)):f.isMeshStandardMaterial?(i(p,f),h(p,f),f.isMeshPhysicalMaterial&&u(p,f,_)):f.isMeshMatcapMaterial?(i(p,f),m(p,f)):f.isMeshDepthMaterial?i(p,f):f.isMeshDistanceMaterial?(i(p,f),x(p,f)):f.isMeshNormalMaterial?i(p,f):f.isLineBasicMaterial?(r(p,f),f.isLineDashedMaterial&&a(p,f)):f.isPointsMaterial?o(p,f,y,w):f.isSpriteMaterial?c(p,f):f.isShadowMaterial?(p.color.value.copy(f.color),p.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function i(p,f){p.opacity.value=f.opacity,f.color&&p.diffuse.value.copy(f.color),f.emissive&&p.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(p.map.value=f.map),f.alphaMap&&(p.alphaMap.value=f.alphaMap),f.bumpMap&&(p.bumpMap.value=f.bumpMap,p.bumpScale.value=f.bumpScale,f.side===Dt&&(p.bumpScale.value*=-1)),f.displacementMap&&(p.displacementMap.value=f.displacementMap,p.displacementScale.value=f.displacementScale,p.displacementBias.value=f.displacementBias),f.emissiveMap&&(p.emissiveMap.value=f.emissiveMap),f.normalMap&&(p.normalMap.value=f.normalMap,p.normalScale.value.copy(f.normalScale),f.side===Dt&&p.normalScale.value.negate()),f.specularMap&&(p.specularMap.value=f.specularMap),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest);const y=e.get(f).envMap;if(y&&(p.envMap.value=y,p.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=f.reflectivity,p.ior.value=f.ior,p.refractionRatio.value=f.refractionRatio),f.lightMap){p.lightMap.value=f.lightMap;const S=s.useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=f.lightMapIntensity*S}f.aoMap&&(p.aoMap.value=f.aoMap,p.aoMapIntensity.value=f.aoMapIntensity);let w;f.map?w=f.map:f.specularMap?w=f.specularMap:f.displacementMap?w=f.displacementMap:f.normalMap?w=f.normalMap:f.bumpMap?w=f.bumpMap:f.roughnessMap?w=f.roughnessMap:f.metalnessMap?w=f.metalnessMap:f.alphaMap?w=f.alphaMap:f.emissiveMap?w=f.emissiveMap:f.clearcoatMap?w=f.clearcoatMap:f.clearcoatNormalMap?w=f.clearcoatNormalMap:f.clearcoatRoughnessMap?w=f.clearcoatRoughnessMap:f.iridescenceMap?w=f.iridescenceMap:f.iridescenceThicknessMap?w=f.iridescenceThicknessMap:f.specularIntensityMap?w=f.specularIntensityMap:f.specularColorMap?w=f.specularColorMap:f.transmissionMap?w=f.transmissionMap:f.thicknessMap?w=f.thicknessMap:f.sheenColorMap?w=f.sheenColorMap:f.sheenRoughnessMap&&(w=f.sheenRoughnessMap),w!==void 0&&(w.isWebGLRenderTarget&&(w=w.texture),w.matrixAutoUpdate===!0&&w.updateMatrix(),p.uvTransform.value.copy(w.matrix));let _;f.aoMap?_=f.aoMap:f.lightMap&&(_=f.lightMap),_!==void 0&&(_.isWebGLRenderTarget&&(_=_.texture),_.matrixAutoUpdate===!0&&_.updateMatrix(),p.uv2Transform.value.copy(_.matrix))}function r(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity}function a(p,f){p.dashSize.value=f.dashSize,p.totalSize.value=f.dashSize+f.gapSize,p.scale.value=f.scale}function o(p,f,y,w){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.size.value=f.size*y,p.scale.value=w*.5,f.map&&(p.map.value=f.map),f.alphaMap&&(p.alphaMap.value=f.alphaMap),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest);let _;f.map?_=f.map:f.alphaMap&&(_=f.alphaMap),_!==void 0&&(_.matrixAutoUpdate===!0&&_.updateMatrix(),p.uvTransform.value.copy(_.matrix))}function c(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.rotation.value=f.rotation,f.map&&(p.map.value=f.map),f.alphaMap&&(p.alphaMap.value=f.alphaMap),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest);let y;f.map?y=f.map:f.alphaMap&&(y=f.alphaMap),y!==void 0&&(y.matrixAutoUpdate===!0&&y.updateMatrix(),p.uvTransform.value.copy(y.matrix))}function l(p,f){p.specular.value.copy(f.specular),p.shininess.value=Math.max(f.shininess,1e-4)}function d(p,f){f.gradientMap&&(p.gradientMap.value=f.gradientMap)}function h(p,f){p.roughness.value=f.roughness,p.metalness.value=f.metalness,f.roughnessMap&&(p.roughnessMap.value=f.roughnessMap),f.metalnessMap&&(p.metalnessMap.value=f.metalnessMap),e.get(f).envMap&&(p.envMapIntensity.value=f.envMapIntensity)}function u(p,f,y){p.ior.value=f.ior,f.sheen>0&&(p.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),p.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(p.sheenColorMap.value=f.sheenColorMap),f.sheenRoughnessMap&&(p.sheenRoughnessMap.value=f.sheenRoughnessMap)),f.clearcoat>0&&(p.clearcoat.value=f.clearcoat,p.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(p.clearcoatMap.value=f.clearcoatMap),f.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap),f.clearcoatNormalMap&&(p.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),p.clearcoatNormalMap.value=f.clearcoatNormalMap,f.side===Dt&&p.clearcoatNormalScale.value.negate())),f.iridescence>0&&(p.iridescence.value=f.iridescence,p.iridescenceIOR.value=f.iridescenceIOR,p.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(p.iridescenceMap.value=f.iridescenceMap),f.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=f.iridescenceThicknessMap)),f.transmission>0&&(p.transmission.value=f.transmission,p.transmissionSamplerMap.value=y.texture,p.transmissionSamplerSize.value.set(y.width,y.height),f.transmissionMap&&(p.transmissionMap.value=f.transmissionMap),p.thickness.value=f.thickness,f.thicknessMap&&(p.thicknessMap.value=f.thicknessMap),p.attenuationDistance.value=f.attenuationDistance,p.attenuationColor.value.copy(f.attenuationColor)),p.specularIntensity.value=f.specularIntensity,p.specularColor.value.copy(f.specularColor),f.specularIntensityMap&&(p.specularIntensityMap.value=f.specularIntensityMap),f.specularColorMap&&(p.specularColorMap.value=f.specularColorMap)}function m(p,f){f.matcap&&(p.matcap.value=f.matcap)}function x(p,f){p.referencePosition.value.copy(f.referencePosition),p.nearDistance.value=f.nearDistance,p.farDistance.value=f.farDistance}return{refreshFogUniforms:t,refreshMaterialUniforms:n}}function Sp(s,e,t,n){let i={},r={},a=[];const o=t.isWebGL2?s.getParameter(35375):0;function c(w,_){const S=_.program;n.uniformBlockBinding(w,S)}function l(w,_){let S=i[w.id];S===void 0&&(x(w),S=d(w),i[w.id]=S,w.addEventListener("dispose",f));const b=_.program;n.updateUBOMapping(w,b);const I=e.render.frame;r[w.id]!==I&&(u(w),r[w.id]=I)}function d(w){const _=h();w.__bindingPointIndex=_;const S=s.createBuffer(),b=w.__size,I=w.usage;return s.bindBuffer(35345,S),s.bufferData(35345,b,I),s.bindBuffer(35345,null),s.bindBufferBase(35345,_,S),S}function h(){for(let w=0;w<o;w++)if(a.indexOf(w)===-1)return a.push(w),w;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(w){const _=i[w.id],S=w.uniforms,b=w.__cache;s.bindBuffer(35345,_);for(let I=0,O=S.length;I<O;I++){const v=S[I];if(m(v,I,b)===!0){const D=v.__offset,R=Array.isArray(v.value)?v.value:[v.value];let K=0;for(let q=0;q<R.length;q++){const L=R[q],C=p(L);typeof L=="number"?(v.__data[0]=L,s.bufferSubData(35345,D+K,v.__data)):L.isMatrix3?(v.__data[0]=L.elements[0],v.__data[1]=L.elements[1],v.__data[2]=L.elements[2],v.__data[3]=L.elements[0],v.__data[4]=L.elements[3],v.__data[5]=L.elements[4],v.__data[6]=L.elements[5],v.__data[7]=L.elements[0],v.__data[8]=L.elements[6],v.__data[9]=L.elements[7],v.__data[10]=L.elements[8],v.__data[11]=L.elements[0]):(L.toArray(v.__data,K),K+=C.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(35345,D,v.__data)}}s.bindBuffer(35345,null)}function m(w,_,S){const b=w.value;if(S[_]===void 0){if(typeof b=="number")S[_]=b;else{const I=Array.isArray(b)?b:[b],O=[];for(let v=0;v<I.length;v++)O.push(I[v].clone());S[_]=O}return!0}else if(typeof b=="number"){if(S[_]!==b)return S[_]=b,!0}else{const I=Array.isArray(S[_])?S[_]:[S[_]],O=Array.isArray(b)?b:[b];for(let v=0;v<I.length;v++){const D=I[v];if(D.equals(O[v])===!1)return D.copy(O[v]),!0}}return!1}function x(w){const _=w.uniforms;let S=0;const b=16;let I=0;for(let O=0,v=_.length;O<v;O++){const D=_[O],R={boundary:0,storage:0},K=Array.isArray(D.value)?D.value:[D.value];for(let q=0,L=K.length;q<L;q++){const C=K[q],W=p(C);R.boundary+=W.boundary,R.storage+=W.storage}if(D.__data=new Float32Array(R.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=S,O>0){I=S%b;const q=b-I;I!==0&&q-R.boundary<0&&(S+=b-I,D.__offset=S)}S+=R.storage}return I=S%b,I>0&&(S+=b-I),w.__size=S,w.__cache={},this}function p(w){const _={boundary:0,storage:0};return typeof w=="number"?(_.boundary=4,_.storage=4):w.isVector2?(_.boundary=8,_.storage=8):w.isVector3||w.isColor?(_.boundary=16,_.storage=12):w.isVector4?(_.boundary=16,_.storage=16):w.isMatrix3?(_.boundary=48,_.storage=48):w.isMatrix4?(_.boundary=64,_.storage=64):w.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",w),_}function f(w){const _=w.target;_.removeEventListener("dispose",f);const S=a.indexOf(_.__bindingPointIndex);a.splice(S,1),s.deleteBuffer(i[_.id]),delete i[_.id],delete r[_.id]}function y(){for(const w in i)s.deleteBuffer(i[w]);a=[],i={},r={}}return{bind:c,update:l,dispose:y}}function Tp(){const s=Vi("canvas");return s.style.display="block",s}function Zs(s={}){this.isWebGLRenderer=!0;const e=s.canvas!==void 0?s.canvas:Tp(),t=s.context!==void 0?s.context:null,n=s.depth!==void 0?s.depth:!0,i=s.stencil!==void 0?s.stencil:!0,r=s.antialias!==void 0?s.antialias:!1,a=s.premultipliedAlpha!==void 0?s.premultipliedAlpha:!0,o=s.preserveDrawingBuffer!==void 0?s.preserveDrawingBuffer:!1,c=s.powerPreference!==void 0?s.powerPreference:"default",l=s.failIfMajorPerformanceCaveat!==void 0?s.failIfMajorPerformanceCaveat:!1;let d;t!==null?d=t.getContextAttributes().alpha:d=s.alpha!==void 0?s.alpha:!1;let h=null,u=null;const m=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.outputEncoding=bn,this.useLegacyLights=!0,this.toneMapping=$t,this.toneMappingExposure=1;const p=this;let f=!1,y=0,w=0,_=null,S=-1,b=null;const I=new ct,O=new ct;let v=null,D=e.width,R=e.height,K=1,q=null,L=null;const C=new ct(0,0,D,R),W=new ct(0,0,D,R);let Q=!1;const $=new Qs;let Y=!1,ee=!1,se=null;const ce=new tt,V=new F,re={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function de(){return _===null?K:1}let U=t;function ne(T,G){for(let J=0;J<T.length;J++){const B=T[J],te=e.getContext(B,G);if(te!==null)return te}return null}try{const T={alpha:!0,depth:n,stencil:i,antialias:r,premultipliedAlpha:a,preserveDrawingBuffer:o,powerPreference:c,failIfMajorPerformanceCaveat:l};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Hs}`),e.addEventListener("webglcontextlost",he,!1),e.addEventListener("webglcontextrestored",ge,!1),e.addEventListener("webglcontextcreationerror",pe,!1),U===null){const G=["webgl2","webgl","experimental-webgl"];if(p.isWebGL1Renderer===!0&&G.shift(),U=ne(G,T),U===null)throw ne(G)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}U.getShaderPrecisionFormat===void 0&&(U.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let oe,le,ue,xe,_e,ye,we,Ie,je,Ae,Le,Se,Te,Ke,He,M,g,E,P,k,H,X,A,N;function ie(){oe=new Rh(U),le=new Nh(U,oe,s),oe.init(le),X=new _p(U,oe,le),ue=new Mp(U,oe,le),xe=new jh,_e=new ip,ye=new xp(U,oe,ue,_e,le,X,xe),we=new Lh(p),Ie=new Ph(p),je=new Kc(U,le),A=new Eh(U,oe,je,le),Ae=new Uh(U,je,xe,A),Le=new Vh(U,Ae,je,xe),P=new Gh(U,le,ye),M=new Ch(_e),Se=new np(p,we,Ie,oe,le,A,M),Te=new bp(p,_e),Ke=new rp,He=new up(oe,le),E=new Dh(p,we,Ie,ue,Le,d,a),g=new gp(p,Le,le),N=new Sp(U,xe,le,ue),k=new Ih(U,oe,xe,le),H=new kh(U,oe,xe,le),xe.programs=Se.programs,p.capabilities=le,p.extensions=oe,p.properties=_e,p.renderLists=Ke,p.shadowMap=g,p.state=ue,p.info=xe}ie();const ae=new Ap(p,U);this.xr=ae,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const T=oe.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=oe.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return K},this.setPixelRatio=function(T){T!==void 0&&(K=T,this.setSize(D,R,!1))},this.getSize=function(T){return T.set(D,R)},this.setSize=function(T,G,J=!0){if(ae.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}D=T,R=G,e.width=Math.floor(T*K),e.height=Math.floor(G*K),J===!0&&(e.style.width=T+"px",e.style.height=G+"px"),this.setViewport(0,0,T,G)},this.getDrawingBufferSize=function(T){return T.set(D*K,R*K).floor()},this.setDrawingBufferSize=function(T,G,J){D=T,R=G,K=J,e.width=Math.floor(T*J),e.height=Math.floor(G*J),this.setViewport(0,0,T,G)},this.getCurrentViewport=function(T){return T.copy(I)},this.getViewport=function(T){return T.copy(C)},this.setViewport=function(T,G,J,B){T.isVector4?C.set(T.x,T.y,T.z,T.w):C.set(T,G,J,B),ue.viewport(I.copy(C).multiplyScalar(K).floor())},this.getScissor=function(T){return T.copy(W)},this.setScissor=function(T,G,J,B){T.isVector4?W.set(T.x,T.y,T.z,T.w):W.set(T,G,J,B),ue.scissor(O.copy(W).multiplyScalar(K).floor())},this.getScissorTest=function(){return Q},this.setScissorTest=function(T){ue.setScissorTest(Q=T)},this.setOpaqueSort=function(T){q=T},this.setTransparentSort=function(T){L=T},this.getClearColor=function(T){return T.copy(E.getClearColor())},this.setClearColor=function(){E.setClearColor.apply(E,arguments)},this.getClearAlpha=function(){return E.getClearAlpha()},this.setClearAlpha=function(){E.setClearAlpha.apply(E,arguments)},this.clear=function(T=!0,G=!0,J=!0){let B=0;T&&(B|=16384),G&&(B|=256),J&&(B|=1024),U.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",he,!1),e.removeEventListener("webglcontextrestored",ge,!1),e.removeEventListener("webglcontextcreationerror",pe,!1),Ke.dispose(),He.dispose(),_e.dispose(),we.dispose(),Ie.dispose(),Le.dispose(),A.dispose(),N.dispose(),Se.dispose(),ae.dispose(),ae.removeEventListener("sessionstart",Z),ae.removeEventListener("sessionend",fe),se&&(se.dispose(),se=null),Me.stop()};function he(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),f=!0}function ge(){console.log("THREE.WebGLRenderer: Context Restored."),f=!1;const T=xe.autoReset,G=g.enabled,J=g.autoUpdate,B=g.needsUpdate,te=g.type;ie(),xe.autoReset=T,g.enabled=G,g.autoUpdate=J,g.needsUpdate=B,g.type=te}function pe(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function ve(T){const G=T.target;G.removeEventListener("dispose",ve),Ee(G)}function Ee(T){ze(T),_e.remove(T)}function ze(T){const G=_e.get(T).programs;G!==void 0&&(G.forEach(function(J){Se.releaseProgram(J)}),T.isShaderMaterial&&Se.releaseShaderCache(T))}this.renderBufferDirect=function(T,G,J,B,te,be){G===null&&(G=re);const De=te.isMesh&&te.matrixWorld.determinant()<0,Oe=xa(T,G,J,B,te);ue.setMaterial(B,De);let Ue=J.index,Ve=1;B.wireframe===!0&&(Ue=Ae.getWireframeAttribute(J),Ve=2);const Fe=J.drawRange,Be=J.attributes.position;let $e=Fe.start*Ve,At=(Fe.start+Fe.count)*Ve;be!==null&&($e=Math.max($e,be.start*Ve),At=Math.min(At,(be.start+be.count)*Ve)),Ue!==null?($e=Math.max($e,0),At=Math.min(At,Ue.count)):Be!=null&&($e=Math.max($e,0),At=Math.min(At,Be.count));const Vt=At-$e;if(Vt<0||Vt===1/0)return;A.setup(te,B,Oe,J,Ue);let un,Je=k;if(Ue!==null&&(un=je.get(Ue),Je=H,Je.setIndex(un)),te.isMesh)B.wireframe===!0?(ue.setLineWidth(B.wireframeLinewidth*de()),Je.setMode(1)):Je.setMode(4);else if(te.isLine){let Ge=B.linewidth;Ge===void 0&&(Ge=1),ue.setLineWidth(Ge*de()),te.isLineSegments?Je.setMode(1):te.isLineLoop?Je.setMode(2):Je.setMode(3)}else te.isPoints?Je.setMode(0):te.isSprite&&Je.setMode(4);if(te.isInstancedMesh)Je.renderInstances($e,Vt,te.count);else if(J.isInstancedBufferGeometry){const Ge=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,Qi=Math.min(J.instanceCount,Ge);Je.renderInstances($e,Vt,Qi)}else Je.render($e,Vt)},this.compile=function(T,G){function J(B,te,be){B.transparent===!0&&B.side===qt&&B.forceSinglePass===!1?(B.side=Dt,B.needsUpdate=!0,it(B,te,be),B.side=cn,B.needsUpdate=!0,it(B,te,be),B.side=qt):it(B,te,be)}u=He.get(T),u.init(),x.push(u),T.traverseVisible(function(B){B.isLight&&B.layers.test(G.layers)&&(u.pushLight(B),B.castShadow&&u.pushShadow(B))}),u.setupLights(p.useLegacyLights),T.traverse(function(B){const te=B.material;if(te)if(Array.isArray(te))for(let be=0;be<te.length;be++){const De=te[be];J(De,T,B)}else J(te,T,B)}),x.pop(),u=null};let z=null;function j(T){z&&z(T)}function Z(){Me.stop()}function fe(){Me.start()}const Me=new oa;Me.setAnimationLoop(j),typeof self<"u"&&Me.setContext(self),this.setAnimationLoop=function(T){z=T,ae.setAnimationLoop(T),T===null?Me.stop():Me.start()},ae.addEventListener("sessionstart",Z),ae.addEventListener("sessionend",fe),this.render=function(T,G){if(G!==void 0&&G.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(f===!0)return;T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),G.parent===null&&G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),ae.enabled===!0&&ae.isPresenting===!0&&(ae.cameraAutoUpdate===!0&&ae.updateCamera(G),G=ae.getCamera()),T.isScene===!0&&T.onBeforeRender(p,T,G,_),u=He.get(T,x.length),u.init(),x.push(u),ce.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),$.setFromProjectionMatrix(ce),ee=this.localClippingEnabled,Y=M.init(this.clippingPlanes,ee),h=Ke.get(T,m.length),h.init(),m.push(h),Re(T,G,0,p.sortObjects),h.finish(),p.sortObjects===!0&&h.sort(q,L),Y===!0&&M.beginShadows();const J=u.state.shadowsArray;if(g.render(J,T,G),Y===!0&&M.endShadows(),this.info.autoReset===!0&&this.info.reset(),E.render(h,T),u.setupLights(p.useLegacyLights),G.isArrayCamera){const B=G.cameras;for(let te=0,be=B.length;te<be;te++){const De=B[te];We(h,T,De,De.viewport)}}else We(h,T,G);_!==null&&(ye.updateMultisampleRenderTarget(_),ye.updateRenderTargetMipmap(_)),T.isScene===!0&&T.onAfterRender(p,T,G),A.resetDefaultState(),S=-1,b=null,x.pop(),x.length>0?u=x[x.length-1]:u=null,m.pop(),m.length>0?h=m[m.length-1]:h=null};function Re(T,G,J,B){if(T.visible===!1)return;if(T.layers.test(G.layers)){if(T.isGroup)J=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(G);else if(T.isLight)u.pushLight(T),T.castShadow&&u.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||$.intersectsSprite(T)){B&&V.setFromMatrixPosition(T.matrixWorld).applyMatrix4(ce);const De=Le.update(T),Oe=T.material;Oe.visible&&h.push(T,De,Oe,J,V.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(T.isSkinnedMesh&&T.skeleton.frame!==xe.render.frame&&(T.skeleton.update(),T.skeleton.frame=xe.render.frame),!T.frustumCulled||$.intersectsObject(T))){B&&V.setFromMatrixPosition(T.matrixWorld).applyMatrix4(ce);const De=Le.update(T),Oe=T.material;if(Array.isArray(Oe)){const Ue=De.groups;for(let Ve=0,Fe=Ue.length;Ve<Fe;Ve++){const Be=Ue[Ve],$e=Oe[Be.materialIndex];$e&&$e.visible&&h.push(T,De,$e,J,V.z,Be)}}else Oe.visible&&h.push(T,De,Oe,J,V.z,null)}}const be=T.children;for(let De=0,Oe=be.length;De<Oe;De++)Re(be[De],G,J,B)}function We(T,G,J,B){const te=T.opaque,be=T.transmissive,De=T.transparent;u.setupLightsView(J),Y===!0&&M.setGlobalState(p.clippingPlanes,J),be.length>0&&nt(te,G,J),B&&ue.viewport(I.copy(B)),te.length>0&&dt(te,G,J),be.length>0&&dt(be,G,J),De.length>0&&dt(De,G,J),ue.buffers.depth.setTest(!0),ue.buffers.depth.setMask(!0),ue.buffers.color.setMask(!0),ue.setPolygonOffset(!1)}function nt(T,G,J){const B=le.isWebGL2;se===null&&(se=new Tn(1024,1024,{generateMipmaps:!0,type:oe.has("EXT_color_buffer_half_float")?hi:An,minFilter:ui,samples:B&&r===!0?4:0}));const te=p.getRenderTarget();p.setRenderTarget(se),p.clear();const be=p.toneMapping;p.toneMapping=$t,dt(T,G,J),p.toneMapping=be,ye.updateMultisampleRenderTarget(se),ye.updateRenderTargetMipmap(se),p.setRenderTarget(te)}function dt(T,G,J){const B=G.isScene===!0?G.overrideMaterial:null;for(let te=0,be=T.length;te<be;te++){const De=T[te],Oe=De.object,Ue=De.geometry,Ve=B===null?De.material:B,Fe=De.group;Oe.layers.test(J.layers)&&qe(Oe,G,J,Ue,Ve,Fe)}}function qe(T,G,J,B,te,be){T.onBeforeRender(p,G,J,B,te,be),T.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),te.onBeforeRender(p,G,J,B,T,be),te.transparent===!0&&te.side===qt&&te.forceSinglePass===!1?(te.side=Dt,te.needsUpdate=!0,p.renderBufferDirect(J,G,B,te,T,be),te.side=cn,te.needsUpdate=!0,p.renderBufferDirect(J,G,B,te,T,be),te.side=qt):p.renderBufferDirect(J,G,B,te,T,be),T.onAfterRender(p,G,J,B,te,be)}function it(T,G,J){G.isScene!==!0&&(G=re);const B=_e.get(T),te=u.state.lights,be=u.state.shadowsArray,De=te.state.version,Oe=Se.getParameters(T,te.state,be,G,J),Ue=Se.getProgramCacheKey(Oe);let Ve=B.programs;B.environment=T.isMeshStandardMaterial?G.environment:null,B.fog=G.fog,B.envMap=(T.isMeshStandardMaterial?Ie:we).get(T.envMap||B.environment),Ve===void 0&&(T.addEventListener("dispose",ve),Ve=new Map,B.programs=Ve);let Fe=Ve.get(Ue);if(Fe!==void 0){if(B.currentProgram===Fe&&B.lightsStateVersion===De)return jt(T,Oe),Fe}else Oe.uniforms=Se.getUniforms(T),T.onBuild(J,Oe,p),T.onBeforeCompile(Oe,p),Fe=Se.acquireProgram(Oe,Ue),Ve.set(Ue,Fe),B.uniforms=Oe.uniforms;const Be=B.uniforms;(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Be.clippingPlanes=M.uniform),jt(T,Oe),B.needsLights=ya(T),B.lightsStateVersion=De,B.needsLights&&(Be.ambientLightColor.value=te.state.ambient,Be.lightProbe.value=te.state.probe,Be.directionalLights.value=te.state.directional,Be.directionalLightShadows.value=te.state.directionalShadow,Be.spotLights.value=te.state.spot,Be.spotLightShadows.value=te.state.spotShadow,Be.rectAreaLights.value=te.state.rectArea,Be.ltc_1.value=te.state.rectAreaLTC1,Be.ltc_2.value=te.state.rectAreaLTC2,Be.pointLights.value=te.state.point,Be.pointLightShadows.value=te.state.pointShadow,Be.hemisphereLights.value=te.state.hemi,Be.directionalShadowMap.value=te.state.directionalShadowMap,Be.directionalShadowMatrix.value=te.state.directionalShadowMatrix,Be.spotShadowMap.value=te.state.spotShadowMap,Be.spotLightMatrix.value=te.state.spotLightMatrix,Be.spotLightMap.value=te.state.spotLightMap,Be.pointShadowMap.value=te.state.pointShadowMap,Be.pointShadowMatrix.value=te.state.pointShadowMatrix);const $e=Fe.getUniforms(),At=Bi.seqWithValue($e.seq,Be);return B.currentProgram=Fe,B.uniformsList=At,Fe}function jt(T,G){const J=_e.get(T);J.outputEncoding=G.outputEncoding,J.instancing=G.instancing,J.skinning=G.skinning,J.morphTargets=G.morphTargets,J.morphNormals=G.morphNormals,J.morphColors=G.morphColors,J.morphTargetsCount=G.morphTargetsCount,J.numClippingPlanes=G.numClippingPlanes,J.numIntersection=G.numClipIntersection,J.vertexAlphas=G.vertexAlphas,J.vertexTangents=G.vertexTangents,J.toneMapping=G.toneMapping}function xa(T,G,J,B,te){G.isScene!==!0&&(G=re),ye.resetTextureUnits();const be=G.fog,De=B.isMeshStandardMaterial?G.environment:null,Oe=_===null?p.outputEncoding:_.isXRRenderTarget===!0?_.texture.encoding:bn,Ue=(B.isMeshStandardMaterial?Ie:we).get(B.envMap||De),Ve=B.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,Fe=!!B.normalMap&&!!J.attributes.tangent,Be=!!J.morphAttributes.position,$e=!!J.morphAttributes.normal,At=!!J.morphAttributes.color,Vt=B.toneMapped?p.toneMapping:$t,un=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,Je=un!==void 0?un.length:0,Ge=_e.get(B),Qi=u.state.lights;if(Y===!0&&(ee===!0||T!==b)){const bt=T===b&&B.id===S;M.setState(B,T,bt)}let at=!1;B.version===Ge.__version?(Ge.needsLights&&Ge.lightsStateVersion!==Qi.state.version||Ge.outputEncoding!==Oe||te.isInstancedMesh&&Ge.instancing===!1||!te.isInstancedMesh&&Ge.instancing===!0||te.isSkinnedMesh&&Ge.skinning===!1||!te.isSkinnedMesh&&Ge.skinning===!0||Ge.envMap!==Ue||B.fog===!0&&Ge.fog!==be||Ge.numClippingPlanes!==void 0&&(Ge.numClippingPlanes!==M.numPlanes||Ge.numIntersection!==M.numIntersection)||Ge.vertexAlphas!==Ve||Ge.vertexTangents!==Fe||Ge.morphTargets!==Be||Ge.morphNormals!==$e||Ge.morphColors!==At||Ge.toneMapping!==Vt||le.isWebGL2===!0&&Ge.morphTargetsCount!==Je)&&(at=!0):(at=!0,Ge.__version=B.version);let hn=Ge.currentProgram;at===!0&&(hn=it(B,G,te));let $s=!1,ti=!1,Ki=!1;const mt=hn.getUniforms(),fn=Ge.uniforms;if(ue.useProgram(hn.program)&&($s=!0,ti=!0,Ki=!0),B.id!==S&&(S=B.id,ti=!0),$s||b!==T){if(mt.setValue(U,"projectionMatrix",T.projectionMatrix),le.logarithmicDepthBuffer&&mt.setValue(U,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),b!==T&&(b=T,ti=!0,Ki=!0),B.isShaderMaterial||B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshStandardMaterial||B.envMap){const bt=mt.map.cameraPosition;bt!==void 0&&bt.setValue(U,V.setFromMatrixPosition(T.matrixWorld))}(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&mt.setValue(U,"isOrthographic",T.isOrthographicCamera===!0),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial||B.isShadowMaterial||te.isSkinnedMesh)&&mt.setValue(U,"viewMatrix",T.matrixWorldInverse)}if(te.isSkinnedMesh){mt.setOptional(U,te,"bindMatrix"),mt.setOptional(U,te,"bindMatrixInverse");const bt=te.skeleton;bt&&(le.floatVertexTextures?(bt.boneTexture===null&&bt.computeBoneTexture(),mt.setValue(U,"boneTexture",bt.boneTexture,ye),mt.setValue(U,"boneTextureSize",bt.boneTextureSize)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}const Xi=J.morphAttributes;if((Xi.position!==void 0||Xi.normal!==void 0||Xi.color!==void 0&&le.isWebGL2===!0)&&P.update(te,J,hn),(ti||Ge.receiveShadow!==te.receiveShadow)&&(Ge.receiveShadow=te.receiveShadow,mt.setValue(U,"receiveShadow",te.receiveShadow)),B.isMeshGouraudMaterial&&B.envMap!==null&&(fn.envMap.value=Ue,fn.flipEnvMap.value=Ue.isCubeTexture&&Ue.isRenderTargetTexture===!1?-1:1),ti&&(mt.setValue(U,"toneMappingExposure",p.toneMappingExposure),Ge.needsLights&&_a(fn,Ki),be&&B.fog===!0&&Te.refreshFogUniforms(fn,be),Te.refreshMaterialUniforms(fn,B,K,R,se),Bi.upload(U,Ge.uniformsList,fn,ye)),B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(Bi.upload(U,Ge.uniformsList,fn,ye),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&mt.setValue(U,"center",te.center),mt.setValue(U,"modelViewMatrix",te.modelViewMatrix),mt.setValue(U,"normalMatrix",te.normalMatrix),mt.setValue(U,"modelMatrix",te.matrixWorld),B.isShaderMaterial||B.isRawShaderMaterial){const bt=B.uniformsGroups;for(let Zi=0,va=bt.length;Zi<va;Zi++)if(le.isWebGL2){const Js=bt[Zi];N.update(Js,hn),N.bind(Js,hn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return hn}function _a(T,G){T.ambientLightColor.needsUpdate=G,T.lightProbe.needsUpdate=G,T.directionalLights.needsUpdate=G,T.directionalLightShadows.needsUpdate=G,T.pointLights.needsUpdate=G,T.pointLightShadows.needsUpdate=G,T.spotLights.needsUpdate=G,T.spotLightShadows.needsUpdate=G,T.rectAreaLights.needsUpdate=G,T.hemisphereLights.needsUpdate=G}function ya(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return y},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return _},this.setRenderTargetTextures=function(T,G,J){_e.get(T.texture).__webglTexture=G,_e.get(T.depthTexture).__webglTexture=J;const B=_e.get(T);B.__hasExternalTextures=!0,B.__hasExternalTextures&&(B.__autoAllocateDepthBuffer=J===void 0,B.__autoAllocateDepthBuffer||oe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),B.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(T,G){const J=_e.get(T);J.__webglFramebuffer=G,J.__useDefaultFramebuffer=G===void 0},this.setRenderTarget=function(T,G=0,J=0){_=T,y=G,w=J;let B=!0,te=null,be=!1,De=!1;if(T){const Ue=_e.get(T);Ue.__useDefaultFramebuffer!==void 0?(ue.bindFramebuffer(36160,null),B=!1):Ue.__webglFramebuffer===void 0?ye.setupRenderTarget(T):Ue.__hasExternalTextures&&ye.rebindTextures(T,_e.get(T.texture).__webglTexture,_e.get(T.depthTexture).__webglTexture);const Ve=T.texture;(Ve.isData3DTexture||Ve.isDataArrayTexture||Ve.isCompressedArrayTexture)&&(De=!0);const Fe=_e.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(te=Fe[G],be=!0):le.isWebGL2&&T.samples>0&&ye.useMultisampledRTT(T)===!1?te=_e.get(T).__webglMultisampledFramebuffer:te=Fe,I.copy(T.viewport),O.copy(T.scissor),v=T.scissorTest}else I.copy(C).multiplyScalar(K).floor(),O.copy(W).multiplyScalar(K).floor(),v=Q;if(ue.bindFramebuffer(36160,te)&&le.drawBuffers&&B&&ue.drawBuffers(T,te),ue.viewport(I),ue.scissor(O),ue.setScissorTest(v),be){const Ue=_e.get(T.texture);U.framebufferTexture2D(36160,36064,34069+G,Ue.__webglTexture,J)}else if(De){const Ue=_e.get(T.texture),Ve=G||0;U.framebufferTextureLayer(36160,36064,Ue.__webglTexture,J||0,Ve)}S=-1},this.readRenderTargetPixels=function(T,G,J,B,te,be,De){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Oe=_e.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&De!==void 0&&(Oe=Oe[De]),Oe){ue.bindFramebuffer(36160,Oe);try{const Ue=T.texture,Ve=Ue.format,Fe=Ue.type;if(Ve!==Ut&&X.convert(Ve)!==U.getParameter(35739)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Be=Fe===hi&&(oe.has("EXT_color_buffer_half_float")||le.isWebGL2&&oe.has("EXT_color_buffer_float"));if(Fe!==An&&X.convert(Fe)!==U.getParameter(35738)&&!(Fe===vn&&(le.isWebGL2||oe.has("OES_texture_float")||oe.has("WEBGL_color_buffer_float")))&&!Be){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}G>=0&&G<=T.width-B&&J>=0&&J<=T.height-te&&U.readPixels(G,J,B,te,X.convert(Ve),X.convert(Fe),be)}finally{const Ue=_!==null?_e.get(_).__webglFramebuffer:null;ue.bindFramebuffer(36160,Ue)}}},this.copyFramebufferToTexture=function(T,G,J=0){const B=Math.pow(2,-J),te=Math.floor(G.image.width*B),be=Math.floor(G.image.height*B);ye.setTexture2D(G,0),U.copyTexSubImage2D(3553,J,0,0,T.x,T.y,te,be),ue.unbindTexture()},this.copyTextureToTexture=function(T,G,J,B=0){const te=G.image.width,be=G.image.height,De=X.convert(J.format),Oe=X.convert(J.type);ye.setTexture2D(J,0),U.pixelStorei(37440,J.flipY),U.pixelStorei(37441,J.premultiplyAlpha),U.pixelStorei(3317,J.unpackAlignment),G.isDataTexture?U.texSubImage2D(3553,B,T.x,T.y,te,be,De,Oe,G.image.data):G.isCompressedTexture?U.compressedTexSubImage2D(3553,B,T.x,T.y,G.mipmaps[0].width,G.mipmaps[0].height,De,G.mipmaps[0].data):U.texSubImage2D(3553,B,T.x,T.y,De,Oe,G.image),B===0&&J.generateMipmaps&&U.generateMipmap(3553),ue.unbindTexture()},this.copyTextureToTexture3D=function(T,G,J,B,te=0){if(p.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const be=T.max.x-T.min.x+1,De=T.max.y-T.min.y+1,Oe=T.max.z-T.min.z+1,Ue=X.convert(B.format),Ve=X.convert(B.type);let Fe;if(B.isData3DTexture)ye.setTexture3D(B,0),Fe=32879;else if(B.isDataArrayTexture)ye.setTexture2DArray(B,0),Fe=35866;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}U.pixelStorei(37440,B.flipY),U.pixelStorei(37441,B.premultiplyAlpha),U.pixelStorei(3317,B.unpackAlignment);const Be=U.getParameter(3314),$e=U.getParameter(32878),At=U.getParameter(3316),Vt=U.getParameter(3315),un=U.getParameter(32877),Je=J.isCompressedTexture?J.mipmaps[0]:J.image;U.pixelStorei(3314,Je.width),U.pixelStorei(32878,Je.height),U.pixelStorei(3316,T.min.x),U.pixelStorei(3315,T.min.y),U.pixelStorei(32877,T.min.z),J.isDataTexture||J.isData3DTexture?U.texSubImage3D(Fe,te,G.x,G.y,G.z,be,De,Oe,Ue,Ve,Je.data):J.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),U.compressedTexSubImage3D(Fe,te,G.x,G.y,G.z,be,De,Oe,Ue,Je.data)):U.texSubImage3D(Fe,te,G.x,G.y,G.z,be,De,Oe,Ue,Ve,Je),U.pixelStorei(3314,Be),U.pixelStorei(32878,$e),U.pixelStorei(3316,At),U.pixelStorei(3315,Vt),U.pixelStorei(32877,un),te===0&&B.generateMipmaps&&U.generateMipmap(Fe),ue.unbindTexture()},this.initTexture=function(T){T.isCubeTexture?ye.setTextureCube(T,0):T.isData3DTexture?ye.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?ye.setTexture2DArray(T,0):ye.setTexture2D(T,0),ue.unbindTexture()},this.resetState=function(){y=0,w=0,_=null,ue.reset(),A.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}Object.defineProperties(Zs.prototype,{physicallyCorrectLights:{get:function(){return console.warn("THREE.WebGLRenderer: the property .physicallyCorrectLights has been removed. Set renderer.useLegacyLights instead."),!this.useLegacyLights},set:function(s){console.warn("THREE.WebGLRenderer: the property .physicallyCorrectLights has been removed. Set renderer.useLegacyLights instead."),this.useLegacyLights=!s}}});class Dp extends Zs{}Dp.prototype.isWebGL1Renderer=!0;class Ep extends ut{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}get autoUpdate(){return console.warn("THREE.Scene: autoUpdate was renamed to matrixWorldAutoUpdate in r144."),this.matrixWorldAutoUpdate}set autoUpdate(e){console.warn("THREE.Scene: autoUpdate was renamed to matrixWorldAutoUpdate in r144."),this.matrixWorldAutoUpdate=e}}class Ip{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Fs,this.updateRange={offset:0,count:-1},this.version=0,this.uuid=ln()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ln()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ln()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Mt=new F;class on{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix4(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.applyNormalMatrix(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.transformDirection(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}setX(e,t){return this.normalized&&(t=Qe(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Qe(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Qe(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Qe(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=sn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=sn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=sn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=sn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Qe(t,this.array),n=Qe(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Qe(t,this.array),n=Qe(n,this.array),i=Qe(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Qe(t,this.array),n=Qe(n,this.array),i=Qe(i,this.array),r=Qe(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new kt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new on(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class ha extends Jn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ye(16777215),this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const xo=new F,_o=new F,yo=new tt,Ns=new qo,Ui=new pi;class Np extends ut{constructor(e=new Lt,t=new ha){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)xo.fromBufferAttribute(t,i-1),_o.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=xo.distanceTo(_o);e.setAttribute("lineDistance",new pt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ui.copy(n.boundingSphere),Ui.applyMatrix4(i),Ui.radius+=r,e.ray.intersectsSphere(Ui)===!1)return;yo.copy(i).invert(),Ns.copy(e.ray).applyMatrix4(yo);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=new F,d=new F,h=new F,u=new F,m=this.isLineSegments?2:1,x=n.index,f=n.attributes.position;if(x!==null){const y=Math.max(0,a.start),w=Math.min(x.count,a.start+a.count);for(let _=y,S=w-1;_<S;_+=m){const b=x.getX(_),I=x.getX(_+1);if(l.fromBufferAttribute(f,b),d.fromBufferAttribute(f,I),Ns.distanceSqToSegment(l,d,u,h)>c)continue;u.applyMatrix4(this.matrixWorld);const v=e.ray.origin.distanceTo(u);v<e.near||v>e.far||t.push({distance:v,point:h.clone().applyMatrix4(this.matrixWorld),index:_,face:null,faceIndex:null,object:this})}}else{const y=Math.max(0,a.start),w=Math.min(f.count,a.start+a.count);for(let _=y,S=w-1;_<S;_+=m){if(l.fromBufferAttribute(f,_),d.fromBufferAttribute(f,_+1),Ns.distanceSqToSegment(l,d,u,h)>c)continue;u.applyMatrix4(this.matrixWorld);const I=e.ray.origin.distanceTo(u);I<e.near||I>e.far||t.push({distance:I,point:h.clone().applyMatrix4(this.matrixWorld),index:_,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}const vo=new F,wo=new F;class Cp extends Np{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)vo.fromBufferAttribute(t,i),wo.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+vo.distanceTo(wo);e.setAttribute("lineDistance",new pt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class fa extends Lt{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){const t=[],n=new Set,i=new F,r=new F;if(e.index!==null){const a=e.attributes.position,o=e.index;let c=e.groups;c.length===0&&(c=[{start:0,count:o.count,materialIndex:0}]);for(let l=0,d=c.length;l<d;++l){const h=c[l],u=h.start,m=h.count;for(let x=u,p=u+m;x<p;x+=3)for(let f=0;f<3;f++){const y=o.getX(x+f),w=o.getX(x+(f+1)%3);i.fromBufferAttribute(a,y),r.fromBufferAttribute(a,w),Ao(i,r,n)===!0&&(t.push(i.x,i.y,i.z),t.push(r.x,r.y,r.z))}}}else{const a=e.attributes.position;for(let o=0,c=a.count/3;o<c;o++)for(let l=0;l<3;l++){const d=3*o+l,h=3*o+(l+1)%3;i.fromBufferAttribute(a,d),r.fromBufferAttribute(a,h),Ao(i,r,n)===!0&&(t.push(i.x,i.y,i.z),t.push(r.x,r.y,r.z))}}this.setAttribute("position",new pt(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}function Ao(s,e,t){const n=`${s.x},${s.y},${s.z}-${e.x},${e.y},${e.z}`,i=`${e.x},${e.y},${e.z}-${s.x},${s.y},${s.z}`;return t.has(n)===!0||t.has(i)===!0?!1:(t.add(n),t.add(i),!0)}class Lp extends Jn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Ye(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ye(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ho,this.normalScale=new Ce(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class pa extends ut{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ye(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}const Cs=new tt,bo=new F,So=new F;class zp{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ce(512,512),this.map=null,this.mapPass=null,this.matrix=new tt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Qs,this._frameExtents=new Ce(1,1),this._viewportCount=1,this._viewports=[new ct(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;bo.setFromMatrixPosition(e.matrixWorld),t.position.copy(bo),So.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(So),t.updateMatrixWorld(),Cs.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Cs),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Cs)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Op extends zp{constructor(){super(new aa(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class To extends pa{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ut.DEFAULT_UP),this.updateMatrix(),this.target=new ut,this.shadow=new Op}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Pp extends pa{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class Rp extends Lt{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){const e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}class Vs extends Ip{constructor(e,t,n=1){super(e,t),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){const t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){const t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}}class Do{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(vt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Up extends Cp{constructor(e=10,t=10,n=4473924,i=8947848){n=new Ye(n),i=new Ye(i);const r=t/2,a=e/t,o=e/2,c=[],l=[];for(let u=0,m=0,x=-o;u<=t;u++,x+=a){c.push(-o,0,x,o,0,x),c.push(x,0,-o,x,0,o);const p=u===r?n:i;p.toArray(l,m),m+=3,p.toArray(l,m),m+=3,p.toArray(l,m),m+=3,p.toArray(l,m),m+=3}const d=new Lt;d.setAttribute("position",new pt(c,3)),d.setAttribute("color",new pt(l,3));const h=new ha({vertexColors:!0,toneMapped:!1});super(d,h),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Hs}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Hs);const Eo={type:"change"},Ls={type:"start"},Io={type:"end"};class kp extends Dn{constructor(e,t){super(),this.object=e,this.domElement=t,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new F,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:In.ROTATE,MIDDLE:In.DOLLY,RIGHT:In.PAN},this.touches={ONE:Nn.ROTATE,TWO:Nn.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return o.phi},this.getAzimuthalAngle=function(){return o.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(A){A.addEventListener("keydown",He),this._domElementKeyEvents=A},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",He),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(Eo),n.update(),r=i.NONE},this.update=(function(){const A=new F,N=new Sn().setFromUnitVectors(e.up,new F(0,1,0)),ie=N.clone().invert(),ae=new F,he=new Sn,ge=2*Math.PI;return function(){const ve=n.object.position;A.copy(ve).sub(n.target),A.applyQuaternion(N),o.setFromVector3(A),n.autoRotate&&r===i.NONE&&D(O()),n.enableDamping?(o.theta+=c.theta*n.dampingFactor,o.phi+=c.phi*n.dampingFactor):(o.theta+=c.theta,o.phi+=c.phi);let Ee=n.minAzimuthAngle,ze=n.maxAzimuthAngle;return isFinite(Ee)&&isFinite(ze)&&(Ee<-Math.PI?Ee+=ge:Ee>Math.PI&&(Ee-=ge),ze<-Math.PI?ze+=ge:ze>Math.PI&&(ze-=ge),Ee<=ze?o.theta=Math.max(Ee,Math.min(ze,o.theta)):o.theta=o.theta>(Ee+ze)/2?Math.max(Ee,o.theta):Math.min(ze,o.theta)),o.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,o.phi)),o.makeSafe(),o.radius*=l,o.radius=Math.max(n.minDistance,Math.min(n.maxDistance,o.radius)),n.enableDamping===!0?n.target.addScaledVector(d,n.dampingFactor):n.target.add(d),A.setFromSpherical(o),A.applyQuaternion(ie),ve.copy(n.target).add(A),n.object.lookAt(n.target),n.enableDamping===!0?(c.theta*=1-n.dampingFactor,c.phi*=1-n.dampingFactor,d.multiplyScalar(1-n.dampingFactor)):(c.set(0,0,0),d.set(0,0,0)),l=1,h||ae.distanceToSquared(n.object.position)>a||8*(1-he.dot(n.object.quaternion))>a?(n.dispatchEvent(Eo),ae.copy(n.object.position),he.copy(n.object.quaternion),h=!1,!0):!1}})(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",E),n.domElement.removeEventListener("pointerdown",Ie),n.domElement.removeEventListener("pointercancel",Le),n.domElement.removeEventListener("wheel",Ke),n.domElement.removeEventListener("pointermove",je),n.domElement.removeEventListener("pointerup",Ae),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",He),n._domElementKeyEvents=null)};const n=this,i={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=i.NONE;const a=1e-6,o=new Do,c=new Do;let l=1;const d=new F;let h=!1;const u=new Ce,m=new Ce,x=new Ce,p=new Ce,f=new Ce,y=new Ce,w=new Ce,_=new Ce,S=new Ce,b=[],I={};function O(){return 2*Math.PI/60/60*n.autoRotateSpeed}function v(){return Math.pow(.95,n.zoomSpeed)}function D(A){c.theta-=A}function R(A){c.phi-=A}const K=(function(){const A=new F;return function(ie,ae){A.setFromMatrixColumn(ae,0),A.multiplyScalar(-ie),d.add(A)}})(),q=(function(){const A=new F;return function(ie,ae){n.screenSpacePanning===!0?A.setFromMatrixColumn(ae,1):(A.setFromMatrixColumn(ae,0),A.crossVectors(n.object.up,A)),A.multiplyScalar(ie),d.add(A)}})(),L=(function(){const A=new F;return function(ie,ae){const he=n.domElement;if(n.object.isPerspectiveCamera){const ge=n.object.position;A.copy(ge).sub(n.target);let pe=A.length();pe*=Math.tan(n.object.fov/2*Math.PI/180),K(2*ie*pe/he.clientHeight,n.object.matrix),q(2*ae*pe/he.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(K(ie*(n.object.right-n.object.left)/n.object.zoom/he.clientWidth,n.object.matrix),q(ae*(n.object.top-n.object.bottom)/n.object.zoom/he.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}})();function C(A){n.object.isPerspectiveCamera?l/=A:n.object.isOrthographicCamera?(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom*A)),n.object.updateProjectionMatrix(),h=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function W(A){n.object.isPerspectiveCamera?l*=A:n.object.isOrthographicCamera?(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/A)),n.object.updateProjectionMatrix(),h=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function Q(A){u.set(A.clientX,A.clientY)}function $(A){w.set(A.clientX,A.clientY)}function Y(A){p.set(A.clientX,A.clientY)}function ee(A){m.set(A.clientX,A.clientY),x.subVectors(m,u).multiplyScalar(n.rotateSpeed);const N=n.domElement;D(2*Math.PI*x.x/N.clientHeight),R(2*Math.PI*x.y/N.clientHeight),u.copy(m),n.update()}function se(A){_.set(A.clientX,A.clientY),S.subVectors(_,w),S.y>0?C(v()):S.y<0&&W(v()),w.copy(_),n.update()}function ce(A){f.set(A.clientX,A.clientY),y.subVectors(f,p).multiplyScalar(n.panSpeed),L(y.x,y.y),p.copy(f),n.update()}function V(A){A.deltaY<0?W(v()):A.deltaY>0&&C(v()),n.update()}function re(A){let N=!1;switch(A.code){case n.keys.UP:A.ctrlKey||A.metaKey||A.shiftKey?R(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):L(0,n.keyPanSpeed),N=!0;break;case n.keys.BOTTOM:A.ctrlKey||A.metaKey||A.shiftKey?R(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):L(0,-n.keyPanSpeed),N=!0;break;case n.keys.LEFT:A.ctrlKey||A.metaKey||A.shiftKey?D(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):L(n.keyPanSpeed,0),N=!0;break;case n.keys.RIGHT:A.ctrlKey||A.metaKey||A.shiftKey?D(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):L(-n.keyPanSpeed,0),N=!0;break}N&&(A.preventDefault(),n.update())}function de(){if(b.length===1)u.set(b[0].pageX,b[0].pageY);else{const A=.5*(b[0].pageX+b[1].pageX),N=.5*(b[0].pageY+b[1].pageY);u.set(A,N)}}function U(){if(b.length===1)p.set(b[0].pageX,b[0].pageY);else{const A=.5*(b[0].pageX+b[1].pageX),N=.5*(b[0].pageY+b[1].pageY);p.set(A,N)}}function ne(){const A=b[0].pageX-b[1].pageX,N=b[0].pageY-b[1].pageY,ie=Math.sqrt(A*A+N*N);w.set(0,ie)}function oe(){n.enableZoom&&ne(),n.enablePan&&U()}function le(){n.enableZoom&&ne(),n.enableRotate&&de()}function ue(A){if(b.length==1)m.set(A.pageX,A.pageY);else{const ie=X(A),ae=.5*(A.pageX+ie.x),he=.5*(A.pageY+ie.y);m.set(ae,he)}x.subVectors(m,u).multiplyScalar(n.rotateSpeed);const N=n.domElement;D(2*Math.PI*x.x/N.clientHeight),R(2*Math.PI*x.y/N.clientHeight),u.copy(m)}function xe(A){if(b.length===1)f.set(A.pageX,A.pageY);else{const N=X(A),ie=.5*(A.pageX+N.x),ae=.5*(A.pageY+N.y);f.set(ie,ae)}y.subVectors(f,p).multiplyScalar(n.panSpeed),L(y.x,y.y),p.copy(f)}function _e(A){const N=X(A),ie=A.pageX-N.x,ae=A.pageY-N.y,he=Math.sqrt(ie*ie+ae*ae);_.set(0,he),S.set(0,Math.pow(_.y/w.y,n.zoomSpeed)),C(S.y),w.copy(_)}function ye(A){n.enableZoom&&_e(A),n.enablePan&&xe(A)}function we(A){n.enableZoom&&_e(A),n.enableRotate&&ue(A)}function Ie(A){n.enabled!==!1&&(b.length===0&&(n.domElement.setPointerCapture(A.pointerId),n.domElement.addEventListener("pointermove",je),n.domElement.addEventListener("pointerup",Ae)),P(A),A.pointerType==="touch"?M(A):Se(A))}function je(A){n.enabled!==!1&&(A.pointerType==="touch"?g(A):Te(A))}function Ae(A){k(A),b.length===0&&(n.domElement.releasePointerCapture(A.pointerId),n.domElement.removeEventListener("pointermove",je),n.domElement.removeEventListener("pointerup",Ae)),n.dispatchEvent(Io),r=i.NONE}function Le(A){k(A)}function Se(A){let N;switch(A.button){case 0:N=n.mouseButtons.LEFT;break;case 1:N=n.mouseButtons.MIDDLE;break;case 2:N=n.mouseButtons.RIGHT;break;default:N=-1}switch(N){case In.DOLLY:if(n.enableZoom===!1)return;$(A),r=i.DOLLY;break;case In.ROTATE:if(A.ctrlKey||A.metaKey||A.shiftKey){if(n.enablePan===!1)return;Y(A),r=i.PAN}else{if(n.enableRotate===!1)return;Q(A),r=i.ROTATE}break;case In.PAN:if(A.ctrlKey||A.metaKey||A.shiftKey){if(n.enableRotate===!1)return;Q(A),r=i.ROTATE}else{if(n.enablePan===!1)return;Y(A),r=i.PAN}break;default:r=i.NONE}r!==i.NONE&&n.dispatchEvent(Ls)}function Te(A){switch(r){case i.ROTATE:if(n.enableRotate===!1)return;ee(A);break;case i.DOLLY:if(n.enableZoom===!1)return;se(A);break;case i.PAN:if(n.enablePan===!1)return;ce(A);break}}function Ke(A){n.enabled===!1||n.enableZoom===!1||r!==i.NONE||(A.preventDefault(),n.dispatchEvent(Ls),V(A),n.dispatchEvent(Io))}function He(A){n.enabled===!1||n.enablePan===!1||re(A)}function M(A){switch(H(A),b.length){case 1:switch(n.touches.ONE){case Nn.ROTATE:if(n.enableRotate===!1)return;de(),r=i.TOUCH_ROTATE;break;case Nn.PAN:if(n.enablePan===!1)return;U(),r=i.TOUCH_PAN;break;default:r=i.NONE}break;case 2:switch(n.touches.TWO){case Nn.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;oe(),r=i.TOUCH_DOLLY_PAN;break;case Nn.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;le(),r=i.TOUCH_DOLLY_ROTATE;break;default:r=i.NONE}break;default:r=i.NONE}r!==i.NONE&&n.dispatchEvent(Ls)}function g(A){switch(H(A),r){case i.TOUCH_ROTATE:if(n.enableRotate===!1)return;ue(A),n.update();break;case i.TOUCH_PAN:if(n.enablePan===!1)return;xe(A),n.update();break;case i.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;ye(A),n.update();break;case i.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;we(A),n.update();break;default:r=i.NONE}}function E(A){n.enabled!==!1&&A.preventDefault()}function P(A){b.push(A)}function k(A){delete I[A.pointerId];for(let N=0;N<b.length;N++)if(b[N].pointerId==A.pointerId){b.splice(N,1);return}}function H(A){let N=I[A.pointerId];N===void 0&&(N=new Ce,I[A.pointerId]=N),N.set(A.pageX,A.pageY)}function X(A){const N=A.pointerId===b[0].pointerId?b[1]:b[0];return I[N.pointerId]}n.domElement.addEventListener("contextmenu",E),n.domElement.addEventListener("pointerdown",Ie),n.domElement.addEventListener("pointercancel",Le),n.domElement.addEventListener("wheel",Ke,{passive:!1}),this.update()}}const No=new En,ki=new F;class ma extends Rp{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new pt(e,3)),this.setAttribute("uv",new pt(t,2))}applyMatrix4(e){const t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const n=new Vs(t,6,1);return this.setAttribute("instanceStart",new on(n,3,0)),this.setAttribute("instanceEnd",new on(n,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const n=new Vs(t,6,1);return this.setAttribute("instanceColorStart",new on(n,3,0)),this.setAttribute("instanceColorEnd",new on(n,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new fa(e.geometry)),this}fromLineSegments(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new En);const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),No.setFromBufferAttribute(t),this.boundingBox.union(No))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new pi),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){const n=this.boundingSphere.center;this.boundingBox.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)ki.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(ki)),ki.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(ki));this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}me.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new Ce(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};wt.line={uniforms:Ws.merge([me.common,me.fog,me.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
				vUv = uv;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				// get the offset direction as perpendicular to the view vector
				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 offset;
				if ( position.y < 0.5 ) {

					offset = normalize( cross( start.xyz, worldDir ) );

				} else {

					offset = normalize( cross( end.xyz, worldDir ) );

				}

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// extend the line bounds to encompass  endcaps
					start.xyz += - worldDir * linewidth * 0.5;
					end.xyz += worldDir * linewidth * 0.5;

					// shift the position of the quad so it hugs the forward edge of the line
					offset.xy -= dir * forwardOffset;
					offset.z += 0.5;

				#endif

				// endcaps
				if ( position.y > 1.0 || position.y < 0.0 ) {

					offset.xy += dir * 2.0 * forwardOffset;

				}

				// adjust for linewidth
				offset *= linewidth * 0.5;

				// set the world position
				worldPos = ( position.y < 0.5 ) ? start : end;
				worldPos.xyz += offset;

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			float alpha = opacity;

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <encodings_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};class ga extends dn{constructor(e){super({type:"LineMaterial",uniforms:Ws.clone(wt.line.uniforms),vertexShader:wt.line.vertexShader,fragmentShader:wt.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(t){this.uniforms.diffuse.value=t}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(t){this.uniforms.linewidth.value=t}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(t){!!t!="USE_DASH"in this.defines&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(t){this.uniforms.dashScale.value=t}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(t){this.uniforms.dashSize.value=t}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(t){this.uniforms.dashOffset.value=t}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(t){this.uniforms.gapSize.value=t}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(t){this.uniforms.opacity.value=t}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(t){this.uniforms.resolution.value.copy(t)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(t){!!t!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),t===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}class jp extends ma{constructor(e){super(),this.isWireframeGeometry2=!0,this.type="WireframeGeometry2",this.fromWireframeGeometry(new fa(e))}}const Co=new F,Lo=new F;class Fp extends Gt{constructor(e=new ma,t=new ga({color:Math.random()*16777215})){super(e,t),this.isWireframe=!0,this.type="Wireframe"}computeLineDistances(){const e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,i=new Float32Array(2*t.count);for(let a=0,o=0,c=t.count;a<c;a++,o+=2)Co.fromBufferAttribute(t,a),Lo.fromBufferAttribute(n,a),i[o]=o===0?0:i[o-1],i[o+1]=i[o]+Co.distanceTo(Lo);const r=new Vs(i,2,1);return e.setAttribute("instanceDistanceStart",new on(r,1,0)),e.setAttribute("instanceDistanceEnd",new on(r,1,1)),this}}class ji{constructor(e){this.container=e,this.scene=new Ep,this.scene.background=new Ye(3355443),this.camera=new Ct(75,e.clientWidth/e.clientHeight,.1,1e3),this.camera.position.set(0,10,10),this.camera.lookAt(0,0,0),this.renderer=new Zs({antialias:!0}),this.renderer.setSize(e.clientWidth,e.clientHeight),e.appendChild(this.renderer.domElement),this.controls=new kp(this.camera,this.renderer.domElement),this.controls.enableDamping=!0;const t=new Pp(16777215,.6);this.scene.add(t);const n=new To(16777215,.4);n.position.set(10,20,10),this.scene.add(n);const i=new To(16777215,.3);i.position.set(-10,-10,-5),this.scene.add(i);const r=new Up(20,20);this.scene.add(r),this.currentMesh=null,this.currentWireframe=null,this.animate=this.animate.bind(this),this.onResize=this.onResize.bind(this),window.addEventListener("resize",this.onResize),this.animate()}updateMesh(e){if(this.currentMesh&&(this.scene.remove(this.currentMesh),this.currentMesh.geometry.dispose(),this.currentMesh.material.dispose(),this.currentMesh=null),this.currentWireframe&&(this.scene.remove(this.currentWireframe),this.currentWireframe.geometry.dispose(),this.currentWireframe.material.dispose(),this.currentWireframe=null),!e||!e.vertices||!e.faces)return;const t=[];for(const f of e.vertices)t.push(f.x,f.y||0,f.z||0);const n=new Lt,i=[],r=[],a=f=>{const y=new Ye(f);return[y.r,y.g,y.b]},o=a(ke.faceColor0),c=a(ke.faceColor1),l=a(ke.faceColor2),d=a("#44aa88"),h=e.face_colors&&e.face_colors.length===e.faces.length;for(let f=0;f<e.faces.length;f++){const y=e.faces[f];if(y.length<3)continue;let w=d;if(h){const S=e.face_colors[f];S===0?w=o:S===1?w=c:S===2&&(w=l)}const _=e.vertices[y[0]];for(let S=1;S<y.length-1;S++){const b=e.vertices[y[S]],I=e.vertices[y[S+1]];i.push(_.x,_.y||0,_.z||0),i.push(b.x,b.y||0,b.z||0),i.push(I.x,I.y||0,I.z||0),r.push(...w),r.push(...w),r.push(...w)}}n.setAttribute("position",new pt(i,3)),n.setAttribute("color",new pt(r,3)),n.computeVertexNormals();const u=new Lp({color:16777215,vertexColors:!0,roughness:.7,metalness:.1,side:qt});this.currentMesh=new Gt(n,u),this.scene.add(this.currentMesh);const m=[];for(const f of e.faces)if(!(f.length<2))for(let y=0;y<f.length;y++){const w=f[y],_=f[(y+1)%f.length],S=e.vertices[w],b=e.vertices[_];m.push(S.x,S.y||0,S.z||0),m.push(b.x,b.y||0,b.z||0)}const x=new jp(n);x.setPositions(m);const p=new ga({color:1048576,linewidth:.003,transparent:!0,opacity:.5,depthTest:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1});this.currentWireframe=new Fp(x,p),this.currentMesh.add(this.currentWireframe),n.computeBoundingSphere(),n.boundingSphere.center,n.boundingSphere.radius}onResize(){this.container&&(this.camera.aspect=this.container.clientWidth/this.container.clientHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(this.container.clientWidth,this.container.clientHeight))}animate(){requestAnimationFrame(this.animate),this.controls.update(),this.renderer.render(this.scene,this.camera)}dispose(){window.removeEventListener("resize",this.onResize),this.renderer.dispose(),this.currentMesh&&(this.currentMesh.geometry.dispose(),this.currentMesh.material.dispose())}}class Bp{constructor(e,t){this.state=e,this.requestDraw=t,this.selectedStyleIndex=-1,this.editingPoints=[],this.backupPoints=null,this.isEditing=!1,this.canvas=document.getElementById("curve-editor-canvas"),this.ctx=this.canvas.getContext("2d"),this.modal=document.getElementById("curve-editor-modal"),this.selectedPointIndex=-1,this.draggingPointIndex=-1,this.draggingHandleType=null,this.hoverPointIndex=-1,this.hoverHandleType=null,this.padding=40,this.drawWidth=this.canvas.width-2*this.padding,this.drawHeight=this.canvas.height-2*this.padding,this.scaleX=this.drawWidth,this.initEvents(),this.renderList()}initEvents(){document.getElementById("btn-add-edge-curve").addEventListener("click",()=>this.startNew()),document.getElementById("btn-edit-edge-curve").addEventListener("click",()=>this.startEdit()),document.getElementById("btn-curve-cancel").addEventListener("click",()=>this.close()),document.getElementById("btn-curve-save").addEventListener("click",()=>this.save()),this.canvas.addEventListener("mousedown",e=>this.onMouseDown(e)),this.canvas.addEventListener("mousemove",e=>this.onMouseMove(e)),this.canvas.addEventListener("mouseup",e=>this.onMouseUp(e)),this.canvas.addEventListener("dblclick",e=>this.onDoubleClick(e)),this.canvas.addEventListener("contextmenu",e=>e.preventDefault())}ensureHandles(e){const t=JSON.parse(JSON.stringify(e));return t.forEach((n,i)=>{if(!n.hIn)if(i>0){const r=t[i-1],a=n.x-r.x;n.hIn={x:n.x-a*.25,y:n.y}}else n.hIn={x:n.x-.1,y:n.y};if(!n.hOut)if(i<t.length-1){const a=t[i+1].x-n.x;n.hOut={x:n.x+a*.25,y:n.y}}else n.hOut={x:n.x+.1,y:n.y}}),t}startNew(){this.editingPoints=[{x:0,y:0,hIn:{x:-.1,y:0},hOut:{x:.1,y:0}},{x:1,y:0,hIn:{x:.9,y:0},hOut:{x:1.1,y:0}}];const e={name:`Style ${this.state.edgeStyles.length+1}`,points:this.editingPoints};this.state.edgeStyles.push(e),this.selectedStyleIndex=this.state.edgeStyles.length-1,this.editIndex=this.selectedStyleIndex,this.backupPoints="DELETE",this.selectedPointIndex=-1,this.openModal(),this.updateState()}startEdit(){this.selectedStyleIndex<0||this.selectedStyleIndex>=this.state.edgeStyles.length||(this.backupPoints=JSON.parse(JSON.stringify(this.state.edgeStyles[this.selectedStyleIndex].points)),this.editingPoints=this.ensureHandles(this.state.edgeStyles[this.selectedStyleIndex].points),this.editIndex=this.selectedStyleIndex,this.selectedPointIndex=-1,this.openModal(),this.updateState())}openModal(){this.modal.style.display="flex",this.isEditing=!0,this.draw()}close(){this.backupPoints==="DELETE"?(this.state.edgeStyles.splice(this.editIndex,1),this.selectedStyleIndex=-1,this.state.selectedStyleIndex=-1):this.backupPoints&&(this.state.edgeStyles[this.editIndex].points=this.backupPoints),this.backupPoints=null,this.modal.style.display="none",this.isEditing=!1,this.renderList(),this.requestDraw&&this.requestDraw()}save(){this.editingPoints[0].x!==0&&this.editingPoints.unshift({x:0,y:0,hIn:{x:-.1,y:0},hOut:{x:.1,y:0}}),this.editingPoints[this.editingPoints.length-1].x!==1&&this.editingPoints.push({x:1,y:0,hIn:{x:.9,y:0},hOut:{x:1.1,y:0}}),this.editingPoints[0].x=0,this.editingPoints[0].y=0,this.editingPoints[this.editingPoints.length-1].x=1,this.editingPoints[this.editingPoints.length-1].y=0,this.state.edgeStyles[this.editIndex].points=this.editingPoints,this.backupPoints=null,this.renderList(),this.modal.style.display="none",this.isEditing=!1,this.requestDraw&&this.requestDraw()}updateState(){this.editIndex!==-1&&this.state.edgeStyles[this.editIndex]&&(this.state.edgeStyles[this.editIndex].points=this.editingPoints,this.requestDraw&&this.requestDraw())}renderList(){const e=document.getElementById("edge-curves-list");e.innerHTML="",this.state.edgeStyles.forEach((t,n)=>{const i=document.createElement("div");i.style.padding="4px 8px",i.style.background=n===this.selectedStyleIndex?"rgba(100, 108, 255, 0.3)":"rgba(255,255,255,0.05)",i.style.border="1px solid rgba(255,255,255,0.1)",i.style.borderRadius="4px",i.style.cursor="pointer",i.style.fontSize="0.8rem",i.textContent=t.name,i.onclick=()=>{this.selectedStyleIndex=n,this.state.selectedStyleIndex=n,document.getElementById("btn-edit-edge-curve").disabled=!1,document.getElementById("btn-pick-edge-style").disabled=!1,this.renderList()},e.appendChild(i)}),this.selectedStyleIndex===-1&&(document.getElementById("btn-edit-edge-curve").disabled=!0,document.getElementById("btn-pick-edge-style").disabled=!0)}toCanvas(e){const t=this.padding+e.x*this.drawWidth,i=this.canvas.height/2-e.y*this.scaleX;return{x:t,y:i}}fromCanvas(e){const t=(e.x-this.padding)/this.drawWidth,i=(this.canvas.height/2-e.y)/this.drawWidth;return{x:t,y:i}}draw(){if(!this.isEditing)return;this.ctx.fillStyle="#333",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.strokeStyle="#555",this.ctx.lineWidth=1,this.ctx.beginPath();const e=this.toCanvas({x:0,y:0}),t=this.toCanvas({x:1,y:0});if(this.ctx.moveTo(e.x,e.y),this.ctx.lineTo(t.x,t.y),this.ctx.stroke(),this.ctx.fillStyle="#888",this.drawDot(e,4),this.drawDot(t,4),this.ctx.strokeStyle="#646cff",this.ctx.lineWidth=3,this.ctx.beginPath(),this.editingPoints.length>=2){const n=this.toCanvas(this.editingPoints[0]);this.ctx.moveTo(n.x,n.y);for(let i=0;i<this.editingPoints.length-1;i++){const r=this.editingPoints[i],a=this.editingPoints[i+1],o=this.toCanvas(r.hOut),c=this.toCanvas(a.hIn),l=this.toCanvas(a);this.ctx.bezierCurveTo(o.x,o.y,c.x,c.y,l.x,l.y)}this.ctx.stroke()}this.editingPoints.forEach((n,i)=>{const r=this.toCanvas(n);if(i===this.selectedPointIndex){const c=this.toCanvas(n.hIn),l=this.toCanvas(n.hOut);this.ctx.strokeStyle="#888",this.ctx.lineWidth=1,this.ctx.beginPath(),this.ctx.moveTo(c.x,c.y),this.ctx.lineTo(r.x,r.y),this.ctx.lineTo(l.x,l.y),this.ctx.stroke(),this.ctx.fillStyle="#f0f",this.drawDot(c,4),this.ctx.fillStyle="#0ff",this.drawDot(l,4)}const a=i===this.hoverPointIndex,o=i===this.selectedPointIndex;this.ctx.fillStyle=o?"#ff4":a?"#fff":"#aaa",(i===0||i===this.editingPoints.length-1)&&(this.ctx.fillStyle=o?"#cc4":"#555"),this.drawDot(r,a||o?6:4)})}drawDot(e,t){this.ctx.beginPath(),this.ctx.arc(e.x,e.y,t,0,Math.PI*2),this.ctx.fill()}getMousePos(e){const t=this.canvas.getBoundingClientRect();return{x:e.clientX-t.left,y:e.clientY-t.top}}findPoint(e){if(this.selectedPointIndex!==-1){const n=this.editingPoints[this.selectedPointIndex],i=this.toCanvas(n.hIn),r=this.toCanvas(n.hOut);if(Math.hypot(i.x-e.x,i.y-e.y)<10)return{idx:this.selectedPointIndex,type:"in"};if(Math.hypot(r.x-e.x,r.y-e.y)<10)return{idx:this.selectedPointIndex,type:"out"}}for(let n=0;n<this.editingPoints.length;n++){const i=this.toCanvas(this.editingPoints[n]);if(Math.hypot(i.x-e.x,i.y-e.y)<10)return{idx:n,type:"point"}}return null}onMouseDown(e){const t=this.getMousePos(e),n=this.findPoint(t);if(e.button===2){if(n&&n.type==="point"){const i=n.idx;i!==0&&i!==this.editingPoints.length-1&&(this.editingPoints.splice(i,1),this.selectedPointIndex===i?this.selectedPointIndex=-1:this.selectedPointIndex>i&&this.selectedPointIndex--,this.draw(),this.updateState())}return}if(n)this.selectedPointIndex=n.idx,this.draggingPointIndex=n.idx,this.draggingHandleType=n.type==="point"?null:n.type,this.draw();else{const i=this.fromCanvas(t);if(i.x>0&&i.x<1){const r={x:i.x,y:i.y,hIn:{x:i.x-.05,y:i.y},hOut:{x:i.x+.05,y:i.y}};this.editingPoints.push(r),this.editingPoints.sort((o,c)=>o.x-c.x);const a=this.editingPoints.indexOf(r);this.selectedPointIndex=a,this.draggingPointIndex=a,this.draggingHandleType=null,this.draw(),this.updateState()}else this.selectedPointIndex=-1,this.draw()}}onMouseMove(e){const t=this.getMousePos(e),n=this.findPoint(t);if(this.hoverPointIndex=n&&n.type==="point"?n.idx:-1,this.draggingPointIndex!==-1){const i=this.editingPoints[this.draggingPointIndex],r=this.fromCanvas(t);if(this.draggingHandleType==="in")i.hIn.x=r.x,i.hIn.y=r.y;else if(this.draggingHandleType==="out")i.hOut.x=r.x,i.hOut.y=r.y;else{const a=r.x-i.x,o=r.y-i.y;let c=Math.max(0,Math.min(1,r.x));this.draggingPointIndex!==0&&this.draggingPointIndex!==this.editingPoints.length-1&&(i.x=c,i.y=r.y,i.hIn.x+=a,i.hIn.y+=o,i.hOut.x+=a,i.hOut.y+=o)}this.draw(),this.updateState()}else this.canvas.style.cursor=n?"pointer":"default",this.draw()}onMouseUp(e){this.draggingPointIndex=-1,this.draggingHandleType=null}onDoubleClick(e){const t=this.getMousePos(e),n=this.findPoint(t);n&&n.type==="point"&&n.idx!==0&&n.idx!==this.editingPoints.length-1&&(this.editingPoints.splice(n.idx,1),this.selectedPointIndex=-1,this.draw(),this.updateState())}}function Gp(s){const[e,t]=s[0],[n,i]=s[1],r=e*i-t*n;return Math.abs(r)<1e-9?null:[[i/r,-t/r],[-n/r,e/r]]}function Vp(s,e){let t=Pe.baseMesh.face_colors[s];if(Pe.periodicInfo[s][e].length==0)return"full";const[n,i]=Pe.periodicInfo[s][e];let r=Pe.baseMesh.face_colors[n];return t==r?"full":t==0?"hinge_start":"hinge_end"}function Yp(){let s=0,e=0;for(let t=0;t<Pe.baseMesh.faces.length;t++){let n=Pe.baseMesh.faces[t];for(let i=0;i<n.length;i++){let r=Pe.baseMesh.vertices[n[i]],a=Pe.baseMesh.vertices[n[(i+1)%n.length]];s+=Math.sqrt((r.x-a.x)*(r.x-a.x)+(r.y-a.y)*(r.y-a.y)),e++}}return s/e}function Hp(s,e,t,n,i){const r=s*s,a=r*s,o=1-s,c=o*o,l=c*o,d=l*e.x+3*c*s*t.x+3*o*r*n.x+a*i.x,h=l*e.y+3*c*s*t.y+3*o*r*n.y+a*i.y,u=l*(e.z||0)+3*c*s*(t.z||0)+3*o*r*(n.z||0)+a*(i.z||0);return{x:d,y:h,z:u}}function zo(s,e={}){const{repX:t=1,repY:n=1,bbox:i=null,edgeStyles:r=[],edgeStyleMap:a={},periodicInfo:o=null,averageEdgeSizeMm:c=40,hingeSizeMm:l=2,filename:d="kirigami.svg"}=e;let h="",u=0,m=[],x=[],p=[],f=[],y=[],w=[],_=[],S=(ne,oe)=>{for(let le=0;le<_.length;le++){let ue=_[le];if(Math.hypot(ue[0].x-ne.x,ue[0].y-ne.y)<.01&&Math.hypot(ue[1].x-oe.x,ue[1].y-oe.y)<.01)return f[le]=!1,!1}return!0},b=(ne,oe)=>{for(let le=0;le<x.length;le++){let ue=x[le];if(Math.hypot(ue[0].x-ne.x,ue[0].y-ne.y)<1e-4&&Math.hypot(ue[1].x-oe.x,ue[1].y-oe.y)<1e-4)return f[le]=!1,!0}return!1},I=Yp(),O=c/I,v=l,D,R,K,q,L=1/0,C=1/0,W=-1/0,Q=-1/0,$=ne=>{L=Math.min(L,m[ne].x),C=Math.min(C,m[ne].y),W=Math.max(W,m[ne].x),Q=Math.max(Q,m[ne].y)},Y=()=>{$(u),u++},ee=!1;if(i){ee=!0;const{minX:ne,maxX:oe,minY:le,maxY:ue}=i,xe=Gp(Pe.baseMesh.periodicity);if(!xe)D=0,R=0,K=0,q=0;else{const _e=[{x:ne,y:le},{x:oe,y:le},{x:oe,y:ue},{x:ne,y:ue}];let ye=1/0,we=-1/0,Ie=1/0,je=-1/0;_e.forEach(Le=>{const Se=Le.x*xe[0][0]+Le.y*xe[0][1],Te=Le.x*xe[1][0]+Le.y*xe[0][1];ye=Math.min(ye,Se),we=Math.max(we,Se),Ie=Math.min(Ie,Te),je=Math.max(je,Te)});const Ae=1.5;D=Math.floor(ye-Ae),R=Math.ceil(we+Ae),K=Math.floor(Ie-Ae),q=Math.ceil(je+Ae)}}else D=0,R=t-1,K=0,q=n-1;let se=ne=>{let[oe,le]=x[ne],[ue,xe]=p[ne],_e=y[ne],[ye,we]=w[ne];f[ne]&&(_e="full");const Ie=[];let je=Math.sqrt((le.x-oe.x)**2+(le.y-oe.y)**2);const Ae=`${ue}_${xe}`,{styleIdx:Le,flip:Se}=a[Ae]||{styleIdx:void 0,flip:0};if(Le!==void 0&&r[Le]){let Te=[];const He=r[Le].points,M=s.vertices[ue],g=s.vertices[xe];let E=Se%2==1,P=Math.floor(Se/2)==1^E,k=E?M:g,H=E?g:M;const X={x:k.x+ye,y:k.y+we,z:k.z||0},A={x:H.x+ye,y:H.y+we,z:H.z||0},N=A.x-X.x,ie=A.y-X.y,ae=A.z-X.z,he=-ie,ge=N,pe=j=>({x:X.x+j.x*N-(P?-1:1)*j.y*he,y:X.y+j.x*ie-(P?-1:1)*j.y*ge,z:X.z+j.x*ae}),ve=j=>{const Z=pe(j);return j.hIn?Z.hIn=pe(j.hIn):Z.hIn={...Z},j.hOut?Z.hOut=pe(j.hOut):Z.hOut={...Z},Z},Ee=He.map(ve),ze=E?Ee:Ee.slice().reverse(),z=[];for(let j=0;j<ze.length-1;j++){const Z=ze[j],fe=ze[j+1],Me=E?Z.hOut:Z.hIn,Re=E?fe.hIn:fe.hOut,We=10,nt=j==ze.length-2?We+1:We;for(let dt=0;dt<nt;dt++){const qe=dt/We,it=Hp(qe,Z,Me,Re,fe);_e==="hinge_start"&&Math.hypot(it.x*O-oe.x,it.y*O-oe.y)<v||_e==="hinge_end"&&Math.hypot(it.x*O-le.x,it.y*O-le.y)<v||(m.push({x:it.x*O,y:it.y*O}),z.push(u),Y())}}Te=z,Te.forEach(j=>Ie.push(j))}else _e==="full"?(m.push(oe),Ie.push(u),Y(),m.push(le),Ie.push(u),Y()):_e==="hinge_start"?(m.push({x:oe.x+(le.x-oe.x)*v/je,y:oe.y+(le.y-oe.y)*v/je}),Ie.push(u),Y(),m.push(le),Ie.push(u),Y()):_e==="hinge_end"?(m.push(oe),Ie.push(u),Y(),m.push({x:le.x-(le.x-oe.x)*v/je,y:le.y-(le.y-oe.y)*v/je}),Ie.push(u),Y()):console.log("Unknown cutting type");h+=`<polyline points="${Ie.map(Te=>`${m[Te].x},${m[Te].y}`).join(" ")}" stroke="red" stroke-width="0.01" fill="none" />`};const ce=Pe.baseMesh.faces.flatMap(ne=>ne).map(ne=>Pe.baseMesh.vertices[ne]);for(let ne=D;ne<=R;ne++)for(let oe=K;oe<=q;oe++){const le=s.periodicity[0],ue=s.periodicity[1],xe=le[0]*ne+ue[0]*oe,_e=le[1]*ne+ue[1]*oe,ye=Pe.baseMesh.periodicity[0].map(Ae=>Ae*ne),we=Pe.baseMesh.periodicity[1].map(Ae=>Ae*oe),Ie=ee?Pe.baseMesh.vertices.map(Ae=>({x:Ae.x+ye[0]+we[0],y:Ae.y+ye[1]+we[1]})):null;let je=Ae=>Pe.renderMode==="bbox"?Ae.x>=i.minX&&Ae.x<=i.maxX&&Ae.y>=i.minY&&Ae.y<=i.maxY:Math.hypot(Ae.x-Pe.circleShiftX,Ae.y-Pe.circleShiftY)<=Pe.circleRadius;for(let Ae=0;Ae<s.faces.length;Ae++){const Le=s.faces[Ae];if(ee){let Se=!0;for(const Te of Pe.baseMesh.faces[Ae]){const Ke=Ie[Te];if(!je(Ke)){Se=!1;break}}if(!Se)continue}for(let Se=0;Se<Le.length;Se++){let Te=Vp(Ae,Se);const Ke=Le[Se],He=Le[(Se+1)%Le.length];let M=X=>({x:(X.x+xe)*O,y:(X.y+_e)*O}),g=M(s.vertices[Ke]),E=M(s.vertices[He]),P=X=>({x:X.x+ye[0]+we[0],y:X.y+ye[1]+we[1]}),k=P(ce[Ke]),H=P(ce[He]);b(E,g)||(f.push(S(H,k)),x.push([g,E]),_.push([k,H]),p.push([Ke,He]),y.push(Te),w.push([xe,_e]))}}}for(let ne=0;ne<x.length;ne++)se(ne);let V=`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W-L}mm" height="${Q-C}mm" viewBox="${L} ${C} ${W-L} ${Q-C}">`;h+="</svg>";const re=new Blob([V+h],{type:"image/svg+xml"}),de=URL.createObjectURL(re),U=document.createElement("a");U.href=de,U.download=d,U.click(),URL.revokeObjectURL(de)}function Wp(s,e,t){let n=new Bp(e,t);const i=document.getElementById("rep-x"),r=document.getElementById("rep-y"),a=document.getElementById("rep-x-val"),o=document.getElementById("rep-y-val"),c=document.getElementById("deploy-angle"),l=document.getElementById("deploy-angle-val"),d=document.getElementById("chk-show-indices"),h=document.getElementById("chk-show-base-mesh"),u=document.getElementById("upload-drop-zone"),m=document.getElementById("kernel-controls"),x=document.getElementById("periodicity-controls"),p=document.getElementById("btn-conformalize"),f=document.getElementsByName("render-mode"),y=document.getElementById("bbox-controls"),w=document.getElementById("bbox-width"),_=document.getElementById("bbox-height"),S=document.getElementById("svg-average-edge-size"),b=document.getElementById("svg-average-edge-size-val"),I=document.getElementById("svg-hinge-size"),O=document.getElementById("svg-hinge-size-val"),v=document.getElementById("circle-controls");f.forEach(M=>{M.addEventListener("change",g=>{e.renderMode=g.target.value;const E=document.getElementById("repetition-controls");e.renderMode==="bbox"?(y.style.display="flex",E.style.display="none",v.style.display="none"):e.renderMode==="circle"?(y.style.display="none",E.style.display="none",v.style.display="flex"):(y.style.display="none",E.style.display="flex",v.style.display="none"),t()})}),w.addEventListener("input",M=>{e.bboxWidth=parseFloat(M.target.value)||10,t()}),_.addEventListener("input",M=>{e.bboxHeight=parseFloat(M.target.value)||10,t()});const D=(M,g,E,P,k)=>{const H=X=>{const A=parseFloat(X),N=Number.isFinite(A)?A:P;e[E]=N,M.value=N,g.value=N,k()};M.addEventListener("input",X=>H(X.target.value)),g.addEventListener("input",X=>H(X.target.value))};D(S,b,"svgAverageEdgeSizeMm",40,()=>t()),D(I,O,"svgHingeSizeMm",2,()=>t()),document.getElementById("circle-radius").addEventListener("input",M=>{e.circleRadius=parseFloat(M.target.value)||10,t()}),document.getElementById("circle-shift-x").addEventListener("input",M=>{e.circleShiftX=parseFloat(M.target.value)||0,t()}),document.getElementById("circle-shift-y").addEventListener("input",M=>{e.circleShiftY=parseFloat(M.target.value)||0,t()});const R=()=>{if(x.innerHTML="",e.baseMesh&&e.baseMesh.periodicity){const M=document.createElement("details");M.open=!1,M.style.width="100%";const g=document.createElement("summary");g.textContent="Periodicity (2x2)",g.style.cursor="pointer",g.style.fontSize="0.8rem",g.style.marginBottom="8px",g.style.userSelect="none",M.appendChild(g);const E=document.createElement("div");E.style.display="grid",E.style.gridTemplateColumns="1fr 1fr",E.style.gap="8px",E.style.paddingLeft="8px";const P=(H,X,A)=>{const N=document.createElement("div");N.style.display="flex",N.style.alignItems="center",N.style.gap="4px";const ie=document.createElement("input");ie.type="range",ie.min="-5",ie.max="5",ie.step="0.1",ie.value=A,ie.style.width="100%";const ae=document.createElement("span");return ae.style.fontSize="0.7rem",ae.style.width="35px",ae.style.textAlign="right",ae.textContent=A.toFixed(1),ie.addEventListener("input",async he=>{const ge=parseFloat(he.target.value);ae.textContent=ge.toFixed(1);let pe=JSON.parse(JSON.stringify(e.baseMesh.periodicity));pe[H][X]=ge;let ve=await el(e.baseMesh,pe);q(ve,!1);const Ee=e.deployAngle*Math.PI/180;e.mesh=await st(e.baseMesh,Ee,e.alignUnitParallelogram),e.mesh.face_colors=e.baseMesh.face_colors,t()}),N.appendChild(ie),N.appendChild(ae),N},k=(H,X)=>{const A=document.createElement("div");A.style.display="flex",A.style.flexDirection="column",A.style.marginBottom="4px";const N=document.createElement("span");return N.textContent=H,N.style.fontSize="0.7rem",N.style.color="#aaa",A.appendChild(N),A.appendChild(X),A};E.appendChild(k("Px X",P(0,0,e.baseMesh.periodicity[0][0]))),E.appendChild(k("Px Y",P(0,1,e.baseMesh.periodicity[0][1]))),E.appendChild(k("Py X",P(1,0,e.baseMesh.periodicity[1][0]))),E.appendChild(k("Py Y",P(1,1,e.baseMesh.periodicity[1][1]))),M.appendChild(E),x.appendChild(M)}},K=(M=!1)=>{if((!M||!e.baseMesh.originalVertices)&&(e.baseMesh.originalVertices=JSON.parse(JSON.stringify(e.baseMesh.vertices))),m.style.display="none",e.baseMesh&&e.baseMesh.kernel&&e.baseMesh.kernel.length>0){m.style.display="flex",m.children.length>0&&(m.innerHTML=""),(e.kernelWeights.length!==e.baseMesh.kernel.length||e.kernelWeights.length>0&&!Array.isArray(e.kernelWeights[0]))&&(e.kernelWeights=Array.from({length:e.baseMesh.kernel.length},()=>[0,0]));const g=document.createElement("details");g.style.width="100%";const E=document.createElement("summary");E.textContent=`Kernel Controls (${e.baseMesh.kernel.length})`,E.style.cursor="pointer",E.style.fontSize="0.8rem",E.style.marginBottom="8px",E.style.userSelect="none",g.appendChild(E);const P=document.createElement("div");P.style.display="flex",P.style.flexDirection="column",P.style.gap="12px",P.style.paddingLeft="8px",e.baseMesh.kernel.forEach((k,H)=>{const X=document.createElement("div");X.style.display="flex",X.style.flexDirection="column",X.style.gap="4px";const A=document.createElement("span");A.style.fontSize="0.8rem",A.style.fontWeight="bold",A.textContent=`Kernel ${H}:`,X.appendChild(A);const N=(ie,ae)=>{const he=document.createElement("div");he.style.display="flex",he.style.alignItems="center",he.style.gap="8px";const ge=document.createElement("span");ge.style.fontSize="0.7rem",ge.style.width="15px",ge.textContent=ae;const pe=document.createElement("input");pe.type="range",pe.min="-1",pe.max="1",pe.step="0.01",pe.value=e.kernelWeights[H][ie],pe.style.flex="1";const ve=document.createElement("span");return ve.style.fontSize="0.7rem",ve.style.width="30px",ve.style.textAlign="right",ve.textContent=e.kernelWeights[H][ie],pe.addEventListener("input",Ee=>{const ze=parseFloat(Ee.target.value);e.kernelWeights[H][ie]=ze,ve.textContent=ze,L()}),he.appendChild(ge),he.appendChild(pe),he.appendChild(ve),he};X.appendChild(N(0,"X")),X.appendChild(N(1,"Y")),P.appendChild(X)}),g.appendChild(P),m.appendChild(g)}else e.kernelWeights=[]},q=async(M,g=!0,E=!0)=>{e.baseMesh||(e.baseMesh={}),Object.assign(e.baseMesh,JSON.parse(JSON.stringify(M))),Sl(e.baseMesh),E&&(e.unitPatternBaseMesh=JSON.parse(JSON.stringify(e.baseMesh))),e.baseMesh.originalVertices=JSON.parse(JSON.stringify(e.baseMesh.vertices)),e.periodicInfo=await gl(e.baseMesh);let P=await nr(e.baseMesh,e.detectCollisions);e.max_angle=P,c.max=Math.round(P/Math.PI*180),c.value=Math.min(c.value,c.max),e.deployAngle=c.value,l.value=e.deployAngle,e.mesh=await st(e.baseMesh,e.deployAngle*Math.PI/180,e.alignUnitParallelogram),t(),K(),g&&R()},L=async()=>{if(!e.baseMesh||!e.baseMesh.kernel)return;e.baseMesh.originalVertices||(e.baseMesh.originalVertices=JSON.parse(JSON.stringify(e.baseMesh.vertices))),e.baseMesh.vertices=JSON.parse(JSON.stringify(e.baseMesh.originalVertices));for(let g=0;g<e.baseMesh.kernel.length;g++){const E=e.kernelWeights[g];if(E[0]===0&&E[1]===0)continue;const P=e.baseMesh.kernel[g];for(let k=0;k<e.baseMesh.vertices.length;k++)e.baseMesh.vertices[k].x+=P[k]*E[0],e.baseMesh.vertices[k].y+=P[k]*E[1]}const M=e.deployAngle*Math.PI/180;e.mesh=await st(e.baseMesh,M,e.alignUnitParallelogram),e.mesh.face_colors=e.baseMesh.face_colors,t()};s.addEventListener("mousedown",M=>{M.shiftKey&&(e.isDragging=!0,s.style.cursor="grabbing"),e.lastMouse={x:M.clientX,y:M.clientY},e.dragStart={x:M.clientX,y:M.clientY}}),window.addEventListener("mousemove",M=>{if(e.isDragging){const g=M.clientX-e.lastMouse.x,E=M.clientY-e.lastMouse.y;e.camera.x-=g/e.camera.zoom,e.camera.y+=E/e.camera.zoom,e.lastMouse={x:M.clientX,y:M.clientY},t()}});const C=document.getElementById("btn-pick-edge-style");C.addEventListener("click",()=>{e.isPickingEdge=!e.isPickingEdge,C.style.background=e.isPickingEdge?"#4a54ff":"",C.textContent=e.isPickingEdge?"Stop Picking":"Apply to Edge"}),window.addEventListener("mouseup",async M=>{e.isDragging=!1,s.style.cursor="default";const g=M.clientX-e.dragStart.x,E=M.clientY-e.dragStart.y;if(Math.hypot(g,E)<5&&e.mesh){const P=s.getBoundingClientRect(),k=M.clientX-P.left,H=M.clientY-P.top,X=window.innerWidth/2,A=window.innerHeight/2,N=e.camera.x+(k-X)/e.camera.zoom,ie=e.camera.y+(A-H)/e.camera.zoom,ae={x:N,y:ie};if(e.isPickingEdge){let he=1/0,ge=null,pe=-1,ve=-1;const Ee=.5/(e.camera.zoom/ke.defaultZoom),ze=(j,Z,fe)=>{const Me=(Z.x-fe.x)**2+(Z.y-fe.y)**2;if(Me==0)return Math.hypot(j.x-Z.x,j.y-Z.y);let Re=((j.x-Z.x)*(fe.x-Z.x)+(j.y-Z.y)*(fe.y-Z.y))/Me;return Re=Math.max(0,Math.min(1,Re)),Math.hypot(j.x-(Z.x+Re*(fe.x-Z.x)),j.y-(Z.y+Re*(fe.y-Z.y)))};for(let j=0;j<e.mesh.faces.length;j++){const Z=e.mesh.faces[j];for(let fe=0;fe<Z.length;fe++){const Me=Z[fe],Re=Z[(fe+1)%Z.length],We=e.mesh.vertices[Me],nt=e.mesh.vertices[Re],dt=ze(ae,We,nt);dt<he&&(he=dt,ge=[Me,Re],pe=j,ve=fe)}}let z=(j,Z)=>{if(e.periodicInfo[j][Z].length==0)return"";const[fe,Me]=e.periodicInfo[j][Z];let Re=e.mesh.faces[fe][Me],We=e.mesh.faces[fe][(Me+1)%e.mesh.faces[fe].length];return`${Re}_${We}`};if(he<Ee&&ge){const j=`${ge[0]}_${ge[1]}`,Z=z(pe,ve);if(e.edgeStyleMap[j]){let{styleIdx:fe,flip:Me}=e.edgeStyleMap[j];fe!=e.selectedStyleIndex?(e.edgeStyleMap[j]={styleIdx:e.selectedStyleIndex,flip:0},e.edgeStyleMap[Z]={styleIdx:e.selectedStyleIndex,flip:3}):Me<3?(e.edgeStyleMap[j]={styleIdx:fe,flip:Me+1},e.edgeStyleMap[Z]={styleIdx:fe,flip:3-(Me+1)}):(e.edgeStyleMap[j]=void 0,e.edgeStyleMap[Z]=void 0)}else e.edgeStyleMap[j]={styleIdx:e.selectedStyleIndex,flip:0},e.edgeStyleMap[Z]={styleIdx:e.selectedStyleIndex,flip:3};t()}return}for(let he=e.mesh.faces.length-1;he>=0;he--)if(W(ae,e.mesh,he)){const ge=(e.baseMesh.face_colors[he]+1)%(e.enableThirdColor?3:2);if(e.baseMesh.face_colors[he]=ge,e.deployAngle&&e.deployAngle!==0){const pe=e.deployAngle*Math.PI/180,ve=await st(e.baseMesh,pe,e.alignUnitParallelogram);ve.face_colors=e.baseMesh.face_colors,ve.width=e.baseMesh.width,ve.height=e.baseMesh.height,e.mesh=ve}else e.mesh.face_colors[he]=ge;t();return}}});function W(M,g,E){const P=g.faces[E],k=g.vertices,H=M.x,X=M.y;let A=!1;for(let N=0,ie=P.length-1;N<P.length;ie=N++){const ae=k[P[N]].x,he=k[P[N]].y,ge=k[P[ie]].x,pe=k[P[ie]].y;he>X!=pe>X&&H<(ge-ae)*(X-he)/(pe-he)+ae&&(A=!A)}return A}s.addEventListener("wheel",M=>{M.preventDefault();const g=M.deltaY<0?1:-1,E=1+ke.zoomSensitivity*g,P=s.getBoundingClientRect(),k=M.clientX-P.left,H=M.clientY-P.top,X=window.innerWidth/2,A=window.innerHeight/2,N=e.camera.x+(k-X)/e.camera.zoom,ie=e.camera.y+(A-H)/e.camera.zoom;let ae=e.camera.zoom*E;ae=Math.max(ke.minZoom,Math.min(ke.maxZoom,ae)),e.camera.zoom=ae,e.camera.x=N-(k-X)/ae,e.camera.y=ie-(A-H)/ae,t()},{passive:!1}),document.getElementById("btn-zoom-in").addEventListener("click",()=>{e.camera.zoom=Math.min(ke.maxZoom,e.camera.zoom*1.2),t()}),document.getElementById("btn-zoom-out").addEventListener("click",()=>{e.camera.zoom=Math.max(ke.minZoom,e.camera.zoom/1.2),t()}),document.getElementById("btn-reset").addEventListener("click",()=>{e.camera.x=0,e.camera.y=0,e.camera.zoom=ke.defaultZoom,t()}),document.getElementById("btn-replicate-2x2").addEventListener("click",async()=>{if(!e.mesh)return;let M=await tr(e.baseMesh);q(M),e.baseMesh.face_colors=await gi(e.baseMesh),e.mesh=await st(e.baseMesh,e.deployAngle*Math.PI/180,e.alignUnitParallelogram),e.mesh.face_colors=e.baseMesh.face_colors,t()}),document.getElementById("btn-test-make-deployable").addEventListener("click",async()=>{const M=document.getElementById("chk-map-to-unit-disk").checked;let g=await Mi(e.baseMesh,M);q(g),e.mesh=await st(e.baseMesh,e.deployAngle*Math.PI/180,e.alignUnitParallelogram),e.mesh.face_colors=e.baseMesh.face_colors,t()}),document.getElementById("btn-dual").addEventListener("click",async()=>{let M=await tl(e.baseMesh);q(M),e.mesh=await st(e.baseMesh,e.deployAngle*Math.PI/180,e.alignUnitParallelogram),e.mesh.face_colors=e.baseMesh.face_colors,t()}),document.getElementById("btn-find-colorings").addEventListener("click",async()=>{const M=document.getElementById("coloring-controls");M.innerHTML="",M.style.display="none";const g=await nl(e.baseMesh);if(g.colorings&&g.colorings.length>0){e.baseMesh.colorings=g.colorings,g.face_colors&&g.face_colors.length>0&&(e.baseMesh.face_colors=g.face_colors),M.style.display="flex";const P=document.createElement("span");P.textContent=`Found ${g.colorings.length} colorings:`,P.style.fontSize="0.8rem",P.style.marginBottom="4px",M.appendChild(P);const k=document.createElement("select");k.style.width="100%",k.style.background="#222",k.style.color="white",k.style.border="1px solid #444",k.style.padding="4px",g.colorings.forEach((H,X)=>{const A=document.createElement("option");A.value=X,A.textContent=`Coloring ${X+1}`,k.appendChild(A)}),k.addEventListener("change",async H=>{const X=parseInt(H.target.value);e.baseMesh.face_colors=e.baseMesh.colorings[X];const A=e.deployAngle*Math.PI/180;e.mesh=await st(e.baseMesh,A,e.alignUnitParallelogram),e.mesh.face_colors=e.baseMesh.face_colors,t()}),M.appendChild(k)}else alert("No valid colorings found.");const E=e.deployAngle*Math.PI/180;e.mesh=await st(e.baseMesh,E,e.alignUnitParallelogram),e.mesh.face_colors=e.baseMesh.face_colors,t()}),document.getElementById("btn-deploy-unit-with-holes").addEventListener("click",async()=>{const M=e.deployAngle*Math.PI/180;e.mesh=await il(e.baseMesh,M),t()}),document.getElementById("btn-export-svg").addEventListener("click",()=>{if(!e.mesh)return;const M=prompt("Enter filename for export:","tessellation_export");if(!M)return;const g={};if(e.renderMode==="bbox"){const E=e.bboxWidth||10,P=e.bboxHeight||10;g.bbox={minX:-E/2,maxX:E/2,minY:-P/2,maxY:P/2}}else e.renderMode==="circle"?g.bbox={minX:-e.circleRadius,maxX:e.circleRadius,minY:-e.circleRadius,maxY:e.circleRadius}:(g.repX=e.repX,g.repY=e.repY);zo(e.mesh,{...g,edgeStyles:e.edgeStyles,edgeStyleMap:e.edgeStyleMap,periodicInfo:e.periodicInfo,averageEdgeSizeMm:e.svgAverageEdgeSizeMm,hingeSizeMm:e.svgHingeSizeMm,filename:`${M}.svg`})}),document.getElementById("btn-export-fabrication-svg").addEventListener("click",async()=>{let M=await Os();M.ground.periodicity=[[0,0],[0,0]];const g=prompt("Enter filename for export:","tessellation_export");if(!g)return;const E={};E.repX=1,E.repY=1,zo(M.ground,{...E,edgeStyles:e.edgeStyles,edgeStyleMap:e.edgeStyleMap,periodicInfo:e.periodicInfo,averageEdgeSizeMm:e.svgAverageEdgeSizeMm,hingeSizeMm:e.svgHingeSizeMm,filename:`${g}.svg`})}),document.getElementById("btn-export-obj").addEventListener("click",()=>{if(!e.mesh)return;const M=prompt("Enter filename for export:","tessellation_export");if(!M)return;const g={mtlFileName:`${M}.mtl`};if(e.renderMode==="bbox"){const ae=e.bboxWidth||10,he=e.bboxHeight||10;g.bbox={minX:-ae/2,maxX:ae/2,minY:-he/2,maxY:he/2}}else e.renderMode==="circle"?g.bbox={minX:-e.circleRadius,maxX:e.circleRadius,minY:-e.circleRadius,maxY:e.circleRadius}:(g.repX=e.repX,g.repY=e.repY);const{obj:E,mtl:P}=ko(e.baseMesh,{...g,edgeStyles:e.edgeStyles,edgeStyleMap:e.edgeStyleMap,periodicInfo:e.periodicInfo}),k=new Blob([E],{type:"text/plain"}),H=URL.createObjectURL(k),X=document.createElement("a");X.href=H,X.download=`${M}.obj`,document.body.appendChild(X),X.click(),document.body.removeChild(X),URL.revokeObjectURL(H);const A=new Blob([P],{type:"text/plain"}),N=URL.createObjectURL(A),ie=document.createElement("a");ie.href=N,ie.download=`${M}.mtl`,document.body.appendChild(ie),ie.click(),document.body.removeChild(ie),URL.revokeObjectURL(N)}),document.getElementById("btn-export-ukp").addEventListener("click",()=>{if(!e.baseMesh)return;const M=Al(e.baseMesh),g=new Blob([M],{type:"text/plain"}),E=URL.createObjectURL(g),P=document.createElement("a");P.href=E,P.download="unit_pattern.ukp",document.body.appendChild(P),P.click(),document.body.removeChild(P),URL.revokeObjectURL(E)}),document.getElementById("mtl-brightness").addEventListener("input",M=>{e.mtlBrightness=parseFloat(M.target.value),t()}),document.getElementById("mtl-interpolation").addEventListener("input",M=>{e.mtlInterpolation=parseFloat(M.target.value),t()}),document.getElementById("btn-restore-unit-pattern").addEventListener("click",async()=>{e.unitPatternBaseMesh&&(e.baseMesh=JSON.parse(JSON.stringify(e.unitPatternBaseMesh)),e.mesh=await st(e.baseMesh,e.deployAngle*Math.PI/180,e.alignUnitParallelogram),t())}),document.getElementById("btn-save-state").addEventListener("click",()=>{const M={...e};delete M.viewer3D;const g=JSON.stringify(M),E=new Blob([g],{type:"application/json"}),P=URL.createObjectURL(E),k=document.createElement("a");k.href=P,k.download="kirigami_state.json",document.body.appendChild(k),k.click(),document.body.removeChild(k),URL.revokeObjectURL(P)});const Q=M=>{if(!M)return;const g=new FileReader;g.onload=async E=>{try{const P=JSON.parse(E.target.result);wa(),Object.assign(e,P),e.viewer3D=null,i.value=e.repX,a.textContent=e.repX,r.value=e.repY,o.textContent=e.repY,c.value=e.deployAngle,l.value=e.deployAngle,d.checked=e.showIndices,h.checked=e.showBaseMesh,de.checked=e.enableThirdColor,document.getElementById("chk-show-unit-parallelogram").checked=e.showUnitParallelogram,document.getElementById("chk-align-unit-parallelogram").checked=e.alignUnitParallelogram,document.getElementById("chk-split-screen").checked=e.splitScreen,document.getElementById("chk-detect-collisions").checked=e.detectCollisions||!1;const k=document.getElementById("scale");k&&(k.value=e.scale);const H=document.getElementById("rotation");H&&(H.value=e.rotation);const X=document.getElementById("btn-lift");X&&e.targetMesh&&(X.disabled=!1),w.value=e.bboxWidth||20,_.value=e.bboxHeight||20,S.value=e.svgAverageEdgeSizeMm??40,b.value=e.svgAverageEdgeSizeMm??40,I.value=e.svgHingeSizeMm??2,O.value=e.svgHingeSizeMm??2,f.forEach(ie=>{ie.value===e.renderMode&&(ie.checked=!0)});const A=document.getElementById("repetition-controls");e.renderMode==="bbox"?(y.style.display="flex",A.style.display="none",v.style.display="none"):e.renderMode==="circle"?(y.style.display="none",A.style.display="none",v.style.display="flex"):(y.style.display="none",A.style.display="flex",v.style.display="none");const N=document.getElementById("split-view-container");if(e.splitScreen){N.style.display="block";const ie=document.getElementById("chk-split-screen");ie&&(ie.checked=e.splitScreen)}else{const ie=document.getElementById("chk-split-screen");ie&&(ie.checked=!1),N.style.display="none"}if(setTimeout(()=>{window.dispatchEvent(new Event("resize"))},0),K(!0),R(),e.baseMesh){e.baseMesh.originalVertices||(e.baseMesh.originalVertices=JSON.parse(JSON.stringify(e.baseMesh.vertices)));const ie=e.deployAngle*Math.PI/180;e.optimizedGround?e.mesh=e.optimizedGround:e.mesh=await st(e.baseMesh,ie,e.alignUnitParallelogram),e.mesh.face_colors=e.baseMesh.face_colors,t(),e.unitPatternBaseMesh||(e.unitPatternBaseMesh=JSON.parse(JSON.stringify(e.baseMesh)))}if(e.splitScreen&&e.targetMesh){const ie=document.getElementById("split-view-content");e.viewer3D||(e.viewer3D=new ji(ie)),e.optimizedLifted?e.viewer3D.updateMesh(e.optimizedLifted):e.viewer3D.updateMesh(e.targetMesh)}n.renderList()}catch(P){console.error("Failed to load state",P),alert("Failed to load state file.")}},g.readAsText(M)},$=document.getElementById("file-load-state");document.getElementById("btn-load-state").addEventListener("click",()=>{$.click()}),$.addEventListener("change",M=>{const g=M.target.files[0];Q(g),$.value=""});const Y=async M=>{const g=new FileReader;g.onload=async E=>{const P=E.target.result;e.color_map=xl(P),t()},g.readAsText(M)},ee=async M=>{const g=new FileReader;g.onload=async E=>{const P=E.target.result,k=qi(P),H=await Ja(k);(H.periodicity[0][0]!=0||H.periodicity[0][1]!=0)&&(k.vertices=H.vertices,k.faces=H.faces),k.periodicity=H.periodicity,k.face_colors.length==0&&(k.face_colors=await gi(k)),ir(k),e.deployAngle=0,c.value=0,l.value=0,e.mesh=k,q(k),e.camera.x=0,e.camera.y=0,e.mesh=await st(e.baseMesh,e.deployAngle*Math.PI/180,e.alignUnitParallelogram),t()},g.readAsText(M)},se=async M=>{e.mesh=_l(M),ir(e.mesh),e.mesh.repX>1&&(e.mesh=await tr(e.mesh)),(!e.mesh.face_colors||e.mesh.face_colors.length==0)&&(e.mesh.face_colors=await gi(e.mesh)),e.baseMesh={},q(e.mesh),t()},ce=async M=>{const g=new FileReader;g.onload=async E=>{const P=E.target.result;await se(P)},g.readAsText(M)},V=Object.assign({"/data/unit_patterns/3.12.12-star.ukp":Ta,"/data/unit_patterns/3.12.12.ukp":Da,"/data/unit_patterns/3.12.12;3.4.3.12.ukp":Ea,"/data/unit_patterns/3.12.12;3.4.3.12_fully_closed.ukp":Ia,"/data/unit_patterns/3.3.3.3.6.ukp":Na,"/data/unit_patterns/3.3.3.4.4;3.3.4.3.4.ukp":Ca,"/data/unit_patterns/3.3.3.4.4;3.3.4.3.4_dual.ukp":La,"/data/unit_patterns/3.3.4.3.4.ukp":za,"/data/unit_patterns/3.4.4.6;3.6.3.6.ukp":Oa,"/data/unit_patterns/3.4.6.4.ukp":Pa,"/data/unit_patterns/3.4.6.4;3.3.3.4.4_maomao.ukp":Ra,"/data/unit_patterns/3.4.6.4;3.3.4.3.4.ukp":Ua,"/data/unit_patterns/3^6;3.3.4.3.4.ukp":ka,"/data/unit_patterns/3^6;3.3.6.6.ukp":ja,"/data/unit_patterns/4.6.12.ukp":Fa,"/data/unit_patterns/4.6.12_fully_closed.ukp":Ba,"/data/unit_patterns/4.8.8.ukp":Ga,"/data/unit_patterns/6.3.6.3.ukp":Va,"/data/unit_patterns/arrow.ukp":Ya,"/data/unit_patterns/box.ukp":Ha,"/data/unit_patterns/box_star_fully_closed.ukp":Wa,"/data/unit_patterns/cairo.ukp":Qa,"/data/unit_patterns/cario_fully_closed.ukp":Ka,"/data/unit_patterns/hexagon.ukp":Xa,"/data/unit_patterns/squares_and_diagonals.ukp":Za}),re=document.getElementById("pattern-list");if(re){re.innerHTML="";for(const M in V){const g=M.split("/").pop(),E=V[M],P=document.createElement("div");P.textContent=g,P.style.cursor="pointer",P.style.fontSize="0.8rem",P.style.padding="4px",P.style.width="100%",P.style.borderBottom="1px solid #333",P.addEventListener("mouseenter",()=>P.style.background="#333"),P.addEventListener("mouseleave",()=>P.style.background="transparent"),P.addEventListener("click",async()=>{try{const k=await fetch(E);if(!k.ok)throw new Error(`Failed to fetch ${E}`);const H=await k.text();await se(H);return}catch(k){console.error(k)}}),re.appendChild(P)}}u.addEventListener("dragover",M=>{M.preventDefault(),u.classList.add("drag-over")}),u.addEventListener("dragleave",M=>{M.preventDefault(),u.classList.remove("drag-over")}),u.addEventListener("drop",M=>{M.preventDefault(),u.classList.remove("drag-over");const g=M.dataTransfer.files[0];if(!g)return;const E=g.name.split(".").pop().toLowerCase();E==="obj"?ee(g):E==="ukp"?ce(g):E==="mtl"?Y(g):E==="json"?Q(g):alert("Unsupported file format. Please upload .obj or .ukp files.")}),i.addEventListener("input",M=>{e.repX=parseInt(M.target.value,10),a.textContent=e.repX,t()}),r.addEventListener("input",M=>{e.repY=parseInt(M.target.value,10),o.textContent=e.repY,t()}),D(c,l,"deployAngle",0,async()=>{let M=e.deployAngle;if(e.baseMesh){let g=M*Math.PI/180;g=Math.min(g,e.max_angle);let E=await st(e.baseMesh,g,e.alignUnitParallelogram);E.face_colors=e.baseMesh.face_colors,e.mesh=E,t()}}),document.getElementById("chk-detect-collisions").addEventListener("change",async M=>{if(e.detectCollisions=M.target.checked,e.baseMesh){let g=await nr(e.baseMesh,e.detectCollisions);e.max_angle=g;const E=Math.round(g/Math.PI*180);c.max=E,e.deployAngle>E&&(e.deployAngle=E,c.value=E,l.value=E);let P=e.deployAngle*Math.PI/180,k=await st(e.baseMesh,P,e.alignUnitParallelogram);k.face_colors=e.baseMesh.face_colors,e.mesh=k,t()}}),d.addEventListener("change",M=>{e.showIndices=M.target.checked,t()}),document.getElementById("chk-show-unit-parallelogram").addEventListener("change",async M=>{e.showUnitParallelogram=M.target.checked,e.baseMesh&&(e.mesh=await st(e.baseMesh,e.deployAngle*Math.PI/180,e.alignUnitParallelogram)),t()}),document.getElementById("chk-align-unit-parallelogram").addEventListener("change",async M=>{e.alignUnitParallelogram=M.target.checked,e.baseMesh&&(e.mesh=await st(e.baseMesh,e.deployAngle*Math.PI/180,e.alignUnitParallelogram)),t()}),h.addEventListener("change",M=>{e.showBaseMesh=M.target.checked,t()});const de=document.getElementById("chk-enable-third-color");de.addEventListener("change",M=>{e.enableThirdColor=M.target.checked,t()}),document.getElementById("btn-make-non-periodic").addEventListener("click",async()=>{if(e.baseMesh)if(e.renderMode!="bbox"){const M=await sl(e.baseMesh,e.repX,e.repY);q(M),e.mesh=await st(e.baseMesh,e.deployAngle*Math.PI/180,e.alignUnitParallelogram),t()}else{const M=await rl(e.mesh,-e.bboxWidth/2,-e.bboxHeight/2,e.bboxWidth/2,e.bboxHeight/2);q(M),e.mesh=await st(e.baseMesh,e.deployAngle*Math.PI/180,e.alignUnitParallelogram),t()}});const U=document.getElementById("chk-split-screen"),ne=document.getElementById("split-view-container"),oe=document.getElementById("split-view-content");U.addEventListener("change",M=>{e.splitScreen=M.target.checked,e.splitScreen?(ne.style.display="block",e.viewer3D||(e.viewer3D=new ji(oe))):ne.style.display="none",setTimeout(()=>{window.dispatchEvent(new Event("resize")),e.splitScreen&&e.viewer3D&&e.viewer3D.onResize()},0)});const le=document.getElementById("target-mesh-drop-zone");le.addEventListener("dragover",M=>{M.preventDefault(),le.classList.add("drag-over")}),le.addEventListener("dragleave",M=>{M.preventDefault(),le.classList.remove("drag-over")}),le.addEventListener("drop",M=>{M.preventDefault(),le.classList.remove("drag-over");const g=M.dataTransfer.files[0];if(g)if(g.name.split(".").pop().toLowerCase()==="obj"){const E=new FileReader;E.onload=async P=>{const k=P.target.result;let H=qi(k);if(H=await bl(H),e.targetMesh=H,e.targetMesh.uvs.length>0){const A=JSON.parse(JSON.stringify(e.targetMesh));A.vertices=e.targetMesh.uvs,A.faces=e.targetMesh.uv_faces,A.periodicity=[[0,0],[0,0]],A.face_colors=await gi(A),q(A)}const X=document.getElementById("btn-lift");X&&(X.disabled=!1),e.splitScreen||(U.checked=!0,e.splitScreen=!0,ne.style.display="block",e.viewer3D||(e.viewer3D=new ji(oe)),setTimeout(()=>{window.dispatchEvent(new Event("resize")),e.viewer3D&&e.viewer3D.onResize()},0)),e.viewer3D&&e.viewer3D.updateMesh(H)},E.readAsText(g)}else alert("Please upload an .obj file")}),le.addEventListener("click",()=>{const M=document.createElement("input");M.type="file",M.accept=".obj",M.onchange=g=>{const E=g.target.files[0];if(!E)return;const P=new FileReader;P.onload=k=>{const H=k.target.result,X=qi(H);e.splitScreen||(U.checked=!0,e.splitScreen=!0,ne.style.display="block",e.viewer3D||(e.viewer3D=new ji(oe)),setTimeout(()=>{window.dispatchEvent(new Event("resize")),e.viewer3D&&e.viewer3D.onResize()},0)),e.viewer3D&&e.viewer3D.updateMesh(X)},P.readAsText(E)},M.click()});const ue={running:!1,refresh:!1},xe=async()=>{const M=X=>!X.periodicity||X.periodicity[0][0]===0&&X.periodicity[0][1]===0&&X.periodicity[1][0]===0&&X.periodicity[1][1]===0;if(!e.mesh||!e.targetMesh||!e.unitPatternBaseMesh||M(e.unitPatternBaseMesh)){alert("Please load a periodic pattern.");return}if(ue.running){ue.refresh=!0;return}ue.running=!0;const g=e.deployAngle*Math.PI/180,E=document.getElementById("chk-intersect-boundary").checked,P=document.getElementById("chk-remove-single-neighbor").checked,k=e.rotation*Math.PI/180,H=await ol(e.unitPatternBaseMesh,g,e.targetMesh,e.scale,k,E,P);e.liftedMesh=H.lifted,e.initMesh=H.init_mesh,await q(H.init_mesh,!0,!1),e.viewer3D.updateMesh(e.liftedMesh),document.getElementById("btn-optimize-init").disabled=!1,document.getElementById("btn-optimize-start").disabled=!1,ue.running=!1,ue.refresh&&(ue.refresh=!1,setTimeout(xe,0))},_e=document.getElementById("rotation"),ye=document.getElementById("rotation-val");D(_e,ye,"rotation",0,async()=>{xe()});const we=document.getElementById("scale-slider"),Ie=document.getElementById("scale");D(we,Ie,"scale",1,async()=>{xe()}),document.getElementById("btn-lift").addEventListener("click",async()=>{xe()}),p.addEventListener("click",async()=>{(!e.baseMesh.kernel||e.baseMesh.kernel.length===0)&&q(await Mi(e.baseMesh,!1));let M=await hl(e.baseMesh);q(M)}),document.getElementById("btn-mesh-to-pattern").addEventListener("click",async()=>{if(!e.targetMesh)return;const M=document.getElementById("chk-map-to-unit-disk").checked,g=await ml(e.targetMesh,M);g.target_mesh_vertices&&(e.targetMesh.vertices=g.target_mesh_vertices,e.targetMesh.faces=g.target_mesh_faces,e.targetMesh.face_colors=g.face_colors,e.viewer3D.updateMesh(e.targetMesh)),await q(g),e.initMesh=e.baseMesh,e.liftedMesh=e.targetMesh}),document.getElementById("btn-optimize-fully-closed").addEventListener("click",async()=>{(!e.baseMesh.kernel||e.baseMesh.kernel.length===0)&&q(await Mi(e.baseMesh,!1));const M=await fl(e.baseMesh);q(M)}),document.getElementById("btn-prevent-intersections").addEventListener("click",async()=>{(!e.baseMesh.kernel||e.baseMesh.kernel.length===0)&&q(await Mi(e.baseMesh,!1));const M=await pl(e.baseMesh,e.barrier,e.barrier_strength,e.close_to_original_weight);q(M)});const Ae=document.getElementById("barrier"),Le=document.getElementById("barrier-val");Ae.addEventListener("input",M=>{const g=parseFloat(M.target.value)||0;e.barrier=g,Le.value=g}),Le.addEventListener("input",M=>{const g=parseFloat(M.target.value)||0;e.barrier=g,Ae.value=g.toFixed(2)});const Se=document.getElementById("barrier-strength"),Te=document.getElementById("barrier-strength-val");Se.addEventListener("input",M=>{const g=parseFloat(M.target.value)||0;e.barrier_strength=g,Te.value=g}),Te.addEventListener("input",M=>{const g=parseFloat(M.target.value)||0;e.barrier_strength=g,Se.value=g.toFixed(2)});const Ke=document.getElementById("close-to-original"),He=document.getElementById("close-to-original-val");Ke.addEventListener("input",M=>{const g=parseFloat(M.target.value)||0;e.close_to_original_weight=g,He.value=g}),He.addEventListener("input",M=>{const g=parseFloat(M.target.value)||0;e.close_to_original_weight=g,Ke.value=g.toFixed(2)})}function Qp(s,e,t){const n=document.getElementById("btn-optimize-init"),i=document.getElementById("btn-optimize-start"),r={rigid_weight:document.getElementById("opt-param-rigid"),closeness_weight:document.getElementById("opt-param-closeness"),planarity_weight:document.getElementById("opt-param-planarity"),close_to_init_weight:document.getElementById("opt-param-close-init")},a=async()=>{const u=await dl();r.rigid_weight&&(r.rigid_weight.value=u.rigid_weight),r.closeness_weight&&(r.closeness_weight.value=u.closeness_weight),r.planarity_weight&&(r.planarity_weight.value=u.planarity_weight),r.close_to_init_weight&&(r.close_to_init_weight.value=u.close_to_init_weight)},o=async()=>{const u={rigid_weight:parseFloat(r.rigid_weight.value),closeness_weight:parseFloat(r.closeness_weight.value),planarity_weight:parseFloat(r.planarity_weight.value),close_to_init_weight:parseFloat(r.close_to_init_weight.value)};await ul(u)};Object.values(r).forEach(u=>{u&&u.addEventListener("change",o)}),document.getElementById("btn-export-optimized-meshes").addEventListener("click",async()=>{let u=await Os();sr(u.ground,"optimized_ground"),sr(u.lifted,"optimized_lifted")});let l=async u=>{const m=document.getElementById("optimization-stats"),x=document.getElementById("opt-stat-rigid-max"),p=document.getElementById("opt-stat-rigid-avg"),f=document.getElementById("opt-stat-planar-max"),y=document.getElementById("opt-stat-planar-avg");m&&x&&p&&f&&y&&(m.style.display="block",x.textContent=u.rigid_max?.toFixed(4)||"0.00",p.textContent=u.rigid_avg?.toFixed(4)||"0.00",f.textContent=u.planarity_max?.toFixed(4)||"0.00",y.textContent=u.planarity_avg?.toFixed(4)||"0.00")},d=!1;const h=()=>{d=!1,i.textContent="Start optimization"};n.addEventListener("click",async()=>{h();const u=e.deployAngle*Math.PI/180;let m=await st(e.initMesh,u,e.deployAngle*Math.PI/180,e.alignUnitParallelogram);await al(m,e.liftedMesh,e.targetMesh);let x=await Os();e.mesh=x.ground,e.optimizedGround=x.ground,e.optimizedLifted=x.lifted,e.viewer3D.updateMesh(x.lifted),t(),a(),l(await cl())}),i.addEventListener("click",async()=>{if(d){h();return}for(d=!0,i.textContent="Stop optimization";d;){let u=await ll();e.mesh=u.ground,e.optimizedGround=u.ground,e.optimizedLifted=u.lifted,e.viewer3D.updateMesh(u.lifted),t(),a(),l(u),await new Promise(m=>setTimeout(m,0))}})}const Zt=document.getElementById("canvas"),Ys=Zt.getContext("2d");let zs;function qs(){zs||(zs=requestAnimationFrame(()=>{Sa(Ys,Zt,Pe),zs=null}))}function Ma(){const s=Zt.parentElement,e=s.clientWidth,t=s.clientHeight,n=window.devicePixelRatio||1;Zt.width=e*n,Zt.height=t*n,Zt.style.width=e+"px",Zt.style.height=t+"px",Ys.setTransform(1,0,0,1,0,0),Ys.scale(n,n),qs()}window.addEventListener("resize",Ma);Wp(Zt,Pe,qs);Qp(Zt,Pe,qs);Ma();
