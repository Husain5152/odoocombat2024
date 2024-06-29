{
    'name': 'Furniture Rental Portal',
    'version': '1.0',
    'summary': 'A module to manage furniture rental portal.',
    'category': 'Rental',
    'author': 'Husain/Vrajesh/Masoom',
    'depends': ['base', 'product' ,'portal', 'sale', 'furniture_rental'],
    'data': [
        'views/template.xml',
        'views/sale_order_view.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            'furniture_rental_portal/static/src/js/public_widget.js',
        ],
    },
    'application': True,
}