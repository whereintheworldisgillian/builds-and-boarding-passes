import { DEPARTURES } from "./departures";
import HeroPrompt from "./hero-prompt";
import Terminal from "./terminal";

export default function HomePage() {
  return (
    <main id="top">
      <header className="site-header">
        <nav className="nav-shell" aria-label="Main navigation">
          <a className="brand" href="#top" aria-label="Builds and Boarding Passes home">
            <span className="brand-mark">B<i>&amp;</i>BP</span>
            <span className="brand-meta">World tour<br />001</span>
          </a>
          <div className="nav-links">
            <a href="#manifest">Manifest</a>
            <a href="#now">Live stop</a>
            <a href="#route">Route</a>
          </div>
          <a className="nav-cta" href="#now">
            <span className="nav-status-dot" aria-hidden="true" />
            <span><small>Current</small><strong>HKT</strong></span>
            <i aria-hidden="true">↘</i>
          </a>
        </nav>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        {/* Six stacked slides on one shared CSS loop — crossfading, each with a
            slow zoom, no JavaScript.

            Two of the six are not photographs. 01 is a real commit from this
            repo and 05 is a real file from it, rendered to an image. The site
            is for people who build, so the rotation says so directly rather
            than leaving photographs to imply it. 02, 04 and 06 are Gillian's
            own travel photographs; 03 is stock.

            The order carries two constraints at once, and it is a LOOP, so 06
            wraps back to 01:

            - Tone alternates, so no two consecutive slides sit at the same
              brightness: dark diff, bright lake, dark tarmac, sunlit pillars,
              dark source, vivid sunset.
            - The two text slides sit at 01 and 05, never adjacent in either
              direction.

            Reorder by renaming the files, but keep both constraints.

            THE COUNT IS BAKED INTO THE CSS. Keyframe percentages cannot use
            calc(), so adding or removing a slide means retuning the keyframes
            and the nth-child delays in globals.css. The formula is in the
            comment above them. */}
        <div className="hero-media" aria-hidden="true">
          <img src="/hero/01-commit-diff.jpg" alt="" fetchPriority="high" decoding="async" />
          <img src="/hero/02-attabad-lake.jpg" alt="" decoding="async" />
          <img src="/hero/03-jet-bridge-night.jpg" alt="" decoding="async" />
          <img src="/hero/04-zhangjiajie-pillars.jpg" alt="" decoding="async" />
          <img src="/hero/05-open-source.jpg" alt="" decoding="async" />
          <img src="/hero/06-sunset-rays.jpg" alt="" decoding="async" />
        </div>
        <div className="hero-wash" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />

        <div className="hero-copy">
          {/* "Shipped" rather than "built": it is the one word that belongs to
              both halves of this project at once — deploying software and
              sending something across a border. */}
          <h1 id="hero-title">
            <span>Ideas get shipped.</span>
            <em>Borders get crossed.</em>
          </h1>
          <p>
            A moving studio and an open repo. Vibe coding a new build in every
            city, for people who stopped waiting for perfect.
          </p>
          {/* Replaces the "Enter the journey" button. A field you can type into
              is the object this audience recognises on sight; a button is not.
              "See where we landed" stays as the path for anyone who would
              rather click than type. */}
          <HeroPrompt />
          <div className="hero-actions">
            <a className="text-link" href="#now">
              See where we landed <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="route-rail" aria-hidden="true">
          <span className="route-origin">WORLD</span>
          <span className="route-line">
            <span className="route-plane">✈</span>
          </span>
          <span className="route-destination">YOU</span>
        </div>

        <aside className="boarding-pass" aria-label="Current boarding pass">
          <div className="pass-heading">
            <span>Builds &amp; Boarding Passes</span>
            <span>BBP / 001</span>
          </div>
          {/* A ticket shape carrying build data, not airline data. The route is
              the thesis of the whole project in two words; the fields below are
              all true today, which is why none of them is a date. */}
          <div className="pass-route">
            <div>
              <strong>IDEA</strong>
              <span>Rough, unfinished</span>
            </div>
            <div className="pass-flight" aria-hidden="true">
              <span>✈</span>
            </div>
            <div>
              <strong>SHIPPED</strong>
              <span>Live, in public</span>
            </div>
          </div>
          <div className="pass-details">
            <div>
              <span>Build</span>
              <strong>BBP 001</strong>
            </div>
            <div>
              <span>Stack</span>
              <strong>NEXT · TS</strong>
            </div>
            <div>
              <span>Model</span>
              <strong>OPUS 5</strong>
            </div>
            <div>
              <span>Shipping</span>
              <strong>IN PUBLIC</strong>
            </div>
          </div>
          <div className="pass-footer">
            <span>BUILD BEFORE YOU’RE READY</span>
            <span className="barcode" aria-hidden="true" />
          </div>
        </aside>

        <a className="scroll-cue" href="#manifest">
          <span>Scroll to depart</span>
          <i aria-hidden="true">↓</i>
        </a>
      </section>

      {/* id is the /board command's scroll target. */}
      <section className="departures" id="board" aria-labelledby="departures-title">
        <div className="departures-shell">
          <header className="departures-header">
            <div className="departures-title">
              <span aria-hidden="true">✈</span>
              <h2 id="departures-title">DEPARTURES</h2>
            </div>
            <time dateTime="18:03">18:03</time>
          </header>

          <div className="departures-table-wrap">
            <table className="departures-table">
              <thead>
                <tr>
                  <th scope="col">TIME</th>
                  <th scope="col">DESTINATION</th>
                  <th scope="col">FLIGHT</th>
                  <th scope="col">GATE</th>
                  <th scope="col">REMARKS</th>
                </tr>
              </thead>
              {/* Rows live in ./departures because the terminal's /board
                  command prints the same board. One source, so the console and
                  the page can never contradict each other. */}
              <tbody>
                {DEPARTURES.map((departure) => (
                  <tr key={departure.destination}>
                    <td>{departure.time}</td>
                    <td>{departure.destination}</td>
                    <td>{departure.flight}</td>
                    <td>{departure.gate}</td>
                    <td
                      className={
                        departure.status ? `status-${departure.status}` : undefined
                      }
                    >
                      {departure.remarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="departures-footer">
            <p>World tour / Live route / One useful release per landing</p>
            <strong>Pick a row. Start moving.</strong>
          </footer>
        </div>
      </section>

      <section className="manifesto light-section" id="manifest">
        <div className="manifesto-top reveal">
          <p className="section-tag">The manifest</p>
          <p className="issue-code">Field note / HKT / Vol. 001</p>
        </div>
        <div className="manifesto-body reveal">
          <h2>
            Leave before
            <em> the plan is ready.</em>
          </h2>
          <div className="manifesto-aside">
            <p>
              This is a working studio with changing coordinates. Every stop
              becomes a deadline, every wrong turn becomes material, and the
              unfinished parts stay visible.
            </p>
            <div className="manifesto-rule">
              <span>The one rule</span>
              <strong>Each stop, ship one useful thing.</strong>
            </div>
          </div>
        </div>
        <div className="manifesto-stats reveal">
          <div>
            <span>Tour state</span>
            <strong>LIVE</strong>
            <small>live world tour</small>
          </div>
          <div>
            <span>Draft state</span>
            <strong>OPEN</strong>
            <small>kept in public</small>
          </div>
          <div>
            <span>Excuses</span>
            <strong>NONE</strong>
            <small>required to begin</small>
          </div>
        </div>
        <div className="manifesto-word" aria-hidden="true">MOVE</div>
      </section>

      <section className="current-stop dark-section" id="now">
        <div className="stop-topline reveal">
          <p className="section-tag section-tag-light">Live transmission</p>
          <p>Landing 01 / Southeast Asia</p>
        </div>

        <div className="stop-title reveal">
          <h2>PHUKET</h2>
          <p>07°53&apos;N<br />98°23&apos;E</p>
        </div>

        <div className="stop-stage">
          <figure className="stop-photo reveal">
            <img
              src="/phuket-boats.jpg"
              alt="Long-tail boats resting in turquoise water off a Thai beach"
            />
            <figcaption>Andaman Sea / Frame 001</figcaption>
            <div className="stop-stamp" aria-hidden="true">
              <span>HKT</span>
              <small>STAMP 001</small>
            </div>
          </figure>

          <article className="stop-story reveal">
            <div className="status-line">
              <span className="live-dot" aria-hidden="true" />
              Now transmitting
            </div>
            <p className="chapter-code">Chapter 001 / First signal</p>
            <h3>Build where the signal finds you.</h3>
            <p>
              The first build is taking shape between long-tail boats,
              late-night commits, and the healthy pressure of doing the work
              while the story is still happening.
            </p>
            <dl className="stop-facts">
              <div><dt>Build</dt><dd>Boarding Passes</dd></div>
              <div><dt>Signal</dt><dd>Live / unpolished</dd></div>
              <div><dt>Departure</dt><dd>When it ships</dd></div>
            </dl>
            <div className="story-footer">
              <span>Next stop</span>
              <strong>Intentionally unknown ↗</strong>
            </div>
          </article>
        </div>
      </section>

      <section className="route-section light-section" id="route">
        <div className="route-header reveal">
          <p className="section-tag">Open route</p>
          <h2>The route appears <em>when you move.</em></h2>
          <p className="route-intro">
            Each stop becomes a chapter: a new place, a new constraint, and one
            useful thing shipped before departure.
          </p>
        </div>

        <div className="route-board">
          <figure className="route-image reveal">
            <img
              src="/mountain-road.jpg"
              alt="A winding road tracing its way across a sunlit mountain"
            />
            <figcaption>
              <span>Route policy / 001</span>
              <strong>Take the road that gives the story a pulse.</strong>
            </figcaption>
          </figure>

          <aside className="route-panel reveal" aria-label="Flight plan">
            <div className="panel-heading">
              <span>Flight plan</span>
              <strong>001—∞</strong>
            </div>
            <ol className="route-list">
            <li>
              <span>HKT</span>
              <div><strong>Phuket</strong><small>Now boarding · Build one</small></div>
              <b>LIVE</b>
            </li>
            <li>
              <span>???</span>
              <div><strong>Somewhere next</strong><small>Chosen by curiosity</small></div>
              <b>LOCKED</b>
            </li>
            <li>
              <span>∞</span>
              <div><strong>The long way around</strong><small>Destination unknown</small></div>
              <b>OPEN</b>
            </li>
            </ol>
            <p className="panel-note">No fixed itinerary. One useful release per landing.</p>
          </aside>
        </div>
      </section>

      <section className="final-cta">
        <div className="final-grid" aria-hidden="true" />
        <p>There is no perfect time to start.</p>
        <h2>Come before you’re ready.</h2>
        <a className="button button-dark" href="#top">
          Return to departure <span aria-hidden="true">↑</span>
        </a>
      </section>

      <footer>
        <a className="footer-brand" href="#top">B<i>&amp;</i>BP</a>
        <p>Builds &amp; Boarding Passes · World Tour 001</p>
        <p>Made somewhere between here and next.</p>
      </footer>

      {/* Fixed to the viewport, so it sits last in the document — after the
          footer it is the final stop for keyboard users rather than an
          interruption between sections. */}
      <Terminal />
    </main>
  );
}
