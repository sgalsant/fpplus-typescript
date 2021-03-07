// Kata bowling empleando definición de tipos en Typescript para definir los frames


type KnockedPinNot10 = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type KnockedPin = KnockedPinNot10 | 10;
type KnockedPinOrWaiting = KnockedPin | undefined; // undefined indica que se espera su lanzamiento


export enum FrameTypes {
    UNIT,
    INCOMPLETE, // falta la segunda tirada, no se sabe si es normal o spare
    NORMAL,
    STRIKE,
    SPARE,
    ERROR, // knocked1 + knocked2 > 10
}


export type Frame = {
    knocked1?: KnockedPin,
    knocked2?: KnockedPinOrWaiting, 
    bonus1?: KnockedPinOrWaiting, 
    bonus2?: KnockedPinOrWaiting,
    error?: "knocked1 + knocked2 es mayor de 10",
};

type Unit = {}; // no se ha realizado la primera tirada. A lo mejor ni ha entrado en la bolera :)

function unit(): Unit {
    return {};
}

function isUnit(frame: Frame): Boolean {
    return !("knocked1" in frame);
}

type Incomplete = Frame & {knocked1: KnockedPinNot10};
type Normal = Frame & {knocked1: KnockedPinNot10, knocked2: KnockedPinNot10};
type Strike = Frame & {knocked1: 10, bonus1: KnockedPinOrWaiting, bonus2: KnockedPinOrWaiting};
type Spare = Frame & {knocked1: KnockedPinNot10, knocked2: KnockedPin, bonus1: KnockedPinOrWaiting};
type Error = Frame & {knocked1: KnockedPin, knocked2: KnockedPin, error: "knocked1 + knocked2 es mayor de 10"}; // knocked1 + knocked2 > 10 (entre 11 y 19)



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

function strike(bonus1: KnockedPinOrWaiting, bonus2: KnockedPinOrWaiting): Strike {
    return {
        knocked1: 10, 
        bonus1: bonus1, 
        bonus2: bonus2
    }    
}

function spare(knocked1: KnockedPinNot10, knocked2: KnockedPin, bonus: KnockedPinOrWaiting): Spare {
    return {
        knocked1: knocked1, 
        knocked2: knocked2,
        bonus1: bonus, 
    }    
}

function error(knocked1: KnockedPin, knocked2: KnockedPin): Error {
    return {
        knocked1: knocked1, 
        knocked2: knocked2,
        error: "knocked1 + knocked2 es mayor de 10"
    }  
}

export function isError(frame: Frame): Boolean {
  return "error" in frame;
}

function isStrike(frame: Frame): Boolean {
    return "bonus1" in frame && "bonus2" in frame
}

function isSpare(frame: Frame): Boolean {
    return "bonus1" in frame && !("bonus2" in frame);
}

function isNormal(frame: Frame): Boolean {
    return !isError(frame) && "knocked1" in frame && "knocked2" in frame && !("bonus1" in frame) && !("bonus2" in frame);
}

function isIncomplete(frame: Frame): Boolean {
    return "knocked1" in frame && !("knocked2" in frame) && !("bonus1" in frame);
}

export function toType(frame: Frame): FrameTypes {
   return isError(frame) ? FrameTypes.ERROR :
          isStrike(frame) ? FrameTypes.STRIKE :
          isSpare(frame) ? FrameTypes.SPARE :
          isNormal(frame) ? FrameTypes.NORMAL :
          isIncomplete(frame) ? FrameTypes.INCOMPLETE :
          FrameTypes.UNIT
}

function toError(knocked1: KnockedPin, knocked2: KnockedPinOrWaiting): Error | undefined {
    return knocked2 != undefined 
            && knocked1 + knocked2 > 10? error(knocked1, knocked2) : undefined;
}

function toStrike(knocked1: KnockedPin, knocked2: KnockedPinOrWaiting, knocked3: KnockedPinOrWaiting): Strike | undefined {
    return knocked1 == 10? strike(knocked2, knocked3) : undefined;
}

function toSpare(knocked1: KnockedPin, knocked2: KnockedPinOrWaiting, knocked3: KnockedPinOrWaiting): Spare | undefined {
    return knocked1 != 10 
            && knocked2 != undefined 
            && knocked1 + knocked2  == 10? spare(knocked1, knocked2, knocked3) : undefined;
}

function toNormal(knocked1: KnockedPin, knocked2: KnockedPinOrWaiting): Normal | undefined {
    return knocked1 != 10 
            && knocked2 != undefined && knocked2 != 10 
            && knocked1 + knocked2 < 10? normal(knocked1, knocked2) : undefined;
}

function toIncomplete(knocked: KnockedPin, knocked2: KnockedPinOrWaiting,): Incomplete | undefined {
    return knocked != 10 
             && knocked2 == undefined ? incomplete(knocked) : undefined
}

function toFrame(knocked1: KnockedPin, knocked2: KnockedPinOrWaiting, knocked3: KnockedPinOrWaiting): Frame | Unit{
        return toStrike(knocked1, knocked2, knocked3) ??
               toError(knocked1, knocked2) ??
               toSpare(knocked1, knocked2, knocked3) ??
               toNormal(knocked1, knocked2) ??
               toIncomplete(knocked1, knocked2) ??
               unit()
}

export function toFrames(knockeds: Array<KnockedPin>, frameIndex: number = 1): Array<Frame> {
    return frameIndex > 10 || knockeds.length == 0? [] :
       [toFrame(knockeds[0], knockeds[1], knockeds[2]), 
        ...toFrames(knockeds.slice(knockeds[0] == 10? 1: 2), frameIndex +1 )];  
}

export function knockedPinToPoints(knocked: KnockedPin[]): number {
    return framesToPoints(toFrames(knocked));
}

export function frameToPoints(frame: Frame): number {
    return isError(frame) || isUnit(frame) ? 0 :
       (frame.knocked1 ?? 0) + (frame.knocked2 ?? 0) + (frame.bonus1 ?? 0)+ (frame.bonus2 ?? 0);
}

export function framesToPoints(frames: Frame[]): number {
    return frames.reduce((previous, current) => {
        return previous + frameToPoints(current);
    }, 0);
}



