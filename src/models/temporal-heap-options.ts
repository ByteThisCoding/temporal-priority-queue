/**
 * Options that can be used to fine tune the behavior of the temporal priority queue
 */
export interface iTemporalHeapOptions {
    // time it takes for an item to increase its priority
    timeRankIncreaseMs: number;
    // method to determine the current millisecond (useful to stub for unit testing or other purposes)
    getCurrentTimestampJs: () => number
}