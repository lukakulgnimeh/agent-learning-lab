#!/usr/bin/env node
//Shebang tells OS which interpreter to use, OS starts file and reads shebang,
//env searches for node in PATH, Node.js is started, Node.js loads actual js file,
//V8 Javascript-Engine used by Node (Code is parsed, internal representation, Bytecode generated and executed, often used code optimized via Just-in-time compiler, get optimized machine code, CPU execution),
//Node.js at the same time manages processes and provides filesystem access, networking, timers, other system APIs


// A minimal MCP server. It speaks JSON-RPC, one JSON object per stdin line.
// stdout is reserved for protocol messages; diagnostics go to stderr.
// Remarks on architecture. 
// TOOL: Interface, i.e. what can the agent use?; 
// handle(): request handling / routing, i.e. what MCP request was submitted, and which implementation is to be carried out?
// getForecast(): Implementation / Business logic, i.e. from a technical standpoint, what happens when this tool is run?



// public interface seen by agent: MCP offers the tool get_weather_forecast with expected inputs city and date (single day)
const TOOL = {
  name: "get_weather_forecast",
  description:
    "Get the daily weather forecast for a city and ISO date. Use for current clothing recommendations.",
  inputSchema: {
    type: "object",
    properties: {
      city: { type: "string", description: "City name, for example Berlin." },
      date: { type: "string", description: "Date in YYYY-MM-DD format." },
    },
    required: ["city", "date"],
    additionalProperties: false,
  },
};

//send answer to MCP-client/Codex 
function reply(id, result) {
  process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id, result })}\n`);
}
//note here that "stdout" is communication channel between MCP-client/Codex and this process (as mentioned above)

//send failure answer to MCP-client/Codex 
function fail(id, code, message) {
  process.stdout.write(
    `${JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } })}\n`,
  );
}

//actual weather logic: function expects city and date and returns according weather data
async function getForecast({ city, date }) {
  //input validation
  if (typeof city !== "string" || !city.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Provide a city and a date in YYYY-MM-DD format.");
  }

  // Open-Meteo is public and needs no API key for this learning example.
  // Preparation HTTP request to convert the city into coordinates 
  const places = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
  ).then(readJson);
  //take first result if exists, no error else such that can throw particular error
  const place = places.results?.[0];
  if (!place) throw new Error(`Could not find a location for ${city}.`);

  // fix the weather data we want
  const parameters = new URLSearchParams({
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max",
    timezone: "auto",
    start_date: date,
    end_date: date,
  });
  // Actual HTTP request
  const forecast = await fetch(`https://api.open-meteo.com/v1/forecast?${parameters}`).then(readJson);
  const daily = forecast.daily;

  // Return a compact, stable and predictable result for the agent to interpret.
  return {
    location: `${place.name}, ${place.country}`,
    date,
    temperatureC: { min: daily.temperature_2m_min[0], max: daily.temperature_2m_max[0] },
    precipitation: {
      probabilityPercent: daily.precipitation_probability_max[0],
      totalMm: daily.precipitation_sum[0],
    },
    maxWindKmh: daily.wind_speed_10m_max[0],
    weatherCode: daily.weather_code[0],
  };
}

// Helper-function to check whether HTTP response was successful
async function readJson(response) {
  if (!response.ok) throw new Error(`Weather API request failed: HTTP ${response.status}.`);
  return response.json();
}

// MCP part: until now was just Node.js program calling weather-API but now 
//this function processes messages from the MCP-client/Codex to the MCP server
async function handle(message) {
  // Notifications do not have an id and therefore receive no response.
  if (message.method === "notifications/initialized") return;

  // Server-handshake: telling MCP-client/Codex that it is weather-mcp version 1.0.0 and offers tools
  if (message.method === "initialize") {
    return reply(message.id, {
      protocolVersion: message.params?.protocolVersion ?? "2025-03-26",
      capabilities: { tools: {} },
      serverInfo: { name: "weather-mcp", version: "1.0.0" },
    });
  }

  // MCP-client/Codex can ask for tools and receives in this case get_weather_forecast.
  // Codex discovers the tool through the MCP-server with no need to have given Codex that information in the prompt.
  if (message.method === "tools/list") return reply(message.id, { tools: [TOOL] });

  // MCP-client/Codex can ask to call a tool
  if (message.method === "tools/call") {
    // check that want to actually call the get_weather_forecast tool.
    // currently only tied to the one tool. If would add another const TOOL2 and add to tools list,
    // one would get an error each time since it does not agree with TOOL.name.
    // But for a fix, then here need to add e.g. else if to check if client message wants other tool.
    // So handle() is kind of a router.
    if (message.params?.name !== TOOL.name) return fail(message.id, -32601, "Unknown tool.");
    try {
      // call function getForecast to obtain weather data
      const weather = await getForecast(message.params.arguments ?? {});
      // server returns result to MCP-client/Codex
      return reply(message.id, {
        content: [{ type: "text", text: JSON.stringify(weather, null, 2) }],
      });
    } catch (error) {
      return reply(message.id, {
        content: [{ type: "text", text: error.message }],
        isError: true,
      });
    }
  }

  if (message.id !== undefined) return fail(message.id, -32601, "Method not found.");
}

let buffer = "";
// The MCP-server receives JSON-RPC (implements client server model and communication) messages (i.e. {"jsonrpc":"2.0","id":1,"method":"tools/list"} or even separated somewhere into chunks)
// from the MCP-client/Codex via standard input (stdin).
// Messages are expected as JSON objects, separated by newline characters.
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  // Incoming data may arrive in partial chunks, so append every chunk to the buffer first (collect everything to properly deal with split messages).
  buffer += chunk;
  // Split all currently complete messages into lines.
  const lines = buffer.split("\n");
  // Keep the last element in the buffer because it may be an incomplete message.
  buffer = lines.pop();
  // Process every complete JSON-RPC message.
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      // Parse the JSON-RPC message and pass it to the request handler.
      handle(JSON.parse(line)).catch((error) => console.error(error));
    } catch (error) {
      // Invalid JSON is treated as a protocol/input error.
      console.error("Invalid JSON-RPC message:", error.message);
    }
  }
});
