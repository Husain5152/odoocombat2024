/** @odoo-module **/
import publicWidget from 'web.public.widget';
import { cartHandlerMixin } from 'website_sale.utils';
import { WebsiteSale } from 'website_sale.website_sale';
import { _t } from 'web.core';

// publicWidget.registry.AddToCartSnippetSBP = WebsiteSale.extend(cartHandlerMixin, {
    WebsiteSale.include({
        /**
         * @private
        */
        _addToCartInPage(params) {
            var selectedate = $('#slot_date').val();
            var selectedslot = $('input[name="number"]:checked').val();
            if (!selectedate || !selectedslot){
                this.check_select_date_slot()
                params.add_qty = 0
            }

            // Get all the other fields and add it in json
            var carModel = $('#car_model_main').val();
            var manufactureYear = $('#manufacture_year_main').val();
            var licensePlate = $('#license_plate_main').val();
            var wheelLock = $('input[name="wheel_lock"]:checked').val();
            var odometer = $('#odometer_main').val();
            var parts = $('#parts_main').val();

            if (!carModel || !manufactureYear || !licensePlate || !odometer || !parts){
                this.check_service_form_details()
                params.add_qty = 0
            }

            // Create a JSON object with field names and values
            var vehicleData = [
                { name: "Car Model", value: carModel },
                { name: "Manufacture Year", value: manufactureYear },
                { name: "License Plate", value: licensePlate },
                { name: "Wheel Lock", value: wheelLock },
                { name: "Odoometer", value: odometer },
                { name: "Parts", value: parts }
            ];
            // Convert the data array to a JSON string
            var vehical_values = vehicleData;
            var selectedate = $('#slot_date').val();
            var selectedslot = $('input[name="number"]:checked').val();
            params.vehicalvalues = vehical_values
            params.selectedDate = selectedate
            params.selectedTimeSlot = selectedslot
            params.force_create = true;
            return this._rpc({
                route: "/shop/cart/update_json",
                params: params,
            }).then(async data => {
                sessionStorage.setItem('website_sale_cart_quantity', data.cart_quantity);
                if (data.cart_quantity && (data.cart_quantity !== parseInt($(".my_cart_quantity").text()))) {
                    // No animation if the product's page images are hidden
                    if ($('div[data-image_width]').data('image_width') !== 'none') {
                        await animateClone($('header .o_wsale_my_cart').first(), this.$itemImgContainer, 25, 40);
                    }
                    updateCartNavBar(data);
                }
            });
        }, 
        async check_select_date_slot(){
            await this._rpc({
                route: "/check_selected_date_time",
                params: {},
            }).then(async data => {
                return true
            })
        },
        async check_service_form_details(){
            await this._rpc({
                route: "/check_service_form_details",
                params: {},
            }).then(async data => {
                return true
            })
        }
});

function animateClone($cart, $elem, offsetTop, offsetLeft) {
    if (!$cart.length) {
        return Promise.resolve();
    }
    $cart.removeClass('d-none').find('.o_animate_blink').addClass('o_red_highlight o_shadow_animation').delay(500).queue(function () {
        $(this).removeClass("o_shadow_animation").dequeue();
    }).delay(2000).queue(function () {
        $(this).removeClass("o_red_highlight").dequeue();
    });
    return new Promise(function (resolve, reject) {
        if(!$elem) resolve();
        var $imgtodrag = $elem.find('img').eq(0);
        if ($imgtodrag.length) {
            var $imgclone = $imgtodrag.clone()
                .offset({
                    top: $imgtodrag.offset().top,
                    left: $imgtodrag.offset().left
                })
                .removeClass()
                .addClass('o_website_sale_animate')
                .appendTo(document.body)
                .css({
                    // Keep the same size on cloned img.
                    width: $imgtodrag.width(),
                    height: $imgtodrag.height(),
                })
                .animate({
                    top: $cart.offset().top + offsetTop,
                    left: $cart.offset().left + offsetLeft,
                    width: 75,
                    height: 75,
                }, 1000, 'easeInOutExpo');

            $imgclone.animate({
                width: 0,
                height: 0,
            }, function () {
                resolve();
                $(this).detach();
            });
        } else {
            resolve();
        }
    });
}

/**
 * Updates both navbar cart
 * @param {Object} data
 */
function updateCartNavBar(data) {
    $(".my_cart_quantity")
        .parents('li.o_wsale_my_cart').removeClass('d-none').end()
        .addClass('o_mycart_zoom_animation').delay(300)
        .queue(function () {
            $(this)
                .toggleClass('fa fa-warning', !data.cart_quantity)
                .attr('title', data.warning)
                .text(data.cart_quantity || '')
                .removeClass('o_mycart_zoom_animation')
                .dequeue();
        });

    $(".js_cart_lines").first().before(data['website_sale.cart_lines']).end().remove();
    $(".js_cart_summary").replaceWith(data['website_sale.short_cart_summary']);
}

export default publicWidget.registry.AddToCartSnippetSBP;
