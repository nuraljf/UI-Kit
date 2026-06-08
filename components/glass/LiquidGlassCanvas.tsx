"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useGlassContext } from "./GlassContext";

const MAX_LENSES = 24;
const STAGE_W = 1440;
const STAGE_H = 1024;
const BG_URL = "/assets/background.jpg";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform vec2      uStage;
  uniform float     uTime;
  uniform int       uCount;
  uniform sampler2D uTex;
  uniform float     uHasTex;
  uniform float     uImgAspect;
  uniform vec4      uRect[${MAX_LENSES}]; // x,y top-left + z,w size (stage px)
  uniform vec4      uTint[${MAX_LENSES}]; // rgba 0..1
  uniform vec4      uMeta[${MAX_LENSES}]; // x=radius y=highlight z=refract w=priority

  // ---- backdrop: the uploaded photo (cover-fit), gradient fallback ----
  vec3 gradient(float t){
    vec3 c0=vec3(0.561,0.690,0.839), c1=vec3(0.663,0.725,0.847);
    vec3 c2=vec3(0.843,0.682,0.776), c3=vec3(0.902,0.737,0.788);
    vec3 c4=vec3(0.788,0.769,0.867), c5=vec3(0.725,0.776,0.867);
    vec3 c6=vec3(0.761,0.824,0.894), c7=vec3(0.847,0.894,0.941);
    vec3 c8=vec3(0.914,0.945,0.973);
    vec3 c=c0;
    c=mix(c,c1,smoothstep(0.00,0.14,t)); c=mix(c,c2,smoothstep(0.14,0.30,t));
    c=mix(c,c3,smoothstep(0.30,0.40,t)); c=mix(c,c4,smoothstep(0.40,0.52,t));
    c=mix(c,c5,smoothstep(0.52,0.62,t)); c=mix(c,c6,smoothstep(0.62,0.72,t));
    c=mix(c,c7,smoothstep(0.72,0.84,t)); c=mix(c,c8,smoothstep(0.84,1.00,t));
    return c;
  }

  vec3 backdrop(vec2 uv){
    if(uHasTex > 0.5){
      float stageA = uStage.x / uStage.y;
      vec2 t = uv;
      if(uImgAspect > stageA){          // photo wider than stage → crop sides
        t.x = (uv.x - 0.5) * (stageA / uImgAspect) + 0.5;
      } else {                          // taller → crop top/bottom
        t.y = (uv.y - 0.5) * (uImgAspect / stageA) + 0.5;
      }
      return texture2D(uTex, clamp(t, 0.0, 1.0)).rgb;
    }
    return gradient(uv.y);
  }

  float sdRoundBox(vec2 p, vec2 b, float r){
    vec2 q = abs(p) - b + r;
    return min(max(q.x,q.y),0.0) + length(max(q,vec2(0.0))) - r;
  }

  void main(){
    vec2 px = vec2(vUv.x*uStage.x, (1.0-vUv.y)*uStage.y);
    vec3 base = backdrop(px/uStage);

    // pick the highest-priority lens covering this fragment (ties: first)
    int   hit = -1;
    float bestPri = -1.0;
    vec2  hitCenter = vec2(0.0), hitHalf = vec2(0.0);
    float hitR = 0.0;
    for(int i=0;i<${MAX_LENSES};i++){
      if(i>=uCount) break;
      vec4 r = uRect[i];
      vec2 c   = r.xy + r.zw*0.5;
      vec2 hsz = r.zw*0.5;
      float rad = min(uMeta[i].x, min(hsz.x, hsz.y));
      if(sdRoundBox(px-c, hsz, rad) < 1.0){
        float pri = uMeta[i].w;
        if(pri > bestPri){
          bestPri = pri; hit = i;
          hitCenter = c; hitHalf = hsz; hitR = rad;
        }
      }
    }

    if(hit < 0){ gl_FragColor = vec4(base, 1.0); return; }

    vec4  tint     = uTint[hit];
    float hl       = uMeta[hit].y;
    float refract  = uMeta[hit].z;

    vec2  local = px - hitCenter;
    float d = sdRoundBox(local, hitHalf, hitR);

    // SDF normal (outward)
    float e = 1.0;
    vec2 g = vec2(
      sdRoundBox(local+vec2(e,0.0),hitHalf,hitR)-sdRoundBox(local-vec2(e,0.0),hitHalf,hitR),
      sdRoundBox(local+vec2(0.0,e),hitHalf,hitR)-sdRoundBox(local-vec2(0.0,e),hitHalf,hitR)
    );
    vec2 n = length(g) > 0.0001 ? normalize(g) : vec2(0.0);

    float de   = max(-d, 0.0);
    float maxR = max(hitHalf.x, hitHalf.y);

    // convex-lens magnification (interior) + edge bend (rim), both scaled by size
    float rNorm = clamp(length(local)/maxR, 0.0, 1.0);
    float mag   = 0.10 * refract * (1.0 - rNorm*rNorm);
    vec2  magPx = hitCenter + (px - hitCenter) * (1.0 - mag);

    float edge    = 1.0 - smoothstep(0.0, maxR, de);
    float shimmer = 1.0 + 0.05*sin(uTime*1.1 + local.x*0.05 + local.y*0.05);
    float offset  = pow(edge, 1.5) * (0.10*maxR + 10.0) * refract * shimmer;

    vec2 srcPx = magPx - n*offset;

    // refracted backdrop, with chromatic dispersion for strong lenses
    vec3 refr;
    if(refract > 1.2){
      float ca = 1.6 * refract * pow(edge, 1.5);
      refr.r = backdrop((srcPx - n*ca)/uStage).r;
      refr.g = backdrop( srcPx        /uStage).g;
      refr.b = backdrop((srcPx + n*ca)/uStage).b;
    } else {
      // light frost (multi-tap blur) for the small panels
      vec2 o = vec2(1.5)/uStage;
      refr  = backdrop(srcPx/uStage);
      refr += backdrop(srcPx/uStage + vec2( o.x,0.0));
      refr += backdrop(srcPx/uStage + vec2(-o.x,0.0));
      refr += backdrop(srcPx/uStage + vec2(0.0, o.y));
      refr += backdrop(srcPx/uStage + vec2(0.0,-o.y));
      refr /= 5.0;
    }

    // translucent tint over the refracted backdrop
    vec3 glass = mix(refr, tint.rgb, tint.a);

    // inner-highlight rim (Figma inset stroke) + directional top-left sparkle
    float rim = exp(-de/1.6) * hl;
    float dir = clamp((-n.x - n.y)*0.5 + 0.5, 0.0, 1.0);
    glass += vec3(1.0) * rim * (0.45 + 0.55*dir);

    float cover = 1.0 - smoothstep(-1.0, 1.0, d);
    gl_FragColor = vec4(mix(base, glass, cover), 1.0);
  }
`;

function Scene() {
  const { lenses, stageRef } = useGlassContext();
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const placeholder = useMemo(() => {
    const tex = new THREE.DataTexture(
      new Uint8Array([200, 210, 225, 255]),
      1,
      1,
      THREE.RGBAFormat,
    );
    tex.needsUpdate = true;
    return tex;
  }, []);

  const uniforms = useMemo(
    () => ({
      uStage: { value: new THREE.Vector2(STAGE_W, STAGE_H) },
      uTime: { value: 0 },
      uCount: { value: 0 },
      uTex: { value: placeholder as THREE.Texture },
      uHasTex: { value: 0 },
      uImgAspect: { value: 1 },
      uRect: { value: Array.from({ length: MAX_LENSES }, () => new THREE.Vector4()) },
      uTint: { value: Array.from({ length: MAX_LENSES }, () => new THREE.Vector4()) },
      uMeta: { value: Array.from({ length: MAX_LENSES }, () => new THREE.Vector4()) },
    }),
    [placeholder],
  );

  // load the uploaded photo and feed it to the shader
  useEffect(() => {
    let active = true;
    new THREE.TextureLoader().load(BG_URL, (tex) => {
      if (!active) return;
      tex.flipY = false;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      const mat = matRef.current;
      if (!mat) return;
      mat.uniforms.uTex.value = tex;
      mat.uniforms.uHasTex.value = 1;
      mat.uniforms.uImgAspect.value =
        (tex.image as HTMLImageElement).width /
        (tex.image as HTMLImageElement).height;
    });
    return () => {
      active = false;
    };
  }, []);

  useFrame((state) => {
    const mat = matRef.current;
    const stage = stageRef.current;
    if (!mat || !stage) return;

    mat.uniforms.uTime.value = state.clock.elapsedTime;

    const srect = stage.getBoundingClientRect();
    const scale = srect.width / STAGE_W || 1;

    let i = 0;
    lenses.forEach((lens) => {
      if (i >= MAX_LENSES || !lens.el) return;
      const r = lens.el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      mat.uniforms.uRect.value[i].set(
        (r.left - srect.left) / scale,
        (r.top - srect.top) / scale,
        r.width / scale,
        r.height / scale,
      );
      const [tr, tg, tb, ta] = lens.tint;
      mat.uniforms.uTint.value[i].set(tr, tg, tb, ta);
      mat.uniforms.uMeta.value[i].set(lens.radius, lens.hl, lens.refract, lens.priority);
      i++;
    });
    mat.uniforms.uCount.value = i;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export function LiquidGlassCanvas() {
  return (
    <Canvas
      className="absolute inset-0"
      style={{ pointerEvents: "none", zIndex: 0 }}
      dpr={[1, 2]}
      flat
      linear
      gl={{ alpha: false, antialias: true }}
      orthographic
      camera={{ position: [0, 0, 1] }}
    >
      <Scene />
    </Canvas>
  );
}
