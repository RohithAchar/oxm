"use client";

// TODO: Implement the messages page
const Page = async () => {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <button
        onClick={() => window.history.back()}
        style={{ marginBottom: "1rem" }}
      >
        ← Back
      </button>
      <h2>Learn Page</h2>
      <p>This page is under construction.</p>
    </div>
  );
};

export default Page;
