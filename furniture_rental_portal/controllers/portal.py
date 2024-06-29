from odoo import fields, http, _
from odoo.exceptions import AccessError, MissingError, ValidationError
from odoo.http import request

from odoo.addons.payment import utils as payment_utils
from odoo.addons.payment.controllers import portal as payment_portal
from odoo.addons.website_sale.controllers import main as WesbiteSale
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
            # Creating return picking
            for picking in order_id.picking_ids.filtered(lambda picking : picking.picking_type_id.code == 'outgoing'):
                return_picking = picking.sudo().copy()
                return_picking.sudo().location_id = picking.location_dest_id.id
                return_picking.sudo().location_dest_id = picking.location_id.id
                return_picking.sudo().picking_type_id = request.env.ref("stock.picking_type_in").sudo().id

                for line in return_picking.sudo().move_ids_without_package:
                    location_id = line.location_dest_id.id
                    location_dest_id = line.location_id.id
                    line.location_id = location_id
                    line.location_dest_id = location_dest_id

        return request.redirect('/my/rental_orders')
        

class WesbiteSaleNew(WesbiteSale.WebsiteSale):
    @http.route(['/shop/confirmation'], type='http', auth="public", website=True, sitemap=False)
    def shop_payment_confirmation(self, **post):
        """ End of checkout process controller. Confirmation is basically seing
        the status of a sale.order. State at this point :

         - should not have any context / session info: clean them
         - take a sale.order id, because we request a sale.order and are not
           session dependant anymore
        """
        sale_order_id = request.session.get('sale_last_order_id')
        if sale_order_id:
            order = request.env['sale.order'].sudo().browse(sale_order_id)
            if order.is_rental_order:
                order.rental_status = 'orderd'
            values = self._prepare_shop_payment_confirmation_values(order)
            return request.render("website_sale.confirmation", values)
        else:
            return request.redirect('/shop')