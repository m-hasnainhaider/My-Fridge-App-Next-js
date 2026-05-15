"use client";

import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  const styles = {
    container: {
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundImage: "url('/bg.png')",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
    } as React.CSSProperties,
    card: {
      width: "90%",
      maxWidth: "500px",
      padding: "80px 40px",
      backgroundColor: "#ffffffdc",
      borderRadius: "10px",
      textAlign: "center",
      boxShadow: "0px 0px 12px rgba(0,0,0,0.1)",
    } as React.CSSProperties,
    screenName: {
      fontSize: "14px",
      color: "#888",
      marginBottom: "8px",
    },
    title: {
      fontSize: "26px",
      marginBottom: "25px",
      color: "#222",
    },
    button: {
      width: "100%",
      padding: "12px",
      marginBottom: "12px",
      fontSize: "16px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    signup: {
      backgroundColor: "#4CAF50",
      color: "#fff",
    },
    login: {
      backgroundColor: "#e0e0e0",
      color: "#333",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.screenName}>Welcome</h2>
        <h1 style={styles.title}>My Fridge Food</h1>

        <button
          style={{ ...styles.button, ...styles.signup }}
          onClick={() => router.push("/signup")}
        >
          Sign Up
        </button>

        <button
          style={{ ...styles.button, ...styles.login }}
          onClick={() => router.push("/login")}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Home;