// Kata bowling empleando definición de tipos en Typescript para definir los frames


type KnockedPinNot10 = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type KnockedPin = KnockedPinNot10 | 10;
type KnockedPinOrWaiting = KnockedPin | undefined; // undefined indica que se espera su lanzamiento


export enum FrameTypes {
    INCOMPLETE, // falta la segunda tirada, no se sabe si es normal o spare
    NORMAL,
    STRIKE,
    SPARE,
    ERROR, // knocked1 + knocked2 > 10
}

export type Frame = {
    knocked1: KnockedPin,
    knocked2?: KnockedPinOrWaiting, 
    bonus1?: KnockedPinOrWaiting, 
    bonus2?: KnockedPinOrWaiting,
    error?: "knocked1 + knocked2 es mayor de 10",
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

export function toFrames(knockeds: Array<KnockedPin>, frameIndex: number = 1): Array<Frame> {
    if (knockeds.length == 0) {
        return [];
    }

    let frame: Frame;
    let index = 1;
    if (knockeds[0] === 10) { // strike
        frame = strike(knockeds[1], knockeds[2]);
    } else if (knockeds.length < 2) { // no completado frame, falta segunda tirada, puede ser normal o spare
        frame = incomplete(knockeds[0]);
    } else {
        index++;
        if (knockeds[0] + knockeds[1] == 10) { // spare
            frame = spare(knockeds[0], knockeds[1], knockeds[2]);
        } else if (knockeds[1] != 10 && knockeds[0] + knockeds[1] < 10) {
            frame = normal(knockeds[0], knockeds[1]);
        } else {
           frame = error(knockeds[0], knockeds[1]);
        }
    }

    if (frameIndex == 10 || index >= knockeds.length) {
        return [frame];
    } else {
        return [frame, ...toFrames(knockeds.slice(index), frameIndex +1 )];
    }
}

export function knockedPinToPoints(knocked: KnockedPin[]): number {
    return framesToPoints(toFrames(knocked));
}

export function frameToPoints(frame: Frame): number {
    if (isError(frame)) {
       return 0;
    } else {
       return frame.knocked1 + (frame.knocked2 ?? 0) + (frame.bonus1 ?? 0)+ (frame.bonus2 ?? 0);
    }
}

export function framesToPoints(frames: Frame[]): number {
    return frames.reduce((previous, current) => {
        return previous + frameToPoints(current);
    }, 0);
}



