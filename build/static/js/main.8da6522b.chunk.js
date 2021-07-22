(this["webpackJsonpgrass-shader"]=this["webpackJsonpgrass-shader"]||[]).push([[0],{47:function(t,e,n){},48:function(t,e,n){"use strict";n.r(e);var o=n(7),a=n.n(o),i=n(31),r=n.n(i),s=n(14),c=n(50),l=n(51),h=n(12),f=n(1),u=n(32),v=n.n(u),d=n(37),m=n.p+"static/media/blade_diffuse.7a91419c.png",x=n.p+"static/media/blade_alpha.fd72bbc9.jpg",p=n(49),b=Object(p.a)({bladeHeight:1,map:null,alphaMap:null,time:0},"   precision mediump float;\n      attribute vec3 offset;\n      attribute vec4 orientation;\n      attribute float halfRootAngleSin;\n      attribute float halfRootAngleCos;\n      attribute float stretch;\n      uniform float time;\n      uniform float bladeHeight;\n      varying vec2 vUv;\n      varying float frc;\n      \n      //WEBGL-NOISE FROM https://github.com/stegu/webgl-noise\n      //Description : Array and textureless GLSL 2D simplex noise function. Author : Ian McEwan, Ashima Arts. Maintainer : stegu Lastmod : 20110822 (ijm) License : Copyright (C) 2011 Ashima Arts. All rights reserved. Distributed under the MIT License. See LICENSE file. https://github.com/ashima/webgl-noise https://github.com/stegu/webgl-noise      \n      vec3 mod289(vec3 x) {return x - floor(x * (1.0 / 289.0)) * 289.0;} vec2 mod289(vec2 x) {return x - floor(x * (1.0 / 289.0)) * 289.0;} vec3 permute(vec3 x) {return mod289(((x*34.0)+1.0)*x);} float snoise(vec2 v){const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439); vec2 i  = floor(v + dot(v, C.yy) ); vec2 x0 = v -   i + dot(i, C.xx); vec2 i1; i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0); vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1; i = mod289(i); vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 )); vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0); m = m*m ; m = m*m ; vec3 x = 2.0 * fract(p * C.www) - 1.0; vec3 h = abs(x) - 0.5; vec3 ox = floor(x + 0.5); vec3 a0 = x - ox; m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h ); vec3 g; g.x  = a0.x  * x0.x  + h.x  * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw; return 130.0 * dot(m, g);}\n      //END NOISE\n      \n      //https://www.geeks3d.com/20141201/how-to-rotate-a-vertex-by-a-quaternion-in-glsl/\n      vec3 rotateVectorByQuaternion( vec3 v, vec4 q){\n        return 2.0 * cross(q.xyz, v * q.w + cross(q.xyz, v)) + v;\n      }\n      \n      //https://en.wikipedia.org/wiki/Slerp\n      vec4 slerp(vec4 v0, vec4 v1, float t) {\n        // Only unit quaternions are valid rotations.\n        // Normalize to avoid undefined behavior.\n        normalize(v0);\n        normalize(v1);\n      \n        // Compute the cosine of the angle between the two vectors.\n        float dot_ = dot(v0, v1);\n      \n        // If the dot product is negative, slerp won't take\n        // the shorter path. Note that v1 and -v1 are equivalent when\n        // the negation is applied to all four components. Fix by \n        // reversing one quaternion.\n        if (dot_ < 0.0) {\n          v1 = -v1;\n          dot_ = -dot_;\n        }  \n      \n        const float DOT_THRESHOLD = 0.9995;\n        if (dot_ > DOT_THRESHOLD) {\n          // If the inputs are too close for comfort, linearly interpolate\n          // and normalize the result.\n          vec4 result = t*(v1 - v0) + v0;\n          normalize(result);\n          return result;\n        }\n      \n        // Since dot is in range [0, DOT_THRESHOLD], acos is safe\n        float theta_0 = acos(dot_);       // theta_0 = angle between input vectors\n        float theta = theta_0*t;          // theta = angle between v0 and result\n        float sin_theta = sin(theta);     // compute this value only once\n        float sin_theta_0 = sin(theta_0); // compute this value only once\n        float s0 = cos(theta) - dot_ * sin_theta / sin_theta_0;  // == sin(theta_0 - theta) / sin(theta_0)\n        float s1 = sin_theta / sin_theta_0;\n        return (s0 * v0) + (s1 * v1);\n      }\n      \n      void main() {\n        //Relative position of vertex along the mesh Y direction\n        frc = position.y/float(bladeHeight);\n        //Get wind data from simplex noise \n        float noise = 1.0-(snoise(vec2((time-offset.x/50.0), (time-offset.z/50.0)))); \n        //Define the direction of an unbent blade of grass rotated around the Y axis\n        vec4 direction = vec4(0.0, halfRootAngleSin, 0.0, halfRootAngleCos);\n        //Interpolate between the unbent direction and the direction of growth calculated on the CPU. \n        //Using the relative location of the vertex along the Y axis as the weight, we get a smooth bend\n        direction = slerp(direction, orientation, frc);\n        vec3 vPosition = vec3(position.x, position.y + position.y * stretch, position.z);\n        vPosition = rotateVectorByQuaternion(vPosition, direction);\n      \n       //Apply wind\n       float halfAngle = noise * 0.15;\n        vPosition = rotateVectorByQuaternion(vPosition, normalize(vec4(sin(halfAngle), 0.0, -sin(halfAngle), cos(halfAngle))));\n        //UV for texture\n        vUv = uv;\n        //Calculate final position of the vertex from the world offset and the above shenanigans \n        gl_Position = projectionMatrix * modelViewMatrix * vec4(offset + vPosition, 1.0 );\n      }","\n      precision mediump float;\n      uniform sampler2D map;\n      uniform sampler2D alphaMap;\n      varying vec2 vUv;\n      varying float frc;\n      \n      void main() {\n        //Get transparency information from alpha map\n        float alpha = texture2D(alphaMap, vUv).r;\n        //If transparent, don't draw\n        if(alpha < 0.15) discard;\n        //Get colour data from texture\n        vec4 col = vec4(texture2D(map, vUv));\n        //Add more green towards root\n        col = mix(vec4(0.0, 0.6, 0.0, 1.0), col, frc);\n        //Add a shadow towards root\n        col = mix(vec4(0.0, 0.1, 0.0, 1.0), col, frc);\n        gl_FragColor = col;\n      }",(function(t){t.side=f.DoubleSide}));Object(s.b)({GrassMaterial:b});var g=n(11),w=new v.a(Math.random);function y(t){var e=t.options,n=void 0===e?{bW:.12,bH:1,joints:5}:e,a=t.width,i=void 0===a?100:a,r=t.instances,c=void 0===r?5e4:r,l=n.bW,u=n.bH,v=n.joints,p=Object(o.useRef)(),b=Object(s.d)(f.TextureLoader,[m,x]),w=Object(h.a)(b,2),y=w[0],M=w[1],A=Object(o.useMemo)((function(){return function(t,e){for(var n=[],o=[],a=[],i=[],r=[],s=new f.Vector4,c=new f.Vector4,l=-.25,h=.25,u=0;u<t;u++){var v=Math.random()*e-e/2,d=Math.random()*e-e/2,m=O(v,d);n.push(v,m,d);var x=Math.PI-Math.random()*(2*Math.PI);i.push(Math.sin(.5*x)),r.push(Math.cos(.5*x));var p=new f.Vector3(0,1,0),b=p.x*Math.sin(x/2),g=p.y*Math.sin(x/2),w=p.z*Math.sin(x/2),y=Math.cos(x/2);s.set(b,g,w,y).normalize(),x=Math.random()*(h-l)+l,b=(p=new f.Vector3(1,0,0)).x*Math.sin(x/2),g=p.y*Math.sin(x/2),w=p.z*Math.sin(x/2),y=Math.cos(x/2),c.set(b,g,w,y).normalize(),s=j(s,c),x=Math.random()*(h-l)+l,b=(p=new f.Vector3(0,0,1)).x*Math.sin(x/2),g=p.y*Math.sin(x/2),w=p.z*Math.sin(x/2),y=Math.cos(x/2),c.set(b,g,w,y).normalize(),s=j(s,c),o.push(s.x,s.y,s.z,s.w),u<t/3?a.push(1.8*Math.random()):a.push(Math.random())}return{offsets:n,orientations:o,stretches:a,halfRootAngleCos:r,halfRootAngleSin:i}}(c,i)}),[c,i]),z=Object(o.useMemo)((function(){return new f.PlaneBufferGeometry(l,u,1,v).translate(0,u/2,0)}),[n]),_=Object(o.useMemo)((function(){var t=(new d.a).fromBufferGeometry(new f.PlaneGeometry(i,i,32,32));t.verticesNeedUpdate=!0,t.lookAt(new f.Vector3(0,1,0));for(var e=0;e<t.vertices.length;e++){var n=t.vertices[e];n.y=O(n.x,n.z)}return t.computeVertexNormals(),t.toBufferGeometry()}),[i]);return Object(s.c)((function(t){return p.current.uniforms.time.value=t.clock.elapsedTime/4})),Object(g.jsxs)(g.Fragment,{children:[Object(g.jsxs)("mesh",{children:[Object(g.jsxs)("instancedBufferGeometry",{index:z.index,"attributes-position":z.attributes.position,"attributes-uv":z.attributes.uv,children:[Object(g.jsx)("instancedBufferAttribute",{attachObject:["attributes","offset"],args:[new Float32Array(A.offsets),3]}),Object(g.jsx)("instancedBufferAttribute",{attachObject:["attributes","orientation"],args:[new Float32Array(A.orientations),4]}),Object(g.jsx)("instancedBufferAttribute",{attachObject:["attributes","stretch"],args:[new Float32Array(A.stretches),1]}),Object(g.jsx)("instancedBufferAttribute",{attachObject:["attributes","halfRootAngleSin"],args:[new Float32Array(A.halfRootAngleSin),1]}),Object(g.jsx)("instancedBufferAttribute",{attachObject:["attributes","halfRootAngleCos"],args:[new Float32Array(A.halfRootAngleCos),1]})]}),Object(g.jsx)("grassMaterial",{ref:p,map:y,alphaMap:M})]}),Object(g.jsx)("mesh",{position:[0,0,0],geometry:_,children:Object(g.jsx)("meshStandardMaterial",{color:"#000f00"})})]})}function j(t,e){var n=t.x*e.w+t.y*e.z-t.z*e.y+t.w*e.x,o=-t.x*e.z+t.y*e.w+t.z*e.x+t.w*e.y,a=t.x*e.y-t.y*e.x+t.z*e.w+t.w*e.z,i=-t.x*e.x-t.y*e.y-t.z*e.z+t.w*e.w;return new f.Vector4(n,o,a,i)}function O(t,e){var n=2*w.noise2D(t/50,e/50);return n+=4*w.noise2D(t/100,e/100),n+=.2*w.noise2D(t/10,e/10)}function M(){return Object(g.jsxs)(s.a,{camera:{position:[15,15,30]},children:[Object(g.jsx)(c.a,{azimuth:1,inclination:.6,distance:1e3}),Object(g.jsx)("ambientLight",{}),Object(g.jsx)("pointLight",{position:[10,10,10]}),Object(g.jsx)(o.Suspense,{fallback:null,children:Object(g.jsx)(y,{})}),Object(g.jsx)(l.a,{minPolarAngle:Math.PI/5,maxPolarAngle:Math.PI/2.5})]})}n(47);r.a.render(Object(g.jsx)(a.a.StrictMode,{children:Object(g.jsx)(M,{})}),document.getElementById("root"))}},[[48,1,2]]]);
//# sourceMappingURL=main.8da6522b.chunk.js.map