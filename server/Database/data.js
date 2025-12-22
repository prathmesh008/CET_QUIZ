const q1 = [
    {
        id: 1,
        topic: "Logical Reasoning",
        question: "1). Which square was divided into two different figures?",
        options: [
            "Option A",
            "Option B",
            "Option C",
            "Option D",
            "Option E"
        ],
        explanation: "The yellow JS shield is the official JavaScript logo.",
        questionImage: "",
        optionImages: [
            "/photos/q1/o1.png",
            "/photos/q1/o2.png",
            "/photos/q1/o3.png",
            "/photos/q1/o4.png",
            "/photos/q1/o5.png",
        ],
        points: 3
    },
    {
        id: 2,
        topic: "Numerical Ability",
        question: "2). Lizzy has 7 coins of a kind. She buys three fruits at the market. Each fruit has a different price. How much is the most expensive fruit?",
        options: [
            "(A) 2 coins",
            "(B) 3 coins",
            "(C) 4 coins",
            "(D) 5 coins",
            "(E) 6 coins"
        ],
        explanation: "The green hexagon logo represents Node.js.",
        questionImage: "",
        optionImages: [
            "",     // Node.js logo (correct)
            "",                    // HTML5 logo
            ""                   // JS logo
        ],
        points: 3
    },
    {
        id: 3,
        topic: "Numerical Ability",
        question: "3). The rectangle on the right consists of 4 rows and 7 columns.In total, it consists of 28 white squares.Ira paints 2 rows and 1 column.How many squares remain white?",
        options: [
            '(A) 8',
            '(B) 12',
            '(C) 14',
            '(D) 17',
            '(E) 10'
        ],
        explanation: "In JavaScript, typeof null returns 'object'. This is a known bug in JavaScript.",
        questionImage: "/photos/q3/q3.png",
        optionImages: [],
        points: 3
    },
    {
        id: 4,
        topic: "Logical Reasoning",
        question: "4). Firefighter Fred wants to put out the fire.What is the smallest number of ladders he has to climb in the picture on the right, to get to the fire without jumping?",
        options: [
            '(A) 4',
            '(B) 5',
            '(C) 6',
            '(D) 7',
            '(E) 8'
        ],
        explanation: "The toString() method returns a string representing the object.",
        questionImage: "/photos/q4/q4.png",
        optionImages: [],
        points: 3
    },
    {
        id: 5,
        topic: "Logical Reasoning",
        question: "5). Ben has built a structure. A cat has thrown a cube off his structure:Which of these structures did Ben build?",
        options: [
            "Option A",
            "Option B",
            "Option C",
            "Option D",
            "Option E"
        ],
        explanation: "JSON.stringify() converts a JavaScript object or value to a JSON string.",
        questionImage: "/photos/q5/q5.png",
        optionImages: [
            "/photos/q5/o1.png",
            "/photos/q5/q5o2.png",
            "/photos/q5/q5o3.png",
            "/photos/q5/q5o4.png",
            "/photos/q5/q5o5.png",
        ],
        points: 3
    },
    {
        id: 6,
        topic: "Logical Reasoning",
        question: "6). Alex hangs a poster on his kitchen wall.the kitchen wall has white and grey tiles of the same size seepicture.How many grey tiles are completely covered by the poster?",
        options: [
            "(A) 15",
            "(B) 21",
            "(C) 25",
            "(D) 30",
            "(E) 35"
        ],
        explanation: "The pop() method removes the last element from an array and returns that element.",
        questionImage: "/photos/q6/q6.png",
        optionImages: [],
        points: 3
    },
    {
        id: 7,
        topic: "Logical Reasoning",
        question: "7). Tim has black and white squares of paper. He glues the squares on the inside of awindow. This creates the pattern shown on the right.What pattern can you see from the outside?",
        options: [
            "Option A",
            "Option B",
            "Option C",
            "Option D",
            "Option E"
        ],
        explanation: "// is used for single-line comments in JavaScript.",
        questionImage: "/photos/q7/q7.png",
        optionImages: [
            "/photos/q7/q7o1.png",
            "/photos/q7/q7o2.png",
            "/photos/q7/q7o3.png",
            "/photos/q7/q7o4.png",
            "/photos/q7/q7o5.png"
        ],
        points: 3
    },
    {
        id: 8,
        topic: "Numerical Ability",
        question: "8). 213, 214 and 215 are three consecutive three-digit numbers.Mohammad writes three consecutive four-digit numbers in a row.His sister erases a few digits from each of the three numbers.",
        options: [
            "(A) 3 8 9, 3, 9 9",
            "(B) 4 8 9, 3, 9 6",
            "(C) 4 8 9, 4, 9 8",
            "(D) 4 8 9, 4, 9 9",
            "(E) 4 8 8, 4, 9 9"
        ],
        explanation: "NaN stands for 'Not-a-Number', but its type is actually 'number'.",
        questionImage: "/photos/q8/q8.png",
        optionImages: [],
        points: 3
    },
    {
        id: 9,
        topic: "Logical Reasoning",
        question: "9). Lisa writes the numbers 1, 2, 4, 5 and 6 in the circles of the pattern. She writeseach of the five numbers exactly once, and if she adds up the numbers alongone of the three straight lines, she gets 11 each time.Which number did she write in the circle with the question mark?",
        options: [
            "(A) 1",
            "(B) 2",
            "(C) 4",
            "(D) 5",
            "(E) 6"
        ],
        explanation: "setTimeout() executes a function after a specified number of milliseconds.",
        questionImage: "/photos/q9/q9.png",
        optionImages: [],
        points: 4
    },
    {
        id: 10,
        topic: "Verbal Ability",
        question: "10). These five fruits are in a basket: [apple] [grape] [cherry] [strawberry] [banana]. Ann likes [cherry]. Ben likes [apple] [grape] [cherry] [strawberry] [banana].",
        inlineImages: {
            apple: "/photos/q10/apple.png",
            grape: "/photos/q10/grapes.png",
            cherry: "/photos/q10/cherry.png",
            strawberry: "/photos/q10/strawberry.png",
            banana: "/photos/q10/banana.png"
        },
        options: [
            "Option A",
            "Option B",
            "Option C",
            "Option D",
            "Option E"
        ],
        explanation: "JSON.stringify() is the standard method to convert a value to a JSON string.",
        questionImage: "",
        optionImages: [
            "photos/q10/apple.png",
            "photos/q10/grapes.png",
            "photos/q10/cherry.png",
            "photos/q10/strawberry.png",
            "photos/q10/banana.png"
        ],
        points: 4
    },
    {
        id: 11,
        topic: "Logical Reasoning",
        question: "11). The wizard Adam built the tower on the right out of 8 discs. He magically makes discs disappear one after the other: First the second disc from the bottom, then from the new tower the third disc from the bottom. Then he makes the fourth disc from bottom of the newly created tower disappear. At the end, he removes the fifth disc from the bottom of the now newly created tower. What tower does Adam get?",           // text with or without inline images
        questionImage: "/photos/q11/q11.png",          // path to question image OR "" if none



        options: [
            "Option A",
            "Option B",
            "Option C",
            "Option D",
            "Option E"      // 5 options text
        ],

        optionImages: [
            "/photos/q11/q11o1.png", "/photos/q11/q11o2.png", "/photos/q11/q11o3.png", "/photos/q11/q11o4.png", "/photos/q11/q11o5.png"        // 5 image paths or "" for no image
        ],



        points: 4
    },
    {
        id: 12,
        topic: "Numerical Ability",
        question: "12). Penguin Peter goes fishing every day and brings 9 fish for his two children. Every day he gives 5 fish to the first child he sees. The other child then gets 4 fish. In the last few days, a child has had a total of 26 fish. How many fish did the other child get?",           // text with or without inline images
        questionImage: "",          // path to question image OR "" if none



        options: [
            "(A) 19", "(B) 22", "(C) 25", "(D) 28", "(E) 31"       // 5 options text
        ],

        optionImages: [
            // 5 image paths or "" for no image
        ],



        points: 4
    },
    {
        id: 13,
        topic: "Numerical Ability",
        question: "13. 7 cards with the numbers from 1 to 7 are placed in these four overlapping rings: If you add up the numbers of all the cards in a ring, the result is always 10. What number is on the card with the question mark?",
        questionImage: "/photos/q13/q13.png",



        options: [
            "(A) 1", "(B) 2", "(C) 4", "(D) 5", "(E) 7"
        ],

        optionImages: [
            "",
            "",
            "",
            "",
            ""],


        points: 4
    },
    {
        id: 14,
        topic: "Logical Reasoning",
        question: "14). Lucas has these five pieces of a puzzle available: He wants to lay a caterpillar consisting of a head, a tail and 1, 2 or 3 parts in between. How many different caterpillars can Lucas build?",
        questionImage: "/photos/q14/q14.png",



        options: [
            "(A) 3", "(B) 4", "(C) 5", "(D) 6", "(E) 7"],

        optionImages: [
            "",
            "",
            "",
            "",
            ""],


        points: 4
    },
    {
        id: 15,
        topic: "Logical Reasoning",
        question: "15. Kangaroo Joey hops through a maze.The arrows of a field indicate how far, and in which direction,Joey has to bounce. A field with three arrows means that Joey bounces in the direction of the arrows, skipping two spaces, and landing in the 3rd space. Through which exit will Joey leave the maze, if he starts in the bottom left field with the three arrows?",
        questionImage: "/photos/q15/q15.png",



        options: [
            "(A) through A", "(B) through B", "(C) through C", "(D) through D", "(E) through none of the four exits"
        ],

        optionImages: [
            "",
            "",
            "",
            "",
            ""],


        points: 4
    },
    {
        id: 16,
        topic: "Numerical Ability",
        question: "16. Two types of tiles were used for a kitchen floor: rectangular [rectangle] and square [square]. This picture shows part of the installed kitchen floor: The rectangular tiles are 23 cm long and 11 cm wide. What is the length of a side of a small square tile?",
        questionImage: "/photos/q16/q16.png",

        inlineImages: {
            square: "/photos/q16/square.png",
            rectangle: "/photos/q16/rectangle.png"
        },

        options: [
            "(A) 3 cm", "(B) 4 cm", "(C) 5 cm", "(D) 6 cm", "(E) 7 cm"],

        optionImages: [
            "",
            "",
            "",
            "",
            ""],


        points: 4
    },
    {
        id: 17,
        topic: "Numerical Ability",
        question: "17). Mia has 3 cards with three-digit numbers on them. If she adds the three numbers together, she gets the number 782. Unfortunately, a worm has eaten one digit of each card. What number does she get when she adds up the three digits that the worm has eaten?",
        questionImage: "/photos/q17/q17.png",



        options: [
            "(A) 8", "(B) 9", "(C) 10", "(D) 11", "(E) 12"],

        optionImages: [
            "",
            "",
            "",
            "",
            ""],


        points: 5
    },
    {
        id: 18,
        topic: "Numerical Ability",
        question: "18. Lucy weighs building blocks and obtains the following values: How much do the three different building blocks weigh together?",
        questionImage: "/photos/q18/q18.png",



        options: [
            "(A) 270 g", "(B) 280 g", "(C) 290 g", "(D) 300 g", "(E) 310 g"],

        optionImages: [
            "",
            "",
            "",
            "",
            ""],


        points: 5
    },
    {
        id: 19,
        topic: "Logical Reasoning",
        question: "19. 60 children stand in a row. Each child has a high-visibility vest and a backpack.The colours of their high-visibility vests always alternate: yellow, green, yellow, green, ...The colours of their backpacks make the following pattern: red, brown, purple, red, brown,purple, ... How many children have a yellow safety vest and a purple backpack?",
        questionImage: "",



        options: [
            "(A) 3", "(B) 4", "(C) 6", "(D) 8", "(E) 10"],

        optionImages: [
            "",
            "",
            "",
            "",
            ""],


        points: 5
    },
    {
        id: 20,
        topic: "Logical Reasoning",
        question: "20. Cards of the same shape hide the same digits. Cards with different shapes hide different digits. Kim lays out the cards in such a way that the calculations are correct.[exam] \n What number does Kim get for the calculation[ques]?",
        questionImage: "",
        inlineImages: {
            exam: "/photos/q20/exam.png",
            ques: "/photos/q20/ques.png"
        },


        options: [
            "(A) 0", "(B) 15", "(C) 18", "(D) 28", "(E) 30"],

        optionImages: [
            "",
            "",
            "",
            "",
            ""],


        points: 5
    },
    {
        id: 21,
        topic: "Logical Reasoning",
        question: "21. There are exactly 2 frogs in each row and in each column – see picture. Two of the six frogs jump to one of their neighbouring fields at the same time when it is empty. After that, there are again two frogs in each row and in each column. How many possibilities are there for two frogs to jump like this?",
        questionImage: "/photos/q21/q21.png",



        options: [
            "(A) 1", "(B) 2", "(C) 3", "(D) 4", "(E) 5"],

        optionImages: [
            "",
            "",
            "",
            "",
            ""],


        points: 5
    },
    {
        id: 22,
        topic: "Numerical Ability",
        question: "22. The picture on the right shows a honeycomb with 9 cells. There is honey in some cells. The numbers in the cells indicate how many neighbouring cells contain honey. How many cells are filled with honey?",
        questionImage: "/photos/q22/q22.png",



        options: [
            "(A) 4", "(B) 5", "(C) 6", "(D) 7", "(E) 8"],

        optionImages: [
            "",
            "",
            "",
            "",
            ""],


        points: 5
    },
    {
        id: 23,
        topic: "Logical Reasoning",
        question: "Kanga wants to build a figure out of these three parts: [pic] \n He can also rotate or flip the parts. Which of the five pieces can he NOT make?",
        questionImage: "",
        inlineImages: {
            pic: "/photos/q23/pic.png"
        },


        options: [
            "Option A",
            "Option B",
            "Option C",
            "Option D",
            "Option E"],

        optionImages: [
            "/photos/q23/q23o1.png",
            "/photos/q23/q23o2.png",
            "/photos/q23/q23o3.png",
            "/photos/q23/q23o4.png",
            "/photos/q23/q23o5.png"],


        points: 5
    },
    {
        id: 24,
        topic: "Logical Reasoning",
        question: "This tray of biscuits lies in the kitchen. Three girls take biscuits from the tray in an unknown order: Tina takes all the heart-shaped cookies that are still on the tray. Emma takes all the white cookies that are still on the tray. Rosa takes all the large cookies that are still on the tray. One of the girls takes 3 biscuits, one takes 6 biscuits and one takes 7 biscuits. Which of the following cookies did one of the girls take?",
        questionImage: "/photos/q24/q24.png",



        options: [
            "Option A",
            "Option B",
            "Option C",
            "Option D",
            "Option E"],

        optionImages: [
            "/photos/q24/q24o1.png",
            "/photos/q24/q24o2.png",
            "/photos/q24/q24o3.png",
            "/photos/q24/q24o4.png",
            "/photos/q24/q24o5.png"],


        points: 5
    }

]

const a1 = [4, 2, 2, 2, 4, 1, 3, 3, 2, 0, 1, 3, 0, 1, 4, 3, 3, 0, 4, 3, 3, 2, 4, 4];

const q2 = [
    {
        id: 1,
        topic: "Numerical Ability",
        question: "Which number is missing? 4, 8, 12, __, 20",
        options: ["(A) 14", "(B) 15", "(C) 16", "(D) 18", "(E) 24"],
        explanation: "",
        questionImage: "",
        optionImages: [],
        points: 3
    },
    {
        id: 2,
        topic: "Numerical Ability",
        question: "A square has a perimeter of 20 cm. What is the length of one side?",
        options: ["(A) 3", "(B) 4", "(C) 5", "(D) 6", "(E) 10"],
        explanation: "",
        questionImage: "",
        optionImages: [],
        points: 3
    },
    {
        id: 3,
        topic: "Numerical Ability",
        question: "How many corners does 3 triangles have together?",
        options: ["(A) 6", "(B) 7", "(C) 8", "(D) 9", "(E) 12"],
        explanation: "",
        questionImage: "",
        optionImages: [],
        points: 3
    },
    {
        id: 4,
        topic: "Numerical Ability",
        question: "Which number is the largest?",
        options: ["(A) 403", "(B) 430", "(C) 340", "(D) 304", "(E) 450"],
        explanation: "",
        questionImage: "",
        optionImages: [],
        points: 3
    },
    {
        id: 5,
        topic: "Logical Reasoning",
        question: "If today is Tuesday, what day will it be after 10 days?",
        options: ["(A) Friday", "(B) Saturday", "(C) Sunday", "(D) Monday", "(E) Thursday"],
        explanation: "",
        questionImage: "",
        optionImages: [],
        points: 3
    },
    {
        id: 6,
        topic: "Numerical Ability",
        question: "How many tens are there in 370?",
        options: ["(A) 3", "(B) 7", "(C) 30", "(D) 37", "(E) 300"],
        explanation: "",
        questionImage: "",
        optionImages: [],
        points: 3
    },
    {
        id: 7,
        topic: "Logical Reasoning",
        question: "Which shape has no corners?",
        options: ["(A) Square", "(B) Triangle", "(C) Rectangle", "(D) Circle", "(E) Pentagon"],
        explanation: "",
        questionImage: "",
        optionImages: [],
        points: 3
    },
    {
        id: 8,
        topic: "Numerical Ability",
        question: "9 + 9 ÷ 3 = ?",
        options: ["(A) 6", "(B) 9", "(C) 12", "(D) 15", "(E) 18"],
        explanation: "",
        questionImage: "",
        optionImages: [],
        points: 3
    },
    {
        id: 9,
        topic: "Numerical Ability",
        question: "A box has 4 red, 3 blue, and 5 green balls. How many balls are there in total?",
        options: ["(A) 10", "(B) 11", "(C) 12", "(D) 13", "(E) 14"],
        explanation: "",
        questionImage: "",
        optionImages: [],
        points: 4
    },
    {
        id: 10,
        topic: "Numerical Ability",
        question: "Which number makes the sum 50? 27 + __ = 50",
        options: ["(A) 13", "(B) 21", "(C) 22", "(D) 23", "(E) 24"],
        explanation: "",
        questionImage: "",
        optionImages: [],
        points: 4
    },
    {
        id: 11,
        topic: "Numerical Ability",
        question: "How many minutes are there in 2 hours and 15 minutes?",
        options: ["(A) 120", "(B) 135", "(C) 140", "(D) 145", "(E) 150"],
        explanation: "",
        questionImage: "",
        optionImages: [],
        points: 4
    },
    {
        id: 12,
        topic: "Numerical Ability",
        question: "A rectangle has length 8 cm and width 3 cm. What is its area?",
        options: ["(A) 11", "(B) 16", "(C) 24", "(D) 32", "(E) 48"],
        explanation: "",
        questionImage: "",
        optionImages: [],
        points: 4
    },
    {
        id: 13,
        topic: "Numerical Ability",
        question: "Which fraction is the biggest?",
        options: ["(A) 1/2", "(B) 2/3", "(C) 3/4", "(D) 4/5", "(E) 1/3"],
        explanation: "",
        questionImage: "",
        optionImages: [],
        points: 4
    },
    {
        id: 14,
        topic: "Logical Reasoning",
        question: "What comes next? 2, 6, 18, __",
        options: ["(A) 24", "(B) 36", "(C) 48", "(D) 54", "(E) 56"],
        explanation: "",
        questionImage: "",
        optionImages: [],
        points: 4
    },
    {
        id: 15,
        topic: "Numerical Ability",
        question: "How many faces does a cube have?",
        options: ["(A) 4", "(B) 5", "(C) 6", "(D) 8", "(E) 12"],
        explanation: "",
        questionImage: "",
        optionImages: [],
        points: 4
    },
    {
        id: 16,
        topic: "Numerical Ability",
        question: "If one pencil costs 7 coins, how many coins are needed for 5 pencils?",
        options: ["(A) 30", "(B) 32", "(C) 34", "(D) 35", "(E) 40"],
        explanation: "",
        questionImage: "",
        optionImages: [],
        points: 4
    },
    {
        id: 17,
        topic: "Numerical Ability",
        question: "Three numbers add up to 120. Two of them are 45 and 38. What is the third number?",
        options: ["(A) 27", "(B) 35", "(C) 37", "(D) 45", "(E) 52"],
        explanation: "",
        questionImage: "",
        optionImages: [],
        points: 5
    },
    {
        id: 18,
        topic: "Numerical Ability",
        question: "A clock shows 3:30. What angle is between the hour and minute hand?",
        options: ["(A) 30°", "(B) 45°", "(C) 60°", "(D) 75°", "(E) 90°"],
        explanation: "",
        questionImage: "",
        optionImages: [],
        points: 5
    },
    {
        id: 19,
        topic: "Numerical Ability",
        question: "How many even numbers are there between 10 and 40?",
        options: ["(A) 14", "(B) 15", "(C) 16", "(D) 17", "(E) 18"],
        explanation: "",
        questionImage: "",
        optionImages: [],
        points: 5
    },
    {
        id: 20,
        topic: "Numerical Ability",
        question: "A number becomes 5 times bigger when multiplied by 5. What is the number?",
        options: ["(A) 1", "(B) 5", "(C) 10", "(D) 25", "(E) 50"],
        explanation: "",
        questionImage: "",
        optionImages: [],
        points: 5
    },
    {
        id: 21,
        topic: "Logical Reasoning",
        question: "Which shape has the greatest number of sides?",
        options: ["(A) Triangle", "(B) Square", "(C) Pentagon", "(D) Hexagon", "(E) Octagon"],
        explanation: "",
        questionImage: "",
        optionImages: [],
        points: 5
    },
    {
        id: 22,
        topic: "Numerical Ability",
        question: "If 3 apples cost 18 coins, how many coins do 5 apples cost?",
        options: ["(A) 25", "(B) 28", "(C) 30", "(D) 32", "(E) 35"],
        explanation: "",
        questionImage: "",
        optionImages: [],
        points: 5
    },
    {
        id: 23,
        topic: "Numerical Ability",
        question: "How many different ways can you arrange the letters A, B, C?",
        options: ["(A) 3", "(B) 4", "(C) 5", "(D) 6", "(E) 9"],
        explanation: "",
        questionImage: "",
        optionImages: [],
        points: 5
    },
    {
        id: 24,
        topic: "Numerical Ability",
        question: "A number is divisible by both 2 and 5. Which number could it be?",
        options: ["(A) 12", "(B) 15", "(C) 20", "(D) 22", "(E) 25"],
        explanation: "",
        questionImage: "",
        optionImages: [],
        points: 5
    }
];
const a2 = [2, 2, 3, 4, 2, 3, 3, 3, 2, 3, 1, 2, 3, 3, 2, 3, 2, 2, 2, 0, 4, 2, 3, 2];

const q3 = [
    {
        "id": 1,
        "topic": "Chemistry",
        "question": "What is the basis of the modern periodic table?",
        "options": [
            "(A) Atomic mass",
            "(B) Atomic number",
            "(C) Valency",
            "(D) Atomic volume"
        ],
        "correctIndex": 1,
        "points": 3
    },
    {
        "id": 2,
        "topic": "Chemistry",
        "question": "Who introduced the concept of atomic number in the periodic table?",
        "options": [
            "(A) Mendeleev",
            "(B) Bohr",
            "(C) Henry Moseley",
            "(D) Dalton"
        ],
        "correctIndex": 2,
        "points": 3
    },
    {
        "id": 3,
        "topic": "Chemistry",
        "question": "What happens to atomic size as we move from left to right across a period?",
        "options": [
            "(A) It increases",
            "(B) It decreases",
            "(C) It remains the same",
            "(D) It first increases and then decreases"
        ],
        "correctIndex": 1,
        "points": 3
    },
    {
        "id": 4,
        "topic": "Chemistry",
        "question": "Why are noble gases placed in Group 18 of the periodic table?",
        "options": [
            "(A) Because they have large atomic size",
            "(B) Because their valence shell is completely filled",
            "(C) Because they are highly reactive",
            "(D) Because they have high atomic mass"
        ],
        "correctIndex": 1,
        "points": 3
    },
    {
        "id": 5,
        "topic": "Chemistry",
        "question": "Why do elements of the same group have similar chemical properties?",
        "options": [
            "(A) They have the same atomic mass",
            "(B) They have the same number of valence electrons",
            "(C) They have the same atomic size",
            "(D) They belong to the same period"
        ],
        "correctIndex": 1,
        "points": 3
    },
    {
        "id": 6,
        "topic": "Chemistry",
        "question": "What does the modern periodic law state?",
        "options": [
            "(A) Properties of elements are a function of atomic mass",
            "(B) Properties of elements depend on atomic size",
            "(C) Properties of elements are a periodic function of their atomic number",
            "(D) Properties of elements depend on valency"
        ],
        "correctIndex": 2,
        "points": 3
    },
    {
        "id": 7,
        "topic": "Chemistry",
        "question": "What was one limitation of Mendeleev’s periodic table?",
        "options": [
            "(A) Groups were not present",
            "(B) Periods were not present",
            "(C) Atomic number was not considered",
            "(D) Noble gases were not included"
        ],
        "correctIndex": 2,
        "points": 3
    },
    {
        "id": 8,
        "topic": "Chemistry",
        "question": "What is one difference between a group and a period in the periodic table?",
        "options": [
            "(A) A group is horizontal and a period is vertical",
            "(B) Both group and period are horizontal",
            "(C) A group is a vertical column and a period is a horizontal row",
            "(D) Groups contain only metals"
        ],
        "correctIndex": 2,
        "points": 3
    },
    {
        "id": 9,
        "topic": "Chemistry",
        "question": "What is the relationship between valency and group number?",
        "options": [
            "(A) Elements of the same group have the same valency",
            "(B) Valency is always greater than the group number",
            "(C) Valency depends on the period number",
            "(D) There is no relation"
        ],
        "correctIndex": 0,
        "points": 3
    },
    {
        "id": 10,
        "topic": "Chemistry",
        "question": "Why do lithium and sodium have similar properties?",
        "options": [
            "(A) Both are non-metals",
            "(B) Both have the same atomic mass",
            "(C) Both have one electron in their valence shell",
            "(D) Both belong to the same period"
        ],
        "correctIndex": 2,
        "points": 3
    },
    {
        "id": 11,
        "topic": "Chemistry",
        "question": "Why does atomic radius increase on moving down a group?",
        "options": [
            "(A) Nuclear charge decreases",
            "(B) New electron shells are added",
            "(C) Valency increases",
            "(D) Number of electrons decreases"
        ],
        "correctIndex": 1,
        "points": 4
    },
    {
        "id": 12,
        "topic": "Chemistry",
        "question": "Why does electronegativity increase across a period?",
        "options": [
            "(A) Due to increase in atomic size",
            "(B) Due to increase in effective nuclear charge",
            "(C) Due to decrease in valency",
            "(D) Due to addition of new shells"
        ],
        "correctIndex": 1,
        "points": 4
    },
    {
        "id": 13,
        "topic": "Chemistry",
        "question": "Why is hydrogen not placed with alkali metals in the periodic table?",
        "options": [
            "(A) Because hydrogen is a metal",
            "(B) Because hydrogen has a high atomic number",
            "(C) Because hydrogen is a non-metal and has different properties",
            "(D) Because hydrogen is a noble gas"
        ],
        "correctIndex": 2,
        "points": 4
    },
    {
        "id": 14,
        "topic": "Chemistry",
        "question": "What are the group and period of the element with atomic number 17?",
        "options": [
            "(A) Group 16, Period 3",
            "(B) Group 17, Period 2",
            "(C) Group 17, Period 3",
            "(D) Group 18, Period 3"
        ],
        "correctIndex": 2,
        "points": 5
    },
    {
        "id": 15,
        "topic": "Chemistry",
        "question": "What is the nature of an element with electronic configuration 2,8,3?",
        "options": [
            "(A) Non-metal",
            "(B) Metalloid",
            "(C) Metal",
            "(D) Noble gas"
        ],
        "correctIndex": 2,
        "points": 5
    }
];

const a3 = [1, 2, 1, 1, 1, 2, 2, 2, 0, 2, 1, 1, 2, 2, 2];


// Combine and flatten questions with their answers
const q1WithAnswers = q1.map((q, i) => ({ ...q, answer: a1[i] }));
const q2WithAnswers = q2.map((q, i) => ({ ...q, answer: a2[i] }));
const q3WithAnswers = q3.map((q, i) => ({ ...q, answer: q.correctIndex !== undefined ? q.correctIndex : a3[i] }));

// ======================================================
// ADD NEW QUESTIONS HERE
// ======================================================
const newQuestions = [
    // Example Format:
    /*
    {
        question: "What is 2 + 2?",
        options: ["(A) 3", "(B) 4", "(C) 5", "(D) 6"],
        answer: 1, // Index of correct option (0 = A, 1 = B, etc.)
        points: 4
    },
    */
];

export default [
    ...q1WithAnswers,
    ...q2WithAnswers,
    ...q3WithAnswers,
    ...newQuestions
];