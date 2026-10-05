import { LOCATION_NAMES } from '../game/locations';
import type { LocationId, Season, Weather } from '../game/types';

const OUTDOOR = new Set<LocationId>(['quad', 'graduation', 'street', 'bus']);
const ALREADY_NIGHT = new Set<LocationId>(['street', 'party']);

function Rain() {
  const drops = [];
  for (let i = 0; i < 48; i += 1) {
    drops.push(
      <line
        key={i}
        x1={16 + (i * 37) % 1280}
        y1={20 + (i * 19) % 640}
        x2={6 + (i * 37) % 1280}
        y2={48 + (i * 19) % 640}
        stroke="#f7fbff"
        strokeWidth="1.3"
        opacity="0.35"
      />,
    );
  }
  return <g>{drops}</g>;
}

function Snow() {
  const flakes = [];
  for (let i = 0; i < 36; i += 1) {
    flakes.push(
      <circle key={i} cx={(i * 97) % 1280} cy={24 + (i * 53) % 660} r={1.4 + (i % 3)} fill="#fff" opacity="0.75" />,
    );
  }
  return <g>{flakes}</g>;
}

export function Painting({
  location,
  season,
  weather,
  year,
  slogan,
}: {
  location: LocationId;
  season: Season;
  weather: Weather;
  year: number;
  slogan?: string | null;
}) {
  const outdoor = OUTDOOR.has(location);
  const night = weather === 'night' && !ALREADY_NIGHT.has(location);
  const label = LOCATION_NAMES[location];
  return (
    <div
      className={`painting-wrap season-${season} weather-${weather}${night ? ' dim-night' : ''} year-${year}`}
      role="img"
      aria-label={label}
    >
      <img className="painting" src={`/art/places/${location}.jpg`} alt="" />
      {location === 'apartment' && slogan && <p className="slogan-plaque">{slogan}</p>}
      {outdoor && (weather === 'rain' || weather === 'snow' || (season === 'winter' && weather !== 'night')) && (
        <svg className="weather-veil" viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          {weather === 'rain' && <Rain />}
          {(weather === 'snow' || season === 'winter') && weather !== 'rain' && <Snow />}
        </svg>
      )}
    </div>
  );
}
