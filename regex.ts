import { isClassStaticBlockDeclaration } from "../../node_modules/typescript/lib/typescript";

let message: string = 'Hello World';
console.log (message);



interface Operator {
    precd: number,
    astv: string,
    arity: number,
}

const OPS: Record<string, Operator> = {
    ['|']: { precd: 1, astv: "left", arity: 2},
    ['*']: { precd: 3, astv: "right", arity: 1},
    ['&']: { precd: 2, astv: "right", arity: 2},
    
}
const infixToPostfix = function(str: string) : string {
	
    const opCompare = function(opStr1: string, opStr2: string) : number {
    	return String.prototype.localeCompare.call(OPS[opStr1].precd, OPS[opStr2].precd); 
    }

    const outQueue: string[] = [];
    const opStack : string[] = []; 
    
    const getStackTop = function() : string {
        return opStack[opStack.length - 1];
    }

    const shouldReduceOp = function(op: string) : boolean {
    	const top: string = getStackTop();
        if (!top || top == '(') return false;
        const order: number = opCompare(top, op);
        return  (order == 1 || order == 0 && OPS[op].astv == "left");
    }
    
    const shouldReduceParen = function() : boolean {
    	return getStackTop() != '(';
    }
    // added expresion end met
    let expressionEndMet = false;
    str.split('').forEach(char => {
        switch (char) {
            case '|': case '*':
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
                if (expressionEndMet) opStack.push('&');
                expressionEndMet = true;
        }
    });
    
    let op;
    while (op = opStack.pop()) outQueue.unshift(op);
	return outQueue.reverse().join('');
}

interface ExprTree<O, S> /* operator, symbol */ {
    els: (S | ExprTree<O, S>)[],
    op: O,
}

const postfixToTree = function(str: String, tr: ExprTree<string, string> = {els: [], op: '&'}) : ExprTree<string, string> {
    const arr: string[] = str.split('');
    const stack: (string | ExprTree<string, string>)[] = [];

    const isOp = (char: string): boolean => Object.keys(OPS).indexOf(char) >= 0;
    arr.forEach(char => {
        if (isOp(char)) {
            let arity = OPS[char].arity;
            let newTr = {
                op: char,
                els: stack.splice(-arity),
            };
            stack.push(newTr);
        } else {
            stack.push(char);
        }
    });
    let end = stack[0];
    if (typeof end == "string") {
        throw new Error('tree parsed incorrectly');
    }
    return end;
}

const treeToStateList = function(tree: ExprTree<string, string>| string) : string[] {
    if (typeof tree == "string") return [tree];
    switch (tree.op) {
        case '|':
            return [
                "open OR state",
                ... treeToStateList(tree.els[0]),
                ... treeToStateList(tree.els[1]),
                "close OR state",
            ]; 
        case '*':
            return [
                "open kleine star",
                ... treeToStateList(tree.els[0]),
                "close kleine star",
            ];
        case '&':
            return [
                ... treeToStateList(tree.els[0]),
                ... treeToStateList(tree.els[1]),
            ];
        default: break;
    }   
}
let str = "(1|2*|34)|3|(12|3)";
let fixed = infixToPostfix(str);
let tree = postfixToTree(fixed);
let arr = treeToStateList(tree);
console.log(fixed);
console.log(tree);
console.log(arr);
