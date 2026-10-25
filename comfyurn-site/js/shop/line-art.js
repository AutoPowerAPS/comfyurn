/* Comfyurn · line drawings for each product type (placeholder imagery until real photos) */
(function(){
'use strict';
const S=`fill="none" stroke="${window.CF.token('--ink','#121816')}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"`;   // ink from base.css
const ART={
  sofa:c=>`<path d="M22 70h156v26a8 8 0 0 1-8 8H30a8 8 0 0 1-8-8z" fill="${c}" ${S}/><path d="M34 70V52a10 10 0 0 1 10-10h112a10 10 0 0 1 10 10v18" fill="${c}" ${S}/><path d="M100 46v24M22 70a10 10 0 0 1 20 0M158 70a10 10 0 0 1 20 0M36 104v12M164 104v12" ${S}/>`,
  sectional:c=>`<path d="M14 72h120v28H14z M134 72h52v28h-52z" fill="${c}" ${S}/><path d="M24 72V54h104v18 M140 72V54h40v18" fill="${c}" ${S}/><path d="M134 54v18M20 100v12M180 100v12M76 54v18" ${S}/>`,
  armchair:c=>`<path d="M58 70h84v28a8 8 0 0 1-8 8H66a8 8 0 0 1-8-8z" fill="${c}" ${S}/><path d="M66 70c0-30 10-42 34-42s34 12 34 42" fill="${c}" ${S}/><path d="M58 70a8 8 0 0 1 16 0M126 70a8 8 0 0 1 16 0M68 106l-4 14M132 106l4 14" ${S}/>`,
  coffee:c=>`<path d="M30 70h140v10H30z" fill="${c}" ${S}/><path d="M44 80v34M156 80v34M40 98h120" ${S}/>`,
  side:c=>`<circle cx="100" cy="54" r="34" fill="${c}" ${S}/><path d="M100 88v34M80 122h40" ${S}/>`,
  bed:c=>`<path d="M20 74h160v26H20z" fill="${c}" ${S}/><path d="M20 74V40h30v34M30 74V60h140v14" ${S}/><path d="M56 60c4-8 34-8 38 0M106 60c4-8 34-8 38 0" ${S}/><path d="M26 100v14M174 100v14" ${S}/>`,
  mattress:c=>`<path d="M24 62h152v40H24z" fill="${c}" ${S}/><path d="M24 76h152M44 62v40M70 62v40M96 62v40M122 62v40M148 62v40" ${S} opacity=".45"/>`,
  night:c=>`<path d="M60 40h80v66H60z" fill="${c}" ${S}/><path d="M60 72h80M94 56h12M94 88h12M66 106v12M134 106v12" ${S}/>`,
  wardrobe:c=>`<path d="M44 16h112v104H44z" fill="${c}" ${S}/><path d="M100 16v104M92 64v12M108 64v12M50 120v6M150 120v6" ${S}/>`,
  stool:c=>`<path d="M72 34h56v10H72z" fill="${c}" ${S}/><path d="M78 44l-10 80M122 44l10 80M100 44v80M74 92h52" ${S}/>`,
  island:c=>`<path d="M20 44h160v12H20z" fill="${c}" ${S}/><path d="M30 56h140v64H30z" fill="${c}" ${S} opacity=".9"/><path d="M84 56v64M140 76h20" ${S}/>`,
  dining:c=>`<path d="M26 54h148v10H26z" fill="${c}" ${S}/><path d="M40 64v56M160 64v56M100 64v40M80 120h40" ${S}/>`,
  rocker:c=>`<path d="M66 32h56l-6 46H72z" fill="${c}" ${S}/><path d="M60 78h76v10H60z" fill="${c}" ${S}/><path d="M66 88l-6 26M132 88l6 26M44 112c30 16 82 16 112 0" ${S}/>`,
  swing:c=>`<path d="M100 4v26" ${S}/><path d="M100 30c-34 0-46 26-46 52 0 26 18 40 46 40s46-14 46-40c0-26-12-52-46-52z" fill="${c}" ${S}/><path d="M64 88h72M70 70c10-6 50-6 60 0" ${S} opacity=".55"/>`,
  lounger:c=>`<path d="M20 92h112l40-36" ${S}/><path d="M24 84h108l38-34" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round"/><path d="M32 92v24M124 92v24M164 64v52" ${S}/>`,
  lamp:c=>`<path d="M70 22h60l12 40H58z" fill="${c}" ${S}/><path d="M100 62v54M80 116h40" ${S}/>`,
  pendant:c=>`<path d="M100 4v40" ${S}/><path d="M60 84a40 40 0 0 1 80 0z" fill="${c}" ${S}/><path d="M92 84a8 8 0 0 0 16 0" ${S}/>`,
  vase:c=>`<path d="M84 24h32c0 14-8 18-8 26 0 10 22 20 22 46 0 16-12 26-30 26s-30-10-30-26c0-26 22-36 22-46 0-8-8-12-8-26z" fill="${c}" ${S}/>`,
  rug:c=>`<path d="M30 48h140v56H30z" fill="${c}" ${S}/><path d="M42 60h116v32H42z" ${S} opacity=".5"/><path d="M30 52h-8M30 64h-8M30 76h-8M30 88h-8M30 100h-8M170 52h8M170 64h8M170 76h8M170 88h8M170 100h8" ${S}/>`,
  mirror:c=>`<path d="M70 120V52a30 30 0 0 1 60 0v68z" fill="${c}" ${S}/><path d="M84 60l14-14M86 78l26-26" ${S} opacity=".45"/>`,
  cushion:c=>`<path d="M44 40c20 6 92 6 112 0-6 20-6 52 0 72-20-6-92-6-112 0 6-20 6-52 0-72z" fill="${c}" ${S}/>`,
  throw:c=>`<path d="M36 30h128v70c-20 10-40-6-64 4s-44-6-64 4z" fill="${c}" ${S}/><path d="M48 104v12M64 102v12M80 104v12M96 104v12M112 102v12M128 104v12M144 102v12" ${S} opacity=".6"/>`
};
const art=(t,c)=>`<svg class="art" viewBox="0 0 200 130" aria-hidden="true">${ART[t](c)}</svg>`;

window.CF=window.CF||{};
window.CF.ART=ART;window.CF.art=art;
})();
