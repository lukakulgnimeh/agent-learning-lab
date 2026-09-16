#!/usr/bin/env node
// A minimal MCP server. It speaks JSON-RPC, one JSON object per stdin line.
// stdout is reserved for protocol messages; diagnostics go to stderr.
// This authenticated variant keeps the public server structure, but loads its
// meteoblue credential locally and uses meteoblue only for the forecast request.

import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

// Load the ignored repository .env file relative to this source file, not cwd.
// dotenv populates only this MCP process's environment.
dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

// public interface seen by agent: MCP offers the tool get_meteoblue_forecast
// with expected inputs city and date (single day)
const TOOL = {
  name: "get_meteoblue_forecast",
  description:
    "Get the daily meteoblue weather forecast for a city and ISO date. Use for current clothing recommendations.",
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
//note here that "stdout" is communication channel between MCP-client/Codex

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

  // The credential is loaded from .env into this process; never return or log it.
  const apiKey = process.env.METEOBLUE_API_KEY;
  if (!apiKey) {
    throw new Error("METEOBLUE_API_KEY is not configured. Create .env from .env.example.");
  }

  // Open-Meteo geocoding remains public and matches weather-mcp.mjs.
  const places = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
  ).then(readJson);
  const place = places.results?.[0];
  if (!place) throw new Error(`Could not find a location for ${city}.`);
  if (
    typeof place.latitude !== "number" ||
    typeof place.longitude !== "number" ||
    typeof place.elevation !== "number"
  ) {
    throw new Error(`Geocoding result for ${city} did not include latitude, longitude, and elevation.`);
  }

  // Unlike weather-mcp.mjs, the forecast provider requires its API key.
  // Keep this URL local: it contains the credential and must never be logged.
  const parameters = new URLSearchParams({
    apikey: apiKey,
    lat: String(place.latitude),
    lon: String(place.longitude),
    asl: String(place.elevation),
    format: "json",
  });
  const forecast = await fetch(
    `https://my.meteoblue.com/packages/basic-1h_basic-day?${parameters}`,
  ).then(readJson);

  // meteoblue provides daily arrays. Select only the requested date instead of
  // returning the provider's raw response.
  const daily = forecast.data_day;
  const index = daily?.time?.indexOf(date) ?? -1;
  if (index === -1) {
    throw new Error(`The meteoblue forecast does not contain the requested date ${date}.`);
  }

  const temperatureMin = daily.temperature_min?.[index];
  const temperatureMax = daily.temperature_max?.[index];
  const precipitationMm = daily.precipitation?.[index];
  const precipitationProbability = daily.precipitation_probability?.[index];
  const maxWindKmh = daily.windspeed_max?.[index];
  const weatherCode = daily.pictocode?.[index];
  if (
    [
      temperatureMin,
      temperatureMax,
      precipitationMm,
      precipitationProbability,
      maxWindKmh,
      weatherCode,
    ].some((value) => value === undefined || value === null)
  ) {
    throw new Error("The meteoblue forecast response is missing required daily weather values.");
  }

  // Return a compact, stable and predictable result for the agent to interpret.
  return {
    location: `${place.name}, ${place.country}`,
    date,
    temperatureC: { min: temperatureMin, max: temperatureMax },
    precipitation: {
      probabilityPercent: precipitationProbability,
      totalMm: precipitationMm,
    },
    maxWindKmh,
    weatherCode,
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

  // Server-handshake: telling MCP-client/Codex that it is weather-auth-mcp version 1.0.0 and offers tools
  if (message.method === "initialize") {
    return reply(message.id, {
      protocolVersion: message.params?.protocolVersion ?? "2025-03-26",
      capabilities: { tools: {} },
      serverInfo: { name: "weather-auth-mcp", version: "1.0.0" },
    });
  }

  // MCP-client/Codex can ask for tools and receives in this case get_meteoblue_forecast.
  if (message.method === "tools/list") return reply(message.id, { tools: [TOOL] });

  // MCP-client/Codex can ask to call a tool
  if (message.method === "tools/call") {
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
// The MCP-server receives JSON-RPC messages from the MCP-client/Codex via standard input.
// Messages are expected as JSON objects, separated by newline characters.
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  // Incoming data may arrive in partial chunks, so append every chunk to the buffer first.
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
