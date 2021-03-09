// Kata bowling empleando definición de tipos en Typescript para definir los frames



type KnockedPinNot10 = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type KnockedPin = KnockedPinNot10 | 10;
type KnockedPinOrWaiting = KnockedPin | undefined; // undefined indica que se espera su lanzamiento


export type Frame = Readonly<{
    knocked1?: KnockedPin,
    knocked2?: KnockedPinOrWaiting, 
    bonus1?: KnockedPinOrWaiting, 
    bonus2?: KnockedPinOrWaiting,
    error?: String,
}>;

       
type Spare = {knocked1: KnockedPinNot10, knocked2: KnockedPin, bonus1: KnockedPinOrWaiting}; 

type Normal = {knocked1: KnockedPinNot10, knocked2: KnockedPinNot10};

type Incomplete = {knocked1: KnockedPinNot10};

type Strike = {knocked1: 10, bonus1: KnockedPinOrWaiting, bonus2: KnockedPinOrWaiting};

type Error = {error: String, knocked1?: KnockedPin, knocked2?: KnockedPin, bonus1?: KnockedPin, bonus2?: KnockedPin};



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

export function isError(frame: Frame): Boolean {
  return frame != undefined && frame.hasOwnProperty("error");
}

export function isIncomplete(frame: Frame): Boolean {
    return frame != undefined && !isError(frame) && !isStrike(frame)&& !frame.hasOwnProperty("knocked2");
}

export function isStrike(frame: Frame): Boolean{
    return !isError(frame) && frame.knocked1 == 10;
}

export function isSpare(frame: Frame): Boolean {
    return !isError(frame) && !isIncomplete(frame) && (frame.knocked1 ?? 0) + (frame.knocked2 ?? 0) == 10;
}

export function isNormal(frame: Frame): Boolean {
    return !isError(frame) && !isIncomplete(frame) && (frame.knocked1 ?? 0) + (frame.knocked2 ?? 0) < 10;
}


const applyBonus = (frame: Frame) => (knocked: KnockedPin): Frame[] => {
   return frame == undefined? [] :
          isError(frame) ? [frame] :
          frame.hasOwnProperty("bonus1") && frame.bonus1 == undefined? [{...frame, bonus1: knocked}] :
          !frame.hasOwnProperty("bonus2") || frame.bonus2 != undefined? [frame] :
          frame.bonus1 != 10 && (frame.bonus1 ?? 0)+ knocked > 10? [error("bonus error", frame.knocked1, frame.knocked2, frame.bonus1, knocked)] :
          [{...frame, bonus2: knocked}] 
}

const completeFrame = (frame: Frame) => function (knocked2: KnockedPin): Normal | Spare | Error {
   return frame.knocked1 == undefined?
            error("primera tirada no definida", frame.knocked1, knocked2) :
            frame.knocked1 == 10 || knocked2 == 10 ?
                error("primera o segunda tirada es 10", frame.knocked1, knocked2) :
                frame.knocked1 + knocked2 > 10 ?
                    error ("suma mayor de 10", frame.knocked1, knocked2) :
                    frame.knocked1 + knocked2 == 10?
                        spare(frame.knocked1, knocked2) :
                        normal(frame.knocked1, knocked2);
}
   

const createFrame = (knocked: KnockedPin): Strike | Incomplete => {
    return knocked == 10 ? strike() : incomplete(knocked)
}



function add(knocked: KnockedPin, frames: Frame[]): Frame[] {
     return isIncomplete(frames[frames.length-1])?
                frames.slice(0, -2).concat(
                    applyBonus(frames[frames.length-2])(knocked), 
                    completeFrame(frames[frames.length-1])(knocked)) :
     
                frames.slice(0, -2).concat(
                    applyBonus(frames[frames.length-2])(knocked),
                    applyBonus(frames[frames.length-1])(knocked),
                    frames.length===10? [] : createFrame(knocked)) 
            
          
}

export function buildFrames(knockeds: KnockedPin[], frames: Frame[] = []): Frame[] {
    return knockeds.length == 0? frames :
        buildFrames(knockeds.slice(1), add(knockeds[0], frames))
}

export function frameToPoints(frame: Frame): number {
    return isError(frame) ? 0 :
       (frame.knocked1 ?? 0) + (frame.knocked2 ?? 0) + (frame.bonus1 ?? 0)+ (frame.bonus2 ?? 0);
}

export function framesToPoints(frames: Frame[]): number {
    return frames.reduce((previous, current) => {
        return previous + frameToPoints(current);
    }, 0);
}



