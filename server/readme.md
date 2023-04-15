# MVC API

## Installation

-  Download the template
-  Run `npm install`
-  Run `npm run start` for prod and `npm run start:dev`

## Usage

The mapping process of a routehandler follows these rules:

- The path of a folder represents a route (e.g. `/items/`).
- Use parameters in square braces (e.g. `/items/[id]/`). The value of the parameter is passed inside the params object of the request.

    ```json
    {
    "id": "value of the parameter" 
    }
    ```

- The filename inside the folder specifies the http-method (e.g. `POST.ts`).
- The default export of the file must be the express callback.

    ```typescript
    import { NextFunction, Request, Response } from 'express';

    export default class extends RouteTemplate {
        public async handle(req: Request, res: Response, next: NextFunction, errorCallback: _throw) {
            try {
                // handle the request here
            } catch (error) {
                errorCallback(error);
            }
        };
    }
    ```

## Example Route Tree

This example shows the mapping of the file tree to the routes and methods

```
controller
│   get.ts # GET /
│
├───404
│       get.ts # GET /404
│
└───items
    │   post.ts # POST /items
    │
    └───[id]
        │   delete.ts # DELETE /items/:id
        │   get.ts # GET /items/:id
        │   patch.ts # PATCH /items/:id
        │
        └───attachments
            │   post.ts # POST /items/:id/attachments
            │
            └───[attachmentid]
                    get.ts # POST /items/:id/attachments/:attachmentid
```

## Secure routes

The decorator ```@auth([/*[SCOPES]*/])``` allows to authenticate a user and secure a route.
    
```typescript
import { NextFunction, Request, Response } from 'express';

export default class extends RouteTemplate {
    @auth(["*", "default"])
    public async handle(req: Request, res: Response, next: NextFunction, errorCallback: _throw) {
        try {
            // handle the request here
        } catch (error) {
            errorCallback(error);
        }
    };
}
```

The user is authenticated if at leaset one scope is present -> if multiple scopes are necessary the decoratores can be stacked on top of each other.

Fill out the required informtaion in [src\decorators\authentication.ts](src\decorators\authentication.ts)

## Register app in Azure

1. Make Azure App Registration
2. Make an API available
3. Add Scope
4. Enter name, description and additional information
5. Set active

## Grant access to api in azure

1. Navigate to the app registration to grant access to the api
2. Api-Permissions
3. Add Permission
4. Custom Api`s
5. select app and scopes
6. Grant access




