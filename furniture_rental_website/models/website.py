# -*- coding: utf-8 -*-
from odoo import _, _lt, SUPERUSER_ID, api, fields, models, tools


class Website(models.Model):
    _inherit = 'website'

    def _product_domain(self):
        return [('is_rental', '=', True)]