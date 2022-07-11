export interface IUserService<T> {
    save(element: T): Promise<T>;
    update(element: T): Promise<T>;
    delete(element: T): Promise<T>;
    find(): Promise<T[]>;
    // findById(id: number): Promise<T | undefined>;
    // findByIdAndUpdate(id: number, element: T): Promise<T | undefined>;
    // findByIdAndDelete(id: number): Promise<T | undefined>;
}
