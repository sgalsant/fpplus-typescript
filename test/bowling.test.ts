import {FrameTypes, buildFrames, toType, framesToPoints} from '../src/bownling.js';


describe('bowling', function() {
  describe('strike', function() {
    it('sin tiradas', function() {
      chai.assert.isEmpty(buildFrames([]));
    });

    it('una tirada', function() {
      let frames = buildFrames([5]);
      chai.assert.equal(1, frames.length);
      chai.assert.equal(FrameTypes.INCOMPLETE, toType(frames[0]));
      chai.assert.equal(5, framesToPoints(frames));
    })

    it('dos tiradas', function() {
      let frames = buildFrames([5, 4]);
      chai.assert.equal(1, frames.length);
      chai.assert.equal(FrameTypes.NORMAL, toType(frames[0]));
      chai.assert.equal(9, framesToPoints(frames));
    })


    it('tres tiradas', function() {
      let frames = buildFrames([5, 4, 5]);
      chai.assert.equal(2, frames.length);
      chai.assert.equal(FrameTypes.NORMAL, toType(frames[0]));
      chai.assert.equal(FrameTypes.INCOMPLETE, toType(frames[1]));
      chai.assert.equal(14, framesToPoints(frames));
    })

    it('tiradas con error', function() {
      let frames = buildFrames([5, 4, 5, 6, 5, 4]);
      chai.assert.equal(3, frames.length);
      chai.assert.equal(FrameTypes.NORMAL, toType(frames[0]));
      chai.assert.equal(FrameTypes.ERROR, toType(frames[1]));
      chai.assert.equal(FrameTypes.NORMAL, toType(frames[2]));
      chai.assert.equal(18, framesToPoints(frames));
    })

    it('strike sin tiradas adicionales', function() {
      let frames = buildFrames([10]);
      chai.assert.equal(1, frames.length);
      chai.assert.equal(FrameTypes.STRIKE, toType(frames[0]));
      chai.assert.equal(framesToPoints(frames), 10);
    });

    it('strike con una tirada adicional', function() {
      let frames = buildFrames([10, 8]);
      chai.assert.equal(2, frames.length);
      chai.assert.equal(FrameTypes.STRIKE, toType(frames[0]));
      chai.assert.equal(framesToPoints(frames), 26);
    });

    it('strike con dos tiradas adicionales', function() {
      let frames = buildFrames([10, 8, 2]);
      chai.assert.equal(2, frames.length);
      chai.assert.equal(FrameTypes.STRIKE, toType(frames[0]));
      chai.assert.equal(30, framesToPoints(frames));
    });

    it('strike con dos tiradas adicionales erroneas', function() {
      let frames = buildFrames([10, 8, 4]);
      chai.assert.equal(2, frames.length);
      chai.assert.equal(FrameTypes.ERROR, toType(frames[0]));
      chai.assert.equal(FrameTypes.ERROR, toType(frames[1]));
      chai.assert.equal(0, framesToPoints(frames));
    });

    it('strike con una tirada adicional 10', function() {
      let frames = buildFrames([10, 10, 4]);
      chai.assert.equal(3, frames.length);
      chai.assert.equal(FrameTypes.STRIKE, toType(frames[0]));
      chai.assert.equal(FrameTypes.STRIKE, toType(frames[1]));
      chai.assert.equal(FrameTypes.INCOMPLETE, toType(frames[2]));
      chai.assert.equal(42, framesToPoints(frames));
    });

    it('strike con dos tiradas adicionales 10', function() {
      let frames = buildFrames([10, 10, 10]);
      chai.assert.equal(3, frames.length);
      chai.assert.equal(FrameTypes.STRIKE, toType(frames[0]));
      chai.assert.equal(FrameTypes.STRIKE, toType(frames[1]));
      chai.assert.equal(FrameTypes.STRIKE, toType(frames[2]));
      chai.assert.equal(60, framesToPoints(frames));
    });

    it('strike consecutivos', function() {
      let frames = buildFrames([10, 10, 10]);
      chai.assert.equal(3, frames.length);
      frames.forEach(frame => chai.assert.equal(FrameTypes.STRIKE, toType(frame)));
      chai.assert.equal(60, framesToPoints(frames));
    });

    it('strike + spare con tirada adicional', function() {
      let frames = buildFrames([10, 8, 2, 5]);
      chai.assert.equal(3, frames.length);
      chai.assert.equal(FrameTypes.STRIKE, toType(frames[0]));
      chai.assert.equal(FrameTypes.SPARE, toType(frames[1]));
      chai.assert.equal(FrameTypes.INCOMPLETE, toType(frames[2]));
      chai.assert.equal(40, framesToPoints(frames));
    });

    it('strike + spare sin tirada adicional', function() {
      let frames = buildFrames([10, 8, 2, 5, 5]);
      chai.assert.equal(3, frames.length);
      chai.assert.equal(FrameTypes.STRIKE, toType(frames[0]));
      chai.assert.equal(FrameTypes.SPARE, toType(frames[1]));
      chai.assert.equal(FrameTypes.SPARE, toType(frames[2]));
      chai.assert.equal(45, framesToPoints(frames));
    });

    it ('maxima puntuacion', function() {
      let frames = buildFrames([10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]);
      chai.assert.equal(10, frames.length);
      frames.forEach(frame => chai.assert.equal(FrameTypes.STRIKE, toType(frame)));
      chai.assert.equal(300, framesToPoints(frames));
    });

    it('spare final', function() {
      let frames = buildFrames([10, 10, 10, 10, 10, 10, 10, 10, 10, 8, 2, 10]);
      chai.assert.equal(10, frames.length);
      chai.assert.equal(FrameTypes.SPARE, toType(frames[9]));
      chai.assert.equal(278, framesToPoints(frames));
    });
  });
});