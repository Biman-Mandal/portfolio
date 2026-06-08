export default function NotFound() {
  return (
    <div style={{ 
      padding: "120px 20px", 
      textAlign: "center", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      minHeight: "60vh"
    }}>
      <h1 style={{ fontSize: "3rem", margin: "0 0 10px", color: "var(--accent)" }}>404</h1>
      <h2 style={{ fontSize: "1.5rem", margin: "0 0 20px" }}>Page Not Found</h2>
      <p style={{ color: "var(--muted)", maxWidth: "400px", margin: "0 0 30px", lineHeight: "1.6" }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <a href="/" style={{ 
        color: "#ffffff", 
        background: "var(--accent)", 
        padding: "10px 24px", 
        borderRadius: "8px", 
        fontWeight: "600",
        boxShadow: "0 4px 14px rgba(24, 213, 181, 0.4)",
        transition: "transform 0.2s ease"
      }}>
        Return Home
      </a>
    </div>
  );
}
