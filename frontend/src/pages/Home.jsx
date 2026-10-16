
import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-small">
            YOUR EVERYDAY SHOPPING DESTINATION
          </p>

          <h1>
            Find your
            <br />
            next <span>favorite.</span>
          </h1>

          <p className="hero-description">
            Discover the things you love, from the latest tech
            to everyday essentials. Great finds are just a click away.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="hero-button">
              Explore Collection <span>→</span>
            </Link>

            <div className="hero-trust">
              <span className="trust-check">✓</span>
              Easy &amp; secure shopping
            </div>
          </div>

          <div className="hero-highlights">
            <div>
              <strong>Everyday</strong>
              <span>Great finds</span>
            </div>

            <div>
              <strong>All in one</strong>
              <span>Shopping place</span>
            </div>

            <div>
              <strong>Made simple</strong>
              <span>Easy checkout</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-decoration hero-decoration-one"></div>
          <div className="hero-decoration hero-decoration-two"></div>

          <div className="hero-image-frame">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=85"
              alt="Modern fashion and lifestyle shopping store"
            />

            <div className="hero-image-overlay"></div>

            <div className="hero-floating-card">
              <div className="floating-icon">✦</div>
              <div>
                <strong>Your style, your way</strong>
                <p>Discover something new</p>
              </div>
            </div>

            <div className="hero-image-label">
              <span>THE SHOPEASE EDIT</span>
              <span>01 / EVERYDAY FINDS</span>
            </div>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">
              CURATED FOR YOU
            </span>
            <h2>Find your kind of favorite.</h2>
            <p>
              Explore collections picked for your everyday life.
            </p>
          </div>

          <Link to="/products" className="text-link">
            View all products →
          </Link>
        </div>

        <div className="category-grid">
          <Link
            to="/products?category=Electronics"
            className="category-card"
          >
            <img
              src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=700&q=80"
              alt="Electronics and gadgets"
              loading="lazy"
            />
            <div className="category-card-content">
              <span>01 / TECH</span>
              <h3>Electronics</h3>
              <p>Everyday tech, made better.</p>
              <span className="category-arrow">↗</span>
            </div>
          </Link>

          <Link
            to="/products?category=Fashion"
            className="category-card"
          >
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80"
              alt="Fashion clothing collection"
              loading="lazy"
            />
            <div className="category-card-content">
              <span>02 / STYLE</span>
              <h3>Fashion</h3>
              <p>Find your everyday look.</p>
              <span className="category-arrow">↗</span>
            </div>
          </Link>

          <Link
            to="/products?category=Bags"
            className="category-card"
          >
            <img
              src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80"
              alt="Backpack and bags"
              loading="lazy"
            />
            <div className="category-card-content">
              <span>03 / CARRY</span>
              <h3>Bags</h3>
              <p>Carry what matters.</p>
              <span className="category-arrow">↗</span>
            </div>
          </Link>

          <Link
            to="/products?category=Home"
            className="category-card"
          >
            <img
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=700&q=80"
              alt="Modern home decor"
              loading="lazy"
            />
            <div className="category-card-content">
              <span>04 / LIVING</span>
              <h3>Home &amp; Living</h3>
              <p>Make your space yours.</p>
              <span className="category-arrow">↗</span>
            </div>
          </Link>
        </div>
      </section>

      <section className="home-promo">
        <div className="promo-copy">
          <span className="section-eyebrow">
            A LITTLE SOMETHING SPECIAL
          </span>

          <h2>
            Good finds.
            <br />
            Great everyday.
          </h2>

          <p>
            From useful essentials to things you simply love,
            discover something worth bringing home.
          </p>

          <Link to="/products" className="promo-button">
            Explore the collection →
          </Link>
        </div>

        <div className="promo-image">
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1000&q=80"
            alt="Beautifully arranged retail shopping collection"
            loading="lazy"
          />

          <div className="promo-sticker">
            <strong>LOVE</strong>
            THE FIND
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="section-heading centered-heading">
          <div>
            <span className="section-eyebrow">
              THE SHOPEASE DIFFERENCE
            </span>
            <h2>Shopping made simple.</h2>
            <p>
              A smoother shopping experience, from browsing
              to finding your next favorite.
            </p>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">↗</div>
            <h3>Easy to explore</h3>
            <p>
              Browse collections and find products in just a few clicks.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">♡</div>
            <h3>Everyday favorites</h3>
            <p>
              Explore fashion, electronics, bags, and home essentials
              in one place.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">✓</div>
            <h3>Simple checkout</h3>
            <p>
              Add items to your cart and manage your shopping easily.
            </p>
          </div>
        </div>
      </section>

      <section className="home-cta">
        <div className="cta-sparkle">✦</div>

        <span className="section-eyebrow">
          YOUR NEXT FAVORITE IS WAITING
        </span>

        <h2>A good find can make your day.</h2>

        <p>
          Take a look around and discover something you will love.
        </p>

        <Link to="/products" className="hero-button">
          Start exploring →
        </Link>
      </section>
    </main>
  );
}

export default Home;