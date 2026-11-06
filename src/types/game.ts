export type LabId = 'electric' | 'chemistry' | 'physics';

export type TerminalRole =
  | 'pos'       // + DC or Phase (L)
  | 'neg'       // - DC or Neutral (N)
  | 'in'        // Load/Switch input
  | 'out'       // Load/Switch output
  | 'out2'      // Second output (double switch / two-way switch)
  | 'earth';    // Protective Earth (PE)

export interface ComponentTerminal {
  id: string;
  label: string;
  role: TerminalRole;
  color: 'red' | 'blue' | 'amber' | 'green';
  offsetX: number; // % within card (0-100)
  offsetY: number; // % within card (0-100)
}

export type ElectricPartKind =
  | 'aa_battery'
  | 'battery_9v'
  | 'dual_battery'
  | 'solar_panel'
  | 'hand_dynamo'
  | 'armature'
  | 'fan'
  | 'bulb_warm'
  | 'bulb_red'
  | 'bulb_green'
  | 'bulb_blue'
  | 'led_disco'
  | 'buzzer'
  | 'siren'
  | 'toy_car'
  | 'electromagnet'
  | 'crane_winch'
  | 'robot_buddy'
  | 'push_button'
  | 'toggle_switch'
  | 'dimmer_knob'
  | 'light_sensor'
  | 'fuse_box'
  | 'mcb_breaker'
  | 'junction_box'
  | 'wall_switch_1'
  | 'wall_switch_2'
  | 'stair_switch_a'
  | 'stair_switch_b'
  | 'wall_outlet'
  | 'ceiling_lamp'
  | 'chandelier_dual'
  | 'exhaust_fan'
  | 'doorbell_chime';

export type PluggableApplianceKind =
  | 'bedside_lamp'
  | 'table_fan'
  | 'blender'
  | 'television'
  | 'hair_dryer'
  | 'night_star';

export interface ElectricSlotSpec {
  slotId: string;
  partKind: ElectricPartKind;
  customLabel?: string;
  x: number; // % on workbench (10..90)
  y: number; // % on workbench (15..82)
  prePlaced?: boolean;
}

export interface WirePairHint {
  fromSlot: string;
  fromTerm: string;
  toSlot: string;
  toTerm: string;
  wireColor?: string;
}

export interface ElectricLevel {
  id: string;
  lab: 'electric';
  number: number; // 1..90+
  chapter: number; // 1..9
  chapterTitle: string;
  title: string;
  kidPrompt: string;
  scienceTip: string;
  boardTheme: 'wood' | 'tech' | 'wall';
  slots: ElectricSlotSpec[];
  targetLoads: string[]; // slotIds that must get powered to win
  requiresSwitchToggle?: boolean;
  requiresBreakerSafety?: boolean;
  pluggableAppliance?: PluggableApplianceKind;
  hintWires: WirePairHint[];
  isCustomOrUpdate?: boolean;
}

export type ChemIngredientId =
  | 'cola'
  | 'orange_soda'
  | 'water'
  | 'warm_water'
  | 'vinegar'
  | 'lemon_juice'
  | 'oil'
  | 'milk'
  | 'honey'
  | 'cabbage_juice'
  | 'dish_soap'
  | 'red_dye'
  | 'blue_dye'
  | 'yellow_dye'
  | 'salt'
  | 'baking_soda'
  | 'sugar'
  | 'mentos'
  | 'fizz_tablet'
  | 'cornstarch'
  | 'ice_cube'
  | 'raisins'
  | 'pepper'
  | 'sand'
  | 'cotton_filter'
  | 'muddy_water'
  | 'glitter'
  | 'yeast'
  | 'stir_spoon';

export type ChemEffectType =
  | 'foam_geyser'
  | 'volcano_eruption'
  | 'balloon_inflate'
  | 'color_mix'
  | 'density_layers'
  | 'lava_lamp'
  | 'magic_milk'
  | 'pepper_scatter'
  | 'dancing_raisins'
  | 'dissolve_calm'
  | 'ph_color_shift'
  | 'ice_fishing'
  | 'slime_oobleck'
  | 'water_filter'
  | 'crystal_sparkle';

export interface ChemVesselSpec {
  vesselId: string;
  label: string;
  shape: 'beaker' | 'flask' | 'bottle' | 'volcano' | 'dish' | 'balloon_bottle' | 'filter_funnel';
  requiredIngredients: ChemIngredientId[];
  resultEffect: ChemEffectType;
  resultColor: string;
  secondaryColor?: string;
  reactionTitle: string;
}

export interface ChemistryLevel {
  id: string;
  lab: 'chemistry';
  number: number;
  chapter: number;
  chapterTitle: string;
  title: string;
  kidPrompt: string;
  scienceTip: string;
  availableIngredients: ChemIngredientId[];
  vessels: ChemVesselSpec[];
  isCustomOrUpdate?: boolean;
}

export type PhysicsMode =
  | 'magnet_explore'
  | 'magnet_poles'
  | 'sink_float'
  | 'static_balloon'
  | 'balance_scale'
  | 'light_prism'
  | 'ramp_friction'
  | 'wind_energy'
  | 'sound_glasses'
  | 'plant_growth';

export interface PhysicsItemSpec {
  id: string;
  name: string;
  emoji: string;
  color: string;
  // Magnet properties
  isMagnetic?: boolean;
  materialLabel?: string;
  // Sink/float properties
  floats?: boolean;
  // Weight for balance scale (1..10)
  weight?: number;
  // Ramp surface speed (1..10)
  speedFactor?: number;
  // Static charge attraction
  attractedByStatic?: boolean;
  // Plant/Gear/Light step
  isRequiredStep?: boolean;
}

export interface PhysicsLevel {
  id: string;
  lab: 'physics';
  number: number;
  chapter: number;
  chapterTitle: string;
  title: string;
  kidPrompt: string;
  scienceTip: string;
  mode: PhysicsMode;
  items: PhysicsItemSpec[];
  targetGoalCount: number;
  waterIsSalty?: boolean;
  targetWeight?: number;
  isCustomOrUpdate?: boolean;
}

export type GameLevel = ElectricLevel | ChemistryLevel | PhysicsLevel;

export interface LevelPackManifest {
  packId: string;
  version: string;
  title: string;
  description: string;
  releasedAt: string;
  levels: GameLevel[];
}

export interface PlayerProgress {
  completedIds: Record<string, number>; // levelId -> stars (1..3)
  soundEnabled: boolean;
  voiceEnabled: boolean;
  updateManifestUrl: string;
  installedPackIds: string[];
  childName: string;
  customCheerAudioDataUrl?: string;
}
