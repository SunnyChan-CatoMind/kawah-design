/**
 * AI Generation Prompt Templates
 * * Available placeholders:
 * - {ROOM_TYPE}: Selected room type (e.g., "Living Room")
 * - {STYLE}: Selected design style (e.g., "Modern Grandeur")
 * - {BUDGET_FROM}: Budget lower bound (e.g., "100,000")
 * - {BUDGET_TO}: Budget upper bound (e.g., "500,000")
 * - {SCENE_DESCRIPTION}: The technical analysis provided by Step 1
 */

export const promptTemplates = {
  // --- NEW: ESTATE COMMON AREA WORKFLOW ---

  /**
   * STEP 1: Scene Analysis
   * Used to map the physical constraints of HK residential estates.
   */
/*  analyzeScene: `Analyze this site photo of a Hong Kong residential estate common area {ROOM_TYPE}. 
Provide a concise, technical description of the scene for an interior designer. Please identify:
1. Structural Layout: Where are the walls, doors, and elevator banks?
2. Existing Furniture: List any furniture currently in the room and their positions (left, right, center).
3. Materials & Colors: What are the floor and wall materials (e.g., beige marble, wood slats)?
4. Lighting: Where is the primary light source coming from?
5. Vacant Zones: Identify the specific empty floor areas where new furniture or decor could be placed without blocking paths.`,
*/
  /**
   * STEP 2: Final Design Transformation
   * Merges the analysis with the desired luxury aesthetic.
   */
/*  estateCommonArea: `Context: {SCENE_DESCRIPTION}.
Task: Perform a holistic interior design enhancement. Act as a professional interior architect using the description above as a structural map. 

Strictly preserve all existing furniture and structural elements mentioned—do not remove or alter them. 
Enhance the environment in a {STYLE} aesthetic by adding sophisticated wall treatments and ambient lighting. 
Place 'match-the-scene' Art Deco accents and complementary furniture only in the identified 'Vacant Zones.' 

Ensure all new items match the existing perspective, light temperature, and shadows of the original photo. 
Keep all paths to doorways and elevators completely clear. 
8k photorealistic architectural render.`,*/

// Combined Two-Step Soft Decoration Template

  softDecoration: `[STEP 1: INTERNAL ANALYSIS]
Analyze this site photo of a Hong Kong residential estate common area {ROOM_TYPE}. 
Provide a concise, technical description of the scene for an interior designer. Please identify:
1. Structural Layout: Where are the walls, doors, and elevator banks?
2. Existing Furniture: List any furniture currently in the room and their positions (left, right, center).
3. Materials & Colors: What are the floor and wall materials (e.g., beige marble, wood slats)?
4. Lighting: Where is the primary light source coming from?
5. Vacant Zones: Identify the specific empty floor areas where new furniture or decor could be placed without blocking paths.

[STEP 2: FINAL DESIGN TRANSFORMATION]
Using the analysis from Step 1 as a structural map, Perform a holistic interior design enhancement. Act as a professional interior architect using the description above as a structural map. 

Strictly preserve all existing furniture and structural elements mentioned—do not remove or alter them. 
Enhance the environment in a {STYLE} aesthetic by adding sophisticated wall treatments and ambient lighting. 
Place 'match-the-scene' Art Deco accents and complementary furniture only in the identified 'Vacant Zones.' 

Ensure all new items match the existing perspective, light temperature, and shadows of the original photo. 
Keep all paths to doorways and elevators completely clear. 
8k photorealistic architectural render.`,

  fullRenovation: `Using the provided image of a raw property, Professional interior design rendering of this {ROOM_TYPE}. 
Transform the empty space into a {STYLE} aesthetic specifically optimized for a compact Hong Kong apartment with a renovation budget of HKD {BUDGET_FROM} to {BUDGET_TO}. 
Use light-toned oak wood, neutral color palettes, and integrated smart storage. 
High-resolution, photorealistic, architectural photography style.`,

  compact: `Transform this {ROOM_TYPE} into a {STYLE} interior design with a budget of HKD {BUDGET_FROM} to {BUDGET_TO}. 
Include premium materials appropriate for the budget. High-resolution, photorealistic rendering.`
};

export const DEFAULT_TEMPLATE = 'softDecoration';