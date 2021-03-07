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
type Error = Frame & {knocked1: KnockedPinNot10, knocked2: KnockedPin, error: "knocked1 + knocked2 es mayor de 10"}; // knocked1 + knocked2 > 10 (entre 11 y 19)



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

function error(knocked1: KnockedPinNot10, knocked2: KnockedPin): Error {
    return {
        knocked1: knocked1, 
        knocked2: knocked2,
        error: "knocked1 + knocked2 es mayor de 10"
    }  
}

export function isError(frame: Frame): Boolean {
  return "error" in frame;
}

export function toType(frame: Frame): FrameTypes {
    if (isError(frame)) {
        return FrameTypes.ERROR;
    } else if (isUnit(frame)) {
        return FrameTypes.UNIT;
    } else if ("bonus1" in frame && "bonus2" in frame) {
        return FrameTypes.STRIKE;
    } else if (!("knocked2" in frame)) {
        return FrameTypes.INCOMPLETE
    } else if (!("bonus1" in frame)) {
        return FrameTypes.NORMAL
    } else {
        return FrameTypes.SPARE;
    }
}

function toFrame(knocked1: KnockedPin, knocked2: KnockedPinOrWaiting, knocked3: KnockedPinOrWaiting, 
    frameIndex: number): Frame | Unit{
        if (knocked1 == undefined || frameIndex > 10) {
            return unit();
        } else if (knocked1 === 10) { // strike
            return strike(knocked2, knocked3);
        } else if (knocked2 === undefined) { // no completado frame, falta segunda tirada, puede ser normal o spare
            return incomplete(knocked1);
        } else {
            if (knocked1 + knocked2 == 10) { // spare
                return spare(knocked1, knocked2, knocked3);
            } else if (knocked2 != 10 && knocked1 + knocked2 < 10) {
                return normal(knocked1, knocked2);
            } else {
               return error(knocked1, knocked2);
            }
        }    
    }

export function toFrames(knockeds: Array<KnockedPin>, frameIndex: number = 1): Array<Frame> {
    let frame = toFrame(knockeds[0], knockeds[1], knockeds[2], frameIndex);

    if (isUnit(frame)) {
       return [];
    } else {
       return [frame, ...toFrames(knockeds.slice("knocked2" in frame?2:1), frameIndex +1 )];
    }
}

export function knockedPinToPoints(knocked: KnockedPin[]): number {
    return framesToPoints(toFrames(knocked));
}

export function frameToPoints(frame: Frame): number {
    if (isError(frame) || isUnit(frame)) {
       return 0;
    } else {
       return (frame.knocked1 ?? 0) + (frame.knocked2 ?? 0) + (frame.bonus1 ?? 0)+ (frame.bonus2 ?? 0);
    }
}

export function framesToPoints(frames: Frame[]): number {
    return frames.reduce((previous, current) => {
        return previous + frameToPoints(current);
    }, 0);
}



