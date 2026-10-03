# Reflection

## What was hardest, and why?

Two things stood out as the hardest parts of this capstone.

The first was getting Vitest set up at all. Installing the testing packages triggered a peer-dependency conflict (Vitest 5 wanting a newer `@types/node` than the project had), and working around it with `--legacy-peer-deps` led to a chain of missing-package errors one after another — `vite` itself, then `@testing-library/dom`, each only surfacing once the previous one was fixed. It was genuinely frustrating because each error looked like a new, unrelated problem, when really it was the same root cause (an incomplete dependency resolution) manifesting piece by piece. It took patience to keep installing whatever the next error named rather than assuming something was fundamentally broken.

The second was the ongoing tension between adding more features and finishing what the assignment actually required. Once the core app worked, it was easy to keep finding "one more thing" worth adding — the Weak-Spot Tracker, ambient background effects, a custom logo, deeper chat context-awareness. Each addition was reasonable on its own, but collectively they meant repeatedly circling back to already-"finished" pages, and delayed getting to the capstone's actual graded requirements (tests, accessibility audit, documentation) until fairly late in the process.

## What would I do differently next time?

I'd scope the AI features and finish them fully before spending time on visual polish. In this project, the polish work (the glassmorphism theme, ambient orbs, particle effects, flip animations) happened in parallel with — and sometimes before — some of the core AI functionality was fully solid. Locking down the required features first, then treating polish as a clearly separate, later phase, would have kept the project more focused and made it easier to know when "done" actually meant done.

I'd also write tests alongside each feature as I built it, rather than treating testing as a separate phase at the end. By the time I got to testing, I had to go back and re-learn the exact behavior of components I'd built earlier (like exactly how the Flashcards flip mechanism worked) in order to test them correctly — which would have been fresher and faster if the tests were written right after each feature was built.

## Something that surprised me

Two moments with Flashcards genuinely surprised me. First, I noticed that when I clicked "Next," the next card briefly showed its answer instead of its question — I assumed clicking Next would always reset to the question side first, but it didn't, until we specifically fixed the timing of the flip. Second, the card started visibly glitching whenever I hovered over it while flipped — it turned out the hover animation and the flip animation were both trying to control the same property at once, and they were fighting each other. Both cases taught me that animations that look simple on the surface can have hidden conflicts underneath.

Around the same time, I also didn't immediately understand why a Quiz generation attempt failed with a caught error message on screen instead of the page just breaking. It took a moment to realize this was intentional — the try/catch block we'd added around the AI's response was catching a case where Groq's model returned malformed JSON instead of the strict format we asked for, and handling it gracefully instead of crashing. Seeing that safety net actually catch a real, unplanned failure made the earlier decision to add error handling feel a lot more concrete than it had while writing it.