# Bolt Shear Capacity Calculator — Design Direction

## Three initial approaches

### Theme Name: Drafting Room Ledger
Very Brief Intro: A warm technical-editorial interface inspired by structural calculation sheets, drawing instruments, and engineering notebooks. It makes the calculation feel transparent, deliberate, and reviewable.
Probability: 0.07

### Theme Name: Instrument Panel
Very Brief Intro: A dark, high-contrast control-room interface with dense measurement cues and restrained signal colors. It emphasizes live monitoring and rapid decision-making.
Probability: 0.03

### Theme Name: Civic Steel
Very Brief Intro: A calm public-service calculator with pale stone surfaces, navy typography, and steel-blue accents. It communicates reliability and clarity without feeling institutional or generic.
Probability: 0.08

## Chosen approach: Drafting Room Ledger

### Design Movement
Contemporary technical editorial design: the visual language of a well-maintained structural engineer’s calculation notebook translated into a modern public web tool.

### Core Principles
1. Make the source of every value visible; engineering transparency is part of the interface, not an appendix.
2. Use asymmetry and editorial pacing to distinguish inputs, governing parameters, and outcomes.
3. Treat formulas as primary content with strong typographic hierarchy and generous whitespace.
4. Use color sparingly: navy for authority, warm ivory for paper, and brass-orange only for active decisions and demand.

### Color Philosophy
Warm ivory reduces the visual fatigue of white-on-white technical UIs and creates the feeling of a physical calculation sheet. Deep navy is used for text and structure because it reads as stable and precise. A single brass-orange accent marks the active calculation path, demand, and interactive controls; it should feel like a drafting pencil mark, not a warning color. Pale blue-gray supports data surfaces without competing with the result.

### Layout Paradigm
An asymmetric split editorial layout: a narrow persistent navigation rail, a left-anchored page title and context block, and content modules that step across the page rather than forming a centered dashboard. The main calculator uses a two-column composition: decisions on the left and the live engineering result on the right, with a wide calculation strip beneath.

### Signature Elements
1. A vertical “calculation sheet” index with numbered navigation and small status ticks.
2. Hairline rulework and coordinate-like labels around formulas and data tables.
3. A brass-orange shear-plane marker repeated in toggles, chart demand lines, and result badges.

### Interaction Philosophy
Interactions should feel like changing a value on a live calculation sheet: immediate, quiet, and explainable. Inputs update outputs without a submit button. Hover and focus states reveal source or selection logic rather than decorative effects. Every navigation destination offers a clear route back to the calculator.

### Animation
Use short 160–220ms ease-out transitions for controls, table row highlights, navigation emphasis, and result state changes. On result updates, use a restrained opacity/translate reveal for the changed value only. Charts may draw in with a quick scaleX/opacity transition. Respect prefers-reduced-motion and remove nonessential movement there.

### Typography System
Use Fraunces for display headlines and formulas where a slightly literary serif gives the technical content a sense of authorship. Use IBM Plex Sans for labels, navigation, data, and body copy for excellent numerals and compact engineering UI rhythm. Headlines use tight tracking and high contrast; metadata uses uppercase 0.12em tracking; formulas use tabular numerals.

### Brand Essence
A public bolt shear resistance calculator for engineers, reviewers, and students who need a fast answer that can also be audited. Personality: exacting, calm, transparent.

### Brand Voice
Headlines are concise and declarative. CTAs describe the action or destination, never generic onboarding language. Microcopy explains why a value is selected and which source table governs it.

Example lines:
- “Shear resistance, with the assumptions in view.”
- “Change the joint condition; the sheet recalculates immediately.”

### Wordmark & Logo
Use a custom symbol-first lockup: the generated hex-bolt/shear-plane mark followed by the wordmark “BOLT / SHEAR” in IBM Plex Sans SemiBold with a deliberate slash separator. The mark is always visible in the header and favicon; it is not reduced to a tiny decorative icon.

### Signature Brand Color
Brass Shear `#C57A36` — an ownable drafting-instrument orange that signals the selected shear path without overwhelming the navy-and-ivory field.

## Style Decisions

- Use `/manus-storage/bolt-shear-mark_0480f0be.png` for the brand mark and favicon.
- Use `/manus-storage/bolt-shear-hero_982d4ca7.png` in the Home hero with a dark navy text-safe overlay.
- Use `/manus-storage/engineering-blueprint-texture_2206fcbd.png` sparingly behind page header context bands.
- Never use purple gradients, generic centered dashboard shells, or Inter as the primary font.
- Engineering formulas and symbols are shown in the UI using readable text/math formatting; no engineering formula is defined inside view components.
