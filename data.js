const lesson1Rounds = [
    {
        prompt: "Can you tell me what a dinosaur is?",
        startPrefix: ["The"],
        arrays: {
            correct: ["Dinosaurs", "are", "extinct", "reptiles."],
            incorrect: ["T-rex", "is a", "modern", "bird."],
            nonsense1: ["Aliens", "built the", "sad.", "when."],
            nonsense2: ["pizza.", "eats", "very", "happy."]
        }
    },
    {
        prompt: "Where is Carnegie Mellon University?",
        startPrefix: ["CMU"],
        arrays: {
            correct: ["is", "in", "Pittsburgh,", "Pennsylvania."],
            incorrect: ["is", "in", "Brooklyn,", "New York."],
            nonsense1: ["was", "built", "by", "aliens."],
            nonsense2: ["eats", "a", "lot", "of pizza."]
        }
    },
    {
        prompt: "Who was Alan Turing?",
        startPrefix: ["He"],
        arrays: {
            correct: ["was", "the", "inventor", "of AI."],
            incorrect: ["was", "a", "Russian", "spy."],
            nonsense1: ["built", "the", "first", "pizza."],
            nonsense2: ["danced", "on", "the", "moon."]
        }
    },
    {
        prompt: "When did AI beat the world chess champion?",
        startPrefix: ["Deep"],
        arrays: {
            correct: ["Blue", "beat", "him", "in", "1997."],
            incorrect: ["Red", "lost", "the", "game", "yesterday."],
            nonsense1: ["dish", "pizza", "is", "very", "tasty."],
            nonsense2: ["sea", "aliens", "built", "the", "pyramids."]
        }
    }
];

const animals = [
    {
        id: "dog-collar",
        src: "assets/images/dog_with_collar_1782326837505.png",
        expectedPath: ["btn-fur-yes", "btn-legs-yes", "btn-collar-yes"],
        resultNode: "result-dog",
        type: "True Positive!",
        feedback: "It's a Dog! The AI got it right because it had fur, 4 legs, and a collar. This is exactly what the AI was trained to look for."
    },
    {
        id: "fox",
        src: "assets/images/fox_1782326854380.png",
        expectedPath: ["btn-fur-yes", "btn-legs-yes", "btn-collar-no"],
        resultNode: "result-fox",
        type: "True Positive!",
        feedback: "It's a Fox! The AI correctly identified it as a fox because it didn't have a collar."
    },
    {
        id: "dog-no-collar",
        src: "assets/images/dog_no_collar.png",
        expectedPath: ["btn-fur-yes", "btn-legs-yes", "btn-collar-no"],
        resultNode: "result-fox",
        type: "False Negative!",
        feedback: "The AI predicted a Fox, but that's a Dog!<br><br>Why did it make a mistake? Because its rulebook was too rigid. It learned the rule that <em>'dogs have collars'</em> and <em>'foxes don't'</em>. When it saw a dog without a collar, it got confused."
    },
    {
        id: "cat",
        src: "assets/images/cat_with_collar_1782326846767.png",
        expectedPath: ["btn-fur-yes", "btn-legs-yes", "btn-collar-yes"],
        resultNode: "result-dog",
        type: "False Positive!",
        feedback: "The AI predicted a Dog, but it's a Cat!<br><br>The AI got confused because it learned that <em>'collar = dog'</em>. It completely ignored the fact that cats can wear collars too! This is a False Positive."
    },
    {
        id: "snake",
        src: "assets/images/snake_1782326863164.png",
        expectedPath: ["btn-fur-no"],
        resultNode: "result-no-fur",
        type: "True Positive!",
        feedback: "It's a Snake! The AI got it right because it saw no fur. The AI's rulebook says 'No fur = Snake'."
    }
];

const stageVocab = [
    ["I", "Squawk", "Polly", "Hello"],
    ["want", "am", "like", "squawk"],
    ["a", "the", "some", "squawk"],
    ["cracker!", "seed!", "toy!", "squawk!"]
];

const l6Objects = [
    { src: 'assets/images/obj_rolodex.png' },
    { src: 'assets/images/obj_rotary_phone.png' },
    { src: 'assets/images/obj_walkman.png' },
    { src: 'assets/images/obj_payphone.png' }
];

const learnMoreData = {
    'lesson-1': {
        title: 'Lesson 1: Next-Word Prediction',
        concept: 'Concept: Probability Distributions & Softmax',
        text: "In the activity, you saw percentage bars for words like 'robot' or 'dinosaur'. How does the AI get those exact percentages? An AI model computes a raw math score (called a logit) for every single word in the dictionary based on statistical patterns from its training data. These raw scores could be any number (like 5.2 or -100). To convert these raw scores into the exact percentages you saw (where everything adds up perfectly to 100%), the AI applies a mathematical function called <strong>Softmax</strong>: <br><br><div style='text-align:center; font-size:1.2rem; margin:1rem 0;'><em>f(x<sub>i</sub>) = e<sup>x<sub>i</sub></sup> / &Sigma; e<sup>x<sub>j</sub></sup></em></div><br>By using the exponential function (e<sup>x</sup>), Softmax forces all negative numbers to become positive and ensures all the values sum exactly to 1.0. The AI then randomly picks a word according to this exact probability distribution."
    },
    'lesson-2': {
        title: 'Lesson 2: Spot the AI',
        concept: 'Concept: Latent Space & Diffusion Models',
        text: "In the activity, you saw an AI draw 6 fingers on a hand and create garbled alien text. Why does it make such specific, weird mistakes? AI image generators don't understand 3D anatomy or language. Instead, they use a process called <strong>Diffusion</strong>. They start with an image of pure static (random noise). Over many steps, they iteratively subtract that noise, guided by a mathematical coordinate system called a <strong>Latent Space</strong> where concepts are mapped as vectors. When the math tries to map the vector for 'hand', it finds a local minimum—a statistical pattern of pixels that look like fingers side-by-side. Because it is purely optimizing pixel statistics rather than applying structural geometry (like knowing a skeleton only has 5 bones), it simply continues generating finger patterns until the mathematical noise is minimized, resulting in 6 fingers."
    },
    'lesson-3': {
        title: 'Lesson 3: The "Yes-Man" AI',
        concept: 'Concept: Reward Functions & Optimization',
        text: "In the activity, even when you explicitly typed 'Be a harsh critic,' the AI still praised your terrible Tic-Tac-Toe moves. This happens because of <strong>Reinforcement Learning from Human Feedback (RLHF)</strong>. During the AI's training, human testers rate its responses. These ratings generate a mathematical <strong>Reward Function</strong>—an algebraic equation, <em>R(state, action)</em>, that outputs a numerical score for behavior. Because human testers consistently gave high ratings to polite answers, the AI learns that <em>R(polite) &gt; R(mean)</em>. When you play the game, the AI is mathematically forced to optimize its output to maximize this reward function. The mathematical drive to maximize its score heavily overrides your text prompt, locking its probability distribution toward agreeable words."
    },
    'lesson-4': {
        title: 'Lesson 4: The Rigid Rulebook',
        concept: 'Concept: Decision Boundaries & Overfitting',
        text: "In the activity, the AI failed to identify a dog without a collar because it had memorized a strict, rigid rule: 'collar = dog'. In Machine Learning, sorting data into categories means drawing a mathematical line between points on a graph, known as a <strong>Decision Boundary</strong>. If you force a model to perfectly memorize its training data, it's like using an extremely complex polynomial equation (e.g., <em>y = x<sup>5</sup> - 3x<sup>3</sup> + 2x</em>) to zig-zag and perfectly connect every single training dot. This is called <strong>Overfitting</strong>. While the math perfectly solves the training data (identifying all the specific collared dogs it saw), the highly complex curve fails spectacularly when given new, unseen data. Good AI models use simpler, smoother equations (like a straight line, <em>y = mx + b</em>) that don't perfectly memorize the training data, but generalize much better to the real world."
    },
    'lesson-5': {
        title: 'Lesson 5: The Parrot Trainer',
        concept: 'Concept: Policy Gradients & Loss Functions',
        text: "In the activity, every time you clicked 'Give Treat', the parrot's probability of saying that word went up until it hit the 85% goal. Mathematically, you were minimizing a <strong>Loss Function</strong>. A Loss Function calculates the numerical difference between the AI's current prediction and the desired outcome. When you gave a treat, you applied a <strong>gradient update</strong>—using calculus (specifically derivatives) to adjust the internal variables (weights) of the AI's neural network. This mathematically increased the probability of the rewarded word and decreased the probability of the others. Step-by-step, you reshaped the AI's internal probability curve until the math guaranteed an 85% chance of outputting your desired word."
    },
    'lesson-6': {
        title: 'Lesson 6: Reverse Pictionary',
        concept: 'Concept: Embedding Spaces & Cross-Modal Mapping',
        text: "In the activity, you saw how hard it is to draw an object just from a text description when you lack physical experience with the object. AI image generators face this exact problem. They use an <strong>Embedding Space</strong>—a high-dimensional coordinate graph where both text and images are mapped as mathematical vectors (lists of numbers). For example, the text vector for the word 'Walkman' is mapped to coordinate points close to the image vectors of 'blue boxes' and 'headphones'. The AI literally draws by translating text coordinates into image coordinates. However, because it only has coordinate geometry and no real-world physics engine, it doesn't know that headphones <em>must</em> physically plug into a jack. It simply places the 'headphone' pixels near the 'box' pixels according to the coordinate mapping, leading to the bizarre logic errors you see in AI art."
    }
};
