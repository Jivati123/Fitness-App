# Jivati - Fitness Challenge Quiz

A bilingual (English/Hindi) interactive fitness assessment tool that calculates user fitness scores and tracks leads with referral support.

## Features

- **Bilingual Support**: English and Hindi with language toggle
- **Lead Capture**: Collects user name and phone number
- **5-Question Quiz**: Interactive fitness assessment
- **Fitness Score**: Calculates and displays personalized fitness score (0-100%)
- **Referral Tracking**: Built-in referral system with unique lead IDs
- **Local Storage**: Stores leads and referral data in browser
- **Responsive Design**: Mobile-friendly interface
- **Auto Country Detection**: Detects user's country code for phone input

## File Structure

```
/
├── index.html          # Main fitness quiz application
├── referral.html       # (To be created) Referral page
├── vercel.json         # Vercel deployment config
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Local Development

Open `index.html` in your browser. No build process needed - it's a static HTML application.

## Deployment

Deployed on Vercel at: [Your URL will appear here]

## How It Works

1. User enters name and phone number
2. User answers 5 fitness-related questions
3. App calculates fitness score (0-100%)
4. User is redirected to referral page
5. Lead data stored in browser's localStorage

## Data Storage

- Leads stored in `localStorage.leads` as JSON
- Each lead includes: name, phone, score, language, timestamp, referral data
- No server required - completely client-side

## Note

You'll need to create a `referral.html` page for the redirect after quiz completion.
