# Take Home Test Instructions

  The goal of this problem is to create a drag and drop interface for a scheduling system. You will use a PetPocketbook API to initialize a days schedule, store it, and then allow the user to move appointments around and delete them.

  ### Do all your work in a new branch
  When you're ready to submit just open a Pull Request on your branch

  * **Please do not spend more than 4 hours on this test**
  * **If it takes more than 4 hours just write how you would plan to finish the tasks**

# AI Usage Disclosure

  You are welcome to use AI tools while completing this exercise.
  If you do use AI tooling, please include a brief write-up describing:

  * Which tools you used
    * was the AI integrated directly into your IDE/editor (such as Cursor, Copilot, Windsurf, etc.)
    * or did you use a separate browser/app-based tool (ChatGPT, Claude web, Google, etc.)

  * How you used the tool
    * did you use any specific modes such as “plan,” “ask,” or “agent”
    * did you provide the AI with the entire task and then review/tweak the results
    * did you first come up with your own design/plan and then use AI to help implement parts incrementally
    * did you primarily use it for debugging, brainstorming, implementation help, refactoring, or guidance
    * Something else - please explain

  * Were there portions you intentionally implemented yourself versus portions that were AI-assisted. Please explain why
  * Approximately what percentage of the final implementation was AI-assisted

  Please also include exported chat transcripts/prompts in your branch.
  Using AI tools will not negatively impact your evaluation. We are primarily interested in understanding your engineering process, decision-making, and how you leverage available tools during development.

# Features / Requirements

  1. For any day that doesn't already have a schedule you will initialize one using the PetPocketbook API (instructions below)
  2. Save that schedule and display it anytime someone views that same day
  3. Allow the user to choose what date they would like to view (default is today)
  4. Show a schedule for the given day (see Wireframe A for reference)
    * Avatar images should reflect what type of pet the appointment is for
  5. Allow users to drag and drop appointments from one time frame to any other
  6. Make the page mobile friendly (see Wireframe B for reference)
  7. Allow users to delete an appointment by dragging the appointment over the trash icon (doesn't apply to mobile)

  * Pet avatar images are in public/images
  * API key: `jQkI63suJhqd3DtL`

# Wireframes

  * You can modify the design anyway you'd like just be prepared to give a reason for the change

  ![Alt text](/public/Desktop_Wireframe.png?raw=true "Desktop Wireframe")
  * Both the date header and the side bar should stay on screen while scrolling
  * The arrows around the date should bring you to the previous and next days
  * There should be a time slot for every 30 minutes from 8 AM - 6 PM
  * If a time slot has too many appointments it should overflow to the next line

  ![Alt text](/public/Mobile_Wireframe.png?raw=true "Mobile Wireframe")
  * There is no trash drag and drop section on mobile
  * Clicking on the calendar icon in the top bar shows the second wireframe

# How to run the app

This project has two pieces that share one repo:

* **Backend** — Express + SQLite, in this folder. Exposes `/api/schedule` and (in prod) serves the built SPA. Runs on `http://localhost:3000`.
* **Frontend** — React + Vite SPA in [`client/`](client/). In dev runs on `http://localhost:5173` and proxies `/api` and `/images` to the backend.

### First-time setup

```bash
npm install                # backend deps
npm run client:install     # frontend deps (or `npm install` inside client/)
```

### Development (recommended)

```bash
npm run dev
```

This uses `concurrently` to run the Express API on `:3000` and the Vite dev server on `:5173`. Open `http://localhost:5173` in your browser. Edits to `client/src/**` hot-reload; API changes restart by re-running the script.

### Production-style run

```bash
npm run start:prod
```

Builds the SPA into `client/dist/` and starts Express on `:3000`, which serves both the API and the static SPA at the same origin. Set `OPEN_BROWSER=false` to skip opening the browser.

### API surface

* `GET  /api/schedule?date=YYYY-MM-DD` — returns the stored schedule for that date, seeding from the PetPocketbook upstream on the first request.
* `PUT  /api/schedule?date=YYYY-MM-DD` — body `{ appointments: [...] }`, replaces the day's schedule (used by drag-to-move).
* `DELETE /api/schedule/:appointmentId?date=YYYY-MM-DD` — removes a single appointment (used by drag-to-trash).

Schedules are persisted to `db/schedules.sqlite` (auto-created, gitignored).

### Environment

* `PORT` — backend port (default `3000`).
* `OPEN_BROWSER` — set to `false` to skip opening a browser when starting Express.
* `PETPOCKETBOOK_API_KEY` — override the upstream API key (defaults to the key in this README).

# PetPocketbook Schedule API

### Get a schedule
```
  URL: 'candidate.petpocketbook.com/schedule'

  METHOD: GET

  PARAMS:
    api_key (string): Your personalized api key located at top of take home test README

  RESPONSE (format: json):
    appointments: array of appointments with the following objects
        pet:
          name: string
          type: string (allowed values are: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hedgehog', 'Turtle', 'Rodent'])
        time: string (30 minute increments from 8 AM - 6 PM, ex: '8:30 AM')

  EXAMPLE RESPONSE:
  {"appointments":[
    {
      "pet":{
        "name":"Briar",
        "type":"Hedgehog"
      },
      "time":"12:30 PM"
    },
    {
      "pet":{
        "name":"Beau",
        "type":"Rabbit"
      },
      "time":"12:00 PM"
    },
    {
      "pet":{
        "name":"Nellie",
        "type":"Dog"
      },
      "time":"3:00 PM"
    },
    {
      "pet":{
        "name":"Stella",
        "type":"Rodent"
      },
      "time":"5:00 PM"
    },
    {
      "pet":{
        "name":"Bruno",
        "type":"Rodent"
      },
      "time":"8:00 AM"
    }
  ]}
```