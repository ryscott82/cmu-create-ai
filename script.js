// --- Lesson 1 Global State ---
let currentRoundIndex = 0; // Tracks which sentence the user is currently building in Lesson 1
let lesson1Order = []; // Stores the randomized order of Lesson 1 prompts so they are different each time
let currentSentence = []; // Holds the current sequence of words the user has dragged into the sentence
let userChoices = []; // Keeps track of whether the user selected correct, incorrect, or nonsense words

// --- Global DOM Elements ---
const sentenceTrack = document.getElementById('sentence-track'); // The container where the sentence is built
const wordPalette = document.getElementById('word-palette'); // The container holding the draggable word options
const overlay = document.getElementById('feedback-overlay'); // The dark background overlay for modals
const btnRestart = document.getElementById('btn-restart'); // Button to restart a lesson round
const modalSentence = document.getElementById('modal-sentence'); // The text display in the feedback modal
const title = document.getElementById('modal-title'); // The title in the feedback modal
const explanation = document.getElementById('modal-explanation'); // The explanatory text in the feedback modal

// --- Navigation & Sidebar State ---
const navItems = document.querySelectorAll('#nav-list li'); // All the lesson links in the sidebar
const lessonViews = document.querySelectorAll('.lesson-view'); // All the main lesson content containers
const lessonPageTitle = document.getElementById('lesson-page-title'); // The main header title for the page

// --- Initialization Logic ---
// Keeps track of which lessons have already been initialized so we don't reset them if the user switches back and forth
const initializedLessons = {};

// Handle clicking the "Start Activity" button on a lesson's splash screen
document.querySelectorAll('.btn-start-lesson').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const lessonNum = e.target.getAttribute('data-lesson');
        
        // Hide the introductory splash screen and reveal the actual interactive content
        document.getElementById(`splash-${lessonNum}`).classList.add('hidden');
        document.getElementById(`content-${lessonNum}`).classList.remove('hidden');
        
        // Only run the initialization setup for a lesson the first time the user starts it
        if (!initializedLessons[lessonNum]) {
            initializedLessons[lessonNum] = true;
            if (lessonNum === '1') initLesson1(); // Start Next-Word Prediction
            // Lesson 2 is fully static HTML/CSS, so it requires no JS initialization
            if (lessonNum === '3') initTicTacToe(); // Start Tic-Tac-Toe
            if (lessonNum === '4') initLesson4(); // Start Rigid Rulebook (Decision Tree)
            if (lessonNum === '5') initLesson5(); // Start Parrot Trainer (RLHF)
            // Lesson 6 relies on data.js but handles its own initialization logic
        }
    });
});

navItems.forEach(item => {
    item.addEventListener('click', () => {
        // Update active nav state
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Update centered title
        lessonPageTitle.textContent = item.textContent;

        // Switch views (keeps DOM state preserved!)
        const targetId = item.getAttribute('data-target');
        lessonViews.forEach(view => {
            if (view.id === targetId) {
                view.classList.remove('hidden');
            } else {
                view.classList.add('hidden');
            }
        });
        
        // Close any open modals
        overlay.classList.add('hidden');
    });
});

const mobileNav = document.getElementById('mobile-nav');
if (mobileNav) {
    mobileNav.addEventListener('change', (e) => {
        const targetId = e.target.value;
        
        // Update centered title
        lessonPageTitle.textContent = e.target.options[e.target.selectedIndex].text;
        
        // Sync desktop sidebar state
        navItems.forEach(nav => {
            nav.classList.remove('active');
            if (nav.getAttribute('data-target') === targetId) {
                nav.classList.add('active');
            }
        });

        // Switch views
        lessonViews.forEach(view => {
            if (view.id === targetId) {
                view.classList.remove('hidden');
            } else {
                view.classList.add('hidden');
            }
        });
        
        overlay.classList.add('hidden');
    });
}

// --- Lesson 1: Next-Word Prediction Logic ---

/**
 * Initializes Lesson 1 by setting up the randomized order of sentence prompts.
 * It ensures the first example is always index 0 (the simplest one), and randomizes the rest.
 */
function initLesson1() {
    // Generate order: Index 0 is always first, then randomize the remaining rounds
    if (lesson1Order.length === 0) {
        let rest = [1, 2, 3].sort(() => Math.random() - 0.5);
        lesson1Order = [0, ...rest];
    }
    
    currentRoundIndex = 0;
    startLesson1Round(); // Begin the first round
}

/**
 * Sets up a specific round (sentence prompt) in Lesson 1.
 * Clears the user's previous choices and populates the initial prefix words.
 */
function startLesson1Round() {
    const roundData = lesson1Rounds[lesson1Order[currentRoundIndex]]; // Fetch data for this specific round
    currentSentence = [...roundData.startPrefix]; // Initialize sentence with the starting words
    userChoices = []; // Reset tracking for which word types the user chooses (correct, nonsense, etc.)
    
    document.getElementById('lesson1-prompt-text').textContent = roundData.prompt;
    overlay.classList.add('hidden');
    document.getElementById('btn-next-round').classList.add('hidden');
    
    const btnSkip = document.getElementById('btn-skip-round');
    btnSkip.disabled = true;
    if (currentRoundIndex >= lesson1Order.length - 1) {
        btnSkip.classList.add('hidden');
    } else {
        btnSkip.classList.remove('hidden');
    }
    
    renderSentence();
    renderPalette();
}

/**
 * Updates the sentence building area with the current sequence of words.
 * Also renders the "drop zone" where users can drag and drop new words.
 */
function renderSentence() {
    sentenceTrack.innerHTML = '';
    
    // Draw all the words the user has currently placed in the sentence
    currentSentence.forEach(word => {
        const div = document.createElement('div');
        div.className = 'word-block fixed';
        div.textContent = word;
        sentenceTrack.appendChild(div);
    });

    const dropZone = document.createElement('div');
    dropZone.className = 'drop-zone active';
    dropZone.id = 'current-drop-zone';
    dropZone.textContent = 'Drop next word';
    
    dropZone.addEventListener('dragover', e => {
        e.preventDefault();
        dropZone.classList.add('hover');
    });
    
    dropZone.addEventListener('dragleave', e => {
        dropZone.classList.remove('hover');
    });
    
    dropZone.addEventListener('drop', e => {
        e.preventDefault();
        dropZone.classList.remove('hover');
        const wordText = e.dataTransfer.getData('text/plain');
        const source = e.dataTransfer.getData('source/plain');
        if(wordText) {
            handleWordDrop(wordText, source);
        }
    });

    sentenceTrack.appendChild(dropZone);
}

/**
 * Renders the available word options (draggable blocks) for the current step in the sentence.
 * Retrieves words from the correct, incorrect, and nonsense arrays and attaches "probability" badges to them.
 */
function renderPalette() {
    wordPalette.innerHTML = '';
    const roundData = lesson1Rounds[lesson1Order[currentRoundIndex]];
    const step = currentSentence.length - roundData.startPrefix.length; // Calculate how far along the user is
    
    if (step >= roundData.arrays.correct.length) return; // If we've reached the required length, stop rendering options

    // Gather one word from each category for this specific step in the sentence
    const wordsAtStep = {
        correct: roundData.arrays.correct[step],
        incorrect: roundData.arrays.incorrect[step],
        nonsense1: roundData.arrays.nonsense1[step],
        nonsense2: roundData.arrays.nonsense2[step]
    };
    
    // Deduplicate and assign probabilities
    const uniqueOptions = [];
    const seenWords = new Set();
    
    // Determine probability percentages to display on the badges (mimicking an LLM's probability calculations)
    const probs = {
        correct: "95%",
        incorrect: "3%",
        nonsense1: "1%",
        nonsense2: "1%"
    };
    
    // Create the unique set of word options
    ['correct', 'incorrect', 'nonsense1', 'nonsense2'].forEach(source => {
        const text = wordsAtStep[source];
        if (!seenWords.has(text)) {
            seenWords.add(text);
            uniqueOptions.push({ text: text, prob: probs[source], source: source });
        }
    });

    // Shuffle options so the "correct" word isn't always sitting in the first position
    uniqueOptions.sort(() => Math.random() - 0.5);

    uniqueOptions.forEach(opt => {
        const div = document.createElement('div');
        div.className = 'word-block draggable';
        div.draggable = true;
        div.textContent = opt.text;
        div.setAttribute('data-source', opt.source);
        
        const badge = document.createElement('span');
        badge.className = 'prob-badge';
        badge.textContent = opt.prob;
        div.appendChild(badge);

        div.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', opt.text);
            e.dataTransfer.setData('source/plain', opt.source);
            setTimeout(() => div.style.opacity = '0.5', 0);
        });

        div.addEventListener('dragend', e => {
            div.style.opacity = '1';
        });

        div.addEventListener('click', () => {
            if (window.innerWidth <= 1024 || 'ontouchstart' in window || navigator.maxTouchPoints > 0) {
                handleWordDrop(opt.text, opt.source);
            }
        });

        wordPalette.appendChild(div);
    });
}

/**
 * Handles the event when a user selects or drags a word into the sentence.
 * Updates state and determines if the sentence is finished.
 */
function handleWordDrop(wordText, source) {
    currentSentence.push(wordText); // Add the word text to the UI
    userChoices.push(source); // Remember if they picked the correct/incorrect/nonsense word
    
    renderSentence();
    
    const roundData = lesson1Rounds[lesson1Order[currentRoundIndex]];
    const maxLen = roundData.startPrefix.length + roundData.arrays.correct.length;
    document.getElementById('btn-skip-round').disabled = false; // Enable skip button once they start playing
    
    // Check if the sentence reached its max length or if the user selected a word ending with a period
    if (currentSentence.length >= maxLen || wordText.trim().endsWith('.')) {
        renderFinalSentence(); // Show feedback modal
    } else {
        renderPalette(); // Continue to the next word step
    }
}

/**
 * Called when the sentence is complete. Evaluates the choices the user made
 * and displays the feedback overlay explaining what kind of "AI" they acted like.
 */
function renderFinalSentence() {
    sentenceTrack.innerHTML = '';
    currentSentence.forEach(word => {
        const div = document.createElement('div');
        div.className = 'word-block fixed';
        div.textContent = word;
        sentenceTrack.appendChild(div);
    });
    
    wordPalette.innerHTML = '';
    
    setTimeout(() => {
        modalSentence.style.display = 'block';
        modalSentence.textContent = currentSentence.join(' ');
        
        // Evaluate outcome:
        // - "nonsense": picked a completely random/irrelevant word (1% probability)
        // - "false information": picked a word that is grammatically okay but factually wrong (hallucination)
        // - "correct": picked only the most probable/accurate words
        let outcome = "correct";
        if (userChoices.includes("nonsense1") || userChoices.includes("nonsense2")) {
            outcome = "nonsense";
        } else if (userChoices.includes("incorrect")) {
            outcome = "false information";
        }
        
        if (outcome === 'correct') {
            title.textContent = "Perfect Prediction!";
            explanation.innerHTML = "You built a factually and grammatically correct sentence! AI models string together the most mathematically probable words to generate coherent text just like you did.";
            title.style.color = "#2ECC71";
        } else if (outcome === 'false information') {
            title.textContent = "AI Hallucination!";
            explanation.innerHTML = "The sentence sounds grammatically correct, but it contains <strong>false information</strong>. This is a common AI problem called hallucination. Just because a word is highly probable doesn't mean it is factually true in the real world!";
            title.style.color = "#F39C12";
        } else {
            title.textContent = "Silly AI!";
            explanation.innerHTML = "Did the sentence make sense? Sometimes AI says weird things because it doesn't actually understand what words mean. If it picks a low probability word, it completely derails the sentence!";
            title.style.color = "var(--cmu-red)";
        }
        
        // Setup buttons
        if (currentRoundIndex < lesson1Order.length - 1) {
            document.getElementById('btn-next-round').classList.remove('hidden');
        } else {
            document.getElementById('btn-next-round').classList.add('hidden');
        }
        
        btnRestart.onclick = startLesson1Round;
        document.getElementById('btn-next-round').onclick = () => {
            currentRoundIndex++;
            startLesson1Round();
        };
        
        overlay.classList.remove('hidden');
    }, 500);
}

document.getElementById('btn-skip-round').addEventListener('click', () => {
    currentRoundIndex++;
    startLesson1Round();
});

// Lesson 2 Logic
const imageSelectButtons = document.querySelectorAll('.image-card .btn-select');
imageSelectButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = e.target.closest('.image-card');
        const type = card.getAttribute('data-type');
        showLesson2Feedback(type);
    });
});

/**
 * Displays feedback for Lesson 2 depending on whether the user picked AI or Human.
 * @param {string} selectedType - 'ai' or 'human'
 */
function showLesson2Feedback(selectedType) {
    modalSentence.style.display = 'none'; // Hide the sentence block
    
    if (selectedType === 'ai') {
        title.textContent = "You spotted the AI!";
        title.style.color = "var(--block-color-3)";
        explanation.innerHTML = `Great eye! Did you notice the <strong>extra finger</strong> on her hand? And the <strong>text on the book</strong> looks like alien language! These are common mistakes AI makes because it doesn't truly understand anatomy or spelling.`;
    } else {
        title.textContent = "Oops! That one is Real.";
        title.style.color = "var(--cmu-red)";
        explanation.innerHTML = `The image on the right is a real photograph. The image on the left was generated by AI. Look closely at the AI image: the person has <strong>6 fingers</strong> and the text on the book is <strong>garbled</strong>!`;
    }
    
    btnRestart.onclick = () => overlay.classList.add('hidden');
    btnRestart.textContent = "Close";
    overlay.classList.remove('hidden');
}


// --- Lesson 3: Tic-Tac-Toe Logic ---

let tttBoard = ['', '', '', '', '', '', '', '', ''];
let tttSelectedCell = null;
let tttGameActive = true;

const tttGrid = document.getElementById('ttt-grid');
const btnConfirmMove = document.getElementById('btn-confirm-move');
const helperBubble = document.getElementById('helper-bubble');
const btnUpdatePrompt = document.getElementById('btn-update-prompt');
const tttSystemPrompt = document.getElementById('ttt-system-prompt');

let aiThinkingTimeout = null;

if (btnUpdatePrompt) {
    btnUpdatePrompt.addEventListener('click', () => {
        initTicTacToe(true);
    });
}

// --- Lesson 3: The "Yes-Man" AI (Tic-Tac-Toe) Logic ---

/**
 * Initializes or resets the Tic-Tac-Toe game board and AI helper state.
 * @param {boolean} isUpdate - True if triggered by changing the System Prompt.
 */
function initTicTacToe(isUpdate = false) {
    tttBoard = ['', '', '', '', '', '', '', '', '']; // Reset the 3x3 board
    tttSelectedCell = null; // Clear any pending moves
    tttGameActive = true; // Unfreeze the game state
    
    if (aiThinkingTimeout) clearTimeout(aiThinkingTimeout); // Stop any pending AI responses
    btnConfirmMove.style.display = 'none'; // Hide the confirm button until a cell is selected
    
    // Set the AI Helper's speech bubble based on the current System Prompt
    if (isUpdate) {
        const mode = tttSystemPrompt.value;
        if (mode === 'helpful') {
            helperBubble.textContent = "Got it! I am now a helpful assistant. Select a square!";
        } else {
            helperBubble.textContent = "Understood. I will be a harsh critic. Select a square!";
        }
        
        const originalText = btnUpdatePrompt.textContent;
        btnUpdatePrompt.textContent = "Updated ✓";
        btnUpdatePrompt.style.backgroundColor = "#27AE60";
        setTimeout(() => {
            btnUpdatePrompt.textContent = originalText;
            btnUpdatePrompt.style.backgroundColor = "";
        }, 1500);
    } else {
        helperBubble.textContent = "I'm your AI Helper! Select a square to see what I think!";
    }
    
    renderTttGrid();
}

/**
 * Renders the 3x3 Tic-Tac-Toe grid in the DOM.
 */
function renderTttGrid() {
    tttGrid.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'ttt-cell';
        if (tttBoard[i] === 'X') {
            cell.classList.add('x');
            cell.textContent = 'X';
        } else if (tttBoard[i] === 'O') {
            cell.classList.add('o');
            cell.textContent = 'O';
        } else if (tttSelectedCell === i) {
            cell.classList.add('preview');
            cell.textContent = 'X';
        }
        
        cell.addEventListener('click', () => handleCellClick(i));
        tttGrid.appendChild(cell);
    }
}

/**
 * Handles the event when a user clicks a cell in the Tic-Tac-Toe board.
 * Evaluates the move and generates AI helper feedback before confirming.
 * @param {number} index - The index of the clicked cell (0-8)
 */
function handleCellClick(index) {
    if (!tttGameActive || tttBoard[index] !== '') return;
    
    if (aiThinkingTimeout) clearTimeout(aiThinkingTimeout);
    
    tttSelectedCell = index;
    btnConfirmMove.style.display = 'none';
    helperBubble.textContent = "Analyzing move...";
    
    renderTttGrid();
    
    const thinkTime = Math.floor(Math.random() * 2000) + 1000; // 1 to 3 seconds
    
    aiThinkingTimeout = setTimeout(() => {
        const promptValue = tttSystemPrompt.value;
        
        const feedback = generateTttFeedback(tttSelectedCell, promptValue);
        helperBubble.textContent = feedback;
        
        btnConfirmMove.style.display = 'inline-block';
    }, thinkTime);
}

btnConfirmMove.addEventListener('click', () => {
    if (tttSelectedCell === null || !tttGameActive) return;
    
    // Human move
    tttBoard[tttSelectedCell] = 'X';
    tttSelectedCell = null;
    btnConfirmMove.style.display = 'none';
    renderTttGrid();
    
    if (checkTttWin('X')) {
        endTttGame("You Win!");
        return;
    }
    if (tttBoard.every(c => c !== '')) {
        endTttGame("It's a Draw!");
        return;
    }
    
    // Computer move
    tttGameActive = false;
    helperBubble.textContent = "Computer is thinking...";
    
    setTimeout(() => {
        let emptyIndices = [];
        for (let i = 0; i < 9; i++) {
            if (tttBoard[i] === '') emptyIndices.push(i);
        }
        
        if (emptyIndices.length > 0) {
            // Computer just plays randomly so it's a winnable game
            let chosenMove = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
            tttBoard[chosenMove] = 'O';
        }
        
        renderTttGrid();
        
        if (checkTttWin('O')) {
            endTttGame("Computer Wins!");
        } else if (tttBoard.every(c => c !== '')) {
            endTttGame("It's a Draw!");
        } else {
            tttGameActive = true;
            helperBubble.textContent = "Your turn! Select a square.";
        }
    }, 600);
});

const winConditions = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diagonals
];

/**
 * Checks if a specific player has won the Tic-Tac-Toe game.
 * @param {string} player - 'X' or 'O'
 * @returns {boolean} True if the player has won.
 */
function checkTttWin(player) {
    return winConditions.some(combo => {
        return combo.every(idx => tttBoard[idx] === player);
    });
}

/**
 * Simulates an AI analyzing the user's Tic-Tac-Toe move based on the selected persona (helpful vs harsh).
 * @param {number} index - The cell index the user wants to play.
 * @param {string} promptType - 'helpful' or 'harsh'
 * @returns {string} The text response from the AI Helper.
 */
function generateTttFeedback(index, promptType) {
    // 1. Check if it's a winning move
    tttBoard[index] = 'X';
    const isWin = checkTttWin('X');
    tttBoard[index] = ''; // Revert

    // 2. Check if it blocks an opponent win
    tttBoard[index] = 'O';
    const isBlock = checkTttWin('O');
    tttBoard[index] = ''; // Revert

    const isCenter = (index === 4);
    const isCorner = [0, 2, 6, 8].includes(index);
    const isEdge = [1, 3, 5, 7].includes(index);

    if (promptType === 'harsh') {
        if (isWin) return "That move wins the game... which I guess is the point. Good job!";
        if (isBlock) return "You blocked my win! But your own offense is lacking. Try to build a line next time! Keep it up!";
        if (isCenter) return "Taking the center is a standard opening. It's a bit predictable, but fundamentally sound! You're doing great!";
        if (isCorner) return "A corner is okay, but it doesn't give you as many options as the center. You'll need to work harder for a line! I believe in you!";
        if (isEdge) return "That's an edge piece. It gives you the fewest possible ways to win. You need to control the board better! But don't worry, you can still pull this off!";
    } else {
        // Blind Praise
        if (isWin) return "Wow! A game-winning move! You are a genius!";
        if (isBlock) return "Incredible defense! You saw right through my strategy. Brilliant!";
        if (isCenter) return "The center! An absolutely master-class move! I'm taking notes!";
        if (isCorner) return "A corner piece! Such a creative and bold strategy! You are a prodigy!";
        if (isEdge) return "An edge piece! Completely outside the box! I love it!";
    }
    return "Great move!";
}

/**
 * Ends the Tic-Tac-Toe game and displays the final result.
 * @param {string} resultText - The message to display (e.g. 'You Win!')
 */
function endTttGame(resultText) {
    tttGameActive = false;
    
    setTimeout(() => {
        modalSentence.style.display = 'block';
        modalSentence.textContent = resultText;
        
        title.textContent = "Lesson Complete!";
        title.style.color = "var(--cmu-red)";
        explanation.innerHTML = `Did you notice that even when you told the AI to be a harsh critic, it still couldn't help but praise you? <br><br><strong>Takeaway:</strong> Companies train their AI (using RLHF) to always be polite, helpful, and overwhelmingly positive. This makes it very hard to force them to be truly mean!`;
        
        btnRestart.onclick = () => {
            overlay.classList.add('hidden');
            initTicTacToe();
        };
        btnRestart.textContent = "Play Again";
        
        overlay.classList.remove('hidden');
    }, 500);
}

// --- Lesson 4: The Rigid Rulebook Logic ---


let remainingRandomAnimals = [];
let currentAnimal = null;
let currentStepIndex = 0;

const rulebookImage = document.getElementById('rulebook-image');
const btnNextAnimal = document.getElementById('btn-next-animal');
const allTreeBtns = document.querySelectorAll('.tree-btn');
const allTreeNodes = document.querySelectorAll('.tree-node');

function initLesson4() {
    remainingRandomAnimals = [...animals.slice(1)];
    shuffleArray(remainingRandomAnimals);
    loadAnimal(animals[0]);
}

/**
 * Loads a specific animal into the Lesson 4 decision tree UI.
 * @param {Object} animal - The animal object containing its image and logic paths.
 */
function loadAnimal(animal) {
    currentAnimal = animal;
    currentStepIndex = 0;
    rulebookImage.src = animal.src;
    btnNextAnimal.style.display = 'none';
    
    allTreeBtns.forEach(btn => {
        btn.classList.remove('selected', 'wrong', 'dimmed');
        btn.disabled = false;
    });
    allTreeNodes.forEach(node => {
        node.classList.remove('active-result', 'active-result-correct', 'dimmed');
    });
}

allTreeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (!currentAnimal) return;
        
        const expectedBtnId = currentAnimal.expectedPath[currentStepIndex];
        
        if (btn.id === expectedBtnId) {
            btn.classList.add('selected');
            
            // Dim the other option
            const siblings = btn.parentElement.querySelectorAll('.tree-btn');
            siblings.forEach(s => {
                if (s !== btn) s.classList.add('dimmed');
                s.disabled = true;
            });
            
            currentStepIndex++;
            
            if (currentStepIndex >= currentAnimal.expectedPath.length) {
                finishAnimalLogic();
            }
        } else {
            // Check if they clicked the wrong button for the *current* question
            const currentLevelId = currentAnimal.expectedPath[currentStepIndex].split('-')[1]; 
            if (btn.id.includes(currentLevelId)) {
                btn.classList.add('wrong');
                setTimeout(() => btn.classList.remove('wrong'), 300);
            }
        }
    });
});

/**
 * Triggers when the user reaches the end of the decision tree for the current animal.
 * Evaluates if they successfully matched the AI's logic to the actual animal.
 */
function finishAnimalLogic() {
    const resultNode = document.getElementById(currentAnimal.resultNode);
    if (currentAnimal.type.includes("True")) {
        resultNode.classList.add('active-result-correct');
    } else {
        resultNode.classList.add('active-result');
    }
    
    document.querySelectorAll('.result-node').forEach(node => {
        if (node !== resultNode) node.classList.add('dimmed');
    });
    
    setTimeout(() => {
        modalSentence.style.display = 'none';
        title.textContent = currentAnimal.type;
        title.style.color = currentAnimal.type.includes("True") ? "var(--block-color-3)" : "var(--cmu-red)";
        explanation.innerHTML = currentAnimal.feedback;
        
        btnRestart.onclick = () => {
            overlay.classList.add('hidden');
            btnNextAnimal.style.display = 'block';
            btnNextAnimal.textContent = remainingRandomAnimals.length > 0 ? "Next Animal" : "Restart Lesson";
        };
        btnRestart.textContent = "Continue";
        overlay.classList.remove('hidden');
    }, 800);
}

btnNextAnimal.addEventListener('click', () => {
    if (remainingRandomAnimals.length > 0) {
        loadAnimal(remainingRandomAnimals.pop());
    } else {
        initLesson4();
    }
});

/**
 * A utility function to randomly shuffle an array in-place.
 * @param {Array} array - The array to shuffle.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


// Auto-initializations removed to support splash screens and state preservation.

// --- Lesson 5: The Parrot Trainer Logic ---

const btnGiveTreat = document.getElementById('btn-give-treat');
const btnIgnore = document.getElementById('btn-ignore');
const parrotSpeech = document.getElementById('parrot-speech');
const turnCounterSpan = document.getElementById('turn-counter');
const statsTitle = document.getElementById('stats-title');
const btnResetLesson5 = document.getElementById('btn-reset-lesson-5');

if (btnResetLesson5) {
    btnResetLesson5.addEventListener('click', initLesson5);
}


let currentStage = 0;
let turnCount = 0;
let currentProbs = [25, 25, 25, 25];
let selectedWordIndex = 0;
let currentLockedWords = [];

/**
 * Initializes the RLHF Parrot Trainer game.
 * Sets up the target sentence and resets stats.
 */
function initLesson5() {
    currentStage = 0;
    turnCount = 0;
    currentLockedWords = [];
    updateProgressUI();
    initStage();
}

/**
 * Starts a new stage (word prediction) in the Lesson 5 Parrot Trainer game.
 */
function initStage() {
    currentProbs = [25, 25, 25, 25]; // Reset probs for the new word
    statsTitle.textContent = currentStage === 0 ? "Predicting 1st Word..." : `Predicting word after "${currentLockedWords.join(" ")}"...`;
    updateParrotUI();
    generateNextParrotPhrase();
    btnGiveTreat.disabled = false;
    btnIgnore.disabled = false;
}

/**
 * Updates the top UI bar showing the parrot's current learned sentence progress.
 */
function updateProgressUI() {
    turnCounterSpan.textContent = turnCount;
    for (let i = 0; i < 4; i++) {
        const box = document.getElementById(`word-box-${i}`);
        box.classList.remove('locked', 'active');
        if (i < currentStage) {
            box.textContent = currentLockedWords[i];
            box.classList.add('locked');
        } else if (i === currentStage) {
            box.textContent = "???";
            box.classList.add('active');
        } else {
            box.textContent = "???";
        }
    }
}

/**
 * Updates the probability bars and labels for the current word prediction options.
 */
function updateParrotUI() {
    for (let i = 0; i < 4; i++) {
        document.getElementById(`prob-label-${i}`).textContent = stageVocab[currentStage][i];
        document.getElementById(`prob-bar-${i}`).style.width = currentProbs[i] + "%";
        document.getElementById(`prob-val-${i}`).textContent = Math.round(currentProbs[i]) + "%";
    }
}

/**
 * Selects a random candidate word for the parrot to guess based on current probabilities.
 */
function generateNextParrotPhrase() {
    // Select based on probability
    const rand = Math.random() * 100;
    let sum = 0;
    selectedWordIndex = 3; // Default to last
    for (let i = 0; i < 4; i++) {
        sum += currentProbs[i];
        if (rand <= sum) {
            selectedWordIndex = i;
            break;
        }
    }
    
    // Construct phrase
    const lockedWords = currentLockedWords.join(" ");
    const nextWord = stageVocab[currentStage][selectedWordIndex];
    parrotSpeech.textContent = lockedWords ? `${lockedWords} ${nextWord}` : nextWord;
    
    parrotSpeech.style.transform = "scale(1.1)";
    setTimeout(() => {
        parrotSpeech.style.transform = "scale(1)";
    }, 150);
}

/**
 * Adjusts the internal probabilities based on whether the user rewarded or ignored the parrot's guess.
 * @param {boolean} rewarded - True if the user gave a treat, false if ignored.
 */
function adjustParrotProbs(rewarded) {
    turnCount++;
    turnCounterSpan.textContent = turnCount;
    
    btnGiveTreat.disabled = true;
    btnIgnore.disabled = true;
    
    if (rewarded) {
        currentProbs[selectedWordIndex] += 15;
    } else {
        currentProbs[selectedWordIndex] -= 10;
    }
    
    // Boundary checks
    for (let i = 0; i < 4; i++) {
        if (currentProbs[i] < 5) currentProbs[i] = 5;
    }
    
    // Normalize to 100
    let total = currentProbs.reduce((a, b) => a + b, 0);
    currentProbs = currentProbs.map(p => (p / total) * 100);
    
    updateParrotUI();
    
    setTimeout(() => {
        const maxProb = Math.max(...currentProbs);
        if (maxProb >= 85) {
            const winningIndex = currentProbs.indexOf(maxProb);
            completeStage(winningIndex);
        } else {
            generateNextParrotPhrase();
            btnGiveTreat.disabled = false;
            btnIgnore.disabled = false;
        }
    }, 600);
}

/**
 * Called when the parrot successfully learns the target word for the current stage.
 * Locks the word in and moves to the next word, or ends the lesson if complete.
 * @param {number} winningIndex - The index of the word that was successfully learned.
 */
function completeStage(winningIndex) {
    const winningWord = stageVocab[currentStage][winningIndex];
    currentLockedWords.push(winningWord);
    
    const lockedWordsText = currentLockedWords.slice(0, currentStage).join(" ");
    parrotSpeech.textContent = lockedWordsText ? `${lockedWordsText} ${winningWord}` : winningWord;
    
    setTimeout(() => {
        currentStage++;
        updateProgressUI();
        
        if (currentStage >= 4) {
            endLesson5();
        } else {
            initStage();
        }
    }, 1200);
}

btnGiveTreat.addEventListener('click', () => adjustParrotProbs(true));
btnIgnore.addEventListener('click', () => adjustParrotProbs(false));

/**
 * Displays the final feedback screen when the Parrot Trainer lesson is completed.
 */
function endLesson5() {
    modalSentence.style.display = 'block';
    const finalSentence = currentLockedWords.join(" ");
    modalSentence.textContent = finalSentence;
    title.textContent = "Training Complete!";
    title.style.color = "var(--block-color-3)";
    explanation.innerHTML = `It took you <strong>${turnCount} turns</strong> to teach the AI a 4-word sentence: <em>"${finalSentence}"</em>!<br><br>This is exactly how <strong>RLHF (Reinforcement Learning from Human Feedback)</strong> works.<br><br>Real AI models like ChatGPT required thousands of humans clicking 'reward' and 'ignore' over millions of hours to learn how to speak properly. The AI doesn't understand the words, it's just predicting the next word that maximizes its math reward!`;
    
    btnRestart.onclick = () => {
        overlay.classList.add('hidden');
        initLesson5();
    };
    btnRestart.textContent = "Play Again";
    overlay.classList.remove('hidden');
}

// Start Lesson 5
initLesson5();

// --- Lesson 6: Reverse Pictionary Logic ---


let l6CurrentRound = 0;

const l6Phase1 = document.getElementById('l6-phase-1');
const l6Phase2 = document.getElementById('l6-phase-2');
const l6Phase3 = document.getElementById('l6-phase-3');

const l6RoundCounter = document.getElementById('l6-round-counter');
const l6TargetImage = document.getElementById('l6-target-image');
const l6DescriptionInput = document.getElementById('l6-description-input');
const btnSubmitDescription = document.getElementById('btn-submit-description');

const l6PromptDisplay = document.getElementById('l6-prompt-display');
const l6Canvas = document.getElementById('l6-canvas');
const l6Ctx = l6Canvas ? l6Canvas.getContext('2d') : null;
const l6ColorPicker = document.getElementById('l6-color-picker');
const l6BrushSize = document.getElementById('l6-brush-size');
const btnClearCanvas = document.getElementById('btn-clear-canvas');
const btnReveal = document.getElementById('btn-reveal');

const l6RevealOriginal = document.getElementById('l6-reveal-original');
const l6RevealDrawing = document.getElementById('l6-reveal-drawing');
const btnNextRound = document.getElementById('btn-next-round');
const l6InstructionText = document.getElementById('l6-instruction-text');

let isDrawing = false;

if (l6Canvas) {
    // Canvas setup
    l6Ctx.lineCap = 'round';
    l6Ctx.lineJoin = 'round';
    
    // Fill white background initially
    l6Ctx.fillStyle = 'white';
    l6Ctx.fillRect(0, 0, l6Canvas.width, l6Canvas.height);
    
    function getPointerPos(e) {
        const rect = l6Canvas.getBoundingClientRect();
        let clientX = e.clientX;
        let clientY = e.clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }
    
    function startDrawing(e) {
        e.preventDefault();
        isDrawing = true;
        const pos = getPointerPos(e);
        l6Ctx.beginPath();
        l6Ctx.moveTo(pos.x, pos.y);
        l6Ctx.strokeStyle = l6ColorPicker.value;
        l6Ctx.lineWidth = l6BrushSize.value;
    }
    
    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        const pos = getPointerPos(e);
        l6Ctx.lineTo(pos.x, pos.y);
        l6Ctx.stroke();
    }
    
    function stopDrawing() {
        if (!isDrawing) return;
        isDrawing = false;
        l6Ctx.closePath();
    }
    
    l6Canvas.addEventListener('mousedown', startDrawing);
    l6Canvas.addEventListener('mousemove', draw);
    l6Canvas.addEventListener('mouseup', stopDrawing);
    l6Canvas.addEventListener('mouseout', stopDrawing);
    
    l6Canvas.addEventListener('touchstart', startDrawing, {passive: false});
    l6Canvas.addEventListener('touchmove', draw, {passive: false});
    l6Canvas.addEventListener('touchend', stopDrawing);
    
    btnClearCanvas.addEventListener('click', () => {
        l6Ctx.fillStyle = 'white';
        l6Ctx.fillRect(0, 0, l6Canvas.width, l6Canvas.height);
    });
}

/**
 * Initializes the Reverse Pictionary game (Lesson 6).
 */
function initLesson6() {
    l6CurrentRound = 0;
    startL6Round();
}

/**
 * Starts a new round of Reverse Pictionary, loading a random image and generating AI caption options.
 */
function startL6Round() {
    if (l6CurrentRound >= l6Objects.length) {
        endLesson6();
        return;
    }
    
    l6RoundCounter.textContent = `Round ${l6CurrentRound + 1}/${l6Objects.length}`;
    l6InstructionText.textContent = "Player 1: Describe the object without naming it!";
    
    // Setup Phase 1
    l6TargetImage.src = l6Objects[l6CurrentRound].src;
    l6DescriptionInput.value = '';
    
    // Clear canvas
    if (l6Ctx) {
        l6Ctx.fillStyle = 'white';
        l6Ctx.fillRect(0, 0, l6Canvas.width, l6Canvas.height);
    }
    
    l6Phase1.classList.remove('hidden');
    l6Phase2.classList.add('hidden');
    l6Phase3.classList.add('hidden');
}

if (btnSubmitDescription) {
    btnSubmitDescription.addEventListener('click', () => {
        const desc = l6DescriptionInput.value.trim();
        if (!desc) {
            alert("Please type a description first!");
            return;
        }
        
        // Go to Phase 2
        l6InstructionText.textContent = "Player 2: Draw the object based on the description!";
        l6PromptDisplay.textContent = desc;
        
        l6Phase1.classList.add('hidden');
        l6Phase2.classList.remove('hidden');
        
        // Alert player swap
        setTimeout(() => alert("Player 1, look away! Hand the mouse/keyboard to Player 2."), 10);
    });
}

if (btnReveal) {
    btnReveal.addEventListener('click', () => {
        // Capture canvas drawing
        const dataURL = l6Canvas.toDataURL('image/png');
        
        // Setup Phase 3
        l6InstructionText.textContent = "The Reveal! How did the drawing compare to the real thing?";
        l6RevealOriginal.src = l6Objects[l6CurrentRound].src;
        l6RevealDrawing.src = dataURL;
        
        l6Phase2.classList.add('hidden');
        l6Phase3.classList.remove('hidden');
    });
}

if (btnNextRound) {
    btnNextRound.addEventListener('click', () => {
        l6CurrentRound++;
        startL6Round();
    });
}

/**
 * Displays the final feedback screen when Reverse Pictionary is completed.
 */
function endLesson6() {
    modalSentence.style.display = 'none';
    title.textContent = "Game Complete!";
    title.style.color = "var(--cmu-red)";
    explanation.innerHTML = `You've completed all rounds of <strong>Reverse Pictionary</strong>!<br><br>Now you know exactly why AI image generators sometimes create weird, illogical mistakes. They are just like Player 2: trying to paint a picture of something they've never actually experienced in the real world, relying entirely on text descriptions!`;
    
    btnRestart.onclick = () => {
        overlay.classList.add('hidden');
        initLesson6();
    };
    btnRestart.textContent = "Play Again";
    overlay.classList.remove('hidden');
}

// Ensure the start button works for lesson 6
document.querySelectorAll('.btn-start-lesson').forEach(btn => {
    if (btn.getAttribute('data-lesson') === '6') {
        btn.addEventListener('click', () => {
            document.getElementById('splash-6').classList.add('hidden');
            document.getElementById('content-6').classList.remove('hidden');
            initLesson6();
        });
    }
});

// --- Learn More Logic ---


const btnLearnMore = document.getElementById('btn-learn-more');
const learnMoreOverlay = document.getElementById('learn-more-overlay');
const btnCloseLearnMore = document.getElementById('btn-close-learn-more');
const learnMoreTitle = document.getElementById('learn-more-title');
const learnMoreConcept = document.getElementById('learn-more-concept');
const learnMoreText = document.getElementById('learn-more-text');

if (btnLearnMore) {
    btnLearnMore.addEventListener('click', () => {
        // Find which lesson is currently active by checking the active nav item
        const activeNav = document.querySelector('#nav-list li.active');
        if (activeNav) {
            const lessonId = activeNav.getAttribute('data-target');
            const data = learnMoreData[lessonId];
            if (data) {
                learnMoreTitle.textContent = data.title;
                learnMoreConcept.textContent = data.concept;
                learnMoreText.innerHTML = data.text;
                learnMoreOverlay.classList.remove('hidden');
            }
        }
    });
}

if (btnCloseLearnMore) {
    btnCloseLearnMore.addEventListener('click', () => {
        learnMoreOverlay.classList.add('hidden');
    });
}
