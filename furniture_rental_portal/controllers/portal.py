from odoo import fields, http, _
from odoo.exceptions import AccessError, MissingError, ValidationError
from odoo.http import request

from odoo.addons.payment import utils as payment_utils
from odoo.addons.payment.controllers import portal as payment_portal
from odoo.addons.portal.controllers.portal import pager as portal_pager

class CustomerPortal(payment_portal.PaymentPortal):
    # Preparing domain to filter out rental orders
    def _prepare_rental_domain(self, partner):
        return [
            ('message_partner_ids', 'child_of', [partner.commercial_partner_id.id]),
            ('is_rental_order', '=', True)
        ]

    def _prepare_rental_portal_rendering_values(
        self, page=1, date_begin=None, date_end=None, sortby=None, **kwargs
    ):
        RentalOrder = request.env['sale.order']

        if not sortby:
            sortby = 'date'

        partner = request.env.user.partner_id
        values = self._prepare_portal_layout_values()

        url = "/my/rental_orders"
        domain = self._prepare_rental_domain(partner)

        searchbar_sortings = self._get_sale_searchbar_sortings()

        sort_order = searchbar_sortings[sortby]['order']

        if date_begin and date_end:
            domain += [('create_date', '>', date_begin), ('create_date', '<=', date_end)]

        pager_values = portal_pager(
            url=url,
            total=RentalOrder.search_count(domain),
            page=page,
            step=self._items_per_page,
            url_args={'date_begin': date_begin, 'date_end': date_end, 'sortby': sortby},
        )
        orders = RentalOrder.search(domain, order=sort_order, limit=self._items_per_page, offset=pager_values['offset'])

        values.update({
            'date': date_begin,
            'orders': orders,
            'page_name': 'rental',
            'pager': pager_values,
            'default_url': url,
            'searchbar_sortings': searchbar_sortings,
            'sortby': sortby,
        })

        return values

    @http.route(['/my/rental_orders', '/my/rental_orders/page/<int:page>'], type='http', auth="user", website=True)
    def portal_my_rental_orders(self, **kwargs):
        values = self._prepare_rental_portal_rendering_values(**kwargs)
        request.session['my_orders_history'] = values['orders'].ids[:100]
        return request.render("furniture_rental_portal.portal_my_rental_orders", values)

    @http.route(['/update/rental_order_pickup_state'], type='http', auth="user", website=True)
    def update_rental_order_pickup_state(self, **kwargs):
        if kwargs.get('order_id'):
            order_id = request.env["sale.order"].sudo().browse(int(kwargs.get('order_id')))
            order_id.rental_status = 'pickup'
        values = self._prepare_rental_portal_rendering_values(**kwargs)
        request.session['my_orders_history'] = values['orders'].ids[:100]
        return request.render("furniture_rental_portal.portal_my_rental_orders", values)

    @http.route(['/update/rental_order_pickup_state'], type='http', auth="user", website=True)
    def update_rental_order_pickup_state(self, **kwargs):
        if kwargs.get('order_id'):
            order_id = request.env["sale.order"].sudo().browse(int(kwargs.get('order_id')))
            order_id.rental_status = 'pickup'
        return request.redirect('/my/rental_orders')

    @http.route(['/update/rental_order_return_state'], type='http', auth="user", website=True)
    def rental_order_return_state(self, **kwargs):
        if kwargs.get('order_id'):
            order_id = request.env["sale.order"].sudo().browse(int(kwargs.get('order_id')))
            order_id.rental_status = 'return'
        return request.redirect('/my/rental_orders')
        