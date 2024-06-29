from odoo import api, models, fields, _
from datetime import datetime
from odoo.exceptions import ValidationError

class ResUsersInherite(models.Model):
    _inherit = "res.users"

    total_orders = fields.Integer(string="Total Orders",compute="_compute_dashboard_data")
    total_pickup_orders = fields.Integer(string="Total Orders",compute="_compute_dashboard_data")
    total_return_orders = fields.Integer(string="Total Orders",compute="_compute_dashboard_data")
    dashboard_data_filter = fields.Selection([
            ('today','Today'),
            ('week','This Week'),
            ('month','This Month'),
            ('year','This Year'),
            ('all','All'),
        ], "Dashboard Filter Type", default="today")

    @api.depends('dashboard_data_filter')
    def _compute_dashboard_data(self):
        #Patients
        Order = self.env['sale.order']
        
        # For Total Rental Sale Order
        order_domain = [('is_rental_order','=',True)]
        self.total_orders = Order.search_count(order_domain)

        # For Total Rental Picked Sale Order
        order_domain = [('is_rental_order','=',True),('rental_status','=','pickup')]
        self.total_pickup_orders = Order.search_count(order_domain)

        # For Total Rental Return Sale Order
        order_domain = [('is_rental_order','=',True),('rental_status','=','return')]
        self.total_return_orders = Order.search_count(order_domain)


    def open_total_orders(self):
        action = self.env.ref('furniture_rental.action_rental_orders').read()[0]
        action['domain'] = [('is_rental_order','=',True)]
        return action

    def open_total_picked_orders(self):
        action = self.env.ref('furniture_rental.action_rental_orders').read()[0]
        action['domain'] = [('is_rental_order','=',True),('rental_status','=','pickup')]
        return action

    def open_total_return_orders(self):
        action = self.env.ref('furniture_rental.action_rental_orders').read()[0]
        action['domain'] = [('is_rental_order','=',True),('rental_status','=','return')]
        return action

    def today_data(self):
        self.sudo().dashboard_data_filter = 'today'

    def week_data(self):
        self.sudo().dashboard_data_filter = 'week'

    def month_data(self):
        self.sudo().dashboard_data_filter = 'month'

    def year_data(self):
        self.sudo().dashboard_data_filter = 'year'

    def all_data(self):
        self.sudo().dashboard_data_filter = 'all'