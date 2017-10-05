LinkButton
==========
A button which dispatches to a route location when clicked.

## Props

```jsx
<LinkButton
    to={string}
    params={object}
/>
```

## Examples

```jsx
<LinkButton to="settings">
    Click
</LinkButton>
<LinkButton to="settings" params={{ country: 'uk' }}>
    Click
</LinkButton>
```
