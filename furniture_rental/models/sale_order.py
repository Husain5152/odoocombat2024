from odoo import api, models, fields, _
from datetime import datetime
from odoo.exceptions import ValidationError

class saleOrder(models.Model):
    _inherit = "sale.order"

    is_rental_order = fields.Boolean("Is Renatal Order")
    rental_status = fields.Selection([('orderd', 'Orderd'), ('pickup', 'Pickup'), ('return', 'Retrun')])

class saleOrderLine(models.Model):
    _inherit = "sale.order.line"

    rental_start_date = fields.Date(string='Rental Start Date',default=datetime.now())
    rental_end_date = fields.Date(string="Rental End date",default=datetime.now())

    @api.onchange('rental_start_date','rental_end_date','product_id')
    def _onchange_account_type(self):
        days = 1
        if self.rental_start_date and self.rental_start_date < datetime.now().date():
            raise ValidationError(_("Please select correct start date."))

        if self.rental_end_date and self.rental_end_date < self.rental_start_date:
            raise ValidationError(_("Please select correct end date."))

        if self.rental_start_date and self.rental_end_date:
            days = ((self.rental_end_date - self.rental_start_date).days) + 1

        if days:
            self.price_unit = (days * self.product_id.ranting_rate)
