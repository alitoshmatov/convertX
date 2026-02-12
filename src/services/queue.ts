import { MAX_CONCURRENT_CONVERSIONS } from "../utils/config";

interface QueueTask<T> {
  execute: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
}

class ConversionQueue {
  private queue: QueueTask<any>[] = [];
  private running = 0;
  private maxConcurrent: number;

  constructor(maxConcurrent = MAX_CONCURRENT_CONVERSIONS) {
    this.maxConcurrent = maxConcurrent;
  }

  enqueue<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ execute: task, resolve, reject });
      this.processNext();
    });
  }

  private async processNext() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) return;

    this.running++;
    const task = this.queue.shift()!;

    try {
      const result = await task.execute();
      task.resolve(result);
    } catch (err) {
      task.reject(err);
    } finally {
      this.running--;
      this.processNext();
    }
  }

  get pendingCount() {
    return this.queue.length;
  }

  get activeCount() {
    return this.running;
  }
}

export const conversionQueue = new ConversionQueue();
