// Author justin lee oct nov 2021
// recommented nov 2021 to add more expanation
interface Array<T> {
    deepReverse(): Array<T>;
    unique(): Array<T>;
}

Array.prototype.unique = function() : Array<any> {
    return [... new Set(this)];
    // only works for primitives
}
Array.prototype.deepReverse = function() {
    return this.reverse().map(function(el: any) {
        if (Array.isArray(el)) return el.deepReverse();
        return el;
    })
}

interface Object {
    complexMap<T, Q>(f: (value: T, key?: string | number | symbol, index?: number) => Q) : Record<any, any>;
}

Object.prototype.complexMap = function<T, Q>( f: (value: T, key?: string | number | symbol, index?: number) => Q) : Record<any, Q> {

    let obj: Record<any, Q> = {}; let i = 0;
    
    for (let [key, value] of Object.entries(this)) {
        if (!this.hasOwnProperty(key)) continue;
        obj[key] = f(value as T, key, i++);
    }

    return obj;
}

type DeltaRow = Record<string, number[]>
type Delta = DeltaRow[]; // an array of objects whos keys are strings (chars) and whos values are arrays of numbers (integers);



let testObj = {a: 3, other: 4, ok: 99};
type StructString = string | StructString[];
const fixParen = function(arr: StructString[], depths: number[] = []) : StructString[] {

    let empty = depths.length == 0;
    console.log({
        toRead: arr[0],
        depths: empty ? 'empty' : depths.join(', '),
    });

    let newArr: StructString = [];
    if (depths[0] == 0) {
        depths.shift();
        arr.unshift('(');
        }    //return newArr;
    if (!arr[0]) return [];
    let el: StructString = arr.shift() as StructString; 
    
    switch (el) {
        case ')': case undefined: 
            //if (!empty) {
               // depths[0]--; 
                arr.unshift('(');
            //}
			return newArr;
        case '(':
            //if (!empty) depths[0]++;
            newArr.push(fixParen(arr, depths)); break;            
		case '*':
            arr.unshift('#');
                    depths.push(0);
            newArr.push(fixParen(arr, depths));
     break;
        default:
            newArr.push(el);      
    }   

    return newArr.concat(fixParen(arr, depths));
}

//let str = "ab(a|b)a*ab(ab)";
//let arr = str.split('').reverse();
//let fixed = fixParen(arr);
//console.log(fixed.deepReverse());


/*enum OPS {
    STAR = '*',
    OPEN_PAREN = '(',
    CLOSE_PAREN = ')',
    OR = '|',
    EPSILON = `~`
}/*
const enum CharBrand {};
type Char = string & CharBrand;
namespace Char {
    toCharArray(string: string) : Char[]
}

*/
class Alphabet {
    private charList: string[] = [];
    
    static readonly OPS = new Set('*()|~'.split(''));

    static readonly EPSILON_CHAR = '%';
    static readonly EMPTY = new Alphabet("", false);
    static readonly EPSILON = new Alphabet("", true);

    
    constructor(chars: string, epsilon= true) {
        this.charList = (chars + Alphabet.EPSILON_CHAR)
            .split('')
            .filter(char => ! Alphabet.OPS.has(char))
            .unique();
        //if (epsilon) this.charList.push("%");
            // Get all the unique characters that aren't operators
    }


    getCharList() : string {
        return this.charList.join(''); // shallow copy because entries are primitives
    }
    debug () : void {
    	console.log(`Alphabet: '` + this.charList.join(`', '`) + `'`);
    }
    
    // so i can loop through the alphabet using for... of
    [Symbol.iterator]() {
        let i = 0, l = this.charList.length;
        return ({
            next: () => ({
                done: l == i + 1,
                value: this.charList[i++],
            })
        });
    }

    //check char presence in Alphabet.
    has (string: string) : boolean {
        if (string.length != 1) throw new Error("chars can only be of length 1");
        return this.charList.indexOf(string) >= 0;
    }

    getRowTemplate() : DeltaRow {
        return Object.fromEntries(this.charList.map(char => [char, []]));
    }

    equals (other: Alphabet) : boolean {
        return this.getCharList() == other.getCharList();
    }

    static union(a: Alphabet, b: Alphabet) : Alphabet { 
        return new Alphabet(a.getCharList() + b.getCharList());
    }
}

//const isDelta = function(arr: object[]) : arr is Delta {
 //   let 
//}





function complexMap<Q>(types: Function[], obj: any, f: Function, parents: any[] = []) : Q {
    const [thisType, ...restTypes] = types;
    console.log(thisType);
    let mapF: Function;
    switch (thisType) {
        case undefined: 
            return f(obj);
        case Array: // have got to fix
            mapF = Array.prototype.map; break;
        case Object: 
            console.log("object");
            mapF = Object.prototype.complexMap; break;
        default:
            throw new Error("encountererd an invalid type");
    }

    if (! (obj instanceof thisType)) throw new Error (`Provided object did not ascribe to given type scheme: ${typeof obj} not in ${thisType}`)
   
    console.log("mapf", mapF);

    return mapF.call(obj, (value: typeof restTypes[1], key: any) => complexMap(restTypes, value, f, [{container: obj, key}, ...parents]));

}
/*dunction getComplexMap(types: Function[], f: Function, parents: any[] = []) : Function {
    const [thisType, ...restTypes] = types;
    console.log(thisType);
    let mapF: Function;
    switch (thisType) {
        case undefined: 
            return f;
        case Array: // map and our custom map is defined on array and object types... nice :)
            mapF = Array.prototype.map; break;
        case Object: 
            console.log("object");
            mapF = Object.prototype.complexMap; break;
        default:
            throw new Error("encountererd an invalid type");
    }

    //if (! (obj instanceof thisType)) throw new Error (`Provided object did not ascribe to given type scheme: ${typeof obj} not in ${thisType}`)
   
    console.log("mapf", mapF);

    return (obj: any) => mapF.call(obj, (value: typeof restTypes[1], key: any) => complexMap(restTypes, value, f, [{container: obj, key}, ...parents]));

}*/
/*
Object.prototype.ascribeStructure = function(types: Function[]) {
    
    map: function(f: Function) {
        
    }
    return {
        thisObj: this,
        
    }
}
*/
//let m = complexMap([Object, Array], {a: [1, 2, 3, 4, 5], b: [2, 9]}, (x: any) => x*2);

//console.log(m);
//console.log([1, 2, 3])
let lastDeltaState;
class NFA {
    
    readonly size: number; 

    static readonly EPSILON = () => new NFA(Alphabet.EPSILON, [{[Alphabet.EPSILON_CHAR]: []}], 0, [0]);

    static CHAR(str: string) {
        return new NFA(new Alphabet(str), [{[str]: [1], [Alphabet.EPSILON_CHAR]: []}, {[str]: [], [Alphabet.EPSILON_CHAR]: []}], 0, [1]);
    }

    static reindexDelta(d: Delta, shiftSize: number) {
        return d.map((transitionRow: DeltaRow) => transitionRow
                .complexMap<number[], number[]>((states: number[], transitionChar) => states 
                    .map((state: number) => state + shiftSize)));
    }

    static copyDelta(d: Delta) {
        return NFA.reindexDelta(d, 0);
    }

    /*static prepareOperations(list: Record<string, NFA>) {
        const globals = Object.entries(list).reduce(function(obj, [name, thisNfa]) {
            const shift = obj.delta.length;
            return {
                sigma: Alphabet.union(obj.sigma, thisNfa.sigma),
                delta
            }
        }, {
            sigma: Alphabet.EMPTY,
            delta:[],
        });

    }*/
    static prepareOperations(a: NFA, b: NFA) {
        // Create a new alphabet, with the characters of both.
        const sigma = Alphabet.union(a.sigma, b.sigma);
        // Create an object to build off of, that looks like a row (state) of transitions.
        const deltaRowTemplate = sigma.getRowTemplate();

        // We're making an array to add them together, so we've got to shift the indices of the second set of 
        // states over
        const shiftSize = a.size;
        const bDelta = NFA.reindexDelta(b.delta, shiftSize);

        const aDelta = NFA.reindexDelta(a.delta, 0);

            // Mapping on each "from" state, then on each character, then on each "to" state, to adjust
            // state values by the shiftSize
           
        return {
            sigma,
            deltaRowTemplate,
            shiftSize,
            aDelta,
            bDelta,
           // bStartShifted
        }
    }
    static union(a: NFA, b: NFA) : NFA {
        
        const {sigma, deltaRowTemplate, shiftSize, aDelta, bDelta} = NFA.prepareOperations(a, b);

        const bAcceptShifted = b.accept.map((state: number) => state + shiftSize);
        // We create another state, that joins the two by epsilon transitions.
        const joiningStateRow: DeltaRow = {[Alphabet.EPSILON_CHAR]: [a.start,b.start  + shiftSize]};
        // Join them up           
        const delta: Delta = [...aDelta, ...bDelta, joiningStateRow]
            // object.assign applies each succesive element after the target object in a row. We start from a
            // blank object, then apply our 'row template', and then apply our actual transitions.
            // this ensures that each row has an array for each character in our alphabet.    
            .map((transitionRowPartial: DeltaRow) => Object.assign({}, deltaRowTemplate, transitionRowPartial));
        // Our new state that joins the two is our new start state
        const joinStateIndex = a.size + b.size;

        return new NFA(sigma, delta, joinStateIndex, [...a.accept, ...bAcceptShifted]);
    }

    static concatenate(a: NFA, b: NFA) : NFA {
        const {sigma, deltaRowTemplate, shiftSize, aDelta, bDelta} = NFA.prepareOperations(a, b);

        const bAcceptShifted = b.accept.map((state: number) => state + shiftSize);
        const bStartShifted = b.start + shiftSize;
    
        const delta: Delta = [...aDelta, ...bDelta] 
            .map((transitionRowPartial: DeltaRow) => Object.assign({}, deltaRowTemplate, transitionRowPartial));
       
        a.accept.forEach((state: number) => {
            delta[state][Alphabet.EPSILON_CHAR].push(bStartShifted);
        })
        return new NFA(sigma, delta, a.start, bAcceptShifted)
    }

    static star(b : NFA) : NFA {
        let eps =  NFA.EPSILON();
        const {sigma, deltaRowTemplate, shiftSize, aDelta, bDelta} = NFA.prepareOperations(eps, b);
        
        const bAcceptShifted = b.accept.map((state: number) => state + shiftSize);
        const bStartShifted = b.start + shiftSize;

         const delta: Delta = [...aDelta, ...bDelta] 
            .map((transitionRowPartial: DeltaRow) => Object.assign({}, deltaRowTemplate, transitionRowPartial));
       delta[0][Alphabet.EPSILON_CHAR].push(bStartShifted);
       bAcceptShifted.forEach((state: number) => {
           delta[state][Alphabet.EPSILON_CHAR].push(0);
       })

       return new NFA(sigma, delta, 0, [0, ...bAcceptShifted]);
    }
    
    constructor(protected readonly sigma: Alphabet, protected readonly delta: Delta, protected readonly start: number, protected readonly accept: number[]) {
      this.size = this.delta.length;
    }

    follow (current: number[], char: string) : number[] {
        return current.map(state => this.delta[state][char])
                      .filter(to => to && to.length > 0)
                      .flat();
    }
    fixEpsilonClosure() : void {
        for (let state = 0; state < this.size; state++) {
            let current: number[] = [state];
            let next: number[];
            while (true) {
                next = [...current, ...this.follow(current, Alphabet.EPSILON_CHAR)].unique();
                if (next.length == current.length) break;
                current = next;
            }
            this.delta[state][Alphabet.EPSILON_CHAR] = next;
        }
    }
    eval (string: string) {
        let inputChars: string[] = string.split('');
        let currentStates: number[] = [this.start];
        let nextStates: number[], char: string | undefined;
        while (char = inputChars.shift()) {
            nextStates = [...currentStates, ...this.follow(currentStates, Alphabet.EPSILON_CHAR)];
            nextStates = this.follow(nextStates, char);
            currentStates = nextStates;
        }
        return this.accept.some(state => currentStates.indexOf(state) > -1);
    }
}



let a = NFA.CHAR("a");
let b = NFA.CHAR("b");
let c = NFA.CHAR("c");
let d = NFA.CHAR("d");
let ab = NFA.concatenate(a, b);
let cd = NFA.concatenate(c, d);
let aborcd = NFA.union(ab, cd);
let final = NFA.star(aborcd);

// (ab|cd)*
final.fixEpsilonClosure();

//let L6 = NFA.star(L5);
//let L5 = NFA.union(L4, L3);

final.fixEpsilonClosure();
//console.log(final);
["", "ab", "cd", "ac", "bd", "abc", "abcda", "ababcd", "abcdcdcd"].forEach(function(str) {
    console.log(str + ", " + final.eval(str));
})