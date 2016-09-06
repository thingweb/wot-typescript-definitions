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
    invokeAction(actionName : string, parameter? : any) : Promise<any>
    setProperty(propertyName : string, newValue : any) : Promise<any>
    getProperty(propertyName : string) : Promise<any>
    addListener(eventName : string, listener : (event : Event) => void) : ConsumedThing
    removeListener(eventName : string, listener : (event : Event) => void) : ConsumedThing
    removeAllListeners(eventName : string) : ConsumedThing
    getDescription() : Object 
}

interface ExposedThing {
    name : string
    invokeAction(actionName : string, parameter? : any) : any
    setProperty(propertyName : string, newValue : any) : ExposedThing
    getProperty(propertyName : string) : any
    addListener(eventName : string, listener : (event : Event) => void) : ExposedThing
    removeListener(eventName : string, listener : (event : Event) => void) : ExposedThing
    removeAllListeners(eventName : string) : ExposedThing
    onInvokeAction(actionName : string, cb : (param : any) => any) : ExposedThing
    onUpdateProperty(propertyName : string, cb : (newValue : any, oldValue : any) => void) : ExposedThing
    getDescription() : Object
}

interface DynamicThing extends ExposedThing {
    addProperty(propertyName : string, valueType? : Object) : DynamicThing
    addAction(actionName : string, inputType? : Object, outputType? : Object) : DynamicThing
    addEvent(eventName : string)
    removeProperty(propertyName : string) : boolean
    removeAction(actionName : string) : boolean
    removeEvent(eventName : string) : boolean
}

declare var WoT : WoTFactory;