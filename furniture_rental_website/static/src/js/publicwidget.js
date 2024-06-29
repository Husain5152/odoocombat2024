/** @odoo-module **/
import publicWidget from "@web/legacy/js/public/public_widget";
import { _t } from "@web/core/l10n/translation";

publicWidget.registry.ProductPriceCalculation = publicWidget.Widget.extend({
    selector: '.oe_website_sale',
    events: {
        'change #rental_start_date': '_onChangePriceCalculation',
        'change #rental_end_date': '_onChangePriceCalculation',
        'change a.js_add_cart_json': '_onChangePriceCalculation',
    },
    _onChangePriceCalculation: async function (event) {
        var RentalStartDate = new Date($('#rental_start_date').val())
        var RentalEndDate = new Date($('#rental_end_date').val())
        var ProductQty = $('input[name="add_qty"]').val()

        if(RentalStartDate != 'Invalid Date' && RentalEndDate != 'Invalid Date'){
            var differenceMs = RentalEndDate.getTime() - RentalStartDate.getTime();
            var differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
            var amount = differenceDays * parseFloat($('.oe_price .oe_currency_value').text()) * ProductQty
            $('.oe_price .oe_currency_value').text(amount)
        }
    }
});

export default publicWidget.registry.ProductPriceCalculation;