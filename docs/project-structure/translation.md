# Translation File

The translation file consists the actual translation strings.

If `input.default` is specified in the [configuration file](./configuration.md), any files other than the default file can omit keys. Omitted keys would use the values from the default file.

## Representation

```ts
interface PhraseyZTranslationType {
    locale: string;
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
