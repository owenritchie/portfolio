# Product

## Register

brand

## Users

Hiring managers, recruiters, and engineering leads evaluating Owen Ritchie for data, analytics, and software roles, plus collaborators and peers arriving from a link in an application or a message. They land with a specific question ("is this person worth a conversation?") and a short attention budget, usually mid-workday on a laptop, often after skimming several other portfolios in the same sitting. The job to be done is fast credibility: see real shipped work, understand the range, and find a way to make contact without hunting.

## Product Purpose

A personal portfolio at owenritchie.ca that presents Owen's projects, background, and contact routes as a single considered piece of design work. Success is a visitor who remembers the site specifically, trusts the work behind it, and reaches out. Because the site is itself a work sample, the craft of the interface carries as much weight as the content it holds.

## Brand Personality

Crafted and editorial. Print-magazine sensibility applied to the web: considered typography with a real display face (Myflora) against a serif (Grenze) and a workhorse sans (Inter), generous margins, texture and paper-like depth, restraint in color but conviction where color appears. The voice is direct and unfussy, never salesy, never cute. Emotionally it should read as calm confidence, with enough personality in the details that it feels like a person made it rather than a template.

## Anti-references

- **Neon dev portfolio.** No black-and-glowing-cyan, no terminal cosplay, no matrix rain, no monospace-everything. The dark theme is a duotone with real hue, not a neon-on-black tech trope.
- **Corporate agency minimal.** No sterile white expanses, no tiny type floating in nothing, no stock photography, no emptiness mistaken for sophistication.
- Also avoid the generic SaaS landing shape: gradient-blob hero, identical three-up feature cards, undifferentiated Inter.

## Design Principles

1. **The site is the work sample.** Every surface should survive inspection by someone who builds interfaces for a living. Sloppy seams, misaligned rhythm, and unconsidered defaults cost more here than on an ordinary site.
2. **Texture over flatness, depth over decoration.** Grain, layered gradients, and paper-like dimension are welcome, but each layer must be legible as a deliberate choice. Effects that read as noise or muddiness are worse than nothing.
3. **Editorial pacing.** Vary spacing and scale to create rhythm and hierarchy the way a magazine spread does. Uniform padding everywhere is the failure mode.
4. **Content is data-driven.** Sections are fed by editable JSON in `public/config/`. New sections follow that pattern so content can change without touching markup.
5. **Both themes are first-class.** Light (green, drawn from photography) and dark (blue and magenta duotone) each get deliberate treatment. Neither is an afterthought derived from the other by inversion.

## Accessibility & Inclusion

Target WCAG 2.1 AA. Body and link text must clear 4.5:1 against their actual rendered backgrounds in both themes, including over gradients and texture overlays. Decorative layers (grain, tint, gradient washes) are `pointer-events: none` and never carry meaning on their own. Interactive elements keep visible focus states and hit targets of at least 44px on touch. Motion is purposeful and short; respect `prefers-reduced-motion` for reveal and ambient animation.
