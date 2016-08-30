/// <reference path="../typings/modules/es6-promise/index.d.ts" />

import {Promise} from 'es6-promise';

interface WoTFactory {
    consumeDescriptionUri(uri: String): Promise<ConsumedThing>
    createThing(name: String): Promise<ExposedThing>
    createFromDescriptionUri(uri: String): Promise<ExposedThing>
}

interface ConsumedThing {

}

interface ExposedThing {

}

interface DynamicThing {

}

declare var WoT : WoTFactory;