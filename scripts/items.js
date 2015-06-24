var ITEMS = [
    { id: "Abyssal Blade", cost: 6750, url: 'http://cdn.dota2.com/apps/dota2/images/items/abyssal_blade_lg.png' },
    { id: "Aghanim's Scepter", "cost": 4200, url: 'http://cdn.dota2.com/apps/dota2/images/items/ultimate_scepter_lg.png' },
    { id: "Animal Courier", cost: 120, url: 'http://cdn.dota2.com/apps/dota2/images/items/courier_lg.png' },
    { id: "Arcane Boots", "cost": 1350, url: 'http://cdn.dota2.com/apps/dota2/images/items/arcane_boots_lg.png' },
    { id: "Armlet of Mordiggian", cost: 2370, url: 'http://cdn.dota2.com/apps/dota2/images/items/armlet_lg.png' },
    { id: "Assault Cuirass", cost: 5250, url: 'http://cdn.dota2.com/apps/dota2/images/items/assault_lg.png' },
    { id: "Band of Elvenskin", cost: 450, url: 'http://cdn.dota2.com/apps/dota2/images/items/boots_of_elves_lg.png' },
    { id: "Battle Fury", cost: 4575, url: 'http://cdn.dota2.com/apps/dota2/images/items/bfury_lg.png' },
    { id: "Belt of Strength", cost: 450, url: 'http://cdn.dota2.com/apps/dota2/images/items/belt_of_strength_lg.png' },
    { id: "Black King Bar", cost: 3975, url: 'http://cdn.dota2.com/apps/dota2/images/items/black_king_bar_lg.png' },
    { id: "Blade Mail", cost: 2200, url: 'http://cdn.dota2.com/apps/dota2/images/items/blade_mail_lg.png' },
    { id: "Blade of Alacrity", cost: 1000, url: 'http://cdn.dota2.com/apps/dota2/images/items/blade_of_alacrity_lg.png' },
    { id: "Blades of Attack", cost: 420, url: 'http://cdn.dota2.com/apps/dota2/images/items/blades_of_attack_lg.png' },
    { id: "Blink Dagger", cost: 2250, url: 'http://cdn.dota2.com/apps/dota2/images/items/blink_lg.png' },
    { id: "Bloodstone", cost: 4900, url: 'http://cdn.dota2.com/apps/dota2/images/items/bloodstone_lg.png' },
    { id: "Boots of Speed", cost: 450, url: 'http://cdn.dota2.com/apps/dota2/images/items/boots_lg.png' },
    { id: "Boots of Travel", cost: 2450, url: 'http://cdn.dota2.com/apps/dota2/images/items/travel_boots_lg.png' },
    { id: "Boots of Travel 2", cost: 4450, url: 'http://cdn.dota2.com/apps/dota2/images/items/travel_boots_lg.png' },
    { id: "Bottle", cost: 700, url: 'http://cdn.dota2.com/apps/dota2/images/items/bottle_lg.png' },
    { id: "Bracer", cost: 525, url: 'http://cdn.dota2.com/apps/dota2/images/items/bracer_lg.png' },
    { id: "Broadsword", cost: 1200, url: 'http://cdn.dota2.com/apps/dota2/images/items/broadsword_lg.png' },
    { id: "Buckler", cost: 800, url: 'http://cdn.dota2.com/apps/dota2/images/items/buckler_lg.png' },
    { id: "Butterfly", cost: 5875, url: 'http://cdn.dota2.com/apps/dota2/images/items/butterfly_lg.png' },
    { id: "Chainmail", cost: 550, url: 'http://cdn.dota2.com/apps/dota2/images/items/chainmail_lg.png' },
    { id: "Circlet", cost: 165, url: 'http://cdn.dota2.com/apps/dota2/images/items/circlet_lg.png' },
    { id: "Clarity", cost: 50, url: 'http://cdn.dota2.com/apps/dota2/images/items/clarity_lg.png' },
    { id: "Claymore", cost: 1400, url: 'http://cdn.dota2.com/apps/dota2/images/items/claymore_lg.png' },
    { id: "Cloak", cost: 550, url: 'http://cdn.dota2.com/apps/dota2/images/items/cloak_lg.png' },
    { id: "Crimson Guard", cost: 3800, url: 'http://cdn.dota2.com/apps/dota2/images/items/crimson_guard_lg.png' },
    { id: "Crystalys", cost: 2120, url: 'http://cdn.dota2.com/apps/dota2/images/items/lesser_crit_lg.png' },
    { id: "Daedalus", cost: 5520, url: 'http://cdn.dota2.com/apps/dota2/images/items/greater_crit_lg.png' },
    { id: "Dagon 1", cost: 2720, url: 'http://cdn.dota2.com/apps/dota2/images/items/dagon_lg.png' },
    { id: "Dagon 2", cost: 3970, url: 'http://cdn.dota2.com/apps/dota2/images/items/dagon_lg.png' },
    { id: "Dagon 3", cost: 5220, url: 'http://cdn.dota2.com/apps/dota2/images/items/dagon_lg.png' },
    { id: "Dagon 4", cost: 6470, url: 'http://cdn.dota2.com/apps/dota2/images/items/dagon_lg.png' },
    { id: "Dagon 5", cost: 7720, url: 'http://cdn.dota2.com/apps/dota2/images/items/dagon_lg.png' },
    { id: "Demon Edge", cost: 2400, url: 'http://cdn.dota2.com/apps/dota2/images/items/demon_edge_lg.png' },
    { id: "Desolator", cost: 3500, url: 'http://cdn.dota2.com/apps/dota2/images/items/desolator_lg.png' },
    { id: "Diffusal Blade 1", cost: 3150, url: 'http://cdn.dota2.com/apps/dota2/images/items/diffusal_blade_lg.png' },
    { id: "Diffusal Blade 2", cost: 3850, url: 'http://cdn.dota2.com/apps/dota2/images/items/diffusal_blade_lg.png' },
    { id: "Divine Rapier", cost: 6200, url: 'http://cdn.dota2.com/apps/dota2/images/items/rapier_lg.png' },
    { id: "Drum of Endurance", cost: 1850, url: 'http://cdn.dota2.com/apps/dota2/images/items/ancient_janggo_lg.png' },
    { id: "Dust of Appearance", cost: 180, url: 'http://cdn.dota2.com/apps/dota2/images/items/dust_lg.png' },
    { id: "Eaglesong", cost: 3200, url: 'http://cdn.dota2.com/apps/dota2/images/items/eagle_lg.png' },
    { id: 'Enchanted Mango', cost: 150, url: 'http://cdn.dota2.com/apps/dota2/images/items/enchanted_mango_lg.png' },
    { id: "Energy Booster", cost: 900, url: 'http://cdn.dota2.com/apps/dota2/images/items/energy_booster_lg.png' },
    { id: "Ethereal Blade", cost: 4700, url: 'http://cdn.dota2.com/apps/dota2/images/items/ethereal_blade_lg.png' },
    { id: "Eul's Scepter of Divinity", cost: 2850, url: 'http://cdn.dota2.com/apps/dota2/images/items/cyclone_lg.png' },
    { id: "Eye of Skadi", cost: 5675, url: 'http://cdn.dota2.com/apps/dota2/images/items/skadi_lg.png' },
    { id: "Flying Courier", cost: 220, url: 'http://cdn.dota2.com/apps/dota2/images/items/flying_courier_lg.png' },
    { id: "Force Staff", cost: 2250, url: 'http://cdn.dota2.com/apps/dota2/images/items/force_staff_lg.png' },
    { id: "Gauntlets of Strength", cost: 150, url: 'http://cdn.dota2.com/apps/dota2/images/items/gauntlets_lg.png' },
    { id: "Gem of True Sight", cost: 900, url: 'http://cdn.dota2.com/apps/dota2/images/items/gem_lg.png' },
    { id: "Ghost Scepter", cost: 1500, url: 'http://cdn.dota2.com/apps/dota2/images/items/ghost_lg.png' },
    { id: "Glimmer Cape", cost: 1950, url: "http://cdn.dota2.com/apps/dota2/images/items/glimmer_cape_lg.png" },
    { id: "Gloves of Haste", cost: 500, url: 'http://cdn.dota2.com/apps/dota2/images/items/gloves_lg.png' },
    { id: "Guardian Greaves", cost: 5300, url: "http://cdn.dota2.com/apps/dota2/images/items/guardian_greaves_lg.png" },
    { id: "Hand of Midas", cost: 2050, url: 'http://cdn.dota2.com/apps/dota2/images/items/hand_of_midas_lg.png' },
    { id: "Headdress", cost: 600, url: 'http://cdn.dota2.com/apps/dota2/images/items/headdress_lg.png' },
    { id: "Healing Salve", cost: 110, url: 'http://cdn.dota2.com/apps/dota2/images/items/flask_lg.png' },
    { id: "Heart of Tarrasque", cost: 5500, url: 'http://cdn.dota2.com/apps/dota2/images/items/heart_lg.png' },
    { id: "Heaven's Halberd", cost: 3850, url: 'http://cdn.dota2.com/apps/dota2/images/items/heavens_halberd_lg.png' },
    { id: "Helm of Iron Will", cost: 950, url: 'http://cdn.dota2.com/apps/dota2/images/items/helm_of_iron_will_lg.png' },
    { id: "Helm of the Dominator", cost: 1850, url: 'http://cdn.dota2.com/apps/dota2/images/items/helm_of_the_dominator_lg.png' },
    { id: "Hood of Defiance", cost: 2125, url: 'http://cdn.dota2.com/apps/dota2/images/items/hood_of_defiance_lg.png' },
    { id: "Hyperstone", cost: 2000, url: 'http://cdn.dota2.com/apps/dota2/images/items/hyperstone_lg.png' },
    { id: "Iron Branch", cost: 50, url: 'http://cdn.dota2.com/apps/dota2/images/items/branches_lg.png' },
    { id: "Javelin", cost: 1500, url: 'http://cdn.dota2.com/apps/dota2/images/items/javelin_lg.png' },
    { id: "Linken's Sphere", cost: 5175, url: 'http://cdn.dota2.com/apps/dota2/images/items/sphere_lg.png' },
    { id: "Lotus Orb", cost: 4050, url: "http://cdn.dota2.com/apps/dota2/images/items/lotus_orb_lg.png" },
    { id: "Maelstrom", cost: 2800, url: 'http://cdn.dota2.com/apps/dota2/images/items/maelstrom_lg.png' },
    { id: "Magic Stick", cost: 200, url: 'http://cdn.dota2.com/apps/dota2/images/items/magic_stick_lg.png' },
    { id: "Magic Wand", cost: 465, url: 'http://cdn.dota2.com/apps/dota2/images/items/magic_wand_lg.png' },
    { id: "Manta Style", cost: 4950, url: 'http://cdn.dota2.com/apps/dota2/images/items/manta_lg.png' },
    { id: "Mantle of Intelligence", cost: 150, url: 'http://cdn.dota2.com/apps/dota2/images/items/mantle_lg.png' },
    { id: "Mask of Madness", cost: 1800, url: 'http://cdn.dota2.com/apps/dota2/images/items/mask_of_madness_lg.png' },
    { id: "Medallion of Courage", cost: 1200, url: 'http://cdn.dota2.com/apps/dota2/images/items/medallion_of_courage_lg.png' },
    { id: "Mekansm", cost: 2300, url: 'http://cdn.dota2.com/apps/dota2/images/items/mekansm_lg.png' },
    { id: "Mithril Hammer", cost: 1600, url: 'http://cdn.dota2.com/apps/dota2/images/items/mithril_hammer_lg.png' },
    { id: "Mjollnir", cost: 5700, url: 'http://cdn.dota2.com/apps/dota2/images/items/mjollnir_lg.png' },
    { id: "Monkey King Bar", cost: 5400, url: 'http://cdn.dota2.com/apps/dota2/images/items/monkey_king_bar_lg.png' },
    { id: "Moon Shard", cost: 4300, url: "http://cdn.dota2.com/apps/dota2/images/items/moon_shard_lg.png" },
    { id: "Morbid Mask", cost: 900, url: 'http://cdn.dota2.com/apps/dota2/images/items/lifesteal_lg.png' },
    { id: "Mystic Staff", cost: 2700, url: 'http://cdn.dota2.com/apps/dota2/images/items/mystic_staff_lg.png' },
    { id: "Necronomicon 1", cost: 2700, url: 'http://cdn.dota2.com/apps/dota2/images/items/necronomicon_lg.png' },
    { id: "Necronomicon 2", cost: 3950, url: 'http://cdn.dota2.com/apps/dota2/images/items/necronomicon_lg.png' },
    { id: "Necronomicon 3", cost: 5200, url: 'http://cdn.dota2.com/apps/dota2/images/items/necronomicon_lg.png' },
    { id: "Null Talisman", cost: 470, url: 'http://cdn.dota2.com/apps/dota2/images/items/null_talisman_lg.png' },
    { id: "Oblivion Staff", cost: 1650, url: 'http://cdn.dota2.com/apps/dota2/images/items/oblivion_staff_lg.png' },
    { id: "Observer Ward", cost: 75, url: 'http://cdn.dota2.com/apps/dota2/images/items/ward_observer_lg.png' },
    { id: "Octarine Core", cost: 5900, url: "http://cdn.dota2.com/apps/dota2/images/items/octarine_core_lg.png" },
    { id: "Ogre Club", cost: 1000, url: 'http://cdn.dota2.com/apps/dota2/images/items/ogre_axe_lg.png' },
    { id: "Orb of Venom", cost: 275, url: 'http://cdn.dota2.com/apps/dota2/images/items/orb_of_venom_lg.png' },
    { id: "Orchid Malevolence", cost: 4075, url: 'http://cdn.dota2.com/apps/dota2/images/items/orchid_lg.png' },
    { id: "Perseverance", cost: 1750, url: 'http://cdn.dota2.com/apps/dota2/images/items/pers_lg.png' },
    { id: "Phase Boots", cost: 1290, url: 'http://cdn.dota2.com/apps/dota2/images/items/phase_boots_lg.png' },
    { id: "Pipe of Insight", cost: 3525, url: 'http://cdn.dota2.com/apps/dota2/images/items/pipe_lg.png' },
    { id: "Platemail", cost: 1400, url: 'http://cdn.dota2.com/apps/dota2/images/items/platemail_lg.png' },
    { id: "Point Booster", cost: 1200, url: 'http://cdn.dota2.com/apps/dota2/images/items/point_booster_lg.png' },
    { id: "Poor Man's Shield", cost: 500, url: 'http://cdn.dota2.com/apps/dota2/images/items/poor_mans_shield_lg.png' },
    { id: "Power Treads", cost: 1400, url: 'http://cdn.dota2.com/apps/dota2/images/items/power_treads_lg.png' },
    { id: "Quarterstaff", cost: 875, url: 'http://cdn.dota2.com/apps/dota2/images/items/quarterstaff_lg.png' },
    { id: "Quelling Blade", cost: 225, url: 'http://cdn.dota2.com/apps/dota2/images/items/quelling_blade_lg.png' },
    { id: "Radiance", cost: 5225, url: 'http://cdn.dota2.com/apps/dota2/images/items/radiance_lg.png' },
    { id: "Reaver", cost: 3000, url: 'http://cdn.dota2.com/apps/dota2/images/items/reaver_lg.png' },
    { id: "Refresher Orb", cost: 5300, url: 'http://cdn.dota2.com/apps/dota2/images/items/refresher_lg.png' },
    { id: "Ring of Aquila", cost: 1010, url: 'http://cdn.dota2.com/apps/dota2/images/items/ring_of_aquila_lg.png' },
    { id: "Ring of Basilius", cost: 525, url: 'http://cdn.dota2.com/apps/dota2/images/items/ring_of_basilius_lg.png' },
    { id: "Ring of Health", cost: 875, url: 'http://cdn.dota2.com/apps/dota2/images/items/ring_of_health_lg.png' },
    { id: "Ring of Protection", cost: 200, url: 'http://cdn.dota2.com/apps/dota2/images/items/ring_of_protection_lg.png' },
    { id: "Ring of Regen", cost: 350, url: 'http://cdn.dota2.com/apps/dota2/images/items/ring_of_regen_lg.png' },
    { id: "Robe of the Magi", cost: 450, url: 'http://cdn.dota2.com/apps/dota2/images/items/robe_lg.png' },
    { id: "Rod of Atos", cost: 3100, url: 'http://cdn.dota2.com/apps/dota2/images/items/rod_of_atos_lg.png' },
    { id: "Sacred Relic", cost: 3800, url: 'http://cdn.dota2.com/apps/dota2/images/items/relic_lg.png' },
    { id: "Sage's Mask", cost: 325, url: 'http://cdn.dota2.com/apps/dota2/images/items/sobi_mask_lg.png' },
    { id: "Sange", cost: 2050, url: 'http://cdn.dota2.com/apps/dota2/images/items/sange_lg.png' },
    { id: "Sange and Yasha", cost: 4100, url: 'http://cdn.dota2.com/apps/dota2/images/items/sange_and_yasha_lg.png' },
    { id: "Satanic", cost: 5950, url: 'http://cdn.dota2.com/apps/dota2/images/items/satanic_lg.png' },
    { id: "Scythe of Vyse", cost: 5675, url: 'http://cdn.dota2.com/apps/dota2/images/items/sheepstick_lg.png' },
    { id: "Sentry Ward", cost: 200, url: 'http://cdn.dota2.com/apps/dota2/images/items/ward_sentry_lg.png' },
    { id: "Shadow Amulet", cost: 1400, url: 'http://cdn.dota2.com/apps/dota2/images/items/shadow_amulet_lg.png' },
    { id: "Shadow Blade", cost: 2800, url: 'http://cdn.dota2.com/apps/dota2/images/items/invis_sword_lg.png' },
    { id: "Shiva's Guard", cost: 4700, url: 'http://cdn.dota2.com/apps/dota2/images/items/shivas_guard_lg.png' },
    { id: "Silver Edge", cost: 5450, url: "http://cdn.dota2.com/apps/dota2/images/items/silver_edge_lg.png" },
    { id: "Skull Basher", cost: 2950, url: 'http://cdn.dota2.com/apps/dota2/images/items/basher_lg.png' },
    { id: "Slippers of Agility", cost: 150, url: 'http://cdn.dota2.com/apps/dota2/images/items/slippers_lg.png' },
    { id: "Smoke of Deceit", cost: 100, url: 'http://cdn.dota2.com/apps/dota2/images/items/smoke_of_deceit_lg.png' },
    { id: "Solar Crest", cost: 3000, url: "http://cdn.dota2.com/apps/dota2/images/items/solar_crest_lg.png" },
    { id: "Soul Booster", cost: 3200, url: 'http://cdn.dota2.com/apps/dota2/images/items/soul_booster_lg.png' },
    { id: "Soul Ring", cost: 800, url: 'http://cdn.dota2.com/apps/dota2/images/items/soul_ring_lg.png' },
    { id: "Staff of Wizardry", cost: 1000, url: 'http://cdn.dota2.com/apps/dota2/images/items/staff_of_wizardry_lg.png' },
    { id: "Stout Shield", cost: 200, url: 'http://cdn.dota2.com/apps/dota2/images/items/stout_shield_lg.png' },
    { id: "Talisman of Evasion", cost: 1800, url: 'http://cdn.dota2.com/apps/dota2/images/items/talisman_of_evasion_lg.png' },
    { id: "Tango", cost: 125, url: 'http://cdn.dota2.com/apps/dota2/images/items/tango_lg.png' },
    { id: "Town Portal Scroll", cost: 100, url: 'http://cdn.dota2.com/apps/dota2/images/items/tpscroll_lg.png' },
    { id: "Tranquil Boots", cost: 1000, url: 'http://cdn.dota2.com/apps/dota2/images/items/tranquil_boots_lg.png' },
    { id: "Ultimate Orb", cost: 2100, url: 'http://cdn.dota2.com/apps/dota2/images/items/ultimate_orb_lg.png' },
    { id: "Urn of Shadows", cost: 875, url: 'http://cdn.dota2.com/apps/dota2/images/items/urn_of_shadows_lg.png' },
    { id: "Vanguard", cost: 2175, url: 'http://cdn.dota2.com/apps/dota2/images/items/vanguard_lg.png' },
    { id: "Veil of Discord", cost: 2520, url: 'http://cdn.dota2.com/apps/dota2/images/items/veil_of_discord_lg.png' },
    { id: "Vitality Booster", cost: 1100, url: 'http://cdn.dota2.com/apps/dota2/images/items/vitality_booster_lg.png' },
    { id: "Vladmir's Offering", cost: 2325, url: 'http://cdn.dota2.com/apps/dota2/images/items/vladmir_lg.png' },
    { id: "Void Stone", cost: 875, url: 'http://cdn.dota2.com/apps/dota2/images/items/void_stone_lg.png' },
    { id: "Wraith Band", cost: 485, url: 'http://cdn.dota2.com/apps/dota2/images/items/wraith_band_lg.png' },
    { id: "Yasha", cost: 2050, url: 'http://cdn.dota2.com/apps/dota2/images/items/yasha_lg.png' }
];