export const TILE_KEY = 'vrs-kaart-laag';

export const TILES = {
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Esri, Maxar, Earthstar Geographics',
    maxZoom: 19,
  },
};

export function getTileType() {
  try { return localStorage.getItem(TILE_KEY) || 'osm'; } catch { return 'osm'; }
}

export function saveTileType(type) {
  try { localStorage.setItem(TILE_KEY, type); } catch {}
}

export function addTileLayer(L, map, type) {
  const cfg = TILES[type] || TILES.osm;
  const layer = L.tileLayer(cfg.url, { attribution: cfg.attribution, maxZoom: cfg.maxZoom });
  layer.addTo(map);
  return layer;
}
