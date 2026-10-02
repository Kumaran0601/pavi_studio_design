# UI/UX Audit Findings — 2026-09-16

## Responsive screenshots

Desktop, tablet, and mobile screenshots were captured for home, about, services, service detail, classes, materials, gallery, and contact routes. The maroon/antique-gold identity is consistent and the mobile navigation/header is visually stable. Mobile pages correctly reserve space for the fixed bottom CTA bar.

The current mobile experience has no floating WhatsApp assistant bubble; the WhatsApp action is only the center item in the bottom bar. The requested improvement is to add a circular floating WhatsApp control above the lower-right edge, with a tooltip/accessible label and enough bottom offset to avoid overlap.

The newly supplied event photograph is not yet present in the app. It should be used in the About/training story area, not the embroidery hero, because it represents people/training/community rather than a close-up craft texture.

Potential audit items to verify in code/browser: image alt text is overly generic in page intro, dynamic metadata has no absolute OG image normalization, public pages make duplicate home/settings requests, inactive content fallback may be inconsistent, mobile menu button needs visible focus treatment, and fixed/sticky CTAs need safe-area bottom padding on iOS.

## Post-fix browser verification

The updated preview has no browser console output, all internal links returned HTTP 200, the floating WhatsApp assistant has an accessible label and correct desktop offset, the mobile menu announces Open/Close menu, and the contact form fields expose ids, names, autocomplete hints, required state, and invalid-state attributes. The supplied training/community image renders correctly in both About and Classes on mobile. The floating WhatsApp control sits above the fixed mobile CTA without overlap.

The homepage hero background style resolves to the expected managed storage image. The desktop build now emits separate React, vendor, icon, and UI chunks; the primary chunk is smaller than before, though Vite may still report a non-blocking advisory depending on dependency graph size.

## Admin visual verification

Tablet screenshots of `/admin/login` and authenticated `/admin` show the expected maroon sidebar, warm-ivory workspace, clear navigation labels, and an appropriately contained secure-login card. The authenticated screenshot displays the expected loading state while the dashboard data request resolves. The mobile screenshot request was retried after an MCP argument serialization issue; public mobile routes were already verified successfully.
