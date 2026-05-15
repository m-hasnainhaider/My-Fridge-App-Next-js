"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock } from "lucide-react";

const Signup = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    const userExists = existingUsers.find((u: any) => u.email === formData.email);
    if (userExists) {
      alert("This email is already registered!");
      return;
    }

    const newUser = {
      id: Date.now(),
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: "admin",
    };

    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));

    alert("Account Created Successfully! Data saved in LocalStorage.");

    setFormData({ fullName: "", email: "", password: "", confirmPassword: "" });
  };

  const styles = {
    container: {
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundImage: "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('/bg.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      fontFamily: "Arial, sans-serif",
    } as React.CSSProperties,
    card: {
      width: "90%",
      maxWidth: "400px",
      backgroundColor: "#ffffff",
      padding: "40px 30px",
      borderRadius: "20px",
      boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
    } as React.CSSProperties,
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "30px",
    } as React.CSSProperties,
    inputGroup: {
      marginBottom: "15px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "5px",
      color: "#555",
    },
    inputWrapper: {
      display: "flex",
      alignItems: "center",
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "10px 15px",
      backgroundColor: "#f9f9f9",
    },
    input: {
      border: "none",
      outline: "none",
      backgroundColor: "transparent",
      width: "100%",
      marginLeft: "10px",
    },
    button: {
      width: "100%",
      padding: "14px",
      backgroundColor: "#4ade80",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "15px",
    },
    footer: {
      textAlign: "center",
      marginTop: "20px",
      color: "#666",
    } as React.CSSProperties,
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSignup}>
        <h1 style={styles.title}>Create Account</h1>

        {/* Full Name */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Full Name</label>
          <div style={styles.inputWrapper}>
            <User size={18} color="#888" />
            <input
              type="text"
              name="fullName"
              placeholder="Enter your name"
              style={styles.input}
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email</label>
          <div style={styles.inputWrapper}>
            <Mail size={18} color="#888" />
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              style={styles.input}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <div style={styles.inputWrapper}>
            <Lock size={18} color="#888" />
            <input
              type="password"
              name="password"
              placeholder="********"
              style={styles.input}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Confirm Password</label>
          <div style={styles.inputWrapper}>
            <Lock size={18} color="#888" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="********"
              style={styles.input}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" style={styles.button}>
          Sign Up
        </button>

        <p style={styles.footer}>
          Already have an account?{" "}
          <span
            style={{ color: "#4ade80", fontWeight: "bold", cursor: "pointer" }}
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;