import { CATEGORIES } from '../../config/constants.js';

export const categorySeed = [
  {
    name: CATEGORIES.INSTRUMENTS,
    description:
      'Hand-finished acoustic and electronic instruments for players who care about tone.',
    displayOrder: 1,
    image: {
      url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
    },
  },
  {
    name: CATEGORIES.FOOTWEAR,
    description:
      'Performance and lifestyle footwear engineered with premium materials.',
    displayOrder: 2,
    image: {
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    },
  },
  {
    name: CATEGORIES.BAGS,
    description:
      'Carry systems built for travel, work, and the outdoors — nothing wasted.',
    displayOrder: 3,
    image: {
      url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80',
    },
  },
  {
    name: CATEGORIES.SPACE,
    description:
      'A curated collection for the cosmically curious — décor, gear, and collectibles.',
    displayOrder: 4,
    image: {
      url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80',
    },
  },
];

export default categorySeed;
