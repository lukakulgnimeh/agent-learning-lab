---
name: weather-to-clothing
description: >-
  Rules for translating weather data (apparent temperature, precipitation, wind,
  sun) into abstract clothing requirements such as layering need, wind protection
  and water resistance. Use when interpreting weather conditions for the purpose of
  deciding what someone should wear or whether conditions are comfortable outdoors.
---

# Weather → clothing requirements

Output **requirements**, never garments. You do not know which clothes the person
owns; naming an item is the supervisor's job, not yours.

Vocabulary to use:

- `base layer` — what touches the skin (short or long sleeves)
- `mid-layer` — insulating (sweater, fleece)
- `outer layer` — protective (wind-resistant, water-resistant)
- `long` / `short` legs
- `sun protection`, `covered extremities`

## 1. Temperature bands

Use **apparent (feels-like)** temperature. Take the coldest hour the person will be
outside, not the daily maximum.

| Feels like | Requirement |
|---|---|
| ≥ 27 °C | Short-sleeve base layer, short legs. Lightest, most breathable fabrics. Sun protection. |
| 22–27 °C | Short-sleeve base layer, short or light long legs. |
| 17–22 °C | Short-sleeve base layer, long legs. A mid-layer to carry for the evening. |
| 12–17 °C | Long-sleeve base layer **or** short sleeves plus a light mid-layer. Long legs. |
| 7–12 °C | Mid-layer required, long legs. An outer layer if wind or rain is present. |
| 2–7 °C | Insulating mid-layer **and** a protective outer layer. Long legs. |
| < 2 °C | Heavy insulation, outer layer, covered extremities (hands, head, neck). |

## 2. Wind

Wind removes perceived warmth and defeats loose, open-weave fabrics.

- **< 12 km/h** — ignore.
- **12–25 km/h** — treat the temperature as one band colder; prefer a closed outer layer.
- **25–40 km/h** — wind-resistant outer layer required. Avoid loose, flapping items.
- **> 40 km/h** — wind protection dominates; mention it as the main constraint.

For cycling or running, add roughly the travel speed to the wind figure — self-generated
wind is real and cools the front of the body most.

## 3. Precipitation

- **Probability < 30 % and no measurable amount** — mention it, require nothing.
- **30–60 %** — a water-resistant outer layer is advisable; note the expected hours.
- **> 60 %, or any steady rain** — water-resistant outer layer required, plus
  water-tolerant footwear and legs that do not soak through.
- **Absorbent natural fabrics** (linen, light cotton) are a poor choice in any rain:
  they hold water and cool the wearer sharply. Flag this whenever rain is expected.
- **Snow or ice** — add covered extremities and grip underfoot regardless of the
  temperature band.

## 4. Sun and UV

- Strong sun with clear sky: sun protection — covered shoulders, light colours, head
  cover. Relevant for long outdoor exposure even at moderate temperatures.
- Overcast: no sun requirement, but note that overcast days feel cooler than the
  number suggests in wind.

## 5. Change within the window

- If feels-like temperature varies by **more than 8 °C** across the window, require
  **removable layers** and say so explicitly — this matters more than the exact band.
- If rain starts or stops mid-window, name the hours.
- Morning-to-evening drops are the common case: dress for the coldest hour, with the
  ability to shed.

## 6. Conflicts

When two rules disagree, order of priority:

1. Rain / snow protection
2. Wind protection
3. Temperature band
4. Sun protection

State the dominant constraint first in your assessment.
