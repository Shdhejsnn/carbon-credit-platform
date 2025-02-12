import React, { useState } from "react";
import "./App.css";
import BS from "./assets/BS.jpg";
import SMP from "./assets/SMP.jpg";
import AI from "./assets/AI.jpg";

const Home = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    region: "",
    companyType: "",
    clientBank: "",
    otherBank: "",
    fullName: "",
    email: "",
    jobTitle: "",
    phone: "",
    requestType: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };
  

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">🌍 GreenLedger</div>
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
        <div className="nav-buttons">
          <button className="btn">Register</button>
          <button className="btn">Login</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-overlay">
          <h1>A New Era of Carbon Credit Trading</h1>
          <p>Secure, Transparent, and Efficient Transactions Powered by Blockchain</p>
          <button className="cta-btn" onClick={() => setIsPopupOpen(true)}>
            Get Started
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section className="features">
        <div className="feature-box">
          <img src={BS} alt="Blockchain Security" />
          <h3>Secure Transactions</h3>
          <p>Blockchain ensures tamper-proof transactions.</p>
        </div>
        <div className="feature-box">
          <img src={SMP} alt="Marketplace" />
          <h3>Sustainable Marketplace</h3>
          <p>Trade carbon credits effortlessly.</p>
        </div>
        <div className="feature-box">
          <img src={AI} alt="AI Insights" />
          <h3>AI-Powered Insights</h3>
          <p>Smart analytics to detect fraud and optimize trades.</p>
        </div>
      </section>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="modal-overlay" onClick={() => setIsPopupOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Welcome to GreenLedger</h2>
            <p>Register or login to continue</p>
            <div className="modal-buttons">
              <button className="btn register">Register</button>
              <button className="btn login">Login</button>
            </div>
            <button className="close-btn" onClick={() => setIsPopupOpen(false)}>X</button>
          </div>
        </div>
      )}

      {/* Demo Form Section */}
      <div className="demo-container">
        {/* Left Section - Text */}
        <div className="demo-text">
          <h2>Access the carbon markets <span className="highlight">the right way</span></h2>
          <p><strong>Unlock the potential of the carbon market without risk and complexity.</strong></p>
          <p>
            Carbonplace takes the guesswork out of verified Carbon Credits and makes it easier than ever 
            before to trade and retire credits for your organization or customers.
          </p>
          <p className="cta"><a href="#">Let's get started. Book a demo today.</a></p>
        </div>

        {/* Right Section - Form */}
        <form className="demo-form" onSubmit={handleSubmit}>
    <div className="form-group">
        <label htmlFor="companyName">Company Name</label>
        <input type="text" id="companyName" name="companyName" onChange={handleChange} required />
    </div>

    <div className="form-group">
        <label htmlFor="region">Region</label>
        <select id="region" name="region" onChange={handleChange} required>
            <option value="">Select from dropdown</option>
            <option value="North America">North America</option>
            <option value="Europe">Europe</option>
            <option value="Asia">Asia</option>
        </select>
    </div>

    <div className="form-group">
        <label htmlFor="companyType">Company Type</label>
        <select id="companyType" name="companyType" onChange={handleChange} required>
            <option value="">Select from dropdown</option>
            <option value="Bank">Bank</option>
            <option value="Business">Business</option>
            <option value="Investor">Investor</option>
        </select>
    </div>

    <div className="form-group">
        <label htmlFor="fullName">Full Name</label>
        <input type="text" id="fullName" name="fullName" onChange={handleChange} required />
    </div>

    <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input type="email" id="email" name="email" onChange={handleChange} required />
    </div>

    <div className="form-group">
        <label htmlFor="jobTitle">Job Title</label>
        <input type="text" id="jobTitle" name="jobTitle" onChange={handleChange} />
    </div>

    <div className="form-group">
        <label htmlFor="phone">Phone Number</label>
        <input type="text" id="phone" name="phone" onChange={handleChange} />
    </div>

    <div className="radio-group">
        <label>I would like:</label>
        <label><input type="radio" name="requestType" value="Platform Demo" onChange={handleChange} /> A platform demo</label>
        <label><input type="radio" name="requestType" value="Meeting" onChange={handleChange} /> A meeting with a company representative</label>
        <label><input type="radio" name="requestType" value="More Info" onChange={handleChange} /> Further information</label>
    </div>

    <div className="form-group">
        <label htmlFor="message">How can we help?</label>
        <textarea id="message" name="message" onChange={handleChange}></textarea>
    </div>

    <button type="submit" className="submit-btn">Submit</button>
</form>

      </div>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">
            <h2>🌱 GreenLedger</h2>
          </div>

          <div className="footer-links">
            <div>
              <h4>For Users</h4>
              <ul>
                <li><a href="#">For Banks</a></li>
                <li><a href="#">For Business</a></li>
                <li><a href="#">For Partners</a></li>
              </ul>
            </div>
            <div>
              <h4>About</h4>
              <ul>
                <li><a href="#">How It Works</a></li>
                <li><a href="#">Leadership Team</a></li>
                <li><a href="#">Latest News</a></li>
              </ul>
            </div>
            <div>
              <h4>Contact</h4>
              <ul>
                <li><a href="#">Support</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-cta">
            <button className="btn book-demo">Book a Demo</button>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 GreenLedger. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
