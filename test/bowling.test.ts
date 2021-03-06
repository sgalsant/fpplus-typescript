import {Frame, FrameTypes, toFrames, toPoints} from '../src/bownling.js';


describe('bowling', function() {
  describe('strike', function() {
    it('sin tiradas', function() {
      chai.assert.isEmpty(toFrames([]));
    });

    it('una tirada', function() {
      let frames = toFrames([5]);
      chai.assert.equal(1, frames.length);
      chai.assert.equal(FrameTypes.INCOMPLETE, frames[0].type);
      chai.assert.equal(5, toPoints(frames));
    })

    it('dos tiradas', function() {
      let frames = toFrames([5, 4]);
      chai.assert.equal(1, frames.length);
      chai.assert.equal(FrameTypes.NORMAL, frames[0].type);
      chai.assert.equal(9, toPoints(frames));
    })


    it('tres tiradas', function() {
      let frames = toFrames([5, 4, 5]);
      chai.assert.equal(2, frames.length);
      chai.assert.equal(FrameTypes.NORMAL, frames[0].type);
      chai.assert.equal(FrameTypes.INCOMPLETE, frames[1].type);
      chai.assert.equal(14, toPoints(frames));
    })

    it('tiradas con error', function() {
      let frames = toFrames([5, 4, 5, 6, 5, 4]);
      chai.assert.equal(3, frames.length);
      chai.assert.equal(FrameTypes.NORMAL, frames[0].type);
      chai.assert.equal(FrameTypes.ERROR, frames[1].type);
      chai.assert.equal(FrameTypes.NORMAL, frames[2].type);
      chai.assert.equal(18, toPoints(frames));
    })

    it('strike sin tiradas adicionales', function() {
      let frames = toFrames([10]);
      chai.assert.equal(1, frames.length);
      chai.assert.equal(FrameTypes.STRIKE, frames[0].type);
      chai.assert.equal(10, toPoints(frames));
    });

    it('strike con una tirada adicional', function() {
      let frames = toFrames([10, 8]);
      chai.assert.equal(2, frames.length);
      chai.assert.equal(FrameTypes.STRIKE, frames[0].type);
      chai.assert.equal(26, toPoints(frames));
    });

    it('strike con dos tiradas adicionales', function() {
      let frames = toFrames([10, 8, 2]);
      chai.assert.equal(2, frames.length);
      chai.assert.equal(FrameTypes.STRIKE, frames[0].type);
      chai.assert.equal(30, toPoints(frames));
    });

    it('strike consecutivos', function() {
      let frames = toFrames([10, 10, 10]);
      chai.assert.equal(3, frames.length);
      frames.forEach(frame => chai.assert.equal(FrameTypes.STRIKE, frame.type));
      chai.assert.equal(60, toPoints(frames));
    });

    it('strike + spare con tirada adicional', function() {
      let frames = toFrames([10, 8, 2, 5]);
      chai.assert.equal(3, frames.length);
      chai.assert.equal(FrameTypes.STRIKE, frames[0].type);
      chai.assert.equal(FrameTypes.SPARE, frames[1].type);
      chai.assert.equal(FrameTypes.INCOMPLETE, frames[2].type);
      chai.assert.equal(40, toPoints(frames));
    });

    it('strike + spare sin tirada adicional', function() {
      let frames = toFrames([10, 8, 2, 5, 5]);
      chai.assert.equal(3, frames.length);
      chai.assert.equal(FrameTypes.STRIKE, frames[0].type);
      chai.assert.equal(FrameTypes.SPARE, frames[1].type);
      chai.assert.equal(FrameTypes.SPARE, frames[2].type);
      chai.assert.equal(45, toPoints(frames));
    });

    it ('maxima puntuacion', function() {
      let frames = toFrames([10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]);
      chai.assert.equal(10, frames.length);
      frames.forEach(frame => chai.assert.equal(FrameTypes.STRIKE, frame.type));
      chai.assert.equal(300, toPoints(frames));
    });

    it('spare final', function() {
      let frames = toFrames([10, 10, 10, 10, 10, 10, 10, 10, 10, 8, 2, 10]);
      chai.assert.equal(10, frames.length);
      chai.assert.equal(FrameTypes.SPARE, frames[9].type);
      chai.assert.equal(278, toPoints(frames));
    });

  /*  it('strike + spare sin tirada adicional', function() {
      let frames = toFrames([10, 8, 2, 5, 5, 10, 10, 10, 10, 10, 8, 1, 10, 8, 8]);
      chai.assert.equal(10, frames.length);
      chai.assert.equal(45, toPoints(frames));
    });*/
  });
});