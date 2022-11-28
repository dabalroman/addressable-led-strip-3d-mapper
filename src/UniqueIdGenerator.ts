class UniqueIdGenerator {
    lastId: number = 0;

    getId (): number {
        return this.lastId++;
    }

    init (startValue: number = 0): void {
        this.lastId = startValue;
    }
}

const gUniqueIdGenerator: UniqueIdGenerator = new UniqueIdGenerator();
export default gUniqueIdGenerator;
