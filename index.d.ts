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
     * Accepts an url argument and returns a Promise of a ConsumedThing
     * @param url URL of a thing description
     */
    consume(url: USVString): Promise<ConsumedThing>;

    /**
     * Returns a Promise of a locally created ExposedThing
     * 
     * @param init dictionary contains properties to initialize a Thing 
     */
    expose(init: ThingInit): Promise<ExposedThing>;

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


/** The ThingInit dictionary contains properties to initialize a Thing  */
export interface ThingInit {
    /** The name attribute represents the user given name of the Thing */
    name: string; // DOMString
    /** The url attribute represents the address of the Thing */
    url: USVString;
    /** The description attribute represents the Thing Description of the Thing */
    description: object; // Dictionary
}

/** The ConsumedThing interface is a client API for sending requests to servers in order to retrieve or update properties, invoke Actions, and observe properties, Actions and Events. */
export interface ConsumedThing {
    /** The name read-only attribute represents the name of the Thing. */
    readonly name: string; // DOMString
    /**  The url read-only attribute represents the URL of the Thing. */
    readonly url: USVString;
    /** The description attribute read-only attribute represents the description of the Thing.  */
    readonly description: ThingDescription;

    /** Takes the Action name from the name argument and the list of parameters, then requests from the underlying platform and the Protocol Bindings to invoke the Action on the remote Thing and return the result. Returns a Promise that resolves with the return value or rejects with an Error. 
     * @param actionName Name of the action to invoke
     * @param parameter optional json object to supply parameters  
    */
    invokeAction(actionName: string, parameter?: any): Promise<any>

    /**
     * Takes the Property name as the name argument and the new value as the value argument, then requests from the underlying platform and the Protocol Bindings to update the Property on the remote Thing and return the result. Returns a Promise that resolves on success or rejects with an Error. 
     * @param Name of the property
     * @param newValue value to be set  
     */
    setProperty(propertyName: string, newValue: any): Promise<any>

    /**
     * Takes the Property name as the name argument, then requests from the underlying platform and the Protocol Bindings to retrieve the Property on the remote Thing and return the result. Returns a Promise that resolves with the Property value or rejects with an Error. 
     * @param propertyName Name of the property 
     */
    getProperty(propertyName: string): Promise<any>

    /** Adds the listener provided in the argument listener to the Event name provided in the argument eventName. */
    addListener(eventName: string, listener: ThingEventListener): ConsumedThing

    /** Removes a listener from the Event identified by the provided eventName and listener argument.  */
    removeListener(eventName: string, listener: ThingEventListener): ConsumedThing

    /** Removes all listeners for the Event provided by the eventName optional argument, or if that was not provided, then removes all listeners from all Events. */
    removeAllListeners(eventName: string): ConsumedThing

    /** Returns an Observable for the Property, Event or Action specified in the name argument, allowing subscribing and unsubscribing to notifications. The requestType specifies whether a Property, an Event or an Action is observed.  */
    observe(name: string, requestType: RequestType): Observable<any>;
}

/** A function called with an Event object when an event is emitted.  */
export declare type ThingEventListener = (event: Event) => void;


export interface PropertyChangeEvent extends Event {
    /** The data attribute represents the changed Property. */
    readonly data: PropertyChangeEventInit;
}
/** The PropertyChangeEventInit dictionary */
export interface PropertyChangeEventInit {
    /** The name attribute represents the Property name. */
    name: string;
    /** The value attribute represents the new value of the Property. */
    value: any;
}

export interface ActionInvocationEvent extends Event {
    readonly data: ActionInvocationEventInit;
}
/** The ActionInvocationEventInit dictionary */
export interface ActionInvocationEventInit {
    actionName: string;
    returnValue: any;
}

export interface ThingDescriptionChangeEvent extends Event {
    readonly data: ThingDescriptionChangeEventInit;
}
/** The ThingDescriptionChangeEventInit dictionary */
export interface ThingDescriptionChangeEventInit {
    /** The type attribute represents the change type, whether has it been applied on properties, Actions or Events. */
    type: TDChangeType;
    /** The method attribute tells what operation has been applied, addition, removal or change.  */
    method: TDChangeMethod;
    /** The name attribute represents the name of the Property, Action or event that has changed.  */
    name: string;
    /** The data attribute provides the initialization data for the added or changed elements.  */
    data: TDChangeData;
    /** The description attribute is defined for the addition and change methods, and represents the new description.  */
    description: ThingDescription;
}

/** The TDChangeMethod enumeration */
export declare enum TDChangeMethod {
    /** The add value denotes addition of a Property, Action or event. */
    "add",
    /** The remove value denotes removal of a Property, Action or event. */
    "remove",
    /** The change value denotes a change applied on a Property, Action or event. */
    "change"
}

/** The TDChangeType enumeration */
export declare enum TDChangeType {
    /** The property value tells the operation was applied on a Property definition. */
    "property",
    /** The action value tells the operation was applied on a action definition. */
    "action",
    /** The event value tells the operation was applied on an event definition. */
    "event"
}

/** Represents the new description of the changed element. Depending on the change type, it can be either a ThingPropertyInit, ThingActionInit, or ThingEventInit.  */
export declare type TDChangeData = ThingPropertyInit | ThingActionInit | ThingEventInit;


/** The RequestType specifies whether a Property, an Event or an Action is observed */
export declare enum RequestType {
    /** The value "property" represents requests to retrieve or update a Property. */
    "property",
    /** The value "action" represents requests to invoke an Action */
    "action",
    /** The value "event" represents requests to emit an event */
    "event",
    /** The value "td" represents requests to change the Thing Description, i.e. to add, remove or modify properties, Actions or Events */
    "td"
}



/** WoT provides a unified representation for data exchange between Things, standardized in the Wot Things Description specification.
 * In this version of the API, Thing Descriptions are represented as opaque strings, denoting a serialized form, for instance JSON or JSON-LD
 */
export declare type ThingDescription = USVString;

/** A function called with an Event object when an event is emitted.  */
// export declare type RequestHandler  = (request: Request) => any;
export interface RequestHandler {
    request: Request;
    callback: (param?: any) => any;
}

/** Represents an incoming request the ExposedThing is supposed to handle, for instance retrieving and updating properties, invoking Actions and observing Events (WoT interactions).  */
export interface Request {
    /** The type attribute represents the type of the request as defined in RequestType.  */
    readonly type: RequestType;
    /** The from attribute represents the address of the client device issuing the request. The type of the address (URL, UUID or other) is defined by the Thing Description. */
    readonly from: USVString;
    /** The name attribute represents the name of the Property to be retrieved or updated, or the name of the invoked Action, or the event name to be observed.  */
    readonly name: string;
    /** The options attribute represents the options relevant to the request (e.g. the format or measurement units for the returned value) as key-value pairs. The exact format is specified by the Thing Description.  */
    readonly options:  any;
    /** The data attribute represents the value of the Property, or the input data (arguments) of an Action. It is not used for retrieve requests and event requests, only for Property update and Action invocation requests.  */
    readonly data:  any;
    /** Sends a positive response to the Request based on the Protocol Bindings and includes the data specified by the data argument.  */
    respond(response: any): Promise<any>;
    /** Sends a negative response to the Request based on the Protocol Bindings and includes the error specified by the error argument.  */
    respondWithError(error: Error): void;
}

/** Represents a semantic type annotation, containing a name and a context.  */
export interface SemanticType {
    /** The name attribute represents the name of the semantic type in the given context. */
    name: string;
    /** The context attribute represents an URL link to the context of the semantic classification. */
    context: USVString;
}

/** Represents the Thing Property description.  */
export interface ThingPropertyInit {
    name: string
    configurable: boolean; // = false;
    enumerable: boolean; // = true;
    writable: boolean; // = true;
    observable: boolean; // = false;
    semanticTypes: [SemanticType];
    description: ThingDescription;
    value: any;
}

/** The ThingActionInit dictionary describes the arguments and the return value. */
export interface ThingActionInit {
    /** The name attribute provides the Action name. */
    name: string;
    /** The inputDataDescription attribute provides the description of the input arguments. */
    inputDataDescription: ThingDescription;
    /** The outputDataDescription attribute provides the description of the returned data. */
    outputDataDescription: ThingDescription;
    /** The semanticTypes attribute provides a list of semantic type annotations (e.g. labels, classifications etc) relevant to the Action, represented as SemanticType dictionaries.  */
    semanticTypes: [SemanticType];
    /** The action attribute provides a function that defines the Action. */
    action: Function;
}

export interface ThingEventInit {
    /** The name attribute represents the event name. */
    name: string;
    /** The semanticTypes attribute represent a list of semantic type annotations attached to the event. */
    semanticTypes: [SemanticType];
    /** The dataDescription attribute represents the description of the data that is attached to the event. */
    dataDescription: ThingDescription;
}

export interface ExposedThing extends ConsumedThing {

    // define Thing Description modifiers

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

    
    // define request handlers

    /**
     * Registers the handler function for Property retrieve requests received for the Thing, as defined by the handler property of type RequestHandler. The handler will receive an argument request of type Request where at least request.name is defined and represents the name of the Property to be retrieved.
     */
    onRetrieveProperty(handler: RequestHandler): ExposedThing
    
    /**
     * Defines the handler function for Property update requests received for the Thing, as defined by the handler property of type RequestHandler. The handler will receive an argument request of type Request where request.name defines the name of the Property to be retrieved and request.data defines the new value of the Property. 
     */
    onUpdateProperty(handler: RequestHandler): ExposedThing

    /**
     * Defines the handler function for Action invocation requests received for the Thing, as defined by the handler property of type RequestHandler. The handler will receive an argument request of type Request where request.name defines the name of the Action to be invoked and request.data defines the input arguments for the Action as defined by the Thing Description.
     */
    onInvokeAction(handler: RequestHandler): ExposedThing

    /**
     * Defines the handler function for observe requests received for the Thing, as defined by the handler property of type RequestHandler
     */
    onObserve(handler: RequestHandler): ExposedThing


    // define how to expose and run the Thing

    /** Generates the Thing Description given the properties, Actions and Event defined for this object. If a directory argument is given, make a request to register the Thing Description with the given WoT repository by invoking its register Action. */
    register(directory?: USVString): Promise<void>

    /** If a directory argument is given, make a request to unregister the Thing Description with the given WoT repository by invoking its unregister Action. Then, and in the case no arguments were provided to this function, stop the Thing and remove the Thing Description. */
    unregister(directory?: USVString): Promise<void>

    /** Start serving external requests for the Thing.  */
    start(): Promise<void>

    /** Stop serving external requests for the Thing.  */
    stop(): Promise<void>

    /** Emits an the event initialized with the event name specified by the eventName argument and data specified by the payload argument.  */
    emitEvent(eventName: string, payload: any): Promise<void>
}
