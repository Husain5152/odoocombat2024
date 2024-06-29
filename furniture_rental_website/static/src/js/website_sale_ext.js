odoo.define("service_based_planning.website_sale", function (require) {
  "use strict";
  var ajax = require("web.ajax");
  var wSaleUtils = require("website_sale.utils");
  var publicWidget = require("web.public.widget");

  publicWidget.registry.AddTimeSlotsToCart = publicWidget.Widget.extend({
    selector: 'form[action="/shop/cart/update"]',
    events: {
      "click #s_website_form_send": "_onClick",
    },
    init: function () {
      this._super.apply(this, arguments);
    },
    start: function () {
      return this._super.apply(this, arguments);
    },
    _onClick: async function (ev) {
      var self = this;
      ev.preventDefault(); // Prevent redirects
      ev.stopPropagation(); // Prevent Original E-commerce Event
      const add_qty_el = $("input[name='add_qty']", self.$el);
      const product_id_el = $("input[name='product_id']", self.$el);
      var timeSlot = $('.time_slots:checked').val();
      var selectedDate = $('#custom_date').val();
      var planning_enabled = $('#planning_enabled').val();

      if (!selectedDate) {
            alert('Please select a date!');
            return;
        }

      if (selectedDate && !timeSlot) {
            alert('Please select a time slot!');
            return;
        }

      await ajax
            .jsonRpc("/shop/cart/update_json", "call", {
              product_id: parseInt(product_id_el.val()),
              add_qty: parseInt(add_qty_el?.val() ?? 1),
              time_slot: timeSlot,
              selected_date: selectedDate
            }).then(function (data) {
              wSaleUtils.updateCartNavBar(data);
              add_qty_el?.val("1");
              var $navButton = $("header .o_wsale_my_cart").first();
              var animation = wSaleUtils.animateClone(
                $navButton,
                $(".oe_product_image", self.$el),
                25,
                40
              );
            });
    },
  });
});