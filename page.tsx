"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [instructions, setInstructions] = useState("");
  const [summary, setSummary] = useState("");
  const [recipient, setRecipient] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState("");

  // 🔹 Call Summarize API
  const handleSummarize = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, instructions }),
      });

      const data = await res.json();
      setSummary(data.summary || "No summary generated.");
    } catch (err) {
      console.error(err);
      setSummary("❌ Error generating summary.");
    }
    setLoading(false);
  };

  // 🔹 Call Send Email API
  const handleSendEmail = async () => {
    if (!recipient || !summary) {
      alert("Please enter recipient and generate summary first.");
      return;
    }
    setEmailStatus("Sending...");
    try {
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient,
          subject: "Your Summary",
          message: summary,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEmailStatus("✅ Email sent successfully!");
      } else {
        setEmailStatus("❌ Failed to send email.");
      }
    } catch (err) {
      console.error(err);
      setEmailStatus("❌ Error sending email.");
    }
  };

  return (
    <main style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>AI Summarizer ✨</h1>

      <textarea
        rows={5}
        placeholder="Enter text to summarize..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <input
        type="text"
        placeholder="Enter custom instructions..."
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <button onClick={handleSummarize} disabled={loading}>
        {loading ? "Generating..." : "Generate Summary"}
      </button>

      {summary && (
        <div style={{ marginTop: "20px" }}>
          <h2>Summary</h2>
          <textarea
            rows={4}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            style={{ width: "100%" }}
          />

          <h3>Send via Email</h3>
          <input
            type="email"
            placeholder="Recipient email"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <button onClick={handleSendEmail}>Send</button>
          <p>{emailStatus}</p>
        </div>
      )}
    </main>
  );
}
