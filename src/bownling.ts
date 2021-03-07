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

export type Frame = Readonly<{
    type: FrameTypes,
    knocked1?: KnockedPin,
    knocked2?: KnockedPinOrWaiting, 
    bonus1?: KnockedPinOrWaiting, 
    bonus2?: KnockedPinOrWaiting,
    error?: String,
}>;

type Unit = Pick<Frame, "type"> 
            & {type: FrameTypes.UNIT}; // no se ha realizado ninguna tirada del frame y a lo mejor nunca se realiza :)

type Spare = Omit<Frame, "error" | "bonus2">
                & {type: FrameTypes.SPARE}
                & {knocked1: KnockedPinNot10, knocked2: KnockedPin, bonus1: KnockedPinOrWaiting};   

type Normal = Omit<Frame, "error" | "bonus2" | "bonus1">
                & {type: FrameTypes.NORMAL}
                & {knocked1: KnockedPinNot10, knocked2: KnockedPinNot10};

type Incomplete = Pick<Frame, "type" | "knocked1">
                & {type: FrameTypes.INCOMPLETE};

type Strike = Omit<Frame, "error" | "knocked2"> 
                & {type: FrameTypes.STRIKE}
                & {knocked1: 10, bonus1: KnockedPinOrWaiting, bonus2: KnockedPinOrWaiting};

type Error = Omit<Frame, "bonus1" | "bonus2">
                & {type: FrameTypes.ERROR}
                & {knocked1: KnockedPin, error: String}



function incomplete(knocked: KnockedPinNot10): Incomplete {
    return {
        type: FrameTypes.INCOMPLETE,
        knocked1: knocked, 
    }
}

function normal(knocked1: KnockedPinNot10, knocked2: KnockedPinNot10): Normal {
    return {
        type: FrameTypes.NORMAL,
        knocked1: knocked1, 
        knocked2: knocked2,
    }  
}

function strike(bonus1: KnockedPinOrWaiting, bonus2: KnockedPinOrWaiting): Strike {
    return {
        type: FrameTypes.STRIKE,
        knocked1: 10, 
        bonus1: bonus1, 
        bonus2: bonus2
    }    
}

function spare(knocked1: KnockedPinNot10, knocked2: KnockedPin, bonus: KnockedPinOrWaiting): Spare {
    return {
        type: FrameTypes.SPARE,
        knocked1: knocked1, 
        knocked2: knocked2,
        bonus1: bonus, 
    }    
}

function error(error: String, knocked1: KnockedPin, knocked2?: KnockedPin, bonus1?: KnockedPin, bonus2?: KnockedPin): Error {
    return {
        type: FrameTypes.ERROR,
        knocked1: knocked1, 
        knocked2: knocked2,
        error: error
    }  
}

function unit(): Unit {
    return {type: FrameTypes.UNIT};
}

export function isUnit(frame: Frame): Boolean {
    return frame.type == FrameTypes.UNIT;
}

export function isError(frame: Frame): Boolean {
  return frame.type == FrameTypes.ERROR;
}

export function toType(frame: Frame): FrameTypes {
   return frame.type;
}

function checkError(knocked1: KnockedPin, knocked2: KnockedPinOrWaiting, knocked3: KnockedPinOrWaiting): Error | undefined {
    return knocked1 == 10 && (knocked2 != 10 && (knocked2 ?? 0) + (knocked3 ??0) > 10)? error("error en bonus de strike", knocked1, undefined, knocked2, knocked3): 
           knocked1 != 10 && knocked1 + (knocked2 ?? 0) > 10?  error( "knocked1 + knocked2 > 10", knocked1, knocked2):
           undefined;
}

function checkStrike(knocked1: KnockedPin, knocked2: KnockedPinOrWaiting, knocked3: KnockedPinOrWaiting): Strike | undefined {
    return knocked1 == 10 ? strike(knocked2, knocked3) : undefined;
}

function checkSpare(knocked1: KnockedPin, knocked2: KnockedPinOrWaiting, knocked3: KnockedPinOrWaiting): Spare | undefined {
    return knocked1 != 10 
            && knocked2 != undefined 
            && knocked1 + knocked2  == 10? spare(knocked1, knocked2, knocked3) : undefined;
}

function checkNormal(knocked1: KnockedPin, knocked2: KnockedPinOrWaiting): Normal | undefined {
    return knocked1 != 10 && knocked2 != undefined && knocked2 != 10 && knocked1 + knocked2  != 10? normal(knocked1, knocked2) :
           undefined;
}

function checkIncomplete(knocked: KnockedPin, knocked2: KnockedPinOrWaiting): Incomplete | undefined {
    return knocked != 10 
             && knocked2 == undefined ? incomplete(knocked) : undefined
}

function buildFrame(knocked1: KnockedPin, knocked2: KnockedPinOrWaiting, knocked3: KnockedPinOrWaiting): Frame | Unit{
    return checkError(knocked1, knocked2, knocked3) ?? 
            checkStrike(knocked1, knocked2, knocked3) ??
            checkSpare(knocked1, knocked2, knocked3) ??
            checkNormal(knocked1, knocked2) ??
            checkIncomplete(knocked1, knocked2) ??
            unit()
}

export function buildFrames(knockeds: Array<KnockedPin>, frameIndex: number = 1): Array<Frame> {
    return frameIndex > 10 || knockeds.length == 0? [] :
       [buildFrame(knockeds[0], knockeds[1], knockeds[2]), 
        ...buildFrames(knockeds.slice(knockeds[0] == 10? 1: 2), frameIndex +1 )];  
}

export function knockedPinToPoints(knocked: KnockedPin[]): number {
    return framesToPoints(buildFrames(knocked));
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



