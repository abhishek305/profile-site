import { useMemo, useState } from "react";
import {
  CITIES,
  describeSegment,
  generatePeople,
  INTERESTS,
  segmentMatch,
  type City,
  type Interest,
  type Person,
  type SegmentRules,
} from "./logic/audience";
import { useToast } from "../components/ui/toast-context";
import { Stage } from "../components/layout/Stage";

const PREVIEW_COUNT = 5;
const MAX_SAVED = 4;

const defaultRules = (): SegmentRules => ({
  interests: [...INTERESTS],
  city: "",
  days: 30,
  buys: 0,
});

interface SavedSegment {
  count: number;
  description: string;
}

export const CrowdlyStage = ({
  disclaimer = "Fictional sample audience, generated in your browser. Crowdly's real segments come from Lytics.",
}: {
  disclaimer?: string;
}) => {
  const people = useMemo(generatePeople, []);
  const [rules, setRules] = useState<SegmentRules>(defaultRules);
  const [saved, setSaved] = useState<SavedSegment[]>([]);
  const toast = useToast();

  const matches = useMemo(() => segmentMatch(people, rules), [people, rules]);
  const description = useMemo(() => describeSegment(rules), [rules]);

  const toggleInterest = (interest: Interest) => {
    setRules((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest],
    }));
  };

  const save = () => {
    if (saved.length >= MAX_SAVED) {
      toast(`Remove a saved segment first, ${MAX_SAVED} is the limit`);
      return;
    }
    setSaved((current) => [...current, { count: matches.length, description }]);
    toast("Segment saved");
  };

  const remove = (index: number) => {
    setSaved((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <Stage
      hint="Try it: change a rule"
      disclaimer={disclaimer}
      fallback={`This demo needs JavaScript. It filters ${people.length} fictional people by interest, city, recent activity and bookings.`}
      actions={
        <button className="btn small" type="button" onClick={() => setRules(defaultRules())}>
          Reset
        </button>
      }
    >
      <div className="split">
        <div className="pane">
          <fieldset className="checks">
            <legend>Interested in</legend>
            {INTERESTS.map((interest) => (
              <label key={interest}>
                <input
                  type="checkbox"
                  checked={rules.interests.includes(interest)}
                  onChange={() => toggleInterest(interest)}
                />
                {interest}
              </label>
            ))}
          </fieldset>

          <div className="rng">
            <label htmlFor="segment-city">City</label>
            <select
              id="segment-city"
              value={rules.city}
              onChange={(event) => setRules((current) => ({ ...current, city: event.target.value as City | "" }))}
            >
              <option value="">Any city</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="rng">
            <label htmlFor="segment-days">Active in the last {rules.days} days</label>
            <input
              id="segment-days"
              type="range"
              min={1}
              max={90}
              value={rules.days}
              onChange={(event) => setRules((current) => ({ ...current, days: Number(event.target.value) }))}
            />
          </div>

          <div className="rng">
            <label htmlFor="segment-buys">Booked at least {rules.buys} events</label>
            <input
              id="segment-buys"
              type="range"
              min={0}
              max={6}
              value={rules.buys}
              onChange={(event) => setRules((current) => ({ ...current, buys: Number(event.target.value) }))}
            />
          </div>
        </div>

        <div className="pane">
          {/*
            One polite region for the whole result, rather than one on the
            count, the preview list and the saved list. Three competing live
            regions made a screen reader announce every rule change three times.
          */}
          <div className="count" role="status" aria-live="polite">
            <span>{matches.length}</span> <small>of {people.length} people</small>
          </div>

          <div className="bar" aria-hidden="true">
            <i style={{ width: `${(matches.length / people.length) * 100}%` }} />
          </div>

          <ul className="people">
            {matches.length ? (
              matches.slice(0, PREVIEW_COUNT).map((person, index) => <PersonRow key={`${person.name}-${index}`} person={person} />)
            ) : (
              <li className="empty">No one matches. Loosen a rule.</li>
            )}
          </ul>

          <button className="btn small" type="button" onClick={save}>
            Save this segment
          </button>

          {saved.length > 0 && (
            <>
              <h4 className="vh">Saved segments</h4>
              <ul className="saved">
                {saved.map((item, index) => (
                  <li key={`${item.description}-${index}`}>
                    <span>
                      {item.count} people: {item.description}
                    </span>
                    <button type="button" aria-label={`Remove saved segment: ${item.description}`} onClick={() => remove(index)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </Stage>
  );
};

const PersonRow = ({ person }: { person: Person }) => (
  <li>
    <span className="av" aria-hidden="true">
      {person.initials}
    </span>
    <span>
      {person.name}
      <br />
      <small>
        {person.city}, {person.interest}
      </small>
    </span>
    <small>{person.activeDays}d ago</small>
  </li>
);
