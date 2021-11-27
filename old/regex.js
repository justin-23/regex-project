const OPS = {
    ['|']: { precd: 1, astv: "left", arity: 2 },
    ['*']: { precd: 3, astv: "right", arity: 1 },
    ['&']: { precd: 2, astv: "right", arity: 2 },
};
const infixToPostfix = function (str) {
    const opCompare = function (opStr1, opStr2) {
        return String.prototype.localeCompare.call(OPS[opStr1].precd, OPS[opStr2].precd);
    };
    const outQueue = [];
    const opStack = [];
    const getStackTop = function () {
        return opStack[opStack.length - 1];
    };
    const shouldReduceOp = function (op) {
        const top = getStackTop();
        if (!top || top == '(')
            return false;
        const order = opCompare(top, op);
        return (order == 1 || order == 0 && OPS[op].astv == "left");
    };
    const shouldReduceParen = function () {
        return getStackTop() != '(';
    };
    // added expresion end met
    let expressionEndMet = false;
    str.split('').forEach(char => {
        switch (char) {
            case '|':
            case '*':
                while (shouldReduceOp(char)) {
                    outQueue.unshift(opStack.pop());
                }
                expressionEndMet = false;
                opStack.push(char);
                break;
            case '(':
                opStack.push(char);
                expressionEndMet = false;
                break;
            case ')':
                while (shouldReduceParen()) {
                    outQueue.unshift(opStack.pop());
                }
                opStack.pop();
                break;
            default:
                outQueue.unshift(char);
                if (expressionEndMet)
                    opStack.push('&');
                expressionEndMet = true;
        }
    });
    let op;
    while (op = opStack.pop())
        outQueue.unshift(op);
    return outQueue.reverse().join('');
};
const postfixToTree = function (str, tr = { els: [], op: '&' }) {
    const arr = str.split('');
    const stack = [];
    const isOp = (char) => Object.keys(OPS).indexOf(char) >= 0;
    arr.forEach(char => {
        if (isOp(char)) {
            let arity = OPS[char].arity;
            let newTr = {
                op: char,
                els: stack.splice(-arity),
            };
            stack.push(newTr);
        }
        else {
            stack.push(char);
        }
    });
    let end = stack[0];
    if (typeof end == "string") {
        throw new Error('tree parsed incorrectly');
    }
    return end;
};
const treeToStateList = function (tree) {
    if (typeof tree == "string")
        return [tree];
    switch (tree.op) {
        case '|':
            return [
                "open OR state",
                ...treeToStateList(tree.els[0]),
                ...treeToStateList(tree.els[1]),
                "close OR state",
            ];
        case '*':
            return [
                "open kleine star",
                ...treeToStateList(tree.els[0]),
                "close kleine star",
            ];
        case '&':
            return [
                ...treeToStateList(tree.els[0]),
                ...treeToStateList(tree.els[1]),
            ];
        default: break;
    }
};
let str = "(1|2*|34)|3|(12|3)";
let fixed = infixToPostfix(str);
let tree = postfixToTree(fixed);
let arr = treeToStateList(tree);
console.log(fixed);
console.log(tree);
console.log(arr);
//# sourceMappingURL=regex.js.map