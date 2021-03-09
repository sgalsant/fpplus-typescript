import {Frame, buildFrames, framesToPoints, isStrike, isSpare, isNormal, isError, isIncomplete} from '../src/bownling.js';


describe('bowling', function() {
  describe('strike', function() {
    it('sin tiradas', function() {
      chai.assert.isEmpty(buildFrames([]));
    });

    it('una tirada', function() {
      let frames = buildFrames([5]);
      chai.assert.equal(1, frames.length);
      chai.assert.isTrue(isIncomplete(frames[0]));
      chai.assert.equal(5, framesToPoints(frames));
    })

    it('dos tiradas', function() {
      let frames = buildFrames([5, 4]);
      chai.assert.equal(1, frames.length);
      chai.assert.isTrue(isNormal(frames[0]));
      chai.assert.equal(9, framesToPoints(frames));
    })


    it('tres tiradas', function() {
      let frames = buildFrames([5, 4, 5]);
      chai.assert.equal(2, frames.length);
      chai.assert.isTrue(isNormal(frames[0]));
      chai.assert.isTrue(isIncomplete(frames[1]));
      chai.assert.equal(14, framesToPoints(frames));
    })

    it('seis tiradas', function() {
      let frames: Frame[] = buildFrames([5, 4, 3, 6, 3, 4]);
      chai.assert.equal(frames.length, 3);
      frames.forEach(frame => {chai.assert.isTrue(isNormal(frame))});
      chai.assert.equal(25, framesToPoints(frames));
    })

    it('tiradas con error', function() {
      let frames = buildFrames([5, 4, 5, 6, 3, 4]);
      chai.assert.equal(3, frames.length);
      chai.assert.isTrue(isNormal(frames[0]));
      chai.assert.isTrue(isError(frames[1]));
      chai.assert.isTrue(isNormal(frames[2]));
      chai.assert.equal(framesToPoints(frames), 16);
    })

    it('strike sin tiradas adicionales', function() {
      let frames = buildFrames([10]);
      chai.assert.equal(1, frames.length);
      chai.assert.isTrue(isStrike(frames[0]));
      chai.assert.equal(framesToPoints(frames), 10);
    });

    it('strike con una tirada adicional', function() {
      let frames = buildFrames([10, 8]);
      chai.assert.equal(2, frames.length);
      chai.assert.isTrue(isStrike(frames[0]));
      chai.assert.equal(framesToPoints(frames), 26);
    });

    it('strike con dos tiradas adicionales', function() {
      let frames = buildFrames([10, 8, 2]);
      chai.assert.equal(2, frames.length);
      chai.assert.isTrue(isStrike(frames[0]));
      chai.assert.equal(30, framesToPoints(frames));
    });

    it('strike con dos tiradas adicionales erroneas', function() {
      let frames = buildFrames([10, 8, 4]);
      chai.assert.equal(2, frames.length);
      chai.assert.isTrue(isError(frames[0]));
      chai.assert.isTrue(isError(frames[1]));
      chai.assert.equal(0, framesToPoints(frames));
    });

    it('strike con una tirada adicional 10', function() {
      let frames = buildFrames([10, 10, 4]);
      chai.assert.equal(3, frames.length);
      chai.assert.isTrue(isStrike(frames[0]));
      chai.assert.isTrue(isStrike(frames[1]));
      chai.assert.isTrue(isIncomplete(frames[2]));
      chai.assert.equal(42, framesToPoints(frames));
    });

    it('strike con dos tiradas adicionales 10', function() {
      let frames = buildFrames([10, 10, 10]);
      chai.assert.equal(3, frames.length);
      chai.assert.isTrue(isStrike(frames[0]));
      chai.assert.isTrue(isStrike(frames[1]));
      chai.assert.isTrue(isStrike(frames[2]));
      chai.assert.equal(60, framesToPoints(frames));
    });

    it('strike consecutivos', function() {
      let frames: Frame[] = buildFrames([10, 10, 10]);
      chai.assert.equal(3, frames.length);
      frames.forEach(frame => chai.assert.isTrue(isStrike(frame)));
      chai.assert.equal(60, framesToPoints(frames));
    });

    it('strike + spare con tirada adicional', function() {
      let frames = buildFrames([10, 8, 2, 5]);
      chai.assert.equal(3, frames.length);
      chai.assert.isTrue(isStrike(frames[0]));
      chai.assert.isTrue(isSpare(frames[1]));
      chai.assert.isTrue(isIncomplete(frames[2]));
      chai.assert.equal(40, framesToPoints(frames));
    });

    it('strike + spare sin tirada adicional', function() {
      let frames = buildFrames([10, 8, 2, 5, 5]);
      chai.assert.equal(3, frames.length);
      chai.assert.isTrue(isStrike(frames[0]));
      chai.assert.isTrue(isSpare(frames[1]));
      chai.assert.isTrue(isSpare(frames[2]));
      chai.assert.equal(45, framesToPoints(frames));
    });

    it ('maxima puntuacion', function() {
      let frames: Frame[] = buildFrames([10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]);
      chai.assert.equal(10, frames.length);
      frames.forEach(frame => chai.assert.isTrue(isStrike(frame)));
      chai.assert.equal(300, framesToPoints(frames));
    });

    it('spare final', function() {
      let frames = buildFrames([10, 10, 10, 10, 10, 10, 10, 10, 10, 8, 2, 10]);
      chai.assert.equal(10, frames.length);
      chai.assert.isTrue(isSpare(frames[9]));
      chai.assert.equal(278, framesToPoints(frames));
    });
  });
});