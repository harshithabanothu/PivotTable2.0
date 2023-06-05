# How to embed Synopsis on page

1. Make sure your HTML file has `<!DOCTYPE html>` tag in the first line. Without it the styles of Synopsis will be broken.
2. Copy `images` and `fonts` directories from `Synopsis` to the same place as your html file, where you will be embedding grid
3. Load the JavaScript and CSS `synopsis` files in following order:

```html
<script src="./Synopsis/js/synopsis.js"></script>
<link href="./Synopsis/css/synopsis.css" rel="stylesheet">
```

4. Prepare synopsis configuration by calling:

```javascript
window.synConfig.init({
    heirarchy: heirarchy, //in JSON format
    data: data //in JSON format
});
```

5. Prepare element to embed Synopsis into it:

```html
<div id="root"></div>
```

6. Render Synopsis using render method:

```javascript
window.synConfig.render();
```

