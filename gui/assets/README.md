# Assets Directory

Place your character and enemy images here.

## Directory Structure

```
gui/assets/
├── player.png          # Player/Hero image
└── enemies/
    ├── goblin_warrior.png
    ├── toxic_slime.png
    ├── orc_berserker.png
    ├── fire_drake.png
    ├── skeleton_warrior.png
    ├── dark_wizard.png
    ├── forest_troll.png
    ├── venomous_spider.png
    ├── ice_elemental.png
    └── thunder_wolf.png
```

## Image Naming Convention

- **Player image**: `player.png` (placed directly in `assets/` folder)
- **Enemy images**: Place in `assets/enemies/` folder with names matching the enemy name (lowercase, spaces replaced with underscores)
  - Example: "Goblin Warrior" → `goblin_warrior.png`
  - Example: "Toxic Slime" → `toxic_slime.png`

## Image Requirements

- **Format**: PNG (recommended) or JPG
- **Size**: Recommended 200-400px width/height
- **Aspect Ratio**: Square or portrait works best
- **Background**: Transparent PNGs work best, but any format is fine

## Notes

- If an image is not found, it will be hidden automatically (no broken image icons)
- Images are automatically scaled to fit the card layout
- Images will appear grayscale when the entity is dead
