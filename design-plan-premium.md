# Comfyurn premium redesign plan

Based on a study of lenskart.com's home page (captured 24 Oct 2026 at 1440px wide in Brave; computed styles and image sizes measured from the live page) compared with comfyurn-site as it stands today.

---

## 1. What Lenskart does

### 1.1 Design philosophy

Lenskart's home page reads like a fashion magazine, not a shop catalogue.

- **Photography leads and the interface steps back.** Almost every section is a photograph or video. The interface around it is black, white and grey, so the only colour on the page comes from the photos.
- **Each section is a "story".** Each one has a small uppercase eyebrow, a very large serif headline and one text link. Examples: "Material stories", "Frame your story.", "House of Brands", "Come See Us.", "Seen on the Streets".
- **Bold in one place, quiet everywhere else.** The headlines are huge (58–107px) and the photos are full-bleed. Everything else (nav, captions, links) is small, thin and plain.
- **Few component types, repeated.** About six section layouts are reused down the page, so it feels designed rather than assembled.

### 1.2 Colour theme (measured)

| Role | Value | Where |
| --- | --- | --- |
| Dark band / footer | `#080808`, `#000000` | Largest area on the page: "Material stories", the footer and the overlays |
| Canvas | `#FFFEFC` | Warm off-white behind the light sections |
| Surface | `#FFFFFF` | Header and cards |
| Product tile | `#F5F5F5` | Studio-grey background behind the frame shots |
| Text | `#080808`, `#333`, `#666`, `#9E9E9E`, `#CCC` | A five-step grey ladder, with no brand colour in the text |
| Accent | none | The interface has no accent hue. The photos supply all the colour. |

Corner radius is almost zero: 0px on images and bands, 1–6px on a few controls. There are no drop shadows on content.

### 1.3 Typography (measured)

- **Display: Playfair Display, 600–700, 42–107px.** It has high stroke contrast and tight tracking. Headlines mix roman and *italic* inside one line ("Frame your *story.*", "Seen *on the Streets*", "Built for the hero *in you*", "Do More. *Be More.*"). This mixing is the signature move.
- **Body: Gantari, 14–16px, regular.** A plain humanist sans that never competes with the headlines.
- **Eyebrows: 12–14px uppercase with wide letter-spacing** ("IN FOCUS", "SHAPES TRENDING NOW", "THE DIRECTORY", "OUR STORES", "COMMUNITY").
- **Calls to action are text, not buttons.** They use uppercase tracked text, a right arrow and a 1px underline ("EXPLORE ALL →", "EXPLORE DARK KNIGHT →"). There are almost no filled buttons on the page.

### 1.4 Image placement and ratios (measured)

Lenskart uses only five ratios: 16:9, 2:1, 3:2, 1:1 and 2:3. They repeat them throughout the page.

| Section | Layout | Rendered size at 1440 | Ratio |
| --- | --- | --- | --- |
| Hero | Full-bleed autoplay video; only a text CTA at the bottom left and pause/mute controls | 1440 × ~810 | 16:9 |
| Category "In focus" | Large image on the left (about 55% wide); headline, copy and three square thumbnails with captions on the right | 734 × 477 + 3 × 171 × 169 | 3:2 + 1:1 |
| "What's Trending?" | Full-bleed campaign photo with a giant serif headline on top | 1440 × 713 | 2:1 |
| Trending pair | Two full-bleed halves with no gap; CTA at the bottom right of each | 2 × 720 × 712 | 1:1 + 1:1 |
| "Find your shape" | Horizontal carousel of studio product shots on grey, caption below, arrow controls | 256 × 256 tiles | 1:1 |
| "Material stories" | Black band; tab list on the left, image on the right | 932 × 509 | ~16:9 |
| "Frame your story." | Half text, half photo, then another full-bleed 1:1 pair | 720 × 712 | 1:1 |
| "House of Brands" | Square carousel with the brand name on top | 600 × 600 | 1:1 |
| "Come See Us." (stores) | Full-bleed storefront photo; service row ("Free Eye Test · Try at home · Free Repair …") over the bottom | 1440 × 720 | 2:1 |
| "Seen on the Streets" | Three portrait cards with an uppercase title and "EXPLORE" below | 339 × 488 | 2:3 |
| Closing campaign | Full-bleed photo with headline | 1440 × 810 | 16:9 |

Other image habits:

- **Large source files.** The campaign image is 6912px wide and the tiles are 768px for a 256px slot, so photos stay sharp on retina screens.
- **Edge to edge.** Feature images span the full width with no gutters, cards or rounded corners. Only product and brand carousels sit inside the 1440 container.
- **Spec detail as content.** The material tabs carry real engineering labels ("Acetate CA-6 MM", "Titanium TI-0.6 MM", "TR90 22G FLEX"). That is the same idea as our "280 GSM" and "35 KG/M³" labels.

### 1.5 Layout and rhythm

- **Alternating bands.** Light and dark sections alternate: video, light, photo, light, **black**, light, photos, light, photo, light, photo, **black footer**. The rhythm comes from changing value, not from borders or cards.
- **Width.** Content is held at 1440px max with a gutter of about 53–67px (roughly 4.5vw). The full-bleed images break out of it.
- **Header.** It is transparent over the hero video and turns solid white with a hairline shadow once you scroll. It has text links, an underline-only search field and outline icons.
- **Footer.** Black with five link columns, and a giant serif sign-off ("Do More. *Be More.*") with an italic second line.
- **Motion.** There is very little: the hero video, carousels and simple hovers. Nothing animates for its own sake.

> Limit: the phone-width capture was served the desktop layout (the page detects the device), so mobile notes here are not reliable.

---

## 2. Where Comfyurn stands today

### Keep: what already feels premium

- **The honest, spec-led voice.** "280 GSM", "35 KG/M³ CORE", "1,000 pocket springs" and "Come and lift the leg." Lenskart's material tabs show that this kind of detail reads as luxury when it is set well.
- **The scroll-scrubbed hero video.** It does the same job as Lenskart's hero video, and it does it better because it tells the "nothing is hidden" story.
- **The DM Mono spec labels.** These are our own detail. Keep them as the "data" voice.
- **Restraint in copy.** Short, plain sentences, the same tone Lenskart uses.

### Gaps that keep it from looking premium

| Area | Today | Effect |
| --- | --- | --- |
| Photography | 4 photos in total (`suite`, `balcony`, `hero-poster`, `hero-ending`), all around 16:9. Room cards crop one suite photo into 4:5. Every product image is line art. | The shop reads as a wireframe or prototype. Lenskart's look is about 80% photography, and we have almost none. |
| Palette | Sage-mint canvas `#EEF1EE`, panels `#E2E9E6`/`#D3DEDA` and teal `#1F7A80` on every button. | Everything sits at the same mid value, so there is no contrast and no dark band to anchor the page. Teal everywhere makes it feel like an app. |
| Type | Familjen Grotesk 500 for headlines, DM Sans body, DM Mono labels. | Friendly and technical, but with no display contrast. Headlines never get "big" the way Lenskart's do. |
| Shapes | 28px-radius panels, pill buttons, round teal icon buttons, rounded room cards. | Reads as a soft SaaS look, not furniture or interiors. |
| Rhythm | Every section uses the same canvas, the same ~1180px column and the same pattern (eyebrow, heading, paragraph, then diagram). | Long, even scroll with no change of pace. |
| Product cards | 1:1 line art on `#F5F7F5`, a big teal circle bag button, "SEE INSIDE" in mono on every card. | Heavy controls compete with the image. |

---

## 3. The plan

The direction is to borrow Lenskart's structure (editorial bands, few ratios, quiet interface, big type, dark anchors) and keep Comfyurn's identity (teal, oak, linen, honest specs). We should not copy Lenskart's look, which is fashion-model black and white.

### Phase 0: Design tokens (`css/base.css`)

Do this first, because every later phase depends on it.

**Palette.** Move from mint-on-mint to near-white and near-black, with teal kept small.

| Token | Now | Proposed | Use |
| --- | --- | --- | --- |
| `--canvas` | `#EEF1EE` | `#FAFAF8` | Light sections. Near-white with a faint warm-grey bias, so it is not stark. |
| `--surface` | (new) | `#FFFFFF` | Header and drawers |
| `--tile` | `--card #F5F7F5` | `#EFEEEA` | Studio background behind product photos (Lenskart's `#F5F5F5` role) |
| `--ink` | `--text-primary #17262E` | `#121816` | Text and **dark bands**: a black with a slight sea-green bias |
| `--ink-2` / `--ink-3` | `--text-secondary` | `#4A524F` / `#8A918E` | A grey ladder like Lenskart's five steps |
| `--hairline` | `#C3CFCB` | `rgba(18,24,22,.14)` | Dividers |
| `--accent` | `#1F7A80` everywhere | `#1F7A80` **for small things only** | Focus ring, in-stock dot, active tab underline, one link per section |
| `--oak` | `#C8A67A` | keep | Material detail (spec chips, the oak layer in diagrams) |

**Type.** Add a high-contrast display serif that has a true italic, so we can use the roman-plus-italic headline move. Keep DM Sans for body and DM Mono for specs.

- Options on Google Fonts: **Instrument Serif** (light, editorial, good italic), **Bodoni Moda** (closest to Lenskart's contrast) or **Gloock** (heavier, warmer).
- Avoid Playfair Display: copying it would make the site look like a Lenskart clone.
- Scale: eyebrow 12px mono tracked; body 16–17px; h3 24px; h2 `clamp(44px, 6vw, 96px)`; hero `clamp(56px, 8vw, 120px)`.
- Example headlines in our voice: "Walk in. Nothing is *hidden.*", "Come and *lift the leg.*", "Where you *sleep*, from the top down."

**Shape and depth.**

- Radius scale 0 / 2 / 6px.
- Images and bands get 0px.
- Chips and inputs get 6px.
- Pills stay only for filter chips.
- Remove content shadows; keep one shadow for menus and drawers.

**Buttons.**

- Primary: a solid `--ink` rectangle with 2px radius and 13px uppercase tracked text ("BOOK A SUITE TOUR").
- Secondary: an uppercase text link with an arrow and a 1px underline ("SEE INSIDE →").
- Teal fill disappears from buttons.

### Phase 1: Photography (biggest single lever)

Nothing else will make the site look premium while products are line art. Build an image set in Lenskart's five-ratio system.

| Asset | Ratio | Count | Content |
| --- | --- | --- | --- |
| Hero poster and end frame | 16:9 | 2 | Already exist. Re-export at 2560px or wider as AVIF/WebP. |
| Room heroes | 3:2 | 4 | Living, kitchen, bedroom and balcony, each a real wide shot (replaces the cropped suite photo) |
| Category thumbs | 1:1 | 9 | Sofas, armchairs, tables, beds, mattresses, storage, bar stools, outdoor, lighting: one object on `--tile` |
| Product studio shots | 1:1 | 22 + angles | Each product on the `--tile` grey with a soft floor shadow and a consistent 3/4 angle and camera height |
| Product lifestyle | 4:5 | 22 | The same product in the suite (shown on hover, and second in the gallery) |
| Material macros | 16:9 | 4–5 | Oak grain and dowel joint, linen weave, a foam cross-section, a pocket spring, a stone worktop |
| Diptych campaign | 1:1 | 2 | Haven sofa and Tide bed, styled |
| Suite exterior / visit | 2:1 | 1 | The suite entrance, for the "Come and lift the leg" band |
| People in the suite | 2:3 | 3 | Hands on the materials: lifting the cushion, unzipping the cover, sitting on the edge |

- **Source.** Either a real shoot, or generated with the `higgsfield-product-photoshoot` skill (studio mode for 1:1 and lifestyle mode for 4:5) using the line-art shapes and palette as reference. Generated images should be checked for impossible furniture details before use.
- **Line art stays.** It moves into "See inside" as the diagram, not the main image.
- **Delivery.**
  - Serve `srcset` at 1×/2×, AVIF/WebP with a JPEG fallback, and explicit `width`/`height` attributes to avoid layout shift.
  - Use `loading="lazy"` below the fold.
  - Name and place files by the folder rules in `comfyurn-structure`.

### Phase 2: Home page as bands (`index.html`, `css/home.css`)

Map each Lenskart pattern onto our content. Light and dark should alternate.

1. **Hero: keep the scrub video.**
   - The nav is transparent over the video and becomes a solid `--surface` once it condenses. Our existing `.mini` state already supports this.
   - Replace the hero buttons with one underlined text CTA, "SEE INSIDE →".
   - Set the serif headline at hero size.
2. **"Shop by room" (Lenskart's "In focus" block). Light band.**
   - A 3:2 room photo on the left at about 55% width.
   - On the right: eyebrow, serif heading, two-line copy, "SHOP LIVING →" and three 1:1 thumbs with uppercase captions.
   - Room tabs above it (Living · Kitchen · Bedroom · Balcony) swap the content, styled like Lenskart's large tab row with an underline on the active tab.
3. **"Inside the sofa" (Lenskart's "Material stories"). Dark `--ink` band.**
   - The press-and-hold diagram stays, but moves onto the dark band.
   - The layer list becomes Lenskart-style serif tabs with mono spec labels: "Linen cover · 280 GSM", "Dense foam · 35 KG/M³", "Steel springs · 7 ZONES", "Oak frame · 32 MM".
   - Selecting a tab swaps a 16:9 material macro on the right.
4. **Diptych. Full bleed, two 1:1 halves with no gap.**
   - Haven sofa on one side, Tide bed on the other.
   - CTA bottom right on each ("EXPLORE THE HAVEN →").
5. **"Inside the bed". Light band.**
   - Keep the five-layer stack and its numbers.
   - Restyle: no rounded bars, hairline rows, serif layer names, mono specs.
6. **Product carousel, "Most lifted this month".**
   - 1:1 studio tiles on `--tile` with scroll-snap and arrow buttons.
   - Caption: product name in uppercase tracked text, then the price.
7. **"Come and lift the leg" (Lenskart's "Come See Us"). 2:1 full-bleed suite photo.**
   - Overlay a service row at the bottom showing only promises the site already makes, for example "VAT and delivery included" and "Book a suite tour".
   - The booking form opens below it on a light band, split half text and half 1:1 photo.
8. **Questions. Light band.** Keep the FAQ, typographic only, with hairline separators and a serif question style.
9. **Footer. Dark `--ink`.**
   - Five link columns as today.
   - Add a giant serif sign-off: "Nothing is *hidden.*"

### Phase 3: Shop pages (`products.html`, `product.html`, `css/shop.css`, `css/product.css`)

- **Header.**
  - Solid `--surface` with a hairline under it.
  - The search becomes an underline-only field like Lenskart's, instead of the grey pill.
  - Outline icons.
  - The announce bar turns `--ink`, and its text becomes 12px uppercase tracked.
- **Category tiles.** 1:1 photo thumbs instead of line icons. Square corners, caption below.
- **Product card.**
  - A 1:1 studio photo on `--tile` with no border or radius. On hover it crossfades to the 4:5 lifestyle shot, cropped to 1:1.
  - Name in uppercase tracked text (it already is), descriptor in `--ink-2`, then price and swatches.
  - Remove the large teal circle bag button. A full-width "ADD TO BAG" bar slides up over the image on hover; on touch it shows as a small bag icon.
  - "SEE INSIDE" becomes an underlined text link.
- **Product page.**
  - Gallery: a 1:1 main image with a 4:5 lifestyle image, then a material macro.
  - The "Inside" section moves onto a dark band using the same material-tabs component as the home page, so the two pages share one design language.

### Phase 4: Motion and polish

- **Image hover:** `scale(1.03)` over about 0.8s on photos only.
- **Band entrances:** a short fade or rise, starting from a visible state, never from `opacity:0`.
- **Carousels:** native scroll-snap with arrow buttons; no autoplay.
- **Video:** keep the scrub. Add a small pause control as Lenskart does, for accessibility.
- **Reduced motion:** honour `prefers-reduced-motion` everywhere. The existing rules already do this; extend them to the new parts.

### Phase 5: Performance and quality (premium means fast)

- Preload the hero poster and the display font. Use `font-display: swap`.
- Set width and height on every image. Hold layout shift near 0.
- Keep total image weight for the first screen under about 400KB.
- Re-check that the header never flickers when switching between top and mini.

---

## 4. What not to copy

- **Playfair Display and pure black/white.** We would lose our identity and look like a Lenskart clone. Use our own serif and keep sea-green-black, teal and oak.
- **Fashion drama.** Our subject is furniture and materials, so the drama comes from close-ups of oak, linen and springs, not from models.
- **The help widget overlapping content.** Lenskart's sits on top of images. Our chat button should keep clear of CTAs.
- **Claims we don't make.** The service row and badges show only promises already on the site.

---

## 5. Order of work

| Step | Scope | Depends on |
| --- | --- | --- |
| 1 | Tokens, fonts, buttons and radius in `base.css` | Your choice of display serif |
| 2 | Photography set (Phase 1) | Real shoot or AI-generated, your call |
| 3 | Home bands 1–4 (hero, rooms, sofa materials, diptych) | Steps 1–2 |
| 4 | Home bands 5–9 and footer | Step 3 |
| 5 | Shop header, tiles and product card | Steps 1–2 |
| 6 | Product page gallery and Inside band | Step 5 |
| 7 | Motion, performance and a final pass on desktop and phone | All |

### Decisions needed from you

1. **Display serif:** Instrument Serif (light, editorial), Bodoni Moda (most Lenskart-like) or Gloock (warmer and heavier).
2. **Photos:** a real shoot, or AI-generated with Higgsfield (faster, and every image needs a check).
3. **Dark bands:** are you happy with near-black sections on the home page ("Inside the sofa" and the footer)?
4. **Teal:** keep teal only as a small accent, or keep teal primary buttons.
