/**
 * A small, deterministic, entirely fictional audience.
 *
 * The names, interests and activity figures are generated locally from a fixed
 * seed. None of it is real attendee data, and nothing leaves the browser.
 */

export const INTERESTS = ["Music", "Comedy", "Tech talks", "Food"] as const;
export type Interest = (typeof INTERESTS)[number];

export const CITIES = ["Mumbai", "Pune", "Bengaluru", "Delhi", "London"] as const;
export type City = (typeof CITIES)[number];

export const PEOPLE_COUNT = 240;
const PEOPLE_SEED = 42;

export interface Person {
  name: string;
  initials: string;
  interest: Interest;
  city: City;
  /** Days since the person was last active. */
  activeDays: number;
  /** Number of events booked. */
  bookings: number;
}

const FIRST_NAMES = [
  "Asha", "Ben", "Chen", "Dara", "Elif", "Farah", "Gus", "Hana", "Ivan", "Jo",
  "Kai", "Lena", "Mo", "Nia", "Omar", "Priya", "Quinn", "Rui", "Sana", "Tomas",
] as const;

const LAST_NAMES = [
  "Reyes", "Iyer", "Novak", "Okafor", "Lindqvist", "Haddad", "Moreau", "Tanaka", "Silva", "Brandt",
] as const;

/** mulberry32: small, fast, and stable across runs. */
function rng(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pickInterest = (roll: number): Interest =>
  roll < 0.35 ? "Music" : roll < 0.6 ? "Comedy" : roll < 0.8 ? "Tech talks" : "Food";

/** Build the stable audience used by the demo. */
export function generatePeople(): Person[] {
  const random = rng(PEOPLE_SEED);
  const people: Person[] = [];

  for (let i = 0; i < PEOPLE_COUNT; i += 1) {
    const interest = pickInterest(random());
    const city = CITIES[Math.floor(random() * CITIES.length)];
    // Squaring the roll biases towards recently active people.
    const activeDays = Math.floor(random() ** 2 * 90) + 1;
    const bookings = Math.floor(random() ** 1.5 * 7);
    const first = FIRST_NAMES[Math.floor(random() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(random() * LAST_NAMES.length)];

    people.push({
      name: `${first} ${last}`,
      initials: `${first[0]}${last[0]}`,
      interest,
      city,
      activeDays,
      bookings,
    });
  }

  return people;
}

export interface SegmentRules {
  interests: readonly Interest[];
  city: City | "";
  /** Match people active within this many days. */
  days: number;
  /** Match people with at least this many bookings. */
  buys: number;
}

/**
 * Filter the audience by interest, city, recency and bookings. The input is
 * never mutated and matches keep their source order.
 */
export function segmentMatch(people: readonly Person[], rules: SegmentRules): Person[] {
  return people.filter(
    (person) =>
      rules.interests.includes(person.interest) &&
      (!rules.city || person.city === rules.city) &&
      person.activeDays <= rules.days &&
      person.bookings >= rules.buys,
  );
}

/** Plain-language summary of the active rules, used for saved segment labels. */
export function describeSegment(rules: SegmentRules): string {
  const interestText =
    rules.interests.length === INTERESTS.length
      ? "Any interest"
      : rules.interests.length
        ? rules.interests.join(" or ")
        : "No interest";
  return `${interestText}${rules.city ? ` in ${rules.city}` : ""}, active in the last ${rules.days} days${
    rules.buys ? `, ${rules.buys}+ bookings` : ""
  }`;
}
