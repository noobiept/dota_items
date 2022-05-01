/**
 * Get data from the `localStorage`.
 */
export function getData( keys )
    {
        var objects = {};

        for (var a = 0 ; a < keys.length ; a++)
            {
            var key = keys[ a ];
            var value = localStorage.getItem( key );

            objects[ key ] = value && JSON.parse( value );
            }

    return objects;
    };


/**
 * Set data into the `localStorage`.
 */
export function setData( items )
    {
    for ( var key in items )
        {
        if ( items.hasOwnProperty( key ) )
            {
            localStorage.setItem( key, JSON.stringify( items[ key ] ) );
            }
        }
    };


/**
 * Uses the `chrome storage` if it's available (when running as a chrome app), otherwise uses the `localStorage`.
 */
export function removeData( items )
    {
        for ( var key in items )
        {
        if ( items.hasOwnProperty( key ) )
            {
            localStorage.removeItem( key );
            }
        }
    };
