/**
* DevExtreme (file_management/error.d.ts)
* Version: 24.1.3
* Build date: Tue Jun 11 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
*/
import FileSystemItem from './file_system_item';

/**
 * An object that contains information about the error.
 */
export default class FileSystemError {
   constructor(errorCode?: number, fileSystemItem?: FileSystemItem, errorText?: string);
    /**
     * The processed file or directory.
     */
    fileSystemItem?: FileSystemItem;

    /**
     * The error code.
     */
    errorCode?: number;

    /**
      * The error message.
      */
     errorText?: string;
}
