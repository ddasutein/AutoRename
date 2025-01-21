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