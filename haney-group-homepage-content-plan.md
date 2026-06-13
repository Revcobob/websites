# The Haney Group — Homepage & Site Content Plan

> A production-ready homepage and site-content plan for the redesign of **https://www.haney-group.com**, built on the strategic foundation in `haney-group-redesign-foundation.md`.
>
> This document is written so a designer, developer, or content team can build directly from it: every homepage section includes purpose, hierarchy, exact written copy, design direction, photography direction, and interaction notes. The voice throughout is deliberate — written for Capitol insiders, association executives, and corporate government-affairs leads. No marketing filler.

---

## 0. The Brief in One Page

**Who we are designing for.** Three buyer profiles read every line of this site:

1. **The referred prospect.** A general counsel, association CEO, city manager, or VP of government affairs who got Robert or Julie's name from someone they trust. They are not shopping; they are confirming. They need the site to feel as serious as the referral.
2. **The diligence-mode buyer.** A board chair, hiring committee, or procurement lead comparing two or three firms. They are reading slowly and looking for specifics.
3. **The peer.** Another lobbyist, a member's chief of staff, a journalist, or a statewide officeholder's team. They will not hire the firm — but they amplify it. The site should make them respect it.

**What we want them to feel** by the time they scroll past the first screen: *this is the firm that knows how the room actually works.*

**What we want them to do.** Place a confidential inquiry or call. Everything else — Insights, downloads, social — is downstream.

**What we will not do.** We will not lead with empathy questions ("Are your interests being overlooked?"). We will not use phrases like *top-notch*, *cutting-edge*, *strategic partner*, *trusted advisor*, *passionate about advocacy*, or *make your voice heard*. We will not stack stock photos of handshakes, gavels, or generic Capitol skylines. We will not over-design. The Capitol does the gravitas; we provide the discipline.

---

## 1. Site Architecture

### 1.1 Primary navigation

A single, well-edited top bar. Seven items, in this order:

```
Home · About · Services · Industries · Experience · Insights · Contact
```

The current site's four-item nav with a hidden "…" reads as unfinished. Seven items, properly grouped, signals depth without sprawl. CTA button to the right of the nav: **"Schedule a Consultation"** (links to the segmented form on Contact).

### 1.2 Utility bar (above the main nav, optional)

A thin, near-black strip above the navy header:

```
Austin, Texas   ·   (512) 925-5000   ·   info@haney-group.com   ·   LinkedIn
```

The phone number on every page, above the fold, is the single highest-leverage trust signal we can give an existing relationship. It says: *we expect calls, not form fills.*

### 1.3 Mega-menu behavior

Hover (desktop) or tap (mobile) opens lightweight panels:

- **About** → Firm · Robert Haney · Julie Haney · Approach · In the News
- **Services** → Legislative Strategy & Advocacy · Appropriations & Budget · Public Affairs & Communications · Parliamentary & Procedural Consulting
- **Industries** → Health Care · Local Government & Special Districts · Infrastructure, Water & Energy · Real Estate & Land Use · Gaming & Regulated Industries · Associations & Coalitions · Nonprofits & Foundations · National & Out-of-State Clients
- **Experience** → Selected Engagements · Client Roster · Recognition & Press
- **Insights** → Session Briefings · Issue Explainers · Interim Outlook

### 1.4 Footer

A four-column footer, structured for both humans and crawlers:

```
Column 1 — The Firm
The Haney Group
P.O. Box 521
Austin, Texas 78767
(512) 925-5000
info@haney-group.com
[ LinkedIn · X · Email ]

Column 2 — Services
Legislative Strategy & Advocacy
Appropriations & Budget Strategy
Public Affairs & Communications
Parliamentary & Procedural Consulting

Column 3 — Industries
Health Care
Local Government & Special Districts
Infrastructure, Water & Energy
Real Estate & Land Use
Gaming & Regulated Industries
Associations & Coalitions
Nonprofits & Foundations
National & Out-of-State Clients

Column 4 — Stay Current
The Session Briefing
A short, candid read on what moved at
the Capitol this week. Authored by the
firm during session, monthly in interim.

[ email field ]  [ Subscribe ]

------------------------------------------------
© 2026 Haney Group LLC.  Privacy.  Texas Ethics
Commission Lobby Registration.  Accessibility.
```

The Ethics Commission link is a legal nicety, but it also functions as a trust signal — registered firms are real firms.

---

## 2. Homepage Flow at a Glance

Twelve sections, in order. Each is described in detail below.

| # | Section | Purpose | Approx. height (desktop) |
|---|---|---|---|
| 1 | Hero | Positioning + first CTA | 90 vh |
| 2 | Trust strip | Logos + recognitions | 22 vh |
| 3 | Positioning statement | "What this firm is for" | 70 vh |
| 4 | Three-pillar services | Show the shape of the offering | 90 vh |
| 5 | Principals | Robert + Julie, with substance | 90 vh |
| 6 | Industries | Eight discoverable entry points | 80 vh |
| 7 | Selected engagements | Three case-style cards | 90 vh |
| 8 | The Capitol view (signature visual) | A held breath / brand moment | 60 vh |
| 9 | Client voice | One quote, named, large | 50 vh |
| 10 | Session Briefing teaser | Insights + subscribe | 60 vh |
| 11 | Closing CTA | The decisive ask | 70 vh |
| 12 | Footer | As described above | — |

---

## 3. Homepage, Section by Section

### Section 1 — Hero

**Purpose.** State who we are, who we work for, and what we are uniquely good at — in fewer than fifteen seconds.

**Layout.** Full-bleed Capitol-interior photograph (recommendation: a low-angle, golden-hour interior of the Texas House rostrum or the rotunda at dusk — *commissioned*, not stock). Photograph is treated with a deep navy overlay (~70%) so type reads cleanly at any viewport. Type sits left-anchored over the image. No carousel. No video autoplay.

**Hierarchy.**

```
[Eyebrow]    TEXAS GOVERNMENT AFFAIRS  ·  LEGISLATIVE STRATEGY  ·  APPROPRIATIONS

[H1]         Inside the Capitol.
             On your side of the table.

[Subhead]    The Haney Group represents the associations, companies, local
             governments, and health systems whose Texas priorities cannot
             afford to be misunderstood — by a member, a chair, a reporter,
             or a budget writer.

[CTAs]       [ Schedule a Confidential Consultation ]
             [ See Recent Work →  ]

[Foot]       Led by Robert Haney, former Chief Clerk of the Texas House,
             and Julie Haney, former appropriations and chief-of-staff
             strategist.  →  Meet the principals
```

**Voice notes.** *Inside the Capitol. On your side of the table.* — short, declarative, two beats. It earns the brand's authority by stating both halves: the inside knowledge and the loyalty. The subhead resists the urge to list services; instead it names the cost of being misunderstood, which is the actual fear in the room when a buyer calls a lobby firm.

**Design notes.**

- Eyebrow: tracked sans-serif, 13–14px, 70% white opacity, separated with mid-dots.
- H1: display serif, ~72–88px desktop / 42–48px mobile, line-height 0.95, two lines, no orphans.
- Subhead: serif, ~22–24px desktop / 18px mobile, ~64ch line length, line-height 1.4.
- Primary CTA: solid burnt-amber pill (suggested `#C9892A`, dark navy text), with a 1px luminous border on hover and a 4px focus ring.
- Secondary CTA: ghost button, 1px white border, 70% white text, arrow icon.
- Photography: licensed or commissioned. No stock.

**Mobile.** Hero collapses to a 90vh viewport, H1 reduces but does not break across more than three lines. CTA stack is full-width, primary on top.

---

### Section 2 — Trust Strip

**Purpose.** Within 1.5 seconds of leaving the hero, prove the firm is operating at the level the hero just claimed.

**Hierarchy.**

```
[Small caps label]    REPRESENTING

[Logo row, monochrome]
   Texas REALTORS    Blue Cross Blue Shield of Texas
   Sports Betting Alliance    Texas Managed Care Alliance
   [+ additional client logos as the firm permits]

[Small caps label, right-aligned]    RECOGNITION

[Recognition row]
   Rising Star, Texas Capitol Inside (2023)
   President, American Society of Legislative Clerks and Secretaries
   25+ years inside the Texas House of Representatives
```

**Design notes.**

- Background: white, with a 1px hairline rule above and below in the navy palette. This is the only white section in the upper third — a deliberate, momentary release from the navy so the logos read with maximum credibility.
- Logos: rendered in single-color (charcoal, ~`#1B2233`), opacity 80%, equal optical weight. Subtle hover restores brand color.
- Spacing: each logo gets ~160–200px of horizontal room. No carousel — if there are more than eight, this is a two-row grid.
- Recognition list uses small caps + thin rules between items.

**Voice notes.** *Representing* is more honest than *Trusted by* (every site says trusted by). *Recognition* is more honest than *Awards* (lobby firms don't display trophies).

---

### Section 3 — Positioning Statement

**Purpose.** The single most important paragraph on the website. Buyers should finish it and think *that's the firm.*

**Hierarchy.**

```
[Eyebrow]    THE HANEY GROUP

[H2]         We were built around what
             actually moves bills in Texas:
             process, money, and message.

[Body]       Most firms can introduce you to a member. Fewer can tell you
             which committee will give your bill its first hearing, which
             rider in Article II will land, and which sentence the press
             will use against you the next morning. The Haney Group keeps
             those three disciplines — procedural fluency, appropriations
             craft, and communications discipline — in one room, run by
             the people who built each of them.

[Three columns]

   01  PROCESS         Twenty-five years inside the Texas House,
                       including five sessions as Chief Clerk
                       under five Speakers.

   02  MONEY           Two decades of appropriations and chief-of-staff
                       work where the line item, the rider, and the
                       interim charge are decided.

   03  MESSAGE         Communications strategy written for a member,
                       a board, and a reporter in the same week —
                       without the through-line drifting.

[CTA link]   How we work  →
```

**Voice notes.** The phrase *process, money, and message* is the firm's positioning compass. It is short enough to remember and specific enough to defend. The body paragraph names the three failures a client most fears (wrong committee, missed rider, bad headline) and then claims the three disciplines that prevent them. This is positioning by problem, not by service list.

**Design notes.**

- Background: deep navy, with a single thin amber rule under the eyebrow (~40px wide).
- H2: display serif, large, three lines maximum.
- The three numbered columns sit in a 12-column grid (4-4-4). Numerals are amber, oversized, low opacity. Labels are small caps. Bodies are sans-serif 17/28.
- The CTA link is a quiet underlined link, not a button. This section earns its weight from copy, not chrome.

---

### Section 4 — Three-Pillar Services

**Purpose.** Replace the current flat list of seven services with three named pillars that show the shape of the practice. A fourth, institutional pillar sits to the side.

**Hierarchy.**

```
[Eyebrow]    WHAT WE DO

[H2]         A practice built for the
             three places a Texas bill is won or lost.

[Three pillar cards — primary]

  ┌───────────────────────────────────┐
  │  01                                │
  │  Legislative Strategy & Advocacy   │
  │                                    │
  │  Bill strategy, committee work,    │
  │  member relationships, testimony   │
  │  preparation, coalition building,  │
  │  and interim engagement — designed │
  │  around the question every member  │
  │  asks: who is for this, who is     │
  │  against it, and where does it     │
  │  live?                              │
  │                                    │
  │  Explore Legislative Strategy  →   │
  └───────────────────────────────────┘

  ┌───────────────────────────────────┐
  │  02                                │
  │  Appropriations & Budget Strategy  │
  │                                    │
  │  Article and rider strategy, LBB   │
  │  engagement, agency coordination,  │
  │  and interim appropriations work.  │
  │  In Texas, the budget is the bill  │
  │  that becomes every other bill.    │
  │                                    │
  │  Explore Appropriations  →         │
  └───────────────────────────────────┘

  ┌───────────────────────────────────┐
  │  03                                │
  │  Public Affairs & Communications   │
  │                                    │
  │  Narrative development, talking    │
  │  points, board education, press    │
  │  preparation, and the Legislature  │
  │  101 trainings that turn a board   │
  │  into a coalition.                  │
  │                                    │
  │  Explore Public Affairs  →         │
  └───────────────────────────────────┘

[Fourth, lower-weight card — institutional]

  ┌───────────────────────────────────────────────────────────────┐
  │  04   Parliamentary & Procedural Consulting                   │
  │                                                                │
  │  For legislative bodies and procedurally complex private       │
  │  engagements. Robert Haney advises chambers nationally on      │
  │  modernization, rules, and chamber technology in his role as   │
  │  past President of the American Society of Legislative Clerks  │
  │  and Secretaries.                                              │
  │                                                                │
  │  Explore Parliamentary Consulting  →                           │
  └───────────────────────────────────────────────────────────────┘
```

**Voice notes.** Each card opens with a noun phrase, not a verb. The body of each card answers *what specifically* and *why us*. The institutional pillar is given visual subordination because it serves a different buyer — but it is on the homepage because it is one of the firm's most genuinely differentiating credentials.

**Design notes.**

- Cards have a 1px navy-tinted border (`#1F2B52` on dark, `#E4E7F2` on light), 24px corner radius, and a subtle 8-yard shadow on hover.
- Number `01 / 02 / 03` is an amber outline numeral, 64px, positioned top-left.
- Hover state: card lifts 2px, border color brightens to amber at 30%, the arrow on the CTA slides 4px right.
- Card titles: serif, 28/32 desktop, 22/28 mobile.
- The fourth card is full-width, lower contrast (border only, no fill), and visually clearly secondary.

---

### Section 5 — The Principals

**Purpose.** This is where the brand stops being a firm and becomes two people with real records. It must feel personal, specific, and earned.

**Layout.** Two-column on desktop (50/50), stacked on mobile. Each side is a portrait + name + role + credentialed bio + a single quote. Photography is paramount: matching lighting, matching frame, matching depth-of-field. Both principals are looking just off-camera, not into the lens — a quiet editorial register, not a corporate one.

**Hierarchy.**

```
[Eyebrow]    THE PRINCIPALS

[H2]         The two careers behind every
             engagement we take.

[Left column — Robert]

[Portrait, 4:5 ratio, b/w or low-saturation color]

ROBERT HANEY
Principal

For twenty-five years, Robert Haney worked inside the
Texas House of Representatives — the last five sessions
as Chief Clerk, appointed by five Speakers across both
parties. From the rostrum, he ran calendars, certified
votes, and built the procedural backbone that thousands
of bills moved through. The Texas Legislature is the
room he knows best in the world.

Nationally, Robert served as President of the American
Society of Legislative Clerks and Secretaries and is
recognized as a parliamentary authority by chambers
across the country. Texas Capitol Inside named him a
Rising Star in 2023.

"Most of what looks like influence in a session is
actually preparation done six months earlier. Our job
is to be six months earlier than the people across
the table."

→ Read Robert's full biography
→ LinkedIn

[Right column — Julie]

[Portrait, matching treatment]

JULIE HANEY
Principal

Julie Haney built her two decades in Texas politics
where the work is hardest to see: inside an appropriations
chair's office, then as chief of staff to a state
legislator, and then across communications engagements
for clients whose priorities had to land at the Capitol
and at the board table in the same week.

Her appropriations work sits behind every budget
engagement the firm takes, and her communications work
sits behind every press cycle a client wades into. She
is the strategist clients keep on the phone when the
question is what to say, when to say it, and to whom.

"A board, a member, and a reporter need the same
through-line, told in three different rooms. That's
not a press kit. That's strategy."

→ Read Julie's full biography
→ LinkedIn
```

**Voice notes.** The bios resist superlatives. The detail is the credibility: *appointed by five Speakers across both parties*, *the room he knows best in the world*, *inside an appropriations chair's office*. The pull-quotes are written to be the kind of line a journalist would actually clip.

**Design notes.**

- Portraits: 4:5 ratio, professionally shot in a Capitol-adjacent interior (committee room, library, rotunda hallway). Matching color grading. No backdrops.
- Names: serif uppercase tracking.
- Bio body: sans, 17/30, ~62ch.
- Quote: serif italic, 22/32, separated by a thin amber rule above.
- Both columns are exact mirrors structurally — same widths, same rhythm, same number of paragraphs. This is a design statement about the partnership.

---

### Section 6 — Industries We Serve

**Purpose.** Give every buyer in our seven target segments a one-click way to land on their world. This is also the SEO backbone of the site.

**Hierarchy.**

```
[Eyebrow]    INDUSTRIES

[H2]         Eight Texas conversations
             we know how to walk into.

[Grid of 8 cards, 4 × 2 desktop, 2 × 4 tablet, 1 × 8 mobile]

  Health Care
  Managed care, hospital systems, physician groups, and
  the Medicaid policy and appropriations work that
  surrounds them.

  Local Government & Special Districts
  Cities, counties, MUDs, water and hospital districts,
  transit, and the preemption fights that decide who
  governs what.

  Infrastructure, Water & Energy
  Capital appropriations, permitting, rate-case
  posture, and the regulators who run the next decade.

  Real Estate & Land Use
  Property rights, development policy, statewide
  housing debates, and association-led advocacy.

  Gaming & Regulated Industries
  High-visibility issues that live and die on both
  member relationships and disciplined communications.

  Associations & Coalitions
  Statewide trade associations whose members watch
  every interim charge — and whose boards need to see
  results between sessions and during them.

  Nonprofits & Foundations
  Appropriations riders, interim work, and the kind
  of representation that fits a mission-driven budget.

  National & Out-of-State Clients
  Your Texas desk. We serve as the Capitol-facing
  team for national government-affairs operations.

[CTA link]   See all industries  →
```

**Voice notes.** Each industry blurb is a sentence about *the conversation* the buyer is already having, not a list of services. A city manager doesn't read "we serve local government" — she reads "preemption fights that decide who governs what" and recognizes herself.

**Design notes.**

- Cards on a deep-navy ground; hover state inverts to ivory background with navy text — a small, satisfying click signal.
- Each card has a tiny custom monoline icon, top-left, in amber: caduceus, dome with column, water drop, key, dice, three-figure cluster, hand, compass.
- 1px hairline grid between cards, not solid borders, for a more editorial feel.

---

### Section 7 — Selected Engagements

**Purpose.** Replace "trust us" with "look at what we've done." Three anonymized case cards, each readable in 20 seconds.

**Hierarchy.**

```
[Eyebrow]    SELECTED ENGAGEMENTS

[H2]         A representative sample of
             the work clients hire us for.

[Card 1]

[Tag]   STATEWIDE ASSOCIATION  ·  LEGISLATIVE STRATEGY

The Situation
A statewide trade association faced legislation that
threatened the licensure framework its members had
operated under for a generation. The bill carried a
plausible coalition and a sympathetic press frame.

Our Role
We rewrote the association's positioning, prepared
member testimony for two committees, walked the bill's
language through three rounds of amendment, and
coordinated a coalition of unlikely allies into a
single hearing.

The Outcome
The licensure framework held. The association's board
exited the session with the language it asked for.

[Card 2]

[Tag]   HEALTH CARE  ·  APPROPRIATIONS

The Situation
A health care client needed a specific Medicaid policy
direction reflected in the appropriations act — the
kind of priority that lives in a rider and dies in
conference if it isn't watched.

Our Role
We engaged the relevant Article II subcommittee, the
LBB staff, and the chair's office on a parallel track,
and prepared the client's leadership for two hearings
of testimony and one closed-door briefing.

The Outcome
The rider survived conference and shaped the
following biennium's agency direction.

[Card 3]

[Tag]   LOCAL GOVERNMENT  ·  PREEMPTION DEFENSE

The Situation
A Texas city faced statewide legislation that would
have stripped a long-standing local authority. The
city had no in-session lobbying presence and limited
time to mount a defense.

Our Role
We built a coalition of similarly affected cities,
prepared mayoral testimony, briefed the chair's
office on the practical operating impact, and
authored amendment language that preserved local
authority while accommodating the bill's stated
purpose.

The Outcome
The amendment was adopted. The city retained the
authority. The coalition has continued into interim.

[CTA link]   See more engagements  →
```

**Voice notes.** The *Situation / Our Role / Outcome* structure mirrors how the principals would talk about a piece of work over coffee. The sentences are short. The words *committee*, *rider*, *Article II*, *LBB*, *conference*, *amendment*, *interim* are deliberate signals to readers who know what they mean — a code that says *we know who you are.*

**Design notes.**

- Three cards in a horizontal scroller on tablet, three columns on desktop, stacked on mobile.
- Tag pill: small caps, hairline border, amber accent.
- Each card uses a low-opacity Capitol detail (column flute, ceiling motif, rosette) as a watermark in the top-right corner — a refined visual signature rather than a stock image.
- Card padding is generous (40px). Cards are tall, not wide.

---

### Section 8 — The Capitol View (signature visual moment)

**Purpose.** Every great firm site has one moment that is design-only — a held breath. This is ours.

**Layout.** A single full-bleed, edge-to-edge photograph. Recommended: an exterior of the Texas State Capitol at blue hour, shot low, the dome backlit, the grounds in shadow. *Commissioned, never stock.* Overlay is a 30% navy gradient bottom-up. No carousel.

**Type, set lower-left over the photo.**

```
[Display serif, very large, two short lines]

The Capitol is the room
we know best in the world.

[Sans-serif, small, single line, 70% white]

— Robert Haney
```

**Design notes.** This is the only section without a CTA. The pacing matters. After three dense content sections, the user needs a pause. The image and the line do the work.

---

### Section 9 — Client Voice

**Purpose.** One quote, named, with title and organization. No carousel. One quote that earns the trust of the next section.

**Hierarchy.**

```
[Eyebrow]    CLIENT VOICE

[Pull quote — serif italic, very large]

"When the calendar tightened and the bill we
had been working on for a year was suddenly in
play, The Haney Group did not flinch. They told
us what to do, who to call, and what to say —
and they were right on every count."

[Attribution]

— [NAME], [TITLE]
  [ORGANIZATION]
```

**Voice notes.** The hardest thing for a lobby firm to get is an on-the-record quote. The single best quote, written in plain language, beats any anonymous-attribution wall of three or four. If only an anonymized testimonial can be secured, attribute as *General Counsel, statewide trade association — name withheld at client request.* That phrasing reads as discretion, not weakness.

**Design notes.**

- Quote: serif italic, ~40/52 desktop, ~28/40 mobile, generous left and right padding (~10vw).
- Single thin amber rule under attribution.
- Background: deep navy. No image. Restraint is the point.

---

### Section 10 — The Session Briefing

**Purpose.** Capture the email of every visitor who is not quite ready to inquire — peers, journalists, association staff, and the diligence-mode buyer who reads three Insights before calling.

**Hierarchy.**

```
[Two columns, 60/40 desktop]

[Left column]

[Eyebrow]    INSIGHTS

[H2]         The Session Briefing.

[Body]       A short, candid read on what moved at the
             Texas Capitol this week. Written by the firm
             during session — author by author, signed — and
             monthly during interim. No promotional fluff,
             no recycled press releases.

[CTAs]       [ Read the Latest Edition →  ]
             [ Subscribe by Email ]

[Right column — three recent posts]

  ┌────────────────────────────────┐
  │ MAY 2026   ·   INTERIM         │
  │ What this interim's healthcare │
  │ charges actually mean for      │
  │ next session.                  │
  │ — Julie Haney                  │
  └────────────────────────────────┘

  ┌────────────────────────────────┐
  │ APR 2026   ·   PROCEDURE       │
  │ A note on calendar             │
  │ committees, and why the        │
  │ smartest play is patience.     │
  │ — Robert Haney                 │
  └────────────────────────────────┘

  ┌────────────────────────────────┐
  │ MAR 2026   ·   APPROPRIATIONS  │
  │ Reading Article II without     │
  │ getting lost.                  │
  │ — Julie Haney                  │
  └────────────────────────────────┘
```

**Voice notes.** *The Session Briefing* is a name. It is a product. Naming it elevates the firm from "we sometimes blog" to "we publish."

**Design notes.**

- Post cards have a 1px navy-tinted border, no fill, and a small amber underline that grows on hover.
- Author attribution is real; the principals sign their own posts. This is non-negotiable.

---

### Section 11 — Closing CTA

**Purpose.** The decisive ask. By this point the buyer has either decided or they haven't.

**Layout.** A black or near-black panel, full-bleed, generous vertical padding, type left-anchored.

**Hierarchy.**

```
[Eyebrow]    BRING US THE HARDEST ONE.

[H2]         If your priority lives in a committee,
             a budget rider, an interim study,
             or a press cycle, we know the room
             it's being decided in.

[Body]       Tell us about your issue. Every engagement begins
             with a short, confidential conversation. We will
             tell you honestly whether we are the right firm —
             and if so, how we would approach it.

[CTAs]       [ Schedule a Confidential Consultation ]
             [ Or call (512) 925-5000 ]

[Foot]       Austin, Texas  ·  info@haney-group.com
```

**Voice notes.** *Bring us the hardest one.* is the firm's standing invitation. It is a posture, not a slogan. It tells the buyer: we are not for easy work, and we are not for everyone.

**Design notes.**

- Background: a near-black (`#06091A`), not pure black. This is the visual equivalent of a lowered voice.
- H2: serif, large, four lines maximum, line-height tight.
- Primary CTA: full amber pill, navy text, large, prominent.
- Secondary CTA: text link with the phone number, underlined.

---

### Section 12 — Footer

Per Section 1.4 above.

---

## 4. Client Services Section — Full Rewrite

The current site has seven flat services. The redesigned **Services** section reorganizes those seven into three named pillars plus one institutional offering. Below is the complete content for the Services overview page and the four service detail pages.

### 4.1 Services overview page

**Page H1.** *How We Help.*

**Lede.**

> Every engagement we take eventually comes down to three questions: where does the bill live, where does the money live, and what story is being told about it. The Haney Group is built around answering all three.

Four service blocks follow, with the same card pattern from the homepage. Each links to its detail page.

### 4.2 Legislative Strategy & Advocacy (detail page)

**H1.** *Legislative Strategy & Advocacy.*

**Lede.**

> We represent clients through every stage of the Texas legislative process — from pre-filing strategy through floor consideration, conference, and the governor's desk. The work is built around relationships that took decades to earn and procedural fluency that cannot be improvised.

**What we do, in practice:**

- **Bill strategy.** Who carries it, who chairs it, who refers it, where it sits on the calendar — answered before the bill is dropped, not after.
- **Committee work.** Witness preparation, member outreach, committee-substitute drafting, and amendment tracking on a daily basis during session.
- **Coalition building.** Aligning industry, association, and statewide allies into a single message — and into a single hearing room.
- **Testimony preparation.** Drafting, rehearsing, and post-hearing follow-up for both client principals and external witnesses.
- **Interim engagement.** Charge tracking, agency outreach, and the quiet conversations that decide what next session looks like.

**Who hires us for this:** statewide associations, regulated companies, healthcare clients, local governments, and coalitions in motion.

**CTA.** *Discuss your legislative goal.*

### 4.3 Appropriations & Budget Strategy (detail page)

**H1.** *Appropriations & Budget Strategy.*

**Lede.**

> In Texas, the budget is the bill that becomes every other bill. Our appropriations work is led by Julie Haney's two-decade record inside House Appropriations and on the legislative side of state spending decisions.

**What we do, in practice:**

- **Article and rider strategy.** Writing language that survives subcommittee, full committee, floor, and conference.
- **LBB engagement.** Working with Legislative Budget Board staff on the technical posture that determines whether a priority lives.
- **Agency coordination.** Aligning client priorities with the agency's exceptional item requests and base budget posture.
- **Interim appropriations hearings.** Showing up where the next budget is actually being written.
- **Communications around the budget.** Translating Article II / III / V into language a board can read.

**Who hires us for this:** health systems, higher education partners, nonprofits, infrastructure clients, and any organization whose annual planning depends on a line item or a rider.

**CTA.** *Talk to us about a budget priority.*

### 4.4 Public Affairs & Communications (detail page)

**H1.** *Public Affairs & Communications.*

**Lede.**

> The same week, you may need to brief a member, a board chair, and a reporter on the same issue. The through-line cannot drift. Our public affairs and communications work is built around that discipline.

**What we do, in practice:**

- **Narrative development.** Constructing and stress-testing the client's positioning before anyone needs to use it.
- **Message architecture.** Member talking points, board memos, press lines, and one-pagers — drafted to a single, defensible standard.
- **Legislature 101.** Half-day and full-day trainings for boards, executives, and association members on how the Texas Legislature actually works.
- **Press preparation.** On-the-record, off-the-record, background — and the judgment to know which conversation you are in.
- **Crisis posture.** The first 48 hours of an unfavorable cycle, with a plan instead of a panic.

**Who hires us for this:** trade associations whose boards need to be educated as well as represented; clients with national press exposure on Texas issues; companies whose Texas footprint has become a story.

**CTA.** *Sharpen your message.*

### 4.5 Parliamentary & Procedural Consulting (detail page)

**H1.** *Parliamentary & Procedural Consulting.*

**Lede.**

> Through Robert Haney's national role as a parliamentary authority and past President of the American Society of Legislative Clerks and Secretaries, the firm consults to legislative bodies on the rules, technology, and procedures that make modern chambers work. The same fluency benefits private clients in procedurally complex Texas engagements.

**What we do, in practice:**

- **Legislative modernization.** Advising chambers on the transition from paper-era procedure to integrated digital workflows.
- **Rules and procedure review.** Working with leadership and clerks' offices on standing rules, calendar mechanics, and floor management.
- **Chamber technology.** Specifying, evaluating, and overseeing the systems that modern legislative bodies depend on.
- **Private-client procedural counsel.** Procedural strategy for Texas engagements where rule fluency determines outcome.

**Who hires us for this:** state legislatures, clerks' offices, and parliamentary bodies; private clients with Texas matters where procedure is decisive.

**CTA.** *Consult on a procedural project.*

---

## 5. Content Hierarchy Rules

These rules govern every page and every reusable component on the site. They are how we keep the site from feeling generic as it grows.

### 5.1 Headline hierarchy

| Level | Use | Type spec |
|---|---|---|
| Eyebrow | Section orientation, all caps small | Sans tracked 13–14, ~70% opacity |
| H1 | One per page, the page's promise | Display serif 64–88 desktop |
| H2 | Section headline, one per section | Display serif 36–48 desktop |
| H3 | Card or column header | Serif 24–28 desktop |
| H4 | Sub-label inside a card | Sans semibold 16–18 |
| Body | Reading copy | Serif or sans, 17/30 desktop |
| Caption | Photo and footnote text | Sans 13–14, 60% opacity |

### 5.2 Voice rules

1. **Specificity over enthusiasm.** *Article II, rider, conference, interim charge* over *legislative process.*
2. **Verbs over adjectives.** *Wrote the language* over *Crafted strategic positioning.*
3. **Names over generics.** Where possible, name the Speaker, the committee, the bill. Where not, describe the structural role: *the appropriations chair, the calendars committee.*
4. **Short over symmetric.** Two short sentences beat one balanced one.
5. **No firm-as-hero language.** Never *We are passionate / proud / committed / honored*. Always *clients hire us to / the engagement resolved / the outcome was.*

### 5.3 Banned phrases

> *Trusted advisor · strategic partner · cutting-edge · top-notch · passionate about · committed to excellence · make your voice heard · seat at the table · navigate the process · move the needle · world-class · best-in-class · proven track record · drive results · synergy · leverage.*

These phrases will not appear anywhere on the site. They mark a firm as indistinguishable.

### 5.4 CTA hierarchy

| Tier | Label | Style | Use |
|---|---|---|---|
| Primary | Schedule a Confidential Consultation | Amber solid pill | Hero, closing CTA, contact page |
| Primary alt | Discuss Your Issue | Amber solid pill | Service / industry detail pages |
| Secondary | See Recent Work | Ghost outline | Hero, mid-page |
| Tertiary | Subscribe to the Session Briefing | Text + arrow | Insights, footer |
| Quiet | Read Robert's biography | Underline text link | Principal area, About page |

---

## 6. Design System for the Homepage

A focused subset of the full system, sufficient to build the homepage as specified.

### 6.1 Color palette (working hex values)

| Token | Hex | Use |
|---|---|---|
| `--navy-900` | `#0B1228` | Primary background |
| `--navy-800` | `#10183A` | Secondary band |
| `--navy-700` | `#16204E` | Card backgrounds |
| `--ink-1000` | `#06091A` | Closing CTA panel, footer |
| `--ivory-50` | `#F5F1E8` | Trust-strip background, hover inversions |
| `--white` | `#FFFFFF` | Primary text on dark |
| `--mute-300` | `#C2C8DA` | Secondary text on dark |
| `--amber-500` | `#C9892A` | Primary CTA, accent rules, numerals |
| `--amber-300` | `#E1B265` | Hover state and small accents |
| `--rule` | `#1F2B52` | Hairlines on dark |

Amber is used sparingly. It is the firm's single accent color. No other accent.

### 6.2 Typography pairing (recommended)

- **Display.** *Tiempos Headline* or *Ogg* (paid), or *Fraunces* (open source, free) for a high-contrast transitional serif with a Capitol register.
- **Body.** *GT America Standard* or *Söhne* (paid), or *Inter* (open source) for clean, neutral sans-serif body and UI.
- Pairings are tested at 360px, 768px, 1280px, and 1920px viewports.

### 6.3 Spacing scale

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192` (in px). All section vertical padding pulled from `96 / 128 / 192` depending on weight.

### 6.4 Grid

12-column grid, 80px outer margin desktop, 24px outer margin mobile, 24px gutters desktop / 16px mobile.

### 6.5 Imagery direction

- **Capitol architecture.** Commissioned at golden hour and blue hour. House chamber, rotunda, exterior dome, library, hallway columns. No people in architectural shots — let the Capitol be the Capitol.
- **Principal portraiture.** One shoot, one stylist, one photographer. 4:5 ratio. Editorial register: slight off-camera gaze, restrained color grade, soft natural light. Never both principals together in a "team photo"; the parity is enforced by symmetric solo portraits.
- **No stock.** No handshakes. No gavels. No state-flag composite headers. No "team meeting" candids.

### 6.6 Iconography

A small custom set of 8 monoline icons for the industries grid, drawn in a single weight on a 24px grid, in `--amber-500`. No filled icons. No icon library defaults.

### 6.7 Motion

- Section enter: 600ms opacity + 16px upward translate, ease-out.
- Card hover: 200ms lift (translateY −2px), border-color shift, arrow translateX 4px.
- No parallax. No autoplay video. No carousels.

### 6.8 Accessibility

- WCAG 2.2 AA across every color pairing.
- Focus states visible on every interactive element.
- Reduced-motion media query disables enter animations.
- All Capitol imagery has descriptive alt text.

---

## 7. Microcopy and Interaction Details

The places where most lobby-firm sites give themselves away.

### 7.1 Form labels (Contact page)

```
Your name
Organization
Your role
What kind of issue?
   ┌──────────────────────────────────────┐
   │  Select one                        ▾ │
   │   Legislative (bill in motion)        │
   │   Appropriations / budget             │
   │   Communications / public affairs     │
   │   Parliamentary / procedural          │
   │   Not sure yet                        │
   └──────────────────────────────────────┘
Tell us briefly what you are trying to accomplish.
Best way to reach you
Best time to talk

[ ] Yes, I'd like to subscribe to the Session Briefing.

[ Send Inquiry ]

Inquiries are confidential. Most are answered the same business day.
```

### 7.2 Confirmation message

> Thank you. Your inquiry has been received by Robert and Julie. We'll be in touch within one business day — sooner if your matter is time-sensitive. If you need to reach us in the meantime, please call **(512) 925-5000**.

### 7.3 404 page

> This page is no longer in session.
>
> The page you were looking for has been adjourned. The Capitol is still standing — please return to the [homepage](/) or call us at **(512) 925-5000**.

### 7.4 Cookie / privacy notice

Plain English, single sentence, dismissable.

> We use a small amount of analytics to understand how visitors use this site. We do not sell data, and we do not use ad-tracking cookies.

---

## 8. SEO and Page Title Plan (Homepage Priority)

| Element | Value |
|---|---|
| Page title | The Haney Group · Texas Government Affairs & Legislative Strategy |
| Meta description | A boutique Austin government affairs firm led by former Chief Clerk of the Texas House Robert Haney and senior appropriations strategist Julie Haney. Representing associations, companies, local governments, and health systems at the Texas Capitol. |
| H1 | *Inside the Capitol. On your side of the table.* |
| OG image | Commissioned Capitol photograph, 1200×630, with logo lockup and primary tagline. |
| Schema | `Organization` + `ProfessionalService` + `Person` (Robert, Julie) + `BreadcrumbList`. |
| Canonical | `https://www.haney-group.com/` |

Primary keyword targets for the homepage: *Texas government affairs firm, Texas lobbying firm, Austin lobbying firm, Texas legislative strategy.* Industry and service pages absorb the long-tail traffic.

---

## 9. Implementation Notes for Build

A short, opinionated set of choices that protect the design from drifting during build.

1. **Static-first.** Next.js App Router (or Astro) with islands of interactivity only for the form, the menu, and the Insights subscribe. No client-rendered hero. SSG everything that does not change daily.
2. **Headless CMS for Insights only.** Sanity (recommended) or Contentful. Marketing pages live in code — they should not be editable from a CMS while the brand voice is being established.
3. **Self-hosted fonts.** Two families maximum. `font-display: swap`. Subset to Latin.
4. **Image pipeline.** Next/Image or `astro:assets`. AVIF + WebP fallbacks. Width descriptors at 360, 768, 1280, 1920.
5. **Form handling.** Form submissions route to a private SMTP inbox plus a CRM (HubSpot Free or Folk). The form *never* writes to a public service.
6. **Analytics.** Plausible or Fathom (privacy-first), not Google Analytics 4. The brand is allergic to cookie banners; a privacy-first analytics tool removes the need for one in most jurisdictions.
7. **Accessibility CI.** axe-core or Pa11y in CI on every PR, blocking on AA failures.
8. **Lighthouse budget.** Performance ≥ 95, Accessibility ≥ 100, Best Practices ≥ 95, SEO ≥ 100. These are enforced on staging.

---

## 10. What This Page Is Not

A short closing discipline list, included here so reviewers can challenge the design against it.

- **Not a brochure.** The homepage is a conversion tool. Every section either earns trust or invites action.
- **Not a portfolio.** Selected engagements are anonymized and structured; the page does not chase logos.
- **Not a personality site.** Robert and Julie are present, but the firm is the protagonist.
- **Not a template.** Every section has a reason for its order, weight, and copy. If a section cannot survive the question *"why is this here?"* — it gets cut.
- **Not a tagline machine.** *Inside the Capitol. On your side of the table.* is the single line that earns repetition. No second tagline competes with it.

---

*This document is the working blueprint for the redesigned haney-group.com homepage. Pair with `haney-group-redesign-foundation.md` for the strategic rationale behind every choice made above.*
