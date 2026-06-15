# Zepter Careers Visual Style Guide

This guide extracts the current frontend visual identity from the Zepter Careers project so it can be reused when restyling another website. It is based on the current CSS in:

- `client/src/index.css`
- `client/src/styles/home.css`
- `client/src/styles/jobs.css`
- `client/src/styles/info-pages.css`
- `client/src/styles/our-team.css`
- `client/src/styles/human-verification.css`
- `client/src/admin/styles/admin.css`

## 1. Color Palette

### Core Brand Colors

| Token | HEX | Used for | Notes |
| --- | --- | --- | --- |
| `--color-primary-gold` | `#b59c68` | Primary gold buttons, header active states, links, section eyebrows, round icons, form focus borders, modal submit buttons | Main Zepter Careers accent. This is the recommended replacement for cold primary blue. |
| `--color-primary-gold-hover` | `#9f854c` | FAQ link hover, darker gold hover state | Use for text links or subtle hover darkening. |
| `--color-secondary-gold` | `#b89a4f` | Benefit section kicker, numbered badges, gold outlines | Slightly deeper champagne-gold accent. |
| `--color-gold-soft-bg` | `#f4efe4` | Number badges, subtle gold-tinted surfaces | Good for chips or icon circles. |
| `--color-warm-ivory` | `#f0ebe1` | Open positions wrapper, values section background, process cards, date pills | Main warm neutral background. |
| `--color-warm-cream` | `#fffaf0` | Sales consultant card gradient | Use sparingly for warm highlighted panels. |
| `--color-warm-sand` | `#f6efe1` | Sales consultant card gradient | Pairs with white and gold accents. |

### Text Colors

| Token | HEX | Used for | Notes |
| --- | --- | --- | --- |
| `--color-text-strong` | `#102d54` | Main headings, admin text, contact headings, job detail titles | Dominant dark navy text. Keep for readability. |
| `--color-text-heading-alt` | `#1a234f` | Large public headings, modal headings, values headings | Dark ink/navy with a premium tone. |
| `--color-text-heading-soft` | `#1f2a56` | Job cards, secondary headings | Slightly softer heading navy. |
| `--color-text-body` | `#31456a` | Body copy, job metadata, form descriptive text | Primary body text on white/warm surfaces. |
| `--color-text-muted` | `#586984` | Subtitles, helper text, footer notes, metadata | Muted body text. |
| `--color-text-muted-admin` | `#657892` | Admin secondary text | Admin-specific muted tone. |
| `--color-text-placeholder` | `#b4b8c3` | Input placeholders | Soft gray placeholder. |
| `--color-text-dark` | `#111111` | Global body fallback | Used in `index.css`. |

### Background and Surface Colors

| Token | HEX | Used for | Notes |
| --- | --- | --- | --- |
| `--color-bg` | `#ffffff` | Global body, main page sections, cards | The site is mostly white with warm sections. |
| `--color-bg-header` | `#f7f7f7` | Main public header | Light neutral header. |
| `--color-bg-soft` | `#f8fbff` | Contact card, human verification panel, admin list items | Cool-white panel background. |
| `--color-bg-input` | `#f9fbfe` | Upload boxes, admin login inputs | Very light blue-white surface. |
| `--color-bg-admin` | `#f5f7fb` | Admin shell background | Admin-only page background. |
| `--color-bg-admin-gradient-start` | `#f7f9fc` | Admin login gradient | Paired with `#eef3fa`. |
| `--color-bg-admin-gradient-end` | `#eef3fa` | Admin login gradient | Soft cool neutral. |
| `--color-bg-footer-dark` | `#071019` | Dark overlays / root dark variable | Used for hero overlays and dark modal backdrops via rgba. |
| `--color-bg-sidebar` | `#0d2543` | Admin sidebar | Dark navy admin navigation. |

### Borders and Dividers
a
| Token | HEX / RGBA | Used for | Notes |
| --- | --- | --- | --- |
| `--color-border` | `#e5eaf3` | Cards, dividers, board cards | General light border. |
| `--color-border-soft` | `#e0e5ef` | Job mini cards and job details cards | Public job card border. |
| `--color-border-form` | `#ccd2de` | Modal form inputs | Common input border. |
| `--color-border-form-alt` | `#ccd6e4` | Contact form inputs | Slightly bluer input border. |
| `--color-border-admin` | `#dbe3ef` | Admin panels, admin inputs | Admin design token. |
| `--color-border-divider` | `#dde1ea` | Modal header divider | Soft modal separator. |
| `--color-border-gold-soft` | `rgba(181, 156, 104, 0.28)` | Talent pool card border | Gold-tinted panel border. |
| `--color-border-gold-medium` | `rgba(181, 156, 104, 0.42)` | Sales consultant card border | Stronger gold-tinted border. |

### State Colors

| Token | HEX | Used for | Notes |
| --- | --- | --- | --- |
| `--color-success` | `#237a45` | Admin success badges | Strong green. |
| `--color-success-text` | `#1e7143` | Contact success message | Public success text. |
| `--color-success-bg` | `#effaf4` | Contact success message background | Soft green surface. |
| `--color-success-border` | `#c8e6d4` | Contact success border | Soft green border. |
| `--color-danger` | `#c62828` | Public form errors | Main public error red. |
| `--color-danger-admin` | `#c94b4b` | Admin danger token | Admin destructive color. |
| `--color-danger-bg` | `#fae5e5` | Admin danger button background | Soft danger surface. |
| `--color-pdf-red` | `#d32f2f` | PDF upload button gradient end | Utility red, not part of main brand. |

## 2. Main Visual Direction

The current Zepter Careers identity is premium, corporate, elegant, warm, and clean. It does not use gold as a full-page wash. Instead, gold is an accent applied to buttons, icons, active navigation, form focus states, badges, and emphasized labels.

The dominant structure is:

- White main backgrounds.
- Warm ivory/champagne bands for important sections.
- Dark navy text for authority and readability.
- Gold accents for action and brand warmth.
- Soft borders and subtle shadows instead of heavy outlines.
- Rounded cards, pills, and circular icon containers.
- Image-led hero sections with dark overlays where text sits over imagery.

The design feels professional and recruitment-focused: polished, spacious, and approachable, without becoming decorative or overly saturated.

## 3. Typography

The global font is Montserrat:

```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

body {
  font-family: 'Montserrat', Arial, Helvetica, sans-serif;
}
```

Typography patterns:

- Main font family: `'Montserrat', Arial, sans-serif`
- Heading weight: `700`
- Section title sizes:
  - Large hero/page titles: `42px` to `58px`
  - Section headings: `28px` to `38px`
  - Card headings: `17px` to `24px`
- Body text:
  - Public body copy: `14px` to `16px`
  - Job detail body: `12.5px` with tall line height
  - Metadata: `10.5px` to `12.5px`
- Button text:
  - Usually `14px` to `16px`
  - Weight `500`, `600`, or `700`
- Form labels:
  - `14px`
  - Weight `700`
  - Dark navy `#1a234f`
- Eyebrows/kickers:
  - `12px` to `13px`
  - Weight `700`
  - Uppercase in many sections
  - Gold `#b59c68`

Avoid negative letter spacing except very subtle heading tightening already present in places such as `-0.3px` to `-0.8px`.

## 4. Buttons

### Primary Gold Button

Used by header alerts, job apply buttons, modal submit buttons, Sales Consultant CTA.

```css
background: #b59c68;
color: #ffffff;
border: none;
border-radius: 999px; /* for pill CTAs */
font-family: 'Montserrat', Arial, sans-serif;
font-weight: 600 or 700;
transition: transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease;
```

Hover:

```css
transform: translateY(-1px);
opacity: 0.96;
box-shadow: 0 18px 34px rgba(181, 156, 104, 0.26);
```

Use gold primary buttons when the action is brand-led or conversion-oriented.

### Dark Navy Primary Button

Used in some contact/talent pool CTAs.

```css
background: #102d54;
color: #ffffff;
border-radius: 14px or 999px;
box-shadow: 0 14px 28px rgba(16, 45, 84, 0.16);
```

Use this for serious actions where the UI needs authority and strong contrast.

### Secondary / Ghost Button

Admin uses pale neutral secondary buttons:

```css
background: #eef3f9;
color: #102d54;
border-radius: 12px;
```

Public carousel arrows use:

```css
background: #ffffff;
border: 1px solid rgba(181, 156, 104, 0.45);
color: #1a234f;
box-shadow: 0 14px 34px rgba(16, 45, 84, 0.16);
```

Hover for these controls should warm slightly:

```css
background: #f8f4ea;
border-color: #b59c68;
transform: scale(1.06);
```

## 5. Cards and Sections

### Public Section Shells

Typical section background:

```css
background: #ffffff;
padding: 42px 0 56px;
```

Warm section background:

```css
background: #f0ebe1;
padding: 56px 24px 86px;
```

### Warm Highlight Card

Used by Talent Pool / Sales Consultant cards:

```css
border: 1px solid rgba(181, 156, 104, 0.28);
border-radius: 28px;
background:
  linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(244, 248, 252, 0.96) 100%),
  radial-gradient(circle at 14% 16%, rgba(181, 156, 104, 0.12), transparent 36%);
box-shadow: 0 22px 54px rgba(16, 45, 84, 0.08);
padding: 34px 42px;
```

For a warmer variant:

```css
background: linear-gradient(135deg, #ffffff 0%, #fffaf0 48%, #f6efe1 100%);
box-shadow: 0 22px 54px rgba(181, 156, 104, 0.13);
```

### Standard Card

Used by job cards, board cards, FAQ cards, admin panels:

```css
background: #ffffff;
border: 1px solid #e5eaf3;
border-radius: 18px to 28px;
box-shadow: 0 12px 30px rgba(16, 45, 84, 0.05);
```

Hover:

```css
transform: translateY(-4px) to translateY(-6px);
box-shadow: 0 18px 42px rgba(16, 45, 84, 0.12);
border-color: rgba(184, 154, 79, 0.55);
```

### Compact Job Cards

```css
background: #ffffff;
border: 1px solid #e0e5ef;
border-radius: 12px;
padding: 19px 18px 17px;
transition: border-color 0.2s ease, box-shadow 0.2s ease;
```

Active state currently uses a cool border:

```css
border-color: #5f748f;
box-shadow: 0 0 0 1px #5f748f inset;
```

For a warmer migration, this can become:

```css
border-color: #b59c68;
box-shadow: 0 0 0 1px #b59c68 inset;
```

## 6. Forms

Forms are clean, white, rounded, and focused with gold.

### Labels

```css
font-family: 'Montserrat', Arial, sans-serif;
font-size: 14px;
font-weight: 700;
color: #1a234f;
```

### Inputs

```css
height: 44px to 48px;
border: 1px solid #ccd2de;
border-radius: 10px to 13px;
background: #ffffff;
padding: 0 14px or 0 16px;
font-size: 14px;
color: #313131;
outline: none;
transition: border-color 0.2s ease, box-shadow 0.2s ease;
```

### Textareas

```css
min-height: 104px to 150px;
padding: 12px 14px or 14px 16px;
resize: vertical;
```

### Placeholder

```css
color: #a9b2c1; /* contact */
color: #b4b8c3; /* modals */
```

### Focus

```css
border-color: #b59c68;
box-shadow: 0 0 0 4px rgba(181, 156, 104, 0.14);
```

### Upload Areas

```css
border: 1px dashed #bcc5d5;
border-radius: 14px;
background: #f9fbfe;
min-height: 56px;
```

Hover/focus:

```css
border-color: #b59c68;
background: #ffffff;
```

### Errors and Success

Errors:

```css
color: #c62828;
font-size: 13px;
```

Success:

```css
border: 1px solid #c8e6d4;
border-radius: 16px;
background: #effaf4;
color: #1e7143;
```

## 7. Layout and Spacing

### Containers

Large public layout:

```css
width: min(1520px, calc(100% - 56px));
margin: 0 auto;
```

Content sections:

```css
width: min(1240px, calc(100% - 80px));
margin: 0 auto;
```

Compact section inner:

```css
width: min(980px, 100%);
```

### Grid Patterns

- Header: `grid-template-columns: 1fr auto 1fr`
- Job/open positions: `repeat(2, minmax(0, 1fr))`
- Values cards: `repeat(4, 1fr)`
- Board members: `repeat(3, minmax(0, 1fr))`
- Forms: `repeat(2, minmax(0, 1fr))`
- Job detail with QR: `minmax(0, 1fr) 220px`

### Spacing

Common gaps:

- Small controls: `8px` to `12px`
- Form grids: `16px` to `18px`
- Card grids: `18px` to `28px`
- Large content split: `36px` to `72px`

Common padding:

- Small cards: `19px 18px`
- Admin panels: `20px` to `26px`
- Highlight cards: `34px 42px`
- Section padding: roughly `42px` to `88px` vertically

### Responsive Behavior

The design collapses grids to one column on smaller screens. Header nav hides on narrower breakpoints. Cards retain rounded corners but reduce padding. QR/job details and forms stack vertically on mobile.

## 8. Gradients and Decorative Elements

### Image Overlays

Hero overlays use dark transparent gradients:

```css
background: linear-gradient(
  90deg,
  rgba(7, 16, 25, 0.65) 0%,
  rgba(7, 16, 25, 0.4) 45%,
  rgba(7, 16, 25, 0.4) 100%
);
```

Home hero overlay also uses black transparency:

```css
background: linear-gradient(90deg, rgba(0,0,0,0.44), rgba(0,0,0,0.18) 40%, rgba(0,0,0,0.30));
```

### Warm Highlight Panels

```css
background:
  linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(244, 248, 252, 0.96) 100%),
  radial-gradient(circle at 14% 16%, rgba(181, 156, 104, 0.12), transparent 36%);
```

Warmer gold panel:

```css
background: linear-gradient(135deg, #ffffff 0%, #fffaf0 48%, #f6efe1 100%);
```

### Shadows

Use soft navy shadows for neutral cards:

```css
box-shadow: 0 16px 42px rgba(16, 45, 84, 0.08);
box-shadow: 0 22px 54px rgba(16, 45, 84, 0.08);
```

Use soft gold shadows for gold CTAs:

```css
box-shadow: 0 14px 28px rgba(181, 156, 104, 0.22);
box-shadow: 0 18px 34px rgba(181, 156, 104, 0.26);
```

Use stronger black shadows only for modals:

```css
box-shadow: 0 30px 80px rgba(0, 0, 0, 0.28);
```

## 9. Practical Migration Guide

### How to Restyle Another Cold-Blue Website Into This Zepter Careers Gold Style

1. Replace the old primary blue with `#b59c68` for primary brand accents, CTAs, active nav, icon circles, links, and focus states.
2. Keep headings dark navy, preferably `#102d54` or `#1a234f`. Do not make all headings gold.
3. Replace pale blue section backgrounds with warm ivory/champagne, especially `#f0ebe1`, `#fffaf0`, or `#f6efe1`.
4. Keep most page and card surfaces white. The style depends on white space and restrained warmth.
5. Use gold as accent, not wallpaper. If everything is gold, the premium feel disappears.
6. Replace blue-tinted borders with `#e5eaf3`, `#e0e5ef`, or gold-tinted borders such as `rgba(181, 156, 104, 0.28)`.
7. Change focus rings from blue to `rgba(181, 156, 104, 0.14)`.
8. Use soft navy shadows such as `rgba(16, 45, 84, 0.08)` rather than saturated colored shadows.
9. Use rounded cards and pills:
   - Buttons: `999px` for pill CTAs, `12px` to `14px` for full-width form buttons.
   - Cards: `18px` to `28px`.
   - Inputs: `10px` to `13px`.
10. Avoid saturated yellow. This identity is muted champagne-gold, not bright yellow.
11. Keep body text dark and readable. Use `#31456a` for body copy and `#586984` for muted text.
12. Use image overlays with dark navy/black transparency instead of blue overlays.

## 10. Suggested CSS Variables

Use this as a clean token block for another website:

```css
:root {
  --color-primary: #b59c68;
  --color-primary-hover: #9f854c;
  --color-primary-soft: #f4efe4;
  --color-accent: #b89a4f;

  --color-bg: #ffffff;
  --color-bg-warm: #f0ebe1;
  --color-bg-soft: #f8fbff;
  --color-bg-input: #f9fbfe;
  --color-surface: #ffffff;
  --color-surface-warm: #fffaf0;

  --color-text: #102d54;
  --color-text-heading: #1a234f;
  --color-text-body: #31456a;
  --color-text-muted: #586984;
  --color-text-placeholder: #b4b8c3;

  --color-border: #e5eaf3;
  --color-border-soft: #e0e5ef;
  --color-border-input: #ccd2de;
  --color-border-gold: rgba(181, 156, 104, 0.28);

  --color-success: #237a45;
  --color-success-bg: #effaf4;
  --color-danger: #c62828;
  --color-danger-soft: #fae5e5;

  --font-sans: 'Montserrat', Arial, Helvetica, sans-serif;

  --radius-input: 12px;
  --radius-button: 999px;
  --radius-card-sm: 14px;
  --radius-card: 22px;
  --radius-card-lg: 28px;

  --shadow-card: 0 16px 42px rgba(16, 45, 84, 0.08);
  --shadow-card-hover: 0 22px 54px rgba(16, 45, 84, 0.12);
  --shadow-gold: 0 14px 28px rgba(181, 156, 104, 0.22);
  --shadow-modal: 0 30px 80px rgba(0, 0, 0, 0.28);

  --focus-ring: 0 0 0 4px rgba(181, 156, 104, 0.14);
}
```

## 11. Before / After Mapping

| Old cold-blue role | New Zepter Careers style |
| --- | --- |
| Primary blue | `#b59c68` primary gold |
| Blue hover | `#9f854c` darker gold |
| Bright blue CTA shadow | `rgba(181, 156, 104, 0.22)` gold shadow |
| Pale blue page section | `#f0ebe1` warm ivory/champagne |
| Blue-tinted feature panel | White to `#fffaf0` / `#f6efe1` warm gradient |
| Blue active navigation | Gold text `#b59c68` with gold underline |
| Blue icon circle | Gold circle `#b59c68` with white icon |
| Blue border | `#e5eaf3`, `#e0e5ef`, or `rgba(181, 156, 104, 0.28)` |
| Blue input focus | Gold border `#b59c68` plus `rgba(181, 156, 104, 0.14)` focus ring |
| Blue badge background | Warm pale badge `#f4efe4` with `#b89a4f` text |
| Blue card shadow | Soft navy shadow `rgba(16, 45, 84, 0.08)` |
| Saturated blue body text | `#31456a` body text and `#586984` muted text |
| Cold dark blue heading | Keep dark navy, prefer `#102d54` or `#1a234f` |
| Blue hero overlay | Dark neutral/navy overlay `rgba(7, 16, 25, 0.4-0.65)` |

## 12. Quick Implementation Notes

- Start with color tokens first, then buttons, then cards and forms.
- Keep layout and typography mostly unchanged when migrating a different site.
- Convert the most visible CTAs to gold first.
- Convert section backgrounds to warm neutral second.
- Convert focus/hover states last so the interface feels cohesive.
- Do not remove contrast. Gold is an accent; dark navy remains the readability anchor.
- If a page starts to look too beige, restore more white space and use gold only for calls to action.

## Copy-Paste Prompt For Another Codex Chat

Use the visual identity from `ZEPTER_CAREERS_STYLE_GUIDE.md` to restyle this site away from cold blues and toward the Zepter Careers warm gold identity. Use `#b59c68` as the primary accent for CTAs, active nav, links, icons, and focus states; keep headings dark navy (`#102d54` or `#1a234f`); use warm ivory/champagne backgrounds (`#f0ebe1`, `#fffaf0`, `#f6efe1`) for selected sections; keep cards mostly white with soft borders (`#e5eaf3`) and subtle navy shadows (`rgba(16, 45, 84, 0.08)`). Do not overuse bright yellow or make all text gold. Preserve the existing layout unless a small spacing/radius adjustment is needed to match the guide.
