# -*- coding: utf-8 -*-
from odoo import _, _lt, SUPERUSER_ID, api, fields, models, tools


class SaleOrder(models.Model):
    _inherit = "sale.order"

    def _cart_update_order_line(self, product_id, quantity, order_line, **kwargs):
        res = super()._cart_update_order_line(product_id=product_id, quantity=quantity, order_line=order_line, **kwargs)
        res['rental_start_date'] = kwargs.get('rental_start_date')
        res['rental_end_date'] = kwargs.get('rental_end_date')
        return res

    # def _cart_update_order_line(self, product_id, quantity, order_line, **kwargs):
    #     res = super()._cart_update_order_line(product_id=product_id, quantity=quantity, order_line=order_line, **kwargs)
    #     order_line['rental_start_date'] = kwargs.get('rental_start_date')
    #     order_line['rental_end_date'] = kwargs.get('rental_end_date')
    #     return res

class SaleOrderLine(models.Model):
    _inherit = "sale.order.line"

    @api.depends('product_id', 'product_uom', 'product_uom_qty')
    def _compute_price_unit(self):
        super(SaleOrderLine, self)._compute_price_unit()
        for line in self:
            print(line.order_id.is_rental_order, line.product_uom_qty,"testing ===============")
            print(line.rental_end_date, ((line.rental_end_date - line.rental_start_date).days + 1),"end date ==============")
            print(line.rental_start_date, line.product_id.list_price,"start date ==============")
            if line.order_id.is_rental_order and line.rental_end_date and line.rental_start_date:
                line.price_unit = (line.product_uom_qty or 1) * line.product_id.list_price * ((line.rental_end_date - line.rental_start_date).days + 1)