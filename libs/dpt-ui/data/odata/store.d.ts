/**
* DevExtreme (data/odata/store.d.ts)
* Version: 24.1.3
* Build date: Tue Jun 11 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
*/
import { DxPromise } from '../../core/utils/deferred';
import Store, { Options as StoreOptions } from '../abstract_store';
import { Query } from '../query';
import { ODataRequestOptions } from './context';

export type Options<
    TItem = any,
    TKey = any,
> = ODataStoreOptions<TItem, TKey>;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.dpt-ext-ui.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface ODataStoreOptions<
    TItem = any,
    TKey = any,
> extends StoreOptions<TItem, TKey> {
    /**
     * Specifies a function that customizes the request before it is sent to the server.
     */
    beforeSend?: ((options: { url: string; async: boolean; method: string; timeout: number; params: any; payload: any; headers: any }) => void);
    /**
     * Specifies whether the store serializes/parses date-time values.
     */
    deserializeDates?: boolean;
    /**
     * Specifies a function that is executed when the ODataStore throws an error.
     */
    errorHandler?: ((e: { httpStatus: number; errorDetails: any; requestOptions: ODataRequestOptions }) => void);
    /**
     * Specifies the data field types. Accepts the following types: &apos;String&apos;, &apos;Int32&apos;, &apos;Int64&apos;, &apos;Boolean&apos;, &apos;Single&apos;, &apos;Decimal&apos; and &apos;Guid&apos;.
     */
    fieldTypes?: any;
    /**
     * Specifies whether to convert string values to lowercase in filter and search requests. Applies to the following operations: &apos;startswith&apos;, &apos;endswith&apos;, &apos;contains&apos;, and &apos;notcontains&apos;.
     */
    filterToLower?: boolean;
    /**
     * Specifies whether data should be sent using JSONP.
     */
    jsonp?: boolean;
    /**
     * Specifies the type of the key property or properties.
     */
    keyType?: 'String' | 'Int32' | 'Int64' | 'Guid' | 'Boolean' | 'Single' | 'Decimal' | any;
    /**
     * Specifies the URL of an OData entity collection.
     */
    url?: string;
    /**
     * Specifies the OData version.
     */
    version?: number;
    /**
     * Specifies whether to send cookies, authorization headers, and client certificates in a cross-origin request.
     */
    withCredentials?: boolean;
}

/**
 * The ODataStore is a store that provides an interface for loading and editing data from an individual OData entity collection and handling related events.
 */
export default class ODataStore<
    TItem = any,
    TKey = any,
> extends Store<TItem, TKey> {
    constructor(options?: Options<TItem, TKey>);
    /**
     * Gets an entity with a specific key.
     */
    byKey(key: TKey, extraOptions?: { expand?: string | Array<string>; select?: string | Array<string> }): DxPromise<TItem>;
    /**
     * Creates a Query for the OData endpoint.
     */
    createQuery(loadOptions?: { expand?: string | Array<string>; requireTotalCount?: boolean; customQueryParams?: any }): Query;
}
