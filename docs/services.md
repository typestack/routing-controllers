# Services and Dependency Injection

* What is Service? 
* What is Dependency Injection?

## What is Service?

Service is a single instance of the class which can be used across the application without.
Having a single instance of the class is useful when you want to use the same static functionality across your application
without having to initialize a class instance each time. 

For example, let's say you have a basic password encryption functionality.
You can implement it as follows:

```typescript
export function encrypt(password: string): string {
    return sha512(password);
}
```

And use it this way:

```typescript
import {JsonController, Post, Body} from "routing-controllers";
import {User} from "../entity/User";
import {encrypt} from "../functions/encrypt";

@JsonController()
export class UserController {
    
    @Post("/users")
    save(@Body() user: User) {
        user.password = encrypt(user.password);
    }
    
}
```

What is wrong with such approach? Nothing. 
It's pretty natural way of doing things in JavaScript.
But what if your encryption logic is getting bigger?
Your `encrypt` function will become bigger and you may think to create a class called `PasswordEcryptor` to make things more organized:
 
```typescript
export class PasswordEncryptor {
    
    encrypt(password: string): string {
        // ...
    }
    
    // other complex methods of encryption logic 
    
}
```

Then you'll use it this way:

```typescript
import {JsonController, Post, Body} from "routing-controllers";
import {User} from "../entity/User";
import {PasswordEncryptor} from "../services/PasswordEncryptor";

@JsonController()
export class UserController {
    
    @Post("/users")
    save(@Body() user: User) {
        const passwordEncryptor = new PasswordEncryptor();
        user.password = passwordEncryptor.encrypt(user.password);
    }
    
}
```

What is wrong with this approach? Still nothing

Services can be injected in your classes using dependency injection container.

Let's say you have a 

Routing-controllers uses [TypeDI](https://github.com/typestack/typedi) as dependency injection container.
You can learn more about it features in the TypeDI documentation.