/*****************************
 * READ ME FIRST
 * 
 * HYPOTHESIS: Base on your requirement
 * There are no lines or Edges for showing the relationship between Nodes
 * And the input just like an Array, therefore I make the assumption that:
 * 
 * 1. The first Element on Array is a Root. And Root is 1 Element
 * 2. The next Line (next generation) has the number of elements as double of the previous
 * 
 * All The Assumption in the upon lines are base on the Image in your Mail, I don't have any information in order to make relationship,
 * therefore this is the way I can do
 * 
 *******************************/
const body = document.getElementById('body');

const numberOfNodes = document.getElementById('numberOfNodes');
const resultElement = document.getElementById('result');
const generatedElement = document.getElementById('generated');
const totalElement = document.getElementById('total');
const minNodes = 1;
const maxNodes = 10000;
const grandParents = new Map();

var numberGenerations = 0;

// register Event on changes
numberOfNodes.addEventListener('change', (evt) => {
    const allNodes = numberOfNodes.value;
    numberGenerations = 0;
    grandParent = new Map();

    if (allNodes < minNodes || allNodes > maxNodes) {
        alert('Out of Range :D')
        return;
    }

    // there are no Grand Parent for calculator that's base on the hypothesis
    if (allNodes < 4) {
        alert('There are no Grand Child base on Rules')
        resultElement.innerHTML = 0;
        return;
    }

    // get Array of Nodes
    const nodes = generateNodeValue(allNodes);

    totalElement.innerHTML = `<span> Total: </span> ${ nodes.join('  --  ') }`;

    sumChildOfPositiveGrandParent(nodes);

})

/**
 * this is generate auto Node Value
 * Return Array of Node's Value
 * [6, 7, 8, 2, 7, 1, 3, 9, null, 1, 4, null, null, null, 5]
 * @param {number} nodes number of Nodes
 */
function generateNodeValue(numberOfNodes) {
    // base on number of nodes and get random value
    let generation = 0;
    let mem = 1;
    let elementMap = [];
    const map = [];

    for (let index = 0; index < numberOfNodes; index++) {
        const nodeValue = Math.round((Math.random(0) * 100) + 1);
        const numberMems = 2 ** generation;

        elementMap.push(nodeValue);

        if (nodeValue && isPositive(nodeValue)) {
            const value = grandParents[generation];

            if (value && value.length) {
                value.push({ index: index, genIndex: mem - 1, value: nodeValue });
                grandParents[generation] = value;
            } else {
                grandParents[generation] = [{ index: index, genIndex: mem - 1, value: nodeValue }];
            }
        }

        mem++;
        if (mem > numberMems) {
            // display on html
            const div = document.createElement('div');
            div.innerHTML = `<span>Generation ${generation}:</span> <span> ${elementMap.join(' --- ')} </span>`
            generatedElement.appendChild(div);
            elementMap = [];

            // for calculate
            generation++;
            mem = 1;
        }

        map.push(nodeValue);
    }

    numberGenerations = generation;
    return map;
}

/**
 * Sum number of child that children of positive grand parent
 * base on Rules in Hypothesis for know what node is child.
 * 
 * @param {Array<number>} nodes Array of Value that's Node Have
 */
function sumChildOfPositiveGrandParent(nodes) {
    let sum = 0;

    // There are no Positive number -> return default sum as 0
    if (!grandParents[0]) {
        return sum;
    }

    // start from 0
    let generation = 2;

    // start with the third generation
    for (let index = 3; index < nodes.length; index++) {
        // base on the Hypothesis the generation start from index to last index.
        const lastIndex = 2 * index;

        // content here
        const indexGrandParent = generation - 2;
        const grandPositive = grandParents[indexGrandParent];
        // There are no positive GrandParent
        if (!grandPositive || (grandPositive && !grandPositive.length)) {
            // go to next generation
            generation++;
            index = lastIndex;
            continue;
        }

        grandPositive.map(grand => {
            const { index, genIndex, value } = grand;
            // one Grand has 4 grand child
            const firstGrandChildIndex = index + (2 ** (generation - 1)) + (genIndex * 4) + ((2 ** (generation - 2) - genIndex));
            const firstGrandChild = nodes[firstGrandChildIndex] ? nodes[firstGrandChildIndex] : 0;
            const secondGrandChild = nodes[firstGrandChildIndex + 1] ? nodes[firstGrandChildIndex + 1] : 0;
            const thirdGrandChild = nodes[firstGrandChildIndex + 2] ? nodes[firstGrandChildIndex + 2] : 0;
            const fourthGrandChild = nodes[firstGrandChildIndex + 3] ? nodes[firstGrandChildIndex + 3] : 0;

            sum += (firstGrandChild + secondGrandChild + thirdGrandChild + fourthGrandChild);
        })


        // go to next generation
        generation++;
        index = lastIndex;
    }

    resultElement.innerText = `Result: ${sum}`;
    return sum;
}

/**
 * return Boolean; is Positive or not
 * 
 * @param {number} value value of Node
 */
function isPositive(value) {
    return value % 2 === 0;
}