export as namespace WoT;

export default WoT;

declare let WoT : WoTFactory;

import {Observable} from 'rxjs/Observable';

/** The WoT object is the main API entry point and it is exposed by an implementation of the WoT Runtime.  */
export interface WoTFactory {
    /**
     * Starts the discovery process that will provide ConsumedThing 
     * 
     * @param filter represents the constraints for discovering Things as key-value pairs
     */
    discover(filter?: ThingFilter): Observable<ConsumedThing>;

    /**
     * Accepts an url argument and returns a Promise of a ThingDescription
     * @param url URL of a thing description
     */
    fetchTD(url: USVString): Promise<ThingDescription>;

    /**
     * Accepts a ThingDescription and returns a ConsumedThing
     * @param url URL of a thing description
     */
    consume(td: ThingDescription): ConsumedThing;

    /**
     * Returns a locally created ExposedThing
     * 
     * @param init dictionary contains properties to initialize a Thing 
     */
    expose(init: ThingTemplate): ExposedThing;

}

/**
 * Dictionary that represents the constraints for discovering Things as key-value pairs. 
 */
export interface ThingFilter {
    method: DiscoveryMethod | string; // default value "any",  DOMString
    url: USVString;
    description: object;
}

/** The DiscoveryMethod enumeration represents the discovery type to be used */
export declare enum DiscoveryMethod {
    /** does not provide any restriction */
    "any",
    /** for discovering Things defined in the same device */
    "local",
    /** for discovering Things nearby the device, e.g. by Bluetooth or NFC  */
    "nearby",
    /** for discovery based on a service provided by a directory or repository of Things  */
    "directory",
    /** for an open ended discovery based on sending a request to a broadcast address  */
    "broadcast",
    /** for a proprietary method defined by the solution */
    "other"
}


/** The ThingTemplate dictionary contains properties to initialize a Thing  */
export interface ThingTemplate  {
    /** The name attribute represents the user given name of the Thing */
    name: string;
    /** additional @types to "Thing" */
    semanticTypes?: SemanticType[];
    /** metadata fields in TD root (same level as 'name')  */
    metadata?: SemanticMetadata[];
}

/** Represents a semantic type annotation, containing a name and a context.  */
export interface SemanticType {
    /** The name attribute represents the name of the semantic type in the given context. */
    name: string;
    /** The context attribute represents an URL link to the context of the semantic classification. */
    context: USVString;
    /** Optional prefix for TD serialization */
    prefix?: string;
}

/** Represents metadata such as "unit": "celsius" */
export interface SemanticMetadata {
    type: SemanticType;
    value: any;
}

/** The ConsumedThing interface is a client API for sending requests to servers in order to retrieve or update properties, invoke Actions, and observe properties, Actions and Events. */
export interface ConsumedThing {
    /** The name read-only attribute represents the name of the Thing. */
    readonly name: string; // DOMString
    /** The td read-only attribute represents the thing description of the Thing.  */
    readonly td: ThingDescription;

    /**
     * Takes the Property name as the name argument, then requests from the underlying platform and the Protocol Bindings to retrieve the Property on the remote Thing and return the result. Returns a Promise that resolves with the Property value or rejects with an Error. 
     * @param propertyName Name of the property 
     */
    readProperty(propertyName: string): Promise<any>

    /**
     * Takes the Property name as the name argument and the new value as the value argument, then requests from the underlying platform and the Protocol Bindings to update the Property on the remote Thing and return the result. Returns a Promise that resolves on success or rejects with an Error. 
     * @param Name of the property
     * @param newValue value to be set  
     */
    writeProperty(propertyName: string, newValue: any): Promise<void>

    /** Takes the Action name from the name argument and the list of parameters, then requests from the underlying platform and the Protocol Bindings to invoke the Action on the remote Thing and return the result. Returns a Promise that resolves with the return value or rejects with an Error. 
     * @param actionName Name of the action to invoke
     * @param parameter optional json object to supply parameters  
    */
    invokeAction(actionName: string, parameter?: any): Promise<any>
    
    /** Observable for subscribing to events */
    onEvent(name: string): Observable<any>;

    /** Observable for subscribing to property changes */
    onPropertyChange(name: string): Observable<any>;

    /** Observable for subscribing to TD changes  */
    onTDChange(): Observable<any>;
}

/** WoT provides a unified representation for data exchange between Things, standardized in the Wot Things Description specification.
 * In this version of the API, Thing Descriptions are represented as opaque strings, denoting a serialized form, for instance JSON or JSON-LD
 */
export declare type ThingDescription = USVString;

/**
 * TODO Linked Data JSON Schema
 */
export declare type ValueType = USVString;

/** Represents the Thing Property description.  */
export interface ThingPropertyInit {
    /** The name attribute provides the Property name. */
    name: string;
    /** The type attribute provides the description of the data. */
    type: ValueType;
    /** The intial value. */
    initValue: any;
    /** Indicates whether property is writable. */
    writable?: boolean; // = false;
    /** Indicates whether property is observable. */
    observable?: boolean;  // = false;
    /** Semantic types (additional @types to "Property"). */
    semanticTypes?: [SemanticType];
    /** metadata fields in Property root (same level as 'name')  */
    metadata?: SemanticMetadata[];
    /** On read callback */
    onRead?(oldValue: any): Promise<any>;
    /** On write callback */
    onWrite?(oldValue: any, newValue: any): void;
}

/** The ThingActionInit dictionary describes the arguments and the return value. */
export interface ThingActionInit {
    /** The name attribute provides the Action name. */
    name: string;
    /** The inputTypes attribute provides the description of the input arguments. */
    inputType: ValueType;
    /** The outputType attribute provides the description of the returned data. */
    outputType: ValueType;
    /** The action attribute provides a function that defines the Action. */
    action: Function;
    /** The semanticTypes attribute provides a list of semantic type annotations (e.g. labels, classifications etc) relevant to the Action, represented as SemanticType dictionaries.  */
    semanticTypes?: [SemanticType];
    /** metadata fields in Action root (same level as 'name')  */
    metadata?: SemanticMetadata[];
}

export interface ThingEventInit {
    /** The name attribute represents the event name. */
    name: string;
    /** The type attribute provides the description of the data. */
    type: ValueType;
    /** The semanticTypes attribute represent a list of semantic type annotations attached to the event. */
    semanticTypes?: [SemanticType];
    /** metadata fields in Event root (same level as 'name')  */
    metadata?: SemanticMetadata[];
}

export interface ExposedThing extends ConsumedThing {    

    /** Start serving external requests for the Thing.  */
    start(): Promise<void>
    
    /** Stop serving external requests for the Thing.  */
    stop(): Promise<void>

    /** Generates the Thing Description given the properties, Actions and Event defined for this object. If a directory argument is given, make a request to register the Thing Description with the given WoT repository by invoking its register Action. */
    register(directory: USVString): Promise<void>

    /** If a directory argument is given, make a request to unregister the Thing Description with the given WoT repository by invoking its unregister Action. Then, and in the case no arguments were provided to this function, stop the Thing and remove the Thing Description. */
    unregister(directory: USVString): Promise<void>

    /** Emits an the event initialized with the event name specified by the eventName argument and data specified by the payload argument.  */
    emitEvent(eventName: string, payload: any): Promise<void>




    /**
     * Adds a Property defined by the argument and updates the Thing Description
     */
    addProperty(property: ThingPropertyInit): ExposedThing

    /**
     * Removes the Property specified by the name argument, updates the Thing Description and returns the object. 
     */
    removeProperty(propertyName: string): ExposedThing
    
    /**
     * Adds an Action to the Thing object as defined by the action argument of type ThingActionInit and updates the Thing Description. 
     */
    addAction(action: ThingActionInit): ExposedThing
    
    /**
     * Removes the Action specified by the name argument, updates the Thing Description and returns the object. 
     */
    removeAction(actionName: string): ExposedThing

    /**
     * Adds an event to the Thing object as defined by the event argument of type ThingEventInit and updates the Thing Description. 
     */
    addEvent(event: ThingEventInit): ExposedThing
    
    /**
     * Removes the event specified by the name argument, updates the Thing Description and returns the object. 
     */
    removeEvent(eventName: string): ExposedThing
}
