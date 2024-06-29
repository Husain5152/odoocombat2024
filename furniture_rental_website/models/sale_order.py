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