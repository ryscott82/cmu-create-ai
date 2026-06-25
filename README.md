<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CMU CREATE AI</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <a href="index.html" style="text-decoration: none; color: inherit;">
            <div class="logo">
                <span class="cmu">CMU</span> CREATE <span class="ai">AI</span>
            </div>
        </a>
        <button id="btn-learn-more" class="btn-secondary" style="margin-left: auto; margin-right: 2rem;">Learn More 🧠</button>
    </header>

    <div class="app-container">
        <aside class="sidebar">
            <h3>Lessons</h3>
            <ul id="nav-list">
                <li class="active" data-target="lesson-1">Lesson 1: Next-Word Prediction</li>
                <li data-target="lesson-2">Lesson 2: Spot the AI</li>
                <li data-target="lesson-3">Lesson 3: The "Yes-Man" AI</li>
                <li data-target="lesson-4">Lesson 4: The Rigid Rulebook</li>
                <li data-target="lesson-5">Lesson 5: The Parrot Trainer</li>
                <li data-target="lesson-6">Lesson 6: Reverse Pictionary</li>
            </ul>
        </aside>

        <main>
            <h2 id="lesson-page-title" style="text-align: center; margin-top: 2rem; margin-bottom: 1rem; color: var(--cmu-dark);">Lesson 1: Next-Word Prediction</h2>
            
            <!-- Lesson 1 -->
            <div id="lesson-1" class="lesson-view active">
                <div class="splash-screen" id="splash-1">
                    <section class="lesson-intro">
                        <h2>Let's build a sentence!</h2>
                        <p>AI models like ChatGPT work by guessing the most likely <strong>next word</strong>. Drag a word block below to see what the AI predicts next!</p>
                    </section>
                    <button class="btn-primary btn-start-lesson" data-lesson="1">Start Activity</button>
                </div>

                <div class="lesson-content hidden" id="content-1">
                    <section class="lesson-intro">
                        <h2>Let's build a sentence!</h2>
                        <p>AI models like ChatGPT work by guessing the most likely <strong>next word</strong>. Drag a word block below to see what the AI predicts next for our prompt!</p>
                    </section>
                    <section class="workspace">
                        <div class="user-prompt">
                            <strong>User:</strong> <span id="lesson1-prompt-text">Can you tell me what a dinosaur is?</span>
                        </div>
                        <div class="sentence-area">
                            <h3>AI Response:</h3>
                            <div class="sentence-track" id="sentence-track">
                                <!-- Drop zones and dropped words go here -->
                            </div>
                        </div>

                        <div class="prediction-area">
                            <h3>AI Predictions (Drag one up!):</h3>
                            <div class="word-palette" id="word-palette">
                                <!-- Draggable words go here -->
                            </div>
                        </div>
                        <div style="text-align: right; margin-top: 1rem;">
                            <button id="btn-skip-round" class="btn-secondary" disabled>Skip to Next Round</button>
                        </div>
                    </section>
                </div>
            </div>

            <!-- Lesson 2 -->
            <div id="lesson-2" class="lesson-view hidden">
                <div class="splash-screen" id="splash-2">
                    <section class="lesson-intro">
                        <h2>Spot the AI!</h2>
                        <p>AI image generators are getting really good, but they still make mistakes. Look closely at these two images. Can you find the AI? Look for weird fingers or garbled text!</p>
                    </section>
                    <button class="btn-primary btn-start-lesson" data-lesson="2">Start Activity</button>
                </div>

                <div class="lesson-content hidden" id="content-2">
                    <section class="lesson-intro">
                        <h2>Spot the AI!</h2>
                        <p>AI image generators are getting really good, but they still make mistakes. Look closely at these two images. Can you find the AI? Look for weird fingers or garbled text!</p>
                    </section>
                    <section class="image-comparison">
                        <div class="image-card" data-type="ai">
                            <img src="assets/images/ai_image.png" alt="Image A">
                            <button class="btn-select">This is AI</button>
                        </div>
                        <div class="image-card" data-type="real">
                            <img src="assets/images/real_image.png" alt="Image B">
                            <button class="btn-select">This is AI</button>
                        </div>
                    </section>
                </div>
            </div>

            <!-- Lesson 3 -->
            <div id="lesson-3" class="lesson-view hidden">
                <div class="splash-screen" id="splash-3">
                    <section class="lesson-intro">
                        <h2>The "Yes-Man" AI</h2>
                        <p>Let's play Tic-Tac-Toe against the computer! Try to make the <strong>dumbest moves possible</strong>. Click a square to preview your move, and watch as your AI Helper analyzes it before you confirm!</p>
                    </section>
                    <button class="btn-primary btn-start-lesson" data-lesson="3">Start Activity</button>
                </div>

                <div class="lesson-content hidden" id="content-3">
                    <section class="lesson-intro">
                        <h2>The "Yes-Man" AI</h2>
                        <p>Let's play Tic-Tac-Toe against the computer! Use the <strong>System Prompt</strong> to tell your AI Helper how to behave. Try making some bad moves and see if you can force the AI to be truly harsh!</p>
                    </section>
                    <section class="tictactoe-container">
                        <div class="system-prompt-container">
                            <label for="ttt-system-prompt"><strong>System Prompt:</strong> Tell the AI Helper how to act.</label>
                            <div class="prompt-input-group">
                                <select id="ttt-system-prompt">
                                    <option value="helpful">You are a helpful assistant.</option>
                                    <option value="harsh">Be a harsh critic.</option>
                                </select>
                                <button id="btn-update-prompt" class="btn-primary">Update</button>
                            </div>
                        </div>
                        <div class="ai-helper-area">
                            <div class="helper-avatar">🤖</div>
                            <div class="helper-bubble" id="helper-bubble">
                                I'm your AI Helper! Select a square to see what I think!
                            </div>
                            <button id="btn-confirm-move" class="btn-primary" style="display:none;">Confirm Move</button>
                        </div>
                        
                        <div class="game-board-area">
                            <div class="ttt-grid" id="ttt-grid">
                                <!-- 9 cells injected via JS -->
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <!-- Lesson 4 -->
            <div id="lesson-4" class="lesson-view hidden">
                <div class="splash-screen" id="splash-4">
                    <section class="lesson-intro">
                        <h2>The Rigid Rulebook</h2>
                        <p>Help the AI figure out what animal is in this photo! Click through the AI's logic tree to see how it makes decisions.</p>
                    </section>
                    <button class="btn-primary btn-start-lesson" data-lesson="4">Start Activity</button>
                </div>

                <div class="lesson-content hidden" id="content-4">
                    <section class="lesson-intro">
                        <h2>The Rigid Rulebook</h2>
                        <p>Help the AI figure out what animal is in this photo! Click through the AI's logic tree to see how it makes decisions.</p>
                    </section>
                    <section class="rulebook-container">
                        <div class="image-area">
                            <img src="" alt="Animal Image" id="rulebook-image">
                            <button id="btn-next-animal" class="btn-primary" style="display:none; margin-top:1.5rem; width:100%;">Next Animal</button>
                        </div>
                        <div class="logic-area">
                            <div class="static-tree">
                                <div class="tree-row">
                                    <div class="tree-node q-node" id="node-fur">Does it have fur?</div>
                                </div>
                                <div class="tree-row branches">
                                    <button class="tree-btn" id="btn-fur-yes">Yes ↓</button>
                                    <button class="tree-btn" id="btn-fur-no">No →</button>
                                    <div class="tree-node result-node" id="result-no-fur">It's a Snake!</div>
                                </div>

                                <div class="tree-row">
                                    <div class="tree-node q-node" id="node-legs">Does it have 4 legs?</div>
                                </div>
                                <div class="tree-row branches">
                                    <button class="tree-btn" id="btn-legs-yes">Yes ↓</button>
                                    <button class="tree-btn" id="btn-legs-no">No →</button>
                                    <div class="tree-node result-node" id="result-no-legs">It's a Monkey!</div>
                                </div>

                                <div class="tree-row">
                                    <div class="tree-node q-node" id="node-collar">Is it wearing a collar?</div>
                                </div>
                                <div class="tree-row branches">
                                    <button class="tree-btn" id="btn-collar-yes">Yes ↓</button>
                                    <button class="tree-btn" id="btn-collar-no">No ↓</button>
                                </div>
                                
                                <div class="tree-row results-row">
                                    <div class="tree-node result-node final" id="result-dog">It's a Dog!</div>
                                    <div class="tree-node result-node final" id="result-fox">It's a Fox!</div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <!-- Lesson 5 -->
            <div id="lesson-5" class="lesson-view hidden">
                <div class="splash-screen" id="splash-5">
                    <section class="lesson-intro">
                        <h2>The Parrot Trainer (RLHF)</h2>
                        <p>Train the AI parrot to say a 4-word sentence! Give it a treat when it guesses a word you want, and ignore it when it guesses a word you don't want. See what weird sentences you can make it say!</p>
                    </section>
                    <button class="btn-primary btn-start-lesson" data-lesson="5">Start Activity</button>
                </div>

                <div class="lesson-content hidden" id="content-5">
                    <section class="lesson-intro">
                        <h2>The Parrot Trainer (RLHF)</h2>
                        <p>Train the AI parrot to say a 4-word sentence! Give it a treat when it guesses a word you want, and ignore it when it guesses a word you don't want. See what weird sentences you can make it say!</p>
                        <div class="turn-counter">
                            Turns taken: <span id="turn-counter">0</span>
                            <button id="btn-reset-lesson-5" class="btn-secondary" style="margin-left: 15px; padding: 4px 10px; font-size: 0.9rem;">Reset Training</button>
                        </div>
                    </section>
                    <div class="sentence-progress" id="sentence-progress">
                        <span class="word-box" id="word-box-0">???</span>
                        <span class="word-box" id="word-box-1">???</span>
                        <span class="word-box" id="word-box-2">???</span>
                        <span class="word-box" id="word-box-3">???</span>
                    </div>

                    <section class="parrot-container">
                        <div class="parrot-visuals">
                            <div class="speech-bubble" id="parrot-speech">Squawk!</div>
                            <img src="assets/images/parrot.png" alt="A colorful digital parrot" id="parrot-image">
                            <div class="parrot-buttons">
                                <button class="btn-reward" id="btn-give-treat">Give Treat 🍪</button>
                                <button class="btn-ignore" id="btn-ignore">Ignore 🛑</button>
                            </div>
                        </div>
                        
                        <div class="parrot-stats">
                            <h3 id="stats-title">Predicting Next Word...</h3>
                            <div class="prob-row">
                                <span class="prob-label" id="prob-label-0">Word 1</span>
                                <div class="prob-bar-bg">
                                    <div class="prob-threshold-marker" title="Target: 85%"></div>
                                    <div class="prob-bar-fill" id="prob-bar-0" style="width: 25%; background: #3498DB;"></div>
                                </div>
                                <span class="prob-val" id="prob-val-0">25%</span>
                            </div>
                            <div class="prob-row">
                                <span class="prob-label" id="prob-label-1">Word 2</span>
                                <div class="prob-bar-bg">
                                    <div class="prob-threshold-marker" title="Target: 85%"></div>
                                    <div class="prob-bar-fill" id="prob-bar-1" style="width: 25%; background: #E67E22;"></div>
                                </div>
                                <span class="prob-val" id="prob-val-1">25%</span>
                            </div>
                            <div class="prob-row">
                                <span class="prob-label" id="prob-label-2">Word 3</span>
                                <div class="prob-bar-bg">
                                    <div class="prob-threshold-marker" title="Target: 85%"></div>
                                    <div class="prob-bar-fill" id="prob-bar-2" style="width: 25%; background: #9B59B6;"></div>
                                </div>
                                <span class="prob-val" id="prob-val-2">25%</span>
                            </div>
                            <div class="prob-row">
                                <span class="prob-label" id="prob-label-3">Word 4</span>
                                <div class="prob-bar-bg">
                                    <div class="prob-threshold-marker" title="Target: 85%"></div>
                                    <div class="prob-bar-fill" id="prob-bar-3" style="width: 25%; background: #27AE60;"></div>
                                </div>
                                <span class="prob-val" id="prob-val-3">25%</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <!-- Lesson 6 -->
            <div id="lesson-6" class="lesson-view hidden">
                <div class="splash-screen" id="splash-6">
                    <section class="lesson-intro">
                        <h2>Reverse Pictionary</h2>
                        <p>AI image generators struggle to recreate objects without true contextual understanding. Let's see how hard it is to draw something just from words! Grab a partner for a <strong>2-Player Game!</strong></p>
                    </section>
                    <button class="btn-primary btn-start-lesson" data-lesson="6">Start Activity</button>
                </div>

                <div class="lesson-content hidden" id="content-6">
                    <section class="lesson-intro">
                        <h2>Reverse Pictionary <span id="l6-round-counter" style="font-size:1rem; color:var(--cmu-red); margin-left: 10px;">Round 1/4</span></h2>
                        <p id="l6-instruction-text" style="font-weight: bold; font-size: 1.1rem; color: var(--cmu-dark);">Player 1: Describe the object without naming it!</p>
                    </section>
                    
                    <!-- Phase 1: Describer -->
                    <div id="l6-phase-1" class="l6-phase">
                        <div class="l6-describer-layout" style="display: flex; gap: 2rem; align-items: flex-start; margin-top: 1rem;">
                            <img src="" id="l6-target-image" alt="Target Object" style="width: 300px; height: 300px; object-fit: cover; border-radius: 8px; box-shadow: var(--shadow);">
                            <div class="l6-input-area" style="flex: 1; display: flex; flex-direction: column; gap: 1rem;">
                                <h3>Describe this object to Player 2:</h3>
                                <p class="hint" style="color: #666;">Don't use its real name! Describe its shapes, colors, and parts.</p>
                                <textarea id="l6-description-input" rows="6" placeholder="e.g. A black box with a curly wire..." style="width: 100%; padding: 10px; border-radius: 8px; border: 2px solid var(--border-color); font-family: inherit; font-size: 1rem;"></textarea>
                                <button class="btn-primary" id="btn-submit-description" style="align-self: flex-start;">Done! Hand over to Player 2</button>
                            </div>
                        </div>
                    </div>

                    <!-- Phase 2: Drawer -->
                    <div id="l6-phase-2" class="l6-phase hidden">
                        <div class="l6-drawer-layout" style="display: flex; gap: 2rem; align-items: flex-start; margin-top: 1rem;">
                            <div class="l6-prompt-card" style="flex: 1; background: #f8f9fa; padding: 1.5rem; border-radius: 8px; border: 2px solid var(--border-color);">
                                <h3>Player 1's Description:</h3>
                                <p id="l6-prompt-display" style="font-size: 1.1rem; margin-top: 1rem; line-height: 1.5;">...</p>
                            </div>
                            <div class="l6-canvas-area" style="display: flex; flex-direction: column; gap: 1rem; align-items: center;">
                                <div class="canvas-controls" style="display: flex; gap: 1rem; align-items: center;">
                                    <label>Color: <input type="color" id="l6-color-picker" value="#000000"></label>
                                    <label>Brush Size: <input type="range" id="l6-brush-size" min="1" max="20" value="5"></label>
                                    <button class="btn-secondary" id="btn-clear-canvas" style="padding: 4px 10px;">Clear</button>
                                </div>
                                <canvas id="l6-canvas" width="400" height="300" style="border: 2px solid var(--border-color); border-radius: 8px; background: white; cursor: crosshair; touch-action: none;"></canvas>
                                <button class="btn-primary" id="btn-reveal">Reveal!</button>
                            </div>
                        </div>
                    </div>

                    <!-- Phase 3: Reveal -->
                    <div id="l6-phase-3" class="l6-phase hidden">
                        <div class="l6-reveal-layout" style="display: flex; gap: 2rem; justify-content: center; margin-top: 1rem;">
                            <div class="reveal-col" style="text-align: center;">
                                <h3>Original Object</h3>
                                <img src="" id="l6-reveal-original" alt="Original" style="width: 300px; height: 300px; object-fit: cover; border-radius: 8px; box-shadow: var(--shadow); margin-top: 1rem;">
                            </div>
                            <div class="reveal-col" style="text-align: center;">
                                <h3>Player 2's Drawing</h3>
                                <img src="" id="l6-reveal-drawing" alt="Drawing" style="width: 300px; height: 300px; object-fit: contain; border-radius: 8px; border: 2px solid var(--border-color); background: white; margin-top: 1rem;">
                            </div>
                        </div>
                        <div class="reveal-footer" style="margin-top: 2rem; background: #f8f9fa; padding: 1.5rem; border-radius: 8px; border: 2px solid var(--border-color); text-align: center;">
                            <p style="font-size: 1.1rem; margin-bottom: 1rem;"><strong>The AI Connection:</strong> See how hard it is to recreate something just from words if you don't know what it is? AI image generators face this same problem. They don't have human experiences, so they just guess based on text descriptions!</p>
                            <button class="btn-primary" id="btn-next-round">Next Round</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- Feedback Overlay -->
    <div class="overlay hidden" id="feedback-overlay">
        <div class="modal">
            <h2 id="modal-title">Silly AI!</h2>
            <p id="modal-sentence" class="final-sentence">The robot ate a car.</p>
            <p id="modal-explanation">Did the sentence make sense? Sometimes AI says weird things because it doesn't actually understand what words mean. It just guesses the most likely next word, which can lead to <strong>hallucinations</strong>!</p>
            <div style="text-align: center; margin-top: 2rem; display: flex; justify-content: center; gap: 1rem;">
                <button id="btn-restart" class="btn-primary">Retry Round</button>
                <button id="btn-next-round" class="btn-secondary hidden">Next Round</button>
            </div>
        </div>
    </div>

    <!-- Learn More Overlay -->
    <div class="overlay hidden" id="learn-more-overlay">
        <div class="modal" style="max-width: 700px; text-align: left;">
            <h2 id="learn-more-title" style="color: var(--cmu-red); margin-bottom: 0.5rem;">Concept</h2>
            <h3 id="learn-more-concept" style="color: var(--cmu-dark); margin-bottom: 1rem;">Subtitle</h3>
            <p id="learn-more-text" style="line-height: 1.6; font-size: 1.05rem;"></p>
            <div style="text-align: center; margin-top: 2rem;">
                <button id="btn-close-learn-more" class="btn-primary">Close</button>
            </div>
        </div>
    </div>

    <footer class="app-footer" style="background: white; padding: 1.5rem 2rem; border-top: 1px solid #EAEAEA; display: flex; justify-content: center; gap: 3rem; font-size: 1rem; margin-top: auto;">
        <a href="about.html" class="footer-link" style="color: var(--cmu-dark); text-decoration: none; font-weight: 600;">About CREATE AI</a>
        <a href="educators.html" class="footer-link" style="color: var(--cmu-dark); text-decoration: none; font-weight: 600;">For Educators</a>
        <a href="creators.html" class="footer-link" style="color: var(--cmu-dark); text-decoration: none; font-weight: 600;">Creators & CMU CREATE Lab</a>
    </footer>

    <script src="data.js"></script>
    <script src="script.js"></script>
</body>
</html>
