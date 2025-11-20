const axios = require("axios");

async function getCandidateReport(profile, prompt, OPENAI_API_KEY) {
    try {
        const response = await axios.post( "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return {
            studentName: profile.split("\n")[0].trim(), // take first line as name
            guidance: response.data.choices[0].message.content.trim(), // model response
        };
    } catch (err) {
        console.error("Error generating report:", err.message);

        return {
            studentName: profile.split("\n")[0].trim(),
            guidance: `Error: ${err.message}`,
        };
    }
}

module.exports = getCandidateReport;
