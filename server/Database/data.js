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
        id: 1,
        topic: "Circadian Rhythm",
        question: "What controls the sleep–wake cycle in humans?",
        options: [
            "(A) Heart rhythm", "(B) Circadian rhythm", "(C) Digestive cycle", "(D) Blood pressure", "(E) Respiratory rhythm"
        ],
        correctIndex: 1,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 2,
        topic: "Circadian Rhythm",
        question: "The circadian rhythm follows approximately how many hours?",
        options: [
            "(A) 12 hours", "(B) 18 hours", "(C) 24 hours", "(D) 36 hours", "(E) 48 hours"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 3,
        topic: "Circadian Rhythm",
        question: "Which hormone increases at night to induce sleep?",
        options: [
            "(A) Adrenaline", "(B) Insulin", "(C) Melatonin", "(D) Thyroxine", "(E) Cortisol"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 4,
        topic: "Circadian Rhythm",
        question: "Which factor most strongly affects circadian rhythm?",
        options: [
            "(A) Sound", "(B) Temperature", "(C) Light", "(D) Food", "(E) Exercise"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 5,
        topic: "Circadian Rhythm",
        question: "Exposure to bright light at night mainly affects which hormone?",
        options: [
            "(A) Insulin", "(B) Melatonin", "(C) Estrogen", "(D) Testosterone", "(E) Growth hormone"
        ],
        correctIndex: 1,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 6,
        topic: "Circadian Rhythm",
        question: "Which organ controls the circadian rhythm?",
        options: [
            "(A) Heart", "(B) Liver", "(C) Brain", "(D) Kidney", "(E) Lungs"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 7,
        topic: "Circadian Rhythm",
        question: "Which part of the brain regulates circadian rhythm?",
        options: [
            "(A) Cerebellum", "(B) Hypothalamus", "(C) Medulla", "(D) Pons", "(E) Thalamus"
        ],
        correctIndex: 1,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 8,
        topic: "Circadian Rhythm",
        question: "Irregular sleep timings mainly disturb which system?",
        options: [
            "(A) Digestive", "(B) Nervous", "(C) Circadian", "(D) Respiratory", "(E) Muscular"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 9,
        topic: "Circadian Rhythm",
        question: "Jet lag is caused due to disruption of?",
        options: [
            "(A) Heart rhythm", "(B) Respiratory rhythm", "(C) Circadian rhythm", "(D) Blood flow", "(E) Digestion"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 10,
        topic: "Circadian Rhythm",
        question: "Which light helps reset circadian rhythm naturally?",
        options: [
            "(A) Blue light", "(B) Red light", "(C) Morning sunlight", "(D) Tube light", "(E) Candle light"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 11,
        topic: "Circadian Rhythm",
        question: "Using mobile phones before sleep mainly affects?",
        options: [
            "(A) Vision", "(B) Hearing", "(C) Circadian rhythm", "(D) Memory", "(E) Digestion"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 12,
        topic: "Circadian Rhythm",
        question: "Melatonin is released by which gland?",
        options: [
            "(A) Pituitary", "(B) Thyroid", "(C) Pineal", "(D) Adrenal", "(E) Pancreas"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 13,
        topic: "Circadian Rhythm",
        question: "Which habit improves circadian rhythm?",
        options: [
            "(A) Late-night meals", "(B) Irregular sleep", "(C) Consistent sleep time", "(D) Night screen use", "(E) Caffeine at night"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 14,
        topic: "Circadian Rhythm",
        question: "Circadian rhythm disruption can cause?",
        options: [
            "(A) Better sleep", "(B) Insomnia", "(C) Improved focus", "(D) Faster digestion", "(E) Stronger immunity"
        ],
        correctIndex: 1,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 15,
        topic: "Circadian Rhythm",
        question: "Which worker is most affected by circadian rhythm disturbance?",
        options: [
            "(A) Day-shift worker", "(B) Night-shift worker", "(C) Student", "(D) Athlete", "(E) Teacher"
        ],
        correctIndex: 1,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 16,
        topic: "Circadian Rhythm",
        question: "Caffeine late at night affects sleep by blocking?",
        options: [
            "(A) Melatonin", "(B) Insulin", "(C) Serotonin", "(D) Adrenaline", "(E) Dopamine"
        ],
        correctIndex: 0,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 17,
        topic: "Circadian Rhythm",
        question: "The internal biological clock is also called?",
        options: [
            "(A) Pulse clock", "(B) Heart clock", "(C) Biological clock", "(D) Brain timer", "(E) Sleep counter"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 18,
        topic: "Circadian Rhythm",
        question: "Which age group commonly faces circadian rhythm delay?",
        options: [
            "(A) Infants", "(B) Children", "(C) Teenagers", "(D) Adults", "(E) Elderly"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 19,
        topic: "Circadian Rhythm",
        question: "Blue light mainly comes from?",
        options: [
            "(A) Sunset", "(B) Mobile screens", "(C) Moonlight", "(D) Candle", "(E) Bulb filament"
        ],
        correctIndex: 1,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 20,
        topic: "Circadian Rhythm",
        question: "Best time to sleep for healthy circadian rhythm?",
        options: [
            "(A) After midnight", "(B) Early morning", "(C) Late night", "(D) Consistent night time", "(E) Any time"
        ],
        correctIndex: 3,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 21,
        topic: "Circadian Rhythm",
        question: "Circadian rhythm also affects?",
        options: [
            "(A) Sleep only", "(B) Digestion only", "(C) Hormones and sleep", "(D) Hearing", "(E) Vision"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 22,
        topic: "Circadian Rhythm",
        question: "Which activity should be avoided before sleep?",
        options: [
            "(A) Reading", "(B) Meditation", "(C) Heavy screen use", "(D) Light stretching", "(E) Dim lights"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 23,
        topic: "Circadian Rhythm",
        question: "Waking up at the same time daily helps?",
        options: [
            "(A) Digestion", "(B) Heart rate", "(C) Circadian rhythm", "(D) Blood sugar", "(E) Muscle growth"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 24,
        topic: "Circadian Rhythm",
        question: "Which hormone increases in early morning?",
        options: [
            "(A) Melatonin", "(B) Cortisol", "(C) Insulin", "(D) Estrogen", "(E) Progesterone"
        ],
        correctIndex: 1,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 25,
        topic: "Circadian Rhythm",
        question: "Which lifestyle factor worsens circadian rhythm?",
        options: [
            "(A) Morning walk", "(B) Sunlight exposure", "(C) Late-night scrolling", "(D) Fixed sleep time", "(E) Exercise"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 26,
        topic: "Circadian Rhythm",
        question: "Circadian rhythm disruption may lead to?",
        options: [
            "(A) Obesity", "(B) Diabetes", "(C) Mood issues", "(D) All of these", "(E) None"
        ],
        correctIndex: 3,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 27,
        topic: "Circadian Rhythm",
        question: "Which sense detects light to regulate circadian rhythm?",
        options: [
            "(A) Ear", "(B) Skin", "(C) Eyes", "(D) Nose", "(E) Tongue"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 28,
        topic: "Circadian Rhythm",
        question: "Sleeping during the day and staying awake at night causes?",
        options: [
            "(A) Balanced rhythm", "(B) Circadian misalignment", "(C) Better focus", "(D) Faster recovery", "(E) No effect"
        ],
        correctIndex: 1,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 29,
        topic: "Circadian Rhythm",
        question: "Which vitamin is linked with sunlight exposure?",
        options: [
            "(A) Vitamin A", "(B) Vitamin B", "(C) Vitamin C", "(D) Vitamin D", "(E) Vitamin K"
        ],
        correctIndex: 3,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 30,
        topic: "Circadian Rhythm",
        question: "Natural circadian rhythm is aligned with?",
        options: [
            "(A) Clock time", "(B) Sun cycle", "(C) Food time", "(D) Work time", "(E) Screen time"
        ],
        correctIndex: 1,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 31,
        topic: "Circadian Rhythm",
        question: "Which habit helps reset circadian rhythm fastest?",
        options: [
            "(A) Night workouts", "(B) Morning sunlight", "(C) Late dinners", "(D) Midnight snacks", "(E) Blue light"
        ],
        correctIndex: 1,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 32,
        topic: "Circadian Rhythm",
        question: "Circadian rhythm is an example of?",
        options: [
            "(A) Reflex action", "(B) Biological rhythm", "(C) Voluntary action", "(D) Hormonal disorder", "(E) Nerve impulse"
        ],
        correctIndex: 1,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 33,
        topic: "Circadian Rhythm",
        question: "Which system mainly coordinates circadian rhythm?",
        options: [
            "(A) Digestive", "(B) Respiratory", "(C) Nervous", "(D) Excretory", "(E) Skeletal"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 34,
        topic: "Circadian Rhythm",
        question: "Poor circadian rhythm can affect mental health?",
        options: [
            "(A) Yes", "(B) No", "(C) Only children", "(D) Only elderly", "(E) Only athletes"
        ],
        correctIndex: 0,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 35,
        topic: "Circadian Rhythm",
        question: "Which is NOT controlled by circadian rhythm?",
        options: [
            "(A) Sleep", "(B) Hormones", "(C) Body temperature", "(D) Heartbeat", "(E) Alertness"
        ],
        correctIndex: 3,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 36,
        topic: "Circadian Rhythm",
        question: "Late-night eating affects circadian rhythm by?",
        options: [
            "(A) Improving sleep", "(B) Delaying internal clock", "(C) Increasing melatonin", "(D) Reducing stress", "(E) No effect"
        ],
        correctIndex: 1,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 37,
        topic: "Circadian Rhythm",
        question: "Which is a sign of circadian rhythm disorder?",
        options: [
            "(A) Deep sleep", "(B) Early sleepiness", "(C) Difficulty sleeping at night", "(D) High energy", "(E) Good focus"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 38,
        topic: "Circadian Rhythm",
        question: "Which device emits maximum blue light?",
        options: [
            "(A) TV", "(B) Laptop", "(C) Mobile phone", "(D) Bulb", "(E) Candle"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 39,
        topic: "Circadian Rhythm",
        question: "Which sleep habit is healthiest?",
        options: [
            "(A) Random sleep time", "(B) Fixed sleep-wake time", "(C) Late sleep", "(D) Day sleep", "(E) Split sleep"
        ],
        correctIndex: 1,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 40,
        topic: "Circadian Rhythm",
        question: "Circadian rhythm disruption increases risk of?",
        options: [
            "(A) Better memory", "(B) Chronic diseases", "(C) Faster growth", "(D) Stronger immunity", "(E) None"
        ],
        correctIndex: 1,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 41,
        topic: "Circadian Rhythm",
        question: "Which hormone decreases in daylight?",
        options: [
            "(A) Cortisol", "(B) Insulin", "(C) Melatonin", "(D) Adrenaline", "(E) Growth hormone"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 42,
        topic: "Circadian Rhythm",
        question: "The body clock responds directly to?",
        options: [
            "(A) Sound waves", "(B) Light signals", "(C) Smell", "(D) Taste", "(E) Touch"
        ],
        correctIndex: 1,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 43,
        topic: "Circadian Rhythm",
        question: "Best way to improve sleep naturally?",
        options: [
            "(A) Sleeping pills", "(B) Consistent routine", "(C) Late workouts", "(D) Heavy meals", "(E) Screen time"
        ],
        correctIndex: 1,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 44,
        topic: "Circadian Rhythm",
        question: "Which job often disrupts circadian rhythm?",
        options: [
            "(A) Teacher", "(B) Farmer", "(C) Night guard", "(D) Doctor (day)", "(E) Shopkeeper"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 45,
        topic: "Circadian Rhythm",
        question: "Circadian rhythm is synchronized mainly by?",
        options: [
            "(A) Food", "(B) Exercise", "(C) Light", "(D) Water", "(E) Sound"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 46,
        topic: "Circadian Rhythm",
        question: "Which activity delays melatonin release?",
        options: [
            "(A) Reading", "(B) Meditation", "(C) Screen exposure", "(D) Warm bath", "(E) Dark room"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 47,
        topic: "Circadian Rhythm",
        question: "Sleep disorders due to circadian issues are called?",
        options: [
            "(A) Insomnia", "(B) Parasomnia", "(C) Circadian rhythm disorders", "(D) Narcolepsy", "(E) Apnea"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 48,
        topic: "Circadian Rhythm",
        question: "Which age group needs most sleep?",
        options: [
            "(A) Adults", "(B) Teenagers", "(C) Elderly", "(D) Children", "(E) Middle-aged"
        ],
        correctIndex: 3,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 49,
        topic: "Circadian Rhythm",
        question: "Which factor does NOT reset circadian rhythm?",
        options: [
            "(A) Sunlight", "(B) Sleep time", "(C) Meals", "(D) Mobile games", "(E) Routine"
        ],
        correctIndex: 3,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 50,
        topic: "Circadian Rhythm",
        question: "Best sleep environment includes?",
        options: [
            "(A) Bright lights", "(B) Noisy room", "(C) Dark and quiet room", "(D) Warm screens", "(E) Late meals"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 51,
        topic: "Circadian Rhythm",
        question: "Circadian rhythm also affects body temperature?",
        options: [
            "(A) Yes", "(B) No", "(C) Only in winter", "(D) Only in summer", "(E) Only children"
        ],
        correctIndex: 0,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 52,
        topic: "Circadian Rhythm",
        question: "Which hormone peaks at night?",
        options: [
            "(A) Cortisol", "(B) Insulin", "(C) Melatonin", "(D) Adrenaline", "(E) Glucagon"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 53,
        topic: "Circadian Rhythm",
        question: "Which habit helps deep sleep?",
        options: [
            "(A) Late caffeine", "(B) Regular routine", "(C) Mobile use", "(D) Heavy dinner", "(E) Late exercise"
        ],
        correctIndex: 1,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 54,
        topic: "Circadian Rhythm",
        question: "Circadian rhythm mismatch causes daytime?",
        options: [
            "(A) Alertness", "(B) Sleepiness", "(C) Energy", "(D) Focus", "(E) Motivation"
        ],
        correctIndex: 1,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 55,
        topic: "Circadian Rhythm",
        question: "Which hormone prepares body for waking up?",
        options: [
            "(A) Melatonin", "(B) Cortisol", "(C) Estrogen", "(D) Progesterone", "(E) Oxytocin"
        ],
        correctIndex: 1,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 56,
        topic: "Circadian Rhythm",
        question: "Which sense organ sends light info to brain?",
        options: [
            "(A) Ear", "(B) Eye", "(C) Skin", "(D) Tongue", "(E) Nose"
        ],
        correctIndex: 1,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 57,
        topic: "Circadian Rhythm",
        question: "Circadian rhythm disturbance is common in?",
        options: [
            "(A) Athletes", "(B) Night-shift workers", "(C) Children", "(D) Farmers", "(E) Teachers"
        ],
        correctIndex: 1,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 58,
        topic: "Circadian Rhythm",
        question: "Which is a natural circadian cue?",
        options: [
            "(A) Alarm clock", "(B) Sunrise", "(C) Mobile notification", "(D) TV", "(E) Music"
        ],
        correctIndex: 1,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 59,
        topic: "Circadian Rhythm",
        question: "Which improves circadian alignment?",
        options: [
            "(A) Sleeping late", "(B) Skipping meals", "(C) Morning routine", "(D) Night gaming", "(E) Late workouts"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 60,
        topic: "Circadian Rhythm",
        question: "Circadian rhythm helps maintain?",
        options: [
            "(A) Biological balance", "(B) Only sleep", "(C) Only digestion", "(D) Only hormones", "(E) Only heart rate"
        ],
        correctIndex: 0,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 61,
        topic: "Circadian Rhythm",
        question: "Which hormone reduces stress in morning?",
        options: [
            "(A) Melatonin", "(B) Cortisol", "(C) Insulin", "(D) Adrenaline", "(E) Serotonin"
        ],
        correctIndex: 1,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 62,
        topic: "Circadian Rhythm",
        question: "Circadian rhythm is innate or learned?",
        options: [
            "(A) Learned", "(B) Trained", "(C) Innate", "(D) Artificial", "(E) Random"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 63,
        topic: "Circadian Rhythm",
        question: "Which habit damages circadian rhythm the most?",
        options: [
            "(A) Late-night screens", "(B) Morning walk", "(C) Fixed routine", "(D) Sunlight", "(E) Meditation"
        ],
        correctIndex: 0,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 64,
        topic: "Circadian Rhythm",
        question: "Which chemical signals sleep onset?",
        options: [
            "(A) Dopamine", "(B) Melatonin", "(C) Cortisol", "(D) Insulin", "(E) Adrenaline"
        ],
        correctIndex: 1,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 65,
        topic: "Circadian Rhythm",
        question: "Which improves sleep quality?",
        options: [
            "(A) Dark room", "(B) Bright room", "(C) Noise", "(D) Screens", "(E) Late food"
        ],
        correctIndex: 0,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 66,
        topic: "Circadian Rhythm",
        question: "Circadian rhythm is best described as?",
        options: [
            "(A) Random cycle", "(B) 24-hour biological cycle", "(C) Weekly cycle", "(D) Monthly cycle", "(E) Yearly cycle"
        ],
        correctIndex: 1,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 67,
        topic: "Circadian Rhythm",
        question: "Which hormone keeps you awake during day?",
        options: [
            "(A) Melatonin", "(B) Cortisol", "(C) Progesterone", "(D) Oxytocin", "(E) Estrogen"
        ],
        correctIndex: 1,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 68,
        topic: "Circadian Rhythm",
        question: "Which behavior aligns circadian rhythm?",
        options: [
            "(A) Sleeping late daily", "(B) Random schedule", "(C) Consistent routine", "(D) Night screens", "(E) Late caffeine"
        ],
        correctIndex: 2,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 69,
        topic: "Circadian Rhythm",
        question: "Circadian rhythm disruption can affect productivity?",
        options: [
            "(A) Yes", "(B) No", "(C) Only students", "(D) Only workers", "(E) Only elderly"
        ],
        correctIndex: 0,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
    {
        id: 70,
        topic: "Circadian Rhythm",
        question: "Best natural way to reset circadian rhythm?",
        options: [
            "(A) Sleeping pills", "(B) Morning sunlight", "(C) Late workouts", "(D) Night screens", "(E) Heavy meals"
        ],
        correctIndex: 1,
        points: 4,
        explanation: "",
        questionImage: "",
        optionImages: []
    },
];

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