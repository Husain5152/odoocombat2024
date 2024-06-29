from odoo import api, models, fields, _

class saleOrder(models.Model):
    _inherit = "sale.order"

    is_rental_order = fields.Boolean("Is Renatal Order")
    rental_start_date = fields.Date(string='Rental Start Date')
    rental_end_date = fields.Date(string="Renal End date")
    rental_status = fields.Selection([('orderd', 'Orderd'), ('pickup', 'Pickup'), ('return', 'Retrun')])