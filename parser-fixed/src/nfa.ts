// Author justin lee oct nov 2021
// recommented nov 2021 to add more expanation

declare global { // stops typescript throwing errors
    interface Array<T> {
        deepReverse(): Array<T>;
        unique(): Array<T>;
    }

    interface Object {
        complexmap<T, Q>(f: (value: T, key?: string | number | symbol, index?: number) => Q) : Record<any, any>;
    }
}

Array.prototype.unique = function() : Array<any> { // removes all dupe elements from array.
    return [ ...new Set(this)];
    // only works for primitives
}
Array.prototype.deepReverse = function() {
    return this.reverse().map(function(el: any) { // deep reverse (all non-array elements)
        if (Array.isArray(el)) return el.deepReverse();
        return el;
    })
}
// map based on a given structure
Object.prototype.complexmap = function<T, Q>( f: (value: T, key?: string | number | symbol, index?: number) => Q) : Record<any, Q> {
// I kept modifying the structure of the delta tables cause i was indecisive and it was confusing to have to keep changing map. so i made a general map
    let obj: Record<any, Q> = {}; let i = 0;
    
    for (let [key, value] of Object.entries(this)) {
        if (!this.hasOwnProperty(key)) continue;
        obj[key] = f(value as T, key, i++);
    }

    return obj;
}

type DeltaRow = Record<string, number[]>
type Delta = DeltaRow[]; // an array of objects whos keys are strings (chars) and whos values are arrays of numbers (integers);

type StructString = string | StructString[];


    // define an alphabet class to use for Sigma
    // essentially a set with a lot of added funcitonality
    
class Alphabet {

    private charList: string[] = [];
    
    static readonly OPS = new Set('*()|~'.split(''));

    static readonly EPSILON_CHAR = '%';
    
    // "preset" alphabets. build function never declares new - just combines using "presets",
    // being 'char', 'epsilon' and then modifying them and adding states
    static readonly EMPTY = new Alphabet("");

    constructor(chars: string) {
        // Get all the unique characters that aren't operators
        this.charList = (chars + Alphabet.EPSILON_CHAR)
            .split('')
            .filter(char => ! Alphabet.OPS.has(char))
            .unique();           
    }
    
    debug () : void {
    	console.log(`Alphabet: '` + this.charList.join(`', '`) + `'`);
    }

    getCharList() : string {
        return this.charList.join(''); 
    }

    //check char presence in Alphabet.
    has (string: string) : boolean {
        if (string.length !== 1) throw new Error("chars can only be of length 1");
        return this.charList.indexOf(string) >= 0;
    }

    equals (other: Alphabet) : boolean {
        return this.getCharList() === other.getCharList();
    }

    static union(a: Alphabet, b: Alphabet) : Alphabet { 
        return new Alphabet(a.getCharList() + b.getCharList());
    }
    
    // so I can loop through the alphabet using for... of
    [Symbol.iterator]() {
        let i = 0, l = this.charList.length;
        return ({
            next: () => ({
                done: l === i + 1,
                value: this.charList[i++],
            })
        });
    }
  
    // creates a "template" version of self with instance data removed
    // to use with object.assign
    getRowTemplate() : DeltaRow {
        return Object.fromEntries(this.charList.map(char => [char, []]));
    }
}

class NFA {
    
    constructor(protected readonly sigma: Alphabet, protected readonly delta: Delta, protected readonly start: number, protected readonly accept: number[]) {
        this.size = this.delta.length;
    }

    readonly size: number; 

    // a single accept state
    static readonly EPSILON: (() => NFA) = () => new NFA(Alphabet.EMPTY, [{[Alphabet.EPSILON_CHAR]: []}], 0, [0]);

    //no states or anything. identity value for combination functions
    static readonly EMPTY: (() => NFA) = () => new NFA(Alphabet.EMPTY, [], -12345678, []);

    // nfa that matches a single character.
    static CHAR(str: string) : NFA {
        return new NFA(new Alphabet(str), [{[str]: [1], [Alphabet.EPSILON_CHAR]: []}, {[str]: [], [Alphabet.EPSILON_CHAR]: []}], 0, [1]);
    }

    // all states have an index. to use a binary operator, we need to reindex 
    // one of the child NFAs so there is no overlap in indices
    static reindexDelta(d: Delta, shiftSize: number) : Delta {
        return d.map((transitionRow: DeltaRow) => transitionRow
                .complexmap<number[], number[]>((states: number[], transitionChar) => states 
                    .map((state: number) => state + shiftSize)));
    }

    static copyDelta(d: Delta) : Delta {
        return NFA.reindexDelta(d, 0);
    }

    
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

    // |
    static union(a: NFA, b: NFA) : NFA {
        
        // get the alphabet, row template, b shift value, origional a delta, and shifted b delta
        const {sigma, deltaRowTemplate, shiftSize, aDelta, bDelta} = NFA.prepareOperations(a, b);

        // reindex accept states as well
        const bAcceptShifted = b.accept.map((state: number) => state + shiftSize);

        // We create another state, that joins the two by epsilon transitions.
        const joiningStateRow: DeltaRow = {[Alphabet.EPSILON_CHAR]: [a.start,b.start  + shiftSize]};
        const endingStateRow: DeltaRow = {};
        // Join them up           
        const delta: Delta = [...aDelta, ...bDelta, joiningStateRow, endingStateRow]
            // object.assign applies each succesive element after the target object in a row. We start from a
            // blank object, then apply our 'row template', and then apply our actual transitions.
            // this ensures that each row has an array for each character in our alphabet.    
            .map((transitionRowPartial: DeltaRow) => Object.assign({}, deltaRowTemplate, transitionRowPartial));

        // set epsilon transitions between all former accept state and new single accept state.
        ([...bAcceptShifted, ...a.accept]).forEach((index: number) => {
            delta[index][Alphabet.EPSILON_CHAR].push(a.size + b.size + 1);
        })
        // the start state index after a and reindexed b are done
        const startStateIndex = a.size + b.size;

        return new NFA(sigma, delta, startStateIndex, [a.size + b.size + 1]);
    }

    // &
    static concatenate(a: NFA, b: NFA) : NFA {
        
         // get the alphabet, row template, b shift value, origional a delta, and shifted b delta
        const {sigma, deltaRowTemplate, shiftSize, aDelta, bDelta} = NFA.prepareOperations(a, b);

        const bAcceptShifted = b.accept.map((state: number) => state + shiftSize);
        const bStartShifted = b.start + shiftSize;
    
        const delta: Delta = [...aDelta, ...bDelta] 
            .map((transitionRowPartial: DeltaRow) => Object.assign({}, deltaRowTemplate, transitionRowPartial));
       
        // add epsilon transitions from all the accept states of a to the new start state of b 
        a.accept.forEach((state: number) => {
            delta[state][Alphabet.EPSILON_CHAR].push(bStartShifted);
        })

        return new NFA(sigma, delta, a.start, bAcceptShifted)

    }

    // *
    static star(a : NFA) : NFA {
        let empty = NFA.EMPTY();
        // star is a unary operator but i made the prepare ops function only work for binary fs. fortunately empty nfa acts
        // like an identity here. 
        
        const {sigma, deltaRowTemplate} = NFA.prepareOperations(empty, a);

        // add a start and accept state
        const joiningStateRow: DeltaRow = {[Alphabet.EPSILON_CHAR]: [a.start]};
        const endingStateRow: DeltaRow = {[Alphabet.EPSILON_CHAR]: [a.start]};
        
        const delta = [...a.delta, joiningStateRow, endingStateRow]
            .map((transitionRowPartial: DeltaRow) => Object.assign({}, deltaRowTemplate, transitionRowPartial));
        
        
        // epsilon from all the old accepts to new accept state
        a.accept.forEach((state: number) => {
            delta[state][Alphabet.EPSILON_CHAR].push(a.size + 1);
        })

       return new NFA(sigma, delta, a.size, [0, a.size + 1]);

    }
    // ?
    static maybe(a: NFA) : NFA {
        // <expr>? = e | <expr>
        return this.union(a, NFA.EPSILON());
    }

    static some(a: NFA) : NFA {
        // <expr>+ = <expr><expr>*
        return this.concatenate(a, this.star(a));
    }

    // returns a "step" through the delta table given a state and input char
    follow (current: number[], char: string) : number[] {
        return current.map(state => this.delta[state][char] || [])
                      .filter(to => to && to.length > 0)
                      .flat();
    }
    
    // fixes epsilon closure
    fixEpsilonClosure() : void {
        for (let state = 0; state < this.size; state++) {
            let current: number[] = [];
            let next: number[] = [...this.follow([state], Alphabet.EPSILON_CHAR)].unique();
            
            // until we add 0 new, find states reachable by epsilon transition from our current ones
            while (next.length !== current.length) {
                current = next;
                next = [...current, ...this.follow(current, Alphabet.EPSILON_CHAR)].unique();       
            }
            // assign all the ones found to current epsilon transition
            this.delta[state][Alphabet.EPSILON_CHAR] = next;
        }
    }
    eval (string: string) {
        // evaluates a string to see if it matches
        let inputChars: string[] = string.split('');
        // we begin at start state
        let currentStates: number[] = [this.start];
        let nextStates: number[];
        while (true) {
            // go through all the epsilon transitions
            nextStates = [...currentStates, ...this.follow(currentStates, Alphabet.EPSILON_CHAR)];
            // get the next char. if we're done, check our current states to see if 
            // we're in an accept state
            const char = inputChars.shift()
            if (char === undefined) {
                currentStates = nextStates;
                break;
            }
            // follow all the current states by the input char
            nextStates = this.follow(nextStates, char);
            currentStates = nextStates;
        }
        // if there's any overlap between 'current' and 'accept', we have a match!
        return this.accept.some(state => currentStates.indexOf(state) > -1);
    }
}

export { NFA, Alphabet, }