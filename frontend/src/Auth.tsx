import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

interface FormData {
  companyName: string;
  registrationNumber: string;
  industryType: string;
  country: string;
  address: string;
  email: string;
  phone: string;
  website?: string;
  taxID: string;
  password: string;
  confirmPassword?: string;
}

function Auth() {
  const [isRegistering, setIsRegistering] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    registrationNumber: "",
    industryType: "",
    country: "",
    address: "",
    email: "",
    phone: "",
    website: "",
    taxID: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegistering && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log(isRegistering ? "Registering Company: " : "Logging in: ", formData);

    setTimeout(() => {
      navigate("/home"); // Ensure this route exists
    }, 1000);
  };

  return (
    <div className="auth-container">
      {/* Home Button */}
      <button className="home-btn" onClick={() => navigate("/")}>
        {/* Use an SVG instead of an image for better scalability */}
        <svg className="home-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px" height="24px">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
        <span>Home</span>
      </button>

      <div className="auth-box">
        <h2>{isRegistering ? "Company Registration" : "Login"}</h2>

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              {[
                { label: "Company Name", name: "companyName" },
                { label: "Registration Number", name: "registrationNumber" },
                { label: "Industry Type", name: "industryType" },
                { label: "Country", name: "country" },
                { label: "Address", name: "address" },
                { label: "Phone", name: "phone" },
                { label: "Website (Optional)", name: "website" },
                { label: "Tax ID", name: "taxID" },
              ].map(({ label, name }) => (
                <div className="form-group" key={name}>
                  <label>{label}</label>
                  <input
                    type="text"
                    name={name}
                    placeholder={label}
                    value={formData[name as keyof FormData]}
                    onChange={handleChange}
                    required={name !== "website"}
                  />
                </div>
              ))}
            </>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {isRegistering && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <button type="submit" className="auth-btn">
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>

        <p className="toggle-auth" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "Already have an account? Login" : "Create a company account"}
        </p>
      </div>
    </div>
  );
}

export default Auth;
