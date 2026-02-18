import type { H3Event } from "h3";
import BaseController from "~~/server/controllers/base.controller";
import { db } from "~~/server/database";
import BaseRepository from "~~/server/repositories/base.repository";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T> = new (...args: any[]) => T;

interface InjectableClass<T> extends Constructor<T> {
    deps?: Constructor<unknown>[];
}

class Container {
    private registry = new Map<Constructor<unknown>, unknown>();

    private wrap<T extends object>(event: H3Event, instance: T) {
        return new Proxy<T>(instance, {
            get(target, prop, receiver) {
                const value = Reflect.get(target, prop, receiver);

                if (typeof value !== "function") return value;

                const isAsync = value.constructor.name === "AsyncFunction";

                if (isAsync) {
                    return async (...args: unknown[]) => {
                        const { data, error } = await tryCatch(value.apply(target, args));
                        BaseController.mapDomainResultToHttp(event, error);
                        return data;
                    };
                }

                return (...args: unknown[]) => {
                    const { data, error } = tryCatchSync(() => value.apply(target, args));
                    BaseController.mapDomainResultToHttp(event, error);
                    return data;
                };
            },
        });
    }

    /**
     * Automatically injects dependencies into dependency-injectable classes and returns the created instance.
     * All method calls on the created class instance will be automatically error-handled and do not require any
     * try/catch if you pass the event as the second argument.
     */
    resolve<T extends object>(injectable: InjectableClass<T>, event?: H3Event) {
        const r = <T>(injectable: InjectableClass<T>, resolvingStack = new Set<Constructor<unknown>>()): T => {
            if (resolvingStack.has(injectable)) {
                const chain = [...resolvingStack, injectable].map(c => c.name).join(" -> ");
                throw new Error(`Circular dependency detected: ${chain}`);
            }

            const existing = this.registry.get(injectable);
            if (existing) return existing as T;

            resolvingStack.add(injectable);

            const depsInstances = (injectable.deps || []).map(dep => r(dep, new Set([...resolvingStack])));
            const isRepository = injectable.prototype instanceof BaseRepository;
            const instance = isRepository ? new injectable(db, ...depsInstances) : new injectable(...depsInstances);

            this.registry.set(injectable, instance);

            return instance;
        };
        const instance = r(injectable);

        if (!event) return instance;
        return this.wrap(event, instance);
    }
}

let container: Container | undefined;

export function createContainer() {
    if (!container) {
        container = new Container();
    }
    return container;
}

export function resetContainer() {
    container = undefined;
}
