# Schema File

The schema file defines the structure of a [translation file](./translation.md).

## Representation

```ts
interface PhraseySchema {
    keys: {
        name: string;
        description?: string;
        parameters?: string[];
    }[];
}
```

## Example

```yaml
keys:
    - name: HelloThere
      description: Represents a "Hello!" message.

    - name: HowAreYou
      description: Represents a "How are you?" message.

    - name: ThankYou
      description: Represents a "Thank you!" message.

    - name: HelloX
      description: Say "Hello" to an user.
      parameters: [user]
```
