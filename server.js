/**
 * Main Node.js server script for your project
 */

const path = require("path");
const fs = require("fs");
const got = require("got");
const fastify = require("fastify")({
  // Enable detailed logging for easier debugging
  logger: true
});

// Load environment variables
const {
  TOKEN_URL,
  COMPANY_ID,
  API_KEY,
  POLICY_ID,
  FLOW_URL,
  PORT
} = process.env;

// Register static file handler
fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "public"),
  prefix: "/"
});

// Register form body parser
fastify.register(require("fastify-formbody"));

// Register templating engine
fastify.register(require("point-of-view"), {
  engine: {
    handlebars: require("handlebars")
  }
});

/**
 * Fetches SDK token from the specified endpoint
 * @returns {Promise<string>} - The access token
 */
async function fetchAccessToken() {
  const tokenUrl = `${TOKEN_URL}/v1/company/${COMPANY_ID}/sdktoken`;
  const options = {
    headers: {
      "X-SK-API-KEY": API_KEY
    }
  };

  try {
    const { access_token } = await got.get(tokenUrl, options).json();
    return access_token;
  } catch (error) {
    fastify.log.error("Failed to fetch access token:", error);
    throw new Error("Unable to fetch SDK token");
  }
}

// Render main page with dynamic data
fastify.get("/", async (request, reply) => {
  try {
    const accessToken = await fetchAccessToken();

    const params = {
      access_token: accessToken,
      company_id: COMPANY_ID,
      policy_id: POLICY_ID,
      flow_url: FLOW_URL,
      title: ""
    };

    reply.view("/src/pages/index.hbs", params);
  } catch (error) {
    reply.status(500).send({ error: "Failed to render page" });
  }
});

// Render main page with dynamic data
fastify.get("/upgrade", async (request, reply) => {
  try {
    const accessToken = await fetchAccessToken();

    const params = {
      access_token: accessToken,
      company_id: COMPANY_ID,
      policy_id: POLICY_ID,
      flow_url: FLOW_URL
    };

    reply.view("/src/pages/upgrade.hbs", params);
  } catch (error) {
    reply.status(500).send({ error: "Failed to render page" });
  }
});

// Route to serve JSON experience data
fastify.get("/experience/:name", async (request, reply) => {
  const { name } = request.params;
  const experienceFilePath = path.join(__dirname, "src/exp", `${name}.json`);
  
  console.log(experienceFilePath)

  try {
    const data = await fs.promises.readFile(experienceFilePath, "utf-8");
    reply.send(JSON.parse(data));
  } catch (err) {
    fastify.log.error("Error loading experience data:", err);
    reply.status(404).send({ error: "Experience not found" });
  }
});

// Start the server
fastify.listen(PORT, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server is running on ${address}`);
});
