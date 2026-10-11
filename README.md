# Auto-Ink’d

A responsive personal writing studio with a dark, amber-accented luxury design.

## Included
- Writing Studio with 12 independent mood selections, seven formats, and three lengths.
- Voice Library: add and remove your own writing samples.
- Voice DNA: tone, rhythm, signature habits, and phrases to avoid.
- Thinking Style: reflective, storyteller, analytical, or intuitive, with personal notes.
- Editable drafts, local autosave, saved-draft editing and search, copy, text export.
- Full JSON backup export and validated, additive backup import.
- Explicit local demo mode and authenticated, optional OpenAI generation.

Drafts, samples, and preferences are stored in this browser's local storage. They do not sync between devices or browsers. Export backups before clearing browser data. Imported items with an existing ID are kept as-is; import does not replace them. Profiles and the workspace restore from a backup only when the destination studio is empty.

Demo mode arranges notes into a labeled template. It is not AI. Mood, length, and voice adaptation require live AI. Voice Library is prompt context, not model training.

## Run locally
Use Node.js 22 or later. No packages need installing.
```
npm start
npm test
npm run check
```
Open http://127.0.0.1:4173.

## Deploy on Vercel
Import **nugglebug87/amber-writer**, select **Other** as the framework, leave the build command empty, and use **public** as the output directory. The checked-in vercel.json sets the output directory and the API function duration. No frontend build is required.

For live AI, add these server environment variables in Vercel's project settings, then redeploy:
- OPENAI_API_KEY: your provider API key.
- APP_ACCESS_TOKEN: a long, random studio access token you choose. This protects the paid endpoint.
- OPENAI_MODEL: optional, defaults to gpt-4.1-mini; choose a Responses API model available to your account.

Never commit keys or paste the provider key into the app. Enter only the studio access token in **AI Connection**. It stays in session memory and is not included in backups. Connection checking verifies server configuration and authorization; the first generated draft verifies the provider request.

When AI mode is used, the brief, selected moods, instructions, Voice DNA, Thinking Style, and up to 12,000 characters of samples are sent to OpenAI. The request uses store:false. The token is an owner access gate, not a multi-user account system; use platform protection and provider spending limits for broader access.

The app loads fonts from Google Fonts with local serif/sans-serif fallbacks. User writing is rendered as text, never HTML.

## Verification
Core and server tests cover multi-mood payloads, complete profile context, sample limits, backup validation, demo labeling, unavailable AI, authentication, and mocked provider responses. Live provider generation requires deployed credentials and is not represented by mock tests.

Official references:
- https://developers.openai.com/api/docs/guides/text
- https://vercel.com/docs/functions/runtimes/node-js
