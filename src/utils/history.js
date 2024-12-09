export class HistoryManager {
  constructor(graph, limit = 50) {
    this.graph = graph;
    this.limit = limit;
    this.history = [];
    this.redoStack = [];
  }

  saveAction() {
    if (this.history.length >= this.limit) {
      this.history.shift();
    }
    this.history.push(this.graph.toJSON());
    this.redoStack = []; // Clear redo stack on new action
  }

  undo() {
    if (this.history.length > 0) {
      const currentState = this.graph.toJSON();
      this.redoStack.push(currentState);
      const previousState = this.history.pop();
      this.graph.fromJSON(previousState);
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const nextState = this.redoStack.pop();
      this.history.push(this.graph.toJSON());
      this.graph.fromJSON(nextState);
    }
  }
}