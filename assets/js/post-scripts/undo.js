class Keystroke {
  static Type = {
    Del: 0,
    Ins: 1
  };

  constructor(word, type) {
    this.word = word;
    this.type = type;
    this.populate_offset();
  }

  populate_offset() {
    switch (this.type) {
    case Keystroke.Type.Del:
        this.offset = this.word.length;
        break;
    case Keystroke.Type.Ins:
        this.offset = 0;
        break;
    }
  }

  keystroke() {
    switch (this.type) {
    case Keystroke.Type.Del:
        if (this.offset != 0) {
            this.offset -= 1;
        }
        break;
    case Keystroke.Type.Ins:
        if (this.offset < this.word.length) {
          this.offset += 1;
        }
        break;
    }
  }

  reset() {
    this.populate_offset();
  }

  word_part() {
    return this.word.substr(0, this.offset);
  }

  complete() {
    switch (this.type) {
    case Keystroke.Type.Del:
        return this.offset == 0;
    case Keystroke.Type.Ins:
        return this.offset == this.word.length;
    }
  }
};

const caret = '\uA788'

var undo_basic = function() {
  var world = new Keystroke(" World!", Keystroke.Type.Ins);
  var initial_wait = 10;
  var wait_cycle = 0;
  var speed = 300;
  const undo_basic_id = '#undo-basic'
  // Populate the initial word.
  $(undo_basic_id).text(world.word_part() + caret);
  setInterval(function() {
    if (initial_wait != 0) {
      initial_wait -= 1;
      return;
    }
    if (wait_cycle != 0) {
      wait_cycle -= 1;
      if (wait_cycle == 0) {
        // Reset back to initial and start the new initial wait.
        $(undo_basic_id).text(world.word_part() + caret);
        initial_wait = 10;
      }
      return;
    }
    $(undo_basic_id).text(world.word_part() + caret);
    if (world.complete()) {
      $(undo_basic_id).text(world.word_part() + caret + ' <- apply undo here');
      world.reset();
      wait_cycle = 15;
      return;
    }
    world.keystroke();
  }, speed);
};

class RedoBasicState {
  static State = {
    HitUndo: 0,
    Undone: 1,
    PromptRedo: 2,
    Redone: 3
  };
};

var redo_basic = function() {
  const world = " World!";
  const redo_basic_id = '#redo-basic';
  var state = RedoBasicState.State.HitUndo;
  var wait_cycle = 10;
  var speed = 250;
  // Populate the initial word.
  $(redo_basic_id).text(world + caret + ' <- apply undo here');
  setInterval(function() {
    if (wait_cycle != 0) {
      wait_cycle -= 1;
      return;
    }
    switch (state) {
    case RedoBasicState.State.HitUndo:
        $(redo_basic_id).text(caret);
        state = RedoBasicState.State.Undone;
        wait_cycle = 10;
        break;
    case RedoBasicState.State.Undone:
        $(redo_basic_id).text(caret + ' <- apply redo here');
        state = RedoBasicState.State.PromptRedo;
        wait_cycle = 10;
        break;
    case RedoBasicState.State.PromptRedo:
        $(redo_basic_id).text(world + caret);
        state = RedoBasicState.State.Redone;
        wait_cycle = 10;
        break;
    case RedoBasicState.State.Redone:
        $(redo_basic_id).text(world + caret + ' <- apply undo here');
        state = RedoBasicState.State.HitUndo;
        wait_cycle = 10;
        break;
    }
  }, speed);
};

class UndoHistoryBreakState {
  static State = {
    HitUndo: 0,
    Undone: 1,
    KeystrokesDone: 2,
    TryRedo: 3
  };
};

var undo_history_break = function() {
  const world = " World!";
  const id = '#undo-history-break';
  var cameron = new Keystroke(' Cameron!', Keystroke.Type.Ins);
  var state = UndoHistoryBreakState.State.HitUndo;
  var wait_cycle = 10;
  var speed = 250;
  // Populate the initial word.
  $(id).text(world + caret + ' <- apply undo here');
  setInterval(function() {
    if (wait_cycle != 0) {
      wait_cycle -= 1;
      return;
    }
    switch (state) {
    case UndoHistoryBreakState.State.HitUndo:
        $(id).text(caret);
        state = UndoHistoryBreakState.State.Undone;
        wait_cycle = 10;
        break;
    case UndoHistoryBreakState.State.Undone:
        $(id).text(cameron.word_part() + caret);
        if (cameron.complete()) {
          state = UndoHistoryBreakState.State.KeystrokesDone;
          wait_cycle = 10;
        }
        else {
          cameron.keystroke();
        }
        break;
    case UndoHistoryBreakState.State.KeystrokesDone:
        $(id).text(cameron.word_part() + caret + ' <- cannot redo here');
        cameron.reset();
        state = UndoHistoryBreakState.State.TryRedo;
        wait_cycle = 10;
        break;
    case UndoHistoryBreakState.State.TryRedo:
        $(id).text(world + caret + ' <- apply undo here');
        state = UndoHistoryBreakState.State.HitUndo;
        wait_cycle = 10;
        break;
    }
  }, speed);
};

class UndoHistoryBreakState2 {
  static State = {
    Initial: 0,
    KeystrokeWorldDone: 1,
    HitUndo: 2,
    Undone: 3,
    KeystrokeCameronDone: 4,
    TryRedo: 5
  };
};

var undo_history_break2 = function() {
  const id = '#undo-history-break2';
  var world = new Keystroke(' World!', Keystroke.Type.Ins);
  var cameron = new Keystroke(' Cameron!', Keystroke.Type.Ins);
  var state = UndoHistoryBreakState2.State.Initial;
  var wait_cycle = 10;
  var speed = 250;
  // Populate the initial word.
  $(id).text(caret);
  setInterval(function() {
    if (wait_cycle != 0) {
      wait_cycle -= 1;
      return;
    }
    switch (state) {
    case UndoHistoryBreakState2.State.Initial:
        $(id).text(world.word_part() + caret);
        if (world.complete()) {
          state = UndoHistoryBreakState2.State.KeystrokeWorldDone;
          wait_cycle = 10;
        }
        else {
          world.keystroke();
        }
        break;
    case UndoHistoryBreakState2.State.KeystrokeWorldDone:
        $(id).text(world.word_part() + caret + ' <- apply undo here');
        world.reset();
        state = UndoHistoryBreakState2.State.HitUndo;
        wait_cycle = 10;
        break;
    case UndoHistoryBreakState2.State.HitUndo:
        $(id).text(caret);
        state = UndoHistoryBreakState2.State.Undone;
        wait_cycle = 10;
        break;
    case UndoHistoryBreakState2.State.Undone:
        $(id).text(cameron.word_part() + caret);
        if (cameron.complete()) {
          state = UndoHistoryBreakState2.State.KeystrokeCameronDone;
          wait_cycle = 10;
        }
        else {
          cameron.keystroke();
        }
        break;
    case UndoHistoryBreakState2.State.KeystrokeCameronDone:
        $(id).text(cameron.word_part() + caret + ' <- cannot redo here');
        cameron.reset();
        state = UndoHistoryBreakState2.State.TryRedo;
        wait_cycle = 10;
        break;
    case UndoHistoryBreakState2.State.TryRedo:
        $(id).text(caret);
        state = UndoHistoryBreakState2.State.Initial;
        wait_cycle = 10;
        break;
    }
  }, speed);
};

$(document).ready(function () {
  undo_basic();
  redo_basic();
  undo_history_break();
  undo_history_break2();
});
