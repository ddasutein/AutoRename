## Let's be ONE Library

This library aims to create a common module between the main options page and popup interface.

Module | Description
:--| :--
IO | Handles 
ui | TBD
util | TBD
HyperlinkManager | Manage all hyperlinks for buttons here.
i18n | Retrieves localization files from `_locales` folder
LetsBeOne | Main launcher to execute other modules as well as rendering each settings
RenderElement | There are various sub-functions in this module <br><br> `RenderElement`: Renders input HTML elements like `checkbox` and `select`, as well as `span` <br><br>`ShowNotAvailable`: Generate a "Settings not available for this website" message to the user <br><br> `SetLegacyLocale`: The old method of setting localization in the UI by checking for the `data-i18n` attribute in the HTML. Note, this will be removed in a future release. <br><br> `SetExtensionInfo`: Retrieve the extension name and version 

## Guide

### Mapping Input Field to Settings API

There are two approaches to mapping an input field to the Settings API.

<b>Option 1</b>: Create `setting` object in JSON

This is the standard process for the library. You must add the `setting` object.

Key | Description
:--|:--
website | This is used as a lookup for Settings API
key | Reference to the setting key. You can find this in `/js/Settings.js` or you may simply type `Settings.Load()` in the console to retrieve the list of settings for the extension

<b>Option 2</b>: Add `settings` attribute to input field

For input fields that are not loaded from JSON, you must add the `setting` attribute. Here, you enter the setting key which can be found in `/js/Settings.js` or you may simply type `Settings.Load()` in the console to retrieve the list of settings for the extension



### Add Field Validation

Use the `class` attribute on your input field then add it to the list in `/lib/LetsBeOne/ui/LoadSettings.js`