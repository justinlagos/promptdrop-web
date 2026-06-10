// Feature page content. Pages render from this data so new features can be
// added without touching components. All copy must stay honest: no phone-call
// recording, no WhatsApp recording, no guaranteed private screen share, no
// automatic filler removal unless transcription is connected.

export const FEATURES = {
  teleprompter: {
    slug: "teleprompter",
    name: "Teleprompter",
    title: "Camera-Level Teleprompter for Video Recording | PromptDrop",
    description:
      "PromptDrop is an online teleprompter that sits beside your camera so you can read naturally, keep your eyes close to the lens, and record better takes.",
    h1: "Camera-level teleprompter for natural video recording.",
    intro:
      "Paste your script, position the prompt beside your lens, and read at your own pace. PromptDrop is a video script teleprompter built for one job: helping you sound like a person, not a reader.",
    ogImage: "/og/og-teleprompter.png",
    sections: [
      {
        h2: "What it does",
        body: [
          "PromptDrop puts your script in a small, movable prompt that you place right next to your camera. You write or paste your script, set the speed and text size, and record while you read. Because the prompt sits at camera level, your eyes stay close to the lens instead of drifting to the middle of the screen.",
          "It runs in your browser, so there is nothing to install to get started. Your scripts and settings sync to your account, and you can record your take directly in the studio.",
        ],
      },
      {
        h2: "Why camera-level prompting matters",
        body: [
          "Most teleprompters put the script in the centre of your screen. Your camera is at the top. That gap is why so many recorded videos look read rather than spoken: viewers can see your eyes scanning below the lens.",
          "Moving the prompt to camera level shrinks that gap. Your gaze stays near the lens, micro eye movement becomes far less visible, and your delivery reads as eye contact. It is a small change in layout that makes a large difference in how natural you look.",
        ],
      },
      {
        h2: "How PromptDrop works",
        body: [
          "Three steps: paste your script, align the prompt near your camera, and record. The prompt scrolls at a pace you control, and you can pause, restart, or jump back at any time. When the take is done, review it in the studio and re-record the parts you want to improve.",
        ],
      },
      {
        h2: "Speed, size, colour, and layout controls",
        body: [
          "Reading comfort is personal, so the prompt is adjustable: scroll speed, font size, line width, text and background colour, and prompt position are all under your control. Set it once and your preferences are remembered for the next session.",
        ],
      },
      {
        h2: "Record with the teleprompter",
        body: [
          "Recording is built in. Capture your camera and microphone while you read, then review the take immediately. Takes are saved so you can compare versions, and Clean Take can help you tighten the result by trimming awkward pauses.",
        ],
      },
      {
        h2: "Mobile and desktop",
        body: [
          "PromptDrop works in the browser on desktop and on your phone, with large touch controls on mobile for writing, prompting, and recording selfie takes. A Mac desktop app with a floating overlay is planned; see the download page for current status.",
        ],
      },
    ],
    faqs: [
      { q: "What is a camera-level teleprompter?", a: "A teleprompter that positions your script next to your camera rather than in the middle of the screen, so your eyes stay close to the lens while you read and your delivery looks natural." },
      { q: "Do I need special hardware?", a: "No. PromptDrop runs in your browser and uses your existing camera and microphone. There is no mirror rig or external prompter screen to buy." },
      { q: "Can I record while I prompt?", a: "Yes. Recording is built into the studio, so you can read from the prompt and capture your camera and microphone in the same place, then review the take immediately." },
      { q: "Does it work on a phone?", a: "Yes. You can write or paste scripts, prompt, and record selfie takes on mobile in the browser, with controls sized for touch." },
      { q: "How fast should the prompt scroll?", a: "Most people speak comfortably at 140 to 170 words per minute. PromptDrop lets you set the pace and adjust it mid-take, so the prompt follows your delivery rather than rushing it." },
    ],
    relatedUseCases: ["content-creators", "founders", "job-interviews"],
    relatedBlog: ["how-to-read-naturally-on-camera", "best-online-teleprompter-for-creators", "video-script-tips"],
  },

  "clean-take": {
    slug: "clean-take",
    name: "Clean Take",
    title: "Clean Up Recorded Videos Online — Clean Take | PromptDrop",
    description:
      "Clean Take helps you tighten recorded videos: trim awkward pauses, adjust pacing, and export a cleaner edit without learning a complicated video editor.",
    h1: "Clean up your recorded videos without a complicated editor.",
    intro:
      "Clean Take takes the recording you just made and helps you remove the awkward parts: long pauses, slow starts, and dead air. You keep the original; you export the cleaner edit.",
    ogImage: "/og/og-clean-take.png",
    sections: [
      {
        h2: "What Clean Take does",
        body: [
          "After you record a take in PromptDrop, Clean Take gives you simple controls to tighten it. Instead of a full timeline editor with tracks and keyframes, you get the handful of actions that fix most talking-head videos: trim the start and end, cut awkward pauses, and adjust pacing.",
        ],
      },
      {
        h2: "Trim awkward pauses",
        body: [
          "Long silences are the most common problem in recorded takes: the pause while you find your place, the breath before a sentence, the gap where you checked your notes. Clean Take helps you cut these down so the video keeps moving without losing your natural rhythm.",
        ],
      },
      {
        h2: "Tighten pacing and adjust speed",
        body: [
          "Sections that drag can be sped up slightly, and the overall pace of the take can be tightened so a five-minute recording says the same thing in four. Small adjustments here make a recording feel deliberate rather than hesitant.",
        ],
      },
      {
        h2: "Style and captions",
        body: [
          "Export options include a captioned version of your take, so the video is watchable with sound off. Captions are generated from your recording when transcription is connected on your plan.",
        ],
      },
      {
        h2: "Original vs Clean Edit",
        body: [
          "Clean Take never destroys your source recording. You always keep the original take alongside the clean edit, so you can compare both, re-export with different settings, or go back to the unedited version at any time.",
        ],
      },
    ],
    faqs: [
      { q: "Does Clean Take delete my original recording?", a: "No. The original take is always kept. Clean Take produces a separate cleaned edit, and you can compare or re-export at any time." },
      { q: "Can it remove filler words automatically?", a: "Filler-word detection relies on transcription. When transcription is connected on your plan, Clean Take can use the transcript to help you find and cut fillers; without it, you trim pauses and sections manually with simple controls." },
      { q: "Do I need video editing experience?", a: "No. Clean Take is deliberately simpler than a timeline editor: trim, tighten pauses, adjust pace, and export. If you can record a take, you can clean it." },
      { q: "What can I export?", a: "A cleaned video of your take, and a captioned version where transcription is available on your plan." },
    ],
    relatedUseCases: ["content-creators", "online-courses", "sales"],
    relatedBlog: ["how-to-record-better-video-takes", "how-to-read-naturally-on-camera"],
  },

  "meeting-recorder": {
    slug: "meeting-recorder",
    name: "Meeting Recorder",
    title: "Browser Meeting Recorder with Transcripts | PromptDrop",
    description:
      "Record browser meetings with PromptDrop, then review the recording, read the transcript, and ask questions about what was said. Desktop web meetings only.",
    h1: "Record browser meetings and turn them into useful notes.",
    intro:
      "PromptDrop records meetings that happen in your desktop browser: capture a tab, window, or screen plus your microphone, then review the recording, read the transcript, and ask questions about what was discussed.",
    ogImage: "/og/og-meeting-recorder.png",
    sections: [
      {
        h2: "Browser meeting recording",
        body: [
          "When a meeting runs in a browser tab, PromptDrop can record it. You choose what to capture — a tab, a window, or your screen — together with your microphone. Recording starts when you start it, the indicator stays visible, and it stops when you stop it.",
          "PromptDrop is focused on desktop web and browser meeting recording. It is not designed to record mobile phone calls or WhatsApp calls.",
        ],
      },
      {
        h2: "Screen, tab, and window capture",
        body: [
          "Capture uses the browser's own screen-share picker, so you decide exactly what is recorded. Tab capture is usually the cleanest option for a meeting; window or full-screen capture works when you need more context on screen.",
        ],
      },
      {
        h2: "Microphone and audio support",
        body: [
          "Your microphone is always captured when you allow it. Whether the other participants' audio can be captured depends on your browser and what you share: for example, tab audio capture is supported in Chromium browsers when you share a tab and enable tab audio. PromptDrop tells you what the current browser supports rather than guessing.",
        ],
      },
      {
        h2: "Review, transcript, and Ask",
        body: [
          "After the meeting, the recording is yours to review. When transcription is connected on your plan, PromptDrop produces a meeting transcript, and Ask lets you ask questions answered from that transcript — things like what was decided, what the action items are, or what someone asked.",
        ],
      },
      {
        h2: "Consent and compliance",
        body: [
          "Recording a meeting can require consent depending on where participants are. PromptDrop keeps recording visible and under your control, and you are responsible for getting consent where the law requires it. Recordings stay on your device unless you choose to sync or process them.",
        ],
      },
    ],
    faqs: [
      { q: "Can PromptDrop record Zoom or Google Meet?", a: "Yes, when the meeting runs in a desktop browser tab. You share the tab (or window/screen) through the browser's picker and PromptDrop records what you share, plus your microphone. It does not join meetings as a bot." },
      { q: "Can PromptDrop record system audio?", a: "It depends on your browser and what you capture. Chromium browsers can capture tab audio when you share a tab and enable it; full system audio is not always supported. PromptDrop shows you what your current browser allows." },
      { q: "Can PromptDrop record phone calls or WhatsApp calls?", a: "No. PromptDrop records desktop browser meetings only. It is not designed to record mobile phone calls or WhatsApp calls." },
      { q: "Can PromptDrop transcribe meetings?", a: "Yes, when transcription is connected on your plan. The recording is transcribed so you can read the meeting, search it, and generate notes from it." },
      { q: "Can I ask questions after a meeting?", a: "Yes. With a transcript available, Ask answers questions from what was actually said — summaries, action items, decisions, and open questions." },
    ],
    relatedUseCases: ["sales", "founders", "teachers"],
    relatedBlog: ["browser-meeting-recording-guide"],
  },
};

export const FEATURE_LIST = Object.values(FEATURES);
