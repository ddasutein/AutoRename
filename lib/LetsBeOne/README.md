## Let's be ONE Library

This library aims to create a common module between the main options page and popup interface.

Module | Description
:--| :--
Modules | Contains various sub-functions that can be added to the existing user interface
IO | Handles file management under the Download Queue section in the main options page
ui | User interface functions <br><br>`LoadSettings`: Retrieves settings from the Settings API. Additionally, this is where the field validation occurs for date/time formatting and prefix <br><br>`MessageBox`: Properties for swal library <br><br>`Notification`: This is where the functions are stored for the toast notification when settings are saved in the main options page
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

Example

![image](https://github.com/user-attachments/assets/47d114c8-d9a8-49d1-81ac-716aba370bf3)


<b>Option 2</b>: Add `settings` attribute to input field

For input fields that are not loaded from JSON, you must add the `setting` attribute. Here, you enter the setting key which can be found in `/js/Settings.js` or you may simply type `Settings.Load()` in the console to retrieve the list of settings for the extension

![image](https://github.com/user-attachments/assets/c40f4e32-eeb6-49ea-8c8b-280bc3fb3c2f)

### Add Field Validation

Use the `class` attribute on your input field then add it to the list in `/lib/LetsBeOne/ui/LoadSettings.js`

## Additional Notes

On X, I've made a semi-lengthy post on my inspiration on making this library. Feel free to read my tweet [here](https://x.com/ddasutein/status/1886007353683968406)