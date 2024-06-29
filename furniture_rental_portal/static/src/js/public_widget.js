/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";
import { _t } from "@web/core/l10n/translation";

publicWidget.registry.UpdateRentalOrder = publicWidget.Widget.extend({
    events: {
        'click #pickup_button_id': '_onClickPickupButton',
    },
    _onClickPickupButton: async function (event) {
        console.log("called")
    }
});

export default publicWidget.registry.UpdateRentalOrder;
