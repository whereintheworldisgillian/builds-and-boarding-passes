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
        <div className="hero-media" aria-hidden="true">
          <img src="/flight-window.jpg" alt="" />
        </div>
        <div className="hero-wash" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />

        <div className="hero-copy">
          <h1 id="hero-title">
            <span>Ideas get built.</span>
            <em>Borders get crossed.</em>
          </h1>
          <p>
            A moving studio, an open notebook, and a world tour for people who
            stopped waiting for perfect.
          </p>
          <div className="hero-actions">
            <a className="button button-light" href="#manifest">
              Enter the journey <span aria-hidden="true">↘</span>
            </a>
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
          <div className="pass-route">
            <div>
              <strong>WRLD</strong>
              <span>Anywhere</span>
            </div>
            <div className="pass-flight" aria-hidden="true">
              <span>✈</span>
            </div>
            <div>
              <strong>YOU</strong>
              <span>The next version of you</span>
            </div>
          </div>
          <div className="pass-details">
            <div>
              <span>Flight</span>
              <strong>BBP 001</strong>
            </div>
            <div>
              <span>Gate</span>
              <strong>OPEN</strong>
            </div>
            <div>
              <span>Seat</span>
              <strong>ANY</strong>
            </div>
            <div>
              <span>Boarding</span>
              <strong>NOW</strong>
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

      <section className="departures" aria-labelledby="departures-title">
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
                  <th scope="col">Time</th>
                  <th scope="col">Destination</th>
                  <th scope="col">Flight</th>
                  <th scope="col">Gate</th>
                  <th scope="col">Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>NOW</td>
                  <td>PHUKET</td>
                  <td>BBP 001</td>
                  <td>01</td>
                  <td className="status-boarding">BOARDING</td>
                </tr>
                <tr>
                  <td>--:--</td>
                  <td>SOMEWHERE NEXT</td>
                  <td>BBP 002</td>
                  <td>--</td>
                  <td className="status-open">ROUTE OPEN</td>
                </tr>
                <tr>
                  <td>--:--</td>
                  <td>THE LONG WAY</td>
                  <td>BBP 003</td>
                  <td>--</td>
                  <td>UNCONFIRMED</td>
                </tr>
                <tr>
                  <td>TONIGHT</td>
                  <td>FIRST DRAFT</td>
                  <td>BLD 404</td>
                  <td>07</td>
                  <td className="status-boarding">SHIPPING</td>
                </tr>
                <tr>
                  <td>NEVER</td>
                  <td>PERFECT PLAN</td>
                  <td>-- ----</td>
                  <td>--</td>
                  <td className="status-cancelled">CANCELLED</td>
                </tr>
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
    </main>
  );
}
