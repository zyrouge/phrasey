# Translation File

The translation file consists the actual translation strings.

The `fallback` and `input.fallback` in the [configuration file](./configuration.md) are used to specify the fallback translation files from which omitted keys will be copied from. This can be omitted entirely if you require every translation file to be absolutely complete.

## Representation

```ts
interface PhraseyZTranslationType {
    locale: string;
    fallback: string | string[];
    extras?: Map<string, any>;
    keys: Record<string, string>;
}
```

## Example

```yaml
locale: en

keys:
    HelloThere: Hello There!
    HowAreYou: How are you?
    ThankYou: Thank You
    HelloX: Hello, {user}!
```
