# Comfyurn site

A static website for Comfyurn, a fictional furniture and home decor brand. Plain HTML, CSS and vanilla JavaScript: no framework, no build step, no npm.

## Preview

The site is static (no build step), so any file server works.

```
cd comfyurn-site
python3 -m http.server 8000
```

Open <http://localhost:8000>. Stop with `Ctrl+C`. Double-clicking `index.html` also works, but the hero then shows its still image instead of the scrolling video, because browsers block video loading from disk.

While editing the site, use the no-cache server in the project folder instead (`python3 host_server.py` from the folder that holds `comfyurn-site/`). The plain server lets the browser keep old CSS and JS, so a page can mix a new stylesheet with an old script and look broken until a hard reload.

| Need | Command |
| --- | --- |
| Preview while editing, never cached | `python3 host_server.py` (project folder), then <http://localhost:8000>. Only this Mac can open it; add `--lan` to test from a phone on the same Wi-Fi |
| Run in the background | `nohup python3 -m http.server 8000 >/tmp/comfyurn.log 2>&1 &` |
| Stop the background server | `lsof -ti:8000 \| xargs kill` |
| Open on a phone or other device on the same Wi-Fi | see "View on a phone" below |
| Temporary public link | `brew install cloudflared` (once), then `cloudflared tunnel --url http://localhost:8000` prints a `https://…trycloudflare.com` address |

### View on a phone (same Wi-Fi)

1. From the project folder (the one that holds `comfyurn-site/`), start the server for the local network:

   ```
   python3 host_server.py --lan
   ```

2. Find the Mac's address: `ipconfig getifaddr en0` (prints something like `192.168.18.156`).
3. On the phone, on the same Wi-Fi, open `http://<that address>:8000`.
4. Stop it with `Ctrl+C` when you are done (or `lsof -ti:8000 | xargs kill` if it runs in the background).

If the phone cannot connect:

- Allow Python when macOS asks about incoming connections. You can also check System Settings › Network › Firewall.
- Guest or office networks often block devices from reaching each other. Use your home Wi-Fi or the phone's hotspot.
- Anyone on the same network can open the site while `--lan` is running, so stop it on shared Wi-Fi.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home: scroll-scrubbed suite video, sofa and bed breakdowns, suite cards, FAQ, booking form |
| `products.html` | Shop all: category tabs, type tiles, filters, sort, search, product grid with "See inside" specs. Room links use a hash, e.g. `products.html#bedroom`; search uses `?q=` |
| `product.html` | One product, built from the catalogue: `product.html?id=haven&room=living`. Gallery with feature badges, buy box (sale price, stock count or restock date), what is inside, specifications, Style with, You may also like, customer reviews |
| `saved.html` | Saved for later: every product hearted, with Add to bag, Add all and Remove. The header heart links here |
| `spec.html` | Printable A4 spec sheet for one product, built from the catalogue: `spec.html?id=haven`. "Save as PDF or print" opens the print dialog |
| `checkout.html` | Checkout, opened from the cart drawer. Form on the left (contact, delivery or pickup, address, delivery method, billing), order summary on the right (lines, discount code, totals). Photo header, Delivery/Pick up switch, "?" tips, field checks as you leave each field, Place order button with the total, scrolling summary for long orders, Terms and policies popup. Placing an order shows a confirmation and empties the bag; nothing is charged. Demo discount code: `WELCOME10` |

## Folders

| Path | Holds |
| --- | --- |
| `css/base.css` | Design tokens (colors, fonts, radius, shadow, easing), reset, type (Instrument Serif headings), buttons and `.tlink` text links, focus styles, site footer |
| `css/home.css` | Styles used only by the home page, in section order |
| `css/shop.css` | Styles shared by the shop pages: condensing header, grid, cards, toast |
| `css/product.css` | Styles only the product page uses |
| `css/checkout.css` | Styles only the checkout page uses |
| `css/spec.css` | Spec sheet page, on screen and in print |
| `js/data/catalog.js` | Every product: name, price, colours, specs, room, sizes, about text, suite photo crops, and optional `made` (made to order, no stock held), `was` (sale), `qty` (stock), `eta` (restock date), `feats` (badges). The single source of truth |
| `js/data/reviews.js` | Example customer reviews per product (fictional, labelled as such on the page). The summary score and count still come from the catalogue |
| `js/shop/line-art.js` | Line drawings per product type, used until real product photos exist |
| `js/shop/ui.js` | Small shared helpers: price format, stars, product links, the stock rule, sale prices, stock caps, feature badges, spec and layer rows, the check for reviews saved in the browser (`CF.reviewOk`), catalogue picks (`CF.mostReviewed`, `CF.roomPicks`, `CF.lowestPrice`) and the one product tile (`CF.tileHTML`) used by the home bands and the product page rows |
| `js/shop/store.js` | Bag, order note and saved items, kept in the browser so they follow you across pages. Cleans tampered data on load (unknown products, colours not sold, bad quantities) and saves the cleaned bag |
| `js/shop/header.js` | Shared shop header: condenses on scroll, menu button for the hidden links, announcement bar that folds after 10 s or on its close button (stays folded for the visit; a button in the icon row reopens it), search, counts, shared icons, toast |
| `js/shop/shop.js` | Shop grid: rooms, tiles, filters, sort, search; cards link to product pages |
| `js/shop/cart.js` | Cart drawer on shop pages: opens from the bag icon or after Add to bag; quantities, remove, order note, subtotal, Checkout |
| `js/shop/product.js` | Product page builder |
| `js/shop/reviews.js` | Product page reviews: score and star breakdown, search, sort, colour and star filters, Write a review (saved in this browser only) |
| `js/shop/spec.js` | Spec sheet builder |
| `js/shop/saved.js` | Saved page builder |
| `js/shop/trade.js` | Trade and bulk orders form in the product page's specifications fold-outs (demo, nothing is sent) |
| `js/shop/checkout.js` | Checkout page builder: form, validation, country-aware address labels, delivery methods, discount code, confirmation |
| `js/site/util.js` | Tiny helpers for every page: `CF.esc` (safe text for HTML), `CF.emailOk` (the one email rule), `CF.token` (a design token for SVG colours) and `CF.wordRuns` (splits a headline into words, keeping italic parts). Loads first |
| `js/site/tabs.js` | `CF.tabs`: a keyboard-friendly tab row (arrow keys, Home, End), used by the home Shop by room and Inside the sofa bands and the product page Inside band (vertical lists also take ArrowUp and ArrowDown) |
| `js/site/carousel.js` | `CF.carousel`: a scroll-snap track with previous and next buttons that mark the ends (Most reviewed). `CF.loop`: an endless row of tiles moved by arrows, swipe or mouse drag (Shop by room pieces) |
| `js/site/condense.js` | `CF.condenseNav`: the bar that condenses on scroll, with its menu button and panel, shared by the home nav and the shop header. Loads right after `util.js` |
| `js/site/help.js` | Help button (bottom right) on home and shop pages: common questions and answers, no live agent |
| `js/site/signup.js` | "Join the list" email popup, once per visitor after 15 seconds, never over another dialog or the open bag (demo) |
| `js/site/footer.js` | Site footer on the home and shop pages: newsletter band (demo), link columns that fold on phones, base row. The fictional-brand note stays in each page's HTML |
| `js/home/nav-menu.js` | Home nav: sets up `CF.condenseNav` for the home bar (always condensed at 550px and narrower) |
| `js/home/entrances.js` | Scroll-reveal entrances; pauses animations on hidden tabs |
| `js/home/hero-scrub.js` | The scroll-scrubbed hero video, its captions and its pause button |
| `js/home/sofa-hold.js` | Press-and-hold sofa breakdown |
| `js/home/bands.js` | Home bands built from the catalogue: Shop by room tabs, diptych drawings, Most reviewed carousel |
| `js/home/book-form.js` | Booking form success state (demo, sends nothing) |
| `js/home/scroll-sound.js` | Optional scroll click sound |
| `assets/video/` | The scrub-encoded hero video |
| `assets/images/` | Web-sized stills. Pages use the `.webp` files (`-960` is the phone size); the `.jpg` originals stay as sources and for the social preview (`og:image`). Make new WebP files with the browser encoder (see `tests/README.md`) |

## Conventions

- Prices are Nepali rupees, shown as `Rs. 3,24,000` (lakh grouping, `CF.money` / `CF.fmt` in `ui.js`), with 13% VAT included (`CF.VAT`, `CF.vatIn`). The numbers in the catalogue are rupees.
- Checkout defaults to Nepal (7 provinces, District, 5-digit postal code); Australia, New Zealand and the US stay in the list. Payment is cash on delivery; card, wallet and express buttons are disabled placeholders until a backend exists.

- Scripts are classic `defer` scripts, one feature per file, each wrapped in an IIFE. Shared data lives on `window.CF`.
- Load order on the home page: `js/site/util.js`, `js/site/condense.js`, `js/data/catalog.js`, `js/shop/line-art.js`, `js/shop/ui.js`, `js/site/tabs.js`, `js/site/carousel.js`, then the `js/home/*` scripts (`bands.js` after `sofa-hold.js`), then `js/site/footer.js`, `help.js`, `signup.js`.
- Load order on shop pages: `js/site/util.js`, `js/site/condense.js`, `js/data/catalog.js`, `js/shop/line-art.js`, `js/shop/ui.js`, `js/shop/store.js`, `js/shop/header.js`, `js/shop/cart.js`, `js/site/footer.js`, `js/site/help.js`, `js/site/signup.js`, then the page script (`shop.js` or `product.js`). The product page also loads `js/data/reviews.js` after the catalogue and `js/shop/reviews.js` after `product.js`. `checkout.html` has its own quiet header, so it skips `header.js` and `cart.js` and loads `checkout.js` after `store.js` (with `util.js` first).
- `product.html` also loads `js/site/tabs.js` just before `js/shop/product.js`, for its Inside band.
- Shop pages mark themselves with `<body data-page="shop">`, `data-page="product"` or `data-page="checkout"` and include an empty `<header class="top" id="top">` that `header.js` fills.
- Home and shop pages end with `<footer class="site-foot" id="foot">` holding a `.foot-note`, and load `js/site/footer.js` after the shared scripts (on the home page, last; on shop pages, just before the page script). The home page also loads `js/data/catalog.js` so the footer can list the rooms. Checkout keeps its own minimal footer.
- Colors and fonts come from tokens in `css/base.css`. Don't add new hex values for existing roles.
- Prices on the home page must match `js/data/catalog.js`.
- The full rules are in `.claude/skills/comfyurn-structure/SKILL.md` one level up.

## Deploy

Before any deploy, patch `og:image` and `og:url` in `index.html` at the `DEPLOY STEP` comment with the live address.

**Zip upload:** zip the contents of this folder (not the folder itself) so `index.html` sits at the top of the zip. Leave out `README.md` if you prefer; it is harmless either way.

**Free static hosts:** run from inside `comfyurn-site/`. Each asks you to log in the first time.

| Host | Command |
| --- | --- |
| Netlify | `npm i -g netlify-cli && netlify deploy --dir=. --prod` |
| Cloudflare Pages | `npm i -g wrangler && wrangler pages deploy . --project-name comfyurn` |
| Vercel | `npm i -g vercel && vercel --prod` |

## Hosting headers

Every page carries a Content Security Policy in a `<meta>` tag: scripts only from this site, styles also from Google Fonts, no plugins, forms only to this site. A `<meta>` tag cannot stop other sites from framing the pages, so a host that lets you set headers should also send:

| Header | Value |
| --- | --- |
| `Content-Security-Policy` | the same policy as the `<meta>` tag, plus `frame-ancestors 'none'` |
| `X-Frame-Options` | `DENY` (older browsers) |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Cache-Control` on `css/`, `js/`, `assets/` | a long max-age once file names carry a version |

GitHub Pages cannot set custom headers; Netlify (`_headers`), Cloudflare Pages (`_headers`) and Vercel (`vercel.json`) can. Adding a new external script, font or image host means adding it to the policy on every page.
