// Kata bowling empleando definición de tipos en Typescript para definir los frames

type KnockedPin = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type KnockedPinNot10 = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export enum FrameTypes {
    INCOMPLETE, // falta la segunda tirada, no se sabe si es normal o spare
    NORMAL,
    STRIKE,
    SPARE,
    ERROR, // knocked1 + knocked2 > 10
}

export type Frame = {
    type: FrameTypes,
    knocked1: KnockedPin,
    knocked2: KnockedPin | undefined, // puede ser indefinido si no se ha lanzado la segunda tirada
    bonus1: KnockedPin | undefined,  // puede ser indefinido si es un strike o spare y no se ha lanzado la tirada del bonus
    bonus2: KnockedPin | undefined,
}


type Incomplete = Frame & {type: FrameTypes.INCOMPLETE, knocked1: KnockedPinNot10, knocked2: undefined, bonus1: undefined, bonus2: 0};
type Normal = Frame & {type: FrameTypes.NORMAL, knocked1: KnockedPinNot10, knocked2: KnockedPinNot10, bonus1: 0, bonus2: 0};
type Strike = Frame & {type: FrameTypes.STRIKE, knocked1: 10, knocked2: 0};
type Spare = Frame & {type: FrameTypes.SPARE, knocked1: KnockedPinNot10, knocked2: KnockedPin, bonus2: 0};
type Error = Frame & {type: FrameTypes.ERROR, bonus1: 0, bonus2: 0}

function incomplete(knocked: KnockedPinNot10): Incomplete {
    return {
        type: FrameTypes.INCOMPLETE,
        knocked1: knocked, 
        knocked2: undefined,
        bonus1: undefined, 
        bonus2: 0
    }
}

function normal(knocked1: KnockedPinNot10, knocked2: KnockedPinNot10): Normal {
    return {
        type: FrameTypes.NORMAL,
        knocked1: knocked1, 
        knocked2: knocked2,
        bonus1: 0, 
        bonus2: 0
    }  
}

function strike(bonus1: KnockedPin | undefined, bonus2: KnockedPin | undefined): Strike {
    return {
        type: FrameTypes.STRIKE,
        knocked1: 10, 
        knocked2: 0,
        bonus1: bonus1, 
        bonus2: bonus2
    }    
}

function spare(knocked1: KnockedPinNot10, knocked2: KnockedPin, bonus: KnockedPin | undefined): Spare {
    return {
        type: FrameTypes.SPARE,
        knocked1: knocked1, 
        knocked2: knocked2,
        bonus1: bonus, 
        bonus2: 0
    }    
}

function error(knocked1: KnockedPin, knocked2: KnockedPin): Error {
    return {
        type: FrameTypes.ERROR,
        knocked1: knocked1, 
        knocked2: knocked2,
        bonus1: 0, 
        bonus2: 0
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
    switch (frame.type) {
        case FrameTypes.ERROR: return 0;
        default: return frame.knocked1 + (frame.knocked2 ?? 0) + (frame.bonus1 ?? 0)+ (frame.bonus2 ?? 0);
    }
}

export function framesToPoints(frames: Frame[]): number {
    return frames.reduce((previous, current) => {
        return previous + frameToPoints(current);
    }, 0);
}

// obsoleta
export function toPoints(frames: Array<Frame>): number {
    return framesToPoints(frames);
}


