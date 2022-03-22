import { TemporalPriorityQueue } from "./temporal-priority-queue";

describe("TemporalPriorityQueue", () => {

    it("should add multiple items of same priority, then poll in same order", () => {
        const items = [
            "abc",
            "def",
            "ghi"
        ];
        const priority = 1;

        const queue = new TemporalPriorityQueue<string>();
        for (const item of items) {
            queue.enqueue(item, priority);
        }

        const outItems: string[] = [];
        while (queue.size() > 0) {
            outItems.push(queue.dequeue()!);
        } 

        expect(outItems).toEqual(items);
    });

    it("should return items in order of priority", () => {
        const items = [{
            priority: 1, 
            item: "abc",
        }, {
            priority: 2,
            item: "def"
        }, {
            priority: 0,
            item: "ghi"
        }, {
            priority: 5,
            item: "jkl"
        }];

        const queue = new TemporalPriorityQueue<string>();
        for (const {item, priority} of items) {
            queue.enqueue(item, priority);
        }

        items.sort((a, b) => b.priority - a.priority);

        const outItems: string[] = [];
        while (queue.size() > 0) {
            const dequeued = queue.dequeue()!;
            outItems.push(dequeued);
        }

        expect(outItems).toEqual(items.map(item => item.item));
    });

});