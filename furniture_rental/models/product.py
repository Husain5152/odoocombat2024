from odoo import api, models, fields, _

class ProductTemplate(models.Model):
    _inherit = "product.template"

    is_rental = fields.Boolean(
        string="Can be Rented",
        help="Allow renting of this product.")
    
    ranting_rate = fields.Monetary(string="Rate(Daily)", currency_field='currency_id',default=1)