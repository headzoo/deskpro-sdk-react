Overview
========
Every DeskPRO app must include a manifest which contains app properties like the title, storage permissions, and interactions with external APIs. The manifest values may be added to the _package.json_ file or a separate _manifest.json_ file.

## manifest.json

The _manifest.json_ must be saved to the app root directory, and should include the following properties.

```json
{
    "version": "2.1.0",
    "appVersion": "1.0.0",
    "name": "App",
    "title": "App Title",
    "description": "App description.",
    "url": "https://github.com/user/app",
    "author": {
        "name": "Author Name",
        "email": "author@app.com",
        "url": "https://github.com/user"
    },
    "isSingle": true,
    "scope": "agent",
    "storage": [
      {
        "name": "settings",
        "isBackendOnly": false,
        "permRead": "EVERYBODY",
        "permWrite": "OWNER"
      }
    ],
    "targets": [
      {
        "target": "ticket-sidebar",
        "url": "html/index.html"
      }
    ],
    "settings": [],
    "deskproApiTags": [],
    "externalApis": []
}
```

#### version
This is the version of the manifest you are using.

#### title
The title of your application which your users will see.

#### isSingle
A boolean flag which determines if the application can be installed multiple times. For now keep this flag to true.

#### scope
Option which determines which DeskPRO module is the target of the application. For now only agent is supported which means your apps will appear only in the agent interface.

#### targets
This is a list of objects defining which HTML file renders the app, and where it be displayed in the agent interface. It may help to think of the main helpdesk as a template with a predefined set of placeholders which can be filled by the app UI.

A target definition is an object with two properties:

* `target` - One of the DeskPRO predefined targets

* `url` - The path to the app HTML file relative to the app root directory

#### storage
This is a white list of storage objects, which define who can access the app storage values. See the [storage documentation](/pages/props/#storage) for more information.

A storage object has the following properties:

* `name` - This is the name of your storage variable

* `isBackendOnly` - This is a flag which control which systems can access your storage variable. If it is false, then your storage variable will be available everywhere. If it is true the variable will only be available to the internal system and it will never be exposed to the outside world

* `permRead` - This option establishes who can read the variable. There are only to values, OWNER and EVERYBODY. OWNER means only the user who created the variable can read, and EVERYBODY means reading is un-restricted

* `permWrite` - This option establishes who can update or delete the variable. There are only to values, OWNER and EVERYBODY. OWNER means only the user who created the variable can write, and EVERYBODY means writing is un-restricted

#### externalApis
This is a white list of url patterns which is used to control which third party API’s your application can access. If you need to an external api, and chances are that you will, make sure it is on this list.

#### deskproApiTags
Keep this as an empty list for now

#### settings
Keep this as an empty list for now.

----

## package.json

The configuration may be added to the _package.json_ file instead of having a separate _manifest.json_. The configuration values must be placed inside the "deskpro" property.

```json
{
  "name": "deskpro-app",
  "version": "1.0.0",
  "description": "App description.",
  "deskpro": {
    "version": "2.1.0",
    "title": "App Title",
    "isSingle": true,
    "scope": "agent",
    "storage": [
      {
        "name": "settings",
        "isBackendOnly": false,
        "permRead": "EVERYBODY",
        "permWrite": "OWNER"
      }
    ],
    "targets": [
      {
        "target": "ticket-sidebar",
        "url": "html/index.html"
      }
    ],
    "settings": [],
    "deskproApiTags": [],
    "externalApis": []
  },
  "dependencies": {
    "@deskproapps/deskproapps-sdk-core": "^1.0.0",
    "deskpro-sdk-react": "^1.0.0",
    "deskpro-components": "^1.0.0"
  }
}
```

The "appVersion", "name", "description", and "author" values may be omitted from the "deskpro" configuration, as they can be determined by reading the rest of the _package.json_ file.
