import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildBacklog, generatePeople, planCall, segmentMatch, texRender } from "../logic";
import { copyToClipboard, Chips, Flow, Segmented, Stage, useToast, type FlowStep } from "./Stage";

type McpProfile = "in" | "out";
type McpScope = "write" | "read";
type McpPayload = "ok" | "bad";
type McpConsumer = "up" | "down";
type McpErrors = "terse" | "helpful";

interface McpConfig {
  profile: McpProfile;
  scope: McpScope;
  payload: McpPayload;
  consumer: McpConsumer;
  errs: McpErrors;
}

const defaultMcpConfig: McpConfig = {
  profile: "in",
  scope: "write",
  payload: "ok",
  consumer: "up",
  errs: "terse",
};

export const McpStage = ({ disclaimer = "Illustrative simulation with a fictional tool and fictional profiles. Not production data." }: { disclaimer?: string }) => {
  const [config, setConfig] = useState(defaultMcpConfig);
  const [hasRun, setHasRun] = useState(false);
  const [steps, setSteps] = useState<FlowStep[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [message, setMessage] = useState('Press "Run the call".');
  const [next, setNext] = useState("");
  const runId = useRef(0);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const clearTimers = () => {
    timers.current.forEach((timer) => clearTimeout(timer));
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  const runCall = useCallback((nextConfig: McpConfig) => {
    clearTimers();
    const id = ++runId.current;
    const plan = planCall(nextConfig);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setHasRun(true);
    setMessage("Working...");
    setNext("");
    setLog([]);
    setSteps([]);

    if (reduce) {
      setSteps(plan.steps);
      setLog(plan.steps.map((step) => `${step.node ?? "Call"}: ${step.message}`));
      setMessage(plan.message);
      setNext(plan.next);
      return;
    }

    let index = 0;
    const tick = () => {
      if (id !== runId.current) return;
      if (index >= plan.steps.length) {
        setSteps(plan.steps);
        setMessage(plan.message);
        setNext(plan.next);
        return;
      }
      const step = plan.steps[index];
      setSteps((current) => [...current.slice(0, index), { index: step.index, state: "active", message: step.message }]);
      setLog((current) => [...current, `${step.node ?? "Call"}: ${step.message}`]);
      const timer = setTimeout(() => {
        if (id !== runId.current) return;
        setSteps((current) => [...current.slice(0, index), step]);
        index += 1;
        tick();
      }, 520);
      timers.current.push(timer);
    };
    tick();
  }, []);

  const change = <K extends keyof McpConfig>(key: K, value: McpConfig[K]) => {
    const nextConfig = { ...config, [key]: value };
    setConfig(nextConfig);
    if (hasRun) runCall(nextConfig);
  };

  const reset = () => {
    runId.current += 1;
    clearTimers();
    setConfig(defaultMcpConfig);
    setHasRun(false);
    setSteps([]);
    setLog([]);
    setMessage('Press "Run the call".');
    setNext("");
  };

  return (
    <Stage
      hint="Try it: break the call"
      disclaimer={disclaimer}
      fallback="This simulation needs JavaScript. It shows how a tool call passes through a profile, auth, schema validation and an event bus."
      barContent={
        <>
          <button className="btn small primary" type="button" onClick={() => runCall(config)}>Run the call</button>
          <button className="btn small" type="button" onClick={reset}>Reset</button>
        </>
      }
    >
      <div className="controls">
        <Segmented
          name="mcp-profile"
          legend="Profile"
          value={config.profile}
          onChange={(value) => change("profile", value)}
          options={[{ value: "in", label: "Includes the tool" }, { value: "out", label: "Excludes it" }]}
        />
        <Segmented
          name="mcp-scope"
          legend="Token"
          value={config.scope}
          onChange={(value) => change("scope", value)}
          options={[{ value: "write", label: "Can write" }, { value: "read", label: "Read only" }]}
        />
        <Segmented
          name="mcp-payload"
          legend="Arguments"
          value={config.payload}
          onChange={(value) => change("payload", value)}
          options={[{ value: "ok", label: "Valid" }, { value: "bad", label: "Title missing" }]}
        />
        <Segmented
          name="mcp-consumer"
          legend="Consumer"
          value={config.consumer}
          onChange={(value) => change("consumer", value)}
          options={[{ value: "up", label: "Healthy" }, { value: "down", label: "Down" }]}
        />
        <Segmented
          name="mcp-errors"
          legend="Error messages"
          value={config.errs}
          onChange={(value) => change("errs", value)}
          options={[{ value: "terse", label: "Terse" }, { value: "helpful", label: "Helpful" }]}
        />
      </div>
      <Flow steps={steps} />
      <div className="out">
        <div className="pane">
          <h3>What the client receives</h3>
          <pre className="msg" aria-live="polite">{message}</pre>
          <h3>What the model can do next</h3>
          <p style={{ margin: 0, fontSize: "1rem" }}>{next || "\u00a0"}</p>
        </div>
        <div className="pane">
          <h3>Step by step</h3>
          <ol className="log" aria-live="polite">
            {log.map((entry, index) => <li key={`${entry}-${index}`}>{entry}</li>)}
          </ol>
        </div>
      </div>
    </Stage>
  );
};

const specs = {
  notify: "Users must receive an email when an order ships. Users should be able to turn off marketing emails in settings. The API must expose a webhook for delivery status. Push notifications may be added later. The settings page needs a toggle for each channel.",
  checkout: "Customers must pay by card at checkout. The payment form should validate the card number before submitting. Refunds must be possible from the admin dashboard within 30 days. Checkout should complete in under two seconds. Saved cards may be offered to returning customers. Order confirmation appears on screen.",
};

type Preset = keyof typeof specs;
type View = "backlog" | "csv";

export const ArchitectStage = ({ disclaimer = "Rule-based stand-in for illustration. The real toolkit uses LLM agents." }: { disclaimer?: string }) => {
  const [preset, setPreset] = useState<Preset>("notify");
  const [spec, setSpec] = useState(specs.notify);
  const [view, setView] = useState<View>("backlog");
  const toast = useToast();
  const result = useMemo(() => buildBacklog(spec), [spec]);

  const selectPreset = (next: Preset) => {
    setPreset(next);
    setSpec(specs[next]);
  };

  const copyCsv = async () => {
    const copied = await copyToClipboard(result.csv);
    toast(copied ? "CSV copied" : "Copy is not available here");
  };

  return (
    <Stage
      hint="Try it: edit the spec"
      disclaimer={disclaimer}
      fallback="This demo needs JavaScript. It turns each sentence of a spec into a prioritised ticket and a CSV row."
      barContent={
        <>
          <Chips
            label="Sample specs"
            value={preset}
            onChange={selectPreset}
            options={[{ value: "notify", label: "Notifications" }, { value: "checkout", label: "Checkout" }]}
          />
          <button className="btn small" type="button" onClick={() => { selectPreset(preset); setView("backlog"); }}>Reset</button>
        </>
      }
    >
      <div className="split">
        <div className="pane">
          <label className="fl" htmlFor="spec">Spec</label>
          <textarea id="spec" spellCheck={false} value={spec} onChange={(event) => setSpec(event.target.value)} />
        </div>
        <div className="pane">
          <div className="pane-h">
            <h3>Result</h3>
            <Chips
              label="Result view"
              value={view}
              onChange={setView}
              options={[{ value: "backlog", label: "Backlog" }, { value: "csv", label: "CSV" }]}
            />
          </div>
          <div id="view-backlog" hidden={view !== "backlog"}>
            <ol className="tickets" aria-live="polite">
              {result.items.length ? result.items.map((item, index) => (
                <li key={`${item.text}-${index}`}>
                  <div className="meta">
                    <span className={`badge ${item.priority === "Must" ? "p1" : item.priority === "No priority" ? "p0" : ""}`}>{item.priority}</span>
                    <span>{item.points} {item.points === 1 ? "point" : "points"}</span>
                    {item.labels.map((label) => <span className="tag" key={label}>{label}</span>)}
                  </div>
                  <p className="t">{item.text.length > 96 ? `${item.text.slice(0, 93).replace(/\s+\S*$/, "")}...` : item.text}</p>
                </li>
              )) : <li className="empty">Write a sentence that ends with a full stop to create a ticket.</li>}
            </ol>
            <p className="summary">{result.summary}</p>
          </div>
          <div id="view-csv" hidden={view !== "csv"}>
            <pre className="msg" tabIndex={0} aria-label="CSV preview">{result.csv}</pre>
            <button className="btn small" type="button" onClick={copyCsv}>Copy CSV</button>
          </div>
        </div>
      </div>
    </Stage>
  );
};

const interests = ["Music", "Comedy", "Tech talks", "Food"];
const cities = ["Mumbai", "Pune", "Bengaluru", "Delhi", "London"];

interface CrowdPerson {
  name: string;
  initials: string;
  interest: string;
  city: string;
  activeDays: number;
  bookings: number;
}

interface SavedSegment {
  count: number;
  description: string;
}

export const CrowdlyStage = ({ disclaimer = "Fictional sample audience, generated in your browser. Crowdly's real segments come from Lytics." }: { disclaimer?: string }) => {
  const people = useMemo(() => generatePeople() as CrowdPerson[], []);
  const [selected, setSelected] = useState<string[]>(interests);
  const [city, setCity] = useState("");
  const [days, setDays] = useState(30);
  const [buys, setBuys] = useState(0);
  const [saved, setSaved] = useState<SavedSegment[]>([]);
  const toast = useToast();

  const rules = useMemo(() => ({ interests: selected, city, days, buys }), [selected, city, days, buys]);
  const matches = useMemo(() => segmentMatch(people, rules) as CrowdPerson[], [people, rules]);

  const toggleInterest = (interest: string) => {
    setSelected((current) => current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest]);
  };

  const description = useMemo(() => {
    const interestText = selected.length === 4 ? "Any interest" : selected.length ? selected.join(" or ") : "No interest";
    return `${interestText}${city ? ` in ${city}` : ""}, active in the last ${days} days${buys ? `, ${buys}+ bookings` : ""}`;
  }, [selected, city, days, buys]);

  const save = () => {
    if (saved.length >= 4) {
      toast("Remove a saved segment first");
      return;
    }
    setSaved((current) => [...current, { count: matches.length, description }]);
    toast("Segment saved");
  };

  const reset = () => {
    setSelected(interests);
    setCity("");
    setDays(30);
    setBuys(0);
    setSaved([]);
  };

  return (
    <Stage
      hint="Try it: change a rule"
      disclaimer={disclaimer}
      fallback="This demo needs JavaScript. It filters 240 fictional people by interest, city, recent activity and bookings."
      barContent={<button className="btn small" type="button" onClick={reset}>Reset</button>}
    >
      <div className="split">
        <div className="pane">
          <fieldset className="checks">
            <legend>Interested in</legend>
            {interests.map((interest) => (
              <label key={interest}>
                <input type="checkbox" checked={selected.includes(interest)} onChange={() => toggleInterest(interest)} />
                {interest}
              </label>
            ))}
          </fieldset>
          <div className="rng">
            <label htmlFor="segment-city">City</label>
            <select id="segment-city" value={city} onChange={(event) => setCity(event.target.value)}>
              <option value="">Any city</option>
              {cities.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div className="rng">
            <label htmlFor="segment-days">Active in the last {days} days</label>
            <input id="segment-days" type="range" min="1" max="90" value={days} onChange={(event) => setDays(Number(event.target.value))} />
          </div>
          <div className="rng">
            <label htmlFor="segment-buys">Booked at least {buys} events</label>
            <input id="segment-buys" type="range" min="0" max="6" value={buys} onChange={(event) => setBuys(Number(event.target.value))} />
          </div>
        </div>
        <div className="pane">
          <div className="count" aria-live="polite"><span>{matches.length}</span> <small>of {people.length} people</small></div>
          <div className="bar" aria-hidden="true"><i style={{ width: `${(matches.length / people.length) * 100}%` }} /></div>
          <ul className="people" aria-live="polite">
            {matches.length ? matches.slice(0, 5).map((person, index) => (
              <li key={`${person.name}-${index}`}>
                <span className="av">{person.initials}</span>
                <span>{person.name}<br /><small>{person.city}, {person.interest}</small></span>
                <small>{person.activeDays}d ago</small>
              </li>
            )) : <li className="empty">No one matches. Loosen a rule.</li>}
          </ul>
          <button className="btn small" type="button" onClick={save}>Save this segment</button>
          <ul className="saved" aria-live="polite">
            {saved.map((item, index) => (
              <li key={`${item.description}-${index}`}>
                <span>{item.count} people: {item.description}</span>
                <button type="button" aria-label={`Remove saved segment ${index + 1}`} onClick={() => setSaved((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Stage>
  );
};

const defaultTex = "\\section{Notes on averages}\nLet $x_i$ be the $i$-th score. The mean is\n$$\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n} x_i$$\n\\textbf{Bold} and \\emph{emphasis} work, and so do lists:\n\\begin{itemize}\n\\item First idea\n\\item Second idea\n\\end{itemize}";

export const LatexStage = ({ disclaimer = "Stand-in renderer for the design prototype. Supports sections, bold, emphasis, lists and basic maths." }: { disclaimer?: string }) => {
  const [source, setSource] = useState(defaultTex);
  const result = useMemo(() => texRender(source), [source]);

  return (
    <Stage
      hint="Try it: type some LaTeX"
      disclaimer={disclaimer}
      fallback="This demo needs JavaScript. It renders a small subset of LaTeX as you type."
      barContent={<button className="btn small" type="button" onClick={() => setSource(defaultTex)}>Reset</button>}
    >
      <div className="split">
        <div className="pane">
          <label className="fl" htmlFor="tex-source">Source</label>
          <textarea id="tex-source" spellCheck={false} value={source} onChange={(event) => setSource(event.target.value)} />
          <p className={`status ${result.error ? "err" : "ok"}`} role="status">{result.status}</p>
        </div>
        <div className="pane">
          <h3>Page</h3>
          <div className="preview" dangerouslySetInnerHTML={{ __html: result.html }} />
        </div>
      </div>
    </Stage>
  );
};
