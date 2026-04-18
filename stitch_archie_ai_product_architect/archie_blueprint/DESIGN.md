# Design System Document: The Architect’s Canvas

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Curator"**
This design system is built to transform the complexity of product architecture into an environment of clarity and high-tech sophistication. We move away from the "cluttered dashboard" trope and toward a high-end editorial experience. 

The system utilizes **Organic Structuralism**—a philosophy where the UI feels like a precision instrument. We achieve this through intentional asymmetry, extreme tonal depth, and a "less is more" approach to structural lines. The interface does not trap content in boxes; it allows data to breathe within layered, translucent surfaces that mimic the glass and steel of modern architectural feats.

---

## 2. Colors & Surface Philosophy
The palette is rooted in deep, atmospheric navies and slate grays, punctuated by an "Electric Indigo" that signifies action and intelligence.

### The "No-Line" Rule
To maintain a premium feel, **1px solid borders are prohibited for general sectioning.** Boundaries must be defined through:
*   **Background Shifts:** Distinguish the sidebar (`surface-container-low`) from the main stage (`surface`) using tonal contrast alone.
*   **Tonal Transitions:** Use a slightly higher tier (e.g., `surface-container-high`) to denote an active workspace without drawing a line around it.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. We use the **Material Surface Tiers** to create a "Z-axis" of importance:
*   **Base Level:** `surface` (#0b1326) — The infinite canvas.
*   **Low Elevation:** `surface-container-low` (#131b2e) — Used for the collapsible sidebar and secondary utility panels.
*   **High Elevation:** `surface-container-highest` (#2d3449) — Reserved for active modal overlays or focused "Wizard" cards.

### The "Glass & Gradient" Rule
Floating elements (tooltips, dropdowns, and active project cards) must utilize **Glassmorphism**. 
*   **Recipe:** Apply `surface-variant` at 60% opacity with a `20px` backdrop-blur. 
*   **Signature Textures:** Main CTAs should not be flat. Use a subtle linear gradient from `primary` (#adc6ff) to `primary-container` (#005cc6) at a 135-degree angle to give buttons a "lit from within" glow.

---

## 3. Typography
We utilize a pairing of **Plus Jakarta Sans** for high-impact structural headers and **Inter** for data-dense architectural work.

*   **Display & Headlines (Plus Jakarta Sans):** These are the "Wayfinders." Use `display-md` for landing moments and `headline-sm` for workspace titles. They should feel authoritative and airy.
*   **Titles & Body (Inter):** These are the "Workers." `title-md` provides clear labeling for project cards, while `body-md` handles the technical specifications of the product architect tool.
*   **Hierarchy as Brand:** By using a significant scale jump between `headline-lg` (2rem) and `body-md` (0.875rem), we create a high-contrast, editorial look that feels custom-designed rather than templated.

---

## 4. Elevation & Depth
In this design system, shadows and layers are felt, not seen.

*   **The Layering Principle:** Depth is achieved by stacking. Place a `surface-container-lowest` card on a `surface-container-low` section. The subtle shift in hex value creates a soft, natural lift.
*   **Ambient Shadows:** For floating elements, use a "Ghost Shadow." 
    *   *Blur:* 40px | *Opacity:* 6% | *Color:* Tonal match of `on-surface` (#dae2fd).
*   **The "Ghost Border" Fallback:** If a container lacks enough contrast, use a "Ghost Border." Apply the `outline-variant` (#464555) at **15% opacity**. This provides a whisper of a boundary that guides the eye without cluttering the UI.

---

## 5. Components

### Navigation: The Adaptive Sidebar
*   **Expanded (240px):** Typography should be `label-md` with generous 12px vertical padding.
*   **Collapsed (60px):** Icons only, centered. Use `primary` color for the active state indicator—a 4px vertical "light bar" on the far left.

### Buttons: The "Precision" Set
*   **Primary:** Gradient fill (`primary` to `primary-container`), `md` (0.375rem) roundedness. Text is `on-primary` (#002e6a) semi-bold.
*   **Secondary:** Ghost style. No fill, `outline` border at 20% opacity. 
*   **Tertiary:** Text-only with an underline appearing only on hover.

### Form Inputs & Wizards
*   **The Field:** Use `surface-container-highest` as the base. No bottom line; instead, use a subtle `0.25rem` radius.
*   **Focus State:** The border transitions to a 1px `primary` glow with a 4px soft outer spread.
*   **Progress Steppers:** Use a "Minimalist Dot" system. Active steps are `primary` circles; inactive are `outline-variant` rings. No connecting lines; let the proximity of the elements imply the path.

### Project Cards & Workspace Panels
*   **Forbid Dividers:** Never use a horizontal rule to separate list items. Use 16px of vertical white space or a subtle `surface-container-low` hover state background.
*   **Multi-Panel Workspace:** Use a "Pane" approach where each panel is separated by a 4px gap of the base `background` color, creating a "bento-box" look that feels organized and high-tech.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use extreme white space. If you think it’s enough, add 8px more.
*   **Do** use `tertiary` (#ffb695) sparingly for "AI Insights" or "Suggestions" to provide a warm contrast to the cool blues.
*   **Do** lean into the `plusJakartaSans` headers to give the tool a "Premium Magazine" feel.

### Don't:
*   **Don't** use 100% black. The deepest shadow should always be `surface-container-lowest`.
*   **Don't** use "Alert Red" for errors unless critical. Use the `error` (#ffb4ab) token, which is a sophisticated coral that fits the navy palette.
*   **Don't** use heavy dropshadows. If the elevation isn't clear, adjust the surface color tier instead.

---

## 7. Signature Logic
Every interaction in this design system should feel like a "reveal." When a user expands the sidebar or opens a wizard, use a 300ms ease-out transition. Elements shouldn't just appear; they should slide into place with architectural precision.