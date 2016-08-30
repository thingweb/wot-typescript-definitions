/// <reference path="../typings/modules/es6-promise/index.d.ts" />

import {Promise} from 'es6-promise';

interface WoTFactory {
    discover(discoveryType : string, filter : Object)
    consumeDescriptionUri(uri: string): Promise<ConsumedThing>
    consumeDescription(thingDescription : Object): Promise<ConsumedThing>
    createThing(name: string): Promise<ExposedThing>
    createFromDescriptionUri(uri: string): Promise<ExposedThing>
    createFromDescription(thingDescription : Object): Promise<ExposedThing>
}

interface ConsumedThing {
    name : string
    invokeAction(actionName : string, parameter : any) : Promise<any>
    setProperty(propertyName : string, newValue : any) : Promise<any>
    getProperty(propertyName : string) : Promise<any>
    addListener(eventName : string, listener : (event : Event) => void) : ConsumedThing
    removeListener(eventName : string, listener : (event : Event) => void) : ConsumedThing
    removeAllListeners(eventName : string) : ConsumedThing
    getDescription() : Object 
}

interface ExposedThing {
//onInvokeAction etc.
}

interface DynamicThing {
//addproperty etc.
}

declare var WoT : WoTFactory;