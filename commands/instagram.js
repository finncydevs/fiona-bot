const http = require("https");

async function insta(sock, chatId, target) {
  const options = {
    method: "GET",
    hostname: "instagram-scraper-api2.p.rapidapi.com",
    port: null,
    path: `/v1.2/posts?username_or_id_or_url=${target}`,
    headers: {
      "x-rapidapi-key": "2673d53473mshd937f9ca5b2055ap16f3c7jsn670534367258",
      "x-rapidapi-host": "instagram-scraper-api2.p.rapidapi.com",
    },
  };

  // Membuat permintaan HTTPS ke API
  const fetchData = () =>
    new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const body = Buffer.concat(chunks).toString();
          resolve(body);
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      req.end();
    });

  try {
    const response = await fetchData();
    const data = JSON.parse(response); // Mengonversi respons menjadi objek

    // Menyusun pesan yang akan dikirimkan
    const message = `
Instagram User Info:
- Username: ${data.username || "N/A"}
- Full Name: ${data.full_name || "N/A"}
- Bio: ${data.biography || "N/A"}
- Followers: ${data.followers_count || "N/A"}
- Following: ${data.following_count || "N/A"}
- Total Posts: ${data.posts_count || "N/A"}
- Profile Picture: ${data.profile_picture || "N/A"}
    `;

    // Mengirimkan pesan ke WhatsApp
    await sock.sendMessage(chatId, { text: message });
    console.log("Message sent to WhatsApp successfully!");
  } catch (error) {
    console.error("Error fetching data or sending message:", error.message);

    // Mengirim pesan error ke WhatsApp
    await sock.sendMessage(chatId, {
      text: `Failed to fetch Instagram data for username '${target}'. Please try again.`,
    });
  }
}

module.exports = insta;

``