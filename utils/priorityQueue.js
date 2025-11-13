class PriorityQueue {
  heap;
  compare;
  constructor({
    compare
  }) {
    this.heap = []
    this.compare = compare
  }
}