"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. ADMIN CHECK
    if (email === "admin@gmail.com" && password === "admin") {
      const adminData = { fullName: "Administrator", email: "admin@gmail.com", role: "admin" };
      localStorage.setItem("currentUser", JSON.stringify(adminData));
      router.push("/admin");
      return;
    }

    // 2. NORMAL USER CHECK
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      router.push("/dashboard");
    } else {
      alert("Invalid credentials! Please try again.");
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundImage: "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('/bg.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      fontFamily: "Arial, sans-serif",
    } as React.CSSProperties,
    card: {
      width: "90%",
      maxWidth: "380px",
      backgroundColor: "#ffffffda",
      padding: "50px 30px",
      borderRadius: "20px",
      boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
      textAlign: "center",
    } as React.CSSProperties,
    title: {
      fontSize: "32px",
      fontWeight: "bold",
      color: "#1a1a1a",
      marginBottom: "40px",
    },
    inputGroup: {
      marginBottom: "20px",
      textAlign: "left",
    } as React.CSSProperties,
    label: {
      display: "block",
      fontSize: "15px",
      fontWeight: "600",
      color: "#444",
      marginBottom: "8px",
    },
    inputWrapper: {
      display: "flex",
      alignItems: "center",
      border: "1px solid #e0e0e0",
      borderRadius: "10px",
      padding: "12px 15px",
      backgroundColor: "#fcfcfc",
    },
    input: {
      border: "none",
      outline: "none",
      backgroundColor: "transparent",
      width: "100%",
      fontSize: "14px",
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
      marginTop: "20px",
      transition: "background 0.3s ease",
    },
    footer: {
      marginTop: "30px",
      fontSize: "14px",
      color: "#666",
    },
    link: {
      color: "#4ade80",
      fontWeight: "bold",
      cursor: "pointer",
      textDecoration: "none",
      marginLeft: "5px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Login</h1>

        <form onSubmit={handleLogin}>
          {/* Email Field */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} color="#888" />
              <input
                type="email"
                placeholder="your.email@example.com"
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} color="#888" />
              <input
                type="password"
                placeholder="********"
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = "#22c55e")}
            onMouseOut={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = "#4ade80")}
          >
            Login
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?
          <span style={styles.link} onClick={() => router.push("/signup")}>
            Create one
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;