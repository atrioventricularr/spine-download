const fs = require("fs");
const fetch = require("node-fetch");

async function testCreateSessionFolder() {
  const repoOwner = "atrioventricularr";
  const repoName = "spine-download";
  const sessionId = "session-" + Date.now();

  const pathInRepo = `sessions/${sessionId}/README.md`;
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${pathInRepo}`;

  const response = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: `create session ${sessionId}`,
      content: Buffer.from("Session created").toString("base64")
    })
  });

  const result = await response.json();
  console.log(result);
}
