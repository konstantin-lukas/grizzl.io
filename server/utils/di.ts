import { db } from "~~/server/database";
import BaseRepository from "~~/server/repositories/base.repository";

// eslint-disable-next-line
type Constructor<T> = new (...args: any[]) => T;

interface InjectableClass<T> extends Constructor<T> {
    deps: Constructor<unknown>[];
}

interface MaybeInjectableClass<T> extends Constructor<T> {
    deps?: Constructor<unknown>[];
}

class Container {
    private registry = new Map<Constructor<unknown>, unknown>();

    resolve<T>(injectable: InjectableClass<T>): T {
        const r = <T>(injectable: MaybeInjectableClass<T>, resolvingStack = new Set<Constructor<unknown>>()): T => {
            if (resolvingStack.has(injectable)) {
                const chain = [...resolvingStack, injectable].map(c => c.name).join(" -> ");
                throw new Error(`Circular dependency detected: ${chain}`);
            }

            const existing = this.registry.get(injectable);
            if (existing) return existing as T;

            resolvingStack.add(injectable);

            const depsInstances = (injectable.deps || []).map(dep => r(dep, new Set([...resolvingStack])));
            const instance =
                injectable.prototype instanceof BaseRepository
                    ? new injectable(db, ...depsInstances)
                    : new injectable(...depsInstances);

            this.registry.set(injectable, instance);

            return instance;
        };
        return r(injectable);
    }
}

export function createContainer() {
    return new Container();
}
