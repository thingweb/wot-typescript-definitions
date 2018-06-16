import { Observable } from 'rxjs/Observable';

export as namespace WoT;

/**
 * The WoTFactory (usually instantiated as "WoT" object) is the main API entry point
 * and it is exposed by an implementation of the WoT Runtime.
 */
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


    /**
     * Make a request to register td to the given WoT Thing Directory..
     */
    register(directory: USVString, thing: ExposedThing): Promise<void>

    /**
     * Makes a request to unregister the thing from the given WoT Thing Directory. */
    unregister(directory: USVString, thing: ExposedThing): Promise<void>

}

/**
 * WoT provides a unified representation for data exchange between Things, standardized in the Wot Things Description specification.
 * In this version of the API, Thing Descriptions are represented as opaque strings, denoting a serialized form, for instance JSON or JSON-LD
 */
export declare type ThingDescription = USVString;

/** The ThingTemplate dictionary contains properties to initialize a Thing  */
export interface ThingTemplate
// extends SemanticAnnotations
{
    /** The name attribute represents the user given name of the Thing */
    name?: string;

    id?: string;

    description?: string;

    support?: string;

    security?: Security;

    properties?: Array<PropertyInit>; // Set?

    actions?: Array<ActionInit>; // Set?

    events?: Array<EventInit>; // Set?

    links?: Array<WebLink>

    // @context
    // @type

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
    method?: DiscoveryMethod | string; // default value "any",  DOMString
    /**
     * The url property represents additional information for the discovery method, such as the URL of the target entity serving the discovery request, such as a Thing Directory or a Thing.
     */
    url?: USVString;
    /**
     * The query property represents a query string accepted by the implementation, for instance a SPARQL query. 
     */
    query?: USVString;
    /**
     * The template property represents a ThingTemplate dictionary used for matching against discovered Things.
     */
    template?: ThingTemplate;
}

/** The DiscoveryMethod enumeration represents the discovery type to be used */
export declare enum DiscoveryMethod {
    /** does not provide any restriction */
    "any",
    /** for discovering Things defined in the same device */
    "local",
    /** for discovery based on a service provided by a directory or repository of Things  */
    "directory",
    /** for discovering Things in the device's network by using a supported multicast protocol  */
    "multicast"
}

export interface Security {
    scheme: string;
    in?: any;
}

export interface Link {
    href: USVString;
    mediaType?: USVString;
    rel?: USVString;

}

export interface WebLink extends Link {
    anchor?: USVString;
}

export interface Form extends Link {
    security?: Security;
}


export declare enum DataType {
    boolean = "boolean",
    number = "number",
    integer = "integer",
    string = "string",
    object = "object",
    array = "array",
    null = "null"
}

export interface DataSchema {
    type: string;
    description?: string;
    const?: boolean;
}

export class BooleanSchema implements DataSchema {
    type: "boolean";
}

export class IntegerSchema implements DataSchema {
    type: "integer";
    minimium?: number;
    maximimum?: number;
}

export class NumberSchema implements DataSchema {
    type: "number";
    minimium?: number;
    maximimum?: number;
}

export class StringSchema implements DataSchema {
    type: "string";
    enum?: Array<string>;
}

export class ObjectSchema implements DataSchema {
    type: "object";
    properties?: Map<string, DataSchema>;
    required?: Array<string>;
}

export class ArraySchema implements DataSchema {
    type: "array";
    items?: DataSchema;
    minItems?: number;
    maxItems?: number;
}

export class NullSchema implements DataSchema {
    type: "null";
}

/**
 * The Interaction interface is an abstract class to represent Thing interactions: Properties, Actions and Events.
 */
export interface Interaction
// implements Observable
{
    label?: string;
    description?: string;

    forms?: Array<Form>;
    links?: Array<Link>;
}

/** Represents the Thing Property description.  */
export interface ThingProperty extends Interaction, PropertyInit
// Observable
{
    // getter for PropertyInit properties
    // XXX causes conflicts with "other" get
    // get(name: string): any;

    // get and set interface for the Property
    get(): Promise<any>;
    set(value: any): Promise<void>;
}

export interface ThingAction extends Interaction {
    input?: DataSchema;
    output?: DataSchema;
    run(parameter?: any): Promise<any>;
}

export interface ThingEvent extends ThingProperty {

}

// XXX could we inherit Interaction (Typescript difference of FrozenArray and sequence)
export interface InteractionInit {
    label?: string;
    description?: string;
}

export interface PropertyInit extends InteractionInit, DataSchema {
    writable?: boolean;
    observable?: boolean;
    value?: any;
}

export interface ActionInit extends InteractionInit {
    input?: DataSchema;
    output?: DataSchema;
}

export declare type EventInit = PropertyInit;

export interface Thing {

    /** collection of string-based keys that reference values of any type */
    [key: string]: any; /* e.g., @context besides the one that are explitecly defined below */
    
    id: string;
    name: string;
    description: string;

    base?: string;

    // properties: Map<string, ThingProperty>;
    properties: {
        [key: string]: ThingProperty
    };

    // actions: Map<string, ThingAction>;
    actions: {
        [key: string]: ThingAction;
    }

    // events: Map<string, ThingEvent>;
    events: {
        [key: string]: ThingEvent;
    }

    links: Array<WebLink>;
}


/** The ConsumedThing interface is a client API for sending requests to servers in order to retrieve or update properties, invoke Actions, and observe properties, Actions and Events. */
export interface ConsumedThing extends Thing
// extends/implements Observable
{
    // getter for ThingTemplate properties
    get(name: string): any;
}

export interface ExposedThing extends ConsumedThing {

    // setter for ThingTemplate properties
    set(name: string, value: any): void;


    // define how to expose and run the Thing
    /** Start serving external requests for the Thing.  */
    expose(): Promise<void>

    /** Stop serving external requests for the Thing.  */
    destroy(): Promise<void>

    /** Emits an the event initialized with the event name specified by the eventName argument and data specified by the payload argument.  */
    emitEvent(eventName: string, payload: any): Promise<void>


    // define Thing Description modifiers

    /**
     * Adds a Property defined by the argument and updates the Thing Description
     */
    addProperty(name: string, property: PropertyInit): ExposedThing

    /**
     * Removes the Property specified by the name argument, updates the Thing Description and returns the object. 
     */
    removeProperty(name: string): ExposedThing

    /**
     * Adds an Action to the Thing object as defined by the action argument of type ThingActionInit and updates the Thing Description. 
     */
    addAction(name: string, action: ActionInit): ExposedThing

    /**
     * Removes the Action specified by the name argument, updates the Thing Description and returns the object. 
     */
    removeAction(name: string): ExposedThing

    /**
     * Adds an event to the Thing object as defined by the event argument of type ThingEventInit and updates the Thing Description. 
     */
    addEvent(name: string, event: EventInit): ExposedThing

    /**
     * Removes the event specified by the name argument, updates the Thing Description and returns the object. 
     */
    removeEvent(name: string): ExposedThing

    // define request handlers

    /**
     * Takes a propertyName as string argument, and a readHandler argument of type PropertyReadHandler. Sets the handler function for reading the specified Property matched by propertyName if propertyName is specified, otherwise sets it for reading any property. Throws on error. Returns a reference to the same object for supporting chaining. 
     * 
     * @param propertyName 
     * @param readHandler 
     */
    setPropertyReadHandler(propertyName: string, readHandler: PropertyReadHandler): ExposedThing;

    /**
     * Takes a propertyName as string argument, and a writeHandler argument of type PropertyWriteHandler. Sets the handler function for writing the specified Property matched by propertyName if the propertyName is specified, otherwise sets it for writing any properties. Throws on error. Returns a reference to the same object for supporting chaining. 
     * 
     * @param propertyName 
     * @param write 
     */
    setPropertyWriteHandler(propertyName: string, writeHandler: PropertyWriteHandler): ExposedThing;

    /**
     * Takes a actionName as string argument, and an action argument of type ActionHandler. Sets the handler function for the specified Action matched by actionName if actionName is specified, otherwise sets it for any action. Throws on error. Returns a reference to the same object for supporting chaining. 
     * 
     * @param actionName 
     * @param action 
     */
    setActionHandler(actionName: string, action: ActionHandler, ): ExposedThing;
}

export declare type PropertyReadHandler = () => Promise<any>;

export declare type PropertyWriteHandler = (value: any) => Promise<void>;

export declare type ActionHandler = (parameters: any) => Promise<any>;