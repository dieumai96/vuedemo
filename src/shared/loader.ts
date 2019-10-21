import { BehaviorSubject } from 'rxjs';


const subject = new BehaviorSubject(null);

export const loaderService = {
    setValue: (callBack: any) => subject.next(callBack),
    clearCallBack: () => subject.next(null),
    getValue: () => subject.asObservable(),
    complete: () => subject.complete(),
};