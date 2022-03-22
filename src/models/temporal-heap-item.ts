import { iTemporalPriorityQueueEntry } from "./temporal-priority-queue-entry";

/**
 * This will be used internally by the priority queue to hold items
 */
export interface iTemporalHeapItem<T> extends iTemporalPriorityQueueEntry<T> {
    timestampJs: number;
    orderNumber: number;
}
