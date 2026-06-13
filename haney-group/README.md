# The Haney Group — Redesigned Website

A polished, production-ready static build of the redesigned **haney-group.com**,
implementing the strategy in `haney-group-redesign-foundation.md` and the copy
plan in `haney-group-homepage-content-plan.md`.

## What this is

A self-contained static site — plain HTML, hand-written CSS, and minimal
vanilla JS. No build step, no framework, no template lock-in. Open
`index.html` in a browser, or serve the folder with any static host.

It is structured so it can be ported to Next.js, Astro, or a CMS-backed
build later without re-doing the design, the copy, or the components.

## Run it

From the `haney-group/` directory:

```bash
# any static server works; e.g.
python3 -m http.server 8080
# then visit http://localhost:8080
```

Or open `haney-group/index.html` directly in a browser.

## File map

```
haney-group/
├── index.html                            Homepage (12 sections)
├── about.html                            Firm story + full principal bios
├── services.html                         Services overview
├── services/
│   ├── legislative-strategy.html         Pillar 01
│   ├── appropriations.html               Pillar 02
│   ├── public-affairs.html               Pillar 03
│   └── parliamentary.html                Pillar 04 (institutional)
├── industries.html                       Eight industry landing blurbs
├── experience.html                       Six anonymized engagements + voice
├── insights/
│   └── index.html                        The Session Briefing index
├── contact.html                          Segmented inquiry form
├── assets/
│   ├── css/main.css                      Full design system, ~700 lines
│   ├── js/main.js                        Nav, reveal, form, footer year
│   └── svg/                              Logo + dome backgrounds
└── README.md                             This file
```

## Design system implemented

- **Palette.** Navy primary (`#0B1228`), ivory contrast (`#F5F1E8`),
  ink near-black (`#06091A`), single amber accent (`#C9892A`). Tokens
  in `assets/css/main.css` under `:root`.
- **Typography.** Fraunces display serif + Inter body sans, loaded from
  Google Fonts with `display=swap`.
- **Components.** Hero, trust strip, positioning block, three-pillar grid
  with institutional fourth, principal portraits, industries grid with
  inversion-on-hover, engagement cards with Situation / Role / Outcome
  structure, capitol-view brand moment with inline SVG dome, named client
  quote, Session Briefing teaser, closing CTA, four-column footer,
  utility bar, sticky header, mobile slide-in nav.
- **Voice rules followed.** No "trusted advisor," "top-notch," "voice
  is heard," "make an impact." Insider vocabulary (Article II, rider,
  conference, interim charge, calendar committee, LBB, HHSC, PUC, TCEQ)
  used deliberately.
- **Accessibility.** Skip-to-content, semantic landmarks, visible focus
  states, aria-labels on all icon-only controls, reduced-motion query.

## Forms

The contact form and Session Briefing subscribe forms are wired to a
graceful client-side success state for demo purposes. Production deploy
should route submissions to:

- A CRM (HubSpot, Folk, or Pipedrive) for inquiries.
- A list provider (Buttondown, ConvertKit) for The Session Briefing.

## Photography to commission

The design holds placeholders for three commissioned shoots, each called
out in `haney-group-homepage-content-plan.md`:

1. **Hero.** Low-angle, golden-hour interior of the Texas House rostrum
   or the rotunda at dusk.
2. **Principals.** 4:5 portraits of Robert and Julie, matching lighting
   and color grading. Slight off-camera gaze.
3. **Capitol-view band.** Exterior of the Texas State Capitol at blue
   hour, dome backlit.

Until those land, the design ships with a tasteful gradient-and-SVG
treatment that does not read as a stock placeholder.

## Porting to Next.js or Astro

The structure was designed for clean migration:

- Each page is a flat HTML file with a top-down section order.
- Repeated header / utility / footer chunks can become `<Header>`,
  `<Utility>`, `<Footer>` components in any framework.
- CSS is token-driven and framework-agnostic — paste into a Tailwind
  config or keep as a stylesheet.

## Provenance

Strategy: `../haney-group-redesign-foundation.md`
Content plan: `../haney-group-homepage-content-plan.md`
