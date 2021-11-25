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

//converts regex format from infix to postfix
//ex. a|b -> ab|
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

//converts from a postfix regex to an expression tree
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

/*const treeToStateList = function(tree: ExprTree<string, string>| string) : string[] {
    if (typeof tree == "string") return [tree];
    switch (tree.op) {
        case '|':
            return [
                "open OR state",
                ... treeToStateList(tree.els[0]),
                "break OR state",
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
}*/

/*const findCloseState = function(arr: string[]) : [number, number] {

    const stack: string[] = [];

    if(arr[0] === "open OR state"){

        let brk: number;
        
        for(let i = 0; i < arr.length; i++){

            if(arr[i].length > 1){
                if(arr[i] === "close kleiene star"){
                    if(stack.pop() !== "open kleiene star"){
                        return [-1, -1];
                    }
                }
                else if(arr[i] === "break OR state"){
                    if(stack.pop() !== "open OR state"){
                        return [-1, -1];
                    }
                    if(stack.length == 0){
                        brk = i;
                    }
                    stack.push(arr[i]);
                }
                else if(arr[i] === "close OR state"){
                    if(stack.pop() !== "break OR state"){
                        return [-1, -1];
                    }
                }
                else{
                    stack.push(arr[i]);
                }
            }

            if(stack.length == 0){
                return [i, brk];
            }
        }
    }

    for(let i = 0; i < arr.length; i++){
        if(arr[i].length > 1){
            if(arr[i] === "close kleiene star"){
                if(stack.pop() !== "open kleiene star"){
                    return [-1, -1];
                }
            }
            else if(arr[i] === "break OR state"){
                if(stack.pop() !== "open OR state"){
                    return [-1, -1];
                }
                stack.push(arr[i]);
            }
            else if(arr[i] === "close OR state"){
                if(stack.pop() !== "break OR state"){
                    return [-1, -1];
                }
            }
            else{
                stack.push(arr[i]);
            }
        }

        if(stack.length == 0){
            return [i, -1];
        }
    }
}*/

/*const stateListToNFA = function(arr: string[]) : NFA {
    if(arr.length == 0){
        return NFA.CHAR('');
    }
    if(arr[0].length > 1){
        const [a, b] = findCloseState(arr);
        if(b == -1){
            return NFA.concatenate(NFA.star(stateListToNFA(arr.slice(1, a))), stateListToNFA(arr.slice(a+1)));
        }
        return NFA.concatenate(NFA.union(stateListToNFA(arr.slice(1, b)), stateListToNFA(arr.slice(b+1, a))), stateListToNFA(arr.slice(a+1)));;
    }
    return NFA.concatenate(NFA.CHAR(arr[0]), stateListToNFA(arr.slice(1)));
}*/

/*class NFA_{
    s: string;

    constructor(c: string){
        this.s = c;
    }

    static union(a: NFA_, b: NFA_){
        return new NFA_("(" + a.s + ")|(" + b.s + ")");
    }

    static concatenate(a: NFA_, b: NFA_){
        return new NFA_("(" + a.s + ")&(" + b.s + ")");
    }

    static star(a: NFA_){
        return new NFA_("(" + a.s + ")*");
    }

}*/

const treeToNFA = function(tree: ExprTree<string, string>| string) : NFA {
    if (typeof tree == "string") return NFA.CHAR(tree);
    switch (tree.op) {
        case '|':
            return NFA.union(treeToNFA(tree.els[0]), treeToNFA(tree.els[1]));
        case '*':
            return NFA.star(treeToNFA(tree.els[0]));
        case '&':
            return NFA.concatenate(treeToNFA(tree.els[0]), treeToNFA(tree.els[1]));
        default: break;
    }
}

let str = "(1|2*|34)|3|(12|3)";
let fixed = infixToPostfix(str);
let tree = postfixToTree(fixed);
let nfa = treeToNFA(tree);
//let arr = treeToStateList(tree);

console.log(str);
console.log(fixed);
console.log(tree);
//console.log(arr);
