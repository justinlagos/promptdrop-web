// Use-case page content. Pages render from this data; add a new entry here to
// publish a new use-case page (route, sitemap, and footer link still need a
// one-line update each). Keep every claim honest.

export const USE_CASES = {
  "content-creators": {
    slug: "content-creators",
    name: "Content creators",
    title: "Online Teleprompter for Content Creators | PromptDrop",
    description:
      "An online teleprompter for creators: read naturally on camera, record with the prompt beside your lens, and clean awkward pauses before you publish.",
    h1: "Teleprompter for content creators who want better takes.",
    problem:
      "You know what you want to say, but the camera changes things. Takes pile up, your eyes drift while you read, and editing out every stumble eats the time you wanted to spend making more videos.",
    solution:
      "PromptDrop keeps your script beside the lens so you read naturally, records the take in the same place, and Clean Take trims the awkward pauses afterwards. Fewer takes in, cleaner videos out.",
    features: [
      "Camera-level prompt that keeps your eyes close to the lens",
      "Adjustable speed, size, and colours so reading feels comfortable",
      "Built-in recording with saved takes you can compare",
      "Clean Take to remove awkward pauses and tighten pacing",
      "Works in the browser on desktop and mobile",
    ],
    workflow: [
      "Paste your script or write it in the studio",
      "Position the prompt beside your camera and set your pace",
      "Record your take while you read",
      "Tighten the result with Clean Take and export",
    ],
    faqs: [
      { q: "Will viewers be able to tell I'm reading?", a: "Far less than with a centre-screen prompter. Because the prompt sits at camera level, your eyes stay near the lens and the side-to-side scanning that gives reading away is much smaller." },
      { q: "Can I use it for YouTube and short-form video?", a: "Yes. Scripts of any length work, and Clean Take helps you tighten a take to the pace short-form video needs." },
      { q: "Do I have to install anything?", a: "No. The studio runs in your browser. Sign up, paste a script, and record." },
    ],
    relatedFeatures: ["teleprompter", "clean-take"],
    relatedBlog: ["best-online-teleprompter-for-creators", "how-to-record-better-video-takes"],
  },

  founders: {
    slug: "founders",
    name: "Founders",
    title: "Teleprompter for Founders — Pitches, Updates, Demos | PromptDrop",
    description:
      "Record sharper pitch videos, investor updates, and product demos. PromptDrop keeps your script beside the camera so you deliver it like you mean it.",
    h1: "Teleprompter for founders recording pitches, updates, and demos.",
    problem:
      "Investor updates, fundraising videos, product demos, all-hands recordings — founders are on camera constantly, usually without time to rehearse. Winging it produces rambling; reading produces a hostage video.",
    solution:
      "Write what you actually want to say, then deliver it with the script at camera level. You stay precise without sounding scripted, and you get a usable take in one or two attempts instead of ten.",
    features: [
      "Camera-level prompt for direct-to-lens delivery",
      "Script library so recurring updates start from last month's structure",
      "Built-in recording and instant review",
      "Clean Take to cut the pause where you checked your notes",
      "Browser meeting recording for calls that matter, with transcripts when connected",
    ],
    workflow: [
      "Draft the update or pitch as a script",
      "Record with the prompt beside your camera",
      "Clean the take and export",
      "Share with investors, customers, or your team",
    ],
    faqs: [
      { q: "How long should a pitch or update video be?", a: "Usually two to four minutes. A script keeps you inside that window; the prompt keeps the delivery natural while you stay on message." },
      { q: "Can I record a product demo with it?", a: "Yes. Record your browser tab or window while you narrate from the prompt, then tighten the result with Clean Take." },
      { q: "Can it help with investor calls?", a: "If the call runs in your desktop browser, you can record it and, with transcription connected, review a transcript and ask questions about what was discussed afterwards. Get consent where required." },
    ],
    relatedFeatures: ["teleprompter", "meeting-recorder"],
    relatedBlog: ["teleprompter-for-founder-pitch-videos", "video-script-tips"],
  },

  teachers: {
    slug: "teachers",
    name: "Teachers",
    title: "Teleprompter for Teachers and Course Creators | PromptDrop",
    description:
      "Record lessons and course videos with a camera-level teleprompter. Keep eye contact with students, stay on the lesson plan, and clean up takes quickly.",
    h1: "Teleprompter for teachers and course creators.",
    problem:
      "Recorded lessons compete with everything else on a student's screen. A lesson where the teacher's eyes wander across notes loses attention fast, and re-recording a 20-minute explanation because of one stumble is demoralising.",
    solution:
      "Script the lesson, keep it beside the camera, and deliver it as if you were looking at the class. If a section goes wrong, fix that section — Clean Take trims the stumbles without re-recording everything.",
    features: [
      "Camera-level prompt that preserves eye contact with students",
      "Comfortable reading controls: speed, size, line width, colour",
      "Record and review in the browser, nothing to install",
      "Clean Take to remove pauses and false starts",
      "Scripts saved and reusable across lessons and terms",
    ],
    workflow: [
      "Turn the lesson plan into a script",
      "Record with the prompt at camera level",
      "Trim pauses and tighten pacing with Clean Take",
      "Export and upload to your LMS or video platform",
    ],
    faqs: [
      { q: "Does reading from a script make lessons feel stiff?", a: "Not if the script is written for speech and the prompt is at camera level. Write short sentences, address the student directly, and let the prompt follow your pace." },
      { q: "Can I record longer lessons?", a: "Yes. There is no practical script length limit, and pacing controls help you keep a steady, comfortable reading speed across a long take." },
      { q: "Do students need anything to watch?", a: "No. You export a normal video file and publish it wherever your students already watch." },
    ],
    relatedFeatures: ["teleprompter", "clean-take"],
    relatedBlog: ["how-to-read-naturally-on-camera", "video-script-tips"],
  },

  sales: {
    slug: "sales",
    name: "Sales",
    title: "Teleprompter for Sales Videos and Demos | PromptDrop",
    description:
      "Record prospecting videos, demos, and follow-ups with your message beside the camera. Stay on point, look at the buyer, and review browser calls afterwards.",
    h1: "Teleprompter for sales videos, demos, and client calls.",
    problem:
      "Video prospecting works when it feels personal — and falls flat when the rep is visibly reading or rambling. On live calls, the discovery questions you meant to ask are in a doc you can't look at without breaking eye contact.",
    solution:
      "Keep your talk track at camera level for recorded outreach and demos, so you hit the message while looking at the buyer. For browser-based calls, record the meeting and review what the prospect actually said, with a transcript when connected.",
    features: [
      "Camera-level prompt for personalised outreach videos",
      "Reusable scripts for repeatable plays: intro, demo, follow-up",
      "Built-in recording with Clean Take to tighten the final cut",
      "Browser meeting recording for desktop web calls",
      "Transcripts and Ask, when connected, for follow-up notes",
    ],
    workflow: [
      "Personalise a script template for the account",
      "Record the video with the prompt beside the lens",
      "Clean the take and send it",
      "On browser calls, record (with consent) and review afterwards",
    ],
    faqs: [
      { q: "Can I record a personalised video per prospect quickly?", a: "Yes. Duplicate a script template, change the personalised lines, and record. The prompt keeps each take tight, so most videos are done in one attempt." },
      { q: "Can PromptDrop record my sales calls?", a: "It records meetings that run in your desktop browser — you choose the tab, window, or screen to capture. It does not record phone calls or WhatsApp calls, and you're responsible for consent where required." },
      { q: "Can I get notes from a recorded call?", a: "When transcription is connected on your plan, you get a transcript and can ask questions like 'what were the objections?' answered from what was said." },
    ],
    relatedFeatures: ["teleprompter", "meeting-recorder"],
    relatedBlog: ["browser-meeting-recording-guide", "how-to-record-better-video-takes"],
  },

  "job-interviews": {
    slug: "job-interviews",
    name: "Job interviews",
    title: "Practice Video Interview Answers with a Teleprompter | PromptDrop",
    description:
      "Practice interview answers on camera with a camera-level teleprompter. Structure your answers, record practice takes, and review how you actually come across.",
    h1: "Practice video answers with a camera-level teleprompter.",
    problem:
      "Video interviews and recorded screening answers are now standard, and most candidates have never seen themselves answer a question on camera. Rambling, looking away, and losing the thread are the usual failure modes.",
    solution:
      "Write your answers as short scripts, practice them with the prompt beside the camera, and record takes until your delivery is steady. Review the recordings to see what the interviewer will see.",
    features: [
      "Camera-level prompt so practice builds lens-level eye contact",
      "Scripts for your core stories: strengths, projects, why this role",
      "Record and review practice takes in the browser",
      "Clean Take to study a tightened version of your answer",
      "Works on desktop and mobile",
    ],
    workflow: [
      "Write answer outlines for likely questions",
      "Practice each answer with the prompt at camera level",
      "Record takes and review your delivery",
      "Refine the script and repeat until it sounds like you",
    ],
    faqs: [
      { q: "Should I read answers from a script in a real interview?", a: "No — use PromptDrop to practice. Scripting and rehearsing answers builds structure and confidence; in the live interview you speak freely, with the structure already in your head." },
      { q: "How do I stop looking away from the camera?", a: "Practice with the prompt at camera level. Your eyes learn to stay near the lens, which is exactly the habit a video interview rewards." },
      { q: "Can I practice on my phone?", a: "Yes. The mobile studio supports writing, prompting, and recording selfie takes." },
    ],
    relatedFeatures: ["teleprompter", "clean-take"],
    relatedBlog: ["how-to-read-naturally-on-camera", "video-script-tips"],
  },

  "online-courses": {
    slug: "online-courses",
    name: "Online courses",
    title: "Record Course Videos with a Teleprompter | PromptDrop",
    description:
      "Record online course videos with a cleaner speaking flow: script each lesson, prompt at camera level, and trim awkward pauses before publishing.",
    h1: "Record course videos with a cleaner speaking flow.",
    problem:
      "A course is dozens of videos, and quality has to hold from lesson one to lesson forty. Improvising each lesson produces uneven pacing and endless retakes; the editing backlog is where courses go to die.",
    solution:
      "Script every lesson, record with the prompt beside the lens, and run each take through Clean Take. The result is a consistent voice and pace across the whole course, with far less editing per video.",
    features: [
      "Camera-level prompting for consistent, direct delivery",
      "Script library that holds the whole course outline",
      "Steady pacing controls across long recording sessions",
      "Clean Take for fast, repeatable cleanup of every lesson",
      "Captioned exports where transcription is available on your plan",
    ],
    workflow: [
      "Write lesson scripts from your course outline",
      "Batch-record lessons with the prompt at camera level",
      "Clean each take: trim pauses, tighten pacing",
      "Export and upload to your course platform",
    ],
    faqs: [
      { q: "How does this compare to editing in a video editor?", a: "Clean Take covers the cleanup most talking-head lessons need — trimming, pause removal, pacing — in a fraction of the time. For heavy effects or multi-camera work you'd still use a full editor." },
      { q: "Can I keep a consistent pace across many videos?", a: "Yes. Your prompt speed and layout settings persist, so lesson 30 reads at the same comfortable pace as lesson 1." },
      { q: "Do captions come built in?", a: "Captioned exports are available where transcription is connected on your plan." },
    ],
    relatedFeatures: ["teleprompter", "clean-take"],
    relatedBlog: ["how-to-record-better-video-takes", "video-script-tips"],
  },
};

export const USE_CASE_LIST = Object.values(USE_CASES);
