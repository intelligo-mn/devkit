
import { Injectable } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { filter, share, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class EventManager {
    observable: Observable<EventWithContent<any> | string>;
    observer: Observer<EventWithContent<any> | string>;

    constructor() {
        this.observable = Observable.create((observer: Observer<EventWithContent<any> | string>) => {
            this.observer = observer;
        }).pipe(share());
    }

    broadcast(event: EventWithContent<any> | string): void {
        if (this.observer) {
            this.observer.next(event);
        }
    }

    subscribe(eventName: string, callback: any): Subscription {
        const subscriber: Subscription = this.observable
            .pipe(
                filter((event: EventWithContent<any> | string) => {
                    if (typeof event === 'string') {
                        return event === eventName;
                    }
                    return event.name === eventName;
                }),
                map((event: EventWithContent<any> | string) => {
                    if (typeof event !== 'string') {
                        return event;
                    }
                })
            )
            .subscribe(callback);
        return subscriber;
    }

    destroy(subscriber: Subscription): void {
        subscriber.unsubscribe();
    }
}

export class EventWithContent<T> {
  constructor(public name: string, public content: T) {}
}