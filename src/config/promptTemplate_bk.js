/**
 * AI Generation Prompt Templates
 * 
 * Available placeholders:
 * - {ROOM_TYPE}: Selected room type (e.g., "Living Room")
 * - {STYLE}: Selected design style (e.g., "K. Wah Luxury")
 * - {BUDGET_FROM}: Budget lower bound with formatting (e.g., "100,000")
 * - {BUDGET_TO}: Budget upper bound with formatting (e.g., "500,000")
 */

export const promptTemplates = {
    // Soft Decoration Focused Prompt (Detailed)
    softDecoration: `Design a high-end "soft decoration" solution for the uploaded interior photo of a {ROOM_TYPE}.
  Use the provided inspiration references to create a cohesive, magazine-level interior styling.
  Keep the original architecture, wall texture, ceiling, floor material, furniture shape, and camera angle unchanged.
  Only add or replace movable soft decoration elements and styling accessories.
  The final result must look photorealistic, magazine-level interior styling, natural lighting, realistic shadows, consistent perspective.
  
  🎯 Budget Constraint
  
  The total soft decoration selection must stay within HKD {BUDGET_FROM} to {BUDGET_TO}.
  Choose materials and brands realistically based on budget:
  
  Lower budget: simple fabrics, ready-made curtains, affordable rug, basic lighting accents
  
  Higher budget: custom curtains, wool/silk rug, designer cushions, premium decor objects, better lighting fixtures
  
  ✅ Soft Decoration Items to Add (Required)
  
  Add a cohesive soft-furnishing package including:
  
  Area Rug
  
  Place a large modern rug under the dining table (extends beyond chairs when pulled out).
  
  Style: {STYLE} aesthetic with minimal luxury, subtle texture, not too patterned.
  
  Color: warm grey / beige / sand with slight terracotta accents to match the overall design.
  
  Curtains / Window Treatment
  
  Add curtains for the glass-side area (if visible) OR design subtle wall-side fabric drape panels as a softening element.
  
  Use layered look: sheer + thicker outer layer (depending on budget range).
  
  Color: off-white sheer + warm taupe/stone outer curtain.
  
  Cushions / Throws
  
  Add 2–4 cushions on bench/chairs (if bench exists) OR style a nearby accent chair area with cushions.
  
  Add one folded throw blanket with premium texture (linen/wool blend feel).
  
  Accent color: muted terracotta / clay / burnt orange to echo the artwork.
  
  Table Styling (Soft Decor Accents)
  
  Add a table runner or placemats (linen texture).
  
  Add a center decor set: a low modern tray + ceramic vase + minimal flowers/greenery.
  
  Keep it clean and not cluttered.
  
  Decorative Lighting Accent
  
  Add one movable lighting element: a floor lamp OR a minimal table lamp on a side surface.
  
  Warm color temperature (2700K–3000K), soft glow, luxury minimal design.
  
  Indoor Plants / Green Accent
  
  Add a modern planter with greenery with elegant styling, not tropical messy.
  
  Keep the plant styling elegant and refined.
  
  Optional Upgrade (Only if budget allows)
  
  Replace or enhance the artwork with a more premium abstract art print matching the {STYLE} aesthetic.
  
  Must maintain modern gallery style: neutral base + accent highlights.
  
  🎨 Style Direction
  
  Overall mood: {STYLE} with modern luxury + calm minimal approach
  
  Materials: linen, wool texture, matte ceramics, warm metal accents (brass/black steel)
  
  Colors: concrete grey + warm beige + soft taupe + terracotta accents
  
  Avoid: overly colorful patterns, cheap shiny materials, cluttered decor
  
  📌 Output Requirements
  
  Produce 1 final rendered image that looks like a real interior photo after styling.
  
  The room should feel more warm, premium, and lived-in, but still minimalist.
  
  Ensure everything fits naturally and respects scale, lighting, and realism.
  
  Budget-appropriate material quality and finish level must be evident in the final render.`,
  
    // Original Full Renovation Prompt
    fullRenovation: `Using the provided image of a raw property, Professional interior design rendering of this {ROOM_TYPE}. Transform the empty space into a {STYLE} aesthetic specifically optimized for a compact Hong Kong apartment with a renovation budget of HKD {BUDGET_FROM} to {BUDGET_TO}. Use light-toned oak wood, neutral color palettes, and integrated smart storage to maximize the footprint. Incorporate premium materials and finishes appropriate for the budget range. Enhance with soft, natural daylight from windows and warm ambient recessed lighting. Ensure the layout is functional yet spacious, reflecting the luxury level of the specified budget. High-resolution, photorealistic, architectural photography style.`,
  
    // Compact Prompt (For faster generation)
    compact: `Transform this {ROOM_TYPE} into a {STYLE} interior design with a budget of HKD {BUDGET_FROM} to {BUDGET_TO}. Include premium materials appropriate for the budget. High-resolution, photorealistic rendering.`
  };
  
  // Default prompt template to use
  export const DEFAULT_TEMPLATE = 'softDecoration';
  