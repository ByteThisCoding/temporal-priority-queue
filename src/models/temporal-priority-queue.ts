export interface iTemporalPriorityQueue<T> {

    /**
     * Add an entry to the queue along with its priority
     */
    enqueue(item: T, priority: number): void;

    /**
     * Remove the topmost entry
     */
    dequeue(): T | undefined;

    /**
     * View the topmost entry without removing
     */
    peek(): T | undefined;

    /**
     * Get the number of items in the priority queue
     */
    size(): number;
}
