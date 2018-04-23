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
    fetch(url: USVString): Promise<ThingDescription>;

    /**
     * Accepts a ThingDescription and returns a ConsumedThing
     * @param url URL of a thing description
     */
    consume(td: ThingDescription): ConsumedThing;

    /**
     * Accepts a model argument of type ThingModel and returns an ExposedThing object
     * 
     * @param model can be either a ThingTemplate, or a ThingDescription. 
     */
    produce(model: ThingModel): ExposedThing;

}


/** WoT provides a unified representation for data exchange between Things, standardized in the Wot Things Description specification.
 * In this version of the API, Thing Descriptions are represented as opaque strings, denoting a serialized form, for instance JSON or JSON-LD
 */
export declare type ThingDescription = USVString;

/** The ThingTemplate dictionary contains properties to initialize a Thing  */
export interface ThingTemplate extends SemanticAnnotations {
    /** The name attribute represents the user given name of the Thing */
    name: string;
}

/** A Thing model is used for producing a new ExposedThing and can be either a ThingTemplate, or a ThingDescription.  */
export declare type ThingModel = (ThingDescription | ThingTemplate);

/**
 * Dictionary that represents the constraints for discovering Things as key-value pairs. 
 */
export interface ThingFilter {
    /**
     * The method property represents the discovery type that should be used in the discovery process. The possible values are defined by the DiscoveryMethod enumeration that can be extended by string values defined by solutions (with no guarantee of interoperability). 
     */
    method: DiscoveryMethod | string; // default value "any",  DOMString
    /**
     * The url property represents additional information for the discovery method, such as the URL of the target entity serving the discovery request, such as a Thing Directory or a Thing.
     */
    url: USVString;
    /**
     * The query property represents a query string accepted by the implementation, for instance a SPARQL query. 
     */
    query: USVString;
    /**
     * The constraints property represents additional information for the discovery method in the form of a list of sets of property-value pairs (dictionaries). The list elements (dictionaries) are in OR relationship, and within a constraint dictionary the key-value pairs are in AND relationship
     */
    constraints: Array<Map<any, any>>; // Dictionary
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

/** A dictionary that provides the semantic types and semantic metadata.  */
export interface SemanticAnnotations {
    semanticType?: Array<SemanticType>;
    metadata?: Array<SemanticMetadata>;
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

    /** The name property represents the name of the Thing as specified in the TD. In this version it is read only.  */
    readonly name : string;

    /**
     * Returns the Thing Description of the Thing. 
     */
    getThingDescription(): ThingDescription;

    /**
     * Takes the Property name as the name argument, then requests from the underlying platform and the Protocol Bindings to retrieve the Property on the remote Thing and return the result. Returns a Promise that resolves with the Property value or rejects with an Error. 
     * @param propertyName Name of the property 
     */
    readProperty(propertyName: string): Promise<any>;

    /**
     * Takes the Property name as the name argument and the new value as the value argument, then requests from the underlying platform and the Protocol Bindings to update the Property on the remote Thing and return the result. Returns a Promise that resolves on success or rejects with an Error. 
     * @param Name of the property
     * @param newValue value to be set  
     */
    writeProperty(propertyName: string, newValue: any): Promise<void>;

    /** Observable for subscribing to property changes */
    onPropertyChange(name: string): Observable<any>;

    /** Takes the Action name from the name argument and the list of parameters, then requests from the underlying platform and the Protocol Bindings to invoke the Action on the remote Thing and return the result. Returns a Promise that resolves with the return value or rejects with an Error. 
     * @param actionName Name of the action to invoke
     * @param parameter optional json object to supply parameters  
    */
    invokeAction(actionName: string, parameter?: any): Promise<any>;
    
    /** Observable for subscribing to events */
    onEvent(name: string): Observable<any>;

    /** Observable for subscribing to TD changes  */
    onTDChange(): Observable<any>;
}

/**
 * TODO Linked Data Schema
 */
export declare type DataSchema = USVString;


/** Represents the Thing Property description.  */
export interface ThingProperty extends SemanticAnnotations {
    /** The name attribute provides the Property name. */
    name: string;
    /** The type attribute provides the description of the data. */
    schema: DataSchema;
    /** The intial value. */
    value?: any;
    /** Indicates whether property is writable. */
    writable?: boolean; // = true;
    /** Indicates whether property is observable. */
    observable?: boolean;  // = true;
}

/** The ThingActionInit dictionary describes the arguments and the return value. */
export interface ThingAction extends SemanticAnnotations  {
    /** The name attribute provides the Action name. */
    name: string;
    /** The inputDataDescription attribute provides the description of the input arguments (argument list is represented by an object). If missing, it means the action does not accept arguments. */
    inputSchema?: DataSchema;
    /** The outputDataDescription attribute provides the description of the returned data. If missing, it means the action does not return data. */
    outputSchema?: DataSchema;
    // /** The action attribute provides a function that defines the Action. */
    // action: Function;
}

export interface ThingEvent extends SemanticAnnotations  {
    /** The name attribute represents the event name. */
    name: string;
    /** The type attribute provides the description of the data. */
    schema?: DataSchema;
}

export interface ExposedThing extends ConsumedThing {    
    // define how to expose and run the Thing

    /** Start serving external requests for the Thing.  */
    start(): Promise<void>
    
    /** Stop serving external requests for the Thing.  */
    stop(): Promise<void>

    /** Generates the Thing Description given the properties, Actions and Event defined for this object. If a directory argument is given, make a request to register the Thing Description with the given WoT repository by invoking its register Action. */
    register(directory?: USVString): Promise<void>

    /** If a directory argument is given, make a request to unregister the Thing Description with the given WoT repository by invoking its unregister Action. Then, and in the case no arguments were provided to this function, stop the Thing and remove the Thing Description. */
    unregister(directory?: USVString): Promise<void>

    /** Emits an the event initialized with the event name specified by the eventName argument and data specified by the payload argument.  */
    emitEvent(eventName: string, payload: any): Promise<void>


    // define Thing Description modifiers

    /**
     * Adds a Property defined by the argument and updates the Thing Description
     */
    addProperty(property: ThingProperty): ExposedThing

    /**
     * Removes the Property specified by the name argument, updates the Thing Description and returns the object. 
     */
    removeProperty(propertyName: string): ExposedThing
    
    /**
     * Adds an Action to the Thing object as defined by the action argument of type ThingActionInit and updates the Thing Description. 
     */
    addAction(action: ThingAction): ExposedThing
    
    /**
     * Removes the Action specified by the name argument, updates the Thing Description and returns the object. 
     */
    removeAction(actionName: string): ExposedThing

    /**
     * Adds an event to the Thing object as defined by the event argument of type ThingEventInit and updates the Thing Description. 
     */
    addEvent(event: ThingEvent): ExposedThing
    
    /**
     * Removes the event specified by the name argument, updates the Thing Description and returns the object. 
     */
    removeEvent(eventName: string): ExposedThing

    // define request handlers

    /**
     * Takes a propertyName as string argument, and a readHandler argument of type PropertyReadHandler. Sets the handler function for reading the specified Property matched by propertyName if propertyName is specified, otherwise sets it for reading any property. Throws on error. Returns a reference to the same object for supporting chaining. 
     * 
     * @param propertyName 
     * @param readHandler 
     */
    setPropertyReadHandler(propertyName : string, readHandler: PropertyReadHandler) : ExposedThing;

    /**
     * Takes a propertyName as string argument, and a writeHandler argument of type PropertyWriteHandler. Sets the handler function for writing the specified Property matched by propertyName if the propertyName is specified, otherwise sets it for writing any properties. Throws on error. Returns a reference to the same object for supporting chaining. 
     * 
     * @param propertyName 
     * @param write 
     */
    setPropertyWriteHandler(propertyName : string, writeHandler: PropertyWriteHandler) : ExposedThing;

    /**
     * Takes a actionName as string argument, and an action argument of type ActionHandler. Sets the handler function for the specified Action matched by actionName if actionName is specified, otherwise sets it for any action. Throws on error. Returns a reference to the same object for supporting chaining. 
     * 
     * @param actionName 
     * @param action 
     */
    setActionHandler(actionName : string, action: ActionHandler, ) : ExposedThing;
}

export declare type PropertyReadHandler = () => Promise<any>;

export declare type PropertyWriteHandler = (value: any) => Promise<void>;

export declare type ActionHandler = (parameters: any) => Promise<any>;