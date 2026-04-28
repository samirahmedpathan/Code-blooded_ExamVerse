/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: "#1A2421",
    tint: "#2F4F3A",

    // Core surfaces
    background: "#F7F9F5",
    foreground: "#1A2421",

    // Cards / elevated surfaces
    card: "#FFFFFF",
    cardForeground: "#1A2421",

    // Primary action color (buttons, links, active states)
    primary: "#2F4F3A",
    primaryForeground: "#FFFFFF",

    // Secondary / less-emphasis interactive surfaces
    secondary: "#E3E8E1",
    secondaryForeground: "#1A2421",

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: "#E3E8E1",
    mutedForeground: "#6B7F72",

    // Accent highlights (badges, selected items, focus rings)
    accent: "#E3E8E1",
    accentForeground: "#1A2421",

    // Destructive actions (delete, error states)
    destructive: "#E06B6B",
    destructiveForeground: "#FFFFFF",

    // Borders and input outlines
    border: "#CDE0D4",
    input: "#CDE0D4",
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 12,
};

export default colors;
