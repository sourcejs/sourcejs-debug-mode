# Debug mode

Debug mode - Sourcejs plugin for linting front-end code and debugging spec pages.

Documentation at [Sourcejs.com](http://sourcejs.com/docs/plugins/debugmode-en/index.html).

## How to install

Clone this repo to your plugins dir in installed Source.js and run:

    volo add
    
This will add all dependencies. Now read [documentation](http://sourcejs.com/docs/plugins/debugmode-en/index.html) and use Debug mode.

## How to develop

If you want to develop this plugin, you can edit all files except dm.js - this file is generated. To genereate this file you can run:

    grunt runReplace
    
or if you want to run generation after every changes in source files run:

    grunt runWatch
