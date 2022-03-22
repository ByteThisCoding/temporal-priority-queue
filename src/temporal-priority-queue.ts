import { iTemporalHeapItem } from "./models/temporal-heap-item";
import { iTemporalHeapOptions } from "./models/temporal-heap-options";
import { iTemporalPriorityQueue } from "./models/temporal-priority-queue";

/**
 * This is a type of priority queue which factors in the age of entries
 * 
 * Based on heap implementation from:
 *  ==> https://bytethisstore.com/articles/pg/binary-heap
 */
export class TemporalPriorityQueue<T> implements iTemporalPriorityQueue<T> {
    private heap: iTemporalHeapItem<T>[] = [];

    private opts: iTemporalHeapOptions;
    private orderNumber = 0;

    /**
     * Create the queue and optionally provide certain options
     */
    constructor(opts?: Partial<iTemporalHeapOptions>) {
        // take user options, merge with defaults
        this.opts = {
            timeRankIncreaseMs: 1000 * 60,
            getCurrentTimestampJs: () => +new Date(),
            ...(opts || {})
        }
    }

    /**
     * Add an entry to the queue along with its priority
     */
    enqueue(entry: T, priority: number): void {
        const now = this.opts.getCurrentTimestampJs();
        const newItem: iTemporalHeapItem<T> = {
            entry,
            priority,
            timestampJs: now,
            orderNumber: this.orderNumber++
        };
        this.heap.push(newItem);

        //swap nodes to preserve heap properties
        let nodeIndex = this.heap.length - 1;
        let parentNodeIndex = this.getParentIndex(nodeIndex);

        //first part of condition will fail after root node is processed
        while (
            parentNodeIndex !== -1 &&
            this.priorityCompare(
                this.heap[nodeIndex],
                this.heap[parentNodeIndex]
            ) > 0
        ) {
            this.swapNodes(nodeIndex, parentNodeIndex);
            nodeIndex = parentNodeIndex;
            parentNodeIndex = this.getParentIndex(parentNodeIndex);
        }
    }

    /**
     * Remove the topmost entry
     */
    dequeue(): T | undefined {
        //base case, no nodes present
        if (this.heap.length === 0) {
            return void 0;
        } else if (this.heap.length === 1) {
            this.orderNumber = 0;
            return this.heap.pop()!.entry;
        }

        //otherwise, proceed as normal
        const rootNodeValue = this.heap[0].entry;

        const now = this.opts.getCurrentTimestampJs();

        //swap root with last node, then delete last node
        this.heap[0] = this.heap.pop()!;

        //remove root node and reshift elements to preserve heap properties
        let nodeIndex = 0;
        while (true) {
            const leftChildIndex = this.getLeftChildIndex(nodeIndex);
            const rightChildIndex = this.getRightChildIndex(nodeIndex);

            //find the max child, set that value to current node, and proceed
            if (
                rightChildIndex < this.heap.length &&
                this.priorityCompare(
                    this.heap[rightChildIndex],
                    this.heap[leftChildIndex]
                ) > 0 &&
                this.priorityCompare(
                    this.heap[rightChildIndex],
                    this.heap[nodeIndex]
                ) > 0
            ) {
                this.swapNodes(nodeIndex, rightChildIndex);
                nodeIndex = rightChildIndex;
            } else if (
                leftChildIndex < this.heap.length &&
                this.priorityCompare(
                    this.heap[leftChildIndex],
                    this.heap[nodeIndex]
                ) > 0
            ) {
                this.swapNodes(nodeIndex, leftChildIndex);
                nodeIndex = leftChildIndex;
            } else {
                //both children are out of bounds or tree is settled
                break;
            }
        }
        return rootNodeValue;
    }

    /**
     * View the topmost entry without removing
     */
    peek(): T | undefined {
        return this.heap.length > 0 ? this.heap[0].entry : void 0;
    }

    /**
     * Get the number of items in the priority queue
     */
    size(): number {
        return this.heap.length;
    }

    /**
     * Compare two items with respect to their priorities and their ranks
     */
    private priorityCompare(
        a: iTemporalHeapItem<T>,
        b: iTemporalHeapItem<T>
    ): number {
        const base = a.priority - b.priority + (b.timestampJs - a.timestampJs) / this.opts.timeRankIncreaseMs;
        // tie breaker, use whichever was inserted first
        return base === 0 ? b.orderNumber - a.orderNumber : base;
    }

    /**
     * Get the index of the left child of the node at a given index
     */
    private getLeftChildIndex(index: number) {
        return (index + 1) * 2 - 1;
    }

    /**
     * Get the index of the right child of the node at a given index
     */
    private getRightChildIndex(index: number) {
        return (index + 1) * 2;
    }

    /**
     * Get the index of the parent of the node at a given index
     */
    private getParentIndex(index: number) {
        return Math.floor((index - 1) / 2);
    }

    /**
     * Helper to swap two nodes
     */
    private swapNodes(aIndex: number, bIndex: number) {
        const tmp = this.heap[aIndex];
        this.heap[aIndex] = this.heap[bIndex];
        this.heap[bIndex] = tmp;
    }
}
