// Kata bowling empleando definición de tipos en Typescript para definir los frames



type KnockedPinNot10 = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type KnockedPin = KnockedPinNot10 | 10;
type KnockedPinOrWaiting = KnockedPin | undefined; // undefined indica que se espera su lanzamiento


type Spare = Readonly<{knocked1: KnockedPinNot10, knocked2: KnockedPin, bonus1: KnockedPinOrWaiting}>; 

type Normal = Readonly<{knocked1: KnockedPinNot10, knocked2: KnockedPinNot10}>;

type Incomplete = Readonly<{knocked1: KnockedPinNot10}>;

type Strike = Readonly<{knocked1: 10, bonus1: KnockedPinOrWaiting, bonus2: KnockedPinOrWaiting}>;

type Error = Readonly<{error: String, knocked1?: KnockedPin, knocked2?: KnockedPin, bonus1?: KnockedPin, bonus2?: KnockedPin}>;

export type Frame = Spare | Normal | Incomplete | Strike | Error;


function incomplete(knocked: KnockedPinNot10): Incomplete {
    return {
        knocked1: knocked, 
    }
}

function normal(knocked1: KnockedPinNot10, knocked2: KnockedPinNot10): Normal {
    return {
        knocked1: knocked1, 
        knocked2: knocked2,
    }  
}

function strike(): Strike {
    return {
        knocked1: 10, 
        bonus1: undefined, 
        bonus2: undefined
    }    
}

function spare(knocked1: KnockedPinNot10, knocked2: KnockedPin): Spare {
    return {
        knocked1: knocked1, 
        knocked2: knocked2,
        bonus1: undefined, 
    }    
}

function error(error: String, knocked1?: KnockedPin, knocked2?: KnockedPin, bonus1?: KnockedPin, bonus2?: KnockedPin): Error {
    return {
        error: error,
        knocked1: knocked1, 
        knocked2: knocked2,
        bonus1: bonus1,
        bonus2: bonus2
    }  
}

export function isError(frame: Frame): frame is Error {
  return frame != undefined && frame.hasOwnProperty("error");
}

export function isIncomplete(frame: Frame): frame is Incomplete {
    return frame != undefined && !isError(frame) && !isStrike(frame)&& !frame.hasOwnProperty("knocked2");
}

export function isStrike(frame: Frame): frame is Strike {
    return !isError(frame) && frame.knocked1 === 10;
}

export function isSpare(frame: Frame): frame is Spare {
    return !isError(frame) && "knocked2" in frame && (frame.knocked1 ?? 0) + (frame.knocked2 ?? 0) == 10;
}

export function isNormal(frame: Frame): frame is Normal {
    return !isError(frame) && "knocked2" in frame && (frame.knocked1 ?? 0) + (frame.knocked2 ?? 0) < 10;
}


const applyBonus = (frame: Frame) => (knocked: KnockedPin): Frame[] => {
   return frame == undefined? []:
          !("bonus1" in frame)? [frame] :
          frame.bonus1 === undefined? [{...frame, bonus1: knocked}] :
          !("bonus2" in frame) || frame.bonus2 != undefined? [frame] :
          frame.bonus1 != 10 && (frame.bonus1 ?? 0) + knocked > 10? [{...frame, error: "bonus error", bonus1: frame.bonus1, bonus2: knocked}] : 
          [{...frame, bonus2: knocked}]
}

const completeFrame = (frame: Incomplete) => function (knocked2: KnockedPin): Normal | Spare | Error {
   return   frame.knocked1 + knocked2 > 10 ?
                    error ("suma mayor de 10", frame.knocked1, knocked2) :
                    frame.knocked1 + knocked2 == 10 || knocked2 == 10?
                        spare(frame.knocked1, knocked2) :
                        normal(frame.knocked1, knocked2);
}
   

const createFrame = (knocked: KnockedPin): Strike | Incomplete => {
    return knocked == 10 ? strike() : incomplete(knocked)
}

const addKnocked = (frames: Frame[]) => (knocked: KnockedPin): Frame[] => {
    const last = frames[frames.length-1];
     return isIncomplete(last)?
                frames.slice(0, -2).concat(
                    applyBonus(frames[frames.length-2])(knocked), 
                    completeFrame(last)(knocked)) :
     
                frames.slice(0, -2).concat(
                    applyBonus(frames[frames.length-2])(knocked),
                    applyBonus(frames[frames.length-1])(knocked),
                    frames.length===10? [] : createFrame(knocked))        
}

export function buildFrames(knockeds: KnockedPin[]): Frame[] {
   return knockeds.reduce((frames: Frame[], knocked) => addKnocked(frames)(knocked), []);
}

function scoreStrike(strike: Strike): number {
    return strike.knocked1 + (strike.bonus1 ?? 0) + (strike.bonus2 ?? 0);
}

function scoreSpare(spare: Spare): number {
    return spare.knocked1 + (spare.knocked2 ?? 0) + (spare.bonus1 ?? 0);
}

function scoreNormal(normal: Normal): number {
    return normal.knocked1 + (normal.knocked2 ?? 0);
}

function scoreIncomplete(incomplete: Incomplete): number {
    return incomplete.knocked1;
}

function score(frame: Frame): number {
    return isStrike(frame)? scoreStrike(frame) :
           isSpare(frame) ? scoreSpare(frame) :
           isNormal(frame) ? scoreNormal(frame) :
           isIncomplete(frame) ? scoreIncomplete(frame) :
           0
}

export function totalScore(frames: Array<NonNullable<Frame>>): number {
    return frames.reduce((previous, current) => previous + score(current), 0);
}



