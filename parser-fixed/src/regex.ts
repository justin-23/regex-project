import { NFA } from './nfa';

interface Operator {
    precd: number,
    astv: string,
    arity: number,
}

const OPS: Record<string, Operator> = {
    ['|']: { precd: 1, astv: "left", arity: 2},
    ['*']: { precd: 4, astv: "right", arity: 1},
    ['&']: { precd: 2, astv: "right", arity: 2},
    ['?']: { precd: 3, astv: "left", arity: 1},
    ['+']: { precd: 3, astv: "left", arity: 1},
    
}

//converts regex format from infix to postfix
//ex. a|b -> ab|
const infixToPostfix = function(str: string) : string {
	
    const opCompare = function(opStr1: string, opStr2: string) : number {
    	return String.prototype.localeCompare.call(OPS[opStr1].precd, ""+OPS[opStr2].precd); 
    }

    const outQueue: string[] = [];
    const opStack : string[] = []; 
    
    const getStackTop = function() : string {
        return opStack[opStack.length - 1];
    }

    const shouldReduceOp = function(op: string) : boolean {
    	const top: string = getStackTop();
        if (!top || top === '(') return false;
        const order: number = opCompare(top, op);
        return  (order === 1 || (order === 0 && OPS[op].astv === "left"));
    }
    
    const shouldReduceParen = function() : boolean {
    	return getStackTop() !== '(';
    }
    // added expresion end met
    let expressionEndMetArr: boolean[] = [];
    let depth: number = 0;
    let escapehatch:number = 50;
    str.split('').forEach(char => {
        if (! escapehatch) return;
        switch (char) {
            case '*':case '?':case'+':
                outQueue.unshift('x');
                while (shouldReduceOp(char)  && escapehatch--) {
                    outQueue.unshift(opStack.pop() as string);
                }
                
                expressionEndMetArr[depth] = true;
                outQueue.unshift(char); break;
            case '|': 
                while (shouldReduceOp(char)  && escapehatch--) {
                    outQueue.unshift(opStack.pop() as string);
                }
                expressionEndMetArr[depth] = false;
                opStack.push(char);
                break;
            case '(':
                opStack.push(char);
                
                depth++;
                expressionEndMetArr[depth] = false;
                
                break;
            case ')':
                while (shouldReduceParen() && escapehatch--) {
                    outQueue.unshift(opStack.pop() as string);
                }
                depth--;

                opStack.pop();
                
                if (expressionEndMetArr[depth]) opStack.push('&');
                expressionEndMetArr[depth] = true;
                
                break;
            default:
                outQueue.unshift(char);
                //if (getStackTop() === '*' || getStackTop() === '?') outQueue.unshift(opStack.pop() as string);
                if (expressionEndMetArr[depth]) opStack.push('&');
                expressionEndMetArr[depth] = true;
        }
    });

    if (! escapehatch) return "";
    let op;
    while (op = opStack.pop()) outQueue.unshift(op);
	return outQueue.reverse().join('');
}

interface ExprTree<O, S> /* operator, symbol */ {
    els: (S | ExprTree<O, S>)[],
    op: O,
}

//converts from a postfix regex to an expression tree
const postfixToTree = function(str: String, tr: ExprTree<string, string> = {els: [], op: '&'}) : ExprTree<string, string> | string {
    const arr: string[] = str.split('');
    const stack: (string | ExprTree<string, string>)[] = [];

    const isOp = (char: string): boolean => Object.keys(OPS).indexOf(char) >= 0;
    arr.forEach(char => {
        if (isOp(char)) {
            //let arity = OPS[char].arity;
            let newTr = {
                op: char,
                els: stack.splice(-2/*arity*/),
            };
            stack.push(newTr);
        } else {
            stack.push(char);
        }
    });
    let end = stack[0];
    if (typeof end == "string" && end.length > 1) {
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
        case '?':
            return NFA.maybe(treeToNFA(tree.els[0]));
        case '+':
            return NFA.some(treeToNFA(tree.els[0]));
        case '&':
            return NFA.concatenate(treeToNFA(tree.els[0]), treeToNFA(tree.els[1]));
        default: break;
    }
    return NFA.CHAR("");
}

const convertRegexToNFAFunction = function(str: string) : (str: string) => boolean {
    
    try {
        const fixed = infixToPostfix(str);
        const tree = postfixToTree(fixed);
        const nfa = treeToNFA(tree);
        console.log({fixed, tree, nfa});
        nfa.fixEpsilonClosure();
        return nfa.eval.bind(nfa);
    } catch (e) {
        return (s: string) => false;
    }
}
export {
    convertRegexToNFAFunction,
}