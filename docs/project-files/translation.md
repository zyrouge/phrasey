# Translation File

## Representation

```ts
interface PhraseyTranslationFile {
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
